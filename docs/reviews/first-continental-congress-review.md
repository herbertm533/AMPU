# Review: First Continental Congress Builder (Phase 2.9.6)

**Branch:** `claude/build-ampu-game-ziNkq`
**Verdict:** **CHANGES REQUESTED**

## Build status

`npm run build` → exit 0. Last 12 lines:

```
> tsc -b && vite build
vite v5.4.21 building for production...
transforming...
✓ 113 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:   0.31 kB
dist/assets/index-dsWUVAY6.css   32.00 kB │ gzip:   5.96 kB
dist/assets/index-BKj2hp5E.js   614.15 kB │ gzip: 154.93 kB
(!) Some chunks are larger than 500 kB after minification. [pre-existing warning, not a failure]
✓ built in 3.21s
```

No tsc errors, no vite errors. Only the standard "large chunk" warning, pre-existing.

## AC compliance matrix

| AC | Status | Evidence |
|----|--------|----------|
| 1 (gate: 1772/year≥1774/intolerable_acts ok) | PASS | `phases.ts:111-122`, `firstContinentalCongress.ts:41-51` |
| 2 (silent skip when gate not met) | PASS | `phases.ts:111-118` |
| 3 (gate-swap replaces 1856 logic when gated) | PASS | `phaseRunners.ts:3066-3068` (early return before 1856 path at 3070+) |
| 4 (assembleCC no-op for intolerable_acts+ok) | PASS | `phaseRunners.ts:2434-2442` |
| 5 (Georgia included, 2 slots, footnote) | PASS | `states1772.ts:20` GA isColony=true, `colonyOrder1774` includes all `isColony !== false`, footnote at `ContinentalCongressBuilderPage.tsx:349` |
| 6 (delegate counts per ccDelegateSlots) | PASS | runner reads `state.ccDelegateSlots` at `phaseRunners.ts:3141` |
| 7 (selecting faction = most-living, legislative≥1 floor) | PASS | `firstContinentalCongress.ts:62-91, 94-112` |
| 8 (fallback to all alive state pols) | PASS | `firstContinentalCongress.ts:108-111` |
| 9 (aggregate state PV tiebreaker) | PASS | `firstContinentalCongress.ts:80-91` |
| 10 (cross-faction picks allowed) | PASS | pool not filtered by faction; AI T2/T3 by design |
| 11 (player payload via needsPlayer) | PASS | `phaseRunners.ts:3171-3180` |
| 12 (modal at careerTrackYears≥1; clear on accept) | PASS | `ContinentalCongressBuilderPage.tsx:99-105`, `firstContinentalCongress.ts:212-216` |
| 13 (no skip-ahead) | PASS | runner always processes current colony fully |
| 14 (AI T1/T2/T3 ordering) | PASS | `firstContinentalCongress.ts:148-196` |
| 15 (12% wild-card via seeded chance) | PASS | `firstContinentalCongress.ts:161` (`chance(0.12)` from `rng.ts`) |
| 16 (AI deterministic skip at ≥4y) | PASS | `firstContinentalCongress.ts:115-117, 142` |
| 17 (tier badge on delegate record) | PASS | `commitDelegate` stamps `tier` at `firstContinentalCongress.ts:217-222` |
| 18 (`CCDelegate.tier?` optional, no flat array) | PASS | `types.ts:568` |
| 19 (period-correct selecting-body labels) | PASS | static map `firstContinentalCongress.ts:19-33` |
| 20 (new page; CongressPage untouched) | PASS | `registry.ts:103`; `ContinentalCongressPage.tsx` unmodified |
| 21 (pool tier-sorted; NO Federalist/D/R) | **FAIL** | (a) pool sorted by PV desc at `ContinentalCongressBuilderPage.tsx:95`, not tier; (b) `formatPartyId(p.partyId, '1772', 1774)` at line 196 returns literal "Federalist" for RED partyId per `labels.ts:108`, rendered next to faction name. F5 explicitly forbids this. |
| 22 (AI picks animate one at a time + tier+rationale) | **DEVIATION** | Runner inlines entire AI walk between player colonies. Spec marks animation as "Locked" but allows "skip animation toggle" as optional — build effectively forces skip behavior without offering the toggle. |
| 23 (end-of-phase roster summary + footnote) | PASS | `RosterSummary` at `ContinentalCongressBuilderPage.tsx:246-364`; Georgia + abstraction footnote at 349-352 |
| 24 (per-delegate appointment log w/ meta.tier) | PASS | `firstContinentalCongress.ts:227-233` (meta.tier omitted for Player tier; AI picks include tier) |
| 25 (decline log) | **PARTIAL** | Player decline ✓ at `phaseRunners.ts:3271-3276`; AI decline ✓ at 3206-3211 BUT only logs T1 declines, not T2/T3. Also duplicates: same heavy-T1 logged per slot in a multi-slot colony. |
| 26 (single capstone log; suppress prior path) | PASS | `phaseRunners.ts:3220-3225` capstone; prior path at 2434-2442 short-circuits before capstone at 2448. |
| 27 (durability: no re-fire) | PASS | gates at `phases.ts:120`, `phaseRunners.ts:3130`, applyPostEffects 2431. |

