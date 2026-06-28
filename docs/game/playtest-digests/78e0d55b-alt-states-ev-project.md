# Digest — 78e0d55b "Alt States EV Project"

**Source:** `docs/game/sources/78e0d55b-alt-states-ev-project/` (1 chunk, 44 posts,
~24k chars). Topic 1700, "Alt States EV Project."
**Type:** Authoring / reference thread (NOT a playthrough). Solo running log by
**@OrangeP47** — the census/EV data authority — as he writes EV-change *events*
for every alt-state in the master census file, plus a Q&A on statehood
eligibility. Dated 1/2023–4/2023.
**Scope:** The authoritative **alt-state catalog** ("what can be a state") + the
**EV-mutation spec** (how alt-state electoral votes grow/shrink over the
1772–2020 timeline). This is the durable design reference behind
`src/data/expansionStates.ts`.

> Era framing per `docs/game/historical-context.md`: this is a content/data
> thread, era-agnostic; the relevant axis is the **modern EV/census era**
> (states sized by 20th–21st-century population, WW2 as a development gate). No
> polarity concerns apply.

---

## What this thread is (and why it exists)

- OrangeP47 had been authoring these in a PM and moved it to a thread (POST 1).
  The stated dual purpose (POST 8): (1) **fill out the EV-change events** for
  each alt-state, and (2) **document for everyone "what was and was not a valid
  state,"** because previously **only V (vcczar) knew what the alt-states were**
  and "Can X be a state?" was a top recurring question.
- He works **alphabetically through the master census spreadsheet** (POSTs 10,
  16). The file has **112 entries** (POST 8), but that count is misleading: it
  **includes the historical 50 states** and **excludes fusion/split variants**
  — California-split-into-2, Texas-into-4, and Canada-admitted-as-one-state vs.
  per-province (POST 8); other "fusion states" like Deseret aren't in the 112
  either (POST 10). So **the true max number of possible states is unknown**
  ("some are mutually exclusive or combine/split from others," POST 10).
- This is the **same census/EV authority** delegated to canonize the Canada map
  in `250bd843` (Canada Alt-States); cross-reference that digest for the Canada
  subset and the "EVs are canon, biases are the gap" finding.

## The alt-state roster (catalog — compact reference)

Numbers are OrangeP47's spreadsheet order (alphabetical). This is the audited
list of **non-historical states** he wrote events for or confirmed:

1 Alberta · 2 Amazonia · 3 Antilles · 4 Argentina · 5 Bermuda · 6 Bogota ·
7 Belize · 8 Bahamas · 9 Baja Sonora · 10 Bolivia · 11 Brazil · 12 Costa Rica ·
13 Cuba · 14 Davao · 15 Durango · 16 Ecuador · 17 El Salvador · 18 Greenland ·
19 Guatemala · 20 Guayas · 21 Guianas · 22 Haiti · 23 Honduras · 24 Iceland ·
25 Jamaica · 26 Latin Columbia · 27 Liberia · 28 Lima · 29 Luzon · 30 Manitoba ·
31 Mindanao · 32 Miranda · 33 Monterrey · 34 New Brunswick · 35 Newfoundland ·
36 Nicaragua · 37 North Chile · 38 Northern Canada · 39 Nova Scotia ·
40 Old Mexico · 41 Ontario · 42 Panama · 43 Panay · 44 Paraguay · 45 Parana ·
46 Patagonia · 47 Pernambuco · 48 Peru · 49 Puerto Rico · 50 Quebec ·
51 Quezon · 52 Rio · 53 Santiago Chile · 54 Santo Domingo · 55 Sao Paulo ·
56 Saskatchewan · 57 Toluca · 58 Uruguay · 59 Vancouver · 60 Venezuela ·
61 Visayas · 62 Yucatan.
(POSTs 1, 9, 11, 13–14, 21–22, 24–30. Note: he stopped at Yucatan = "done with
all states for the allotted timeframe," POST 30; the count above is the
*alphabetic-tail* he documented in-thread, not all 112 — the A–K block was
posted earlier in the PM.)

**Geographic decoder (non-obvious, POSTs 12, 32, 41, 59):**
- **Old Mexico** = the SW *coast* of Mexico; **Toluca** = the **Mexico City**
  area (POST 12).
