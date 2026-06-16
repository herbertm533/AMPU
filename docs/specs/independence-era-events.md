# Spec: Independence-Era Event Graph (Phase 2.4.3, 1772 scenario)

> Sibling of `docs/specs/anytime-events.md` (2.4.2). Where 2.4.2 is the
> "world feels alive" random pulse, **2.4.3 is the scripted-history spine** —
> today a 7-event linear chain (`src/data/eraEvents1772.ts`) walked by
> `next1772Event` one event per turn. This spec converts that chain into a
> **branching decision graph** for the **Independence era only** (flowchart
> nodes 0–48, Gaspee Affair → the two Indian treaties), builds the
> reusable graph framework, and STOPs before the French Revolution node
> (idx 49 = Federalism, next era's build). Real events form the spine;
> counterfactual branches fill the tree; several nodes are terminal era
> endings. Events fire **probabilistically** once preconditions are met.
> Decisions are **roster-gated**: the player is prompted only when they
> control the office/politician who would realistically decide; otherwise
> the AI auto-resolves (the `ConventionModal` "unvoted use CPU consensus"
> precedent, applied to single events). The same 1772 start should diverge
> into very different histories.

## Vision (as given)

Transform phase 2.4.3 for the 1772 scenario from a 7-event linear scripted
chain into a branching decision graph. Real historical events form the spine;
counterfactual branches fill the tree; several nodes are terminal era-endings.
Events fire probabilistically once preconditions are met. Decisions are
roster-gated: prompt the player only if they control the politician/office
who would realistically make the decision; otherwise the AI auto-resolves.
The same scenario should diverge into very different histories.

**V1 scope (locked):** framework + the COMPLETE Independence era = chart nodes
0–48 (Gaspee Affair → the two Indian treaties), ~22–26 events with branches
and multiple endings. STOP before the French Revolution node (idx 49). Build
the framework to extend to later eras, but author Independence-only.
Diplomacy is OUT as a system — events may read/write the EXISTING diplomacy
scalars (`game.diplomacy`) only; no treaty/alliance state machine.

## Historical grounding (binding)

Source: `docs/research/independence-era-events-historical-context.md`. The
historian's binding-facts table, decider-role mapping, counterfactual-
plausibility ratings, and anti-pattern list are **hard constraints**. The
load-bearing facts this spec encodes:

1. **No `decider: 'president'` or `'cabinet'` on ANY node 0–48.** There is no
   President of the United States or Cabinet in 1772–1788 (those offices begin
   with the 1789 government). Decisions route through `cc-president`
   (Continental/Confederation Congress presiding officer) or `auto`; *military*
   matters route conceptually through Washington as Commander-in-Chief
   (a named general on the roster, not a "president"). The existing
   `eraEvents1772.ts` already obeys this — preserve the discipline.
2. **Label corrections (binding):** node 2 "Tax Act" = **Tea Act 1773** (the
   game already labels it correctly); node 30 "King George III Grants America
   Autonomy" → **Parliament authorizes peace, 1782** (not the King's personal
   act, not 1786); node 41 Fort Stanwix = the **Six Nations / Haudenosaunee**;
   node 45 Hopewell = **three compressed treaties** (Cherokee/Choctaw/Chickasaw)
   and its cynical "we'll break it anyway" option (47) is historically
   *accurate* — keep it; node 44 "Iroquois League War" → **frontier conflict
   with the Six Nations** (no unified war); node 48 "Keowee War" → the
   **Chickamauga / Cherokee–American wars**.
