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
> track. **Batch 3** absorbed `3a9ac985` — a **2276-post modern
> (1948→2020) multiplayer campaign**, the most mechanically mature thread yet. It
> **corroborates ~30 prior deltas across a 4th era** (the keystone calls are now
> as strong as they will get), adds the modern subsystems (named meter bank,
> enthusiasm/Party-Pref engine, full primary→convention→general, named-Justice
> SCOTUS docket, CPU delegate engine, military-leadership tier, 53-state roster +
> Wyoming-Rule apportionment, two-home-state pols), **two new divergences (#7
> SCOTUS, #8 cabinet)**, **two GM-confirmed design holes (DH-1 filibuster-MUST-pass,
> DH-2 era-deck-off-year)**, and — architecturally most important — **two scaling
> walls that are NOT era-gated** (dataset exhaustion → procedural pol generation;
> Wyoming-Rule House bloat → persist/auto-fill slates).
>
> **Batch 4** absorbs `77db6e6f` — a **9051-post 1856-native
> "A House Divided" Part 2** campaign (1856→1904 alt-history multiplayer), the
> **first 1856-native procedural record** and **only source for the Civil-War /
> Reconstruction / secession machinery**. It is mostly the **4th–5th corroboration**
> of the existing gap log across a new era, so the keystone calls do not move; the
> NEW surface is: **(1) a concrete shipped bug** — `RELOCATION_ATTEMPTS_PER_TURN`
> is `5` at `types.ts:247` but the design changed it to `4` mid-thread and it went
> *live in the running playtest* (divergence **#9**; the clearest "the forum drives
> the build" evidence) — a **one-line XS quick-win, now at the front of the
> quick-fix list**; **(2) the era model is per-era point *banking* toward an
> end-of-game total, not reset-and-discard** (#68) — an **architectural refinement
> folded into K3/K4**, not a new keystone; **(3) the Civil-War two-theater combat
> engine + Reconstruction readmission subsystem** (#56/#57) — a sizeable subsystem
> that **ENHANCES the already-shipped 1856 scenario** (unlike the federalism epic,
> which is a *new* scenario), so it is placed **early-ish — after generic war (#6)
> + ActionRegistry (K2) — because it completes a playable shipped scenario**; plus
> (4) succession/eligibility + 0-Command acting president (#61), contingent House
> election + tied-chamber inverse control (#62), offices-created-by-law (#66),
> era-keyed amendment ratification by governors (#64), the "3 traits + 3 alt-states"
> draft re-rule (#69), the now-**authored** investigation 5d6 spec (#65 → #54 moves
> from needs-design to **ready**), and **nine new design holes (DH-3..DH-11)** — most
> notably the **CPU convention AI is GM-confirmed unstable (DH-8)**, which any
> conventions build must own.
>
> **Batch 6** (this revision) absorbs `c50d9da7` — a **1172-post, multiplayer
> "Era of Populism Playtest"** that is the **first dedicated fresh-boot of a
> modern-era scenario** in any ingested thread (vs. batch 3's `modern` 60-yr
> continuation from a 1948 campaign). The thread's unique value is
> **scenario-boot model + a NEW meter-driven endgame**. Five structural deltas:
> 1. **APOCALYPSE meter-driven endgame is a NEW engine surface (divergence #14).**
>    Verified vs shipped: the only endgame model in the engine today is
>    **event-driven** — `EraEvent.triggersGameEnd` (`types.ts:1476`) is consumed
>    at `phaseRunners.ts:2871` which sets `game.gameEnded` (`types.ts:1635`). There
>    is **no meter-watcher, no countdown clock, no `endgameClocks` array** anywhere
>    in the engine. The Populism playtest documents (`pop` POST 542, 548) a
>    NEW endgame condition: Planet's Health crashing into APOCALYPSE band starts a
>    **10-game-year (5 half-term) countdown** to mandatory game-end; recovery
>    above threshold clears it. **Sizing M.** Needs: new `GameState.endgameClocks:
>    { meter; threshold; remainingYears; startedYear }[]` field +
>    `repair()` backfill `[]` + a per-meter band-monitor in the Lingering phase
>    (`runPhase_2_5_1`) that arms/disarms/decrements clocks + a new termination path
>    in `runCurrentPhase` (engine.ts) that fires when `remainingYears` hits 0 +
>    HUD warning in `GameOverScreen.tsx`. **Phase placement: Phase 1.** Rationale:
>    `pop` documents Planet's Health as the canonical instance, but row #88 says
>    "analogous bottom-tier endgame clocks may exist for other meters/eras." The
>    `planet` meter ships today (`types.ts:1406`, all eras tick it) and the model
>    is **meter-agnostic** — once the clock infrastructure exists, the Populism
>    instance is one configured row in a per-era table. The meter-clock and the
>    `triggersGameEnd` event-path share a sink (`game.gameEnded`); both must close
>    cleanly. **Pulls forward** with the meter-model generalization (Phase-1 #6).
> 2. **`cabinetSeatsForYear` becomes the BOOT SEED only (divergence #15).** Verified:
>    `cabinetSeatsForYear(year)` at `types.ts:1196` is a pure derived function with
>    NO mutable state; the cabinet seat list is **recomputed each turn**
>    (`phaseRunners.ts:2162`). The designed model (§24.6 + §26.5) makes the seat
>    list a **mutable persisted array** driven by passed bills + era events. A
>    Climate-Crisis-bill-passes → cabinet gains a Sec of Environment & Climate seat
>    next administration. **Refactor** `cabinetSeatsForYear` to **seed**
>    `GameState.cabinetSeats: SeatSpec[]` at boot only; runners read the mutable
>    list. Folds into **E16 cabinet retention** (already on the roadmap) — sized
>    M-ish; the cabinet pipeline is touched anyway, this is one more refactor of
>    the same code area. Bill content needs `Legislation.createsCabinetSeat?:
>    SeatSpec`. Pairs with #66 (Progressive institutional layer).
> 3. **Amendments toggle CAPABILITIES, not just rules (divergence #16).** Verified:
>    no `requires:` predicate, no `ActionRegistry`, no `AmendmentPredicate` exists
>    in the engine today (a single `isAvailable` match is in `revolutionaryWar.ts`,
>    unrelated). The designed model (§26.7): each action-library entry carries a
>    `requires: AmendmentPredicate?` field; the library is filtered against
>    `game.amendments.passed` at evaluation. The canonical instance: the general-
>    election action "Send VP to Shore Up Support" requires the 12th Amendment.
>    **K2 design must account for this from day one** — the `GameAction<Ctx>`
>    shape gains a `requires?: AmendmentPredicate` field, and the filter step in
>    the action picker reads `game.amendments`. **Cost-effective if folded into
>    K2** (one extra field); **expensive if retrofit** (every library has to be
>    re-traversed). **K2's spec is updated below** to include this.
> 4. **State roster keyed to BOOT YEAR, not era enum (divergence #17).** Verified
>    against the data layer: `states1772.ts` / `states1856.ts` are the only
>    rosters; `expansionStates.ts` is the post-founding admittable pool. **There
>    is no notion of "multiple rosters per era enum."** The 2012 fresh-modern
>    boot is **50 + DC** (`pop` POST 264) while the 53-state alt roster (`modern`
>    §22.10, Wyoming Rule) is the *product* of 60 yrs of annexation events in the
>    `modern` continuation. **Both rosters need to exist for the same `modern`
>    enum.** This refines K4 (era-content registry) + the modern scenario items:
>    the registry must key on `{era, startYear}` (or `scenarioId`) for the
>    initial state roster, and the annexation chain must mutate the snapshot's
>    state list at fire time. Folds into K4 + E28 (53-state roster) +
>    E30 (modern scenario boot). Sized as a design refinement, not a new keystone.
> 5. **The scenario-boot schema (§26.1) is the cross-cutting K4 build constraint.**
>    Three documented mid-government boots — 1788 (designed), 1856 (shipped),
>    2012 (designed in `pop`) — share the SAME shape: a pre-built sheet with
>    pre-named faction roster + per-faction archetype politicians + era-tuned
>    ideology/interest/lobby decks + sitting government keyed to start year +
>    state roster keyed to boot year + EXPLICITLY EMPTY at boot (no faction
>    leaders, no career-track pols, no inherited PV/legacy/dynasty). **Build the
>    `BootSheet` schema ONCE in K4**, instantiate per era. Era identity is
>    **data configuration**, not a code path. **K4's spec is updated below** to
>    name this explicitly. Also: a **Senate-class verifier (DH-24)** and a
>    **`TRAIT_CONFLICTS` validator (DH-27)** run at scenario-boot time.
>
> **DH-24..DH-28 classification.** **DH-25 (career-track bootstrap unresolved) is
> the biggest — 3-year-stale design discussion** that **blocks any modern scenario
> shipping**. Author the rule before `scenario1948`/`scenario2012` ships (parking
> lot). DH-24 (Senate-class boot data) is XS — one verifier helper. DH-26 (3rd-
> party VP "same traits") is a balance dial folded into the 3rd-party trigger
> (E26). DH-27 (`TRAIT_CONFLICTS` not enforced at boot) is XS — one validator at
> dataset/boot. DH-28 (incomplete meter-impact tag coverage) is a CI/dataset-time
> validator — folds into the dataset pipeline.
>
> **CPU handler 9b legislation refinement: conditional-vote-rules primitive
> (`pop` POST 1111).** The §25.9 Iron-Fist split now subsumes the conditional-
> vote-rule infrastructure — Iron-Fist controllers publish **declarative
> predicate → {AYE/NAY}** policies (e.g. "Sen Maj Leader NAYs any nominee with
> Admin<3 unless faction holds Integrity"). Promote `compelledVoteRule?:
> Predicate → Vote` to a **first-class CPU-handler primitive**: store it on
> `Faction.factionLeader` (or its rename target), wire CPU handler #2 (legislation
> NAY/AYE/NAY) to consult it BEFORE the §25.6 heuristic. Subsumes the per-vote
> Iron-Fist effect AND the "auto-AYE for own picks" cabinet rule (§25.5.2) under
> ONE primitive — see §6.6.1's handler-order table updated below.
>
> [§9](#9-build-sequencing-advice) is re-sequenced for these deltas.
>
> **Batch 7** (this revision) absorbs `6aa7309a` — a **9943-post, multiplayer
> "Era of Republicanism 1800–1868" playtest** (`rep1800`) that **fills the
> 1800–1856 early-republic gap end-to-end** and is the **direct predecessor of
> batch-1's `gilded`** (same GM, identical roster — the 1800 campaign is now
> documented 1800→1868 here + 1868→Gilded in batch 1). Mechanically it is mostly
> the **5th–8th corroboration** of the existing gap log across the
> Republicanism → Democracy → Manifest-Destiny → Nationalism bands, so most
> keystone calls do not move. But it carries **the single biggest architectural
> reframe in the entire knowledge base** and three other structural deltas:
> 1. **★ ERA-MODEL REFRAME — eras are CONTENT-BANDS gated by game-state +
>    territory, NOT calendar year (#92 / §27.1; reshapes K3 + K4).** **Verified
>    vs shipped:** the engine gates *phases* by `year % 4` / `year % 2`
>    (`isDraftYear`/`isPresidentialYear`/`isElectionYear`, `phases.ts:49-59`) —
>    which is **correct for cadence and should stay** — and the only era
>    *advance* in the code is the hard-coded `currentEra = 'federalism'` at
>    `constitutionalConvention.ts:198` (a one-off keyed to a game-state event,
>    the Constitution ratifying). There is **no year→era derivation anywhere**;
>    `currentEra` is a plain field (`types.ts`, the `Era` enum at `:1337`).
>    `rep1800`'s clock ran **~30 years "behind" its content** (Louisiana
>    Purchase succeeded in calendar **1834**, not 1803, after decades of failed
>    rolls — §27.1 table) because **content is gated on TERRITORY YOU ACTUALLY
>    HOLD** (Louisiana-born pols un-playable until LA is owned; Indian-Removal
>    bills gated behind owning LA) and game state advances at whatever pace
>    players play. **The reframe:** `advanceEra` (K3) becomes **condition-driven
>    (game-state / meter / territory triggers, evaluated per half-term)**, NOT
>    year-boundary-driven; and all content (bills, era-events, draftees,
>    bias-table) must be gated by an explicit `game.eraBand` + territory
>    ownership, **not by literal year**. This **RECONCILES three prior findings
>    into one coherent era system**: the per-era point-banking boundary (#68,
>    §2.5), the scenario-boot model (§26 / K4), and this content-band finding —
>    point-banking fires *at* the content-band boundary, wherever it lands on the
>    calendar. **This is a refinement of the EXISTING K3/K4 spec, not a new
>    keystone** — but it is the most important sentence in §9: K3 was already
>    "year-decoupling + per-era point banking"; batch 7 makes the trigger
>    **explicitly condition-driven** and adds **territory-gating of content**.
>    See §9.1.5 + the updated K3/K4 rows. Also: the forum runs **four sub-bands**
>    (Republicanism / Democracy / Manifest-Destiny / Nationalism) where the
>    engine has the **one `nationalism` value** — open question whether those
>    become distinct enum values, sub-phases, or pure content-band markers
>    (§27.1; `rep1800` open-Q 2). My call: model them as **content-band markers
>    on a game-state gate** first (cheapest, additive), promote to enum values
>    only if rule tables genuinely diverge.
> 2. **★★ RECONSTRUCTION SOLO-BLOCKER is a BUILD REQUIREMENT on the E3b
>    Civil-War / Reconstruction epic (DH-29 / §23.4 / #57).** GM-verified
>    (`rep1800` POST 9170): *"the CPU factions will never vote for that bill…
>    only 3 factions would ever consider voting for it… in a single player game
>    it basically can never pass."* The historical **Strict / Ironclad-Oath
>    readmission plan can NEVER pass with CPU factions**, and post-guerrilla-war
>    even the Lenient-10% plan was effectively un-passable — so **solo
>    Reconstruction is UNRESOLVABLE**, which dead-ends the 1856-arc epic for the
>    single-player game the product actually is. This is **not a balance dial —
>    it is a hard "the epic is unwinnable solo without this" requirement.** The
>    E3b epic must ship a **CPU-passable readmission path** (a CPU default-vote
>    bias for the historical plan / a guaranteed-pass crisis-bill path / an
>    auto-resolution at era boundary) **or an alternate resolution**. The GM
>    names it the **primary driver of the in-progress CW/Reconstruction rules
>    rewrite**. Ties to the **CPU handler suite (K5 / E9)** — a CPU
>    "vote-for-the-flagged-historical-plan" rule is a handler concern. Flagged
>    prominently in §9.1.6 + the E3b row + DH-29.
> 3. **Ideology-as-CIRCLE (#99 / §27.7) is a FOUNDATIONAL ideology-model change,
>    era-gated by a flag.** A **mid-era rule change** wraps the 7-point scale
>    into a **ring**: LW Populist ↔ RW Populist become adjacent (one-step shifts
>    at the standard ~25% base), and conversions extend to **adjacent** (not
>    same-only) ideologies. **Verified vs shipped:** `IDEOLOGY_ORDER`
>    (`types.ts:14`) is a **LINEAR array**, and ideology distance is **open-coded
>    as `Math.abs(IDEOLOGY_ORDER.indexOf(a) - …)` at 10+ engine call sites** —
>    `factionCenter` (`phaseRunners.ts:715`), `stepToward` (`:740`, the shift
>    step), conversion adjacency (`:993-1003`), sponsor-distance (`:3548`), plus
>    a private `ideologyDistance` helper in `firstContinentalCongress.ts:120`
>    and 3 UI pages. **There is no central distance helper** — so the change is
>    genuinely cross-cutting (it touches factionCenter, the 2.1.5 shift pass, the
>    §25.8/#76 conversion gate, VP/platform "adjacent ideology" checks). **Sizing
>    M — foundational but not a keystone.** The clean path: introduce a central
>    `ideologyDistance(a, b, circular)` helper, migrate the open-coded sites to
>    it, and have it read `min(|a−b|, 7−|a−b|)` when `game.ideologyIsCircular` is
>    set. It is **era-gated** (a mid-era flag, not global day-1), so day-1
>    behavior is unchanged. **Place it as a near-term foundation refactor** —
>    cheap to do early (it is mechanical and additive while the flag is off), and
>    every later ideology consumer benefits from the central helper. See §9.1.7.
> 4. **Four new early-republic subsystems + seven design holes.** New subsystems:
>    the **12th-Amendment election-mode toggle** (legislature-chosen electors;
>    links #44 per-state EC) — §27.3 / #93; **slavery-as-state-flag + Cohens-v-
>    Virginia amendment-only-abolition** (refines secession #58/#59 + State
>    shape) — §27.4 / #94; **statehood-by-bill + unorganized-territory gating**
>    (refines #43 + `admitState`) — §27.5 / #95; the **Second Bank recharter
>    clock + Bank War exec action** (a NEW stateful economic subsystem; ties to
>    ActionRegistry K2 + the offices-by-law layer #66) — §27.6 / #95. Plus
>    amendments-mutate-core-rules (the "Sexenio" — §27.8) and a 20-state
>    Call-for-Convention crisis (#96) and Civil-War variants (#97) and a
>    coup/meters-driven game-over set (#98). **Design holes DH-29..DH-35** are
>    classified below: **DH-29** is the Reconstruction solo-blocker (above);
>    **DH-30** (event-scheduler-no-min-floor — fix = 20%-of-max + spill-to-
>    anytime) is a **quick-win folded into BUG-1 / the era-event work**;
>    **era-events-predating-start-DROPPED is the SAME bug as BUG-1** (confirmed —
>    `rep1800` LIVE-confirms the LA-Purchase-dropped-at-1800-start episode, a 2nd
>    instance, and DH-30 is its companion — **merged into BUG-1**); **DH-31**
>    (procedure-bills bypass veto but the engine MIS-ROUTES them to the President)
>    is a small **verify-and-fix** in the bill-typing epic; **DH-32**
>    (SCOTUS-can-void-a-STATE) is a **guard** in the SCOTUS ruling-effect path
>    (a state cannot be ruled unconstitutional); **DH-33** (impeachment-broken)
>    is **author-before-build** (corroborates `hd`); **DH-34**
>    (static-era-biases → the Red-unwinnable "AMPU 2.0" hole) is a **roadmap
>    decision, not a quick fix** — ship static biases (accept the imbalance) vs.
>    invest in policy-reactive biases (GM: "maybe AMPU 2.0"); **DH-35**
>    (thin-early-era-presidential-agency) is an **era-gating-with-enough-early-
>    agency** constraint on the exec-action / primary libraries.
> 5. **`scenario1800`?** The 1800 mid-government boot (pre-seeded Pres/VP/Cabinet/
>    6-Court/Congress + a rookie draft, NO leaders/career-tracks at boot) is
>    documented end-to-end and **becomes a candidate scenario** — another
>    `BootSheet` instance alongside `scenario1788` / `scenario1856` / `scenario2012`.
>    **It is NOT a priority** (it sits in the same `nationalism`-adjacent band
>    federalism→nationalism already cover, and the federalism `scenario1788` is
>    the better "first new scenario" — §9.1.1). Place it as an **optional later
>    boot sheet** once the `BootSheet` schema + the early-republic subsystems
>    (12A toggle, slavery-flag, Second Bank, statehood-by-bill) land. See §9.6.
>
> [§9](#9-build-sequencing-advice) is re-sequenced for these deltas (§9.1.5
> era-model reframe; §9.1.6 Reconstruction solo-blocker; §9.1.7 ideology-as-
> circle; new subsystem rows; divergences #18-#21; DH-29..DH-35 classified).
>
> **Batch 5** absorbs `e1776bbd` — a **7540-post, all-CPU 1841→1924
> "Drums of War" playtest**. Because the run was all-CPU, it is the **first
> explicit forum record of CPU heuristics, thresholds, tie-breaks, and formulas**.
> Its unique value is **agent-decision specification**, not new mechanics. Three
> structural deltas:
> 1. **DH-8 (CPU AI under-specified) is now RESOLVED for explicit heuristics**:
>    `game-mechanics.md §25` (720 lines, 15 subsections) and `game-context.md`
>    rows #70–#78 spec the candidate-selection 75/25 rule (§25.1), the VP 8-element
>    rubric (§25.2.1), the IRV bloc-vote ladder + 3-ballot collective-endorse
>    (§25.3), the per-ballot convention menu + ballot-10 compromise / ballot-25
>    dark horse (§25.4), cabinet confirmation (§25.5), the legislation NAY/AYE/NAY
>    heuristic (§25.6), A/B/C event voting (§25.7), conversion-poach %-rates
>    (§25.8), the Iron-Fist office split (§25.9), 4-condition faction-leader
>    removal (§25.10), kingmaker endorsement rules (§25.11), primary CPU AI
>    (§25.12), the deterministic faction-rename trigger (§25.13), and the 25/10/5
>    Justice-drift table (§25.14). **DH-8 REMAINS open for the architectural
>    gaps** (DH-20 reciprocity / vote-trading; DH-21 meter-guarding on event
>    picks; DH-22 cascading scandal sequencing; §25.15) — these need **new data
>    structures + a new agent-decision pass**, not single-line rule additions.
> 2. **DH-23: cabinet 36% pass-rate bug** — designer-acknowledged
>    (`drums` POSTS 4702–4708). The "low chance to reject" rule was lost from the
>    rules doc; combined with a 50/50 Admin-1 inexperience trap and a
>    lobby-maximizing seat-filler that picks Admin-nobodies, 36% of 88 nominees
>    confirmed. **Verified-vs-shipped:** the engine ships **no Senate
>    confirmation step at all** — `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158`)
>    is a one-step scored pick (`scoreCabinetCandidate`, `:2229`) that goes
>    straight to `snap.game.cabinet[seat] = pick.id` + `addLog("confirmed as
>    ${seat}")` (`:2191–:2198`). **The bug doesn't exist today because the
>    *system* doesn't exist today.** This makes the fix smaller than expected —
>    XS-S — but it also means the cabinet-confirmation epic is the
>    venue where the lost-rule fix lands (a default-AYE baseline; an Iron-Fist
>    Maj-Leader auto-AYE-own-picks rule; the lobby-maximizer Admin-weighting),
>    not a quick-win against existing code.
> 3. **Multi-confirmed war formula and a new CPU-AI keystone (K5).** The Civil-War
>    formula `Win% = Difficulty + Planning(SecMil+CoS) + Officer×10 + MilPrep +
>    Benchmarks` (§23.3 / §25-adjacent) is now corroborated across 5+ wars + 4 eras
>    (`drums` Eastern + Western + Utah + WWI + Mexico + Sioux), with `WS ≥ +11`
>    auto-win, war-end `WS × 2 = %`, post-war defeat `|WS| × 2 × 10 = %`, KIA on
>    natural-1, and a 3-roll treaty chain. This **sharpens E3** (generic war) — it
>    must ship multi-theater + tiered from day one, naval-N-then-ground gating
>    per-war, with the Civil War as one configured Major-tier instance. **K5 is
>    NEW:** a `CpuController` scaffold (`src/engine/cpu/`) — a pluggable
>    per-subsystem agent-decision pass with deterministic tie-breaks (seeded RNG)
>    + persistent state for reciprocity (DH-20) and scandal cooldowns (DH-22) +
>    handlers wired against `ActionRegistry` (K2). The §25 heuristics are the spec;
>    K5 is the home. Sits **after K2 + K0 but before per-subsystem CPU handlers**
>    (each handler is a lightweight per-subsystem PR). See §9.1.3 + §9.2.
> [§9](#9-build-sequencing-advice) is re-sequenced for these deltas.
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

**Batch 4 (1856-native `hd`):** these EXTEND the already-shipped 1856 scenario
(`scenario1856.ts`, era `nationalism`) — that is the key sequencing fact (the
payoff completes a *playable shipped* scenario, vs. federalism being a new one).
Almost all land as additive optional fields; the war/Reconstruction status models
are the genuinely new shapes.

| Delta (forum) | Lands on | Field (designed) | Widening? · Notes / migration |
|---|---|---|---|
| **Per-era point BANKING + ~12-step era-boot pipeline** (#68, §2.5) | `GameState` | `eraPointBanks?: Record<Era, …>` + per-era running `Faction.score` zeroed at the boundary | **REFINES K3/K4 — not a new item.** Points do **not** carry linearly; the era's score is **banked** at the boundary and the running total zeroes, with the per-era banks summing toward the (open) cross-era win total. The `advanceEra` keystone gains a bank-and-zero step + an end-of-era award payout + a full 2.1.x→2.3.1 re-run + content-pool swap. Resolves the long-open "does the point-reset fire at a boundary?" question. See §6.7.2 + K3/K4. |
| **Civil-War two-theater combat engine + tiered war** (#56, §23.3) | `War` entity + `GameState.wars` (array exists) | extend `War` with `theaters[]` (East/West), `navalWins` gate, per-theater `warScore`, `tier: 'major'\|'minor'\|'operation'`, multiplier | **STRUCTURAL (war model) but the `War` array already persists.** The **Major-tier** instance of divergence #6's generic war: two theaters (3 naval wins gate land), additive per-battle `success%`, per-theater WarScore (+10 auto-wins), named-battle officer casualties on the military track, and a **permanent president +1-all-elections** on Union victory. **Enhances shipped 1856** (no Civil War today; spine ends at Trent Affair 1861). Fold the shipped flat resolver + 1772 Rev-War loop in as configured instances. |
| **Reconstruction readmission status + time-boxed bias** (#57, §23.4) | `State` (`types.ts:1318`) + `Legislation` | `reconstruction?: 'occupied'\|'military-gov'\|'readmitted'` + `biasModifiers?: { delta; untilYear }[]` | **STRUCTURAL-ish (status enum) + additive.** Per-state readmission **bill** gates Gov/Rep/Senate election unlock; the Ironclad-Oath plan grants a **time-boxed `+2 toward incumbent until <year>`** modifier (distinct from permanent `State.bias`); strip-leaders/pardon bills remove-or-return named pols (prune broken Kingmaker pairs). Pairs with #21 (state policies) + #58. |
| **Secession + Southern-Unionist / Secessionist gating** (#58, §23.1) | `Politician` (`types.ts:1251`) | `allegiance?: 'union'\|'secessionist'` + a "Secessionists" inactive bucket; reads `Southern Unionist`/`Nationalist` traits + `state` region | **Additive.** A scripted secession event chain (here triggered by a *blundered* presidential decision) moves pols of seceded/border states inactive **unless** they hold `Southern Unionist`. The draft dataset already needs the trait on Southern pols. No-relocate-INTO-rebel-state rule; CSA officeholder seeding. `repair()` backfill `'union'`. |
| **Free/Slave sectional-balance crisis** (#59, §23.2) | derived per turn from `State` membership in `SLAVE_STATES_1856` (`types.ts:1152`, exists) | no new field — compute `freeStateCount`/`slaveStateCount` at half-term close | **WIDENING (engine, not shape).** The defining Nationalism crisis: while free > slave and era is `nationalism`, a fixed score/meter/election penalty package fires (Speaker/Pro-Tem −250, Moderates −250, DomStab −2, Party-Pref +2 Red, RW-Activists +2 next election). **Retired on emancipation** (13th-Amendment beat). The `SLAVE_STATES_1856` set already exists — only the scoring is unwired. |
| **Canada conquest → era-gated statehood + Canadian draft + penalties** (#60, §23.5) | `State` (roster exists in `expansionStates.ts`, region `'Canada'`, 11 provinces) + statehood pipeline (#43) | per-(state, era) admission gate + a region-keyed bonus draft pool + Canada-region election penalties | **WIDENING + content.** The province **roster already exists** (`expansionStates.ts`); missing are the **era-gated admission rules** (1856: Quebec→statehood directly, Ontario must be a territory, NL/NM/Utah locked until Gilded), a **bonus Canadian draft pool** (~70 historical pols) on annexation, native-born relaxation once a region is fully annexed, and Canada-region candidate/cabinet election penalties. Rides the bill-driven statehood path (#43). |
| **Succession / eligibility / 0-Command acting president** (#61, §24.1) | `GameState` + `Politician` | `successionOrder?: OfficeType[]` (bill-mutable) + `Politician.bornForeign?: boolean` + an `actingPresident?` state | **STRUCTURAL-ish + additive.** A **configurable line of succession** (legislatable order); **native-born vs foreign-born** eligibility gating the presidency (relaxable per #60); an **acting-president state whose `command` (often 0) gates exec actions / SCOTUS-compel / re-election eligibility**. `vicePresidentId` exists (`types.ts:1568`) but no eligibility gate, no configurable line, no acting state. Era-gate the VP-vacancy-fill on the amendment. |
| **Contingent House election + tied-chamber inverse control** (#62, §24.2) | engine + `GameState` | a contingent-election path (1-vote-per-state by House-delegation majority, Governor-party tiebreak; Senate elects VP) + a config `contingentTopN: 2\|3` | **WIDENING (engine).** Today the EC tally always resolves to a winner. On no EC majority, run the contingent path; build must **pick a stated cutoff** (DH-6: top-2 house rule vs. top-3 12th-Amendment) + the **tied-chamber inverse-control** rule (a tied chamber is controlled by whoever does NOT control the other). An election-system addition; slots into the same EC tally code as #5. |
| **Offices created in-game by law (institutional layer)** (#66, §24.6) | `GameState.cabinet` (seat map) + a new `createdOffices?` | model offices as **data created/destroyed by bills + exec actions**, not a fixed `cabinetSeatsForYear` | **STRUCTURAL (generalizes the seat list).** Fed Chair (6-yr; creating the Fed **deactivates the Independent Treasury**), Chief of Staff (+1 exec action), CNO (replaces Sr Admiral; +1 Command), FBI Director (10-yr, off the 5-retention cap), Commerce/Labor split. `cabinetSeatsForYear` (`types.ts:1196`) is year-keyed and fixed today. Ties to ActionRegistry K2 + the cabinet-retention refactor (#25/#49). |
| **Amendment ratification by 3/4 governors — era-keyed + in-game-tunable** (#64, §24.4) | `GameState.amendments` (same field as #39) | the **ratifier + threshold are an era-keyed, bill-changeable field** | **Folds into the amendments item (#39).** 1856: 2/3 of both chambers then **3/4 of state GOVERNORS**; the threshold is itself tunable by a passed amendment (options table → faction-enthusiasm side effects); Gilded default drops to 2/3 of states. Plus a SCOTUS-ruling effect that **gates a bill category until an amendment passes** (*Pollock* → no income-tax bill until ratification) — couples to the SCOTUS docket (#52). |
| **"3 traits + 3 alt-states" draft re-rule** (#69, §24.8) | draft config (era-dependent) | a tunable `{ traits, altStates }` rookie-grant pair, **era-keyed** | **WIDENING (config).** The 1868 re-rule set rookies to **3 traits + 3 alt-state adds** (down from 5/5). Goes in the era-config table (§6.1 pattern). The alt-state add is the `Politician.homeStates?` (#55) field. Open: is 3/3 canonical going forward. Confirms reverse-PV draft order + pick-position bonuses. |
| **Investigation 5d6 special committee** (#65 → fills #54, §24.5) | `Legislation` (`Bill.type`) + a special-committee form | an investigation-bill type → Speaker-formed Chair+Ranking+3 → **5d6 + 4 modifiers**, 21–25 = guilty | **WIDENING (engine).** #54 was a design hole (rules blank); **`hd` AUTHORED the spec** — so #54 is now **READY to build** (no design task remaining). Targets the dominant party; on guilt resign + cabinet ban + trait/meter ripples. Extends the legislative micro-mechanics; needs `Bill.type` (#42). |

**Batch 5 (`drums`, all-CPU):** the all-CPU run yielded **no new game-state
shapes** — almost all of §25 lives in a NEW subsystem (the `CpuController`, K5)
that consumes the existing snapshot. The few additive fields are flagged below;
the rest is **engine code over read-only state**.

| Delta (forum) | Lands on | Field (designed) | Widening? · Notes / migration |
|---|---|---|---|
| **CPU `ConsumerAgent` / handler scaffold (K5, NEW)** (`drums` §25 master, all subsections) | NEW `src/engine/cpu/` directory + a `CpuController` orchestrator + one handler per spec'd subsystem | **No new snapshot field for the scaffold itself.** Each handler is a pure `(snap, factionId, ctx) ⇒ Decision` function with deterministic tie-breaks (uses seeded RNG, K0) | **NET-NEW ENGINE SURFACE — but the *state* it reads is the existing snapshot.** Handlers read: `Politician.traits`/`skills`/`pvCache`/`currentOffice`/`factionId`, `Faction.personality`/`alignment`/`leadershipPolId`, `GameState.enthusiasm`/`partyPreference`/`cabinet`. They write: the same outcome surfaces the existing runners write (e.g. cabinet-pick result, leadership vote tallies, legislation NAY/AYE). **See §6.6.1 below.** Sits after K0 + K2; **each subsystem handler is a lightweight PR** once the scaffold lands. |
| **Reciprocity / promise tracker (DH-20, §25.15 #1)** | NEW `GameState.cpuCommitments?` | `cpuCommitments?: { fromFactionId, toFactionId, promise, payloadKind, owedOnPhaseId, expiresOnYear }[]` | **Additive.** Persistent cross-faction promise ledger consumed by the next vote / nomination pass. `repair()` backfills `[]`. The CpuController's enforcement step reads + drains this. Pairs with the **convention "Presidential Promise" action** (#71) — promises set here are repaid at vote time. |
| **Per-event scandal cooldown (DH-22, §25.15 #3)** | NEW `GameState.recentScandalIds?` | `recentScandalIds?: { templateId, firedYear, blockerCategory }[]` | **Additive.** Prevents the 3-deep cascade Estella→Pershing→Hearst. Each at-most-once scandal stamps a row; the era-event walker (`eraGraph.ts:107`) filters out same-`blockerCategory` templates within N years. `repair()` backfills `[]`. Cheap to implement; benefits every era's era-event scheduling. |
| **Meter-impact aggregator (DH-21, §25.7 / §25.15 #2)** | NEW `src/engine/cpu/meterGuard.ts` — pure compute, no snapshot field | a `scoreOptionAgainstMeters(snap, option) ⇒ {meter, projectedDelta}[]` projector | **Engine-only.** Reads `GameState.meters` + option's declared `meterEffects`, returns a per-meter delta projection that the A/B/C event picker (§25.7) penalizes for **triple-stacks driving an already-bad meter into crisis**. Pairs with the meter-bank work (modern row above). |
| **Iron-Fist office split (§25.9, NEW divergence)** | `Trait` union (`types.ts:36`); migration | **split `'Iron Fist'` into ≥6 office-keyed traits** (e.g. `'Stifle Competition'` for primary block, `'Force Vote'` for chamber compulsion, `'Compel SCOTUS'` for court compulsion, `'Fire Officers'` for mid-war military replacement) | **STRUCTURAL on the type, but `repair()`-migrateable.** The shipped engine reads `'Iron Fist'` at `phaseRunners.ts:2915`, `:2931`, `:2959` (era-event multipliers) and the trait carries 4 governance rows (`types.ts:1043-1047`). A migration block in `repair()` expands `'Iron Fist'` to all child traits (over-broad but safe), then the spec'd readers move to the narrower traits. **Touches:** the 6 grant-callers identified in §25.9 (PL+Honest-Gov-maxed, Sen Maj Leader, President, Loans-from-Wealthy policy, Convention PL, Military mid-war replacement). **Size M.** Independent of keystones — the trait system has shipped. |
| **State `industries` + policies + Honest-Gov-cap awareness for governor CPU (DH-19, §25.15 #4)** | reads existing `State.industries`, `State.policies` (K1) | no new field | **WIDENING (engine).** The governor-action handler must read `state.industries` + `state.policies` + the Honest-Gov-maxed top-of-ladder rules and **prune no-op actions** (Improve Industry at 10/10). Lives in the gov-actions registry consumer (§6.6) once K1 ships `State.policies`. Cheap. |
| **Veto-override threshold = 2/3 both chambers (§25.6 / divergence #11)** | no engine site yet — the threshold needs a constant | a `VETO_OVERRIDE_THRESHOLD = 2/3` constant when veto is built | **VERIFY:** grep confirms **no veto/override/cloture/filibuster code exists in the engine today** (grep hits only doc strings + a comment at `phases.ts:164` + an unrelated `override` in `types.ts:506`). So the "60% bug, reverted" finding from `drums` is **forward-only** — when veto override is built, hardcode 2/3 both chambers. **No fix needed today.** |
| **Midterm uses presidential meter+enthusiasm rules (§25.6 / divergence #12)** | engine — the midterm path through `calcStateVote` | use `presGeneral`-equivalent term assembly for Senate / House mid-cycle contexts | **VERIFY-vs-build / WIDENING (engine, no shape).** `calcStateVote` (`phaseRunners.ts:3685`) is already a generic resolver keyed on `ElectionContext`; whether the *callers* (mid-cycle Senate/House runners) pass the full meter+enthusiasm assembly is what needs verification. Likely a small change in the caller paths, not in `calcStateVote` itself. |
| **Justice 10-yr drift table (§25.14 / #79)** | `Politician` ideology + a per-Justice `lastDriftYear?` | the 25/10/5/Puritan-block roll, scheduled every 10 yrs on the Court | **WIDENING.** Rides the SCOTUS docket epic (E-modern); not standalone. The 25/10/5 mid/left/right percentages are canonical now. |
| **±3 swing cap on per-phase ideology + cabinet swings (§25.5.4 / #80)** | engine — clamp helper around enthusiasm + cabinet net-swing writes | a `MAX_PHASE_SWING = 3` constant + per-write clamp | **WIDENING (engine, no shape).** Confirms the meter-model ±3 clamp already on the roadmap (divergence "(meter)"). Apply the cabinet-net-swing clamp at the same chokepoint as the meter clamp. **XS.** |
| **High-Tech industry via era event (§3.4 / #81)** | `State.industries` (exists) + a new era-event template | era-event content row + a "Improve High Tech" gov action | **Content + 1 action row.** Pure content; rides the era-event registry. |
| **5%/half-term retire-death rate (#85)** | `MORTALITY_RULES` per-era table (`types.ts:485`) | refine the rule's percentage for senators + cabinet | **Refines existing rules const.** A balance dial — not a shape change. |
| **Faction-rename "Conservative Party" 3-condition trigger (§25.13 / #40)** | engine — a `renameTriggers` registry that watches `(noRepublicanParty, redLeaderProtectionist, blueWon3InARow)` | NEW `src/data/factionRenameTriggers.ts` (predicate → name-generator pairs) + a per-era authored names table | **Data-driven content registry pattern** (§6.7.1). Reads the existing `Faction`/`Party` state + the election history. **Per-era authored names pool** replaces the GM-admitted "kinda stupid/silly" default. |

**Batch 6 (`pop`, 2012 fresh-modern boot):** the boot model is the headline.
Most of the rows below are **additive optional fields** on `GameState`; the
APOCALYPSE endgame and the dynamic cabinet seat list are the structurally-new
shapes.

| Delta (forum) | Lands on | Field (designed) | Widening? · Notes / migration |
|---|---|---|---|
| **APOCALYPSE meter-driven endgame clock** (#88 / divergence #14, NEW endgame model) | `GameState` (NEW field) | `endgameClocks?: { meter: MeterKey; threshold: number; remainingYears: number; startedYear: number }[]` | **STRUCTURAL net-new — the engine has only event-driven endgame today.** Verified: `EraEvent.triggersGameEnd` (`types.ts:1476`) is consumed at `phaseRunners.ts:2871` setting `game.gameEnded`. No meter-watcher, no clock, no countdown anywhere. Sink (`game.gameEnded`) is shared — both paths must close cleanly. Per-meter band-monitor in Lingering (2.5.1) arms/disarms/decrements; engine termination path fires when `remainingYears` hits 0. `repair()` backfills `[]`. **Phase placement: Phase 1** (meter is `planet`, ships today; model is meter-agnostic; one configured row per era). **Size M.** |
| **Dynamic cabinet seat list — `cabinetSeatsForYear` becomes BOOT SEED only** (#89 / divergence #15) | `GameState` + `Legislation` | `cabinetSeats?: SeatSpec[]` (mutable, persisted) + `Legislation.createsCabinetSeat?: SeatSpec` | **STRUCTURAL refactor — verified `cabinetSeatsForYear` (`types.ts:1196`) is pure derived, NO mutable state today.** `phaseRunners.ts:2162` reads it each turn. Refactor: shipped function becomes the boot-seed; runners read `game.cabinetSeats`; bill-sign handler appends `createsCabinetSeat` payload. Folds into **E16 cabinet retention** (same code area; M-ish marginal cost). Pairs with #66 Progressive institutional layer. |
| **Amendments toggle CAPABILITIES** (#91 / divergence #16) | `GameAction<Ctx>` (the K2 keystone shape itself) | `requires?: AmendmentPredicate` field on every action-library entry; library filter consults `game.amendments.passed` at evaluation | **STRUCTURAL — folds into K2 design.** Verified: no `ActionRegistry`, no `GameAction`, no `AmendmentPredicate`, no `requires:` in the engine today. **K2 must include this from day one** — one extra field on the registry shape, one filter step in the picker. Cheap if folded in; expensive if retrofit across 6 libraries. The canonical instance ("Send VP to Shore Up Support" requires 12th Amendment) ships with the general-election library. |
| **Scenario-boot model + `BootSheet` schema** (#86, divergence #17 keys it) | NEW data layer + K4 registry | `BootSheet<{era, startYear, factions, sittingGovernment, stateRoster, …}>`; per-`{era, startYear}` indexed, NOT per-era alone | **CROSS-CUTTING K4 BUILD CONSTRAINT.** Three documented mid-government boots (1788 designed / 1856 shipped / 2012 designed) share ONE shape: pre-built faction roster (5 Blue + 5 Red), per-faction archetype politicians + era-tuned decks, sitting government pre-loaded, EXPLICITLY EMPTY at boot (no faction leaders, no career-track pols, no inherited PV/legacy/Kingmaker pairs). **Build the schema ONCE in K4**, instantiate per era. Era identity is **data configuration**, not a code path. **K4's spec is updated below** to name this explicitly. |
| **State roster keyed to BOOT YEAR, not era enum** (divergence #17) | K4 registry + `expansionStates.ts` | `{era, startYear} → State[]` keyed registry; annexation chain mutates `snap.states` at fire time | **Refines K4.** Verified: `states1772.ts`/`states1856.ts` are the only rosters; `expansionStates.ts` is the admittable pool. The 2012 fresh-modern boot needs **50 + DC**; the 53-state alt roster (Wyoming Rule) is the product of 60 yrs of `modern` annexation chain — **BOTH must exist for `modern` era enum.** Folds into K4 + E28 (53-state roster) + E30 (modern scenario boot). |
| **Era-coded double-points issues** (#87) | NEW per-era table | `era.doubleScoringIssues?: IssueTag[]`; doubles ±50/100/150 magnitudes during the era's half-terms | **WIDENING (content + 1 multiplier hook).** A `{era → IssueTag[]}` tunable lookup applied at the per-card-hit stage of bill scoring (§12.8). Per-era authored. Climate Crisis + Immigration are the Populism era's documented pair. Couples to **DH-28 tag-completeness validator** at dataset build. |
| **Era-coded procedural pol generation start year** (#90, sharpens scaling-wall a) | NEW per-era config + the procedural generator (Phase-1 #8) | `era.proceduralPolGen?: { startYear: number; perStatePerCycle: number }`; dataset-exhaustion fallback is the OTHER trigger | **Sharpens scaling wall (a).** Rule 3.0.18 says the **2020 draft** is when Populism-era CPU-generated rookies start appearing (1 new pol per state per cycle). The generator (Phase-1 #8) needs BOTH gates: per-era year-trigger AND dataset-exhaustion fallback (whichever fires first). Same generator code path. |
| **Conditional-vote-rules primitive** (`pop` POST 1111, sharpens §25.9) | `Faction` or `Politician.factionLeader` | `factionLeader.compelledVoteRule?: Predicate → Vote`; promotes a `Predicate` extension | **CPU-handler primitive — folds into the Iron-Fist split (E17) + CPU handler #2.** Iron-Fist controllers publish **declarative predicate → {AYE/NAY}** policies (e.g. "NAY on any nominee with Admin<3"). Subsumes BOTH per-vote Iron-Fist compulsion AND the §25.5.2 auto-AYE-own-picks cabinet rule under one primitive. Handler #2 (legislation NAY/AYE/NAY) consults this BEFORE the §25.6 heuristic. Same primitive used by handler #4 (cabinet) when a controller exists. |
| **Boot-data quality validators (DH-24, DH-27)** | NEW scenario-boot validators | `validateSenateClasses(snap)` + `validateTraitConflicts(snap, dataset)` | **XS each, run at scenario-boot.** DH-24: a fresh modern boot's seed data can have stale Senate-class assignments (Ron Johnson up in 2010 not 2012 in the `pop` boot). DH-27: `TRAIT_CONFLICTS` (`types.ts:658`) is run only on trait-ADD events, not at dataset/boot import — boot data can ship a pol with both `Integrity` AND `Controversial`. Both validators run at the boot pipeline + at `loadStandardDraftClasses` (`standardDraftClasses.ts:13`). |

**Batch 7 (`rep1800`, 1800→1868 early-republic):** the 1800–1856 gap-fill. The
**era-model reframe** is a refinement of the K3/K4 keystone specs (not a row); the
rows below are the early-republic subsystems. **The two grounding corrections vs.
the ingest brief are flagged in-row** — `State.isSlaveState` and `senatePre17`
already exist, which *shrinks* two of these.

| Delta (forum) | Lands on | Field (designed) | Widening? · Notes / migration |
|---|---|---|---|
| **★ Era-model reframe — content-bands gated by game-state + territory** (#92 / §27.1) | `GameState` + K3 `advanceEra` + the era-content registry (K4) | `game.eraBand` content-band marker (or reuse `currentEra`) + condition-driven `advanceEra` triggers + a **territory-ownership gate** on every bill/era-event/draftee | **REFINES K3/K4 — NOT a new field/keystone.** Verified: phases gate by `year % 4`/`year % 2` (`phases.ts:49-59`, correct for cadence, keep it); the only era advance is the hard-coded `currentEra = 'federalism'` at `constitutionalConvention.ts:198`; **no year→era derivation exists**. The reframe makes `advanceEra` condition-driven (game-state/meter/territory, per half-term) and gates content on **territory held**, not calendar year. Reconciles #68 point-banking + §26 boot model + this finding. See §9.1.5 + the updated K3/K4 rows. |
| **12th-Amendment election-mode toggle — legislature-chosen electors** (#93 / §27.3) | `State` (`types.ts:1318`) + `GameState` | per-state `electorsByLegislature?: boolean` + a global `conventionsEnabled?: boolean` (pre-12A `false`) | **STRUCTURAL-ish + additive; links #44 per-state EC (divergence #5).** Mirrors the shipped `senatePre17` `ElectionContext` (`types.ts:701`) **in spirit** — BUT note the correction: `senatePre17` today is **NOT a legislature-majority tally**, it's the same `calcStateVote` PV+dice formula with a different `ctx` tag (`phaseRunners.ts:3896`). So `electorsByLegislature` needs a **genuinely new resolution branch** — award EV by **seated Gov/Senate/Rep party majority (Gov breaks ties)**, recomputed *after* the popular tally — which no shipped path does. The pre-12A gate also **disables conventions** (§15.3) + the separate-VP rules until the "Party-Ticket Amendment" ratifies; a "Nationwide Surge" event flips all-but-SC to popular vote. `repair()` backfills `false`/`true`. |
| **Slavery-as-state-flag + Cohens-v-Virginia amendment-only abolition** (#94 / §27.4) | `State` (`types.ts:1318`, **flag EXISTS**) + a persistent SCOTUS rule-modifier | bind existing `State.isSlaveState` to the **Plantation industry**; abolition toggles it **off in all states**; a persistent **`Cohens` rule-modifier** that disallows *legislative* abolition where the flag is set | **★ SMALLER than the brief assumed — `State.isSlaveState: boolean` ALREADY EXISTS (`types.ts:1329`)**, is populated in `states1856.ts` (per-state), AND is already set by the statehood path (`phaseRunners.ts:3175`). The brief's "SLAVE_STATES_1856 is a Set, not a per-state flag" is **half-wrong**: the Set (`types.ts:1152`) is a *secondary* read used at `:2942`/§23.2, but the mutable per-state flag is there. **What's NET-NEW** is (1) the abolition-toggle-off mechanic + Plantation-industry binding (Plantation→Agriculture 2:1, §23.4), (2) the **`Cohens v. Virginia` ahistorical SCOTUS rule-modifier** (state-supremacy → slavery only endable by Amendment or per-state Gov action; all new states enter free), and (3) the AMPU-2 need to **reverse an ahistorical ruling** via amendment (no such mechanism today). Couples to §23.2 sectional scoring + #58 secession. |
| **Statehood-by-bill + unorganized-territory gating** (#95 / §27.5) | `Legislation` + `admitState` (`territories.ts:8`) + a new `Territory.organized` stage | bill route → `admitState`; `organized: boolean` (the **organize → admit** two-step); a **draftability/relocatability gate** excluding un-owned/unorganized-territory pols; Class-I/II/III senator-rotation assignment on admission; sabotaged-vote → +1-bias seed | **WIDENING + content; refines #43.** `admitState` (`territories.ts:8`) exists, is idempotent, and is invoked only from 1772 era-event `postEffects` today — the bill-driven path + the **two-step organize→admit gating** are net-new. The **draft-pool must filter out unorganized-territory pols** (a dataset/territory-gating fix — DH-class, §19 hole 5). Some admissions skip the territory stage (ME/WV/TX-from-Republic/VT/CA + the 13 originals). Rides the bill-typing path (#42). |
| **Second Bank recharter clock + Bank War exec action** (#95 / §27.6) | `GameState` (NEW) + `GameState.cabinetSeats` (the #89 dynamic seat list) + the exec-action library (K2) | `game.secondBank?: { charteredUntilYear }`; creating it **adds the President-of-US-Bank cabinet seat** + marks it **unremovable while the Bank exists**; a **"Remove Deposits"** exec-action that kills it; lapse on clock expiry | **NEW stateful economic subsystem.** A Crisis Bill creates the Bank (Democracy band's defining institution) with a **20-year recharter clock**; the **President-of-US-Bank office is unremovable while the Bank exists** (a same-faction / firing-precedent-adjacent guard — cf. §21.4's US-Bank-President same-faction note). The "Bank War" = the **"Weaken US Bank by Removing Deposits → State Banks"** exec-action; clock + exec-action together killed the Bank in `rep1800`. **Ties to the offices-by-law layer (#66) + the dynamic cabinet seat list (#89) + ActionRegistry (K2).** |
| **Amendments mutate CORE RULES mid-game (the "Sexenio")** (§27.8) | `GameState.amendments` (same field as #39) | amendment effects bind to **core parameters** (term length 4↔6, one-term-limit, suffrage, ratifier threshold), undoable by later amendments | **WIDENING of the amendments item (#39/#64).** Sharpens #39: three 1834 amendments produced a **6-year single-term Presidency** (with 25th-style "elevated-past-halfway-can't-run" succession), later undone. Confirms the **ratifier+threshold is itself amendment-tunable** (#64, 3/4→2/3 of Govs). **No grandfather clause modeled** (GM: "my rules") — a design hole (contrast `modern`'s grandfather clause). Folds into the amendments epic. |
| **20-state Call-for-Constitutional-Convention crisis** (#96 / §27 — content) | `GameState` (NEW) + era-event content | a `game.conConCall?` counter (states calling) + the convention-trigger event | **Content + a counter.** A sectional-pressure crisis subsystem (the early-republic analogue of a "call for a convention"). Pure content + one small counter; rides the era-event registry + the amendments machinery. Low priority. |
| **Civil-War VARIANTS** (#97 / §23 extension) | the generic-war `War` model + the secession chain (#58) | DomStab=1 early-trigger; **President-defects-to-CSA**; Hartford / Northern-secession variants; **UK-intervention 3rd theater**; guerrilla 4th stage; internal CSA government | **WIDENING of the war + secession epics (#56/#58).** `rep1800`'s alt-Civil-War fired ~1846 off DomStab=1 (a *different* trigger than `hd`'s blundered-John-Brown), the sitting President defected to lead the CSA, UK intervened as a 3rd theater, and a guerrilla 4th stage ran. Reinforces that secession (#58) has **multiple triggers** and the war engine (#56) needs the variant set. Folds into E3b. |
| **Coup-at-low-meters + enumerated meters-driven game-over set** (#98 / §27 — content) | `GameState.endgameClocks` (the #88 field) + meter-watcher | additional `endgameClockRules` rows (per-meter band → coup/game-over) | **WIDENING of the APOCALYPSE clock (#88 / divergence #14).** Corroborates that the meter-driven endgame is **meter-agnostic** with a per-era table of rows — this campaign documents a *coup / multiple meters-driven game-over* set distinct from Populism's Planet-Health clock. **Same field, more configured rows.** Reinforces the Phase-1 placement of the meter-clock. |
| **Ideology-as-CIRCLE** (#99 / §27.7) | `IDEOLOGY_ORDER` consumers (10+ sites) + a new central helper + a `GameState` flag | a central `ideologyDistance(a, b, circular)` helper reading `min(\|a−b\|, 7−\|a−b\|)` when `game.ideologyIsCircular?` is set | **FOUNDATIONAL (cross-cutting), era-gated by a flag. Size M.** Verified: `IDEOLOGY_ORDER` (`types.ts:14`) is LINEAR; distance is open-coded as `Math.abs(IDEOLOGY_ORDER.indexOf(…) - …)` at 10+ sites (`factionCenter` `phaseRunners.ts:715`, `stepToward` `:740`, conversion adjacency `:993-1003`, sponsor distance `:3548`, the private `ideologyDistance` in `firstContinentalCongress.ts:120`, + 3 UI pages). **No central helper today** ⇒ introduce one, migrate the sites, gate the wrap on the flag. Day-1 behavior unchanged (flag off). See §9.1.7. **Batch 9 (`nuke`) two-thread-confirms it (POST 9842, independent of `rep1800`).** |

**Batch 9 (`nuke`, the 1948→~2005 Cold-War/modern half):** the **largest corpus in the
KB** (12,228 posts) and the fullest capture of the MODERN systems — but for the
*architecture* it is **mostly CONFIDENCE + NEGATIVE-SCOPE**, not new shapes. Almost
every modern subsystem it documents is already mapped in the batch-3 (`modern`) +
batch-6 (`pop`) rows above; §28 of `game-mechanics.md` cross-links rather than
re-documents. The genuinely-new architectural content is the **two-level era model
refinement**, the **negative-scope Cold-War finding**, the **create-AND-abolish
cabinet**, and the **CPU-AI-is-load-bearing** design-intent statement. The rows:

| Delta (forum) | Lands on | Field (designed) | Widening? · Notes / migration |
|---|---|---|---|
| **★ Two-level era model** (#106-class / §27.1 / §28.9) | K3 `advanceEra` + K4 era-content registry (no new top-level field) | (a) point-banked **Historical Eras** `{bills, eraEvents, draftees, biasTable, advanceWhen}` + **rule-deltas** (the Era-of-Terror cabinet rework); (b) **within-era decade/census boundaries** = a SEPARATE schedule-fired mechanic | **REFINES K3/K4 — NOT a new keystone.** Confirmed across 1772/1800/**1948** now. Level (a) is the §27.1/#92 content-band; level (b) is a per-decade `AMPU Census` doing **bulk EV reallocation + state-bias re-lean + content rotation** (§28.9) — *distinct* from the per-era bias swap (#68 step 6). **Do NOT collapse the two.** See §9.1.5 + the updated K3/K4 rows. |
| **★ Structured era-event `evDelta`/census fields** (DH-48 / §28.9) | `EraEvent` content shape (`types.ts:1466`) | a **structured `evDelta`/census field** on era-event rows (NOT free-text flavor) + per-era completeness so a 10-yr census reallocation always fires | **STRUCTURAL-ish on the content shape (additive).** The Neocon-era census/EV-delta event block was **LOST** in the spreadsheet (events stored alphabetically-by-era; EV-change events lacked "EV" in flavor text → unsearchable, then mis-moved). The fix is a typed field, validated at dataset build. Pairs with the census mechanic + the existing `pendingEvDeltas` queue (batch 1). |
| **★ Cold War = NO new subsystem (NEGATIVE SCOPE)** (#106 / §28.2) | the generic war engine (#6) + EraEvent content + diplomacy (#107) | **no new field, no new code path** — Cold-War "content" is data (events / bills / lobby-cards / a couple of legislative ×2 multipliers) | **NEGATIVE SCOPE.** Verified shipped: only `src/engine/revolutionaryWar.ts` exists — there is NO generic war engine and NO Cold-War engine; the post-Rev-War resolver is the flat one-roll path at `phaseRunners.ts:3593-3627`. The "Nuclear Age" has NO nuclear/MAD/NATO/space-race/military-branch mechanics in the design. **Do NOT scope them.** The real build items underneath are the **generic war engine** (#6) + the **diplomacy subsystem** (#107). |
| **Diplomacy subsystem (the real modern foreign system)** (#107 / §28.3) | `GameState.diplomacy` (`Record<string,number>`, `types.ts:1574`, exists) + the diplomacy action library (K2) | **8 per-nation relation meters** (9-point Hostile→Allies) + **ambassador actions** (Increase Relations / Trade / Credit-Loan / Provoke) on a 2.7.1 phase (Sec State suggests, Pres approves, one/ambassador/phase) | **WIDENING.** The shape is right (`diplomacy` is already a string-keyed number map); the **per-era 8-nation seed list** + the **action library** are the work. This is the same diplomacy-library row already in §9.2 — `nuke` makes its 1948 action set canonical. Needs **downward pressure** on the meters (DH-46) + a Cold-War ≤Neutral cap on USSR/China. |
| **Mutable cabinet — offices created AND ABOLISHED by law** (#112 / §28.5; divergence #15) | `GameState.cabinetSeats?` (the #89 dynamic seat list) + `Legislation` | extend the dynamic-seat-list refactor with a **remove-seat** path: `Legislation.abolishesCabinetSeat?: SeatSpec` alongside `createsCabinetSeat?` | **STRUCTURAL — extends E16 / divergence #15.** `cabinetSeatsForYear` (`types.ts:1196`, **verified still year-keyed**) must become fully data-driven. Confirmed END-TO-END now: founding (Bank/Navy/AG by bill) → modern (DOE/DHS created; **Postmaster General ABOLISHED** by the postal-independence bill; HEW split into HHS+Education). **Add the ABOLISH path** (the batch-6 spec only added create). |
| **Legislated, variable SCOTUS size + excess-not-replaced** (#112 / §28.5) | `GameState.supremeCourtIds` (exists) + `courtTargetSize?` (the #52 docket field) | a legislated court-size field; **excess justices are NOT replaced** until the bench drops below the legislated cap | **WIDENING — folds into the SCOTUS docket (#52 / E25).** Laws seen: "Set SC to 10/5", court-packing (appoint when one turns 70). Court legislated DOWN to 5 while physically holding 9-10. Rides the bill-typing path (#42) + the docket epic. |
| **Institutional layer — impeachment / resignation / unelected succession / VP-vacancy** (#112 / §28.5) | `GameState` (succession state) + `Legislation` (amendments) | impeachment trigger + an unelected-succession path + a bill-mutable VP-vacancy-fill amendment | **Classify into the existing succession (#61) + legislation epics — but DH-54: impeachment was NEVER in the rules doc** (ad-hoc both here and `rep1800`/`hd`). **Author the rule before building** (parking lot, DH-33/DH-54). The 25th-Amendment VP-fill is "made up as we go." Pairs with #61 succession + #105 stat-collapse-resignation. |
| **39-state amendment ratification (52-state union)** (#112 / §28.5) | `GameState.amendments` (same field as #39) | the **ratifier+threshold are era-keyed** (already #64): modern = 2/3 both chambers (70 in the larger Senate) then **39 of 52 governors** | **Folds into the amendments item (#39/#64).** Just the modern instance of the already-era-keyed ratifier/threshold field. No new shape. |
| **Iron-Fist "force-vote" (modern instance)** (#112 / §28.5) | the Iron-Fist trait split (E17) | a **force-a-vote** power (controls all ally initial votes if also Legis-5) distinct from **compel-a-vote** | **Folds into E17 Iron-Fist split.** One more office-keyed child power. Confirms the §25.9 overload across a 4th-era. |
| **★ CPU-faction AI is LOAD-BEARING** (#114 / §28.12) | the K5 CpuController + handler suite (no new shape) | — (design-intent statement, not a field) | **VALIDATES K5 + solo-first sequencing + ELEVATES the handler suite to first-class.** Designer's strongest corpus statement: the **APP = 1-human-vs-9-CPU** (multiplayer "goes off the rails"; the points system is for CPUs, not humans — low points = better draft order so humans can tank). The forum game is team-MP with CPU backfill; **the app is a solo adaptation of a multiplayer game.** ⇒ the entire multiplayer apparatus (party-leader elections, conversions, kingmaker pairings, committee assignment, cross-faction endorsements, forced 3rd-party runs) must be **CPU-AI-driven** in the build. This is the difference between a playable solo game and not. See §9.1.3 — K5 + handlers move from "force-multiplier" toward "the load-bearing system that makes the product playable solo." |
| **Population model + House cap (Wyoming Rule)** (DH-49 / §28.13) | NEW (a population model + a House-size cap) | a per-state population model + a House cap that the decennial recompute reads | **AUTHOR-BEFORE-BUILD / PARKING LOT (or sized into the census work).** The per-decade census EV reallocation + the Wyoming Rule are **unimplementable without a real population model + House cap** (today there is none — `State.electoralVotes` is a static seed). Add to the parking lot; it sizes into the census/apportionment epic (#34/#55) IF a population model is authored. |
| **Realignment is GRADUAL (4 levers, not a scripted flip)** (#108 / §28.4) | existing mechanics (draft scarcity + conversion + party-pref + census) — no new shape | — (a tuning property, not a field) | **WIDENING/tuning.** The BLUE/RED meaning flipping mid-game is an **emergent property of four already-planned tuned mechanics** (era-locked draft scarcity #90/§28.11, enthusiasm-max one-directional auto-flips, a pinned party-pref gradient, the per-decade census). No bespoke "realignment system" — it falls out of the era-content + conversion + census work. |
| **Era CONTENT fires on its own scripted clock** (#109 / §27.1) | the era-event walker (`eraGraph.ts`) | — (a scheduling property, not a field) | **CLARIFIES the era model — distinct from era BANDS.** Three separate gates: era **bands** gate on game-state/year (level a); the **census** fires on its 10-yr schedule (level b); era **CONTENT** (events / SCOTUS docket) fires on a **scripted schedule decoupled from in-game history** (a Taft player who ends Jim Crow early still can't pre-empt the Civil-Rights content — the GM house-rules a ~5%/phase trigger). **Build implication: bands gate on game-state; content fires on its own clock.** Reinforces the §6.4 scheduling work. |

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

**Batch 11 (`arkzag`, the 1820→1840 FULL-ARC continuation):** batch 10 stalled at
~1822; this is the SAME save run to the 1840 conventions, so it is the **first
capture of the late-game systems** — multi-cycle presidential elections, the Bank
War → Independent-Treasury arc, the amendment lifecycle, a presidential
assassination→succession beat, and the canonical enthusiasm-reshuffle rule. The
three new content systems land as **additive optional `GameState` fields**; both
new bugs are **floor/gate fixes at existing chokepoints**. **Verified SHIPPED-state
of every row below: NONE of these fields exist in `types.ts` today** (grep-confirmed
— `GameState` has `nationalDebt` and `meters.economic` and `isSlaveState`, but NO
`amendments`, `secondBank`/`economy`, `actingPresident`/`successionOrder`, and
`Legislation` has NO `type`/`replaces`/`lockedUntilYear`).

| Delta (forum) | Lands on | Field (designed) | Widening? · Notes / migration |
|---|---|---|---|
| **#116 — Bank-War → Independent-Treasury economic engine** (§29.7) | `GameState` (NEW) + `Legislation` (NEW fields) + the EconStab meter (`meters.economic`, EXISTS) | `game.economy?: { secondBank?: { charteredUntilYear }, panicActive?: boolean }` + **`Bill.replaces?: string`** (Independent-Treasury bill marks "Replaces Bank of the United States" → removes the Bank institution) + **`Bill.lockedUntilYear?: number`** (per-bill-class change cooldown — the "no tariff change until 1836" cadence) | **NEW stateful content engine over an EXISTING meter.** Verified: NO long-run economic state machine today — `applyEffect` (`phaseRunners.ts:3209`) only nudges the 7 numeric meters, and `Legislation` (`types.ts:1506`) has no `type`/`replaces`/`lockedUntilYear`/`resolvesCrisis`. The EconStab meter IS `meters.economic` (`types.ts:1401`). The arc is a recurring **Bank CRISIS bill ↔ Panic/EconStab CRISIS state ↔ Independent-Treasury `replaces` resolution** with sectional ±100 (Agriculture/Finance) effects. **This is the content STATE MACHINE that drives the §27.6 Second-Bank institution object** (the President-of-US-Bank seat + 20-yr recharter clock + Bank-War "Remove Deposits" exec action) — it does not replace E4b(b), it sits on top of it. `repair()` backfills `{}`. |
| **#119 — constitutional-amendment lifecycle** (§29.8) | `GameState` (the SAME `amendments?` field E5 already specs) + `Legislation` (an amendment-type bill) | `amendments?: { id; lifecycle: 'proposed'\|'inCommittee'\|'onFloor'\|'pendingRatification'\|'active'; passedYear?; blocksLegislationClass?: string; data? }[]` | **EXTENDS E5 — adds a LIFECYCLE state + a legislation-class-block hook.** Verified: NO `amendments` field today (grep-confirmed). E5 already specs `amendments?: { id; passedYear; data? }[]` + governor-ratify (§24.4) + the *Pollock*→income-tax bill-class-gate hook. #119 adds two things E5 doesn't fully carry: (1) an **explicit lifecycle state** (`propose → committee → floor → governor-ratify → active`), and (2) an **active-amendment → blocks-a-whole-legislation-class** effect (excise-tax ban, suffrage class) checked **at proposal time** — the proactive-block face of the *Pollock* gate, applied to *future* bills not just existing ones. Plus the **un-bundleable** flag (amendments can't ride bill-packaging). `repair()` backfills `[]`. |
| **#61 (EXTENDED) — death/assassination → VP succession → acting-president chain** (§29.9) | `GameState` (NEW) + the existing kill path | `actingPresident?: { politicianId; divertChance?: number }` + reuse `vicePresidentId` for the succeed step; the kill TRIGGER already exists | **EXTENDS E10b — the whole CHAIN is net-new; only the leaf (VP-vacancy-fill) is in E10b's scope.** Verified: the kill already happens — `assassination-killed` is a shipped anytime event (`anytimeEvents.ts:232`, `{ kind: 'death' }`, eras `nationalism`/`modern`) — but death just flows through `markPoliticianDead` → **`vacateOffice` sets `presidentId = null`** (`phaseRunners.ts:2449`) with **NO succession**: the VP does not assume the presidency, there is no acting-state, no VP-vacancy fill. So the gap is the **succession ENGINE** (VP-succeeds → must fill VP → acting-president action-DIVERT roll, e.g. Easily Overwhelmed → 50% VP-acts), gated on the §29.8 VP-Vacancy amendment being `active`. E10b currently scopes `successionOrder?`/`bornForeign?`/`actingPresident?` (the 0-Command-inert acting state); #61 here adds the **assassination→succeed→fill→divert wiring** + the trait-acquisition side-effect (overwhelmed successor GAINS Easily Overwhelmed + Pliable). `repair()` backfills `undefined`. |
| **DH-59 — relations meter UNDER-FLOORS below its floor** (§29.11d) | the diplomacy clamp in `applyEffect` (`phaseRunners.ts:3223`) + the Lingering drift clamp (`:3295`) | no new field — fix the clamp floor | **BUG / clamp fix — folds into the diplomacy subsystem (#107 / roadmap E12).** Verified: both diplomacy writes clamp to **`-5..5`** (`applyEffect` `:3223`, Lingering `:3295`). The forum models per-power relations as a **9-point Hostile→Allies scale with a floor of 1** (#107); DH-59 ("Japan: 1→0, should be 1 minimum") is the missing floor enforcement. **There is no fix to ship TODAY** — the build's `diplomacy` is `-5..5`, not `1..9` — so DH-59 is a **build-the-floor-into-the-9-point-scale** requirement that lands WITH the diplomacy subsystem, not a standalone patch. XS once that scale exists. |
| **DH-60 — era-events fire with NO territory/asset prerequisite** (§29.11d) | `EraEvent` content shape (`types.ts:1466`) + the firing path (`buildEraEventsForYear`, `eraEvents1856.ts:4`) | a `requiresTerritory?`/`requires?: Predicate` precondition on the era-event row + a filter step at firing time | **BUG / prerequisite gate — the concrete face of #92 territory-content gating + BUG-1.** Verified: `buildEraEventsForYear(year)` (`eraEvents1856.ts:4`) gates events ONLY by `year >= X && year <= Y`; the `EraEvent` type (`types.ts:1466`) carries NO precondition field at all (only the 2.4.3 graph nodes use `Predicate`, and even those have `stateAdmitted`/`diplomacyAtLeast`, not a generic territory/asset gate). So "Force Open Trade with Japan" fires with no Pacific port; "Stubborn Cherokee" fires without owning the territory. The fix is a per-event prerequisite predicate + a filter — **the SAME firing surface as BUG-1 (the era-lock filter at `phaseRunners.ts:2817`) and K3's `territoryOwned` predicate.** Build it WITH those. S. |

**Batch 12 (`tedchange` + `smallbugs`, the DESIGNER discussion threads — the
official rules-doc patches):** these are NOT playtest deltas — they are
authoritative rule patches from the designer (Ted / vcczar) to the canonical
ruleset, **SUPERSEDING prior GA calls where they conflict**. Most rulings are
*behavioral* (where state already exists or barely-exists) rather than *new
shapes* — the shape impact is small. **Verified SHIPPED-state of every row
below.** Key takeaway: **#124 cabinet enthusiasm rework is the one M-sized
re-architecture** (a teardown of the current lobby→enthusiasm coupling, which
moves cabinet→enthusiasm to ideology-composition and cabinet→lobby to a
points-ledger write); the other rulings bind at known sites.

| Delta (forum / Ted/vcczar) | Lands on | Field (designed) | Widening? · Notes / migration · SHIPPED status |
|---|---|---|---|
| **★★ #124 — Cabinet → enthusiasm REWORK (lobby = POINTS; ideology composition = ENTHUSIASM)** (`tedchange#POST 1-4`; game-mechanics §9.3.7) | `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) + `GameState.enthusiasm` (`Enthusiasm`, `types.ts:1415`, EXISTS) + `Faction.score?` (NEW, same as the batch-1 leaderboard row) | (a) LOBBY satisfaction writes **POINTS** to the existing `Faction.score?` ledger + the Pres-faction's score, NOT enthusiasm; (b) IDEOLOGY-COMPOSITION drives enthusiasm — ≥50% cabinet of an ideology = +enth that ideology; ≤20% = −enth; (c) 3-shifts/half-term cap holds; (d) Big-4 / rest-of-cabinet / cabinet-level **percentages OPEN (designer-gated)** | **STRUCTURAL re-architecture of the lobby→enthusiasm path.** Verified: today's `runPhase_2_3_1_Cabinet` is a one-step scored pick with NO Senate confirmation, NO lobby-driven enthusiasm side-effect at all (the lobby/enthusiasm coupling is documented in `game-mechanics.md` §9.1 but does not yet bind in code — debt #17 + DH-23 cover the missing confirmation system). So #124 lands as a NEW write path: the cabinet picker writes (a) lobby-card → POINTS to matching factions, and (b) cabinet ideology composition → enthusiasm shifts via the standard ±3-cap clamp. **★ LANDS AFTER K2 + K5** (cabinet picks are CPU actions; the rework consumes the conditional-vote-rules primitive `pop` POST 1111). **Re-scope E16 / debt #17** to build the confirmation + #124 enthusiasm rework TOGETHER from day one (do not build the today-shape only to tear it apart). Size: M. Designer-gated percentages: ship a const table that can be re-tuned post-design. |
| **★ #134 — Lingering 7-step strict ordering + tax/tariff decay carry-forward** (`tedchange#POST 397-408`; game-mechanics §11.1.y) | `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260-3377`) + (NEW) per-bill / per-meter carry-forward state | a (NEW) `game.taxTariffDecayQueue?: { decayDelta; appliesAtPhase: 3; lifeYears }[]` carry-forward queue + an explicit 7-step internal ordering on the runner | **RE-SPEC of the meter-decay/volatility surface.** Verified: today's Lingering runs cabinet-drift-driven meter writes + per-trait modulation + national-debt update, but has NO explicit 7-step ordering and NO tax/tariff volatility-vs-decay distinction (it just clamps ±5 per write). Ted's strict 1→7 ordering: never re-do a step; volatility roll at step 7 = THIS-phase-only (not added to running totals); tax/tariff decay propagates forward to NEXT phase's step 3 (decay continues across half-terms). **Folds into E6 / Phase-1 #6 (meter-model generalization + APOCALYPSE)** — same surface (Lingering is where meters get written) + the named-ordinal meter model needs the step-order discipline. Size: M. `repair()` backfills `[]`. |
| **#126 — Pres implementation 2-step Admin-then-Command blunder rule** (`tedchange#POST 159-164`; game-mechanics §14.1.y) | the Pres-implements-bill code (NOT YET A DISCRETE SITE) + `applyEffect` (`phaseRunners.ts:3209`) post-roll | no new field — a roll-table helper + trait gates | **CANONICAL wording of cf82a7d3 §5a #3 — RULE-DEFINITION, not a shape.** Verified: today bill effects apply via `applyEffect` directly with NO Pres roll / NO blunder check. The 2-step rule (Pres Admin roll → if blundered, Pres Command modifies the blunder per 5-tier table; Easily Overwhelmed skips step 2; Incompetent = −3; no Cmd/no expertise = −2 unless Efficient on impl team) lands in **E29 / Phase-2 #29 (modern legislative depth)** where the Pres-implements-bill code lives. Size: S. The rule is now READY (was OPEN/fuzzy as cf82a7d3 §5a #3). |
| **#130 — Death/retirement schedule** (`tedchange#POST 89-100, 137-148, 195-197, 396`; game-mechanics §10.1.y) | `MORTALITY_RULES` (`src/types.ts:485-516`, EXISTS but needs refinement) + `runPhase_2_4_1_Deaths` (`phaseRunners.ts:2341-2444`) + the `Trait` union (needs Hale add) | refine `MORTALITY_RULES.eraConfig` percentages; add `Hale` to `Trait` union + `haleDeathMult = 0.5` to `MORTALITY_RULES`; refactor the death-roll loop to **Frail-first**; gate retirement on **NOT (retired ex-Pres)**; mark cabinet retirement as **end-of-half-term, not on-appointment** | **REFINES existing rules-const + a Trait union widening.** Verified: `MORTALITY_RULES` has the rough shape (`deathBracket` / `retireBracket` / `eraConfig`) but with `frailDeathMult = 1.5` (vs Ted's "Frail rolled FIRST in death roll") — the multiplier is the wrong knob; needs an order-aware loop. `Hale` is NOT in the `Trait` union (`types.ts:36`) today. Auto-retire at 100 is already in 2.10. **Folds into Phase-1 #19 small consistency** (pairs with #85 5%/half-term retire-death). Size: S. |
| **#127 — Ideology shift / conversion rate schedule** (`tedchange#POST 18-31, 34-39, 38, 51-53`; game-mechanics §6.3.y + §6.4.y) | `CONVERSION_ODDS` (`src/types.ts:268-291`, EXISTS — base rates roughly match) + the conversion-target eligibility filter (`phaseRunners.ts:993-1003`) + the (NEW) `ideologyDistance(a,b,circular)` helper + a Two-Faced auto-grant hook | refine `CONVERSION_ODDS.poach.matrix.cross` toward 0.33 effective rate; add **same-OR-adjacent ideology** to same-party conversion targeting; add **LW↔RW Pop 25% special-case shift** with auto-Two-Faced grant | **REFINES existing tables + binds to #99 ideology-circle helper.** Verified: cross-party rate already approximates 33% after willingness amplifiers stack; adjacency rule is a one-site filter change; LW↔RW Pop wrap rides the #99 helper. **Folds into Phase-1 #5b (ideology-circle helper).** Size: S total. |
| **★ #128 — Kingmaker / Master Kingmaker scope** (`tedchange#POST 316`; game-mechanics §6.5.y) | `calcStateVote` (`phaseRunners.ts:3685-3722`) — the per-state score sum + (NEW) `kingmakerBonus(snap, candidate, stateId): number` helper | a +1-in-state (basic Kingmaker) / +1-everywhere (Master Kingmaker) score term added to `calcStateVote`'s score sum | **DESIGNED-not-shipped — pin the +1 binding site.** Verified: the Kingmaker bonus is NOT YET a state-vote bonus; `calcStateVote` does not consult Kingmaker state. **SUPERSEDES Matt's "state OR national, pick one" reading.** Lands in the election-math epic (Phase-1 #20). Size: S. |
| **#129 — Kingmaker → Protégé trait allowlist/blocklist** (`tedchange#POST 201-208, 279-283`; game-mechanics §6.5.y) | the kingmaker-protégé inheritance path (`runDraftKingmakerTopUp` + protégé chaining in `phaseRunners.ts`; KINGMAKER_RULES `types.ts:295`) | a `KINGMAKER_PASSABLE_TRAITS` / `KINGMAKER_BLOCKED_TRAITS` config | **DATA / config refinement.** Pass list: Kingmaker (basic) / Celebrity / Hale / all positives. Block list: Master+National Kingmaker / Frail / Flip-Flopper / Two-Faced. **Folds into Phase-1 #21 (conversion-targeting refactor).** Size: XS as a list. |
| **#133 — 1st / 2nd Continental Congress composition** (`tedchange#POST 211, 217-236, 277, 352-355`; game-mechanics §17.1.y) | `continentalCongress.ts` + `firstContinentalCongress.ts` (existing era system) | a state-size delegate quota table (Big PA/MA/VA/MD=4; Medium=3; Small GA/RI/DE/NH=2) + the 1st-CC (faction-with-most-pols picks) → 2nd-CC (Gov picks) transition on DoI + Articles-of-Confederation gating (no consecutive election; 2/3 of states for legislation; UNANIMOUS for amendments) + PMG via Domestic Committee | **REWRITES the CC composition rules.** Verified: today's firstCC builder uses faction-by-pol-count but NOT the size table; the 1st→2nd CC transition exists in scenario but is not formalized at this level. **Re-scope E17 / §17.1.** Size: S (data table + builder rewrite + AoC gating). |
| **#142 — CPU Chief Justice selection ladder** (`tedchange#POST 387-390`; game-mechanics §22.7.y) | the CJ selection path (NOT YET A DISCRETE SITE) — `runPhase_2_5_3_Court` (`phaseRunners.ts:3397-3415`) is a coin-flip court; CJ replacement happens via the existing `chiefJusticeId` writer | a ladder helper that picks the next CJ: Highest Judicial → own faction → Pres-ideology match → lowest-scoring faction → matching-appointer-ideology → random | **NEW path — folds into the SCOTUS docket epic (Phase-2 #25 / E25).** Verified: no CJ selection logic at all today. Size: XS (ladder is fully spec'd). |
| **#135 — 50/50 House split → leadership to non-Senate-majority party** (`tedchange#POST 65`; game-mechanics §24.2) | `runPhase_2_2_1_CongressLeadership` (`phaseRunners.ts:1864`) | replace `houseMajority = houseBlue >= houseRed ? 'BLUE' : 'RED'` with: `houseMajority = houseBlue === houseRed ? (senateMajority === 'BLUE' ? 'RED' : 'BLUE') : (houseBlue > houseRed ? 'BLUE' : 'RED')` | **XS one-line edit — a real shipped bug** (the silent default-to-BLUE on tie). Ship with QW0 + the small consistency PRs (Phase-1 #19). |
| **#136 — Random skill on draft has NO Command chance** (`tedchange#POST 7, 47`; game-mechanics §4.1.y) | `runPhase_2_1_1_Draft` (`phaseRunners.ts:187-197`) random-skill generator path | restrict the skill pool to the 6 base skills (admin/legislative/judicial/military/governing/backroom) excluding Command from the boost | **XS verification + filter.** Verified: today's pick is over `['admin','legislative','judicial','military','governing','backroom']` at `:196` (Command is the separate `command` field, NOT in the boost pool) — so this may be a **no-op verification** in the current code path. Verify the dataset-import path too. |
| **#137 — No cross-party draft (pols enter at IRL party)** (`tedchange#POST 8, 10, 48`; game-mechanics §4.1.y) | `runPhase_2_1_1_Draft` (`phaseRunners.ts:107-267`) + `instantiateDraftees` (`phaseRunners.ts:114`) + `pickBestForFaction` (`phaseRunners.ts:33-53`) | gate a rookie's `partyId` to the dataset's IRL party at draft time; exclude cross-party drafting in the picker; flip via 2.1.6 conversion only | **WIDENING (engine) — a draft-time party-assignment gate.** Verified: today's CPU pick is by faction-personality-fit, NOT by historical party. Size: XS. |
| **#138 — 3 random traits + 3 random alt-states per draft (SUPERSEDES 5/5)** (`tedchange#POST 50`; game-mechanics §4.1.y + §24.8) | draft config + era-config table (§6.1 pattern) | a tunable era-keyed `{ traits, altStates }` rookie-grant pair | **WIDENING (config) — already partly captured by #69 (1856-native re-rule).** Ted's `tedchange` confirms 3/3 going forward. Size: XS. |
| **#139 — Pres signature step lives in 2.6, NOT 2.10** (`tedchange#POST 124-126`; game-mechanics §12.3.y) | `PHASE_SEQUENCE` (`src/phases.ts`) — the sign step placement | move the Pres-sign step to live in 2.6 so military bills affect Mil-Prep BEFORE 2.7 Military Action | **XS phase-sequence reorder.** Folds into Phase-1 #2 (bill typing + spending cap) + Phase-1 #14 (legislative micro-mechanics). |
| **#140 — AnytimeEvo target-pool tightening** (`tedchange#POST 249-275`; game-mechanics §10.2.y) | `anytimeEvents.ts` event templates + the picker filter (`phaseRunners.ts:2782`) | event-by-event target-pool restrictions: events 5/17/23/24/25/39/66/117/118/119 → Rep/Sen/Gov/Cabinet only; Assassination → 50% Pres / 25% Rep-Sen / 25% FL | **S — per-event filter wiring + AnytimeEvo template content edits.** Folds into Phase-1 #19 small consistency OR co-locate with E9 handler 9g (A/B/C event vote). |
| **#131 — Integrity pol cannot nominate Controversial** (`tedchange#POST 277`; game-mechanics §9.3.8) | every nomination/appointment path (cabinet `phaseRunners.ts:2158`; CJ; ambassadors; CC delegates) | a trait-aware filter helper `canNominate(nominator, nominee): boolean` | **XS one filter helper, used by every nomination path.** |
| **#132 — Challenge-Legislation cannot target REPEAL** (`tedchange#POST 246-248`; game-mechanics §11.3.y) | the gov-action library (Phase-1 #11 / E11), the Challenge-Legislation action target list | a filter on the action's target list excluding repeal bills | **XS — a build-target constraint on E11 / E25.** |
| **#141 — FL trait gain rates: 5% positive / 3% negative** (`tedchange#POST 79`) | the faction-leader trait-gain step (per-cycle for positives; first-time-as-FL only for negatives) | refine existing FL trait-gain const + add "first-time-as-FL" gate for negatives | **XS — refines existing rules already partially captured by cf82a7d3 §5a #4.** |
| **★ #120 — `smallbugs` dataset umbrella** (`smallbugs` §2/§3/§4) | `scripts/seedDataset.mjs` `CURATED_ROWS` overrides + `politicians-dataset.csv` + `public/standard-draft-classes.json` | ONE coordinated dataset-maintenance pass: ~50 named-pol fixes (religion/skills/traits/birth/bio/party/alt-state), ~30 small mechanical bug fixes (swapped bill ideology effects, missing event prereqs, era-flag typos, region off-by-ones), ~20 dataset additions (Sequoyah/Yazoo/de Valera/Perkins) | **DATASET — author-time `scripts/` work, NOT engine.** ONE coordinated pass; sub-items are XS-S each but workload is the volume. Also covers DH-43 (Vermont home-state mapping), DH-51 (modern recency-biased pols), DH-28 (trait-conflict validator at boot). Size: M as a coordinated pass. Place orthogonally to engine work. |
| **★★ Relocation cap = 4 (closes QW0/BUG-0)** (`smallbugs#POST 734-735`, vcczar-12-30-25; game-mechanics §30.3) | `RELOCATION_ATTEMPTS_PER_TURN` (`src/types.ts:247`) + the relocation accumulator | one-line const edit: `5 → 4` + a guard so alt-state moves don't decrement the budget | **XS one-line edit, SETTLED — DO IT FIRST.** Folds into existing BUG-0 / divergence #9 row above. |
| **★ Amendments NOT SCOTUS-challengeable (build-target SIMPLIFICATION)** (`smallbugs#POST 250-269`, vcczar; game-mechanics §30.3) | E5 (amendment lifecycle) + E25 (SCOTUS docket) — build-target constraint, not a code change today | drop the SCOTUS-overturns-amendment branch from E25's docket scope and from E5's amendment lifecycle | **BUILD-TARGET constraint — OVERRIDES `tea1772` #100.** E5 keeps the strike-a-statute path + the mutable-threshold field; E25 keeps the docket + Justice drift + court size + DH-32 state-guard. Sequencing simplification. |
| **DH-43 (Vermont home-state) + DH-51 (modern pols recency-biased) + DH-28 (trait-conflict at boot)** (`smallbugs` corroborations of existing items) | `scripts/seedDataset.mjs` + the boot validator | fold into the #120 dataset umbrella | **No new shape; the umbrella row above subsumes these.** |

**Designer-gated OPEN items (`tedchange` §30.2 — NOT ready-to-build):**

These 9 items Ted floated in `tedchange` but did NOT close. They are
**designer-gated** (distinct from user-gated) — the roadmap-planner should
flag them as such in the parking-lot bucket and NOT schedule them until
Ted/vcczar closes them in `tedchange`/`smallbugs`:

1. **Mil-Prep meter level 4 fix** (3 proposals: 30/40/30, 30/60/10, 40/50/10).
2. **#125 Universal Election Modifier (UEM)** — proposed but pushback on stacking + age modifiers.
3. **Crisis trait consolidation** (Crisis Manager + Crisis Gov as a tier).
4. **Term-limit Gov actions in pre-Senate era**.
5. **Faithless-elector rewording**.
6. **Party rename trigger** (PL vs Era Evo).
7. **VP-must-be-same-party-on-resignation** relaxation.
8. **Cabinet enthusiasm percentages** (the #124 numeric).
9. **Cabinet ideology weighting** (Big-4 vs rest vs cabinet-level).

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
| `scenario1856.ts` (`build1856Scenario`) | Antebellum scenario; starts `currentEra: 'nationalism'`, phase `2.1.2` (rookie crop pre-seeded), bicameral constitution already ratified. **Spine dead-ends at the Trent Affair (1861)** — batch 4 (`hd`) designs its continuation: the Civil-War combat engine + Reconstruction + secession + Canada arc that turns this half-finished shipped scenario into a full 1856→1904 campaign (§9.1.2; gap #56–#60). |
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

> **SHIPPED vs PROPOSED — there is NO shared boot abstraction (batch 10, #115).**
> Each builder is **hand-authored from scratch**: `startNewGame`
> (`GameContext.tsx:264`) switches on a literal `'1772' | '1856'`; `build1856Scenario`
> (`scenario1856.ts:44-214`) seats Congress in nested per-state loops with raw
> `Math.random` (`:83,99,113`), assigns Senate classes naively (`:86`,
> `classId = senators.length + 1` — DH-24), seeds the House as full `electoralVotes - 2`
> reps (`:93` — not the (EV−2)/5 focus-Rep model, #55), and stamps a 47-field
> `GameState` literal by hand. A 1820/1788/1800/1948 scenario today means **copying
> that ~200-line builder** — which is how the undocumented GM boot house-rules
> (strip-Command, career-track seeding, vacant-seat fill) proliferate, none of them in
> code. **PROPOSED (the #115 build target): a canonical `scenarioBoot(BootSheet)`
> pipeline + a typed `BootSheet` schema (mechanics §26.1 / §29.1) that all eras share,
> so era identity is data, not a code path. This is promoted to the front of the queue
> — see §9.1.9 for the exact factoring + the undocumented setup-rules the pipeline must
> encode.**

> **`scenario1856` is the template for the next scenario, not `scenario1772`.**
> The buildable batch-2 target is **federalism via `scenario1788.ts`** — a
> **mid-government boot** (pre-seated Washington administration, start past the
> draft at a governance phase, `phaseId: '2.1.2'`), which is exactly the
> `scenario1856` shape (`scenario1856.ts:177-193`), not the from-scratch 1772
> shape. See §9.1.1 for why the mid-government boot precedes a general
> `advanceEra()`. New files: `scenario1788.ts`, `factions1788.ts`,
> `states1788.ts`, `eraEventsFederalism.ts`, `scotusFederalism.ts`.
>
> **★ Batch-17 (`ted1772`) — the founding→federalism BOOT surface is also where the
> #159 Constitutional-Convention extension lands.** The shipped
> `constitutionalConvention.ts` (the `1772`-scenario era system that transitions
> `→ federalism` at `:198`) is a superset SKELETON; `ted1772` documents the full
> per-article voting machine the engine does not yet model — the **per-article
> 2/3-vote + eliminate-lowest-and-revote loop**, **gov-sends-3-delegates (2 own + 1
> opp, ≥1 Legis)**, the **random-egghead drafter**, **debate-sway by traited
> delegates**, and **the slave-compromise plank → a per-state EV penalty**
> (slaves-don't-count → seceded-South GA −5/SC −5/NC −3/VA −3, floor 3; shipped sets
> EV flat at `:208-211` with no plank branch). It is **founding-era content that
> EXTENDS this existing file** (M–L; debt #33 / §9 batch-17 (2)), downstream of the
> keystones — sequence it after the boot pipeline, not before. The same boot also
> carries the **#153 ×2-Command-gain knob** (build-with-confidence, 3-source
> canonical; debt #31) and the **#158 CPU-anti-game-over** floor (debt #32, build
> with the #155 war pass) — both demonstrated LIVE in the founding run that produced
> an emergent 1st President from a 0-Command CPU pol.

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
> **Batch-7 sharpening — the scheduler needs a MIN floor (DH-30) AND a
> TERRITORY gate (#92/§27.1).** Two additions land on this same walker: (1) the
> roll has a **max but no min** today — add a **minimum = 20% of the era's max
> (round down), spilling to the 5 generic anytime events** if none fire (DH-30,
> the companion to BUG-1); and (2) **content must be gated on TERRITORY OWNERSHIP,
> not just `yearAtLeast`** — add a `{ territoryOwned }` `Predicate` variant + one
> `evalPredicate` case (`eraGraph.ts:12`) so un-owned-land era-events/bills/
> draftees are invalid (the mechanism behind the content-band era model — §9.1.5).
> The **same `territoryOwned` predicate also filters the draft pool** (excludes
> pols whose state/territory is un-owned or unorganized — §27.5). **One predicate,
> three consumers** (era-event walker, bill catalog, draft pool).

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

### 6.6.1 The CpuController scaffold (K5) — the new home for agent-decision code

**Architectural call — `drums` (batch 5) makes this a keystone.** The shipped
engine has **NO agent-decision pass.** Today the per-faction "what does the CPU
do here?" question is answered ad-hoc inline by phase runners, and only for
three thin surfaces: `pickBestForFaction` for the draft
(`phaseRunners.ts:33-53`, scores `pvCache + ideoMatch`), `pickAIResponse` for
era-event branches (`eraGraph.ts:88-103`, reads a `node.aiBias` map by
LW/Center/RW personality), and the CC / First-CC / Constitutional-Convention
helpers (`continentalCongress.ts:23,116`; `firstContinentalCongress.ts:153`;
`constitutionalConvention.ts:81`). **Every other phase that should have CPU
behavior either runs no logic at all or runs a one-line placeholder** —
including `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`, which scores
and immediately seats every nominee with no Senate vote at all), the legislation
floor (no per-CPU NAY/AYE/NAY heuristic), the convention finisher
(`engine.ts:69` "log ratification"), conversion targeting (no Pliable+adjacency
filter), and leadership / Speaker / PPT (no IRV bloc-vote).

The §25 spec doesn't slot into any existing place. It needs its own home.

**K5 — the `CpuController` scaffold:** a new directory `src/engine/cpu/`
holding (a) a top-level orchestrator, (b) one handler per spec'd subsystem,
(c) shared utilities for deterministic tie-breaks, (d) the persistent state
the architectural gaps need (DH-20 reciprocity, DH-22 scandal cooldowns). The
shape:

```ts
// src/engine/cpu/types.ts
export interface CpuContext<Ctx = void> {
  snap: FullGameSnapshot;
  factionId: string;       // the CPU faction the decision is for
  ctx: Ctx;                // subsystem-specific payload
}
export interface CpuHandler<Ctx, Decision> {
  id: string;                                       // "candidate-selection", "leadership-vote", "cabinet-pick", ...
  decide(c: CpuContext<Ctx>): Decision;             // pure; uses rng.ts wrappers ONLY
  // Tie-break utilities are shared (see below).
}

// src/engine/cpu/controller.ts
export class CpuController {
  registerHandler<Ctx, Decision>(h: CpuHandler<Ctx, Decision>): void;
  decideFor<Ctx, Decision>(id: string, c: CpuContext<Ctx>): Decision;
}
```

**Why this shape (and not direct calls from runners):**

- **Determinism.** All RNG goes through `rng.ts` wrappers, *not* `Math.random`
  (debt #1–#3) — once K0 lands, every CPU decision is reproducible from the seed.
  The tie-break utilities (e.g. "alphabetize-by-id when scores equal", "lowest
  faction score picks first", "random-among-ties via `pick`") live in
  `src/engine/cpu/tiebreaks.ts` so the deterministic guarantee is one chokepoint.
- **Pluggability.** Each handler is a per-subsystem PR. Wiring §25.1 (candidate
  selection 75/25) is independent of wiring §25.3 (leadership IRV) — once the
  scaffold lands, the 15 spec'd subsystems are 15 lightweight PRs.
- **Persistence is centralized.** `GameState.cpuCommitments?` (DH-20) and
  `GameState.recentScandalIds?` (DH-22) are read + drained by the CpuController's
  lifecycle hooks (pre-phase / post-phase), not sprinkled across runners.
- **Wired against `ActionRegistry` (K2).** When a handler must *pick from a
  registry library* (convention inter-ballot menu, governor actions, primary
  actions), it calls into the registry's `isAvailable` + `resolve` — the same
  picker the human UI uses. This is the load-bearing reason K5 sits **after K2**.

**Handler order to ship** (one PR per row; `(*)` = needs new persistent state
the scaffold introduces; `(K2)` = consumes an `ActionRegistry`):

| Order | Handler | Spec | Reads | Writes | Notes |
|---|---|---|---|---|---|
| 1 | **Candidate selection (75/25 + minor + open-seat)** | §25.1 / #72 | `Politician.{currentOffice,command,traits,pvCache}`, `Faction.leadershipPolId`, `state.preferredIdeologies` | candidate id | Cheapest win (table lookup + 1 roll); blocks no other handler. **★ Batch-13 field-validated (`oopscpu`): pre-12A nomination trio (#144)** — (a) incumbent Pres re-nominates incumbent VP if eligible (VP retention), (b) nominate an alternate when none exists (anti-tie), (c) own-faction priority; + the same-state-EV exclusion (two same-state candidates can't both take a state's EVs). No-primary-incumbent corroborated (`oopscpu#POST 294`). |
| 2 | **Legislation NAY/AYE/NAY + conditional-vote-rules consumer** | §25.6 / #74 + `pop` POST 1111 | `Bill.cards`, `Faction.cards`, opposition president's meters, **`Faction.factionLeader.compelledVoteRule?: Predicate → Vote`** (consults BEFORE the §25.6 heuristic) | vote | Replaces the floor-vote stub (no floor-vote CPU pass exists today; the only `autoFillCPUVotes` is the CC path); pairs with `Bill.type` (#42). **Batch 6: handler consults the conditional-vote-rules primitive first** — if a faction-leader has published a declarative `Predicate → {AYE/NAY}` policy (e.g. "NAY any nominee with Admin<3"), the predicate decides the vote; the §25.6 heuristic is the fallback. Same primitive used by handler #4 below (cabinet). Predicate extension (the existing `Predicate` tree at `types.ts:1487`) is the shape. **★ Batch-13 field-validated + OC-3 (★ BALANCE-CRITICAL, `oopscpu#POST 162-180`): the crisis-vote gate is the highest-priority sub-rule here.** The all-CPU run abolished slavery peacefully by 1792 because every faction (incl. Southern) AYEd the Abolish-Slavery crisis bill on crisis-priority grounds. Add **(i) an ideology-floor gate** (down-weight or floor-to-NAY the crisis-priority boost when the bill costs the faction's own ideology/lobby cards) + **(ii) a secession/slavery-active check** before an Abolish-Slavery crisis bill can pass (it never tripped a CSA check). Also corroborated: theme-blindness (point-math not theme, `oopscpu#POST 95-96` — same class as DH-21) + era-gated law-unlocked filibuster (`#POST 90-92, 284`). |
| 3 | **Leadership IRV bloc-vote + 3-ballot collective endorse** | §25.3 / #70 | `Politician.{ideology,pvCache,skills.legislative}` per round | per-round vote | The most-corroborated CPU heuristic. Deterministic continuous elimination + first-round random scramble. **★ Batch-13 field-validated end-to-end across multiple cycles (`oopscpu#POST 42, 115, 256, 329, 332`): IRV ladder + bloc-vote-by-faction + ties broken by the Party-Leader's backed candidate.** **OC-2 (`oopscpu#POST 151`): the marquee collision bug.** Closest-ideology leadership can hand chairs to the MINORITY party; the "≥60%-chamber → may propose" gate then reads chamber control differently → minority chairs propose under the majority's threshold. **Fix: ONE canonical `chamberControl(snap, chamber)` helper** shared by leadership-select + the proposer gate — consolidate the inline `senateMajority`/`houseMajority` duplication at `phaseRunners.ts:1863-1864`. The handler replaces the top-PV-of-majority-party stub there. |
| 4 | **Cabinet selection + confirmation (default-AYE baseline + conditional-vote-rules + SCOTUS-style within-1-step auto-AYE)** | §25.5 / DH-23 / #73 + `pop` §26.6.1 | `Politician.{admin,governing,expertise,traits}`, `Faction.cards` (lobbies), Sen Maj Leader Iron-Fist + Pres Pliable, `Faction.factionLeader.compelledVoteRule?`, **per-faction ideology-center distance from nominee** (`pop` §26.6.1: within-1-step auto-AYE rule for SCOTUS confirmation; applies the same principle to cabinet confirmation as a declarative pattern), **`GameState.recentScandalIds?` (OC-1 cooldown)**, **`firingPrecedentSet` (OC-5 gate)** | seat + vote | **Replaces the flat highest-score pick at `phaseRunners.ts:2158-2223` (`scoreCabinetCandidate` = admin+governing+expertise, seats immediately, NO vote) with a 2-step pick→Senate-vote.** Default-AYE; Iron-Fist Maj-Leader auto-AYE-own-picks (via the conditional-vote-rules primitive — same shape as handler #2); lobby-maximizer with Admin weighting. **Batch 6: SCOTUS uses a declarative within-1-step auto-AYE rule (§26.6.1) that bypasses the 50/50 cabinet trap** — fold this into the same handler for SCOTUS confirmations + the Manipulative-Pres-compel-retire (gated on `!Integrity OR Jud<5`) as separate trait-powers, NOT under the Iron-Fist overload. **★ Batch-13 field-validated: the crisis cabinet-fill LADDER (`oopscpu#POST 322`)** — highest-Admin first → eligible refuses → lobbies-tiebreak → next refuses → unemployed pol accepts (accept-roll). **OC-1 (`oopscpu#POST 65`): scandal-resignee re-appointment cooldown** — the CPU recycles disgraced pols onto new appointed offices because it has no scandal-smoother memory; this is the concrete instance of **DH-22 / §25.15.3** and reads the K5-introduced `recentScandalIds?`. **OC-5 (`oopscpu#POST 184-187`): court-as-firing loophole** — gate a cabinet-vacating SCOTUS appointment behind the firing-precedent rule (§21.4). |
| 5 | **Convention CPU (per-ballot menu + compromise + dark horse)** (K2) | §25.4 / #71 | convention runtime state + the convention `ActionRegistry` | inter-ballot action + ballot vote | Highest-complexity handler. Owns DH-8 (the GM-confirmed unstable surface). **Includes the 11-ballot deadlock fix** (auto-drop-out after 2-3 ballots of 0 Momentum, currently NOT implemented — DH-17). **★ Batch-13 COVERAGE GAP: #71 is the ONE handler `oopscpu` could NOT field-validate** — 1788 predates conventions, so this handler is still `drums`-only-spec. **A post-12A all-CPU run would validate #71** exactly as `oopscpu` validated #70/#72/#73/#74 (see the all-CPU-test methodology note, §9.1.3). |
| 6 | **Conversion poach (Pliable + adjacency gating)** (*) | §25.8 / #76 | actor's leader traits + target's `Pliable`/ideology gap | flip outcome | Add a multi-faction-collision tie-break (DH-bug). The rate table is per-leader. **★ Batch-13 field-validated: the ideology-circle LW↔RW-Pop 25% cross-step (`oopscpu#POST 117-119, 127`)** — confirms the #99/§27.7 circle-adjacency conversion live (rides the central `ideologyDistance(a,b,circular)` helper, §9.1.7). |
| 7 | **A/B/C event vote + president ideology force + meter-guarding** (*) | §25.7 / DH-21 | event option's declared `meterEffects` + cabinet ideology + `GameState.meters` | option pick | **First handler to use the meter-impact aggregator** — it down-weights triple-stacks driving an already-bad meter into crisis. **★ Batch-13 field-validated (`oopscpu#POST 335-337`): Pliable Pres defers to cabinet majority; tie among advisors → President decides (Egghead-tiebreaker-only).** Also corroborated: CPU SKIPS its exec-action budget when no action nets points (`oopscpu#POST 191` — points-maximizing only; same class as #75/#23 + DH-21 theme-blindness). |
| 8 | **Faction-leader replacement (4-condition removal + hard gates)** | §25.10 / #78 | leader's traits + bench + faction cards | new leader id | Adds the missing positive-trait floor + mid-term-swap rule (stagnation bug). **★ Batch-13: feeds the #61 death-succession branch** — a VP who inherits the Presidency on a clean death is NOT auto party/faction leader, so the party re-runs leadership IRV (handler #3) → this replacement handler picks the new PL. |
| 9 | **Primary CPU (5-action template + frontrunner rule)** (K2) | §25.12 / #63 | primary state group + actor traits | action + target | Designer-flagged under-tuned; smarter attack-targeting + better frontrunner rule. |
| 10 | **Governor action picker (state-stack-aware)** | §25.15 #4 / DH-19 / #20 | `State.industries` + `State.policies` + Honest-Gov caps | gov-action id | Prunes no-op actions (e.g. Improve Industry at 10/10). |
| 11 | **Reciprocity / vote-trading enforcer** (*) | §25.15 #1 / DH-20 | `GameState.cpuCommitments` | per-vote bump | The first DH-* gap that's "architectural" — needs the scaffold's persistent state. |
| 12 | **Cascading-scandal smoother** (*) | §25.15 #3 / DH-22 | `GameState.recentScandalIds` | filtered event pool | Era-event walker calls this to drop back-to-back at-most-once events. |
| 13 | **VP selection (8-element rubric + retention curve)** | §25.2 / #72 | ticket data + region/age/state-size + era-curve | VP id | The retention curve is era-keyed ("more likely Nuclear+"). **★ Batch-13 RULED (`oopscpu#POST 192`, #144): VP retention is now a HARD rule, not a curve, at least pre-12A** — an incumbent Pres always re-nominates the incumbent VP if eligible (closes the `drums` #72 "no retention" gap). The era-keyed "chance" softening is subsumed by this; the question of whether later eras soften it is open. |
| 14 | **SCOTUS justice vote + Iron-Fist compel + 10-yr drift** | §25.14 / #79 | docket + Justice ideology + Iron-Fist presence | per-case vote | Rides the SCOTUS docket (E-modern). |
| 15 | **Faction rename trigger** | §25.13 / #40 | rename-trigger registry + election history | renamed faction | Reads the rename-trigger predicate→name-generator registry (§6.7.1 pattern). |

**Migration discipline:** `cpuCommitments` and `recentScandalIds` are
**optional** on `GameState` and **`repair()`-backfilled `[]`** (§3.3). The
controller itself is *runtime* — it has no save shape; only its *outputs* hit
the snapshot.

> **Why K5 is foundational but each handler is not.** The scaffold is one PR
> (~120 lines: `CpuController` + `CpuHandler` interface + tie-break utilities +
> two `repair()` backfills + a unit test that registers a fake handler and asserts
> determinism). It unlocks ~15 follow-on PRs that can be parallelized across
> contributors. The scaffold is what **DH-8 was waiting for** — without it, the
> CPU spec lives in `game-mechanics.md §25` and never enters the build.
>
> **What K5 does NOT do.** It does not block scenario work. The 1856-arc + the
> federalism epic can ship with **stubbed handlers** (the existing inline
> heuristics in `pickBestForFaction` / `pickAIResponse` / `autoFillCPUVotes`
> stay; the new handlers replace them gradually). Specifically: **the
> federalism epic can ship before K5** by accepting today's CPU behavior in
> 1788, and the K5 wiring then upgrades both scenarios together. This is the
> "K5 is a force-multiplier, not a gate" property.

> **★ Batch-13 (`oopscpu`) — the E9 handler specs are now FIELD-VALIDATED, not just
> designed.** The Ted-run all-CPU 1788 stress-test exercised the CPU ruleset on a
> running board and stopped at each spot the rules were vague/contradictory/impossible.
> The effect on this table: **handlers #70 (leadership 9c), #72 (candidate/VP 9a/9m),
> #73 (cabinet 9d), #74 (legislation 9b), #75 (event 9g), #76 (conversion 9f) are now
> "spec-complete + field-validated with concrete failure modes + Ted's fixes"** — a
> meaningful build-confidence bump (lower spec-risk per handler PR). The OC-1…OC-8
> sub-gaps fold into the handler rows above as sub-rules: **OC-1 + OC-5 → handler #4
> (cabinet)**, **OC-2 → handler #3 (leadership: the shared `chamberControl` helper)**,
> **OC-3 → handler #2 (legislation: the crisis-vote gate — the highest-priority
> sub-rule, balance-critical)**, **OC-6 → handler kingmaker (§25.11)**. **The one
> handler NOT validated is #71 (convention, 9e)** — 1788 predates conventions, so it
> stays `drums`-only-spec; a post-12A all-CPU run would close that gap (the all-CPU-test
> methodology, §9.1.3). `oopscpu` does **not** change the handler build ORDER — it
> de-risks the specs and pins the OC-* sub-rules to their handler homes.

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
3. Era boundaries are also card-pool / nation-roster swaps **and a point-banking
   step** (batch 4, #68/§2.5). Run them through `advanceEra` so a
   1772→federalism→nationalism→gilded campaign has one transition function. The
   boundary is a **~12-step boot pipeline**, not a flag flip: end-of-era award
   payout → **bank the era's score + zero the running total** (points do *not*
   carry linearly; the per-era banks sum toward the cross-era win total) → faction
   trades → a **full 2.1.x→2.3.1 re-run** under the new era's rules → card/draft/
   SCOTUS pool swap (+ the per-era card-count rescale). Model the banks as
   `GameState.eraPointBanks?: Record<Era, …>`; `repair()` backfills `{}`.
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

#### 6.7.4 CPU handler (a §25 subsystem) — batch 5

Each row in §6.6.1's handler-order table is a PR. Recipe:

1. **Land the K5 scaffold first.** `src/engine/cpu/{types.ts, controller.ts,
   tiebreaks.ts}` + the two `repair()` backfills (`cpuCommitments?`,
   `recentScandalIds?`) + a unit test asserting determinism under a fixed seed.
2. **Add the handler:** `src/engine/cpu/handlers/<subsystem>.ts` exporting a
   `CpuHandler<Ctx, Decision>` implementation. Pure; reads the snapshot + the
   `ctx` payload; returns the decision. **All RNG through `rng.ts` wrappers.**
3. **Register it** in the controller's init pass (or lazily on first use).
4. **Replace the inline stub** in the consuming runner with a single
   `controller.decideFor('<id>', { snap, factionId, ctx })` call. Don't delete
   the old stub mid-PR — feature-flag the new path until it's playtested.
5. **Author the heuristic against the §25 subsection** verbatim. If the spec is
   ambiguous (e.g. §25.4 ballot-shift was GM-ruled "next round"; §25.5's
   "low chance to reject" rate is unspecified), flag it in the PR and pick a
   stated value with a comment-link to the digest POST number.
6. **Tie-break utilities are deterministic.** Never call `Math.random` or even
   the raw `rand()` wrapper; use the named utilities (`pickWeighted`,
   `pickByLowestScore`, `breakByPolId`) so the chokepoint is uniform.
7. **Test against a fixed seed** with a small fixture snapshot. The handler is
   pure — assertions on the returned `Decision` are deterministic.

**Architectural gap handlers (DH-20/21/22) add a wrinkle**: they need the
**persistent state K5 introduces**. The reciprocity handler reads + drains
`GameState.cpuCommitments` (the convention-PromiseAction populates it; the
leadership-vote enforcer consumes it). The scandal-smoother filters the
era-event walker's eligibility set against `GameState.recentScandalIds`. Both
fields are `repair()`-backfilled `[]` and stamped with `firedYear`/`expiresOnYear`
so the data is self-cleaning.

**Batch-6 addition — the conditional-vote-rules primitive (`pop` POST 1111).**
Iron-Fist (and Manipulative) controllers can publish **declarative `Predicate
→ {AYE/NAY}` policies** stored at `Faction.factionLeader.compelledVoteRule?`.
Handlers **#2 (legislation)** and **#4 (cabinet)** consult this primitive
BEFORE running their default heuristic — the conditional vote-rule acts as
an authoritative override. Subsumes per-vote Iron-Fist compulsion + the
§25.5.2 "auto-AYE for own picks" cabinet rule under one shape. The predicate
is the existing `Predicate` tree (`types.ts:1487`); `evalPredicate` already
walks it. The same primitive could be promoted upward (e.g. faction-leaders
publishing endorsement policies for primaries) — keep it on the controller's
data layer so any handler can read it. Folds into **E17 Iron-Fist split**
(which authors the spec'd Iron-Fist child traits AND the conditional-vote-
rules infrastructure together).

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
| 1 | **Raw `Math.random` in election scoring** | `phaseRunners.ts:3711` (`calcStateVote`'s `(Math.random()-0.5)*8` jitter) | The flagship determinism leak — every state vote is unseeded. Blocks reproducible elections (and any future replay/multiplayer sync). Route through `rng.ts`. **This is also where the enthusiasm→election model binds.** The full score is `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias + traitBonus + jitter` (`:3709-3711`, re-verified batch 11 — unchanged); enthusiasm is read RAW (`enthusiasm[ideology][party]`, `:3696`) and applied UNIFORMLY to every state, with **NO ±3 cap and NO per-state ideology penalty.** **★ Batch-11 update (#51 RESOLVED): the enthusiasm-shift ALGORITHM is now SETTLED** — `arkzag` published the 4-step faction-performance→enthusiasm rule verbatim and it MATCHES `drums` (§29.10), so batch 10's fork is closed. **What this means for this site:** (a) the **±3 cap is now ready-to-build** (it binds HERE, clamping the `enthusiasm*2` + `partyPref*5` terms — still XS, queued as E6/#80); (b) the **per-Congress 4-step reshuffle pass** is a NEW runner that writes the enthusiasm boxes BEFORE this read (lands in E23, the Score-economy epic); (c) the **#18 state-scope sub-question** ("which states does a card's enthusiasm apply to") is **still a human DECISION-GATE** — the cap can ship, the "which states" cannot. See §9 batch-11 #2. **★★ Batch-15 update (#18 RESOLVED): the state-scope fork is now CLOSED** — Ted (running the 2000-start) adopted V's 2-layer model (`terror2000#POST 913-926`): **(a) a universal per-ideology METER modifier** (flat, BOTH parties, EVERY state, primary+general) **+ (b) the per-PARTY enthusiasm box** (this `enthusiasm*2` term, now ±3-capped), composed additively. So THREE things bind HERE now: the ±3 cap (QW3/#80), the per-party enthusiasm box (layer b), and a NEW universal-meter→ideology modifier table read once per candidate (layer a). #18 LEAVES the Decision-gated bucket → **ready-to-build, S–M.** game-mechanics §29.3. **★★ Batch-19 RISK FLAG (`fixes2022`, the EARLIEST source): the enthusiasm model (#18/#51/#124) is the PERENNIAL FORK — the system the programmer (Anthony) got STUCK on (stalled ~½ into phase 2.1; V's four emails "didn't bring [Ted] any closer to being confident," `POST 715-716`) and that the DESIGNER himself "implement[s] a new way accidentally" each playthrough (`POST 713`).** So the #51 (drums 4-step reshuffle, §29.10) + #18 (terror2000 2-layer scorer) resolutions must be treated as a **FROZEN SPEC** — build the recorded model EXACTLY here, do NOT re-derive from scratch. **This is the single likeliest place the build drifts from designer intent** (a confidence/risk annotation only — no code/scope change; also flagged on E23). game-mechanics §29.3 provenance note + §30.10. |
| 2 | **Raw `Math.random` elsewhere in the engine** | draft rookie fallback gen `phaseRunners.ts:188-198` (8 calls); generic-war enemy power `:3603`; `calcStateVote` jitter `:3711`; `revolutionaryWar.ts:89,97`; `continentalCongress.ts:271` | Same class of bug. **14 raw calls across the engine** (verified: 11 in `phaseRunners.ts` incl. #1; 2 in `revolutionaryWar.ts`; 1 in `continentalCongress.ts`). `eraGraph.ts` is already clean — its only `Math.random` mention is the "no Math.random" comment at `:8`. Migrate all to `rng.ts` wrappers as part of the seeding work. **Batch-10 note: the scenario *builders* also use raw `Math.random`** (`scenario1856.ts:83,99,113` Congress-seat tie-breaks; `politicians1856.ts` author-fill 12×) — these are in the **scenario-boot blast radius (#115)**, so K0 + the `scenarioBoot` pipeline (§9.1.9) should route boot rolls through `rng.ts` too. |
| 3 | **`rng.ts` is not actually seeded** | `rng.ts:1-5` | The wrappers exist but wrap `Math.random`. Determinism is *aspirational* until a real PRNG (e.g. mulberry32/xoshiro) is dropped in and a seed is stored on `GameState`. Prerequisite for replay + multiplayer. |
| 4 | **No `DB_VERSION` migration path** | `db.ts:60`; `repair()` `GameContext.tsx:91` | All migration is app-side `repair()`. Fine for additive fields; **a store-level change has no precedent** and would need a real `idb` upgrade. `repair()` also grows unbounded — each f4c7c2c4 delta adds another block. |
| 5 | **`nationalism`/`modern` eras are partly inert; enum likely needs `gilded`+`progressive`; AND era-advance is hard-coded, not condition-driven** | only transition is `constitutionalConvention.ts:198` (`→ 'federalism'`); `Era` `types.ts:1337` | `Era` has 4 values and rules consts key all 4, but **no runtime path enters `nationalism` or `modern`** — 1856 *starts* in `nationalism` and never advances. The `modern` era is the **best-documented unbuilt era** (2276-post spec) but is wholly inert. The forum frames a Gilded Age *and* a progressive era *and* the modern arc → the enum likely needs `gilded` + `progressive`. **Batch 7 sharpens this into the era-model reframe (divergence #18 / §9.1.5): the ONLY era advance is the hard-coded `currentEra = 'federalism'` at `:198`; there is NO year→era derivation. The fix is a CONDITION-DRIVEN `advanceEra(snap)` (game-state/meter/territory triggers, per half-term) + content gated on `eraBand` + a `territoryOwned` predicate, NOT the calendar.** Content-gating must key off the **era band, not literal year** (alt-history clock). New eras need content + an `advanceWhen` condition + (maybe) the enum value. See K3/K4 in §9. |
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
| 16 | **Generic war resolver divergence (batch 2, #6) — ★ batch-15: no DEFEAT loss package** | `runPhase_2_7_2_Military` flat `milPower×10 + d100` (`phaseRunners.ts:3593-3627`, incl. `Math.random` at `:3603`) vs mechanics §21.1 | Shipped non-Rev-War wars use a flat one-roll resolver; forum uses additive per-battle Chance-of-Success + warscore/momentum/×2 resolution + a confirmation cascade. The rich path exists *only* for the Rev War (`revolutionaryWar.ts`). Generalize one `War` model. See §9.3 #6. **★★ Batch-15 (#152): the resolver DOES end a war at `warScore ≤ -50` (`:3618-3620`, logs "ends in our defeat") but applies NO LOSS PACKAGE** — it is a bare log line. `terror2000` recorded the FIRST whole-war DEFEAT (War on Terror LOST ~2005) with its terminal package: officers −1 Mil + −1 all-elections; **President −1 ALL future elections**; Party-Pref crater — the inverse of the victory bundle. Plus wars are MULTI-PHASE (naval→ground; "Invasion"→"Counter-Terrorism"; Afghanistan→Phase II) with carry-roll across half-terms. **A war must be able to RESOLVE in LOSS, not just stall/win (DH-47).** The loss package + named-phase carry attach to the generic `War` model the war engine (Phase-1 #3) already builds — M within E3, not a new epic. See §9.2 war row + #152. **★★ Batch-24 (founding war-engine constraints, two small additions): (i) the war engine needs a SCRIPTED-EVENT WIN PATH.** `runRevWarBattles` (`revolutionaryWar.ts:254-264`) ends a war ONLY via `currentGroundWins >= war.groundWinsNeeded` (battle threshold, `:254`) or the `frenchAlliance` no-loss path — there is **NO event-driven win hook**. `grass1772` won Independence in 1780 via the scripted "King George III Grants America Autonomy" event (`grass1772#POST 163`), not a battle threshold or France — a **3rd distinct RevWar win-path in the KB** (battle-threshold / French-alliance-unloseable / scripted-autonomy-event). The generic `War` model must support an event-driven win, not only a battle threshold (folds into the #155/#56 war work, no new epic). **(ii) the doubled-officer Planning term can EXCEED the 0-5 ability cap — clamp it.** `revolutionaryWar.ts:212` computes `secWar?.skills.admin != null ? secWar.skills.admin + general.skills.military : general.skills.military * 2`, so a general at Mil 3+ yields `*2 = 6+`, above the 0-5 max Ted flagged (`rookie1772#POST 35`); a `+10% Military-Leader` battle bonus Ted "didn't remember" is also undocumented. **Fix: `Math.min(5, general.skills.military * 2)`. XS, in the war engine.** game-mechanics §17.4. |
| 17 | **Cabinet wipe-on-election (divergence #8) — CORRECTED: there IS a wipe** | unconditional clear at `phaseRunners.ts:3804-3812` in `runPhase_2_9_4_PresidentialGeneral`; re-fill at `:2166` next turn | **Batch-3 correction of a batch-2 error.** Earlier note claimed "no wipe exists" — wrong; it missed the election-phase loop. The cabinet is vacated and cleared after **every** presidential general (even on incumbent re-election), then re-staffed from scratch at 2.3.1 next turn. The fix is **replace the wipe with retention** (keep ≤5, CIA/FBI exempt) **gated by `firingPrecedentSet` + per-officer tenure + same-faction US-Bank guard** — **M, not S**. See §2.1.1 grounding note. |
| 18 | **SCOTUS is a stub (divergence #7), not a system** | court ruling `phaseRunners.ts:3397-3414` (a `chance(0.5)` coin-flip whether the court acts at all, then 4 hardcoded titles + a conserv-vs-liberal majority → `partyPreference ±0.1`); retire/backfill `:3648-3671` (age≥75 + `chance(0.15)` retire, replace with highest-judicial same-party pol) | The shipped court has the *entity* (`supremeCourtIds`/`chiefJusticeId`, `types.ts:1584`) but no docket, per-case effects, compel-vote/retire, dynamic size, or ruling→law-deactivation. Modern #52 is a from-scratch SCOTUS module — there is no balance-tuned court to preserve, so framing it as a "replacement" overstates what ships. Gates BUG-2 (`Chisholm` needs amendments). M–L. **Batch-10 (#52, the player-SCOTUS fork — DECISION-GATED):** `dem1820` (POST 420-443) surfaced THREE live models — votes-by-ideology-chart + player delay/dismiss-only (the forum's working rule), trait-gated player-vote (`vcczar`), fully-player-controlled (two players) — **none settled.** Regardless of fork, the build needs a **docket data structure**: per-era case rows in `src/data/scotusCases<Era>.ts` (`templateId`, ideology-vote chart, ahistorical-flag, optional ruling→bill-class modifier) + a `GameState.scotusDocket` ledger; the fork only changes the *resolution* + the player-action surface (delay/dismiss = one ActionRegistry row; trait-gated player-vote = a different one). **Author the fork before building the docket epic (Phase-2 #25).** Pairs with DH-32 (state-can't-be-voided guard) + DH-41 (ruling→statute cascade, parking lot) + #94 (`Cohens` rule-modifier). |
| 19 | **Dataset exhaustion (scaling wall a)** | runtime load `standardDraftClasses.ts:13`; finite ~18.5k JSON | The real-person dataset **runs out in the deep-modern era** → no draft pool for late-era play. Needs a **runtime, seeded procedural pol generator** (`src/engine/`, emitting `ImportedDraftee` rows, reusing `instantiateDraftees` `phaseRunners.ts:114`). Also fixes "sparse new states need filler officials" (#43) + BUG-3 stopgap. Connects to portraits (A1). **Needed for ANY late-era play.** M–L. |
| 20 | **House bloat → manual-staffing tedium (scaling wall b)** | no slate/committee persistence across cycles; election + committee phases re-run from empty each cycle; House modeled as **full `electoralVotes - 2` reps per state** (boot `scenario1856.ts:93`; re-elected per-seat `phaseRunners.ts:3913-3939`) | Wyoming-Rule House ~572–601 (Senate 106) makes the manual House-election + committee-staffing phases unbearable — **a player quit over it**. Needs **persist + carry-forward/auto-fill** of House slates + committee rosters on the snapshot. **Near-term** (improves 1856's 31-state congress too), not modern-only. M. **Batch-10 (#55, focus-Rep abstraction — DESIGNED-not-shipped):** the forum abstracts the House to **"focus Reps" at `(EV − 2) / 5` rounded up** (`dem1820` POST 643), each controlling an equal share of a state's hidden seats — NOT the full per-seat model shipped. Collapsing per-seat reps to focus-Reps is the change that makes the "congressional election from hell" (10 forum pages / 8 real days in `dem1820`) tractable; build it WITH this scaling-wall item. The **seat-specific-incumbency-except-census-year +2 bonus** (POST 682/696, `vcczar`) is a balance dial on top. Folds into the census/apportionment epic (#34/#55). |
| 21 | **DH-1: filibustered "MUST-pass" bill has no rules remedy** | no deadlock rule (filibuster itself unbuilt); `modern` 640-716 | A GM-confirmed **design hole** (rules, not code): when a required bill is filibustered to death the rulebook has no answer (GM improvised a 4-leader special-committee auto-pass with a per-day "shutdown" penalty clock). **Rules must be *authored* (a PM/design task) before this can be built.** Couples to the filibuster epic. **(NB: investigation-committees #54, formerly grouped here as under-designed, is now READY — `hd` authored the 5d6 spec, §24.5/#65.)** |
| 22 | **DH-2: modern era-deck fired off-year cards** | possible scheduling defect; reconcile with BUG-1 + the §6.4 scheduling fork; `modern` 2221 | In ~2018 the deck pulled 2008-era cards. **Reported, not verified** — could be intended shuffle/backlog or a real defect. Resolve **together with divergence #4 (era-event scheduling)** and BUG-1's era-lock filter, since all three are the same scheduling surface. |
| 23 | **The engine has NO agent-decision pass at all** (batch 5 / DH-8 + DH-20/21/22) | three thin CPU stubs — `pickBestForFaction` (`phaseRunners.ts:33-53`), `pickAIResponse` (`eraGraph.ts:88-103`), `autoFillCPUVotes` (`constitutionalConvention.ts:81`); everything else either does nothing or runs a one-line placeholder | Every faction except the player is CPU. Most mid-to-late content (conventions, cabinet confirmations, leadership races, conversion, A/B/C events) **doesn't *work*** without a real CPU surface, even if every phase runner ships. **The fix is K5** — a `CpuController` scaffold (`src/engine/cpu/`) that the §25 spec'd handlers plug into. **This is the highest-leverage gap in the codebase after K2.** **★★ Batch-25 ESCALATION (`principle1772`): this is no longer just "highest-leverage" — it is the LOAD-BEARING PREREQUISITE for the shipped 1-human-vs-9-CPU mode to be completable.** The designer himself (Ted, the game co-author) hand-ran all 9 CPU factions to reach a natural ~1800 endpoint; absent that human, this exact pass is what makes the solo mode reach an ending instead of stalling. The designer-run is the corpus's strongest proof of the ceiling (it completed ONLY because a human did the CPU-AI's job). See §6.6.1 + §9.1.3 + DH-36 + debt row #58-area #114. |
| 24 | **Cabinet confirmation: no Senate vote at all (DH-23)** | `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step scored pick that goes straight to `cabinet[seat] = pick.id` + `addLog("confirmed as ${seat}")` — no committee step, no Senate vote, no NAY/AYE | The `drums` 36% pass-rate bug **doesn't exist today because the system doesn't exist**. The fix is to **build the confirmation step in the right shape from day one**: default-AYE baseline with low-% opposition reject + Iron-Fist Maj-Leader auto-AYE-own-picks (the lost rule) + a lobby-maximizer that *weights* Admin/competence instead of *only* lobby cards. **Smaller than expected** — XS–S, see §9.3 #14. Pairs with the cabinet-retention refactor (#17). |
| 25 | **Iron Fist is one trait but does ≥6 distinct things by office (batch 5 / §25.9)** | `'Iron Fist'` as a single `Trait` union member (`types.ts:89`); 4 governance rows (`:1043-1047`) + 3 era-event multipliers (`phaseRunners.ts:2915`, `:2931`, `:2959`) | Designer-flagged to split into ≥6 office-keyed traits (`'Stifle Competition'` for primary block, `'Force Vote'` for chamber compulsion, `'Compel SCOTUS'` for court compulsion, `'Fire Officers'` for mid-war military replacement). **`repair()`-migrateable** — expand `'Iron Fist'` to all child traits in one block, then the spec'd readers move to the narrower traits. **M.** Independent of keystones (the trait system shipped in PR4–PR6, before any 1856-arc work). |
| 26 | **Veto override / cloture / filibuster: NO code exists yet** (verify for batch 5 / divergence #11) | grep confirms zero engine sites for `veto`/`override`/`cloture`/`filibuster` (only doc comments at `phases.ts:164`, `types.ts:506`, and unrelated occurrences) | When veto-override is built, the threshold is **2/3 in BOTH chambers** (designer ruling, `drums` POSTS 2180-2187; the 60% was a reverted bug). **No fix needed today** — forward-only constant when the legislative micro-mechanics epic lands. |
| 27 | **★ Senate pass-threshold (batch 9 open question) — RESOLVED IN CODE: simple majority** | floor vote `runPhase_2_6_3_Floor` (`phaseRunners.ts:3498`); the post-independence path passes iff `house.yea > house.nay && senate.yea > senate.nay` (`:3562`) | **The digest flagged a SOURCE conflict** (`nuke` §28.5/§28.12, POST 2746-2770/8155/8308): is the Senate a ~60% supermajority-to-PASS, or simple-majority-to-pass with ~60% being CLOTURE only? **The shipped CODE settles the engine side: it is SIMPLE MAJORITY in both chambers (`yea > nay`), with NO cloture/filibuster/supermajority step at all** (consistent with debt #26 — no cloture code exists). The only supermajority anywhere is a DIFFERENT mechanism: the independence-era Continental-Congress path (`voteCC`, `continentalCongress.ts:224`) uses **2/3 of states under the Articles of Confederation**, else simple majority — that is era-specific and not the bicameral floor. **So: code = simple majority; the DESIGN question (should the Senate require 60% / a cloture step?) stays OPEN for the human** — the forum may want a supermajority/cloture the engine does not model. When the filibuster/cloture epic lands (debt #26 area), the human decides pass-vs-cloture and the constant lands there. |
| 28 | **★ NO meter-driven game-over path (batch 15 / #88) — the FIRST PROVEN loss state** | the ONLY game-over path is event-driven: `EraEvent.triggersGameEnd` (`types.ts:1476`) consumed at `phaseRunners.ts:2871` → sets `game.gameEnded` (`types.ts:1635`); `GameOverScreen` reads it (`App.tsx:341`) | There is NO per-event-phase game-end ROLL, no meter-watcher, no Honest-Gov→coup gate anywhere in the engine (grep-confirmed; the `pop` APOCALYPSE countdown clock — debt-adjacent §9.1.5 — is also unbuilt). `terror2000` is the **FIRST record of ANY game-over firing in the KB** (the 20%/event-phase "Autocratic Coup Ends America" roll, Honest-Gov at floor, `terror2000#POST 827, 829`). This resolves #88's "is it worth implementing?" — it FIRES and ENDS the game, resolving to the standard cumulative-score winner. **Build the per-event-phase game-end roll TABLE** (the `rep1800` enumerated set, game-mechanics §26.4): Standard Coup (DomStab≤2 & EconStab≤2, 10%), Economic Collapse (EconStab=1, 20%), **Autocratic Coup (HonestGov=1, ~20%/phase — CONFIRMED firing in modern)**, Enemy-Takes-Defenseless-US (MilPrep=1 & a power<Neutral), Civil-War/secession (DomStab=1). The terminal surface already exists; only the meter-driven trigger is new. **Reachable in the MODERN era** (Honest-Gov is far easier to crater than late-game MilPrep). **S.** Pairs with the APOCALYPSE clock (§9.1.5) + §22.1 meter bank. |
| 29 | **★ War engine has no DEFEAT loss package + no multi-phase model (batch 15 / #152)** | `runPhase_2_7_2_Military` (`phaseRunners.ts:3593-3627`); end-war check `:3615-3620` | **Same site as debt #16** (split out for the planner). The resolver ends a war at `warScore ±50` but the defeat branch (`:3618-3620`) is a bare log line — NO loss package. The new build surface: officers −1 Mil + −1 all-elections; **President −1 ALL future elections** (the symmetric inverse of the victory "permanent President +1"); Party-Pref crater. Plus wars must carry across half-terms through named phases (naval→ground; Afghanistan→Phase II). **Folds into the generic war engine (Phase-1 #3 / #56/#106) — M, not a new epic.** This completes DH-47 ("wars never resolve"). game-mechanics §21.1. |
| 30 | **★ Cabinet pick is a flat scored pick — no enthusiasm channel, no fairness/diversity penalty (batch 15 / #124+#151)** | `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) | **Same site as debt #24** (no Senate vote) — the cabinet→enthusiasm rework (#124, batch-12 E16 re-scope) is SHARPENED to Ted's LIVE-retuned **3-state upset/fine/happy** model (per-faction satisfied-wants → fine(0)/happy(+1)/upset(−1) @20%/10%; one roll/faction; same-ideology factions stack; ±3 cap — fixes the "Mods +18" stacking bug, `terror2000#POST 486-489`). PLUS two NEW **Era-of-Terror-gated** scored checks: **#151 same-party appointment-FAIRNESS penalty** (−500 pts per slighted same-party faction incl. the Pres's own; fired LIVE twice) + the **cabinet-DIVERSITY penalty** (−2 enth to Civil-Rights/Reformist/LW-Activist factions if <25% women/minority in cabinet+cabinet-level). All three are a §27.1 era-BAND RULE delta. **Re-scope E16 to bundle confirmation + 3-state enthusiasm + #151 fairness + diversity; M+S.** #124's designer-gated %s now mostly resolved by the live tuning. game-mechanics §9.3.7 + §9.3.9. **★ Batch-19 provenance: `fixes2022` is the EARLIEST source for #124** — the cabinet/legislative enthusiasm-swing cap + lobby-stacking asymmetry (Cal's +14-swing / net-0 swing-of-4-8, `POST 659-670`) AND the Integrity/Controversial 100%→10-20% confirmation-inflation fix (`POST 883-907`) — designer intent from the start; build-confidence bump, no scope change. game-mechanics §30.10. |
| 31 | **★ Command-gain not doubled + no centralized vacancy-fill ladder (batch 15 / #153/#154)** | `addCommandPoint` (`abilities.ts:33`, flat `amount`); `vacateOffice` (`phaseRunners.ts:2446`, nulls the seat); ad-hoc SCOTUS fill `:3661` | #153(a): rookie Command=0 ALREADY ships (`phaseRunners.ts:216`), but **every Command-gain % must DOUBLE** (Ted official, `terror2000#POST 91-93`) — `addCommandPoint` has no global ×2 knob (all callers pass `1`/a const). #153(b): "rolling a held expertise grants nothing (no re-roll)" is **already the helper behavior** — `addExpertise` (`expertise.ts:5`) dedupes and no caller does random-pick-then-reroll; it is a forward-only INVARIANT for any future RANDOM expertise grant. #154: a 4-step **vacancy-fill ladder** (same-party-CT → same-party-unemployed → other-party-CT → other-party-unemployed) is UNBUILT — there is no centralized filler. **Slot into the draft/Command + appointment-ladder consistency work (#115a/#115b). XS (#153 knob) + S (#154 ladder).** ★ **Batch-17 PROMOTES the #153 knob to build-with-confidence** — it is now 3-source canonical (terror2000 / tedchange / ted1772) and was demonstrated LIVE producing an emergent President (St. Clair, 0-Command CPU pol). The ×2-knob is no longer a "maybe" — it is the load-bearing lever that makes Presidents reachable; build it. The Command-gain SITES the ×2 must wrap include `constitutionalConvention.ts:158,168` (Father/Federalist `command+1`) + the RevWar Military-Leadership grants. game-mechanics §4.1.y + §29.4(a). **★ Batch-19 provenance: `fixes2022` (Fall 2022) is the EARLIEST source for the #153 no-reroll-on-held-expertise rule** (vcczar adopts Ted's house rule Mar 2023, `POST 581-583, 645-650` — predating terror2000/tedchange/ted1772) — designer intent from the start; build-confidence bump, no scope change. game-mechanics §30.10. |
| 32 | **★★ CPU has NO anti-game-over / anti-peace bias — a SOLO-game-ender; ESCALATED (batch 21 / #158): the flat-75% patch is FIELD-FALSIFIED** | terminal off-ramps are `EraEvent.triggersGameEnd` (`types.ts:1476`, consumed `phaseRunners.ts:2871`); AI resolves them via `pickAIResponse` (`eraGraph.ts:88-103`); the CC/Congress OVERRIDE path (`continentalCongress.ts` `voteCC` + `decider:'cc-president'`/`congress` resolution) | `pickAIResponse` is a plain `aiBias`-map lookup keyed by faction personality with **NO anti-game-over term whatsoever**, and the consumer at `phaseRunners.ts:2871` just sets `game.gameEnded` with **NO veto and NO plurality guard** — so a CPU-controlled terminal peace node (the 1772 `lost_war`/`dominion_autonomy`/`confederation_remains` nodes + the Carlisle/Conciliatory chain, `eraEvents1772.ts:296,308` + `:227,184`) resolves by ordinary point-math, which leans FOR peace. In a mostly-CPU 1772 game this **ends the solo game prematurely** — the marquee `ted1772` finding. Ted patched it LIVE: **"CPU factions oppose automatic game-over decisions 75% of the time, independent of all other considerations"** (`ted1772#POST 638`). **★★ BATCH-21 ESCALATION (`cpufull` — 2nd live CPU game-over in the KB, the first playthrough to reach a scripted ending): the flat-75%-oppose patch was APPLIED AND THE GAME STILL ENDED** (`cpufull#POST 62-68, 73`) — *"75% to vote no, but four factions triggered it"* (2 rolled 1/100, 2 rolled 9/100 ≤ the 25 support threshold); after the CC-President's reject was overridden a **4-5-4 plurality** carried the game-over. With 10 independent 75% rolls ~2.5 factions defect every time, so the flat per-faction roll does **NOT** reliably hold; `ted1772`'s near-misses survived only via the 2/3 Articles threshold (RevWar floor #2), which the **plurality-override path bypasses entirely**. **The fix (re-scoped — the flat 75% roll is no longer recommended):** EITHER **(a) a HARD VETO** (in a solo/CPU-majority game, `triggersGameEnd`/surrender responses are removed from the CPU vote menu / unselectable) OR **(b) a points-based anti-peace ideology bias** tuned so a CPU plurality can't form — **PLUS, either way, a non-plurality-overridable game-ending-peace guard** (the Pres's reject must not be beaten by a mere plurality; a separate guard on the override path). **S–M** (the veto/bias is S; the override-path plurality guard adds the M part). **This is a SOLO-PLAY BLOCKER (the DH-29-of-the-CPU/war-track) and ONE OF THE THREE RevWar floors (debt #34a below — floor #3, now known LEAKY) — build it WITH the #155 war-balance pass (E3) AHEAD of the rest of the CPU/war track** + the #75 CPU event-vote handler (E9). Bears on #114 (solo-app). game-mechanics §13.2 (the STRENGTHENED #158 block) + §21.1 + §25.7. **★ Batch-19 provenance: `fixes2022` is the EARLIEST source for the CPU anti-game-over rule (#88/OC-3/#158)** — the Carlisle Peace Treaty episode + vcczar's *"if a decision will result in the game automatically ending… the CPU will vote nay 75% of the time"* (`POST 622, 663`), predating `ted1772` #158 by ~a year — designer intent from the start. game-mechanics §30.10. |
| 33 | **★ Constitutional-Convention is a superset SKELETON — the per-article voting machine + ahistorical-consequences are unbuilt (batch 17 / #159)** | `constitutionalConvention.ts` — `makeConvention` (`:6-77`, 7 articles), `autoFillCPUVotes` (`:81-100`, single CPU-consensus pass), `applyConvention` (`:127-213`, ratify at `approve>=9` `:192`, era→federalism `:198`) | The shipped ConCon is a **reasonable superset skeleton** (7 binding articles + CPU auto-fill + 9-state ratify + Father/3-Federalist-authors + era transition). **UNBUILT (the new build surface):** (i) the **per-article propose → debate-sway → 2/3-of-states vote → eliminate-lowest-and-revote** loop (shipped does ONE auto-fill, not the elimination loop); (ii) **gov-sends-3-delegates (2 own + 1 opposition, ≥1 Legis)** seating; (iii) the **random-egghead drafter** (shipped picks highest-PV delegate as "Father" at `:154`, not a random egghead); (iv) **debate-sway by traited delegates** per article; (v) **the slave-compromise plank → a per-state EV modifier** (slaves-don't-count → seceded-South GA −5/SC −5/NC −3/VA −3, floor 3) — shipped stores `slaveCompromise` as a string with NO EV consequence and sets EV flat at `:208-211`; (vi) **threshold-amendable** amendment plank (#100); (vii) **Judiciary-Act-sets-SCOTUS-count**. The EV-penalty plank + the elimination loop are the two highest-value extensions. **M–L — largest new build surface this batch; EXTENDS the shipped file (founding-era content, not a new scenario). Folds into the founding-boot / E1 surface.** game-mechanics §17.3.y. |
| 34 | **★ FL-on-death replacement DEFERS (ruled IMMEDIATE) (batch 17 / FL-on-death fork RESOLVED)** | `cleanupLeadershipAndProtegeChains` (`phaseRunners.ts:2304-2312`) nulls `f.leaderId`+`leadershipStartYear`; the vacant-seat election is the 2.2.3 "invalid → Step 2 Election" path (`runPhase_2_2_3_FactionLeaders`, `phaseRunners.ts:1975-2009`) | On a faction-leader's death, the cleanup nulls the seat and the successor is NOT elected until the next 2.2.3 sweep — the seat sits empty for a turn. Ted reversed his own initial "empty-until-next-phase" ruling LIVE: **"New rules dictate that dead faction leaders are immediately replaced"** (`ted1772#POST 624`; the 1840-GA already did it immediately, POST 429). **The fix:** factor the 2.2.3 vacant-seat election body into a reusable `electFactionLeader(snap, f)` helper and call it immediately from the death cleanup, instead of deferring. **S** (small refactor — lift the election body and invoke it at death time). Distinct from the #61 Presidential-succession chain (debt-adjacent §9.2 row) — this is the FACTION-leader seat. game-mechanics §10.1 + §8.3. |
| 34a | **★ The three RevWar winnability floors — a HARD CONSTRAINT on the #155 war-balance pass (batch 17 / #155)** | `revolutionaryWar.ts` — floor (1) SHIPPED: `applyFrenchAlliance` (`:268-270`) + the void-loss-cap `currentGroundLosses >= groundLossesRemaining && !war.frenchAlliance` (`:259`); floors (2)+(3) NOT built | `ted1772` is the cleanest fresh-start RevWar trace: the war was GENUINELY losable (War Score −2, ~20% loss-rolls, the Navy won ZERO battles, the Canada side-war lost outright at 80%) and stayed winnable ONLY via **three floors: (1) the French-alliance unloseable flag** [SHIPPED, preserve exactly]; **(2) the 2/3 Articles-of-Confederation peace-vote threshold** [NOT built — terminal peace lives only as `triggersGameEnd` events with NO vote gate; a 5-4 = 55.5% MAJORITY for peace FAILED, so 55.5% must NOT pass]; **(3) Ted's 75% CPU-anti-game-over rule** [#158 / debt #32, NOT built]. **The constraint:** when the #155 pass adds the enemy-strength term + battle-size weighting + the Officer-Mil-share cap + per-theater scoring (from `hd1`, batch 16, debt #16/§9.1.12), it MUST be bounded so a 1772 game with all three floors intact still stays winnable. A war engine tuned hard enough that a 1772 game loses before 1788 WITH the floors is over-tuned. **No size of its own — it BOUNDS the #155/#152 work on the generic `War` model (E3).** game-mechanics §21.1 (the #155 HARD CONSTRAINT block) + §17.4 + §23.3. |
| 35 | **★ Founding-era dataset wrong-century collisions; no build-time validation (batch 17 / DH-65)** | merge/disambiguation in `legislatorsToDataset.mjs:276-302` (`ERA_SAME_PERSON_WINDOW = 25`); `TRAIT_CONFLICTS` (`types.ts:675-676`) | **DH-65(b) — the ENGINE exclusivity is already SHIPPED:** `TRAIT_CONFLICTS` maps Cosmopolitan ⊕ Provincial mutually-exclusive and `addTrait`/`tryGrantTrait` (`engine/traits.ts`) enforce it; the current generated `public/standard-draft-classes.json` has **0** both-held pairs (verified: 18,561 pols, none hold both) — the live forum both-held was a spreadsheet artifact, NOT a code bug. **DH-65(a) — the real TODO:** the merge disambiguates same-name people by a ±25-yr birth-window heuristic but does NOT validate the founding-era (1768-1776) pool for wrong-century entries, and there is no build-time assertion gate. **The fix:** a `scripts/seedDataset.mjs` CURATED_ROWS audit over the founding window + a dataset-build validation pass that flags same-name-wrong-century collisions, then regenerate. **XS — joins the #120 dataset-umbrella pass (same class as DH-64's `Southern Unionist` fix, debt-adjacent §9 batch-16 (5)).** game-mechanics §4.1.z. |
| 36 | **★★ NO interwar economic engine — no Great-Depression META-event, no EconStab→industry cascade, no crisis-gated bills (batch 18 / #160)** | `Era` 4-value enum `types.ts:1337`; generic `meters.economic:number` `types.ts:1401` (UI band names incl. `'Depression'…'Recession'…'Roaring'` `Meter.tsx:15`); era-event runner `runPhase_2_4_3_Era` `phaseRunners.ts:2796` (+ `triggersGameEnd` consumer `:2871`) | **This is the SECOND era to want the E4c economic-engine epic** (after `arkzag`'s Bank-War / Panic-of-1837, debt #116/§9 batch-11) — so E4c is now well-specified ACROSS TWO ERAS. grep `economicStability|greatDepression|econStab|requiresCrisis|requiresCrash` in `src/` = **ZERO** hits; the only economy token is the generic `economic` meter (its bottom UI step is literally `'Depression'`, but no logic). **The new build surface (all ON TOP of the E4c `game.economy` machine):** (i) a **Great-Depression META-event** = one era-event row with a multi-meter shock bundle `{economic:−4, revenue:−2, quality:−1, military:−1, partyPref:−3}` + the (a)-markets-resolve / (b)-welfare-bailout presidential decider (NB the −4 EXCEEDS the §21.8 ±3 swing cap — flag as a meta-event override); (ii) the **EconStab→Recession cascade** = 2 random industries −1 in EVERY state → an **EV-reflow roll** (couples to §11.5 industry-leadership + §28.9 census/EV) + a DomStab-drop chance + EconStab-in-Recession **gates other meters' gains**; (iii) **crisis-GATED bills** = `Bill.requiresCrisis: 'economic'` (Fed-currency-in-crisis / worker-bailout invalid until the crash fires — binds E2's Bill-type taxonomy). **M as an E4c extension** (meta-event+decider S; cascade M; the crisis-gate flag reuses E2's crisis-bypass primitive). **Depends on E2 (Bill.type/crisis) + E6 (named EconStab + crisis/cascade) + the E4c `game.economy` machine.** game-mechanics §29.7.1. |
| 37 | **★★ DH-67: the era party-modifier bias is STATIC, decoupled from the crash event — the central #160 takeaway (batch 18)** | the `partyPref*5` term feeding `calcStateVote` (`phaseRunners.ts:3709-3711`); the era-band bias source (a static per-era constant today, the same family as `State.bias` debt #34/DH-34) | **The era's BLUE-favorable party-preference bias fires REGARDLESS of whether the Great-Depression event has fired** → the GOP cratered in the 1930 midterms WITH A HEALTHY ECONOMY (crash not yet fired; the Red losses were legislation penalties, NOT a depression). GA balance verdict (ch18 POST 8): *"these era bonuses are SUPER STRONG… maybe too large… the Depression wasn't nearly as bad."* **The fix (Umbrella, POST 545):** EVENT-GATE the era's BLUE party-modifier bias to the crash event having fired — read a `game.crashFired`-style flag set by the meta-event (debt #36) instead of an unconditional era-band constant. **S — and the HIGHEST-VALUE single fix in the batch** (the switch that makes the whole crash meta-event load-bearing instead of cosmetic-on-top-of-a-static-band). **Build it WITH #160 (debt #36 / E4c extension).** game-mechanics §29.7.1(f). |
| 38 | **★ Cabinet confirmation auto-pass gate UNBUILT — a real fix for the §25.5 36%-pass CPU pathology (batch 18 / Ted ruling)** | `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`): flat scored pick → `cabinet[seat]=pick.id` `:2191` + `addLog("confirmed as ${seat}")` `:2198`, NO Senate vote / NO Controversial gate / NO skill threshold; `'Controversial'` trait exists `types.ts:103` | **Same site as debt #24 (no Senate vote) + #30 (no enthusiasm channel).** Ted's AUTHORITATIVE rule (RULED in-thread, `ideo1928#POST 213-214`): ALL nominees AUTO-CONFIRM **EXCEPT** {State / Treasury / AG / Defense} OR Controversial OR <3 relevant skill (unless Integrity); Senate-Majority-Leader-with-Iron-Fist can force a vote on any. This DIRECTLY fixes the `drums` §25.5 pathology (only **36% of 88 nominees passed** — CPU over-rejection) by ensuring **most picks never REACH a vote** (the contested-pick path then routes through E9-handler-9d's CPU Senate vote). **S — a DESIGNER ruling** (not a GA call). **Folds into the E16 cabinet rework + E9 handler 9d** (the confirmation surface both already scope; this is the auto-pass GATE that fronts the vote). game-mechanics §25.5 + §30.9. |
| 39 | **★ Diplomacy roster is era-keyed; the subsystem is unbuilt (batch 18 / #162; corroborates #107/DH-59)** | `'Ambassador'` is ONLY a cabinet `Office` seat type (`types.ts:1134`); NO `foreignRelations`/nation-roster state; meters clamp `-5..5` (`applyEffect` `phaseRunners.ts:3223`), not the 9-point Hostile→Allies scale | The 1928 thread exercises a **7-nation roster** (UK, France, Spain, Germany, Russia/Soviet Union, China, Japan — **no Israel yet**) with per-nation relation meters + a per-nation Ambassador + ambassador actions (Increase Relations/Trade, Extend Credit/Take a Loan). **Folds into E12 (the 9-point relations scale + ambassador-actions library) as an ERA-KEYED nation list** (5→6→7→8 by era; Japan in by 1928, Israel only at the modern boundary). **The #56-negative result is a SCOPING NOTE, not a row:** the Republicanism/Fascism/Communism framing is event-text FLAVOR not a mechanic, and the looming WWII did NOT trigger the war engine (#56) in the captured span — this batch corroborates diplomacy but does NOT exercise the war engine. **S–M within E12 (the era-keyed roster table); the war-engine non-trigger is a no-op.** game-mechanics §13.3.1 + §24.7. |
| 40 | **★ #165 EconStab/event effect-sign + `auto\|roll` ambiguity — a SHARED fix with DH-53 (batch 18)** | event-effect application path; `EraEventResponseEffect` (`types.ts:1448`, no structured/typed effect) — same surface as DH-53's bill-effect tables | The **"Major Earthquake" aid** option read **"+Rev/Budget"** but should COST money (Ted: *"happens a lot… half a dozen laws in the revolutionary era where it gains money when it should lose money"*, POST 814-815) + general events were inconsistent on auto-apply-vs-roll (POST 243, 809). **This corroborates the per-bill effect-sign bug DH-53 from an EVENT angle.** **The fix = the SAME structured, sign-audited effect tables DH-53 already needs, plus an explicit `auto | roll` flag** — extended from bills to events. **No standalone work — folds into the DH-53 structured-effect-table work** (Phase-1 #20 + K4 / the bill-catalog + era-content work). game-mechanics §29.7.1(g). |
| 41 | **★ #166 per-faction industry-impact AUTO-TALLY + per-era meter-table versioning (batch 18)** | the §11.5 industry-leadership scoring surface + #51 legislation scoring; meter tables are not era-versioned today | Legislation scoring + the EconStab cascade (debt #36) both need a **per-faction "how many of my gov/sen/rep are in each lead-industry" tally** (every gov/sen/rep from a state whose lead industry is hit — by a bill OR the cascade — loses points; this drove the 1930 "Red bloodbath" BEFORE the crash, POST 446). A player built an **"Industry test sheet" auto-calc tool copied across playtests** (POST 450-457) — the build must OWN this bookkeeping (manual = GM-burnout fuel, DH-36). **Plus a meter-version-drift hazard:** the live sheet used an out-of-date meters template (POST 783-792) → **the build must VERSION the meter tables per era** (a §92 era-keyed-content fidelity hazard). **S — folds into the economic-engine / industry-scoring work** (debt #36 + #51); the meter-versioning is a K4 era-content validator. game-mechanics §29.7.1(h). |
| 42 | **★ #163/#164 career-track pre-placement + mid-gov start-state (batch 18) — BOOT; folds into DH-25 + K4 BootSheet** | the draft/career-track path (DH-25 family); the K4 `BootSheet` start-state field (no precedent today) | **#163** the GA pre-placed randomized statesmen onto career tracks at game start (by draft-cohort + ability) to fix the "generational pols stuck at floor stats" problem (the Buttigieg problem, POST 32-41) — a GA house rule, NOT designer-authoritative; **joins the DH-25 career-track-bootstrap PARKING LOT** (already BLOCKS the modern scenario). **#164** the inaugural-cabinet-holdover question (election-start vs president-in-place vs president-with-historical-cabinet, POST 184-188; Ted: *"I don't know that we've ever landed on a solid answer"*) is the **unsettled mid-government start-state model** — fold into the K4 `BootSheet` start-state field; players favor president-in-place but it is **human-gated**. **XS each once the rules are authored; both are BOOT-pipeline (K4) items.** game-mechanics §26.1. |
| 43 | **★★ NO no-eligible-successor constitutional-crisis subsystem — #167, the ONE new mechanical gap (batch 19 / `fixes2022`); FOLDS INTO E10b; reuses #62** | the vacancy site `vacateOffice` (`phaseRunners.ts:2446`, sets `presidentId = null` at `:2449` with NO successor path); `vicePresidentId` (`types.ts:1568`) exists with no eligibility/line gating; **grep `successionCrisis\|actingPresident\|emergencyCongress\|coup` in `src/` = ZERO hits** | The fallback the rest of §24.1 does NOT cover: a President dies/resigns with **no eligible successor at all** (empty VP + no installed third-in-line, or every line member ineligible) — distinct from #61 (the normal VP-succession line) and #62 (the no-EC-majority contingent ELECTION). vcczar + Ted hammered out the full procedure (`fixes2022#POST 841-882`, designer-authoritative). **The build surface (a new `game.successionCrisis` flow off the vacancy path):** (i) an **emergency-Congress agenda-locked-to-succession-laws** vote loop (random-FL proposer, CPU auto-support, **auto-signed/un-vetoable**, loops until pass); (ii) a **House 1-vote-per-state acting-President election** between the two party leaders (ineligibility→highest-PV-eligible-FL cascade; CPU party-line except Integrity→incumbent-party, Can-Be-Independent→closest-ideology; tied state abstains; state-count tie → SCOTUS/game-over); (iii) a **DomStab penalty scaled 0/−1/−2/−3** by outcome legitimacy; (iv) a **coup branch** (Controversial+LW/RW-Pop OR Military Leader → 3.0.2 coup rules → possible game-over, same end-condition family as debt #28). **★ Step (ii) is the SAME 1-vote-per-state delegation-majority machinery as the #62 contingent House election** (debt-adjacent §9.2) — **build #62 once, reuse for both.** **★ SHIPPABLE-FIRST: the interim PPT-as-acting-President default** (`POST 849-850` — the PPT becomes acting President, then resigns from Congress) ships FIRST; layer the full House-election procedure later. **Couples to #61 (succession line) + #88/debt #28 (anti-game-over CPU bias) + DH-54/DH-33/DH-66 (impeachment) — treat all as ONE E10b constitutional-crisis family.** **Size: M for the full procedure (Step-ii reuses #62); S for the PPT-interim default alone.** **★ `fixes2022` is the EARLIEST source** (predates terror2000/ted1772/oopscpu — designer intent from the start). game-mechanics §24.1.2 + §30.10. |
| 44 | **★ NO era-event firing-rate budget — the one OPEN era-event piece (batch 19 / `fixes2022`); small, folds into the era-event epic** | the era-event runner `runPhase_2_4_3_Era` (`phaseRunners.ts:2796`) + `buildEraEventsForYear` (`eraEvents1856.ts:4`, gates ONLY by `year >= X && year <= Y`) — no per-era firing cap/budget anywhere | vcczar removed the old **"2-min / 8-max events per half-term"** cap (via an "Era Exit" column, then removed that too), intends a cap **">8"**; OrangeP47 flagged an **1840 log-jam** (only ~25% of an era's events fired by era-end) and wants a **dynamic limit so ~70% fire per era** (`fixes2022#POST 114-123`). **The era-event system has NO firing-rate model today** — events fire purely by year-window. **The fix is a dynamic per-era firing BUDGET** (target ~70% of an era's events fire), NOT a fixed cap. **Small addition to the era-event scheduling epic (E15 / divergence #4)** — the SAME scheduling surface as BUG-1 + the late-start boot-filter (`POST 413-423`, INTENDED, also corroborates #92). The scripted-event BUILD-OUT this thread carries is **CORROBORATION of the shipped `EraEvent` model** (`types.ts:1466` — `responses[]`/`Predicate`/`addPolitician` all support the Shaw/John-Brown removal + demographic-gated-entry patterns), **NOT a gap.** **S.** game-mechanics §10.4.6. |
| 45 | **★ NO mid-campaign presidential-replacement event — #169, the ONE new runtime mechanic (batch 20 / `biden2021`); small addition to the era-event epic (E15)** | the presidential general resolver `runPhase_2_9_4_PresidentialGeneral(snap, blueCand, redCand)` (`phaseRunners.ts:3752` — takes the ticket candidates as params, no drop-out/swap path); `vicePresidentId` (`types.ts:1568`); the age roll it gates on = `ABILITY_LOSS_RULES.oldAge` decay (`minAge: 70`, `types.ts:521`, fired at `phaseRunners.ts:2384-2393`) + `MORTALITY_RULES` death/retire brackets (70/80, `types.ts:488-498`); **grep `dropOut\|replaceOnTicket\|endorseVP\|midCampaign\|forcedOut\|stepAside` in `src/` = ZERO hits** | The "Elderly President Drops Out → endorses VP" event (the Biden-2024 → Harris analog; vcczar, `biden2021#POST 20, 28`): an `EraEvent` firing during an aged incumbent's reelection that (1) gates on the president having been **hit by the existing age roll** (the 70-keyed old-age decay roll, `:2384`; NB the digest's "70/75" — the candidate-relevant roll is keyed at **70**; 75 is the separate SCOTUS retire roll `:3655`) AND running for reelection; (2) **50% pull** from the ticket; (3) a flat **−1 party election malus** that **lands on the VP even when the pres is pulled**; (4) the VP **replaces the president on the ticket** (NOT an open convention) — i.e. swap `blueCand`/`redCand` to the VP inside the `runPhase_2_9_4` candidate flow and inject the −1 into the §21.9 presidential-vote modifier stack; (5) a fallback to the pre-primary/compromise-candidate convention machinery if the VP can't/won't step up, with a pre-12A "designate a successor" path. **Guards (designed, unsettled):** a VP-younger-than-pres check; an alternative stiffer trigger (80+ / Frail-Easily Overwhelmed-Incoherent / older-than-VP / Party-Pref-against). **Era-of-Populism-scoped until it fires twice** (the twice-before-generalizing rule). **Distinct from #37/debt #29 (defeat-then-retire / war-defeat President malus): #169 removes the candidate DURING the campaign, not after a loss.** The age-roll substrate ALL EXISTS; the ticket-swap + the malus + the VP-replaces flow are NET-NEW. **Size: S — a small addition to the era-event epic (E15) (or the election epic E20b).** game-mechanics §10.4.7. |
| 46 | **★ #168 PROCESS/AUTHORING-quality pass — NOT a runtime feature (batch 20 / `planb`)** | NO code surface — it produces a **terminology contract** the build must honor + audits the AUTHORED content (datasets + the legislation/event/gov-action catalogs the era-content epics consume); it pairs with the `scripts/seedDataset.mjs` author-time pipeline (§7) + the #120 dataset umbrella | The Plan-B non-coding slate's pre-coding cleanup, logged as a **quality bar the build inherits**, not a code epic: (a) a **canonical terminology contract** — ideology short forms (`LW Pop / Prog / Lib / Mod / Cons / Trad / RW Pop`, matching the 7-point scale at `types.ts` / CLAUDE.md); the Skills/levels/Experience/Interests vocabulary buckets; the **military-Experience → "Army" rename** (incomplete across the data — "Army" is mislabeled as a starting expertise, should be Military); **human-rights → "criminal reform"**; demographic-category standardization (add Middle Eastern ethnicity; drop no-op Protestant/White defaults). (b) the **branch-path / meter-direction / percentage-multiplier sanity audit** (+budget meter must move + when it makes money [= the DH-53 effect-SIGN family]; the Afghanistan-War-Phase-I multiplier; alt-state event enter/exit columns swapped; legislation repealability; the half-broken Split-Electoral-Votes gov action). (c) the **trait/interest compilation** (how each is gained + what each does). **This is an authoring-process GATE, not a roadmap code task** — it standardizes + audits the content the era-content/dataset epics (#120, the #92/§28.13 modern band, the bill/event catalogs) consume. **Governance: all changes go through vcczar (`planb#POST 37`); content/authoring work proceeds CHRONOLOGICALLY because Anthony imports pols/events in chronological order (`planb#POST 72`)** — a sequencing constraint on ALL content authoring, not just this pass. Mark **PROCESS/authoring (no engine size).** game-mechanics §30.11.2. |
| 47 | **★ #170 era-keyed offices/departments — PARTLY SHIPPED (founding seats), DESIGNED (modern offices + DNI⇒CIA supersession) (batch 21 / `trump2024`+`nixon1972`)** | **SHIPPED half:** `cabinetSeatsForYear(year)` (`types.ts:1196`) era-gates the seat list — `[]` < 1789; +Navy `:1203` (≥1798); +Postmaster `:1206` (≥1829); +Interior `:1205` (≥1849). **UNBUILT half:** `OfficeType` (`types.ts:1111-1134`) has NO modern departments; **grep `DNI\|CIADirector\|DepartmentOfEnergy\|HomelandSecurity\|supersedes\|foundedYear\|createdByBill` in `src/` = ZERO hits** | The founding-seat era-gating #170 wants is **already live** (game-master-confirmed). What's missing: extend `OfficeType` with the modern departments (Energy 1977 / DHS 2002 / DNI 2004 / Commerce / Labor / HHS / HUD / Transportation) + add a per-office existence table (`foundedYear`, optional `createdByBill`, optional `supersedes`) + the **DNI⇒CIA-Director SUPERSESSION** (Ted-authoritative, `trump2024#POST 40-41`: *"DNI replaces CIA Director in game when it's created"*; corroborated by `nixon1972` DOE/DNI-don't-exist-in-1972 + `terror2000` DNI-created-2004). **The seed table seeds only offices whose founded-year ≤ the board's start year (or that a bill created).** **★ This is the SAME mutable-cabinet-seat refactor already planned** (`cabinetSeatsForYear` → boot-seed `GameState.cabinetSeats: SeatSpec[]`, §3 item 2; confirmed the WRONG long-term model at BOTH ends, §24.6 + §26.5) — #170 is the era-keyed-EXISTENCE + supersession layer ON TOP, NOT a new epic. **S–M; folds into E16 + the scenario-boot work.** Open Q: real distinct DNI/DHS seats vs the CIA-Director overload (designer call). game-mechanics §9.3.1.1. |
| 48 | **★ #171 era-keyed draft-ideology TOGGLE (ON early/realigning, OFF modern present) — DESIGNED, not built; folds into the #4/#108 draft-profile work (batch 21 / `trump2024`)** | the shipped draft `runPhase_2_1_1_Draft` (`phaseRunners.ts:107`) picks via `pickBestForFaction` (`:33`) by PV + ideology-bucket match (`:46-49`) — **NO era-keyed ideology-restriction profile at all** (the #4 profile + off-profile 30/50% rolls are themselves designed-not-built) | Designer-authoritative (Ted, `trump2024#POST 9, 14, 15-16`): *"There are no draft ideology restrictions for the future/present timelines… You get to make your own faction"* — the FIRST playtest with no draft-ideology restrictions. The restriction is **era-keyed**: ON in early/realigning eras (the #4 profile + off-profile rolls + adjacency-on-exhaustion are the engine's tools for *forcing* the §28.4/#108 realignment), OFF in the modern present (the sort is already complete by 2024). **The fix:** when #4 is built, gate it behind an **era-keyed toggle** (`eraDraftIdeologyRestrictions: boolean`, or derived from realignment-completion state) so the modern present runs it OFF. Faction-leader eligibility (#110) still applies. **★ Keyed to REALIGNMENT COMPLETION, not a calendar year** — three batch-21 start years bracket it (1916 ON · 1972 ON [off-ideology >50, exhaustion→adjacent, `nixon1972#POST 109-120`] · 2024 OFF). **S; folds into the #4/#108 draft-ideology-profile work** (no standalone epic). Open Q: the exact ON→OFF boundary. game-mechanics §4.1.w. |
| 49 | **★ DH-68 Progressive-era successor-state Era Evos lack a WWI-end prerequisite (a wrong-ORDERING bug; corroborates DH-60, now multi-era) — DESIGNED-content bug (batch 21 / `solo1916`)** | the 1772 graph HAS the precondition machinery (`Predicate` `types.ts:1487`; `evalPredicate` `eraGraph.ts:12` interprets `eventCompleted` `:18`, `warActive` `:31`, `warOutcome` `:32`); the **1856 builder `buildEraEventsForYear` (`eraEvents1856.ts:4`) is CALENDAR-ONLY** (`year >= X && year <= Y`, e.g. `:6`,`:30`) with **NO `precondition` field on any row**; **no Progressive builder exists** | In a 1916-start half-term the Czechoslovakia/Hungary independence Era Evos fired BEFORE WWI ended, in the same phase as the WWI-entry decision (`solo1916#POST 31, 34`: *"These two should not trigger until after WWI is over"*). **This is exactly DH-60's gap, codebase-confirmed: the two era-event builders DIVERGE** — 1772 gates correctly (the Carlisle game-over chain gates on a prior `chose`; the Treaty of Paris gates on `warOutcome`), the 1856 builder cannot gate on a prior event at all. **The fix:** add a WWI-end predicate (`worldWarOneEnded`/`eventCompleted:'wwi_end'`) to the successor-state nodes (+ League of Nations, post-war treaties) and **port the 1772-graph `precondition` layer into the 1856/Progressive builders.** Same selective-precondition ask as DH-60 (`dem1820`/`arkzag`/`smallbugs`) — now corroborated from the Progressive band, so **DH-60 is multi-era confirmed.** **S; SAME surface as BUG-1 + K3's `territoryOwned`; build with E15 + BUG-1.** Open Q: which other Progressive-band events need the gate. game-mechanics §10.4.8. |
| 50 | **★ #172 era-keyed cabinet/SCOTUS confirmation thresholds + Nuclear-Option default-state — UNBUILT (no confirmation/cloture/nuclear-option code at all); folds into E16 + E14c (batch 22 / `modernday`, Ted-authoritative)** | **grep `cloture\|filibuster\|nuclearOption\|confirmationThreshold\|requiresConfirmation\|senateConfirm` in `src/` = ZERO hits.** The cabinet runner `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a flat scored pick → `cabinet[seat]=pick.id` (`:2191`) + `addLog("…confirmed as ${seat}")` (`:2197`), NO Senate vote/threshold/nuclear-option gate; SCOTUS backfill `:3648-3671` likewise has no vote | **Same site as debt #24 (no Senate vote) + #38 (no auto-pass gate) + #30 (no enthusiasm channel) + #26 (no cloture).** Ted-authoritative (`modernday#POST 422-423`): *"for a 2016 start, Cabinet Members require only 50%+1… unless you repeal the Nuclear Option (otherwise permanently in place). Supreme Court nominees will continue to require 60%, unless you enact the Nuclear Option for that as well."* The Nuclear-Option DEFAULT is **era-keyed** (Reid-2013 + McConnell-2017 already fired by a 2016 start). **The build surface:** a `GameState.nuclearOption: { cabinet:boolean; scotus:boolean }`-style flag **seeded at boot by start year** (same `scenarioBoot`/`BootSheet` surface as #170, §3 item 2 / E16) → a **per-track confirmation-threshold** read in the cabinet runner (`:2158`) + the SCOTUS-nom path (`:3648`) + the **SML enact/repeal** ActionRegistry row + the **60→fail→10-vote-conversion→auto-confirm-a-Mod fallback** (`modernday#POST 602-603`). **★ It COMPOSES with already-scoped pieces — do NOT re-build them:** #124's auto-pass GATE (debt #38 — whether a vote HAPPENS) fronts the threshold; #52/E9 handler 9d (WHO votes aye) resolves the contested vote; #171 is orthogonal; and the batch-9 USER cloture decision (debt #27, Senate=simple-majority-in-code / design-open 60%-then-majority) is the SAME E14c cloture surface — the Nuclear-Option flag is the era-keyed DEFAULT on top of it. **Size: S–M** (boot flag + per-track threshold S; SML enact/repeal + conversion-fallback M; both reuse E16 + E14c). Open Q: boot-flag-vs-derived-from-cloture-bills (designer-gated within the epic). game-mechanics §9.3.10. |
| 51 | **★ #173 era-boundary-aligned starts — New-Game start-year PRESETS = the 14-band era openings; couples scenario-boot (#115); DESIGNED, not built (batch 22 / `modernday`, GM's own verdict)** | **NO start-year picker:** `NewGameScreen.tsx` hard-codes a two-entry `SCENARIOS` array (`:8-21`, `type ScenarioId = '1772' \| '1856'` `:6`); `startNewGame(factionId, scenarioId)` (`GameContext.tsx:264`, sig `scenarioId?: '1772' \| '1856'`) admits exactly those two boots — no era→start-year axis | GM's closing verdict (`modernday#POST 2964`): *"For any new test start date, it must be the date a new era begins. One of the issues we ran into with this test was it started in the middle of an era."* **The fix:** a New-Game **PRESETS table** keyed to the canonical 14-band era→start-year map (POST 2964: Independence 1774 / Federalism 1788 / Republicanism 1800 / Democracy 1820 / Manifest Destiny 1840 / Nationalism 1856 / Gilded 1868 / Progressivism 1892 / Normalcy 1916 / Ideologies 1928 / Nuclear Age 1948 / Neocons 1972 / Terror 2000 / Populism 2012). **★ This is a presets table ON TOP of the K4 `BootSheet`/`scenarioBoot` pipeline (#115, §9.1.9)** — each preset is "another scenario-as-data-row" (same pattern as `scenario1868`/`scenario1788`), GATED on `scenarioBoot` existing. UI delta is small (a presets grid on `NewGameScreen.tsx` instead of two hard-coded buttons); the WEIGHT is the boot sheets each preset points at (the existing era-content/scenario work). **Size: S** (the picker presets table; the boot sheets are existing scenario-boot work). game-mechanics §27.9. |
| 52 | **★ DH-70 `Lackey` trait over-weighted in PV — actually a "when ported, no special-case" note: pv.ts already gives every negative trait a flat −5 (batch 22 / `modernday`)** | `pv.ts:77` applies a **flat `−5` to EVERY negative trait** (`else if (NEGATIVE.includes(t)) total -= 5;`); **grep `Lackey` in `src/` = ZERO** — it is NOT a shipped trait | The digest flags a LW-Pop with only `Lackey` (+Obscure) at PV −47 ("Lackey shouldn't be that much worse than any other bad trait… just a formula issue", `modernday#POST 1939-1945`). **The shipped formula already treats all bad traits equally** (flat −5), so the over-weight the forum saw was a SPREADSHEET artifact, not the engine. **The fix when `Lackey` is ported: add it to `NEGATIVE_TRAITS` (`types.ts`) so it takes the SAME flat −5 — NO special-case.** **XS; pairs with #120 dataset-balance + DH-51 (modern-pol balance).** game-mechanics §3.4. |
| 53 | **★★ DH-69 NO in-app rules / legal-move surface — players wing it (onboarding/UX gap; serves the CPU cluster too) — STRENGTHENED batch 24: `rookie1772` is the strongest onboarding evidence in the KB (batch 22 / `modernday`; + batch 24 / `rookie1772` + `grass1772`)** | **grep `rulebook\|legalMove\|availableActions\|helpPage\|tutorial\|onboard` in `src/` = ZERO hits** (re-verified batch 24) — no rules page, no legal-move enumeration, no onboarding/help surface | Players (jnewt/ebrk85/Willthescout7) report never being given the rulebook/Discord and "winging it" (`modernday#POST 342-356`). **★★ Batch-24 — `rookie1772` is now the strongest single onboarding signal in the corpus:** a self-described rookie ("very basic sheet skills") trying to solo-run the most-complex era hits documented walls on phase-processing (`#POST 1`), invisible meter-prerequisites (`#POST 32-33` — the #176/row 56 caps), improvised phase-order (`#POST 31`), the heavy 1788 era transition (`#POST 2`), faction-count rules (`#POST 8`), trait-conflict resolution (`#POST 573-582`), and the headline **Lingering phase — "which I have never run before… more complicated than I expected"** after ~12 turns (`#POST 1370`, needs a teammate assist) — every wall is the in-app affordance the build must provide. **The fix is an in-app rules + legal-move surface** (a Rules page keyed by phase + an enumerator of the currently-legal actions). **★ It serves THREE constituencies:** onboarding (sharpens #115's boot-procedure gap — the rookie was given a wrong 1772/2020-hybrid sheet, `#POST 19`), the **CPU cluster** (a legal-move enumerator is the same primitive a CPU action-picker needs — pairs with K5/E9), and the GM-burnout theme (DH-36 family — less "ask the GM what's legal"). **★ Batch-24 makes this + #114/E9 the most strongly-evidenced UX/architecture items in the KB (NO new scope — it RAISES priority/confidence).** **UX/onboarding item, no engine size of its own; cite under the #115/CPU-AI work.** game-mechanics §29.1. |
| 54 | **★ #174 committee bill-shaping is a CHAIR-ONLY stub — no ranking-member counter, no packaging, no chair-add powers (batch 23 / `pop2012b`, the fullest packaging spec in the KB)** | the committee runner `runPhase_2_6_2_Committee` (`phaseRunners.ts:3463-3496`) reads ONLY `snap.game.committeeChairs[bill.committee]` (`:3476`) → sets `passed_committee`/`killed_committee` per-bill; **grep `rankingMember\|packageOf\|chairBlock` in `src/` = ZERO**; the committee STATE is chair-only (`GameState.committeeChairs: Partial<Record<…, string\|null>>` `types.ts:1583`; same for `ContinentalCongress.committeeChairs` `:1350`) — **no ranking-member entity, no package structure, no per-bill block/add ledger** | **The fullest committee-packaging spec captured anywhere** (`pop2012b#POST 724, verbatim; MrPotatoTed-area). On TOP of the still-unbuilt #8/#9 chair-block/package, it adds: **(a)** a **Ranking-Member (always opposing party) un-package / repackage counter** firing under any of **5 trait gates** (Efficient+crisis-trait on a matching crisis bill / higher-Legislative-than-chair / Manipulative-vs-Pliable-or-Predictable-chair / Iron-Fist-vs-Passive-chair / Magician-with-equal-Legislative); **(b)** two **chair-add-bill** powers (5 Legis+Efficient → add a tax/income-tax/tariff to ANY package even off-committee; 5 Legis+Magician → add one extra off-topic proposal); **(c)** **cross-chamber + cross-committee packaging FORBIDDEN** (the chair-add-tax is the lone off-committee exception) + a **Puritan committee-voting rule** (never votes for/against anything that (de)scores its own ideology; on conflict, ignore the Puritan rule for that bill). Makes committee bill-shaping a **chair-vs-ranking-member duel** at two pipeline points (chair block/replace/package/add → ranking-member un-package/repackage → committee vote with Puritan abstention → §12.5 floor). **Binds in the committee runner (`:3463`) + needs `committeeChairs` to grow a ranking-member field + a `Bill.packageOf?: BillId[]` package structure.** **★ Cross-check the 5 gates + chair-add powers vs. `tedchange` BEFORE building** (open Q logged, `game-context.md` #174 / digest §6). **S–M; folds into the committee/bill-packaging epic E14b (#8/#9/#12).** game-mechanics §12.5.1. |
| 55 | **★ #175 `Legislation` has NO `repealable` flag and NO law-class tag — a small data-model add (batch 23 / `pop2012b`, MrPotatoTed designer-authoritative)** | the `Legislation` interface (`types.ts:1506-1520`) has `id/year/title/description/sponsor*/committee/status/effects/votes` and **NO `repealable` and NO `lawClass`**; the floor runner `runPhase_2_6_3_Floor` (`phaseRunners.ts:3498`) resolves only `passed_committee` bills with no repeal/replace branch; **grep `repealable\|lawClass` in `src/` = ZERO** (the existing `Challenge-Legislation-can't-target-REPEAL` filter #132 is a separate guard) | MrPotatoTed (game co-author) ruled (`pop2012b#POST 687-688): *"Every law is marked with whether or not it can be repealed"* — a per-row flag ("Column P", LegisActive sheet) with **three classes**: **repealable** (a Repeal bill removes it through the normal pipeline — most policy bills); **replace-only** (non-repealable but **replaceable** — you cannot remove it, only supersede it with a new same-kind bill; **tax + immigration** laws); **permanent** (irreversible — **statehood**, *"once a state is a state, it's a state"*; no state can be abolished). This is the authoritative resolution of the `pop` §5.5 data-tag hole and explains why some passed policies are "downgrade-only" and why no Repeal-Statehood bill exists. **The fix: add `Legislation.repealable: boolean` + a `lawClass: 'repealable' \| 'replace-only' \| 'permanent'` tag; gate Repeal proposals on the flag; for replace-only laws expose a Replace action that supersedes (not removes) the prior law; mark statehood (and other one-way structural bills) `permanent` so no repeal/replace is offered.** **Pairs with #42 (the bill-relationship graph, §12.9 — `Not repealable`/replace-by-X/amendment-tier) + §27.5 (statehood-by-bill: stamp every admit-state bill `permanent`).** **S — a small data-model + pipeline-guard add inside the legislation/bill-relationship epic; needs an authored repealable/replace-only/permanent per-bill list (open Q, `game-context.md` #175).** game-mechanics §12.9. |
| 56 | **★ #176 founding MilPrep meter has NO tier-prerequisite ladder — the auto-forced founding war bills can't be guaranteed to move the meter (a content/authoring constraint, NOT a shipped regression) (batch 24 / `grass1772` + `rookie1772`, surfaced INDEPENDENTLY by both 1772 runs)** | `scenario1772.ts:9-17` boots `military: -2` as a RAW numeric `NationalMeters` field clamped to `[-5,5]` (moved by bill `effects.meters` deltas, e.g. `phaseRunners.ts:3638`; bill-mod ×1.2/×0.7 at `:2925-2928`); **`revolutionaryWar.ts` models NO MilPrep ladder and NO per-tier legislative prerequisites** — `grep meterPrereq\|meterTier\|MilitiaAct\|StandingArmy\|tierPrereq in src/` = **ZERO**. The shipped meter is just a clamped scalar; there is no tier/prereq gating system at all | **The forum's NEW founding rules/balance gap.** In the spreadsheet rules MilPrep is hard-capped at 2 for the WHOLE Era of Independence because the meter's tiers are mis-ordered: **MilPrep 3-4 require the Militia Act (a federalism-era ~1792 bill)** while the **auto-forced 1774 war bills (Continental Army / Continental Navy) point at the HIGHER tiers (5-6)** → every forced-war MilPrep roll is wasted, every game, and the era sits in a permanent Military-Preparedness crisis + a recurring −1 election drag ("until the Constitution exists, AFTER the war is over, military preparedness can never increase, rendering all war legislation completely pointless… a glaring issue", `grass1772#POST 88-90`; rookie hit it blind, "so much for the 'Continental Army' of minutemen!", `rookie1772#POST 32-33`). **★ Because the build does NOT yet have the tier-prerequisite system, this is a content/authoring constraint to honor WHEN founding war-content + a meter-prereq ladder are built, NOT a regression to patch:** whatever founding MilPrep ladder is authored, the auto-forced Continental Army/Navy bills MUST be able to raise MilPrep (Cal's reverse-the-prereqs fix: Continental Army → MilPrep 3, Continental Army+Navy → MilPrep 4, cap ~4-5 pre-federalism), else the forced war legislation is dead rolls. Also surface meter prerequisites/caps in-UI (a new player can't see them — pairs with DH-69 row 53). **Where it binds:** the founding bill/meter data (`scenario1772`/`eraEvents1772`) + a (new) meter-prereq predicate + `revolutionaryWar.ts`'s `milPrepMod` battle term. **S; folds into the founding/RevWar content (E1) + #67 meter caps. Open Q (designer-gated): adopt the reverse-prereq fix or keep the founding military crisis as intended.** game-mechanics §17.4. |
| 57 | **★ #177 the federalism foreign-affairs DECISION-EVENT spine is HARD-WALLED out of the era graph — a next-era content build (batch 25 / `principle1772`, designer-GMed, DESIGNER-AUTHORITATIVE)** | the era graph `validate()` THROWS on this entire content class via TWO authoring guards: `eraGraph.ts:153-155` rejects any node with `chartIndex >= 49` (*"French Revolution / Federalism is out of scope"*) and `eraGraph.ts:150-152` rejects any `president`/`cabinet` decider (*"no President/Cabinet pre-1789"*); **every event in this spine is a post-1788 president/cabinet decision-event.** No per-nation diplomacy-relation meter exists (`grep relation\|diplomacyMeter\|foreignRelations in src/` finds no per-power relation field) | **The most-detailed Federalist-era foreign-affairs content in the KB** (`principle1772 §1`, ch13/21/23/25/26), surfaced at the least-covered ~1800 endpoint. A spine of **8 decision-events**: French Revolution (neutrality/alliance-betrayal → DomStab crisis + EconStab −1 recession), Citizen Genêt (French Relations −1 = END of the alliance), Pinckney's/Spanish Treaty (impl-blunder w/o a Sec-of-State → Easily-Overwhelmed + Spain −1), Jay Treaty (treaty-gates-territory, #178), Haitian Revolution (endorse/oppose/ignore), the **alt-history "Bourbons Restored"** branch (a `realEvent:false` counterfactual), NW Indian War (the "3 chances" origin), and Bank-recharter (institutions created↔killed↔recreated by law). **Authoring it requires LIFTING BOTH `eraGraph.ts` walls** (gate president/cabinet deciders on `year >= 1789` instead of forbidding them) **+ adding per-power diplomacy-relation meters to the snapshot + DomStab/EconStab shocks + enthusiasm deltas + implementation-blunder rolls in the decision layer.** **Where it binds:** `eraGraph.ts` (lift the 2 walls + a `year >= 1789` decider gate), a new federalism era-graph content file, a per-nation relation meter on the snapshot, the §10.4.1 multi-decider/blunder layer. **M; folds into E1/scenario1788 + era-event/eraGraph (#92); couples to E12 diplomacy (#107/#162). Open Q (designer-gated): confirm this is the intended next-era build (not a permanent scope wall); V deferred the EV/territory-event %-chances (POST 1801), so firing probabilities are unauthored.** game-mechanics §20.3.1. |
| 58 | **★ #178 `admitState` has NO treaty path and NO per-event retry budget — territory-by-treaty + the bounded "3-strikes" rule (batch 25 / `principle1772`, designer-GMed, DESIGNER-AUTHORITATIVE)** | `admitState` (`territories.ts:8-23`) admits ONLY from the static `EXPANSION_STATES_BY_ID` registry, driven by 1772 era-event `postEffects`; **no treaty path, no bill path, no per-event retry budget** (`grep treaty\|retriesRemaining\|retryBudget in src/territories.ts` = ZERO; the broader bill→statehood route is also unbuilt, §21.5) | **A NEW territory-acquisition class** (`principle1772 §1`, ch23/ch25). The **Jay Treaty** (a president decision-event) grants WI/IN/IL/MI on signing — *"Marshall refused it twice, then signed Attempt Two → gained WI/IN/IL/MI"* (POST 566/1005) — and the GM ruled a **per-event retry budget**: a territory-gating event may fire **up to 3 times** before the land is **permanently lost** (the same "3 chances" rule that ORIGINATES at the NW Indian War, *"certain events that lose historical states if ignored can be repeated three times before they're gone for good,"* POST 207). **★ This GENERALIZES DH-61** (boot-must-seed-era-active-wars / "3 chances") into one reusable per-event retry primitive spanning treaty, war, AND event gates. **The fix:** a **treaty→`admitState` post-effect path** (a president decision-event whose effect calls `admitState` over a list of states, the Oregon-Treaty pattern §10.4.2) **+ a `retriesRemaining` (default 3) field** on territory-gating events, decremented per fire, permanent loss at 0. **Where it binds:** `territories.ts` (treaty post-effect path) + the `EraEvent` type (a `retriesRemaining` field + retry-on-fire). **S; folds into the statehood/territory work + DH-61; pairs with #177 (Jay Treaty is the #177 carrier event). Open Q (designer-gated): is ≤3-fires canonical for ALL territory-gating events, or a GM house rule?** game-mechanics §17.6.1, §21.5. |

### 8.1 Confirmed shipped bugs + GM-confirmed design holes

Code defects (`BUG-*`: BUG-0 from `hd`, BUG-1/2/3 from `fed`) and GM-confirmed
design holes (`DH-*`: DH-1/2 from `modern`, DH-3..DH-11 from `hd`,
**DH-12..DH-23 from `drums`**, **DH-24..DH-28 from `pop`**, **DH-29..DH-35 from
`rep1800`**, **DH-36..DH-44 from the two batch-8 1772 threads: DH-36..DH-40 +
DH-43/DH-44 from `new1772`, DH-41/DH-42 from `tea1772`**, **DH-45..DH-57 from the
batch-9 `nuke` Cold-War/modern corpus**, **#115/#115a/#115b + the
DH-24/DH-25/DH-27/DH-36/DH-53 re-corroborations from the batch-10 `dem1820`
1820-start**, **#116/#119/#61-extended + DH-59/DH-60 from the batch-11 `arkzag`
1820→1840 full-arc**, **★ #120..#142 from batch 12 — the `tedchange` +
`smallbugs` designer rulings (now AUTHORITATIVE — `tedchange` is the official
rules-doc rewrite channel; the rulings SUPERSEDE prior GA calls where they
conflict). Many batch-12 items CLOSE long-standing OPEN items: QW0 closes,
#51's #18 sub-fork settles its algorithm half (state-scope still user-gated),
Pres-blunder rule canonicalizes the cf82a7d3 §5a #3 fuzzy "hybrid," CC
composition is rewritten, Hale/Frail/ex-Pres death schedule pins #85**.
**`BUG-*` are fixes,
not features** — small and high-value;
**BUG-0 (the relocation-cap stale constant) is the cheapest win in the roadmap**
and BUG-1 is a hard blocker the moment a federalism/1800 scenario ships
(**batch 7 LIVE-confirmed it** + merged the era-events-predating-start hole into
it). **`DH-*` are *rules gaps / balance flags*, not crashes** — the forum
rulebook had no answer and a human improvised; many **need rules *authored*
(a PM/design task) before they can be built**, several are **balance dials**
for an existing-but-unbuilt system, **DH-19/20/21/22 are architectural CPU
gaps that need K5's persistent state**, and **DH-34 (static-vs-policy-reactive
era-biases) is a ROADMAP DECISION, not a quick fix**. Verified against the
codebase where quick.

**Classification by where each `DH-*` lives:**
- **CPU-AI handler (folds into the K5 handler suite, §6.6.1):** DH-19 (gov
  menu industry-stack-aware), DH-20 (reciprocity), DH-21 (meter-guarding),
  DH-22 (cascading scandals), DH-23 (cabinet 36% bug — but smaller than
  expected because the system isn't built yet). **★ Batch-13 OC-* sub-rules fold
  into specific handlers as field-validated sub-rules (NOT new epics):** **OC-1**
  (scandal-resignee re-appointment cooldown — instance of DH-22) + **OC-5**
  (court-as-firing loophole gate) → **handler #4 (cabinet, §25.5.4)**; **OC-2**
  (one canonical `chamberControl` definition shared by leadership-select + the
  ≥60% proposer gate) → **handler #3 (leadership, §25.3)**; **★ OC-3
  (BALANCE-CRITICAL — crisis-vote ideology-floor + secession check)** →
  **handler #2 (legislation, §25.6)** as its **highest-priority sub-rule**;
  **OC-6** (kingmaker multi-protégé pairing tiebreak = highest Com+Leg+Gov) →
  the kingmaker handler (§25.11). All six are now spec-complete + field-validated
  (`oopscpu`); see §6.6.1 + §9 batch-13 lead.
- **Per-subsystem owns it (the subsystem epic must address it):** DH-5
  (Kingmaker-pairing dissolution on flip — conversion epic), DH-7 (R/D
  threshold asymmetry + Iron-Fist unilateral lower — convention epic), DH-8
  (CPU convention unstable — convention epic + handler #5), DH-9 (exec/gov
  ability stat — action-libraries epic), DH-10 (blunder still scores — action
  data flag), DH-11 (3rd-party bias + inelastic lobbies — #48/#5 balance),
  DH-17 (convention auto-drop-out + Command-limited interballot — convention
  epic), DH-18 (dark-horse resignation rolls — convention epic), DH-19 (gov
  menu — gov-actions epic + handler #10).
- **Parking lot (author rules before build):** DH-1 (filibustered MUST-pass),
  DH-12 (white-peace), DH-13 (faithless-elector trigger cap), DH-14 (era-aware
  bill ideology), DH-15 (small-state action multiplier), §25.9 Iron-Fist split
  exact-shape, divergence #10 contingent-election rules, **DH-25 (career-track
  bootstrap — BLOCKS modern scenario)**, **DH-33 (impeachment rewrite, batch 7)**,
  **DH-41 (★ batch 8 — the general SCOTUS-ruling → downstream-statute cascade is
  UNBUILT and was explicitly DEFERRED by `vcczar`: a genuinely undesigned cascade,
  author the policy before building it)**.
- **Per-subsystem owns it (batch 7):** **DH-29 (★★ Reconstruction solo-blocker —
  a BUILD REQUIREMENT on E3b: a CPU-passable readmission path; ties to K5 handler
  #2 / era-boundary auto-resolution — §9.1.6)**, **DH-31 (procedure-bills bypass
  veto but the engine MIS-ROUTES them — verify-and-fix in the bill-typing epic /
  divergence #21)**, **DH-32 (SCOTUS-voids-a-STATE — a guard in the SCOTUS
  ruling-effect path: a state cannot be ruled unconstitutional)**, **DH-35
  (thin-early-era presidential agency — era-gate the exec-action / primary
  libraries with enough EARLY-era agency)**.
- **Quick-wins (XS):** DH-3 (career-track pres bar), DH-6 (top-2-vs-top-3
  config), DH-18 (dark-horse resignation), the Iron-Fist split's `repair()`
  migration block, **DH-30 (event-scheduler min-floor = 20%-of-max + spill;
  companion to BUG-1 — batch 7)**, **DH-27/DH-24 (boot-data validators)**,
  **DH-43 (batch 8 — Vermont has no home-state mapping → its pols can't relocate
  home; a dataset/data fix)**, **★ #143 (batch 13 — post-election Command-decay
  pass: 40% / −1 Command for every living pol NOT on a Pres/VP ticket that cycle;
  binds at `runPhase_2_10_End` `phaseRunners.ts:4171`, gated on `isPresidentialYear`,
  after the 2.9.4 ticket roster is known; applies via the existing `loseCommand`
  `abilities.ts:15`. NEW, RULED, standalone — `oopscpu#POST 1, 224`)**.
- **Per-subsystem owns it (batch 8):** **DH-38 (no late-ratification / "Rogue
  Island" / multi-year amendment window — folds into the Constitutional-Convention
  era system / E1 federalism; the founding thread pulled decliners in instead of
  modeling a window)**, **DH-40 (SCOTUS-justice-count bill not auto-packaged with
  the establish-court bill → the game STALLS if the court passes but the count
  fails — a bug-fix in the bill-packaging / SCOTUS-establish path: package the two
  bills or guard the stall)**, **DH-42 (national-meters swamp per-state lean → no
  disputed/realistic close elections — folds into the per-state-bias / election-math
  epic as a BALANCE item; relates to DH-34's static-bias theme)**, **DH-44 (post-12A
  legislature-state vote count undecided — Kingmaker votes vs Gov+Senators+focus-Reps
  headcount — folds into the 12A election-mode toggle #93/divergence #20)**.
- **META justification, NOT a discrete fix:** **DH-36 (★ batch 8 — GM burnout
  from manual bookkeeping ABANDONED a 12-turn multiplayer 1772 game, `new1772`
  POST 3607).** This is the **single strongest piece of "why build this at all"
  evidence in the corpus** — the entire value proposition is that the computer
  owns the deterministic upkeep a human GM cannot sustain. It is not a row to
  schedule; it is the motivation behind the whole roadmap (especially the
  scaling-wall items #19/#20 and the CPU handler suite). Cite it, don't queue it.
- **Multiplayer / parking-lot (batch 8):** **DH-37 (no politician-to-politician
  trading — the #1 AMPU-2 wishlist item).** A genuine small feature (a trade
  window between factions) but **not on any critical path**; it pairs with the
  era-boundary faction-trade window (§27.2 step 1, which DOES exist in spec) and
  with multiplayer. Park it.
- **Convention CPU handler guards (batch 8):** **the lone-ideology minor-candidate
  convention exploit (#104) — a single ideologically-isolated minor candidate can
  exploit the convention; fold into the convention CPU handler (E9 handler 9e /
  §6.6.1) as a known exploit to guard against.** **stat-collapse → forced
  presidential resignation (#105) — a small rule (all-Command + "most" skills
  hitting a floor forces a sitting President to resign); lands NEAR the succession
  work (#61) as a one-rule addition.**
- **Small additive mechanics folded into existing epics (batch 8, the new #100-#103):**
  **#100 SCOTUS-overturns-a-ratified-Amendment + threshold-amendable** → folds into
  the amendments item (#39, the Gov-requested judicial-review-of-an-amendment path +
  the mutable ratification-threshold field) and the SCOTUS docket (E25). **#102 dual
  era-scoring (per-era winner + cumulative "winner so far")** → the WIN-CONDITION
  scoreboard; folds into K3/K4's per-era point-banking (#68 banks the cumulative
  total) — the win condition is **dual** (per-era + cumulative); relevant when the
  era system + endgame are built. **#103 presidential-vote modifier stack +
  era-stamped issue list** → folds into the election-math / bill-scoring epics
  (small, additive).
- **Diplomacy / war-engine work (batch 9):** **DH-45 (USSR-collapse chain broken
  — the ~5% first-gate never fires → the USSR NEVER falls; trigger re-tuning,
  folds into the diplomacy + Cold-War-content work)**, **DH-46 (relation meters
  "allied with everyone" — NO downward pressure; folds into the diplomacy
  subsystem #107 + the Cold-War ≤Neutral cap on USSR/China)**, **DH-47 (★ the
  generic war engine NEVER resolves + has no army/navy/air branches + no reliable
  white-peace — a §21.1 / generic-war-epic hole, NOT Cold-War-specific; the
  war-end roll's odds are so low wars ran two decades. Build a real
  resolution/peace path into #6, and ideally the branch model)**.
- **Era-event data-model + balance (batch 9):** **DH-48 (★ era-event data needs a
  STRUCTURED `evDelta`/census field — the Neocon census events were LOST in the
  spreadsheet; folds into the structured-era-event-data requirement + K4 per-era
  completeness validation, §28.9)**, **DH-50 (event firing-rate bimodal ~5%
  pre-Terror vs ~25% in-Terror + a 15-event/era cap — a scheduler BALANCE item;
  lands with the scheduling-fork decision #4 / BUG-1 / DH-30)**, **DH-53
  (bill→meter effect tables missing/illogical — the era-aware bill-impact tables,
  same surface as DH-14; folds into the bill-catalog/era-content work)**.
- **Election-math / convention balance (batch 9):** **DH-52 (★ landslide-margin-cap
  model MISFIRES on blowouts — the 2004 all-53-states sweep; max-margin caps keyed
  to historical lean produce absurdities [won Idaho by 50, capped at +10 in tossup
  NH]; folds into the election-math epic, relates to DH-42)**, **DH-55 (engine
  HARD-WIRED to 2 parties — a winning independent just becomes that side's Party
  Leader; folds into the 3rd-party trigger #48 as a known constraint; dynamic
  party creation is AMPU-2)**, **DH-57 (brokered-convention ballot-2 releases
  delegates that swing 80/20 to the momentum leader, IGNORING the primary result —
  a convention-machinery DESIGN hole the GM flagged unresolved; owned by the
  convention epic / CPU handler #5)**.
- **Dataset balance (batch 9):** **DH-51 (modern pols OVERPOWERED / recency-biased
  — a balance pass on the modern dataset slice; author-time `scripts/` work, NOT
  engine)**, **DH-56 (conflicting career-track interest rule-sets — author one
  canonical rule; relates to DH-25; parking lot)**.
- **Parking lot / population model (batch 9):** **DH-49 (★ the Wyoming Rule +
  per-decade census EV reallocation are UN-IMPLEMENTABLE without a real population
  model + House cap — neither exists today; `State.electoralVotes` is a static
  seed. AUTHOR-BEFORE-BUILD: add a population model + House cap, or scope it into
  the census/apportionment epic #34/#55 once authored)**, **DH-54 (★ impeachment /
  VP-vacancy fill was NEVER in the rules doc — ad-hoc here AND in `rep1800`/`hd`;
  corroborates DH-33; author the impeachment + succession ruleset before building
  the institutional layer #112 / #61)**.
- **★ Batch-19 NEW gap (`fixes2022`) — #167 no-eligible-successor constitutional-crisis
  subsystem (debt #43; NOT a parking-lot author task — the PROCEDURE is authored).**
  Unlike the impeachment hole (DH-54/DH-33/DH-66, which await Ted's pending rewrite),
  #167 is a **fully-authored designer procedure** (`fixes2022#POST 841-882`): the
  fallback when the WHOLE succession line is empty. **FOLDS INTO E10b; reuses the #62
  delegation-vote machinery for the House 1-vote-per-state acting-President election;
  ship the PPT-as-acting-President interim default FIRST** (`POST 849-850`), layer the
  full procedure later. Couples #61 + #88/debt #28 + DH-54 into one E10b crisis family.
  M (full) / S (PPT-interim). game-mechanics §24.1.2.
- **ROADMAP DECISION (not a parking-lot author task):** **DH-34 (batch 7) —
  static vs policy-reactive era-biases (the Red-unwinnable "AMPU 2.0" hole).
  Ship static (forum's own stance) vs. invest in a large new policy-reactive
  bias system. My call: ship static.**
- **Observation only / no fix needed:** DH-16 (reapportionment cap 435 likely
  never triggers in normal play).
- **MERGED:** the batch-7 "era-events-predating-start-DROPPED" hole is the
  **SAME bug as BUG-1** (LIVE-confirmed by the LA-Purchase-dropped-at-1800-start
  episode) — folded into BUG-1 + its DH-30 companion, not a separate row.

**Classification of the batch-12 `tedchange` + `smallbugs` rulings (`#120..#142`):**
The 19 Ted-rulings + the `smallbugs` umbrella + the open designer-gated items
classify into the existing epics — **most are XS-S constant/handler changes**;
the M-sized items are #124 (cabinet enthusiasm rework — teardown of E16's
lobby-driven enthusiasm path) + #134 (Lingering 7-step ordering — re-spec of
E6 / meter-decay surface) + #133 (CC composition rewrite — refines E17
continental congress era system) + #120 (dataset umbrella — one coordinated
`scripts/seedDataset.mjs` pass).

- **Closes existing OPEN items (no new row):** **QW0/BUG-0 (relocation cap=4
  — `smallbugs#POST 734-735`, vcczar-12-30-25)** now fully SETTLED; **#51
  algorithm half** (`arkzag` already settled this in batch 11; `tedchange`
  does not touch it — the batch-9 review-gate Senate 60% ruling STANDS
  UNCONFLICTED per `tedchange` digest §9); **cf82a7d3 §5a #3 fuzzy "Pres
  uses Command for blunder impact" → #126** (the canonical 5-tier wording is
  now AUTHORITATIVE — supersedes the fuzzy hybrid placeholder).
- **Quick-wins (XS):** **#135 50/50 House inverse-control** (a one-line
  edit at `phaseRunners.ts:1864`); **#136 random-skill draft no-Command**
  (verify the existing pool); **#137 no cross-party draft** (gate the
  rookie's `partyId` at draft time); **#138 3 traits + 3 alt-states**
  (re-rule into era-config); **#139 Pres signature in 2.6** (phase reorder);
  **#142 CPU CJ ladder** (the spec is authored, slots straight into E25);
  **#131 Integrity-can't-nominate-Controversial** (one filter helper);
  **#132 Challenge-Legislation can't target REPEAL** (one filter helper).
- **Per-subsystem owns it (small refinements within existing epics):**
  **#127 conversion/ideology-shift schedule** → folds into #99 ideology-
  circle helper (Phase-1 #5b) + the conversion adjacency filter;
  **#128 Kingmaker / Master Kingmaker scope** → one helper + the
  `calcStateVote` +1 binding (Phase-1 #20 / election math); **#129
  Kingmaker→Protégé trait allowlist** → one filter list (Phase-1 #21
  conversion-targeting refactor); **#130 Death/retirement schedule** →
  `MORTALITY_RULES` refinement + Hale trait add + Frail-first order-aware
  loop refactor (Phase-1 #19 small consistency, pairs with #85);
  **#133 1st/2nd CC composition rewrite** → re-scope E17 / §17.1; **#134
  Lingering 7-step strict ordering + tax/tariff carry-forward** → re-scope
  E6 / Phase-1 #6 (meter-model + APOCALYPSE) to also carry Lingering
  discipline; **#140 AnytimeEvo target-pool tightening** → AnytimeEvo
  content + a per-event filter (Phase-1 #19 or E9 handler 9g); **#141
  FL trait-gain 5% positive / 3% negative** → refines the existing
  faction-leader trait-gain rules (already partially captured by cf82a7d3
  §5a #4 in §8.1's existing carry).
- **Major rework (M, the headline structural change):** **#124 cabinet
  enthusiasm REWORK** — a teardown of E16's existing lobby→enthusiasm path.
  **(a)** LOBBY satisfaction now writes POINTS (to Pres + matching-lobby
  factions, via the `Faction.score?` ledger), NOT enthusiasm; **(b)**
  IDEOLOGY COMPOSITION drives enthusiasm (≥50% cabinet of an ideology =
  +enth; ≤20% = −enth); **(c)** the 3-shifts/half-term cap holds. Land
  AFTER K2 + K5 (the rework requires the conditional-vote-rules primitive
  + the new score path); **re-scope E16 from "build the confirmation
  system in the right shape" to "build confirmation + #124 enthusiasm
  rework TOGETHER in the right shape from day one."** The actual
  percentages are DESIGNER-GATED OPEN.
- **Pres-implementation rule (S):** **#126 2-step Admin-then-Command
  blunder rule** → the canonical 5-tier table lands in E29 (modern
  legislative depth) where the Pres-implements-bill code lives. The
  rule is now READY (was OPEN as cf82a7d3 §5a #3 fuzzy wording).
- **Dataset umbrella (M, ~100 items as one coordinated pass):** **#120
  the `smallbugs` dataset umbrella** — religion fixes, skill/trait
  swaps, missing pols, bio errors, duplicates, missing alt-states —
  one coordinated `scripts/seedDataset.mjs` + `CURATED_ROWS` pass.
  Also covers DH-43 (Vermont home-state mapping), DH-51 (recency-biased
  modern pols), DH-28 (trait-conflict validator at boot).
- **Build-target SIMPLIFICATION (no new item):** **amendments-NOT-SCOTUS-
  challengeable** (`smallbugs#POST 250-269`, vcczar) **OVERRIDES**
  `tea1772`'s #100 "SCOTUS can overturn an amendment." **E5 keeps the
  strike-a-statute path + the mutable-threshold field but DROPS the
  SCOTUS-overturns-amendment branch; E25 keeps the docket + Justice
  drift + court size + DH-32 state-guard but DROPS Gov-requested
  judicial-review-of-an-amendment.** This is a sequencing simplification.
- **Designer-gated OPEN items (Decision-gated SUB-BUCKET):** the 9
  open `tedchange` items per game-mechanics §30.2 — Mil-Prep lvl 4 fix,
  UEM (#125), Crisis trait consolidation, term-limit Gov pre-Senate,
  faithless-elector rewording, party rename PL-vs-EraEvo, VP-must-be-
  same-party-on-resignation, cabinet enthusiasm percentages, cabinet
  ideology weighting; **★ batch-13 ADDS TWO: OC-4** (CPU draft off-ideology
  gate — Ted wants "a better third way" than draft-strong-pol-off-ideology
  vs. uncontested; do NOT silently ship a hard gate; `oopscpu#POST 227-228,
  234`) **+ OC-8** (define "office" for the Scandalous-Non-Office-Holder
  forced-out event + rewrite the contradictory event text; flagged to
  `@vcczar`; `oopscpu#POST 334, 336`). **NOT ready-to-build until Ted/vcczar
  closes them in `tedchange`/`smallbugs`/a follow-up.** These join the
  "designer-gated" sub-bucket of the PARKING LOT (alongside the user-gated
  bucket). The cabinet OC-3/OC-1/OC-5/OC-2 sub-rules, by contrast, are NOT
  designer-gated — they fold straight into the E9 handler rows as
  field-validated sub-rules (above).
- **Per-subsystem owns it (batch 13):** **DH-61 (★ scenario-boot must seed
  era-active wars — folds into the `scenarioBoot` pipeline / K4 + the generic
  `War` model; a HARD prerequisite for `scenario1788`; `oopscpu#POST 338-344`)**,
  **DH-62 (★ pre-12A two-votes-per-state / no-ticket EC mode — folds into the
  per-state-EC + 12A-toggle epic #93/#5 as an era-keyed election-mode variant;
  also a HARD prerequisite for `scenario1788`; `oopscpu#POST 192-199`)**. Both
  sequence WITH E1 / `scenario1788`. Also **#143 (post-election Command-decay)**
  is an XS standalone quick-win (above), and **OC-1/OC-2/OC-3/OC-5/OC-6** fold
  into the E9 handler rows (above).

| Bug | Location (verified) | Fix | Size / when |
|---|---|---|---|
| **BUG-0 (batch 4) — relocation cap is STALE: shipped `5`, design `4`** (divergence #9) | **VERIFIED:** `RELOCATION_ATTEMPTS_PER_TURN = 5` at **`src/types.ts:247`**. The designer (`vcczar`) changed the cap to **4** non-alt-state relocations mid-thread and it went **LIVE in the running playtest** (`hd` POST 7062–7066, 7555); the browser engine never caught up. **★ BATCH-12 (`smallbugs#POST 734-735`, 12-30-25, vcczar-APPROVED — designer-AUTHORITATIVE):** *"A faction is limited to FOUR total attempted moves per half-term. A politician that moves to an ALT-STATE does NOT count against the FOUR total moves."* — the cap is now fully **SETTLED** by the designer rules-doc patch. No further design or human review required. | **One-line edit:** `RELOCATION_ATTEMPTS_PER_TURN = 4`. **+ a guard at the accumulator so alt-state moves don't decrement the budget** (verify the alt-state accounting in `runPhase_2_1_4_Relocations`). (The full feature — auto-Carpetbagger + 10-yr expiry — is divergence #2 / a separate consistency PR; this row covers the const + alt-state exemption.) | **XS — the cheapest win in the whole roadmap. Do it FIRST. ★ BATCH-12: now fully RULED (was "open-design + build" through batch 11; the alt-state exemption is the only addition).** No dependency, no migration. |
| **BUG-1** — era events never deactivate by era for non-1772/1856 start years (an 1800-start wrongly loses the Louisiana Purchase; stale events also dilute the roll table) | `buildEraEventsForYear(snap.game.year)` is called with **no era-vs-start-year filter** at `phaseRunners.ts:2817`. Latent today (only 1772/1856 ship; the 1772 graph path at `:2801` is separate), but a blocker once a 3rd scenario lands | Add an "era-lock" filter: an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table (`fed` 524-535). **Resolve together with DH-2 and divergence #4 — same scheduling surface.** | **XS.** Land *before/with* the federalism scenario — it directly gates it. |
| **BUG-2** — `Chisholm v. Georgia` needs an "11th Amendment not ratified" gate | **No SCOTUS case data contains it** (grep: 0 hits in `src`). This is a *forward requirement on SCOTUS-case content*, not a live crash | When the federalism SCOTUS case file is authored, gate `Chisholm` on `!amendmentPassed('11th')`. Bundles into the SCOTUS subsystem (divergence #7). | **XS.** Bundles into SCOTUS content; needs the amendments field (#39). |
| **BUG-3** — no fallback when no viable PM-General candidate exists | `GeneralInChief` is a real seat (`types.ts:1121`, granted via `cabinetSeatsForYear` `:1145`) filled at `phaseRunners.ts:2255`; the **no-candidate path is uncovered** → potential crash | Define the empty-pool behavior (leave vacant + log, or auto-generate a stopgap officer — ties to procedural pol generation, scaling wall a). | **XS.** Defensive guard; do alongside the war/cabinet work. |
| **DH-1** — a filibustered "MUST-pass" bill has no rules remedy | Filibuster itself is unbuilt; no deadlock rule exists. GM improvised a 4-leader special-committee auto-pass with a per-day "shutdown" penalty clock (`modern` 640-716). **A rules gap, not a code bug.** | **Author the deadlock rule first** (forced-compromise vs shutdown-clock vs fallback auto-pass — a design call), then build it into the filibuster epic. | **Design task + S build.** Blocks the filibuster epic's completeness. |
| **DH-2** — modern era-event deck fired off-year cards (2008 cards in 2018) | Possible scheduling defect or intended shuffle/backlog (`modern` 2221). **Reported, not verified.** | Resolve **together with BUG-1 + divergence #4** (era-event scheduling) — all three are the same scheduling surface. | **Investigate within the scheduling-fork decision.** |
| **DH-3 (`hd`)** — career-track pols can run for President | A career-track pol is barred from Gov/Rep/leadership/Kingmaker but **no rule bars a presidential run** (`hd` 8205–8219). GM-acknowledged, intended-to-fix. | **quick-fix / author.** Bar career-track pols from the presidential candidate pool (and from CPU presidential selection). Relates to #63 primary. | **XS rule + S build.** Add a guard at candidate eligibility. |
| **DH-4 (`hd`)** — "Extend Credit to all nations" near-auto-win foreign loop | Extending credit to all 7 powers "works amazingly every time" → stacked EconStab/industry/relation bonus (`hd` 7346). Diplomacy itself is unbuilt (#26). | **balance.** Needs a diminishing-returns / cap rule. Author the cap **into the diplomacy-actions epic**, not separately. | **Balance dial; folds into diplomacy library.** |
| **DH-5 (`hd`)** — Kingmaker-flip grabs the protégé(s), "insanely OP" | Converting/flipping a Kingmaker also seizes his protégés + their +1 election standing (`hd` 7589, 8762). Kingmaker/conversion exist (`KINGMAKER_RULES` `types.ts:295`; `CONVERSION_ODDS` `:268`). | **balance / quick-fix.** Add a pairing-dissolution-on-flip rule (or no protégé transfer). Relates to #29/#30. | **S.** A rule in the conversion path; **also note for Reconstruction** (#57 prunes broken Kingmaker pairs — same code area). |
| **DH-6 (`hd`)** — contingent-election top-2 vs top-3 deviation | GM uses **top 2** vs the 12th Amendment's **top 3**, overruled "Game rules" (`hd` 5720–5721). No contingent path exists. | **author-before-build.** Build must **pick a stated cutoff** (config it: `contingentTopN`). Bundles into the contingent-election addition (#62). | **Design call + bundled into #62.** |
| **DH-7 (`hd`)** — R/D convention-threshold asymmetry + Iron-Fist unilateral change | Dems run **3/4**, GOP **2/3→½+1**; an **Iron-Fist PL can unilaterally lower** the threshold (`hd` 4726, 623–630, 5594–5713). No convention thresholds exist. | **author-before-build.** Document a chosen rule (era/party-fixed vs temporary) + re-gate the rules-change power. Bundles into the **convention epic**. | **Design call; part of the convention subsystem.** |
| **DH-8 (`hd`)** — **CPU convention AI unstable + ballot-shift rule ambiguous** | GM-acknowledged: the CPU convention AI is "rough/awful, needs a 2.9 rework" and **cannot perform some actions humans can**; the ballot-shift rule is genuinely ambiguous (`hd` 4686–4690, 2025–2038). No convention AI exists today. | **CPU-AI (known-unstable) + author.** **Any conventions build must OWN the CPU side** — a player-only convention is not shippable for a single-player game where most factions are CPU. Firm both specs (ballot-shift: GM ruled next round) inside the epic. | **Owned by the convention epic; do not treat the CPU as optional.** |
| **DH-9 (`hd`)** — exec/gov-action ability stat inconsistent | The ability stat differs across actions/events (exec=Command in build, gov=Gov); designers think it should all be Command; a live "all-Admin implementation" rebalance was applied (`hd` 2274, 2279–2282, 3097–3098). | **author-before-build.** One canonical decision before the action libraries (K2) author their `resolve` stat. Relates to #22/#23. | **Design call; resolve *before* the action-library epics fix the stat per row.** |
| **DH-10 (`hd`)** — blundered implementations still score unless overridden | Designer ruling: a FAILED implementation **still scores points + moves meters "as if it succeeded"**; the blunder only risks scandal/resignation — UNLESS a specific event overrides (`hd` 8649–8672). | **author / per-action data flag.** Needs a per-action `blunderStillScores?` flag + an override appendix. Refines #22. | **S; a data-flag convention for the era-event/action content.** |
| **DH-11 (`hd`)** — apparent Dem 3rd-party structural bias + lobby cards too inelastic | Dems reportedly "won every instance a 3rd-party run mattered" (possible bias in #48); lobby cards are too inelastic (raw-pol-count-driven → a trifecta party can lack lobbies) (`hd` 7480-block, 7799). | **balance.** Rebalance the 3rd-party trigger (#48) + the lobby-card distribution (#5/§7.4 card algorithm). | **Balance dials; fold into the respective subsystems (#48, #5).** |
| **DH-12 (`drums`)** — white-peace rules MISSING from war system | War system unbuilt (#45/#56); designer Tyler had to dig up old treaty docs (`drums` 6533-6541). | **author + balance.** Spec: Moderate Implementation (Pres + Sec State + Sec War), 75% −1 Party Pref, −100 Mil-Industry, −500 Expansionists/President, antebellum status quo. **Author into the generic-war epic (#6).** | **Design call + S, folds into #6.** |
| **DH-13 (`drums`)** — faithless-elector trigger over-aggressive + undocumented | 8-elector defection in 1900 produced 232-232 tie → House contingent; trigger fires whenever winner's state has the other party's ideology enthusiasm maxed (POSTS 466, 469-471). | **balance + author.** Cap/document the trigger; EBR's deadlock side-effect rule (Controversial gain + 50/50 Dom Stab hit, POST 5250). | **Balance dial + author; folds into the election epic.** |
| **DH-14 (`drums`)** — bill ideology impacts not era-aware | Bills carry fixed ideology effects → Mods on negative side of Women's Suffrage in 1916 (era-wrong); Equal Voting Rights for Women never passes. | **author + content.** Era-keyed ideology impact tables on the bill catalog. Couples to K4 era enum. | **Content; folds into era-enum + bill-catalog work.** |
| **DH-15 (`drums`)** — small/large-state action-impact multiplier uncodified | RI at 2.5% (half of 5%); large states double. In playtest sheets, not in rulebook. | **author.** Per-state size multiplier on gov-action meter impacts (refines #20). | **S; one rules-table addition.** |
| **DH-16 (`drums`)** — reapportionment cap 435 effectively never triggers | Tyler POST 5352: ~year 2000 before the cap binds in normal play; sim growth rate slow. | **balance / observation.** Likely no fix needed; document the actual cap-binding behavior on apportionment. | **Observation; no action required.** |
| **DH-17 (`drums`)** — convention auto-drop-out at 2-3 stuck ballots + 1-action/candidate cap | Players proposed CPU auto-drop after 2-3 ballots of 0 Momentum (POST 1162); 1-action-per-candidate-per-ballot cap "impractical" (POST 7214); 11-13 ballot deadlocks observed. | **author + balance.** Auto-drop-out rule + Command-limited interballot actions. **Owned by the convention CPU handler** (handler #5, §6.6.1). | **Folds into the convention CPU handler.** |
| **DH-18 (`drums`)** — dark-horse compromise candidates dodge resignation rolls | Resignation rules assumed no Dark Horse would be nominated (POSTS 7257, 7263); house-ruled retroactive. | **author.** Apply resignation rolls to dark-horse compromise nominees. | **XS; one rule.** |
| **DH-19 (`drums`)** — CPU governor menu static; no industry-stack awareness | Fixed menu lookup by faction identity; Improve Industry at 10/10 fails silently. | **CPU-AI (handler).** State-aware governor action menu reads `state.industries` + `state.policies` + Honest-Gov caps; prunes no-op actions. **Handler #10, §6.6.1.** | **Folds into the governor-action CPU handler.** |
| **DH-20 (`drums`)** — CPU has NO reciprocity / vote-trading (architectural) | Designer POST 4875: "the CPUs don't understand reciprocity." Confirmation/leadership votes swing 76-24 → 91-9 by faction discipline alone. | **CPU-AI (architectural).** Needs the K5 scaffold's `GameState.cpuCommitments?` persistent field + an enforcement step. **Handler #11, §6.6.1.** | **Folds into K5; one of the three architectural CPU gaps.** |
| **DH-21 (`drums`)** — CPU has NO meter-guarding logic on scripted-event options | Roosevelt Internationalist + Pro-Federal-Government + Advocate New Freedoms triple-stack tanked QoL + EconStab simultaneously (POST 6280); no CPU penalty for stacked-into-crisis. | **CPU-AI (architectural).** Needs the meter-impact aggregator + a CPU down-weight term. **Handler #7, §6.6.1.** | **Folds into K5; one of the three architectural CPU gaps.** |
| **DH-22 (`drums`)** — cascading scandal sequencing hole | Estella → VP forced to resign → Pershing replaces with Hearst → Pershing scandal → Pershing resigns → Hearst becomes President within days (POST 7389). No smoothing for back-to-back at-most-once events. | **CPU-AI (architectural).** Needs `GameState.recentScandalIds?` persistent field + an event-walker filter. **Handler #12, §6.6.1.** | **Folds into K5; one of the three architectural CPU gaps.** |
| **DH-23 (`drums`)** — cabinet 50/50 Admin-1 reject + lobby-maximizing selection = 36% confirmation pass rate | Two reinforcing bugs (POSTS 4702-4708); designer-acknowledged "low chance to reject" rule was lost from the rules doc. | **CPU-AI + content.** **The system doesn't exist today** — `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step pick with no Senate vote — so the fix is **building the confirmation step in the right shape from day one**: default-AYE baseline + Iron-Fist Maj-Leader auto-AYE-own-picks + lobby-maximizer with Admin weighting. **Handler #4, §6.6.1.** | **XS-S; smaller than expected because the broken system isn't shipped yet.** |
| **DH-24..DH-28 (`pop`)** — boot-data quality / career-track bootstrap / 3rd-party VP-trait / trait-conflict-in-boot / meter-tag-completeness | Classified in the batch-6 provenance block above. DH-25 (career-track bootstrap) is the **parking-lot BLOCKER on modern scenario**; DH-24/DH-27 are XS boot validators; DH-26 is a 3rd-party balance dial; DH-28 is a dataset-build tag validator. | See the batch-6 classification + the K4 boot-pipeline hooks. | (carried) |
| **DH-29 (`rep1800` → ★ STRUCTURAL reframe `hd1`)** — ★★ Reconstruction readmission DEADLOCKS → solo (AND deadlocked-human) Reconstruction UNRESOLVABLE | GM-verified (`rep1800` POST 9170): *"only 3 factions would ever consider voting for it… in a single player game it basically can never pass."* **★ Batch-16 (`hd1` POST 2678) ESCALATES this from CPU-only to STRUCTURAL:** the FIRST run with HUMANS on both sides still deadlocked — *"The Congress could never agree on a Reconstruction guideline… NEITHER PASSED and states just started coming back into the Union with NO reconstruction plan at all."* Mutual filibuster → null drift. So it is NOT a CPU-heuristic gap; it is a both-chambers-must-agree paralysis. Reconstruction still unbuilt (#57; 0 hits in `types.ts`). | **BUILD REQUIREMENT on E3b — now with the AUTHORED FIX in hand (#156).** vcczar's restart rewrite (`hd1` POST 2693) resolves it: a **4-plan model on BOTH Pres + Congress** gated by *"a plan adopted by Congress OR by the President"* → **the President can adopt a plan UNILATERALLY**, so solo AND deadlocked-human Reconstruction always resolves. The §9.1.6 options 1/2/3 are SUPERSEDED by this authored prerequisite. See #156 + §9.1.6. | **A hard gate on E3b's readmission half; the FIX = #156 (the unilateral-adopt prerequisite). DH-29's "author the rule" step is now DONE — build the authored design.** |
| **DH-30 (`rep1800`)** — era-event scheduler has a MAX per half-term but NO MIN floor | `rep1800` POST 2919-2932: events scale by a fixed number; "the limit is a max not a min… which isn't what we discussed." Companion to BUG-1. | **quick-win.** Fix = **minimum 20% of the era's max (round down)**; if still none fire (all prereq-gated), spill to the 5 generic anytime events. Lands with BUG-1 / the era-event work — same scheduling surface. | **XS; pair with BUG-1.** |
| **DH-31 (`rep1800`)** — procedure-subtype bills BYPASS the veto but the engine MIS-ROUTES them to the President | `rep1800` POST 2342-2348: `subtype: procedure` bills (Institute Filibuster, create-whip-offices) wrongly sent to the President for sign/veto. | **verify-and-fix (divergence #21).** Confirm the bill `subtype` taxonomy; skip the President sign/veto step for procedure bills. Lands in the bill-typing epic (#42). | **XS-S; in the bill-typing epic.** |
| **DH-32 (`rep1800`)** — SCOTUS can void a STATE ("Pickens v. Maine's Existence" voided Maine after a census) | `rep1800` §B 3632, 3646-3652: a state ruled unconstitutional 5-1. No state-existence guard in the SCOTUS ruling-effect path. | **one-rule guard.** Add: **a state cannot be ruled unconstitutional** (a territory can be revoked; secession is the only un-making of a state). Lands in the SCOTUS docket epic. | **XS; a guard in the SCOTUS ruling-effect path.** |
| **DH-33 (`rep1800`) → ★ now 3-THREAD-CONFIRMED with DH-54 + DH-66 (`ideo1928`)** — impeachment ruleset broken/outdated | `rep1800` §A 465-474 / §B 3594, 3620: the mini-flow runs but the canonical rules are flagged non-functional + improvised (corroborates `hd`'s "impeachment super outdated" across a 2nd campaign). **★ Batch-18 (`ideo1928`, DH-66) is the THIRD thread:** the "Improper SC Justice" general event triggered an impeachment trial that Jimmy + Ted **VOIDED MID-RUN** (POST 816-861) because the rules under-specify article generation, trial-firing, and the Controversial-vs-<3-judicial inconsistency — and **Ted drafted a rewrite that is NOT yet final.** Verified: **0** `impeach` hits in `src/` — no subsystem exists at all. | **author-before-build (PARKING LOT).** The spec is NOT final (Ted's rewrite is pending). Do NOT build against the current under-specified rules; await Ted's authored rewrite, then build it into the legislative-depth epic (Phase-2 #29). | **Design task; parking lot — await Ted's pending rewrite. Now 3-thread (DH-33/DH-54/DH-66).** |
| **DH-34 (`rep1800`)** — ★ static era-biases are unfixable ("AMPU 2.0") → the Red-unwinnable hole | The single most-repeated `rep1800` complaint: `State.bias` is a static per-era table that doesn't react to policy (abolish slavery → the South should swing Red) → Federalists acknowledged-unwinnable 1800-1840; players quit. GM + designer: dynamic biases "too complicated / not part of the AMPU vision… maybe AMPU 2.0." | **ROADMAP DECISION (not a quick fix).** Ship static biases (accept the imbalance — the forum's own stance) vs. invest in a large new policy-reactive bias system. **My call: ship static**, revisit only if balance becomes a release blocker. Pairs with #21/#34 (bias as a field) + DH-29's solo-balance theme. | **A roadmap-level call; no cheap fix.** |
| **DH-35 (`rep1800`)** — thin early-era presidential agency ("this era is a bore") | `rep1800` §A 2756-2760, 2930, 3110: in the pre-primary eras the President's only exec actions are flavor tours; the modern toolkit isn't unlocked yet, feeding the "Blue auto-wins, governing is dull" sentiment. | **era-gating-with-enough-early-agency.** The exec-action / primary libraries must be era-gated **with enough EARLY-era agency** to keep the pre-convention eras engaging. Pairs with #23 (exec-action library) + #63 (primary-era unlock). | **A content/era-gating constraint on the action libraries.** |
| **DH-36 (`new1772`)** — ★★ GM/manual-upkeep burnout — now a **4-thread cluster + a designer-run SUCCESS that proves the ceiling** (the META-justification for the entire build) | `new1772` POST 3607: the first captured multiplayer 1772 campaign (10 humans, ~12 turns) collapsed when the first-time GM could not sustain the manual bookkeeping. **★★ Batch-24 raises this to FOUR documented burnout deaths in the recent corpus** + sharpens the CAUSE: **(1)** `new1772` (the original), **(2)** `dem1820#POST 900` (2nd), **(3)** `modernday`/`pop2012b` (Rodja resigns — *"freaking hard to be the literal computer"*), and **(4) the two batch-24 1772 runs, BOTH of which died to upkeep load, NOT a loss/win:** `grass1772` died SPECIFICALLY because 2 humans couldn't hand-run 8 CPU factions ("didn't have the time to run the two player factions AND all 8 CPU factions", `#POST 328`) → fixed by ADDING humans to offload the CPU work (`#POST 348`); `rookie1772` found the solo run "a part time job" (`#POST 36`), opened it to 4-5 helpers, then died to GM time-burnout (`#POST 1444`). **★ The NEW angle the batch-24 1772 pair adds: the load-bearing cost is specifically the MANUAL CPU-FACTION SIMULATION** (run 1 faction, not ten) — the exact work #114/E9 must own. **★★ Batch-25 (`principle1772`) ADDS THE OTHER END OF THE ARGUMENT — a designer-paid SUCCESS that quantifies the ceiling.** It is the FIRST 1772-cluster run to reach a natural ~1800 endpoint WITHOUT a burnout death — but ONLY because **@MrPotatoTed (the game co-author) himself hand-simulated all NINE CPU factions** (cabinets, draft lists, leadership votes, event responses; he even REWROTE the CPU career-track heuristic mid-run, POST 323) while @vcczar live-ruled. So the cluster now carries BOTH ends: 4 burnout deaths (the cost of NOT having the CPU-AI) AND a designer-paid completion (the proof that the per-faction sim is exactly what makes the shipped solo mode completable). **Not a code bug — the META-justification for the entire build.** | **NOT a discrete fix.** The strongest single "why build AMPU at all" datum: the computer must own all deterministic upkeep AND the per-faction CPU sim (the human GM cannot). Cite it as the motivation behind scaling walls #19/#20 + the **CPU handler suite (E9/#114) + the DH-69 rules/legal-move surface (debt #53)** — batch 24 makes these the load-bearing "make it playable solo" investments, and **batch 25 ESCALATES E9/K5/#114 from "reduces upkeep" to "the LOAD-BEARING PREREQUISITE for the shipped solo mode to be playable to completion"** (the designer-run reached its end only because a human did the CPU-AI's job). | **Motivation, not a roadmap row. Don't queue it — but it now carries the strongest justification in the corpus for E9/K5 + DH-69, with batch 25 the decisive escalation.** |
| **DH-37 (`new1772`)** — no politician-to-politician trading (#1 AMPU-2 wishlist) | `new1772`: players wanted to trade individual pols between factions; not modeled. Pairs with the era-boundary faction-trade window (§27.2 step 1, which IS specced — but that trades whole *factions*, not pols). | **multiplayer / parking-lot.** A small trade-window feature; **not on any critical path.** Park it next to multiplayer + the faction-trade window. | **Parking lot / multiplayer; small.** |
| **DH-38 (`new1772`)** — no late-ratification / "Rogue Island" / amendment-window path | `new1772`: the founding thread had no model for a state abstaining or ratifying late within a multi-year window — decliners were pulled in instead (corroborates `rep1800`/`tea1772` stragglers-ratify-late, #39). | **folds into the Constitutional-Convention era system (E1 federalism / founding).** Model abstaining + a multi-year amendment-ratification window rather than force-including decliners. | **Folds into the federalism/founding era epic (E1).** |
| **DH-39 (`new1772`)** — all-human Convention deadlock unhandled | `new1772`: with every faction human, a Constitutional/nominating Convention can deadlock with no resolution path (the all-CPU and solo paths dodge this). **Multiplayer-relevant.** | **convention machinery.** A deadlock-resolution rule for the all-human case (timeout / forced-compromise) — owned by the convention epic; matters once hot-seat multiplayer (M1) exists. | **Convention machinery; multiplayer-relevant.** |
| **DH-40 (`new1772`)** — SCOTUS justice-count bill not auto-packaged with establish-court → game STALLS | `new1772` POST 2317, 3053, 3096: "Establish Federal Judiciary" + "Set the Number of Supreme Court Justices to 6" are **two separate bills**; GM ruled they are NOT auto-packaged — if the court passes but the count bill fails, **the game cannot advance** (the SCOTUS phase is skipped every turn until justices exist; both failed repeatedly). | **bug-fix in the bill-packaging / SCOTUS-establish path.** Either package the two bills, or guard the stall (the establish-court bill carries a default count, or the SCOTUS phase no-ops cleanly until a count is set). Lands in the bill-packaging work + the founding offices-by-law layer (#101). | **XS-S bug-fix; in the bill-packaging / SCOTUS-establish path.** |
| **DH-41 (`tea1772`)** — ★ general SCOTUS-ruling → downstream-statute cascade is UNBUILT and DEFERRED | `tea1772` POST 124-126: a spectator argued **Prigg v. Pennsylvania** should auto-void the Fugitive Slave Act; `vcczar` deferred — *"V will need to think about it."* Distinct from the *built* strike-a-single-law (POST 770-784) and overturn-an-amendment-on-review (#100). **Today a contradicting ruling leaves the law operative.** | **author-before-build (PARKING LOT).** A genuinely undesigned cascade: does a ruling that contradicts a law on the books void/neuter that law, or leave it operative (current default)? Author the policy before building it. Cross-refs §24.4's *Pollock*→income-tax coupling (which IS a designed gate). | **Design task; PARKING LOT. The headline batch-8 author-before-build item.** |
| **DH-42 (`tea1772`)** — national meters swamp per-state lean → no disputed/close elections | `tea1772`: national meters dominate the per-state `bias` so heavily that elections are rarely close/disputed — a realism hole. | **balance.** Re-weight national-meter vs per-state-lean contributions in the election math so close races can occur. Folds into the per-state-bias / election-math epic. Relates to DH-34's static-bias theme. | **Balance dial; folds into the election-math epic.** |
| **DH-43 (`new1772`)** — Vermont has no home-state mapping | `new1772`: Vermont-origin pols have no home-state mapping → they cannot relocate "home." | **dataset/data fix.** Add the Vermont home-state mapping (VT enters via the expansion path; ensure its `homeStates`/region wiring exists). | **XS; dataset/data fix.** |
| **DH-44 (`new1772`)** — post-12A legislature-state vote count undecided | `new1772`: for legislature-chosen states post-12A, the vote count is undecided — Kingmaker votes vs a Gov+Senators+focus-Reps headcount (also a `rep1800`/`hd` open Q). | **author + fold into the 12A election-mode toggle (#93 / divergence #20).** Decide the canonical legislature-vote count when building the legislature-majority resolution branch. | **Folds into the 12A toggle (#93 / divergence #20).** |
| **DH-45 (`nuke`)** — USSR-collapse chain broken (USSR never falls) | `nuke` POST 11055-11060: the dissolution chain stalls at a ~5% first-gate; the USSR is a live ally in 2005. | **trigger re-tuning; folds into diplomacy + Cold-War-content.** Re-tune the gate odds / requirements so the chain can fire; couples to DH-46 + the Cold-War-end triggers. | **Folds into the diplomacy subsystem (#107) + Cold-War content.** |
| **DH-46 (`nuke`)** — relation meters "allied with everyone" (no downward pressure) | `nuke` POST 9952, 10841: revision-to-mean + ambassador bonuses with **no downward pressure** → allied with all 8 nations by the late-90s. | **mechanic/balance; folds into diplomacy (#107).** Add downward pressure + the Cold-War ≤Neutral cap on USSR/China (lifted only by a thaw EraEvo). | **Folds into the diplomacy subsystem (#107).** |
| **DH-47 (`nuke`)** — ★ generic war engine NEVER resolves + no branches + no white-peace | `nuke` POST 5422-5424, 1101-1102, 6357: war-end roll odds so low Korea ran ~2 decades; army generals command navies; white peace rarely possible. A **§21.1 / generic-war hole**, NOT Cold-War-specific. | **build into the generic-war epic (#6).** Build a real **resolution/peace path** (wars must be able to end) + ideally army/navy/air **branches**. Couples to DH-12 white-peace. | **Folds into the generic-war epic (#6); the resolution-path part is load-bearing for ANY war.** |
| **DH-48 (`nuke`)** — ★ era-event data needs a STRUCTURED `evDelta`/census field | `nuke` POST (§28.9): the Neocon-era census/EV-delta event block was **LOST** (alphabetical-by-era storage; EV events lacked "EV" in flavor text). Same theme as DH-36. | **structured-data REQUIREMENT.** Add a typed `evDelta`/census field on era-event rows (NOT free-text) + per-era completeness validation at dataset build. **Refines K3/K4 — the structured-era-event-data requirement.** | **Folds into K4 era-content + the dataset-build validators.** |
| **DH-49 (`nuke`)** — ★ Wyoming Rule + per-decade census un-implementable without a population model + House cap | `nuke` (§28.13): the decennial EV reallocation + Wyoming Rule have **no population model + House cap** to read; `State.electoralVotes` is a static seed. | **author-before-build / parking lot.** Add a population model + House cap, or scope it INTO the census/apportionment epic (#34/#55) once the model is authored. | **Parking lot (or sized into the census epic). No model exists today.** |
| **DH-50 (`nuke`)** — event firing-rate bimodal (~5% pre-Terror vs ~25% in-Terror) + 15/era cap | `nuke`: the era-event scheduler fires ~5% pre-Terror but ~25% in the Era of Terror; a 15-event/era cap. | **scheduler balance.** Smooth the firing rate; lands with the scheduling-fork decision (#4 / BUG-1 / DH-30) — same surface. | **Folds into the era-event scheduling work.** |
| **DH-51 (`nuke`)** — modern pols overpowered / recency-biased | `nuke` POST 11460: "Elon Musk… way too overpowered; we need to go through all recently added 'modern era' pols." | **dataset balance (author-time).** A parity pass on the modern dataset slice — `scripts/` work, NOT engine. | **Author-time dataset balance; the `scripts/` pipeline.** |
| **DH-52 (`nuke`)** — ★ landslide-margin-cap model MISFIRES on blowouts | `nuke` POST 10093-10219: the 2004 all-53-states sweep exposed max-margin caps keyed to historical lean (won Idaho by 50, capped at +10 in tossup NH). | **election-math balance.** Re-model the margin caps. Relates to DH-42. | **Folds into the election-math epic.** |
| **DH-53 (`nuke`)** — bill→meter effect tables missing/illogical | `nuke`: some bills lack sensible meter-effect mappings (same surface as DH-14 era-aware bill impacts). | **author + content.** Era-keyed bill-impact tables on the catalog. | **Folds into the bill-catalog / era-content work.** |
| **DH-54 (`nuke`) → ★ now 3-THREAD with DH-33 + DH-66 (`ideo1928`)** — ★ impeachment / VP-vacancy fill NEVER in the rules doc | `nuke` POST 6674-6676: no impeachment trigger (Watergate-analog went undetected → pure upside); VP-vacancy fill "made up as we go." Corroborates DH-33 (`rep1800`) + `hd`. **★ Batch-18 (DH-66, `ideo1928` POST 816-861) is the THIRD thread confirming the subsystem broken** — an impeachment trial was VOIDED mid-run (under-specified article generation / trial-firing / Controversial-vs-<3-judicial) and Ted drafted a rewrite that is NOT yet final. Verified: **0** `impeach` hits in `src/`. | **author-before-build (PARKING LOT).** Author/await the impeachment + succession ruleset (Ted's `ideo1928` rewrite is pending) BEFORE building the institutional layer (#112 / #61). | **Parking lot; await Ted's pending rewrite, then author into the institutional layer. Now 3-thread (DH-33/DH-54/DH-66).** |
| **DH-55 (`nuke`)** — engine HARD-WIRED to 2 parties | `nuke` POST 8845-8850: a winning 3rd-party candidate just becomes that side's Party Leader; no dynamic party creation. | **constraint; folds into the 3rd-party trigger (#48).** Treat as a known constraint; dynamic party creation is an AMPU-2 wish. | **Folds into the 3rd-party trigger (#48); dynamic parties are AMPU-2.** |
| **DH-56 (`nuke`)** — conflicting career-track interest rule-sets | `nuke`: multiple incompatible career-track rule-sets observed. Relates to DH-25 career-track bootstrap. | **author one canonical rule.** Parking lot, with DH-25. | **Parking lot; pairs with DH-25.** |
| **DH-57 (`nuke`)** — brokered-convention ballot-2 delegate-release ignores the primary | `nuke` POST 6466-6470: ballot 2 releases delegates that swing 80/20 to the momentum leader, IGNORING the primary result; GM flagged it unresolved ("the primary results should still have some kind of influence… we have not figured out [how]"). | **convention DESIGN hole.** Owned by the convention epic / CPU handler #5; the GM has no canonical fix yet — author one. | **Folds into the convention epic / handler #5 (DH-8 family).** |
| **#115 (`dem1820`)** — ★★ NO documented scenario-CREATE procedure ("no rules for how to create a game") | `dem1820` POST 92: *"rules… on how to create a playtest is maybe our greatest need but to date nobody has stepped up to write one."* Verified: no shared boot abstraction (`GameContext.tsx:264` → hand-authored `scenario*.ts` builders). **The build's scenario-boot pipeline IS the spec.** | **PROMOTE to front of queue (NOT a new keystone — lands in K4's `BootSheet`).** Factor `scenarioBoot(BootSheet)` ONCE, with the first new scenario. Encode the undocumented setup rules (boot-Command, CT-seeding, Senate-class, vacant-seat fill, era-industry). | **Headline batch-10 item; see §9.1.9.** |
| **#115a (`dem1820`)** — boot-Command house rule (strip Command from ≤40 boot pols w/o a job) | `dem1820` POST 62/79/82: GA stripped Command at boot — *"nobody should be born with command"* — undocumented; a player drafted pols *for* their Command and was blindsided (POST 79/91). | **DECISION-GATED (open Q #1).** A `bootCommandPolicy` sheet field; **human decides** whether dataset Command survives below an age/office threshold. Author before wiring; the pipeline itself is unblocked. | **XS once decided; needs a human call (balance-load-bearing).** |
| **#115b (`dem1820`)** — appointment-eligibility ladder + replacement-gains timing | `dem1820` POST 859 (Senate-appointment ladder: your-party-not-on-CT → … → generate 1-skill pol; appointees 30+; no vacant full-term seat; can't pull a CT pol if a non-CT same-party pol is eligible) + POST 291 (a replacement gets **no stat gains until held through the next appointment/election phase, EXCEPT military — eligible on appointment**). | **author-into the boot/appointment rules.** The ladder is the deterministic vacant-seat-fill the boot pipeline (#115) + the Senate/cabinet phases run; the gains-timing is a one-rule guard on the ability-grant path (`ABILITY_EARN_RULES` area). | **XS each; ladder pairs with DH-25 CT-eligibility (PARKING LOT until that rule is authored).** |
| **DH-24/DH-25/DH-27/DH-36/DH-53 (`dem1820`)** — RE-CORROBORATED from a 1820 start | Senate-class boot wrong → wrong-class 1822 midterm (DH-24); CT "can't run/be appointed" vs "pulled last" contradiction again (DH-25/DH-56, POST 850/859); trait-conflict not flagged in boot data (DH-27, "3.0.34"); **2nd GM-burnout-killed game** (DH-36, POST 900); bill EV-effect mis-signed "until-passed −1 EV" vs "when-passed +1 EV" (DH-53, POST 462-466). | See each DH's row + §9 batch-10 block. DH-53 verified as an **unbuilt** mechanic (`EraEventResponseEffect` has no EV field — `types.ts:1448`), so it lands in the structured-bill-effect tables (DH-14/DH-48), not as a sign-flip. | (carried; confidence + the DH-36 automation-reduces-upkeep argument is now 2-thread) |
| **DH-59 (`arkzag`)** — ★ relations meter UNDER-FLOORS below its floor | `arkzag` ch9 POST 1259: *"Japan: 1 → 0 (↓ -1) # Error, should be 1 minimum."* Verified: the build's diplomacy writes clamp to **`-5..5`** (`applyEffect` `phaseRunners.ts:3223`; Lingering drift `:3295`) — there is NO `1..9` floor because the build doesn't yet use the forum's 9-point Hostile→Allies scale (#107). | **clamp / folds into the diplomacy subsystem (#107 / E12).** Not a fix to ship today — the floor is part of building the 9-point relations scale. When E12 lands the per-power 9-point meters, enforce the documented floor (1, Hostile) in the clamp. | **XS once the 9-point scale exists; folds into E12. No standalone patch.** |
| **DH-60 (`arkzag`)** — ★ era-events fire with NO territory/asset prerequisite | `arkzag` ch4 POST 335/337/340: "Force Open Trade with Japan" fires with no Pacific port; "Stubborn Cherokee" fires without owning the territory. Verified: `buildEraEventsForYear(year)` (`eraEvents1856.ts:4`) gates ONLY by `year >= X && year <= Y`; the `EraEvent` type (`types.ts:1466`) carries **NO precondition field** (only 2.4.3 graph nodes use `Predicate`). | **per-event prerequisite gate (the concrete face of #92 territory-gating + BUG-1).** Add a `requires?: Predicate` (territory/asset/state) on the era-event row + a filter at the firing path. SAME surface as BUG-1's era-lock filter (`phaseRunners.ts:2817`) + K3's `territoryOwned` predicate — build it with those. | **S; the concrete instance of #92's territory-content gating. Lands with E15 / BUG-1.** |
| **#116 (`arkzag`)** — ★ NO long-run economic-content state machine | `arkzag` ch11/20/24/25/33: a recurring Bank CRISIS bill that filibusters/returns and is REPLACED by an Independent Treasury; a multi-half-term EconStab CRISIS (Panic-of-1837). Verified: NO economic state machine — `applyEffect` (`phaseRunners.ts:3209`) only nudges the 7 meters; `Legislation` (`types.ts:1506`) has no `type`/`replaces`/`lockedUntilYear`/`resolvesCrisis`. EconStab IS `meters.economic` (`types.ts:1401`). | **NEW economic content engine over the EXISTING EconStab meter.** A `game.economy?` state machine (recurring Bank CRISIS bill keyed to a Panic/EconStab CRISIS state) + a `Bill.replaces` field (Independent-Treasury removes the Bank) + a `Bill.lockedUntilYear` per-bill-class cooldown (tariff cadence). **Sits ON TOP of E4b(b)'s Second-Bank institution object — does not replace it.** See §9 batch-11 #1. | **NEW; depends on E2 (Bill.type/crisis) + E6 (named EconStab + crisis/cascade) + E4b(b) (the Bank institution).** |
| **#119 (`arkzag`)** — ★ amendment lifecycle + legislation-class-block | `arkzag` ch7/13/17/24/25/28/33: amendments propose→committee→floor→**governor-ratify**→active, are **un-bundleable**, and an **active amendment BLOCKS a legislation class** (excise-tax ban; suffrage). Verified: NO `amendments` field today (grep). | **EXTENDS E5.** E5 specs `amendments?: { id; passedYear; data? }[]` + governor-ratify + the *Pollock* bill-class-gate; #119 adds an **explicit lifecycle state** + the **active-amendment-blocks-a-class** hook (the proactive face of the *Pollock* gate, checked at proposal time) + the un-bundleable flag. See §9 batch-11 #1. | **Re-scope E5 to carry the lifecycle + block-hook (do NOT open a new epic).** |
| **#61 (`arkzag`, EXTENDED; ★ `oopscpu` RECONCILED)** — death→succession→acting-president chain UNBUILT | `arkzag` ch27: assassination KILLS the president → VP succeeds under the "13th"/VP-vacancy amendment → must fill VP → acting-president whose actions a trait DIVERTS (Easily Overwhelmed → 50% VP-acts). Verified: the KILL exists (`assassination-killed` anytime event, `anytimeEvents.ts:232`) but death just sets `presidentId = null` (`vacateOffice`, `phaseRunners.ts:2446-2449`) — **NO succession engine.** | **EXTENDS E10b.** E10b scopes the leaf (`successionOrder?`/`bornForeign?`/`actingPresident?`, the 0-Command-inert state); #61 here adds the **assassination→succeed→fill→action-DIVERT-roll wiring** (gated on the §29.8 VP-Vacancy amendment being `active`) + the trait-acquisition side-effect. **★ Batch-13 (`oopscpu#POST 324-329`, Ted-RULED) gives E10b a RECONCILED two-branch spec: a clean DEATH → VP = FULL President (refuses "Acting", NO action-divert roll, NOT auto party/faction leader → re-run the leadership IRV, handler #3); the acting-president + action-divert read is SCOPED to incapacity / 0-Command-inert / ineligible-substitute ONLY.** This SUPERSEDES the `arkzag` framing for the death case and removes the spec ambiguity. See §9 batch-11 #1 + batch-13 lead #3. | **Re-scope E10b to carry the full RECONCILED chain (do NOT open a new epic). Gated on E5's VP-vacancy amendment. The death-branch (full-President + leadership-IRV re-run) is the `oopscpu` addition — S within E10b.** |
| **★ #143 (`oopscpu`)** — post-election Command-decay pass UNBUILT (RULED) | **VERIFIED:** `loseCommand` (`abilities.ts:15`) is called ONLY at `phaseRunners.ts:2410` (old-age/Anytime loss) + `:2709` (event effect); the defeat penalty at `revolutionaryWar.ts:137` uses `loseSkill`, not `loseCommand`. **NO post-election Command-decay pass.** Ted-RULED (`oopscpu#POST 1, 224`): every living pol NOT on a Pres/VP ticket that cycle has a **40% chance of −1 Command** ("shit or get off the pot"). | **Add one pass** at `runPhase_2_10_End` (`phaseRunners.ts:4171`), gated on `isPresidentialYear` (`year % 4 === 0`), AFTER the 2.9.4 ticket roster is known; roll 40% per eligible pol; apply −1 via `loseCommand`. NEW, RULED, standalone — no design gate. Pairs with the #85/#130 death-schedule discipline (same `runPhase_2_10_End` site). | **XS quick-win; ship with the other XS consistency PRs (Phase-1 #19) or near QW0.** |
| **★ DH-61 (`oopscpu`)** — scenario-boot does NOT seed era-active wars | **VERIFIED:** only the 1772 Rev War is boot-seeded (`revolutionaryWar.ts`); every other start boots at peace. Ted-noted (`oopscpu#POST 338-344`): 1788 should start with the **Northwest Indian War** running (20%-loss / WS −2) — the GMs forgot it. | **Add `BootSheet.activeWars` + a boot hook** in `scenarioBoot` that reads a start-year "active wars by start date" table and instantiates each as a running `War` via the generic `War` model (Phase-1 #3). | **S; folds into the `scenarioBoot` pipeline (K4, §9.1.9). A HARD prerequisite for `scenario1788` — land WITH E1.** |
| **★ DH-62 (`oopscpu`)** — pre-12A two-votes-per-state / no-ticket EC mode UNBUILT | **VERIFIED:** `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`) resolves every state by PV+dice with a Pres+VP ticket; no two-vote/no-ticket mode exists. `oopscpu#POST 192-199` exercised the pre-12A mode (top EV = Pres, runner-up = VP, no separate VP ballot) + same-state-EV exclusion (`#POST 197`) across 1788/1792/1796. | **Add an era-keyed election-mode variant** (a new resolution branch alongside `electorsByLegislature`): two undifferentiated votes per state, top-2 take Pres/VP, same-state EV exclusion, anti-tie via the §25.1 pre-12A nomination trio (handler #1). | **M; folds into the per-state-EC + 12A-toggle epic (#93/#5, Phase-1 #4). A HARD prerequisite for `scenario1788` — land WITH E1.** |
| **★ #147 (`gild1868`)** — tariff-as-national-%-rate + mutually-exclusive `MonetaryRegime` UNBUILT (DESIGNED) | **VERIFIED:** tariff is a ±0.5 meter-nudge flavor bill — `BILL_TEMPLATES` "Tariff Increase" `meters:{ revenue:1, economic:-0.5 }` / "Tariff Reduction" `{ revenue:-0.5, economic:0.5 }` (`phaseRunners.ts:3421-3422`); **NO `game.tariffRate` integer, NO `MonetaryRegime` enum**; `Legislation` (`types.ts:1506`) has no `type`/`replaces`. `gild1868` floors competing literal rate-bills ("Set average tariff rate to 36%" vs "to 25% and reform," POST 6240) + gold/bimetal/national-bank regime bills (POST 836, 884). | **Add `game.tariffRate:number`** set by a `"Set Average Tariff Rate to N%"` bill type (+ reform variant), subject to the §20.4 change-cadence; **add `MonetaryRegime = 'gold'|'bimetallic'|'freeSilver'|'nationalBank'`** where regime bills are **mutually exclusive** (passing one clears the others — the DH-63 constraint). Replaces the flavor bill. | **M; gilded-content epic (§9.1.10). Depends on the economic engine (#116/E4c) + the bill-relationship graph (#42). NOT a near-term quick win.** |
| **★ #148 (`gild1868`)** — 20-year auto-expiring Reconstruction timer + appoint-by-leadership + Solid-South sunset UNBUILT (DESIGNED) | **VERIFIED:** **NO Reconstruction subsystem** in code (#57 is the readmission/war-victory SPEC; death just nulls the office at `vacateOffice` `phaseRunners.ts:2446`) — no timer, no appoint-by-Speaker/PPT, no bias-sunset. `gild1868` models it as a time-boxed regime: begins 1864, auto-ends 1884 ("to prevent a one-party state," POST 73/76); seceded-state seats APPOINTED — military Govs majority-party Pres-appointed, Senators by PPT-faction, Reps by Speaker-faction, non-seceded appointees (rules 3.0.32/3.0.35, POST 70/143/330); +2 RED bias → Solid-South sunset (FL/GA/LA Blue+3→+5, VA Blue+2→+5, POST 5145). | **EXTENDS the #57/E3b Reconstruction epic (do NOT open a new epic):** a `game.reconstruction = { startYear, endsYear }` regime clock + appoint-seceded-seats-by-Speaker/PPT-faction + a +2-bias-while-active → sunset-to-Solid-South time-boxed per-state modifier + per-state early end by repeal-bill. | **S–M within E3b. Inherits the DH-29 solo-blocker (Strict/Ironclad never passes with CPU) — resolve before any antebellum/CW/Reconstruction scenario ships solo.** |
| **★ #149 (`gild1868`)** — civil-service merit-vs-spoils axis (+ era-gated reform content) UNBUILT (DESIGNED) | **VERIFIED:** **NO civil-service / spoils / merit mechanic** in code. The Gilded brief's "merit not party loyalty … has not happened yet" (POST 1) is a real designed system: the in-game Pendleton Act bill PASSES the 41st Congress (POST 842); "Increase/Decrease State Gov Jobs" gov actions feed DomStab + the spoils economy (POST 770, 803); reform content era-gated (Social Mobility gov action + income-tax bill are Progressive-era-only, POST 811, 2936). | **Add a civil-service/spoils axis:** a merit-reform bill that shifts how appointments are filled + the State-Gov-Jobs spoils lever feeding DomStab + the Honest-Gov't/corruption interplay; **gate reform content** (Social Mobility, income tax) to later eras via the era-content registry. Sharpens #3. | **S–M; gilded-content epic (§9.1.10). Depends on K3/K4 (era-gating).** |
| **★ #150 (`gild1868`)** — "1872 Rule" disorganized-loser-runs-opposite-party-independents special election UNBUILT (DESIGNED) | **VERIFIED:** **NO special-election-condition path** (every state resolves via `calcStateVote` `phaseRunners.ts:3752`). Rule 3.0.17 (Tyler, POST 49): the post-CW disorganized losing party does not nominate normally — at the first election after Reconstruction begins, if party-pref is Red+2/+3 AND a d6 lands 1-2, an opposite-party-independent ticket is fielded, run by the loser's weakest faction (POST 774-775). | **Add a meter-gated "disorganized party" special-election branch** for the era after a civil war: opposite-party-independent nominee, gated by a party-pref band + d6, run by the weakest faction of the loser. | **S; gilded-content epic (§9.1.10). Niche; pairs with #57/#148 + the #48 third-party trigger.** |
| **★ DH-63 (`gild1868`)** — mutually-exclusive currency regimes can both be active (no exclusivity constraint) | **VERIFIED:** `Legislation` (`types.ts:1506`) has no `type`/`replaces` field → currency bills are independent. `gild1868` design-hole: **Bimetallism AND the Gold-Standard Act both active at once despite being mutually exclusive** (POST 6245-6246). Also flags the filibuster carry-over ambiguity (POST 939 — matches the `drums`/`hd` open Q on #10). | **Make currency-regime bills a mutually-exclusive set in the bill-relationship graph:** activating one auto-deactivates the contradictory regimes; resolve the filibuster carry-over ambiguity. | **XS–S; FOLDS INTO #42 (bill-relationship graph) + #147's `MonetaryRegime`. Not a standalone epic — it is the exclusivity constraint those two already build.** |
| **★★ #156 (`hd1`)** — 4-plan Reconstruction model + the UNILATERAL-ADOPT prerequisite UNBUILT (DESIGNED — the canonical DH-29 fix) | **VERIFIED:** the ENTIRE Reconstruction subsystem is absent — grep `Reconstruction\|Ironclad\|readmission\|Confederate\|CSA` in `src/types.ts` → **0 hits** (only the Secession-Winter loyalty scaffold: `// Secession Winter` at `types.ts:981/1149-1157`, `secessionDefectionCount?` at `:1481`). No `game.reconstruction`, no plan enum, no plan-adopted gate, no +2/+1 bias, no appointed-Gov→Sen/Rep cascade. vcczar's restart rewrite (POST 2692-2694): **4 plans (No-plan / 10% / Ironclad-Wade-Davis / Military-district) on BOTH Pres + Congress**; prereq = *"a plan adopted by Congress OR by the President"* (Pres can adopt UNILATERALLY); individual readmission only under Ironclad/Military-district; 15th-Amd = **+2 Deep-South / +1 other-seceded incumbent-party bias while active** + AA men hold office; pardon types both branches; CSA-victory branch. | **The CANONICAL DH-29 FIX — build the authored model into E3b's readmission half:** add `game.reconstruction = { plan; adoptedBy: 'congress'\|'president'\|null; startYear }`; expose the 4 plans as ActionRegistry rows usable from BOTH `runPhase_2_8_1_Executive` (`phaseRunners.ts:3632`) AND the legislation pipeline; the plan-adopted gate fronts every per-state readmission; the +2/+1 **time-boxed bias-while-active** rides the `calcStateVote` bias term (`:3709-3711`, distinct from static `State.bias`). | **M–L within E3b — the HIGHEST-VALUE Reconstruction target: it UNBLOCKS DH-29 (now a designed fix, not an open blocker). Supersedes the §9.1.6 options menu. Depends on the war engine + K2; the unilateral-adopt path removes the K5 soft-dependency for the SOLO case.** |
| **★ #155 (`hd1`)** — war "too easy for the Union" balance pass UNBUILT (the war model itself is unbuilt) | **VERIFIED:** the shipped resolver `runPhase_2_7_2_Military` (`phaseRunners.ts:3593-3627`) is flat `milPower*10 + d100 > enemyPower*10 + 50` (`:3602-3605`), `warScore += win?10:-5` (`:3613`), end at `warScore ±50` (`:3615-3620`); `enemyPower = 1 + Math.random()*4` (`:3603` — RANDOM placeholder, determinism leak AND no real enemy-strength). Generic `War` shell (`types.ts:1532-1546`) has ONE `warScore`, `generals: string[]`, flat `battles[]` — no theaters, no per-theater scoring, no battle-size, no Officer-Mil cap, no end-multiplier. `hd1` critique (POST 1000-1004): end-multiplier too high (LIVE 1.0→0.5), Officer-Mil dominates (5-Mil > all else combined), no enemy-strength term, no battle-SIZE weighting, −1 loss too small; scoring made per-theater LIVE. | **Add to the generic `War` model (built by the war engine #56):** a real **enemy-strength term** (replacing the `Math.random` placeholder, routed through `rng.ts`), **battle-size weighting**, a **cap on the Officer-Mil share** of the success%, and **per-theater scoring + per-theater war-end**. Bake the end-multiplier (1.0-vs-0.5 is a human DECISION-GATE). | **M within E3 — EXTENDS the war engine; pairs with #152 (war-DEFEAT package) on the same model. ★ HARD CONSTRAINT: do NOT over-harden — the 1772 RevWar is a GAME-OVER on loss (`revolutionaryWar.ts`), so keep that war winnable (Euri, POST 1004).** |
| **★ #157 (`hd1`)** — CSA-government seeding under-specified UNBUILT (needed for the CSA-victory branch) | **VERIFIED:** no CSA government in code — `startWar` is injected by the Civil-War EraEvent (`phaseRunners.ts:2978-2981`, `against: 'Confederate States'`), materialized by `applyEffect` (`phaseRunners.ts:3240-3253`) into the generic `War` shell; no CSA Pres/VP/cabinet/general seeding, no Secessionists pool. `hd1` rules define only CSA Pres/VP/Sr-General (Pres = random among seceded Command-holders; Comm-Gen = sole seceded Military-Leader); the GM improvised a full cabinet "for flavor" (POST 893-894), flagged for the suggestions thread (POST 912). | **Add a CSA-government seeding spec** (cabinet + multiple generals/admirals drafted from the seceded Command/Military pool) inside the #58 secession + war epic. Needed for vcczar's CSA-victory branch (POST 2692: seceded pols removed, Unionists move to the nearest loyal state, eventual reintegration). | **S — folds into the #58 secession + war epic. Depends on the per-pol Southern-Unionist/Secessionist gate (also unbuilt — DH-64/#158).** |
| **★ DH-64 / #158 (`hd1`)** — `Southern Unionist` trait mislabeled on Southern draftees (DATASET; trait not even a wired gate) | **VERIFIED:** `Southern Unionist` appears NOWHERE in `src/` as a trait — the only `Unionist` hits are the unrelated faction `fact_blue_unionist` "Unionist Democrats" (`factions1856.ts:7`) + a `// Blue Unionist` comment (`politicians1856.ts:43`). `hd1` (POST 1446, 2682): many Union-officer-settled-South, Black-Republican, and Northern-residing-Southern draftees were UNlabeled → GM hand-fixed across the 1864/1868/1872 drafts. | **(a) DATASET-labeling fix:** audit `Southern Unionist` in `scripts/seedDataset.mjs` CURATED_ROWS (the trait array, alongside the existing `'Nationalist'` tags at `:137-229`) + regenerate `standard-draft-classes.json`, validated at dataset-build time. **(b)** the FUTURE per-pol secession gate (#58) READS this trait. | **XS — joins the #120 dataset-umbrella pass (the `Southern Unionist` column on VA/MS/FL/Border draftees). The reader (#58 gate) is separate engine work.** |

---

## 9. Build-sequencing advice

> **This section is written for the roadmap-planner to lift directly.** It is my
> engineering opinion on order, dependencies, and rough size/risk for the
> game-pm gap log (~176 rows across 5+ eras + A1–A9 presentation + the CPU-AI
> cluster #70–#85 + the **batch-6 scenario-boot / endgame cluster #86–#91** + the
> **batch-7 early-republic cluster #92–#99** + the **batch-8 founding/era cluster
> #100–#105** + the **batch-12 designer-rulings cluster #120–#142** + the
> **batch-13 `oopscpu` CPU-validation cluster #143–#146 + OC-1…OC-8 + DH-61/DH-62**
> + the **batch-14 `gild1868` gilded-era content cluster #147–#150 + DH-63**),
> the design divergences (mechanics §19.1, now **#1–#21**), the confirmed bugs
> (incl. BUG-0), and the GM design holes (DH-1/DH-2 + DH-3..DH-11 + DH-12..DH-23 +
> DH-24..DH-28 + DH-29..DH-35 + **DH-36..DH-44 + DH-61/DH-62 + DH-63**). Source: codebase +
> `gilded` + `fed` + `1772s` + `modern` + `hd` + `drums` + `pop` + `rep1800` +
> **`new1772` + `tea1772` + `dem1820` + `arkzag` + `tedchange` + `smallbugs` +
> `oopscpu` + `gild1868` + `hd1` + `terror2000` + `ted1772` + `ideo1928` +
> `fixes2022` + `biden2021` + `planb` + `nixon1972`/`cpufull`/`solo1916`/`trump2024` +
> `modernday` + `pop2012b` + `grass1772` + `rookie1772` + `principle1772`**.
>
> **★★ Batch-25 changes to the plan (`principle1772` / `049ce855` — "Always stand
> on principle… even if you stand alone. A Single Player 1772 Adventure", a
> 1825-post DESIGNER-GMed single-player founding→federalism run. ★ This is the
> 7th captured 1772 thread AND the cleanest, most designer-authoritative
> SINGLE-PLAYER run in the KB: **@MrPotatoTed (the game CO-AUTHOR) IS the GM and
> hand-ran all NINE CPU teams himself** while @vcczar live-ruled, with one human
> [@10centjimmy] on a Washington-led Red team. It is **literally the shipped
> game's intended mode (1-human-vs-9-CPU, #114) demonstrated end-to-end by the
> designer** — and it REACHED A NATURAL ~1800 endpoint (slowed at the GM's
> health/grad-school load, NOT a loss/win/burnout). CORROBORATION-HEAVY [7th 1772
> source]: TWO net-new federalism-era gaps [#177, #178], both in the
> least-covered founding→federalism endpoint, plus the **strongest #114 escalation
> in the corpus**. NO new keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED.):**
>
> > **★ Read this block if you only read one for batch 25.** A designer-run that
> > worked — but ONLY because a human hand-did the CPU-AI's job for nine factions.
> > The load-bearing moves:
> >
> > **(a) ★ #177 — the federalism foreign-affairs DECISION-EVENT spine (a
> > NEXT-ERA BUILD SIGNAL; the build HARD-WALLS it out today).** The late-1790s
> > endpoint surfaced the most-detailed Federalist-era foreign-affairs content in
> > the KB — a spine of **8 president/cabinet decision-events** (French Revolution
> > neutrality/alliance-betrayal, Citizen Genêt, Pinckney's/Spanish Treaty, Jay
> > Treaty, Haitian Revolution, the alt-history "Bourbons Restored" branch, NW
> > Indian War, Bank-recharter), each with per-power diplomacy-relation +
> > DomStab/EconStab + enthusiasm consequences and `realEvent:false` counterfactual
> > branches. **★ Shipped-state CONFIRMED hard-walled (verified):** the era graph
> > THROWS on this content via TWO authoring guards in `eraGraph.ts::validate()` —
> > `:153-155` rejects any node with `chartIndex >= 49` ("French Revolution /
> > Federalism is out of scope") and `:150-152` rejects any `president`/`cabinet`
> > decider ("no President/Cabinet pre-1789"); **every event in this spine is a
> > post-1788 president/cabinet decision-event**, so authoring it requires LIFTING
> > BOTH walls (and gating president/cabinet deciders on `year >= 1789` instead of
> > forbidding them outright). It also needs **per-power diplomacy-relation meters**
> > on the snapshot (none exist today — `grep relation|diplomacyMeter|foreignRelations
> > in src/` finds no per-nation relation field) + implementation-blunder rolls in
> > the decision layer. **This is the federalism-side companion to §20.3's `fed`
> > spine, from a 7th 1772 angle — DESIGNED content the era graph deliberately
> > omits, the clear intended next-era fill.** **Where it binds:** `eraGraph.ts`
> > (lift the 2 walls + a `year >= 1789` decider gate), a new federalism era-graph
> > content file (the 8 decision-events + alt-history branches), a per-nation
> > diplomacy-relation meter on the snapshot, and the §10.4.1 multi-decider /
> > implementation-blunder layer. **Size: M; folds into E1/scenario1788 +
> > era-event/eraGraph (#92) + couples to E12 diplomacy (#107/#162).** Open Q
> > (designer-gated): confirm this is the intended next-era build, not a permanent
> > scope wall; V deferred the EV/territory-event %-chances (POST 1801), so firing
> > probabilities are not yet authored. game-mechanics §20.3.1.
> >
> > **(b) ★ #178 — treaty-grants-TERRITORY + the bounded "3-strikes" retry budget
> > (generalizes DH-61).** A NEW territory-acquisition class the build has no path
> > for: the **Jay Treaty** (a president decision-event) grants WI/IN/IL/MI on
> > signing — "Marshall refused it twice, then signed Attempt Two → gained
> > WI/IN/IL/MI" — and the GM ruled a **per-event retry budget**: a territory-gating
> > event may fire **up to 3 times** before the land is **permanently lost** (the
> > same "3 chances" rule that ORIGINATES at the NW Indian War, POST 207). **★
> > Shipped-state CONFIRMED unbuilt (verified):** `admitState` (`territories.ts:8-23`)
> > admits ONLY from the static `EXPANSION_STATES_BY_ID` registry, driven by 1772
> > era-event `postEffects` — **no treaty path, no bill path, no per-event retry
> > budget** (`grep treaty|retriesRemaining|retryBudget in src/territories.ts` =
> > ZERO). The fix = a **treaty→`admitState` post-effect path** (a president
> > decision-event whose effect calls `admitState` over a list of states, the
> > Oregon-Treaty pattern, §10.4.2) **+ a `retriesRemaining` (default 3) per-event
> > budget** on territory-gating events. **★ This GENERALIZES DH-61** (boot-must-seed-
> > era-active-wars / the "3 chances" rule) into one reusable per-event retry
> > primitive spanning treaty, war, AND event gates. **Where it binds:**
> > `territories.ts` (treaty post-effect path), the era-event/`EraEvent` type
> > (a `retriesRemaining` field + the retry-on-fire mechanic). **Size: S; folds
> > into the statehood/territory work + DH-61.** Open Q (designer-gated): is
> > ≤3-fires canonical for ALL territory-gating events, or a GM house rule?
> > game-mechanics §17.6.1, §21.5.
> >
> > **(c) ★★ #114 ESCALATED — the designer-run is the KB's STRONGEST proof the
> > shipped solo mode is COMPLETABLE only when the app's CPU-AI absorbs the
> > per-faction sim (escalates E9/K5 from nice-to-have to LOAD-BEARING
> > PREREQUISITE).** This is a JUSTIFICATION escalation, not new scope. Every
> > prior 1772 solo/2-player run (`new1772`/`grass1772`/`rookie1772`) DIED to
> > manual-upkeep/CPU-bookkeeping burnout before reaching an endpoint;
> > `principle1772` is the FIRST 1772-cluster run to reach a natural endpoint —
> > and it did so **ONLY because the designer himself hand-simulated all nine CPU
> > factions** (their cabinets, draft lists, leadership votes, event responses;
> > he even REWROTE the CPU career-track heuristic mid-run, POST 323). The run
> > thus simultaneously proves the shipped 1-human-vs-9-CPU shape (#114) IS
> > sustainable AND quantifies exactly what the app must own to make it sustainable
> > WITHOUT a designer-in-the-loop: the entire per-faction CPU sim (the E9 handler
> > suite + K5 CpuController scaffold). The cluster now carries BOTH ends of the
> > argument — 4 GM-burnout deaths (the cost of NOT having it) AND a designer-paid
> > success (the proof of what it takes). **★ Shipped-state CONFIRMED unbuilt
> > (verified prior batches, unchanged):** `grep cpuHandler|handlerSuite|
> > runCpuFaction|perFactionSim in src/` = ZERO; only inline `isPlayer`/
> > `playerFactionId` gates scattered through `phaseRunners.ts`. **No re-sequence;
> > this RAISES priority/confidence on E9/K5 (and reflects on #114/DH-36), it does
> > NOT add scope.** game-mechanics §25, §29.1, §30.15. debt #114/E9/K5.
> >
> > **(d) CORROBORATION (confidence ↑, no items):** **#176 founding MilPrep
> > ordering bug is now DESIGNER-FLAGGED + 3rd-source** — Ted himself flagged
> > LIVE that the auto-forced war bills can't raise MilPrep (Militia Act is
> > federalism-only) and that the Army/Navy bills fire AFTER the Military phase
> > that needs them ("Seems… dumb," POST 73, 259-261); this is the
> > designer-acknowledged confirmation of the batch-24 #176 finding (still a
> > content/authoring constraint to honor when founding war-content + a meter-prereq
> > ladder are built, NOT a regression — the build has no tier-prereq system yet).
> > **#153 command-bootstrap is now 4-source overall** — 1st President = Abraham
> > Whipple, an emergent Iron-Fist Admiral with no celebrity head start (Washington
> > went Unlikable + LOST Canada → never President), confirming Presidents emerge
> > from play. Plus 7th-angle corroboration of the founding cluster (#86 boot / #133
> > CC 4-3-2 table / #100 sway-driven ahistorical Constitution — Hamilton swung
> > racial-minority suffrage in → DomStab crisis + 2 minority pols draftable / #101
> > offices-by-law incl. the DH-40 "Judicial Act vs Judiciary Act" naming bug / #92
> > era-as-content-band / #62 pre-12A VP=runner-up / #31 cabinet-region-snub
> > election penalty / #45 concurrent multi-war + loss-debuff / #155 French-alliance
> > unloseable flag + #158 solo-RevWar-losable), and the kingmaker per-turn-protégé
> > cap (V ruled ≤1/turn, POST 224). **Decision-gated RECOUNT: 0** (#177 scope-wall
> > + #178 ≤3-fires canonicity are designer-gated WITHIN their own work, not new
> > top-level decisions). **No NEW keystone, NO re-sequence; top of queue UNCHANGED**
> > (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the CPU-AI cluster (E9/K5)
> > now carries the corpus's strongest justification, and #177/#178 are the
> > federalism-era next-build content. game-mechanics §30.15.
>
> **★★ Batch-24 changes to the plan (TWO founding-era playtests — `grass1772`
> [`5b1b2c33`, "The Grassroots Divide — A 1772 Two-Player Populist Showdown", a
> 544-post 2-human-vs-8-CPU run that DIED of CPU-bookkeeping burnout then
> relaunched by ADDING humans] + `rookie1772` [`0039e941`, "We must hang
> together…", a 1445-post one-player ROOKIE solo run of the most-complex era].
> These are the **5th and 6th captured 1772 threads** — the KB's most-covered
> era. CORROBORATION-HEAVY: ONE genuinely-new founding rules gap [#176], the
> rest is the strongest onboarding/solo-app/CPU-burnout evidence yet + war-engine
> edge cases. NO new keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED — but the
> onboarding/solo-app/CPU-AI cluster's JUSTIFICATION is now the strongest in 24
> batches.):**
>
> > **★ Read this block if you only read one for batch 24.** Two 1772 runs, both
> > of which DIED to manual-upkeep/CPU-bookkeeping load, not a loss/win. Nothing
> > re-sequences the keystones; the load-bearing moves:
> >
> > **(a) ★ #176 — founding MilPrep hard-capped at 2 for the whole Era of
> > Independence (the ONE net-new gap, surfaced INDEPENDENTLY by both runs).**
> > The forum's spreadsheet wires MilPrep tiers 3-4 to the Militia Act (a
> > federalism-era ~1792 bill) while the auto-forced 1774 war bills (Continental
> > Army / Continental Navy) point at the HIGHER tiers (5-6) → every forced-war
> > MilPrep roll is wasted, every game, and the founding era sits in a permanent
> > Military-Preparedness crisis (`grass1772#POST 86-90, 121`; `rookie1772#POST
> > 26, 32-33`). **★ Shipped-state nuance (verified):** the build does NOT have
> > this bug yet because **it does not have the tier-prerequisite system at all** —
> > `scenario1772.ts:9-17` boots `military: -2` as a RAW numeric `NationalMeters`
> > field clamped to `[-5,5]` (moved by bill `effects.meters` deltas, e.g.
> > `phaseRunners.ts:3638`); `revolutionaryWar.ts` models NO MilPrep ladder and
> > NO per-tier legislative prerequisites (`grep meterPrereq|meterTier|MilitiaAct|
> > StandingArmy in src/` = ZERO). So #176 is **a content/authoring constraint to
> > honor WHEN founding war-content + a meter-prereq ladder are built, not a
> > regression to patch**: whatever founding MilPrep ladder we author, the
> > auto-forced Continental Army/Navy bills MUST be able to raise the meter
> > (cap ~4-5 pre-federalism, per Cal's reverse-the-prereqs fix), else the forced
> > war legislation is dead rolls. **Where it binds:** the founding bill/meter
> > data (`scenario1772`/`eraEvents1772`) + a (new) meter-prereq predicate +
> > `revolutionaryWar.ts`'s `milPrepMod` battle term. **Size: S; folds into the
> > founding/RevWar content (E1) + #67 meter caps.** Open Q (designer-gated):
> > adopt the reverse-prereq fix or keep the founding military crisis as intended.
> > game-mechanics §17.4. debt #56.
> >
> > **(b) ★★ THE ONBOARDING / SOLO-APP / CPU-AI CLUSTER IS NOW VERY STRONGLY
> > EVIDENCED — the meta-roadmap headline (NO new scope; it RAISES the
> > justification of already-scoped items).** Both runs are the cleanest KB proof
> > that **the manual CPU-faction simulation + opaque rules are what KILL
> > playtests.** `grass1772` DIED specifically because 2 humans couldn't hand-run
> > 8 CPU factions ("didn't have the time to run the two player factions AND all
> > 8 CPU factions", `#POST 328`) and the fix was to ADD humans to offload the
> > CPU work (`#POST 348`, relaunched 8-human + 2-CPU); `rookie1772` is the
> > **strongest onboarding signal yet** — a self-described rookie hits documented
> > walls on phase-processing, meter-prerequisites, phase-order, the era
> > transition, and (headline) the **Lingering phase: "which I have never run
> > before… more complicated than I expected"** (`#POST 1370`), needs constant DM
> > help, finds the solo run "a part time job" (`#POST 36`), then ALSO dies to GM
> > time-burnout (`#POST 1444`). With `modernday` (batch 22) + `pop2012b` (batch
> > 23) this is the **4th GM-burnout death** in the recent corpus. **These map to
> > items ALREADY in the roadmap — DH-69 (no in-app rules/legal-move surface,
> > debt #53), #114 (CPU-AI must own the per-faction sim = the E9 handler suite +
> > K5), DH-36 (GM/manual-upkeep burnout = the build's META-justification).**
> > **★ Shipped-state CONFIRMED unbuilt:** `grep rulebook|legalMove|
> > availableActions|helpPage|tutorial|onboard in src/` = ZERO (no rules/help/
> > legal-move surface); `grep cpuHandler|handlerSuite|runCpuFaction|perFactionSim
> > in src/` = ZERO (no CPU per-faction handler suite — only inline `isPlayer`/
> > `playerFactionId` gates scattered through `phaseRunners.ts`, e.g. `:89, :253,
> > :271, :846-866`). **The single biggest lesson across 24 batches: the load-
> > bearing "make it playable solo" investments are (1) the app's CPU-AI owning
> > the per-faction sim (E9/#114 + K5) so ONE human runs ONE faction not ten, and
> > (2) an in-app guided phase-processing + rules/legal-move surface (DH-69) so a
> > solo player never has to ask "how do I process X."** A legal-move enumerator
> > is the SAME primitive the CPU action-picker needs — DH-69 and E9 share the
> > affordance. **No re-sequence; this RAISES priority/confidence on E9/K5 + the
> > DH-69 UX item, it does not add scope.** game-mechanics §29.1, §17.7. debt #53.
> >
> > **(c) ★ #153 command-bootstrap — now a 4-SOURCE corroboration (Bartram).**
> > `grass1772` confirms the master polSet is "the set where almost no one starts
> > with command" (`#POST 538-540`) and produced a **2nd emergent President** — a
> > 90-yr-old CPU botanist (John Bartram) elected 1780 from a near-0-Command boot
> > on Egghead/Celebrity + home-state + luck (`#POST 202-205`), exactly the
> > `ted1772`-St.Clair "someone with none of the requirements ends up President"
> > energy. With `ted1772` + `cpufull` + the two batch-24 runs, #153 (rookies =
> > 0 Command; PV-not-Command drives elections; emergent gameplay-driven
> > Presidents) is now a **high-confidence 4-source finding** — corroboration only,
> > the build already zeroes rookie Command and PV already drives elections
> > (`pv.ts`/`computePV`). game-mechanics §17.5. (no new debt row)
> >
> > **(d) ★ Minor war-engine constraints (two XS/small founding war items):**
> > **(i)** the **doubled-officer Planning term can exceed the 0-5 ability cap** —
> > `revolutionaryWar.ts:212` computes `secWar?.skills.admin != null ?
> > secWar.skills.admin + general.skills.military : general.skills.military * 2`,
> > so a general at Mil 3+ yields `*2 = 6+`, above the 0-5 max Ted flagged
> > (`rookie1772#POST 35`). **Clamp the doubled term to 5.** XS, in the war engine.
> > **(ii)** the **war engine needs a scripted-event win path** — `grass1772` won
> > Independence in 1780 via the scripted "King George III Grants America
> > Autonomy" event (`#POST 163`), NOT a battle threshold or the French alliance.
> > Today `runRevWarBattles` (`revolutionaryWar.ts:254-264`) ends a war ONLY via
> > `currentGroundWins >= groundWinsNeeded` (battle threshold) or the
> > `frenchAlliance` no-loss path — there is **no scripted-event win hook**. This
> > is now a **3rd distinct RevWar win-path in the KB** (battle-threshold /
> > French-alliance-unloseable / scripted-autonomy-event); **the generic `War`
> > model the war engine builds (Phase-1 #3, #155/#56) must support an
> > event-driven win, not only a battle threshold.** Folds into the war-engine
> > work, no new epic. game-mechanics §17.4. (notes on debt #16 + the war row)
> >
> > **(e) CORROBORATION (confidence ↑, no items):** the founding cluster
> > (#86 boot / #133 Continental Congress 4-3-2 delegate table + Articles 9/13
> > flip / #100 convention pipeline + ahistorical/mutable-threshold Constitution /
> > #101 offices-by-law + ambassador-prereq diplomacy / #92 era-as-content-band:
> > Lingering/retirements/SCOTUS OFF in Independence, ON at the 1788 boundary, per
> > `rookie1772#POST 199, 1198`) is re-confirmed from a 5th AND 6th 1772 angle;
> > #67/#134 Lingering-too-complex-to-hand-run gets a 2nd-source hit (`rookie1772`
> > "never run before"); #68 per-era point-banking + draft-order-by-last-era
> > re-confirmed (`rookie1772#POST 1196-1198`); the d3-vs-d6 election-dice desync +
> > incumbency-bonus flip-flop (`grass1772#POST 144-148, 239-245`) reinforces
> > "the build owns ONE canonical election formula"; enthusiasm semantics
> > UNRESOLVED even to the designer (`grass1772#POST 322-327`) reinforces the
> > #18/#51/#124 FROZEN-SPEC risk flag (debt #1). The 2-human collusion that
> > forced an ahistorical UNICAMERAL Constitution (`grass1772#POST 186-187`) is a
> > multiplayer-only dynamic the solo CPU must approximate. **Decision-gated
> > RECOUNT: 0** (the #176 reverse-prereq question is designer-gated WITHIN the
> > founding/meter work, not a new top-level decision). **No NEW keystone, NO
> > re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot →
> > E1) — but the onboarding/solo-app/CPU-AI cluster (E9/K5 + DH-69) now carries
> > the strongest justification in the corpus.
>
> **★ Batch-23 changes to the plan (`pop2012b` / `409a7c18` — "Era of Populism — AMPU
> Playtest, 2012 Start Date", a 939-post 2012-START modern multiplayer; GM **Rodja** but
> **MrPotatoTed (game co-author) plays here and his in-thread point-of-order corrections
> are DESIGNER-AUTHORITATIVE**. This is the **2nd, DISTINCT 2012-start "Era of Populism"
> run** [`pop`/`c50d9da7` is the FIRST] — same seed/factions, different players/outcome
> [Ron Paul wins the GOP nom, flips OH+FL in a losing general; thread dies at GA-burnout
> ~the 2014 cycle]. CORROBORATION-HEAVY: a 2nd independent 2012-boot re-confirms the entire
> modern cluster. TWO net-new gaps [#174, #175], both legislation-data details; the rest is
> clarifications + a predicate sharpening. NO new keystone, NO re-sequence, TOP-OF-QUEUE
> UNCHANGED):**
>
> > **★ Read this block if you only read one for batch 23.** This batch is
> > **corroboration-heavy + two committee/legislation-data gaps that sit in EXISTING epics**;
> > nothing re-sequences the keystones. The load-bearing moves: **(a) ★ #174** is the
> > **fullest committee-bill-packaging spec captured anywhere in the KB** (`pop2012b#POST 724`
> > verbatim) — a **ranking-member un-package/repackage COUNTER-mechanic** (5 trait gates) +
> > two **chair-add-bill** powers (5 Legis+Efficient → off-committee tax; 5 Legis+Magician →
> > one off-topic) + the **cross-chamber/cross-committee package guards** + the **Puritan
> > committee-voting rule** → it **FOLDS INTO the committee/bill-packaging epic E14b (#8/#9/#12)**
> > on top of the chair-block/package. **★ Cross-check the 5 gates + chair-add powers vs.
> > `tedchange` BEFORE building** (open Q logged). Size S–M. **(b) ★ #175** is a **small
> > law-repealability DATA MODEL** (MrPotatoTed designer ruling, `#POST 687-688`): add
> > `Legislation.repealable: boolean` + a `lawClass` tag (`repealable` / `replace-only` /
> > `permanent`); gate Repeal on the flag, expose Replace for tax/immigration laws, mark
> > statehood `permanent` → **FOLDS INTO #42 (the bill-relationship graph, §12.9) + §27.5
> > (statehood-by-bill)**. Size S. **(c) ★ #15 VP-rubric age checks + cabinet-decline-CPU-only
> > are CLARIFICATIONS, not new build** — the canonical tables/code-intent were ALREADY
> > correct (the rubric is "+1 if YOUNGER than 60", and cabinet accept/decline %s are CPU-only);
> > this batch just pins the AUTHORITY (MrPotatoTed) + the `canBeIndependent` tag (row 7 reads
> > a discrete pol flag, not out-of-office status) + the `isCPU` gating on the decline rolls.
> > No code surface beyond what E16 / the convention rubric already scope. **(d) ★ #88 fires at
> > the meter FLOOR band, NOT "Crisis" — a PREDICATE SHARPENING** of the existing #88/#158
> > end-condition work: `pop2012b` shows Planet's Health hitting "Crisis" (and Rev/Budget
> > "Crisis") with **NO apocalypse clock** (`#POST 632`), pinning the trigger to the bottom
> > tier one band BELOW Crisis. The build predicate is `meter === floorBand`, not
> > `meter <= crisisBand` — no new item, just the correct predicate on debt #28 + §9.1.4. **(e)**
> > a **2nd 2012-start CORROBORATION** of the modern cluster (boot/primary→convention→general/
> > SCOTUS/cabinet/leadership/meters/12A-VP) bumps confidence; #90/#43 procedural-pol-gen is
> > LIVE again (2nd corroboration of the dual procedural-gen gates — career-track starvation
> > from the FIRST post-boot draft); and **another GM-burnout death** (Rodja resigns; "freaking
> > hard to be the literal computer") adds a 3rd data point to the DH-36/DH-69/#114 automation
> > argument. The top of the queue does NOT move: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1.
> >
> > **Verified shipped-state of every batch-23 item (grep/Read-confirmed):**
> > **(1) ★ #174 committee packaging + ranking-member counter — UNBUILT; FOLDS INTO E14b.**
> > **★ CONFIRMED zero shipped surface:** grep `rankingMember|packageOf|chairBlock` in `src/`
> > = **ZERO hits**; the committee runner `runPhase_2_6_2_Committee` (`phaseRunners.ts:3463-3496`)
> > reads ONLY the chair (`snap.game.committeeChairs[bill.committee]`, `:3476`) and sets
> > `passed_committee`/`killed_committee` per-bill — **NO ranking member, NO package structure,
> > NO chair-add path.** The committee STATE is chair-only at both `GameState.committeeChairs:
> > Partial<Record<…, string|null>>` (`types.ts:1583`) and `ContinentalCongress.committeeChairs`
> > (`:1350`). **★ Where it binds:** the committee runner (`:3463`) grows the ranking-member
> > action + the 2 chair-add powers; `committeeChairs` grows a ranking-member field (or a
> > parallel `committeeRanking` map); `Legislation`/a new `Bill` carries a `packageOf?: BillId[]`
> > package structure; the Puritan self-ideology abstention reuses the §22.7/§25.6 Puritan-abstain
> > primitive. **★ It STACKS on, doesn't replace, the still-unbuilt #8/#9 chair-block/package
> > (the chair lever and the ranking-member lever are TWO distinct opposing-side levers at two
> > pipeline points)** — build them in one E14b pass, chair-side first. **Size: S–M.** **★ Open Q
> > (designer-gated, BEFORE building): cross-check the 5 ranking-member gates + the 2 chair-add
> > powers vs. `tedchange`** (the official rules-doc channel; this is the fullest packaging spec
> > but is sourced from a single thread). game-mechanics §12.5.1. debt #54.
> > **(2) ★ #175 law-repealability data flag + replace-only/permanent classes — UNBUILT; FOLDS
> > INTO #42/§27.5.** **★ CONFIRMED shipped-state:** the `Legislation` interface
> > (`types.ts:1506-1520`) has **NO `repealable` and NO `lawClass`** (just `id/year/title/
> > description/sponsor*/committee/status/effects/votes`); grep `repealable|lawClass` in `src/`
> > = **ZERO hits**; the floor runner `runPhase_2_6_3_Floor` (`:3498`) resolves only
> > `passed_committee` bills with no repeal/replace branch (the existing #132
> > `Challenge-Legislation-can't-target-REPEAL` is a different guard). **★ The fix (MrPotatoTed
> > designer ruling, `pop2012b#POST 687-688`):** add `Legislation.repealable: boolean` + a
> > `lawClass: 'repealable' | 'replace-only' | 'permanent'` tag — **repealable** (Repeal bill
> > removes it via the normal pipeline; most policy bills), **replace-only** (cannot repeal,
> > only supersede with a same-kind bill; **tax + immigration** laws), **permanent**
> > (irreversible; **statehood** — no Repeal-Statehood bill exists). Gate Repeal proposals on
> > the flag; expose a Replace action for replace-only laws that supersedes (not removes) the
> > prior law; mark statehood + other one-way structural bills `permanent`. **★ Where it binds:**
> > the `Legislation` type (`:1506`) + the proposal/floor pipeline (`:3431`/`:3498`) + §27.5's
> > statehood-by-bill (stamp every admit-state bill `permanent`). **★ This is the authoritative
> > resolution of the `pop` §5.5 data-tag hole + the concrete form of #42's `Not repealable` /
> > replace-by-X / amendment-tier constraints (§12.9)** — build it WITH #42, not as a standalone.
> > **Size: S.** **★ Open Q: is there an authored repealable/replace-only/permanent per-bill
> > list, or is it per-row hand-marked?** (a content/authoring task that joins the #120 dataset
> > umbrella). game-mechanics §12.9. debt #55.
> > **(3) ★ #88 — the apocalypse/coup endgame fires at the meter FLOOR band, NOT "Crisis":
> > PREDICATE SHARPENING, no new item.** **★ CONFIRMED:** the only game-over today is
> > event-driven (`EraEvent.triggersGameEnd` `types.ts:1476` → `phaseRunners.ts:2871` →
> > `game.gameEnded`); there is NO meter-watcher / no per-event-phase game-end roll anywhere
> > (debt #28). `pop2012b` independently confirms the THRESHOLD tier: Planet's Health hit
> > "Crisis" (and Rev/Budget "Rev/Budget Crisis") in a Lingering tick and **NO apocalypse clock
> > fired** (`#POST 632`), so the bottom tier (APOCALYPSE) — one band BELOW "Crisis" — is the
> > trigger, NOT "Crisis." **Build implication:** the countdown predicate (and the §26.4
> > per-event-phase coup rolls, e.g. Honest-Gov) gate on `meter === floorBand`, NOT
> > `meter <= crisisBand`. **No new build item — this is the correct predicate folded into the
> > existing #88/#158 end-condition + APOCALYPSE-clock work (debt #28, debt #32, §9.1.4).**
> > game-mechanics §26.4.
> > **(4) ★ #15 VP-rubric age checks + the `canBeIndependent` tag + cabinet-decline-CPU-only —
> > CLARIFICATIONS; NO new build surface.** **★ CONFIRMED the canonical tables/code-intent were
> > ALREADY right:** the convention VP rubric (game-mechanics §15.3.4) and the §25.2.1 rubric
> > already encode **"+1 if at least one ticket member is YOUNGER than 60"** (and +1 if one is
> > OLDER than 50) — there is **NO "+1 for older than 60"** (a GA mis-scored it; MrPotatoTed
> > corrected it LIVE and it was re-scored). Row 7's "independent / out-of-office / outsider"
> > check reads a **discrete `canBeIndependent` pol TAG** (Ron Paul lacks it despite a 1988
> > third-party run) — **NOT inferred** from office status or party history. Separately, the
> > cabinet **accept/decline percentages are CPU-ONLY** (MrPotatoTed, `#POST 820-821`): they
> > describe what the CPU does; **human players freely accept/decline ANY nomination except VP**
> > (corroborates `pop` §5.19). **Build note (no new item):** when E16 builds the cabinet
> > runner, **gate the accept/decline % rolls behind `isCPU`** (free choice for human-controlled
> > pols, VP excepted); when K2/the convention rubric is built, **row 7 reads the explicit
> > `canBeIndependent` field**, and the age checks are exactly the table — these are CONFIRMATIONS
> > the existing E16 + convention-rubric scope already covers. game-mechanics §15.3.4 + §25.2.1 +
> > §9.1 (cabinet runner).
> > **(5) ★ CORROBORATION (confidence ↑, no scope change):** a 2nd independent 2012-boot
> > re-confirms the **modern cluster** — scenario-boot #86 (no leaders at boot → Major falls back
> > to FL criteria with the omit-leadership→omit-interest/lobby→void-career-track fallback
> > ladder), the **primary→convention→general** pipeline (#47/#13/#15/#16/#18), **SCOTUS** #52
> > (drift, Shenanigans, compelled-retire OFFER, vacate-by-appointment), **cabinet** #25/#112/#124,
> > **leadership** #70 (kingmaker-weighted bloc vote; first-elected-Pres auto-becomes faction+party
> > leader), the **meta-pass** #86 (ideology-shift +bonuses, LW↔RW-Pop circular block #99, kingmaker
> > rules), the **meter→election 2-layer map** #18/#51, and the **12A-gated "Send VP to Shore Up
> > Support"** #91 — all the FROZEN-SPEC items the build already scopes. **#90/#43 procedural-pol-gen
> > is LIVE for the 2nd time** as career-track starvation (the 2013 draft yielded only 15 Dem + 14
> > GOP rookies vs the usual ~100+; players flag generated pols should be appearing) — corroborates
> > the **dual gates** (per-era year-trigger AND dataset-exhaustion fallback, debt #19 + Phase-1 #8).
> > **And a 3rd GM-burnout DEATH** (Rodja resigns as GM; MrPotatoTed: *"it's freaking hard to run a
> > game this complex — to be the literal computer tracking every rule, every role, every trait"*,
> > `#POST 938`) strengthens the **DH-36 / DH-69 / #114 automation argument** behind E9/#55/#115/K5.
> > **Decision-gated RECOUNT: 0** (the #174 `tedchange` cross-check + the #175 authored-list question
> > are designer/content-gated WITHIN their epics, not new top-level decisions). **No NEW keystone,
> > NO re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).
>
> **★★ Batch-22 changes to the plan (`modernday` / `65f81fe8` — "AMPU Modern Day
> Playtest", a 3014-post 2016-START current-rules 8-human modern multiplayer that is
> THE ONLY modern thread to CROSS AN ERA BOUNDARY [the 2024 "Era of Populism"→"Era
> of the Near Future" transition]. GA-run [Rodja→ebrk85] but the marquee rulings are
> designer-blessed in-thread [Ted/vcczar adjudicate]. TWO concrete modern build items
> that sit in EXISTING epics [#172, #173], a CURRENT-RULES live spec-anchor for the
> #68/#2 era-boundary pipeline, the #171 toggle PROVEN flipping ON→OFF within ONE
> save, and two small bugs [DH-69, DH-70]. NO new keystone, NO re-sequence, TOP-OF-
> QUEUE UNCHANGED.):**
>
> > **★ Read this block if you only read one for batch 22.** This batch is
> > **corroboration-heavy + two modern build items that already live in their epics**;
> > nothing re-sequences the keystones. The load-bearing moves: **(a) ★ the #68/#2
> > era-boundary pipeline now has a CURRENT-RULES LIVE INSTANCE** — the 6-clause
> > end-of-era point-banking ritual fired at a REAL 2024 boundary, formula printed
> > verbatim (`modernday` digest §3), matching `rep1800` from a current-rules game, so
> > the spec is now well-anchored for when it's built (no priority change — it remains
> > folded into K3/K4 point-banking, §9.1.5 / debt-adjacent). **(b) ★ #172** is a
> > concrete NEW build item — a **`nuclearOption` per-start-year boot flag + per-track
> > era-keyed CONFIRMATION thresholds** (Cabinet 50%+1, SCOTUS 60% for a 2016 start;
> > Ted-authoritative `modernday` POST 422-423) + the SML-enact/repeal action + the
> > 60→fail→10-vote-conversion→auto-confirm-Mod fallback — it **folds into the
> > cabinet/confirmation epic (E16) + the cloture work (E14c)** and **composes with
> > #124 (auto-pass — whether a vote happens), #52 (who votes aye), #171, and the
> > batch-9 user cloture decision (60%-then-majority; do NOT re-litigate)**. Size S–M.
> > **(c) ★ #173** New-Game **start-year PRESETS = the 14-band era openings** (the GM's
> > own closing verdict: "any new test start date must be the date a new era begins",
> > POST 2964) → a presets table on the scenario-boot picker; couples to scenario-boot
> > (#115). Size S. **(d) ★ #171** the era-keyed draft-restriction toggle is PROVEN
> > flipping **ON (2016-2024) → OFF (at the 2024 boundary)** inside one save (POST
> > 1902) — sharpens debt #48, no scope change. **(e) DH-69** (no in-app rulebook /
> > legal-move surface → players wing it) + **DH-70** (`Lackey` over-weighted in PV)
> > are both small. The top of the queue does NOT move: QW0 → K0/K2 → K3/K4 +
> > scenarioBoot → E1 still lead.
> >
> > **Verified shipped-state of every batch-22 item (grep/Read-confirmed):**
> > **(1) ★ #172 era-keyed confirmation thresholds + Nuclear-Option — UNBUILT (no
> > confirmation/cloture/nuclear-option code exists at all); FOLDS INTO E16 + E14c.**
> > **★ CONFIRMED zero shipped surface:** grep `cloture|filibuster|nuclearOption|
> > confirmationThreshold|requiresConfirmation|senateConfirm` in `src/` = **ZERO hits**
> > (same null result the game-master found; consistent with debt #24/#26/#38). The
> > shipped cabinet runner `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a
> > flat scored pick → `cabinet[seat] = pick.id` (`:2191`) + `addLog("…confirmed as
> > ${seat}")` (`:2197`) — **NO Senate vote, NO threshold, NO nuclear-option gate.**
> > **★ The Ted-authoritative spec (designer-blessed in-thread, `modernday` POST
> > 422-423):** *"for a 2016 start, Cabinet Members require only 50%+1 of the Senate's
> > approval, unless you repeal the Nuclear Option (which is otherwise permanently in
> > place). Supreme Court nominees will continue to require 60%, unless you enact the
> > Nuclear Option for that as well."* The Nuclear-Option DEFAULT STATE is **era-keyed**
> > (Reid-2013 + McConnell-2017 already fired by a 2016 start) → it is a **per-start-year
> > boot flag** (or derived from whether the start predates the cloture-reform bills).
> > **★ Where it binds:** a `GameState.nuclearOption: { cabinet: boolean; scotus:
> > boolean }`-style flag SEEDED at boot by start year (the same `scenarioBoot`/
> > `BootSheet` surface as #170's office-existence seed, §3 item 2 / E16), read by a
> > **per-track confirmation-threshold** check in the cabinet runner
> > (`phaseRunners.ts:2158`) and the SCOTUS-nomination path (`:3648-3671`); plus the
> > **SML enact/repeal action** (one ActionRegistry row that toggles the flag) and the
> > **60→fail→10-vote-conversion→auto-confirm-a-Mod fallback** (`modernday` POST 602-603:
> > a 60-vote SCOTUS fail auto-confirms a Mod-Dem-or-Republican replacement). **★ It
> > COMPOSES, doesn't conflict, with three already-scoped pieces — do NOT re-build them:
> > #124's auto-pass GATE (debt #38, Ted-ruled — whether a vote even HAPPENS) fronts
> > the threshold; #52's CPU-Senate-vote handler (E9 handler 9d — WHO votes aye)
> > resolves the contested vote; #171 is orthogonal (draft, not confirmation); and the
> > batch-9 USER cloture decision (Senate = 60%-then-majority vs simple-majority, debt
> > #27 — RESOLVED in code as simple majority, design-open) is the SAME cloture surface
> > E14c owns — the Nuclear-Option flag is the era-keyed DEFAULT on TOP of it.** **Size:
> > S–M** (the boot flag + per-track threshold read is S; the SML enact/repeal action +
> > the conversion-fallback is the M part — both reuse the E16 confirmation + E14c
> > cloture surfaces already scoped). **Open Q (designer-gated within the epic):**
> > boot-flag-vs-derived-from-cloture-bills (the digest's own open question). game-
> > mechanics §9.3.10. debt #50.
> > **(2) ★ #173 era-boundary-aligned starts → New-Game start-year PRESETS = the 14-band
> > openings; couples scenario-boot (#115). DESIGNED, not built.** **★ CONFIRMED shipped-
> > state:** there is **NO start-year picker** — `NewGameScreen.tsx` hard-codes a
> > two-entry `SCENARIOS` array (`:8-21`, `type ScenarioId = '1772' | '1856'` `:6`) and
> > `startNewGame(factionId, scenarioId)` (`GameContext.tsx:264`, signature `scenarioId?:
> > '1772' | '1856'`) admits exactly those two boots. There is **no era→start-year axis
> > at all.** **★ The fix (the GM's own closing verdict, `modernday` POST 2964):** *"For
> > any new test start date, it must be the date a new era begins. One of the issues we
> > ran into with this test was it started in the middle of an era"* — so the New-Game
> > boot picker should expose a **PRESETS table keyed to the canonical 14-band era→start-
> > year→first-president map** (printed verbatim POST 2964: Independence 1774 /
> > Federalism 1788 / Republicanism 1800 / Democracy 1820 / Manifest Destiny 1840 /
> > Nationalism 1856 / Gilded Age 1868 / Progressivism 1892 / Normalcy 1916 / Ideologies
> > 1928 / Nuclear Age 1948 / Neocons 1972 / Terror 2000 / Populism 2012). **★ Where it
> > binds:** this is a **presets table ON TOP of the K4 `BootSheet`/`scenarioBoot`
> > pipeline (#115, §9.1.9)** — each preset is "another scenario-as-data-row" (the same
> > pattern as `scenario1868`/`scenario1788`), so it is GATED on `scenarioBoot` existing.
> > The UI delta is small (a presets dropdown/grid on `NewGameScreen.tsx` instead of two
> > hard-coded buttons); the WEIGHT is the boot sheets each preset points at (the
> > era-content/scenario work the roadmap already scopes). **Size: S** (the picker
> > presets table itself; the boot sheets are the existing scenario-boot/era-content
> > work). game-mechanics §27.9. debt #51.
> > **(3) ★ #68/#2 era-boundary pipeline — SPEC-ANCHOR CONFIRMED (current-rules live
> > instance); UNBUILT; no priority change.** **★ CONFIRMED zero shipped surface:** grep
> > `bankPoints|eraBoundary|endOfEra|pointBank|resetScores|factionTrade|switchFaction`
> > in `src/` = **ZERO hits** — there is no end-of-era banking pass, no score-reset, no
> > faction-trade window, and the ONLY era transition is the hard-coded `currentEra =
> > 'federalism'` (`constitutionalConvention.ts:198`; debt #5). The `triggersGameEnd`
> > terminal sink (`phaseRunners.ts:2871`) is the only era-end-adjacent consumer and is
> > unrelated. **★ Why this batch matters for it:** `modernday` is the **first live
> > instance in the KB of the 6-clause point-banking ritual firing at a REAL boundary
> > under CURRENT rules** (the 2024 transition, POST 1871 — verbatim formula: most-points
> > +5 / other-party-most +3 / 2nd-most-same-party +3 / all-factions-in-top-party +3 each
> > / two −1 allied-faction-finished-last guards), plus the **non-banked score reset**
> > ("Scores will be reset to zero for the next Era", #51/#2), the **faction-trade/switch
> > window** (POST 1874), and the **procedural-content swap** (historical imports →
> > all-generated rookies, POST 1902/1909 — see (5) / #43). It **matches `rep1800`
> > almost exactly**, so #68/#2 is now confirmed a deterministic pipeline from BOTH a
> > 1800 and a current-rules angle. **No priority change — it stays folded into K3/K4
> > point-banking** (§9.1.5, the two-level era model: point-banked Historical Eras +
> > per-decade census), but the **spec is now solid** for when the era-model epic builds
> > it. game-mechanics §27.2.1. (No new debt row — this strengthens K3/K4, debt #5.)
> > **(4) ★ #171 era-keyed draft-ideology TOGGLE — PROVEN FLIPPING ON→OFF in one save
> > (corroboration; sharpens debt #48, no scope change).** Already DESIGNED-not-built
> > (debt #48); the shipped draft `runPhase_2_1_1_Draft` (`phaseRunners.ts:107`) still
> > picks via `pickBestForFaction` (`:33`) with NO era-keyed ideology-restriction profile.
> > `modernday` is the **single cleanest live demonstration in the KB**: restrictions
> > **ON** 2016-2024 ("You can draft only politicians restricted by your draft
> > ideologies", POST 558) then **OFF** at the 2024 boundary ("there are no longer any
> > draft restrictions… You can draft anyone from RW Pop to LW Pop", POST 1902) — the
> > toggle FLIPS at the Populism→Near-Future band boundary inside ONE campaign. This
> > **corroborates and sharpens #171/debt #48** (the ON→OFF flip is keyed to the era-band
> > boundary, i.e. realignment completion) — confidence ↑, **no scope change** (still an
> > era-keyed boolean on the #4/#108 profile system). game-mechanics §27.9 + §4.1.w.
> > **(5) CORROBORATIONS (no keystone moves):** **★ #43 procedural pol-generator owns the
> > modern→future band** — by 2024 the dataset is exhausted and the draft is "basically
> > all generated pols" (POST 1902/1909); now corroborated LIVE from `modernday` (+ the
> > batch-15 `terror2000` 2000-start), pinning that the **modern→future content boundary
> > is where the dataset exhausts into pure generation** (debt #19, scaling-wall (a)). **★
> > Cabinet/offices #124/#25/#170** (28-seat roster + requirements + **CIA-Director as
> > the modern intel slot, no DNI office** — re-confirms #170's DNI⇒CIA-Director
> > supersession, debt #47; the cabinet→enthusiasm path + 2-eggheads→+100-points fire).
> > **★ The 2-layer meter→election scorer #18/#51** published verbatim ("State of the
> > Meters", POST 2380): a universal per-ideology meter modifier on BOTH parties/every
> > state + a per-party enthusiasm box — MATCHES the `terror2000`/`dem1820`/`arkzag`-
> > settled model (debt #1, the FROZEN SPEC; build-confidence ↑). **★ Legislation #8/#9/
> > #10 + filibuster** (full 4-committee → chair-block → SML-block → vote → filibuster →
> > conversion → VP-tiebreak → veto → 2/3 override-fail, POST 521-569 — re-confirms debt
> > #26's 2/3-both-chambers override + the cloture surface E14c owns). **★ Impeachment**
> > ran to completion (Warner = 3rd impeached pres, acquitted) but the GM short-cut the
> > special-committee step — re-corroborates DH-54/DH-66 (under-specified, E10b family).
> > **★ CPU suite #70-#79 / #1 / #114** (CPU backfills vacant factions, GM CPU-subs
> > inactives, faction-trade auto-accept; 8-human MP w/ handovers — the app is a solo
> > adaptation, humans are 1-of-10). **★ #110** full 2.1.x→2.9 sub-phase taxonomy run
> > verbatim. **★ #108** high/max-enthusiasm factions shielded from conversion. **★ DH-70
> > `Lackey` PV over-weight (XS, pv.ts note when ported):** the digest flags a LW-Pop
> > with only Lackey at PV −47 ("Lackey shouldn't be that much worse than any other bad
> > trait", POST 1939-1945). **★ CONFIRMED shipped-state:** `pv.ts:77` applies a **flat
> > `−5` to EVERY negative trait** (`else if (NEGATIVE.includes(t)) total -= 5;`), and
> > `Lackey` appears **NOWHERE in `src/`** (grep = ZERO) — so it is NOT yet a shipped
> > trait. **When `Lackey` is ported, add it to `NEGATIVE_TRAITS` so it takes the SAME
> > flat `−5`, with NO special-case** (the forum's "just a formula issue" — the shipped
> > formula already treats all bad traits equally; the over-weight the forum saw was a
> > spreadsheet artifact). **XS, pairs with #120 dataset-balance + DH-51.** **★ DH-69 no
> > in-app rules / legal-move surface (UX/onboarding):** grep `rulebook|legalMove|
> > availableActions|helpPage|tutorial|onboard` in `src/` = **ZERO hits** — there is no
> > rules page, no legal-move enumeration, no onboarding. Players "winging it" without a
> > rulebook (POST 342-356) is the friction an **in-app rules/legal-move surface** fixes;
> > it sharpens #115's boot-procedure gap and **serves the CPU cluster too** (a legal-move
> > enumerator is the same primitive a CPU action-picker needs) and the GM-burnout theme
> > (DH-36 family). **UX/onboarding item, no engine size of its own; cite under the
> > #115/CPU-AI work.** **Decision-gated RECOUNT: 0** (the #172 boot-flag-vs-derived
> > question is designer-gated TUNING within E16/E14c, not a new bucket entry). **No NEW
> > keystone, NO re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot
> > → E1).
> >
> **★★ Batch-21 changes to the plan (FOUR playtests — `nixon1972` [`4853cf4d`,
> 1972-start modern MULTIPLAYER, GA-run, one half-term then GM-burnout stall],
> `cpufull` [`1f72600c`, all-CPU 1772 founding traversal, GA-run, ENDED on a
> scripted CPU game-over], `trump2024` [`51dfaef1`, **Ted-run designer-authoritative**,
> 2024/Jan-2025-start modern MULTIPLAYER, SETUP-ONLY], `solo1916` [`5027f0f3`,
> 1916-start SOLO Progressive-Era/WWI, GA-run, one half-term then stall]. TWO new
> era-keyed gaps (one PARTLY SHIPPED), ONE escalation that re-prioritizes a debt
> item HIGHER, ONE DH bug; NO new keystone, NO re-sequence; TOP-OF-QUEUE UNCHANGED.):**
>
> > **★ Read this block if you only read one for batch 21. The load-bearing move is
> > **★ #158 ESCALATED** — `cpufull` is the **2nd live CPU game-over in the KB** and
> > **field-falsifies the flat-75%-oppose patch** (the patch was applied and the game
> > ENDED anyway: 4/10 factions rolled ≤25 and a game-ending peace passed at a **4-5-4
> > plurality** after the CC-President's reject was overridden). The fix is **no longer**
> > the flat 75% roll — it needs a **HARD VETO** (CPUs can't select a `triggersGameEnd`
> > option in a solo/CPU-majority game) **or** a **points-based anti-peace bias**, **plus
> > a non-plurality-overridable game-ending-peace** (the Pres's reject must not be beaten
> > by a mere plurality). This **raises debt #32's priority** within the CPU/war track and
> > makes the **#155 RevWar floor #3 LEAKY** (debt #34a). The other three items are
> > smaller: **#170** era-keyed offices is **PARTLY SHIPPED** (the founding-seat half is
> > LIVE in `cabinetSeatsForYear`, `types.ts:1196`; only the modern departments + the
> > **DNI⇒CIA-Director supersession** are unbuilt) → **extends the boot/offices work
> > (§3 item 2 / E16)**, S–M; **#171** the era-keyed draft-ideology TOGGLE (OFF in the
> > modern present) → **folds into the #4/#108 draft-profile work**, S; **DH-68** (1916
> > successor-state events fired before WWI ended) → **folds into the DH-60 era-event-
> > precondition work** (now multi-era), S. **`cpufull` re-validates the CPU suite
> > (#70–#79) end-to-end; `nixon1972` corroborates the crisis/war/Watergate mechanics +
> > is ANOTHER GM-burnout stall** (the upkeep-automation argument grows). The top of the
> > queue does NOT move: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1 still lead.**
> >
> > **Verified shipped-state of every batch-21 item (grep/Read-confirmed):**
> > **(1) ★★ #158 ESCALATED — the flat-75% anti-game-over patch is BOTH UNBUILT and now
> > FIELD-FALSIFIED; re-prioritize HIGHER (debt #32).** The shipped consumer is bare:
> > `runPhase_2_4_3_Era`'s terminal handler at `phaseRunners.ts:2871` does
> > `if (event.triggersGameEnd && !snap.game.gameEnded) snap.game.gameEnded = {…}` — it
> > simply SETS `game.gameEnded` (`types.ts:1635`) with **NO CPU veto, NO anti-peace
> > bias, and NO plurality guard.** The CPU resolver `pickAIResponse` (`eraGraph.ts:88-103`)
> > is an `aiBias`-map lookup keyed by faction personality with **NO anti-game-over term
> > whatsoever** (grep-confirmed; same as batch-17). So a CPU-voted terminal peace node
> > (1772 `lost_war`/`dominion_autonomy`/`confederation_remains`, `eraEvents1772.ts:296,
> > 308` + the Carlisle/Conciliatory `chose('carlisle_commission','b')`/`chose(
> > 'conciliatory_resolution','b')` chain `:227,184,308`) resolves by point-math, which
> > leans FOR peace. **★ `cpufull` is the LIVE counter-example to the flat-75% patch
> > (`cpufull#POST 62-68, 73`):** the all-CPU Continental Congress accepted the Carlisle
> > Peace Commission and ENDED the game — *"75% to vote no, but four factions triggered
> > it"* (two rolled 1/100, two rolled 9/100, meeting the ≤25 support threshold), and
> > after CC-President John Adams's REJECT was overridden, a **4-5-4 plurality** carried
> > the game-over. With 10 independent 75% rolls ~2.5 factions are EXPECTED to defect
> > every time, so the flat per-faction roll does NOT reliably hold. **★ Why `ted1772`'s
> > near-misses survived but this one did not:** `ted1772`'s votes were saved by the **2/3
> > Articles peace-vote threshold** (RevWar floor #2); here the game-over needed only a
> > **plurality** after the Pres's reject was overridden — **the plurality-override path
> > bypasses the 2/3 floor entirely.** **★ The fix (re-scoped, designer-gated which-way):**
> > (a) a **HARD VETO** — in a solo/CPU-majority game, any response that sets
> > `triggersGameEnd`/surrender is **removed from the CPU vote menu** (unselectable), OR
> > (b) the **points-based anti-peace ideology bias** Ted floated (*"give points to most
> > ideologies to be opposed to peace and 90% of the time that's the way the CPU will
> > swing"*) tuned so a CPU plurality **cannot** form; **PLUS, either way, the Pres's
> > reject of a game-ending peace must be NON-plurality-overridable** (a separate guard on
> > the override path, not just the per-faction roll). **Binds at:** the `triggersGameEnd`
> > decision in `pickAIResponse`/`runPhase_2_4_3_Era` (`eraGraph.ts:88-103` +
> > `phaseRunners.ts:2871`) for the veto/bias, and the CC/Congress OVERRIDE path
> > (`continentalCongress.ts` `voteCC` + the era-event `decider:'cc-president'`/`congress`
> > resolution) for the plurality guard. **Bears on #114 (solo-app is the target mode) +
> > #155 RevWar floor #3 (now known LEAKY, debt #34a).** **Size: S–M** (the veto/bias is
> > S; the non-overridable-plurality guard adds the override-path work). **★ This is a
> > SOLO-PLAY BLOCKER** — the same class as DH-29 was for Reconstruction: a CPU-majority
> > game can end itself prematurely against the human's survival wish. **Build it WITH the
> > #155 war-balance pass (E3) + the #75 CPU event-vote handler (E9), AHEAD of the rest of
> > the CPU/war track.** game-mechanics §13.2 (the STRENGTHENED #158 block) + §21.1 (the
> > #155 floors) + §25.7. debt #32 (escalated) + #34a.
> > **(2) ★ #170 era-keyed offices/departments — PARTLY SHIPPED (founding seats), DESIGNED
> > (modern offices + the DNI⇒CIA-Director supersession).** **★ The founding-seat half is
> > ALREADY LIVE:** `cabinetSeatsForYear(year)` (`types.ts:1196`) era-gates the cabinet seat
> > list exactly as #170 wants for the early seats — `[]` before 1789, +Navy at `year>=1798`
> > (`:1203`), +Postmaster at `year>=1829` (`:1206`), +Interior at `year>=1849` (`:1205`) —
> > confirming the game-master's read. **What's MISSING (the unbuilt half):** the
> > `OfficeType` union (`types.ts:1111-1134`) has **NO modern departments at all** (no
> > Energy/DHS/DNI/CIA-Director/Commerce/Labor/HHS/HUD/Transportation — grep-confirmed:
> > zero `DNI|CIADirector|DepartmentOfEnergy|HomelandSecurity|supersedes|foundedYear|
> > createdByBill` hits in `src/`), there is **no `foundedYear`/`createdByBill`/`supersedes`
> > schema** on the office model, and there is **no office-supersession** (so a modern board
> > can neither seed the right offices nor map a later office onto an older slot). **★ The
> > Ted-ruled canonical exemplar (`trump2024#POST 40-41`, designer-authoritative):** *"I
> > don't think the office of DNI exists in the game"* → **"DNI replaces CIA Director in
> > game when it's created"** — an office-*supersession* (DNI⇒CIA-Director on creation in
> > 2004), corroborated from BOTH directions (`nixon1972`: DOE/DNI don't exist yet in 1972,
> > a 1972 energy bill is *"Wrong Era"*, `#POST 392-394`; `terror2000`: the DNI is *created*
> > mid-game in 2004). **★ Where it binds:** extend the `OfficeType` enum with the modern
> > departments + add a per-office existence table (`foundedYear`, optional `createdByBill`,
> > optional `supersedes`), and have **`cabinetSeatsForYear`'s successor — the BOOT-SEED
> > `GameState.cabinetSeats: SeatSpec[]` from §3 item 2 / E16** — seed only offices whose
> > founded-year ≤ the board's start year (or that a bill has created), applying the
> > supersession at the creating event. **★ This is the SAME mutable-cabinet-seat refactor
> > the build already plans** (`cabinetSeatsForYear` is confirmed the WRONG long-term model
> > at BOTH ends of the timeline, §24.6 founding-offices-by-law + §26.5 modern-create-by-
> > bill); #170 is the **era-keyed-EXISTENCE + supersession layer** on top of it — NOT a
> > new epic. **Size: S–M** (the enum + table is S; the supersession + boot-seed wiring is
> > the M part, but it folds into the E16 cabinet-seat refactor that is already scoped).
> > **Open Q (`trump2024`):** is DNI⇒CIA-Director a permanent stopgap, or should the modern
> > era get a real distinct DNI (and DHS) seat? (designer call.) **Pairs with the era-
> > content / scenario-boot work** (a modern board must seed the right offices). game-
> > mechanics §9.3.1.1 (the office-existence-by-era table) + §3 item 2 (boot seed). debt #47.
> > **(3) ★ #171 era-keyed draft-ideology TOGGLE — DESIGNED, not built; FOLDS INTO the
> > #4/#108 draft-profile work.** **★ Designer-authoritative (Ted, `trump2024#POST 9, 14,
> > 15-16, 102, 173`):** *"There are no draft ideology restrictions for the future/present
> > timelines… You get to make your own faction"* — the **first playtest authored with NO
> > draft-ideology restrictions** (Matt: *"Has there been a playtest for that yet?"* → Ted:
> > *"Nope!"*). The draft-ideology restriction is itself **era-keyed**: ON in early/
> > realigning eras (the #4 per-(faction,era) profile + off-profile 30/50% rolls +
> > adjacency-on-exhaustion are the engine's tools for *forcing* the §28.4/#108 historical
> > realignment), **OFF in the modern present** because by 2024 the partisan sort is already
> > complete. **★ CONFIRMED shipped-state:** the shipped draft `runPhase_2_1_1_Draft`
> > (`phaseRunners.ts:107`) picks via `pickBestForFaction` (`:33`), which scores by PV +
> > an ideology-bucket match (`:46-49`) — there is **NO era-keyed ideology-restriction
> > profile at all**, and the #4 profile + off-profile rolls are themselves designed-not-
> > built. So #171 layers on top of #4: when the profile system is built, gate it behind an
> > **era-keyed toggle** (`eraDraftIdeologyRestrictions: boolean`, or derived from the
> > era-band/realignment-completion state) so the modern present runs it **OFF** and lets
> > players draft any-ideology factions. **Faction-leader eligibility (#110) still applies**
> > regardless (Matt: the trick is *"drafting a faction they're eligible to lead"*). **★ The
> > ON→OFF flip is keyed to REALIGNMENT COMPLETION, not a calendar year** — three batch-21
> > start years bracket it (**1916 ON** `solo1916` · **1972 ON** `nixon1972` [off-ideology
> > draft attempts roll >50; Janet Yellen succeeds 95/70; pool-exhaustion → adjacent
> > "without penalty"] · **2024 OFF** `trump2024`). **Size: S** (an era-keyed boolean on
> > the #4 profile system; no standalone epic). **Open Q:** the exact ON→OFF boundary
> > ("future/present timelines"; likely keyed to the §28.4/#108 realignment completing,
> > ~1990s/modern). **Folds into the #4/#108 draft-ideology-profile work.** game-mechanics
> > §4.1.w. debt #48.
> > **(4) ★ DH-68 — Progressive-era successor-state Era Evos lack a WWI-end prerequisite (a
> > wrong-ORDERING bug); FOLDS INTO the DH-60 era-event-precondition work (now multi-era).**
> > In a 1916-start first half-term (`solo1916#POST 31, 34`) the GM fired *"Czechoslovakia
> > Gains Independence from Austria"* and *"Hungary Gains Independence from Austria"* **before
> > WWI had ended** — in the SAME events phase as the WWI-entry decision — flagging it: *"I
> > wonder if this should have a requirement that ww1 has ended"*; community: *"These two
> > should not trigger until after WWI is over."* **★ CODEBASE-VERIFIED — this is exactly
> > DH-60's gap, and the two era-event builders DIVERGE on it:** the **1772 graph HAS the
> > machinery** — every node carries an optional `precondition: Predicate` (`types.ts:1487`)
> > and `evalPredicate` (`eraGraph.ts:12`) interprets `eventCompleted` (`:18`), `warActive`
> > (`:31`), `warOutcome` (`:32`), and `eventChose`, so founding successor-style chains gate
> > correctly (the Treaty of Paris gates on `warOutcome`/`yearAtLeast`; the Carlisle/
> > Conciliatory game-over chain gates on a prior `chose`). But the **1856 builder is
> > CALENDAR-ONLY** — `buildEraEventsForYear` (`eraEvents1856.ts:4`) emits events purely by
> > `year >= X && year <= Y` (e.g. `:6`, `:30`) with **NO `precondition` field on any row** —
> > the exact DH-60 shape — and a **Progressive (1896-1932) builder does not exist** (1916
> > runs on `modern`/`progressive` tuning, UNBUILT). **★ The fix:** add a WWI-end predicate
> > (`worldWarOneEnded` / `eventCompleted:'wwi_end'`) to the Czechoslovakia/Hungary nodes
> > (and other post-war beats — League of Nations, post-war treaties), and **port the
> > 1772-graph `precondition` layer into the 1856/Progressive builders** so era content can
> > gate selectively on a prior event, not just the calendar. **This is the SAME selective-
> > precondition ask as DH-60** (`dem1820`/`arkzag`/`smallbugs`: "Stubborn Cherokee" /
> > "Force Open Trade with Japan" firing without a prerequisite) — now corroborated from the
> > Progressive band, so **DH-60 is multi-era confirmed.** **Size: S** (a few keyed
> > preconditions + the precondition layer ported to the non-1772 builders; SAME surface as
> > BUG-1 + K3's `territoryOwned`). **Open Q (`solo1916`):** which other Progressive-band
> > events need a WWI-end (or other prior-event) gate? game-mechanics §10.4.8. debt #49.
> > **(5) CORROBORATIONS (no keystone moves):** **★ CPU suite #70–#79** — `cpufull` is a
> > clean 4th-or-5th independent founding-era angle (CC-president/leadership/committees
> > #70/#72; bill propose+committee-vote+packaging #70/#9; vote-by-cross-party-damage #74;
> > event-vote + Congress override #75; enthusiasm drift #108; conversion gating #127/#76;
> > the RevWar engine #45 with the success-chance formula + warscore/momentum + officer-
> > relief cascade), alongside `drums`/`oopscpu`/`tea1772`/`ted1772` — **confidence ↑** on
> > the whole cluster. **★ Modern band 2021-2025** (#92/#41/#169 ← `trump2024`: Biden-as-
> > retired-Pres, the Jan-2025 incumbent board, the 2020-census EV/bias repoint, the 2.10-
> > first mid-government boot #164) + **start-year/era-band confirmations** (#92's era
> > bands now also exercised at 1916/1972/2024 ← `solo1916`/`nixon1972`/`trump2024`). **★
> > Crisis/war/Watergate** (← `nixon1972`: DomStab crisis = meter-threshold named state
> > #11; Vietnam = relabeled war as an ongoing meter #45/#106; Watergate = a Controversial-
> > gated ~75% EVENT, no impeachment trigger #106 — pins the gate). **★ Hinge polarity §5**
> > (← `solo1916`: Debs-Socialists + Tillman-Traditionalist-Democrats inside BLUE; Borah/
> > La-Follette "Populists" + TR "Imperialists" in RED — the #108 Dixiecrat-inside-Blue
> > pattern). Plus minor data-model notes that fold into existing rows: **repeatable gov
> > actions should be COUNTS not booleans** (`trump2024#POST 53, 56` → folds into the #20
> > gov-action state model); the **no-candidate-withdraw** quirk in leadership IRV
> > (`solo1916#POST 26` → a #110 friction). **★ `nixon1972` is ANOTHER GM-burnout stall**
> > (college+work, ~July-Aug 1973) — the Nth such death in the KB; the upkeep-automation
> > argument behind E9/#55/#115 keeps growing (cite, don't queue). **Decision-gated RECOUNT:
> > 0** (#158 which-way [hard-veto vs points-bias] + the #170 DNI/CIA-real-office question +
> > the #171 ON→OFF boundary are designer-gated TUNING within their epics, not new
> > Decision-gated bucket entries). **No NEW keystone, NO re-sequence; top of queue
> > UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — **but #158's escalation makes
> > the CPU anti-game-over fix a higher-priority item WITHIN the CPU/war track** (a solo-
> > play blocker).
> >
> **★ Batch-20 changes to the plan (FOUR meta/design threads — `planb` [`094cc3a2`,
> the build-FINISHING PROCESS plan, NOT a playtest], `dbomit` [`4be5a005`, a
> missing-pol REQUEST thread → #120], `biden2021` [`24061ad6`, a modern era-CONTENT
> brainstorm], `ampu2wish` [`888ba777`, the OUT-OF-SCOPE AMPU-2 wishlist]. LIGHT
> batch: ONE new runtime mechanic, ONE authoring-process gate, the rest dataset /
> quarantine. NO new keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED.):**
>
> > **★ Read this block if you only read one for batch 20. Almost nothing here is new
> > code. The single runtime delta is **#169** — the "Elderly President Drops Out of
> > Reelection → endorses VP" mid-campaign replacement event (the Biden-2024 → Harris
> > analog) — a **small addition to the era-event epic (E15)**, size S, that gates on the
> > age roll the engine ALREADY has and swaps the VP onto the ticket inside the existing
> > presidential general resolver. **#168** is a **pre-build AUTHORING-quality pass** (a
> > terminology contract + a branch-path/meter/% sanity-audit + a trait/interest
> > compilation) — it is **process/authoring work, NOT a code epic**; the roadmap NOTES it
> > as an authoring gate, it does not SCHEDULE it as a code task. **`biden2021`** is
> > modern era-CONTENT that extends the modern band past 2020 (folds into the §28.13
> > modern content tail / #92/#41; the pardon pres-actions block on #122). **`dbomit`** is
> > pure dataset work → **#120** (no per-pol rows). **★ `ampu2wish` is OUT OF SCOPE — do
> > NOT roadmap ANY AMPU-2 wishlist item for AMPU 1** (day-by-day Paradox rebuild, full
> > House, dynamic regions/biases, etc.); quarantine only. The one cross-cutting process
> > constraint to carry forward: **all content authoring proceeds CHRONOLOGICALLY** (Anthony
> > imports pols/events in chronological order; all changes route through vcczar). The top
> > of the queue does NOT move: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1 still lead.**
> >
> > **Verified shipped-state of every batch-20 item (grep/Read-confirmed):**
> > **(1) ★ #169 mid-campaign drop-out → endorse-VP event — DESIGNED, not built; FOLDS
> > INTO E15 (era-event epic); the age roll it gates on ALREADY EXISTS.** grep for
> > `dropOut|replaceOnTicket|endorseVP|midCampaign|forcedOut|stepAside` across `src/`
> > returns **ZERO** hits — there is **no mid-campaign presidential-replacement / ticket-
> > swap path** anywhere. **But the trigger substrate ships:** the age-penalty die roll the
> > event gates on is the **old-age ability-decay roll** (`ABILITY_LOSS_RULES.oldAge`,
> > `minAge: 70`, `types.ts:521`; fired at `phaseRunners.ts:2384-2393`) plus the
> > `MORTALITY_RULES` death/retire brackets (70/80, `types.ts:488-498`) and the PV age
> > penalty (`pv.ts:85`, `age > 70`). **★ Note on the digest's "70-or-75 age roll": the
> > candidate-relevant roll is keyed at 70, not 75** — the only 75-gated roll is the SCOTUS
> > retirement roll (`age >= 75`, `phaseRunners.ts:3655`), which is unrelated to the
> > president. **Where the drop-out event binds:** a new `EraEvent` (the shipped data model,
> > `types.ts:1466`) firing during an aged incumbent's reelection campaign, whose effect (i)
> > checks the president was hit by the §10.1 age roll AND is running for reelection; (ii)
> > rolls **50% to pull** him; (iii) injects a flat **−1 party malus** into the §21.9
> > presidential-vote modifier stack — **landing on the VP even when the pres is pulled**;
> > (iv) **swaps the VP onto the ticket** by replacing `blueCand`/`redCand` inside
> > `runPhase_2_9_4_PresidentialGeneral(snap, blueCand, redCand)` (`phaseRunners.ts:3752`,
> > which already takes the ticket candidates as params; the VP id is at `types.ts:1568`);
> > (v) a fallback to the §15.3 pre-primary/compromise-candidate convention machinery (+ a
> > pre-12A "designate a successor" path) if the VP can't/won't step up. **Designed-but-
> > unsettled guards:** a VP-younger-than-pres check before defaulting to the VP; the
> > alternative stiffer trigger (80+ / Frail-Easily Overwhelmed-Incoherent / older-than-VP /
> > Party-Pref-against). **Era-of-Populism-scoped until it fires twice** (the twice-before-
> > generalizing rule). **★ Distinct from #37 / debt #29 (defeat-then-retire / the war-
> > defeat President-loss package): #169 removes the candidate DURING the campaign, not
> > after a loss.** **Size: S — a small addition to E15 (or the election epic E20b).** debt
> > #45; game-mechanics §10.4.7.
> > **(2) ★ #168 — a PRE-BUILD AUTHORING-QUALITY PASS, NOT a roadmap code epic.** There is
> > **NO code surface.** It produces (a) a **terminology contract** the build must honor
> > (ideology short forms `LW Pop/Prog/Lib/Mod/Cons/Trad/RW Pop`, matching the `types.ts`
> > 7-point scale; the Skills/levels/Experience/Interests vocabulary buckets; the military-
> > Experience → **"Army" rename** — currently incomplete: "Army" is mislabeled as a
> > *starting expertise* and should be Military, a `dbomit` corroboration; **human-rights →
> > "criminal reform"**; demographic-category standardization — add Middle Eastern
> > ethnicity, drop the no-op Protestant/White defaults); (b) a **branch-path / meter-
> > direction / percentage-multiplier sanity audit** of the AUTHORED content (+budget meter
> > must move + when it makes money = the **DH-53 effect-SIGN family**; the Afghanistan-War-
> > Phase-I multiplier; alt-state event enter/exit columns swapped; legislation
> > repealability; the half-broken Split-Electoral-Votes gov action); (c) a **trait/interest
> > compilation** (how each is gained + what each does). **This is an AUTHORING-PROCESS GATE
> > the roadmap NOTES but does NOT schedule as a code task** — it standardizes + audits the
> > content the era-content/dataset epics consume, and it pairs with the
> > `scripts/seedDataset.mjs` author-time pipeline (§7) + the **#120 dataset umbrella**.
> > **Governance: all changes go through vcczar** (`planb#POST 37`). debt #46; game-mechanics
> > §30.11.2.
> > **(3) ★ THE CHRONOLOGICAL-IMPORT PIPELINE CONSTRAINT — a PROCESS note for the roadmap.**
> > Anthony imports pols + events **chronologically** (he was on 1772-1774; everything else
> > is edited from after 1772 forward) and **all changes route through vcczar**
> > (`planb#POST 37, 72`). **Implication: content/authoring work should be SEQUENCED
> > CHRONOLOGICALLY** — founding-era content before antebellum before modern. This does not
> > reorder the ENGINE track (keystones/subsystems are dependency-ordered, not chronological)
> > but it DOES order the per-era CONTENT authoring (the bill/event/SCOTUS catalogs the
> > era-content epics consume, the #120 dataset pass, the #168 audit). A scheduling note, not
> > a build item. game-mechanics §30.11.1.
> > **(4) `biden2021` → MODERN ERA-CONTENT, folds into the modern content tail (NOT a new
> > epic).** The 2021-2025 Biden content list (the IRA/Infrastructure bill splits, the SC-
> > reform amendments, the Israel-Hamas/Gaza/NATO event chain, the climate pres actions, the
> > 2021-2024 SC docket) **extends the modern band past 2020** and maps onto the shipped
> > `EraEvent` + `Predicate` + `addPolitician` model — it is content-authoring, not new
> > architecture. It folds into the modern-era content work (#92/#41 / §28.13). **The ONE new
> > mechanic in the thread is #169** (above). **The "Pardon Controversial Allies/Family"
> > pres actions BLOCK on #122** (pardon mechanics unspecified — #122 must define what a
> > pardon does first). All other modern presidents are done (`biden2021#POST 47`); Trump-
> > 2nd-term content deferred to ~midterms (`POST 52`). game-mechanics §28.13.
> > **(5) `dbomit` → #120 (pure dataset); the standardization rulings pair with #168.** The
> > ~167-pol missing-name catalog + the dataset-quality bugs (wrong/missing starting
> > expertise; "Army"-as-expertise→Military; missing post-2022 death dates) all fold into the
> > **#120 dataset umbrella** via `scripts/seedDataset.mjs` `CURATED_ROWS`/`ERA_FIGURES`
> > (NOT by hand-editing the JSON/CSV) — **no per-pol gap rows.** The small standardization
> > rulings (add Middle Eastern ethnicity; drop no-op Protestant/White; **"Crazy" trait
> > permanently REJECTED — use Controversial**) are the SAME pass as the #168 terminology
> > contract. The reusable **inclusion bar** (0-9%-of-winning US Rep/Sen/Gov, or a missing US
> > Rep; sub-floor rookie stats; name-generator for the deep future) feeds the draft-class
> > authoring playbook (§7). game-mechanics §30.11.3.
> > **(6) ★★ `ampu2wish` → OUT OF SCOPE — the roadmap MUST NOT schedule any AMPU-2 item for
> > AMPU 1.** This thread is the forum's quarantined "for next time" brainstorm (OrangeP47:
> > "unlikely to make it into AMPU 1"; vcczar's AMPU-2 thesis = a day-by-day Paradox-style
> > timeline, full House, federal judiciary, AMPU 1 finished first). **Nothing here is a
> > buildable AMPU-1 gap.** Two wishes are ALREADY-LOGGED AMPU-2 gaps, corroborated NOT
> > re-logged: **DH-37** (player-to-player politician trading = "the #1 AMPU-2 wishlist
> > item") + **DH-34** (dynamic/policy-reactive state biases — vcczar confirms biases are
> > census-updated but PREDETERMINED by history, a deliberate history-sim DESIGN CHOICE, not
> > a bug). Everything else (day-by-day timeline, dynamic regions, dynamic eras, more states,
> > achievements, scouting/hidden-stats) stays quarantined. game-mechanics §30.11.5.
> > **(7) FOLDS / CORROBORATIONS (no keystone moves):** **dbomit → #120** (dataset); the
> > **post-1772 start-game guide → #115** (scenario-boot — populating the career track with
> > recent draft classes + the named-starting-Reps-not-in-game bug); **the pol-trading wish →
> > DH-37**; **the dynamic-biases wish → DH-34** (a ROADMAP DECISION, ship-static stance
> > stands); **the "Army"-expertise / effect-sign audit → DH-53**; **the conflicting-trait
> > flag macro → DH-27**; **no-rookie-Command → #136/#153**. **Decision-gated RECOUNT: 0**
> > (no item enters or leaves the user/designer Decision-gated bucket; #169 is a designer-
> > authoritative procedure with a couple of tuning guards, #168 is an authoring gate).
> > **No NEW keystone, NO re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 +
> > scenarioBoot → E1).
> >
> **★★ Batch-19 changes to the plan (`fixes2022` / `2d3ffb3e` — "Suggested fixes —
> Fall 2022," the EARLIEST captured discussion thread; Oct 2022 → Sept 2023; the
> pre-early-release content-build + to-do-clear window — @vcczar [the designer]
> describing his OWN additions + @vcczar + @MrPotatoTed [Ted, rules steward] rulings
> into the 3.0 doc, interleaved with ~20 community suggestions [tier-4]; it PREDATES
> and literally SPAWNS `smallbugs` and predates `tedchange`. Corroboration- and
> provenance-heavy; ONE new subsystem. NO new keystone, NO re-sequence,
> TOP-OF-QUEUE UNCHANGED.):**
>
> > **★ Read this block if you only read one for batch 19. Three things happen here,
> > and the headline is PROVENANCE, not new scope: (a) it adds ONE genuinely-new
> > mechanical capability — **#167**, the no-eligible-successor presidential
> > constitutional-crisis subsystem (the fallback when the WHOLE succession line is
> > empty) — which **folds into E10b** and **reuses the #62 delegation-vote machinery**;
> > (b) it is the **EARLIEST source** in the corpus for **#153 / #135 / #124 / #121 /
> > #88** — so these were designer intent from the START, which is a **build-confidence
> > bump, not new scope**; (c) ★★ it is the **STRONGEST corpus evidence that the
> > ideology-enthusiasm model (#18/#51/#124) is the PERENNIAL FORK** — the one system
> > the programmer got STUCK on and that even the designer re-derives differently every
> > playthrough — so the #51 (drums 4-step reshuffle) + #18 (terror2000 2-layer scorer)
> > resolutions must be treated as a **FROZEN SPEC**; this is the single likeliest place
> > the build drifts from designer intent, and it is now a ROADMAP RISK FLAG on E20b/E23.
> > The rest is **#120 dataset input** (~20 named items + ~10 effect-sign bugs + vcczar's
> > own ~1800-legisprop audit) + **scripted-event CORROBORATION** (the shipped `EraEvent`
> > model already supports the build-out) with one small open piece (an era-event
> > firing-rate budget). The top of the queue does NOT move: QW0 → K0/K2 → K3/K4 +
> > scenarioBoot → E1 still lead.**
> >
> > **Verified shipped-state of every batch-19 item (grep/Read-confirmed):**
> > **(1) ★ #167 no-eligible-successor constitutional-crisis — DESIGNED, not built;
> > FOLDS INTO E10b; reuses #62.** grep across `src/` for
> > `successionCrisis|actingPresident|emergencyCongress|coup` returns **ZERO** hits —
> > there is **no succession-law-vote, no House-1-vote-per-state acting-President
> > election, and no coup branch** anywhere in the engine. The only succession-adjacent
> > code is `vacateOffice` (`phaseRunners.ts:2446`), which on a President's death/
> > resignation simply sets `snap.game.presidentId = null` (`:2449`) with **NO successor
> > path at all** — confirming #167 (and #61, debt-adjacent) bind on the SAME vacancy
> > site. **Where #167 binds:** a new `game.successionCrisis` flow triggered from the
> > vacancy path when the line is empty (empty `vicePresidentId` `types.ts:1568` + no
> > installed third-in-line): (i) an **emergency-Congress agenda-locked-to-succession-
> > laws** vote loop (random-FL proposer, CPU auto-support, **auto-signed/un-vetoable**,
> > loops until pass); (ii) a **House 1-vote-per-state acting-President election** between
> > the two party leaders (ineligibility→highest-PV-eligible-FL cascade; CPU party-line
> > except Integrity→incumbent-party, Can-Be-Independent→closest-ideology; tied state
> > abstains; state-count tie → SCOTUS/game-over); (iii) a **DomStab penalty scaled
> > 0/−1/−2/−3** by outcome legitimacy; (iv) a **coup branch** (Controversial+LW/RW-Pop
> > OR Military Leader → the 3.0.2 coup rules → possible game-over, the same end-condition
> > family as #88/debt #28). **★ SHIPPABLE-FIRST:** Step (ii) is the SAME 1-vote-per-state
> > delegation-majority machinery as the **#62 contingent House election** (debt-adjacent
> > §9.2 row) — **build #62 once, reuse it for both** (election-with-no-EC-majority AND
> > acting-President-with-no-successor). The accepted **interim default** (the designer's
> > simpler shippable version, `fixes2022#POST 849-850`) is **PPT-as-acting-President**
> > (the Senate President Pro Tempore becomes acting President, then resigns from
> > Congress) — ship that FIRST, layer the full House-election procedure later. **#167
> > completes the constitutional-crisis cluster with §24.1 normal-succession (#61) +
> > the impeachment hole (DH-54/DH-33/DH-66) — treat all three as one E10b subsystem
> > family.** **Size: M for the full procedure (Step-ii reuses #62); S for the
> > PPT-interim default alone.** (debt #43; game-mechanics §24.1.2.)
> > **(2) ★ PROVENANCE → build-CONFIDENCE on #153/#135/#124/#121/#88 (no new scope).**
> > `fixes2022` (Fall 2022) is the EARLIEST source for: **#153** no-reroll-on-held-
> > expertise (vcczar adopts Ted's house rule Mar 2023, `POST 581-583, 645-650` — the
> > canonical origin, later re-ruled in `terror2000`/`tedchange`/`ted1772`); **#135**
> > 50-50 Senate → VP's-party (`POST 803`, "by popular demand," later in `terror2000`);
> > **#124** the Integrity/Controversial 100%→10-20% confirmation-inflation fix + the
> > cabinet/legislative enthusiasm-swing cap (`POST 659-670, 883-907`); **#121** the
> > Secessionist-trait gap + the Reconstruction "Secessionist Politicians" appointment
> > rule (`POST 364-365, 641-644`, predating the `smallbugs` corroboration); **#88** the
> > CPU 75%-nay-on-game-over rule (`POST 622, 663` — the Carlisle Peace Treaty, predating
> > `ted1772` #158 by ~a year). **These were designer intent from the START** ⇒ raise
> > build-confidence where they sit (debt #31/#32 #153/#88; the E16 cabinet rework
> > #124; E3b Reconstruction #121); **no item changes size or epic.** (game-mechanics
> > §30.10.)
> > **(3) ★★ ENTHUSIASM (#18/#51/#124) is the PERENNIAL FORK → FREEZE the spec (the
> > marquee ROADMAP RISK FLAG).** `fixes2022` is the load-bearing provenance: Anthony
> > coded the rules-doc IN ORDER and **stalled ~halfway into phase 2.1 on ideology
> > enthusiasm**; vcczar *"sent him like four emails… the emails didn't bring [Ted] any
> > closer to being confident"* (`POST 715-716`); **vcczar himself "implement[s] it a
> > new way accidentally" each playthrough** (`POST 713`). So enthusiasm is not merely
> > under-specified — it is the system the designer **re-derives differently every time.**
> > The #51 (drums 4-step reshuffle, §29.10) + #18 (terror2000 2-layer scorer, §29.3)
> > resolutions are the canonical pins that ended a multi-year fork. **★ The roadmap MUST
> > treat them as a FROZEN SPEC** — an enthusiasm implementation should build the recorded
> > #51/#18 model EXACTLY and NOT re-derive from scratch. **This is the single likeliest
> > place the build drifts from designer intent.** Add this as an explicit RISK NOTE on
> > the enthusiasm items: **E23** (the #51 4-step reshuffle pass + −100/waiver crisis-bill
> > scoring) and the **E20b / `calcStateVote` ±3-cap + 2-layer-scorer work** (debt #1).
> > No code change and no scope change — a **confidence/risk annotation** only. (debt #1;
> > game-mechanics §29.3 provenance note + §30.10.)
> > **(4) Scripted-event build-out → CORROBORATION (no gap); ONE small open piece.** This
> > thread is vcczar building out ~30 scripted events (the Shaw/John-Brown demographic-
> > removal fork, the per-state abolition/suffrage/segregation/prohibition toggles,
> > demographic-gated draft-ENTRY after the 19th Amendment). **Every item maps onto the
> > shipped `EraEvent` model** — `EraEvent` (`types.ts:1466`) with data-driven `responses[]`
> > / `EraEventResponseEffect`, a serializable `Predicate` tree (`types.ts:1487`),
> > `triggersGameEnd`, `unlocks`, and `postEffects` incl. **`addPolitician`** — so this
> > **strengthens the era-event system; it does NOT add a gap.** The **late-start event
> > boot-filter** (strip pre-start-era events on a later start, honor an evergreen flag,
> > `POST 413-423`, INTENDED) corroborates BUG-1 + #92 / the era-lock filter
> > (`phaseRunners.ts:2817`), build it WITH them. **The one OPEN design piece is the
> > era-event FIRING-RATE budget** (`POST 114-123`): vcczar removed the old "2-min/8-max
> > per half-term" cap, intends ">8", and OrangeP47 flagged an 1840 log-jam (only ~25% of
> > events fired) wanting a **dynamic limit so ~70% fire per era**. The era-event runner
> > today (`runPhase_2_4_3_Era` `phaseRunners.ts:2796`; `buildEraEventsForYear`
> > `eraEvents1856.ts:4`) has **NO firing-rate budget at all** — events fire by year-window
> > only. **Small addition to the era-event epic** (E15 / the era-event scheduling surface,
> > divergence #4) — a dynamic per-era firing budget, not a fixed cap. (debt #44;
> > game-mechanics §10.4.6.)
> > **(5) #120 dataset umbrella → fold the `fixes2022` batch in.** ~20 named dataset/
> > scenario-config items + ~10 bill/event/SCOTUS effect-SIGN bugs (bailout / Dunmore /
> > Independence-budget / veto-override / San-Antonio-ISD / unicameral-options /
> > isolationism — all corroborate DH-53) + **vcczar's OWN audit of ~1800 legisprops**
> > (*"~1 issue per 100, mostly prereqs in wrong order,"* `POST 367-369`). **Cross-thread
> > dup:** Bob Scott (NC Gov, 1-Leg→1-Gov) = the SAME fix as `smallbugs` §2b. **Same
> > author-time `scripts/seedDataset.mjs` `CURATED_ROWS` work surface** — folds into the
> > #120 coordinated pass; the ~10 sign bugs fold into DH-53; NOT a new gap. **Also a
> > dataset-stat PRINCIPLE worth recording:** the **Leadership trait is deliberately VERY
> > RARE** (only epoch-defining party-builders are born with it) — explains why many real
> > leaders lack it (intentional, not a #120 bug). (debt #45-adjacent / the #120 umbrella;
> > game-mechanics §30.10.)
> >
> > **Decision-gated RECOUNT (batch 19 nets 0):** no item enters or leaves the
> > user/designer Decision-gated bucket. #167 is a designer-authoritative procedure
> > (ready-to-build, PPT-interim-first). The enthusiasm freeze is a RISK ANNOTATION, not
> > a new gate (the #18/#51 forks were already RESOLVED in batches 11/15). The open edges
> > of #167 (`fixes2022` §7: ineligible chosen leader; new-vs-old PPT after a 3rd-in-line
> > bill; special-election-vs-House-choice default) are tuning inside E10b, flagged at
> > §30.9-adjacent.
> >
> > **CORROBORATION only (no keystone moves):** #167 couples #61/#88/#62/DH-54 (one E10b
> > family); #153/#135/#124/#121/#88 EARLIEST-source-confirmed (designer intent from the
> > start); #18/#51 the perennial-fork provenance (freeze the spec); #120 dataset +
> > DH-53 sign bugs (3rd-thread input + vcczar's ~1800-prop audit); the `EraEvent` model
> > (scripted-event build-out fits it); #92 / BUG-1 (the late-start boot-filter); DH-36
> > (the smallbugs thread's genesis here, `POST 637-640`). **No NEW keystone, NO
> > re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).
> >
> **★★ Batch-18 changes to the plan (`ideo1928` / `e45a756c` — "Era of Ideologies",
> the FIRST 1928-start interwar campaign; GA = @10centjimmy [a GAME-ADMIN, NOT the
> designer — GA rulings are useful but NOT designer-authoritative; ONE Ted-authored
> ruling, flagged]; 8 human + CPU factions; plays ~1928→~1936 (Hoover landslide →
> the Great-Depression event fires LATE → FDR wins 1932). Runs on `modern`/
> `progressive` tuning — UNBUILT. NO new keystone, NO re-sequence of the
> top-of-queue.):**
>
> > **★ Read this block if you only read one for batch 18. The headline is the
> > ECONOMIC ENGINE: this is the FIRST interwar source, and it is the SECOND era to
> > exercise the E4c economic-engine epic (after the `arkzag` Bank-War / Panic-of-1837
> > arc, batch 11) — so E4c is now WELL-SPECIFIED ACROSS TWO ERAS (the 1820s Bank War
> > AND the 1930s Great Depression both want the SAME `game.economy` state machine +
> > EconStab crisis + crisis-gated bills). This batch (a) EXTENDS E4c with the
> > Great-Depression META-event + the EconStab→industry cascade + crisis-gated
> > New-Deal bills (#160) and the DH-67 crash-gated-party-modifier fix; (b) CONFIRMS
> > the era-band model at a SIXTH start year (1928, #161) — pure confidence, no
> > scope; (c) surfaces a REAL FIX for the §25.5 CPU cabinet pathology — the
> > confirmation AUTO-PASS gate (the one Ted-authored ruling this batch); (d)
> > 3-thread-confirms the impeachment subsystem is BROKEN (DH-66). The top of the
> > queue does NOT move: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1 still lead. #160 +
> > DH-67 fold into E4c (subsystem track, ON TOP of E2+E6); the confirmation gate
> > folds into E16/E9-handler-9d; #161 is K3/K4 confidence; DH-66 stays parking-lot
> > awaiting Ted's pending rewrite. The marquee single takeaway is DH-67: event-gate
> > the era's BLUE party bias to the crash — a clean, high-value fix that makes the
> > whole crash meta-event load-bearing instead of cosmetic-on-top-of-a-static-band.**
> >
> > **Verified shipped-state of every batch-18 item (grep/Read-confirmed):**
> > **(1) #160 interwar economic engine / Great Depression — UNBUILT; EXTENDS E4c.**
> > `Era` is STILL the 4-value enum `independence|federalism|nationalism|modern`
> > (`types.ts:1337`) — there is NO `progressive` value and no 1928 scenario. The
> > ONLY economy token is the **generic 7-step `economic` meter** (`meters.economic:
> > number`, `types.ts:1401`), whose UI band descriptors LITERALLY include
> > `'Depression'…'Severe Recession'…'Recession'…'Roaring'` (`Meter.tsx:15`) — so the
> > tier NAMES the cascade needs exist as cosmetic strings, but there is **no logic**.
> > grep for `economicStability|greatDepression|econStab|requiresCrisis|requiresCrash`
> > across `src/` returns **ZERO** hits — no Great-Depression meta-event, no
> > EconStab→industry cascade, no `Bill.requiresCrisis`. The era-event runner that the
> > meta-event would bind to is `runPhase_2_4_3_Era` (`phaseRunners.ts:2796`); its
> > `triggersGameEnd` consumer is at `:2871` (the multi-decider (a)/(b) presidential
> > choice rides the same `EraEvent` decider surface). **Where the new surface binds
> > (all on TOP of `arkzag`'s E4c #116 `game.economy` machine):** (i) a
> > **Great-Depression META-event** = one era-event row carrying a multi-meter shock
> > bundle `{economic:−4, revenue:−2, quality:−1, military:−1, partyPref:−3}` + the
> > (a)/(b) decider (NB: the −4 EXCEEDS the §21.8 ±3 swing cap — a meta-event override
> > to flag); (ii) the **EconStab→Recession cascade** = 2 random industries −1 in
> > EVERY state → an **EV-reflow roll** (couples to the §11.5 industry-leadership +
> > §28.9 census/EV surfaces) + a DomStab-drop chance + **EconStab-in-Recession gates
> > other meters' gains**; (iii) **crisis-GATED bills** = a `Bill.requiresCrisis:
> > 'economic'` flag so Fed-currency-in-crisis / worker-bailout are INVALID until the
> > crash fires (binds E2's Bill-type taxonomy). **Size: M as an E4c extension** (the
> > meta-event + decider is S; the cascade is M; the crisis-gate flag is the SAME
> > `Bill.type`/crisis-bypass primitive E2 already builds). game-mechanics §29.7.1.
> > **(2) DH-67 crash-gated party-modifier — UNBUILT; the CENTRAL #160 takeaway.**
> > The era's party-preference / realignment bias is a **static era-band constant,
> > DECOUPLED from the crash event** — so the era's BLUE-favorable bias fired in the
> > 1930 midterms WITH A HEALTHY ECONOMY (the crash had not yet fired; the GOP losses
> > were legislation penalties, not a depression), and the GA's post-mortem (ch18 POST
> > 8) is that *"these era bonuses are SUPER STRONG… maybe too large… the Depression
> > wasn't nearly as bad."* **The fix (Umbrella, POST 545):** EVENT-GATE the era's
> > BLUE party-modifier bias to the Great-Depression event having fired — not a static
> > band constant. **Where it binds:** the party-preference bias that feeds
> > `calcStateVote` (`phaseRunners.ts:3709-3711`, the `partyPref*5` term) must read a
> > `game.crashFired`-style flag set by the meta-event, instead of an unconditional
> > era-band value. **Size: S — and the highest-value single fix in the batch** (it is
> > the switch that turns the meta-event from cosmetic into load-bearing). game-mechanics
> > §29.7.1(f). **Build it WITH #160 (E4c extension).**
> > **(3) Confirmation AUTO-PASS gate — UNBUILT; folds into E16/E9-handler-9d; a REAL
> > fix for the §25.5 36%-pass pathology.** `runPhase_2_3_1_Cabinet`
> > (`phaseRunners.ts:2158-2223`) is a flat scored pick that goes straight to
> > `cabinet[seat] = pick.id` (`:2191`) + `addLog("confirmed as ${seat}")` (`:2198`) —
> > **NO Senate vote, NO Controversial gate, NO skill threshold** (re-verified: the pick
> > body has no `vote`/`nay`/`Senate`/`Controversial`/`skill`-gate logic). The
> > `'Controversial'` trait DOES exist as a `Trait` union member (`types.ts:103`), so the
> > gate has the trait to read. **Ted's authoritative rule (RULED in-thread, POST
> > 213-214):** ALL nominees AUTO-CONFIRM **EXCEPT** {State / Treasury / AG / Defense}
> > OR Controversial OR <3 relevant skill (unless Integrity); a Senate-Majority-Leader
> > with Iron Fist can force a vote on any. This directly fixes the `drums` §25.5
> > pathology (only **36% of 88 nominees passed** — the CPU confirmation was
> > over-rejecting) by ensuring **most picks NEVER REACH A VOTE.** **Where it binds:**
> > insert the auto-pass gate at the confirmation step inside `runPhase_2_3_1_Cabinet`
> > (the contested-pick path then routes through E9-handler-9d's CPU Senate vote).
> > **Size: S — a Ted-authoritative ruling** (DESIGNER class, not a GA call). **Folds
> > into the E16 cabinet rework + E9 handler 9d** (the §25.5 confirmation work both
> > already scope). game-mechanics §25.5 + §30.9.
> > **(4) #161 era-band SIXTH start (1928) — CONFIRMATION ONLY, no scope.** A 1928
> > start is the **6th independent start-year** confirmed for the K3/K4 era-content-band
> > model (after 1772 / 1800 / 1820 / 1856 / 1948 / 2000). The bands key off
> > `game.eraBand` + game-state/territory, NOT the calendar (the §27.1 / divergence-#18
> > finding), and the 1928 thread re-emits the same start-independent band labels +
> > era-keyed draft-ideology + nation roster. **No code change — pure CONFIDENCE on the
> > K3/K4 reframe** (now 6-source). game-mechanics §27.1.
> > **(5) DH-66 impeachment — PARKING LOT; 3-thread-confirmed BROKEN.** grep for
> > `impeach` across `src/` returns **ZERO** hits — there is **no impeachment subsystem
> > at all** (no trigger, no article generation, no trial, no removal). The
> > "Improper SC Justice" general event triggered an impeachment trial that Jimmy + Ted
> > **VOIDED mid-run** (POST 816-861) because the rules under-specify article
> > generation, trial-firing, and the Controversial-vs-<3-judicial inconsistency; **Ted
> > drafted a rewrite that is NOT YET FINAL.** This is the THIRD thread to confirm the
> > subsystem broken (DH-33 `rep1800` + DH-54 `nuke` + DH-66 `ideo1928`). **Stays
> > author-before-build PARKING LOT** until Ted's pending rewrite lands — do NOT build
> > against the current under-specified rules. game-mechanics §24.1.1.
> > **(6) #162 diplomacy roster — era-keyed nation list; EXTENDS E12/#107.** The
> > diplomacy subsystem is exercised natively: a **7-nation 1928 roster** (UK, France,
> > Spain, Germany, Russia/Soviet Union, China, Japan — **no Israel yet**, era-dependent)
> > with per-nation relation meters + an Ambassador per nation (cabinet-level). Verified
> > shipped-state: `'Ambassador'` is ONLY a cabinet `Office` seat type (`types.ts:1134`)
> > — there is NO `foreignRelations`/nation-roster state. **Folds into E12 (the 9-point
> > relations scale + ambassador-actions library) as an ERA-KEYED nation list** (5→6→7→8
> > by era, Japan in by 1928, Israel only at the modern boundary). **The #56-negative
> > result is a SCOPING NOTE, not a build item:** the "Republicanism vs Fascism vs
> > Communism" framing is event-text FLAVOR, not a mechanic, and the looming WWII did
> > NOT trigger the war engine (#56) in the captured span — so this batch corroborates
> > DIPLOMACY but does NOT exercise the war engine. game-mechanics §13.3.1 + §24.7.
> > **(7) #165 / #166 — SHARED fixes, fold into existing work.** **#165** (EconStab /
> > general-event effect-sign + `auto|roll` ambiguity — the "Major Earthquake +Rev/Budget
> > that should COST money", POST 814-815) is the SAME fix as **DH-53** (structured,
> > sign-audited effect tables with an explicit `auto|roll` flag) — extended from bills
> > to events; **shared fix with DH-53**, no standalone work. **#166** (the per-faction
> > "how many of my gov/sen/rep are in each lead-industry" AUTO-TALLY + per-era meter-table
> > VERSIONING; the player-built "Industry test sheet" copied across playtests, POST
> > 450-457) **folds into the economic-engine / industry-scoring work** (§11.5 + #51) —
> > the build must OWN the tally (GM-burnout fuel otherwise, DH-36); meter-version drift
> > is a §92 era-keyed-content fidelity hazard. game-mechanics §29.7.1(g)/(h).
> > **(8) #163 / #164 — BOOT (DH-25 career-track family; mid-gov start-state still
> > open).** The GA pre-placed randomized statesmen onto career tracks at game start (by
> > draft-cohort + ability) to fix the "generational pols stuck at floor stats" problem
> > (the Buttigieg problem, POST 32-41) — a GA house rule, NOT designer-authoritative;
> > it joins the **DH-25 career-track-bootstrap PARKING LOT** (already BLOCKS the modern
> > scenario). The inaugural-cabinet-holdover question (POST 184-188: election-start vs
> > president-in-place vs president-with-historical-cabinet) remains the **unsettled
> > mid-government start-state model** — fold into the K4 `BootSheet` start-state field;
> > players favor president-in-place, but it is human-gated. game-mechanics §26.1.
> >
> > **Decision-gated RECOUNT (batch 18 nets 0):** no item enters or leaves the
> > user/designer Decision-gated bucket. The confirmation auto-pass is a Ted RULING
> > (ready-to-build, not gated). The TWO open questions the digest raises stay
> > human-gated (tuning, not blockers): (a) the crash SEVERITY — one-shot meter shock
> > (current paper, trivially recovered in ~4 years) vs a persistent drag ordinary
> > bills can't quickly undo; (b) the mid-government start-state model (president-in-place
> > vs election-start vs historical-cabinet). Both bind inside E4c / K4 and are flagged
> > at §30.9.
> >
> > **CORROBORATION only (no keystone moves):** #116 / E4c economic engine (the EconStab
> > crisis + cascade now confirmed from a 2nd era — the interwar Depression alongside the
> > 1837 Panic), #18/#51 the 2-layer meter→election scorer (the 1932 Hoover-v-Roosevelt
> > general ran V's canonical model LIVE at the presidential level), #107 diplomacy
> > (era-keyed roster, ambassador actions), the convention delegate-class + congressional-
> > leadership-IRV machinery, #92 era-bands (6th start year), DH-27 dataset trait-conflicts
> > (Claude Pepper Integrity+Controversial again), DH-53 effect-sign (now also event-side
> > via #165), DH-36 GM-burnout (the manual Industry test sheet is the fuel #166 removes).
> > **No NEW keystone, NO re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 +
> > scenarioBoot → E1).
> >
> **★ Batch-17 changes to the plan (`ted1772` / `13c1b720` — the 4th captured
> 1772 thread, the KB's MOST-COVERED era; Ted-run [DESIGNER authority, same class
> as `tedchange`/`oopscpu`/`terror2000`], MOSTLY-CPU [6 CPU / 4 human], fresh
> 1772→~1792 founding→federalism. Deliberately CORROBORATIVE — few NEW gaps, as
> briefed. NO new keystone, NO re-sequence of the top-of-queue.):**
>
> > **★ Read this block if you only read one for batch 17. The headline is
> > CONFIDENCE, not new scope. This is the 4th independent 1772 source AND the 3rd
> > CPU-heavy source, so it does three things: (a) it TRIPLE-CONFIRMS the
> > command-bootstrap (#153) — and uniquely shows the payoff LIVE: an emergent 1st
> > President (Arthur St. Clair, a CPU pol who booted at 0-Command / obscure / no
> > celebrity) who rose entirely through play → BUILD #153 WITH CONFIDENCE; (b) it
> > adds TWO genuinely-new items — the #159 Constitutional-Convention subsystem
> > (founding-era content, downstream of the keystones) and #158 CPU-anti-game-over
> > (one of the three RevWar floors); (c) it PINS the three RevWar winnability
> > floors as a HARD CONSTRAINT on the #155 war-balance pass; and (d) it RESOLVES
> > the FL-on-death fork → immediate replacement (shipped code still defers). The
> > top of the queue does NOT move: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1
> > (`scenario1788`) still lead. #159 folds into the founding-boot/E1 surface; #158
> > builds WITH #155 (E3); FL-on-death is a small standalone fix; DH-65 is an XS
> > dataset audit. This is the most-corroborated era in the KB now (4 threads:
> > `new1772` MP, `tea1772` solo-all-CPU, `85f8e6b4` solo-aesthetic, `ted1772`
> > mostly-CPU) + `oopscpu` (all-CPU 1788) — founding-boot + CPU suite + the
> > command-bootstrap are as well-corroborated as anything in the corpus.**
> >
> > **Verified shipped-state of every batch-17 item (grep/Read-confirmed):**
> > **(1) #153 command-bootstrap — TRIPLE-CONFIRMED → build-with-confidence; mixed
> > SHIPPED / DESIGNED.** The draft already sets rookie `command: 0`
> > (`phaseRunners.ts:216`), so part (a-i) is SHIPPED. **DESIGNED, not built:**
> > (a-ii) the GLOBAL ×2 Command-gain multiplier (no doubling exists anywhere on
> > Command-gain rolls) and (b) no-reroll-on-held-expertise (expertise-grant rolls
> > do not currently waste a roll on a held tag). The Command-gain SITES that the
> > ×2 multiplier must wrap are the leader-pick / charisma-event / military-victory
> > grants (e.g. the Father-of-the-Constitution `command + 1` at
> > `constitutionalConvention.ts:158, 168`, and the RevWar `+1 military` /
> > Military-Leadership grants in `revolutionaryWar.ts`). **Size: S** — a single
> > `gainCommand(p, basePct)` helper applying the ×2, plus a held-tag guard in the
> > expertise-grant path; it is now 3-source canonical (terror2000 / tedchange /
> > ted1772 + a live emergent-President audit). game-mechanics §4.1.y. Sits on the
> > draft/command path (no keystone dependency) — **ready-to-build now.**
> > **(2) #159 Constitutional-Convention subsystem — PARTLY SHIPPED (a superset
> > skeleton); the per-article voting MACHINE + ahistorical-consequences are
> > DESIGNED.** `constitutionalConvention.ts` EXISTS and is a reasonable superset:
> > `makeConvention` defines **7 binding articles** (`:6-77`), `autoFillCPUVotes`
> > does a single CPU-consensus pass per article (`:81-100`, party/ideology
> > heuristic, NOT the eliminate-revote loop), `applyConvention` builds the
> > `ConstitutionalArticles`, names a Father-of-the-Constitution + 3 Federalist
> > authors (`:147-182`), counts governor approvals and **ratifies at `approve >= 9`**
> > (`:185-192`), then transitions `currentEra = 'federalism'` and dissolves the
> > Continental Congress (`:196-212`). **DESIGNED, not built (the new build
> > surface):** (i) the **per-article propose → debate-sway → 2/3-of-states vote →
> > eliminate-lowest-and-revote** loop (shipped does ONE auto-fill, not the
> > elimination loop); (ii) **gov-sends-3-delegates (2 own + 1 opposition, ≥1 Legis)**
> > as the delegate-seating rule (shipped reads the existing CC delegates); (iii)
> > the **random-egghead drafter** selection (shipped picks the highest-PV delegate
> > as "Father," not a random egghead); (iv) **debate-sway by traited delegates** per
> > article; (v) **the slave-compromise plank driving a per-state EV modifier**
> > (slaves-don't-count → seceded-South EV penalty GA −5/SC −5/NC −3/VA −3, floor 3)
> > — shipped stores `slaveCompromise` as a string with **no EV consequence**;
> > `applyConvention` sets `s.electoralVotes = max(3, ccDelegateSlots+1)` flat at
> > `:208-211`, with no slave-plank branch; (vi) **threshold-amendable** amendment
> > plank per #100; (vii) **Judiciary-Act-sets-SCOTUS-count** (the Constitution only
> > permits the court; Congress creates the # of justices). The EV-penalty plank +
> > the elimination loop are the two highest-value extensions. **Size: M–L** — the
> > largest new build surface this batch, but it is **founding-era-specific content
> > that EXTENDS the shipped `constitutionalConvention.ts`** (like the 1856 CW engine
> > extends `scenario1856`, not a new scenario). game-mechanics §17.3.y.
> > **(3) #158 CPU-anti-game-over — UNBUILT.** The ONLY game-over path is
> > `EraEvent.triggersGameEnd` (`types.ts:1476`), consumed at `phaseRunners.ts:2871`
> > (sets `game.gameEnded`); the three terminal 1772 off-ramps (`lost_war`,
> > `dominion_autonomy`, `confederation_remains`) carry it (`eraEvents1772.ts:300,
> > 309, 430`). When the AI controls such a node it resolves via **`pickAIResponse`**
> > (`eraGraph.ts:88-103`) — a plain `aiBias`-map lookup keyed by faction
> > personality with **NO anti-game-over / anti-peace term whatsoever**. So a
> > CPU-controlled terminal peace node resolves by ordinary point-math, which leans
> > FOR peace — the marquee `ted1772` solo-game-ender. **Where it binds:** an
> > anti-game-over layer in `pickAIResponse` (or a wrapper at the `triggersGameEnd`
> > decision) — EITHER the flat **75%-oppose roll on any response that sets
> > `triggersGameEnd`/surrender**, OR the points-based anti-peace ideology bias
> > (human picks which). **Size: S.** This is **one of the three RevWar floors — build
> > it WITH the #155 war-balance pass (E3)** and the #75 CPU event-vote handler (E9).
> > game-mechanics §13.2 + §25.7.
> > **(4) #155 three RevWar floors — a HARD CONSTRAINT on E3; floor (1) SHIPPED,
> > floors (2)+(3) NOT.** `revolutionaryWar.ts` is the cleanest fresh-start RevWar
> > trace's engine. **Floor (1) — the French-alliance unloseable flag IS SHIPPED:**
> > `applyFrenchAlliance` (`:268-270`) sets `war.frenchAlliance = true`, and the loss
> > condition `currentGroundLosses >= groundLossesRemaining && !war.frenchAlliance`
> > (`:259`) VOIDS once allied — preserve this exactly. **Floor (2) — the 2/3
> > peace-vote threshold is NOT built:** terminal peace lives only as
> > `triggersGameEnd` era events (above) with **no vote gate at all** — there is no
> > 2/3-of-states requirement anywhere; in `ted1772` a 5-4 = 55.5% MAJORITY for peace
> > FAILED only because of this threshold, so 55.5% must NOT pass. **Floor (3) — #158
> > (above), NOT built.** **The constraint on #155:** when the war-balance pass adds
> > the enemy-strength term + battle-size weighting + the Officer-Mil-share cap +
> > per-theater scoring (from `hd1`, batch 16), it MUST be bounded so a 1772 game with
> > all three floors intact still stays winnable — a war engine tuned hard enough that
> > a 1772 game loses before 1788 WITH the floors is over-tuned. game-mechanics §21.1
> > (the #155 HARD CONSTRAINT block) + §17.4 + §23.3.
> > **(5) FL-on-death → IMMEDIATE replacement (fork RESOLVED) — shipped code still
> > DEFERS.** On a faction-leader's death, `cleanupLeadershipAndProtegeChains`
> > (`phaseRunners.ts:2304-2312`, invoked from the 2.4.1 deaths runner) nulls
> > `f.leaderId` + `leadershipStartYear` and waits — the seat sits empty until the
> > next **2.2.3** sweep elects a successor (the vacant-seat election is the
> > "invalid → Step 2 Election" path at `runPhase_2_2_3_FactionLeaders`,
> > `phaseRunners.ts:1975-2009`). Ted reversed his own initial ruling LIVE: *"New
> > rules dictate that dead faction leaders are immediately replaced."* **The fix:**
> > run the 2.2.3 vacant-seat election (or factor its body into a
> > `electFactionLeader(snap, f)` helper) immediately from the death cleanup, instead
> > of deferring. **Size: S** (a small refactor — lift the election body and call it at
> > death time). game-mechanics §10.1 + §8.3.
> > **(6) DH-65 founding dataset bugs — dataset/build-validation fix; the ENGINE
> > exclusivity is already SHIPPED.** (b) Cosmopolitan ⊕ Provincial: `TRAIT_CONFLICTS`
> > (`types.ts:675-676`) already maps the pair mutually-exclusive, and `addTrait` /
> > `tryGrantTrait` (`engine/traits.ts`) enforce it — and the current generated
> > `public/standard-draft-classes.json` has **0** both-held pairs (verified: 18,561
> > pols, none hold both). So the live forum both-held was a spreadsheet artifact; the
> > engine is clean. (a) The wrong-century / same-name collisions are the real build
> > TODO: the merge in `legislatorsToDataset.mjs:276-302` disambiguates same-name
> > people by a ±25-yr birth-window heuristic (`ERA_SAME_PERSON_WINDOW`) but does NOT
> > validate the founding-era pool for wrong-century entries, and there is no
> > build-time assertion gate. **The fix:** a `scripts/seedDataset.mjs` CURATED_ROWS
> > audit over the 1768-1776 founding window + a dataset-build validation pass that
> > flags same-name-wrong-century collisions, then regenerate. **Size: XS** — joins
> > the #120 dataset-umbrella pass (same class as DH-64's `Southern Unionist` fix).
> > game-mechanics §4.1.z.
> >
> > **Decision-gated RECOUNT (batch 17 nets 0 — but TWO forks RESOLVE OUT):** no item
> > enters the user/designer Decision-gated bucket. TWO forks LEAVE it: **FL-on-death
> > → immediate** (was an open fork; now ruled) and **#153 expertise/Command rules →
> > 3-source canonical** (was 1-source; now build-with-confidence). Three OPEN
> > QUESTIONS the digest raises stay human-gated (tuning, not blockers): (a) #158 —
> > flat 75%-oppose vs points-based anti-peace bias (pick one); (b) negative-points
> > floor — V's 0-floor vs Ted's run-continuity negatives (likely the 0 floor); (c)
> > St. Clair home-state PA-vs-OH when an alt-state isn't owned yet (pairs with #92's
> > territory gate). All bind inside E1/E3/E9 and are flagged at §30.x.
> >
> > **CORROBORATION only (no keystone moves):** #133 1st/2nd CC composition (4/3/2
> > delegate size table + faction-picks-pre-DoI / Gov-picks-post-Articles +
> > no-consecutive-terms + 2/3-pass + Foreign-Chair-appoints, verbatim from a 1772
> > boot); the #70–#79 CPU suite re-validated from a mostly-CPU 1772 angle (#74 got
> > Ted's cleanest 4-step crisis→faction→team→opponent articulation); #86/#136
> > founding boot + random-skill-grants-no-Command; DH-61 (NW-Indian-War "3 chances"
> > origin + the alt "War of 1812 in 1782" branch, offered & declined — direct
> > corroboration of the boot-active-war seeding item). Plus several designer-RULED
> > items folded into topical homes (one-protégé-per-turn cap; conversion-target
> > once-per-half-term; manipulative-gov-self-appoint forfeits the Gov action;
> > governor-industry-boost-needs-matching-expertise; pre-12A VP = most-EV
> > runner-up, sharpening DH-62). **No NEW keystone, NO re-sequence; top of queue
> > UNCHANGED.**
> >
> **★★ Batch-15 changes to the plan (`terror2000` / `3843d2da` — the FIRST NATIVE
> 2000-start "Era of Terror" modern campaign; Ted-run [DESIGNER authority, same
> class as `tedchange`/`oopscpu`], CPU-heavy, plays ~2000→~2010. NO new keystone;
> but it produces THREE high-value engine deltas that PROMOTE existing items and
> resolve two long-open gates):**
>
> > **★ Read this block if you only read one for batch 15. The headline: this run
> > produced the FIRST PROVEN GAME-OVER / LOSS STATE in the entire KB (#88), the
> > first whole-war DEFEAT with a loss package (#152), and it CLOSED the #18
> > election-scorer state-scope fork (V's 2-layer model is now the SETTLED scorer).
> > These are all MODERN-ENGINE items — mid-tier, not keystones — so the top of the
> > queue does NOT move (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1 still lead), but
> > #18 + #88 are attractive mid-tier wins that de-risk the election + endgame
> > surfaces and remove a 3-batch-old decision gate. This is the 4th Ted-run/CPU-
> > heavy source — it FIELD-VALIDATES the E9 CPU suite + #1 faction-handover from a
> > MODERN angle (two CPU factions handed to humans mid-thread, `POST 658-664`) and
> > is the 2nd modern-era native run (after the `pop` 2012 boot).**
> >
> > **Verified shipped-state of every batch-15 item (grep/Read-confirmed):**
> > **(1) #88 autocratic-coup end-condition — UNBUILT as a meter-driven path.**
> > `EraEvent.triggersGameEnd` (`types.ts:1476`) is the ONLY game-over path; it is
> > consumed at `phaseRunners.ts:2871` (`runPhase_2_4_3` → sets `game.gameEnded`,
> > `types.ts:1635`) and is **event-only** — there is NO per-event-phase game-end
> > ROLL, no meter-watcher, no Honest-Gov→coup gate anywhere in the engine. The
> > `GameOverScreen` (`App.tsx:341` → `components/GameOverScreen.tsx`) already reads
> > `game.gameEnded`, so the TERMINAL surface exists; only the meter-driven TRIGGER
> > is missing. **`terror2000` is the first record of ANY game-over firing** (the
> > 20%/event-phase "Autocratic Coup Ends America" roll, Honest-Gov at floor,
> > `POST 827, 829`), so it converts #88 from "is it worth building?" to a SHIPPABLE
> > terminal. **Size: S** (a per-phase roll-table in the Lingering/event phase +
> > one `gameEnded` write + a HUD warning). game-mechanics §26.4 (the `rep1800`
> > enumerated game-end set is the home — Autocratic-Coup is one row, now CONFIRMED).
> > **(2) #152 war-DEFEAT loss package + multi-phase wars — UNBUILT.** The generic
> > resolver `runPhase_2_7_2_Military` (`phaseRunners.ts:3593-3627`) DOES end a war
> > at `warScore ≤ -50` (`:3618-3620`, logs "ends in our defeat") but applies **NO
> > loss package** — it is a bare log line; there is no officer/President election
> > penalty, no Party-Pref crater, and the flat `milPower×10 + d100` model has no
> > named phases/carry-roll. (Note the row also carries the pre-existing raw
> > `Math.random()` at `:3603` — debt #2/#16.) The loss package (officers −1 Mil +
> > −1 all-elections; **President −1 ALL future elections**; Party-Pref crater) is
> > the INVERSE of the victory bundle and attaches to the generic `War` model that
> > the war engine (Phase-1 #3 / #56/#106) already must build. **Size: M within E3
> > (war engine)** — it does NOT open a new epic; it is a required completion of the
> > "war must RESOLVE" finding (DH-47). game-mechanics §21.1.
> > **(3) #18 election scorer — now SETTLED (no open fork), but the 2-layer model is
> > UNBUILT.** `calcStateVote` (`phaseRunners.ts:3685`) today is
> > `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias + traitBonus
> > + (Math.random()-0.5)*8` (`:3709-3711`) — the enthusiasm box is read RAW
> > (`enthusiasm[ideology][party]`, `:3696`) and applied uniformly with NO ±3 cap
> > and NO universal-meter layer. Ted (running the 2000-start) REVERSED his own
> > batch-10 "every state unless penalized" reading to V/vcczar's 2022 canonical
> > intent (`POST 913-926`): **(a) a universal per-ideology METER modifier** (flat,
> > BOTH parties, EVERY state, primary AND general — the "unless penalized" caveat is
> > GONE) **+ (b) the per-PARTY enthusiasm box** (moved by the #51 4-step reshuffle),
> > composed additively then ±3-capped. **This CLOSES the long-open #18 state-scope
> > sub-question** (the three batch-10/11 variants are retired) — so #18 LEAVES the
> > Decision-gated bucket and is **PROMOTED to ready-to-build** on `calcStateVote`,
> > composing with the already-settled #51 reshuffle algorithm (§29.10) + the QW3 ±3
> > cap (#80). **Size: S–M** (layer (b) + the ±3 cap are the QW3/E23 work already
> > queued; layer (a) is a new per-ideology meter→modifier table read once per
> > candidate). game-mechanics §29.3.
> > **(4) Cabinet cluster #124 + #151 — RE-SCOPE of E16; UNBUILT.** The pick
> > `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is still a flat scored
> > pick (no Senate vote, no enthusiasm channel, no penalty). Batch 12's #124 already
> > re-scoped E16 to bundle the confirmation + the cabinet→enthusiasm rework; batch
> > 15 SHARPENS #124's enthusiasm channel to Ted's LIVE-retuned **3-state
> > upset/fine/happy** model (per-faction satisfied-wants count → fine(0) / happy(+1
> > @20%/10%) / upset(−1 @20%/10%); ONE roll/faction; same-ideology factions stack;
> > ±3 cap — fixing the "Mods +18" stacking bug, `POST 486-489`) and ADDS the NEW
> > **#151 same-party appointment-FAIRNESS penalty** (−500 points per slighted
> > same-party faction incl. the Pres's own; fired LIVE twice — Bush −2000, Oprah
> > −2000) + the **Era-of-Terror cabinet-DIVERSITY penalty active natively** (−2
> > enthusiasm to Civil-Rights/Reformist/LW-Activist factions if <25% women/minority
> > in cabinet+cabinet-level). All three are **Era-of-Terror-gated** (a §27.1 era-BAND
> > RULE delta, not just content). **Re-scope E16 once more** to bundle the 3-state
> > enthusiasm channel + the #151 fairness penalty + the diversity check; #124's
> > designer-gated percentages are now LARGELY resolved by the live 3-state tuning, so
> > that designer-gated item CLOSES/NARROWS. **Size: M (the E16 rework) + S (the two
> > Era-of-Terror penalties as additive scored checks).** game-mechanics §9.3.7 +
> > §9.3.9.
> > **(5) #153 / #154 — small, draft/appointment consistency; mostly UNBUILT, one
> > already-shipped.** #153(a) "all rookies enter at 0 Command + every Command-gain %
> > DOUBLED" — rookie Command=0 ALREADY ships (`phaseRunners.ts:216`,
> > `command: 0`), but the ×2 gain is UNBUILT: `addCommandPoint` (`abilities.ts:33`)
> > takes a flat `amount` and every call site passes `1`/a const; there is no global
> > doubling knob. #153(b) "rolling an already-held expertise grants nothing (no
> > re-roll)" is **effectively already the helper behavior** — `addExpertise`
> > (`expertise.ts:5`) dedupes (returns false on a held tag) and no caller does
> > random-pick-then-reroll (all callers pass a deterministic `OFFICE_EXPERTISE`/
> > lobby tag), so this is a forward-only INVARIANT: any future *random* expertise
> > grant must not re-roll. #154 4-step vacancy-fill ladder (same-party-CT →
> > same-party-unemployed → other-party-CT → other-party-unemployed) is UNBUILT —
> > there is no centralized vacancy filler; `vacateOffice` (`phaseRunners.ts:2446`)
> > just nulls the seat, and the only ad-hoc fill is the SCOTUS same-party-only pick
> > at `:3661`. Both slot into the draft/Command + appointment-ladder consistency
> > work (#115a/#115b family). **Size: XS (#153 ×2 knob) + S (#154 ladder helper).**
> > game-mechanics §4.1.y + §29.4(a).
> >
> > **Decision-gated RECOUNT (batch 15 nets −2 to the gated bucket):** **#18 resolves
> > OUT** (was the last live piece of the #51 fork — user/state-scope-gated since
> > batch 10; now SETTLED → promote to ready). **#124's designer-gated percentages
> > resolve OUT** (the live 3-state tuning supersedes the §30.2 #8 "cabinet enthusiasm
> > %s" parked numeric; only the Big-4-vs-rest weighting #9 may residually remain).
> > See the Decision-gated bucket update at the §9 tail (`#18 ENTHUSIASM STATE-SCOPE`
> > → RESOLVED).
> >
> > **CORROBORATION only (no keystone moves):** #113 Era-of-Terror content band
> > (9/11 verbatim, Patriot-Act docket, era-gating of Space-Force/Sonny-Bono content),
> > #56/#106 war engine native in 2000s (the success-chance formula + naval→ground
> > gating re-confirmed), #51 reshuffle algorithm, #85/#130 5%/half-term death+retire
> > (1-death-max, retirements-first), #90/#43 modern dataset exhaustion (proc-gen
> > needed post-2024), #92 census-via-events, #102/#1 cumulative-winner end + faction
> > handover, #135 50-50-Senate=VP-party (the inverse of #135's House rule), #143
> > Command use-it-or-lose-it (the Ambitious-Judge event), DH-25 career-track
> > bootstrap (ebrk seeds ~2 pols/track/faction at boot), DH-24/DH-27 poor modern
> > boot-data quality. **No NEW CPU sub-gaps** beyond the OC-1…OC-8/#143 set.
>
> **★★ Batch-16 changes to the plan (`hd1` / `c015a0cb` — "A House Divided" PART 1,
> a SEPARATE EARLIER run from the Part-2 `hd` thread; an 1856-start, partly-HUMAN
> antebellum → Civil War → Reconstruction → restart run; GM matthewyoung123, GAs
> vcczar + Ted rule LIVE. Polarity 1856: BLUE=Dem, RED=Rep. NO new keystone, NO
> re-sequence of the top-of-queue; but it delivers the SINGLE highest-value
> Reconstruction finding in the KB — a DESIGNED FIX in hand for the DH-29
> solo-blocker — plus a substantive war-balance pass.):**
>
> > **★ Read this block if you only read one for batch 16. The headline: this run
> > REFRAMES DH-29 from a CPU-only artifact to a STRUCTURAL deadlock, and hands the
> > CANONICAL FIX. DH-29 has been on file since batch 8 (`rep1800`) as "the
> > Strict/Ironclad readmission plan can NEVER pass with CPU factions → solo
> > Reconstruction unwinnable." `hd1` is the FIRST run to play the
> > Civil-War→Reconstruction arc with HUMANS ON BOTH SIDES of the tug-of-war (a
> > human Southern-Dem wanting it short vs a human Radical-Republican wanting it
> > prolonged) — and the marquee result (GM-stated, `POST 2678`) is that **even
> > with humans the Ironclad-vs-10% choice DEADLOCKED and states drifted back into
> > the Union with NO plan at all** (mutual filibuster → null result). So the
> > blocker is NOT a CPU heuristic gap; it is STRUCTURAL (a both-chambers-must-agree
> > paralysis). vcczar's authoritative RESTART rewrite (`POST 2692-2694`) is the
> > fix: a **4-plan Reconstruction model (No-plan / 10% / Ironclad-Wade-Davis /
> > Military-district) available to BOTH the President AND Congress**, gated by a
> > single prerequisite — **"there is a reconstruction plan adopted by Congress OR
> > by the President"** — so the **President can adopt a plan UNILATERALLY**,
> > guaranteeing resolution in solo play AND in deadlocked-human play. This is the
> > #156 build target, and it FOLDS INTO the existing E3b Reconstruction epic as the
> > definition-of-done for its readmission half (§9.1.6 — which is hereby upgraded
> > from "author the rule, then build" to "build vcczar's authored rule"). This is
> > the **3rd Civil-War run** (after `hd` Part 2 and the all-CPU `drums`) and the
> > **5th antebellum source** — HIGH corroboration confidence on the
> > war/Reconstruction/secession cluster. **It does NOT move the top of the queue:
> > QW0 → K0/K2 → K3/K4 + scenarioBoot → E1 still lead** (these are subsystem-track
> > items on the already-placed E3/E3b epics).
> >
> > **Verified shipped-state of every batch-16 item (grep/Read-confirmed):**
> > **(1) #156 — the 4-plan Reconstruction model + the unilateral-adopt
> > prerequisite — ENTIRELY UNBUILT (the canonical DH-29 fix).** The whole
> > Reconstruction subsystem is absent: grep for `Reconstruction|Ironclad|
> > readmission|Confederate|CSA` in `src/types.ts` returns **ZERO** subsystem hits
> > (only the Secession-Winter loyalty-decay scaffold: a `// Secession Winter`
> > comment at `types.ts:981/1149-1157`, the antebellum slave-state set, and
> > `secessionDefectionCount?` at `types.ts:1481`). There is NO `game.reconstruction`
> > state, no readmission-plan enum, no plan-adopted gate, no +2/+1 Solid-South bias,
> > no appointed-Gov→Sen/Rep cascade, no pardon tiers. **Where it lands:** a new
> > `game.reconstruction = { plan: 'none'|'ten-percent'|'ironclad'|'military-district'
> > | null; adoptedBy: 'congress'|'president' | null; startYear; ... }` regime block,
> > plus the 4 plans as ActionRegistry rows usable from BOTH the exec-action path
> > (`runPhase_2_8_1_Executive`, `phaseRunners.ts:3632`) AND the legislation pipeline;
> > the plan-adopted gate fronts every per-state readmission; the +2 Deep-South / +1
> > other-seceded **time-boxed `bias-toward-incumbent-while-active`** modifier rides
> > the `calcStateVote` bias term (`phaseRunners.ts:3709-3711`, distinct from static
> > `State.bias`). **Size: M–L within E3b** — it is the largest single Reconstruction
> > build target, but it is now a DESIGNED fix (vcczar-authored), not an open
> > blocker; the planner's §9.1.6 "author the rule" step is DONE. **This is the
> > highest-value Reconstruction work** because it UNBLOCKS DH-29 — the named
> > solo-blocker gating every antebellum/CW/Reconstruction-bearing scenario.
> > game-mechanics §23.4.1 (the new 4-plan section) + §23.4.
> > **(2) DH-29 — REFRAMED from CPU-only to STRUCTURAL; the #156 model is its fix.**
> > The existing DH-29 row (§8.1) + §9.1.6 frame it as "CPU-can't-pass-Ironclad."
> > `hd1` proves it is **deeper**: humans on both sides filibustered each other to
> > the same NULL result (`POST 2678`). So the §9.1.6 options 1/2/3 (CPU default-vote
> > bias / crisis-bill / era-boundary auto-resolve) are no longer the only menu — the
> > AUTHORED fix is the **President-can-unilaterally-adopt-a-plan prerequisite** (#156),
> > which resolves BOTH the solo case (no CPU vote needed at all) AND the
> > deadlocked-human case. **No size of its own** — DH-29's fix IS #156. game-mechanics
> > §23.4.1.
> > **(3) #155 — war "too easy for the Union" balance pass — UNBUILT (the war engine
> > itself is unbuilt as a real model).** The shipped generic resolver
> > `runPhase_2_7_2_Military` (`phaseRunners.ts:3593-3627`) is a flat per-phase
> > `milPower*10 + d100 > enemyPower*10 + 50` (`:3602-3605`) with `war.warScore += win
> > ? 10 : -5` (`:3613`) and end at `warScore ±50` (`:3615-3620`); `enemyPower = 1 +
> > Math.random()*4` (`:3603`, a RANDOM placeholder — both a determinism leak [debt
> > #2/#16] and NOT a real enemy-strength term). The generic `War` shell
> > (`types.ts:1532-1546`) has a SINGLE `warScore`, `generals: string[]`, and a flat
> > `battles[]` — **no two-theater split, no per-theater scoring, no enemy-strength,
> > no battle-size, no Officer-Mil cap, no war-end multiplier.** `hd1`'s critique
> > (`POST 1000-1004`, BOTH human players + the GA): the end-war multiplier is too
> > high (changed LIVE 1.0→0.5), Officer-Mil dominates the formula (a 5-Mil officer >
> > all other terms combined), there is no enemy-strength term, no battle-SIZE
> > weighting, and a −1 loss is too small; scoring was made per-theater LIVE. **The
> > hard constraint (Euri, `POST 1004`): do NOT over-harden — the 1772 start fights
> > the Revolutionary War, which is a GAME-OVER on loss** (`revolutionaryWar.ts`), so
> > a harder war engine risks ending games before they begin. **Where it lands:** the
> > #155 balance terms (enemy-strength + battle-size + an Officer-Mil-share cap +
> > per-theater scoring) bind on the generic `War` model that the war engine
> > (Phase-1 #3 / #56) already must build — **bounded by the 1772-RevWar-winnable
> > floor.** **Size: M within E3** — it EXTENDS the war engine; it pairs tightly with
> > #152 (the batch-15 war-DEFEAT loss package) on the same model. game-mechanics
> > §23.3.
> > **(4) #157 — CSA-government seeding under-specified — UNBUILT (and the trait gate
> > behind it is unbuilt).** No CSA government exists in code: `startWar` is injected
> > by the Civil-War EraEvent (`phaseRunners.ts:2978-2981`, `out.startWar = { name:
> > 'American Civil War', against: 'Confederate States' }`) and materialized by the
> > `applyEffect` handler (`phaseRunners.ts:3240-3253`) into the generic `War` shell —
> > there is no CSA president/VP/cabinet/general seeding and no Secessionists pool. The
> > `hd1` rules define only CSA Pres/VP/Sr-General (CSA Pres = random among seceded
> > Command-holders, Comm-Gen = the sole seceded Military-Leader); the GM improvised a
> > full CSA cabinet "for flavor" (`POST 893-894`) and flagged it for the suggestions
> > thread (`POST 912`). **Where it lands:** a CSA-government seeding spec (cabinet +
> > multiple generals/admirals drafted from the seceded Command/Military pool) inside
> > the secession/war epic — **needed for the CSA-VICTORY branch** (vcczar's `POST
> > 2692` ruling: if the South wins, seceded pols are removed, Unionists move to the
> > nearest loyal state, events drive eventual reintegration). **Size: S** — folds
> > into the #58 secession + war epic; depends on the per-pol Southern-Unionist/
> > Secessionist gate also being built (which is itself unbuilt — see DH-64).
> > **(5) DH-64 / #158 — `Southern Unionist` trait mislabeled on Southern draftees —
> > DATASET fix; the trait is not even a wired gate yet.** grep confirms `Southern
> > Unionist` appears NOWHERE in `src/` as a trait (the only `Unionist` hits are an
> > unrelated faction `fact_blue_unionist` "Unionist Democrats" at
> > `factions1856.ts:7` and a `// Blue Unionist` comment at `politicians1856.ts:43`).
> > So DH-64 has two layers: (a) the dataset-LABELING fix — many Union-officer-settled-
> > South, Black-Republican, and Northern-residing-Southern draftees were UNlabeled,
> > forcing the GM to hand-fix across the 1864/1868/1872 drafts (`POST 1446, 2682`);
> > and (b) the FUTURE per-pol secession gate (#58) that will READ the trait. The fix
> > is a `scripts/seedDataset.mjs` CURATED_ROWS audit (the trait array, alongside the
> > existing `'Nationalist'` tags at `seedDataset.mjs:137-229`) + regeneration of
> > `standard-draft-classes.json`, validated at dataset-build time. **Size: XS** —
> > joins the #120 dataset-umbrella pass (the `Southern Unionist` column specifically
> > on VA/MS/FL/Border draftees). game-mechanics §23.1.
> >
> > **Decision-gated RECOUNT (batch 16 nets 0 — but DH-29 changes CATEGORY):** no item
> > leaves or enters the user/designer Decision-gated bucket. **DH-29's "author the
> > rule" gate is RESOLVED OUT of §9.1.6's open-options menu** — vcczar authored the
> > rule (#156), so E3b's readmission half moves from "design-then-build" to
> > "build-the-authored-design." The four cross-run OPEN QUESTIONS the digest raises
> > stay human-gated (they are tuning, not blockers): (a) permanent-vs-one-term
> > war-hero presidential bonus (Part 2 = permanent +1 all elections; `hd1` = one-term
> > +1 in 1864); (b) 3-naval-wins hard-gate (#56/Part 2) vs naval-then-land
> > continue-roll chain (`hd1`); (c) war-end multiplier 1.0 (original) vs 0.5 (adopted
> > LIVE here); (d) does the #156 prerequisite HARD-gate all readmission (none until a
> > plan is adopted) or allow a default No-plan. These all bind inside E3/E3b and are
> > flagged at §30.x for the human.
> >
> > **CORROBORATION only (no keystone moves):** #56 two-theater war (deepest spec yet:
> > E/W theaters, the per-battle success% formula `base − Difficulty + Planning +
> > Officer×10 + Prep + Benchmarks → d100`, WarScore naval/easy +2 / Difficult-land +3
> > / loss −1, Decisive-General +2, named-battle officer casualties, temp-general
> > fallback, court-martial, Major-War lingering penalty bundle, the Appomattox
> > victory package); #57 Reconstruction onset (vcczar's `POST 1320-1323` ruling:
> > appointed Govs/Sen/Reps + NO EVs + Loyalist representation, Pres→Gov→Sen/Rep
> > cascade re-run each term, 2-yr no-limit Govs, generate-a-Gov-if-none, 3 pardon
> > tiers); #58 secession (bungled-Presidential-decision trigger on JUDICIAL skill,
> > the blunder ALONE fires it; CSA event chain LA-first-by-d6; per-pol secession gate
> > Southern-Unionist-stays / Nationalist-rolls / else-inactive; no-relocate-into-
> > rebel-state); #59 free/slave crisis (the exact §59 package fires on imbalance
> > after a statehood bill; retired on emancipation); #92/#109 era-content gating; the
> > full standard turn loop. **No NEW keystone, NO re-sequence; top of queue
> > UNCHANGED.**
>
> **★ Batch-14 changes to the plan (`gild1868` / `bf590684` — the first dedicated
> NATIVE-1868 Gilded-Age campaign, 6318 posts, the LARGEST thread in the KB; runs
> 1868 → ~1886 and dies in GM burnout. NO new keystone, NO re-sequence of the
> top-of-queue — this batch is DOWNSTREAM era-content that lands AFTER the era
> model + economic engine.):**
>
> > **★ Read this block if you only read one for batch 14. The big picture:
> > `gild1868` is the richest single record of the Gilded-Age issue engine actually
> > being played (tariff %, currency, civil-service, trusts, the 20-yr
> > Reconstruction regime, AfAm enfranchisement, imperialism). But the Gilded Age is
> > UNBUILT — the `Era` enum is `independence | federalism | nationalism | modern`
> > (`types.ts:1337`, NO `gilded`), only `scenario1772.ts` / `scenario1856.ts`
> > exist, and the era is hand-run on `modern` tuning (gap #41). The thread is
> > almost entirely the unbuilt design. It surfaces FIVE new deltas — #147–#150 +
> > DH-63 — that are ONE "gilded-era content" epic (§9.1.10 below), and it
> > corroborates the standing Gilded cluster (#3/#5/#6/#21/#41/#57 + the convention/
> > amendment/SCOTUS/spending-cap/gov-action machinery) from a native start. **It
> > does NOT move the top of the queue: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1
> > (`scenario1788`) still lead.** Gilded content rides on top of K3/K4 (the
> > era-content-band model), the economic engine (#116 / E4c), the bill-relationship
> > graph (#42), and the Reconstruction epic (#57 / E3b — which inherits the DH-29
> > solo-blocker). DH-63 folds into #42 + #147's MonetaryRegime; #148 EXTENDS #57,
> > it does not open a new epic. **3rd GM-burnout death** (`gild1868`, after
> > `new1772`/`dem1820`) — cite for the automation-reduces-upkeep argument; do not
> > queue.**
> >
> > **★ POLARITY FLIP (load-bearing for any `gilded` scenario data):** by 1868 the
> > parties have INVERTED from the founding era — **RED = Republicans** (Grant,
> > bloody shirt, Reconstruction, tariff/business, Stalwart/Half-Breed/Mugwump) and
> > **BLUE = Democrats** (Solid South, Tweed/Tammany, soft-money/Free-Silver),
> > `gild1868` POST 6. This is the OPPOSITE of the founding-era BLUE = Dem-Rep
> > frame, so a `scenario1868` `BootSheet` faction roster + nickname table is
> > red/blue-flipped vs `scenario1772`. The era-content-band model (K3/K4) must
> > carry party-label-by-era, not assume a fixed RED/BLUE↔party mapping.
> >
> > **Verified shipped-state (every item below is DESIGNED, not built):**
> > **(1)** `Era = 'independence' | 'federalism' | 'nationalism' | 'modern'`
> > (`types.ts:1337`) — **NO `gilded` value**; only `scenario1772.ts` /
> > `scenario1856.ts` exist (no Gilded/1868 scenario). **(2)** the tariff is a
> > **±0.5 meter-nudging flavor bill** — `BILL_TEMPLATES` "Tariff Increase"
> > `meters: { revenue: 1, economic: -0.5 }` / "Tariff Reduction"
> > `{ revenue: -0.5, economic: 0.5 }` (`phaseRunners.ts:3421-3422`) — there is **NO
> > `game.tariffRate` national integer and NO `MonetaryRegime` enum**. **(3)** there
> > is **NO Reconstruction subsystem** in code (#57 is the readmission/war-victory
> > SPEC; the KILL exists but `vacateOffice` just nulls the office,
> > `phaseRunners.ts:2446`) — no auto-expiry timer, no appoint-by-Speaker/PPT,
> > no Solid-South bias-sunset. **(4)** there is **NO civil-service / merit-vs-spoils
> > axis** (no merit-reform bill, no State-Gov-Jobs spoils lever). **(5)** there is
> > **NO special-election branch** (every state resolves via `calcStateVote`,
> > `phaseRunners.ts:3752`). **(6)** currency/regime bills have **NO exclusivity
> > guard** — `Legislation` (`types.ts:1506`) has no `type`/`replaces` field, so two
> > contradictory currency regimes can hold at once (DH-63).
> >
> > **The load-bearing build items this batch sizes (one epic; each binds in code as
> > noted) — see §9.1.10 for the dependency table:**
> > 1. **The dedicated `gilded` era + `scenario1868` is the UMBRELLA (#41).**
> >    `gild1868` is the **full native spec** for it: faction roster (red/blue-
> >    flipped, 10 factions / 2 parties, `gild1868` POST 6), the Gilded nickname
> >    table (Stalwart / Half-Breed / Mugwump / Bourbon / Readjuster …), the
> >    era-event spine (Philippines-from-Spain, women's-suffrage A/B, census EV
> >    deltas, Labor Unions / RJ Reynolds / Vaudeville / Twain / Nast / steamships),
> >    the bill catalog (tariff-rate / currency-regime / civil-service / ICC /
> >    statehood), the SCOTUS docket (Elk v Wilkins, Allgeyer v Louisiana), and the
> >    20-yr Reconstruction timer. **`scenario1868` is "another scenario-as-data-row"
> >    once the BootSheet pipeline + content-band era model land — AFTER
> >    `scenario1788` + a mature `advanceEra`.** Binds: `Era` enum (`types.ts:1337`),
> >    the era-content registry (K3/K4), the `BootSheet`/`scenarioBoot` pipeline
> >    (§9.1.9). **L** (a whole era's content + a scenario boot).
> > 2. **#147 tariff-as-%-rate + the mutually-exclusive `MonetaryRegime`.** Add
> >    `game.tariffRate: number` set/changed by a `"Set Average Tariff Rate to N%"`
> >    bill type (+ a "standardize and reform" lower-rate variant), subject to the
> >    federalism §20.4 change-cadence; add a
> >    `MonetaryRegime = 'gold' | 'bimetallic' | 'freeSilver' | 'nationalBank'` enum
> >    where the regime bills are **mutually exclusive** (passing one clears the
> >    others). Replaces the flavor bill at `phaseRunners.ts:3421`. Depends on the
> >    economic-content engine (#116 / E4c) + the bill-relationship graph (#42).
> >    **M.**
> > 3. **#148 20-year Reconstruction timer + appoint-by-leadership + Solid-South
> >    sunset.** EXTENDS the #57 / E3b Reconstruction epic (does NOT open a new
> >    epic): a `game.reconstruction = { startYear, endsYear }` regime clock
> >    (begins 1864, auto-ends ~1884), appoint seceded-state Gov/Sen/Rep seats by
> >    Speaker-faction / PPT-faction (majority-party military Govs, non-seceded
> >    appointees per the §23.1 Unionist tag), a +2-RED bias-while-active that
> >    SUNSETS to a Blue Solid South at expiry (FL/GA/LA Blue+3→+5, VA Blue+2→+5,
> >    `gild1868` POST 5145), per-state early end by repeal-bill. **Inherits the
> >    DH-29 solo-blocker** (Strict/Ironclad never passes with CPU factions) — that
> >    must be resolved before any antebellum/CW/Reconstruction scenario ships solo.
> >    **S–M within E3b.**
> > 4. **#149 civil-service merit-vs-spoils axis (+ era-gated reform content).** A
> >    merit-reform bill (the in-game Pendleton Act) that shifts how appointments are
> >    filled + the State-Gov-Jobs spoils lever feeding DomStab + the Honest-Gov't /
> >    corruption interplay; **gate reform content** (Social Mobility gov action,
> >    income-tax bill) to the Progressive era via the era-content registry. Sharpens
> >    #3. Depends on K3/K4 (era-gating). **S–M.**
> > 5. **#150 "1872 Rule" special-election branch.** A meter-gated "disorganized
> >    party" special-election: at the first election after Reconstruction begins, if
> >    party-pref is Red+2/+3 AND a d6 lands 1-2, field an opposite-party-independent
> >    nominee run by the loser's weakest faction. Niche election-content; pairs with
> >    #57/#148 + #48 third-party trigger. **S.**
> > 6. **DH-63 currency-regime exclusivity bug → folds into #42 + #147.** Make
> >    currency-regime bills a **mutually-exclusive set** in the bill-relationship
> >    graph: activating one auto-deactivates the contradictory regimes. (Also flags
> >    the filibuster carry-over ambiguity, `gild1868` POST 939 — matches the
> >    `drums`/`hd` open Q on #10.) **XS–S** (it is the exclusivity constraint
> >    #147's MonetaryRegime + #42 already build).
> >
> > **No re-sequence: the top-of-queue is UNCHANGED.** QW0 → K0/K2 → K3/K4 +
> > scenarioBoot → E1 (`scenario1788`) lead. The gilded-content epic is downstream
> > (it consumes K3/K4 + #116 + #42 + #57). The 3rd GM-burnout death reinforces, but
> > does not add to, the automation-reduces-upkeep argument (cite, don't queue).
>
> **★★★ Batch-13 changes to the plan (`oopscpu` — Ted-run all-CPU 1788 stress-test;
> the K5/E9 VALIDATION source; designer-authoritative, same class as `tedchange`.
> NO new keystone, NO re-sequence — `oopscpu` DE-RISKS the existing E9 plan):**
>
> > **★ Read this block if you only read one for batch 13. The big picture:
> > `oopscpu` is the first batch that systematically validates a whole subsystem's
> > spec (the K5 CpuController + the E9 §25 handler suite) BEFORE it is built. Ted
> > ran every faction on the CPU rules and stopped, live, at each spot where the
> > rules are vague, contradictory, or impossible without human judgment. The
> > result: it does NOT change the K5/E9 build ORDER, but it turns the E9 handler
> > specs #70/#72/#73/#74/#75/#76 from "designed" into "designed + field-validated
> > with concrete failure modes + Ted's fixes." Higher build-confidence; lower
> > spec-risk. The OC-1…OC-8 sub-gaps fold into the relevant handler rows as
> > sub-rules (the handler-order table in §6.6.1 is updated below). Two NEW
> > prerequisites for ANY 1788 boot — DH-61 (boot-seed active wars) + DH-62 (pre-12A
> > EC mode) — must land WITH `scenario1788` (E1). Two NEW open design calls —
> > OC-4 (off-ideology draft gate) + OC-8 (define "office") — go to the
> > designer-gated parking bucket.**
> >
> > **Verified shipped-state of the load-bearing CPU items (re-grounded for this
> > batch):** The engine has CPU code ONLY for the meta-passes — draft auto-pick
> > (`pickBestForFaction` `phaseRunners.ts:33-53`; pick loop `:241-262`), relocation
> > (`RELOCATION_ODDS.cpuGate`), ideology shifts (`IDEOLOGY_SHIFT_ODDS.cpu`),
> > conversions (`CONVERSION_ODDS.cpu`), kingmaker auto-assign, cabinet auto-fill,
> > era-event `pickAIResponse` (`eraGraph.ts:88-103`), and CC consensus
> > (`autoFillCPUVotes`, `constitutionalConvention.ts:81`). **There is NO
> > leadership-IRV / legislation-vote / event-vote / SCOTUS-vote handler.** Spot-
> > verified the load-bearing ones: **(1) cabinet auto-fill** (`runPhase_2_3_1_Cabinet`,
> > `phaseRunners.ts:2158`) is a **flat highest-score pick** (`scoreCabinetCandidate`
> > = admin·w + governing·w + expertise bonus) → seats immediately with `cabinet[seat]
> > = pick.id` — **NO Senate vote, NO ladder/refuse-roll, NO scandal-guard, NO
> > firing-precedent gate**; **(2) leadership** (`runPhase_2_2_1_CongressLeadership`,
> > `:1844`) computes `senateMajority`/`houseMajority` INLINE TWICE (`:1863-1864`,
> > `blue >= red`) and picks Speaker/PPT as the top-PV member of that majority party —
> > **NO IRV bloc-vote, NO closest-ideology cross-party rule, NO single shared
> > "chamber control" definition** (the OC-2 collision surface); **(3) legislation**:
> > no per-CPU NAY/AYE/NAY pass exists on the floor at all (the only `autoFillCPUVotes`
> > is the CC path); **(4) `loseCommand`** (`abilities.ts:15`) is called ONLY at
> > `phaseRunners.ts:2410` (old-age/Anytime loss) and `:2709` (event effect) — **NO
> > post-election Command decay** (note: the battle/defeat penalty at
> > `revolutionaryWar.ts:137` uses `loseSkill`, not `loseCommand`); **(5) succession**:
> > `vacateOffice` (`:2446`) just sets `presidentId = null` on death — **NO VP-inherits
> > branch, NO acting state, NO leadership re-run**; **(6) `scenario1788` does not
> > exist** (only `scenario1772` / `scenario1856`), and no boot seeds active wars except
> > the 1772 Rev War; `calcStateVote:3711` still carries the raw-`Math.random` jitter
> > (debt #1).**
> >
> > **The load-bearing build items this batch sizes (each binds in code as noted):**
> > 1. **OC-3 crisis-vote gate (★ BALANCE-CRITICAL).** Maps to the **legislation-vote
> >    handler (§25.6 / E9 handler 9b / #74)**. Without it, CPUs vote AYE on crisis
> >    bills that hurt their own ideology/lobby cards (the all-CPU run abolished
> >    slavery peacefully by 1792, no secession, `oopscpu#POST 162-180`). Two sub-checks:
> >    an **ideology-floor gate** (don't AYE a crisis bill that costs your own cards)
> >    + a **secession/slavery-active check** before an Abolish-Slavery crisis bill
> >    can pass. **S** (two predicates on the handler the epic already builds); the
> >    exact weighting is a design dial. **This is the single highest-priority sub-rule
> >    inside handler 9b.**
> > 2. **#143 post-election Command-decay pass.** NEW, RULED, standalone. After every
> >    presidential cycle close, every living pol NOT on a Pres/VP ticket has a **40%
> >    chance of −1 Command** ("shit or get off the pot", `oopscpu#POST 1, 224`).
> >    Binds in **`runPhase_2_10_End` (`phaseRunners.ts:4171`), gated on
> >    `isPresidentialYear`, after the 2.9.4 ticket roster is known**; applies via the
> >    existing `loseCommand` (`abilities.ts:15`). **XS** — one new pass, one roll,
> >    needs the ticket roster from the election phase. Pairs with #85/#130
> >    death-schedule discipline (same `runPhase_2_10_End` site).
> > 3. **#61 death-succession branch.** Reconciled spec (game-mechanics §24.1 +
> >    §29.9): a Presidential **DEATH** → VP becomes **FULL President** (refuses
> >    "Acting", **no action-divert roll**), is **NOT auto party/faction leader** →
> >    **re-run the leadership IRV**. This is **distinct from** the incapacity /
> >    0-Command / ineligible-substitute case, which keeps the `arkzag`
> >    acting-president + action-divert read. **Extends E10b** (already re-scoped in
> >    batch 11 for the kill→succeed→fill chain) — `oopscpu` supplies the reconciled
> >    death-branch spec. Binds at `vacateOffice`/the death path
> >    (`phaseRunners.ts:2446`) + the leadership runner (`:1844`). **S** within E10b.
> > 4. **OC-2 single "chamber control" definition.** Maps to **§25.3 / E9 handler 9c
> >    (#70)**. The marquee collision bug: closest-ideology leadership can hand chairs
> >    to the minority party, then the "≥60%-chamber → may propose" gate reads chamber
> >    control differently → minority chairs propose under the majority's threshold
> >    (`oopscpu#POST 151`). Fix: **ONE canonical `chamberControl(snap, chamber)`
> >    helper** shared by leadership-select AND the proposer gate. The inline
> >    `senateMajority`/`houseMajority` duplication at `:1863-1864` is exactly the
> >    surface to consolidate. **S** (one helper + two call-site migrations).
> > 5. **OC-1 scandal-resignee re-appointment cooldown + OC-5 court-as-firing gate.**
> >    Both map to the **cabinet/appointment handler (§25.5.4 / E9 handler 9d / #73)**.
> >    OC-1 (`oopscpu#POST 65`): a scandal-resignee is immediately re-appointed to
> >    another appointed office — the CPU has no scandal-smoother memory. It is the
> >    concrete instance of **DH-22 / §25.15.3** and reads the K5-introduced
> >    `recentScandalIds?` state. OC-5 (`oopscpu#POST 184-187`): the CPU dumps
> >    un-fireable cabinet members onto SCOTUS to evade the firing-precedent rule — gate
> >    a cabinet-vacating SCOTUS appointment behind the firing-precedent gate (§21.4).
> >    **XS each** within handler 9d; OC-1 needs the scandal-cooldown persistent field.
> > 6. **Pre-12A election mode (DH-62) + boot-seed active wars (DH-61) — BOTH 1788-boot
> >    prerequisites.** DH-62: a pre-12A two-votes-per-state / no-ticket EC mode (top
> >    EV = Pres, runner-up = VP, no separate VP ballot) + same-state-EV exclusion
> >    (`oopscpu#POST 197`) + the throwaway-tie defense (the §25.1 pre-12A nomination
> >    trio incl. VP retention). An **era-keyed election-mode variant** for
> >    1788/1792/1796 — a genuinely new resolution branch alongside the per-state EC
> >    method (#5 / divergence #20) and the `electorsByLegislature` flag. DH-61: the
> >    `scenarioBoot` pipeline must read a start-year **active-wars table** and
> >    instantiate each historically-running war (1788 → Northwest Indian War, 20%-loss
> >    / WS −2) — they boot at peace today except the 1772 Rev War. **Both gate ANY
> >    `scenario1788`**: DH-62 is **M** (new EC resolution branch; lands with E1 / the
> >    per-state-EC epic #4); DH-61 is **S** (a `BootSheet.activeWars` field + a boot
> >    hook in `scenarioBoot`, lands in K4 / the boot pipeline with E1).
> >
> > **OPEN design calls (NOT ready-to-build — designer-gated):** **OC-4** (off-ideology
> > CPU draft gate — Ted wants "a better third way" than draft-strong-pol-off-ideology
> > vs. uncontested; `oopscpu#POST 227-228, 234`) and **OC-8** (define "office" for the
> > Scandalous-Non-Office-Holder forced-out event + rewrite the event text; flagged to
> > `@vcczar`, `oopscpu#POST 334, 336`). Add both to the **designer-gated** parking
> > sub-bucket (alongside the 9 open `tedchange` items). The all-CPU run also RESOLVES
> > **#52 for the all-CPU case** (CPU SCOTUS by ideology-distance) — the player-vs-CPU
> > fork stays user-gated for human games — and **could NOT reach the convention CPU
> > (#71)** because 1788 predates conventions: a **post-12A all-CPU run would validate
> > #71** the same way `oopscpu` validated #70/#72/#73/#74. **Recommend the
> > all-CPU-test as a repeatable spec-validation methodology** (see §9.1.3).
>
> **★★★★★ Batch-12 changes to the plan (`tedchange` + `smallbugs` — TWO DISCUSSION
> THREADS, not playtests; the DESIGNER's official rulings channel. NO new keystone,
> NO re-sequence of the keystones; ★ THE AUTHORITY HIERARCHY IS NOW EXPLICIT
> (Ted > GA > inference), QW0 CLOSES, ONE major rework lands (cabinet→enthusiasm
> #124), 19 sized Ted-rulings slot into existing epics + an ~100-item dataset pass.):**
>
> > **★ Read this block first if you only read one. The big picture: `tedchange` is
> > the OFFICIAL designer rules-doc cleanup channel — its rulings SUPERSEDE prior GA
> > calls where they conflict. Most rulings are XS–S code/constant changes that bind
> > at known sites; the **cabinet enthusiasm rework #124 is the one M-sized re-architecture**
> > (a teardown of the lobby→enthusiasm path); the **Lingering 7-step ordering #134**
> > is M as a re-spec of the meter-decay/volatility carry-forward path. **QW0
> > relocation-cap=4 is now SETTLED** (`smallbugs#POST 734-735`, vcczar 12-30-25
> > approved) — promote it from "open-design / build" to "ready-to-build with
> > const=4" and ship FIRST. **The amendments-NOT-SCOTUS-challengeable ruling**
> > simplifies the E5↔E25 interaction (Govs can't challenge amendments → drop the
> > §21.3 SCOTUS-overturns-amendment branch from E25's docket scope, keeping only
> > the strike-a-statute / mutable-threshold faces). **The ~100-item `smallbugs`
> > dataset umbrella (#120) is ONE coordinated `scripts/seedDataset.mjs` pass**,
> > not 100 backlog rows. Add a **NEW Decision-gated sub-bucket "designer-gated"**
> > (the 9 open `tedchange` items are gated on Ted/vcczar, not the user).**
>
> 1. **★★★ QW0 relocation-cap CLOSES — promote it to top-of-queue with const=4.**
>    Verified shipped: `RELOCATION_ATTEMPTS_PER_TURN = 5` at `src/types.ts:247`.
>    `smallbugs#POST 734-735` settled the cap on **12-30-25** ("Approved by vczar"):
>    *"A faction is limited to FOUR total attempted moves per half-term. A politician
>    that moves to an ALT-STATE does NOT count against the FOUR total moves."* This
>    closes the long-running BUG-0 / QW0 / batch-10 top-of-queue item from
>    "open-design + ready-to-build" to **fully settled and ready-to-ship**. The fix
>    is **a one-line constant edit** + a guard at the relocation accumulator so
>    alt-state moves don't decrement the budget (verify the alt-state accounting in
>    `runPhase_2_1_4_Relocations`). **Recommendation: this is now the cheapest +
>    safest win in the whole roadmap; do it FIRST.** No human review-gate; no
>    designer-gate; the cap value is authoritative.
> 2. **★★★ The cabinet → enthusiasm REWORK (#124) is the one M-sized teardown
>    this batch — strategy call required.** Verified shipped: the cabinet
>    confirmation step doesn't yet exist (`runPhase_2_3_1_Cabinet`,
>    `phaseRunners.ts:2158-2223`, is a one-shot scored pick with no Senate vote
>    and no enthusiasm side-effect at all). Ted's rework (`tedchange#POST 1-4`)
>    **fundamentally re-architects the lobby→enthusiasm path** that was already
>    on the roadmap as debt #17 / DH-23 / E16 cabinet-confirmation:
>    - **(a) LOBBY satisfaction now gives bonus POINTS** to Pres + factions with
>      matching lobby cards (NOT enthusiasm — moves the cabinet-lobby coupling
>      from the `enthusiasm` table to the per-faction `score?` ledger).
>    - **(b) IDEOLOGY COMPOSITION drives ENTHUSIASM** — ≥50% cabinet of an
>      ideology = +enth that ideology; ≤20% representation = −enth.
>    - **(c) 3-shifts-per-half-term cap holds.**
>    - **(d) Big-4 / rest-of-cabinet / cabinet-level potentially weighted
>      differently** — the actual percentages are **DESIGNER-GATED OPEN** (Ted
>      RULED IN CONCEPT but the numbers are TBD).
>
>    Engineering call: **this is a CPU-action with significant state-write changes
>    + a known designer-open numeric**. **Land it AFTER K2 (ActionRegistry) +
>    AFTER K5 (CpuController)** — cabinet picks are CPU actions, and the rework
>    requires the conditional-vote-rules primitive (`pop` POST 1111) +
>    the lobby→score path that K2's action registry mediates. **It lands in E16
>    (cabinet retention refactor + dynamic seat list)** as a sibling beat — the
>    existing E16 row already plans the cabinet teardown; #124 changes WHAT the
>    cabinet writes (POINTS to factions + IDEOLOGY-COMPOSITION-driven enthusiasm,
>    not the current lobby-card-driven enthusiasm). **Re-scope E16 from "add
>    confirmation system in the right shape" to "BUILD the confirmation +
>    enthusiasm rework together in the right shape from day one"**, because
>    building the today-shape confirmation only to tear it apart for #124 is
>    waste. Size: M (was XS-S). **The numeric percentages stay designer-gated
>    until Ted closes them** — ship a const table that can be re-tuned post-design.
> 3. **★★ The Lingering 7-step strict ordering + tax/tariff carry-forward (#134)
>    is a re-spec of the meter-decay path.** Verified shipped: `runPhase_2_5_1_Lingering`
>    (`phaseRunners.ts:3260-3377`) runs cabinet-drift-driven meter writes
>    plus per-trait modulation + national-debt update — but it does NOT have an
>    explicit 7-step ordering and has NO tax/tariff volatility-vs-decay
>    distinction. Ted's `tedchange#POST 397-408` rules **strict 1→7 ordering with
>    NEVER re-doing a step + volatility = THIS-phase-only + tax/tariff decay
>    propagates forward to NEXT phase's step 3 (carry-forward across half-terms).**
>    Size: M as a re-spec of the meter-decay/volatility path (depends on the
>    meter-bank work / E6 named-ordinal meter model). **Re-scope E6/Phase-1 #6
>    (meter-model generalization + APOCALYPSE) to also carry the Lingering
>    step-order + carry-forward semantics** — same surface (Lingering is where
>    meters get written), and the step-order is the discipline the bank model
>    needs.
> 4. **★ Pres implementation 2-step Admin-then-Command blunder rule (#126) is now
>    the CANONICAL 5-tier wording.** Verified shipped: no Pres-implementation
>    path exists as a discrete code site — bill effects apply directly via
>    `applyEffect` (`phaseRunners.ts:3209`) with no Pres roll, no Admin step, no
>    blunder. Ted's `tedchange#POST 159-164` publishes the AUTHORITATIVE 5-tier
>    Command-modifies-blunder table that **supersedes the cf82a7d3 §5a #3 fuzzy
>    "hybrid" wording**:
>    - **Step 1:** Pres rolls Admin for impl (same as cabinet).
>    - **Step 2 (Blunder check):** Pres Command modifies the blunder — Cmd 5
>      avoids; Cmd 4 = 50% avoid; Cmd 3 = +1 to blunder; Cmd 2 = 50% +1; Cmd 1 =
>      normal; no Cmd / no expertise = −2 (unless Efficient on impl team);
>      Incompetent = −3; Easily Overwhelmed **skips step 2 entirely**.
>
>    Where it binds: **the Pres-implements-bill code in the legislative-depth
>    epic (Phase-2 #29 / `runPhase_2_6_*` extension)**, NOT in `applyEffect`
>    itself (which stays the post-roll write). Size: S — a roll-table + a
>    trait-gate; the trait readers exist. **Lands in E29 (modern legislative
>    depth) but the rule is now READY** (was OPEN as cf82a7d3 §5a #3).
> 5. **★ Death/retirement schedule (#130) — REPLACES the current era-mult
>    schedule.** Verified shipped: `MORTALITY_RULES` (`src/types.ts:485-516`)
>    has 4-bracket death + 3-bracket retire + 4-era-keyed `eraConfig` with
>    `deathMult` + `retireMult` — close in spirit but NOT identical to Ted's
>    schedule. Ted's `tedchange#POST 89-100, 137-148, 195-197, 396` rules:
>    - **Hale = 1/2 death chance** (RESTORED). Verified: `Hale` is NOT in the
>      `Trait` union today — needs adding (parking lot or PR-with-the-schedule).
>    - **Frail rolled FIRST in death roll; retirement rolls oldest-to-youngest
>      (no Frail priority).** Verified: today the death loop walks
>      `snap.politicians` in array order (`phaseRunners.ts:2358`) — order-aware
>      refactor needed.
>    - **Retired ex-Presidents ONLY roll for DEATH, not retirement.** Closes
>      the "John Adams immortal" loop.
>    - **Cabinet members retire at END of half-term, not on appointment.**
>    - **5%/half-term retire-death + era-scaled %s** (corroborates cf82a7d3 #4 /
>      Orange's formula).
>    - **Auto-retire at 100** (already in 2.10, confirmed pre-existing).
>
>    Where it binds: **`runPhase_2_4_1_Deaths` (`phaseRunners.ts:2341-2444`) +
>    `MORTALITY_RULES`.** Size: S — rules-const refinement + order-aware loop
>    refactor + Hale trait addition. **Lands as a coordinated PR with the #85
>    5%/half-term retire/death rate** (already queued under Phase-1 #19). The
>    Hale-half-rate + Frail-first ordering + ex-Pres-only-death are net-new
>    discipline; the era-scaled percentages refine existing `eraConfig`.
> 6. **★ Draft re-rules (#136 / #137 / #138) — small XS each, fold into the
>    draft path.** Verified shipped: `runPhase_2_1_1_Draft` (`phaseRunners.ts:
>    107-267`) uses raw `Math.random` for random-skill picking (`:187-197`)
>    AND random-skill-boost (`:196`) — both can roll any of the 6 skills incl.
>    Command. Ted's RULED draft rules (`tedchange#POST 7-10, 47-50`):
>    - **Random skill from 6, NO Command** (#136). Restrict the skill pool at
>      `:196` to exclude `'command'` from the boost. (Note: Command isn't in
>      the 6 base skills today — it's a separate `command` field on
>      `Politician`. Verify whether the boost was at one point Command-eligible
>      via the dataset / a separate path; if not, this is a no-op verification.)
>    - **No cross-party draft** (#137). Pols enter at IRL party at age 25; flip
>      via 2.1.6 only. Today's CPU pick (`pickBestForFaction`, `:33-53`) picks
>      by faction-personality-fit, not by historical party. Add a draft-time
>      assignment gate that pins a rookie's `partyId` to the dataset's IRL
>      party (and excludes cross-party drafting in the picker).
>    - **3 random traits + 3 random alt-states per draft** (#138 — SUPERSEDES
>      5/5). This is the rookie-grant pair that was already partly captured by
>      #69 (1856-native re-rule). Goes in the era-config table (§6.1 pattern).
>      Size: XS each.
> 7. **★ Conversion / ideology-shift rules (#127) — refine existing tables.**
>    Verified shipped: `CONVERSION_ODDS` (`src/types.ts:268-291`) has poach
>    matrix `same: { notInOffice: 0.2, inOffice: 0.05 }` and `cross:
>    { notInOffice: 0.1, inOffice: 0.02 }` — **the 33% party-flip Ted RULED
>    (`tedchange#POST 34-39`) is NOT a single constant**; it's the *target
>    success rate* after the willingness-multipliers stack. The shipped
>    `cross` rate of 0.1-0.02 base * willingness amplifiers is *roughly*
>    aligned, but the **same-party adjacency rule (`tedchange#POST 38, 53` —
>    same-OR-adjacent ideology eligible for same-party conversion)** is the
>    behavioral change that binds:
>    - **Adjacency** binds at the conversion-target eligibility filter
>      (`phaseRunners.ts:993-1003` distance check); migrate to the new
>      `ideologyDistance(a,b,circular)` helper (#99/§9.1.7) so the wrap +
>      adjacency unify.
>    - **LW↔RW Pop 25% cross-circle shift + Two-Faced** (`tedchange#POST 24,
>      28-29, 51`) is the IDEOLOGY-AS-CIRCLE rule (#99/§9.1.7) at 25% rather
>      than 50% with auto-Two-Faced trait grant.
>
>    Size: S total — adjacency is a one-site filter change; the LW↔RW Pop rate
>    + Two-Faced grant rides #99's circle helper + a special-case shift table.
>    **Folds into the #99 ideology-circle helper PR (Phase-1 #5b).**
> 8. **★ Kingmaker / Master Kingmaker scope (#128) — pin the +1 binding sites.**
>    Verified shipped: the Kingmaker bonus is **NOT YET a state-vote bonus** —
>    `calcStateVote` (`phaseRunners.ts:3685-3722`) does NOT consult Kingmaker
>    state to add a per-state +1. The protégé chain exists (`KINGMAKER_RULES`
>    `src/types.ts:295-307`), but the +1-in-state / +1-everywhere bonus is
>    DESIGNED-not-shipped. Ted's `tedchange#POST 316`:
>    - **Basic Kingmaker = +1 in own state ONLY** (incl. state's Pres primary
>      + state's general).
>    - **Master Kingmaker = +1 in EVERY state** (all Pres primaries + all
>      generals).
>    - **SUPERSEDES** Matt's "state OR national, pick one" reading.
>
>    Where it binds: **`calcStateVote` (`phaseRunners.ts:3711` adjust the
>    scoring sum to include `kingmakerBonus(snap, c, stateId)`)** + a new helper
>    `kingmakerBonus(snap, candidate, stateId): number` that returns +1 if any
>    Kingmaker in the candidate's faction is from the same state (basic) or
>    anywhere (Master). Size: S. **Pin the bonus binding site in the
>    election-math epic (Phase-1 #20 bill-scoring leaderboard / Phase-1 #6
>    meter-model where state-vote modifiers live).**
> 9. **★ 50/50 House split (#135) — XS, inverse-control rule.** Verified shipped:
>    `runPhase_2_2_1_CongressLeadership` (`phaseRunners.ts:1844-1889`) computes
>    `senateMajority` and `houseMajority` as `BLUE if blue>=red else RED`
>    (`:1863-1864`), which is **wrong for 50/50** — today the tie defaults to
>    BLUE silently. Ted's `tedchange#POST 65`: **a 50/50 House → leadership
>    goes to the party NOT in control of the Senate** (inverse-control rule).
>    Where it binds: **`phaseRunners.ts:1864`** — replace `houseMajority`
>    with: `houseMajority: PartyId = houseBlue === houseRed ? (senateMajority
>    === 'BLUE' ? 'RED' : 'BLUE') : (houseBlue > houseRed ? 'BLUE' : 'RED')`.
>    Size: XS one-line edit. **Ship with QW0 + the small consistency PRs**
>    (Phase-1 #19).
> 10. **★ CPU Chief Justice selection ladder (#142) — XS, replaces the coin-flip
>     court today.** Verified shipped: `runPhase_2_5_3_Court` (`phaseRunners.ts:
>     3397-3415`) is a `chance(0.5)` coin-flip on 4 hardcoded titles +
>     conserv-vs-liberal ideology majority → ±0.1 `partyPreference`. **No CJ
>     selection logic at all today.** Ted's `tedchange#POST 387-390` rules
>     the explicit CPU CJ ladder: **highest Judicial ability from their party
>     → multi-faction tie: own faction → Pres-ideology match → lowest-scoring
>     faction → multi-candidate tie: matching-appointer-ideology → random.**
>     Where it binds: **the SCOTUS docket epic (Phase-2 #25 / E25)** where the
>     CJ selection lives. Size: XS as the ladder spec is fully authored.
>     **Sharpens debt #18 (SCOTUS as a stub) + the #52 player-SCOTUS fork** —
>     the CJ ladder is CPU-side regardless of which fork wins.
> 11. **★ Amendments NOT SCOTUS-challengeable (`smallbugs` POST 250-269) —
>     CONFLICTS with `tea1772` #100, RESOLVES it in the OPPOSITE direction.**
>     Verified: there is no SCOTUS docket today (debt #18, debt #52), so this
>     is a build-target constraint, not a code change. Ted/vcczar's
>     `smallbugs#POST 250-269` ruling: **Govs CANNOT challenge amendments via
>     SCOTUS** — the Constitution is by-definition constitutional. This
>     **OVERRIDES** `tea1772`'s #100 ruling ("SCOTUS can overturn an
>     amendment via Gov-requested review"). **The build target follows Ted**:
>     drop the SCOTUS-overturns-amendment branch from E25's docket scope and
>     from E5's amendment lifecycle. **E5 retains the strike-a-statute path +
>     mutable threshold field; E25 retains the docket + Justice drift + court
>     size + DH-32 state-guard.** This is a sequencing simplification, not a
>     new item.
> 12. **★ 1st / 2nd Continental Congress composition (#133) — rewrites the
>     CC composition rules.** Verified shipped: `continentalCongress.ts`
>     handles the CC entity + `firstContinentalCongress.ts` builds the 1st CC
>     — but the **state-size delegate quota (Big=4, Medium=3, Small=2) is
>     NOT in code today** (the firstCC builder uses faction-by-pol-count, not
>     the size table). Ted's `tedchange#POST 211, 217-236`:
>     - **Big states (PA/MA/VA/MD) = 4 delegates** each.
>     - **Medium states = 3** each.
>     - **Small states (GA/RI/DE/NH) = 2** each.
>     - **1st CC (pre-DoI):** faction with most pols in a state picks delegates.
>     - **2nd CC (post-DoI):** Gov picks delegates.
>     - **Articles of Confederation:** prohibit consecutive election + require
>       2/3 of states for legislation + UNANIMOUS for amendments.
>     - **PMG appointment goes through Domestic Committee in CC era**
>       (`tedchange#POST 352-355`).
>
>     Size: S (data table + builder rewrite + Articles-of-Confederation gating
>     rule). **Lands in the existing Continental Congress era system
>     (`continentalCongress.ts` / E17 / §17.1)** — re-scope to incorporate
>     Ted's composition rules.
> 13. **★ AnytimeEvo target-pool tightening (#140) — S, content edit + filter.**
>     Verified shipped: `anytimeEvents.ts` exists (the kill `:232` lives there);
>     several AnytimeEvos grant +1 Command to "any random pol." Ted's
>     `tedchange#POST 255, 271` restricts events 5/17/23/24/25/39/66/117/118/119
>     to **Rep/Sen/Gov/Cabinet only**, and changes **Assassination = 50%
>     Pres / 25% random Rep-Sen / 25% random faction leader.** Size: S
>     (per-event filter wiring + AnytimeEvo template content edits). **Lands
>     in the AnytimeEvo data + the picker filter** (Phase-1 #19 small
>     consistency or co-locate with E9 handler 9g A/B/C event vote).
> 14. **★ Integrity-pol cannot nominate Controversial (#131) — XS, one-rule
>     guard.** Verified shipped: nomination logic is in the cabinet picker
>     (`runPhase_2_3_1_Cabinet`, `phaseRunners.ts:2158-2223`) + CPU paths
>     elsewhere; **no Integrity/Controversial gate today.** Ted's
>     `tedchange#POST 277` rules: **an Integrity-trait pol CANNOT nominate
>     a Controversial-trait pol to any office.** Where it binds: at the
>     candidate-filtering step in every nomination/appointment path (cabinet,
>     CJ, ambassadors). Size: XS as a single guard helper. **Lands as a
>     trait-aware filter helper used by E16 + E25 + diplomacy/ambassadors.**
> 15. **★ Challenge-Legislation cannot target REPEAL (#132) — XS, one filter.**
>     Verified: no Gov-Action Challenge-Legislation path today (#52 / E25 is
>     unbuilt). Ted's `tedchange#POST 246-248`: **a Gov-Action Challenge-
>     Legislation cannot target a repeal-bill** (no real-world precedent for
>     SCOTUS overturning a repeal). Build-target constraint for E25 / the
>     gov-actions library. Size: XS as a filter on the action's target list.
> 16. **★★ The `smallbugs` dataset umbrella (#120) is ONE coordinated
>     `scripts/seedDataset.mjs` pass.** Verified: the dataset overrides go
>     via `CURATED_ROWS` in `scripts/seedDataset.mjs` (see §7 + CLAUDE.md).
>     The ~100 items in `smallbugs` §2 (politicians) + §3 (bills/events) +
>     §4 (gaps) compose ONE dataset-maintenance work-item, not 100 backlog
>     rows. Size: M as a coordinated pass; sub-items are XS-S each but
>     workload is the volume. **Place as a single sized epic next to the
>     dataset regeneration pipeline** (orthogonal to the engine work, can
>     parallelize). The dataset pass also covers DH-43 (Vermont home-state)
>     + DH-51 (modern pols recency-biased) + DH-28 (trait conflict
>     validator at boot, runs on dataset import).
> 17. **★ Pres signature step lives in 2.6, NOT 2.10 (#139) — XS,
>     phase-sequence reorder.** Verified shipped: `PHASE_SEQUENCE` in
>     `src/phases.ts` includes a sign step but its placement vs 2.7
>     Military Action needs verification (today bills via `applyEffect`
>     at `phaseRunners.ts:3209` apply effects on floor pass, not via a
>     discrete Pres-sign step). Ted's `tedchange#POST 124-126`: **Pres
>     signature lives in 2.6** so military bills affect Mil-Prep BEFORE
>     2.7 Military Action. Size: XS as a phase-sequence reorder. **Folds
>     into Phase-1 #2 (bill typing + spending cap) + Phase-1 #14
>     (legislative micro-mechanics).**
> 18. **★ NEW Decision-gated SUB-BUCKET: designer-gated.** Batch 12 makes the
>     authority hierarchy explicit — **Ted/vcczar > GA > inference** (§30.4
>     of game-mechanics.md). The Decision-gated category in the roadmap
>     parking lot now splits into TWO sub-buckets:
>     - **User-gated** (the existing bucket — items waiting on the human's
>       design-call): the Senate cloture %, the #18 state-scope, the player-
>       SCOTUS fork (#52), the delegate-class fork, DH-1 filibustered-MUST-
>       pass, DH-14 era-aware bill ideology, DH-15 small-state multiplier,
>       §25.9 Iron-Fist split, divergence #10 / #84 contingent-election,
>       DH-25 career-track bootstrap, DH-33 / DH-54 impeachment, DH-41 SCOTUS
>       cascade, DH-49 population model, DH-34 era-bias policy-reactive.
>     - **Designer-gated** (NEW — items waiting on Ted/vcczar to close): the
>       9 open `tedchange` items per §30.2 of game-mechanics.md — **(1)
>       Mil-Prep meter level 4 fix**; **(2) Universal Election Modifier
>       (UEM)**; **(3) Crisis trait consolidation**; **(4) term-limit Gov
>       actions in pre-Senate era**; **(5) faithless-elector rewording**;
>       **(6) party rename trigger PL-vs-EraEvo**; **(7) VP-must-be-same-
>       party-on-resignation relaxation**; **(8) Cabinet enthusiasm
>       percentages**; **(9) Cabinet ideology weighting Big-4-vs-rest-vs-
>       cabinet-level.** The roadmap-planner should NOT schedule these as
>       ready-to-build until Ted/vcczar closes them in `tedchange`/`smallbugs`.
> 19. **CORROBORATION (confidence only, no movement):** the death/retire +
>     Hale + Frail-first family corroborates the existing #85 / DH-30 /
>     Orange's 5% formula items already in §8.1; the Lingering 7-step
>     ordering ties into the existing #134 placement under E6 / Lingering
>     epic; the CC composition rewrite confirms `continentalCongress.ts` +
>     `firstContinentalCongress.ts` as the binding sites; the Master
>     Kingmaker scope sharpens E3b / convention / kingmaker-pair work; the
>     amendments-NOT-SCOTUS folds the `tea1772` #100 conflict into a
>     simplification of E5 + E25.
>
> **★★★★ Batch-11 changes to the plan (`arkzag`, the 1820→1840 FULL-ARC
> continuation of `dem1820` — the FIRST capture of the late-game systems. NO new
> keystone, NO re-sequence of the keystones; THREE new content systems that EXTEND
> existing epics, ONE fork RESOLVED + promoted, ONE NEW fork to gate, and two sized
> bug-fixes. This batch is the planner's grounding for where the late-game content
> lands.):**
>
> > **★ Read this block first if you only read one. The three new content systems
> > (#116, #119, #61) are EXTENSIONS of already-planned epics, not new epics —
> > re-scope E4b/E5/E10b, do not add E-new rows. The #51 enthusiasm engine is now
> > SETTLED (promote the reshuffle + ±3 cap to ready-to-build; keep ONLY the #18
> > state-scope behind the human gate). One NEW fork (delegate-class) gates the
> > convention loop. Two sized bugs (DH-59 XS, DH-60 S).**
>
> 1. **★ The three new late-game CONTENT SYSTEMS all EXTEND existing epics — re-scope,
>    do not create new epics.** Verified vs shipped: NONE of these state shapes exist
>    in `types.ts` today (grep-confirmed — `GameState` has `nationalDebt`,
>    `meters.economic`, `isSlaveState`, but no `amendments`, no `economy`/`secondBank`,
>    no `actingPresident`/`successionOrder`; `Legislation` has no `type`/`replaces`/
>    `lockedUntilYear`). Where each lands:
>    - **#116 Bank-War → Independent-Treasury economic engine → a NEW item that sits
>      ON TOP of E4b(b) + E2 + E6.** This is the one genuinely-new *engine* this batch,
>      but it is **not a standalone epic** — it is the long-run **content state machine**
>      that drives the **§27.6 Second-Bank institution object already scoped in E4b(b)**
>      (the President-of-US-Bank seat + 20-yr recharter clock + Bank-War "Remove
>      Deposits" exec action). It needs: (a) **E2** (`Bill.type` crisis tag + crisis
>      bypass — the Bank/Treasury bills are CRISIS bills); (b) **E6** (the named EconStab
>      meter + crisis entry/exit + cascade — EconStab IS `meters.economic`; the
>      Panic-of-1837 CRISIS state is an E6 band-entry); (c) **E4b(b)** (the Bank
>      institution it recharters/replaces). NET-NEW fields: a `game.economy?` state
>      machine, **`Bill.replaces?`** (Independent-Treasury removes the Bank), and a
>      **`Bill.lockedUntilYear?`** per-bill-class change cooldown (the "no tariff until
>      1836" cadence). **Recommendation: add it as a small epic `E4c` (or an E4b(d)
>      sub-PR) that lands AFTER E2 + E6 + E4b(b).** Open design Q (carry it as a
>      decision, not a blocker): is the Bank→Treasury arc a **scripted branch** or
>      **emergent** from recurring EconStab-crisis legislation? The save played it
>      **emergent** — so build it emergent (recurring CRISIS bills that resolve an
>      EconStab CRISIS), which falls out of E2+E6+E4b(b) with the smallest new surface.
>    - **#119 amendment lifecycle → RE-SCOPE E5.** Verified: no `amendments` field
>      today. E5 already specs `amendments?: { id; passedYear; data? }[]` + governor-
>      ratify (§24.4) + the *Pollock*→income-tax bill-class-gate hook. #119 adds two
>      things E5's row does not yet fully carry and **must be folded into E5's scope**:
>      (1) an **explicit lifecycle state** (`proposed → inCommittee → onFloor →
>      pendingRatification → active`), and (2) an **active-amendment → blocks-a-whole-
>      legislation-class** effect (excise-tax ban, suffrage class) checked **at proposal
>      time** — the *proactive* face of the *Pollock* gate (which today is framed only
>      as a repeal/until-ratified constraint on ONE bill class). Plus the **un-bundleable**
>      flag. **No new epic — widen E5's field + add the block-hook + the un-bundleable
>      rule.** E5 stays `ready`; its dependency on E25 (the SCOTUS bill-class-gate hook)
>      is unchanged.
>    - **#61 succession/acting-president chain → RE-SCOPE E10b (it currently scopes only
>      the leaf).** Verified end-to-end: the KILL already happens (`assassination-killed`
>      anytime event, `anytimeEvents.ts:232`, fires `{ kind: 'death' }`) but death only
>      sets `presidentId = null` (`vacateOffice`, `phaseRunners.ts:2449`) — there is NO
>      succession at all. E10b today scopes `successionOrder?`/`bornForeign?`/
>      `actingPresident?` (the *0-Command-inert* acting state from `hd`). #61 here adds
>      the **rest of the chain**: assassination/death-Evo → **VP succeeds** → **must fill
>      the VP vacancy** (gated on the §29.8 VP-Vacancy amendment being `active` — so this
>      is **dependent on E5**) → **acting-president ACTION-DIVERT roll** keyed to traits
>      (Easily Overwhelmed → 50% the VP acts in his stead), layered on top of E10b's
>      Command-gates-actions rule → + the **trait-acquisition side-effect** (overwhelmed
>      successor GAINS Easily Overwhelmed + Pliable). **No new epic — widen E10b to the
>      full chain.** Note: the kill TRIGGER is the cheap part (it ships); the
>      **succession ENGINE + acting-divert** is the work. E10b's existing parking-lot
>      caveat (DH-54: impeachment/succession ruleset never authored) still applies to the
>      *line-of-succession/impeachment* half — but the **VP-succeeds-on-death + acting-
>      divert** path here is ready to spec (the rule is now documented end-to-end, §29.9).
> 2. **★★ #51 enthusiasm engine is RESOLVED — PROMOTE the reshuffle + the ±3 cap to
>    ready-to-build; keep ONLY #18 behind the human gate.** Batch 10 left this a
>    three-way fork (Ted "every state unless penalized" vs V "ideology-leaning only"
>    vs Matt "primaries only"). **`arkzag` SETTLES it:** the final chunk published the
>    4-step faction-performance → enthusiasm rule **verbatim and it MATCHES `drums`**
>    (§29.10), so the GAs converged on the canonical model. Two concrete consequences
>    the planner can act on now:
>    - **The per-Congress 4-step reshuffle pass is ready-to-build** — a NEW phase runner
>      that, after a Congress's bills are scored by-card → by-faction, fires the four
>      stacking enthusiasm shifts (MOST-for-dominant +1 toward dominant; LEAST-for-
>      dominant −1 away; MOST-for-opposition +1 toward **dominant**, *only if it gained
>      points*; LEAST-from-opposition +2 toward **opposition**, *even if it gained*) plus
>      the **−100 crisis-bill-failure / ideology-conflict-waiver → +1 enthusiasm** rule.
>      **This lands in E23 (the Enthusiasm/Party-Pref engine + Score economy), and it is
>      now `ready` — the algorithm is no longer in dispute.** Placement nuance: E23 was
>      Phase-2 (it rides E6's meter bank); the reshuffle itself is small once E6 exists,
>      and you may pull the reshuffle pass forward as soon as bill scoring (E20) + E6 are
>      done, ahead of the rest of E23.
>    - **The ±3 cap is ready-to-build and binds at `calcStateVote` (`phaseRunners.ts:
>      3709-3711`)** — it clamps the `enthusiasm*2` + `partyPref*5` terms. This is the
>      XS clamp already queued under E6/#80; batch 11 confirms the binding site and
>      removes the "wait for the fork" caveat batch 10 put on it. Ship it with E6.
>    - **The ONE remaining open piece is #18 — the state-scope sub-question** ("which
>      states does a card's enthusiasm apply to": every-state-unless-penalized vs
>      ideology-leaning-only). The §29.10 model expresses shifts **per-ideology-card**
>      and leaves the state-application step open. **Keep #18 behind a human DECISION-
>      GATE** — the cap and the reshuffle can ship; the state-scope cannot until the
>      human picks. (This is the reconciliation the planner asked for: batch-10's QW3 ±3
>      cap is now unconditionally ready; only #18 stays gated.)
> 3. **★ NEW unsettled fork — delegate-class assignment — gate it BEFORE the convention
>    loop (E10).** `arkzag` opened a NEW fork distinct from the resolved #51: **who sets
>    convention delegate classes** — **AI-auto allocation** (Zagnut's house rule, with a
>    published 5-category EV×1…×4 formula) vs **player-rigged** (Ted: insiders rigging
>    the convention is *intended* design, the host-Governor advantage). **Practice did
>    not converge** (the 1840 convention reverted to human-set). This is the
>    convention-host analog of the #52/#18 forks: **a human design DECISION-GATE that
>    must be answered before E10's delegate-apportionment sub-PR builds.** It does NOT
>    block the rest of E10 (the ballot loop, momentum, VP rubric, platform are all
>    multi-campaign confirmed — §29.11a) — only the delegate-class step. Place it as a
>    parking-lot decision feeding E10's CPU-delegate-engine sub-PR (and E24's primary
>    delegate apportionment).
> 4. **★ Two sized bug-fixes (no re-sequence):**
>    - **DH-59 (relations meter under-floors) — XS, folds into E12 (diplomacy), NOT a
>      standalone patch.** Verified: the build's diplomacy clamps to `-5..5`
>      (`applyEffect` `phaseRunners.ts:3223`; Lingering `:3295`); the forum's 9-point
>      Hostile→Allies scale with a floor-of-1 (#107) isn't built yet. So there is **no
>      fix to ship against today's code** — the floor is *part of building* the 9-point
>      scale. Enforce the documented floor (1) in the clamp when E12 lands.
>    - **DH-60 (era-events lack a territory/asset prerequisite) — S, the concrete face
>      of #92 territory-content gating.** Verified: `buildEraEventsForYear` (`eraEvents
>      1856.ts:4`) gates ONLY by year; the `EraEvent` type carries no precondition field.
>      Add a `requires?: Predicate` (territory/asset/state) on the era-event row + a
>      filter at the firing path — **the SAME surface as BUG-1's era-lock filter
>      (`phaseRunners.ts:2817`) and K3's `territoryOwned` predicate. Build it with E15
>      (era-event extensions) + BUG-1.** This is bigger than a one-line guard because it
>      needs the predicate field authored across the era-event content + the filter wired.
> 5. **★ The META-signal flips POSITIVE this batch — but it ARGUES FOR the same items.**
>    Unlike batch 10 (`dem1820`, the **2nd** GM-burnout death in the KB) and `new1772`
>    (the 1st, DH-36), **`arkzag` did NOT collapse** — it ran the full 1822→1840 arc.
>    The reason is decisive for prioritization: the GAs **heavily SCRIPTED the upkeep**
>    (Zagnut/Ark automated deaths/retirements, conventions, and delegate classes). So
>    the contrast with DH-36's two prior burnout deaths is **direct evidence that
>    automating the deterministic upkeep is what makes a long campaign survivable** —
>    i.e. the exact thing the build IS. **This STRENGTHENS (does not weaken) the
>    automation-reduces-upkeep argument behind the CPU handler suite (E9), the focus-Rep
>    House abstraction (#55), the scenario-boot pipeline (#115), and the death/retire
>    + delegate-class automation that #61/#85 + E10 deliver.** Cite it behind those
>    items; it is now a **3-thread signal** (2 burnout deaths + 1 survived-by-scripting).
> 6. **CORROBORATION (confidence only, no movement):** #115 scenario-boot (the
>    continuation-boot is re-confirmed — `arkzag` boots the `dem1820` mid-government save;
>    **this does NOT change #115's priority — it stays at the front of the subsystem
>    queue per §9.1.9**, and the continuation-boot is just another `BootSheet` instance);
>    #13/#111 convention + 8-stage general + presidential-promise buyouts + party-specific
>    thresholds (2/3 vs 50%+1) + VP-rubric (all multi-campaign confirmed — §29.11a, feeds
>    E10); #44 per-state EC (DE+SC by legislature in 1828); #52 SCOTUS docket (Amistad/
>    Barron/Antelope + min-age amendment + docket-runs-dry — feeds E25); #59 sectional
>    crisis (recurring Abolish-Slavery CRISIS amendments always fail — feeds E3b(b)); #11
>    crisis bills + named-CRISIS states (feeds E2/E6); #10 filibuster (Puritan ≥2 legis —
>    feeds E14); #1 multiplayer + CPU fallback + transferable factions; #9 bill packaging;
>    #25 cabinet rules (5-region); #54 investigations (same-half-term Controversial); #85
>    death/retire = 3%+2%; #40 per-(party,era) nicknames (RED fragments into ~6
>    micro-factions); #101 era-gated office creation (Minister to Japan). None move the
>    keystones.
>
> **★★★ Batch-10 changes to the plan (`dem1820`, the first 1820-START scenario — a
> short stalled campaign that is mostly CORROBORATION, but it PROMOTES the
> scenario-boot pipeline and SHARPENS two unsettled forks into decision-gates. NO
> new keystone; ONE promotion + two decision-gates + a handful of sized fixes):**
> 1. **★★ #115 scenario-boot is PROMOTED to the FRONT of the queue (a hard
>    prerequisite, NOT a new keystone — it folds into K4's `BootSheet` schema, but
>    its priority rises above everything except the determinism/registry
>    keystones).** The game-master frames it correctly: *"the build's scenario-boot
>    pipeline IS the missing setup spec"* and it is **the single most-requested
>    missing item** across the corpus (the forum has "**no rules for how to CREATE
>    a game**," `dem1820` POST 92 — Ted: *"rules… on how to create a playtest is
>    maybe our greatest need but to date nobody has stepped up to write one"*).
>    **Verified vs shipped (the reason this is foundational, not cosmetic): there is
>    NO shared boot abstraction today.** `startNewGame` (`GameContext.tsx:264`)
>    branches to `build1772Scenario` / `build1856Scenario`; each builder
>    (`scenario1856.ts:44-214`) **hand-assembles everything from scratch** — seats
>    senators/reps/governors in nested loops, wires cabinet/court, stamps a 47-field
>    `GameState` literal — and **uses raw `Math.random` at boot** (`scenario1856.ts:83,99,113`,
>    the K0 blast radius). A 1820/1788/1800/1948 scenario today means **copy-pasting
>    that ~200-line builder**, which is exactly how the undocumented house-rules
>    (strip-Command-at-boot, inaugural career-track seeding, Senate-class assignment,
>    vacant-seat fill) proliferate — none of them are in code. **The build target is
>    the canonical `scenarioBoot(BootSheet)` pipeline + a typed `BootSheet` schema
>    (mechanics §26.1 / §29.1) that 1772/1856/1820/1788/1948 all share** — so era
>    identity is **data**, not a hand-authored code path. **This stays inside K4
>    structurally** (the `BootSheet` schema was already K4's cross-cutting
>    constraint) but **rises in priority to "do it with the first new scenario, and
>    factor the shared pipeline THEN, not after the third copy-paste."** See §9.1.9
>    (new) for the exact factoring + the boot-sheet field list + the
>    undocumented-setup-rules the pipeline must encode. **This is the headline of
>    batch 10.**
> 2. **★ The TWO unsettled forks are DECISION-GATED — flag them NOT-ready-to-build.**
>    `dem1820` surfaced both as live multi-party design arguments that the forum did
>    **not** settle; each needs a **human design decision before any build**, so the
>    roadmap-planner must place them behind a decision gate, not in the build queue:
>    - **Player-SCOTUS (#52, the fork).** `dem1820` (POST 420-443) resolved the
>      forum's *own* working rule as **votes-by-ideology-chart (ties roll a die),
>      player gets delay/dismiss only** (dismiss only Gov-Action cases; must hear
>      ≥1) — but the designer (`vcczar`) wants it **trait-gated** (only
>      Integrity/Disharmonious/Predictable justices auto-vote; Controversial/Pliable/
>      Lackey let a Manipulative leader's player decide), and two players want a
>      **fully player-controlled court**. **Three live models, no decision.**
>      Verified shipped: the court is a `chance(0.5)` coin-flip + ±0.1 partyPref
>      (`phaseRunners.ts:3397`) + age-75 retire (`:3648`) — **no docket, no case
>      data, no player surface AT ALL** (debt #18). So this is not "pick a fork on
>      existing code" — it is "design the fork, THEN build the from-scratch docket."
>      The docket data structure lands in `src/data/scotusCases<Era>.ts` + a
>      `GameState.scotusDocket` ledger regardless of which fork wins; the fork only
>      changes the *resolution* + the player-action surface (delay/dismiss is one
>      ActionRegistry row; trait-gated player-vote is a different one). **Gate:
>      human picks CPU-by-ideology vs trait-gated vs player-controlled → THEN the
>      SCOTUS docket epic (Phase-2 #25) builds it.**
>    - **Meter→enthusiasm→election (#18/#51, the fork).** `dem1820` (POST 569/575/618)
>      published a concrete processing rule — **non-enthusiasm meters shift the
>      per-(ideology) enthusiasm boxes; the boxes then apply to EVERY state UNLESS a
>      state penalizes that ideology; hard ±3 cap on ideology + party-pref bonuses**
>      — but it is **explicitly a GA-vs-designer fork**: Ted's "every state unless
>      penalized" vs V's "ideology-leaning states take the hit" vs Matt's "primaries
>      only." **Verified shipped: `calcStateVote` (`phaseRunners.ts:3709-3711`) reads
>      enthusiasm raw (`enthusiasm[ideology][party] * 2`), applies it UNIFORMLY to
>      every state, with NO ±3 cap and NO per-state ideology penalty** — so the ±3
>      cap is a missing clamp and the state-scope decision is the unbuilt fork. The
>      ±3 cap itself is XS and **already queued** (the meter-model ±3-clamp, Phase-1
>      #6 / #80) — but **WHERE the cap binds and WHETHER enthusiasm is state-scoped
>      depend on which fork wins.** **Gate: human picks the state-scope model →
>      THEN the meter-model/election-math epic binds the cap + the per-state penalty.**
> 3. **★ Sized, corroborated quick-fixes (all fold into existing rows; no
>    re-sequence):**
>    - **DH-53 (bill EV-effect sign) — XS-to-S, but NOT a sign-flip in existing
>      code.** Verified: `EraEventResponseEffect` / `Legislation.effects`
>      (`types.ts:1448` / `:1515`) has **NO per-state EV field**, and `applyEffect`
>      (`phaseRunners.ts:3209`) **cannot mutate `State.electoralVotes`**. The
>      "until-passed −1 EV vs when-passed +1 EV" bug is about a per-bill EV-effect
>      mechanic that **does not exist yet** — so the fix is **author the structured
>      per-bill effect tables with sign-checked "when-passed +N" semantics** (the
>      SAME surface as DH-14 era-aware bill impacts + DH-48 structured era-event
>      `evDelta`). Lands in the bill-catalog / era-content work (Phase-1 #20 +
>      K4), not as a standalone patch.
>    - **DH-24 (Senate-class boot validator) — XS, now 2-thread.** Verified: the
>      boot assigns classes naively (`scenario1856.ts:86`, `classId =
>      senators.length + 1` → only ever 1/2, never 3) and the election rotation
>      **hard-codes the 1856 base year** (`phaseRunners.ts:3885`,
>      `senateClass = ((year - 1856) / 2) % 3 + 1`) — both **wrong for an 1820
>      start** (the `dem1820` GA ran the 1822 midterm as the wrong class and had to
>      resubmit every appointment). Fix = a Senate-class assigner+verifier that runs
>      **in the scenario-boot pipeline** (#115) and a start-year-relative rotation
>      (replace the literal `1856`). Folds into the `BootSheet` boot-pipeline hooks.
>    - **Focus-Rep House (EV−2)/5 (#55) — M, DESIGNED-not-shipped.** Verified: the
>      House is modeled as **full (EV−2) reps per state** (`scenario1856.ts:93`,
>      `electoralVotes - 2`; re-elected per-seat at `phaseRunners.ts:3913-3939`) —
>      the abstracted **(EV−2)/5 focus-Rep model (POST 643) is NOT in code.** This
>      is the scaling-wall-(b) surface (#55 / A9): collapsing per-seat reps to
>      focus-Reps is the change that makes the "congressional election from hell"
>      (10 forum pages / 8 real days in `dem1820`) tractable. Folds into
>      **scaling-wall-(b) House-slate persistence (Phase-1 #7)** + the census/
>      apportionment epic (#34/#55). The seat-specific-incumbency-except-census-year
>      rule (POST 682/696) is a balance dial on top, not a separate build.
>    - **Statehood→sectional-crisis coupling (#59) — S additive, DESIGNED-not-shipped.**
>      Verified: `State.isSlaveState` (`types.ts:1329`) exists + is populated but is
>      **only READ in `StatesPage.tsx`** (display); `admitState` (`territories.ts:8`)
>      does **no free/slave balance check**. The `dem1820` "Era of Good Feelings
>      ends" crisis (14 slave / 12 free → DomStab −2 + Party-Pref +2 + faction
>      penalties, POST 521) fired from a 1820 start — **earliest observation of
>      #59**, but it is a GM hand-computation. The build is a **cheap additive
>      derived-count crisis** hooked at `admitState` (and at era-event resolution
>      that flips a flag): same code area as the 1856-arc sectional crisis (#59) —
>      **note it is NOT 1856-only; it must fire from 1820/Nationalism-era starts
>      too.** Folds into the Civil-War/Reconstruction epic's cheap-additive front
>      (Phase-1 #3b, secession #58 + sectional #59).
>    - **Appointment-order ladder + replacement-gains timing — XS each, author-into
>      the boot/appointment rules.** `dem1820` settled two rules mid-thread the
>      build should adopt: the **Senate-appointment-eligibility ladder** (POST 859:
>      your-party-not-on-CT → your-party-on-CT → opp-party-not-on-CT → opp-party-on-CT
>      → generate a 1-skill pol; can't leave a full-term Senate seat vacant; can't
>      pull a CT pol if any non-CT same-party pol is eligible; appointees 30+) — a
>      concrete spec for the vacancy-fill order the boot pipeline + the cabinet/
>      Senate phases need; and **replacement-gains timing** (POST 291: a new
>      replacement — incl. faction leaders — gets **no stat gains until they hold
>      the post through the next appointment/election phase, EXCEPT military
>      positions which are eligible on appointment**) — a one-rule guard on the
>      ability-grant path (`ABILITY_EARN_RULES` area). Both are XS rules-table
>      additions; the eligibility ladder pairs with DH-25's career-track-eligibility
>      decision (still PARKING-LOT — the "CT pols can't run/be appointed" vs "CT
>      pulled last" contradiction is re-corroborated here, POST 850/859).
> 4. **★ DH-36 (2nd GA-burnout death in the KB) — the META-signal, reinforced.**
>    `dem1820` is the **second campaign in the corpus killed by GM burnout** (after
>    `new1772`): Ted quit (POST 900) — *"these used to be a lot of fun to run and
>    now it just feels argumentative"* — under the compounding weight of
>    undocumented-rule friction + relentless manual bookkeeping (10-page elections,
>    constant spreadsheet repair, a demographic-corruption data bug that rendered
>    every pol Black/LGBT from a column mismatch). His tell: *"I'm currently helping
>    run an all-CPU game for a reason."* **This is NOT a row to schedule — it is the
>    prioritization argument for the items that REDUCE manual upkeep:** the
>    scenario-boot pipeline (#115, eliminates the boot/data-corruption class), the
>    focus-Rep House abstraction (#55, kills the election tedium), the CPU handler
>    suite (K5/E9, owns the bookkeeping a human GM can't sustain), and the
>    disclosed-deterministic-ruleset theme (the engine must SHIP the rules the
>    forum improvises — that is the whole point of #115). Cite it behind those
>    items; the **automation-reduces-upkeep argument is now 2-thread.**
> 5. **CORROBORATION (no movement, confidence only):** #92 era-bands (a **THIRD
>    start year, 1820** — "Era of Democracy (1820-1840)" / "Manifest Destiny
>    (1840-1856)" printed, POST 946 — joining 1772/1800/1948); #1 multiplayer +
>    faction-handover + CPU fallback (2 mid-thread handovers); #76/#108
>    enthusiasm-gated party-flips (RED→BLUE at boot, POST 72); #24 card-distribution
>    order-of-operations (POST 149-154); #9 bill packaging; #20 gov-action library;
>    #25b era-gated 4-power diplomacy roster (UK/France/Spain/Russia); #101
>    office-by-bill (Postmaster→cabinet — note this also reconfirms divergence #15:
>    `cabinetSeatsForYear` auto-adds Postmaster at 1829 regardless, the WRONG model);
>    #61 legislatable succession order (Speaker→3rd); #44 popular-vote-surge event.
>    None move the keystones.
>
> **★★ Batch-9 changes to the plan (`nuke`, the Cold-War/modern half — a big
> NEW-ERA gap-fill, but mostly CONFIDENCE + NEGATIVE-SCOPE + small placements;
> NO re-sequence, NO new keystone):**
> 1. **★ The K3/K4 era model gains a TWO-LEVEL refinement + a STRUCTURED-era-event-
>    data requirement.** The band model is now confirmed across a THIRD start year
>    (1948), and `nuke` (§27.1) **splits it into two separately-fired mechanics that
>    MUST both be built**: (a) point-banked **Historical Eras** (content-bands with
>    `advanceWhen` + per-era `{bills, eraEvents, draftees, biasTable}` + **rule-deltas**
>    — the Era-of-Terror cabinet rework proves bands carry rule changes, not just
>    content); and (b) **within-era decade/census boundaries** = a SEPARATE
>    schedule-fired mechanic doing **bulk EV reallocation + state-bias re-lean +
>    content rotation** (the per-decade `AMPU Census`, distinct from #68's per-era
>    bias swap). **Do NOT collapse the two.** AND: **era-event data needs STRUCTURED
>    `evDelta`/census fields** (DH-48) — the Neocon census events were LOST in the
>    spreadsheet because they were free-text flavor; the typed field + per-era
>    completeness validation is a real K4 requirement. **Logged correction: "Neocons"
>    is a FACTION REBRAND, NOT an era band** — do not model it as a band. No new
>    keystone — refines K3/K4. See §9.1.5 (updated).
> 2. **★ NEGATIVE SCOPE — the Cold War is NOT a subsystem to build (the single most
>    important scope-control finding this batch).** Despite the "Nuclear Age" title
>    there is NO purpose-built nuclear/MAD/NATO/space-race/military-branch engine in
>    the design (§28.2). Verified shipped: only `src/engine/revolutionaryWar.ts`
>    exists — no generic war engine, no Cold-War engine. The "Cold War" is the
>    **generic war engine (#6) RELABELED + EraEvos/A-B events + the diplomacy
>    subsystem (#107)**. **The roadmap must NOT scope a Cold-War subsystem.** The
>    REAL build items underneath are: (i) the **generic war engine** (ONE engine, all
>    eras, ideally army/navy/air branches + a **resolution/peace path** — DH-47:
>    wars NEVER resolve today, Korea ran ~2 decades); and (ii) the **diplomacy
>    subsystem** (8 relation meters + ambassador actions, #107). Cold-War "content"
>    = data (events/bills/lobby-cards/a couple of legislative ×2 multipliers).
> 3. **★ Mutable cabinet extends to CREATE-AND-ABOLISH (divergence #15 / E16).**
>    `cabinetSeatsForYear` (verified still year-keyed at `types.ts:1196`) must become
>    fully data-driven. Confirmed END-TO-END now: founding (Bank/Navy/AG by bill) →
>    modern (DOE/DHS created; **Postmaster General ABOLISHED**; HEW split). The
>    batch-6 spec only added a CREATE path — **add the ABOLISH path** too
>    (`Legislation.abolishesCabinetSeat?`). Folds into E16; no re-sequence.
> 4. **★ CPU-faction AI is LOAD-BEARING — elevate the handler suite to a first-class
>    system (#114 / §28.12).** The designer's strongest corpus statement: the **APP =
>    1-human-vs-9-CPU** (multiplayer "goes off the rails"; the points system is for
>    CPUs, not humans). The forum game is team-MP with CPU backfill; **the app is a
>    solo adaptation of a multiplayer game** — so the ENTIRE multiplayer apparatus
>    (party-leader elections, conversions, kingmaker pairings, committee assignment,
>    cross-faction endorsements, forced 3rd-party runs) must be CPU-AI-driven. This
>    **validates solo-first sequencing AND elevates K5 + the handler suite (E9) from
>    "force-multiplier" toward "the load-bearing system that makes the product
>    playable solo."** No re-sequence (K5 stays after K0+K2), but its *priority*
>    rises — see §9.1.3.
> 5. **★ Senate pass-threshold — RESOLVED IN CODE: simple majority.** The digest
>    flagged a SOURCE conflict (§28.5/§28.12: ~60%-to-pass vs simple-majority-pass-
>    with-60%-cloture). **The shipped code settles the engine side:**
>    `runPhase_2_6_3_Floor` (`phaseRunners.ts:3562`) passes a bill iff `house.yea >
>    house.nay && senate.yea > senate.nay` — **simple majority in both chambers, NO
>    cloture/supermajority step** (the only supermajority anywhere is the
>    Articles-of-Confederation 2/3-of-states in the independence-era CC path,
>    `continentalCongress.ts:224` — a different mechanism). **Code = simple majority;
>    the DESIGN question (should the Senate require 60% / a cloture step?) stays OPEN
>    for the human** — when the filibuster/cloture epic lands, the human decides and
>    the constant goes there. See debt #27.
> 6. **★ Parking-lot additions (batch 9):** **DH-49 — a POPULATION MODEL + House cap**
>    (the Wyoming Rule + per-decade census EV reallocation are un-implementable
>    without one; none exists — `State.electoralVotes` is a static seed; author
>    before build OR size into the census epic #34/#55). **DH-54 — impeachment /
>    VP-vacancy fill was NEVER in the rules doc** (author the impeachment + succession
>    ruleset before the institutional layer #112/#61; corroborates DH-33). **DH-56**
>    conflicting career-track rule-sets (with DH-25). The other batch-9 DHs classify
>    into existing epics: DH-45/46/47 → diplomacy + generic-war (#6/#107); DH-48 →
>    structured era-event data (K4); DH-50/53 → era-event scheduling + bill-catalog;
>    DH-52 → election-math balance; DH-51 → modern dataset balance (`scripts/`);
>    DH-55 → 3rd-party trigger #48; DH-57 → convention epic / handler #5.
> 7. **★ NEGATIVE RESULT confirmed (carried from batch 8) — no "future" era to
>    scope.** `nuke` spans only Nuclear Age (1948–2000) → Era of Terror (2000–~2012);
>    it stalls at ~2005 and seams into the already-documented `modern` (2004–2020)
>    thread. **The KB now spans a CONTINUOUS 1772→2020 timeline** (this 1948 thread
>    is the predecessor of the `modern` 2004-2020 thread, joined at the 2004 election).
>    No post-modern era is documented anywhere. K4 still adds exactly `gilded` +
>    `progressive`.
>
> **★ Batch-8 changes to the plan (the lead — mostly CONFIDENCE + small
> placements; NO re-sequence, NO new keystone):**
> 1. **★ The era-model reframe (K3/K4 / divergence #18) is now MULTI-SAVE PROVEN
>    — confidence, not structure.** Two independent saves emit the identical
>    era-band sequence at identical in-game dates: `tea1772` (1772-start solo
>    all-CPU) and `rep1800` (1800-start multiplayer), 28 in-game years apart
>    (game-mechanics §27.1/§27.2; `tea1772` POST 21/62/91/130/153). The bands are
>    deterministic game-state content-gates, not GM flavor. **The K3/K4 spec was
>    already condition-driven from batch 7 — nothing changes structurally.** This
>    raises the era keystones to the **highest-confidence large bet in the
>    roadmap**; treat the content-band model as settled. See §9.1.5.
> 2. **★ The dynamic cabinet-seat refactor (divergence #15 / E16) is reinforced —
>    `cabinetSeatsForYear` is now confirmed the WRONG model END-TO-END.** Verified
>    still year-keyed at `types.ts:1196` (its docstring `:1190-1195` hard-codes the
>    year→seat schedule). Batch 8 shows the offices-by-law pattern spans the WHOLE
>    timeline: founding (`new1772` — SCOTUS/Bank/Navy/AG/academies built by bills,
>    §24.6) → modern (`pop` — Climate-bill creates a cabinet seat). So the seat-
>    list-as-mutable-state refactor is **foundational to the offices-as-data theme,
>    not a modern-only nicety.** No new work — the existing E16 item's justification
>    is strengthened to founding+modern.
> 3. **★ DH-41 — a genuine new author-before-build PARKING-LOT item.** The general
>    SCOTUS-ruling → downstream-statute cascade (a ruling that *contradicts a law on
>    the books* auto-voiding it) is **UNBUILT and was explicitly DEFERRED by
>    `vcczar`** (`tea1772` POST 124-126, the Prigg→Fugitive-Slave-Act case). Today a
>    contradicting ruling leaves the law operative. Distinct from the *built*
>    strike-a-single-law + overturn-an-amendment-on-review. Author the cascade
>    policy before building it; lands in the SCOTUS docket epic once decided.
> 4. **DH-36 (★ GM-burnout abandoned a 12-turn game) is the META-justification for
>    the whole build, not a row.** `new1772` POST 3607: the first multiplayer 1772
>    campaign collapsed under manual bookkeeping. The strongest single "why build
>    AMPU" datum — the computer must own the deterministic upkeep. Cite it behind
>    the scaling walls (#19/#20) + the CPU handler suite; don't queue it.
> 5. **Small placements (all fold into existing epics):** #100 SCOTUS-overturns-an-
>    amendment + threshold-amendable → amendments item (#39, Phase-1 #5) + SCOTUS
>    docket (E25); #102 dual era-scoring (per-era + cumulative — the **WIN
>    CONDITION** is dual) → K3/K4 point-banking (#68 is the scoreboard); #103
>    pres-vote modifier stack + era-issue list → election-math/bill-scoring
>    (Phase-1 #20); #104 lone-ideology convention exploit → convention CPU handler
>    guard (E9 9e); #105 stat-collapse→forced-resignation → near succession (#61,
>    Phase-1 #10b). And the rest of the holes: DH-38 → federalism/founding era
>    (E1); DH-39 → convention machinery (multiplayer); DH-40 → bill-packaging/
>    SCOTUS-establish bug-fix (XS-S, can STALL the game); DH-42 → election-math
>    balance; DH-43 → Vermont dataset fix (XS); DH-44 → 12A toggle (#93); DH-37 →
>    multiplayer/parking-lot (pol-to-pol trading).
> 6. **★ NEGATIVE RESULT — do NOT scope an "Era of the Future."** No thread in the
>    corpus reaches a post-Gilded/post-modern era (`tea1772` "…to future" stalls at
>    1874; `hd`/`drums`/`pop` top out at Gilded/Progressive/Populism). The future
>    era is undocumented everywhere — there is no build target. K4 adds exactly
>    `gilded` + `progressive`.
>
> **Batch-6 changes to the plan (the lead — three concrete moves):**
> 1. **APOCALYPSE meter-driven endgame is Phase-1, sized M.** Verified shipped:
>    only event-driven endgame exists (`EraEvent.triggersGameEnd` →
>    `phaseRunners.ts:2871` → `game.gameEnded`); no meter-watcher, no
>    countdown clock, no `endgameClocks` array. The forum adds a NEW model:
>    bottom-tier band entry → 10-game-year countdown → mandatory game-end
>    (recovery clears it). **Phase-1, NOT Phase-2.** Rationale: the `planet`
>    meter ships today and ticks every era; the model is **meter-agnostic**
>    (the Populism Planet Health clock is one configured row per era, and
>    analogous bottom-tier clocks may apply to other meters/eras). **Folds in
>    with the meter-model generalization** (Phase-1 #6 ±3-clamp + crisis/cascade)
>    — same code area, same tick site (`runPhase_2_5_1_Lingering`), shared
>    `game.gameEnded` sink with the event-driven path. **Size: M.**
>    Architecturally significant — it's a new endgame surface, not a balance
>    dial — but cheap because the meter and the sink both ship.
> 2. **K4 `BootSheet` schema is THE cross-cutting build constraint of K4.**
>    Three documented mid-government boots — 1788 (designed) / 1856 (shipped) /
>    2012 (designed in `pop`) — share ONE shape: pre-built faction roster
>    (5 Blue + 5 Red) + per-faction archetype politicians + era-tuned
>    ideology/interest/lobby decks + sitting government keyed to start year +
>    **state roster keyed to `{era, startYear}`, NOT era alone** (divergence
>    #17 — same `modern` enum has the 50+DC fresh-modern roster AND the
>    53-state Wyoming-Rule continuation roster) + EXPLICITLY EMPTY at boot
>    (no faction leaders, no career-track pols, no inherited PV/legacy/
>    Kingmaker pairs). **Build the schema ONCE in K4**, instantiate per era.
>    **Era identity is data configuration, not code paths** — R1's "Trumpism"
>    deck is the seed configuration of one faction, not a "Trumpism mechanic."
>    Also: **Senate-class verifier (DH-24)** + **`TRAIT_CONFLICTS` validator
>    (DH-27)** run at boot pipeline as guardrails on seed data.
> 3. **K2 + cabinet + amendment refactors are the divergence-#15/#16 calls.**
>    Two refactors fold cleanly into already-planned work:
>    - **K2 gains `requires?: AmendmentPredicate`** on the `GameAction<Ctx>`
>      shape from day one (divergence #16) — one field + one filter step in
>      the picker. **Cheap if early, expensive if retrofit** across 6 libraries.
>      The canonical instance ("Send VP to Shore Up Support" requires 12th
>      Amendment) ships with the general-election library. Same `requires:`
>      mechanism also gates bill catalog entries (income-tax category) and
>      gov action entries — predicate field belongs at the registry-row
>      level, not the library level.
>    - **E16 cabinet refactor gains the dynamic seat list** (divergence #15).
>      Verified: `cabinetSeatsForYear(year)` (`types.ts:1196`) is **pure
>      derived with NO mutable state**; `phaseRunners.ts:2162` recomputes it
>      each turn. Refactor: shipped function becomes the **boot seed only**;
>      runners read `GameState.cabinetSeats: SeatSpec[]`; bill-sign handler
>      appends `Legislation.createsCabinetSeat?: SeatSpec`. **Folds into the
>      cabinet retention refactor** — same code area, marginal additional
>      cost.
> 4. **CPU handler 9b legislation now consumes the conditional-vote-rules
>    primitive** (`pop` POST 1111). Iron-Fist controllers publish declarative
>    `Predicate → {AYE/NAY}` policies stored at `Faction.factionLeader.
>    compelledVoteRule?`. Handler #2 (legislation) consults this BEFORE the
>    §25.6 heuristic; handler #4 (cabinet) consumes the same primitive for
>    auto-AYE-own-picks AND SCOTUS within-1-step auto-AYE (§26.6.1). Promotes
>    a §25.9 sub-effect to a **first-class CPU primitive** — subsumes per-vote
>    Iron-Fist compulsion + auto-AYE under one shape. Folds into E17 (Iron-Fist
>    split) + CPU handler suite (#2, #4).
> 5. **DH-25 (career-track bootstrap unresolved) is a PARKING LOT BLOCKER on
>    any modern scenario shipping.** The 3-yr-stale design discussion has no
>    canonical rule for which existing pols start on career tracks at a
>    mid-game boot. Author the rule (Zagnut's "1996+, 1/track" houserule is
>    on the table) before `scenario1948` or `scenario2012` ships. DH-24 / DH-27
>    are XS validators that run at the boot pipeline.
>
> **Batch-5 changes to the plan (carried, still the lead for CPU work):**
> 1. **K5 — a `CpuController` scaffold — is a NEW keystone.** The shipped engine
>    has **no agent-decision pass at all** (only three thin stubs:
>    `pickBestForFaction` `phaseRunners.ts:33`, `pickAIResponse` `eraGraph.ts:88`,
>    `autoFillCPUVotes` `constitutionalConvention.ts:81`). The §25 spec doesn't
>    slot into any existing place — it needs its own home. K5 lives **after K0
>    (seed) and after K2 (ActionRegistry)** because handlers route action picks
>    through K2; but K5 is **not on the critical path for scenarios** —
>    federalism + the 1856-arc can ship with stubbed handlers and upgrade
>    together. **K5 unlocks ~15 lightweight per-subsystem handler PRs that
>    parallelize.** See §6.6.1 + §9.1.3 + §9.2.
> 2. **DH-23 (cabinet 36% pass-rate bug) is XS-S, not the M many digests imply.**
>    Verified: **the engine ships NO Senate confirmation step at all** —
>    `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step scored
>    pick. So the fix is **build the confirmation in the right shape from day
>    one** (default-AYE baseline + Iron-Fist Maj-Leader auto-AYE-own-picks +
>    lobby-maximizer Admin-weighting) — not "patch a broken system." Lands as
>    CPU handler #4 (§6.6.1), after K5 + the cabinet-retention refactor (#17).
> 3. **DH-8 (CPU AI under-specified) is RESOLVED for explicit heuristics, REMAINS
>    open for architectural gaps.** The §25 master section (15 subsections) is
>    the spec for candidate selection, IRV bloc-vote, convention CPU, cabinet,
>    legislation, A/B/C events, conversion, Iron-Fist, faction-leader removal,
>    kingmaker rules, primary CPU, faction rename, Justice drift. **DH-20
>    reciprocity / DH-21 meter-guarding / DH-22 scandal sequencing remain
>    architectural** — they need K5's persistent state (`cpuCommitments`,
>    `recentScandalIds`) + the meter-impact aggregator, not single-line rule
>    additions.
>
> **What is now READY to build (no design task remaining) vs. what still needs
> design:**
> - **READY (heuristics authored):** §25.1 candidate selection · §25.2 VP rubric
>   · §25.3 IRV leadership · §25.4 convention CPU (incl. ballot-10 compromise +
>   ballot-25 dark horse) · §25.5 cabinet confirmation (default-AYE baseline +
>   Iron-Fist auto-AYE) · §25.6 NAY/AYE/NAY legislation heuristic · §25.7 A/B/C
>   cabinet vote · §25.8 conversion %-table · §25.10 faction-leader 4-condition
>   removal · §25.11 kingmaker endorsement rules · §25.12 primary CPU · §25.13
>   faction-rename triggers · §25.14 Justice 10-yr drift table · #82 veto override
>   2/3 both chambers · #83 midterm uses full meter+enthusiasm · #85 5%/half-term
>   retire-death rate · #79 25/10/5 Justice drift · #80 ±3 swing cap (already
>   queued).
> - **NEEDS DESIGN (parking lot until rules authored):** §25.9 Iron-Fist split
>   (the 6 office-keyed traits + cascade rules) · #84 contingent-election rules
>   (no contingent path exists; GM invented 5 rulesets mid-thread — author before
>   build, divergence #10) · DH-1 filibustered-MUST-pass remedy · DH-12
>   white-peace rules · DH-13 faithless-elector trigger cap · DH-14 era-aware
>   bill ideology impacts · DH-15 small/large-state action multiplier · DH-17
>   convention auto-drop-out + interballot cap.
>
> **Carried from batch 4 (still load-bearing):** BUG-0 quick-win, per-era point
> banking (folds into K3/K4), Civil-War / Reconstruction epic placement (after
> generic war), #54 investigation committees READY, DH-8 must-own for convention
> epic.
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

**Seven foundation pieces** unblock everything else. They are cheap relative to
their leverage, and each later epic builds on at least one of them. Batch 2 added
K1.5 (the ideology→color palette); **batch 5 adds K5 — the `CpuController`
scaffold** — because the §25 spec needs a home and the shipped engine has none.

| Order | Foundation | Size | Why first |
|---|---|---|---|
| **K0** | **Seed the RNG** (replace `Math.random` in `rng.ts:5` with mulberry32/xoshiro; store `seed`+state on `GameState`; migrate the **14** raw `Math.random` engine calls — debt #1–#3) | **S–M** | Determinism is the **prerequisite for multiplayer** (clients/turns must agree on roll outcomes), for replay/test harnesses, and for **every CPU handler (K5)** — the spec'd tie-breaks are deterministic. Mechanical but touches many files. |
| **K1** | **`State.policies` + `State.electionMethod` data shapes** (`State`, `types.ts:1318`; repair() backfill `{}` / `'popular'`) | **XS** | `policies` is load-bearing for gov actions, era events, bill effects, scoring. `electionMethod` is the precondition for the per-state EC method (divergence #5). Bundle them. |
| **K1.5** | **Ideology→color palette** (`IDEOLOGY_COLORS: Record<Ideology, string>` in `src/theme/`) — *presentation-track* foundation | **XS** | A tiny **cross-cutting** asset that **many presentation items depend on** (roster, congress, maps, score sheets, committee views — A2/A3/A7). Independent of the engine track. |
| **K2** | **The `ActionRegistry<Ctx>` type** (§6.6) — one shape for governor / exec / convention / diplomacy / primary / general actions, in `src/engine/actionRegistry.ts`. **Batch 6 update: the `GameAction<Ctx>` shape gains a `requires?: AmendmentPredicate` field from day one** (divergence #16) — the picker filter step consults `game.amendments.passed`. Subsumes amendment-gating across all 6 libraries with one extra field; expensive to retrofit later. | **S** | Confirmed across 4 eras; `modern` adds a 5th + 6th library. ~6× leverage. **K2 is a hard prerequisite for K5** — most CPU handlers pick from a library, so they need a uniform registry shape to call into. The `requires?: AmendmentPredicate` field also enables capability-gating (12th Amendment unlocks "Send VP to Shore Up Support"; income-tax bills unlock after a 16A-equivalent). **★ Batch-9 confidence: the modern turn loop is ~25 sub-phases deep** (§28.10) — far deeper than the shipped draft/election/legislation/era-events loop — reconfirming that the phase system must be **data-driven + deep** and that every sub-phase (governor actions, diplomacy, exec actions, primary/general, debate-sway, packaging) routes through a registry, not a bespoke switch. Raises K2's leverage further. |
| **K3** | **`advanceEra(snap)` keystone — CONDITION-DRIVEN (batch 7) — + era-content registry + content-band gating + per-era point BANKING** (lift the 5 `ERA_GRAPH_1772` spots in `eraGraph.ts` to `ERA_GRAPHS: Record<Era, GraphNode[]>`; generalize `constitutionalConvention.ts:198`'s hard-coded `currentEra = 'federalism'` to a callable transition with the **~12-step boot pipeline**: end-of-era award payout → **bank the era's score + zero the running total** (#68) → faction trades (CPU auto-accept) → **full 2.1.x→2.3.1 re-run** → card-pool swap + per-era card-count rescale → nation renames → draft-profile shift → party-formation. **Batch-7 reframe (the key change vs. the prior K3 spec): the era boundary is GAME-STATE / METER / TERRITORY-driven, evaluated PER HALF-TERM — NOT a year boundary.** `advanceEra` takes no `target` — it watches an `era.advanceWhen` condition (the early-republic bands advance on game-state + territory ownership; the Constitution-ratifies trigger at `:198` becomes the first such condition, not a hard-coded line). **And: gate all content (bills / era-events / draftees / bias-table) on `game.eraBand` + TERRITORY OWNERSHIP, not literal year** — un-owned-land content is invalid (Louisiana-born pols un-playable until LA is owned). Keep the `phases.ts` year predicates for phase **cadence** only.) | **M** | Live transitions corroborated in `fed`/`modern`/`hd`; batch 7 (`rep1800`) confirms the content-band model + the explicit boundary formula (§27.1/§27.2). The reframe **RECONCILES #68 point-banking + §26 boot model + §27.1** into one era system. Per-era banks sum toward the cross-era win total. **Batch-8 placement: the per-era point-banking is the engine behind DUAL era-scoring (#102) — at each boundary the game declares BOTH a per-era winner AND a running cumulative "winner so far" (the banked total); the WIN CONDITION is dual (per-era + cumulative). No structural change — the banking step IS the scoreboard.** Debt #5 and #9 dissolve here. **See §9.1.5 for exactly what changed vs. the prior K3 spec.** |
| **K4** | **Era enum widening + first new scenario + the `BootSheet` schema + the per-era CONTENT-BAND registry** (add `gilded`/`progressive` to `Era` (`types.ts:1337`); fill every `Record<Era, …>` rule table the TS exhaustiveness check flags — incl. the **era-keyed draft rookie-grant** `{traits, altStates}` (#69, 3/3 in 1856-arc) and **era-keyed amendment ratifier+threshold** (#64) and the **per-era `doubleScoringIssues: IssueTag[]`** table (#87) and the **per-era `proceduralPolGen.startYear`** field (#90); add the scenario builder). **Batch 6: K4 introduces the `BootSheet<{era, startYear, factions, sittingGovernment, stateRoster, …}>` schema** (divergence #17, §26.1) — the cross-cutting constraint for ALL mid-government boots (1788 / 1856 / 2012 / **optionally 1800**, §9.6). The registry keys on `{era, startYear}` (or `scenarioId`) for the initial state roster — same `modern` enum has BOTH the 50+DC fresh-boot roster AND the 53-state Wyoming-Rule continuation roster. Includes **EXPLICITLY EMPTY baselines** (no faction leaders, no career-track pols, no inherited PV/legacy/Kingmaker pairs) and the **generic-Major-candidate fallback** for the first primary (§26.1). **Batch 7: the era-content registry is the home of the CONTENT-BAND model** — each era is a `{bills, eraEvents, draftees, biasTable, advanceWhen}` record (§27.1); the **early-republic sub-bands (Republicanism / Democracy / Manifest-Destiny) are content-band markers on a game-state gate, NOT new enum values** unless rule tables genuinely diverge (open Q; my call: markers first). The **per-era state-bias table swaps in wholesale at the boundary** (#68 step 6). Add the **Senate-class verifier (DH-24)** + the **`TRAIT_CONFLICTS` validator (DH-27)** as boot-pipeline hooks. | **M–L** | The TS `satisfies Record<Era, …>` is the safety net — missing rows are compile errors. **See §9.1.1 for which scenario goes first (federalism).** **The `BootSheet` schema makes era identity DATA, not code paths** — R1's "Trumpism" deck is one row in 2012's boot sheet, not a "Trumpism mechanic." **Batch 7: the content-band registry makes era *content* data too** — the `advanceWhen` condition + the territory-gate live here. **★ Batch-8 NEGATIVE RESULT — do NOT add a "future" era value.** No thread in the corpus reaches a post-Gilded/post-modern era; `tea1772` ("…to future") stalls at 1874 (mid-Gilded) with no game-over, and `hd`/`drums`/`pop` top out in Gilded/Progressive/Populism. The "Era of the Future" is **undocumented everywhere — there is no build target for it.** K4 adds exactly `gilded` + `progressive`; do not scope a future era. |
| **K5** | **`CpuController` scaffold** — `src/engine/cpu/{types.ts, controller.ts, tiebreaks.ts}` + the two `repair()` backfills (`GameState.cpuCommitments?`, `GameState.recentScandalIds?`) + a deterministic-under-seed unit test. **No handler code in this PR** — just the orchestrator + the persistent state + the tie-break utility module. **(NEW, batch 5.)** | **S** | The shipped engine has **no agent-decision pass at all** (debt #23); the §25 spec'd heuristics have no home. K5 is **~120 lines that unlock ~15 follow-on handler PRs.** Each handler is then a lightweight, parallelizable PR (§6.6.1 handler-order table). **Not on the critical path for scenarios** — federalism + the 1856-arc can ship with stubbed handlers. The scaffold makes **DH-8 + DH-20 + DH-21 + DH-22 buildable** (today they have nowhere to live). |

**The dependency chain**: K0 → (K1 ‖ K2 ‖ K3) → K4 → K5 → per-system handlers.
K1.5 is **off the critical path entirely** (presentation track). After K0,
K1+K2+K3 are independent and parallelizable. K4 depends on K3. **K5 depends on
K0 (deterministic RNG) and K2 (handlers call into the registry).**

**K5 ordering nuance — when can it slip?** K5 is a *force-multiplier*, not a
*gate*. The federalism epic, the 1856-arc Civil-War / Reconstruction epic, and
the generic-war epic **can ship before K5** by accepting today's CPU stubs.
The K5 scaffold's value is **what it makes possible afterward** — the 15
handler PRs that resolve DH-8 + the architectural CPU gaps. So a fair planner
question is: *is K5 ahead of or behind those scenario epics?* My call: **K5
ships in parallel with the federalism epic**, lands shortly after, and the
1856-arc epic is the first scenario to get a full handler suite (because the
shipped 1856 scenario already exists, and the Civil-War epic is its
completion — wiring CPU handlers as you go vs. retro-fitting them later).

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

#### 9.1.2 Where the Civil-War / Reconstruction engine lands (batch 4) — and why early-ish

The `hd` thread surfaces a sizeable new subsystem (the two-theater Civil-War combat
engine #56 + Reconstruction readmission #57 + secession gating #58 + the
sectional-balance crisis #59 + Canada conquest #60). The sequencing question the
roadmap-planner asked: **does the Civil-War payoff build relatively early, or wait
behind the keystones / federalism / the deep-modern tail?** My call: **early-ish on
the subsystem track — after generic war (#6) + ActionRegistry (K2), but it does NOT
queue behind federalism or the modern epic.** The reasoning:

- **It ENHANCES an already-shipped scenario, not a new one.** This is the decisive
  difference from the federalism epic. `scenario1856.ts` (era `nationalism`) *ships
  today* but its era-event spine **dead-ends at the Trent Affair (1861)** — the
  antebellum pressure (Dred Scott, John Brown, Secession Winter loyalty decay,
  `SLAVE_STATES_1856` at `types.ts:1152`) builds toward a war the build cannot
  fight. Adding #56/#57/#58/#59 **completes a half-finished playable scenario** —
  the single highest "finish a playable thing" leverage in the batch. Federalism,
  by contrast, is net-new content behind a new scenario builder.
- **But it has two hard prerequisites that fix its floor in the order:**
  - **The generic war system (#6 / divergence #6).** The Civil War is explicitly
    the **Major-tier instance** of that engine (two theaters, naval-gates-land,
    per-theater WarScore + auto-win, Major/Minor/Operation multiplier). Building
    the Civil War *before* generalizing the flat resolver (`phaseRunners.ts:3593-3627`)
    would mean writing the multi-theater model twice. So **#6 must land first** —
    and #6 should be designed *with multi-theater + tiers in view* (see the #6 row)
    so the Civil War is a configured instance, not a rewrite.
  - **ActionRegistry (K2).** The 3 Reconstruction readmission plans + the
    strip-leaders/pardon laws + the secession trigger are ActionRegistry/exec-action
    rows; readmission is a per-state **bill** through the existing pipeline.
- **Internal ordering (cheap parts first):** secession gating (#58, a
  `Politician.allegiance` field + a "Secessionists" pool + trait reads) and the
  free/slave sectional crisis (#59, derived from the existing `SLAVE_STATES_1856`
  set) are **cheap additive parts** that can land as the antebellum payoff before
  the heavy war engine. The two-theater war (#56) + Reconstruction status model +
  readmission bills + time-boxed bias (#57) are the heavy L parts. Canada (#60)
  rides the bill-driven-statehood pipeline (#43) and can follow.
- **Net placement:** in the engine-track subsystem order, the Civil-War/Reconstruction
  epic sits **right after generic war (#6)** — well ahead of the deep-modern Phase-2
  tail, and not gated on federalism (the two are independent; do whichever finishes
  a playable scenario faster — I rank the Civil-War 1856 completion *above* the new
  federalism scenario on pure "finish a shipped thing" grounds, though the planner
  may prefer federalism first if the cross-era systems it forces — per-state EC,
  amendments — are wanted sooner).

> **★ BATCH-16 UPDATE (`hd1`) — the internal ordering inside E3/E3b is now better
> resolved, and the Reconstruction half's hardest open question is ANSWERED.** Build
> the heavy parts in this order: (1) the **generic war engine (#6/#56)** with the
> **#155 balance terms** (enemy-strength + battle-size + Officer-Mil cap +
> per-theater scoring) and the **#152 DEFEAT loss package** on the SAME `War` model —
> keep the **1772 RevWar winnable** (`hd1#POST 1004`); (2) the **secession gate (#58)
> + #157 CSA-government seeding** (the cheap-additive antebellum payoff + the
> CSA-victory branch); (3) the **Reconstruction onset (#57) + the #156 4-plan model**,
> which now ships with the **DH-29 solo-blocker SOLVED** (the unilateral-adopt
> prerequisite — §9.1.6, §9.1.12). The batch-7 worry that E3b's readmission half
> needed K5 + CPU handler #2 before it could ship winnable is **relaxed for the solo
> case** by #156: the player-President adopts a plan directly via the exec path, so
> the readmission half no longer HARD-depends on K5. **DH-64** (the `Southern
> Unionist` dataset audit) is a prerequisite for the #58 per-pol gate but is XS and
> rides the #120 dataset pass independently.

#### 9.1.3 Where K5 (the CpuController scaffold) sits — and why

> **The single most important call in batch 5.** This subsection is the planner's
> grounding for K5's placement.
>
> **★ BATCH-9 PRIORITY BUMP — CPU-faction AI is LOAD-BEARING, not optional.** The
> largest corpus in the KB (`nuke`) carries the designer's **strongest design-intent
> statement (§28.12, #114): the digital APP is built for 1-human-vs-9-CPU.**
> Multiplayer "goes off the rails"; the points system is **for the CPUs + enthusiasm,
> not humans** (low points = better draft order, so humans can tank). The
> tabletop/forum game is team-MP with CPU backfill — **both are true; the app is a
> solo adaptation of a multiplayer game.** The consequence is decisive for K5:
> **every multiplayer-only apparatus the forum runs by hand** (party-leader elections,
> conversions, kingmaker pairings, committee assignment, cross-faction endorsements,
> forced 3rd-party runs, the whole convention) **must be CPU-AI-driven in the build**,
> and `nuke` confirms that this entire surface was **entirely UNEXERCISED** by the
> human playtest — it has to be authored from spec. **This does NOT re-sequence K5**
> (it still lands after K0 + K2, parallel with K3/K4 + federalism), but it raises K5
> + the handler suite (E9) from "force-multiplier" to **the load-bearing system that
> makes the product playable solo at all.** Treat the handler suite as a first-class
> Phase-1 system, not a nice-to-have. It is the difference between a playable solo
> game and not.

The §25 spec resolves **DH-8 for explicit heuristics** but exposes
**DH-20/21/22 as truly architectural**: the build needs a new agent-decision
pass with persistent state, not single-line rule additions. Three structural
facts decide K5's slot:

- **The shipped engine has no agent-decision pass at all.** Three thin stubs
  exist — `pickBestForFaction` (`phaseRunners.ts:33`, draft only),
  `pickAIResponse` (`eraGraph.ts:88`, era-event branches only), and
  `autoFillCPUVotes` (`constitutionalConvention.ts:81`, CC ratification only).
  Everything else runs no logic (e.g. the convention finisher is `engine.ts:69`
  "log ratification") or a one-line placeholder (e.g. `runPhase_2_3_1_Cabinet`
  scoring + immediately seating with no Senate vote at all).
- **The §25 heuristics need a uniform host.** They differ in `ctx` type and
  `Decision` type, but they all share the same shape: pure function over
  `(snap, factionId, ctx)` returning a decision, with deterministic tie-breaks
  under a seeded RNG. **One `CpuHandler<Ctx, Decision>` shape captures every
  one.** This is the same architectural argument as K2 for action libraries
  (§6.6).
- **The three architectural gaps need persistent state.** DH-20 (reciprocity)
  needs `cpuCommitments`. DH-22 (cascading scandals) needs `recentScandalIds`.
  DH-21 (meter-guarding) needs a pure meter-impact projector. None of these
  belong on existing runners; they belong on a controller.

**Placement:** K5 is keystone #6 in the order **after K0 (seed) and K2
(ActionRegistry)**. The §6.6.1 handler-order table gives ~15 follow-on PRs.
K5 itself is **~120 lines** (orchestrator + handler interface + tie-break
utilities + two `repair()` backfills + a determinism test). The handlers
themselves are lightweight per-subsystem PRs — most are ~50-200 lines each
of pure decision code, with the heuristic verbatim from §25.

**What K5 does NOT block:**
- The **federalism epic** (`scenario1788` + content) can ship with today's CPU
  stubs. The 10-faction CPU stays passive until K5 + the handlers wire in.
- The **1856-arc Civil-War / Reconstruction epic** is independent of K5 (it
  enhances a shipped scenario; the war engine is engine-internal). It is the
  best epic to wire CPU handlers into *as they land*, because the antebellum
  pressure already drives most CPU surfaces (legislation, conversion, A/B/C
  events, leadership).
- The **generic-war epic (#6)** is K5-independent. The war engine resolves
  combat by formula; CPU "decisions" inside the war (who commands a battle,
  which theater to focus) live in the war epic, not as K5 handlers.

**What K5 DOES enable** (and only K5 enables):
- **DH-8 resolution in full** (CPU convention AI, the marquee unstable surface).
- **DH-20 / DH-21 / DH-22** — these have no other home.
- **The cabinet-confirmation epic (DH-23).** Today the system isn't built; the
  default-AYE baseline + Iron-Fist auto-AYE rule is CPU-AI work and lands on
  K5's handler #4.
- **The "computer owns the deterministic tedium"** theme (scaling wall b) —
  auto-fill House slates + committee rosters is partly handler-driven (the
  committee-staffing heuristics are §25.5-adjacent).

> **Recommendation for the planner:** treat K5 as a **late-keystone**
> (after K0/K2 but parallel with K3/K4 + the federalism epic). Don't wait on K5
> to start scenario work; **do** wait on K5 to ship the §25 heuristics — they
> have no other home.

> **★ BATCH-13 — the all-CPU-test IS a spec-validation methodology (recommend it).**
> `oopscpu` is the first batch that **systematically validates a whole subsystem's
> spec before it is built**: Ted ran every faction on the CPU rules and stopped, live,
> at each spot the rules were vague/contradictory/impossible-without-human-judgment.
> The payoff for the build is concrete — the E9 handler specs #70/#72/#73/#74/#75/#76
> moved from "designed" to "designed + field-validated with named failure modes + Ted's
> fixes" (lower spec-risk per handler PR; see §6.6.1). **`oopscpu` does NOT change the
> K5/E9 order** — it de-risks E9 and pins the OC-* sub-rules to handler homes. **Two
> recommendations:** (1) the **OC-* sub-rules are field-validated, not new epics** — fold
> them into the relevant handler rows (OC-3 is the highest-priority sub-rule of handler
> #2 because it is balance-breaking — peaceful 1792 abolition); (2) **run a post-12A
> all-CPU test before building the convention handler (#71 / handler 9e)** — 1788
> predates conventions, so #71 is the ONE handler `oopscpu` could not exercise; it
> stays `drums`-only-spec and DH-8-flagged-unstable. A post-12A all-CPU run would
> validate #71 exactly as `oopscpu` validated the rest, and it would surface the
> convention CPU's holes (DH-8/DH-17/DH-57) live before they cost a build PR. The
> methodology is cheap (an all-CPU game needs no players — and so is immune to the
> GM-burnout death mode DH-36) and high-leverage for the most fragile handler.

#### 9.1.4 Where the APOCALYPSE meter-driven endgame lands (batch 6) — Phase 1, not Phase 2

> **The single most important call in batch 6.** This subsection is the planner's
> grounding for the APOCALYPSE clock's placement.

`pop` documents a NEW endgame condition: a meter falling into a specific
bottom-tier band starts a **10-game-year (5 half-term) countdown** to
mandatory game-end (`pop` POST 542, 548 — Planet Health → APOCALYPSE).
The shipped engine has **only event-driven endgame** (`EraEvent.triggersGameEnd`
at `types.ts:1476` → `phaseRunners.ts:2871` → `game.gameEnded` at
`types.ts:1635`). No meter-watcher, no countdown clock, no `endgameClocks`
array anywhere in the codebase.

**The placement question: Phase 1 or Phase 2?** Three facts decide it.

- **The `planet` meter ships TODAY.** `NationalMeters` (`types.ts:1399`)
  includes `planet`, and it ticks in `runPhase_2_5_1_Lingering` and via era
  events / legislation across **every era**. The clock infrastructure does
  not wait for the modern era — it can monitor `planet` in 1772 or 1856
  (whether the planet meter ever crashes that early is a content question,
  not an infrastructure one).
- **The model is META-AGNOSTIC.** Row #88 explicitly notes "analogous
  bottom-tier endgame clocks may exist for other meters/eras" (e.g. Econ
  Stab "depression spiral," Honest Gov "corruption collapse"). The Populism
  Planet Health 10-yr clock is **one configured row** in a per-era table;
  the engine doesn't know about "APOCALYPSE" as a special concept.
- **The sink is shared with the event-driven path.** Both paths terminate
  via `game.gameEnded` — the existing `GameOverScreen.tsx` (`:20`) already
  reads it; the autosave / GameContext lifecycle (`:365`, `:484`, `:511`)
  already gates on it. The meter-clock just needs to **set** `game.gameEnded`
  when `remainingYears` hits 0; everything downstream is reused.

**Recommendation: Phase 1.** Specifically, **fold it into Phase-1 #6 (meter-
model generalization)** as a sibling refactor. Rationale:

- Same code area (`runPhase_2_5_1_Lingering`, the meter writers).
- Same time the ±3-clamp and crisis/cascade rules are being added — the
  band-monitor reads the same "what tier is each meter in?" computation.
- Cheap incremental cost (the field + the monitor + the termination path
  are all small). Sized **M** all-in, including the GameOverScreen HUD
  warning for active clocks.
- **Architecturally important** — it's a NEW endgame surface, not a balance
  dial. Naming it as a divergence (#14) and putting it on the Phase-1
  roadmap means the architectural decision lands once and is visible.

**Counter-argument considered (and rejected).** A planner might argue the
APOCALYPSE clock is "modern-only" because Populism is the only documented
instance — therefore Phase 2 with the rest of modern. But:
- The shape is generic; making it modern-only would build a one-off, then
  rebuild it generically later when the second meter-clock gets authored
  (Econ Stab? Honest Gov?).
- The `planet` meter ships and ticks every era today — there is no era
  enum reason to wait.
- The `game.gameEnded` sink is shared today; building a parallel
  modern-only termination would split the sink.

**The implementation outline** (~M sizing):

1. Add `GameState.endgameClocks?: { meter: MeterKey; threshold: number;
   remainingYears: number; startedYear: number; bandName?: string }[]`
   (optional; `repair()` backfills `[]`).
2. Add a per-era table `era.endgameClockRules?: { meter; threshold;
   countdownYears }[]` (initially: `{planet, -4, 10}` for `modern`/Populism).
   Authored data; future eras add rows.
3. In `runPhase_2_5_1_Lingering`, after meter writes: walk
   `era.endgameClockRules`; for each row, check the meter's current band:
   - If meter is at-or-below threshold AND no active clock for it: arm
     (push new clock entry with `startedYear = game.year`,
     `remainingYears = countdownYears`).
   - If meter is above threshold AND clock active: disarm (filter out).
   - If meter is at-or-below AND clock active: decrement by 2 (half-term).
4. In `engine.ts` / `advancePhase`: if any clock's `remainingYears <= 0`,
   set `game.gameEnded = { year, reason: <band-name + meter>, templateId:
   'apocalypse:<meter>' }`. The existing `GameOverScreen` flow takes over.
5. `GameOverScreen.tsx`: render the meter-driven case with a distinct
   message vs. the event-driven case (read the `templateId` prefix).
6. HUD warning: render an inline banner when `endgameClocks.length > 0`
   showing remaining years (read by any of the meter pages).

**Determinism note:** the band-monitor is deterministic (no rolls); it
needs no K0 dependency. The model can ship before K0 lands.

> **★★ Batch-15 (`terror2000`) — build the SECOND meter-driven endgame shape (the
> per-event-phase game-end ROLL, #88) in THIS SAME module — and it is now the FIRST
> PROVEN game-over in the KB.** Distinct from the APOCALYPSE fixed 10-year countdown:
> when worst-band meters sit at their floor, the game can END on a per-event-phase ROLL
> (~20%) — the `rep1800` enumerated set (game-mechanics §26.4): Standard Coup
> (DomStab≤2 & EconStab≤2, 10%), Economic Collapse (EconStab=1, 20%), **Autocratic Coup
> (HonestGov=1, ~20%/phase)**, Enemy-Takes-Defenseless-US (MilPrep=1 & a power<Neutral),
> Civil-War/secession (DomStab=1). **`terror2000` FIRED the Autocratic Coup live**
> (Honest-Gov at floor → 20%/event-phase "Autocratic Coup Ends America", `POST 827,
> 829`) — the first game-over to actually fire, resolving #88's "is it worth building?"
> and proving the modern era is exactly where it is reachable (Honest-Gov craters far
> more easily than late-game MilPrep). **Recipe delta:** add `era.gameEndRollRules?:
> { id; condition: (snap) => boolean; pct: number }[]` and, in the same Lingering/event
> phase pass (step 3 above, BUT this branch needs a seeded `chance()` roll → it DOES
> depend on K0 for reproducibility, unlike the deterministic countdown), roll each row
> whose condition holds; on a hit set `game.gameEnded = { year, reason, templateId:
> 'gameEndRoll:<id>' }`. The existing `GameOverScreen` flow takes over (it already reads
> `game.gameEnded`, `App.tsx:341`). **One end-condition module, two shapes** (countdown
> clock + per-phase roll). S on top of the APOCALYPSE clock. See §9.1.11(A) + debt #28.

#### 9.1.5 ★ The era-model reframe (batch 7, MULTI-SAVE PROVEN in batch 8, TWO-LEVEL in batch 9) — exactly how K3/K4 change

> **The single most important call in batch 7, and the biggest architectural
> reframe of the era keystones across all 9 batches.** This subsection is the
> planner's grounding for the new K3/K4 specs.
>
> **★ BATCH-8 CONFIDENCE BUMP — this is now the MOST-CORROBORATED architectural
> finding in the whole KB, and it is MULTI-SAVE PROVEN.** The batch-7 reframe was
> inferred from a single 1800-start campaign (`rep1800`). Batch 8 adds a fully
> *independent* save — `tea1772` (a 1772-start solo all-CPU traversal, **28 in-game
> years earlier**) — that emits the **identical era-band labels** (Federalists →
> Republicanism → Democracy → Manifest-Destiny → Nationalism) at the **same in-game
> dates** as `rep1800`'s 1800-start run (`tea1772` POST 21/62/91/130/153; `rep1800`
> POST 92/6201; game-mechanics §27.1/§27.2). Two saves, two start years, one
> deterministic band sequence ⇒ the bands are **game-state content-gates, not flavor
> or per-thread GM invention.**
>
> **★★ BATCH-9 REFINEMENT — the era model has TWO LEVELS (confirmed across a THIRD
> start year, 1948 — `nuke`, §27.1).** The largest corpus in the KB emits the band
> model again and **splits it into two distinct, separately-fired mechanics that an
> earlier extractor had conflated. Both must be built; do NOT collapse them:**
> - **Level (a) — Historical Eras = the point-banked content-bands** (the #92/#100
>   mechanic). `nuke` spans only TWO ("Era of the Nuclear Age" 1948–2000 → "Era of
>   Terror" 2000–~2012). The Era-of-Terror is a **real band with RULE DELTAS, not
>   just content** — the GM gates rules on *"now that we are in the Era of Terror…"*
>   (e.g. cabinet **region STOPS mattering** → replaced by diversity + faction-balance
>   checks, §28.7). This is the proof that bands carry **rule-deltas** (like the
>   Era-of-Terror cabinet rework), not only content/draftee/bias swaps.
> - **Level (b) — within-era decade/census boundaries** (1972/1980/1990) = a
>   **SEPARATE, schedule-fired** mechanic (the per-decade `AMPU Census`, §28.9). Each
>   census does **three things at once: (1) bulk EV reallocation vs the prior census;
>   (2) wholesale state-bias re-lean on the Blue5..Tossup..Red5 scale; (3) content
>   rotation** of the draft pool, lobby cards, and era-activated industries. This is
>   **distinct from #68's per-era bias-table swap** (which fires at a Historical-Era
>   boundary) — it fires on a 10-year calendar schedule WITHIN a band.
> - **★ LOGGED CORRECTION — "Neocons"/"Corporate Republicans" is a FACTION REBRAND
>   (~1980), NOT an era band.** The spreadsheet's loose tab-naming ("Era of Neocons
>   1972-2000") + GM flavor at a census boundary caused an earlier mislabel. Do NOT
>   promote any faction nickname to a Historical-Era band. (This is why the two-level
>   split matters: the mislabel came from conflating decade content-rotation with a
>   band.)
> - **★ STRUCTURED era-event-data REQUIREMENT (DH-48, §28.9).** The whole Neocon-era
>   **census/EV-delta event block was LOST** in the spreadsheet because the events
>   were free-text flavor (stored alphabetically-by-era; EV-change events lacked the
>   token "EV" → unsearchable, then mis-moved to the wrong band). **REQUIREMENT:
>   era-event content rows need a STRUCTURED `evDelta`/census field** (not free-text)
>   + **per-era completeness validation** so a 10-yr census reallocation always
>   fires. This lands in K4's era-content registry + the dataset-build validators.
> - **★ Era CONTENT fires on its OWN scripted clock (distinct from bands & census,
>   #109).** Three separate gates: era **bands** gate on game-state/year (level a);
>   the **census** fires on a 10-yr schedule (level b); era **CONTENT** (events /
>   SCOTUS docket) fires on a **scripted schedule decoupled from in-game history** (a
>   player who ends Jim Crow early still can't pre-empt the Civil-Rights content — the
>   GM house-rules a ~5%/phase trigger). Reinforces the §6.4 scheduling work: bands
>   gate on game-state; content fires on its own clock.
>
> Two saves at two start years (batch 8) + a third start year (1948, batch 9), one
> deterministic band sequence ⇒ the era keystones (K3/K4) are the **safest large bet
> in the roadmap**; treat the content-band model as settled, not speculative.
> **Nothing structural changes from batch 7** (the K3/K4 spec was already
> condition-driven) — batch 9 ADDS the level-(a)/level-(b) split + the
> rule-delta-carrying-band confirmation + the structured-era-event-data requirement,
> all inside K3/K4. No new keystone.

**The finding (§27.1 / #92).** An "era" in AMPU is a **content-band** — a set of
available bills + era-events + draftees + a state-bias table — that the game
advances through on **game-state / meter / territory-ownership triggers,
evaluated per half-term**, **NOT** by matching a real calendar date. The calendar
year is essentially cosmetic for *content*; it stays load-bearing only for phase
*cadence*. `rep1800`'s clock ran ~30 years "behind" its content (Louisiana
Purchase succeeded in calendar **1834**, not 1803) because content is gated on
**territory you actually hold** and game state advances at whatever pace the
players play.

**Verified vs. shipped (what's actually there to change):**
- Phases gate by `year % 4` / `year % 2` — `isDraftYear`/`isPresidentialYear`
  (`year % 4`) and `isElectionYear` (`year % 2`) at `phases.ts:49-59`. **These
  are CORRECT for cadence and stay.** A draft every 4 years and elections every
  2 are right regardless of era.
- The **only era *advance* in the engine** is the hard-coded
  `snap.game.currentEra = 'federalism'` at `constitutionalConvention.ts:198` —
  fired by a game-state event (the Constitution ratifying), not by a year.
- **There is no year→era derivation anywhere.** `currentEra` is a plain field
  (`GameState`, `Era` enum at `types.ts:1337`). So the codebase does **not**
  today derive the era from the year — which means the reframe is **less a
  rewrite than a generalization of the one existing trigger** into a registry of
  conditions.

**Exactly what changes vs. the PRIOR K3/K4 spec** (the prior spec already said
"year-decoupling + per-era point banking" — batch 7 sharpens it):

| Aspect | PRIOR K3/K4 spec (batches 1-6) | BATCH-7 K3/K4 spec |
|---|---|---|
| `advanceEra` signature | `advanceEra(snap, target: Era)` — caller names the target | **`advanceEra(snap)`** — watches an `era.advanceWhen(snap)` condition; **no `target`** |
| What advances an era | implied by year + the CC transition; "gate content by `currentEra`, not literal year" (stated, not detailed) | **an explicit game-state / meter / TERRITORY-ownership condition, evaluated per half-term** (§27.1); the CC `:198` line becomes the first `advanceWhen` |
| Content legality | gated by `currentEra` enum | gated by `game.eraBand` **AND territory ownership** — un-owned-land bills/events/draftees are **invalid** (the mechanism that *forces* the lag) |
| Sub-bands | not modeled | Republicanism / Democracy / Manifest-Destiny are **content-band markers** on the game-state gate (NOT new enum values unless rule tables diverge) |
| Point-banking boundary | "bank at the boundary" (#68) | **fires AT the content-band boundary, wherever it lands on the calendar** — reconciled with the condition-driven trigger |

**Why this is a REFINEMENT, not a new keystone.** It lands entirely inside K3
(the `advanceEra` + content registry) and K4 (the per-era `{bills, eraEvents,
draftees, biasTable, advanceWhen}` records). No new keystone, no new top-level
field beyond an optional `game.eraBand` marker (which can reuse `currentEra`).
**It RECONCILES three prior findings into one coherent era system:** #68 per-era
point-banking, §26 the BootSheet / scenario-boot model, and §27.1 the
content-band finding. Sizing stays **M** for K3 (the condition registry + the
territory-gate predicate are additive to the boot pipeline already specced).

**The territory-gate is the load-bearing new predicate.** Add a
`territoryOwned(snap, requirement)` check (a new `Predicate` variant —
`{ territoryOwned }` — with one `evalPredicate` case at `eraGraph.ts:12`) and
apply it to bill/era-event/draftee availability. The draft pool also needs to
**exclude pols whose state/territory is un-owned or unorganized** (this is the
same gate as §27.5's unorganized-territory rule + the DH-class
"draft-pool-includes-unorganized-territory-pols" bug). **One predicate, three
consumers** (bill catalog, era-event walker, draft pool).

**Open question for the human (don't block on it):** are the early sub-bands
distinct `Era` enum values, sub-phases, or content-band markers? My engineering
call: **content-band markers first** (cheapest, additive, no exhaustiveness
cascade) — promote a sub-band to an enum value only if its rule tables
(`LEADERSHIP_RULES.eraConfig`, `MORTALITY_RULES.eraConfig`, …) genuinely differ
from `nationalism`. The shipped 4-value enum stays; `gilded`/`progressive` are
still the two values K4 adds (those *do* have divergent rule tables).

**★ Batch 14 — the `gilded` value now has a FULL NATIVE SPEC (#41, `gild1868`).**
The dedicated `gilded` era is no longer a hypothetical enum slot: `gild1868` (the
first native-1868 campaign) gives K4 the entire content band for it — see §9.1.10
for the dependency table. The band's `{bills, eraEvents, draftees, biasTable,
advanceWhen}` record is concretely: a **red/blue-FLIPPED faction roster** (RED =
Republicans / BLUE = Democrats — the OPPOSITE of the founding-era frame, so the
content-band registry must carry **party-label-by-era**, not a fixed RED/BLUE↔party
mapping; `gild1868` POST 6), the **Gilded nickname table** (Stalwart / Half-Breed /
Mugwump / Bourbon / Readjuster…), the **era-event spine** (Philippines-from-Spain
A/B, women's-suffrage A/B, census EV deltas, Labor Unions / RJ Reynolds / Twain /
Nast / steamships), the **bill catalog** (tariff-rate #147 / currency-regime #147 /
civil-service #149 / ICC / statehood), the **SCOTUS docket** (Elk v Wilkins,
Allgeyer v Louisiana), and the **20-yr Reconstruction timer** (#148). The era boots
**mid-government** like 1856 (one-party GOP: Senate 56-9 / House 141-70 RED,
`gild1868` POST 71) via the K4 `BootSheet`. **`scenario1868` is "another
scenario-as-data-row" once the BootSheet pipeline + content-band era model land —
AFTER `scenario1788` + a mature `advanceEra` (Phase-1 #22 / §9.1.10).** Build it as
K4 content, NOT a bespoke Gilded code path. **★ Batch-8 NEGATIVE RESULT still holds
— do NOT add a post-Gilded "future" era** (`gild1868` ends still in the Gilded Age
at POST 6318; #92).

#### 9.1.6 ★★ The Reconstruction solo-blocker — a BUILD REQUIREMENT on E3b

> **The second-most-important call in batch 7, and a hard gate on the 1856-arc
> epic shipping as a winnable solo game.** Flag this prominently for the planner.

**The finding (DH-29 / §23.4 / #57).** GM-verified (`rep1800` POST 9170): the
historical **Strict / Ironclad-Oath readmission plan can NEVER pass with CPU
factions** — *"only 3 factions would ever consider voting for it… in a single
player game it basically can never pass."* Post-guerrilla-war, even the
**Lenient-10% plan** was effectively un-passable (POST 9166). So **solo
Reconstruction is UNRESOLVABLE** — the era-event spine builds toward a
Reconstruction the single-player game cannot exit. The GM names it the **primary
driver of the in-progress CW/Reconstruction rules rewrite.**

**Why this is a build requirement, not a balance dial.** AMPU is a
**single-player game** (CLAUDE.md). Every faction except the player is CPU. The
1856-arc epic (E3b) **COMPLETES the already-shipped 1856 scenario** — that is its
whole value proposition (§9.1.2). If the arc's climax (Reconstruction) can't be
resolved by a solo player, **the epic delivers an unwinnable scenario** — worse
than not shipping it. So E3b's definition-of-done must include a
**CPU-passable readmission path**.

**Options the E3b epic must choose among (author the rule, then build):**
1. **CPU default-vote bias for the flagged historical plan** — the cleanest:
   tag the readmission bill as the "historical/required plan" and give CPU
   factions a default-AYE bias for it (a K5 CPU-handler concern — handler #2
   legislation, consulting a "historical-plan" flag *before* the §25.6 NAY/AYE/NAY
   heuristic). This is the same shape as the conditional-vote-rules primitive
   (`pop` POST 1111) and the cabinet auto-AYE-own-picks rule (DH-23).
2. **A guaranteed-pass crisis-bill path** — model readmission as a Crisis Bill
   that bypasses the normal floor (like DH-1's "MUST-pass" remedy), with a
   meter/score penalty clock while unresolved.
3. **Auto-resolution at the era boundary** — Reconstruction auto-ends at the
   `nationalism→gilded` content-band boundary (§9.1.5), mirroring the
   `rep1800` "Lenient plan auto-ends at end of half-term" + the ~1868
   mass-readmission finale (#57). This couples the fix to K3's condition-driven
   `advanceEra`.

My recommendation: **(1) + (3)** — a CPU default-vote bias for the historical
plan (so it *can* pass mid-arc) **plus** an era-boundary auto-resolution backstop
(so the arc always exits). Both are cheap relative to the war engine; both are
the kind of CPU/era-boundary logic E3b touches anyway.

**Dependency note for the planner.** E3b already depends on generic war (#6) +
K2 (readmission is a bill + a 3-plan exec action). The solo-blocker fix adds a
soft dependency on **K5 + CPU handler #2** (for option 1) and on **K3's
condition-driven `advanceEra`** (for option 3). E3b can ship the *war* without
these, but **cannot ship a winnable Reconstruction without at least one of the
three options** — so the readmission half of E3b should land **after** K5
handler #2 (or carry the era-boundary auto-resolution as its self-contained
fallback). This is the one place the 1856-arc epic genuinely **needs** the CPU
handler suite rather than merely benefiting from it.

> **★★ BATCH-16 UPDATE (`hd1`, #156) — DH-29 is REFRAMED from CPU-only to
> STRUCTURAL, and vcczar has AUTHORED the fix. This subsection is upgraded from
> "author the rule, then build" to "build the authored rule."**
>
> `hd1` is the FIRST run to play the Civil-War→Reconstruction arc with **HUMANS on
> both sides** of the readmission tug-of-war. The GM-stated outcome (`POST 2678`):
> *"The Congress could never agree on a Reconstruction guideline… NEITHER PASSED
> and states just started coming back into the Union with NO reconstruction plan at
> all."* So DH-29 is **not a CPU-heuristic gap** — competing HUMAN factions
> filibustered each other to the same null result. The blocker is **structural**:
> a both-chambers-must-agree paralysis that fires regardless of who is at the
> table.
>
> **The authored fix (vcczar's restart rewrite, `POST 2692-2694`) — the canonical
> #156 model:** a **4-plan Reconstruction model — No-plan / 10% / Ironclad
> (Wade-Davis) / Military-district — available to BOTH the President AND Congress**,
> gated by ONE prerequisite: *"there is a reconstruction plan adopted by Congress
> OR by the President."* Because the **President can adopt a plan UNILATERALLY** (it
> no longer has to be agreed by both chambers), Reconstruction always resolves —
> in solo play (no CPU vote needed at all) AND in deadlocked-human play. Individual
> per-state readmission is required only under the Ironclad or Military-district
> plan; under No-plan/10% the states just come back. The 15th-Amendment rider
> formalizes #57's Solid-South bias: **+2 toward the incumbent party in all Deep-
> South states + +1 in all other former-seceded states, for as long as
> Reconstruction is active** (sunsets when it ends).
>
> **What this changes for E3b's order:** the three options above (CPU default-vote
> bias / crisis-bill / era-boundary auto-resolution) are **SUPERSEDED** by the
> authored unilateral-adopt prerequisite. Specifically:
> - The **K5 soft-dependency is REMOVED for the solo case.** Option 1 needed CPU
>   handler #2 to *vote* the plan through; #156 lets the **President adopt it
>   directly via the exec-action path** (`runPhase_2_8_1_Executive`,
>   `phaseRunners.ts:3632`), so no CPU vote is required for the player-President's
>   own plan. (CPU handler #2 is still wanted for a CPU-President's choice and for
>   Congressional adoption, but it is no longer a HARD gate on shipping a winnable
>   solo Reconstruction.)
> - The **era-boundary auto-resolution (option 3) becomes a backstop, not the
>   primary mechanism** — useful if a player-President simply never adopts a plan,
>   but the unilateral-adopt path is the intended resolution.
> - **Build surface:** `game.reconstruction = { plan; adoptedBy; startYear }` + the
>   4 plans as ActionRegistry rows (K2) callable from BOTH the exec path and the
>   legislation pipeline; the plan-adopted gate fronts every per-state readmission;
>   the +2/+1 time-boxed bias rides the `calcStateVote` bias term. **Size: M–L
>   within E3b** — the largest single Reconstruction build target, but now a
>   DESIGNED fix.
>
> **One OPEN QUESTION remains for the human** (tuning, not a blocker): does the
> prerequisite HARD-gate ALL readmission (no state returns until a plan is adopted)
> or allow a default No-plan drift? The digest flags this; author it, then build.

#### 9.1.7 Ideology-as-circle (batch 7) — foundational, era-gated, place it early-ish

> **The third structural call in batch 7.** Is it a foundational ideology-model
> change or an era-gated overlay? **Answer: both — it is a foundational
> *refactor* (a central distance helper) behind an era-gated *flag*.**

**The finding (§27.7 / #99).** A mid-era rule change wraps the 7-point ideology
scale into a **ring**: LW Populist ↔ RW Populist become adjacent (one-step shifts
at the standard ~25% base), and conversions extend to **adjacent** (not
same-only) ideologies.

**Verified vs. shipped (why it's cross-cutting).** `IDEOLOGY_ORDER`
(`types.ts:14`) is a **LINEAR array**, and ideology distance is **open-coded** as
`Math.abs(IDEOLOGY_ORDER.indexOf(a) - IDEOLOGY_ORDER.indexOf(b))` (or
`indexOf(x) - center`) at **10+ engine call sites**:
- `factionCenter` (`phaseRunners.ts:715`) — the PV-weighted center,
- `stepToward` (`phaseRunners.ts:740`) — the ideology-shift step (2.1.5),
- conversion adjacency (`phaseRunners.ts:993-1003`) — the §25.8/#76 gate,
- sponsor-distance (`phaseRunners.ts:3548`),
- a **private `ideologyDistance` helper** in `firstContinentalCongress.ts:120`,
- plus `FactionLeaderPage.tsx:19-20,49`, `Relocations.tsx:107`,
  `Kingmakers.tsx:86` (UI).

**There is NO central distance helper today** — every site reimplements it. That
is what makes the change foundational: a circular metric must be applied
*consistently* across shifts, conversions, VP/platform "adjacent ideology"
checks, and factionCenter, or the model is incoherent.

**The clean path (sizing M):**
1. Add a central `ideologyDistance(a: Ideology, b: Ideology, circular: boolean)`
   helper (engine util). Linear branch = today's `Math.abs(idx-idx)`; circular
   branch = `min(|idx_a − idx_b|, 7 − |idx_a − idx_b|)`.
2. **Migrate the 10+ open-coded sites to it** (a mechanical, behavior-preserving
   refactor while `circular = false`). Fold the private
   `firstContinentalCongress.ts` helper into the central one.
3. Gate the wrap on a `GameState.ideologyIsCircular?: boolean` flag set by the
   mid-era rule-change event. `repair()` backfills `false`.
4. Extend conversion targeting (§25.8) to **same-OR-adjacent** ideology under the
   ring (was same-only).

**Why place it early-ish (a near-term foundation refactor), not in the deep
tail:** steps 1-2 are **cheap and additive while the flag is off** (zero behavior
change), and they pay down a latent consistency risk — every future ideology
consumer (the SCOTUS within-1-step auto-AYE §26.6, the conversion handler #6, the
faction-center math) gets the single helper for free. Doing the central helper
*before* the conversion/SCOTUS handlers means those handlers call the helper from
day one rather than open-coding distance a 11th and 12th time. So: **land the
helper + the migration as a Phase-1 foundation refactor (XS-S for steps 1-2);
wire the circular flag + conversion-adjacency (steps 3-4) with the era-content /
conversion work (M total).** It is **not a keystone** (nothing blocks on it), but
it is the cheapest while early and the most error-prone if deferred.

#### 9.1.8 ★ NEGATIVE SCOPE — the Cold War is NOT a subsystem (batch 9) — and what the real items are

> **The single most important scope-control finding in batch 9. This subsection
> exists so the roadmap-planner does NOT queue a Cold-War epic.** Lift it directly.

**The finding (§28.2, re-confirmed across all 156 chunks of the largest corpus in
the KB).** Despite the "Nuclear Age 1948–2004" title, there is **NO purpose-built
Cold-War system** in the design — no containment engine, no nuclear/MAD model, no
NATO/Article-5 bloc, no space-race subsystem, no army/navy/air branches. The "Cold
War" is the **generic cross-era war engine RELABELED with era-appropriate names,
plus one-off events.**

**Verified vs. shipped.** Grep confirms only `src/engine/revolutionaryWar.ts`
exists — there is **NO generic war engine and NO Cold-War engine** in the code; the
post-Rev-War resolver is the flat one-roll path at `phaseRunners.ts:3593-3627`. So
the framing checks out two ways: the *design* has no Cold-War subsystem, and the
*build* needs exactly ONE generic war engine (not era-specific ones).

**What the roadmap must NOT scope** (these do not exist in the design):
nuclear/MAD, NATO/détente-as-a-system, SALT, the space race, or army/navy/air
service branches as *bespoke mechanics*. The forum ran the entire Cold War on the
plain naval→land d100 roller; nukes were scripted events + one legislative ×2
multiplier; NATO was a single point-swing event ("players picked no NATO");
Watergate had no impeachment trigger.

**What the roadmap DOES need underneath the Cold-War label (the real items):**

1. **ONE generic war engine (#6 / divergence #6)** usable in every era, with a
   **resolution/peace path** and ideally **army/navy/air branches.** This is the
   load-bearing item the Cold-War label hides. **DH-47:** today wars **never
   resolve** (the war-end roll's odds are so low Korea ran ~2 decades) and there
   are **no branches** (army generals command navies). Build the resolution path
   into #6 (couples to DH-12 white-peace) and design the branch model. The
   1772 Rev-War loop and the flat resolver both fold in as configured instances
   (already the §9.2 #6 plan).
2. **The diplomacy subsystem (#107 / §28.3)** — **8 per-nation relation meters**
   (9-point Hostile→Allies) + **ambassador actions** (Increase Relations / Trade /
   Credit-Loan / Provoke) on a 2.7.1 phase (Sec State suggests, Pres approves, one
   per ambassador per phase). The shape is right (`GameState.diplomacy` is already
   a `Record<string,number>`, `types.ts:1574`); the work is the per-era 8-nation
   seed list + the action library (K2) + **downward pressure** on the meters
   (DH-46 — today the US ends up allied with everyone) + a Cold-War ≤Neutral cap on
   USSR/China. This is the **same diplomacy-library row already in §9.2** — `nuke`
   makes its 1948 action set canonical and adds the USSR-collapse trigger holes
   (DH-45).
3. **Cold-War CONTENT as data** — EraEvos + A/B events + a few legislative
   multipliers (the Soviet-nuclear-test ×2 "arms race" flag; the NASA prerequisite
   flag) + the modern lobby cards. Rides the era-content registry (K4); no code.

**Net: zero new engine subsystems for "the Cold War." The work is the generic war
engine + diplomacy (both already on the roadmap) + content. Frame the Nuclear Age
as a DATA era on top of those, exactly like every other era.**

#### 9.1.9 ★★ The scenario-boot pipeline (batch 10, #115) — promote it, factor it ONCE

> **The single most important call in batch 10, and the planner's grounding for why
> #115 jumps the queue. Lift it directly.** This is the "how to CREATE a game" spec
> the forum has been missing for three years (`dem1820` POST 92).

**The finding (#115 / mechanics §29.1 / §26.1).** Every documented scenario is a
**mid-government boot** with the SAME shape — `dem1820` (1820), 1856 (shipped), 1788
(designed), 1800 (designed), 1948 (designed) all pre-seat a sitting President + VP +
Cabinet + an N-member SCOTUS + Speaker/PPT + a full Congress (some seats VACANT and
appointment-filled in setup), a 5-Blue/5-Red faction ladder, era-tuned decks, and
are EXPLICITLY EMPTY at boot (no faction leaders, no career-track pols, no inherited
PV/legacy/Kingmaker pairs). **The forum has no documented procedure for any of this**
— so each GA improvises undocumented house-rules (strip-Command-at-boot, inaugural
career-track seeding, Senate-class assignment, vacant-seat fill), and they conflict
thread-to-thread. **The build's scenario-boot pipeline IS that missing spec.**

**Verified vs. shipped — the reason this is foundational.** There is **NO shared boot
abstraction.** `startNewGame` (`GameContext.tsx:264`) branches on a literal
`'1772' | '1856'` to `build1772Scenario` / `build1856Scenario`. Each builder
(`scenario1856.ts:44-214`) is a **~200-line hand-authored function** that:
- instantiates politicians, then **seats senators/reps/governors in nested loops**
  (`:60-118`) with raw `Math.random` tie-breaks (`:83,99,113`, the K0 blast radius);
- assigns **Senate classes naively** (`:86`, `classId = senators.length + 1` — only
  ever 1 or 2, never 3, never validated — **DH-24**);
- seeds the **House as full `electoralVotes - 2` reps** (`:93` — not the (EV−2)/5
  focus-Rep abstraction, **#55**);
- wires the cabinet/court by scanning `currentOffice` types (`:124-142`);
- stamps a **47-field `GameState` literal** (`:147-193`) by hand.

So adding a 1820/1788/1800/1948 scenario today = **copy-paste that builder and edit
the literals.** That is precisely how the undocumented house-rules proliferate (and
how the `dem1820` Master-sheet demographic corruption — every pol rendered Black/LGBT
from a column mismatch — became possible: the data model lives in a fragile sheet, not
the code). **The build owning the boot pipeline + data model eliminates the entire
class.**

**The build target — factor `scenarioBoot(BootSheet)` ONCE (it lives in K4).**

| Concern | Today (per-scenario hand-code) | The pipeline |
|---|---|---|
| Entry | `startNewGame` switch on a string literal | `startNewGame(scenarioId)` → look up the `BootSheet` in a registry, call one `scenarioBoot(sheet)` |
| Sitting government | scan `currentOffice` types in each builder | declared in the sheet (`sittingGovernment: { presidentId, vpId, cabinet, court, speaker, ppt }`); the pipeline seats them |
| Congress fill | nested per-state loops + `Math.random` | one seat-filler pass; **all rolls through `rng.ts` (K0)** |
| Senate classes | `classId = senators.length + 1` (DH-24) | a **class assigner + verifier** that produces a valid 3-class rotation keyed to the start year (and the election rotation reads the start year, not a literal `1856`) |
| State roster | `STATES_1856` import | `stateRoster` keyed on `{era, startYear}` (divergence #17) — era-keyed industry seed, not zero (POST 532) |
| Vacant seats | n/a (all filled) | a `vacancies[]` list + the **appointment-eligibility ladder** (POST 859) the pipeline runs to fill them |
| Boot-Command / career-track | n/a (no rule) | sheet-level policy flags (see the undocumented-rules list below) |
| **Active wars (★ batch-13 DH-61)** | **n/a — every boot starts at peace except the 1772 Rev War** | **a `BootSheet.activeWars` field read from a start-year "active wars by start date" table; the pipeline instantiates each as a running `War` (loss-odds + War-Score applied). 1788 → Northwest Indian War (20%-loss / WS −2). The GMs FORGOT this entirely in `oopscpu` (`#POST 338-344`).** |
| Validators | none | `TRAIT_CONFLICTS` validator (DH-27) + the Senate-class verifier (DH-24) run as boot hooks |

The `BootSheet` schema is the one already specced in §9.1.5/K4 +
`{era, startYear}`-keyed state roster (divergence #17). **Era identity is data, not a
code path** — the 1820 sheet, the 1788 sheet, the 2012 "Trumpism-deck" sheet are
rows, not branches.

**The undocumented setup rules the pipeline MUST encode (each a sheet-level policy
the human DECIDES once, then it is disclosed + deterministic — the §29 forks):**
1. **Boot-Command (open Q #1).** Do inaugural-draft pols keep their dataset `command`,
   or is it **zeroed below an age/office threshold** at boot (the `dem1820`
   strip-Command-at-≤40-without-a-job house rule, POST 62/82)? A `bootCommandPolicy`
   field; **needs a human call** (KevinStorm drafted pols *for* their Command and was
   blindsided — POST 79/91 — so this is balance-load-bearing).
2. **Inaugural career-track seeding (DH-25, re-corroborated).** The stated rule
   (POST 28): seed career tracks from the **last 3 draft classes** (a 1820 start →
   1820/1816/1812/1808); pols already holding an office can't be tracked. But this
   collides with the **"CT pols can't run/be appointed" vs "CT pulled last"**
   contradiction (POST 850/859, DH-25/DH-56) — **PARKING LOT until the human authors
   ONE coherent CT-eligibility rule.** Do not build the seeding until the eligibility
   rule is settled.
3. **Senate-class assignment (DH-24).** Resolved above — the verifier.
4. **Vacant-seat fill order (POST 859).** The appointment-eligibility ladder
   (your-party-not-on-CT → … → generate a 1-skill pol; appointees 30+; can't leave a
   full-term Senate seat vacant). A deterministic rule the pipeline runs.
5. **Era-keyed industry init (POST 532).** New states enter with era-keyed industry
   (1 Agriculture, etc.), not zero — already a per-era table concern (K4).
6. **★ Active-war seeding (DH-61, batch 13, `oopscpu#POST 338-344`).** The pipeline
   must read a start-year **"active wars by start date" table** and instantiate each
   historically-running war as a live `War` (loss-odds + War-Score applied) — every
   boot starts at peace today EXCEPT the 1772 Rev War. The 1788 boot needs the
   **Northwest Indian War** (20%-loss / WS −2). A `BootSheet.activeWars` field + a boot
   hook; depends on the generic `War` model (Phase-1 #3) for the shape but is a thin
   seed-and-register pass on its own. **S, and a HARD prerequisite for `scenario1788`.**

**★ Batch-13 — two 1788-boot prerequisites the pipeline gates.** A `scenario1788`
boot CANNOT run correctly without **(a) DH-61** (the active-war seed above — they
literally forgot it in `oopscpu`) and **(b) DH-62** (the pre-12A two-votes-per-state /
no-ticket EC mode — see the election section / §9.2's per-state-EC row). Sequence both
WITH `scenario1788` (E1 / Phase-1 #1): DH-61 as the `BootSheet.activeWars` field +
boot hook here; DH-62 as an **era-keyed election-mode variant** in the per-state-EC
epic (#4 / divergence #20), keyed to the 1788/1792/1796 EC rounds.

**Placement.** **#115 is NOT a new keystone** — it lands inside K4's `BootSheet`
schema. But its **priority rises to the front of the subsystem queue:** do the shared
`scenarioBoot` factoring **with the first new scenario (`scenario1788`, Phase-1 #1),
not after the third copy-paste.** The dependency order is **K0 (so boot rolls are
seeded) → the `scenarioBoot` pipeline + `BootSheet` schema (with K4) → every scenario
(1788, then 1856-refactored-to-ride-it, then 1820/1800/1948) is a data row.** The
boot pipeline is also where the XS validators (DH-24 Senate-class, DH-27 trait-
conflict), the appointment-ladder, and **the active-war seed (DH-61)** live. **The two
§29 forks (boot-Command, CT-eligibility) are decision-gated** — author the policies
before wiring them, but the *pipeline itself* is unblocked and should be built first.

#### 9.1.10 ★ The gilded-era content epic (batch 14, `gild1868`) — ONE downstream era unit, not five quick wins

`gild1868` (the first native-1868 campaign, the largest thread in the KB) surfaced
five deltas — **#147, #148, #149, #150, DH-63**. They are **not five independent
backlog rows**; they are **ONE "gilded-era content" epic** that rides on top of the
era model + the economic engine + the bill-relationship graph + the Reconstruction
epic. **The Gilded Age is UNBUILT** (`Era = 'independence'|'federalism'|
'nationalism'|'modern'` at `types.ts:1337`, no `gilded`; only
`scenario1772.ts`/`scenario1856.ts`; the era is hand-run on `modern` tuning, gap
#41). **It does not move the top of the queue** — it is downstream content. The
planner should treat #41 as the umbrella and slot this epic **after `scenario1788`
(E1) + a mature `advanceEra` + #116 (E4c economic engine) + #42 (bill-relationship
graph) + #57 (E3b Reconstruction).**

**Dependency table (the unit of work; lift directly):**

| Item | Depends on | Binds in code | Size |
|---|---|---|---|
| **#41 dedicated `gilded` era + `scenario1868`** (UMBRELLA — `gild1868` is its full native spec) | K3/K4 (era-content-band registry + `advanceEra`), the `BootSheet`/`scenarioBoot` pipeline (§9.1.9), AFTER `scenario1788` (E1) | `Era` enum `types.ts:1337`; the era-content registry (K4, §9.1.5); a new `scenario1868` data row + boot sheet | **L** (a whole era's content + boot) |
| **#147 tariff-`tariffRate` + mutually-exclusive `MonetaryRegime`** | #116 (E4c economic engine) + #42 (bill-relationship graph) + the §20.4 tariff change-cadence | replaces the flavor bill at `phaseRunners.ts:3421-3422`; new `game.tariffRate:number` + `MonetaryRegime` enum on `GameState`; `Legislation.type`/`replaces` (`types.ts:1506`) | **M** |
| **#148 20-yr Reconstruction timer + appoint-by-leadership + Solid-South sunset** | #57 / E3b (EXTENDS it — no new epic); inherits the **DH-29 solo-blocker** (§9.1.6); the §23.1 Unionist tag; the leadership runner | `game.reconstruction={startYear,endsYear}`; the Speaker/PPT-faction appointment path; a time-boxed per-state bias modifier; `vacateOffice`/appointment sites | **S–M within E3b** |
| **#149 civil-service merit-vs-spoils axis (+ era-gated reform content)** | K3/K4 (era-gating registry); the gov-action library (§11.3); the Honest-Gov't meter | a merit-reform bill type; the State-Gov-Jobs spoils lever → DomStab; an `eraBand` gate on reform content (Social Mobility, income tax) | **S–M** |
| **#150 "1872 Rule" special-election branch** | #57/#148 (Reconstruction-begins gate) + the #48 third-party trigger + the §25.1 nomination handler | a meter-gated branch around `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`) | **S** (niche) |
| **DH-63 currency-regime exclusivity** | **FOLDS INTO #42 + #147** — not standalone | the mutual-exclusion constraint in the bill-relationship graph; auto-deactivate contradictory regimes | **XS–S** |

**The sequencing call (the planner can lift this verbatim):**

1. **Top-of-queue is UNCHANGED by this batch.** QW0 → K0/K2 → K3/K4 + scenarioBoot
   → E1 (`scenario1788`) still lead. Gilded is downstream era-content.
2. **#41 is the umbrella; `gild1868` is its full native spec** — the faction roster
   (red/blue-FLIPPED vs the founding era: RED = Republicans, BLUE = Democrats,
   `gild1868` POST 6), the Gilded nickname table (Stalwart/Half-Breed/Mugwump/
   Bourbon/Readjuster…), the era-event spine (Philippines-from-Spain, women's-
   suffrage A/B, census EV deltas, Labor Unions/RJ Reynolds/Twain/Nast/steamships),
   the bill catalog (tariff-rate/currency-regime/civil-service/ICC/statehood), the
   SCOTUS docket (Elk v Wilkins, Allgeyer v Louisiana), and the 20-yr Reconstruction
   timer. **`scenario1868` is "another scenario-as-data-row" once the BootSheet
   pipeline + content-band era model land — AFTER `scenario1788` + a mature
   `advanceEra`.** Do NOT build a bespoke Gilded code path; it is K4 content.
3. **#147–#150 + DH-63 are ONE epic gated on K3/K4 + the era model + #116/E4c + #42.**
   Not a near-term quick win — the tariff/currency systems need the economic-content
   state machine and the bill-relationship graph to exist first.
4. **DH-63 folds into #42 + #147's MonetaryRegime** (the mutual-exclusion
   constraint) — XS-S, no standalone work.
5. **#148 EXTENDS the existing #57/E3b Reconstruction epic** (timer + appointment-
   by-Speaker/PPT-faction + Solid-South sunset). It does NOT open a new epic, and it
   **inherits the DH-29 solo-blocker** (§9.1.6) — the Strict/Ironclad plan never
   passes with CPU factions, so solo Reconstruction must be resolved before any
   antebellum/CW/Reconstruction scenario (incl. a Gilded boot that turns the timer
   on) ships solo.
6. **The 3rd GM-burnout death** (`gild1868`, after `new1772`/`dem1820`) reinforces
   the automation-reduces-upkeep argument (DH-36 family) — the spreadsheet
   legislative phase is the hardest to run by hand (DJBillyShakes, POST 868). **Cite
   it, do not queue it** — no new mechanic.

#### 9.1.11 ★★ The modern end-condition + war-defeat + cabinet cluster (batch 15, `terror2000`)

> **For the roadmap-planner: lift this section directly.** `terror2000` is the
> first NATIVE 2000-start. It does NOT add a keystone, but it PROMOTES two long-open
> items to ready-to-build, opens the first proven LOSS state, and re-scopes E16 once
> more. None of it moves the top of the queue (QW0 → K0/K2 → K3/K4 + scenarioBoot →
> E1 still lead); these are mid-tier modern-engine items. Dependency-ordered:

**(A) #88 AUTOCRATIC-COUP terminal — the FIRST PROVEN LOSS STATE. Build it as a
small end-condition item; HIGH priority for giving the game a real end-condition.**
Verified: the only game-over path is event-driven (`triggersGameEnd`,
`phaseRunners.ts:2871`); there is NO meter-driven per-phase game-end roll. The
terminal surface (`game.gameEnded` → `GameOverScreen`, `App.tsx:341`) already
exists; only the trigger is missing. **`terror2000` is the FIRST record of any
game-over firing** (`POST 827, 829`) — Honest-Gov at floor → 20%/event-phase
"Autocratic Coup Ends America" → GAME OVER → resolves to the standard cumulative
winner. **Where it sits:** a small **end-condition epic** that builds the
per-event-phase game-end roll TABLE (game-mechanics §26.4's `rep1800` enumerated
set: Standard Coup / Economic Collapse / **Autocratic Coup (HonestGov=1, ~20%/phase,
CONFIRMED modern)** / Enemy-Takes-Defenseless-US / Civil-War-secession). It is the
**third shape of meter-driven endgame** alongside the APOCALYPSE 10-year countdown
clock (`pop` §9.1.5) — build them as ONE end-condition module (a meter-watcher in the
Lingering phase that arms countdown clocks AND rolls the per-phase game-end table).
**Meter-driven (Honest-Gov), reachable in the modern era** (Honest-Gov is far easier
to crater than late-game MilPrep — the "coups are dead once MilPrep is maxed" balance
note does NOT neutralize the Honest-Gov coup). **Size: S** (the roll table + one
`gameEnded` write + a HUD warning); pairs with §22.1 meter bank + the APOCALYPSE clock.
**It EXTENDS the existing endgame surface (debt #28), it does not need a new keystone.**

**(B) #152 WAR-DEFEAT resolution — extends the war-engine epic (Phase-1 #3 /
#56/#106).** Verified: the resolver ends a war at `warScore ±50` but the defeat
branch (`phaseRunners.ts:3618-3620`) applies NO loss package. The loss package
(officers −1 Mil + −1 all-elections; **President −1 ALL future elections**;
Party-Pref crater) is the symmetric inverse of the victory bundle; multi-phase wars
(naval→ground; "Invasion"→"Counter-Terrorism"; Afghanistan→Phase II) carry across
half-terms. **Epic home: the generic `War` model (Phase-1 #3)** — this is a REQUIRED
completion of the "war must RESOLVE" finding (DH-47: wars never end today), not a new
epic. The President-loss term COUPLES to the #18 election scorer (the −1 rides into
`calcStateVote` for all future elections, the inverse of the victory +1) — so build it
AFTER the war engine has a real resolution path, and wire its President/officer terms
into the election-math epic. **Size: M within E3.**

**(C) #18 CANONICAL election scorer — now fully SETTLED (V's 2-layer model); PROMOTE
to ready-to-build.** Verified: `calcStateVote` (`phaseRunners.ts:3685`) applies the
enthusiasm box raw with no ±3 cap and no universal-meter layer. Ted reversed his own
batch-10 reading to V's 2022 canonical intent (`POST 913-926`): **(a) a universal
per-ideology METER modifier** (flat, BOTH parties, EVERY state, primary+general —
"unless penalized" caveat GONE) **+ (b) the per-PARTY enthusiasm box** (moved by the
#51 reshuffle), composed additively then ±3-capped. **This removes a 3-batch-old
decision gate** — #18 was user/state-scope-gated since batch 10; it now LEAVES the
Decision-gated category. It **composes with** the already-settled #51 4-step reshuffle
algorithm (§29.10, E23) + the QW3 ±3 cap (#80) — those govern *how the boxes move* and
*the cap*; layer (a) is the only genuinely new piece (a per-ideology meter→modifier
table, read once per candidate at the ballot). **Where it lands:** the ±3 cap + layer
(b) are the QW3/E23 work already queued; ADD layer (a) at the same site. **Size: S–M.**
game-mechanics §29.3.

**(D) Cabinet cluster #124 + #151 — RE-SCOPE E16 (third time).** Verified:
`runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158`) is a flat scored pick. Batch 12's
#124 already re-scoped E16 to bundle confirmation + the cabinet→enthusiasm rework;
batch 15 SHARPENS the enthusiasm channel to Ted's LIVE 3-state upset/fine/happy model
(`POST 486-489`) and ADDS two Era-of-Terror-gated checks: **#151 same-party
appointment-FAIRNESS penalty** (−500/slighted same-party faction incl. the Pres's own;
fired LIVE twice) + the **cabinet-DIVERSITY penalty** (Era-of-Terror-active natively).
Re-scope E16 to bundle: confirmation (DH-23) + lobby→POINTS + the 3-state
enthusiasm channel + #151 fairness + diversity check — all gated to the Era of Terror
onward (a §27.1 era-BAND RULE delta, so K3/K4's era-band model must carry RULE deltas,
not just content). **#124's designer-gated percentages NARROW/CLOSE** — the live
3-state tuning supersedes the §30.2 #8 "cabinet enthusiasm %s" parked numeric (only the
Big-4-vs-rest weighting #9 may residually remain). **Size: M (the E16 rework) + S (the
two penalties as additive scored checks). LANDS AFTER K2 + K5** (cabinet picks are CPU
actions). game-mechanics §9.3.7 + §9.3.9.

**(E) #153 / #154 — small consistency, slot into draft/Command + appointment-ladder
work.** #153(a) DOUBLE every Command-gain % (rookie Command=0 already ships at
`phaseRunners.ts:216`; add a ×2 knob to `addCommandPoint`'s callers / a config
multiplier) — XS. #153(b) no-re-roll-on-held-expertise is ALREADY the `addExpertise`
behavior (`expertise.ts:5` dedupes) — a forward-only invariant, no work unless a random
expertise grant is added. #154 the 4-step vacancy-fill ladder (same-party-CT →
same-party-unemployed → other-party-CT → other-party-unemployed) is a new helper that
replaces the ad-hoc SCOTUS fill (`:3661`) and the bare `vacateOffice` null
(`:2446`) — S. **Slot both into the #115a/#115b boot/appointment-ladder consistency
family.** game-mechanics §4.1.y + §29.4(a).

**Net for the planner:** #18 + #124-%s leave the Decision-gated bucket (−2); the war
engine (E3) gains a required completion (#152); E16 is re-scoped a third time
(#124+#151); a NEW small end-condition module appears (#88, pairing with the
APOCALYPSE clock); #153/#154 are XS/S add-ons. **Top of queue UNCHANGED**; #18 + #88
are the attractive mid-tier wins this batch surfaces.

#### 9.1.12 ★★ The Reconstruction-fix + war-balance cluster (batch 16, `hd1`)

> **For the roadmap-planner: lift this section directly.** `hd1` ("A House
> Divided" Part 1) is the first HUMANS-on-both-sides Civil-War→Reconstruction run.
> It adds NO keystone and does NOT move the top of the queue (QW0 → K0/K2 → K3/K4 +
> scenarioBoot → E1 still lead), but it hands the **canonical fix for the DH-29
> solo-blocker** that has gated every antebellum/CW/Reconstruction scenario since
> batch 8 — turning DH-29 from an open blocker into a designed build target inside
> E3b. Dependency-ordered:

**(A) #156 — the 4-plan Reconstruction model + the UNILATERAL-ADOPT prerequisite:
the canonical DH-29 fix; HIGHEST-VALUE Reconstruction target; folds into E3b.**
Verified: the entire Reconstruction subsystem is unbuilt (`Reconstruction|Ironclad|
readmission|Confederate|CSA` → 0 hits in `src/types.ts`; only the Secession-Winter
loyalty scaffold exists, `types.ts:981/1149-1157/1481`). vcczar's restart rewrite
(`POST 2692-2694`) is an **authored design**, not just an open gap: **4 plans
(No-plan / 10% / Ironclad-Wade-Davis / Military-district) usable by BOTH the
President AND Congress**, gated by *"a plan adopted by Congress OR by the
President"* — the President can adopt UNILATERALLY, so solo AND deadlocked-human
Reconstruction always resolve. **This is the single highest-value Reconstruction
build target** because it UNBLOCKS DH-29 (the named solo-blocker). **Where it
lands:** add `game.reconstruction = { plan; adoptedBy: 'congress'|'president'|null;
startYear }`; the 4 plans become ActionRegistry rows (K2) callable from BOTH the
exec path (`runPhase_2_8_1_Executive`, `phaseRunners.ts:3632`) AND the legislation
pipeline; the plan-adopted gate fronts every per-state readmission; the 15th-Amd
**+2 Deep-South / +1 other-seceded time-boxed bias-while-active** rides the
`calcStateVote` bias term (`phaseRunners.ts:3709-3711`, distinct from static
`State.bias`). It SUPERSEDES the §9.1.6 options menu and **removes the K5
soft-dependency for the solo case** (the player-President adopts directly; CPU
handler #2 is still wanted for a CPU-President / Congressional adoption but is no
longer a HARD gate). It composes with #148 (`gild1868`'s 20-yr Reconstruction
timer + Solid-South sunset — same `game.reconstruction` block) and #57 (the onset
cascade). **Size: M–L within E3b.** game-mechanics §23.4.1.

**(B) #155 — war-balance pass: enemy-strength + battle-size + Officer-Mil cap +
per-theater scoring; EXTENDS the war engine (E3 / #56/#152), bounded by the
1772-RevWar-winnable floor.** Verified: the shipped resolver
`runPhase_2_7_2_Military` (`phaseRunners.ts:3593-3627`) is flat `milPower*10 + d100`
(`:3602-3605`) with `enemyPower = 1 + Math.random()*4` (`:3603`, a random
placeholder — NOT a real enemy-strength term), `warScore ±50` end (`:3615-3620`);
the generic `War` shell (`types.ts:1532-1546`) is single-`warScore`, no theaters.
`hd1`'s critique (BOTH human players + the GA, `POST 1000-1004`): the end-multiplier
is too high (changed LIVE 1.0→0.5), Officer-Mil dominates (a 5-Mil officer > all
other terms combined), there is no enemy-strength term, no battle-SIZE weighting,
and a −1 loss is too small; scoring was made per-theater LIVE. **The hard constraint
(`POST 1004`): do NOT over-harden** — the 1772 start fights the Revolutionary War,
which is a GAME-OVER on loss (`revolutionaryWar.ts`), so a harder engine risks
ending games before they begin; war "isn't the main focus." **Where it lands:** the
balance terms bind on the generic `War` model the war engine (#56) already builds —
**route enemy-strength through `rng.ts`** (this also closes the `:3603`
determinism leak, debt #2/#16). It PAIRS tightly with #152 (the batch-15 war-DEFEAT
loss package) on the same model. **Resolve the three cross-run OPEN QUESTIONS while
here** (all human DECISION-GATES, all tuning): the war-end multiplier (1.0 vs the
LIVE-adopted 0.5); the naval phase (a 3-naval-wins HARD gate per #56/Part 2 vs the
naval-then-land continue-roll chain `hd1` ran); the war-hero presidential bonus
(permanent +1-all-elections per Part 2 vs the one-term +1 `hd1` applied in 1864 —
this term also feeds the #18 election scorer). **Size: M within E3.** game-mechanics
§23.3.

**(C) #157 — CSA-government seeding: small; folds into the #58 secession + war
epic; needed for the CSA-victory branch.** Verified: no CSA government in code —
`startWar` (`phaseRunners.ts:2978-2981`) + `applyEffect` (`:3240-3253`) only spin up
the generic `War` shell; no CSA Pres/VP/cabinet/general seeding, no Secessionists
pool. `hd1` rules define only CSA Pres/VP/Sr-General (Pres = random among seceded
Command-holders; Comm-Gen = sole seceded Military-Leader); the GM improvised a full
cabinet "for flavor" (`POST 893-894`). **Where it lands:** a CSA-government seeding
spec (cabinet + multiple generals/admirals from the seceded Command/Military pool)
inside the #58 epic — required for vcczar's CSA-victory branch (`POST 2692`: seceded
pols removed, Unionists move to the nearest loyal state, eventual reintegration).
**Depends on the per-pol Southern-Unionist/Secessionist gate being built (also
unbuilt — DH-64). Size: S.**

**(D) DH-64 / #158 — `Southern Unionist` dataset audit: XS; joins the #120 dataset
umbrella.** Verified: `Southern Unionist` is NOWHERE in `src/` as a trait (the only
`Unionist` hits are the unrelated faction `fact_blue_unionist` "Unionist Democrats",
`factions1856.ts:7`, + a `// Blue Unionist` comment, `politicians1856.ts:43`). `hd1`
(`POST 1446, 2682`): Union-officer-settled-South, Black-Republican, and Northern-
residing-Southern draftees were UNlabeled → GM hand-fixed across the 1864/1868/1872
drafts. **Where it lands:** a `scripts/seedDataset.mjs` CURATED_ROWS audit (the trait
array, alongside the existing `'Nationalist'` tags at `:137-229`) + regenerate
`standard-draft-classes.json`, validated at dataset-build time. The trait READER (the
#58 per-pol secession gate) is separate engine work. **Size: XS** — slot into the
#120 dataset-umbrella pass (the `Southern Unionist` column on VA/MS/FL/Border
draftees).

**Does the DH-29 fix change priority?** DH-29 has been the named solo-blocker for
every antebellum/CW/Reconstruction-bearing scenario. With #156 now a **designed fix
in hand**, the Reconstruction epic (E3b) becomes **more attractive and less risky** —
its hardest open question (how does solo Reconstruction ever resolve?) is answered,
so E3b's readmission half moves from "design-then-build" to "build the authored
design." BUT E3b is still **downstream of the keystones** (it depends on the generic
war engine + K2 ActionRegistry, and enhances an already-shipped scenario rather than
unblocking the spine). So **the top of the queue is UNCHANGED: QW0 → K0/K2 → K3/K4 +
scenarioBoot → E1.** What changes is E3b's *internal confidence*: build the war
engine (#56 + #155 + #152) first, then the Reconstruction half (#57 onset + #156
4-plan model) with the solo-blocker already solved.

**Net for the planner:** DH-29 changes CATEGORY (CPU-only → structural; open-blocker
→ designed-fix) but stays inside E3b; #156 is the new highest-value Reconstruction
target (M–L); #155 is an M war-engine extension bounded by the RevWar floor, pairing
with #152; #157 is an S addition to the secession epic; DH-64 is an XS dataset audit
under #120. **No item leaves/enters the Decision-gated bucket** (the four cross-run
open questions are tuning, not blockers). **3rd Civil-War run + 5th antebellum
source → HIGH corroboration confidence** on the war/Reconstruction/secession
cluster. **Top of queue UNCHANGED.**

### 9.2 Major subsystems (do these after the keystones)

Slot the heavyweights. Within each row I call out the keystones it depends on so
the planner can build a DAG. **Bold = new or re-scoped in a later batch.** Rows
tagged **[NEAR-TERM, batch 3]** are cross-cutting items the modern thread
surfaced that should be pulled forward; rows tagged **[FAR-END, modern epic]**
are deep-modern subsystems that build last.

| Subsystem | Forum location | Size | Depends on | Notes |
|---|---|---|---|---|
| **Federalism era (`scenario1788` + content)** — mid-government boot, 10-faction roster + nickname relabel, era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events, Mod/Cons draft profile, federalism SCOTUS set | mechanics §20; `fed` | **L** | **BUG-1**, K1 (electionMethod for the per-state EC the era needs); benefits from K3 but does **not** block on it (see §9.1.1) | The **highest-value batch-2 epic**: it is the best-documented unbuilt era, sits between the two built scenarios, and exercises the most cross-era systems. Boot via the `scenario1856` template. Pulls in several rows below (generic war, per-state EC, amendments, bill typing). |
| **Convention machinery (2.9.2)** — multi-ballot loop, momentum, unit-rule, inter-ballot actions, VP-impact check, 5-plank platform + comparison, scandal rolls, faithless electors, host-advantage, PL-VP-override, post-election scoring, **CPU convention AI** | gilded §15.3; `fed` 231-247, 580-606; `hd` 3261-3290, 4646-4726, 5594-5713; **`drums` §25.4 (richest decoded subsystem)** (corroborated 5 eras) | **L–XL** | K0, K2, **K5** (the convention CPU = handler #5, the largest single handler) | Still the **single biggest unbuilt subsystem**. Replaces the `engine.ts:69` one-liner. **Batch 5 makes the CPU side concrete:** §25.4 spec'd per-ballot momentum + 10-action interballot menu + weighted-kingmaker rules-change vote + **ballot-10 compromise picker** (rigid highest→lowest order, no cross-faction coordination) + **ballot-25 dark horse** + Pineapple Primary roll + kingmaker-refusal-to-endorse list. **DH-8 must-own** (CPU acknowledged unstable, the "rough/awful, needs a 2.9 rework" surface) and **DH-17 must-own** (auto-drop-out after 2-3 ballots of 0 Momentum + Command-limited interballot actions — current behavior is 11-13 ballot deadlocks). Also DH-7 (R/D threshold asymmetry + Iron-Fist unilateral lower). Wire into `needsPlayerInput: 'convention'` (`engine.ts:9`). |
| **Governor's actions library (2.5.2)** — ~14 named actions, era-flavored, d100 vs 20·governing, per-action prereqs | gilded §11.3; **fed** 33-558 (corroborated, 3 eras) | **M** | K1, K2 | Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Actions read & write `State.policies` (K1). Era-flavored row sets are a per-era registry index. |
| **Executive actions library (2.8.1)** — persistent active actions, `Easily Overwhelmed` VP hand-off, green/yellow auto-deactivate-on-admin-change | gilded §14.1; **fed** 46-575 (corroborated) | **M** | K2; needs an **admin-change hook** (presidency change) for the auto-deactivate sweep | Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. Persistent state on `GameState.activeExecutiveActions`. `fed` adds the **control-handoff chain** (Incompetent Pres → VP → Manipulative advisor) with an undefined multi-manipulator tie-break (open Q). |
| **Diplomacy actions library (2.7.1)** *(batch 9: THE real modern foreign system — see §9.1.8)* — Increase Relations / Trade / Extend Credit / Provoke; per-power meters with era roster + renames | gilded §13.3; **fed** 45-572; **`nuke` §28.3** (corroborated 4 eras) | **M** | K2 (action shape); diplomacy shape already right (`GameState.diplomacy` is `Record<string, number>`) | `fed` confirms the **era-dependent power roster** (5 in federalism; 6 in gilded +China; Prussia→Germany 1871). **★ Batch 9 makes the MODERN action set canonical and elevates this to the real Cold-War foreign subsystem** (§9.1.8 / §28.3): **8 per-nation relation meters** (9-point Hostile→Allies; UK/France/Spain/Germany/USSR/China/Japan/Israel) + a **Provoke** action (retaliatory tariff/embargo, 1-2% war chance) + Sec-State-suggests/Pres-approves, one action per ambassador per phase. **Build holes to own: DH-46** (add **downward pressure** — the US ends up allied with everyone) + the **Cold-War ≤Neutral cap** on USSR/China; **DH-45** (the USSR-collapse trigger chain stalls at a ~5% gate → re-tune so it can fire). Couples to the national-surplus integer (Extend Credit / Take a Loan adds debt, gated on Rev/Budget). |
| **Generic cross-era war system** *(batch 9: this is THE engine the "Cold War" relabels — §9.1.8)* — multi-theater additive Chance-of-Success per battle: `Win% = Difficulty + Planning(SecWar/Navy+CoS/CNO) + Officer×10 + MilPrep + Benchmarks` (d100); per-theater WarScore with `WS ≥ +11` auto-win; war-end check `WarScore × 2 = %`; post-war defeat `\|WS\| × 2 × 10 = %`; officer KIA on natural-1; catastrophic 100/100; momentum bonus (+1/-2 turn-vs-turn); Major / Minor / Operation tiers with per-tier multipliers; **naval-N-then-ground gating per-war** (Mexico=3, WWI=2); **Treaty A-D tier with Basic-vs-Special routing by Admin** + 3-roll treaty chain (Pres → Sec State → Amb); confirmation cascade (defeated commander → Incompetent + fired → Senate-confirmation drama) | mechanics §21.1, **§23.3 (deepest spec, multi-confirmed)**; `fed` 222-573, `1772s` 20-60, `hd` I-1, **`drums` POSTS 123, …, 6928**; **`nuke` §28.2 (5+ wars, Korea/Cuba/Gulf/War-on-Terror)** | **M–L** | K0 (lots of rolls); **BUG-3** (no-PM-General fallback is in this blast radius) | **Divergence #6. Verified: only `src/engine/revolutionaryWar.ts` exists — NO generic and NO Cold-War engine; build ONE.** Generalize one `War` model usable in any era; the Cold War is THIS engine relabeled + content (§9.1.8). **The formula is canonical** (`drums` re-derives it across 5+ wars/4 eras; `nuke` confirms it across the Cold-War wars). **Design it multi-theater + tiered from day one** — the Civil-War row below is its Major-tier instance. Outcome grants/denies territory; **+permanent president +1-all-elections on Major victory**. **★ Batch-9 LOAD-BEARING holes (DH-47): wars NEVER resolve today** (the war-end roll's odds are so low Korea ran ~2 decades) → **build a real resolution/peace path** (couples to DH-12 white-peace), and **there are no army/navy/air branches** (army generals command navies, "naval" pols die in infantry) → **design the branch model.** Pairs with the A4 battle-card UI + the military-leadership tier (#49). **Build the K5 CPU touchpoints inside this epic** (commander selection, theater focus, surrender/peace decision); war-epic-internal, not separate handlers. **★ Batch-13 DH-61: the `War` model must be SEEDABLE AT BOOT** — `scenarioBoot` reads a start-year "active wars by start date" table and instantiates each as a running `War` (1788 → NW Indian War, 20%-loss / WS −2; `oopscpu#POST 338-344`). Expose a `War` constructor the boot pipeline calls; the seed-and-register pass itself is a thin S item that lands with `scenario1788` (§9.1.9). |
| **[1856-arc, batch 4/7] Civil-War combat engine + Reconstruction subsystem — COMPLETES the shipped 1856 scenario** — two theaters (3 naval wins gate land), per-theater WarScore (+10 auto-wins) + Major/Minor/Operation tiers, named-battle officer casualties, permanent-president-+1-all-elections on Union victory, **+ the batch-7 CW VARIANTS (#97): DomStab=1 early-trigger, President-defects-to-CSA, Hartford/Northern-secession variants, UK-intervention 3rd theater, guerrilla 4th stage, internal CSA government**; then Reconstruction status (occupied/military-gov/readmitted) + per-state readmission **bills (readmit-by-REPEAL, `rep1800` §C)** + time-boxed `+2-until-year` bias + strip-leaders/pardon laws + secession gating (`Southern Unionist`/Secessionists pool) + free/slave sectional-balance crisis | mechanics §23 (§23.1–§23.5); `hd` I-1..I-5; **`rep1800` §C (2nd CW campaign + the solo-blocker)** | **L** | **generic war (#6)** (this is its Major-tier instance), **K2** (Reconstruction readmission + the 3-plan exec action are ActionRegistry rows), the bill pipeline (readmission bills), `State.isSlaveState` (`types.ts:1329`, **per-state flag EXISTS**) + `SLAVE_STATES_1856` (`types.ts:1152`) for the sectional crisis; **for the SOLO-BLOCKER fix: K5 + CPU handler #2 (option 1) OR K3's condition-driven `advanceEra` (option 3, era-boundary auto-resolution)** | **★★ BUILD REQUIREMENT (batch 7 / DH-29): the Reconstruction half is UNWINNABLE solo without a CPU-passable readmission path.** GM-verified (`rep1800` POST 9170) the Strict/Ironclad plan can NEVER pass with CPU factions → **the epic delivers an unwinnable scenario unless E3b ships option (1) a CPU default-vote bias for the flagged historical plan, (2) a guaranteed-pass crisis path, or (3) an era-boundary auto-resolution** (my rec: 1+3). See §9.1.6. **Otherwise: place EARLY-ish — after #6 + K2, does NOT wait behind federalism or the deep-modern tail.** Rationale: unlike federalism (a *new* scenario), this **enhances the already-shipped 1856 scenario** (`scenario1856.ts`, era `nationalism`), whose spine dead-ends at the Trent Affair (1861). Secession (#58) + the sectional crisis (#59) are cheap additive parts that can land first as the antebellum payoff; the two-theater war (#56) + Reconstruction (#57) are the heavy parts. The **readmission half should land AFTER K5 handler #2** (for the solo-blocker fix) or carry the era-boundary auto-resolution as its self-contained fallback. See §9.1.2 + §9.1.6. |
| **[1856-arc, batch 4; batch-11 E10b; ★ batch-13 reconciled] Succession / eligibility / acting-president** — configurable bill-mutable line of succession; native-born vs foreign-born presidency gate (relaxable per #60 Canada); an acting-president state whose `command` (often 0) gates exec actions / SCOTUS-compel / re-election; era-keyed VP-vacancy-fill amendment | mechanics §24.1, **§29.9**, #61; `hd` I-6; **`arkzag` ch27; ★ `oopscpu#POST 324-329`** | **M** | the amendments item (#39, VP-vacancy fill); ties to the cabinet/leadership pipeline (the death-branch re-runs the leadership IRV — handler #3) | **An election-system / constitutional addition.** `vicePresidentId` exists (`types.ts:1568`) but no eligibility gate, no configurable line, no acting state — and death only sets `presidentId = null` at `vacateOffice` (`phaseRunners.ts:2446`), with NO succession engine. **★ Batch-13 reconciles the death-vs-incapacity SPLIT (Ted-RULED, designer-authoritative, supersedes the `arkzag` read for the death case):** a Presidential **DEATH** → VP becomes the **FULL President** (refuses "Acting", **NO action-divert roll**), is **NOT auto party/faction leader** → **re-run the leadership IRV** (handler #3) to pick a new PL (matches `nuke` #112 unelected-succession). The `arkzag` **acting-president + action-divert** read is now **SCOPED to the distinct incapacity / 0-Command-inert / foreign-born-ineligible cases ONLY**. So E10b carries TWO branches: **death → full President**; **incapacity → acting (Command-gated / trait-diverted)**. Best landed *with* the convention/election work — the foreign-born gate also constrains convention Major candidacy. Folds DH-3 (career-track pols can't run for President) + #105 (stat-collapse → forced resignation). |
| **[1856-arc, batch 4] Contingent House election + tied-chamber inverse control** | mechanics §24.2, #62; `hd` I-7 | **S–M** | the EC tally path (`calcStateVote('presGeneral')`, `phaseRunners.ts:3752`) | **Election-system addition.** On no EC majority: 1-vote-per-state by House-delegation majority (Governor-party tiebreak), Senate elects VP; **pick a stated cutoff** (DH-6: config `contingentTopN` top-2 vs top-3) + the tied-chamber inverse-control rule. Slots into the same tally code as per-state EC method (#5). |
| **Offices created in-game by law (institutional layer)** *(batch 4 / **batch 8: confirmed FOUNDING→MODERN**)* | mechanics §24.6, #66/#101; `hd` I-11; **`new1772` §24.6 (founding offices-by-law)** | **M** | **K2** (offices created by exec action/bill are ActionRegistry-adjacent); the cabinet-retention refactor (#25); shares its substrate with divergence #15 (dynamic seat list) | **Generalizes the cabinet beyond `cabinetSeatsForYear`** (`types.ts:1196`, year-keyed/fixed today): model offices as data **created/destroyed by bills + exec actions** with their own terms/eligibility/decline/Command-grant rules. **★ Batch 8 makes this an END-TO-END theme, not a Gilded/Progressive-only need:** Gilded/Progressive adds Fed Chair / CoS / CNO / FBI Director (incl. create-Fed-deactivates-Independent-Treasury); **founding (`new1772`) stands up SCOTUS, the Bank-of-US (→ President-of-Bank seat), Dept of Navy (→ SecNavy), the AG, academies/Mint/Marine-Corps ALL by in-game bill** — the founding era is *defined* by offices-not-existing-until-legislated. Pairs with #49 (military-leadership tier) + #25 (retention) + the divergence-#15 dynamic-seat-list refactor (same substrate). **Note DH-40: the SCOTUS-establish + set-count two-bill pattern can STALL the game if the count bill fails — guard it here.** |
| **Per-state presidential-election method + the 12th-Amendment mode toggle (+ ★ batch-13 DH-62 pre-12A EC mode)** — `State.electionMethod`/`electorsByLegislature` resolved from seated-legislature majority (Gov breaks ties) for legislature-states; **a pre-12A global `conventionsEnabled = false` gate**; **a pre-12A two-votes-per-state / NO-ticket EC ballot mode (DH-62)**; flip per-state by event, globally by amendment / the "Nationwide Surge" event | mechanics §21.2, **§27.3 (#93, the before/after state machine)**, **DH-62**; `fed` 194-373; **`rep1800` §A; ★ `oopscpu#POST 192-199`** | **M** | K1 (the field), amendments (global flip), conventions (the gate disables §15.3); **the `scenarioBoot` pipeline (DH-62 is a 1788-boot prerequisite)** | **Divergence #5 + batch-7 #93 + batch-13 DH-62.** Diverges from `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`), which resolves *every* state by PV+dice. **Correction: the shipped `senatePre17` context (`types.ts:701`) is NOT a legislature-majority tally** — it's the same `calcStateVote` formula with a different `ctx` tag (`phaseRunners.ts:3896`); so `electorsByLegislature` needs a **genuinely new resolution branch** (award EV by seated Gov/Senate/Rep party majority, recomputed after the popular tally). **★ Batch-13 DH-62 adds a SECOND new resolution branch — the pre-12A two-votes-per-state, no-Pres/VP-ticket EC mode** (each elector casts two votes; top EV = President, runner-up = VP; no separate VP ballot) + the **same-state-EV exclusion** (two candidates from one state can't both take that state's EVs, `oopscpu#POST 197`) + the throwaway-tie defense via the §25.1 pre-12A nomination trio (handler #1). It is an **era-keyed election-mode variant** for 1788/1792/1796 and is a **HARD prerequisite for `scenario1788`** (the all-CPU run exercised it across all three EC rounds). Federalism + the early Republicanism band both *need* the legislature-chosen branch too (CT/GA/MA/NJ/NY/SC pre-12A, decisive). The 12A also **gates the convention machinery + separate-VP rules** (§27.3). Best landed *with* the federalism/early-republic epic — DH-62 lands WITH the `scenario1788` boot. |
| **Constitutional amendments durable state** — `GameState.amendments`; **cross-state ratification vote** (can fail); bill-of-amendment type; effects on term-length / popular-vote-everywhere / VP-vacancy / suffrage / court-size; **era-keyed + in-game-tunable ratifier + threshold** (#64) | mechanics §21.3, **§24.4 (#64)**; gilded + `fed` + **`hd`** (corroborated 3 eras) | **M** | K0; K4 (era-keyed table) | Sharpened across batches: the **ratification vote** + **failure case** (batch 2), and **batch 4: the ratifier + threshold are an ERA-KEYED, bill-changeable field** — 1856 = 2/3 of both chambers then **3/4 of state GOVERNORS**; Gilded default drops to 2/3 of states; a passed amendment can change the threshold (options table → faction-enthusiasm side effects). Plus a **SCOTUS-ruling-gates-a-bill-class-until-amendment** hook (*Pollock* → no income-tax bill until ratified) couples to #52. Couples to per-state EC (#5), firing-precedent, succession (#61). Gates BUG-2. |
| **Bill typing + budget-gated spending cap** — `Bill.type` (Foundational/Spending/Crisis); numeric per-turn spending budget gating non-crisis spending bills at the floor; crisis-bypass; cabinet free-proposal slot | mechanics §21.6; `1772s` B4, `fed` 159-703 (corroborated) | **M** | K0; **national-surplus integer** (the cap reads it, not the ordinal `revenue`) | New `Bill.type` tag (none today, grep-confirmed). A bill can pass the floor and still be "BLOCKED DUE TO BUDGET." Prerequisite for crisis bills and the Hamiltonian financial program. |
| **Bill-driven statehood + unorganized-territory gating + auto-generated officials** — statehood/territory bills → `admitState`; event/war annexation; **generate filler pols** for sparse new states; a **`Territory.organized: boolean` ORGANIZE→ADMIT two-step**; a **draftability/relocatability gate** excluding un-owned/unorganized-territory pols; Class-I/II/III senator-rotation assignment + EV join on admission; sabotaged-enabling-vote → +1-bias seed | mechanics §21.5, **§27.5 (#95, the organize→admit pipeline)**; `fed` 81-718; **`rep1800` §A/§B/§C** | **M** | bill typing (the bill route); generic war (war annexation); **BUG-3** shares the auto-generate-officials need; **the territory-gate is the SAME predicate as §9.1.5's content-gate** | `admitState` (`territories.ts:8`) exists, is idempotent, invoked only from 1772 era-event `postEffects` today. **Batch-7 adds the two-step** (land you own but haven't *organized* has undraftable/unrelocatable pols until an organizing bill passes — LA-Purchase land, Michigan) + the draft-pool filter for unorganized-territory pols. Some admissions skip the territory stage (ME/WV/TX-from-Republic/VT/CA + the 13 originals). Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories this way. |
| **[early-republic, batch 7] Slavery-as-state-flag + Cohens-v-Virginia amendment-only abolition** — bind existing `State.isSlaveState` to the **Plantation industry**; abolition counts only when the flag is **off in all states** + deactivates all slavery legislation; a persistent **`Cohens v. Virginia` SCOTUS rule-modifier** disallowing *legislative* abolition where the flag is set (only an Amendment or per-state Gov action clears it); all new states enter free; **the AMPU-2 need: reverse an ahistorical ruling via amendment** | mechanics §27.4 (#94); `rep1800` §A/§B | **M** | the SCOTUS docket (the rule-modifier rides it; gates the legislation epic); the amendments item (#39, the only legislative way to abolish); #58/#59 (sectional) | **★ SMALLER than the brief assumed — `State.isSlaveState: boolean` ALREADY EXISTS (`types.ts:1329`)**, is per-state, populated in `states1856.ts`, and even set by the statehood path (`phaseRunners.ts:3175`). NET-NEW is (1) the abolition-toggle-off + Plantation-industry binding (Plantation→Agriculture 2:1, §23.4), (2) the persistent `Cohens` rule-modifier on legislation (a SCOTUS-ruling-gates-a-bill-class pattern — same shape as the *Pollock*→income-tax hook in the amendments row, couples to #52), (3) the reverse-an-ahistorical-ruling mechanism (no such thing today; SCOTUS rulings are otherwise irreversible — §19.1). The substrate for the WHOLE early-republic/antebellum sectional design. |
| **[early-republic, batch 7] Second Bank recharter clock + Bank War exec action** — `game.secondBank?: { charteredUntilYear }`; a Crisis Bill **creates the President-of-US-Bank cabinet seat** (the dynamic seat list, #89) + marks it **unremovable while the Bank exists**; a **"Remove Deposits → State Banks"** exec-action that kills it; **20-year recharter clock**, lapses unless re-chartered | mechanics §27.6 (#95); `rep1800` §A | **M** | **K2** (the exec-action library); the **dynamic cabinet seat list (#89, the boot-seed refactor)**; the **offices-by-law layer (#66)**; bill typing (Crisis Bill) | **NEW stateful economic subsystem** — the central-bank-as-toggleable-office. Generalizes the offices-by-law layer (#66) with a recharter clock those offices didn't have. The President-of-US-Bank office is **unremovable while the Bank exists** (a same-faction / firing-precedent-adjacent guard — cf. §21.4's US-Bank-President same-faction note). The clock + the "Remove Deposits" exec-action together **killed** the Bank in `rep1800` (historical Bank War). The Democracy band's defining institution; mostly a federalism/early-republic-era need. |
| **Legislative micro-mechanics** — committee block-and-replace, bill packaging, filibuster (law-toggled), `(Crisis)` tag | gilded §12.4-§12.7; **fed** 159-730 (corroborated, pervasive) | **M each** | K0 (filibuster is a roll); committees already exist; crisis bills need the bill-type tag | 4 independent PRs. `fed` clarifies filibuster is a **standing rule toggled ON by a law** ("Institute Filibuster", 1792) and packaging has a **won't-bundle-net-negative-unless-statehood** rule. |
| **Era-event extensions** — multi-decider events, foreign-territory grants en bloc, census-driven EV deltas (decade N, effect N+2), state-policy side-effects, Egghead-cabinet advisory | gilded §10.4; **fed** 29-702 (corroborated) | **M** | K1, K3 | `Predicate` tree extends well (§2.1.1). Multi-decider widens `EraEvent.decider`. Census deltas need a `pendingEvDeltas` queue applied in 2.10 on `year % 10`. |
| **Cabinet & leadership richness** — region-coverage + diversity + intra-party-equity malus, state-status eligibility guard, Ministers-to-foreign-powers seats (era-keyed), Congressional 9-role pipeline (RCV whip races, committee-eligibility-by-prior-service, incumbent-protection-when-dominant, CPU auto-fill), faction-leader 6-criterion cascade + anointing | gilded §28-32; **fed** 3-681; **modern** 167-1873 (corroborated 4 eras) | **M–L** | K0 | `fed` + `modern` confirm the 9-role pipeline (six-ballot Pro Tem race; modern CPU auto-fill). The **6-criterion faction-leader cascade** is spec'd verbatim (`1772s`/`modern`). Ministers roster is era-keyed. **Includes the cabinet wipe→retention refactor — see next row.** |
| **Cabinet retention replacing the wipe (divergence #8 — CORRECTED) + dynamic seat-list refactor (divergence #15, batch 6; CREATE-AND-ABOLISH, batch 9)** — remove the unconditional cabinet clear at `phaseRunners.ts:3804-3812`; retain occupants (modern: keep ≤5, CIA/FBI exempt), add per-officer tenure (CIA/FBI/Fed-Chair/Key-Advisor terms) + `firingPrecedentSet` gate on *replacement* + same-faction US-Bank guard + opp-party cap. **Batch 6: `cabinetSeatsForYear` (`types.ts:1196`) becomes the BOOT SEED only.** Introduce `GameState.cabinetSeats: SeatSpec[]` populated from the shipped function at boot; runners read the mutable list. Add `Legislation.createsCabinetSeat?: SeatSpec`; bill-sign handler appends the payload. **★ Batch 9: ADD THE ABOLISH PATH** — `Legislation.abolishesCabinetSeat?: SeatSpec`; the seat list must support **removal**, not just creation. | mechanics §19.1 #8, §21.4, **§26.5 (#89/#15)**, **§28.5 (#112, create-AND-abolish)**; `fed` 41-547; `modern` 587-2172; **`pop` 699, 1100**; **`nuke` §28.5** (DOE/DHS created; **Postmaster General ABOLISHED**; HEW split into HHS+Education) | **M** | cabinet richness (shares the code) | **Batch-3 correction.** Wipe→retention refactor, **M not S** (debt #17). Net behavior today: cabinet churns from scratch every 4 years — the *opposite* of forum intent. **Batch 6 folds in the seat-list-as-mutable-state refactor.** **★ Batch 9 confirms offices are created AND ABOLISHED by ordinary law END-TO-END (founding→modern)** — verified `cabinetSeatsForYear` still year-keyed (`types.ts:1196`); the year-keyed model is WRONG at both ends of the timeline. Pairs with #66 (institutional layer) + the legislated-SCOTUS-size row (§28.5). |
| **Cabinet confirmation system (DH-23 / batch 5)** — add the Senate confirmation step (committee → floor); default-AYE baseline with low-% opposition reject (the lost rule); Iron-Fist Maj-Leader auto-AYE-own-picks (the §25.5.2 designer ruling); replace lobby-maximizer with **Admin-weighted lobby-maximizer**; 50/50 Admin-1 trap fix; PPT-5-alternatives auto-confirm chain after failure | mechanics §25.5 (DH-23); `drums` POSTS 867-876, 1607-1626, 4702-4708, 4896-4900 | **XS-S** | cabinet richness (the seat-pick) + cabinet retention (above) + **K5 handler #4** | **The 36% pass-rate bug DOES NOT EXIST in the shipped engine because the *system* doesn't exist.** `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step scored pick that goes straight to `cabinet[seat] = pick.id` + `addLog("confirmed")` (`:2191-:2198`) — no committee, no Senate vote, no NAY/AYE roll. **So the fix is "build it in the right shape from day one"**, not "patch a broken system." **Smaller than the digest implies.** Lands as a quick win on the engine track once the cabinet pipeline is touched (after retention). |
| **Faction-personality 5-step distribution + per-era card pool + draft profile** | mechanics §7.4; `1772s` B9 (algorithm) + gilded/`fed` (drift) | **M** | K3/K4 (era enum for per-era pool + draft profile) | `1772s` supplies the **full 5-step allocation** (adjacency rule, ≥5-pol top-up floor, lobby-activation-by-event) the gilded thread only saw as drift. Implement *alongside* the existing card-swap drift, not replacing it. |
| **Faction nickname / per-era relabel table** | mechanics §16.1.3, §20.2; **fed** 2-184 (dense) | **S–M** | K4 | `Faction.nickname` exists (`types.ts:1297`); nothing updates it. Authored names table per (party, era, ideology) gated by leader traits + player-edit override. Also `Party.formedYear`/`eraName` for party-formation events (federalism §20.5). |
| **Small consistency PRs** — old-age stat decay (separate from mortality), defeated-incumbent auto-retire (amendment-gated 6yr malus), auto-Carpetbagger (10yr expiry, alt-state moves exempt from cap), national-surplus integer, industry-leadership scoring, tariff integer + change-cadence | gilded §F; **fed** 52-331, `1772s` 3-90 (corroborated) | **XS–S each** | mostly — (surplus/industry read existing fields) | A grab-bag of cheap consistency wins. The **national-surplus integer** and **tariff integer** are prerequisites for the spending cap and the gilded/federalism economic axes respectively. |
| **[NEAR-TERM, batch 3] Meter-model generalization + APOCALYPSE endgame clock** — banded-text ladders over the existing 7 `NationalMeters` fields + crisis entry/exit by tier + cascade rules + top-of-ladder effects (Honest-Gov't-maxed kills Machines) + numeric debt integer + `metersToElectionBonus()` from the canonical "State of the Meters" table. **Batch 6 addition: the meter-driven endgame clock** (divergence #14 / #88) — `GameState.endgameClocks: { meter; threshold; remainingYears; startedYear }[]` + arm/disarm/decrement in `runPhase_2_5_1_Lingering` + a termination path firing `game.gameEnded` when `remainingYears` hits 0. | mechanics §22.1, §22.2, **§26.4 (APOCALYPSE)**; `modern` 12-2230 (corroborated 4 eras); **`pop` 542, 548 (the canonical 10-yr Planet Health instance)** | **M** | K0; national-surplus integer (= the debt field); the meter-bank ladders (the threshold reads a band) | **It's a WIDENING, not a relabel** — the bank maps 1:1 to shipped fields (§2.1.1). Do the ±3-clamp (the **meter-model divergence**, §9.3 (meter)) here cheaply; the crisis/cascade rules benefit every era. **The APOCALYPSE clock is meter-agnostic** — Populism's 10-yr Planet Health countdown is one configured row per era; analogous bottom-tier clocks may exist for other meters/eras. **BOTH endgame paths share `game.gameEnded`** — the meter-clock and the `triggersGameEnd` event path terminate cleanly through the same sink. The full labeled-ordinal *presentation* relabel can ride the presentation track separately. |
| **[NEAR-TERM, batch 3] Procedural pol generation (scaling wall a)** — a runtime, seeded generator emitting `ImportedDraftee` rows when the real dataset is dry; stat/ideology/trait/demographic distribution + plausible-ethnically-varied **toggleable name engine** | mechanics §22.11, #43, A1; `modern` 456-1771 | **M–L** | K0 (seeded RNG); reuses `instantiateDraftees` (`phaseRunners.ts:114`) | **Needed for ANY late-era play** (dataset runs out) AND for sparse-state filler (#43) AND BUG-3 stopgap. Lives in `src/engine/`, sibling-in-spirit to the `scripts/` pipeline (§7) but runtime. **The bridge to the portrait epic (A1/P2)** — generated pols need procedural portraits. |
| **[NEAR-TERM, batch 3] Persist + auto-fill House slates & committees (scaling wall b)** — store House candidate slates + committee rosters on the snapshot; carry-forward + bulk auto-fill by default | A9, mechanics §22.10; `modern` 115-1281 | **M** | repair() backfill for the new fields | **UX wall, not modern-only** — improves 1856's 31-state congress too; a player quit over the manual tedium at 53-state scale. The "computer owns the deterministic tedium" theme (also 1772-solo Lingering/Committees/Cabinet). Do **before** the deep-modern roster. |
| **Design-divergence resolutions** | mechanics §19.1 (#1–#17) + the meter-model item | varies | depends per item | See §9.3 — call per item. **Batch-5: #10 (contingent-election rules — author before build), #11 (veto override 2/3 both chambers — forward-only), #12 (midterm uses full meter+enthusiasm — verify), #13 (CPU AI architectural gaps → §25.15). Batch-6: #14 (APOCALYPSE meter-driven endgame → Phase-1 #6), #15 (dynamic cabinet seat list → E16), #16 (amendments toggle capabilities → K2 from day one), #17 (state roster keyed to `{era, startYear}` → K4).** |
| **[CPU-AI EPIC, batch 5] CPU handler suite (15 handlers, one PR each)** — the §25 spec'd subsystems wired against K5's scaffold; lands as a series of lightweight per-subsystem PRs once K5 ships (see §6.6.1 handler-order table) | mechanics §25 (15 subsections); `drums` (7540 posts, all-CPU) | **~15 × S–M** (each handler 50-200 lines) | **K5 scaffold** + K0 (seed) + K2 (registry); handlers 11/12 also need the architectural-gap persistent state K5 introduces | **DH-8 explicit-heuristics resolution.** Each handler replaces an inline stub or a missing piece in a phase runner. **Parallelizable**: once K5 lands, multiple handlers can land concurrently across contributors. **Order within the epic is in §6.6.1's handler-order table** — start with candidate selection (cheap, blocks nothing), then legislation NAY/AYE/NAY, then leadership IRV (most-corroborated), then cabinet confirmation (DH-23), then convention CPU (DH-8 marquee, biggest single handler). The three architectural gaps (DH-20/21/22) are handlers 11/12/7 — they land **after** the persistent state is exercised by simpler handlers (validates the scaffold). **Includes the cabinet-confirmation system itself** — see §9.3 #14. |
| **[CPU-AI EPIC, batch 5] Iron-Fist trait split (§25.9 / debt #25)** | mechanics §25.9; `drums` POSTS 2511, 2784, 3241, 3660, 4896-4900, 5353, 6293, 6471, 6568, 6703, 6852, 6881, 6907, 6912, 6922, 7012, 7224, 7364 | **M** | independent of keystones — the trait system shipped in PR4–PR6 | **Designer-flagged.** Split `'Iron Fist'` into ≥6 office-keyed traits. Touches: 4 governance rows (`types.ts:1043-1047`); 3 era-event multiplier readers (`phaseRunners.ts:2915,:2931,:2959`); the 6 grant-callers in §25.9 (PL+Honest-Gov-maxed gov control, Sen Maj Leader vote forcing, President officer-fire / SCOTUS-compel / challenger-stifle, Loans-from-Wealthy + IF PL gov takeover, Convention PL unilateral threshold, mid-war military replacement). `repair()` migrates `'Iron Fist'` → all child traits (over-broad but safe). **Independent of K5** — can land before or after the CPU handler suite; the trait readers are existing code, not CPU heuristics. |

**[FAR-END, modern epic] — these build LAST (deep-modern era; depend on most of the above):**

| Subsystem | Forum location | Size | Depends on | Notes |
|---|---|---|---|---|
| **Modern era (`scenario1948` Cold-War boot + continuation + `scenario2012` fresh-boot + content)** — the modern faction roster + nickname menu, modern era-event spine (fictional bands: **Nuclear Age 1948–2000 → Era of Terror 2000–~2012 → Era of Populism 2012–2024**; **NO "Era of the Future" — undocumented everywhere, do NOT scope it**), modern bill/issue catalog (tariff-power-to-President, healthcare, climate, gun control), modern card pool. **Batch 6: TWO modern scenarios.** **★ Batch 9 (`nuke`) adds a THIRD documented boot — `scenario1948`, the Cold-War mid-government boot** (a fourth `BootSheet` shape alongside 1772/1856/2012): Truman/Barkley seated, **48 states** (AK/HI arrive as statehood bills), 5R/5B with **Dixiecrats INSIDE Blue + Reagan-a-Democrat** (the realignment start), the full modern + Cold-War cabinet (CIA/FBI/UN/Fed/NSA/Key-Advisor + 8 ambassador nations incl. **Ambassador to the USSR**), a ~6-yr era→year clock offset. The Populism boot is the **canonical fresh-modern instance** of the `BootSheet` schema (K4): 10 pre-built factions (B1-B5 / R1-R5) + era-tuned decks (R1 = "Trumpism" deck) + 50+DC + Obama/Biden + 9-named SCOTUS + EXPLICITLY EMPTY at boot. | mechanics §22, **§26.1-26.2 (the boot sheet itself)**, **§28 (the 1948 boot + the full Cold-War/modern systems)**; `modern` (2276 posts); `pop` (1172 posts); **`nuke` (12,228 posts — the largest corpus, the predecessor of `modern`, joined at the 2004 election)** | **XL** | K3, K4 (+ enum: `modern` reachable + the `BootSheet` schema + per-`{era, startYear}` state roster), and most subsystems below + **DH-25 career-track bootstrap rule must be authored before this ships** + **the modern dataset slice needs a curation + parity pass (DH-51 overpowered modern pols)** | The richest unbuilt era, but **dead last** — depends on the meter bank, enthusiasm engine, primaries, convention, SCOTUS, war, diplomacy, and the scaling walls all landing first. **★ Batch 9 confirms the KB spans a CONTINUOUS 1772→2020 timeline** (this 1948 thread is the chronological predecessor of `modern`). Reached via `advanceEra` (continuous campaign) or a `scenario1948` / `scenario2012` boot. **The Cold War is NOT a subsystem here — it is the generic war engine relabeled + diplomacy + content (§9.1.8).** The first primary in a fresh-boot uses the generic-Major-candidate fallback (§26.1). |
| **Presidential primary subsystem (2.9.1)** — candidate eligibility + blocking (Iron-Fist PL), focus-state trait table, Strength score, per-group debate/scandal/broke/action loop, delegate accumulation + transfer | mechanics §22.3; `modern` 340-1704 | **L** | K2 (primary actions), the **CPU delegate engine**, K0 | NEW (modern-only). Phase 2.9.1 + `presPrimary` context exist; no loop. A `needsPlayerInput: 'primary'` discriminant + a `primary?` runtime ledger. Pairs tightly with the convention subsystem. |
| **Enthusiasm / Party-Pref engine + Score economy** — the 4-part reshuffle after legislation scoring; `Faction.score` ledger; era-end awards; lowest-faction penalty | mechanics §22.2; `modern` 96-2039 | **M–L** | the meter-model generalization (above); K3 (era-end awards) | NEW driving algorithm over the existing `enthusiasm`/`partyPreference` tables. The spine of the modern election engine. |
| **SCOTUS named-Justice docket (divergence #7)** — per-term case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, Iron-Fist/Manipulative compel-vote + compel-retire (12-yr min, conditional bargain), dynamic court size + court-packing (age-70), 64/60% confirmation + moderate-auto-confirm recovery, appointee ideology reveal + 10-yr drift (**25/10/5 mid/left/right; Puritan blocks** — §25.14/#79) | mechanics §22.7, **§25.14 (#79)**, #52; `modern` 30-2250; `drums` POST 7533; **`nuke` §28.5** (legislated court size) | **M–L** | K0; amendments (gates BUG-2 `Chisholm`); bill-typing (court-packing/set-count bills); **K5** (Justice vote + compel + drift = CPU handler #14) | **From-scratch over a stub** (debt #18) — the shipped court is 4 hardcoded titles + `partyPreference ±0.1` (`phaseRunners.ts:3398-3414`). The **10-yr drift table is now canonical** (25% mid / 10% left / 5% right / Puritan blocks). Case content is per-era data. **★ Batch 9: court size is LEGISLATED and variable** (§28.5 — "Set SC to 10/5", court-packing-when-one-turns-70) with **excess justices NOT replaced** until the bench drops below the legislated cap (court legislated DOWN to 5 while physically holding 9-10) — add a `courtTargetSize` field + the excess-not-replaced semantics; rides the bill-typing path (#42). **Pairs with K5 handler #14** for the per-case vote heuristic + Iron-Fist compel. |
| **Third-party challenge trigger (2.9.3)** — party-pref-band + ideology-discontent check → spawn an independent ticket from the rule-selected faction; nationwide ballot for a Celebrity | mechanics §22.4, #48; `modern` 400-2116 | **M** | the enthusiasm/Party-Pref engine | NEW (modern). Two-party engine only today. Phase 2.9.3 exists (`phases.ts:41`) as a stub. |
| **Military-leadership appointment tier** — JCS/Army/Navy chiefs + Generals/Admirals above `GeneralInChief`; auto-confirm; promotion back-fill; rank-mismatch + resign rules; feeds the war engine's per-battle modifiers | mechanics §22.9, #49; `modern` 214-2182 | **M** | the generic war system (#45); cabinet richness | NEW (modern). Pairs with the generic-war epic — the ranks feed its Chance-of-Success terms (SecDef + Joint-Chiefs ×2, leading-officer ×10). |
| **53-state roster + Wyoming-Rule apportionment + two-home-state pols + state-roster-by-boot-year (divergence #17)** — modern 53-state roster (DC/CU/PR); decennial recompute that resets EV + `bias` + focus-Rep; `Politician.homeStates?`. **Batch 6 addition: the SAME `modern` enum needs BOTH a 50+DC fresh-modern boot roster AND the 53-state Wyoming-Rule continuation roster.** The 53-state alt roster is the **product of 60 yrs of `modern` annexation events** in the continuation; a fresh-modern boot starts at 50 + DC (`pop` POST 264). K4 keys the registry on `{era, startYear}` (or `scenarioId`); annexation chain mutates `snap.states` at fire time via `admitState` (`territories.ts:8`). | mechanics §22.10, **§26.1 (boot-year keying)**, #55, #34; `modern` 185-2240; **`pop` 264** | **M–L** | census-delta queue (batch 1); **scaling wall (b)** must land first (House bloat); **K4** (registry keys on `{era, startYear}`) | NEW (modern). `State.region` is partly ready (`types.ts:1322`). The Wyoming-Rule House size is *why* scaling wall (b) is a hard prerequisite. **Batch 6 makes the per-`{era, startYear}` roster keying explicit** — same `modern` enum, two different rosters depending on whether the player booted from `scenario1948` (continuation) or `scenario2012` (fresh-modern). |
| **Modern legislative depth** — collective crisis-bill accountability, bill-relationship/replacement graph (amendment-tier bills repealable only by amendment), investigation special committees (#54 — **now READY**), Executive-Branch-Interference | mechanics §22.8, **§24.5 (#54/#65)**, #12b; `modern` 32-2265, `hd` I-10 | **M** | bill typing; committees; **DH-1 still needs rules authored** | Mostly extends the legislative micro-mechanics. **Batch-4 change: #54 (investigation committees) is now BUILDABLE — `hd` authored the concrete spec (#65, §24.5): Speaker-formed Chair+Ranking+3 → 5d6 + 4 modifiers → 21–25 = guilty (resign + cabinet ban), targets the dominant party.** No design task remaining for #54. **DH-1 (filibustered MUST-pass remedy) is STILL under-designed** — author the deadlock rule first (debt #21). |

### 9.3 Design divergences — keep shipped or refactor to forum?

Rules where the forum and the engine genuinely disagree (mechanics §19.1, now
**#1–#21**, plus the separate meter-model item). These are **decisions, not
feature-adds**. My defensible call per item. **Numbering matches mechanics §19.1:**
#1–#3 batch 1, #4–#6 batch 2, #7 (SCOTUS) and #8 (cabinet) batch 3, **#9
(relocation cap) is batch 4**, **#10–#13 batch 5**, **#14–#17 batch 6**,
**#18–#21 batch 7**; the meter model is its own unnumbered item (mechanics
§21.8). **#9 is also BUG-0.** **#13 is structural** — it points at §25.15 (the
architectural CPU-AI gaps) and is the call to make K5 a keystone. **#14 is the
NEW endgame model** (meter-driven APOCALYPSE clock — Phase-1). **#15-#17 are all
refactor calls that fold into existing planned work** (E16, K2, K4 respectively).
**#18 is the batch-7 era-model reframe — the biggest one — but it folds into
K3/K4** (it is a refinement of the keystone specs, not a new keystone; see
§9.1.5). **#19 (ideology-as-circle) is a foundational refactor behind an
era-gated flag** (§9.1.7). **#20 (legislature-chosen electors) extends #5.**
**#21 (procedure-bills-bypass-veto-misrouted, DH-31) is a small verify-and-fix.**

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
| **9** | **Relocation cap** *(batch 4 — the clearest "forum drives the build" case)* — shipped: `RELOCATION_ATTEMPTS_PER_TURN = 5` (`types.ts:247`). Forum: the designer changed it to **4** non-alt-state attempts mid-thread and it went **LIVE in the running playtest** (`hd` POST 7062–7066, 7555); alt-state moves are exempt. | **Refactor to forum (lower to 4) — immediately.** It is a settled, dated design change (the digest says it went live, not mid-thread flux); the browser engine simply hasn't caught up. The one-line constant edit is BUG-0. The full auto-Carpetbagger + 10-yr-expiry + alt-state-exemption feature is divergence #2 / a separate consistency PR. | Not a balance debate — a stale constant lagging a shipped design decision. **Direction = lower to 4.** **Size: XS (the constant). Risk: none** (tunable const, not a save field). |
| **(meter)** | **Meter model** *(batch 2 §21.8, sharpened by batch 3 §22.1, corroborated by batch 4 §24.7, batch 5 confirms the ±3 cap is live)* — shipped: 7 numeric meters `[-5,5]` (`NationalMeters`, `types.ts:1399`). Forum: named/banded-ordinal meters + a **±3-per-phase swing cap** + crisis/cascade + numeric debt + a war-score meter. **Batch 5 (`drums` POST 4574)** confirms the ±3 cap on per-phase ideology swings is now a live designer patch (#80) — extends from cabinet to all ideology swings. | **Split the decision.** **Do now (cheap, orthogonal, near-term):** the **±3-per-phase clamp** (now confirmed live, applies to ideology + cabinet swings — apply at a single clamp helper around the writers) + the **crisis entry/exit + cascade** rules. **Defer (presentation):** the labeled-ordinal *relabel*. The war-score meter rides the generic-war epic (#6). | The ±3 clamp is now confirmed-live; no model change. **Size: XS (clamp) / M (crisis+cascade) / L (relabel). Risk: low / low / medium.** |
| **10** | **Contingent-election rules** *(batch 5)* — shipped: no contingent path; `calcStateVote('presGeneral')` always resolves to a winner. Forum: **rules don't exist** — GM invented 5 rulesets mid-thread (`drums` POSTS 472-474); House needs 17 state delegations for Pres + Senate 33 for VP; top-2 vs top-3 (DH-6); outgoing-vs-incoming Congress nebulous. | **PARKING LOT — author before build.** This is a *design task*, not a build task. The build cannot ship until the design picks (a) top-2 vs top-3, (b) outgoing-vs-incoming Congress, (c) the deadlock side-effects (EBR's Controversial + 50/50 Dom Stab, POST 5250). **Bundle with `hd` #62** (contingent House election + tied-chamber inverse control) once rules are authored. | The 5 rulesets all favored Fillmore in the thread (GM picked momentum-based to keep play moving) — this is the clearest "no canonical answer" hole in the divergences. **Size: design task + S build. Risk: medium** (election system). |
| **11** | **Veto override threshold** *(batch 5)* — shipped: no veto / override / cloture / filibuster code exists (grep confirms zero engine sites). Forum: **2/3 in BOTH chambers, NOT 60%** (`drums` POSTS 2180-2187, designer ruling; 60% was a reverted bug). | **Forward-only — no fix needed today.** When the legislative micro-mechanics epic builds veto + override (Phase-1 #13), hardcode `VETO_OVERRIDE_THRESHOLD = 2/3` as the constant. | Verified: no veto code exists; the "60% bug, reverted" finding is a forward-spec, not a shipped-vs-design lag. **Size: 1-line constant + the veto-override path itself. Risk: none.** |
| **12** | **Midterm uses full meter+enthusiasm rules** *(batch 5)* — shipped: `calcStateVote` (`phaseRunners.ts:3685`) is a generic resolver keyed on `ElectionContext`; the midterm callers' assembled term set is what matters. Forum: full meter+enthusiasm/presidential rules (`drums` POSTS 299-304, Tyler's 6-way test). | **Verify-vs-build, refactor if needed.** Audit the mid-cycle Senate/House caller paths through `calcStateVote` — do they pass the same meter + enthusiasm terms as `presGeneral`? If not (likely a thinner subset), widen the caller's term assembly. Probably a small change in the callers, not in `calcStateVote`. | A "fluidity across elections" win — replaces artificial wave-swing penalties. **Size: S. Risk: low** (mostly term-assembly widening). |
| **13** | **CPU AI architectural gaps** *(batch 5)* — shipped: no agent-decision pass at all (3 thin stubs only). Forum: the 8 architectural gaps in §25.15 (no reciprocity / no meter-guarding / no cascading-event smoothing / static governor menu / no ticket-experience VP term / Sec-of-State-only diplomacy / no coalition-counting in proposals / weak action-roll outcome bands). | **Refactor to forum — but via the K5 scaffold + handlers.** These are **not single-line rule fixes**. K5's persistent state (`cpuCommitments`, `recentScandalIds`) + the meter-impact aggregator + the state-aware governor menu live in CPU handlers, not in existing runners. **The roadmap-planner should treat the CPU-AI epic as a peer of the per-system epics** (§9.2 row above), not as a divergence-resolution item. **DH-8 RESOLVED for explicit heuristics, REMAINS open for architectural gaps** until K5 + the handler suite lands. | This is the structural lever for the whole CPU surface. Without K5 + handlers, the §25 spec lives in `game-mechanics.md` forever. **Size: K5 scaffold S + ~15 × S–M handlers. Risk: medium** (per handler — the architectural-gap handlers carry the most risk because their persistent state must be self-cleaning). |
| **14** | **Meter-driven endgame clock** *(batch 6 — NEW endgame model)* — shipped: only event-driven endgame via `EraEvent.triggersGameEnd` (`types.ts:1476`) consumed at `phaseRunners.ts:2871` setting `game.gameEnded` (`types.ts:1635`). Forum: a meter falling into bottom-tier band starts a **10-game-year (5 half-term) countdown** to mandatory game-end; recovery clears it (`pop` POST 542, 548 — Planet Health → APOCALYPSE). | **Refactor to forum (add the meter-driven path).** Add `GameState.endgameClocks: { meter; threshold; remainingYears; startedYear }[]` + `repair()` backfill `[]` + a per-meter band-monitor in `runPhase_2_5_1_Lingering` that arms/disarms/decrements clocks + a termination path in `runCurrentPhase` (engine.ts) that fires `game.gameEnded` when `remainingYears` hits 0 + a HUD warning in `GameOverScreen.tsx`. **BOTH endgame paths must share the `game.gameEnded` sink and terminate cleanly.** | **Phase placement: Phase 1.** Rationale: `planet` meter ships today (`types.ts:1406`, ticks every era); model is **meter-agnostic** — Populism instance is one configured row per era. **Folds in with the meter-model generalization** (Phase-1 #6 ±3-clamp + crisis/cascade). Analogous bottom-tier clocks may exist for other meters/eras (Econ Stab "depression spiral"? Honest Gov "corruption collapse"?). **Size: M. Risk: low–medium** (the termination path interacts with autosave + the page-registry game-over screen, which already handles the event-driven case). |
| **15** | **Dynamic cabinet seat list** *(batch 6; **batch 8 confirms FOUNDING→MODERN end-to-end**; **batch 9: CREATE-AND-ABOLISH**)* — shipped: `cabinetSeatsForYear(year)` (`types.ts:1196`, **VERIFIED still the year-keyed pure function**; its own docstring at `:1190-1195` literally hard-codes the year→seat-count schedule the forum contradicts) is a **pure derived function with NO mutable state**; the cabinet phase recomputes it each turn (`phaseRunners.ts:2162`). Forum: the seat list is **mutable persisted state** driven by passed bills — **at BOTH ends of the timeline.** Modern (`pop` §26.5): "Create Department of Environment and Climate" creates a seat that persists. **Founding (`new1772` §24.6): SCOTUS / Bank-of-US / Navy / AG / academies ALL stood up by in-game bills.** **★ Batch 9 (`nuke` §28.5) adds the ABOLISH side: offices are created AND ABOLISHED by ordinary law** — DOE/DHS created, **Postmaster General ABOLISHED** by the postal-independence bill, HEW split into HHS+Education. | **Refactor to forum (seat list as persisted state).** `cabinetSeatsForYear` becomes the **boot seed only**; introduce `GameState.cabinetSeats: SeatSpec[]` populated at boot; runners read the mutable list. Add **both** `Legislation.createsCabinetSeat?: SeatSpec` **and `Legislation.abolishesCabinetSeat?: SeatSpec`** (batch 9 — the seat list must support REMOVAL, not just creation); on bill-sign, append/remove the payload. **Folds into E16 cabinet retention.** Pairs with #66 (institutional layer) + the founding offices-by-law layer (#101). | **Size: M-ish, marginal cost folded into E16.** **Risk: low** (additive — the boot seed reproduces shipped behavior on day 1). **★ Batch-9 justification: the year-keyed model is confirmed WRONG at BOTH ends (founding + modern), and the operation set is create-AND-abolish, not create-only — foundational to the offices-as-data theme.** |
| **16** | **Amendments toggle capabilities** *(batch 6)* — shipped: no `requires:` predicate, no `ActionRegistry`, no `AmendmentPredicate` anywhere in the engine (a single `isAvailable` match in `revolutionaryWar.ts` is unrelated). Forum: action-library entries gate on amendment ratification — "Send VP to Shore Up Support" requires 12th Amendment; income-tax bills unlock after a 16A-equivalent (`pop` POST 951, §26.7). | **Refactor to forum — via K2.** Add `requires?: AmendmentPredicate` to the `GameAction<Ctx>` shape **from day one in K2**; the picker filter step reads `game.amendments.passed` and excludes locked entries. **The K2 spec already names this** (see the K2 row above). The `AmendmentPredicate` is a new `Predicate` extension (or a sibling discriminated union) — `evalPredicate` (`eraGraph.ts:12`) gains a case. **Cheap if folded into K2** (one field + one filter); **expensive if retrofit** (every library re-traversed). | **Size: XS in K2; M+ if retrofit later.** **Risk: low if early.** **Note:** the same `requires:` mechanism also gates **bill catalog entries** (income-tax category) and **gov action entries** (some require specific amendments) — the predicate field belongs at the registry-row level, not the library level. |
| **17** | **State roster keyed to BOOT YEAR** *(batch 6)* — shipped: `states1772.ts`/`states1856.ts` are the only rosters; `expansionStates.ts` is the post-founding admittable pool. **No notion of multiple rosters per era enum.** Forum: the 2012 fresh-modern boot needs **50 + DC** (`pop` POST 264); the 53-state alt roster (`modern` §22.10, Wyoming Rule) is the **product of 60 yrs of annexation events** in the `modern` continuation. **BOTH must exist for `modern` enum.** | **Refactor to forum — refines K4.** K4's era-content registry keys on `{era, startYear}` (or `scenarioId`) for the initial state roster. Annexation chain (era-event `postEffects`, the existing `admitState` path at `territories.ts:8`) mutates `snap.states` at fire time, walking a fresh-boot roster toward the continuation roster. **Folds into K4 + E28 (53-state roster) + E30 (modern scenario boot).** | **Size: design refinement of K4.** **Risk: low** — the registry key is one tuple change; annexation already exists. |
| **18** | **★ Era model — content-bands vs calendar year** *(batch 7 — the biggest reframe; **batch 8 MULTI-SAVE PROVEN**)* — shipped: phases gate by `year % 4`/`year % 2` (`phases.ts:49-59`); the only era advance is the hard-coded `currentEra = 'federalism'` at `constitutionalConvention.ts:198`; **no year→era derivation exists**. Forum: an era is a **content-band** advanced on **game-state / meter / territory-ownership triggers per half-term**, with content gated on **territory held** not the calendar (§27.1 / #92). **Batch 8: `tea1772` (1772-start) and `rep1800` (1800-start) emit the IDENTICAL band sequence at identical dates** — two independent saves, one deterministic gate. | **Refactor to forum — but it FOLDS INTO K3/K4, it is NOT a new keystone.** Keep the `phases.ts` year predicates for phase *cadence*. Make `advanceEra(snap)` **condition-driven** (watch `era.advanceWhen(snap)`; the CC `:198` line becomes the first such condition) + gate all content (bills/era-events/draftees/bias-table) on `game.eraBand` + a new **`territoryOwned` predicate**. RECONCILES #68 point-banking + §26 boot model + §27.1. See §9.1.5 + the updated K3/K4 rows. | **Size: M (it IS K3, re-specced — no extra top-level field beyond an optional `game.eraBand` marker).** **Risk: medium** — touches era-content gating broadly, but the codebase has no year→era derivation to unwind (it's a generalization of one existing trigger). **The single most important sentence in §9: K3 was already year-decoupling; batch 7 makes the trigger explicitly condition-driven + adds territory-gating; batch 8 raises confidence to the highest in the KB (multi-save proof), no structural change.** |
| **19** | **Ideology linear vs CIRCLE** *(batch 7)* — shipped: `IDEOLOGY_ORDER` (`types.ts:14`) is LINEAR; distance is open-coded as `Math.abs(IDEOLOGY_ORDER.indexOf(…) − …)` at 10+ sites (`factionCenter` `phaseRunners.ts:715`, `stepToward` `:740`, conversion adjacency `:993-1003`, sponsor `:3548`, `firstContinentalCongress.ts:120`, + 3 UI pages). Forum: a mid-era rule change wraps the scale into a **ring** — LWPop↔RWPop adjacent at ~25% base; conversions extend to **adjacent** (§27.7 / #99). | **Refactor to forum — a FOUNDATIONAL central-helper refactor behind an era-gated flag.** Add `ideologyDistance(a, b, circular)` (engine util); migrate the 10+ open-coded sites to it (behavior-preserving while `circular=false`); gate the wrap on `GameState.ideologyIsCircular?`; extend conversion targeting to same-OR-adjacent. **Place the helper + migration EARLY-ish** (cheap + additive while flag off; every later ideology consumer benefits). See §9.1.7. | **Size: XS-S (helper + migration) / M (the circular flag + conversion-adjacency).** **Risk: low (flag off = no behavior change); medium for the conversion-adjacency balance.** **Not a keystone — but cheapest early, most error-prone if deferred.** |
| **20** | **Legislature-chosen presidential electors** *(batch 7)* — shipped: `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`) resolves *every* state by PV+dice; the `senatePre17` context (`:3896`) is the SAME formula with a different `ctx` tag, **NOT a legislature-majority tally**. Forum: pre-12A states award EV by seated Gov/Senate/Rep party majority (Gov breaks ties), recomputed after the popular tally (§27.3 / #93). | **Refactor to forum — extends divergence #5 (per-state EC method).** Add `State.electorsByLegislature` + a **genuinely new resolution branch** (legislature-majority, not a `ctx` re-tag — `senatePre17` does NOT model this today). Plus the pre-12A `conventionsEnabled = false` gate disabling §15.3. Lands with the federalism/early-republic epic. | **Size: M (shares the EC tally path with #5).** **Risk: low–medium.** |
| **21** | **Procedure-subtype bills bypass veto but the engine MIS-ROUTES them to the President** *(batch 7 / DH-31)* — shipped: bill `subtype` taxonomy + veto routing unsurveyed; `rep1800` POST 2342-2348 says `subtype: procedure` bills (Institute Filibuster, create-whip-offices) are wrongly sent to the President for sign/veto. Forum: procedure bills skip the sign/veto step. | **Verify-and-fix.** Confirm the bill `subtype` taxonomy; skip the President sign/veto step for procedure bills. Lands in the **bill-typing epic** (#42) / the legislative micro-mechanics. Corroborates the `hd`-class procedure-routing flag. | **Size: XS-S verify + fix.** **Risk: low.** |

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
  `fed` + `gilded` + `modern` + **`drums` (all-CPU)** confirm solo and
  multiplayer are **two modes of one engine**, not two games (`modern` had a
  player take over a CPU faction mid-campaign and win; `drums` flips it to the
  other extreme — all factions CPU, with humans rolling dice and patching
  rules). **K5's handler suite serves both cases identically**: a CPU faction
  in a hot-seat game uses the same handlers as a CPU faction in a solo game,
  and a human taking over a CPU faction mid-campaign just disables the handler
  for that faction. **K5 + the handlers are the load-bearing piece that makes
  the take-over-a-CPU-faction mode work** at all.
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
> track + a far-end modern epic appended after gilded.
> **Batch-4 change:** BUG-0 added to the FRONT; the Civil-War / Reconstruction
> epic inserted right after generic war; 1856-arc election additions slotted
> next to the convention work; #54 marked READY; per-era point-banking folded
> into K3.
> **Batch-5 change:** **K5 (CpuController scaffold) added as a late-keystone**
> (after K0 + K2, parallel with K3/K4 + federalism); **the CPU handler suite
> added as a peer subsystem epic** (~15 lightweight PRs once K5 lands); **the
> cabinet-confirmation system (DH-23) sized down to XS-S** because the system
> doesn't exist yet (build in the right shape from day one); **Iron-Fist split
> (§25.9) added as an independent M epic**; **divergences #10-#13 added**;
> **contingent-election rules #84/#10 moved to PARKING LOT** until authored.
> **Batch-6 change:** **APOCALYPSE meter-driven endgame added at Phase-1 #6**
> (folds in with meter-model generalization — same code area, M-sized);
> **K4 gains the `BootSheet` schema as the cross-cutting build constraint**
> (single shape for 1788 / 1856 / 2012 boots; per-`{era, startYear}` state
> roster keying); **K2 gains `requires?: AmendmentPredicate` from day one**
> (divergence #16, cheap if early); **E16 cabinet refactor gains dynamic
> seat-list** (divergence #15); **modern era epic splits into TWO scenarios**
> (`scenario1948` continuation + `scenario2012` fresh-boot); **CPU handler #2
> consumes the conditional-vote-rules primitive** (`pop` POST 1111);
> **divergences #14-#17 added**; **DH-25 career-track bootstrap moved to
> PARKING LOT — BLOCKS modern scenario** until authored.
> **Batch-7 change:** **★ K3/K4 re-specced for the era-model reframe**
> (`advanceEra` becomes CONDITION-DRIVEN — game-state/meter/territory, per
> half-term — NOT year-boundary-driven; content gated on `eraBand` + territory
> ownership, not calendar; divergence #18; reconciles #68 + §26 + §27.1 — see
> §9.1.5); **★★ the Reconstruction SOLO-BLOCKER (DH-29) added as a hard BUILD
> REQUIREMENT on E3b** (the Strict/Ironclad plan can NEVER pass with CPU →
> solo Reconstruction unwinnable; E3b must ship a CPU-passable readmission path
> — see §9.1.6); **ideology-as-CIRCLE added as a Phase-1 foundation refactor**
> (central `ideologyDistance` helper behind an era-gated flag; divergence #19;
> §9.1.7); **new early-republic subsystems** (12A legislature-elector toggle
> #20; slavery-flag + Cohens #94; Second Bank recharter clock #95; statehood-by-
> bill + unorganized-territory gating #95); **era-events-predating-start MERGED
> into BUG-1** (LIVE-confirmed by the LA-Purchase-dropped-at-1800-start episode)
> + **event-scheduler-min-floor (DH-30) added as a quick-win**; **DH-31..DH-35
> classified**; **`scenario1800` noted as an optional later boot sheet**.
> **Batch-8 change (mostly CONFIDENCE + small placements — NO re-sequence):**
> **★ the era-model reframe (K3/K4 / divergence #18) is now MULTI-SAVE PROVEN**
> (`tea1772` 1772-start + `rep1800` 1800-start emit identical era-bands at
> identical dates — the highest-confidence architectural finding in the KB; no
> structural change, raise priority/confidence only — §9.1.5); **★ the dynamic
> cabinet-seat refactor (divergence #15 / E16) is reinforced — `cabinetSeatsForYear`
> is now confirmed the WRONG model at BOTH ends of the timeline (founding offices-
> by-law `new1772` §24.6 + modern `pop` §26.5), not modern-only**; **dual
> era-scoring (#102) noted as the WIN-CONDITION scoreboard** (per-era + cumulative;
> folds into K3/K4 point-banking #68); **★ DH-41 (general SCOTUS-ruling →
> statute cascade — UNBUILT, `vcczar`-deferred) added to PARKING LOT** as a genuine
> author-before-build hole; **DH-36 (★ GM-burnout-killed-a-game) flagged as the
> META-justification for the whole build, not a row**; **DH-38 → federalism/founding
> era epic (E1); DH-39 → convention machinery (multiplayer); DH-40 → bill-packaging/
> SCOTUS-establish bug-fix; DH-42 → election-math balance; DH-43 → dataset fix;
> DH-44 → 12A toggle (#93)**; **#100 SCOTUS-overturns-amendment → amendments item +
> SCOTUS docket; #103 pres-vote modifier stack → election-math; #104 lone-ideology
> convention exploit → convention CPU handler guard; #105 stat-collapse→forced-
> resignation → near succession (#61)**; **★ NEGATIVE RESULT: no thread reaches a
> "future" era — the timeline content ends at modern/Gilded everywhere; the "Era of
> the Future" has NO build target — do NOT scope it.**
> **Batch-9 change (`nuke`, the Cold-War/modern half — CONFIDENCE + NEGATIVE-SCOPE +
> small placements; NO re-sequence, NO new keystone):**
> **★ K3/K4 era model gains a TWO-LEVEL refinement** (point-banked Historical Eras
> with rule-deltas — the Era-of-Terror cabinet rework — AND a separate per-decade
> census doing EV-reallocation + bias-re-lean + content-rotation; do NOT collapse
> them; §9.1.5) **+ a STRUCTURED-era-event-`evDelta`/census-data requirement** (DH-48
> — the Neocon census events were LOST as free-text flavor; typed field + per-era
> completeness validation, lands in K4); **"Neocons" logged as a faction-rebrand NOT
> a band**; **★★ NEGATIVE SCOPE — do NOT scope a Cold-War/nuclear/MAD/NATO/space-race/
> military-branch subsystem** (§9.1.8 / §28.2; verified: only `revolutionaryWar.ts`
> exists) — the Cold War is the **generic war engine (Phase-1 #3) RELABELED +
> diplomacy (#107) + content**; the REAL items are the **generic war engine** (build
> ONE; **DH-47: it must RESOLVE — wars never end today — and ideally get army/navy/air
> branches**) + the **diplomacy subsystem** (8 relation meters + ambassador actions;
> **DH-46 add downward pressure**, **DH-45 fix the USSR-collapse trigger chain**);
> **★ mutable cabinet extends to CREATE-AND-ABOLISH** (E16 — add the abolish path;
> founding→modern confirmed; §28.5); **legislated variable SCOTUS size + excess-
> not-replaced** → SCOTUS docket (#25); **★ CPU-faction AI is LOAD-BEARING** (#114 —
> the APP = 1-human-vs-9-CPU; elevates K5 + the handler suite to a first-class Phase-1
> system, no re-sequence; §9.1.3); **★ Senate pass-threshold RESOLVED IN CODE =
> simple majority** (`phaseRunners.ts:3562`, `yea > nay` both chambers, no cloture;
> the only supermajority is the Articles-2/3-of-states CC path at
> `continentalCongress.ts:224`) — the DESIGN question (require 60%/cloture?) stays
> OPEN for the human; **★ PARKING LOT additions: a POPULATION MODEL + House cap**
> (DH-49 — Wyoming Rule + per-decade census un-implementable without one) and the
> **impeachment + succession ruleset** (DH-54 — never in the rules doc; corroborates
> DH-33). Other batch-9 DHs classify into existing epics (DH-50/53 → era-event
> scheduling + bill-catalog; DH-52 → election-math; DH-51 → modern dataset balance;
> DH-55 → 3rd-party #48; DH-57 → convention/handler #5). **★ The KB now spans a
> CONTINUOUS 1772→2020 timeline** (this 1948 thread is the predecessor of the
> `modern` 2004-2020 thread, joined at the 2004 election).
> **Batch-11 change (`arkzag`, the 1820→1840 FULL-ARC continuation of `dem1820` —
> the first late-game capture; THREE new content systems that EXTEND existing epics,
> ONE fork RESOLVED + promoted, ONE new fork, two sized bugs; NO new keystone, NO
> re-sequence):**
> **★ THREE new content systems land as EXTENSIONS, not new epics:**
> **#116 Bank-War → Independent-Treasury economic engine** = a NEW small epic **E4c**
> (or an E4b(d) sub-PR) that sits ON TOP of **E2** (Bill.type/crisis) + **E6** (named
> EconStab meter + crisis/cascade — EconStab IS `meters.economic`) + **E4b(b)** (the
> §27.6 Second-Bank institution it recharters/replaces); NET-NEW = a `game.economy?`
> state machine + **`Bill.replaces?`** + **`Bill.lockedUntilYear?`** (tariff cooldown);
> build it **emergent** (recurring CRISIS bills resolving an EconStab CRISIS), not
> scripted. **#119 amendment lifecycle → RE-SCOPE E5** (add the `proposed→committee→
> floor→governor-ratify→active` lifecycle state + the **active-amendment-BLOCKS-a-
> legislation-class** hook + the un-bundleable flag — verified NO `amendments` field
> today). **#61 succession/acting-president chain → RE-SCOPE E10b** (the KILL already
> ships — `assassination-killed` anytime event — but death only sets `presidentId=null`
> at `vacateOffice` `phaseRunners.ts:2449`; add VP-succeeds → fill-VP [gated on E5's
> VP-vacancy amendment] → acting-president action-DIVERT roll + trait-acquisition
> side-effect). **★★ #51 enthusiasm engine RESOLVED → PROMOTE to ready-to-build:** the
> 4-step reshuffle (§29.10, matches `drums`) + the −100/waiver crisis-bill-failure rule
> land in **E23** (now `ready` — algorithm settled), and the **±3 cap is unconditionally
> ready**, binding at `calcStateVote` `:3709-3711` (ship with E6); **ONLY #18 (state-
> scope) stays a human DECISION-GATE.** **★ NEW fork — delegate-class assignment
> (AI-allocator vs player-rigged) — gate it before E10's delegate-apportionment sub-PR**
> (does not block the rest of E10). **★ Two sized bugs:** **DH-59** (relations meter
> under-floors — XS, folds into **E12** diplomacy when the 9-point scale is built, no
> standalone patch) + **DH-60** (era-events lack a territory/asset prereq — S, the
> concrete face of #92; add a `requires?: Predicate` on the era-event row + a filter,
> SAME surface as BUG-1 + K3's `territoryOwned` → build with **E15** + BUG-1). **★ META
> flips POSITIVE: no GA-burnout this time** (heavy GA scripting absorbed the upkeep) —
> a 3-thread signal (2 burnout deaths + 1 survived-by-scripting) that STRENGTHENS the
> automation-reduces-upkeep argument behind E9/#55/#115. **CORROBORATION only:** #115
> continuation-boot (re-confirmed, priority unchanged), #13/#111/#44/#52/#59/#11/#10/#1/
> #9/#25/#54/#85/#40/#101 — no keystone moves.
> **★★★★★ Batch-12 change (`tedchange` + `smallbugs` — the DESIGNER's official
> rules-doc rewrite/cleanup channels; AUTHORITATIVE, supersedes prior GA calls
> where they conflict; NO new keystone, NO re-sequence of the keystones):**
> **★★ QW0 relocation-cap = 4 CLOSES — promote it from "open-design / build" to
> ready-to-ship FIRST** (`smallbugs#POST 734-735`, vcczar-12-30-25; one-line edit
> at `src/types.ts:247` + alt-state exemption guard at the relocation accumulator).
> **★★ Cabinet enthusiasm REWORK (#124) is the M-sized teardown of E16's
> lobby→enthusiasm path** — re-scope E16 to build confirmation + #124 enthusiasm
> rework TOGETHER from day one (lobby=POINTS to `Faction.score?`; ideology
> composition = ENTHUSIASM via the existing ±3-cap clamp; numeric percentages
> stay designer-gated). LANDS AFTER K2 + K5 (cabinet picks are CPU actions;
> consumes the conditional-vote-rules primitive). **★ Lingering 7-step strict
> ordering + tax/tariff carry-forward (#134) — M, re-scope E6 / Phase-1 #6
> (meter-model + APOCALYPSE)** to also carry Lingering step-discipline + the
> `game.taxTariffDecayQueue?` carry-forward state. **★ Pres 2-step Admin-then-
> Command blunder rule (#126) is the CANONICAL 5-tier wording** — supersedes
> the fuzzy cf82a7d3 §5a #3 placeholder; READY (was OPEN); lands in E29 modern
> legislative depth (where Pres-implements-bill code lives). **★ Death/retirement
> schedule (#130)** — refine `MORTALITY_RULES`, add `Hale` trait + `haleDeathMult
> = 0.5`, refactor death loop to **Frail-first**, gate retirement on **NOT
> (retired ex-Pres)**, mark cabinet retirement as end-of-half-term; folds into
> Phase-1 #19 small consistency (pairs with #85). **★ Kingmaker / Master
> Kingmaker scope (#128)** — pin the +1-in-state (basic) / +1-everywhere
> (Master) bonus in `calcStateVote` (`phaseRunners.ts:3711`); lands in
> Phase-1 #20 election math. **★ 1st/2nd CC composition (#133)** — rewrite
> `continentalCongress.ts` + `firstContinentalCongress.ts` to use the state-size
> delegate quota (Big PA/MA/VA/MD=4; Medium=3; Small=2) + the 1st→2nd CC
> transition on DoI + Articles-of-Confederation gating; re-scope E17. **★ CPU
> Chief Justice ladder (#142)** — XS, the ladder spec is authored; lands in
> E25 SCOTUS docket. **★ 50/50 House inverse-control (#135)** — XS one-line edit
> at `phaseRunners.ts:1864`; ship with QW0 + Phase-1 #19. **★ Draft re-rules
> (#136/#137/#138)** — XS each: no Command in random skill (verify), no
> cross-party draft (gate `partyId` to IRL at draft time), 3 traits + 3 alt-states
> (re-rule into era-config). **★ Conversion / ideology-shift schedule (#127)**
> — folds into #99 ideology-circle helper (Phase-1 #5b) + the adjacency filter
> + LW↔RW Pop 25% special case with auto-Two-Faced. **★ AnytimeEvo target-pool
> tightening (#140)** — S, per-event filter + content edits; folds into Phase-1
> #19 or E9 handler 9g. **★ Integrity-can't-nominate-Controversial (#131) +
> Challenge-Legislation-can't-target-REPEAL (#132)** — XS each, one filter
> helper per rule. **★ Pres signature step lives in 2.6 (#139)** — XS,
> phase-sequence reorder. **★ FL trait gain 5%+/3%- (#141)** — XS, refines
> existing FL trait-gain const. **★★ #120 `smallbugs` DATASET UMBRELLA — ONE
> coordinated `scripts/seedDataset.mjs` `CURATED_ROWS` pass** (~100 items:
> religion mislabels / wrong skills / missing pols / bio errors / swapped bill
> effects / event prereqs / region typos); also covers DH-43/DH-51/DH-28; M-sized
> as a single pass, place orthogonally to engine work. **★ Amendments-NOT-SCOTUS-
> challengeable (vcczar)** OVERRIDES `tea1772` #100 → SIMPLIFICATION: drop the
> SCOTUS-overturns-amendment branch from E25 docket scope and from E5 amendment
> lifecycle (keep E5's strike-a-statute + mutable threshold; keep E25's docket +
> drift + DH-32 state-guard). **★★ NEW Decision-gated SUB-BUCKET: designer-gated**
> — the 9 open `tedchange` items (Mil-Prep lvl 4, UEM #125, Crisis trait
> consolidation, term-limit Gov pre-Senate, faithless-elector rewording, party
> rename PL-vs-EraEvo, VP-same-party-on-resignation, cabinet enthusiasm %s,
> cabinet ideology weighting) — NOT ready-to-build until Ted/vcczar closes
> them. The authority hierarchy is now Ted/vcczar > GA > inference; the
> roadmap's parking lot splits Decision-gated into "user-gated" + "designer-gated."
> **★ Batch-14 change (`gild1868`, the first native-1868 Gilded campaign — NO new
> keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED; this batch is DOWNSTREAM
> era-content):** the five deltas #147/#148/#149/#150 + DH-63 are **ONE gilded-era
> content epic** (Phase-1 #22 / §9.1.10) that lands **after** `scenario1788` (E1) +
> a mature `advanceEra` + the era-content-band registry (K3/K4) + #116/E4c
> (economic engine) + #42 (bill-relationship graph) + #57/E3b (Reconstruction).
> **#41 is the umbrella** — the dedicated `gilded` era + `scenario1868` is "another
> scenario-as-data-row" on the K4 `BootSheet` (red/blue-FLIPPED roster RED=GOP /
> BLUE=Dem, POST 6; Gilded nickname table; era-event spine; bill catalog; SCOTUS
> docket; the 20-yr Reconstruction timer) — NOT a bespoke code path. **#147**
> (`game.tariffRate` integer + mutually-exclusive `MonetaryRegime` enum) replaces
> the ±0.5 flavor bill at `phaseRunners.ts:3421-3422` — M, depends on #116 + #42.
> **#148** (20-yr Reconstruction timer + appoint-by-Speaker/PPT-faction +
> Solid-South sunset, POST 73/76/5145) **EXTENDS #57/E3b** (no new epic) and
> **inherits the DH-29 solo-blocker** (§9.1.6) — S–M within E3b. **#149**
> (civil-service merit-vs-spoils axis + era-gated reform content) — S–M. **#150**
> ("1872 Rule" special election) — niche, S. **DH-63** (currency-regime
> exclusivity bug) **FOLDS INTO #42 + #147's MonetaryRegime** — XS–S, no standalone
> work. **The 3rd GM-burnout death** (`gild1868`, after `new1772`/`dem1820`)
> reinforces the automation-reduces-upkeep argument (DH-36 family) — cite, do not
> queue. **No keystone moves; QW0 → K0/K2 → K3/K4 + scenarioBoot → E1 still lead.**
> **★★★ Batch-13 change (`oopscpu`, Ted-run all-CPU 1788 stress-test — the K5/E9
> VALIDATION source; designer-authoritative; NO new keystone, NO re-sequence — it
> DE-RISKS E9 + adds two 1788-boot prerequisites + one XS standalone):**
> **★ E9 handler CONFIDENCE rises (no order change):** handlers #70 (leadership 9c),
> #72 (candidate/VP 9a/9m), #73 (cabinet 9d), #74 (legislation 9b), #75 (event 9g),
> #76 (conversion 9f) are now **spec-complete + FIELD-VALIDATED with concrete failure
> modes + Ted's fixes** — treat each handler PR as lower spec-risk. **FOLD the OC-*
> sub-rules into the relevant handler rows (NOT new epics):** **★ OC-3 (BALANCE-CRITICAL)
> → handler 9b (legislation) as its HIGHEST-priority sub-rule** — a crisis-vote
> ideology-floor gate (don't AYE a crisis bill that costs your own cards) + a
> secession/slavery-active check before an Abolish-Slavery crisis bill can pass
> (without it CPUs peacefully abolished slavery by 1792, no secession; `oopscpu#POST
> 162-180`); **OC-2 → handler 9c (leadership)** — ONE canonical `chamberControl(snap,
> chamber)` helper shared by leadership-select + the ≥60% proposer gate (consolidate
> the inline `senateMajority`/`houseMajority` dup at `phaseRunners.ts:1863-1864`, the
> collision bug); **OC-1 + OC-5 → handler 9d (cabinet)** — a scandal-resignee
> re-appointment cooldown (reads K5's `recentScandalIds?`; instance of DH-22) + gate a
> cabinet-vacating SCOTUS appointment behind the firing-precedent rule; **OC-6 →
> kingmaker handler (§25.11)** — multi-protégé pairing tiebreak = highest Com+Leg+Gov.
> Handler 9d also gets the validated crisis cabinet-fill LADDER (`oopscpu#POST 322`);
> handler 9a/9m gets the pre-12A nomination trio + VP retention (#144, RULED). **#71
> (convention 9e) is the ONE handler NOT validated** (1788 predates conventions) —
> stays `drums`-only-spec + DH-8-unstable; recommend a post-12A all-CPU run to validate
> it (the all-CPU-test methodology, §9.1.3).
> **★ #143 post-election Command decay (RULED, XS standalone)** — add a pass at
> `runPhase_2_10_End` (`phaseRunners.ts:4171`), gated on `isPresidentialYear`, after
> the 2.9.4 ticket roster is known: every living pol NOT on a Pres/VP ticket has a
> 40% chance of −1 Command via the existing `loseCommand` (`abilities.ts:15`). Ship
> with the XS consistency PRs (Phase-1 #19) / near QW0.
> **★ #61 death-succession branch (RECONCILED → folds into E10b)** — a clean DEATH →
> VP = FULL President (refuses "Acting", NO action-divert roll, NOT auto party/faction
> leader → re-run the leadership IRV, handler 9c); the acting-president + action-divert
> read is SCOPED to incapacity / 0-Command-inert ONLY. SUPERSEDES the `arkzag` read for
> the death case; S within the already-re-scoped E10b (`oopscpu#POST 324-329`).
> **★★ DH-61 + DH-62 are 1788-BOOT PREREQUISITES — sequence them WITH E1 /
> `scenario1788`:** DH-61 (boot-seed era-active wars — 1788 → NW Indian War, 20%-loss /
> WS −2) is a `BootSheet.activeWars` field + a boot hook in the `scenarioBoot` pipeline
> (K4 / §9.1.9) over the generic `War` model (Phase-1 #3) — **S**; DH-62 (pre-12A
> two-votes-per-state / no-ticket EC mode + same-state-EV exclusion + the §25.1
> anti-tie trio) is an **era-keyed election-mode variant** that lands in the per-state-EC
> + 12A-toggle epic (Phase-1 #4 / #93/#5) — **M**. Both gate ANY `scenario1788` and must
> land alongside it.
> **★ OC-4 + OC-8 → designer-gated parking** (NOT ready-to-build): OC-4 (CPU draft
> off-ideology gate — Ted wants "a better third way"; do NOT silently ship a hard gate;
> `oopscpu#POST 227-228, 234`) + OC-8 (define "office" + rewrite the
> Scandalous-Non-Office-Holder event; flagged to `@vcczar`; `#POST 334, 336`). Add to
> the designer-gated sub-bucket alongside the 9 open `tedchange` items.
> **★ METHODOLOGY recommendation:** the all-CPU test is itself valuable — it validates
> a whole subsystem's spec before it is built, needs no players (immune to GM-burnout
> DH-36), and a post-12A all-CPU run would validate the convention handler #71 (the
> only handler 1788 couldn't reach). §9.1.3.
> **CORROBORATION only (no keystone moves):** #70/#72/#73/#74/#75/#76 (the whole CPU
> cluster, from a founding-era angle), #52 (all-CPU SCOTUS by ideology-distance —
> resolves the player-vs-CPU fork FOR THE ALL-CPU CASE; human games still user-gated),
> #20/DH-19 (CPU gov menu + the OC-7 help-allies term-config sub-rule, RULED #145),
> #99/#127 (ideology-circle LW↔RW Pop 25%). The #18 meter→election state-scope fork
> RECURS unresolved (still user-gated).
> **Batch-10 change (`dem1820`, first 1820-START — ONE promotion + two decision-gates +
> sized fixes; NO new keystone, NO re-sequence of the keystones):**
> **★★ #115 SCENARIO-BOOT pipeline PROMOTED to the front of the subsystem queue** —
> verified NO shared boot abstraction (`GameContext.tsx:264` → hand-authored
> `scenario*.ts`; `scenario1856.ts:44-214` is a copy-paste-per-scenario builder with
> raw `Math.random` at `:83,99,113`). Factor `scenarioBoot(BootSheet)` ONCE, **with
> the first new scenario (Phase-1 #1), inside K4's `BootSheet` schema** — it is the
> "how to CREATE a game" spec the forum has lacked for 3 years (POST 92); see §9.1.9.
> **★ TWO decision-gated forks (NOT ready-to-build — human design call first):**
> player-SCOTUS (#52 — CPU-by-ideology vs trait-gated vs player-controlled, all live in
> `dem1820`; the docket data structure is needed either way → SCOTUS docket epic
> Phase-2 #25) and meter→enthusiasm→election (#18/#51 — every-state-unless-penalized vs
> ideology-leaning-only vs primaries-only; verified `calcStateVote` `:3709-3711` applies
> enthusiasm uniformly with NO ±3 cap → the cap is a queued XS clamp but its binding +
> state-scope wait on the fork). **★ Sized corroborated fixes:** DH-53 bill-EV-sign is
> an **unbuilt** mechanic (`EraEventResponseEffect` has no EV field, `types.ts:1448`) →
> structured-bill-effect tables (Phase-1 #20 + K4), NOT a sign-flip; DH-24 Senate-class
> validator → the boot pipeline (replace the literal `1856` at `phaseRunners.ts:3885`);
> #55 focus-Rep (EV−2)/5 House → scaling-wall-(b) (Phase-1 #7) + census epic; #59
> statehood→sectional-crisis → cheap additive at `admitState` (`territories.ts:8`),
> fires from 1820/Nationalism starts too, folds into 3b; #115a boot-Command +
> #115b appointment-ladder/replacement-gains → boot/appointment rules.
> **★ DH-36 (2nd GM-burnout-killed game) reinforces the automation-reduces-upkeep
> argument (now 2-thread)** behind #115, #55, and the CPU handler suite — cite, don't
> queue. **CORROBORATION only:** #92 era-bands (3rd start year, 1820), #1, #76/#108,
> #24, #9, #20, #25b, #101, #61, #44 — no keystone moves.
> **★★ Batch-15 change (`terror2000`, the first NATIVE 2000-start; Ted-run,
> CPU-heavy — TWO promotions + one re-scope + the first proven LOSS state; NO new
> keystone, NO re-sequence of the top of queue):** **★ #18 election scorer RESOLVED
> → PROMOTE to ready-to-build** (V's 2-layer model: universal per-ideology meter
> modifier on BOTH parties/every state + per-party enthusiasm box, composed then
> ±3-capped; `terror2000#POST 913-926`) — binds at `calcStateVote`
> (`phaseRunners.ts:3709-3711`), composes with the #51 reshuffle (§29.10/E23) + the
> QW3 ±3 cap; **#18 LEAVES the Decision-gated bucket** (was state-scope-gated since
> batch 10); S–M. **★ #88 AUTOCRATIC-COUP terminal — the FIRST PROVEN game-over/LOSS
> in the KB, FIRED live** (Honest-Gov floor → 20%/event-phase, `POST 827`) →
> **NEW small end-condition module: the per-event-phase game-end roll table**
> (§26.4's `rep1800` set), built TOGETHER with the APOCALYPSE 10-year countdown clock
> (§9.1.5) as ONE meter-driven endgame module over the existing `triggersGameEnd`
> terminal surface (`phaseRunners.ts:2871` is event-only today); S; reachable in the
> modern era. **★ #152 WAR-DEFEAT loss package** (officers −1 Mil + −1 all-elections;
> **President −1 all-future-elections**; Party-Pref crater) + multi-phase wars
> (naval→ground, Phase II) → **EXTENDS the generic war engine (Phase-1 #3)** — the
> shipped resolver ends a war at `warScore≤−50` (`:3618-3620`) but applies NO
> package; completes DH-47 ("wars must RESOLVE"); the President-loss term couples into
> the #18 scorer; M within E3. **★ Cabinet cluster #124+#151 → RE-SCOPE E16 (third
> time)**: bundle confirmation + lobby→POINTS + Ted's LIVE 3-state upset/fine/happy
> enthusiasm channel (fixes the "Mods +18" stacking bug, `POST 486-489`) + the NEW
> Era-of-Terror **#151 same-party appointment-FAIRNESS penalty** (−500/slighted
> same-party faction, fired LIVE twice) + the **cabinet-DIVERSITY penalty** (active
> natively in a 2000-start) — all Era-of-Terror-gated (a §27.1 era-BAND RULE delta);
> **#124's designer-gated %s NARROW/CLOSE** (live 3-state tuning supersedes the §30.2
> #8 parked numeric); M+S, lands after K2+K5. **★ #153/#154 (XS+S)**: DOUBLE every
> Command-gain % (`addCommandPoint` callers; rookie Command=0 already ships); no-re-roll-
> on-held-expertise is already `addExpertise`'s dedupe behavior (forward-only
> invariant); the 4-step vacancy-fill ladder (same-party-CT → same-party-unemployed →
> other-party-CT → other-party-unemployed) → slot into the #115a/#115b appointment-
> ladder family. **★ Decision-gated RECOUNT: −2** (#18 state-scope resolves OUT;
> #124-percentages resolves OUT). **4th Ted-run/CPU-heavy source** — field-validates
> the E9 CPU suite + #1 faction-handover from the MODERN angle (2nd modern native run
> after `pop` 2012). **CORROBORATION only:** #113/#56/#106/#51/#85/#90/#92/#102/#1/
> #135/#143/DH-25/DH-24 — no keystone moves; **top of queue UNCHANGED** (QW0 → K0/K2 →
> K3/K4 + scenarioBoot → E1).
>
> **★★ Batch-16 change (`hd1` / "A House Divided" Part 1, the first HUMANS-on-both-
> sides Civil-War→Reconstruction run — DH-29 REFRAMED + its AUTHORED fix in hand; NO
> new keystone, NO re-sequence of the top of queue):** **★★ #156 4-PLAN
> RECONSTRUCTION MODEL → the canonical DH-29 fix; FOLDS INTO E3b** as the
> definition-of-done for its readmission half — vcczar's authored rewrite
> (`hd1#POST 2692-2694`): 4 plans (No-plan / 10% / Ironclad-Wade-Davis /
> Military-district) on **BOTH Pres + Congress**, gated by *"a plan adopted by
> Congress OR by the President"* so the **President adopts UNILATERALLY** →
> solo AND deadlocked-human Reconstruction always resolve; `game.reconstruction =
> {plan, adoptedBy, startYear}` + ActionRegistry rows + the +2/+1 time-boxed
> bias-while-active on the `calcStateVote` term; **M–L within E3b; the
> highest-value Reconstruction target** (UNBLOCKS DH-29; removes the K5
> soft-dependency for the solo case). **★ DH-29 RE-CLASSIFIED: CPU-only →
> STRUCTURAL** (`hd1#POST 2678`: humans on both sides filibustered to the same
> NO-plan null result) — the §9.1.6 options menu is SUPERSEDED by the unilateral-
> adopt prerequisite; its "author the rule" step is DONE. **★ #155 WAR-BALANCE PASS
> → EXTENDS the war engine (E3 / #56/#152)**: add a real enemy-strength term
> (replacing the `Math.random` placeholder at `phaseRunners.ts:3603`, routed through
> `rng.ts`) + battle-size weighting + an Officer-Mil-share cap + per-theater scoring;
> **★ HARD CONSTRAINT — keep the 1772 RevWar winnable** (game-over on loss,
> `hd1#POST 1004`); bake the open tuning (multiplier 1.0-vs-0.5; naval hard-gate-vs-
> continue-roll; permanent-vs-one-term war-hero bonus); M within E3, pairs with #152.
> **★ #157 CSA-GOVERNMENT SEEDING → folds into the #58 secession + war epic** (cabinet
> + generals/admirals from the seceded Command/Military pool; needed for the
> CSA-victory branch, `hd1#POST 2692`); S; depends on the per-pol Southern-Unionist
> gate. **★ DH-64/#158 `Southern Unionist` DATASET audit → joins the #120 dataset
> umbrella** (CURATED_ROWS trait audit in `scripts/seedDataset.mjs` + regen; the trait
> is not even a wired gate yet — VA/MS/FL/Border draftees); XS. **★ Decision-gated
> RECOUNT: 0** (DH-29 changes category but stays in E3b; the 4 cross-run open
> questions are tuning). **3rd Civil-War run + 5th antebellum source — HIGH
> corroboration** on war/Reconstruction/secession. **CORROBORATION only:** #56 (the
> deepest two-theater spec yet) / #57 onset / #58 / #59 / #92/#109 — no keystone
> moves; **top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).
> **★ Batch-17 change (`ted1772` / "I Think Something's The Matter With Ted" — the
> 4th captured 1772 thread, Ted-run mostly-CPU; deliberately CORROBORATIVE; NO new
> keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED):** **★★ #153 command-bootstrap
> → PROMOTE the ×2-Command-gain knob to build-with-confidence** (now 3-source
> canonical — terror2000 / tedchange / ted1772 — and DEMONSTRATED LIVE producing an
> emergent President from a 0-Command CPU pol; sits on the draft/command path, debt
> #31, ready now; the SITES the ×2 wraps include `constitutionalConvention.ts:158,168`
> + the RevWar grants). **★ #159 CONSTITUTIONAL-CONVENTION subsystem → folds into the
> founding-boot / E1 (`scenario1788`) surface** — the shipped
> `constitutionalConvention.ts` is a superset SKELETON (7 articles + single CPU
> auto-fill + 9-state ratify + era transition); the NEW build is the **per-article
> 2/3-vote + eliminate-lowest-and-revote loop**, **gov-sends-3-delegates (2 own + 1
> opp, ≥1 Legis)**, the **random-egghead drafter**, **debate-sway by traited
> delegates**, and **the slave-compromise plank driving a per-state EV penalty**
> (slaves-don't-count → seceded-South GA −5/SC −5/NC −3/VA −3, floor 3 — shipped sets
> EV flat at `:208-211` with no plank branch) + threshold-amendable + Judiciary-Act-
> sets-SCOTUS-count; **M–L, largest new build surface this batch, but downstream
> era-content that EXTENDS the file** (debt #33). **★ #158 CPU-ANTI-GAME-OVER → build
> WITH the #155 war-balance pass (E3)** + the #75 event-vote handler (E9): an
> anti-game-over layer in `pickAIResponse` (`eraGraph.ts:88-103`, which has NONE
> today) — flat 75%-oppose OR points-based anti-peace bias (human picks); S; it is
> **ONE OF THE THREE RevWar floors** (debt #32/#34a). **★★ THE THREE REVWAR FLOORS =
> a HARD CONSTRAINT on #155** (debt #34a): when #155 adds the enemy-strength term /
> battle-size / Officer-Mil cap / per-theater scoring, it MUST preserve **(1) the
> French-alliance void-loss flag** [SHIPPED, `revolutionaryWar.ts:259,268-270`],
> **(2) the 2/3 peace-vote threshold** [NOT built — 55.5% must NOT pass], **(3) the
> 75% CPU-anti-game-over override** [#158, NOT built] — a 1772 game with all three
> intact must stay winnable or the engine is over-tuned. **★ FL-on-death → IMMEDIATE
> replacement (fork RESOLVED) → small standalone fix** (debt #34): shipped DEFERS
> (`cleanupLeadershipAndProtegeChains` `phaseRunners.ts:2304-2312` nulls `leaderId`,
> the 2.2.3 election `:1975-2009` waits a turn); factor the vacant-seat election into
> `electFactionLeader(snap, f)` and call it at death time; S. **★ DH-65 founding
> dataset audit → joins the #120 dataset umbrella** (debt #35): the wrong-century /
> same-name founding-pool collisions need a CURATED_ROWS audit + a dataset-build
> validation gate over the 1768-1776 window (the Cosmopolitan⊕Provincial half is
> ALREADY engine-enforced via `TRAIT_CONFLICTS` `types.ts:675-676` and 0-both-held in
> the current JSON); XS. **★ Decision-gated RECOUNT: 0 enter; TWO forks LEAVE**
> (FL-on-death → ruled-immediate; #153 expertise/Command → 3-source canonical). **4th
> 1772 source + 3rd CPU-heavy source — HIGH confidence on founding-boot + the CPU
> suite + the command-bootstrap.** **CORROBORATION only:** #133 CC composition / the
> #70–#79 CPU suite (#74's cleanest 4-step articulation) / #86/#136 founding boot /
> DH-61 (the alt "War of 1812 in 1782" branch) — **top of queue UNCHANGED** (QW0 →
> K0/K2 → K3/K4 + scenarioBoot → E1).
> **★★ Batch-18 change (`ideo1928`, the FIRST 1928-start interwar campaign; GA-run
> [NOT designer; ONE Ted-authored ruling]; NO new keystone, NO re-sequence,
> TOP-OF-QUEUE UNCHANGED):** **★★ #160 interwar economic engine → EXTENDS E4c (the
> `arkzag` Bank-War work) — E4c is now the SECOND era to want the SAME `game.economy`
> machine** (1820s Panic + 1930s Depression), so build E4c GENERIC + add the interwar
> content as data: a **Great-Depression META-event** (multi-meter shock bundle
> `{economic:−4,…,partyPref:−3}` + (a)/(b) presidential decider, at
> `runPhase_2_4_3_Era` `phaseRunners.ts:2796`) + the **EconStab→Recession cascade**
> (2 industries −1/state → EV-reflow + meter-gain gating) + **crisis-gated bills**
> (`Bill.requiresCrisis`, reuses E2's crisis-bypass); couples to E2 + E6; **M as an
> E4c extension** (debt #36). **★ DH-67 = the CENTRAL #160 takeaway and a clean
> high-value fix: EVENT-GATE the era's BLUE party bias to the crash having fired** (a
> `game.crashFired` flag at the `partyPref*5` term `phaseRunners.ts:3709-3711`, not a
> static era-band constant) — **S, build it WITH #160** (debt #37). **★ Confirmation
> AUTO-PASS gate → folds into E16/E9-handler-9d — a REAL fix for the §25.5 36%-pass
> CPU cabinet pathology** (Ted RULING, `ideo1928#POST 213-214`): all picks auto-confirm
> EXCEPT {State/Treasury/AG/Defense}/Controversial/<3-skill (unless Integrity), so most
> picks NEVER reach a vote; inserts at `runPhase_2_3_1_Cabinet` `phaseRunners.ts:2158`;
> **S, designer-authoritative** (debt #38). **★ Era-band SIXTH start (1928, #161) →
> K3/K4 CONFIDENCE boost** (now 6 start-years: 1772/1800/1820/1856/1948/2000+1928;
> no new scope). **★ #162 diplomacy → era-keyed nation list, EXTENDS E12/#107** (7
> nations, no Israel yet; debt #39); the **#56-negative** (ideology framing ≠ war
> trigger) is a SCOPING NOTE, not a build item. **★ DH-66 impeachment → PARKING LOT,
> await Ted's pending rewrite** (3-thread-confirmed broken: DH-33/DH-54/DH-66; the
> spec is NOT final; 0 `impeach` hits in `src/`). **★ #165 (event sign + `auto|roll`)
> → SHARED fix with DH-53** (structured effect tables; debt #40); **#166 (industry-
> impact tally + per-era meter versioning) → folds into the economic-engine/scoring
> work** (debt #41); **#163/#164 → BOOT** (DH-25 career-track family + K4 BootSheet
> start-state; debt #42). **★ Decision-gated RECOUNT: 0.** **FIRST interwar source +
> E4c's SECOND data-point** (well-specified across two eras now). **CORROBORATION
> only:** #116/E4c / #18/#51 (the 2-layer scorer LIVE at the 1932 presidential
> general) / #107 / #92 / DH-27 / DH-53 / DH-36 — **top of queue UNCHANGED** (QW0 →
> K0/K2 → K3/K4 + scenarioBoot → E1).
> **★ Batch-19 change (`fixes2022`, the EARLIEST captured discussion thread — Fall
> 2022 pre-early-release build window; designer-authoritative rulings + community
> suggestions; corroboration- and provenance-heavy, ONE new subsystem; NO new
> keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED):** **★ #167 no-eligible-successor
> constitutional-crisis → FOLDS INTO E10b** (the fallback when the WHOLE succession
> line is empty; verified ZERO `successionCrisis|actingPresident|coup` hits in `src/`;
> binds on the `vacateOffice` vacancy site `phaseRunners.ts:2446-2449`): an emergency-
> Congress agenda-locked succession-law vote (auto-signed/un-vetoable) → a House
> 1-vote-per-state acting-President election → a scaled 0/−1/−2/−3 DomStab penalty → a
> coup branch (same end-condition family as debt #28). **★ SHIPPABLE-FIRST: ship the
> PPT-as-acting-President interim default** (`POST 849-850`), then layer the full
> procedure. **★ Step (ii) reuses the #62 contingent-House-election delegation-vote
> machinery — build #62 once, reuse for both.** Couples #61 + #88/debt #28 + DH-54
> into ONE E10b crisis family; M (full) / S (PPT-interim); debt #43. **★★ PROVENANCE
> = build-CONFIDENCE, no new scope: `fixes2022` is the EARLIEST source for
> #153/#135/#124/#121/#88** — these were designer intent from the START → raise
> confidence where they sit (debt #31/#32 #153/#88; E16 #124; E3b #121); no item
> changes size or epic. **★★ ENTHUSIASM (#18/#51/#124) = the PERENNIAL-FORK RISK FLAG
> → FREEZE the spec:** the strongest corpus evidence (Anthony stalled ~½ into 2.1;
> V re-derives it differently each playthrough, `POST 713-716`) that this is the
> single likeliest place the build drifts from designer intent — treat the #51
> (drums 4-step) + #18 (terror2000 2-layer scorer) resolutions as a FROZEN SPEC; a
> RISK ANNOTATION on E23 + E20b/`calcStateVote` (debt #1), no code/scope change.
> **★ Era-event FIRING-RATE budget → small addition to the era-event epic** (E15 /
> divergence #4): the ~70%/era dynamic-limit OPEN piece (`POST 114-123`); the runner
> has no firing budget today (`phaseRunners.ts:2796`); S; debt #44. The late-start
> boot-filter (`POST 413-423`, INTENDED) builds WITH BUG-1/#92; the scripted-event
> build-out is CORROBORATION of the shipped `EraEvent` model, NOT a gap. **★ #120
> dataset umbrella → fold the `fixes2022` batch in** (~20 named items + ~10 effect-
> sign bugs → DH-53 + vcczar's own ~1800-legisprop audit; Bob Scott dup = `smallbugs`
> §2b; one `CURATED_ROWS` pass). **★ Decision-gated RECOUNT: 0.** **EARLIEST source +
> the smallbugs thread's genesis (`POST 637-640`).** **CORROBORATION only:**
> #167-couplings / #153/#135/#124/#121/#88 earliest-source / #18/#51 perennial-fork /
> #120 + DH-53 / the `EraEvent` model / #92 / BUG-1 — **top of queue UNCHANGED** (QW0
> → K0/K2 → K3/K4 + scenarioBoot → E1).
> **★ Batch-20 change (FOUR meta/design threads: `planb` build-finishing PROCESS plan /
> `dbomit` missing-pol requests / `biden2021` modern era-content / `ampu2wish` OUT OF
> SCOPE — LIGHT batch, ONE runtime mechanic, ONE authoring gate; NO new keystone, NO
> re-sequence, TOP-OF-QUEUE UNCHANGED):** **★ #169 drop-out → endorse-VP event → SMALL
> addition to the era-event epic (E15)** (or the election epic E20b): an `EraEvent`
> (`types.ts:1466`) gated on the EXISTING age roll (`ABILITY_LOSS_RULES.oldAge` `minAge
> 70` `types.ts:521` / `MORTALITY_RULES` brackets) → 50% pull → −1 party malus injected
> into the §21.9 modifier stack (lands on the VP even when the pres is pulled) → swap the
> VP onto the ticket inside `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752`,
> VP id `types.ts:1568`); pre-primary-convention fallback + VP-age guard; Era-of-Populism-
> scoped until it fires twice; **distinct from #37/debt #29 (defeat-then-retire)**; S; debt
> #45. **★ #168 = a PRE-BUILD AUTHORING-QUALITY PASS, NOT a roadmap code epic** — the
> terminology contract (ideology short forms; Skills/levels/Experience/Interests; "Army"
> Experience rename; human-rights→criminal-reform; demographic categories) + the branch-
> path/meter-direction/percentage-multiplier sanity-audit (= DH-53 effect-sign family) +
> the trait/interest compilation; the roadmap NOTES it as an authoring gate, it does NOT
> schedule it as a code task; pairs with the #120 dataset pipeline (§7); debt #46. **★ The
> CHRONOLOGICAL-IMPORT pipeline constraint — a PROCESS note: all content authoring proceeds
> CHRONOLOGICALLY** (Anthony imports pols/events in chronological order, all changes through
> vcczar, `planb#POST 37, 72`) — orders the per-era CONTENT work, not the engine track.
> **★ `biden2021` → modern era-content** (extends the modern band past 2020, #92/#41 /
> §28.13; the ONE new mechanic is #169; the pardon pres-actions BLOCK on #122) — folds into
> the modern-era content work, NOT a new epic. **★ `dbomit` → #120** (pure dataset, no
> per-pol rows; standardization rulings pair with #168); **post-1772 start-game guide →
> #115**; **pol-trading wish → DH-37**; **dynamic-biases wish → DH-34**. **★★ `ampu2wish`
> → OUT OF SCOPE — do NOT schedule ANY AMPU-2 wishlist item for AMPU 1** (day-by-day Paradox
> rebuild, full House, dynamic regions/biases, scouting/hidden-stats); quarantine only.
> **Decision-gated RECOUNT: 0.** **CORROBORATION only:** DH-53 (effect-sign audit) / DH-27
> (conflicting-trait macro) / #136/#153 (no-rookie-Command) / the `EraEvent` + modern band
> (#92/#41/#109/#113) — **top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).
> **★★ Batch-21 change (FOUR playtests: `nixon1972` 1972-modern-MP / `cpufull` all-CPU-1772
> [reached a scripted CPU game-over] / `trump2024` Ted-run 2024-modern SETUP-ONLY /
> `solo1916` 1916-solo — ONE escalation that re-prioritizes a debt item HIGHER, TWO era-keyed
> gaps [one PARTLY SHIPPED], ONE DH bug; NO new keystone, NO re-sequence, TOP-OF-QUEUE
> UNCHANGED):** **★★ #158 ESCALATED → re-prioritize HIGHER within the CPU/war track (debt
> #32):** `cpufull` is the 2nd live CPU game-over and **field-falsifies the flat-75%-oppose
> patch** (applied, but 4/10 factions rolled ≤25 and a game-ending peace passed at a **4-5-4
> plurality** after the CC-President's reject was overridden). The fix is **no longer** the
> flat 75% roll — build a **HARD VETO** (CPUs can't select a `triggersGameEnd`/surrender
> option in a solo/CPU-majority game; consumer is bare at `phaseRunners.ts:2871`, `pickAIResponse`
> has no anti-game-over term `eraGraph.ts:88-103`) **OR** a **points-based anti-peace bias**,
> **PLUS a non-plurality-overridable game-ending-peace** (a separate guard on the CC/Congress
> override path). **This is a SOLO-PLAY BLOCKER (like DH-29 was for Reconstruction) and RevWar
> floor #3 is now LEAKY** (debt #34a); build it WITH the #155 war pass (E3) AHEAD of the rest
> of the CPU/war track + the #75 handler (E9); bears on #114. S–M. **★ #170 era-keyed offices
> → EXTENDS the boot/offices work (§3 item 2 / E16), PARTLY SHIPPED:** the founding-seat half
> is LIVE (`cabinetSeatsForYear` `types.ts:1196` era-gates Navy/Postmaster/Interior); add the
> modern departments to `OfficeType` + a per-office `foundedYear`/`createdByBill`/`supersedes`
> table + the **DNI⇒CIA-Director supersession** (Ted-authoritative `trump2024#POST 40-41`) on
> the boot-seed `cabinetSeats: SeatSpec[]` refactor already planned; S–M, pairs with the
> scenario-boot/era-content work; debt #47. **★ #171 era-keyed draft-ideology TOGGLE → folds
> into the #4/#108 draft-profile work:** OFF in the modern present (Ted-authoritative,
> `trump2024`); an era-keyed boolean gating the #4 profile, keyed to realignment completion
> (1916 ON · 1972 ON · 2024 OFF); S; debt #48. **★ DH-68 → folds into the DH-60 era-event-
> precondition work (now multi-era):** port the 1772-graph `precondition` layer
> (`eraGraph.ts:12`) into the calendar-only 1856 builder (`eraEvents1856.ts:4`) + a new
> Progressive builder, and gate the Czechoslovakia/Hungary nodes on a WWI-end event; S, SAME
> surface as BUG-1 + E15; debt #49. **CORROBORATION only:** CPU suite #70–#79 (← `cpufull`,
> confidence ↑); modern band 2021-2025 + start-year confirmations #92/#41/#169/#164 (←
> `trump2024`/`nixon1972`/`solo1916`); crisis/war/Watergate #11/#45/#106 (← `nixon1972`); §5
> hinge polarity + #108 (← `solo1916`); gov-actions-as-COUNTS → #20, no-candidate-withdraw →
> #110. **`nixon1972` = ANOTHER GM-burnout stall** (upkeep-automation argument grows; cite,
> don't queue). **Decision-gated RECOUNT: 0** (the #158 which-way, #170 real-DNI-seat, #171
> ON→OFF boundary are designer-gated tuning within their epics). **No NEW keystone, NO
> re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — **but
> #158's escalation makes the CPU anti-game-over fix a higher-priority item within the CPU/war
> track.**
> **★★ Batch-22 change (`modernday` / `65f81fe8` — 2016-START current-rules 8-human modern MP,
> THE ONLY modern thread to cross an era boundary [2024 Populism→Near-Future]; GA-run but the
> marquee rulings are designer-blessed in-thread; TWO modern build items in EXISTING epics, a
> CURRENT-RULES spec-anchor for #68/#2, #171 PROVEN flipping, two small bugs; NO new keystone,
> NO re-sequence, TOP-OF-QUEUE UNCHANGED):** **★ #172 era-keyed confirmation thresholds +
> Nuclear-Option → FOLDS INTO E16 (cabinet/confirmation) + E14c (cloture):** UNBUILT (grep
> `cloture\|filibuster\|nuclearOption\|confirmationThreshold` in `src/` = ZERO; cabinet runner
> `phaseRunners.ts:2158-2223` is a flat scored pick, no vote). Build a `GameState.nuclearOption:
> {cabinet,scotus}` per-start-year BOOT FLAG (Cabinet 50%+1, SCOTUS 60% for a 2016 start;
> Ted-authoritative `modernday#POST 422-423`) seeded by `scenarioBoot` + a per-track threshold
> read + the SML enact/repeal action + the 60→fail→10-vote-conversion→auto-confirm-Mod fallback
> (`#POST 602-603`). **COMPOSES with #124 (auto-pass GATE — whether a vote happens, debt #38),
> #52/E9-9d (who votes aye), #171, and the batch-9 USER cloture decision (debt #27 — do NOT
> re-litigate)** — the flag is the era-keyed DEFAULT on the E14c cloture surface. S–M. debt #50.
> **★ #173 era-boundary-aligned starts → New-Game start-year PRESETS = the 14-band openings;
> couples scenario-boot (#115):** no start-year picker today (`NewGameScreen.tsx:6-21` hard-codes
> `'1772'\|'1856'`); add a presets table keyed to the canonical 14-band map (`#POST 2964`) ON TOP
> of the K4 `BootSheet`/`scenarioBoot` pipeline (each preset = another scenario-as-data-row,
> GATED on `scenarioBoot`). S. debt #51. **★ #68/#2 era-boundary pipeline → SPEC-ANCHOR
> CONFIRMED (current-rules live instance), no priority change:** the 6-clause point-banking
> ritual + score-reset + faction-trade + procedural-content swap fired at a REAL 2024 boundary
> (`#POST 1871`), matching `rep1800` — still folded into K3/K4 point-banking (§9.1.5, debt #5),
> but the spec is now solid. **★ #171 toggle PROVEN flipping ON(2016-24)→OFF(2024) in one save**
> (`#POST 1902`) — corroboration, sharpens debt #48, no scope change. **★ DH-70 → pv.ts NOTE
> (XS):** `pv.ts:77` already gives every negative trait a flat −5 and `Lackey` isn't shipped — so
> when ported, add `Lackey` to `NEGATIVE_TRAITS` with NO special-case; debt #52. **★ DH-69 →
> in-app rules / legal-move SURFACE (UX/onboarding):** no rules page / move-enumerator in `src/`;
> serves onboarding (#115) + the CPU cluster (the move-enumerator a CPU picker needs) + the
> GM-burnout theme; cite under #115/CPU-AI; debt #53. **CORROBORATION only:** #43 procedural
> generator owns the modern→future band (dataset exhausts at the future boundary, now live from
> `modernday` + `terror2000`, debt #19); cabinet/offices #124/#25/#170 (CIA-Director-as-intel-
> slot re-confirms #170, debt #47); the 2-layer scorer #18/#51 (debt #1, FROZEN SPEC, confidence
> ↑); legislation #8/#9/#10 + filibuster + 2/3-override (debt #26); impeachment under-spec
> DH-54/DH-66; CPU suite #70-#79/#1/#114; sub-phase taxonomy #110; conversion-shield #108.
> **Decision-gated RECOUNT: 0** (the #172 boot-flag-vs-derived question is designer-gated tuning
> within E16/E14c). **No NEW keystone, NO re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 →
> K3/K4 + scenarioBoot → E1) — this batch is corroboration-heavy + two modern build items (#172,
> #173) that sit in their existing epics.
>
> **★ Batch-23 change (`pop2012b` / `409a7c18` — the 2nd, DISTINCT 2012-START "Era of Populism"
> run [`pop` is the 1st]; GA-run [Rodja] but MrPotatoTed [game co-author, playing] point-of-order
> corrections are DESIGNER-AUTHORITATIVE; CORROBORATION-HEAVY, TWO legislation-data gaps in
> EXISTING epics; NO new keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED):** **★ #174 committee
> bill-packaging → FOLDS INTO E14b (#8/#9/#12):** the fullest packaging spec in the KB
> (`pop2012b#POST 724` verbatim) — a **ranking-member un-package/repackage COUNTER** (5 trait
> gates: Efficient+crisis-trait / higher-Legislative / Manipulative-vs-Pliable-or-Predictable /
> Iron-Fist-vs-Passive / Magician-equal-Legislative) + two **chair-add-bill** powers (5
> Legis+Efficient → off-committee tax; 5 Legis+Magician → one off-topic) + **cross-chamber/
> cross-committee package GUARDS** + the **Puritan committee-voting rule**. UNBUILT (grep
> `rankingMember\|packageOf\|chairBlock` in `src/` = ZERO; the committee runner
> `phaseRunners.ts:3463-3496` is chair-only via `committeeChairs[bill.committee]` `:3476`; state
> is chair-only `types.ts:1583`). Build on TOP of the still-unbuilt #8/#9 chair-block/package
> (chair lever + ranking-member lever = two pipeline points); needs a ranking-member field on
> `committeeChairs` + a `Bill.packageOf?: BillId[]`. **★ Cross-check the 5 gates + chair-add
> powers vs. `tedchange` BEFORE building** (open Q). S–M. debt #54. **★ #175 law-repealability
> DATA MODEL → FOLDS INTO #42 (bill-relationship graph) + §27.5 (statehood-by-bill):**
> MrPotatoTed ruling (`#POST 687-688`) — add `Legislation.repealable: boolean` + `lawClass:
> 'repealable'\|'replace-only'\|'permanent'`; gate Repeal on the flag, expose Replace for
> **tax/immigration** (replace-only), mark **statehood** `permanent`. UNBUILT (`Legislation`
> `types.ts:1506-1520` has neither field; grep `repealable\|lawClass` in `src/` = ZERO). The
> authoritative form of #42's `Not repealable`/replace-by-X constraints — build WITH #42. S.
> debt #55. **★ #88 PREDICATE SHARPENING (no new item):** the apocalypse/coup endgame fires at
> the meter FLOOR band, NOT "Crisis" — `pop2012b` shows Planet's Health at "Crisis" with NO clock
> firing (`#POST 632`), so the predicate is `meter === floorBand`, NOT `meter <= crisisBand`;
> folds into the existing #88/#158 end-condition + APOCALYPSE-clock work (debt #28/#32, §9.1.4).
> **★ #15 VP-rubric + cabinet-decline-CPU-only = CLARIFICATIONS (no new build):** the canonical
> rubric already says "+1 if YOUNGER than 60" (NO "+1 older than 60"), row 7 reads a discrete
> `canBeIndependent` tag (not office status), and cabinet accept/decline %s are CPU-only (gate
> behind `isCPU`; humans free-choose except VP) — all confirmations the E16 + convention-rubric
> scope already covers. **CORROBORATION only:** a 2nd 2012-boot re-confirms the modern cluster
> (boot #86 / primary→convention→general #47/#13/#15/#16/#18 / SCOTUS #52 / cabinet #25/#124 /
> leadership #70 / meta-pass #86/#99 / 2-layer scorer #18/#51 / 12A-VP #91 — confidence ↑);
> #90/#43 procedural-pol-gen LIVE again as career-track starvation (2nd corroboration of the dual
> gates, debt #19); a 3rd GM-burnout DEATH strengthens the DH-36/DH-69/#114 automation argument.
> **Decision-gated RECOUNT: 0** (the #174 `tedchange` cross-check + the #175 authored-list question
> are designer/content-gated WITHIN their epics). **No NEW keystone, NO re-sequence; top of queue
> UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).
>
> **★★ Batch-24 change (TWO founding-era playtests — `grass1772` / `5b1b2c33` [2-human-vs-8-CPU
> 1772, DIED of CPU-bookkeeping burnout, relaunched by ADDING humans] + `rookie1772` / `0039e941`
> [one-player ROOKIE solo run of the most-complex era]; the 5th + 6th captured 1772 threads;
> CORROBORATION-HEAVY, ONE net-new founding gap [#176]; NO new keystone, NO re-sequence, TOP-OF-
> QUEUE UNCHANGED — but the onboarding/solo-app/CPU-AI cluster's JUSTIFICATION is now the strongest
> in 24 batches):** **★ #176 founding MilPrep cap → founding war-content PREREQUISITE-ORDERING
> fix (S; folds into E1/RevWar + #67):** the forced founding war bills (Continental Army/Navy) must
> be able to move the MilPrep meter — the spreadsheet wires MilPrep 3-4 to the federalism-era Militia
> Act, so every forced-war roll is wasted + a permanent founding military crisis (`grass1772#POST
> 86-90`; `rookie1772#POST 32-33`). **★ Shipped-state nuance: the build has NO tier-prerequisite
> system at all** — `scenario1772.ts:9-17` boots `military:-2` as a raw `[-5,5]` scalar; `grep
> meterPrereq|meterTier|MilitiaAct|StandingArmy in src/` = ZERO. So this is a content/authoring
> constraint to honor WHEN founding war-content + a meter-prereq ladder are built (Cal's reverse-the-
> prereqs fix: Continental Army → MilPrep 3, +Navy → MilPrep 4, cap ~4-5 pre-federalism), NOT a
> regression. Open Q (designer): adopt the fix or keep the crisis. debt #56. **★★ ONBOARDING /
> SOLO-APP / CPU-AI cluster = the META-PRIORITIZATION signal (NO new scope; RAISES the justification
> of already-scoped items):** both runs DIED to the manual CPU-faction sim + opaque rules — the single
> biggest lesson across 24 batches. `grass1772` died because 2 humans couldn't hand-run 8 CPU
> factions (`#POST 328`) → fixed by adding humans; `rookie1772` is the strongest onboarding signal in
> the KB (rookie hits walls on phase-processing / meter-prereqs / phase-order / era transition /
> Lingering "never run before… more complicated than expected", `#POST 1370`). These map to items
> ALREADY in the roadmap: **DH-69** (in-app guided phase-processing + rules/legal-move surface, debt
> #53) + **#114** (CPU-AI owns the per-faction sim = the E9 handler suite + K5). CONFIRMED unbuilt
> (`grep rulebook|legalMove|availableActions|onboard` = ZERO; `grep cpuHandler|handlerSuite|
> runCpuFaction` = ZERO; only inline `isPlayer`/`playerFactionId` gates in `phaseRunners.ts`). With
> `modernday`+`pop2012b` this is the **4th GM-burnout death** (DH-36 cluster). **RAISE priority/
> confidence on E9/K5 + the DH-69 UX item; do NOT re-sequence.** **★ #153 command-bootstrap = 4-SOURCE
> corroboration (Bartram):** `grass1772`'s 90-yr-old CPU botanist John Bartram elected 1st President
> from a near-0-Command boot (`#POST 202-205`) + "almost no one starts with command" master polSet
> (`#POST 538-540`) — high-confidence, corroboration only (the build already zeroes rookie Command +
> PV drives elections). **★ Minor war-engine constraints:** clamp the doubled-officer Planning term
> to 0-5 (`revolutionaryWar.ts:212` `*2` can hit 6+; `rookie1772#POST 35`; XS); the war engine needs a
> scripted-event win path (`grass1772`'s "King George grants autonomy" event win — a 3rd RevWar
> win-path; folds into #155/#56, no new epic); surface meter prerequisites in-UI (UX, with DH-69).
> debt #16, #56. **CORROBORATION (confidence ↑, no items):** the founding cluster (#86/#133/#100/#101/
> #92 era-as-content-band: Lingering/retirements/SCOTUS OFF in Independence, ON at 1788) re-confirmed
> from a 5th+6th 1772 angle; #67/#134 Lingering-too-complex 2nd-source; #68 point-banking + draft-
> order re-confirmed; d3-vs-d6 election-dice desync + enthusiasm-unresolved-even-to-designer reinforce
> "the build owns ONE canonical election formula" + the #18/#51/#124 FROZEN-SPEC risk (debt #1).
> **Decision-gated RECOUNT: 0** (the #176 reverse-prereq question is designer-gated WITHIN the
> founding/meter work). **No NEW keystone, NO re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 →
> K3/K4 + scenarioBoot → E1) — but the onboarding/solo-app/CPU-AI cluster (E9/K5 + DH-69) now carries
> the strongest justification in the corpus.

> **★★ Batch-25 change (`principle1772` / `049ce855` — "Always stand on principle… even if you stand
> alone. A Single Player 1772 Adventure"; the 7th captured 1772 thread, DESIGNER-GMed [@MrPotatoTed,
> the game co-author, hand-ran all 9 CPU teams; @vcczar live-ruled] 1-human-vs-9-CPU run that REACHED
> a natural ~1800 endpoint; CORROBORATION-HEAVY, TWO net-new federalism gaps [#177, #178]; NO new
> keystone, NO re-sequence, TOP-OF-QUEUE UNCHANGED — but the strongest #114 escalation in the corpus):**
> **★ #177 federalism foreign-affairs decision-event spine → FOLDS INTO federalism era-content (E1/
> scenario1788 + era-event/eraGraph #92); M.** Lift the TWO `eraGraph.ts` walls — `:153-155`
> (`chartIndex >= 49` "Federalism out of scope") + `:150-152` (the pre-1789 president/cabinet decider
> ban; gate on `year >= 1789` instead) — then author the 8-event spine (French-Rev neutrality/alliance,
> Genêt, Pinckney/Jay Treaties, Haitian-Rev, alt-history "Bourbons Restored" `realEvent:false` branch,
> NW Indian War, Bank-recharter) with **per-power diplomacy-relation meters** (none exist today) +
> DomStab/EconStab shocks + enthusiasm deltas + implementation-blunder rolls + the late-1790s cabinet +
> Key Advisor Hamilton. Couples to E12 diplomacy (#107/#162). Open Q (designer): confirm the intended
> next-era build (not a permanent scope wall); V deferred the EV/territory %-chances (POST 1801). debt
> #57. **★ #178 treaty-grants-TERRITORY + bounded "3-strikes" retry → FOLDS INTO statehood/territory +
> DH-61; S.** Add a treaty→`admitState` post-effect path (Jay Treaty grants WI/IN/IL/MI — the
> Oregon-Treaty §10.4.2 pattern) + a `retriesRemaining` (default 3) per-event budget on territory-gating
> events (origin: the NW Indian War "3 chances," POST 207) → GENERALIZES DH-61 across treaty/war/event
> gates. CONFIRMED unbuilt: `admitState` (`territories.ts:8-23`) admits only from the static
> `EXPANSION_STATES_BY_ID` registry; `grep treaty|retriesRemaining` = ZERO. Open Q (designer): is
> ≤3-fires canonical for ALL territory gates, or a GM house rule? debt #58. **★★ #114/E9/K5 ESCALATED
> (justification, NOT new scope) — the LOAD-BEARING PREREQUISITE for the shipped solo mode to be
> COMPLETABLE.** `principle1772` is the FIRST 1772-cluster run to reach a natural endpoint — and ONLY
> because the designer himself hand-simulated all 9 CPU factions (cabinets/draft lists/leadership votes/
> event responses; he REWROTE the CPU career-track heuristic mid-run, POST 323). It proves the shipped
> 1-human-vs-9-CPU shape (#114) IS completable AND that the per-faction CPU sim (the E9 handler suite +
> K5 CpuController) is exactly what makes it so without a designer-in-the-loop. The cluster now carries
> BOTH ends: 4 GM-burnout deaths (cost of NOT having it) + a designer-paid success (proof of the
> ceiling). RAISE confidence on E9/K5 (reflects on #114/DH-36); do NOT re-sequence. CONFIRMED unbuilt:
> `grep cpuHandler|handlerSuite|runCpuFaction|perFactionSim in src/` = ZERO. **CORROBORATION (confidence
> ↑, no items):** #176 founding MilPrep ordering bug now DESIGNER-FLAGGED + 3rd-source (Ted: "Seems…
> dumb," POST 73/259-261) — confidence ↑, still a content/authoring constraint not a regression (debt
> #56); #153 command-bootstrap now 4-source (Whipple, an emergent Iron-Fist Admiral, 1st President with
> no celebrity head start); plus 7th-angle re-confirmation of #86/#133/#100/#101/#92/#62/#31/#45/#155/
> #158 + the kingmaker ≤1-protégé/turn cap (POST 224). **Decision-gated RECOUNT: 0** (the #177 scope-wall
> + #178 ≤3-fires canonicity are designer-gated WITHIN their own work). **No NEW keystone, NO
> re-sequence; top of queue UNCHANGED** (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the CPU-AI
> cluster (E9/K5) now has the corpus's strongest justification, and #177/#178 are the federalism-era
> next-build content. game-mechanics §20.3.1, §17.6.1, §30.15.

**Cheap fixes first (do immediately — XS each, high value):**
**★ BUG-0/QW0 (relocation cap `5`→`4`, `types.ts:247`, divergence #9 — ★ batch-12
`smallbugs#POST 734-735` vcczar-12-30-25-APPROVED, now FULLY RULED with alt-state
exemption; the cheapest win; do it FIRST) · BUG-1 (era-event filter, gates
federalism — now ALSO subsumes the batch-7 era-events-predating-start-DROPPED
hole, LIVE-confirmed by the LA-Purchase-dropped-at-1800-start episode; DH-30
event-scheduler-min-floor is its companion) · the event-scheduler MIN-floor
(DH-30: minimum = 20% of the era's max [round down], spill to the 5 generic
anytime events if none fire — pairs with BUG-1, same scheduling surface) · BUG-3
(no-PM-General guard) · the ±3 meter-swing clamp (meter-model divergence, now
confirmed live by `drums` #80 — also covers cabinet ideology swings; **batch-11
unconditionally ready, binds at `calcStateVote` `:3709-3711`**) · auto-Carpetbagger
(divergence #2) · **★ batch-12 50/50 House inverse-control (#135)** (`tedchange#POST
65`, one-line edit at `phaseRunners.ts:1864`) · **★ batch-12 draft re-rules
(#136/#137/#138)** (no Command in random skill / no cross-party draft / 3 traits
+ 3 alt-states) · **★ batch-12 Integrity-can't-nominate-Controversial (#131)** +
**Challenge-Legislation-can't-target-REPEAL (#132)** (one filter helper per
rule) · **★ batch-12 Pres signature in 2.6 (#139)** (phase-sequence reorder) ·
**★ batch-12 FL trait gain 5%+/3%- (#141)** (refines existing const) ·
**★ batch-12 CPU CJ ladder (#142)** (the ladder spec is authored) ·
**★ batch-13 #143 post-election Command decay** (RULED, standalone — add a 40%/−1
Command pass at `runPhase_2_10_End` `phaseRunners.ts:4171`, gated on
`isPresidentialYear`, after the 2.9.4 ticket roster is known; applies via the
existing `loseCommand` `abilities.ts:15`).**
(BUG-2 rides SCOTUS content; **#54 investigation committees is READY** — rules
authored by `hd` #65; **#85 5%/half-term retire/death** is a 1-line rules-const
refinement; **DH-31 procedure-bills-bypass-veto** is a small verify-and-fix in
the bill-typing epic; **DH-32 SCOTUS-voids-a-STATE** is a one-rule guard in the
SCOTUS ruling-effect path; **DH-43 (batch 8) Vermont home-state mapping** is a
dataset/data fix; **DH-40 (batch 8) SCOTUS-justice-count-not-auto-packaged →
game-stall** is an XS-S bug-fix in the bill-packaging / SCOTUS-establish path.)

**ENGINE TRACK — Phase 0 (keystones, parallelizable after K0):**
**K0) Seed the RNG → K1) `State.policies` + `State.electionMethod` shapes →
K2) `ActionRegistry<Ctx>` (now ~6× leverage — do first if only one lands;
**batch 6: adds `requires?: AmendmentPredicate` field on `GameAction<Ctx>`
from day one — divergence #16**) →
K3) `advanceEra(snap)` — **CONDITION-DRIVEN (batch 7, divergence #18): the era
boundary fires on game-state/meter/TERRITORY triggers per half-term, NOT a year
boundary; no `target` arg**; + era-content registry + **content gated on
`game.eraBand` + a new `territoryOwned` predicate, not literal year** + per-era
point BANKING (#68). RECONCILES #68 + §26 + §27.1 — see §9.1.5 →
K4) Era enum widening (`gilded`/`progressive`) + `scenario1788` (federalism) +
era-keyed draft-grant (#69) & amendment-ratifier (#64) & double-points-issues
(#87) & procedural-pol-gen-startYear (#90) tables + **the `BootSheet` schema
(batch 6 / §26.1 / divergence #17 — per-`{era, startYear}` state roster keying;
EXPLICITLY EMPTY at boot baseline; Senate-class verifier + `TRAIT_CONFLICTS`
validator)** + **★ batch-10 (#115): the shared `scenarioBoot(BootSheet)` PIPELINE
itself — verified NO shared boot abstraction today (`scenario*.ts` are hand-authored
copy-paste builders); factor it ONCE here + encode the undocumented setup rules
(boot-Command #115a, CT-seeding [PARKING LOT until DH-25 settled], Senate-class
[replace the `1856` literal at `phaseRunners.ts:3885`], vacant-seat fill ladder #115b,
era-industry init). PROMOTED — do it WITH the first new scenario, §9.1.9** + **the
per-era CONTENT-BAND registry `{bills, eraEvents, draftees,
biasTable, advanceWhen}` (batch 7) — early-republic sub-bands (Republicanism/
Democracy/Manifest-Destiny) are content-band markers, NOT new enum values**
(NOT gilded/modern first, §9.1.1) →
K5) `CpuController` scaffold (`src/engine/cpu/`) — the orchestrator + handler
interface + tie-break utilities + `repair()` backfills for `cpuCommitments?`
and `recentScandalIds?`. **NEW IN BATCH 5.** Parallel with K3/K4 (no scenario
dependency). See §6.6.1 + §9.1.3.**

**ENGINE TRACK — Phase 1 (subsystems, roughly this order to minimize rework):**
**1) Federalism era epic (`scenario1788` + content; pulls in #2-#5; needs BUG-1;
*can ship with stubbed CPU handlers — K5 wires in later*; **rides the `BootSheet`
schema from K4 — the 1788 boot is the first instantiation**; **★ batch-12: the
DRAFT RE-RULES land WITH the federalism boot (because draft logic is at scenario-
boot scope) — #136 random skill on draft has NO Command (verify the existing pool
exclusion at `phaseRunners.ts:187-197`); #137 no cross-party draft (gate
`partyId` to IRL party at draft time + exclude cross-party drafting in
`pickBestForFaction` at `phaseRunners.ts:33-53`); #138 3 random traits + 3
random alt-states per draft (re-rule into era-config; SUPERSEDES 5/5)**;
**★ batch-15 (#153, XS): DOUBLE every Command-gain %** — rookie Command=0 ALREADY
ships (`phaseRunners.ts:216`), but `addCommandPoint` (`abilities.ts:33`) has no global
×2 knob (callers pass `1`/a const); add a config multiplier (Ted official,
`terror2000#POST 91-93`). The no-re-roll-on-held-expertise half (#153b) is ALREADY
`addExpertise`'s dedupe behavior (`expertise.ts:5`) — a forward-only invariant, no work
unless a RANDOM expertise grant is added;
**★ batch-13: TWO HARD PREREQUISITES land WITH the 1788 boot — DH-61 (boot-seed
the start-year's active wars: 1788 → NW Indian War, 20%-loss / WS −2; a
`BootSheet.activeWars` field + a `scenarioBoot` hook over the generic `War` model
from #3 — they FORGOT it in `oopscpu#POST 338-344`) + DH-62 (the pre-12A
two-votes-per-state / no-ticket EC mode — see #4 below; an era-keyed election-mode
variant exercised across 1788/1792/1796). Neither is optional for `scenario1788`.**) →
2) Bill typing + spending cap (+ national-surplus/debt integer; **batch-7: fix
the procedure-subtype veto MIS-ROUTING — DH-31 / divergence #21 — procedure bills
skip the President sign/veto step**) →
3) Generic cross-era war system (divergence #6; **build ONE engine — verified only
`revolutionaryWar.ts` exists, and this is the engine the "Cold War" relabels, §9.1.8**;
needs BUG-3; **design it multi-theater + tiered, with the multi-confirmed formula
`Win% = Difficulty + Planning + Officer×10 + MilPrep + Benchmarks`, `WS ≥ +11`
auto-win, war-end `WS×2 = %`, post-war defeat `\|WS\|×2×10`, naval-N-then-ground
per-war, Treaty A-D + 3-roll chain — multi-era confirmed by `drums` + `nuke`**;
**★ batch-9 DH-47: BUILD A REAL RESOLUTION/PEACE PATH — wars never end today (Korea
ran ~2 decades) — and ideally army/navy/air BRANCHES**; **★★ batch-15 #152: the
DEFEAT branch must apply a LOSS PACKAGE** — the shipped resolver ends a war at
`warScore≤−50` (`phaseRunners.ts:3618-3620`) but logs only; add officers −1 Mil + −1
all-elections, **President −1 ALL future elections** (inverse of the victory +1,
couples into `calcStateVote`/#18), Party-Pref crater, + multi-phase carry (naval→ground;
"Invasion"→"Counter-Terrorism"; Afghanistan→Phase II) across half-terms; `terror2000`
recorded the FIRST whole-war DEFEAT, War on Terror LOST ~2005, `POST 639/656-662`) →
**3b) Civil-War / Reconstruction epic [1856-arc — COMPLETES the shipped 1856
scenario]** (the Major-tier instance of #3; secession #58 + sectional crisis #59
first — note `State.isSlaveState` ALREADY EXISTS (`types.ts:1329`); then the
two-theater war #56 + the batch-7 CW VARIANTS #97 + Reconstruction readmission #57
+ Canada #60; **wire CPU handlers as you go — the 1856-arc is the first scenario
to get a full K5 handler suite**. **★★ BUILD REQUIREMENT (DH-29): the
Reconstruction half is UNWINNABLE solo without a CPU-passable readmission path —
ship a CPU default-vote bias for the flagged historical plan (handler #2) AND/OR
an era-boundary auto-resolution (K3) — see §9.1.6; the readmission half should
land AFTER K5 handler #2 or carry the era-boundary auto-resolution as its
fallback**) →
4) Per-state EC method (divergence #5) + **the 12A legislature-elector toggle
(divergence #20 / #93 — a NEW legislature-majority resolution branch, NOT a `ctx`
re-tag; + the pre-12A `conventionsEnabled=false` gate)** + **★ batch-13 DH-62: the
pre-12A two-votes-per-state / NO-ticket EC mode (a SECOND new resolution branch —
top EV = Pres, runner-up = VP, no separate VP ballot) + the same-state-EV exclusion
(`oopscpu#POST 197`) + the throwaway-tie defense via the §25.1 pre-12A nomination
trio (handler 9a). M; a HARD prerequisite for `scenario1788` — land WITH E1 (#1)** →
4b) **[early-republic, batch 7] Slavery-as-state-flag + Cohens-v-Virginia
(#94 — bind the EXISTING `State.isSlaveState` to Plantation; abolition-toggle-off;
the persistent `Cohens` SCOTUS rule-modifier disallowing legislative abolition;
all new states enter free) + Second Bank recharter clock + Bank War exec action
(#95 — `game.secondBank` 20-yr clock; creates the unremovable President-of-US-Bank
seat; "Remove Deposits" exec-action) + statehood-by-bill ORGANIZE→ADMIT two-step +
unorganized-territory draft gate (#95, the SAME `territoryOwned` predicate as K3)**
→
**4c) [batch 11 NEW] Bank-War → Independent-Treasury economic CONTENT engine
(#116 / §29.7) — the long-run state machine ON TOP of 4b(b)'s Bank institution.**
NET-NEW = a `game.economy?` state machine (a recurring Bank CRISIS bill keyed to a
**Panic/EconStab CRISIS state** — EconStab IS `meters.economic`) + **`Bill.replaces?:
string`** (the Independent-Treasury bill marks "Replaces Bank of the United States" →
removes the Bank institution) + **`Bill.lockedUntilYear?: number`** (per-bill-class
change cooldown — the "no tariff change until 1836" cadence) + sectional ±100
(Agriculture/Finance) effects on resolution. **Build it EMERGENT** (recurring CRISIS
bills resolving an EconStab CRISIS — how the save played it), not a scripted branch.
**Depends on #2 (Bill.type/crisis bypass) + #6 (named EconStab meter + crisis/cascade)
+ 4b(b) (the Second-Bank institution it recharters/replaces).** Verified NO economic
state machine today (`applyEffect` only nudges meters; `Legislation` has no `type`/
`replaces`/`lockedUntilYear`).
**★★ [batch 18 NEW] The INTERWAR layer on E4c — the Great-Depression META-event +
EconStab cascade + crisis-gated bills + DH-67 (#160 / §29.7.1). E4c is now
WELL-SPECIFIED ACROSS TWO ERAS** (the 1820s Bank-War / Panic-of-1837 AND the 1930s
Great Depression both want the SAME `game.economy` machine + EconStab crisis +
crisis-gated bills) — so build E4c GENERIC, then add the interwar content as data.
NET-NEW over 4c above: **(i)** a **Great-Depression META-event** = ONE era-event row
(game-mechanics §10.3, binding at `runPhase_2_4_3_Era` `phaseRunners.ts:2796`) carrying a multi-meter
shock bundle `{economic:−4, revenue:−2, quality:−1, military:−1, partyPref:−3}` + an
(a)-markets-resolve / (b)-welfare-bailout presidential decider (the −4 EXCEEDS the
±3 swing cap — flag it as a meta-event override); **(ii)** the **EconStab→Recession
CASCADE** = 2 random industries −1 in EVERY state (seeded RNG, not `Math.random`) →
an **EV-reflow roll** (couples to §11.5 industry-leadership + §28.9 census/EV) + a
DomStab-drop chance + **EconStab-in-Recession gates other meters' gains**;
**(iii)** **crisis-GATED bills** = `Bill.requiresCrisis: 'economic'` (Fed-currency-
in-crisis / worker-bailout INVALID until the crash fires — reuses #2's crisis-bypass
primitive); **(iv) ★ DH-67 — EVENT-GATE the era's BLUE party-modifier bias to the
crash having fired** (read a `game.crashFired`-style flag at the `partyPref*5` term
`phaseRunners.ts:3709-3711`, NOT a static era-band constant) — **the highest-value
single fix in batch 18: the switch that makes the meta-event load-bearing instead
of cosmetic-on-top-of-a-static-band; S, build it WITH the meta-event**; plus
**(v)** the **per-faction industry-impact auto-tally** (#166 — the build owns the
"how many of my gov/sen/rep per lead-industry" count; manual = GM-burnout, DH-36) +
**per-era meter-table versioning** + **audited event effect-signs with an `auto|roll`
flag** (#165, the SAME fix as DH-53 extended to events). **Size: M as an E4c
extension** (meta-event+decider S; cascade M; crisis-gate flag reuses #2; DH-67 S).
**Open Q (human-gated tuning):** keep the crash a one-shot meter shock (current paper,
recovered in ~4 years via ordinary bills) or apply a persistent drag ordinary bills
can't quickly undo? **Build it EMERGENT/data-driven over the SAME `game.economy`
machine — do NOT special-case a second economic engine.** game-mechanics §29.7.1. →
5) Amendments-as-state (now incl. era-keyed ratifier #64 + SCOTUS-gates-bill-class
hook + **the K2 `requires?: AmendmentPredicate` consumer pattern lands here** +
**batch-7: amendments mutate CORE rules — term-length 4↔6, one-term-limit,
suffrage, ratifier threshold; undoable by later amendments; the "Sexenio", §27.8**
+ **batch-8 (#100): a Gov-requested judicial-review-of-a-ratified-Amendment path
(SCOTUS can strike/demote an amendment → revert to Gov-action, Congress may re-pass)
+ the ratification threshold is itself amendable (3/4 → 2/3) — both confirmed from a
1772 start (`tea1772`); the review path pairs with the SCOTUS docket (Phase-2 #25)**
+ **★ batch-11 (#119 / §29.8): RE-SCOPE this epic to carry the LIFECYCLE +
legislation-class-block. Add an explicit `lifecycle: 'proposed'|'inCommittee'|
'onFloor'|'pendingRatification'|'active'` state on each amendment, an
active-amendment → BLOCKS-a-whole-legislation-class effect checked AT PROPOSAL TIME
(excise-tax ban; suffrage class — the proactive face of the *Pollock* gate, which
today is framed only as a per-bill repeal/until-ratified constraint), and the
un-bundleable flag (amendments can't ride bill-packaging). Verified NO `amendments`
field today**; gates BUG-2; **★★ batch-12 (`smallbugs#POST 250-269`, vcczar,
game-mechanics §30.3): AMENDMENTS NOT SCOTUS-CHALLENGEABLE — vcczar's ruling
OVERRIDES `tea1772` #100. SIMPLIFICATION: DROP the Gov-requested judicial-review-
of-an-amendment branch above (the SCOTUS-strikes-an-amendment path from #100);
KEEP the strike-a-statute path + the mutable-threshold field. Govs cannot
challenge amendments — the Constitution is by-definition constitutional. This
is a build-target constraint that simplifies E5↔E25 interaction**) →
5b) **[early-republic, batch 7] Ideology-as-CIRCLE foundation refactor
(divergence #19 / #99) — add a central `ideologyDistance(a,b,circular)` helper +
MIGRATE the 10+ open-coded `Math.abs(IDEOLOGY_ORDER.indexOf…)` sites to it
(behavior-preserving while the flag is off); gate the wrap on
`GameState.ideologyIsCircular?`; extend conversion targeting to same-OR-adjacent.
DO THE HELPER + MIGRATION EARLY (cheap, additive; every later ideology consumer —
conversion handler 9f, SCOTUS within-1-step §26.6 — calls it from day one). §9.1.7.
**★ batch-12 (#127, S — `tedchange#POST 18-31, 34-39, 38, 51-53`,
game-mechanics §6.3.y + §6.4.y + §27.7): CONVERSION / IDEOLOGY-SHIFT RATE
SCHEDULE — fold INTO this helper PR. The adjacency rule (same-OR-adjacent
ideology eligible for same-party conversion, `tedchange#POST 38, 53`) is a
one-site filter change at `phaseRunners.ts:993-1003`; the LW↔RW Pop 25%
cross-circle shift (`tedchange#POST 24, 28-29, 51`) is a special-case shift
table that rides the circle helper at the wrap; the 33% party-flip rate
(`tedchange#POST 34-39`) is a refinement of `CONVERSION_ODDS.poach.matrix.cross`
to match the target post-willingness-amplifier rate; auto-Two-Faced grant on
successful LW↔RW Pop flip. + ★ batch-12 (#129, XS): KINGMAKER → PROTÉGÉ
TRAIT ALLOWLIST/BLOCKLIST — a `KINGMAKER_PASSABLE_TRAITS` /
`KINGMAKER_BLOCKED_TRAITS` config (pass: Kingmaker-basic / Celebrity / Hale /
all positives; block: Master+National Kingmaker / Frail / Flip-Flopper /
Two-Faced).** →
6) Meter-model generalization + APOCALYPSE meter-driven endgame [NEAR-TERM,
**batch 6 addition**] (±3-clamp + crisis/cascade over the existing `NationalMeters`;
**add `GameState.endgameClocks` + per-meter band-monitor in
`runPhase_2_5_1_Lingering` + termination path firing `game.gameEnded` when
`remainingYears` hits 0 — divergence #14**; benefits every era; the Populism
Planet Health 10-yr clock is one configured row) +
**★ batch-12 (#134, M — `tedchange#POST 397-408`, game-mechanics §11.1.y):
LINGERING 7-STEP STRICT ORDERING + TAX/TARIFF DECAY CARRY-FORWARD. Re-scope
this epic to also re-spec the meter-decay/volatility surface in
`runPhase_2_5_1_Lingering`. Add `game.taxTariffDecayQueue?: { decayDelta;
appliesAtPhase: 3; lifeYears }[]` (NEW carry-forward state) + an explicit
7-step internal ordering on the runner (never re-do a step). Volatility roll
at step 7 = THIS-phase-only (not added to running totals); tax/tariff decay
propagates forward to NEXT phase's step 3 (decay continues across half-terms).
SAME surface as the meter-model + APOCALYPSE work — same tick site
(`runPhase_2_5_1_Lingering`); `repair()` backfills `[]`.** →
7) Persist/auto-fill House slates & committees [NEAR-TERM — scaling wall b] →
8) Procedural pol generation [NEAR-TERM — scaling wall a; **era-coded by
rule 3.0.18 with a 2020 startYear for Populism (#90), plus a dataset-exhaustion
fallback — both gates trigger the same generator**] →
**9) CPU handler suite [batch 5 NEW; ★ batch-13 FIELD-VALIDATED] — depends on K5.
~15 lightweight PRs in §6.6.1 order. ★ Batch-13 (`oopscpu`) does NOT change the
ORDER but turns #70/#72/#73/#74/#75/#76 from "designed" into "designed +
field-validated with concrete failure modes + Ted's fixes" (lower spec-risk) and
FOLDS the OC-* sub-rules into the handler rows:**
(a) candidate selection 75/25 #72 **+ batch-13: the pre-12A nomination trio +
VP retention (#144, RULED) + same-state-EV exclusion** → (b) legislation
NAY/AYE/NAY #74 + **conditional-vote-rules consumer (batch 6, `pop` POST 1111 —
consults `factionLeader.compelledVoteRule?: Predicate → Vote` BEFORE the §25.6
heuristic)** + **★ batch-13 OC-3 (BALANCE-CRITICAL, the HIGHEST-priority sub-rule
here): a crisis-vote ideology-floor gate (don't AYE a crisis bill that costs your
own cards) + a secession/slavery-active check before an Abolish-Slavery crisis bill
can pass — `oopscpu#POST 162-180`** → (c) leadership IRV #70 **+ batch-13 OC-2: ONE
canonical `chamberControl(snap, chamber)` helper shared by leadership-select + the
≥60% proposer gate (consolidate the inline `senateMajority`/`houseMajority` dup at
`phaseRunners.ts:1863-1864`)** → (d) cabinet confirmation #73 + **batch-6 SCOTUS
within-1-step auto-AYE rule (§26.6.1) + Manipulative-Pres compel-retire as a
distinct trait-power** + **★ batch-13 OC-1 (scandal-resignee re-appointment
cooldown, reads `recentScandalIds?`) + OC-5 (gate a cabinet-vacating SCOTUS
appointment behind the firing-precedent rule) + the validated crisis cabinet-fill
ladder `oopscpu#POST 322`** (lands the DH-23 fix — XS-S because the system doesn't
exist yet) → (e) convention CPU #71 (owns DH-8 + DH-17; **batch-8: guard
the lone-ideology minor-candidate convention exploit #104**; **★ batch-13: this is
the ONE handler `oopscpu` could NOT validate — 1788 predates conventions; stays
`drums`-only-spec; recommend a post-12A all-CPU run to validate it, §9.1.3**) → (f)
conversion poach #76 **+ batch-13 ideology-circle LW↔RW Pop 25% confirmed** → (g)
A/B/C event vote + meter guard #75 + DH-21 **+ batch-13: Pliable-Pres-defers +
Egghead-tiebreaker validated `oopscpu#POST 335-337`** → (h)
faction-leader replacement #78 → (i) primary CPU #63 → (j) governor-action
picker DH-19 **+ batch-13 OC-7 help-allies term-config sub-rule (RULED #145)** →
(k) reciprocity enforcer DH-20 → (l) scandal smoother DH-22 **(OC-1 reads its
`recentScandalIds?`)** → (m) VP rubric + retention #72 → (n) Justice vote + drift
#79 → (o) faction rename trigger #40 **+ kingmaker handler OC-6 pairing tiebreak**.
PARALLELIZABLE — multiple handlers can land concurrently.**
→
10) Convention machinery (uses K2 + K5; the biggest single subsystem; **CPU
side is handler 9e above — DH-8 must-own**; **★ batch-11: the ballot loop / momentum
/ VP-rubric / 8-stage general / party-specific thresholds (2/3 vs 50%+1) /
presidential-promise buyouts are now MULTI-CAMPAIGN confirmed (§29.11a) — ready. BUT
the delegate-APPORTIONMENT sub-PR is gated on the NEW delegate-class fork (AI-allocator
vs player-rigged, §29.11b) — author that decision before the delegate step; it does
NOT block the rest of E10**) →
**10b) Succession / eligibility / acting-president (#61) + contingent House
election & tied-chamber control (#62)** [1856-arc election additions; pick
top-2-vs-top-3 (DH-6) — **BUT first, the contingent-election rules themselves
must be authored (PARKING LOT, divergence #10) — author before build**; folds
DH-3; **batch-8: add stat-collapse → forced presidential resignation (#105) — a
sitting Pres whose Command + "most" skills hit a floor is forced to resign — as a
one-rule addition here, NEAR the rest of the succession line**; **★ batch-11
(#61 EXTENDED / §29.9): RE-SCOPE to the FULL chain. The KILL already ships
(`assassination-killed` anytime event, `anytimeEvents.ts:232`) but death only sets
`presidentId=null` (`vacateOffice`, `phaseRunners.ts:2449`) — NO succession. Add:
assassination/death-Evo → VP SUCCEEDS → must FILL the VP vacancy (GATED on #5's
VP-Vacancy amendment being `active`) → acting-president ACTION-DIVERT roll keyed to
traits (Easily Overwhelmed → 50% VP-acts, layered on the 0-Command-inert state) +
the trait-acquisition side-effect (overwhelmed successor gains Easily Overwhelmed +
Pliable). The VP-succeeds + acting-divert path is ready to spec (rule documented
end-to-end); the line-of-succession/impeachment half stays parking-lot (DH-54);
**★ batch-13 (`oopscpu#POST 324-329`, Ted-RULED) gives this a RECONCILED two-branch
spec: a clean DEATH → VP = FULL President (refuses "Acting", NO action-divert roll,
NOT auto party/faction leader → re-run the leadership IRV, handler 9c); the
acting-president + action-divert read above is now SCOPED to incapacity /
0-Command-inert / ineligible-substitute ONLY (SUPERSEDES the `arkzag` framing for
the death case). S addition within E10b**] →
11) Governor's actions library (state-stack-aware via handler 9j) →
12) Diplomacy actions library (**★ batch-9 #107/§28.3: THE real Cold-War foreign
subsystem — 8 per-nation relation meters + ambassador actions incl. Provoke;
DH-46 add downward pressure + the Cold-War ≤Neutral cap on USSR/China; DH-45
fix the USSR-collapse trigger chain**; cap "Extend Credit to all" — DH-4) →
13) Executive actions library (resolve DH-9 stat + DH-10 blunder-still-scores) →
14) Legislative micro-mechanics (block-and-replace, packaging, filibuster +
veto override = 2/3 both chambers per #82) + investigation committees #54 (5d6
spec ready, #65) →
15) Era-event extensions (multi-decider, census deltas, territory grants; resolve
scheduling fork [#4 + BUG-1 + DH-2] here; **★ batch-11 DH-60: add a per-event
`requires?: Predicate` territory/asset/state prerequisite + a filter at the firing
path — verified `buildEraEventsForYear` (`eraEvents1856.ts:4`) gates ONLY by year &
the `EraEvent` type carries NO precondition field. The concrete face of #92
territory-content gating; SAME firing surface as BUG-1's era-lock filter
(`phaseRunners.ts:2817`) + K3's `territoryOwned` predicate — build them together. S**) →
16) Cabinet & Congressional leadership richness + cabinet retention replacing
the wipe (divergence #8 — M) + **dynamic cabinet seat list — `cabinetSeatsForYear`
becomes BOOT SEED only (divergence #15, batch 6); `GameState.cabinetSeats:
SeatSpec[]` + `Legislation.createsCabinetSeat?: SeatSpec`** + **★ batch-9: ADD THE
ABOLISH PATH — `Legislation.abolishesCabinetSeat?: SeatSpec` (offices created AND
abolished by law, founding→modern; §28.5; Postmaster-General abolished, HEW split)**
+ **cabinet-confirmation system (DH-23 — XS-S because system doesn't exist yet, lands
here as a sibling of the seat-fill step)** + offices-created-by-law (#66) +
**★★ batch-12 (#124, M — `tedchange#POST 1-4`, game-mechanics §9.3.7): CABINET
→ ENTHUSIASM REWORK is a TEARDOWN of the existing lobby→enthusiasm path —
re-scope this epic to build confirmation + #124 enthusiasm rework TOGETHER
from day one. (a) LOBBY satisfaction writes POINTS to the `Faction.score?`
ledger (NOT enthusiasm) — moves the cabinet-lobby coupling from `enthusiasm`
to the score ledger; (b) IDEOLOGY COMPOSITION drives ENTHUSIASM via the ±3-cap
clamp — ≥50% cabinet of an ideology = +enth that ideology, ≤20% = −enth;
(c) 3-shifts/half-term cap holds. Designer-gated OPEN numerics (Big-4 33% /
others 25%, etc.) — ship a const table that can be re-tuned post-design.
LANDS AFTER K2 + K5 (cabinet picks are CPU actions; consumes the conditional-
vote-rules primitive). + ★ batch-12 (#131, XS): INTEGRITY-CAN'T-NOMINATE-
CONTROVERSIAL — one filter helper used by the cabinet picker. **★★ batch-15
(#124 SHARPENED + #151 NEW, `terror2000#POST 486-489, 1280, 428-441`,
game-mechanics §9.3.7 + §9.3.9): RE-SCOPE E16 a THIRD time. (i) The enthusiasm
channel is now Ted's LIVE-retuned 3-STATE upset/fine/happy model** — per-faction
count of satisfied lobby-wants → fine(0) / happy(+1 @20%/10%) / upset(−1 @20%/10%);
**ONE roll per faction**, same-ideology factions STACK, ±3 cap (this FIXES the "Mods
+18 off one cabinet" stacking bug — happiness could stack but unhappiness couldn't;
now symmetric). This supersedes the bare "≥50%/≤20% ideology-composition" sketch and
**moves #124's designer-gated %s from OPEN to mostly-RESOLVED** (only the Big-4-vs-rest
weighting #9 may residually remain). **(ii) NEW #151 same-party appointment-FAIRNESS
penalty** (Era-of-Terror onward): −500 points per slighted same-party faction (incl.
the Pres's OWN faction); fired LIVE twice (Bush −2000, Oprah −2000 = 4 factions ×
−500). **(iii) NEW cabinet-DIVERSITY penalty** active natively in a 2000-start: −2
enthusiasm to Civil-Rights/Reformist/LW-Activist factions if <25% women/minority in
cabinet+cabinet-level. All three are **Era-of-Terror-gated** — a §27.1 era-BAND RULE
delta (proof that bands carry RULE changes, not just content), so K3/K4's content-band
model must carry rule deltas. M (the rework) + S (the two penalties as additive scored
checks).** →
17) **Iron Fist trait split (§25.9 / debt #25) — M; designer-flagged. Split
into ≥6 office-keyed traits; `repair()` migrates `'Iron Fist'` → all child
traits; touches the 4 governance rows + 3 era-event readers + 6 grant-callers.
Independent of keystones — the trait system shipped in PR4-PR6.** →
18) Faction-personality 5-step distribution + per-era card pool + nicknames
(rebalance inelastic lobby cards — DH-11; faction-rename triggers via handler 9o) →
19) Small consistency PRs (old-age decay, auto-retire, industry leadership,
tariff integer, **5%/half-term retire-death #85 — 1-line refinement of
`MORTALITY_RULES`**, ±3 ideology swing cap #80 — already queued under meter-model,
**★ batch-12 (#130, S — `tedchange#POST 89-100, 137-148, 195-197, 396`,
game-mechanics §10.1.y): DEATH/RETIREMENT SCHEDULE — refine
`MORTALITY_RULES.eraConfig` percentages; ADD `Hale` to the `Trait` union
(verify: NOT in `types.ts:36` today) + `haleDeathMult = 0.5` to
`MORTALITY_RULES`; REFACTOR the death-roll loop to **Frail-first** (today
`runPhase_2_4_1_Deaths` walks `snap.politicians` in array order); GATE
retirement on NOT (retired ex-Pres); mark cabinet retirement as end-of-half-term
not on-appointment. Auto-retire at 100 is already in 2.10**, **★ batch-12
(#135, XS — `tedchange#POST 65`): 50/50 HOUSE INVERSE-CONTROL — replace the
silent default-to-BLUE on tie at `phaseRunners.ts:1864` (one-line edit)**,
**★ batch-12 (#141, XS): FL TRAIT GAIN 5% POSITIVE / 3% NEGATIVE — refines
the existing FL trait-gain const; positives per cycle, negatives first-time-
as-FL only**, **★ batch-12 (#140, S — `tedchange#POST 249-275`,
game-mechanics §10.2.y): ANYTIMEEVO TARGET-POOL TIGHTENING — per-event
restrictions on events 5/17/23/24/25/39/66/117/118/119 to Rep/Sen/Gov/Cabinet
only; Assassination = 50% Pres / 25% Rep-Sen / 25% FL (alternatively co-locate
with E9 handler 9g A/B/C event vote)**, **★ batch-12 (#139, XS): PRES
SIGNATURE STEP IN 2.6 — phase-sequence reorder in `src/phases.ts` so military
bills affect Mil-Prep BEFORE 2.7 Military Action**, **★ batch-15 (#154, S): the
4-STEP SUDDEN-VACANCY FILL LADDER — a centralized helper (same-party-CT →
same-party-unemployed → other-party-CT → other-party-unemployed, from the state) that
replaces the ad-hoc SCOTUS same-party-only pick (`phaseRunners.ts:3661`) and the bare
`vacateOffice` null (`:2446`); pairs with the #115b boot/appointment-ladder rules,
`terror2000#POST 470, 480`**) →
20) Bill scoring leaderboard (divergence #1; **batch-8: also lands the
presidential-vote modifier stack + the era-stamped Popular/Unpopular issue list
#103 — small additive election-math/bill-scoring inputs**; **★ batch-12 (#128,
S — `tedchange#POST 316`, game-mechanics §6.5.y): KINGMAKER / MASTER KINGMAKER
BONUS SCOPE — pin the +1 binding at `calcStateVote` (`phaseRunners.ts:3711`) in
the score sum. Add a `kingmakerBonus(snap, candidate, stateId): number` helper:
+1 if a basic Kingmaker in the candidate's faction is from the same state; +1
in EVERY state for a Master Kingmaker in the candidate's faction. SUPERSEDES
Matt's "state OR national, pick one" reading**) →
21) Conversion-targeting refactor (divergence #3, if pursued; **add Kingmaker-
pairing-dissolution-on-flip — DH-5**) →
22) **GILDED-ERA CONTENT EPIC (batch 14, `gild1868`; §9.1.10) — ONE downstream
era unit, NOT five quick wins; the TOP-OF-QUEUE is UNCHANGED.** Build once
`advanceEra` + the era-content-band registry (K3/K4) + the action libraries + the
CPU handler suite are mature AND after `scenario1788` (E1) + #116 (E4c economic
engine) + #42 (bill-relationship graph) + #57/E3b (Reconstruction). The five
deltas: (a) **#41 dedicated `gilded` era + `scenario1868`** — UMBRELLA; `gild1868`
is its full native spec (red/blue-FLIPPED faction roster RED=GOP/BLUE=Dem POST 6,
Gilded nickname table, era-event spine, bill catalog, SCOTUS docket, 20-yr
Reconstruction timer); another scenario-as-data-row on the K4 `BootSheet`, NOT a
bespoke code path — L; (b) **#147 `game.tariffRate` integer + mutually-exclusive
`MonetaryRegime` enum** — replaces the ±0.5 flavor bill at
`phaseRunners.ts:3421-3422`; depends on #116/E4c + #42 — M; (c) **#148 20-yr
Reconstruction timer + appoint-by-Speaker/PPT-faction + Solid-South sunset** —
EXTENDS #57/E3b (no new epic), inherits the DH-29 solo-blocker (§9.1.6) — S–M
within E3b; (d) **#149 civil-service merit-vs-spoils axis + era-gated reform
content** (Social Mobility, income tax) — S–M; (e) **#150 "1872 Rule"
special-election branch** — niche, S; (f) **DH-63 currency-regime exclusivity
FOLDS INTO #42 + #147's MonetaryRegime** — XS–S, no standalone work.**

**ENGINE TRACK — Phase 2 (FAR-END modern epic — builds LAST, after gilded):**
**23) Enthusiasm/Party-Pref engine + Score economy (over #6's meter bank;
**★ batch-11 #51 RESOLVED — now `ready`, algorithm settled (§29.10, matches
`drums`): the per-Congress 4-step reshuffle pass (MOST-for-dominant +1 toward
dominant / LEAST-for-dominant −1 away / MOST-for-opposition +1 toward DOMINANT *iff
it gained points* / LEAST-from-opposition +2 toward OPPOSITION *even if it gained*,
all stacking) + the −100 crisis-bill-failure / ideology-conflict-waiver → +1
enthusiasm rule. The ±3 cap binds at `calcStateVote` `:3709-3711` and ships with #6.
You MAY pull the reshuffle pass forward as soon as bill-scoring (#20) + #6 are done,
ahead of the rest of E23. ONLY #18 state-scope stays a human DECISION-GATE**) →
24) Presidential primary subsystem (uses K2 + K5 handler 9i + the CPU delegate
engine) → 25) SCOTUS named-Justice docket (divergence #7; from-scratch over
a stub; **25%/10%/5% Justice drift via handler 9n — #79 canonical**; **batch-7:
add the DH-32 guard — a STATE cannot be ruled unconstitutional (a territory can
be revoked; secession is the only un-making of a state); + the `Cohens`-style
persistent ruling→bill-class rule-modifier #94 used by 4b above**; **★ batch-9:
court size is LEGISLATED and variable with excess-justices-NOT-replaced semantics
(§28.5) — add a `courtTargetSize` field**; **★ batch-12 (#142, XS —
`tedchange#POST 387-390`, game-mechanics §22.7.y): CPU CHIEF JUSTICE
SELECTION LADDER — highest Judicial ability from their party → multi-faction
tie: own faction → Pres-ideology match → lowest-scoring faction → multi-
candidate tie: matching-appointer-ideology → random. Sharpens debt #18 (SCOTUS
as a stub) + the #52 player-SCOTUS fork — CPU CJ ladder is CPU-side regardless
of which fork wins**; **★★ batch-12 (`smallbugs#POST 250-269`, vcczar): SCOPE
SIMPLIFICATION — DROP the SCOTUS-overturns-amendment branch from this docket
(amendments are NOT SCOTUS-challengeable per vcczar; OVERRIDES `tea1772`
#100); KEEP the strike-a-statute path + DH-32 state-guard + DH-41
ruling-cascade hook**) →
26) Third-party challenge trigger (**rebalance apparent Dem bias — DH-11**;
**batch-9: region-weighted 3rd-party PV + engine-is-2-party-hard-wired DH-55**) →
27) Military-leadership appointment tier (pairs with #3 war) →
28) 53-state roster + Wyoming-Rule apportionment + two-home-state pols (needs
#7 House-slate persistence first; **roster is per-`{era, startYear}` keyed —
divergence #17 — same `modern` enum has both the 50+DC fresh-boot roster AND
the 53-state Wyoming-Rule continuation roster**; **★ batch-9 DH-49: the Wyoming
Rule + per-decade census are UN-IMPLEMENTABLE without a POPULATION MODEL + House
cap — author/build that model as this epic's first sub-task; the per-decade census
is level (b) of the era model, §28.9**) →
29) Modern legislative depth (collective crisis accountability; **DH-1
filibustered-MUST-pass still needs rules authored — PARKING LOT**; **DH-33 +
batch-9 DH-54: impeachment + VP-vacancy / succession ruleset was NEVER in the rules
doc across 3 campaigns — author before build, PARKING LOT**) →
30) Modern era scenarios (**THREE documented boots now — `scenario1948`
(Cold-War mid-government, `nuke`: Truman/Barkley, 48 states, 5R/5B with
Dixiecrats-in-Blue + Reagan-a-Democrat, the full modern + Cold-War cabinet, 8
ambassador nations) + `scenario2012` (fresh-modern/Populism, `pop`) +
`scenario1948`→`modern` continuation — all ride the K4 `BootSheet` schema (1948
is its fourth boot shape); EXPLICITLY EMPTY at boot;
**BLOCKED on DH-25 — career-track bootstrap rule must be authored first**;
the XL capstone).**
**(Optional, batch 7) `scenario1800` fresh boot — another `BootSheet` instance
(pre-seeded Pres/VP/Cabinet/6-Court/Congress + a rookie draft, NO leaders/
career-tracks at boot). NOT a priority — it sits in the federalism→nationalism
band `scenario1788`/`scenario1856` already cover; place it as an optional later
boot sheet once the schema + the early-republic subsystems (12A toggle #4,
slavery-flag/Second Bank/statehood-by-bill #4b) land. See §9.6 note + the
batch-7 provenance block.**

**PRESENTATION TRACK (parallel, different workstream):**
**P0) ideology→color palette (K1.5) → P1) politician card + roster/congress
restyle (A2/A3/A5/A6) → P2) procedural portrait pipeline (A1, no-AI-in-product;
covers GENERATED pols, shares the demographic model with engine #8) → P3) election
maps + iconography (A7; auto-generate the 53-state map + popular-vote atlas) →
P4) narration voice (A8).** (A4 battle-card wires its real numbers when engine #3
lands.)

**MULTIPLAYER (separate epic, last):**
**M1) Hot-seat sequential (depends on K2 + the action libraries + K5 handlers
for any CPU faction in the rotation) →
M2) Async / backend (separate L–XL epic).**

**PARKING LOT (author before build — rules don't exist yet):**
- **DH-1** filibustered-MUST-pass remedy (forced compromise vs shutdown clock).
- **Divergence #10 / #84** contingent-election rules (top-2 vs top-3,
  outgoing-vs-incoming Congress, deadlock side-effects).
- **DH-12** white-peace rules (negotiated peace spec).
- **DH-13** faithless-elector trigger cap.
- **DH-14** era-aware bill ideology impact tables.
- **DH-15** small/large-state action-impact multiplier.
- **§25.9** Iron-Fist office-keyed trait names (6 candidates listed, but the
  exact split + cascade rules need a design call).
- **DH-25 (batch 6) — career-track bootstrap rule (BLOCKS modern scenario
  shipping).** 3-yr-stale design discussion has no canonical rule for which
  existing pols start on career tracks at a mid-game boot. Zagnut's "1996+,
  1/track" houserule is on the table; Rodja hand-populated by GM ad-hoc.
  Author before `scenario1948` or `scenario2012` ships (Phase-2 #30).
- **DH-33 (batch 7) — impeachment ruleset broken/outdated.** The mini-flow runs
  but the canonical rules are flagged non-functional and improvised (corroborates
  `hd`'s "impeachment super outdated" across a 2nd campaign). Author the rewrite
  before building it into the legislative-depth epic (Phase-2 #29).
- **★ DH-41 (batch 8) — the general SCOTUS-ruling → downstream-statute cascade
  is UNBUILT and was explicitly DEFERRED by `vcczar`.** Distinct from the *built*
  strike-a-single-law and overturn-an-amendment-on-review (#100): does a ruling
  that **contradicts a law on the books** auto-void/neuter that law, or leave it
  operative (today's default)? The Prigg-v-Pennsylvania → Fugitive-Slave-Act case
  was raised and deferred (`tea1772` POST 124-126). **Author the cascade policy
  before building it.** Lands in the SCOTUS docket epic (Phase-2 #25) once decided.
  Cross-refs §24.4's *Pollock*→income-tax coupling (a designed gate already).
- **★ DH-49 (batch 9) — a POPULATION MODEL + House cap (un-blocks the census +
  Wyoming Rule).** The per-decade census EV reallocation (level (b) of the era
  model, §28.9) and the Wyoming-Rule apportionment (#34/#55) are
  **un-implementable without a real per-state population model + a House-size cap**
  — neither exists today (`State.electoralVotes` is a static seed; there is no
  population field). **Author the population model + House cap before build**, OR
  size it INTO the census/apportionment epic (#34/#55) as its first sub-task. This
  is the one batch-9 item that is genuinely *new infrastructure*, not a relabel of
  existing work.
- **★ DH-54 (batch 9) — impeachment / VP-vacancy fill was NEVER in the rules doc.**
  `nuke` (§28.5): no impeachment trigger (a Watergate-analog went undetected →
  pure upside) and VP-vacancy fill was "made up as we go." **Corroborates DH-33
  (`rep1800`) + `hd`** across a third campaign. **Author the impeachment +
  succession ruleset before building the institutional layer** (#112 / #61 /
  Phase-1 #10b + Phase-2 #29). Pairs with #105 (stat-collapse→forced-resignation).
- **★ DH-34 (batch 7) — static era-biases → the Red-unwinnable "AMPU 2.0" hole
  (a ROADMAP DECISION, not a parking-lot author task).** `State.bias` is a
  static per-era table that does not react to policy (abolish slavery → the South
  should swing Red, but doesn't), so the Federalists are acknowledged-unwinnable
  1800-1840 and players quit. GM + designer: dynamic/policy-reactive biases are
  "too complicated / not part of the AMPU vision… maybe AMPU 2.0." **The planner
  must DECIDE: ship static biases (accept the imbalance — the cheap path the
  forum chose) vs. invest in policy-reactive biases (a large new system).** My
  call: **ship static for now** (it is the forum's own stance and the imbalance
  is a known-accepted property), revisit only if balance becomes a release
  blocker. Pairs with #21/#34 (bias as a field) + DH-29's solo-balance theme.
- **★ DELEGATE-CLASS ASSIGNMENT FORK (batch 11, NEW — a human DECISION-GATE before
  E10's delegate-apportionment sub-PR).** `arkzag` opened a new fork distinct from the
  resolved #51: **who sets convention delegate classes** — **AI-auto allocation**
  (Zagnut's house rule + a published 5-category EV×1…×4 formula) vs **player-rigged**
  (Ted: insiders rigging the convention is *intended* design — the host-Governor
  advantage). **Practice did not converge** (the 1840 convention reverted to human-set).
  **Human picks AI-allocator vs player-rigged → THEN E10's delegate-apportionment +
  E24's primary delegate apportionment build it.** Does NOT block the rest of E10 (the
  ballot loop / momentum / VP-rubric / 8-stage general are confirmed-ready). The
  convention-host analog of the #52/#18 forks.
- **~~★ #18 ENTHUSIASM STATE-SCOPE~~ → ★★ RESOLVED OUT (batch 15, `terror2000`) — no
  longer a decision-gate; PROMOTED to ready-to-build.** Batch 11 RESOLVED the
  enthusiasm-shift *algorithm* (the §29.10 4-step reshuffle, matches `drums`) and left
  ONE open question — which states a card's enthusiasm applies to (every-state-unless-
  penalized [Ted] vs ideology-leaning-only [V]). **Batch 15 CLOSES it:** Ted (running
  the 2000-start) reversed his own batch-10 reading to V/vcczar's 2022 canonical 2-layer
  model (`terror2000#POST 913-926`): **(a) a universal per-ideology METER modifier**
  (flat, BOTH parties, EVERY state, primary+general — "unless penalized" GONE) **+ (b)
  the per-PARTY enthusiasm box** (the #51 reshuffle output), composed additively then
  ±3-capped. The three batch-10/11 variants are retired. **So #18 is now ready-to-build,
  S–M, binding in `calcStateVote` (`phaseRunners.ts:3709-3711`)** alongside the ±3 cap +
  the reshuffle pass; layer (a) is the only new piece (a per-ideology meter→modifier
  table). This DECISION-GATE is CLOSED — recount the Decision-gated bucket (#18 OUT;
  with #124-percentages also resolving OUT via batch-15's live 3-state tuning, the
  bucket nets −2). See §9.1.11(C) + game-mechanics §29.3.

**The most important calls for the planner (batch-7 leads; batch-8 HARDENS #0;
batch-9 ADDS the two-level era refinement + the NEGATIVE-SCOPE Cold-War finding +
CPU-AI-is-load-bearing):**
0. **★ ERA-MODEL REFRAME — `advanceEra` becomes CONDITION-DRIVEN; this is a
   re-spec of K3/K4, NOT a new keystone (divergence #18 / §27.1 / #92).
   ★ BATCH-8: MULTI-SAVE PROVEN — the highest-confidence architectural finding
   in the KB. ★★ BATCH-9: TWO-LEVEL + structured-era-event-data requirement.**
   Two+ independent saves emit the IDENTICAL era-band sequence at identical dates
   (`tea1772` 1772-start + `rep1800` 1800-start + **`nuke` 1948-start** — three
   start years, one deterministic sequence — game-mechanics §27.1/§27.2). The bands
   are deterministic game-state content-gates, not GM flavor. **No structural
   change from batch 7.** Batch 9 ADDS: the model has **TWO LEVELS that must both be
   built — (a) point-banked Historical Eras with RULE-DELTAS** (the Era-of-Terror
   cabinet rework proves bands carry rule changes, not just content) **AND (b) a
   separate per-decade census** doing bulk EV-reallocation + state-bias re-lean +
   content-rotation (distinct from #68's per-era bias swap). PLUS **era-event data
   needs STRUCTURED `evDelta`/census fields** (DH-48 — the Neocon census events were
   LOST as free-text flavor) + per-era completeness validation. **"Neocons" is a
   faction-rebrand, NOT a band — do not model it as one.** All inside K3/K4.
   Verified: phases gate by `year % 4`/`year % 2` (`phases.ts:49-59`, keep for
   cadence); the ONLY era advance is the hard-coded `currentEra = 'federalism'` at
   `constitutionalConvention.ts:198`; no year→era derivation exists. `advanceEra(snap)`
   watches an `era.advanceWhen` condition; content gates on `game.eraBand` + a new
   `territoryOwned` predicate, **not the calendar**. **RECONCILES #68 + §26 + §27.1
   into ONE era system.** Sub-bands are content-band markers, not new enum values
   (my call: markers first). **#102: the per-era banking is also the DUAL-scoring
   scoreboard (per-era + cumulative).** See §9.1.5 + the updated K3/K4 rows.
0b. **★★ NEGATIVE SCOPE (batch 9) — do NOT build a Cold-War subsystem; do build ONE
   generic war engine + diplomacy (§9.1.8 / §28.2).** Verified: only
   `src/engine/revolutionaryWar.ts` exists — no generic and no Cold-War engine. The
   "Nuclear Age" has NO nuclear/MAD/NATO/space-race/military-branch mechanics in the
   design; the Cold War is the **generic war engine RELABELED + diplomacy + content.**
   The real items: (i) **ONE generic war engine** (Phase-1 #3) that **RESOLVES**
   (DH-47: wars never end today — Korea ran ~2 decades) and ideally gets army/navy/air
   **branches**; (ii) the **diplomacy subsystem** (8 relation meters + ambassador
   actions; DH-46 add downward pressure; DH-45 fix the USSR-collapse trigger chain).
   Cold-War content = data on top of those. **This prevents the biggest scope-creep
   risk in the modern era.**
0c. **★ CPU-faction AI is LOAD-BEARING (batch 9, #114 / §28.12).** The designer's
   strongest corpus statement: **the APP is built for 1-human-vs-9-CPU** (multiplayer
   "goes off the rails"; the points system is for CPUs, not humans). The forum game
   is team-MP with CPU backfill — **the app is a solo adaptation of a multiplayer
   game**, so the entire multiplayer apparatus must be CPU-AI-driven. **No re-sequence
   (K5 stays after K0+K2), but it ELEVATES K5 + the handler suite (E9) to a
   first-class Phase-1 system** — the difference between a playable solo game and not.
   See §9.1.3. **Senate pass-threshold RESOLVED IN CODE = simple majority**
   (`phaseRunners.ts:3562`); the design question (60%/cloture?) stays open for the
   human (debt #27).
1. **★★ RECONSTRUCTION SOLO-BLOCKER is a hard BUILD REQUIREMENT on E3b
   (DH-29 / §23.4 / #57).** GM-verified (`rep1800` POST 9170): the historical
   Strict/Ironclad readmission plan can NEVER pass with CPU factions → **solo
   Reconstruction is UNRESOLVABLE**, which dead-ends the 1856-arc as a winnable
   solo scenario (and AMPU is single-player). **E3b's definition-of-done must
   include a CPU-passable readmission path** — my rec: (1) a CPU default-vote
   bias for the flagged historical plan (K5 handler #2) **+** (3) an
   era-boundary auto-resolution backstop (K3). The readmission half of E3b
   should land AFTER K5 handler #2 or carry the era-boundary auto-resolution as
   its self-contained fallback. **Ties E3b to the CPU handler suite (K5 / E9).**
   See §9.1.6.
2. **★ IDEOLOGY-AS-CIRCLE is FOUNDATIONAL (a central-helper refactor) behind an
   era-gated flag (divergence #19 / §27.7 / #99).** Verified: `IDEOLOGY_ORDER`
   (`types.ts:14`) is LINEAR and distance is open-coded at 10+ sites
   (`factionCenter` `phaseRunners.ts:715`, `stepToward` `:740`, conversion
   adjacency `:993-1003`, sponsor `:3548`, `firstContinentalCongress.ts:120`,
   + 3 UI pages); **no central helper exists**. Add `ideologyDistance(a,b,
   circular)`, migrate the sites (behavior-preserving while the flag is off),
   gate the wrap on `GameState.ideologyIsCircular?`. **Place the helper +
   migration EARLY-ish (Phase-1 #5b)** — cheap + additive while the flag is off,
   and every later ideology consumer calls it from day one. Not a keystone; M
   total (XS-S helper + migration; M for the flag + conversion-adjacency). §9.1.7.
3. **New early-republic subsystems (Phase-1 #4/#4b) + two grounding
   corrections.** 12A legislature-elector toggle (#20/#93 — a NEW
   legislature-majority resolution branch; `senatePre17` does NOT model this);
   slavery-flag + Cohens (#94 — **`State.isSlaveState` ALREADY EXISTS at
   `types.ts:1329`**, shrinking the refactor to the abolition-toggle + the
   Cohens rule-modifier); Second Bank recharter clock + Bank War exec-action
   (#95); statehood-by-bill ORGANIZE→ADMIT two-step + unorganized-territory
   draft gate (#95, the SAME `territoryOwned` predicate as the era reframe).
4. **Era-events-predating-start MERGED into BUG-1 + event-scheduler-min-floor
   (DH-30) added as a quick-win.** `rep1800` LIVE-confirms BUG-1 (the
   LA-Purchase-dropped-at-1800-start episode is a 2nd instance) — **same bug,
   merged**. DH-30 (min = 20% of the era's max, round down; spill to the 5
   generic anytime events) is its companion on the same scheduling surface;
   both land in the era-event work / before `scenario1788`.

**Carried from batch 6 (still leads):**
1. **APOCALYPSE meter-driven endgame lands in Phase 1, sized M.** Verified:
   the only endgame model shipped is event-driven (`EraEvent.triggersGameEnd`
   → `phaseRunners.ts:2871` → `game.gameEnded`); no meter-watcher, no
   countdown anywhere. The model is meter-agnostic (the Populism Planet
   Health 10-yr clock is one configured row); the `planet` meter ships and
   ticks every era; the sink (`game.gameEnded`) is shared with the event-
   driven path. **Folds in with the meter-model generalization (Phase-1 #6)**
   — same tick site (`runPhase_2_5_1_Lingering`), same termination sink, M
   sizing. Architecturally significant (NEW endgame surface) but cheap to
   ship because the meter and the sink both exist. See §9.3 #14 + §9.1.4 +
   §9.6 Phase-1 #6.
2. **K4 introduces the `BootSheet` schema as the cross-cutting build
   constraint.** Three documented mid-government boots (1788 designed / 1856
   shipped / 2012 designed in `pop`) share ONE shape — pre-built faction
   roster (5 Blue + 5 Red) + per-faction archetype politicians + era-tuned
   ideology/interest/lobby decks + sitting government keyed to start year +
   **state roster keyed to `{era, startYear}`, NOT era alone** (divergence
   #17 — same `modern` enum has 50+DC fresh-boot AND 53-state Wyoming-Rule
   continuation) + EXPLICITLY EMPTY at boot (no faction leaders, no career-
   track pols, no inherited PV/legacy/Kingmaker pairs). **Build the schema
   ONCE in K4**, instantiate per era. **Era identity is data configuration,
   not code paths.** Plus a **Senate-class verifier (DH-24)** + a
   **`TRAIT_CONFLICTS` validator (DH-27)** at the boot pipeline. See K4 +
   §9.3 #17.
3. **K2 + E16 + E17 refactors — divergences #15, #16, and the conditional-
   vote-rules primitive (`pop` POST 1111) fold cleanly:**
   - **K2 adds `requires?: AmendmentPredicate` from day one** (divergence
     #16): one field on `GameAction<Ctx>` + one filter step in the picker
     reading `game.amendments.passed`. Cheap if early, expensive if retrofit
     across 6 libraries. Same `requires:` mechanism gates bill catalog +
     gov action rows; predicate is at the registry-row level.
   - **E16 cabinet refactor gains the dynamic seat list** (divergence #15):
     verified `cabinetSeatsForYear` (`types.ts:1196`) is pure derived with
     NO mutable state; refactor to BOOT SEED only + `GameState.cabinetSeats:
     SeatSpec[]` + `Legislation.createsCabinetSeat?`. Same code area as the
     retention refactor — marginal additional cost.
   - **E17 Iron-Fist split + CPU handler #2 consume the conditional-vote-
     rules primitive** (`Faction.factionLeader.compelledVoteRule?: Predicate
     → Vote`): handler #2 (legislation) consults it BEFORE the §25.6
     heuristic; handler #4 (cabinet) consumes it for auto-AYE-own-picks AND
     SCOTUS within-1-step auto-AYE (§26.6.1). Promotes a §25.9 sub-effect to
     a first-class CPU primitive.
4. **K5 (`CpuController` scaffold) is a NEW keystone — late-keystone, after K0
   + K2, parallel with K3/K4 + federalism** *(carried from batch 5)*. The
   shipped engine has **no agent-decision pass at all** (3 thin stubs); the
   §25 spec'd 15 subsystems have nowhere to live without it. K5 itself is
   ~120 lines (orchestrator + handler interface + tie-breaks + 2 `repair()`
   backfills + 1 determinism test). It **unlocks ~15 follow-on handler PRs**
   that parallelize across contributors. **K5 is a force-multiplier, not a
   scenario gate** — federalism + the 1856-arc epic can ship with stubbed
   handlers and upgrade together. See §6.6.1 + §9.1.3.
5. **Cabinet-confirmation system (DH-23) is XS-S, NOT the M many digests
   imply** *(carried from batch 5)* — because **the broken system isn't
   built yet**. `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a
   one-step scored pick with no Senate vote. So the fix is "build the
   confirmation step in the right shape from day one" (default-AYE baseline
   + Iron-Fist Maj-Leader auto-AYE-own-picks via the conditional-vote-rules
   primitive + lobby-maximizer Admin-weighting + the **batch-6 SCOTUS
   within-1-step auto-AYE** declarative rule for SCOTUS confirmations),
   which is **CPU handler #4** (§6.6.1). Lands as a sibling of the cabinet-
   retention refactor (Phase-1 #16, which now ALSO carries the divergence
   #15 dynamic seat list).
6. **What's READY now vs. what still needs design.** **READY (no design
   task remaining):** the 13 §25 subsections #25.1-#25.8 + #25.10-#25.14
   — all 15 CPU handlers can be authored against §25 verbatim. Plus #79
   25/10/5 Justice drift, #80 ±3 swing cap, #82 veto override 2/3, #83
   midterm meter+enthusiasm, #85 5%/half-term retire-death. **Batch 6
   adds READY:** #86 scenario-boot schema (the per-era boot sheets are
   data), #87 era double-points (a per-era table), #88 APOCALYPSE clock
   (the 10-yr clock is parameterized), #89 dynamic seat list (refactor of
   shipped code), #91 amendment-toggled VP actions (one field on K2).
   **Batch 7 adds READY:** #92 era-content-band model + the condition-driven
   `advanceEra` boundary formula (§27.1/§27.2 spec the explicit steps); #93
   12A legislature-elector toggle (the state machine is specced); #94
   slavery-flag + Cohens (the rule is specced; `State.isSlaveState` exists);
   #95 statehood-by-bill organize→admit + Second Bank recharter clock (specced);
   #99 ideology-as-circle (the metric is `min(|a−b|,7−|a−b|)`). **Batch 8 adds
   to READY:** #100 SCOTUS-overturns-a-ratified-amendment + threshold-amendable
   (the Gov-requested judicial-review/repeal loop + the mutable-threshold field
   are specced, §21.3); #102 dual era-scoring (per-era + cumulative — the K3
   banking table IS the scoreboard, §27.2); #105 stat-collapse→forced-resignation
   (a one-rule floor); #104 lone-ideology convention exploit (a convention-CPU
   guard, handler 9e). **NEEDS DESIGN
   (parking lot):** divergence #10 / #84 contingent-election rules (5 rulesets
   invented mid-thread, no canonical answer); §25.9 Iron-Fist split (the 6 child
   traits' exact names + cascade rules); DH-1 filibustered-MUST-pass; DH-12
   white-peace; DH-13 faithless-elector trigger; DH-14 era-aware bill impacts;
   DH-15 small-state multiplier; **DH-25 career-track bootstrap (BLOCKER on
   modern scenario shipping)**; **DH-33 (batch 7) impeachment rewrite**; **★ DH-41
   (batch 8) the general SCOTUS-ruling → downstream-statute cascade (UNBUILT,
   `vcczar`-deferred — does a contradicting ruling void the law on the books?
   author the policy; the headline batch-8 author-before-build item)**; **DH-44
   (batch 8) the post-12A legislature-state vote count (Kingmaker votes vs
   Gov+Senators+focus-Reps headcount — decide when building the 12A toggle #93)**;
   **the
   early-republic sub-band open Q (enum values vs content-band markers — my
   call: markers first)**. **ROADMAP DECISION (not a parking-lot author task):
   DH-34 (batch 7) static-vs-policy-reactive era-biases — the Red-unwinnable
   "AMPU 2.0" hole; my call: ship static.** These are PM/design tasks, not
   build tasks.
7. **(carried, batch 4) BUG-0 (relocation cap `5`→`4`) is the cheapest win
   in the whole roadmap — do it first.** Verified:
   `RELOCATION_ATTEMPTS_PER_TURN = 5` at `types.ts:247`; one-line const
   edit, no migration. Plus: per-era point banking folds into K3; Civil-War
   / Reconstruction epic lands at Phase-1 #3b; #54 investigation committees
   is READY; DH-8 must-own for the convention epic (now CPU handler #5).
8. **(carried) K2 remains the second-most-important keystone after K0**
   (~6× leverage across 6 action libraries; **batch 6 adds the
   `requires?: AmendmentPredicate` field for amendment-gating**) and is a
   **hard prerequisite for K5** — most CPU handlers pick from a registry.
   `scenario1788` before a fully-general `advanceEra` (§9.1.1); federalism
   before gilded before modern; deep-modern subsystems are Phase 2.

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
