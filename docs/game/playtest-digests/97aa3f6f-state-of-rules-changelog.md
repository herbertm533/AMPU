# Digest — "State of the Rules — Development Changes" (topic 97aa3f6f)

- **Slug:** `97aa3f6f-state-of-the-rules-development-changes`
- **Source CSV:** `97aa3f6f-State_of_the_Rules_Development_Changes.csv`
- **Posts:** 6 (1 chunk, ~6.2k chars).
- **Date stamps in-thread:** 10/28/25 (POST 1, edited Oct 29 2025), 12/30/2025
  (POST 4), Mar 8 2026 (POST 5, edited "by ebrk85"); POST 6 quotes POST 5 (Mar 8 2026).
- **Participants:** the **dev/designer team** posting authoritative rule changes —
  **Anthony** (coding the meters; "Arkansas Progressive" is the editor credit on
  POST 1), **MrPotatoTed / "Ted"** (asks for specifics so playtests can adopt them,
  POST 2), **ebrk85** (posts the election-trait rule change from coding, POST 5/6).
- **Type:** **AUTHORITATIVE DESIGNER CHANGELOG.** This is the single most
  load-bearing thread in batch b58. Entries are **rulings already made and
  reflected in the master sheets / coded into elections** — NOT proposals, NOT a
  call for ideas. POST 1: "Changes have been reflected on the Meters master
  sheet." POST 5: "changes that were made in development/coding of the elections."
  Treat every number below as canonical designer intent.
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** It is a designer changelog: three discrete,
> already-landed rule changes with **exact numbers**. These are *rulings*, not
> discussion. Two of them (military preparedness → flat bonus; election
> trait/ability → 50%±1 / 20%×ability) directly contradict or sharpen what the
> shipped browser build does today, and the third (state-movement cap: 4 per
> half-term) defines a relocation rate-limit the build implements with a
> *different unit* (5 attempts per turn). Where other batch threads argue intent,
> this one **sets the canonical formulas** — so the gap log should adopt these
> numbers verbatim and flag the build's divergences as defects-against-spec, not
> open design questions.

---

## ★ Change 1 — Military-Preparedness meter → a FLAT +/- battle bonus (POST 1)

> POST 1: "Anthony has changed how the **Military Preparedness meter** effects
> battle success chance. Instead of using a **random generation of +15, +10 etc**,
> each level now gives a **straight +/- to success chance flat**. Changes have
> been reflected on the Meters master sheet."

**NEW (current) per-level values — flat additive to battle chance-of-success**
(POST 1, listed worst→best meter level; 9 tiers):

| Meter tier (low→high) | Flat battle bonus |
|---|---|
| 1 | **−10** to chance of success |
| 2 | **−5** |
| 3 | **0** (no effect) |
| 4 | **+5** |
| 5 | **+5** |
| 6 | **+10** |
| 7 | **+10** |
| 8 | **+15** |
| 9 | **+20** |

**OLD (replaced) values — a probability distribution over +15/+10/+5/defeat**
(POST 1, for provenance — DO NOT re-implement):

| Meter tier | Old probabilistic effect |
|---|---|
| 1 | 0% of +15; 20% of +10; 40% of +5; **40% immediate defeat** |
| 2 | 10% +15; 20% +10; 50% +5; 20% immediate defeat |
| 3 | 20% +15; 30% +10; 40% +5; 10% immediate defeat |
| 4 | 40% +15; 60% +10; 100% +5 |
| 5 | 40% +15; 50% +10; 10% +5 |
| 6 | 60% +15; 30% +10; 10% +5 |
| 7 | 75% +15; 25% +10 |
| 8 | 80% +15; 20% +10 |
| 9 | 100% +15 |

- The change **removes the "immediate defeat" branch** the old low tiers carried
  and converts the whole table to a deterministic per-tier modifier on the
  to-hit/success roll.
- Note tiers 4 & 5 both = +5 and tiers 6 & 7 both = +10 (the new table is a
  flattened/banded 9-step ladder, not 9 distinct values).