3. **Spain reframe (binding):** nodes 25–26 ("Liberty Treaty w/ Spain" → "Spain
   meter moves to ally") are **fantasy** — Spain never allied with the US. Recast
   as **Spanish belligerence vs. Britain + covert aid via Louisiana** (goods up
   the Mississippi). Keep it as an event; fix framing/effects; it adjusts the
   `diplomacy` scalar for Spain and Britain, it does NOT create a US–Spain ally
   state.
4. **Counterfactual timing fixes (binding):** British war-weariness toppled
   North in **1782** (not the chart's 1786 gate on node 34); American war-
   weariness/currency-collapse plausibly ends the war **1780–81** (node 32's
   1780 gate is right). A "win without proclaiming independence" (node 8) is a
   stylized dominion-status fork, framed as "autonomy within empire," not a
   silent battlefield win.
5. **Anachronism guards (binding, assertable):** no national bank / Treasury /
   Mint / Wall Street / national currency / "the dollar" in-era (the only
   in-era financial fact is the **Dutch loan, 1782** — foreign credit);
   "Federalist/Anti-Federalist" are **ratification-debate positions (1787–88)**
   mapped to the game's RED/BLUE factions, never the modern party system; in
   1772–88 **Vermont** is an independent republic (state only in 1791),
   **Kentucky/Tennessee** are frontier territories not states, the Northwest
   Territory is unorganized until the 1787 Ordinance.

**Deviations from the historian's binding facts:** none. Where the chart's
own node text is wrong (nodes 30, 44, 48, 25–26, and the 34/1786 timing) this
spec adopts the historian's corrected framing rather than the chart's literal
text, exactly as the historian directs. The riskiest *interpretive* calls
(which endings advance to Federalism vs. end the campaign; the Spain reframe's
effects; the "win without independence" framing) are surfaced in Open
Questions for the Checkpoint-1 adjudication.

## Player experience

Each turn, the era spine advances: a real historical event fires (Gaspee,
Tea Act, Lexington) or a decision lands in your lap **if and only if your
faction holds the office that would decide it** — does your faction control the
President of the Continental Congress when Lee's Resolution comes to a vote? If
so, you choose; if not, you watch Congress decide and live with it. Once the
war starts, your path forks: ally with France and lock in eventual victory;
take Britain's Carlisle offer and settle for dominion status (a real 1778
off-ramp); lose the war and face a loyalist reabsorption "Game End"; or win and
proceed to found a government, claim or release Vermont, and dictate land
cessions to the Six Nations and the Cherokee/Choctaw/Chickasaw. Because events
fire **probabilistically** once eligible and branches gate on your choices and
your roster, two playthroughs of 1772 diverge into genuinely different
histories — one ends at the Constitutional Convention, another at a negotiated
peace inside the British Empire, a third at a battlefield collapse.

## User story

As a player running the 1772 scenario, I want phase 2.4.3 to present the
Revolution as a branching graph of historical and counterfactual events that
fire when their preconditions are met — prompting me to decide only the nodes
my faction actually controls (the CC presidency, or a general on my roster for
military forks) and letting the AI resolve the rest — with several branches
that end the era differently (found a constitutional government, settle for
autonomy within the empire, or lose the war), so that my choices and my roster
steer the Revolution down materially different paths and replaying 1772 yields
a different history each time.

## Verified engine facts (drive the design; architect must not re-derive)

- **Current 2.4.3 runner** `runPhase_2_4_3_Era` (phaseRunners.ts:2354) branches
  on `scenarioId === '1772'` → `next1772Event` (phaseRunners.ts:2366). That
  helper walks `SCRIPTED_1772` in array order, gated by `gateYear` and
  `requiresTemplate`, **firing at most one event per turn** (line 2371) and
  pushing the built `EraEvent` onto `game.pendingEraEvents`. The runner
  returns the next unresolved `EraEvent` for the UI. **This spec replaces the
  selection logic** (`next1772Event`) with a graph walker; it does NOT touch
  the non-1772 branch.
- **`resolveEraEvent`** (phaseRunners.ts:2383) is the single resolution path:
  it finds the response, calls `applyEffect(snap, resp.effect)`, sets
  `event.resolved`/`chosenResponseId`, logs to the feed, pushes
  `event.templateId` to `game.eraEventsCompleted`, then dispatches
  `handleScripted1772Consequences` (a `switch (event.templateId)`),
  `applyPostEffects` (generic `switch (pe.type)`), and `unlocks`. **The graph's
  branch-selection state is keyed off `eraEventsCompleted` + `chosenResponseId`
  exactly as the current chain already is.**
- **`EraEvent`** (types.ts:676) fields: `id`, `templateId?`, `year`, `title`,
  `description`, `responses: EraEventResponse[]`, `decider: 'president' |
  'congress' | 'cabinet' | 'cc-president' | 'auto'`, `resolved?`,
  `chosenResponseId?`, `triggersGameEnd?: boolean`, `unlocks?:
  ('governors'|'congress'|'presidency'|'court'|'continentalArmy')[]`,
  `postEffects?: { type: 'startWar'|'unlockGovernors'|'unlockArticles'|
  'startConvention'|'endWar'|'addPolitician'|'assembleCC'; payload?: unknown }[]`.
  **`triggersGameEnd` already exists** — terminal endings set it. **No new
  EraEvent fields are required for endings**; preconditions/probability/branch
  edges live in the new authoring data shape (below), not on `EraEvent` itself.
- **`EraEventResponseEffect`** (types.ts:659): `meters?:
  Partial<NationalMeters>`, `partyPreference?: number`, `enthusiasm?: {ideology,
  party, delta}[]`, `interestGroups?: {id, delta}[]`, `domesticStability?`,
  `startWar?: {name, against}`, `text`. **This is the entire effect surface
  events may write** (plus the GameState era-flags via unlocks/postEffects).
  Diplomacy scalars (`game.diplomacy`) are NOT yet in this struct — see
  Open Question 6 / the diplomacy-effect decision.
- **`GameState`** (types.ts:743) holds the era-system handles the graph
  triggers (does not reimplement): `currentEra`, `eraEventsCompleted: string[]`,
  `governorsExist`, `articlesOfConfederation`, `constitutionRatified`,
  `constitutionalArticles`, `continentalCongress: ContinentalCongress | null`,
  `revolutionaryWar: RevolutionaryWar | null`, `pendingConvention?`,
  `pendingEraEvents`, `diplomacy: Record<string, number>`,
  `meters: NationalMeters`, `partyPreference`, `interestGroups`,
  `playerFactionId`, `presidentId`.
- **Roster-gate primitives.** The CC presiding officer is
  `game.continentalCongress?.presidentId` (a politician id; that politician's
  `currentOffice.type === 'CCPresident'`). The player's faction is
  `game.playerFactionId`. A politician's faction is `p.factionId`. **"Player
  controls the decider"** = the decider office-holder's `factionId ===
  game.playerFactionId`. There is currently **no roster-gate in
  `EraEventModal`** — it always lets the player pick and merely *labels* the
  decider (EraEventModal.tsx:30). This spec adds the gate (see §UI).
- **AI-autofill precedent.** `ConventionModal` lets the player vote its
  faction's position and fills unvoted articles with "CPU consensus"
  (ConventionModal.tsx:24,53); `finalizeConvention` resolves CPU votes by
  ideology. **The same shape applies to single 2.4.3 decisions**: if the player
  doesn't control the decider, an AI picks a response by the decider's
  faction/ideology, and the event resolves without a modal.
- **Era-system entry points the graph TRIGGERS (does not reimplement):**
  - War start: `startRevWar(snap)` (revolutionaryWar.ts:29) — already invoked
    from `handleScripted1772Consequences` on `lexington_concord` response `a`.
  - CC convening: `assembleCC` postEffect → `appointDelegates` +
    `electCCPresident` + `appointCCCommittees` (phaseRunners.ts:2416).
  - Articles: sets `game.articlesOfConfederation`, re-elects the (now
    Confederation) CC president (phaseRunners.ts:2464).
  - ConCon: `makeConvention(year)` → `game.pendingConvention` opens the
    interactive screen (phaseRunners.ts:2510).
  - Territory: `admitState(snap, stateId)` (territories.ts:8) from
    `expansionStates.ts` seeds; the Treaty-of-Paris consequence already pushes
    OH/KY/TN/MS/AL as territories inline (phaseRunners.ts:2483).
- **`applyEffect`** (phaseRunners.ts:2518) clamps meters to -5..+5,
  partyPreference -5..+5, interestGroups -10..+10, and handles `startWar`. It
  does **not** currently read a `diplomacy` field — extending it for the Spain
  reframe is the one engine-effect change this spec contemplates (Open
  Question 6).
- **`rng.ts`**: `chance(p)`, `pick(arr)`, `pickWeighted(opts)`, `clamp`,
  `uid`. Probabilistic firing uses `chance`; **no `Math.random`** (CLAUDE.md
  determinism rule).

## Decisions (resolving the 6 open questions; each is a CP1 decision the user can override)

> These are PM recommendations with rationale. Each is tagged `[CP1-n]` and
> echoed in Open Questions for the checkpoint.

> **✅ CHECKPOINT 1 — APPROVED (user decisions, binding on the architect):**
> 1. Spec approved → proceed to brief.
> 2. **AI auto-resolve heuristic:** by the controlling faction's **ideology** (CP1-AI). The AI may take counterfactual branches when they fit its ideology.
> 3. **`warVictoryGuaranteed`:** **narrative-only in v1** (CP1-WAR) — recorded/shown in flavor, does NOT hook revolutionaryWar.ts. (Confirms CP1-6.)
> 4. **Ending map CHANGE:** node **38 "Confederation remains" is a REAL terminal ending** (`triggersGameEnd: true`), not a soft non-ending (CP1-3). Net endings now: **three** hard campaign-ends (11, 8, 38) + one era-advance (39). Sections below updated to reflect this.
> Decisions CP1-1, CP1-2, CP1-4, CP1-5 stand as the PM recommended.

### [CP1-1] Migration — replace the 7 events wholesale, fold the keepers in as spine nodes

**Recommendation: replace `SCRIPTED_1772` with the new graph, but carry the 7
existing events forward as spine nodes (re-authored into the graph format),
not delete them.** The current chain already (a) routes deciders correctly
(`cc-president` throughout), (b) wires `assembleCC`/`startRevWar`/Articles/
ConCon/Treaty-of-Paris consequences, and (c) seeds nice flavor (Common Sense →
Paine loses `Obscure`, Boston Tea Party → Sam Adams gains `Celebrity`). Those
become spine nodes 0–6, 12–14, 21, 27, 36, 39 in the graph. The graph adds the
branches and endings around them. Rationale: zero regression risk on the
already-working spine; the diff is "the walker got smarter and the tree got
wider," not "the chain was rewritten." Trade-off vs. a clean rewrite: we keep
the existing templateIds (e.g. `tea_act`, `lexington_concord`,
`treaty_of_paris`) so `eraEventsCompleted` semantics and the
`handleScripted1772Consequences` switch survive unchanged.

### [CP1-2] Precondition representation — serializable predicate tree (data-driven)

**Recommendation: a small serializable AND/OR predicate tree, not inline TS
predicate functions.** Each node carries an optional `precondition?: Predicate`
where:

```
type Predicate =
  | { all: Predicate[] }                       // AND
  | { any: Predicate[] }                        // OR
  | { not: Predicate }
  | { yearAtLeast: number }                     // game.year >= n
  | { yearAtMost: number }
  | { eventCompleted: string }                  // templateId in eraEventsCompleted
  | { eventChose: { template: string; response: string } } // a prior branch pick
  | { meterAtLeast: { meter: MeterKey; value: number } }
  | { meterAtMost: { meter: MeterKey; value: number } }
  | { interestAtLeast: { group: string; value: number } }
  | { diplomacyAtLeast: { nation: string; value: number } }
  | { warActive: boolean }                      // game.revolutionaryWar?.active
  | { stateAdmitted: string }                   // snap.states has id
  | { officeControlledByPlayer: 'cc-president' } // decider held by player faction
  | { rosterHasSkill: { skill: SkillKey; min: number } } // any player politician
  | { flag: GraphFlagId };                       // a graph-set boolean (see [CP1-6])
```

A single pure `evalPredicate(snap, pred): boolean` interprets the tree.
Rationale: (1) preconditions become **inspectable data** (the architect, the
reviewer, and a future debug overlay can read them), matching how the sibling
2.4.2 spec kept templates as data not code; (2) determinism and testability —
a predicate tree is trivially unit-testable without standing up the engine;
(3) it future-proofs later eras (the same evaluator serves the Federalism
graph). Trade-off vs. inline functions: slightly more authoring ceremony per
node, and exotic one-off conditions need a new predicate kind — acceptable,
the kinds above cover every node 0–48 (verified against the roster below).

### [CP1-3] Which endings advance to Federalism vs. end the campaign

Terminal nodes and their disposition:

| Terminal node | Disposition | Why |
|---|---|---|
| **Game End — lost war / loyalist reabsorption** (11, reached from Revolutionary War "lose") | **End the campaign** (`triggersGameEnd: true`) | Britain reconquers; there is no American polity to carry into Federalism. The chart colours it GAME-END. |
| **Won but Independence not proclaimed → dominion status** (8; the Carlisle/Conciliatory settlements 23/24 funnel here) | **End the Independence era WITHOUT advancing to Federalism in v1** (era-terminal, `triggersGameEnd: true`) | The Federalism graph (idx 49+) presupposes an independent US with a 1789 government. A "dominion within the empire" outcome has no Federalism content authored. v1 treats it as a distinct *campaign ending* ("You secured autonomy within the British Empire"). Flagged: a future build could author a dominion-Federalism branch. |
| **Constitutional Convention ratifies** (39 → Constitution; the historical spine) | **Advance to Federalism** (sets `constitutionRatified`; era seam) — but the **French Revolution node and all Federalism content are out of scope**, so v1 ends the *authored* graph here and hands off to the existing era-advance machinery. | This is the one ending that continues the game as designed; nodes 49+ are the next era's build. |
| **B: Confederation remains the government** (38, from Annapolis) | **Terminal campaign ending** (`triggersGameEnd: true`) — a distinct "United States persists under the Articles of Confederation, never ratifying the Constitution" end-state. **[CP1 user decision: 38 is a real ending.]** | The "Articles persist" road-not-taken is historically real and a satisfying distinct end-state. Earlier-gated branches (Vermont 15–19 across 1777–91; Indian treaties 41–48 across 1784–86) resolve before Annapolis (1786), so reaching 38 cleanly ends the campaign under the Confederation. |
| **Frontier conflict with the Six Nations** (44) and **Chickamauga/Cherokee war** (48) | **Non-terminal conflict outcomes**, not endings | They are war/conflict consequences of the treaty branches, not era seams. |

**Net (post-CP1):** **three** hard campaign-endings (`triggersGameEnd: true`):
lost-war (11), dominion-status (8/23/24), and **Confederation-persists (38)**
[CP1 user decision]. One era-advancing ending: ratification (39).

### [CP1-4] History-pressure ratio — real events strongly favoured (default 4:1)

**Recommendation: when both a real-spine event and one or more counterfactual
branches are eligible the same turn, the real event fires with default weight
4× the combined counterfactual weight** (`HISTORY_PRESSURE = 0.8` → 80% chance
the spine advances, 20% a counterfactual fires, split by counterfactual
weight). Implemented as a single tunable constant in the new
`ERA_GRAPH_RULES`. Rationale: the historian frames the spine as "what actually
happened" and the branches as contingencies that *mostly* didn't; a 4:1 tilt
keeps a typical playthrough recognizably historical while leaving real
divergence (~1-in-5 forks go counterfactual, compounding across ~6 fork points
into materially different histories). Exception: at a **decision** node the
player controls, history-pressure does NOT apply — the player's choice is the
selector (pressure only biases *which eligible node the walker surfaces*, never
overrides a player decision). Trade-off: too high and the game feels on-rails;
too low and it stops feeling like the Revolution. 0.8 is the playtest starting
point, tunable in one place.

### [CP1-5] How branching outcomes trigger existing era systems — reuse the existing dispatch, do NOT reimplement

**Recommendation: every system trigger goes through the *existing*
`postEffects` dispatcher and the `handleScripted1772Consequences` switch — the
graph authors `postEffects`/`templateId`/`unlocks` on nodes and the engine
already knows how to fire them.** Integration contract:

| Graph outcome | Trigger (already exists) | Spec action |
|---|---|---|
| War begins (Lexington `a` → Revolutionary War) | `startRevWar(snap)` via the `lexington_concord` case | Keep the templateId; the case already calls it. |
| Continental Congress convenes (node 4) | `postEffects: [{ type: 'assembleCC' }]` | Author it on the CC node (the `intolerable_acts` node already has it). |
| Articles take effect (node 14) | `articles_of_confederation` case (sets flag, re-elects Confederation president) | Keep the templateId/case. |
| Constitutional Convention opens (node 39) | `constitutional_convention_kickoff` case → `makeConvention` → `pendingConvention` | Keep the templateId/case. |
| Treaty of Paris territory (node 27) | `treaty_of_paris` case (pushes OH/KY/TN/MS/AL territories) | Keep the templateId/case. |
| Vermont statehood (node 19) | `admitState(snap, 'vt')` | Add a new `postEffects` type **or** a new `handleScripted1772Consequences` case `vermont_statehood` that calls `admitState`. (Architect's choice; PM recommends a case for parity with existing pattern.) |
| Indian treaties (41, 45) | meters/interestGroups/diplomacy via `applyEffect` + optional territory via `admitState` | Author as response effects; no new system. |
| Terminal endings (8, 11) | `triggersGameEnd: true` on the `EraEvent` | Set the existing flag; the engine's end-of-game handling consumes it. |

**Rule: the graph never reimplements CC/ConCon/RevWar/territory logic — it only
*selects which node fires* and *authors the node's existing-shape consequences*.**
The only genuinely new engine seams are (a) the graph walker replacing
`next1772Event`, (b) the roster-gate + AI auto-resolve, and (c) optionally one
`admitState` consequence case for Vermont and one diplomacy effect kind for the
Spain reframe.

### [CP1-6] "Enable system/faction/action" flags — reuse existing unlocks where they exist; add a small typed graph-flag set for the rest

**Recommendation: use the existing `EraEvent.unlocks` union + GameState boolean
flags for the unlocks that already exist; add ONE small typed
`graphFlags: Record<GraphFlagId, boolean>`-style set on GameState for
graph-specific enables that have no home.** Mapping:

- Already have a home (use as-is): `governors` (`governorsExist`),
  `continentalArmy` (the `continentalArmy` unlock literal), Articles
  (`articlesOfConfederation`), Constitution (`constitutionRatified`).
- The chart's in-era enable flags that have **no existing field**:
  - "US can now take out loans" (node 29, gated on Dutch recognition 28) →
    `graphFlags.loansEnabled` (the **only** in-era finance flag — foreign
    credit, NOT a national bank; satisfies the anachronism guard).
  - "Cannot lose Rev. War" (node 22, gated on French alliance 21) →
    `graphFlags.warVictoryGuaranteed` (read by revolutionaryWar.ts loss
    handling — *flagged*: this only matters if the war system checks it;
    in v1 it may be a narrative/score flag if the war can't otherwise be
    forced to a win).
  - Spanish belligerence/covert aid (reframed 25–26) → no boolean; it writes
    the `diplomacy` scalar for Spain/Britain (see Open Question 6).

Rationale: minimise new GameState surface (the sibling spec added **zero** new
fields; this spec adds at most one small `graphFlags` record). A typed
`GraphFlagId` union keeps the set inspectable and prevents stringly-typed
drift. Trade-off: `warVictoryGuaranteed` is only meaningful if the war engine
reads it — if it doesn't in v1, the French-alliance branch still adjusts
diplomacy + morale meters, and the "cannot lose" guarantee is deferred
(flagged). The author must not invent finance flags beyond `loansEnabled`.

## The event roster (Independence nodes 0–48)

> Source of titles/options/effects: `independence-era-flowchart-source.md`
> node text + the 31 recovered edges + the two screenshots, **as corrected by
> the historian's brief**. Decider per the historian's decider-role mapping.
> "R" = real historical event; "CF" = counterfactual branch. Effects listed at
> summary level (meters/enthusiasm/interestGroups/diplomacy/flags/territory);
> the architect authors exact deltas. **No events outside nodes 0–48.**
> Several nodes below correspond to existing `eraEvents1772.ts` templates —
> their templateId is noted to preserve `eraEventsCompleted` continuity.

### Group A — Pre-war provocations (spine, mostly `auto`)

| # | Node / title | Decider | R/CF | Branch options (summary) | Precondition gist | Existing templateId |
|---|---|---|---|---|---|---|
| 0 | Gaspee Affair | `auto` | R | none (flavor; pro-independence sentiment ticks) | era start, year ≥ 1772 | `gaspee` |
| 1 | Committees of Correspondence | `auto` | R | none | after 0 | `committees_of_correspondence` |
| 2 | **Tea Act (1773)** | `auto` | R | none | after 1, year ≥ 1773 | `tea_act` |
| 3 | Boston Tea Party | `auto` | R | none (Sam Adams → `Celebrity`) | after 2 | `boston_tea_party` |
| — | Intolerable / Coercive Acts | `auto` | R | "Convene the First Continental Congress" → `assembleCC` | after 3 | `intolerable_acts` |
| 4 | (First) Continental Congress | `cc-president` (convening is `auto`) | R | none (convenes; sets the CC) | after Intolerable Acts | (assembleCC postEffect) |
| 5 | Declaration of Resolves | `cc-president` | R | A: state grievances + boycott / B: table | after 4, year ≥ 1774 | `declaration_of_resolves` |

### Group B — War onset & the army (spine, `cc-president` decisions, military via C-in-C)

| # | Node / title | Decider | R/CF | Branch options | Precondition gist | Existing templateId |
|---|---|---|---|---|---|---|
| 6 | Lexington and Concord | `cc-president` | R | A: Aid Massachusetts (→ **Revolutionary War**, `startRevWar`) / B: leave it to Massachusetts | after 5, year ≥ 1775 | `lexington_concord` |
| 24 | Conciliatory Resolution (1775) | `cc-president` (Parliament's offer is `auto`) | R off-ramp | A: reject (demand more) / B: **accept self-taxation deal** (→ dominion off-ramp toward node 8) | after 6, year ≥ 1775, war active | new `conciliatory_resolution` |
| 13 | Create Continental Army | `cc-president` (adopt); Washington commands | R | A: adopt the army (unlock `continentalArmy`) / B: rely on militia | war active | new `continental_army` |
| 7 | Revolutionary War (resolves over the war system) | `auto` (outcome) | R | resolves to one of: **Won with Independence (10)**, **Won, no independence (8/9)**, **Game End / lost (11)** | war active; outcome from revolutionaryWar.ts | (war system) |

### Group C — Diplomacy (read/write existing `diplomacy` scalars only; NO alliance state machine)

| # | Node / title | Decider | R/CF | Branch options | Precondition gist | Notes |
|---|---|---|---|---|---|---|
| 20→21 | Alliance with France (Amb to France exists → Alliance) | `cc-president` (ratify) | R | accept the alliance (→ node 22) | war active, year ≥ 1778, France-ambassador role on roster OR `auto` if none | existing `french_alliance` templateId |
| 22 | Cannot lose Rev. War | `auto` | CF (defensible) | none (flag) | after 21 | `graphFlags.warVictoryGuaranteed` (flagged, [CP1-6]) |
| 23 | Carlisle Peace Commission (1778) | `cc-president` (Britain's offer is `auto`) | R off-ramp | A: reject (demand independence) / B: **accept self-rule within empire** (→ dominion ending node 8) | war active, year ≥ 1778 | best-grounded counterfactual |
| 25→26 | **Spanish belligerence vs. Britain + covert aid via Louisiana** (REFRAMED from "Liberty Treaty w/ Spain" / "Spain → ally") | `auto` | reframed R | none (Spain enters war vs. Britain; goods flow up the Mississippi) | war active, year ≥ 1779 | writes `diplomacy.Spain` / `diplomacy.Britain`; **NOT** a US–Spain alliance |
| 28→29 | Dutch recognize the US → US can take out loans | `auto` (Adams's work); `cc-president` if a choice | R | none (enables loans) | war active, year ≥ 1782 | `graphFlags.loansEnabled` (only in-era finance flag) |

### Group D — War outcomes & endings

| # | Node / title | Decider | R/CF | Disposition | Precondition gist |
|---|---|---|---|---|---|
| 10 | Won with Independence | `auto` | R | spine → continues to founding government (12, 14, …) | war outcome = win + independence path |
| 12 | Declaration of Independence | `cc-president` | R | A: sign (unlock `governors`) | year ≥ 1776, war active; (Lee's Resolution gate may precede) |
| 9 | Won (no independence) | `auto` | CF | → enables Indian treaties (41) but on a dominion footing | war outcome = win, independence not proclaimed |
| 8 | Won but Independence not proclaimed → **autonomy within empire** | `auto` | CF | **campaign ending** (`triggersGameEnd: true`) | reached from 9 / Carlisle 23B / Conciliatory 24B |
| 11 | **Game End** (lost war / loyalist reabsorption) | `auto` | CF | **campaign ending** (`triggersGameEnd: true`) | war outcome = loss |
| 30 | **Parliament authorizes peace, 1782** (RENAMED from "King George III grants autonomy"; actor = Parliament, not the King) | `auto` (foreign actor) | reframed | feeds the peace/Treaty-of-Paris path | war active, year ≥ 1782, post-Yorktown war-weariness |
| 31→32 | Rev War ends — war-weariness in the Colonies (year ≥ 1780) | `auto` | CF | negotiated/collapse ending ~1780–81 | war active, year ≥ 1780 |
| 33→34 | Rev War ends — war-weariness in Great Britain (**year ≥ 1782**, corrected from 1786) | `auto` | CF | British concession → peace | war active, year ≥ 1782 |

### Group E — Founding government (spine)

| # | Node / title | Decider | R/CF | Branch options | Precondition gist | Existing templateId |
|---|---|---|---|---|---|---|
| 14 | Articles of Confederation | `cc-president` | R | A: ratify (sets `articlesOfConfederation`; Congress → Confederation Congress) | after 12, year ≥ 1777 | `articles_of_confederation` |
| 35 | Continental Congress renamed Confederation Congress | `auto` | R | none (consequence of 14) | after 14 | (handled in `articles_of_confederation` case) |
| 27 | Treaty of Paris (1783) | `auto` (fait accompli) | R | sign (adds western territories) | war won, year ≥ 1783 | `treaty_of_paris` |
| 36 | Annapolis Convention (1786) | `auto` (call); `cc-president` if Congress endorses | R | A: **Constitutional Convention follows (37)** / B: **Confederation remains (38)** | after 14, year ≥ 1786 | `annapolis_convention` |
| 37→39 | A: Constitutional Convention follows → Constitutional Convention | `auto` kickoff → dedicated screen | R | opens `pendingConvention` (interactive) | Annapolis A chosen, year ≥ 1787 | `constitutional_convention_kickoff` |
| 38 | B: Confederation remains the government | `cc-president` | CF | **terminal ending** (`triggersGameEnd: true`; distinct "Confederation persists under the Articles" end-state) **[CP1 decision]** | Annapolis B chosen |
| 40 | Federalist & Anti-Federalist Papers | `auto` | R | none (ratification-debate flavor; RED=Federalists / BLUE=Anti-Federalists **positions, not modern parties**) | after 39 |

### Group F — Vermont (territory branch)

| # | Node / title | Decider | R/CF | Branch options | Precondition gist |
|---|---|---|---|---|---|
| 15 | Republic of Vermont proclaimed (1777) | `auto` | R | none (a de-facto independent republic appears on the NH/NY grants) | year ≥ 1777 |
| 16 | Claim Vermont (decision) | `cc-president` (pre-1789) | R | A: **Claim** (16→17) / B: **Do not claim** (18) | after 15 |
| 17→19 | A: Claim → Vermont statehood | `cc-president` → `admitState('vt')` | R | leads to VT admitted as a state (tail to 1791) | Claim chosen |
| 18 | B: Do not claim | `cc-president` | R/CF | Vermont remains an independent republic | Do-not-claim chosen |

### Group G — Indian treaties (Confederation Congress; correct nations)

| # | Node / title | Decider | R/CF | Branch options | Precondition gist |
|---|---|---|---|---|---|
| 41 | Treaty of Fort Stanwix (1784) — **Six Nations / Haudenosaunee** | `cc-president` (Confederation Congress' commissioners) | R | A: "make peace … settle all of Pennsylvania" / B: "this is a manipulative treaty … respect their lands and rights" | war won, year ≥ 1784 |
| 44 | **Frontier conflict with the Six Nations** (RENAMED from "Iroquois League War"; no unified war — the Confederacy fragmented) | `auto` | reframed CF | conflict outcome of 41 | after 41 (path-dependent) |
| 45 | Treaty of Hopewell (1785–86) — **three treaties**: Cherokee, Choctaw, Chickasaw | `cc-president` | R | A: "settle boundaries … settle westward in peace" / B: **"we have no intention of keeping these boundaries … why lead them on?"** (historically accurate — keep) | year ≥ 1785 |
| 48 | **Chickamauga / Cherokee–American wars** (RENAMED from "Keowee War"; Keowee is the river, not a war) | `auto` | reframed CF | conflict outcome of 45 (esp. 45B) | after 45 (path-dependent) |

**Roster count: ~24 distinct authored events/decision-nodes** (within the
locked 22–26 window): 0–6 + Intolerable Acts (8), 12/13/24 (war onset, 3),
20/21/22/23/25-26/28-29 (diplomacy, 6), 8/9/10/11/30/31-32/33-34 war-outcomes &
endings (counted where they surface as events, ~5 distinct), 14/27/36/37-39/40
founding (5), 15/16/17-19 Vermont (3), 41/44/45/48 Indian treaties (4). Several
chart nodes are *consequences/labels* (35 rename, 19 statehood, 44/48 conflict
outcomes) folded into a parent node's effects rather than separate prompts —
keeping the authored prompt count in the locked window while covering all of
0–48.

## Acceptance criteria

### State & types
- [ ] 1. New `ERA_GRAPH_RULES` const added to `types.ts` (after the existing
  era/mortality rule blocks), exposing at minimum: `historyPressure: 0.8`
  ([CP1-4]), `maxEventsPerTurn: 1` (matches today's 2.4.3 cap), and any
  graph-walk tunables. Zero magic numbers in the walker body.
- [ ] 2. **No `decider: 'president'` or `decider: 'cabinet'` on any authored
  Independence node.** A `validate()` helper iterates the graph and asserts
  every node's `decider` ∈ `{'cc-president', 'auto'}`; throws in dev. (This is
  the historian's top anti-pattern, made assertable.)
- [ ] 3. The graph authoring data lives in `src/data/eraEvents1772.ts`
  (replacing/extending `SCRIPTED_1772`) as a typed node array; each node has a
  stable `templateId`, an optional `precondition: Predicate`, an optional
  `realEvent: boolean` (spine vs. counterfactual, drives history-pressure), and
  a `build(year): EraEvent`. The 7 existing events are carried forward as nodes
  with their **existing templateIds preserved** ([CP1-1]).
- [ ] 4. A serializable `Predicate` type ([CP1-2]) and a pure
  `evalPredicate(snap, pred): boolean` evaluator are defined and unit-testable
  in isolation (no React, no I/O). The evaluator handles every predicate kind
  listed in [CP1-2].
- [ ] 5. At most ONE new GameState surface is added for graph enables: a typed
  `graphFlags` (e.g. `{ loansEnabled?: boolean; warVictoryGuaranteed?: boolean }`)
  per [CP1-6]; no other new GameState fields. Existing unlocks
  (`governorsExist`, `articlesOfConfederation`, `constitutionRatified`,
  `continentalArmy`) are reused, not duplicated.
- [ ] 6. No new finance/economy field beyond `graphFlags.loansEnabled` is
  added (anachronism guard: the only in-era finance fact is the Dutch loan; no
  bank/Treasury/currency surface is introduced).

### Data — the event roster (nodes 0–48)
- [ ] 7. The graph contains ~22–26 authored events/decision-nodes covering all
  of nodes 0–48 (per the roster tables above) and **none beyond node 48** (the
  French Revolution node 49 and all Federalism content are absent). A
  `validate()` assertion fails if any authored node's chart index ≥ 49.
- [ ] 8. **Label corrections applied:** node 2 is titled "Tea Act" (1773); the
  node corresponding to chart-30 is titled as **Parliament authorizing peace
  (1782)** and its `decider` is `auto` (foreign actor), NOT a player decision,
  and its text does NOT attribute the act to King George personally; node 41 is
  the **Six Nations / Haudenosaunee**; node 45 is **three treaties**
  (Cherokee/Choctaw/Chickasaw); chart-44 is framed as **frontier conflict with
  the Six Nations** (not a "league war"); chart-48 is framed as the
  **Chickamauga / Cherokee–American wars** (not "Keowee War").
- [ ] 9. **Spain reframe applied:** the chart-25/26 node is authored as
  **Spanish belligerence vs. Britain + covert aid via Louisiana**, writing the
  `diplomacy` scalar for Spain/Britain only; there is **no** US–Spain alliance
  state, no "Spain → ally" meter, and no node that makes Spain a US ally.
- [ ] 10. **Counterfactual timing fixes:** the British-war-weariness node uses
  a `yearAtLeast: 1782` gate (NOT 1786); the colonial-war-weariness node uses
  `yearAtLeast: 1780`.
- [ ] 11. **Anachronism guards assertable:** a `validate()` helper asserts no
  Independence node's text or effects reference a national bank / Treasury /
  Mint / Wall Street / "the dollar" / the modern Federalist–Democratic-
  Republican *party* system; and that Vermont is not an admitted state before
  its statehood node, and Kentucky/Tennessee appear only as territories (matching
  the existing Treaty-of-Paris territory seeding).
- [ ] 12. Every node's `decider`, `realEvent` flag, branch responses, and
  `precondition` match the roster tables; counterfactual branches are flagged
  `realEvent: false`, spine nodes `realEvent: true`.

### Engine — graph walker (replaces `next1772Event`)
- [ ] 13. `next1772Event` (phaseRunners.ts:2366) is replaced by a graph walker
  that: (a) collects all nodes whose `templateId` is NOT in `eraEventsCompleted`
  AND whose `precondition` evaluates true via `evalPredicate`; (b) if any are
  eligible, selects one to surface per the history-pressure rule ([CP1-4]); (c)
  pushes the built `EraEvent` onto `game.pendingEraEvents` and returns it;
  (d) respects `maxEventsPerTurn` (one per turn, as today).
- [ ] 14. **History pressure:** when both ≥1 `realEvent: true` and ≥1
  `realEvent: false` node are eligible, the walker surfaces a real node with
  probability `ERA_GRAPH_RULES.historyPressure` (default 0.8) and a
  counterfactual otherwise, via `chance` + `pickWeighted` (no `Math.random`).
  When only one class is eligible, it surfaces from that class.
- [ ] 15. **Probabilistic firing:** eligibility (precondition true) does not
  guarantee same-turn firing; the walker uses `chance`/`pickWeighted` so an
  eligible node may wait a turn. Determinism preserved via `rng.ts` only.
- [ ] 16. The walker is pure over `snap`; no `Math.random`; no React/I/O.
- [ ] 17. The non-1772 branch of `runPhase_2_4_3_Era`
  (`buildEraEventsForYear`) is **untouched**.

### Engine — roster-gated decisions vs. AI auto-resolve
- [ ] 18. For a node with `decider: 'cc-president'`, the engine determines
  control by `game.continentalCongress?.presidentId`'s politician's
  `factionId === game.playerFactionId`. If the player controls it → the event
  surfaces to the UI for a player decision (modal). If not → the engine
  **auto-resolves** by picking a response on the decider's behalf (by the
  controlling faction's ideology, mirroring `finalizeConvention`'s CPU
  consensus), calling `resolveEraEvent` directly without a modal, and logging
  the AI choice to the feed.
- [ ] 19. For a node with `decider: 'auto'`, the engine auto-resolves (no
  modal) regardless of roster — these are foreign-actor or fait-accompli events
  (Gaspee, Tea Act, Treaty of Paris, Parliament-authorizes-peace, Spanish
  belligerence, Dutch recognition).
- [ ] 20. **Military forks route through the C-in-C, not a president.** Any node
  the roster marks as a military decision (e.g. army adoption / give-battle
  framing) gates on whether a general on the player's roster holds the relevant
  command (`currentOffice.type === 'GeneralInChief'` with `factionId ===
  playerFactionId`); if not controlled, AI auto-resolves. **No such node uses
  `decider: 'president'`.**
- [ ] 21. AI auto-resolution is deterministic (seeded RNG) and produces a valid
  `chosenResponseId`; the resulting `applyEffect` + `postEffects` + consequences
  fire identically to a player choice (same `resolveEraEvent` path).

### Engine — branching state & effects
- [ ] 22. Branch selection reads prior choices via the `eventChose` predicate
  (`{ template, response }`) against resolved nodes' `chosenResponseId` +
  `eraEventsCompleted`. A node downstream of "Carlisle: accept" (23B) becomes
  eligible only when that choice was made; the same for Vermont Claim/Do-not-claim
  and Annapolis A/B.
- [ ] 23. Effects use ONLY the existing `EraEventResponseEffect` surface
  (`meters`, `partyPreference`, `enthusiasm`, `interestGroups`,
  `domesticStability`, `startWar`, `text`) plus the diplomacy effect kind from
  AC 24. No event mutates politicians directly except via the existing
  `handleScripted1772Consequences` cases (e.g. Sam Adams `Celebrity`).
- [ ] 24. **Diplomacy scalars (read/write only):** the Spain-reframe node and
  any France/Britain diplomacy nodes write `game.diplomacy[nation]` via a small
  additive, clamped effect (extend `applyEffect` with an optional
  `diplomacy?: { nation: string; delta: number }[]` field, OR a
  `handleScripted1772Consequences` case). **No alliance/treaty state machine,
  no new diplomacy data structures.**
- [ ] 25. **Enable flags:** the Dutch-recognition → loans node sets
  `graphFlags.loansEnabled = true`; the French-alliance → "cannot lose" node
  sets `graphFlags.warVictoryGuaranteed = true` which is **narrative-only in v1
  (CP1-WAR): recorded and shown in the feed/flavor; the engine does NOT add a
  revolutionaryWar.ts hook to force the war outcome.** No other enable flags are
  introduced.

### Engine — terminal & ending behaviour
- [ ] 26. The lost-war node (chart-11) and the dominion/autonomy node
  (chart-8, reachable from Carlisle-accept / Conciliatory-accept / "Won, no
  independence") set `triggersGameEnd: true`; resolving them ends the campaign
  via the engine's existing game-end handling for that flag.
- [ ] 27. The ratification path (Constitutional Convention → Constitution) sets
  `constitutionRatified` and hands off to the existing era-advance machinery;
  the authored graph contains no Federalism nodes (the handoff target is out of
  scope).
- [ ] 28. The "Confederation remains" node (chart-38) sets `triggersGameEnd:
  true` and ends the campaign with a distinct "United States persists under the
  Articles of Confederation" end-state (CP1 user decision). Earlier-gated Vermont
  (15–19) and Indian-treaty (41–48) branches resolve before Annapolis (1786), so
  reaching 38 is terminal.
- [ ] 29. An ending firing mid-chain (e.g. lost war before the founding spine
  is reached) terminates cleanly: no orphaned pending era events, no attempt to
  fire downstream founding nodes after `triggersGameEnd`.

### Engine — system triggers (trigger, don't reimplement)
- [ ] 30. CC convening uses the existing `assembleCC` postEffect; the war start
  uses `startRevWar`; Articles uses the existing `articles_of_confederation`
  consequence; ConCon uses `makeConvention`/`pendingConvention`; Treaty-of-Paris
  territory uses the existing case; Vermont statehood calls `admitState(snap,
  'vt')`. **No CC/ConCon/RevWar/territory logic is reimplemented in the graph
  layer.**
- [ ] 31. The `continentalArmy` unlock literal is used for the army node;
  `governors` unlock remains on the Declaration node (12).

### UI — decision prompting & graph history
- [ ] 32. `EraEventModal` is shown ONLY for nodes the player controls (per AC
  18/20). Auto-resolved nodes never open the modal; their outcome appears in the
  feed (and on the new history page). The modal continues to label the decider
  (EraEventModal.tsx:30) and now reflects that the player is the decider.
- [ ] 33. A new read-only page `src/pages/EraEventsPage.tsx` (PageId
  `'eraEvents'`, registered in `src/pages/registry.ts`, sidebar entry in the
  Events group) shows: (a) an **event-chain history** of resolved 2.4.3 nodes in
  year order with the chosen branch and who decided (player vs. AI), and (b) a
  **pending-decisions feed** of any era event currently awaiting the player.
- [ ] 34. The history page distinguishes spine (real) from counterfactual nodes
  visually (e.g. a badge), and shows terminal/ending nodes distinctly.
- [ ] 35. The page is purely read-only (no GameContext mutators added beyond the
  existing `chooseEraResponse`); empty state renders before any era event fires.

### Coexistence & build
- [ ] 36. 2.4.3 still fires at most one era event per turn and still runs after
  2.4.1/2.4.2 in `PHASE_SEQUENCE`; the 2.4.2 anytime-events system (sibling
  spec) is untouched and composes (a 2.4.2 national event and a 2.4.3 spine
  event can both surface the same turn).
- [ ] 37. `npm run build` passes (typecheck + Vite bundle).
- [ ] 38. **Playtest 1772 — historical path.** Start the scenario; advance
  through the spine. Verify Gaspee → Committees → Tea Act → Boston Tea Party →
  Intolerable Acts (CC convenes) → Declaration of Resolves → Lexington (war
  starts) → … → Articles → Annapolis → Constitutional Convention fire in a
  recognizably historical order under default history-pressure. Verify
  decisions you control prompt a modal and decisions you don't control
  auto-resolve in the feed.
- [ ] 39. **Playtest 1772 — divergent path.** Replay; steer into a
  counterfactual (e.g. accept the Carlisle offer, or take the colonial
  war-weariness branch, or do-not-claim Vermont) and verify the campaign
  reaches a DIFFERENT ending than run 1 (dominion-status ending, or lost-war
  Game End, or Confederation-remains continue). Verify the Spain node reads as
  *belligerence/covert aid*, never a US–Spain alliance.
- [ ] 40. **Playtest — roster-gate.** Confirm that when your faction holds the
  CC presidency you decide `cc-president` nodes, and when it does not, the AI
  decides and the feed records the AI's choice. Confirm no node ever presents a
  `president`/`cabinet` decider.
- [ ] 41. **Load a save mid-graph.** Save partway through (e.g. after the war
  starts, before independence). Reload; verify the graph resumes from the
  correct eligible set (driven by `eraEventsCompleted` + predicates), with no
  duplicate firing of completed nodes and no skipped spine node.

## Edge cases

- **Player doesn't control the decider.** Per AC 18: the AI auto-resolves by
  the controlling faction's ideology (the `finalizeConvention` CPU-consensus
  precedent). The player is never blocked waiting on a decision they can't make;
  the outcome is logged.
- **Precondition for a spine event is never met (stuck spine).** If a required
  predicate (e.g. `warActive` for a wartime node) can never become true because
  an earlier branch diverged, the node simply never fires — that's correct for a
  branch that left the spine. **Force-fire fallback:** for the *core spine* the
  historian marks as inevitable (Gaspee → Tea Act → Boston Tea Party), the
  walker should not stall; if no node is eligible for several turns and the
  campaign is still on the spine, the next eligible spine node fires regardless
  of the probabilistic roll (a `forceSpine` safety valve in the walker). Flagged
  as tunable.
- **Multiple events eligible the same turn.** The walker surfaces exactly one
  (history-pressure picks the class, `pickWeighted` picks within it); the rest
  remain eligible next turn. Matches today's one-per-turn cap.
- **An ending fires mid-chain.** Per AC 29: `triggersGameEnd` short-circuits the
  walker; no downstream nodes fire; pending era events are not left dangling.
- **Both a player-controlled decision and an auto event are eligible.** The
  walker surfaces one node; if it's the player-controlled decision, a modal
  opens and the auto event waits; if it's the auto event, it resolves and the
  decision surfaces next turn. No two modals stack.
- **Loading a save mid-graph.** Graph state is fully reconstructable from
  `eraEventsCompleted` + resolved nodes' `chosenResponseId` + GameState flags;
  no separate graph-cursor needs persisting (the walker recomputes the eligible
  set each turn). Confirms AC 41.
- **CC president changes between a node becoming eligible and resolving.**
  Control is evaluated at the moment the node surfaces (AC 18); if the
  presidency flips mid-turn it does not retroactively re-gate an already-surfaced
  modal.
- **Vermont `admitState('vt')` when 'vt' already exists.** `admitState` returns
  false if the state already exists (territories.ts:9) — idempotent; no double
  admission.
- **War system resolves to an outcome the graph has no node for.** The
  war-outcome mapping (win+independence / win-no-independence / loss) is total;
  if revolutionaryWar.ts can produce a draw/ongoing state, the graph waits
  (no premature outcome node). Flagged for the architect to confirm the war
  system's terminal states.
- **Diplomacy scalar missing for a nation.** Writes use `(game.diplomacy[n] ??
  0) + delta`, clamped — matches the engine's `?? 0` convention for
  interestGroups.

## Out of scope

- **Any era other than Independence.** Nodes 49+ (French Revolution and the
  entire Federalism economic arc — Buttonwood, Compromise of 1790, national
  bank, Whiskey/Excise tax, Louisiana, War of 1812, Napoleon) are the next
  era's build. The framework is built to extend, but no later-era content is
  authored.
- **A diplomacy system.** No treaty/alliance state machine, no diplomacy UI, no
  per-nation relationship tracks beyond the existing `game.diplomacy` scalar
  map. Events read/write that scalar only.
- **2.4.2 (anytime events) changes.** The sibling system is untouched.
- **Engine rewrites of CC / ConCon / RevWar / territories.** The graph triggers
  these via existing entry points; it does not change their internals.
- **Reworking the war engine's battle resolution.** The graph consumes the war
  *outcome*; how battles are fought (revolutionaryWar.ts) is unchanged.
- **Multi-step negotiation mini-games** for the peace offers (Carlisle,
  Conciliatory) — they are single decision nodes, not interactive negotiations.
- **Authoring a dominion-status Federalism continuation.** The "autonomy within
  empire" outcome (node 8) is a campaign ending in v1, not a new playable era.
- **Persisting a separate graph cursor.** The eligible set is recomputed from
  existing state each turn.

## Open questions / assumptions

> Each maps to a `[CP1-n]` decision above; the user can override at Checkpoint
> 1. Riskiest first.

1. **[CP1-3] Ending dispositions — which branches end the campaign vs.
   continue (RISKIEST).** PM recommends: lost-war (11) and dominion-status
   (8/23/24) are hard campaign-endings (`triggersGameEnd`); ratification (39)
   advances to Federalism (handoff only, content out of scope);
   "Confederation remains" (38) is a *soft non-ending* that keeps the game
   running under the Articles. The fuzziest call is 38 — does the user want it
   to be a true ending, or a genuinely-continuing game state with reduced
   content? And should dominion-status (8) eventually become a playable
   Federalism variant rather than a hard end? Flagged for adjudication.
2. **[CP1-4] History-pressure ratio = 0.8 (4:1 real:counterfactual).** Is 80%
   the right tilt? Too high → on-rails; too low → ahistorical. Tunable in one
   constant; needs playtest. PM picked 0.8 as the starting point.
3. **[CP1-6] `warVictoryGuaranteed` flag is only meaningful if
   revolutionaryWar.ts reads it.** If the war engine has no hook to force a win,
   the French-alliance "cannot lose" branch is narrative-only in v1 (it still
   shifts diplomacy + morale meters). Does the user want the architect to add a
   war-engine hook so the guarantee bites mechanically, or accept the v1
   narrative-only treatment? Flagged.
4. **[CP1-1] Migration — keep the 7 existing templateIds.** PM recommends
   carrying them forward as spine nodes (preserving `eraEventsCompleted`
   continuity and the `handleScripted1772Consequences` cases) rather than a
   clean rewrite. Confirm this is acceptable vs. a from-scratch graph.
5. **[CP1-2] Precondition representation — serializable predicate tree.** PM
   recommends data-driven AND/OR predicates over inline TS functions
   (inspectable, testable, future-proof for later eras). Confirm the team is
   fine authoring preconditions as data; exotic future conditions will need new
   predicate kinds.
6. **[CP1-5 / diplomacy effect] Extending `applyEffect` with a `diplomacy`
   field vs. a per-node consequence case.** The Spain/France/Britain nodes need
   to write `game.diplomacy`. PM recommends a small `diplomacy?: {nation,
   delta}[]` addition to `EraEventResponseEffect` + `applyEffect` (clean, reusable
   for later eras) rather than ad-hoc cases. Confirm the small effect-surface
   extension is acceptable (it is the one change to the shared effect type).
7. **Force-spine safety valve.** PM assumes the walker needs a `forceSpine`
   fallback so the inevitable opening provocations (Gaspee → Tea Act → Boston
   Tea Party) never stall behind the probabilistic roll. Confirm the spine
   should be guaranteed-progressing vs. allowed to dawdle for flavor.
8. **War-outcome terminal states.** PM assumes revolutionaryWar.ts produces a
   total {win+independence, win-no-independence, loss} outcome the graph can map
   to nodes 8/9/10/11. If the war can persist indefinitely or draw, the
   architect must define how the graph waits for / forces an outcome. Flagged.
9. **AI auto-resolve heuristic.** PM assumes the `finalizeConvention`
   ideology-based CPU-consensus precedent is the right model for picking a
   response on the decider's behalf. Confirm the AI should choose by the
   controlling faction's ideology (e.g. a Loyalist-leaning CC president accepts
   Carlisle; a Patriot-leaning one rejects it) rather than always picking the
   historical option.
10. **Roster-gate for the France/Dutch diplomatic nodes.** The historian maps
    these to Congress-appointed commissioners (Franklin/Adams), not an
    executive. PM assumes they are `auto` (or `cc-president` if a choice is
    offered) and NOT gated on a specific named diplomat being on the roster, to
    avoid soft-locking the branch when the player lacks that figure. Confirm.
11. **Page scope.** PM assumes a minimal read-only `EraEventsPage`
    (chain-history + pending-decisions feed), matching the sibling spec's
    minimal-page stance; a graph visualization / branch-map view is out of v1.
12. **`graphFlags` shape.** PM assumes a single optional `graphFlags` record on
    GameState (mirroring the sibling spec's zero-to-minimal new-field
    discipline). If the user prefers reusing only existing booleans + the
    `diplomacy` map (no new field at all), `loansEnabled` could instead be a
    diplomacy/economy scalar — flagged as a minor alternative.

---

Spec path: `/home/user/AMPU/docs/specs/independence-era-events.md`
