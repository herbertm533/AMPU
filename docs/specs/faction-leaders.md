# Spec: Faction Leaders (Phase 2.2.3 Activation)

> **CHECKPOINT 1 AMENDMENTS (binding, applied 2026-06-13):**
> 1. **factionCenter weight on leader: 1.5×, not 2×.** The const value is
>    correctly 1.5 in §1.1 (`ideologyWeightInFactionCenter: 1.5`). Some
>    inline prose elsewhere in the spec still says "2×" — read those as
>    "1.5×". The architect's brief should normalize.
> 2. **Federal-seat collision DECOUPLED.** Faction Leader is **NOT** assigned
>    as `currentOffice`. Instead, a new optional field
>    `Politician.factionLeaderOf?: string | null` (denormalized mirror of
>    `Faction.leaderId`) carries the leadership state. `computePV` adds +8
>    PV when `p.factionLeaderOf` is non-null, **additive** to existing
>    currentOffice prestige. A Senator who becomes Faction Leader keeps
>    BOTH and gets +8 leader bonus on top of the +5 Senator prestige
>    (net +8 leader delta, dual-role preserved). The runner's Step 2/3
>    paths set/clear `factionLeaderOf` in lockstep with `f.leaderId`.
>    `OfficeType.FactionLeader` stays in the union as dead code (architect
>    decides whether to remove now or leave for cosmetic cleanup later).
>    **`vacateOffice` does NOT need a `FactionLeader` arm** — the runner's
>    validation step (Step 2) catches stale leaderships on
>    death/retire/defect and runs Election; cleanup of `factionLeaderOf`
>    on the displaced leader happens at the Election/Challenge site.
> 3. Acceptance criteria #8 (vacateOffice FactionLeader arm) and #10
>    (currentOffice assignment) are SUPERSEDED by the new model. Treat
>    every spec mention of "`currentOffice = { type: 'FactionLeader' }`"
>    as "set `p.factionLeaderOf = f.id`" instead. Every mention of
>    "`vacateOffice` with FactionLeader arm" is replaced by the
>    Election/Challenge handler clearing the displaced leader's
>    `factionLeaderOf` to null.
>
> The rest of the spec stands.

> Sixth activation in the 2.x sweep (Relocations 2.1.4 → Ideology 2.1.5 →
> Conversions 2.1.6 → Kingmakers 2.1.7 → Alignment Drift 2.1.8 → this). 2.2.3 is
> the only `2.2.x` runner still a stub: 6 lines, pure top-PV pick, no
> dead/retired filter, never assigns `OfficeType.FactionLeader` (so the +8
> prestige in `pv.ts` is dead code), no vacate on transition, silent feed. This
> spec turns the leader role into a *real seat* with prestige, tenure, an
> era-tuned auto-roll challenge system that historians' research insists must
> shift its mechanism by era (not just its numbers), and four propagation hooks
> that wire the leader's personal traits into the four 2.1.x systems already
> shipped. Page becomes a read-only voice-of-the-faction dashboard. No new
> player buttons.

## Vision (as given)
Activate the 2.2.3 Faction Leaders phase across all American eras
(1772 → modern day). Ship in three layers as one feature:

**Layer 1 — Fix the bugs + light up `+8 PV` + leadership-as-voice integrations.**
Dead/retired filter on candidate pool; assign `OfficeType.FactionLeader` on
selection (claims `+8` prestige); `vacateOffice` releases the seat on every
transition (death / retire / defect / challenge loss / promoted-to-federal-
office); a `factionLeadership` feed entry per transition (FIFO cap 200).
Faction-influence layer: leader's ideology weighted 1.5× in `factionCenter`;
positive-trait propagation (Orator `+0.05` to 2.1.5 ideology-shift attempts,
Manipulative `+0.05` to 2.1.6 sign/poach success, Kingmaker `+5%` extra to
bonded protégé skill-roll in this faction, Leadership `+1` turn to 2.1.8
card-drop threshold); federal-era `×1.1` `electionFactionBias` in
`calcStateVote` when the leader is on the ballot; bills sponsored BY the
leader get `+0.05` per-faction-member vote bias in 2.6.3 floor (additive,
clamped).

**Layer 2 — Stability + scheduled selection.** `Faction.leadershipStartYear`
tracks tenure. 2.2.3 no longer re-elects every turn: it validates (alive,
non-retired, factionId matches, `currentOffice.type === 'FactionLeader'`).
Mismatch triggers Election. End-of-phase invariant: every non-empty faction
has a non-null `leaderId`.

**Layer 3 — Auto-roll challenge system, era-tuned.** Two rolls: Roll A
(fire), Roll B (success). Era-keyed via `LEADERSHIP_RULES.eraConfig` —
because the historian's research is load-bearing here: pre-1900 challenges
are *elite-driven* (patronage, personality, regional alignment); post-2000
are *electorate-driven* (ideology, primaries). A single
`incumbencyAdvantage` per era + a pure ideology-distance trigger
model would mis-predict every Gilded Age machine fight AND every 21st-
century primary. The eraConfig blends the two trigger mechanisms with
weights that shift across the four eras. Failed challenger gets `'Failed
Bid'` (NEGATIVE_TRAITS) for 3 turns (auto-decay), `-5` PV during window,
barred from another challenge while held.

New traits: `'Ambitious'` (POSITIVE, `+4` PV baseline, `~5%` rookie seed
rate, `+0.05` to challenge fire chance); `'Failed Bid'` (NEGATIVE, `-5` PV
baseline, temporary, decays at `year + 3`).

Page expansion: current leader card, leadership benefits panel (era-
conditional from `LEADERSHIP_RULES.eraConfig`), challenger ranking (top 3
with Risk % + Threat % previews), succession history (last 10 transitions),
cross-link header, all literals from `LEADERSHIP_RULES`. NO action buttons
(auto-roll binding).

## Historical grounding (binding)
Source: `docs/research/faction-leaders-historical-context.md`. Five binding
facts from the historian's brief that this spec respects without deviation:

1. **The trigger MECHANISM shifts by era.** Pre-1900 leadership turnover was
   driven by patronage rivalry, personal feuds, and regional/generational
   succession (Conkling vs Blaine, Jackson → Van Buren). Post-2000 turnover
   is driven by ideological primary insurgency (Cantor 2014, Boehner 2015,
   Trump 2016). A single ideology-distance trigger model would mis-predict
   both ends of the timeline. → Implemented as
   `LEADERSHIP_RULES.eraConfig[era].ideologyTriggerWeight` +
   `patronageTriggerWeight` summing to `1.0`; the challenge fire chance is a
   weighted blend (see Layer 3 mechanics below).
2. **Pre-1900 incumbency was extremely high; modern incumbency is low.**
   Washington/Adams/Hancock faced no formal challenge; Jackson dominated 9
   years; Clay led Whigs 18 years; FDR led Dems 13 years; modern leaders
   (Cantor, Boehner) can be unseated in one cycle. → Per-era
   `incumbencyAdvantage` baked into Roll B (success math), not a flat
   constant. Independence = 30; Federalism = 20; Nationalism = 15; Modern =
   8 (cited values, all tunable in the rules const).
3. **Crisis-era challenge frequencies are atypical.** The 1850s Whig
   collapse, 1932 New Deal stabilization, and 2010s primary insurgency are
   each rate-distinct enough that a single `baseFireChance` would model
   none of them well. → Per-era `baseFireChance` (Independence `0.015`,
   Federalism `0.025`, Nationalism `0.045`, Modern `0.060`) — flagged as
   tunable in Open Questions.
4. **"Single leader per faction" is a simplification.** Historically, Sons
   of Liberty had no national head; Federalists had Hamilton AND Adams (in
   opposition); Whigs had Clay AND Webster. The vision explicitly accepts
   this abstraction and the historian flagged it. → Spec ships single-
   leader; documented in Open Questions.
5. **"Ambitious" reads as a vice in 1772–1800 (classical republican
   tradition).** William Casey King's *Ambition, a History* documents this
   shift. → Mechanic is era-neutral; trait labeling is era-neutral in v1
   ("Ambitious" everywhere) per the vision's "architect's call; ship
   neutral" guidance. Flagged in Open Questions as a potential UI refinement.

**Anachronism flag (NOT addressed in this spec).** The historian also
flagged `Ellsworth Progressives` (1772), `Crittenden Republicans` (1856),
`Liberal Republicans` (1856), and the `Washington Patriots` framing as
era-confusing or historically inverted. The vision explicitly says these
**stay out of scope** — a separate cleanup feature renames them. This spec
does NOT modify any faction name.

## Player experience
The leader of your faction is now a real, identifiable seat — when you build
a high-PV statesman of the right ideology, they take the chair (and the
+8 prestige bumps their PV, the +1.1× election bias when they're on the
ballot makes their campaign feel personal, and the +0.05 floor bias when
they sponsor a bill turns the leader into your faction's most credible
voice). The seat is *quiet* — you don't see it advance, you don't click
through a modal, you don't pick the leader. The page shows you who they
are, why they hold the seat (their bonuses), and who's lurking with high
challenge odds (top 3 challengers with Risk % and Threat %). When a
challenge fires it resolves auto — silently if you're CPU-led, narrated
through the feed if it's yours — and a successful challenger inherits the
chair, with the old leader stripped of `FactionLeader` and `+8` prestige.
The era matters: in 1772 your Washington-figure rules until they die; in
1880 your Conkling can lose to a Blaine over a personal feud; in 2020 your
incumbent can get primaried out by an insurgent ideologue from the wing.

