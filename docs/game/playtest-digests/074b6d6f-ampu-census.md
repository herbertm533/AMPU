# Digest — `074b6d6f-ampu-census` ("AMPU Census")

**Type:** SYSTEM-DESIGN + SPREADSHEET-PLAYTEST log (NOT a forum playthrough thread).
**12 posts / 1 chunk** (chunk-001, all 12 covered; source CSV ~6.6 KB). **Sep 2022**
(politicslounge topic 1526). **Authors:** **@vcczar** (tier-1; built the "AMPU Census"
spreadsheet on the Table of Contents) + **@OrangeP47** (the census's champion — *"the
census is my favorite part of the game,"* POST 11; *"As the one who wouldn't shut up
until this feature was in the game, I'm happy,"* POST 4) + MrPotatoTed/"Ted" (tier-1,
the 1920-no-reapportionment exchange).

**★ Headline:** this thread documents the **decennial CENSUS / REAPPORTIONMENT system** —
the engine that recomputes each state's **Electoral Votes + House seats** from a
population model and reshapes the battleground map. **It was RUN AND TESTED** — the 1850
census executed inside the 1840 playtest with concrete totals posted (**EV Total 300,
House Seats 236**, POST 4). **But the test lived in vcczar's SPREADSHEET, not the browser
build.** Code-verified (2026-06-29): **NONE of this ships** — there is no `population`
field, no `houseSeats`, no census/apportionment phase, no EV recompute, and no 435 cap in
`src/`. `State.electoralVotes` is a **static scalar** set once at statehood and never
recomputed. This is a large designed-but-unbuilt subsystem with an unusually concrete,
already-validated ruleset.

---

## ★ The CENSUS / REAPPORTIONMENT system (the designed subsystem)

