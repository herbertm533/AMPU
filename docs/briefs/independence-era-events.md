# Brief: Independence-Era Event Graph (Phase 2.4.3, 1772)

> Spec: `docs/specs/independence-era-events.md` (CP1 APPROVED). Historian:
> `docs/research/independence-era-events-historical-context.md`. Flowchart:
> `docs/research/independence-era-flowchart-source.md` (nodes 0–48).
> This brief is the implementation contract. Build strictly from the "Files to
> touch" list and the data plan. The builder makes no architectural decisions.

## Approach

Convert phase 2.4.3's 1772 branch from a linear `SCRIPTED_1772` walk into a
**branching decision graph** authored as data, walked by a new pure evaluator
module. The single biggest decision is **graph-as-a-new-node-type vs. extending
`ScriptedEvent`**: we **extend `ScriptedEvent` in place** (rename it `GraphNode`,
add `precondition?: Predicate`, `realEvent?: boolean`, `leadsTo?` for
documentation) rather than introduce a parallel `EraGraphNode[]`. Justification:
(1) CP1-1 binds us to carry the 7 existing events forward *preserving their
templateIds* and their `handleScripted1772Consequences` cases — the existing
`build(year): EraEvent` shape already produces the runtime `EraEvent`, so reusing
it means zero churn on the resolution path; (2) a second node type would
duplicate `templateId` + `build` and force a second walker; (3) the rejected
alternative (a fresh `EraGraphNode` with embedded edges) buys nothing — branch
selection is already driven by `eraEventsCompleted` + `chosenResponseId` via
predicates, so explicit edge objects would be redundant state to keep in sync.
Preconditions are a **serializable predicate tree** (`Predicate` union +
`evalPredicate`) per CP1-2 — inspectable, unit-testable, future-proof. The walker
applies **history-pressure 0.8** (CP1-4) and a force-spine safety valve. Roster-
gating + AI auto-resolve mirror `finalizeConvention`/`preferredOption` (CP1-AI),
but live in the engine so non-controlled nodes resolve silently. All system
triggers reuse the existing `postEffects`/`handleScripted1772Consequences`
dispatch (CP1-5); the graph never reimplements CC/ConCon/RevWar/territory.

**Load-bearing discovery (read this first).** `EraEvent.triggersGameEnd` is
declared (`src/types.ts:686`) but has **zero consumers anywhere in the codebase**
— there is no game-over handler, screen, or `advancePhase` short-circuit. The
spec (AC 26/28/29) assumes "the engine's existing game-end handling consumes
it"; **it does not exist**. The builder must implement game-end consumption as
part of this feature (engine flag + minimal UI gate). This is the top risk; see
Risks #1.

## State & type changes (`src/types.ts`)

All additions go in `src/types.ts`. Exact diffs:

1. **`Predicate` union** (new export, place near `EraEvent` ~line 689). Enumerate
   exactly these kinds (verified to cover every node 0–48):
   ```ts
   export type Predicate =
     | { all: Predicate[] }
     | { any: Predicate[] }
     | { not: Predicate }
     | { yearAtLeast: number }
     | { yearAtMost: number }
     | { eventCompleted: string }                              // templateId in eraEventsCompleted
     | { eventChose: { template: string; response: string } }  // resolved node's chosenResponseId
     | { meterAtLeast: { meter: MeterKey; value: number } }
     | { meterAtMost: { meter: MeterKey; value: number } }
     | { interestAtLeast: { group: string; value: number } }
     | { diplomacyAtLeast: { nation: string; value: number } }
     | { warActive: boolean }                                  // game.revolutionaryWar?.active === flag
     | { warOutcome: 'win' | 'loss' }                          // game.revolutionaryWar?.outcome
     | { stateAdmitted: string }                               // snap.states has id
     | { officeControlledByPlayer: 'cc-president' | 'general-in-chief' }
     | { rosterHasSkill: { skill: SkillKey; min: number } }    // any player-faction politician
     | { flag: GraphFlagId };                                  // graph-set boolean
   ```
   `MeterKey` and `SkillKey` already exist (`types.ts:620`, `:24`). Add
   `warOutcome` and the `'general-in-chief'` option to `officeControlledByPlayer`
   beyond the spec's CP1-2 list — both are needed (war-outcome ending gates;
   military fork gating per AC 20). These are additive, no spec conflict.

2. **`GraphFlagId` + `graphFlags` on `GameState`** (CP1-6). Add the union near
   `Era` (~line 549) and the field to `GameState` (~line 799, after
   `inauguralDraftSeeded`):
   ```ts
   export type GraphFlagId = 'loansEnabled' | 'warVictoryGuaranteed';
   // in GameState:
   graphFlags?: Partial<Record<GraphFlagId, boolean>>;
   ```
   Optional + `Partial` so existing saves load with `undefined` (treated as all-
   false). **No other new GameState fields** (AC 5/6). Do NOT add a finance field
   beyond `loansEnabled`.

