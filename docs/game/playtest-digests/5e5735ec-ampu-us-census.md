# Digest — `5e5735ec-ampu-us-census` ("AMPU US Census")

**Type:** RULESET POST (the canonical census/apportionment spec, "rules 3.0.24").
**5 posts / 1 chunk** (chunk-001, all 5 covered; source CSV ~5.9 KB). **Apr 2022**
(politicslounge topic 1275). **Author:** **@vcczar** (POST 1 — typed the full ruleset into
"rules 3.0"); POSTs 2–5 are players cheering (@OrangeP47-style: *"low key the number 1
feature I wanted,"* POST 2; *"Statisticians rejoice for we have population data!"* POST 3;
*"I thought we'd have to wait for AMPU 2 for this,"* POST 4) + one QA note (POST 5).

**★ Headline:** this is the **deep spec** behind the census/reapportionment subsystem that
`074b6d6f-ampu-census` (Sep 2022) later *ran and validated* in a spreadsheet. Where that
digest captured the *outputs* (EV 300 / House 236 / probabilistic 10%–25% triggers) and the
era-gated 435 cap, **this thread is the actual ALGORITHM, in order** — the 5-step EV
recompute, the House-cap reconciliation, the Big/Medium/Small state classification, the
"influential Rep" delegation model, and the per-Rep voting-power formula. **This is the
single most concrete written ruleset for #34/#305 in the corpus.** Code-verified
(2026-06-29): **NONE of it ships** — no census/apportionment phase, no House-cap constant, no
state-size concept, no influential-Rep / delegation-voting-power model, no `population` or
`houseSeats` field. `State.electoralVotes` remains a **static scalar** written once at
statehood. (Confirms + sharpens the `074b6d6f` finding with file:line below.)

---

## ★ The CENSUS RULESET — rules 3.0.24 (POST 1, transcribed)

**Activation & cadence:** the census is **automatically in play once the US Constitution is
adopted**, and it **alters the electoral map + the US Reps** for election cycles
**1790–1792, 1800–1802, 1810–1812, …** — i.e. a **decennial, presidential-term-anchored**
cadence (the change lands at the election under the new census). [So the trigger is gated on
Constitution adoption, not era; before adoption there is no census.]

### EV recompute — 5 steps, applied IN ORDER (POST 1)

1. **HISTORICAL census changes.** Add the +/- that *historically* occurred to whatever each
   state's EVs are currently at. (Baseline = real apportionment deltas.)
2. **SCRIPTED-EVENT adjustments.** Apply EV adjustments from scripted events. **"Indian
   Removal" is the primary scripted event affecting state growth.**
3. **INDUSTRY-SHIFT adjustments.** Apply EV adjustments for industry changes, each as a
   probabilistic roll resolved *at the next election under the new census* (table below).
4. **LEGIS-PROP adjustments.** Apply EV adjustments from legislative props. *"The US
   Constitutional Convention might start off with some major adjustments because of the
   slavery question."* (Legislation can shift a state's EV.)
5. **SUM + FLOOR.** Add up total EVs for every state, **ensuring no state falls below 3 EVs.**

**Step 3 — industry-shift EV probabilities (exact, POST 1):**

| Trigger (observed over the window) | Effect | Chance |
|---|---|---|
| Industry **improved 2×** within 10 years | **+1 EV** | **25%** |
| State becomes the **new leader** in an industry | **+1 EV** | **25%** |
| State's **primary industry changes** to a new industry | **+1 EV** | **10%** |
| State industry **decreased 2×** within 10 years | **−1 EV** | **25%** |
| State **replaced as leader** in an industry | **−1 EV** | **25%** |

*(These are the same "most chances are 10% or 25%" rolls `074b6d6f` POST 4 saw fire ~8–9×
with 2 successes — this thread is where those odds are defined per-trigger.)*

### House-Cap reconciliation (POST 1) — run AFTER the 5-step sum

