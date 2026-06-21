# AMPU — Technical Guide

**How AMPU is built, and how to build into it correctly.** This is the living
companion to `CLAUDE.md` (the terse quick-reference). `/build-feature`'s architect
reads this doc; keep it accurate and current. Every claim is grounded in
`file:line`. When a forum-implied system can't yet be supported by the
architecture, this doc says so and sketches the change.

> **Provenance.** The initial map of the codebase was authored against the
> PR1–PR7 expertise/trait/cabinet/lobby epic. The first formally-ingested
> playtest (`f4c7c2c4`, the 1868–1872 Gilded-Age dry-run) added ~41 design
> deltas to `game-context.md` and ~12 new mechanic sections to
> `game-mechanics.md`. This revision absorbs those — [§6.6](#66-the-action-library-shape-emerging-pattern)
> proposes a foundational refactor and [§9](#9-build-sequencing-advice) is
> re-prioritized to put the keystones (RNG seed, action-registry, era-transition,
> `State.policies`) ahead of the per-system work.

---

## 1. The one-paragraph mental model

AMPU is a **single-player, browser, turn-based** strategy game. The *entire* game
is one plain-old-JavaScript object — `FullGameSnapshot` (`src/types.ts:1811`). A
**pure engine** (`src/engine/*`) is a set of functions that take that snapshot and
mutate it in place; it imports no React and does no I/O. A thin **React context**
(`src/state/GameContext.tsx`) owns the snapshot in state, deep-clones it before
each engine call, runs a phase, and writes the result to **IndexedDB**
(`src/db.ts`). The turn is a fixed **phase loop** (`src/phases.ts` ⇒
`src/engine/engine.ts`). The UI is a flat **page registry** (`src/pages/registry.ts`),
keyed by `PageId`, with no router — `src/App.tsx` swaps the active page and
auto-navigates to the page that matches the current phase.

---

## 2. Architecture & data flow

### 2.1 The single-snapshot model

`FullGameSnapshot` (`src/types.ts:1811`) is the root and the unit of persistence,
autosave, export/import, and migration:

```ts
interface FullGameSnapshot {
  game: GameState;          // the singleton GameState record (id: 'game')
  politicians: Politician[];
  factions: Faction[];
  parties: Party[];
  states: State[];
  events: EventEntry[];     // the append-only log
  legislation: Legislation[];
  elections: ElectionResult[];
  wars: War[];
}
```

`GameState` (`src/types.ts:1558`) is the scalar/turn-cursor core: `year`,
`startYear`, `phaseId`/`phaseIndex`, `currentEra`, `scenarioId`,
`playerFactionId`, the national `meters`, `enthusiasm`, `interestGroups`,
`partyPreference`, the office pointers (`presidentId`, `cabinet`, `speakerId`,
`supremeCourtIds`, …), and a long tail of **per-system runtime ledgers**
(`careerGains`, `relocations`, `ideologyShifts`, `conversions`, `kingmakers`,
`factionAlignmentDrift`, `factionLeadership`, `halfTermSummaries`, …). Almost all
of these tail fields are **optional** (`?`) so older saves load without them — see
[§5 persistence/migration](#3-persistence-autosave--migration).

**Implication for features:** new persistent state goes on `GameState` (scalar /
ledger) or on the entity arrays (`Politician`, `Faction`, `State`, …). New
*per-politician* state goes on `Politician` (`src/types.ts:1251`). Make new fields
**optional** and backfill them in `repair()` (see [§3](#3-persistence-autosave--migration)).

#### 2.1.1 Where the f4c7c2c4 deltas would land (data-shape map)

Most of the new design surface fits the snapshot model **with additive optional
fields**. The few that don't are called out as architectural.

| Delta (forum) | Lands on | Field (designed) | Notes / migration |
|---|---|---|---|
| State policy flags (Poll Tax / Jim Crow / Prohibition / Women's Suffrage / Segregation) | `State` (`types.ts:1318`) | `policies?: Partial<Record<StatePolicyId, StatePolicy>>` | Additive ⇒ `repair()` backfill `{}` per state. Time-bounded multipliers need a `multiplierUntilYear` field. Load-bearing — many later mechanics read it (gov actions, era events, scoring). |
| Constitutional amendments durable state | `GameState` | `amendments?: Amendment[]` | Each amendment is a `{ id, passedYear, data? }` row. Couples to election phases (term-length, VP-vacancy fill, succession). |
| Active executive actions | `GameState` | `activeExecutiveActions?: ActiveAction[]` | Each row carries `expiresOn: 'admin-change' \| 'manual' \| { year }`. Auto-deactivate sweep at 2.9.4 (winner reset). |
| Per-power foreign-relations meters | `GameState.diplomacy` (already `Record<string, number>`, `types.ts:1574`) | extend the seed set per era; **renames** (Prussia→Germany post-1871) are a migration issue | The shape is right; the **era-seeded list** + rename map is new. |
| National surplus integer | `GameState` | `nationalSurplus?: number` | Distinct from `meters.revenue` (which is `-5..5` ordinal). |
| Active national crises | `GameState` | `activeCrises?: CrisisId[]` | Crisis bills (`Legislation.resolvesCrisis?: CrisisId`) pop them on passage. |
| Pending census EV deltas | `GameState` | `pendingEvDeltas?: { stateId; delta; censusYear }[]` | Applied in 2.10 on `year % 10 === 0` (decennial). |
| Industry-leadership scoring | derived per turn from `State.industries` (`types.ts:1328`) | no new field — compute at half-term close | Output to faction score totals (need a `Faction.score?` ledger). |
| Faction running score | `Faction` (`types.ts:1293`) | `score?: number` | The forum's per-faction leaderboard is currently un-modeled. |
| Era graphs beyond 1772 | `data/` (new files) | per-era `ERA_GRAPH_<era>` + registry lookup | The walker (`eraGraph.ts:113`) **hard-imports** `ERA_GRAPH_1772` — must be made era-keyed. |
| Multi-decider era events | `EraEvent` (`types.ts:1466`) | `decider: Role \| Role[]` (widen) | Wire the resolver to roll per role. |
| Active platform / promises (convention) | `GameState` | `convention?: { ballots, momentum, promises, ... }` | Subsystem with its own type. New `needsPlayerInput` shape extension. |
| Multiplayer — multiple human factions | `Faction.isPlayer` (`types.ts:1303`) + `GameState.playerFactionId` (`types.ts:1566`) | flip to `playerFactionIds: string[]` + audit every singleton check | This **does not** fit the additive-optional model cleanly — it's an architectural change touching every "is *the* player?" call site. |

**Architectural deltas** (not additive — type-system or store-level changes):

- **`Era` union widening.** `Era` (`types.ts:1337`) has 4 values; the forum
  implies `gilded` + a successor. Adding a value triggers a TypeScript exhaustiveness
  cascade in every `eraConfig` `satisfies Record<Era, …>` — *which is the safety
  net we want*. Plan: add the enum value, fill the rule tables, then add a scenario.
- **`Predicate` extension for state-policy / amendment / crisis preconditions.**
  The serializable `Predicate` (`types.ts:1487`) is the cleanest extension point —
  add `{ statePolicyActive }`, `{ amendmentPassed }`, `{ crisisActive }` variants
  and one `evalPredicate` case each (`eraGraph.ts:12`).

### 2.2 Engine purity

Everything under `src/engine/*` is a **pure function over the snapshot**: takes
`snap: FullGameSnapshot`, mutates it in place, returns either `void` or a small
result object. No React imports, no IndexedDB, no `fetch`. This is what lets the
engine be unit-tested headlessly (see the `scripts/playtest*.ts` smoke harnesses)
and re-run deterministically.

- Phase runners: `src/engine/phaseRunners.ts` (4198 lines — one `runPhase_*`
  per phase plus the player-action entry points like `playerDraftPick`,
  `attemptPlayerRelocation`).
- The loop driver: `src/engine/engine.ts` (`runCurrentPhase`, `advancePhase`).
- Era subsystems: `continentalCongress.ts`, `constitutionalConvention.ts`,
  `revolutionaryWar.ts`, `firstContinentalCongress.ts`, `eraGraph.ts`,
  `territories.ts`.
- Cross-cutting helpers: `log.ts` (`addLog`), `traits.ts`
  (`addTrait`/`tryGrantTrait`), `expertise.ts` (`addExpertise`), `abilities.ts`
  (`addSkillPoint`/`loseSkill`/`addCommandPoint`/`loseCommand`),
  `electionEffects.ts` (`applyTraitElectionBonus`), `halfTermSummary.ts`,
  `labels.ts`.

**Do:** put rules in the engine, read-only derivations in pages/components.
**Don't:** mutate the snapshot from a React component — go through a
`GameContext` action, which clones → runs engine → persists.

### 2.3 The phase loop

`PHASE_SEQUENCE` (`src/phases.ts:3`) is the ordered list of ~35 phases, ids
`'2.1.1'`…`'2.10'` (`PhaseId`, `src/types.ts:1420`). The loop is:

1. `runCurrentPhase(snap)` (`src/engine/engine.ts:16`) dispatches on
   `snap.game.phaseId` via a big `switch` to the matching `runPhase_*`. It returns
   `{ needsPlayerInput?, payload?, acknowledgements? }`. `needsPlayerInput` is one
   of `'draft' | 'eraEvent' | 'cabinet' | 'convention' | 'ccBuilder' |
   'ccAIConfirm'` (`engine.ts:9,16`).
2. If input is needed, `GameContext.advance` (`src/state/GameContext.tsx:300`)
   stops, surfaces a modal or routes to a page, and **persists** — the snapshot
   rests mid-phase.
3. Otherwise `advancePhase(snap)` (`engine.ts:95`) finds the next phase that
   should run and updates the cursor.

`nextPhaseInfo` (`src/phases.ts:149`) walks forward to the next
`shouldRunPhase`-true phase; when it falls off the end it **wraps to the next turn
by `year + 2`** (`phases.ts:161`) — a turn is a half-term (two years). Year
predicates: `isElectionYear` (`% 2`), `isPresidentialYear`/`isDraftYear` (`% 4`)
(`phases.ts:49-59`).

`shouldRunPhase(phaseId, year, game?)` (`src/phases.ts:62`) is the **single gate**
for whether a phase runs this turn. It encodes both **year gating** (no
presidential election off-cycle) and **era gating** (e.g. independence era skips
all of 2.3 cabinet/2.8 executive; 2.9.6 becomes the First-CC builder only under a
specific 1772 predicate chain at `phases.ts:111-122`). **This is the function you
extend when a new system or era changes which phases fire.**

> **Forum confirmation.** The GM's numbered cadence in the digest (post 1, 12,
> 26, 67, 85, 125, 151, 201, 311) maps **1:1** onto `PHASE_SEQUENCE`. The same
> phase taxonomy → the build is the same game; the gap is depth and
> era-coverage, not phase shape. (digest#mechanics-confirmed)

### 2.4 Determinism (and where it's currently violated)

`src/rng.ts` exposes the RNG wrappers the engine *should* use: `rand`, `d`,
`d100`, `rollVs`, `pickWeighted`, `pick`, `shuffle`, `chance`, `clamp`, `uid`.
The header comment (`rng.ts:1-2`) is honest: **today these wrap `Math.random`
directly** (`rng.ts:5`) and seeding is a "plug in later" stub. So the engine is
*deterministic in shape* (re-running the same phase produces the same kind of
result) but **not reproducible** (no seed ⇒ different rolls each run).

CLAUDE.md's rule — "keep engine code deterministic; don't use `Math.random`" — is
about a stronger discipline: **always go through the `rng.ts` wrappers, never call
`Math.random` directly**, so that when a real seeded PRNG is dropped into
`rng.ts`, the whole engine becomes reproducible in one change. That discipline is
**partially violated today** — see [§8 tech debt #1–#3](#8-tech-debt--risks).
New engine code must use the wrappers.

### 2.5 The append-only log

`addLog(snap, phase, category, text, meta?)` (`src/engine/log.ts:4`) pushes an
`EventEntry` (`src/types.ts:1439`) onto `snap.events`. Categories are a fixed
union (`death | retire | election | legislation | event | appointment | system |
meter | draft | war | court | roll`). This feed drives most pages. The
`EventEntry.meta` bag carries structured extras (e.g. `{ politicianId }`) that
pages read for cross-linking. There is also a **per-half-term structured summary**
(`halfTermSummary.ts`) opened at the top of each turn and closed at 2.10, read by
the End-of-Half-Term page and Campaign-Over recap.

---

## 3. Persistence, autosave & migration

### 3.1 IndexedDB layout

`src/db.ts` defines an `idb` schema (`AmpuDB`, `db.ts:15`) with one object store
per snapshot array (`game`, `politicians`, `factions`, …) plus a few indexes
(`by-faction`, `by-party`, `by-year`). `loadSnapshot` (`db.ts:106`) reassembles
the snapshot; `saveSnapshot` (`db.ts:123`) writes every store in one transaction
and stamps `game.lastSavedAt`. `exportJson`/`importJson` (`db.ts:163-173`) are the
save-file path and also what the user's CSV-import flow rides on.

### 3.2 Autosave

`GameContext.persist` (`src/state/GameContext.tsx:84`) = `saveSnapshot` + set
`hasSave`. **Every** context action that mutates calls `persist` after the engine
runs — including the ones that ran on a *failed* roll. The relocation/ideology/
conversion actions return a boolean meaning "the attempt RAN (mutated cooldown/
counter/feed) and must persist" vs. "rejected, nothing changed"
(`GameContext.tsx:588-615`). So the game **autosaves on every phase advance and
every player action** — there is no explicit save button.

### 3.3 Migration discipline — `repair()`, NOT `DB_VERSION`

This is the most important and most counter-intuitive part of the persistence
story. **`DB_VERSION` is hard-coded `1` (`db.ts:60`) and has never been bumped.**
The `idb` `upgrade` callback (`db.ts:67`) only ever *creates* stores; it does no
data migration. All save-shape migration happens **in application code** in
`repair()` (`src/state/GameContext.tsx:91-239`), which runs on every load
(`GameContext.tsx:254`, `:278`) before the snapshot is surfaced to the UI.

`repair()` is an idempotent, dirty-flagged sweep that:
- repairs stuck draft schedules (`GameContext.tsx:94`),
- backfills fields added after launch (`draftedYear`, `draftHistory`,
  `halfTermSummaries`, `careerGains`) (`:101-156`),
- strips now-invalid card ids and legacy office/trait strings
  (`:157-168`, `:169-192`),
- migrates the 8 legacy "expertise-as-trait" strings onto the expertise axis
  (PR1, `:173-192`),
- drops legacy cabinet seats (PR5, `:196-218`),
- backfills `loyalty` (PR6, `:219-237`).

**The migration playbook for a new feature** (do this, not a `DB_VERSION` bump):
1. Add the new field as **optional** on the type.
2. Add an **idempotent** backfill block in `repair()` that inits it when missing
   and sets `dirty = true`. Pattern: `if (s.game.newField == null) { s.game.newField = <default>; dirty = true; }`.
3. If you removed/renamed a field, add a defensive strip block (see the card-id
   filter at `:157` for the template).
4. `repair()` returns `dirty ? { ...s } : s` (`:238`); the caller re-saves only if
   the object identity changed (`:256`, `:280`).

> **Risk.** Because there's no schema version, `repair()` is the *only* line of
> defense and it grows unbounded. Each of the f4c7c2c4 deltas that lands new
> fields (`State.policies`, `GameState.amendments`, `GameState.activeExecutiveActions`,
> `Faction.score`, …) adds another idempotent block here. The bigger risk is a
> **genuinely incompatible store-level change** — a new object store, a changed
> keyPath, or splitting a store. That would need a `DB_VERSION` bump + a real
> `idb` `upgrade` migration. There is no precedent for that yet; design new
> features to be **additive over existing stores** unless absolutely necessary.

---

## 4. The page registry (no router)

`src/pages/registry.ts` exports `PageId` (a string union, `registry.ts:37`) and
`Pages: Record<PageId, () => JSX.Element>` (`registry.ts:74`). `src/App.tsx`
holds the current `page` in `useState` (`App.tsx:14`) and renders `Pages[page]`
(`App.tsx:345`). There is **no URL routing** — navigation is `setPage(...)`,
threaded to pages via `NavigationContext` (`App.tsx:353`) and to the sidebar.

**Phase-driven auto-navigation:** `App.tsx` has ~20 `useEffect`s (`App.tsx:38`…)
that watch `snapshot.game.phaseId` + `year` and `setPage(...)` to the page for the
current phase, using a `lastXEntryKey` ref keyed on `${year}:${phaseId}` so it
navigates **once per phase visit** and never yanks the player back after they
click away. **To wire a new interactive phase to its page:** add a `PageId` +
component in `registry.ts`, then add one such effect in `App.tsx` following the
exact ref-key pattern.

Modals are separate from pages: `GameContext` owns a `Modal` union
(`GameContext.tsx:14`) for the era-event and convention surfaces; `App.tsx:358`
renders them.

---

## 5. Data & scenario layout

`src/data/` holds two kinds of content: **scenario builders** and **seed/era
content**.

| File | Role |
|---|---|
| `scenario1772.ts` (`build1772Scenario`) | Founding scenario; starts `currentEra: 'independence'`, phase `2.1.1`, full pool expansion draft. |
| `scenario1856.ts` (`build1856Scenario`) | Antebellum scenario; starts `currentEra: 'nationalism'`, phase `2.1.2` (rookie crop pre-seeded), bicameral constitution already ratified. |
| `states1772.ts` / `states1856.ts` | Colony/state rosters. |
| `factions1772.ts` / `factions1856.ts` | Seed factions, parties, interest groups. |
| `politicians1772.ts` / `politicians1856.ts` | Seed/filler politicians (note: `politicians1856.ts` uses raw `Math.random` 12× — author-time fill, see §8). |
| `eraEvents1772.ts` (`ERA_GRAPH_1772`) | The **independence-era event graph** (see §6.4). |
| `eraEvents1856.ts`, `anytimeEvents.ts`, `anytimeNationalEvents.ts` | 1856 era events; anytime-event pools. |
| `expansionStates.ts` | Post-founding admittable states (`admitState`). |
| `defaultDraftClasses.ts`, `standardDraftClasses.ts`, `draftImport.ts` | The draft dataset (see §7). |

A scenario builder returns a fully-formed `FullGameSnapshot`: it instantiates
politicians, seats Senators/Reps/Governors, wires the cabinet/court, sets starting
`meters`/`enthusiasm`/`interestGroups`, builds the snake draft order, and stamps
the `GameState`. The two builders are the template for any new scenario.

**For era-content registries** (gilded-age era event graph, era-keyed card pools,
era-keyed draft-ideology profiles), the cleanest pattern is **one file per era**
(e.g. `eraEventsGilded.ts` exports `ERA_GRAPH_GILDED`) **plus a registry index**
(`eraEventRegistry.ts` exports `ERA_GRAPHS: Record<Era, GraphNode[]>`). Today the
walker hard-imports `ERA_GRAPH_1772` at `eraGraph.ts:4` — that import is the
single chokepoint to refactor.

---

## 6. Patterns & conventions

### 6.1 Where the rules constants live

**All tunable rule numbers live as exported `const` objects in `src/types.ts`,
co-located with the types they govern.** This is deliberate: the human dials
balance there without touching engine bodies, and engine code stays free of magic
numbers. The full set (with line anchors):

| Const | `src/types.ts` | Governs |
|---|---|---|
| `CAREER_ODDS`, `TRACK_*` tables | `:194-237` | Career-track skill/trait/expertise rolls (2.1.2) |
| `RELOCATION_ODDS`, `CARPETBAGGER_LADDER` | `:241-250` | Relocations (2.1.4) |
| `IDEOLOGY_SHIFT_ODDS` | `:253` | Ideology drift/shift (2.1.5) |
| `CONVERSION_ODDS` | `:268` | Faction conversion/poaching (2.1.6) |
| `KINGMAKER_RULES` | `:295` | Kingmaker/protégé (2.1.7) |
| `ALIGNMENT_RULES`, `LOBBY_*`, `EXPERTISE_IDEOLOGY_LEAN`, `LOBBY_RULES` | `:330-432` | Faction personality/alignment drift (2.1.8) |
| `LEADERSHIP_RULES` (per-era `eraConfig`) | `:438` | Faction-leader challenges |
| `MORTALITY_RULES` (per-era `eraConfig`) | `:485` | Deaths/retirements (2.4.1) |
| `ABILITY_LOSS_RULES`, `ABILITY_EARN_RULES` | `:518-585` | Skill/command gain & decay |
| `OFFICE_*_GRANT`, `OFFICE_EXPERTISE`, `COMMITTEE_EXPERTISE`, `CABINET_SEAT_SCORING` | `:590-1242` | Office→stat/expertise grants, cabinet scoring (2.3.1) |
| `TRAIT_LIFECYCLE_RULES`, `TRAIT_CONFLICTS` | `:624-692` | Trait erosion + symmetric conflict pairs |
| `TRAIT_ELECTION_BANDS`, `TRAIT_ELECTION_EFFECTS` (+`ElectionContext`) | `:697-978` | Per-trait per-context election magnitudes (2.9) |
| `TRAIT_GOVERNANCE_BANDS`, `TRAIT_GOVERNANCE_EFFECTS` (+`GovernanceContext`) | `:980-1071` | Per-trait governance/crisis magnitudes |
| `ANYTIME_EVENTS_RULES` (per-era), `ERA_GRAPH_RULES` | `:1073-1105` | Anytime events; 1772 graph walker |
| `cabinetSeatsForYear(year)`, `LOYALTY_*` | `:1152-1208` | Era-conditional cabinet seats; Secession-Winter loyalty |

Pattern to copy: a `Record<…, …> as const satisfies <shape>` keyed by `Era` for
anything era-scaled (`MORTALITY_RULES.eraConfig` at `:507` is the cleanest
template). The election/governance effects use a **flat array of rule rows**
(`TraitElectionRule[]`) rather than nested records, because several rows need
cross-cutting `era` / `opponentConditional` qualifiers — follow that shape for any
new context-scaled trait effect.

### 6.2 The mutation-helper idioms (gate-the-log pattern)

The cross-cutting helpers all share one contract: **mutate, and return `true`
iff something actually changed**, so callers gate their `addLog` on a real change
and re-grants are silent no-ops.

- `addExpertise(p, tag)` — `src/engine/expertise.ts:5`. Dedupe-on-insert.
- `addTrait(p, t)` / `removeTrait(p, t)` — `src/engine/traits.ts:8,15`. Raw, no
  conflict logic.
- `tryGrantTrait(p, t)` — `src/engine/traits.ts:41`. **Conflict-aware** grant:
  consults `TRAIT_CONFLICTS`, d6-arbitrates a held opposite (threshold from
  `TRAIT_LIFECYCLE_RULES.conflictD6Threshold`), returns `{ granted, replaced }`.
  Route *earned* traits through this, not `addTrait`.
- `addSkillPoint(p, key, amt)` / `loseSkill` / `addCommandPoint` / `loseCommand`
  — `src/engine/abilities.ts:6-38`. Clamp `[0,5]`; **probability is decided at the
  call site, never inside the helper** (the helpers are deterministic).
- `addLog(snap, phase, category, text, meta?)` — `src/engine/log.ts:4`.

Canonical call shape (from the cabinet/committee grant pattern,
`phaseRunners.ts:434`, `:485`, `:1930`):

```ts
if (chance(odds) && addExpertise(p, xp)) {
  addLog(snap, '2.1.2', 'appointment', `${name} gains ${xp} expertise.`);
}
```

After mutating `skills`/`command`/`traits`/`currentOffice`, recompute PV with
`refreshPv(politicians)` (`src/pv.ts:91`) at a natural boundary (the draft and
scenario builders do this; per-phase runners that change PV-affecting fields
should too).

### 6.3 PV — the election currency

`computePV(p)` (`src/pv.ts:67`) folds office-weighted skills (`officeWeights`,
`pv.ts:33`), command, trait bumps (+4 positive / −5 negative, `pv.ts:75-78`),
office prestige (`OFFICE_PRESTIGE`, `pv.ts:7`), faction-leader bonus, and age
penalties into a single number cached on `Politician.pvCache`. **PV feeds
elections directly** (`calcStateVote` reads `c.pvCache`, `phaseRunners.ts:3699`,
`:3709`) and draft order (`phaseRunners.ts:122-126`). The CLAUDE.md warning
stands: changing the PV formula reweights every election and draft at once — do it
deliberately and re-playtest.

### 6.4 Era-event content as data (the 1772 graph)

The independence era models its event chain as a **serializable graph**, the
cleanest "content is data, not code" pattern in the repo and the model to imitate
for future eras:

- `ERA_GRAPH_1772: GraphNode[]` (`src/data/eraEvents1772.ts:58`). Each `GraphNode`
  (`eraEvents1772.ts:19`) has a stable `templateId`, a `chartIndex`, an optional
  **`precondition: Predicate`**, an `aiBias` map, and a `build(year) ⇒ EraEvent`.
- `Predicate` (`src/types.ts:1487`) is a **serializable precondition tree**
  (`all`/`any`/`not`/`yearAtLeast`/`eventChose`/`meterAtLeast`/`warOutcome`/…).
  One pure interpreter, `evalPredicate(snap, pred)` (`src/engine/eraGraph.ts:12`),
  walks it. Preconditions are *data* — inspectable and testable, no code per node.
- The walker `selectEraGraphNode` (`eraGraph.ts:107`) picks the next eligible node
  (core spine fires immediately; otherwise history-pressure-weighted spine-vs-
  counterfactual, then a probabilistic fire roll), `build`s it, and queues it.
- AI auto-resolution: `isAutoResolved` + `pickAIResponse` (`eraGraph.ts:78,88`)
  resolve nodes the player doesn't control by the controlling faction's
  personality — mirroring the convention CPU-consensus precedent.
- A dev-only `validate()` (`eraGraph.ts:147`) asserts authoring invariants
  (no President/Cabinet decider pre-1789, `chartIndex < 49` to stop before
  Federalism, an anachronism denylist).

The 1856 era currently uses a simpler per-year pool rebuild
(`GameContext.tsx:544-548` clears `pendingEraEvents` each turn for 1856 but keeps
the resolved 1772 nodes durable for `eventChose` predicates). **For a new era,
prefer the graph model.**

> **Refactor cost when generalizing.** Only `eraGraph.ts:4` and `:113` know about
> `ERA_GRAPH_1772` by name; lift to `ERA_GRAPHS: Record<Era, GraphNode[]>` and
> dispatch at the walker entry. The `validate()` denylist (`eraGraph.ts:145`)
> needs an era-keyed version too (anachronisms differ per era).

### 6.5 How a new phase is wired end-to-end

1. Add the id to `PhaseId` (`src/types.ts:1420`) and a row to `PHASE_SEQUENCE`
   (`src/phases.ts:3`) in the right ordinal slot.
2. Add gating to `shouldRunPhase` (`src/phases.ts:62`) if it's year- or
   era-conditional.
3. Write `runPhase_X(snap)` in `src/engine/phaseRunners.ts` (pure; rng via
   wrappers; mutate snapshot; `addLog`).
4. Add a `case` in `runCurrentPhase`'s switch (`src/engine/engine.ts:25`). If it
   needs player input, return a `needsPlayerInput` discriminant and handle it in
   the matching `GameContext` action.
5. If interactive, add a `PageId` + component (`src/pages/registry.ts`) and an
   auto-nav effect in `src/App.tsx` (§4).
6. Put all tunables in a rules const in `src/types.ts` (§6.1).

### 6.6 The action-library shape (emerging pattern)

**Architectural call.** The f4c7c2c4 digest reveals **four parallel action
libraries** the engine needs to absorb:

| Library | Forum location | Codebase target |
|---|---|---|
| Governor's actions (~14 named actions) | digest §11.3 (posts 134-150) | `runPhase_2_5_2_Governors` (`phaseRunners.ts:3382` — currently a 10-line passive `bias` nudge) |
| Executive actions (Swing-around-the-circle, Bureau of Labor, …) | digest §14.1 (posts 201-203) | `runPhase_2_8_1_Executive` (`phaseRunners.ts:3632` — currently 4 hardcoded one-shots in an array) |
| Inter-ballot convention actions (Force Rules Change, Presidential Promise, Drop & endorse, Kingmaker interference, Ballot shift) | digest §15.3.3 (posts 230-246) | currently no convention engine at all (`engine.ts:69` logs "ratifies the primary winners") |
| Diplomacy actions (Increase Relations, Increase Trade, Extend Credit) | digest §13.3.2 (post 198) | `runPhase_2_7_1_Diplomacy` (`phaseRunners.ts:3585` — currently passive 20% drift) |

Every action in every library has the **same shape**:

```ts
interface GameAction<Ctx> {
  id: string;
  label: string;
  // Surface prerequisites for UI gating (skills, traits, state-policy flags, …)
  isAvailable: (snap: FullGameSnapshot, actor: Politician, ctx: Ctx) => boolean;
  // The roll target — usually d100 vs k * skill.
  resolve: (snap: FullGameSnapshot, actor: Politician, ctx: Ctx) => ActionResult;
  // For persistent (executive) actions, when to auto-clear.
  persistence?: 'oneShot' | 'adminChange' | 'manual';
}
```

**Recommendation: build *one* `ActionRegistry<Ctx>` type and use it for all
four libraries**, instead of 4 ad-hoc parallel registries. The advantages:

- One UI component (the "Action Picker") renders against any registry.
- One JSON-serializable shape for save-game persistence (the active-actions
  list is just `{ registryId, actionId, params }[]`).
- New eras add actions by appending registry rows — no engine code per action.
- Forum-confirmed action set today maps cleanly into ~30 rows across 4 registries
  vs. ~30 distinct `if (action === 'foo') { … }` branches in 4 different
  switch statements.

The four libraries differ only in **context type** (`StateId` for governor,
`undefined` for exec, `BallotState` for convention, `NationId` for diplomacy) and
**persistence semantics** (only exec actions are durable). A single 80-line
`ActionRegistry` type captures both.

> **Risk if we don't unify.** Each library will accumulate its own ad-hoc shape
> (governor's prereq table, exec's deactivation conditions, convention's
> momentum effects, diplomacy's preconditions). Save-game persistence and UI
> picker code will be quadrupled. Engine purity is unaffected either way, but
> the surface area grows ~4× without the registry. See [§9](#9-build-sequencing-advice)
> for sequencing.

### 6.7 How to add a system — playbook for the f4c7c2c4 batch

The mechanics digest reveals three recurring kinds of system. Each has a
**recipe**:

#### 6.7.1 Data-driven content registry (era graphs, card pools, action libraries)

1. Define the data shape as a TS interface (or extend an existing one).
2. Put the **rows** in `src/data/` (one file per cluster — see §5).
3. Put the **registry index** in `src/data/<thing>Registry.ts`, keyed by era or
   scenario, `as const satisfies Record<Era, T[]>` so TS catches missing eras.
4. The engine consumer reads the registry, never the rows directly.
5. Add backfill in `repair()` if the *consumer state* (e.g. `pendingEvDeltas`)
   is new on `GameState`.

Example call: era graph generalization — make `ERA_GRAPHS[era]` and update
`selectEraGraphNode` to pick the registry by `snap.game.currentEra`.

#### 6.7.2 Era-gated mechanic (per-era ideology drafting profile, era-renamed nations)

1. Add the new entry to `Era` (`types.ts:1337`) **first**. TS will flag every
   `Record<Era, …>` table missing the era — fix one at a time.
2. Add a transition trigger. Today the **only** era transition is hard-coded in
   `constitutionalConvention.ts:198` (`currentEra = 'federalism'`). Generalize
   to `advanceEra(snap, target: Era)` in `src/engine/eraTransition.ts` (pure).
3. Era boundaries are also card-pool / nation-roster swaps. Run them through
   `advanceEra` so a 1772→federalism→nationalism→gilded campaign has one
   transition function with side-effect hooks.
4. Add scenario builder (`scenarioGilded.ts`?) if the era is a starting era.

#### 6.7.3 Action library (governor / exec / convention / diplomacy)

1. Define the `GameAction<Ctx>` shape **once** in `src/engine/actionRegistry.ts`
   (§6.6). Reuse for all four libraries.
2. Author rows in `src/data/governorActions.ts`, `src/data/executiveActions.ts`,
   `src/data/conventionActions.ts`, `src/data/diplomacyActions.ts`.
3. The phase runner enumerates available actions, asks the player (or CPU),
   resolves with the registry's `resolve` function.
4. For persistent actions (exec), add to `GameState.activeExecutiveActions`.
   Auto-deactivate sweep at 2.9.4 (admin change).

**Gotchas to watch (all four playbooks):**
- PV impact: any action that changes a stat, trait, or office must `refreshPv`
  before the phase ends.
- Election feedback: bonuses/penalties from state policies, exec actions, etc.
  flow into `calcStateVote` (`phaseRunners.ts:3685`) — wire them through
  `applyTraitElectionBonus` or a new sibling, not by patching the resolver body.
- Era gating: `shouldRunPhase` is the single chokepoint for whether a phase
  runs — don't sprinkle era checks inside runners. Add a `currentEra` guard at
  the gate.
- Migration: any new persistent field is optional + `repair()` backfilled.
  (§3.3)

---

## 7. The draft-dataset pipeline (author-time)

The bundled "standard draft classes" are **generated**, not hand-written. Do NOT
hand-edit `src/data/defaultDraftClasses.ts`,
`public/standard-draft-classes.json`, or `politicians-dataset.csv` — edit the
scripts and regenerate. (See `docs/draft-class-authoring.md` for the
who-to-include conventions.)

- `scripts/seedDataset.mjs` — curated authoring source: `CURATED_ROWS` (marquee
  figures; **override** same-named dataset entries) and `ERA_FIGURES` (founding
  notables who never served; **additive-only**).
- `scripts/fetchLegislators.sh` — downloads sources into `.legis/` (gitignored):
  the `unitedstates/congress-legislators` YAML + MEDSL election CSVs.
- `scripts/legislatorsToDataset.mjs` — the merge (`legislatorsToDataset.mjs:256`
  onward). Merge precedence: served members < `CURATED_ROWS` (overlay at `:271`);
  `ERA_FIGURES` (`:292`) and MEDSL failed candidates (`:307`) are added only if no
  same-name person exists within ~25 years (`ERA_SAME_PERSON_WINDOW`, `:282`).
  Emits the runtime JSON (`:316`), the review CSV (`:329`), and the small offline
  fallback `defaultDraftClasses.ts` (`:344`).

**Dataset rules** (enforced in the script): `draftYear = round((birthYear+25)/4)*4`
clamped ≥ 1772 (`draftYearFor`, `legislatorsToDataset.mjs:25`); failed candidates
get **sub-floor** electoral stats (`legislative ≤ 1`, low command — `mkLoser`,
`:231`) so they rarely win.

**Runtime load:** `loadStandardDraftClasses` (`src/data/standardDraftClasses.ts:13`)
fetches the ~18.5k JSON on app mount and swaps it into the synchronously-read
`STANDARD_DRAFT_CLASSES` export; the curated built-in is the fallback if the fetch
fails/times out (raced against a 12s timeout, `GameContext.tsx:247-250`). The
draft runner instantiates the year's class via `instantiateDraftees`
(`phaseRunners.ts:114-175`), with per-game user imports
(`game.customDraftClasses`) taking precedence over the bundled set.

**Regenerate:** `bash scripts/fetchLegislators.sh && node scripts/legislatorsToDataset.mjs && npm run build`.

> **For Gilded-Age and later eras.** The pipeline already covers every legislator
> through 2024 (the YAML source is canonical) — the dataset is *already valid*
> for the Gilded Age. The per-era *drafting ideology profile* the digest
> describes (post 1: Brocklin shifts Lib/Mod → Prog/Lib on entering the era)
> is **not** in the dataset, it's a per-(faction, era) tunable that lives on
> the **faction**, not the politician — best modeled as a small registry
> `FACTION_DRAFT_PROFILES: Record<FactionId, Record<Era, IdeologyProfile>>`.

---

## 8. Tech debt & risks

| # | Issue | Location | Impact / fix |
|---|---|---|---|
| 1 | **Raw `Math.random` in election scoring** | `phaseRunners.ts:3711` (`calcStateVote`'s `(Math.random()-0.5)*8` jitter) | The flagship determinism leak — every state vote is unseeded. Blocks reproducible elections (and any future replay/multiplayer sync). Route through `rng.ts`. |
| 2 | **Raw `Math.random` elsewhere in the engine** | draft rookie fallback gen `phaseRunners.ts:188-198`; war resolution `:3603`; court pressure `:3711`; `revolutionaryWar.ts:89,97`; `continentalCongress.ts:271` | Same class of bug. **~13 raw calls across the engine** (10 in `phaseRunners.ts` incl. #1; 2 in `revolutionaryWar.ts`; 1 in `continentalCongress.ts`). `eraGraph.ts` is already clean — its only `Math.random` mention is the "no Math.random" comment at `:8`. Migrate all to `rng.ts` wrappers as part of the seeding work. |
| 3 | **`rng.ts` is not actually seeded** | `rng.ts:1-5` | The wrappers exist but wrap `Math.random`. Determinism is *aspirational* until a real PRNG (e.g. mulberry32/xoshiro) is dropped in and a seed is stored on `GameState`. Prerequisite for replay + multiplayer. |
| 4 | **No `DB_VERSION` migration path** | `db.ts:60`; `repair()` `GameContext.tsx:91` | All migration is app-side `repair()`. Fine for additive fields; **a store-level change has no precedent** and would need a real `idb` upgrade. `repair()` also grows unbounded — each f4c7c2c4 delta adds another block. |
| 5 | **`nationalism`/`modern` eras are partly inert** | only transition is `constitutionalConvention.ts:198` (`→ 'federalism'`) | `Era` has 4 values and rules consts key all 4, but **no runtime path enters `nationalism` or `modern`** — 1856 *starts* in `nationalism` and never advances. New eras need both content *and* a transition trigger. The forum implies at least `gilded` + a successor — see §9. |
| 6 | **Snapshot is single-deep-cloned per action** | `GameContext.tsx:302` etc. (`JSON.parse(JSON.stringify(snapshot))`) | Whole-snapshot clone + whole-snapshot `saveSnapshot` (`db.ts:123` writes every store every time) is O(everything) per action. Fine at current sizes (~hundreds–thousands of politicians); a concern as the dataset/era count grows. Multiplayer makes it worse — multiple players poking state. |
| 7 | **Engine `switch` + `GameContext` action duplication** | `engine.ts:25`; `GameContext.tsx` actions | Each interactive phase is wired in two places (engine discriminant + context handler + App effect). Adding phases is mechanical but spread across files — easy to half-wire. The 4 action libraries (§6.6) would compound this if not registry-unified. |
| 8 | **Per-game dataset stored on the save** | `game.customDraftClasses` (`types.ts:1631`) | User-imported draftees travel inside the snapshot, so they bloat every autosave/export. Acceptable now; watch as datasets grow. |
| 9 | **Hard-coded `ERA_GRAPH_1772` import** | `eraGraph.ts:4`, `:113` | The walker only knows the 1772 graph. Generalizing to `ERA_GRAPHS: Record<Era, GraphNode[]>` is the gating step before any new-era event content can be authored. See §9. |
| 10 | **Singleton `playerFactionId` / `isPlayer`** | `types.ts:1303`, `:1566`; every "is this me?" call site (`eraGraph.ts` `playerControlsDecider`, faction-scan gates in `phaseRunners.ts`, autoNav effects in `App.tsx`) | Single-player assumption baked deep. Multiplayer flips this to a set; mechanical refactor once the helper exists, but **wide** and **hard to do safely without a seed** (multiple players, unseeded RNG ⇒ desync). See §9. |
| 11 | **Bill scoring divergence (forum ±50/100/150 per card vs shipped `factionCenter` × 0.03)** | `phaseRunners.ts:1516` (`cardVoteBias`) vs digest §12.8 / post 237 | One of the three design divergences in mechanics §19.1. The shipped scorer summarizes a faction by one `factionCenter` index; the forum scores **every** ideology+lobby+interest card per bill. **This is debt only if we plan to migrate** — see the call in §9. |
| 12 | **Carpetbagger trait grant divergence** | `phaseRunners.ts` (`relocationOdds` 4-step ladder for trait grant) vs digest §6.2.x / post 36 | Forum **auto-grants** Carpetbagger on alt-state moves; shipped engine rolls per-band. Same caveat as #11 — debt only if we migrate. The forum behavior is arguably more legible to the player. |
| 13 | **Conversion-targeting divergence** | `phaseRunners.ts` `CONVERSION_ODDS` (`types.ts:268`) vs digest §6.4.x | Shipped engine uses a multiplicative willingness table keyed on fit/PV/Loyal/Opportunist; forum gates strictly on `Can Party Flip` (cross-party) and `Pliable + adjacent ideology` (same-party) with hard 5/10/15% base rates. Same caveat. |

---

## 9. Build-sequencing advice

> **This section is written for the roadmap-planner to lift directly.** It is my
> engineering opinion on order, dependencies, and rough size/risk for the
> game-pm gap log (~41 rows) and the design divergences in mechanics §19.1.
> Source: codebase + `f4c7c2c4` digest. This is the **revised** version after
> the dry-run — the previous version saw only "multiplayer + new eras" and now
> there are ~30 new mechanic sub-systems to slot in.

### 9.1 Keystones (do these in order before any per-system work)

Five **foundation pieces** unblock everything else. They are cheap relative to
their leverage, and each later epic builds on at least one of them.

| Order | Foundation | Size | Why first |
|---|---|---|---|
| **0** | **Seed the RNG** (replace `Math.random` in `rng.ts:5` with mulberry32/xoshiro; store `seed`+state on `GameState`; migrate the ~13 raw `Math.random` engine calls — debt #1–#3) | **S–M** | Determinism is the **prerequisite for multiplayer** (clients/turns must agree on roll outcomes) and for any future replay/test harness that wants reproducibility. Mechanical, but touches many files — do it before the codebase grows further. |
| **1** | **`State.policies` data shape** (new `Partial<Record<StatePolicyId, StatePolicy>>` on `State`, repair() backfill `{}`) | **XS** | Load-bearing — **lots of later content reads/writes it**: governor actions, era events (Poll Tax / Jim Crow / Prohibition / Women's Suffrage / Segregation toggles), bill effects, election scoring. A tiny PR. Land before the governor's-action library so the actions have a real target. |
| **2** | **The `ActionRegistry<Ctx>` type** (§6.6) — one shape for governor / exec / convention / diplomacy actions, in `src/engine/actionRegistry.ts` | **S** | The forum reveals **four parallel action libraries**. Building each ad-hoc means quadruple the engine surface area. A single 80-line type unifies them, plus one UI Action Picker, plus one persistence shape. **Architectural call** — do this *before* any of the four libraries, or pay 4× the integration cost. |
| **3** | **`advanceEra(snap)` keystone + era-content registry** (lift `eraGraph.ts:4,113` to `ERA_GRAPHS: Record<Era, GraphNode[]>`; generalize `constitutionalConvention.ts:198`'s hard-coded `currentEra = 'federalism'` to a callable transition with side-effect hooks for card-pool swap, nation renames, draft profile shift) | **M** | Today the **only** era transition lives inside a constitutional-convention finisher. To add gilded / progressive / modern as live eras, the transition needs to be a callable, era-agnostic function — and the era-event walker needs to dispatch by era. Debt #5 and #9 dissolved by this PR. |
| **4** | **Era enum widening + scenario builders for `gilded`** (add `'gilded'` to `Era` (`types.ts:1337`); fill every `Record<Era, …>` rule table the TS exhaustiveness check flags; add `scenarioGilded.ts`) | **M–L** | Once #3 lands, this is mostly content. The TS `satisfies Record<Era, …>` is your safety net — missing rows are compile errors. Author a Gilded-Age scenario; new content registries (gilded card pool, gilded ideology profiles, gilded era-event graph) get added under their new keys. |

**The dependency chain**: 0 → (1 ‖ 2 ‖ 3) → 4 → all the per-system work.
After 0, 1+2+3 are independent and can be parallelized across PRs. 4 depends
on 3.

### 9.2 Major subsystems (do these after the keystones)

Slot the heavyweights revealed by the dry-run. Within each row I call out the
keystones it depends on so the planner can build a DAG.

| Subsystem | Forum location | Size | Depends on | Notes |
|---|---|---|---|---|
| **Convention machinery (2.9.2)** — multi-ballot loop, momentum, unit-rule, inter-ballot actions (Rules Change, Promise, Drop & endorse, Kingmaker, Ballot shift), VP impact 10-check, platform 5-plank + 4-step comparison, scandal rolls, faithless electors, post-election scoring | digest §15.3 (posts 211, 220-267) | **L–XL** | keystones 0, 2 | This is the **single biggest unbuilt subsystem** in the design. Replaces the current `engine.ts:69` one-liner ("party conventions ratify the primary winners"). Affects every presidential cycle. Needs the action registry (inter-ballot actions are an action library) and the RNG seed (lots of rolls). Wire into the existing `needsPlayerInput: 'convention'` mechanism (`engine.ts:9`) but with a much richer payload. |
| **Governor's actions library (2.5.2)** — ~14 named actions (Build roads, Establish State Bank, Gerrymander, Women's Suffrage, Jim Crow, …), d100 vs 20·governing, per-action prereqs | digest §11.3 (posts 134-150) | **M** | keystones 1, 2 | Replaces the 10-line passive `bias` nudge at `phaseRunners.ts:3382`. Actions read & write `State.policies` (keystone 1). |
| **Executive actions library (2.8.1)** — persistent active actions, `Easily Overwhelmed` VP hand-off, green/yellow shading auto-deactivate-on-admin-change | digest §14.1 (posts 201-203) | **M** | keystones 2, 3 (admin-change is an `advanceEra`-shaped event, technically a presidency change — but the auto-deactivate sweep needs a hook somewhere) | Replaces the 4-hardcoded-one-shots at `phaseRunners.ts:3636`. Persistent state goes on `GameState.activeExecutiveActions`. |
| **Diplomacy actions library (2.7.1)** — Increase Relations, Increase Trade, Extend Credit; per-power foreign-relations meters with era renames | digest §13.3 (posts 132, 198) | **M** | keystone 2 (action shape); shape-only change for diplomacy (`GameState.diplomacy` is already `Record<string, number>`) | The shape is right. Need the era-seeded list and rename map (e.g. Prussia→Germany 1871). |
| **Legislative micro-mechanics** — committee block-and-replace, bill packaging, filibuster, `*Crisis Bill*` tag | digest §12.4–§12.7 (posts 160-194) | **M each** | keystone 0 (filibuster is a roll); committees already exist | These are 4 independent PRs. Block-and-replace is the smallest; packaging and filibuster each add a new sub-phase hook. Crisis bills need a `GameState.activeCrises` list. |
| **Constitutional amendments durable state** — `GameState.amendments`; bills that pass/repeal them; effects on succession, term length, etc. | digest §14.2 (posts 159, 164, 173, 188, 276-277) | **M** | keystone 0 | Each amendment is a `{ id, passedYear, data? }` row. Couples to elections (term-length, VP-vacancy fill). |
| **Era event extensions** — multi-decider events, foreign-territory grants en bloc, census-driven EV deltas, state-policy-flag side-effects, Egghead-cabinet advisory | digest §10.4 (posts 125-129) | **M** | keystones 1, 3 | The `Predicate` tree extends well (§2.1.1). Multi-decider widens `EraEvent.decider`. Census deltas need a `pendingEvDeltas` queue applied in 2.10 every `year % 10 === 0`. |
| **Cabinet & leadership richness** — regional-coverage malus, state-status eligibility guard, Ministers-to-foreign-powers seats, Congressional 9-role leadership pipeline (RCV whip races, committee-eligibility-by-prior-service) | digest §28-32 (posts 50-117) | **M–L** | keystone 0 | Congressional pipeline is the chunkier of the two; pure content + scoring. |
| **Faction-personality drift, era nicknames, draft profile per era** | digest §24, §40 (posts 49, 298, 323) | **S–M** | keystone 4 (era enum) | Per-(faction, era) profile is a registry. |
| **Old-age stat decay, defeated-incumbent auto-retire, auto-Carpetbagger** | digest §F (posts 36, 297) | **XS each** | — | Small consistency/cleanup PRs. |
| **National surplus integer, industry leadership scoring** | digest §13.3.3, §11.5 (posts 133, 200) | **S each** | keystones 1 (industry reads `State.industries`) | Faction `score?` field implied by the leaderboard. |
| **Design-divergence resolutions** | mechanics §19.1 | varies | depends per item | See §9.3 below — call per item. |

### 9.3 Design divergences — keep shipped or refactor to forum?

Three rules where the forum and the engine genuinely disagree (mechanics §19.1).
My defensible call per item:

| # | Divergence | Recommendation | Rationale |
|---|---|---|---|
| 1 | **Bill scoring** — shipped: `factionCenter` × `cardBiasPerDelta 0.03` per matching card. Forum: ±50/±100/±150 per card per bill, summed across **every** ideology+lobby+interest card. | **Refactor to forum**, but in two phases. **Phase A** (small): keep `cardVoteBias` as the **vote-probability** input (it's well-tuned for floor votes), and add a separate `legislativeScoring(bill, faction)` returning a points number that lives on a new `Faction.score` ledger. They serve different jobs — voting odds vs. leaderboard scoring. **Phase B** (later): once the leaderboard exists, decide whether to also re-tune `cardVoteBias` to be per-card-aware. | The forum's ±50/100/150 is *scoring*, not *voting* — the GM scores after passage. The shipped `cardVoteBias` is fine for voting probability and would be invasive to rebalance. Land the leaderboard first; revisit voting odds only if playtest exposes a real divergence. **Size: M.** **Risk: low** (additive). |
| 2 | **Carpetbagger trait grant** — shipped: 4-step probability ladder. Forum: auto-grant on alt-state moves. | **Refactor to forum (auto-grant).** Land in same PR as the Carpetbagger ladder removal. | Forum behavior is more legible to the player and removes a tuning dial that doesn't carry weight. The ladder doesn't fix anything the auto-grant breaks. **Size: XS.** **Risk: low** (purely simpler). |
| 3 | **Conversion targeting** — shipped: multiplicative willingness table on fit/PV/Loyal/Opportunist. Forum: hard gates on `Can Party Flip` (cross-party) / `Pliable + adjacent ideology` (same-party) + 5/10/15% base rates. | **Keep shipped for now; revisit after the faction-personality system gets its drift rules formalized.** | The shipped system rewards multiple soft signals; the forum system is harder gates + flat probability. Both are defensible. The faction-personality drift (digest §24) is currently GM-discretionary; if a rule-driven version lands and it produces `Can Party Flip` traits cleanly, the forum model becomes attractive. Until then, the shipped multiplicative table is doing useful work. **Size: M** if we change. **Risk: medium** — touches a load-bearing balance dial. |

### 9.4 Multiplayer — last, with one caveat

**Multiplayer is still last**, but the action-library refactor (keystone 2)
changes the planning. Specifically:

- **Hot-seat / sequential** multiplayer reuses the existing `needsPlayerInput`
  mechanism (`engine.ts:9`). It pauses mid-phase per decider — extend to
  round-robin across human factions before `advancePhase`. **But the
  player-input modalities are exactly the four action libraries** (draft pick,
  era-event response, cabinet selection, convention inter-ballot, governor
  action, exec action, diplomacy action). Hot-seat needs those libraries to
  *exist as picker UIs* before it's coherent. **So: hot-seat goes after
  keystone 2 + the four libraries land.** Not before — building hot-seat first
  and then re-validating against each new action library is wasted work.
- **Async forum-style** is a backend epic. IndexedDB is per-browser (`db.ts`);
  shared state needs a server (or CRDT/host-authoritative sync) the repo does
  not have today. Scope it as its own L–XL epic, not a feature.
- **Determinism (keystone 0) is hard-blocking for either model** — clients/
  turns must derive identical roll outcomes from the same seed.
- **Whole-snapshot clone + save** (debt #6) becomes a real bottleneck once
  multiple players are poking state. Expect to move to per-store/delta writes.

### 9.5 One-line ordering (for `roadmap.md`)

**Phase 0 (keystones, mostly parallelizable after 0):**
**0) Seed the RNG → 1) `State.policies` shape → 2) `ActionRegistry<Ctx>` →
3) `advanceEra()` + era-content registry → 4) Era enum widening + Gilded
scenario.**

**Phase 1 (subsystems, in roughly this order to minimize rework):**
**5) Convention machinery (uses keystone 2; biggest single subsystem) →
6) Governor's actions library → 7) Diplomacy actions library →
8) Executive actions library → 9) Legislative micro-mechanics
(block-and-replace, packaging, filibuster, crisis bills) →
10) Era-event extensions (multi-decider, census deltas, territory grants) →
11) Cabinet & Congressional leadership richness → 12) Constitutional
amendments durable state → 13) Small consistency PRs (old-age decay,
auto-retire, auto-Carpetbagger, national surplus, industry leadership) →
14) Design-divergence resolutions per §9.3.**

