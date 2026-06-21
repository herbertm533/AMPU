# AMPU — Roadmap

> **Batch-2 version — re-sequenced into two parallel tracks.** This roadmap was
> first stood up from the codebase + tech-lead bootstrap advice (6 items), then
> rebuilt against batch 1 (`f4c7c2c4`, the 1868 Gilded-Age multiplayer dry-run →
> 14 items). It is now **re-sequenced for batch 2**, which absorbed two more
> threads: `f55d3e21` (a 732-post 1788 **federalism** solo-with-AI playtest — the
> spec for the unbuilt federalism era) and `85f8e6b4` (a 90-post 1772 solo
> "aesthetic experiment" — the source of the **presentation layer** A1–A8). Batch
> 2 **corroborates ~16 batch-1 deltas across a second era** (these are now
> HIGH-CONFIDENCE), adds 13 net-new rows, three new design divergences (#4
> era-event scheduling, #5 per-state EC, #6 generic war), three **confirmed
> shipped bugs**, and a large net-new **UI surface**.
>
> **The single biggest change vs. the batch-1 roadmap:** the work now splits into
> **two parallel tracks** — an **Engine track** (a long dependency chain) and a
> **Presentation track** (A1–A8, sharing almost no engine code). Running them
> concurrently with separate staffing is the biggest schedule lever available.
> Order within each track is binding from `technical-guide.md` §9.6 — **build
> top-to-bottom.**

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic (PR1–7)
is complete; the knowledge-base infra and two ingestion batches are knowledge
milestones (no code, but they are what every item below is traced to).

- **Batch-2 ingestion (knowledge milestone).** Absorbed `f55d3e21` (1788
  federalism, 732 posts) + `85f8e6b4` (1772 solo aesthetic, 90 posts). Gap log
  grew to ~54 corroborated rows + A1–A8 presentation + 3 confirmed bugs;
  `game-mechanics.md` gained §20 (federalism era) + §21 (cross-era mechanics) +
  §19.1 divergences #4–#6; `technical-guide.md` §9 re-sequenced into the
  two-track plan and §6.6 re-confirmed the action-registry keystone across 2
  eras. _Complete._
- **Batch-1 ingestion (knowledge milestone).** The four planner docs stood up
  and absorbed the `f4c7c2c4` 1868 Gilded-Age dry-run: gap log to ~41 rows,
  ~12 new `game-mechanics.md` sections, the `ActionRegistry` keystone identified,
  three design divergences resolved. _Complete._
- **PR7 — Lobbies → expertise → industry + faction ideology.** Lobby cards
  trickle expertise to members (2.1.2), `LOBBY_INDUSTRY` nudges state industries
  (2.1.8), `EXPERTISE_IDEOLOGY_LEAN` biases `factionCenter`. _Complete._
- **PR6 — Trait pass B (governance/cabinet-facing).** `TRAIT_GOVERNANCE_EFFECTS`
  drive lingering meters, era-event modulation, military-command grants,
  Secession-Winter band. _Complete._
- **PR5 — Cabinet overhaul.** Per-seat scoring (`CABINET_SEAT_SCORING`),
  expertise gating + grants (`OFFICE_EXPERTISE`), admin double on confirm,
  era-conditional seats (`cabinetSeatsForYear`). _Complete._
- **PR4 — Trait pass A (election-facing).** `TRAIT_ELECTION_EFFECTS` /
  `TRAIT_ELECTION_BANDS` give real per-context magnitudes to election traits.
  _Complete._
- **PR3 — Trait loss + conflict machinery.** Old-age trait decay + d6 conflict
  arbitration (`TRAIT_CONFLICTS`, `tryGrantTrait`). _Complete._
- **PR2 — Ability earn/loss alignment.** Missing command grants + the loss
  machinery for all six skills + command; primary/secondary track grants.
  _Complete._
- **PR1 — Expertise axis foundation.** New `Expertise` type (19 tags) +
  `expertise` field; migrated the 8 mis-filed expertise-as-trait strings off the
  `Trait` union (incl. `repair()` save migration + dataset regen). _Complete._

---

## Up next

> **Two tracks, run in parallel by separate workstreams.** Within a track,
> order is the product — nothing depends on something below it. The engine track
> is the bottlenecked dependency chain; the presentation track shares only ~4
> small additive `Politician`/`Party` fields with it and can be staffed
> independently from day one (tech-lead §9.4, §9.6).
>
> Tags in the **Source** column: `gilded` / `fed` / `1772s` are the three
> digests; **NEW** = first appeared this batch; **CARRIED** = on the batch-1
> list (possibly re-ordered); **HI-CONF** = corroborated across ≥2 eras (the
> strongest signal it is real). Sizes are the tech-lead's.

### Quick-wins — land immediately (XS each, high feel-value)

These are **fixes, not features** (plus two cheap divergence resolutions). Do
them first; none blocks on a keystone. **BUG-1 is the exception that matters:**
it is XS but it is a **hard gate on the federalism epic** — land it *in or just
before* E5 below, not "later."

| # | Item | Scope | Depends on | Size | Source |
|---|---|---|---|---|---|
| QW1 | **BUG-3 — no-PM-General fallback guard** | Defensive guard on the `GeneralInChief` fill path (`phaseRunners.ts:2255`): empty-pool ⇒ leave vacant + log (or auto-generate stopgap officer, ties to E7 auto-officials). Closes a potential crash. | — | XS | bug BUG-3 (`fed` 5, 119) |
| QW2 | **±3-per-phase meter-swing clamp (divergence #7)** | One-helper change: clamp every `NationalMeters` write to ±3 per phase (`types.ts:1399`). Orthogonal to the full named-ordinal relabel (parked). Cheap balance/feel win. | — | XS | divergence #7, mechanics §21.8 (`1772s`) — NEW |
| QW3 | **Auto-Carpetbagger on alt-state moves (divergence #2)** | Replace the 4-step probability ladder with auto-grant on a successful alt-state relocation; add 10-year expiry + exempt alt-state moves from the relocation cap. More legible; removes a dead dial. | — | XS | gap #38, divergence #2 (`gilded` 36; `1772s` 3,4,28,52) — HI-CONF |
| QW4 | **BUG-1 — era-event era-lock filter** *(federalism gate)* | Add an era-vs-start-year filter to `buildEraEventsForYear` (`phaseRunners.ts:2817`): an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table. Latent today; **a blocker the moment a 3rd scenario ships** — so this rides with E5. | — | XS | bug BUG-1 (`fed` 521-535) |

---

### Engine track (dependency-ordered)

**Phase 0 — keystones.** `K0 → (K1 ‖ K2 ‖ K3) → K4`. After K0, K1/K2/K3 are
independent and parallelizable across PRs; K4 depends on K3. (Tech-lead §9.1,
§9.6.)

| # | Item | Scope | Depends on | Size | Source |
|---|---|---|---|---|---|
| K0 | **Seed the RNG** | Drop a real PRNG (mulberry32/xoshiro) into `rng.ts:5`; store `seed` + state on `GameState` (optional + `repair()` backfill); migrate the **14** raw `Math.random` engine calls (election jitter `phaseRunners.ts:3711`, generic-war `:3603`, draft fallback `:188-198`, `revolutionaryWar.ts:89,97`, `continentalCongress.ts:271`). Keep wrapper signatures. | — | S–M | tech-debt #1–#3 (determinism prereq for multiplayer + replay) — CARRIED |
| K1 | **`State.policies` + `State.electionMethod` data shapes** | Two additive `State` fields (`types.ts:1318`): `policies?: Partial<Record<StatePolicyId, StatePolicy>>` (Poll Tax/Jim Crow/Prohibition/Women's Suffrage/Segregation; `multiplierUntilYear` for time-bounded multipliers) + `electionMethod?: 'popular'\|'legislature'`. `repair()` backfill `{}` / `'popular'`. Extend `Predicate` with `{ statePolicyActive }` + `{ electionMethodIs }`. | K0 | XS | gap #21 (`gilded` 125) + #44 (`fed` 194-373) — bundled, both load-bearing — CARRIED+NEW |
| K2 | **`ActionRegistry<Ctx>` keystone** | Define `GameAction<Ctx>` + `ActionRegistry<Ctx>` once in `src/engine/actionRegistry.ts` (one ~80-line type covering id/label/`isAvailable`/`resolve`/`persistence`) + one UI Action Picker + one JSON-serializable persistence shape. Used by all four action libraries (E7–E10) and convention inter-ballot (E6). | K0 | S | §6.6 (now confirmed 2 eras: `gilded` + `fed`) — CARRIED, HI-CONF |
| K3 | **`advanceEra(snap, target)` + era-content registry** | Replace the hard-coded `currentEra = 'federalism'` in `constitutionalConvention.ts:198` with a pure callable transition (side-effect hooks: **points-reset** per `fed` 518, card-pool swap, nation renames, draft-profile shift, party-formation). Lift the **5** `ERA_GRAPH_1772` spots in `eraGraph.ts` (`:4,:73,:113,:148,:164`) to `ERA_GRAPHS: Record<Era, GraphNode[]>` + era-keyed `validate()` denylist. | K0 | M | gap #2 (`fed` 11,518), tech-debt #5/#9 — CARRIED |
| K4 | **Era enum widening + `scenario1788` (federalism boot)** | Add the era value(s) to `Era` (`types.ts:1337`); fill every `Record<Era,…>` table the TS exhaustiveness check flags. **First new scenario is `scenario1788`, NOT gilded** (§9.1.1): a mid-government boot on the `scenario1856` template (`scenario1856.ts:177-193`) — pre-seated Washington admin, start at phase 2.1.2. New files: `scenario1788.ts`, `factions1788.ts`, `states1788.ts`. Per-(faction, era) `FACTION_DRAFT_PROFILES`. | K3 | M–L | gap #2, #4, #41 (`fed`), §9.1.1 — CARRIED, retargeted to federalism |

**Phase 1 — subsystems.** Ordered to minimize rework (tech-lead §9.6). The
federalism epic (E5) is the spine batch 2 added; it pulls in E6–E9.

| # | Item | Scope | Depends on | Size | Source |
|---|---|---|---|---|---|
| E5 | **Federalism era epic (`scenario1788` content)** | The highest-value batch-2 epic. Era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events (~1792; `Party.formedYear`/`eraName`), 10-faction roster + nickname relabel, Mod/Cons draft profile, federalism SCOTUS set (`scotusFederalism.ts`). **Must land with BUG-1 (QW4).** | K4, **QW4**, K1 | L | gap #2, mechanics §20 (`fed`) — NEW |
| E6 | **Bill typing + budget-gated spending cap** | `Bill.type?: 'foundational'\|'spending'\|'crisis'` (`types.ts:1506`, none today) + numeric `game.spendingBudget?` reading the **numeric `nationalSurplus`** (E14g), not the ordinal `revenue`. Non-crisis spending bills can pass the floor yet be "BLOCKED DUE TO BUDGET"; crisis bills bypass. Prereq for crisis bills + the Hamiltonian program. | K0 | M | gap #42 (`1772s` B4; `fed` 159-703) — NEW, HI-CONF |
| E7 | **Generic cross-era war system (divergence #6)** | Generalize one `War` model: additive Chance-of-Success per battle, warscore/momentum/×2 resolution, confirmation cascade (defeated commander → Incompetent + fired → Senate drama). Replace the flat resolver (`phaseRunners.ts:3593-3627`) and **fold the 1772 Rev-War loop in as one configured instance** (`revolutionaryWar.ts`). Outcome grants/denies territory (couples to E9). Pairs with A4 battle-card (P-track). | K0, **QW1** | M–L | gap #45, divergence #6 (`fed` 222-573; `1772s` 20-60) — NEW, HI-CONF |
| E8 | **Per-state presidential-election method (divergence #5)** | Legislature-method states award EV from seated-legislature party majority instead of popular vote in `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`). Flipped per-state by era event, globally by amendment (E10). Decisive in 1796 (CT/GA/MA/NJ/NY/RI/SC). | K1 (the field), E10 (global flip) | M | gap #44, divergence #5 (`fed` 194-373) — NEW |
| E9 | **Bill-driven statehood + auto-generated officials** | Statehood/territory bills route → `admitState` (`territories.ts:8`, today only 1772 era-event `postEffects`); event/war annexation; **generate filler officials** for sparse new states; organized/unorganized status. Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories. | E6 (bill route), E7 (war annexation); shares E7's auto-officials | M | gap #43 (`fed` 81-718) — NEW |
| E10 | **Constitutional amendments as durable state** | `GameState.amendments?: { id; passedYear; data? }[]` + amendment bill type + **cross-state ratification vote that can fail** (Christianity-as-religion 9-7). Effect-binding: term-length (4↔6), popular-vote-everywhere (→ E8), VP-vacancy fill, suffrage, court size. Extend `Predicate` with `{ amendmentPassed }`. **Gates BUG-2** (`Chisholm` needs `!11th`, rides the E5 SCOTUS content). | K0 | M | gap #39, mechanics §21.3 (`gilded` + `fed`) — NEW, HI-CONF |
| E11 | **Convention machinery (2.9.2)** | Still the **single biggest unbuilt subsystem** — replaces the `engine.ts:69` one-liner. Multi-ballot loop + momentum + unit-rule; **inter-ballot action library on K2** (Force Rules Change, Presidential Promise, Drop & endorse, Kingmaker interference, Ballot shift); 5-plank platform + comparison; VP-impact scorer; scandal rolls; faithless electors; **host-advantage** + **PL-overrules-VP** (new in `fed`); general-election actions. **Split into ~3 sub-PRs** (ballot loop → inter-ballot library → platform/VP/scandal). | K0, K2 | L–XL (split 3) | gap #13–#19, mechanics §15.3 (`gilded` 211-267; `fed` 231-606) — CARRIED, HI-CONF |
| E12 | **Governor's actions library (2.5.2)** | ~14 named, era-flavored actions on the registry; d100 vs 20·governing; per-action prereqs; reads/writes `State.policies`. Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Era row-sets via the per-era registry index. | K1, K2 | M | gap #20 (`gilded` 134-150; `fed` 33-558) — CARRIED, HI-CONF (3 eras) |
| E13 | **Diplomacy actions library (2.7.1)** | Increase Relations / Increase Trade / Extend Credit (adds debt) with success/blunder rolls, on the registry. Seed per-power roster on `GameState.diplomacy` (already `Record<string,number>`): era-dependent (5 in federalism UK/France/Spain/Prussia/Russia; +China in gilded; Prussia→Germany 1871). | K2 | M | gap #25b, #26 (`gilded` 132,198; `fed` 32-572) — CARRIED, HI-CONF |
| E14 | **Executive actions library (2.8.1)** | N actions/half-term on the registry (N varies by traits; `Easily Overwhelmed` → VP hand-off; control-handoff chain `fed` 226-228, open tie-break). Persistent `GameState.activeExecutiveActions` with green/yellow expiry; **auto-deactivate sweep on admin change** (2.9.4). Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. | K2; admin-change hook | M | gap #23, #23b (`gilded` 201-203; `fed` 46-575) — CARRIED, HI-CONF |
| E15 | **Legislative micro-mechanics** | Four independent sub-PRs on 2.6.1–2.6.3: (a) committee block-and-replace (same-committee check); (b) bill packaging (won't-bundle-net-negative-unless-statehood); (c) filibuster (a **standing rule toggled ON by a law**, "Institute Filibuster" 1792, trait-gated); (d) `(Crisis)` tag + `Legislation.resolvesCrisis?` + `GameState.activeCrises?` (era-scaled taxonomy). | K0, E6 (crisis tag) | M (split 4) | gap #8–#11 (`gilded` 160-194; `fed` pervasive) — CARRIED, HI-CONF |
| E16 | **Era-event extensions** | Widen `EraEvent.decider: Role\|Role[]` (roll per role); foreign-territory grants en bloc (Oregon Treaty → BC/WA/OR/ID; organized/unorganized status); `GameState.pendingEvDeltas?` applied in 2.10 on `year % 10` (census timing: run decade N, take effect N+2; focus-rep seats); Egghead-cabinet advisory step + implementation-roll layer. | K1, K3 | M | gap #22, #33, #34 (`gilded` 106-129; `fed` 29-702) — CARRIED, HI-CONF |
| E17 | **Cabinet & Congressional leadership richness** | Region-coverage malus (−1 in unrepresented regions next Pres race); state-status eligibility guard; Ministers-to-foreign-powers seats (era-keyed); **Congressional 9-role pipeline** (2.2.1: Speaker/Maj-Min Leaders/Whips/Pro Tem; RCV whip races; committee-eligibility-by-prior-service; incumbent-protection-when-dominant); **6-criterion faction-leader cascade** + anointing (2.2.3); PL fatigue + **suppress 2.2.4 + inter-party conversion in `independence`**. **Include firing-precedent flag** (`game.firingPrecedentSet` + same-faction Bank-President guard — additive, debt #17, NOT a wipe-removal). Consider splitting cabinet vs. Congress if either feels XL. | K0 | M–L | gap #28–#32, #25 (`gilded` 50-341; `fed` 3-681; `1772s` 5-87) — CARRIED, HI-CONF |
| E18 | **Faction-personality 5-step distribution + per-era card pool + nicknames** | The **full 5-step allocation** algorithm (`1772s` B9: most-pols ideology card → era-minimum top-ups → adjacency rule → interest/lobby by most-interested with ≥5-pol top-up floor → event-driven lobby activation) implemented *alongside* the existing per-half-term drift, not replacing it. Plus the per-(party, era, ideology) nickname table gated by leader traits + player-edit override (`Faction.nickname` exists; nothing updates it). | K3/K4 (era enum) | M | gap #24, #5, #40 (`1772s` B9; `gilded`/`fed` drift) — CARRIED, HI-CONF |
| E19 | **Small consistency PRs (cluster)** | Cheap independent wins: (a) old-age stat decay (separate from mortality, age-keyed); (b) defeated-incumbent auto-retire (6yr loss-malus **amendment-gated**); (c) industry-leadership compute + scoring (derived from `State.industries`; reconcile the industry taxonomy) + per-state `governorTermLength`/`termLimits`; (d) tariff integer + change-cadence (`tariffPercent`/`tariffNextChangeableYear`); (g) `GameState.nationalSurplus?: number` distinct from `meters.revenue` — **prereq for E6's cap** (build this sub-item early). | mostly — | XS–S each | gap #35–#38, #27, #3 (`gilded` F; `fed` 52-331; `1772s` 3-90) — CARRIED, HI-CONF |
| E20 | **Bill-scoring leaderboard (divergence #1, Phase A)** | Add `legislativeScoring(bill, faction)` (±50/100/150 per matching ideology+lobby+interest card, staged tabulation) onto a new `Faction.score?` ledger. Keep `cardVoteBias` (`phaseRunners.ts:1516`) as the **vote-probability** input for floor votes — scoring and voting are different jobs. (Phase B — re-tune `cardVoteBias` per-card-aware — is parked.) | K0 | M | gap #12, divergence #1 (`gilded` 237; `1772s` 27-44) — CARRIED, HI-CONF |
| E21 | **Gilded scenario** | The Gilded-Age scenario boot, **once `advanceEra` (K3) + the four action libraries (E12–E14) are mature** (§9.1.1). Gilded issue *shells* (tariff integer from E19d, `MonetaryRegime` enum, civil-service/anti-corruption, imperialism naval bases) get a data home here; full system depth is parked. Resolves the `modern`-era / `gilded`-enum question. | K3, E12, E13, E14 | M–L | gap #2, #3, #41 (`gilded`) — CARRIED |

### Presentation track (parallel — separate workstream)

> Almost all of A1–A8 are **read-only views over snapshot data that already
> exists** — they don't depend on the keystones or the engine subsystems. The one
> sync point is A4 (battle-card), which wires its real numbers when **E7
> (generic war)** lands. **Hard constraint, encode from day one: no AI-generated
> imagery or text in the shipped product** (A1; AI only as a throwaway PoC).

| # | Item | Scope | Depends on | Size | Source |
|---|---|---|---|---|---|
| P0 | **Ideology→color palette** *(cross-cutting foundation — do first)* | `IDEOLOGY_COLORS: Record<Ideology, string>` in `src/theme/` (the per-*ideology* legend; `Party.color` exists but this does not). Many P-track items consume it (roster, congress, maps, score sheets, committee views). Independent of the engine track — can land immediately. | — | XS | gap A2, §9.1 K1.5 (`1772s` 12-71) — NEW |
| P1 | **Politician card + roster/congress restyle (A2/A3/A5/A6)** | "Sport-card" infobox (portrait/traits/stats/PV/office), always-on styled scoreboard, era-correct office titles (per-(office,era,state) strings), honorific-memory + "remembered for…" legacy lines (small additive `Politician` fields, A6). | P0 | M | gap A3, A5, A6 (`1772s` 13-53) — NEW |
| P2 | **Procedural portrait pipeline (A1)** *(no AI in product)* | CK2-style layered-sprite procedural portraits for the ~18.5k long tail + hand-art slots for marquee figures. Asset-pipeline + renderer epic (closer to the dataset pipeline §7 than to the engine). Only engine touchpoint: the additive `Politician.portrait?` field. **Hard no-AI-in-product.** | P0; `Politician.portrait` field | L | gap A1 (`1772s` 13,14,51,860) — NEW |
| P3 | **Election-result maps + iconography (A7)** | Election-result maps + era-correct national/state flags. Renderer can be prototyped on 1856; most valuable after more states exist (gilded E21). | P0 | M | gap A7 (`1772s` 23,24,40) — NEW |
| P4 | **Narration voice (A8)** | A `log.ts` output-quality bar (in-character narration density), not a schema change. Smallest; ongoing. | — | XS–S | gap A8 (`1772s` 9-56) — NEW |
| — | **A4 battle-card** *(wired by E7)* | The itemized additive-odds battle-card (difficulty + planning + commander + meters → % victory). Build the card shell early; wire real numbers when **E7 (generic war)** surfaces the itemized odds. | E7 | S | gap A4 (`1772s` 22,48,60) — NEW |

---

## Later / parking lot

Bigger, fuzzier, or explicitly deferred.

- **Multiplayer — hot-seat (M1).** Round-robin the existing `needsPlayerInput`
  mechanism (`engine.ts:9`) across human factions before `advancePhase`.
  **Hard-blocked on K0 (determinism) AND on all four action libraries (E11–E14)**
  — the player-input modalities *are* the action libraries, so building hot-seat
  first means re-validating against each. Also needs the singleton refactor:
  `playerFactionId` → `playerFactionIds: string[]` + audit every "is this me?"
  call site (tech-debt #10). — gap #1, §9.5.
- **Multiplayer — async / backend (M2, L–XL epic).** IndexedDB is per-browser
  (`db.ts`); shared state needs a server (or CRDT/host-authoritative sync) the
  repo lacks. Hard-blocked on K0 + M1. Exposes debt #6 (whole-snapshot
  clone+save bottleneck → per-store/delta writes). Open: snake order? bidding?
  seat assignment? — gap #1, §9.5.
- **Bill-scoring Phase B (divergence #1).** Re-tune `cardVoteBias`
  (`phaseRunners.ts:1516`) to be per-card-aware once the E20 leaderboard is live
  and playtested. Pending evidence. — divergence #1.
- **Conversion-targeting refactor (divergence #3).** **Keep shipped for now.**
  Revisit only after E18 (faction-personality) emits a rule-driven `Can Party
  Flip` signal cleanly; the shipped multiplicative table is doing useful work
  until then. — divergence #3, tech-debt #13.
- **Named-ordinal meter relabel (divergence #7, deferred half).** The full
  labeled-ordinal meter model (vs. the ±3 clamp shipped in QW2) touches every
  meter read/write + the UI; do it only if playtest says the numbers read
  poorly. The first-class war-score meter rides E7. — divergence #7, §21.8.
- **Far-future eras (`progressive` / post-1892).** Feminists / socialists /
  communists / prohibitionists / eugenicists / labor activists; movement/
  coalition spawning across eras. Lift in once a Progressive-or-later digest
  lands. Open: does the enum split `gilded` + `progressive`? — gap #2, #6.
- **Gilded-Age issue *system* depth.** Per-issue interest groups, full era-event
  spines, imperialism annexation flow distinct from `admitState` — the
  *system-level* depth beyond the E21 data shells. — gap #3, #6.
- **Supreme Court case content (general).** `SupremeCourtCase`/`pendingCourtCases`
  types + a ruling tick exist, but no scenario seeds substantive cases beyond the
  federalism set authored in E5. — mechanics §19.
- **Cabinet "free pick-up" legislation (12b) + foreign-volunteer scheduling
  (#46).** A skilled Treasurer's free extra bill; events that schedule a
  future-draftable figure (Lafayette 1784) routed to the lowest-scoring eligible
  faction. Small, no keystone dependency, but lower priority. — gap #12b, #46.
- **Third-party / spoiler support.** Flesh out the 2.9.3 stub (currently a no-op
  "no challenge" log). — mechanics §19.

---

## Sequencing notes

Why the order is what it is — the tech-lead's binding calls (§9.6).

1. **The two-track parallelization is the biggest schedule lever** (tech-lead
   §9.4, §9.6 call #3):
   > "The engine track (keystones → subsystems) is a long dependency chain
   > bottlenecked on a few people who know the engine. The presentation track
   > shares almost no code with it and can be staffed independently. Running them
   > concurrently is the single biggest schedule win available this batch."

   The only sync points are ~4 small additive `Politician`/`Party` fields
   (portrait, honorific/legacy lines, `formedYear`) and the A4 ↔ E7 handoff.
   Start the presentation track immediately with P0 (the ideology→color palette).

2. **K2 (ActionRegistry) before any action library** (tech-lead §9.6 call #2,
   §6.6):
   > "Building each ad-hoc means 4× the engine surface area… do this *before* any
   > of the four libraries, or pay the 4× tax. If only one keystone lands this
   > quarter, it is K2."

   E11(inter-ballot), E12, E13, E14 *all* read against this shape. Now
   **confirmed across two eras** (`gilded` + `fed` independently showed the same
   four libraries) — the keystone is more justified, not less.

3. **`scenario1788` (mid-government boot) before a fully-general `advanceEra`,
   and federalism before gilded** (tech-lead §9.1.1, §9.6 call #2):
   > "Federalism content rides `scenario1788` first (no `advanceEra` dependency);
   > `advanceEra` lands in parallel as the keystone that makes the content
   > reachable in continuous-campaign mode too… K4's first new scenario is
   > `scenario1788`, not `scenarioGilded`."

   Federalism sits *between* the two built scenarios, is the best-documented
   unbuilt era, and exercises the most cross-era systems (generic war, per-state
   EC, amendments, firing-precedent, bill-driven statehood) the roadmap needs
   anyway. Gilded (E21) follows once `advanceEra` + the action libraries mature.

4. **BUG-1 is a hard gate, not a "fix later"** (tech-lead §9.6 call #1):
   > "The moment a 3rd scenario (1788/1800) ships, BUG-1
   > (`buildEraEventsForYear`, `phaseRunners.ts:2817`) stops being latent and
   > starts dropping/leaking era events. Fix BUG-1 in the same epic as (or just
   > before) `scenario1788`."

   That is why QW4 is flagged in the quick-wins list *and* listed as a hard
   dependency of E5. The other three quick-wins (QW1–QW3) are XS feel-wins with
   no downstream gating — do them first because they are cheap, not because
   anything waits on them.

5. **RNG first (K0).** Determinism is the prerequisite for multiplayer (clients
   must agree on rolls) and any replay/test harness; it is a soft gate for every
   roll-heavy subsystem (war E7, convention scandal/faithless-elector rolls E11,
   governor d100s E12, filibuster E15c). The 14 raw `Math.random` calls sweep
   cleanly once the PRNG is seated — and the generic-war (`:3603`) and election
   (`:3711`) leaks get fixed for free.

6. **Within-track dependency notes.** E6 needs E19g (the numeric
   `nationalSurplus` its cap reads) — build that sub-item early. E8's global flip
   needs E10 (amendments). E9's war annexation needs E7. E15d (crisis tag) needs
   E6. E21 needs K3 + E12–E14. On the presentation track, P1/P2/P3 all consume
   P0, so P0 is first.

### Estimate caution

Sizes are the tech-lead's. Rows that may still feel XL after a first pass:

- **E5 (federalism epic)** — sized L but it is a full era's content; expect the
  era-event spine and the SCOTUS set to each be their own sub-PR.
- **E11 (convention)** — the single biggest unbuilt subsystem; **split into ~3**
  (ballot loop → inter-ballot library on K2 → platform/VP/scandal). E11's
  inter-ballot library is the first real use of K2 and may surface
  registry-shape iteration costs (consider a thin spike PR if so).
- **E15 (legislative micro-mechanics)** — four sub-mechanics sharing the bill
  pipeline; ship as 4 sequential sub-PRs (block-and-replace → packaging →
  filibuster → crisis tag).
- **E17 (cabinet & Congressional leadership)** — the 9-role Congressional
  pipeline (RCV whip races) is the chunkier half; split cabinet vs. Congress if
  either feels XL during scoping.
- **P2 (portrait pipeline)** — an asset-pipeline epic, not a feature; the
  no-AI-in-product constraint shapes the tech choice from day one.

---

## Provenance note

This reflects **batches 1–2**: the `f4c7c2c4` 1868 Gilded-Age multiplayer
dry-run, the `f55d3e21` 1788 federalism solo-with-AI playtest, and the
`85f8e6b4` 1772 solo aesthetic experiment. The batch-1 roadmap was a single
14-item dependency-ordered list; this rebuild:

- **restructures "Up next" into two parallel tracks** (engine + presentation),
  the biggest change, per the tech-lead's §9.6 two-track plan;
- **adds the federalism epic (E5)** as the engine track's spine and **retargets
  K4's first scenario from gilded to `scenario1788`** (§9.1.1);
- **promotes ~16 batch-1 rows to HIGH-CONFIDENCE** (corroborated across a second
  era) and adds 13 net-new rows (federalism content, generic war, per-state EC,
  bill typing + spending cap, bill-driven statehood, A1–A8 presentation);
- **adds a quick-wins callout** (QW1–QW4) for the XS bug-fixes/feel-wins, with
  BUG-1 flagged as the federalism gate;
- **resolves three new divergences** (#4 era-event scheduling — kept the graph,
  parked the hybrid-cap decision as a loud flag; #5 per-state EC → E8; #6
  generic war → E7) and the meter-model split (#7: ±3 clamp now in QW2,
  named-ordinal relabel parked);
- **keeps multiplayer (M1 hot-seat + M2 async) in the parking lot** with explicit
  hard-blockers.

**Still provisional.** Subsequent `/ingest-playtest` runs will refine scopes
(especially the convention sub-split, the amendments effect-set, the
faction-personality drift rules, the crisis taxonomy, and the post-gilded "next
era"), may re-split currently M-sized rows, and may surface items now parked or
unknown. **The order above is buildable top-to-bottom today; re-validate on every
digest.** Open design calls that gate ordering (era-event scheduling hybrid,
era-enum split, meter relabel) are tracked in `game-context.md` → Open questions.

---

**Roadmap path:** `/home/user/AMPU/docs/game/roadmap.md`.