## User story
As a faction-running player, I want a real leader seat that confers prestige
and a voice-of-the-faction bonus across the legislation / election /
ideology-shift / conversion / kingmaker systems, with an auto-resolving
challenge mechanic that fires at era-appropriate rates and through era-
appropriate triggers (patronage in 1880, ideology in 2020) — so my
strategic agency lives upstream (steering PV and ideology so credible
threats don't emerge) rather than in a defensive modal, and so 50 turns of
faction-building bank into a leader whose identity reflects how I've
played.

## Verified engine facts (drive the design; architect must not re-derive)

- **Current 2.2.3 runner** (`runPhase_2_2_3_FactionLeaders`,
  phaseRunners.ts:1672–1678) is 6 lines: `members = politicians.filter(p =>
  p.factionId === f.id)` (NO dead/retired filter, KNOWN BUG #1);
  `members.sort((a,b) => b.pvCache - a.pvCache)`; `f.leaderId = members[0].id`.
  Re-runs every turn. Never assigns `currentOffice = { type: 'FactionLeader' }`
  (KNOWN BUG #2 — the +8 in `OFFICE_PRESTIGE.FactionLeader` is dead code).
  Never logs (KNOWN BUG #3 — silent transitions). No vacate on transition
  (KNOWN BUG #4 — old leader keeps phantom `FactionLeader` office across the
  turn boundary... except they never had it because of bug #2; the bug is
  latent until the assignment is added). **Replace wholesale.**
- **`OfficeType.FactionLeader`** is already in the union (types.ts:344).
  **`OFFICE_PRESTIGE.FactionLeader = 8`** is already in `pv.ts:24`. The
  default `officeWeights` arm (pv.ts:60–62) returns flat weights — adequate
  for a non-skill-specialized seat; we keep `FactionLeader` falling through
  to default (no new case needed).
- **`vacateOffice`** (phaseRunners.ts:1770–1802) currently handles
  President, VP, Speaker, Pro Tem, Chief/Associate Justice, Senator,
  Representative, Governor, CCPresident, and cabinet slots. It does NOT
  handle `FactionLeader` today. **Add a new arm:** `if (t === 'FactionLeader')
  { const f = snap.factions.find((ff) => ff.leaderId === p.id); if (f) {
  f.leaderId = null; f.leadershipStartYear = undefined; } }`. The arm
  preserves the spec's invariant that every non-empty faction has a leader
  at end-of-2.2.3 — the vacate happens mid-turn (death at 2.4.1, defect at
  2.1.6, etc.) and 2.2.3 next turn fills the gap.
- **`Faction` interface** (types.ts:390–400) currently has `leaderId?:
  string | null`. **Add** `leadershipStartYear?: number;` (optional; legacy-
  compat). No other Faction field changes.
- **`Trait` union** (types.ts:62–106) and `POSITIVE_TRAITS` /
  `NEGATIVE_TRAITS` arrays (types.ts:108–156): add `'Ambitious'` to both the
  union AND `POSITIVE_TRAITS`; add `'Failed Bid'` to both the union AND
  `NEGATIVE_TRAITS`. Both append to the end of their respective arrays (no
  reorder of existing entries — minimizes save-compat risk).
- **`factionCenter`** (phaseRunners.ts:620–625) is the SINGLE source of
  the faction's mean ideology index. It's `export`ed and consumed by 2.1.5
  ideology shifts, 2.1.8 alignment drift (personality + bucket gates), and
  2.1.6 conversion fit (via centers in lines 657, 878, 919, 943). **Modify
  in place** to weight the leader 1.5× (see Layer 1 below). All downstream
  consumers get the leader-weighted center automatically — the propagation
  is structural, not per-site. This is the spec's biggest blast-radius
  decision; flagged.
- **`cardVoteBias`** (phaseRunners.ts:1375–1395) is the 2.6.2/2.6.3/voteCC
  per-voter additive bias. The leader-sponsored bonus (`+0.05` per
  faction-member when the leader sponsors) slots in at the same call sites
  — but only in the 2.6.3 floor `tally()` per-member computation
  (phaseRunners.ts:2222–2236), not in 2.6.2 committee chair, not in
  `voteCC` (1772 CC is gated by delegate-roster mechanics where the leader
  may not even be a delegate; v1 leaves CC voting alone — flagged as
  assumption #1).
- **`electionFactionBias`** (phaseRunners.ts:1398) is applied per candidate
  per state in `calcStateVote` (phaseRunners.ts:2363). The leader-on-ballot
  `×1.1` multiplier slots in as a post-cap multiplier (after the existing
  `±electionBiasCap` clamp): `if (candidate.id === faction.leaderId) bias
  *= 1.1`. Cap is `±3`, so post-mul max is `±3.3`. Documented; the cap
  effectively widens by 10% for leader candidates only.
- **`calcStateVote`** is used by `runPhase_2_9_4_Presidential` (line 2395),
  `runPhase_2_9_5_Governors` (line 2447), and `runPhase_2_9_6_Senate +
  House` (lines 2483, 2503). The leader-on-ballot bump applies in all four
  by transitivity. No new sites.
- **`runPhase_2_1_5_Ideology`** (phaseRunners.ts:706–819) reads
  `IDEOLOGY_SHIFT_ODDS.attempt.self` (= 0.65) and `.opposed` (= 0.15)
  through `ideologyShiftOdds`. The Orator-leader `+0.05` hook is a flat
  additive bump applied to `success` in `ideologyShiftOdds` when the
  actorFaction's leader has `'Orator'`. Site: `ideologyShiftOdds`
  (phaseRunners.ts:633–638) takes `actorCenter` but not the actor faction
  id; the spec adds `actorFactionId` as a fourth parameter (existing call
  sites at 668, plus the page preview helper, both updated). Flagged.
- **`runPhase_2_1_6_Conversions`** (phaseRunners.ts:1019+) computes sign /
  poach base chances through `CONVERSION_ODDS.sign.base` (= 0.2) and the
  `poach.matrix`. The Manipulative-leader `+0.05` hook is a flat additive
  on the per-attempt `chance(p)` gate, applied when the actor faction's
  leader has `'Manipulative'`. Site: wherever the sign/poach `chance(p)`
  fires. Architect identifies the exact line; the helper that computes the
  effective `p` (analogous to `ideologyShiftOdds`) is the right injection
  point. Flagged.
- **`runPhase_2_1_7_Kingmakers`** (phaseRunners.ts:1250–1367) Phase 4
  graduation pass uses `KINGMAKER_RULES.graduationOdds.command/.trait/.both`
  (0.45/0.45/0.10). The Kingmaker-leader `+5%` extra to bonded protégé
  skill-roll resolves as: when the protégé's mentor's faction's leader has
  `'Kingmaker'`, the `commandBranch + bothBranch` combined probability is
  multiplied by `1.05` (i.e. the command-skill-roll arm fires 5% more
  often). Concretely: roll an extra `chance(0.05)` IF the leader has
  Kingmaker AND the protégé's faction === leader's faction — on hit, the
  protégé gains `+1 command` independent of the normal graduation roll.
  Spec wires it as an additive 5% chance on a separate gate to avoid
  rebalancing the 0.45/0.45/0.10 split. Flagged.
- **`runPhase_2_1_8_FactionAlignmentDrift`** drop pass (phaseRunners.ts —
  the drift runner per faction-alignment-drift spec, K=2 stable turns to
  drop). The Leadership-leader `+1` turn to DROP threshold hook: when the
  faction's leader has `'Leadership'`, the effective K for THIS faction's
  drop pass is `3` instead of `2` (cards are stickier under a Leadership
  leader). Same K=2 for ADD pass — Leadership doesn't help you gain new
  cards, it just helps you keep what you have. Site: the K lookup inside
  the per-faction drop pass loop. Architect: the cleanest implementation is
  a tiny helper `effectiveDropStableTurns(snap, faction)` returning
  `ALIGNMENT_RULES.stableTurns + (leaderHasLeadership ? 1 : 0)`. Flagged.
- **`FactionLeaderPage`** (pages/FactionLeaderPage.tsx, 39 lines) currently
  shows a single hardcoded leader card + faction stats (personality,
  members, total PV, card lists). **Replace wholesale** with the four-
  section read-only dashboard (current leader / benefits panel / challenger
  ranking / succession history). Page id `'factionLeader'` is already
  registered in `Sidebar.tsx:33`; no nav changes.
- **`Sidebar`** entry already exists at line 33 (`{ id: 'factionLeader',
  label: 'Faction Leader' }`). NO sidebar changes; NO new auto-nav in
  `App.tsx` (the page is informational, just like Faction Alignments).
- **`phases.ts`** PHASE_SEQUENCE has 2.2.3 at line 15 already. NO phases.ts
  changes; the runner is dispatched today, just thinly.
- **`engine.ts` `runCurrentPhase`** dispatches 2.2.3 to
  `runPhase_2_2_3_FactionLeaders` (verified by name). Replacing the runner
  body is the only engine.ts-relevant change.
- **Era detection.** The spec uses `snap.game.currentEra` (an `Era`
  literal: `'independence' | 'federalism' | 'nationalism' | 'modern'`,
  types.ts:433). The `eraConfig` is keyed on these four ids directly. No
  era-detection helper needed.
- **Seed rate for `'Ambitious'`.** The 2.1.1 draft (`runPhase_2_1_1_Draft`,
  phaseRunners.ts:46+) calls `pickBestForFaction` and trait-seeding paths
  in scenario seed; the simplest seed point is the same one-shot lazy
  seeding pattern already used by 2.1.5 (`ideologyTraitsSeeded`) and 2.1.6
  (`conversionTraitsSeeded`). **Add** `ambitiousSeeded?: boolean` on
  `Politician`; in 2.2.3 head, before the leader logic, sweep:
  `for (const p of snap.politicians) { if (p.deathYear || p.retiredYear ||
  p.ambitiousSeeded) continue; if (chance(LEADERSHIP_RULES.ambitiousSeedRate))
  p.traits.push('Ambitious'); p.ambitiousSeeded = true; }`. This puts the
  seed at the only phase that consumes it — same pattern as 2.1.5/2.1.6.
  Flagged.
- **`Failed Bid` decay.** Mirrors 2.1.3 flip-flopper decay (a self-decaying
  stamp). Spec adds `failedBidExpiresYear?: number` on `Politician`. At the
  HEAD of 2.2.3 (before any leader logic): sweep
  `for (const p of snap.politicians) { if (p.failedBidExpiresYear !== undefined
  && snap.game.year >= p.failedBidExpiresYear) { p.traits = p.traits.filter(t
  => t !== 'Failed Bid'); p.failedBidExpiresYear = undefined; } }`. Then
  `refreshPv` so the `-5` PV stamp lifts on the same tick. Cleanup pass
  runs before the leader/challenge logic so a politician whose Failed Bid
  expires this turn is immediately eligible to challenge again. Flagged.

## Mechanics (decided values)

### Layer 1 — Bug fixes + prestige activation + propagation hooks (binding)

#### 1.1 New `LEADERSHIP_RULES` const (placed after `ALIGNMENT_RULES` in
types.ts; single source for engine math AND page legend; zero hardcoded
numbers in JSX or in the runner)

```
export const LEADERSHIP_RULES = {
  // Selection (no-incumbent / invalidation election)
  fitPenalty: 1.0,            // PV per IDEOLOGY_ORDER step distance
  traitBonusPerPositive: 2,   // capped
  traitBonusCap: 6,
  challengerPvFloor: 30,      // min PV to ENTER the challenger pool
  ideologyWeightInFactionCenter: 1.5, // leader counted 1.5× in factionCenter (Checkpoint 1: softened from 2× per user)

  // Challenge auto-roll
  fireCap: 0.20,              // Roll A absolute cap (post all bonuses)
  scoreNormalizer: 200,       // PV-score denominator in Roll B's edge term
  failedBidDecayTurns: 3,     // turns (= 6 years) until 'Failed Bid' clears
  failedBidPvStamp: 5,        // -5 PV stamp magnitude (matches POSITIVE +4 /
                              //   NEGATIVE -5 baselines in pv.ts)
  ambitiousSeedRate: 0.05,    // 5% of un-seeded politicians per 2.2.3 tick
  ambitiousFireBonus: 0.05,   // +0.05 to Roll A if challenger has Ambitious

  // Trait propagation magnitudes
  oratorIdeologyShiftBonus: 0.05,        // additive on 2.1.5 success
  manipulativeConversionBonus: 0.05,     // additive on 2.1.6 sign/poach
  kingmakerProtegeBonus: 0.05,           // extra command-roll chance in 2.1.7
  leadershipDropStableTurnsBonus: 1,     // +1 turn to 2.1.8 drop K

  // Federal-era election + legislation hooks
  electionOnBallotMul: 1.1,    // ×1.1 on electionFactionBias when on ballot
  sponsorFloorBias: 0.05,      // additive per-faction-member in 2.6.3 floor

  // Per-era trigger mix + tuning (historian-binding)
  eraConfig: {
    independence: {
      baseFireChance: 0.015,
      incumbencyAdvantage: 30,
      ideologyTriggerWeight: 0.20,
      patronageTriggerWeight: 0.80,
    },
    federalism: {
      baseFireChance: 0.025,
      incumbencyAdvantage: 20,
      ideologyTriggerWeight: 0.30,
      patronageTriggerWeight: 0.70,
    },
    nationalism: {
      baseFireChance: 0.045,
      incumbencyAdvantage: 15,
      ideologyTriggerWeight: 0.40,
      patronageTriggerWeight: 0.60,
    },
    modern: {
      baseFireChance: 0.060,
      incumbencyAdvantage: 8,
      ideologyTriggerWeight: 0.80,
      patronageTriggerWeight: 0.20,
    },
  } as const satisfies Record<Era, {
    baseFireChance: number;
    incumbencyAdvantage: number;
    ideologyTriggerWeight: number;
    patronageTriggerWeight: number;
  }>,
} as const;

export const LEADERSHIP_FEED_CAP = 200;
```

The `eraConfig` weights are the historian's load-bearing mechanic:
ideology-distance dominates triggering in the modern era (0.80),
patronage/PV-gap dominates in independence (0.80). Numbers are
recommendations; all flagged tunable.

#### 1.2 Type additions

- `OfficeType` union (types.ts:325): `'FactionLeader'` already exists.
  **No change.**
- `Faction` interface (types.ts:390–400): add
  `leadershipStartYear?: number;` (optional, legacy-compat).
- `Politician` interface (types.ts:356–388):
  - add `ambitiousSeeded?: boolean;` (mirrors `ideologyTraitsSeeded`).
  - add `failedBidExpiresYear?: number;` (optional decay clock).
- `Trait` union (types.ts:62–106): append `| 'Ambitious'` and `| 'Failed Bid'`
  (string literal `'Failed Bid'` with the space; matches the human-readable
  convention of the existing `'Crisis Manager'`, `'Flip-Flopper'`,
  `'Domestic Apathy'` traits).
- `POSITIVE_TRAITS` (types.ts:108–137): append `'Ambitious'`.
- `NEGATIVE_TRAITS` (types.ts:139–156): append `'Failed Bid'`.
- `GameState` (types.ts:~611): add `factionLeadership?:
  FactionLeadershipEntry[];` (optional, FIFO cap `LEADERSHIP_FEED_CAP = 200`).
- New `FactionLeadershipEntry` interface (placed near
  `FactionAlignmentDriftEntry`):

```
export interface FactionLeadershipEntry {
  year: number;
  factionId: string;
  kind: 'installed' | 'challenged' | 'vacated';
  // 'installed' = new leader took the chair (no prior or after challenge / vacancy)
  // 'challenged' = a challenge fired (Roll A hit); records success/fail
  // 'vacated' = leader stepped down via death / retire / defect / promoted-to-federal
  leaderId?: string;       // new leader for 'installed' and successful 'challenged'
  formerLeaderId?: string; // prior leader for 'installed' after replacement, or for 'vacated'
  challengerId?: string;   // for 'challenged' (winner if success, loser if fail)
  success?: boolean;       // for 'challenged'
  reason?: 'death' | 'retire' | 'defect' | 'promoted' | 'replaced' | 'challenge-win'
         | 'challenge-loss' | 'election';
  // For invalidation Elections at 2.2.3 head, reason='election'.
}
```

#### 1.3 Replace `runPhase_2_2_3_FactionLeaders` wholesale

The new runner executes the following steps in order:

**Step 0 — Failed Bid decay sweep.** As verified above; clears expired
`'Failed Bid'` traits and stamps; followed by `refreshPv` only if any
decay fired (perf nicety; if none fired, no refresh — avoids
needless reflow on common turns).

**Step 1 — Ambitious seed pass.** As verified above; `ambitiousSeedRate =
0.05` for un-seeded living politicians; sets `ambitiousSeeded = true`
regardless of roll outcome (so each politician rolls exactly once in their
career).

**Step 2 — Per-faction validation + selection.** For each `f` in
`snap.factions`:

  - **Validate the incumbent.** Lookup `current = politicians.find(p => p.id
    === f.leaderId)`. Mark `invalid` if any of: `!current`, `current.deathYear`,
    `current.retiredYear`, `current.factionId !== f.id`, `current.currentOffice?.type
    !== 'FactionLeader'`. If invalid:
    - Vacate the old leader's `currentOffice` IF it's still
      `'FactionLeader'` (rare race: defection that didn't go through
      `vacateOffice` proper). Use `vacateOffice(snap, current)`.
    - Run an Election (Step 3 below) and record a `factionLeadership`
      entry: `{ kind: 'installed', factionId: f.id, leaderId: winner.id,
      formerLeaderId: current?.id, reason: 'election' }`.
    - If no incumbent existed before (initial scenario load OR post-defect
      gap), `formerLeaderId` is omitted.
    - **Skip if faction has zero living members** — `f.leaderId = null`,
      `f.leadershipStartYear = undefined`. (Empty factions exist; see Faction
      Alignment Drift edge cases.)

  - **Run a Challenge Roll.** Only if the incumbent was valid.
    - **Build the challenger pool:** living, non-retired, same-faction,
      not currently the leader, `pvCache >= LEADERSHIP_RULES.challengerPvFloor`,
      and NOT holding `'Failed Bid'`. If pool is empty, no challenge fires.
    - **Pick the top challenger by `pvCache` (tiebreak: politician id
      localeCompare).** This is the only candidate evaluated — top-PV
      always represents the strongest internal threat.
    - **Roll A — Fire chance** (per the era's mechanism mix). Let
      `era = snap.game.currentEra`, `cfg = LEADERSHIP_RULES.eraConfig[era]`.
      Define:
      ```
      const center = factionCenter(snap, f.id) ?? IDEOLOGY_ORDER.indexOf(leader.ideology);
      const ideoDist = Math.abs(IDEOLOGY_ORDER.indexOf(leader.ideology) - center);
      // PV gap normalized to a [0,1]-ish term
      const pvGap = Math.max(0, (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer);

      const ideologyTrigger = ideoDist / 6;        // 0..1 across 7-point scale
      const patronageTrigger = pvGap;              // 0..1 in practice

      let fireRaw = cfg.baseFireChance
        + cfg.ideologyTriggerWeight * ideologyTrigger
        + cfg.patronageTriggerWeight * patronageTrigger;
      if (challenger.traits.includes('Ambitious')) fireRaw += LEADERSHIP_RULES.ambitiousFireBonus;

      const fireChance = clamp(fireRaw, 0, LEADERSHIP_RULES.fireCap);
      ```
      The era-conditioned blend is the historian-binding mechanic: in
      `modern` (ideo weight 0.80) a 3-step ideological gap dominates;
      in `independence` (patronage weight 0.80) the leader's PV lead
      dominates. `fireCap = 0.20` caps the absolute fire rate at 20%
      per faction per turn even at full alignment of bonuses (1-in-5
      worst case).
    - `chance(fireChance)` — if it doesn't fire, end this faction's
      challenge resolution.
    - **Roll B — Success chance** (if Roll A fired). Define:
      ```
      const edge = (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer;
      const successChance = clamp(0.5 + edge - cfg.incumbencyAdvantage / 100, 0.05, 0.95);
      ```
      Center is 0.5 (the PV-tied case); `+edge` swings with PV gap;
      `cfg.incumbencyAdvantage / 100` swings DOWN by era-specific
      magnitude. In `independence` (30) the success chance floors near
      0.20 even with a 50-PV edge; in `modern` (8) a 50-PV edge clears
      0.50. The `[0.05, 0.95]` clamp keeps both outcomes possible at the
      extremes. `chance(successChance)` is the Roll B gate.
    - **Resolve.**
      - On `success`: vacate the incumbent's `currentOffice` (releases
        `+8` prestige; `refreshPv` at the end of the runner picks up the
        delta); assign `challenger.currentOffice = { type: 'FactionLeader' }`;
        set `f.leaderId = challenger.id`; set `f.leadershipStartYear =
        snap.game.year`. Record:
        `{ kind: 'challenged', factionId: f.id, leaderId: challenger.id,
        formerLeaderId: leader.id, challengerId: challenger.id, success:
        true, reason: 'challenge-win' }`. Log: `addLog(snap, '2.2.3',
        'appointment', \`\${challenger.firstName} \${challenger.lastName} unseats
        \${leader.firstName} \${leader.lastName} as leader of the \${f.name}.\`)`.
      - On `failure`: stamp `'Failed Bid'` onto the challenger; set
        `challenger.failedBidExpiresYear = snap.game.year + 2 *
        LEADERSHIP_RULES.failedBidDecayTurns` (turns × 2 years/turn = 6
        years). Record: `{ kind: 'challenged', factionId: f.id,
        challengerId: challenger.id, success: false, reason: 'challenge-loss' }`.
        Log: `addLog(snap, '2.2.3', 'appointment', \`\${challenger.firstName}
        \${challenger.lastName}'s bid to lead the \${f.name} fails; the chair
        holds.\`)`. The Failed Bid `-5` PV stamp lands on the next
        `refreshPv` (end of runner).

**Step 3 — Election (no incumbent OR invalidation).** For factions where
the incumbent failed validation (above), pick the new leader by the
spec's selection formula:

```
const center = factionCenter(snap, f.id);  // may be null on empty faction
const eligible = politicians.filter(p =>
  !p.deathYear && !p.retiredYear &&
  p.factionId === f.id &&
  !p.traits.includes('Failed Bid')
);
// faction-fit bonus
function scoreOf(p: Politician): number {
  const idol = IDEOLOGY_ORDER.indexOf(p.ideology);
  const fitPenalty = center !== null
    ? LEADERSHIP_RULES.fitPenalty * Math.abs(idol - center)
    : 0;
  const posCount = p.traits.filter(t => POSITIVE_TRAITS.includes(t)).length;
  const traitBonus = Math.min(
    LEADERSHIP_RULES.traitBonusCap,
    LEADERSHIP_RULES.traitBonusPerPositive * posCount,
  );
  return p.pvCache - fitPenalty + traitBonus;
}
eligible.sort((a, b) => {
  const sa = scoreOf(a), sb = scoreOf(b);
  if (sa !== sb) return sb - sa;
  return a.id.localeCompare(b.id);  // deterministic tiebreak
});
const winner = eligible[0] ?? null;
```

The `'Failed Bid'`-held politicians are EXCLUDED from the selection pool
entirely (matches the vision's "barred from another challenge while held"
binding — they also can't take the chair by replacement during the
window).

If `winner === null` (empty faction or every member holds Failed Bid),
`f.leaderId = null`, `f.leadershipStartYear = undefined`. **End-of-phase
invariant violated** for that faction; logged with a warning-level addLog
(category `'system'`): `\`No eligible leader for \${f.name}.\``. This is
an expected edge case (e.g. a freshly-conquered faction wiped by a death
cascade); the next 2.2.3 tick auto-fills as the Failed Bid stamps decay
or new draftees join.

If `winner !== null`: assign `winner.currentOffice = { type: 'FactionLeader' }`,
`f.leaderId = winner.id`, `f.leadershipStartYear = snap.game.year`. Record
the `installed` / `election` feed entry. Log: `addLog(snap, '2.2.3',
'appointment', \`\${winner.firstName} \${winner.lastName} elected to lead the
\${f.name}.\`)`.

**Step 4 — `refreshPv` (single pass at the end).** Once for the whole
runner; picks up Ambitious-seed PV bumps, Failed-Bid stamps + decays, and
the prestige delta from any chair change.

**Step 5 — Conditional summary log.** Only if at least one
`installed`/`challenged`/`vacated` event fired this tick:
`addLog(snap, '2.2.3', 'system', \`Leadership: \${challenges} challenges resolved
(\${unseated} unseated); \${newSeats} new leaders installed.\`)`. The line
is informational; the per-faction logs above are the authoritative trace.

#### 1.4 `vacateOffice` — add the `FactionLeader` arm

```
if (t === 'FactionLeader') {
  const f = snap.factions.find((ff) => ff.leaderId === p.id);
  if (f) {
    const formerLeaderId = f.leaderId ?? undefined;
    f.leaderId = null;
    f.leadershipStartYear = undefined;
    // Feed entry. Reason is derived from the call site: death/retire are at
    // 2.4.1; defect at 2.1.6; promoted-to-federal-office at the various
    // election / appointment runners. The vacateOffice caller stamps a
    // synthesized entry; alternatively, the spec leaves reason='vacated'
    // generic and the call sites optionally append a more specific entry.
    // Recommendation: vacateOffice writes ONE entry with reason='replaced'
    // (the generic "no longer leader" reason); callers MAY add a richer
    // entry. Simpler; one site of truth.
    recordFactionLeadership(snap, {
      year: snap.game.year, factionId: f.id, kind: 'vacated',
      formerLeaderId, reason: 'replaced',
    });
  }
}
```

The reason taxonomy (`'death' | 'retire' | 'defect' | 'promoted' |
'replaced' | 'challenge-win' | 'challenge-loss' | 'election'`) is wider
than `vacateOffice` can disambiguate alone — it can't tell death from
retire from defect at the call site. **Architect choice (flagged):**
either (a) `vacateOffice` writes generic `'replaced'` and 2.4.1 + 2.1.6
optionally write a richer follow-up entry; OR (b) `vacateOffice` takes a
new optional `reason` parameter (cleaner; requires touching all
`vacateOffice` call sites). Recommendation: (a) — minimal blast radius.

#### 1.5 `factionCenter` — weight the leader 1.5×

Modify `factionCenter` (phaseRunners.ts:620–625) in place:

```
export function factionCenter(snap: FullGameSnapshot, factionId: string): number | null {
  const members = snap.politicians.filter((p) =>
    p.factionId === factionId && !p.deathYear && !p.retiredYear,
  );
  if (members.length === 0) return null;
  const faction = snap.factions.find((f) => f.id === factionId);
  const leaderId = faction?.leaderId;
  let sum = 0, count = 0;
  for (const p of members) {
    const w = (leaderId && p.id === leaderId)
      ? LEADERSHIP_RULES.ideologyWeightInFactionCenter
      : 1;
    sum += IDEOLOGY_ORDER.indexOf(p.ideology) * w;
    count += w;
  }
  return Math.round(sum / count);
}
```

The leader's ideology now counts twice. All downstream consumers (2.1.5,
2.1.6, 2.1.8 personality + bucket, Step 2.2.3 challenge fire's `center`
read) get the weighted center automatically. **Blast-radius assumption:**
when no leader is seated (null `leaderId`, empty faction), the function
degrades to today's behavior — no behavioral regression in pre-leader-
exists turns. Flagged as the spec's biggest cross-system blast risk; the
mitigation is that the 1.5× weight is identity-preserving in expectation (a
leader at the mean shifts the mean by zero), so the system-wide effect is
sharpening, not biasing.

#### 1.6 Trait propagation hooks (binding)

**Orator on leader → +0.05 to 2.1.5 ideology-shift attempts.** In
`ideologyShiftOdds` (phaseRunners.ts:633–638), thread an `actorFactionId`
param and apply the bonus when the actor faction's leader has `'Orator'`:

```
export function ideologyShiftOdds(p: Politician, kind: 'self' | 'opposed',
    actorCenter: number, actorLeader?: Politician | null
): { success: number; ffRisk: number; from: Ideology; to: Ideology } {
  const oratorBonus = actorLeader?.traits.includes('Orator')
    ? LEADERSHIP_RULES.oratorIdeologyShiftBonus : 0;
  const success = clamp(
    IDEOLOGY_SHIFT_ODDS.attempt[kind] * traitMult(p, kind) + oratorBonus,
    0, 1,
  );
  // ... rest unchanged
}
```

Call sites: `resolveIdeologyShift` (phaseRunners.ts:651+) at line 668
passes the resolved actor leader; the page preview helper at the same
signature passes likewise.

**Manipulative on leader → +0.05 to 2.1.6 sign/poach success.** The
analogous hook on the per-attempt `chance(p)` in `runPhase_2_1_6_Conversions`.
The architect identifies the helper that composes the effective `p`
(analogous to `ideologyShiftOdds`); the bonus is `+0.05` post-composition,
clamped `[0, 1]`. Applied when the actor faction's leader has `'Manipulative'`.

**Kingmaker on leader → +5% extra protégé skill-roll, faction-local.** In
`runPhase_2_1_7_Kingmakers` Phase 4 (graduation pass), after the existing
0.45/0.45/0.10 split runs: if `leaderOfFaction(snap, mentorFactionId)?.traits.includes('Kingmaker')`,
roll an additional `chance(LEADERSHIP_RULES.kingmakerProtegeBonus)`. On
hit, the protégé gains `+1 command` (clamped to `KINGMAKER_RULES.commandCap`).
A separate gate, not a multiplier — so the bonus is a "bonus roll" that
doesn't rebalance the original 3-way split. Documented; flagged.

**Leadership on leader → +1 turn to 2.1.8 drop K (cards stickier).** In
the 2.1.8 drop pass per faction, the K used is:
`ALIGNMENT_RULES.stableTurns + (leaderHasLeadership ? LEADERSHIP_RULES.leadershipDropStableTurnsBonus : 0)`.
ADD pass K is unchanged (Leadership doesn't help you gain).

#### 1.7 Federal-era election bias (binding)

In `electionFactionBias` (phaseRunners.ts:1398+), after the existing
computation that returns a `clamp(raw, -electionBiasCap, +electionBiasCap)`
value, apply an out-of-clamp multiplier when the candidate is the
faction's leader. Architect: change `electionFactionBias` to accept an
optional `candidateId` (defaulting to `undefined` for back-compat) and
multiply by `LEADERSHIP_RULES.electionOnBallotMul` when
`candidateId === faction.leaderId`. The call site in `calcStateVote`
already has the candidate `c` (phaseRunners.ts:2363) — wire `c.id`.

Effect: leader candidates get a `±3.3` cap window (10% wider than the
non-leader `±3`). Documented; the asymmetry is intentional (narrative:
the leader campaigning personally is a stronger draw OR a stronger
liability).

Era guard: per the vision binding ("Federal era"), the multiplier applies
**only** when `snap.game.currentEra !== 'independence'`. In the
independence era there are no presidential / governor / senate elections
that fan out through `calcStateVote` anyway (verified: 2.9.1–2.9.6 are
skipped via the `currentEra === 'independence'` branches at lines 2125,
2157, 2192), so this guard is belt-and-suspenders. Documented.

#### 1.8 Bill-sponsored-by-leader floor bias (binding)

In `runPhase_2_6_3_Floor` (phaseRunners.ts:2222–2236), inside the `tally`
function for federal-era voting, add a per-member additive when the bill's
sponsor is their faction's leader:

```
const sponsorIsLeader = sponsor.factionId
  ? snap.factions.find((f) => f.id === sponsor.factionId)?.leaderId === sponsor.id
  : false;
// ... inside the per-member loop:
const leaderSponsorBonus = (sponsorIsLeader && m.factionId === sponsor.factionId)
  ? LEADERSHIP_RULES.sponsorFloorBias : 0;
p = clamp(p + cardVoteBias(snap, m.factionId, bill.effects.interestGroups) + leaderSponsorBonus, 0, 1);
```

The bonus is `+0.05` per faction-member, additive on the existing
`sameFaction ? 0.92` baseline (already very high; the bonus consolidates
near-certain ayes into actually-certain ayes). It does NOT apply to
cross-faction members of the same party (the leader's authority extends
to their own faction, not their party). 2.6.2 committee and `voteCC` are
**NOT** affected in v1 (flagged as assumption — the architect can extend
later if playtest demands).

### Layer 2 — Stability + scheduled selection (binding)

The validation step in §1.3 Step 2 already encodes the stability model
(no re-election unless the incumbent fails validation). The
`leadershipStartYear` is set whenever a leader takes the chair (Election
or successful Challenge) and **cleared** whenever the chair empties (any
`vacateOffice` of a `FactionLeader`). Tenure (years held) is derived at
read-time: `snap.game.year - (f.leadershipStartYear ?? snap.game.year)`.

End-of-phase invariant (binding): for every faction `f` with at least one
living non-retired member, `f.leaderId !== null`. The only exception is
when every eligible member holds `'Failed Bid'` — this triggers the
warning-level `'system'` log in Step 3.

### Layer 3 — Auto-roll challenge system (binding)

The Roll A / Roll B mechanics are fully specified in §1.3 Step 2. Key
properties:

- **Era-tuned trigger MECHANISM, not just numbers.** `ideologyTriggerWeight`
  + `patronageTriggerWeight` sum to 1.0 per era; the same `chance(fireChance)`
  call evaluates a different weighted blend depending on era. Historian's
  binding fact #1 — pre-1900 is patronage-dominant (independence 0.80
  patronage, federalism 0.70, nationalism 0.60), modern is ideology-dominant
  (0.80 ideology).
- **`fireCap = 0.20`** is an absolute ceiling — even in an era with high
  fireChance + Ambitious challenger + ideology-distant leader + huge PV gap,
  the per-faction per-turn challenge rate caps at 1-in-5. Prevents thrashing.
- **Roll B's `incumbencyAdvantage`** is the second per-era lever; even
  when Roll A fires, success requires `0.5 + edge - cfg.incumbencyAdvantage/100
  > rand()`. In independence (30) a 50-PV-edge challenge floors at
  `0.5 + 0.25 - 0.30 = 0.45` chance to succeed — coin flip skew. In modern
  (8) the same edge yields `0.67` — the wing insurgent likely wins.
- **`'Failed Bid'` stamp** lasts 3 turns (= 6 in-game years); the
  decay site is 2.2.3 head (Step 0). Cleared by 2.4.1 death/retire too
  (the trait is on a dead politician, but `vacateOffice` for FactionLeader
  doesn't touch trait state; the stamp just dies with them — handled by
  `failedBidExpiresYear` going unread on dead politicians; no error).

## State shape (binding)

- `Trait` union appends `'Ambitious'`, `'Failed Bid'`.
- `POSITIVE_TRAITS` appends `'Ambitious'`. `NEGATIVE_TRAITS` appends
  `'Failed Bid'`.
- `Politician` gains `ambitiousSeeded?: boolean` and
  `failedBidExpiresYear?: number`.
- `Faction` gains `leadershipStartYear?: number`.
- `GameState` gains `factionLeadership?: FactionLeadershipEntry[]` (after
  `factionAlignmentDrift`).
- New `FactionLeadershipEntry` interface (shape per §1.2).
- New `LEADERSHIP_RULES` const (placed after `ALIGNMENT_RULES`) + new
  `LEADERSHIP_FEED_CAP = 200` constant.

All Politician/Faction additions are optional; legacy saves load. No
`repair()` changes; defensive normalization in the runner's Step 0/1
covers backfill (Ambitious seeding picks up un-seeded politicians on
their next 2.2.3 tick).

## Acceptance criteria

### State & types
- [ ] 1. `Trait` union has `'Ambitious'` and `'Failed Bid'` appended.
- [ ] 2. `POSITIVE_TRAITS` has `'Ambitious'` appended. `NEGATIVE_TRAITS`
  has `'Failed Bid'` appended. PV math at `pv.ts:73–76` picks them up
  (`+4` and `-5` respectively) via existing loop.
- [ ] 3. `Politician` interface gains `ambitiousSeeded?: boolean` and
  `failedBidExpiresYear?: number` (both optional).
- [ ] 4. `Faction` interface gains `leadershipStartYear?: number`.
- [ ] 5. `GameState` gains `factionLeadership?: FactionLeadershipEntry[]`.
- [ ] 6. `FactionLeadershipEntry` interface exactly as shaped in §1.2.
- [ ] 7. `LEADERSHIP_RULES` const and `LEADERSHIP_FEED_CAP = 200` placed
  after `ALIGNMENT_RULES` in types.ts. Contains all fields listed in §1.1
  including the four-era `eraConfig` keyed by `Era` literals. Zero
  hardcoded numbers in JSX or the runner body.

### Engine — bug fixes (Layer 1)
- [ ] 8. `vacateOffice` (phaseRunners.ts:1770) gains a `FactionLeader`
  arm that clears `f.leaderId` and `f.leadershipStartYear` and writes a
  `factionLeadership` entry with `kind: 'vacated'`, `reason: 'replaced'`.
- [ ] 9. `runPhase_2_2_3_FactionLeaders` is replaced wholesale with the
  Step 0–5 runner specified in §1.3. **Dead/retired filter** lives in the
  validation step (Step 2 invalidation: `current.deathYear` or
  `current.retiredYear`) AND the eligible-pool filter (Step 3:
  `!p.deathYear && !p.retiredYear`). The runner is pure over `snap`;
  randomness via `rng.ts` (`chance`, `rand`); single `refreshPv` at end.
- [ ] 10. On every successful selection / challenge win, the new leader's
  `currentOffice = { type: 'FactionLeader' }` is set, which lights up the
  existing `OFFICE_PRESTIGE.FactionLeader: 8` bump on `refreshPv`. Verified
  by the new leader's `pvCache` increasing by `+8` relative to the no-office
  state (minus any old-office delta if they were displaced from another seat
  — but the spec assumes the leader doesn't simultaneously hold a federal
  seat; see Edge Cases).
- [ ] 11. Per-faction per-tick: at most ONE `installed` or ONE
  `challenged` entry; never both for the same faction (challenge fires
  only on a valid incumbent, election fires only on an invalid incumbent
  — mutually exclusive).
- [ ] 12. End-of-phase invariant: for every `f` with at least one living
  non-retired member NOT holding `'Failed Bid'`, `f.leaderId !== null`. If
  the invariant fails (all members hold Failed Bid OR faction empty), a
  `'system'` log fires with the warning text.

### Engine — propagation hooks (Layer 1)
- [ ] 13. `factionCenter` weights the leader 1.5× (config:
  `LEADERSHIP_RULES.ideologyWeightInFactionCenter = 2`). When no leader is
  seated (null `leaderId`), behavior is identical to today's
  unweighted-mean implementation (verified: leader-not-found branch falls
  through to weight=1 for every member).
- [ ] 14. `ideologyShiftOdds` accepts an optional `actorLeader` parameter
  (or equivalent) and adds `LEADERSHIP_RULES.oratorIdeologyShiftBonus`
  (= 0.05) to `success` when the actor leader has `'Orator'`. Applied at
  every call site (resolver in `resolveIdeologyShift` and any page-preview
  helper that consumes the function). Clamp `[0, 1]` preserved.
- [ ] 15. 2.1.6 conversion sign/poach success: per-attempt `p` gets
  `+0.05` when the actor faction's leader has `'Manipulative'`, applied at
  the same helper that composes the effective chance. Clamp `[0, 1]`
  preserved.
- [ ] 16. 2.1.7 kingmaker graduation: a separate `chance(0.05)` roll fires
  after the main 0.45/0.45/0.10 split when the mentor's faction leader has
  `'Kingmaker'`; on hit, protégé gains `+1 command` (clamped to
  `KINGMAKER_RULES.commandCap = 5`). Does not double-fire if the mentor's
  faction has no leader.
- [ ] 17. 2.1.8 drop pass per-faction K is
  `ALIGNMENT_RULES.stableTurns + (leaderHasLeadership ? 1 : 0)`. ADD pass
  K is unchanged.

### Engine — election + legislation hooks (Layer 1)
- [ ] 18. `electionFactionBias` is called per-candidate (architect adds an
  optional `candidateId` arg). When `candidateId === faction.leaderId`
  AND `snap.game.currentEra !== 'independence'`, the returned bias is
  multiplied by `LEADERSHIP_RULES.electionOnBallotMul = 1.1` (post-cap).
  All three election fan-outs (presidential 2.9.4, governor 2.9.5, senate +
  house 2.9.6) inherit this via `calcStateVote`.
- [ ] 19. `runPhase_2_6_3_Floor` (federal-era branch) adds
  `LEADERSHIP_RULES.sponsorFloorBias = 0.05` to per-member `p` when the
  bill sponsor is their faction's leader AND `m.factionId === sponsor.factionId`.
  The bonus is additive on top of the existing `cardVoteBias` term; final
  `p` clamped `[0, 1]`. 2.6.2 committee and `voteCC` (1772 CC) are NOT
  modified by this hook in v1.

### Engine — challenge resolution (Layer 3)
- [ ] 20. Roll A fire chance is computed per §1.3 Step 2 formula:
  `fireRaw = baseFireChance + ideoWeight * (ideoDist / 6) + patronageWeight
  * pvGapNormalized + (challenger Ambitious ? 0.05 : 0)`; clamped
  `[0, fireCap = 0.20]`.
- [ ] 21. Roll B success chance is computed per §1.3 formula:
  `successChance = clamp(0.5 + pvEdge - incumbencyAdvantage/100, 0.05, 0.95)`.
- [ ] 22. Successful challenge: old leader's `currentOffice` is vacated
  (via `vacateOffice` so the `+8` prestige lifts AND the
  `factionLeadership 'vacated'` entry is written); challenger's
  `currentOffice = { type: 'FactionLeader' }`; `f.leaderId` updated;
  `f.leadershipStartYear = snap.game.year`. Feed: `kind: 'challenged'`,
  `success: true`, `reason: 'challenge-win'`. Log: "X unseats Y as leader
  of the Z."
- [ ] 23. Failed challenge: challenger gains `'Failed Bid'`;
  `failedBidExpiresYear = snap.game.year + 6`. Feed: `kind: 'challenged'`,
  `success: false`, `reason: 'challenge-loss'`. Log: "X's bid to lead the
  Z fails; the chair holds."
- [ ] 24. Failed Bid decay (Step 0 of runner): at HEAD of 2.2.3, any
  politician with `failedBidExpiresYear !== undefined && snap.game.year >=
  failedBidExpiresYear` has the trait stripped and the field cleared. Holds
  even if the trait was added externally (defensive: drives off the
  expiresYear field, not the trait list).

### Engine — Ambitious seeding (Layer 3)
- [ ] 25. Ambitious seed pass (Step 1 of runner): each living non-retired
  un-seeded politician rolls `chance(LEADERSHIP_RULES.ambitiousSeedRate = 0.05)`
  exactly once in their career; trait `'Ambitious'` added on hit;
  `ambitiousSeeded = true` set regardless of roll. Bug-fix friendly:
  legacy saves with un-seeded politicians get their seed roll on the
  first post-update 2.2.3 tick.

### Page — `FactionLeaderPage` rewrite
- [ ] 26. Page is purely read-only. NO buttons, NO `GameContext` methods,
  NO state mutations. Renders the player's faction by default
  (`snap.game.playerFactionId`); faction id is the only query input.
- [ ] 27. **Section A — Current leader card.** Name + PartyBadge,
  ideology, state, age, PV (with breakdown tooltip on hover showing the
  +8 FactionLeader prestige line item), command, tenure ("X years"
  computed from `f.leadershipStartYear`), `factionFitDistance` (distance
  from `factionCenter`), trait pills with positive-trait propagation
  bonuses highlighted (Orator → "+0.05 to faction ideology shifts";
  Manipulative → "+0.05 to faction conversions"; Kingmaker → "+5% extra
  protégé command roll"; Leadership → "+1 turn to interest-card drop
  threshold"; Ambitious → "+0.05 to challenge fire chance, but only if
  they're the challenger"). Threat indicator: a chip showing the
  top challenger's Roll A `fireChance` percentage with color thresholds
  (green < 5%, yellow 5–12%, red > 12%).
- [ ] 28. **Section B — Leadership benefits panel.** Era-conditional
  derived entirely from `LEADERSHIP_RULES.eraConfig[snap.game.currentEra]`
  and the global `LEADERSHIP_RULES` fields. Lists every active bonus
  (independence-era: "+8 PV via FactionLeader prestige"; "leader counted
  1.5× in faction ideology center"; federal: "+10% to election bias when
  leader is on the ballot"; "+0.05 to per-faction vote on bills the
  leader sponsors"; trait-conditional bonuses appear when the leader
  carries the relevant trait). Zero hardcoded numbers in JSX (every
  value reads from `LEADERSHIP_RULES`).
- [ ] 29. **Section C — Challenger ranking (top 3).** Compute the
  challenger pool per §1.3 Step 2 (faction members excluding the leader,
  living, non-retired, `pvCache >= challengerPvFloor`, not holding Failed
  Bid). Display top 3 by `pvCache` (descending; ties by id). Per row:
  name, ideology, PV, trait chips, **Risk %** (Roll A fireChance
  preview), **Threat %** (Roll B successChance preview), plus a small
  "Why?" tooltip explaining the era-conditional formula in plain
  English (e.g. "In the modern era, ideology distance drives 80% of
  challenge risk; this challenger is 3 ideology steps from the leader,
  so risk is elevated.").
- [ ] 30. **Section D — Succession history.** `(game.factionLeadership ?? [])
  .filter(e => e.factionId === viewedFactionId).slice(-10).reverse()`:
  year, kind badge (Installed / Challenged-Win / Challenged-Loss /
  Vacated), former-leader name (if any), new-leader name (if any),
  challenger name (if challenged), reason chip. Empty state: "No
  leadership transitions yet."
- [ ] 31. **Cross-link header.** Single line linking to Faction Alignments,
  Faction Conversions, Ideology Shifts, Kingmakers (matching the cross-link
  pattern from `FactionAlignmentsPage`). Use `NavigationProvider` /
  `navigateTo` API.
- [ ] 32. NO sidebar changes; NO new auto-nav ref in `App.tsx`; NO new
  `GameContext` mutator.

### Save migration
- [ ] 33. New Faction / Politician / GameState fields are optional;
  legacy saves load. The runner's Step 0/1 (Failed Bid decay + Ambitious
  seed) handles backfill on the first post-update tick.
- [ ] 34. Legacy saves where `leaderId` was set by the old runner but no
  `currentOffice = { type: 'FactionLeader' }` ever existed: the first
  post-update 2.2.3 tick re-validates and re-assigns
  `currentOffice = { type: 'FactionLeader' }` to the incumbent (which
  re-runs through the validation as "currentOffice mismatch" → triggers
  an Election; the same incumbent likely wins under the new selection
  formula since they were already top-PV under the old runner). One feed
  entry per faction with `kind: 'installed'`, `reason: 'election'`. Mild
  log churn on the upgrade-tick; acceptable.
- [ ] 35. Legacy saves with `leadershipStartYear` undefined: tenure is
  computed as `snap.game.year - snap.game.year = 0` (the
  `?? snap.game.year` fallback in the page's display logic). No surprise
  challenge timing; tenure starts now.

### Definition of done (per CLAUDE.md)
- [ ] 36. `npm run build` passes.
- [ ] 37. **Playtested in 1856.** Reach 2.2.3 turn 1: every faction has a
  leader with `currentOffice.type === 'FactionLeader'`, PV reflects +8
  prestige, page Section A renders the player's leader with tenure "0
  years"; Section C shows top 3 challengers with non-zero Risk + Threat;
  Section B lists nationalism-era benefits with the correct numbers.
  Advance turns: leader persists; no re-election unless they die/defect.
  Force a defection (or wait for one to fire in 2.1.6): old leader's
  `currentOffice` clears via `vacateOffice` FactionLeader arm; next 2.2.3
  Step 2 invalidation triggers an Election; new leader installed; feed +
  log entries recorded. Advance ~10 turns and observe at least one
  challenge fire (verifiable via the feed); Failed Bid stamp decays 3
  turns later. Pass a bill where the leader is the sponsor: confirm
  per-member yea-rate is observably higher (eyeball: a few extra ayes vs
  baseline).
- [ ] 38. **Playtested in 1772.** Reach 2.2.3 turn 1: independence-era
  branch runs the same validation + selection; Section B lists
  independence-era benefits (high incumbency advantage, low base fire);
  challenge rolls fire rarely (verified by feed entries near-empty
  over ~10 turns). The federal-era hooks (election bias × 1.1,
  sponsor-floor bias) are gated by era and don't fire in 1772. The
  per-faction-center 1.5× leader weight applies; verify 2.1.5 / 2.1.8
  consume the weighted center without crash.

## Edge cases
- **Faction with zero living members.** Step 2 skips the faction entirely;
  `f.leaderId = null`, `f.leadershipStartYear = undefined`. No feed entry
  (no transition occurred). The page Section A renders a "Vacant — no
  eligible members" state. Documented.
- **Faction where every eligible member holds `'Failed Bid'`.** Step 3
  Election returns `winner = null`; warning log fires; `f.leaderId =
  null`. Resolves next tick as the Failed Bid stamps decay (Step 0).
- **Leader simultaneously holds a federal office (e.g. Senator).** Per the
  vision binding "Leader's federal-era primary advantage is NATURAL via
  +8 PV — NO auto-eligibility rig" — the leader CAN be the same
  politician as a sitting Senator, but `currentOffice` only stores ONE
  office. The spec accepts this: assigning `FactionLeader` overrides the
  Senator office on the `currentOffice` field. The Senate seat itself is
  retained (the state's `s.senators[]` array entry still references the
  politician id); only the `currentOffice` field is overwritten. **This
  is a known interaction; it under-counts the prestige of dual-role
  leaders (they lose the Senator prestige).** Mitigation choice (flagged):
  (a) prefer keeping the federal office and writing FactionLeader to an
  alternative field; (b) accept the loss of Senator prestige as the cost
  of leadership; (c) make `currentOffice` an array (large refactor;
  blast radius). **Recommendation: (b)** — accept the loss; document.
  Architect can revisit if playtest finds the leader's PV drops on
  promotion. Flagged as assumption #2.
- **Leader-on-ballot multiplier when the leader is the presidential
  candidate.** Both `c.id === f.leaderId` AND the `×1.1` apply. The bonus
  is on `electionFactionBias` only, which is one of ~6 terms in
  `calcStateVote`; the leader candidate's PV (high, via +8 prestige) also
  contributes via the `pv * 0.1` term. Combined effect: a strong "rally
  around the leader" boost, but partisan / state-bias terms still
  dominate.
- **Sponsor of a bill IS the leader AND IS a Failed Bid holder.** Cannot
  happen — Failed Bid holders are excluded from leader selection; if they
  somehow became leader (legacy save edge case), Step 2 invalidation
  catches them (they don't have `currentOffice.type === 'FactionLeader'`
  by design, since Failed Bid holders can't acquire the chair). Defensive:
  the sponsor-floor bias check also tests `!sponsor.traits.includes('Failed Bid')`
  — recommended belt-and-suspenders.
- **Challenge fires across an in-progress turn boundary.** No — the runner
  is atomic per turn; 2.2.3 fires once per turn; all challenges resolve
  in-phase and the chair's state is consistent by the time 2.2.4 runs.
- **Vacate site collision: leader dies AND is challenged in the same
  turn.** Order: 2.2.3 runs BEFORE 2.4.1 in `PHASE_SEQUENCE` (2.2.3 →
  2.2.4 → 2.3.x → 2.4.1). So challenges resolve first; if the now-deposed
  leader dies later in the turn (via 2.4.1), they die as a non-leader;
  `vacateOffice` no-ops on the FactionLeader arm because they no longer
  hold it. Single feed entry (`challenged`, success=true) for the chair
  change.
- **Defection of the leader (2.1.6 fires before 2.2.3? Order check).**
  PHASE_SEQUENCE: 2.1.6 conversions runs BEFORE 2.2.3. If the leader
  defects to another faction in 2.1.6, `vacateOffice` (called by the
  conversion path; architect verify) clears the chair, writing a
  `'vacated'` / `'replaced'` entry. 2.2.3 then runs invalidation and
  Elects a new leader. Two feed entries; expected.
- **Defection of the leader, but conversion path doesn't call
  `vacateOffice`.** The architect must verify the conversion path's
  exit. If 2.1.6 mutates `p.factionId` without `vacateOffice`, 2.2.3 Step
  2 invalidation catches it (`current.factionId !== f.id` → invalid →
  Election). Defensive; one feed entry instead of two. **Architect
  task: verify and document the 2.1.6 path** — recommend wiring
  `vacateOffice` in the defection branch for symmetry with the death
  path.
- **All eligible members are below `challengerPvFloor = 30`.** Pool is
  empty; no challenge fires this turn. Documented as desired (a faction
  with no credible threat doesn't auto-roll challenges).
- **Mid-game era change (Constitution ratifies, 1772 → federalism).**
  `applyConvention` flips `currentEra`. The era-conditional bonuses
  (`electionOnBallotMul`, `sponsorFloorBias`, the `eraConfig` numbers)
  switch on the very next 2.2.3 tick. Leaders persist across the era
  change; their `leadershipStartYear` is unchanged. Tenure continues to
  accumulate. Documented.
- **A faction's leader is the *only* member.** Validation passes; no
  challenger pool; no challenge fires. PV/prestige works normally.
- **Ambitious seed at age 18.** The seed pass operates on all
  living non-retired politicians (no age gate). A teenage rookie can be
  seeded Ambitious on their first 2.2.3; the trait persists for life.
  Acceptable; trait persistence is the established convention.
- **Failed Bid expires on the same turn the politician retires/dies.**
  Step 0 decay runs first (clears Failed Bid + stamp); 2.4.1 death
  follows (vacates whatever office). No interaction conflict.

## Out of scope
- **NO interactive defense modal** (binding from vision). Challenges
  auto-roll; the player's agency is upstream (PV / ideology / trait
  management).
- **NO direct player pick / picker UI** (binding). The page is purely
  read-only.
- **NO retroactive lineage backfill on legacy saves** (binding). The
  `factionLeadership` feed starts empty; legacy save's prior leader (if
  any) gets one synthetic `installed` entry on the upgrade-tick election
  (acceptance criterion #34) but no historical reconstruction.
- **NO new election or CC mechanics beyond the integration touch-points**
  (binding). 2.9.x and the CC voting (`voteCC`) are unchanged structurally;
  the only delta is the leader-conditional bonus in 2.6.3 federal floor
  and the per-candidate bias multiplier in `calcStateVote`.
- **NO new `GameContext` mutators** (binding). The page is informational.
- **NO new auto-nav ref in `App.tsx`** (binding — matches the
  Faction Alignments pattern; 2.2.3 is passive like 2.1.8).
- **NO special-case CC delegation rig** for the leader (binding from
  vision). Leader's CC advantage is natural via +8 PV only.
- **NO primary-pool eligibility rig** for the leader (binding from
  vision). Leader's primary advantage is natural via +8 PV only.
- **NO rename of historically-anachronistic faction names** (binding from
  vision). `Ellsworth Progressives` / `Crittenden Republicans` /
  `Liberal Republicans` / `Washington Patriots` stay as-is; separate
  cleanup feature.
- **NO `voteCC` (1772 CC) integration with sponsor-floor bonus** (v1).
  The 1772 CC delegate dynamics are too different from federal floor
  voting; leaders may not even be delegates. Deferred to v2 if playtest
  asks.
- **NO `Ambitious` era-conditional UI labeling** (v1 ships neutral per
  vision). Future cleanup may add era-tagged labels per the historian's
  classical-republican-vice flag.
- **NO scenario-data changes.** Seed factions are unchanged; the existing
  `leaderId` field stays null / pre-seeded; the first 2.2.3 tick elects
  initial leaders.
- **NO direct multi-leader model** (binding — historian-flagged
  simplification accepted). Single leader per faction; future v2 could
  model co-leaders (Hamilton + Adams, Clay + Webster) but not in v1.

## Open questions / assumptions

**Riskiest first.**

1. **`factionCenter` weighting blast radius (THE risk; lead).** Modifying
   `factionCenter` to weight the leader 1.5× is a structural change that
   propagates to 2.1.5 ideology shifts, 2.1.6 conversion fit, and 2.1.8
   alignment drift (personality bucket + drift card buckets). Three live
   2.x systems share that math. **Mitigation:** the 1.5× weight is
   *identity-preserving in expectation* (a leader at the mean shifts the
   mean by zero), so the system-wide behavior change is *sharpening*
   (leaders pull centers harder when ideologically distinct), not
   *biasing* in a direction. The function still returns an integer
   bucket `0..6`, so downstream consumers don't see continuous drift;
   their behavior changes only at bucket boundaries. **If playtest finds
   this oscillates faction personality wildly, the `ideologyWeightInFactionCenter`
   const is a single-line tune.** Flagged.
2. **Federal seat collision RESOLVED at Checkpoint 1 — DECOUPLED.** The
   user chose: Faction Leader does NOT take `currentOffice`. Instead, a new
   optional field `Politician.factionLeaderOf?: string | null` (denormalized
   mirror of `Faction.leaderId`) carries the leadership state. `computePV`
   adds `+8 PV` when `p.factionLeaderOf` is non-null, additive to the
   existing `OFFICE_PRESTIGE[p.currentOffice?.type ?? 0]` term. A Senator
   who becomes Faction Leader keeps the Senator slot AND gets the +8 leader
   bonus — net `+8 PV` (not `+3`). Symmetric on vacate: the runner's Step
   2/3 paths set/clear `factionLeaderOf` in lockstep with `f.leaderId`.
   `OfficeType.FactionLeader` stays in the union and the `OFFICE_PRESTIGE`
   table as DEAD CODE (architect's choice whether to remove now or leave
   for cosmetic cleanup later). **`vacateOffice` does NOT need a
   `FactionLeader` arm** — the runner's validation step (Step 2) catches
   stale leaderships on death/retire/defect and runs Election; the cleanup
   of `factionLeaderOf` on the displaced leader happens there.
3. **2.1.6 conversion vacate symmetry.** The 2.1.6 path on defection
   doesn't necessarily call `vacateOffice`; if it just mutates
   `factionId`, the `FactionLeader` chair stays attached to the
   defector. **Mitigation:** Step 2 invalidation catches `factionId !==
   f.id`, runs Election, fills the seat. Defensive — works. But
   recommend the architect add a `vacateOffice` call to the 2.1.6
   defection path for symmetry. Out-of-scope edit but flagged.
4. **`eraConfig` numbers** (binding initial values, all tunable):
   - `independence`: base 0.015, incumbency 30, ideo 0.20, patronage 0.80
   - `federalism`: base 0.025, incumbency 20, ideo 0.30, patronage 0.70
   - `nationalism`: base 0.045, incumbency 15, ideo 0.40, patronage 0.60
   - `modern`: base 0.060, incumbency 8, ideo 0.80, patronage 0.20
   Cited from historian's qualitative ranking (independence very-low /
   very-high; nationalism high / moderate; modern high / low). Architect
   may flag a 5th era (`gilded-age` micro-window) if the playtest of
   1856 → Reconstruction shows nationalism is too coarse for
   1865–1900. Today's `Era` union is fixed at four members and the spec
   targets that union.
5. **`fitPenalty = 1.0` PV per IDEOLOGY_ORDER step distance.** Per
   vision recommendation. A 3-step gap subtracts 3 from `pvCache` in
   the Election scoring — meaningful but smaller than the typical PV
   spread (50–100 range), so PV usually wins. **Tunable.**
6. **`traitBonusPerPositive = 2`, cap = 6.** Per vision recommendation.
   A politician with 3+ positives gets the cap; doesn't dominate PV;
   nudges close races. **Tunable.**
7. **`challengerPvFloor = 30`.** PV floor of 30 excludes most rookies
   (typical rookie PV 15–35); prevents thrash-y challenge rolls from
   the bottom of the faction. **Tunable; flag.**
8. **`fireCap = 0.20`** caps Roll A absolutely. Without it, an Ambitious
   ideologue in modern era could push fireChance > 0.30. The cap keeps
   the system feeling stable (1-in-5 max per faction per turn).
   **Tunable.**
9. **`failedBidDecayTurns = 3` (= 6 years).** Per vision recommendation.
   Long enough that the failed challenger pays a real cost; short enough
   that a true ideologue can try again within the same "era window."
   **Tunable.**
10. **`ambitiousSeedRate = 0.05`** (5%). Per vision recommendation. With
    ~30 active living politicians per faction over a long game, expects
    1–2 Ambitious members per faction at steady state. **Tunable.**
11. **Trait propagation magnitudes (`+0.05` on each of 2.1.5/2.1.6;
    `+5%` on Kingmaker; `+1` on Leadership drop K).** All per vision
    recommendation. The 2.1.5/2.1.6 numbers are small enough that
    Orator/Manipulative leaders feel like a nudge, not a free pass; the
    Kingmaker `+5%` is one-per-tick per faction so it doesn't compound;
    Leadership's `+1` turn extension matches the kind of "your machine
    holds together" feel the trait already evokes. **All tunable; flag.**
12. **Ambitious era UI labeling** — v1 ships neutral. Historian flags
    that "Ambitious" reads as a vice pre-1828 (classical republican
    tradition); a future UI refinement could surface era-tagged labels
    ("Aspiring" pre-1800, "Ambitious" 1828+, "Driven" today) without
    changing mechanics. **Out of scope; flag.**
13. **Single-leader-per-faction abstraction.** Historically Sons of
    Liberty had no national head, Federalists had Hamilton + Adams in
    opposition, Whigs had Clay + Webster. Vision and historian both
    explicitly accept this simplification for v1. **Out of scope; flag.**
14. **`vacateOffice` reason taxonomy.** Two implementation choices
    (§1.4); recommendation is generic `'replaced'` from `vacateOffice`
    with optional richer follow-up entries from call sites. Architect's
    call.
15. **Order of trait propagation evaluation vs. the leader's own
    Ambitious trait.** The challenger's Ambitious trait nudges Roll A
    UP. The leader's own positive traits (Orator, Manipulative, etc.)
    propagate to their FACTION's other systems but do NOT affect their
    own incumbency advantage. This is by design — the propagation
    hooks are voice-of-faction effects, not personal-survival effects.
    Flag.
16. **Sponsor-floor bonus does NOT apply to cross-faction same-party
    members.** This is by design — the leader's authority is faction-
    local. A more permissive read ("leader of the dominant faction
    drives the whole party") could extend the bonus to same-party
    members at a reduced rate (e.g. `+0.025`). Flag for playtest.
17. **Page Section C "Why?" tooltip** uses era-conditional plain
    English. Architect: write 4 tooltip variants (one per era)
    explaining the dominant trigger in human terms. Mechanic is
    binding; the text is flavor.
18. **CC-era leader is NOT auto-included in CC delegation** (vision
    binding). The leader can still be a delegate if their state's
    selection picks them, but no rig. Documented.
19. **`recordFactionLeadership` helper.** Analogous to
    `recordIdeologyShift`, `recordKingmaker`, `recordAlignmentDrift`. FIFO
    capped at `LEADERSHIP_FEED_CAP = 200`. Three-line implementation;
    architect adds.
20. **`Math.random()` in `calcStateVote`** remains unchanged (pre-
    existing concern). The leader's `×1.1` multiplier wraps the
    deterministic `electionFactionBias` term, NOT the `Math.random`
    jitter. No determinism delta introduced by this spec.