## ★ Change 2 — State-movement (relocation) cap: 4 per half-term (POST 4)

> POST 4 (12/30/2025), in full: "**Factions are limited to FOUR state movements
> (excluding alt-state movements) per half-term.**"

- Unit is **per faction, per half-term** (AMPU's half-term = the 2-year
  election cadence), and counts **state movements** (i.e. *successful*
  relocations / moves), **NOT attempts**.
- **alt-state movements are EXCLUDED** from the count — moving a politician to
  their pre-seeded `altState` does not consume one of the four.
- This is a faction-level rate limit on relocation, layered on top of whatever
  per-politician / per-turn rules already exist.

## ★ Change 3 — Election trait & ability bonus, simplified (POST 5, re-quoted POST 6)

Scope (POST 5): "**For Gov/Sen/Rep, these apply to primaries and general
elections (not pre-primary elections).**"

**NEW rules (canonical):**

| Trigger | NEW effect |
|---|---|
| has **"celebrity"** | **50% chance +1** |
| has **"Military Leader"** | **50% chance +1** (now independent of celebrity) |
| has **"integrity"** | **50% chance +1**; **−1 if** candidate has **"controversial"** |
| has **"charisma"** | **50% chance +1**; **−1 if** candidate has **"uncharismatic"** |
| has **"likable"** | **50% chance +1**; **−1 if** candidate has **"unlikable"** |
| **Gov/Legis ability** | **20% × ability chance of +1** (ability 2 ⇒ 40%; ability 5 ⇒ 100%). **Gov/Sen only — NOT House races.** |

**OLD rules (replaced — for provenance):**
- "+1 for those with **both** 'celebrity' and 'Military Leader'"; "50% chance +1
  for those with **only** 'celebrity'."
- integrity/charisma/likable each gave **50% +1 only IF an opponent had the
  opposite trait** (controversial / uncharismatic / unlikable).
- "50% chance of **the candidate with the highest Gov ability** +1, so long as
  there isn't a tie."

**Designer's own summary of the intent** (POST 5): "This was done to **simplify
how traits are applied**. Basically **50% chance +1 for having one of those
positive traits; 50% chance −1 for a negative one** [now read as: the negative
penalty is tied to the candidate's *own* opposite trait]. **It no longer matters
if your opponent has the opposite trait.** Same thing for Gov or Legis ability —
your opponent's ability doesn't effect your chance of +1 but there is now an
**increasing chance of getting the bonus the stronger your candidate's ability
is**." POST 6: "it really is more intuitive."

Two structural shifts to capture precisely:
1. **Opponent-conditional rows are GONE.** Integrity/charisma/likable now fire on
   the candidate's *own* trait pair (self has integrity → +1; self also has
   controversial → −1). Opponent traits no longer enter the calculation.
2. **The "highest Gov ability" winner-take-one rule is REPLACED** by a per-
   candidate **20% × ability** independent roll on **Gov OR Legis** ability,
   **restricted to Gov/Sen races** (explicitly excluded from House).
3. Side note (POST 5): easier to code, but adds "a whole bunch more rolls" to
   process by hand at the table.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-30)

### Change 1 — Military preparedness → flat battle bonus

**The shipped Revolutionary War battle engine reads NO preparedness meter at all
— neither the old probabilistic table nor the new flat one exists in combat.**

- The `military` NationalMeter **does exist** (`types.ts:1402`, a −5..+5 value in
  `NationalMeters`), and the UI even labels it **"Military Preparedness"**
  (`src/components/Meter.tsx:6`). But that meter is consumed only by *non-combat*
  systems: era-event modifiers (`phaseRunners.ts:2925,2928`), a `milPower`
  display/threshold (`phaseRunners.ts:3602` = `meters.military + general military
  skill`), and a "use the army" gov-action that nudges it (`:3638`). **None of
  these is the Rev War battle resolver.**
