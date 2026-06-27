# Digest — "Legislative Proposals, Executive Actions, Governor Actions" (`518fb253`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (Mar 2022), **NOT a playthrough**.
**Batch 33** · 41 posts / 1 chunk · GM/author: **@vcczar** (tier-1 designer).
**Why it matters:** this is a **primary authoring source for the #221 content-primitive
registry** — vcczar opens an explicit call (POST 1) for new **Legislative Proposals**,
**Presidential (Executive) Actions**, and **Governor Actions**, era-keyed to the
*Continental Congress→1788* band, the *1800–1900* band, and the *Era of the Future
(2024–2100)*; the community proposes, vcczar accepts/rejects/maps each into the live
content catalog. It reveals the **shape, era-keying, balance rules, and acceptance
bar** of the three content primitives that #221 / #236 / #237 all consume. Pure design
intent — **0% shipped** (corroborated below).

---

## The content-primitive model (the #221 shape)

vcczar treats AMPU's content as **three authored primitive types**, each an
**era-keyed catalog entry** selectable by humans *and CPUs*:

1. **Legislative Proposals** — federal **and** state-level bills (incl. constitutional
   amendments) put up for a vote. Each carries **political consequences / meter
   effects** and is **era-gated** (turned on at a historical date/band). Examples
   authored/accepted: Blaine Amendment (POST 9-10), ban on ≥90-proof alcohol (POST 6),
   national 40-hr-week/overtime law — **added at state level** (POST 7, 11), Lighthouse
   establishment bill (Washington-era, POST 32-33), National Road tiers (POST 24-28).
2. **Presidential / Executive Actions** — president-only actions, era-gated; vcczar
   uses these as the modern stand-in for things too granular to legislate (e.g. sports
   betting represented via the *Murphy v. NCAA* case rather than its own action, POST 13).
3. **Governor Actions** — **state-scoped** actions a governor performs. **★ Key
   structural constraint (POST 31):** *"all gov actions, as they currently are, are the
   **same for every state**"* — there is **no per-state action table** yet; gov actions
   are a flat, state-agnostic list applied uniformly, because governors were the
   lowest-priority entity (originally only ratified amendments, then accreted "token
   things to do"). Per-state unique actions are explicitly **deferred** ("if I have
   nothing on the to-do list"). Examples accepted: legalize casinos / lottery /
   prostitution with **historic activation dates** (POST 8); attract-immigration-to-grab-
   a-House-seat (POST 5, discussed); reapportion-via-immigration; statues-to-Statuary-Hall
   (POST 37).

**Structural attributes of a primitive, as evidenced:**
- **Era/date gating** — every item is "turned on" at a historical date or band; vcczar
  repeatedly cites real activation dates (casinos/lottery ~post-1990, POST 8; National
  Road authorized 1820, funds ran out Vandalia 1839, POST 28). Corroborates **#92/#221**
  (per-category, era-activated content).
- **Realm-of-possibility gate** (POST 1, repeated) — historical OR hypothetical but
  plausible; **bizarre/joke laws REJECTED** (POST 6) on an explicit CPU-realism rationale:
  *"the computer players might end up proposing them, which will take away from the
  realism."* This is a **content-curation rule driven by the CPU author** — fluff dilutes
  the CPU's selection pool. Reinforced POST 16/18: vcczar adds only items of "a certain
  level of importance," fears fluff "if I add a bunch of fluff legislation, the Computer
  players might start selecting that instead of things that should be more important."
- **Meter / payoff effects** — items carry tradeoffs across the national meters: QOL vs.
  economic-loss (Pony Express, POST 29-31), military-preparedness vs. economic cost
  (Coastal Fortifications "1st/2nd/3rd System," POST 38), "military preparedness" framed
  as a meter. Corroborates the meter-effect model behind **#20** (gov actions move state/
  national meters) and the bill→meter coupling behind **#237**.
- **Escalating / tiered series** — primitives come in graded ladders: escalating
  Prohibition laws 1865→1919 (POST 3), escalating coverture laws (POST 3), National Road
  extension *tiers* (MD→OH→IL/NewOrleans→Jefferson City MO, POST 24-28), the 1st/2nd/3rd
  Coastal-Fortification systems (POST 38), patent lifespan increase/decrease (POST 14).
  Implies primitives can chain via **prereqs** (a later tier requires the earlier; a
  fallback execution method unlocks if the prior is ruled unconstitutional, POST 15/19).
- **Multiple-choice / option-set primitives** — some legislation is a *pick-one-option*
  card that "stir[s] up different groups": National Anthem selection (Dixie / Battle Hymn /
  This Land… each antagonizing a different bloc, POST 35-36); execution-method swap as a
  fallback when a method is struck down (POST 15, 19). The primitive can be a branching
  choice, not just a yes/no.
- **Territory/ownership prereqs** — Indian Removal gated by state (POST 23); inviting
  other Crown colonies into the Continental Congress yields **post-Rev-War states** (POST
  30) — content gated on territory, corroborating **#92** (territory-ownership filter).

