# Brief: Events Phase Manual Trigger & Data Visualization

## Approach

Re-use the existing `runPhase_2_4_3_Era` and `runPhase_2_4_2_Anytime` runners
as the single-click engine entry points (no per-event refactor), and surface
their results inside the two pages. A new pure module `src/engine/labels.ts`
owns every era-gated string (decider, party/faction, predicate, effect chip),
mirroring `applyEffect`'s shape in a read-only `previewEffect`. The two pages
gain a "Run next event" button + queue stepper (Pending / Just fired /
History), and `EraEventModal.tsx` calls `formatDecider` and reuses the
shared effect-chip and predicate-chip components.

Rejected alternative: refactoring `rollNationalEvent` / `rollPersonalEvents`
into single-event iterators. The spec's open-question #1 explicitly resolves
to "one click invokes the whole runner," so the runner stays whole and the
page just re-reads `snapshot.events` after each click.

## State & type changes

- `src/types.ts`:
  - Add `newlyFiredEventIds?: string[]` to `GameState` (line ~835, next to
    `graphFlags`). Holds `EraEvent.id`s plus `EventEntry.id`s flagged "just
    fired this phase visit." Optional + opt-in: old saves load with `undefined`.
  - Add `lastAnytimeFeedHeadId?: string` to `GameState`. A bookmark pointing at
    the most recent `events[].id` we've already surfaced as "history" on the
    Anytime page. New entries appearing after this id are the "just fired" set;
    advancing the phase resets `lastAnytimeFeedHeadId` to the current head.
  - **No new exported types.** The label module returns plain
    `{ kind, label, tone }` objects defined inline in `src/engine/labels.ts`
    (not exported as a public type — they're React-render-only).
- Save/migration: both fields are optional. `repair()` in
  `src/state/GameContext.tsx` does **not** need a backfill; if missing, the
  page treats it as "no newly-fired" and renders everything as "History."
- The "just fired" marker is cleared in `advancePhase` (engine.ts) by
  resetting `newlyFiredEventIds = []` and bumping `lastAnytimeFeedHeadId` to
  the current head — this is the only cross-cut into engine.ts.

## Engine changes (pure logic)

- **`src/engine/labels.ts`** (new, ~250 lines, all pure):
  - `formatDecider(decider: EraEvent['decider'], scenarioId: string, year: number): string`
    — implements AC 9 (cc-president era split at 1781; president valid ≥1789;
    cabinet → "Your Cabinet"; auto → "Automatic"). Prefers the event's year
    over `snap.game.year` (edge case "Era handoff").
  - `formatPartyId(partyId: PartyId, scenarioId: string, year: number): string`
    — 1772/pre-1789 → "Patriot"/"Federalist" (mirrors `PARTIES_1772`);
    1856/≥1828 → "D"/"R". Used by enthusiasm chips (AC 10).
  - `formatPredicate(snap: FullGameSnapshot, pred: Predicate, year: number): PredicateChip[]`
    — flattens conjunctions: `all` → flat list of leaf chips, `any` →
    composite "one of: A | B" chip, `not` → strikethrough wrapper.
    Empty `{ all: [] }` returns `[{ kind: 'note', label: 'Unconditional
    (core spine event)', tone: 'muted' }]` (edge case).
    Covers all 17 `Predicate` variants from `src/types.ts:707`. The
    `warActive` branch dispatches to a sub-helper that picks era-gated copy
    (AC 11: <1776 colonies; 1776–1783 RevWar; 1856 Civil War).
    `flag: 'warVictoryGuaranteed'` returns the AC 12 soft phrasing
    ("French alliance: defeat unlikely").
  - `formatEffect(snap: FullGameSnapshot, effect: EraEventResponseEffect, scenarioId: string, year: number): EffectChip[]`
    — replaces the inline chip-builder currently embedded in
    `EraEventModal.tsx` (lines 47–76). Enthusiasm chips route partyId through
    `formatPartyId` (AC 10). Interest-group chips check the AC 13 denylist
    (`BigTech | MilitaryIndustrial | LWMedia | RWMedia | Globalists |
    Pacifists | WallStreet`) when `year < 1789` and tag the chip
    `tone: 'anachronism'` + emit a `console.warn` once per (eventId,
    interestId) pair gated by `import.meta.env.DEV`.
  - `formatAnytimeEffect(snap, eff, kind: 'personal' | 'national'): EffectChip[]`
    — replaces the inline `effectChipsPersonal` / `effectChipsNational` in
    `AnytimeEventsPage.tsx` so both pages share the chip palette.
- **`previewEffect(snap, effect): { chips: EffectChip[]; warnings: string[] }`**
  in `src/engine/labels.ts` — a thin re-use of `formatEffect`; it does NOT
  mutate the snapshot. `warnings` collects the AC 13 anachronism strings for
  the dev-pane render.
- **Predicate provenance — chosen strategy (b): re-evaluate at render
  time.** `formatPredicate` walks the tree once and tags each leaf with a
  pass/fail badge by calling a pure `evalPredicateLeaf(snap, leaf)` that
  mirrors `evalPredicate` for non-compound nodes. Justification: the data is
  already in the snapshot, the predicate tree is < ~10 leaves per node, and
  this avoids polluting `EraEvent` schema with provenance state (which would
  need migration). Re-evaluation is read-only and O(leaves) per render.
- **Manual-run engine wrappers** — none needed. `runCurrentPhase` already
  routes `2.4.2` → `runPhase_2_4_2_Anytime` and `2.4.3` → `runPhase_2_4_3_Era`
  (engine.ts:43–48). The pages call `runCurrentPhase` (via a new
  `runEventsNow()` action on `GameContext`) which:
  1. Deep-clones the snapshot, calls `runCurrentPhase(draft)`,
  2. If the result is `needsPlayerInput: 'eraEvent'`, opens the modal exactly
     like `advance()` does today (lines 216–221),
  3. Otherwise records the new `EventEntry.id`s into `newlyFiredEventIds`
     (by diffing pre/post `events.length`),
  4. Persists.
- Cascading AI nodes (edge case): `runPhase_2_4_3_Era` already runs the
  `while (event && isAutoResolved(...))` loop internally (line 2364), so a
  single click drives all cascaded auto-resolutions to the next
  player-controlled node or to silence. No engine change.

## UI changes

- **`src/pages/EraEventsPage.tsx`** (heavy edit):
  - Re-section the page into three blocks driven by `pendingEraEvents`:
    **Pending** (`!resolved` and not just-fired), **Just fired this phase**
    (`resolved && newlyFiredEventIds?.includes(e.id)`, amber-highlighted),
    **History** (`resolved && !newlyFired`).
  - Render a `<RunNextEventButton>` that calls the new `runEventsNow()` from
    `GameContext`. Disabled when `selectEraGraphNode(snapshot)` is null AND
    there is no queued unresolved event. (Re-uses `selectEraGraphNode` as a
    pure check — does not mutate; existing safeguard in eraGraph.ts:108 just
    returns the queued event if any.) Tooltip: "No more events this phase."
  - Each event row renders three vertically stacked blocks: `<PredicateChips>`
    for prelude, the title/description, and `<EffectChips>` for chosen-response
    effects (resolved) or per-option preview chips (pending player-controlled).
  - AI-resolved rows show a "Resolved by AI" badge plus the chosen response
    label (the `feedByTemplate` lookup at lines 11–21 already supplies this).
- **`src/pages/AnytimeEventsPage.tsx`** (modest edit):
  - Add `<RunNextEventButton>` at the top of the events feed that calls
    `runEventsNow()`. One click = one full `runPhase_2_4_2_Anytime` invocation
    (spec AC 2 + open-question #1 resolution).
  - Tag entries with `id` newer than `lastAnytimeFeedHeadId` as "Just fired
    this phase" (subtle amber border). Existing filters (pool/era/category/
    faction/showRetired) still apply — the highlight is purely visual.
  - Swap `effectChipsPersonal` / `effectChipsNational` to call the shared
    `formatAnytimeEffect` from `src/engine/labels.ts`.
- **`src/components/EraEventModal.tsx`** (small surgical edit):
  - Replace line 30 raw-string fallback with `formatDecider(event.decider,
    snapshot.game.scenarioId, event.year)`. The `useGame()` already provides
    `snapshot`.
  - Above the responses list, render `<PredicateChips>` for the event's
    precondition (looked up via `nodeForEvent(event)?.precondition` from
    `src/engine/eraGraph.ts:72`). For 1856 (no graph), render nothing — there
    is no precondition.
  - Replace the inline chip block (lines 47–76) with `<EffectChips
    effect={resp.effect} />` driven by `formatEffect`. Critically: the
    enthusiasm `e.party === 'BLUE' ? 'D' : 'R'` literal at line 60 dies here
    (AC 10).
- **New shared components** (one file, ~80 lines):
  - `src/components/EventChips.tsx` exporting `<PredicateChips>`,
    `<EffectChips>`, `<RunNextEventButton>`, `<DeciderBadge>`. Each is a thin
    render wrapper over the label module — no business logic.

## State plumbing

- **`src/state/GameContext.tsx`**:
  - New action `runEventsNow(): Promise<void>` mirroring `advance()` lines
    206–232 but **without** the trailing `advancePhase` — it only runs the
    current phase and persists. Diffs `events.length` before/after, appends
    new ids into `draft.game.newlyFiredEventIds`.
  - Append `runEventsNow` to `GameContextValue` and the provider value object.
  - `chooseEraResponse` (lines 288–351) needs a one-line addition: after
    `resolveEraEvent`, push the resolved event id into
    `draft.game.newlyFiredEventIds`.
- **`src/engine/engine.ts`**:
  - `advancePhase` (line 84) clears `newlyFiredEventIds = []` and bumps
    `lastAnytimeFeedHeadId` when crossing out of 2.4.2 or 2.4.3 (gate on
    `cur === '2.4.2' || cur === '2.4.3'`).

## Files to touch (exact, ordered)

1. **`src/types.ts`** — add `newlyFiredEventIds?` and
   `lastAnytimeFeedHeadId?` to `GameState`.
2. **`src/engine/labels.ts`** (NEW) — pure label module:
   `formatDecider`, `formatPartyId`, `formatPredicate`, `formatEffect`,
   `formatAnytimeEffect`, `previewEffect`, `evalPredicateLeaf`.
3. **`src/engine/engine.ts`** — `advancePhase` clears the new fields on
   exit from 2.4.2 / 2.4.3.
4. **`src/state/GameContext.tsx`** — add `runEventsNow` action; flag
   newly-fired ids in `chooseEraResponse`; expose on context value.
5. **`src/components/EventChips.tsx`** (NEW) — shared
   `<PredicateChips>`, `<EffectChips>`, `<RunNextEventButton>`, `<DeciderBadge>`.
6. **`src/components/EraEventModal.tsx`** — use `formatDecider`; render
   `<PredicateChips>` above options; replace inline chip JSX with
   `<EffectChips>`.
7. **`src/pages/EraEventsPage.tsx`** — three-section stepper UI, run-next
   button, prelude/effect chips per row.
8. **`src/pages/AnytimeEventsPage.tsx`** — run-next button; "just fired"
   visual marker via `lastAnytimeFeedHeadId`; swap chip helpers to
   `formatAnytimeEffect`.

## Test / verification plan

- Build/typecheck: `npm run build`. Strict mode must accept the optional
  field additions on `GameState`.
- Playtest 1772 scenario through 1772 → 1789:
  - **AC 1**: At phase 2.4.3, click "Run next event"; modal opens for
    `gaspee` (player-controlled cc-president). Resolve. Click again →
    `committees_of_correspondence` (or an AI cascade) appears in "Just fired"
    with effect chips visible.
  - **AC 3**: Reload mid-phase (refresh browser). "Just fired" section
    survives; advancing phase clears it.
  - **AC 6**: For each pending event, the prelude chips render correctly
    (`yearAtLeast: 1773` → "Year ≥ 1773"; `after('gaspee')` →
    "After: The Gaspee Affair"). Verify all 17 `Predicate` variants by
    inspecting nodes from `eraEvents1772.ts` (the dataset uses
    `yearAtLeast`, `eventCompleted`, `eventChose`, `warActive`,
    `warOutcome`, `not`, `any`, `all`, `flag`).
  - **AC 9, 14**: 1772 events show "President of the Continental Congress"
    pre-1781; resolve `articles_of_confederation` to flip the CC; next
    cc-president event labels "President of the Confederation Congress."
    Start a fresh 1856 game; advance to the Dred Scott node — modal reads
    "Decided by: Your Cabinet," not "cabinet."
  - **AC 10**: 1772 enthusiasm chips read "→Patriot" / "→Federalist".
    1856 reads "→D" / "→R".
  - **AC 11**: `warActive: true` chip on a 1775 event reads "the colonies
    are at war with Britain"; on a 1778 event reads "the Revolutionary
    War is being fought."
  - **AC 12**: After resolving `french_alliance` "a", the
    `warVictoryGuaranteed` flag appears on downstream chips as "French
    alliance: defeat unlikely."
  - **AC 13**: Manually construct a save where a 1772 event surfaces a
    `WallStreet` interest delta — chip renders with the anachronism tone
    + DEV console warning fires.
- Playtest 2.4.2: at the phase, click "Run next event" several times;
  feed grows; the highlight border applies only to entries newer than
  the previous `lastAnytimeFeedHeadId`; advancing phase resets the
  bookmark.
- Edge case verification: empty queue disables the button with tooltip;
  game-end after `british_victory` short-circuits and the button hides.

## Risks

1. **Predicate-tree rendering correctness.** Re-evaluating at render time
   is O(leaves) per page render, but if the user opens a deeply-nested
   `{ all: [{ any: [...] }, { not: ... }] }` and the engine state has
   drifted (e.g. `eventChose` looks at `pendingEraEvents` which we filter
   on phase exit in `GameContext.tsx:343`), a pass/fail badge could
   mislead. Mitigation: re-use the existing `evalPredicate` helpers for
   non-compound nodes and ship a unit pass on every variant. Keep the
   prelude block visually labelled "Why this fired" rather than a strict
   truth table — the per-leaf badge is informational, not authoritative.
2. **Save-compat for new fields.** Both fields are optional on `GameState`
   and the page code reads them with `?? []` / `?? ''`. No `repair()`
   backfill is required. The risk is if a future engine change uses
   `newlyFiredEventIds` as a precondition — flagged so a builder doesn't
   change it to required.
3. **"Run next event" granularity on 2.4.2.** The spec's open-question #1
   resolves: one click = one full `runPhase_2_4_2_Anytime` invocation
   (which itself fires 0–1 national + N personal events governed by per-
   politician fire-chance rolls). This brief preserves that. If a future
   PM wants single-event granularity that would require refactoring the
   runner into an iterator (out-of-scope here). Flagged so a future
   change doesn't silently break the page's "one click = one phase pass"
   contract.
4. **Anachronism warning noise (AC 13).** The DEV console warning fires
   on every render that includes a forbidden interest chip. Risk:
   developer feed-spam. Mitigation: gate the warning behind a module-level
   `Set` of `(eventId, interestId)` already-warned pairs so each pair
   warns once per browser session.

## Checkpoint summary (phone-readable)

- Two pages (2.4.2, 2.4.3) gain a "Run next event" button calling existing
  runners; no per-event iterator refactor.
- New pure `src/engine/labels.ts` owns all era-gated strings + a read-only
  `previewEffect`. Predicate provenance via render-time re-evaluation.
- New shared component `src/components/EventChips.tsx` for
  `<PredicateChips>`, `<EffectChips>`, `<RunNextEventButton>`,
  `<DeciderBadge>`.
- `EraEventModal.tsx:30` raw-string decider bug folded into the same
  `formatDecider` rewrite.
- `GameState` gets two optional fields: `newlyFiredEventIds`,
  `lastAnytimeFeedHeadId`. Old saves load unchanged.
- Top risk: predicate-tree rendering accuracy on deeply nested compound
  preconditions — re-evaluating reads live snapshot state and could
  mislead if state drifts; mitigated by reusing `evalPredicate` and
  labelling the block informationally.
