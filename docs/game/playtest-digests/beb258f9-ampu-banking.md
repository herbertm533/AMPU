# Digest — "AMPU Banking" (`beb258f9`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (Apr 2022), **NOT a playthrough.**
**10 posts / 1 chunk** (chunk-001, all covered). Source CSV ~5.0 KB.
**Author/GM:** **@vcczar** (tier-1 designer) posts the genre (POST 1, the standard
`@`-roster + *"same as the Agriculture and Bailout threads… ideas I need are Era of the
Future banking legis props, gov actions, and pres actions"* opener) and issues the
taxonomy rulings (POST 6 Stock-Market→Trade; POST 9–10 gold/silver/fiat → **currency
subtype**). Community contributors add in POSTs 2/4/5/7/8 (crypto/FinTech, Bank-of-Outer-
Space/one-world-currency/abolish-cash, Stock-Market set, gold-vs-silver-vs-bimetalism).
**Why it matters:** the **Banking** policy genre — another concrete instance of the
#237 stateful-policy-genre framework / #221 three-primitive content system, AND it
explicitly names a **Currency SUBTYPE** (#248). The framework is by now WELL-ESTABLISHED
across the sibling drops (#237 / #248 / #221 / #258 / #262 / #206) — this thread
**CORROBORATES** all of them. Unlike most sibling drops it is **PARTIALLY TAGGED**: rows
carry `L-/P-/G-/S-` mechanism + ideology-band tags AND ~9 explicit `Preq:` blocks (closer
to the `businesslabor` origin form than the untagged `welfare`/`healthcare`/`regulations`
drops). Content primitives remain **0% shipped** (`Legislation`, `types.ts:1506–1520`,
still has only the 4-value `committee` — no `subtype`, no prereq/condition field).

---

## ★ MILESTONE CORRECTION (flag PROMINENTLY for consolidation)

batch-41 (`2cddc161-ampu-welfare`) recorded a milestone that *"Welfare was the 12th & LAST
policy-genre drop; the content sweep is COMPLETE."* **That is WRONG.** **Banking is an
ADDITIONAL genre** beyond the 12, the sibling batch-42 `d4cd2ee6-ampu-regulations` is
**yet another**, and this thread names a **Currency** subtype (gold/silver/bimetalism/fiat)
plus references **Stock-Market** content living under **Trade**. So the policy-genre /
subtype corpus is **NOT complete at 12 and is still growing.**
- **Soften the b41 "sweep complete / 12th-and-last" claim** to: *"the major policy genres
  are largely captured, but MORE remain — Regulations, Banking, Currency subtype, Trade
  (Stock-Market), … (the threads reference others still)."*
- ★ vcczar's own verdict (POST 10): *"All these categories more complex than when 10 year
  old me learned the pokemon type chart."* — explicit designer signal that the genre/subtype
  taxonomy is OPEN-ENDED and larger than any fixed count. (Currency + Copyright genres were
  already named back at #237's origin, `businesslabor` POST 15/17/22, so a hard "12 and done"
  was never right.)

---

## The Banking policy genre (the core artifact, POST 1) — PARTIALLY-TAGGED form

vcczar posts ~28 rows, each carrying a mechanism + ideology-band tag, several under explicit
`Preq:` blocks. Tag legend matches the #237 schema (`L-`=Legislation, `P-`=Pres-Action,
`G-`=Gov-Action, `S-`=Scripted-event; parenthetical = era/ideology band, e.g. `Fed`=Federalist,
`Dem`=Democrat/Jacksonian, `Prog`=Progressive, `Ide`=Era-of-Ideologies, `Neo`=Neoliberal,
`Nat`=Nationalism, `Ter`=Traditionalist, `Norm`=Normalcy/1920s, `Rep`=Republican,
`Man`=?Manifest/Gilded, `Ind`=Independence/none).

**Shape (verbatim sampling, POST 1):**
- **No-prereq policies:** Independent Treasury (L-Dem) · Glass-Steagall (L-Ide) · Garn-St.
  Germain Act (L-Neo) · Public Ownership of the Banking System (L-Prog) · Create National
  Monetary System (L-Prog) · Export-Import Bank (P-Ide).
- **Scripted events (S-):** Bank of Manhattan (S-Fed) · First US Savings Bank (S-Rep) ·
  Bank War (S-Dem) · Recharter US Bank (S-Fed) · US Banking Twice that of UK (S-Rep) ·
  Wells Fargo, & Co. (S-Man).
- **Pres/Gov actions (P-/G-):** Weaken US Bank by Removing Deposits (P-Fed) · Establish
  State Bank (G-Ind, `Preq: US has California`).
- **The institution spine** (see lifecycle below): Bank of North America · Bank of the
  United States · National Banking Act · Create the Federal Reserve · Glass-Steagall ·
  Gramm-Leach-Bliley.
- **Fed-Reserve powers tier:** Monetary Control Act (L-Neo) · Grant Federal Reserve Power
  Over Non-Member Banks (L-Neo) · Grant Fed Res Responsibility of Managing Nation's Money
  Supply (L-Prog) · Strictly Regulate and Audit the Fed Res (L-Ter).

---

## ★ NOVEL #1 — The full bank/central-bank INSTITUTION LIFECYCLE (sharpens #221 program-state + #66 institution-lifecycle)

The richest create→recharter→weaken→kill→succeed chain in the KB yet. One *institution*
(the central bank) is born, privatized, re-founded, fought over, killed, and replaced —
each transition a discrete tagged row, implying a stateful banking-institution model +
per-stage prereq dependency. **Capture the verbatim ladder (POST 1):**

| Stage | Row (POST 1) | Prereq (verbatim) |
|---|---|---|
| **CREATE (v1)** | Bank of North America (L-Ind) | `Independent Treasury is Active` |
| **PRIVATIZE** | Privatize Bank of North America (L-Ind) | `Rev War has Occurred and Articles of Confederation Active` |
| **CREATE (v2)** | Bank of the United States (L-Fed) | `Bank of North America is privatized or inactive` |
| **WEAKEN** | Weaken US Bank by Removing Deposits (P-Fed) | `Bank of North America Exists` |
| **WAR / KILL** | Bank War (S-Dem) | — (the kill event) |
| **RECHARTER** | Recharter US Bank (S-Fed) | — (the keep-alive event) |
| **SUCCESSOR (Independent Treasury)** | Independent Treasury (L-Dem) | — (no-prereq; also gates Bank of NA) |
| **SUCCESSOR (National)** | National Banking Act (L-Nat) | — |
| **SUCCESSOR (Fed Reserve)** | Create the Federal Reserve (L-Prog) | `Federal Reserve is Active`* |
| **Fed POWERS expand** | Monetary Control / Grant-power-over-non-members / Grant-money-supply-mgmt | — |
| **Fed CONSTRAINT** | Strictly Regulate and Audit the Fed Res (L-Ter) | `Glass-Steagall is Active` |
| **REGIME (separate→merge)** | Glass-Steagall (L-Ide) → Gramm-Leach-Bliley Act (L-Neo, repeal-by-successor) | GLB `Economic Meter is at Recession or Worse` |

*★ NOTE a likely authoring slip: "Create the Federal Reserve" lists `Preq: Federal Reserve
is Active` (and "Bank of North America" lists `Preq: Independent Treasury is Active` while
also being the thing the Treasury succeeds) — i.e. a few prereqs read circular/inverted.
Flag as a **data-correctness open item** for the tagging pass, not a new mechanic.

★ This is the **bank twin of the Social-Security (`welfare`) and Medicare (`healthcare`)
entitlement ladders** AND of the #66 office-lifecycle (the Fed-Chair office is created by
THIS institution) — offices vs programs vs institutions are the same evolvable-stateful
pattern and should be reconciled. The **repeal-by-successor** edge (Glass-Steagall →
Gramm-Leach-Bliley) is a named instance of #248 supersession at institution scale. A flat
one-shot flag cannot model any of this → reinforces #221's program/institution-state
requirement.

## ★ NOVEL #2 — Heavy explicit `Preq:` chains corroborate BOTH #258 predicate kinds

Banking is one of the most prereq-dense drops, with ~9 explicit `Preq:` blocks (vs the
implicit-only prereqs of `welfare`/`regulations`). They split cleanly into the two predicate
classes #258 already posits:
- **Institution/policy-EXISTS predicates** (game-state, not calendar): "Bank of North
  America Exists / is privatized or inactive", "Independent Treasury is Active", "Federal
  Reserve is Active", "Glass-Steagall is Active", "Rev War has Occurred and Articles of
  Confederation Active", "Independence has been declared" (Emergency Banking Act).
- **Meter-THRESHOLD predicate:** "Economic Meter is at Recession or Worse" (Gramm-Leach-
  Bliley) — a direct read of the shipped `economic` `NationalMeters` value at a named tier.
- **Territory-possession predicate:** "US has California" (Establish State Bank G-Ind;
  Wells Fargo S-Man also Calif-flavored) — gates on a state being admitted (ties the
  `expansionism`/territory model).
→ Strongly CORROBORATES #258 (institution-exists + meter-threshold + territory predicate
kinds) with the most explicit `Preq:` evidence to date. Still 0% shipped (`Legislation` has
no prereq field; `Predicate` ships only for the 2.4.3 era-event graph).

