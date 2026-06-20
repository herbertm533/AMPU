# Review: 1772 UX Polish Pass

## Verdict

**CLEAN** — Build green; all 8 F-facts pass; 35/36 ACs pass cleanly with 1
PARTIAL (AC #20 has a defensive deviation for `i === 0` the builder
flagged); CP2 deviations correctly applied; no determinism leak; no scope
creep. The 12-useEffect / EraTimeline-i=0 / Panel-2-log-text deviations
are all defensible.

## Build

```
> tsc -b && vite build

vite v5.4.21 building for production...
transforming...
✓ 116 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:   0.31 kB
dist/assets/index-Bju-Va-C.css   33.54 kB │ gzip:   6.16 kB
dist/assets/index-DVVoYfuY.js   648.95 kB │ gzip: 162.38 kB

(!) Some chunks are larger than 500 kB after minification. [pre-existing warning]
✓ built in 2.44s
```

Exit 0. Only the pre-existing chunk-size warning. No tsc errors.

## CP2 Deviations

- **CP2 #1 (CC-president-name in ack modal)** — APPLIED.
  `src/components/EraEventModal.tsx:18-29` builds `chosenByLabel` as
  `CC President {firstName} {lastName} ({factionName}) chose:` when the
  resolving president's faction differs from the player's, omits faction
  when it's the player's own, and falls back to "An auto-resolved
  decision:" if no president can be found.
- **CP2 #2 (New Game button retains reload)** — APPLIED.
  `src/components/GameOverScreen.tsx:57-60` does
  `await resetGame(); window.location.reload();` exactly as the brief
  preserved. NOT switched to no-reload.

## F-Facts

- **F1 (presentation + delta tracking only)** PASS. `src/pv.ts` and
  `src/rng.ts` untouched. New mutations are restricted to
  `halfTermSummaries[]` recorders and log meta.
- **F2 (modal not toast)** PASS. Acknowledge surface is `EraEventModal`
  in `mode='acknowledge'` (`src/components/EraEventModal.tsx:13-69`).
- **F3 (parallel useEffects, no centralization)** PASS. 12 new effects
  in `App.tsx:129-294`, each with its own `useRef<string|null>` sentinel
  and year+phaseId key matching the existing 7's pattern.
- **F4 (year === startYear, scenario-agnostic)** PASS.
  `src/pages/Draft.tsx:19` uses `g.year === g.startYear`. No `1772` or
  `1856` literals in Draft.tsx.
- **F5 (verbatim historian text)** PASS. `CONTRAST_LINES` in
  `src/components/GameOverScreen.tsx:9-14` matches all four historian
  quotes character-for-character against the research file.
- **F6 (terminal nodes skip ack modal)** PASS.
  `src/engine/phaseRunners.ts:2381-2383` excludes
  `triggersGameEnd: true` events from the acknowledgements array.
  Defense-in-depth filter at `src/state/GameContext.tsx:222-225`.
- **F7 (EOH scenario-agnostic)** PASS.
  `src/pages/EndOfHalfTermPage.tsx` has no `scenarioId === '1772'`
  gate. Auto-nav at `App.tsx:283-294` is unconditional on scenario.
- **F8 (deaths page auto-navs on empty)** PASS.
  `App.tsx:129-140` fires unconditional on `phaseId === '2.4.1'`;
  empty state at `DeathsRetirementsPage.tsx:145-149`.

## Acceptance Criteria

### Spike 1 — What Just Happened

- **AC #1** PASS — `deathsRetirements` registered at
  `registry.ts:71,108`; auto-nav `App.tsx:128-140` keyed
  `${g.year}:2.4.1`.
- **AC #2** PASS — Header + summary line at
  `DeathsRetirementsPage.tsx:141-144`.
- **AC #3** PASS — Sortable table with the seven columns at
  `DeathsRetirementsPage.tsx:155-163`; default sort PV desc.
- **AC #4** PASS — Cause enums (`age`/`battle`/`event`/`assassination`
  and `age`/`event`/`court`) at `types.ts:967-977`; recorders at
  `phaseRunners.ts:2028, 2037, 2303, 2309, 2933` and
  `revolutionaryWar.ts:89`.