- Battle success in `runRevWarBattles` (`src/engine/revolutionaryWar.ts`) is
  computed **purely from commander + SecWar skills + French alliance**, with
  **zero preparedness term**:
  - Naval (`:187-191`): `target = (SecWar.admin + admiral.military) +
    admiral.military*10`; `win = d100() <= target + 30`.
  - Ground (`:212-218`): `baseTarget = planning + general.military*10 +
    (frenchAlliance ? 25 : 0)`; difficulty mod `diffMod` ∈ {−20,0,+15};
    `win = d100() <= baseTarget + diffMod`.
  - There is **no read of `snap.game.meters.military`** anywhere in
    `revolutionaryWar.ts` (grep = 0). The combat "randomness" is the `d100()`
    roll vs target, not the OLD per-tier +15/+10/+5 distribution either.
- **Net:** the designer changelog describes converting an OLD probabilistic
  preparedness→combat table to a NEW flat one; the shipped build has **neither**.
  The preparedness-meter-feeds-combat coupling is **entirely unbuilt**. When it is
  built, it must land in the **NEW flat form** (−10/−5/0/+5/+5/+10/+10/+15/+20),
  applied to the `d100() <= target` margin — i.e. add the tier bonus to `target`
  (equivalently `+bonus` to chance-of-success) at `revolutionaryWar.ts:191` and
  `:218`.

### Change 2 — State-movement cap (4 per half-term, alt excluded)

**A relocation system IS shipped, but its cap is a DIFFERENT unit and a DIFFERENT
semantics than the ruling.** Shipped = **5 ATTEMPTS per faction per TURN**;
ruling = **4 MOVEMENTS (successes) per faction per HALF-TERM, alt excluded.**

- Shipped cap constant: `RELOCATION_ATTEMPTS_PER_TURN = 5` (`types.ts:247`),
  enforced per **faction per year/turn** in `resolveRelocation`
  (`phaseRunners.ts:577`: `if ((counts[p.factionId] ?? 0) >=
  RELOCATION_ATTEMPTS_PER_TURN) return null`). The counter
  (`g.relocationAttempts.counts[factionId]`) is **reset every year**
  (`attemptCounts`, `phaseRunners.ts:534-540`) and **counts attempts, not
  successes** — a failed roll still increments it (`phaseRunners.ts:579`, before
  the success roll at `:584`).
- Relocations run in the **2.1.4 Relocations phase every turn** (`phases.ts:7`;
  the game "rests there every turn", `Relocations.tsx:246`). With the 2-year
  half-term cadence, the shipped allowance over a half-term is up to **~10
  attempts/faction** (5 × 2 turns), vs the ruling's **4 successful movements**.
