# AMPU — Game Mechanics

> **What this is.** The precise, complete account of *how AMPU's rules work* — the
> turn/phase loop, every system in depth, and how systems interact. Companion to
> `game-context.md` (the *what*) and `technical-guide.md` (the *how it's built*).
>
> **Provenance.** Originally generated from the **codebase** (the engine is the
> executable spec); subsequent batches add **forum-confirmed and forum-only design**
> from the playtest digests, citing posts as `digest#post N`. Every shipped rule is
> cited `file:line`. Two scenarios are built — **1772** (founding) and **1856**
> (antebellum). The engine's `Era` type and several rule tables already enumerate
> `federalism / nationalism / modern`; where only 1772/1856 logic exists, the rest is
> flagged **designed, not built**.
>
> **Forum-design batches absorbed.**
> - **Batch 1** — `f4c7c2c4` (1868–1872 Gilded-Age playtest, `gilded`): the
>   convention machinery, governor's actions library, state policy flags, executive
>   actions library, per-power foreign relations, legislative micro-mechanics, and
>   Gilded-Age era.
> - **Batch 2** — `f55d3e21` (1788 federalism solo, `fed`) + `85f8e6b4` (1772 solo
>   "aesthetic experiment", `1772s`): a full **federalism-era** section
>   ([§20](#20-federalism-era-designed-not-built)); the **per-state presidential
>   election method**; a **generic cross-era war system**; **amendments as durable
>   ratified state**; the **firing-precedent gate**; **bill-driven statehood**; the
>   fully-specified **2.1.8 card-distribution algorithm**; **bill typing + budget cap**;
>   the **era-event scheduling model** (and its divergence from `coreSpine`); the
>   **named-ordinal meter model + ±3 swing cap**. Many batch-1 deltas are now
>   **corroborated across a second era** (flagged inline). See [§19](#19-shipped-vs-designed-boundary).
> - **Batch 3** — `3a9ac985` (1948→2020 modern multiplayer, `modern`): the
>   **most mechanically mature surface ingested to date** — a new
>   **[§22 Modern era systems](#22-modern-era-systems-designed-not-built)** covering the
>   **named meter bank + numeric debt + crisis/cascade**, the **faction-enthusiasm /
>   Party-Preference election engine + Score economy**, the full **presidential
>   primary → convention → general** pipeline (incl. the **CPU delegate engine**), the
>   **SCOTUS docket subsystem** (compelled votes/retirements, court-packing,
>   appointee-ideology reveal), **investigation special committees**, the
>   **military-leadership appointment tier**, and the **53-state alt roster + modern
>   apportionment**. Batch 3 also **corroborates ~30 prior deltas across a fourth era**
>   (bumping confidence) and sharpens legislation, conventions, cabinet, governors, and
>   amendments with modern detail. See [§19](#19-shipped-vs-designed-boundary).
> - **Batch 4** — `77db6e6f` (1856-native "A House Divided", a 1856→1904 multiplayer
>   campaign, `house-divided`/`hd`): the **first 1856-native record** and the **only
>   source for the Civil-War / Reconstruction machinery**. Adds a new
>   **[§23 Civil War & Reconstruction](#23-civil-war--reconstruction-1856-arc-designed-not-built)**
>   (the **two-theater combat engine**, the **Reconstruction readmission subsystem**,
>   **secession + Southern-Unionist trait gating**, the **free/slave sectional-balance
>   crisis**, **Canada conquest → era-gated statehood**) and a
>   **[§24 other 1856-arc systems](#24-other-1856-arc-systems-revealed-by-house-divided-designed-not-built)**
>   (succession/eligibility + the **0-Command acting president**, the **contingent-election
>   top-2 house rule**, the **Primary Era** origin, **amendment ratification by 3/4 of
>   Governors**, the authored **investigation "3.0.40" 5d6 spec**, the Progressive
>   **institutional layer**, the **~16-meter Lingering** bank, and the **3-traits/3-alt-states**
>   draft re-rule). It also **reconciles per-era point-banking into the turn loop**
>   ([§2.5](#25-era-boundaries--per-era-point-banking--the-new-era-boot-pipeline-designed-not-built))
>   and supplies the **★ "forum DRIVES the build"** divergence — the **relocation cap is `5`
>   in the shipped build but `4` in the running playtest** ([§19.1 #9](#191-design-divergences-for-the-roadmap)).
>   Mostly **corroborates** the existing gap log across ~5 eras (conventions, legislation,
>   SCOTUS, cabinet, governors, churn) — flagged "confirmed 1856-native" inline.
> - **Batch 5** — `e1776bbd` ("Drums of War", a 7540-post **all-CPU** 1841→mid-1924 playtest,
>   `drums`): the **most mechanically *interior* surface in the knowledge base**. Because
>   the run was all-CPU, it is the **first explicit record of CPU heuristics, thresholds,
>   tie-breaks, and design-holes** — surfacing what prior multiplayer threads couldn't capture.
>   Adds a new **[§25 CPU AI specifications](#25-cpu-ai-specifications-designed-not-built-unless-flagged)**
>   (15 subsections: candidate selection 75/25 rule, no VP retention + 8-element rubric,
>   the bloc-vote IRV leadership ladder, the convention CPU per-ballot menu + compromise
>   picker, the **designer-acknowledged 36%-cabinet-pass-rate bug**, the legislation
>   NAY/AYE/NAY heuristic, scripted A/B/C event cabinet voting, conversion %-rolls with
>   Pliable+adjacency gating, the **overloaded Iron Fist** trait, the 4-condition faction-leader
>   removal table, kingmaker endorsement preferences, the under-tuned CPU primary AI, the
>   deterministic Whig→"Conservative Party" rename trigger, the long-term Justice ideology
>   drift, and the architectural CPU gaps). The Civil War / Reconstruction battle %-formula
>   is now **multi-confirmed across 5+ wars + 4 eras** (the engine generalizes cleanly), and
>   the Reconstruction END exec action is freshly spec'd. Live designer patches in-thread
>   (continuous IRV elimination, ±3 ideology-swing cap, 5%/half-term retirement/death rate,
>   deterministic Whig→Conservative-Party rename) extend the **★ "forum DRIVES the build"**
>   theme. Mostly **corroborates + sharpens** the gap log; the truly NEW surface is the
>   CPU-AI cluster. Also reveals that **contingent-election rules don't exist** in the rules
>   doc (GM invented 5 rulesets mid-thread, DH-pointer in [§24.2](#242-62-contingent-house-election--tied-chamber-inverse-control)).
> - **Batch 6** — `c50d9da7` (1172-post "Era of Populism Playtest", 2012→mid-2017 multiplayer,
>   `pop`): the **first dedicated fresh-boot of a modern-era scenario** in any ingested thread.
>   `modern` (batch 3) entered the modern era from a 1948 campaign that had played 60 in-game
>   years forward; `pop` records how a **fresh 2012 scenario BOOTS from cold**. Adds a new
>   **[§26 Scenario-boot model & modern endgame](#26-scenario-boot-model--modern-endgame-designed-not-built)**
>   (7 subsections: the cross-cutting **mid-government boot shape** at 1788/1856/2012; the
>   Era-of-Populism scenario specifics with **10 pre-built faction decks** instantiating
>   "Trumpism" / "Bernie-populism" as **data, not code**; **era-coded double-points scoring**
>   on the era's defining issues; the **APOCALYPSE Planet-Health 10-year game-end clock** — a
>   **NEW meter-driven endgame model** distinct from the event-driven `triggersGameEnd`; the
>   **era-event-creates-office** generalization of the institutional-layer (a bill installs a
>   new cabinet seat); refined **modern SCOTUS confirmation rules** (auto-AYE within 1 ideology
>   step; Manipulative-compelled retirement); and **12th-Amendment-gated VP actions**
>   (amendments toggle capabilities, not just durable state)). Sharpens §22 modern's chair
>   mechanics + filibuster + bill-resolution; §25.8/§25.9 with the conditional-vote-rules
>   CPU-handler insight; §22.10's 53-state result reframed as **state count = year × era**
>   (2012 boot = 50 + DC, **not** 53 — the 53-state roster is the product of `modern`'s
>   60-yr annexation chain). Also lifts the modern era's corroboration to **both 60-year
>   continuation AND fresh scenario boot**, anchoring the build constraint:
>   **era identity = data configuration, NOT code paths.** Cite `pop#POST N`. New design
>   holes DH-24..DH-28 logged to `game-context.md`.
>
> **Alt-history note.** All five forum threads (and especially `modern`/`pop`) play a
> **divergent alternate timeline**, not real history: fictional **era names** (the
> `modern` thread plays the "Era of Terror" → "Era of Populism", not "the 2000s"), a
> game clock that **runs ~10 years behind real-world technology**, **53 states**
> (incl. DC/Cuba/Puerto Rico as full states), and ahistorical officeholders and court
> outcomes. **Mechanics are gated by the game's `Era` enum, not by literal calendar
> years.** Year predicates (`year % 4`, `year % 2`) only set the *cadence* of phases;
> *which systems are legal* is an era-enum question. The historian's real-history framing
> lives in `historical-context.md`; this doc treats the eras as the game's own. The
> **modern era is the one window where BLUE = left / RED = right matches everyday usage
> with no polarity caveat** (`historical-context.md` §10).
>
> **Confidence flag.** A rule marked **(confirmed across federalism + gilded)** (or
> "+ 1772 solo") has been independently observed in two/three threads — the strongest
> signal it is a real, load-bearing rule, not a one-off GM ruling. Outright **bugs**
> in shipped behavior are not catalogued here; see `game-context.md` →
> "Confirmed shipped bugs" (the roadmap owns those fixes), cross-referenced in [§19](#19-shipped-vs-designed-boundary).
>
> **How to read citations.** `phaseRunners.ts:3431` = file `src/engine/phaseRunners.ts`,
> line 3431. `types.ts:229` = `src/types.ts`. Odds are probabilities in `[0,1]`;
> `chance(p)` is a seeded-RNG Bernoulli draw (`rng.ts`). All RNG is deterministic per
> seed — engine code never calls `Math.random` *except* a handful of legacy spots noted
> inline (e.g. `calcStateVote` noise term, 1856 setup shuffles).

---

## Table of contents

1. [Core model & invariants](#1-core-model--invariants)
2. [The turn / phase loop](#2-the-turn--phase-loop)
3. [Politicians & stats](#3-politicians--stats)
4. [Draft (2.1.1)](#4-draft-211)
5. [Career tracks & the expertise pipeline (2.1.2)](#5-career-tracks--the-expertise-pipeline-212)
6. [Politician churn: flip-flop, relocation, ideology, conversion, kingmakers (2.1.3–2.1.7)](#6-politician-churn-213217)
7. [Factions, parties & alignment drift (2.1.8)](#7-factions-parties--alignment-drift-218)
8. [Leadership selection (2.2.x)](#8-leadership-selection-22x)
9. [Cabinet & military appointments (2.3.x)](#9-cabinet--military-appointments-23x)
10. [Events: deaths, anytime, era (2.4.x)](#10-events-24x)
11. [Governance: lingering meters, governors, court, gov's-actions library, state policies (2.5.x)](#11-governance-25x)
12. [Legislation (2.6.x) — block/replace, packaging, filibuster, crisis bills](#12-legislation-26x)
13. [Foreign affairs & war (2.7.x) — per-power meters, diplomacy library, surplus](#13-foreign-affairs--war-27x)
14. [Executive & court management (2.8.x) — actions library, amendments](#14-executive--court-management-28x)
15. [Elections (2.9.x), `calcStateVote`, and the convention machinery](#15-elections-29x-and-calcstatevote)
16. [End of half-term (2.10)](#16-end-of-half-term-210)
17. [Era systems: Continental Congress, Constitutional Convention, Revolutionary War, territories, era-event graph](#17-era-systems)
18. [System interactions](#18-system-interactions)
19. [Shipped vs. designed boundary](#19-shipped-vs-designed-boundary)
    - [19.1 Design divergences for the roadmap](#191-design-divergences-for-the-roadmap)
20. [Federalism era (designed, not built)](#20-federalism-era-designed-not-built)
21. [Cross-era mechanics revealed by batch 2 (designed, not built)](#21-cross-era-mechanics-revealed-by-batch-2-designed-not-built)
    - [21.1 Generic cross-era war system](#211-generic-cross-era-war-system)
    - [21.2 Per-state presidential-election method](#212-per-state-presidential-election-method)
    - [21.3 Amendments as durable, separately-ratified state](#213-amendments-as-durable-separately-ratified-state)
    - [21.4 Firing-precedent gate on cabinet changes](#214-firing-precedent-gate-on-cabinet-changes)
    - [21.5 Bill-driven statehood + auto-generated officials](#215-bill-driven-statehood--auto-generated-officials)
    - [21.6 Bill typing + budget-gated spending cap](#216-bill-typing--budget-gated-spending-cap)
    - [21.7 Era-event scheduling model vs. `coreSpine`](#217-era-event-scheduling-model-vs-corespine)
    - [21.8 Named-ordinal meter model + ±3 swing cap + war-score meter](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter)
22. [Modern era systems (designed, not built)](#22-modern-era-systems-designed-not-built)
    - [22.1 The named meter bank + numeric debt + crisis/cascade](#221-the-named-meter-bank--numeric-debt--crisiscascade)
    - [22.2 Faction-enthusiasm / Party-Preference election engine + the Score economy](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy)
    - [22.3 Presidential primary subsystem (2.9.1)](#223-presidential-primary-subsystem-291)
    - [22.4 Third-party-challenge trigger (2.9.3)](#224-third-party-challenge-trigger-293)
    - [22.5 General-election library (2.9.4)](#225-general-election-library-294)
    - [22.6 The CPU delegate engine (convention + primary apportionment)](#226-the-cpu-delegate-engine-convention--primary-apportionment)
    - [22.7 SCOTUS subsystem (2.5.3 + 2.8.2)](#227-scotus-subsystem-253--282)
    - [22.8 Investigation special committees (under-designed)](#228-investigation-special-committees-under-designed)
    - [22.9 Military-leadership appointment tier (2.3.2)](#229-military-leadership-appointment-tier-232)
    - [22.10 53-state alt roster + modern apportionment](#2210-53-state-alt-roster--modern-apportionment)
    - [22.11 Era clock & era enum (alt-history)](#2211-era-clock--era-enum-alt-history)
23. [Civil War & Reconstruction (1856-arc) (designed, not built)](#23-civil-war--reconstruction-1856-arc-designed-not-built)
    - [23.1 Secession + Southern-Unionist / Secessionist trait gating](#231-58-secession--southern-unionist--secessionist-trait-gating-the-antebellum-payoff)
    - [23.2 Free/Slave sectional-balance crisis scoring](#232-59-freeslave-sectional-balance-crisis-scoring-the-nationalism-crisis-engine)
    - [23.3 Civil War — the two-theater combat engine](#233-56-civil-war--the-two-theater-combat-engine-multi-term-subsystem)
    - [23.4 Reconstruction readmission subsystem](#234-57-reconstruction-readmission-subsystem-end-nationalism--gilded)
    - [23.5 Canada conquest → era-gated statehood + Canadian draft](#235-60-canada-conquest--era-gated-territorystatehood--canadian-draft)
24. [Other 1856-arc systems revealed by `house-divided` (designed, not built)](#24-other-1856-arc-systems-revealed-by-house-divided-designed-not-built)
    - [24.1 Succession / eligibility / the acting-president state](#241-61-succession--eligibility--the-acting-president-state)
    - [24.2 Contingent House election + tied-chamber inverse control](#242-62-contingent-house-election--tied-chamber-inverse-control)
    - [24.3 Primary Era — state-opt-in primaries → Groups 1–5](#243-63-primary-era--state-opt-in-primaries--presidential-primary-groups-15)
    - [24.4 Amendment ratification by 3/4 of Governors — era-keyed, tunable](#244-64-amendment-ratification-by-34-of-state-governors--era-keyed-then-tunable)
    - [24.5 Investigations — the authored "3.0.40" 5d6 spec](#245-65-investigations--the-authored-3040-5d6-special-committee-spec)
    - [24.6 The Progressive-era institutional layer](#246-66-the-progressive-era-institutional-layer-offices-created-in-game-by-law)
    - [24.7 Lingering — the ~16-meter homeostasis engine](#247-67-lingering--the-16-meter-homeostasis-engine-era-gated-foreign-meters)
    - [24.8 Draft rookie grants re-ruled — "3 traits + 3 alt-states"](#248-69-draft-rookie-grants-re-ruled--3-traits--3-alt-states)
25. [CPU AI specifications](#25-cpu-ai-specifications-designed-not-built-unless-flagged)
    - [25.1 Candidate selection (the 75/25 rule)](#251-candidate-selection-open-seats-primaries-conventions--the-7525-rule)
    - [25.2 VP selection (no retention; 8-element rubric)](#252-vp-selection--no-retention-logic-designer-acknowledged-bug)
    - [25.3 Leadership / Speaker / PPT — IRV bloc-vote tie-break](#253-leadership--speaker--ppt--irv-style-bloc-vote-tie-break-ladder)
    - [25.4 Convention CPU — per-ballot menu + compromise picker](#254-convention-cpu--per-ballot-momentum--interballot-menu--compromise-picker)
    - [25.5 Cabinet confirmation — designer-acknowledged 36% pass rate](#255-cabinet-confirmation--designer-acknowledged-bug-36-of-88-nominees-passed)
    - [25.6 Legislation voting heuristic (NAY/AYE/NAY)](#256-legislation-voting-heuristic-nayayenay)
    - [25.7 Scripted A/B/C event cabinet voting](#257-scripted-abc-event-cabinet-voting)
    - [25.8 Conversion AI — Pliable + ideology-adjacency gating](#258-conversion-ai--deterministic--rolls-with-pliable--ideology-adjacency-gating)
    - [25.9 Iron Fist — the overloaded trait](#259-iron-fist--the-overloaded-trait-designer-flagged-to-split)
    - [25.10 Faction-leader replacement — 4-condition removal](#2510-faction-leader-replacement--4-condition-removal)
    - [25.11 Kingmaker / endorsement preference rules](#2511-kingmaker--endorsement-preference-rules)
    - [25.12 CPU primary AI (under-tuned)](#2512-cpu-primary-ai-designer-acknowledged-under-tuned)
    - [25.13 Faction-rename rule — Whig → "Conservative Party"](#2513-faction-rename-rule--whig-auto-rename-to-conservative-party-deterministic)
    - [25.14 Long-term Justice ideology drift](#2514-long-term-justice-ideology-drift-the-canonical-drift-rule)
    - [25.15 Critical missing CPU logic (architectural gaps)](#2515-critical-missing-cpu-logic-architectural-gaps)
26. [Scenario-boot model & modern endgame (designed, not built)](#26-scenario-boot-model--modern-endgame-designed-not-built)
    - [26.1 The mid-government boot shape (general)](#261-the-mid-government-boot-shape-general)
    - [26.2 Era-of-Populism scenario boot specifics](#262-era-of-populism-scenario-boot-specifics)
    - [26.3 Era-coded scoring multipliers (double-points issues)](#263-era-coded-scoring-multipliers-double-points-issues)
    - [26.4 APOCALYPSE Planet-Health endgame — the 10-year clock (NEW endgame model)](#264-apocalypse-planet-health-endgame--the-10-year-clock-new-endgame-model)
    - [26.5 Era-event-creates-office (bill installs a new cabinet seat)](#265-era-event-creates-office-bill-installs-a-new-cabinet-seat)
    - [26.6 Modern SCOTUS confirmation rules — refinements](#266-modern-scotus-confirmation-rules--refinements)
    - [26.7 12th-Amendment-gated VP actions (amendments toggle capabilities)](#267-12th-amendment-gated-vp-actions-amendments-toggle-capabilities)

---

## 1. Core model & invariants

- **The snapshot.** All state lives in one `FullGameSnapshot` (`types.ts:1811`): `game`
  (the `GameState` singleton), plus arrays `politicians, factions, parties, states,
  events, legislation, elections, wars`. The engine is **pure functions over the
  snapshot** — no React, no I/O. The React layer (`GameContext.tsx`) loads/saves it to
  IndexedDB and autosaves each phase.
- **Two scenarios, four eras.** `Era = 'independence' | 'federalism' | 'nationalism' |
  'modern'` (`types.ts:1337`). 1772 starts in `independence` (`scenario1772.ts:97`); 1856
  starts in `nationalism` with the Constitution already ratified (`scenario1856.ts:177`,
  `:181`).
- **Year cadence.** A *turn* is a **half-term = 2 years**. `advancePhase` wraps the year by
  **+2** at turn rollover (`engine.ts:108`, `phases.ts:161`).
- **The PV engine.** Every politician carries a `pvCache` (Political Value). `refreshPv`
  recomputes it after any stat/trait/office mutation (`pv.ts:91`). **PV drives elections,
  draft order, leadership scoring, and many tie-breaks** — see [§3](#3-politicians--stats).
- **Clamps used everywhere.** Skills/command `[0,5]` (`abilities.ts`); meters `[-5,5]`;
  `partyPreference` `[-5,5]`; enthusiasm `[-5,5]`; interest groups `[-10,10]`; diplomacy
  `[-5,5]`; state bias `[-5,5]`; loyalty `[0,1]` (`types.ts:1186`).

---

## 2. The turn / phase loop

### 2.1 The driver

Two engine functions run the loop (`engine.ts`):

- **`runCurrentPhase(snap)`** (`engine.ts:16`) executes the body of `snap.game.phaseId`,
  dispatching to the matching `runPhase_*` in `phaseRunners.ts`. It returns
  `needsPlayerInput` for the five interactive phases (`'draft' | 'eraEvent' | 'cabinet' |
  'convention' | 'ccBuilder' | 'ccAIConfirm'`); a pending Constitutional Convention
  **pre-empts everything** (`engine.ts:18`). It also calls `openSummaryIfNeeded` to open
  the half-term summary at the top of a turn (`engine.ts:21`).
- **`advancePhase(snap)`** (`engine.ts:95`) moves `phaseId` to the next **eligible** phase
  via `nextPhaseInfo`, skipping gated phases, and bumps the year by +2 on wrap. Exiting an
  events phase (`2.4.2`/`2.4.3`) clears the "just fired" badge state (`engine.ts:99`).

### 2.2 `PHASE_SEQUENCE` in order

The full sequence (`phases.ts:3`). Each row: phase id, what it does, and its **gate**.

| Phase | Label | What it does | Gate (besides era rules below) |
|---|---|---|---|
| **2.1 Politician Management** |
| 2.1.1 | Politician Draft | Rookies enter pool; snake draft | Draft year (`year%4==0`) **or** 1772 first turn |
| 2.1.2 | Career Tracks | Track assignment + skill/trait/expertise gains | — |
| 2.1.3 | Flip-Flopper Cleanup | Decay flip-flop penalties | skipped 1772 first turn |
| 2.1.4 | Relocations | Politicians try to change state | — |
| 2.1.5 | Ideology Shifts | Drift + faction-pull shifts | — |
| 2.1.6 | Faction Conversions | Defect / poach / sign | — |
| 2.1.7 | Kingmakers & Protégés | Mentor anointing, bonding, graduation | — |
| 2.1.8 | Faction Personalities | Card swaps, alignment drift, lobby→industry | — |
| **2.2 Leadership Selection** |
| 2.2.1 | Congressional Leadership | Speaker + Pro Tem (or CC President in 1772) | skipped 1772 first turn |
| 2.2.2 | Committee Chairs | 4 committees (or CC committees in 1772) | skipped 1772 first turn |
| 2.2.3 | Faction Leaders | Elect / challenge faction leaders | — |
| 2.2.4 | Party Leaders | Each party picks a leader | **skipped entire independence era** |
| **2.3 Presidential Appointments** |
| 2.3.1 | Cabinet | President fills cabinet seats | **skipped entire independence era** |
| 2.3.2 | Military | General in Chief | **skipped entire independence era** |
| **2.4 Events** |
| 2.4.1 | Deaths & Retirements | Mortality, ability/trait decay | — |
| 2.4.2 | Anytime Events | National + personal historical events | — |
| 2.4.3 | Era Events | **INTERACTIVE** era decisions | — |
| **2.5 Governance** |
| 2.5.1 | Lingering | National meters tick from cabinet | skipped 1772 first turn |
| 2.5.2 | Governor Actions | Governors nudge state bias | needs `governorsExist` |
| 2.5.3 | Supreme Court | Pending cases decided | **skipped until Constitution** |
| **2.6 Congress in Session** |
| 2.6.1 | Bill Proposals | Factions propose bills (CC bills in 1772) | skipped 1772 first turn |
| 2.6.2 | Committee Review | Bills pass/killed in committee | skipped 1772 first turn |
| 2.6.3 | Floor Votes | House + Senate (or CC vote in 1772) | skipped 1772 first turn |
| **2.7 Foreign Affairs** |
| 2.7.1 | Diplomacy | Relations drift | skipped 1772 first turn |
| 2.7.2 | Military Action | Resolve battles | only if war active |
| **2.8 Executive Actions** |
| 2.8.1 | Executive Actions | President unilateral acts | **skipped entire independence era** |
| 2.8.2 | Court Management | Justice retirement + fills | **skipped entire independence era** |
| **2.9 Elections** |
| 2.9.1 | Presidential Primaries | Each party nominates | presidential year; **skipped independence** |
| 2.9.2 | Conventions | Ratify primary winners | presidential year; **skipped independence** |
| 2.9.3 | Third Party | Third-party check (currently a no-op log) | presidential year; **skipped independence** |
| 2.9.4 | Presidential Election | State-by-state general | presidential year; **skipped independence** |
| 2.9.5 | Governor Elections | State governor races | presidential year; needs `governorsExist` |
| 2.9.6 | Congressional Elections | House + Senate — **or the 1772 First-CC builder** | election year (`year%2==0`) |
| **2.10 End of Turn** |
| 2.10 | End of Half-Term | Aging (+2), CC reassembly, summary close | — |

### 2.3 Year predicates (`phases.ts:49`)

- `isElectionYear(year)` ⇔ `year % 2 === 0`
- `isPresidentialYear(year)` ⇔ `year % 4 === 0`
- `isDraftYear(year)` ⇔ `year % 4 === 0`

Because a turn is 2 years and start years (1772, 1856) are multiples of 4, **draft and
presidential phases land on alternating turns**.

### 2.4 Era gating (`shouldRunPhase`, `phases.ts:62`)

Year gates apply first (`phases.ts:64–77`). Then, for `independence`:
- Party leaders (2.2.4), all of 2.3, all of 2.8, and presidential election phases
  (2.9.1–2.9.4) are **skipped entirely** (`phases.ts:87–102`).
- Supreme Court (2.5.3) skipped until the Constitution (`phases.ts:93`).
- Governor actions (2.5.2) and governor elections (2.9.5) need `governorsExist`
  (`phases.ts:96`, `:105`).
- **2.9.6 is repurposed in 1772**: it builds the First Continental Congress, but only when
  `scenarioId==='1772'`, `year≥1774`, the `intolerable_acts` event resolved with response
  `'ok'` (Convene CC), and the CC isn't already seated (`phases.ts:111–122`). All other
  independence scenarios skip 2.9.6.
- **First-turn skips** (1772 `year===startYear`): 2.1.3, 2.5.1, 2.6.x, 2.7.x, and CC
  leadership 2.2.1/2.2.2 (`phases.ts:125–131`).
- 2.7.2 (battles) runs only if `revolutionaryWar.active` (`phases.ts:134`).

### 2.5 Era boundaries — per-era point banking + the new-era boot pipeline (designed, not built)

> **Resolves the long-open "does the point-reset fire at an era boundary?" question.**
> Confirmed across **federalism** (`fed` 518), **modern** ([§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy)),
> and now **1856-native** (`hd` digest §II, POST 6679–6816). **Faction points do NOT carry
> over linearly across eras — they BANK per era toward an end-of-game total**, and a heavyweight
> boot pipeline runs at each era boundary. (Shipped engine has no notion of this: `currentEra`
> flips at a single trigger — `constitutionalConvention.ts:198` — with no point reset or boot
> sequence.)

The campaign is **one continuous game across an era ladder** (a 1856 start traverses
Nationalism → Gilded `1868` → Progressivism `1892` → … toward WW1; `hd` reached mid-1904). At
each boundary a **~12-step new-era boot pipeline** fires (`hd` POST 6679–6816):

1. **End-of-era awards** are paid (most era points, most from the *other* party, the
   winning party's factions — the same award table as `modern` [§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy), `modern` post 1080).
2. **Faction points reset to per-era banks** — the era's accumulated score is **banked**, then
   the running total zeroes for the new era. The cumulative scores seen *mid-era* are
   **within-era**; the banked sub-totals are what accumulate toward the end-of-game total.
3. **Faction trades** (rosters reshuffle for the new era).
4. **Full 2.1.x → 2.3.1 re-run** under the new era's rules (re-draft, re-elect leadership,
   re-form cabinet).
5. **New card pool + new draft pool** for the era ([§7.4.1](#741-era-gated-multi-pool-card-library-designed-not-built));
   the boundary can **split an ideology's cards across two factions** (`modern` post 1200).

> **Win-condition implication (open question for the human, carried from the digest).** Because
> points bank per era rather than reset-and-discard, **the per-era bank → cumulative end-of-game
> total** is the candidate **cross-era win condition** for a full-timeline campaign. Whether
> this is the canonical scoring and whether *any* of it is in the build are open (the shipped
> build is pre-late-game-loop). Cross-ref `game-context.md` #2, #68.

---

## 3. Politicians & stats

A `Politician` (`types.ts:1251`) is the atomic unit. Its game-relevant axes:

### 3.1 The four character axes

| Axis | Type | Range | Notes |
|---|---|---|---|
| **Skills** | `{admin, legislative, judicial, military, governing, backroom}` | integers `0–5` | `types.ts:24` |
| **Command** | `command: number` | `0–5` | leadership/military capacity; gates Kingmaker (`types.ts:1281`) |
| **Expertise** | `Expertise[]` | 19 tags | a *third* axis — what they studied; `types.ts:182` |
| **Traits** | `Trait[]` | ~70 traits | positive/negative modifiers; `types.ts:62` |

The **19 expertise tags** (`types.ts:188`): Agriculture, Business, Economics, Education,
Energy, Environment, Foreign Affairs, Healthcare, Housing, Justice, Labor, Media, Military,
Naval, Science, Technology, Trade, Transportation, Welfare.

### 3.2 Ideology (7-point scale)

`IDEOLOGY_ORDER` (`types.ts:14`), indices 0–6:

`LW Populist(0) · Progressive(1) · Liberal(2) · Moderate(3) · Conservative(4) ·
Traditionalist(5) · RW Populist(6)`

"Distance" between two ideologies = `|index difference|`. Used in voting, conversion fit,
faction-center math, and ideology shifts.

### 3.3 Loyalty

`loyalty ∈ [0,1]`, default `1.0` (`types.ts:1273`). Only consumed by the 1856 **Secession
Winter** event. Seeded low for historical Buchanan secessionists (Cobb/Floyd/Thompson
`0.5`, Cass `0.9`). See [§10.3](#103-243-era-events) and [§18](#18-system-interactions).

### 3.4 Political Value (PV) — `computePV` (`pv.ts:67`)

The single scalar that ranks politicians. Steps:

1. **Weighted skills** — multiply each skill by an **office-specific weight** (`pv.ts:33`,
   `officeWeights`) and sum, then `× 4` to map ~0–30 onto ~0–120 (`pv.ts:73`). Example
   weights: Senator/Speaker weight `legislative` at 2.5; Justice weights `judicial` at 3;
   General weights `military` at 3; cabinet seats weight `admin` at 2.5; no office = flat
   1× across the board (`pv.ts:62`).
2. **Command** — `+ command × 10` (`pv.ts:74`).
3. **Traits** — `+4` per positive, `−5` per negative (`pv.ts:75`); `Kingmaker` adds an
   extra `+6` (`pv.ts:79`). Positive/negative sets at `types.ts:119`/`:154`.
4. **Office prestige** — `+ OFFICE_PRESTIGE[office]` (`pv.ts:7`): President 30, CC President
   25, Chief Justice 18, Party Leader 14, Speaker/VP/SecState/General 12, … Representative 2.
5. **Faction leadership** — `+8` if `factionLeaderOf` set (`pv.ts:83`).
6. **Age curve** — over 70: `−1.5 × (age−70)`; under 30: `−0.8 × (30−age)` (`pv.ts:85`).
7. **Flip-flop penalty** — `− 5 × flipFlopperPenalty` (`pv.ts:87`).
8. Floor at 0, round (`pv.ts:88`).

> **Worked PV.** A 50-year-old Senator, skills `legislative 4 / backroom 2` (rest 0),
> command 1, traits `[Charismatic, Integrity]`, no leadership:
> weighted skills = `4×2.5 + 2×1.0 = 12` → `×4 = 48`; `+command 10`; `+traits 8`;
> `+Senator prestige 5` ⇒ **PV 71**.

---

## 4. Draft (2.1.1)

`runPhase_2_1_1_Draft` (`phaseRunners.ts:107`). Rookies join the pool and factions pick in
**snake order**. Interactive: when it's the player faction's turn the phase returns the
draft pool for a human pick (`engine.ts:27`).

### 4.1 Pool sourcing (precedence)

1. **1772 inaugural draft** (`phaseRunners.ts:113`): one-shot, gated by
   `scenarioId==='1772' && year===startYear && !inauguralDraftSeeded`. The *entire* bundled
   dataset class is instantiated (`instantiateDraftees`) and every draftee enters one long
   **expansion draft** (the whole pool is drained — `scenario1772.ts:86`,
   `:112–117`). Snake order rebuilt from current faction PV sums (ascending), `rounds =
   max(2, ceil(pool/factions))` (`phaseRunners.ts:122–132`).
2. **Annual draft** (`phaseRunners.ts:142`), when the pool is empty and not yet drafted this
   year. Source precedence: user custom classes → bundled standard classes → **random
   rookie generation**.
3. **Random rookies** (`phaseRunners.ts:177`): `draftSize = factions.length × 2` (20 for 10
   factions). Each rookie: skills drawn `0–1` with one boosted skill set to `2–3`; age
   `28–39`; 30% chance of one positive trait from a small pool; loyalty `1.0`
   (`phaseRunners.ts:185–223`).

Draftees whose home state isn't yet in the Union are **held back** with a log line
(`phaseRunners.ts:160`).

### 4.2 Picking — `pickBestForFaction` (`phaseRunners.ts:33`)

Score each eligible candidate = `pvCache + 25` if the candidate's ideology matches the
faction's personality bucket (LW↔{LW Pop, Prog, Lib}; RW↔{Cons, Trad, RW Pop};
Center↔{Mod, Lib, Cons}); **1772 inaugural** adds `+50` for an ideology the faction is
eligible to claim (`FACTIONS_1772.eligibleIdeologies`, `factions1772.ts:12`). Highest score
wins, ties by id. Recording (`recordDraftPick`, `phaseRunners.ts:55`) stamps
`factionId/partyId/draftedYear`, removes from pool, logs, and appends to `draftHistory`.

After the draft, `runDraftKingmakerTopUp` raises each faction to the Kingmaker floor (see
[§6.5](#65-217-kingmakers--protégés)).

---

## 5. Career tracks & the expertise pipeline (2.1.2)

`runPhase_2_1_2_CareerTracks` (`phaseRunners.ts:401`). Idle politicians get a **career
track**; tenure accrues; threshold rolls grant skills/traits/expertise. This is the head of
the **PR7 lobby→expertise→industry→ideology chain**.

### 5.1 Tracks (`types.ts:43`) and their tables

Seven tracks: `Private, Military, Governing, Administration, Legislative, Judicial, Backroom`.

| Track | Primary skill (`TRACK_SKILL` `types.ts:195`) | Themed traits (`TRACK_THEMED_TRAITS` `:205`) | Exit expertise (`TRACK_EXPERTISE` `:217`) | Secondary skills (`TRACK_SECONDARY_SKILLS` `:611`) |
|---|---|---|---|---|
| Private | — | Celebrity, Propagandist, Orator | Business | governing, admin |
| Military | military | Crisis Manager, Leadership | Military | admin |
| Governing | governing | Leadership, Charismatic, Harmonious | Agriculture | admin, legislative |
| Administration | admin | Efficient, Egghead, Leadership | Economics | legislative, governing |
| Legislative | legislative | Orator, Debater, Reformist | — | governing (admin **excluded**) |
| Judicial | judicial | Integrity, Egghead, Harmonious | Justice | — |
| Backroom | backroom | Manipulative, Kingmaker, Numberfudger | — | — |

Caps: `CAREER_TRACK_MAX_YEARS = 20`, `CAREER_TRACK_CAP = 5` (per faction per track)
(`types.ts:236`).

### 5.2 Order of operations

1. **CPU track management** (`phaseRunners.ts:418`): on hitting 20 years, exit the track,
   grant exit expertise (`TRACK_EXPERTISE`), and (if `age<60`) pick the next-best track via
   `bestAvailableTrack` (highest below-cap skill whose track isn't full). Idle CPU
   politicians under 50 get assigned a track.
2. **Accrual & thresholds** (`phaseRunners.ts:454`): `careerTrackYears += 2` each turn; at
   every 4-year multiple (≤20) fire `rollThreshold`.
3. **`rollThreshold`** (`phaseRunners.ts:299`), three independent rolls at threshold
   N (=years/4), constants in `CAREER_ODDS` (`types.ts:229`):
   - **Primary skill** — `0.5` chance, `+1` to the track's primary (Private picks a random
     below-cap skill).
   - **Secondary skill** — `0.25` chance (`ABILITY_EARN_RULES.secondaryTrack`), `+1` to one
     of `TRACK_SECONDARY_SKILLS` (empty pools = no-op).
   - **Themed trait** — rising odds `themedByThreshold = [0.15, 0.3, 0.45, 0.6, 0.75]`
     (index N−1), grant a track-themed trait via `tryGrantTrait` (d6 conflict).
   - **Random off-track trait** — `0.12` chance; `75%` positive / `25%` negative
     (`CAREER_RANDOM_NEGATIVES = [Corrupt, Scandalous, Controversial, Flip-Flopper]`).
   - If the politician **has a live mentor** (`hasMentor`), an extra primary-skill roll
     fires (`rollMentorBonusSkill`, `phaseRunners.ts:1257`).
4. **PR7 lobby→expertise trickle** (`phaseRunners.ts:472`): for each faction, each held
   lobby card with a non-null `LOBBY_EXPERTISE` mapping (`types.ts:373`), every living
   member has a **`0.10`** chance (`LOBBY_RULES.expertiseGrantOdds`, `types.ts:430`) to gain
   that expertise. E.g. `Merchants→Business`, `Planters/SlavePower→Agriculture`,
   `UrbanLabor→Labor`, `Lawyers→Justice`, `Expansionists→Foreign Affairs`. Non-economic
   lobbies (Patriots, Reformers, Abolitionists, …) map to `null` → no grant.

The player sets their own track via `setPlayerCareerTrack` (cap-enforced,
`phaseRunners.ts:495`).

---

## 6. Politician churn (2.1.3–2.1.7)

All five run as: a lazy one-time **trait-seed pass** (where relevant) → **CPU attempt
passes** (budget- and gate-limited) → optional **passive pass** → `refreshPv`. Each tracks
attempts (incl. failures) per faction per year and stamps the politician so they aren't
re-tried that turn. Per-turn budgets are 5 (`*_ATTEMPTS_PER_TURN`); feeds cap at 200.

### 6.1 (2.1.3) Flip-flopper cleanup

`runPhase_2_1_3_FlipFlopper` (`phaseRunners.ts:519`): every politician with
`flipFlopperPenalty > 0` decrements by 1. The penalty costs `−5 PV` each (`pv.ts:87`), so it
bleeds off over a few turns.

### 6.2 (2.1.4) Relocations

`runPhase_2_1_4_Relocations` (`phaseRunners.ts:623`). Constants `RELOCATION_ODDS`
(`types.ts:241`).

- **Seed** (one-shot): assign an `altState` — `0.40` same-region, `0.15` cross-region, else
  none (`phaseRunners.ts:628`).
- **Success odds by band** (`relocationOdds`, `phaseRunners.ts:544`): `sameRegionAlt 0.75 /
  sameRegion 0.50 / crossRegionAlt 0.40 / crossRegion 0.20`.
- **Carpetbagger roll on success**: base `0.05` same-region / `0.30` cross-region, `×0.5` if
  moving to the seeded altState. On a hit, grant the first un-held trait from the ordered
  **`CARPETBAGGER_LADDER = [Carpetbagger, Outsider, Controversial, Unlikable]`**
  (`types.ts:250`).
- **CPU gate**: `0.30` if a usable altState exists, else `0.10` then a heuristic destination
  (same region, fewest residents) (`phaseRunners.ts:645`).

#### 6.2.x Forum design layer (designed, not built)

The shipped engine ticks one CPU pass per faction; the forum runs an explicit player budget
on top.

- **Per-faction relocation budget**: 4 attempted moves per half-term; **alt-state moves don't
  count** against the cap (digest D / post 27). Forum framing: GM names current "overpopulated"
  and "underpopulated" state lists (post 27: `IA, IL, KS, MA, MI, NY, OH, PA, WI` overpop;
  `AR, CU, ET, MS, NT, SC, ST, WT` underpop) — a non-mechanical reminder, but it implies a
  **`State.population` axis** and overpop/underpop computed from member counts.
  *(designed, not built — relate to existing `RelocationBand` `types.ts:1671`)*
- **Auto-Carpetbagger on alt-state moves** (post 36: `Ira Sherwin Hazeltine WI->MO (ALT-STATE)
  Done gains Carpetbagger`). The shipped roll is probabilistic; the forum awards Carpetbagger
  **deterministically** to anyone moving to their seeded `altState`. *(design divergence —
  shipped `CARPETBAGGER_LADDER` rolls; forum auto-grants)*

### 6.3 (2.1.5) Ideology shifts

`runPhase_2_1_5_Ideology` (`phaseRunners.ts:823`). Constants `IDEOLOGY_SHIFT_ODDS`
(`types.ts:253`). Movement is always **one step** toward a target on the 7-point scale.

- **Seed**: `0.10` Ideologue / `0.08` Impressionable (`phaseRunners.ts:828`).
- **`factionCenter`** (`phaseRunners.ts:704`) — the target for "self" shifts; **load-bearing**
  (see [§7](#7-factions-parties--alignment-drift-218)).
- **Attempt odds** (`ideologyShiftOdds`, `phaseRunners.ts:746`): base `self 0.65`,
  `opposed 0.15`, each `× traitMult`; `Orator` leader adds `+0.05`. Trait multipliers
  (`traitMods`): **Ideologue** `{drift 0, self 0.5, opposed 0.25}` (immobile to passive
  drift); **Impressionable** `{drift 2, self 1, opposed 2}`.
- **Flip-flop risk**: opposed-direction success also rolls `ffRisk 0.5` (not trait-modified)
  → `flipFlopperPenalty += 1`.
- **CPU**: self-improvement scans its own roster (gate `0.30`, budget 3); opposed poaching
  scans the top-10-PV of other factions in office (gate `0.10`) (`phaseRunners.ts:845`).
- **Passive drift** (`phaseRunners.ts:886`): up to 3 ordered rolls (first success stops):
  faction-pull `0.08`, state-bias `0.04` (only if `|state.bias| ≥ 1.0`), residual `0.01`,
  each `× drift multiplier` (Ideologue's `0` short-circuits with no RNG draw).

#### 6.3.x Forum design layer: per-faction shift budget (designed, not built)

Forum runs ideology shifts as a **per-half-term budget**, not per-politician rolls
(post 27 / digest D).

- **Base budget**: 3 shifts per faction.
- **Leader-trait bonuses** stack additively, cap **9 total**:
  - Iron Fist leader: **+2**
  - Propagandist leader: **+1**
  - Manipulative leader: **+1**
  - Faction-leader-is-also-Party-Leader: **+2**
- Players spend the budget interactively on chosen politicians; engine rolls
  per-attempt success but the **count of attempts is forum-budgeted**, not engine-budgeted.
  *(design divergence — shipped engine rolls per-pol with no faction cap; forum has a hard
  per-faction cap of 3-9.)*

### 6.4 (2.1.6) Faction conversions

`runPhase_2_1_6_Conversions` (`phaseRunners.ts:1140`). Constants `CONVERSION_ODDS`
(`types.ts:268`). Three kinds: **sign** (recruit a free agent), **poach** (steal from
another faction), **defect** (passive departure).

- **Seed**: `0.08` Loyal / `0.08` Opportunist (`phaseRunners.ts:1143`).
- **Poach base matrix** (`poach.matrix[same|cross][inOffice|notInOffice]`): same-party
  `0.20 / 0.05`, cross-party `0.10 / 0.02`. **Sign base** `0.20`.
- **Willingness multipliers** (`conversionOdds`, `phaseRunners.ts:982`, all multiplicative):
  ideological fit better `×1.5` / worse `×0.5`; flip-flop history `×1.25`; mentor bond
  `×0.5` (poach resistance); high PV (`≥50`) `×0.75`; Flip-Flopper trait `×1.25`; **Loyal
  `×0.25`**, **Opportunist `×1.5`**; `Manipulative` actor leader `+0.05`.
- **Flip-flop on poach success**: `+1` same-party, `+2` cross-party (`ffStacks`).
- **Passive defection** (`phaseRunners.ts:1193`): base `0.02` (Loyal → 0, no RNG;
  Opportunist `×2`). On fire, `0.90` "one rank toward RW within party", else `0.10` random
  faction. Capped at `2` losses per source faction per turn.

#### 6.4.x Forum design layer: trait-gated conversion targeting (designed, not built)

The forum runs a stricter, **trait-gated targeting protocol** than shipped (digest D +
posts 37, 311, 316):

- **Cross-party flips**: only allowed if the target carries `Can Party Flip`. That trait is
  seeded each turn on **"disgruntled" ideologies** — Blue RW Populists and Red LW Pop / Prog
  (post 311). Only **party leaders** may attempt cross-party flips, and only against marked
  targets.
- **Attempt odds for cross-party flips** (post 311): base **10% if target is Pliable, 5% if
  target is Moderate, 15% if both**. The shipped engine uses a flat `0.10 cross-party` base
  not modulated by Pliable/Moderate.
- **Same-party flips**: party leaders **and** faction leaders may target *same-party other-
  faction* members, conditional on (a) the target has `Pliable` AND (b) the target's
  personal ideology is **same or adjacent** to the actor leader's ideology (post 37).
- **Passive leaders abstain**: a `Passive` leader (e.g. Pres Clinton, post 311) declines all
  conversion attempts that half-term.
- **Failure side-effects**: failed poach attempts can stamp the target with traits like
  `Integrity` (loses `Pliable`) or `Disharmonious` (post 312, 38). Shipped engine has no
  such failure-bounce table.
*(design divergence — engine uses uniform willingness multipliers; forum runs a stricter
trait-gated targeting+success table.)*

### 6.5 (2.1.7) Kingmakers & protégés

`runPhase_2_1_7_Kingmakers` (`phaseRunners.ts:1372`). Constants `KINGMAKER_RULES`
(`types.ts:295`). High-command politicians become **Kingmakers** and mentor **protégés**.

- **Command gate by scenario**: 1772 `1`, 1856 `4` (`commandGateByScenario`). Anyone at/above
  the gate gains the `Kingmaker` trait (`phaseRunners.ts:1382`).
- **Protégé eligibility** (`protegeCandidates`, `phaseRunners.ts:1275`): same faction & state,
  alive, age `<45`, PV `≥20`, not already mentored, office ∈ {Representative, Governor}.
- **Lifecycle sweep**: dissolve a bond on mentor/protégé death, retirement, or protégé
  defection (`phaseRunners.ts:1398`).
- **Graduation** (`phaseRunners.ts:1422`): triggers on **20-year tenure** OR protégé reaching
  Senator/President. One weighted roll: `0.45` command `+1`, `0.45` inherit a random positive
  mentor trait, `0.10` both. Mentor gains `Leadership`.
- **Draft floor** (`runDraftKingmakerTopUp`, `phaseRunners.ts:1344`): after each draft, top
  up each faction to `factionFloor = 10` Kingmaker-trait members from the top half by PV.

#### 6.5.x Forum design layer: protégé slot cap & gains (designed, not built)

- **Per-Kingmaker slot cap**: a Kingmaker hosts up to **5 active protégés** simultaneously
  (post 322 implies multi-protégé pairing — Royal C Taft taking on his "3rd protégé"). A
  Kingmaker with the `Leadership` trait unlocks a **6th** slot (digest, post 311). Shipped
  engine pairs at most **one** protégé per Kingmaker (`KINGMAKER_RULES`, `types.ts:295`).
- **Per-pairing gains** on selection (posts 38, 312, 322): the protégé gains
  **1 expertise + 1 random trait + 1 random skill point**, often the protégé's *first*
  point in that skill (e.g. "Daniel Manning gains Justice, Likable, +1 Legis (his 1st)").
  *(design divergence — shipped engine grants on **graduation** at 20-year tenure, not at
  pairing.)*

---

## 7. Factions, parties & alignment drift (2.1.8)

### 7.1 Static structure

- **Parties**: exactly two, `BLUE` and `RED` (`types.ts:3`), themed per scenario — 1772
  "Patriots (Anti-Federalist)" vs "Federalists" (`factions1772.ts:26`); 1856 "Democratic"
  vs "Republican" (`factions1856.ts:19`).
- **Factions** (`types.ts:1293`): 10 per scenario (5 per party). Each has a `personality`
  (`LW | Center | RW`) and three card sets — `ideologyCards`, `lobbyCards`, `interestCards`
  — plus an optional `leaderId`. 1772 factions also carry `eligibleIdeologies` for the draft
  (`factions1772.ts`).

### 7.2 `factionCenter` — the ideological barycenter (`phaseRunners.ts:704`)

The most-reused faction quantity. Algorithm:

1. Living members only. Empty ⇒ `null`.
2. Weighted mean of ideology indices; **the leader counts `1.5×`**
   (`LEADERSHIP_RULES.ideologyWeightInFactionCenter`).
3. **PR7 expertise bias**: sum each member's `EXPERTISE_IDEOLOGY_LEAN` (`types.ts:421`:
   Agriculture `+1`, Business `+0.5`, Labor `−1`, all else 0), divide by member count,
   **clamp to `[−1,+1]`**, then add `0.5 ×` that (`LOBBY_RULES.factionExpertiseBiasWeight`).
   Max possible shift = ±0.5 index.
4. `clamp(round(biasedMean), 0, 6)`.

> **Worked center.** Members at indices `[1,3,4]`, no leader, holding `Agriculture +
> Business + Labor` = `+0.5` total. rawMean `= 8/3 ≈ 2.67`; econLean `= 0.5/3 ≈ 0.167`;
> biased `= 2.67 + 0.5×0.167 ≈ 2.75` → **round 3 (Moderate)**. With zero expertise the result
> is byte-identical to the plain mean.

### 7.3 Alignment drift — `runPhase_2_1_8_FactionPersonalities` (`phaseRunners.ts:1623`)

Constants `ALIGNMENT_RULES` (`types.ts:330`). Order:

0. **PR7 lobby→industry nudge** (`phaseRunners.ts:1631`): for each state, each faction with
   a member there, each held lobby card → `+1` to the mapped `LOBBY_INDUSTRY` keys on that
   state (capped 5, once per state-key-turn). E.g. `NorthernIndustry→{manufacturing, coal}`,
   `SlavePower→{cotton, tobacco}`, `Merchants→{shipping, finance}` (`types.ts:398`). Keys
   absent on a state are skipped.
1. **Personality refresh** (`phaseRunners.ts:1658`): bucket the faction's center —
   `<2.5`=LW, `≥4.5`=RW, else Center (`personalityBuckets`). A change resets the stability
   clock.
2. **Card drift** (ideology/interest/lobby), each requiring **`stableTurns = 2`** turns of
   stability (Leadership leader adds +1 turn):
   - *Ideology cards* (`:1688`) swap an out-of-bucket card for an in-bucket one when the
     personality bucket has held.
   - *Interest cards* (`:1713`) **drop** at score `≤ −4` and **add** at score `≥ +4`
     (`dropThreshold/addThreshold`), capped at `cardCapPerType = 4`, bucket-matched.
   - *Lobby cards* (`:1769`) mirror interest drift but score via the
     `lobbyToInterest` proxy (`types.ts:339`).

### 7.4 Forum design layer: the card-distribution algorithm (designed, not built)

> **Corroborated across 1772 solo + gilded.** The gilded thread only showed the
> *per-half-term drift* (add/drop lines); the **1772 solo digest fully specifies the
> distribution algorithm** (`1772s` B9, posts 5, 15, 28, 53). This replaces the thinner
> batch-1 description. The shipped engine instead refreshes a personality bucket and swaps
> single cards (`runPhase_2_1_8_FactionPersonalities`, [§7.3](#73-alignment-drift--runphase_2_1_8_factionpersonalities-phaserunnersts1623)); it does **not** run this allocation.

**The full distribution, run each 2.1.8** (`1772s` B9):

1. **Ideology cards — primary.** Each faction's ideology card = the **ideology held by the
   most of its politicians**.
2. **Ideology cards — fill the era minimum.** Any remaining **era-minimum ideologies** (the
   ideologies the era requires to be represented somewhere) go to the **faction with the most
   pols of that ideology**.
3. **Adjacency rule.** A faction's ideology cards must be **adjacent on the 7-point scale**
   (no gaps). A gap is resolved by **dropping the card representing the fewest pols on either
   side of the gap** (the player even patched a sub-rule for genuinely undistributable cards,
   post 5).
4. **Interest/lobby cards — primary + disinterested top-up.** Each interest/lobby card goes
   to the faction with the **most "interested" pols** in it. Then **disinterested factions
   top up** with their **most-represented interest** — **subject to a `≥5`-pol floor that
   applies to the top-up only**, *not* to the first-ever distribution.
5. **Lobby activation by event.** A lobby card only enters the pool once an **event activates
   it** (post 18/28: **Lexington & Concord activated the Military-Industrial + Big Agriculture
   lobbies**). Until activated, the lobby cannot be held by anyone.

**Per-half-term drift** (the gilded view, post 49) then layers on top: discrete add/drop
lines driven by the legislative record, e.g. "@Brocklin Added: Big Corporations, Human
Rights; Lost: Liberals, Environmentalist, LW Media." Interest/lobby cards drop at low score
and add at high score (the shipped `dropThreshold ≤ −4` / `addThreshold ≥ +4`,
[§7.3](#73-alignment-drift--runphase_2_1_8_factionpersonalities-phaserunnersts1623), is the
nearest shipped analog).

*(designed, not built — implement the five-step allocation + lobby-activation gating in
2.1.8, alongside (not replacing) the existing card-drift swaps.)*

#### 7.4.1 Era-gated multi-pool card library (designed, not built)

The forum's card pool is **wider and era-gated** than the shipped deck. From the 1868–1870
turn (post 49) and 1870–1872 turn (post 323):

- **Newly observed lobby/interest cards**: `Big Corporations`, `Big Tech`, `Big Pharma`,
  `Big Oil & Gas`, `Big Agriculture`, `Globalist`, `Wall Street`, `Free Trade`,
  `Protectionist`, `Law & Order`, `Welfare`, `Human Rights`, `Civil Rights`, `Reformists`,
  `Environmentalists`, `Theocrats`, `Public/Private Education`, `Public Healthcare`,
  `LW Media / RW Media`, `Pacifists`, `Isolationists`, `Nationalists`, `Expansionists`,
  `LW Activists / RW Activists`, `Labor Unions`, `Public Housing`, `Mil-Ind`,
  `Energy`, `Transportation`. Many are anachronistic for 1868 (e.g. `Big Tech`,
  `Environmentalist`); the card pool is therefore the **multi-era catalog**, with
  per-era subsets *currently active*.
- **Half-term card swap log** is run by the GM in 2.1.8 as discrete add/drop lines:
  > "@Brocklin Added: Big Corporations, Human Rights; Lost: Liberals, Environmentalist,
  > LW Media." (post 49)
- **Era-specific draft-ideology mix**: entering the Gilded Age, post 1 notes "draft
  ideologies were updated. Only one change through as @Brocklin is now drafting Prog/Lib
  instead of Lib/Mod." Implies a per-(faction, era) ideology bucket table the engine does
  not yet carry. The 1856 scenario already encodes this for one era via
  `eligibleIdeologies`; it would need to grow per-era.
- **Activist groups forecast for the next era** (post 1): feminists, socialists, communists,
  prohibitionists, eugenicists, labor activists are forming in the Gilded Age and "would
  influence the next era greatly" — implying additional interest cards beyond what the
  build has seeded, plus an era after Gilded Age.
*(designed, not built — extend `Faction.ideologyCards|lobbyCards|interestCards` taxonomy
to a per-era catalog; extend the seed/draft-ideology-mix to be per-(faction, era).)*

---

## 8. Leadership selection (2.2.x)

> In **1772** these are largely re-routed to the Continental Congress (see [§17.1](#171-continental-congress)). 2.2.1/2.2.2 run CC President + CC committees in the independence era.

### 8.1 (2.2.1) Congressional leadership — `runPhase_2_2_1_CongressLeadership` (`phaseRunners.ts:1844`)

Determine majority party in each chamber (ties → BLUE). **Speaker** = top-PV House member of
the House majority; **Pro Tem** = top-PV Senate member of the Senate majority. On a *change*
of holder (not re-election), `+1 legislative` (`phaseRunners.ts:1873`, `:1884`).

### 8.2 (2.2.2) Committee chairs — `runPhase_2_2_2_Committees` (`phaseRunners.ts:1894`)

Four committees, each chaired by the live Congress member with the highest relevant skill:

| Committee | Skill | Expertise grant (`COMMITTEE_EXPERTISE` `types.ts:1237`) |
|---|---|---|
| Domestic | legislative | Welfare |
| Foreign | admin | Foreign Affairs |
| Economic | admin | Economics |
| Justice | judicial | Justice |

Each chair gets `+1 command`, `+1 legislative`, and the committee expertise
(`phaseRunners.ts:1921–1931`).

### 8.3 (2.2.3) Faction leaders — `runPhase_2_2_3_FactionLeaders` (`phaseRunners.ts:1940`)

Constants `LEADERSHIP_RULES` (`types.ts:438`), with per-era config (`eraConfig` `:460`):

| Era | baseFireChance | incumbencyAdvantage | ideologyTrigger | patronageTrigger |
|---|---|---|---|---|
| independence | 0.015 | 30 | 0.20 | 0.80 |
| federalism | 0.025 | 20 | 0.30 | 0.70 |
| nationalism | 0.045 | 15 | 0.40 | 0.60 |
| modern | 0.060 | 8 | 0.80 | 0.20 |

Steps: expire `Failed Bid` (`failedBidExpiresYear`); seed `Ambitious` at `0.05`. Then:

- **Vacant seat → election** (`:1965`): score eligible members `= pvCache − fitPenalty(1.0)×|idx
  − center| + min(traitBonusCap 6, 2×positiveTraits) + internalParty trait bonus`
  (`applyTraitElectionBonus(..., 'internalParty')`). Winner installed; on a real change gets
  command/legislative/governing/admin `+1` each (`applyFactionLeaderGrants`).
- **Valid incumbent → challenge** (`:2040`): top challenger (PV `≥ challengerPvFloor 30`).
  `fireChance = clamp(baseFireChance + ideologyTrigger×(ideoDist/6) + patronageTrigger×pvGap
  (+0.05 if Ambitious), 0, fireCap 0.20)`. If it fires, success
  `= clamp(0.5 + edge − incumbencyAdvantage/100, 0.05, 0.95)` where `edge = pvGap`. Loser
  gets `Failed Bid` for `year + 6` (`failedBidDecayTurns 3 × 2`).

### 8.4 (2.2.4) Party leaders — `runPhase_2_2_4_PartyLeaders` (`phaseRunners.ts:2130`)

**Skipped in the entire independence era.** Otherwise: if the sitting President is of the
party, they become party leader; else top-PV party member. Install grants command `+1` &
governing `+1`; re-election grants legislative `+1`.

### 8.5 Forum design layer (designed, not built)

#### 8.5.1 Congressional Leadership has nine roles, not two

> **Corroborated across federalism + gilded.** Federalism confirms the multi-role,
> multi-ballot pipeline — incl. a **six-ballot Pro Tem race** (fed post 3), **incumbent
> leaders un-challengeable when their party's meters are sky-high** (fed posts 447, 539),
> and **committee-chair eligibility = prior service on that committee** (fed = same as
> gilded post 66).

Forum 2.2.1 elects **all nine** congressional leadership posts (post 50, 324, 334) — the
build elects only Speaker and President Pro Tem. Roles, with example point/trait awards:

| Role | Forum award (post 334) |
|---|---|
| Speaker of the House | +500 pts, loses Obscure (post 60), gains Propagandist/Kingmaker on multi-term tenure |
| House Majority Leader | +250 pts, loses Obscure |
| House Majority Whip | +100 pts, gains Leadership |
| House Minority Leader | +250 pts |
| House Minority Whip | +100 pts, gains Debater |
| Senate Majority Leader | +500 pts |
| Senate Majority Whip | +100 pts, gains Manipulative |
| President Pro Tempore | (already in build) |
| Senate Minority Leader | +250 pts |
| Senate Minority Whip | +100 pts |

- **Whip races are ranked-choice with elimination**: each round, the lowest vote-getter is
  eliminated and their delegates flow to the closest-by-ideology remaining candidate
  (post 333: "Scott is eliminated and supports Sen Clark (random)" — random was due to
  ideological tie).
- **Incumbent protection**: when one party is dominant, that party's incumbents in their
  current leadership positions **cannot be challenged** (post 324: "Note: Red Incumbents
  cannot be challenged in their current positions").
- **Committee-chair eligibility constraint** (post 66): only Senators/Reps who have
  **previously served on that committee** are eligible to chair it ("William Meredith not
  eligible for Domestic Chair as he never served on that committee"). Engine 2.2.2
  currently auto-chooses the highest-skill member regardless of prior service.
*(designed, not built — extend `Office` enum and `runPhase_2_2_1_CongressLeadership` to
elect all nine roles with point/trait grants; add committee-service tracking.)*

#### 8.5.2 Faction leader anointing & step-down (designed, not built)

- **Step-down + anoint successor** (post 71): a sitting faction leader may **voluntarily
  step down** and anoint a same-faction successor without going through a challenge.
- **Passive auto-disqualifies** (post 341): a faction leader with the `Passive` trait
  **must be replaced** at the next 2.2.3. Replacement candidate pool can be further
  restricted by the actor's traits — e.g. post 341: "None of those with Leadership qualify
  so you can pick any Mod that has either Reformist or Business."
- **`Easily Overwhelmed` blocks party-leader ambitions** (post 78). The shipped engine has
  `Easily Overwhelmed` (`types.ts:154`) but does not gate party-leader eligibility on it.
- **Pliable faction leader auto-replacement** (post 341): a `Pliable` faction leader runs
  on a different shortlist (any matching ideology/lobby card holder, not Leadership-gated).

> **The canonical 6-criterion eligibility filter (corroborated across 3 eras).** The 1772
> solo quotes the rulebook filter **verbatim** (`1772s` posts 80-87, post 86); gilded and
> federalism corroborate its pieces. The filter is applied as a **cascade waived in reverse
> priority** — start with all six required; if no candidate qualifies, drop the lowest-priority
> criterion and retry, and so on:
>
> | Priority | Criterion (must hold) |
> |---|---|
> | 1 (highest) | personal ideology **matches a faction ideology card** |
> | 2 | **not** Incompetent / Lackey / Passive |
> | 3 | holds a matching **interest or lobby card** |
> | 4 | **not** currently on a career track |
> | 5 | has the **Leadership** trait |
> | 6 (lowest) | **not** Obscure |
>
> So the engine first seeks an ideology-matched, competent, card-matched, off-track,
> Leadership-bearing, non-Obscure candidate, and relaxes the *least* important constraints
> first when none exists. Post 341's "pick any Mod that has either Reformist or Business"
> is this cascade after several waivers.

*(designed, not built — encode the 6-criterion reverse-priority cascade on faction-leader
eligibility; add the anointing flow.)*

#### 8.5.3 Party leader incumbency fatigue (designed, not built)

A politician who has been **party leader for 5+ terms in a row** triggers `party
preference −1` against their party (post 85). Shipped engine has no consecutive-term
counter on `Faction.leaderId` / party leadership.

---

## 9. Cabinet & military appointments (2.3.x)

> **Skipped in the entire independence era** (`phases.ts:90`). Live in 1856.

### 9.1 (2.3.1) Cabinet — `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158`)

- **Seats by year** (`cabinetSeatsForYear`, `types.ts:1196`): `<1789` none; `1789–97` State /
  Treasury / War / AG; `+Navy` from 1798; `+PMG` from 1829; `+Interior` from 1849.
- **Per empty seat**: 10% **cross-party gate** (`CABINET_CROSS_PARTY_RATE`); eligible =
  out of office, `age<75`, same party (or cross-party if gate open). Score via
  `CABINET_SEAT_SCORING` (`types.ts:1221`): e.g. State `admin×2 + governing×1 +
  legislative×1`, War/Navy weight `military×2`, AG weights only `judicial×2`; `+5` if the
  candidate already holds the seat's primary expertise; cross-party picks take `−3`.
- **Grants on confirm**:
  - **Admin (F-DOUBLING)**: base `1`, doubled by **Egghead** and/or **Efficient**
    (`1/2/2/4`), clamped at 5 (`ABILITY_EARN_RULES.cabinetConfirmAdmin`, `phaseRunners.ts:2200`).
  - **Command**: `+1` for SecState only (`OFFICE_COMMAND_GRANT`, `types.ts:590`).
  - **Expertise**: per `OFFICE_EXPERTISE` (`types.ts:1137`) — State→Foreign Affairs,
    Treasury→Economics, War→Military, Navy→Naval, AG→Justice, Interior→Agriculture,
    PMG→Transportation.

### 9.2 (2.3.2) Military — `runPhase_2_3_2_Military` (`phaseRunners.ts:2246`)

Fills **General in Chief** if empty: out of office, `military ≥ 3`, highest military.
Grants Military expertise. If a war is active, grant **Command** with PR6 trait modulation
(`military_command` context, `TRAIT_GOVERNANCE_EFFECTS` `types.ts:1028`): base `+1`,
**Decisive General → +2**, **Naive Strategist → 0**; a Decisive-General Secretary of War
adds another `+1` to the GiC.

### 9.3 Forum design layer (designed, not built)

#### 9.3.1 Expanded cabinet roster

Forum 2.3.1 fills a **much wider** roster than `cabinetSeatsForYear` (post 87, 92, 100,
102, 104):

- **Domestic seats** (per build but Gilded-Age complete): SecState, Treasury, War, AG, Navy,
  PostMaster General, Interior.
- **Ministers** (per-power, all designed): UK, France, Spain, Prussia, Russia, China.
  These are filled like cabinet members and contribute to diplomacy & era-event resolution
  (post 129: "Sec of State Delano and UK Minister Clay" jointly resolve the Oregon Treaty).
- **Senior Military**: Senior General, Senior Admiral, plus general/admiral benches
  (engine has GiC; forum adds named admirals and minor flag officers).
- **Senate confirmation roll-call** per nominee (post 102 implies a roll for each appointment).
- **Cap on cross-party cabinet**: forum permits up to **3 reds in a Blue cabinet** (post 104)
  — a per-cabinet hard cap, not the per-seat 10% gate the engine uses.

> **Corroborated + the cabinet roster is era-gated (federalism + gilded).** Federalism (posts
> 5, 44, 60, 132, 454, 547, 659) confirms the wider roster — State/Treasury/War/AG/PM
> General/Navy + Ministers UK/France/Spain/Prussia/Russia + Key Advisor + Sr General/Admiral
> + Senate confirmation roll-calls — but with a **different per-era set**: the 1788 cabinet
> has **no Interior, no China minister, and no Senior Admiral** the 1868 cabinet had. So the
> minister/officer roster grows with the foreign-power roster ([§13.3.1](#1331-per-power-relations-meters--an-era-dependent-power-roster))
> and the year-gated domestic seats (`cabinetSeatsForYear`). Two GM rulings worth encoding:
> **senators refuse a *military* appointment** (general/admiral) except in a major war but
> **will accept an ambassadorship** (fed posts 71-73 — stops Congress→military stat-laundering);
> and a no-viable-PM-General candidate is an **undefined, crash-prone path** escalated to the
> dev (fed post 5 — see `game-context.md` BUG-3).
>
> **Confirmed 1856-native (`house-divided`).** The full confirmation pipeline is corroborated:
> **≥2/≥3 Admin gates**, **≤16 cumulative cabinet-years**, a **60% Senate Big-4 confirmation**
> (committee, then ~68-floor), a **5-name Majority-Leader "recovery list"** offered on a failed
> nomination, **≤1 cross-party in the Big-4 / ≤3 total**, a **status hierarchy** (an ex-SecState
> only takes State), **retain ≤5** across an administration, **−1 party-pref per uncovered
> region**, and a **minority-appointee-pre-Civil-Rights-era −1 party-pref** (avoided by
> re-appointing to the same post). A **Controversial-nominee failure = a lifetime cabinet ban +
> permanent −1 in all elections** (`hd` POST 3720, 4988–5019, 6010–6090, 7156–7174, 7982, 8060).
> The Progressive-era roster grows to **~21 posts** with offices **created in-game by law** —
> documented separately in [§24.6](#246-66-the-progressive-era-institutional-layer-offices-created-in-game-by-law).

*(designed, not built — extend `Office` enum with Minister-* offices and admiral-bench
slots, **keyed per era**; add the cross-party cap and the senators-refuse-military rule.)*

#### 9.3.2 State-status eligibility check

A nominee from a **territory** (not yet a state) cannot serve in the cabinet (post 103:
"Vance / `George Curry Law` from OR can't serve in cabinet" because OR was "not a territory
yet"). The shipped scoring picks the top-scored candidate regardless of home-state status.
*(designed, not built — gate cabinet eligibility on `State.isColony === false` for the
nominee's home state.)*

#### 9.3.3 Region-coverage election malus

> "No representation in cabinet → −1 in next pres race in those regions" (post 112).

A region with no cabinet member from any state in it deducts 1 from the controlling party's
score in that region's states in the *next* presidential general election. Couples to
`calcStateVote` as an additive context-bonus. *(designed, not built — track region-coverage
on cabinet install; apply −1 to relevant `state.id` in `presGeneral` context.)*

#### 9.3.4 Cabinet auto-sign behavior & Egghead advisory step

- **Passive + Pliable presidents auto-sign every passed bill** without exec discretion
  (post 195: "The Passive Pres Clinton will sign all the bills into law.").
- **Egghead Cabinet weigh-in** (post 126): on era events where the decider is `cabinet` or
  on multi-decider events, Egghead-trait cabinet members offer a recommendation. A
  Pliable+Passive president then defaults to the cabinet majority's recommendation
  (post 129: "The Pliable and Passive President will accept the majority opinion of his
  cabinet."). *(designed, not built — extend `EraEvent.decider` to permit a `cabinet-advisory`
  variant where Egghead members weigh in and the actual decision is the president's, modulated
  by their traits.)*

#### 9.3.5 Cabinet Admin bonus on confirmation

Confirmed cabinet members are reported to gain `+1 Admin` after confirmation (digest, post
112). The shipped engine already grants admin on cabinet confirm with trait-doubling
(`cabinetConfirmAdmin`, `phaseRunners.ts:2200`) — **forum confirmation** matches the
shipped rule.

#### 9.3.6 Modern cabinet detail (sharpens §9.3.1, §9.3.3; designed, not built)

> **NEW depth from `modern`** (posts 214-229, 587-605, 840-871, 1499-1513, 1903-1924,
> 2172-2182). The modern cabinet is the **fullest observed** (~30+ seats: 15 departments +
> CIA / FBI / UN / Fed / CJCS / NSA / Key Advisor + 8 ambassadors + the
> [§22.9](#229-military-leadership-appointment-tier-232) military tier). Cross-ref
> `game-context.md` #25, #31.

- **Retention**: **5 may be retained** each term; **CIA/FBI do not count** toward the 5.
- **Per-officer tenure rules** (concrete in modern): **CIA** removable at appointment at
  **25% − mil-prep** unless Incompetent / Easily-Overwhelmed / over-70; **FBI** has a fixed
  **10-year term** (fireable; reappoint 10% +dom-stab / 10% −honest-gov); **Fed Chair** a
  fixed multi-year term + a cabinet-service cap; **Key Advisor** locked for the half-term.
- **Confirmation**: committee then floor; **opposing-party cabinet count is capped**
  (Republicans "maxed at 3", post 379) — corroborating the batch-1 per-cabinet cap over the
  shipped per-seat 10% gate; **military is auto-confirmed** (no Senate vote, post 2176).
- **Failed-confirmation recovery** (post 379): a failed nominee is **banned from
  cabinet/cabinet-level forever** (may still try Ambassador) **+ −1 all future elections**;
  the Senate is **blamed** ⇒ Party-Pref −1 + nay-voters 20% gain Integrity/Controversial.
  **Recovery flow:** the **SML offers 5 names** for the seat → the **nominator picks one** →
  it is **auto-confirmed** (must still meet seat requirements + the opp-party cap).
- **Scoring penalties** (sharpens §9.3.3): besides the region-coverage malus, the modern
  scorer applies an **intra-party faction-equity penalty** (−500 / −1000 for not balancing
  seats across the president's *allied factions*, post 229, 1223) **and a diversity floor**
  (**≥25% women/minorities** avoids a penalty, post 604).
- **Constraints**: **Incompetent bars cabinet service** (post 843); a **general can't be made
  an admiral** (post 848, 1386); **Egghead** cabinet members advise decisions a Pliable/Passive
  president follows by **majority** (corroborates [§9.3.4](#934-cabinet-auto-sign-behavior--egghead-advisory-step));
  officers passed over for promotion may **resign** (post 1512).

*(designed, not built — add per-officer tenure/term fields; the opp-party cap; the
failed-confirmation ban + SML-5-names auto-confirm recovery; the diversity-floor and
faction-equity scoring dimensions.)*

---

## 10. Events (2.4.x)

### 10.1 (2.4.1) Deaths, retirements & decay — `runPhase_2_4_1_Deaths` (`phaseRunners.ts:2341`)

Per living politician, in order: **death roll → retire roll → ability decay → trait decay**.
Constants `MORTALITY_RULES` (`types.ts:485`), `ABILITY_LOSS_RULES.oldAge` (`:519`),
`TRAIT_LIFECYCLE_RULES.oldAge` (`:625`).

- **Death** = `clamp(bracketRate × eraDeathMult × frailMult(1.5) × crisisMgrMult(0.85), 0,
  1)`. Brackets (first match): `80+ 0.18 / 70+ 0.07 / 60+ 0.025 / else 0.005`. Era mult:
  independence `1.8`, federalism `1.6`, nationalism `1.3`, modern `1.0`.
- **Retire** = `clamp(bracketRate × eraRetireMult, 0, 1)`. Brackets `70+ 0.08 / 60+ 0.025 /
  else 0.005`. Era mult: independence `0.5` … modern `1.5` (traits don't affect retire).
- **Ability decay** (age `≥70`): `0.10` base `+ {78+ 0.03, 85+ 0.06}`; on hit, `−1` to a
  random non-zero skill or command.
- **Trait decay** (age `≥70`): `0.05` base `+ {78+ 0.02, 85+ 0.03}`; on hit, drop one trait
  from `fadingPool` (Celebrity, Charismatic, Hale, Crisis Admin, Crisis Gov, Decisive
  General) (`types.ts:634`).

Death/retire vacate office and clean up leadership/protégé chains.

### 10.2 (2.4.2) Anytime events — `runPhase_2_4_2_Anytime` (`phaseRunners.ts:2782`)

Constants `ANYTIME_EVENTS_RULES` (`types.ts:1073`). Two pools:

- **National** (`anytimeNationalEvents.ts`): fires at `0.70 × nationalFireMult`
  (era: 0.9/0.95/1.0/1.1). Weighted pick; applies meter/preference effects.
- **Personal** (`anytimeEvents.ts`): each politician at `0.05 × fireMult`
  (era 0.8/0.9/1.0/1.1), filtered by era + the politician's region. Can grant traits, bump
  skills/command (cap 5), kill, or force retire. Scandal-scaled events escalate by
  `scandalMagnitudeMult` (era 0.5/0.7/1.0/1.3): `≥1.0` tries `Corrupt`; `≥1.2` adds flip-flop.

### 10.3 (2.4.3) Era events — `runPhase_2_4_3_Era` (`phaseRunners.ts:2796`)

**The interactive heart of each scenario.** Branches by scenario:

- **1772**: a serializable **event graph** (`eraGraph.ts`, data in `eraEvents1772.ts`) —
  see [§17.5](#175-era-event-graph-1772). The walker surfaces one event/turn; auto-nodes and
  nodes the player doesn't control are AI-resolved; others return to the player.
- **1856**: **year-gated template events** (`buildEraEventsForYear`, `eraEvents1856.ts`).
  When the pending queue is empty, it builds that year's events; the first unresolved one is
  returned (`phaseRunners.ts:2810`).

**Decider** (`EraEvent.decider`, `types.ts:1473`): `president | congress | cabinet |
cc-president | auto`. AI resolution uses `pickAIResponse` (graph `aiBias` keyed by
controlling-faction personality, `eraGraph.ts:88`).

**Effect modulation (PR6).** Before applying a response, `modulateEraEventEffect` scales
meter swings by **cabinet expertise** and **president/secretary traits** for keyed events
(`dredScott1857`, `johnBrown1859`, `trent-affair`, `secession-winter`). Uses
`governance_crisis` rows of `TRAIT_GOVERNANCE_EFFECTS` and the `secessionWinterBand` table
(better outcomes with a `Crisis Gov` president and zero defections).

**Secession Winter loyalty defection.** On resolving the `secession-winter` event, each
Treasury/War/Interior/State secretary loses loyalty `= LOYALTY_REGION_BASE[region] ×
LOYALTY_IDEOLOGY_MULT[ideology]` (`types.ts:1162`, `:1170`): South `0.5` / Border `0.2` /
North `0.0`, scaled by ideology (`RW Populist 1.2 … LW Populist −0.3`). Post-decay loyalty
`< 0.4` (`LOYALTY_DEFECTION_THRESHOLD`) ⇒ the secretary resigns, vacates, and gets `Traitor`.
The defection count feeds the outcome band.

**Terminal events.** `triggersGameEnd` sets `game.gameEnded` (e.g. 1772 `lost_war`,
`dominion_autonomy`). `postEffects` fire scripted consequences (start war, unlock governors,
start the Constitutional Convention, assemble the CC, admit a state).

### 10.4 Forum design layer for era events (designed, not built)

#### 10.4.1 Multi-decider events

> **Corroborated across federalism + gilded.** Federalism adds the **implementation-roll
> layer**: a secretary may **blunder the implementation** while a high-stat president **bails
> them out** (fed posts 29, 496, 575, 702), and **Egghead/Efficient** cabinet members
> "suggest" the choice a Pliable/Passive president then accepts (fed posts 29, 65, 475, 702
> "Our eggheads … both choose A"). So a multi-decider event resolves as: advisory step
> (Egghead) → decision (president, trait-modulated) → implementation rolls per assigned office.

Forum era events can route a response through **multiple offices** working in tandem
(gilded post 129: "Oregon Treaty: To be implemented (Diff) by Pres Clinton, Sec of State
Delano and UK Minister Clay"). The shipped `EraEvent.decider` is a single role; the design
permits a list of deciders, each rolling at a different difficulty. *(designed, not built —
extend `decider` to `decider: Role | Role[]`; add an Egghead-advisory step and per-office
implementation rolls.)*

#### 10.4.2 Foreign-territory grants via era event

The Oregon Treaty post-effect granted **four territories in one event**: British Columbia,
Washington, Oregon, Idaho (post 129). Shipped `admitState` is invoked from 1772
post-effects; the design pattern is general — any era event may grant a list of states
through a single `postEffect`. *(designed, not built — extend post-effect schema with
`admitStates: StateId[]`.)*

#### 10.4.3 Census-driven EV deltas

Era events (and "anytime" national events) can stash **deferred** EV changes that fire on
the next census (e.g. post 125: "MN +1EV in the next census"; "VT −1 EV in the next
census"; "NJ +1, PA +2 EVs in the next census"). Engine has `state.electoralVotes` but
no scheduled census loop. *(designed, not built — add a `pendingEvDeltas` queue keyed by
the census year and a 2.10-or-2.9.4 hook to apply them.)*

#### 10.4.4 Era-event side-effect: state policy toggles

Some era events set **persistent state-level policy flags** (post 125):

- "TN, GA, MS, AR enact Poll Tax" → `Poll Tax` is turned on in those four states;
  +100 pts to `RW Activists, Trad`; −100 pts to `Civil Rights, LW Activists`.
- "Jim Crow Laws" event: "Governors may now enact Jim Crow Laws, including segregation.
  **These Gov actions are worth triple points for 30 years.**" (a time-bounded scoring
  multiplier the engine has no concept of).
- "KS and IA Ban Alcohol" → `Prohibition is turned on in these states`; +100 pts to
  `LW Pop, Prog, RW Pop, Theocrat`; −100 pts to `Lib, Mod, Cons`.

See [§11.4](#114-state-level-policy-flags-designed-not-built) for the data shape.

---

## 11. Governance (2.5.x)

### 11.1 (2.5.1) Lingering meters — `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260`)

The per-turn drift of the seven `NationalMeters` (`revenue, economic, military, domestic,
honest, quality, planet`; `types.ts:1399`). Layers:

1. **Cabinet skill drift** (`phaseRunners.ts:3266`): a `drift(skill)` ramp (`null −0.3, ≥4
   +0.5, ≥3 +0.2, ≥2 0, ≥1 −0.2, else −0.5`) maps Treasury→revenue/economic/quality,
   War→military, AG→domestic/honest, SoS→diplomacy. Active war adds `−0.5` to domestic;
   `planet` always `−0.05`.
2. **PR5 expertise bonus** (`:3299`): `+0.2` to a seat's meter if its occupant holds the
   matching `OFFICE_EXPERTISE`.
3. **PR6 president trait multiplier** (`:3321`): a **Delegator** president multiplies the
   expertise bonuses by `1.5`; **Micromanager** by `0.5`.
4. **Trait governance effects** (`:3345`): `lingering_phase` rows of
   `TRAIT_GOVERNANCE_EFFECTS` (`types.ts:1017`) — e.g. Crisis Admin `+SMALL` economic, Crisis
   Gov `+SMALL` domestic, Domestic Warrior `+MEDIUM` domestic, **Iron Fist split** `+SMALL
   honest / −SMALL domestic`. Bands `SMALL 2 / MEDIUM 4 / LARGE 8`.
5. **Debt tick** (`:3376`): `nationalDebt = max(0, debt − revenue × 1,500,000)`.

### 11.2 (2.5.2) Governor actions — `runPhase_2_5_2_Governors` (`phaseRunners.ts:3382`)

Each governor, `0.30` chance, nudges home-state `bias` by `(governing−1)×0.05`; **BLUE
governors push bias negative (toward BLUE), RED positive** — `bias` clamped `[−5,5]`. This
is the lever by which holding governorships steers a state's lean over time.

### 11.3 Governor's actions library (designed, not built)

Forum 2.5.2 is **interactive**: each governor picks one named action from a library, which
rolls **d100 ≤ 20·governing** for success (so a `governing 2` governor succeeds on
`d100 ≤ 40`; `governing 5` on `d100 ≤ 100`). Most actions require an additional skill,
trait, or state-status precondition. Failure usually yields no effect but in some cases
penalizes the home-state industry (post 141: "Build roads, bridges, canals Succeeds 39/80,
Agriculture industry declines by 1" — a *success* with a downside).

| Action | Effect | Prerequisite |
|---|---|---|
| Build roads, bridges, canals | +pts; sometimes Agriculture industry −1 as side-effect | — |
| Increase Maritime Industry | state's Maritime +1 | — (must be coastal) |
| Increase Manufacturing | Manufacturing +1 | — |
| Increase Agriculture | Agriculture +1 | — |
| Increase Mining | Mining +1 | — (state must support mining) |
| Increase Finance | Finance +1 | — |
| Major Irrigation Project | +pts, Agriculture +1 | **same-party Senator required** (post 140) |
| Establish State Bank | Finance +1, +pts | (econ-related skill prereq implied) |
| Gerrymander | locks state bias toward party | **Iron Fist** OR **Justice** expertise OR **Controversial** trait (post 138); no-op if already gerrymandered the same way |
| Build State University | Education-themed bonus | — (often fails — high threshold) |
| Improve best industry | top-ranked industry +1 | — (deterministic target) |
| Increase state government jobs | +pts to Reformist/Big Government factions | — |
| 2-year terms / 4-year terms for Gov | flips state Governor term length flag | — |
| Discriminate against former Secessionists | +pts to RW Activists, −pts to Civil Rights | **only if state seceded** (post 139) |
| Enact a Variety of Jim Crow Laws | turn Jim Crow ON in state; **3× points for 30 years** if Jim Crow event has fired | (likely Iron Fist/Controversial) |
| Anti-Corruption campaign | flips state bias slightly toward party; clears loyalist hold | **historically very hard** (post 149) |
| Women's Suffrage in State | turn Women's Suffrage ON; +pts to Civil Rights, Reformists | (likely Progressive/Liberal trait) |

Some actions also award **+1 Command** to the acting governor on first success (post 140:
"Gov Rousseau will gain +1 Command (his 1st!)"). *(designed, not built — add
`runPhase_2_5_2_Governors` interactive action library with d100/20·gov resolver, skill/trait
prereqs, and per-action effect schema.)*

> **Confirmed 1856-native (`house-divided`, corroborated across ~5 eras now).** Same resolver:
> **# actions = Gov level (Efficient +1)**, **d100 vs 20×Gov**, **skill-match doubles** the
> success chance, **5-Gov autopass**, **10% +1 Command on success**, and a national-meter-impact
> action triggers a **lose-Obscure / +Command** roll. The 1856 arc adds the late-game menu items:
> **Activate State Primaries** ([§24.3](#243-63-primary-era--state-opt-in-primaries--presidential-primary-groups-15)),
> the Deep-South voter-suppression set (**Jim Crow / Literacy / Disenfranchise / Poll Tax**, ×2
> in the Deep South), **Women's Suffrage**, Praise/Criticize President, and Challenge-law-to-
> SCOTUS. **Gov incumbency decay** sets in after **8/12 yrs**. The "+1 Command except on autopass
> actions" reword is retroactive (`hd` POST 2936–2945, 3134, 3338–3354, 4179–4195, 5477–5505,
> 6119–6153, 6997). Govs are **designer-acknowledged underpowered** (DH-13-adjacent;
> `game-context.md`).

### 11.4 State-level policy flags (designed, not built)

Forum tracks **persistent state-level policy switches** (post 125), separate from
`State.industries` and `State.bias`. Toggleable both by era events and by governor
actions. Observed in this thread: `Poll Tax`, `Jim Crow`, `Prohibition`, `Women's
Suffrage`, `Segregation`.

Data shape (designed):

```ts
// designed
type StatePolicyId = 'pollTax' | 'jimCrow' | 'prohibition' | 'womenSuffrage' | 'segregation';
interface StatePolicy {
  active: boolean;
  // For time-bounded multipliers (e.g. Jim Crow gov actions score 3x for 30 years)
  scoreMultiplier?: number;
  // The year the multiplier *ends*; null = permanent
  multiplierUntilYear?: number | null;
}
interface State {
  policies?: Partial<Record<StatePolicyId, StatePolicy>>;
}
```

- A policy flag persists across turns until repealed by a bill or a re-toggle action.
- Some flags grant per-turn enthusiasm shifts (post 125: Poll Tax flips Cons enthusiasm
  one step toward Blue).
- Time-bounded multipliers couple to `runPhase_2_5_2_Governors` scoring: Jim Crow gov
  actions are `×3` points for 30 years following the Jim Crow era event.

> **Modern sharpening (designed, not built; `game-context.md` #20, #21).** The `modern`
> thread confirms two **persistent state fields** beyond `State.bias`/`State.industries`:
> a partisan **Bias integer** rendered as `Red+3` / `Tossup` / `Blue+5`, shifted by events
> and **reset at each census** (modern#post 613, 2222 "State Bias +1 toward RW-Pop party");
> and an **ideological "loyalist fill"** that **gates governor-action success** — a governor
> *fails* an action when the state is packed with opposing-ideology loyalists (post 25-26
> Barrasso fails; 2245 a non-Mod governor fails an industry action), and an **Anti-Corruption**
> action can clear a Political Machine. It also adds modern governor actions — **Set Primaries
> WTA**, **State Primary Placement (Group N)** (which primary group a state votes in,
> [§22.3](#223-presidential-primary-subsystem-291)), **Split Electoral Votes**, **Fill State
> Offices with Loyalists**, **Use Office to Praise Incumbent President** (gives a reelection
> bonus) — and a hard gate: **all voter-suppression actions** (Purge Rolls / Strict Voter ID /
> Decrease Polling Stations / Literacy Test) are **blocked while Honest-Gov't is maxed**
> (post 1962), the same top-of-ladder rule that deactivates Machines/Gerrymandering
> ([§22.1](#221-the-named-meter-bank--numeric-debt--crisiscascade)). The modern industry set is
> **Agriculture / Alt Energy / Maritime / Mining / Finance / Manufacturing / High Tech /
> Natural Gas**, and industry leadership shifts **per-region** via era events ("Manufacturing
> −2 in the Midwest", post 1224).

### 11.5 Industry leadership scoring (designed, not built)

A per-half-term scoreboard ranks each state's `industries` and awards points to the
**Gov/Sen/Reps from the state leading in that industry** (post 133):

| Industry | Leading state (1868) | Award |
|---|---|---|
| Maritime | ME | ~200 pts to its delegation |
| Finance | NY, PA | ~200 pts |
| Manufacturing | RI | ~200 pts |
| Agriculture | TN | ~200 pts |
| Mining | WV | ~200 pts |

Couples to the scoring leaderboard (`Faction` totals). *(designed, not built — add
end-of-half-term industry-leadership tally tied to `State.industries`.)*

### 11.6 (2.5.3) Supreme Court — `runPhase_2_5_3_Court` (`phaseRunners.ts:3397`)

**Skipped until the Constitution.** `0.50` chance per turn the court "rules": count
conservative vs liberal justices; a conservative majority shifts `partyPreference −0.1`
(toward RED), liberal `+0.1` (toward BLUE), clamped `[−5,5]`.

---

## 12. Legislation (2.6.x)

> 1772 routes all three sub-phases to the **Continental Congress** (see [§17.1](#171-continental-congress)). The description below is the 1856 path.

### 12.1 (2.6.1) Proposals — `runPhase_2_6_1_Proposals` (`phaseRunners.ts:3431`)

Each faction with a member of `legislative ≥ 1` has a **`0.60`** chance to propose a bill;
the highest-legislative member sponsors a random `BILL_TEMPLATES` entry (`phaseRunners.ts:3420`).
Bill carries a `committee`, `effects`, status `proposed`.

### 12.2 (2.6.2) Committee review — `runPhase_2_6_2_Committee` (`phaseRunners.ts:3463`)

The committee chair decides: `passChance = clamp((sameParty? 0.85 : 0.25) +
cardVoteBias(chairFaction, bill.interestGroups), 0, 1)`. Pass → `passed_committee`, else
`killed_committee`. Missing chair → auto-pass. `cardVoteBias` (`phaseRunners.ts:1516`) adds
`ALIGNMENT_RULES.cardBiasPerDelta (0.03) × delta` per matching interest/lobby card.

### 12.3 (2.6.3) Floor votes — `runPhase_2_6_3_Floor` (`phaseRunners.ts:3498`)

Tally House and Senate **separately**. Per member, yes-probability:

```
p = sameFaction ? 0.92 : sameParty ? 0.60 : 0.15
p -= 0.05 × |ideologyDistance(member, sponsor)|
p += sponsorFloorBias (0.05) if sponsor is the member's faction leader
p += cardVoteBias(memberFaction, bill.interestGroups)
p  = clamp(p, 0, 1);  yes iff chance(p)
```

A bill **passes only with a strict majority in *both* chambers** (`phaseRunners.ts:3562`).
On passage, `applyEffect` mutates state with the clamps from [§1](#1-core-model--invariants);
if the bill improves any meter, the sponsor may gain `+1 command`. `startWar` effects create
a `War` and push it onto `game.wars`.

> **CPU-confirmed canonical voting heuristic (`drums` batch 5).** The all-CPU run finally
> dumps the canonical NAY/AYE/NAY ladder used by every faction's senators/reps when scoring a
> bill (`drums` POST 2161, multi-confirmed across POSTS 2524, 2710, 2832-2879, 3122-3132,
> 3508-3527, 3924-3940, 4267-4280, 4396-4416):
> 1. Bill helps an **opposition president**'s meters/election? → **NAY**.
> 2. Bill gives points to **my ideology/lobbies**? → **AYE**.
> 3. Otherwise → **NAY by default**.
>
> Plus: proposers = each faction's **highest-Legis** pol (Efficient adds +1 proposal; Legis-5 +
> Efficient gets extras); **SecTreas and SecWar each get 1 free bill** per session a
> congressional proposer can pick up as a free extra (POSTS 2523, 3086); a faction **CANNOT
> propose a bill that costs points to one of its own cards** (mid-stream GM rule, POSTS
> 2530-2531, 2851); **proposal validity must check active amendments** (a "Apply Civil Rights
> to Former Slaves" auto-proposed after the 14A made it invalid, POST 2006); **veto override
> = 2/3 in BOTH chambers** (designer ruling — 60% was a bug, reverted, POSTS 2180-2187);
> **amendments can't be packaged with bills** (POST 1835); **±3 cap on per-phase ideology
> swings** (POST 4574 — Mods swung +7 raw, capped at +3, designer ruling).

### 12.4 Forum design layer: committee block-and-replace (designed, not built)

> **Confirmed 1856-native (`house-divided`) — the whole pipeline (§12.4–§12.8).** The full
> legislative loop is corroborated across the 1856→1904 arc: proposers → **committee block/replace**
> (chair Legislative > proposer's **AND** proposer lacks Efficient) → committee vote → **package**
> (amendments stand alone) → floor → **Shenanigans** (Debater/Orator/Magician/Puritan flips) →
> **filibuster** (Disharmonious can filibuster twice; carries to the next session, re-passes both
> chambers; **no Cloture until the Cloture bill passes**, ⅔) → sign/veto (override ⅔) → points +
> enthusiasm resolution. **Crisis bills** carry failure penalties (a majority-fail blames the
> Speaker); **"a faction cannot propose a bill that hurts its own faction"** (even when free);
> **procedure bills skip presidential assent**; and cabinet **free department proposals** lose
> **−50/−100** if unused (`hd` POST 3492–3524, 5123–5177, 6179–6211, 8166–8167). Reconstruction
> readmission and amnesty are themselves bills through this pipeline ([§23.4](#234-57-reconstruction-readmission-subsystem-end-nationalism--gilded)).

The forum routes 2.6.2 through an interactive **committee chair veto** step (posts
160-163):

- For each bill that survives proposal, the committee chair (and their player) may
  **block** it. On a block, the chair must **replace** it with a different bill — but **the
  replacement must come from the same committee's domain** (post 163: "We can block the
  literacy bill but you chair the judiciary committee so the replacement would also need to
  be from that committee").
- A chair who declines to block lets the bill flow to 2.6.3 unchanged.
- Engine 2.6.2 currently rolls a chair-driven `passChance`; the forum's pattern is
  **deterministic veto + replace**, gated by chair-committee domain.
*(designed, not built — extend 2.6.2 to surface a "block / replace from {committee
domain bills}" UI to the chair's player; engine should still resolve probabilistically for
CPU chairs.)*

### 12.5 Forum design layer: bill packaging (designed, not built)

Posts 176-179 introduce **bill packaging**: between 2.6.2 and 2.6.3, a chair may bundle
*multiple committee bills* into a single floor vote (`S1 (Packaged)`,
`H.R.1 (Packaged)`, `H.R.2 (Packaged)`). The package votes as one:

- If the package passes, **every bill in it** is enacted simultaneously, in declared order.
- If the package fails, every bill in it is killed.
- Engine `Bill` carries `votes: { house, senate }`; the packaged-bill shape is
  effectively a meta-bill whose `effects` are the *union* of its members'.

> **Corroborated across federalism + 1772 solo.** Federalism (posts 160, 213, 564-565)
> shows named bundles voted as one ("BUNDLE 1: Bureau of Indian Affairs AND Smithsonian")
> and adds a **bundling-eligibility rule**: a chair **won't bundle** a bill that is
> **net-negative for the chair's faction** — *unless* it is a **statehood bill** (fed post
> 565). The 1772 solo gives the **CPU heuristic**: a CPU chair bundles **~75%** of the time
> unless the reason is hostile/random, with **Crisis** as an added bundling reason (`1772s`
> posts 18, 46, 57).

*(designed, not built — add `Bill.packageOf?: BillId[]`, a chair-side bundling action, and a
CPU bundling-eligibility heuristic: bundle if net-positive or a statehood bill; ~75% baseline.)*

### 12.6 Forum design layer: filibuster (designed, not built)

> **Corroborated across federalism + gilded** — and **federalism sharpens it**: the
> filibuster is not an always-available action but a **standing rule toggled ON by a law**.

Between the House vote and the Senate vote (gilded posts 189-194; fed posts 159, 566, 725,
730), **each faction with a Senate-floor presence** may filibuster one bill/package:

- **Unlocked by legislation.** "Institute Filibuster" is itself a bill, passed in 1792
  (fed post 159). Before it passes, **no filibuster exists**. After it passes, the
  filibuster is a per-bill action available to an eligible senator.
- **Trait-gated actor.** An eligible senator must hold the right trait/personality —
  fed post 730: "FILIBUSTERED … BECAUSE RED 1 IS LED BY A PURITAN" (a Puritan senator
  filibusters).
- **One attempt per faction per session.**
- **Filibustered bills persist, not just die.** Federalism clarifies a filibustered bill
  **returns next term** and **can be re-filibustered** (fed posts 566, 725) — sharper than
  the gilded reading where "S.2 … Filibustered" simply went un-tallied (gilded post 194).
- Engine has no concept; floor vote runs House then Senate with no inter-chamber hook.

*(designed, not built — add (a) an `Institute Filibuster` law that sets
`game.filibusterEnabled`, (b) a 2.6.2.5 hook between House and Senate tallies for a
per-faction, trait-gated filibuster action, and (c) persistence so filibustered bills
re-queue next session.)*

> **CPU-confirmed deterministic per-Senator (`drums` batch 5).** The all-CPU run dumps the
> filibuster as **deterministic per-Senator-trait** rather than a per-faction roll:
> **Puritan senators auto-filibuster 1 bill/session** — **no roll**, deterministic given trait
> (`drums` POSTS 48, 140, 2716, 2871, 3115, 3273, 4610, 4751, 5103-5105). Specific named
> filibusterers (Yulee, Morgan, Dorr in Reconstruction; Cockrell, Simmons, Sweet in Gilded —
> Puritan-driven). **Cloture needs 67%** (POSTS 5105, 5496, 5921 — Wartime Income Tax fails
> 52-48; Children's Bureau succeeds 77-23). **Iron-Fist CPU Maj Leader auto-cloture** for
> majority-supported items (POST 5920). **CPUs filibuster crisis legis they ideologically
> oppose to extend the crisis to election day** (POST 7081). Open: can a package be
> re-filibustered? (POST 3275: *"The rules actually don't say tbh."*)

### 12.7 Forum design layer: `*Crisis Bill*` tag (designed, not built)

Active *crises* are persistent national pressures (the digest cites: Economic, Corruption /
"Honest Gov't", Domestic, Anti-Naturalization, Anti-Native, Anti-Chinese). Bills that
attempt to **resolve** an active crisis are stamped `*Crisis Bill*` by the GM (posts 160,
164, 167, 176). Observed examples:

| Crisis | Crisis Bill |
|---|---|
| Anti-Native (domestic) | "Relocate native tribes in Minnesota to open up more of the state to White settlers" |
| Anti-Naturalization | "14-Year Residency Period of Naturalization" |
| Anti-Native (domestic, alt) | "Create Free Rural Delivery mail service" (post 160) |

On passage, the crisis-bill resolves the crisis (per the digest: Pres Clinton "solved the
Economic and Corruption crises"). Effects scale: a Crisis Bill scores **+150 pts** vs a
regular bill's +50 (post 196 shows three regular bills + the Crisis Bill totaling
150-points-per-faction-card hits).

> **Corroborated across federalism + gilded — and federalism adds two load-bearing
> facts:** (1) **crisis bills bypass the spending cap** ("crisis can pass with spending
> freely", fed post 159 — see [§21.6](#216-bill-typing--budget-gated-spending-cap)); and
> (2) the nation is in **named national-crisis states** entered/exited by **meter movement**,
> which crisis bills/actions resolve (fed posts 39, 166, 372 "out of the corruption crisis",
> 477, 480). The federalism **crisis taxonomy** is **Budget, Economy, Domestic Stability,
> Honest Government** — a subset of the gilded list (which adds Anti-Naturalization /
> Anti-Native / Anti-Chinese), so the **crisis set is era-dependent**.

> **Confirmed across 3 eras — and `modern` adds collective accountability.** The modern
> thread re-derives the `*Crisis Bill*` tag (now an **independent** tag from `**Spending
> Bill**` — a bill can be both, modern#post 46), crisis-resolution semantics, and the
> spending-cap bypass. It adds a **collective-accountability Party-Preference penalty**: if a
> chamber lets **most of its crisis bills die**, the chamber's controlling party takes a
> Party-Pref hit (or the blame lands on the President, unless a **Charismatic** president
> deflects it) (modern#post 943, 2015 — see `game-context.md` #11). The crisis ladders here
> are the named meters of [§22.1](#221-the-named-meter-bank--numeric-debt--crisiscascade).

*(designed, not built — introduce `game.activeCrises: CrisisId[]` entered/exited by meter
thresholds, plus `Bill.resolvesCrisis?: CrisisId`; on passage of a crisis bill, pop the
crisis off, **skip the spending-cap gate**, apply a stronger scoring multiplier, and apply a
collective-accountability Party-Pref penalty when a chamber lets most crisis bills lapse.)*

### 12.9 Forum design layer: Executive-Branch-Interference & bill-relationship graph (modern; designed, not built)

> **NEW from `modern` (designed, not built; under-designed on the forum).** Two modern
> legislative subsystems with no shipped analog. Cross-reference `game-context.md` #12b, #42.

- **Executive Branch Interference / cabinet-proposed bills** (modern#post 32, 1281, 1982,
  2038): in addition to per-faction Senate/House proposer slots, a **cabinet secretary** may
  propose **department-related legislation**, gated on **Admin 4-5** (or **Crisis-Admin**
  while a relevant in-department crisis is active) and **subject to presidential assent**.
  A passed bill that **creates a new cabinet department spawns a new Cabinet Sec** (modern
  Dept of Manufacturing → seat created and filled, posts 2038, 2182). This corroborates the
  batch-2 1772/`fed` Treasurer "free-pickup" variant ([§21.6](#216-bill-typing--budget-gated-spending-cap))
  across a third era. **The forum rules were thin/blank and worked out in play** — flagged
  under-designed.
- **Bill-relationship graph** (modern#post 284, 2265-2268): bills carry **replace/repeal
  constraints** — `Not repealable`, "can only be replaced by X" (a minimum-wage bill tied to
  inflation can be replaced **only** by a Living-Wage bill, post 284), and a
  **constitutional-amendment tier** whose bills are **removable only via amendment**
  (REPEAL Protect-Gay-Marriage required an amendment, posts 2265-2268). Some passed policies
  are **downgrade-only**. There is also a **change-cooldown**: "can't propose what we just
  repealed unless a chamber changed" (post 646).
- **Modern floor scale + signing rules**: floor votes run at **House 572-601 / Senate 106**
  (53 states, [§22.10](#2210-53-state-alt-roster--modern-apportionment)); **veto override
  needs 2/3** (a Soft-Drink-Tax override failed 326-276, post 942); a **Harmonious president
  auto-signs all bipartisan-supported bills** (post 1618 — corroborates the batch-1
  Passive+Pliable auto-sign, [§9.3.4](#934-cabinet-auto-sign-behavior--egghead-advisory-step)).
- **Scoring** corroborates [§12.8](#128-forum-design-layer-bill-scoring-sums-all-faction-cards-design-divergence)
  across a fourth era: **failed bills also score** (reverse effects + meter moves) and
  scoring awards **±1 to specific named pols' reelection**, then triggers the 4-part
  enthusiasm reshuffle ([§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy))
  (post 95, 316, 1373, 2038).

*(designed, not built — add a cabinet-seeded proposal slot gated on Admin/crisis +
presidential assent + new-dept→new-seat hook; a `Bill` replace/repeal-constraint graph with
an amendment-tier; per-pol reelection deltas in the scorer.)*

### 12.8 Forum design layer: bill scoring sums ALL faction cards (design divergence)

Forum bill scoring iterates **every ideology card + interest card + lobby card** the
faction holds, summing the deltas (post 237: "with legislation you score all their cards
not just the leaders ideology"). Worked example, post 235:

```
Faction Vicx (Liberal/Progressive heavy)
  Bill: "Create Land Grant to Build Colleges in rural west"
    +50 each on Prog, LW Activists, Public Ed   → +150
  Bill: "Peacetime Military Draft"
    -100 each on LW Pop, Prog, Pacifist          → -300
  Bill: "Set average tariff to 36%"
    +250 (Reformist)                              → +250
  Bill: "Make Polygamy a Felony"
    -100 (Prog)                                   → -100
  Total platform score: +0
```

Each card-hit appears to be a fixed `±50 / ±100 / ±150` per card per bill, layered by:

- card weight (interest/lobby cards typically ±50; ideology cards typically ±100; Crisis
  Bill resolutions ±150)
- card-alignment with the bill effect

The **shipped engine** instead computes a single `factionCenter` (one ideology index, post
PR7 expertise-biased; see [§7.2](#72-factioncenter--the-ideological-barycenter-phaserunnerts704))
and uses it in `cardVoteBias` (`phaseRunners.ts:1516`) — which **does** sum interest +
lobby cards, but each contribution is `cardBiasPerDelta (0.03) × effect.delta`, not a
±50/100/150 per-card-hit score. And the engine has no scoring leaderboard for legislation
at all.

**Design divergence** — the forum scoreboard tracks every card hit per faction per bill,
not just the leader's ideology, and the per-hit magnitudes are an order of magnitude
larger than the shipped vote-bias scaling. This is one of the biggest gaps; clarified by
the GM as the rule (post 237). *(needs roadmap-planner attention.)*

> **Corroborated across gilded + 1772 solo.** The 1772 solo re-derives the same rule from
> the rulebook (`1772s` C3, posts 27, 29, 42, 44): **every ideology/interest/lobby card a
> faction holds scores independently**, so a faction holding opposite-side cards **nets toward
> 0**. It adds the **staged tabulation method**: *tabulate each card first, then sum per
> faction* (the player had been under-counting multi-card factions). Same author ruling in
> both threads → high confidence this is the canonical scorer.

---

## 13. Foreign affairs & war (2.7.x)

### 13.1 (2.7.1) Diplomacy — `runPhase_2_7_1_Diplomacy` (`phaseRunners.ts:3585`)

Each nation in `game.diplomacy`: `0.20` chance to drift `±0.5` (50/50 sign), clamp `[−5,5]`.

### 13.2 (2.7.2) Military action — `runPhase_2_7_2_Military` (`phaseRunners.ts:3593`)

- **1772 (Revolutionary War active)**: delegates entirely to `runRevWarBattles` (see
  [§17.4](#174-revolutionary-war)).
- **Generic wars (1856+)**: per active war, `milPower = meters.military +
  GiC.military`, `enemyPower = 1 + rand×4`; win iff `milPower×10 + d100 > enemyPower×10 +
  50`. War score `±10/−5`; war ends at `±50` (`phaseRunners.ts:3615`).

### 13.3 Forum design layer (designed, not built)

#### 13.3.1 Per-power relations meters — an era-dependent power roster

> **Confirmed era-dependent across federalism + gilded.** This is now a confident rule:
> the **roster of tracked powers changes per era**.
>
> | Era | Powers (count) | Source |
> |---|---|---|
> | **Federalism (1788)** | UK, France, Spain, Prussia, Russia — **5, no China** | fed posts 32, 75, 88, 296, 479, 711 |
> | **Gilded (1868)** | UK, France, Spain, Prussia, Russia, **China — 6** | gilded post 132 |
>
> Renames track real history: **Prussia → Germany** post-1871; **China → ROC** post-1911.
> ("Germany" appears once as a slip for Prussia in fed post 75.)

Forum tracks **separate relation meters** per major foreign power. Each runs on the same
`[−5,+5]` band with descriptors (`Friendly`, `Neutral`, `Hostile`, `Maxed`); 1772 confirms
**UK Relations** specifically as a named ordinal meter (`1772s` B8). Engine has
`game.diplomacy` indexed by nation key, but the seed list is fixed, not era-keyed.
*(designed, not built — extend `diplomacy` to a per-era seed set (5 in federalism, 6 in
gilded) with renaming/merging hooks across era transitions.)*

#### 13.3.2 Three diplomacy actions library

2.7.1 in the forum runs as **player-driven** actions (post 198), each available once per
power per half-term:

| Action | Effect | Precondition |
|---|---|---|
| Increase Relations | Success: relations +1; Failure: −1 | — |
| Increase Trade Relations | Success: roll 5-6 → revenue/budget +1; Failure: roll 1-2 → revenue/budget −1 | Relations must be **neutral or better** |
| Extend Credit | 10% → relations +1; 10% → econ stab +1 | Revenue/Budget must be **balanced or under budget** AND relations must be **neutral or better** |

Engine 2.7.1 currently drifts each meter passively at `0.20` `±0.5`; the design surface
is far richer. *(designed, not built — add an interactive diplomacy actions library
hooked into the Minister-* cabinet seats.)*

#### 13.3.3 National surplus integer

Forum tracks a *separate* integer **national surplus** distinct from the
`NationalMeters.revenue` 7-step band (post 200: "Our national surplus is now at +16").
The integer accumulates from Treasury operations, trade extensions, and bill effects;
revenue and surplus drift independently. *(designed, not built — add
`game.nationalSurplus: number` distinct from `game.meters.revenue`, with bill/exec-action
hooks that tick it.)*

---

## 14. Executive & court management (2.8.x)

> **Skipped in the entire independence era.**

- **(2.8.1) Executive actions** — `runPhase_2_8_1_Executive` (`phaseRunners.ts:3632`):
  `0.50` chance the President takes one of four hardcoded acts (small meter/diplomacy
  nudges of `±0.3`/`±0.5`).
- **(2.8.2) Court management** — `runPhase_2_8_2_CourtMgmt` (`phaseRunners.ts:3648`):
  justices `age ≥ 75` retire at `0.15`; vacancies filled by the highest-`judicial`
  same-party candidate with `judicial ≥ 2`.

### 14.1 Forum design layer: Executive Actions library (designed, not built)

Forum 2.8.1 runs as a **player-driven library** with persistence:

- **Action budget**: a sitting president takes **up to N executive actions per half-term**
  (post 201: "Pres Clinton can take up to 4 actions"). Number depends on traits — base 4
  modulated by `Easily Overwhelmed` (rolls 50/50 to hand off to VP).
- **`Easily Overwhelmed` hand-off**: a president with `Easily Overwhelmed` rolls d100 vs
  `50` to determine if the actions pass to the VP this half-term (post 201: "rolls 77/50
  to **not** hand off").
- **Persistence** (post 201, 33): "actions shaded **green** are active (and in some cases
  can be deactivated as an action), **yellow** shaded actions are active but will auto
  deactivate once certain conditions are met (like a new administration takes office)."
  Engine `runPhase_2_8_1_Executive` is fire-and-forget; nothing persists in state.

**Observed actions** (a partial library, post 202-203):

| Action | Effect | Roll |
|---|---|---|
| Swing around the circle | controversial speaking tour; no effect on neutral | `d100`: 1-30 success, 31-50 failure, 51-100 no effect |
| Establish Bureau of Labor | +100 pts to Gov/Sens of state leading Manufacturing; +50 pts to `Labor Unions`; −50 pts to `RW Activists` | deterministic |
| Pro-military budget increase policy | +50 pts to Lib/Mod/Cons + `Mil-Ind`; −50 pts to LW Pop/Prog/RW Pop + `Pacifists`; Mod enthusiasm +1; Lib enthusiasm −1 | deterministic |

The full library is broader (the GM references a sheet not visible in this thread).

*(designed, not built — add `game.activeExecutiveActions: ActiveAction[]` persistent state,
an action library with per-action effects + activation/deactivation rules, and an action
budget gated on president traits.)*

### 14.2 Forum design layer: Constitutional Amendments durable state (designed, not built)

Some shipped bill effects modify governance abstractly (national meters / interest groups);
the forum runs a parallel **Constitutional Amendments** durable state that bills can
pass/repeal:

- **Six-Year Term Presidency Amendment** (post 176: `REPEAL Six-Year Term Presidency
  Amendment (Sen Bennett) Passes 9-8`) — an amendment that **changed presidential term
  length to 6 years**, since repealed.
- **VP-vacancy fill amendment** (posts 276-277): "We passed the amendment to fill VP
  vacancies" — president may nominate a VP if the VP slot is empty.
- Other observed amendments: 3/4 majority of states for amendment ratification
  (post 251).

Each amendment is a **persistent boolean / numeric flag** on `game.amendments`, settable
by passage of a matching bill, repealable by another bill. Couples to election phases
(2.9.x) and succession logic.

*(designed, not built — add `game.amendments: { id: AmendmentId; passedYear: number;
data?: unknown }[]`; amendment effects checked at the right phase boundaries.)*

---

## 15. Elections (2.9.x) and `calcStateVote`

> Presidential phases (2.9.1–2.9.4) and governor races (2.9.5) need a presidential year and
> are **skipped in independence**; congressional (2.9.6) runs every election year — and in
> 1772 is replaced by the First-CC builder.

### 15.1 `calcStateVote` — the core resolver (`phaseRunners.ts:3685`)

Every popular-vote race routes through this. For state `s`, candidates, and an
`ElectionContext` (`types.ts:697`: `presGeneral | presPrimary | house | senatePre17 |
governor | internalParty`):

```
totalVotes = 100_000 + electoralVotes × 5_000
per candidate c (partyId = c.partyId):
  enthusiasm = game.enthusiasm[c.ideology][partyId]            // [-5,5]
  baseLean   = partyId==='BLUE' ? -state.bias : state.bias
  partyPref  = partyId==='BLUE' ? -game.partyPreference : game.partyPreference
  factionBias = electionFactionBias(c.factionId, c.id)          // card-driven, capped ±3
  traitBonus  = applyTraitElectionBonus(c, ctx, {era, opponentTraits}).totalBonus

  score = 50 + baseLean×5 + partyPref×5 + enthusiasm×2 + pvCache×0.1
            + factionBias + traitBonus + (Math.random()-0.5)×8     // ±4 noise
  score = max(1, score)

pct  = score / Σscore × 100
votes = round(score / Σscore × totalVotes)
```

> **Note:** the `±4` noise is the one engine RNG that uses `Math.random` rather than the seeded
> RNG (`phaseRunners.ts:3711`).

**Component weights** (per point): state bias ×5, party preference ×5, enthusiasm ×2, PV
×0.1, plus trait + faction-card terms. So a strong-PV candidate (PV 80 → +8) is roughly worth
a `+1.6` swing in state bias; **traits and ideology/enthusiasm dominate the close races.**

**`electionFactionBias`** (`phaseRunners.ts:1539`): sum the faction's interest-card +
lobby-proxy interest-group scores, `× electionBiasPerScore 0.5`, clamp to `±electionBiasCap
3`; a faction-leader candidate (non-independence era) multiplies by `electionOnBallotMul
1.1`.

**`applyTraitElectionBonus`** (`electionEffects.ts:16`): sums matching `TRAIT_ELECTION_EFFECTS`
rows (`types.ts:738`) for the context, era, and held traits; **opponent-conditional** rows
swap to a bumped magnitude when any opponent holds a listed trait. Bands `SMALL 2 / MEDIUM 4
/ LARGE 8`. Examples: Charismatic `+MEDIUM` presGeneral; Integrity `+SMALL`, bumped `+MEDIUM`
vs a tainted opponent; Unlikable `−MEDIUM`, bumped `−LARGE` vs a Charismatic opponent; Outsider
`+SMALL` general but `−MEDIUM` primary; Domestic Apathy and several PR4b traits are **era-scaled**.

### 15.2 The election phases

| Phase | Function | Mechanics |
|---|---|---|
| 2.9.1 Primaries | `runPhase_2_9_1_Primaries` (`:3725`) | Per party, eligible = alive, age 35–80, `command≥2`. Score `= pvCache + command×5 + applyTraitElectionBonus(..., 'presPrimary')`; top wins. |
| 2.9.2 Conventions | (`engine.ts:69`) | Logs ratification of the primary winners (no extra math). |
| 2.9.3 Third party | (`engine.ts:70`) | **No-op** — always logs "no third-party challenge." |
| 2.9.4 Presidential general | `runPhase_2_9_4_PresidentialGeneral` (`:3752`) | `calcStateVote(..., 'presGeneral')` per state; **state winner = higher pct takes all its EV**; national winner = more EV. Swears in winner, **resets the entire cabinet to empty**. |
| 2.9.5 Governors | `runPhase_2_9_5_Governors` (`:3816`) | Per state, `0.40` a race occurs; top-PV nominee per party; `calcStateVote(..., 'governor')`. |
| 2.9.6 Congress | `runPhase_2_9_6_Congressional` (`:3875`) | **1772**: swap to the First-CC builder (below). **1856**: Senate class up = `((year−1856)/2)%3 + 1` (1/3 rotate); all House seats; `calcStateVote('senatePre17')` / `('house')`, top-PV nominee per party, age floors 30 (Senate) / 25 (House). |

### 15.3 Convention machinery (2.9.2) — full forum design (designed, not built)

The build's 2.9.2 is one line: "log ratification." The forum runs a multi-step convention
**every** presidential cycle (gilded posts 211, 220-267). The full subsystem:

> **Corroborated across federalism + gilded (very high confidence).** Federalism ran a full
> multi-ballot convention at **every** cycle 1792→1808 (posts 90, 231-247, 394-417, 580-606,
> 714-727), confirming delegate counts per state, major/minor/favorite-son candidate types,
> nominator-speech d6→momentum, separate keynote roll, drop-out-and-endorse, presidential
> cabinet-seat promises (and that they are **rejectable by a stubborn AI**, posts 397-399),
> and that conventions routinely go **4–7 ballots** to 50%+1. Federalism adds **two new rules**:
> - **Convention-host advantage.** The faction that **sets the delegate categories** is
>   favored — fed post 398: "the convention was rigged in my favor as I set the delegates"
>   (the host is chosen by a governor / faction leader of the host state, posts 202, 481, 714).
> - **Party leader overrules the nominee's VP pick.** Fed post 401: the **party leader's VP
>   choice beats the nominee's** (the shipped model has the nominee pick VP unchallenged).
>
> **And `modern` corroborates across a fourth era + supplies the literal delegate engine.**
> The modern thread runs the same convention (Running Mate offer, VP-impact checklist, 5-plank
> platform with delegation, keynote, drop-out-and-endorse, rejectable Presidential Promise) at
> every presidential cycle 2008/2012/2016 (posts 367-398, 1028-1044, 1705-1724). It adds:
> **replacing a *sitting* VP needs a roll + a "rash/desperate" penalty roll** (post 1721); an
> **Iron-Fist nominee cannot delegate the platform** (post 371); a **failed-platform penalty**
> at the *next* general if the incumbent completed **<50% of his prior-term planks** (post 1728,
> 25% party-wide enthusiasm + party-pref drop). Crucially, the modern thread dumps the **actual
> CPU delegate-apportionment engine** to console (post 2240) — documented separately in
> [§22.6](#226-the-cpu-delegate-engine-convention--primary-apportionment): **53 states ⇒ 1,300
> delegates, majority 651**, delegates ≈ **EV × per-state category multiplier**. (The batch-1
> "447 needed to win" was a smaller-roster instance of the same `total/2 + 1` rule.)
>
> **Confirmed 1856-native (`house-divided`, 5th era to corroborate).** Same full ballot loop with
> **Momentum** (carries across cycles; drop-outs transfer it), **Command = # inter-ballot
> actions**, candidate tiers (Major/Minor/Favorite-Son), nominator/keynote d6, **rejectable
> Presidential Promises**, host-Governor delegate setup, VP-pick + PL override. The 1856 detail
> that sharpens this: **R/D thresholds are asymmetric** — **Dems 3/4 vs GOP 2/3 → ½+1** — and are
> **mutable and persistent across conventions** (an **Iron-Fist PL can unilaterally lower the
> GOP threshold**, DH-7); the platform is **5 planks** with **3-test scoring**, planks-passed-as-
> law scoring **×3**; and the **Presidential-promise DIRECTION** is fixed **offer-DOWN /
> request-UP only** (`hd` POST 3261, 3262, 3268, 3893, 3922–3924, 4646–4726, 5594–5713, 6917,
> 8247). Host-Governor delegate grouping is flagged **exploitable corruption** (DH-12-adjacent;
> `game-context.md`).
>
> **CPU-confirmed across 5 maps + 11-ballot deadlocks (`drums`, batch 5).** All-CPU run finally
> dumps the **convention CPU**'s machinery: the **per-ballot momentum** + **inter-ballot menu**
> (Stifle Competition ~90 floor, Appeal to Credibility/Integrity/Charisma, Whip Party,
> rejectable Presidential Promise, Kingmaker Interference, Smoke-Filled Rooms, Will of the People,
> ≥-ballot-5 Rules Change via **weighted-kingmaker vote**), the **compromise at ballot 10**
> (rigid highest→lowest faction-points picker with **no cross-faction coordination**, POST 7229),
> the **dark horse at ballot 25** (PL picks from lowest-scoring faction → auto-nominated), and
> the **broken auto-drop-out** that produces **10-13 ballot deadlocks** (no rule fires after
> 2-3 inconclusive ballots). The Pineapple Primary, kingmaker-refusal traits (Lowbrow / Easily
> Overwhelmed / Unlikable), anti-frontrunner lowest-score preference, and the unanimous shortcut
> (offer+accept VP pre-vote ⇒ ballot 1 unanimous) are all CPU-confirmed. Full per-ballot menu &
> behavior dump → **[§25.4](#254-convention-cpu--per-ballot-momentum--interballot-menu--compromise-picker)**.
> Designer's overall ruling: the convention CPU is **"rough/awful, needs a 2.9 rework"** (DH-8).

#### 15.3.1 Candidate types and per-faction slate

Each faction may run **up to one major + (one minor OR one favorite-son)** candidate
(post 211):

- **Major candidate** — faction leader OR a celebrity with `Command`.
- **Minor candidate** — anyone with `Command`.
- **Favorite-son** — holds a state delegation without serious presidential ambition; can
  release their state's delegates to another candidate on a later ballot.

A party that primary-elected a single nominee (the shipped 2.9.1 model) is a degenerate
case; the design surface allows for a contested convention.

#### 15.3.2 Multi-ballot loop with momentum

Each ballot is a **state delegate vote**. The `447 needed to win` figure in post 229 is
total delegates / 2 + 1. Ballots loop until someone clears the threshold.

- **Nominator speech**: each candidate is nominated by a chosen orator who rolls **1d6**
  (post 220, 229). The roll triggers:
  - Roll **5 with Orator** trait: **+1 momentum** to the ticket on next ballot.
  - Roll **1**: nominator gives an awful speech, is booed off; ticket loses 1 in the
    general; **nominator loses Orator** if they had it (post 227).
  - Other rolls: no effect.
- **Keynote Speaker** is a separately chosen role, picked by a different faction; rolls
  on the same d6 schedule (posts 222, 247, 252).
- **Momentum carry**: the candidate who **gained the most delegates** between two ballots
  receives **+1 momentum** on the next ballot (post 243: "Marshall gained the most
  delegates between ballots and gains +1 momentum").
- **Unit rule**: if in effect (default), a state's delegates vote as a unit; can be
  **suspended by majority vote** at a Force-a-Rules-Change inter-ballot action (post 231).

#### 15.3.3 Inter-ballot actions (post 230)

After each ballot, each candidate gets a number of actions = current standing
(major candidates 1; the leading major candidate 3 — the per-candidate budget is
adjustable by the GM). Each action drawn from:

1. **Force a Rules Change** — Force a Vote to suspend the unit rule or change the
   delegate-percentage threshold to win.
2. **Presidential Promise** — Offer a cabinet seat / role to another candidate's faction
   in exchange for endorsement (post 241: "Faulkner will promise SKCPU's faction the
   Secretary of State position for Levin's endorsement"). Rules: a candidate can only
   **offer** to one with fewer delegates; can only **request** from one with more
   delegates. Acceptance is at the receiving player's discretion.
3. **Drop out & endorse** — without a presidential promise; delegates flow to the
   endorsee on the next ballot.
4. **Kingmaker interference** — a faction leader with the `Kingmaker` trait, **not running
   themselves**, rolls 5-6 on d6 for `+1 momentum` (or `-1 momentum` for an allied
   candidate they want to condemn) on next ballot (post 219).
5. **Request a ballot shift** — a faction leader can request a same-ballot delegate shift
   from sympathetic favorite-sons/minors. If supported (post 245), retroactively recomputes
   the ballot totals **on that ballot** (post 246: Vallandingham and Nelson shift their
   delegates to Faulkner, who jumps from 309 to 449 and wins by 2 delegates).

#### 15.3.4 VP impact scoring — 10 binary checks (post 225, 250)

After the nominee picks the VP, score the **ticket** on ten checks; sum the +/−1s. Each
yes = +1 unless noted:

| # | Check | Notes |
|---|---|---|
| 1 | VP is from another faction | If from the faction with the lowest ideological enthusiasm in the party, that ideology enthusiasm moves toward the party |
| 2 | Ticket has a Moderate, Conservative, or Liberal | — |
| 3 | Ticket is at least 20 years of age apart | — |
| 4 | At least one person on the ticket is older than 50 | — |
| 5 | At least one person on the ticket is younger than 60 | — |
| 6 | Ticket is an incumbent ticket (same Pres+VP) | — |
| 7 | Exactly one of the two is "independent" or not currently in office (excluding military) | "voters like an outsider" |
| 8 | One from a Big State and one from a Small State | — |
| 9 | Ticket members from different regions | — |
| 10 | VP obscure-or-not roll (1d6, branches on Obscure trait) | Roll 6 with Obscure: loses Obscure, gains Disharmonious + Controversial, **−2** (skip the negative trait grants if VP has Harmonious or Integrity) |

Winning party-preference contribution = `sign(red_total − blue_total) × 1` toward the
higher-scoring party.

#### 15.3.5 Platform scoring — 5 planks + 4-step comparison

Platform is split across **5 planks**: `Domestic / Foreign / Economic / Judicial /
Executive` (post 224). Each plank is a written statement OR substitution by a recently-
introduced bill. Each plank can be **delegated to another faction** in the party (post
223: "delegating the full platform to Brocklin"; post 248: "Domestic: Delegate to
@DinkCPU"). Delegating yields a `Mod enthusiasm +2` toward the delegating party.

**Plank scoring** (post 226, 235, 251): each plank scores **every faction in the party
by every card** (ideology + interest + lobby), using ±50 / ±100 / ±150 per card hit (see
[§12.8](#128-forum-design-layer-bill-scoring-sums-all-faction-cards-design-divergence)).
Faction total = sum across all 5 planks.

**4-step comparison** vs the other party (each yes = +1 pt to the platform's owning
party, max +4 pts that flow as party-pref):

1. Total points the party would gain by fulfilling all planks > the other party's?
2. The lowest-scoring faction in the party with the platform > the other party's lowest?
3. Does the presidential nominee's personal ideology score the most points (or tied)?
4. (Implicit fourth check on the negative side — if any ideology in the party scores
   negative, that ideology's enthusiasm moves one step toward the other party; the
   ideology that scores the highest moves +1 toward the owning party.)

Resulting `+1 party preference` to the higher-platform-scoring party.

#### 15.3.6 General election action library (designed, not built)

After the convention, each ticket takes **two action phases** (one per round, posts
255-265). Each phase offers:

- **Give a Speech**: VP or faction leader picks a target state.
  - With `Orator`: roll 5-6 → +1 in that state; **separate** roll 5-6 → party pref +1.
  - Without Orator: roll 5-6 → +1 in that state only.
  - With `Incoherent`: roll 1-2 → −1 in that state and −1 party preference.
  - No speech: roll 1-2 → −1 to the nominee's faction-ideology enthusiasm.
- **Send VP to Shore Up Support**: VP visits a region.
  - `Likable` + roll 5-6 → +1 in all states of the region.
  - `Harmonious` + roll 5-6 → +1 party pref.
  - `Unlikable` + roll 1-2 → −1 in region states.
  - `Disharmonious` + roll 1-2 → −1 party pref.
  - `Provincial`: auto +1 in home state, **25%** chance +1 in home region.
  - `Cosmopolitan`: 25% chance +1 in another region (random outside home).
  - Default (no relevant trait): roll 5-6 → +1 in random state in region.
  - VP not sent: roll 1-2 → VP faction ideology enthusiasm −1.
  - `Delegator` president: can send VP outside home region but needs roll of 6 to land
    +1.

#### 15.3.7 Scandal rolls

Each round, **major** candidates roll for scandal (posts 255, 262):

- `Integrity` trait grants **immunity**, skip.
- Otherwise roll 1d6: on a 6 a scandal fires.
- On a hit, roll **2d6** for magnitude (post 255: "rolls 2, Minor Scandal, −1 in
  election").

#### 15.3.8 State of the Meters → election bonuses (post 266)

After all general-election actions, **convert national meter readings** into election
bonuses. Each meter contributes additively (post 266):

| Meter | Outcome at meter step |
|---|---|
| Revenue–Budget | Add +1 for `Traditionalists`; −1 Enthusiasm for `Progressives` |
| Economic Stability | No effect (in the run shown — likely depends on direction) |
| Domestic Stability | Incumbent Party **−1** in elections |
| Honest Gov't | No effect (in the run shown) |
| Party Preference | numeric advantage to the party (already aggregated) |

Each enthusiasm/preference line couples into `calcStateVote` for the upcoming general.

#### 15.3.9 Faithless electors

Per-state random elector desertions during the EV tally (post 267: "one faithless elector
each from IA, KS, WI"). A small per-state probabilistic count of EVs flipped to a third
candidate or to opponents. *(designed, not built — extend
`runPhase_2_9_4_PresidentialGeneral`'s EV allocation with a small per-state faithless-elector
roll.)*

#### 15.3.10 Scoring & nominee aftermath

- **Convention scoring** (per faction, post 228, 253): the nominating party leader scores
  +500, their supporters +100, the rest +50. Plus penalties: nominee's nominator gains
  `Uncharismatic` on a bad speech (post 228); ticket gains `−1 in election` on minor
  scandal.
- **Permanent post-loss penalties** (post 268):
  - Defeated nominee: `permanent −1 in all future Presidential runs`.
  - Defeated VP: `−1 in the next Presidential race` and gains `Uncharismatic`.
- **Winner trait grants** (post 268): winning president gains `+1 Command`.
- **Defeated incumbents auto-retire** (post 297): defeated pres candidates, governors,
  and reps are automatically retired by the GM at end-of-half-term. Engine has no
  auto-retire-on-loss rule.

*(designed, not built — 2.9.2 needs to be rewritten from "log ratification" into a
multi-screen convention loop with ballots, inter-ballot actions, VP scoring, platform
scoring, scandal rolls, and meter-to-bonus conversion.)*

---

## 16. End of half-term (2.10)

`runPhase_2_10_End` (`phaseRunners.ts:4171`): every living politician **ages +2**; PV
refreshes; in 1772 the Continental Congress reassembles if its term has elapsed
(`CC_TERM_YEARS`), incrementing `assemblyOrdinal` and re-electing the CC President if needed;
the half-term summary is closed (`closeSummary`). `advancePhase` then rolls the year +2.

The half-term summary (`halfTermSummary.ts`) records, per turn: meters start/end, faction
sizes, a PV snapshot, deaths/retirements (with cause + office), bills passed/failed, era
events resolved, and milestones — read by the End-of-Half-Term page and the campaign recap.

### 16.1 Forum design layer (designed, not built)

#### 16.1.1 Old-age stat decay rolls

End-of-half-term rolls **per-politician stat decay** beyond the ability decay in 2.4.1
(post 297: "@Vicx Rep Willie P Magnum −1 Admin"). The shipped engine already has age-≥70
ability decay in 2.4.1 (`MORTALITY_RULES`, `ABILITY_LOSS_RULES.oldAge`, `types.ts:519`).
**Forum confirmation** matches that rule — appears at end-of-half-term in the GM cadence
even though it is engine-resolved in 2.4.1. Implementation is shipped; doc note: this is
not a new mechanic, just a re-ordering of the GM's summary post.

#### 16.1.2 Defeated incumbents auto-retire

Defeated incumbents (defeated pres nominees, defeated governors, defeated reps) are
**deterministically retired** by the GM at end-of-half-term (post 297). Engine 2.4.1
retires by age-rate only and never auto-retires on electoral loss. *(designed, not built —
add a retire-on-defeat sweep to 2.10 or right after 2.9.4/2.9.5/2.9.6.)*

#### 16.1.3 Faction nicknames

Forum factions adopt **era-specific nicknames** (post 298: `War Democrats`, `Finance
National Republicans`, `Radical Republicans`, `Mavericks`). The `Faction.nickname` field
exists in the model (`types.ts:1297`); **what triggers a nickname change** is unclear and
seems GM-discretionary. *(designed, not built — formalize an algorithmic / event-driven
nickname-update rule, possibly keyed on faction's dominant ideology / leader trait /
recent bill record.)*

#### 16.1.4 Auto-Carpetbagger on cross-state moves

(covered in [§6.2.x](#62x-forum-design-layer-designed-not-built)) — deterministic, not
probabilistic.

---

## 17. Era systems

### 17.1 Continental Congress (`continentalCongress.ts`)

The independence-era stand-in for Congress. `CC_TERM_YEARS = 4`
(`continentalCongress.ts:9`); state delegate counts come from `state.ccDelegateSlots`
(2–4, `states1772.ts`).

- **Seating** (`appointDelegates`, `:23`): pre-governor, factions are ranked by member count
  (PV tiebreak) and take turns picking their top-PV in-state member; post-governor, the
  **governor** appoints from in-state candidates scored by `pv + 50(same party) + 25(same
  faction)`. A **Manipulative** governor self-appoints `35%` of the time (and vacates the
  governorship). Under the Articles, last-term delegates are excluded.
- **CC President** (`electCCPresident`, `:116`): the largest faction's top-PV delegate. Gains
  `+1 legislative`, `+1 command`, loses `Obscure`, `20%` chance of `Leadership`; takes office
  `CCPresident` (prestige 25 — second only to President).
- **CC committees** (`appointCCCommittees`, `:154`): four chairs (Domestic→Welfare,
  Foreign/Military→Foreign Affairs, Economic→Economics, Judicial→Justice), each `+1 command`,
  `+1 legislative`, + expertise.
- **CC bills** (`generateCCBills` `:232`, `voteCC` `:199`): 2–3 bills/turn (always proposes
  Continental Army/Navy when a war is active and no senior commander exists). Each state's
  delegates vote (same-faction `0.92` / same-party `0.60` / cross `0.20`, card-biased);
  passage = **simple majority of states pre-Articles, 2/3 under the Articles**.

### 17.2 First Continental Congress builder (`firstContinentalCongress.ts`)

The interactive 1774 seating that 2.9.6 hosts in 1772. Colonies processed **alphabetically
by abbreviation** (`:54`). For each colony the **selecting faction** is its largest in-state
faction (PV tiebreak). Candidates are tiered for that faction:

- **T1** same faction · **T2** same party, other faction · **T3** cross-party within
  ideology-distance ≤2 of the faction's personality center · **Wild** everything else
  (`classifyTier`, `:135`).

AI picks (`aiPickDelegate`, `:153`) walk T1→T2→T3 (T1 by PV; T2/T3 by ideological closeness
then PV), with a `0.12` wild-card chance, **skipping anyone with `careerTrackYears ≥ 4`**.
Player colonies return a pick UI; each committed delegate (`commitDelegate`, `:239`) **resets
their career track** and is recorded with its tier. Player vs AI flow is mediated by
`ccBuilderCursor` (`types.ts:1611`) and the `ccBuilder` / `ccAIConfirm` input modes.

### 17.3 Constitutional Convention (`constitutionalConvention.ts`)

Triggered by a 1772 era-event `postEffect` (`startConvention`); pre-empts the phase loop
until resolved (`engine.ts:18`). Seven binding articles voted on
(`ConstitutionalArticles`, `types.ts:1389`): legislature, executive, judiciary,
slaveCompromise, amendmentProcess, presidentialEligibility, termLimits. CPU delegates
auto-fill unselected votes by party bias (`autoFillCPUVotes`, `:81`). On `applyConvention`
(`:127`):

- **Father of the Constitution** = top CC delegate by `legislative+judicial`; gains
  `Celebrity` + `+1 command`.
- **Three Federalist authors** drawn from the top-6 RED delegates; each `+1 command` and a
  `tryGrantTrait('Egghead')`.
- **Ratification**: count approving governors (RED governor approves; others 50%; none →
  `state.bias > −0.5`); need **9+ states**. On success: `constitutionRatified = true`,
  transition to **federalism**, disband the CC, clear the Articles, convert colonies to
  states with electoral votes.

### 17.4 Revolutionary War (`revolutionaryWar.ts`)

State `RevolutionaryWar` (`types.ts:1371`). Defaults (`ensureWar`, `:12`):
**`groundWinsNeeded = 7`**, **`groundLossesRemaining = 16`** (the loss cap, void with the
French alliance), senior general/admiral + benches, `frenchAlliance = false`.

- **Appointments** (`appointMilitary`, `:41`): senior general = highest military (non-naval,
  not Frail, `military≥1`), moved to MA, office `GeneralInChief`, +4 generals; senior admiral
  = highest military among **Naval-expertise** politicians, +2 admirals.
- **Battle resolution** (`runRevWarBattles`, `:175`): one naval check then 1–3 ground battles
  (continue while `d100 ≤ 66`). Ground target `= (SecWar.admin + general.military) +
  general.military×10 + (frenchAlliance? 25:0)`, modified by difficulty (`40%` difficult
  `−20` / `50%` moderate `0` / `10%` easy `+15`); win iff `d100 ≤ target`.
- **Casualties** (`applyCasualties`, `:67`): per-tier d6 rolls for deaths and wounds (wounds
  try `Frail` vs `Hale`); `10%` of survivors gain `+1 military`.
- **Battle losses dock stats** (`applyBattleLoss`, `:128`, magnitudes in
  `ABILITY_LOSS_RULES.battle` `types.ts:537`): difficult ground `military −1`; moderate/easy
  ground `military/governing/legislative/admin −1`; naval `military −1`; **losing the
  majority of a phase's ground battles** docks the general `admin −1` (winning the majority
  grants `admin +1`). A battle loss also has a `0.50` chance to strip `Leadership`.
- **Outcome**: win at `currentGroundWins ≥ 7`; loss at `currentGroundLosses ≥ 16` **only if
  no French alliance**. `applyFrenchAlliance` (`:268`) sets France diplomacy to 4, `+1`
  general military, and removes the loss condition. `applyTreatyOfParis` (`:279`) ends the
  war, disbands commanders, sets Britain diplomacy `−3`.

### 17.5 Era-event graph (1772) (`eraGraph.ts`, data `eraEvents1772.ts`)

The 1772 era-event system is a **graph of nodes** (`GraphNode`, `eraEvents1772.ts:19`), each
with a stable `templateId`, a `chartIndex` (<49 — stops before the French Revolution / next
era), an optional **serializable `Predicate` precondition** (`types.ts:1487`), a `build(year)`,
and flags: `coreSpine` (inevitable openers), `realEvent` (false = counterfactual branch),
`military` (roster-gated on the GiC), `aiBias` (AI response by personality).

- **`evalPredicate`** (`eraGraph.ts:12`) interprets the predicate tree (`all/any/not`,
  year/meter/interest/diplomacy thresholds, `eventCompleted`, `eventChose`, `warActive`,
  `warOutcome`, `stateAdmitted`, `officeControlledByPlayer`, `rosterHasSkill`, `flag`).
- **`selectEraGraphNode`** (`eraGraph.ts:107`): one event/turn. Eligible = not completed and
  precondition true. Core-spine nodes fire first; otherwise split spine vs counterfactual and
  apply **`historyPressure 0.8`** (when both are eligible, 80% the historical spine fires);
  non-core nodes fire only on `fireChance 0.85` (`ERA_GRAPH_RULES`, `types.ts:1101`).
- **Content**: pre-war provocations (Gaspee, Committees of Correspondence, Tea Act, Boston Tea
  Party as auto-spine), then interactive forks (Intolerable Acts → convene CC; Declaration of
  Resolves; Lexington & Concord → establish the army; French/Spanish/Dutch interventions;
  peace overtures) and **terminal endings** (`lost_war`, `dominion_autonomy`,
  `triggersGameEnd`). The graph never reimplements CC/ConCon/RevWar — it authors
  existing-shape consequences via `postEffects` and `handleScripted1772Consequences`.

### 17.6 Territories (`territories.ts`)

`admitState` (`:8`): idempotent; pulls a seed from `EXPANSION_STATES_BY_ID`
(`expansionStates.ts`), stamps `admissionYear = current year`, pushes a fresh `State`
(empty legislature, `isColony:false`), logs a system entry. Invoked from era-event
`postEffects`.

---

## 18. System interactions

The mechanics are a web, not a list. The load-bearing cross-effects:

1. **Lobby → expertise → faction center → ideology shifts → elections (the PR7 chain).**
   A faction's `lobbyCards` trickle **expertise** onto its members in 2.1.2 (`0.10`/member),
   and `LOBBY_INDUSTRY` nudges state industries in 2.1.8. That expertise then **biases
   `factionCenter`** (Agriculture `+1`, Business `+0.5`, Labor `−1`, capped ±0.5;
   `factionCenter` `phaseRunners.ts:717`). `factionCenter` is the **target of 2.1.5 ideology
   shifts** and the **fit term in 2.1.6 conversions and 2.2.3 leadership scoring**. Shifted
   ideologies change a candidate's **enthusiasm row** and faction-card alignment, which feed
   `calcStateVote`. So a faction's economic patrons slowly pull its members' ideology, which
   slowly moves its electoral coalition.

2. **Cabinet expertise/traits → national meters → era-event modulation → elections.**
   Cabinet seats grant expertise/admin/command on confirmation (2.3.1), which raise the
   **lingering-phase meters** (2.5.1) — amplified `1.5×` by a **Delegator** president, damped
   `0.5×` by a **Micromanager**. Those same cabinet expertise/traits **modulate era-event
   outcomes** (PR6 `governance_crisis`), and meters/`partyPreference` feed elections via
   enthusiasm and the `calcStateVote` party-preference term.

3. **Loyalty → cabinet defection (Secession Winter).** In 1856, Southern, right-leaning
   cabinet secretaries carry low `loyalty`. Resolving `secession-winter` decays loyalty by
   region×ideology; crossing `0.4` triggers resignation + `Traitor`. The defection count
   *worsens the event's own outcome band* (`secessionWinterBand`) — and the lost cabinet
   members stop contributing to meters next turn (interaction #2 in reverse). A `Crisis Gov`
   president blunts the whole sequence.

4. **PV is the universal currency.** It orders the draft (`pickBestForFaction`), names
   Speakers/Pro Tems/party leaders/CC President/cabinet picks, is the patronage term in
   leadership challenges, and is a (small) additive term in `calcStateVote`. Anything that
   moves a stat, trait, office, or age moves PV via `refreshPv`, rippling into all of the
   above.

5. **Governorships → state bias → every race in that state.** A held governorship nudges
   `state.bias` each turn (2.5.2), and `state.bias` is a ×5 term in `calcStateVote` for *all*
   contexts — so controlling a governor's mansion compounds into Senate, House, and
   presidential margins there.

6. **Office ↔ PV feedback loop.** Winning office adds prestige (PV up), which makes a
   politician a stronger nominee next cycle and a harder leadership target — a mild
   incumbency flywheel, partly counter-weighted by the age curve and trait/ability decay at
   70+.

7. **War ↔ command ↔ traits.** A war turns on the `military_command` Command grant in 2.3.2
   (Decisive General `+2`, Naive Strategist `0`), and Revolutionary War battle losses dock
   commander stats and can strip `Leadership` — directly lowering that politician's PV and
   future electoral/leadership standing.

---

## 19. Shipped vs. designed boundary

What the **code actually does** today vs. what the type system/eras imply is planned.

**Shipped (both scenarios unless noted):**
- Full 33-phase loop with year + era gating; 2-year half-terms.
- Draft (incl. 1772 dataset-driven inaugural expansion draft) and CPU snake picking.
- Career tracks, the PR7 lobby→expertise→industry→faction-center chain, and ability/trait
  earn lifecycles.
- All five churn systems (flip-flop, relocation, ideology, conversion, kingmakers) with CPU AI.
- Faction alignment drift (personality buckets + card swaps).
- Leadership (Speaker/Pro Tem/committees/faction & party leaders) with era-scaled challenge math.
- **1856 only**: cabinet, military appointment, executive actions, court management, the full
  presidential/governor/congressional election machinery, year-gated era events with PR6
  modulation and Secession Winter loyalty defection.
- **1772 only**: Continental Congress (seating, president, committees, bills), First-CC
  builder, Constitutional Convention, Revolutionary War, the era-event graph, territory
  admission.
- Deaths/retirements, anytime events (national + personal), lingering meters, half-term
  summaries.

**Designed, not built (present in types/tables, or seen on the forum but not in code):**

*Pre-existing items (types/tables):*
- **Eras `federalism`, `nationalism→` beyond 1856, and `modern`.** Their tuning rows exist in
  `LEADERSHIP_RULES.eraConfig`, `MORTALITY_RULES.eraConfig`, `ANYTIME_EVENTS_RULES.eraConfig`,
  and `TRAIT_*` era splits (`types.ts`), and the Constitutional Convention *transitions* 1772
  into `federalism`, but **no scenario boots into federalism/modern**, and the only built
  era-event content is the 1772 graph and the 1856 templates. A 1772 game that ratifies the
  Constitution enters federalism using the generic (non-era-specific) phase logic. **Forum
  evidence**: the 1868 thread plays in a `Gilded Age (1868–1892)` era and references "the
  next era" — implying *at least two* additional eras (Gilded Age + Progressive Era / modern)
  past `nationalism`.
- **Expertise tags with no economic lean** (16 of 19 — only Agriculture/Business/Labor carry
  a `factionCenter` sign in `EXPERTISE_IDEOLOGY_LEAN`). The rest are flavor/scoring inputs
  only today.
- **Third-party challenge (2.9.3)** is a stub — always "no challenge."
- **Generic (non-Revolutionary) war** uses the simple `milPower×10 + d100` resolver; the rich
  battle/casualty system is Revolutionary-War-only.
- **Supreme Court cases** (`SupremeCourtCase`, `pendingCourtCases`) exist as a type and a
  ruling tick (2.5.3 / 2.8.2), but no scenario seeds substantive cases — court activity is the
  abstract `partyPreference` nudge plus justice turnover.
- Several `Predicate` kinds and `postEffects` (`addPolitician`, `endWar`) and graph
  counterfactual depth exist to support **future graph content** beyond the shipped 1772 nodes.

*New items revealed by forum digest `f4c7c2c4`:*

**Legislation (§12.4–§12.8)**
- Committee block-and-replace (committee-domain-locked).
- Bill packaging (multiple bills voted as one).
- Per-faction senatorial filibuster between House and Senate.
- `*Crisis Bill*` tag with active-crisis resolution semantics (and a higher per-card score
  multiplier).
- Bill scoring iterates ALL of a faction's ideology / lobby / interest cards at ±50/±100/
  ±150 per card hit — **major divergence** from the shipped `factionCenter`-driven
  `cardVoteBias`.
- Passive+Pliable president auto-signs all passed bills (no signing veto).

**Convention machinery (§15.3) — the biggest new surface area**
- Multi-ballot loop with unit rule, momentum carry, inter-ballot actions.
- Presidential promises (cabinet seats for endorsements), kingmaker boosts, ballot shifts.
- Nominator-speech 1d6 rolls with Orator/booed-off branches.
- Keynote Speaker as separate role.
- Major/minor/favorite-son candidate slate rules.
- 5-plank platform with delegation + 4-step tiebreak comparison.
- 10-check VP impact scoring + Obscure 1d6 branch.
- 2d6 scandal magnitude rolls (Integrity → immunity).
- Two-round general-election action library (Give a Speech, Send VP, both trait-modulated).
- Meter → election-bonus mapping table (post 266).
- Faithless electors in EV tally.
- Defeated-nominee permanent −1 in future runs; defeated VP gets one-cycle penalty.

**Governor's actions library (§11.3)** — ~14 named actions, each d100 vs 20·governing
with skill / trait / state-status prerequisites. Includes the **anti-Jim-Crow, anti-
Reconstruction, Gerrymander, Women's Suffrage, State Bank, Major Irrigation,
Anti-Corruption** actions.

**State-level policy flags (§11.4)** — persistent `Poll Tax / Jim Crow / Prohibition /
Women's Suffrage / Segregation` on/off per state with time-bounded scoring multipliers
(e.g. Jim Crow gov actions = **3× points for 30 years**).

**Industry leadership scoring (§11.5)** — per-half-term leaderboard scoring each state's
industries.

**Executive Actions library (§14.1)** — persistent actions with green / yellow shading;
auto-deactivate on admin change; `Easily Overwhelmed` hand-off roll to VP; observed action
library including Swing-around-the-circle, Bureau of Labor, Pro-military budget.

**Constitutional Amendments durable state (§14.2)** — Six-Year-Term Presidency, VP-vacancy
fill, ratification-supermajority. Passable/repealable by bills.

**Foreign relations (§13.3)** — Per-power meters: UK/France/Spain/Prussia/Russia/China.
Three named diplomacy actions (Increase Relations, Trade, Extend Credit). The **national
surplus integer** distinct from the `revenue` meter.

**Cabinet (§9.3)** — Ministers-to-foreign-powers seats; admiral/general bench slots;
state-status-aware eligibility (no territorials); region-coverage **−1 in pres race** malus
where the cabinet has zero coverage; Egghead-cabinet advisory step on era events.

**Era events (§10.4)** — Multi-decider model (Pres + SoS + UK Minister jointly resolving
Oregon Treaty); foreign-territory grants (Oregon Treaty awards BC/WA/OR/ID at once);
census-driven EV deltas; state-policy-flag side-effects.

**Politician churn (§6.2.x–§6.5.x)** — per-faction relocation budget (4 attempts) and
ideology-shift budget (3+, capped 9 by leader traits); cross-party flip targeting the
`Can Party Flip` trait (seeded on disgruntled ideologies); per-Kingmaker protégé slot
cap (5 + Leadership-unlocked 6th); per-pairing expertise/skill/trait grants on protégé
selection; auto-Carpetbagger on alt-state moves.

**Faction personalities (§7.4)** — multi-era card pool, era-gated subsets; era-specific
draft-ideology mix.

**Leadership (§8.5)** — Congressional leadership has nine roles (vs shipped two); whip
races run ranked-choice with closest-ideology endorsement on elimination; committee-chair
eligibility requires prior service; party-leader 5-term incumbency fatigue; faction-leader
step-down anointing; Passive trait auto-disqualifies.

**End-of-half-term (§16.1)** — defeated incumbents auto-retire; faction nicknames update
per era.

*New items revealed by forum digests `f55d3e21` (federalism) + `85f8e6b4` (1772 solo):*

**Federalism era (§20)** — a full unbuilt era: a `scenario1788` mid-government boot; the
10-faction roster + per-era **nickname relabel** mechanic; the federalism **era-event spine**
(Compromise of 1790, Hamiltonian financial program, Pinckney/Jay, Whiskey/Fries rebellions,
French-Revolution wars, Louisiana Purchase); **party-formation as an era event** (~1792); the
**Mod/Cons-weighted draft profile**; the federalism SCOTUS case set.

**Generic cross-era war system (§21.1)** — one war model for every war (additive
Chance-of-Success + warscore/momentum/×2 + confirmation cascade), replacing the flat generic
resolver and folding in the 1772 Rev-War loop.

**Per-state presidential-election method (§21.2)** — `State.electionMethod`
(popular vs legislature-chosen), flipped per-state by event and globally by amendment;
**diverges from the national popular `calcStateVote`**.

**Amendments as durable, separately-ratified state (§21.3)** — pass Congress → ratify across
states → durable rule-changing flag; can fail ratification; term-length / popular-vote /
VP-vacancy / suffrage effects.

**Firing-precedent gate on cabinet (§21.4)** — cabinets are sticky hold-overs until a firing
precedent is set; **contradicts the shipped cabinet-wipe-on-election**; same-faction guard on
the US Bank President.

**Bill-driven statehood + auto-generated officials (§21.5)** — statehood/territory bills call
`admitState`; event/war annexation; generate filler pols for sparse new states.

**Bill typing + budget-gated spending cap (§21.6)** — Foundational/Spending/Crisis tags; a
numeric per-turn spending budget that blocks non-crisis spending bills even after the floor
vote; crisis bypasses the cap.

**Era-event scheduling model (§21.7)** — historical-year-sorted, per-half-term-capped,
roll-≤-%-to-fire-with-spill; **diverges from the shipped `coreSpine` precondition graph**.

**Named-ordinal meters + ±3 swing cap + war-score meter (§21.8)** — labeled-step ordinal
meters and a ±3-per-phase clamp vs the 7 numeric meters.

**Card-distribution algorithm (§7.4)** — the five-step ideology/interest/lobby allocation
(adjacency rule, ≥5-pol top-up floor, lobby-activation-by-event), now fully specified by the
1772 solo.

*New items revealed by forum digest `3a9ac985` (modern 1948→2020) — the **most mechanically
mature designed surface in the knowledge base, almost entirely unbuilt** ([§22](#22-modern-era-systems-designed-not-built)):*

The modern era is the campaign's **end-state** and the richest era: it has the **full
primaries → convention → general** election pipeline, a concrete **named meter bank**, a
formalized **enthusiasm/Party-Pref + Score engine**, and a **SCOTUS docket** — and **none of
it is built** (only the `modern` tuning rows + a few thin stubs exist). The biggest unbuilt
surfaces:

- **Named meter bank + numeric debt + crisis/cascade (§22.1)** — 8 banded-text meters +
  per-ideology enthusiasm + 8 per-power relations + a numeric debt integer; crisis entry/exit
  by tier; meter cascades; top-of-ladder hard rules (Honest-Gov't maxed deactivates
  Machines/Gerrymandering); the canonical meter→election table.
- **Faction-enthusiasm / Party-Pref engine + Score economy (§22.2)** — the 4-part
  enthusiasm reshuffle after legislation scoring; a faction `Score` field; lowest-faction team
  penalty; era-end awards.
- **Presidential primary subsystem (§22.3)** — Major/Minor candidates + 3 focus states; the
  charisma focus-state roll table; Iron-Fist incumbent/PL blocking; per-group debate →
  scandal → broke-check → action loop; WTA+proportional delegate accumulation + transfer;
  rejectable Presidential Promise.
- **Third-party-challenge trigger (§22.4)** — fills the shipped 2.9.3 no-op (party-pref-band
  + ideology-at-Neutral; president's-own-ideology carve-out; nationwide-ballot Celebrity).
- **General-election library (§22.5)** — 2-round action library, 3+1 debates with per-debate
  scandal rolls, crisis-gated October Surprise, meter→EV tally with close-state tie-breaks +
  faithless electors, defeat maluses.
- **CPU delegate engine (§22.6)** — per-state EV × category multiplier; 53 states ⇒ 1,300
  delegates / majority 651; host-sets-categories advantage (drives both primary and
  convention).
- **SCOTUS subsystem (§22.7)** — named-Justice docket (one case/term, ideology votes);
  Iron-Fist/Manipulative compel-vote + compel-retire (12-yr minimum, conditional-retirement
  bargain); dynamic court size + court-packing (age-70 trigger); 64/60% confirmation with
  failed-nominee moderate-auto-confirm recovery; appointee ideology reveal + 10-yr drift;
  ruling → law-deactivation.
- **Investigation special committees (§22.8)** — **under-designed** (rules left blank,
  player-authored mid-game): investigate-a-lobby bill → special committee → evidence roll →
  dominant-party target.
- **Military-leadership appointment tier (§22.9)** — CJCS/Army/Navy chiefs + Generals/Admirals
  inside 2.3.2; auto-confirmed; promotion back-fill; rank constraints; wired to the war engine.
- **53-state alt roster + modern apportionment (§22.10)** — 53 states (incl. DC/Cuba/PR);
  Wyoming-Rule census recompute (House 572-601, Senate 106) resetting EV + Bias; two-home-state
  pols; persisted + auto-filled House slates/committees (scaling wall).
- **Era clock + era enum (§22.11)** — fictional era names that gate content + rescale the card
  economy at boundaries; clock ~10y behind real tech; dataset-exhaustion procedural generation.

*Modern detail that **sharpens** already-documented systems (now corroborated across 3-4 eras —
labels bumped inline):*

- **Legislation (§12.9)** — Executive-Branch-Interference / cabinet-proposed bills
  (Admin 4-5 / Crisis-Admin + presidential assent; new-dept→new-seat); bill-relationship graph
  (Not-repealable / replace-only-by-X / amendment-tier); collective-accountability Party-Pref
  penalty on lapsed Crisis Bills; failed bills score; per-pol reelection deltas.
- **Convention (§15.3, §22.6)** — the CPU delegate engine specifics; sitting-VP-replacement
  roll; Iron-Fist platform-delegation block; failed-platform penalty.
- **Cabinet (§9.3.6)** — diversity floor (≥25%) + intra-party faction-equity penalty;
  failed-confirmation recovery (SML offers 5 → nominator picks → auto-confirm); per-officer
  tenure (CIA/FBI/Fed/Key Advisor); opp-party cap; military auto-confirm.
- **Governors/states (§11.4)** — state **Bias** integer + ideological **loyalist-fill** gating;
  voter-suppression actions blocked while Honest-Gov't maxed; modern primary-control actions.
- **Amendments (§21.3)** — modern ratification by **governors at 40-of-53** + **2/3-of-572
  House** pass gate; grandfather clause.

### 19.1 Design divergences for the roadmap

Rules where the **forum and the shipped engine genuinely disagree** (not just
"forum has more"). The roadmap-planner should treat each as a *decision*, not a feature add.

*From batch 1:*

1. **Bill scoring**: shipped engine uses `factionCenter` (one ideology index, PR7-biased)
   in `cardVoteBias` at `0.03 × delta` per matching card. Forum scores **every** ideology
   + lobby + interest card at ±50/±100/±150 per card hit. (See §12.8.)
2. **Carpetbagger trait grant**: shipped engine rolls (`0.05`–`0.30`) on cross-state move
   with a 4-step ladder. Forum **auto-grants** on alt-state moves. (See §6.2.x.)
3. **Conversion targeting**: shipped engine uses a multiplicative willingness table
   keyed on fit/PV/Loyal/Opportunist. Forum gates strictly on `Can Party Flip` (cross
   party) and `Pliable + adjacent ideology` (same party), with hard per-base rates of
   5/10/15%. (See §6.4.x.)

*New in batch 2:*

4. **Era-event scheduling model vs. `coreSpine`** *(the biggest 1772 divergence)*. The
   shipped 1772 engine fires events off a **precondition graph** whose `coreSpine` nodes fire
   **regardless of any probabilistic roll** (`eraEvents1772.ts:23`; `selectEraGraphNode`,
   `eraGraph.ts:107`). The forum instead **sorts events by historical year** and **rolls each
   one (`roll ≤ %-to-fire`) per half-term up to an era cap**, with the 1772 half-term firing
   its 5 historical events at 100% and **spill into another GenEvo round** if a required count
   is underfilled (`1772s` B1). These produce **different event sequences**. (See
   [§21.7](#217-era-event-scheduling-model-vs-corespine).)
5. **Per-state presidential-election method vs. the national popular model**. Shipped
   `calcStateVote` resolves the general by **popular vote in every state** (`presGeneral`,
   `phaseRunners.ts:3752`). The federalism design has **per-state electors chosen by
   legislature vs popular vote**, flippable per state by event or by national amendment
   (`fed` 194, 220, 255, 306-307). (See
   [§21.2](#212-per-state-presidential-election-method).)
6. **Generic war resolver vs. warscore/momentum/×2**. Shipped non-Rev-War wars use a flat
   `milPower×10 + d100 > enemyPower×10 + 50`, war ends at `±50` (`phaseRunners.ts:3593-3627`).
   The forum uses a **per-battle Chance-of-Success formula** + a **warscore + momentum → %**
   resolution with an **escalating ×2 multiplier** and a **confirmation cascade** when a
   defeated commander is fired (`fed` 222, 312, 389; `1772s` 20, 22, 48, 60). **Batch 4
   (1856-native) is the sharpest confirmation:** the **Civil War** is the **Major-tier** instance
   of this engine — **two theaters, naval-victories-gate-land, per-theater WarScore with a +10
   auto-win, a Major/Minor/Operation multiplier, named-officer casualties, and a permanent
   president +1-all-elections** on victory — none of which the shipped resolver has. (See
   [§21.1](#211-generic-cross-era-war-system) and the full [§23.3](#233-56-civil-war--the-two-theater-combat-engine-multi-term-subsystem).)

*New in batch 3 (modern):*

7. **SCOTUS model: abstract `partyPreference` nudge vs. a named-Justice docket**. Shipped
   2.5.3 only counts conservative/liberal justices and nudges `partyPreference ±0.1`
   ([§11.6](#116-253-supreme-court--runphase_2_5_3_court-phaserunnersts3397)); 2.8.2 retires
   age-≥75 justices and back-fills by `judicial`. The modern design runs a **per-term named
   docket** with **Iron-Fist/Manipulative compel-vote + compel-retire**, **dynamic court size
   + court-packing (age-70)**, **64/60% confirmation with moderate-auto-confirm recovery**, and
   **rulings that deactivate laws** ([§22.7](#227-scotus-subsystem-253--282)). This is a
   replacement, not an extension.
8. **Cabinet persistence: wipe-on-election vs. retention/firing-precedent**. Shipped
   `runPhase_2_9_4_PresidentialGeneral` **resets the entire cabinet to empty** on a presidential
   change ([§15.2](#152-the-election-phases)). The modern design **retains up to 5** (CIA/FBI
   exempt) with per-officer tenure rules ([§9.3.6](#936-modern-cabinet-detail-sharpens-931-933-designed-not-built)),
   reinforcing the federalism **firing-precedent hold-over** divergence
   ([§21.4](#214-firing-precedent-gate-on-cabinet-changes)) across a second era — the wipe must
   be replaced with retention + precedent-gated replacement.

*New in batch 4 (`house-divided`, 1856-native):*

9. **★ Relocation cap: shipped `5` vs design's `4` — the clearest "forum DRIVES the build"
   evidence.** Mid-thread the engine **designer (`vcczar`) asked whether relocation was too easy**;
   the GM proposed a **cap of 4** non-alt-state relocations and **it went LIVE in the running
   playtest** ("You can ATTEMPT to move a TOTAL of FOUR pols. Alt-state moves don't count," `hd`
   POST 7062–7066, 7555). **The shipped build is still at `RELOCATION_ATTEMPTS_PER_TURN = 5`
   (`types.ts:247`)** — the browser engine has **not** caught up to a design change the forum
   already plays. This is a **concrete, dated shipped-vs-design divergence** and the single
   strongest proof that the canonical spec is the latest playtest, not a frozen rulebook
   ([§6.2.x](#62x-forum-design-layer-designed-not-built); `game-context.md` ★ note + #38). The
   shipped value also exceeds `RELOCATIONS_CAP`-adjacent intent; **direction = lower to 4.**
   *(Two further batch-4 design replacements are documented in full in their own sections rather
   than re-listed here: the **Civil-War two-theater engine** replacing the flat resolver
   ([§23.3](#233-56-civil-war--the-two-theater-combat-engine-multi-term-subsystem), folded into #6
   above) and the **per-era point-banking** model replacing the engine's bare era-flip
   ([§2.5](#25-era-boundaries--per-era-point-banking--the-new-era-boot-pipeline-designed-not-built)).)*

*New in batch 5 (`drums`, all-CPU):*

10. **Contingent-election rules don't exist** (POSTS 472-474). The GM **invented 5 rulesets
    mid-thread** when no candidate reached an EC majority and the rulebook had no answer; all
    5 variants favored Fillmore, so the GM picked momentum-based to keep play moving.
    **MASSIVE design gap — author rules BEFORE build.** Cross-ref [§24.2](#242-62-contingent-house-election--tied-chamber-inverse-control)
    (already documents the `hd` deviation: top-2 vs 12A top-3). The build needs (a) the
    contingent-election path itself + (b) a stated top-2-vs-top-3 cutoff + (c) the tied-chamber
    inverse-control rule. (`game-context.md` DH-6 + new DH-pointer.)

11. **Veto override = 2/3 in BOTH chambers, NOT 60%** (designer ruling, `drums` POSTS 2180-2187;
    60% was a bug, reverted). The shipped behavior must be verified — if a 60% threshold is
    coded anywhere, fix to **2/3 each chamber** as the canonical rule. (Cross-ref the
    [§25.6 legislation heuristic note](#256-legislation-voting-heuristic-nayayenay).)

12. **Midterm elections should use full meter+enthusiasm presidential rules — Tyler's 6-way
    test fix** (`drums` POSTS 299-304, confirmed CORRECT ruling). The shipped midterm code path
    needs verification: the same meter→election bonuses, faction enthusiasm, and party-pref
    terms used in `presGeneral` should drive midterm House/Senate contexts — not a stripped-down
    resolver. (Pairs with the meter→election mapping work in [§22.1](#221-the-named-meter-bank--numeric-debt--crisiscascade).)

13. **CPU AI architectural gaps** — the eight architectural CPU gaps documented at
    [§25.15](#2515-critical-missing-cpu-logic-architectural-gaps) (no reciprocity / no meter-
    guarding on event picks / static governor menu / cascading scandal sequencing hole / etc.)
    are **not single-line rule fixes** but require new data structures and supporting passes.
    Together they form the dominant CPU-AI replacement workstream.

> **GM-confirmed design holes from `house-divided` (DH-3..DH-11 — point to `game-context.md`, not
> re-documented).** Eleven balance/rules flags joined the gap log this batch (full text in
> `game-context.md` → design-holes): **DH-3** career-track pols can still run for President;
> **DH-4** "Extend Credit to all nations" is a near-auto-win foreign loop; **DH-5** flipping a
> Kingmaker also grabs his protégés ("insanely OP"); **DH-6** contingent-election top-2 vs top-3
> ([§24.2](#242-62-contingent-house-election--tied-chamber-inverse-control)); **DH-7** R/D
> convention-threshold asymmetry + an Iron-Fist PL can unilaterally lower it; **DH-8** CPU
> convention AI unstable + ballot-shift rule ambiguous; **DH-9** exec/gov-action ability stat
> inconsistent (Command vs Admin/Gov/Justice); **DH-10** blundered implementations still score
> "as if succeeded" unless a specific event overrides ([§14.1](#141-forum-design-layer-executive-actions-library-designed-not-built));
> **DH-11** apparent Dem 3rd-party structural bias + lobby cards too inelastic.

> **New design holes from `drums` (DH-12..DH-22 — point to `game-context.md`, not re-documented
> here).** Sixteen new design holes joined the gap log this batch (see `game-context.md` →
> design-holes): **white-peace rules MISSING** (no spec for negotiated peace); **bill ideology
> impacts not era-aware** (Mods on negative side of Women's Suffrage in 1916); **small/large-
> state action-impact multiplier uncodified**; **faithless-elector trigger undocumented + over-
> aggressive** (8-elector defection produced 232-232 tie); **reapportionment cap 435 effectively
> never triggers**; **convention interballot cap "impractical"** (house-ruled to be limited by
> Command); **dark-horse compromise candidates dodge resignation rolls** (loophole); **cascading
> scandal sequencing hole** (Hearst becomes President in days); **CPU cabinet 50/50 Admin-1
> reject + lobby-maximizing selection bug** (36% confirmation rate, designer-acknowledged);
> **contingent-election rules don't exist** (GM invented 5 rulesets mid-thread); **CPU has NO
> reciprocity / vote-trading**; **CPU meter-guarding missing on scripted events**; **CPU
> running-mate logic doesn't penalize ticket experience holes**; **CPU governor menu static + no
> industry-stack awareness**; **CPU primary attack always hits highest-PV**; **CPU compromise-
> candidate picker rigid highest→lowest** with no cross-faction coordination.

> **Confirmed shipped bugs (fixes, not features).** Defects surfaced by the forum threads are
> catalogued in `game-context.md` → "Confirmed shipped bugs" and owned by the roadmap as fixes.
> **From `fed`:** **BUG-1** era events never deactivate for non-1772/1856 start years (latent in
> `buildEraEventsForYear`, `phaseRunners.ts:2817`; an 1800-start wrongly loses the Louisiana
> Purchase); **BUG-2** `Chisholm v. Georgia` needs an "11th Amendment not ratified" gate (SCOTUS
> case content not yet seeded — relates to [§22.7](#227-scotus-subsystem-253--282)); **BUG-3** no
> fallback when there is no viable PM-General candidate (`GeneralInChief`, `types.ts:1121`).
> **GM-confirmed design holes from `modern`** (rules gaps, not crashes): **DH-1** a filibustered
> "MUST-pass" bill has **no rules remedy** (the GM improvised a 4-leader special-committee
> auto-pass with a per-day shutdown penalty clock; modern#post 640, 696, 711, 716); **DH-2** the
> modern era-event deck **fired 2008 cards in 2018** (possible scheduling bug — reported, not
> verified; reconcile with BUG-1 and the
> [§21.7](#217-era-event-scheduling-model-vs-corespine) scheduling fork; modern#post 2221). Not
> re-documented here.

---

## 20. Federalism era (designed, not built)

> **Entire section is designed, not built.** The `federalism` era exists in the engine only
> as **balance-tuning rows** (`MORTALITY_RULES`/`LEADERSHIP_RULES`/`ANYTIME_EVENTS_RULES`
> `eraConfig`, `TRAIT_*` splits) and as the **transition target** a 1772 game enters on
> Constitution ratification (`constitutionalConvention.ts:198`). **No `scenario1788` exists,
> no federalism faction roster, no federalism era-event spine, no federalism bill catalog,
> no federalism SCOTUS case set.** This section is the spec, sourced from the `fed` digest
> (`f55d3e21`, a 1788→1808 solo-with-AI playtest of Hamilton's Arch Federalists). It is
> parallel in depth to the 1772/1856 coverage in [§17](#17-era-systems). Cite `fed#post N`.

### 20.1 Scenario shape — a mid-government boot like 1856

The 1788 scenario **boots mid-government**, not from scratch like 1772 (`fed` 1, 14):

- **Pre-seated** President, VP, SCOTUS, and Congress (Washington administration). Like
  `scenario1856` (`scenario1856.ts:177-193`), it should start **past the draft** at a
  governance phase, with governors and courts already existing.
- **Open boot question** (`fed` 1, 14): the forum sheet pre-seated officeholders but the
  player **re-ran Congress leadership + cabinet at start anyway**. Canonical answer (pre-seat
  fully vs re-derive leadership/cabinet) is undecided — flagged to the human.
- **Default config quirk** (`fed` 1): the sheet defaults to a **Blue-controlled House**,
  even though the historical 1st House was pro-administration (Red/Federalist) — a balance,
  not a fidelity, choice.
- **Continuous-campaign alternative.** Federalism may *also* be reached by playing a 1772
  game forward through the Constitutional Convention rather than booting `scenario1788`
  directly. Either way, **points reset at the era boundary** (`fed` 518; see
  [§20.7](#207-era-transition-federalism--nationalism-1800)).

### 20.2 The 10-faction roster + per-era nickname relabel (fed 2, 24, 140, 184)

**10 factions, 5 per party**, with **period-specific identities** (contrast the generic
`factions1772.ts` proto-names):

| Party | # | Faction (1788) | Leader | Lean |
|---|---|---|---|---|
| **BLUE = Democratic-Republicans** (Jefferson) | B1 | Old Republicans | Jefferson | RW Pop |
| | B2 | Republicans | Madison | — |
| | B3 | Democratic-Republicans | John Milton | Moderate |
| | B4 | Fusion Democratic-Republicans | Gerry | business-friendly |
| | B5 | Democrats | Boudinot | Liberal wing |
| **RED = Federalists** (Hamilton) | R1 | States' Rights Federalists | Henry Laurens | Southern wing |
| | R2 | **Arch Federalists** (the player) | **Hamilton** | Center-Right |
| | R3 | Moderate Federalists | Washington | — |
| | R4 | Moderates | Franklin | — |
| | R5 | Rush Federalists | Benjamin Rush | — |

**Per-era nickname relabel mechanic (confirmed across federalism + gilded; dense in
federalism).** Faction names and nicknames **drift heavily, almost every turn**, tracking
real party evolution and gated by the **faction-leader's traits/ideology** + a **"names
table"** (`fed` 184: "the names table is hard on the eyes"). Observed relabels in-thread:

- R5 Rush → Benson → Knox → Moderate Federalists
- B1 Old Republicans → Anti-Federalists → Old Republicans
- B2 Republicans → Traditionalists
- B5 Democrats → Populists (LW)
- R1 States'-Rights → Arch-Federalists → Populists (RW) → Arch-Federalists

`Faction.nickname` exists (`types.ts:1297`) but nothing updates it. *(designed, not built —
add an authored **names table keyed per (party, era, ideology)** gated by leader traits, with
both algorithmic mix and a player-edit override.)*

### 20.3 The federalism era-event spine (fed 28, 64, 140, 194, 368, 475, 555, 702)

The era's spine is the **Hamilton-vs-Jefferson financial/constitutional fight + the wars of
the French Revolution**, in roughly historical order:

| Era event | What it does | Decider | Post |
|---|---|---|---|
| **Compromise of 1790** | Accept Assumption ⇄ move capital to the Potomac (DC) | President | 28 |
| **Hamiltonian financial program** (a cluster of foundational bills, [§20.4](#204-the-hamiltonian-financial-program-as-bills-fed-38-250)) | Assumption, Bank of the US, Mint, 10% tariff, Militia Act, bimetallism | Congress | 38 |
| **Pinckney's Treaty** (Spain) | resolve Spanish/Mississippi tension | Pres + cabinet | 28 |
| **Manufacturing Appears / Cotton Gin / Cotton Textile Boom** | activate industry lobbies; make slavery "much more sustainable" (seeds the nationalism crisis) | auto/Congress | 64, 194 |
| **State-by-state slavery abolition** | PA / NY / New England abolish slavery | per-state event | 28, 64, 292 |
| **Essex Junto** (New England secession scare) | **−2 to elections for 4 years outside New England/NY** | event | 140 |
| **Party-formation events** ([§20.5](#205-party-formation-as-an-era-event-1792-fed-140)) | "Federalists Formed", "Jeffersonian Republicans Formed" — *create the party names* | auto | 140 |
| **French Revolution → War with the UK ("War of 1795")** | Jefferson (CPU) joins France; **win → rights to Canada / state of Quebec; loss → battlefield defeat + maluses** | war system | 194, 389 |
| **Whiskey Rebellion** | domestic-stability crisis; Militia-Act/Crisis-Gov competence matters | Pres/cabinet | 368 |
| **Buttonwood Agreement** | Wall Street appears (finance lobby) | auto | 76 |
| **Fries's Rebellion** | second domestic rebellion | Pres/cabinet | 702 |
| **Barbary tribute → Barbary War** | naval war | war system | 475 |
| **Louisiana Purchase** | annexes Louisiana en bloc (fired "one term behind schedule") | era event | 702 |
| **Impressment → War of 1812** | fires as the era hands off to nationalism | war system | 702 |

Plus a swarm of **census-flavor events** stashing EV deltas ([§10.4.3](#1043-census-driven-ev-deltas);
`fed` 30) and **Latin-American independence** flavor events (Colombia/Ecuador/Venezuela/
Peru/Bolivia/Gran Colombia, `fed` 76).

### 20.4 The Hamiltonian financial program as bills (fed 38, 250)

The program is a cluster of **foundational/crisis bills** ([§21.6](#216-bill-typing--budget-gated-spending-cap)):

| Bill | Type | Effect | Note |
|---|---|---|---|
| **Assume Rev War debt** | Crisis, **free** | federalizes state debt | the keystone |
| **Bank of the United States** | Crisis | national bank; **US Bank President** office created | "the most controversial proposal" (`fed` 38); Bank Pres removable **only by a same-faction president** ([§21.4](#214-firing-precedent-gate-on-cabinet-changes)) |
| **US Mint** | Foundational | establishes coinage | — |
| **Set average tariff to 10%** | Crisis | sets the **national tariff integer** | **change-cadence rule**: set 1789, **"1796 first year we can change it"** (`fed` 250) |
| **Militia Act** | Crisis | grants Pres power to **call up state militia** | enables suppressing the Whiskey/Fries rebellions |
| **Bimetallic currency** | — | US dollar = gold + silver bullion, intended to "incur some inflation to aid debt repayment" | **same bill as the gilded bimetallism axis** (corroborated across 2 eras) |

> **Tariff is a national integer set by legislation, with a change-cadence** (corroborated
> across federalism + gilded). The integer is **set once, then locked until a "first new
> tariff year"** before it can be changed again (`fed` 250; gilded sets it by bill but
> didn't show the cadence). *(designed, not built — add `game.tariffPercent: number` +
> `game.tariffNextChangeableYear`.)*

### 20.5 Party-formation as an era event (~1792) (fed 140)

A federalism-specific structural rule with **no engine analog**: **party identity is itself
event-driven**. The events "Federalists Formed" and "Jeffersonian Republicans Formed" fire
**~1792** and *create the party names*. Before they fire, the two parties are **unnamed
proto-blocs** (BLUE/RED exist as the engine's two-party spine, but carry no era name). This
couples to the nickname table ([§20.2](#202-the-10-faction-roster--per-era-nickname-relabel-fed-2-24-140-184))
and gates anything that displays a party name. *(designed, not built — add a
`party.formedYear` / `party.eraName` set by a party-formation era event; treat a party as
unnamed before it fires.)*

### 20.6 The federalism draft-ideology profile — Mod/Cons-weighted (fed 136, 330)

Federalism is a **Moderate/Conservative-dominated era** (confirmed across federalism +
gilded as the general "per-era ideology drafting profile" rule, gap #4):

- GM: "those ideos [LW Pop/Prog/Lib] **don't really matter this era**" (`fed` 136).
- The Senate is "**all Mod or Cons except 2 Trad and 1 Prog**" (`fed` 330); enthusiasm
  meters peg toward Mod.
- Marquee rookies (Jackson, JQA, Clay, Monroe, Burr, Gallatin) all enter via **normal draft
  classes** in this window (`fed` 118, 510, 638) — confirming the dataset's
  `draftYear ≈ birthYear + 25` rule (CLAUDE.md) yields era-correct rookies.

Contrast the shipped per-faction draft bias in `pickBestForFaction`
([§4.2](#42-picking--pickbestforfaction-phaserunnersts33)), which uses static personality
buckets, not a per-era ideology mix. *(designed, not built — add a per-(faction, era) draft
ideology profile, or an era-boundary drift rule; the 1856 `eligibleIdeologies` is the seed
of this for one era.)*

### 20.7 Era transition (federalism → nationalism, ~1800)

Observed live in-thread (`fed` 11, 485, 518):

- **Points reset at the era boundary** (`fed` 518: "Since it's a new era, points reset").
- **A new card pool + new bill catalog appears** (`fed` 485) — Bureau of Indian Affairs,
  Smithsonian, the 36°30′ slavery line, Marine Hospital Service, compensated emancipation,
  colonization/Liberia all appear **only at/after the boundary** (`fed` 475, 485, 560, 702).
- **Era-locked content** is the *intent* but **not built** (`fed` 521-535) — see BUG-1 in
  `game-context.md`: events "never deactivate; they only deactivate if your *start date* is
  past the era", so an 1800-start game wrongly keeps/loses the wrong events.

### 20.8 Federalism SCOTUS case set (fed 36, 80, 145, 206, 377, 484, 716)

The 2.5.3 phase is built (`phaseRunners.ts:3397`) but seeds **no substantive cases**. The
federalism case set is: **Marbury v. Madison, Ware v. Hylton, Martin v. Hunter's Lessee,
Calder v. Bull**, plus **Chisholm v. Georgia** (which **must be gated on "11th Amendment not
ratified"** — BUG-2). Justices **ideology-shift after 10y tenure** and face **compelled
resignation after ~12y / age 75** (`fed` 56). *(designed, not built — add a federalism
SCOTUS case data file with per-case gates.)*

---

## 21. Cross-era mechanics revealed by batch 2 (designed, not built)

Mechanics the batch-2 threads show are **generic across eras**, not era-specific. Each is
designed-not-built and cross-referenced from the per-system sections above.

### 21.1 Generic cross-era war system

> **Designed, not built.** Confirmed across federalism + 1772 solo. The shipped engine has
> **two** war paths and **neither** matches: the rich Revolutionary War
> ([§17.4](#174-revolutionary-war)) is **1772-scoped**, and the generic resolver
> (`runPhase_2_7_2_Military`, `phaseRunners.ts:3593-3627`) is a **flat**
> `milPower×10 + d100 > enemyPower×10 + 50`, war ends at `warScore ±50`. The forum runs **one
> generic war system for every war** — War of 1795, Barbary War, War of 1812 (`fed` 9; `1772s`
> confirms the *same* battle-card breakdown for the Rev War).

**Per half-term: 1–N battles.** Each battle resolves on an **additive Chance-of-Success**
(`fed` 222, 312, 389, 492, 573; the battle-card itemization is corroborated verbatim by
`1772s` 22, 48, 60):

```
ChanceOfSuccess% = base + commanderMil + difficultyMod + milPrepMod − 25
  base          = 6 (navy) | 8 (army)
  commanderMil  = the commanding officer's military stat (scaled)
  difficultyMod  = Easy (+) | Moderate (0) | Hard (−)   // 1772 card: "Moderate battle (−10)"
  milPrepMod    = from the Military Preparedness meter
roll d100 ≤ ChanceOfSuccess ⇒ battle won
```

> **Worked battle-card** (`1772s` 22, the player's itemized card):
> `Moderate battle (−10) + Planning (6) + Commodore Artemas Ward (30) + Meters (0) +
> Military Benchmarks (10) = Probability of victory 36% → FIGHT! rolled 94/36 → DEFEAT.`
> This is the **battle-card additive-odds** mechanic: difficulty + planning + commander +
> meters + benchmarks, summed to a single % to-hit. (The card's *visual shading* is UX, not
> a rule — see `game-context.md` A4.)

**End-of-phase war-resolution roll** (`fed` 86): separate from individual battles, the war
checks for an overall outcome via **`warScore + momentum → X% chance of victory/defeat`**,
modulated by a **war multiplier (`×2`) that escalates the longer the war runs**. 1772 has the
sibling loop: **war-weariness roll**, **momentum adjusts the war score**, and a **"check if
war over" roll** each phase (`1772s` 60).

**Side effects (the confirmation cascade, `fed` 87, 222, 494):** a **defeated commander gains
`Incompetent` and is fired**; replacements are scarce (the military track hasn't churned
enough officers), forcing **Senate-confirmation drama** for new generals/admirals. 1772 adds:
the top officer is fired **if Iron-Fisted**, and losing the majority of a phase's battles
docks the general (`Incompetent`, `−Military`). Outcome feeds meters (mil prep, dom stab,
econ, budget, party pref) and **grants/denies territory** (Canada/Quebec on a War-of-1795 win).

*(designed, not built — generalize to a `War` model usable in any era: the additive
success-chance formula, the warscore/momentum/×2 resolution, and the confirmation-cascade
side effects. Fold the 1772 Rev-War loop into it as one configured instance.)*

### 21.2 Per-state presidential-election method

> **Designed, not built. Diverges from shipped `calcStateVote`.** Shipped general elections
> resolve by **popular vote in every state** (`presGeneral`, `phaseRunners.ts:3752`,
> `calcStateVote` [§15.1](#151-calcstatevote--the-core-resolver-phaserunnersts3685)). The
> federalism design has a **per-state electoral-college selection mode** (`fed` 194, 220, 255,
> 258, 306-307, 373).

Each state chooses presidential electors by one of two methods:

| Method | How the state's EV resolve | Who can flip it |
|---|---|---|
| **Popular vote** | as today: `calcStateVote('presGeneral')`, winner-take-all the EV | — |
| **Legislature-chosen** | the state's **legislature majority** (its seated senators/reps by party) awards the EV; the popular tally is **ignored** | per-state event, or a national amendment |

- **States that start legislature-chosen (1796 snapshot, `fed` 220, 255, 258):** **CT, GA,
  MA, NJ, NY, RI, SC** chose electors by legislature, not popular vote — **decisive in the
  election** that year.
- **Per-state flip by era event:** e.g. "Popular Vote in KY and NC" (`fed` 194) switches
  *those two states* to popular vote.
- **National flip by amendment:** the **"National Suffrage for White Male Property Owners"**
  amendment (`fed` 306-307, 373) sets **"Popular vote is now active in all states"** at once —
  an amendment effect ([§21.3](#213-amendments-as-durable-separately-ratified-state)).

*(designed, not built — add `State.electionMethod: 'popular' | 'legislature'`; resolve
legislature-method EV from the state's seated-legislature party majority in
`runPhase_2_9_4_PresidentialGeneral`; flip per-state by event and globally by amendment.
Distinct from the [§11.4](#114-state-level-policy-flags-designed-not-built) state-policy
flags — this is the EC selection mode.)*

### 21.3 Amendments as durable, separately-ratified state

> **Designed, not built. Confirmed across federalism + gilded.** `constitutionalConvention.ts`
> covers only the **initial** Constitution's binding articles ([§17.3](#173-constitutional-convention-constitutionalconventionts));
> post-founding amendments are unmodeled. (Sharpens batch-1 [§14.2](#142-forum-design-layer-constitutional-amendments-durable-state-designed-not-built).)

**Ratification flow** (`fed` 38, 76, 201, 214, 297, 306, 373; **modern** 15-29, 938, 944,
1278, 1597):

1. An amendment **passes Congress** (as a bill of an amendment type). **Modern pass gate:
   2/3 of the House** (382 of 572, modern#post 1597) + a Senate supermajority.
2. It then goes **to the states at the next governance phase** for ratification.
3. Ratification threshold is **era-dependent** (open question — per-era field or per-amendment
   field):
   - **federalism / gilded**: by **state legislatures**, usually **unanimous / near-unanimous**;
     a **"2/3 of states to ratify"** amendment raises its own bar; **"Christianity as Official
     Religion" was rejected 9-7** (`fed` 214) — amendments **can fail** ratification.
   - **modern**: by **GOVERNORS** (each state's governor votes), at a **fixed state count =
     40 of 53** (modern#post 29 Two-Term-Limit fails 39/40; post 1278 Voting-Age-18 fails 31).
4. On ratification, the amendment becomes a **durable rule-changing flag** that persists
   until repealed by another amendment. A **grandfather clause** can exempt the sitting
   officeholder (modern#post 15: the Two-Term-Limit "would not apply to the current Pres").
   **NB:** a presidential **two-term limit does not exist** in the modern timeline until
   ratified — it was still being debated in the campaign's 2008 (`historical-context.md` §10).

**Observed durable effects:**

| Amendment | Durable effect |
|---|---|
| 11th | (gates `Chisholm v. Georgia` — BUG-2) |
| 12th | enables the **6-year presidential-loss retirement malus** ([§21.x via gap #37]); pre-12th, losers don't suffer it (`fed` 111, 331) |
| Six-Year-Term Presidency | presidential term **4 → 6 years** (later **repealed**, `fed` 176) |
| "National Suffrage" | **popular vote active in all states** ([§21.2](#212-per-state-presidential-election-method)) |
| VP-vacancy fill | president may **nominate a VP** when the slot is empty (`fed`/gilded 276-277) |

> **No VP-replacement amendment exists yet in either timeline** (`fed` 468, 746): a **dead VP
> leaves the office vacant** until the VP-vacancy-fill amendment is ratified. Engine has no
> VP-succession path regardless.

*(designed, not built — add `game.amendments: { id; passedYear; data? }[]`; a cross-state
ratification vote at the gov phase; an amendment bill type; and effect-binding checked at the
relevant phase boundaries.)*

### 21.4 Firing-precedent gate on cabinet changes

> **Designed, not built (federalism, `fed` 41, 119, 131, 177, 354, 392, 454, 547).** The
> shipped engine fills empty cabinet seats ([§9.1](#91-231-cabinet--runphase_2_3_1_cabinet-phaserunnersts2158))
> and **wipes the whole cabinet on a presidential change** (`runPhase_2_9_4_PresidentialGeneral`
> "resets the entire cabinet to empty", [§15.2](#152-the-election-phases)). The federalism
> design instead makes cabinets **sticky hold-overs** until a precedent is set.

- A president **cannot freely fire/replace** cabinet members until a **firing precedent is
  set** — a **multi-step process** tied to **card configuration** + the exec action **"Set
  Precedence for Firing Cabinet Members."**
- Until then, cabinets **hold over across administrations, even cross-party** (Jefferson keeps
  Hamilton; Howard keeps Blue ministers). Replacement happens **only** via
  **death / retirement / resignation** ("you can't fire me, I quit", `fed` 177) or
  **wrong-party auto-rotation of the PM General** (`fed` 119).
- **The US Bank President can be removed only by a same-faction president** (`fed` 454, 547).

This **contradicts the shipped cabinet wipe on election** — once firing-precedent is
modeled, the wipe must be replaced with hold-over + precedent-gated replacement. *(designed,
not built — add `game.firingPrecedentSet: boolean`; gate cabinet replacement on it; replace
the on-election cabinet wipe with hold-over; same-faction guard on Bank-President removal.)*

### 21.5 Bill-driven statehood + auto-generated officials

> **Designed, not built (federalism, `fed` 81, 158, 168, 302, 379, 386, 560, 571, 718).**
> Shipped `admitState` ([§17.6](#176-territories-territoriests)) is invoked only from 1772
> era-event `postEffects`; `expansionStates.ts` is a **static registry** with no bill-driven
> path. (Extends gilded #33 with the bill-driven route.)

- **Statehood bills** admit land: **VT, KY, OH, TN, AL** as states; **MS, IN, MI, IL, LA** as
  **Territories** first (organized vs unorganized status precedes statehood).
- **Annexation by era event / war:** **Louisiana Purchase** (era event); **rights to
  Canada/Quebec** on **winning the War of 1795**.
- **Auto-generate officials for sparse new states** (`fed` 168, 386, 571: "pols had to be
  generated"): when a freshly admitted state has too few politicians to fill its
  Gov/Senate/House seats, the engine must **generate filler officials**.

*(designed, not built — wire statehood/territory bills → `admitState`; add event/war-driven
annexation; **auto-generate politicians** for under-populated new states.)*

### 21.6 Bill typing + budget-gated spending cap

> **Designed, not built. Confirmed across federalism + 1772 solo.** `Legislation`
> ([§12](#12-legislation-26x)) carries `committee/effects/status` but **no `type` tag** (grep:
> none) and there is **no budget-gated bill cap**.

- **Bills are typed** — **Foundational / Spending / Crisis** (`1772s` B4; `fed` 159, 561,
  566, 703):
  - **Foundational** — Create Dept. of State/War/Treasury, Bank of N. America / US: special
    handling (`1772s` 18 notes a half-point penalty the player chose to drop).
  - **Spending** — capped by a **per-turn spending budget** (below).
  - **Crisis** — **bypasses the spending cap** entirely ("crisis can pass with spending
    freely", `fed` 159; see [§12.7](#127-forum-design-layer-crisis-bill-tag-designed-not-built)).
- **Budget-gated spending cap** (`1772s` 46, 57; `fed` 159, 561, 566, 703): a non-crisis
  spending bill can **pass the floor and still be "BLOCKED DUE TO BUDGET."** At
  **Overspending only 3 spending bills pass** (`1772s` 46), and **ordering matters** when
  over-subscribed. The cap reads off the **numeric national budget/surplus**
  ([§13.3.3](#1333-national-surplus-integer)), *not* the ordinal `revenue` meter (`fed` 703:
  an economy gain "didn't go through because budget too in the hole").
- **"Free pick-up" legislation by a skilled Treasurer** (`1772s` 57; `fed` 38, 57): a
  high-skill Treasury Sec can propose **one free extra bill** — **double points to proposer +
  Treasurer; −50 to the Treasurer if not picked up** (the broader "cabinet suggests / free
  pickup" seeding).

*(designed, not built — add `Bill.type: 'foundational' | 'spending' | 'crisis' | …`; a
numeric **per-turn spending budget** that gates non-crisis spending bills at the floor; the
crisis-bypass; and a cabinet free-proposal slot.)*

### 21.7 Era-event scheduling model vs. `coreSpine`

> **Designed, not built — and the single biggest 1772 mechanical divergence** (`1772s` B1,
> posts 9, 10, 18, 37). The shipped 1772 engine and the forum **schedule era events
> differently and therefore produce different event sequences.**

| | Shipped engine | Forum design |
|---|---|---|
| Model | **Precondition graph**: `GraphNode`s with a `Predicate` gate; `coreSpine` nodes **fire regardless of the probabilistic roll**; non-core nodes fire on `fireChance 0.85` with `historyPressure 0.8` | **Historical-year sort**: all events sorted by their historical year, then **rolled in order** |
| 1772 first half-term | spine openers fire by precondition | the **5 historical 1772 events fire at 100%**, ignoring the era cap |
| Other half-terms | one event/turn via `selectEraGraphNode` | **roll each event (`roll ≤ %-to-fire`)** in historical order, **up to a per-era cap** |
| Underfill | n/a — graph just advances | **spill into another GenEvo (anytime-events) round** to hit a required count (`1772s` 18: "Ten Events must happen… there's a new round of GenEvos") |
| Code | `eraEvents1772.ts:23` (`coreSpine` "fire regardless of the probabilistic roll"); `selectEraGraphNode` (`eraGraph.ts:107`) | — |

The two models are **not equivalent**: the graph guarantees a *causal* spine (Gaspee →
Committees → Tea Act …) while the forum guarantees a *historical-cadence* spine with
probabilistic minor events and a hard per-half-term cap + spill. Related GM rulings:
**"roll for *all* events; any that hit & are eligible occur"** with **no fixed draw count**
(`@MrPotatoTed`, `fed` 16), a **per-era cap (~10)** house variant (`fed` 696-699), and
**events dated before game start are treated as already-happened** (`fed` 526-527).

*(designed, not built — decision for the human: adopt the historical-year-sorted,
per-half-term-capped, roll-≤-%-to-fire-with-spill model, or keep the `coreSpine` precondition
graph. They are a genuine fork, not additive.)*

### 21.8 Named-ordinal meter model + ±3 swing cap + war-score meter

> **Designed, not built (`1772s` B8, posts 9, 18, 37, 57-59).** Shipped `NationalMeters`
> ([§11.1](#111-251-lingering-meters--runphase_2_5_1_lingering-phaserunnersts3260)) are **7
> numeric meters** (`revenue, economic, military, domestic, honest, quality, planet`,
> `types.ts:1399`). The forum tracks **named ordinal meters with labeled steps**.

- **Named ordinal labels** (`1772s` B8): Revenue/Budget (…**Overspending / Very
  Overspending**), Economic Stability (**Sound / Stagnation / Panic**), Domestic Stability
  (…**Mass Protests**), Military Preparedness (…**Moderately Unprepared**), **UK Relations**
  (…**Enemies**), and a **War Progress / War Score** meter.
- **±3 swing cap per phase** (GM ruling, `1772s` 58): **any single meter may move at most ±3
  in one phase** — a clamp the numeric model does not enforce.
- **War-score meter** (`1772s` 60): the war's progress is tracked as a named ordinal meter,
  feeding the war-resolution roll ([§21.1](#211-generic-cross-era-war-system)) — distinct from
  the shipped `War.warScore` integer.
- **Per-power relations as named ordinals** ([§13.3.1](#1331-per-power-relations-meters--an-era-dependent-power-roster)):
  UK Relations specifically confirmed here.

*(designed, not built — decision for the human: keep 7 numeric meters, or move to named
ordinal meters with labeled steps + a ±3-per-phase swing cap + a first-class war-score meter.
Balance proposal `1772s` C1 — enthusiasm as a graduated multiplier with a 3rd-party-at-Neutral
rule rather than a flat election bonus — is a related human call, logged in `game-context.md`
#18.)*

---

## 22. Modern era systems (designed, not built)

> **Entire section is designed, not built — and it is the most mechanically mature designed
> surface in the knowledge base.** The `modern` enum exists only as **balance-tuning rows**
> (`MORTALITY_RULES`/`LEADERSHIP_RULES`/`ANYTIME_EVENTS_RULES` `eraConfig`, `TRAIT_*` splits)
> and as a few thin shipped stubs (the `partyPreference` court nudge, the 2.9.3 no-op,
> `calcStateVote`'s `enthusiasm`/`partyPreference` terms). **No `scenarioModern` exists; no
> modern faction roster; no meter bank, primary loop, convention loop, SCOTUS docket, or
> 53-state roster is built.** This section is the spec, sourced from `3a9ac985` (the
> 1948→2020 multiplayer thread). Cite `modern#post N`. The modern era is the campaign's
> **end-state**: it has the **full primaries → convention → general** pipeline, a concrete
> **named meter bank**, a formalized **enthusiasm/Party-Pref engine**, and a **SCOTUS docket**
> — almost **entirely unbuilt**, and the highest-leverage build target.
>
> **Alt-history framing.** This era plays the game's own **"Era of Terror" → "Era of
> Populism"** (not "the 2000s"); the clock runs **~10 years behind real tech**; there are
> **53 states**; and BLUE = Democrats = left / RED = Republicans = right with **no polarity
> caveat** (the one era where this holds). Mechanics here are gated by the **`modern` era enum**,
> not literal years; the year predicates only set phase cadence. See
> [§22.11](#2211-era-clock--era-enum-alt-history) and `historical-context.md` §10.

### 22.1 The named meter bank + numeric debt + crisis/cascade

> **Sharpens [§11.1](#111-251-lingering-meters--runphase_2_5_1_lingering-phaserunnersts3260)
> and the batch-2 [§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter).** The
> shipped `NationalMeters` are 7 numeric fields (`types.ts:1399`); `modern` supplies the
> **concrete banded-text bank** and its dynamics. Cross-ref `game-context.md` #50, #18.

**The concrete bank** (modern#post 12, 114, 618, 752, 878, 944, 959, 1061, 1238). Each meter
is a **banded-text ladder** nudged **±1** by phases, cabinet officers, "Lingering", "Revision
to Mean", "Volatility", and legislation:

| Meter | Ladder (bad → good shown) | Maps to shipped |
|---|---|---|
| **Revenue/Budget** | … Very Overspending → Overspending → Balanced → Underbudget … | `meters.revenue` |
| **Economic Stability** | Panic → Stagnation → Sound → Booming | `meters.economic` |
| **Military Preparedness** | … → Totally Prepared | `meters.military` |
| **Domestic Stability** | … Mass Protests → Periodic Protests → Stable | `meters.domestic` |
| **Honest Gov't** | (corruption ladder) … → Free of Corruption | `meters.honest` |
| **Quality of Life** | … → Good → Great | `meters.quality` |
| **Planet's Health** | … Poor → Near Crisis → Crisis | `meters.planet` |
| **Party Preference** | Blue ↔ Red (master partisan thumb-on-scale) | `game.partyPreference` |
| **Per-ideology enthusiasm** (×7) | each ideology's position on a Blue↔Red track ("Red +2", "lean Blue") | `game.enthusiasm[ideo][party]` |
| **Per-power relations** (×8) | Neutral → Friendly → Nearly Allies → Allies | `game.diplomacy` (era-keyed) |

- **8 tracked powers** (modern): **UK, France, Spain, Germany, Russia, China, Japan, Israel**
  — the era-dependent roster of [§13.3.1](#1331-per-power-relations-meters--an-era-dependent-power-roster)
  at its widest (federalism 5, gilded 6, modern 8; +Israel/Japan).

**Numeric national debt** (distinct from the ordinal Revenue/Budget meter, modern#post 99,
1537, 2042): a **signed integer** tracked alongside the meter — "National Debt now at −5"
(post 99), "deficit of 6 / −7" (post 1537), reduced to −3 by a credit action (post 2042).
Loans push it negative; spending bills are gated against it
([§21.6](#216-bill-typing--budget-gated-spending-cap)). Corroborates the batch-2 "national
surplus integer" ([§13.3.3](#1333-national-surplus-integer)) across a third era.

**Crisis behavior** (modern#post 721, 1537, 2230):

1. Dropping a meter into a **bad tier begins a named Crisis** with knock-ons (EconStab→Panic
   ⇒ DomStab −1 + Periodic Protests, post 721). The crisis **ends** when the meter recovers
   ("Stable- Crisis ends", post 2230).
2. Meters **cascade**: one meter's tier **caps or forces** another (DomStab level forces QoL
   down; Rev/Bud level caps EconStab gains, post 1537).
3. **Top-of-ladder hard rules**: **Honest Gov't maxed ⇒ deactivates all Political Machines +
   Gerrymandering** and **blocks creating new ones** (post 1238, 1554, 1962), and **blocks all
   voter-suppression governor actions** ([§11.4 modern sharpening](#114-state-level-policy-flags-designed-not-built)).
   (The ambiguity "require zero machines vs prevent new ones" was reworded to *"Cannot
   create …"* across all era playtests, post 1246-1262 — see `game-context.md` DH note.)

**Meter → election mapping** (the canonical "State of the Meters" table, published before
**every** election; modern#post 114, 424, 752, 1061, 1742, 2061). Each meter contributes
additively into the Party-Pref calc and per-ideology enthusiasm:

| Meter (state) | Election effect |
|---|---|
| Rev/Budget (good) | +1 incumbent party in Party-Pref + Moderates enthusiasm |
| **Economic Stability (bad)** | **−3 to the incumbent party in *all* elections** |
| Domestic Stability (bad) | incumbent party −1 |
| Quality of Life (good) | RW-Pop +1, Moderate +1 |
| Planet's Health (good) | Moderate +1, Progressive −1 |
| **Honest Gov't (good)** | **Controversial pols −2 extra** (decisive — sank vcczar's own pol's 3rd-term bid, post 1754) |
| Party Preference | direct numeric advantage to the leading party |
| per-ideology enthusiasm | per-ideology additive bonus into `calcStateVote` |

> **Worked meter→election (the 2008 lesson).** Incumbent Cuomo swept all 53 states in 2004,
> then **crashed the economy** (EconStab→Panic). In 2008 the −3-incumbent EconStab penalty
> plus DomStab/QoL knock-ons flipped the map: **Cochran (R) 563 / Cuomo 143** (post 248). The
> meter bank *is* the election engine's memory of a presidency.

*(designed, not built — replace the 7 numeric meters with banded-text ladders; add the
numeric debt integer; add crisis entry/exit by tier + cascade rules + top-of-ladder effects;
add `metersToElectionBonus(meters)` from the canonical table. Couples to
[§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy).)*

### 22.2 Faction-enthusiasm / Party-Preference election engine + the Score economy

> **NEW formalized engine (designed, not built).** The shipped `Enthusiasm` table and
> `partyPreference` exist (`calcStateVote` reads them, [§15.1](#151-calcstatevote--the-core-resolver-phaserunnersts3685)),
> but the **driving algorithm is not in code**. `modern` supplies it. Cross-ref
> `game-context.md` #51.

**The 4-part enthusiasm reallocation** runs **after legislation scoring** each session
(modern#post 96, 722, 945, 2039). Using the **dominant party** (the one that just gained
more) vs the **opposition**:

| Which faction | Enthusiasm move |
|---|---|
| Dominant party's faction that gained **most** points | its ideology cards **+1 toward the dominant party** |
| Dominant party's faction that gained **least** | **−1 away** from the dominant party |
| Opposition faction that gained **most** | **+1 toward the dominant party** ("needs taken care of") |
| Opposition faction that scored **least** | **+2 toward the opposition** ("furious at the incumbent") |

**The Score economy** (modern#post 134, 454, 768, 1080, 1436) drives the reshuffle and the
elections:

- A running **Score** per faction (and per party) is published as a "Nickname / Score /
  Leader" scoreboard, grouped Blue vs Red. Score accrues from **bill scoring (all cards,
  incl. failed bills), exec actions, governor actions, convention/primary results, industry
  leadership, and era events**.
- **Lowest-faction team penalty**: a team's **lowest-scoring faction penalizes its
  teammates** — it loses **25% of its own points**, the others **10%** (post 768, 1436).
- **End-of-era awards** (paid at each era boundary, post 1080): most era points **+5**; most
  from the *other* party **+3**; the winning party's factions **+3**; etc. (Points **reset**
  at the era boundary — corroborates `fed` 518.)

**How a modern election resolves** (contrast the shipped `calcStateVote`): the engine
publishes the meter bank → applies the **meter→election table** ([§22.1](#221-the-named-meter-bank--numeric-debt--crisiscascade))
and the 4-part enthusiasm reshuffle → resolves the convention/primary
([§22.3](#223-presidential-primary-subsystem-291)–[§22.6](#226-the-cpu-delegate-engine-convention--primary-apportionment))
→ runs **State of the Meters → per-state EV** with tie-breakers and faithless electors
([§22.5](#225-general-election-library-294)). The **shipped `calcStateVote`** already folds
`enthusiasm × 2` + `partyPreference × 5` + `state.bias × 5` per candidate
([§15.1](#151-calcstatevote--the-core-resolver-phaserunnersts3685)); the **federalism
per-state EC method** ([§21.2](#212-per-state-presidential-election-method)) is an *orthogonal*
resolution mode the modern thread does not exercise (modern resolves every state by popular
vote then awards EV winner-take-all, with tie-breaks). The new work is the **Score economy +
4-part reshuffle + meter→bonus map** feeding those existing per-candidate terms.

*(designed, not built — implement the 4-part reshuffle + a faction `Score` field + era-end
awards + the lowest-faction team penalty; wire Score into the meter→election map.)*

### 22.3 Presidential primary subsystem (2.9.1)

> **The biggest NEW subsystem; designed, not built.** Phase 2.9.1's `presPrimary`
> `ElectionContext` exists (`types.ts:697`) and the shipped 2.9.1 just scores `pvCache +
> command×5 + traitBonus` to pick one nominee ([§15.2](#152-the-election-phases)). `modern`
> runs a full multi-stage primary. Runs in presidential years (era-gated to `modern`).
> Cross-ref `game-context.md` #47. (modern#post 340-366, 980-1062, 1646-1704.)

**Candidates** (per faction): up to **1 Major** (the **faction leader** OR a **Celebrity with
Command**) + **1 Minor** (anyone with **Command**). Each candidate picks **3 focus states**.

- **Blocking**: a **running incumbent cannot be primaried**; an **Iron-Fist + Leadership
  president/PL blocks intra-party challengers** *unless* the challenger's **faction ideology
  leans to the other party** (post 1663 — Cochran renominated unopposed; Jim Justice blocked).
- **Candidate Strength** is scored numerically (post 348, 1664); a **front-runner** emerges.

**Focus-state roll table by charisma trait** (post 980, 989, 1646) — each focus state rolls
d6 for a +1 / −1 swing, the bands set by trait:

| Trait | + on | − on |
|---|---|---|
| (base) | 5-6 | 1-2 |
| Charisma | 4-6 | 1-2 |
| Likable | 5-6 | (no negative) |
| Uncharismatic | (no positive) | 1-2 |
| Unlikable | 5-6 | 1-3 |
| Orator | adds to the + modifier | — |
| Debater (sole in the primary) | 5-6 for +1 **nationally** | — |

**Per-Primary-Group loop.** States are grouped into **Primary Groups 1..N**, the grouping set
by governor **State Primary Placement (Group N)** actions ([§11.4 modern sharpening](#114-state-level-policy-flags-designed-not-built)).
For each group, in order:

1. **Primary Debate** — momentum **±1**; the **front-runner is penalized −2 for losing**.
2. **Scandal Rolls** — **1d6 = scandal**; **Integrity** is immune; **Propagandist / LW-RW
   Media** can spin or diminish it.
3. **Broke Candidate Check** — forces a **drop-out**; applies **only to candidates not
   currently 1st or 2nd** (the GM corrected a misapplication, post 1008).
4. **Primary Actions** (each candidate picks one):
   - **Embrace [State] Issue** — 25%/50% +1; **risks an ideology shift + Flip-Flopper** if the
     issue is non-adjacent.
   - **Campaign Focus** — die ±; **Celebrity +2**; can backfire on a 1.
   - **Give a Major Speech** — once per primary.
   - **Attack [opponent]** — −1 opponent momentum, or backfire.
   - **Presidential Promise** — offer a plank / cabinet seat for an endorsement;
     **rejectable** (recipient needs matching expertise for the offered seat).
   - **Withdraw + endorse / release / hold delegates.**

**Delegates** accumulate per group, mixing **winner-take-all** (DC: Kennedy all 5) and
**proportional** (CA: Kirk 178 / Blair 59) (post 1701). **Drop-outs endorse + transfer
delegates** (post 362). Trailing candidates who stay in take **penalty rolls**
(Disharmonious / Unlikable / −1 future Pres runs, post 1694). The delegate totals and
majority threshold come from the **CPU delegate engine**
([§22.6](#226-the-cpu-delegate-engine-convention--primary-apportionment)).

*(designed, not built — a full primary subsystem: candidate eligibility + Iron-Fist blocking,
the charisma focus-state table, a Strength score, the per-group debate/scandal/broke/action
loop, delegate accumulation + transfer, and primary-group assignment from governor actions.)*

### 22.4 Third-party-challenge trigger (2.9.3)

> **NEW rule that fills the shipped 2.9.3 no-op** ([§15.2](#152-the-election-phases): the
> shipped phase always logs "no third-party challenge"). Designed, not built.
> Cross-ref `game-context.md` #48. (modern#post 400-410, 2116.)

A third-party ticket spawns **at the general** when **both** hold:

1. **Party Preference sits in the middle 3 boxes** of the Blue↔Red ladder, **and**
2. an **ideology is "discontented with both parties"** (its enthusiasm sits at **Neutral**).

Resolution:

- The **discontented faction of the incumbent's party** runs third-party (randomize if
  several qualify).
- **President's-own-ideology carve-out**: if the discontented ideology is the **president's
  own**, then the **lowest-scoring faction of his party** runs third-party even if it is
  otherwise happy.
- A **Celebrity** third-party candidate appears on the **ballot nationwide** (vs a normal
  third-party candidate's narrower reach). (Lower-stakes third-party runs also appear in the
  campaign's backstory — e.g. Arne Carlson's 1984 run.)

*(designed, not built — add the party-pref-band + ideology-at-Neutral trigger check at the
general; spawn an independent ticket from the rule-selected faction; nationwide ballot for a
Celebrity.)*

### 22.5 General-election library (2.9.4)

> **Sharpens the batch-1 convention/general library ([§15.3.6](#1536-general-election-action-library-designed-not-built)–[§15.3.9](#1539-faithless-electors))
> across a fourth era and adds modern-only pieces.** Designed, not built. Cross-ref
> `game-context.md` #16, #17, #19. (modern#post 400-438, 1726-1749.)

**General-Election Action library** (usually **2 rounds**, post 412, 1727):

| Action | Effect |
|---|---|
| Give a Speech | Orator double-roll (state + party pref); **Incoherent** risks −1 |
| **Incumbent Using Power of Office** | 5-6 → **+1 Party Pref** (repeatedly decisive, post 1068) |
| Help from the Media | LW/RW Media card: 6 → ally enthusiasm, 1 → −1 party pref |
| **Send VP to Shore Up Support** | region-targeted, trait-branched (Likable/Harmonious/Unlikable/Disharmonious/Provincial/Cosmopolitan); a **Delegator** president can send the VP **anywhere** |
| President Focuses on a Region | region-targeted speech |

- **3 Presidential Debates + 1 VP Debate** (post 1727): **Debater +2**, Leadership/Charisma
  +1, Orator/Manipulative/Egghead rolls; the **winner moves Party Pref ±1**. **Per-debate
  scandal rolls**. The **incumbent may kill the debates** (1-2 penalty roll), or both sides
  agree to skip.
- **Failed-platform penalty** (post 1728): if the incumbent completed **<50% of his
  prior-term planks**, **25% each** of party-wide enthusiasm drop + party-pref drop ("Only 2
  of 5 planks completed" hit Cochran).
- **October Surprise** (post 423, 1739): a random table that **only bites if a crisis is
  active** (or a regional disaster) — Party Pref ±1 + a regional ±1; an **Incompetent**
  president handles it poorly.
- **State of the Meters → EV tally**: meter readings convert to per-state bonuses
  ([§22.1](#221-the-named-meter-bank--numeric-debt--crisiscascade)) → **tie-breakers for
  close states** → **faithless electors** rolled (post 428: 3 faithless, 2 CA + 1 ME, stray
  EVs to off-ticket pols) → a per-state **popular-vote % "Election Atlas"** + national totals
  (post 438, 1082, 1749 — see `game-context.md` A7 for the auto-map requirement).
- **EV tie-breaks**: the close-state tie-breaker resolves a tied state's EV; a tied national
  EV count would fall to the same family of rules (the thread did not hit a national tie).
- **Defeat maluses** (post 438, 459): a **defeated Pres/VP carries a −1 next-election malus**
  (corroborates [§15.3.10](#15310-scoring--nominee-aftermath)); defeated incumbents who **ran**
  auto-retire ([§16.1.2](#1612-defeated-incumbents-auto-retire)).

> **Results across the window** (meter→election in action): 2008 **Cochran (R) 563 / Cuomo
> 143**; 2012 **Cochran 432 / Franken 246**; 2016 **Kirk (D) 678–0** over a 3-term Cochran
> sunk by accumulated penalties (lost Iron Fist, the 3rd-term malus, failed planks, scandals,
> and the Grenada war loss). The thread **ended mid-session in 2020** before that
> presidential election.

*(designed, not built — the general-election action library, the 3+1 debates subsystem with
per-debate scandal rolls, the October-Surprise roller (crisis-gated), the meter→EV tally with
close-state tie-breaks + faithless electors, and the auto-generated 53-state atlas.)*

### 22.6 The CPU delegate engine (convention + primary apportionment)

> **NEW — the literal apportionment engine, dumped to console (designed, not built).** Post
> 2240 shows the Python/CPU helper's `=== CONVENTION DELEGATE SETUP ===` output. This is the
> hand-adjudication the single-player build must automate. Feeds both the primary
> ([§22.3](#223-presidential-primary-subsystem-291)) and the convention
> ([§15.3](#153-convention-machinery-292--full-forum-design-designed-not-built)).

- **Configurable inputs**: party · **eligible-faction-by-ideology** · **4 or 5 categories** ·
  a per-state **office-control** toggle.
- **Per-state output**: EVs, **Category (1–5)**, **Bias (−5..+5)**, Control, Ideology, and
  **Delegates ≈ EV × a category multiplier** (Cat1 ≈ ×1 … **Cat5 ≈ ×4** for friendly states).
- **Totals**: **53 states ⇒ 1,300 delegates, majority 651** (`total / 2 + 1`). The batch-1
  "447 needed to win" was the same rule on a smaller roster.
- **Host advantage** (corroborates `fed`): the faction that **sets the delegate categories**
  is favored — couples to the convention-host rule ([§15.3](#153-convention-machinery-292--full-forum-design-designed-not-built)).

*(designed, not built — implement the delegate-apportionment engine: per-state EV × category
multiplier, ideology/control-aware category assignment, 4-or-5 category mode, host-sets-
categories advantage; reuse it for primary delegate counts and convention ballots.)*

> **CPU-confirmed across `drums` (batch 5).** The CPU primary AI atop this engine is
> **designer-acknowledged under-tuned** ("you can curb-stomp the CPU bc it is simple," POST 7135):
> a **fixed action template per candidate per group** (Speech + Campaign Focus + Attack +
> sometimes Embrace Local Issue + sometimes Presidential Promise), 1d6 per action with
> trait gates; **attack target = highest-PV rival regardless of context** (no underdog logic —
> repeat attacks on a runaway frontrunner); **Presidential-Promise acceptance gate**:
> target only accepts a withdraw-for-cabinet bribe **if they hold less than half the delegate
> target needed to win** (POST 7173, 7184). The **frontrunner determination rule** is era-keyed:
> out-of-power party → **Party Leader is the frontrunner**; in-power party → the faction running
> a major with the highest points; once primaries exist, the **primary winner is the frontrunner**
> and overrides the PL bonus (POST 6754). Full primary CPU spec → **[§25.12](#2512-cpu-primary-ai-designer-acknowledged-under-tuned)**.

### 22.7 SCOTUS subsystem (2.5.3 + 2.8.2)

> **NEW full subsystem; designed, not built.** The shipped court is abstract — 2.5.3 nudges
> `partyPreference ±0.1` by conservative/liberal justice count
> ([§11.6](#116-253-supreme-court--runphase_2_5_3_court-phaserunnersts3397)) and 2.8.2 retires
> age-≥75 justices at 0.15 and back-fills by `judicial`
> ([§14](#14-executive--court-management-28x)). `modern` runs a **named-Justice docket** with
> compel mechanics and dynamic court size. Cross-ref `game-context.md` #52; relates to BUG-2.
> (modern#post 30-31, 105-113, 277, 324-339, 911, 974, 1280, 1418, 2046, 2250.)

**Docket** (2.5.3): real cases run **per term (one case/term)**; each named Justice votes
**Yea/Nay by ideology** (post 30, 277, 898, 1280, 1558, 2250). Outcomes are steered to/away
from history and flagged **AHISTORICAL** (NAACP v. Claiborne, Kennedy v. LA, Thompson v. OK,
Atkins v. VA, Janus, **Dobbs v. Jackson → 6-3**). The **Chief Justice may attempt to delay**
a case (post 30).

**Compel mechanics** (Iron-Fist / Manipulative president):

- **Compel a vote** — force a Justice to **switch their vote** (post 30 Sestak Nay→Yea; post
  1280 compels 3 at once; post 2250 Kirk→Sestak ⇒ Dobbs 6-3). This is the **Iron-Fist
  compel-vote** power.
- **Compel a retirement** (2.8.2) — force a **same-party** Justice (or, if **Manipulative**,
  an **opposing-party** Justice) to retire, with **separate rolls** for "retire from court"
  vs "retire from the game" (post 105, 730, 957, 2046).
- **Conditional / compelled retirement bargaining**: a Justice may **offer to step down only
  if a named replacement is confirmed** (post 324).
- **12-year minimum**: a Justice **cannot retire before 12 years** on the court **unless**
  leaving for another office (GM ruling, post 2054).

**Dynamic court size + court-packing** (post 105-113, 279, 330, 738, 911, 944):

- A **court-packing bill** ("appoint an extra Justice whenever an incumbent reaches **70**")
  was in effect (**target size 10**), then **repealed in-session**.
- If the court is **≥ target**, a **70+ retirement shrinks** the court instead of creating a
  vacancy (post 738).
- Bills exist to **set the number of Justices** outright ("Set Number of SC Justices to 5",
  post 279). (The **age-70 rule** is the packing trigger, distinct from the shipped age-75
  retirement roll.)

**Confirmation** (post 974, 1401-1421, 1625): committee then floor, **needs 64 / 60%**. A
**failed nominee ⇒ the replacement must be a moderate / the other party's ideology / an
other-party member, and is auto-confirmed.** Trait swaying applies (Harmonious aye; Integrity
supports Integrity) but **no Orator/Debater shenanigans** (removed, post 1418).

**Appointee ideology reveal + drift** (post 113, 339, 1418, 1558, 2250): a new Justice's
**true ideology is discovered on joining** via a roll (LW-Pop not Prog; Mukasey Liberal not
Mod; Lemley Cons not Mod). **After 10 years a Justice can shift ideology** (Prog→Lib; Sestak
Cons→Mod) — the same 10-year drift confirmed in federalism.

**Rulings deactivate laws** (post 31): a SCOTUS ruling **deactivates now-unconstitutional
laws** (the death-penalty case deactivates "Set Punishment … to Death"). **House-rule gap**:
bills tied to a court-disabled policy **should** auto-deactivate but **don't** (post 1293,
1297) — logged with the design holes.

> **Confirmed 1856-native (`house-divided`).** This whole subsystem is corroborated across the
> 1856→1904 arc: named (often **ahistorical**) docket voted by Justice ideology with **Chief +100
> / Associate +50** weighting; **dynamic court size** (grew to 10); **compelled retirement**
> (Manipulative/Iron-Fist, age ≥ 75 OR ≥ 12 yrs; **5-Judicial + Integrity immune**); justice
> ideology drift ~every 10 yrs; a **5-5 tie affirms the lower court and sets no precedent**. The
> sharper 1856 detail is **rulings that change what legislation is legal**: **Pollock v.
> Farmers' Loan 5-4** ruled income tax a direct tax → **blocked income-tax bills until an
> amendment passed** ([§24.4](#244-64-amendment-ratification-by-34-of-state-governors--era-keyed-then-tunable)),
> plus **Cruikshank** and **Plessy** (`hd` POST 4616–4632, 7250, 7252, 7273, 8181, 8536, 8651).
>
> **CPU-confirmed across `drums` (batch 5; Justice drift = the canonical percentages).** The
> 10-year drift rule is finally dumped: **25% mid / 10% left / 5% right every 10 yrs; Puritan
> blocks all shifts** (`drums` POST 7533). The other CPU-confirmed pieces: **default = vote
> ideology**; **switches to "vote cards"** if the case touches the Justice's faction's lobby
> cards; **sway is one vote per swayer + only if initial vote isn't unanimous** (POSTS 4591,
> 4741, 5079); **Integrity / Passive abstain from being swayed**; **Manipulative Pres compels 1
> justice/term on d6 5-6** (~33%, POST 1142); **Iron-Fist Pres compels cross-party justices
> without Integrity to vote Nay** (POST 3660 — Cobb compelled all Dem justices on Strauder,
> flipping 7-2 Aye to 4-5 Nay); **disputed electors → SCOTUS rules, Integrity NOT consulted**
> (POST 462). Full Justice drift table → **[§25.14](#2514-long-term-justice-ideology-drift-the-canonical-drift-rule)**.

*(designed, not built — a SCOTUS module: a per-term case docket + ideology-vote model; the
Iron-Fist/Manipulative compel-vote and compel-retire powers (with the 12-year minimum + the
conditional-retirement bargain); dynamic court size + court-packing (age-70 trigger, shrink
when ≥ target, set-count bills); confirmation at 64/60% with the failed-nominee
moderate-auto-confirm recovery; appointee ideology reveal + 10-year drift; a ruling →
law-deactivation hook.)*

### 22.8 Investigation special committees (under-designed)

> **NEW — and flagged UNDER-DESIGNED.** The designer **left the rules blank**; **player
> @10centjimmy authored them mid-game**. Designed, not built. Cross-ref `game-context.md`
> #54. (modern#post 1294, 1369-1372.)

A bill type **"Investigate Lobby or Special Interest"** (proposed in 2.6.1) forms a **special
investigation committee** — a special **chair + ranking member + members** — that **rolls for
whether enough evidence is found**. The **target is always a member of the dominant party**
(not the proposer's party). The observed investigation returned **"no charges."** Because the
rules were authored in play, the **exact roll, committee composition, and consequences are
unsettled** — this is a **design hole**, not a finished mechanic.

*(designed, not built — and **rules must be authored first**: define the investigation-bill
type, the special-committee composition, the evidence roll + modifiers, the dominant-party
targeting, and the consequences of a found/not-found verdict.)*

### 22.9 Military-leadership appointment tier (2.3.2)

> **NEW appointment tier; designed, not built.** The shipped 2.3.2 fills a single
> `GeneralInChief` ([§9.2](#92-232-military--runphase_2_3_2_military-phaserunnersts2246)).
> `modern` runs a **multi-rank military ladder** inside the appointment phase. Cross-ref
> `game-context.md` #49; pairs with the war system (#45,
> [§21.1](#211-generic-cross-era-war-system)). (modern#post 214-229, 848, 952, 1386, 2172-2182.)

- **Ranks**: **Chairman of the Joint Chiefs (CJCS), Army Chief of Staff, Chief of Naval Ops
  (CNO), Generals, Admirals** — a distinct tier alongside the civilian cabinet seats.
- **Auto-confirmed**: military appointments take **no Senate vote** (post 2176) — contrast the
  civilian cabinet's roll-call.
- **Promotion back-fill**: promoting an officer up the ladder **back-fills** the vacated rank;
  officers **passed over for promotion may resign** (post 1512).
- **Rank constraints**: a **general can't be made an admiral** (post 848, 1386).
- **Pre-war firing**: an **Iron-Fist** president may **fire generals before a war** (20% each
  of −1 Mil Prep, [§21.1](#211-generic-cross-era-war-system)).
- **Wiring to war**: the ranks feed the per-battle Chance-of-Success modifiers — **SecDef +
  Joint-Chiefs ratings ×2**, the **leading officer's rating ×10** (a 5-skill general = +50),
  plus **Military Preparedness +25** ([§21.1](#211-generic-cross-era-war-system)).

> **Reconciliation with batch-2 cabinet (`fed`).** Federalism showed **senators refuse a
> *military* appointment except in a major war** but accept an ambassadorship
> ([§9.3.1](#931-expanded-cabinet-roster)) — the modern auto-confirm of the *military tier*
> is consistent (the senators-refuse rule is about pulling a *Congress member* into uniform,
> not about confirming a career officer). Both are designed, not built.

*(designed, not built — add a military-rank ladder to 2.3.2: CJCS/Army/Navy chiefs +
Generals/Admirals, auto-confirm, promotion back-fill, rank-mismatch + resign rules; wire the
ratings into the generic war engine.)*

### 22.10 53-state alt roster + modern apportionment

> **NEW roster + apportionment; designed, not built.** Shipped rosters are `states1772.ts`
> (13) / `states1856.ts` (31), with static `electoralVotes` and **one home state per
> politician**. `modern` runs a **53-state** alt roster with census-driven apportionment and
> **two-home-state** politicians. Cross-ref `game-context.md` #55, #34, A9. (modern#post 185,
> 426, 438, 462, 495, 870, 964, 1281, 1785, 2240.)

- **53 states** including **DC, Cuba (CU), Puerto Rico (PR)** as **full states** (post 426,
  438; the delegate table at post 2240 lists Cuba 17 EV, PR 3 EV). The roster is the **modern
  alt-history annexed set**, not the real 50 states.
- **Modern apportionment / decennial Census**: a Census recomputes EV apportionment under a
  **Wyoming Rule**, **resets every state's Bias**, and adds/removes a state's **"focus Rep"**
  House seat (post 185, 870, 964: total EVs dropped **706 → 678**). Wyoming-Rule apportionment
  **ballooned the House to 601 seats** (post 185, 420), later cited as **572** (post 1281);
  the **Senate = 106** (53 × 2).
- **Two home states**: a politician may carry an **alt-state add at draft** ("AOC (NY) adds
  CO", post 462, 495, 1785), affecting relocation/Carpetbagger
  ([§6.2.x](#62x-forum-design-layer-designed-not-built)) and Kingmaker chaining
  ([§6.5.x](#65x-forum-design-layer-protégé-slot-cap--gains-designed-not-built)).
- **Scaling-wall UX** (`game-context.md` A9): at this scale the manual House-election and
  committee-staffing phases are the dominant tedium — the forum's RepElections tab is **wiped
  every cycle**, players keep companion files, and **a player quit over it**. The build **must
  persist + auto-fill** House candidate slates and committee rosters across cycles.

*(designed, not built — a modern 53-state roster (incl. annexed states); a Wyoming-Rule
apportionment recompute (House size + 106 Senate) that resets EV counts + state Bias at the
decennial census + adds/removes focus-Rep seats; politician multi-home-state support; and
persistent + auto-filled House slates / committee rosters.)*

### 22.11 Era clock & era enum (alt-history)

The modern thread makes the **era model** explicit and worth stating as a mechanic, not just
framing (modern#post 1, 769, 1080, 1106, 1172, 1200, 1771):

- **Eras have fictional names and gate content.** The campaign plays the **"Kindness Era"
  (referenced) → "Era of Terror" (…–2012) → "Era of Populism" (2012–2024)** (post 725, 818,
  9-15, 769, 1106, 1771). Era boundaries **gate which events/actions are legal** and
  **rescale the faction-card economy** (post 1172 — card counts per ideology/interest change
  at the boundary; post 1200 — the boundary can force the Prog/LW-Pop cards to **split across
  two factions**). End-of-era awards are paid at each boundary (post 1080; see
  [§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy)).
- **The clock runs ~10 years behind real tech** (post 39-41: "IBM releases first PC" in 2004;
  the internet event hadn't fired). Real-world dates are **not** the gate — the **`Era` enum
  is** ([§1](#1-core-model--invariants)). The shipped flat interest-group pool (Big Tech, Big
  Oil & Gas, Globalists, LW/RW Media) is **anachronistic in 1856/1868 but correct here**
  (`historical-context.md` §3-4 vs §10).
- **Dataset exhaustion** (post 456, 1088-1101, 1771): the ~18.5k real-person draft dataset
  **runs out** in the deep-modern era ⇒ the campaign **switches to procedurally generating
  rookie classes** (~188 pols/class). This is a hard build requirement (`game-context.md`
  #43): a procedural generator with a **plausible, ethnically-varied, toggleable name engine**
  and procedural portraits (A1).
- **Era-enum vs `nationalism`/`gilded`**: the engine's `Era` type today is
  `independence | federalism | nationalism | modern` (`types.ts:1337`). The forum frames a
  **Gilded Age** *and* the modern arc above as distinct eras, so the enum likely needs to grow
  (`gilded` / `progressive` between `nationalism` and `modern`) — an open question in
  `game-context.md`.

> **Design holes & possible bug (point to `game-context.md`, not re-documented):**
> - **DH-1** — a **filibustered "MUST-pass" bill has no rules remedy** (GM-confirmed gap).
>   When a required tariff was filibustered to death, the rulebook had no answer; the GM
>   **improvised** a 4-leader "special committee" auto-pass with a per-day "AMPU government
>   shutdown" penalty clock (modern#post 640, 696, 711, 716). See `game-context.md` → DH-1.
> - **DH-2** — the **modern era-event deck appears decoupled from the literal year (POSSIBLE
>   BUG, reported-not-verified)**: in the ~2018 turn the EraEvos deck pulled **2008-era cards**
>   (Subprime crisis, ABM/INF treaties) (modern#post 2221). Could be an intended shuffle,
>   backlog, or a scheduling defect; reconcile with BUG-1 and the
>   [§21.7](#217-era-event-scheduling-model-vs-corespine) scheduling fork. See
>   `game-context.md` → DH-2.

*(designed, not built — formalize an `Era` enum + per-era content gating (events, actions,
card pool, card-count rescale at boundaries) decoupled from literal years; a procedural
politician generator for dataset exhaustion; and resolutions for DH-1/DH-2.)*

---

## 23. Civil War & Reconstruction (1856-arc) (designed, not built)

> **Entire section is designed, not built — and uniquely sourced.** This is the **only**
> documented playthrough of the antebellum → Civil-War → Reconstruction machinery, from the
> **first 1856-native** thread (`77db6e6f`, "A House Divided" Part 2, a 1856→1904 alt-history
> multiplayer campaign). The **shipped** 1856 scenario (`scenario1856.ts:177`, era
> `nationalism`) stops at the antebellum *start*: its era-event spine **ends at the Trent
> Affair (1861)** and it has **no Civil-War combat engine, no secession resolution, no
> Reconstruction**. What ships is the *pressure* (Dred Scott / John Brown / **Secession Winter**
> era events that decay cabinet loyalty and modulate meters — [§10.3](#103-243-era-events--runphase_2_4_3_era-phaserunnersts2796),
> `phaseRunners.ts:2834–3000`; `SLAVE_STATES_1856` at `types.ts:1152`), not the war itself.
> Cite `hd#POST N`. Cross-ref `game-context.md` rows **#56–#60** and the alt-history framing in
> `historical-context.md` §3–§5 (**Seward**, not Lincoln, is the wartime president; secession
> fires **~1863** from a bungled John Brown's Raid decision; CSA president **John A. Quitman**).

### 23.1 (#58) Secession + Southern-Unionist / Secessionist trait gating (the antebellum payoff)

The antebellum pressure pays off as a **scripted Era-Event chain**, not a passive drift:

1. **Trigger = a blundered presidential decision.** Seward took response **B** to the **John
   Brown's Raid** "Hard" event with **0 Judicial** → blunder; the event's rule text reads
   *"Automatic secession convention and Civil War if response B blunders"* (`hd` POST 1166).
   **One bungled presidential decision forced the war** — the clearest demonstration that
   implementation/blunder rolls ([§14.1](#141-forum-design-layer-executive-actions-library-designed-not-built), DH-9/DH-10) can branch the whole timeline.
2. **CSA forms as an event** (`hd` POST 1168): **11 states leave** (FL GA AL MS LA TX SC NC TN
   AR VA). The **4 border slave states (DE MD KY MO)** are handled **separately** — the *state*
   may stay while its *politicians* individually secede.
3. **Per-politician secession roll** (`hd` POST 1175): a pol of a seceded/border state
   **becomes inactive** (moved to a **"Secessionists" tab**) **UNLESS** they hold the
   **`Southern Unionist` trait**; **`Nationalist` → a roll to stay** "Andrew Johnson style"
   (Alexander Stephens stayed and became the **1864 Democratic nominee**, POST 1422–1425).
   **302 pols seceded**; loyal notables stayed (Andrew Johnson, Stephens, CJ Taney of MD).
4. **The draft dataset carries the trait.** Newly drafted / career-track pols from
   seceded/border states **without `Southern Unionist` auto-become Secessionists** — most
   Southern *Republicans* have the trait, few Southern *Democrats* do (POST 1446, 1452, 2152).
5. **Relocation is one-way during the war:** pols **can move OUT of rebelling states, never IN**
   (POST 1469, 1607) — interacts with the relocation cap ([§6.2.x](#62x-forum-design-layer-designed-not-built)).
6. **CSA gets its own gov structures as events:** Provisional Pres **Quitman**, VP **Letcher**,
   Army Cmdr **A.S. Johnston**, Sr Admiral **Buchanan**, capital Richmond, a UK-recognition
   threat (POST 1168).

> **Unadopted player house-rule** (logged for the designer): border-state secession **by
> ideology** (Conservative 50% / Traditionalist 75% / RW-Populist 90%) instead of a blanket
> roll (POST 1495) — a sharper alternative to the current flat roll.

*(designed, not built — a `Politician.allegiance: 'union' | 'secessionist'` state + a
"Secessionists" inactive bucket; a secession era-event chain gated on a blundered presidential
decision; the per-pol secession roll keyed on `Southern Unionist`/`Nationalist` traits + state
region; one-way relocation out of rebel states; the CSA officer/structure events.)*

### 23.2 (#59) Free/Slave sectional-balance crisis scoring (the Nationalism crisis engine)

The **defining Nationalism-era mechanic** — a sectional counter that punishes the side that
loses the free-vs-slave state balance at each half-term close, **retired on emancipation**.

- **Trigger** (`hd` POST 302, 747, 1070): at half-term close, when **free states outnumber
  slave states** (it fired when KS + OR were admitted free). One bloc "wins" the balance; the
  *other* bloc's faction/officers take the hit.
- **Effect package when free > slave** (the antebellum North pulling ahead):
  **Speaker & Senate Pro-Tem each −250 points + −1 next election; all Moderate factions −250;
  Domestic Stability −2; Party-Preference +2 toward Red; Civil-Rights faction +250 /
  RW-Activists −250; ALL RW-Activist candidates +2 next election** ("livid").
- **Retirement** (`hd` POST 1766): the whole crisis is **removed once slavery is abolished**
  (the 13th-Amendment-equivalent beat) — it is era-bounded to Nationalism, not permanent.

This is a **sectional free-vs-slave state counter** feeding **score + meter + election**
effects, keyed to the era and sunset on emancipation. (Codebase note: `SLAVE_STATES_1856`
exists at `types.ts:1152` but **no such crisis scoring** is wired — the shipped antebellum
beats are the loyalty-decay/meter-modulation events only.)

*(designed, not built — a `freeStateCount`/`slaveStateCount` derived counter; an
end-of-half-term check that, while the imbalance holds and the era is Nationalism, applies the
Speaker/Pro-Tem/Moderate/Civil-Rights/RW-Activist score + DomStab + Party-Pref + next-election
package; retire the whole subsystem on the abolition era event.)*

### 23.3 (#56) Civil War — the two-theater combat engine (multi-term subsystem)

> **The headline unbuilt system.** Fought over **multiple half-terms** as a structured
> subsystem **separate from the normal turn loop** (`hd` POST 1332, 1710, 1977, 1979). It is
> the **tiered general case** of the batch-2 generic war system ([§21.1](#211-generic-cross-era-war-system))
> and bears almost no resemblance to the **shipped flat resolver** (`runPhase_2_7_2_Military`,
> `phaseRunners.ts:3593–3627`: `milPower×10 + d100 > enemyPower×10 + 50`, `warScore += win?10:−5`,
> ends at `±50`). Divergence **#6** ([§19.1](#191-design-divergences-for-the-roadmap)) is the
> shipped-vs-design gap this thread most sharply confirms.

**Structure — two theaters, naval gates land.**

- **Two theaters (East & West); BOTH must be fought.** Each theater requires **3 naval
  victories before any ground combat can begin** (Admirals + Ironclads first). `Naval
  experience` is **a prerequisite to be an Admiral and is NOT the same as a `Naval` trait**
  (`hd` POST 1325, 1329).

**Per-battle success %** (`hd` POST 1332 ff.; **multi-confirmed across `drums` maps 5/8/10/11 +
Eastern + Western + Utah + WWI + Mexico**, batch 5) — additive, then a **d100**:

```
Success% = base
  − Difficulty            // Easy 0 / Moderate −10 / Difficult −25  (drums slightly sharper)
  + Planning              // Sec War + Senior General skills  (Sec Navy + Sr Admiral for naval)
  + Officer               // commanding officer Military ×10, +10 if Decisive General
  + MilPrep               // level × 5 + 5 per ally (high=+15, mid=+10, low=+5)
  + Benchmarks            // +5 each (3 = +15; 4 = +20)
roll d100 ≤ Success% ⇒ battle won
```

This is the **same additive battle-card shape** as [§21.1](#211-generic-cross-era-war-system)
(difficulty + planning + officer + meters + benchmarks → single %), with the officer-rating ×10
and the appointment-tier feed ([§22.9](#229-military-leadership-appointment-tier-232)) made
explicit for the Civil War. The **`drums` thread re-derives the formula end-to-end** across
**4 wars + 4 eras** (Eastern theatre, Western theatre, Utah, WWI, Mexico, Sioux), making this
**the single most multiply-confirmed cross-era resolver in the knowledge base** (`drums` POST
123, 1725, 1728, 1731, 2199, 2539, 2728, 2881, 3278, 3540, 5111, 5353, 6181, 6317, 6571, 6705).

**Multi-confirmed outcome rules** (`drums` extends `hd` with the rolled values & cascade):
- **Victory**: +1-3 War Score (Easy +1 / Moderate +2 / Hard +3); officer gains Military Leader
  if missing; +1 Military.
- **Defeat**: −2 War Score; officer −1 Military; **next general −1 Mil lingering**.
- **Officer KIA on natural 1** on the success roll (e.g. Custer at Little Bighorn 29-to-win,
  rolled 1 → killed, POST 3278; Eberle "killed in action 1/100" → auto-nomination + unanimous
  confirm of replacement, POST 6181).
- **Catastrophic 100/100**: −3 War Score, general loses 1 Military + Leadership + Military Leader
  (POST 2728 — Battle of Fort Fizzle, Williams).
- **Phase continuation roll ~50%** between battles.

**War Score per theater** (`hd` POST 1977; sharper threshold in `drums`):

| Event | War-Score delta |
|---|---|
| Easy / naval win | **+1** |
| Difficult land win | **+3** |
| Loss | **−1** (or −2 in `drums`) |
| **War Score reaches ≥ +11** | **theater AUTO-WINS** (`drums` POST 5111, 6708) |

If neither theater has auto-won, an **end-of-phase roll vs `WarScore × multiplier %`** decides
whether the war **carries to the next half-term** (it carried repeatedly). Contrast the shipped
`±50` cliff and the batch-2 `warscore + momentum → %` with an **escalating ×2** the longer the
war runs — the Civil War is the **Major-tier** instance of that multiplier. The `drums` thread
sharpens the resolver:

- **War-end check per phase**: `WarScore × 2 = % chance war ends this phase` (corroborated for
  Sioux, Spanish, post-CW).
- **Post-war defeat chance**: `|WarScore| × 2 × 10 = % defeat` (POST 5111: −2 × 2 × 10 = 40%,
  rolled 72 → war continues).
- **Minor wars use ×2 end-multiplier** (Utah 4×2=80%, POST 1731; Sioux 3×2=60%, POST 3278).
- **Momentum bonus**: +1 War Score if higher than prior turn; −2 if lower (POST 6706).
- **Naval phase gate is per-war**: 3 wins required for Mexico, 2 for WWI (POST 6571, 6572).

**Named historical battles kill named pols on the military career track** (both sides):
Hampton Roads, Charleston, New Orleans, Galveston, Mobile Bay, Antietam, Shiloh, Chickamauga,
Vicksburg, Wilderness, Atlanta, Drewry's Bluff. **Rufus Bullock KIA at Mobile Bay** (POST
1332); **Lee can win Chickamauga for the CSA**. **Winning officers gain** Leadership / Military
Leader / +1 Military / **Decisive General** / Celebrity and **lose Obscure** — feeding the
career-track ([§5](#5-career-tracks--the-expertise-pipeline-212)) and the down-ballot war-hero
bonus below.

**Global modifiers while the war is active:**

- At **crisis Domestic-Stability**, the **incumbent party takes −2 in ALL elections** (POST 1408).
- The **opposition-VP penalty is reduced by 1** (POST 1396).
- Per-term **"Major War Impacts"** Lingering rolls fire ([§11.1](#111-251-lingering-meters--runphase_2_5_1_lingering-phaserunnersts3260); POST 888, 1196).

**War end — Union victory** (`hd` POST 1977, "Treaty of Appomattox"):

1. **+250 points** to Nationalists / Civil-Rights / Wall-St / Big-Corp / Mil-Ind / Globalists.
2. **The President gains a PERMANENT +1 in ALL elections** for winning the war.
3. Seceded states enter **Reconstruction** ([§23.4](#234-57-reconstruction-readmission-subsystem-end-nationalism--gilded)) — **not** "back in the Union."
4. A **25% post-victory "CSA Guerilla War" roll** (didn't trigger here).

**War-hero down-ballot bonus** (`hd` POST 3942, 4767): a **General with a Military skill gets +1
in EVERY state** if a major war ended **< 20 years prior** — this **decided the 1884 race**.
**NB:** the in-timeline war end-year is ambiguous (**1866 vs 1867**), which shifts the 20-year
window — flagged **verify** (open question, `game-context.md` `hd`/#56).

**Tiered war framework (generalizes #45 / divergence #6).** The same engine runs **Major /
Minor / Operation** tiers with different end-war multipliers and reward packages:

| Tier | Example (`hd`) | Notes |
|---|---|---|
| **Major** | the Civil War | two theaters, +10 auto-win, permanent president bonus |
| **Minor** | US–China Naval War (Treaty of Melbourne, POST 1723); Naval War with Spain → US gains **Puerto Rico** (Treaty of Charleston, POST 2985, 3195) | allies (UK, Russia) assist |
| **Operation** | Red Cloud's War / "Generic Indian War" (**Operation ×2**, Treaty of Palo Duro, POST 1871, 1979) | smallest multiplier |

> **Data defects logged in-thread** (for the build's content pass, not engine bugs): two distinct
> China-war events (POST 1725–1729); stale **"Generic Indian War"** event text used for what is
> really **Red Cloud's War** (POST 1872–1874).

*(designed, not built — a tiered `War` model: theaters with a naval-victories-gate-land
prerequisite, the additive per-battle Success% (difficulty/planning/officer×10/meters/benchmarks),
per-theater WarScore with a +10 auto-win, the WarScore×multiplier carry roll with a Major/Minor/
Operation multiplier, named-battle officer casualties + trait grants, the active-war global
election modifiers, and the win package incl. the **permanent president +1-all-elections** and the
**<20-yr war-hero +1-all-states** bonus. Fold the shipped flat resolver and the 1772 Rev-War loop
in as configured instances.)*

### 23.4 (#57) Reconstruction readmission subsystem (end-Nationalism → Gilded)

After Union victory the **10–11 ex-Confederate states** sit under **Military Reconstruction** —
not back in the Union (`hd` POST 1987–1988, 2320):

- **Military occupation / districts**; the **President appoints military Governors (2-yr terms)**;
  **no congressional representation** until a state is readmitted.
- **Readmission is a per-state BILL** through the normal committee → floor pipeline
  ([§12](#12-legislation-26x)) — "Tennessee/Florida/Louisiana/… Reconstruction." On passage the
  state re-enters and its **Gov / Rep / Senate elections fire** (POST 2111, 2332, 2589, 2670).

**Three readmission plans** (a presidential Executive Action, `hd` POST 1987–1988):

| Plan | Mechanic |
|---|---|
| **(1) Ironclad Oath / Strict Loyalty** | readmitted state gets **+2 toward the incumbent party for 4 cycles (8 yrs)** — a **time-boxed, event-sourced bias modifier** (e.g. "SC +2 Red until 1882") |
| **(2) Military Districts / Martial Law** | 5 districts, appointed Govs, no representation; **requires the 14th-equiv Amendment to readmit**; **ex-Confederate pols barred until pardon** |
| **(3) Pardon Confederate Soldiers** | rank-and-file only; **cannot be deactivated** |

- **The +2-toward-incumbent bias SUNSETS** mid-**1882** for AR/MS/SC/TX/VA (TN earlier) — a
  concrete time-boxed `until`-year on a per-state bias modifier.
- **Readmission also adds Black voters** (enfranchisement can flip down-ballot races; **P.B.S.
  Pinchback = first Black governor**), after which Southern Govs deploy **segregation / literacy
  / disenfranchisement** governor actions ([§11.3](#113-governors-actions-library-designed-not-built); POST 3532–3561, 3945–3965, 4179–4297, 4493).
- **Amnesty / citizenship is itself contested law** via competing bills ("Strip citizenship of
  Confederate leaders, pardon others"; "Mass Trials"). On passage of **strip-leaders** the engine
  **removes the named CSA leadership pols from the game** (Pres/VP/Generals/Admirals/Cabinet +
  state officeholders at secession) and **returns all other pardoned pols to their origin
  factions**; players then prune Kingmaker pairings whose members were removed (POST 2640, 2641).
- **Moving INTO a recently-reconstructed state doubles the Carpetbagger chance** (POST 2445,
  3024) — a Reconstruction-specific modifier on the relocation trait grant ([§6.2.x](#62x-forum-design-layer-designed-not-built)).
- **Reconstruction era-event spine:** First KKK, Reconstruction Riots, Lost Cause, **Plantation
  Economy ends → converts the Plantation industry → Agriculture at 2:1**, Colfax Massacre,
  White League / Red Shirts, KKK / habeas bills, **Jim Crow Laws** (unlocks a Gov **"State
  Segregation"** action = triple points for 30 yrs, POST 3094).

> **GM house-ruling gap (era-inconsistent).** The fate of **loyal Senators/Reps from seceded
> states** was put to an A–E vote with **no fixed rule** — "in 1840/1856 we did option D" (POST
> 1182–1194). A build needs a stated rule. See `game-context.md` design-holes.

> **Confirmed 1856-native + sharpened across `drums` (batch 5).** Adds the specific
> **Reconstruction END exec action** spec (`drums` POST 2812, NEW):
> *"Voters Tire of Costs of Reconstruction"* event. Pres can end via executive action:
> **AG Admin roll vs threshold** (e.g. Taylor rolled 67/100 = success). On success:
> **+100pts to RW Activists / Trads / RW Pop / Cons; −100pts Civil Rights**; **triggers
> White League / Red Shirts paramilitary event next** (Pres choice A = send federal forces vs
> B = let states sort; e.g. Lee chose A, rolled 59/60); if Reconstruction continues,
> **Reconstruction Riots** event fires. Also confirmed: **no default penalty for returning
> Confederates** = critical balance hole (`drums` POSTS 1742-1752); **persistent +2 Red bias**
> dominates 1864/68 (POST 2269); **14th-equiv Amendment** shifts Deep South state bias 1 toward
> incumbent party (POST 1833); **Lenient 10% Loyalty plan** = judicial bill through the normal
> pipeline (POSTS 2524-2535). **Jim Crow event sequence** (POSTS 4569, 4571, 4718):
> FL/TN/MS/AR enact Jim Crow → state bias +2 Blue, +100 RW Activists/Trads/RW Pop, −100 Civil
> Rights, Honest Gov −1, **3× point multiplier for 30 years**. **BUG flag (POST 4729)**:
> scripted events don't check active SCOTUS rulings (Munn v Illinois → Cruikshank previously
> deactivated poll taxes, POST 2698).

*(designed, not built — a `State.reconstruction` status (occupied / military-gov / readmitted)
with President-appointed 2-yr military Govs and no representation until a per-state readmission
bill passes; the three readmission plans incl. a **time-boxed `bias +2 until year`** modifier;
Black-voter enfranchisement on readmission feeding `calcStateVote`; the strip-leaders / pardon
bills that remove-or-return named pols; the doubled-Carpetbagger-into-reconstructed-state rule;
the 2:1 Plantation→Agriculture industry conversion; the Reconstruction era-event spine; and
the **Reconstruction END exec action** (AG-Admin roll + lobby payouts + White-League/Red-Shirts
trigger).)*

### 23.5 (#60) Canada conquest → era-gated territory→statehood + Canadian draft

This alt-timeline **annexes Canada** (the **Mid-Century War**, `hd` POST 528–531: "1st playtest
to ever acquire Canada"). Provinces then enter via the territory → statehood bill pipeline
([§21.5](#215-bill-driven-statehood--auto-generated-officials)), **era-gated**:

- **In the 1856/Nationalism era**: only **Quebec → straight to statehood** (no territory step);
  **Ontario** must be a territory first; **Newfoundland, New Mexico, Utah/Deseret statehood are
  LOCKED until the Gilded Age (1868)** (POST 787, 916–933). Era gates *which* territories may
  become states.
- **Quebec admitted as a STATE mid-war** (POST 1307) with a **special Canadian draft of ~70
  historical Canadian pols** (Cartier, Galt, McGee, Mackenzie, George Brown, Laurier, Macdonald;
  region "Canada"; POST 1301, 1321).
- **Canadian-born pols can run for President once ALL of Canada is in the US** (POST 2009) — a
  relaxation of the native-born rule (ties to [§24.1](#241-61-succession--eligibility--the-acting-president-state)).
- **Canada-states electoral penalties (1856-specific):** a candidate unpopular in Canada takes
  **−3 in Canadian states**; a cabinet with **no Canadian member → −1 for the President in
  Canada** (POST 3731, 3942, 4154). Reached **9 Canadian states by 1884** (BC = "Vancouver"/"New
  Albion," vetoed then admitted).

> **Codebase note:** `src/data/expansionStates.ts` already lists all Canadian provinces (region
> `'Canada'`), so the **roster exists** — but the **era-gated admission rules, the Canadian draft
> pool, and the Canada election penalties do not.**

*(designed, not built — era-gating on which territories may be admitted (Quebec-statehood-only in
Nationalism; NL/NM/Utah locked until Gilded); a region-tagged Canadian draft pool; a relaxation of
native-born eligibility once a region is fully annexed; and Canada-region election penalties (−3
for a Canada-unpopular candidate, −1 for a no-Canadian cabinet).)*

---

## 24. Other 1856-arc systems revealed by `house-divided` (designed, not built)

> The non-Civil-War systems first surfaced by the **1856-native** thread. Several **extend**
> existing modern/cross-era sections (succession, the Primary Era, amendment ratification,
> investigations, the institutional cabinet, the Lingering meter bank) — this section adds the
> **sharper 1856 detail and the era-keyed boundaries**, not a re-statement. Cite `hd#POST N`.
> Cross-ref `game-context.md` rows **#61–#69** and design-holes **DH-3..DH-11**.

### 24.1 (#61) Succession / eligibility / the acting-president state

> **Highest-value constitutional gap.** The shipped engine has **no succession logic** beyond
> the cabinet/leadership it already tracks; two `hd` succession crises expose what is missing.

- **VP-vacancy gap (1883):** Pres **Matthews assassinated** (random Random-Evo; motive =
  opposing women's suffrage). VP **Morton succeeds** but there is **no mechanism to fill the VP
  vacancy pre-25th-Amendment** → the seat **stays empty**; party leadership passes to the
  highest-PV faction leader (POST 4472–4480). Era-aware: the fill mechanism does not exist yet.
- **Foreign-born ineligibility + the 0-Command acting president (1886):** Pres **Grant AND VP
  Shufeldt die in the same death batch**. Speaker **Alexander Mackenzie is foreign-born
  (Scottish) → constitutionally INELIGIBLE**; per **rule 2.4** the **Senate Pro Tempore becomes
  ACTING President** → **Paris Gibson, with 0 Command**, becomes the 21st President and is
  **fully inert**: can take **no executive actions**, **cannot compel SCOTUS retirements**, and
  is **ineligible to be elected** in 1888 (POST 5414–5471, 5581). **Command (often 0) governs
  what an acting president can do.**
- **Line of succession is house-ruled by passed legislation** — they made the **Speaker
  3rd-in-line** (instead of SoS) back in 1864 (POST 5466); later a Progressive-era bill **moved
  SoS back to 3rd** (POST 7795). → the order is a **configurable, bill-mutable field**.
- **"Require President to Fill VP Vacancy" Amendment** did not exist (Dems had blocked it);
  proposed/passed this cycle, **ratifies in 1888, applies only to the NEXT vacancy** (POST 5470,
  5573). **Foreign-born faction leaders are ineligible for the Presidency** (POST 5448).

*(designed, not built — a **configurable line of succession** (bill-mutable order); **native-born
vs foreign-born eligibility** gating the presidency (relaxable per [§23.5](#235-60-canada-conquest--era-gated-territorystatehood--canadian-draft)); an
**acting-president state whose `command` (often 0) gates executive actions / SCOTUS-compel /
re-election eligibility**; and an era-keyed VP-vacancy fill rule (off pre-amendment, on after).)*

### 24.2 (#62) Contingent House election + tied-chamber inverse control

> **Documented house-rule deviation — fills the shipped gap.** The shipped general always
> resolves to a winner; there is **no contingent path** when no candidate reaches an EC majority.

The **1888** race went 3-way (Blaine R 197 / Shortridge D 196 / Saltonstall "Conservative" 23;
**208 needed**) → no EC majority → **contingent election in the House** (`hd` POST 5713):

- **DEVIATES from the 12th Amendment:** the GM uses the **top 2**; a player cited the
  constitutional **top 3** and the GM **overruled with "Game rules"** (POST 5720–5721). The
  build **must pick a stated rule** (DH-6).
- **Each state casts 1 vote** by the **majority party of its House delegation** (tie →
  **Governor's party**); **29 of 56 needed**. **Shortridge won 35-21** (first elected Democratic
  President since 1856 in-timeline; first **LW-Populist**). The **Senate elects the VP** by party
  vote (→ Hancock) (POST 5713–5762).
- **Tied-House control (edge case):** the 1890 House was **152-152**; control of a tied House
  goes to **whoever does NOT control the Senate** (inverse tiebreaker). Senate stayed Dem → GOP
  got the tied House (POST 6229, 6257).

*(designed, not built — a contingent-election path: when no candidate reaches the EC majority,
run a **one-vote-per-state House election among the top N** (pick a stated N — top-2 house rule
vs top-3 12th-Amendment, DH-6), delegation-majority with Governor-party tiebreak; Senate elects
the VP; and the **inverse tied-chamber control rule**.)*

### 24.3 (#63) Primary Era — state-opt-in primaries → Presidential-Primary Groups 1–5

> **Sharpens [§22.3 (modern primary subsystem)](#223-presidential-primary-subsystem-291) and dates
> its ORIGIN.** The 1856-native arc shows the Primary Era **BEGINS in the Progressive era
> (≈1892+)** — primaries are not a modern-only fixture; they are an era-gated subsystem that
> *switches on* mid-campaign. The modern §22.3 loop is corroborated; the new detail is **when it
> turns on and how a state opts in.** (`hd` POST 6879, 6900–6907; full dumps 8200–8237, 8947–9051.)

- **The calendar is emergent, not fixed.** A **Governor action "Allow/Activate State Primaries"**
  ([§11.3](#113-governors-actions-library-designed-not-built)) turns a state into a primary state,
  sets **winner-take-all / plurality / proportional**, and assigns it a **Primary Group 1–5 by
  random roll** (POST 8103). Once **any** state has primaries, the game **enters the Primary Era**
  (primaries run **before** the convention). 1896 ≈ 11 primary states → by **1904 ALL states have
  primaries** (player-pushed via bills + Gov actions; debated 8947–8949 because primaries grant
  "more actions" + **less party-leader control**).
- **Delegate bucketing:** the party's designated Gov also **buckets states into 5 delegate
  Classes/Groups** (POST 8530); larger group → more delegates; delegate math **differs per party
  per state** (1896 GOP 1090/546, Dems 957/638; 1904 GOP 1211/606, Dems 1119/746).
- **Groups vote in sequence; Momentum carries between groups but HALVES when large**; per-group
  **debate** scored numerically (win-by-2 → +Momentum + ideology-meter shift); **1st in Group 1 =
  +1 enthusiasm + +2 next group**.
- **Per-group candidate actions** (d6, trait-modified) — the §22.3 menu, with the 1856-native
  specifics: pick **3 Focus States**; **Presidential Promise** (VP/cabinet/SC seat for a
  drop+endorse); **Embrace Local Issue** (risks an ideology shift); **Withdraw + endorse** (75%
  delegates to endorsee) **/ + release** (split **25/25/25/25** similar-ideology / front-runner /
  party leader / lowest faction) **/ + hold**; **Major Speech** (once per primary); **Campaign
  Focus**; **Attack Rival**. A **Broke check** each group (d6) knocks out underfunded trailers
  (POST 9045).
- **Incumbent block (sharper than §22.3):** an **Iron-Fist + Leadership** incumbent (Blaine) has
  **90%** to block ALL same-party challengers (**Passive 50%**, else **75%**); if blocked, only
  **sub-half-enthusiasm** factions (or a **Pacifist** in a major war) may challenge; a
  **Kingmaker** president → only the **lowest-enthusiasm** faction may. **Rule:** a LW/RW-Pop
  **cannot endorse a Moderate** unless a Moderate is the only other candidate (POST 8226).
- **Resign-to-run** (POST 9016): appointees must resign to run (**SC Justices & appointed
  Senators only 25%**); Congressional officers resign the **post** but keep the **seat**; **20%**
  a Gov/Sen/Rep resigns the **seat**; **Pres/VP never resign to run**.

*(designed, not built — this is mostly the §22.3 subsystem, era-gated to switch on in the
**Progressive** era when the first state opts in via a Gov action; add the **per-state primary
type + Primary-Group 1–5 assignment**, the per-party delegate bucketing, the Momentum-halves-when-
large carry, the sharper Iron-Fist/Kingmaker incumbent-block ladder, and the resign-to-run table.)*

### 24.4 (#64) Amendment ratification by 3/4 of state Governors — era-keyed, then tunable

> **Reconciles [§21.3 (amendments as durable, separately-ratified state)](#213-amendments-as-durable-separately-ratified-state)
> across a third era and confirms the "ratifier + threshold is an era-keyed, in-game-changeable
> field" reading.** (`hd` POST 503, 518, 1721–1722, 2974.)

- **1856/Nationalism rule:** an amendment needs **2/3 of BOTH chambers**, then **3/4 of state
  GOVERNORS** to ratify — i.e. **ratifier = Governors; threshold = 3/4 of states** (National
  Suffrage **failed** ratification 24-9, needed 25/33). This **matches modern's
  ratifier=Governors** (§21.3 step 3) at a **3/4** threshold rather than modern's fixed 40/53.
- **Made a TUNABLE game mechanic mid-campaign:** a later amendment changed the **threshold to
  2/3**, accompanied by a posted **Ratification-Options table** (POST 1721–1722):

  | Option | Side effect |
  |---|---|
  | **2/3 of states** | +Moderates |
  | **3/4 of states** | (the prior baseline) |
  | **50%+1** | +Progressives / +LW-Activists, −Traditionalists / −RW-Activists |
  | **Unanimous** | +Traditionalists / +RW-Activists, −Progressives / −LW-Activists |
  | **Popular Vote** | +Progressives / +Reformers |

  By the **Gilded Age the default is 2/3 of states** (the 1865 14th-equiv set it, POST 2974).
- **SCOTUS ↔ legislation coupling enforces amendment necessity** (extends [§22.7](#227-scotus-subsystem-253--282) /
  gap #52): income tax ruled a direct tax by **Pollock v. Farmers' Loan 5-4** in the SCOTUS phase
  → **blocks any income-tax bill until a Constitutional Amendment passes** (POST 7250, 7252,
  7273); the Income Tax Amendment needs ⅔, failed repeatedly, **ratified by 1904** (POST 8979). A
  SCOTUS ruling that **changes what legislation is legal**.

*(designed, not built — make the amendment **ratifier + threshold an era-keyed field** (Gov vote;
3/4 in Nationalism, 2/3 from Gilded), itself **changeable by a passed amendment** carrying a
faction-enthusiasm side effect from the Ratification-Options table; and a SCOTUS-ruling effect
that gates a bill category until an amendment passes. Extends gap #39.)*

### 24.5 (#65) Investigations — the authored "3.0.40" 5d6 special-committee spec

> **Fills the under-designed [§22.8 investigation special committees](#228-investigation-special-committees-under-designed)
> with a concrete rule.** §22.8 noted the modern thread left investigations **rules-blank**; the
> 1856-native thread **authored the spec** (and shows the early stopgap). (`hd` POST 202, 2585,
> 2591, 2651.)

- **Early stopgap (1856):** with no rules, the GM **borrowed Court-Martial rules** — **d6**: 1-2
  removed from game / 3-4 removed from office / 5-6 absolved (Bonham, the Sumner-caner, rolled 4 →
  removed from House) (POST 202).
- **Authored rule "3.0.40 Congressional Special Committee Rules" (Gilded):** the **Speaker forms
  a committee** (Chair + Ranking + 3 members); **roll 5d6** + modifiers:

  | Modifier | Δ |
  |---|---|
  | Target has **Leadership** | **−2** |
  | **No** committee member shares the target's faction | **+1** |
  | Target's ideology is **>1 slot from all same-party members** | **+3** |
  | Target is **Controversial** | **+4** |

  **Total 21–25 ⇒ guilty** (resign, **barred from cabinet**). On guilt: same-party **5%
  Integrity**; opp-party **10% Leadership / 5% Integrity**; **10% +1 Honest-Gov** (POST 2585, 2591,
  2651). (Worked case: AG Begole / the Trader-Post Scandal.)

*(designed, not built — implement 2.6.1's investigation-bill → a Speaker-formed Chair+Ranking+3
committee → **5d6 + the four modifiers**, **21–25 = guilty** (resign + cabinet ban), with the
post-verdict trait/meter rolls. This is the concrete spec gap #54 was missing.)*

### 24.6 (#66) The Progressive-era institutional layer (offices created in-game by law)

> **Sharpens [§9.3.1 (expanded cabinet roster)](#931-expanded-cabinet-roster) and [§9.3.6](#936-modern-cabinet-detail-sharpens-931-933-designed-not-built)
> from the 1856-native side — and adds the key new idea: offices are CREATED in-game by
> legislation / executive action**, and creating one office can **deactivate** another. (`hd` POST
> 6963, 7160, 7348, 7800–7804, 8175, 8845.)

- **Federal Reserve + Fed Reserve Chair**: 6-yr term; **Economics/Trade/Business + Admin ≥ 3 +
  age ≥ 35**; declines 90% if previously held office. **Creating the Fed DEACTIVATES the
  Independent Treasury** (an office-creation that retires a prior institution).
- **Chief of Staff** (+1 exec action) and **Chief of Naval Operations** (replaces "Senior
  Admiral," 4-yr term) — **each grants the President an extra Command point** (Blaine 5 → 6),
  feeding executive-action and SCOTUS-compel counts.
- **FBI** created by bill (SR.6) → **FBI Director** (10-yr term, **Justice + Admin ≥ 3**, declines
  90% if ever held elected office, **doesn't count vs the 5-retention cap**, Senate-confirmed).
- **Commerce AND Labor split into two departments** (POST 7160). Other artifacts: National
  Monetary Commission, Border Patrol, FDA, National Commission for Conservation, Guam Territory.
- **Cabinet reaches ~21 posts** (Pres, VP, Key Advisor, State, Treasury, War, AG, Interior, PMG,
  Agriculture, Commerce, Labor, Navy, FBI, Fed Chair + 7 Ambassadors). **PMG must be same-party +
  have the Kingmaker trait.** (Corroborates & extends gaps #25/#31/#49.)

*(designed, not built — model offices as **data created/destroyed by bills + exec actions** (not a
fixed `cabinetSeatsForYear`): the Fed Chair / Chief of Staff / CNO / FBI Director with their
distinct terms, skill+age gates, decline odds, Command grants, and the **create-Fed-deactivates-
Independent-Treasury** coupling; the Commerce/Labor split; and the same-party+Kingmaker PMG rule.)*

### 24.7 (#67) Lingering — the ~16-meter homeostasis engine (era-gated foreign meters)

> **Extends [§22.1 (the named meter bank)](#221-the-named-meter-bank--numeric-debt--crisiscascade)
> with the 1856-native confirmation and the era-gating detail.** §22.1's bank is corroborated
> meter-for-meter; the **new** facts are that the **foreign-relation tracks are added as nations
> become relevant** (so the set is ~16 but **era-gated**), an **inactive "Israel" placeholder**
> exists even in 1900, and **Planet's Health is live in a 19th-century scenario**. (`hd` POST 6431,
> 6863, 7216, 8503, 8896, 8897.)

- **Meter set (~16):** Revenue-Budget, Economic-Stability, **8 foreign-relation tracks**
  (UK/France/Spain/Germany/Russia/China/Japan + **"Israel" — present but INACTIVE/0**; the
  resolver literally prints **"Skipping Israel — inactive"**), Military-Prep, Domestic-Stability,
  Honest-Government, Quality-of-Life, **Planet's-Health**, Party-Preference, + **7 per-ideology
  enthusiasm tracks** (±3, named bands). **Foreign meters are era-gated** (added as nations become
  relevant; **Israel's activation rule is unknown** — open question). **Planet's Health was
  activated in 1890** by the "Conservation Movement Begins" Era-Evo (set 7 = Stable) — active in
  this 19th-century game.
- **2.5.1 Lingering = a deterministic ~9-part resolution** (confirms the shipped layering at
  [§11.1](#111-251-lingering-meters--runphase_2_5_1_lingering-phaserunnersts3260) and the §22.1
  dynamics): top/bottom-2 econ; **maxed-meter caps (Mil-Prep & Planet-Health hard-capped at 8)**;
  lingering bill/action effects; **middle-of-meter drift (revision-to-mean −1)**; volatility rolls
  for tax/tariff bills; income/tariff decay (bills expire at 10 yrs; **tariff rate locked 8 yrs**
  after a change); **administrative modifications** (each cabinet officer rolls ± its department's
  meter); ongoing wars; corruption.
- **Policy-gated caps (sharper than §22.1):** **QoL can't exceed 7 without national Healthcare**
  ("No Healthcare, so still capped at 7"); **Honest-Gov 8 → all Controversial candidates −1 next
  election**; **Honest-Gov 9 → forbids Gerrymander & political machines**.
- The output reads **engine-automated** ("net change," "Capping meters to avoid overflow") yet the
  GM calls it **hand-computed** (POST 8897) — a spreadsheet macro, not a true engine.

> **Codebase note:** shipped `NationalMeters` has only the **7 base** numeric meters incl.
> `planet` (`types.ts:1399`) — **no per-power relations, no per-ideology enthusiasm tracks, no
> Israel placeholder.** Strongly extends gap #50.

*(designed, not built — extend the §22.1 bank with **era-gated foreign-relation tracks** (added as
nations become relevant; an **inactive-placeholder** state for not-yet-active powers like Israel);
keep Planet's Health era-activatable (Conservation Era-Evo); and the policy-gated caps (QoL≤7
without Healthcare; Honest-Gov 8/9 effects).)*

### 24.8 (#69) Draft rookie grants re-ruled — "3 traits + 3 alt-states"

> **Sharpens [§4 (Draft)](#4-draft-211) / the modern two-home-state rule
> ([§22.10](#2210-53-state-alt-roster--modern-apportionment)).** A **mid-campaign re-rule** of
> what a drafted rookie receives. (`hd` POST 2155.)

At the **1868 draft** ("Ted's revisions") the per-rookie grant changed to **3 traits + 3 alt-state
adds**, **down from an earlier 5 traits / 5 alt-states**. This is the 1856-native value for the
two-home-state mechanic §22.10 already documents (one alt-state add → now up to **3**). **Whether
3/3 is the canonical going-forward rule is an open question** (`game-context.md` `hd`/#69, DH-list).

*(designed, not built — make the draft rookie grant a tunable `{traits, altStates}` pair; the
current best value is **3/3** (down from 5/5), pending a canonical decision.)*

---

## 25. CPU AI specifications (designed, not built unless flagged)

> **Sourced from `drums` (`e1776bbd`, the all-CPU 1841→mid-1924 playtest).** Because the run
> was all-CPU, it is the **first explicit record of CPU heuristics, thresholds, tie-breaks,
> and design-holes** the multiplayer threads couldn't surface. Every subsection below has been
> independently confirmed in earlier threads where noted; where this is the first explicit
> forum statement, the rule is marked **(new in `drums`)**. Cite `drums#post N`. Cross-ref
> `game-context.md` DH-12..DH-22 and the CPU-AI cluster in the gap log.
>
> **Shipped status:** the engine ships only **thin CPU stubs** — `pickBestForFaction` for the
> draft (`phaseRunners.ts:33`), `pickAIResponse` for era events (`eraGraph.ts:88`),
> `appointDelegates`/`electCCPresident` for the CC (`continentalCongress.ts:23, 116`),
> `aiPickDelegate` for the First-CC builder (`firstContinentalCongress.ts:153`), and
> `autoFillCPUVotes` for the Constitutional Convention (`constitutionalConvention.ts:81`).
> Almost **everything in this section is designed, not built** — the rules below specify what
> the CPU should do; the build today either does nothing in that phase or does a one-line
> heuristic that disagrees with the spec.
>
> **Why this matters.** In a single-player browser game, the CPU IS the engine for ~9 of
> the 10 factions. Without these heuristics shipped, the game's mid-to-late content
> (conventions, cabinet confirmations, leadership races, legislation, conversions) doesn't
> *work*, even if every individual phase runner does. The CPU-AI cluster is the highest-
> leverage gap surface in the knowledge base — and it is also where the **forum drives the
> build** most visibly: mid-thread the designer (`vcczar`/`Tyler`) live-patched the IRV CPU
> (POST 3419), the ±3 ideology-swing cap (POST 4574), the 5%/half-term retirement-death
> rate (POST 5437), and the deterministic Whig→"Conservative-Party" rename (POST 7406).

### 25.1 Candidate selection (open seats, primaries, conventions) — the 75/25 rule

> **The single most authoritative CPU-selection statement in the run.** All five threads
> defer to this rule; `drums` finally gets it on paper (POST 143, Tyler).

**Major candidate selection** (per faction, per open seat):

| Roll | Pick |
|---|---|
| 75% | **Party leader** (the faction's PL) |
| 25% | random Gov / Sen / VP / Former VP / Former Pres with **≥1 Command** |
| fallback (no eligible candidate above) | **any random candidate with ≥1 Command** |

**Minor candidate selection**: CPU **always runs one** minor — random member with **≥1 Command**.

**Open Q (raised by Tyler, POST 143)**: should the 75/25 rule also apply to **faction-leader
picks** (it currently runs only on presidential-major)? — unresolved.

**Auto-major-candidate triggers** (POST 2210): a CPU **automatically runs a major** if the pol
is the **incumbent**, the **faction leader**, or holds **Celebrity**. No other gates.

**Primary-against-incumbent rule** (POST 1777): a CPU **never primaries an incumbent** unless
the faction's ideology-enthusiasm is **"extremely unhappy"** (the bottom-most band toward the
opposition). Iron-Fist + Leadership president blocks ALL same-party challengers at 90%
(Passive 50% / else 75%, [§25.12](#2512-cpu-primary-ai-designer-acknowledged-under-tuned)).

**Open-seat selection** (a 2-step filter, POST 1777, 1784):

1. **State's preferred-ideology filter** picks a shortlist.
2. **Random pick from the shortlist** with **Kingmaker-faction members getting a primary
   bonus** that usually beats un-bonused stars (POST 1784: "3rd-best Red politician in the
   game" Lincoln sat unused for cycles because he wasn't in a Kingmaker faction).

**Stifle Competition** by a frontrunner at convention (POSTS 1841, 2244): rolls vs a **~90
floor**. A faction's enthusiasm must clear a **~85 floor** for it to even produce a minor
candidate.

*(designed, not built — the 75/25 picker, the ≥1-Command gate, the Kingmaker-faction
primary-bonus rule, the auto-major triggers, and the incumbent-primary block. Cross-ref
[§25.4](#254-convention-cpu--per-ballot-momentum--interballot-menu--compromise-picker) for the
convention layer.)*

### 25.2 VP selection — NO retention logic (designer-acknowledged bug)

> **The designer-acknowledged retention bug** (POST 167, Tyler): *"the CPU picked from the
> faction with the lowest points that had a candidate not from the President's region. So it
> was basically random. Was thinking maybe have a chance to keep a VP but make that more
> likely to happen in the Nuclear Era and onward."* **The CPU has no VP-retention logic.**

#### 25.2.1 The 8-element VP Assessment rubric (the canonical rubric)

**Deterministic, published verbatim 4× in-thread** (POSTS 5159, 5556, 5983, 6380, 7275;
earlier echoes 788, 1183, 1530, 2572, 2904, 3318, 4109, 4435). After the nominee picks the VP,
score the **ticket** on **8 binary checks**; each yes = **+1**:

| # | Check |
|---|---|
| 1 | VP is **from another faction** |
| 2 | Ticket has a **Mod / Cons / Lib** |
| 3 | Ticket members are **≥20 years apart** in age |
| 4 | At least one ticket member is **≥50** |
| 5 | At least one ticket member is **<60** |
| 6 | Ticket is an **incumbent ticket** (same Pres+VP) |
| 7 | **Exactly one** of the two is **"independent" / out of office** (excluding military) |
| 8 | One ticket member from a **Big State**, one from a **Small State** |
| 9 (rolled, not binary) | **Different regions** |
| 10 (rolled) | **Obscure roll** d6 on VP: 5-6 → loses Obscure; 3-4 → keeps + adds trait; on Harmonious/Integrity skip the negative-trait grants |

**Higher-scoring ticket = Party Pref +1 + dominant-ideology +1.**

#### 25.2.2 Career-track + ideology-gap rules

- **Career-track gate** (vcczar, POSTS 2227-2234): a VP can be **taken off career-track for
  *appointment*** but **NOT for *election***. Hancock was rejected as VP because he was on
  Backroom Track.
- **2-ideology-gap between Pres/VP rule — UNDOCUMENTED**. Tyler (POST 3797): *"I'm not finding
  it anywhere"* — Breckinridge (Trad) + Weaver (LW Pop) were allowed at a 4-step gap. Authored
  intent may exist but isn't in the rules doc.
- **Open Q**: dropping a VP with no penalty (Polk dumped Seymour, POST 1176) — should it cost
  something? Unresolved.

*(designed, not built — implement the 8-element rubric verbatim at convention close; add a
VP-retention-chance curve (Tyler suggests "more likely Nuclear Era+"); keep the career-track
gate (appointment YES, election NO); decide the 2-step Pres/VP gap rule.)*

### 25.3 Leadership / Speaker / PPT — IRV-style bloc-vote tie-break ladder

> **The most-corroborated CPU heuristic in the run, now nailed across 4+ maps** (§A.1.4,
> §B "Leadership/Speaker IRV", §C.1.1; `drums` POSTS 604, 679-680, 847-851, 1010, 1158, 2657,
> 2992-2994, 3170-3173, 3419-3422, 3596-3597, 3885, 3980, 4175-4177, 4322-4326, 4513,
> 4667-4671, 4872-4877, 5014, 5272, 5841, 6099, 6448, 6623, 6747, 6828, 7349, 7500).

**The CPU bloc-vote IRV tie-break ladder**:

1. **Ballot 1**: each faction casts as a **UNIT** for its own/closest candidate.
2. **Closest ideology** to the surviving candidate (random among ties).
3. **Highest PV** (1st tiebreak).
4. **Highest Legislative skill** (2nd tiebreak — Senate races especially).
5. **Random same-party** (last resort).

**Two live patches in-thread** (POST 3419, by Tyler/`vcczar`):

- The **original CPU collapsed at ballot 3 with a random pick** (anti-climactic). Patch:
  **continuous IRV-style elimination** — no collapse.
- Patch refinement: **randomize only on FIRST elimination, not each CPU each round**
  ("just too chaotic") → first-round-only random scramble; subsequent eliminations
  deterministic.

**3-inconclusive-ballot collective endorsement** (confirmed in 3 places: POSTs 5272, 5841,
6099): *"After the third ballot, the CPUs all vote randomly for a candidate."* (POST 5841:
"After 3 ballots no one is the winner so the CPUs all select Furnifold Simmons.") **Human
factions do NOT auto-collapse** — they must manually endorse.

**No reciprocity / vote-trading** (POST 4875, designer comment): *"Sadly for
@matthewyoung123 the CPUs don't understand reciprocity."* No side-deals, no quid-pro-quo logic
exists — confirmation/leadership votes swing 76-24 → 91-9 by faction discipline alone. This is
an **architectural gap** ([§25.15](#2515-critical-missing-cpu-logic-architectural-gaps)).

**Closest-ideology can flip leadership to the *minority* party** (POST 3419): Magoffin/Cons-Dem
won PPT in 1880 when Tariff Whigs jumped to him after Sidney Clarke was eliminated. The
ideology-tiebreak isn't party-bounded.

**On-win effects (asymmetric)**:

| Role | On win | On re-elect |
|---|---|---|
| **Speaker** | loses Obscure; gains Leadership + Legis+1 + Kingmaker (POST 3597) | Legis+1 + Magician (POST 3427) |
| **PPT** | **nothing** (POST 3430) | — |

**Party-leader internal-vote heuristics** (POSTs 86, 234, 338): each pol rolls **1d12 + skill**;
runoffs with endorsements. **Lowest-score faction endorses lowest-score remaining candidate**;
mid-tier factions endorse highest-PV; adjacent-ideology factions back closest ideology;
**Harmonious+Integrity candidate auto-gets Kingmaker-faction backing** (POST 1019). Defeated-
candidate endorse = closest ideology, then by score-tied lowest; endorsee gains extra d6.

*(designed, not built — the IRV ladder with continuous elimination + first-round-only random
scramble; the 3-inconclusive-ballot collective endorse; the on-win asymmetric grant table; the
party-leader internal-vote d12 + endorsement runoff.)*

### 25.4 Convention CPU — per-ballot momentum + interballot menu + compromise picker

> **The thread's richest decoded subsystem.** Stable across many cycles (§A.1.3, §B, §C.1.8;
> `drums` POSTS 426, 429-431, 769-786, 1152-1168, 1841, 2216, 2552-2566, 3294-3318,
> 3688-3713, 3719, 3737-3766, 4063-4117, 4419-4441, 4779-4822, 5116-5118, 7229-7244).

#### 25.4.1 Per-ballot momentum

- Ballot-1 frontrunner who fails to win: **−1 Momentum**.
- 2nd place: **+1 Momentum**.
- Largest delegate gainer on later ballots: **+1 Momentum**.
- Frontrunner who *never* wins → **permanent −1 in future primaries** (POST 4820 — Weaver).

**Nominator speech roll**: 1d6 — 1 = **−1 Mo**, 2-4 = 0, 5-6 = **+1 Mo**. **Orator** upgrades
start at 4 instead of 5.

#### 25.4.2 Per-ballot inter-ballot menu (each candidate picks ONE per ballot)

1d6 success roll allocates:

| Action | Trigger / gate | Notes |
|---|---|---|
| **No action** | default | major factions w/ name recognition |
| **Stifle Competition** | frontrunner | rolls ≤~90 floor |
| **Appeal to Credibility / Integrity / Charisma** | matching trait + meter-in-crisis (Credibility variant) | 1d6 ≥5 = +1 Mo |
| **Whip Party Into Compliance** | Party Leader (needs Leadership; 4-6 with Leadership trait) | +1 per Pliable faction leader (Iron Fist multiplies) |
| **Presidential Promise** | offer cabinet / SC / VP / plank | target rolls vs **50** (25 for VP, 50 for cabinet); **Puritan auto-declines** |
| **Kingmaker Interference** | external Kingmaker (not running) | 1d6 ≥5 = **−1 Mo to target** |
| **Drop out + endorse** | always available | auto **+1 Mo to endorsee** |
| **Influence Smoke-Filled Rooms** | **Kingmaker-gated** | |
| **Rouse Convention with Lies and Propaganda** | Manipulative trait | |
| **Request Ballot Shift** | any | re-roll delegate alignment |
| **Call Rules Change** | **≥ ballot 5** | passes by **weighted-kingmaker vote** (POST 3719) |
| **Will of the People** | (CPU-confirmed action variant) | — |

**Rules-change votes use weighted-kingmaker vote** (POST 3719): each faction's weight ≈ its
Kingmaker count (e.g. Whigs Tariff 4, FT 15, Business 13, Stalwart 16, Silver 13). Needs a
majority of weighted kingmaker votes.

#### 25.4.3 Compromise at ballot 10 (rigid highest→lowest picker)

> **Invented in-thread by Tyler (POST 3719) → became the canonical rule.**

- Each calling faction picks ONE eligible **compromise candidate from another faction in
  their ideology cluster** (Mod picks from Cons/Mod/Lib).
- **Random within the picked faction.**
- **Lowest-score faction picks first, locks their pick** — then the **rigid highest→lowest
  faction-points picker order** (confirmed POSTS 7229-7244: *"Radical Whigs will pick your
  faction only if you select from the Wall Street Whigs, otherwise they will choose between
  them"*). **No cross-faction coordination.**
- Compromise candidates **absorb delegates of originals**; originals **drop out after one ballot**.

#### 25.4.4 Dark horse at ballot 25

POST 3719: Party Leader picks an **eligible candidate from the lowest-scoring faction**;
auto-nominated. (Dark-horse compromise candidates dodge resignation rolls — house-ruled
retroactive, POSTS 7257, 7263 — a **logged loophole**.)

#### 25.4.5 Stuck-convention pathology — the 11-ballot deadlocks

> **Critical design hole — NOT implemented.** No auto-drop-out fires after 2-3 ballots of
> 0 Momentum. Result: **10-13 ballot deadlocks** in practice.

- **Whig 1852 went 11 ballots → Broom is compromise → loses to Polk.**
- **Whig 1856 went 11 ballots → Anthony Ellmaker Roberts of PA.**
- Players proposed CPU should auto-drop-out after **2-3 ballots of 0 Momentum** (POST 1162).
  **NOT implemented** — current behavior produces deadlocks. **OPEN.**

#### 25.4.6 Other convention CPU behaviors

- **Kingmaker delegate-math undecided** (POST 1949): GM toggles between "d6" and "d6 + kingmakers"
  for endorsement bonus "to counterbalance someone running the table with kingmakers." **Formula
  undecided.**
- **Pineapple Primary** (POSTs 2562, 2888, 3690, 5515-5520): a random presidential candidate is
  shot at the convention. **Lethality d100 ≤ 50 = killed** (Grant 1872; Tweed 1876 33/50;
  Cornelius Bliss 1884; Yates 1900). VP succeeds; Holcomb (3rd-party Labor Dem) becomes the
  **first 3rd-party-elected President** via this path.
- **Kingmakers refuse to endorse** politicians with **Lowbrow / Easily Overwhelmed / Unlikable**
  — corroborated across cycles (§B, §C.1.2).
- **Unanimous shortcut**: if only 2 candidates and one offers VP to the other & it's accepted
  **before voting**, ballot 1 is unanimous (POST 4420 — Cumback/Fenton).
- **CPU running-mate logic does NOT penalize ticket experience holes** (POST 7249): CPU-Taft
  picked CPU-Hughes (both Justices, no prior electoral run); Tyler flagged as *"weird strategy."*
- **Anti-frontrunner "lowest score" preference in PL endorsements** (POSTs 5642, 6119, 6247):
  defeated CPU faction leaders endorse via **{closest ideology → highest PV → lowest score as
  underdog/anti-frontrunner check}**. Late-round consolidation deliberately biases the underdog.

*(designed, not built — the whole convention CPU subsystem. The shipped 2.9.2 is a one-line
"log ratification" ([§15.2](#152-the-election-phases)); the above is the spec. Top priority for
the build given it produces 11-ballot CPU-deadlock pathologies today.)*

### 25.5 Cabinet confirmation — designer-acknowledged bug (36% of 88 nominees passed)

> **The #1 designer-acknowledged broken system in the run.** Tyler's audit (POSTS 4702-4708):
> *"Of the 88 nominees that needed confirmation, the CPUs voted down 40 (45%) in committee.
> Of the 48 that went to full Senate vote, 32 (67%) passed. Overall only 36% of nominees that
> needed confirmation got confirmed."*
>
> **vcczar response** (POSTS 4703, 4707): *"The chance of CPU voting against a cabinet nominee
> is supposed to be really low. I added that rule to avoid this... I don't know what happened
> to those rules. I'll fix them when Anthony needs them if someone marks it on the rules for me."*
>
> → **The "low chance to reject" rule was lost from the rules doc.** Engine-side fix required:
> default-AYE baseline with low-% reject from opposition, modified by trait.

#### 25.5.1 The two reinforcing failure modes

**(a) 50/50 Admin-1 "inexperience reject" trap** (POSTS 867-876, 2494, 2663, 2792, 3023):

- Admin-1 nominees roll **50/50** in committee.
- Whig minority auto-NAY + 50/50 Dem NAY = guaranteed fail.
- Polk's Postmaster/Interior cascaded **4 times** (Whiteaker, Wells, Bigler, Douglas, Davis,
  Scott, Tilden).
- **Only Integrity clears** the trap (Douglas auto-confirmed).
- **Switching to a 2-Admin (Payne) breaks the cascade.**

**(b) Lobby-maximizing selection rule picks Admin-nobodies** (POSTS 1607-1608, 1614-1626):

- CPU cabinet-pick rule = **"most appeased lobbies, nets out already-satisfied lobbies."**
- There is a **fixed priority order** for which cabinet seats fill first; later picks subtract
  already-appeased lobbies.
- **Result**: Granger's cabinet AI ignored all his high-Admin people and picked **1-2 Admin
  nobodies** who held the right cards — Whig-controlled Senate refused to confirm **6 of ~11**.
- **The two bugs reinforce each other**: the lobby-maximizer routes to Admin-1 picks; the
  50/50 Admin-1 trap then kills them.

#### 25.5.2 Iron-Fist Maj Leader + Pliable Pres feedback loop (POSTS 4896-4900)

> Pres Gary is Pliable → 50% chance every nominee is picked by Sen Maj Leader **Orth (Iron
> Fist)**. Orth then **forces confirmation votes** on his own picks.
>
> ebrk85: *"Please tell me these aren't the same pols Orth hand-picked himself"* —
> Tyler: *"Based on the rules as written, yes."*
>
> **Designer ruling** (POST 4900): *"Then we change it! Should be no different than how a
> President's faction votes on its own appointees (AYE to all)."*
>
> → **Engine TODO**: when same actor selects AND triggers vote, **auto-AYE that bloc**.

#### 25.5.3 Other CPU cabinet behaviors recovered

| Rule | Detail | Source |
|---|---|---|
| Cabinet refusal rolls | Senators in leadership posts roll to refuse lateral move (threshold ≤75 — Calhoun 92/75 → accepts) | POST 235 |
| Former-secretary refusal | State/Treasury/War/AG former-secretaries **auto-decline Ambassadorial** | POST 885 |
| Partial-accept | Bancroft 7/25 accepts Russia | POST 707 |
| Replacement appointees do NOT gain skills/traits | (1960-playtest loophole) | POST 421 |
| Cabinet retention cap = 5 | retained (cabinet + cabinet-level + ambassador) | POST 1436 |
| PM Gen requires Kingmaker + same party as Pres | | POST 3037 |
| Key Advisor requires Admin 3+ | **Master Kingmaker forced to Key Advisor regardless of Admin** — flagged Open Q | POSTS 2807, 5658-5660 |
| Sec of State pinnacle rule | Anyone who has served SecState refuses any other appointment **except SecState again** | POST 4779 |
| Region-coverage penalty | any of 5/8 regions absent from cabinet → **−1 in next presidential election** in that region | POSTS 2498, 2668, 3050, 3903, 4006, 4368, 5290 |
| Egghead suggestions = **TIEBREAKER ONLY** | Pres usually goes with cabinet majority; Pres **overrides** on personal ideology (Pendleton overrode 3-Aye-1-Nay on Iceland/Alaska); **Uncharismatic** Pres: shown but ignored; **Pliable** Pres: cabinet majority decides | POSTS 3906, 4016, 4242, 4377-4380, 4569, 5066 |
| Recommendation-rejection blowback | **Disharmonious** members **25% resign in protest** if Pres ignores them (Calhoun resigns over spoils); **Puritan/Disharmonious 50% resign-on-override** (Slidell 10/50) | POSTS 297, 409, 414, 904, 1053 |
| Failed-nominee penalty | **−1..−3 Party Pref + Controversial** — designer-flagged too harsh; **proposed fix**: only apply to 5-Admin / certain-trait nominees | POSTS 1655-1661 |
| Confirmation-failure blame | **25% Maj Leader / 75% Speaker** (or 25% Pres); 50% blame distribution applied; if so, equally split Pres vs Senate | POSTS 6262, 6311, 4541 |
| NAY-voter Controversial gain | **20% chance** to gain Controversial unless already Integrity/Controversial (applies to ALL NAY voters) | POSTS 4541, 4552, 5049, 5063 |
| Lifetime cabinet ban + permanent −1 election malus on **failed-Controversial nominees** | (Delano, Cole; Blaine; Sanford Church >60% EC loss) | POSTS 2497, 2106, 2271, 2794 |
| Max 3 cross-party in cabinet | | POST 6475 |
| Outgoing cabinet cannot move laterally | | POST 6267 |
| Mandatory retirement at 75 | (military officers) | POST 6469 |
| Harmonious Maj Leader skips hearings | for non-top-4 cabinet; top-4 (AG/State/Treasury/War) still get committee + floor | POST 7377 |

#### 25.5.4 Replacement chain after failure

- **Committee-stage fail = no blame phase** (POST 4709).
- **Full-chamber fail = Pres + PPT (or Sen Maj Leader) jointly pick.**
- **PPT presents 5 alternatives → replacements auto-confirmed** (no 2nd vote).
- Compromise nominees need **3+ Admin** and **"not Controversial"** (implicit CPU autoconfirm heuristic).

**Cabinet enthusiasm-via-lobbies overwhelms presidential signal** (POSTS 877, 880): Matt appointed
3 Moderates and Mod enthusiasm moved **+3 the OTHER direction** because cards trump individual
ideology. Designer wants ±3 to ±5 cap; **partially patched POST 4574** — Tyler's **±3 cap on
per-phase ideology swings** ("Since ideologies can swing wildly here with the cards, I'll put a
cap of a swing of three like the cabinet"). Mods swung +7 raw → capped at +3.

*(designed, not built — replace the lost "low chance to reject" rule; fix the 50/50 Admin-1
trap; add the lobby-maximizer Admin/competence weighting; implement the Iron-Fist+Pliable
auto-AYE rule; add the full replacement chain + PPT-5-alternatives auto-confirm; the ±3 swing
cap is now live.)*

### 25.6 Legislation voting heuristic (NAY/AYE/NAY)

> **The canonical CPU rule, multiplied across the arc.** Already summarized inline at the end
> of [§12.3](#123-263-floor-votes--runphase_2_6_3_floor-phaserunnersts3498). Full picture:

1. Bill helps **opposition Pres**'s meters/election? → **NAY**
2. Gives points to **my ideology / lobbies**? → **AYE**
3. Otherwise → **NAY by default**

**Other CPU behaviors that ride on top** (POSTS 933, 2006, 2161, 2180-2187, 2523, 2842, 1683,
1835, 1350):

- **Crisis bills**: when a meter is in crisis, proposals are tagged **(Crisis Bill)** — CPU
  prioritizes; **failed crisis bill still carries penalty** (POSTS 2525, 3122, 3129).
- **Disallowed proposals**: a faction CANNOT propose a bill that COSTS points to one of its own
  cards (mid-stream GM rule, POSTS 2530-2531, 2851 — current bills don't check this).
- **Repeat-proposal rule informal** (POST 2842): can't re-propose a bill passed within recent
  cycles — flagged by Tyler as informal.
- **Bills must be checked against proposer's own cards** (POST 933) — currently slips through.
- **Proposal-validity checker must look at active amendments** (POST 2006): "Apply Existing
  Civil Rights to Former Slaves" auto-proposed after 14A made it invalid.
- **CPU optimizes meter math not theme** (POST 1683): with Dom Stab as only crisis, CPU
  proposed *"Grant States Power to Secede"* because it had a 25% Dom-Stability boost — comedic
  but reveals the engine.
- **Veto override = 2/3 in BOTH chambers, NOT 60%** (POSTS 2180-2187, designer ruling; 60% was
  a bug, reverted) — **must verify shipped behavior**.
- **Amendments can't be packaged with bills** (POST 1835).
- **Vetoing a statehood bill**: −250 pts, −2 Party Pref, state's bias shifts +1 toward
  opponent when admitted (POST 1350).

**Filibuster as deterministic per-Senator** — fully covered at the end of
[§12.6](#126-forum-design-layer-filibuster-designed-not-built).

*(designed, not built — encode the 3-rule NAY/AYE/NAY ladder; add the proposer-cards
self-check; the amendment validity check; the veto-override 2/3-both-chambers gate; the
informal repeat-proposal cooldown.)*

### 25.7 Scripted A/B/C event cabinet voting

> **The pattern Cabinet members use to vote A/B/C on scripted era-event dilemmas.** Counts
> map **explicitly** to ideology + lobby cards (POSTS 6501, 6503, 6504, 7406, 7524).

| Ideology / lobby card | Preferred option |
|---|---|
| **Globalists / Moderates** | **A (intervene)** |
| **Isolationists / Conservatives** | **B (block)** |

**Examples**:

- Mexican Revolution: split by Mod/Lib (A) vs Cons/Mod (B).
- Zimmermann Telegram: 3-2 by Globalist/Mod (A) vs Isolationist/Cons (B).
- Fascist Movement: Page+Hoover (A), Baker+Pleasant (B), Stimson+Mellon (C).

**President's ideology can FORCE a pick** (POSTS 6663, 6720):

- Pres Pattison *must* select the rejectionist option on Coxey's Army.
- Nationalist trait made Stimson Doctrine "no go."

**Cabinet recommendations are scored**; Pres picks the option that scores best against the
cabinet (POSTS 7406, 7524).

**Event-resolver mapping is UNDOCUMENTED** (POST 3642): *"Unclear who the cabinet member is so
I'm going to pick Sec of Interior"* — the scripted-event→cabinet-role mapping is unspecified;
GM defaults to a reasonable choice.

> **Critical missing logic: NO meter-guarding on scripted-event options** (POST 6280, §C.1.11).
> Under Roosevelt, both Quality-of-Life and Economic Stability **crashed to crisis
> simultaneously**: *"Internationalist + Pro-Federal-Government + Advocate New Freedoms
> triple-stack"* tanked all meters with no AI penalty. CPU should not stack 3 effects that all
> drive the same meter into crisis. See [§25.15](#2515-critical-missing-cpu-logic-architectural-gaps).

*(designed, not built — the ideology/lobby-card → A/B/C mapping + score-against-cabinet
selector + president's ideology-force; the scripted-event→cabinet-role lookup; a
meter-guarding term that down-weights options stacking into an already-bad meter.)*

### 25.8 Conversion AI — deterministic %-rolls with Pliable + ideology-adjacency gating

> **Two-layer model corroborated across the entire arc** (§A.1.6, §B "Conversion AI", §C.1.4;
> `drums` POSTS 79, 213, 215, 1254, 1419, 1923, 1925, 2459, 2487, 2633, 2974, 3162, 3406-3410,
> 4498-4499, 4641-4642, 4859, 5002, 5004, 5079, 5251, 5400, 5843, 6429, 6610-6614, 7330, 7472).

#### 25.8.1 Layer 1 — Disgruntled auto-flip (deterministic, no roll)

Pols whose ideology is **maxed +3 for the opposite party** flip at half-term to **the
receiving party's faction that holds the matching ideology card** (POST 1419 — GM ruled "most
aligns" = active cards, not raw label). Free for receiving faction.

- **Whig LW Pop / Prog / Trad / RW Pop** can flip to Dems.
- **Mod / Cons Dems** can flip to Whigs.
- **"If no eligible pols, nothing."**

#### 25.8.2 Layer 2 — Active poach (rolls + gates)

| Actor | Base rate | With adjacency / bonuses |
|---|---|---|
| **Party Leader (cross-party)** | 10% (Pliable) +5% (same-ideology) → ~15% | Pres+Manipulative observed at **43%** |
| Mod PL | 5% base | cross-party penalty |
| LW Pop PL (Weaver) | 15% | **25% if target is LW Pop** |
| Faction Leader (inter-party) | 10% base | **20% if target Moderate**; up to **48% with Kingmaker buffs** |
| Master-Kingmaker tier | **43%** | — |
| Roosevelt as Lib Whig PL | **48%** | **58% if target Lib** |
| Pattison as Mod FL | 10% (×2) | **20% if target Mod** |
| Elihu Root TW leader | 33% (×2) | — |
| **Iron Fist** | **3 attempts** | (Sam Houston, POST 1763) |

#### 25.8.3 Restrictions / immunities

- **Harmonious / Passive / Predictable** faction leaders **cannot convert at all**.
- **Manipulative** blocks a faction leader from converting (POST 1923). **Manipulative cannot
  TARGET Manipulative** (POSTs 2459, 2633, 2974).
- Cannot target own party; cannot target Abolitionist / Radical (POST 1254); cannot target
  **Pres / VP / Cabinet / Speaker / Leader / Whip / FactionLeader / President**.
- Cannot target **Harmonious** (POST 2633), **Trad Dems** (era-specific), **Pliable own-party**,
  or factions at **+3 enthusiasm in either color** (POST 4580: *"His faction is immune to
  conversions due to high enthusiasm"*).
- **Targeting restrictions rotate by era**: 1880 Whigs cannot target Silver Whigs; Dems can only
  target Mod Dems + Lib Repubs.
- **Targets must be Pliable AND same-or-adjacent ideology** (POSTs 4310, 4313-4315 —
  player-disliked new rule).

#### 25.8.4 Failure side-effects

- Target **loses Pliable** (POST 3162, Fessenden).
- Can flip the *roller's* Pliable → Integrity (POST 3873 — Curtis vs Hamlin).
- Survivor often gains Integrity (POST 5002 — Edwin Dun).

#### 25.8.5 Collision bug

> **Multi-faction CPU collisions confirmed.** §A.1.6, POSTS 79, 215. OrangeP47's complaint:
> *"The 'target highest scoring faction pliable logic' is really causing issues with factions
> picking the same people so I'm just chaining it."* **Multiple CPU factions all greedily
> target the same opponent.** Needs better tie-break.

**Kingmaker conversion cascade**: protégés follow their Kingmaker unless Puritan;
**faction-leader protégés do NOT convert** (POST 5619). **Kingmaker-flip grabs the protégé(s)
— "insanely OP"** (already DH-5; reconfirmed).

*(designed, not built — the 2-layer (auto-flip + active poach) model; the rate table; the
Pliable+adjacency gate; the failure-bounce side-effects; a tie-break for multi-faction
collisions.)*

### 25.9 Iron Fist — the overloaded trait (designer-flagged to split)

> **The single largest CPU lever in the thread**, doing **≥6 distinct things by office**.
> Designer-flagged: Iron Fist is doing TOO much; **should split into distinct traits**
> (POST 3241 implied; reconfirmed §B, §C.1.6; `drums` POSTS 2511, 2784, 3241, 3660, 4896-4900,
> 5353, 6293, 6471, 6568, 6703, 6852, 6881, 6907, 6912, 6922, 7012, 7224, 7364).

| Office holding Iron Fist | Effect |
|---|---|
| **Party Leader + Honest-Gov-maxed** | Controls **ALL** gubernatorial actions for all same-party govs across factions (Granger + Estabrook simultaneously; Speed/Whigs 1878+) |
| **Sen Maj Leader** | Forces committee votes + **forces confirmation votes on his own picks** (POST 4896 Orth); **Iron-Fist Maj-Leader auto-cloture** for majority items (POST 5920); **forces chamber to vote how he votes in committee**; **requires confirmation votes on EVERY nominee** outside own faction or retentions (POST 6471). **Pres Harmonious does NOT trump this** (DH "We need a new rule then. Lol." POST 7012). |
| **President** | Stifles challengers (**~90%**); **90% fires officers** (20% MilPrep −1 risk per fire); **compels SCOTUS justices' votes** (POST 3660 — Cobb compels all Dem justices to Nay on Strauder v West Virginia, flips 7-2 Aye → 4-5 Nay); shares cards with allied factions (except Puritan leaders). Pres IF + Kingmaker can also block challenges except from lowest-enthusiasm factions. |
| **Loans-from-Wealthy policy + IF PL** | Temporarily controls **all of his party's governors** (POST 2433) |
| **Convention PL** | Can **unilaterally set ballot threshold rules** at convention **WITHOUT faction vote** (POST 7224 La Follette 2/3 backfired) |
| **Military leaders** | Iron Fist required to **replace military leaders mid-war** (POST 5353) |
| **Trinity-leader (Pres + PL both IF + both have cards)** | PL *"shares one of his cards with his party other than Puritan leaders"* (POST 2784) |
| **Iron Fist Pres + Iron Fist Sen Maj Leader** | Pres IF doesn't override Sen Maj Leader IF on confirmations — *"We need a new rule then. Lol."* (POST 7012) |

> **Designer-flagged to split.** The trait does too many distinct things; should become a
> family of narrower traits keyed by office (e.g. "Stifle Competition" for primary blocking,
> "Force Vote" for chamber compulsion, "Compel SCOTUS" for court compulsion, "Fire Officers"
> for military mid-war replacement). Cross-ref `game-context.md` design-holes — DH-9-adjacent.

*(designed, not built — split Iron Fist into distinct office-keyed traits; document the
Pres-IF-vs-MajLeader-IF tiebreak; codify the 90% officer-fire + 20% MilPrep-risk; the
unilateral threshold-set at convention; the cross-faction PM-General-style takeover via
Loans-from-Wealthy.)*

### 25.10 Faction-leader replacement — 4-condition removal

> §B "Faction-leader replacement", §C.1.15; `drums` POSTS 226-227, 337, 354, 519, 2481, 2622,
> 2786, 2483-2484, 2653, 5033, 6836-6845.

**Must-boot leader (probabilistic)**:

| Condition | Removal % |
|---|---|
| **Lost last presidential election** | 25% |
| **Lacks Charisma** (and rival has it) | 25% |
| **Uncharismatic / Lackey / Easily-Overwhelmed** | 50% |
| **Incompetent** | 100% |
| **Disharmonious / Incoherent** | Triggers consideration too (POSTS 2622, 2786) |
| **Obscure** (when valid non-Obscure alts exist) | per §A.1.16 |

**Hard gates (cannot replace if)**:

- Replacement must hold an interest/lobby card matching faction's cards (POST 2483-2484:
  Pierce Dems wanted Tilden — no Expansionist/Media match → forced keep).
- Career-track members cannot be selected (POST 2653 — "first choice on career track so skipped").
- Speakers cannot be protégés (POST 2766).

**Stagnation bug** (POST 5033, designer-acknowledged): *"Right now they kinda pick someone and
hold onto them even if better options come up."* **No mid-term swap when a better candidate
appears.**

**Negative-trait cascade bug** (POSTS 3610-3617): the 1882 Dem cycle gave all 5 leaders
NEGATIVE traits (Leslie→Predictable, Cobb→Easily Overwhelmed, Cockrell→Incoherent, Parker→nothing,
Davis→Incoherent). Matt: *"I hate your dice man."* **No positive-trait floor.**

**Faction-leaders who secede must be replaced** (POST 1649): Pop Sov Dems → **Copperhead
Democrats**; Conscience Whigs → **Abolitionists** (POST 856).

*(designed, not built — the 4-condition removal table; the hard-gate cascade (card-match +
not-on-track + not-protégé); a mid-term swap rule when a better candidate appears; a positive-
trait floor preventing all-negative-leader cycles.)*

### 25.11 Kingmaker / endorsement preference rules

- **Kingmakers refuse to endorse** politicians with **Lowbrow / Easily-Overwhelmed / Unlikable**
  — corroborated multiple times (§A.1.3, §B, §C.1.2).
- **Anti-frontrunner "lowest score" preference in PL endorsements** (POSTs 5642, 6119, 6247):
  defeated CPU faction leaders endorse via **{closest ideology → highest PV → lowest score
  underdog}**. Late-round consolidation biases the underdog.
- **Kingmaker delegate math undecided** (POST 1949): GM toggles between "d6" and
  "d6 + kingmakers" for endorsement bonus. **Formula undecided.**
- **Age 35 required for Kingmaker role** (POSTS 80, 514, 1002) — **routinely violated** in the
  shipped behavior.

*(designed, not built — the trait-refusal filter on Kingmaker endorsements; the
closest-ideo → highest-PV → lowest-score underdog ladder; pick a final formula for the
Kingmaker endorsement bonus; enforce the age-35 floor on Kingmaker role assignment.)*

### 25.12 CPU primary AI (designer-acknowledged under-tuned)

> **The designer's own admission** (§C.1.7, POST 7135 — Tyler): *"I have tweaked how the CPU
> selects these actions to make them smarter… right now you can curb stomp the CPU bc it is
> simple and not always optimal when there is a clear answer."*

**Fixed action template** per candidate per state group (Speech + Campaign Focus + Attack
Rival + sometimes Embrace Local Issue + sometimes Presidential Promise). Each rolls 1d6 + trait
gates (POSTS 7135, 7154, 7173, 7184, 7195, 7207):

| Action | Effect |
|---|---|
| **Campaign Focus** | Charisma / Likable on 4-6 → +1 state; Celebrity+6 → +2 |
| **Speech** | Orator +1; Orator+6 → +2 |
| **Attack Rival** | Orator (state) / Debater (group) → −1 / −2; **roll of 1 backfires** (−1 to self) |
| **Embrace Local Issue** | 25% / 50% vs state's preference profile |
| **Scandal Rolls** | 1d6 before each group; Controversial = 2nd roll; **Integrity skips**; Teflon halves; Propagandist can avoid (POSTS 5129, 5174, 5514, 5523) |

**CPU attack target = highest-PV rival of opposite faction regardless of context** — no
underdog logic (Estella attacks Pershing repeatedly when Pershing is the runaway frontrunner).

**Pre-primary "Frontrunner" rule** (POSTS 5126, 7169):

- Out-of-power party → **Party Leader is the frontrunner**.
- In-power party → faction running a major with the highest points.
- Frontrunner determined by **Party Leader's faction** — can hurt CPU when the PL's pol is weak.
- Once primaries exist (Primary Era, [§24.3](#243-63-primary-era--state-opt-in-primaries--presidential-primary-groups-15)),
  the **primary winner is the frontrunner**, overriding the PL bonus (POST 6754).

**Presidential-promise acceptance** (POSTS 7173, 7184): target only accepts a withdraw-for-cabinet
bribe **if they hold less than half the delegate target needed to win**. **Hard rule.**
Acceptance rolls separately on ~0-100% scale modified by faction relationships (e.g. 63/50, 67/50).

**Broke roll** after debates/scandal: 1d6, **5-6 → drop out** (POSTS 5132, 5523); withdrawing
candidate's endorsement = **+1 Mo to target**.

**Primary state grouping** (POSTS 5708-5732): **Groups 1-3 cap at 3 primaries each** —
**implementation undocumented**; forum invented "pre-5 all in Group 1, then round-robin into
4-5 once 1-3 fill."

**Era trigger inconsistency** (POSTS 6754, 6755, 7163, 7165): **McGovern-Fraser legislation
requires 15 states to have primaries first**; **Women's Suffrage 1920 triggers all states to
have primaries** — flagged as inconsistent.

*(designed, not built — improve CPU primary AI: context-aware attack targeting (prefer rival
nearer to candidate vs runaway leader); a smarter frontrunner determination that doesn't lock
to PL's pol when the PL is weak; document the Primary-Group cap rule (3 per group 1-3, then
round-robin); reconcile the McGovern-Fraser vs Women's-Suffrage activation rules.)*

### 25.13 Faction-rename rule — Whig auto-rename to "Conservative Party" (deterministic)

> **New deterministic rename rule surfaced in `drums`** (§C.1.9; POST 7406). The rule shape is
> documented so the build can encode it and add more like it.

**Triggers ALL of**:

1. **No Republican Party exists.**
2. **Red Party leader has the Protectionist lobby card.**
3. **Blue Party has won 3 presidential elections in a row.**

→ *"The Conservative Party is formed."* New faction names auto-generated by appending
"Conservatives" (Conservative Conservatives, Moderate Conservatives, Wall Street Conservatives,
Liberal Conservatives, Progressive Conservatives). GM admits these are *"kinda stupid/silly"*
(POST 7407) — **lazy default, needs a configurable name pool**.

**Other rename triggers logged** (§B "Faction-rename rule"; §C.1.15):

- Leader gained Easily Overwhelmed → rebrand (POST 5844 Wall Street → Justice Whigs).
- Leader of wrong ideology → rebrand (POST 5846 Trad Dems → Bourbon Dems).
- Identity loss → rebrand (POST 6110 Justice Dems → Dewey Dems).

**Antebellum examples**: Wall Street Whigs → Clay Whigs → Dixon Whigs → Clay Whigs
(POSTS 87, 226, 337); Agrarians → Populist Dems-RW (POST 233).

**Other deterministic rename triggers (cross-era):**

- **Pop Sov Dems → Copperhead Democrats** on faction-leader secession.
- **Conscience Whigs → Abolitionists** on faction-leader secession (POST 856).

*(designed, not built — encode rename triggers as **predicate → name-generator** pairs; a per-
era authored names table + configurable name pool; the deterministic 3-condition trigger above
is the canonical shape for the build to instantiate. Cross-ref [§20.2](#202-the-10-faction-roster--per-era-nickname-relabel-fed-2-24-140-184).)*

### 25.14 Long-term Justice ideology drift (the canonical drift rule)

> **First disclosed verbatim in §C.1.10, POST 7533.** Already cited as a sharpening note in
> [§22.7](#227-scotus-subsystem-253--282); the full canonical rule:

**Every 10 years on the Court**, each Justice rolls:

| Roll | Effect |
|---|---|
| **25%** | Shift one step toward the **middle** |
| **10%** | Shift one step **left** |
| **5%** | Shift one step **right** |
| (else) | No shift |
| **Puritan trait** | **Blocks all shifts** |

Justice Hughes had already flipped factions twice on the Court (POSTS 6815, 6977) before this
rule was stated explicitly — the build was already applying *something* but it wasn't on paper.

**Other SCOTUS CPU heuristics** (§A.1.13):

- **"Votes Ideology" default**; **"Votes Cards" if case touches Justice's faction's lobby
  cards** (overrides).
- **Sway**: Debate / Manipulative attempts; **Integrity / Passive abstain** from being swayed.
- **Compelled Justice retirement** (POST 1142): Manipulative Pres can compel **1 justice** of
  either party to retire on d6 5-6 (~33%).
- **2 cases / half-term**; CJ can **delay a case**.
- **5-5 tie → lower court ruling stands** (Dred Scott 4-4 POST 726; randomized if not given).
- **Disputed electors** (POST 462): SCOTUS rules; **Integrity NOT consulted**.
- **Iron-Fist Pres compels cross-party justices without Integrity to vote Nay** (POST 3660 —
  Cobb compelled all Dem justices on Strauder).
- **Sway = ONE vote per swayer + only if initial vote not unanimous** (POSTs 4591, 4741, 5079).

*(designed, not built — the 25%/10%/5% mid-left-right drift per Justice every 10 yrs with
Puritan block; the votes-ideology vs votes-cards default-and-override; the d6-5-6 Manipulative-
Pres compelled-retire; the per-vote sway-only-if-not-unanimous rule. Cross-ref
[§22.7](#227-scotus-subsystem-253--282).)*

### 25.15 Critical missing CPU logic (architectural gaps)

> **§C.1.11-1.14, multi-confirmed across the arc.** These are the gaps the build **must own**
> as architectural CPU work — not rules tweaks. Cross-ref `game-context.md` DH-12..DH-22.

| # | Gap | Symptom | Architectural reason |
|---|---|---|---|
| 1 | **No reciprocity / vote-trading** | Confirmation/leadership votes swing 76-24 → 91-9 with **zero side-deals** (POST 4875). | CPU is pure faction-discipline; there is no agent-to-agent negotiation layer. |
| 2 | **No meter-guarding on scripted-event picks** | Under Roosevelt, both Quality of Life and Economic Stability crashed to crisis simultaneously: *"Internationalist + Pro-Federal-Government + Advocate New Freedoms triple-stack"* tanked all meters with no AI penalty (§C.1.11, POST 6280). | CPU evaluates each event option in isolation; doesn't track whether stacked effects all drive the same meter into crisis. |
| 3 | **No cascading-event smoothing** | Estella scandal → VP forced to resign → Pershing replaces with Hearst as VP → Pershing scandal one event later → Pershing resigns → **Hearst becomes President within days** of becoming VP (§C.1.14, POST 7389). | Cabinet-replacement chain resolves 3-deep in one event; no per-event smoothing for back-to-back at-most-once events. |
| 4 | **Governor menu static; no industry-stack awareness** | Fixed menu lookup mapped to faction identity (Theocrat → Prohibition / Abortion / Ban Evolution; Mining-state → Improve Mining; Liberal/Prog → Strengthen Labor Unions; Whig-Cons → Weaken Labor Unions; Reformist → Allow State Primaries; Transportation experience → Build Railroad; Big-Ag → Major Irrigation). **No awareness of state's existing industry stacks** — Improve Industry in a state already at 10/10 **fails silently** (§C.1.13). | CPU governor picks an action by archetype rule, never reads state's current industry levels or active policy flags. |
| 5 | **CPU running-mate logic ignores ticket experience holes** | CPU-Taft picked CPU-Hughes (both Justices, no prior electoral run); Tyler flagged as "weird strategy" (POST 7249). | CPU optimizes against the VP-rubric ([§25.2.1](#2521-the-8-element-vp-assessment-rubric-the-canonical-rubric)) but doesn't down-weight a ticket with zero prior electoral wins. |
| 6 | **CPU diplomacy = pure Sec-of-State driven** | No adversarial logic for negative-relations countries; Pres rubber-stamps. | One actor (Sec of State) drives all diplomacy actions; no opposing-CPU model for foreign powers. |
| 7 | **CPU keeps proposing weak bills at 10-10 / 11-9 ties** | No coalition-counting; CPU re-proposes losers in a stalemate. | No vote-prediction layer in the proposal heuristic. |
| 8 | **3-of-6 action-phase rolls do nothing** | Election action design weak; many rolls have no effect. | Roll tables aren't dense; needs more outcome bands. |

**Resolution status**: these are **not single-line rule fixes**. The build needs:

- A **reciprocity / promise tracker** (data structure for cross-faction commitments + an
  enforcement step on the next vote).
- A **meter-impact aggregator** that scores stacked effects against each meter and applies a
  CPU penalty for triple-stacks into already-bad meters.
- A **per-event "recent scandal cooldown"** that prevents 3-deep back-to-back resignations.
- A **state-aware governor action menu** that reads `state.industries` + `state.policies` + the
  Honest-Gov-maxed top-of-ladder rules ([§22.1](#221-the-named-meter-bank--numeric-debt--crisiscascade))
  and prunes no-op actions.
- A **ticket-experience term** in the VP-pick scorer.

*(designed, not built — these are architectural CPU additions; the rules to implement them are
spec'd above, but the data structures and the supporting passes are new work.)*