**Phase 2 (multiplayer, separate epic):**
**15) Hot-seat sequential multiplayer (depends on every action library
existing) → 16) Async / backend multiplayer (separate L–XL epic).**

**The single most important dependency call:**
**Keystone 2 (the `ActionRegistry<Ctx>` refactor) blocks every action-library
build (governor / exec / convention / diplomacy) AND blocks hot-seat
multiplayer.** Building any one of those four ad-hoc costs the team a 4× tax
later. If only one keystone lands this quarter, it should be #2.

---

## 10. Build / lint / test commands

- Dev server: `npm run dev`
- Production build (typecheck + build — run before calling code done): `npm run build` (`tsc -b && vite build`)
- Typecheck only: `npm run lint` (`tsc -b --noEmit`)
- Preview built app: `npm run preview`
- Engine smoke tests: the `scripts/playtest*.ts` / `scripts/smokeTest*.mjs`
  harnesses run engine helpers headlessly (no React) — the model for
  feature-level verification (the qa-tester role writes these).
- Regenerate the draft dataset: see §7.

**Definition of done** (from CLAUDE.md): `npm run build` passes **and** the change
is playtested in `npm run dev` — build/typecheck prove correctness, not that the
game is fun or balanced (that judgment is human). Pushing/PRs are human-approved
checkpoints.
