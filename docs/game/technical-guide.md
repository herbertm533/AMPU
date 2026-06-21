# AMPU — Technical Guide

**How AMPU is built, and how to build into it correctly.** This is the living
companion to `CLAUDE.md` (the terse quick-reference). `/build-feature`'s architect
reads this doc; keep it accurate and current. Every claim is grounded in
`file:line`. When a forum-implied system can't yet be supported by the
architecture, this doc says so and sketches the change.

> **Provenance.** The initial map of the codebase was authored against the
> PR1–PR7 expertise/trait/cabinet/lobby epic. **Batch 1** (`f4c7c2c4`, the
> 1868–1872 Gilded-Age dry-run) added ~41 design deltas and the action-library
> keystone. **Batch 2** absorbed two threads — `f55d3e21` (a 732-post 1788
> **federalism** solo-with-AI playtest) and `85f8e6b4` (a 90-post 1772 solo
> "aesthetic experiment", the **presentation layer** A1–A8) — adding three design
> divergences (#4–#6), three confirmed bugs, and a parallelizable presentation
> track. **Batch 3** (this revision) absorbs `3a9ac985` — a **2276-post modern
> (1948→2020) multiplayer campaign**, the most mechanically mature thread yet. It
> **corroborates ~30 prior deltas across a 4th era** (the keystone calls are now
> as strong as they will get), adds the modern subsystems (named meter bank,
> enthusiasm/Party-Pref engine, full primary→convention→general, named-Justice
> SCOTUS docket, CPU delegate engine, military-leadership tier, 53-state roster +
> Wyoming-Rule apportionment, two-home-state pols), **two new divergences (#7
> SCOTUS, #8 cabinet)**, **two GM-confirmed design holes (DH-1 filibuster-MUST-pass,
> DH-2 era-deck-off-year)**, and — architecturally most important — **two scaling
> walls that are NOT era-gated** (dataset exhaustion → procedural pol generation;
> Wyoming-Rule House bloat → persist/auto-fill slates). [§9](#9-build-sequencing-advice)
> is **re-sequenced** to pull those cross-cutting items forward while keeping the
> deep-modern subsystems at the far end.
>
> **⚠ Batch-3 correction — the cabinet "no-wipe" claim was WRONG.** Batch 2's
> grounding note asserted the engine has *no* cabinet-wipe-on-election and that
> "shipped cabinets already hold over." **That was incorrect — it inspected only
> the fill phase (2.3.1) and missed the wipe in the election phase.**
> `runPhase_2_9_4_PresidentialGeneral` **unconditionally clears every cabinet seat
> after every presidential general election** (`phaseRunners.ts:3804-3812`),
> vacating each occupant and setting the seat to `null` — *even when the incumbent
> is re-elected*. `runPhase_2_3_1_Cabinet` then re-fills empty seats next turn
> (`:2166`), so in practice the cabinet is **wiped and rebuilt from scratch every
> presidential cycle**. Divergence #8 is therefore a **genuine wipe-vs-retention
> contradiction**, and the fix is **larger** than batch 2 scoped it (replace the
> unconditional wipe with retention + a firing-precedent gate), *not* a small
> additive flag. See the corrected grounding note in §2.1.1 and debt #17.

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

#### 2.1.1 Where the forum deltas land (data-shape map)

Most of the new design surface fits the snapshot model **with additive optional
fields**. The few that don't are called out as architectural. The tables below
merge batch-1 (`gilded`), batch-2 (`fed` + `1772s`), and batch-3 (`modern`) deltas.

> **Batch-3 headline: almost all the modern systems are *widenings* of shapes
> that already exist, not new shapes.** The named meter bank widens
> `NationalMeters` (`types.ts:1399`) + the existing `Enthusiasm`/`diplomacy`
> tables; the SCOTUS docket extends the existing `supremeCourtIds`/`chiefJusticeId`
> court; the primary/general subsystems extend the existing `ElectionContext`
> phases. The genuinely *new* structural pressures are the **two scaling walls**
> (procedural pol generation; persist/auto-fill House slates) — called out in
> their own block below because they are **not era-gated** and bite well before
> the modern era.

**Batch 1 (gilded):**

| Delta (forum) | Lands on | Field (designed) | Notes / migration |
|---|---|---|---|
| State policy flags (Poll Tax / Jim Crow / Prohibition / Women's Suffrage / Segregation) | `State` (`types.ts:1318`, confirmed: no `policies` field today) | `policies?: Partial<Record<StatePolicyId, StatePolicy>>` | Additive ⇒ `repair()` backfill `{}` per state. Time-bounded multipliers need a `multiplierUntilYear` field. Load-bearing — many later mechanics read it (gov actions, era events, scoring). |
| Constitutional amendments durable state | `GameState` | `amendments?: Amendment[]` | Each amendment is a `{ id, passedYear, data? }` row. Couples to election phases (term-length, VP-vacancy fill, succession). |
| Active executive actions | `GameState` | `activeExecutiveActions?: ActiveAction[]` | Each row carries `expiresOn: 'admin-change' \| 'manual' \| { year }`. Auto-deactivate sweep on presidency change. |
| Per-power foreign-relations meters | `GameState.diplomacy` (already `Record<string, number>`, `types.ts:1574`) | extend the seed set per era; **renames** (Prussia→Germany post-1871) are a migration issue | The shape is right; the **era-seeded list** + rename map is new. |
| National surplus integer | `GameState` | `nationalSurplus?: number` | Distinct from `meters.revenue` (which is `-5..5` ordinal). Feeds the spending cap (batch 2, #42). |
| Active national crises | `GameState` | `activeCrises?: CrisisId[]` | Crisis bills (`Legislation.resolvesCrisis?: CrisisId`) pop them on passage. |
| Pending census EV deltas | `GameState` | `pendingEvDeltas?: { stateId; delta; censusYear }[]` | Applied in 2.10 on `year % 10 === 0` (decennial). |
| Industry-leadership scoring | derived per turn from `State.industries` (`types.ts:1328`) | no new field — compute at half-term close | Output to faction score totals (need a `Faction.score?` ledger). |
| Faction running score | `Faction` (`types.ts:1293`) | `score?: number` | The forum's per-faction leaderboard is currently un-modeled. |
| Era graphs beyond 1772 | `data/` (new files) | per-era `ERA_GRAPH_<era>` + registry lookup | The walker hard-imports `ERA_GRAPH_1772` at **`eraGraph.ts:4`** and references it at **`:73, :113, :148, :164`** — must be made era-keyed (5 chokepoints, not 2). |
| Multi-decider era events | `EraEvent` (`types.ts:1466`) | `decider: Role \| Role[]` (widen) | Wire the resolver to roll per role. |
| Active platform / promises (convention) | `GameState` | `convention?: { ballots, momentum, promises, ... }` | Subsystem with its own type. New `needsPlayerInput` shape extension. |
| Multiplayer — multiple human factions | `Faction.isPlayer` (`types.ts:1303`) + `GameState.playerFactionId` (`types.ts:1566`) | flip to `playerFactionIds: string[]` + audit every singleton check | This **does not** fit the additive-optional model cleanly — it's an architectural change touching every "is *the* player?" call site. |

**Batch 2 (federalism + 1772-solo):**

| Delta (forum) | Lands on | Field (designed) | Notes / migration |
|---|---|---|---|
| **Per-state EC selection method** (#44, divergence #5) | `State` (`types.ts:1318`) | `electionMethod?: 'popular' \| 'legislature'` | Additive ⇒ `repair()` backfill `'popular'`. **But the *consumer* is a divergence** — `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`) resolves *every* state by popular vote; legislature-method states must instead award EV from seated-legislature party majority. Flipped per-state by era event, globally by amendment. |
| **Generic war system** (#45, divergence #6) | `War` entity (`types.ts`, already a snapshot array) + `GameState.wars` | extend `War` with `difficulty`, `momentum`, `multiplier`, commander ref | Replaces the flat resolver in `runPhase_2_7_2_Military` (`phaseRunners.ts:3593-3627`) and folds the 1772 Rev-War loop (`revolutionaryWar.ts`) in as one configured instance. Largely engine-internal; the `War` array already persists. |
| **Amendments-as-state** (#39) | `GameState` | `amendments?: { id; passedYear; data? }[]` | Same field as the batch-1 row, now sharpened: cross-state ratification vote at the gov phase; **can fail** (Christianity-as-religion rejected 9-7); effect-binding (term-length 4↔6, popular-vote-everywhere, VP-vacancy fill, suffrage). Couples to #5 and to firing-precedent. |
| **Firing-precedent + cabinet retention** (#25, divergence #8) | `GameState` + the wipe at `phaseRunners.ts:3804-3812` | `firingPrecedentSet?: boolean` + per-officer tenure fields | `repair()` backfill `false`. **⚠ CORRECTED in batch 3:** the batch-2 grounding note claimed cabinets "already hold over" — **wrong.** `runPhase_2_9_4_PresidentialGeneral` **wipes the whole cabinet every presidential cycle** (`:3804-3812`); 2.3.1's empty-seat fill (`:2166`) then rebuilds it. So this is a **wipe→retention refactor** (remove the clear, retain ≤5, gate replacement on the flag, per-officer tenure, same-faction US-Bank guard) — **M, not a small additive flag.** See the corrected grounding note below + debt #17. |
| **Bill-driven statehood** (#43) | `Legislation` + `admitState` (`territories.ts:8`) | `Bill.type` (below) routes a statehood/territory bill → `admitState` | `admitState` already exists and is idempotent; today it is invoked only from 1772 era-event `postEffects`. Add the bill-driven path + **auto-generate filler officials** for sparse new states + organized/unorganized territory status. |
| **Bill typing + spending cap** (#42) | `Legislation` (`types.ts:1506`, confirmed: no `type` tag) + `GameState` | `Bill.type?: 'foundational' \| 'spending' \| 'crisis'`; `game.spendingBudget?: number` | Additive on both. The cap reads the **numeric** `nationalSurplus`, not the ordinal `revenue` meter. Crisis bills bypass the cap. A bill can pass the floor and still be "BLOCKED DUE TO BUDGET" (ordering matters when over-subscribed). |
| **Named-ordinal meter model + ±3 swing cap** (divergence, §21.8) | `GameState.meters` (`NationalMeters`, `types.ts:1399`) | either keep 7 numeric meters + add a `clamp(±3)` per phase, or migrate to labeled-ordinal meters | **Decision, not additive** — see §9.3 #7. The ±3-per-phase clamp is cheap and orthogonal; the full named-ordinal relabel is a model change touching every meter read/write + the UI. Includes a first-class war-score meter (couples to #45). |
| **Tariff integer + change-cadence** (#3) | `GameState` | `tariffPercent?: number`; `tariffNextChangeableYear?: number` | Additive. Set once (10% in 1789), locked until a "first changeable year" (1796). Same axis surfaces in gilded. |
| **Party formed-year / era-name** (federalism §20.5) | `Party` (`types.ts:1306`) | `formedYear?: number`; `eraName?: string` | Party *identity is event-driven*: "Federalists Formed" / "Jeffersonian Republicans Formed" fire ~1792 and create the names; before that the two parties are unnamed proto-blocs. Couples to the nickname table (`Faction.nickname` already exists, `types.ts:1297`). |
| **Federalism scenario + era content** (federalism §20) | `data/` (new files) | `scenario1788.ts`, `factions1788.ts`, `states1788.ts`, `eraEventsFederalism.ts` (`ERA_GRAPH_FEDERALISM`), `scotusFederalism.ts` | A full era's worth of content. See the federalism/advance-Era reconciliation in §9.1. |
| **Presentation: portrait / art pipeline** (A1) | `Politician` (`types.ts:1251`, confirmed: no image field) | `portrait?: PortraitSpec` | Additive on the type, but the *pipeline* is a new author-time/asset system (CK2-style **procedurally-generated** assets — **hard no-AI-in-product**). See the presentation-track note in §9. |
| **Presentation: ideology→color palette** (A2) | `src/theme/` (new) | `IDEOLOGY_COLORS: Record<Ideology, string>` | A tiny **cross-cutting foundation** — many UI items (roster, congress, maps, score sheets, committee views) depend on it. `Party.color` already exists (`types.ts:1310`); this is the per-*ideology* legend, which does not. Do it early in the presentation track. |
| **Presentation: sport-card / scoreboard / battle-card / maps / titles / legacy lines** (A3–A8) | new components; small fields on `Politician` (honorific memory, legacy lines, A6) | new `src/components/*` + per-(office, era, state) title strings (A5) | Largely additive — a big UI *surface* but mostly read-only views over existing snapshot data. A4 (battle-card additive-odds breakdown) pairs with #45. A8 (narration voice) is a `log.ts` quality bar, not a schema change. |

**Batch 3 (modern):** the modern arc is the FAR end of the timeline; almost every
row below is a **widening of an existing shape** (`is widening?` column).

| Delta (forum) | Lands on | Field (designed) | Widening? · Notes / migration |
|---|---|---|---|
| **Named meter bank + crisis/cascade** (#50) | `GameState.meters` (`NationalMeters`, `types.ts:1399`), `GameState.enthusiasm` (`Enthusiasm`, `types.ts:1415`), `GameState.diplomacy` (`Record<string,number>`, `types.ts:1574`) | banded-text ladders over the **same 7 numeric fields** + a numeric `nationalDebt?: number` + `activeCrises?` + cascade rules | **WIDENING.** The mechanics table maps each bank meter **1:1** to a shipped field (Revenue→`revenue`, EconStab→`economic`, …, Party-Pref→`partyPreference`, per-ideology→`enthusiasm`, per-power→`diplomacy`). So the *bank is the existing shape relabeled*; the new parts are the **banded labels** (presentation), the **crisis entry/exit by tier + cascade** (engine, the ±3-clamp from §9.3#7 lives here), and the **numeric debt** integer (same field as batch-2 `nationalSurplus`). Additive. |
| **Enthusiasm / Party-Pref election engine + Score economy** (#51) | `GameState.enthusiasm` + `partyPreference` (exist) + `Faction.score?` (new) | the **4-part reshuffle algorithm** (engine, no new field) + `Faction.score` ledger + era-end award rules | **WIDENING (engine, not shape).** The *tables* exist and `calcStateVote` already reads them; the **driving algorithm is the gap**. `Faction.score` is the one new field (same as the batch-1 leaderboard row). The reshuffle runs after legislation scoring. |
| **Presidential primary subsystem** (2.9.1, #47) | `GameState` | `primary?: { groups, candidates[], delegates, ... }` runtime ledger | **WIDENING.** Phase 2.9.1 + the `presPrimary` `ElectionContext` (`types.ts:697`) already exist; today there is no loop. New subsystem-state shape like the planned `convention?` ledger; a new `needsPlayerInput: 'primary'` discriminant. Its actions are an **action library** (see K2). |
| **Primary/general action libraries** (#16, #47) | `src/data/*` action rows + `GameState.activePrimaryActions?` | `ActionRegistry<Ctx>` rows (Embrace Issue, Attack, Presidential Promise, Give a Speech, …) | **WIDENING of K2.** These are the 5th and 6th action libraries (after governor/exec/convention/diplomacy). They **raise K2's leverage**, not lower it — see §6.6. |
| **SCOTUS named-Justice docket** (#52, divergence #7) | `GameState.supremeCourtIds` / `chiefJusticeId` (`types.ts:1584-1585`, exist) + new `scotusDocket?` + `courtTargetSize?` | a case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, compel-vote/compel-retire, dynamic court size | **STRUCTURAL net-new (but court entity exists).** The shipped court is a thin generic flavor-roll: 2.5.3 picks one of 4 hardcoded titles and nudges `partyPreference ±0.1` (`phaseRunners.ts:3398-3414`); 2.8.2 retires age-≥75 at 15% and back-fills same-party (`:3648-3671`). The modern docket replaces both with a real case model + compel/packing/confirmation/ideology-reveal. **Not a "replacement of a rich shipped system" — it's a real subsystem layered over a stub.** See the §2.1.1 grounding note. |
| **CPU delegate engine** (#13) | engine + `State` | per-state EV × category multiplier compute (no new field; reads `electoralVotes`) | **WIDENING.** Pure compute used by both convention and primary apportionment (53 states ⇒ 1,300 delegates / majority 651). Slots into the convention subsystem. |
| **Military-leadership appointment tier** (#49) | `GameState.cabinet` (already a seat map) + `OfficeType` (`types.ts:1123`) | new ranks (JCS, Army/Navy chiefs, Generals, Admirals) + auto-confirm + promotion back-fill | **WIDENING.** `GeneralInChief`/`Admiral` seats already exist (`types.ts:1121`); this adds a multi-rank ladder above them. Feeds the generic-war per-battle modifiers (#45). Pairs with the war epic. |
| **53-state roster + Wyoming-Rule apportionment** (#55, #34) | new `data/states_modern.ts` + `State.electoralVotes` (exists) + `State.bias` (exists) | a 53-state roster (DC/CU/PR) + a decennial apportionment recompute that resets EV + `bias` + adds/removes a focus-Rep | **WIDENING.** `State.region` already includes `Caribbean`/`Latin America`/`Pacific`/`Atlantic` (`types.ts:1322`) — partial readiness. The recompute is the same `pendingEvDeltas` decennial mechanism (batch 1) at a larger scale. **But see scaling-wall (b): the House bloat it produces is a UX wall.** |
| **Two-home-state politicians** (#55) | `Politician` (`types.ts:1251`, single `state` today, `:1784`) | `homeStates?: string[]` (or `altStates?: string[]`) alongside the primary `state` | **WIDENING.** Additive optional list; `repair()` backfills `[]`. Touches relocation/Carpetbagger (which read `p.state`) and kingmaker chaining — audit those readers. |
| **Persist + auto-fill House slates & committee rosters** (A9) | `GameState` | `houseSlates?: …` + carry-forward committee rosters | **STRUCTURAL-ish + UX.** See scaling-wall (b) below — this is a near-term requirement, not a modern-only one. |

**Two scaling walls (architecturally important; NOT era-gated — call these out):**

These two are different in kind from the table rows: they are not "a system the
modern era adds" but **load-bearing infrastructure the build needs to support
late-era play *and* large rosters at all**. Both surfaced in `modern` but bite
earlier; both connect to the presentation track.

- **(a) Dataset exhaustion → mandatory procedural politician generation (#43, A1).**
  The real-person draft dataset (~18.5k, runtime-loaded from
  `public/standard-draft-classes.json` via `loadStandardDraftClasses`,
  `standardDraftClasses.ts:13`) **runs out in the deep-modern era** — the GM
  switched to procedurally generating rookie classes (~188 pols/class) and asked
  for a generation script. **A procedural generator is required for ANY late-era
  play**, and it is *also* the answer to "sparse new states need filler officials"
  (#43) and BUG-3's stopgap-officer need. **Where it slots:** it is a **sibling of
  the author-time `scripts/` pipeline (§7)** in spirit, but it must run *at
  runtime* (a new draft class is generated mid-game when the dataset is dry), so it
  lives in `src/engine/` (pure, seeded — uses `rng.ts`) producing `ImportedDraftee`
  rows (`types.ts:1780`), reusing the same `instantiateDraftees` path
  (`phaseRunners.ts:114`). It needs: a stat/ideology/trait/demographic distribution
  (GM wanted "some moderates"), a **plausible, ethnically-varied, toggleable name
  engine** (players rejected silly names), and — to fill the long tail visually —
  **procedural portraits (A1)**, which is why this connects to the presentation
  track. **This is the bridge between the dataset pipeline and the portrait epic.**
- **(b) Wyoming-Rule House bloat → must persist/auto-fill House slates &
  committees (A9).** At modern scale the House balloons to **~572–601 seats**
  (Senate 106). The forum's manual House-election + committee-staffing phases
  became the dominant tedium — the RepElections tab is **wiped every cycle**,
  players kept companion spreadsheets, and **a human quit over it**. This is the
  **"the computer owns the deterministic tedium"** theme — also flagged in the
  1772-solo digest for Lingering / Committees / Cabinet staffing. **Requirement:**
  persist a faction's House candidate slate + committee rosters in the snapshot and
  **carry-forward / bulk auto-fill by default**. This is a **near-term UX/engine
  requirement** (it improves *every* era's congressional phases, and 1856 already
  has 31 states), not a modern-only one — see §9.

**Architectural deltas** (not additive — type-system or store-level changes):

- **`Era` union widening + decouple content-gating from literal years.** `Era`
  (`types.ts:1337`) has 4 values (`independence | federalism | nationalism |
  modern`); the forum implies at least `gilded` + `progressive` between
  `nationalism` and `modern`. Adding a value triggers a TypeScript exhaustiveness
  cascade in every `eraConfig` `satisfies Record<Era, …>` — *which is the safety
  net we want*. Plan: add the enum value, fill the rule tables, then add a scenario.
  **Batch 3 adds a related, deeper point: the game is alt-history and runs on its
  own clock** (the `modern` campaign plays fictional eras — "Era of Terror"
  …–2012, "Era of Populism" 2012–2024 — ~10 years behind real tech). Today the
  year predicates `isElectionYear`/`isPresidentialYear`/`isDraftYear`
  (`phases.ts:49-59`) only set the *cadence* of phases — which is correct and
  should stay year-based. But **content legality must be gated by `currentEra`, not
  by literal calendar year.** Era-event scheduling and card/action availability
  must key off the era enum (and the era-content registry from K3), so an
  alt-history campaign that diverges from real dates still fires the right content.
  This folds into the K3 `advanceEra` + era-content-registry keystone (§9.1).
- **`Predicate` extension for state-policy / amendment / crisis / EC-method
  preconditions.** The serializable `Predicate` (`types.ts:1487`) is the cleanest
  extension point — add `{ statePolicyActive }`, `{ amendmentPassed }`,
  `{ crisisActive }`, `{ electionMethodIs }` variants and one `evalPredicate`
  case each (`eraGraph.ts:12`).

> **Grounding note (CORRECTED in batch 3) — there IS a cabinet wipe-on-election;
> divergence #8 is a genuine contradiction, and #7 SCOTUS is a real subsystem over
> a stub.** Batch 2's grounding note claimed "there is no such wipe in the engine"
> and that "shipped cabinets already hold over." **That was wrong.** It inspected
> only `runPhase_2_3_1_Cabinet` (the *fill* phase, which does skip occupied seats
> at `phaseRunners.ts:2166`) and **missed the wipe in the election phase**:
> `runPhase_2_9_4_PresidentialGeneral` runs an **unconditional loop that vacates
> every cabinet occupant and sets every seat to `null`** (`phaseRunners.ts:3804-3812`)
> after *every* presidential general election — including when the incumbent is
> re-elected (there is no party-change or winner≠incumbent guard). The fill phase
> 2.3.1 then re-staffs the now-empty seats at the **top of the next turn** (the
> phase loop wraps `year + 2`), so the net shipped behavior is: **the cabinet is
> wiped and rebuilt from scratch every presidential cycle** — the *opposite* of the
> forum's retention/hold-over intent. So `game-mechanics.md` §19.1 #8 is correct,
> and the firing-precedent work is **larger** than batch 2 scoped it: it is
> **replace the unconditional wipe (`:3804-3812`) with retention** (modern: keep up
> to 5, CIA/FBI exempt) **gated by a `firingPrecedentSet` flag + per-officer tenure
> rules + same-faction US-Bank-President guard** — not a one-line additive flag.
> Re-sized in §9 and debt #17.
>
> **Apply the same skepticism to #7 (SCOTUS), the other direction.** `mechanics`
> §19.1 #7 calls the modern named-docket "a replacement, not an extension." Verified
> against the code, the shipped court is a **stub, not a rich system being
> replaced**: 2.5.3 picks one of **4 hardcoded flavor titles** and nudges
> `partyPreference ±0.1` by con/lib justice count (`phaseRunners.ts:3398-3414`);
> 2.8.2 retires age-≥75 justices at 15% and back-fills same-party
> (`:3648-3671`). The entity (`supremeCourtIds`/`chiefJusticeId`, `types.ts:1584`)
> exists; the docket, per-case effects, compel-vote/retire, dynamic court size, and
> ruling→law-deactivation are all **net-new**. So #7 is correctly scoped as a
> from-scratch SCOTUS module (there is no balance-tuned court to preserve), but
> framing it as displacing a working system overstates what ships today.

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

> **`scenario1856` is the template for the next scenario, not `scenario1772`.**
> The buildable batch-2 target is **federalism via `scenario1788.ts`** — a
> **mid-government boot** (pre-seated Washington administration, start past the
> draft at a governance phase, `phaseId: '2.1.2'`), which is exactly the
> `scenario1856` shape (`scenario1856.ts:177-193`), not the from-scratch 1772
> shape. See §9.1.1 for why the mid-government boot precedes a general
> `advanceEra()`. New files: `scenario1788.ts`, `factions1788.ts`,
> `states1788.ts`, `eraEventsFederalism.ts`, `scotusFederalism.ts`.

**For era-content registries** (federalism/gilded era event graphs, era-keyed
card pools, era-keyed draft-ideology profiles), the cleanest pattern is **one file
per era** (e.g. `eraEventsFederalism.ts` exports `ERA_GRAPH_FEDERALISM`) **plus a
registry index** (`eraEventRegistry.ts` exports `ERA_GRAPHS: Record<Era,
GraphNode[]>`). Today the walker hard-imports `ERA_GRAPH_1772` at `eraGraph.ts:4`
(plus 4 call sites, `:73/:113/:148/:164`) — those are the chokepoints to refactor
(see §6.4, debt #9).

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

> **Refactor cost when generalizing.** Five spots in `eraGraph.ts` know about
> `ERA_GRAPH_1772` by name — the import (`:4`) and four call sites (`:73` template
> lookup, `:113` eligibility filter, `:148` validate loop, `:164` Vermont special-
> case). Lift to `ERA_GRAPHS: Record<Era, GraphNode[]>` and dispatch by
> `snap.game.currentEra` at each. The `validate()` denylist needs an era-keyed
> version too (anachronisms differ per era). This is the gating step before any
> federalism/gilded era-event content can be authored.

> **Batch-2 divergence — scheduling, not just content (divergence #4).** The
> `coreSpine`-precondition-graph model above is itself a **fork** from forum
> intent. The forum schedules era events by **historical-year sort + per-half-term
> roll (`roll ≤ %-to-fire`) up to a per-era cap, with spill into anytime-events**
> when underfilled (`game-mechanics.md` §21.7; `1772s` B1). The graph guarantees a
> *causal* spine; the forum guarantees a *historical-cadence* spine. **These
> produce different sequences — pick one before authoring new graphs**, or the
> federalism content is authored twice. See §9.3 #4 for the recommendation.

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

### 6.6 The action-library shape (keystone confirmed across 4 eras; modern adds 2 more libraries)

**Architectural call — now corroborated across a FOURTH era, and the leverage is
higher than ever.** Batch 1 (`gilded`) revealed **four parallel action libraries**;
batch 2 (`fed`) observed the same governor / executive / convention / diplomacy
libraries; batch 3 (`modern`) observes all four *again* **and adds two more**:
**primary actions** (2.9.1) and **general-election actions** (2.9.4), plus the
SCOTUS docket is itself a small action surface (compel-vote / compel-retire /
delay) and diplomacy gains modern rows (provoke-with-tariff). **Six libraries
across four eras converging on the same `{ id, isAvailable, resolve, persistence }`
shape is the strongest possible signal — the `ActionRegistry<Ctx>` keystone (K2)
is now the single highest-leverage architectural decision in the roadmap.**
Building each library ad-hoc is now a **~6× tax**, not 4×. The libraries differ
only in *which rows* are active per era (a per-era registry index handles this) and
in *context type*.

| Library | Forum location | Codebase target |
|---|---|---|
| Governor's actions (~14 named actions, era-flavored) | gilded §11.3 (134-150); **fed** 33-558; **modern** 17-28, 1962, 2234 (4 eras) | `runPhase_2_5_2_Governors` (`phaseRunners.ts:3382` — currently a 10-line passive `bias` nudge) |
| Executive actions (Swing-around-the-circle; **fed** Monroe Doctrine / Abolish Debt; **modern** Strict Immigration / Ban Foreign Aid, gated by prereq policy/govt type, blunder rolls) | gilded §14.1 (201-203); **fed** 46-575; **modern** 100-104, 729, 1390 | `runPhase_2_8_1_Executive` (`phaseRunners.ts:3632` — currently 4 hardcoded one-shots in an array; confirmed) |
| Inter-ballot convention actions (Force Rules Change, Presidential Promise, Drop & endorse, Kingmaker interference, Ballot shift) | gilded §15.3.3 (230-246); **fed** 231-247; **modern** 367-398, 1705-1724 | currently no convention engine at all (`engine.ts:69` logs "ratifies the primary winners") |
| Diplomacy actions (Increase Relations, Increase Trade, Extend Credit; **modern** Provoke-with-tariff/embargo → chance of WAR) | gilded §13.3.2 (198); **fed** 45-572; **modern** 97-99, 1375, 2040 | `runPhase_2_7_1_Diplomacy` (`phaseRunners.ts:3585` — confirmed passive 20% drift) |
| **Primary actions (NEW, modern)** — Embrace Issue, Campaign Focus, Major Speech, **Attack**, **Presidential Promise** (rejectable), Withdraw+endorse | **modern** 340-366, 980-1062, 1646-1704 | no primary loop today (phase 2.9.1 + `presPrimary` `ElectionContext` exist, `types.ts:697`) |
| **General-election actions (NEW, modern)** — Give a Speech, Send VP to Shore Up, Incumbent Using Power of Office, Help from the Media, Focus on a Region; + 3 Presidential Debates | gilded §16 (256-265); **fed** 414-609; **modern** 412, 1726-1739 | no action phase in the general today (`runPhase_2_9_4` is a pure tally, `phaseRunners.ts:3752`) |

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
six libraries**, instead of 6 ad-hoc parallel registries. The advantages:

- One UI component (the "Action Picker") renders against any registry.
- One JSON-serializable shape for save-game persistence (the active-actions
  list is just `{ registryId, actionId, params }[]`).
- New eras add actions by appending registry rows — no engine code per action.
- Forum-confirmed action set now maps cleanly into ~45 rows across 6 registries
  vs. ~45 distinct `if (action === 'foo') { … }` branches in 6 different
  switch statements.

The libraries differ only in **context type** (`StateId` for governor,
`undefined` for exec, `BallotState` for convention, `NationId` for diplomacy,
`PrimaryGroup`/candidate for primary, target-`StateId` for general) and
**persistence semantics** (only exec actions are durable). A single ~80-line
`ActionRegistry` type captures both.

> **Risk if we don't unify.** Each library will accumulate its own ad-hoc shape
> (governor's prereq table, exec's deactivation conditions, convention's
> momentum effects, diplomacy's preconditions, the primary/general roll tables).
> Save-game persistence and UI picker code will be **sextupled**. Engine purity
> is unaffected either way, but the surface area grows ~6× without the registry.
> **K2 is the call to make first** if only one keystone lands. See
> [§9](#9-build-sequencing-advice) for sequencing.

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

#### 6.7.3 Action library (governor / exec / convention / diplomacy / primary / general)

1. Define the `GameAction<Ctx>` shape **once** in `src/engine/actionRegistry.ts`
   (§6.6). Reuse for **all six** libraries (the two modern additions are primary
   actions and general-election actions).
2. Author rows in `src/data/governorActions.ts`, `src/data/executiveActions.ts`,
   `src/data/conventionActions.ts`, `src/data/diplomacyActions.ts`,
   `src/data/primaryActions.ts`, `src/data/generalElectionActions.ts`.
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

> **For federalism, Gilded-Age and later eras.** The pipeline already covers every
> legislator through 2024 (the YAML source is canonical) — the dataset is *already
> valid* for federalism and the Gilded Age. `fed` confirms this empirically: the
> marquee federalism rookies (Jackson, JQA, Clay, Monroe, Burr, Gallatin) all
> enter via **normal draft classes** in the 1788–1808 window (`fed` 118, 510,
> 638), exactly as the `draftYear ≈ birthYear + 25` rule predicts. The per-era
> *drafting ideology profile* (gilded: Lib/Mod → Prog/Lib; federalism: a heavily
> Mod/Cons era where "those [LW] ideos don't really matter", `fed` 136) is **not**
> in the dataset — it is a per-(faction, era) tunable that lives on the
> **faction**, not the politician — best modeled as a small registry
> `FACTION_DRAFT_PROFILES: Record<FactionId, Record<Era, IdeologyProfile>>`. The
> 1856 `eligibleIdeologies` (`factions1772.ts:12` for 1772) is the seed of this
> for one era.

> **Batch 3 — the dataset RUNS OUT in deep-modern (scaling wall a).** The YAML
> source covers real legislators through ~2024, but the `modern` campaign played
> *past* the real-person supply and the GM **switched to procedurally generating
> rookie classes** (~188 pols/class). So the author-time pipeline above is
> **necessary but not sufficient** for late-era play: there must also be a
> **runtime, seeded procedural generator** (debt #19) that emits draft classes
> when the dataset is dry. It is a *sibling* of this pipeline conceptually but
> lives in `src/engine/` (pure, uses `rng.ts`), produces `ImportedDraftee` rows
> (`types.ts:1780`), and reuses the same `instantiateDraftees` path
> (`phaseRunners.ts:114`). Requirements: a stat/ideology/trait/demographic
> distribution (GM wanted "some moderates"), a **plausible, ethnically-varied,
> toggleable name engine** (players rejected silly names), and procedural
> portraits (A1) for the generated tail — which is why this is the **bridge to the
> presentation track's portrait epic (P2)**. The same generator answers
> "auto-generate filler officials for sparse new states" (#43) and BUG-3's
> stopgap-officer need. This is **near-term on the roadmap** (engine Phase-1),
> not deferred to the modern epic — see §9.

---

## 8. Tech debt & risks

| # | Issue | Location | Impact / fix |
|---|---|---|---|
| 1 | **Raw `Math.random` in election scoring** | `phaseRunners.ts:3711` (`calcStateVote`'s `(Math.random()-0.5)*8` jitter) | The flagship determinism leak — every state vote is unseeded. Blocks reproducible elections (and any future replay/multiplayer sync). Route through `rng.ts`. |
| 2 | **Raw `Math.random` elsewhere in the engine** | draft rookie fallback gen `phaseRunners.ts:188-198` (8 calls); generic-war enemy power `:3603`; `calcStateVote` jitter `:3711`; `revolutionaryWar.ts:89,97`; `continentalCongress.ts:271` | Same class of bug. **14 raw calls across the engine** (verified: 11 in `phaseRunners.ts` incl. #1; 2 in `revolutionaryWar.ts`; 1 in `continentalCongress.ts`). `eraGraph.ts` is already clean — its only `Math.random` mention is the "no Math.random" comment at `:8`. Migrate all to `rng.ts` wrappers as part of the seeding work. |
| 3 | **`rng.ts` is not actually seeded** | `rng.ts:1-5` | The wrappers exist but wrap `Math.random`. Determinism is *aspirational* until a real PRNG (e.g. mulberry32/xoshiro) is dropped in and a seed is stored on `GameState`. Prerequisite for replay + multiplayer. |
| 4 | **No `DB_VERSION` migration path** | `db.ts:60`; `repair()` `GameContext.tsx:91` | All migration is app-side `repair()`. Fine for additive fields; **a store-level change has no precedent** and would need a real `idb` upgrade. `repair()` also grows unbounded — each f4c7c2c4 delta adds another block. |
| 5 | **`nationalism`/`modern` eras are partly inert; enum likely needs `gilded`+`progressive`** | only transition is `constitutionalConvention.ts:198` (`→ 'federalism'`); `Era` `types.ts:1337` | `Era` has 4 values and rules consts key all 4, but **no runtime path enters `nationalism` or `modern`** — 1856 *starts* in `nationalism` and never advances. The `modern` era is now the **best-documented unbuilt era** (2276-post spec) but is wholly inert. The forum frames a Gilded Age *and* a progressive era *and* the modern arc → the enum likely needs `gilded` + `progressive` between `nationalism` and `modern`. Content-gating must key off the **era enum, not literal year** (alt-history clock). New eras need content + a transition trigger + the enum value. See K3/K4 in §9. |
| 6 | **Snapshot is single-deep-cloned per action** | `GameContext.tsx:302` etc. (`JSON.parse(JSON.stringify(snapshot))`) | Whole-snapshot clone + whole-snapshot `saveSnapshot` (`db.ts:123` writes every store every time) is O(everything) per action. Fine at current sizes (~hundreds–thousands of politicians); a concern as the dataset/era count grows. Multiplayer makes it worse — multiple players poking state. |
| 7 | **Engine `switch` + `GameContext` action duplication** | `engine.ts:25`; `GameContext.tsx` actions | Each interactive phase is wired in two places (engine discriminant + context handler + App effect). Adding phases is mechanical but spread across files — easy to half-wire. The 4 action libraries (§6.6) would compound this if not registry-unified. |
| 8 | **Per-game dataset stored on the save** | `game.customDraftClasses` (`types.ts:1631`) | User-imported draftees travel inside the snapshot, so they bloat every autosave/export. Acceptable now; watch as datasets grow. |
| 9 | **Hard-coded `ERA_GRAPH_1772` import** | `eraGraph.ts:4` (import) + `:73, :113, :148, :164` (call sites) | The walker only knows the 1772 graph — **5 spots**, not 2. Generalizing to `ERA_GRAPHS: Record<Era, GraphNode[]>` is the gating step before any new-era event content can be authored. See §9. |
| 10 | **Singleton `playerFactionId` / `isPlayer`** | `types.ts:1303`, `:1566`; every "is this me?" call site (`eraGraph.ts` `playerControlsDecider`, faction-scan gates in `phaseRunners.ts`, autoNav effects in `App.tsx`) | Single-player assumption baked deep. Multiplayer flips this to a set; mechanical refactor once the helper exists, but **wide** and **hard to do safely without a seed** (multiple players, unseeded RNG ⇒ desync). See §9. |
| 11 | **Bill scoring divergence (forum ±50/100/150 per card vs shipped `factionCenter` × 0.03)** | `phaseRunners.ts:1516` (`cardVoteBias`) vs digest §12.8 / post 237 | One of the three design divergences in mechanics §19.1. The shipped scorer summarizes a faction by one `factionCenter` index; the forum scores **every** ideology+lobby+interest card per bill. **This is debt only if we plan to migrate** — see the call in §9. |
| 12 | **Carpetbagger trait grant divergence** | `phaseRunners.ts` (`relocationOdds` 4-step ladder for trait grant) vs digest §6.2.x / post 36 | Forum **auto-grants** Carpetbagger on alt-state moves; shipped engine rolls per-band. Same caveat as #11 — debt only if we migrate. The forum behavior is arguably more legible to the player. |
| 13 | **Conversion-targeting divergence** | `phaseRunners.ts` `CONVERSION_ODDS` (`types.ts:268`) vs digest §6.4.x | Shipped engine uses a multiplicative willingness table keyed on fit/PV/Loyal/Opportunist; forum gates strictly on `Can Party Flip` (cross-party) and `Pliable + adjacent ideology` (same-party) with hard 5/10/15% base rates. Same caveat. |
| 14 | **Era-event scheduling divergence (batch 2, #4)** | `coreSpine` graph (`eraEvents1772.ts:23`; `selectEraGraphNode` `eraGraph.ts:107`) vs mechanics §21.7 | The shipped `coreSpine` fires nodes regardless of any roll; the forum sorts by historical year and rolls each per half-term up to a per-era cap with spill. **Different sequences — a genuine fork, not additive.** Resolve *before* authoring federalism graphs (else authored twice). See §9.3 #4. |
| 15 | **Per-state EC method divergence (batch 2, #5)** | `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`) vs mechanics §21.2 | Shipped resolves *every* state by popular vote; federalism needs legislature-chosen states (CT/GA/MA/NJ/NY/RI/SC in 1796) awarding EV by seated-legislature majority. Needs `State.electionMethod`. Debt the moment a federalism/1800 scenario ships. See §9.3 #5. |
| 16 | **Generic war resolver divergence (batch 2, #6)** | `runPhase_2_7_2_Military` flat `milPower×10 + d100` (`phaseRunners.ts:3593-3627`, incl. `Math.random` at `:3603`) vs mechanics §21.1 | Shipped non-Rev-War wars use a flat one-roll resolver; forum uses additive per-battle Chance-of-Success + warscore/momentum/×2 resolution + a confirmation cascade. The rich path exists *only* for the Rev War (`revolutionaryWar.ts`). Generalize one `War` model. See §9.3 #6. |
| 17 | **Cabinet wipe-on-election (divergence #8) — CORRECTED: there IS a wipe** | unconditional clear at `phaseRunners.ts:3804-3812` in `runPhase_2_9_4_PresidentialGeneral`; re-fill at `:2166` next turn | **Batch-3 correction of a batch-2 error.** Earlier note claimed "no wipe exists" — wrong; it missed the election-phase loop. The cabinet is vacated and cleared after **every** presidential general (even on incumbent re-election), then re-staffed from scratch at 2.3.1 next turn. The fix is **replace the wipe with retention** (keep ≤5, CIA/FBI exempt) **gated by `firingPrecedentSet` + per-officer tenure + same-faction US-Bank guard** — **M, not S**. See §2.1.1 grounding note. |
| 18 | **SCOTUS is a stub (divergence #7), not a system** | court ruling `phaseRunners.ts:3398-3414` (4 hardcoded titles, `partyPreference ±0.1`); retire/backfill `:3648-3671` | The shipped court has the *entity* (`supremeCourtIds`/`chiefJusticeId`, `types.ts:1584`) but no docket, per-case effects, compel-vote/retire, dynamic size, or ruling→law-deactivation. Modern #52 is a from-scratch SCOTUS module — there is no balance-tuned court to preserve, so framing it as a "replacement" overstates what ships. Gates BUG-2 (`Chisholm` needs amendments). M–L. |
| 19 | **Dataset exhaustion (scaling wall a)** | runtime load `standardDraftClasses.ts:13`; finite ~18.5k JSON | The real-person dataset **runs out in the deep-modern era** → no draft pool for late-era play. Needs a **runtime, seeded procedural pol generator** (`src/engine/`, emitting `ImportedDraftee` rows, reusing `instantiateDraftees` `phaseRunners.ts:114`). Also fixes "sparse new states need filler officials" (#43) + BUG-3 stopgap. Connects to portraits (A1). **Needed for ANY late-era play.** M–L. |
| 20 | **House bloat → manual-staffing tedium (scaling wall b)** | no slate/committee persistence across cycles; election + committee phases re-run from empty each cycle | Wyoming-Rule House ~572–601 (Senate 106) makes the manual House-election + committee-staffing phases unbearable — **a player quit over it**. Needs **persist + carry-forward/auto-fill** of House slates + committee rosters on the snapshot. **Near-term** (improves 1856's 31-state congress too), not modern-only. M. |
| 21 | **DH-1: filibustered "MUST-pass" bill has no rules remedy** | no deadlock rule (filibuster itself unbuilt); `modern` 640-716 | A GM-confirmed **design hole** (rules, not code): when a required bill is filibustered to death the rulebook has no answer (GM improvised a 4-leader special-committee auto-pass with a per-day "shutdown" penalty clock). **Rules must be *authored* (a PM/design task) before this can be built.** Couples to the filibuster epic + investigation-committees (#54), which is likewise under-designed. |
| 22 | **DH-2: modern era-deck fired off-year cards** | possible scheduling defect; reconcile with BUG-1 + the §6.4 scheduling fork; `modern` 2221 | In ~2018 the deck pulled 2008-era cards. **Reported, not verified** — could be intended shuffle/backlog or a real defect. Resolve **together with divergence #4 (era-event scheduling)** and BUG-1's era-lock filter, since all three are the same scheduling surface. |

### 8.1 Confirmed shipped bugs + GM-confirmed design holes

Three code defects (`BUG-*`, surfaced by `fed`) and two GM-confirmed design holes
(`DH-*`, surfaced by `modern`). **`BUG-*` are fixes, not features** — small and
high-value, and BUG-1 is a hard blocker the moment a federalism/1800 scenario
ships. **`DH-*` are *rules gaps*, not crashes** — the forum rulebook had no answer
and a human improvised; **the rules must be *authored* (a PM/design task) before
they can be built.** Verified against the codebase where quick.

| Bug | Location (verified) | Fix | Size / when |
|---|---|---|---|
| **BUG-1** — era events never deactivate by era for non-1772/1856 start years (an 1800-start wrongly loses the Louisiana Purchase; stale events also dilute the roll table) | `buildEraEventsForYear(snap.game.year)` is called with **no era-vs-start-year filter** at `phaseRunners.ts:2817`. Latent today (only 1772/1856 ship; the 1772 graph path at `:2801` is separate), but a blocker once a 3rd scenario lands | Add an "era-lock" filter: an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table (`fed` 524-535). **Resolve together with DH-2 and divergence #4 — same scheduling surface.** | **XS.** Land *before/with* the federalism scenario — it directly gates it. |
| **BUG-2** — `Chisholm v. Georgia` needs an "11th Amendment not ratified" gate | **No SCOTUS case data contains it** (grep: 0 hits in `src`). This is a *forward requirement on SCOTUS-case content*, not a live crash | When the federalism SCOTUS case file is authored, gate `Chisholm` on `!amendmentPassed('11th')`. Bundles into the SCOTUS subsystem (divergence #7). | **XS.** Bundles into SCOTUS content; needs the amendments field (#39). |
| **BUG-3** — no fallback when no viable PM-General candidate exists | `GeneralInChief` is a real seat (`types.ts:1121`, granted via `cabinetSeatsForYear` `:1145`) filled at `phaseRunners.ts:2255`; the **no-candidate path is uncovered** → potential crash | Define the empty-pool behavior (leave vacant + log, or auto-generate a stopgap officer — ties to procedural pol generation, scaling wall a). | **XS.** Defensive guard; do alongside the war/cabinet work. |
| **DH-1** — a filibustered "MUST-pass" bill has no rules remedy | Filibuster itself is unbuilt; no deadlock rule exists. GM improvised a 4-leader special-committee auto-pass with a per-day "shutdown" penalty clock (`modern` 640-716). **A rules gap, not a code bug.** | **Author the deadlock rule first** (forced-compromise vs shutdown-clock vs fallback auto-pass — a design call), then build it into the filibuster epic. | **Design task + S build.** Blocks the filibuster epic's completeness. |
| **DH-2** — modern era-event deck fired off-year cards (2008 cards in 2018) | Possible scheduling defect or intended shuffle/backlog (`modern` 2221). **Reported, not verified.** | Resolve **together with BUG-1 + divergence #4** (era-event scheduling) — all three are the same scheduling surface. | **Investigate within the scheduling-fork decision.** |

---

## 9. Build-sequencing advice

> **This section is written for the roadmap-planner to lift directly.** It is my
> engineering opinion on order, dependencies, and rough size/risk for the
> game-pm gap log (~55 rows across 4 eras + A1–A9 presentation), the design
> divergences (mechanics §19.1, now #1–#8), the confirmed bugs, and the GM design
> holes (DH-1/DH-2). Source: codebase + `gilded` + `fed` + `1772s` + `modern`.
>
> **Batch-3 changes to the plan.** The modern subsystems are **mostly the FAR end**
> (the deep-modern era builds last — it depends on every keystone and most
> subsystems). But the `modern` thread surfaced **cross-cutting / near-term items
> that must be pulled forward**, and that is the main re-sequencing this batch:
> 1. **Meter-model generalization** — the named meter bank is a *widening* of
>    `NationalMeters` (1:1 field map), so the ±3-clamp + crisis/cascade is a
>    near-term, cheap engine win that benefits every era (not a modern-only relabel).
> 2. **Procedural pol generation (scaling wall a)** — needed for *any* late-era
>    play and for sparse-state filler + BUG-3; ties to the portrait epic. Pull
>    forward as a mid-roadmap engine epic.
> 3. **Persist/auto-fill House slates (scaling wall b)** — a near-term **UX wall**
>    that improves every era's congressional phases (1856 already feels it). Pull
>    forward.
> 4. **Era-enum growth + year-decoupling** — folds into K3/K4; the alt-history
>    clock makes year-based content-gating wrong.
> 5. **K2 leverage rose to ~6×** (two more action libraries) — K2 is now the
>    single most important keystone.
>
> The **two-track structure (engine ‖ presentation) is unchanged** and remains the
> biggest schedule lever. The ordering below is explicit about **near-term vs. the
> far-end modern-era epic**.

### 9.1 Keystones (do these in order before any per-system work)

Six **foundation pieces** unblock everything else. They are cheap relative to
their leverage, and each later epic builds on at least one of them. Batch 2 adds
one new keystone (the ideology→color palette, K1.5) and **re-confirms** the rest
(`fed` corroborated the action libraries and the era-transition gap across a
second era).

| Order | Foundation | Size | Why first |
|---|---|---|---|
| **K0** | **Seed the RNG** (replace `Math.random` in `rng.ts:5` with mulberry32/xoshiro; store `seed`+state on `GameState`; migrate the **14** raw `Math.random` engine calls — debt #1–#3) | **S–M** | Determinism is the **prerequisite for multiplayer** (clients/turns must agree on roll outcomes) and for any future replay/test harness. Mechanical, but touches many files — do it before the codebase grows further. The generic-war (`:3603`) and election (`:3711`) leaks get fixed *for free* here. |
| **K1** | **`State.policies` + `State.electionMethod` data shapes** (`State`, `types.ts:1318`; repair() backfill `{}` / `'popular'`) | **XS** | `policies` is load-bearing for gov actions, era events, bill effects, scoring. `electionMethod` is the precondition for the per-state EC method (divergence #5). Bundle them — both are one-line additive `State` fields with trivial backfills. |
| **K1.5** | **Ideology→color palette** (`IDEOLOGY_COLORS: Record<Ideology, string>` in `src/theme/`) — *presentation-track* foundation | **XS** | A tiny **cross-cutting** asset that **many presentation items depend on** (roster, congress, maps, score sheets, committee views — A2/A3/A7). `Party.color` exists (`types.ts:1310`) but the per-*ideology* legend does not. Doing it first lets the whole presentation track build against a stable palette. Independent of the engine track — can land immediately. |
| **K2** | **The `ActionRegistry<Ctx>` type** (§6.6) — one shape for governor / exec / convention / diplomacy / **primary / general** actions, in `src/engine/actionRegistry.ts` | **S** | Now **confirmed across 4 eras**; `modern` adds a **5th and 6th** library (primary + general-election actions). Building each ad-hoc is now a **~6× tax**. A single ~80-line type unifies them + one UI Action Picker + one persistence shape. **The single highest-leverage keystone — if only one lands this quarter, it is K2.** Do it before any library. |
| **K3** | **`advanceEra(snap, target)` keystone + era-content registry + year-decoupling** (lift the 5 `ERA_GRAPH_1772` spots in `eraGraph.ts` to `ERA_GRAPHS: Record<Era, GraphNode[]>`; generalize `constitutionalConvention.ts:198`'s hard-coded `currentEra = 'federalism'` to a callable transition with hooks for **points-reset**, card-pool swap + **per-era card-count rescale**, nation renames, draft-profile shift, party-formation; **gate content by `currentEra`, not literal year**) | **M** | Today the **only** era transition lives inside a constitutional-convention finisher. `fed` (post 518) *and* `modern` (post 1080/1172, with card-count rescale + era-end awards) confirm a **live era transition** is real and load-bearing. The alt-history clock (`modern`: fictional eras ~10yr behind real tech) makes **year-based content-gating wrong** — gate by enum. Debt #5 and #9 dissolve here. |
| **K4** | **Era enum widening + first new scenario** (add `gilded`/`progressive` to `Era` (`types.ts:1337`) as the timeline needs; fill every `Record<Era, …>` rule table the TS exhaustiveness check flags; add the scenario builder) | **M–L** | Once K3 lands, this is mostly content. The TS `satisfies Record<Era, …>` is the safety net — missing rows are compile errors. The enum **will grow** (`modern` frames Gilded + progressive + modern as distinct eras). **See §9.1.1 for which scenario goes first (federalism, not gilded; modern is dead last).** |

**The dependency chain**: K0 → (K1 ‖ K2 ‖ K3) → K4 → per-system work.
K1.5 is **off the critical path entirely** (presentation track) — land it
whenever. After K0, K1+K2+K3 are independent and parallelizable across PRs.
K4 depends on K3.

#### 9.1.1 Reconciling federalism vs. the `advanceEra` keystone — and which scenario is first

Batch 2 makes the **federalism era a buildable spec** (`game-mechanics.md` §20)
*and* surfaces a confirmed era-transition gap. Two facts decide the sequencing:

- **The only wired transition is `1772 → federalism`** (`constitutionalConvention.ts:198`).
  There is **no `nationalism → gilded`** transition and **no scenario that boots
  *into* federalism**. So federalism is reachable *only* by playing a 1772 game
  all the way through the Constitutional Convention.
- **The federalism spec wants a mid-government boot like 1856** (`fed` 1, 14):
  pre-seated Washington administration, start past the draft at a governance
  phase. That is the **`scenario1856` template** (`scenario1856.ts:177-193`), not
  the `advanceEra()` path.

**Recommendation — do both, in this order, because they serve different jobs:**

1. **`scenario1788.ts` (mid-government boot) is the cheaper, higher-value first
   step.** It reuses the proven `scenario1856` shape, needs no era-transition
   plumbing, and gives playtesters a federalism game immediately. It is the
   fastest way to validate the federalism content (roster, era-event spine, SCOTUS
   set, draft profile). **This is the federalism epic's entry point.**
2. **`advanceEra()` (K3) is still needed** for the *continuous-campaign* mode the
   forum actually plays (1772/1800 → federalism → nationalism → gilded with
   points-reset at each boundary, `fed` 518). It is the durable, era-agnostic
   path; the hard-coded `→ federalism` line becomes its first caller. Build it as
   a keystone, but the **federalism *content* can ship behind `scenario1788`
   before `advanceEra` is fully general**.

So: **federalism content rides `scenario1788` first (no `advanceEra` dependency);
`advanceEra` lands in parallel as the keystone that makes the content reachable
in continuous-campaign mode too.** This also means **K4's "first new scenario" is
`scenario1788`, not `scenarioGilded`** — federalism sits *between* the two built
scenarios, is the best-documented unbuilt era, and exercises the most
cross-era systems (generic war, per-state EC, amendments, firing-precedent,
bill-driven statehood) that the roadmap needs anyway. Gilded follows once
`advanceEra` + the action libraries are mature.

> **Bug-1 is a hard gate on federalism.** The moment a 3rd scenario (1788/1800)
> ships, BUG-1 (`buildEraEventsForYear` era-filter gap, `phaseRunners.ts:2817`)
> stops being latent and starts dropping/leaking era events. **Fix BUG-1 in the
> same epic as (or just before) `scenario1788`.**

### 9.2 Major subsystems (do these after the keystones)

Slot the heavyweights. Within each row I call out the keystones it depends on so
the planner can build a DAG. **Bold = new or re-scoped in a later batch.** Rows
tagged **[NEAR-TERM, batch 3]** are cross-cutting items the modern thread
surfaced that should be pulled forward; rows tagged **[FAR-END, modern epic]**
are deep-modern subsystems that build last.

| Subsystem | Forum location | Size | Depends on | Notes |
|---|---|---|---|---|
| **Federalism era (`scenario1788` + content)** — mid-government boot, 10-faction roster + nickname relabel, era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events, Mod/Cons draft profile, federalism SCOTUS set | mechanics §20; `fed` | **L** | **BUG-1**, K1 (electionMethod for the per-state EC the era needs); benefits from K3 but does **not** block on it (see §9.1.1) | The **highest-value batch-2 epic**: it is the best-documented unbuilt era, sits between the two built scenarios, and exercises the most cross-era systems. Boot via the `scenario1856` template. Pulls in several rows below (generic war, per-state EC, amendments, bill typing). |
| **Convention machinery (2.9.2)** — multi-ballot loop, momentum, unit-rule, inter-ballot actions, VP-impact check, 5-plank platform + comparison, scandal rolls, faithless electors, host-advantage, PL-VP-override, post-election scoring | gilded §15.3 (211, 220-267); **fed** 231-247, 580-606 (corroborated) | **L–XL** | K0, K2 | Still the **single biggest unbuilt subsystem**. Replaces the `engine.ts:69` one-liner. Needs the action registry (inter-ballot actions) + the RNG seed. `fed` adds **host-advantage** ("rigged in my favor") and **party-leader-overrules-VP**. Wire into `needsPlayerInput: 'convention'` (`engine.ts:9`) with a richer payload. |
| **Governor's actions library (2.5.2)** — ~14 named actions, era-flavored, d100 vs 20·governing, per-action prereqs | gilded §11.3; **fed** 33-558 (corroborated, 3 eras) | **M** | K1, K2 | Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Actions read & write `State.policies` (K1). Era-flavored row sets are a per-era registry index. |
| **Executive actions library (2.8.1)** — persistent active actions, `Easily Overwhelmed` VP hand-off, green/yellow auto-deactivate-on-admin-change | gilded §14.1; **fed** 46-575 (corroborated) | **M** | K2; needs an **admin-change hook** (presidency change) for the auto-deactivate sweep | Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. Persistent state on `GameState.activeExecutiveActions`. `fed` adds the **control-handoff chain** (Incompetent Pres → VP → Manipulative advisor) with an undefined multi-manipulator tie-break (open Q). |
| **Diplomacy actions library (2.7.1)** — Increase Relations / Trade / Extend Credit; per-power meters with era roster + renames | gilded §13.3; **fed** 45-572 (corroborated) | **M** | K2 (action shape); diplomacy shape already right (`GameState.diplomacy` is `Record<string, number>`) | `fed` confirms the **era-dependent power roster** (5 in federalism: UK/France/Spain/Prussia/Russia; 6 in gilded +China; Prussia→Germany 1871). Couples to the national-surplus integer (Extend Credit adds debt). |
| **Generic cross-era war system** — additive Chance-of-Success per battle, warscore/momentum/×2 resolution, confirmation cascade (defeated commander → Incompetent + fired → Senate-confirmation drama) | mechanics §21.1; `fed` 222-573, `1772s` 20-60 | **M–L** | K0 (lots of rolls); **BUG-3** (no-PM-General fallback is in this blast radius) | **Divergence #6.** Generalize one `War` model usable in any era; replace the flat resolver (`phaseRunners.ts:3593-3627`) and **fold the 1772 Rev-War loop in as one configured instance** (`revolutionaryWar.ts`). Outcome grants/denies territory (couples to bill-driven statehood). Pairs with the A4 battle-card UI (presentation track). |
| **Per-state presidential-election method** — `State.electionMethod` resolved from seated-legislature majority for legislature-states; flip per-state by event, globally by amendment | mechanics §21.2; `fed` 194-373 | **M** | K1 (the field), amendments (global flip) | **Divergence #5.** Diverges from `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`). Federalism *needs* it (CT/GA/MA/NJ/NY/RI/SC start legislature-chosen in 1796, decisive). Best landed *with* the federalism epic. |
| **Constitutional amendments durable state** — `GameState.amendments`; **cross-state ratification vote** (can fail); bill-of-amendment type; effects on term-length / popular-vote-everywhere / VP-vacancy / suffrage / court-size | mechanics §21.3 (sharpens §14.2); gilded + **fed** (corroborated) | **M** | K0 | Sharpened in batch 2: the **ratification vote at the gov phase** and **failure case** (Christianity-as-religion rejected 9-7) are new. Couples to per-state EC (#5) and firing-precedent. Gates BUG-2 (`Chisholm` needs `!11th`). |
| **Bill typing + budget-gated spending cap** — `Bill.type` (Foundational/Spending/Crisis); numeric per-turn spending budget gating non-crisis spending bills at the floor; crisis-bypass; cabinet free-proposal slot | mechanics §21.6; `1772s` B4, `fed` 159-703 (corroborated) | **M** | K0; **national-surplus integer** (the cap reads it, not the ordinal `revenue`) | New `Bill.type` tag (none today, grep-confirmed). A bill can pass the floor and still be "BLOCKED DUE TO BUDGET." Prerequisite for crisis bills and the Hamiltonian financial program. |
| **Bill-driven statehood + auto-generated officials** — statehood/territory bills → `admitState`; event/war annexation; **generate filler pols** for sparse new states; organized/unorganized status | mechanics §21.5; `fed` 81-718 | **M** | bill typing (the bill route); generic war (war annexation); **BUG-3** shares the auto-generate-officials need | `admitState` exists (`territories.ts:8`) but is invoked only from 1772 era-event `postEffects`. Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories this way. |
| **Legislative micro-mechanics** — committee block-and-replace, bill packaging, filibuster (law-toggled), `(Crisis)` tag | gilded §12.4-§12.7; **fed** 159-730 (corroborated, pervasive) | **M each** | K0 (filibuster is a roll); committees already exist; crisis bills need the bill-type tag | 4 independent PRs. `fed` clarifies filibuster is a **standing rule toggled ON by a law** ("Institute Filibuster", 1792) and packaging has a **won't-bundle-net-negative-unless-statehood** rule. |
| **Era-event extensions** — multi-decider events, foreign-territory grants en bloc, census-driven EV deltas (decade N, effect N+2), state-policy side-effects, Egghead-cabinet advisory | gilded §10.4; **fed** 29-702 (corroborated) | **M** | K1, K3 | `Predicate` tree extends well (§2.1.1). Multi-decider widens `EraEvent.decider`. Census deltas need a `pendingEvDeltas` queue applied in 2.10 on `year % 10`. |
| **Cabinet & leadership richness** — region-coverage + diversity + intra-party-equity malus, state-status eligibility guard, Ministers-to-foreign-powers seats (era-keyed), Congressional 9-role pipeline (RCV whip races, committee-eligibility-by-prior-service, incumbent-protection-when-dominant, CPU auto-fill), faction-leader 6-criterion cascade + anointing | gilded §28-32; **fed** 3-681; **modern** 167-1873 (corroborated 4 eras) | **M–L** | K0 | `fed` + `modern` confirm the 9-role pipeline (six-ballot Pro Tem race; modern CPU auto-fill). The **6-criterion faction-leader cascade** is spec'd verbatim (`1772s`/`modern`). Ministers roster is era-keyed. **Includes the cabinet wipe→retention refactor — see next row.** |
| **Cabinet retention replacing the wipe (divergence #8 — CORRECTED)** — remove the unconditional cabinet clear at `phaseRunners.ts:3804-3812`; retain occupants (modern: keep ≤5, CIA/FBI exempt), add per-officer tenure (CIA/FBI/Fed-Chair/Key-Advisor terms) + `firingPrecedentSet` gate on *replacement* + same-faction US-Bank guard + opp-party cap | mechanics §19.1 #8, §21.4; `fed` 41-547; **modern** 587-2172 | **M** | cabinet richness (shares the code) | **Batch-3 correction:** there **IS** a wipe-on-election (`:3804`, fires every cycle incl. incumbent re-election) — batch 2 wrongly said there wasn't. This is a wipe→retention refactor, **M not S** (debt #17). Net behavior today: cabinet churns from scratch every 4 years — the *opposite* of forum intent. |
| **Faction-personality 5-step distribution + per-era card pool + draft profile** | mechanics §7.4; `1772s` B9 (algorithm) + gilded/`fed` (drift) | **M** | K3/K4 (era enum for per-era pool + draft profile) | `1772s` supplies the **full 5-step allocation** (adjacency rule, ≥5-pol top-up floor, lobby-activation-by-event) the gilded thread only saw as drift. Implement *alongside* the existing card-swap drift, not replacing it. |
| **Faction nickname / per-era relabel table** | mechanics §16.1.3, §20.2; **fed** 2-184 (dense) | **S–M** | K4 | `Faction.nickname` exists (`types.ts:1297`); nothing updates it. Authored names table per (party, era, ideology) gated by leader traits + player-edit override. Also `Party.formedYear`/`eraName` for party-formation events (federalism §20.5). |
| **Small consistency PRs** — old-age stat decay (separate from mortality), defeated-incumbent auto-retire (amendment-gated 6yr malus), auto-Carpetbagger (10yr expiry, alt-state moves exempt from cap), national-surplus integer, industry-leadership scoring, tariff integer + change-cadence | gilded §F; **fed** 52-331, `1772s` 3-90 (corroborated) | **XS–S each** | mostly — (surplus/industry read existing fields) | A grab-bag of cheap consistency wins. The **national-surplus integer** and **tariff integer** are prerequisites for the spending cap and the gilded/federalism economic axes respectively. |
| **[NEAR-TERM, batch 3] Meter-model generalization** — banded-text ladders over the existing 7 `NationalMeters` fields + crisis entry/exit by tier + cascade rules + top-of-ladder effects (Honest-Gov't-maxed kills Machines) + numeric debt integer + `metersToElectionBonus()` from the canonical "State of the Meters" table | mechanics §22.1, §22.2; `modern` 12-2230 (corroborated 4 eras) | **M** | K0; national-surplus integer (= the debt field) | **It's a WIDENING, not a relabel** — the bank maps 1:1 to shipped fields (§2.1.1). Do the ±3-clamp (the **meter-model divergence**, §9.3) here cheaply; the crisis/cascade rules benefit every era. The full labeled-ordinal *presentation* relabel can ride the presentation track separately. |
| **[NEAR-TERM, batch 3] Procedural pol generation (scaling wall a)** — a runtime, seeded generator emitting `ImportedDraftee` rows when the real dataset is dry; stat/ideology/trait/demographic distribution + plausible-ethnically-varied **toggleable name engine** | mechanics §22.11, #43, A1; `modern` 456-1771 | **M–L** | K0 (seeded RNG); reuses `instantiateDraftees` (`phaseRunners.ts:114`) | **Needed for ANY late-era play** (dataset runs out) AND for sparse-state filler (#43) AND BUG-3 stopgap. Lives in `src/engine/`, sibling-in-spirit to the `scripts/` pipeline (§7) but runtime. **The bridge to the portrait epic (A1/P2)** — generated pols need procedural portraits. |
| **[NEAR-TERM, batch 3] Persist + auto-fill House slates & committees (scaling wall b)** — store House candidate slates + committee rosters on the snapshot; carry-forward + bulk auto-fill by default | A9, mechanics §22.10; `modern` 115-1281 | **M** | repair() backfill for the new fields | **UX wall, not modern-only** — improves 1856's 31-state congress too; a player quit over the manual tedium at 53-state scale. The "computer owns the deterministic tedium" theme (also 1772-solo Lingering/Committees/Cabinet). Do **before** the deep-modern roster. |
| **Design-divergence resolutions** | mechanics §19.1 (#1–#8) + the meter-model item | varies | depends per item | See §9.3 — call per item. **#7 (SCOTUS) and #8 (cabinet wipe→retention) are batch-3 additions; the meter-model ±3-clamp is the near-term row above.** |

**[FAR-END, modern epic] — these build LAST (deep-modern era; depend on most of the above):**

| Subsystem | Forum location | Size | Depends on | Notes |
|---|---|---|---|---|
| **Modern era (`scenario1948`/continuation + content)** — the modern faction roster + nickname menu, modern era-event spine (fictional eras), modern bill/issue catalog (tariff-power-to-President, healthcare, climate, gun control), modern card pool | mechanics §22; `modern` (2276 posts) | **XL** | K3, K4 (+ enum: `modern` reachable), and most subsystems below | The richest unbuilt era, but **dead last** — it sits at the end of the timeline and depends on the meter bank, enthusiasm engine, primaries, convention, SCOTUS, war, and the scaling walls all landing first. Reached via `advanceEra` (continuous campaign) or a `scenario1948` boot. |
| **Presidential primary subsystem (2.9.1)** — candidate eligibility + blocking (Iron-Fist PL), focus-state trait table, Strength score, per-group debate/scandal/broke/action loop, delegate accumulation + transfer | mechanics §22.3; `modern` 340-1704 | **L** | K2 (primary actions), the **CPU delegate engine**, K0 | NEW (modern-only). Phase 2.9.1 + `presPrimary` context exist; no loop. A `needsPlayerInput: 'primary'` discriminant + a `primary?` runtime ledger. Pairs tightly with the convention subsystem. |
| **Enthusiasm / Party-Pref engine + Score economy** — the 4-part reshuffle after legislation scoring; `Faction.score` ledger; era-end awards; lowest-faction penalty | mechanics §22.2; `modern` 96-2039 | **M–L** | the meter-model generalization (above); K3 (era-end awards) | NEW driving algorithm over the existing `enthusiasm`/`partyPreference` tables. The spine of the modern election engine. |
| **SCOTUS named-Justice docket (divergence #7)** — per-term case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, Iron-Fist/Manipulative compel-vote + compel-retire (12-yr min, conditional bargain), dynamic court size + court-packing (age-70), 64/60% confirmation + moderate-auto-confirm recovery, appointee ideology reveal + 10-yr drift, ruling→law-deactivation | mechanics §22.7, #52; `modern` 30-2250 | **M–L** | K0; amendments (gates BUG-2 `Chisholm`); bill-typing (court-packing/set-count bills) | **From-scratch over a stub** (debt #18) — the shipped court is 4 hardcoded titles + `partyPreference ±0.1` (`phaseRunners.ts:3398-3414`). Not displacing a working system. Case content is per-era data. |
| **Third-party challenge trigger (2.9.3)** — party-pref-band + ideology-discontent check → spawn an independent ticket from the rule-selected faction; nationwide ballot for a Celebrity | mechanics §22.4, #48; `modern` 400-2116 | **M** | the enthusiasm/Party-Pref engine | NEW (modern). Two-party engine only today. Phase 2.9.3 exists (`phases.ts:41`) as a stub. |
| **Military-leadership appointment tier** — JCS/Army/Navy chiefs + Generals/Admirals above `GeneralInChief`; auto-confirm; promotion back-fill; rank-mismatch + resign rules; feeds the war engine's per-battle modifiers | mechanics §22.9, #49; `modern` 214-2182 | **M** | the generic war system (#45); cabinet richness | NEW (modern). Pairs with the generic-war epic — the ranks feed its Chance-of-Success terms (SecDef + Joint-Chiefs ×2, leading-officer ×10). |
| **53-state roster + Wyoming-Rule apportionment + two-home-state pols** — modern 53-state roster (DC/CU/PR); decennial recompute that resets EV + `bias` + focus-Rep; `Politician.homeStates?` | mechanics §22.10, #55, #34; `modern` 185-2240 | **M–L** | census-delta queue (batch 1); **scaling wall (b)** must land first (House bloat) | NEW (modern). `State.region` is partly ready (`types.ts:1322`). The Wyoming-Rule House size is *why* scaling wall (b) is a hard prerequisite. |
| **Modern legislative depth** — collective crisis-bill accountability, bill-relationship/replacement graph (amendment-tier bills repealable only by amendment), investigation special committees (#54), Executive-Branch-Interference | mechanics §22.8, #54, #12b; `modern` 32-2265 | **M** | bill typing; committees; **DH-1 + #54 need rules authored first** | Mostly extends the legislative micro-mechanics. **#54 (investigation committees) and DH-1 (filibustered MUST-pass remedy) are UNDER-DESIGNED — the forum left the rules blank; a PM/design task must author them before they can be built** (debt #21). |

### 9.3 Design divergences — keep shipped or refactor to forum?

Rules where the forum and the engine genuinely disagree (mechanics §19.1, now
**#1–#8**, plus the separate meter-model item). These are **decisions, not
feature-adds**. My defensible call per item. **Numbering matches mechanics §19.1:**
#1–#3 batch 1, #4–#6 batch 2, **#7 (SCOTUS) and #8 (cabinet) are batch 3**; the
meter model is its own unnumbered item (mechanics §21.8).

| # | Divergence | Recommendation | Rationale |
|---|---|---|---|
| 1 | **Bill scoring** — shipped: `factionCenter` × `cardBiasPerDelta 0.03` per matching card. Forum: ±50/±100/±150 per card per bill, summed across **every** ideology+lobby+interest card. | **Refactor to forum**, in two phases. **Phase A** (small): keep `cardVoteBias` as the **vote-probability** input (well-tuned for floor votes); add a separate `legislativeScoring(bill, faction)` points number on a new `Faction.score` ledger. Voting odds vs. leaderboard scoring are different jobs. **Phase B** (later): decide whether to re-tune `cardVoteBias` to be per-card-aware. | Forum ±50/100/150 is *scoring*, not *voting*. Shipped `cardVoteBias` is fine for probability and invasive to rebalance. Land the leaderboard first. **Size: M. Risk: low** (additive). |
| 2 | **Carpetbagger trait grant** — shipped: 4-step probability ladder. Forum: auto-grant on alt-state moves. | **Refactor to forum (auto-grant).** Same PR as ladder removal; add the 10-year expiry + alt-state-cap exemption (`1772s`). | More legible; removes a dial that doesn't carry weight. **Size: XS. Risk: low.** |
| 3 | **Conversion targeting** — shipped: multiplicative willingness table. Forum: hard gates on `Can Party Flip` (cross-party) / `Pliable + adjacent ideology` (same-party) + 5/10/15% rates. | **Keep shipped for now; revisit after the faction-personality drift rules are formalized.** | Both defensible. If the rule-driven personality system lands and emits `Can Party Flip` cleanly, the forum model gets attractive. Until then the shipped table works. **Size: M if changed. Risk: medium** (load-bearing dial). |
| **4** | **Era-event scheduling** *(batch 2, biggest 1772 fork)* — shipped: `coreSpine` precondition graph (`eraEvents1772.ts:23`; `selectEraGraphNode` `eraGraph.ts:107`) fires spine nodes regardless of roll. Forum: historical-year sort + per-half-term roll (`≤ %-to-fire`) up to a per-era cap, with spill into anytime-events. | **Decision for the human — but if undecided, keep the graph and *layer* the cap.** Concretely: keep `coreSpine` for the *causal* backbone (Gaspee→Committees→Tea Act), and add the forum's **per-half-term cap + probabilistic minor-event roll + spill** *on top* for non-spine nodes. This is closer to additive than a rewrite and preserves the strongest property of each model. | The two genuinely produce different sequences (`1772s` B1). A full switch to year-sort discards the graph's authored causality and the `Predicate` infrastructure (`evalPredicate`, counterfactual branches) that already works. The hybrid keeps both. **But flag it loudly: resolve before authoring federalism graphs**, or the federalism spine is authored twice. **Size: M (hybrid) / L (full switch). Risk: medium.** |
| **5** | **Per-state EC method** *(batch 2)* — shipped: `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`) resolves every state by popular vote. Forum: per-state legislature-vs-popular elector selection. | **Refactor to forum (add the mode).** It is a genuine historical mechanic that is *decisive* in early elections (CT/GA/MA/NJ/NY/RI/SC in 1796). Add `State.electionMethod`; legislature-states award EV by seated-legislature majority. | Not a balance dial — a fidelity feature federalism *requires*. Additive: popular-vote states are unchanged. **Size: M. Risk: low–medium** (touches the EC tally path). |
| **6** | **Generic war resolver** *(batch 2)* — shipped: flat `milPower×10 + d100` one-roll (`phaseRunners.ts:3593-3627`); rich battle system is Rev-War-only. Forum: additive Chance-of-Success + warscore/momentum/×2 + confirmation cascade, for *every* war. | **Refactor to forum (one generic `War` model).** Generalize the rich path; fold the 1772 Rev-War loop in as one configured instance. The flat resolver is a placeholder, not a designed alternative. | The forum model is corroborated across 2 eras and the Rev War already implements most of it — this is *consolidation*, not new design. **Size: M–L. Risk: medium** (touches both war paths; do after K0 so the rolls are seeded). |
| **7** | **SCOTUS model** *(batch 3)* — shipped: 2.5.3 picks 1 of 4 hardcoded titles + nudges `partyPreference ±0.1` (`phaseRunners.ts:3398-3414`); 2.8.2 age-≥75 retire + same-party backfill (`:3648-3671`). Forum: a named-Justice docket with compel-vote/retire, dynamic court size + packing, 64/60% confirmation, ideology reveal + 10-yr drift, ruling→law-deactivation. | **Build the forum subsystem from scratch** — there is **no balance-tuned court to preserve** (the shipped court is a stub, debt #18). Mechanics §19.1 calls it "a replacement"; verified, it is *net-new over a stub*, which is the easier case (nothing to migrate, just superseded). | Corroborated only in `modern` (1 era) but deeply specified. **Far-end** (deep-modern); case content is per-era data. Gates BUG-2. **Size: M–L. Risk: medium** (compel mechanics are intricate). |
| **8** | **Cabinet persistence** *(batch 3 — CORRECTS a batch-2 error)* — shipped: `runPhase_2_9_4_PresidentialGeneral` **unconditionally wipes the whole cabinet** after every presidential general (`phaseRunners.ts:3804-3812`), even on incumbent re-election; 2.3.1 re-fills from scratch next turn. Forum: **retain up to 5** (CIA/FBI exempt) with per-officer tenure + a firing-precedent gate. | **Refactor to forum (replace the wipe with retention).** Remove the unconditional clear at `:3804-3812`; keep occupants, add a `firingPrecedentSet` gate on *replacement* + per-officer tenure (CIA/FBI/Fed-Chair/Key-Advisor terms) + same-faction US-Bank guard + opp-party cap. | **The batch-2 "no wipe exists" note was wrong** (it missed `:3804`). This is a genuine wipe-vs-retention contradiction; the shipped behavior (cabinet churns every 4 years) is the *opposite* of forum intent. Corroborated across `fed` + `modern` (2 eras). **Size: M** (not the S batch 2 claimed). **Risk: low–medium** (touches the election→appointment handoff). |
| **(meter)** | **Meter model** *(batch 2 §21.8, sharpened by batch 3 §22.1)* — shipped: 7 numeric meters `[-5,5]` (`NationalMeters`, `types.ts:1399`). Forum: named/banded-ordinal meters + a **±3-per-phase swing cap** + crisis/cascade + numeric debt + a war-score meter. **Batch 3 confirms the bank maps 1:1 to the shipped fields** (§2.1.1) — it's a *widening*, not a new shape. | **Split the decision.** **Do now (cheap, orthogonal, near-term):** the **±3-per-phase clamp** + the **crisis entry/exit + cascade** rules (these benefit every era — see the near-term row in §9.2). **Defer (presentation):** the labeled-ordinal *relabel* touches every meter read + the UI; ride it on the presentation track. The war-score meter rides the generic-war epic (#6). | The ±3 clamp + crisis rules are balance/feel wins over the existing numeric fields with no model change. The labeled relabel is mostly presentational. **Size: XS (clamp) / M (crisis+cascade) / L (relabel). Risk: low / low / medium.** |

### 9.4 The presentation track (A1–A8) — a parallel workstream

Batch 2's `1772s` thread adds a **net-new product/UI surface** (`game-context.md`
A1–A8): procedural portraits, an ideology→color palette, sport-card infoboxes, a
styled scoreboard, battle-cards, election maps, era-correct office titles, legacy
lines, and a narration-voice bar. **Architectural opinion:**

> **A9 is NOT on this track.** The batch-3 `A9` (persist/auto-fill House slates +
> committee rosters) reads like a presentation item but is a **state-shape + engine
> UX requirement** (scaling wall b) — it persists new snapshot fields and changes
> the staffing phases. It lives on the **engine track** (§9.2 near-term row), not
> here. Batch 3 also *extends* A1 (the procedural-portrait system must cover
> *generated* pols, tying P2 to procedural pol generation) and A7 (the map renderer
> must auto-produce the 53-state map + per-state popular-vote atlas the modern GM
> hand-builds).

- **This is mostly independent of the engine queue and should run as a SEPARATE
  TRACK by a different workstream.** Almost all of A1–A8 are **read-only views
  over snapshot data that already exists** (roster, congress, war state, election
  results, office history). They don't depend on the keystones, the action
  libraries, or the era work — they depend on the *data already being there*,
  which it is. The single exception is A4 (battle-card additive-odds breakdown),
  which is most useful *after* the generic-war epic (#6) surfaces the itemized
  odds; build the card shell early, wire the real numbers when #6 lands.
- **It is several epics, not one.** Group them by surface and dependency:
  - **P0 — ideology→color palette (K1.5).** The cross-cutting foundation. **Do
    first** — A2/A3/A7 all consume it. XS.
  - **P1 — politician card + roster/congress restyle (A2, A3, A5, A6).** The
    "sport-card" infobox, the persistent scoreboard, era-correct office titles,
    honorific-memory/legacy lines. Small additive `Politician` fields (A6) +
    components. M.
  - **P2 — portrait pipeline (A1).** The chunkiest and most *different*: a
    procedural-portrait system for the ~18.5k long tail, **hard-constrained to
    CK2-style generated assets — no AI imagery or text in the shipped product**
    (`game-context.md` A1; AI only as a throwaway proof-of-concept). This is an
    asset-pipeline + layered-sprite renderer epic, closer to the dataset-pipeline
    (§7) in spirit than to the engine. It can proceed fully in parallel; the
    `Politician.portrait` field is the only engine-track touchpoint. L.
    **Batch-3 linkage:** P2 must cover **procedurally-generated** pols, not just
    the real dataset — the dataset runs out in deep-modern (scaling wall a), so
    P2 and the engine-track procedural-pol generator share the demographic model.
    The portrait system should consume the generator's demographic output. Don't
    build P2 assuming a closed real-person set.
  - **P3 — maps + iconography (A7).** Election-result maps + era-correct flags.
    Best *after* more states exist (gilded/modern), but the renderer can be
    prototyped on 1856. **Batch-3 raises the bar:** the modern GM hand-builds
    53-state yapms maps + a per-state popular-vote % atlas every presidential
    election — the build should **auto-generate** these. M.
  - **P4 — narration voice (A8).** A `log.ts` output-quality bar, not a schema
    change. Smallest; ongoing. XS–S.
- **Hard constraint to encode now:** the **no-AI-in-product** stance (A1) is a
  ratified-pending design call but should be treated as a constraint on the
  portrait pipeline from day one — building an AI-runtime portrait system and
  then ripping it out is the wasteful path.

> **Why a parallel track is the real lever.** The engine track (keystones →
> subsystems) is a long dependency chain bottlenecked on a few people who know the
> engine. The presentation track shares almost no code with it and can be staffed
> independently. Running them concurrently remains the single biggest schedule
> win. The only sync points are a handful of small additive `Politician`/`Party`
> fields (portrait, honorific/legacy lines, formedYear, homeStates) and two
> deeper handoffs: the **A4 battle-card ↔ generic-war** odds breakdown, and the
> **P2 portrait pipeline ↔ engine procedural-pol-generation** demographic model
> (P2 must render *generated* pols, not just the real dataset).

### 9.5 Multiplayer — last, with one caveat

**Multiplayer is still last**, but the action-library refactor (K2) changes the
planning. Specifically:

- **Hot-seat / sequential** multiplayer reuses the existing `needsPlayerInput`
  mechanism (`engine.ts:9`). It pauses mid-phase per decider — extend to
  round-robin across human factions before `advancePhase`. **But the
  player-input modalities are exactly the (now six) action libraries** + the
  primary/convention loops. Hot-seat needs those libraries to *exist as picker
  UIs* before it's coherent. **So: hot-seat goes after K2 + the libraries land.**
  `fed` + `gilded` + **`modern`** confirm solo and multiplayer are **two modes of
  one engine**, not two games (a `modern` player even *took over a CPU faction*
  mid-campaign and won the presidency) — the same `needsPlayerInput` round-robin
  serves both, and CPU is a true per-faction fallback + handover target.
- **Async forum-style** is a backend epic. IndexedDB is per-browser (`db.ts`);
  shared state needs a server (or CRDT/host-authoritative sync) the repo does not
  have today. Scope it as its own L–XL epic.
- **Determinism (K0) is hard-blocking for either model** — clients/turns must
  derive identical roll outcomes from the same seed.
- **Whole-snapshot clone + save** (debt #6) becomes a real bottleneck once
  multiple players are poking state. Expect to move to per-store/delta writes.

### 9.6 One-line ordering (for `roadmap.md`)

> **Two tracks run in parallel.** The **engine track** is the long dependency
> chain; the **presentation track** (A1–A8, *not* A9) shares almost no code and
> should be staffed separately (§9.4). Within a track, order is top-to-bottom.
> **Batch-3 change:** three cross-cutting items pulled forward into the engine
> track (meter-model generalization, persist/auto-fill House slates, procedural
> pol generation), and a **far-end modern epic** appended after gilded.

**Cheap fixes first (do immediately — XS each, high value):**
**BUG-1 (era-event filter, gates federalism) · BUG-3 (no-PM-General guard) ·
the ±3 meter-swing clamp (meter-model divergence) · auto-Carpetbagger (divergence
#2).** (BUG-2 rides the SCOTUS content; DH-1/DH-2 need rules authored first.)

**ENGINE TRACK — Phase 0 (keystones, parallelizable after K0):**
**K0) Seed the RNG → K1) `State.policies` + `State.electionMethod` shapes →
K2) `ActionRegistry<Ctx>` (now ~6× leverage — do first if only one lands) →
K3) `advanceEra()` + era-content registry + year-decoupling →
K4) Era enum widening (`gilded`/`progressive`) + `scenario1788` (federalism) —
NOT gilded/modern first (§9.1.1).**

**ENGINE TRACK — Phase 1 (subsystems, roughly this order to minimize rework):**
**1) Federalism era epic (`scenario1788` + content; pulls in #2-#5; needs BUG-1)
→ 2) Bill typing + spending cap (+ national-surplus/debt integer) →
3) Generic cross-era war system (divergence #6; needs BUG-3) → 4) Per-state EC
method (divergence #5) → 5) Amendments-as-state (gates BUG-2) →
6) Meter-model generalization [NEAR-TERM] (±3-clamp + crisis/cascade over the
existing `NationalMeters`; benefits every era) → 7) Persist/auto-fill House
slates & committees [NEAR-TERM — scaling wall b; UX, helps 1856 too] →
8) Procedural pol generation [NEAR-TERM — scaling wall a; needed for late-era +
sparse states + BUG-3 stopgap; bridges to P2] → 9) Convention machinery (uses K2;
biggest single subsystem) → 10) Governor's actions library → 11) Diplomacy actions
library → 12) Executive actions library → 13) Legislative micro-mechanics
(block-and-replace, packaging, filibuster) → 14) Era-event extensions
(multi-decider, census deltas, territory grants; resolve the scheduling fork
[divergence #4 + BUG-1 + DH-2] here) → 15) Cabinet & Congressional leadership
richness + **cabinet retention replacing the wipe (divergence #8 — M, not S)** →
16) Faction-personality 5-step distribution + per-era card pool + nicknames →
17) Small consistency PRs (old-age decay, auto-retire, industry leadership,
tariff integer) → 18) Bill scoring leaderboard (divergence #1) →
19) Conversion-targeting refactor (divergence #3, if pursued) →
20) gilded scenario (once `advanceEra` + action libraries are mature).**

**ENGINE TRACK — Phase 2 (FAR-END modern epic — builds LAST, after gilded):**
**21) Enthusiasm/Party-Pref engine + Score economy (over #6's meter bank) →
22) Presidential primary subsystem (uses K2 + the CPU delegate engine) →
23) SCOTUS named-Justice docket (divergence #7; from-scratch over a stub) →
24) Third-party challenge trigger → 25) Military-leadership appointment tier
(pairs with #3 war) → 26) 53-state roster + Wyoming-Rule apportionment +
two-home-state pols (needs #7 House-slate persistence first) → 27) Modern
legislative depth (collective crisis accountability, bill-relationship graph,
investigation committees [#54] + DH-1 — the last two need rules authored) →
28) Modern era scenario/continuation (`scenario1948`; the XL capstone).**

**PRESENTATION TRACK (parallel, different workstream):**
**P0) ideology→color palette (K1.5) → P1) politician card + roster/congress
restyle (A2/A3/A5/A6) → P2) procedural portrait pipeline (A1, no-AI-in-product;
covers GENERATED pols, shares the demographic model with engine #8) → P3) election
maps + iconography (A7; auto-generate the 53-state map + popular-vote atlas) →
P4) narration voice (A8).** (A4 battle-card wires its real numbers when engine #3
lands.)

**MULTIPLAYER (separate epic, last):**
**M1) Hot-seat sequential (depends on K2 + the action libraries) →
M2) Async / backend (separate L–XL epic).**

**The four most important calls for the planner:**
1. **#8/#7 reconciliation (corrects batch 2).** There **IS** a cabinet
   wipe-on-election (`phaseRunners.ts:3804-3812`) — batch 2 wrongly said there
   wasn't. **#8 is a real wipe→retention refactor (M, engine Phase-1 #15), not a
   small flag.** **#7 (SCOTUS)** is correctly a from-scratch subsystem, but over a
   *stub* (4 hardcoded titles + `partyPreference ±0.1`, `:3398-3414`) — nothing
   rich is being displaced; it sits at the **far end** (Phase-2 #23).
2. **The two scaling walls are NOT modern-only and sit in the NEAR-TERM band
   (engine Phase-1 #7 and #8), not the far end.** Persist/auto-fill House slates
   (wall b) improves 1856 now; procedural pol generation (wall a) is required for
   *any* late-era play and bridges to the portrait epic. Do not defer them to the
   modern epic.
3. **Far-end vs. near-term:** the deep-modern **subsystems** (primaries,
   enthusiasm engine, SCOTUS docket, 53-state roster, modern scenario) are the
   FAR end (Phase 2, after gilded). The **cross-cutting items they surfaced**
   (meter-model generalization, the two scaling walls, era-enum growth +
   year-decoupling) are NEAR-term and folded into Phase 0/1.
4. **K2 is now the single most important keystone** (~6× leverage across 6 action
   libraries); if only one keystone lands this quarter, it is K2. Federalism still
   comes before gilded before modern, and `scenario1788` (mid-government boot)
   before a fully-general `advanceEra` (§9.1.1).

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