**★ CPU-selection BUFF mechanic (corroborates #92 / CPU-AI cluster):** OrangeP47 proposes
giving real/historical items a **~20% selection buff** over ahistorical ones so an all-CPU
game trends historical while humans stay unconstrained (POST 18). vcczar replies **"Buffs
by era kind of exist already"** (POST 20) — i.e. the content registry already carries an
era-weighted CPU-selection bias. NEW datum on how the CPU picks from the primitive pool
(distinct from, and feeding, the #70–#78 CPU heuristics).

---

## Era coverage of the authored content (density read)

vcczar's POST-1 needs list itself ranks the **coverage holes**, which is the most useful
signal — it tells us which bands are thin:

| Band | Legis Props | Pres/Exec Actions | Gov Actions | Density signal |
|---|---|---|---|---|
| **Continental Congress → 1788** | NEEDED (obscure/hypothetical ok) | n/a (Pres/Exec actions **not functional pre-Constitution**, per #92/`ampuData`) | NEEDED (pre-1788, history or hypothetical) | **Thin** — vcczar soliciting both. CC can invite colonies → new post-war states (POST 30) |
| **1800–1900** | NEEDED "in general" | NEEDED "in general" | NEEDED "in general" | **Moderate but admittedly incomplete** — the single biggest ask; most of the thread's accepted content lands here (Prohibition ladder, coverture, Blaine, Lighthouse, National Road, Coastal Forts, Jim Crow/poll-tax/literacy, fugitive-slave [state-level NOT yet done, POST 31], railway-ownership [NOT yet done, POST 31]) |
| **Era of the Future (2024–2100)** | **LOW priority** ("could also consider," POST 1 item 8) | **NEEDED** (POST 1 item 7) | **NEEDED** (POST 1 item 6) | **Thinnest / stub** — Gov + Exec actions explicitly wanted, legislation deprioritized. **★ Directly corroborates #206** (Future band is a doubly-unbuilt stub: under-content'd AND absent from the shipped `Era` enum). Modern/future suggestions: legalize-all-drugs, crypto regulation, abolish single-family zoning, high-speed rail, max-wage (POST 34) |

**Known-gaps vcczar self-flags (authoring-side holes for #221):**
- Gov actions are **state-agnostic** (POST 31) — no per-state unique-action table; the
  biggest structural admission.
- **Not yet authored** (POST 31): **railway-ownership bills**, **state-based fugitive-slave
  acts**, **Native-American suffrage by state** (can't include because it doesn't apply to
  all states + the flat-gov-action constraint).
- Casino/lottery **legalization dates post-1990 are missing/unresearched** (POST 8) — a
  data-completeness hole in the modern band, deferred to early-release playtests.
- The Future-band content is sparse and low-priority (above).

---

## #236 / #237 dependency — CONFIRMED

This thread is the **upstream authoring layer** both #236 and #237 sit on top of:
- **#237 (stateful policy-genre framework, `businesslabor`)** consumes exactly these
  primitives — its `L/P/G/S` mechanism prefixes are **L**egis-Prop / **P**res-Action /
  **G**ov-Action / **S**cripted-event, i.e. the three primitives authored here (+ scripted
  events). The escalating-ladder + `*-Default` baseline + prereq-chain shape #237 formalizes
  is visible *in the raw* here: the Prohibition ladder, coverture ladder, National-Road
  tiers, and execution-method fallback are all prereq-chained, era-keyed primitive series.
  → **#237 is a typed/stateful framework over this thread's content primitives. Confirmed.**
- **#236 (alternate-government-form axis, `tomorrowlist`)** consumes the same primitives —
  each alt-government (Fascist/Communist/Theocratic USA) unlocks a menu of **Pres-Actions +
  Legis-Props + Scripted-Events**. The "authoritarian kit" #236 describes is a *reusable
  bundle of these primitives*. → **#236 depends on the #221 primitive system. Confirmed.**
- Both #236 and #237 also corroborate the **Era-of-Future content hole** this thread
  flags (POST 1 items 6-8) — the Future band is where all three converge as under-authored.

---

## Shipped-vs-designed (verified against `src/`)

**The Pres-Action / Legis-Prop / Gov-Action content-primitive SYSTEM is UNBUILT.**
Verified 2026-06-27:
- `grep -rniE "presAction|legisProp|govAction|scriptedEvent|presidentialAction|
  executiveAction|governorAction|legislativeProposal" src/` → **ZERO files** (corroborates
  batch-32's identical null result).
- No `presActions` / `govActions` / `scriptedEvents` data file or type exists in
  `src/data/` or `src/types.ts`. `src/data/` ships only era-events (`eraEvents1772.ts`,
  `eraEvents1856.ts`), `anytimeEvents.ts`, `anytimeNationalEvents.ts`, scenarios, factions,
  states, draft classes — **no authored Legis-Prop / Pres-Action / Gov-Action catalogs**.
- What *does* ship is **adjacent but not the same thing**: a `Legislation` interface
  (`types.ts:1506`, a runtime *instance* record, not a registry); bills generated from
  tiny inline `templates` arrays (`continentalCongress.ts:237` ≈ 3 CC bill templates; a
  modern proposer in `phaseRunners.ts:3437+`); and `Legislation.effects` reusing
  `EraEventResponseEffect`. There is **no era-keyed authored proposal pool, no
  Pres-Action type at all, and no Gov-Action type at all.** Gov-action work in the build is
  effectively absent (the engine has `runCurrentPhase` phases but no gov-action content).
- **Flag for tech-lead:** #221 needs (a) three new content-primitive types
  (LegisProp / PresAction / GovAction) + a scripted-event type, (b) per-category
  **era-activation gating** (Pres/Gov actions inactive pre-Constitution), (c) the
  **realm-of-possibility / importance curation** baked in as a `scripted-vs-flavor` tier
  flag (#221), (d) a **CPU era-weighted selection buff** ("buffs by era kind of exist
  already," POST 20), (e) the flat-vs-per-state gov-action axis (today flat; per-state is
  the deferred upgrade, POST 31), (f) option-set / branching primitives + prereq-chained
  ladders. None of this exists in `src/` today.

---

## Candidate gaps for consolidation

*(Mostly CORROBORATES existing rows — flag NEW where noted. Consolidation agent owns the
gap-log edit; this is the hand-off list.)*

- **#221 (content-primitive registry)** — CORROBORATE + ENRICH. This is a **primary
  authoring source**. Adds concrete shape: three primitive types (Legis-Prop / Pres-Action /
  Gov-Action) + scripted events; era/date gating; **realm-of-possibility + importance
  curation rule** (CPU-realism rationale, POST 1/6/16/18); **escalating ladders + prereq
  chains** (Prohibition/coverture/National-Road/Coastal-Forts/execution-fallback); **option-
  set / branching primitives** (National Anthem, execution method); **meter/payoff effects**
  (QOL vs economic vs military-prep). Cite POSTs 1, 3, 5-8, 15, 16, 18, 24-38.
- **#221 / CPU-AI (#70–#78)** — possible **NEW sub-datum**: an **era-weighted CPU
  selection BUFF on the content pool** ("Buffs by era kind of exist already," POST 20;
  proposed ~20% historical-over-ahistorical, POST 18). How the CPU draws from the primitive
  pool. Flag as a refinement to #221 or the CPU-selection cluster.
- **#20 (Governor Actions)** — CORROBORATE + sharpen. **★ Gov actions are FLAT / state-
  agnostic today** ("same for every state," POST 31) — per-state unique gov-action tables
  are an explicit DEFERRED upgrade. Reinforces #20's state-scoped-action model and the
  DH-15 small/large-state multiplier. Accepted gov actions: casino/lottery/prostitution
  legalization w/ historic dates (POST 8), attract-immigration-for-House-seat (POST 5),
  Statuary-Hall statues (POST 37), vacant-seat fill rules (POST 2), abolish/reintroduce
  public executions (POST 15). Cite POSTs 2, 5, 8, 15, 31, 37.
- **#92 (era-as-content-band, territory-gated)** — CORROBORATE (authoring-side). Every
  primitive is era/date-gated; Pres/Gov actions inactive pre-Constitution; CC-invites-
  colonies → post-war states is territory-gated content. Cite POSTs 1, 8, 28, 30, 31.
- **#206 (Era-of-Future stub, doubly-unbuilt)** — CORROBORATE. vcczar himself ranks
  Future-band Gov + Exec actions as NEEDED and Future legislation LOW priority (POST 1,
  items 6-8) — the thinnest band, authored last. Direct authoring-side confirmation that
  the Future band is under-content'd.
- **#236 (alt-government-form axis)** — DEPENDENCY CONFIRMED. Alt-governments unlock menus
  of these exact primitives; the "authoritarian kit" is a bundle of them.
- **#237 (stateful policy-genre framework)** — DEPENDENCY CONFIRMED. Its `L/P/G/S`
  mechanism prefixes ARE these primitives (+ scripted events); the prereq-chain / ladder /
  `*-Default` shape is visible in this thread's raw content series.
- **Open question (carry forward):** the **per-state gov-action** model (POST 31) is wanted
  but explicitly unscheduled — does any later thread author per-state action tables, or does
  it stay flat? Also: how are **option-set / branching** primitives (anthem, execution-method
  fallback) represented in the registry vs simple yes/no bills?

---

### Provenance notes
- Single chunk; all 41 posts read. Thread is a Q&A authoring log — vcczar's accept/reject
  replies (POSTs 6, 8, 10, 11, 13, 16, 18, 20, 25, 27, 31, 33) are the authoritative
  signal; community posts are proposals (many accepted, several rejected as fluff or
  deferred). No GM die-rolls / playthrough mechanics here (it is design, not play).
- Codebase verified at `src/` HEAD on 2026-06-27 (the ZERO-result grep above).
