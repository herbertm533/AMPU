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
| 1 | **Candidate selection (75/25 + minor + open-seat)** | §25.1 / #72 | `Politician.{currentOffice,command,traits,pvCache}`, `Faction.leadershipPolId`, `state.preferredIdeologies` | candidate id | Cheapest win (table lookup + 1 roll); blocks no other handler. |
| 2 | **Legislation NAY/AYE/NAY + conditional-vote-rules consumer** | §25.6 / #74 + `pop` POST 1111 | `Bill.cards`, `Faction.cards`, opposition president's meters, **`Faction.factionLeader.compelledVoteRule?: Predicate → Vote`** (consults BEFORE the §25.6 heuristic) | vote | Replaces the floor-vote stub; pairs with `Bill.type` (#42). **Batch 6: handler consults the conditional-vote-rules primitive first** — if a faction-leader has published a declarative `Predicate → {AYE/NAY}` policy (e.g. "NAY any nominee with Admin<3"), the predicate decides the vote; the §25.6 heuristic is the fallback. Same primitive used by handler #4 below (cabinet). Predicate extension (the existing `Predicate` tree at `types.ts:1487`) is the shape. |
| 3 | **Leadership IRV bloc-vote + 3-ballot collective endorse** | §25.3 / #70 | `Politician.{ideology,pvCache,skills.legislative}` per round | per-round vote | The most-corroborated CPU heuristic. Deterministic continuous elimination + first-round random scramble. |
| 4 | **Cabinet selection + confirmation (default-AYE baseline + conditional-vote-rules + SCOTUS-style within-1-step auto-AYE)** | §25.5 / DH-23 / #73 + `pop` §26.6.1 | `Politician.{admin,governing,expertise,traits}`, `Faction.cards` (lobbies), Sen Maj Leader Iron-Fist + Pres Pliable, `Faction.factionLeader.compelledVoteRule?`, **per-faction ideology-center distance from nominee** (`pop` §26.6.1: within-1-step auto-AYE rule for SCOTUS confirmation; applies the same principle to cabinet confirmation as a declarative pattern) | seat + vote | **Replaces the one-step pick at `phaseRunners.ts:2158-2223` with a 2-step pick→Senate-vote.** Default-AYE; Iron-Fist Maj-Leader auto-AYE-own-picks (via the conditional-vote-rules primitive — same shape as handler #2); lobby-maximizer with Admin weighting. **Batch 6: SCOTUS uses a declarative within-1-step auto-AYE rule (§26.6.1) that bypasses the 50/50 cabinet trap** — fold this into the same handler for SCOTUS confirmations + the Manipulative-Pres-compel-retire (gated on `!Integrity OR Jud<5`) as separate trait-powers, NOT under the Iron-Fist overload. |
| 5 | **Convention CPU (per-ballot menu + compromise + dark horse)** (K2) | §25.4 / #71 | convention runtime state + the convention `ActionRegistry` | inter-ballot action + ballot vote | Highest-complexity handler. Owns DH-8 (the GM-confirmed unstable surface). **Includes the 11-ballot deadlock fix** (auto-drop-out after 2-3 ballots of 0 Momentum, currently NOT implemented — DH-17). |
| 6 | **Conversion poach (Pliable + adjacency gating)** (*) | §25.8 / #76 | actor's leader traits + target's `Pliable`/ideology gap | flip outcome | Add a multi-faction-collision tie-break (DH-bug). The rate table is per-leader. |
| 7 | **A/B/C event vote + president ideology force + meter-guarding** (*) | §25.7 / DH-21 | event option's declared `meterEffects` + cabinet ideology + `GameState.meters` | option pick | **First handler to use the meter-impact aggregator** — it down-weights triple-stacks driving an already-bad meter into crisis. |
| 8 | **Faction-leader replacement (4-condition removal + hard gates)** | §25.10 / #78 | leader's traits + bench + faction cards | new leader id | Adds the missing positive-trait floor + mid-term-swap rule (stagnation bug). |
| 9 | **Primary CPU (5-action template + frontrunner rule)** (K2) | §25.12 / #63 | primary state group + actor traits | action + target | Designer-flagged under-tuned; smarter attack-targeting + better frontrunner rule. |
| 10 | **Governor action picker (state-stack-aware)** | §25.15 #4 / DH-19 / #20 | `State.industries` + `State.policies` + Honest-Gov caps | gov-action id | Prunes no-op actions (e.g. Improve Industry at 10/10). |
| 11 | **Reciprocity / vote-trading enforcer** (*) | §25.15 #1 / DH-20 | `GameState.cpuCommitments` | per-vote bump | The first DH-* gap that's "architectural" — needs the scaffold's persistent state. |
| 12 | **Cascading-scandal smoother** (*) | §25.15 #3 / DH-22 | `GameState.recentScandalIds` | filtered event pool | Era-event walker calls this to drop back-to-back at-most-once events. |
| 13 | **VP selection (8-element rubric + retention curve)** | §25.2 / #72 | ticket data + region/age/state-size + era-curve | VP id | The retention curve is era-keyed ("more likely Nuclear+"). |
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
| 1 | **Raw `Math.random` in election scoring** | `phaseRunners.ts:3711` (`calcStateVote`'s `(Math.random()-0.5)*8` jitter) | The flagship determinism leak — every state vote is unseeded. Blocks reproducible elections (and any future replay/multiplayer sync). Route through `rng.ts`. **This is also where the enthusiasm→election model binds.** The full score is `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias + traitBonus + jitter` (`:3709-3711`, re-verified batch 11 — unchanged); enthusiasm is read RAW (`enthusiasm[ideology][party]`, `:3696`) and applied UNIFORMLY to every state, with **NO ±3 cap and NO per-state ideology penalty.** **★ Batch-11 update (#51 RESOLVED): the enthusiasm-shift ALGORITHM is now SETTLED** — `arkzag` published the 4-step faction-performance→enthusiasm rule verbatim and it MATCHES `drums` (§29.10), so batch 10's fork is closed. **What this means for this site:** (a) the **±3 cap is now ready-to-build** (it binds HERE, clamping the `enthusiasm*2` + `partyPref*5` terms — still XS, queued as E6/#80); (b) the **per-Congress 4-step reshuffle pass** is a NEW runner that writes the enthusiasm boxes BEFORE this read (lands in E23, the Score-economy epic); (c) the **#18 state-scope sub-question** ("which states does a card's enthusiasm apply to") is **still a human DECISION-GATE** — the cap can ship, the "which states" cannot. See §9 batch-11 #2. |
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
| 16 | **Generic war resolver divergence (batch 2, #6)** | `runPhase_2_7_2_Military` flat `milPower×10 + d100` (`phaseRunners.ts:3593-3627`, incl. `Math.random` at `:3603`) vs mechanics §21.1 | Shipped non-Rev-War wars use a flat one-roll resolver; forum uses additive per-battle Chance-of-Success + warscore/momentum/×2 resolution + a confirmation cascade. The rich path exists *only* for the Rev War (`revolutionaryWar.ts`). Generalize one `War` model. See §9.3 #6. |
| 17 | **Cabinet wipe-on-election (divergence #8) — CORRECTED: there IS a wipe** | unconditional clear at `phaseRunners.ts:3804-3812` in `runPhase_2_9_4_PresidentialGeneral`; re-fill at `:2166` next turn | **Batch-3 correction of a batch-2 error.** Earlier note claimed "no wipe exists" — wrong; it missed the election-phase loop. The cabinet is vacated and cleared after **every** presidential general (even on incumbent re-election), then re-staffed from scratch at 2.3.1 next turn. The fix is **replace the wipe with retention** (keep ≤5, CIA/FBI exempt) **gated by `firingPrecedentSet` + per-officer tenure + same-faction US-Bank guard** — **M, not S**. See §2.1.1 grounding note. |
| 18 | **SCOTUS is a stub (divergence #7), not a system** | court ruling `phaseRunners.ts:3397-3414` (a `chance(0.5)` coin-flip whether the court acts at all, then 4 hardcoded titles + a conserv-vs-liberal majority → `partyPreference ±0.1`); retire/backfill `:3648-3671` (age≥75 + `chance(0.15)` retire, replace with highest-judicial same-party pol) | The shipped court has the *entity* (`supremeCourtIds`/`chiefJusticeId`, `types.ts:1584`) but no docket, per-case effects, compel-vote/retire, dynamic size, or ruling→law-deactivation. Modern #52 is a from-scratch SCOTUS module — there is no balance-tuned court to preserve, so framing it as a "replacement" overstates what ships. Gates BUG-2 (`Chisholm` needs amendments). M–L. **Batch-10 (#52, the player-SCOTUS fork — DECISION-GATED):** `dem1820` (POST 420-443) surfaced THREE live models — votes-by-ideology-chart + player delay/dismiss-only (the forum's working rule), trait-gated player-vote (`vcczar`), fully-player-controlled (two players) — **none settled.** Regardless of fork, the build needs a **docket data structure**: per-era case rows in `src/data/scotusCases<Era>.ts` (`templateId`, ideology-vote chart, ahistorical-flag, optional ruling→bill-class modifier) + a `GameState.scotusDocket` ledger; the fork only changes the *resolution* + the player-action surface (delay/dismiss = one ActionRegistry row; trait-gated player-vote = a different one). **Author the fork before building the docket epic (Phase-2 #25).** Pairs with DH-32 (state-can't-be-voided guard) + DH-41 (ruling→statute cascade, parking lot) + #94 (`Cohens` rule-modifier). |
| 19 | **Dataset exhaustion (scaling wall a)** | runtime load `standardDraftClasses.ts:13`; finite ~18.5k JSON | The real-person dataset **runs out in the deep-modern era** → no draft pool for late-era play. Needs a **runtime, seeded procedural pol generator** (`src/engine/`, emitting `ImportedDraftee` rows, reusing `instantiateDraftees` `phaseRunners.ts:114`). Also fixes "sparse new states need filler officials" (#43) + BUG-3 stopgap. Connects to portraits (A1). **Needed for ANY late-era play.** M–L. |
| 20 | **House bloat → manual-staffing tedium (scaling wall b)** | no slate/committee persistence across cycles; election + committee phases re-run from empty each cycle; House modeled as **full `electoralVotes - 2` reps per state** (boot `scenario1856.ts:93`; re-elected per-seat `phaseRunners.ts:3913-3939`) | Wyoming-Rule House ~572–601 (Senate 106) makes the manual House-election + committee-staffing phases unbearable — **a player quit over it**. Needs **persist + carry-forward/auto-fill** of House slates + committee rosters on the snapshot. **Near-term** (improves 1856's 31-state congress too), not modern-only. M. **Batch-10 (#55, focus-Rep abstraction — DESIGNED-not-shipped):** the forum abstracts the House to **"focus Reps" at `(EV − 2) / 5` rounded up** (`dem1820` POST 643), each controlling an equal share of a state's hidden seats — NOT the full per-seat model shipped. Collapsing per-seat reps to focus-Reps is the change that makes the "congressional election from hell" (10 forum pages / 8 real days in `dem1820`) tractable; build it WITH this scaling-wall item. The **seat-specific-incumbency-except-census-year +2 bonus** (POST 682/696, `vcczar`) is a balance dial on top. Folds into the census/apportionment epic (#34/#55). |
| 21 | **DH-1: filibustered "MUST-pass" bill has no rules remedy** | no deadlock rule (filibuster itself unbuilt); `modern` 640-716 | A GM-confirmed **design hole** (rules, not code): when a required bill is filibustered to death the rulebook has no answer (GM improvised a 4-leader special-committee auto-pass with a per-day "shutdown" penalty clock). **Rules must be *authored* (a PM/design task) before this can be built.** Couples to the filibuster epic. **(NB: investigation-committees #54, formerly grouped here as under-designed, is now READY — `hd` authored the 5d6 spec, §24.5/#65.)** |
| 22 | **DH-2: modern era-deck fired off-year cards** | possible scheduling defect; reconcile with BUG-1 + the §6.4 scheduling fork; `modern` 2221 | In ~2018 the deck pulled 2008-era cards. **Reported, not verified** — could be intended shuffle/backlog or a real defect. Resolve **together with divergence #4 (era-event scheduling)** and BUG-1's era-lock filter, since all three are the same scheduling surface. |
| 23 | **The engine has NO agent-decision pass at all** (batch 5 / DH-8 + DH-20/21/22) | three thin CPU stubs — `pickBestForFaction` (`phaseRunners.ts:33-53`), `pickAIResponse` (`eraGraph.ts:88-103`), `autoFillCPUVotes` (`constitutionalConvention.ts:81`); everything else either does nothing or runs a one-line placeholder | Every faction except the player is CPU. Most mid-to-late content (conventions, cabinet confirmations, leadership races, conversion, A/B/C events) **doesn't *work*** without a real CPU surface, even if every phase runner ships. **The fix is K5** — a `CpuController` scaffold (`src/engine/cpu/`) that the §25 spec'd handlers plug into. **This is the highest-leverage gap in the codebase after K2.** See §6.6.1 + §9.1.3. |
| 24 | **Cabinet confirmation: no Senate vote at all (DH-23)** | `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step scored pick that goes straight to `cabinet[seat] = pick.id` + `addLog("confirmed as ${seat}")` — no committee step, no Senate vote, no NAY/AYE | The `drums` 36% pass-rate bug **doesn't exist today because the system doesn't exist**. The fix is to **build the confirmation step in the right shape from day one**: default-AYE baseline with low-% opposition reject + Iron-Fist Maj-Leader auto-AYE-own-picks (the lost rule) + a lobby-maximizer that *weights* Admin/competence instead of *only* lobby cards. **Smaller than expected** — XS–S, see §9.3 #14. Pairs with the cabinet-retention refactor (#17). |
| 25 | **Iron Fist is one trait but does ≥6 distinct things by office (batch 5 / §25.9)** | `'Iron Fist'` as a single `Trait` union member (`types.ts:89`); 4 governance rows (`:1043-1047`) + 3 era-event multipliers (`phaseRunners.ts:2915`, `:2931`, `:2959`) | Designer-flagged to split into ≥6 office-keyed traits (`'Stifle Competition'` for primary block, `'Force Vote'` for chamber compulsion, `'Compel SCOTUS'` for court compulsion, `'Fire Officers'` for mid-war military replacement). **`repair()`-migrateable** — expand `'Iron Fist'` to all child traits in one block, then the spec'd readers move to the narrower traits. **M.** Independent of keystones (the trait system shipped in PR4–PR6, before any 1856-arc work). |
| 26 | **Veto override / cloture / filibuster: NO code exists yet** (verify for batch 5 / divergence #11) | grep confirms zero engine sites for `veto`/`override`/`cloture`/`filibuster` (only doc comments at `phases.ts:164`, `types.ts:506`, and unrelated occurrences) | When veto-override is built, the threshold is **2/3 in BOTH chambers** (designer ruling, `drums` POSTS 2180-2187; the 60% was a reverted bug). **No fix needed today** — forward-only constant when the legislative micro-mechanics epic lands. |
| 27 | **★ Senate pass-threshold (batch 9 open question) — RESOLVED IN CODE: simple majority** | floor vote `runPhase_2_6_3_Floor` (`phaseRunners.ts:3498`); the post-independence path passes iff `house.yea > house.nay && senate.yea > senate.nay` (`:3562`) | **The digest flagged a SOURCE conflict** (`nuke` §28.5/§28.12, POST 2746-2770/8155/8308): is the Senate a ~60% supermajority-to-PASS, or simple-majority-to-pass with ~60% being CLOTURE only? **The shipped CODE settles the engine side: it is SIMPLE MAJORITY in both chambers (`yea > nay`), with NO cloture/filibuster/supermajority step at all** (consistent with debt #26 — no cloture code exists). The only supermajority anywhere is a DIFFERENT mechanism: the independence-era Continental-Congress path (`voteCC`, `continentalCongress.ts:224`) uses **2/3 of states under the Articles of Confederation**, else simple majority — that is era-specific and not the bicameral floor. **So: code = simple majority; the DESIGN question (should the Senate require 60% / a cloture step?) stays OPEN for the human** — the forum may want a supermajority/cloture the engine does not model. When the filibuster/cloture epic lands (debt #26 area), the human decides pass-vs-cloture and the constant lands there. |

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
  expected because the system isn't built yet).
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
  home; a dataset/data fix)**.
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
- **Designer-gated OPEN items (NEW Decision-gated SUB-BUCKET):** the 9
  open `tedchange` items per game-mechanics §30.2 — Mil-Prep lvl 4 fix,
  UEM (#125), Crisis trait consolidation, term-limit Gov pre-Senate,
  faithless-elector rewording, party rename PL-vs-EraEvo, VP-must-be-
  same-party-on-resignation, cabinet enthusiasm percentages, cabinet
  ideology weighting. **NOT ready-to-build until Ted/vcczar closes
  them in `tedchange`/`smallbugs`.** Add the "designer-gated" sub-bucket
  to the existing PARKING LOT (alongside the user-gated bucket).

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
| **DH-29 (`rep1800`)** — ★★ Reconstruction Strict/Ironclad plan can NEVER pass with CPU → solo Reconstruction UNRESOLVABLE | GM-verified (`rep1800` POST 9170): *"only 3 factions would ever consider voting for it… in a single player game it basically can never pass."* Reconstruction unbuilt (#57). | **BUILD REQUIREMENT on E3b** (not a balance dial): the 1856-arc is unwinnable solo without a **CPU-passable readmission path** — (1) a CPU default-vote bias for the flagged historical plan (K5 handler #2) AND/OR (3) an era-boundary auto-resolution (K3). See §9.1.6. | **A hard gate on E3b's Reconstruction half; ties to K5 + K3.** |
| **DH-30 (`rep1800`)** — era-event scheduler has a MAX per half-term but NO MIN floor | `rep1800` POST 2919-2932: events scale by a fixed number; "the limit is a max not a min… which isn't what we discussed." Companion to BUG-1. | **quick-win.** Fix = **minimum 20% of the era's max (round down)**; if still none fire (all prereq-gated), spill to the 5 generic anytime events. Lands with BUG-1 / the era-event work — same scheduling surface. | **XS; pair with BUG-1.** |
| **DH-31 (`rep1800`)** — procedure-subtype bills BYPASS the veto but the engine MIS-ROUTES them to the President | `rep1800` POST 2342-2348: `subtype: procedure` bills (Institute Filibuster, create-whip-offices) wrongly sent to the President for sign/veto. | **verify-and-fix (divergence #21).** Confirm the bill `subtype` taxonomy; skip the President sign/veto step for procedure bills. Lands in the bill-typing epic (#42). | **XS-S; in the bill-typing epic.** |
| **DH-32 (`rep1800`)** — SCOTUS can void a STATE ("Pickens v. Maine's Existence" voided Maine after a census) | `rep1800` §B 3632, 3646-3652: a state ruled unconstitutional 5-1. No state-existence guard in the SCOTUS ruling-effect path. | **one-rule guard.** Add: **a state cannot be ruled unconstitutional** (a territory can be revoked; secession is the only un-making of a state). Lands in the SCOTUS docket epic. | **XS; a guard in the SCOTUS ruling-effect path.** |
| **DH-33 (`rep1800`)** — impeachment ruleset broken/outdated | `rep1800` §A 465-474 / §B 3594, 3620: the mini-flow runs but the canonical rules are flagged non-functional + improvised (corroborates `hd`'s "impeachment super outdated" across a 2nd campaign). | **author-before-build.** A real rewrite is needed before building it into the legislative-depth epic (Phase-2 #29). | **Design task; parking lot.** |
| **DH-34 (`rep1800`)** — ★ static era-biases are unfixable ("AMPU 2.0") → the Red-unwinnable hole | The single most-repeated `rep1800` complaint: `State.bias` is a static per-era table that doesn't react to policy (abolish slavery → the South should swing Red) → Federalists acknowledged-unwinnable 1800-1840; players quit. GM + designer: dynamic biases "too complicated / not part of the AMPU vision… maybe AMPU 2.0." | **ROADMAP DECISION (not a quick fix).** Ship static biases (accept the imbalance — the forum's own stance) vs. invest in a large new policy-reactive bias system. **My call: ship static**, revisit only if balance becomes a release blocker. Pairs with #21/#34 (bias as a field) + DH-29's solo-balance theme. | **A roadmap-level call; no cheap fix.** |
| **DH-35 (`rep1800`)** — thin early-era presidential agency ("this era is a bore") | `rep1800` §A 2756-2760, 2930, 3110: in the pre-primary eras the President's only exec actions are flavor tours; the modern toolkit isn't unlocked yet, feeding the "Blue auto-wins, governing is dull" sentiment. | **era-gating-with-enough-early-agency.** The exec-action / primary libraries must be era-gated **with enough EARLY-era agency** to keep the pre-convention eras engaging. Pairs with #23 (exec-action library) + #63 (primary-era unlock). | **A content/era-gating constraint on the action libraries.** |
| **DH-36 (`new1772`)** — ★ GM burnout from manual upkeep ABANDONED a 12-turn multiplayer game | `new1772` POST 3607: the first captured multiplayer 1772 campaign (10 humans, ~12 turns) collapsed when the first-time GM could not sustain the manual bookkeeping. **Not a code bug — the META-justification for the entire build.** | **NOT a discrete fix.** This is the strongest single "why build AMPU at all" datum: the computer must own all deterministic upkeep (the human GM cannot). Cite it as the motivation behind scaling walls #19/#20 + the CPU handler suite. | **Motivation, not a roadmap row. Don't queue it.** |
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
| **DH-54 (`nuke`)** — ★ impeachment / VP-vacancy fill NEVER in the rules doc | `nuke` POST 6674-6676: no impeachment trigger (Watergate-analog went undetected → pure upside); VP-vacancy fill "made up as we go." Corroborates DH-33 (`rep1800`) + `hd`. | **author-before-build (PARKING LOT).** Author the impeachment + succession ruleset BEFORE building the institutional layer (#112 / #61). | **Parking lot; author before the institutional layer.** |
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
| **#61 (`arkzag`, EXTENDED)** — death→succession→acting-president chain UNBUILT | `arkzag` ch27: assassination KILLS the president → VP succeeds under the "13th"/VP-vacancy amendment → must fill VP → acting-president whose actions a trait DIVERTS (Easily Overwhelmed → 50% VP-acts). Verified: the KILL exists (`assassination-killed` anytime event, `anytimeEvents.ts:232`) but death just sets `presidentId = null` (`vacateOffice`, `phaseRunners.ts:2449`) — **NO succession engine.** | **EXTENDS E10b.** E10b scopes the leaf (`successionOrder?`/`bornForeign?`/`actingPresident?`, the 0-Command-inert state); #61 here adds the **assassination→succeed→fill→action-DIVERT-roll wiring** (gated on the §29.8 VP-Vacancy amendment being `active`) + the trait-acquisition side-effect. See §9 batch-11 #1. | **Re-scope E10b to carry the full chain (do NOT open a new epic). Gated on E5's VP-vacancy amendment.** |

---

## 9. Build-sequencing advice

> **This section is written for the roadmap-planner to lift directly.** It is my
> engineering opinion on order, dependencies, and rough size/risk for the
> game-pm gap log (~142 rows across 5+ eras + A1–A9 presentation + the CPU-AI
> cluster #70–#85 + the **batch-6 scenario-boot / endgame cluster #86–#91** + the
> **batch-7 early-republic cluster #92–#99** + the **batch-8 founding/era cluster
> #100–#105** + the **batch-12 designer-rulings cluster #120–#142**), the design
> divergences (mechanics §19.1, now **#1–#21**), the confirmed bugs (incl. BUG-0),
> and the GM design holes (DH-1/DH-2 + DH-3..DH-11 + DH-12..DH-23 + DH-24..DH-28 +
> DH-29..DH-35 + **DH-36..DH-44**). Source: codebase + `gilded` + `fed` + `1772s` +
> `modern` + `hd` + `drums` + `pop` + `rep1800` + **`new1772` + `tea1772` +
> `dem1820` + `arkzag` + `tedchange` + `smallbugs`**.
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

**Placement.** **#115 is NOT a new keystone** — it lands inside K4's `BootSheet`
schema. But its **priority rises to the front of the subsystem queue:** do the shared
`scenarioBoot` factoring **with the first new scenario (`scenario1788`, Phase-1 #1),
not after the third copy-paste.** The dependency order is **K0 (so boot rolls are
seeded) → the `scenarioBoot` pipeline + `BootSheet` schema (with K4) → every scenario
(1788, then 1856-refactored-to-ride-it, then 1820/1800/1948) is a data row.** The
boot pipeline is also where the XS validators (DH-24 Senate-class, DH-27 trait-
conflict) and the appointment-ladder live. **The two §29 forks (boot-Command,
CT-eligibility) are decision-gated** — author the policies before wiring them, but
the *pipeline itself* is unblocked and should be built first.

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
| **Generic cross-era war system** *(batch 9: this is THE engine the "Cold War" relabels — §9.1.8)* — multi-theater additive Chance-of-Success per battle: `Win% = Difficulty + Planning(SecWar/Navy+CoS/CNO) + Officer×10 + MilPrep + Benchmarks` (d100); per-theater WarScore with `WS ≥ +11` auto-win; war-end check `WarScore × 2 = %`; post-war defeat `\|WS\| × 2 × 10 = %`; officer KIA on natural-1; catastrophic 100/100; momentum bonus (+1/-2 turn-vs-turn); Major / Minor / Operation tiers with per-tier multipliers; **naval-N-then-ground gating per-war** (Mexico=3, WWI=2); **Treaty A-D tier with Basic-vs-Special routing by Admin** + 3-roll treaty chain (Pres → Sec State → Amb); confirmation cascade (defeated commander → Incompetent + fired → Senate-confirmation drama) | mechanics §21.1, **§23.3 (deepest spec, multi-confirmed)**; `fed` 222-573, `1772s` 20-60, `hd` I-1, **`drums` POSTS 123, …, 6928**; **`nuke` §28.2 (5+ wars, Korea/Cuba/Gulf/War-on-Terror)** | **M–L** | K0 (lots of rolls); **BUG-3** (no-PM-General fallback is in this blast radius) | **Divergence #6. Verified: only `src/engine/revolutionaryWar.ts` exists — NO generic and NO Cold-War engine; build ONE.** Generalize one `War` model usable in any era; the Cold War is THIS engine relabeled + content (§9.1.8). **The formula is canonical** (`drums` re-derives it across 5+ wars/4 eras; `nuke` confirms it across the Cold-War wars). **Design it multi-theater + tiered from day one** — the Civil-War row below is its Major-tier instance. Outcome grants/denies territory; **+permanent president +1-all-elections on Major victory**. **★ Batch-9 LOAD-BEARING holes (DH-47): wars NEVER resolve today** (the war-end roll's odds are so low Korea ran ~2 decades) → **build a real resolution/peace path** (couples to DH-12 white-peace), and **there are no army/navy/air branches** (army generals command navies, "naval" pols die in infantry) → **design the branch model.** Pairs with the A4 battle-card UI + the military-leadership tier (#49). **Build the K5 CPU touchpoints inside this epic** (commander selection, theater focus, surrender/peace decision); war-epic-internal, not separate handlers. |
| **[1856-arc, batch 4/7] Civil-War combat engine + Reconstruction subsystem — COMPLETES the shipped 1856 scenario** — two theaters (3 naval wins gate land), per-theater WarScore (+10 auto-wins) + Major/Minor/Operation tiers, named-battle officer casualties, permanent-president-+1-all-elections on Union victory, **+ the batch-7 CW VARIANTS (#97): DomStab=1 early-trigger, President-defects-to-CSA, Hartford/Northern-secession variants, UK-intervention 3rd theater, guerrilla 4th stage, internal CSA government**; then Reconstruction status (occupied/military-gov/readmitted) + per-state readmission **bills (readmit-by-REPEAL, `rep1800` §C)** + time-boxed `+2-until-year` bias + strip-leaders/pardon laws + secession gating (`Southern Unionist`/Secessionists pool) + free/slave sectional-balance crisis | mechanics §23 (§23.1–§23.5); `hd` I-1..I-5; **`rep1800` §C (2nd CW campaign + the solo-blocker)** | **L** | **generic war (#6)** (this is its Major-tier instance), **K2** (Reconstruction readmission + the 3-plan exec action are ActionRegistry rows), the bill pipeline (readmission bills), `State.isSlaveState` (`types.ts:1329`, **per-state flag EXISTS**) + `SLAVE_STATES_1856` (`types.ts:1152`) for the sectional crisis; **for the SOLO-BLOCKER fix: K5 + CPU handler #2 (option 1) OR K3's condition-driven `advanceEra` (option 3, era-boundary auto-resolution)** | **★★ BUILD REQUIREMENT (batch 7 / DH-29): the Reconstruction half is UNWINNABLE solo without a CPU-passable readmission path.** GM-verified (`rep1800` POST 9170) the Strict/Ironclad plan can NEVER pass with CPU factions → **the epic delivers an unwinnable scenario unless E3b ships option (1) a CPU default-vote bias for the flagged historical plan, (2) a guaranteed-pass crisis path, or (3) an era-boundary auto-resolution** (my rec: 1+3). See §9.1.6. **Otherwise: place EARLY-ish — after #6 + K2, does NOT wait behind federalism or the deep-modern tail.** Rationale: unlike federalism (a *new* scenario), this **enhances the already-shipped 1856 scenario** (`scenario1856.ts`, era `nationalism`), whose spine dead-ends at the Trent Affair (1861). Secession (#58) + the sectional crisis (#59) are cheap additive parts that can land first as the antebellum payoff; the two-theater war (#56) + Reconstruction (#57) are the heavy parts. The **readmission half should land AFTER K5 handler #2** (for the solo-blocker fix) or carry the era-boundary auto-resolution as its self-contained fallback. See §9.1.2 + §9.1.6. |
| **[1856-arc, batch 4] Succession / eligibility / acting-president** — configurable bill-mutable line of succession; native-born vs foreign-born presidency gate (relaxable per #60 Canada); an acting-president state whose `command` (often 0) gates exec actions / SCOTUS-compel / re-election; era-keyed VP-vacancy-fill amendment | mechanics §24.1, #61; `hd` I-6 | **M** | the amendments item (#39, VP-vacancy fill); ties to the cabinet/leadership pipeline | **An election-system / constitutional addition.** `vicePresidentId` exists (`types.ts:1568`) but no eligibility gate, no configurable line, no acting state. Best landed *with* the convention/election work — the foreign-born gate also constrains convention Major candidacy. Folds DH-3 (career-track pols can't run for President). |
| **[1856-arc, batch 4] Contingent House election + tied-chamber inverse control** | mechanics §24.2, #62; `hd` I-7 | **S–M** | the EC tally path (`calcStateVote('presGeneral')`, `phaseRunners.ts:3752`) | **Election-system addition.** On no EC majority: 1-vote-per-state by House-delegation majority (Governor-party tiebreak), Senate elects VP; **pick a stated cutoff** (DH-6: config `contingentTopN` top-2 vs top-3) + the tied-chamber inverse-control rule. Slots into the same tally code as per-state EC method (#5). |
| **Offices created in-game by law (institutional layer)** *(batch 4 / **batch 8: confirmed FOUNDING→MODERN**)* | mechanics §24.6, #66/#101; `hd` I-11; **`new1772` §24.6 (founding offices-by-law)** | **M** | **K2** (offices created by exec action/bill are ActionRegistry-adjacent); the cabinet-retention refactor (#25); shares its substrate with divergence #15 (dynamic seat list) | **Generalizes the cabinet beyond `cabinetSeatsForYear`** (`types.ts:1196`, year-keyed/fixed today): model offices as data **created/destroyed by bills + exec actions** with their own terms/eligibility/decline/Command-grant rules. **★ Batch 8 makes this an END-TO-END theme, not a Gilded/Progressive-only need:** Gilded/Progressive adds Fed Chair / CoS / CNO / FBI Director (incl. create-Fed-deactivates-Independent-Treasury); **founding (`new1772`) stands up SCOTUS, the Bank-of-US (→ President-of-Bank seat), Dept of Navy (→ SecNavy), the AG, academies/Mint/Marine-Corps ALL by in-game bill** — the founding era is *defined* by offices-not-existing-until-legislated. Pairs with #49 (military-leadership tier) + #25 (retention) + the divergence-#15 dynamic-seat-list refactor (same substrate). **Note DH-40: the SCOTUS-establish + set-count two-bill pattern can STALL the game if the count bill fails — guard it here.** |
| **Per-state presidential-election method + the 12th-Amendment mode toggle** — `State.electionMethod`/`electorsByLegislature` resolved from seated-legislature majority (Gov breaks ties) for legislature-states; **a pre-12A global `conventionsEnabled = false` gate**; flip per-state by event, globally by amendment / the "Nationwide Surge" event | mechanics §21.2, **§27.3 (#93, the before/after state machine)**; `fed` 194-373; **`rep1800` §A** | **M** | K1 (the field), amendments (global flip), conventions (the gate disables §15.3) | **Divergence #5 + batch-7 #93.** Diverges from `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`), which resolves *every* state by PV+dice. **Correction: the shipped `senatePre17` context (`types.ts:701`) is NOT a legislature-majority tally** — it's the same `calcStateVote` formula with a different `ctx` tag (`phaseRunners.ts:3896`); so `electorsByLegislature` needs a **genuinely new resolution branch** (award EV by seated Gov/Senate/Rep party majority, recomputed after the popular tally). Federalism + the early Republicanism band both *need* it (CT/GA/MA/NJ/NY/SC legislature-chosen pre-12A, decisive). The 12A also **gates the convention machinery + separate-VP rules** (§27.3). Best landed *with* the federalism/early-republic epic. |
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
**★ batch-12 CPU CJ ladder (#142)** (the ladder spec is authored).**
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
random alt-states per draft (re-rule into era-config; SUPERSEDES 5/5)**) →
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
ran ~2 decades) — and ideally army/navy/air BRANCHES**) →
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
re-tag; + the pre-12A `conventionsEnabled=false` gate)** →
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
`replaces`/`lockedUntilYear`). →
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
**9) CPU handler suite [batch 5 NEW] — depends on K5. ~15 lightweight PRs in
§6.6.1 order: (a) candidate selection 75/25 #72 → (b) legislation NAY/AYE/NAY
#74 + **conditional-vote-rules consumer (batch 6, `pop` POST 1111 — consults
`factionLeader.compelledVoteRule?: Predicate → Vote` BEFORE the §25.6
heuristic)** → (c) leadership IRV #70 → (d) cabinet confirmation #73 + **batch-6
SCOTUS within-1-step auto-AYE rule (§26.6.1) + Manipulative-Pres compel-retire
as a distinct trait-power** (lands the DH-23 fix — XS-S because the system
doesn't exist yet) → (e) convention CPU #71 (owns DH-8 + DH-17; **batch-8: guard
the lone-ideology minor-candidate convention exploit #104 — a single
ideologically-isolated minor candidate can game the convention**) → (f)
conversion poach #76 → (g) A/B/C event vote + meter guard #75 + DH-21 → (h)
faction-leader replacement #78 → (i) primary CPU #63 → (j) governor-action
picker DH-19 → (k) reciprocity enforcer DH-20 → (l) scandal smoother DH-22 →
(m) VP rubric + retention #72 → (n) Justice vote + drift #79 → (o) faction
rename trigger #40. PARALLELIZABLE — multiple handlers can land concurrently.**
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
end-to-end); the line-of-succession/impeachment half stays parking-lot (DH-54)**] →
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
CONTROVERSIAL — one filter helper used by the cabinet picker.** →
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
bills affect Mil-Prep BEFORE 2.7 Military Action**) →
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
22) gilded scenario (once `advanceEra` + action libraries + the CPU handler
suite are mature).**

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
- **★ #18 ENTHUSIASM STATE-SCOPE (batch 11 — the ONLY remaining piece of the #51 fork;
  a human DECISION-GATE).** Batch 11 RESOLVED the enthusiasm-shift *algorithm* (the
  §29.10 4-step reshuffle, matches `drums`) — so the reshuffle pass + the −100/waiver
  rule + the ±3 cap are all ready-to-build (E23 + E6). **The one open question is
  #18: which states does a card's enthusiasm apply to** — every-state-unless-penalized
  (Ted) vs ideology-leaning-states-only (V). The §29.10 model expresses shifts
  per-ideology-card and leaves the state-application step open. **Human picks the
  state-scope → THEN the per-state penalty binds in `calcStateVote`
  (`phaseRunners.ts:3709-3711`).** The cap + reshuffle ship regardless; only the
  state-scope waits. (Reconciliation: batch-10 framed the WHOLE #18/#51 as gated;
  batch-11 un-gates everything EXCEPT this sub-question.)

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
