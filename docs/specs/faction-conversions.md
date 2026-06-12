# Spec: Faction Conversions (Phase 2.1.6)

> Third clone of the Relocations → Ideology Shifts architecture
> (`docs/specs/relocations-system.md`, `docs/specs/ideology-shifts.md` + briefs).
> Anything tagged **(established pattern)** is a structural clone — the architect
> should diff against the ideology-shifts brief, not redesign. Wordcount below is
> spent on what is NEW: the defection destination cascade, the poach/sign
> economy, cross-party rewrites, and player-roster exposure.

## Vision (as given)
Phase 2.1.6 is a placeholder: a flat 2% coin-flip teleporting CPU politicians to
a uniformly random same-party faction — player roster immune, no recruitment,
and undrafted rookies rot forever as factionless free agents no system touches.
Replace it with symmetric passive defections (the 2% stays, now hitting
everyone including the player and officeholders, with a 90% one-faction-away /
10% any-faction wild-card destination roll) PLUS an active economy: 5 attempts
per faction per phase to POACH rival politicians (same-/cross-party odds
matrix, willingness multipliers) or SIGN factionless free agents — built on the
established resting-window / shared-resolver / attempt-cap / subject-stamp /
feed / legend / lazy-trait-seeding architecture.

## Player experience
Each turn the game rests at the Faction Conversions window. Your roster is no
longer safe: every member runs the same 2% defection risk the world does, and
rival factions spend real attempts trying to flip your stars — so you read your
own dashboard for who's drifting, who's Loyal, and who's anchored by a mentor.
Then you go shopping: sign a well-fitted free agent off the dead pool (cheap
growth), or pay the long odds to wrench a rival legislator — even a sitting
senator across the aisle, flipping chamber math live and branding them a
flip-flopper. The 10% wild card means once in a while the map realigns on its
own, and the feed tells the story.

## User story
As a faction-running player, I want to spend a capped budget of conversion
attempts poaching rival politicians and signing free agents — seeing the exact
itemized odds before I commit — while reading my own roster's defection risk,
so that I can grow my faction and defend it now that membership is no longer
static and my own people can walk.

## Verified engine facts (drive the design; architect must not re-derive)
- Current runner `runPhase_2_1_6_Conversions` (phaseRunners.ts:816–830): skips
  the player's faction, factionless, and officeholders; 2% flat; uniform
  same-party destination; +1 FF; per-switch `addLog`. **Delete wholesale**
  (logs removed; one conditional summary line replaces them — established
  pattern). engine.ts:33 already dispatches 2.1.6 with `return {}` → the
  resting window exists; **zero engine.ts/phases.ts changes**. 2.1.6 is NOT
  first-turn-skipped (runs 1772 turn 1).
- `factionCenter(snap, factionId)` exported at phaseRunners.ts:612 (living,
  non-retired mean index, rounded, `null` on empty) — **REUSE, do not
  redefine**.
- **Free agents have `partyId: null`** at both creation sites: rookie-gen
  (phaseRunners.ts:190–191) and `instantiateDraftees` (draftImport.ts:243–244).
  A party-match-dependent sign base is structurally impossible → sign base is
  flat (decided below). Undrafted draftees persist in `snap.politicians` with
  `factionId: null`.
- Both scenarios have exactly **5 BLUE + 5 RED factions** (factions1772.ts,
  factions1856.ts; `PartyId = 'BLUE' | 'RED'` in both eras) — the within-party
  ordering and cross-party rules behave identically in 1772 and 1856.
- **No cached party rosters**: `Senator` / `State` seat structures store
  politicianId only (types.ts:300–312, no partyId field); 2.2.1 majorities,
  floor votes, draft AI, and 2.9.x all recompute live from `p.partyId` (~26
  read sites). The only stored partyIds are historical election-result records
  (types.ts:480) — correctly frozen. Live party flips break nothing structural.
