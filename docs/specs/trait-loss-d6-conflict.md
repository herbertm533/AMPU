# Spec: Trait Loss + d6 Conflict (PR3)

## Vision (as given)

Fourth slice of the abilities / expertise / traits alignment epic. PR1 (the
expertise axis) and PR2a/PR2b (the abilities loss/earn lifecycle) have merged.
The canonical design reference defines a per-trait **lifecycle** every bit as
load-bearing as the per-ability lifecycle: advantageous traits **fade** with
old age, the named `Leadership` trait has its own Lost triggers, and any time
the gain machinery would mint a trait that **semantically contradicts** one
the politician already holds, a **d6 roll** decides which prevails. AMPU
implements **none** of this — trait lists today are a one-way ratchet with
two tiny exceptions (the `Carpetbagger`-ladder removal vacuum, the CC President
losing `Obscure`, and Common-Sense Paine losing `Obscure`). PR3 closes the
*lifecycle* gap: one tuning const, one pure helper module
(`src/engine/traits.ts`) with `addTrait`/`removeTrait` real-change booleans,
and ~5–10 hooks across the existing trait surface. PR3 ships the **machinery**
and the **primitive**; the new trait *content* the reference names (Hale,
Likable, Iron Fist, Bookkeeper, etc.) is the PR4/PR6 trait-pass work and is
explicitly out of scope.

## Historical grounding (binding)

Source of mechanics: `docs/research/source-abilities-expertise-traits.md`
(BINDING design reference, "TRAITS" section header at line 116 + the
`Leadership` Loss list at line 284–285). Source of scope:
`docs/research/abilities-expertise-traits-gap-analysis.md` ("System 3 —
Traits", "Loss machinery absent" + "~20 reference traits missing entirely").
This is an engine-alignment PR, not era content, so there is **no separate
historian brief** — the design reference is ground truth. Locked
reconciliation decisions D1/D2/D3/D4 carry through unchanged: D1 keeps
`backroom` a skill, D3 keeps the 8 expertise tags out of the `Trait` union,
D4 keeps the AMPU-only mechanical traits.

Binding facts carried from those documents (the F-facts restate them as
testable constraints):

- **F-LOSS triggers (reference, the two general rules — `source.md:125–126`).**
  "Lost with old age (the **advantageous** ones); or, if you gain a trait that
  conflicts with one you have, you **roll to lose it on a d6**." Those are the
  **two** loss mechanisms the reference names at the trait-section level. PR3
  builds both as primitives.
- **F-LEADERSHIP-LOSS (reference, `source.md:284–285`).** The `Leadership`
  trait has its own explicit Loss list: **(a)** unelected president who doesn't
  become party leader, **(b)** losing **medium or easy** battles, **(c)**
  old-age rolls. This was explicitly flagged in PR2a's "Out of scope" as the
  PR3 hook. PR3 wires (b) and (c); (a) is **DEFER** — see F-RECONCILE.
- **F-NO-OTHER-PER-TRAIT-TRIGGERS (binding, but a balance-warning).** The
  reference's per-trait flavor text **mentions** loss-flavored behaviors for a
  handful of traits — `Easily Overwhelmed` "performs some tasks poorly unless
  they lose this trait" (`source.md:170–171`), `Flipflopper` "Can disappear
  over time" (`source.md:176`), `Obscure` "1/d6 Obscure VP can gain
  Leadership" (`source.md:280`, **gain** not loss). With one exception
  (`Obscure` lost on CC-President install, already wired in AMPU —
  `continentalCongress.ts:144`), the reference does **not** specify the
  trigger for these loss-flavored mentions. PR3 treats them as **DEFER**
  (per-trait loss content lives with each trait's pass in PR4/PR6) and
  ships only the two general primitives plus the explicit `Leadership` list.
- **F-D6-MECHANIC (reference, `source.md:126`).** The d6 conflict roll fires
  on **gain** of a trait that **conflicts** with one already held — not on
  every turn, not on every event. The exact d6 threshold/modifier is **not
  specified** in the reference (the prose says "you roll to lose it on a d6"
  with no number). PR3 must pick a default (see Open Q3) and surface every
  conflict pair the architect picks in `TRAIT_CONFLICTS` (the const).
- **F-CONFLICT-PAIRS (reference, the explicit semantic contradictions).** The
  reference names no single canonical list, but reading the trait flavor the
  **explicit binary opposites in the current `Trait` union** are:
  `Charismatic` ↔ `Unlikable` (a "Likable" pair the reference names is not
  in AMPU's union — DEFER until PR4), `Harmonious` ↔ `Puritan`,
  `Integrity` ↔ `Corrupt`, `Ideologue` ↔ `Impressionable` (AMPU-invented,
  already mutually exclusive at seed `phaseRunners.ts:767`),
  `Loyal` ↔ `Opportunist` (AMPU-invented, already mutually exclusive at seed
  `phaseRunners.ts:1085`), `Efficient` ↔ `Passive`, `Egghead` ↔ `Incompetent`.
  PR3 ships the pairs that **make sense within the existing `Trait` union**
  (no new trait content). Conflicts that **require** PR4-content traits
  (`Hale`↔`Frail`, `Likable`↔`Unlikable`) are **DEFER**, flagged in
  F-RECONCILE.
- **F-PV-BALANCE (locked context).** PV reads traits as flat ±4/±5 (positive
  vs. negative) plus an explicit +6 for `Kingmaker` (`pv.ts:65–87`). Trait
  **removal** swings PV by 4–5 per trait; trait **swap** (lose + gain) is the
  d6 result and swings PV by up to 9 (a negative removed AND a positive
  added). The d6 cadence (per-event, not per-turn) bounds the rate; the
  reviewer must verify the swing reads as a meaningful but rare resolution.
  PV formula is **untouched** — only the underlying `traits[]` changes.
- **F-DETERMINISM (CLAUDE.md).** Engine code must use `src/rng.ts` (`chance`,
  `d`, `pick`) for any roll. PR3 introduces **one** new RNG path — the d6
  conflict roll — and uses `d(6)` from `rng.ts` (already used for casualties
  at `revolutionaryWar.ts:70–79`). Old-age trait loss uses `chance()` like
  PR2a's `oldAge.baseChance`. No `Math.random`.

## Player experience

Trait lists stop being permanent. An aging war hero's `Leadership` reputation
fades after a string of late-career battle defeats; an old admiral's
`Crisis Manager` mantle slips from him in old age, as the next generation
takes the public eye. When the kingmaker-graduation roll would mint a
positive trait on a protege who **already carries its opposite**, a single
d6 roll arbitrates which one wins — sometimes the protege sheds
`Unlikable` and becomes `Charismatic`, sometimes the new trait simply
doesn't take. The hit feels rare and legible (a log line per resolution,
the underlying trait array changes by exactly one entry), so the player
gains the *tension of evolution* without the trait list churning. This is
the half of the trait lifecycle AMPU has never had.

## User story

As a player managing a faction across decades, I want my politicians'
**traits** — especially the advantageous ones — to **fade** with old age
and battlefield defeat, and to **arbitrate semantic conflicts** when a
new trait would contradict one already held, so that trait identities
feel earned and re-earned across a career rather than a permanent
collection.

## Scope of THIS spec (PR3 — Lifecycle + d6 primitive only)

**Headline scoping recommendation (resolved below in Open Q1):** ship as
**ONE PR (Option A)** — Trait Loss + d6 conflict in the same slice. The
two systems share the same trait-helper surface (`addTrait`/`removeTrait`),
the d6 has **concrete consumers in AMPU's current trait union** (every
trait grant site is a potential conflict trigger; the four trait pairs
above are wirable without any new content), and ~30 LoC of d6 helper +
one const + one consumer at the kingmaker-protege graduation path is
**cheaper to land beside the loss work than to defer**. The loss
machinery alone is ~150 LoC; adding the d6 brings it to ~180 LoC and
gives playtest immediate signal on the conflict pairs. Option B (split
into PR3 + PR3b) is documented in Open Q1 with the trade-offs.

PR3 covers:
- **(A)** The trait-helper primitive (`addTrait`/`removeTrait`, mirror of
  `addSkillPoint`/`loseSkill` from PR2a/PR2b) — the single mutation site
  every gain/loss path now routes through. **F-RECONCILE table** lists every
  existing trait removal/grant.
- **(B)** Old-age advantageous-trait decay in `runPhase_2_4_1_Deaths`,
  beside PR2a's old-age ability decay (one consolidated probabilistic event
  per politician per turn — see AC #6 / Open Q4).
- **(C)** The `Leadership` Lost triggers (medium/easy battle losses + old
  age), per F-LEADERSHIP-LOSS, wired in `revolutionaryWar.ts` next to PR2a's
  battle ability losses.
- **(D)** The d6 conflict-resolution primitive (`resolveTraitConflict` /
  `tryGrantTrait`) called from every trait gain site that could mint a
  conflicting trait — see F-RECONCILE / AC #10–#13.
- **(E)** Reconciliation guardrails: every existing trait removal /
  grant routes through the new helpers (no direct `traits.push` /
  `traits.filter` left in engine code).

PR3 does **NOT** cover: new trait *content* the reference names but AMPU
doesn't have (`Hale`, `Likable`, `Iron Fist`, `Bookkeeper`,
`Cosmopolitan`, `Two-Faced`, etc.) — that's PR4 (election-facing) and PR6
(governance-facing). The `Hale` longevity hook PR2a left as a no-op
(`ABILITY_LOSS_RULES.oldAge.haleChanceMult = 1.0`) stays a no-op until PR4
adds `Hale` to the union. Trait election effects (e.g. `Cosmopolitan`'s
national-vs-local boost) are likewise PR4. Trait expertise gating
(PR5/PR7) is also out.

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human/architect
resolves at checkpoint; PM recommendation in parentheses). The headline
`[Open @ CP1]` is Q1 (one PR vs. split), followed by Q3 (d6 threshold),
Q4 (old-age trait loss vs. ability loss collision), Q5 (conflict-pair
list).

