# Spec: Kingmakers & Protégés (Phase 2.1.7)

> Fourth activation of the 2.1.x placeholder-conversion arc (Relocations 2.1.4 →
> Ideology Shifts 2.1.5 → Faction Conversions 2.1.6 → this). Anything tagged
> **(established pattern)** is a structural clone of the conversions/ideology
> architecture — resting-window player phase, shared resolver, attempt model,
> subject stamp, persistent feed, odds-const legend, fifth auto-nav. The
> wordcount below is spent on what is NEW and genuinely different: a *lifecycle*
> (bond → graduate → free), a cross-phase mechanical payoff into 2.1.2, the
> trait-as-gate model, same-state candidacy, and the first generational arc.

## Vision (as given)
2.1.7 is a dead auto-only phase: it randomly assigns each non-player kingmaker a
protégé, hard-skips the player (zero agency), and the bond is mechanically inert
— `protegeId` is read only by `mentorBondAnchored` (0.5× poach-resistance, added
in 2.1.6 — KEEP), the runner's own skip check, and a read-only page that promises
"bonus skill gains" 2.1.2 never delivers. Lifecycle leaks (the bond is never
cleared on death/retire/defect; one prodigy can be claimed by several
kingmakers); `isKingmaker` is frozen-at-creation and threshold-inconsistent
(1772 command≥1 vs 1856/draft command≥4); the `'Kingmaker'` trait confers
nothing. Activate it: deliver the 2.1.2 payoff, gate eligibility on the
`'Kingmaker'` trait (granted at command≥4), bind candidacy to the kingmaker's own
state, add a dual-trigger graduation with a permanent legacy payoff, give the
player an interactive assign/reassign page, and make the lifecycle hygienic.

## Player experience
Each turn the game rests at the Kingmakers & Protégés window. Your high-Command
elders are Kingmakers; each can take ONE protégé from their **own state** and
mentor them — a bonded protégé develops faster on their career track (2.1.2),
turning a promising local into a future star. The bond is a multi-turn
commitment with a real finish line: when the protégé reaches the Senate or the
Presidency, or 20 years pass, they **graduate** — banking a permanent legacy boon
(and themselves becoming Kingmaker-eligible), the mentor frees up, and the feed
records the game's first generational hand-off. Meanwhile the existing 0.5×
poach-resistance means a bonded protégé is harder for rivals to flip.

## User story
As a faction-running player, I want to pair my Kingmakers with promising
same-state protégés during the Kingmakers & Protégés phase — accelerating their
career growth toward a graduation payoff while shielding them from poaching — so
that I deliberately groom the next generation of my faction's leaders instead of
watching mentorship happen invisibly to CPUs only.

## Verified engine facts (drive the design; architect must not re-derive)
- Current runner `runPhase_2_1_7_Kingmakers` (phaseRunners.ts:1114–1124): per
  politician, `if (!p.isKingmaker || p.protegeId) continue`; skips the player's
  faction; candidates = same-`factionId`, not self, `!c.protegeId`, `age < 45`,
  `pvCache > 20`; `pick()` one; sets `p.protegeId`; one `addLog` per pairing.
  **Delete wholesale** (per-pairing logs removed — established pattern; one
  conditional summary line replaces them). **No same-state filter today.**
- engine.ts:34 already dispatches `2.1.7` with `return {}` → the resting window
  exists; **zero engine.ts changes**. phases.ts has **no `shouldRunPhase` gate**
  for 2.1.7 and it is not in the first-turn skip list (phases.ts:111–119) → 2.1.7
  **runs the 1772 first turn**, on the inaugural class (established pattern,
  matches 2.1.5/2.1.6). **Zero phases.ts changes.**
- `mentorBondAnchored(snap, p)` (phaseRunners.ts:837–844, **exported**): true iff
  (a) `p.protegeId` points to a living, non-retired politician in `p`'s CURRENT
  faction, OR (b) some living, non-retired member of `p`'s current faction has
  `protegeId === p.id`. Used by `conversionOdds` (×0.5 mentorBond) and the
  Conversions own-view "Bonded" badge. **REUSE unchanged** — it is exactly the
  bond predicate this feature needs; a defected partner already stops anchoring.
- 2.1.2 `runPhase_2_1_2_CareerTracks` (phaseRunners.ts:343–403): Pass 1 = CPU
  track assignment; Pass 2 = accrual `careerTrackYears += 2` for tracked,
  factioned, living, non-retired, **non-office** politicians; at every
  `careerTrackYears % 4 === 0` (≤ `CAREER_TRACK_MAX_YEARS = 20`) calls
  `rollThreshold`. **`protegeId` is never read here today** — this is the missing
  link. Office pauses accrual (and thus all gains).
- `rollThreshold(snap, p, thresholdYears)` (phaseRunners.ts:283–329), N =
  thresholdYears/4: three independent rolls — **skill** `chance(CAREER_ODDS.skill
  = 0.5)` then +1 to a track skill below the 0–5 cap; **themed trait**
  `chance(CAREER_ODDS.themedByThreshold[n-1])` (0.15/0.3/0.45/0.6/0.75); **random
  off-track trait** `chance(CAREER_ODDS.random = 0.12)`, 75/25 pos/neg. Each gain
  is recorded via `recordCareerGain` (capped `CAREER_GAINS_CAP = 200`). Caps:
  `CAREER_TRACK_CAP = 5` per faction per track; skills clamp 0–5; themed-trait
  pool already filters held traits (no dupes).
- `'Kingmaker'` is a **Backroom track-themed trait**:
  `TRACK_THEMED_TRAITS.Backroom = ['Manipulative', 'Kingmaker', 'Numberfudger']`
  (types.ts:176) — so Backroom-track politicians can already gain it organically
  via the themed-trait roll. It is NOT in POSITIVE_TRAITS/NEGATIVE_TRAITS today
  (PV-neutral) — see assumption #9.
