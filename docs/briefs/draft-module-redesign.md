# Brief: Draft Module Redesign (Full-Page Draft / Scouting / History)

## Approach
Replace the mid-turn `DraftModal` with a single persistent sidebar entry that routes to one of three new pages (`draft`, `draftScouting`, `draftHistory`), each rendering a shared top tab bar. Pick one PageId per tab (not a single shared tab page) so the existing PageId registry pattern keeps doing the work — switching tabs is just `onNavigate(id)`, no internal tab-state plumbing. Persist a new `GameState.draftHistory` array that the engine appends to as picks are made (CPU branch in `runPhase_2_1_1_Draft` and player branch in `playerDraftPick`), letting History show every prior year not just the most recent. Auto-navigation uses a transient React ref in the `Shell` keyed on `phaseId + year + (draftRoundOrder.length > 0)` rather than a new persisted flag: this avoids a save-state field for a UX concern and naturally satisfies the "once per entry" rule. The CPU's existing scoring path (PV + ideology lane bonus + 1772 `eligibleIdeologies` constraint) is factored into a reusable `pickBestForFaction(snap, factionId)` helper so "To end of draft" auto-picks for the player using the same rule. Rejected alternative: persisting `pendingDraftAutoNav` on `GameState` — adds a save-state field that exists purely to drive a single component effect, and we'd have to reset it from the consumer; a ref-keyed effect is leaner.

## State & type changes
- `src/types.ts`:
  - Add `DraftHistoryPick` and `DraftHistoryYear` interfaces and the optional `draftHistory?: DraftHistoryYear[]` field on `GameState`:
    ```ts
    export interface DraftHistoryPick {
      pickNumber: number;   // 1-indexed overall pick
      round: number;        // 1-indexed round
      factionId: string;
      politicianId: string;
    }
    export interface DraftHistoryYear {
      year: number;
      picks: DraftHistoryPick[];
    }
    ```
  - Optional field on `GameState`: `draftHistory?: DraftHistoryYear[];` placed near `lastDraftYear`. Optional so legacy saves load cleanly; `repair` populates it.
- Save/migration: existing IndexedDB saves still load. `repair` detects `draftHistory == null` and reconstructs entries from `politicians[].draftedYear` + `politicians[].factionId`, grouping by year, sorting members within a year by `pvCache` desc as best-effort round/pickNumber assignment (true pick order is unrecoverable for legacy saves). The repaired snapshot is persisted on first load (existing `if (repaired !== snap) await saveSnapshot(repaired)` path already handles this).
- No new PageId in `Modal`. The `{ type: 'draft'; pool: Politician[] }` variant is removed from the `Modal` union in `GameContext.tsx`.