### A. A single trait helper + tuning const (mirror PR1 / PR2a / PR2b)

1. **[Locked]** A new tuning const `TRAIT_LIFECYCLE_RULES` is added to
   `src/types.ts` (placed near `ABILITY_LOSS_RULES` / `ABILITY_EARN_RULES`,
   `as const satisfies …` like its neighbors) holding **all** magnitudes,
   odds, and the conflict-pair table PR3 introduces — no magic numbers in
   any engine body. It is the single source for the old-age trait-decay
   chance/age, the d6 threshold (Q3), the `Leadership` battle-loss
   trigger, and the `TRAIT_CONFLICTS` table (Q5).

2. **[Locked]** A pure helper module **NEW: `src/engine/traits.ts`**
   (mirroring `src/engine/abilities.ts` / `src/engine/expertise.ts`)
   exposes the single mutation primitives used by **every** trait
   gain/loss path:
   - `addTrait(p: Politician, t: Trait): boolean` — dedupe-on-insert
     (returns `false` if already held); does NOT consult conflicts (callers
     route conflict-aware gains through `tryGrantTrait`).
   - `removeTrait(p: Politician, t: Trait): boolean` — returns `true` iff
     the politician actually held it.
   - `tryGrantTrait(p: Politician, t: Trait): { granted: boolean; replaced?: Trait }`
     — the conflict-aware variant. If `t` is already held, no-op (returns
     `{ granted: false }`). Otherwise, look up `TRAIT_CONFLICTS[t]` for the
     **conflicting trait already held**; if found, roll `d(6)`: on
     ≥ threshold (Q3 default 4), remove the held trait AND add `t`
     (`{ granted: true, replaced: held }`); on < threshold, no-op
     (`{ granted: false }`). If no conflict, fall through to a normal
     `addTrait` and return `{ granted: true }`.
   - The helpers are **pure** (no `addLog`, no `refreshPv`); callers log
     and PV-refresh themselves. Probability/randomness lives at the call
     site through `d(6)` from `src/rng.ts` — never inside the helper's
     `addTrait`/`removeTrait` boundary. The d6 lives **inside**
     `tryGrantTrait` because the conflict-resolution semantic is the
     primitive's purpose.

