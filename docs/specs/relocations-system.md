# Spec: Relocations System

## Vision (as given)
Relocations today is dead code — phase 2.1.4 runs every turn but the `altState`
field it gates on is never populated anywhere (the only write is the
clear-on-success). Build a real Relocations system: factions move their free
politicians to other admitted states, with success odds scaled to region
distance and altState ties, carpetbagger risk on arrival, a hard cap of 5
attempts per faction per phase, persistent move history, and the same UX
patterns the Career Tracks redesign established (phase-locked resting window,
auto-nav, faction dropdown with read-only CPU views, feed, legend).

## Player experience
Each turn the game rests at the Relocations window and the player surveys the
map: that thin new state has no bench, and your fourth-best legislator is stuck
behind three stars in New York. Moving him is a calculated gamble — a
same-region hop with an altState tie is near-safe (75%, 2.5% stigma), while a
cross-country lunge at an open seat is a coin you mostly lose (20%, and a 30%
chance of a Carpetbagger label even when it lands). altStates are scarce,
seeded-at-birth assets you spend; the 5-attempt cap and one-try-per-politician
cooldown make every click count, and the feed shows rival factions running the
same playbook.

## User story
As a faction-running player, I want to move my free politicians to other
admitted states during the Relocations phase — seeing the exact success and
carpetbagger odds before I commit — so that I can chase open seats and shape
state benches instead of being stuck with draft-day geography.

## Verified engine facts (drive the design; architect must not re-derive)
- The snapshot **rests at `phaseId === '2.1.4'`** between Advance clicks
  (engine.ts:31 dispatches it with `return {}`; `advance()` runs the phase named
  by `phaseId` on the *next* click, then moves on). That resting window is the
  player's move window — same mechanism as careers (2.1.2). The 2.1.4 engine
  tick (CPU moves) therefore runs **after** the player's interactive moves.
- 2.1.4 has **no gate in `shouldRunPhase`** — it runs every turn, *including
  the 1772 first turn* (it is not in the first-turn skip list). One full phase
  cycle = +2 game years (`phases.ts:149`).
- Dead-code proof: `Politician.altState` (types.ts:215) is read only by
  `runPhase_2_1_4_Relocations` (phaseRunners.ts:440–459) and written only by
  its clear-on-success. No seeding exists; the phase has never fired.
- `snap.states` contains **admitted states only**; `admitState`
  (engine/territories.ts) appends from `EXPANSION_STATES_BY_ID` and never
  removes. `State.region` is the geography model (no adjacency data exists):
  1772 = Northeast(7)/Border(2)/South(4); 1856 adds Midwest(6) and West (CA is
  the **sole** West state).
- `pv.ts` already imports `POSITIVE_TRAITS`/`NEGATIVE_TRAITS` from types.ts
  (lines 2–5): adding a trait to `NEGATIVE_TRAITS` gives it −5 PV with **zero
  pv.ts changes**.
- Politician construction sites number **six**: politicians1772.ts (2),
  politicians1856.ts (2), draftImport.ts `instantiateDraftees` (1),
  phaseRunners.ts rookie gen (1) — plus the era-event `addPolitician`
  postEffect path. `instantiateDraftees` receives only `validStateIds` (a
  `Set<string>`, no regions), so constructor-time seeding would require a
  signature change there.
- `src/rng.ts` (`chance`, `pick`, `d100`) is the sanctioned RNG seam; rolls
  must execute in fixed order over `snap.politicians` array order so a future
  seeded RNG stays deterministic.

## Mechanics (decided values)

### Eligibility (binding)
A politician may attempt a move iff: alive (`!deathYear`), not retired
(`!retiredYear`), **not in office** (`!currentOffice`), and has a faction
(`factionId != null` — free agents never relocate). Destination must be in
`snap.states` (admitted only) and ≠ current state. Being on a career track does
**not** block moving and moving does not touch track state.

