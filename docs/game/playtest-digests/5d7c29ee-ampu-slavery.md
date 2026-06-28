# Digest — "AMPU Slavery" (`5d7c29ee`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (Apr 2022), **NOT a playthrough.**
**5 posts / 1 chunk** (chunk-001, all covered). Source CSV ~3.4 KB.
**Author/GM:** **@vcczar** (tier-1 designer) posts the genre (POST 1). Community
(IloveHistory48599022 → POSTs 2/3; Timur → POST 4) pitch two additions; vcczar issues
one routing ruling (POST 3: yes, CA-split is the 36°30′ line) and one already-shipped
confirmation (POST 5: Crittenden Compromise "It's in the game").
**Why it matters:** the **Slavery** policy genre — one concrete genre in the #237
stateful-policy-genre framework / #221 three-primitive content system, but the **single
most era-COUPLED genre in the KB**: it is the policy engine wired to the **Civil-War /
secession subsystem** (cross-ref the **House-Divided** `c015a0cb` digest's Secession-
Winter / CSA mechanics, and the b46 Civil-War subsystem ACs #56/57/58/156/157). UNTAGGED
drop (no `L-/P-/G-` prefix, no era-band, no `Preq:` blocks — same authoring stage as
`welfare`/`healthcare`/`military`/`expansionism`). Content primitives remain **0% shipped**
(verified this run; see Engine facts).

**★ HEADLINE delta:** *Slavery is the era-gated policy engine COUPLED to secession; a
slavery-enabled/abolished STATE FLAG should gate CSA membership.* The build **half-ships
the flag** (`State.isSlaveState`, types.ts:1329) but it is **inert w.r.t. secession** — the
shipped Secession-Winter logic reads `state.region`, NOT `isSlaveState` (proven below) —
and **no policy in the build can mutate it.** This genre is what would make the flag live.

---

## The Slavery policy genre (the core artifact, POST 1) — UNTAGGED form

vcczar posts ~29 rows under three flat header partitions, no schema tags. vcczar's opening
note (POST 1): *"Maybe some Era of the Future or hypothetical things could be useful"* — an
explicit #206 invitation that yields the **robot-slavery** mirror set (see Novel #3).

### Legis Prop — the dominant primitive, **~24 rows** (POST 1, lines 18–122), grouped:

**(A) Authority/jurisdiction axis (who decides):**
- Leave matters pertaining to slavery to the states (the `*-Default` states'-rights pole)
- Various slavery proposals for US Constitutional Convention (the CC arm — ties the
  `constitutionalConvention.ts` subsystem; era: `independence`/`federalism`)
- Ban Federal Interference in Slavery Amendment (the constitutional lock of the states'-rights pole)

**(B) Territorial / popular-sovereignty option-set (one supersedes the rest — textbook #248 + #258 territory-predicate):**
- Popular Sovereignty in **all Territories**
- Popular Sovereignty in **Kansas and Nebraska**
- Popular Sovereignty in **Mexican Cession**
- Popular Sovereignty in **California**
- Offer cheap land in Kansas if they accept pro-slavery state constitution (the Lecompton lever)
- Ban slavery in territories won by warfare or treaty (the Wilmot-Proviso lever)
- Make Missouri Compromise permanent
- Missouri Compromise Line (the 36°30′ line as a discrete proposal)
- Apply Mexican Constitution to Texas, abolishing slavery

**(C) Federal-power / abolition ladder (CREATE→escalate end-states):**
- Subsidize American Colonization Society (the colonization/gradualist pole)
- Ban International Slave Trade
- Ban domestic interstate slave trade
- Federal Slave Code (the pro-slavery federal-power mirror)
- Abolish slavery by compensating owners (compensated abolition — the gradualist terminal)
- **13th Amendment** (the constitutional-abolition terminal)
- Confiscation Act of 1862 (war-power emancipation; era: Civil-War)

**(D) Fugitive-Slave-Act opposed-PAIR + escalation (the #248 opposed-pair pattern, sharpened):**
- Fugitive Slave Act → **Stricter Fugitive Slave Act** (escalation rung)
  (the enforce-vs-not arm lives in Pres/Gov Actions, see below — a *cross-primitive* opposed set)

**(E) Speech/expression opposed-PAIR (gag rule BOTH directions — the cleanest two-sided #248 yet):**
- **Gag Rule against pro-slavery proposals and debate**
- **Gag Rule against abolition proposals and debate**
- Ban delivery of abolitionist material through US post (the censorship arm)

**(F) Confiscated-plantation disposal option-set (one beneficiary supersedes the other — #248):**
- Sell confiscated plantations **to poor whites** for cheap
- Sell confiscated plantations **to free slaves and other freemen** for cheap

**(G) Future-era mirror (ties #206):**
- **Ban robot slavery** (see Novel #3)

### Pres Actions — exactly **3** (POST 1, lines 124–136):
- **Strictly enforce** fugitive slave act ↔ **Do not enforce** fugitive slave act (opposed pair)
- Abolish robot slavery in the federal government (Future mirror)

### Gov Actions — exactly **2** (POST 1, lines 138–146):
- **Abolish slavery** (the per-state flag-flip — THE state-level lever; ties #20)
- Rigorously comply with Fugitive Slave Act (per-state enforcement posture)

No mechanism prefix, no era-band abbreviation, no `Preq:` block — confirms the genre
pipeline ingests raw pre-tag lists awaiting the schema-tagging pass. Era bands + prereqs
are IMPLIED by content (Confiscation-Act-**1862**, 13th-Amendment, Mexican-Cession,
robot-slavery=Future) but are NOT explicit fields here.

---

## ★ NOVEL #1 — Slavery is the SECESSION ENGINE: "slavery-enabled" is meant to be a mutable STATE FLAG gating CSA membership (the genre↔subsystem coupling)

This is the genre's defining, KB-distinguishing property. Unlike `welfare`/`healthcare`
(which set *national meters/programs*), the **Slavery Gov-Action "Abolish slavery"** and
the territorial/abolition Legis-Props are meant to **flip a per-state slavery flag**, and
**that flag is the input to the Civil-War/secession subsystem**: which states are
slavery-enabled gates **which states are eligible to join the CSA** on secession (cross-ref
the **House-Divided** `c015a0cb` Secession-Winter / CSA-formation mechanics; b46 Civil-War
ACs #56/57/58/156/157). So this genre is not a standalone policy library — it is the
**content layer of the secession trigger.**

**Shipped reality vs. this design (the load-bearing gap):**
- The build **already has the flag**: `State.isSlaveState: boolean` (types.ts:1329),
  populated in `states1856.ts` (15 slave states incl. the 4 border-loyal) and `states1772.ts`,
  shown in the Slave? column (StatesPage.tsx:20), and assigned to new territories by
  `isSlaveState: t.region === 'South' || t.region === 'Border'` (phaseRunners.ts:3175).
- **BUT the flag is INERT for secession.** The shipped Secession-Winter defection logic
  (`runSecessionWinterDefections`, phaseRunners.ts:3028–3053) decays cabinet-member
  *loyalty* by **`state.region`** (South 0.5 / Border 0.2, `LOYALTY_REGION_BASE`
  types.ts:1162) × ideology — and the code COMMENT is explicit: *"Secession Winter loyalty
  decay reads **state.region directly, not this set**"* (types.ts:1151, re `SLAVE_STATES_1856`).
  There is even a **second, redundant** slavery-position representation —
  `SLAVE_STATES_1856` (types.ts:1152, a hand-rolled abbr list) used only as a John-Brown-
  event proxy — that ALSO is not `isSlaveState`. So the build has **three disconnected
  slavery representations** (`isSlaveState` flag, `SLAVE_STATES_1856` list, `state.region`)
  and secession keys off the one (`region`) that **no policy can change.**
- **No policy in the build mutates `isSlaveState`.** Grep confirms the only write is the
  territory-admission assignment (phaseRunners.ts:3175); there is no Legis/Gov-Action that
  flips it. And it *couldn't*: a Legislation's `effects` is an `EraEventResponseEffect`
  (types.ts:1448–1457) that can only touch `meters/partyPreference/enthusiasm/interestGroups/
  diplomacy/startWar/text` — **there is no "set state flag" effect channel at all.**

→ **Delta:** to ship this genre, `isSlaveState` (or a successor `slaveryEnabled`) must
become (1) **mutable by policy** (a new effect channel / program-state write — the same
class of gap as #221's missing program-state and the #258 missing predicate engine), and
(2) **the actual input to the secession/CSA-membership logic**, replacing the current
`state.region` proxy. This unifies the three representations and turns the slavery genre
into the live secession engine the design intends. Source: POST 1 (genre) + codebase.

## ★ NOVEL #2 — Cross-primitive opposed-SETS + the territorial pop-sovereignty option-set (enriches #248)

Slavery is the richest #248 ("one option supersedes another") genre yet because its
opposed/option structure spans **all three primitives** and is **two-sided** on the same axis:

- **Two-sided gag rule** (Legis): pro-slavery-gag ↔ abolition-gag — the cleanest fully
  *symmetric* opposed pair in the KB (most genres only author one direction; cf. `welfare`
  raise↔cut). Implies the subtype taxonomy must support **mirror-image** members on one axis.
- **Cross-PRIMITIVE Fugitive-Slave-Act set:** the *base law* (Legis) → *stricter* (Legis
  escalation) AND *enforce ↔ don't-enforce* (Pres Action) AND *rigorously comply* (Gov
  Action). One real-world institution (the FSA) is represented across **all three
  primitives at once** — strong evidence #248's tagging must be **multi-primitive**, not
  per-genre-flat.
- **Territorial pop-sovereignty option-set** (all-Territories / KS-NE / Mexican-Cession /
  CA): the same lever **scoped by territory predicate** — the textbook case for #258's
  *territory-scoped* availability predicate (you can only offer "pop sovereignty in the
  Mexican Cession" once that territory exists/is in play). Plus opposed terminals on the
  same territorial axis: Missouri-Compromise-permanent / 36°30′-line vs. ban-in-war-won-
  territory vs. Lecompton-cheap-land-for-pro-slavery-constitution.
- **Confiscated-plantation beneficiary set** (poor-whites ↔ freedmen): a small two-member
  supersession set gated on a *prior* policy/event (confiscation must have happened — an
  implicit #258 prereq + a Civil-War-era gate).

## ★ NOVEL #3 — "Robot slavery" Future mirror across all three primitives (corroborates #206)

vcczar explicitly seeds the Future band in the opener (*"Maybe some Era of the Future…"*)
and the genre carries a **complete robot-slavery mirror across every primitive**:
- Legis: **Ban robot slavery**
- Pres Action: **Abolish robot slavery in the federal government**
- (Gov Action robot mirror is absent — a small coverage hole, #262.)

This is the clearest single-genre Future mirror yet (most genres get only scattered Future
rows). It rhymes with the **businesslabor** Future set (`dc0316f0`: Restrict Robot/Human-AI
Employees) and the **SCOTUS-future** robot-personhood docket (`aa227625`: *Advanced Robot
Inc v California*, *Bender v New York*). → CORROBORATES #206 (Future band real-in-design,
thin-in-content) and suggests **"robot personhood/slavery" is a cross-genre Future THEME**
(welfare/business/courts/slavery all touch it) worth consolidating, not a slavery-only row.

---

## Community additions + GM rulings (POSTs 2–5)

- **POST 2/3 (IloveHistory48599022 → vcczar):** the existing "California can be split into 2
  states" legislation — *does it relate to slavery / the 36°30′ line?* **vcczar RULING (POST
  3): "Yeah that CA line."** → The **CA-split is the 36°30′-line statehood-split lever**
  (real history: CA's 1859 Pico Act / pro-slavery "Territory of Colorado" proposal). So a
  *statehood/territories* mechanic (admit/split states) is **slavery-coupled** — it changes
  the free/slave balance, hence ties back to Novel #1 (the secession-eligibility flag) and
  to the territories subsystem (`admitState`). Open design hook below.
- **POST 2/3 (community proposal):** *if* "Make Missouri Compromise permanent" passes, add a
  **follow-on Legis-Prop: popular sovereignty for all new non-continental territories/states
  BELOW the 36°30′ line (e.g. Hawaii).** → A textbook **#258 conditional-availability**
  ask: a proposal that only unlocks *after another policy is active* (Missouri-Compromise-
  permanent) AND is gated by a *geographic predicate* (sub-line + non-continental). Record
  as an explicit prereq-chain example.
- **POST 4/5 (Timur → vcczar):** Timur suggests **Crittenden Compromise**; **vcczar: "It's
  in the game."** → Already-shipped confirmation **at the DESIGN-spreadsheet level**. NOTE
  the build distinction: there IS a **`Crittenden Republicans` faction** (factions1856.ts:12,
  cards `Compromise`/`GradualEmancipation`/`ProUnion`/`Border`) and the Bleeding-Kansas/
  Secession-Threat events offer a "**Seek Compromise — a new Missouri Compromise**" response
  (eraEvents1856.ts:118) — but the **Crittenden Compromise as a named Legis-Prop is NOT in
  shipped code.** "In the game" = in vcczar's master content list, not the React build.

---

## Engine facts (verified this run, do not re-derive)

- **The flag exists, half-wired:** `State.isSlaveState: boolean` (types.ts:1329); set in
  `states1856.ts:5–35`, `states1772.ts:8–20`, `expansionStates.ts:181`; displayed
  (StatesPage.tsx:20); auto-assigned on admission by region (phaseRunners.ts:3175). **Only
  write is admission; no policy mutates it** (grepped `isSlaveState\s*=`).
- **Secession reads `region`, not the flag:** `runSecessionWinterDefections`
  (phaseRunners.ts:3028–3053) + `LOYALTY_REGION_BASE` (types.ts:1162, South/Border) drive
  defections; comment at types.ts:1151 states it ignores `SLAVE_STATES_1856`. Civil war
  fires when ≥2 cabinet members defect (phaseRunners.ts:2976, AC #36). Secession is a
  **cabinet-loyalty** model, NOT a slavery-state-membership model — the design's "slavery-
  enabled gates CSA membership" is **unbuilt**.
- **Three disconnected slavery representations** in `src/`: `isSlaveState` (flag),
  `SLAVE_STATES_1856` (abbr list, John-Brown proxy only, types.ts:1152), `state.region`
  (secession driver). None is policy-mutable.
- **No effect channel can set a state flag:** `EraEventResponseEffect` (types.ts:1448–1457)
  = meters/partyPreference/enthusiasm/interestGroups/domesticStability/diplomacy/startWar/
  text only. `Legislation.effects` is this same type (types.ts:1515). So even the existing
  legislation pipeline cannot express *any* of these slavery props as written.
- **Policy-genre primitives 0% shipped:** no `policyGenre`/`presAction`/`govAction`/
  `subtype`/`prereq` tokens anywhere in `src/` (grepped). `Legislation` (types.ts:1506–1520)
  has the 4-value `committee` and NO `subtype`/prereq field — identical to every sibling
  content drop (welfare/healthcare/etc.).
- **The Predicate engine that #258 needs exists ONLY for era events,** not policy: the
  serializable `Predicate` tree (types.ts ~1484+) is wired to the 2.4.3 era-event graph; it
  cannot express "slavery enabled in state X", "territory Y in play", or "policy Z active".

---

## Candidate deltas for consolidation (map to EXISTING IDs — do NOT assign new numbers)

- **★ Civil-War subsystem ↔ Slavery-genre COUPLING (the headline; ties b46 ACs
  #56/57/58/156/157 + #258).** The Slavery genre is the **content/policy layer of the
  secession trigger**: a mutable **slavery-enabled state flag** should (1) be flippable by
  the "Abolish slavery" Gov-Action + the territorial/abolition Legis-Props, and (2) **gate
  CSA membership** on secession. Build half-ships the flag (`isSlaveState`) but secession
  reads `state.region`; **unify the three reps and make policy-mutation the secession
  input.** Cross-ref the House-Divided `c015a0cb` digest. Source: POST 1 + codebase.
- **#221 (3-primitive content system + scripted-event registry)** — CORROBORATE, **0%
  shipped.** Populates all three primitives (L≈24 / P=3 / G=2). ★ SHARPENS the
  **missing-state-write requirement**: this genre's central Gov-Action/Legis effect is "set
  a per-state slavery flag" — a class of effect the current `EraEventResponseEffect` channel
  **cannot express at all** (no flag-write). Source: POST 1.
- **#237 (stateful policy-genre framework)** — CORROBORATE. Slavery = a concrete genre
  instance in UNTAGGED form (3 flat partitions, no `L-/P-/G-`, no era band, no `Preq:`). ★
  The MOST era-COUPLED + subsystem-coupled genre captured — its "state" is not a national
  meter but a **per-state + per-territory** flag feeding another subsystem. Source: POST 1.
- **#248 (legis-proposal subtype taxonomy + multi-category tagging)** — CORROBORATE +
  ENRICH. ★ Richest #248 genre yet: a fully **symmetric two-sided** opposed pair (gag rule
  pro ↔ abolition), a **cross-PRIMITIVE** opposed set (Fugitive Slave Act spanning Legis +
  Pres + Gov), a **territory-scoped** pop-sovereignty option-set, and a beneficiary
  option-set (plantations → poor-whites ↔ freedmen). Demands multi-primitive + mirror-pair
  + territory-scope tagging. Source: POST 1.
- **#258 (prereq / predicate-gated availability FIELD)** — CORROBORATE + ENRICH. ★ Adds the
  KB's clearest predicate types: **era gate** (antebellum/Civil-War — Confiscation-Act-1862,
  13th-Amdt), **territory-in-play gate** (Mexican-Cession / KS-NE / CA pop-sovereignty),
  **state-flag gate** (slavery-enabled), and a **policy-chain gate** (POST 2: sub-line
  pop-sovereignty unlocks only *after* Missouri-Compromise-permanent passes). No explicit
  `Preq:` here → still demands the prereq field + these predicate classes. Source: POST 1, 2.
- **#206 (Era of the Future doubly unbuilt)** — CORROBORATE + content. ★ Cleanest
  single-genre Future mirror: **Ban robot slavery** (Legis) + **Abolish robot slavery in fed
  gov** (Pres). vcczar explicitly seeds it (POST 1: "Maybe some Era of the Future…").
  Suggests **robot personhood/slavery is a cross-genre Future THEME** (cf. businesslabor
  `dc0316f0`, SCOTUS-future `aa227625`) — consolidate, don't double-count. Source: POST 1.
- **#262 (content-COVERAGE / per-primitive + per-ideology balance)** — CORROBORATE (light).
  P=3 / G=2 (thin, as usual); robot Gov-Action mirror is missing (small Future hole). No
  explicit designer ASK in-thread this time. Source: POST 1.
- **Territories/statehood ↔ slavery coupling (ties `admitState` + #258 + the secession
  flag).** vcczar RULING (POST 3): the **California-split legislation IS the 36°30′-line
  statehood split** — i.e. admit/split-state mechanics change the free/slave balance and so
  feed the secession-eligibility flag. Record the statehood subsystem as slavery-coupled.
  Source: POST 2, 3.
- **Already-shipped clarifications (carry as flag, do NOT log as new design):** Crittenden
  Compromise is "in the game" per vcczar (POST 5) **at the spreadsheet level** — the build
  has a `Crittenden Republicans` faction (factions1856.ts:12) + a "new Missouri Compromise"
  event response (eraEvents1856.ts:118) but **no Crittenden Legis-Prop**. Source: POST 4, 5.

---

## Open questions (for consolidation; cannot ask human mid-run)

1. **Flag granularity:** is "slavery-enabled" a single per-state boolean (today's
   `isSlaveState`) or does the territorial-pop-sovereignty content imply a **per-territory**
   tri-state (free / slave / pop-sovereignty-undecided)? The four pop-sovereignty Legis rows
   suggest the latter, which the binary `isSlaveState` cannot represent.
2. **Does abolishing slavery in a state retroactively pull it out of CSA-eligibility,** or
   only gate it at the secession moment? (Determines whether the flag is read once or
   continuously by the subsystem.)
3. **Reparations routing (carried from the `welfare` digest's GM-UNANSWERED POST 6):**
   "reparations for slavery" — does it live in this Slavery genre, Civil-Rights, or Welfare?
   Still no GM answer; this Slavery thread doesn't address it. Likely Slavery/Civil-Rights.

---

### Provenance notes
- Single chunk; all 5 posts read (`===== POST 1..5 =====`). Pure design/crowdsourcing log
  (no die-rolls, no playthrough mechanics, no GM accept/reject ledger). vcczar (tier-1)
  authors the genre (POST 1) + two rulings (POST 3 CA-split=36°30′ line; POST 5 Crittenden
  "in the game"). POST 2/3 community = CA-split question + sub-line pop-sovereignty proposal;
  POST 4 community = Crittenden suggestion. Era framing per `historical-context.md` §3
  (Antebellum) and §2.6 (the Missouri-Compromise/Kansas-Nebraska/Fugitive-Slave-Act/
  pop-sovereignty real history) — no historian ran this batch.
- Codebase verified at `src/` HEAD 2026-06-28: `State.isSlaveState` (types.ts:1329) exists
  but is policy-immutable and NOT read by secession (which uses `state.region`,
  phaseRunners.ts:3028–3053, per comment types.ts:1151); `SLAVE_STATES_1856` (types.ts:1152)
  is a separate John-Brown proxy; `EraEventResponseEffect` (types.ts:1448) has no state-flag
  write; no policy-genre/prereq/subtype tokens in `src/`. Framework
  (#221/#237/#248/#258/#262/#206) remains **0% shipped** — consistent with every sibling
  content drop. Authoring SNAPSHOT (Apr 2022), not final.
