# Digest — "AMPU Agriculture" (`c33d07b8`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (Apr 2022), **NOT a playthrough.**
**7 posts / 1 chunk** (chunk-001, all covered). Source CSV ~15KB.
**Author/GM:** **@vcczar** (tier-1 designer) posts the genre + issues the genre-boundary
rulings (POSTs 1, 3, 6). Community (matthewyoung123, Hestia, et al., tier-4 GAs) pitch
additions; POST 3 is Hestia (a GA) but issuing a vcczar-style routing ruling on ethanol.
**Why it matters:** the **Agriculture** policy genre — one concrete genre in the #237
stateful-policy-genre framework / #221 three-primitive content system. Confirms the
`L/G/S/P` tagging, the **`L-Ind-Default` baseline**, **prereq dependency CHAINS**, and the
33-subtype enum's **"Agriculture"** value (#248). Its distinctive value vs sibling
content drops (education/immigration/space): a cluster of **scripted events with NOVEL
mechanics** — a geographic multi-turn **SPREAD** mechanic (Boll Weevil), **tech/invention
progression** chains, and **event→immigration / event→population-shift** effects — that
stress the scripted-event model beyond one-shot fire-once events.

---

## The Agriculture policy genre (the core artifact, POST 1)

vcczar posts Agriculture as the #237/#221 primitive lists, era-tagged, with prereq trees.
Mechanism prefixes: **L** = Legis-Prop, **G** = Gov Action, **S** = Scripted Event,
**P** = Pres Action; parenthetical = era-band tag (Ind/Fed/Dem/Man/Nat/Gild/Prog/Norm/
Ide/Neo/Fu/…). Same dual-code shape as Business/Labor (#237).

1. **`*-Default` baseline (POST 1):** *"If no Agriculture Legislation is Active:* **All
   Agricultural Policies Left to the States (L-Ind-Default)**" — identical pattern to B/L's
   "left to the states" and Space's "no federal legislation re: outer space." Absence-of-
   policy is itself a selectable state. (#237)
2. **No-prereq Legis-Props (L-Pop, future/animal-welfare cluster):** Ban Eating Pork/
   Octopus & other intelligent animals, Subsidize Insect-Protein Diet, Ban Factory Farming,
   Ban Cosmetic Animal Testing, Ban Trophy Hunting. Plus a **either/or pair** Ban GM Crops
   ↔ Allow Unrestricted GM Crops (L-Fu) — the paired-toggle primitive.
3. **★ PREREQUISITE CHAINS (the structural headline, POST 1)** — explicit dependency trees:
   - **Dept-of-Agriculture chain:** Create Independent Dept of Agriculture (L-Nat) → Elevate
     to Cabinet-level (L-Gild) → {Increase funding **either/or** Decrease funding} (L-Gild)
     → downstream relief/program bills (Temporary Emergency Farming Relief, Rural
     Electrification Act, Tenant Farmer Act, AAA, …).
   - **Federal Farm Board chain:** Create Federal Farm Board (L-Norm) → Agricultural
     Marketing Act (L-Norm) → Authority for Federal Farm Board to Purchase Surplus Crops
     (L-Norm).
   - **Prereq-on-PRIOR-SCRIPTED-EVENT:** *"Preq: Industrial Revolution occurred (S-Fed)"*
     gates the invention chain (Cotton Gin → … → Modern Tractor). This corroborates the
     #221 "prereq on scripted-event / world-state flag" schema (same as B/L's
     "Manufacturing-Spreads"→II→III, "Labor-Movement-occurred"→Haymarket).
   - **Prereq-on-NON-Agric policy:** Capper-Volstead Act requires *Any Anti-Monopoly
     legislation active*; Rural Free Delivery Act requires *Postal Department Active* — i.e.
     a prereq can point at a flag OWNED BY ANOTHER GENRE (cross-genre dependency).
4. **★ Scripted-event INVENTION/TECH progression chain (POST 1):** Cotton Gin (S-Fed) →
   *(+ Slavery Legal)* Cotton Replaced Tobacco as Chief Cash Crop (S-Fed) → McCormick Reaper
   (S-Dem) → John Deere Steel Plow (S-Dem) → Modern Tractor (S-Norm). A **linear tech tree of
   scripted events**, each conditioned on the prior + on a world-state flag (Industrial
   Revolution occurred; Slavery Legal). One node has a **conditional EFFECT** (Cotton Gin +
   Slavery-Legal ⇒ cotton supplants tobacco) — content whose payoff is gated on game-state.
5. **Pres Actions (POST 4):** Continue immediate-burns forest-fire policy ↔ Co-opt Native
   burning strategies (a paired stance toggle); Remove invasive species via a major
   pesticide/insecticide campaign. Corroborates the P-primitive (#221). vcczar explicitly
   names **Pres Actions** as a top need area (POST 1).
6. **Further Legis-Props (POST 4):** Subsidize inland fish farms; Invasive Species Acts;
   SNAP/WIC (with Reduce/Increase/Repeal/Enable-Disable **modifier verbs** — the
   increase/decrease/repeal meter-tradeoff pattern); Help African-American Farmers
   (the policy companion to the Pigford S-events below); Universal School Breakfast/Lunch,
   After-school Meals (a school-nutrition cluster that overlaps Education/Welfare subtypes).
7. **Conditional SCOTUS-case S-events (POST 4):** **Pigford v. Glickman** (settlement $2B
   class-action vs USDA) — *requires Agriculture Dept is Cabinet AND the Director is CON-or-
   further-right during the Era of the Neocons*; **Pigford II** (appropriate $1.2B in the
   next-term Farm Bill) — same but Era-of-Terror. Confirms **SC-Case-as-content with
   multi-condition prereqs** (office-state + appointee-ideology + era) and a **next-term-
   scheduled fiscal effect** (delayed payoff). (#221/#248 "Courts" subtype; cf. #249/#25.)

---

## ★ Scripted events with NOVEL mechanics — flag these (POSTs 5, 6; matthewyoung123)

These are the thread's most build-relevant finding: scripted events that mutate geography
and population over MULTIPLE TURNS, beyond the shipped fire-once `EraEvent`.

- **★ BOLL WEEVIL = a geographic, multi-turn SPREAD mechanic with per-state state +
  a later RESISTANCE counter-event (POST 5/6):** the weevil "comes from Mexico and impacts
  cotton crop in Texas" (income↓, dissatisfaction↑), then **spreads to neighboring cotton
  states every 4 years** — an explicit dated propagation table (1896 TX → 1900 AR/LA → 1904
  MS/TN → 1908 AL/GA → 1912 FL/SC → 1916 NC/VA). **Variants** branch the spread rate: a
  *slow/never* variant (fails to spread outside TX, "Great Migration never happens") and a
  *catastrophic/fast* variant (neighbors in **2 years instead of 4**). The spread **drives
  the Great Migration** (South→North/West **population shift**). A **counter-event** appears
  ~1950 (use DDT to destroy the weevil) that **STOPS WORKING by 1960** (the weevil develops
  DDT resistance) — i.e. a time-boxed counter-event with an expiry. Secondary effect: crop
  diversification (peanut farming takes off). → This is a **dynamic SPATIAL-SPREAD + per-
  state infestation state + later/expiring counter-event + population/demographic-shift**
  pattern. NOTHING in the build or the KB models this; the closest captured patterns are the
  Shaw/John-Brown one-shot "demographic-removal" events (treated as corroborating the
  shipped era-event system, game-context #201) and the #247 event-driven population/state-
  lean shift. Neither covers multi-turn spatial propagation with per-state spreading state.
- **POTATO BLIGHT → immigration variants (POST 5/6):** blight moves Ireland→US (US famine),
  with branches: famine *not as bad in Ireland* ⇒ **reduces immigration**; famine *worse*
  ⇒ **increases immigration**. A scripted event whose magnitude **modulates the immigration
  inflow** — couples the event system to the demographic/immigration lever (#247, and the
  immigration-genre district-flip lever).
- **VICTORY GARDENS (POST 5/6):** WW1 & WW2 event HOOKS — "Encourage citizens to plant
  Victory Gardens." A scripted event **conditioned on a concurrent war state** (war-flag
  prereq), i.e. event-fires-during-other-event.
- **The GRANGE (POST 5/6):** post-Civil-War org founded 1867; membership-growth narrative
  1873→1875; Granger-movement state rate-regulation laws + **Munn v. Illinois** SCOTUS
  precedent. Pitched as event + judicial content (Cooperative Extension, RFD, Farm Credit
  System as downstream effects).
- **Foreign Agricultural Service (POST 7):** unlocked *following establishment of the Dept
  of Agriculture* (1930) — another department-chain downstream unlock, ties into Trade/
  Diplomacy (food-aid, trade missions).

---

## ★ Genre-BOUNDARY rulings (evidence the taxonomy needs ownership rules)

The thread is unusually rich in **routing/ownership calls** — which content belongs to which
genre. These corroborate the #248 (subtype taxonomy) / #237 (genre) tension and the
education-thread "things should be in **multiple categories**" requirement.

- **Ethanol → Oil & Gas, NOT Agriculture (POST 2/3).** Hestia: ethanol-blend mandates /
  compel-gas-companies / Trump-style refinery waivers "might be categorized under **Oil &
  Gas**, rather than agriculture." A clean cross-genre boundary call (ethanol is an ag cash
  crop but its policy lever is energy).
- **Some items are really Trade / Diplomacy (POST 2/3/6).** Free trade / China trade-war
  effects on farm prices, and the Foreign Agricultural Service, are flagged as Trade or
  Diplomacy content, not Agriculture. matthewyoung123 (POST 6): *"A lot of this is under
  other categories."*
- **Dept-create/abolish as org-unit content.** The Dept-of-Agriculture create→elevate→fund
  chain mirrors batch-37's ruling that **Dept-of-Education create/abolish lives under the
  Civil Service genre, not Education** (education POST 2/3/6). Open question: is the
  Dept-of-Agriculture *create/abolish* route a Civil-Service-genre action while the
  policy content stays in Agriculture? The thread doesn't resolve it, but the parallel is
  exact — org-unit-as-genre needs a clear ownership rule.
- **Rural broadband / Rural Electrification adjacency (POST 2/3).** "Not exactly agriculture"
  but accepted by analogy to the (already-listed) Rural Electrification Act — fuzzy genre
  membership, the multi-tag case again.

→ These boundary calls are concrete evidence the genre/subtype taxonomy (#248/#237) needs
**clear ownership rules** and likely **multi-category tagging** (same conclusion as the
education digest's DC-memorials example).

---

## Coverage gaps the DESIGNER explicitly states (POST 1)

- **Era-of-the-Future Agriculture content** is the stated **#1 priority** ("I especially
  need more agriculture specific things for the Era of the Future"). The genre's `-Fu`-tagged
  entries are thin (only the GM-crops either/or pair + insect-protein/factory-farming items).
  Corroborates #206 (Future band under-content'd at SOURCE) for the Agriculture axis.
- **More Pres Actions** — the explicit secondary priority ("I think the priority is Era of
  the Future and Pres actions"). The genre ships only ~3 P-entries. Corroborates the
  recurring P-primitive coverage hole (#221, education/businesslabor/#518fb253).

---

## Engine facts (verified, do not re-derive)

- `src/types.ts` `interface Legislation` has **no `subtype` field**, no prereq/condition
  field, and no Pres-Action / Gov-Action / policy-genre fields. The three #221 content
  primitives + scripted-event registry remain **designed-only, 0% shipped** (corroborates
  #221, #237, #248, and the education/immigration/space/businesslabor null results).
- No "Agriculture" policy-genre store, no prereq-chain engine, no event-spread / per-state
  infestation state, and no event→population/immigration shift mechanism exist in `src/`.
  `EraEvent` is a single year-windowed fire-once shape (no multi-turn spread, no expiry,
  no per-state propagation). `state.bias` is a static scalar; the only dynamic population
  lever is the #247 ±1 region `stateBias` anytime-event effect (clamped, un-time-boxed).
- **NOTE:** "Agriculture" already exists as a shipped **Expertise** tag (it survives the
  Military→Army rename per #216/`terminology`), and **Agriculture** is one of the 33 #248
  subtype values — but neither is a stateful policy store.

---

## Candidate gaps for consolidation (map to EXISTING IDs — do NOT assign new numbers)

- **#221 (3-primitive content system + scripted-event registry)** — CORROBORATE + ENRICH.
  Agriculture is a fully-worked instance: L/G/S/P primitives, prereq chains on prior
  policies AND prior scripted-events ("Industrial Revolution occurred") AND cross-genre
  flags (Postal-Dept-active, Anti-Monopoly-active), conditional-effect events (Cotton-Gin
  +Slavery⇒cotton-supplants-tobacco), the linear invention/tech-tree S-chain, and multi-
  condition SC-Case S-events (Pigford: Dept-cabinet + appointee-ideology + era). Still
  **0% shipped.** ★ ENRICHMENT (flag for the consolidation pass): the **Boll Weevil**
  shows the scripted-event model must support **multi-turn SPATIAL SPREAD with per-state
  infestation state + variant spread-rates + a later/expiring RESISTANCE counter-event** —
  a strictly richer requirement than the fire-once `EraEvent`; no existing ID captures the
  spatial-spread sub-mechanic. Cite POSTs 1, 4, 5, 6.
- **#248 (legis-proposal subtype taxonomy, 33-value enum)** — CORROBORATE. Worked content
  for the **"Agriculture"** subtype value; also exhibits the single-vs-MULTI-tag question
  (school-nutrition items span Agriculture/Education/Welfare; ethanol = Agriculture-crop
  but Oil&Gas-policy; broadband = Agriculture-adjacent/Infrastructure). The boundary rulings
  (POST 2/3) are direct evidence for **multi-category tagging**. Cite POSTs 1, 2, 3.
- **#237 (stateful policy-genre framework)** — CORROBORATE. **Agriculture = a concrete
  policy genre** alongside Business/Labor, Currency, Copyright, Space, Education, Immigration:
  confirms the `L-Ind-Default` baseline, the dual code (mechanism prefix + era-band tag),
  and prereq dependency chains as the genre's defining structure. The Dept-of-Agriculture
  create→elevate→fund chain is the canonical "department lifecycle" sub-pattern (parallels
  Dept-of-Education→Civil-Service routing). Cite POSTs 1, 7.
- **#247 (event-driven state-lean / demographic realignment + zero-sum migration)** —
  CORROBORATE + ENRICH. The Boll-Weevil→Great-Migration **South→North/West population
  shift** and the Potato-Blight→**immigration±** variants are scripted events that mutate
  state population/demographics — the event-as-realignment-driver thesis. ★ ENRICHMENT:
  these require an **event→population-shift effect** (and, for the weevil, a per-state,
  multi-turn one), which #247's current scope (static bias + ±1 region nudge + the proposed
  decade-base + event-keyed modifier) does not yet spell out as a population/EV mover.
  Cite POSTs 4, 5, 6.
- **#20 (Governor Actions, flat/state-agnostic)** — CORROBORATE (light). Agriculture's
  G-entries (Subsidize Agriculture, etc.) are flat; the ethanol "could be a gov action at
  the state level" pitch (POST 2/3) reinforces the per-state Gov-action upgrade as the
  natural home for geography-specific ag actions. Cite POSTs 1, 2, 3.
- **#206 (Future band doubly-unbuilt) / Future content hole** — CORROBORATE. vcczar
  self-flags **Era-of-the-Future Agriculture** content as the #1 need (POST 1); the genre's
  `-Fu` entries are thin. Cite POST 1.
- **#221 / Pres-Action coverage** — CORROBORATE. vcczar names **more Pres Actions** the #2
  priority; the genre ships only ~3 (forest-fire burns toggle, invasive-species campaign).
  Same P-primitive hole as education/businesslabor/#518fb253. Cite POSTs 1, 4.

---

### Provenance notes
- Single chunk; all 7 posts read. Pure design/crowdsourcing log (no die-rolls, no
  playthrough mechanics). vcczar (tier-1) authors the genre + issues rulings (POSTs 1, 3
  via Hestia's vcczar-style routing call, 6); POSTs 2/5/6 are community proposals; POST 7
  is a downstream-unlock addendum.
- POSTs 5 and 6 are near-identical (matthewyoung123's list quoted back); cite either.
- Codebase verified at `src/` HEAD 2026-06-28: `Legislation` has no `subtype`/prereq field;
  `EraEvent` is fire-once year-windowed; no policy-genre store, event-spread, or
  event→population mechanism exists.
- ★ Open item for the consolidation pass (no clean existing ID): whether the **multi-turn
  spatial-spread / per-state infestation + expiring counter-event** scripted-event sub-
  mechanic (Boll Weevil) and the generic **event→population/EV-shift** effect warrant a
  distinct gap ID, or stay folded as enrichments under #221 (event-chain registry) + #247
  (event-driven realignment). Flagged, not numbered, per digest-only mode.