- **AC #5** PASS — Empty state at
  `DeathsRetirementsPage.tsx:145-149`.
- **AC #6** PASS — Age-bucket bar chart at
  `DeathsRetirementsPage.tsx:181-197`
  (Under 50/50s/60s/70s/80s+).
- **AC #7** PASS — `endOfHalfTerm` registered at
  `registry.ts:72,109`; auto-nav `App.tsx:283-294`.
- **AC #8** PASS — `game.halfTermSummaries?` at `types.ts:864-866`;
  populated by recorders in `halfTermSummary.ts` (Option B).
- **AC #9** PASS — All 5 sections in `EndOfHalfTermPage.tsx`:
  meters delta (127-147), faction-strength bars (149-168), top PV
  winners/losers (170-201), key events (203-217), next-turn preview
  (219-228).
- **AC #10** PASS — `EndOfHalfTermPage.tsx:230-232` Continue button
  reads `Continue to {g.year + 2}`.
- **AC #11** PASS — No scenario gate.
- **AC #12** PASS — 12 parallel `useEffect`s added; no dispatcher.
- **AC #13** PASS — All 14 destinations covered:
  `2.4.1`→deathsRetirements (line 129), `2.4.2`→anytimeEvents (143),
  `2.4.3`→eraEvents (157), `2.5.1`→meters (171),
  `2.5.2`→governors (185), `2.6.1/.2/.3`→legislation (199-210,
  collapsed), `2.7.1`→diplomacy (213),
  `2.7.2`→revWar (227, gated on `revolutionaryWar?.active === true`),
  `2.2.1/.2`→congress (241-252, collapsed),
  `2.2.3`→factionLeader (255), `2.9.5`→elections (269),
  `2.10`→endOfHalfTerm (283).
- **AC #14** PASS — All effects use `${year}:${phaseId}` sentinel.
- **AC #15** PASS — Predicates of the 7 pre-existing effects are
  stricter than just phaseId; they win.
- **AC #16** PASS — Acknowledgement surface is `EraEventModal`
  in acknowledge mode; engine returns `acknowledgements` array
  (`engine.ts:48`).
- **AC #17** PASS — Queue at `GameContext.tsx:70`; `enqueueAcks`
  (221-229); `acknowledgeEraEvent` dequeues one at a time (485-495).
- **AC #18** PASS — Terminal nodes excluded at
  `phaseRunners.ts:2381-2383` and again at
  `GameContext.tsx:222-225` (defense-in-depth).
- **AC #19** PASS — Acknowledge mode shows only the engine-chosen
  response with a single button (`EraEventModal.tsx:31-69`).
- **AC #20** PARTIAL — Year stamps under completed chips
  (`EraTimeline.tsx:53`), `animate-pulse` on current (line 48),
  check icon on done (line 52). Build extended `isCurrent` to
  `i === 0` (line 36) so a brand-new game shows Gaspee pulsing
  before any milestone is completed. Spec wording is "the first
  not-yet-completed milestone after a completed one" — strictly
  `i=0` wouldn't qualify. **Defensive deviation; benign (no
  post-completion behavior change), but technically wider than
  the spec.** Accepted.
- **AC #21** PASS — Native `title=` tooltip on each chip
  (`EraTimeline.tsx:43`) using matching `EventEntry.text`.
- **AC #22** PASS — `EraTimeline.tsx:17` still gates
  `scenarioId !== '1772'` to return `<div />`.

### Spike 2 — Inaugural-Draft Signage

- **AC #23** PASS — `Draft.tsx:20` derives `titlePrefix` from
  `g.year === g.startYear`; rendered at lines 30 and 119.
- **AC #24** PASS — Amber banner at `Draft.tsx:122-126`; verbatim
  copy including `{g.startYear + 4}`.
- **AC #25** PASS — Pill at `Draft.tsx:31,53,120` with
  `bg-amber-500 text-slate-900` (INAUGURAL) / `bg-slate-300 text-slate-700`
  (ROOKIE).
- **AC #26** PASS — Heuristic is scenario-agnostic;
  `1856`'s `startYear: 1856` makes it generalize on construction.