3. **`gameEnded` on `GameState`** (NEW — required because `triggersGameEnd` has no
   consumer). Add after `graphFlags`:
   ```ts
   gameEnded?: { year: number; reason: string; templateId: string };
   ```
   Set by `resolveEraEvent` when a resolved event has `triggersGameEnd`. Optional
   so saves load. This is the engine half of game-end; the UI half is a gate in
   `App.tsx`/dashboard (see UI changes).

4. **`diplomacy` effect field** (CP1-5/OQ6). Extend `EraEventResponseEffect`
   (`types.ts:659`):
   ```ts
   diplomacy?: { nation: string; delta: number }[];
   ```
   One additive optional field on the shared effect type. The Spain-reframe and
   any France/Britain nodes write it; `applyEffect` extends to consume it.

5. **`ScriptedEvent` → graph node shape.** `ScriptedEvent` lives in
   `src/data/eraEvents1772.ts` (not types.ts), handled under Engine/Data below.

6. **`ERA_GRAPH_RULES` const** (AC 1). Add after `ANYTIME_EVENTS_RULES`
   (`types.ts:433`):
   ```ts
   export const ERA_GRAPH_RULES = {
     historyPressure: 0.8,      // P(spine fires) when both classes eligible (CP1-4)
     maxEventsPerTurn: 1,       // matches today's 2.4.3 cap
     forceSpineAfterIdleTurns: 2, // safety valve: bypass the roll for the next eligible spine node
     fireChance: 0.85,          // base P an eligible node fires this turn (probabilistic firing, AC 15)
   } as const;
   ```
   Zero magic numbers in the walker body — all tunables here.

### Save / migration impact

- **Existing IndexedDB 1772 saves still load.** All new GameState fields
  (`graphFlags`, `gameEnded`) are optional; `EraEventResponseEffect.diplomacy`
  and the new node fields are optional. A save taken on the *current* linear
  chain has `eraEventsCompleted` populated with the same templateIds the graph
  reuses, so the walker recomputes the eligible set correctly on load (no cursor
  to migrate — confirmed by spec Edge "Loading a save mid-graph").
- **No `repair()` change required** — the walker derives all branch state from
  `eraEventsCompleted` + resolved-node `chosenResponseId` + GameState flags, which
  already persist. Do **not** add a migration that mutates saved events.
- Saves mid-`SCRIPTED_1772` (e.g. after `tea_act`, before `lexington_concord`):
  because templateIds are preserved, completed nodes stay completed and the next
  eligible graph node fires. Verify in AC 41 playtest.

## Engine changes (pure logic)

### New module: `src/engine/eraGraph.ts`

Houses the pure predicate evaluator + walker + AI auto-resolve. No React, no I/O.
Imports `chance`, `pickWeighted` from `../rng` (NOT `Math.random` — see
Determinism). Functions:

- `export function evalPredicate(snap: FullGameSnapshot, pred: Predicate): boolean`
  — recursive interpreter over the union. Mapping (exact):
  - `all`/`any`/`not` → boolean combinators.
  - `yearAtLeast`/`yearAtMost` → `snap.game.year`.
  - `eventCompleted` → `snap.game.eraEventsCompleted.includes(t)`.
  - `eventChose` → find the resolved event in `snap.game.pendingEraEvents` with
    `templateId === template` and `chosenResponseId === response`. **NOTE:**
    `pendingEraEvents` is cleared to `[]` by `chooseEraResponse` after the chain
    drains (GameContext:324). To survive that, `eventChose` must read from a
    durable record. Use `snap.game.eraEventsCompleted` for *whether* it fired and
    add the chosen response to the completed key: when pushing to
    `eraEventsCompleted`, push `templateId` AND store choice as
    `${templateId}:${responseId}` is over-engineering — instead, **keep resolved
    nodes in `pendingEraEvents`** (do not clear them mid-graph). See "Persistence"
    below for the exact rule. `evalPredicate` reads `pendingEraEvents` for
    `chosenResponseId`.
  - `meterAtLeast`/`meterAtMost` → `snap.game.meters[meter]`.
  - `interestAtLeast` → `snap.game.interestGroups[group] ?? 0`.
  - `diplomacyAtLeast` → `snap.game.diplomacy[nation] ?? 0`.
  - `warActive` → `(snap.game.revolutionaryWar?.active ?? false) === flag`.
  - `warOutcome` → `snap.game.revolutionaryWar?.outcome === value`.
  - `stateAdmitted` → `snap.states.some(s => s.id === id)`.
  - `officeControlledByPlayer` → see `playerControlsDecider` below.
  - `rosterHasSkill` → any `snap.politicians` with `factionId ===
    playerFactionId && !deathYear && !retiredYear && skills[skill] >= min`.
  - `flag` → `snap.game.graphFlags?.[id] === true`.

- `export function playerControlsDecider(snap, decider: EraEvent['decider'], military = false): boolean`
  — for `'cc-president'`: the politician `snap.game.continentalCongress?.presidentId`
  has `factionId === snap.game.playerFactionId`. For military forks
  (`officeControlledByPlayer: 'general-in-chief'` or a node flagged military):
  any politician with `currentOffice?.type === 'GeneralInChief'` and
  `factionId === playerFactionId`. `'auto'` → always false (never player-
  controlled). `'president'`/`'cabinet'` → unreachable (validate() forbids).

