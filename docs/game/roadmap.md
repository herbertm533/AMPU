# AMPU — Roadmap

> **Batch-3 version — re-sequenced for the modern (1948→2020) thread.** This
> roadmap was stood up from the codebase + tech-lead bootstrap (6 items), rebuilt
> against batch 1 (`f4c7c2c4`, the 1868 Gilded-Age dry-run → 14 items), then
> re-sequenced into **two parallel tracks** for batch 2 (`f55d3e21` 1788
> federalism + `85f8e6b4` 1772 aesthetic). It is now **re-sequenced for batch 3**,
> which absorbed `3a9ac985` — a **2276-post modern (1948→2020) multiplayer
> campaign**, the most mechanically mature thread yet. Batch 3 **corroborates ~30
> prior deltas across a 4th era** (the keystone calls are now as strong as they
> get), adds the modern subsystems, **two new divergences (#7 SCOTUS, #8
> cabinet)**, **two GM-confirmed design holes (DH-1, DH-2)**, and — most important
> for ordering — **two scaling walls that are NOT era-gated**.
>
> **The single biggest change vs. the batch-2 roadmap** is that the deep-modern
> *subsystems* go to a new far-end **engine Phase 2** (after gilded), while the
> *cross-cutting* items the modern thread surfaced are pulled **near-term** into
> Phase 1: meter-model generalization, persist/auto-fill House slates, and
> procedural pol generation. Two corrections also land: **#8 cabinet is a
> wipe→retention refactor sized M** (the engine *does* wipe the cabinet every 4
> years — `phaseRunners.ts:3804-3812` — batch 2 wrongly said it didn't), and **#7
> SCOTUS is a from-scratch subsystem over a stub** (far-end). The two-track
> structure is unchanged. Order within each track is binding from
> `technical-guide.md` §9.6 — **build top-to-bottom.**

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic (PR1–7)
is complete; the knowledge-base infra and three ingestion batches are knowledge
milestones (no code, but they are what every item below is traced to).

- **Batch-3 ingestion (knowledge milestone).** Absorbed `3a9ac985` (the modern
  1948→2020 multiplayer campaign, 2276 posts — the most mechanically mature
  source). Gap log grew with modern rows #47–#55 + A9 + DH-1/DH-2 (~30 rows now
  corroborated across 3–4 eras); `game-mechanics.md` gained §22 (modern
  subsystems) + divergences #7 (SCOTUS) / #8 (cabinet); `technical-guide.md` §9
  re-sequenced into Phase-0/1/2, pulling the two scaling walls + meter
  generalization near-term and appending the far-end modern epic; debt #17–#22
  added (incl. the corrected cabinet-wipe finding). _Complete._
- **Batch-2 ingestion (knowledge milestone).** Absorbed `f55d3e21` (1788
  federalism, 732 posts) + `85f8e6b4` (1772 solo aesthetic, 90 posts). Gap log to
  ~54 rows + A1–A8 presentation + 3 confirmed bugs; `game-mechanics.md` gained
  §20–§21 + divergences #4–#6; `technical-guide.md` §9 re-sequenced into the
  two-track plan. _Complete._
- **Batch-1 ingestion (knowledge milestone).** The four planner docs stood up and
  absorbed the `f4c7c2c4` 1868 Gilded-Age dry-run: gap log to ~41 rows, ~12 new
  `game-mechanics.md` sections, the `ActionRegistry` keystone identified, three
  design divergences resolved. _Complete._
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

> **Two tracks, run in parallel by separate workstreams.** Within a track, order
> is the product — nothing depends on something below it. The engine track is the
> bottlenecked dependency chain, now in **three phases**: Phase 0 (keystones),
> Phase 1 (near-term subsystems incl. the federalism epic + the cross-cutting
> items the modern thread pulled forward), Phase 2 (the far-end deep-modern epic,
> builds last). The presentation track shares only a handful of small additive
> `Politician`/`Party` fields + two deeper handoffs and can be staffed
> independently (tech-lead §9.4, §9.6).
>
> Tags in the **Source** column: `gilded` / `fed` / `1772s` / `modern` are the
> four digests; **NEW** = first appeared this batch; **CARRIED** = on a prior
> list (possibly re-ordered/re-sized); **HI-CONF** = corroborated across ≥2 eras
> (the strongest signal it is real); **HI-CONF (3–4 era)** = now corroborated
> across three or four eras (as strong as the evidence gets). **status** column:
> `ready` = buildable now; `needs-design` = rules must be authored first. Sizes
> are the tech-lead's.

### Quick-wins — land immediately (XS each, high feel-value)

