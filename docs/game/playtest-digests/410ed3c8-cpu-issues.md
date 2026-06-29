# Digest — `410ed3c8-cpu-issues` ("CPU Issues")

**Type:** RULES-RECONCILIATION Q&A thread (politicslounge topic 5344, **Apr 2024**).
**NOT a playthrough** — **@Bushwa777**, mid solo CPU-rules playtest, surfaces
**CONTRADICTIONS between rule sources** and asks for adjudication; **@matthewyoung123**
(rules-keeper, maintainer of the public preferred-state-ideology maps) co-resolves.
**5 posts / 1 chunk** (chunk-001, all 5 covered; source CSV ~3.8 KB).

**★ Meta-theme (POST 1, the load-bearing complaint):** *"As I go through doing my
playtest I keep finding issues with the CPU rules and the rules that you have all told
me. **We need to have one set of rules.**"* → the canonical-rules-reconciliation concern:
the manual CPU spec the community plays from has internal contradictions and drifts from
oral lore. Ties the **deterministic-CPU** work (#20/#74) and the authoritative-rules-doc
effort — every rule below is a candidate spec line for that one canonical doc.

> **DIGEST-ONLY** — touches no living doc (no `game-context.md` / gap-log edit). All
> rules below are **community-adjudicated manual CPU rules** (how the *forum* CPU is
> meant to behave), NOT designer-ratified engine spec. Code-verified vs `src/` HEAD
> 2026-06-29; the shipped engine diverges substantially (see Build-vs-design).

---

## Two contradictions raised, both RESOLVED in-thread

### 1. Draft tiebreak vs. "don't draft non-states" (POSTs 1–2) — RESOLVED
- **The apparent contradiction (POST 1):** Bushwa was told *"we do not draft those who
  are not from states that do not exist in union yet,"* BUT the written rule says: *"When
  there are multiple rookie options tied for the highest skill, choose the politician
  **whose home state is not admitted into the union yet**, when possible."* Unsatisfiable
  if no such draftees exist.
- **★ RESOLUTION (POST 2):** *"**You can draft politicians from territories.**"* →
  **territory-origin DRAFTEES exist and are draftable** — a rookie's home state may be an
  unadmitted territory, which is exactly what makes the tiebreak satisfiable.
- **The canonical tiebreak rule:** among rookies **tied for highest skill**, prefer the
  one whose **home state is not yet admitted** to the union (when possible).
- **★ Distinction vs. last batch's REJECTED gap #313:** **territory-origin POLITICIANS
  (draftable) ≠ territorial OFFICES (delegate / territorial-governor positions, the #313
  rejected thing).** A draftee *from* a territory is fine; electable *offices* in
  territories are the rejected concept. Keep these separate in the gap log.

### 2. CPU Movement (ideology-shift) — "3 vs. 5" contradiction (POSTs 3–5) — RESOLVED
The written **CPU Movement** rule (POST 3, verbatim) reads:
- *"There is a **20% chance the CPU will attempt to shift three** of their politicians
  towards:"*
  - **60%** toward the **preferred ideology of the politician's STATE**, provided the
    shift can be made **in one shift**. [Bushwa note: *"AB have to set Geo Ideologies"*]
  - **40%** toward the ideology that has the **highest ENTHUSIASM in their PARTY**,
    provided the shift can be made in one shift. [Bushwa: *"not certain how highest
    enthusiasm Ideology in Party is determined"*]
- *"They will shift **no more than 5** politicians per phase, chosen randomly among those
  who can make the move in one shift. The CPU will always try to avoid the **'two-faced'
  penalty**."* → **"So is it 3 or is it 5?"**

**★ RESOLUTION (POST 4, Bushwa quoting the adjudication + POST 5, matthewyoung123):**
- **Mechanic:** **Roll a D-100 three times. Each roll ≤ 20 → randomly select one eligible
  politician to move**, following the 60/40 guidance. (So "20% chance to shift three" =
  three independent 20% draws, **0–3 moves** per phase, not a single 20% gate on a fixed
  three.)
- **Canonical count = 3, NOT 5.** *"I don't know what the 5 pols per phase is, but I
  always just stick with 3."* (Bushwa) → matthewyoung123: *"I think it's a **holdover from
  when the limit was higher and was not changed when player limits got updated**."* The
  "≤5 per phase" line is a **STALE rule fragment** — canonical is the 3 D100 rolls.
- **Eligibility:** only politicians who can reach the target **in one shift** (one step);
  **always avoid the two-faced penalty** (never move a pol the move would flip-flop).

**★ Supporting-data mechanics (POSTs 4–5):**
- **"Geo Ideologies" / preferred STATE ideology** (the 60% target): each state has a
  **most-preferred AND least-preferred ideology** (both **+** and **−**). *"Preferred state
  ideologies are listed on the **Gov tabs**, and elsewhere."* matthewyoung123 maintains
  **two public maps** (most-preferred and least-preferred). Bushwa flags these **still
  need to be authoritatively set** ("AB have to set Geo Ideologies").
- **"Highest-enthusiasm ideology in a party"** (the 40% target): read the **meter page** —
  *"the meter that is **most away from the center** for both the **Reds and the Blues**."*
  The party's furthest-from-center enthusiasm meter names that party's highest-enthusiasm
  ideology.

---

## Build-vs-design (CODE-VERIFIED — `src/` HEAD 2026-06-29)

**A CPU ideology-shift system DOES ship (`runPhase_2_1_5`, phase `2.1.5`), but its rules
DIVERGE sharply from this thread's canonical CPU-Movement spec on almost every axis.**

**Shifts (active, CPU + player) — `resolveIdeologyShift` (`phaseRunners.ts:767-809`),
CPU pass `:845-884`, odds `IDEOLOGY_SHIFT_ODDS` (`types.ts:253-263`):**
- **Target = FACTION CENTER, not state-preferred (60%) / party-highest-enthusiasm (40%).**
  Every shift steps **one toward the actor faction's mean-ideology center**
  (`factionCenter`, `phaseRunners.ts:704-718`; step `ideologyShiftOdds:746-754`). There is
  **NO 60/40 split, NO state-preferred-ideology target, NO party-enthusiasm target** in
  any active shift path. **Hard divergence.**
- **Odds ≠ 20%-via-D100×3.** Self-shift gate **30%** per candidate
  (`cpu.selfGate:0.3`), success **65%** (`attempt.self:0.65`); opposed (rival-roster)
  gate **10%**, success **15%**. Budgets: `cpu.selfBudget:3` self-moves/faction +
  `opposedScan:10` rival scan, capped by **`IDEOLOGY_ATTEMPTS_PER_TURN = 5`/faction**
  (`types.ts:263`). The shipped cap is thus **5**, NOT the canonical **3** — i.e. the
  build encodes the *stale* number the thread rejected, by coincidence of structure.
- **Two-faced avoidance: NOT modeled as avoidance.** The opposed path can *inflict* a
  flip-flopper stack on the **victim** on success (`ffRisk:0.5`, `phaseRunners.ts:790-792`;
  trait `'Two-Faced'`, `types.ts:99,162`). The CPU does **not** "avoid the two-faced
  penalty" — the design has no self-avoidance gate; it has an offensive flip-flop *attack*.
  Different concept entirely.

**Passive drift (separate from shifts) — `phaseRunners.ts:886-930`:** *"up to three
rolls, at most one move; first success ends the chain"* — this is the **closest structural
analog** to the canonical "D100 ×3, one move each" idea, BUT: it's **passive per-politician
drift** (every living pol), not the CPU "shift 3 of YOUR pols" action; rates are
**8% faction / 4% state-bias / 1% residual** (`drift` block, `types.ts:254`), not 20%; and
its targets are **faction center** (8%) and **state `bias` SIGN** (4%, only where
`|bias| ≥ 1`), **not** a named preferred ideology.

**"Geo Ideologies" / preferred-state-ideology data layer — ABSENT.** `grep` for
`preferredIdeology|leastPreferred|mostPreferred|geoIdeolog|stateIdeology` across `src/`
→ **ZERO matches.** `interface State` (`types.ts:1318-1335`) carries only **`bias:
number`** — a single scalar lean (positive = red), no most/least-preferred ideology pair.
Drift's state pull reads only `bias` sign (`phaseRunners.ts:903-906`). The thread's
**both-poles (+ and −) per-state preferred-ideology maps have no data home in the build.**

**Enthusiasm model — exists, but NOT wired to ideology shifts.** `interface Enthusiasm`
(`types.ts:1415`), `game.enthusiasm[ideology][party]` (`scenario*.ts buildEnthusiasm`),
read by **elections** (`calcStateVote`, `phaseRunners.ts:3696,3709`) and the
**EnthusiasmPage** meter UI — but **no shift/drift path consults it** to pick a target.
The canonical 40%-toward-highest-party-enthusiasm rule is **un-built**.

**Draft tiebreak (rookie skill-tie → prefer unadmitted home state) — NOT implemented.**
CPU draft pick `pickBestForFaction` (`phaseRunners.ts:33-53`) scores **`pvCache` + ideo-
match bonuses** and sorts; there is **no skill-tie tiebreak and no admitted-state check**
anywhere in the draft. Draftees DO carry a `state` that may be unadmitted (the dataset is
historical figures; `state` is retained at draft, `recordDraftPick:55-75`), so
**territory-origin draftees implicitly exist** (POST 2's premise holds), but the
**"prefer-unadmitted-home-state on a highest-skill tie" rule is absent.**

**Net:** the build ships an ideology-shift/drift subsystem that **resolves toward faction
center on different odds** than the manual CPU-Movement rule — it implements **none** of
(state-preferred 60%, party-enthusiasm 40%, D100×3-at-20%, the canonical-3 count, the
"avoid two-faced" self-gate, the Geo-Ideology data layer, the skill-tie draft tiebreak).
This is the **canonical-rules-reconciliation** delta: forum-CPU spec vs shipped-CPU
behavior need reconciling into one source of truth.

---

## Open questions (for the human / consolidation — not answerable mid-run)

1. **Which CPU-Movement spec is canonical going forward** — the forum's
   state-preferred(60)/party-enthusiasm(40) + D100×3@20% + count-3, or the shipped
   faction-center model? This thread says "we need ONE set of rules"; the build silently
   chose a different one. (#20/#74)
2. **Geo-Ideologies data:** adopt a per-state **most- AND least-preferred ideology** pair
   (the matthewyoung123 maps) as a first-class `State` field, or keep the single `bias`
   scalar? The 60%-target rule requires the named pair. (#247)
3. **"Avoid two-faced":** should the CPU gain a **self-avoidance** gate (never move a pol
   the move would flip-flop), replacing/augmenting the current offensive flip-flop attack?
4. **Draft tiebreak:** implement the highest-skill-tie → unadmitted-home-state preference
   in `pickBestForFaction`? (Currently no skill-tie tiebreak at all.)
5. **Stale-rule audit:** the "≤5 per phase" holdover shows the manual lags "player limit"
   changes — what *is* the current canonical player movement limit, and does it equal 3?

---

## ★ Deltas vs. current build (the hand-off list)

1. **Canonical CPU ideology-shift (Movement) rule spec — NEW spec, ATTACHES to the
   shipped shift/drift system + #20/#74.** Forum-canonical: **20%-via-D100×3** (3 indep.
   draws, 0–3 moves), target **60% state-preferred / 40% party-highest-enthusiasm**, **one
   step only**, **avoid two-faced**, **count = 3**. Shipped `2.1.5` instead steps toward
   **faction center** at 30%/65% (self) & 10%/15% (opposed), cap **5**, with an
   *offensive* flip-flop attack. **Behavioral divergence on every axis.** (extends #20/#74
   + the ideology-shift/drift system)
2. **Stale "5 vs 3" reconciliation — NEW.** matthewyoung123: the "≤5/phase" is a holdover
   from a higher old player limit; canonical = **3**. The build's `IDEOLOGY_ATTEMPTS_PER_TURN
   = 5` (`types.ts:263`) coincidentally encodes the *rejected* number. Requirement:
   reconcile the count to canonical 3 (or ratify 5 deliberately). (new)
3. **Geo-Ideology / per-state preferred-ideology data layer — NEW, ATTACHES to #247.**
   Design wants a per-state **most- + least-preferred ideology** pair (public maps, on Gov
   tabs). Build has **only `bias: number`** (`types.ts:1324`); `grep preferredIdeology|geoIdeolog`
   → 0. No data home for the 60%-shift target or the +/− maps. (extends #247
   state-preferred-ideology/lean)
4. **Enthusiasm→shift wiring — NEW (sub-delta of #1).** "Highest-enthusiasm ideology in a
   party" = furthest-from-center meter (per Reds/Blues). Enthusiasm exists
   (`types.ts:1415`, used in elections) but **no shift path reads it**; the 40% target is
   un-built. (extends #20/#74)
5. **Draft skill-tie → unadmitted-home-state tiebreak — NEW.** Canonical: on a highest-
   skill tie, prefer a rookie whose home state isn't yet admitted. `pickBestForFaction`
   (`phaseRunners.ts:33-53`) has **no skill-tie tiebreak / admitted-state check**. (new)
6. **Territory-origin draftees CONFIRMED draftable — clarifies/limits #313.** Draftees may
   come *from* unadmitted territories (their `state` is retained, no admitted-state filter
   on the draft). **Distinct from the REJECTED territorial-OFFICES gap #313** —
   territory-origin POLITICIANS are in scope; territorial delegate/governor OFFICES are
   not. (annotation on #313)
7. **Meta: canonical-rules-reconciliation — NEW cross-cutting.** Thread's thesis (*"we need
   one set of rules"*) + the demonstrated drift between manual CPU spec and shipped engine
   = the authoritative-rules-doc / deterministic-CPU concern. Every delta above is a spec
   line for that one canonical doc. (#20/#74)

**All rules above are community-adjudicated MANUAL CPU rules (how the forum CPU is meant to
play), NOT designer-ratified engine spec. The shipped `2.1.5` engine implements a different
ruleset; consolidation owns reconciling them.**

---

*Digest line count: see `wc -l docs/game/playtest-digests/410ed3c8-cpu-issues.md`.*