3. **[Locked]** No new field on `Politician` or `GameState`. No
   `repair()` change. PR3 only reads/mutates the existing `traits: Trait[]`
   array (and the existing `failedBidExpiresYear` already used by Flip-
   Flopper / Failed-Bid decay).

### B. Old-age trait decay (in `runPhase_2_4_1_Deaths`)

4. **[Locked]** Old-age advantageous-trait loss is evaluated in
   `runPhase_2_4_1_Deaths` (`phaseRunners.ts:2024+`), the existing
   mortality phase, **inside the existing per-politician loop**, beside
   PR2a's ability decay. It runs **after** the death/retire branches (so a
   just-died politician is not also decayed) and **after** PR2a's
   ability-decay event (so the trait-decay event is independent of and
   serialized with the ability-decay event — see Open Q4 for the
   simultaneous-fire collision).

5. **[Locked]** Decay is **age-gated and probabilistic**: below
   `TRAIT_LIFECYCLE_RULES.oldAge.minAge` (recommend **70**, aligned with
   PR2a's `ABILITY_LOSS_RULES.oldAge.minAge`) the chance is **zero**; at /
   above it, a per-turn `chance(TRAIT_LIFECYCLE_RULES.oldAge.baseChance)`
   roll (recommend a **lower** base than ability decay, **~5–8%**, with
   optional age-bracket bumps mirroring `ABILITY_LOSS_RULES.oldAge.
   ageBracketBonus`) decides whether **one** trait-decay event occurs
   this turn.

6. **[Open @ CP1 — recommend remove ONE random eligible advantageous
   trait]** When a decay event fires, it removes **one** trait from the
   politician's **advantageous-trait pool** (filtered subset — see AC #7).
   Recommend choosing the trait **randomly via `rng.ts` (`pick`)** from
   the politician's held traits that are in the eligible pool. If the
   pool is empty (no advantageous traits held), the event is a silent
   no-op. Alternatives the architect may pick at CP1: remove the
   **lowest-tenure** trait (oldest), or remove a **specific** decay-
   ordered list — rejected as state-shape changes.

7. **[Open @ CP1 — recommend the pool below]** The "advantageous trait
   pool" eligible for old-age decay must be defined explicitly (not
   "all of `POSITIVE_TRAITS`") because some positive traits are
   **structural** (load-bearing on the engine) and should not silently
   disappear. Recommend the locked pool:
   - **DECAYABLE** (lose with old age): `Leadership`, `Crisis Manager`,
     `Charismatic`, `Orator`, `Debater`, `Manipulative`, `Celebrity`,
     `Egghead`, `Magician`, `Integrity`, `Efficient`, `Harmonious`,
     `Numberfudger`, `Propagandist`, `Reformist`, `Nationalist`,
     `Globalist`.
   - **PROTECTED** (do not lose): `Kingmaker` (load-bearing on kingmaker
     system + PV +6); `Ambitious` (load-bearing on faction-leader
     challenges); `Loyal`/`Opportunist`/`Ideologue`/`Impressionable`
     (seeded once, load-bearing on conversions/ideology shifts; the
     reference doesn't class these as "advantageous" anyway).
   The pool lives in `TRAIT_LIFECYCLE_RULES.oldAgeDecayable` so the
   designer can dial it. Architect confirms at CP1.

8. **[Locked]** Each decay that actually removes a trait writes one
   `addLog` under phase `2.4.1` consistent with the surrounding
   death/retire/ability-decay logs (e.g. `"{name} ({state}, age N) has
   lost their {Trait} step — the years catch up."`), carrying
   `politicianId`. A fired-but-no-op roll (empty pool) is silent.

9. **[Locked]** Old-age trait decay routes through `removeTrait`. Its
   `refreshPv` is the existing trailing sweep at the end of
   `runPhase_2_4_1_Deaths` (already runs after PR2a's ability decay) —
   PR3 adds no new PV write.

### C. `Leadership` Lost triggers (the named trait, F-LEADERSHIP-LOSS)

10. **[Locked]** `Leadership` is lost on **lost ground battles of
    moderate or easy difficulty** (per F-LEADERSHIP-LOSS, mirroring
    PR2a's `ABILITY_LOSS_RULES.battle.groundLossByTier` shape). Hook in
    `revolutionaryWar.ts` `runRevWarBattles` immediately **after**
    PR2a's `applyBattleLoss` call (line 207, ground loop) — same
    senior-commander target. Check: if the difficulty is `'moderate'`
    or `'easy'` AND the general is alive AND the general has
    `Leadership`, call `removeTrait(general, 'Leadership')` and log
    under phase `2.7.2` (e.g. `"{name}'s aura of Leadership fades after
    the defeat at {battle}."`). On `'difficult'` battles, no Leadership
    loss (mirrors PR2a's military-only difficulty branch).

11. **[Locked]** `Leadership` is **also** lost on **lost naval battles**
    of comparable severity. Per the reference, the `Leadership` Loss
    line names "losing medium or easy battles" without distinguishing
    naval — naval battles in AMPU have no difficulty tier
    (`revolutionaryWar.ts:166–177`). Recommend treating a naval loss as
    a Leadership-loss trigger (the admiral loses `Leadership`). Flag
    Open Q6 — the alternative is naval-loss-not-counted.

12. **[Locked]** `Leadership` is **also** lost on **old-age rolls**, per
    F-LEADERSHIP-LOSS. This is naturally covered by AC #6/#7 (it's in
    the `oldAgeDecayable` pool). No separate hook required.

13. **[Open @ CP1 — recommend DEFER]** The third F-LEADERSHIP-LOSS
    trigger — "unelected president who doesn't become party leader" —
    has **no clean hook** today. AMPU has no "unelected president"
    concept (every `presidentId` arrives via the presidential election
    flow, `runPhase_2_9_3_Presidential`). Wiring this would require
    detecting the corner case of presidential-succession-without-
    election (e.g. a VP elevated by `recordDeath` of the president), and
    threading "did they then become party leader within X turns" through
    `runPhase_2_2_4_PartyLeaders`. Recommend **DEFER** to a follow-up
    PR that builds the succession plumbing. PR3 only wires the **two**
    reachable triggers (battle losses + old-age).

### D. d6 conflict resolution (the primitive)

14. **[Locked]** `TRAIT_CONFLICTS: Partial<Record<Trait, Trait>>` is
    declared in `src/types.ts` as part of `TRAIT_LIFECYCLE_RULES`. It is
    a **symmetric pairing** — both directions are listed so a lookup of
    either side works (e.g. both `Charismatic → Unlikable` and
    `Unlikable → Charismatic`). Recommended pairs (Open Q5 confirms):
    - `Charismatic ↔ Unlikable` (the magnetic-appeal vs. strongly-disliked
      pair the reference clearly opposes)
    - `Harmonious ↔ Puritan` (middle-ground vs. unbending devotion to
      ideology — reference text describes them as poles)
    - `Integrity ↔ Corrupt` (incorruptible vs. corruption — reference is
      explicit at `Integrity` description)
    - `Efficient ↔ Passive` (mastered policy / quick work vs. hands-off
      to a fault)
    - `Egghead ↔ Incompetent` (expert/research-driven vs. laughably
      incompetent — explicit reference contrast for cabinet competence)
    - `Ideologue ↔ Impressionable` (already mutually exclusive at seed
      `phaseRunners.ts:767–770`; the d6 path REPLACES the seed-time
      either-or with a gain-time conflict roll — see Edge case "seeding
      time vs. event time")
    - `Loyal ↔ Opportunist` (already mutually exclusive at seed
      `phaseRunners.ts:1087–1088`; same as above)
    The architect picks which of the seven to lock in at CP1; the
    *mechanism* (table + d6 lookup) is Locked.

15. **[Open @ CP1 — recommend d6 ≥ 4 = "new trait wins, old removed"]**
    The exact d6 mechanic. The reference says "roll to lose it on a d6"
    with no number. Recommend the simplest deterministic-via-rng rule:
    a single `d(6)` roll, **≥ 4 means the held trait is lost and the new
    trait is gained** (a flat 50% — three faces win, three faces lose,
    matching the reference's casino-feel d6 cadence). Alternatives the
    architect may pick at CP1:
    - **(a) Flat 50% as above (recommended).**
    - **(b) ≥ 3 (~67% — biased toward replacement; the gain machinery
      "won").**
    - **(c) ≥ 5 (~33% — biased toward incumbency; the held trait is
      sticky).**
    - **(d) Per-pair threshold** (e.g. `Integrity ↔ Corrupt` threshold 5,
      `Loyal ↔ Opportunist` threshold 3) — rejected for PR3 as
      overengineering; designer can revisit.
    The threshold lives in `TRAIT_LIFECYCLE_RULES.conflictD6Threshold`
    so the human dials it at playtest. Default **4**. (The PR2a/PR2b
    convention of "magnitudes in one const" applies here.)

16. **[Locked]** Every existing trait **gain** site (the F-RECONCILE
    "GRANT" rows) routes through `tryGrantTrait` whenever the granted
    trait **has a key in `TRAIT_CONFLICTS`** — otherwise plain
    `addTrait` is fine (the d6 only fires on conflicting traits).
    Non-conflicting traits gain unchanged. Sites whose grant has no
    conflict pair are touched only to route through the helper for
    consistency (no behavior change).

17. **[Locked]** When the d6 roll resolves to "new wins, old removed",
    the call site writes **one** `addLog` describing the swap (e.g.
    `"{name} sheds Unlikable and earns Charismatic — the gain wins on a
    d6."`). When the d6 resolves to "old holds, new does not take",
    the call site writes **one** `addLog` describing the failed gain
    (`"{name} would have gained Charismatic, but Unlikable holds on a
    d6."`). The helper returns the resolution as data (`{ granted,
    replaced }`) so the call site composes the log line — the helper
    does no logging itself.

### E. F-RECONCILE — every existing trait removal/grant routes through the helpers

18. **[Locked]** PR3 catalogs every site where `traits.push` or
    `traits.filter` runs in engine code today and either (a) routes it
    through the new helper, (b) replaces a direct `traits.filter` with
    `removeTrait`, or (c) tags it `DEFER` with a recorded reason. The
    F-RECONCILE table below is the binding source.

| Site (file:line) | Operation today | PR3 action | Notes |
|---|---|---|---|
| `phaseRunners.ts:336` | `p.traits.push(t)` (themed-trait roll, `rollThreshold`) | Route through `tryGrantTrait` | The themed pool already filters held; conflicts (Harmonious↔Puritan) can now d6-resolve at career exit |
| `phaseRunners.ts:351` | `p.traits.push(t)` (random off-track positive/negative) | Route through `tryGrantTrait` | This is the main conflict-resolution surface (e.g. `Charismatic` rolled on a politician with `Unlikable`) |
| `phaseRunners.ts:540` | `p.traits.push(t)` (Carpetbagger ladder on relocation) | Route through `addTrait` | Ladder is order-preserving, no conflicts in the ladder set |
| `phaseRunners.ts:769–770` | `p.traits.push('Ideologue')` / `'Impressionable')` (one-shot ideology seed) | Leave as direct push (seed-time, conflict path handled via mutually exclusive `if`) | Seed pass is once per politician; flagged in Edge cases |
| `phaseRunners.ts:1087–1088` | `p.traits.push('Loyal')` / `'Opportunist')` (one-shot conversion seed) | Leave as direct push (same seed-time rationale) | Same edge as above |
| `phaseRunners.ts:1296` | `g.traits.push('Kingmaker')` (draft floor top-up) | Route through `addTrait` | Kingmaker has no conflict pair; the dedupe is the only invariant |
| `phaseRunners.ts:1324` | `p.traits.push('Kingmaker')` (anointed in 2.1.7) | Route through `addTrait` | Same as above |
| `phaseRunners.ts:1381` | `c.traits.push(pick(inheritable))` (kingmaker-protege graduation inheritance) | Route through `tryGrantTrait` | **Key d6 site** — inherited positive can collide with a held opposite (Charismatic on Unlikable protege, etc.) |
| `phaseRunners.ts:1391` | `k.traits.push('Leadership')` (mentor reward) | Route through `addTrait` | No conflict pair for Leadership in PR3's table (recommend) |
| `phaseRunners.ts:1844` | `p.traits.push('Ambitious')` (Ambitious seed) | Leave as direct push (seed-time, one-shot, gated by `ambitiousSeeded`) | Seed pass |
| `phaseRunners.ts:1960` | `challenger.traits.push('Failed Bid')` (lost challenge) | Route through `addTrait` | No conflict pair |
| `phaseRunners.ts:2476` | `p.traits.push(eff.trait)` (anytime `grantTrait` effect) | Route through `tryGrantTrait` | Big surface — every anytime template that mints a trait now d6-resolves on conflict; the existing `if (!p.traits.includes)` guard becomes the dedup half of `tryGrantTrait` |
| `phaseRunners.ts:2521` | `p.traits.push('Corrupt')` (scandal-scaling forced Corrupt) | Route through `tryGrantTrait` | **Notable d6 site** — Integrity↔Corrupt conflict can resolve here ("the scandal sticks" vs. "their Integrity weathers it") |
| `phaseRunners.ts:2678, 2686` | `paine.traits.push('Celebrity')` / `samAdams.traits.push('Celebrity')` (Boston Tea Party / Common Sense scripted) | Route through `addTrait` | No conflict pair for Celebrity in PR3 |
| `revolutionaryWar.ts:98` | `victim.traits.push('Frail')` (battle wound) | Route through `addTrait` | Frail has no conflict pair in PR3 (would conflict with Hale, but Hale is PR4 content — flagged) |
| `continentalCongress.ts:147` | `winner.traits.push('Leadership')` (CC President 20% reward) | Route through `addTrait` | No conflict pair for Leadership |
| `constitutionalConvention.ts:156` | `father.traits.push('Celebrity')` (Father of Constitution) | Route through `addTrait` | No conflict pair |
| `constitutionalConvention.ts:168` | `a.traits.push('Egghead')` (Federalist authors) | Route through `tryGrantTrait` | **Notable d6 site** — Egghead↔Incompetent conflict can resolve here |
| `data/draftImport.ts:26, 223` | `traits.push(t)` (dataset import) | Leave as direct push | Import-time, not gameplay — the dataset is authored-time data, not engine state |
| `phaseRunners.ts:1835` | `p.traits = p.traits.filter((t) => t !== 'Failed Bid')` (Failed Bid decay) | Route through `removeTrait` | **Existing time-based decay** — PR3 routes through the helper for consistency, no behavior change |
| `continentalCongress.ts:144` | `winner.traits = winner.traits.filter((t) => t !== 'Obscure')` (CC President sheds Obscure) | Route through `removeTrait` | Pre-existing direct mutation; routes through helper |
| `phaseRunners.ts:2687` | `paine.traits = paine.traits.filter((t) => t !== 'Obscure')` (Common Sense Paine sheds Obscure) | Route through `removeTrait` | Same |
| `phaseRunners.ts:1379` | `k.traits.filter(...)` (filter-for-inheritable, read only — no mutation) | No change | This is a `.filter()` read, not a removal. Skip. |
| `phaseRunners.ts:1878` | `p.traits.filter(...)` (faction-leader scoring positive count, read only) | No change | Read-only filter; skip. |
| `phaseRunners.ts:2287` | string array of trait names (not a `traits.filter`) | No change | Constant array, not state mutation |
| `pages/FactionLeaderPage.tsx:172` | `c.traits.filter(...)` (UI display) | No change | UI read only |
| Reference Lost trigger | F-LEADERSHIP-LOSS "unelected president who doesn't become party leader" | DEFER | No clean hook today; see AC #13 |
| Reference Lost trigger | `Easily Overwhelmed` "if retained" (Administrative loss text mentions "Easily Overwhelmed (if retained)" `source.md:83`) | DEFER | `Easily Overwhelmed` is NOT in AMPU's `Trait` union; this is PR4/PR6 content |
| Reference Lost trigger | `Flipflopper` "Can disappear over time" `source.md:176` | ALREADY COVERED (proxy) | AMPU has `flipFlopperPenalty` numeric decay (`phaseRunners.ts:469–470`) and `Failed Bid` 6-turn decay; the literal trait `Flip-Flopper` itself has no time decay, but the user-facing "fades over time" is approximated. Wiring trait-level decay is a PR4 designer call |
| Reference conflict pair | `Hale ↔ Frail` | DEFER | Hale is not in AMPU's `Trait` union (PR4 content) |
| Reference conflict pair | `Likable ↔ Unlikable` | DEFER | Likable is not in AMPU's `Trait` union (PR4 content) |
| Reference conflict pair | `Two-Faced ↔ Predictable` / `Two-Faced ↔ Integrity` | DEFER | Two-Faced is not in AMPU's `Trait` union (PR4 content) |

### F. Step-2 re-validation (PR2b review carryover)

19. **[Open @ CP1 — recommend ADDRESS here]** PR2b's review flagged a
    corner case in `runPhase_2_2_3_FactionLeaders`: the Step 2 install
    branch fires `applyFactionLeaderGrants` even when re-validation
    confirms the same person is still the valid leader (i.e. the
    "real change" guard is incomplete in one branch). Trait loss can
    surface the same issue if a leader's `Leadership` is removed in
    one tick and the next tick the re-validation grants `Leadership`
    back via the mentor-reward path. Recommend PR3 audit the
    `applyFactionLeaderGrants` call sites and confirm the `formerLeaderId`
    diff is consistent across both Step 2 and Step 3 paths — and that
    if it isn't, a one-line fix is added here (it's a clean place to
    fix it since PR3 touches the faction-leader trait grants anyway).
    If the audit finds the guard is correct, no change. Architect
    confirms at CP1.

### G. Cross-cutting guardrails (assert nothing leaked in)

20. **[Locked]** PR3 makes **no change to the PV formula**
    (`src/pv.ts`). Trait swap/loss/gain flows through the existing
    `for (const t of p.traits)` ±4/±5 / explicit `Kingmaker +6` and
    the existing `refreshPv` sweeps; the swing in PV is data-driven
    by the underlying array change.

21. **[Locked]** PR3 makes **no change** to the `Trait` union itself
    (no new trait content). All conflict pairs PR3 ships are within
    the existing 37-member union. Reference Lost triggers and
    conflict pairs that require absent traits (Hale, Likable, Two-
    Faced, Easily Overwhelmed, etc.) are DEFER, listed in
    F-RECONCILE.

22. **[Locked]** PR3 adds **no new field** to `Politician`,
    `GameState`, or any snapshot type and requires **no `repair()`
    change**. Old saves load and play unchanged (they simply begin
    to experience trait loss / d6 conflicts going forward).

23. **[Locked]** PR3 uses `d(6)` from `src/rng.ts` for the conflict
    roll and `chance()` for the old-age decay roll — **no new
    `Math.random` calls**. (PR2a's two pre-existing `Math.random`
    calls at `revolutionaryWar.ts:88,96` remain out of scope.)

24. **[Locked]** PR3 does **not** alter the `factionLeaderOf` /
    `presidentId` / `cabinet` writes — trait loss is a politician-
    local mutation that the existing PV cascade picks up.

25. **[Locked]** `npm run build` (tsc + vite) passes and `npm run
    lint` (tsc `--noEmit`) is clean. Any `as const satisfies`
    exhaustiveness on the new constants compiles.

## Edge cases

- **Trait already at 0 advantageous-traits** — old-age decay event
  fires but the pool (AC #7) is empty; helper returns `false`; no log,
  no PV change. Common for fresh draftees and load-bearing-only
  politicians (e.g. a pure `Kingmaker`).
- **Politician already at the conflict pair's other side** — the
  d6 fires; on success the held trait swaps for the new; on failure
  the new doesn't take. The d6 fires **only on conflict**; a grant
  with no conflict pair always succeeds (subject to dedupe).
- **Conflict pair with both sides already held** — should not be
  reachable (the d6 prevents that state going forward), but legacy
  saves can have both `Loyal` and `Opportunist` if the data is
  corrupted. The helper handles this defensively: if both are
  somehow present, `addTrait` no-ops (already held); `tryGrantTrait`
  also no-ops; the state is detected but not repaired (no destructive
  cleanup in PR3 — the human can address via a future migration).
- **Seeding time vs. event time (Ideologue↔Impressionable,
  Loyal↔Opportunist).** AMPU seeds these at one-shot pass time via
  `else if` (mutually exclusive). PR3 does **not** rewrite the seed
  passes (per F-RECONCILE — "Leave as direct push"). The d6
  conflict only fires if a **second** path later grants the opposite
  (e.g. the kingmaker-protege inheritance picks `Opportunist` for a
  politician already seeded `Loyal`); at that point the d6 arbitrates
  per AC #10. This is the intended behavior.
- **Simultaneous old-age ability decay AND old-age trait decay (Q4).**
  Both events fire in the same `runPhase_2_4_1_Deaths` per-politician
  loop. Recommend the two events are **independent rolls**: PR2a's
  ability decay rolls once, PR3's trait decay rolls once, both can
  fire in the same turn for the same politician. A 90-year-old
  legend can lose both a step of `command` and a piece of their
  `Leadership` in one tick — intended decline drama; flag for
  playtest balance. Alternative (rejected): consolidate into one
  "old-age erosion event" that picks ability-decay OR trait-decay
  uniformly — feels too gentle for the high end of the age curve.
- **`Leadership` loss after Sec-State command grant (PR2b stack).**
  PR2b grants a freshly-installed Sec State `command +1`. If that
  Sec State also has `Leadership` and later loses a major battle,
  the trait-loss hook removes `Leadership` independently of the
  command grant — they live on different layers. Intended.
- **Carpetbagger ladder hits a "no eligible trait" state** — the
  ladder already filters held traits; if all four ladder traits are
  held, the relocation hook's `find` returns `undefined` and the
  grant no-ops. PR3 doesn't change this; routing through `addTrait`
  preserves the dedupe.
- **Anytime `grantTrait` with a conflict pair (the d6 surface).**
  An anytime template that grants `Charismatic` on a politician with
  `Unlikable` now triggers a d6. On ≥4, the politician gains
  `Charismatic` and loses `Unlikable`; on <4, the gain doesn't take
  and the template's other effects (`pvBump`, `pvHit`, etc.) **still
  apply** (the rest of the template's effects array is independent
  of the trait grant). Flagged for playtest — this could feel like
  "the event ALMOST happened" which may be confusing. Open Q7.
- **Forced Corrupt at scandal-scaling (line 2521).** If a politician
  with `Integrity` rolls a scandal anytime evo that forces
  `Corrupt`, the d6 fires: on ≥4, Integrity is replaced by Corrupt
  (the scandal sticks); on <4, Corrupt does NOT take (their
  Integrity weathers it). The existing `mult >= 1.0` gate stays.
  The `flipFlopperPenalty += LEADERSHIP_RULES.failedBidPvStamp` at
  `mult >= 1.2` (line 2525) is **independent** of the trait roll
  (it always applies). Intended.
- **Inherited trait from kingmaker hits conflict (`phaseRunners.ts:1381`).**
  The kingmaker graduation already filters `!c.traits.includes(t)`;
  PR3 adds the conflict d6 on top — a protege with `Unlikable`
  inheriting `Charismatic` from a kingmaker mentor rolls the d6;
  on success they shed `Unlikable` for `Charismatic`, on failure
  the inheritance doesn't take (and `pick(inheritable)` is a single
  draw — no re-roll). Architect picks whether failed inheritance
  re-rolls the pool or simply drops (Open Q8 — recommend drop).
- **Naval Leadership loss (Q6).** Per AC #11, recommend naval loss
  counts. If the architect rules naval Leadership loss OUT, the
  admiral keeps Leadership on a naval defeat; the recommendation
  is IN for consistency with the F-LEADERSHIP-LOSS "losing medium
  or easy battles" phrasing.
- **CPU vs. player politicians** — all loss paths fire for **every**
  politician. CPU stars lose traits invisibly to the UI; the data
  stays consistent for future PRs and downstream PV computation.

## Out of scope

Named explicitly so the architect does not pull adjacent or later-PR
work into PR3:

- **New trait CONTENT (PR4 + PR6).** Hale, Likable, Iron Fist,
  Bookkeeper, Cosmopolitan, Two-Faced, Predictable, Crisis Admin,
  Crisis Gov, Decisive General, Delegator, Disharmonious, Domestic
  Warrior, Easily Overwhelmed, Geostrategist, Illicit, Incoherent,
  Jurisprudence, Lackey, Late Bloomer, Everyman, Master Kingmaker,
  Micromanager, Military Leader, Naive Strategist, Overeager,
  Pliable, Provincial, Southern Unionist, Teflon, Uncharismatic —
  PR3 does not add any of these to the `Trait` union. Their
  conflict pairs (e.g. Hale↔Frail, Likable↔Unlikable) are DEFER.
- **Trait election effects (PR4).** Decorative traits gaining
  election math (`Cosmopolitan` national bonus, `Provincial` regional
  bonus, `Two-Faced` voter-distrust penalty, etc.) — that's the
  trait-passes PR. PR3 only handles lifecycle.
- **Trait expertise gating (PR5/PR7).** Traits gating cabinet posts
  (e.g. `Bookkeeper` for Sec Treasury, `Lawful` for AG) — PR5.
- **The `Hale` longevity hook PR2a left as a no-op.** PR2a's
  `ABILITY_LOSS_RULES.oldAge.haleChanceMult = 1.0` documents the
  longevity slot for when `Hale` enters the union. PR3 does NOT
  add `Hale`; the slot stays `1.0`. (Same applies to PR3's own
  decay — a `Hale` carrier would presumably lose advantageous
  traits more slowly, but with Hale absent, PR3's decay applies
  uniformly.)
- **Trait-level decay of `Flip-Flopper` (the literal trait, not the
  numeric penalty).** The reference says Flipflopper "can disappear
  over time"; AMPU has the numeric `flipFlopperPenalty` decay
  already (`phaseRunners.ts:469–470`). Adding a parallel trait-
  level time decay (e.g. `Flip-Flopper` cleared after N turns
  unless re-triggered) is a designer call deferred to PR4.
- **Unelected-president `Leadership` loss (AC #13).** Requires the
  succession plumbing AMPU doesn't have. DEFER.
- **`Easily Overwhelmed` removal "if retained".** The trait isn't
  in AMPU's union. DEFER to PR6.
- **PV formula changes for traits.** Out (locked context). The
  PV constants (±4 positive, ±5 negative, +6 Kingmaker) are
  untouched.
- **A trait-detail UI (modal, tooltip, etc.).** Trait loss
  surfaces only via the existing log feed (`2.4.1`, `2.7.2`, the
  anytime `2.4.2` feed) and the live Roster trait column. No new
  surface.
- **Updating the standard-draft-classes dataset.** PR3 mutates the
  runtime `traits[]` array via gameplay; the import-time dataset
  is unchanged.

## Open questions / assumptions

Decision-first ordering. Q1 is the CP1 headline.

1. **(HEADLINE — one PR or split? PM recommends ONE PR / Option A.)**
   The trait-loss + d6-conflict work has **concrete consumers in
   AMPU's current trait union** (the seven conflict pairs above are
   all real, all wirable today, all touching live trait grants).
   The d6 is **not** infrastructure-only — it has 5+ consumers the
   F-RECONCILE table names (themed-trait roll, random off-track
   roll, kingmaker inheritance, anytime `grantTrait`, scandal-scaled
   `Corrupt`). Splitting would force PR3b (the d6) to land later
   with no additional content gain, just bookkeeping cost.
   - **Option A (recommended): ONE PR.** Loss machinery + d6 ship
     together. ~180 LoC: ~150 for the helper + old-age decay +
     Leadership-loss hooks + F-RECONCILE rewiring, ~30 for the d6
     primitive + `TRAIT_CONFLICTS` table + log lines.
   - **Option B (alternative): SPLIT.** PR3 = loss only (the
     old-age decay block + Leadership Lost triggers); PR3b = d6
     primitive + F-RECONCILE rewire of grant sites. **Cost:** PR3b
     has to re-touch every site PR3 already routed through helpers,
     for negligible isolation gain. Recommend against unless the
     human wants to playtest decay alone before tuning the d6.

2. **(Trait-helper API shape.)** Recommend the three-function shape
   in AC #2 (`addTrait`, `removeTrait`, `tryGrantTrait`) over a
   merged `setTrait(p, t, { resolveConflict: true })`. The
   three-function shape mirrors PR2a/PR2b's
   `addSkillPoint`/`loseSkill` pair and keeps the d6 a discrete
   primitive (call sites can pick `addTrait` for "no conflict
   possible" or `tryGrantTrait` for "may need d6"). Architect
   confirms at CP1; the merged-API alternative is a 5-line
   refactor if preferred.

3. **(d6 threshold — the headline tuning call.)** Recommend
   **d6 ≥ 4 = new trait wins** (flat 50%). Lives in
   `TRAIT_LIFECYCLE_RULES.conflictD6Threshold = 4`. The reference
   is silent on the exact threshold ("roll to lose it on a d6"
   has no number). 50% feels like the most defensible Schelling
   point: the gain has reached the politician (the event/career
   roll landed), the held trait is the incumbent — coin-flip
   arbitration is the most-neutral resolution that respects both.
   Architect tunes at CP1.

4. **(Old-age trait decay vs. ability decay collision.)** Per Edge
   cases, recommend **independent rolls** (both can fire in one
   tick on one politician). The alternative — consolidate to one
   "old-age erosion event" — keeps the per-turn impact gentler but
   weakens the high-age decline curve. Designer choice; default
   independent. Flag for playtest balance.

5. **(`TRAIT_CONFLICTS` pair list.)** Recommend all seven pairs in
   AC #14 are locked. The architect may dial back to a subset (e.g.
   ship `Charismatic ↔ Unlikable` + `Integrity ↔ Corrupt` + the two
   AMPU-invented seed pairs, defer `Harmonious ↔ Puritan` /
   `Efficient ↔ Passive` / `Egghead ↔ Incompetent` to PR4 if their
   election effects are not yet wired). PM recommendation: ship all
   seven — they're all clearly opposed in the reference's flavor
   text, and the d6 makes "wrong-direction" results rare.

6. **(Naval Leadership loss — AC #11.)** Recommend **IN** (naval
   loss triggers `Leadership` removal on the admiral). The
   reference's F-LEADERSHIP-LOSS line says "losing medium or easy
   battles" without distinguishing land/naval; AMPU naval has no
   tier (the tier is implicit). Architect may rule OUT (naval-
   Leadership-loss disabled) at CP1.

7. **(Failed-conflict-d6 and the rest of the anytime template.)**
   Recommend: if `tryGrantTrait` fails the d6, the **rest** of the
   anytime template's effects (pvBump, pvHit, skillBump, etc.)
   still apply — only the trait grant fails. This matches the
   "ALMOST happened" reading of a failed roll. Alternative: a
   failed d6 aborts the entire template effect — feels heavier
   and inconsistent with how the other failed effects (e.g.
   `skillBump` at cap) silently no-op while the template
   otherwise applies. Recommend the partial-apply path.

8. **(Failed kingmaker inheritance re-rolls?)** Recommend: on a
   failed d6 in the kingmaker-protege inheritance branch
   (`phaseRunners.ts:1381`), the inheritance is **dropped** (no
   re-roll over `inheritable`). The kingmaker `inheritable` array
   is the entire positive trait set of the mentor; a single
   d6-failed pick is fine to drop. Re-rolling would force a
   loop and feels like overfitting. Architect may pick re-roll
   at CP1 — flag for playtest balance (a famous Charismatic
   mentor with an Unlikable protege would have a 50% chance to
   "miss" the inheritance entirely).

9. **(Step-2 re-validation audit — AC #19.)** Recommend the audit
   happens during PR3 (this is a clean place to fix it since the
   faction-leader trait grants are touched anyway). If the audit
   finds the guard is correct, no change. If incorrect, a one-
   line `formerLeaderId === winner.id` diff guard is added before
   the Step-2 install grant. Architect confirms at CP1; if the
   architect prefers to keep PR2b's review item in PR2b's
   follow-up, PR3 declines the audit and a tracked nicety
   remains open.

10. **(Assumption — `oldAgeDecayable` pool exhaustiveness.)** The
    recommended pool (AC #7) includes most `POSITIVE_TRAITS`
    minus the structurally-load-bearing four (`Kingmaker`,
    `Ambitious`, `Loyal`, `Opportunist`, `Ideologue`,
    `Impressionable`). The PM judgment-call is that
    `Magician`, `Crisis Manager`, and `Numberfudger` count as
    "advantageous" per the reference's "advantageous ones"
    phrasing — including them. The architect may dial back the
    pool to the marquee five (`Leadership`, `Charismatic`,
    `Orator`, `Crisis Manager`, `Celebrity`) for a more
    conservative decay. Confirm at CP1.

11. **(Assumption — PV swing is acceptable.)** Trait loss swings
    PV by 4–5 per trait; a d6-resolved swap swings by up to 9.
    Across an aging cohort the aggregate is bounded (cap on
    held traits, d6 ratio). PR3 does not pre-compute a cap; the
    human verifies at playtest.

12. **(Assumption — no UI work.)** Trait loss surfaces via the
    existing log feed (`2.4.1` for old-age, `2.7.2` for
    battles, `2.4.2` for anytime conflicts) and the live Roster
    trait column. No new UI, modal, or column.

---

**Spec file:** `/home/user/AMPU/docs/specs/trait-loss-d6-conflict.md`