- **If no House cap exists → SKIP this step entirely.** (Pre-1929 eras; matches `074b6d6f`
  POST 7/9 era-gated 435 cap.)
- **If a cap exists:** compare your computed EV total to **`House Cap + (number of states × 2)`**
  (the ×2 = each state's 2 US Senators). **EXCLUDE the EVs of DC, the Moon, and Mars** from
  this comparison. Get into compliance by **randomly adding/subtracting EVs**, under two
  constraints:
  - **No state loses or gains 2× as many EVs as any other state** in this process.
  - **No state may fall below 3 EVs** when done.
- **QA caveat (POST 5):** *"might want to double check the cap/formula legis that it doesn't
  'undo' gains/losses when implemented"* — reconciliation must not silently cancel the
  step-1–4 deltas. (Open edge-case the author flagged.)

### State-size classification (POST 1) — derived from FINAL EVs

- **Big:** EV **≥ 15**. *Quota:* if Big states are **< 10% of all states**, promote the
  next-largest states to Big **until 10% is reached.**
- **Small:** EV **≤ 4**. *Quota:* if Small states are **< 10% of all states**, demote the
  next-smallest states to Small **until 10% is reached.**
- **Medium:** everything not Big or Small.

### US House size → "influential Reps" per state (POST 1) — the House ABSTRACTION

The number of **playable/"influential" US Reps** is set by state size:

| State size | Influential Reps |
|---|---|
| **Big** | **3** |
| **Medium** | **2** |
| **Small** | **1** |

These influential Reps **face election and represent the state's delegation.** [Key design
move: the game does **not** model all 435 House members — it abstracts each state's House
delegation down to **1–3 elected "influential Reps"** who carry the delegation's full vote.]

**Ahistorical-seat deviation (POST 1):** historical eras decide whether a delegation's seats
deviate from the **state bias**. If a state has an *ahistorical* population (one more or one
fewer influential Rep than in history):
- **Adding** an ahistorical seat → **25% state-bias / 25% tossup / 25% Red +1 / 25% Blue +1.**
- **Subtracting** a seat → remove one **at random, BUT one seat must retain the state bias.**
  Example given: between AZ's "Red +1" bias seat and a "Blue +2" deviant seat, **the deviant
  seat is removed** (a deviant seat goes before the bias seat).

### Influential-Rep voting power (POST 1) — the delegation-vote formula

- A state's **total US Reps = its EV − 2** (subtract the 2 Senators). *(Matches the comment
  already in `scenario1856.ts:93`.)*
- Divide those total Reps among the influential Reps: **÷3 if Big, ÷2 if Medium, ×1 if Small.**
- Round so the math sums correctly; **leftover votes go to the delegation's highest-`legis`
  Rep (randomized if tied).**
- **Worked example (POST 1):** CA with **55 EV → 53 US Reps**, **3 influential Reps** →
  53/3 = **17.7 each**. Give each **17** → 51; the **2 leftover** votes go to the highest-legis
  Rep in the delegation. (So influential Reps carry **unequal** vote weights.)

---

## Build-vs-design (CODE-VERIFIED — `src/` HEAD 2026-06-29)

**The entire 3.0.24 ruleset is DESIGNED-ONLY. 0% shipped.** Confirms `074b6d6f` and adds
precise file:line for the new pieces:

- **No census/apportionment phase, no decennial cadence.** `PHASE_SEQUENCE`
  (`phases.ts:3-47`) has no census/apportionment/reapportionment step; `grep -i
  census|apportion|reapportion|decennial src/` → **ZERO**. `isPresidentialYear` exists
  (`phases.ts:53`, `year % 4 === 0`) but nothing anchors a 1790/1800/1810 census trigger, and
  there is no "Constitution adopted ⇒ census on" hook.
