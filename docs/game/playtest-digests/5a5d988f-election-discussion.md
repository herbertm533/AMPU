# Digest — `5a5d988f-election-discussion` ("Election discussion")

**Type:** DESIGN / RULES-REVIEW thread (NOT a played-forward game). @MrPotatoTed-led
open review of the **election rules**, with a deliberate focus on **House elections** under
the focus-Rep / seat model. 31 posts, 1 chunk (chunk-001.md, all 31 covered). Apr 2022,
contemporaneous with the 1960-start playtest ("we haven't needed primary rules yet in the
olden-days playthrough"). Designers present: MrPotatoTed (lead), vcczar (deferred — "no
time, just gathering ideas for the election-rules doc"), plus players OrangeP47, Rezi,
10centjimmy, jvikings1, themiddlepolitical, Willthescout7, Cal.
**Net:** sharpens **#219 / #55 / #191** (House focus-Rep model, seat competition, per-seat
deviant bias). The headline House-seat-competition question is **raised and informally
dispositioned but NOT finalized by vcczar** — it remains an open design fork. This thread is
the **DESIGN-ORIGIN** of that question; #219 (`summer2021`) later records the resolved EV
ladder, but the *seat-competition shape* below is the piece that #219/#55 leave open.

---

## The House model as confirmed here (corroborates #219 / #55)
- AMPU does NOT model all 435 House seats. Each state runs **the 1–3 most important
  Reps/races** ("focus Reps"), seat count scaled by population (POST 1, 8). Corroborates
  **#219** (focus-reps KEPT) and **#55** (shipped flat `representativeIds`).
