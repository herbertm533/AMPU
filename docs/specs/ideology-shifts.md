# Spec: Ideology Shifts (Phase 2.1.5)

> This feature **deliberately clones the Relocations architecture end-to-end**
> (`docs/specs/relocations-system.md`, `docs/briefs/relocations-system.md`).
> Wherever a pattern repeats below it is called out as "(relocations pattern)";
> the architect should diff against the relocations brief rather than redesign.

## Vision (as given)
Phase 2.1.5 is a placeholder: a flat 5% coin-flip random walk
(phaseRunners.ts:593) that ignores the "faction environment" its description
promises and erodes seeded historical ideologies into noise. Replace it with
environment-driven passive drift PLUS active faction agency: 5 shift attempts
per faction per phase (binding), usable on your own roster (pull strays toward
your faction's center) or against opposing factions' politicians (drag them
toward YOUR center, risking a Flip-Flopper PV penalty on the victim) — built on
the exact Career Tracks / Relocations patterns: resting-window player phase,
shared resolver, attempt cap + subject lock, persistent feed, odds-const legend,
lazy trait seeding, fourth auto-nav.

## Player experience
Each turn the game rests at the Ideology Shifts window. Your roster slowly
breathes with its environment — members drift toward your faction's center of
gravity, and politicians in hard-lean states feel the home-state pull — so the
world cools toward coherent blocs instead of dissolving into noise. On top of
that you get 5 attempts to spend as agency: consolidate your own strays
(65%, safe), or reach across the aisle and wrench a rival's star legislator one
step toward you (15%, and a 50% shot at branding them a flip-flopper, −5 PV).
Legislators are the prize: every ideology step closer means their floor votes
break your way more often, and rival factions are running the same playbook
against you.

## User story
As a faction-running player, I want to spend a capped budget of ideology-shift
attempts on my own and rival politicians during the Ideology Shifts phase —
seeing the exact success and flip-flopper odds before I commit — so that I can
build a coherent voting bloc and erode opposing factions instead of watching
ideologies random-walk.

## Verified engine facts (drive the design; architect must not re-derive)
- Current runner `runPhase_2_1_5_Ideology` (phaseRunners.ts:593–611): flat 5%
  random walk with per-politician `addLog`s + a summary log. **Delete wholesale**
  (logs removed, not replaced — relocations precedent).
- The snapshot **rests at `phaseId === '2.1.5'`** between Advance clicks
  (engine.ts:32 dispatches with `return {}`). That resting window is the
  player's attempt window; the tick (seeding + CPU + drift) fires on the Advance
  out — exact relocations mechanism. 2.1.5 has no `shouldRunPhase` gate and
  **runs on the 1772 first turn** (not in the skip list, phases.ts:111–119).
- `IDEOLOGY_ORDER` (types.ts:14): 7 entries, index 0 = LW Populist … 6 = RW
  Populist. Ideology is **not** a PV input (`computePV` never reads it) — a
  shift alone never changes PV; PV moves only via `flipFlopperPenalty` (−5 per
  stack, pv.ts:82) and the two new traits.
- `flipFlopperPenalty: number` (types.ts:250): +1 on 2.1.6 conversions
  (phaseRunners.ts:626); decays −1/turn in 2.1.3 (phaseRunners.ts:429) which
  runs **before** 2.1.5 each turn (and is skipped on the 1772 first turn) — so
  a stack inflicted here survives through this turn's elections and decays next
  turn. A separate permanent `'Flip-Flopper'` trait exists in `NEGATIVE_TRAITS`
  and `CAREER_RANDOM_NEGATIVES`; this feature does **not** grant it (v1).
- 2.1.8 (phaseRunners.ts:650) recomputes `Faction.personality` every turn
  **after** 2.1.5 from the member-average ideology index (<2.5 LW, >4.5 RW,
  else Center) — note it filters only on `factionId` (dead members included).
- Floor votes (phaseRunners.ts:1238): members lose 5% yea-probability per
  ideology step of distance from the sponsor — opposed shifts have real
  legislative payoff.
- `State.bias: number`: positive = red lean, negative = blue lean (StatesPage
  shows ±X.XR/D). Mapping for pull direction: **red = higher ideology index
  (toward RW Populist), blue = lower**. Observed magnitudes: 1856 from −2.6
  (MS) to +1.6 (VT/WI) with swing states near 0; 1772 from −1.5 (GA) to +1.5
  (MA); expansion states 0.
- Relocations precedent files for every cloned pattern: phaseRunners.ts 440–588
  (`attemptCounts`, `relocationOdds`, `recordRelocation`, `resolveRelocation`,
  `attemptPlayerRelocation`, tick), `Relocations.tsx`, GameContext
  `attemptRelocation` (335–343), App.tsx third auto-nav (56–67),
  `RELOCATION_*` consts in types.ts (184–194).
- `src/rng.ts` (`rand`/`chance`/`pick`/`d100`) is the only RNG seam; all passes
  iterate `snap.politicians` / `snap.factions` in array order (determinism).

## Mechanics (decided values)

### Faction center (open call #2 — decided)
- **Definition**: mean `IDEOLOGY_ORDER` index over the faction's **living,
  non-retired** members, rounded to the nearest integer (`Math.round`). A
  faction with zero living members has **no center** (`null`) — faction pull,
  self shifts toward it, and opposed shifts toward it are all invalid.
  (Deviates from 2.1.8's unfiltered average, which counts dead members — see
  assumption #3; 2.1.8 itself is untouched.)
- **Shared pure helper** (relocations `relocationOdds` pattern): one exported
  function in phaseRunners.ts, e.g. `factionCenter(snap, factionId): number |
  null`, used by the tick, the resolver, AND the page — so the UI preview is
  structurally the number the engine rolls against.
- **Computed when**: the drift pass uses a center map computed **once at tick
  start** (stable targets across the pass). Active attempts (player and CPU)
  compute the center **live at attempt time** via the helper — matching what
  the page preview shows at click time.
- Drift stops **at** the center: the faction pull is a single step and is only
  applicable when off-center, so it can never overshoot (structural). The
  state pull and residual drift are NOT center-bound and may move a politician
  away from / past their faction center — environment fights cohesion by design.

### Passive drift (fires in the 2.1.5 tick — replaces the random walk)
Per living, non-retired politician, in array order, **at most one step of
movement per turn**, resolved as a cascade where the first success ends the
chain (open call #3 — decided; see assumption #4):
1. **Faction pull — 8%**: applicable iff the politician has a faction with a
   defined center AND is not at it. Fires → one step toward the center.
2. **State pull — 4%**: reached only if rung 1 was inapplicable or its roll
   missed. Applicable iff the home state's `|bias| >= 1.0` (the `stateBiasMin`
   threshold — fires in 17/31 1856 states and 4/13 1772 colonies; swing and
   expansion states never pull) AND the step is possible (not already at the
   scale end in the pull direction). Fires → one step toward the lean (bias > 0
   → +1 index, bias < 0 → −1).
3. **Residual drift — 1%**: reached only if rungs 1–2 were inapplicable or
   missed. Direction 50/50; a step off the scale end is a no-op (not recorded).
   Kept so the world never fully calcifies.
- Exclusions: dead/retired; politicians **subject-stamped this year** by an
  active attempt (binding); `Ideologue` trait holders (immune to the whole
  cascade). **In-office politicians DO drift** (binding). `isHistorical` is
  never consulted (binding). Factionless politicians: rung 1 never applies —
  they get state pull + residual only.
- **No flip-flopper penalty for ANY passive drift** (binding).
- `Impressionable` doubles each rung's chance (8→16 / 4→8 / 1→2%).
- Each **movement** (only movements — failed/no-op rolls are not recorded)
  appends a feed entry: kind `'drift'` for rungs 1 and 3, `'stateBias'` for
  rung 2, `success: true`, no `actorFactionId`, `flipFlopper: false`.

### Active attempts — one shared resolver, both kinds, player and CPU
(`resolveRelocation` precedent; direction rule unified: every active attempt
moves the subject **one step toward the ACTOR's faction center**.)
- **SELF** (subject's faction === actor's): success **65%**. NO flip-flopper
  risk (binding). Invalid if the subject is already at the actor's center.
- **OPPOSED** (subject belongs to a DIFFERENT faction): success **15%**, pulls
  toward the **attacker's** center (open call #4 — confirmed). On success, a
  second roll at **50%** inflicts `flipFlopperPenalty += 1` on the target —
  the real mechanic: −5 PV per stack via pv.ts:82, decaying one stack per turn
  in 2.1.3, exactly like 2.1.6 conversions. Invalid if the target is already
  at the attacker's center (nothing to gain — confirmed). Targets must belong
  to some other faction (factionless politicians are not opposed-targetable).
- **No permanent 'Flip-Flopper' trait escalation in v1** (open call #5 —
  decided: penalty-counter only; trait escalation deferred to out-of-scope).
- **In-office politicians ARE valid subjects for both kinds** (binding —
  legislators are the point; floor votes lose 5% support per ideology step).
- Subject trait multipliers on the success roll: `Ideologue` ×0.5 self
  (→32.5%), ×0.25 opposed (→3.75%); `Impressionable` ×1 self, ×2 opposed
  (→30%). The FF risk roll (50%) is NOT trait-modified.
- Eligibility: subject alive, not retired; actor faction has a defined center;
  office status irrelevant.

### Attempts cap, subject lock, phase lock (relocations pattern)
- **Cap**: `IDEOLOGY_ATTEMPTS_PER_TURN = 5` **attempts** (not successes) per
  faction per 2.1.5 phase (binding), player and CPU alike. Counter shape:
  `GameState.ideologyAttempts?: { year: number; counts: Record<string, number> }`
  keyed by **actor** faction, lazy first-touch year reset, persisted so player
  attempts survive mid-window saves — exact `relocationAttempts` clone.
- **Subject lock**: one attempt per politician per turn **as subject**,
  regardless of attacker — first faction to act locks the subject.
  `Politician.lastIdeologyAttemptYear?: number` (year-stamp, relocations
  cooldown pattern; renamed from the sketched `lastIdeologyShiftYear` — see
  assumption #8). Set on every resolved attempt, success or failure. Passive
  drift **skips** stamped politicians but does **not** write the stamp (drift
  is the last actor in the turn; stamps self-expire at year +2).
- **Phase lock**: attempts valid only while `phaseId === '2.1.5'` —
  engine-enforced in the resolver, UI tooltip outside the window. Player path
  has **no gate**: the click IS the roll (binding).
- A failed CPU **gate** roll is not an attempt (no counter, no stamp, no feed) —
  relocations precedent.

### New traits + lazy seeding (relocations altState pattern)
- **`Ideologue`** → `Trait` union + **`POSITIVE_TRAITS`** (+4 PV via pv.ts's
  existing import, zero pv.ts edits): immune to passive drift; self ×0.5;
  opposed ×0.25. Conviction is an electoral asset and an anti-tamper shield —
  but it also resists your own consolidation (lean confirmed: self resisted).
- **`Impressionable`** → `Trait` union + **`NEGATIVE_TRAITS`** (−5 PV):
  drift rungs ×2; opposed ×2; self ×1 (the trait makes you a target, not a
  better student — also avoids clamping 65%×2; see assumption #6).
- **Seeding**: lazy one-shot pass at the top of every 2.1.5 tick, per-politician
  sentinel `Politician.ideologyTraitsSeeded?: boolean` — exact relocations
  `altStateSeeded` pattern. One partitioned roll per living, non-retired,
  unseeded politician: **10% Ideologue / 8% Impressionable / 82% neither**
  (mutually exclusive). Politicians already holding either trait are skipped
  (sentinel still set). No dataset regen, no constructor edits, covers legacy
  saves, **NO repair() changes** (binding). Traits change PV, so the tick-end
  `refreshPv` covers the seed pass.
- Existing traits (e.g. 'Puritan') are NOT modifiers in v1 (decided — out of
  scope).

### Engine split (open call #10 — decided; state clearly for the architect)
All numbers live in types.ts as `IDEOLOGY_SHIFT_ODDS` (single source for engine
AND legend). One shared private resolver, e.g.
`resolveIdeologyShift(snap, actorFactionId, p): IdeologyShiftEntry | null`,
owns all attempt mechanics: validation (phase `2.1.5`, subject alive/not
retired, actor center defined, kind derived from subject-vs-actor faction,
kind-specific at-center invalidity, subject lock clear, actor under cap),
counter increment, subject stamp, trait-modified success roll, the step apply,
the opposed FF roll + `flipFlopperPenalty += 1`, and the feed append (success
AND failure; failed attempts record `from === to`, `success: false`). Two entry
points:
- **Player path**: `attemptPlayerIdeologyShift(snap, politicianId): boolean` —
  actor is always the player's faction; kind derived from the subject's
  faction; refreshes PV only when FF was inflicted; called from a new
  GameContext `attemptIdeologyShift` cloning `attemptRelocation` (deep clone →
  engine call → return silently on `false` → setSnapshot + persist on `true`).
  **Exact `attemptPlayerRelocation` boolean contract (binding): `true` = the
  attempt RAN — a failed roll returns `true` and HAS mutated counter + stamp +
  feed and must persist; `false` = rejected, nothing meaningful changed.**
- **Tick path**: `runPhase_2_1_5_Ideology(snap)` rewritten — exact order (open
  call #9 — decided): (1) eager `ideologyShifts ??= []`; (2) trait-seed pass;
  (3) lazy counter reset; (4) CPU pass via the resolver (live centers);
  (5) passive drift pass over unstamped politicians using a tick-start center
  map; (6) one unconditional `refreshPv` (covers seeded traits + CPU FF hits —
  drift alone never moves PV); (7) at most ONE summary `addLog` line, emitted
  only when the tick produced ≥1 drift or CPU attempt (e.g. "Ideological
  currents: N politicians drifted; M shift attempts resolved."). No other logs
  anywhere in 2.1.5 code (binding: per-politician logs dropped).

### CPU policy (open call #7 — proposed)
Runs inside the tick, CPU factions only, `snap.factions` array order, all
attempts through the shared resolver (cap + subject lock re-validated
structurally, never by policy discipline). Per faction:
- **Self pass first**: own strays (living, non-retired, off-center, unstamped),
  sorted by distance-from-center desc, then PV desc, then id. Per stray a
  **30% gate** (`cpu.selfGate`); stop after **3** self attempts
  (`cpu.selfBudget` — reserves cap room for attacks) or at the cap.
- **Opposed pass**: candidate targets = politicians of OTHER factions
  (**including the player's — binding: CPUs DO target the player**) that are
  alive, non-retired, **in office** (`currentOffice != null` — the
  high-PV-officeholder heuristic), not at this faction's center, unstamped;
  sorted PV desc, then id; scan the top **10** (`cpu.opposedScan`) with a
  **10% gate** each (`cpu.opposedGate`), until the cap.
- Expected volume ≈ 3 self + ~1 opposed attempts per CPU faction per turn —
  under the cap most turns. **Flag (binding to playtest)**: this churns faction
  personality via the 2.1.8 rollup and floor votes via ideology distance — same
  playtest sign-off relocations needed (risk #1).

### History feed + log policy
- `GameState.ideologyShifts?: IdeologyShiftEntry[]`, FIFO cap
  `IDEOLOGY_SHIFTS_CAP = 200` (recordRelocation trim pattern). Every resolved
  active attempt (success or failure, all factions) and every passive
  **movement** appends an entry. Drift entries are kind-tagged
  (`'drift'`/`'stateBias'`), have no `actorFactionId`, and are always
  `success: true` (confirmed shape — failed drift rolls are non-events).
- Feed filter semantics (open call #6 — decided): the page shows entries where
  the viewed faction is the **actor OR the subject** — so your view shows your
  drifts, your self shifts, your attacks, and attacks against you.
- Failed active attempts record `fromIdeology === toIdeology` with
  `success: false` (confirmed).

## Acceptance criteria

### State & types (src/types.ts)
- [ ] `Trait` union gains `'Ideologue'` and `'Impressionable'`; `'Ideologue'`
  joins `POSITIVE_TRAITS`, `'Impressionable'` joins `NEGATIVE_TRAITS`; zero
  pv.ts edits (it already imports both lists).
- [ ] `Politician` gains `ideologyTraitsSeeded?: boolean` and
  `lastIdeologyAttemptYear?: number` (both optional — legacy saves load
  unchanged; no repair() changes).
- [ ] `GameState` gains `ideologyShifts?: IdeologyShiftEntry[]` and
  `ideologyAttempts?: { year: number; counts: Record<string, number> }`.
- [ ] New `IdeologyShiftEntry`: `{ year, politicianId, subjectFactionId:
  string | null, actorFactionId?: string, kind: 'drift' | 'stateBias' | 'self'
  | 'opposed', fromIdeology: Ideology, toIdeology: Ideology, success: boolean,
  flipFlopper: boolean }`.
- [ ] New exported consts — single source for engine AND legend, zero
  hardcoded numbers in JSX: `IDEOLOGY_SHIFT_ODDS` covering drift
  (faction 0.08, state 0.04, residual 0.01, stateBiasMin 1.0), self 0.65,
  opposed (success 0.15, ffRisk 0.5), trait multipliers (Ideologue drift 0 /
  self 0.5 / opposed 0.25; Impressionable drift 2 / self 1 / opposed 2), seed
  rates (ideologue 0.10, impressionable 0.08, remainder none), and CPU policy
  (selfGate 0.3, selfBudget 3, opposedGate 0.1, opposedScan 10);
  `IDEOLOGY_ATTEMPTS_PER_TURN = 5`; `IDEOLOGY_SHIFTS_CAP = 200`. (Architect
  may refine internal key naming; values are locked pending checkpoint.)

### Engine (src/engine/phaseRunners.ts — replace lines 593–611 wholesale)
- [ ] Exported pure `factionCenter(snap, factionId)` (living, non-retired
  member mean index, `Math.round`, `null` when empty) and an exported pure
  odds helper that, given a subject + kind + actor center, returns the
  trait-modified success %, the FF risk (opposed), and the from → to
  ideologies — used by BOTH the resolver and the page (relocations
  `relocationOdds` pattern: odds shown are structurally the odds rolled).
- [ ] Shared resolver enforces, in order: phase `2.1.5`; subject alive and not
  retired; actor center defined; kind = self iff subject faction === actor
  (opposed requires a different, non-null subject faction); subject not at the
  actor's center; `lastIdeologyAttemptYear !== year`; actor count < 5. On
  pass: charge counter, stamp subject, roll trait-modified success; on success
  apply one step toward the actor's center; on opposed success roll FF (50%) →
  `flipFlopperPenalty += 1`; append the feed entry (success and failure, FIFO
  trim at 200). No `addLog`, no `refreshPv` inside the resolver.
- [ ] `attemptPlayerIdeologyShift(snap, politicianId): boolean` — actor =
  player faction, no attempt gate, refreshes PV only when FF inflicted;
  boolean contract as specified (true = ran, even on a failed roll); the only
  player mutation path. GameContext `attemptIdeologyShift` delegates and skips
  persist on `false` (exact `attemptRelocation` clone).
- [ ] Rewritten tick runs exactly: eager init → trait-seed pass (partitioned
  10/8 roll, sentinel set always, skip dead/retired and already-holders) →
  lazy counter reset → CPU pass (self budget then opposed scan, per the
  policy) → drift pass (cascade, tick-start center map, skips dead/retired,
  stamped, and Ideologues; in-office included; factionless get state+residual
  only) → one `refreshPv` → at most one summary log. All passes in array
  order; all randomness via rng.ts; no per-politician logs remain.
- [ ] Passive drift never inflicts flip-flopper penalties, never writes the
  subject stamp, never overshoots the faction-pull center, records only actual
  movements, and produces at most one step per politician per tick.
- [ ] `engine.ts`, `phases.ts`, `pv.ts`: **no changes** (2.1.5 already
  dispatches with `return {}`, has no gate, runs the 1772 first turn).

### Player agency & locking
- [ ] Player attempts possible only while resting at `phaseId === '2.1.5'`
  (engine-enforced; UI disabled with tooltip outside the window; page stays
  viewable at all times).
- [ ] Per-cause disabled tooltips on the action button, precedence (vision
  order): phase lock ("Shifts open during the Ideology Shifts phase") → cap
  ("No attempts remaining this phase (5/5)") → already attempted ("Already
  attempted this turn") → at center ("Already at your faction's center").
  In-office is NOT a disable cause. Degenerate guard: player center undefined
  → disabled ("Your faction has no living members").
- [ ] Clicking Attempt resolves immediately; the result is visible in the same
  render (feed entry, status flips to "Attempted this turn", badge increments).
- [ ] Attempts and subject stamps survive mid-window save/load (persisted
  state, not component state).

### Auto-navigation (src/App.tsx)
- [ ] FOURTH ref-keyed effect alongside draft / careers / relocations: resting
  at `phaseId === '2.1.5'`, key `` `${year}:2.1.5` ``, navigate to
  `'ideology'` once per entry; ref resets on any other phase; no yank-back
  after navigating away; fires even with nothing to do.

### Ideology Shifts page (new src/pages/IdeologyShifts.tsx)
- [ ] New `'ideology'` PageId wired in registry.ts (union + Pages map) and an
  "Ideology Shifts" Sidebar entry directly **after Relocations** (Roster,
  Faction Leader, Career Tracks, Relocations, Ideology Shifts, Kingmakers &
  Protégés, Draft).
- [ ] Header: title "Ideology Shifts"; faction dropdown (player first, "(you)"
  suffix); `PartyBadge`; "Attempts: X / 5" badge — **always the PLAYER's own
  count** (you spend your attempts regardless of the viewed roster — deliberate
  deviation from the relocations viewed-faction badge), amber at 5/5; reads
  `ideologyAttempts` only when `year === game.year`, else 0.
- [ ] The dropdown is FUNCTIONAL, not read-only: own-faction view → "Shift"
  action per row (self kind, toward your center); other-faction view →
  "Target" action per row (opposed kind, toward YOUR center, FF risk shown).
  The reference center for status and previews is therefore always the
  player's faction center, in both views.
- [ ] `SortableTable` of the viewed faction's living, non-retired politicians:
  Name, St, Age, Ideology (IDEOLOGY_ORDER sort), PV, Traits (negatives red),
  FF stacks (`flipFlopperPenalty` shown only when > 0), Status
  (Available / Attempted this turn / At center — stamped takes precedence over
  at-center), Action button with the per-cause tooltips above. In-office rows
  fully actionable. No skills columns (vision's column list).
- [ ] Inline confirm card (relocations picker pattern — one open at a time, no
  destination select since the target ideology is determined): politician
  name, `{from} → {to}` ideology arrow, live "Success: NN%" (+ "Flip-flopper
  risk on success: NN%" on opposed), Attempt / Cancel; odds and the to-step
  computed from the SAME exported pure helpers the resolver rolls
  (trait-modified, so an Ideologue target previews 3.75%).
- [ ] Feed: `(game.ideologyShifts ?? [])` filtered to entries where the viewed
  faction is actor OR subject, `slice(-20).reverse()`: year, kind badge
  (Drift / State / Self / Opposed), politician name, from → to (from === to on
  failures), Success/Failed badge, red "Flip-Flopper +1" badge when
  `flipFlopper`. Drift entries appear. Empty state: "No ideology shifts yet."
- [ ] Legend `<details>` rendered entirely from `IDEOLOGY_SHIFT_ODDS` /
  `IDEOLOGY_ATTEMPTS_PER_TURN` (zero literals in JSX): the two environment
  pulls + threshold + residual, the faction-center definition, self vs opposed
  odds + FF risk and decay, the trait multipliers and seed rates, the 5-attempt
  cap, the one-attempt-per-subject lock, the phase lock, and that in-office
  politicians are valid subjects.
- [ ] Empty roster: player view "No politicians to shift."; other view "This
  faction has no active politicians."; feed and legend still render.

### Definition of done (per CLAUDE.md)
- [ ] `npm run build` passes.
- [ ] Playtested in 1856: reach the 2.1.5 window (fourth auto-nav fires);
  self-shift preview matches a stray's step toward your center; attempt to
  success and to failure (failure visible in feed, badge increments, row
  stamps); switch to a rival faction → Target shows 15% + 50% FF risk and an
  at-your-center rival is disabled; land an opposed hit and verify the FF
  stack column and the −5 PV; hit the 5-cap; verify lock tooltips outside
  2.1.5; reload mid-window (badge + stamps intact, auto-nav refires); Advance
  and verify the tick: Drift/State feed entries, Ideologue/Impressionable
  badges appear with PV deltas (first tick only), CPU Self/Opposed entries
  including attacks ON the player, one summary log line; next turn verify the
  victim's FF stack decayed at 2.1.3; over ~10 turns watch faction
  personalities (2.1.8) cohere rather than dissolve. 1772 smoke: first turn
  reaches 2.1.5 with the inaugural class (unseeded traits, base odds), no
  crash; MA's +1.5 bias produces rightward State entries over a few turns.

## Edge cases
- **1772 / legacy-save first window**: trait seeding happens in the tick, so
  the first window has no Ideologue/Impressionable anywhere — previews show
  base odds and rolls match (×1 multipliers). Traits + PV deltas appear after
  the first Advance (relocations first-window-blindness precedent).
- **2.1.3 ordering**: FF decay runs before 2.1.5 and is skipped on the 1772
  first turn — a stack inflicted here is at full force through this turn's
  elections/floor votes and decays next turn. 2.1.6 conversions stack onto the
  same counter (additive, no interaction needed).
- **Scale ends**: state pull outward from index 0/6 is inapplicable (cascades
  to residual); residual outward steps are no-ops and unrecorded.
- **At-center politicians**: faction pull inapplicable, but state pull /
  residual can move them OFF center (intended tension); self/opposed attempts
  on them are invalid (rejected, nothing charged).
- **Live center movement**: deaths, drafts, conversions, and shifts move the
  rounded center between turns — "At center" status and step targets are
  always computed from the live helper; mid-window player shifts can move your
  own center and re-validate statuses in the same render.
- **Empty faction (no living members)**: no center → it can neither
  self-consolidate nor attack, and nobody can shift "toward" it; rejected
  cleanly, no crash.
- **Factionless politicians**: drift via state pull + residual only; never
  subjects of active attempts; their entries carry `subjectFactionId: null`
  and are invisible in the faction-filtered feed (recorded for the cap only).
- **Subject-lock races**: the player window precedes the tick, so the player
  always stamps first; CPU vs CPU resolves in faction array order; drift skips
  every stamped subject.
- **Both traits held** (hand-edited save): multipliers compose; Ideologue's
  drift ×0 dominates (0 × 2 = 0). Seeding itself is mutually exclusive and
  skips existing holders.
- **Feed churn**: ~15–25 drift movements per turn world-wide plus active
  attempts consume the 200 cap in ~8–12 turns — invisible at the 20-entry
  feed depth; documented for the architect (relocations precedent).
- **Quadruple auto-nav on draft turns** (draft → careers → relocations →
  ideology): accepted rhythm cost; phase-scoped keys can't fight; re-watch in
  playtest (escalation of the relocations triple-nav flag).
- **Same-turn election ripple**: opposed FF hits subtract 5 PV before this
  turn's 2.9.x — intended (attack ahead of elections is the play). No PV or
  election formula changes; PV inputs touched are only the two new traits and
  the existing FF counter.
- **Dead/retired**: never seeded, never drift, never subjects; their feed
  entries persist (relocations precedent).

## Out of scope
- **Direction-to-center hint in the Ideology column** (open call #8 —
  explicitly deferred; the confirm card's from → to arrow carries direction).
- Permanent **'Flip-Flopper' trait escalation** for repeat opposed victims
  (counter-only in v1; revisit if stacks feel toothless).
- **Existing traits as drift modifiers** (e.g. 'Puritan' resistance) — only
  the two new traits modify odds in v1.
- Changes to **2.1.8's personality formula** (it keeps counting dead members),
  the **floor-vote** ideology penalty, **PV**, or **election** formulas.
- Adding `Ideologue`/`Impressionable` to career-track pools, the draft
  dataset, or `scripts/` heuristics — gainable only via seeding; no dataset
  regeneration.
- Multi-step shifts, shift costs/economy, retaliation mechanics, visibility
  into CPU factions' remaining attempt budgets, ideology-change notifications
  outside the feed, repair()/migration work, seeding `src/rng.ts`.
- Renaming/merging with the existing nation-level "Ideology & Enthusiasm"
  page ('enthusiasm') — the two pages coexist.

## Open questions / assumptions
Riskiest first:
1. **CPU volume and convergence pacing** (open call #7): selfGate 30% with a
   3-attempt self budget + 10% gate over the top-10 PV opposing officeholders
   ≈ ~3 self + ~1 opposed attempts per CPU faction per turn, plus ~8–12.5%
   per-politician drift. Rosters should cohere over ~10–20 turns while drafts
   keep injecting diversity — but this actively churns 2.1.8 personalities and
   floor-vote math, and CPUs now attack the player's PV before elections.
   Needs the same playtest sign-off relocations needed; every number is a
   const for cheap tuning.
2. **All locked numbers** (open call #1, within delegated ranges): drift
   8/4/1%, `stateBiasMin` 1.0 (chosen against the real data: pulls fire in
   17/31 1856 states and 4/13 1772 colonies; swing/expansion states inert),
   self 65%, opposed 15%, FF risk 50%, Ideologue ×0/×0.5/×0.25,
   Impressionable ×2/×1/×2, seeds 10/8%, cap 5, feed 20, history 200.
3. **Faction center = living, non-retired member mean, rounded** (open call
   #2) — deliberately diverges from 2.1.8's unfiltered average (which counts
   dead members). Rationale: a faction's present identity is its living
   roster; 2.1.8 is untouched so its rollup behavior doesn't change. Player's
   own center is well-defined the same way (confirmed); empty factions have
   none and are fully inert.
4. **Drift cascade = up to three ROLLS, at most one MOVE** (open call #3).
   The vision's "one drift roll per politician" is read as "no
   double-drifting" (its stated purpose); the lean's "state pull only if
   faction pull didn't fire" requires a second roll after a failed first.
   First success ends the chain; faction → state → residual order.
5. **Drift entries recorded only on movement; active attempts recorded always**
   (open call #6 shape confirmation): drift `success: true` by construction,
   no `actorFactionId`; failed active attempts record `from === to`,
   `success: false`. Residual drift shares the `'drift'` kind with the faction
   pull (one "Drift" badge — a fifth kind wasn't worth the noise).
6. **Impressionable does NOT boost self-shifts** (×1) — the vision's lean
   listed only "drift + opposed" doubled; mirroring Ideologue's self-resistance
   would push 65%×2 past 100% and need clamp logic. Asymmetry is intentional:
   the trait makes you a target. Ideologue resists self-shifts at ×0.5 (lean
   confirmed).
7. **Feed filter = actor OR subject** (open call #6) — your view must show
   attacks against you, or CPU aggression (binding) would be invisible.
   Consequence: one opposed entry appears in two factions' feeds.
8. **Field renamed** from the sketched `lastIdeologyShiftYear` to
   `lastIdeologyAttemptYear` ("refine as needed" sanctioned): it stamps
   attempts (including failures), not shifts — the accurate name guards the
   exact contract-divergence bug the relocations brief flagged.
9. **Active attempts use live centers; the drift pass uses a tick-start center
   map** (open call #2 "computed-when"): the resolver must match what the page
   previewed at click time; the bulk drift pass measures against a stable
   turn-start environment so array order can't retarget mid-pass.
10. **Opposed targets must hold a faction; CPU opposed pass targets
    officeholders only** — the player may target any rival roster member
    (benchers included); the CPU heuristic chases the floor-vote payoff
    (lean confirmed: high-PV opposing officeholders).
11. **Attempts badge always shows the player's count** (vision-binding,
    deviates from relocations' viewed-faction badge); CPU spend is not
    surfaced anywhere in v1 (their attempts resolve inside the tick).
12. **`Ideologue` is a POSITIVE trait (+4 PV)** — net-positive defensive asset
    despite resisting your own consolidation; `Impressionable` NEGATIVE
    (−5 PV). Both PV-only otherwise, gainable only via seeding.
13. **Tick summary log emitted only when the tick did something** (≥1 drift
    movement or CPU attempt), counting tick events only — player attempts
    already surfaced in the feed during the window.