- **alt-state handling is INVERTED vs the ruling.** The ruling **excludes**
  alt-state moves from the cap. The shipped code gives alt-state moves the
  **highest success odds** (`sameRegionAlt 0.75 / crossRegionAlt 0.4`,
  `types.ts:242`) and **counts them against** the same per-turn attempt cap (the
  resolver does not special-case `altState`; the only alt effect is on odds, and
  it's *consumed* on success at `phaseRunners.ts:588`). There is **no
  alt-exclusion** anywhere.
- There is **no half-term-scoped relocation counter** in `src/` (grep for a
  half-term relocation tally = 0; `halfTermSummary.ts` tracks deaths/retirements,
  not moves). So the **"4 per half-term" cap is unbuilt**; the build instead
  rate-limits by per-turn attempts.
- **Net:** to honor the ruling the build needs (a) a per-faction **success**
  counter scoped to the **half-term** (not per-turn attempts), (b) a max of **4**,
  and (c) **alt-state moves excluded** from that count. This is a re-modeling of
  the existing cap, not a tweak of the `5`.

### Change 3 — Election trait & ability bonus (50%±1 / 20%×ability)

**The shipped `calcStateVote` trait model is structurally different: deterministic
point-magnitudes (not 50% ±1 rolls), it KEEPS opponent-conditional rows the ruling
removes, and it has NO ability-driven term at all.**

- `calcStateVote` (`phaseRunners.ts:3685-3723`) builds each candidate's score as
  `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias +
  traitBonus + (Math.random()-0.5)*8` (`:3709-3711`). `traitBonus` comes from
  `applyTraitElectionBonus` (`src/engine/electionEffects.ts:16-39`).
- **Trait effects are DETERMINISTIC fixed points, not 50%-chance ±1.**
  `applyTraitElectionBonus` adds the rule's `magnitude` whenever the trait is held
  (`electionEffects.ts:28,33-36`) — no probability roll. Magnitudes come from
  `TRAIT_ELECTION_BANDS = { SMALL:2, MEDIUM:4, LARGE:8 }` (`types.ts:721-725`),
  applied per `TRAIT_ELECTION_EFFECTS` (`types.ts:738+`). So e.g. Charismatic in a
  general is a flat **+4** to score, every time — versus the ruling's **50% chance
  of +1**.
- **Opponent-conditional rows STILL EXIST** — the exact thing the ruling removes.
  `applyTraitElectionBonus` swaps to `bumpedMagnitude` when an opponent has a
  listed trait (`electionEffects.ts:29-32`); e.g. Integrity is bumped SMALL→MEDIUM
  vs an opponent who is Scandalous/Controversial/Corrupt (`types.ts:748-758`), and
  Unlikable is bumped vs an opponent Charismatic (`types.ts:794-796`). The ruling:
  "It no longer matters if your opponent has the opposite trait."
- **NO Gov/Legis-ability term in `calcStateVote`.** Grep of the state-vote scorer
  shows no `skills.governing`/`skills.legislative` read; the only place
  `skills.governing` is read near elections is the **CPU governor `bias` nudge**
  (`phaseRunners.ts:3388`) and a separate gov-appointment scorer
  (`phaseRunners.ts:2234`) — neither is the candidate's electoral bonus. The
  ruling's **20% × ability chance of +1** (Gov/Sen only) has **no shipped
  analogue**.
- **Trait-name mapping note:** the ruling's trait labels map to shipped `Trait`
  union members — "charisma"→`Charismatic`, "uncharismatic"→`Uncharismatic`,
  "likable"→`Likable`, "unlikable"→`Unlikable`, "integrity"→`Integrity`,
  "controversial"→`Controversial`, "celebrity"→`Celebrity`, "Military Leader"→a
  command/leadership trait. (Confirm exact union spellings against `types.ts`
  Trait list at consolidation; `Charismatic`/`Unlikable`/`Integrity`/
  `Controversial` are already present in `TRAIT_ELECTION_EFFECTS`.)
- **The `(Math.random()-0.5)*8` die is the SEEDED-RNG offender.**
  `calcStateVote` calls **`Math.random()`** directly (`phaseRunners.ts:3711`),
  breaking determinism — the project rule is seeded RNG only (`rng.ts`). The
  ruling's switch to explicit 50% / 20%×ability **rolls** must use seeded
  `chance(...)`, not `Math.random()`; the current ±8 jitter would likely be
  *replaced* by the new per-trait rolls.
- **Scope mismatch to fix:** the ruling applies to **Gov/Sen/Rep primaries +
  generals, excluding pre-primaries**, and the 20%×ability term is **Gov/Sen
  only**. The shipped `TRAIT_ELECTION_EFFECTS` table is keyed by `context`
  (`presGeneral/presPrimary/house/senatePre17/governor/internalParty`,
  `types.ts:740+`), so the rebuild can target the right contexts — but the band
  values, the probabilistic application, the opponent-row removal, and the new
  ability term are all changes.
- **Net:** Change 3 is a **rewrite of the per-trait/ability electoral model**:
  (a) convert fixed magnitudes → **50% chance ±1** per positive/negative trait;
  (b) **drop opponent-conditional bumps**; (c) **add 20%×(Gov|Legis ability)
  chance of +1** to Gov/Sen only; (d) do it with **seeded `chance`**, replacing
  the `Math.random` jitter; (e) keep scope to primaries+generals, not
  pre-primaries.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned. Existing IDs from the per-task brief; this changelog mostly
SHARPENS existing gaps with canonical numbers rather than opening new ones — flagged
per item.)*