These are **fixes + two cheap divergence resolutions**. Do them first; none
blocks on a keystone. **BUG-1 is the exception that matters:** it is XS but it is
a **hard gate on the federalism epic** — land it *in or just before* E1 below.
DH-2 (modern deck fired off-year cards) folds into BUG-1 + the era-event
scheduling work — same scheduling surface — and is investigated there, not as its
own quick-win.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| QW1 | **BUG-1 — era-event era-lock filter** *(federalism gate)* | Add an era-vs-start-year filter to `buildEraEventsForYear` (`phaseRunners.ts:2817`): an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table. Latent today; **a blocker the moment a 3rd scenario ships** — so this rides with E1. **Resolve together with DH-2 + divergence #4** (one scheduling surface). | — | XS | bug BUG-1 (`fed` 521-535), DH-2 (`modern` 2221) | ready |
| QW2 | **BUG-3 — no-PM-General fallback guard** | Defensive guard on the `GeneralInChief` fill path (`phaseRunners.ts:2255`): empty-pool ⇒ leave vacant + log (or auto-generate a stopgap officer — ties to E8 procedural pol gen). Closes a potential crash. | — | XS | bug BUG-3 (`fed` 5, 119) | ready |
| QW3 | **±3-per-phase meter-swing clamp (meter-model divergence)** | One-helper change: clamp every `NationalMeters` write to ±3 per phase (`types.ts:1399`). Orthogonal to the full named-ordinal relabel (parked) and to E6's crisis/cascade rules (which build on it). Cheap balance/feel win. | — | XS | meter model §21.8/§22.1 (`1772s`; `modern`) | ready |
| QW4 | **Auto-Carpetbagger on alt-state moves (divergence #2)** | Replace the 4-step probability ladder with auto-grant on a successful alt-state relocation; add 10-year expiry + exempt alt-state moves from the relocation cap (4/half-term). More legible; removes a dead dial. | — | XS | gap #38, divergence #2 (`gilded` 36; `1772s` 3-52; `modern` 147) — HI-CONF (3–4 era) | ready |

---

### Engine track — Phase 0 (keystones)

**`K0 → (K1 ‖ K2 ‖ K3) → K4`.** After K0, K1/K2/K3 are independent and
parallelizable across PRs; K4 depends on K3. (Tech-lead §9.1, §9.6.) **K2 is now
the single most important keystone (~6× leverage) — do it first if only one
lands.**

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| K0 | **Seed the RNG** | Drop a real PRNG (mulberry32/xoshiro) into `rng.ts:5`; store `seed` + state on `GameState` (optional + `repair()` backfill); migrate the **14** raw `Math.random` engine calls (election jitter `phaseRunners.ts:3711`, generic-war `:3603`, draft fallback `:188-198`, `revolutionaryWar.ts:89,97`, `continentalCongress.ts:271`). Keep wrapper signatures. | — | S–M | debt #1–#3 (determinism prereq for multiplayer + replay) — CARRIED | ready |
| K1 | **`State.policies` + `State.electionMethod` data shapes** | Two additive `State` fields (`types.ts:1318`): `policies?: Partial<Record<StatePolicyId, StatePolicy>>` (Poll Tax/Jim Crow/Prohibition/Women's Suffrage/Segregation; `multiplierUntilYear`) + `electionMethod?: 'popular'\|'legislature'`. `repair()` backfill `{}` / `'popular'`. Extend `Predicate` with `{ statePolicyActive }` + `{ electionMethodIs }`. | K0 | XS | gap #21 (`gilded` 125; `modern` 25-2245) + #44 (`fed` 194-373) — CARRIED, HI-CONF | ready |
| K2 | **`ActionRegistry<Ctx>` keystone** | Define `GameAction<Ctx>` + `ActionRegistry<Ctx>` once in `src/engine/actionRegistry.ts` (one ~80-line type covering id/label/`isAvailable`/`resolve`/`persistence`) + one UI Action Picker + one JSON-serializable persistence shape. Used by **six** action libraries (governor/exec/diplomacy/convention-inter-ballot/**primary/general**). **~6× tax if built ad-hoc — the highest-leverage keystone.** | K0 | S | §6.6 (now confirmed **4 eras**; `modern` adds the 5th+6th libraries) — CARRIED, HI-CONF (3–4 era) | ready |
| K3 | **`advanceEra(snap, target)` + era-content registry + year-decoupling** | Replace the hard-coded `currentEra = 'federalism'` in `constitutionalConvention.ts:198` with a pure callable transition (hooks: **points-reset**, card-pool swap + **per-era card-count rescale**, nation renames, draft-profile shift, party-formation, **era-end awards**). Lift the **5** `ERA_GRAPH_1772` spots in `eraGraph.ts` (`:4,:73,:113,:148,:164`) to `ERA_GRAPHS: Record<Era, GraphNode[]>`. **Gate content by `currentEra`, not literal year** (the alt-history clock makes year-based gating wrong). | K0 | M | gap #2 (`fed` 11,518; `modern` 1080,1172), debt #5/#9, era-enum growth — CARRIED, HI-CONF | ready |
| K4 | **Era enum growth + `scenario1788` (federalism boot)** | Add the era value(s) the timeline needs — `gilded`/`progressive` between `nationalism` and `modern` (`Era`, `types.ts:1337`); fill every `Record<Era,…>` table the TS exhaustiveness check flags. **First new scenario is `scenario1788`, NOT gilded/modern** (§9.1.1): a mid-government boot on the `scenario1856` template (`scenario1856.ts:177-193`) — pre-seated Washington admin, start at phase 2.1.2. New files: `scenario1788.ts`, `factions1788.ts`, `states1788.ts`. Per-(faction, era) `FACTION_DRAFT_PROFILES`. | K3 | M–L | gap #2, #4, #41 (`fed`; `modern` confirms gilded+progressive+modern as distinct), §9.1.1 — CARRIED | ready |

### Engine track — Phase 1 (subsystems, dependency-ordered)

Ordered exactly per tech-lead §9.6 to minimize rework. The federalism epic (E1)
is the spine; it pulls in E2–E5. Rows **E6–E8** are the **NEAR-TERM cross-cutting
items the modern thread pulled forward** — they are *not* modern-only and improve
every era.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E1 | **Federalism era epic (`scenario1788` content)** | The highest-value epic. Era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events (~1792; `Party.formedYear`/`eraName`), 10-faction roster + nickname relabel, Mod/Cons draft profile, federalism SCOTUS set (`scotusFederalism.ts`). **Must land with BUG-1 (QW1).** Expect sub-PRs (event spine, SCOTUS set). | K4, **QW1**, K1 | L | gap #2, mechanics §20 (`fed`) — CARRIED | ready |
| E2 | **Bill typing + budget-gated spending cap** | `Bill.type?: 'foundational'\|'spending'\|'crisis'` (`types.ts:1506`, none today) + numeric `game.spendingBudget?` reading the **numeric `nationalSurplus`/`nationalDebt`** (E17g), not the ordinal `revenue`. Non-crisis spending bills can pass the floor yet be "BLOCKED DUE TO BUDGET"; crisis bills bypass. `modern` adds a **bill-relationship/replacement graph** (amendment-tier bills repealable only by amendment) — its deep form rides E27, the type tag lands here. Prereq for crisis bills + the Hamiltonian program. | K0; **E17g** (numeric surplus — build that sub-item early) | M | gap #42 (`1772s` B4; `fed` 159-703; `modern` 32-2265) — CARRIED, HI-CONF (3–4 era) | ready |
| E3 | **Generic cross-era war system (divergence #6)** | Generalize one `War` model: additive Chance-of-Success per battle, naval→land phasing (`modern`: ≥1 naval win first), warscore/momentum/×2 resolution, confirmation cascade (defeated commander → Incompetent + fired → Senate drama), loss-debuff. Replace the flat resolver (`phaseRunners.ts:3593-3627`) and **fold the 1772 Rev-War loop in as one configured instance**. Outcome grants/denies territory (couples to E5/E9-statehood). Pairs with A4 battle-card (P-track) + the Phase-2 military tier. | K0, **QW2** | M–L | gap #45, divergence #6 (`fed` 222-573; `1772s` 20-60; `modern` 949-1378) — CARRIED, HI-CONF (3–4 era) | ready |
| E4 | **Per-state presidential-election method (divergence #5)** | Legislature-method states award EV from seated-legislature party majority instead of popular vote in `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`). Flipped per-state by era event, globally by amendment (E5). Decisive in 1796 (CT/GA/MA/NJ/NY/RI/SC). | K1 (the field), E5 (global flip) | M | gap #44, divergence #5 (`fed` 194-373) — CARRIED | ready |
| E5 | **Constitutional amendments as durable state** | `GameState.amendments?: { id; passedYear; data? }[]` + amendment bill type + **2/3-House pass gate** + **cross-state ratification vote that can fail** (era-specific ratifier + threshold: `fed`/`gilded` by legislatures; **`modern` by GOVERNORS, 40 of 53**) + **grandfather clause**. Effect-binding: term-length (4↔6), popular-vote-everywhere (→ E4), VP-vacancy fill, suffrage, court size. Extend `Predicate` with `{ amendmentPassed }`. **Gates BUG-2** (`Chisholm` needs `!11th`, rides E1's SCOTUS content). | K0 | M | gap #39, mechanics §21.3 (`gilded` + `fed` + `modern` 15-1597) — CARRIED, HI-CONF (3–4 era) | ready |
| E6 | **Meter-model generalization [NEAR-TERM]** | Banded-text ladders over the existing 7 `NationalMeters` fields + crisis entry/exit by tier + cascade rules (one meter caps/forces another) + top-of-ladder effects (**Honest-Gov't maxed kills Machines + Gerrymandering**) + numeric `nationalDebt` integer + `metersToElectionBonus()` from the canonical "State of the Meters" table. **It's a 1:1 WIDENING of `NationalMeters`, not a relabel** — the bank maps to shipped fields. Builds on QW3's ±3-clamp. Benefits *every* era. (The labeled-ordinal *presentation* relabel rides the P-track separately.) | K0; E17g (the debt field) | M | gap #50, mechanics §22.1 (`modern` 12-2230) — NEW, HI-CONF (3–4 era) | ready |
| E7 | **Persist + auto-fill House slates & committees [NEAR-TERM — scaling wall b]** | Store a faction's House candidate slate + committee rosters on the snapshot; **carry-forward + bulk auto-fill by default**. The "computer owns the deterministic tedium" theme. **A UX wall, not modern-only** — improves 1856's 31-state congress now; a human **quit** over the manual tedium at 53-state scale. Do **before** the deep-modern roster (E26). | `repair()` backfill for the new fields | M | gap A9, debt #20 (`modern` 115-1281; also `1772s` Lingering/Committees) — NEW | ready |
| E8 | **Procedural pol generation [NEAR-TERM — scaling wall a]** | A **runtime, seeded** generator (lives in `src/engine/`, uses `rng.ts`) emitting `ImportedDraftee` rows when the real ~18.5k dataset is dry; reuses `instantiateDraftees` (`phaseRunners.ts:114`). Stat/ideology/trait/demographic distribution (GM wanted "some moderates") + a **plausible, ethnically-varied, toggleable name engine**. **Required for ANY late-era play** (dataset exhausts in deep-modern) AND fixes sparse-state filler (#43) AND BUG-3's stopgap officer. **The bridge to the portrait epic (P2)** — generated pols need procedural portraits; shares the demographic model with P2. | K0 (seeded RNG) | M–L | gap #43, A1, debt #19 (`modern` 456-1771; `fed` 81-718) — NEW, HI-CONF | ready |
| E9 | **Bill-driven statehood + auto-generated officials** | Statehood/territory bills route → `admitState` (`territories.ts:8`, today only 1772 era-event `postEffects`); event/war annexation; organized/unorganized status; **filler officials via E8's generator**. Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories. | E2 (bill route), E3 (war annexation), E8 (filler officials) | M | gap #43 (`fed` 81-718) — CARRIED | ready |
| E10 | **Convention machinery (2.9.2)** | The **single biggest unbuilt subsystem** — replaces the `engine.ts:69` one-liner. Multi-ballot loop + momentum + unit-rule; **inter-ballot action library on K2** (Force Rules Change, Presidential Promise, Drop & endorse, Kingmaker, Ballot shift); 5-plank platform + comparison (+ `modern` failed-platform <50%-planks penalty); VP-impact scorer; scandal/faithless-elector rolls; **host-advantage** + **PL-overrules-VP**; **CPU delegate engine** (per-state EV × category multiplier — shared with the Phase-2 primary). **Split into ~3 sub-PRs** (ballot loop → inter-ballot library → platform/VP/scandal). | K0, K2 | L–XL (split 3) | gap #13–#19, mechanics §15.3 (`gilded` 211-267; `fed` 231-606; `modern` 367-2240) — CARRIED, HI-CONF (3–4 era) | ready |
| E11 | **Governor's actions library (2.5.2)** | ~14 named, era-flavored actions on the registry; d100 vs 20·governing (Efficient → +1 action; success can grant +1 Command); per-action prereqs incl. **ideology gate** + **Honest-Gov't gate** + state-status; reads/writes `State.policies`. Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Era row-sets via the per-era registry index (modern adds primary-control + voter-suppression + culture actions). | K1, K2 | M | gap #20 (`gilded` 134-150; `fed` 33-558; `1772s` 25-90; `modern` 17-2245) — CARRIED, HI-CONF (3–4 era) | ready |
| E12 | **Diplomacy actions library (2.7.1)** | Increase Relations / Increase Trade / Extend Credit (adds debt) / Provoke (war-trigger) with success/blunder rolls, on the registry. Seed per-power roster on `GameState.diplomacy` (already `Record<string,number>`): era-dependent (5 federalism; +China in gilded, Prussia→Germany 1871; **8 in modern** +Japan/Israel). | K2 | M | gap #25b, #26 (`gilded` 132-198; `fed` 32-572; `modern` 12-2040) — CARRIED, HI-CONF (3–4 era) | ready |
| E13 | **Executive actions library (2.8.1)** | N actions/half-term on the registry (N varies by traits; `Easily Overwhelmed` → VP hand-off; control-handoff chain Incompetent-Pres → VP → Manipulative advisor, open multi-manipulator tie-break). Persistent `GameState.activeExecutiveActions` with green/yellow expiry; **auto-deactivate sweep on admin change** (2.9.4); per-action policy/govt-type gating + blunder rolls. Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. | K2; admin-change hook | M | gap #23, #23b (`gilded` 201-203; `fed` 46-575; `modern` 100-2043) — CARRIED, HI-CONF (3–4 era) | ready |
| E14 | **Legislative micro-mechanics** | Four sub-PRs on 2.6.1–2.6.3: (a) committee block-and-replace (same-committee check + chair-eligibility = Leadership OR Legis ≥ 2); (b) bill packaging (won't-bundle-net-negative-unless-statehood; no split-vote); (c) filibuster (a **standing rule toggled ON by a law**, "Institute Filibuster" 1792, trait-gated Puritan + Legis > 1; Cloture ~67%); (d) `(Crisis)` tag + `Legislation.resolvesCrisis?` + `GameState.activeCrises?` (era-scaled taxonomy). | K0, E2 (crisis tag) | M (split 4) | gap #8–#11 (`gilded` 160-194; `fed` pervasive; `modern` 46-2015) — CARRIED, HI-CONF (3–4 era) | ready |
| E15 | **Era-event extensions** | Widen `EraEvent.decider: Role\|Role[]` (roll per role); foreign-territory grants en bloc (Oregon Treaty → BC/WA/OR/ID; organized/unorganized status); `GameState.pendingEvDeltas?` applied in 2.10 on `year % 10` (census timing: run decade N, take effect N+2; focus-rep seats); Egghead-cabinet advisory step + implementation-roll layer (difficulty tiers, trait re-rolls, blunder→scandal). **Resolve the scheduling fork [divergence #4 + BUG-1 + DH-2] here** — keep the graph, layer the cap. | K1, K3 | M | gap #22, #33, #34, divergence #4 (`gilded` 106-129; `fed` 29-702; `modern` 6-1624) — CARRIED, HI-CONF (3–4 era) | ready |
| E16 | **Cabinet & Congressional leadership richness + cabinet retention (divergence #8 — CORRECTED)** | **Two coupled jobs, share the code.** (1) Richness: region-coverage + **diversity floor (≥25% women/minorities)** + **intra-party faction-equity** malus; state-status eligibility guard; Ministers-to-foreign-powers seats (era-keyed); **Congressional 9-role pipeline** (Speaker/Maj-Min Leaders/Whips/Pro-Tem-by-seniority; RCV/weighted vote; committee-eligibility-by-prior-service; incumbent-protection-when-dominant; CPU auto-fill); **6-criterion faction-leader cascade** (card-match binding) + anointing; PL fatigue + on-elect bundle + **suppress 2.2.4 + inter-party conversion in `independence`**. (2) **Cabinet retention — replace the wipe:** remove the unconditional cabinet clear at **`phaseRunners.ts:3804-3812`** (it fires every presidential cycle, even on re-election); retain occupants (modern: keep ≤5, CIA/FBI exempt), add per-officer tenure (CIA/FBI/Fed-Chair/Key-Advisor terms) + `firingPrecedentSet` gate on *replacement* + same-faction US-Bank guard + opp-party cap. **Consider splitting cabinet vs. Congress if either feels XL.** | K0 | M–L | gap #25, #28–#32, #31, divergence #8 (`gilded` 50-341; `fed` 3-681; `1772s` 5-87; `modern` 167-2172) — CARRIED + **CORRECTED**, HI-CONF (3–4 era) | ready |
| E17 | **Small consistency PRs (cluster)** | Cheap independent wins: (a) old-age stat decay (separate from mortality; age-keyed; `modern` adds add-negative-trait / strip-trait); (b) defeated-incumbent auto-retire (only-if-ran; 6yr loss-malus amendment-gated; −1 defeat election-malus); (c) industry-leadership compute + scoring (derived from `State.industries`; reconcile taxonomy + **per-era industry set** incl. the modern 8; regional shifts) + per-state `governorTermLength`/`termLimits`; (d) tariff integer + change-cadence + president-tariff-power toggle; **(g) `GameState.nationalSurplus?`/`nationalDebt?: number` distinct from `meters.revenue` — prereq for E2's cap + E6's debt field; BUILD THIS SUB-ITEM EARLY.** | mostly — | XS–S each | gap #35–#38, #27, #3 (`gilded` F; `fed` 52-331; `1772s` 3-90; `modern` 97-2258) — CARRIED, HI-CONF (3–4 era) | ready |
| E18 | **Faction-personality 5-step distribution + per-era card pool + nicknames** | The **full 5-step allocation** algorithm (`1772s` B9: most-pols ideology card → era-minimum top-ups → adjacency rule → interest/lobby by most-interested with ≥5-pol top-up floor → event-driven lobby activation) implemented *alongside* the existing per-half-term drift, not replacing it. Plus **per-era card-count rescale** at boundaries (can split Prog/LW-Pop across 2 factions). Plus the per-(party, era, ideology) nickname table gated by leader traits + player-edit override (`Faction.nickname` exists; nothing updates it). | K3/K4 (era enum) | M | gap #24, #5, #40 (`1772s` B9; `gilded`/`fed` drift; `modern` 134-1890) — CARRIED, HI-CONF (3–4 era) | ready |
| E19 | **Bill-scoring leaderboard (divergence #1, Phase A)** | Add `legislativeScoring(bill, faction)` (±50/100/150 per matching ideology+lobby+interest card, staged tabulation; **failed bills also score** + apply ±1 per-pol reelection deltas) onto a new `Faction.score?` ledger. Keep `cardVoteBias` (`phaseRunners.ts:1516`) as the **vote-probability** input for floor votes — scoring and voting are different jobs. (Phase B — re-tune `cardVoteBias` per-card-aware — is parked.) `Faction.score` is the same field the Phase-2 enthusiasm engine (E21) consumes. | K0 | M | gap #12, divergence #1 (`gilded` 237; `1772s` 27-44; `modern` 95-1373) — CARRIED, HI-CONF (3–4 era) | ready |
| E20 | **Gilded scenario** | The Gilded-Age scenario boot, **once `advanceEra` (K3) + the action libraries (E11–E13) are mature** (§9.1.1). Gilded issue *shells* (tariff integer from E17d, `MonetaryRegime` enum, civil-service/anti-corruption, imperialism naval bases) get a data home here; full system depth is parked. Resolves the gilded-enum question. | K3, K4, E11, E12, E13 | M–L | gap #2, #3, #41 (`gilded`) — CARRIED | ready |

### Engine track — Phase 2 (FAR-END modern epic — builds LAST, after gilded)

> These are the **deep-modern subsystems**. They sit at the end of the timeline
> and depend on the meter bank, the action libraries, and the scaling walls all
> landing first. Build them **after E20 (gilded)**. (Tech-lead §9.6 Phase 2.)
> The cross-cutting items the modern thread *also* surfaced are already pulled
> near-term into Phase 1 (E6/E7/E8) — these rows are only the era-deep work.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E21 | **Enthusiasm / Party-Pref engine + Score economy** | The **4-part reshuffle** after legislation scoring (reshuffle enthusiasm by which faction gained most/least for the dominant vs opposition party) over the existing `enthusiasm`/`partyPreference` tables; `Faction.score` ledger (from E19) + **era-end awards** + **lowest-faction-penalizes-teammates**. Wires into E6's `metersToElectionBonus`. The spine of the modern election engine. | E6 (meter bank), E19 (`Faction.score`), K3 (era-end awards) | M–L | gap #51, mechanics §22.2 (`modern` 96-2039; drift in `gilded`/`fed`) — NEW | ready |
| E22 | **Presidential primary subsystem (2.9.1)** | Full subsystem: candidate eligibility + blocking (Iron-Fist PL blocks challengers; running incumbent can't be primaried), focus-state charisma-trait table, numeric Strength score, per-Primary-Group loop (debate momentum / scandal / Broke check / actions: Embrace Issue, Attack, Presidential Promise, Withdraw+endorse), delegate accumulation + transfer, primary-group assignment from gov actions. Uses the **CPU delegate engine** (from E10) + K2 primary action library. New `needsPlayerInput: 'primary'` + `primary?` ledger. | K2, E10 (CPU delegate engine), K0 | L | gap #47, mechanics §22.3 (`modern` 340-1704) — NEW | ready |
| E23 | **SCOTUS named-Justice docket (divergence #7)** | From-scratch over a **stub** (the shipped court is 4 hardcoded titles + `partyPreference ±0.1`, `phaseRunners.ts:3398-3414` — nothing rich is displaced). Per-term case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, Iron-Fist/Manipulative compel-vote + compel-retire (12-yr min, conditional bargain), dynamic court size + court-packing (age-70 bills), 64/60% confirmation + moderate-auto-confirm recovery, appointee ideology reveal + 10-yr drift, ruling→law-deactivation. Gates BUG-2 (`Chisholm` needs `!11th` from E5). | K0, E5 (amendments), E2 (court-packing bills) | M–L | gap #52, divergence #7, debt #18 (`modern` 30-2250) — NEW | ready |
| E24 | **Third-party challenge trigger (2.9.3)** | Party-pref-band + ideology-discontent check → spawn an independent ticket from the rule-selected faction (discontented faction of the incumbent's party; carve-out if the president's own ideology is the discontent one); nationwide ballot for a Celebrity. **Fills the 2.9.3 stub** (today a no-op "no challenge" log). | E21 (enthusiasm/Party-Pref engine) | M | gap #48, mechanics §22.4 (`modern` 400-2116) — NEW | ready |
| E25 | **Military-leadership appointment tier** | JCS / Army Chief / Chief of Naval Ops / Generals / Admirals above the existing `GeneralInChief`/`Admiral` seats; auto-confirm (no Senate vote); promotion back-fill; rank-mismatch + passed-over-resign rules. Feeds the generic-war per-battle modifiers (SecDef + Joint-Chiefs ×2, leading-officer ×10). Pairs with E3. | E3 (generic war), E16 (cabinet richness) | M | gap #49, mechanics §22.9 (`modern` 214-2182) — NEW | ready |
| E26 | **53-state roster + Wyoming-Rule apportionment + two-home-state pols** | Modern 53-state roster (DC/CU/PR as full states); decennial recompute that resets EV + `bias` + adds/removes a focus-Rep (same `pendingEvDeltas` mechanism from E15, at larger scale); `Politician.homeStates?: string[]` (audit relocation/Carpetbagger + kingmaker readers). **Needs E7 (House-slate persistence) first** — the Wyoming-Rule House size (~572–601) is *why* wall (b) is a hard prerequisite. | E7 (House-slate persistence), E15 (census-delta queue) | M–L | gap #55, #34, mechanics §22.10 (`modern` 185-2240) — NEW | ready |
| E27 | **Modern legislative depth** | Collective crisis-bill accountability (chamber lets most crisis bills die → controlling party loses Party Pref); bill-relationship/replacement graph (amendment-tier bills repealable only by amendment; downgrade-only policies); **Executive-Branch-Interference** (Admin 4–5 cabinet sec proposes dept bill w/ presidential assent; new-dept→new-seat). **Includes the two needs-design items: #54 investigation committees + DH-1 filibustered-MUST-pass remedy** — their rules must be **authored before build**. | E2 (bill typing), E14 (committees/filibuster); **#54 + DH-1 need rules authored first** | M | gap #54, #12b, DH-1, mechanics §22.8 (`modern` 32-2265) — NEW | **needs-design** (#54 + DH-1); rest ready |
| E28 | **Modern era scenario / continuation (`scenario1948`)** | The XL **capstone**: modern faction roster + nickname menu, modern era-event spine (fictional eras "Era of Terror"/"Era of Populism"), modern bill/issue catalog (tariff-power-to-President, income-tax brackets, healthcare, immigration, climate, Wall Street, gun control), modern card pool (Big Tech/Big Oil/Globalists/LW-RW Media — correct *here*). Reached via `advanceEra` (continuous campaign) or a `scenario1948` boot. **Dead last** — depends on every keystone + most subsystems above. | K3, K4, and most of E1–E27 | XL | gap #2, #41, mechanics §22 (`modern`, 2276 posts) — NEW | ready (build last) |

### Presentation track (parallel — separate workstream)

> Almost all of A1–A8 are **read-only views over snapshot data that already
> exists** — they don't depend on the keystones or the engine subsystems. Sync
> points are a handful of small additive `Politician`/`Party` fields + **two
> deeper handoffs**: A4 (battle-card) wires real numbers when **E3 (generic war)**
> lands, and **P2 (portraits) shares the demographic model with E8 (procedural pol
> generation)** — P2 must render *generated* pols, not just the real dataset.
> **Hard constraint, encode from day one: no AI-generated imagery or text in the
> shipped product** (A1; AI only as a throwaway PoC). **A9 is NOT on this track**
> — it is a state-shape + engine UX requirement (it lives at E7).

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| P0 | **Ideology→color palette** *(cross-cutting foundation — do first)* | `IDEOLOGY_COLORS: Record<Ideology, string>` in `src/theme/` (the per-*ideology* legend; `Party.color` exists but this does not). Many P-track items consume it (roster, congress, maps, score sheets, committee views). Independent of the engine track — can land immediately. | — | XS | gap A2, §9.1 K1.5 (`1772s` 12-71) — CARRIED | ready |
| P1 | **Politician card + roster/congress restyle (A2/A3/A5/A6)** | "Sport-card" infobox (portrait/traits/stats/PV/office), always-on styled scoreboard, era-correct office titles (per-(office,era,state) strings), honorific-memory + "remembered for…" legacy lines (small additive `Politician` fields, A6). | P0 | M | gap A3, A5, A6 (`1772s` 13-53) — CARRIED | ready |
| P2 | **Procedural portrait pipeline (A1)** *(no AI in product)* | CK2-style layered-sprite procedural portraits for the ~18.5k long tail + hand-art slots for marquee figures. Asset-pipeline + renderer epic (closer to the dataset pipeline §7 than to the engine). Only engine touchpoint: the additive `Politician.portrait?` field. **Must cover GENERATED pols** — shares the demographic model with **E8**; don't assume a closed real-person set. **Hard no-AI-in-product.** | P0; `Politician.portrait` field; shares demographic model with E8 | L | gap A1 (`1772s` 13-860; `modern` 456-1771) — CARRIED, extended | ready |
| P3 | **Election-result maps + iconography (A7)** | Election-result maps + era-correct national/state flags. Renderer can be prototyped on 1856; most valuable after more states exist (gilded E20, modern E26). **Batch-3 bar:** auto-generate the **53-state map + per-state popular-vote % atlas** the modern GM hand-builds every presidential election. | P0 | M | gap A7 (`1772s` 23-40; `modern` 131-1749) — CARRIED, extended | ready |
| P4 | **Narration voice (A8)** | A `log.ts` output-quality bar (in-character narration density), not a schema change. Smallest; ongoing. | — | XS–S | gap A8 (`1772s` 9-56) — CARRIED | ready |
| — | **A4 battle-card** *(wired by E3)* | The itemized additive-odds battle-card (difficulty + planning + commander + meters → % victory). Build the card shell early; wire real numbers when **E3 (generic war)** surfaces the itemized odds. | E3 | S | gap A4 (`1772s` 22-60) — CARRIED | ready |

---

## Later / parking lot

Bigger, fuzzier, deferred, or **needs-design-before-build**.

### Author-before-build (design tasks — a PM/design job, not a `/build-feature` run)

These have **no rules to build to yet** — the forum rulebook had no answer and a
human improvised. The rules must be **authored first**, then they fold into the
engine row noted.

- **DH-1 — filibustered "MUST-pass" bill remedy (needs-design).** A required
  bill filibustered to death has no rulebook remedy; the GM improvised a 4-leader
  special-committee auto-pass with a per-day "AMPU shutdown" penalty clock
  (EconStab drop + election penalties until they agree). **Author the
  deadlock-resolution rule** (forced-compromise vs shutdown-clock vs fallback
  auto-pass), then build into **E14c (filibuster)** / **E27**. — DH-1, debt #21
  (`modern` 640-716).
- **#54 — investigation committees (needs-design).** An "Investigate Lobby or
  Special Interest" bill forms a special committee that rolls for evidence,
  always targeting the *dominant* party. **Explicitly under-designed** — the
  designer left the rules blank and a player authored them mid-game. Author the
  rules, then build into **E27**. — gap #54, debt #21 (`modern` 1294-1372).

### Deferred / parking lot

- **Multiplayer — hot-seat (M1).** Round-robin the existing `needsPlayerInput`
  mechanism (`engine.ts:9`) across human factions before `advancePhase`.
  **Hard-blocked on K0 (determinism) AND on K2 + all six action libraries** — the
  player-input modalities *are* the action libraries (incl. the primary/convention
  loops), so building hot-seat first means re-validating against each. Also needs
  the singleton refactor: `playerFactionId` → `playerFactionIds: string[]` + audit
  every "is this me?" call site (debt #10). `modern` confirms solo + multiplayer
  are two modes of one engine (a player took over a CPU faction mid-campaign). —
  gap #1, §9.5.
- **Multiplayer — async / backend (M2, L–XL epic).** IndexedDB is per-browser
  (`db.ts`); shared state needs a server (or CRDT/host-authoritative sync) the
  repo lacks. Hard-blocked on K0 + M1. Exposes debt #6 (whole-snapshot
  clone+save bottleneck → per-store/delta writes). — gap #1, §9.5.
- **Bill-scoring Phase B (divergence #1).** Re-tune `cardVoteBias`
  (`phaseRunners.ts:1516`) to be per-card-aware once the E19 leaderboard is live
  and playtested. Pending evidence. — divergence #1.
- **Conversion-targeting refactor (divergence #3).** **Keep shipped for now.**
  Revisit only after E18 (faction-personality) emits a rule-driven `Can Party
  Flip` signal cleanly; the shipped multiplicative table works until then.
  (Listed as Phase-1 #19 in §9.6 "if pursued" — held here pending the call.) —
  divergence #3, debt #13.
- **Named-ordinal meter relabel (meter model, deferred presentation half).** The
  full labeled-ordinal meter *presentation* (vs the ±3 clamp in QW3 + crisis/
  cascade in E6) touches every meter read/write + the UI; ride it on the
  presentation track only if playtest says the numbers read poorly. The
  first-class war-score meter rides E3. — meter model §21.8/§22.1.
- **Far-future / progressive era (post-1892, pre-modern).** Feminists / socialists
  / communists / prohibitionists / eugenicists / labor activists; movement/
  coalition spawning across eras (#6). The `progressive` enum value is added in
  K4; a `progressive` scenario lifts in once a progressive digest lands. — gap #2,
  #6.
- **Gilded-Age issue *system* depth.** Per-issue interest groups, full era-event
  spines, imperialism annexation flow distinct from `admitState` — the
  *system-level* depth beyond the E20 data shells. — gap #3, #6.
- **Cabinet "free pick-up" legislation (12b) + foreign-volunteer scheduling
  (#46).** The 1772 Treasurer free-pickup variant; events that schedule a
  future-draftable figure (Lafayette 1784) routed to the lowest-scoring eligible
  faction. (The general Executive-Branch-Interference form is E27.) Small, no
  keystone dependency, lower priority. — gap #12b, #46.

---

## Sequencing notes

Why the order is what it is — the tech-lead's binding calls (§9.6).

1. **The two-track parallelization is still the biggest schedule lever** (tech-lead
   §9.4, §9.6):
   > "The engine track (keystones → subsystems) is a long dependency chain
   > bottlenecked on a few people who know the engine. The presentation track
   > shares almost no code with it and can be staffed independently. Running them
   > concurrently remains the single biggest schedule win."

   Sync points are a handful of small additive `Politician`/`Party` fields
   (portrait, honorific/legacy lines, `formedYear`, `homeStates`) and **two deeper
   handoffs**: A4 ↔ E3 (war odds) and **P2 ↔ E8** (portraits must render generated
   pols). Start the presentation track immediately with P0.

2. **K2 (ActionRegistry) is now the single most important keystone — ~6×
   leverage** (tech-lead §9.6 call #4, §6.6):
   > "Now confirmed across 4 eras; `modern` adds a 5th and 6th library (primary +
   > general-election actions). Building each ad-hoc is now a ~6× tax… The single
   > highest-leverage keystone — if only one lands this quarter, it is K2."

   E10 (inter-ballot), E11, E12, E13, **E22 (primary), and the E10 general-election
   actions** all read against this shape. The modern thread *raised* the keystone's
   justification, not lowered it.

3. **The two scaling walls are NEAR-TERM (engine Phase 1), not modern-only**
   (tech-lead §9.6 call #2):
   > "Persist/auto-fill House slates (wall b) improves 1856 now; procedural pol
   > generation (wall a) is required for *any* late-era play and bridges to the
   > portrait epic. Do not defer them to the modern epic."

   That is why E7 (House slates) and E8 (procedural pol gen) sit mid-Phase-1, ahead
   of the convention/library subsystems — and why E8 is a hard prerequisite of E9
   (sparse-state filler) and a soft fix for BUG-3, and E7 is a hard prerequisite of
   E26 (the 53-state roster). E8 also bridges to P2 (shared demographic model).

4. **The #8 cabinet correction — it is a wipe→retention refactor, sized M**
   (tech-lead §9.6 call #1, debt #17, §2.1.1):
   > "There **IS** a cabinet wipe-on-election (`phaseRunners.ts:3804-3812`) —
   > batch 2 wrongly said there wasn't. #8 is a real wipe→retention refactor (M,
   > engine Phase-1), not a small flag."

   The engine unconditionally clears every cabinet seat after every presidential
   general — even on incumbent re-election — and 2.3.1 re-fills from scratch next
   turn, so the cabinet churns every 4 years (the *opposite* of forum intent). The
   fix (remove the clear, retain ≤5 with CIA/FBI exempt, gate replacement on
   `firingPrecedentSet` + per-officer tenure + same-faction US-Bank guard) is
   bundled into **E16** because it shares the cabinet code. This re-sizes the
   batch-2 backlog item from XS ("small flag") to **M**.

5. **#7 SCOTUS is a from-scratch subsystem over a stub, and it is far-end**
   (tech-lead §9.6 call #1, debt #18):
   > "#7 (SCOTUS) is correctly a from-scratch subsystem, but over a *stub* (4
   > hardcoded titles + `partyPreference ±0.1`, `:3398-3414`) — nothing rich is
   > being displaced; it sits at the far end (Phase-2)."

   So **E23** is the easier case (nothing to migrate, just superseded), but it is
   deep-modern and depends on amendments (E5) + court-packing bills (E2) — hence
   Phase 2, after gilded.

6. **Federalism before gilded before modern; `scenario1788` (mid-government boot)
   before a fully-general `advanceEra`** (tech-lead §9.1.1, §9.6 call #4):
   > "Federalism content rides `scenario1788` first (no `advanceEra` dependency);
   > `advanceEra` lands in parallel as the keystone… K4's first new scenario is
   > `scenario1788`, not `scenarioGilded`."

   Federalism (E1) sits between the two built scenarios, is the best-documented
   unbuilt era, and exercises the most cross-era systems (generic war, per-state
   EC, amendments, bill-driven statehood) the roadmap needs anyway. Gilded (E20)
   follows once `advanceEra` + the libraries mature; **the modern era (E28) is the
   XL capstone, dead last** — it depends on every keystone and most subsystems.

7. **BUG-1 is a hard gate, not a "fix later"** (tech-lead §9.1.1, §9.6):
   > "The moment a 3rd scenario (1788/1800) ships, BUG-1
   > (`buildEraEventsForYear`, `phaseRunners.ts:2817`) stops being latent and
   > starts dropping/leaking era events. Fix BUG-1 in the same epic as (or just
   > before) `scenario1788`."

   QW1 is flagged in the quick-wins list *and* as a hard dependency of E1.
   **DH-2** (modern deck fired 2008 cards in 2018) is the **same scheduling
   surface** as BUG-1 + divergence #4 and is investigated together at E15 — not a
   separate item.

8. **RNG first (K0).** Determinism is the prerequisite for multiplayer (clients
   must agree on rolls) and any replay/test harness; it is a soft gate for every
   roll-heavy subsystem (war E3, convention rolls E10, governor d100s E11,
   filibuster E14c, primary rolls E22) **and a hard gate for the seeded procedural
   pol generator (E8)**. The 14 raw `Math.random` calls sweep cleanly once the
   PRNG is seated.

9. **Within-track dependency notes.** **E17g (the numeric `nationalSurplus`/
   `nationalDebt` integer) is a prerequisite for E2's spending cap *and* E6's debt
   field — build that sub-item early.** E4's global flip needs E5 (amendments).
   E9's statehood needs E2 (bill route) + E3 (war annexation) + E8 (filler
   officials). E14d (crisis tag) needs E2. E22 (primary) needs E10's CPU delegate
   engine. E24 (third-party) needs E21. E26 (53-state roster) needs E7. On the
   presentation track, P1/P2/P3 all consume P0, so P0 is first.

### Estimate caution

Sizes are the tech-lead's. Rows that may still feel XL after a first pass:

- **E1 (federalism epic)** — sized L but it is a full era's content; expect the
  era-event spine and the SCOTUS set to each be their own sub-PR.
- **E10 (convention)** — the single biggest unbuilt subsystem; **split into ~3**
  (ballot loop → inter-ballot library on K2 → platform/VP/scandal). Its
  inter-ballot library is the first real use of K2 and may surface registry-shape
  iteration costs (consider a thin spike PR if so). Its CPU delegate engine is
  shared with E22.
- **E14 (legislative micro-mechanics)** — four sub-mechanics sharing the bill
  pipeline; ship as 4 sequential sub-PRs (block-and-replace → packaging →
  filibuster → crisis tag).
- **E16 (cabinet & Congressional leadership + retention)** — the 9-role
  Congressional pipeline (RCV whip races) is the chunkier half; the cabinet-wipe
  retention refactor is coupled in; **split cabinet vs. Congress if either feels
  XL during scoping.**
- **E28 (modern era scenario)** — the XL capstone; expect it to decompose into
  roster + era-event spine + bill catalog + card pool sub-PRs, and it gates on
  most of Phase 1 + Phase 2.
- **P2 (portrait pipeline)** — an asset-pipeline epic, not a feature; the
  no-AI-in-product constraint shapes the tech choice from day one, and it must
  render generated pols (shared with E8).

---

## Provenance note

This reflects **batches 1–3**: the `f4c7c2c4` 1868 Gilded-Age multiplayer
dry-run, the `f55d3e21` 1788 federalism solo-with-AI playtest, the `85f8e6b4`
1772 solo aesthetic experiment, and now the `3a9ac985` **modern (1948→2020)
multiplayer campaign** (2276 posts — the most mechanically mature source). The
batch-2 roadmap was a two-track plan (engine + presentation); this re-sequence:

- **splits the engine track into three phases** — Phase 0 (keystones, incl.
  era-enum growth in K3/K4 + year-decoupling), Phase 1 (the federalism epic + the
  corroborated subsystems + the **three near-term cross-cutting items** the modern
  thread pulled forward), Phase 2 (the **far-end modern epic**, builds last);
- **pulls three items NEAR-TERM** (E6 meter-model generalization, E7 persist/
  auto-fill House slates, E8 procedural pol generation) out of the modern era —
  they are not era-gated and improve every era;
- **appends the far-end modern epic** (E21–E28: enthusiasm/Party-Pref engine,
  primary subsystem, SCOTUS docket, third-party trigger, military-leadership tier,
  53-state roster + Wyoming apportionment, modern legislative depth, modern
  scenario as the XL capstone);
- **corrects + re-sizes #8 (cabinet)** to an **M wipe→retention refactor** (the
  engine *does* wipe the cabinet every 4 years) folded into E16, and adds **#7
  (SCOTUS)** as a from-scratch subsystem over a stub at E23;
- **promotes ~30 rows to HIGH-CONFIDENCE (3–4 era)** — corroborated across three
  or four eras;
- **marks two needs-design items** (DH-1 filibustered-MUST-pass remedy, #54
  investigation committees) as author-before-build, parked until rules are
  authored, then folding into E14c/E27;
- **keeps multiplayer (M1 hot-seat + M2 async) in the parking lot** with explicit
  hard-blockers (now incl. all six action libraries).

**Still provisional.** Subsequent `/ingest-playtest` runs will refine scopes
(especially the convention/primary sub-splits, the SCOTUS compel mechanics, the
enthusiasm-reshuffle rules, the crisis taxonomy, modern apportionment size
601-vs-572, and the era-event scheduling fork), may re-split currently M-sized
rows, and may surface items now parked or unknown. **The order above is buildable
top-to-bottom today; re-validate on every digest.** Open design calls that gate
ordering (era-event scheduling hybrid, era-enum split, meter relabel,
procedural-generation distribution, DH-1/#54 rules) are tracked in
`game-context.md` → Open questions.

---

**Roadmap path:** `/home/user/AMPU/docs/game/roadmap.md`.