### altState seeding (open calls #1, #2 — decided: lazy at the 2.1.4 tick)
- **Buckets (locked)**: 40% same-region / 15% cross-region / 45% none, decided
  by a single partitioned roll. "Neighbor" = same `State.region` (no adjacency
  data exists). Same-region pick: uniform over admitted states in the home
  state's region minus home. Cross-region pick: uniform over admitted states
  outside the home region. If the chosen bucket's pool is empty (e.g. CA/West
  1856 for same-region), the politician gets **no altState** — no re-route.
- **Where (decided, deviates from the constructor sketch — see assumption #1)**:
  seeding runs **lazily at the top of every 2.1.4 tick**, over every living,
  non-retired politician with `altStateSeeded !== true` (any faction or none),
  in array order: roll the bucket, set `altState` (or leave unset), then set
  `altStateSeeded = true`. This is the **single** seeding site: it covers all
  six construction sites untouched, legacy saves (their politicians are simply
  "unseeded" and seed on the next 2.1.4), custom CSV imports, and admission
  timing (pool = states admitted at seed time). Cost: a politician created this
  turn (and every politician in a legacy save, once) spends their **first**
  relocation window unseeded — shown as "—", rolled as no-altState. Odds shown
  always equal odds rolled.
- **No repair() changes** (deviates from the user's lean — assumption #2):
  there is no destructive migration, the tick eagerly inits
  `relocations ??= []`, and repair() stays RNG-free per the careers precedent.

### Success roll — four bands (locked at defaults)
Band is computed from the **current** state's region vs the destination's, and
whether destination === the politician's `altState`:

| Band            | Condition                          | Success |
|-----------------|------------------------------------|---------|
| `sameRegionAlt` | same region, destination = altState | 75%    |
| `sameRegion`    | same region                         | 50%    |
| `crossRegionAlt`| cross region, destination = altState| 40%    |
| `crossRegion`   | cross region                        | 20%    |

Failure: politician stays put. Success: `p.state = destination`; `altState` is
**consumed (cleared) only when the destination IS the altState** (moving
elsewhere keeps the tie — see assumption #3). altStates are never re-seeded
after consumption.

### Carpetbagger risk (fires only on SUCCESS)
- Base: same region **5%**, cross region **30%**; multiplied by **0.5** when
  destination = altState → effective 2.5% / 5% / 15% / 30% by band.
- On hit, grant the **first trait in `CARPETBAGGER_POOL` order not already
  held**: `['Carpetbagger', 'Outsider', 'Controversial', 'Unlikable']`
  (deterministic ladder — first stigma is always Carpetbagger; repeat offenders
  compound; all four held → no trait, move still succeeds). See assumption #4.
- `'Carpetbagger'` and `'Outsider'` (both new) join the `Trait` union **and**
  `NEGATIVE_TRAITS` → −5 PV automatically via pv.ts's existing import. Both are
  PV-only (no other mechanics) and are gainable only through this system.

### Attempts, cap, cooldown (open calls #6, #9 — decided)
- **Cap**: `RELOCATION_ATTEMPTS_PER_TURN = 5` *attempts* (not successes) per
  faction per 2.1.4 phase, player and CPU alike.
- **Counter shape**: `GameState.relocationAttempts?: { year: number; counts:
  Record<string, number> }` (factionId → attempts). Lazily reset on first touch
  of a new year (player attempt or tick): if `year !== game.year`, replace with
  `{ year: game.year, counts: {} }`. Works because 2.1.4 occurs exactly once
  per turn and the year is unique per turn. Persisted on GameState so player
  attempts survive the per-attempt snapshot persists within the window; CPU
  counts are written by the tick so the badge is truthful on CPU views.
- **Cooldown shape**: `Politician.lastRelocationAttemptYear?: number`. An
  attempt (success OR failure) sets it to `game.year`; any politician with
  `lastRelocationAttemptYear === game.year` cannot attempt again. The next
  window has year +2, so the cooldown self-expires — exactly "one attempt per
  politician per Relocations phase, period".
- A failed **CPU gate roll** (below) is *not* an attempt: no counter increment,
  no cooldown. Only resolved success rolls count.

### Engine split (open call #10 — decided; state clearly for the architect)
One shared resolver owns all attempt mechanics — validation (phase is `2.1.4`,
eligibility, destination valid, cooldown clear, faction under cap), counter
increment, cooldown set, band computation, success roll, state change +
altState consumption, carpetbagger roll + ladder grant, and the feed append.
Two entry points:
- **Player path**: `attemptPlayerRelocation(snap, politicianId, destStateId):
  boolean` — adds a player-faction-only guard, then delegates. **No attempt
  gate**: the click IS the roll. Called from a new GameContext
  `attemptRelocation` that mirrors `setCareerTrack` (clone → engine call →
  return silently on `false` → setSnapshot + persist on `true`), used during
  the 2.1.4 resting window.
- **Tick path**: `runPhase_2_1_4_Relocations(snap)` rewritten — in order:
  (1) `relocations ??= []` eager init; (2) seed pass; (3) lazy counter reset;
  (4) CPU pass via the same resolver; (5) `refreshPv` (new traits move PV).
CPU and player attempts are mechanically identical given (politician,
destination); policy differs only in gating and destination choice.

### CPU policy (open call #5 — decided)
Runs inside the tick, CPU factions only (player faction never auto-moved),
iterating `snap.politicians` in array order, skipping ineligible politicians
and factions already at 5 attempts:
- **Has altState** (admitted, ≠ current): **30%** gate per window; destination
  = the altState.
- **No altState**: **10%** gate; destination = the "thin state" heuristic —
  admitted states minus current, ranked by (same region first, then fewest
  living non-retired residents, then state id). A cheap open-seat proxy:
  fewer residents = less competition for that state's offices.
- CPU respects cooldowns and the cap **identically to the player** — enforced
  structurally by the shared resolver, not by policy discipline.

### History feed + log policy
- Every resolved attempt (success or failure, both factions) appends a
  `RelocationEntry`; FIFO cap `RELOCATIONS_CAP = 200`.
- **No `addLog` calls anywhere in relocations code** — today's per-attempt
  'roll' logs are removed; the feed is the sole surface (careers no-spam
  precedent). Failed attempts DO appear in the feed (unlike careers' silent
  failed rolls): attempts are scarce and player-initiated, so the whiff is the
  drama and the cap accounting must be visible. See assumption #9.

## Acceptance criteria

### State & types (src/types.ts)
- [ ] `Politician` gains `altStateSeeded?: boolean` and
  `lastRelocationAttemptYear?: number` (both optional — legacy saves load
  unchanged).
- [ ] `GameState` gains `relocations?: RelocationEntry[]` and
  `relocationAttempts?: { year: number; counts: Record<string, number> }`.
- [ ] New `RelocationEntry`: `{ year, politicianId, factionId, fromState,
  toState, band, success, traitsGained: Trait[] }` where `band:
  'sameRegionAlt' | 'sameRegion' | 'crossRegionAlt' | 'crossRegion'`
  (refines the sketched `reason` — see assumption #5), `factionId` is the
  faction at move time (feed filters on it), `fromState`/`toState` are state
  ids, and `traitsGained` is empty on failure / at most one entry in v1.
- [ ] New exported consts — single source for engine AND legend:
  `RELOCATION_ODDS` (`success` four bands 0.75/0.5/0.4/0.2; `carpetbagger`
  sameRegion 0.05, crossRegion 0.3, altStateFactor 0.5; `seed` sameRegion 0.4,
  crossRegion 0.15, remainder none; `cpuGate` withAltState 0.3,
  withoutAltState 0.1), `RELOCATION_ATTEMPTS_PER_TURN = 5`,
  `RELOCATIONS_CAP = 200`, `CARPETBAGGER_POOL` (ladder order as listed above).
- [ ] `'Carpetbagger'` and `'Outsider'` added to the `Trait` union and to
  `NEGATIVE_TRAITS`; no pv.ts edit (verified it already imports the lists).

### Engine (src/engine/phaseRunners.ts — rewrite runPhase_2_1_4_Relocations)
- [ ] Tick order is exactly: eager `relocations ??= []`; seed pass; lazy
  counter reset; CPU pass; `refreshPv`. All passes iterate `snap.politicians`
  in array order; all randomness via `src/rng.ts`.
- [ ] Seed pass: every living, non-retired politician with
  `altStateSeeded !== true` gets one 40/15/45 bucket roll; same-region/cross-
  region picks are uniform over the defined pools; empty pool → no altState;
  `altStateSeeded` is set to `true` in all cases and never re-rolled.
- [ ] Shared resolver enforces, in order: `phaseId === '2.1.4'`, eligibility
  (alive, not retired, no office, has faction), destination in `snap.states`
  and ≠ current, `lastRelocationAttemptYear !== game.year`, faction count < 5.
  On pass: increments the faction's count, sets `lastRelocationAttemptYear`,
  computes the band, rolls success then (on success only) carpetbagger — fixed
  roll order — applies `p.state`, consumes altState iff destination ===
  altState, grants the ladder trait, and appends the feed entry (success and
  failure both), trimming oldest past 200.
- [ ] `attemptPlayerRelocation` returns `boolean`, rejects non-player-faction
  politicians, has **no attempt gate**, and is the only player mutation path;
  GameContext `attemptRelocation` delegates and skips persist on `false`.
- [ ] CPU pass: 30%/10% gates and thin-state heuristic as specified; failed
  gates consume nothing; CPU never moves player-faction politicians or
  exceeds the cap/cooldown (same resolver).
- [ ] No `addLog` calls remain in relocations code (existing per-attempt logs
  deleted); the only writers of `altState` are the seed pass and consumption.
- [ ] `refreshPv` runs after any attempt that granted a trait (player path)
  and at tick end, so Carpetbagger/Outsider PV hits (−5) apply immediately.

### Player agency & locking
- [ ] Player moves are possible only while `game.phaseId === '2.1.4'` —
  engine-enforced, with UI controls disabled outside the window (exact careers
  pattern). The page stays fully viewable at all times.
- [ ] Per-cause disabled tooltips on Move, precedence: non-player view ("You
  can only manage your own faction") → phase lock ("Moves open during the
  Relocations phase") → in office ("In office") → cooldown ("Already attempted
  this turn") → cap ("No attempts remaining this phase (5/5)").
- [ ] Clicking Attempt resolves immediately (no confirm step); the result is
  visible in the same render: new feed entry (success/fail), row status flips
  to "On cooldown", attempts badge increments.
- [ ] Attempts and cooldowns survive mid-window save/load (persisted state,
  not component state).

### Auto-navigation (src/App.tsx)
- [ ] Third ref-keyed effect alongside draft (2.1.1) and careers (2.1.2): when
  resting at `phaseId === '2.1.4'`, key `${year}:2.1.4`, navigate to
  `'relocations'` once per entry; ref resets on any other phase; navigating
  away mid-window does not yank back; fires even with nothing to do (empty
  state line shown).

### Relocations page (new src/pages/Relocations.tsx)
- [ ] New `'relocations'` PageId wired in registry.ts (union + Pages map) and
  a "Relocations" Sidebar entry under "Your Faction", directly **after Career
  Tracks** (Roster, Faction Leader, Career Tracks, Relocations, Kingmakers &
  Protégés, Draft) — open call #7 decided.
- [ ] Header: faction dropdown (player first, "(you)" suffix), `PartyBadge`,
  and an "Attempts: X / 5" badge for the **viewed** faction (amber styling at
  5/5). X reads `relocationAttempts` only when its `year === game.year`, else 0.
- [ ] `SortableTable` roster of the viewed faction's living, non-retired
  politicians (in-office rows listed but disabled): Name, State, Age, Ideology
  (IDEOLOGY_ORDER sort), PV, the six skills, Traits (negatives red — careers
  styling), Alt State (uppercase abbr badge, or "—" when none/unseeded),
  Status (Free / In office / On cooldown), and a Move button column.
- [ ] Move flow (decided: **inline panel**, not a modal): clicking Move opens
  a single destination picker panel ("Moving: {name} ({ST})") listing all
  admitted states minus the current one — altState option labeled (e.g.
  "Virginia — alt state") and listed first, then same-region states, then the
  rest alphabetically — with a **live "Success: NN% · Carpetbagger risk: NN%"**
  readout computed from `RELOCATION_ODDS` that exactly matches the engine math
  for the selected destination, plus Attempt and Cancel buttons. One panel open
  at a time; clicking another row's Move repoints it.
- [ ] Recent moves feed: `(game.relocations ?? [])` filtered to the viewed
  faction, `slice(-20).reverse()`: year, politician name, FROM → TO (uppercase
  abbrs), Success/Failed badge, traits gained as red badges.
- [ ] Legend `<details>` rendered from the types.ts consts (no hardcoded
  numbers): the four success bands, carpetbagger risk per band including the
  altState halving (2.5/5/15/30), what altState means + the 40/15/45 seeding,
  the 5-attempt faction cap, the one-attempt-per-politician cooldown, the
  phase lock, the no-office rule, and altState consumption on moving to it.
- [ ] Empty state: player view with zero eligible politicians shows a line
  (e.g. "No free politicians to relocate"); feed and legend still render.
- [ ] CPU faction view is fully read-only: Move disabled (not hidden) with the
  faction tooltip; feed, badge, and legend all render.

### Definition of done (per CLAUDE.md)
- [ ] `npm run build` passes.
- [ ] Playtested in 1856: reach the 2.1.4 window (auto-nav fires), verify live
  odds for a same-region and a cross-region destination, succeed and fail
  moves, hit the 5-cap and the cooldown tooltip, advance and inspect a CPU
  faction's feed/attempt badge, confirm the lock outside 2.1.4, and reload
  mid-window (counter intact, auto-nav refires). 1772 smoke test: first turn
  reaches 2.1.4 with the inaugural class (all "—" altStates), no crash; turn 2
  shows seeded altState badges.

## Edge cases
- **Sole-state region (CA/West, 1856)**: same-region seed bucket is empty (→
  no altState) and the same-region bands are unreachable from/to CA; all CA
  moves are cross-region. Must not crash or mislabel odds.
- **1772 first turn**: 2.1.4 runs turn 1; the entire inaugural class is
  unseeded during the player's first window (all "—", no-alt odds), then the
  tick seeds everyone and the CPU may immediately use fresh altStates that
  same tick. Player's first altState-informed window is turn 2.
- **Unseeded vs none**: both display "—"; indistinguishable by design (odds
  shown = odds rolled). Self-resolves after one tick.
- **No state-roster cleanup needed**: movers can never hold office, so
  `senators`/`representativeIds`/`governorId` are untouched by a move.
- **Same-turn election ripple**: a politician moved at 2.1.4 is a candidate of
  the new state in this turn's 2.9.x — intended (open-seat hunting pays off
  immediately). No election/PV formula changes; the feature only changes
  `p.state` and adds two negative traits.
- **No destination capacity**: multiple politicians (any factions) may move to
  the same state in the same phase.
- **altState invariants**: never equals the current state (seed excludes home;
  reaching it consumes it). If a hand-edited save holds an altState not in
  `snap.states`, it confers no band/odds benefit and the resolver still
  validates the chosen destination independently.
- **Faction conversion (2.1.6) after a move**: feed entries keep the stored
  `factionId` (careers precedent); cooldown field travels with the politician.
- **All four carpetbagger traits already held**: hit grants nothing; move
  still succeeds; feed entry has empty `traitsGained`.
- **Cap interplay**: player spends all 5 → CPU factions are unaffected (cap is
  per faction); player spends 0 → CPU still limited to its own 5.
- **FIFO trim at 200** is invisible in normal play (feed shows 20); documented
  for the architect.
- **Dead/retired politicians**: never seeded, never moved, filtered from the
  roster; their historical feed entries remain.

## Out of scope
- **Era/regional flavor on carpetbagger draws** (e.g. North→South 1856
  harsher odds or nastier traits) — open call #8: explicitly **deferred**;
  the band/halving math is region-blind in v1.
- altState **re-seeding** after consumption, multiple altStates, or any way to
  acquire one in play (one-time birth asset in v1).
- Moving in-office politicians (no resign-to-move flow); forced/strategic CPU
  moves of player politicians; faction-ordered mass migrations.
- Travel time, multi-turn moves, or move costs (no economy exists).
- Event-log (`EventEntry`) entries for relocations — feed is the sole surface;
  today's 2.1.4 logs are removed, not replaced.
- Dataset/authoring pipeline changes: the new traits are not added to
  `scripts/` heuristics or the draft dataset; no regeneration required.
- Map visualization, sidebar badges for pending moves, cross-faction
  comparison dashboards; mobile layout polish.
- Seeding/replacing `src/rng.ts`'s Math.random backing (route through helpers
  only, fixed roll order preserved).

## Open questions / assumptions
Riskiest first:
1. **Lazy seeding at the 2.1.4 tick, not at construction.** The vision's
   headline said "seeded at politician creation", but the codebase note
   delegated the final call. I chose tick-time seeding (per-politician
   `altStateSeeded` sentinel): one code site instead of six-plus constructors,
   no `instantiateDraftees` signature change (it lacks region data), natural
   admission timing, and it makes legacy back-seeding automatic. Cost: every
   politician's *first* window after creation (and one window for all legacy
   politicians) is altState-less. Confirm at checkpoint.
2. **No repair() changes at all** (user leaned yes on a sentinel-gated
   back-seed). Superseded by #1 — legacy politicians are just "unseeded" and
   the tick handles them; repair() stays RNG-free (careers precedent) and the
   `relocations == null` sentinel is unnecessary since no destructive
   migration exists.
3. **altState survives moves to other destinations** — consumed only when the
   destination IS the altState. "Consumed on successful move, as today" was
   ambiguous (today the altState is the only possible destination); keeping it
   preserves a deliberate asset the player can still play toward, and band
   math recomputes naturally against the new home region.
4. **Carpetbagger ladder, not a random pool draw**: always `Carpetbagger`
   first, then Outsider → Controversial → Unlikable (first not held). Zero
   extra RNG, strong theming, repeat offenders compound. If random flavor is
   preferred, it's a one-line change to a uniform pick.
5. **`reason` renamed to `band`** with the four values matching
   `RELOCATION_ODDS.success` keys — the sketched 3-value `reason` lost
   same-vs-cross info on altState moves; band keys let the feed/legend show
   the exact odds used.
6. **CPU numbers I chose**: 30% gate with altState (destination = altState
   always), 10% gate without (thin-state heuristic: same region first, fewest
   living residents, state-id tie-break — a proxy for open-seat hunting since
   counting actual vacancies is complex). Expected ~2–3 CPU attempts per
   faction per turn, under the cap most turns; altState consumption makes
   churn decline over a campaign. Needs playtest sign-off on volume.
7. **Counter shape** `{ year, counts }` with lazy first-touch reset (no
   phase-entry hook exists); CPU counts persisted so the badge is truthful on
   CPU views after the tick (they read 0 during the player's window because
   CPU attempts genuinely haven't happened yet).
8. **Cooldown shape** `lastRelocationAttemptYear === game.year` blocks —
   self-expiring via the +2 year advance; doubles as the "On cooldown" status
   for the rest of the turn (accurate: attempts are locked outside 2.1.4
   anyway).
9. **Failed attempts appear in the feed** (careers hides failed rolls). Here
   failures spend a capped resource and the player pulled the trigger — hiding
   them would make the cap unreadable.
10. **No logs at all** (existing 2.1.4 per-attempt logs deleted, lean-minimal
    per the vision). If players miss a turn-summary line, add a single
    aggregate log later rather than per-attempt spam.
11. **Free agents (factionId null) never relocate** — today's dead code would
    have moved them; relocations are faction programs (matches the careers
    accrual invariant).
12. **Triple auto-nav on draft turns** (draft → careers → relocations) is the
    accepted rhythm cost; keys are phase-scoped so the effects can't fight,
    but watch the stacking in playtest (flagged previously in the careers
    brief).
13. **Locked numbers within delegated ranges**: seed 40/15/45 (empty pool →
    none, no re-route), bands 75/50/40/20, carpetbagger 5/30 with ×0.5 altState
    halving (→ 2.5/15), cap 5, feed 20, history cap 200.
14. **New traits are PV-only** (−5 each via the existing pv.ts list import)
    and only gainable through relocation hits — no dataset, career-pool, or
    special-mechanic appearances.