- `command: number` is a **top-level 0–5 stat**, NOT one of the six career skills
  (types.ts:300); it is not in `SKILLS`, not in `TRACK_SKILL`, so 2.1.2 never
  grows it. `pv.ts`: `isKingmaker` → +6 PV (pv.ts:75); `command * 10` PV
  (pv.ts:70). No cap is enforced on `command` in pv.ts (it just multiplies), but
  every data source clamps to ≤5 (assumption #2).
- `isKingmaker` set at five sites, threshold-inconsistent:
  politicians1772.ts:100 `command >= 1`; politicians1856.ts:134 `command >= 4`;
  draftImport.ts:255 / draftScoutingHelpers.ts:22 `command >= 4`;
  rookie-gen phaseRunners.ts:202 `false`. **This is the inconsistency the
  trait-gate fixes.**
- Office detection for graduation: `p.currentOffice?.type === 'Senator'` and
  `=== 'President'` (OfficeType union, types.ts:246–267). Senator/President are
  the only two graduation offices (binding vision). `SenateProTem` is a Senator
  who became pro-tem — see edge cases.
- Death/retirement happen at **2.4.1** (`runPhase_2_4_1_Deaths`,
  phaseRunners.ts:1280) — sets `deathYear`/`retiredYear`, calls `vacateOffice`.
  Defection happens at **2.1.6** (passive + poach, rewrites `factionId`). All
  three run on the SAME turn that 2.1.7 runs, in order:
  2.1.2 → 2.1.6 → **2.1.7** → … → 2.4.1. So a same-turn defect happens BEFORE
  2.1.7, but a same-turn death/retire happens AFTER. **This is the ordering crux
  — see the lifecycle section and assumption #1.**
- Page/registry already exist read-only: `'kingmakers'` PageId
  (registry.ts:38,69), Sidebar "Kingmakers & Protégés" already last in the 2.1.x
  block (Sidebar.tsx:38, after "Faction Conversions"), `Kingmakers.tsx` is the
  read-only page to REPLACE. **No PageId/Sidebar additions needed** — only the
  page body, the auto-nav effect, and the GameContext method are new.
- GameContext delegation clones: `attemptConversion` (GameContext.tsx:356–364)
  is the exact template for the new mutation method (deep clone → engine call →
  return silently on `false` → setSnapshot + persist on `true`).
- App.tsx has FOUR auto-nav refs (careers/relocations/ideology/conversions,
  lines 40–97). This adds the **FIFTH**. New GameState fields go after
  `conversionAttempts` (types.ts:594); new Politician fields after
  `lastConversionAttemptYear` (types.ts:287); new consts after
  `CONVERSIONS_CAP` (types.ts:244).

## Mechanics (decided values)

### The trait gate — `'Kingmaker'` becomes the single source of eligibility (binding)
- **`isKingmaker` is DERIVED, not stored** (decided — resolves "derive or remove"
  in favour of removing the stored field): delete the `isKingmaker: boolean`
  field from `Politician`, delete all five seed/derivation sites
  (politicians1772.ts:100, politicians1856.ts:134, draftImport.ts:255,
  draftScoutingHelpers.ts:22, the rookie-gen `false`), and replace every read
  with `p.traits.includes('Kingmaker')`. **pv.ts:75 changes** to
  `if (p.traits.includes('Kingmaker')) total += 6` (a permitted PV touch — the
  +6 is preserved exactly, just sourced from the trait). This is the cleanest fix
  for the 1772/1856 inconsistency: the trait already carries +6 PV intent, and it
  is already grantable via the Backroom themed-trait roll. *(Architect may instead
  keep `isKingmaker` as a synced boolean if removing the field touches too many
  read sites — but the trait is the source of truth either way; flagged as
  assumption #9.)*
- **Era-aware command gate (binding — checkpoint-1 decision):** the command
  threshold is **1 in the 1772 era, 4 in the 1856 era** (and any future era).
  This restores founding-era mentorship (the 7 marquee figures: S. Adams,
  Jefferson, Henry, Hancock, Washington, J. Adams, Franklin all qualify at
  command 1) while keeping 1856 selective. Architect picks the detection
  mechanism (year-bracket `year < 1800` vs scenario metadata); express in
  `KINGMAKER_RULES.commandGateByEra` or equivalent. **Single source for both
  the trait-grant pass and the draft top-up.**
- **Trait-grant pass (binding), runs FIRST in the 2.1.7 tick** (confirmed
  ordering — a newly-minted Kingmaker can take a protégé the SAME tick): for each
  living, non-retired politician with `command >= eraCommandGate(year)` lacking
  the `'Kingmaker'` trait, push `'Kingmaker'`. This grants the trait to seeded
  elders (replacing the dropped 1772/1856 seed logic) AND to anyone trained up
  to the era's command threshold mid-game via era systems. One feed entry per
  grant (kind `'anointed'` — see feed shape). The pass touches PV (the trait
  carries +6), covered by the single tick-end `refreshPv`.
- **Draft-year per-faction top-up (binding — checkpoint-1 decision).** At each
  draft year (every 4 years, when 2.1.1 runs), AFTER the draft phase has assigned
  rookies to factions: for each faction, count living, non-retired politicians
  in that faction with the `'Kingmaker'` trait. If the count is below
  `KINGMAKER_RULES.factionFloor = 10`, randomly grant `'Kingmaker'` to non-trait
  members of that faction drawn from the **upper PV band** (weighted random
  across the top half / top quartile by PV — NOT always the absolute highest;
  architect picks the exact distribution to deliver "higher value PV but not
  deterministic") until the faction's count reaches 10. Each grant emits an
  `'anointed'` feed entry, reason `'draft-floor'`. The top-up runs in
  2.1.1 (draft) — a small new touchpoint, the only place outside 2.1.7 the
  trait is granted. Rationale: guarantees a mentorship bench in every era and
  every faction even when natural command growth lags; thematically consistent
  with the user's interpretation ("in any draft, if there is fewer than 10…").
  **Interpretation note:** "in a faction or in the draft" is implemented as
  per-faction (the faction's roster includes the new draftees by the time
  this runs); if the user wanted "10 in the draft pool itself," tweak to
  count `draftedYear === game.year` only — flagged as assumption #11.
- The first 2.1.7 tick on a 1772 turn-1 game (no draft yet) sees the era-1
  gate grant `'Kingmaker'` to the 7 command-1 founders immediately; the draft
  top-up then maintains the floor as factions grow.

### Same-state candidacy (binding — candidacy filter only)
A Kingmaker may only **take** a protégé from their OWN `state`. Once bonded, the
bond **persists** if the protégé later relocates out of state (2.1.4) — same-state
is checked only at assignment, never re-validated. Bonds break ONLY on
death/retirement/defection (lifecycle section). In 1772 some Kingmakers will have
no same-state eligible candidate; the slot stays empty (accepted thematic cost).

### Candidacy gate (revised — explicit numbers, binding)
A politician `c` is an **eligible candidate** for Kingmaker `k` iff ALL hold
(reconciles the vision's "young, pre-Senate, PV threshold" with today's age<45 /
pv>20):
1. `c.id !== k.id`;
2. `c.factionId === k.factionId` (same faction — **binding**, the mentor grooms
   for their own faction) AND `c.factionId !== null`;
3. `c.state === k.state` (same state — binding);
4. `c` is alive, non-retired;
5. `c` has **no mentor already** — no living, non-retired politician currently has
   `protegeId === c.id` (one-protégé-per-prodigy, enforced at candidacy AND in the
   resolver — lifecycle hygiene);
6. `c` is **not itself a Kingmaker** (decided — a Kingmaker mentors, is not
   mentored; `!c.traits.includes('Kingmaker')`);
7. **young**: `c.age < PROTEGE_MAX_AGE` (= 45, carried forward from today);
8. **pre-Senate**: `c.currentOffice` is null OR its `type` is a **sub-Senate
   office** — eligible offices are `Representative` and `Governor` only;
   **disqualifying** = `Senator`, `President`, and every higher/federal office
   (VicePresident, Cabinet, Justices, Speaker, SenateProTem, etc.). Precisely:
   eligible iff `!c.currentOffice || c.currentOffice.type === 'Representative' ||
   c.currentOffice.type === 'Governor'` (assumption #4);
9. **PV threshold**: `c.pvCache >= PROTEGE_MIN_PV` (= 20 — carried forward, but as
   `>=` for legend clarity; today's runner used `> 20`, a 1-PV cosmetic change,
   assumption #5).

A Kingmaker is **available to assign** iff alive, non-retired, has the
`'Kingmaker'` trait, and `protegeId` is null/cleared (one protégé per Kingmaker).

### The 2.1.2 payoff — accelerated career development (binding; the cross-phase link)
At 2.1.2 Pass 2, a politician `p` is a **bonded protégé** iff
`mentorBondAnchored(snap, p)` is true **via the prodigy direction** — i.e. some
living, non-retired member of `p`'s current faction has `protegeId === p.id`
(NOT the reverse direction; a Kingmaker who happens to be someone's protégé is
not accelerated for being a mentor). Architect should use a tiny dedicated
predicate `hasMentor(snap, p)` rather than `mentorBondAnchored` to avoid the
mentor-direction false positive — see assumption #6.

**Acceleration mechanism (decided — recommended option):** when a bonded protégé
hits a threshold and would call `rollThreshold`, **the skill roll fires twice**
instead of once — i.e. run the `CAREER_ODDS.skill` (0.5) skill-gain block a
second time (a second independent 50% roll for one more +1 to a below-cap track
skill). The themed-trait and random-trait rolls are unchanged.
- **In CAREER_ODDS terms:** a normal threshold gives ~0.5 expected skill points;
  a bonded threshold gives ~1.0 expected (two independent 50% draws), with both
  draws clamped at the 0–5 skill cap and skipped when the chosen skill is already
  capped (exactly the existing block's behavior, so `CAREER_TRACK_CAP` and the
  skill cap are respected for free — the second roll cannot exceed any ceiling).
  No effect on `CAREER_GAINS_CAP` beyond one extra possible 200-cap FIFO entry.
- **Why this magnitude:** doubling only the *skill* roll is noticeable
  (mentored protégés visibly out-develop their peers over a few thresholds) but
  not dominant (no extra traits, no bypass of caps, accrual still pauses in
  office). It is expressed in the exact term `CAREER_ODDS` uses, needs no new
  const, and is structurally cap-safe. *(Alternative considered and rejected: a
  `+0.2` additive bump to each of the three probabilities — fiddlier, harder to
  explain in the legend, and would need clamping. A flat "extra full threshold
  roll" was rejected as too strong: it would also double trait acquisition.)*
- The doubled skill roll is gated on the bond being live **at 2.1.2 time** (mentor
  alive, non-retired, same faction as the protégé). See the ordering risk below.

### Graduation (binding — dual trigger, checked each year at 2.1.7)
A bond **graduates** (completes) when EITHER:
- `snap.game.year - p.bondedYear >= GRADUATION_YEARS` (= 20), OR
- the protégé currently holds office `Senator` or `President`
  (`c.currentOffice?.type === 'Senator' || === 'President'`).

Checked in the 2.1.7 tick (after the trait-grant pass, before/with the
assignment passes — see tick order). On graduation, for the protégé `c`,
**roll a weighted random legacy** (binding — checkpoint-1 decision):

- **Outcome roll** (single `rand()` partitioned across three branches via
  `KINGMAKER_RULES.graduationOdds = { command: 0.45, trait: 0.45, both: 0.10 }`):
  - `r < 0.45` → **command branch**: `c.command = Math.min(5, c.command + 1)`.
    At the cap (command already 5), the branch is a clean no-op — sometimes the
    bond completes with no command room to grow, which is fine (the protégé
    arrived without a stat bump; the bond itself was the reward).
  - `0.45 <= r < 0.90` → **trait branch**: inherit one previously-unheld trait
    from the mentor's `traits` that is in `POSITIVE_TRAITS` (random pick via
    `rng.ts`). If the mentor has no unheld positive trait the protégé doesn't
    already hold, the branch is a no-op.
  - `r >= 0.90` → **both branch**: apply BOTH the command +1 (capped 5) AND
    the unheld-positive-trait inheritance. This is the "slight chance for
    both" the user asked for — the biggest possible legacy, ~10% per
    graduation.
- **Why this shape:** matches the user's directive ("random command or trait
  gain, slight chance for both"); every branch is cap-respecting and never
  exceeds command 5; legacy is legible in the roster (a +1 command or a new
  positive trait both show in standard PV displays); the 10% "both" branch is
  the satisfying centerpiece players will recognize and remember. Tunable in
  `KINGMAKER_RULES.graduationOdds`.
- **Generational loop preserved:** the command branch (and the both branch)
  still feeds the eventual Kingmaker-trait-grant pass — a graduate who reaches
  command 4 (1856) / command 1 (1772) and survives later trait grants becomes
  the next generation's mentor.
- The graduation touches PV (command and possibly a trait) → covered by the
  tick `refreshPv`.

On graduation, for the mentor `k` (the politician whose `protegeId === c.id`):
- **Mentor reward (decided — recommended: one-time +PV legacy bump):** set
  `k.flipFlopperPenalty` unchanged; instead grant a **one-time PV bump** modeled
  as a permanent positive: the cleanest mechanic with no new PV field is to grant
  the mentor a previously-unheld `'Leadership'` trait (already in POSITIVE_TRAITS,
  +4 PV) **only if** they lack it — a tidy "mentored a leader into office" legacy.
  If they already hold `'Leadership'`, the reward is the satisfaction (no double
  grant; one-per-graduation). *(Rationale: a literal stored "+N PV" needs a new
  field; reusing the trait system keeps pv.ts edits to zero and is legible in the
  roster. Flagged as assumption #7 — if playtest wants a bigger mentor reward,
  this is the const/trait to change.)*
- Clear the bond: `k.protegeId = null`; `c.bondedYear` cleared. The mentor is now
  available to take a new protégé (possibly the same tick, in a later assignment
  pass — array order). Feed entry kind `'graduated'`.

### Lifecycle hygiene (binding — the leak fixes)
A bond is `{ mentor.protegeId === protege.id, mentor.bondedYear (on the
PROTEGE) }`. The bond must break, clearing `mentor.protegeId = null` and
`protege.bondedYear = undefined`, the moment EITHER party:
- **dies or retires** (2.4.1, AFTER 2.1.7 this turn), or
- **defects** to a different faction (2.1.6, BEFORE 2.1.7 this turn).

**Where cleanup runs (decided — at the head of the 2.1.7 tick, plus the
mentorBond predicate already self-heals reads):**
- The **2.1.7 tick runs a lifecycle-sweep pass** (after trait-grant, before
  graduation/assignment): for every politician `k` with a non-null `protegeId`,
  resolve the protégé `c`; **break the bond** (clear `k.protegeId`, clear
  `c.bondedYear`) and emit a `'dissolved'` feed entry if ANY of: `c` not found;
  `k` dead/retired; `c` dead/retired; `c.factionId !== k.factionId` (defection of
  either side moves one out of the shared faction). This catches last-turn deaths
  (2.4.1 fired after the previous 2.1.7) and this-turn defections (2.1.6 fired
  before this 2.1.7).
- **The honest-read guarantee for 2.1.2 (ordering crux — see assumption #1):**
  2.1.2 runs BEFORE 2.1.6 and 2.4.1 each turn, and the lifecycle sweep is in
  2.1.7 (later still). So at 2.1.2 time, a bond stamped last turn may have a
  partner who died at *last* turn's 2.4.1 but has not yet been swept (the sweep is
  next turn's 2.1.7). **The acceleration read MUST therefore be live, not trust
  the stored `protegeId`:** `hasMentor(snap, p)` already requires the mentor be
  living, non-retired, AND same-faction — so a dead/retired/defected mentor does
  NOT accelerate even if their stale `protegeId` still points at `p`. This is why
  the payoff predicate is the live `mentorBondAnchored`-style check, not a raw
  `protegeId` lookup. The 2.1.7 sweep then tidies the stale pointer for the feed
  and for reassignment. **The architect must keep the 2.1.2 read live; the sweep
  is cleanup, not correctness, for the payoff.** (Flagged as the #1 risk.)
- **One-protégé-per-prodigy** is enforced at candidacy (gate #5) AND defensively
  in the resolver (re-check no other living mentor claims `c` at assign time) —
  closes the "claimed by multiple kingmakers" leak.

### Assignment model (decided — free intra-faction, one protégé per Kingmaker)
- **No shared attempt cap** (deviation from the 2.1.4/2.1.5/2.1.6 5-attempts
  model — decided): mentorship is non-adversarial and intra-faction, so there is
  no scarce contested budget. Instead the natural cap is **one protégé per
  Kingmaker** (a Kingmaker with a live bond cannot assign another) and **one
  mentor per protégé**. There is therefore **no `kingmakerAttempts` counter and no
  per-turn attempt badge** — the page shows each Kingmaker's slot (filled/empty)
  instead.
- **Reassignment (decided, no cost/lock):** the player may **release** a
  Kingmaker's current protégé (button on a filled slot) — clears `k.protegeId` and
  the protégé's `bondedYear`, emits a `'dissolved'` (reason `'released'`) feed
  entry, **no penalty**, and frees both for re-pairing. The player may then
  **assign** a new eligible candidate; this stamps a fresh `c.bondedYear =
  snap.game.year` (the 20-year clock restarts). Direct "reassign" = release +
  assign in one confirm card. Churn is self-limiting because reassigning resets
  the graduation clock and forfeits accumulated bond time — no artificial lock
  needed (assumption #8).
- **Phase lock (established pattern):** assign/release valid only while resting at
  `phaseId === '2.1.7'`; the page is always viewable. Engine-enforced in the
  resolver; UI disables with a tooltip outside the window.
- **Player path (established pattern):** two exported pure mutators —
  `assignProtege(snap, kingmakerId, protegeId): boolean` and
  `releaseProtege(snap, kingmakerId): boolean` — each validates phase, the
  Kingmaker (alive/non-retired/has trait/player faction), and (for assign) the
  full candidacy gate + the empty-slot + one-mentor-per-prodigy invariants;
  returns `false` (rejected, nothing changed) or `true` (applied). On assign:
  `k.protegeId = protegeId`, `c.bondedYear = snap.game.year`, append `'bonded'`
  feed entry. On release: clear + `'dissolved'`/`'released'` entry. Each refreshes
  PV only if it changed a PV input (assign/release of a plain bond does not move
  PV — the +6 Kingmaker PV is on the mentor regardless; so `refreshPv` is
  unnecessary on these paths — established lesson). GameContext gains
  `assignProtege` / `releaseProtege` delegating like `attemptConversion` (deep
  clone → engine call → persist only on `true`).

### CPU policy (decided — auto-assign, now same-state-gated and lifecycle-clean)
Runs in the 2.1.7 tick, CPU factions' Kingmakers in `snap.politicians` array
order (the existing behavior, corrected):
- For each living, non-retired CPU-faction Kingmaker with an **empty slot**,
  build the eligible-candidate list (the full candidacy gate above, including
  **same-state**), and if non-empty `pick()` one, set `protegeId`, stamp the
  protégé's `bondedYear = year`, emit a `'bonded'` (CPU) feed entry.
- CPUs never release/reassign live bonds (only graduation/lifecycle frees them) —
  keeps CPU behavior simple and non-churny. No gate roll needed (assignment is
  free and always beneficial); the same-state + slot constraints already bound it.
- The player's faction is **skipped** by the CPU pass (the player assigns
  manually) — but the player's Kingmakers ARE swept for lifecycle and graduated
  by the shared passes (only the *auto-assign* is player-skipped).

### Tick order (established pattern, kingmakers content)
`runPhase_2_1_7_Kingmakers(snap)` rewritten — exact order:
1. eager `snap.game.kingmakers ??= []` (the feed array);
2. **trait-grant pass** (command≥4 → grant `'Kingmaker'`, feed `'anointed'`) —
   FIRST, so new Kingmakers can assign this tick;
3. **lifecycle-sweep pass** (break dead/retired/defected/cross-faction bonds,
   feed `'dissolved'`);
4. **graduation pass** (dual trigger; apply protégé legacy + mentor reward; clear
   bond; feed `'graduated'`);
5. **CPU auto-assign pass** (CPU factions only, same-state-gated, feed `'bonded'`);
6. one unconditional `refreshPv` (trait grants + command/trait graduation payoffs
   move PV; bonds themselves do not);
7. at most ONE summary `addLog` line, emitted only when the tick produced ≥1
   event, e.g. `Mentorship: N anointed; M bonds formed; K graduated.`. No other
   logs anywhere in 2.1.7 code (established pattern — the per-pairing logs are
   deleted, not replaced).
All passes iterate in array order; all randomness via `rng.ts` (`pick`).

### State shape
- `Politician.bondedYear?: number` (the year the CURRENT bond on this protégé was
  formed; lives on the **protégé**, drives the 20-year graduation clock).
  `protegeId?: string | null` already exists (kept). All optional; legacy saves
  load unchanged.
- **`isKingmaker` removed** from `Politician` (trait-derived) — see the trait gate
  + assumption #9 for the keep-as-synced-boolean fallback.
- `GameState.kingmakers?: KingmakerEntry[]` (FIFO `KINGMAKERS_CAP = 200`), placed
  after `conversionAttempts` (types.ts:594). **No attempt counter** (free
  assignment model).
- `KingmakerEntry` (decided): `{ year: number; kind: 'anointed' | 'bonded' |
  'graduated' | 'dissolved'; politicianId: string; mentorId?: string; protegeId?:
  string; factionId: string; reason?: 'death' | 'retire' | 'defect' | 'released';
  trigger?: 'tenure' | 'office'; actor?: 'player' | 'cpu' }`. `'anointed'` carries
  `politicianId` = the newly-trait-granted politician, no mentor/protege.
  `'bonded'` carries `mentorId` + `protegeId` + `actor`. `'graduated'` carries
  `mentorId` + `protegeId` + `trigger`. `'dissolved'` carries `mentorId` +
  `protegeId` + `reason`.
- types.ts consts (single source for engine AND legend, after `CONVERSIONS_CAP`):
  `KINGMAKER_RULES = { commandGateByEra: { '1772': 1, '1856': 4 },
  factionFloor: 10, protegeMaxAge: 45, protegeMinPv: 20, graduationYears: 20,
  eligibleProtegeOffices: ['Representative', 'Governor'],
  graduationOffices: ['Senator', 'President'], accelSkillRolls: 2,
  graduationOdds: { command: 0.45, trait: 0.45, both: 0.10 },
  poachResistance: 0.5 }`. (Architect may key `commandGateByEra` by scenario id
  or by year-bracket — either is acceptable as long as the rule is "1772-era = 1,
  1856-era = 4". The `poachResistance` 0.5 mirrors
  `CONVERSION_ODDS.willingness.mentorBond` and is surfaced in the legend; the
  resolver still reads the conversions const — this entry is for the legend
  text only, or the architect may reference `CONVERSION_ODDS` directly.)
  `KINGMAKERS_CAP = 200`. Zero hardcoded numbers in JSX.

### Save migration (decided)
- All new fields optional; legacy saves load. **No repair() changes** (established
  pattern).
- **`bondedYear` backfill for existing bonds (decided — recommended):** existing
  saves have `protegeId` bonds with no `bondedYear`. On the FIRST 2.1.7 tick after
  load, any live bond whose protégé lacks `bondedYear` gets `bondedYear =
  snap.game.year` (treat as bonded "this year" → the 20-year clock starts now).
  This is the least-surprising: it never instantly graduates a legacy bond on
  tenure (a backfill-from-`game.year - 20` could fire surprise graduations the
  first tick), and an office-based graduation still fires correctly if the protégé
  is already a Senator/President. The backfill is implicit (the graduation pass
  treats `bondedYear === undefined` as "this year") — no separate migration step.
- **`isKingmaker` → trait migration:** since 1856/draft set `isKingmaker` at
  command≥4 which equals the new gate, and 1772 set it at command≥1, the trait
  grant pass (command≥4) re-derives the correct set on the first tick regardless
  of the dropped boolean. Legacy saves where someone had `isKingmaker:true` at
  command<4 (only possible from a 1772 save) simply lose Kingmaker status unless
  they also hold the `'Kingmaker'` themed trait — an accepted, deliberate
  correction of the old inconsistency (assumption #2).

## Acceptance criteria

### State & types (src/types.ts)
- [ ] 1. `Politician` gains `bondedYear?: number` (optional); `protegeId` kept.
  `isKingmaker: boolean` is **removed** (or, fallback, kept as a trait-synced
  boolean — assumption #9); legacy saves load unchanged; no repair() changes.
- [ ] 2. `GameState` gains `kingmakers?: KingmakerEntry[]` after
  `conversionAttempts`; new `KingmakerEntry` exactly as shaped above. **No**
  `kingmakerAttempts` field (free-assignment model).
- [ ] 3. New `KINGMAKER_RULES` and `KINGMAKERS_CAP` consts with the values above,
  after `CONVERSIONS_CAP`; zero hardcoded numbers in the page JSX.

### PV & eligibility derivation
- [ ] 4. Every `isKingmaker` read becomes `p.traits.includes('Kingmaker')`:
  pv.ts:75 (+6 PV preserved, sourced from the trait), Kingmakers.tsx,
  draftScoutingHelpers.ts. The five seed/derivation sites are deleted. The +6 PV
  for a Kingmaker is unchanged in magnitude.

### Engine (src/engine/phaseRunners.ts — replace 1114–1124 wholesale)
- [ ] 5. Exported pure candidacy helper, e.g.
  `protegeCandidates(snap, kingmakerId): Politician[]` returning the eligible
  list (gate #1–#9 incl. same-state, same-faction, unmentored, non-Kingmaker,
  age<45, sub-Senate office, PV≥20) — used by the resolver, the CPU pass, AND the
  page (preview === rule). A tiny `hasMentor(snap, p): boolean` (prodigy-direction
  only) used by 2.1.2. `mentorBondAnchored` REUSED unchanged.
- [ ] 6. `assignProtege(snap, kingmakerId, protegeId): boolean` and
  `releaseProtege(snap, kingmakerId): boolean` — phase `'2.1.7'`-locked;
  validate Kingmaker (alive, non-retired, has trait, slot empty for assign) and
  full candidacy + one-mentor invariant for assign; apply mutation + feed entry;
  return false on rejection (nothing changed). No addLog, no unnecessary
  refreshPv inside.
- [ ] 7. **2.1.2 acceleration:** `runPhase_2_1_2_CareerTracks` Pass 2 runs the
  skill-gain block of `rollThreshold` **twice** for a politician where
  `hasMentor(snap, p)` is true (mentor live, non-retired, same faction), once
  otherwise. Both skill draws respect the 0–5 skill cap and `CAREER_TRACK_CAP`;
  themed/random rolls unchanged; the second gain (if any) is recorded via
  `recordCareerGain`. The read is **live** (a dead/retired/defected mentor never
  accelerates), independent of any stale `protegeId`.
- [ ] 8. Rewritten 2.1.7 tick runs exactly, in order: eager `kingmakers ??= []`
  → trait-grant pass (`command >= eraCommandGate(year)` grants `'Kingmaker'` +
  `'anointed'` feed) → lifecycle-sweep (break dead/retired/cross-faction bonds
  + `'dissolved'`/reason) → graduation pass (dual trigger; protégé legacy
  payoff; mentor reward; clear bond; `'graduated'`/trigger) → CPU auto-assign
  (CPU factions, same-state-gated, `'bonded'`/cpu) → one `refreshPv` → ≤1
  conditional summary log. Player faction skipped by CPU auto-assign only.
- [ ] 8b. **Draft top-up pass** runs at 2.1.1 (after the existing draft
  assignment logic completes): for each faction with living-Kingmaker count
  below `KINGMAKER_RULES.factionFloor = 10`, randomly grant `'Kingmaker'` to
  upper-PV-band members (weighted random over the top half by PV, NOT strictly
  highest) until the count reaches 10. Each grant emits an `'anointed'` feed
  entry with `reason: 'draft-floor'`. Skipped if the faction has fewer than
  10 living members total (just grant to all). Touches PV (+6 each) → covered
  by the existing 2.1.1 refresh path or a refreshPv call at the end of the
  top-up.
- [ ] 9. **Graduation:** fires when `year - (bondedYear ?? year) >= 20` OR
  protégé holds `Senator`/`President`. Protégé legacy is a single weighted
  `rand()` per graduation across the 0.45 / 0.45 / 0.10 split (command / trait
  / both) per `KINGMAKER_RULES.graduationOdds`: command branch = +1 capped 5;
  trait branch = inherit one unheld positive mentor trait (pick via `rng.ts`);
  both branch = apply both; any branch is a clean no-op if its mutation can't
  apply (cap / no inheritable traits). Mentor reward = grant unheld
  `'Leadership'` (or nothing). Bond cleared.
- [ ] 10. **Lifecycle sweep** breaks a bond when the protégé is missing, either
  party is dead/retired, or `protege.factionId !== mentor.factionId`; clears
  `mentor.protegeId` and `protege.bondedYear`; `'dissolved'` feed entry with the
  correct `reason` (death/retire/defect). One-mentor-per-prodigy re-checked in the
  assign resolver.
- [ ] 11. `engine.ts`, `phases.ts`: **no changes** (2.1.7 already dispatches with
  `return {}`, has no gate, runs the 1772 first turn). pv.ts changes ONLY the
  `isKingmaker` → trait read (criterion 4).

### Player agency & locking (established pattern)
- [ ] 12. Assign/Release valid only while resting at `phaseId === '2.1.7'`
  (engine-enforced; page always viewable). Disabled-tooltip precedence on the
  Assign/Release buttons: phase lock ("Mentorship opens during the Kingmakers &
  Protégés phase") → slot-full on Assign ("This Kingmaker already has a protégé")
  → no eligible candidates ("No eligible same-state protégés"). Release is
  disabled only by phase lock and empty slot.
- [ ] 13. Click resolves immediately; result visible same render (slot fills/empties,
  feed entry appears); assignments survive mid-window save/load.

### Auto-navigation (src/App.tsx)
- [ ] 14. FIFTH ref-keyed effect: resting at `'2.1.7'`, key `` `${year}:2.1.7` ``,
  navigate to `'kingmakers'` once per entry; ref resets on any other phase
  (established pattern). The now-SIX-hop draft-turn rhythm (draft → careers →
  relocations → ideology → conversions → kingmakers) is a known playtest
  watch-item (fourth escalation).

### Kingmakers & Protégés page (replace src/pages/Kingmakers.tsx)
- [ ] 15. Header mirrors Conversions: title "Kingmakers & Protégés"; functional
  faction dropdown (player first, "(you)" suffix); `PartyBadge` of the viewed
  faction; a small status badge (e.g. "Kingmakers: X · Bonded: Y" for the viewed
  faction) — **no attempts badge** (no cap).
- [ ] 16. **Own view (player faction) — interactive:** a card or row per Kingmaker
  (`traits.includes('Kingmaker')`, alive, non-retired): name, Cmd, current protégé
  (name/state/office or "— None —"), graduation progress (years toward 20 and/or
  "office track"), and an **Assign** button (empty slot) opening a confirm card
  that lists the eligible same-state candidates (from `protegeCandidates`) with
  Name/St/Age/PV/Office, plus a **Release** button on filled slots. Confirm card
  (established pattern, one open at a time): the chosen candidate, the bond effect
  summary ("accelerated career growth; 0.5× poach resistance; graduates at Senate
  or 20 yrs"), Assign / Cancel. Empty state: "No Kingmakers in your faction —
  build a politician to Command 4."
- [ ] 17. **Rival view (read-only):** the rival faction's Kingmakers and their
  current protégés (name/state), no action buttons (read-only rival view per the
  page pattern) — surfaces who rivals are grooming.
- [ ] 18. **Feed** (established pattern): `(game.kingmakers ?? [])` filtered to
  entries where `factionId === viewedFaction`, `slice(-20).reverse()`: year, kind
  badge (Anointed / Bonded / Graduated / Dissolved), mentor → protégé names where
  applicable, trigger/reason sub-badge (Senate / Tenure / Death / Retire / Defect
  / Released), CPU/You tag. Empty: "No mentorships yet."
- [ ] 19. **Legend** `<details>` rendered entirely from `KINGMAKER_RULES` (zero
  literals in JSX): the command-4 anointing gate; same-state, same-faction,
  age<45, sub-Senate, PV≥20 candidacy; the 2.1.2 acceleration (doubled skill
  roll, cap-respecting); the dual graduation trigger + the +1-command legacy and
  mentor reward; the lifecycle break rules; and the 0.5× poach resistance
  (cross-referenced to Faction Conversions).
- [ ] 20. The "bonus skill gains" promise is now TRUE: the page's bond description
  reflects the real 2.1.2 mechanic; surface the 0.5× poach-resistance explicitly.

### Definition of done (per CLAUDE.md)
- [ ] 21. `npm run build` passes.
- [ ] 22. Playtested in **1856**: reach 2.1.7 (sixth auto-nav fires); own view
  lists command-4 Kingmakers (anointed on the first tick); assign a same-state
  protégé via the confirm card (slot fills, `'bonded'` feed entry, "Bonded" badge
  shows on that protégé in the Conversions own-view too); release and re-assign
  (clock resets); verify a non-same-state candidate is absent from the list and a
  Senator/President/Kingmaker candidate is excluded; Advance several turns and
  confirm the bonded protégé out-develops a comparable unbonded peer on the Career
  Tracks gains feed (more skill points over thresholds); drive a protégé to the
  Senate (election) and verify a `'graduated'` entry with +1 command and the
  mentor's `'Leadership'` reward, the bond clearing, and the mentor free to
  re-pair; kill a mentor (age) and verify the bond dissolves with reason Death the
  next 2.1.7; have a rival poach a bonded protégé at 2.1.6 and verify the bond is
  gone by 2.1.7 (defect) and that the protégé's acceleration stopped at the
  intervening 2.1.2. Reload mid-window (slots/feed intact). **1772 smoke:** turn 1
  reaches 2.1.7; with command-1 seeds NOBODY is anointed initially (deliberate);
  no crash; the Free-Agents/own views render; a politician trained to command 4
  later gets anointed and can mentor.

## Edge cases
- **1772 inaugural class:** seeded at command 1 → zero Kingmakers under the
  command-4 gate at first; the phase rests, the page shows "No Kingmakers" until
  someone reaches command 4 (era systems) or gains the `'Kingmaker'` themed trait
  (Backroom track). Deliberate (assumption #2).
- **No eligible same-state candidate:** Kingmaker's slot stays empty (accepted
  thematic cost — small states / lopsided rosters). Assign button disabled with
  the "No eligible same-state protégés" tooltip.
- **Protégé relocates out of state (2.1.4) after bonding:** bond PERSISTS
  (same-state is candidacy-only). The 2.1.2 acceleration continues.
- **Protégé defects (2.1.6, same turn before 2.1.7):** `factionId` no longer
  matches the mentor → the lifecycle sweep at 2.1.7 dissolves the bond (reason
  defect). At the *intervening* 2.1.2 (which ran before 2.1.6 this turn) the bond
  was still intact and DID accelerate — acceptable; next turn it is gone.
- **Mentor defects:** symmetric — `factionId` mismatch dissolves the bond; the
  ex-mentor can be anointed/re-pair in their new faction.
- **Mentor or protégé dies/retires (2.4.1, after this turn's 2.1.7):** swept at
  NEXT turn's 2.1.7 (reason death/retire). Crucially, the 2.1.2 acceleration read
  is live (`hasMentor` requires a living, non-retired, same-faction mentor), so a
  protégé whose mentor died last turn is NOT accelerated this turn even before the
  sweep tidies the pointer — the ordering risk is handled by the live read
  (assumption #1).
- **Protégé reaches command 5 before graduating, then graduates:** the +1-command
  legacy is a no-op at the cap → falls back to inheriting one unheld POSITIVE
  mentor trait (or nothing). Never exceeds command 5.
- **Protégé becomes a Kingmaker via the Backroom themed trait while bonded:**
  they keep their mentor (gate #6 is a *candidacy* filter, checked at assign,
  not re-validated) but can also take their OWN protégé once they have the trait
  and an empty slot — a Kingmaker mentored by another Kingmaker is allowed
  post-hoc. `hasMentor` (prodigy direction) still accelerates them; the
  mentor-direction is not double-counted (assumption #6).
- **Protégé elected Senator the same turn they were bonded:** office-trigger
  graduation fires at the next 2.1.7 (or same tick if bonded earlier in the tick
  order than the office grant — but offices are granted in 2.2/2.9, later phases,
  so it is always the *next* turn). The 20-year clock and the office trigger are
  OR'd; whichever first.
- **`SenateProTem`:** a Senator promoted to pro-tem still has
  `currentOffice.type === 'SenateProTem'`, not `'Senator'` — by the strict
  graduation list they would NOT trigger office-graduation while pro-tem. Decided:
  this is fine (pro-tem is a tiny edge, and 20-year tenure still graduates them);
  if playtest wants it, add `'SenateProTem'` to `graduationOffices` (assumption
  #10).
- **Multiple Kingmakers, same state, one candidate:** array order wins; the
  first Kingmaker to the assign pass (player manual, or CPU array order) claims
  the candidate; gate #5 then excludes that candidate for the others.
- **Empty faction / factionless:** factionless politicians are never Kingmakers
  (gate requires a faction for candidacy and the mentor relationship is
  intra-faction); a faction with no command-4 members has no Kingmakers.
- **Feed churn:** anointing is a one-time burst (first tick), then a few
  bonds/graduations/dissolutions per turn world-wide — the 200 cap lasts many
  turns; invisible at feed depth 20 (established pattern).
- **Dead/retired:** never anointed, never mentor/protégé, never accelerated;
  their feed entries persist.

## Out of scope
- **New office types** (binding): graduation reads the existing `Senator` /
  `President` OfficeTypes; no new offices.
- **Changing how `command` grows elsewhere** (binding): command still grows only
  via era systems; the only new command change is the +1 graduation legacy
  (capped 5).
- **PV formula changes** beyond what the graduation payoff and the
  `isKingmaker`→trait migration require: the +6 Kingmaker PV is preserved
  (re-sourced from the trait); legacy rewards reuse existing POSITIVE_TRAITS
  (+4 PV) and the existing `command * 10` term — **no new PV terms or fields**.
- **A shared attempt cap / contested budget** (binding deviation): mentorship is
  free intra-faction; one protégé per Kingmaker is the only cap. No
  `kingmakerAttempts`, no per-turn attempt badge.
- **UI for CPU factions' internal mentor management** beyond the read-only rival
  view (which shows their Kingmakers + protégés). No CPU release/reassign.
- **Era-specific scripted mentorship events / historical mentor pairings** —
  the MECHANIC ships here; scripted pairings are era content.
- **Changing 2.1.6's `mentorBondAnchored` poach-resistance** — KEPT exactly
  (0.5×); this feature only adds the lifecycle that keeps those bonds honest.
- **Multi-protégé Kingmakers, mentor "schools", protégé→mentor reverse bonuses,
  or a mentorship-strength stat** — single bond, single direction in v1.
- **`'Kingmaker'` in additional career/draft pools or `scripts/` heuristics /
  dataset regeneration** — it stays a Backroom themed trait + the command-4 grant.

## Open questions / assumptions
Riskiest first:
1. **Cross-phase 2.1.2 / 2.1.7 ordering (THE risk).** 2.1.2 (career growth +
   acceleration read) runs BEFORE 2.1.6 (defection) and 2.4.1 (death/retire), and
   the lifecycle sweep is in 2.1.7 (latest of all). So the stored `protegeId` can
   be stale at 2.1.2 time (a partner who died at last turn's 2.4.1 is only swept
   next turn's 2.1.7). **Mitigation, binding:** the 2.1.2 acceleration MUST use a
   LIVE predicate (`hasMentor`: mentor present, alive, non-retired, same faction)
   rather than trusting the raw pointer — so a dead/retired/defected mentor never
   accelerates regardless of sweep timing. The 2.1.7 sweep is cleanup (feed +
   reassignment correctness), not payoff correctness. The architect must not
   "optimize" the 2.1.2 read into a raw `protegeId` lookup. If a same-turn
   accelerate-then-defect (defect happens at 2.1.6, AFTER 2.1.2) feels wrong in
   playtest, the only fix is reordering phases — out of scope here.
2. **Era-aware command gate (decided at checkpoint-1).** 1772 era uses
   command≥1, 1856 era uses command≥4. The 7 command-1 founders (S. Adams,
   Jefferson, Henry, Hancock, Washington, J. Adams, Franklin) are anointed on
   the 1772 first 2.1.7 tick. Architect picks the detection (year-bracket vs
   scenario id) and the single shape of `KINGMAKER_RULES.commandGateByEra`.
2b. **Draft top-up to ≥10 Kingmakers per faction (decided at checkpoint-1).**
    Runs at 2.1.1 after the draft. Touches the draft phase (a new
    touchpoint outside 2.1.7) — small but real cross-phase coupling beyond the
    primary 2.1.2 link. The upper-PV-band weighted random pick is unstated in
    the user directive ("higher value PV but not always highest"); architect
    picks the exact distribution (e.g., uniform-random from the top half by
    PV, OR a weight proportional to `(pv - medianPv)`). Recommendation:
    uniform-random from the top half by PV — simple, transparent in the
    legend, fault-tolerant in lopsided rosters. If a faction has fewer than
    10 living members total (rare; pathological in 1772 early game), the
    top-up grants to every member it can and leaves the floor under 10.
3. **2.1.2 acceleration = double the skill roll (≈ +0.5 expected skill/threshold,
   cap-safe).** Recommended over an additive probability bump (fiddlier, needs
   clamps) or a full extra threshold roll (too strong — would double trait
   acquisition too). Noticeable over a few thresholds, never breaks
   `CAREER_TRACK_CAP` or the 0–5 skill cap. Tune via `KINGMAKER_RULES.accelSkillRolls`.
4. **Sub-Senate office eligibility = `Representative` + `Governor` only.** All
   other offices (Senator, President, VP, Cabinet, Justices, Speaker, pro-tem,
   committee chairs, ambassadors, generals) disqualify a candidate as "already
   arrived / too senior to be groomed". If House/Governor should also disqualify
   (pure "no office" rule), drop them from `eligibleProtegeOffices`.
5. **Candidacy gate carried forward as age<45 and PV≥20** (was `pvCache > 20`,
   now `>=` for legend symmetry — a 1-PV cosmetic change). "Young" = age<45;
   "pre-Senate" = the office rule (#4). If these feel off, all three are consts.
6. **2.1.2 payoff uses prodigy-direction `hasMentor`, not `mentorBondAnchored`.**
   `mentorBondAnchored` is true in BOTH directions (mentor OR protégé) — using it
   would wrongly accelerate a Kingmaker for *being* a mentor. The dedicated
   `hasMentor` (someone has `protegeId === p.id`) is the correct, narrower read.
   `mentorBondAnchored` stays the right predicate for the poach-resistance and the
   "Bonded" badge (either direction earns protection).
7. **Mentor reward = one-time unheld `'Leadership'` trait (+4 PV).** Cleanest
   "legacy" reward with zero pv.ts/field additions; legible in the roster. If a
   bigger or stackable mentor reward is wanted, it needs a new PV mechanic
   (out-of-scope) — flag at the checkpoint.
8. **Free assignment, one-per-Kingmaker, reassign = release+assign, no lock.**
   Reassignment resets the 20-year clock and forfeits banked bond time, which is
   self-limiting; no cooldown/cost added. If churn is abusable in playtest, add a
   per-bond reassignment lock (a stamp field) — deferred.
9. **`isKingmaker` field REMOVED, trait-derived.** Recommended for a single source
   of truth. Fallback if the read-site count is large: keep `isKingmaker` as a
   boolean kept in sync with the trait (set true when `'Kingmaker'` is granted,
   never seeded independently) — same behavior, smaller diff. Either way the
   trait is canonical and pv.ts's +6 is preserved.
10. **`SenateProTem` does NOT office-graduate (only `Senator`/`President`).** A
    pro-tem still graduates on 20-year tenure; the office trigger just doesn't
    fire while pro-tem. Add `'SenateProTem'` to `graduationOffices` if playtest
    finds it surprising.
11. **`bondedYear` legacy backfill = `game.year` on first sight** (clock starts
    now), not `game.year - 20` (which could fire surprise instant graduations).
    Office-trigger graduation still works immediately for legacy bonds whose
    protégé is already a Senator/President.
12. **Draft top-up interpretation: per-faction floor (10) at draft year.**
    The user's "fewer than 10 in a faction OR in the draft" is implemented as
    per-faction count (which naturally includes new draftees, since they have
    a `factionId` by the time the top-up runs). If they wanted "10 in the
    fresh draft cohort only," count `draftedYear === game.year` members
    instead; the trait grant logic is unchanged.