- Phase order within a turn: 2.1.6 → 2.1.7 (kingmakers) → 2.1.8 (personalities)
  → 2.2.1 (chamber leadership) → … → 2.6.3 (floor) → 2.9.x (elections). A
  cross-party flip at 2.1.6 reshapes THIS turn's majorities, floor votes, and
  elections — intended.
- 2.1.7 (phaseRunners.ts:835–845): `protegeId` points FROM the kingmaker TO the
  protégé; assigned same-faction; only when `!p.protegeId`.
  `flipFlopperPenalty` −5 PV/stack (pv.ts:82), decays −1/turn at 2.1.3.
  Permanent `'Flip-Flopper'` trait exists in NEGATIVE_TRAITS and
  CAREER_RANDOM_NEGATIVES (types.ts:142, 175).
- Career random positive pool already filters `t !== 'Ideologue'`
  (phaseRunners.ts:320) — `'Loyal'` joins that exact filter.
- App.tsx has four auto-nav refs (draft/careers/relocations/ideology) — this
  adds the FIFTH. Sidebar: insert between `ideology` (line 36) and
  `kingmakers` (line 37). GameState: new fields go after `ideologyAttempts`
  (types.ts:558); Politician fields after `lastIdeologyAttemptYear` (253);
  consts after `IDEOLOGY_SHIFTS_CAP` (212).

## Mechanics (decided values)

### Passive defections — the 2.1.6 tick (binding numbers)
Per living, non-retired politician, array order:
- **Skip**: dead/retired; **factionless** (free agents never passively join or
  leave — signs are their only activation); subject-stamped this year
  (`lastConversionAttemptYear === year` — the shared stamp blocks the passive
  pass, binding); `Loyal` holders (passive ×0 — explicit skip, zero RNG draws);
  members of a source faction already at the **loss cap** (below).
- **Roll**: `chance(0.02 × passiveMult)` — `Opportunist` ×2 → 4%. The old
  player-skip and in-office skip are REMOVED: the player's roster and
  officeholders (senators, reps, the sitting president) all roll (binding; no
  POTUS exception in v1 — decided, flagged riskiest).
- **On hit, destination roll** (one partitioned draw): **90% one-faction-away
  / 10% any-faction wild card**.
  - **One away (NEW — faction ordering)**: ordering = same-party factions with
    a non-null **tick-start** center (REUSE `factionCenter`), sorted center
    ascending, tie-break faction id ascending. Direction 50/50 left/right in
    that rank; at an edge rank, **forced inward** (the 90% bucket always
    moves). If the subject's faction is the party's only ordered faction →
    **fizzle**: no move, no FF, no entry, no loss count (defensive — can't
    occur with shipped data). Orderings + center map computed **once at tick
    start**, stable per tick (established pattern: passive uses tick-start
    environment; active uses live).
  - **Wild card**: uniform over ALL factions ≠ current with a non-null
    tick-start center — any party, **player's faction included as a
    destination** (you can gain defectors). Empty pool → fizzle (defensive).
- **Apply**: `p.factionId = dest.id`; **`p.partyId = dest.partyId` on EVERY
  success** (binding for cross-party; generalized for self-healing —
  `crossParty` itself is derived from the two FACTIONS' partyIds, not
  `p.partyId`); `p.flipFlopperPenalty += crossParty ? 2 : 1` (same-party +1
  binding; cross-party +2 decided — defecting your party is worse, and it
  matches the binding poach stacks); append feed entry kind `'defect'`,
  `success: true`, no `actorFactionId`. Only movements are recorded; missed 2%
  rolls and fizzles are non-events (established pattern).
- **Loss cap (NEW, decided)**: `lossCapPerFaction = 2` successful passive
  defections per SOURCE faction per tick; once hit, remaining members skip the
  roll entirely. Counts passive losses only — poach losses are already capped
  by the attempt economy. Gains are uncapped.
