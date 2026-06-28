# Digest — 4e76e6c3-ampu-expansionism ("AMPU Expansionism")

**Type:** CONTENT-AUTHORING / crowdsourcing thread (Apr 14 2022), **NOT a
playthrough.** **6 posts / 1 chunk** (chunk-001, all covered; source CSV ~4.8 KB).
**Author/GM:** **@vcczar** (tier-1) posts the genre + the explicit coverage ask;
community replies (Willthescout7, ConservativeElector2) add boundary questions +
content. **Why it matters:** the **Expansionism** policy genre — one concrete
genre in the #237 stateful-policy-genre framework / #221 three-primitive content
system (#248 subtype "Expansionism"). **Its distinctive value vs every sibling
content drop: this is the ONE genre that maps onto ALREADY-SHIPPED code** —
territory admission (`admitState`), the annexable-state registry
(`expansionStates.ts` ~Cuba/Greenland/Brazil/Antilles/etc.), and the Territories
page UI all ship. So this digest's job is to draw the **content-vs-already-built
boundary** sharply: most of the ~45 Legis rows are *content authored against
shipped mechanics*; a hard core (occupy→annex, split-a-state, abolish-states /
right-to-secede amendments, Indian-Removal-with-demographic-effects) needs
**new engine**.

---

## ★ The opener's explicit framing (POST 1 — load-bearing)

vcczar tags the community: **"This seems well-covered. I'm done with land
grabbing things. So what I need are ideas for non-land-grabbing expansionist
legis props, pres actions, or gov actions."** → the thread is a deliberate
**coverage-completion ask** (land-acquisition content is DONE; he wants the
*non-acquisition* expansionist axis filled). Maps directly to **#262**
(content-coverage as a tracked balance dimension — here a per-SUBTYPE-within-genre
coverage hole). The genre framework itself is corroborated only briefly — it is
WELL-established by `dc0316f0`/`518fb253`/`civilrights`/`agriculture`/`space`.

Counts (NOT transcribed in full — see chunk): **~45 Legis-Props**, **~12
Pres-Actions**, **3 Gov-Actions.** Format is **raw/untagged** (like Immigration
`8f3fb48a`: flat bullet lists under the three #221 primitive headers, **no
`L/P/G/S` prefixes, no era tags, no `*-Default` baseline, no `Preq:` chains**
written) — an earlier-style draft before the L/P/G/era-tag schema was applied.

---

## The content-vs-already-built map (the headline finding)

| Cluster (verbatim examples) | Maps onto SHIPPED code? | Verdict |
|---|---|---|
| **Statehood / Territory bills** (Various Statehood bills, Various Territory bills, Create Missouri as Free State, Establish Mexican Cession as Free State, Texas-border bills) | **YES** — `admitState(snap, stateId)` ships (`territories.ts:8`): idempotent admit from the `EXPANSION_STATES_BY_ID` registry; newly admitted states auto-picked-up by gov/congress/draft phases. Territories page UI ships (`TerritoriesPage.tsx`). | **CONTENT** authored against shipped admission. A "statehood bill" = a Legis-Prop wrapper whose effect calls the existing admit. Missouri/Cession **as a FREE state** = an admission carrying a slavery-status flag — the status flag is the only novel bit. |
| **Land Ordinances / Acts** (Land Ordinance 1784/1785, Northwest Ordinance, Land Act 1804, Donation Land Claim Act, Desert/Kincaid/Donation Acts) | **PARTIAL** — these are historical *settlement-enabling* acts; they gate/seed territory that the admit system can later realize. No "ordinance" primitive ships. | **CONTENT** (Legis-Prop instances), but several carry **settlement/population effects** → see #260 cross-ref below. |
| **Create District of Columbia** | **YES (data exists)** — #55 records **DC as a full state in the modern 53-state roster**; the expansion/roster machinery can carry it. | **CONTENT** — a Legis-Prop that admits/creates DC. Capital-seat semantics (cf. "Various Move Capitol Bills") are NOT modeled — minor new requirement. |
| **Annex occupied Cuba / Santo Domingo / Haiti / Nicaragua / Panama** (+ Annex Hawaii) | **PARTIAL** — the *target states* ship in `expansionStates.ts` (Cuba, Antilles, etc.) and `admitState` can add them. **But "annex OCCUPIED X" presumes a prior OCCUPATION state on the territory — which does NOT ship.** "Annex" in the build = direct admit from registry, no occupy-gate. | **MIXED: target=built, the occupy→annex CHAIN=NEW.** The prereq ("X is occupied") is a #258 predicate; the occupation state itself is unmodeled (ties war/occupation system + diplomacy #107). |
| **Grant X Independence / make X a Client-State** (Grant Liberia/Philippines/former-Mexico-below-Rio-Grande Independence; Grant Fed Power to make Cuba a Client-State) | **NO** — no "independence" (remove-from-Union / set-to-foreign), no client-state status anywhere in `src/`. | **NEW** — the OPPOSED options of the annex chain; needs a territory↔foreign-nation status transition + a client-state status value. |
| **Split a state into two** (Split Texas into several states; Split California into two) | **NO** — `grep` for `splitState` / split-state logic → **ZERO**. Admit is add-only; no fission of an existing state into two seat-bearing states. | **NEW ENGINE** — a state-FISSION op (recompute reps/EV/senators for both halves; cf. apportionment #34/#55/#219). |
| **Abolish the States Amendment · Grant States the Right to Secede Amendment** | **NO** — secession ships ONLY as the scripted **1856 Secession-Winter** event (`phaseRunners.ts:2834`, `eraEvents1856.ts`); there is **no player-legislated secession right and no abolish-states path.** | **NEW** — constitutional-amendment content that mutates the state model's existence/exit rules (amendment-as-Legis-Prop with structural effect). |
| **Indian Removal Act · Early Indian Removal · Bureau of Indian Affairs · Dawes Act · Indian Appropriations Act · Removal bills for hypothetical states** | **NO** as policy-with-effect — Indian Removal exists in the KB only as **content GATED behind owning LA (#92)** and as one-shot demographic-removal flavor; no tribe/demographic model, no removal effect. | **NEW (demographic effect)** — these mutate state population/demographics → strong **#260** cross-ref + the Native-American civil-rights sub-cluster (`9bd91ee2`). |
| **Land-grants-to-settle / -populate X** (Ohio, West Coast/SW/Mountain, Florida, WY/ID/MT/ND/SD, Great Plains, US-controlled Antarctica; Grand[sic] Land Rights to Squatters; Sell Land to Highest Bidder) | **NO** as effect — no population/settlement lever; `state.bias` is a static scalar, only dynamic mover is the #247 ±1 region nudge. | **NEW (population effect)** — Homestead-style settlement content → **#260** (event/action→population shift feeding apportionment/lean). |
| **Reconstruction-in-specific-states bills · Teller Amendment · Purchase Mexican Cession from Mexico / Purchase Greenland / Panama Canal Zone** | Purchases = acquisition (the "done" axis, mostly out of scope per POST 1); Reconstruction = state-status content. | **CONTENT** (Legis-Prop / Pres-Action wrappers); purchase-of-foreign-land overlaps the treaty/diplomacy spine (#107, #177/#178). |

**Pres-Actions (~12, POST 1):** **recognize hypothetical nations** (Confederacy,
Northern Conf, etc.), **end US occupation** (the opposed twin of annex), purchase
Mexican territory / Greenland / Panama Canal Zone, **call on Congress to annex
Cuba / DR** + **call on Congress to grant Philippines independence** (executive→
legislative referral pattern), **Institute Policy of "Civilizing" Indigenous
Tribes** / **Remove "uncivilized" tribes**, Lewis & Clark Expedition, Treaties
with native tribes to grab land, Advocate Manifest Destiny.

**Gov-Actions (3, POST 1):** Treat Native Americans with Caution · Force Local
Native Tribes to Assimilate · Encourage settlement on remaining indigenous tribal
lands. → all three are **per-state demographic/Native-American levers** (#260 +
#20 per-state Gov-action upgrade + civil-rights Native sub-cluster).

---

## ★ Novel sub-mechanics (the parts worth engine attention)

1. **Occupy→annex CHAIN gated on a prior war/occupation state (POST 1).** "Annex
   Occupied Cuba/Santo Domingo/Haiti/Nicaragua/Panama" each presume the territory
   is already OCCUPIED (a state set by a prior war). The shipped `admitState` has
   **no occupy-gate** — it admits any registry state directly. So the requirement
   is (a) a per-territory **occupation status**, set by the war system, that (b)
   acts as a **#258 prereq** on the annex Legis-Prop, with (c) **opposed options**
   (end occupation / grant independence / make client-state). Cross-ref the war
   system + diplomacy "recognize nation" (#107).

2. **Recognize hypothetical nations as Pres-Actions (POST 1).** Recognize the
   Confederacy / Northern Confederation / former-Mexico-below-Rio-Grande — i.e.
   **diplomatic recognition applied to ALT-HISTORY states** the game's branching
   produced. Ties the alt-history state model to diplomacy recognition (#107
   "recognize nation"). No engine home (recognition ships only for the fixed
   diplomacy nation roster; hypothetical/seceded entities aren't recognizable
   targets).

3. **Indian Removal + demographic effects (POST 1, Gov-Actions).** Indian Removal
   Act / BIA / Dawes Act / "civilize"-assimilate-remove tribes / "encourage
   settlement on tribal lands" — these **mutate state population/demographics**,
   not just set a flag. → **#260** (event/action→population-shift) + the
   Native-American civil-rights sub-cluster (`9bd91ee2`). Also the land-grant-to-
   populate cluster drives **settlement→population** the same way.

4. **State FISSION — split one state into two (POST 1; POST 4 worked example).**
   Split Texas / California into multiple states. **No admit-fission op ships.**
   POST 4 (vcczar) surfaces a concrete consequence question: *if California splits
   AND the Missouri Compromise is kept, does southern Nevada go to Arizona (since
   Nevada must be split from its modern rendition)?* → splitting cascades through
   **derived state geography + apportionment** (#34/#55/#219). POST 5 raises the
   inverse (West/East Florida statehood vs folding West Florida into LA/AL/MS; or
   just MS statehood vs creating the Alabama Territory) — **alt-history boundary
   branches** the fixed 13/31-state scenario rosters don't model.

5. **Structural-amendment content (POST 1).** "Abolish the States Amendment" and
   "Grant States the Right to Secede Amendment" are Legis-Props whose effect
   changes the **existence/exit rules of the state model itself.** Secession ships
   ONLY as a scripted 1856 event, never as a player-grantable right; abolishing
   states has no path. These are amendment-as-Legis-Prop with structural payload.

---

## Boundary / scoping rulings (GM-grade)

- **★ Colonization is "land-grabbing" → mostly out of scope; SPACE colonization
  already has content (POST 2/3).** Willthescout7: would colonization count as
  land-grabbing, tied to European relations? vcczar (POST 3): **"Yeah. We got
  colonizing in space events and legis props already."** → (a) confirms the
  acquisition axis is the "done" half this thread deliberately skips; (b) **Space
  expansion already HAS authored content** (events + legis props) — corroborates
  **#206** (Era-of-Future) and the Space policy genre (`5da48f61`). US-controlled
  Antarctica land grants (POST 1) + space colonization are the **future** wing of
  this genre.

- **Free/slave STATUS rides on admission (POST 5).** "Create Missouri as a Free
  State" / "Establish Mexican Cession as Free State" / the West-Florida statehood
  options imply admission carries a **slavery-status flag** that interacts with the
  Missouri Compromise (POST 4) — a status attribute on the admitted state, not a
  new primitive. Couples Expansionism to the Slavery genre (sibling top-level
  genre per the civil-rights boundary ruling).

---

## Community content asks (candidate content, not accepted)

- **POST 6 (the broadest add):** for every region NOT explicitly listed, include
  Legis-Props that **"provide land grants to veterans / volunteers / immigrants to
  settle newly acquired territory X."** Plus the **opposed-pair settlement
  options**: **forcibly removing locals from territorial acquisitions in X without
  compensation ↔ compensating former owners of property in X**; **provide land
  grants to Native-American tribes currently on reservations**; **endorse
  territorial constitution for territory X.** → all are **per-territory,
  parameterized-by-region** settlement content (a content-template-with-a-territory-
  parameter shape) and all carry **population/demographic effects** (#260) +
  opposed-axis options (the #221 ban↔legalize↔mandate / opposed-pair pattern).

---

## Engine facts (verified this run — do not re-derive)

- **Territory admission SHIPS:** `admitState(snap, stateId)` (`src/engine/
  territories.ts:8`) is idempotent (no-op if state exists), seeds from
  `EXPANSION_STATES_BY_ID`, sets `admissionYear`/clears officers, and newly
  admitted states are auto-picked-up by the gov/congress/draft phases. The
  annexable-target registry (`src/data/expansionStates.ts`) ALREADY contains the
  annexation targets in this thread — Cuba, Greenland, Brazil, Antilles, Bahamas,
  Baja Sonora, Belize, etc. The Territories page (`TerritoriesPage.tsx`) is the
  shipped admit UI. **So "annex X" / "statehood for X" = content authored against
  built code, NOT new engine.**
- **What does NOT ship (codebase-verified):** state-FISSION (`grep splitState` →
  ZERO), player-legislated **secession right** / **abolish-states** (secession is
  ONLY the scripted `secession-winter` 1856 event, `phaseRunners.ts:2834` /
  `eraEvents1856.ts`), **occupation status** on a territory (no occupy→annex gate —
  "annex" = direct admit), **client-state / grant-independence** status
  transitions, **recognition of hypothetical/seceded nations**, and any
  **event/action→population/demographic** effect (`state.bias` is a static scalar;
  only dynamic lever is the #247 ±1 region nudge).
- The three **#221 content primitives** (Legis-Prop / Pres-Action / Gov-Action)
  remain **designed-only, 0% shipped**: `interface Legislation` has the 4-value
  `committee` and **no `subtype`, no prereq/condition field**; no Pres-Action /
  Gov-Action catalog. So the ~45 L + ~12 P + 3 G rows here have no engine home as
  primitives — even the statehood ones, which would otherwise just call the
  shipped `admitState`.

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs — do NOT assign new numbers. Consolidation owns the
gap-log write.)*

- **#237 (stateful policy-genre framework)** — CORROBORATE (brief; framework
  well-established). Expansionism is a concrete genre instance in **raw/untagged**
  form (no `L/P/G` prefixes, no `*-Default`, no `Preq:`). ~45 L + ~12 P + 3 G.
  Source: POST 1.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE. Implies an
  **"Expansionism"** subtype value, spanning statehood / territory / land-ordinance
  / annexation / settlement / Indian-affairs sub-clusters; couples to the **Slavery**
  sibling genre via free/slave admission status. Source: POST 1, 4, 5.
- **#221 (3-primitive content system)** — CORROBORATE. Populates all three
  primitives; Pres-Actions include **stance** (Advocate Manifest Destiny) +
  **executive→legislative referral** ("call on Congress to annex…") +
  **opposed twins** (annex ↔ end-occupation). ★ ENRICH (flag): **even the statehood
  primitives that would just wrap the shipped `admitState` have no engine home** —
  Expansionism is the clearest case where the #221 primitive layer is the only
  thing standing between authored content and ALREADY-built mechanics. Source:
  POST 1, 6.
- **#258 (predicate/prereq-gated availability field)** — CORROBORATE + sharpen.
  The **occupy→annex chain** needs an "X is occupied" game-state predicate
  (war/occupation-set) gating the annex Legis-Prop; free/slave-status and Missouri-
  Compromise interactions are state-flag predicates; "split CA only if Missouri
  Compromise kept" is a compound predicate. Adds **occupation-status** and
  **territory-status** to the predicate-target classes. Source: POST 1, 4.
- **#260 (event/action→population/demographic-shift effect)** — CORROBORATE +
  ENRICH (strong). **Indian Removal / Dawes / "civilize"-assimilate-remove** and
  the **land-grant-to-settle/populate** cluster (Ohio, Florida, Great Plains,
  West Coast, Antarctica, squatters/veterans/immigrants) are
  **Legis-Props/Gov-Actions that mutate state POPULATION/DEMOGRAPHICS** (feeding
  apportionment/lean) — the action-driven twin of #260's event-driven Boll-Weevil/
  Great-Migration shift. The 3 Gov-Actions are explicitly per-state Native/
  settlement demographic levers. Source: POST 1, 6.
- **#107 (diplomacy / recognize-nation)** — CORROBORATE + extend the TARGET set.
  **Recognize hypothetical nations** (Confederacy, Northern Conf, former-Mexico)
  as Pres-Actions = diplomatic recognition applied to **alt-history/seceded
  entities**, not just the fixed nation roster; **grant-independence / client-state**
  are territory↔foreign-nation status transitions; purchase-foreign-land overlaps
  the treaty/diplomacy spine (#177/#178). Source: POST 1.
- **#262 (content-coverage / per-primitive + per-band balance)** — CORROBORATE.
  vcczar's POST-1 framing IS a coverage ask: **land-acquisition content is DONE,
  the NON-acquisition expansionist axis is the hole** — a per-SUBTYPE-within-genre
  coverage gap (the same shape as the per-ideology / per-primitive holes #262
  already tracks). Source: POST 1.
- **#206 (Era-of-Future content)** — CORROBORATE. POST 3: **space colonizing
  events + legis props ALREADY exist** (so the Future wing of Expansionism has
  content); US-controlled Antarctica land grants are Future-band. Source: POST 2/3,
  POST 1.
- **#34 / #55 / #219 (apportionment: census-driven EV, alt-state roster, US-Rep
  proportional share)** — CORROBORATE + flag a NEW operation. **State FISSION**
  (split Texas/California into two; the Florida statehood-vs-fold branches) requires
  recomputing reps/EV/senators across the resulting states and cascades through
  **derived state geography** (POST 4's Nevada→Arizona question). #55 already
  records **DC/Cuba/PR as full states in the modern 53-roster**, so "create DC" /
  "annex Cuba" are roster data the apportionment model partly anticipates — but the
  **split-into-two op** is unmodeled (admit is add-only). Source: POST 1, 4, 5.
- **#20 (Governor Actions, flat/state-agnostic)** — CORROBORATE (light). The 3
  Gov-Actions (Native caution / assimilate / encourage-settlement) are per-state
  demographic levers — reinforces the per-state Gov-action upgrade as their home.
  Source: POST 1.

### ★ Items with NO clean existing gap ID (flag for consolidation — do NOT number)
- **State-FISSION operation** (split one seat-bearing state into two, with
  geography + apportionment cascade) — sits between #34/#55/#219 (apportionment)
  and the state model; no row owns "split a state." POST 1, 4.
- **Player-legislated SECESSION-RIGHT / ABOLISH-STATES structural amendments** —
  amendment-as-Legis-Prop that mutates the state model's existence/exit rules;
  secession ships only as the scripted 1856 event. No row owns player-grantable
  secession. POST 1.
- **Territory OCCUPATION status + occupy→annex/independence/client-state state
  machine** — the per-territory status that gates the annex chain; partly #258
  (the prereq) + partly war-system, but the **status itself** and the
  independence/client-state transitions have no owner. POST 1.

---

### Provenance notes
- Single chunk; all 6 posts read. Pure design/crowdsourcing log — **no die-rolls,
  no playthrough mechanics, no era/year progression.** vcczar (tier-1) authors the
  genre + the coverage ask + the colonization/space ruling (POSTs 1, 3) and the
  CA-split + Florida-statehood consequence questions (POSTs 4, 5); Willthescout7
  (POST 2) and ConservativeElector2 (POST 6) add the colonization question and the
  per-territory settlement-template asks. Treat POST 1 (genre + ask) and POST 3
  (space-already-built ruling) as load-bearing; POSTs 4–6 add the novel
  consequence/template content.
- Codebase verified at `src/` HEAD 2026-06-28: `admitState` + `expansionStates.ts`
  registry + `TerritoriesPage` SHIP (territory admission is the rare built-genre
  overlap); `grep splitState` → ZERO; secession exists only as `secession-winter`
  (`phaseRunners.ts:2834`); no occupation-status / client-state / grant-independence
  / event-action→population mechanism in `src/`; `Legislation` has no `subtype`/
  prereq field (the #221 primitives are 0% shipped).