- **SHARPENS #45 / #56 / #85 (war/battle engine — preparedness combat bonus).**
  Canonical NEW formula now captured: preparedness meter → **flat per-tier battle
  modifier** −10/−5/0/+5/+5/+10/+10/+15/+20 (POST 1), replacing the OLD
  +15/+10/+5/immediate-defeat distribution. SHIPPED: `revolutionaryWar.ts`
  battle resolver reads **no preparedness meter** (`:187-218`); the `military`
  meter exists (`types.ts:1402`) but feeds only era-events/gov-action, never
  combat. Requirement: add the flat tier bonus to the `d100() <= target` margin
  at `revolutionaryWar.ts:191`/`:218`. Severity: coupling entirely unbuilt.

- **SHARPENS #38 (relocation cap) — and flags a UNIT/SEMANTICS conflict.**
  Canonical cap = **4 state-movements (successes) per faction per HALF-TERM,
  alt-state EXCLUDED** (POST 4). SHIPPED = **5 ATTEMPTS per faction per TURN**,
  alt **included**, counter reset yearly, counting attempts incl. failures
  (`types.ts:247`, `phaseRunners.ts:534-540,577,579`). Requirement: replace the
  per-turn attempt cap with a half-term **success** counter capped at 4 with
  alt-state excluded. Not a tweak — a re-model. (Consolidation: confirm whether
  #38 already encodes a cap; if it only flags "relocation exists, cap unclear,"
  this supplies the canonical number — treat as SHARPEN, not NEW.)

- **SHARPENS the election-trait scoring model (calcStateVote trait bonus).**
  Canonical NEW model: **50% chance +1 per positive trait, 50% chance −1 per the
  candidate's OWN negative trait, opponent-conditional rows REMOVED** (POST 5/6).
  SHIPPED: deterministic fixed magnitudes (SMALL2/MEDIUM4/LARGE8) with
  opponent-conditional bumps retained (`electionEffects.ts:16-39`, `types.ts:721-
  758`). Requirement: convert to probabilistic ±1 rolls, drop opponent rows,
  scope to primaries+generals (not pre-primary).

- **NEW (consolidation to the trait-scoring gap, or a fresh ID) — Gov/Legis
  ABILITY electoral term.** **20% × (Gov OR Legis ability) chance of +1, Gov/Sen
  ONLY (not House)** (POST 5). SHIPPED: `calcStateVote` reads **no
  governing/legislative ability** at all (no analogue; `phaseRunners.ts:3685-
  3723`). This is a genuinely new scoring input, not a refinement of an existing
  one — flag as NEW if no ability-vote gap exists.

- **SHARPENS / CONFIRMS #287 / #296 (calcStateVote die / seeded RNG).**
  `calcStateVote` uses **`Math.random()`** for its `(Math.random()-0.5)*8`
  jitter (`phaseRunners.ts:3711`) — the known seeded-RNG violation. The Change-3
  rebuild must implement the new 50% / 20%×ability rolls with seeded `chance`
  (`rng.ts`); the `Math.random` jitter is likely superseded entirely. Direct
  corroboration of the existing gap with a concrete line anchor.

- **Context note (no incumbency term — pre-existing gap).** `calcStateVote` still
  has no incumbency term (per brief); this changelog does not add one, but the
  Change-3 rewrite touches the same function, so coordinate the incumbency work
  with the trait/ability rewrite to avoid double-editing `:3709-3711`.

- **Provenance value:** the OLD tables (preparedness distribution POST 1; old
  trait/ability rules POST 5) are recorded above purely so consolidation can tell
  "the build is on a THIRD model" from "the build is on the old model." For
  preparedness the build is on neither; for traits the build is closest to the
  OLD opponent-conditional model but with deterministic points instead of rolls.