- **No House-cap constant, no state-size concept, no influential-Rep model.** `grep -i
  houseCap|houseSeats|influentialRep|stateSize|\b435\b src/` → **ZERO**. `State`
  (`types.ts:1318-1335`) has `electoralVotes`, `bias`, `industries`, `isSlaveState`,
  `admissionYear` (+1772 colony fields) — **no `population`, no `houseSeats`, no size class,
  no per-Rep voting weight.** So neither the Big/Med/Small classification, the
  delegation-voting-power model, nor the House cap has any data home.
- **`electoralVotes` is STATIC, never recomputed.** Written only at statehood —
  `constitutionalConvention.ts:210` (`Math.max(3, (ccDelegateSlots ?? 2) + 1)`),
  `expansionStates.ts:178` (hardcoded **4**), `phaseRunners.ts:3169` (territory conversion
  seeds **0**). Read only by elections — turnout scale `phaseRunners.ts:3692`, EV tally
  `phaseRunners.ts:3767-3768`. `admitState` (`territories.ts`) never touches it. **Nothing
  recomputes EV by population, industry, or time.**
- **The "EV − 2" Rep formula PARTIALLY exists — but as one-time seeding, not the abstraction.**
  `scenario1856.ts:93`: `const reps = Math.max(1, s.electoralVotes - 2); // EVs = reps + 2
  senators` — the **same arithmetic** the ruleset specifies for total Reps. BUT it is used at
  scenario start to fill `s.representativeIds` with **one politician per seat** (e.g. ~33 Reps
  for a 35-EV NY), the **opposite** of the design's abstraction to **1–3 influential Reps with
  divided/weighted votes**. No delegation-voting-power math, no leftover-to-highest-legis
  tiebreak, no recompute on later censuses. So the formula is *recognized in a comment* but the
  influential-Rep system is **absent**.
- **Industries mutate at runtime → meters only, NOT EV.** Era-event/lobby industry bumps
  (`phaseRunners.ts:1648-1650`) raise `s.industries[key]` by +1 (clamp ≤5). **No code reads
  industry to roll a 25%/10% EV change** — Step 3 of the recompute has no implementation, and
  there is no "improved 2× in 10yr" / "leader change" tracking. The industry→EV coupling is
  **half-present** (industries change) / **half-absent** (no EV link), exactly as `074b6d6f`
  found.
- **No scripted-event or legis-prop EV modifier path.** No event applies ±N EV (Indian
  Removal, the CC slavery adjustment, AZ/NM −2 from `074b6d6f`) — Steps 2 & 4 are unbuilt.
- **`expansionStates.ts` hardcodes EV = 4 for ALL expansion states** (`:178`) — no per-state
  EV, no base for a census to grow from or events to subtract from. (Confirms b50 + `074b6d6f`.)

**Net:** the browser build owns the **output field** (`electoralVotes`) as a fixed constant
and *names* the EV−2 formula in a seeding comment, but ships **none** of the 3.0.24 machinery
— recompute steps, House-cap reconciliation, state-size classification, influential-Rep
delegation model, or the population/industry inputs that drive them.

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs where one fits; flag genuinely new subsystems. Consolidation owns
the gap-log write — do NOT assign new numbers here.)*

