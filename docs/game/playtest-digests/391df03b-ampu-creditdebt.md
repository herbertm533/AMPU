# Digest — `391df03b-ampu-creditdebt` ("AMPU Credit/Debt")

> **Batch 48, digest-only.** Source: `docs/game/sources/391df03b-ampu-creditdebt/`
> (1 chunk, **114 lines** / 11 posts / ~5.1k chars). Forum topic 1179, started by
> **@vcczar** (designer). Genre: **policy CONTENT thread** — an authoring spec for
> the **Credit/Debt policy subtype**, not a playthrough. Status: **authoring
> SNAPSHOT, not ratified** — vcczar opens "This might be the smallest policy
> subtype. It might not need to be expanded, but I'm open to ideas." (POST 1).
> Era framing cross-checked against `docs/game/historical-context.md` (no
> historian ran this batch).
>
> **★ Why it matters — the SECOND worked prereq-tree exemplar.** This is a direct
> sibling of the b47 Currency thread (`de64de1a-ampu-currency`), built in the
> **identical format**: a content tree **organized BY PREREQUISITE**, every item
> carrying an **action-type (`L`/`P`) + era/ideology tag**. Two threads now share
> the exact same authoring shape ⇒ **Credit/Debt + Currency are the two canonical
> worked examples** of the **#258 predicate-gated content engine** + **#237
> policy-genre framework**. Currency is the purest/largest; Credit/Debt is the
> **smallest** (vcczar's own words) and adds **two predicate classes the Currency
> tree under-emphasized**: a **diplomatic-recognition predicate** (Dutch Recognize
> US → Secure Dutch Loan) and **policy-active / program-state predicates**
> (Funding-Act-passed; National-Debt-exists). Preserve the prereq→content
> structure faithfully; that structure *is* the requirement.

---

## 1. Thread shape & provenance

- **POST 1** (@vcczar): the full Credit/Debt tree (transcribed verbatim in §3),
  pinging ~25 players for review + soliciting "Era of the Future" / more
  legislation / more pres actions. Notes this is his 3rd subtype of the day and
  his daily limit ("three more tomorrow") — i.e. one of a **rapid run of
  policy-genre authoring threads**, of which Currency is another.
- **POST 2** (@OrangeP47): community add-on — sell territory to pay down debt.
- **POST 3** (@Willthescout7): scope question — national debt only, or include
  individual/household debt?
- **POST 4** (@vcczar): "Good question. Could be included. What ideas do you
  have?" — **leaves scope open** (no ruling).
- **POST 5** (@OrangeP47): Lend-Lease as credit-to-other-nations / WW-era event
  chains.
- **POST 6** (@Willthescout7): South-Korea-style filial debt inheritance (debt
  devolves to children on a parent's death) → Era-of-the-Future law; QoL impact;
  **Big Business pro / Progressive anti** valence.
- **POST 7** (@vcczar): **partial ruling** — such a law is "instant death for a
  political career," no party would support it in Western society; could exist as
  an **early-game repealable law**, never with real US support.
- **POST 8** (@vcczar): **DESIGNER RULING** — Lend-Lease "is more under
  diplomacy," i.e. **routed to the Diplomacy genre, NOT Credit/Debt** (a
  genre-boundary call; cf. the Currency thread's "national symbols → maybe a
  separate thread").
- **POST 9** (@Willthescout7): aside on real US filial-support laws (one state
  enforces; 4-5 have them on the books). Flavor; no mechanic.
- **POST 10** (@Willthescout7 or community): add-ons — **Balanced Budget
  Amendment** (Amendment-type); a **debt-ceiling EVENT** (reached → expand /
  keep / reduce); **Balanced Budget Amendment, state version** (Gov-action).
- **POST 11** (community): proposed law/amendment — **if the budget is not
  balanced, no member of Congress can run for reelection.**

This is an authoring spec, so there are no post-numbered "rulings in play."
Binding **designer rulings** are POST 7 (filial-debt = early repealable only) and
POST 8 (Lend-Lease → Diplomacy).

---

## 2. Tag legend (same scheme as Currency)

Identical to the b47 Currency tree (see `de64de1a-ampu-currency.md` §2 for the
full decode). Recap of what appears in THIS tree:

- **Action type (`X`)** — who enacts it:
  - **L = Legislative** (Act of Congress) — Funding Act, balanced-budget
    requirement, No-National-Credit/Debt default, Secure Dutch Loan.
  - **P = Presidential** (Gov/executive action) — Abolish National Debt Policy,
    Take Out Emergency Foreign Loan. (Note **both `P` items here are Federalist-era
    debt moves** — Hamiltonian finance was substantially executive-driven;
    consistent with the Currency tree's L/P-tracks-real-enactment pattern.)
- **Era/ideology suffix (`Yyy`)** — only **two bands** appear in this small tree:
  - **Ind** = Independence (Founding/Rev 1772-88) — Secure Dutch Loan (the 1782
    Amsterdam loan), No-National-Credit/Debt default.
  - **Fed** = Federalist (1788-1800) — Funding Act, Abolish National Debt Policy,
    Emergency Foreign Loan. **Hamilton's program** (assumption of state debts,
    funding at par; historical-context §2 L242 "Assumption of state debts").
  - **Prog** = Progressive — the balanced-budget-except-in-war/crisis law.
  - **`Default`** suffix = the **starting state** before any policy (same role as
    Currency's "Spanish Dollar + State Scrip" default).
  - Community add-ons reach into **Future** (filial-debt; Amero-adjacent) — vcczar
    explicitly solicits Era-of-the-Future ideas.

---

## 3. The Credit/Debt tree, BY PREREQUISITE (POST 1, verbatim structure)

This is the data model. Each group = a **precondition class**; each line = a
gated policy `Name (ActionType-EraTag)`. Preserve this grouping when modeling
#258/#237.

### 3a. `No preq needed` (always available)
- **Funding Act** (L-Fed) — Hamiltonian funding/assumption; the keystone that
  later items chain off (see 3f).
- **Require balanced budget except during major war or crisis** (L-Prog) — note
  the carve-out is itself an **active-war / crisis-meter predicate** baked into
  the policy's effect, not just its availability.

### 3b. Preq: `No national credit/debt active` *(a DEFAULT state)*
- **No National Credit/Debt** (L-Ind-**Default**) — the founding-era default
  (mirror of Currency's "Rely on Spanish Dollar + State Scrip" default, 3b there).

### 3c. Preq: `National Debt Exists` *(a program-state predicate)*
- **Abolish National Debt Policy** (P-Fed) — gated on a debt actually existing.
  **This is a state-of-the-national-debt predicate** — the build tracks the debt
  *value* (`game.nationalDebt`) but exposes **no "debt exists / debt > 0"
  predicate** (delta D2/D3).

### 3d. Preq: `Dutch Recognize US` *(a DIPLOMATIC-RECOGNITION predicate)*
- **Secure Dutch Loan** (L-Ind) — gated on a **foreign-nation recognition event**.
  ★ This is the **diplomatic-recognition predicate class** Credit/Debt adds to the
  #258 set. Cross-refs: the **b48 Top-10-Statesmen "Dutch loan"** item (John Adams
  / Amsterdam) and the Currency tree's institution/diplomacy predicates. **Already
  shipped as a one-off** (see §5 D1): the `dutch_recognition` era event
  (eraEvents1772.ts:248, "John Adams secures a large loan in Amsterdam, opening
  foreign credit") sets the **`loansEnabled` graph flag** (phaseRunners.ts:3144) —
  but as a bespoke flag, not a generic recognition-of-nation-X predicate.

### 3e. Preq: `Funding Act` (the only chained prereq in the tree)
- **Take Out Emergency Foreign Loan** (P-Fed) — requires the Funding Act (3a) to
  have passed first. **This is the policy→predicate chain** (an enacted policy
  becomes the gate for a later one) — the same core loop the Currency tree shows
  (Bank → Mint → Standard). Confirms the requirement is generic, not currency-
  specific.

> **Implicit structure:** the tree is shallow (depth 2) — `Funding Act` → `Emergency
> Foreign Loan` is the only real chain. The other gates are **state predicates**
> (debt-exists, no-debt-default) and an **event/recognition predicate**
> (Dutch-recognize). vcczar's "smallest subtype" framing is accurate: ~6 base
> items vs. Currency's ~20. But it exercises the **same five precondition kinds**
> (always-on / default-state / program-state / chained-policy / diplomatic-event),
> which is exactly why it's a useful **corroborating second exemplar** for the
> catalog shape.

---

## 4. Community add-ons (POSTS 2-11) — backlog & scope rulings

1. **Sell territory to pay down debt** (@OrangeP47, POST 2). Especially for the
   **expansionist route** where vast territory is hard to hold — selling it to
   reduce debt as a "more savory option than losing it by other means." → couples
   the debt system to **#4e76e6c3 expansionism** + territory/admit-state systems;
   needs both a "# states/territory held" notion AND a debt-reduction lever. Not
   ruled on.
2. **Individual / household debt (scope question)** (@Willthescout7, POST 3-4).
   Is the subtype national-only or does it cover personal debt? vcczar **left it
   open** ("Could be included. What ideas do you have?"). → an **open scope
   question** (§6 Q1). The South-Korea proposal (below) is the concrete instance.
3. **Filial debt inheritance** (@Willthescout7, POST 6). South-Korea-style law:
   on a parent's death, debt devolves to the children. **Era-of-the-Future**;
   impacts **Quality-of-Life meter**; **Big Business pro / Progressive anti**
   valence. **DESIGNER RULING (POST 7):** infeasible in modern Western politics
   ("instant death for a political career," no party support) — viable only as an
   **early-game repealable law**, never with real US support. → a **repealable-
   early-law** pattern + **Future-band/personal-debt content**; feeds #206
   (Future) and the QoL meter (shipped as `quality`, Meter.tsx:19).
4. **Lend-Lease / wartime credit to other nations** (@OrangeP47, POST 5).
   WW-era event chains lending money to foreign powers. **DESIGNER RULING (POST
   8): "that's more under diplomacy"** — **routed OUT of Credit/Debt into the
   Diplomacy genre** (cf. `b8aecb83-ampu-diplomacy`). A genre-boundary ruling,
   not a backlog item for this subtype.
5. **Balanced Budget Amendment** (POST 10) — an **Amendment-type** policy
   ("probably is elsewhere, but it also belongs here") + a **state version as a
   Gov-action**. → introduces a **third action type beyond L/P: Constitutional
   Amendment**, and reinforces the Currency thread's **level-of-government gate**
   (federal Amendment vs. Governor/state action; cf. Currency D6).
6. **Debt-ceiling EVENT** (POST 10): "Debt ceiling reached" → choose **expand /
   keep / reduce**. → an **era/anytime event** keyed off the tracked debt value
   crossing a threshold (a debt-band predicate the build lacks); a clean fit for
   the existing `anytimeNationalEvents` system (cf. the shipped "financial panic"
   anytime event, anytimeNationalEvents.ts:42).
7. **"Unbalanced budget → no member of Congress can run for reelection"** (POST
   11) — a proposed law/amendment with a **harsh electoral-eligibility effect**
   gated on the **budget-balanced state** (the `revenue` meter band). A novel
   **effect class**: a policy that toggles *candidate eligibility for an entire
   office class*, conditioned on a meter band. No shipped analog.

---

## 5. Deltas vs. current build

**Verified against shipped code:** `src/types.ts` (`Predicate` union
L1487-1504; `NationalMeters` L1399-1407; `game.nationalDebt: number` L1573;
`GraphFlagId = 'loansEnabled' | 'warVictoryGuaranteed'` L1109),
`src/engine/phaseRunners.ts` (debt paydown L3376; `loansEnabled` set on
`dutch_recognition` L3144), `src/data/eraEvents1772.ts` (`dutch_recognition`
event L248), `src/data/scenario1772.ts` (`nationalDebt: 0`), `src/data/
scenario1856.ts` (`nationalDebt: 32_000_000` L161), `src/components/Meter.tsx`
(`revenue` + `economic` named bands L14-15), `src/pages/Dashboard.tsx` L83 &
`src/pages/MetersPage.tsx` L18 (debt display).

> **★ Correction to the batch brief's hypothesis.** A national-debt state **DOES
> ship** — `game.nationalDebt` is a tracked number, scenario-seeded, displayed,
> and auto-paid-down. And a **budget/revenue meter with the exact named bands the
> tree wants** ("Balanced," "Deficit," "Surplus") ships too. What is **absent** is
> the **policy CONTENT layer** that reads/writes them: no Funding Act, no
> balanced-budget law, no debt-ceiling event, no debt/budget PREDICATE, and no
> player lever to *take a loan* (the debt only moves passively). So the headline
> is **not** "no debt/budget state ships" — it's **"a debt value + a budget meter
> ship as raw numbers, but the prereq-gated Credit/Debt policy catalog that
> manipulates and gates on them does not."**

- **D1 — National-debt STATE ships; the policy catalog does not.**
  `game.nationalDebt` (types.ts:1573) is seeded ($0 in 1772, $32M in 1856) and
  mutated in **exactly one place** — a passive turn-end paydown
  `nationalDebt = max(0, nationalDebt − revenue·$1.5M)` (phaseRunners.ts:3376).
  There is **no Funding Act, no "Abolish National Debt," no "take out a loan"
  action, no debt-ceiling event** — i.e. **none of the tree's enactable items
  exist**. The whole tree is the canonical spec for **#237/#258** applied to debt.
  **Requirement:** a data-driven policy catalog entry shape
  `{ actionType: L|P|Amendment, era/ideology tag, precondition: Predicate,
  effects }`, where effects can **read AND write `nationalDebt`** (and the
  `revenue` meter). (Same D1 as the Currency digest — strengthens it with a second
  subtype.)

- **D2 — `Predicate` union lacks a DEBT-LEVEL / debt-exists leaf.** Today's
  leaves (types.ts:1487-1504) include `meterAtLeast/AtMost`, but `nationalDebt` is
  **NOT a `MeterKey`** (`NationalMeters` is revenue/economic/military/domestic/
  honest/quality/planet — no debt field), so **no predicate can gate on the debt
  at all.** The tree needs:
  - **"National Debt Exists" / "debt > 0"** (3c) — a program-state predicate.
  - **"Debt ceiling reached"** (POST 10) — a debt-threshold/band predicate.
  **Requirement:** either make `nationalDebt` queryable via a new leaf
  (`debtAtLeast`/`debtAtMost` or a `debtExists` boolean) or fold debt into the
  meter/band machinery. **This is the single most concrete new predicate this
  thread adds** beyond the Currency set.

- **D3 — DIPLOMATIC-RECOGNITION predicate (the class Credit/Debt contributes).**
  "Dutch Recognize US" (3d) gates "Secure Dutch Loan." The build ships the
  *outcome* as a **bespoke one-off**: `dutch_recognition` event →
  `loansEnabled` graph flag (the only finance flag), surfaced as "Foreign loans
  authorized" (labels.ts:164). But there is **no generic "nation X has recognized
  the US" predicate** — `diplomacyAtLeast` tests a *relationship value*, not a
  *recognition state*, and `loansEnabled` is a single hardcoded flag. **Requirement:**
  a recognition-of-nation predicate class (or, minimally, generalize the
  loans-enabled flag into a gateable "foreign credit open" state). This + the
  Currency tree's institution-active predicates together define the
  **diplomacy/institution predicate family** under #258. **(Cross-ref:** the b48
  Top-10-Statesmen "Dutch loan" item — same 1782 Amsterdam fact, John Adams.)

- **D4 — POLICY-ACTIVE / program-state predicate (chained Funding Act).** "Preq:
  Funding Act" (3e) gates "Emergency Foreign Loan" on a **prior policy having been
  enacted**. The build's only path to "did policy X happen" is `eventCompleted`/
  `eventChose` over **era-events** — there is **no generic "policy/law X is
  currently enacted" predicate** (same gap the Currency tree flagged for
  Bank/Mint/Fed). **Requirement:** enacted policies must write durable, queryable
  state that a `policyActive`/`policyEnacted` predicate reads. Reinforces the
  Currency digest's biggest single requirement (its D2(a)). Two threads now
  demand it ⇒ high confidence it's a keystone, not a one-off.

- **D5 — `revenue` budget meter ships with the right bands, but no LAW gates on
  it.** `Meter.tsx:14` already names `revenue` bands `Bankruptcy … Heavy Deficit …
  Deficit … Tight … Balanced … Surplus …` — exactly the vocabulary the
  "require balanced budget" (3a) and "unbalanced → no reelection" (POST 11) laws
  need. But **no predicate or policy reads these bands** (they're display-only
  strings, not thresholds). `economic` likewise has `Depression … Recession …`
  bands (relevant to the Currency tree's crisis gates). **Requirement:** promote
  meter-band names to **queryable thresholds** (shared with the Currency digest's
  D2(b) request for Panic/Depression bands — the band strings already exist; only
  the predicate hook is missing).

- **D6 — Amendment as a third action type; level-of-government gate.** The tree's
  `L`/`P` split (legislative vs presidential) is shipped only as
  **congressional `Legislation`** — there's no executive-action policy path, AND
  the **Balanced Budget Amendment** (POST 10) adds a **Constitutional-Amendment**
  action type plus a **state version (Gov-action)**. **Requirement:** policy
  `actionType` ∈ {Congress-bill, President-action, Amendment, Governor-action}
  (extends the Currency digest's D6 with the Amendment type).

- **D7 — Sell-territory-to-pay-debt lever (community add-on).** Couples debt to
  expansionism/territory: a player action that **trades held territory for debt
  reduction** (POST 2). No shipped analog (`admitState` adds states; nothing
  removes/sells them). Needs a "# territory/states held" notion + a debt-write
  action. → feeds #4e76e6c3 (expansionism) and #221/#248 (small-US dynamics).

- **D8 — Novel EFFECT classes (low-priority, Future/flavor).**
  - **Eligibility-toggling law** (POST 11): a policy whose effect, gated on a
    budget band, **bars an entire office class from reelection.** The flat
    `EraEventResponseEffect` (meters/enthusiasm/interest-groups) cannot express
    "disable candidacy for office class X." New effect class.
  - **Filial-debt / personal-debt Future law** (POST 6-7): QoL-meter impact +
    Big-Business/Progressive valence; modeled as an **early repealable law**.
    Future-band content (#206); also the live instance of the **open
    personal-vs-national scope question** (Q1).

---

## 6. Open questions for the PM

1. **Scope: national debt only, or personal/household debt too?** (POST 3-4 —
   vcczar left it open; POST 6's filial-debt law is the concrete instance). Does
   the Credit/Debt genre own personal-finance laws, or only the sovereign debt?
2. **Debt-ceiling thresholds** — at what `nationalDebt` value does the
   "debt ceiling reached" event (POST 10) fire, and what do expand/keep/reduce do
   numerically? Undefined in-thread.
3. **Budget-balanced definition** — which `revenue` band(s) count as "balanced"
   for the balanced-budget law (3a) and the "no reelection if unbalanced" law
   (POST 11)? The band names exist (Meter.tsx); the policy threshold does not.
4. **Is this subtype expanded or left minimal?** vcczar: "It might not need to be
   expanded" (POST 1). Treat the tree as **possibly-final-as-is** (smallest
   subtype) — unlike Currency, there's no "looks good" ratification.
5. **Era-band taxonomy** — same unresolved question as the Currency digest
   (Ind/Fed/Prog here; the build's `Era` enum has only 4 coarse values). See
   `de64de1a-ampu-currency.md` §6 Q1.

---

## 7. Hand-off framing

Frame as inputs to the **content-engine cluster**:
- **#258** (predicate-gated content engine) — Credit/Debt is the **second worked
  exemplar** after Currency; it **adds two predicate classes** to the #258 set:
  **(a) diplomatic-recognition** (Dutch-recognize → loan; D3) and **(b) policy-
  active / program-state** (Funding-Act-passed, debt-exists; D2/D4). Together with
  Currency's institution-active / meter-band / active-war predicates, this nails
  down the predicate family the engine must support.
- **#237** (policy-genre content framework) — same `L/P` + era-tag + prereq-tree
  authoring shape as Currency ⇒ **Currency + Credit/Debt are the two canonical
  prereq-tree exemplars**; the framework's catalog shape is now corroborated
  twice. (Catalog-shape corroboration also lines up with #237/#221's other
  prereq-structured subtypes — same skeleton.)
- **#206** (Future band) — filial/personal-debt Future law (POST 6-7).
- **#66** (national debt/credit as a tracked institution/state) — the build
  already tracks `nationalDebt` + `loansEnabled`; #66 is about turning these from
  raw numbers/flags into **policy-readable, policy-writable program state**.
- **Diplomacy genre** (`b8aecb83`) — Lend-Lease is **explicitly routed here, not
  Credit/Debt** (POST 8 ruling).

**Status:** authoring SNAPSHOT (smallest subtype; "might not need to be
expanded"); two designer rulings (filial-debt = early repealable only, POST 7;
Lend-Lease → Diplomacy, POST 8); add-ons POST 2/10/11 are open backlog.

---

## Deltas vs current build (tight list)

- **HEADLINE:** a **2nd prereq-structured policy subtype** that **confirms the
  Currency catalog shape** (`L/P` action-type + era/ideology tag + prereq tree).
  Currency + Credit/Debt = the two worked #258/#237 exemplars.
- **Adds two predicate classes** to the #258 set: **diplomatic-recognition**
  (Dutch-recognize-US → Secure Dutch Loan) and **policy-active/program-state**
  (Preq: Funding-Act; "National Debt Exists").
- **Brief's "no debt/budget state ships" is half-wrong:** `game.nationalDebt`
  **ships** (tracked, scenario-seeded $0/$32M, displayed, passively paid down by
  `revenue·$1.5M`/turn, phaseRunners.ts:3376) AND the `revenue` budget meter ships
  with the exact bands the laws want (Bankruptcy…Balanced…Surplus, Meter.tsx:14).
- **What's missing is the CONTENT layer:** no Funding Act / Abolish-Debt /
  balanced-budget law / debt-ceiling event / take-a-loan action — and **no
  predicate can gate on the debt** (`nationalDebt` is not a `MeterKey`; Predicate
  union has no debt/budget leaf).
- **Dutch loan already shipped as a one-off:** `dutch_recognition` event →
  `loansEnabled` graph flag (the only finance flag) — needs generalizing into a
  recognition predicate.
- **New action type:** Constitutional **Amendment** (+ state Gov-action version) —
  Balanced Budget Amendment; extends Currency's L/P split.
- **New effect/lever classes:** sell-territory-for-debt-reduction (couples to
  expansionism), eligibility-toggling law ("unbalanced → no Congressional
  reelection"), filial/personal-debt Future law.
- **Open scope Q:** national debt only vs. personal/household debt (vcczar left
  open, POST 4).