- `export function pickAIResponse(snap, event: EraEvent): string`
  — mirrors `preferredOption` (constitutionalConvention.ts:101). Resolve the
  controlling faction (the CC president's `factionId`, else `'auto'` events use
  the historical/first response). Pick by the faction's `personality`/ideology:
  e.g. a Loyalist-leaning (`RW`/Traditionalist) CC president accepts Carlisle
  (the "settle" response), a Patriot-leaning (`LW`/`Center`) one rejects it. Each
  authored decision node documents which response maps to LW vs RW in a comment.
  Default = the spine/historical response (`id: 'a'`) when ambiguous. Must return
  a valid `responseId` on `event.responses`. Deterministic via `chance` only.

- `export function selectEraGraphNode(snap): EraEvent | null`
  — the walker replacing `next1772Event`. Algorithm (AC 13–15):
  1. One-per-turn cap: if an unresolved event is already in `pendingEraEvents`,
     return it (matches `next1772Event` line 2371).
  2. Build `eligible = ERA_GRAPH_1772.filter(n => !completed.has(n.templateId) &&
     evalPredicate(snap, n.precondition ?? { all: [] }))`. (`{ all: [] }` ≡ true.)
  3. If empty → return null.
  4. Split into `spine = eligible.filter(n => n.realEvent !== false)` and
     `cf = eligible.filter(n => n.realEvent === false)`.
  5. **History pressure:** if both non-empty, pick class = spine with
     `chance(ERA_GRAPH_RULES.historyPressure)` else cf. If one empty, use the
     other.
  6. Within the chosen class, `pickWeighted` uniformly (weight 1 each) — or
     author an optional per-node `weight` later; v1 uniform.
  7. **Probabilistic firing + force-spine valve:** roll `chance(fireChance)`. If
     it fails AND we are NOT past `forceSpineAfterIdleTurns` of spine idling,
     return null (node waits). If the spine has idled too long (track via a
     transient counter — see note), bypass the roll and fire the next spine node.
     *Idle tracking:* compute "is the campaign still on the core spine" by
     checking the lowest-index uncompleted spine node; if a core spine node
     (Gaspee→Tea Act→Boston Tea Party, marked `coreSpine: true`) is eligible,
     always fire it regardless of the roll (simplest correct valve — no persisted
     counter needed). This satisfies the spec's force-spine intent without new
     state.
  8. Push the built `EraEvent` to `pendingEraEvents`, return it.

- `export function validate(): void` (AC 2/7/11) — dev guard, called once at
  module load (guarded by `import.meta.env.DEV`). Asserts, throwing on failure:
  - every node `decider ∈ {'cc-president','auto'}` (no `president`/`cabinet`).
  - no node's `chartIndex >= 49`.
  - no node `title`/response text matches the anachronism denylist regex
    (`/\b(national bank|treasury|the mint|wall street|the dollar|democratic-republican)\b/i`).
  - Vermont: no node admits 'vt' before the `vermont_statehood` node's
    precondition can be true (assert the statehood node gates on `eventChose`
    claim).

### `src/engine/phaseRunners.ts` (modify, ~6 edit sites)

- **Imports (line 1–15):** add `selectEraGraphNode`, `pickAIResponse`,
  `playerControlsDecider`, `validate` from `./eraGraph`; add `admitState` from
  `./territories`; add `ERA_GRAPH_RULES` to the `../types` import.
