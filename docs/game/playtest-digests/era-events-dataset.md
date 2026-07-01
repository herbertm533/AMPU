# Era-events dataset digest (`Era Evos Standardizing` sheet)

**Type:** authoritative era-event CORPUS (dataset ingest, NOT a forum playtest) ·
**Source:** `b41ac9b1-Copy_of_Era_Evos_Standardizing.xlsx`, 2 tabs (`EraEvos` =
2,475 events × 49 cols; `EventsbyHalfTerm` = per-half-term pacing) ·
**Tag:** `era-events` · **Scope:** the full scripted era-event content, 16 eras,
Independence (1772) → Distant Future (speculative). ·
**Inputs read:** `sources/era-events/analysis.md` (schema + reconciliation table +
reconcile-with-prior-ingests mandate), `sources/era-events/sample.md` (decoded
events), `sources/era-events/eraevos.csv` (spot-read), the historian companion
`historical-context-era-events.md`. Cite by CSV row / sample section (no forum
`POST n` markers — this is a spreadsheet).

> **Why it matters.** This is the **ground-truth era-event corpus** the shipped
> era-event system (~105 events across 2 eras) should reconcile against — a
> ~24× superset in event count and an 8× superset in era coverage. It is also
> the **flat-file authoritative base** for the content-primitive cluster
> (#221/#248/#258): the 1,664 `Requires` clauses ARE the `Predicate`-gated
> availability data #258 has been describing from forum threads, and the Type
> genre + per-response effects ARE the schema fields #221/#248 ask for. The
> user's key ask — **do the forum event threads still add anything beyond this
> sheet, especially for future eras?** — is answered in `## ★ Prior-ingest
> reconciliation` below (short answer: the sheet is the authoritative flat base;
> the forum threads remain ADDENDA that supply the event-CHAIN DSL the flat
> sheet lacks, specific modern/future events + SC cases, and elaborated
> mechanics).

## ★ Schema & the shipped-model reconciliation

The 49-column model (analysis.md §Schema) reconciles to the shipped `EraEvent`
(`types.ts:1466`) as follows — deltas flagged:

| Sheet column | Shipped field | Verdict |
|---|---|---|
| Event / Scripted_ID | `title` / `templateId` (tracked in `game.eraEventsCompleted`) | ✓ maps |
| Era Starts / Deactivate-when-era-≥ | (no direct field) | era-band gating → #206; shipped uses literal `year` + the 1772 graph, `Era` enum = 4 values (`types.ts:1337`) |
| Requires (1,664 events) | `precondition: Predicate` (`types.ts:1487`) | ★ #258 — a serializable predicate tree ships but is wired to the 1772 graph ONLY; the sheet's `Requires` is the ground-truth DATA for it |
| Description / Wiki / Historic Year | `description` (+ authoring anchors) | ✓; Wiki/Historic-Year are author-time only |
| **Type** (Flavor / Foreign-Mil / Domestic / Economics / Judicial) | **(NONE)** | ★ no genre/`type` field on `EraEvent` → #221 (two-category taxonomy) + #248 (subtype) |
| **Percent Chance** (fire probability) | **(no explicit field)** | fold on #221 as an event-record field (fire-probability); scripted events fire deterministically today |
| Pres Response A–F | `responses: EraEventResponse[]` | ✓ shape; shipped array unbounded, sheet caps at 6 |
| **Resolve (ability, 'Admin unless stated')** | **(NONE)** — shipped `decider` is an OFFICE (`president\|congress\|cabinet\|cc-president\|auto`) | ★ **NEW #340** — per-response ability-resolution, no owner |
| Immediate Meter shifts (1,222 events) | `effect.meters` / `effect.domesticStability` | ✓ (often probabilistic — "25% chance − dom stab") |
| **Immediate Office Points Gained/Lost (10% next-election carry)** | **(partial)** | ★ **NEW #341** — office-points effect + carry, no channel in `EraEventResponseEffect` |
| Immediate Point gains/losses | `effect.interestGroups` / `effect.enthusiasm` / `effect.partyPreference` | ✓ (faction/ideology point awards) |
| Leads to Treaty (101 events) | `effect.diplomacy` / `postEffects.startWar\|endWar` | partial |
| Special Rules "Game Ends" | `EraEvent.triggersGameEnd` (`types.ts:1476`) | ✓ — the terminal-branch flag DOES ship (Conciliatory-Resolution opt-B, SpaceBotUSA) |

## ★ The coverage delta (the headline scale gap)

Sheet: **2,475 events across 16 eras**, Historic-Year 1772→2022 (n≈1,436
dated; the rest `alt`/`n/a`). Shipped: **~65 (`eraEvents1772.ts`) + ~40
(`eraEvents1856.ts`) = ~105 events across 2 eras**; the `Era` enum has **4**
values (`independence|federalism|nationalism|modern`, `types.ts:1337`, no
`populism`/`future`). So **~14 of 16 eras are 0% shipped**, incl. both future
bands. Per-era counts (normalized): Nuclear Age 304, Ideologies 283, Gilded 252,
Progressivism 238, Nationalism 157, Neocons 156, Manifest-Destiny 153, Normalcy
145, Federalism 134, Democracy 121, Terror 120, Republicanism 95, Populism 95,
Distant-Future 81, Independence 71, Near-Future 70. The density curve tracks real
American eventfulness well (historian §1). → this is the content-side scale of
**#206** (doubly-unbuilt future band + coarse enum) and **#262** (coverage as a
tracked dimension); it does NOT change the architecture, it QUANTIFIES it.