## Engine changes (pure logic)
- `src/engine/phaseRunners.ts`:
  - Extract a `pickBestForFaction(snap, factionId): Politician | null` helper that mirrors the existing CPU scoring at lines 168–184 (PV + 25 ideology-lane bonus + 50 `eligibleIdeologies` bonus when 1772-expansion). Both the CPU loop and the new sim helpers (and the "To end of draft" auto-pick path) call into this — single source of truth.
  - Extract a `recordDraftPick(snap, factionId, politicianId)` helper that performs the shared side effects: set `factionId`/`partyId`/`draftedYear`, shift `draftRoundOrder`, remove from `pendingDraftPool`, log the line, and append a `DraftHistoryPick` to `snap.game.draftHistory` (find-or-create the current year's entry; `pickNumber` = `picks.length + 1` within that year; `round` = `ceil(pickNumber / factionCount)`). Both the CPU loop in `runPhase_2_1_1_Draft` (currently lines 184–190) and `playerDraftPick` (lines 199–211) call it. This guarantees identical recording across both branches and keeps `pickNumber` monotonically correct because order matters: each branch shifts the same `draftRoundOrder` queue.
  - Add `simOneDraftPick(snap): { needsPlayer: boolean }` exported helper. It runs the next iteration of the existing CPU loop in `runPhase_2_1_1_Draft`: if the head of `draftRoundOrder` is the player, returns `{ needsPlayer: true }` without picking; otherwise calls `pickBestForFaction` + `recordDraftPick` for the head and returns `{ needsPlayer: false }`. If the eligible pool is empty, drains `draftRoundOrder` (mirroring lines 154–162) and returns `{ needsPlayer: false }`.
  - Add `autoPickForPlayer(snap)` — a thin variant of `simOneDraftPick` that ignores the `isPlayer` check and uses `pickBestForFaction` for whoever is on the clock. Used by the "To end of draft" confirm path. Deterministic via `src/rng.ts`; no `Math.random` used in either helper.
- `src/engine/engine.ts`: unchanged. The `runCurrentPhase` switch for `2.1.1` still returns `{ needsPlayerInput: 'draft', payload: draftPool }` — the shell now consumes that signal as a navigation trigger rather than a modal trigger (see below).
- PV / election impact: none. `recordDraftPick` performs the same mutations the existing branches did; `pickBestForFaction` is a pure refactor of existing code. Round/pick numbering is a UI annotation, not gameplay.

## UI changes
- New page `src/pages/Draft.tsx` (live draft) — renders the shared `DraftTabs` header. Reads `snapshot.game.pendingDraftPool`, `draftRoundOrder`, `playerFactionId`. Pool table on left (search by name/state; sortable columns; default PV desc; one row per id in `pendingDraftPool`; "Draft" button per row enabled iff `draftRoundOrder[0] === playerFactionId`). Results table on right (one row per slot; filled rows render the corresponding `DraftHistoryPick` for the current year; unfilled rows show `factionId` from `draftRoundOrder[offset]` with a "Sim to pick" button that loops `simOneDraftPick` until that slot is the next one to fill). Status header derives current pick (`draftHistoryForThisYear.length + 1`), current round, on-the-clock faction, next-up faction, and player position from `draftRoundOrder`. Sim controls: "Sim one pick" → one `simOneDraftPick`; "To my next pick" → loop `simOneDraftPick` until `needsPlayer` true or `draftRoundOrder` empty; "To end of draft" → confirm dialog, then loop `simOneDraftPick`/`autoPickForPlayer` until empty. Empty-pool fallback shows the "Continue" button calling `advance()`; same as today's modal fallback.
- New page `src/pages/DraftScouting.tsx` — renders `DraftTabs`. Window of 3 upcoming draft years derived from `snapshot.game.year` (next multiple of 4 strictly greater than current year; Prev/Next steps by 4; lower bound = next draft year ≥ current `year+1`, upper bound = max `draftYear` in source set). For each year column: filter `STANDARD_DRAFT_CLASSES` (overlaid with `game.customDraftClasses` by `firstName+lastName+draftYear` — custom wins) by `draftYear`, render the candidate table. Candidates whose `state` is not in `snapshot.states.map(s=>s.id)` are greyed + "Not yet admitted" badge. Projected PV uses a new helper `computeProjectedPV(d: ImportedDraftee): number` (see below). Per-column "Export class" button downloads visible candidates as JSON via a Blob link.
- New page `src/pages/DraftHistory.tsx` — renders `DraftTabs`. Header with prev/next year buttons + "Jump to year" dropdown over `snapshot.game.draftHistory.map(h=>h.year)`. Summary strip computed from the selected `DraftHistoryYear` and the current politicians (look up each `politicianId`): First pick (lowest `pickNumber`), Highest current PV, Presidents from class (members with `currentOffice?.type === 'President'` OR appearing in any `ElectionResult` with `type === 'presidential'` as winner — second clause is best-effort), Cabinet members (members with `currentOffice?.type` in the cabinet position set), Deceased (`deathYear` set). Main table: one row per pick; "At Draft" cols read the `DraftHistoryPick` and a snapshot of fields from the politician (Age at draft = `politician.age - (snap.game.year - year)` clamped ≥ 0; PV at draft = recompute on a transient `currentOffice: null` shape via `computePV` — keeps numbers consistent with Scouting). "Current" cols read live `politician.pvCache`, `currentOffice`, status. "Career" col uses an inline `OFFICE_PRESTIGE`-equivalent lookup (export `OFFICE_PRESTIGE` from `src/pv.ts` to share — already declared there but un-exported). Picks made by `playerFactionId` get the existing emerald row accent from `DraftSummary`. "Export class" button downloads as JSON. Empty state: "No drafts have been held yet."
- New shared component `src/components/DraftTabs.tsx` — three `<button>` tabs (`Draft`, `Draft Scouting`, `Draft History`), accepts `current: PageId` and renders link buttons that call into a navigation callback. Tabs read game state via `useGame()` to determine if the Draft tab is disabled (phase !== `'2.1.1'` OR `pendingDraftPool.length === 0`); shows tooltip via `title="No draft in progress"`. Renders at the top of every Draft-family page.
- `src/App.tsx`:
  - Replace the `lastDraftYear`-based auto-nav effect (lines 14–28) with one keyed on `snapshot?.game.phaseId`, `snapshot?.game.year`, and `snapshot?.game.draftRoundOrder.length > 0`. The effect computes "is a draft entry happening now" = (`phaseId === '2.1.1' && pendingDraftPool.length > 0 && draftRoundOrder.length > 0`). A ref tracks the last entry-key (`${year}:${phaseId}`); when the predicate is true and the key differs from the ref, set `page` to `'draft'` and update the ref. When the predicate is false, clear the ref so a subsequent re-entry triggers again. This is what "once per draft entry" means: leaving and coming back during the *same* draft does not yank you; the next year's draft does.
  - Remove the `<DraftModal>` render at line 56 and its import.
- `src/state/GameContext.tsx`:
  - Drop the `{ type: 'draft'; pool: Politician[] }` variant from the `Modal` union (line 15). The `advance()` and `draftPick()` callbacks no longer set `modal: 'draft'`. When `runCurrentPhase` returns `needsPlayerInput: 'draft'`, just persist the snapshot and let the shell observe the new state and navigate — no modal state change needed.
  - `draftPick`: after `playerDraftPick(draft, politicianId)`, re-run `runCurrentPhase(draft)` to advance any subsequent CPU picks (today's behavior at lines 169–179). If `result.needsPlayerInput === 'draft'`, leave snapshot as-is (still on the clock for the player's next pick); the Draft page just re-reads from snapshot. Drop the `setModal` lines.
  - Extend `repair()` (lines 75–93): after the existing draftedYear backfill, if `s.game.draftHistory == null`, build it from `s.politicians`: group by `draftedYear`, sort each group by `pvCache` desc, assign `pickNumber = 1..N` within year, `round = ceil(pickNumber / factionCount)`. Set `s.game.draftHistory = years.sort((a,b)=>a.year-b.year)`. Mark dirty.
- `src/components/Sidebar.tsx`: replace the conditional `draftSummary` entry at line 36 with an unconditional `{ id: 'draft' as const, label: 'Draft' }` in the same "Your Faction" section. No gating on `lastDraftYear` — the Draft entry is always present, per acceptance criteria.
- `src/pages/registry.ts`: remove `draftSummary` from the `PageId` union (line 49) and the registry (line 75) and drop the `DraftSummary` import. Add `draft`, `draftScouting`, `draftHistory` to both. Drop `src/pages/DraftSummary.tsx`.
- `src/pv.ts`: export `OFFICE_PRESTIGE` so the History "Career" column can look up the highest-prestige current office. No behavior change.
- New helper file `src/pages/draftScoutingHelpers.ts` (small, page-local): exports `computeProjectedPV(d: ImportedDraftee): number` that builds a transient `Politician`-shaped object — `currentOffice: null`, `factionId: null`, `command: d.command`, `traits: d.traits`, `skills: d.skills`, `age: d.age`, `birthYear: d.birthYear`, `isKingmaker: d.command >= 4`, `flipFlopperPenalty: 0`, `pvCache: 0`, `isHistorical: false`, `careerTrack: null`, `careerTrackYears: 0`, `interests: []`, `id: ''`, `firstName: ''`, `lastName: ''`, `state: d.state`, `ideology: d.ideology`, `partyId: null` — and calls `computePV` on it. Same shape `instantiateDraftees` produces at draft time, so numbers match within ± age-delta noise.

## Files to touch (exact, ordered)
1. `src/types.ts` — add `DraftHistoryPick`, `DraftHistoryYear`; add optional `draftHistory` to `GameState`.
2. `src/pv.ts` — export `OFFICE_PRESTIGE`.
3. `src/engine/phaseRunners.ts` — extract `pickBestForFaction` and `recordDraftPick`; append to `draftHistory` in both CPU and player branches; add `simOneDraftPick` and `autoPickForPlayer` exports.
4. `src/state/GameContext.tsx` — remove `{type:'draft'}` from `Modal`; drop modal-set calls in `advance`/`draftPick`; extend `repair` to backfill `draftHistory`.
5. `src/App.tsx` — remove `DraftModal` import and render; rewrite auto-nav effect to key on phase+year+pool predicate and route to `'draft'`.
6. `src/components/DraftTabs.tsx` — new shared tab bar component.
7. `src/pages/Draft.tsx` — new live-draft page (pool, results, status, sim controls, draft button).
8. `src/pages/DraftScouting.tsx` — new scouting page (3 upcoming years, projected PV, export JSON).
9. `src/pages/DraftHistory.tsx` — new history page (year selector, summary stats, per-pick table, export JSON).
10. `src/pages/draftScoutingHelpers.ts` — new `computeProjectedPV` helper.
11. `src/pages/registry.ts` — remove `draftSummary`; add `draft`, `draftScouting`, `draftHistory`.
12. `src/components/Sidebar.tsx` — replace conditional `Draft Summary` entry with unconditional `Draft` entry routing to `'draft'`.
13. Delete `src/components/DraftModal.tsx`.
14. Delete `src/pages/DraftSummary.tsx`.

## Test / verification plan
- Typecheck + build: `npm run lint` then `npm run build` (must pass cleanly — strict TS).
- Playtest 1856 scenario:
  1. Start a fresh 1856 game; phase advances normally until year 1860 phase `2.1.1`.
  2. Engine enters draft → shell auto-navigates to `Draft`. Verify status header (current pick / next pick / your position), pool & results tables render, "Sim one pick" advances CPU, picks appear in Results.
  3. Click into `Roster` mid-draft, then sidebar `Draft` again — page returns to the same in-progress state (no yank-back; auto-nav doesn't re-fire because the entry-key ref matches).
  4. Make a manual pick from the pool — row removes from pool, fills the Results slot, subsequent CPU picks auto-resolve up to the next player slot.
  5. Click "To end of draft" — confirm dialog appears; confirm; remaining slots fill including the player's. Verify pool empty / "Draft complete" banner + Continue button calling `advance()`.
  6. Navigate to `Draft History` → see the just-completed 1860 class with summary stats, per-pick rows; emerald accent on player rows. Export JSON downloads.
  7. Advance one phase past the draft; revisit `Draft` tab — tab is now greyed (tooltip "No draft in progress"); Scouting page shows 1864 / 1868 / 1872 columns.
- Playtest 1772 scenario:
  1. Start fresh 1772 game. Inaugural draft fires immediately at phase `2.1.1`. Shell auto-navigates to `Draft`.
  2. Confirm `pickBestForFaction` respects `eligibleIdeologies` for CPU and for "To end of draft" player auto-picks (e.g. Jefferson's Patriots gets a Traditionalist or RW Populist, not a Liberal).
  3. Verify Scouting shows the next post-inaugural draft year (1776 if inaugural is 1772).
- Save/load migration test:
  1. Load a save created on the current `main` (no `draftHistory` field). Verify the snapshot loads, `repair` reconstructs `draftHistory` from `draftedYear` + `factionId`, and the History page renders the legacy class with best-effort pick numbers.
- Edge cases:
  - Stuck-draft (pool empty but order populated): manually load a save in that state — Draft page shows empty-pool fallback with Continue button.
  - Held-back draftees (1856 dataset with unadmitted state): admit a territory in Settings/Tools, advance to the draft year, verify the imported draftee enters the pool only after admission. Scouting shows the row greyed with "Not yet admitted" badge in years before admission.
  - Custom CSV class override: import a CSV row with `draftYear` matching an upcoming year; Scouting column shows the custom row in place of the standard same-name same-year entry.
  - History across multiple drafts: play through 1860 and 1864 drafts; Jump-to-year dropdown lists both; navigation between them works.

## Risks
1. **`recordDraftPick` ordering bug in `pickNumber`/`round` derivation**: if CPU and player branches don't both go through the same helper, history can drift. Mitigation: route both branches through the same function; assert at write time that `pickNumber === picksThisYear.length + 1`.
2. **Auto-nav loop / yank-back**: a poorly-keyed effect could re-route the user to `Draft` every render. Mitigation: ref keyed on `${year}:${phaseId}`, cleared only when predicate falls back to false. Test by clicking out and back during a draft.
3. **`repair` backfill misordering**: legacy saves only have `draftedYear`; sorting by PV desc inside a year is a best-effort proxy that won't match true history but is acceptable. If a player relies on `pickNumber`/`round` semantics for a legacy class, they will be approximate. Documented; not gameplay-affecting.
4. **`OFFICE_PRESTIGE` export coupling**: exporting it leaks an internal weight to a UI page. Acceptable because there's no better home; flagged so we don't grow that surface.
5. **Save-state shape addition is benign but permanent**: once `draftHistory` is written, removing it would break newer saves. Confirm we want this as the long-term shape before merge (per spec, yes).
6. **Inaugural 1772 entry-key edge case**: the first turn enters phase `2.1.1` immediately on game start. The ref starts `null`, so first observation must set the ref AND navigate (unlike the previous `lastDraftYear` ref pattern which skipped the first observation). Make sure the effect doesn't skip the first tick.