- **`runPhase_2_4_3_Era` (2354):** in the `scenarioId === '1772'` branch, replace
  `return next1772Event(snap)` with a roster-gate loop:
  ```
  let event = selectEraGraphNode(snap);
  while (event && (event.decider === 'auto' ||
         !playerControlsDecider(snap, event.decider, isMilitaryNode(event)))) {
    const respId = pickAIResponse(snap, event);
    resolveEraEvent(snap, event.id, respId);
    if (snap.game.gameEnded) return null;        // ending short-circuits (AC 29)
    event = selectEraGraphNode(snap);            // surface the next node this turn? NO:
  }
  return event ?? null;
  ```
  **Cap caveat:** auto-resolving multiple nodes in one phase call would violate
  the one-per-turn *player-facing* cap but is acceptable for `auto` events (they
  don't stack modals). However, to keep behavior close to today and avoid a
  burst, **resolve at most the auto chain until a player-controlled node or null**
  — the loop above does exactly that: auto/AI nodes resolve in sequence, and the
  first player-controlled node is returned for the modal. Confirm this matches
  spec Edge "Both a player-controlled decision and an auto event are eligible"
  (it does: auto resolves, decision surfaces). If a burst feels wrong in
  playtest, gate the loop to one auto-resolve per call (tunable).
- **Delete `next1772Event` (2366–2381).** Its logic is fully replaced.
- **`resolveEraEvent` (2383):** after the `unlocks` block (~2409), add game-end
  consumption:
  ```
  if (event.triggersGameEnd && !snap.game.gameEnded) {
    snap.game.gameEnded = { year: snap.game.year, reason: event.title, templateId: event.templateId ?? event.id };
    addLog(snap, '2.4.3', 'system', `The campaign ends: ${event.title}.`);
  }
  ```
  Keep the rest intact (applyEffect → resolved → eraEventsCompleted →
  handleScripted1772Consequences → applyPostEffects → unlocks). **Do NOT clear
  `pendingEraEvents` of resolved nodes here** — `eventChose` predicates read
  them (see Persistence). The clear in GameContext:324 must change (UI section).
- **`handleScripted1772Consequences` (2434):** add new cases (keep all existing):
  - `vermont_statehood`: `admitState(snap, 'vt')`. Requires 'vt' in
    `expansionStates.ts` (see data file list). Idempotent (territories.ts:9).
  - `annapolis_convention`: today it's an `auto` flavor event. The graph splits
    it into a decision node (A: convention follows / B: confederation remains).
    Author the A/B as response effects; the **A** path's downstream
    `constitutional_convention_kickoff` node gates on `eventChose:{annapolis, a}`,
    the **B** path is the terminal `confederation_remains` node
    (`triggersGameEnd`). No new consequence case needed for Annapolis itself.
  - Spain/Dutch/Carlisle/Conciliatory: no consequence cases — they are pure
    `applyEffect` (diplomacy/meters) + flag sets. Set `graphFlags` inline in
    small cases ONLY if a flag must be set: add `dutch_recognition` case →
    `snap.game.graphFlags = { ...snap.game.graphFlags, loansEnabled: true }`; add
    `french_alliance` case already exists → extend it to also set
    `warVictoryGuaranteed: true` (narrative-only, CP1-WAR — do NOT touch
    revolutionaryWar.ts loss logic).
- **`applyEffect` (2518):** extend the typed param and body to consume
  `diplomacy` (AC 24):
  ```
  if (effect.diplomacy) {
    for (const dpl of effect.diplomacy)
      snap.game.diplomacy[dpl.nation] = clamp((snap.game.diplomacy[dpl.nation] ?? 0) + dpl.delta, -5, 5);
  }
  ```
  Add `diplomacy?: {nation;delta}[]` to the inline param type. (Diplomacy scale
  matches `applyFrenchAlliance` which sets `France = 4` and `Britain = -3`, so
  clamp ±5 is correct.) **Also add `domesticStability` handling** while here —
  the current `applyEffect` ignores it though the type declares it; map
  `effect.domesticStability` → `meters.domestic` clamp. Minor correctness fix;
  events should prefer `meters.domestic` regardless.

### `src/data/eraEvents1772.ts` (rewrite the array; keep the file)

- Rename `ScriptedEvent` → `GraphNode`; add fields:
  ```ts
  export interface GraphNode {
    templateId: string;
    chartIndex: number;          // 0–48; validate() asserts < 49
    realEvent?: boolean;         // default true (spine); false = counterfactual
    coreSpine?: boolean;         // Gaspee/Committees/TeaAct/BostonTeaParty force-fire
    precondition?: Predicate;    // replaces gateYear/requiresTemplate
    leadsTo?: string[];          // documentation only (downstream templateIds)
    build: (year: number) => EraEvent;
  }
  export const ERA_GRAPH_1772: GraphNode[] = [ ... ];
  ```
  Drop `gateYear`/`requiresTemplate` — fold into `precondition` (a `gateYear:
  1775` becomes `{ all: [{ eventCompleted: prev }, { yearAtLeast: 1775 }] }`).
- Keep the `auto(...)` helper; add an optional `decider`/`triggersGameEnd` param
  or build decision nodes inline as today.
- **Preserve these existing templateIds verbatim** (CP1-1): `gaspee`,
  `committees_of_correspondence`, `tea_act`, `boston_tea_party`,
  `intolerable_acts`, `declaration_of_resolves`, `lexington_concord`,
  `lees_resolution`, `declaration_of_independence`, `articles_of_confederation`,
  `french_alliance`, `treaty_of_paris`, `annapolis_convention`,
  `constitutional_convention_kickoff`. (Also reusable flavor:
  `common_sense`, foreign-trainers, `lafayette`, `proclamation_of_rebellion`,
  `shays_rebellion`, `dunmores_proclamation` — keep as spine flavor nodes so
  their consequence cases survive.)
- Export `ERA_GRAPH_1772` (replacing `SCRIPTED_1772`). Update the import in
  `phaseRunners.ts:9`.

## UI changes

### `src/components/EraEventModal.tsx` (minor)

- The roster-gate now lives in the **engine** (only player-controlled nodes are
  returned to the UI), so the modal is *only ever shown for controlled nodes*
  (AC 32). No gate logic in the component. Optional: change the "Decided by"
  label (line 30) to read "You decide (as President of Congress)" when
  `decider === 'cc-president'`, since by construction the player controls it. Add
  a `diplomacy` effect badge alongside the existing meter/party/enthusiasm badges
  (mirror lines 48–70) so diplomacy deltas render.

### `src/state/GameContext.tsx` (`chooseEraResponse`, line 288)

- **Do NOT clear resolved nodes** that downstream `eventChose` predicates depend
  on. Today line 324 sets `pendingEraEvents = []` before `advancePhase`. Change
  to clear only *resolved* entries is still wrong (eventChose needs them).
  **Rule:** keep resolved era events in `pendingEraEvents` for the life of the
  era; only the "no more unresolved + advance" branch runs `advancePhase` without
  wiping history. Replace `draft.game.pendingEraEvents = []` with **removing only
  unresolved leftovers** — there are none at that point — i.e. just delete the
  reset line. This keeps `chosenResponseId` durable for predicates and the
  history page. (Memory is bounded: ≤24 nodes.)
- After `resolveEraEvent`, if `draft.game.gameEnded` is set, surface the
  game-over state: `setModal({ type: 'none' })`, persist, and let the dashboard
  render the end screen (do not advance the phase). Add a short branch:
  `if (draft.game.gameEnded) { setSnapshot(draft); await persist(draft); return; }`.

### Game-over gate (NEW — minimal)

- In `src/App.tsx` (or the top-level page shell that renders `Pages[pageId]`),
  add: `if (snapshot?.game.gameEnded) return <GameOverScreen ... />`. Create
  `src/components/GameOverScreen.tsx` (~40 LoC): reads
  `snapshot.game.gameEnded.{year,reason}`, shows the ending text and a "New Game"
  / "Back to Settings" action (reuse existing new-game/reset path from Settings).
  This is the consumer the spec assumed existed. Keep it minimal.

### `src/pages/EraEventsPage.tsx` (NEW, read-only, AC 33–35)

- New `PageId 'eraEvents'`. Register in `registry.ts` (import + `PageId` union +
  `Pages` map). Add a Sidebar entry in the **Events** group (`Sidebar.tsx:76–82`,
  alongside `anytimeEvents`), label "Era Events". Model the file on
  `AnytimeEventsPage.tsx`.
- Renders two sections:
  1. **Event-chain history:** resolved nodes from `snapshot.game.pendingEraEvents`
     (now durable) in year order, each showing title, year, the chosen response
     label, a **spine/counterfactual badge** (look up `ERA_GRAPH_1772` by
     `templateId` for `realEvent`), a terminal/ending badge if `triggersGameEnd`,
     and **who decided** (player vs AI — see note). Cross-reference the feed
     (`snapshot.events` filtered to phase `'2.4.3'`) for the decision text.
  2. **Pending decisions feed:** any unresolved event in `pendingEraEvents`
     awaiting the player (normally ≤1).
- **"Who decided" source:** `pickAIResponse` should `addLog` with a `meta:
  { aiResolved: true }` marker; the page reads that to badge AI vs player. Add
  this meta to the AI-resolution log line in `eraGraph.ts`.
- Purely read-only: no new GameContext mutators (AC 35). Empty state before any
  era event fires.

## Files to touch (exact, ordered)

1. `src/types.ts` — add `Predicate`, `GraphFlagId`, `graphFlags`, `gameEnded`,
   `EraEventResponseEffect.diplomacy`, `ERA_GRAPH_RULES`. (~45 LoC)
2. `src/engine/eraGraph.ts` — **NEW**: `evalPredicate`, `playerControlsDecider`,
   `pickAIResponse`, `selectEraGraphNode`, `validate`. (~180 LoC)
3. `src/data/eraEvents1772.ts` — rewrite as `GraphNode[] ERA_GRAPH_1772`; the
   ~24-node roster + preserved templateIds + predicates. (~520 LoC; was ~300)
4. `src/data/expansionStates.ts` — add `{ id: 'vt', name: 'Vermont', abbr: 'VT',
   region: 'Northeast' }` to `DEFS` so `admitState(snap,'vt')` works. (~1 LoC)
5. `src/engine/phaseRunners.ts` — imports; rewrite `runPhase_2_4_3_Era` 1772
   branch (walker + roster-gate loop); delete `next1772Event`; game-end in
   `resolveEraEvent`; new `handleScripted1772Consequences` cases
   (`vermont_statehood`, `dutch_recognition`; extend `french_alliance`);
   `applyEffect` diplomacy + domesticStability. (~90 LoC net)
6. `src/state/GameContext.tsx` — stop wiping `pendingEraEvents`; game-ended
   branch in `chooseEraResponse`. (~10 LoC)
7. `src/components/EraEventModal.tsx` — diplomacy badge; optional label. (~12 LoC)
8. `src/components/GameOverScreen.tsx` — **NEW**: minimal end screen. (~40 LoC)
9. `src/App.tsx` (or top page shell) — render `GameOverScreen` when
   `game.gameEnded`. (~5 LoC)
10. `src/pages/EraEventsPage.tsx` — **NEW**: chain history + pending feed. (~180 LoC)
11. `src/pages/registry.ts` — import + `PageId 'eraEvents'` + `Pages` entry. (~3 LoC)
12. `src/components/Sidebar.tsx` — Events-group "Era Events" entry. (~1 LoC)

**Total new/changed ≈ 1085 LoC** (5 files created: eraGraph.ts, GameOverScreen,
EraEventsPage + 7 modified). The contract is this list — do not add files or
abstractions beyond it.

## The ~24-node data plan (`ERA_GRAPH_1772`)

> `R` = realEvent true (spine); `CF` = realEvent false. `decider ∈ {auto,
> cc-president}` only. `pre` = precondition sketch (predicate tree). Effects at
> summary level — author exact deltas in the ±5 meter / ±5 partyPref / ±10
> interest / ±5 diplomacy bands. **chartIndex** must be < 49.

### Group A — Pre-war provocations (spine, auto)
| tid | chartIdx | dec | R/CF | pre | effects/consequence | leadsTo |
|---|---|---|---|---|---|---|
| `gaspee` (coreSpine) | 0 | auto | R | `yearAtLeast:1772` | pro-indep sentiment; partyPref + | committees |
| `committees_of_correspondence` (core) | 1 | auto | R | `eventCompleted:gaspee` | momentum | tea_act |
| `tea_act` (core) | 2 | auto | R | `{all:[committees,yearAtLeast:1773]}` | moderates − | boston_tea_party |
| `boston_tea_party` (core) | 3 | auto | R | `eventCompleted:tea_act` | **Sam Adams Celebrity** (existing case) | intolerable_acts |
| `intolerable_acts` | (—) | auto | R | `eventCompleted:boston_tea_party` | `postEffects:[assembleCC]` (existing) | declaration_of_resolves |
| `declaration_of_resolves` | 5 | cc-president | R | `{all:[intolerable_acts,yearAtLeast:1774]}` | A grievances/boycott; B table | lexington_concord |

### Group B — War onset & army (cc-president; military via C-in-C)
| tid | idx | dec | R/CF | pre | effects | leadsTo |
|---|---|---|---|---|---|---|
| `lexington_concord` | 6 | cc-president | R | `{all:[declaration_of_resolves,yearAtLeast:1775]}` | A → **startRevWar** (existing case); B delay | conciliatory_resolution, continental_army, lees_resolution |
| `conciliatory_resolution` | 24 | cc-president | R off-ramp | `{all:[lexington_concord,yearAtLeast:1775,warActive:true]}` | A reject; **B accept** → dominion path | dominion_autonomy (8) |
| `continental_army` | 13 | cc-president (military) | R | `{all:[lexington_concord,warActive:true]}` | A adopt (`unlocks:[continentalArmy]`); B militia | — |
| (war outcome is read, not a prompt — see Group D) | 7 | — | R | — | — | — |

### Group C — Diplomacy (read/write game.diplomacy only)
| tid | idx | dec | R/CF | pre | effects | leadsTo |
|---|---|---|---|---|---|---|
| `french_alliance` | 20→21 | cc-president (ratify) | R | `{all:[lafayette OR warActive,yearAtLeast:1778]}` | **applyFrenchAlliance** (existing) + set `graphFlags.warVictoryGuaranteed` (narrative) | — |
| `carlisle_commission` | 23 | cc-president | R off-ramp | `{all:[warActive:true,yearAtLeast:1778]}` | A reject (indep); **B accept** → dominion | dominion_autonomy (8) |
| `spanish_belligerence` | 25→26 | auto | reframed R | `{all:[warActive:true,yearAtLeast:1779]}` | `diplomacy:[{Spain,+},{Britain,−}]`; **NO** US–Spain ally | — |
| `dutch_recognition` | 28→29 | auto | R | `{all:[warActive:true,yearAtLeast:1782]}` | set `graphFlags.loansEnabled` (only finance flag) | — |

### Group D — War outcomes & endings
| tid | idx | dec | R/CF | pre | disposition |
|---|---|---|---|---|---|
| `parliament_authorizes_peace` | 30 | auto | reframed R | `{all:[warActive:true,yearAtLeast:1782]}` — **NOT King George; NOT 1786** | feeds peace path |
| `colonial_war_weariness` | 31→32 | auto | CF | `{all:[warActive:true,yearAtLeast:1780]}` | negotiated/collapse → can route to lost-war or dominion |
| `british_war_weariness` | 33→34 | auto | CF | `{all:[warActive:true,yearAtLeast:1782]}` — **1782 not 1786** | British concession → peace/Treaty |
| `lost_war` | 11 | auto | CF | `warOutcome:'loss'` | **`triggersGameEnd:true`** (loyalist reabsorption) |
| `dominion_autonomy` | 8 | auto | CF | `any:[eventChose:{carlisle,b}, eventChose:{conciliatory,b}, warOutcome…no-indep]` | **`triggersGameEnd:true`** (autonomy within empire) |

### Group E — Founding government (spine)
| tid | idx | dec | R/CF | pre | effects |
|---|---|---|---|---|---|
| `lees_resolution` | (12 pre) | cc-president | R | `{all:[lexington_concord,yearAtLeast:1776]}` | adopt/postpone |
| `declaration_of_independence` | 12 | cc-president | R | `{all:[lees_resolution,yearAtLeast:1776]}` | A sign (`unlocks:[governors]`; existing case) |
| `articles_of_confederation` | 14 | cc-president | R | `{all:[declaration_of_independence,yearAtLeast:1777]}` | ratify (existing case: flag + re-elect Confed pres = node 35) |
| `treaty_of_paris` | 27 | auto | R | `{all:[warOutcome:'win',yearAtLeast:1783]}` | existing case (territory seed OH/KY/TN/MS/AL) |
| `annapolis_convention` | 36 | cc-president | R | `{all:[articles_of_confederation,yearAtLeast:1786]}` | **A** → conv follows; **B** → confederation remains |
| `constitutional_convention_kickoff` | 37→39 | auto | R | `{all:[eventChose:{annapolis_convention,a},yearAtLeast:1787]}` | existing case → `pendingConvention` (era advance via applyConvention) |
| `confederation_remains` | 38 | cc-president | CF | `eventChose:{annapolis_convention,b}` | **`triggersGameEnd:true`** (Articles persist) |
| `federalist_papers` | 40 | auto | R | `eventCompleted:constitutional_convention_kickoff` | flavor (RED=Federalists / BLUE=Anti-Federalists *positions*) |

### Group F — Vermont (territory branch)
| tid | idx | dec | R/CF | pre | effects |
|---|---|---|---|---|---|
| `republic_of_vermont` | 15 | auto | R | `yearAtLeast:1777` | flavor (de-facto republic) |
| `claim_vermont` | 16 | cc-president | R | `eventCompleted:republic_of_vermont` | **A claim** / **B do-not-claim** |
| `vermont_statehood` | 17→19 | cc-president | R | `eventChose:{claim_vermont,a}` | **A → admitState('vt')** (new case) |
| (do-not-claim = `claim_vermont` resp B; Vermont stays a republic — no extra node) | 18 | — | — | — | — |

### Group G — Indian treaties (Confederation Congress; correct nations)
| tid | idx | dec | R/CF | pre | effects |
|---|---|---|---|---|---|
| `fort_stanwix` | 41 | cc-president | R | `{all:[warOutcome:'win',yearAtLeast:1784]}` | **Six Nations**; A settle PA / B respect lands → meters/interest/diplomacy |
| `six_nations_frontier_conflict` | 44 | auto | reframed CF | `eventChose:{fort_stanwix,a}` (path-dependent) | conflict outcome (NOT "league war") |
| `hopewell_treaties` | 45 | cc-president | R | `yearAtLeast:1785` | **three treaties** Cherokee/Choctaw/Chickasaw; A settle / **B "won't keep boundaries"** (keep — historically accurate) |
| `cherokee_american_wars` | 48 | auto | reframed CF | `eventChose:{hopewell_treaties,b}` | Chickamauga/Cherokee wars (NOT "Keowee War") |

**Endings summary (AC 26/28):** `triggersGameEnd:true` on exactly THREE nodes:
`lost_war` (11), `dominion_autonomy` (8), `confederation_remains` (38). The
ratification handoff (`constitutional_convention_kickoff` → `applyConvention`
sets `constitutionRatified` + `currentEra='federalism'`) is the ONE era-advance,
already wired in `constitutionalConvention.ts:186`. No Federalism nodes authored.

**Roster count ≈ 25 authored nodes** within the locked 22–26 window (chart
consequences 35/19/44/48 folded as effects/path-dependent conflict nodes).

## Persistence & determinism

- **No separate graph cursor.** Branch state = `eraEventsCompleted` (which fired)
  + resolved nodes' `chosenResponseId` (which branch) + GameState flags
  (`graphFlags`, `governorsExist`, `articlesOfConfederation`, war outcome). The
  walker recomputes the eligible set every turn from these. (Spec Edge "Loading a
  save mid-graph"; AC 41.)
- **Resolved nodes must stay in `pendingEraEvents`** for the life of the era so
  `eventChose` predicates and the history page can read `chosenResponseId`. The
  GameContext change (stop wiping the array) is load-bearing for branch
  correctness — call this out to the builder; it is the #1 persistence edge.
- **Determinism:** the walker uses `chance`/`pickWeighted`/`pick` from
  `src/rng.ts` only — never `Math.random` directly (CLAUDE.md). Note: `rng.ts`
  currently wraps `Math.random` internally (it is "seeded-ready," not yet
  seeded); using the wrappers keeps the code consistent and swap-ready. AI
  auto-resolve is deterministic given the same RNG sequence (AC 21).

## Test / verification plan

- **Build/typecheck (AC 37):** `npm run build` (`tsc -b && vite build`). Confirm
  `validate()` passes at module load (no thrown assertion).
- **Unit-level (no harness; reason through / temporary asserts):**
  - AC 4: `evalPredicate` for each kind — `all/any/not`, year bounds,
    `eventCompleted`, `eventChose`, meter/interest/diplomacy thresholds,
    `warActive`/`warOutcome`, `stateAdmitted`, `officeControlledByPlayer`,
    `rosterHasSkill`, `flag`.
  - AC 2/7/11: `validate()` throws if a node uses `president`/`cabinet`, has
    `chartIndex ≥ 49`, or trips the anachronism denylist (add a temporary bad
    node to prove the guard fires, then remove).
  - AC 14: with both classes eligible, ~80% spine selection over many rolls.
- **Playtest — historical path (AC 38):** `npm run dev`, 1772 scenario. Advance
  the spine: Gaspee → Committees → Tea Act → Boston Tea Party → Intolerable Acts
  (CC convenes) → Declaration of Resolves → Lexington (war starts) → … →
  Articles → Annapolis → Constitutional Convention. Confirm controlled
  `cc-president` decisions open the modal; non-controlled ones auto-resolve in the
  feed (badged AI on the Era Events page).
- **Playtest — roster-gate (AC 40):** verify control flips with the CC
  presidency: when your faction holds it you decide; when not, the AI decides and
  the feed records it. Confirm NO node ever shows a `president`/`cabinet` decider.
- **Playtest — divergent ending #1 (AC 39):** accept Carlisle (`carlisle_commission`
  B) → reach `dominion_autonomy` → `gameEnded` end screen ("autonomy within
  empire"). Confirm the Spain node reads as belligerence/covert aid, never a
  US–Spain alliance.
- **Playtest — divergent ending #2:** drive the war to a loss (decline to aid
  Massachusetts / lose battles) → `lost_war` → game-over. OR take Annapolis B →
  `confederation_remains` → game-over (Articles persist). **Human judgment
  required to confirm ≥2 distinct endings reachable.**
- **Playtest — save mid-graph (AC 41):** save after war start, before
  independence; reload; confirm no completed node re-fires and the next spine
  node surfaces. Save after a branch choice (e.g. claim Vermont) and confirm the
  `eventChose`-gated downstream (`vermont_statehood`) still fires post-reload.
- **Coexistence (AC 36):** confirm a 2.4.2 anytime event and a 2.4.3 spine event
  can both surface the same turn; 2.4.2 untouched.

## Risks

1. **`triggersGameEnd` has no existing consumer (TOP RISK).** The spec (AC
   26/28/29) assumes engine game-end handling that does not exist. *Mitigation:*
   this brief scopes it explicitly — `gameEnded` field set in `resolveEraEvent`,
   a `GameOverScreen` gate in `App.tsx`, and a `chooseEraResponse` short-circuit.
   If the builder finds an existing end path, prefer it; otherwise build the
   minimal screen. Without this, the three endings silently no-op and the game
   keeps running past the era — breaking AC 26/28/39.
2. **Clearing `pendingEraEvents` breaks `eventChose` branch gating.** Today
   GameContext:324 wipes the array each chain-drain; `eventChose` predicates and
   the history page need resolved nodes to persist. *Mitigation:* the brief
   mandates keeping resolved nodes for the era (≤24, bounded). If the builder
   leaves the wipe in, Vermont/Carlisle/Annapolis branches silently never gate
   and downstream nodes either never fire or fire wrongly. Verify in AC 41.
3. **Vermont stateId 'vt' absent from `expansionStates.ts`.** `admitState(snap,
   'vt')` returns false today (confirmed territories.ts:9 + registry has no 'vt').
   *Mitigation:* add the `vt` seed (file #4). Alternative (rejected): inline-push
   like Treaty-of-Paris does — but reusing `admitState` is the spec's stated
   preference and keeps one code path.
4. **History-pressure / force-spine tuning feels on-rails or stalls.** 0.8 +
   coreSpine-always-fire is a starting point. *Mitigation:* all knobs in
   `ERA_GRAPH_RULES`; the coreSpine valve guarantees the opening provocations
   progress. Human playtest sets the final value; no code change to retune.
5. **Auto-resolve burst in one phase call.** The roster-gate loop resolves the
   whole auto/AI chain until a player node or null, which can fire several auto
   events in one 2.4.3 call. *Mitigation:* acceptable (autos don't stack modals);
   if it reads as a burst, gate the loop to one auto-resolve per call (one-line
   change, noted inline). Confirm against spec Edge cases in playtest.
6. **`validate()` denylist coverage / false positives.** The anachronism regex
   could miss a phrasing or flag a legitimate word. *Mitigation:* keep the
   denylist tight (whole-word, case-insensitive, the historian's explicit terms);
   it is a dev-only guard (`import.meta.env.DEV`), so a miss degrades to "author
   discipline," never a runtime crash for players.
7. **Determinism rule vs. `rng.ts` reality.** `rng.ts` wraps `Math.random`
   (not yet seeded) and `revolutionaryWar.ts` already calls `Math.random`
   directly. *Mitigation:* the new walker uses ONLY the `rng.ts` wrappers, so it
   is swap-ready when seeding lands; do not "fix" revolutionaryWar.ts here
   (out of scope).

---

Brief path: `/home/user/AMPU/docs/briefs/independence-era-events.md`