- **AC #27** PASS — Draft mechanics unchanged; visual signage only.

### Spike 3 — Campaign-Over Recap

- **AC #28** PASS — `GameOverScreen.tsx` replaced (36 → 224 lines);
  same gate at `App.tsx:341-343`.
- **AC #29** PASS — Banner at `GameOverScreen.tsx:85-91`.
- **AC #30** PASS — Panel 1 has all five elements: PV total (98),
  Top 5 living (107-118), member count + delta (99-103), ideology
  chart (125-134), key losses sorted by `pvCache` (137-150).
- **AC #31** PASS (with documented deviation) — Filter at line
  49-51 matches spec. Rendering uses pre-formatted `e.text`
  (= `${title}: ${label}. ${effect.text}` from
  `phaseRunners.ts:2409`) instead of re-parsing — visually
  equivalent.
- **AC #32** PASS — `<EraTimeline />` at line 172; alt-history list
  at 174-191 using
  `ERA_GRAPH_1772.filter(n => n.realEvent === false && game.eraEventsCompleted.includes(n.templateId))`.
- **AC #33** PASS — `CONTRAST_LINES` keyed on templateId; selection
  at line 80 with `__fallback`. Italicized blockquote with amber
  left border (196-198). Verbatim historian text.
- **AC #34** PASS — Three buttons (201-220): New Game (reload
  preserved per CP2 #2), Replay Same Scenario (calls
  `startNewGame(playerFactionId, scenarioId)`), Export Save (Blob
  download with `URL.createObjectURL`).
- **AC #35** PASS — Container `max-w-4xl space-y-6 md:space-y-8`
  (line 84); Panel 1 inner `grid-cols-1 md:grid-cols-2` (line 95).
- **AC #36** PASS — `onReplay` (62-65); `startNewGame`
  (`GameContext.tsx:195-203`) does
  `clearDb() → build*Scenario() → saveSnapshot() → setSnapshot()`.

## Determinism / Purity

- `halfTermSummary.ts` — no `Math.random` or `Date.now`. All 9 helpers
  return `void`, mutate the snapshot in place, no I/O.
- `phaseRunners.ts` — new recorder/milestone calls add no randomness.
  Pre-existing `Math.random` sites (lines 183-193, 2879, 2971) and
  `revolutionaryWar.ts` (lines 86, 94) are unchanged.
- `engine.ts:21` — `openSummaryIfNeeded(snap)` placed BEFORE the phase
  switch (after the convention guard); pure, idempotent.
- `pv.ts` and `rng.ts` confirmed untouched.

## Risks (carried from brief)

Brief Risk #1 was "missed recorder calls." Walked all 6 expected sites:

- `runPhase_2_4_1_Deaths` — `recordDeath`/`recordRetirement` at
  `phaseRunners.ts:2028, 2037`.
- `runPhase_2_4_2_Anytime` (via `rollPersonalEvents`) — recorders at
  2303, 2309.
- `runPhase_2_4_3_Era` (`resolveEraEvent`) — `recordEraEvent` (2410);
  `recordMilestone` (2428 governors, 2436 terminal, 2495 Lex
  war-start, 2506 Articles, 2538 Treaty of Paris, 2619 generic
  startWar).
- `runPhase_2_6_3_Floor` — `recordBillPassed`/`recordBillFailed` in
  both 1772 CC branch (2800/2808) and 1856 House+Senate branch
  (2848/2852).
- `runPhase_2_8_2_CourtMgmt` — `recordRetirement(snap, j.id, 'court')`
  at 2933 (BEFORE `vacateOffice` at 2934 — confirmed office is
  captured correctly).
- `revolutionaryWar.ts` — `recordDeath(snap, victim.id, 'battle')`
  at line 89.

Other plumbing:

- `runPhase_2_10_End` — `closeSummary(snap)` at `phaseRunners.ts:3402`.
- `runCurrentPhase` — `openSummaryIfNeeded(snap)` at `engine.ts:21`.
- `GameContext.repair` — `s.game.halfTermSummaries ??= []` at lines
  137-140.