1. **Decennial trigger → recompute EV + House seats** (POST 1, 2, 4). Every census year
   (1850, 1920, 1860, …) the system **recomputes each state's Electoral Votes and House
   seats** from state population, then redraws the battleground/"state biases" map. POST 1:
   a **2090-census map** of state biases is shared as *"what the battleground map would
   look like at 2092, barring scripted events,"* explicitly flagged as **using 2024 EV
   numbers as a placeholder** ("THIS IS 2024 Electoral Vote #s, so the EVs would be much
   different in 2092").

2. **Probabilistic per-state EV-CHANGE triggers** (POST 4). Apportionment shifts are not
   deterministic: each state has a chance to gain/lose EV on a roll — **"Most chances for
   EV changes are 10% or 25%."** In the 1850 test, **~8–9 EV-change triggers fired, and 2
   succeeded** ("statistically average") — *ironically both for Lower California.* vcczar's
   verdict: **"The rules are fairly realistic and worked."**

3. **The 435 House-seat CAP** is **era-gated** (POST 7, 9). The 435 limit (and the modern
   apportionment law) **dates to 1929** — so it is NOT in force in earlier eras; the House
   size is uncapped/recomputed before then. The 1850 test produced **236 House seats**
   (pre-cap). → reapportionment must know the current era's House-size rule.

4. **Population is the input, fed by INDUSTRY / MANUFACTURING growth + events** (POST 2,
   3, 11). State population (which drives EV/seats) grows via **industries moving** and
   **manufacturing growth**, themselves driven by era events. The model is a coupled chain:
   **industry/manufacturing → state population → EV + House seats.**

## ★ The 1850-in-1840-playtest test results (POST 4 — the validation data)

Full per-state EV with deltas (all "(historical)" unless noted):
`AL 9 (no change)` · `AR 4 (+1)` · `CT 6` · `DE 3` · `FL 3` · `GA 10` · `IA 4 (+1)` ·
`IL 11 (+2)` · `IN 13 (+1)` · `KY 12` · `LA 6` · `MA 13 (+1)` · `MD 8` · `ME 8 (−1)` ·
`MI 6 (+1)` · `MO 9 (+2)` · `MS 7 (+1)` · `NC 10 (−5)` · `NH 5 (−1)` · `NJ 7` ·
`NY 35 (−1)` · `OH 23` · `PA 27 (+1)` · `RI 4` · `SC 8 (−1)` · `TN 12 (−1)` ·
`TX 4 (+1)` · `VA 15 (−2)` · `VT 5 (−1)` · `WI 5 (+2)`. **EV Total 300 · House Seats 236.**

**Ahistorical / alt-state outcomes** (the coupling to prior alt-states/Canada-states work):
- **LC (Lower California) 5 EV** and **UC (Upper California) 3 EV** — **alt-states** (not
  real). Both EV-change triggers that fired in the run fired for Lower California.
- **AZ and NM each took a −2 event modifier, leaving them "technically at 1"** (ahistorical)
  — i.e. an EVENT applied a per-state apportionment modifier on top of the census recompute.

**Manufacturing→population calibration** (POST 11): an **1840 event gave "+2 manufacturing
to every state that can support it."** If *every* roll succeeded → ~35–36M US population by
1860; at the **~25% per-roll success rate**, it projects to **~32.5M** (vs **31.2M IRL**) —
*"an interesting but probably realistic deviation."* (Confirms manufacturing growth is
gated by the same probabilistic rolls and feeds the population model.)

**Florida alt-hist target** (POST 12): preliminary 1856 population figures say FL will have
a **minimum of 6 EV post-1860 census**, with a **12.5% chance of 8 EV** — concrete evidence
the population model produces forward-looking, probabilistic EV projections.

## Real-history calibration captured (POSTs 5–10 — design grounding)

- **1920: census happened, reapportionment FAILED** (vcczar POST 5, corrected POST 8;
  Ted POST 7/9 w/ Wikipedia cite). Congress couldn't agree on how to reapportion the 1920
  results, so **NO seat changes 1920→1930** despite a booming population (POST 10: "shows
  how bad it got between the 1912 and 1922 house elections"). → the system should be able to
  model a **decade where the census runs but apportionment is skipped** (a no-change census).
- The **1929 law** (435 cap + modern method) was passed *"just in time to not have the same
  debacle over the 1930 census"* (POST 7) — the origin of the era-gated 435 cap above.
- **1920 alt-hist hook** (POST 3): *"depending on industries we might have some alt-hist
  electoral college shenanigans"* — the manufacturing→population coupling is meant to produce
  divergent-from-history EV maps in later eras.

---

## Build-vs-design (CODE-VERIFIED — `src/` HEAD 2026-06-29)

**The entire census/reapportionment subsystem is DESIGNED-ONLY. 0% shipped.** Specifics:

- **No `population` field, no `houseSeats` field.** `interface State` (`types.ts:1318-1335`)
  has only `electoralVotes: number`, `bias: number`, `industries: Record<string,number>`,
  `isSlaveState`, `admissionYear` (+ 1772 colony fields). `grep population src/` → ZERO
  game-state hits (one unrelated flavor string in `anytimeNationalEvents.ts:278`). So the
  population model that drives the whole census has **no data home at all.**
- **`electoralVotes` is a STATIC scalar, never recomputed.** It is WRITTEN only at
  statehood: CC-statehood path `s.electoralVotes = Math.max(3, (s.ccDelegateSlots ?? 2) + 1)`
  (`constitutionalConvention.ts:210`); expansion/annexed states are **hardcoded to 4**
  (`expansionStates.ts:178`); territory-conversion seeds `electoralVotes: 0`
  (`phaseRunners.ts:3169`). It is READ only by elections — `calcStateVote` scales turnout
  by it (`phaseRunners.ts:3692`) and the EV tally sums it per winner
  (`phaseRunners.ts:3767-3768`, `:3792`). **`admitState` (`territories.ts`) doesn't even
  touch it.** Nothing ever recomputes EV by population or over time.
- **No census / apportionment / reapportionment / decennial phase.**
  `grep census|apportion|reapportion|decennial src/phases.ts` → ZERO; `PHASE_SEQUENCE` has
  no census step. No `435` constant, no House-size cap anywhere in `src/`.
- **No probabilistic per-state EV-change mechanism.** No code rolls 10%/25% (or any)
  apportionment triggers, and no event applies a per-state EV modifier (the AZ/NM −2 has no
  code path).
- **Industries DO mutate at runtime — but feed METERS, not EV/population.** The lobby→
  industry +1 nudge (`phaseRunners.ts:1638-1656`, PR7) and era-event industry bumps
  (`:1648-1652`) raise `s.industries[key]` by ±1, clamped ≤5. This is the **economy/meter**
  lever (`pv.ts`/meters), with **no link to a population model or to `electoralVotes`.** So
  the manufacturing→population→EV chain (POST 11) is **half-present** (industries change) and
  **half-absent** (the population/EV coupling does not exist).
- **LC/UC are NOT in the registry; AZ/NM are, with static EV.** `expansionStates.ts` has
  **no Lower/Upper California** entries (the POST-4 alt-states are spreadsheet-only). **AZ**
  (line 86) and **NM** (line 95) DO exist but seed `electoralVotes: 4` like every expansion
  state — no per-state EV authoring, no event-modifier mechanism. Confirms the **b50
  finding** that `expansionStates.ts` hardcodes EV=4 vs designs that want per-state /
  smaller values (the POST-4 alt-states want LC 5 / UC 3, and the −2 modifiers imply a base
  EV to subtract from).

**Net:** the spreadsheet has a working, validated census engine (concrete 300 EV / 236
seats output, calibrated to real 1850/1920 history). The browser build has **none of its
inputs or machinery** — only the *output field* (`electoralVotes`) it would write, used
today as a fixed per-state constant.

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs where one fits; flag genuinely new subsystems. Consolidation
owns the gap-log write — do NOT assign new numbers here.)*

- **Apportionment / census-driven EV cluster (existing #34, w/ #55/#219)** — **MAJOR
  CORROBORATE + ENRICH, and the strongest concrete spec to date.** #34 (census-driven
  apportionment) is the right home for the **decennial recompute of EV + House seats from
  population**. NEW, code-grade detail this thread adds: (a) **validated output** — the 1850
  test ran with **EV 300 / House 236** and mostly-historical per-state deltas (POST 4); (b)
  the **probabilistic per-state EV-change trigger** at **10%/25%** odds (POST 4) — an
  explicit mechanism #34 didn't previously specify; (c) the **era-gated 435 House cap (post-
  1929)** + uncapped/recomputed House before then (POST 7, 9); (d) **a decade can run the
  census but SKIP reapportionment** (1920, POST 5-10) — a no-change census mode; (e) FL
  6-EV-min / 12.5%-of-8 projection (POST 12). **Code status: 0% shipped** — no census phase,
  no recompute, no 435, `electoralVotes` static (verified above).