## ★ NOVEL #3 — Named CURRENCY SUBTYPE + Stock-Market→Trade routing (sharpens #248 subtype taxonomy)

Two explicit GM taxonomy rulings establish that Banking is one node in a multi-level
genre/subtype tree (the #248 33-value subtype enumeration is the home for these):
- **Currency SUBTYPE (POST 8–10):** community asks for the gold-standard / silver-standard /
  **bimetalism** / eventual **fiat** debate ("the magnum opus of the electronic-USD talk").
  ★ vcczar RULING (POST 9, quoting; affirmed POST 10): *"That[']s in the currency subtype"* —
  i.e. gold/silver/bimetalism/fiat is its OWN subtype sibling to Banking, NOT a Banking row.
  This is a textbook #248 mutually-exclusive option-set (one currency-standard active
  supersedes the others) living under a distinct subtype tag. **The crypto/electronic-USD
  ("the dreaded chip"/abolish-cash) future items also belong here** (POST 2, 4, 7).
- **Stock-Market → TRADE (POST 5–6):** a contributor proposes a Stock-Market set (forbid
  in-office stock trading, insider-trading trait action, Communist-abolish-NYSE, invest
  Treasury in NYSE, merge-NYSE-with-World-Exchange). ★ vcczar RULING (POST 6): *"I think
  this is in another category… I know I have some stock things. They might be under **Trade**."*
  → Stock-Market is a separate top-level **Trade** genre, NOT Banking. Canonical
  multi-category-routing datapoint (#248).

---

## Era-of-the-Future content (corroborates #206 + designer ASK #262/#206 — the MAIN designer need here)

vcczar opens (POST 1): the ideas he *needs* are **"Era of the Future banking legis props,
gov actions, and pres actions, primarily."** → Future banking is the explicit #1 ask for
this genre. Future-band rows are entirely community-proposed (POSTs 2, 4, 7):
- **Bank of Outer Space** / **Interplanetary Fund** (guarantee loans for space exploration)
  — POST 4.
- **Merge with World Bank → single one-world currency** — POST 4 (also a Currency-subtype +
  #236-flavored sovereignty edge).
- **Replace paper currency with digital currency ("the dreaded chip")** / **abolish cash,
  everything on cards** — POST 4, 7.
- **Crypto / FinTech regulation** — POST 2, 4 ("some future act involving crypto… electronic
  banking acts… stocks etc."). ★ Cross-genre: crypto also surfaces as a Pres-Action in the
  sibling **Regulations** drop ("Regulate Cryptocurrency via Fed", `d4cd2ee6`).
→ CORROBORATES #206 (Future band real-in-design, thin-in-content, the explicitly-wanted
area) and the #262/#206 ASK for more Era-of-the-Future content. **DESIGNER ASK to surface:
Future banking is the primary content need for this genre.**

---

## ★ Cross-genre overlaps — flag, do NOT double-count (these belong to OTHER genres/subtypes)

- **Currency subtype** (gold/silver/bimetalism/fiat; electronic-USD/chip; crypto;
  one-world-currency) → the **#248 Currency subtype**, GM-ruled OUT of Banking (POST 9–10).
- **Stock-Market set** (in-office trading ban, insider-trading trait action, abolish-NYSE,
  invest-Treasury-in-NYSE, merge-with-World-Exchange) → the **Trade** genre, GM-ruled out
  of Banking (POST 6).
- **Crypto/FinTech regulation** → also the **Regulations** genre (sibling `d4cd2ee6`) —
  multi-category tag.
- **Merge-with-World-Bank → one-world-currency** + **abolish-cash** → touch the **#236**
  government-form / sovereignty edge (loss of monetary sovereignty / total-state control).
- **`*-Ind` "left to the states" baseline:** vcczar reminder (POST 3) — *"create Banking is
  Left to the States when there is no federal or independent central banks active"* — this is
  the genre's **#237 `*-Default` baseline** (absence-of-policy IS a state), gated on the
  no-central-bank-active predicate (#258). Attribute to #237/#258, not as a new mechanic.
- These overlaps + the explicit GM routings are the canonical case for **MULTI-CATEGORY /
  subtype tagging** (#248).

---

## Engine facts (verified this run, do not re-derive)

- `src/types.ts` `interface Legislation` (1506–1520) has the 4-value `committee` and **NO
  `subtype`, NO prereq/condition field** — confirmed. No banking-institution-state model,
  no central-bank lifecycle/charter flag, no currency-standard store anywhere in `src/`.
- The **Fed-Reserve / Fed-Chair / Independent-Treasury** referenced by this lifecycle are
  owned by **#66** (Fed Chair = an office created by law, 6-yr term) — but #66 ships **no**
  banking-INSTITUTION state model (it's an office-creation gap, not a program-state store).
- The only `condition`-shaped constructs are `opponentConditional` (trait-vote logic) and the
  serializable `Predicate` tree wired ONLY to the 2.4.3 era-event graph; neither can express
  "Bank of NA exists/privatized", "Independent Treasury active", "Glass-Steagall active", or
  "Economic Meter at Recession or worse" as a proposal-availability gate — the exact #258 gap.
- The **`economic` meter** the Gramm-Leach-Bliley `Recession` prereq reads DOES ship
  (`NationalMeters`, `types.ts:1399-1407`) — but nothing wires a proposal's availability to a
  named meter tier.
- No `policyGenre` / `presAction` / `govAction` / `subtype` / `prereq` / currency-standard
  tokens in `src/`. The three #221 content primitives + scripted-event registry remain
  **designed-only, 0% shipped.** Net: pure design provenance; adds NO shipped behavior;
  **enriches** existing 0%-shipped gaps with content + the sharpened institution-lifecycle
  pattern + the named Currency subtype.

---

## Candidate deltas for consolidation (map to EXISTING IDs — do NOT assign new numbers)

- **#237 (stateful policy-genre framework)** — CORROBORATE. Banking = **another** concrete
  genre instance (PARTIALLY-TAGGED: `L/P/G/S` mechanism + ideology band + `Preq:` blocks —
  closer to the `businesslabor` origin form than the untagged sibling drops). **★ CORRECTS
  the b41 milestone:** the corpus is NOT complete at 12 — Banking, Regulations (+ Currency
  subtype, + Trade/Stock-Market) are ADDITIONAL; soften "sweep complete / 12th-and-last" to
  "major genres largely captured, more remain." vcczar (POST 10): taxonomy "more complex than
  the pokemon type chart." The `*-Ind` "Banking Left to the States" baseline (POST 3) is the
  genre's #237 `*-Default` state. Source: POST 1, 3, 10.
- **#221 (content-model fields / 3-primitive content system + scripted-event registry)** —
  CORROBORATE, still **0% shipped.** Populates all primitives incl. ~6 **S-tier scripted
  events** (Bank of Manhattan, First US Savings Bank, Bank War, Recharter US Bank, US-Banking-
  2x-UK, Wells Fargo). **★ SHARPENS** the program/institution-state requirement: the full
  central-bank **create→privatize→re-found→weaken→Bank-War-kill→Independent-Treasury→National-
  Banking→Federal-Reserve→expand-Fed-powers→Glass-Steagall→repeal-by-Gramm-Leach-Bliley**
  lifecycle is the richest institution ladder in the KB — a flat one-shot flag cannot model it.
  Source: POST 1.
- **#258 (prereq / predicate-gated availability FIELD)** — CORROBORATE (strongest explicit
  evidence yet). ~9 explicit `Preq:` blocks spanning all three predicate kinds: **institution/
  policy-EXISTS** ("Bank of NA exists/privatized/inactive", "Independent Treasury active",
  "Federal Reserve active", "Glass-Steagall active", "Rev War occurred + Articles active",
  "Independence declared"), **meter-THRESHOLD** ("Economic Meter at Recession or Worse"), and
  **territory-possession** ("US has California"). ★ Flag a data-correctness item: a couple of
  prereqs read circular/inverted (Create-Fed `Preq: Fed is Active`; Bank-of-NA `Preq: Indep.
  Treasury Active`) — for the tagging pass, not a mechanic. Source: POST 1.
- **#248 (legis-proposal subtype taxonomy + hierarchical sub-sections + multi-category
  tagging)** — CORROBORATE + ENRICH. ★ Names a concrete **Currency SUBTYPE** (gold/silver/
  bimetalism/fiat; +crypto/electronic-USD/chip; one-world-currency) GM-ruled as a distinct
  subtype sibling to Banking (POST 9–10) — a mutually-exclusive currency-standard option-set.
  ★ **Stock-Market** GM-ruled into the **Trade** genre (POST 6). Glass-Steagall→Gramm-Leach-
  Bliley = supersession/repeal-by-successor. Crypto = multi-category (Banking + Regulations).
  Canonical subtype-routing + multi-category-tag evidence. Source: POST 5, 6, 8, 9, 10, 2, 4.
- **#262 (content-COVERAGE / per-primitive + per-ideology balance)** — CORROBORATE. ★ Explicit
  designer ASK (POST 1): the primary need is **Era-of-the-Future banking legis props, pres
  actions, AND gov actions.** Authored Future content is community-only (sparse at source).
  Source: POST 1, 2, 4.
- **#206 (Era of the Future doubly unbuilt)** — CORROBORATE + content gap + ASK. Future rows
  (Bank of Outer Space / Interplanetary Fund / merge-World-Bank-one-world-currency / abolish-
  cash-digital-chip / crypto-FinTech) all community-proposed, none authored by GM → strong
  under-content'd-at-source + explicitly-wanted datapoint. **DESIGNER ASK: Future banking is
  the main need.** Source: POST 1, 2, 4, 7.
- **#66 (office/institution lifecycle, created-by-law)** — CORROBORATE + reconcile. The bank-
  INSTITUTION lifecycle is the institution analogue of the #66 office lifecycle; the **Fed
  Reserve / Fed-Chair / Independent Treasury** offices #66 owns are *created by THIS genre's
  legislation* ("Create the Federal Reserve" → spawns the Fed-Chair office). Reconcile offices
  vs programs vs banking-institutions as one evolvable-stateful pattern. Source: POST 1.
- **#236 (alternate-government-form / sovereignty axis)** — CORROBORATE (light). Merge-with-
  World-Bank→one-world-currency + abolish-cash→digital-chip are loss-of-monetary-sovereignty /
  total-state-control edges (cf. the Communist abolish-NYSE Stock-Market item). Source: POST 4, 5.

---

### Provenance notes
- Single chunk; all 10 posts read. Pure design/crowdsourcing log (no die-rolls, no playthrough
  mechanics, no GM accept/reject ledger beyond the two routing rulings). vcczar (tier-1) authors
  the genre (POST 1), the `*-Default` reminder (POST 3, "Banking Left to the States"), and the
  two taxonomy rulings (POST 6 Stock-Market→Trade; POST 9 affirming gold/silver/fiat = Currency
  subtype). Community: POST 2 (crypto/electronic-banking/stocks), POST 4 (Vols21: Bank-of-Outer-
  Space / Interplanetary-Fund / one-world-currency / abolish-paper-currency-chip), POST 5
  (matthewyoung123: Stock-Market set), POST 7 (abolish-cash/cards), POST 8 (OrangeP47: gold/
  silver/bimetalism/fiat magnum opus).
- Codebase verified at `src/` HEAD 2026-06-28: `Legislation` (`types.ts:1506–1520`) has no
  `subtype`/prereq field; `Predicate`/`evalPredicate` ship for era events only; the `economic`
  meter (`types.ts:1399-1407`) ships but is not wired to proposal availability; no policy-genre
  store, prereq engine, banking-institution-state model, central-bank charter flag, or currency-
  standard store exists. The framework (#221/#237/#248/#258/#262/#206) + #66 banking-institution
  state remain **0% shipped** — consistent with every sibling content drop.
