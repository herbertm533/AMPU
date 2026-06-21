# AMPU — Roadmap

> **Batch-4 version — re-sequenced for the 1856-native "A House Divided" thread.**
> This roadmap was stood up from the codebase + tech-lead bootstrap (6 items),
> rebuilt against batch 1 (`f4c7c2c4`, 1868 Gilded-Age → 14 items), re-sequenced
> into **two parallel tracks** for batch 2 (`f55d3e21` 1788 federalism + `85f8e6b4`
> 1772 aesthetic), re-sequenced into **three engine phases** for batch 3
> (`3a9ac985`, the 2276-post modern campaign), and is now **re-sequenced for batch
> 4**, which absorbed `77db6e6f` — a **9051-post 1856-native "A House Divided" Part
> 2** campaign (1856→1904 alt-history multiplayer), the **first 1856-native
> procedural record** and the **only source for the Civil-War / Reconstruction /
> secession machinery**. Order within each track is binding from
> `technical-guide.md` §9.6 — **build top-to-bottom.**
>
> **What changed vs. the batch-3 roadmap** (all from §9.6 + §9.1.2, binding):
> 1. **BUG-0 (relocation cap `5`→`4`, `types.ts:247`) is now at the VERY FRONT of
>    the quick-wins** — a one-line const edit, no deps, no migration; the tech-lead
>    calls it *"the cheapest win in the whole roadmap."* The shipped engine simply
>    lags a design decision that went **live in the running playtest** (divergence
>    #9 — the clearest "the forum drives the build" evidence).
> 2. **A new Civil-War / Reconstruction epic lands at engine Phase-1 #3b** (E3b),
>    right after the generic war (E3) + ActionRegistry (K2), because it **completes
>    the already-shipped 1856 scenario** (whose spine dead-ends at the Trent Affair,
>    1861). Split cheap-first: secession (#58) + sectional crisis (#59) are cheap
>    antebellum-payoff parts; the two-theater war (#56) + Reconstruction (#57) +
>    Canada (#60) are the heavy parts. The generic war (E3) must now be **designed
>    multi-theater + tiered** so the Civil War is a *configured instance*, not a
>    rewrite.
> 3. **Per-era point BANKING (#68) is folded INTO the K3/K4 era keystones** (not a
>    new item) — `advanceEra` banks-and-zeros the running score at the boundary,
>    pays end-of-era awards, re-runs the pre-turn phases, and swaps content pools;
>    the per-era banks sum toward the (open) cross-era win total.
> 4. **#54 investigation committees moves from needs-design to READY** — `hd`
>    authored the 5d6 "3.0.40" spec (#65).
> 5. **New 1856-arc rows placed:** succession/acting-president (#61) + contingent
>    House election (#62) by the convention/election work (E10b); offices-created-
>    by-law (#66) folded into the cabinet+ActionRegistry item (E16); era-keyed
>    amendment ratification (#64) folded into the amendments item (E5); the draft
>    re-rule (#69) folded into K4's era-config.
> 6. **DH-3..DH-11 classified** — two cheap balance fixes promoted to quick-wins
>    (DH-3, DH-5), the rest folded into their subsystems or parked; **DH-8 (CPU
>    convention AI) is a must-own inside the convention epic** (a single-player game
>    can't ship a player-only convention).
>
> Tags carried from prior batches: Source column `gilded`/`fed`/`1772s`/`modern`/
> **`hd`** are the five digests; **NEW** = first appeared this batch; **CARRIED** =
> on a prior list; **HI-CONF** = corroborated ≥2 eras; **HI-CONF (N era)** = the
> strongest signal. **status:** `ready` = buildable now; `needs-design` = rules
> must be authored first. Sizes are the tech-lead's.

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic (PR1–7)
is complete; the knowledge-base infra and four ingestion batches are knowledge
milestones (no code, but they are what every item below is traced to).

- **Batch-4 ingestion (knowledge milestone).** Absorbed `77db6e6f` (the
  1856-native "A House Divided" Part 2, 1856→1904, 9051 posts — the first
  1856-native procedural record and the only source for the Civil-War /
  Reconstruction / secession era). It is mostly the **4th–5th corroboration** of
  the existing gap log across a new era (keystone calls unchanged), and adds: gap
  rows #56–#69 (Civil War, Reconstruction, secession, sectional-balance crisis,
  Canada, succession/acting-president, contingent election, Primary-Era opt-in,
  era-keyed amendment ratifier, the authored investigation 5d6 spec, the
  Progressive offices-by-law layer, the ~16-meter Lingering bank, per-era point
  banking, the 3/3 draft re-rule); divergence **#9** (the stale relocation cap →
  **BUG-0**); nine design holes **DH-3..DH-11** (incl. the GM-confirmed unstable
  CPU convention AI, DH-8). `game-mechanics.md` gained §23 (Civil-War/Reconstruction)
  + §24 (succession/contingent/offices) + the §2.5 banking note; `technical-guide.md`
  §9 re-sequenced (BUG-0 front; Civil-War epic at Phase-1 #3b; #54 ready;
  point-banking folded into K3/K4). _Complete._
- **Batch-3 ingestion (knowledge milestone).** Absorbed `3a9ac985` (the modern
  1948→2020 multiplayer campaign, 2276 posts). Gap log grew with modern rows
  #47–#55 + A9 + DH-1/DH-2; `game-mechanics.md` gained §22 + divergences #7/#8;
  `technical-guide.md` §9 re-sequenced into Phase-0/1/2, pulling the two scaling
  walls + meter generalization near-term; the cabinet-wipe finding corrected.
  _Complete._
- **Batch-2 ingestion (knowledge milestone).** Absorbed `f55d3e21` (1788
  federalism, 732 posts) + `85f8e6b4` (1772 solo aesthetic, 90 posts). Gap log to
  ~54 rows + A1–A8 presentation + 3 confirmed bugs; `game-mechanics.md` gained
  §20–§21 + divergences #4–#6; `technical-guide.md` §9 → the two-track plan.
  _Complete._
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
> bottlenecked dependency chain in **three phases**: Phase 0 (keystones), Phase 1
> (near-term subsystems — the federalism epic, the Civil-War epic that completes
> 1856, the cross-cutting items the modern thread pulled forward), Phase 2 (the
> far-end deep-modern epic, builds last). The presentation track shares only a
> handful of small additive `Politician`/`Party` fields + two deeper handoffs and
> can be staffed independently (tech-lead §9.4, §9.6).

### Quick-wins — land immediately (XS each, high feel-value)

Fixes + cheap divergence/balance resolutions. **BUG-0 is at the very top — the
cheapest win in the roadmap.** **BUG-1 is the exception that matters:** it is XS
but a **hard gate on the federalism epic** — land it *in or just before* E1. DH-2
(modern deck fired off-year cards) is the **same scheduling surface** as BUG-1 +
divergence #4 and is investigated at E15, not as its own quick-win.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| QW0 | **BUG-0 — relocation cap `5`→`4` (divergence #9)** *(do FIRST)* | **One-line const edit:** `RELOCATION_ATTEMPTS_PER_TURN = 4` at `types.ts:247` (shipped value is `5`). The designer changed it to 4 mid-thread and it went **live in the running playtest**; the browser engine never caught up. **Settled value, no migration** (a tunable const, not a save field), no dependency. The auto-Carpetbagger + 10-yr-expiry + alt-state-exemption *feature* is QW4 / E17 — this row is **only** the stale constant. **The cheapest win in the whole roadmap.** | — | XS | bug BUG-0 / divergence #9 (`hd` §0/I-1, 7062-7066, 7555) + codebase (`types.ts:247`) — NEW | ready |
| QW1 | **BUG-1 — era-event era-lock filter** *(federalism gate)* | Add an era-vs-start-year filter to `buildEraEventsForYear` (`phaseRunners.ts:2817`): an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table. Latent today; **a blocker the moment a 3rd scenario ships** — so this rides with E1. **Resolve together with DH-2 + divergence #4** (one scheduling surface). | — | XS | bug BUG-1 (`fed` 521-535), DH-2 (`modern` 2221) — CARRIED | ready |
| QW2 | **BUG-3 — no-PM-General fallback guard** | Defensive guard on the `GeneralInChief` fill path (`phaseRunners.ts:2255`): empty-pool ⇒ leave vacant + log (or auto-generate a stopgap officer — ties to E8 procedural pol gen). Closes a potential crash. | — | XS | bug BUG-3 (`fed` 5, 119) — CARRIED | ready |
| QW3 | **±3-per-phase meter-swing clamp (meter-model divergence)** | One-helper change: clamp every `NationalMeters` write to ±3 per phase (`types.ts:1399`). Orthogonal to the full named-ordinal relabel (parked) and to E6's crisis/cascade rules (which build on it). Cheap balance/feel win. | — | XS | meter model §21.8/§22.1 (`1772s`; `modern`) — CARRIED | ready |
| QW4 | **Auto-Carpetbagger on alt-state moves (divergence #2)** | Replace the 4-step probability ladder with auto-grant on a successful alt-state relocation; add 10-year expiry + exempt alt-state moves from the relocation cap (now 4/half-term after QW0). More legible; removes a dead dial. | QW0 (the cap value) | XS | gap #38, divergence #2 (`gilded` 36; `1772s` 3-52; `modern` 147; `hd` I-1) — HI-CONF (4 era) | ready |
| QW5 | **DH-3 — bar career-track pols from the presidency** | Add a guard at presidential-candidate eligibility (and CPU presidential selection) so career-track pols can't run — closing a GM-acknowledged rules gap (career-track is already barred from Gov/Rep/leadership/Kingmaker). Relates to the primary (E22) but is a cheap standalone guard now. | — | XS | DH-3 (`hd` 8205-8219; relates to #63) — NEW (balance) | ready |
| QW6 | **DH-5 — Kingmaker-pairing dissolution on flip** | A rule in the conversion path: converting/flipping a Kingmaker no longer seizes his protégés (or their +1 election standing) — flagged "insanely OP." Same code area as Reconstruction amnesty (E3b prunes broken Kingmaker pairs). Cheap balance fix on shipped Kingmaker/conversion machinery (`KINGMAKER_RULES` `types.ts:295`, `CONVERSION_ODDS` `:268`). | — | XS–S | DH-5 (`hd` 7589, 8762; relates to #29/#30) — NEW (balance) | ready |

---

### Engine track — Phase 0 (keystones)

**`K0 → (K1 ‖ K2 ‖ K3) → K4`.** After K0, K1/K2/K3 are independent and
parallelizable across PRs; K4 depends on K3. (Tech-lead §9.1, §9.6.) **K2 is the
single most important keystone (~6× leverage) — do it first if only one lands.**
**Batch-4: per-era point BANKING (#68) is folded into K3/K4 — not a new item.**

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| K0 | **Seed the RNG** | Drop a real PRNG (mulberry32/xoshiro) into `rng.ts:5`; store `seed` + state on `GameState` (optional + `repair()` backfill); migrate the **14** raw `Math.random` engine calls (election jitter `phaseRunners.ts:3711`, generic-war `:3603`, draft fallback `:188-198`, `revolutionaryWar.ts:89,97`, `continentalCongress.ts:271`). Keep wrapper signatures. | — | S–M | debt #1–#3 (determinism prereq for multiplayer + replay) — CARRIED | ready |
| K1 | **`State.policies` + `State.electionMethod` data shapes** | Two additive `State` fields (`types.ts:1318`): `policies?: Partial<Record<StatePolicyId, StatePolicy>>` (Poll Tax/Jim Crow/Prohibition/Women's Suffrage/Segregation; `multiplierUntilYear`) + `electionMethod?: 'popular'\|'legislature'`. `repair()` backfill `{}` / `'popular'`. Extend `Predicate` with `{ statePolicyActive }` + `{ electionMethodIs }`. | K0 | XS | gap #21 (`gilded` 125; `modern` 25-2245) + #44 (`fed` 194-373) — CARRIED, HI-CONF | ready |
| K2 | **`ActionRegistry<Ctx>` keystone** | Define `GameAction<Ctx>` + `ActionRegistry<Ctx>` once in `src/engine/actionRegistry.ts` (one ~80-line type covering id/label/`isAvailable`/`resolve`/`persistence`) + one UI Action Picker + one JSON-serializable persistence shape. Used by **six+** action libraries (governor/exec/diplomacy/convention-inter-ballot/primary/general — plus the Reconstruction readmission-plan + secession-trigger rows at E3b). **~6× tax if built ad-hoc — the highest-leverage keystone.** **Resolve DH-9 (canonical action ability-stat) before the `resolve` signatures harden.** | K0 | S | §6.6 (now confirmed **5 eras**; `hd` adds the Reconstruction/exec rows) + DH-9 — CARRIED, HI-CONF (5 era) | ready |
| K3 | **`advanceEra(snap, target)` + era-content registry + year-decoupling + per-era point BANKING (#68)** | Replace the hard-coded `currentEra = 'federalism'` in `constitutionalConvention.ts:198` with a pure callable transition. **The era boundary is now a bank-and-zero boot pipeline (#68), not a discard:** at the boundary, **bank the running per-era `Faction.score` into `eraPointBanks?: Record<Era,…>` and zero the running total**, **pay end-of-era awards**, **re-run the pre-turn phases (2.1.x→2.3.1)**, then swap content pools (card-pool + per-era card-count rescale, draft profile, SCOTUS set, nation renames, party-formation). The per-era banks **sum toward the (open) cross-era win total**. Lift the **5** `ERA_GRAPH_1772` spots in `eraGraph.ts` (`:4,:73,:113,:148,:164`) to `ERA_GRAPHS: Record<Era, GraphNode[]>`. **Gate content by `currentEra`, not literal year** (the alt-history clock makes year-based gating wrong). | K0 | M | gap #2 (`fed` 11,518; `modern` 1080,1172; **`hd` I-12, 6679-6816**) + #68 (banking), debt #5/#9 — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| K4 | **Era enum growth + `scenario1788` (federalism boot) + era-keyed draft-grant & ratifier tables** | Add the era value(s) the timeline needs — `gilded`/`progressive` between `nationalism` and `modern` (`Era`, `types.ts:1337`); fill every `Record<Era,…>` table the TS exhaustiveness check flags. **First new scenario is `scenario1788`, NOT gilded/modern** (§9.1.1): a mid-government boot on the `scenario1856` template (`scenario1856.ts:177-193`) — pre-seated Washington admin, start at phase 2.1.2. New files: `scenario1788.ts`, `factions1788.ts`, `states1788.ts`. Per-(faction, era) `FACTION_DRAFT_PROFILES`. **Add the era-keyed rookie draft-grant table (#69: 3 traits + 3 alt-states per the latest playtest; reverse-PV order + pick-position bonuses)** and the **era-keyed amendment-ratifier/threshold table stub (#64 — feeds E5).** | K3 | M–L | gap #2, #4, #41 (`fed`; `modern`) + #69 (`hd` 3, 2155) + #64 stub (`hd` I-9) — CARRIED + EXTENDED | ready |

### Engine track — Phase 1 (subsystems, dependency-ordered)

Ordered exactly per tech-lead §9.6 to minimize rework. The federalism epic (E1)
is one spine; **E3b (Civil War / Reconstruction) is the second — it completes the
already-shipped 1856 scenario** and sits right after generic war (E3) + K2, **not**
behind federalism or the modern tail (§9.1.2). Rows **E6–E8** are the **NEAR-TERM
cross-cutting items the modern thread pulled forward** — not modern-only.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E1 | **Federalism era epic (`scenario1788` content)** | A high-value epic. Era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events (~1792; `Party.formedYear`/`eraName`), 10-faction roster + nickname relabel, Mod/Cons draft profile, federalism SCOTUS set (`scotusFederalism.ts`). **Must land with BUG-1 (QW1).** Expect sub-PRs (event spine, SCOTUS set). **Independent of E3b — build whichever finishes a playable scenario faster (§9.1.2).** | K4, **QW1**, K1 | L | gap #2, mechanics §20 (`fed`) — CARRIED | ready |
| E2 | **Bill typing + budget-gated spending cap** | `Bill.type?: 'foundational'\|'spending'\|'crisis'` (`types.ts:1506`, none today) + numeric `game.spendingBudget?` reading the **numeric `nationalSurplus`/`nationalDebt`** (E17g), not the ordinal `revenue`. Non-crisis spending bills can pass the floor yet be "BLOCKED DUE TO BUDGET"; crisis bills bypass. `modern` adds a **bill-relationship/replacement graph** (its deep form rides E27, the type tag lands here). Prereq for crisis bills + the Hamiltonian program + the investigation-bill type (E14) + Reconstruction readmission bills (E3b). | K0; **E17g** (numeric surplus — build that sub-item early) | M | gap #42 (`1772s` B4; `fed` 159-703; `modern` 32-2265) — CARRIED, HI-CONF (3 era) | ready |
| E3 | **Generic cross-era war system (divergence #6) — designed multi-theater + tiered** | Generalize one `War` model: additive Chance-of-Success per battle, naval→land phasing (≥1 naval win first), warscore/momentum/×2 resolution, confirmation cascade (defeated commander → Incompetent + fired → Senate drama), loss-debuff. Replace the flat resolver (`phaseRunners.ts:3593-3627`) and **fold the 1772 Rev-War loop in as one configured instance**. **Design it with multi-theater + Major/Minor/Operation tiers in view so the Civil War (E3b) is a CONFIGURED INSTANCE, not a rewrite** (§9.1.2 — building the multi-theater model inside E3b first would mean writing it twice). Outcome grants/denies territory (couples to E5/E9-statehood). Pairs with A4 battle-card (P-track) + the Phase-2 military tier. | K0, **QW2** | M–L | gap #45, divergence #6 (`fed`; `1772s`; `modern`; **`hd` I-1 is the deepest spec — generalizes from #56**) — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| **E3b** | **Civil-War / Reconstruction epic [1856-arc — COMPLETES the shipped 1856 scenario]** | The Major-tier instance of E3. **Placed here (right after E3 + K2) because it finishes a half-built playable scenario** — `scenario1856.ts` ships but its spine dead-ends at the Trent Affair (1861) (§9.1.2). **Split cheap-first into sub-PRs:** **(a) secession gating (#58)** — `Politician.allegiance?: 'union'\|'secessionist'` + a "Secessionists" inactive pool keyed to seceded/border-state membership + `Southern Unionist` trait reads + draft-pool tagging + no-relocate-into-rebel-state + CSA officeholder seeding (cheap, additive); **(b) free/slave sectional-balance crisis (#59)** — derived from the existing `SLAVE_STATES_1856` set: while free > slave in `nationalism`, the fixed score/meter/election penalty package fires, retired on emancipation (cheap, no new field); **then the heavy parts:** **(c) the two-theater war (#56)** — East/West theaters, 3-naval-wins-gate-land, per-theater WarScore (+10 auto-win + carry-roll), named-battle casualties on the military track, Union-victory reward incl. the **permanent president +1-all-elections**, war-hero <20yr bonus; **(d) Reconstruction readmission (#57)** — a `reconstruction?` state-status enum + per-state readmission **bills** (E2) that gate Gov/Rep/Senate unlock + a time-boxed `+2-toward-incumbent` bias modifier + the 3-plan exec action (K2) + amnesty law that removes-or-returns pols (prune broken Kingmaker pairs — same code as QW6) + carpetbagger-doubling; **(e) Canada conquest → era-gated statehood (#60)** — per-(state,era) admission gating on the statehood pipeline (E9), a bonus Canadian draft pool on annexation, native-born relaxation, Canada-region election penalties. | **E3** (multi-theater war), **K2** (readmission/secession actions); (d) needs E2 (bills); (e) needs E9 (statehood pipeline) | L (split 5 sub-PRs) | gap #56–#60 (`hd` I-1..I-5; secession I-2, sectional I-4) — **NEW** | ready |
| E4 | **Per-state presidential-election method (divergence #5)** | Legislature-method states award EV from seated-legislature party majority instead of popular vote in `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`). Flipped per-state by era event, globally by amendment (E5). Decisive in 1796 (CT/GA/MA/NJ/NY/RI/SC). | K1 (the field), E5 (global flip) | M | gap #44, divergence #5 (`fed` 194-373) — CARRIED | ready |
| E5 | **Constitutional amendments as durable state (incl. era-keyed ratifier #64)** | `GameState.amendments?: { id; passedYear; data? }[]` + amendment bill type + **2/3-House pass gate** + **cross-state ratification vote that can fail** + **grandfather clause**. **Ratifier + threshold are an era-keyed, in-game-changeable field (#64):** `fed`/`gilded` by legislatures; **`modern` by GOVERNORS (40 of 53)**; **1856 by 3/4 of GOVERNORS, with the threshold itself tunable by a passed amendment** (options table → faction-enthusiasm side effects; Gilded default drops to 2/3 of states). Effect-binding: term-length (4↔6), popular-vote-everywhere (→ E4), VP-vacancy fill (→ E10b), suffrage, court size. Add a **SCOTUS-ruling-gates-a-bill-class-until-amendment hook** (`hd`: *Pollock* → no income-tax bill until ratification; couples to E23). Extend `Predicate` with `{ amendmentPassed }`. **Gates BUG-2.** | K0; K4 (ratifier table stub) | M | gap #39 (`gilded`+`fed`+`modern`) + #64 (`hd` I-9) — CARRIED + EXTENDED, HI-CONF (4 era) | ready |
| E6 | **Meter-model generalization [NEAR-TERM]** | Banded-text ladders over the existing 7 `NationalMeters` fields + crisis entry/exit by tier + cascade rules (one meter caps/forces another) + top-of-ladder effects (**Honest-Gov't maxed kills Machines + Gerrymandering**) + numeric `nationalDebt` integer + `metersToElectionBonus()` from the canonical "State of the Meters" table. **A 1:1 WIDENING of `NationalMeters`, not a relabel.** `hd` extends to the **full ~16-meter bank** (#67): era-gated per-power relation meters (incl. an inactive "Israel" placeholder) + per-ideology enthusiasm meters + the **9-part Lingering resolution order** + hard caps (Mil-Prep/Planet-Health = 8) + tax/tariff decay timers + **policy-gated caps** (Healthcare→QoL ≤7, Honest-Gov→machines/gerrymander). Builds on QW3's ±3-clamp. Benefits *every* era. | K0; E17g (the debt field) | M | gap #50 (`modern`) + #67 (`hd` I-12) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E7 | **Persist + auto-fill House slates & committees [NEAR-TERM — scaling wall b]** | Store a faction's House candidate slate + committee rosters on the snapshot; **carry-forward + bulk auto-fill by default**. The "computer owns the deterministic tedium" theme. **A UX wall, not modern-only** — improves 1856's 31-state congress now; a human **quit** over the manual tedium at 53-state scale. Do **before** the deep-modern roster (E26). | `repair()` backfill for the new fields | M | gap A9, debt #20 (`modern`; also `1772s` Lingering/Committees) — CARRIED | ready |
| E8 | **Procedural pol generation [NEAR-TERM — scaling wall a]** | A **runtime, seeded** generator (lives in `src/engine/`, uses `rng.ts`) emitting `ImportedDraftee` rows when the real ~18.5k dataset is dry; reuses `instantiateDraftees` (`phaseRunners.ts:114`). Stat/ideology/trait/demographic distribution (GM wanted "some moderates") + a **plausible, ethnically-varied, toggleable name engine**. **Required for ANY late-era play** AND fixes sparse-state filler (#43) AND BUG-3's stopgap officer. **The bridge to the portrait epic (P2)** — shares the demographic model with P2. | K0 (seeded RNG) | M–L | gap #43, A1, debt #19 (`modern`; `fed`) — CARRIED, HI-CONF | ready |
| E9 | **Bill-driven statehood + auto-generated officials (incl. era-gated admission)** | Statehood/territory bills route → `admitState` (`territories.ts:8`, today only 1772 era-event `postEffects`); event/war annexation; organized/unorganized status; **filler officials via E8's generator**. Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories. **Add per-(state, era) admission gating** (the hook E3b's Canada arc #60 rides: 1856 Quebec→statehood directly, Ontario must be a territory, NL/NM/Utah locked until Gilded). | E2 (bill route), E3 (war annexation), E8 (filler officials) | M | gap #43 (`fed`) + per-era gate (`hd` I-5 / #60) — CARRIED + EXTENDED | ready |
| E10 | **Convention machinery (2.9.2) — must OWN the CPU AI (DH-8)** | The **single biggest unbuilt subsystem** — replaces the `engine.ts:69` one-liner. Multi-ballot loop + momentum (carries across cycles) + unit-rule; **inter-ballot action library on K2** (Force Rules Change, Presidential Promise — *offer-DOWN/request-UP direction rule*, Drop & endorse, Kingmaker, Ballot shift); 5-plank platform + comparison (+ failed-platform <50%-planks penalty); VP-impact scorer; scandal/faithless-elector rolls; **host-advantage** + **PL-overrules-VP**; **CPU delegate engine** (per-state EV × category multiplier — shared with the Phase-2 primary). **MUST OWN the CPU convention side — DH-8 is a GM-confirmed unstable AI; a player-only convention is not shippable in a single-player game** (most factions are CPU). **Resolve the ambiguous ballot-shift rule (GM ruled next-round) + the DH-7 R/D threshold asymmetry + Iron-Fist-rules-change re-gate inside this epic.** **Split into ~3 sub-PRs** (ballot loop → inter-ballot library → platform/VP/scandal + CPU AI). | K0, K2 | L–XL (split 3) | gap #13–#19 (`gilded`/`fed`/`modern`; **`hd` 3261-4726, 5594-5713**) + DH-7 + **DH-8** — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| **E10b** | **Succession / eligibility / acting-president (#61) + contingent House election (#62) [1856-arc election additions]** | Two coupled election-system additions surfaced by `hd`. **(1) Succession/eligibility (#61):** `Politician.bornForeign?: boolean` gating the presidency (and convention Major candidacy); a **configurable, legislatable line of succession** (`successionOrder?: OfficeType[]`); an **`actingPresident?` state whose `command` (often 0) gates exec actions / SCOTUS-compel / re-election eligibility** (a 0-Command acting president is inert); era-gate the VP-vacancy-fill on the amendment (E5). **(2) Contingent election (#62):** on no EC majority, a House contingent path — **1-vote-per-state by delegation majority, Governor-party tiebreak; Senate elects VP** — with a **configurable `contingentTopN: 2\|3` cutoff (DH-6: GM used top-2; build picks a stated rule)** + the **tied-chamber inverse-control rule** (a tied chamber is controlled by whoever does NOT control the other). Slots into the same EC tally code as E4. **Folds DH-3** (career-track presidential bar — landed early as QW5, enforced here in the candidate pool). | E10 (convention/EC work), E5 (VP-vacancy amendment) | M | gap #61 (`hd` I-6) + #62 (`hd` I-7) + DH-6 + DH-3 — **NEW** | ready |
| E11 | **Governor's actions library (2.5.2)** | ~14 named, era-flavored actions on the registry; d100 vs 20·governing (Efficient → +1 action; **skill-match doubles success; 5-Gov autopass; success → 10% +1 Command except autopass; Gov incumbency decay after 8/12 yrs** — `hd`); per-action prereqs incl. **ideology gate** + **Honest-Gov't gate** + state-status; reads/writes `State.policies`. Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Era row-sets via the per-era registry index (modern adds primary-control + voter-suppression + culture; **`hd` adds "Activate State Primaries" #63**). | K1, K2 | M | gap #20 (`gilded`/`fed`/`1772s`/`modern`; **`hd` 2936-6997**) — CARRIED, HI-CONF (5 era) | ready |
| E12 | **Diplomacy actions library (2.7.1)** | Increase Relations / Increase Trade / Extend Credit (adds debt) / Provoke (war-trigger) with success/blunder rolls, on the registry. Seed per-power roster on `GameState.diplomacy`: era-dependent (5 federalism; +China gilded, Prussia→Germany 1871; **8 modern** +Japan/Israel). **Cap "Extend Credit to all nations" — DH-4** (a diminishing-returns / cap rule against the near-auto-win stacked bonus). | K2 | M | gap #25b, #26 (`gilded`/`fed`/`modern`) + DH-4 (`hd` 7346) — CARRIED, HI-CONF (3 era) | ready |
| E13 | **Executive actions library (2.8.1)** | N actions/half-term on the registry (N varies by traits; `Easily Overwhelmed` → VP hand-off; control-handoff chain Incompetent-Pres → VP → Manipulative advisor, open multi-manipulator tie-break). Persistent `GameState.activeExecutiveActions` with green/yellow expiry; **auto-deactivate sweep on admin change** (2.9.4); per-action policy/govt-type gating + blunder rolls. Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. **Encode the DH-10 `blunderStillScores?` per-action flag** (a blundered implementation scores + moves meters "as if it succeeded" unless an action overrides) **and apply the DH-9 canonical ability-stat** decided at K2. | K2; admin-change hook; DH-9 (from K2) | M | gap #23, #23b (`gilded`/`fed`/`modern`) + DH-10 (`hd` 8649-8672) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E14 | **Legislative micro-mechanics (incl. investigation committees #54 — now READY)** | Sub-PRs on 2.6.1–2.6.3: (a) committee block-and-replace (chair may replace only a bill whose proposer has LESS Legislative AND lacks Efficient — `hd`); (b) bill packaging (won't-bundle-net-negative-unless-statehood; no split-vote); (c) filibuster (a **standing rule toggled ON by a law**; Disharmonious filibusters twice; filibustered bills carry + must re-pass BOTH chambers; **no Cloture until the Cloture bill passes**, ⅔ — `hd`); (d) `(Crisis)` tag + `Legislation.resolvesCrisis?` + `GameState.activeCrises?`; **(e) investigation committees (#54 — now READY): the authored 5d6 "3.0.40" spec (#65)** — Speaker forms Chair+Ranking+3, roll 5d6 + 4 modifiers, 21–25 ⇒ guilty (resign + cabinet ban + ripples), dominant-party targeting, Court-Martial-d6 fallback. | K0, E2 (crisis + investigation bill type) | M (split 5) | gap #8–#11 (`gilded`/`fed`/`modern`; **`hd`**) + #54 ready via #65 (`hd` I-10) — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| E15 | **Era-event extensions** | Widen `EraEvent.decider: Role\|Role[]` (roll per role); foreign-territory grants en bloc (Oregon Treaty → BC/WA/OR/ID; organized/unorganized status); `GameState.pendingEvDeltas?` applied in 2.10 on `year % 10` (census timing: run decade N, take effect N+2; focus-rep seats); Egghead-cabinet advisory step + implementation-roll layer (difficulty tiers, trait re-rolls, blunder→scandal). **Resolve the scheduling fork [divergence #4 + BUG-1 + DH-2] here** — keep the graph, layer the cap. | K1, K3 | M | gap #22, #33, #34, divergence #4 (`gilded`/`fed`/`modern`) — CARRIED, HI-CONF (3 era) | ready |
| E16 | **Cabinet & Congressional leadership richness + cabinet retention (#8) + offices-created-by-law (#66)** | **Coupled jobs, share the code.** (1) Richness: region-coverage + **diversity floor (≥25% women/minorities)** + **intra-party faction-equity** malus; state-status eligibility guard; Ministers-to-foreign-powers seats; **Congressional 9-role pipeline** (Speaker/Maj-Min Leaders/Whips/Pro-Tem-by-seniority; RCV/weighted vote; committee-eligibility-by-prior-service; CPU auto-fill); **6-criterion faction-leader cascade** + anointing; PL fatigue + on-elect bundle + **suppress 2.2.4 + inter-party conversion in `independence`**. (2) **Cabinet retention — replace the wipe:** remove the unconditional cabinet clear at **`phaseRunners.ts:3804-3812`** (it fires every presidential cycle, even on re-election); retain occupants (modern: keep ≤5, CIA/FBI exempt), add per-officer tenure + `firingPrecedentSet` gate on *replacement* + same-faction US-Bank guard + opp-party cap. (3) **Offices-created-by-law (#66):** model offices as **data created/destroyed by bills + exec actions** (`createdOffices?`), not a fixed `cabinetSeatsForYear` — Fed Chair (6-yr; creating the Fed deactivates the Independent Treasury), Chief of Staff (+1 exec action), CNO (replaces Sr Admiral; +1 Command), FBI Director (10-yr, off the 5-cap), Commerce/Labor split. **Consider splitting cabinet vs. Congress vs. offices-by-law if any feels XL.** | K0; K2 (offices-by-law actions) | L (split) | gap #25, #28–#32, divergence #8 (`gilded`/`fed`/`1772s`/`modern`) + #66 (`hd` I-11) — CARRIED + CORRECTED + EXTENDED, HI-CONF (4 era) | ready |
| E17 | **Small consistency PRs (cluster)** | Cheap independent wins: (a) old-age stat decay (age-keyed; `modern` adds add-negative-trait / strip-trait); (b) defeated-incumbent auto-retire (only-if-ran; 6yr loss-malus amendment-gated; −1 defeat malus); (c) industry-leadership compute + scoring (per-era industry set incl. the modern 8; regional shifts) + per-state `governorTermLength`/`termLimits`; (d) tariff integer + change-cadence + president-tariff-power toggle; **(g) `GameState.nationalSurplus?`/`nationalDebt?: number` distinct from `meters.revenue` — prereq for E2's cap + E6's debt field; BUILD THIS SUB-ITEM EARLY.** | mostly — | XS–S each | gap #35–#38, #27, #3 (`gilded`/`fed`/`1772s`/`modern`) — CARRIED, HI-CONF (3 era) | ready |
| E18 | **Faction-personality 5-step distribution + per-era card pool + nicknames** | The **full 5-step allocation** algorithm (`1772s` B9) alongside the existing per-half-term drift. Plus **per-era card-count rescale** at boundaries (can split Prog/LW-Pop across 2 factions). Plus the per-(party, era, ideology) nickname table gated by leader traits + player-edit override. **Rebalance inelastic lobby cards — DH-11** (raw-pol-count-driven → a trifecta party can lack lobbies). | K3/K4 (era enum) | M | gap #24, #5, #40 (`1772s`/`gilded`/`fed`/`modern`) + DH-11 lobby half (`hd` 7799) — CARRIED + EXTENDED, HI-CONF (4 era) | ready |
| E19 | **Bill-scoring leaderboard (divergence #1, Phase A)** | Add `legislativeScoring(bill, faction)` (±50/100/150 per matching ideology+lobby+interest card; **failed bills also score** + ±1 per-pol reelection deltas) onto a new `Faction.score?` ledger — **the same per-era running score K3 banks-and-zeros at the boundary (#68)** and the Phase-2 enthusiasm engine (E21) consumes. Keep `cardVoteBias` (`phaseRunners.ts:1516`) as the **vote-probability** input for floor votes. (Phase B parked.) | K0; K3 (banking consumes `Faction.score`) | M | gap #12, divergence #1 (`gilded`/`1772s`/`modern`) — CARRIED, HI-CONF (3 era) | ready |
| E20 | **Gilded scenario** | The Gilded-Age scenario boot, **once `advanceEra` (K3) + the action libraries (E11–E13) are mature** (§9.1.1). Gilded issue *shells* (tariff integer from E17d, `MonetaryRegime` enum, civil-service/anti-corruption, imperialism naval bases) get a data home here; full system depth is parked. Resolves the gilded-enum question. | K3, K4, E11, E12, E13 | M–L | gap #2, #3, #41 (`gilded`) — CARRIED | ready |

### Engine track — Phase 2 (FAR-END modern epic — builds LAST, after gilded)

> The **deep-modern subsystems** — they sit at the end of the timeline and depend
> on the meter bank, the action libraries, and the scaling walls all landing
> first. Build them **after E20 (gilded)** (§9.6 Phase 2). The cross-cutting items
> the modern thread *also* surfaced are already pulled near-term into Phase 1
> (E6/E7/E8) — these rows are only the era-deep work.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E21 | **Enthusiasm / Party-Pref engine + Score economy** | The **4-part reshuffle** after legislation scoring (`hd` dominant-party point-impact: most/least-earning faction shifts ±1, opposition-least +2 "furious") over the existing `enthusiasm`/`partyPreference` tables; `Faction.score` ledger (from E19) + **era-end awards + per-era banking (handled by K3) + lowest-faction-penalizes-teammates**. Wires into E6's `metersToElectionBonus`. The spine of the modern election engine. | E6 (meter bank), E19 (`Faction.score`), K3 (era-end awards/banking) | M–L | gap #51 (`modern`; **`hd` 1394-7799, I-12**) — CARRIED, HI-CONF (2 era) | ready |
| E22 | **Presidential primary subsystem (2.9.1) + Primary-Era opt-in (#63)** | Full subsystem: candidate eligibility + blocking (Iron-Fist PL blocks; running incumbent can't be primaried), focus-state charisma-trait table, numeric Strength score, per-Primary-Group loop (debate momentum / scandal / Broke check / actions). Uses the **CPU delegate engine** (from E10) + K2 primary action library. **`hd` adds the emergent Primary-Era calendar (#63):** a Gov "Activate State Primaries" action (WTA/plurality/proportional + Primary-Group 1–5 assignment) flips a Primary-Era flag (primaries precede the convention), spreading by bill/Gov-action; Momentum carries between groups but halves when large; resign-to-run cascade. New `needsPlayerInput: 'primary'` + `primary?` ledger. | K2, E10 (CPU delegate engine), K0 | L | gap #47 (`modern`) + #63 (`hd` I-8) — CARRIED + EXTENDED | ready |
| E23 | **SCOTUS named-Justice docket (divergence #7)** | From-scratch over a **stub** (4 hardcoded titles + `partyPreference ±0.1`, `phaseRunners.ts:3398-3414`). Per-term case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, Iron-Fist/Manipulative compel-vote + compel-retire (12-yr min; **5 Judicial + Integrity = immune** — `hd`), dynamic court size + court-packing, 64/60% confirmation + moderate-auto-confirm recovery, appointee ideology reveal + 10-yr drift, ruling→law-deactivation. **`hd` adds:** a **5-5 tie affirms the lower court & sets no precedent**, and a ruling can **block a whole bill class until an amendment passes** (couples to E5's #64 hook). Gates BUG-2. | K0, E5 (amendments + the bill-class-block hook), E2 (court-packing bills) | M–L | gap #52, divergence #7 (`modern`; `hd` 4616-8651) — CARRIED + EXTENDED, HI-CONF (2 era) | ready |
| E24 | **Third-party challenge trigger (2.9.3)** | Party-pref-band + ideology-discontent check → spawn an independent ticket from the rule-selected faction; nationwide ballot for a Celebrity. **Fills the 2.9.3 stub.** **Rebalance the apparent Dem structural bias — DH-11** (Dems reportedly "won every instance a 3rd-party run mattered"). | E21 (enthusiasm/Party-Pref engine) | M | gap #48 (`modern`) + DH-11 3rd-party half (`hd` 7480-block) — CARRIED + EXTENDED | ready |
| E25 | **Military-leadership appointment tier** | JCS / Army Chief / CNO / Generals / Admirals above the existing `GeneralInChief`/`Admiral` seats; auto-confirm; promotion back-fill; rank-mismatch + passed-over-resign rules. Feeds the generic-war per-battle modifiers (SecDef + Joint-Chiefs ×2, leading-officer ×10). Pairs with E3/E3b. | E3 (generic war), E16 (cabinet richness) | M | gap #49 (`modern`; pairs with `hd` #56) — CARRIED, HI-CONF (2 era) | ready |
| E26 | **53-state roster + Wyoming-Rule apportionment + two-home-state pols** | Modern 53-state roster (DC/CU/PR as full states); decennial recompute that resets EV + `bias` + adds/removes a focus-Rep (same `pendingEvDeltas` as E15, larger scale); `Politician.homeStates?: string[]` (audit relocation/Carpetbagger + kingmaker readers — also the alt-state add from #69). **Needs E7 (House-slate persistence) first** — the Wyoming-Rule House size (~572–601) is *why* wall (b) is a hard prerequisite. | E7 (House-slate persistence), E15 (census-delta queue) | M–L | gap #55, #34 (`modern`) — CARRIED, HI-CONF | ready |
| E27 | **Modern legislative depth** | Collective crisis-bill accountability (chamber lets most crisis bills die → controlling party loses Party Pref); bill-relationship/replacement graph (amendment-tier bills repealable only by amendment; downgrade-only policies); **Executive-Branch-Interference** (Admin 4–5 cabinet sec proposes dept bill w/ presidential assent; new-dept→new-seat). **#54 investigation committees already shipped at E14e** (5d6 spec ready). **DH-1 (filibustered MUST-pass remedy) still needs rules authored first** — author the deadlock rule, then build into E14c/here. | E2 (bill typing), E14 (committees/filibuster); **DH-1 needs rules authored first** | M | gap #54, #12b, DH-1 (`modern`) — CARRIED | **needs-design** (DH-1 only); rest ready |
| E28 | **Modern era scenario / continuation (`scenario1948`)** | The XL **capstone**: modern faction roster + nickname menu, modern era-event spine (fictional eras), modern bill/issue catalog, modern card pool (Big Tech/Big Oil/Globalists/LW-RW Media — correct *here*). Reached via `advanceEra` (continuous campaign) or a `scenario1948` boot. **Dead last** — depends on every keystone + most subsystems above. | K3, K4, and most of E1–E27 | XL | gap #2, #41, mechanics §22 (`modern`) — CARRIED | ready (build last) |

### Presentation track (parallel — separate workstream)

> Almost all of P0–P4 are **read-only views over snapshot data that already
> exists** — independent of the keystones/engine subsystems. Sync points are a
> handful of small additive `Politician`/`Party` fields + **two deeper handoffs**:
> A4 (battle-card) wires real numbers when **E3 (generic war)** lands, and **P2
> (portraits) shares the demographic model with E8 (procedural pol generation)** —
> P2 must render *generated* pols. **Hard constraint, encode from day one: no
> AI-generated imagery or text in the shipped product.** **A9 is NOT on this track**
> — it is a state-shape + engine UX requirement (it lives at E7).

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| P0 | **Ideology→color palette** *(cross-cutting foundation — do first)* | `IDEOLOGY_COLORS: Record<Ideology, string>` in `src/theme/` (the per-*ideology* legend; `Party.color` exists but this does not). Many P-track items consume it. Independent of the engine track. | — | XS | gap A2, §9.1 K1.5 (`1772s`) — CARRIED | ready |
| P1 | **Politician card + roster/congress restyle (A2/A3/A5/A6)** | "Sport-card" infobox (portrait/traits/stats/PV/office), always-on styled scoreboard, era-correct office titles, honorific-memory + "remembered for…" legacy lines (small additive `Politician` fields). | P0 | M | gap A3, A5, A6 (`1772s`) — CARRIED | ready |
| P2 | **Procedural portrait pipeline (A1)** *(no AI in product)* | CK2-style layered-sprite procedural portraits for the ~18.5k long tail + hand-art slots for marquee figures. Asset-pipeline + renderer epic. Only engine touchpoint: the additive `Politician.portrait?` field. **Must cover GENERATED pols** — shares the demographic model with **E8**. **Hard no-AI-in-product.** | P0; `Politician.portrait` field; shares demographic model with E8 | L | gap A1 (`1772s`; `modern`) — CARRIED | ready |
| P3 | **Election-result maps + iconography (A7)** | Election-result maps + era-correct national/state flags. Prototyped on 1856; most valuable after more states exist. **Batch-3 bar:** auto-generate the **53-state map + per-state popular-vote % atlas**. | P0 | M | gap A7 (`1772s`; `modern`) — CARRIED | ready |
| P4 | **Narration voice (A8)** | A `log.ts` output-quality bar (in-character narration density), not a schema change. Smallest; ongoing. | — | XS–S | gap A8 (`1772s`) — CARRIED | ready |
| — | **A4 battle-card** *(wired by E3)* | The itemized additive-odds battle-card (difficulty + planning + commander + meters → % victory). Build the card shell early; wire real numbers when **E3 (generic war)** surfaces the itemized odds — and reuse it for E3b's two-theater Civil-War battles. | E3 | S | gap A4 (`1772s`; `hd` I-1) — CARRIED | ready |

---

## Later / parking lot

Bigger, fuzzier, deferred, or **needs-design-before-build**.

### Author-before-build (design tasks — a PM/design job, not a `/build-feature` run)

These have **no rules to build to yet**; the rules must be **authored first**, then
they fold into the engine row noted. (Batch 4 **removed #54** from this list — `hd`
authored its 5d6 spec, so it is now READY at E14e.)

- **DH-1 — filibustered "MUST-pass" bill remedy (needs-design).** A required bill
  filibustered to death has no rulebook remedy; the GM improvised a 4-leader
  special-committee auto-pass with a per-day "shutdown" penalty clock. **Author the
  deadlock-resolution rule** (forced-compromise vs shutdown-clock vs fallback
  auto-pass), then build into **E14c (filibuster) / E27**. — DH-1, debt #21
  (`modern` 640-716). **The remaining under-designed legislative hole.**

> **Author-before-build calls that are owned INSIDE a subsystem epic** (not
> standalone parking items — listed here so they aren't lost):
> - **DH-6** (contingent-election top-2 vs top-3) — pick a stated `contingentTopN`
>   inside **E10b**.
> - **DH-7** (R/D convention-threshold asymmetry + Iron-Fist unilateral change) —
>   document a chosen rule + re-gate the rules-change power inside **E10**.
> - **DH-8** (CPU convention AI unstable + ambiguous ballot-shift) — **the
>   convention epic E10 MUST OWN the CPU side**; firm both specs (ballot-shift:
>   next-round) inside it. A player-only convention is not shippable single-player.
> - **DH-9** (canonical exec/gov action ability-stat) — decide **at K2**, before
>   the action libraries author their `resolve` stat.
> - **DH-10** (blundered implementations still score) — a per-action
>   `blunderStillScores?` data flag, encoded at **E13**.

### Balance dials (fold into the named subsystem; no standalone build)

- **DH-4** — cap "Extend Credit to all nations" → **E12** (diplomacy library).
- **DH-11** — apparent Dem 3rd-party bias → **E24**; inelastic lobby cards →
  **E18** (card algorithm).
- (DH-3 / DH-5 were cheap enough to promote to quick-wins QW5/QW6.)

### Deferred / parking lot

- **Multiplayer — hot-seat (M1).** Round-robin the existing `needsPlayerInput`
  mechanism (`engine.ts:9`) across human factions before `advancePhase`.
  **Hard-blocked on K0 (determinism) AND on K2 + all six action libraries** — the
  player-input modalities *are* the action libraries. Also needs the singleton
  refactor: `playerFactionId` → `playerFactionIds: string[]` + audit every "is this
  me?" call site (debt #10). `modern` + `hd` confirm solo + multiplayer are two
  modes of one engine (players took over CPU factions mid-campaign). — gap #1, §9.5.
- **Multiplayer — async / backend (M2, L–XL epic).** IndexedDB is per-browser
  (`db.ts`); shared state needs a server (or CRDT/host-authoritative sync). Hard-
  blocked on K0 + M1. Exposes debt #6 (whole-snapshot clone+save bottleneck). —
  gap #1, §9.5.
- **Bill-scoring Phase B (divergence #1).** Re-tune `cardVoteBias`
  (`phaseRunners.ts:1516`) per-card-aware once the E19 leaderboard is live and
  playtested. — divergence #1.
- **Conversion-targeting refactor (divergence #3).** **Keep shipped for now.**
  Revisit after E18 emits a rule-driven `Can Party Flip` signal cleanly. (Listed as
  Phase-1 #19 in §9.6 "if pursued"; bundle DH-5's pairing-dissolution here if QW6
  is deferred.) — divergence #3, debt #13.
- **Named-ordinal meter relabel (presentation half).** The full labeled-ordinal
  meter *presentation* (vs the ±3 clamp in QW3 + crisis/cascade in E6) touches every
  meter read/write + the UI; ride it on the presentation track only if playtest says
  the numbers read poorly. The first-class war-score meter rides E3. — §21.8/§22.1.
- **Far-future / progressive era (post-1892, pre-modern).** Feminists / socialists
  / communists / prohibitionists / eugenicists / labor activists; movement/coalition
  spawning across eras (#6). The `progressive` enum value is added in K4; a
  `progressive` scenario lifts in once a progressive digest lands. (`hd` reaches a
  Progressive *finale* at 1892 but doesn't fully spec the era.) — gap #2, #6.
- **Gilded-Age issue *system* depth.** Per-issue interest groups, full era-event
  spines, imperialism annexation flow distinct from `admitState` — beyond the E20
  data shells. — gap #3, #6.
- **Cabinet "free pick-up" legislation (12b) + foreign-volunteer scheduling
  (#46).** The 1772 Treasurer free-pickup variant; events scheduling a
  future-draftable figure (Lafayette 1784) routed to the lowest-scoring eligible
  faction. (The general Executive-Branch-Interference form is E27.) — gap #12b, #46.

---

## Sequencing notes

Why the order is what it is — the tech-lead's binding calls (§9.6).

1. **BUG-0 is the cheapest win in the whole roadmap — do it first** (tech-lead §9.6
   call #1, the BUG table):
   > "Verified: `RELOCATION_ATTEMPTS_PER_TURN = 5` at `types.ts:247`; the design
   > changed it to `4` mid-thread and it went **live in the running playtest**
   > (divergence #9). One-line const edit, no migration, no dependency. The browser
   > engine simply lags a shipped design decision."

   It sits at the very top of the quick-wins (QW0). It is *only* the stale constant
   — the auto-Carpetbagger feature is the separate QW4/E17 work.

2. **Per-era point BANKING (#68) reshapes the era keystones + the win condition —
   not a new item** (tech-lead §9.6 call #2):
   > "The era boundary is a bank-and-zero + award + full 2.1.x→2.3.1 re-run +
   > content-swap pipeline; the per-era banks sum toward the (open) cross-era win
   > total. Build `advanceEra` with the bank step from the start — it changes the
   > win-condition shape and the boot sequence, but it does not add a keystone."

   So K3 owns the bank-and-zero step and K4/E19 feed it `Faction.score`; the
   cross-era win total is the sum of banks (still an open design number).

3. **The Civil-War / Reconstruction epic lands EARLY-ish (E3b) because it COMPLETES
   a shipped scenario** (tech-lead §9.6 call #3, §9.1.2):
   > "It ENHANCES an already-shipped scenario, not a new one. `scenario1856.ts`
   > ships today but its era-event spine dead-ends at the Trent Affair (1861) —
   > adding #56/#57/#58/#59 completes a half-finished playable scenario, the single
   > highest 'finish a playable thing' leverage in the batch. Federalism, by
   > contrast, is net-new content behind a new scenario builder."

   E3b sits right after generic war (E3) + K2, **not** behind federalism (E1) or the
   modern tail. Cheap antebellum parts (secession #58, sectional crisis #59) land
   first; the two-theater war (#56), Reconstruction (#57), and Canada (#60) are the
   heavy parts. E1 and E3b are independent — build whichever finishes a playable
   scenario faster.

4. **Generic war (E3) must be DESIGNED multi-theater + tiered** (tech-lead §9.1.2):
   > "The Civil War is explicitly the Major-tier instance of that engine (two
   > theaters, naval-gates-land, per-theater WarScore + auto-win, Major/Minor/
   > Operation multiplier). Building the Civil War *before* generalizing the flat
   > resolver would mean writing the multi-theater model twice. So #6 must land
   > first — designed with multi-theater + tiers in view — so the Civil War is a
   > configured instance, not a rewrite."

5. **#54 investigation committees is now READY; DH-1 is the remaining hole**
   (tech-lead §9.6 call #4):
   > "`hd` authored the 5d6 spec (#65); it moves from needs-design to buildable and
   > rides Phase-1 #13. DH-1 (filibustered MUST-pass) is the remaining under-
   > designed legislative hole."

   So E14 gains an investigation sub-PR (E14e) marked **ready**; only DH-1 stays in
   author-before-build, folding into E14c/E27.

6. **DH-8 (CPU convention AI) is a GM-confirmed must-own for the convention epic**
   (tech-lead §9.6 call #5):
   > "A player-only convention is not shippable in a single-player game where most
   > factions are CPU; the convention subsystem owns the CPU side + the ambiguous
   > ballot-shift rule (next-round) + the DH-7 threshold rules."

   E10 explicitly owns the CPU delegate/convention AI; it is not optional. DH-6
   (contingent top-2/top-3) is owned by E10b; DH-9 (action ability-stat) is decided
   at K2 before the libraries author `resolve`.

7. **K2 (ActionRegistry) is the single most important keystone — ~6× leverage,
   confirmed across 5 eras** (tech-lead §9.6 call #6, §6.6). `hd` adds the
   Reconstruction readmission-plan + secession-trigger rows as further K2 consumers,
   *raising* the justification. Do K2 first if only one keystone lands this quarter.

8. **The two-track parallelization is still the biggest schedule lever** (tech-lead
   §9.4, §9.6). Sync points: a handful of additive `Politician`/`Party` fields +
   two deeper handoffs (A4 ↔ E3 war odds; P2 ↔ E8 portraits). Start the
   presentation track immediately with P0.

9. **(carried) #8 cabinet, #7 SCOTUS, the two scaling walls, far-end vs near-term**
   (tech-lead §9.6 call #6). #8 is a real cabinet wipe→retention refactor (M, E16) —
   batch 2 wrongly said no wipe exists (`:3804-3812`). #7 SCOTUS is from-scratch over
   a *stub* (`:3398-3414`), far-end (E23). The two scaling walls (persist House
   slates E7; procedural pol gen E8) are NEAR-term, not modern-only. Federalism
   before gilded before modern; `scenario1788` before a fully-general `advanceEra`.

10. **RNG first (K0).** Determinism is the prerequisite for multiplayer and any
    replay/test harness, a soft gate for every roll-heavy subsystem (war E3/E3b,
    convention E10, governor d100s E11, filibuster E14, primary E22), **and a hard
    gate for the seeded procedural pol generator (E8)**.

11. **Within-track dependency notes.** **E17g (numeric `nationalSurplus`/
    `nationalDebt`) is a prerequisite for E2's cap *and* E6's debt field — build that
    sub-item early.** E4's global flip needs E5 (amendments). E9's statehood needs E2
    + E3 + E8; **E3b's Canada arc (#60) needs E9's per-era admission gate.** E10b's
    VP-vacancy fill needs E5. E14e (investigation) needs E2's bill type. E22 needs
    E10's CPU delegate engine. E24 needs E21. E26 needs E7. P1/P2/P3 consume P0.

### Estimate caution

Sizes are the tech-lead's. Rows that may still feel XL after a first pass:

- **E3b (Civil-War / Reconstruction)** — sized L but it is a full subsystem;
  **ship as 5 sub-PRs** (secession #58 → sectional crisis #59 → two-theater war #56
  → Reconstruction #57 → Canada #60), cheap-first. The two-theater war and the
  Reconstruction status/readmission model are the chunky halves.
- **E1 (federalism epic)** — sized L; expect the era-event spine and the SCOTUS set
  to each be their own sub-PR.
- **E10 (convention)** — the single biggest unbuilt subsystem; **split into ~3**
  (ballot loop → inter-ballot library on K2 → platform/VP/scandal + the **CPU AI it
  must own, DH-8**). Its CPU delegate engine is shared with E22.
- **E14 (legislative micro-mechanics)** — now **5 sub-PRs** sharing the bill
  pipeline (block-and-replace → packaging → filibuster → crisis tag → investigation
  #54).
- **E16 (cabinet + Congress + offices-by-law)** — three coupled jobs (9-role
  Congressional pipeline, the cabinet-wipe→retention refactor, offices-created-by-law
  #66); **split if any feels XL during scoping.**
- **E28 (modern era scenario)** — the XL capstone; decomposes into roster +
  era-event spine + bill catalog + card pool sub-PRs; gates on most of Phase 1 + 2.
- **P2 (portrait pipeline)** — an asset-pipeline epic; the no-AI-in-product
  constraint shapes the tech choice from day one; must render generated pols
  (shared with E8).

---

## Provenance note

This reflects **batches 1–4**: the `f4c7c2c4` 1868 Gilded-Age multiplayer dry-run,
the `f55d3e21` 1788 federalism solo-with-AI playtest, the `85f8e6b4` 1772 solo
aesthetic experiment, the `3a9ac985` modern (1948→2020) multiplayer campaign, and
now the `77db6e6f` **1856-native "A House Divided" Part 2** (9051 posts — the only
source for the Civil-War / Reconstruction / secession machinery). The batch-3
roadmap was a three-phase engine track + a presentation track; this re-sequence:

- **adds BUG-0** (relocation cap `5`→`4`, `types.ts:247`) at the **front of the
  quick-wins** — the cheapest win in the roadmap, a shipped constant that lags a
  design decision which went live in the playtest (divergence #9);
- **inserts the Civil-War / Reconstruction epic (E3b)** at engine Phase-1, right
  after generic war (E3) + K2, because it **completes the already-shipped 1856
  scenario** (whose spine dead-ends at the Trent Affair); split cheap-first
  (#58/#59) before the heavy parts (#56/#57/#60), and **re-frames generic war (E3)
  as multi-theater + tiered** so the Civil War is a configured instance;
- **folds per-era point BANKING (#68) into K3/K4** — the era boundary banks-and-zeros
  the running score, pays awards, re-runs the pre-turn phases, and swaps content;
  the banks sum toward the cross-era win total;
- **marks #54 investigation committees READY** (E14e) — `hd` authored the 5d6 spec
  (#65) — leaving **DH-1** as the only author-before-build legislative hole;
- **places the new 1856-arc rows** — succession/acting-president (#61) + contingent
  House election (#62) at E10b; offices-created-by-law (#66) into E16; era-keyed
  amendment ratifier (#64) into E5; the 3/3 draft re-rule (#69) into K4; the
  Primary-Era opt-in (#63) into E22; the ~16-meter Lingering bank (#67) into E6;
- **classifies DH-3..DH-11** — DH-3 (career-track presidential bar) and DH-5
  (Kingmaker-pairing dissolution) promoted to quick-wins; DH-4/DH-9/DH-10/DH-11
  folded into their subsystems as balance dials/data flags; DH-6/DH-7 author-inside
  their epics; **DH-8 (CPU convention AI) a must-own inside the convention epic**;
- **keeps multiplayer (M1 hot-seat + M2 async) in the parking lot** with explicit
  hard-blockers (K0 + K2 + all action libraries).

**Still provisional.** Subsequent `/ingest-playtest` runs will refine scopes
(especially the Civil-War sub-splits, the Reconstruction status model, the
convention/primary CPU AI, the SCOTUS compel mechanics, the ~16-meter Lingering
order, and the cross-era win-total number the per-era banks sum to), may re-split
currently L-sized rows, and may surface items now parked or unknown. **The order
above is buildable top-to-bottom today; re-validate on every digest.** Open design
calls that gate ordering (era-event scheduling hybrid, era-enum split, meter
relabel, procedural-generation distribution, DH-1 rules, contingent-election
cutoff, draft 3/3-canonical, Civil-War end-year, cross-era win total) are tracked
in `game-context.md` → Open questions.

---

**Roadmap path:** `/home/user/AMPU/docs/game/roadmap.md`.