- **Miranda** = the **Caracas** city-state (financial center by the 2020s, "like
  NYC but smaller," POST 5).
- **Davao** = a finance city-state; **Luzon** = the *rural* Philippines (minus
  Manila/Quezon); **Quezon** = the Manila metro (POSTs 3, 5).
- **Vancouver** = British Columbia (POST 30).
- **Lima** and **Peru** are **two distinct states** (POSTs 3, 25); likewise
  **Latin Columbia** and **Panama** are different states acquired by different
  means (POST 2); **Santiago Chile** vs. **North Chile** split (POSTs 7, 28).

**Suggested additions (by @theFreezerFlame, POST 31 — NOT authored, declined as
"too late to change," see below):**
- Pacific: Mariana Islands, Samoa, Micronesia, Marshall Islands, Palau.
- Australia (7): New South Wales, Victoria, Queensland, Western Australia, South
  Australia, Tasmania, Northern Australia.
- New Zealand — either one state (NZ) or two (Aotearoa/North + Te
  Waipounamu/South).

## EV-MUTATION MECHANICS (the core durable signal)

Alt-state EVs are **not static**. EV-change *events* grow (and sometimes shrink)
each state's EV across the 1772–2020 timeline. Key authored behaviors:

- **EV growth over time, with industry flavor.** Each state has a development
  arc — typically agricultural in the 19th c., shifting to manufacturing in the
  20th, then finance/high-tech/tourism (POSTs 5, 11, 36-flavor). Industries are
  authored *separately* from the raw EV numbers (POST 24: "all these figures are
  without industry changes").
- **EVs can DECREASE; some alt-states GIVE EVs BACK to the mainland.** This is
  the standout mechanic. **Luzon** is the first state authored to lose EVs and
  hand them back to mainland states (POST 3); **Quezon** also loses EVs over time
  (POST 26, "EVs will flow away from it eventually not just to it"); **Toluca**
  gives EVs to other regions early on (POST 29). Most EV-losing states are in the
  Philippines (POST 26).
- **Synergy / inter-state pull events** (priority bumped, POST 2): when you hold
  **multiple alt-states in a region**, edge-case events make alt-states **pull
  EVs from OTHER alt-states** so a region's growth isn't unbounded. Examples:
  **Panama pulls from Latin Columbia** in the 21st c. (POSTs 2, 14); **Luzon↔Quezon
  intermotion** (POST 3). Authored before either partner state was finished, i.e.
  cross-state dependencies are designed up front.
- **Alt-states STEAL EVs from historical mainland states** (deliberate, to model
  migration/economic shift): from **Massachusetts** (New Brunswick, POST 7);
  from **Rust Belt** states (North Chile, Ontario "the Rust Belt success story,"
  POSTs 7, 13); from **California** (Latin Columbia *takes EVs from CA* — the
  reason it can out-rank CA; Old Mexico's high-tech phase, POSTs 1, 11); from
  **Florida + California** (Old Mexico's tourism phase, POST 11); from **high
  African-American-population states** to model the Great Migration (Liberia,
  POST 1). OrangeP47 spreads the theft around so no single historical state is
  over-depopulated, noting most runs won't hold many alt-states anyway (POST 11).
- **Development frequently GATED on WW2 (and sometimes the Civil War).** Many
  Latin American/Pacific states "require entering WW2 to reach full potential"
  (POSTs 3, 22, 26, 28): Luzon, Parana, Quezon, etc. **Sao Paulo** is the first
  state requiring **both the Civil War AND WW2** to peak (POST 28). A single
  Ontario EV hinges solely on US WW2 entry (POST 13).
- **"Always 3 EV" states have NO events** — flat, nothing to author:
  **Newfoundland** (POST 7), and most low-pop Canadian provinces / Northern
  Canada are near-trivial (POSTs 11, 38-flavor).
- **Plantation-economy alt-states** (slave/plantation industry boost via EV
  events): **Rio** is the first/primary one ("the only one that fits to do via
  EV events," POST 27), later **Venezuela** (plantation → oil, POST 30). Most
  Central/South American states *are* slave states but get the plantation boost
  through other means, not EV events (POST 27).
- **Largest state in the game: Pernambuco** — caps at **~81 EV with WW2**, **69
  without** (POST 24, "without industry changes"). **Latin Columbia** is the
  other beast, rivalling/exceeding California, and notably its growth is **NOT**
  WW2-dependent (POST 1).
- **Space-program launch-site alt-events:** **Panama** can be selected as the
  space program's launch site (a geographically apt sci-fi trope); **California
  and Texas already have this alt-event** if Florida isn't chosen as in reality —
  so **4 possible launch sites** exist as authored EV/event content (POST 14).
- **Dynamic industry ordering:** Miranda's 1950s industries develop in a
  *dynamic order*, converging on finance by the 2020s (POST 5) — i.e. some
  events branch on prior state.

> Provenance note (cross-batch): these EV changes are **authored EVENT content**,
> not a typed engine effect. The only EV mutation in shipped engine code is the
> one-time **Constitutional-Convention ratification rewrite**
> (`constitutionalConvention.ts:210`: `s.electoralVotes = max(3, ccDelegateSlots+1)`
> when colonies become a federal republic). The b44 cross-refs cited in the brief
> (#277 Canada placeholder EV:4/bias:0; #276 Kagan EV-fix) and the tech-lead's
> "only shipped engine EV-rewrite is the CC slave-compromise plank" both point at
> the same conclusion: **the alt-state EV-mutation system is designed-intent
> authored content with no engine representation yet.** (Caveat for the
> tech-lead: the shipped CC plank that *most directly* rewrites `electoralVotes`
> is the colony→republic transition above; the `slaveCompromise` article
> [`constitutionalConvention.ts:34-39,111-115`] sets the 3/5 vs full vs none rule
> but I did not find it directly multiplying EV in-engine — verify which plank you
> mean before porting.)

## STATEHOOD-ELIGIBILITY RULES (the Q&A half, POSTs 35–43)

- **Minimum state population ~60,000** is the rule of thumb (POST 42), the
  generally-agreed IRL bar — though Nevada famously broke it for years (POSTs 41,
  42). This is the territory-vs-state gate.
- **Pacific islands are acquirable as TERRITORIES but cannot become states**
  (POSTs 36–42) — their populations are below the practical modern bar. "You can
  have them as territories, this is the state thread" (POST 36).
- **Guam is the odd case**: ~150,000 pop, technically over the floor but
  practically "in limbo forever," probably never a state (POST 42). Of the 5 real
  US territories: 2 are under 60k, 1 is close, **Puerto Rico** is clearly over and
  **can become a state**, Guam is the middle ground (POST 42).
- **The Pacific islands are the ONLY ownable-but-not-statehood-eligible cases**
  in the data, to OrangeP47's knowledge (POST 40).
- **Moon and Mars** can get EVs **without being states** — "via the same method
  DC can" (POST 43). **DC can also get EVs and can additionally become a state**
  (POST 43). I.e. the data model has a notion of **EV-bearing non-states** decoupled
  from statehood.
- **Fusion/split variants in the data model** (POST 8): **California → 2 states**,
  **Texas → 4 states**, **Canada → one state OR per-province** (OrangeP47 unsure
  on the one-state path's plumbing), plus other fusion states (Deseret implied,
  POST 10).

## DATA-HYGIENE / ABBREVIATION ITEMS

- **Abbr collision: Panama and Panay both "PN"** — OrangeP47 caught it (they were
  adjacent in the list) and recommends **Panay → "PY"**; he coded Panay assuming
  that change (POSTs 20–21). [Build resolves this differently — see deltas:
  Panama=`PAN`, and there is **no Panay seed at all** in `expansionStates.ts`.]
- Cross-ref `250bd843`: earlier abbr fixes there — **Manitoba = MB** (not MT),
  Northern Canada grouping. [Build uses `MAN`/`NCN`.]
- **"It's too late to change" the underlying state list** (POSTs 32–34): adding
  states now "would require revisions to events, wars, legis, and probably a few
  other systems… changing a lot of things for a small tinker." **Load-bearing for
  the port: the existing state list is frozen canon; the browser port must MIRROR
  it, not redesign it.** This is why theFreezerFlame's Pacific/Australia/NZ
  suggestions (POST 31) were declined.

## POST 44 artifact

- OrangeP47 posted a **map of the Philippines states' borders** per the master
  documents (image, not text-extractable here) — the canonical Luzon/Quezon/
  Mindanao/Davao/Panay/Visayas boundary reference.

---

## Deltas vs current build

**Verified against** `src/data/expansionStates.ts`, `src/engine/territories.ts`
(`admitState`), `src/engine/constitutionalConvention.ts`, `src/types.ts`
(`State.electoralVotes`/`bias`, line 1323-24).

**HEADLINE:** A large authored **alt-state EV-mutation content system** + a
**statehood-eligibility ruleset** exist in the design (this thread + the master
census sheet) that the browser port's territory/EV model must reproduce — and
today it reproduces **almost none of it**. Cross-ref `250bd843` #277-equivalent
(placeholder EV:4/bias:0) — that exact placeholder is confirmed system-wide here.

- **EV-mutation system entirely unbuilt.** No event grows/shrinks an alt-state's
  EV over time; no synergy/inter-alt-state EV pull; no alt-state-steals-from-
  mainland; no WW2/Civil-War development gates; no plantation-boost. `State`
  carries a single static `electoralVotes: number` (`types.ts:1323`) and nothing
  mutates it except the one-time CC ratification rewrite
  (`constitutionalConvention.ts:210`). **Requirement:** an authored
  EV-delta/event primitive keyed to year + preconditions (WW2 entry, Civil War,
  co-held states) that can *add to one state and subtract from another* (incl.
  giving EV back to the mainland — Luzon/Quezon/Toluca).
- **Flat placeholder data for ALL ~140 expansion seeds.** `EXPANSION_STATES`
  (`expansionStates.ts:173-183`) hardcodes **every** alt-state and territory to
  `electoralVotes: 4, bias: 0, industries: {agriculture:2, trade:1},
  isSlaveState: false`. So Pernambuco (canon ~81 EV), Latin Columbia (rivals CA),
  and Newfoundland (always 3) are all "4 EV, neutral, agrarian" in the build.
  **Requirement:** import the canon per-state EV curves + industries + biases +
  slave-state flags from the census sheet.
- **`admitState` is a pure seed-copy, no EV logic.** `territories.ts:8-23`
  spreads the seed and stamps `admissionYear` — it never computes/schedules EVs
  and has no notion of territory-vs-state. **Requirement:** the locus for both
  EV-event wiring and the statehood gate.
- **No statehood-eligibility gate.** The build has **no population field** on
  `State`/`StateSeed` and **no territory-vs-state distinction** — every seed is
  admittable identically (the Pacific-island "territory only" rule, the ~60k
  population floor, Guam's limbo, are all absent). Note the build *registers*
  Guam/American Samoa/Marianas/Marshall/Micronesia/Palau etc. as ordinary
  admittable seeds (`expansionStates.ts:106-170`), directly contradicting POSTs
  36–42 ("Pacific islands = territories, never states"). **Requirement:** a
  `population` (or `canBecomeState` / `territoryOnly`) flag enforcing the
  eligibility ruleset.
- **EV-bearing non-states unmodeled.** Moon/Mars/DC-as-EV-without-statehood
  (POST 43) has no representation; `electoralVotes` only lives on admitted
  `State`s. DC is registered as a plain admittable seed
  (`expansionStates.ts:110`) with no "EV without statehood" path. **Requirement:**
  decouple EV-bearing from statehood for these cases.
- **Fusion/split variants unmodeled.** No CA→2, TX→4, or Canada-as-one-state
  data path in `expansionStates.ts` (Canada is per-province only; no Deseret;
  no split-California). POST 8 says these are in the master data model.
  **Requirement:** represent mutually-exclusive split/fusion state variants.
- **Suggested-additions are correctly absent (no action).** Australia/NZ/extra
  Pacific (POST 31) were declined as canon ("too late to change," POSTs 32–34).
  The build *does* carry many of these as **territory** seeds (Australia not
  present; Samoa=`WSM`, Marshall=`MHL`, Micronesia=`FSM`, Palau=`PLW`, etc.),
  consistent with "territories yes, states no."
- **Abbr deltas (minor, canon-vs-build):** thread canon **Panay → PY**, but the
  build has **no Panay seed** and uses **Panama = PAN** (no PN collision in
  build). Canada abbrs differ from `250bd843` canon (build `MAN`/`NCN` vs canon
  `MB`). Reconcile against the master census abbreviations if/when EV data is
  imported.
- **Frozen-canon constraint (process, not code).** POSTs 32–34: the state list is
  deliberately frozen because changing it cascades through events/wars/legis. The
  port should treat `expansionStates.ts`'s roster as the canonical shape to
  *populate with real data*, not to re-derive.

## Code areas to touch (for tech/roadmap passes)

- `src/data/expansionStates.ts` — replace the flat `EV:4/bias:0/agrarian`
  placeholder (lines 173-183) with canon per-state data; add population /
  territory-vs-state / split-fusion fields.
- `src/engine/territories.ts` (`admitState`) — add the statehood-eligibility
  gate and EV-event scheduling hook.
- A new **alt-state EV-event** content+engine primitive (year + preconditions +
  source-state/target-state EV deltas). None exists today.
- Census/EV/industry/bias source data — must be exported from the GMs' master
  spreadsheet into the repo (same un-captured-data problem flagged in `250bd843`).

## Open questions (for the human)

- Where does the master census file (the 112-entry sheet + the per-state EV
  curves, industry arcs, WW2/CW gates, synergy/theft rules) live, and can it be
  exported into the repo as authored data? Without it, none of the above EV deltas
  can be ported faithfully.
- Should the port enforce the ~60k population floor and the Pacific-territory
  rule (removing those islands from the *admittable-as-state* set), given the
  build currently lets all of them become states?
- Is the EV-mutation system meant to fire as part of the existing era-event/era-
  graph machinery, or as a distinct census/EV subsystem?
- Reconcile abbreviations across this thread, `250bd843`, and the build before any
  data import (Panay/PY, Manitoba/MB, etc.).

## Cross-references

- **`250bd843` (Canada Alt-States):** the Canada subset of this roster; "EVs are
  canon, biases are the gap"; same EV:4/bias:0 placeholder finding; Central-Canada
  legacy. Same author (OrangeP47) delegated census/EV authority.
- **b44 #277 / #276 (Canada placeholder EV:4/bias:0; Kagan EV-fix):** corroborate
  the system-wide placeholder confirmed here.
- **`constitutionalConvention.ts:210`** — the one shipped in-engine EV rewrite
  (colony→republic), for contrast with the unbuilt alt-state EV events.