## ★ The precondition model (#258 — the sheet IS the `Requires` ground truth)

**1,664 / 2,475 (67%)** events carry a `Requires` clause. This is the flat-file
authoritative source for the exact predicate-gating machinery #258 has been
inferring from forum genre threads. The predicate vocabulary the sheet exercises
matches #258's captured class list precisely: **prior-event-occurred** (Gaspée →
Committees of Correspondence; Bay-of-Pigs-blundered → Cuban-Missile-Crisis),
**mutually-exclusive world-state forks** (the Louisiana pair — "France HAS
regained Louisiana" vs "France has NOT," each gating a different purchase
event), **trait/eligibility gates** (Watergate fires for any `Controversial`
incumbent, not just Nixon), **active-war/era** (Conciliatory Resolution requires
"Rev War occurred + not ended"), and **world-nation state** (Franco took control
+ Spain not Communist). It is **historically-literate at the link level but
explicitly branching** (historian §4): real causal edges seed the early links,
blunder/"Game Ends"/regained-state flags let a resolved event rewrite the
world-state the next tier reads → an alt-history tree, not a rail. This is the
strongest single confirmation of #258 to date AND supplies the data; the
shipped `evalPredicate`/`Predicate` is wired 1772-graph-only, so extending it to
1856 + both anytime pools + a future band (the #258 requirement) is exactly what
loading this corpus needs.

## ★ The Resolve-ability delta (candidate NEW #340)

Every filled Pres Response A–F carries a **Resolve** cell — the ABILITY that
resolves it, canonically **"Admin unless stated otherwise,"** with per-response
overrides (Louisiana = a Pres/State/Ambassador modification; Pullman = Pres
*Judicial*; Bleeding Kansas = Pres *Governing*). Each response also has a
**Modification** cell (the modifier applied to the check) and a **Points** cell
(faction/ideology award). The shipped `EraEventResponse` (`types.ts:1459`) is
`{ id, label, description, effect }` — it has **NO ability-resolution at all**,
and `EraEvent.decider` (`types.ts:1473`) is an **OFFICE** that chooses WHO
decides, not an ability that resolves HOW WELL. So a response's success being a
`skill`-check against the shipped `Skills` (admin/legislative/judicial/military/
governing/backroom `types.ts`, 0–5) is unrepresentable. This is the era-event
analogue of the war engine's per-action `success% = … + officer(Mil×10) …`
(#56) and the investigation guilt roll (#330) — but for the era-event response
menu, and it is UNOWNED. → mint NEW.

## ★ The office-points effect delta (candidate NEW #341)

Two effect columns — **Immediate Office Points Gained** and **Lost** — each
headed *"(carries 10% chance of ±1 for the officer in next election)"*. The
effect names an OFFICE (Pres / Gov of NY / Sec of State …) that gains or loses
office-points from the event, AND carries a **10% chance of a ±1 election
modifier for that office-holder in the next election** (1,611 events carry a
gained-value; SpaceBotUSA loses `Pres` office-points). The shipped
`EraEventResponseEffect` (`types.ts:1448`) can touch meters / partyPreference /
enthusiasm / interestGroups / domesticStability / diplomacy / startWar / text —
there is **no office-points field and no next-election-carry** anywhere.
Office-points-as-a-currency + a probabilistic carry into the election modifier
is a distinct effect channel with no owner (the next-election-carry idea also
has no analogue in the shipped election path). → mint NEW.

## ★ The Type / genre delta (folds on #221 + #248)

Type distribution: **Flavor 1,348 · Foreign-Mil 621 · Domestic 428 · Economics
71 · Judicial 7.** The Flavor majority = ambient cultural/scientific texture
(Nike/Apple/Sears-Tower/Rocky-Horror), mostly precondition-free — this is
exactly the FLAVOR tier #221 already models (the `isFlavor` flag + player toggle
from `b73925a4`, and the "Era Evo" corporate-flavor category from `f1209123`).
The 5-value genre set (Flavor/Foreign-Mil/Domestic/Economics/Judicial) is the
**scripted-event realization of the 33-value subtype axis #248** owns (it maps:
Foreign-Mil→Military/Diplomacy/Warfare, Domestic→many, Economics→Banking/
Currency/Taxation, Judicial→Courts). Note the **genre skew** (Judicial only 7,
Economics 71) the historian flags: big court/economic turning points are filed
Domestic/Flavor — a coverage observation for #262, not an error. → SHARPEN #221
(the Type = the scripted-event genre field the two-category taxonomy needs) +
#248 (Type ⊂ the subtype axis).