- **State POPULATION model (likely NEW — no clean existing gap owns it).** The census's
  input is a **per-state population number** that grows over time; **`State` has no
  `population` field and `src/` has no population model at all.** This is the missing data
  primitive under #34. Flag as a distinct requirement (population state + its growth
  function) feeding apportionment. POST 2, 3, 11.
- **Manufacturing/industry → population coupling (attaches to industry model, #294;
  bridges to #34).** State population is driven by **industry moving + manufacturing growth
  + events** (POST 11: +2-manufacturing-to-all-eligible event, ~25% roll). Industries
  ALREADY mutate in code (PR7 lobby nudge / era bumps, `phaseRunners.ts:1638-1656`) but feed
  **meters only, not population/EV.** Requirement: route industry/manufacturing level into
  the population model. Cross-refs #294 (industry-eligibility — "states that can support
  manufacturing" is exactly the eligibility gate) and the meter/economy systems. POST 11, 3.
- **`expansionStates.ts` per-state EV (EXISTING gap — confirms b50).** Hardcoded
  `electoralVotes: 4` for all expansion states (`:178`); the design wants **per-state EV**
  (POST 4 alt-states: LC 5, UC 3) and a **base EV to apply event modifiers against** (AZ/NM
  −2). Corroborates the b50 "expansionStates EV=4 vs design wanting smaller/per-state"
  delta. Also: **LC/UC alt-states are absent from the registry** entirely (spreadsheet-only).
  POST 4.
- **Per-state EV/apportionment EVENT MODIFIER (NEW; couples to #34 + era-events).** Events
  apply a **±N modifier to a state's census result** (AZ/NM −2 → "technically at 1," POST 4;
  the 1920 skip is the inverse). No code path exists for an event to alter EV. POST 4, 11, 3.

### Provenance notes
- Single chunk; all 12 posts read. **Spreadsheet-playtest + design log, not a forum
  playthrough** — the "1850 census in the 1840 game" (POST 4) was run in vcczar's AMPU
  Census spreadsheet, NOT the browser build. Load-bearing posts: **POST 4** (the validated
  ruleset + results + alt-states), **POST 11** (manufacturing→population coupling + roll
  odds), **POST 7/9** (435 cap origin + 1920 reapportionment skip). OrangeP47 is the feature
  champion (POSTs 4, 5, 11, 12); vcczar built the spreadsheet (POST 1); Ted supplied the
  1920 history (POST 7).
- Codebase verified at `src/` HEAD 2026-06-29: `State` type `types.ts:1318-1335` (no
  `population`/`houseSeats`); EV written only at statehood (`constitutionalConvention.ts:210`,
  `expansionStates.ts:178`, `phaseRunners.ts:3169`) and read only in elections
  (`phaseRunners.ts:3692`, `:3767-3768`, `:3792`); no census/apportionment in `phases.ts`;
  `grep 435|apportion|reapportion|decennial|population src/` → no game-state hits; industry
  mutation `phaseRunners.ts:1638-1656` feeds meters only; AZ/NM in `expansionStates.ts:86,95`
  at static EV=4; LC/UC absent from the registry.
