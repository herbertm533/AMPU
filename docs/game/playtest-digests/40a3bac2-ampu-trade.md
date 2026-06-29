# Digest — "AMPU Trade" (`40a3bac2`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (politicslounge topic 1200, **Apr 2022**,
opened by **@vcczar**, tier-1 designer), **NOT a playthrough.** A policy-genre CONTENT drop
adding the **Trade** genre to the corpus — sibling of `c2bea165-national-security`,
`067233f3-guns`, `9f2ab25f-environment`, `1bf19872-taxation`, `faf2d8b3-drugs`, the
`518fb253` legis/exec/gov-actions sweep, etc. **3 posts / 1 chunk** (chunk-001, all covered).
Source CSV ~2.3 KB.
**Why it matters:** structurally identical to NatSec/Guns (corroborates the #221 three-primitive
framework, the #262 thin-primitive holes, #237 genre, #206 Future-band), BUT it surfaces **three
genuinely distinctive angles** the prior catalogs do NOT: (a) a **numeric-magnitude tariff-rate
axis** ("the number of tariff rates is quite large"; slight increase ↔ slight decrease) — a
*continuous* policy-strength dimension, sharper than NatSec/Guns' binary on/off levers; (b) an
explicit **policy-content vs Scripted-Event boundary** drawn by vcczar himself (NAFTA + Trump's
NAFTA update are **Scripted Events, NOT tariff policy**); (c) **trade ↔ diplomacy/industry
coupling** (trade-dispute, human-rights restriction, FTAs move foreign relations *and*
econ/industry support). PLUS — unlike NatSec/Guns which were 0% shipped — **Trade is the first
content genre with substantial SHIPPED scaffolding already in the build** (a diplomacy meter, two
tariff bills, a trade-treaty lever). See Engine facts.

> **DIGEST-ONLY batch** — writes ONLY this file; touches no living doc (`game-context.md` /
> the gap log are owned by a later consolidation agent). No historian ran this batch; era framing
> inferred from content + standard US trade history. All rows are an **authoring SNAPSHOT, not
> designer-ratified final content.**

---

## The Trade policy genre (the core artifact, POST 1) — UNTAGGED 3-partition form

vcczar posts under the standard **three flat header partitions**, no schema tags, and leads with
the coverage diagnosis: *"Era of the Future is probably the high need area … This is actually a
large section. The number of tariff rates is quite large."* Counts (POST 1):
**Legis Prop ~7 · Pres Actions ~8 · Gov Actions n/a (0).**

No `L-/P-/G-` mechanism prefix, no era-band abbreviation, no `Preq:` block — same pre-tag
authoring stage as every sibling drop. Note this genre is the **first where Pres Actions ≥ Legis
Props** (the lever set is presidential-action-heavy: tariffs are an executive instrument), a
contrast to NatSec/Guns where Pres Actions were the thin band.

### Content summarized by THEME (not pasted verbatim — POSTs 1–3)

- **★ Tariff-rate MAGNITUDE axis (the distinctive primitive):** **Various tariff rates** (Legis;
  vcczar flags the rate-enumeration as the big section) · **Slight increase to most tariffs** ↔
  **Slight decrease to most tariffs** (Pres; a paired up↔down *continuous-strength* lever, not a
  binary). This is a numeric policy-strength dimension new to the corpus.
- **Federalism / scope axis:** **Tariff laws set by states** (the genre's devolution pole —
  the recurring "leave it to the states" spine).
- **Embargo / retaliation cluster:** **Nonintercourse Act** · **Various retaliatory embargos**
  (Legis) · **Retaliatory Tariff** (Pres) · **Close country to outside trade** (Legis).
- **Trade-agreement / FTA cluster (★ diplomacy-coupled):** **Reciprocal Tariff Act** · **Israeli-US
  Free Trade Agreement** (Pres) · **Trade Promotion Authority** (LegProp — *"allows development of
  FTAs"*, POST 3) · **WTO accession/development** (POST 3) · **Trade Mission with X country**
  (Pres/Sec, POST 3) · **AGOA** — duty-free access for African countries (POST 3).
- **Conditional / values-linked trade (★ diplomacy-coupled):** **Restrict trade to countries with
  human-rights violations** (Legis) · **Raise a trade dispute with X country** (Pres — POST 3
  explicitly: *"likely hurting relations, but encouraging econ/industry support"*).
- **Named historical levers:** **Trump Tariffs** · **LBJ Tariff** (Pres). (NB: NAFTA is NOT here —
  see scripted-event boundary below.)
- **Agencies-created-by-law (#66):** **US Trade Rep (USTR)** (Pres in POST 1; also "establish the
  office of USTR" as Pres in POST 3, and a LegProp "establish USTR" — un-deduped) · **Export-Import
  Bank of the US** (Pres). Standing institutions in the #66 family.
- **★ Era-of-the-Future band (#206):** **Create tariff and trade policy for outer space** (Legis) ·
  the **"Space Jones Act"** vcczar references (POST 2). vcczar's flagged high-need band.
- **Shipping-protection sub-genre (POST 2):** **Jones Act** — require US-flagged vessels for goods
  shipped between US ports; @-author notes big impacts for **Hawaii / Puerto Rico** and the
  domestic-cruise foreign-layover workaround. Plus the **Space Jones Act** (Future mirror).

### Gov Actions — **n/a (0)** — the recurring thinnest-primitive hole (#262), same as NatSec.

---

## ★ The three distinctive angles (beyond plain content corroboration)

**1. Numeric-magnitude tariff-rate axis — GENUINELY NEW.** "Various tariff rates" + slight
increase/slight decrease is a **continuous policy-strength dimension**: a tariff is not on/off but
set to a *level*, adjustable up or down in increments. Prior genres' levers were binary (ban X / fund
up↔down by a fixed delta). The shipped `Tariff Increase`/`Tariff Reduction` bills
(`phaseRunners.ts:3421–3422`) are the *binary* version (fixed ±meter deltas); the thread asks for a
**graduated rate model** (a persistent per-good or aggregate tariff-rate program-state the levers
nudge). No shipped construct holds a "current tariff rate" value. **Candidate NEW delta** (does not
map to #221's flat-content shape — it's a magnitude/program-state model).

**2. Policy-content vs Scripted-Event boundary — GENUINELY NEW (cross-thread).** vcczar explicitly
carves **NAFTA + Trump's NAFTA update out of the tariff catalog as Scripted Events.** This is the
first content drop that *names* the boundary between authored policy-levers and scripted narrative
events — directly relevant to the prior "should some gov/exec actions be scripted events instead"
question. **Build mapping:** there is **no `ScriptedEvent` type**; the de-facto scripted-event
mechanism is **era events carrying an optional `templateId`** (`types.ts:1468`, tracked in
`game.eraEventsCompleted`, gated by the `Predicate` tree). So NAFTA-as-scripted-event *would* be an
era-event node, not Trade content — but **no trade/tariff era event exists** in `eraEvents1772.ts`
/ `eraEvents1856.ts` (those graphs are independence/antebellum). **Candidate NEW delta:** formalize
the policy-vs-scripted-event routing rule + (eventually) trade scripted events. (extends the
era-event/`templateId` infra; the *boundary rule* is novel.)

**3. Trade ↔ diplomacy / industry-support coupling — NEW-ish (partially shipped).** Trade levers
move **foreign relations** (human-rights restriction, FTAs, raise-a-trade-dispute) and **econ/
industry support** simultaneously (POST 3 spells out the trade-dispute trade-off: −relations,
+econ/industry). **Build reality — this is the one place Trade is partly shipped:** the snapshot
HAS a **`diplomacy: Record<string, number>`** meter (`types.ts:1574`, clamped −5..5, seeded with
real nations per scenario — `scenario1772.ts:82` Britain/France/Spain/Netherlands;
`scenario1856.ts:162` Britain/France/Spain/Mexico/Russia), a **DiplomacyPage** UI, a
**`diplomacyAtLeast` Predicate variant** (`types.ts:1498`), a diplomacy-drift phase
(`phaseRunners.ts:3585–3590`), and effects can already carry `diplomacy: {nation, delta}[]`
(`types.ts:1454`). There is also a **"Negotiate a trade treaty"** pres-action-shaped lever
(`phaseRunners.ts:3640`) that bumps **`diplomacy.Britain` +0.5 AND `meters.economic` +0.3** — a
proto-instance of exactly the trade↔relations coupling this thread wants. **Gap:** there is **no
national "industry support" meter** (industries are *per-state* `Record<string,number>`,
`types.ts:1328`; the nearest "industry" support axis is the **`Manufacturers` interest group** —
which the shipped tariff bills already move, `phaseRunners.ts:3421–3422`). So the diplomacy half is
shipped, the "industry support" half is approximated by an interest group, and the named-FTA/
human-rights/trade-dispute *content* is entirely unbuilt.

---

## Era span & predicate-gating (era-aware framing — IMPLIED, not authored; no historian)

vcczar dropped era/prereq fields; trade content is intrinsically era-banded:
- **Founding / early band (~1807–1830s):** **Nonintercourse Act** (1809) · the **Embargo**-family
  retaliatory acts (Jefferson-era) · **tariff laws / rate-setting** (Tariff of Abominations 1828
  era; "tariff laws set by states" is the perennial federalism pole, live early). The genre's only
  naturally *early* rows.
- **Mid band:** **Reciprocal Tariff Act** (RTAA 1934) · **Export-Import Bank** (1934).
- **Modern band:** **USTR** (1962) · **LBJ Tariff** (1960s) · **WTO accession** (1995) · **AGOA**
  (2000) · **Israeli-US FTA** (1985) · **Trade Promotion Authority** (2002) · **Trump Tariffs**
  (2018) · NAFTA/USMCA as scripted events (1994/2020).
- **★ Future band (#206):** **outer-space tariff/trade policy** · **Space Jones Act**. vcczar's
  flagged high-need band.
- **Predicate-gating (#258) implied INLINE:** USTR/Ex-Im/WTO/AGOA → era-window + "agency exists"
  gates; "raise a trade dispute with X" / FTA-with-X → a **per-nation target parameter** (the lever
  is parameterized by *which country*, like the era-event `diplomacy.nation` field but for an
  action); Trade Promotion Authority → a prereq for the FTA actions ("TPA in force" program-state).
  None written as an explicit `Preq:` field (same gap as #258).

---

## Engine facts (verified this run, do not re-derive)

- **NO trade-policy content & NO tariff-rate model.** Grepped `src/` for
  `tariffRate|USTR|TradeRep|Export-Import|outerSpace|tradeDispute|FTA|FreeTradeAgreement|tariffLevel`
  — **zero** content hits. No USTR, Ex-Im Bank, Reciprocal/Nonintercourse, embargo, AGOA, WTO, TPA,
  Jones Act, Trump/LBJ tariff, human-rights-restriction, or outer-space-trade lever anywhere. No
  "current tariff rate" program-state exists — the magnitude axis is **0% shipped.** (The
  `anytimeNationalEvents.ts:86` "tariff dispute reshapes regional industries" is flavor-text on a
  random event, **not** a trade-policy lever.)
- **★ Diplomacy IS partly shipped** (the genre's one foothold): `game.diplomacy:
  Record<string, number>` (`types.ts:1574`), seeded per scenario (`scenario1772.ts:82`;
  `scenario1856.ts:162`), clamped −5..5, surfaced by **`DiplomacyPage.tsx`** (status bands
  Allied/Friendly/Neutral/Tense/Hostile), driftable (`phaseRunners.ts:3585–3590`, SoS-skill drift
  `3292–3296`), gated by **`diplomacyAtLeast`** (`types.ts:1498`), and movable by any effect's
  `diplomacy:{nation,delta}[]` (`types.ts:1454`, applied `phaseRunners.ts:3221–3224`). A **shipped
  proto-trade lever exists**: "Negotiate a trade treaty" → `diplomacy.Britain +0.5` & `economic
  +0.3` (`phaseRunners.ts:3640`).
- **Two shipped tariff bills (the binary version of the magnitude axis):**
  `Tariff Increase` (`revenue +1, economic −0.5`, `Manufacturers +2 / FreeTrade −2`) and
  `Tariff Reduction` (`revenue −0.5, economic +0.5`, `FreeTrade +2 / Manufacturers −1`) —
  `phaseRunners.ts:3421–3422`. These are 2 of the **8 generic `BILL_TEMPLATES`**
  (`phaseRunners.ts:3420–3429`) randomly drawn for CPU factions; **not** a player-facing graduated
  tariff lever, and not era/prereq-gated. The `FreeTrade` ↔ `Manufacturers` interest groups
  (`types.ts:313`, `311`) are the shipped stand-in for "industry vs free-trade support."
- **NO national "industry support" meter.** Industries are **per-state** `Record<string, number>`
  (`types.ts:1328`; e.g. `states1856.ts:5–35`) nudged by lobby cards (`LOBBY_INDUSTRY`,
  `phaseRunners.ts:1631–1652`). The thread's "industry support" is best routed to the `Manufacturers`
  interest group, not a new meter (decision for consolidation).
- **NO `ScriptedEvent` type.** Grepped `ScriptedEvent|interface Scripted` — zero. Scripted events =
  **era events with `templateId`** (`types.ts:1468`, `eraEventsCompleted`); NAFTA-as-scripted-event
  would live there. **No trade/tariff era-event node exists** in either shipped era graph
  (`eraEvents1772.ts` / `eraEvents1856.ts` are independence + antebellum).
- **`interface Legislation`** (`types.ts:1506–1520`) carries only the 4-value `committee`
  (`Domestic|Foreign|Economic|Justice`) — **NO `subtype`, NO `policyGenre`, NO tariff-rate field, NO
  prereq/condition field.** The only condition construct is the `Predicate` tree
  (`types.ts:1487–1504`); it has `diplomacyAtLeast` but **no** "agency exists" / "policy active" /
  "tariff rate ≥ X" / "TPA in force" variant, so the USTR/Ex-Im "exists" gates and TPA prereq are
  unrepresentable (same #258 gap).
- **NO `policyGenre` / `presAction` / `govAction` / `subtype` / `prereq` tokens anywhere in `src/`.**
  The three #221 content primitives remain **designed-only, 0% shipped**; Pres-Action and Gov-Action
  primitives don't exist in the engine at all (so the genre's ~8 Pres Actions have no shipped home,
  and the n/a Gov-Action band is moot).
- → **Net:** EXTENDS the policy-genre corpus by one genre (Trade). Unlike NatSec/Guns this genre is
  **partly shipped** — the **diplomacy meter + trade-treaty lever + 2 tariff bills already exist** —
  but the **named trade content, the graduated tariff-rate model, an industry-support meter, the
  parameterized per-country actions, the scripted-event routing, and the #221 primitives are all
  unbuilt.**

---

## Candidate deltas for consolidation (map to EXISTING IDs; flag NEW where novel)

- **#221 (3-primitive content system)** — CORROBORATE, **0% shipped.** Populates a NEW genre
  (Trade): **L≈7 / P≈8 / G=0** (POST 1) + community add-ons (POSTs 2–3). First genre where **Pres
  Actions ≥ Legis Props** (tariffs are an executive instrument). Source: POST 1–3.
- **#262 (content-coverage / per-primitive balance)** — CORROBORATE. **Gov Actions = n/a (0)** again
  (the recurring thinnest-primitive hole); vcczar's headline ask is **Era-of-Future = high-need.**
  Inverse skew from NatSec/Guns on the Pres-Action band. Source: POST 1.
- **#206 (Era-of-Future under-content'd)** — STRONG CORROBORATE (vcczar's explicit lead ask).
  outer-space tariff/trade policy + Space Jones Act; no modern *or* future scenario exists to host
  them. Source: POST 1–2.
- **#66 (office/institution lifecycle, created-by-law)** — CORROBORATE. **USTR** and **Export-Import
  Bank** are law-created standing agencies, era-gated by founding dates; neither exists in the build.
  Source: POST 1, 3.
- **#258 (prereq / predicate-gated availability FIELD)** — CORROBORATE + ENRICH. Era-window + "agency
  exists" gates (USTR/Ex-Im/WTO/AGOA), a **"TPA in force"** program-state prereq for the FTA actions,
  and **per-nation target parameters** on actions (FTA-with-X, trade-dispute-with-X) the `Predicate`
  tree can't express (it has `diplomacyAtLeast` but no agency/policy-active variant). Source: POST 1, 3.
- **#248 (subtype taxonomy + opposed pairs + multi-tagging)** — CORROBORATE + ENRICH. Natural
  sub-sections (tariff-rate / embargo-retaliation / trade-agreements-FTA / agencies / shipping-Jones /
  future-space); opposed pair **slight tariff increase ↔ slight decrease** (the magnitude poles).
  **Cross-genre routing:** human-rights-restriction / trade-dispute / FTAs overlap **Diplomacy/Foreign
  Affairs** (`b8aecb83`, `a2312dd2`); Ex-Im Bank overlaps **Banking**; tariff revenue overlaps
  **Taxation** (`1bf19872`). Source: POST 1–3.
- **★ #237-adjacent but GENUINELY NEW — numeric tariff-rate MAGNITUDE axis.** A continuous
  policy-strength dimension (set a rate, nudge ±) needing a persistent "current tariff rate"
  program-state; the shipped tariff bills are only the binary version. Does NOT fit #221's flat-content
  shape. **Candidate NEW delta.** Source: POST 1.
- **★ GENUINELY NEW — policy-content vs Scripted-Event boundary RULE.** vcczar carves NAFTA out as a
  Scripted Event, not tariff content; ties to the prior "some actions should be scripted events"
  thread. Build has no `ScriptedEvent` type (only era-event `templateId`) and no trade era-event.
  **Candidate NEW delta.** Source: POST 1.
- **★ NEW-ish (PARTLY SHIPPED) — trade ↔ diplomacy/industry coupling.** Trade levers move foreign
  relations + econ/industry support together. The **diplomacy meter + "Negotiate a trade treaty"
  lever + FreeTrade/Manufacturers-moving tariff bills are SHIPPED**; missing is a national
  industry-support meter (or a decision to use the `Manufacturers` interest group) and the named
  trade content that drives the coupling. Source: POST 3 + engine facts.

---

## Open questions (for consolidation / the human, not answerable mid-run)

1. **Tariff-rate model granularity:** is "various tariff rates" one aggregate national rate, a
   per-good/per-sector schedule, or per-country? Where does the "current rate" program-state live, and
   how big is a "slight" increase/decrease relative to the existing ±0.5/±1 meter deltas of the shipped
   tariff bills?
2. **Industry support — new meter or existing interest group?** The thread's "econ/industry support"
   has no national meter; the shipped `Manufacturers` interest group is the natural home. Confirm vs.
   adding a dedicated meter.
3. **Scripted-event routing:** NAFTA = era-event-with-`templateId`. What's the rule for which trade
   items are policy-levers vs scripted events, and do trade scripted events get their own (modern) era
   graph (none exists today)?
4. **Per-country action parameterization:** FTA-with-X / trade-dispute-with-X / trade-mission-with-X /
   close-country-to-trade are parameterized by *which nation*. The engine has `diplomacy` keyed by
   nation but no UI/action for the player to pick a target. How is the target chosen, and from what
   nation list (the per-scenario seeded set)?
5. **Authoring SNAPSHOT:** un-deduped (USTR appears as both a POST 1 Pres Action and a POST 3
   Pres/LegProp; Jones Act referenced before being formally listed). No designer accept/reject replies.
   Treat counts (L≈7 / P≈8 / G=0) as floors, not finals.

---

### Provenance notes

- Single chunk; all 3 posts read (`manifest.json` posts=3 / chunks=1). Pure design/crowdsourcing log —
  no die-rolls, no playthrough mechanics, no GM accept/reject ledger. **vcczar** (tier-1) authors the
  genre + the Future-high-need framing + the scripted-event carve-out (POST 1, with the standard
  `@`-roster); POSTs 2–3 are community add-ons (Jones Act / Space Jones Act; WTO / TPA / USTR / Trade
  Mission / AGOA / trade-dispute), none ratified in-thread.
- Codebase verified at `src/` HEAD 2026-06-29: **diplomacy meter shipped** (`types.ts:1574`,
  `diplomacyAtLeast` `types.ts:1498`, `DiplomacyPage.tsx`, seeded `scenario1772.ts:82` /
  `scenario1856.ts:162`, drift `phaseRunners.ts:3585`, treaty lever `phaseRunners.ts:3640`); **2 tariff
  bills shipped** in the 8-row `BILL_TEMPLATES` (`phaseRunners.ts:3421–3422`); **no** tariff-rate model,
  USTR, Ex-Im, FTA, embargo, AGOA, WTO, TPA, Jones-Act, human-rights, or outer-space-trade content
  (grepped, zero hits); **no national industry meter** (industries are per-state, `types.ts:1328`);
  **no `ScriptedEvent` type** (scripted = era-event `templateId`, `types.ts:1468`); `Legislation` has no
  subtype/policyGenre/prereq (`types.ts:1506–1520`); the #221 primitives remain **0% shipped.** Trade is
  the **first content genre with a real shipped foothold** (the diplomacy half), but its named content +
  the three distinctive systems are unbuilt.