## CP1 lock verification

1. **Gate-swap mechanism** ✓ — `runPhase_2_9_6_Congressional` short-circuits to `runCCBuilderWalk` only for 1772+gate; 1856 path unchanged (`phaseRunners.ts:3066-3070`).
2. **`delegates[]` carries `tier?`** ✓ — `types.ts:568`.
3. **Aggregate state PV tiebreaker** ✓ — `selectingFactionFor` sums `pvCache` for tied factions and picks the highest (`firstContinentalCongress.ts:84-90`).
4. **Modal at careerTrackYears≥1 (player); AI skip at ≥4** ✓ — page line 100; `applyAIDeclineRule` line 116.
5. **12% wild-card uses seeded `chance(0.12)`** ✓ — `firstContinentalCongress.ts:161`, imports `chance` from `'../rng'`.
6. **Inaugural CC durable, no double-build** ✓ — three layers: (a) `shouldRunPhase` skip at `phases.ts:120`; (b) runner early-return at `phaseRunners.ts:3130`; (c) `applyPostEffects` `assembleCC` ccExisting check at line 2431.
7. **Georgia included w/ 2 slots; footnote** ✓ — `states1772.ts:20`, footnote at page line 349.

## `assembleCC` guard correctness

- **Exact condition** matches spec literally: `scenarioId === '1772' && event.templateId === 'intolerable_acts' && event.chosenResponseId === 'ok'` (phaseRunners.ts:2434-2438).
- **Other assembleCC callers:** none. The `assembleCC` postEffect type appears only on `intolerable_acts` (eraEvents1772.ts:107) and is dispatched only here. The other `appointDelegates` callsite (`phaseRunners.ts:3295` in `runPhase_2_10_End`) is the durable-CC reassembly path; not affected.
- **`event.chosenResponseId` populated BEFORE `applyPostEffects`** — verified at `phaseRunners.ts:2396` (set) → 2407 (`applyPostEffects` call). Guard reads it correctly.
- **No silent double-build path** — `runCCBuilderWalk` checks `cc.delegates.length > 0 && cursor == null` and returns void; `shouldRunPhase` independently skips at the phase walker level when delegates exist; `applyPostEffects` checks `ccExisting.delegates.length > 0` BEFORE the gate-swap guard.

## Determinism / purity audit

- **`firstContinentalCongress.ts`** — no `Math.random` / `Date.now`. Uses `chance` and `pick` from `'../rng'` (seeded).
- **`phaseRunners.ts` 1772 CC section (3060-3277)** — no `Math.random` / `Date.now`.
- **Page / modal** — no `Math.random` / `Date.now`.
- Pre-existing `Math.random` calls elsewhere in `phaseRunners.ts` (lines 182-192, 2856, 2947) are untouched by this PR.

## Era-correct labels

- `labels.ts:formatPartyId` is invoked on `ContinentalCongressBuilderPage.tsx:196` and returns **"Federalist"** for RED party in 1772 (year<1789). Per F5/AC #21 this is **explicitly forbidden** in the First-CC UI. The string is rendered next to the faction name in the pool table at line 202-205: `{f?.name ?? '—'} <span>({partyLabel})</span>`. **Violation.**
- Faction names ("Adams Patriots", "Sons of Liberty", etc.) and ideology names ("Moderate", "Liberal", etc.) are fine per F5.
- `patriotBand` (page lines 16-29) renders "Patriot/Moderate/Loyalist-leaning" — fine per F5 as derived flavor.
- The TIER_BADGE strings (page line 31-37) are fine.
- **No hardcoded** "Anti-Federalist" / "D" / "R" / "Democrat" / "Republican" strings.

## Save-mid-phase resumption

- `ccBuilderCursor` is a field on `GameState` (`types.ts:827`), so it persists via the standard `saveSnapshot`/`loadSnapshot` cycle.
- `colonyOrder1774(snap)` is deterministic from `snap.states` (alphabetical by `abbr`).
- `excludedThisColony` is an array of politician ids on the cursor — persists with the cursor.
- On reload, the runner reads cursor + recomputes order and pool — resumes cleanly. Within phase 2.9.6 nothing else mutates politicians, so this is safe.

## Bugs ranked

1. **AC #21 F5 violation: "Federalist" rendered in pool table.** `formatPartyId` returns "Federalist" for RED partyId in 1772; rendered next to faction names at `ContinentalCongressBuilderPage.tsx:196, 202-205`. **Must fix.**