## Build-flagged deviations (verdict on each)

1. **12 useEffects vs brief's "10"** — VERDICT: accepted. AC #13
   specifies 14 phase→page destinations; the build collapses three
   legislation phases (2.6.1/2/3) and two congress phases (2.2.1/2)
   into one effect each, yielding 12 effects for 14 destinations.
   Matches the spec's intent.
2. **EraTimeline `i === 0` extension** — VERDICT: accepted as
   PARTIAL on AC #20. Defensive only; no post-completion regression.
3. **Panel 2 renders pre-formatted log text** — VERDICT: accepted.
   AC #31's "year, event title, response label, response effect
   text" is satisfied by `e.text` (which is `${title}: ${label}.
   ${effect.text}` from `phaseRunners.ts:2409`).

## Findings requiring fix

None blocking. Optional follow-ups:

1. **(Low) Acknowledgement-modal cascade vs player-input event.** In
   `advance()` (`GameContext.tsx:244-253`) and `chooseEraResponse`
   (438-470), if a phase returns BOTH acknowledgements AND
   `needsPlayerInput: 'eraEvent'`, the build surfaces the ack queue
   and discards `result.payload`. The next `advance()` re-runs the
   phase and re-surfaces the unresolved event from
   `pendingEraEvents`, so functionally the player will still get
   it — but the user needs an extra Continue click after draining
   the acks. Acceptable for v1; flag for playtest UX feel.
2. **(Low) EOH header label format.** `EndOfHalfTermPage.tsx:121`
   renders `End of Half-Term — {startYear}-{endYear}`. When
   `startYear === endYear` (which is always true given
   `closeSummary` runs before turn rollover) this shows e.g.
   "End of Half-Term — 1774-1774". Cosmetic.
3. **(Verified, low) Office field on retirements outside 2.4.1.**
   `recordRetirement(snap, p.id, 'court')` at
   `phaseRunners.ts:2933` runs BEFORE `vacateOffice` at 2934, so
   the office is captured before it's wiped. Confirmed correct.

## Must playtest before merge

- **Boston Tea Party / Intolerable Acts cascade** — advance 1772 to
  the era spine. Verify (a) each auto-resolved event surfaces an
  acknowledge modal exactly once, (b) the queue presents them in
  order, (c) clicking Acknowledge dequeues cleanly, (d) the Era
  Timeline chips flip green + show year stamps + tooltips on hover.
- **EOH page first-turn framing.** Fresh 1772, advance to first
  2.10. Verify the page shows meter values (start == end on turn
  1, deltas all 0), faction-strength bars, the
  `summaries.length === 1` framing. Continue button reads
  "Continue to 1774".
- **Deaths page empty state.** Confirm 2.4.1 auto-navs even on turn
  1; shows "No deaths or retirements this half-term." + Continue.
- **Auto-nav override priority.** During 2.1.1 with a live draft,
  confirm Draft page wins. During 2.9.6 with cc cursor active,
  confirm CC builder wins.
- **Cascade-then-player-decider.** When an auto event cascade ends
  at a player-decider node, verify the player eventually sees the
  decider modal (may need an extra Continue click — see Finding #1).
- **Spike 2 inaugural pill.** Start 1772, verify "Inaugural Draft —
  1772" + amber INAUGURAL pill + amber banner. Advance to 1776,
  verify "Draft — 1776" + slate ROOKIE pill + no banner.
- **Spike 2 1856 verification.** Start 1856, verify "Inaugural Draft
  — 1856" + amber pill on the startYear draft.
- **Spike 3 terminal endings.** Force each of `lost_war`,
  `dominion_autonomy`, `confederation_remains`. Verify the correct
  verbatim historian line in Panel 4. Force `__fallback` via save
  edit and verify it renders.
- **Spike 3 Replay Same Scenario.** Click button; verify the DB
  clears and a fresh scenario builds with the same factionId — no
  page reload, no New Game screen flash.
- **Spike 3 Export Save.** Click; confirm a JSON file downloads.
- **Spike 3 responsive layout.** Resize below md breakpoint (640px);
  verify Panel 1's two columns collapse and the recap remains
  scrollable.