- Target balance (Ted, POST 26): **1–3 Reps/state, averaging ~2**, → a **~100-seat House**
  at a full 50 states (more on a conquest spree). This is a NEW explicit balance target
  number for the House size (sharpens #219).
- **Seats are NOT geographic districts** (POST 5/15/16): "they're not literally districts…
  Bill Clinton could be AR-1 and Hillary AR-2 despite living in the same house." Geography
  is deliberately abstracted away. Real-life relocations are modeled instead via
  **alternate states** on the politician (POST 8: Hillary = NY/IL/AR; Abigail Adams stays MA).
  This confirms the design intent behind the shipped per-pol home/alternate-state model and
  the absence of any congressional-district geography layer.

## ★ The House-seat-competition question (DESIGN-ORIGIN; sharpens #219/#55/#191)
The core question (POST 1, 7, 14). Under focus-Reps, a state with multiple important seats
runs them as **separate, independent races** (GA-1 vs GA-2). A GA-1 candidate **never**
competes against a GA-2 candidate; you declare which seat you run for. Three options on the
table:

| # | Option | Description (POST) | Disposition in-thread |
|---|--------|--------------------|-----------------------|
| A | **Per-seat (status quo)** | Separate race per seat; candidate picks GA-1 *or* GA-2; per-seat primaries. (POST 1) | **Informally preferred / kept.** "Preference is for GA-1 to stay in GA-1's lane, GA-2 in GA-2's lane, no crossover" (Ted, POST 5). NOT ratified by vcczar. |
| B | **Free-for-all (top-N overall)** | One pool, **no per-seat primaries**; the **top 2 contenders overall** take GA's 2 seats. (POST 1, 7) | Raised, not adopted. |
| C | **All candidates in both races simultaneously** | Primaries still exist, but every GA Rep candidate competes in **all** GA races at once (a multi-member district / single pool). (POST 1, 7, 13) | Raised; OrangeP47 (POST 13) says this is what Ted's original explanation *logically implied* ("multi-member district, every candidate in the same pool") but **"I don't know how to make that work."** No implementation path found. |

**The emergent quirk that motivated the question** (POST 1, 2): under Option A, the GA-1
incumbent and GA-2 incumbent can both choose to run **against each other for GA-1**, leaving
GA-2 to outsiders. Disposition:
- **Ted (POST 2):** acceptable — program the **AI/CPU to keep incumbents in their own seat**;
  if a *human* moves their GA-2 incumbent into GA-1, "that's the human's fault." (Rezi +
  others agree, POST 3, 4.) → **CPU rule: incumbents default to running in their current
  seat; humans may override.** This is a NEW concrete CPU-behavior requirement.
- **Rezi (POST 3) alternative:** a hard **seat-lock** — once a statesman wins a seat they are
  *required* to stay in it, the lock **releasing only when state rep count changes** (district
  added/removed) so the pol gets a chance to move. Corroborates **#55** ("seat-locked
  incumbency"). vcczar's #55 ruling settled the locked-incumbency principle; this thread is
  where the unlock-on-reapportionment refinement is articulated.
- Reapportionment edge case noted (POST 5): if Georgia shrinks to 1 Rep, the displaced GA-2
  incumbent becomes eligible to contest GA-1. → seat count must be **dynamic per era** and
  the lock/eligibility logic keys off it.

## ★ The "Kevin McCarthy problem" → per-seat deviant bias (DESIGN-ORIGIN of #191)
jvikings1 (POST 15) raises the central balance complaint that motivates **#191**: because
each *state* (not seat) carries a single party lean, a strong minority-party politician in a
heavily-leaning state can **never win** — e.g. a great red draftee stuck in deep-blue CA
(POST 24), or a real swing region like East TN / "State of Franklin" being silently voided
by its state's +2 D lean (POST 15, 21). "It's less about the seat/vote in Congress and more
about voiding a key historical figure because their overall state leans +2 the other way."
Geography proper is rejected as unbuildable in-scope: "nobody is going to assign geography /
party preference to all ~8,000 politicians and every possible district, incl. conquered
foreign territory" (Ted, POST 16). Instead, **per-seat lean stratification** is proposed —
this is the design seed of #191 (seat-deviant-bias districts). Variants debated:

- **`+2/+2/+1` (the leading proposal, OrangeP47 POST 18):** in a large state leaning +2,
  make the three seats **+2 / +2 / +1**, so the 3rd seat is competitive without being handed
  to the minority. Broadly liked (Ted POST 26 "really like this"; Cal POST 30; jvikings1
  POST 22). **Ted's strongest single statement of intent toward #191.**
- **Progressive-swing ladder (Willthescout7, POST 24):** seat 1 = full state lean, seat 2 =
  **−2/−3** toward the minority, seat 3 = another **−2/−3** — seats get progressively
  swingier so players prioritize the safe seat first. This is closer to the EV-derived 1–10
  ladder later resolved in **#219**, but applied as *per-seat lean*, not vote-power.
- **Guarantee-a-minority-seat (Ted, POST 26/27):** dictate every large state has ≥1 notable
  Rep from each party, only the 3rd seat swinging → guarantees the minority **33%** of a big
  state's House vote. Ted cites real ~33% minority shares (NY ~33% R, TX ~33% D, CA ~20% R)
  as evidence it may be realistic. **Pushback** from multiple players (POST 27, 28, 25):
  don't *guarantee* a seat — only make it **swingy and winnable by a talented in-state pol**;
  guaranteeing removes the election aspect.
- **Random penalty (Ted, POST 29):** alt — if one party sweeps all 3 large-state seats,
  randomly give one of them **−1 on its next election**.
- **Optional toggle: disable historical lean at game start** (Willthescout7, POST 24) so
  states "develop naturally" and a good player can pre-empt the McCarthy problem. NEW idea —
  a setup-time switch on whether state bias is seeded historically vs. emergent.
- **Hard constraint flagged (Ted, POST 26):** the **~100-seat / 1–3-per-state balance**
  blocks the obvious "give big states 5 seats" fix — 1/3/5 reps would risk balance. So the
  fix must live in **per-seat lean**, not seat *count*. (Directly constrains how #191 ships.)

**Disposition of #191's seed:** consensus *direction* = some per-seat lean stratification
(`+2/+2/+1`-style) so big-state minorities have a swing seat; **NOT** a guaranteed seat;
**NOT** more seats. No final number ratified; vcczar absent from the resolution. Open.

## Other election-rule edits raised (general review)
- **Term-limited-President primary endorsement sway (NEW, themiddlepolitical POST 10, 12):**
  does a term-limited incumbent President carry endorsement weight in their party's primary?
  Ted (POST 11): unknown, primary rules not yet reviewed. Player intent: yes — cites
  Eisenhower (1960 is up) and Trump's outsized primary-endorsement power. → relates to
  primary/endorsement-momentum (#183/#185); this is a NEW specific sub-case (ex-/lame-duck
  President as primary kingmaker) not yet in the gap log here. (May overlap #210 Ex-President
  super-Kingmaker — flag for consolidation to dedupe.)
- **Attribute/Kingmaker-driven "non-primary primaries" (NEW, themiddlepolitical POST 10):**
  for uncontested-within-party nominations (and Rep/Sen with no primary), resolve by skill +
  Kingmaker trait instead of auto-award: **1 D6 per Kingmaker + ability**; ≥2 Kingmakers ≈
  auto-win (unless both roll 1); lets a weak-but-Kingmaker pol usually beat a strong-but-no-
  Kingmaker pol, with upset chance. Concrete dice proposal for the trivial-primary path;
  not dispositioned. (Sharpens the primary/convention cluster #185/#183.)
- **Demographics scoring nit (NEW, Cal POST 31):** "'Other racial' shouldn't count as a
  negative in states like Hawaii." Implies the election scorer applies a demographic/racial
  term to candidates that is mis-signed for non-mainland states. Small but concrete data/
  scoring fix; ties to the #238 Sex/demographics axis work and the hidden election-scorer
  bias terms (#184/#18). Flag for consolidation.

---

## NEW vs. corroborating
**Corroborating (no new gap, strengthens existing):**
- #219 — focus-Rep model KEPT, 1–3 seats/state (POST 1, 8, 26). NEW supporting detail:
  explicit **~100-seat / avg-2-per-state** balance target (POST 26).
- #55 — shipped flat `representativeIds` + **seat-locked incumbency** (POST 1, 2, 3);
  verified in code: `state.representativeIds: string[]` (types.ts:1327), `seatClass?:1|2|3`
  (types.ts:1247), per-state `bias` only (phaseRunners.ts:903-905) — i.e. **no per-seat
  lean** today, exactly the gap #191 targets.
- #191 — seat-deviant-bias districts: **this thread is its DESIGN-ORIGIN** (the "Kevin
  McCarthy problem" + `+2/+2/+1`). Promotes #191 from a one-line To-Do item to a
  designer-discussed, direction-set (but unratified) requirement.
- #185 / #183 — primary/convention + endorsement momentum: corroborated by the
  term-limited-President-sway and Kingmaker-dice sub-questions (POST 10–12).

**NEW (candidate gaps — see below):** the House-seat-competition model fork (A/B/C +
CPU-incumbent rule + unlock-on-reapportionment); the disable-historical-lean toggle; the
Kingmaker-D6 trivial-primary resolver; the lame-duck/ex-President primary-endorsement sway;
the mis-signed "Other racial" demographic scoring term.

## Open questions (for the human / consolidation)
1. Which House-seat-competition model is canonical — **A (per-seat, status quo)**,
   **B (top-N free-for-all)**, or **C (single multi-member pool)**? Thread leans A but
   vcczar never ruled, and #219's EV ladder doesn't decide it.
2. For #191: ratify a per-seat lean rule (which? `+2/+2/+1` vs progressive `−2/−3` ladder
   vs random-penalty), and is it a hard rule or the **optional disable-historical-lean
   toggle**? Explicitly **not** a guaranteed minority seat per consensus.
3. Is incumbent seat-stay a **hard lock** (Rezi) or a **CPU-default + human-override** (Ted)?
   Confirm the unlock-on-reapportionment trigger.
4. Does a lame-duck / ex-President carry primary-endorsement weight? (dedupe vs #210.)

---

## Candidate gaps for consolidation
- **[NEW] House-seat-competition model (sharpens #219/#55):** decide per-seat (A) vs
  free-for-all top-N (B) vs single multi-member pool (C). Default-A leaning. Requires:
  per-seat race grouping, **CPU rule = incumbents run in their current seat** (humans may
  override), **seat-lock released on reapportionment** (dynamic per-era seat count), and the
  reapportionment eligibility shuffle (GA→1 seat frees GA-2 incumbent). [POST 1,2,3,5,7,13,14]
- **[corroborates #191 — DESIGN-ORIGIN] Per-seat deviant lean for large states ("Kevin
  McCarthy problem"):** give multi-seat leaning states a swing seat via per-seat lean
  (leading: `+2/+2/+1`; alt: progressive `−2/−3` ladder; alt: random −1 if a party sweeps).
  **Not** more seats (breaks the ~100-seat balance), **not** a guaranteed minority seat.
  [POST 15,16,18,22,24,26,27,28,29,30]
- **[NEW] Setup toggle: disable historical state lean** so states evolve emergently and the
  player can pre-empt unwinnable states. [POST 24]
- **[corroborates #219/#55] House balance constant:** ~1–3 Reps/state, avg ~2, **~100-seat
  House** at 50 states; geography deliberately unmodeled (alternate-states model instead).
  [POST 1,8,26]
- **[NEW, sharpens #185/#183] Kingmaker-D6 trivial-primary resolver:** when a nomination is
  uncontested-within-party (and for no-primary Rep/Sen races), resolve by **1 D6 per
  Kingmaker + ability** rather than auto-award. [POST 10]
- **[NEW, ties #210/#183] Lame-duck / ex-President primary-endorsement sway** — does a
  term-limited or former President carry primary kingmaker weight? (dedupe vs #210.) [POST 10,12]
- **[NEW, ties #184/#238] Election-scorer demographic term mis-signed:** "Other racial"
  applied as a negative in states like Hawaii where it shouldn't be. [POST 31]