- **★ Census-driven EV + decennial apportionment (SHARPENS #34 — headline).** This thread is
  the **full ordered algorithm** behind #34: Constitution-triggered, decennial
  (1790/1800/1810…) **5-step EV recompute** (historical → scripted-event → industry → legis-prop
  → sum w/ **≥3 EV floor**) + **House-cap reconciliation** + state-size + influential-Rep
  output. Code: **0% shipped** — no census phase, no recompute, no cap, EV static
  (`phases.ts:3-47`; `expansionStates.ts:178`; `constitutionalConvention.ts:210`).
- **State-population model + per-state EV event modifier (SHARPENS #305).** Census input is a
  per-state population; **Steps 2 & 4** apply scripted-event / legis-prop **±N EV modifiers**
  (Indian Removal, CC slavery question). `State` has **no `population` field** and **no
  event→EV path** (`types.ts:1318-1335`). Provides the modifier *sources* #305 wanted.
- **Industry-shift → EV coupling WITH EXACT %s (SHARPENS #294).** Step 3's full probability
  table: improved-2×/10yr **25% +1**, new leader **25% +1**, primary-industry change **10%
  +1**, decreased-2×/10yr **25% −1**, lost-leader **25% −1**. Industries already mutate
  (`phaseRunners.ts:1648-1650`) but feed **meters, not EV**. Adds the exact odds + the
  "2×-in-10yr" / "leader-change" tracking #294 needs.
- **Big/Medium/Small state-size classification (SHARPENS #293 or NEW state-size gap).**
  EV-derived size with **10% floors** (Big ≥15, Small ≤4, promote/demote to hit 10% quotas).
  **No size concept in code** (`grep stateSize` → 0). Drives House size + (likely) AI/UI
  targeting — confirm whether #293 owns it or it's new.
- **★ Influential-Rep DELEGATION-VOTING-POWER model (genuinely NEW).** Abstract each state's
  House delegation to **1/2/3 elected "influential Reps"** (by size) carrying the **full
  delegation vote**, weight = (EV−2)÷count with **leftover → highest-legis Rep**. CA 53→3 reps
  @17/17/17+2. **Not in code** — `scenario1856.ts:93` seeds one Rep *per seat* (no abstraction,
  no weighting). This is a distinct House-representation subsystem, not just apportionment.
- **★ House-Cap reconciliation algorithm (genuinely NEW).** When a cap exists: reconcile
  computed EV to **`Cap + states×2`**, **excluding DC/Moon/Mars**, by random add/subtract under
  **"no state changes 2× another's"** + **≥3 floor**; **skip entirely if no cap**. Plus POST-5
  QA: ensure reconciliation **doesn't undo** the step-1–4 deltas. No cap or reconciliation in
  code.
- **★ Ahistorical-seat bias rules (genuinely NEW; sub-rule of the influential-Rep model).**
  Add a seat → **25% bias / 25% tossup / 25% Red+1 / 25% Blue+1**; subtract → random but the
  **bias seat is protected** (deviant seats removed first). No code path (seats aren't
  bias-typed today).

### Provenance notes
- Single chunk; all 5 posts read. **POST 1 is the entire ruleset** (vcczar, rules 3.0.24) —
  load-bearing; POSTs 2–4 are player enthusiasm (confirms the census was the #1-requested
  feature, corroborating `074b6d6f` OrangeP47 framing); **POST 5** is the lone QA note (cap
  reconciliation must not undo gains/losses).
- This thread (**Apr 2022**) PRECEDES the `074b6d6f` spreadsheet validation (**Sep 2022**) —
  it is the *spec*; `074b6d6f` is the *run + results*. Read together: 3.0.24 = algorithm,
  `074b6d6f` = validated outputs (EV 300 / House 236, era-gated 435 cap, 1920 no-reapportion
  case, LC/UC alt-states, AZ/NM −2 modifier).
- Codebase verified at `src/` HEAD 2026-06-29: `State` `types.ts:1318-1335` (no
  `population`/`houseSeats`/size/weight); `PHASE_SEQUENCE` `phases.ts:3-47` (no census step);
  EV written only at statehood (`constitutionalConvention.ts:210`, `expansionStates.ts:178`,
  `phaseRunners.ts:3169`), read only in elections (`phaseRunners.ts:3692`, `:3767-3768`);
  industry mutation `phaseRunners.ts:1648-1650` feeds meters only; EV−2 Rep formula appears as
  seeding comment `scenario1856.ts:93`; `grep -i census|apportion|reapportion|decennial|
  houseCap|houseSeats|influentialRep|stateSize|435 src/` → no hits.