- The passive pass never writes the subject stamp (established pattern — it is
  the turn's last actor; stamps self-expire at year +2).

### Active attempts — POACH and SIGN (one shared resolver)
(established pattern: 5 attempts/faction/phase counter with lazy year reset;
shared subject stamp `lastConversionAttemptYear` set on every resolved attempt
incl. failures, one attempt per subject per turn regardless of attacker, also
blocks the passive pass; single private resolver `resolveConversion(snap,
actorFactionId, p)` with the null=rejected / non-null=ran contract; player
path `attemptPlayerConversion(snap, politicianId): boolean` gateless — the
click IS the roll; boolean contract: `true` = ran, failed rolls return `true`
and persist counter+stamp+feed; GameContext `attemptConversion` delegation
clone.)
- **Kind is DERIVED** (established pattern): subject `factionId === null` →
  `'sign'`; subject in another faction → `'poach'`; subject in the ACTOR's own
  faction → **rejected** (own members are never subjects — see assumption #3).
- **POACH base odds matrix (binding)**, cell = (party match × office status);
  party match compares the two factions' partyIds:

  |              | Not in office | In office |
  |--------------|---------------|-----------|
  | Same party   | 20%           | 5%        |
  | Cross party  | 10%           | 2%        |

  On success: rewrite `factionId` AND `partyId` (binding); FF stacks +1
  same-party / +2 cross-party (binding). Office, seat, state, career track,
  altState, protegeId all travel untouched — only the labels flip.
- **Willingness multipliers on the poach base** (leans confirmed; composed
  multiplicatively, clamped [0,1] — max composed ≈ 70%):
  - **Ideology fit**: ×1.5 if `|subjectIdx − recruiterCenter| <
    |subjectIdx − currentFactionCenter|` (move improves fit), ×0.5 if it
    worsens (>), **×1 on equal** — and ×1 when either center is undefined
    (decided: an empty recruiting faction may still poach at neutral fit — its
    recovery path; deviation from ideology-shifts' actor-center rejection).
    Centers computed **live** via `factionCenter` at attempt/preview time.
  - **FF history** ×1.25 if `flipFlopperPenalty > 0` (the decaying counter).
  - **Mentor bond** ×0.5 if the subject is bonded **within their current
    faction** (decided precisely): (a) `subject.protegeId` points to a living,
    non-retired politician in the subject's current faction, OR (b) some
    living, non-retired member of the subject's current faction has
    `protegeId === subject.id`. Bonds to dead/retired/defected partners do not
    anchor.
  - **PV** ×0.75 if `pvCache >= 50`.
  - **Traits**: `Loyal` ×0.25 / `Opportunist` ×1.5 / permanent `'Flip-Flopper'`
    trait ×1.25 (stacks with the counter multiplier).
- **SIGN free agents**: base **20% flat** (decided — free agents verifiably
  have `partyId: null`, so a party-match variant is impossible; cross-party
  sign cannot occur, `crossParty: false` always). Modified ONLY by ideology
  fit + Loyal/Opportunist (binding): fit for the factionless has no
  current-faction comparison, so it is **distance-banded (NEW, decided)**:
  `|subjectIdx − recruiterCenter| ≤ 1` → ×1.5; `≥ 3` → ×0.5; else ×1
  (recruiterCenter null → ×1). **NO FF penalty** (binding). Success sets
  `factionId` AND `partyId` to the recruiter's. Both player and CPUs sign.
- **One exported pure odds helper** (established preview===roll pattern, NEW
  payload): `conversionOdds(snap, actorFactionId, p)` returns the derived
  kind, `crossParty`, the matrix/sign base, an **itemized factor breakdown**
  (fit / FF / mentor / PV / traits), and the clamped final % — consumed by the
  resolver, the CPU pass, AND the confirm card. A second tiny exported helper
  `passiveConversionChance(p)` (0 / 2% / 4%) feeds both the tick's roll and
  the own-view Risk column.
- **Failed attempts (decided shape)**: record `toFactionId =` the actor's
  faction (the attempted destination — relocations precedent, NOT the
  ideology-shifts `from === to` shape), `success: false`, `ffGained: 0`,
  subject unchanged. Least-confusing: the feed reads "A → B, Failed".

### Traits + lazy seeding (established pattern: sentinel, partitioned roll, no repair())
- `'Loyal'` → Trait union + **POSITIVE_TRAITS** (+4 PV): passive-immune,
  ×0.25 vs poach AND sign. **Excluded from the career random positive pool at
  the same filter as `'Ideologue'`** (phaseRunners.ts:320) and appears in no
  other grant table (not in TRACK_THEMED_TRAITS, not in
  CAREER_RANDOM_NEGATIVES).
- `'Opportunist'` → Trait union + **NEGATIVE_TRAITS** (−5 PV): passive ×2,
  ×1.5 vs poach and sign. Not added to CAREER_RANDOM_NEGATIVES.
- Seed rates (decided, lean confirmed): **8% Loyal / 8% Opportunist / 84%
  neither**, one partitioned roll per living, non-retired, unseeded politician,
  sentinel `conversionTraitsSeeded`, mutually exclusive, existing holders
  skipped (sentinel still set). **Free agents ARE seeded** (decided — the pass
  hits the whole politicians array; a Loyal free agent is harder to sign).
  Zero pv.ts edits (imports the canonical lists).

### CPU policy (proposed — all numbers in `CONVERSION_ODDS.cpu`)
Runs in the tick, CPU factions in array order, all attempts through the shared
resolver (cap/stamp re-validated structurally — established pattern). Per
faction, **sign first** (cheap growth), then poach:
- **Sign pass**: candidates = living, non-retired, factionless, unstamped;
  sorted by composed `conversionOdds` final desc, then `pvCache` desc, then id
  asc; scan top `signScan = 6`; per-candidate gate `signGate = 0.35`; stop
  after `signBudget = 2` resolved sign attempts or at the cap.
- **Poach pass**: candidates = living, non-retired members of OTHER factions
  (**player's included — binding**), unstamped; same sort (composed odds desc,
  `pvCache` desc, id asc); scan top `poachScan = 8`; gate `poachGate = 0.15`;
  until the cap.
- Failed gates consume nothing (established pattern). Expected ≈ 0.7 sign +
  ~1.2 poach attempts per CPU faction per turn — well under the 5-cap; gates
  exist so CPUs don't burn 5 every turn. Odds-desc targeting means CPUs chase
  easy flips over stars (PV is only a tie-break) — flagged for playtest.

### Tick order (established pattern, conversions content)
Eager `conversions ??= []` → trait-seed pass → lazy counter reset → tick-start
center map + per-party orderings → CPU pass (sign then poach) → passive pass →
one unconditional `refreshPv` (seeded traits + FF hits; faction membership
itself is not a PV input) → **at most ONE summary log** when the tick produced
≥1 event (e.g. "Realignment currents: N defections; M recruitment attempts
resolved."). No other logs anywhere in 2.1.6 code.

### State shape
- `GameState.conversions?: ConversionEntry[]` (FIFO `CONVERSIONS_CAP = 200`),
  `GameState.conversionAttempts?: { year, counts }` (established pattern).
- `ConversionEntry` (decided refinements): `{ year, politicianId,
  fromFactionId: string | null, toFactionId: string, fromPartyId: PartyId |
  null, toPartyId: PartyId, actorFactionId?: string, kind: 'defect' | 'poach'
  | 'sign', crossParty: boolean, success: boolean, ffGained: number }` —
  party fields **always populated** (decided; sign rows carry
  `fromPartyId: null`); `actorFactionId` absent on defects; `ffGained` 0 on
  failures and all signs, else 1/2.
- `Politician.conversionTraitsSeeded?: boolean`,
  `lastConversionAttemptYear?: number` (attempt-accurate name — established
  lesson). All fields optional; legacy saves load unchanged; **no repair()
  changes**.
- types.ts consts (single source for engine AND legend, architect may refine
  internal keys): `CONVERSION_ODDS` — passive (rate .02, oneAway .9, anyFaction
  .1, lossCapPerFaction 2), the four-cell poach matrix, sign (base .2, fit
  bands ≤1 / ≥3), willingness multipliers (fitBetter 1.5, fitWorse .5,
  ffHistory 1.25, mentorBond .5, highPv .75 @ pvCache ≥ 50, flipFlopperTrait
  1.25), trait mods (Loyal: passive 0, attempt .25; Opportunist: passive 2,
  attempt 1.5), ffStacks (same 1, cross 2), seed (.08/.08), cpu (signGate .35,
  signScan 6, signBudget 2, poachGate .15, poachScan 8);
  `CONVERSION_ATTEMPTS_PER_TURN = 5`; `CONVERSIONS_CAP = 200`.

## Acceptance criteria

### State & types (src/types.ts)
- [ ] `Trait` union gains `'Loyal'` (→ POSITIVE_TRAITS) and `'Opportunist'`
  (→ NEGATIVE_TRAITS); zero pv.ts edits; neither appears in
  CAREER_RANDOM_NEGATIVES or any TRACK_THEMED_TRAITS pool.
- [ ] `Politician` gains `conversionTraitsSeeded?` and
  `lastConversionAttemptYear?`; `GameState` gains `conversions?` and
  `conversionAttempts?`; new `ConversionEntry` exactly as shaped above; new
  `CONVERSION_ODDS` / `CONVERSION_ATTEMPTS_PER_TURN` / `CONVERSIONS_CAP`
  consts with the values above (zero hardcoded numbers in JSX).

### Engine (src/engine/phaseRunners.ts — replace 816–830 wholesale)
- [ ] Exported pure `conversionOdds(snap, actorFactionId, p)` (derived kind,
  crossParty, base, itemized factors, clamped final) and
  `passiveConversionChance(p)` — used by resolver, CPU pass, tick, AND the
  page (preview === roll, both active and passive). `factionCenter` is
  REUSED, not redefined.
- [ ] Shared resolver enforces in order: phase `'2.1.6'`; subject alive,
  non-retired; kind derived (sign iff factionless; own-faction subjects
  rejected); subject stamp clear; actor count < 5. On pass: charge counter,
  stamp subject (failures too), one success roll at the composed odds; on
  poach success apply faction+party rewrite and `flipFlopperPenalty +=
  ffStacks[crossParty ? 'cross' : 'same']`; on sign success apply
  faction+party rewrite, no FF; append the feed entry (success and failure,
  failures record `toFactionId =` actor's faction; FIFO trim 200). No addLog,
  no refreshPv inside (established pattern).
- [ ] `attemptPlayerConversion(snap, politicianId): boolean` — actor = player
  faction, gateless, refreshes PV only when FF was inflicted; boolean
  contract documented at the function (established pattern); GameContext
  `attemptConversion` delegation clone; repair() untouched.
- [ ] Tick runs exactly: eager init → seed pass (8/8/84, sentinel, free agents
  included) → counter reset → tick-start center map + per-party orderings →
  CPU pass (sign budget 2 then poach scan, via the resolver) → passive pass →
  one `refreshPv` → ≤1 conditional summary log. All passes array-ordered, all
  randomness via rng.ts.
- [ ] Passive pass: skips dead/retired, factionless, stamped, Loyal, and
  capped-loss factions; rolls 2%/4%; destination cascade 90% one-away (ordering
  as specified, edges forced inward, single-faction ordering fizzles
  unrecorded) / 10% wild card (any non-empty faction incl. player's,
  cross-party allowed); EVERY success rewrites factionId AND partyId and adds
  +1/+2 FF; records kind `'defect'` movements only; never writes the stamp; at
  most 2 passive losses per source faction per tick.
- [ ] The player's roster and in-office politicians (president included) are
  subject to passive defection AND CPU poaches — the old player-skip and
  office-skip are gone; conversions never touch `currentOffice` or any seat
  roster (labels flip, seats stay).
- [ ] `engine.ts`, `phases.ts`, `pv.ts`: no changes.

### Player agency & locking (established pattern)
- [ ] Attempts valid only while resting at `phaseId === '2.1.6'`
  (engine-enforced; page always viewable). Disabled-tooltip precedence on
  Poach/Sign: phase lock ("Conversions open during the Faction Conversions
  phase") → cap ("No attempts remaining this phase (5/5)") → stamped
  ("Already attempted this turn"). In-office is NOT a disable cause (the
  matrix prices it instead).
- [ ] Click resolves immediately; result visible same render (feed entry,
  status flip, badge increment); attempts and stamps survive mid-window
  save/load.

### Auto-navigation (src/App.tsx)
- [ ] FIFTH ref-keyed effect: resting at `'2.1.6'`, key `` `${year}:2.1.6` ``,
  navigate to `'conversions'` once per entry (established pattern). The
  5-hop draft-turn rhythm (draft → careers → relocations → ideology →
  conversions) is a known playtest watch-item (third escalation).

### Conversions page (new src/pages/Conversions.tsx)
- [ ] New `'conversions'` PageId in registry.ts; Sidebar "Faction Conversions"
  directly after Ideology Shifts. Header: title, PartyBadge (omitted on the
  Free Agents view), functional faction dropdown (player first "(you)") with
  an appended **"Free Agents" pseudo-view**; "Attempts: X / 5" badge — always
  the PLAYER's count (established deviation), amber at cap.
- [ ] **Own view — defensive dashboard, NO action button**: living,
  non-retired members with columns Name, St, Age, Ideology, PV, Fit (distance
  from MY live center), **Risk %** (from `passiveConversionChance` — 0/2/4%),
  Traits (negatives red), FF stacks (>0 only), mentor-bond badge (the exact
  predicate the odds helper uses).
- [ ] **Rival view**: same base columns plus a party-match badge indicating
  the applicable matrix cell (same/cross × office) and a **Poach** button per
  row (in-office rows actionable). Inline confirm card (established pattern,
  one open at a time) shows the itemized breakdown — base × fit × FF ×
  mentor × PV × traits = final % — from `conversionOdds`, plus the FF-stakes
  line ("+1 FF stack on success" / "+2 FF stacks on success (cross-party)"),
  Attempt / Cancel.
- [ ] **Free Agents view**: living, non-retired factionless politicians;
  columns incl. Fit to MY center and live Sign odds; **Sign** button + same
  confirm-card pattern (no FF line).
- [ ] **Feed** (established pattern, NEW filter semantics): last 20 reversed of
  entries where `fromFactionId === viewed || toFactionId === viewed`; Free
  Agents pseudo-view shows entries with `fromFactionId === null`. Row: year,
  kind badge (Defect/Poach/Sign), cross-party badge when `crossParty`, name,
  from → to faction names (null renders "Free Agent"), Success/Failed badge,
  red "FF +N" badge when `ffGained > 0`. Passive defections appear. Empty:
  "No conversions yet."
- [ ] **Legend** rendered entirely from `CONVERSION_ODDS` /
  `CONVERSION_ATTEMPTS_PER_TURN`: the 2% → 90/10 cascade with the wild-card
  line surfaced clearly (any faction, cross-party, the realignment card), the
  four-cell matrix, the willingness table (sign's reduced set noted), FF
  stacks 1/2 + decay, trait seeds, the loss cap, and cap/stamp/phase-lock
  rules.
- [ ] Empty states per view; feed and legend always render.

### Definition of done (per CLAUDE.md)
- [ ] `npm run build` passes.
- [ ] Playtested in 1856: reach 2.1.6 (fifth auto-nav); own view shows Risk %
  0/2/4 by trait and Fit/mentor badges; poach a rival — confirm card's
  itemized product matches the legend math, land a success (faction+party
  flip, FF stacks visible, PV −5/−10) and a failure (feed "A → B Failed",
  badge increments, subject stamped); poach an in-office cross-party target
  at 2% and verify chamber majority math follows a flipped senator; sign a
  free agent (joins with recruiter's party); hit the 5-cap; reload mid-window
  (badge/stamps intact); Advance and verify the tick — Defect entries
  including losses FROM the player's roster, ≤2 passive losses per faction,
  a wild-card cross-party defection eventually, Loyal/Opportunist badges with
  PV deltas (first tick), CPU Sign/Poach entries incl. attacks on the player,
  exactly one summary log; next turn FF decays at 2.1.3. 1772 smoke: turn 1
  reaches 2.1.6, inaugural undrafted leftovers populate the Free Agents view
  immediately, signs work, no crash.

## Edge cases
- **First window after creation/legacy load** (established pattern): traits
  unseeded → previews show base odds and rolls match; Loyal/Opportunist appear
  after the first tick.
- **1772 turn 1**: 2.1.6 runs; dataset leftovers are free agents from the
  start — the sign economy is live on turn 1.
- **Defecting/poached president or chamber officer**: seat and office persist;
  party label flips; 2.2.1 (same turn, later phase) recomputes majorities
  live; election-result records keep their historical partyId. No POTUS
  exception in v1 — Tyler-style drama, playtest flag.
- **Stale mentor bonds**: a defected kingmaker's `protegeId` now points
  cross-faction → the bond anchors neither side (predicate requires the
  partner in the subject's CURRENT faction); 2.1.7 never reassigns (it checks
  `!p.protegeId`). Accepted in v1, no cleanup.
- **Empty faction**: excluded from one-away orderings and the wild-card pool
  (never receives passive defectors), cannot lose anyone, but CAN poach/sign
  at fit ×1 — its only recovery path.
- **Edge-rank factions**: one-away always moves inward; a party with one
  living-centered faction fizzles the 90% bucket (defensive only).
- **Stale/null `p.partyId` on a faction member**: crossParty derives from
  faction partyIds and every success rewrites `p.partyId` — self-healing.
- **Both traits held (hand-edit)**: multipliers compose; Loyal's passive ×0
  dominates (0×2); poach/sign 0.25 × 1.5 = 0.375.
- **Stamp interplay**: `lastConversionAttemptYear` is independent of the
  2.1.5 ideology stamp — one politician can be subject to one attempt in EACH
  system per turn. Player window precedes the tick → player stamps first
  (established pattern).
- **Free agents**: never passive participants, never poach subjects, never FF;
  seeded with traits; invisible in faction feeds except via sign rows
  (fromFactionId null → Free Agents pseudo-view).
- **Same-turn election ripple**: defections/poaches land before this turn's
  primaries and 2.9.x — flipped members contest under their NEW party.
  Intended; no formula changes (PV inputs touched: two new traits + the
  existing FF counter).
- **Feed churn**: ~4–6 passive moves + ~10–20 active attempts per turn
  world-wide consume the 200 cap in ~10–15 turns — invisible at feed depth 20
  (established pattern).
- **Dead/retired**: never seeded, never roll, never subjects; entries persist.

## Out of scope
- **Retention/counter-offer economy** (binding) — incl. any own-roster
  "stamp-lock my own member" action (see assumption #3; own view has no
  action button by binding vision).
- **Era-specific scripted realignment EVENTS** (binding): the cross-party
  MECHANICS ship here; 1854-style scripted realignments are era content.
- POTUS/officeholder defection guards or resignation flows (v1 has none —
  flagged for playtest, one-line guard if needed).
- Faction `shortName` field — feed renders existing names (architect may
  truncate for layout).
- Loyal/Opportunist in career pools, draft dataset, or `scripts/` heuristics;
  dataset regeneration.
- CPU attempt-budget visibility; notifications outside the feed; repair() /
  migration work; rng.ts seeding; changes to 2.1.5/2.1.7/2.1.8, PV, or
  election formulas.

## Open questions / assumptions
Riskiest first:
1. **No POTUS exception (lean followed)** — the sitting president can
  passively defect, even cross-party (a 0.2%/turn wild-card event, 2%×10%),
  and can be cross-party poached at 2%. Maximum drama, real realignment —
  but if playtest hates a party-flipped presidency, the guard is one line.
2. **Churn volume + pre-election timing**: ~3–5 passive defections (2% over
  ~200 living, loss-capped at 2/faction) + ~1–3 CPU poach successes + ~1
  sign per turn, all before the same turn's chamber math, floor votes, and
  elections — and the player's roster is newly exposed on every channel.
  This is the third CPU system stacked in the same pre-election stretch; CPU
  gates (signGate .35/scan 6/budget 2, poachGate .15/scan 8) are my numbers.
  Needs the established playtest sign-off; every number is a const.
3. **"Burning your own attempts to stamp-lock subjects" read as first-mover
  locks on CONTESTED rivals/free agents**, not an own-roster action: the
  vision's own-view "NO action button" is binding and wins over the defense
  list's looser wording. Your defensive levers are Loyal seeds, mentor bonds,
  2.1.5 cohesion (fit), and stamping targets CPUs might recruit. If
  own-roster locking was intended, it needs a checkpoint decision (it would
  add a third attempt kind).
4. **Faction ordering** (lean followed + edges decided): within-party rank by
  living tick-start `factionCenter` ascending, faction-id tie-break, ±1 with
  edge ranks forced inward, computed once per tick; no-destination fizzles
  unrecorded (relocations empty-pool precedent, no re-route).
5. **Sign = flat 20%** (verified: both free-agent creation sites set
  `partyId: null`, so the party-match variant is impossible) with
  **distance-banded fit** (≤1 → ×1.5, ≥3 → ×0.5) — a NEW fit definition,
  since free agents have no current faction for the improvement comparison.
6. **Cross-party passive FF = +2** (lean followed), unified with the binding
  poach stacks via one `ffStacks {same: 1, cross: 2}` const; every success
  (passive and poach, same- and cross-party) also rewrites `p.partyId` from
  the destination faction — a defensive generalization of the binding
  cross-party rule.
7. **Passive loss cap = 2 per source faction per tick** (lean followed),
  passive-only — poaches are capped by the 5-attempt economy.
8. **Empty factions can recruit at fit ×1** — deviates from ideology-shifts'
  actor-center-null rejection; justified as the only way a wiped faction
  re-enters play. Wild-card/one-away pools still exclude them as
  destinations (lean confirmed: destinations need ≥1 living member).
9. **Failed attempts record the attempted destination**
  (`toFactionId =` actor's faction, relocations precedent) rather than
  `from === to` — chosen as least-confusing; documented because it diverges
  from the ideology-shifts failure shape.
10. **Entry party fields always populated** (`fromPartyId: PartyId | null`,
  `toPartyId: PartyId`) — simpler than cross-party-only and lets the feed
  render flips without faction lookups.
11. **Seed rates 8/8, free agents seeded** (leans followed); Loyal +4 PV
  positive, Opportunist −5 negative; Loyal excluded at the existing
  Ideologue career-pool filter site.
12. **Mentor-bond predicate** as defined (current-faction-anchored, both
  directions, living non-retired partner) — the vision delegated precision;
  this is also exactly what the own-view badge shows.
13. **CPU targeting by composed-odds desc** (vision lean) means CPUs prefer
  easy flips (Opportunists, bad-fit strays) over stars — PV only tie-breaks.
  If playtest wants star-hunting, switch the sort to odds × PV without a
  resolver change.
14. **Feed semantics**: visibility = `fromFactionId === viewed ||
  toFactionId === viewed` (actor is redundant — recruiters always recruit
  into their own faction); Free Agents pseudo-view = `fromFactionId === null`
  (every sign attempt, success and failure).
15. **One tick-summary log max, emitted only when the tick did something**
  (established pattern); the old per-switch 2.1.6 logs are deleted, not
  replaced.