## ★ Prior-ingest reconciliation — THE CHOSEN PATH FORWARD

The core deliverable. Cross-referenced the sheet against the existing content
cluster (#221/#248/#258/#206/#169/#237/#262) and every future/modern-era digest
(`8f7ae0b9` b61 chain-DSL, `2bb66197` b57 speed-run, `df11a769` b58 Trump-2.0,
`27711296`/`24061ad6`/`3a0e70be` Biden, `c8d3fd84` b63 2025-29, `c54b7a9d`
2022-2072 run, `eaf5cc51` future ideas, `07fa6116`/`964b8857`/`aa227625` future
SC cases, `0b1adc59` b63 scripted-vs-general). Conclusion:

**THE SHEET IS THE AUTHORITATIVE FLAT BASE CORPUS. THE FORUM THREADS ARE
ADDENDA, NOT SUBSUMED.** The sheet is a SUPERSET on flat-event *count* (2,475 vs
the forum threads' hundreds of scattered ideas) and it is the CANONICAL source
for the base identity + `Requires` precondition + Type + per-response effects of
each historical event. But it is a **FLAT** file — one row per event, one
`Requires` string per row — and it is **MISSING three things the forum threads
uniquely supply**:

1. **The event-CHAIN DSL structure.** `8f7ae0b9` (b61) authors the future era in
   a `A -> B` / AND / OR / NOT notation with green=bill / red=president-action
   nodes AND a one-to-many **blocker edge** ("Climate Control BLOCKS [disaster
   cluster]") — a first-class negative/suppression edge the flat sheet's single
   `Requires` string cannot express (the sheet can only NOT-gate each blocked
   event individually). The sheet's `Requires` IS a predicate, but the chain
   TOPOLOGY (multi-edge graphs, blocker groups, the China-Fragments/
   Russia-Fragments/ideology-takeover war-chains) is forum-only. → the sheet
   populates #258's predicate DATA; `8f7ae0b9` supplies #258's chain STRUCTURE.

2. **Specific modern & future events + SC cases the sheet doesn't have.** The
   sheet's dated content STOPS at 2022 (n≈1,436, last dated ≈ Russia-invades-
   Ukraine); the Near/Distant-Future rows (151 total) are speculative but do NOT
   include the concrete post-2022 catalogs: the Trump-2.0 bills/exec-actions
   (`df11a769` #329), the Biden 2021-25 band + the elderly-president-drops-out
   mechanic (#169), the 2025-29 tariff/A&S-deportation actions (`c8d3fd84`), or
   the ~30-case future-SCOTUS docket (`964b8857`/#270 robot-personhood/
   consciousness-upload/space-colony jurisdiction). The sheet has 7 Judicial
   events TOTAL — the forum SC-case threads are the whole judicial future.

3. **Elaborated mechanics.** The sheet has no genre `*-Default` baseline, no
   L/P/G/S mechanism prefix, no create→expand→cut program lifecycle, no
   graduated-intensity tiers — all of which the #237 policy-genre threads and
   #221 primitive threads author. The sheet is scripted-EVENTS; the Legis-Prop /
   Pres-Action / Gov-Action / SC-Case primitives (#221/#248) and their stateful
   toggles (#237) live in the genre threads, not here.

**Coexistence model (recommendation to game-master / tech-lead):** treat the
sheet as the **authoritative base era-event table** (identity + `Requires` +
Type + effects + Percent-Chance), imported as the seed for the historical bands;
overlay the forum threads as **addenda** that (a) supply the chain-DSL topology
(#258 via `8f7ae0b9`), (b) add the modern/future event + SC-case content the
sheet lacks (#169/#329/#270/future digests), and (c) elaborate the primitive/
genre mechanics (#221/#237/#248). Do NOT let either supersede the other; where
they overlap (robot/AI/climate/China themes appear in BOTH the sheet's
Distant-Future rows AND `8f7ae0b9`/`2bb66197`), **the sheet is canonical for the
event's existence + preconditions, the forum digest for its chain wiring +
response detail.** The historian's warning stands: do NOT assume the sheet
subsumes b61's chain content.

## ★ Future eras in the sheet (Near 70 / Distant 81)

The sheet DOES carry a substantial speculative corpus (Historic-Year = `alt` /
`n/a`, intentional, NOT date errors): **Near Future** (population decline →
human-cloning/Social-Security responses; Russia reclaims Soviet territory) and
**Distant Future** (sentient robots — Robot Controversy/Soldiers/State-Judge/
Fundamentalist-Terrorism; AI–human augmentation; cloned historical figures;
climate-refugee coasts; new speculative parties — Earth/Science/Universe/
Humanitarian; China-language/cloning; Antarctica nationhood; SpaceBotUSA "Game
Ends"). This overlaps `8f7ae0b9`/`2bb66197`/`c54b7a9d` heavily on themes but is
FLAT where they are chained — reinforcing the addenda model above. These bands
have **no shipped `Era` enum slot** (#206). This is the FIRST authoritative
data-source that actually populates the future bands with concrete events (prior
future coverage was all forum-idea threads) — a meaningful sharpen of #206
(previously "under-content'd at source"; the sheet shows 151 future events
authored, though flat/un-chained).

## ★ Data-quality (normalize on ingest)

- Era-label dupes/typos: `Era of the Ideologies` (100) vs `Era of Ideologies`
  (183); singletons `Era of Neocons`×1 (vs `…the Neocons`×155),
  `Era of the Nationalism`×1 (vs `Era of Nationalism`×156).
- Header typo: col 37 label is `Points D` (should be `Points E`).
- 7 trailing empty columns (42–48).
- HalfTerm tab mislabels the 1972-99 band as a 2nd "Era of the Ideologies" (150)
  — reconcile to "Neocons" (historian §1).
- Embedded commas/quotes in Description/Response cells shift naive CSV column
  parsing — read via the decoded sample.md or a real CSV parser, not `awk -F,`.

## Shipped-vs-designed (summary)

| Area | In the build today | In the sheet (designed) | Delta |
|---|---|---|---|
| Coverage | ~105 events, 2 eras, `Era` enum = 4 | 2,475 events, 16 eras incl. 2 future | ~24× superset; ~14 eras 0% (#206/#262) |
| Preconditions | `Predicate`+`evalPredicate` ship, wired 1772-graph-ONLY | 1,664 `Requires` clauses (the ground-truth data) | extend the interpreter to all bands (#258) |
| Chain topology | 1772 graph nodes + edges | FLAT — one `Requires` string per row | sheet lacks the DSL; forum `8f7ae0b9` supplies it (#258) |
| Response resolution | `decider` = an OFFICE; no ability check | per-response **Resolve** ABILITY (Admin unless stated) + Modification | **NEW #340** |
| Effect channels | meters/points/diplomacy/startWar/text | + **office-points + 10% next-election carry** | **NEW #341** |
| Genre | none on `EraEvent` | **Type** (Flavor/Foreign-Mil/Domestic/Economics/Judicial) | Type = the scripted-event genre field (#221/#248) |
| Fire probability | scripted events fire deterministically | **Percent Chance** per event | fold on #221 (event-record field) |
| Game-end branch | `triggersGameEnd` ✓ ships | "Game Ends" special rule ✓ | ✓ maps (Conciliatory-Resolution, SpaceBotUSA) |

## Delta list

- **NEW #340** — per-response **Resolve-ABILITY** model (each A–F response
  resolved by an ability check, "Admin unless stated"; shipped `decider` is an
  OFFICE not an ability; `EraEventResponse` has no resolve/modification field).
- **NEW #341** — **office-points + 10%-next-election-carry** effect channel (an
  event grants/removes office-points to a named office-holder + a 10% chance of a
  ±1 next-election modifier; absent from `EraEventResponseEffect`).
- **SHARPEN #258** — the sheet's 1,664 `Requires` clauses are the AUTHORITATIVE
  flat DATA for the predicate-gating machinery; the forum `8f7ae0b9` chain-DSL is
  the STRUCTURE the flat sheet lacks (the chosen coexistence path).
- **SHARPEN #221** — the sheet's **Type** = the scripted-event genre field the
  two-category taxonomy needs; **Percent Chance** = the fire-probability
  event-record field; the sheet is the authoritative base for the scripted-event
  primitive; Flavor 1,348 corroborates the flavor tier.
- **SHARPEN #248** — the 5-value Type genre is the scripted-event realization of
  the 33-value subtype axis (Type ⊂ subtype).
- **SHARPEN #206** — the sheet is the FIRST authoritative data-source populating
  the future bands (151 Near/Distant-Future events), though flat/un-chained; both
  future bands still have no `Era` enum slot.
- **SHARPEN #262** — the 2,475/16 vs ~105/2 coverage gap quantifies the
  content-coverage dimension; the Judicial-7 / Economics-71 genre skew is a
  concrete coverage-imbalance datapoint.

## Open questions (for the human / game-master)

1. Import the sheet as the base era-event table for ALL 16 historical/future
   bands, or only the shipped 2 eras + defer the rest? (feeds #206 enum
   decision).
2. Is the per-response **Resolve** ability always a president skill-check, or
   does the responding OFFICE (Sec of State, Ambassador, Governor) supply the
   skill? (the overrides suggest office-scoped — reconcile with #340).
3. Does the **10% next-election carry** apply to the office-holder at event-time
   or at election-time if they've changed? (#341).
4. Reconcile the sheet's flat `Requires` against `8f7ae0b9`'s multi-edge chain
   DSL: is the chain topology re-derivable from the flat `Requires` graph, or is
   it genuinely additional authoring? (the blocker-edge suggests additional).