2. **AC #25 partial — duplicate AI decline logging.** `phaseRunners.ts:3201-3212` recomputes the declined-T1 list per slot. In a 4-slot AI colony, a heavily-invested T1 who isn't picked is logged as "declining" once per slot — up to 4 times for the same politician.

3. **AC #25 partial — T2/T3 declines not logged.** Only T1 declines (factionId match) get the "X declines appointment" log. T2/T3 candidates with careerTrackYears ≥ 4 are deterministically skipped by `aiPickDelegate` but not logged. Spec AC #25 doesn't restrict by tier.

4. **AC #22 — AI animation pacing.** Build inlines the entire AI walk between player colonies into one `runCurrentPhase` call. Spec calls AI per-pick animation "Locked"; the skip-toggle clause is "acceptable but not required" — build effectively forces skipped pacing without the toggle.

5. **AC #21 — pool sort by tier (player colonies).** Spec says "eligible pool sorted by tier." Build sorts by PV desc for player colonies (`ContinentalCongressBuilderPage.tsx:95`).

6. **Edge case — selectingFactionFor returns playerFactionId default.** If a colony has zero alive politicians with any factionId, the function defaults to `snap.game.playerFactionId` (line 78). The runner then sees pool.length === 0 and skips the colony with the "no delegates" log. Behavior is safe.

## Required fixes (R1, R2)

- **R1.** Remove `formatPartyId(...)` from the pool table or replace with a non-party-system label (e.g. personality band, ideology). Lines `ContinentalCongressBuilderPage.tsx:196, 202-205`.
- **R2.** Fix duplicate AI decline log. Two options: (a) move the decline log INTO `aiPickDelegate` and return a `{ skipped: Politician[] }` field; or (b) dedupe via a phase-scoped Set so each politician is logged once per colony. Lines `phaseRunners.ts:3201-3212`.

## Optional improvements (R3, R4, R5)

- **R3.** Extend AI decline log to T2/T3 (not only T1) for full AC #25 coverage.
- **R4.** Add per-colony AI animation toggle (or just per-colony auto-advance) to satisfy AC #22's locked intent.
- **R5.** Pool sort by tier on player colonies for AC #21.

## Playtest plan (run before merge)

- **Cascade test (AC #4):** start 1772 as a Blue-faction player, advance turns until the Intolerable Acts era event fires (after Tea Act → Boston Tea Party spine). Choose "Convene the First Continental Congress." Verify the event log shows the deferral log line, NOT the auto-build capstone. Click Continue; verify the builder page activates.
- **Player-colony pick + decline (AC #11, #12):** find a colony where your faction has the most politicians. Verify colony header, period-correct selecting-body label, slot counter, and pool. Pick a politician with `careerTrackYears >= 1` — confirm modal opens naming the track and years. Decline: confirm slot stays open and politician disappears from pool. Pick another: confirm seat. Continue through all slots.
- **AI colony watching (AC #22):** observe whether AI picks animate per slot or batch through. Confirm current behavior (jump straight to next player colony / roster summary).
- **F5 / AC #21 label check (KNOWN VIOLATION):** on a player-colony pool table, confirm faction column does NOT render "Federalist" next to RED-party faction names. The build currently does render this.
- **Roster summary (AC #5, #23):** after build completes, verify all 13 colonies appear (incl. GA), GA footnote shown, faction tally + tier counts visible. Continue to advance past 2.9.6.
- **Durability (AC #27):** advance to the next turn, confirm phase 2.9.6 silently skipped. Seated First CC still visible on read-only `continentalCongress` page.
- **AI decline log duplicates (Bug R2):** in a 4-slot AI colony (PA, MA, VA, or MD) where the AI's T1 faction has politicians with `careerTrackYears >= 4`, scroll the event log after the AI walk. Confirm whether the same politician appears with "declines appointment" multiple times.

## Five-bullet summary

- Build passes; engine deterministic (uses seeded `chance(0.12)`, no `Math.random`/`Date.now` in new code).
- All 7 CP1 locks honored: gate-swap, `tier?` on `CCDelegate`, aggregate-PV tiebreaker, ≥1y modal / ≥4y AI skip, 12% wild-card, durability triple-gate, Georgia included with footnote.
- **Two real bugs**: (1) "Federalist" rendered in player-colony pool table via `formatPartyId` — direct F5/AC #21 violation; (2) AI declines log duplicates entries per slot in multi-slot AI colonies — AC #25 cosmetic bug. **Verdict: CHANGES REQUESTED.**
- Self-reported deviations confirmed: AI walk inlined (no per-pick animation) and pool not tier-sorted. AC #22 is "Locked" but the spec's skip-toggle clause provides a defensible out; the build effectively bakes in the skip without offering the toggle.
- Cascade guard (`assembleCC` defer when `intolerable_acts + ok`) is wired correctly — `event.chosenResponseId` is set at `phaseRunners.ts:2396` before `applyPostEffects` reads it at 2407. No double-build paths exist.
