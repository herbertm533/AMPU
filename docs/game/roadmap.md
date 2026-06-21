# AMPU — Roadmap

> **Batch-5 version — re-sequenced for the all-CPU "Drums of War" thread.**
> This roadmap was stood up from the codebase + tech-lead bootstrap (6 items),
> rebuilt against batch 1 (`f4c7c2c4`, 1868 Gilded-Age → 14 items), re-sequenced
> into **two parallel tracks** for batch 2 (`f55d3e21` 1788 federalism + `85f8e6b4`
> 1772 aesthetic), re-sequenced into **three engine phases** for batch 3
> (`3a9ac985`, the 2276-post modern campaign), re-sequenced for batch 4 to absorb
> `77db6e6f` (the **9051-post 1856-native "A House Divided" Part 2** — the only
> source for the Civil-War / Reconstruction / secession machinery), and is now
> **re-sequenced for batch 5**, which absorbed `e1776bbd` — a **7540-post
> all-CPU 1841→1924 "Drums of War"** playtest, the **first explicit forum record
> of CPU heuristics, thresholds, tie-breaks, and formulas**. Order within each
> track is binding from `technical-guide.md` §9.6 — **build top-to-bottom.**
>
> **What changed vs. the batch-4 roadmap** (all from §9.6 + §9.1.3 + §6.6.1,
> binding):
> 1. **K5 (`CpuController` scaffold) is a NEW late-keystone**, sitting after K0
>    + K2 and **parallel with K3/K4**. ~120 lines (orchestrator + handler
>    interface + tie-break utilities + 2 `repair()` backfills + a determinism
>    test). The shipped engine has **no agent-decision pass at all** — 3 thin
>    stubs only (§9.1.3) — so the §25 CPU spec (15 subsystems, 720 lines) has
>    nowhere to live without it. **K5 is a force-multiplier, not a scenario
>    gate** — `scenario1788` + the 1856-arc epic can ship with stubbed handlers
>    and upgrade together.
> 2. **A new "CPU handler suite" epic lands at engine Phase-1 #9** with up to
>    **15 lightweight PRs** (one per §25 subsection, parallelizable after K5).
>    Order inside the epic is §6.6.1's handler-order table. Several handlers
>    *own* subsystem behavior in their own right — e.g. handler #5 (convention
>    CPU) owns DH-8 + DH-17 (11-ballot deadlock fix) + the ballot-shift rule;
>    handler #4 (cabinet confirmation) **lands the DH-23 36% bug fix**.
> 3. **Cabinet 36% bug (DH-23) re-scoped: XS-S, NOT M.** Verified: the engine
>    has **no Senate-vote cabinet step at all** today — `runPhase_2_3_1_Cabinet`
>    (`phaseRunners.ts:2158-2223`) is a one-step scored pick that goes straight
>    to `cabinet[seat] = pick.id` (`:2191-:2198`). **The bug doesn't exist
>    because the system doesn't exist.** So the fix is "build the confirmation
>    step in the right shape from day one" (default-AYE baseline + Iron-Fist
>    Maj-Leader auto-AYE-own-picks + Admin-weighted lobby-maximizer) — lands as
>    a sibling of the cabinet-retention refactor at Phase-1 #16 + CPU handler
>    #4. Not a quick-win against existing code.
> 4. **Generic war (E3) updated:** **multi-theater + tiered from day one**, with
>    the multi-confirmed battle formula
>    `Win% = Difficulty + Planning(SecMil+CoS) + Officer×10 + MilPrep + Benchmarks`,
>    `WS ≥ +11` auto-win, war-end `WS×2 = %`, post-war defeat `|WS|×2×10 = %`,
>    KIA on natural-1, 3-roll treaty chain — all corroborated across 5+ wars × 4
>    eras by `drums` (Eastern + Western + Utah + WWI + Mexico + Sioux).
> 5. **Iron Fist trait split (§25.9 / debt #25) lands as Phase-1 #17 (M)** —
>    designer-flagged; **needs design first** for the exact 6 child trait names
>    + cascade rules (now in the parking lot). Independent of K5 — the trait
>    system shipped in PR4-PR6.
> 6. **READY-now adds** (no design task remaining): the 15 §25 CPU handlers
>    (assuming K5 lands first) + **#79** Justice 10-yr drift (25/10/5 mid/left/
>    right + Puritan-blocks; lands inside the SCOTUS epic) + **#80** ±3 swing
>    cap (extends meter-clamp QW3 to cabinet + ideology) + **#82** veto override
>    2/3 both chambers (forward-only constant, no fix needed today) + **#83**
>    midterm uses presidential meter+enthusiasm rules + **#85** 5%/half-term
>    retire/death rate (1-line `MORTALITY_RULES` refinement, **new quick-win**).
> 7. **Parking-lot adds** (needs-design before build): divergence **#10 / #84**
>    contingent-election rules (GM invented 5 rulesets mid-thread); **§25.9**
>    Iron-Fist exact split; **DH-12** white-peace rules; **DH-13** faithless-
>    elector cap; **DH-14** era-aware bill ideology; **DH-15** small-state
>    action multiplier.
> 8. **Multiplayer M1 hot-seat** now depends on K2 + the action libraries +
>    **K5** (the handlers serve both modes identically — a human taking over a
>    CPU faction just disables the handler for that faction).
>
> Tags carried from prior batches: Source column `gilded`/`fed`/`1772s`/
> `modern`/`hd`/**`drums`** are the six digests; **NEW** = first appeared this
> batch; **CARRIED** = on a prior list; **HI-CONF** = corroborated ≥2 eras;
> **HI-CONF (N era)** = the strongest signal. **status:** `ready` = buildable
> now; `needs-design` = rules must be authored first. Sizes are the tech-lead's.

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic (PR1–7)
is complete; the knowledge-base infra and five ingestion batches are knowledge
milestones (no code, but they are what every item below is traced to).

- **Batch-5 ingestion (knowledge milestone).** Absorbed `e1776bbd` (the all-CPU
  1841→1924 "Drums of War" playtest, 7540 posts — the **first explicit forum
  record of CPU heuristics**). The unique value is **agent-decision
  specification**, not new mechanics. Gap log gained rows #70–#85 (15 CPU
  handlers + 6 corroborating non-CPU items + DH-12..DH-23); `game-mechanics.md`
  gained §25 (720 lines, 15 CPU subsections) + §19.1 divergences #10–#13;
  `technical-guide.md` §9 re-sequenced: **K5 added as a new late-keystone** (~120
  lines, parallel with K3/K4); a **CPU handler suite epic** added at Phase-1 #9
  with 15 parallelizable PRs; the **cabinet 36% bug (DH-23) re-sized XS-S**
  because the system doesn't exist yet; generic war (E3) updated **multi-theater
  + tiered** with the multi-confirmed formula; **Iron Fist split** (§25.9) added
  as Phase-1 #17 (needs design); **divergences #10–#13** added; #79/#80/#82/#83/
  #85 marked READY (#85 as a new quick-win); contingent-election rules (#10/#84)
  + §25.9 + DH-12/DH-13/DH-14/DH-15 added to the parking lot. _Complete._
- **Batch-4 ingestion (knowledge milestone).** Absorbed `77db6e6f` (the
  1856-native "A House Divided" Part 2, 1856→1904, 9051 posts — the first
  1856-native procedural record and the only source for the Civil-War /
  Reconstruction / secession era). Gap rows #56–#69; divergence **#9** (the
  stale relocation cap → **BUG-0**); nine design holes **DH-3..DH-11**.
  `game-mechanics.md` gained §23 + §24 + the §2.5 banking note; `technical-
  guide.md` §9 re-sequenced (BUG-0 front; Civil-War epic at Phase-1 #3b; #54
  ready; point-banking folded into K3/K4). _Complete._
- **Batch-3 ingestion (knowledge milestone).** Absorbed `3a9ac985` (the modern
  1948→2020 multiplayer campaign, 2276 posts). Gap log grew with modern rows
  #47–#55 + A9 + DH-1/DH-2; `game-mechanics.md` gained §22 + divergences #7/#8;
  `technical-guide.md` §9 re-sequenced into Phase-0/1/2, pulling the two scaling
  walls + meter generalization near-term; the cabinet-wipe finding corrected.
  _Complete._
- **Batch-2 ingestion (knowledge milestone).** Absorbed `f55d3e21` (1788
  federalism, 732 posts) + `85f8e6b4` (1772 solo aesthetic, 90 posts). Gap log
  to ~54 rows + A1–A8 presentation + 3 confirmed bugs; `game-mechanics.md`
  gained §20–§21 + divergences #4–#6; `technical-guide.md` §9 → the two-track
  plan. _Complete._
- **Batch-1 ingestion (knowledge milestone).** The four planner docs stood up
  and absorbed the `f4c7c2c4` 1868 Gilded-Age dry-run: gap log to ~41 rows,
  ~12 new `game-mechanics.md` sections, the `ActionRegistry` keystone
  identified, three design divergences resolved. _Complete._
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
> 1856, the cross-cutting items the modern thread pulled forward, the **batch-5
> CPU handler suite**), Phase 2 (the far-end deep-modern epic, builds last). The
> presentation track shares only a handful of small additive `Politician`/
> `Party` fields + two deeper handoffs and can be staffed independently
> (tech-lead §9.4, §9.6).

### Quick-wins — land immediately (XS each, high feel-value)

Fixes + cheap divergence/balance resolutions. **BUG-0 is at the very top — the
cheapest win in the roadmap.** **BUG-1 is the exception that matters:** it is XS
but a **hard gate on the federalism epic** — land it *in or just before* E1. DH-2
(modern deck fired off-year cards) is the **same scheduling surface** as BUG-1 +
divergence #4 and is investigated at E15, not as its own quick-win.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| QW0 | **BUG-0 — relocation cap `5`→`4` (divergence #9)** *(do FIRST)* | **One-line const edit:** `RELOCATION_ATTEMPTS_PER_TURN = 4` at `types.ts:247` (shipped value is `5`). The designer changed it to 4 mid-thread and it went **live in the running playtest**; the browser engine never caught up. **Settled value, no migration** (a tunable const, not a save field), no dependency. The auto-Carpetbagger + 10-yr-expiry + alt-state-exemption *feature* is QW4 / E17 — this row is **only** the stale constant. **The cheapest win in the whole roadmap.** | — | XS | bug BUG-0 / divergence #9 (`hd` §0/I-1, 7062-7066, 7555) + codebase (`types.ts:247`) — CARRIED | ready |
| QW1 | **BUG-1 — era-event era-lock filter** *(federalism gate)* | Add an era-vs-start-year filter to `buildEraEventsForYear` (`phaseRunners.ts:2817`): an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table. Latent today; **a blocker the moment a 3rd scenario ships** — so this rides with E1. **Resolve together with DH-2 + divergence #4** (one scheduling surface). | — | XS | bug BUG-1 (`fed` 521-535), DH-2 (`modern` 2221) — CARRIED | ready |
| QW2 | **BUG-3 — no-PM-General fallback guard** | Defensive guard on the `GeneralInChief` fill path (`phaseRunners.ts:2255`): empty-pool ⇒ leave vacant + log (or auto-generate a stopgap officer — ties to E8 procedural pol gen). Closes a potential crash. | — | XS | bug BUG-3 (`fed` 5, 119) — CARRIED | ready |
| QW3 | **±3-per-phase meter-swing clamp (meter-model divergence; now confirmed live by `drums` #80)** | One-helper change: clamp every `NationalMeters` write to ±3 per phase (`types.ts:1399`). **Batch 5 extends this:** apply the same clamp to **cabinet ideology net-swings** and **per-phase ideology swings** at the same chokepoint (#80, `drums` POST 4574 — a live designer patch). Orthogonal to the full named-ordinal relabel (parked) and to E6's crisis/cascade rules (which build on it). Cheap balance/feel win. | — | XS | meter model §21.8/§22.1/§22.2 (`1772s`; `modern`; **`drums` #80 POST 4574**) — CARRIED + EXTENDED, HI-CONF | ready |
| QW4 | **Auto-Carpetbagger on alt-state moves (divergence #2)** | Replace the 4-step probability ladder with auto-grant on a successful alt-state relocation; add 10-year expiry + exempt alt-state moves from the relocation cap (now 4/half-term after QW0). More legible; removes a dead dial. | QW0 (the cap value) | XS | gap #38, divergence #2 (`gilded` 36; `1772s` 3-52; `modern` 147; `hd` I-1; **`drums` POSTS 2627, 2630-2634, 2755, 7465 add the per-roll % table + recent-state filter**) — HI-CONF (5 era) | ready |
| QW5 | **DH-3 — bar career-track pols from the presidency** | Add a guard at presidential-candidate eligibility (and CPU presidential selection) so career-track pols can't run — closing a GM-acknowledged rules gap (career-track is already barred from Gov/Rep/leadership/Kingmaker). Relates to the primary (E22) but is a cheap standalone guard now. | — | XS | DH-3 (`hd` 8205-8219; relates to #63) — CARRIED | ready |
| QW6 | **DH-5 — Kingmaker-pairing dissolution on flip** | A rule in the conversion path: converting/flipping a Kingmaker no longer seizes his protégés (or their +1 election standing) — flagged "insanely OP." Same code area as Reconstruction amnesty (E3b prunes broken Kingmaker pairs). Cheap balance fix on shipped Kingmaker/conversion machinery (`KINGMAKER_RULES` `types.ts:295`, `CONVERSION_ODDS` `:268`). | — | XS–S | DH-5 (`hd` 7589, 8762; relates to #29/#30) — CARRIED | ready |
| **QW7** | **#85 — 5%/half-term retire/death + mandatory military-officer retire at 75** *(NEW, batch 5)* | A 1-line refinement of `MORTALITY_RULES` per-era table (`types.ts:485`): per-half-term **5% retirement/death roll for senators + cabinet** + mandatory **military-officer retire at 75** + ~10% baseline cabinet-decline roll. Tyler patched this mid-run (POST 5437) to solve CPU stagnation in long campaigns. **Pure tunable; no shape change; cheap.** | — | XS | #85 (`drums` 2493, 5437, 6469) — NEW | ready |

---

### Engine track — Phase 0 (keystones)

**`K0 → (K1 ‖ K2 ‖ K3) → K4 ‖ K5`.** After K0, K1/K2/K3 are independent and
parallelizable across PRs; K4 depends on K3. **K5 is a new late-keystone (batch
5)** — sits after K0 + K2, parallel with K3/K4 + federalism (§9.1.3). K2 remains
the single most important keystone (~6× leverage) — **do it first if only one
lands**, because K5 depends on it (most handlers pick from a registry).
**Batch-4: per-era point BANKING (#68) is folded into K3/K4 — not a new item.**

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| K0 | **Seed the RNG** | Drop a real PRNG (mulberry32/xoshiro) into `rng.ts:5`; store `seed` + state on `GameState` (optional + `repair()` backfill); migrate the **14** raw `Math.random` engine calls (election jitter `phaseRunners.ts:3711`, generic-war `:3603`, draft fallback `:188-198`, `revolutionaryWar.ts:89,97`, `continentalCongress.ts:271`). Keep wrapper signatures. | — | S–M | debt #1–#3 (determinism prereq for multiplayer + replay + **K5 deterministic tie-breaks**) — CARRIED | ready |
| K1 | **`State.policies` + `State.electionMethod` data shapes** | Two additive `State` fields (`types.ts:1318`): `policies?: Partial<Record<StatePolicyId, StatePolicy>>` (Poll Tax/Jim Crow/Prohibition/Women's Suffrage/Segregation; `multiplierUntilYear`) + `electionMethod?: 'popular'\|'legislature'`. `repair()` backfill `{}` / `'popular'`. Extend `Predicate` with `{ statePolicyActive }` + `{ electionMethodIs }`. **Reads from the K5 governor handler (DH-19 / handler 9j) to prune no-op actions.** | K0 | XS | gap #21 (`gilded` 125; `modern` 25-2245; **`drums`** confirms) + #44 (`fed` 194-373) — CARRIED, HI-CONF | ready |
| K2 | **`ActionRegistry<Ctx>` keystone** | Define `GameAction<Ctx>` + `ActionRegistry<Ctx>` once in `src/engine/actionRegistry.ts` (one ~80-line type covering id/label/`isAvailable`/`resolve`/`persistence`) + one UI Action Picker + one JSON-serializable persistence shape. Used by **six+** action libraries (governor/exec/diplomacy/convention-inter-ballot/primary/general — plus the Reconstruction readmission-plan + secession-trigger rows at E3b). **~6× tax if built ad-hoc — the highest-leverage keystone.** **Hard prerequisite for K5** — most CPU handlers pick from a registry library. **Resolve DH-9 (canonical action ability-stat) before the `resolve` signatures harden.** | K0 | S | §6.6 (now confirmed **5 eras**; `hd` adds the Reconstruction/exec rows; **`drums`** raises the consumer count to 6+) + DH-9 — CARRIED, HI-CONF (5 era) | ready |
| K3 | **`advanceEra(snap, target)` + era-content registry + year-decoupling + per-era point BANKING (#68)** | Replace the hard-coded `currentEra = 'federalism'` in `constitutionalConvention.ts:198` with a pure callable transition. **The era boundary is now a bank-and-zero boot pipeline (#68), not a discard:** at the boundary, **bank the running per-era `Faction.score` into `eraPointBanks?: Record<Era,…>` and zero the running total**, **pay end-of-era awards**, **re-run the pre-turn phases (2.1.x→2.3.1)**, then swap content pools (card-pool + per-era card-count rescale, draft profile, SCOTUS set, nation renames, party-formation). The per-era banks **sum toward the (open) cross-era win total**. Lift the **5** `ERA_GRAPH_1772` spots in `eraGraph.ts` (`:4,:73,:113,:148,:164`) to `ERA_GRAPHS: Record<Era, GraphNode[]>`. **Gate content by `currentEra`, not literal year** (the alt-history clock makes year-based gating wrong). | K0 | M | gap #2 (`fed` 11,518; `modern` 1080,1172; `hd` I-12, 6679-6816) + #68 (banking), debt #5/#9 — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| K4 | **Era enum growth + `scenario1788` (federalism boot) + era-keyed draft-grant & ratifier tables** | Add the era value(s) the timeline needs — `gilded`/`progressive` between `nationalism` and `modern` (`Era`, `types.ts:1337`); fill every `Record<Era,…>` table the TS exhaustiveness check flags. **First new scenario is `scenario1788`, NOT gilded/modern** (§9.1.1): a mid-government boot on the `scenario1856` template (`scenario1856.ts:177-193`) — pre-seated Washington admin, start at phase 2.1.2. New files: `scenario1788.ts`, `factions1788.ts`, `states1788.ts`. Per-(faction, era) `FACTION_DRAFT_PROFILES`. **Add the era-keyed rookie draft-grant table (#69: 3 traits + 3 alt-states per the latest playtest; reverse-PV order + pick-position bonuses)** and the **era-keyed amendment-ratifier/threshold table stub (#64 — feeds E5).** | K3 | M–L | gap #2, #4, #41 (`fed`; `modern`) + #69 (`hd` 3, 2155) + #64 stub (`hd` I-9) — CARRIED + EXTENDED | ready |
| **K5** | **`CpuController` scaffold (NEW, batch 5)** *(parallel with K3/K4)* | New directory `src/engine/cpu/` holding (a) `CpuController` orchestrator (`controller.ts`), (b) `CpuHandler<Ctx, Decision>` interface (`types.ts`), (c) shared deterministic tie-break utilities (`tiebreaks.ts`: `pickWeighted`/`pickByLowestScore`/`breakByPolId`), (d) two `repair()` backfills for the persistent state the architectural-gap handlers need: `GameState.cpuCommitments?: {…}[]` (DH-20 reciprocity ledger) + `GameState.recentScandalIds?: {…}[]` (DH-22 scandal cooldown). Plus a determinism test (registers a fake handler, asserts same seed → same decision). **~120 lines total.** The orchestrator itself is *runtime* — no save shape; only handler *outputs* hit the snapshot. **K5 unlocks the 15 follow-on CPU-handler PRs in §6.6.1 — the §25 spec has nowhere else to live.** It does **not** block scenario work (`scenario1788` + 1856-arc can ship with today's CPU stubs and upgrade together when the handlers land). | K0, K2 | S (~120 lines) | gap #70-#78 (§25 master) + DH-8 (the marquee unstable surface) + DH-20/DH-21/DH-22 (architectural gaps need persistent state) — NEW | ready |

### Engine track — Phase 1 (subsystems, dependency-ordered)

Ordered exactly per tech-lead §9.6 to minimize rework. The federalism epic (E1)
is one spine; **E3b (Civil War / Reconstruction) is the second — it completes the
already-shipped 1856 scenario** and sits right after generic war (E3) + K2, **not**
behind federalism or the modern tail (§9.1.2). Rows **E6–E8** are the **NEAR-TERM
cross-cutting items the modern thread pulled forward** — not modern-only.
**E9 is the new CPU handler suite — 15 lightweight PRs once K5 lands.**

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E1 | **Federalism era epic (`scenario1788` content)** | A high-value epic. Era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events (~1792; `Party.formedYear`/`eraName`), 10-faction roster + nickname relabel, Mod/Cons draft profile, federalism SCOTUS set (`scotusFederalism.ts`). **Must land with BUG-1 (QW1).** Expect sub-PRs (event spine, SCOTUS set). **Independent of E3b** — build whichever finishes a playable scenario faster (§9.1.2). **Can ship with stubbed CPU handlers** — K5 wires in later (§9.1.3). | K4, **QW1**, K1 | L | gap #2, mechanics §20 (`fed`) — CARRIED | ready |
| E2 | **Bill typing + budget-gated spending cap** | `Bill.type?: 'foundational'\|'spending'\|'crisis'` (`types.ts:1506`, none today) + numeric `game.spendingBudget?` reading the **numeric `nationalSurplus`/`nationalDebt`** (E17g), not the ordinal `revenue`. Non-crisis spending bills can pass the floor yet be "BLOCKED DUE TO BUDGET"; crisis bills bypass. `modern` adds a **bill-relationship/replacement graph** (its deep form rides E27, the type tag lands here). Prereq for crisis bills + the Hamiltonian program + the investigation-bill type (E14) + Reconstruction readmission bills (E3b) + free-Executive-proposal carry-pool (E14, per `drums` #74). | K0; **E17g** (numeric surplus — build that sub-item early) | M | gap #42 (`1772s` B4; `fed` 159-703; `modern` 32-2265; **`drums`** #74) — CARRIED + EXTENDED, HI-CONF (4 era) | ready |
| E3 | **Generic cross-era war system (divergence #6) — DESIGNED multi-theater + tiered** | Generalize one `War` model with the **multi-confirmed battle formula `Win% = Difficulty + Planning(SecMil+CoS) + Officer×10 + MilPrep + Benchmarks`** (d100); per-theater `WarScore`; **`WS ≥ +11` auto-win**; war-end `WarScore × 2 = %` to carry; post-war defeat `\|WS\| × 2 × 10 = %`; **officer KIA on natural-1**; catastrophic 100/100; momentum bonus (+1/-2 turn-vs-turn); **Major / Minor / Operation tiers** with per-tier multipliers; **naval-N-then-ground gating per-war** (Mexico=3, WWI=2); **Treaty A-D tier + Basic-vs-Special routing by Admin + 3-roll treaty chain** (Pres → Sec State → Amb); confirmation cascade (defeated commander → Incompetent + fired → Senate drama), loss-debuff. Replace the flat resolver (`phaseRunners.ts:3593-3627`) and **fold the 1772 Rev-War loop in as one configured instance**. **`drums` confirms the formula end-to-end across 5+ wars × 4 eras** (Eastern + Western + Utah + WWI + Mexico + Sioux); **the single most multiply-confirmed cross-era resolver in the knowledge base.** Outcome grants/denies territory (couples to E5/E9-statehood). **K5 touchpoints (commander selection per battle, theater focus, surrender/peace) live INSIDE this epic, not as separate handlers** — they are war-epic-internal. Pairs with A4 battle-card (P-track) + the Phase-2 military tier. | K0, **QW2** | M–L | gap #45, divergence #6 (`fed`; `1772s`; `modern`; `hd` I-1; **`drums`** POSTS 123, 1725-1731, 2199, 2539, 2728, 2881, 3278, 3540, 5111-5114, 5353, 6181, 6317, 6571, 6705-6712, 6928) — CARRIED + EXTENDED, HI-CONF (6 era) | ready |
| **E3b** | **Civil-War / Reconstruction epic [1856-arc — COMPLETES the shipped 1856 scenario]** | The Major-tier instance of E3. **Placed here (right after E3 + K2) because it finishes a half-built playable scenario** — `scenario1856.ts` ships but its spine dead-ends at the Trent Affair (1861) (§9.1.2). **Split cheap-first into sub-PRs:** **(a) secession gating (#58)** — `Politician.allegiance?: 'union'\|'secessionist'` + a "Secessionists" inactive pool keyed to seceded/border-state membership + `Southern Unionist` trait reads + draft-pool tagging + no-relocate-into-rebel-state + CSA officeholder seeding (cheap, additive); **(b) free/slave sectional-balance crisis (#59)** — derived from the existing `SLAVE_STATES_1856` set: while free > slave in `nationalism`, the fixed score/meter/election penalty package fires, retired on emancipation (cheap, no new field); **then the heavy parts:** **(c) the two-theater war (#56)** — East/West theaters, 3-naval-wins-gate-land, per-theater WarScore (+10 auto-win + carry-roll), named-battle casualties on the military track, Union-victory reward incl. the **permanent president +1-all-elections**, war-hero <20yr bonus; **(d) Reconstruction readmission (#57)** — a `reconstruction?` state-status enum + per-state readmission **bills** (E2) that gate Gov/Rep/Senate unlock + a time-boxed `+2-toward-incumbent` bias modifier + the 3-plan exec action (K2) + amnesty law that removes-or-returns pols (prune broken Kingmaker pairs — same code as QW6) + carpetbagger-doubling + a **Reconstruction END exec action** (`drums` POST 2812; AG-Admin roll + lobby payouts + White-League/Red-Shirts trigger); **(e) Canada conquest → era-gated statehood (#60)** — per-(state,era) admission gating on the statehood pipeline (E9), a bonus Canadian draft pool on annexation, native-born relaxation, Canada-region election penalties. **The first scenario to get a full K5 handler suite — wire CPU handlers as they land** (the antebellum pressure drives most CPU surfaces). | **E3** (multi-theater war), **K2** (readmission/secession actions); (d) needs E2 (bills); (e) needs E9 (statehood pipeline) | L (split 5 sub-PRs) | gap #56–#60 (`hd` I-1..I-5; secession I-2, sectional I-4; **`drums`** corroborates and adds Reconstruction END action) — CARRIED + EXTENDED | ready |
| E4 | **Per-state presidential-election method (divergence #5)** | Legislature-method states award EV from seated-legislature party majority instead of popular vote in `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`). Flipped per-state by era event, globally by amendment (E5). Decisive in 1796 (CT/GA/MA/NJ/NY/RI/SC). | K1 (the field), E5 (global flip) | M | gap #44, divergence #5 (`fed` 194-373) — CARRIED | ready |
| E5 | **Constitutional amendments as durable state (incl. era-keyed ratifier #64)** | `GameState.amendments?: { id; passedYear; data? }[]` + amendment bill type + **2/3-House pass gate** + **cross-state ratification vote that can fail** + **grandfather clause**. **Ratifier + threshold are an era-keyed, in-game-changeable field (#64):** `fed`/`gilded` by legislatures; **`modern` by GOVERNORS (40 of 53)**; **1856 by 3/4 of GOVERNORS, with the threshold itself tunable by a passed amendment** (options table → faction-enthusiasm side effects; Gilded default drops to 2/3 of states). Effect-binding: term-length (4↔6), popular-vote-everywhere (→ E4), VP-vacancy fill (→ E10b), suffrage, court size. Add a **SCOTUS-ruling-gates-a-bill-class-until-amendment hook** (`hd`: *Pollock* → no income-tax bill until ratification; couples to E23). Extend `Predicate` with `{ amendmentPassed }`. **Gates BUG-2.** | K0; K4 (ratifier table stub) | M | gap #39 (`gilded`+`fed`+`modern`) + #64 (`hd` I-9) — CARRIED + EXTENDED, HI-CONF (4 era) | ready |
| E6 | **Meter-model generalization [NEAR-TERM]** | Banded-text ladders over the existing 7 `NationalMeters` fields + crisis entry/exit by tier + cascade rules (one meter caps/forces another) + top-of-ladder effects (**Honest-Gov't maxed kills Machines + Gerrymandering**) + numeric `nationalDebt` integer + `metersToElectionBonus()` from the canonical "State of the Meters" table. **A 1:1 WIDENING of `NationalMeters`, not a relabel.** `hd` extends to the **full ~16-meter bank** (#67): era-gated per-power relation meters (incl. an inactive "Israel" placeholder) + per-ideology enthusiasm meters + the **9-part Lingering resolution order** + hard caps (Mil-Prep/Planet-Health = 8) + tax/tariff decay timers + **policy-gated caps** (Healthcare→QoL ≤7, Honest-Gov→machines/gerrymander). Builds on QW3's ±3-clamp (now extended to cabinet + ideology, #80). Benefits *every* era. | K0; E17g (the debt field) | M | gap #50 (`modern`) + #67 (`hd` I-12) + #80 ±3 (`drums` POST 4574) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E7 | **Persist + auto-fill House slates & committees [NEAR-TERM — scaling wall b]** | Store a faction's House candidate slate + committee rosters on the snapshot; **carry-forward + bulk auto-fill by default**. The "computer owns the deterministic tedium" theme. **A UX wall, not modern-only** — improves 1856's 31-state congress now; a human **quit** over the manual tedium at 53-state scale. Do **before** the deep-modern roster (E26). **CPU committee-staffing heuristics partially driven by K5 handlers (§25.5-adjacent).** | `repair()` backfill for the new fields | M | gap A9, debt #20 (`modern`; also `1772s` Lingering/Committees) — CARRIED | ready |
| E8 | **Procedural pol generation [NEAR-TERM — scaling wall a]** | A **runtime, seeded** generator (lives in `src/engine/`, uses `rng.ts`) emitting `ImportedDraftee` rows when the real ~18.5k dataset is dry; reuses `instantiateDraftees` (`phaseRunners.ts:114`). Stat/ideology/trait/demographic distribution (GM wanted "some moderates") + a **plausible, ethnically-varied, toggleable name engine**. **Required for ANY late-era play** AND fixes sparse-state filler (#43) AND BUG-3's stopgap officer. **The bridge to the portrait epic (P2)** — shares the demographic model with P2. | K0 (seeded RNG) | M–L | gap #43, A1, debt #19 (`modern`; `fed`) — CARRIED, HI-CONF | ready |
| **E9** | **CPU handler suite (NEW EPIC, batch 5) — 15 lightweight PRs once K5 lands** | The §25 CPU spec wired against K5's scaffold. **Each handler is one PR** (50-200 lines of pure decision code, heuristic verbatim from §25). **Parallelizable** — once K5 lands, multiple handlers can land concurrently across contributors. **Order inside the epic is §6.6.1's handler-order table** (cheapest first; architectural-gap handlers later once the persistent state is exercised). Each handler reads the existing snapshot + a small `ctx` payload and returns the decision; the consuming runner replaces its inline stub with one `controller.decideFor(…)` call. **15 handlers, in this order:** **(9a) Candidate selection 75/25 + minor + open-seat** (§25.1 / #72) — cheapest; **(9b) Legislation NAY/AYE/NAY 3-step** (§25.6 / #74) — pairs with `Bill.type` (E2); **(9c) Leadership IRV bloc-vote + 3-ballot collective endorse** (§25.3 / #70) — most-corroborated; **(9d) Cabinet selection + Senate confirmation (default-AYE baseline + Iron-Fist Maj-Leader auto-AYE-own-picks + lobby-maximizer Admin-weighting)** (§25.5 / DH-23 / #73) — **lands the 36% bug fix; replaces the one-step pick at `phaseRunners.ts:2158-2223` with a 2-step pick→Senate-vote**; **(9e) Convention CPU (per-ballot menu + ballot-10 compromise + ballot-25 dark horse + Pineapple Primary + kingmaker-refusal list)** (§25.4 / #71) — **OWNS DH-8 (marquee unstable surface) + DH-17 (11-ballot deadlock fix: auto-drop-out after 2-3 ballots of 0 Momentum) + ballot-shift = next-round + DH-7 R/D threshold + DH-18 dark-horse resignation rolls**; highest-complexity handler; **(9f) Conversion poach (Pliable + adjacency gating + failure-strip + multi-faction-collision tie-break)** (§25.8 / #76); **(9g) A/B/C event vote + president-ideology force + meter-guarding** (§25.7 / DH-21) — first handler to use the meter-impact aggregator; **(9h) Faction-leader replacement (4-condition removal + hard gates + stagnation-fix + positive-trait floor)** (§25.10 / #78); **(9i) Primary CPU (5-action template + frontrunner rule + better attack-targeting)** (§25.12 / #63); **(9j) Governor action picker (state-stack-aware; prunes Improve-Industry at 10/10)** (§25.15 #4 / DH-19); **(9k) Reciprocity / vote-trading enforcer** (§25.15 #1 / DH-20) — first DH-* architectural gap; reads + drains `cpuCommitments`; **(9l) Cascading-scandal smoother** (§25.15 #3 / DH-22) — era-event walker calls this to drop back-to-back at-most-once events; reads `recentScandalIds`; **(9m) VP selection (8-element rubric + retention curve)** (§25.2 / #72) — era-keyed; **(9n) SCOTUS justice vote + Iron-Fist compel + 10-yr drift 25/10/5** (§25.14 / #79) — rides E23; **(9o) Faction rename trigger** (§25.13 / #40) — reads the rename-trigger predicate→name-generator registry. | **K5** scaffold + K0 (seed) + K2 (registry — handlers 9d/9e/9i/9j pick from libraries); 9k/9l need the K5 persistent state; 9n rides E23 | **~15 × S–M** (each 50-200 lines) | gap #70-#78 (§25 master) + #40 #63 #79 + DH-7/8/17/18/19/20/21/22/23 — NEW | ready |
| E10 | **Convention machinery (2.9.2) — uses K5 handler 9e for CPU** | The **single biggest unbuilt subsystem** — replaces the `engine.ts:69` one-liner. Multi-ballot loop + momentum (carries across cycles) + unit-rule; **inter-ballot action library on K2** (Force Rules Change, Presidential Promise — *offer-DOWN/request-UP direction rule*, Drop & endorse, Kingmaker, Ballot shift); 5-plank platform + comparison (+ failed-platform <50%-planks penalty); VP-impact scorer; scandal/faithless-elector rolls; **host-advantage** + **PL-overrules-VP**; **CPU delegate engine** (per-state EV × category multiplier — shared with the Phase-2 primary). **CPU side is owned by handler 9e** — DH-8 + DH-17 + ballot-shift + DH-7 + DH-18 all firm there. **Resolve the ambiguous ballot-shift rule (next-round) + the DH-7 R/D threshold asymmetry + Iron-Fist-rules-change re-gate inside this epic.** **Split into ~3 sub-PRs** (ballot loop → inter-ballot library on K2 → platform/VP/scandal). | K0, K2, **K5 + handler 9e** | L–XL (split 3) | gap #13–#19 (`gilded`/`fed`/`modern`; `hd` 3261-4726, 5594-5713; **`drums` §25.4 — the richest decoded subsystem**) + DH-7 + DH-8 + DH-17 + DH-18 — CARRIED + EXTENDED, HI-CONF (6 era) | ready |
| **E10b** | **Succession / eligibility / acting-president (#61) + contingent House election (#62) [1856-arc election additions]** | Two coupled election-system additions surfaced by `hd`. **(1) Succession/eligibility (#61):** `Politician.bornForeign?: boolean` gating the presidency (and convention Major candidacy); a **configurable, legislatable line of succession** (`successionOrder?: OfficeType[]`); an **`actingPresident?` state whose `command` (often 0) gates exec actions / SCOTUS-compel / re-election eligibility** (a 0-Command acting president is inert); era-gate the VP-vacancy-fill on the amendment (E5). **(2) Contingent election (#62):** on no EC majority, a House contingent path — **1-vote-per-state by delegation majority, Governor-party tiebreak; Senate elects VP** — with a **configurable `contingentTopN: 2\|3` cutoff (DH-6: GM used top-2) + the tied-chamber inverse-control rule**. Slots into the same EC tally code as E4. **Folds DH-3** (career-track presidential bar — landed early as QW5, enforced here in the candidate pool). **⚠ Build is GATED on parking-lot resolution of divergence #10 / #84 — contingent-election rules don't exist** (`drums` POSTS 472-474: GM invented 5 rulesets mid-thread — top-2 vs top-3, outgoing-vs-incoming Congress, deadlock side-effects). Author the rules first, then build. | E10 (convention/EC work), E5 (VP-vacancy amendment); **#10/#84 + DH-6** must be authored first (parking lot) | M | gap #61 (`hd` I-6) + #62 (`hd` I-7) + DH-6 + DH-3 + #84 (`drums` 472-474, 810, 4467-4475, 5176, 5217-5221, 5250) — CARRIED + EXTENDED | **needs-design** (#10/#84 only); rest ready |
| E11 | **Governor's actions library (2.5.2) — state-stack-aware via K5 handler 9j** | ~14 named, era-flavored actions on the registry; d100 vs 20·governing (Efficient → +1 action; **skill-match doubles success; 5-Gov autopass; success → 10% +1 Command except autopass; Gov incumbency decay after 8/12 yrs** — `hd`); per-action prereqs incl. **ideology gate** + **Honest-Gov't gate** + state-status; reads/writes `State.policies`; **small/large-state action-impact multiplier (×0.5/×2 — DH-15, needs design)**. Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Era row-sets via the per-era registry index (modern adds primary-control + voter-suppression + culture; `hd` adds "Activate State Primaries" #63; `drums` adds High-Tech industry actions #81 + faction-archetype CPU mapping — wired via handler 9j). | K1, K2, **K5 + handler 9j**; DH-15 from parking lot for multiplier | M | gap #20 (`gilded`/`fed`/`1772s`/`modern`; `hd` 2936-6997; **`drums`** archetype mapping + DH-19) + #81 — CARRIED + EXTENDED, HI-CONF (6 era) | ready |
| E12 | **Diplomacy actions library (2.7.1)** | Increase Relations / Increase Trade / Extend Credit (adds debt) / Provoke (war-trigger) with success/blunder rolls, on the registry. Seed per-power roster on `GameState.diplomacy`: era-dependent (5 federalism; +China gilded, Prussia→Germany 1871; **8 modern** +Japan/Israel). **Cap "Extend Credit to all nations" — DH-4** (a diminishing-returns / cap rule against the near-auto-win stacked bonus). | K2 | M | gap #25b, #26 (`gilded`/`fed`/`modern`) + DH-4 (`hd` 7346) — CARRIED, HI-CONF (3 era) | ready |
| E13 | **Executive actions library (2.8.1)** | N actions/half-term on the registry (N varies by traits; `Easily Overwhelmed` → VP hand-off; control-handoff chain Incompetent-Pres → VP → Manipulative advisor, open multi-manipulator tie-break). Persistent `GameState.activeExecutiveActions` with green/yellow expiry; **auto-deactivate sweep on admin change** (2.9.4); per-action policy/govt-type gating + blunder rolls. Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. **Encode the DH-10 `blunderStillScores?` per-action flag** (a blundered implementation scores + moves meters "as if it succeeded" unless an action overrides) **and apply the DH-9 canonical ability-stat** decided at K2. | K2; admin-change hook; DH-9 (from K2) | M | gap #23, #23b (`gilded`/`fed`/`modern`) + DH-10 (`hd` 8649-8672) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E14 | **Legislative micro-mechanics (incl. investigation committees #54 — READY) + veto override 2/3 (#82) + midterm meter+enthusiasm (#83)** | Sub-PRs on 2.6.1–2.6.3: (a) committee block-and-replace (chair may replace only a bill whose proposer has LESS Legislative AND lacks Efficient — `hd`); (b) bill packaging (won't-bundle-net-negative-unless-statehood; no split-vote); (c) filibuster (a **standing rule toggled ON by a law**; Disharmonious filibusters twice; filibustered bills carry + must re-pass BOTH chambers; **no Cloture until the Cloture bill passes**, ⅔ — `hd`); (d) `(Crisis)` tag + `Legislation.resolvesCrisis?` + `GameState.activeCrises?`; **(e) investigation committees (#54 — READY): the authored 5d6 "3.0.40" spec (#65)** — Speaker forms Chair+Ranking+3, roll 5d6 + 4 modifiers, 21–25 ⇒ guilty (resign + cabinet ban + ripples), dominant-party targeting, Court-Martial-d6 fallback; **(f) veto override = 2/3 both chambers (#82)** — `drums` POSTS 2180-2187 designer ruling (60% was a reverted bug); **forward-only constant** since no veto code exists today, hardcode `VETO_OVERRIDE_THRESHOLD = 2/3`; **(g) midterm uses full meter+enthusiasm (#83)** — verify-vs-build: audit the mid-cycle Senate/House caller paths through `calcStateVote` (`phaseRunners.ts:3685`); widen the caller's term assembly to the `presGeneral`-equivalent set if it's a subset. | K0, E2 (crisis + investigation bill type) | M (split 7) | gap #8–#11 (`gilded`/`fed`/`modern`; `hd`) + #54 ready via #65 (`hd` I-10) + #82 (`drums` 2180-2187) + #83 (`drums` 299-304) — CARRIED + EXTENDED, HI-CONF (6 era) | ready |
| E15 | **Era-event extensions** | Widen `EraEvent.decider: Role\|Role[]` (roll per role); foreign-territory grants en bloc (Oregon Treaty → BC/WA/OR/ID; organized/unorganized status); `GameState.pendingEvDeltas?` applied in 2.10 on `year % 10` (census timing: run decade N, take effect N+2; focus-rep seats); Egghead-cabinet advisory step + implementation-roll layer (difficulty tiers, trait re-rolls, blunder→scandal). **Resolve the scheduling fork [divergence #4 + BUG-1 + DH-2] here** — keep the graph, layer the cap. **Reads the K5 scandal-smoother (handler 9l) to drop back-to-back at-most-once events** (DH-22 cascade fix). | K1, K3; K5 + handler 9l | M | gap #22, #33, #34, divergence #4 (`gilded`/`fed`/`modern`) + DH-22 (`drums` 7389) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E16 | **Cabinet & Congressional leadership richness + cabinet retention (#8) + cabinet-confirmation system (DH-23, XS-S) + offices-created-by-law (#66)** | **Coupled jobs, share the code.** (1) Richness: region-coverage + **diversity floor (≥25% women/minorities)** + **intra-party faction-equity** malus; state-status eligibility guard; Ministers-to-foreign-powers seats; **Congressional 9-role pipeline** (Speaker/Maj-Min Leaders/Whips/Pro-Tem-by-seniority; RCV/weighted vote; committee-eligibility-by-prior-service; CPU auto-fill); **6-criterion faction-leader cascade** + anointing; PL fatigue + on-elect bundle + **suppress 2.2.4 + inter-party conversion in `independence`**. (2) **Cabinet retention — replace the wipe:** remove the unconditional cabinet clear at **`phaseRunners.ts:3804-3812`** (it fires every presidential cycle, even on re-election); retain occupants (modern: keep ≤5, CIA/FBI exempt), add per-officer tenure + `firingPrecedentSet` gate on *replacement* + same-faction US-Bank guard + opp-party cap. (3) **Cabinet-confirmation system (DH-23 / batch 5) — XS-S, NOT M.** The 36% pass-rate bug DOES NOT exist in the shipped engine because the *system* doesn't exist: `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step scored pick that goes straight to `cabinet[seat] = pick.id` + `addLog("confirmed")` (`:2191-:2198`) — **no committee, no Senate vote, no NAY/AYE roll**. **Build it in the right shape from day one as a SIBLING of the retention step** (not a quick-win against existing code): a Senate confirmation step (committee → floor) with **default-AYE baseline + low-% opposition reject (the lost rule)** + **Iron-Fist Maj-Leader auto-AYE-own-picks (the §25.5.2 designer ruling)** + **Admin-weighted lobby-maximizer (not just lobby-maximizer)** + the 50/50 Admin-1 trap fix + PPT-5-alternatives auto-confirm chain after failure. **CPU side = handler 9d.** (4) **Offices-created-by-law (#66):** model offices as **data created/destroyed by bills + exec actions** (`createdOffices?`), not a fixed `cabinetSeatsForYear` — Fed Chair (6-yr; creating the Fed deactivates the Independent Treasury), Chief of Staff (+1 exec action), CNO (replaces Sr Admiral; +1 Command), FBI Director (10-yr, off the 5-cap), Commerce/Labor split. **Consider splitting cabinet vs. Congress vs. offices-by-law vs. confirmation if any feels XL.** | K0; K2 (offices-by-law actions); K5 + handler 9d (CPU confirmation) | L (split — DH-23 step is XS-S inside) | gap #25, #28–#32, divergence #8 (`gilded`/`fed`/`1772s`/`modern`) + #66 (`hd` I-11) + DH-23 (`drums` 4702-4708, 4896-4900, 867-876, 1607-1626) — CARRIED + EXTENDED + RE-SIZED, HI-CONF (5 era) | ready |
| **E17** | **Iron Fist trait split (§25.9 / debt #25) — M; designer-flagged** | Split `'Iron Fist'` into **≥6 office-keyed traits** (e.g. `'Stifle Competition'` primary block, `'Force Vote'` chamber compulsion, `'Compel SCOTUS'` court compulsion, `'Fire Officers'` mid-war military replacement, etc.). **Touches:** the 4 governance rows (`types.ts:1043-1047`); 3 era-event multiplier readers (`phaseRunners.ts:2915,:2931,:2959`); the 6 grant-callers in §25.9 (PL+Honest-Gov-maxed gov control, Sen Maj Leader vote forcing, President officer-fire / SCOTUS-compel / challenger-stifle, Loans-from-Wealthy + IF PL gov takeover, Convention PL unilateral threshold, mid-war military replacement). `repair()` migrates `'Iron Fist'` → all child traits (over-broad but safe), then narrower readers move to specific child traits. **Independent of K5** — the trait readers are existing code, not CPU heuristics. **⚠ NEEDS DESIGN first** (parking lot, §25.9): the exact 6 child trait names + cascade rules need a designer call before build. | independent of keystones; **§25.9 design call** (parking lot) | M | gap #77 (`drums` 2433, 2511, 2784, 3241, 3660, 4896-4900, 5353, 6293, 6471, 6568, 6703, 6852, 6881, 6907, 6912, 6922, 7012, 7224, 7364) — NEW | **needs-design** (§25.9) |
| E18 | **Small consistency PRs (cluster)** | Cheap independent wins: (a) old-age stat decay (age-keyed; `modern` adds add-negative-trait / strip-trait); (b) defeated-incumbent auto-retire (only-if-ran; 6yr loss-malus amendment-gated; −1 defeat malus); (c) industry-leadership compute + scoring (per-era industry set incl. the modern 8; regional shifts; **High-Tech via era event #81 + Improve High-Tech gov action**); (d) tariff integer + change-cadence + president-tariff-power toggle; **(g) `GameState.nationalSurplus?`/`nationalDebt?: number` distinct from `meters.revenue` — prereq for E2's cap + E6's debt field; BUILD THIS SUB-ITEM EARLY.** (#85 5%/half-term retire-death + military-officer mandatory 75 already shipped as QW7; #80 ±3 ideology+cabinet swing cap shipped as QW3 extension.) | mostly — | XS–S each | gap #35–#38, #27, #3 (`gilded`/`fed`/`1772s`/`modern`) + #81 (`drums` 2809, 3074, 3085) — CARRIED + EXTENDED, HI-CONF (4 era) | ready |
| E19 | **Faction-personality 5-step distribution + per-era card pool + nicknames + rename triggers** | The **full 5-step allocation** algorithm (`1772s` B9) alongside the existing per-half-term drift. Plus **per-era card-count rescale** at boundaries (can split Prog/LW-Pop across 2 factions). Plus the per-(party, era, ideology) nickname table gated by leader traits + player-edit override. Plus the **deterministic faction-rename trigger registry** (§25.13 Whig→"Conservative Party": 3-condition predicate — no Republican Party + Red leader has Protectionist + Blue won 3 prez in a row; auto-generates new name; per-era authored names pool replaces the GM-admitted "kinda stupid/silly" default). **CPU side = handler 9o** (reads the rename-trigger predicate→name-generator registry). **Rebalance inelastic lobby cards — DH-11** (raw-pol-count-driven → a trifecta party can lack lobbies). | K3/K4 (era enum); K5 + handler 9o | M | gap #24, #5, #40 (`1772s`/`gilded`/`fed`/`modern`; **`drums` POST 7406**) + DH-11 lobby half (`hd` 7799) — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| E20 | **Bill-scoring leaderboard (divergence #1, Phase A)** | Add `legislativeScoring(bill, faction)` (±50/100/150 per matching ideology+lobby+interest card; **failed bills also score** + ±1 per-pol reelection deltas) onto a new `Faction.score?` ledger — **the same per-era running score K3 banks-and-zeros at the boundary (#68)** and the Phase-2 enthusiasm engine (E21) consumes. Keep `cardVoteBias` (`phaseRunners.ts:1516`) as the **vote-probability** input for floor votes. (Phase B parked.) | K0; K3 (banking consumes `Faction.score`) | M | gap #12, divergence #1 (`gilded`/`1772s`/`modern`) — CARRIED, HI-CONF (3 era) | ready |
| E21 | **Bill-driven statehood + auto-generated officials (incl. era-gated admission)** | Statehood/territory bills route → `admitState` (`territories.ts:8`, today only 1772 era-event `postEffects`); event/war annexation; organized/unorganized status; **filler officials via E8's generator**. Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories. **Add per-(state, era) admission gating** (the hook E3b's Canada arc #60 rides: 1856 Quebec→statehood directly, Ontario must be a territory, NL/NM/Utah locked until Gilded). | E2 (bill route), E3 (war annexation), E8 (filler officials) | M | gap #43 (`fed`) + per-era gate (`hd` I-5 / #60) — CARRIED + EXTENDED | ready |
| E22 | **Gilded scenario** | The Gilded-Age scenario boot, **once `advanceEra` (K3) + the action libraries (E11–E13) + the CPU handler suite (E9) are mature** (§9.1.1). Gilded issue *shells* (tariff integer from E18d, `MonetaryRegime` enum, civil-service/anti-corruption, imperialism naval bases) get a data home here; full system depth is parked. Resolves the gilded-enum question. | K3, K4, E11, E12, E13, E9 | M–L | gap #2, #3, #41 (`gilded`) — CARRIED | ready |

### Engine track — Phase 2 (FAR-END modern epic — builds LAST, after gilded)

> The **deep-modern subsystems** — they sit at the end of the timeline and depend
> on the meter bank, the action libraries, and the scaling walls all landing
> first. Build them **after E22 (gilded)** (§9.6 Phase 2). The cross-cutting items
> the modern thread *also* surfaced are already pulled near-term into Phase 1
> (E6/E7/E8) — these rows are only the era-deep work.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E23 | **Enthusiasm / Party-Pref engine + Score economy** | The **4-part reshuffle** after legislation scoring (`hd` dominant-party point-impact: most/least-earning faction shifts ±1, opposition-least +2 "furious"; `drums` independently confirms 4-step across a 3rd era POSTS 50/86/295/442/2537/2726/2879/3115) over the existing `enthusiasm`/`partyPreference` tables; `Faction.score` ledger (from E20) + **era-end awards + per-era banking (handled by K3) + lowest-faction-penalizes-teammates**. Wires into E6's `metersToElectionBonus`. The spine of the modern election engine. | E6 (meter bank), E20 (`Faction.score`), K3 (era-end awards/banking) | M–L | gap #51 (`modern`; `hd` 1394-7799, I-12; **`drums`** 4-step confirmed 3rd era + era-end POST 4477) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E24 | **Presidential primary subsystem (2.9.1) + Primary-Era opt-in (#63)** | Full subsystem: candidate eligibility + blocking (Iron-Fist PL blocks; running incumbent can't be primaried), focus-state charisma-trait table, numeric Strength score, per-Primary-Group loop (debate momentum / scandal / Broke check / actions). Uses the **CPU delegate engine** (from E10) + K2 primary action library + **K5 handler 9i** for CPU. **`hd` adds the emergent Primary-Era calendar (#63):** a Gov "Activate State Primaries" action (WTA/plurality/proportional + Primary-Group 1–5 assignment) flips a Primary-Era flag (primaries precede the convention), spreading by bill/Gov-action; Momentum carries between groups but halves when large; resign-to-run cascade. **`drums` adds the explicit CPU template** (fixed 5-action: Speech+Focus+Attack+Embrace+Promise; attack-target = highest-PV rival; presidential-promise acceptance < half-target; broke roll 5-6 → drop) — wired via handler 9i. New `needsPlayerInput: 'primary'` + `primary?` ledger. | K2, E10 (CPU delegate engine), K0, **K5 + handler 9i** | L | gap #47 (`modern`) + #63 (`hd` I-8; **`drums`** 5125-5732, 6754, 7135) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E25 | **SCOTUS named-Justice docket (divergence #7) — incl. #79 10-yr drift via K5 handler 9n** | From-scratch over a **stub** (4 hardcoded titles + `partyPreference ±0.1`, `phaseRunners.ts:3398-3414`). Per-term case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, Iron-Fist/Manipulative compel-vote + compel-retire (12-yr min; **5 Judicial + Integrity = immune** — `hd`), dynamic court size + court-packing, 64/60% confirmation + moderate-auto-confirm recovery, appointee ideology reveal + **10-yr drift via handler 9n: 25% mid / 10% left / 5% right; Puritan blocks all shifts (#79 canonical, `drums` POST 7533)**, ruling→law-deactivation. **`hd` adds:** a **5-5 tie affirms the lower court & sets no precedent**, and a ruling can **block a whole bill class until an amendment passes** (couples to E5's #64 hook). **`drums` adds:** Manipulative-Pres compelled retirement = d6 5-6 (~33%; POST 1142); Iron-Fist compels cross-party justices without Integrity to vote Nay (POST 6293); SCOTUS sway = ONE vote per swayer + only if initial vote not unanimous (POSTs 4591, 4741, 5079). Gates BUG-2. | K0, E5 (amendments + the bill-class-block hook), E2 (court-packing bills), **K5 + handler 9n** | M–L | gap #52, divergence #7 (`modern`; `hd` 4616-8651; **`drums`** 39-7533 incl. canonical drift #79) — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E26 | **Third-party challenge trigger (2.9.3)** | Party-pref-band + ideology-discontent check → spawn an independent ticket from the rule-selected faction; nationwide ballot for a Celebrity. **Fills the 2.9.3 stub.** **Rebalance the apparent Dem structural bias — DH-11** (Dems reportedly "won every instance a 3rd-party run mattered"). | E23 (enthusiasm/Party-Pref engine) | M | gap #48 (`modern`) + DH-11 3rd-party half (`hd` 7480-block) — CARRIED + EXTENDED | ready |
| E27 | **Military-leadership appointment tier** | JCS / Army Chief / CNO / Generals / Admirals above the existing `GeneralInChief`/`Admiral` seats; auto-confirm; promotion back-fill; rank-mismatch + passed-over-resign rules. Feeds the generic-war per-battle modifiers (SecDef + Joint-Chiefs ×2, leading-officer ×10). Pairs with E3/E3b. | E3 (generic war), E16 (cabinet richness) | M | gap #49 (`modern`; pairs with `hd` #56; **`drums`** confirms officer KIA + replacement chain) — CARRIED, HI-CONF (3 era) | ready |
| E28 | **53-state roster + Wyoming-Rule apportionment + two-home-state pols** | Modern 53-state roster (DC/CU/PR as full states); decennial recompute that resets EV + `bias` + adds/removes a focus-Rep (same `pendingEvDeltas` as E15, larger scale); `Politician.homeStates?: string[]` (audit relocation/Carpetbagger + kingmaker readers — also the alt-state add from #69). **Needs E7 (House-slate persistence) first** — the Wyoming-Rule House size (~572–601) is *why* wall (b) is a hard prerequisite. | E7 (House-slate persistence), E15 (census-delta queue) | M–L | gap #55, #34 (`modern`) — CARRIED, HI-CONF | ready |
| E29 | **Modern legislative depth** | Collective crisis-bill accountability (chamber lets most crisis bills die → controlling party loses Party Pref); bill-relationship/replacement graph (amendment-tier bills repealable only by amendment; downgrade-only policies); **Executive-Branch-Interference** (Admin 4–5 cabinet sec proposes dept bill w/ presidential assent; new-dept→new-seat). **#54 investigation committees already shipped at E14e** (5d6 spec ready). **DH-1 (filibustered MUST-pass remedy) still needs rules authored first** — author the deadlock rule, then build into E14c/here. | E2 (bill typing), E14 (committees/filibuster); **DH-1 needs rules authored first** | M | gap #54, #12b, DH-1 (`modern`) — CARRIED | **needs-design** (DH-1 only); rest ready |
| E30 | **Modern era scenario / continuation (`scenario1948`)** | The XL **capstone**: modern faction roster + nickname menu, modern era-event spine (fictional eras), modern bill/issue catalog, modern card pool (Big Tech/Big Oil/Globalists/LW-RW Media — correct *here*). Reached via `advanceEra` (continuous campaign) or a `scenario1948` boot. **Dead last** — depends on every keystone + most subsystems above. | K3, K4, and most of E1–E29 | XL | gap #2, #41, mechanics §22 (`modern`) — CARRIED | ready (build last) |

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
| — | **A4 battle-card** *(wired by E3)* | The itemized additive-odds battle-card (difficulty + planning + commander + meters → % victory). Build the card shell early; wire real numbers when **E3 (generic war)** surfaces the itemized odds — and reuse it for E3b's two-theater Civil-War battles. | E3 | S | gap A4 (`1772s`; `hd` I-1; `drums` formula) — CARRIED | ready |

---

## Later / parking lot

Bigger, fuzzier, deferred, or **needs-design-before-build**.

### Author-before-build (design tasks — a PM/design job, not a `/build-feature` run)

These have **no rules to build to yet**; the rules must be **authored first**, then
they fold into the engine row noted. **Batch 5 adds six items here** —
contingent-election rules (#10/#84 is the biggest), §25.9 Iron-Fist split,
DH-12 white-peace, DH-13 faithless-elector cap, DH-14 era-aware bill ideology,
DH-15 small-state action multiplier.

- **DH-1 — filibustered "MUST-pass" bill remedy (needs-design).** A required
  bill filibustered to death has no rulebook remedy; the GM improvised a
  4-leader special-committee auto-pass with a per-day "shutdown" penalty clock.
  **Author the deadlock-resolution rule** (forced-compromise vs shutdown-clock
  vs fallback auto-pass), then build into **E14c (filibuster) / E29**. — DH-1,
  debt #21 (`modern` 640-716).
- **Divergence #10 / #84 — Contingent-election rules don't exist (NEW, batch 5).**
  GM Tyler invented **5 candidate rulesets** to settle 1848 tie (`drums` POSTS
  472-474): party-line state vote / faction-first then party / Speaker-Min-
  Leader-controls-state / momentum+swaying / state modifiers. All 5 favored
  Fillmore; GM picked #4 (momentum) to keep play moving. **Author rules
  BEFORE build:** (a) top-2 vs top-3 (DH-6: GM used top-2); (b) outgoing-vs-
  incoming Congress (GM nebulous, used incoming POSTS 4467-4475); (c) deadlock
  side-effects (EBR POST 5250: Controversial gain on elected Pres + 50/50 Dom
  Stab hit); plus 17 state delegations for Pres + 33 Senate for VP (POST 810).
  **Bundles with hd #62 at E10b.** — #10/#84/DH-6 (`drums` 472-474, 810,
  4467-4475, 5176, 5217-5221, 5250).
- **§25.9 — Iron-Fist exact split shape (NEW, batch 5).** The 6 office-keyed
  child trait names + cascade rules need a designer call before build. §25.9
  lists 6 candidate effects (PL+Honest-Gov-maxed gov control; Sen Maj Leader
  vote forcing; President officer-fire / SCOTUS-compel / challenger-stifle;
  Loans-from-Wealthy + IF PL gov takeover; Convention PL unilateral threshold;
  mid-war military replacement) but the **exact names** and **what cascades to
  what** are open. Author the split, then build **E17**. — gap #77 + §25.9
  (`drums` 2433-7364).
- **DH-12 — White-peace rules MISSING from the war system (NEW, batch 5).**
  Tyler (`drums` POSTS 6533-6541): *"There are, in fact, no rules about white
  peace"* — had to dig up old treaty docs. **Author the spec** (Moderate
  Implementation Pres+Sec State+Sec War; 75% −1 Party Pref; −100 Mil-Industry;
  −500 Expansionists; −500 President; return to antebellum status quo), then
  fold into **E3** (generic war) / **E3b** (Civil-War readmission). — DH-12.
- **DH-13 — Faithless-elector trigger cap (NEW, batch 5).** Current trigger
  fires "whenever winner's state has the other party's ideology enthusiasm
  maxed" — over-aggressive (`drums` POSTS 466, 469-471, 2912, 4441): 1876
  produced 22 faithless from Cobb + 12 from Fremont; 1892 produced 8 Whig →
  232-232 tie → House contingent; 1900 had an 8-elector defection. **Author
  the documented + capped trigger** (e.g. max-N per state + state-modifier
  table) + the EBR deadlock side-effect rule (POST 5250). Folds into **E26**
  3rd-party or a per-(state) cap inside the EC tally. — DH-13.
- **DH-14 — Bill ideology impacts not era-aware (NEW, batch 5).** Matt
  (`drums` POSTS 6691, 6878, 6912): Mods need to be removed from the
  negative-points side of Women's Suffrage in 1916 — should be era-sensitive.
  Tyler agreed. **Equal Voting Rights for Women never passes** (60.5% / 63.6%
  short of 2/3): GM: *"This amendment will never pass in a game with CPUs."*
  **Author the era-keyed bill ideology impact tables**, then fold into the bill
  catalog (E14 / E20). — DH-14.
- **DH-15 — Small/large-state action-impact multiplier UNCODIFIED (NEW, batch 5).**
  Tyler (`drums` POSTS 6676-6680): *"Since RI is a small state he would only
  succeed on impacting the meter at 2.5% [half of 5%]; large states double."*
  In playtest sheets ("Effects Meters?" column) but **not codified in the gov
  actions section of the rulebook**. **Author the multiplier rule + the
  small/large-state classification table**, then fold into **E11** (governor
  actions). — DH-15.

> **Author-before-build calls that are owned INSIDE a subsystem epic** (not
> standalone parking items — listed here so they aren't lost):
> - **DH-7** (R/D convention-threshold asymmetry + Iron-Fist unilateral change)
>   — document a chosen rule + re-gate the rules-change power inside **E10**
>   (handler 9e owns the CPU side).
> - **DH-8** (CPU convention AI unstable + ambiguous ballot-shift) — **owned
>   by E9 handler 9e** (the convention CPU handler) + **E10** (the player
>   convention epic). Ballot-shift = next-round (GM ruled).
> - **DH-9** (canonical exec/gov action ability-stat) — decide **at K2**,
>   before the action libraries author their `resolve` stat.
> - **DH-10** (blundered implementations still score) — a per-action
>   `blunderStillScores?` data flag, encoded at **E13**.
> - **DH-17** (convention auto-drop-out + 1-action/candidate cap) — fixed
>   inside **E9 handler 9e** (auto-drop-out after 2-3 ballots of 0 Momentum;
>   1-action cap replaced by Command-limited interballot actions).
> - **DH-18** (dark-horse compromise candidates dodge resignation rolls) —
>   fixed inside **E9 handler 9e** / **E10** (retroactive resignation rolls).
> - **DH-19** (CPU governor menu static; no industry-stack awareness) — fixed
>   inside **E9 handler 9j** + **E11** (state-stack-aware menu).
> - **DH-20** (CPU has no reciprocity / vote-trading) — fixed inside **E9
>   handler 9k** (the reciprocity enforcer; uses K5's `cpuCommitments`).
> - **DH-21** (CPU has no meter-guarding on event picks) — fixed inside **E9
>   handler 9g** (the A/B/C event vote + meter guard).
> - **DH-22** (cascading scandal sequencing hole) — fixed inside **E9 handler
>   9l** + **E15** (era-event extensions; uses K5's `recentScandalIds`).
> - **DH-23** (cabinet 36% pass-rate bug) — XS-S, **NOT a quick-win**; lands
>   inside **E16** (cabinet+confirmation system) as a sibling of the
>   cabinet-retention refactor + **E9 handler 9d** (CPU confirmation).

### Balance dials (fold into the named subsystem; no standalone build)

- **DH-4** — cap "Extend Credit to all nations" → **E12** (diplomacy library).
- **DH-11** — apparent Dem 3rd-party bias → **E26**; inelastic lobby cards →
  **E19** (card algorithm).
- **DH-16** — reapportionment cap 435 likely never triggers in normal play
  (POST 5352: ~year 2000 before the cap binds). No fix needed; flag for the
  apportionment recompute (E28). — NEW, batch 5.
- (DH-3 / DH-5 / #85 were cheap enough to promote to quick-wins QW5/QW6/QW7.)

### Deferred / parking lot

- **Multiplayer — hot-seat (M1).** Round-robin the existing `needsPlayerInput`
  mechanism (`engine.ts:9`) across human factions before `advancePhase`.
  **Hard-blocked on K0 (determinism) AND on K2 + all six action libraries AND
  on K5 + the CPU handler suite** — the player-input modalities *are* the
  action libraries, and any CPU faction in the rotation uses the K5 handlers.
  **`drums` (all-CPU) confirms solo + multiplayer are two modes of one
  engine**: the K5 handlers serve both cases identically — a human taking over
  a CPU faction mid-campaign just disables the handler for that faction
  (§9.5). Also needs the singleton refactor: `playerFactionId` →
  `playerFactionIds: string[]` + audit every "is this me?" call site (debt
  #10). — gap #1, §9.5.
- **Multiplayer — async / backend (M2, L–XL epic).** IndexedDB is per-browser
  (`db.ts`); shared state needs a server (or CRDT/host-authoritative sync).
  Hard-blocked on K0 + M1. Exposes debt #6 (whole-snapshot clone+save
  bottleneck). — gap #1, §9.5.
- **Bill-scoring Phase B (divergence #1).** Re-tune `cardVoteBias`
  (`phaseRunners.ts:1516`) per-card-aware once the E20 leaderboard is live
  and playtested. — divergence #1.
- **Conversion-targeting refactor (divergence #3).** **Keep shipped for
  now.** Revisit after E19 emits a rule-driven `Can Party Flip` signal
  cleanly. (Listed as Phase-1 #21 in §9.6 "if pursued"; bundle DH-5's
  pairing-dissolution here if QW6 is deferred.) **`drums` #76 supplies the
  full 2-layer Disgruntled-auto-flip + active-poach %-table + adjacency
  gating + failure-strip — which becomes the K5 handler 9f spec when the
  refactor is approached.** — divergence #3, debt #13.
- **Named-ordinal meter relabel (presentation half).** The full labeled-
  ordinal meter *presentation* (vs the ±3 clamp in QW3 + crisis/cascade in
  E6) touches every meter read/write + the UI; ride it on the presentation
  track only if playtest says the numbers read poorly. The first-class
  war-score meter rides E3. — §21.8/§22.1.
- **Far-future / progressive era (post-1892, pre-modern).** Feminists /
  socialists / communists / prohibitionists / eugenicists / labor activists;
  movement/coalition spawning across eras (#6). The `progressive` enum
  value is added in K4; a `progressive` scenario lifts in once a
  progressive digest lands. — gap #2, #6.
- **Gilded-Age issue *system* depth.** Per-issue interest groups, full
  era-event spines, imperialism annexation flow distinct from `admitState`
  — beyond the E22 data shells. — gap #3, #6.
- **Cabinet "free pick-up" legislation (12b) + foreign-volunteer scheduling
  (#46).** The 1772 Treasurer free-pickup variant; events scheduling a
  future-draftable figure (Lafayette 1784) routed to the lowest-scoring
  eligible faction. (The general Executive-Branch-Interference form is E29;
  Free Executive proposals from SecTreas/SecWar are wired into E14's bill
  pipeline.) — gap #12b, #46.

---

## Sequencing notes

Why the order is what it is — the tech-lead's binding calls (§9.6 + §9.1.3 +
§6.6.1). **The three batch-5 leads come first.**

1. **K5 (`CpuController` scaffold) is a NEW late-keystone — after K0 + K2,
   parallel with K3/K4 + federalism** (tech-lead §9.6 call #1, §9.1.3 — the
   single most important batch-5 call):
   > "The shipped engine has **no agent-decision pass at all** (3 thin stubs
   > only). The §25 spec'd 15 subsystems have nowhere to live without it. K5
   > itself is ~120 lines (orchestrator + handler interface + tie-breaks + 2
   > `repair()` backfills + 1 determinism test). It **unlocks ~15 follow-on
   > handler PRs** that parallelize across contributors. K5 is a
   > force-multiplier, not a scenario gate — federalism + the 1856-arc epic
   > can ship with stubbed handlers and upgrade together."

   So K5 sits as the 6th Phase-0 keystone, parallel with K3/K4. The 15-handler
   suite is a single Phase-1 epic (E9) ordered by §6.6.1's handler-order table.

2. **Cabinet-confirmation system (DH-23) is XS-S, NOT M — because the broken
   system isn't built yet** (tech-lead §9.6 call #2, §9.3 #14):
   > "`runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step
   > scored pick with no Senate vote. So the fix is 'build the confirmation
   > step in the right shape from day one' (default-AYE baseline + Iron-Fist
   > Maj-Leader auto-AYE-own-picks + lobby-maximizer Admin-weighting), which
   > is CPU handler #4 (§6.6.1). Lands as a sibling of the cabinet-retention
   > refactor (Phase-1 #16)."

   So DH-23 is **not a quick-win**; it lands at E16 as the XS-S confirmation
   step + at E9 handler 9d for the CPU side.

3. **What's READY now vs. what still needs design** (tech-lead §9.6 call #3):
   > "**READY (no design task remaining):** the 13 §25 subsections #25.1–#25.8
   > + #25.10–#25.14 — all 15 CPU handlers can be authored against §25
   > verbatim. Plus #79 25/10/5 Justice drift, #80 ±3 swing cap, #82 veto
   > override 2/3, #83 midterm meter+enthusiasm, #85 5%/half-term
   > retire-death. **NEEDS DESIGN (parking lot):** divergence #10 / #84
   > contingent-election rules (5 rulesets invented mid-thread, no canonical
   > answer); §25.9 Iron-Fist split (the 6 child traits' exact names + cascade
   > rules); DH-1 filibustered-MUST-pass; DH-12 white-peace; DH-13
   > faithless-elector trigger; DH-14 era-aware bill impacts; DH-15
   > small-state multiplier."

   READY-now count went from ~30 to ~45+ this batch; needs-design grew from
   1 (DH-1) to 7 (DH-1 + #10/#84 + §25.9 + DH-12/13/14/15).

4. **BUG-0 is the cheapest win in the whole roadmap — do it first** (carried
   from batch 4):
   > "Verified: `RELOCATION_ATTEMPTS_PER_TURN = 5` at `types.ts:247`; one-line
   > const edit, no migration, no dependency."

   Sits at the very top of the quick-wins (QW0).

5. **Per-era point BANKING (#68) reshapes the era keystones + the win
   condition — not a new item** (carried from batch 4):
   > "The era boundary is a bank-and-zero + award + full 2.1.x→2.3.1 re-run +
   > content-swap pipeline; the per-era banks sum toward the (open) cross-era
   > win total. Build `advanceEra` with the bank step from the start."

6. **The Civil-War / Reconstruction epic lands EARLY-ish (E3b) because it
   COMPLETES a shipped scenario** (carried from batch 4):
   > "`scenario1856.ts` ships today but its era-event spine dead-ends at the
   > Trent Affair (1861); adding #56/#57/#58/#59 completes a half-finished
   > playable scenario."

   E3b sits right after generic war (E3) + K2, **not** behind federalism (E1)
   or the modern tail. **Batch 5 adds: it is the first scenario to get a full
   K5 handler suite — wire handlers as they land.**

7. **Generic war (E3) is DESIGNED multi-theater + tiered from day one — with
   the multi-confirmed formula** (tech-lead §9.6, sharpened batch 5):
   > "`drums` re-derives the formula `Win% = Difficulty + Planning + Officer×10
   > + MilPrep + Benchmarks` end-to-end across Eastern + Western + Utah + WWI
   > + Mexico + Sioux — the single most multiply-confirmed cross-era resolver
   > in the knowledge base. `WS ≥ +11` auto-win; war-end `WS×2 = %`; post-war
   > defeat `|WS|×2×10`; naval-N-then-ground per-war; Treaty A-D + 3-roll
   > chain. The Civil War is the Major-tier instance — a configured instance,
   > not a rewrite."

8. **K2 (ActionRegistry) remains the second-most-important keystone after K0**
   (~6× leverage across 6 action libraries) **AND is a hard prerequisite for
   K5** — most CPU handlers pick from a registry library. Do K2 first if only
   one keystone lands this quarter.

9. **The two-track parallelization is still the biggest schedule lever**
   (tech-lead §9.4, §9.6). Sync points: a handful of additive `Politician`/
   `Party` fields + two deeper handoffs (A4 ↔ E3 war odds; P2 ↔ E8 portraits).
   Start the presentation track immediately with P0.

10. **(carried) #8 cabinet, #7 SCOTUS, the two scaling walls, far-end vs
    near-term.** #8 is a real cabinet wipe→retention refactor (M, E16) —
    batch 2 wrongly said no wipe exists (`:3804-3812`). #7 SCOTUS is
    from-scratch over a *stub* (`:3398-3414`), far-end (E25). The two
    scaling walls (persist House slates E7; procedural pol gen E8) are
    NEAR-term, not modern-only. Federalism before gilded before modern;
    `scenario1788` before a fully-general `advanceEra`.

11. **RNG first (K0).** Determinism is the prerequisite for multiplayer
    AND for **K5's deterministic tie-breaks** (every CPU decision must be
    reproducible from the seed), AND any replay/test harness, a soft gate
    for every roll-heavy subsystem (war E3/E3b, convention E10, governor
    d100s E11, filibuster E14, primary E24), **and a hard gate for the
    seeded procedural pol generator (E8)**.

12. **Within-track dependency notes.** **E18g (numeric `nationalSurplus`/
    `nationalDebt`) is a prerequisite for E2's cap *and* E6's debt field —
    build that sub-item early.** E4's global flip needs E5 (amendments). E21's
    statehood needs E2 + E3 + E8; **E3b's Canada arc (#60) needs E21's
    per-era admission gate.** E10b's VP-vacancy fill needs E5. E14e
    (investigation) needs E2's bill type. E24 needs E10's CPU delegate
    engine + handler 9i. E26 needs E23. E28 needs E7. **All 15 E9 handlers
    need K5; 9k/9l also need K5's persistent state.** P1/P2/P3 consume P0.

### Estimate caution

Sizes are the tech-lead's. Rows that may still feel XL after a first pass:

- **E3b (Civil-War / Reconstruction)** — sized L but it is a full subsystem;
  **ship as 5 sub-PRs** (secession #58 → sectional crisis #59 → two-theater
  war #56 → Reconstruction #57 → Canada #60), cheap-first.
- **E1 (federalism epic)** — sized L; expect the era-event spine and the
  SCOTUS set to each be their own sub-PR.
- **E9 (CPU handler suite)** — **~15 PRs**, not one. Order by §6.6.1; ship
  one at a time. Handlers 9k/9l (the DH-* architectural gaps with persistent
  state) land **after** the simpler handlers have exercised the scaffold.
- **E10 (convention)** — the single biggest unbuilt subsystem; **split into
  ~3** (ballot loop → inter-ballot library on K2 → platform/VP/scandal).
  The CPU side is owned by handler 9e (E9), not by this epic.
- **E14 (legislative micro-mechanics)** — now **7 sub-PRs** sharing the bill
  pipeline (block-and-replace → packaging → filibuster → crisis tag →
  investigation #54 → veto override #82 → midterm #83).
- **E16 (cabinet + Congress + offices-by-law + confirmation)** — **four
  coupled jobs** (9-role Congressional pipeline, the cabinet-wipe→retention
  refactor, the XS-S confirmation step DH-23, offices-created-by-law #66);
  **split if any feels XL during scoping.**
- **E30 (modern era scenario)** — the XL capstone; decomposes into roster +
  era-event spine + bill catalog + card pool sub-PRs; gates on most of Phase
  1 + 2.
- **P2 (portrait pipeline)** — an asset-pipeline epic; the no-AI-in-product
  constraint shapes the tech choice from day one; must render generated pols
  (shared with E8).

---

## Provenance note

This reflects **batches 1–5**: the `f4c7c2c4` 1868 Gilded-Age multiplayer
dry-run, the `f55d3e21` 1788 federalism solo-with-AI playtest, the `85f8e6b4`
1772 solo aesthetic experiment, the `3a9ac985` modern (1948→2020) multiplayer
campaign, the `77db6e6f` **1856-native "A House Divided" Part 2** (9051 posts —
the only source for the Civil-War / Reconstruction / secession machinery), and
now the `e1776bbd` **all-CPU "Drums of War"** (7540 posts — the first explicit
forum record of CPU heuristics). The batch-4 roadmap was a three-phase engine
track + a presentation track + 1 quick-win at the front; this re-sequence:

- **adds K5 (`CpuController` scaffold)** as a new late-keystone, parallel with
  K3/K4 — the §25 spec'd 15 CPU subsystems have nowhere to live without it;
- **inserts a CPU handler suite epic (E9)** with 15 parallelizable PRs, one
  per §25 subsection, ordered by §6.6.1's handler-order table — handler 9d
  lands the cabinet 36% bug fix (DH-23), handler 9e owns the convention CPU
  (DH-8 + DH-17 + ballot-shift + DH-18), handler 9g owns meter-guarding
  (DH-21), handlers 9k/9l own the reciprocity + scandal-smoother architectural
  gaps (DH-20 + DH-22);
- **re-sizes the cabinet 36% bug (DH-23) from M to XS-S** — the broken system
  doesn't exist yet; build it in the right shape from day one at E16 as a
  sibling of the cabinet-retention refactor;
- **updates generic war (E3) to multi-theater + tiered from day one** with the
  multi-confirmed `drums` formula (5+ wars × 4 eras);
- **adds the Iron Fist split (E17)** as an M epic — independent of K5, needs
  the §25.9 exact-split design first (now in parking lot);
- **promotes #85 5%/half-term retire-death to a new quick-win QW7** (1-line
  `MORTALITY_RULES` refinement);
- **adds divergences #10–#13** and **DH-12..DH-23** — six new author-before-
  build items (#10/#84 contingent-election, §25.9 Iron-Fist split, DH-12
  white-peace, DH-13 faithless-elector cap, DH-14 era-aware bill ideology,
  DH-15 small-state action multiplier);
- **wires K5 dependency into M1 hot-seat multiplayer** — any CPU faction in a
  hot-seat rotation uses the K5 handlers; a human taking over a CPU faction
  mid-campaign just disables the handler for that faction.

**Still provisional.** Subsequent `/ingest-playtest` runs will refine scopes
(especially the CPU handler internals, the contingent-election rules, the
§25.9 split, the convention CPU specifics, the Civil-War sub-splits, the
~16-meter Lingering order, and the cross-era win-total number the per-era
banks sum to), may re-split currently L-sized rows, and may surface items now
parked or unknown. **The order above is buildable top-to-bottom today;
re-validate on every digest.** Open design calls that gate ordering
(contingent-election rules, §25.9 Iron-Fist split, DH-12 white-peace, DH-13
faithless-elector cap, DH-14 era-aware bill ideology, DH-15 small-state
multiplier, era-event scheduling hybrid, era-enum split, meter relabel,
procedural-generation distribution, DH-1 filibuster remedy, draft 3/3-canonical,
Civil-War end-year, cross-era win total) are tracked in `game-context.md` →
Open questions.

---

**Roadmap path:** `/home/user/AMPU/docs/game/roadmap.md`.
