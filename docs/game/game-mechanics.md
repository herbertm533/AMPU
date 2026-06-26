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
> - **Batch 7** — `6aa7309a` (9943-post "Era of Republicanism 1800–1868" multiplayer campaign,
>   `rep1800`): the **GAP-FILL** for the 1800–1856 early-republic band (Jeffersonian →
>   Era-of-Good-Feelings → Jacksonian → Manifest-Destiny, previously **uncovered**) and the
>   **biggest architecture delta in the KB**. The direct **predecessor of `gilded`** (same GM
>   `ebrk85`, identical roster — the 1800 campaign is now documented end-to-end). Adds a new
>   **[§27 Early-republic era systems & the era model](#27-early-republic-era-systems--the-era-model-designed-not-built)**
>   (8 subsections): the **★★ headline finding — eras are CONTENT-BANDS gated by game-state +
>   territory ownership, NOT calendar year** (the clock ran ~30 yrs behind its content; LA
>   Purchase fired 1834 — contradicts the shipped `year % 4` / `year % 2` era model); the
>   **era-boundary machinery** (faction-trade window + the +5/+3/+3/+3/−1 point-banking table +
>   draft-order-by-last-era-points); the **12th-Amendment election-mode toggle** (pre-12A
>   legislature-chosen electors + NO conventions, mirroring `senatePre17`); the
>   **slavery-as-state-flag + Cohens-v-Virginia amendment-only-abolition substrate**; the
>   **organize→admit statehood + unorganized-territory gating**; the **Second Bank recharter
>   clock + Bank War**; the **ideology-chart-becomes-a-CIRCLE** rule change; and
>   **amendments-mutate-core-params** (the "Sexenio" 6-yr-term/one-term/suffrage). Also **sharpens**
>   §23 (Civil-War alt-variants: early-CW-off-DomStab=1, President-defects-to-CSA, Hartford/Northern-
>   secession, UK theater, guerrilla 4th stage), §23.4 (the **★ solo Reconstruction blocker** —
>   Strict/Ironclad never passes with CPU, POST 9170 — + the hard-coded Red+2 design philosophy),
>   §26.4 (a **second meter-driven endgame shape**, the per-event-phase game-end roll), §15.3 (the
>   first-ever fully-recorded convention — resolves batch-1's VP/platform open-Q), and the
>   expansion map (Cuba=36th-state Caribbean region, Texas=4 states). The core loop is now
>   **corroborated across 5+ eras / 8 threads**. Cite `rep1800#POST N`. New design holes
>   DH-29..DH-35 logged to `game-context.md`.
> - **Batch 8** — two 1772-start threads: `afc6cbd7` (3614-post **first captured MULTIPLAYER
>   1772** campaign, 10 humans, 1772→~1796, founding→federalism, `afc6cbd7`) + `ad0f2875`
>   (157-post **solo all-CPU** 1772→1874 fast-traversal, "Stamping out America's love for tea",
>   `ad0f2875`). **Mostly SHARPENING** of the best-documented era (founding) plus the batch-7
>   era-model finding — additive, no new mega-section. **★ The era model is now MULTI-SAVE
>   CONFIRMED:** `ad0f2875` (1772-start) and `rep1800` (1800-start) emit **identical era-band
>   labels at identical in-game dates** (Federalists~1800 / Republicanism~1820 / Democracy~1840 /
>   Manifest-Destiny~1856 / Nationalism~1868) — two independent saves started 28 in-game years
>   apart traverse the same content-bands ⇒ the **most-corroborated architectural finding in the
>   KB** ([§27.1](#271--the-era-model--eras-are-content-bands-gated-by-game-state--territory-not-calendar-year)).
>   Sharpens [§27.2](#272-era-boundary-machinery-the-end-of-historical-era-phase) (**dual era-scoring**:
>   per-era winner + cumulative "winner so far", keyed to B#/R# slots);
>   [§24.6](#246-66-the-progressive-era-institutional-layer-offices-created-in-game-by-law)/[§26.5](#265-era-event-creates-office-bill-installs-a-new-cabinet-seat)
>   (founding-era **offices-by-law** — `afc6cbd7` stands up the *entire* federal apparatus
>   piecewise by bills: SCOTUS via 2 bills, Bank + President-of-Bank, Dept of Navy + SecNavy,
>   academies, DC, Library of Congress, Mint, Marine Corps); [§23](#23-civil-war--reconstruction-1856-arc-designed-not-built)
>   (a **3rd Civil-War outcome** — `ad0f2875` = neither defection nor UK intervention, proving the
>   branch points are variables; **concurrent multi-phase wars** — Mexican + Apache Rds 1–4 +
>   Navajo simultaneously; NW Indian War + Treaty-of-Greenville map expansion in `afc6cbd7`); and
>   the founding sections ([§17](#17-era-systems)) with the **MULTIPLAYER-1772 confirmation** (two
>   sequential 1772 drafts; full Constitutional-Convention machinery; the Washington first-President
>   d6 4-6 unopposed rule; **independence won by combat alone, no France event required**; the
>   Era-of-Independence ~⅓ phase-skip). Adds a small new subsection
>   [§21.9](#219-presidential-vote-modifier-stack--era-stamped-popularunpopular-issue-list-designed-not-built)
>   (the **presidential-vote modifier stack** + the **era-stamped Popular/Unpopular issue list**)
>   and small rules: **SCOTUS-overturns-a-ratified-Amendment** + **amendment-threshold-itself-
>   amendable** ([§21.3](#213-amendments-as-durable-separately-ratified-state)), **stat-collapse →
>   forced presidential resignation** ([§24.1](#241-61-succession--eligibility--the-acting-president-state)),
>   and the **lone-ideology minor-candidate convention EXPLOIT** ([§25.4](#254-convention-cpu--per-ballot-momentum--interballot-menu--compromise-picker)).
>   **★ NEGATIVE RESULT:** despite its title, `ad0f2875` **stalls at 1874 (mid-Gilded), reaching
>   no "future" era** — "Era of the Future" remains undocumented across **all** ingested threads.
>   New design holes **DH-36..DH-44** logged to `game-context.md`; **DH-36** (manual-upkeep GM
>   burnout killed `afc6cbd7`'s ~12-turn game) is the strongest cross-cutting case yet that the
>   build must own all bookkeeping. Cite `afc6cbd7#POST N` / `ad0f2875#POST N`.
> - **Batch 9** — `nuke` (a ~12k-post 1948→~2005 Cold-War/modern corpus, the largest in the KB):
>   the **chronological predecessor of `modern`**, completing a continuous 1772→2020 timeline. Adds
>   **[§28 Modern / Cold-War era (1948+)](#28-modern--cold-war-era-1948-systems-designed-not-built)**
>   (the 1948 boot, the **NEGATIVE-SCOPE finding** that the Cold War is the generic war engine
>   relabeled, the diplomacy subsystem, the gradual realignment, mutable cabinet + legislated SCOTUS
>   size, the two-level era model + per-decade census). **★ The strongest design-intent statement in
>   the KB**: the digital app is built **1-human-vs-9-CPU** — validating solo-first sequencing. New
>   design holes **DH-45..DH-58** + rows **#106..#114**. Cite `nuke#POST N`.
> - **Batch 10** — `cc37d770` (a 947-post "1820 — The Era of Democracy" 10-human multiplayer, the
>   **first 1820-START scenario** in the KB, `dem1820`): a short campaign (stalled ~1822–23, never
>   reached 1824/Jackson) that nonetheless produced a **concrete cluster of GA rulings + rule
>   clarifications** worth capturing as mechanics. Adds a new
>   **[§29 The 1820 "Era of Democracy" start](#29-the-1820-era-of-democracy-start--scenario-boot-the-full-18201840-arc-ga-rulings--forks-mostly-designedruled)**
>   covering the **★ scenario-boot procedure as practiced** (the live first-10 draft, the contested
>   **"strip Command from ≤40 boot pols w/o a job"** house rule, **inaugural career-track seeding from
>   the last 3 draft classes**, era-keyed industry init, Senate-class assignment, vacant-seat fill —
>   the canonical answer to gap **#115 "no rules for CREATING a game"**), the **GA appointment /
>   card-distribution / replacement-gains rulings**, and the **two unsettled design forks**
>   (player-controlled SCOTUS; the meter→enthusiasm→election model). Also **sharpens** §22.7 (the
>   player-SCOTUS fork: delay/dismiss is a player action, votes by ideology chart), §23.2 (the
>   sectional-balance crisis fires on imbalance in **either** direction — earliest observation, from
>   a 1820 start), §22.10/§29.5 (the **focus-Rep House abstraction: rep count = (EV−2)/5**, seat-locked
>   incumbency w/ census-year exception, vcczar POST 676), and §22.2/§21.8 (the meter→enthusiasm
>   processing rule + the **hard ±3 cap** on ideology/party-pref bonuses). Mostly **corroborates** the
>   gap log from a **3rd start year** (#92 era-bands, #1, #18/#51, #52, #55, #59, #44, #24, #76/#108,
>   #9, #20, #25b, #101, #61; DH-24/25/27/36/53/56). The only NEW gap is **#115**. **Polarity = 1788/1800
>   (BLUE = Democratic-Republicans, RED = dying Federalists / nascent National-Republicans), NOT the
>   1856 flip.** Cite `dem1820#POST N`. New design hole context logged to `game-context.md` (#115).
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
    - [21.9 Presidential-vote modifier stack + era-stamped Popular/Unpopular issue list](#219-presidential-vote-modifier-stack--era-stamped-popularunpopular-issue-list-designed-not-built)
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
    - [23.2 Free/Slave sectional-balance crisis scoring](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine)
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
    - [25.2 VP selection (retention RULED; 8-element rubric)](#252-vp-selection--retention-rule-ruled-was-designer-acknowledged-bug)
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
27. [Early-republic era systems & the era model (designed, not built)](#27-early-republic-era-systems--the-era-model-designed-not-built)
    - [27.1 ★ The era model — eras are content-bands gated by game-state + territory, NOT calendar year](#271--the-era-model--eras-are-content-bands-gated-by-game-state--territory-not-calendar-year)
    - [27.2 Era-boundary machinery (the "End of Historical Era" phase)](#272-era-boundary-machinery-the-end-of-historical-era-phase)
    - [27.3 The 12th-Amendment before/after state machine (era-specific election mode toggle)](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle)
    - [27.4 Slavery-as-state-flag + the Cohens-v-Virginia amendment-only-abolition substrate](#274-slavery-as-state-flag--the-cohens-v-virginia-amendment-only-abolition-substrate)
    - [27.5 Statehood-by-bill + unorganized-territory gating](#275-statehood-by-bill--unorganized-territory-gating)
    - [27.6 Second Bank recharter clock + the Bank War exec action](#276-second-bank-recharter-clock--the-bank-war-exec-action)
    - [27.7 The ideology chart becomes a CIRCLE (mid-era rule change)](#277-the-ideology-chart-becomes-a-circle-mid-era-rule-change)
    - [27.8 Amendments mutate core rules mid-game (the "Sexenio" experiment)](#278-amendments-mutate-core-rules-mid-game-the-sexenio-experiment)
28. [Modern / Cold-War era (1948+) systems (designed, not built)](#28-modern--cold-war-era-1948-systems-designed-not-built)
    - [28.1 ★ The 1948 modern boot](#281--the-1948-modern-boot-a-distinct-boot-alongside-1772--1856--2012)
    - [28.2 ★ The Cold War is NOT a system — generic war engine relabeled (negative scope)](#282--the-cold-war-is-not-a-system--it-is-the-generic-war-engine-relabeled-negative-scope)
    - [28.3 The diplomacy system (the real, working Cold-War subsystem)](#283-the-diplomacy-system--the-real-working-cold-war-subsystem-271--261)
    - [28.4 ★ The realignment — mechanically-but-gradually enforced](#284--the-realignment--mechanically-but-gradually-enforced-not-a-single-scripted-flip)
    - [28.5 Modern legislation, mutable cabinet & amendments](#285-modern-legislation-mutable-cabinet--amendments--the-1948-confirmations)
    - [28.6 The modern election machine — 1948-era refinements](#286-the-modern-election-machine--1948-era-refinements)
    - [28.7 Modern cabinet & the Era-of-Terror cabinet rework (2.3.1)](#287-modern-cabinet--the-era-of-terror-cabinet-rework-231)
    - [28.8 Civil Rights — era content via generic mechanics](#288-civil-rights--distributed-across-systems-the-canonical-era-content-via-generic-mechanics-example)
    - [28.9 The per-decade census + statehood/territory](#289-the-per-decade-census--statehoodterritory-the-level-b-census-mechanic)
    - [28.10 The ~25-sub-phase modern turn loop (scale note)](#2810-the-25-sub-phase-modern-turn-loop-scale-note)
    - [28.11 Modern draft, lobby cards & dataset](#2811-modern-draft-lobby-cards--dataset-the-era-locked-content-rotation)
    - [28.12 ★ Design intent (solo-first), open question, timeline seam](#2812--design-intent-solo-first-the-open-question-and-the-timeline-seam)
    - [28.13 Era-of-Terror content (2000–~2005)](#2813-era-of-terror-content-2000-2005-fired-in-the-late-game)
29. [The 1820 "Era of Democracy" start — scenario boot, the FULL 1820→1840 arc, GA rulings & forks (mostly designed/ruled)](#29-the-1820-era-of-democracy-start--scenario-boot-the-full-18201840-arc-ga-rulings--forks-mostly-designedruled)
    - [29.1 ★ The scenario-boot procedure as practiced (gap #115)](#291--the-scenario-boot-procedure-as-practiced-gap-115)
    - [29.2 ★ Unsettled fork A — player-controlled SCOTUS (gap #52)](#292--unsettled-fork-a--player-controlled-scotus-gap-52)
    - [29.3 ★ Meter→enthusiasm→election — #51 RESOLVED + #18 RESOLVED (terror2000 → V's 2-layer model) (gap #18/#51)](#293--the-meterenthusiasmelection-model--51-resolved-drums-4-step--18-resolved-terror2000--vs-2-layer-model-gap-1851)
    - [29.4 GA appointment & eligibility rulings (Senate fill order, card distribution, replacement-gains)](#294-ga-appointment--eligibility-rulings-senate-fill-order-card-distribution-replacement-gains)
    - [29.5 The focus-Rep House abstraction (gap #55)](#295-the-focus-rep-house-abstraction-gap-55)
    - [29.6 Corroborations & the era slice (1820–23)](#296-corroborations--the-era-slice-182023)
    - [29.7 ★ NEW — the Bank-War → Independent-Treasury economic engine (gap #116)](#297--new--the-bank-war--independent-treasury-long-run-economic-engine-gap-116)
    - [29.8 ★ NEW — the constitutional-amendment lifecycle (gap #119)](#298--new--the-constitutional-amendment-lifecycle-propose--committee--floor--governor-ratify--activeblocking-gap-119)
    - [29.9 ★ EXTENDED — death/assassination → VP succession → acting-president (gap #61)](#299--extended--deathassassination--vp-succession--acting-president-end-to-end-gap-61)
    - [29.10 ★★ The canonical 4-step enthusiasm-shift rule + crisis-bill-failure scoring (#51 RESOLVED)](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved)
    - [29.11 Batch-11 corroborations (the full arc), bugs & the roadmap hand-off](#2911-batch-11-corroborations-the-full-arc-bugs--the-roadmap-hand-off)
30. [Designer ruling index (`tedchange` — AUTHORITATIVE)](#30-designer-ruling-index-tedchange--authoritative)
    - [30.1 Rulings folded into existing topical sections](#301-rulings-folded-into-existing-topical-sections)
    - [30.2 Designer-decision-gated open items (`tedchange`)](#302-designer-decision-gated-open-items-tedchange)
    - [30.3 Rulings folded from `smallbugs` (vcczar spot rulings)](#303-rulings-folded-from-smallbugs-vcczar-spot-rulings)
    - [30.5 Rulings folded from `oopscpu` (Ted-run all-CPU 1788 stress-test)](#305-rulings-folded-from-oopscpu-ted-run-all-cpu-1788-stress-test)
    - [30.6 Rulings folded from `terror2000` (Ted-run 2000-start modern campaign)](#306-rulings-folded-from-terror2000-ted-run-2000-start-modern-campaign)
    - [30.4 Authority hierarchy reminder](#304-authority-hierarchy-reminder)
31. [Gilded-Age era systems (designed, not built)](#31-gilded-age-era-systems-designed-not-built)
    - [31.1 (#147) Tariff-as-national-%-rate + the mutually-exclusive MonetaryRegime](#311-147-tariff-as-national-rate--the-mutually-exclusive-monetaryregime-designed)
    - [31.2 (#148) 20-year auto-expiring Reconstruction regime + appointment-by-leadership + Solid-South bias sunset](#312-148-20-year-auto-expiring-reconstruction-regime--appointment-by-leadership--solid-south-bias-sunset-designed)
    - [31.3 (#149) Civil-service merit-vs-spoils axis (+ era-gated reform content)](#313-149-civil-service-merit-vs-spoils-axis--era-gated-reform-content-designed)
    - [31.4 (#150) "1872 Rule" — disorganized-loser runs opposite-party independents](#314-150-1872-rule--disorganized-loser-runs-opposite-party-independents-meter-gated-special-election-designed)
    - [31.5 (DH-63) Currency-regime exclusivity bug](#315-dh-63-currency-regime-exclusivity-bug-the-missing-relationship-constraint)
    - [31.6 Gilded content cluster + meta (corroborations, b14)](#316-gilded-content-cluster--meta-corroborations-b14)

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
| **Command** | `command: number` | `0–5` | leadership/military capacity; gates Kingmaker (`types.ts:1281`); decays via the Ted-RULED post-election "use-it-or-lose-it" 40%/−1 rule ([§14.1.z](#141z--ted-ruled-post-election-command-decay--shit-or-get-off-the-pot-designer-authoritative-oopscpu)) |
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
(`phaseRunners.ts:160`). *(Corroborated by `tedchange#POST 266` — vcczar: *"No drafting from
places that aren't territories, except if it's ME (part of MA) or WV (part of VA)"* — and
`smallbugs#POST 259-267`. RULED — no drafting from unorganized territories.)*

### 4.1.y ★ Ted-RULED draft rules (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange` POSTs 7, 47, 8-10, 48, 50, 14, 23.** These pin the
> draft mechanic in its current canonical form; **SUPERSEDES** earlier 5/5 random-grant
> values (see §24.8) and earlier 1/6-Command-on-random-skill readings.

| Rule | Ted's RULED setting | Cite |
|---|---|---|
| **Random-skill grant on draft** | random skill from the 6, **NO Command** can be drawn from this source | `tedchange#POST 7, 47` |
| **Can-Party-Flip cross-party draft** | **REMOVED** — politicians always enter at their **historically accurate party** at age 25; party-flip happens **later** via 2.1.6 conversion only | `tedchange#POST 8, 10, 48` |
| **Per-draft random-trait + random-alt-state grant** | **3 random traits + 3 random alt-states per draft** | `tedchange#POST 50` |
| **`Overeager` + `Late Bloomer` traits** | **REMOVED** from the trait library (universal agreement; "block player moves, nobody uses") | `tedchange#POST 14, 20, 23` |
| **★ #153 — 0-Command rookies + DOUBLED Command-gain (now OFFICIAL)** | **Nobody is born with Command; ALL rookies enter at 0 Command, and EVERY in-game Command-gain % is DOUBLED** to compensate — so Presidents emerge from in-game action, not real-world reputation. ebrk: *"both have been adapted into the official rules now."* (Reinforces the no-Command-on-random-skill rule above + #143 use-it-or-lose-it decay; aligns with the [§28.11](#2811-modern-draft-lobby-cards--dataset-the-era-locked-content-rotation) "earn it forward" framing — Ted nuked the 2000 cast's Command to first-term levels at boot.) | `terror2000#POST 91-93` |
| **★ #153 — no re-roll on already-held expertise (now OFFICIAL)** | When rolling to GRANT an expertise (committee assignment / career-track exit), **rolling an already-held expertise = NO new expertise (do NOT re-roll)** — a *wasted* roll. Effect: pols **master a few expertises** instead of becoming renaissance men. | `terror2000#POST 91-93` |

> **★ #153 build status (mixed SHIPPED / DESIGNED).** **(a) 0-Command rookies** is **partly
> SHIPPED** — the draft already sets rookie `command: 0` (`phaseRunners.ts:216`). **(b) the ×2
> Command-gain multiplier** is **DESIGNED, not built** (no global doubling on Command-gain rolls
> exists). **(c) no-reroll-on-held-expertise** is **DESIGNED, not built** (expertise-grant rolls do
> not currently waste a roll on a held tag). Reconcile with [§4.1.y `tedchange#POST 7,47`](#41y--ted-ruled-draft-rules-designer-authoritative-tedchange)
> (#136: random-skill draws no Command) — **same direction**: Command is never granted at draft and
> is hard to come by, so it must be **earned forward** and **doubled** to make Presidents reachable.

*(SUPERSEDES the earlier "5/5 random traits + alt-states per draft" reading documented in
[§24.8 Draft rookie grants re-ruled](#248-69-draft-rookie-grants-re-ruled--3-traits--3-alt-states)
— Ted RULED this at 3/3 in `tedchange`. The §24.8 number was the 1856-native re-rule already;
Ted now confirms 3/3 is the canonical going-forward value.)*

### 4.2 Picking — `pickBestForFaction` (`phaseRunners.ts:33`)

Score each eligible candidate = `pvCache + 25` if the candidate's ideology matches the
faction's personality bucket (LW↔{LW Pop, Prog, Lib}; RW↔{Cons, Trad, RW Pop};
Center↔{Mod, Lib, Cons}); **1772 inaugural** adds `+50` for an ideology the faction is
eligible to claim (`FACTIONS_1772.eligibleIdeologies`, `factions1772.ts:12`). Highest score
wins, ties by id. Recording (`recordDraftPick`, `phaseRunners.ts:55`) stamps
`factionId/partyId/draftedYear`, removes from pool, logs, and appends to `draftHistory`.

After the draft, `runDraftKingmakerTopUp` raises each faction to the Kingmaker floor (see
[§6.5](#65-217-kingmakers--protégés)).

### 4.3 ★ OC-4 — CPU draft ideology-distance gate (OPEN; needs human design call) + draft-order bonus timing (`oopscpu`)

> **★ OC-4 (NEW, OPEN — needs a human design call). DESIGNED, not built.** The shipped picker
> ([§4.2](#42-picking--pickbestforfaction-phaserunnersts33)) gives only a **+25 ideology-match
> bonus** — it does **not gate** off-ideology picks, so a high-PV off-ideology star can still
> outscore an on-ideology pol and be drafted.

**The gap (`oopscpu#POST 227-228, 234`):** both **left-of-center** factions (Euri, Largo)
**headhunted Andrew Jackson (RW Populist)** because the CPU has a *"25% chance the CPU will try
when there's a better pol meeting their rolled goal outside ideology."* This produces **incoherent
rosters** — an off-ideology drafted pol **can never become faction leader and can never run for
President** for that faction, so the pick is wasted on a star who can't lead.

**The open design tension (no fix ruled):**

| Option | Problem |
|---|---|
| (a) Draft the strong off-ideology pol | He can never lead / never run Pres → wasted star, incoherent roster |
| (b) Hard ideology-distance gate (Zagnut's proposed **2.1.6-style "pliable + same-or-adjacent ideology"** gate) | Lets a strong pol sit uncontested; over-restrictive |
| (c) Ted wants **"a better third way"** | undefined — **OPEN** |

The build should treat the **off-ideology draft gate as an OPEN design hole**, not silently
implement either extreme. (Cross-ref [§25.1](#251-candidate-selection-open-seats-primaries-conventions--the-7525-rule).)

**★ Procedural ruling — 9th/10th-place draft skill bonus = first PICK, not first ROUND
(`oopscpu#POST 239`, Ted-RULED).** The skill bonus a 9th/10th draft-position faction receives
applies to that **faction's FIRST DRAFTED politician**, **not its first-round attempt** — so if the
first-round attempt **failed** (no eligible pick), the bonus lands on the **first pol actually
drafted**. (A draft-bookkeeping rule the build must honor when it adds draft-order bonuses.)

*(designed, not built — **OC-4: leave the off-ideology draft gate OPEN** (do not silently ship a
hard gate); the **9th/10th draft-order skill bonus must attach to the first ACTUAL pick** not the
first-round attempt. Cite `oopscpu#POST 227-228, 239`.)*

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

- **★ Per-faction relocation cap: 4 attempted moves per half-term** (SETTLED, vcczar approved
  12-30-25; `smallbugs#POST 734-735`). Verbatim ruling: *"A faction is limited to FOUR total
  attempted moves per half-term. A politician that moves to an ALT-STATE does NOT count against
  the FOUR total moves. (Approved by vczar 12-30-25)."* **SUPERSEDES** the long-debated open
  question and the contradictory `rep1800` "unlimited" ruling. **The shipped build is still at
  `RELOCATION_ATTEMPTS_PER_TURN = 5` (`types.ts:247`)** — direction is **lower to 4**, and this
  ruling closes the QW0/BUG-0 question (see [§19.1 #9](#191-design-divergences-for-the-roadmap)).
  Forum framing also names current "overpopulated" and "underpopulated" state lists (post 27:
  `IA, IL, KS, MA, MI, NY, OH, PA, WI` overpop; `AR, CU, ET, MS, NT, SC, ST, WT` underpop) — a
  non-mechanical reminder, but it implies a **`State.population` axis** and overpop/underpop
  computed from member counts. *(designed, RULED — set `RELOCATION_ATTEMPTS_PER_TURN = 4`,
  exclude alt-state moves from the cap. Relate to existing `RelocationBand` `types.ts:1671`.
  Cite `smallbugs#POST 734-735`.)*
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

- **Base budget**: 3 shifts per faction. **3 shifts / half-term cap holds across the
  cabinet-enthusiasm rework** (Ted's POST 4 in the change-log + the cabinet rework #124,
  §9.3.7 below).
- **Leader-trait bonuses** stack additively, cap **9 total**:
  - Iron Fist leader: **+2**
  - Propagandist leader: **+1**
  - Manipulative leader: **+1**
  - Faction-leader-is-also-Party-Leader: **+2**
- Players spend the budget interactively on chosen politicians; engine rolls
  per-attempt success but the **count of attempts is forum-budgeted**, not engine-budgeted.
  *(design divergence — shipped engine rolls per-pol with no faction cap; forum has a hard
  per-faction cap of 3-9.)*

#### 6.3.y ★ Ted-RULED ideology shift schedule (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's official rule patches, sequenced across `tedchange` POSTs 18-31, 51.**
> Cross-references the [§27.7 ideology-as-CIRCLE finding](#277-the-ideology-chart-becomes-a-circle-mid-era-rule-change)
> (now a **3rd-thread corroboration**: `rep1800` + `nuke` + Ted's explicit declaration here).

**Ted POST 24 verbatim:** *"all ideologies are now a CIRCLE, rather than a line."*

| Shift type | Base success | Notes |
|---|---|---|
| **Self / drift one step** | 50% (existing) | normal mult'd by traits |
| **★ Cross-circle LW Populist ↔ RW Populist** | **25%** | half the normal rate; **on success, the target also gains the `Two-Faced` trait** as a penalty (`tedchange` POST 28-29) |
| **Adjacent shift not crossing the LW↔RW seam** | 50% (existing) | standard |

**Integrity blocks at 10%; Puritan blocks at 0%** (`tedchange` POST 31; the "outlier protection"
against, e.g., Bernie → Trump trivially flipping). Two-Faced penalty applies **only on the
LW↔RW cross-circle flip**, not on every cross-ideology shift.

*(designed, RULED — wire `distance = min(|a−b|, 7−|a−b|)` (circular metric per §27.7); at
distance-1-via-seam, use the 25% base instead of the 50% base; auto-add `Two-Faced` on the
successful cross-seam flip. Cite `tedchange#POST 18-31, 51`.)*

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

#### 6.4.y ★ Ted-RULED conversion-rate schedule (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's official patches, `tedchange` POSTs 34-39, 38, 52, 53.** SUPERSEDES
> the earlier "same-only" same-party flip rule and the 25%/75% flat rates surfaced in playtests.

| Conversion | Ted's RULED rate | Notes |
|---|---|---|
| **Can-Party-Flip cross-party flip** | **33% base** | down from 75% (modern eras too lenient); up from a proposed 25% (only ~30% of pols qualify in cross-eligibility). **Removed the special-Moderates rule** that earlier gave Moderates an extra cushion. (POST 34-39, 52.) |
| **★ Same-party flip eligibility** | targets may be **same OR adjacent ideology** | was same-only (too restrictive — "the same few pols always get targeted"). Universal community support; Ted RULED POST 38, 53. Pairs with the ideology-as-circle change (#127, §6.3.y): the "adjacent" set wraps the seam under the circular metric. |

**Sharpens the gap log:** corroborates #76 (CPU conversion) + #99 (ideology circle) — the
adjacency relaxation now applies to **both cross-party AND same-party** conversion.

*(designed, RULED — pin cross-party-flip base at **33%**; relax same-party flip targeting to
**same OR adjacent ideology**; remove the special-Moderates carve-out. Cite `tedchange#POST
34-39, 38, 52, 53`.)*

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

#### 6.5.y ★ Ted-RULED Kingmaker scope + trait-inheritance allowlist (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's official patches, `tedchange` POSTs 201-208, 279-283, 316.**
> **SUPERSEDES** the prior "either-or" reading (Matt's playtest reading: Kingmaker = +1 state
> only OR Master = +1 national only, not both) that the `nuke`/`pop` playtests operated under.

**Kingmaker / Master Kingmaker bonus scope** (`tedchange#POST 316`, RULED):

| Tier | +1 scope (state-bias bonus to candidate selection / elections) |
|---|---|
| **Kingmaker (basic)** | **+1 in the Kingmaker's own state ONLY**, applying to **that state's presidential primary** + **that state's presidential general** |
| **★ Master Kingmaker** | **+1 in EVERY state** — all presidential primaries + all general-election state contests, the **basic +1 is REPLACED with the national +1 (which also includes the home state)** |

*(SUPERSEDES Matt's "+1 state only OR +1 national only" reading observed in `nuke` / `pop`
playtests, `tedchange#POST 302-320`.)*

**Kingmaker → Protégé trait allowlist / blocklist** (`tedchange#POST 201-208, 279-283`, RULED):

| Trait | Inheritable? | Notes |
|---|---|---|
| **Master Kingmaker / National Kingmaker** | **BLOCKED** | "OP enough that it can't be passed" (POST 281) |
| **Kingmaker (basic)** | **ALLOWED** | basic-tier inheritance OK (POST 283) |
| **Frail** | **BLOCKED** | "represents cancer you can't teach" (POST 281) |
| **Hale** | **ALLOWED** | "represents lifestyle teaching" (POST 281) |
| **Flip-Flopper** | **BLOCKED** | always-blocked |
| **Two-Faced** | **BLOCKED** | always-blocked |
| **Celebrity** | **ALLOWED** | passable (POST 207) |
| **All other positive traits the Kingmaker has** | **ALLOWED** | general allowlist default |

*(designed, RULED — pin the bonus scope per-tier with **Master = +1 in every state**; encode
the trait allowlist/blocklist explicitly in the Kingmaker→Protégé transfer pass. Cite
`tedchange#POST 201-208, 279-283, 316`.)*

#### 6.5.z ★ Ted-RULED Kingmaker draft-CPU fix (`tedchange`)

> **`tedchange#POST 40-41, 54` RULED.** Sharpens the [§4 Draft](#4-draft-211) +
> [§25.11 Kingmaker endorsement preference rules](#2511-kingmaker--endorsement-preference-rules).

When the CPU drafts a Kingmaker but **no matching-ideology protégé pool exists** in the
faction, the CPU has a **100% chance to attempt a 1-step ideology shift of the Kingmaker**
toward a potential-protégé's ideology — *if a 1-step shift is feasible* (i.e., the Kingmaker
isn't already maximally far from the available protégés). (Umbrella POST 40.)

*(designed, RULED — engine `runPhase_2_1_1_Draft` post-pass: if the new Kingmaker has no
ideology-matched protégé candidates among faction members, attempt the 1-step shift; otherwise
leave the Kingmaker as-is. Cite `tedchange#POST 40-41, 54`.)*

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

#### 8.5.2.y ★ Ted-RULED Faction Leader trait-gain rates + Passive block (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange` POSTs 62, 67-79.** RULED. Refines `smallbugs#POST 357`'s
> "MOSTLY ADOPTED" placeholder by pinning the per-cycle percentages.

| Rule | Ted's RULED setting | Cite |
|---|---|---|
| **Positive trait gain rate per FL cycle** | **5%** (every time as FL) | `tedchange#POST 79` |
| **Negative trait gain rate** | **3%**, **first-time-as-FL only** (not every cycle) | `tedchange#POST 79` |
| **Passive auto-disqualifies** from FL | **100% blocks** (was 25%) — **EXCEPTION**: an elected President always becomes FL regardless of Passive | `tedchange#POST 62` |

**Implications:**
- Positive traits compound over a long FL tenure.
- Negative traits are a one-time risk gate at promotion.
- The Passive 100% rule eliminates the previous lottery and codifies the "elected Pres always
  takes the FL slot regardless" rule (the "President Oprah exception", `tedchange#POST 62`).

*(designed, RULED — pin the trait-gain rates at 5% positive (per cycle) / 3% negative (first-
time only); change Passive FL gate from 25% block → 100% block, with the elected-Pres exception.
Cite `tedchange#POST 62, 79`.)*

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

#### 9.3.7 ★ Ted-RULED cabinet → enthusiasm REWORK (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's official rework, `tedchange` POSTs 1-4. RULED IN CONCEPT; specific
> percentages OPEN (parked in [§30.x designer-thread-open items](#30-designer-ruling-index-tedchange-authoritative)).**
> SUPERSEDES the current lobby-driven cabinet-enthusiasm path that gap #31 (digest D / `gilded`
> POSTs 33, 87, 125) characterized as "lobby satisfaction → cabinet enthusiasm overwhelms
> presidential signal" and that batch-3's ±3 swing cap (gap #80) partially patched.

**The rework — two independent channels:**

| Channel | Driver | What it now affects |
|---|---|---|
| **★ Points (lobby satisfaction → cabinet)** | **Lobby-card matching** between cabinet members + Pres + factions | **Bonus POINTS** to the President + factions that hold the matching lobby cards (the lobby-side path) — **NOT enthusiasm** |
| **★ Enthusiasm (ideology composition)** | **Ideology composition of the cabinet** | **≥50%** of cabinet of an ideology → **+enthusiasm** for that ideology; **≤20%** representation → **−enthusiasm** for under-represented ideology |

**Stays in place:**
- **3 shifts / half-term cap** (Matt POST 4) — the [§6.3.x ideology-shift budget](#63x-forum-design-layer-per-faction-shift-budget-designed-not-built) cap holds.

**Open (designer-decision-gated):**
- The precise percentages — Big-4 / rest-of-cabinet / cabinet-level may be weighted
  differently (Matt POST 4 proposed Big-4 33%, others 25%). Ted parked the numbers for later.
- Whether Big-4 / rest-of-cabinet / cabinet-level get distinct ideology-enthusiasm weights
  at all (POST 4).

> **★★ SHARPENED (batch 15 `terror2000`): Ted RE-TUNED the enthusiasm channel LIVE to a 3-state
> "upset / fine / happy" model — designer-authoritative.** During the 2000-start Ted found the old
> "stacking happiness" enthusiasm rule **completely broken**: it gave **Moderates +18 (capped to
> +3) off ONE cabinet** because **happiness could stack while unhappiness could not** ("that's
> skewing results," `terror2000#POST 486-488`, ebrk concurring). Ted reworked it **live** (`POST
> 489`, *"I'm thinking this is what we'll follow"*). This **moves the `tedchange` cabinet-enthusiasm
> percentages from OPEN toward RESOLVED** (parked item in [§30.2 #8](#302-designer-decision-gated-open-items-tedchange)).

**The 3-state cabinet→enthusiasm model (`terror2000#POST 489`)** — counts, **per faction**, how
many of the **lobby cards it wants** are satisfied by the cabinet composition:

| Faction's wants satisfied | State | Enthusiasm roll |
|---|---|---|
| **≥1** (got at least one) | **fine** | **no impact** (0) |
| **>1** (got more than one) | **happy** | **20% / 10% chance of +1 enthusiasm** |
| **0** (got none) | **upset** | **20% / 10% chance of −1 enthusiasm** |

- **ONE roll per faction** — no per-card stacking within a faction (the bug fix).
- **Multiple same-ideology factions DO stack their impact** on that ideology's enthusiasm box
  (each faction rolls once; the resulting ±1s sum on the shared ideology box).
- **HARD ±3 cap** on the aggregate shift (the cross-era swing cap, [§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter)) — so unhappiness can now reach −3 too,
  symmetric with happiness (the asymmetry that produced the Mod +18 bug is removed).

This is the **enthusiasm channel** of the two-channel rework above (it supersedes the bare
"≥50%/≤20% ideology-composition" sketch); the **points channel (lobby→points)** is unchanged. The
20%/10% split is the per-state base/secondary-roll probability (matching the §6.3.y-style roll
structure); whether 20% is the Big-4 weight and 10% the rest-of-cabinet weight is the only residue
of the §30.2 #8/#9 open items.

> **★ PAIR with the #151 cabinet appointment-FAIRNESS penalty** (NEW, Era-of-Terror-gated): on top
> of the enthusiasm channel, an **unfair distribution of appointments across same-party factions
> costs −500 points per slighted faction** — see [§9.3.9](#939--ted-ruled-era-of-terror-cabinet-fairness--diversity-penalties-151-designer-authoritative-terror2000). The two cabinet penalties (the #151 same-party
> fairness penalty + the Era-of-Terror DIVERSITY penalty) operate **together natively in a
> 2000-start**, alongside this enthusiasm channel.

*(designed, RULED — wire two independent channels (points-via-lobby + enthusiasm-via-cabinet-wants).
The lobby points-channel REPLACES the current cabinet-enthusiasm-via-lobby path (gap #31); the
**enthusiasm channel is now the `terror2000` 3-state upset/fine/happy model**: per-faction count of
satisfied wants → fine(0) / happy(+1 @20%/10%) / upset(−1 @20%/10%), one roll/faction, same-ideology
factions stack, ±3 cap. Cite `tedchange#POST 1-4` + `terror2000#POST 486-489`. The only open numbers
are the Big-4-vs-rest enthusiasm weighting (§30.2 #8/#9).)*

#### 9.3.8 ★ Ted-RULED nomination filters (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange#POST 277`, RULED.** A NEW rule resolving a previously
> contradictory rules-doc state where Integrity chairs nominated Controversial pols and then
> voted Nay on their own nomination.

**Integrity-trait pol CANNOT nominate a Controversial-trait pol** to any office (CPU + human
players). Applies to all nominator roles (President, party leader, faction leader, committee
chair, governor).

**Cabinet confirmation thresholds (CC-era + sharpening):** the **Controversial-nominee
confirmation threshold pre-Constitution = 60% of the TOTAL states** (8 of 13 in the
1772/1788 CC; Umbrella raised the ambiguity, Ted RULED in `tedchange#POST 276-277`).

*(designed, RULED — add an Integrity → cannot-nominate-Controversial precondition to all
nomination pickers; encode the 60%-of-states CC-era confirmation gate. Cite `tedchange#POST
276-278`.)*

#### 9.3.9 ★ Ted-RULED Era-of-Terror cabinet FAIRNESS + DIVERSITY penalties (#151) (designer-authoritative; `terror2000`)

> **AUTHORITATIVE — Ted's NEW Era-of-Terror-gated cabinet rules (`terror2000#POST 1280, 428, 434,
> 441`). RULED, designer-authoritative. DESIGNED, not built.** Two distinct point/enthusiasm
> penalties that activate **from the Era of Terror onward** (a §27.1 era-BAND rule delta — proof
> that bands carry rule changes, not just content) and **operate together natively in a 2000-start**,
> on top of the §9.3.7 enthusiasm channel. Pairs with #124 (cabinet→enthusiasm) + #16/#25
> (appointments). Corroborates the `nuke`-sourced [§28.7](#287-modern-cabinet--the-era-of-terror-cabinet-rework-231) Era-of-Terror cabinet rework (which first surfaced both as digest-hole sketches).

**(a) ★ #151 — same-party appointment-FAIRNESS penalty (NEW; twice-fired LIVE).** Ted, verbatim:
*"From the Era of Terror on through the future, the president must balance appointments for ALL
same-party factions equally (including their own). Failing = −500 points per slighted same-party
faction"* (`terror2000#POST 1280`).

| Property | Value |
|---|---|
| **Penalty** | **−500 points** per **slighted same-party faction** |
| **Scope** | ALL factions of the President's party, **including the President's own faction** |
| **Era gate** | **Era of Terror onward** ("through the future") |
| **Fired LIVE (twice)** | **Bush −2000** (over-appointed Zagnut, >3× any other Red faction); **Oprah −2000** (over-appointed *himself*, `POST 154` ch27) |

- **Distinct from the cabinet-DIVERSITY penalty (b)** and from the enthusiasm channel (§9.3.7) —
  this is a flat **point** (Score-economy) penalty, not an enthusiasm shift.
- **−2000 = four slighted factions × −500** (the live Bush/Oprah cases both hit four same-party
  factions), confirming the per-faction multiplication.

**(b) ★ Era-of-Terror cabinet-DIVERSITY penalty — ACTIVE natively (corroborates #124).** Ted asked
for **female / racial-minority flags** on the Executive tab: *"It's relevant for Era of Terror
cabinet appointments, triggering penalties if certain levels aren't met"* (`terror2000#POST 428,
434, 441`). Corroborates the [§28.7](#287-modern-cabinet--the-era-of-terror-cabinet-rework-231) `nuke` formulation: factions holding **Civil Rights /
Reformist / LW-Activist** cards take **−2 faction enthusiasm** if **<25%** of cabinet +
cabinet-level are women / racial minorities. (So BOTH Era-of-Terror cabinet penalties — diversity +
same-party fairness — fire in a 2000-start, replacing the pre-Terror region-coverage election malus,
[§9.3.3](#933-region-coverage-election-malus).)

**Open (for the human, per the digest):** is #151 a **flat −500 from the Era of Terror through the
future**, or should it be **scaled by the size of the imbalance** / era-tuned? Ted applied it flat.
(Logged `game-context.md` #151 open question.)

*(designed, RULED — add, gated to the Era of Terror onward: (a) a same-party appointment-distribution
check that counts appointments per same-party faction (incl. the President's own) and applies −500
per faction that received zero / disproportionately few; (b) the diversity check (<25% women/minority
in cabinet + cabinet-level → −2 enthusiasm to Civil-Rights/Reformist/LW-Activist factions). Both
replace the pre-Terror region-coverage malus (§9.3.3) — a §27.1 era-BAND rule delta. Cite
`terror2000#POST 1280, 428-441, 154`.)*

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

#### 10.1.y ★ Ted-RULED death + retirement schedule (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange` POSTs 89-100, 137-148, 150-151, 178-184, 195-197, 396.**
> RULED. **SUPERSEDES** prior playtest-by-playtest GM improvisations on Hale immortality + ex-Pres
> retirement (Bushwa's John Adams "undead" loop). Corroborates **Orange's 5%-of-faction-max
> formula** independently surfaced in `smallbugs#POST 195-197` and `drums#POST 5437`.

**Rate model:**
- **★ 5%-of-faction-max retirement rate per half-term** (Orange's POST 195 formula, accepted POST 196).
- **Era-scaled retirement percentages**:
  - **Modern era**: retirements at **60-65** at **near-0%**; scale toward **80** (60-year-olds
    very rarely retire; octogenarians frequently do).
  - **Independence/Federalism/Nationalism**: shipped engine's higher base era multipliers
    (independence 0.5 → modern 1.5 on retire) hold; modern era is the carefully-tuned regime.

**Roll order** (the **designer-authoritative** processing order, POST 148):
1. **Death rolls FIRST**, processed **Frail-trait first**, then **oldest to youngest** for the rest
   (Matt's "fill up the Frail % first" method, POST 151).
2. **Retirement rolls SECOND**, processed **oldest to youngest** *regardless of trait* (no Frail
   priority on retire).
3. **Ability decay / trait decay** then run as today.

**Hale trait — death modifier** (POST 143, RESTORED original rule):
- **Hale = ½ chance of death** (not 0% — the buggy 0% reading produced John-Adams-immortal in playtests).

**Frail trait — death modifier**: already in shipped `MORTALITY_RULES`: Frail × 1.5 death; remains.

**★ Retired ex-Presidents ONLY roll for DEATH, not for retirement** (POST 396, RULED):
- Closes the "John Adams immortal" loop where Hale + retired-already meant neither roll ever fired.
- **SUPERSEDES** the various playtest-by-playtest GM improvisations (some GMs ran retirement-rolls
  on ex-Pres; some treated Hale as immortal — both wrong by Ted's call).

**President / VP retirement-eligibility** (POST 105-108, 169-172, RULED):
- **Pres + VP age ≥60** are eligible to hit retirement rolls, but this means **"announce won't run
  for re-election"** — they finish their current elected term first, **not instant departure**.

**Auto-retire at 100** (POST 178-184, confirmed-preexisting):
- Already in the rules at 2.10 — pols auto-retire at the **beginning of an election cycle** at
  age **100**. Confirmed unchanged.

**Cabinet ex-Pres timing** (POST 396):
- A cabinet member who is an ex-Pres retires at the **END of their cabinet half-term**, NOT
  immediately on appointment.

> **Corroboration cluster:** the **5%-of-faction-max rate** is now multi-thread confirmed
> (Orange in `smallbugs#POST 195-197`; designer patches in `drums#POST 5437` to the same rate;
> Ted accepts in `tedchange#POST 196`; `arkzag#POST 313/319` itemizes it as **3% retirement +
> 2% death** per faction-half-term, which sums to the same 5%). Treat the **3%/2% split** as the
> canonical decomposition.

*(designed, RULED — implement: (a) 5%/half-term rate decomposed as 3% retire + 2% death; (b) era-
scaled retirement %s tuned with modern 60-65 near-0%; (c) Frail-first death-roll order; (d) Hale
= ½ death modifier (restore original); (e) ex-Pres → death-rolls only (no retirement re-rolls);
(f) Pres+VP age-60 retirement = "won't run for re-election" (term completed first); (g) cabinet
ex-Pres retires at end of half-term not on appointment. Cite `tedchange#POST 137-148, 195-197, 396`.)*

### 10.2 (2.4.2) Anytime events — `runPhase_2_4_2_Anytime` (`phaseRunners.ts:2782`)

Constants `ANYTIME_EVENTS_RULES` (`types.ts:1073`). Two pools:

- **National** (`anytimeNationalEvents.ts`): fires at `0.70 × nationalFireMult`
  (era: 0.9/0.95/1.0/1.1). Weighted pick; applies meter/preference effects.
- **Personal** (`anytimeEvents.ts`): each politician at `0.05 × fireMult`
  (era 0.8/0.9/1.0/1.1), filtered by era + the politician's region. Can grant traits, bump
  skills/command (cap 5), kill, or force retire. Scandal-scaled events escalate by
  `scandalMagnitudeMult` (era 0.5/0.7/1.0/1.3): `≥1.0` tries `Corrupt`; `≥1.2` adds flip-flop.

#### 10.2.y ★ Ted-RULED AnytimeEvo target-pool tightening (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange` POSTs 249-275, 255, 267, 271.** RULED. **SUPERSEDES** the
> earlier "random politician" scoping on the affected events. **AnytimeEvo events 5, 17, 23, 24,
> 25, 39, 66, 117, 118, 119** were specifically modified.

| Class of event | Old target pool | Ted's RULED new target pool |
|---|---|---|
| **Random-pol +1 Command-on-Manipulative/Leadership/Charisma** | any random politician | **only random Rep / Senator / Governor / Cabinet member** |
| **★ Assassination attempt** | any random politician | **50% Pres / 25% random Rep or Senator / 25% random faction leader** (POST 267) |

**Natural-disaster state lists** (POST 255-275, RULED):
- **Drought list updated** (CA was missing — added).
- **Hurricane list** restricted to historical hurricane-prone states; **GA added**; **MA / RI
  rejected** as hurricane-eligible.
- **Earthquakes**: unchanged.
- **Major floods**: any state allowed (incl. AZ + NV per real-world data).

*(designed, RULED — restrict the AnytimeEvo target pools per the table; update the natural-
disaster state-eligibility lists; reweight the assassination-target roll to 50/25/25. Cite
`tedchange#POST 249-275`.)*

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

#### 10.4.5 ★ OC-8 — "What is an office?" definition gap for forced-out events (OPEN; flagged to `@vcczar`)

> **★ OC-8 (NEW, OPEN — author-time definition gap). DESIGNED, not built.** Surfaced by `oopscpu`'s
> all-CPU run (`oopscpu#POST 334, 336`); Ted flagged `@vcczar` — **not a ruling, a request for an
> author decision + event-text rewrite.**

The **"Scandalous Non Office Holder"** event narrative says *"force them out of office"* — but it
**targets a politician who holds no elected/appointed office.** That exposes an undefined term: the
forced-out event family needs a canonical answer to **"what counts as an office?"** —

- Is a **career track** ([§5](#5-career-tracks--the-expertise-pipeline-212)) an office?
- Is **faction leader** or **party leader** (with no other post) an office?

Until "office" is defined, a forced-out event can fire on a target with **nothing to force them out
of**, and the event text contradicts itself. This is the **events-side twin** of the OC-1 scandal
gap (§25.5.4): OC-1 = the CPU recycles a scandal-resignee; OC-8 = the event can't even tell whether
the target *holds* the office it's supposed to remove. (Pairs with the Haitian-Revolution /
Scandalous-Non-Office-Holder **era-event-text-refresh** items flagged to vcczar — §30.2 carry.)

*(designed, not built — author task: **define "office"** for the forced-out event family (career
track yes/no; faction/party leadership yes/no) and **rewrite the "Scandalous Non Office Holder"
event text** to match. OPEN — needs a vcczar author call. Cite `oopscpu#POST 334, 336`.)*

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

#### 11.1.y ★ Ted-RULED Lingering 7-step strict ordering (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange` POSTs 397-408 (Oct 2025 resumption).** RULED. Sharpens
> [§24.7 Lingering — the ~16-meter homeostasis engine](#247-67-lingering--the-16-meter-homeostasis-engine-era-gated-foreign-meters)
> with the **strict step-order + decay carry-forward** rule. Resolves the "volatility and
> tax decay are after lingering effects two steps before — ass-backwards" clarification Ark
> raised (POST 397).

**Step order — runs 1→7 IN ORDER, NEVER RE-DONE within a single 2.5.1 pass:**

| Step | Operation | Notes |
|---|---|---|
| 1 | **Top/bottom-2 econ effects** | (per §24.7) |
| 2 | **Maxed-meter caps** | Mil-Prep + Planet-Health hard-capped at 8 |
| 3 | **★ Lingering bill/action effects (incl. tax/tariff DECAY)** | the **carry-forward step**; tax/tariff decay adjustments from previous half-terms land here |
| 4 | **Middle-of-meter revision-to-mean drift** | `−1` toward 0 from the middle bands |
| 5 | **Administrative modifications** | each cabinet officer rolls `±` based on department's meter |
| 6 | **Ongoing wars + corruption** | (per §24.7) |
| 7 | **★ Volatility rolls (tax/tariff)** | THIS-PHASE-ONLY — **NOT added to running totals**; the volatility roll determines the swing for the current Lingering pass, then is discarded |

**★ Decay carry-forward rule** (POST 404-405, RULED):
- Tax/Tariff Decay adjustments are not applied to the CURRENT 2.5.1 pass at step 7 — they
  **propagate forward** into the **NEXT half-term's step 3**.
- Bills expire 10 years after passage (tax bills); tariff rate is **locked for 8 years**
  after a change.
- The decay never re-cycles within the same Lingering pass — Ted's rule: *"follow the steps
  in order — never re-do"* (POST 404).

> **★ Debt-table meter effect = roll the CATEGORY, then the bonus/penalty — ONE meter only
> (`oopscpu#POST 148-153`, Umbrella's correction, Ted-agreed).** The **debt level's** Lingering
> effect does **not** hit all meters. Instead it: **(1) rolls WHICH meter the debt level may hit**
> (a category roll), then **(2) rolls WHETHER it actually hits** that one meter (the
> bonus/penalty). **N/A categories are skipped** — just roll the **Rev/Budget** effect. This
> refines the step-3 Lingering debt step (#67 / #88): the debt table is a **single-meter dice
> result per pass**, not a broadcast across the bank.

*(designed, RULED — implement the 7 steps in strict order with no re-do within a pass; carry
tax/tariff decay forward to next phase's step 3 (NOT applied in current step 7); treat step 7
volatility rolls as one-shot (not added to running totals); **the debt-table effect rolls a single
target meter (category roll → hit roll), N/A categories skipped** (`oopscpu#POST 148-153`). Cite
`tedchange#POST 397-408`.)*

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

#### 11.3.y ★ Ted-RULED Gov-action Challenge-Legislation restrictions (designer-authoritative; `tedchange` + `smallbugs`)

> **AUTHORITATIVE — Ted's `tedchange` POSTs 246-248** (Challenge-Legislation cannot target a
> repeal) + **`smallbugs` POSTs 236-269** (Amendments cannot be SCOTUS-challenged).

**The Challenge-Legislation Gov action — RULED restrictions:**

| Restriction | Rule | Cite |
|---|---|---|
| **Cannot target a REPEAL bill** | If a Gov tries to use Challenge-Legislation against a repeal bill, the action is rejected. "No real-world precedent for SCOTUS overturning a repeal." | `tedchange#POST 246-248` |
| **★ Cannot target a ratified AMENDMENT** | A Gov cannot challenge a ratified Constitutional Amendment through the Challenge-Legislation action. *"I'm going to make it so Govs can't challenge amendments"* (vcczar POST 250); *"the Constitution is by definition constitutional"* (OrangeP47 POST 251). **Rule doc updated POST 269.** | `smallbugs#POST 250-269` |
| **Cannot target a STATEHOOD bill** | (separate, already in effect, OP47 POST 240 — "statehood bills can't be SCOTUS-challenged anymore.") | `smallbugs#POST 240` |

> **★ CONFLICT FLAG — amendments-NOT-SCOTUS vs `tea1772`'s #100.** The
> `tea1772` playtest digest's gap #100 records a GA-ruled case where SCOTUS **CAN overturn a
> ratified amendment via Gov-requested judicial review** (the `ad0f2875`/§21.3 captured this:
> "the 13th was overturned 4-3, reverting it to a mere governor-action"). **This conflicts with
> Ted's official `tedchange`/`smallbugs` ruling that amendments are NOT challengeable.** Both
> sides are visible:
> - **`tea1772` #100 (playtest GA ruling):** SCOTUS CAN overturn a ratified amendment via Gov-
>   requested judicial review. Recorded in [§21.3 (Amendments as durable, separately-ratified
>   state)](#213-amendments-as-durable-separately-ratified-state) as the
>   "Judicial review of an Amendment → repeal/demotion" path.
> - **Ted's `smallbugs#POST 250-269` (DESIGNER, OFFICIAL):** *"I'm going to make it so Govs can't
>   challenge amendments"* + rules doc UPDATED.
>
> **Authority hierarchy:** Ted (`tedchange` / `smallbugs` rules-doc patches) > playtest GA rulings.
> The build target should follow Ted's ruling — amendments are NOT challengeable via the Gov-
> action SCOTUS path. The `tea1772` playtest path is **recorded as historical context** in §21.3
> but is **not the canonical build behavior**.

*(designed, RULED — gate the Challenge-Legislation Gov action: target bill must not be a
repeal-bill AND must not be an amendment-bill AND must not be a statehood-bill. The Gov-
requested judicial-review path from §21.3 is SUPERSEDED for amendments specifically. Cite
`tedchange#POST 246-248` + `smallbugs#POST 250-269`.)*

#### 11.3.z ★ OC-7 — CPU "help allies" gov rule includes governor-term-config actions (RULED; `oopscpu`)

> **★ RULED LIVE — Ted "command decision" (`oopscpu#POST 264, 275, 941`), designer-authoritative.
> DESIGNED, not built.** Extends the CPU governor-action menu (#20 / DH-19) — the shipped
> `runPhase_2_5_2_Governors` is the flat bias-nudge above; there is **no CPU action-menu selector**.

When the CPU governor's **"help allies"** rule fires (the heuristic that picks a gov action to
benefit the governor's own party), the action set **includes governor-term-config actions**, keyed
on the **state's partisan lean**:

| State lean (relative to the governor's party) | Term-config action |
|---|---|
| **Same-party-leaning state** | **lengthen terms** / **remove term-limits** (entrench the ally) |
| **Opposite-leaning state** | **add term-limits** / **shorten terms** (constrain the rival) |

These join the existing 2-year/4-year term-flip and term-limit gov actions in the library above
(§11.3) — the ruling is that the **CPU is allowed to reach for them under "help allies"**, not just
players. (Pairs with the open `tedchange` §30.2 #4 term-limit-Gov-action-in-pre-Senate-era item —
the CPU using these actions is what surfaced that edge case.)

*(designed, RULED — when the CPU "help-allies" gov heuristic fires, **add term-config actions to
the candidate set**: same-party state → lengthen/remove-limit; opposite-party state →
shorten/add-limit. Cite `oopscpu#POST 264, 275, 941`.)*

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

#### 12.3.y ★ Ted-RULED Pres signature step location + CPU sign/veto rule (designer-authoritative; `tedchange` + `smallbugs`)

> **AUTHORITATIVE — Ted's `tedchange#POST 124-126` (signature step location) + vcczar's
> `smallbugs#POST 417-423` (CPU sign/veto rule).** RULED.

**★ Pres signature step lives in 2.6 (not 2.10)** — RULED in `tedchange#POST 124-126`. Ark's
reasoning (POST 124): if Pres signature lives in 2.10, military bills don't affect Mil-Prep
until AFTER 2.7 Military Action — wrong ordering. Ted: *"Definitely agree."* So:
- A bill that passes both chambers (2.6.3 Floor) → routes to the Pres for sign/veto **in 2.6**,
  BEFORE 2.7 Foreign Affairs / Military Action.
- (Pre-existing 2.10 location is SUPERSEDED.)

**Tentative companion**: **date advance moves to BEFORE 2.9.1** (RULED tentatively in `tedchange#POST
120-128`) — so eligible-30-year-olds show their correct age at primaries. Ted approved in concept,
flagged the need to verify no downstream breakage.

**★ CPU President sign/veto rule** (`smallbugs#POST 417-423`, vcczar RULED): the CPU President
**SIGNS** a bill if **any factions in his party score** from it, as long as the **party's total
score from the bill is not negative**. Resolves the ambiguous "party gets net 0 but other party
gets +1000" case: the CPU still signs (his own party scored nothing-or-positive).

*(designed, RULED — move the Pres signature step into 2.6 (it currently lives in shipped 2.6.3
post-passage processing — confirm); CPU President sign/veto decision: SIGN if any same-party
faction scored AND same-party total is not negative; otherwise VETO. Cite `tedchange#POST 124-126`
+ `smallbugs#POST 417-423`.)*

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

> **`pop` sharpens — chair blocks EXACTLY ONE + duplicate-bill auto-block (modern, 6th era).**
> The 2015-17 modern cycle shows the chair-block as a discrete step: the chair may BLOCK
> exactly **one proposal** from the slate **before** the committee votes (`pop` POST 488,
> 489, 490 — clean sequence with the chair picking the block target, then the committee
> voting the rest). Separately, if the **same legislation is proposed twice** in a single
> cycle, the chair **auto-blocks the duplicate** (`pop` POST 712–714). This is the duplicate-
> guard variant of block-and-replace — not a chair choice but a rule. (Combines with §12.4
> domain-locking: deterministic per-rule, **chair gets exactly one discretionary block
> per cycle**, the duplicate-block is mandatory.)

*(designed, not built — extend 2.6.2 to surface a "block / replace from {committee
domain bills}" UI to the chair's player; engine should still resolve probabilistically for
CPU chairs. Add: **one discretionary block per cycle + an automatic duplicate-bill block
that doesn't consume that quota**.)*

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

> **`pop` corroborates 6th-era + sharpens "load-bearing packaging".** The 2015-17 modern cycle
> ran the **chair packages passing bills together** step explicitly (`pop` POST 502–507): the
> chair decides post-committee-vote whether to leave bills separate or package them. **Load-
> bearing in `pop`:** **4 unrelated GOP bills** (Stand-Your-Ground / Surveillance / Keystone
> XL / Pipeline subsidies) were jammed into a single Bill #3 to **amortize sign/veto cost**
> across the package (POST 507, 542). Confirms the package step as a **chair-discretion**
> action (not deterministic).

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

> **`pop` sharpens — modern filibuster runs at 60-vote cloture, NOT 67%.** A 6th-era,
> 6-named-Senators flag (`pop` POST 519, 521): specific Senators are pre-tagged
> "can-filibuster" by trait/ideology — **Rand Paul, Tom Coburn, Mike Lee, Ilhan Omar** named.
> Omar filibustered Bill 2 (Stand Your Ground + Federal Prisons); **cloture needed 60 votes
> in a 100-seat Senate**, got **58 — bill killed**. **The 60-vote cloture is the modern-era
> threshold**, distinct from the 67% drums dump (which is the **pre-modern** rule).
> Open: is 60 modern-era-specific or a post-reform reduction triggered by an amendment?
> (Both readings consistent.) **Iron-Fist Sen Maj Leader passes everything else
> unilaterally** at this scale: McConnell (5 legis + Iron Fist) is documented in `pop`
> POST 523, 739 as effectively delivering ~54 automatic AYE votes on majority items — the
> **modern instance** of the §25.9 Iron-Fist overload, surfaced as a specific cascade
> ("≈ auto-54-votes" is the modern-era manifestation of "**auto-cloture for majority items**"
> in `drums` POST 5920).

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

> **★ Crisis-bill-FAILURE scoring — the −100 / ideology-waiver rule (`arkzag`, batch 11; refines
> #11).** A **failed CRISIS bill scores −100 points**, **BUT the penalty is WAIVED if the bill
> conflicts with the faction's ideology → instead +1 enthusiasm toward its party** (`arkzag` ch24
> POST 1536). Worked: the recurring **Abolish-Slavery CRISIS amendment** fails every Congress — a
> pro-slavery faction's −100 is waived (→ +1 enthusiasm), an antislavery faction eats the −100. This
> is the failure-side counterpart of the +150 crisis-bill *passage* bonus above, and it feeds the
> §29.10 4-step enthusiasm reshuffle. Full statement + couplings:
> **[§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved)**.

*(designed, not built — introduce `game.activeCrises: CrisisId[]` entered/exited by meter
thresholds, plus `Bill.resolvesCrisis?: CrisisId`; on passage of a crisis bill, pop the
crisis off, **skip the spending-cap gate**, apply a stronger scoring multiplier, and apply a
collective-accountability Party-Pref penalty when a chamber lets most crisis bills lapse;
**on FAILURE of a crisis bill, apply −100 pts, WAIVED → +1 enthusiasm if the bill conflicts with the
faction's ideology**.)*

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

> **`pop` sharpens — sign triggers ideology + lobby + meter ticks SIMULTANEOUSLY.** A signed
> bill resolves all three scoring channels in **one event**, not in sequential phases
> (`pop` POST 539, 542): **points to ideologies** (±50/100/150/250/350) **+ meter ticks**
> (Planet Health, Economic Stability) **+ lobby points** ("+100 for High Tech", "+50 for
> Human Rights") all post at sign-time. Sharpens #12: the scorer is **one resolver step
> iterating ALL of {ideology cards, lobby cards, meter tags} for the bill**, not three
> separate phases. The ±250/±350 magnitudes seen here extend the prior ±50/100/150 bands —
> implies a **per-card-class scale** (interest ±50, lobby ±100, ideology ±150, faction-
> defining ±250, era-double ±350) but the band structure is not yet documented.

> **Tie-break overlay (batch 8, `ad0f2875`).** When a bill or platform plank is **ideology-
> neutral** (the card scorer nets ~0), the GM falls back to an **era-stamped Popular/Unpopular
> issue list** — see [§21.9](#219-presidential-vote-modifier-stack--era-stamped-popularunpopular-issue-list-designed-not-built)
> for the list and the era-sensitivity overlay (`ad0f2875` POST 137).

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

#### 14.1.y ★ Ted-RULED Pres implementation = 2-step Admin-then-Command blunder rule (designer-authoritative; `tedchange`)

> **★★ AUTHORITATIVE — Ted's `tedchange#POST 163`, the canonical 5-tier 2-step rule.** RULED.
> SUPERSEDES the earlier `smallbugs#POSTs 350-388 §5a #3` "HYBRID ADOPTED" placeholder (which had
> the concept but fuzzy wording). This is the **AUTHORITATIVE wording**. Pairs with batch-4's
> DH-10 (blundered implementations) and applies to Pres-decided era events, exec actions, and
> any phase requiring a Pres implementation roll.

**Step 1 — Pres rolls ADMIN for implementation** (same as cabinet members).
- If the roll succeeds: implementation succeeds; no blunder check needed.
- If the roll fails: implementation may blunder — proceed to Step 2.

**Step 2 — Blunder check, gated by Pres COMMAND** (the 5-tier table):

| Pres Command | Blunder outcome |
|---|---|
| **Cmd 5** | **Avoid the blunder** entirely (no negative consequence) |
| **Cmd 4** | **50% chance** to avoid the blunder |
| **Cmd 3** | **+1 to the blunder roll** (severity bump) |
| **Cmd 2** | **50% chance to apply +1** to the blunder |
| **Cmd 1** | Blunder normal (no Command modifier) |
| **no Command / no expertise** | **−2 to the blunder** (worse) **UNLESS** an `Efficient` cabinet member is on the implementation team |

**Trait overrides:**
- **`Easily Overwhelmed` Pres** → **skips Step 2 entirely** (no Command-modified blunder check; the
  default blunder applies as-is). The Pres is too overwhelmed to use Command to mitigate.
- **`Incompetent` Pres** → **−3 to the blunder roll** (worse than the no-Command case).

**Worked example:** Pres has Admin 2, Cmd 3. The implementation roll fails (Step 1). Step 2 applies
Cmd 3 → +1 to the blunder roll: the consequence is **one tier worse** than a Cmd-1 Pres would get.

*(designed, RULED — implement Step 1 (Pres Admin roll) then Step 2 (Command-gated blunder
modifier per the 5-tier table); honor Easily-Overwhelmed → skip-Step-2 and Incompetent → −3.
Applies to era-event implementation rolls (§10.3 + §10.4.1), exec actions (§14.1), and any
phase requiring presidential implementation. Cite `tedchange#POST 163, 159-164`.)*

#### 14.1.1 Action library + persistence

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

#### 14.1.z ★ Ted-RULED post-election Command decay — "shit or get off the pot" (designer-authoritative; `oopscpu`)

> **★ RULED LIVE — Ted's `oopscpu#POST 224` (floated `oopscpu#POST 1`, the marquee proposal of
> the whole batch). DESIGNED, not built** — the shipped engine has `loseCommand`
> (`abilities.ts:15`) but only ever calls it for **old-age / Anytime-Evo loss**
> (`phaseRunners.ts:2410, 2709`) and **battle loss** (`revolutionaryWar.ts:137`); there is
> **no post-election Command-decay pass** anywhere.

**The rule (exact):** after **every Presidential election** (`year % 4 === 0` cycle close, the
[§16 end-of-half-term](#16-end-of-half-term-210) for the presidential year), **any politician
who did NOT run for President OR Vice-President** in that election has a **40% chance of losing
−1 Command**.

| Field | Value |
|---|---|
| **Trigger** | close of a Presidential election cycle |
| **Eligible set** | every living politician who **did not appear on a ticket** (Pres or VP candidate, winning or losing) that cycle |
| **Roll** | **40% per eligible politician** |
| **Effect** | **−1 Command** (floored at 0) |

**Intent (Ted, verbatim):** *"Shit or get off the pot!"* — Command is the scarce resource that
gates Kingmaker ([§6.5](#65-217-kingmakers--protégés)), the major-candidate `≥1 Command` filter
([§25.1](#251-candidate-selection-open-seats-primaries-conventions--the-7525-rule)), and PV
(`+command × 10`, [§3.4](#34-political-value-pv--computepv-pvts67)). The decay forces
Command-holders to **stay politically active** (run for the top of the ticket) or bleed the stat
that makes them eligible to lead — a use-it-or-lose-it pressure that prevents a board of inert
high-Command elder statesmen. **Worked (POST 224):** applied to 3 non-running pols — **Gerry → 0
Command, Pinckney → 2, Hancock → 2**.

**System interactions:** because Command also gates what an **acting president** can do
([§24.1](#241-61-succession--eligibility--the-acting-president-state): a 0-Command acting
president is fully inert), this decay can over time **lower the floor of the succession bench** —
a side-effect the build should be aware of when it later reads Command at succession time.

*(designed, RULED — add a **post-Presidential-election Command-decay pass**: enumerate living
politicians **not on a Pres/VP ticket** that cycle, roll **40%** each, apply **−1 Command** via
the existing `loseCommand` (`abilities.ts:15`). Slot it at the presidential-year
[§16](#16-end-of-half-term-210) close, after the ticket roster is known. Cite `oopscpu#POST 1,
224`.)*

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

> **Forum modifier stack (designed, not built; batch 8).** The forum layers an enumerated
> **presidential-vote modifier stack** onto this score for the EC general (3rd-term −1,
> trait-matchup −1, economy ±, −2/major-scandal, regional/meter swings) — fully specified at
> [§21.9](#219-presidential-vote-modifier-stack--era-stamped-popularunpopular-issue-list-designed-not-built)
> (`ad0f2875` POST 137, 139, 151). The same thread shows national meters can **swamp `state.bias`**,
> producing implausible maps — `state.bias` is a soft modifier (realism gap, §21.9).

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
>
> **Confirmed again 1820-native (`arkzag`, batch 11; the full 1832 + 1840 conventions).** A
> human-run multi-cycle confirmation of: brokered convention with **Command = # inter-ballot
> actions**, **Orator-nominator d6 momentum**, **party-specific nomination thresholds** (NatRep
> **2/3** = 436/649 vs DemRep **50%+1** = 343/685 — the asymmetric-threshold rule, DH-7), **5-plank
> platform + 3-test scoring**, the **multi-check VP rubric** (digest counts 11 checks vs §15.3.4's 10
> — an enumeration variant, same rubric), and **per-cycle convention venues** (1840 Albany NY /
> Winston-Salem NC). **★ Presidential-promise buyouts DECIDE the 1832 nomination:** Cheves wins on
> ballot 2 by buying endorsements (**VP-for-Key, Sec-State-for-Clay**, offer-DOWN to fewer-delegate
> candidates — the §15.3.3 direction rule). **NEW unsettled fork:** **delegate-class assignment** —
> Zagnut moved it to **AI-auto** (5-category EV×1…×4 formula, to kill the §15.3 host-rigging
> exploit) but the **1840 convention reverted to human-set**; Ted holds player-rigging is *intended*.
> Full detail + the fork: **[§29.11](#2911-batch-11-corroborations-the-full-arc-bugs--the-roadmap-hand-off)**.
> (`arkzag` ch7 POST 584–606; ch21 POST 367–488, 1717–1750; ch32 POST 2462–2466; ch33 POST 2530.)

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

> **Confirmed by the FIRST-ever fully-recorded convention (`rep1800`, batch 7).** The 1800
> campaign captured the **most detailed first-convention record for any era** — the first
> post-12A convention observed live — **resolving batch-1 open-Q #10** (the VP-impact checklist
> and platform comparison were inferred from `gilded` mid-stream; `rep1800` records them from a
> convention's *first* run). The **VP-impact 10-check** and the **platform 3-check** (§15.3.5)
> are **confirmed verbatim** (`rep1800` §A POST 1832–1924, 2356–3107). Also confirmed there: an
> **Iron-Fist PL's vote is the ONLY one that counts on rules changes** ("Jefferson rules
> supreme" — corroborates §25.4 / the Iron-Fist convention powers), and the **Keynote Speaker
> "did not officially exist until the Era of Progressivism"** (an era-gated convention feature
> the early eras partly lack — refines §15.3.2's keynote role). Conventions are now **5–7-era
> confirmed.**

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

> **★ designer-decision-gated OPEN in `tedchange`** (`tedchange#POST 371-376`): Vee01 complained
> the rule "doesn't track" ("electors are chosen by state party not state at large"); Matt
> supplied a canonical 2-condition trigger; Eric proposed *"if state won by candidate that has
> the LEAST PREFERRED ideology of the state"* + Ark "+3 for the other party". **Ted did NOT
> post a final ruling.** Community agrees current wording is "wonky." Faithless-elector rule
> remains as-is until designer decision. See [§30.2 item 5](#302-designer-decision-gated-open-items-tedchange).

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

#### 17.1.y ★ Ted-RULED 1st / 2nd CC composition + appointment (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange` POSTs 211, 217-236, 222, 235, 352-355.** RULED.
> Ted re-authored these rules (they had been LOST from the rules doc) for the 1st CC composition
> (pre-DoI) and the 2nd CC composition (post-DoI). Cross-ref [§17.2 First Continental Congress
> builder](#172-first-continental-congress-builder-firstcontinentalcongressts).

**Per-state delegate slot count by state size** (POST 222, RULED):

| State size class | States | Delegate slots |
|---|---|---|
| **Big states** | PA, MA, VA, MD | **4 delegates** |
| **Medium states** | (the remaining colonies — NY, NJ, CT, NC, SC) | **3 delegates** |
| **Small states** | GA, RI, DE, NH | **2 delegates** |

> **Shipped engine note:** `state.ccDelegateSlots` (range 2–4 in `states1772.ts`) already
> encodes this table. **CONFIRM** the per-state values match the table above.

**Appointment-rule TRANSITION:**

| Era window | Who appoints CC delegates per state |
|---|---|
| **1st CC (pre-Declaration of Independence)** | The **faction with the most politicians in that state** picks delegates from in-state candidates (POST 222). |
| **2nd CC (post-Declaration of Independence)** | The **state Governor** picks delegates. |

**Tied delegate appointments** (`smallbugs#POST 59-60`, Ted RULED): on a tie for "most pols in
state", the **lowest-score faction** makes the appointment; if still tied, random.

**Post-DoI cabinet-equivalent appointments under the Articles of Confederation:**
- **Postmaster General (CC era)** — appointed by the **Domestic Committee chair** (`tedchange#POST
  353-355`, Ted RULED, "same as 2.3").
- Articles of Confederation properties (RULED in `tedchange#POST 220, 222`):
  - **Prohibits consecutive election** of the same delegate (already in shipped code).
  - **Requires 2/3 of states** for a bill to pass (already in shipped code).
  - **Requires unanimity for amendments** to the Articles.

**60% threshold for CC-era Controversial nominee confirmation:** **60% of the TOTAL states**
(8 of 13 in the 1772/1788 CC; Ted RULED in `tedchange#POST 277`).

*(designed, RULED — confirm per-state delegate slots match the size table; encode the appointment-
rule transition keyed on `coloniesIndependent` / `declarationOfIndependence` state flag; route
PMG appointment via the Domestic Committee chair in CC era; encode the lowest-score-tie-break
+ random secondary. Cite `tedchange#POST 211, 217-236, 222, 277, 352-355`.)*

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

> **★ Pairs with Ted's RULED CC composition** ([§17.1.y](#171y--ted-ruled-1st--2nd-cc-composition--appointment-designer-authoritative-tedchange)):
> the shipped builder's per-state delegate slot counts must match Ted's 4/3/2 size table;
> the "selecting faction" rule (largest in-state) matches Ted's "faction with most pols" pre-DoI
> rule.

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

### 17.7 Forum design layer — the MULTIPLAYER-1772 confirmation (designed, not built)

> **Batch 8.** The **first captured multiplayer 1772 campaign** (`afc6cbd7`, 10 humans, one per
> faction, 5 BLUE + 5 RED, 1772→~1796) is the best **multi-faction-rules** record for the founding
> era and the only thread that organically transitions **Independence → Confederation → Constitution
> → Federalism** from a 1772 start, standing up the federal apparatus piecewise (§24.6 above). It
> **corroborates the shipped §17.1–§17.6 systems and adds founding-era detail the engine compresses.**
> Cite `afc6cbd7#POST N`; cross-ref game-context #100–#101, DH-38..DH-44.

- **Two sequential 1772 drafts.** The forum runs an **Inaugural Draft** (all established pols)
  THEN a separate **Rookie Draft** (rookies added to the Draft Class tab after); shipped
  `scenario1772` does **one** snake draft (POST 21, 22, 36; DELTA — game-context open-Q). Inaugural
  rookies from the **past three draft classes** (1768/1764/1760) may be retroactively career-tracked
  and removed the same turn (POST 55–56).
- **Era-of-Independence ~⅓ phase-skip (confirmed multiplayer).** No President, no cabinet, no
  parties / party-leaders, no Senate, **no Diplomacy phase even with Ambassadors present** — only
  **factions** + faction leaders + faction names exist until the Constitution (POST 5, 48, 257, 841).
  The federalism layer *adds the skipped phases back*; the founding era is the loop's **reduced form**
  (matches shipped — federalism enters via `applyConvention`'s transition, §17.3). An elected
  President auto-leads their faction.
- **Full Constitutional Convention machinery (confirmed in real depth).** **Annapolis Convention**
  (era event) must fire first → triggers the Convention (POST 1511, 1673). The Convention auto-elects
  a **Convention President** (rallied around war-hero Arnold) and names a **"Father of the
  Constitution"** (the proposer; +1 Cmd/Legis/Admin/Celebrity; Pres +1 Cmd; all delegates lose
  Obscure). **FIVE items MUST be resolved** before the Constitution completes — **Art 1 (legislature),
  Art 2 (executive), Art 3 (judiciary), Slave-State Compromise, Amendment Process** — each a branching
  menu (e.g. Art 1: A bicameral / C unicameral-Senate; Slave-State: A 3/5 / B all-slaves-count /
  C none; Amendment Process: A 3/4-of-states / B majority / D 2/3); plus trait-gated **add-on**
  amendments (Women's Suffrage needs an LW-Activist delegate; Natural-Born Citizenship; Bill of
  Rights; Lifetime Senate). **Each item needs 9 states to approve**; core items re-vote until one
  hits 9, add-ons fail if <9. **Only the Convention President and Father of the Constitution can sway
  votes** (Debater/Orator, each item independently). **Ratification = a Gov vote needing ≥9 Govs**;
  failure → the game **continues with the Continental Congress** (POST 1693–1824). This is a **real
  branching system**, NOT scripted to the historical text — the choices **feed forward into election
  math** (the Slave-State choice decided the 1788 VP, §21.2). The shipped engine
  (`constitutionalConvention.ts`, §17.3) models **seven** binding articles and a CPU auto-fill, a
  reasonable superset of the five required items + add-ons.
- **Washington "first-President" rule (verbatim, POST 727–749).** *"If it is the first presidential
  election under the US Constitution, and one of the nominees has 'Celebrity' and 'Military Leader,'
  then he becomes president **unopposed if the player rolls a 4-6**"* (50% on a d6). "Unopposed" = no
  other candidates; the roll is a **hard stop resolved before the other party may nominate** (in the
  computer version the first two nominees of each party are selected simultaneously, then the roll
  resolves). In this timeline Benedict Arnold qualified (Celebrity + Military Leader), **rolled and
  FAILED** → the full 1788 election proceeded (POST 1756, 1949, 2015–2016) — confirming it as a real
  conditional, not a guaranteed Washington coronation. (Not in shipped code.)
- **Independence won by COMBAT ALONE — the explicit France event is not required.** The Revolutionary
  War was won after ~4 turns (1774–1782) **by combat rolls alone; the French-alliance event NEVER
  fired** (players: "Did i miss it or did we get the French alliance?", "shouldn't there be a flag…
  that was way too easy", POST 879–883). This **confirms the founding alt-history is roll-driven**:
  the shipped 1772 spine carries an explicit "Alliance with France" event (and
  `revolutionaryWar.ts`'s `frenchAlliance` void-the-loss-cap path, §17.4), but **independence is
  achievable on combat luck with no France required**. The era is "railroaded" toward independence
  via point-dominant choices — multiple game-ending loyalist off-ramps exist (Conciliatory Resolution
  Option B; Carlisle Commission Option B) but are effectively never chosen; **CPU auto-votes AGAINST
  any game-ending option ~75% of the time** even at a point cost (POST 637).

*(designed, not built — model the **Inaugural+Rookie two-draft** founding open; the Convention's
**five-required-items + trait-gated add-ons + 9-states-per-item + ≥9-Gov ratification + Convention-
only sway**; the **Washington d6 4-6 unopposed** first-President hard-stop; and treat the France
event as **optional flavor**, not a win prerequisite. Most of this is a superset of shipped
`continentalCongress.ts` / `constitutionalConvention.ts` / `revolutionaryWar.ts`.)*

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

*New items revealed by forum digest `c50d9da7` (`pop`, 2012 fresh-modern boot) —
[§26](#26-scenario-boot-model--modern-endgame-designed-not-built):*

The modern era is now **corroborated both ways**: `modern` reached the Era-of-Populism as a
**60-yr continuation** from a 1948 campaign; `pop` records the **cold boot** of the same
era at 2012. The two threads' alignment anchors the build constraint **era identity = data
configuration, NOT code paths** (the R1 deck = "Trumpism" because the seed instantiates
the right cards in the right faction at boot, not because there is a "Trumpism" mechanic).
The biggest unbuilt surfaces unique to `pop`:

- **Scenario-boot model (§26.1, §26.2)** — a single `BootSheet` schema instantiated per era
  (1788 / 1856 / 2012 minimum) producing a `FullGameSnapshot` from a per-era boot sheet:
  pre-built faction roster + era-tuned deck assignment + sitting-government seeding +
  state roster keyed to **boot year** (NOT era — the 2012 fresh boot is **50 + DC**, not
  53) + "no leaders / no career tracks / no legacy at boot" baseline; pairs a Senate-class
  verifier + `TRAIT_CONFLICTS` validator at boot time. (`pop` POST 1, 12, 17, 264, 359;
  DH-24 / DH-25 / DH-27.)
- **Era-coded double-points issues (§26.3)** — a per-era `doubleScoringIssues: IssueTag[]`
  table that doubles ideology/lobby/meter awards on signed bills tagged with the era's
  defining issues. **Era-of-Populism doubles Climate Crisis + Immigration** (`pop` POST
  699). Couples to §12.8 bill scoring.
- **APOCALYPSE Planet-Health endgame (§26.4) — a NEW meter-driven endgame model.** Planet
  Health falling into the bottom-tier band starts a **10-game-year countdown clock to
  mandatory game-end**, distinct from the shipped event-driven `triggersGameEnd`. The
  engine must support **BOTH** endgame models. `game.endgameClocks: { meter; threshold;
  remainingYears }[]` (`pop` POST 542, 548).
- **Era-event-creates-office (§26.5)** — generalizes §24.6's Progressive institutional
  layer across a 4th era. A bill carrying `createsCabinetSeat: SeatSpec` appends a new
  seat to a **dynamic cabinet-seat list**, replacing the static `cabinetSeatsForYear`
  lookup as anything more than the boot seed. (`pop` POST 699, 1100 — Sec. of Environment
  & Climate.)
- **Modern SCOTUS confirmation rules — refinements (§26.6)** — **factions within 1
  ideology step auto-confirm** SCOTUS (`pop` POST 561; declarative override of the
  cabinet 50/50 trap). **Manipulative-Pres compels Justice retirement** if target lacks
  Integrity OR Jud<5 (`pop` POST 555; separate trait, **moved out** of the Iron-Fist
  overload table to its proper home).
- **12th-Amendment-gated VP actions (§26.7)** — amendments toggle **callable action
  entries**, not just durable rules. Each action-library entry carries a `requires:
  AmendmentPredicate?` field; library entries are filtered against `game.amendments.passed`
  at evaluation. The 12th gates "Send VP to Shore Up Support" (`pop` POST 951);
  generalizes to VP-by-party-ticket actions and beyond.

*New items revealed by forum digest `6aa7309a` (`rep1800`, 1800→1868) — the **GAP-FILL** for the
1800–1856 early-republic band and the **biggest architecture delta in the KB**
([§27](#27-early-republic-era-systems--the-era-model-designed-not-built)):*

The 1800 campaign is the direct **predecessor of `gilded`** (same GM/roster), documenting the
1800→1868 band end-to-end. The biggest unbuilt surfaces:

- **★★ Eras-are-content-bands (§27.1)** — the era is a **game-state/territory content-band**, not
  a calendar-year derivation; `year % 4` / `year % 2` are phase *cadence* only; content (bills/
  events/draftees) is gated on **territory ownership** (this campaign's LA Purchase fired calendar
  1834). The forum's Republicanism/Democracy/Manifest-Destiny/Nationalism bands are **sub-bands of
  the single `nationalism` enum value**. **The central architecture question for the build.**
  (`rep1800` §0, §B; divergence #18.)
- **Era-boundary machinery (§27.2)** — the "End of Historical Era" phase: faction-trade window
  (CPU auto-accepts), the **+5/+3/+3/+3 + −1 point-banking table**, non-banked-points reset, the
  new-era issue brief, draft-order-by-last-era-points, and a wholesale per-era bias-table swap
  (confirms/extends §2.5). (`rep1800` §B POST 6187, 6201, 6203.)
- **12A election-mode toggle (§27.3)** — pre-12A: **`electorsByLegislature`** (EV by Gov/Sen/Rep,
  mirroring `senatePre17`) **+ NO conventions**; the "Party-Ticket Amendment" flips to ticket +
  convention + separate-VP mode. (`rep1800` §A POST 222, 264, 691, 708; divergence #19.)
- **Slavery-flag + Cohens-v-Virginia substrate (§27.4)** — slavery = a per-state flag bound to
  the Plantation industry; the ahistorical `Cohens v. Virginia` precedent **blocks legislative
  abolition** (state-supremacy) so slavery ends only by Amendment or per-state Gov action; all new
  states enter free. The substrate for the whole sectional design. (`rep1800` §A POST 2180–2182.)
- **Statehood-by-bill + unorganized-territory gating (§27.5)** — bills mint states (spin up Gov +
  Class-I/II/III senators + EVs); the two-step **organize → admit** pipeline; pols in unorganized
  territory are **undraftable/unrelocatable** until an organizing bill (refines §21.5 / #43).
  (`rep1800` §A POST 1999–2002; §B POST 5828–5837.)
- **Second Bank recharter clock + Bank War (§27.6)** — a stateful Second Bank with a **20-yr
  recharter clock**, granting an **unremovable President-of-US-Bank seat**, killable via the
  "Remove Deposits" exec action. (`rep1800` §A POST 954, 2123, 3175.)
- **Circular ideology (§27.7)** — at a mid-era rule change the 7-point line becomes a **ring**
  (LWPop↔RWPop adjacent at ~25%); conversions extend to adjacent ideologies. A cross-cutting
  adjacency-math change. (`rep1800` §B POST 5717, 5730; divergence #20.)
- **Amendments mutate core params (§27.8)** — the "Sexenio": 6-yr term + one-term limit + suffrage
  (16th/17th/18th); amendments change **core engine parameters** (incl. the ratification
  supermajority itself), undoable by later amendments, no grandfather clause. (`rep1800` §B POST
  5484–5595; divergence #21.)

*`rep1800` detail that **sharpens** already-documented systems (now corroborated across a 3rd
campaign / additional eras — labels bumped inline):*

- **Civil War alt-VARIANTS (§23.1)** — early CW trigger off **DomStab=1** (not a secession
  convention); **President-defects-to-CSA**; **Hartford-Convention / Northern-Secession** variants
  confirmed; a **UK-Intervention 3rd theater**; a **guerrilla 4th stage** the war chart has no
  rule for. Multi-confirms the battle %-engine (§23.3) across a 3rd campaign. (`rep1800` §C.)
- **Reconstruction (§23.4)** — readmission-by-**repealing**-state-bills; **Lenient-10% vs
  Strict-Ironclad** plans; red-lined ex-Confederates; same-party-only military Govs; a **25%
  CW-renewal** roll at 10+ yrs; the **hard-coded Red +2 bias even in a Blue-won alt-history**
  ("historical sim, not alt-history"); and the **★ SOLO BLOCKER** — Strict/Ironclad can NEVER pass
  with CPU (POST 9170). (Divergence #22.)
- **Endgame (§26.4)** — a **second meter-driven shape**: the **per-event-phase game-end roll**
  (Standard Coup / Economic Collapse / Autocratic Coup / Enemy-Takes-Defenseless-US), with
  **DomStab=1 as the Civil-War/secession game-ender**; coups effectively dead once MilPrep is
  maxed. (Distinct from APOCALYPSE's fixed countdown.)
- **Conventions (§15.3)** — the **first-ever fully-recorded convention** confirms the VP-impact
  **10-check** + platform **3-check verbatim** (resolves batch-1 open-Q #10); an Iron-Fist PL's
  vote is the only one that counts on rules changes; the Keynote Speaker is Progressive-era-gated.
- **Alt-expansion (§23.5)** — **Cuba = 36th state in a new `Caribbean` region**; **Texas = 4
  states**; **Mexican Cession by purchase** (CA stays Mexican); FL won from Spain; territory-
  before-statehood rule (refines §21.5 / §27.5).

*Modern detail that **sharpens** already-documented systems (now corroborated across 4-6
eras — labels bumped inline):*

- **Legislation (§12.4–§12.8)** — chair-block-EXACTLY-ONE + duplicate-bill auto-block
  (`pop` POST 488–490, 712–714, extends §12.4); chair-can-package as load-bearing (`pop`
  POST 502–507, extends §12.5); **named-Senator filibuster + 60-vote modern cloture +
  Iron-Fist Maj Leader auto-54-votes** (`pop` POST 519, 521, 523, 739, extends §12.6 /
  §25.9); **sign triggers ideology + lobby + meter ticks simultaneously** (`pop` POST 539,
  542, extends §12.8: scoring is one resolver step over all card classes).
- **53-state alt roster (§22.10)** — **state count is keyed to the BOOT YEAR, not the era**
  (`pop` POST 264: fresh 2012 boot = 50 + DC, NOT 53). The build needs **both** rosters
  for the same `modern` era.
- **Iron-Fist conditional-vote-rules (§25.9)** — Iron-Fist controllers publish **declarative
  predicate → {AYE/NAY}** policies (`pop` POST 1111). Promote conditional-vote-rule to a
  first-class CPU-handler primitive (`factionLeader.compelledVoteRule?: Predicate → Vote`).
- **Israel meter ACTIVE in modern era** (`pop` POST 525, 742; sharpens §22.1 + §24.7's
  "present-but-INACTIVE in 1900" — Israel's activation rule fires at the modern era boundary
  at latest).
- **Modern era corroborated both ways** — the modern era is the only era ingested as
  **both 60-year continuation AND fresh scenario boot**, anchoring the era-identity-as-
  data-configuration constraint above.

*New in batch 8 (two 1772-start threads; mostly corroboration — see the individual sections):*
- **Design holes DH-36..DH-44 are logged in `game-context.md`** (not re-documented here). The
  newly-revealed *designed* surface this batch is small (it mostly sharpens existing sections):
  the **dual era-scoring** (§27.2), **SCOTUS-overturns-an-Amendment + threshold-amendable**
  (§21.3), the **presidential-vote modifier stack + era-stamped issue list** (§21.9),
  **stat-collapse → forced resignation** (§24.1), and the **lone-ideology minor-candidate
  convention exploit** (§25.4).
- **★ META HOLE — DH-36 (the build must own all bookkeeping).** `afc6cbd7`, a 10-human
  multiplayer 1772 campaign, **died at ~12 turns to GM burnout** — the GM resigned because the
  manual Google-Sheets upkeep (career-track flags, formula breakage, missed gains, retro-fixes)
  was unsustainable (POST 3607). No successor stepped up; the game stopped **before President-elect
  Washington took any in-office action.** This is the **strongest cross-cutting case yet** that the
  shipped build should **own all per-phase upkeep/bookkeeping** so a campaign survives to its end.
- **★ NEGATIVE RESULT — no thread reaches a "future" era.** Despite its title, `ad0f2875` ("A 1772
  to future") **stalls at 1874 (mid-Gilded), reaching no post-Gilded content** and never completing
  (it stops mid-export, no game-over). Across **all** ingested threads, **"Era of the Future"
  remains undocumented/hypothetical** — the documented timeline end-state is unchanged (see §27).
- **Era model is now MULTI-SAVE confirmed** — `ad0f2875` (1772-start) + `rep1800` (1800-start) emit
  identical era-band labels at identical in-game dates, cross-confirming the full 1772→Gilded
  traversal from **two different start years** (§27.1). The content-band era architecture is the
  most-corroborated finding in the KB.

*New in batch 9 (`nuke`, the 1948→~2005 Cold-War/modern corpus — the largest in the KB; mostly the
new **§28** + sharpened **§27.1 / §27.7**; design holes and detail rows are in `game-context.md`,
**not re-documented here**):*
- **Design holes DH-45..DH-58 and detail rows #106..#114 are logged in `game-context.md`.** The
  highest-value, build-shaping ones:
  - **★ NEGATIVE SCOPE — the "Cold War" is NOT a system** (§28.2): it is the generic war engine
    (§21.1) relabeled + EraEvos/A-B events + the diplomacy subsystem (§28.3). **Do NOT build**
    nuclear/MAD/NATO/space-race/military-branch mechanics — they do not exist in the design.
  - **★ Data-loss hole (same theme as DH-36)** — the whole Neocon-era **census/EV-delta event block
    was lost** (events stored alphabetically-by-era; EV-change events lack "EV" in flavor text →
    unsearchable, then mis-moved to "Era of Terror"). → **REQUIREMENT: era-event data needs a
    structured `evDelta`/census field** (not free-text flavor) + per-era completeness so a 10-yr
    census reallocation always fires (§28.9).
  - **★ USSR-collapse chain broken + relation meters "beyond broken"** — the dissolution chain
    stalls at a ~5% gate (USSR never falls, still allied in 2005); relation meters have no downward
    pressure (allied with everyone). Needs trigger fixes + downward pressure (§28.2–§28.3).
  - **★ The war engine never resolves + has no branches** (a §21.1 hole, reconfirmed); **white peace
    rarely possible**; landslide margin-cap model misfires on blowouts (§28.6); event firing-rate is
    bimodal (~5% pre-Terror vs ~25% in Terror); Wyoming Rule un-implementable without a real
    population/apportionment model (§28.13).
- **★ DESIGN-INTENT recorded — the digital APP is built for 1-human-vs-9-CPU** (the strongest corpus
  statement; multiplayer "goes off the rails"; the points system is for CPUs + enthusiasm, not
  humans). The tabletop/forum game is team-MP with CPU backfill; **both are true — the app is a solo
  adaptation.** This **validates building solo-first with CPU-faction AI as load-bearing** (§28.12 /
  §25). The CPU-faction AI is **entirely unexercised** by this human playtest.
- **★ OPEN QUESTION recorded — Senate pass-threshold** (§28.5 / §28.12): a built-in **~60%
  supermajority to PASS** the Senate, or **simple-majority-to-pass with ~60% being cloture only**?
  Sources conflict; needs the human/codebase to settle pass vs cloture.
- **Timeline note:** this 1948 thread is the chronological **PREDECESSOR** of the already-documented
  `modern` 2004→2020 thread (§22) — the mechanics doc now covers a **continuous 1772→2020 timeline**;
  the **2004 Cuomo election (§28.6) is the seam** between §28 and §22.
- **Corroborations (confidence bumps, not new surface):** the **era-band model now holds across a
  THIRD start year (1948)** — confirmed 1772 / 1800 / 1948 — and is **refined into TWO LEVELS**
  (point-banked bands + a separate per-decade census, §27.1); the **ideology scale is a CIRCLE** is
  now **two-thread confirmed** (`nuke` POST 9842 independent of `rep1800`, §27.7); **offices created
  AND abolished by ordinary law** confirmed founding→modern (§28.5); the **"Neocons" era band was an
  earlier-extractor MISLABEL** (a faction rebrand + decade content-rotation, corrected in §27.1).

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

9. **★ Relocation cap: shipped `5` vs design's `4` — SETTLED 12-30-25** (vcczar approved in
   `smallbugs#POST 734-735`). Mid-thread the engine **designer (`vcczar`) asked whether relocation
   was too easy**; the GM proposed a **cap of 4** non-alt-state relocations and **it went LIVE in
   the running playtest** ("You can ATTEMPT to move a TOTAL of FOUR pols. Alt-state moves don't
   count," `hd` POST 7062–7066, 7555); the formal **vcczar approval landed 12-30-25** in the
   `smallbugs` bug thread (POST 734-735). **The shipped build is still at
   `RELOCATION_ATTEMPTS_PER_TURN = 5` (`types.ts:247`)** — the browser engine has **not** caught
   up to a design change the forum already plays AND has formally approved. This is a **concrete,
   dated shipped-vs-design divergence** and the single strongest proof that the canonical spec is
   the latest playtest, not a frozen rulebook ([§6.2.x](#62x-forum-design-layer-designed-not-built);
   `game-context.md` ★ note + #38). The shipped value also exceeds `RELOCATIONS_CAP`-adjacent
   intent; **direction = lower to 4. ★ RULED — this is no longer an open design question.**
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

*New in batch 6 (`pop`, 2012 fresh-modern boot):*

14. **★★ NEW endgame model: meter-driven game-end clock vs. event-driven `triggersGameEnd`.**
    Shipped engine has only an **event-driven** game-end (`EraEvent.triggersGameEnd`,
    `types.ts:1635`). `pop` records a **meter-driven** path: a meter (Planet Health)
    falling into a specific bottom-tier band starts a **10-game-year countdown clock to
    mandatory game-end** (`pop` POST 542, 548 — APOCALYPSE). The two paths must **both**
    exist; the build needs `game.endgameClocks: { meter; threshold; remainingYears }[]`
    in `FullGameSnapshot`. **NEW engine surface — explicit roadmap item** (see [§26.4](#264-apocalypse-planet-health-endgame--the-10-year-clock-new-endgame-model)).

15. **Cabinet seats: static `cabinetSeatsForYear` lookup vs. dynamic seat list.** Shipped
    cabinet seats are a year-keyed static lookup (`types.ts:1196`). The designed model
    (§24.6 + `pop` §26.5) is a **dynamic seat list driven by passed legislation + era
    events**: a bill carrying `createsCabinetSeat: SeatSpec` appends a new seat. The
    static lookup acts only as the **initial boot seed**; thereafter the list is mutable
    state. Replace `cabinetSeatsForYear` reads in the cabinet phase with a read of the
    dynamic list.

16. **Amendments toggle CAPABILITIES, not just rules.** The shipped engine treats amendments
    (where they exist) as durable rule-flag changes; `pop` POST 951 shows amendments
    additionally gating **action-library entries** ("Send VP to Shore Up Support" requires
    12th). Each action-library entry needs a `requires: AmendmentPredicate?` field; libraries
    filtered against `game.amendments.passed` at evaluation. Pairs with §21.3, §24.4 (the
    ratifier/threshold-as-tunable), §26.7.

17. **State roster keyed to BOOT YEAR, not era enum.** Shipped behavior is one roster per
    scenario (`states1772.ts`, `states1856.ts`). The 2012 fresh-modern boot needs **50 + DC**,
    NOT 53 (`pop` POST 264). The 53-state alt roster (`modern` §22.10) is the *product* of
    60-yr in-game annexation events. Build needs **multiple rosters per era**, selected by
    `{era, startYear}` not by `era` alone, and the era-event annexation chain must mutate
    the snapshot's state list at fire time.

*New in batch 7 (`rep1800`, 1800→1868):*

18. **★★ Eras are CONTENT-BANDS gated by game-state + territory, NOT calendar year — the
    headline architecture delta.** Shipped engine derives era cadence and (implicitly) era
    identity from `year % 4` / `year % 2` (`phases.ts:49–58`) and a 4-value `Era` enum
    (`types.ts:1337`). The design advances eras on a **game-state / meter / territory-ownership
    boundary** (advanced per half-term), with the **calendar year cosmetic** (this campaign's
    LA Purchase fired calendar **1834**; the clock ran ~30 yrs behind its content). The build
    must make the era an **explicit content-band gate**, demote the year predicates to phase
    *cadence only*, and gate every bill/event/draftee on **territory ownership**. The forum's
    finer-grained Republicanism / Democracy / Manifest-Destiny / Nationalism bands are
    **sub-bands of the single shipped `nationalism` value** (only "Nationalism" maps to an
    enum). **The central architecture question for the build.** (See [§27.1](#271--the-era-model--eras-are-content-bands-gated-by-game-state--territory-not-calendar-year);
    `game-context.md` #92.)

19. **12th-Amendment election-mode toggle (pre-12A: legislature-chosen electors + NO
    conventions).** Shipped `calcStateVote` resolves the general by **popular vote everywhere**
    and conventions are era-gated on but otherwise always available post-`independence`. The
    early-republic design has a **pre-12A mode**: per-state **`electorsByLegislature`** (EV by
    who holds Gov/Sen/Rep, mirroring `senatePre17`, `types.ts:701`) **and no conventions at
    all**; the in-game "Party-Ticket Amendment" flips the mode (unlocks conventions + the
    separate VP-on-ticket). A **major election-system mode switch** the shipped build lacks.
    (See [§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle).)

20. **Ideology is a CIRCLE, not a line (mid-era).** Shipped `Ideology` is a 7-value linear
    scale; adjacency math treats LWPop↔RWPop as maximally distant (distance 6). The design
    **wraps the scale modulo-7** at a mid-era rule change (`distance(LWPop,RWPop)=1`), enabling
    LWPop↔RWPop shifts at ~25% and extending conversion targeting to adjacent ideologies. A
    **cross-cutting math change** touching ideology-shift (§6), conversion gating (§25.8), and
    the SCOTUS within-1-step rule (§26.6). (See [§27.7](#277-the-ideology-chart-becomes-a-circle-mid-era-rule-change).)

21. **Amendments mutate CORE engine parameters (not just durable flags / capabilities).**
    Extends divergence #16 (amendments toggle capabilities): the design lets amendments change
    **core params** — presidential **term length** (4→6, the "Sexenio"), **one-term limit**,
    **suffrage rule**, **the ratification supermajority itself** (3/4→2/3) — taking effect the
    next half-term, **undoable by later amendments**, with **Puritan/Integrity forced-vote
    overrides** and **no grandfather clause** (a hole vs `modern`). (See [§27.8](#278-amendments-mutate-core-rules-mid-game-the-sexenio-experiment).)

22. **Reconstruction Strict/Ironclad plan can NEVER pass with CPU → SOLO RECONSTRUCTION IS
    UNRESOLVABLE.** GM-verified (`rep1800` POST 9170): only 3 factions would ever vote for the
    historical Ironclad-Oath plan, "in a single player game it basically can never pass." A
    **solo-play blocker for ANY antebellum/CW scenario** and a primary driver of the in-progress
    CW/Reconstruction rules rewrite. Also: Reconstruction **hard-codes a Red +2 Southern bias
    even in a Blue-won alt-history** ("historical sim, not alt-history") — a **deliberate design
    stance the build must decide on**, not a bug. (See [§23.4](#234-57-reconstruction-readmission-subsystem-end-nationalism--gilded);
    `game-context.md` DH-class.)

> **★ New design holes from `rep1800` (DH-29..DH-35 — point to `game-context.md`, not
> re-documented here).** Seven new design holes joined the gap log this batch (see
> `game-context.md` → design-holes):
> - **Era-events-predating-start are DROPPED (BUG-1 class — merge/extend).** GM-confirmed: an
>   era event whose trigger window predates the scenario start year is **silently unavailable**
>   (verbatim, §A POST 2668: the **Louisiana Purchase** "is listed under the previous Era of
>   Federalism… since we started in 1800 it wasn't included"). The GM **hand-added** it in 1816,
>   it then **fired but blundered** → the US never acquired Louisiana for decades. Independent
>   live confirmation of **BUG-1** (`buildEraEventsForYear`, `phaseRunners.ts:2817`; the latent
>   1800-start LA-Purchase loss noted in the Confirmed-shipped-bugs callout below).
> - **Event-scheduler has a MAX but NO MIN floor** (§A POST 2919–2932). Events scale by a fixed
>   per-era count (over a 20-yr era a 25%-event ≈94% cumulative); "the limit is a max not a min."
>   **Agreed fix: minimum = 20% of the era's max (round down)**; if still none fire, fall back to
>   5 generic anytime events. (A hard-year-window alt was *rejected* — "events not happening
>   every playthrough has been explicitly stated to be how the game operates," load-bearing for
>   alt-history.) Reconciles with the §21.7 scheduling fork.
> - **Procedure-subtype bills BYPASS the veto but the engine MIS-ROUTES them to the President**
>   (§A POST 2342–2348). `subtype: procedure` bills (Institute Filibuster, create-whip-offices)
>   should NOT go to the President (corroborates the `hd` DH-8-class procedure-routing hole).
> - **SCOTUS can VOID a STATE → "a state cannot be ruled unconstitutional."** The Maine episode
>   ("Pickens v. Maine's Existence" passed 5-1 → Maine statehood **voided after** a census counted
>   it). Consensus fix: a state **cannot** be ruled unconstitutional (territory can be revoked;
>   secession is the only un-making). (§A POST 2180–2182 principle; §B POST 3632, 3646–3652.)
> - **Impeachment rules "outdated, don't work"** — the mini-flow runs but the canonical rules are
>   flagged non-functional and improvised (an Integrity justice accused of bribery — nonsensical;
>   only resignation avoids the DomStab/Honest-Gov drop). (§A POST 465–474; §B POST 3594, 3620.)
> - **Static era-biases are unfixable ("AMPU 2.0").** Players want **policy-reactive** biases
>   (abolish slavery → South swings Red); GM + Willthescout7 confirm dynamic biases are "too
>   complicated / not part of the AMPU vision… maybe AMPU 2.0." The **single most-repeated
>   complaint of the campaign** and the root of the **"Red unwinnable 1800–1840"** balance hole
>   (Blue held the House 142–0 by 1804; Jefferson won 179-0 in 1808). (§A POST 2641, 2711–2713,
>   1328–1335, 350, 720–724.)
> - **Thin early-era presidential agency ("this era is a bore").** In pre-primary eras the
>   President's only exec actions are flavor tours; the modern toolkit (primaries, rich exec
>   actions) isn't unlocked yet → feeds the "Blue auto-wins, governing is dull" sentiment.
>   (§A POST 2756–2760, 2930, 3110.)
>
> **Carried/corroborated `rep1800` holes (already in the gap log — strengthened, not new):**
> veto-override POINTS rule reads **backwards** (corroborates row #82, §A POST 327, 328, 2333);
> **>2-term presidential malus intended-but-UNWRITTEN** (Jefferson served five terms, no penalty,
> §A POST 1318–1321); amendment ratification **one-shot** (corroborates #39/#64); **relocation
> cap DECIDED-AS-UNLIMITED here** (Ted declined a cap, only brake = Carpetbagger — **contradicts
> `hd`'s cap-of-4 AND shipped `5`**; the build must pick a stance; sharpens #38 / divergence #9,
> §B POST 6240–6245); realignment/era-party-formation triggers **unmeetable** (60% flip too high,
> no leader/President exemption — corroborates #40, §B POST 6344, 6497–6522).
>
> **Note:** this thread is **batch-1's predecessor** — the 1800 campaign is now documented
> **end-to-end** (1800→1868 here via `rep1800`; 1868→Gilded via `gilded`/`f4c7c2c4`).

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

> **New design holes from `pop` (DH-24..DH-28 — point to `game-context.md`, not re-documented
> here).** Five new design holes joined the gap log this batch (see `game-context.md` →
> design-holes): **DH-24** Senate-class boot data buggy for fresh modern scenarios
> (boot-data-quality validator needed); **DH-25** career-track bootstrap is a 3-year-stale
> design discussion (no canonical rule for which existing pols start on career tracks at boot —
> blocks the modern scenario shipping); **DH-26** 3rd-party VP "same traits" rule is prohibitive
> (makes 3rd-party tickets nearly impossible; pairs with DH-11 Dem 3rd-party structural bias);
> **DH-27** trait-conflict adjudication slips in boot/draft data (`TRAIT_CONFLICTS` is run only
> on trait-add events, not at dataset/boot import); **DH-28** "Repeal deals with climate crisis"
> tag — incomplete data tagging is gameable (per-bill meter-impact tags must be COMPLETE and
> verified at dataset-build time — generalizes to other meter-impact tags + the era-double-
> points tags from §26.3).

> **Confirmed shipped bugs (fixes, not features).** Defects surfaced by the forum threads are
> catalogued in `game-context.md` → "Confirmed shipped bugs" and owned by the roadmap as fixes.
> **From `fed`:** **BUG-1** era events never deactivate for non-1772/1856 start years (latent in
> `buildEraEventsForYear`, `phaseRunners.ts:2817`; an 1800-start wrongly loses the Louisiana
> Purchase) — **now LIVE-confirmed by `rep1800`** (the 1800 campaign's LA Purchase was *silently
> dropped* as a Federalism-era event; the GM hand-added it in 1816, §A POST 2668 — see DH-29 in
> the batch-7 holes above); **BUG-2** `Chisholm v. Georgia` needs an "11th Amendment not ratified" gate (SCOTUS
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

> **★ DH-61 (NEW) — scenario-boot must SEED era-active wars (`oopscpu#POST 338-344`). DESIGNED,
> not built.** The all-CPU 1788 run revealed that **1788 should start with an ACTIVE WAR** — the
> **Northwest Indian War** (active, **20% chance to lose, War Score −2**) — and **the GMs forgot to
> seed it entirely** (*"lmao we literally forgot"*; ruled to "proceed like it was won"). The source
> war chart (V's) has an **"active wars by start date" tab**: a scenario starting in a given year
> must **boot with the wars that are historically active at that start date already running** (with
> their loss-odds + War-Score effects applied), not start every scenario at peace. This is a
> **scenario-boot pipeline requirement** (relates to #45 + #86 boot pipeline,
> [§26.1](#261-the-mid-government-boot-shape-general) / [§27.1](#271--the-era-model--eras-are-content-bands-gated-by-game-state--territory-not-calendar-year)):
> the boot procedure reads the start-year's active-war set and instantiates each as a running `War`
> in the generic model above. (The 1772 scenario's Revolutionary War, [§17.4](#174-revolutionary-war),
> is the only war the shipped boots seed — every other era-start currently boots at peace.)

> **★★ #152 (NEW) — the war engine resolves in DEFEAT (a loss PACKAGE), and wars are MULTI-PHASE
> (`terror2000`, batch 15). DESIGNED, not built.** Prior digests (`fed`/`hd`/`drums`, #56/#106)
> documented the **victory** package and per-*battle* defeat; `terror2000` is the first to record a
> whole **war LOST** with its terminal **loss package** — the inverse-and-mirror of the victory
> bundle. The **War on Terror was formally LOST ~2005** (withdrawal speech, `terror2000#POST 639,
> 656-662`, ch31), while the **War in Afghanistan ran to "Phase II"** (`POST 1027`):
>
> | Side | Package on resolution |
> |---|---|
> | **VICTORY** (existing, §23.3 / #56) | officers gain Mil + Military-Leader; **President gains PERMANENT +1 in ALL elections**; Party-Pref / meter gains; territory grant |
> | **★ DEFEAT (NEW, #152)** | military **officers −1 Mil + −1 in ALL future elections**; the **PRESIDENT gets −1 in ALL future elections**; **Party-Preference CRATERS** (capped if already maxed); + the per-battle confirmation cascade (Incompetent / fired / court-martial-eligible) |
>
> - **A war MUST be able to END in loss** — not only win or stall. The shipped flat resolver
>   (`phaseRunners.ts:3613-3620`) *does* end a war at `warScore ≤ −50` (logs "ends in our defeat")
>   but applies **NO loss package** — that package is the new build surface.
> - **Multi-phase wars:** wars carry **across half-terms** and step through **named phases**
>   (naval → ground; *"Invasion"* → *"Counter-Terrorism"*; Afghanistan reached **Phase II**),
>   carry-rolled when there are more losses than wins (corroborates the §23.3 carry-roll + the
>   "war engine must RESOLVE" finding, #56/#106). The **success-chance formula was ALSO re-confirmed
>   natively in the 2000s**: `Planning(CNO/CoS + SecDef) + Officer(Mil×10 + naval-invasion-bonus) +
>   Meters(Prep 15) + Allies(UK/Ger/Japan 5) + Benchmarks + Difficulty(Easy 0 / Med −10 / Diff −15)
>   → d100`, naval (Arabian Sea) gating the ground invasion (`terror2000#POST 816-817` ch11;
>   `152-277` ch20; `599-1027` ch31).
> - **The President-loss term couples to elections:** a President who LOSES a war carries the −1 into
>   the §29.3 election scorer for **all future elections** (the symmetric inverse of the victory +1).

*(designed, not built — generalize to a `War` model usable in any era: the additive
success-chance formula, the warscore/momentum/×2 resolution, and the confirmation-cascade
side effects. Fold the 1772 Rev-War loop into it as one configured instance. **#152: add the war
DEFEAT resolution package** (officer −1 Mil + −1 all-elections; President −1 all-future-elections;
Party-Pref crater) as the inverse of the victory bundle, and ensure **multi-phase wars (Phase I/II,
naval→ground, "Invasion"→"Counter-Terrorism") carry-roll across half-terms** — a war must be able to
resolve in LOSS, not just stall or win (`terror2000#POST 639, 656-662, 816-817, 1027`). **DH-61: the
scenario-boot must seed the start-year's historically-active wars** (e.g. 1788 → NW Indian War,
20%-loss / WS −2) as already-running `War` instances, from an "active wars by start date" table.
Cite `oopscpu#POST 338-344`.)*

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

**★ SCOTUS can OVERTURN a ratified Amendment, and the amendment threshold is itself amendable
(batch 8, `ad0f2875`).** Two new operations on the amendment substrate, both used in play:

- **Judicial review of an Amendment → repeal/demotion (★ CONFLICT — see flag below).** A
  **Governor-requested judicial review** can put a ratified Amendment in front of SCOTUS, which
  may strike it. `ad0f2875`'s **13th (this-timeline "National Suffrage for White Male Property
  Owners") was overturned 4–3**, reverting it to a mere **governor-action** (Congress may re-pass)
  (POST 37, 48); the separate Taylor-McDowell law was overturned the same way (POST 50). So an
  amendment is **durable but not permanent** — there is a **review/repeal loop** on top of the
  ratify/repeal-by-later-amendment paths. (Extends #39.) **★ However:** this conflicts with
  Ted's later official ruling in `smallbugs#POST 250-269` (see CONFLICT FLAG below).
- **The amendment threshold is mutable in play.** The Convention set the bar at **3/4 of states**;
  a later **"Morris 2/3 Ratification Amendment" (this timeline's 14th) lowered it 3/4 → 2/3** (POST
  57; ratified by the normal Gov/state vote, POST 675). This is the founding-era instance of the
  §24.4 *ratifier+threshold-is-a-tunable-field* and the §27.8 *amendments-mutate-core-rules* findings,
  reached from a 1772 start.

> **★ CONFLICT FLAG — amendments-NOT-SCOTUS vs `tea1772` #100 (cross-reference [§11.3.y](#113y--ted-ruled-gov-action-challenge-legislation-restrictions-designer-authoritative-tedchange--smallbugs)).**
> The playtest-GA path above (`ad0f2875` POST 37, 48, 50; `tea1772` #100 from earlier batches —
> SCOTUS CAN overturn a ratified amendment via Gov-requested judicial review) is **CONTRADICTED
> by Ted's later official rules-doc ruling** (`smallbugs#POST 250-269`): *"I'm going to make it
> so Govs can't challenge amendments… the Constitution is by definition constitutional… rule doc
> has been updated to reflect this."* **Authority hierarchy:** Ted (`smallbugs` rules-doc update)
> > playtest GA rulings. **Build target:** ratified amendments are NOT challengeable by Gov-
> requested judicial review. The playtest path above is **recorded as historical context** but
> is **not the canonical build behavior**. (The amendment-threshold-itself-amendable path
> remains valid and is not affected by this conflict.)

> **★ UNBUILT design hole — the general SCOTUS-ruling → downstream-statute cascade.** Distinct from
> the *built* abilities to **strike a single law** (`ad0f2875`'s Republic of Texas Act was passed
> then judicially repealed, POST 770–784) and to **overturn an Amendment on review** (above), the
> **general cascade** — a SCOTUS ruling that *contradicts a law on the books* automatically
> voiding/neutering that law — is **NOT modeled and was explicitly DEFERRED by `vcczar`**. A
> spectator argued **Prigg v. Pennsylvania** should void the Fugitive Slave Act; the operator was
> told *"V will need to think about it"* (POST 124–126). ⇒ today **a contradicting ruling leaves the
> law operative.** This is the open design question (cross-ref §24.4's Pollock→income-tax coupling,
> which IS a designed gate; game-context DH-class). (`ad0f2875` POST 48, 50, 124–126, 784.)

*(designed, not built — add `game.amendments: { id; passedYear; data? }[]`; a cross-state
ratification vote at the gov phase; an amendment bill type; effect-binding checked at the relevant
phase boundaries; a **Gov-requested judicial-review path that can repeal/demote an amendment**; a
**mutable ratification-threshold** field (§24.4/§27.8); and — the hole — a designed
**SCOTUS-ruling → downstream-statute cascade** policy.)*

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
- **★ Ted-RULED — newly-created OFFICES are not staffed until the next 2.3 appointments phase
  (`oopscpu#POST 89`).** A bill that **creates an office** (AG, Bank President, a new cabinet seat)
  does **not** fill it immediately — it **prompts an appointment at the following 2.3 appointments
  phase**, not at bill-passage. (Pairs with the bill-creates-office pattern,
  [§26.5](#265-era-event-creates-office-bill-installs-a-new-cabinet-seat): the office is installed
  on passage; the *staffing* is deferred to 2.3.)

*(designed, not built — wire statehood/territory bills → `admitState`; add event/war-driven
annexation; **auto-generate politicians** for under-populated new states; **a bill that creates an
office defers staffing to the next 2.3 appointments phase**, not bill-passage (`oopscpu#POST 89`).)*

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
- **★ Ted-RULED — strip over-cap crisis/spending bills BEFORE the House vote (`oopscpu#POST 86`).**
  Bills beyond the cap are **removed PRE-VOTE**, so they **can't be packaged into a surviving bill**
  (an exploit where an over-cap bill rides along inside a passing one). The cap-trim happens at the
  proposal/committee boundary, not after the floor vote.
- **★ The cap, pinned (`oopscpu#POST 277`):** at minimum Rev/Budget, **1 crisis bill**; non-crisis
  **spending = up to 2 bills at Overspending** (sharpens the `1772s` "3 at Overspending" reading —
  the all-CPU run used a 2-bill non-crisis cap at Overspending).

*(designed, not built — add `Bill.type: 'foundational' | 'spending' | 'crisis' | …`; a
numeric **per-turn spending budget** that gates non-crisis spending bills at the floor; the
crisis-bypass; a cabinet free-proposal slot; **strip over-cap crisis/spending bills BEFORE the
House vote** so they can't be packaged (`oopscpu#POST 86`); the cap = 1 crisis (min Rev/Budget) /
≤2 non-crisis spending (Overspending) per `oopscpu#POST 277`.)*

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

### 21.9 Presidential-vote modifier stack + era-stamped Popular/Unpopular issue list (designed, not built)

> **Designed, not built (batch 8, `ad0f2875`).** The GM exposed a clean enumerated modifier stack
> for the EC general and an era-keyed issue list for bill/platform tie-breaks. Both refine the
> shipped `calcStateVote` ([§15.1](#151-calcstatevote--the-core-resolver-phaserunnersts3685)) and
> the modern enthusiasm engine ([§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy)),
> seen here in the 1772/Nationalism era. (`ad0f2875` POST 137, 139, 151; game-context #105.)

**The presidential-vote modifier stack** — additive per-candidate modifiers layered onto the
state-vote score, enumerated by the GM:

| Modifier | Δ | Cite |
|---|---|---|
| **3rd-term bid** (term fatigue) | **−1** | POST 151 |
| **"Controversial vs Integrity" trait matchup** | **−1** | POST 151 |
| **Economy meter** | **±** (a "Great Recession" gave **−3** to the incumbent; "economic troubles" −1) | POST 139, 151 |
| **Major scandal** | **−2 each** (scandal ×2 = −4) | POST 151 |
| Regional / meter swings | ± (e.g. a meter "+2 to GOP") | POST 139 |

The cleanest single statement is the **1868 upset** (POST 151): a GOP incumbent loses 110–178 from
−1 third-term, −1 trait-matchup, −1 economy, and −2×2 scandals. These map onto the shipped
`calcStateVote` as additional additive terms (alongside `baseLean×5`, `partyPref×5`, `enthusiasm×2`,
`pvCache×0.1`, trait + faction-card terms). **Realism caveat:** this run shows national meters +
candidate election-stat + scandal rolls **swamp state partisan-lean**, producing geographically
implausible maps (Deep-South states voting Republican in 1860; Dems winning IA + PA in 1864 — POST
138–139, 147). State bias is a **soft modifier** easily overridden — a logged balance/realism gap
(game-context DH-class).

**Era-stamped Popular/Unpopular issue list** — for tie-breaking bills/platforms when ideology is
silent, the GM prints an **era-specific** issue list (POST 137). For ~1860: **Popular** =
pro-deregulation, pro-increase-tariff, pro-increase-taxes, anti-Native-American; **Unpopular** =
women's suffrage, pro-labor, pro-social-security, pro-welfare, pro-LGBT, going to war,
pro-regulation, intervening in natural disasters, anti-corruption. The **anachronistic entries**
(pro-LGBT, social-security in 1860) reveal a **single global issue list with an era-sensitivity
overlay** — the same "era-aware popularity" the modern double-points scoring (§26.3) and the
new-era issue brief (§27.2 step 4) point at, here used for **bill/platform tie-breaks**.

*(designed, not built — add the **presidential-vote modifier stack** (3rd-term −1, trait-matchup
−1, economy ±, −2/major-scandal, regional/meter swings) as additive `calcStateVote` terms; add an
**era-keyed `{popularIssues, unpopularIssues}` table** consulted as a tie-break when a bill/platform
plank is ideology-neutral. Pairs with §22.2, §26.3, §27.2.)*

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
  at its widest (federalism 5, gilded 6, modern 8; +Israel/Japan). **`pop` corroborates the
  Israel meter ACTIVE in the modern era** (`pop` POST 525, 742; pairs with §24.7 1856-native
  where Israel was present-but-INACTIVE in 1900 — i.e. the activation rule fires at the
  modern era boundary at latest). Per-power relation **cap behavior confirmed** in `pop`:
  Japan was already maxed, no further +1 (POST 533) — the cap is bidirectional, not just a
  bottom-clamp.

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

> **★ Sharpened by `dem1820` (batch 10): a concrete meter→enthusiasm→election PROCESSING rule +
> the hard ±3 cap — but its STATE-SCOPE is an unsettled 3-way fork.** GM `Ted` re-derived and
> published (from his 2000 playtest) the load-bearing per-step rule the modern engine above only
> sketched (`dem1820` POST 569, 575, 618):
> 1. **Non-enthusiasm meters MOVE the per-ideology enthusiasm boxes.** A meter effect worded
>    "−1 for Progs/Libs" (e.g. Revenue/Budget) **shifts Prog + Lib enthusiasm +1 toward Red each**.
>    (This is the upstream half of the §22.1 meter→election table — meters feed enthusiasm, which
>    feeds the per-candidate `enthusiasm × 2` term.)
> 2. **Enthusiasm boxes then apply to the per-state vote** — e.g. a **+3 Blue LW-Pop** box adds
>    **+3 to all Blue LW-Pop candidates** — gated by the state-scope fork below.
> 3. **HARD ±3 CAP on the ideology + party-preference bonuses** (state-specific bonuses are
>    **uncapped**). This is the **election-engine** instance of the cross-era **±3 swing cap**
>    ([§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter)) — confirmed here from a
>    3rd start. A **"State of the Meters" table** is published before the election (POST 618).
> - **★ THE STATE-SCOPE SUB-QUESTION (#18) — RESOLVED by `terror2000` to V's 2-layer model.** Ted
>   reversed his own batch-10 "every state unless penalized" reading and pinned **V/vcczar's 2022
>   canonical 2-layer scorer** (`terror2000#POST 913-926`): **(a)** a **universal per-ideology METER
>   modifier** applied to **BOTH parties' candidates of that ideology in EVERY state, primary AND
>   general** (flat, no "unless penalized" caveat), **PLUS (b)** the **per-PARTY enthusiasm box** (moved
>   by the #51 4-step reshuffle) layered on top per-state-bias. The two **compose additively** then run
>   through the ±3 cap. Full statement + the concrete meter→ideology table in
>   **[§29.3](#293--the-meterenthusiasmelection-model--51-resolved-drums-4-step--18-resolved-terror2000--vs-2-layer-model-gap-1851)**.
>   This is **the canonical election scorer** — no longer an open fork.

> **★★ #51 RESOLVED by `arkzag` (batch 11): the 4-step reshuffle ALGORITHM is settled.** The
> `arkzag` final chunk publishes the 4-step faction-performance → enthusiasm rule **VERBATIM**
> (`arkzag#POST 195–207`) and it **matches the `modern`/`drums` model in this section exactly** —
> two GAs (Zagnut + Ark) on a third start year converging on the canonical reshuffle, applied
> **per-Congress** on the legislation tally. So the **algorithm above is no longer in dispute** (it
> is settled to this version); **only the #18 state-scope sub-question** (which states a settled box
> touches) remains a human call. Full settled rule + the **crisis-bill-failure −100/waiver scoring**
> it pairs with: **[§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved)**.

*(designed, not built — implement the 4-part reshuffle (#51, SETTLED to the §29.10 form) + a faction
`Score` field + era-end awards + the lowest-faction team penalty; wire Score into the meter→election
map; **implement the meters-move-enthusiasm-boxes step + the hard ±3 cap on ideology/party-pref
bonuses (uncapped state-specific). The election SCORER itself is now SETTLED to V's 2-layer model
(#18 RESOLVED, §29.3): layer (a) universal per-ideology meter modifier (both parties, every state,
primary+general) + layer (b) per-party enthusiasm box, composed additively then capped — no open
state-scope fork remains.**)*

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

> **`pop` corroborates 5-group primary end-to-end.** The 5-group Debate → Scandal → Broke →
> 24-h Actions → Primary-Day loop with Major/Minor candidate gates ran cleanly through the
> 2016 Dem (5-faction × Major + Minor) AND GOP primaries, ending with Napolitano (B4) 1189
> over Biden (B2) 1009 / Brown (B1) 372 / Harris (B3) 61 / Gillibrand (B4) 10 (`pop` POST 30,
> 53–62, 88–180, 762, 799–849, 888, 945–947). **6th-era confirmation** of this loop. The
> 4-part enthusiasm reshuffle, the 6-axis ticket scoring, the convention plank scoring, the
> 3-debate + October Surprise + per-region general (October Surprise: Revenue/Budget Crisis
> improves → +1 Blue + Napolitano nationwide, `pop` POST 972) are all 6th-era confirmed too.
>
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

> **Sharpened by `pop`: factions within 1 ideology step auto-confirm.** Declarative rule
> (`pop` POST 561): a faction whose center ideology is **within 1 step** of the nominee's
> ideology **auto-votes AYE** — only factions **≥ 2 steps away** may oppose. Worked case:
> KBJ + Goodwin Liu (both Lib) confirmed because only R1/R2/R3 were ≥2 steps from Lib —
> insufficient bloc to block. This is the **modern confirmation threshold by ideology
> proximity**, distinct from the cabinet's 50/50 trap ([§25.5](#255-cabinet-confirmation--designer-acknowledged-bug-36-of-88-nominees-passed))
> and from compel-vote (`Iron Fist`). First explicit declarative form of this rule.

> **Sharpened by `pop`: Manipulative-Pres compel-retire IS DISTINCT from Iron-Fist
> overload.** A **Manipulative president** can compel a Justice's retirement **if the
> target lacks Integrity OR has Judicial < 5** (`pop` POST 555). This is a separate
> trait-power from Iron-Fist's compel-VOTE (`drums` POST 3660) and from the 5-Judicial
> immunity rule documented elsewhere. Three distinct powers, three distinct traits:
> **Iron-Fist ⇒ compel a vote** (Justice flips on a docket case);
> **Manipulative ⇒ compel a retirement** (Justice gated by !Integrity OR Jud<5);
> **age ≥ 75 OR ≥ 12 yrs** ⇒ the **shipped 0.15 retire roll** ([§14](#14-executive--court-management-28x)).
> Sharpens §25.9 by **removing** the Manipulative-compel-retire effect from the Iron-Fist
> overload table — it always belonged to Manipulative.

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

> **★ UNSETTLED FORK (`dem1820`, batch 10): is the court PLAYER-controlled or all-CPU?**
> `dem1820` ran a **player-controlled Supreme Court** "for the first time in years" and it
> triggered a multi-party design argument. The fork — fully recorded in
> **[§29.2](#292--unsettled-fork-a--player-controlled-scotus-gap-52)** — is between
> **all-CPU-by-ideology** (`Ted`/`Matt`'s default + the shipped abstraction) and
> **player-controllable-with-restrictions** (`ebrk`/`Lars`: "how the game should be"), with a
> **trait-gated** middle (`Vee`). What it **resolves cleanly** (the canonical rule the table
> agreed on): a player Justice does **NOT** vote individual cases — **votes follow vcczar's
> by-ideology chart, ties roll a die**; what the *player* controls is **delay / dismiss** —
> a case may be **delayed**, but may be **DISMISSED only if it was brought by a Gov Action**
> (never a historical case), and the controlling party **must hear ≥ 1 case** (can't delay
> them all; CPU only delays when it lacks the numbers). This **re-enables** player control
> that **`pop` (batch 6) recorded the designer as having disabled** (`pop` POST 479-480) — both
> sides are an open design question, logged `game-context.md` #52. The **tie-affirms-the-lower-
> court** + **ahistorical-flag** mechanics are *corroborated* here (Worcester v. Georgia NAY 5-1
> "historical"; Charles River Bridge 3-3 → split affirms lower court → randomly rolled AYE
> "ahistorical"). (`dem1820#POST 420-443`.)

#### 22.7.y ★ Ted-RULED CPU Chief-Justice selection ladder (designer-authoritative; `tedchange`)

> **AUTHORITATIVE — Ted's `tedchange#POST 388`, RULED** (rule authored by Ark in POST 388;
> Ted incorporated into the rules doc). Sharpens [§22.7](#227-scotus-subsystem-253--282).
> Resolves the previously-unsettled CPU CJ selection question (Umbrella POST 387).

**The CPU Chief-Justice selection ladder, applied when a CJ vacancy fires:**

1. **Highest Judicial ability from the appointer's party** — primary picker rule.
2. **Multi-faction tie**: prefer **the appointer's own faction**.
3. Still tied: prefer the candidate whose **ideology matches the appointing President**.
4. Still tied: prefer the candidate from the **lowest-scoring faction** (give the underdog
   a boost — same anti-frontrunner principle as PL endorsements in §25.11).
5. **Multi-candidate ties at the end**: prefer the candidate whose **ideology matches the
   appointer's ideology** (if not already applied at step 3).
6. **Final fallback**: random.

*(designed, RULED — implement the ladder for CPU Chief-Justice selection on vacancy. Cite
`tedchange#POST 387-390`.)*

*(designed, not built — a SCOTUS module: a per-term case docket + ideology-vote model; the
Iron-Fist/Manipulative compel-vote and compel-retire powers (with the 12-year minimum + the
conditional-retirement bargain); dynamic court size + court-packing (age-70 trigger, shrink
when ≥ target, set-count bills); confirmation at 64/60% with the failed-nominee
moderate-auto-confirm recovery; appointee ideology reveal + 10-year drift; a ruling →
law-deactivation hook; **a player-vs-CPU control decision (§29.2) — if player-controllable, the
delay/dismiss-only model gated by "dismiss only Gov-Action cases, must hear ≥1".**)*

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
- **Sharpened by `pop`: state count is keyed to the BOOT YEAR, not the era.** A **fresh-modern
  2012 boot** starts at **50 + DC** (`pop` POST 264), **not 53**. The 53-state roster is the
  *product* of `modern`'s 60-yr in-game annexation chain (Cuba/PR pulled in by era events
  between 1948 and ~2012). Implication: the build needs **both** a 50+DC modern roster (the
  cold-boot 2012 baseline) **and** a 53-state continuation roster (reached only via the
  annexation-event chain) — they are **different `FullGameSnapshot.states` arrays for the
  same `modern` era**. Generalizes: rosters are an artifact of the **boot year × era-event
  history**, not a per-era fixed table.
- **Modern apportionment / decennial Census**: a Census recomputes EV apportionment under a
  **Wyoming Rule**, **resets every state's Bias**, and adds/removes a state's **"focus Rep"**
  House seat (post 185, 870, 964: total EVs dropped **706 → 678**). Wyoming-Rule apportionment
  **ballooned the House to 601 seats** (post 185, 420), later cited as **572** (post 1281);
  the **Senate = 106** (53 × 2).
- **★ Sharpened by `dem1820` (batch 10): the focus-Rep abstraction has a clean cross-era
  formula + a seat-locked incumbency rule.** The House is **abstracted** to "focus Reps," each
  controlling a roughly equal share of a state's hidden seats; **rep count per state =
  (EV − 2) / 5, rounded up** (`dem1820` POST 643). **Incumbency is seat-specific**: vcczar ruled
  focus Reps "should be viewed as incumbents" of a specific seat (POST 676), so you keep the **+2
  incumbency bonus only in your own seat/district**, **EXCEPT in census/redistricting years
  (1822, 1832, 1842…)** when you may run in **any** seat and keep it (a Rep whose focus-seat is
  eliminated in redistricting keeps the bonus elsewhere). **Census timing**: the decennial census
  changes House seats in the **following half-term** and is reflected in the **first election of
  the new decade** (1820 census → 1822 midterm), with **EV/presidential impact at the first
  year-ending-in-2 presidential election** (1810 census → 1812 pres; 1830 → 1832). Full ruling +
  the vcczar long-term-wish fork → **[§29.5](#295-the-focus-rep-house-abstraction-gap-55)**.
  (`dem1820#POST 643, 676, 682-686, 696`.)
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
>
> **★ THREE-OUTCOME CONFIRMED + concurrent multi-phase wars (batch 8, `ad0f2875`).** The
> Civil-War branch points are **decision/roll-driven variables, not a scripted path** — the corpus
> now records **three distinct outcomes** of the *same* subsystem: `hd` (President defects to the
> CSA), `rep1800` (UK intervention spawns a 3rd theater), and **`ad0f2875` (NEITHER** — a Republican
> prosecutes the war from the Union side, no UK intervention; the war is triggered by a Harper's-
> Ferry era event + a GM pardon ruling → Southern secession conventions, `ad0f2875` POST 140, 148,
> 153). Holding the defect-branch and the intervention-branch each fixed across two threads while a
> third sees neither is strong evidence both are **branch variables**. `ad0f2875` also confirms the
> **war engine runs several wars CONCURRENTLY as turn-spanning multi-round campaigns**: the
> **Mexican–American War (Phases 1–2)** ran simultaneously with the **Apache Wars (Rounds 1–4)** and
> the **Navajo Wars (Phases 1–2)**, each with its own named general/fort/battle/treaty loop feeding
> commander stats (POST 732, 737, 738, 785, 814). The founding-era **NW Indian War** in `afc6cbd7`
> (post-RevWar, army already disbanded) similarly ran as a separate war track and its US victory
> drove **map expansion via the Treaty of Greenville** (OH/IN/MI/IL/WI, POST 1461, 1486, 1936). →
> war is a **generic, repeatable, concurrent cross-era system** (corroborates §21.1 / #45 + adds
> the concurrency + commander-feedback detail; game-context #102, #104).

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

> **★ Alt-CW VARIANTS — a 3RD campaign (`rep1800`) confirms the secession machinery has more
> branches than `hd`'s one Southern path** (`rep1800` §C-1; multi-confirms the battle %-engine of
> [§23.3](#233-56-civil-war--the-two-theater-combat-engine-multi-term-subsystem) across a 3rd
> campaign + a 4th-overall war). This campaign's war diverges sharply from §23.1's blundered-John-
> Brown trigger:
> - **Early trigger off DomStab=1, NOT a secession convention.** Secession fired ~15 yrs early
>   (~1846) via the era-event **"Southern States form the CSA"** triggering off **Domestic
>   Stability = 1** (the meter floor) — **not** a John-Brown / Hartford / Nullification convention.
>   GM flags this CSA-formation event as the **one** CW trigger that does **NOT** spawn a
>   secession-convention gov-action (likely a missing event field — see §19 hole / DH-class).
>   (`rep1800` §C POST 6884, 6905, 6909–6914.) **Corroborates [§23.2's DomStab-as-CW-gate](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine):
>   DomStab is the secession/CW trigger meter.**
> - **The sitting PRESIDENT defected to lead the CSA** ("Oaths to Two Masters" achievement): Pres
>   James Barbour resigned, joined VA's secession, and was chosen **President of the Confederacy**
>   — the achievement text enumerates **CSA, Hartford Convention, OR Northern Secession**,
>   **confirming the engine models Hartford-Convention + Northern-Secession CW variants, not just a
>   Southern one** (`rep1800` §C POST 6934, 6943). A **VP later assassinated his own President and
>   defected to the CSA**; **all border states seceded** via a later "Secession Fervor Reaching
>   Border States" event (POST 8002, 8142, 7256).
> - **A UK-Intervention theater** (a **3rd theater** beyond East/West) spawned from a blundered
>   "UK Considering Recognition of CSA" event; UK went **Hostile**, propping up the insurgency +
>   triggering the "Enemy Takes Defenseless US" risk (§27 endgame set) (`rep1800` §C POST 6909,
>   7253–7256, 7695).
> - **A GUERRILLA 4th stage the war chart has no rule for.** Union won the conventional war but a
>   CSA roll-to-not-concede (23/25) produced "ACW: Guerilla War"; the **GM had no chart rule and
>   improvised** ("making this up as I go"), running it ~1848→1858 to a low-odds end-war roll
>   (`rep1800` §C POST 7404, 7418, 8652). **A 4th war-stage gap to author** — pairs with §23.3's
>   25% post-victory guerrilla roll (which *here* fired and then had no resolution rules).
> - **Appomattox Agreement** (war won): Party Pref +4 Blue, DomStab/EconStab +1, **Pres gains a
>   permanent +1 in future elections**; a blunder on the implementation roll does **NOT** undo the
>   treaty (only **land-acquisition** events require successful implementation — cross-ref §27.1's
>   "win a war but fail to claim territory") (`rep1800` §C POST 8542–8550, 8654, 8661).

*(designed, not built — a `Politician.allegiance: 'union' | 'secessionist'` state + a
"Secessionists" inactive bucket; a secession era-event chain gated on a blundered presidential
decision; the per-pol secession roll keyed on `Southern Unionist`/`Nationalist` traits + state
region; one-way relocation out of rebel states; the CSA officer/structure events.)*

### 23.2 (#59) Free/Slave sectional-balance crisis scoring (the slavery-era crisis engine)

A sectional counter that punishes whichever side **loses the free-vs-slave state balance** at a
half-term close, **retired on emancipation**. **★ Now confirmed to fire on imbalance in EITHER
direction with the SAME effect package, and from as early as a 1820 start** (`dem1820`,
batch 10) — it is the **slavery-era** crisis engine, not a Nationalism-only mechanic.

- **Trigger — imbalance in EITHER direction.** At half-term close, when the free/slave state
  count goes **lopsided**:
  - `hd` (1856 start, POST 302, 747, 1070): **free > slave** (fired when KS + OR admitted free).
  - **`dem1820` (1820 start, POST 521, 526, 532): slave > free at 14 slave / 12 free** (after
    Arkansas + Michigan statehood — AR slave, MI free), narrated as **"ending the Era of Good
    Feelings."** **Earliest observation of this engine in the KB.**
  In both cases one bloc "wins" the balance and the *other* bloc's faction/officers take the hit.
- **Effect package (the SAME in both directions — the key cross-start finding):**
  **Speaker & Senate Pro-Tem each −250 points + −1 next election; all Moderate factions −250/−500;
  Domestic Stability −2; Party-Preference +2 toward Red; Civil-Rights / antislavery faction
  +250 (and +2 in the next elections) / RW-Activists −250; ALL RW-Activist candidates +2 next
  election** ("livid"). That **the Party-Pref shift is +2 toward RED regardless of which side wins**
  the balance is a deliberate design tilt — see the **#59 design philosophy** (the engine
  structurally advantages the antislavery/Republican pole, cross-ref §23.4's "Red+2"). For a 1820
  start, narrate the "Civil-Rights faction" buff as **antislavery / restrictionism** per the
  historian's polarity discipline, not the 20th-c. movement.
- **Retirement** (`hd` POST 1766): the whole crisis is **removed once slavery is abolished**
  (the 13th-Amendment-equivalent beat) — era-bounded to the slavery eras (Democracy → Nationalism),
  not permanent.

> **★ Confirmed across the FULL 1820→1840 arc (`arkzag`, batch 11) + the crisis-bill-failure
> scoring rule.** The continuation campaign ran the slavery crisis for ten in-game years: a
> **recurring "Abolish Slavery Amendment" tagged CRISIS** appears **every Congress** and **always
> fails** (e.g. **3-9**) — the antebellum trajectory (`arkzag` ch20/24/28/33; §29.8). This exposes
> the **crisis-bill-failure scoring rule** ([§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved),
> `arkzag` ch24 POST 1536, refines #11): **failing a CRISIS bill is −100 points, BUT the penalty is
> WAIVED if the bill conflicts with the faction's ideology → instead +1 enthusiasm toward its
> party.** So the perpetually-failing Abolish-Slavery amendment **waives** the −100 for a pro-slavery
> faction (→ +1 enthusiasm) while an antislavery faction eats the −100 — a per-faction-ideology
> asymmetry layered on top of the sectional-balance package above. Named CRISIS states derive from
> **meter thresholds** ([§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter)).

This is a **sectional free-vs-slave state counter** feeding **score + meter + election** effects,
firing on imbalance either way and sunset on emancipation. **It interacts directly with
statehood/admission** ([§21.5](#215-bill-driven-statehood--auto-generated-officials),
[§29.6](#296-corroborations--the-era-slice-182023)): every statehood bill changes the
free/slave count, so admitting a slave or free state can *itself* trip the crisis at the next
half-term close (in `dem1820` the AR+MI admissions did exactly this). (Codebase note:
`SLAVE_STATES_1856` exists at `types.ts:1152` but **no such crisis scoring** is wired — the
shipped antebellum beats are the loyalty-decay/meter-modulation events only.)

*(designed, not built — a `freeStateCount`/`slaveStateCount` derived counter; an
end-of-half-term check that, **while the count is lopsided in EITHER direction** and the era is a
slavery era (Democracy/Nationalism), applies the Speaker/Pro-Tem/Moderate/Civil-Rights/RW-Activist
score + DomStab + Party-Pref-toward-Red + next-election package; couple it to statehood admission
so a new state can trip it; retire the whole subsystem on the abolition era event.)*

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

> **★ Re-confirmed + extended by a 3rd campaign (`rep1800`, §C-3 — the richest find of its §C).**
> The `rep1800` Reconstruction multi-confirms `hd`/`drums` and adds the **solo-play blocker** and
> the **design-philosophy note**:
> - **Readmission = REPEALING state bills, not passing them** (GM-authored workaround): the named
>   "X Reconstruction" bills **are** the state-readmission bills; you **repeal** them to readmit.
>   "In Reconstruction" still counts as **in the Union** for later elections. (`rep1800` §C POST
>   8737, 8893, 8910 — sharpens the per-state-readmission-bill model above, which framed it as
>   *passing*.)
> - **TWO competing readmission-plan bills** (sharper than the 3-plan exec-action table above):
>   **Lenient 10% Loyalty** → Reconstruction ends **automatically** at end of half-term, all
>   states readmitted, **no bias change**; **Strict Majority Loyalty w/ Ironclad Oath** →
>   readmission **state-by-state**, and once readmitted **bias +2 toward Red for 4 cycles (8 yrs)**
>   (`rep1800` §C POST 9374, 9396 — the time-boxed +2 corroborates plan (1) above).
> - **Red-lined ex-Confederates** via FOUR Confederate-citizenship options (Restore / Strip-leaders-
>   pardon-others / **Mass Trials & Punishments** [what passed — removes non-Nationalist seceded
>   pols] / Strip-Citizenship [only one repealable]); ex-Confederate pols stay red-lined until
>   citizenship is **legislatively restored** (`rep1800` §C POST 8910, 8957 — corroborates the
>   strip-leaders/pardon bills above).
> - **Military Governors are president-appointed, SAME-PARTY ONLY** (stricter than normal vacancy
>   rules, which allow the opposite party); if no valid same-party pol exists, one is **generated**;
>   re-appointed every 2 yrs (`rep1800` §C POST 8673–8677, 8910 — refines the "2-yr military Govs"
>   line above).
> - **Escalating 4 / 8 / 10-yr penalties** (lingering "stop dragging it out" pressure): meter-drop
>   chances scale by #states-in-Recon; CPU factions vote to end at 50% / 75%; at **10+ yrs a 25%
>   chance the Civil War RENEWS** (whole Upper+Deep South secedes again, all battles Difficult)
>   (`rep1800` §C POST 8911, 9842 — distinct from §23.3's *post-victory* 25% guerrilla roll: this
>   is a *Reconstruction-duration* renewal roll).
> - **★ DESIGN PHILOSOPHY — hard-coded Red Southern bias even in a BLUE-won alt-history.** A Blue
>   president won *this* war, yet Reconstruction still forces **Red +2 / Blue "zero support"** —
>   players repeatedly call it **"historical sim, not alt-history"** (the Reconstruction bias is
>   keyed to *real history*, not the campaign's outcome) (`rep1800` §C POST 8659, 8662, 8753).
>   **A deliberate design stance the build must decide on**, not a bug.
> - **★★ SOLO BLOCKER — the Strict/Ironclad plan can NEVER pass with CPU factions, so SOLO
>   RECONSTRUCTION IS UNRESOLVABLE.** GM, **POST 9170 (verified):** *"the CPU factions will never
>   vote for that bill… including red, only 3 factions would ever consider voting for it. A real
>   problem when it is the historical plan passed and **in a single player game it basically can
>   never pass.**"* The Lenient plan was considered un-passable post-guerrilla-war by the human
>   side too (POST 9166). GM names this as a **primary driver of the in-progress CW/Reconstruction
>   rules rewrite.** **Flag prominently — this is a solo-play blocker for ANY antebellum/CW
>   scenario** (`game-context.md` DH-class; see also §19 below).
> - **Mass-readmission finale (~1868):** 14 states repealed at once → "All states readmitted!"
>   Rev/Bud +6, DomStab +1, Honest Gov +3 — **the big late-game meter relief came from ENDING
>   Reconstruction** (`rep1800` §C POST 9871–9898).
> - **Black politicians** added to the draft pool at the 1856 boundary but **barred from office
>   until enfranchised**; first Black officeholders = **Frederick Douglass (Gov of NY, 1866)** +
>   **Hiram Revels (Senator, MS)**; post-abolition draft was **heavily Red-weighted** (~100 red vs
>   ~40 blue) (`rep1800` §C POST 8463, 8999, 9117, 9699–9700).

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

> **★ Alt-expansion in `rep1800` — a DIFFERENT map than `house-divided` (a 4th expansion region +
> Texas-splitting).** This 1800 campaign annexed a different set of territories — independent
> corroboration of the bill-driven-statehood + region-tagged-roster pattern across a 3rd campaign
> (`rep1800` §C; cross-ref §21.5 + §27.5):
> - **War for Florida vs Spain** → Treaty of St Augustine, **FL acquired** (this timeline never
>   got FL earlier) (`rep1800` §C POST 6883, 9330, 9411–9414).
> - **Cuba = the 36th state** via a "Cuban Statehood" bill, in a **NEW "Caribbean" region** (PR,
>   Santo Domingo, Bahamas, Antilles, Haiti); Cuba was first bought via a "Purchase Cuba" event
>   (`rep1800` §C POST 8556–8557, 9396, 9723). **A 4th map region beyond the mainland + Canada** —
>   the region-tagged roster pattern (cf. the `'Canada'` region in `expansionStates.ts`) extends
>   to `'Caribbean'`.
> - **Mexican Cession (NM + AZ) acquired by PURCHASE bill** → "New Mexican Territory"; later a
>   Gadsden Purchase event. **California stayed owned by Mexico throughout** (`rep1800` §C POST
>   9396, 9607, 9720).
> - **Texas = 4 states (W/E/N/S Texas)** — each separately reconstructed/readmitted, likely a
>   **permanent map feature** (one acquired territory minting **multiple** states — refines §27.5)
>   (`rep1800` §C POST 6044, 9611, 9678, 9833, 9906).
> - **Improvised Indian wars** (Red Cloud's War, Apache Wars) ran as "**Operations**" because they
>   are **missing from the war chart** — corroborates the Operation tier of §23.3 (`rep1800` §C
>   POST 8944, 9906). And the **territory-before-statehood rule** (§27.5): except the 13 originals
>   + VT/TX/CA/Deseret/Mexican-Cession/Quebec, every state must pass Territory status first
>   (`rep1800` §C POST 9127).

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
- **★ Stat-collapse → forced presidential resignation (batch 8, `ad0f2875`).** A president who
  **loses all Command points + most of his skills** is **forced to resign** (`ad0f2875` POST 135,
  verbatim: "Mouton forced to resign because Mouton lost all command points and most of his
  skills"). A **stat-floor → resignation** rule that triggers succession — distinct from the
  0-Command *acting* president above (who is *inert but stays*; this one *leaves office*).
  Succession is exercised constantly in this run (resign/scandal/death chains → next-in-line),
  and a **"Presidential Succession Act of 1852"** was passed in-game to set the order (POST 755,
  157). (game-context #105.)
- **★ END-TO-END corroboration on ONE president (`arkzag`, batch 11): assassination → succession →
  acting-president, full chain.** **Pres Cheves is assassinated** ("dies 2/50", an "Assassination
  Attempt" Anytime-Evo resolved by a survival roll); **VP Enoch Lincoln assumes the presidency "in
  accordance with the 13th Amendment"** (the VP-vacancy/succession amendment) and **must nominate a
  new VP**; the **acting-president mechanic fires** — Lincoln has **Easily Overwhelmed**, so **50%
  of the time the VP performs presidential actions in his stead** (and Lincoln *gains* Easily
  Overwhelmed + Pliable). vcczar: **"first presidential assassination this run."** This is the
  **whole chain on one office-holder** (trigger = death Evo; recovery = succession + VP-vacancy fill
  + acting-state) — the strongest #61 corroboration in the KB. Full beat-by-beat + the gating on the
  amendment lifecycle: **[§29.9](#299--extended--deathassassination--vp-succession--acting-president-end-to-end-gap-61)**.
  (`arkzag` ch27 POST 270–507.)
- **★★ TED-RULED — VP-inheritance-on-DEATH = FULL Presidency, NOT "acting" (`oopscpu#POST 327`,
  designer-authoritative; #61).** When the President **dies in office**, the **VP becomes the FULL
  President** — Adams (on Washington's 1796 death from dysentery) **"refuses the title 'Acting'
  President — sets precedent for VP inheritance meaning that they become the full President."** And
  per `oopscpu#POST 329` (matching `nuke` #112's unelected-succession rule) **the inheriting VP is
  NOT auto party leader and NOT even faction leader** — the party then **re-runs its leadership IRV**
  ([§25.3](#253-leadership--speaker--ppt--irv-style-bloc-vote-tie-break-ladder)) to pick a new PL.
  **★ RECONCILIATION with the `arkzag` "acting-president" read:** Ted's ruling is
  **designer-authoritative and SUPERSEDES the "acting-president + action-divert roll" framing for
  the death-succession case.** On a **Presidential DEATH**, succession produces a **full President**
  with **no "acting" status and no action-divert roll** — the inheritor wields the full office. The
  `arkzag` acting-president/action-divert detail ([§29.9](#299--extended--deathassassination--vp-succession--acting-president-end-to-end-gap-61))
  is now **SCOPED to the distinct *incapacity / 0-Command / foreign-born-ineligible* cases** (the
  `hd` 0-Command Paris-Gibson and the trait-divert reads above), **NOT** to a VP who inherits on a
  clean death. So: **death → full President (Ted)**; **incapacity / ineligible-substitute / inert
  0-Command holder → "acting" with Command-gated / trait-diverted action ability** (the older read,
  retained only for those cases). Flag this split in any succession implementation. (`oopscpu#POST
  324–329`.)

*(designed, not built — a **configurable line of succession** (bill-mutable order); **native-born
vs foreign-born eligibility** gating the presidency (relaxable per [§23.5](#235-60-canada-conquest--era-gated-territorystatehood--canadian-draft)); the
**Ted-RULED death-succession branch: VP-inherits-on-death = FULL President, NOT "acting", and NOT
auto party/faction leader → trigger a fresh leadership IRV** (`oopscpu#POST 327–329`); an
**acting-president state whose `command` (often 0) gates executive actions / SCOTUS-compel /
re-election eligibility — SCOPED to incapacity / ineligible-substitute / inert-0-Command cases,
NOT the clean death case**; an era-keyed VP-vacancy fill rule (off pre-amendment, on after); and a
**stat-floor → forced-resignation** trigger (Command 0 + most skills lost → resign → succession).)*

### 24.2 (#62) Contingent House election + tied-chamber inverse control

> **★ TED-RULED: the inverse-tied-House-control rule is AUTHORITATIVE** (`tedchange#POST 65`,
> RULED). The shipped general always resolves to a winner; there is **no contingent path** when
> no candidate reaches an EC majority.

The **1888** race went 3-way (Blaine R 197 / Shortridge D 196 / Saltonstall "Conservative" 23;
**208 needed**) → no EC majority → **contingent election in the House** (`hd` POST 5713):

- **DEVIATES from the 12th Amendment:** the GM uses the **top 2**; a player cited the
  constitutional **top 3** and the GM **overruled with "Game rules"** (POST 5720–5721). The
  build **must pick a stated rule** (DH-6).
- **Each state casts 1 vote** by the **majority party of its House delegation** (tie →
  **Governor's party**); **29 of 56 needed**. **Shortridge won 35-21** (first elected Democratic
  President since 1856 in-timeline; first **LW-Populist**). The **Senate elects the VP** by party
  vote (→ Hancock) (POST 5713–5762).
- **★ Tied-House control — TED-RULED (`tedchange#POST 65`):** when the House splits **50/50**,
  leadership of the tied House goes to the **party NOT in control of the Senate** (inverse-control
  rule). Ted's reasoning: *"Best represents the kind of compromises that would need to be made
  within a 50/50 House."* The 1890 House at 152-152 (Senate stayed Dem → GOP got the tied House,
  `hd` POST 6229, 6257) is now the **canonical** Ted-RULED behavior. SUPERSEDES alternative
  proposals (random / Westminster-style former-Maj stays / Speakership-by-whole-House).
- **★ Tied-SENATE control — the INVERSE rule (`terror2000#POST 265, 268, 1282`, Ted-RULED).** When
  the SENATE splits **50-50**, control goes to **the VP's party** (the VP breaks the tie): the
  2000-start opens with a **50-50 Senate, GOP majority via VP Cheney's tiebreak** — Ted: *"if both
  parties have equal Senators, the VP's party is the majority."* This is the **mirror of the tied-
  HOUSE rule** (the House has no VP, so it goes to the non-Senate-majority party; the Senate has a
  VP, so it goes to the VP's party). Together they form the complete **tied-chamber control pair**
  (corroborates DH-7 / the #135 family). (`terror2000#POST 265, 268, 1282`.)

*(designed, RULED — a contingent-election path: when no candidate reaches the EC majority,
run a **one-vote-per-state House election among the top N** (pick a stated N — top-2 house rule
vs top-3 12th-Amendment, DH-6), delegation-majority with Governor-party tiebreak; Senate elects
the VP; **and** the **inverse tied-chamber control rule** (50/50 House → non-Senate-majority party
takes leadership). Cite `tedchange#POST 65`.)*

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
>
> **★ FOUNDING-ERA confirmation (batch 8, `afc6cbd7`): the offices-by-law pattern spans
> founding→modern.** The defining shape of the founding era is that **foundational federal
> institutions do NOT exist at game start — they are stood up piecewise by in-game bills, years
> after the Constitution, and each new institution opens new appointable offices.** Confirmed
> created-by-bill in the multiplayer 1772 thread: the **Supreme Court / Federal Judiciary** (built
> by **TWO bills** — "Establish Federal Judiciary" + a *separate* "Set the Number of Supreme Court
> Justices to 6"; GM ruled they are **NOT auto-packaged** — if the court passes but the number bill
> fails, **the game cannot advance** until a number is agreed; era cap = 6; both failed repeatedly,
> so the **Supreme Court Decisions phase is skipped every turn until justices exist**, POST 2317,
> 3053, 3096); the **Bank of the United States** → a new **President of the Bank of USA** cabinet-
> level seat (Gallatin, POST 3271); the **Department of the Navy** → a new **Secretary of the Navy**
> seat (POST 3271); plus **US Military Academy, US Naval Academy, Library of Congress, District of
> Columbia, US Mint, US Marine Corps, Attorney General (SR.5 — AG un-appointable until it passes,
> POST 2251), Federal Death Penalty** — all created/attempted by bill (several as 1796 platform
> planks). This generalizes the same `cabinetSeatsForYear`-should-be-DATA conclusion (§26.5) to the
> earliest era. (`afc6cbd7` POST 2251, 2317, 3053, 3096, 3140–3164, 3271; game-context #103.)

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
> what a drafted rookie receives. (`hd` POST 2155.) **★ Ted-RULED canonical** in `tedchange#POST 50`.

At the **1868 draft** ("Ted's revisions") the per-rookie grant changed to **3 traits + 3 alt-state
adds**, **down from an earlier 5 traits / 5 alt-states**. This is the 1856-native value for the
two-home-state mechanic §22.10 already documents (one alt-state add → now up to **3**). **★ 3/3 is
now the canonical, Ted-RULED value** (`tedchange#POST 50`, RULED) — the earlier open question
(`game-context.md` `hd`/#69) is **CLOSED**.

*(designed, RULED — make the draft rookie grant a tunable `{traits, altStates}` pair fixed at
**3/3** (down from 5/5). Cite `tedchange#POST 50`. SUPERSEDES any prior 5/5 reading.)*

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

> **★ CORROBORATED + SHARPENED by `oopscpu` (all-CPU 1788) — the pre-12A nomination trio.**
> The founding-era all-CPU run exercised candidate selection where there is **no convention**
> (pre-12A; conventions don't exist until the Party-Ticket Amendment, [§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle))
> — selection is **Party-Leader nomination + alternates resolved at the Electoral College.**
> Ted **RULED LIVE** (`oopscpu#POST 192`, scoped pre-12A only, POST 193-194) the **three rules
> the existing CPU lacked**:
>
> 1. **VP retention** — an **incumbent President always re-nominates the incumbent VP if eligible.**
>    (This is the rule the §25.2 `drums` bug was missing — folded there.)
> 2. **Alternate-nomination anti-tie** — the CPU **nominates an alternate when no one else has**,
>    so a faction can't exploit the pre-12A throwaway-vote tie (two-votes-per-state, no ticket —
>    [§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle)).
> 3. **Own-faction priority** — the CPU **prioritizes its own faction's candidates.**
>    Plus the **same-state-EV rule** (`oopscpu#POST 197`): **two candidates from the same state
>    cannot both take that state's EVs** (folded into [§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle)).
>
> **No-primary-incumbent CORROBORATED** (`oopscpu#POST 294`): "CPU does NOT primary an incumbent
> unless extremely unhappy" held end-to-end — same-party challenges fired only for Blue
> Mods/Cons and Red LW-Pops (extreme-unhappy bands); **no challenge for an 8-years-served gov.**

*(designed, not built — the 75/25 picker, the ≥1-Command gate, the Kingmaker-faction
primary-bonus rule, the auto-major triggers, and the incumbent-primary block. **Add the pre-12A
nomination trio** (VP-retention, alternate-anti-tie, own-faction priority) gated on
`conventionsEnabled = false`, with the same-state-EV exclusion at EV tally time. Cross-ref
[§25.2](#252-vp-selection--retention-rule-ruled-was-designer-acknowledged-bug) for VP retention,
[§25.4](#254-convention-cpu--per-ballot-momentum--interballot-menu--compromise-picker) for the
convention layer, [§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle)
for the pre-12A EC mode.)*

### 25.2 VP selection — retention rule RULED (was: designer-acknowledged bug)

> **The original designer-acknowledged retention bug** (`drums` POST 167, Tyler): *"the CPU picked
> from the faction with the lowest points that had a candidate not from the President's region. So
> it was basically random. Was thinking maybe have a chance to keep a VP but make that more likely
> to happen in the Nuclear Era and onward."* The `drums` CPU had **no VP-retention logic.**
>
> **★ FIXED — Ted-RULED VP retention (`oopscpu#POST 192`, designer-authoritative).** Ted closed
> the `drums` bug live in the all-CPU 1788 run: **an incumbent President always re-nominates the
> incumbent VP if eligible.** This is a **hard retention rule** (not the "chance" Tyler mused
> about) — at minimum for the pre-12A founding era, where it also defeats the throwaway-tie exploit
> ([§25.1](#251-candidate-selection-open-seats-primaries-conventions--the-7525-rule), pre-12A trio).
> Worked: **Washington re-nominates Adams; the 1792 Washington/Adams ticket re-elected unanimously**
> (`oopscpu#POST 192-199`). The Nuclear-Era-only "chance" Tyler proposed is now **subsumed** by a
> deterministic pre-12A retention floor; whether later eras soften it to a chance is an open tuning
> question, not a missing rule.

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

*(designed, not built — implement the 8-element rubric verbatim at convention close; **implement
the Ted-RULED hard VP-retention rule** (incumbent Pres re-nominates incumbent VP if eligible —
`oopscpu#POST 192`), at minimum for pre-12A, with an open question of whether later eras soften it
to a chance; keep the career-track gate (appointment YES, election NO); decide the 2-step Pres/VP
gap rule.)*

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

> **★ CORROBORATED end-to-end by `oopscpu` (all-CPU 1788)** — the IRV ladder + bloc-vote +
> PL-backed-tiebreak ran across **multiple founding-era cycles** (POST 42, 115, 256, 329, 332); the
> POST-115 PPT race ended **"stuck in an unbreakable tie → the Party Leader's backed candidate
> wins."** In the pre-12A era (no conventions), **leadership IRV IS the convention proxy** for
> resolving multi-faction selection. Also exercises the post-death re-run: when the PPT and 3
> faction leaders died the same cycle, **Red leadership re-ran via IRV** (POST 329) — the same path
> a death-inheriting President triggers ([§24.1](#241-61-succession--eligibility--the-acting-president-state)).
>
> **★ OC-2 (NEW) — cross-party-leadership × 60%-chamber-proposer COLLISION (the marquee bug, POST
> 151).** The handler must resolve this two-rule interaction the all-CPU run exposed:
>
> 1. The **closest-ideology leadership rule** lets a faction vote for a chair (PPT / committee
>    chair) **outside its own party** → in 1788 **all Senate chairs ended up Blue even though Red
>    held 73% of the Senate.**
> 2. The separate **"chairs may propose if a party controls ≥60% of the chamber"** rule then keyed
>    off **Red** clearing 60% — so the **Blue chairs were allowed to propose freely**, while a
>    **single lone Blue Senator** was technically the only one the rules said should be eligible.
>
> Net pathology: cross-party leadership selection (rule 1) and the 60%-chamber proposer gate (rule
> 2) **disagree about which party "controls" the chamber** — the chairs are minority-party but the
> proposer gate reads the majority party's share. Ted: *"Adding this weirdness to the stuff to
> correct when I rework CPU rules"* — **UNRESOLVED.** The leadership-IRV handler and the
> legislation-proposal gate must **agree on a single definition of chamber control** (chair's
> party? seat-majority party? proposer's party?) so a minority-held chair can't propose under a
> majority-party threshold it doesn't belong to.

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
party-leader internal-vote d12 + endorsement runoff; **OC-2: a single canonical "chamber control"
definition shared between the leadership/chair selection and the ≥60%-chamber proposer gate so a
cross-party-elected minority chair can't propose under the majority party's threshold** — POST
151.)*

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
- **★ KNOWN EXPLOIT — the lone-ideology minor candidate (batch 8, `afc6cbd7`).** Once minor /
  favorite-son candidates can win delegates **outside their home state**, a **minor candidate who
  is the ONLY candidate of a common ideology surges to front-runner** by sweeping out-of-state
  delegates of that ideology. **Ralph Izard (Cons) jumped 0 → 121 delegates (+102) on the 2nd Red
  ballot** — "Izard benefits tremendously from being the only Cons candidate in the race with a lot
  of Cons states in the country" — and was promoted from minor to major (POST 3498); **Muhlenberg
  did the same on the Blue side** (POST 3532). The GM was **explicitly intrigued and invented a
  live fix** (a minor → major only if it finishes 1st/2nd after a ballot, POST 3521; and, since the
  rules don't cover one faction holding TWO majors, **split that faction's Gov/Sen delegates between
  them like ideology delegates**, POST 3498, 3508). → a **convention-CPU design hole**: the
  delegate-allocation rule rewards being the sole holder of a widely-held ideology, an emergent
  exploit the build should account for. (game-context #101, DH-class.)

*(designed, not built — the whole convention CPU subsystem. The shipped 2.9.2 is a one-line
"log ratification" ([§15.2](#152-the-election-phases)); the above is the spec. Top priority for
the build given it produces 11-ballot CPU-deadlock pathologies today, and the lone-ideology
minor-candidate exploit above.)*

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

> **★ CORROBORATED — the `oopscpu` crisis cabinet-fill LADDER (`oopscpu#POST 322`).** When a crisis
> meter forces a new appointment (a new **Sec of War** in the all-CPU 1788 run), the CPU walked a
> clean accept-or-decline ladder, confirming §25.5's Admin + lobby-tiebreak + accept-roll shape:
>
> 1. **Highest-Admin eligible pol first.** The eligible 4-Admin (a sitting Chief Justice) **refuses**.
> 2. **Drop to the next Admin tier; break Admin-ties on lobbies** — the 3-Admin pol is chosen by the
>    **lobbies tiebreaker**.
> 3. That pol **refuses** too → continue down.
> 4. An **unemployed pol accepts.** The ladder terminates on the first accept-roll success.
>
> This is the **working crisis-fill spec the cabinet handler must encode**: `highest-Admin → (Admin
> tie → most-appeased-lobbies) → accept/decline roll → descend until accepted`.
>
> **★ OC-5 (NEW) — court-as-firing-LOOPHOLE (`oopscpu#POST 184-187`).** Pre-firing-precedent
> ([§21.4](#214-firing-precedent-gate-on-cabinet-changes)), the CPU could not fire a cabinet member
> outright — so it **dumped unwanted cabinet members onto the SCOTUS bench** as a back-door removal
> (an open Justice seat is a "place to put" someone you can't fire). The cabinet handler must treat
> a **SCOTUS appointment used to vacate a cabinet seat** as a firing-equivalent and gate it the same
> way the firing-precedent rule gates direct removals — otherwise the court becomes an
> unlimited-capacity dumping ground that bypasses the firing gate.
>
> **★ OC-1 (NEW) — CPU scandal-smoother ABSENT → disgraced pols recycled (`oopscpu#POST 65`).** The
> **Scandalous-Office-Holder** event forced **Franklin to resign Key Advisor** — but *"there's no
> rule keeping me from appointing Franklin to UK Ambassador. And a strict interpretation of the
> rules says that's exactly what the CPU would do."* The CPU has **no scandal memory**: a
> scandal-resignee is **immediately re-appointed to another appointed office** the very next 2.3
> phase. The cabinet/appointment handler needs a **per-pol "recently disgraced" cooldown** that bars
> a scandal-resignee from re-appointment for N cycles. This is the **appointment-phase instance of
> the cascading-event-smoother gap** ([§25.15](#2515-critical-missing-cpu-logic-architectural-gaps)
> #3 / DH-22) — same missing primitive (a recent-event cooldown), here for scandal re-appointment.

**Cabinet enthusiasm-via-lobbies overwhelms presidential signal** (POSTS 877, 880): Matt appointed
3 Moderates and Mod enthusiasm moved **+3 the OTHER direction** because cards trump individual
ideology. Designer wants ±3 to ±5 cap; **partially patched POST 4574** — Tyler's **±3 cap on
per-phase ideology swings** ("Since ideologies can swing wildly here with the cards, I'll put a
cap of a swing of three like the cabinet"). Mods swung +7 raw → capped at +3.

*(designed, not built — replace the lost "low chance to reject" rule; fix the 50/50 Admin-1
trap; add the lobby-maximizer Admin/competence weighting; implement the Iron-Fist+Pliable
auto-AYE rule; add the full replacement chain + PPT-5-alternatives auto-confirm; **the `oopscpu`
crisis-fill ladder** (highest-Admin → lobby-tiebreak → accept-roll → descend); **OC-5: gate a
cabinet-vacating SCOTUS appointment behind the firing-precedent rule**; **OC-1: a scandal-resignee
re-appointment cooldown (scandal-smoother)**; the ±3 swing cap is now live.)*

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
  but reveals the engine. **`oopscpu` CORROBORATES the theme-blindness** (`oopscpu#POST 95-96`):
  the CPU **signed the Fugitive Slave Act then immediately took "Do not enforce Fugitive Slave
  Act"** because the action-pick roll wanted to "help an ally" by point-math — same failure class
  ([§25.15](#2515-critical-missing-cpu-logic-architectural-gaps) #2 / DH-21: no meter/theme guard).
- **Veto override = 2/3 in BOTH chambers, NOT 60%** (POSTS 2180-2187, designer ruling; 60% was
  a bug, reverted) — **must verify shipped behavior**.
- **Amendments can't be packaged with bills** (POST 1835).
- **Vetoing a statehood bill**: −250 pts, −2 Party Pref, state's bias shifts +1 toward
  opponent when admitted (POST 1350).

> **★ OC-3 (NEW, ★ BALANCE-BREAKING) — CPU crisis-vote-AGAINST-SELF is too generous (`oopscpu#POST
> 162-180`).** The single most consequential CPU gap this batch. In the all-CPU 1788 run **every
> faction, including the Southern slaveholding ones, rolled to SUPPORT the Abolish-Slavery crisis
> bill** on crisis-resolution grounds → **slavery was abolished peacefully by 1792 with no
> secession, no divisiveness.** Root cause (POST 180): *"the committee rules don't mention how CPUs
> vote on crisis if it hurts them, and 3.0.30 is more lenient on crisis support for the majority
> party than opposition."* Two missing checks the legislation-vote handler must add for **crisis
> bills**:
>
> 1. **Ideology-floor gate** — a CPU should **NOT vote AYE on a crisis bill that costs points to its
>    own ideology / lobby cards** just because it is crisis-tagged. The crisis-priority boost must be
>    **down-weighted (or floored to NAY)** when the bill conflicts with the faction's own cards —
>    otherwise crisis-priority steamrolls self-interest. (Pairs with the §29.10 −100/waiver rule: a
>    failed crisis bill that conflicts with the faction's ideology already *waives* the penalty and
>    grants +1 enthusiasm, so the faction has every reason to let it fail — the AYE roll contradicts
>    its own scoring.)
> 2. **Secession / slavery-active check on abolition** — an Abolish-Slavery crisis bill must trip
>    the **secession check** (slavery-active gate, [§23.1](#231-58-secession--southern-unionist--secessionist-trait-gating-the-antebellum-payoff)
>    / [§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine))
>    **before** it can pass — the 1788 run **never tripped a CSA check** (POST 165-166), so the
>    bill abolished slavery with zero secession risk. Crisis abolition without a secession-risk gate
>    is the balance break.
>
> Ted (POST 177): *"It might be worth taking another crack at the crisis rules."* **OPEN** — the
> fix shape is the two gates above; the exact weighting is a design call.

**Filibuster as deterministic per-Senator** — fully covered at the end of
[§12.6](#126-forum-design-layer-filibuster-designed-not-built). **`oopscpu` CORROBORATES the
era-gated, law-unlocked filibuster** (`oopscpu#POST 90-92, 284`): **no filibuster exists in 1788**;
the "Institute Filibuster" bill passes ~1794, after which **Puritan Senators may filibuster one
bill / delay one half-term** (#10).

*(designed, not built — encode the 3-rule NAY/AYE/NAY ladder; add the proposer-cards
self-check; the amendment validity check; the veto-override 2/3-both-chambers gate; the
informal repeat-proposal cooldown; **OC-3: on CRISIS bills, an ideology-floor gate (don't AYE a
crisis bill that costs your own cards) + a secession/slavery-active check before an Abolish-Slavery
crisis bill can pass** — `oopscpu#POST 162-180`.)*

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

> **★ CORROBORATED — Pliable Pres defers + Egghead-tiebreaker + tie→Pres-decides (`oopscpu#POST
> 334-337`).** When Washington's death made **Adams the (full) President** and an Anytime-Evo gave
> Adams **Easily-Overwhelmed + Pliable** (POST 334): on event votes *"the eggheads get to make the
> call"* — a **Pliable Pres defers to the cabinet/Egghead-advisor majority**; and when **both events
> tied 2-2** among advisors, *"Adams gets to decide"* — confirming **a tie among advisors falls back
> to the President** (the Egghead-tiebreaker-only / tie→Pres-decides rule). This is the founding-era
> confirmation of the §25.7 Pliable-defers + tie-breaker shape.
>
> **★ CORROBORATED — CPU SKIPS exec actions when nothing scores (`oopscpu#POST 191`; also 284,
> 350).** *"Since all other available options will not give Washington or red points, Washington
> opts to take no actions."* A CPU President **declines its entire exec-action budget when no
> available action nets points** — likely intended, but it means **CPU presidents are inert** when
> the meters/points don't align with any action. The exec-action selector is **points-maximizing
> only** ([§25.15](#2515-critical-missing-cpu-logic-architectural-gaps) #2; #23) — there is no
> "take a thematically-fitting action even at 0 net points" fallback.

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

> **★ CORROBORATED — the ideology-circle LW↔RW-Pop 25% cross-step (`oopscpu#POST 117-119, 127`).**
> The all-CPU 1788 run live-confirmed the **circular ideology chart** (#76/#99/#127,
> [§27.7](#277-the-ideology-chart-becomes-a-circle-mid-era-rule-change)): **LW Populist and RW
> Populist are adjacent on the circle**, so a shift/conversion can cross between them at the
> Ted-RULED **25%** cross-circle rate ([§6.3.y](#63y--ted-ruled-ideology-shift-schedule-designer-authoritative-tedchange) /
> [§6.4.y](#64y--ted-ruled-conversion-rate-schedule-designer-authoritative-tedchange)). This is the
> 4th independent thread to confirm it.

*(designed, not built — the 2-layer (auto-flip + active poach) model; the rate table; the
Pliable+adjacency gate (incl. the 25% LW↔RW circle cross-step); the failure-bounce side-effects;
a tie-break for multi-faction collisions.)*

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

> **`pop` sharpens — Iron-Fist controllers publish CONDITIONAL VOTE RULES (CPU-handler
> insight).** Mid-thread (`pop` POST 1111), Iron-Fist Sen Maj Leader McConnell's player
> issued an **explicit conditional-vote policy**:
> *"McConnell will vote NAY to all Libs, Progs, and LW Pops with less than 3 Admin, AYE to
> everyone else."*
> The engine then applies this **declarative rule** to every vote McConnell controls. This
> is the **handler shape** for Iron-Fist's compelled-vote power: rather than the player or
> CPU resolving each compelled vote case-by-case, the controller publishes a **predicate →
> {AYE/NAY}** policy ahead of time, and the engine binds it across the term. Pairs with
> §25.6 NAY/AYE/NAY default but **overrides** it for Iron-Fist-controlled votes (the
> conditional rule beats the default heuristic). **Cleanly architectural**: the build can
> represent this as a `factionLeader.compelledVoteRule?: Predicate → Vote` field rather
> than as ad-hoc hardcoded behavior.

> **Pairs with §22.6 modern auto-cloture.** The "Iron-Fist Maj Leader auto-cloture for
> majority items" cascade (`drums` POST 5920) is the **same generalized rule** instantiated
> for the cloture vote — the conditional-vote-rule infrastructure subsumes both the per-vote
> compulsion and the auto-cloture short-circuit. Sharpens §25.9 by **promoting** the
> conditional-vote-rule to a first-class CPU-handler primitive rather than a per-effect
> hack.

> **Distinct from Manipulative-compel-retirement (moved to §22.7).** The "Manipulative Pres
> compels a Justice's retirement" effect has been **moved out** of the Iron-Fist overload
> table — see §22.7. It always belonged to the **Manipulative** trait, gated on the target
> lacking Integrity OR Jud<5 (`pop` POST 555). Iron-Fist's compel-vote (Justice flips on a
> case) is the related but DIFFERENT power, retained in the §22.7 / §25.9 tables.

*(designed, not built — split Iron Fist into distinct office-keyed traits; document the
Pres-IF-vs-MajLeader-IF tiebreak; codify the 90% officer-fire + 20% MilPrep-risk; the
unilateral threshold-set at convention; the cross-faction PM-General-style takeover via
Loans-from-Wealthy; add a `factionLeader.compelledVoteRule?: Predicate → Vote` field so
Iron-Fist controllers can publish conditional-vote policies declaratively.)*

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
- **★ OC-6 (NEW) — Kingmaker → protégé PAIRING tiebreak is unspecified (`oopscpu#POST 308, 117`).**
  When a Kingmaker has **more than one eligible protégé** to pair with, the rules don't say which to
  pick. In the all-CPU 1788 run *"Pius had two different kingmaker-protégé possibilities. I chose
  between all proteges by highest **Com+Leg+Gov**. If incorrect, we need more clarification in the
  rules."* The GM **house-ruled the tiebreak = highest (Command + Legislative + Governing)**; the
  kingmaker handler should adopt this as the canonical multi-protégé tiebreak (or the designer
  should rule otherwise). Cross-ref the §6.5 Kingmaker/protégé system.

*(designed, not built — the trait-refusal filter on Kingmaker endorsements; the
closest-ideo → highest-PV → lowest-score underdog ladder; pick a final formula for the
Kingmaker endorsement bonus; enforce the age-35 floor on Kingmaker role assignment; **OC-6: a
multi-protégé pairing tiebreak — house-ruled highest Com+Leg+Gov** (`oopscpu#POST 308`).)*

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

---

## 26. Scenario-boot model & modern endgame (designed, not built)

> **Entire section is designed, not built.** Sourced from `c50d9da7` (the "Era of Populism
> Playtest", `pop`), the **first dedicated fresh-boot of a modern-era scenario** in any
> ingested thread. Earlier modern signal (`modern`, batch 3) reached the Populism era as a
> **60-yr continuation** from a 1948 campaign; `pop` records the **cold boot** of the same
> era. The two threads' alignment establishes a build constraint stated up front:
> **era identity = data configuration, NOT code paths**. The R1 deck = "Trumpism" not because
> there is a "Trumpism" mechanic but because the seed instantiates the right cards in the
> right faction at boot.
>
> Cite `pop#POST N`. Cross-ref `game-context.md` rows #86–#91 and design-holes DH-24..DH-28.
>
> **What §26 owns vs. neighbors:** §22 owns the **modern subsystems** (meter bank, primary
> loop, SCOTUS docket, 53-state apportionment) that the **deep-modern** continuation reaches.
> §26 owns the **scenario-boot model and its cross-cutting shape** (1788 / 1856 / 2012 all
> mid-government clean starts), plus the **NEW endgame condition** unique to `pop` and a
> small cluster of rule sharpenings that have an institutional flavor (bill-creates-office,
> 12th-Amendment-gates-capability). The modern subsystems themselves stay in §22; the
> boot-shape that loads them stays here.

### 26.1 The mid-government boot shape (general)

> **Cross-cutting build constraint.** Three documented scenario boots — **1788**
> ([§20.1](#201-scenario-shape--a-mid-government-boot-like-1856), designed), **1856**
> (shipped, `scenario1856.ts:177–193`), and **2012** (designed, `pop` POST 1) — share
> the same shape. Generalizing the shape now means **one boot-sheet schema** instantiated
> per era (and per start-year), rather than three bespoke loaders.

The shape, common to all three:

1. **A single pre-built sheet** loads the snapshot at start. The sheet contains:
   - Pre-named **faction roster** (the per-party-5-faction cap holds across all three:
     B1–B5 / R1–R5; **`pop` is the 6th-era confirmation**).
   - **Per-faction archetype politicians + era-tuned ideology / interest / lobby decks.**
   - **Sitting government** keyed to the start year (president + VP + cabinet + Congress +
     governors + SCOTUS justices).
   - **A state roster keyed to the boot year**, NOT to the era enum
     ([§22.10 sharpening](#2210-53-state-alt-roster--modern-apportionment): the 2012 fresh
     boot is 50 + DC, *not* 53 — the 53-state continuation roster is the product of
     `modern`'s 60-yr annexation chain).

2. **NO inherited PV / legacy / dynasty / Kingmaker-Protégé pairs at fresh boot.** The boot
   is **flat** — no points carry from "earlier eras" because there are no earlier eras to
   carry from. The cumulative end-of-game total ([§2.5](#25-era-boundaries--per-era-point-banking--the-new-era-boot-pipeline-designed-not-built))
   starts at 0 for every faction. `pop` POST 54, 205: JEB!'s "Bush dynasty" had to be
   improvised ad-hoc by the GM (a +1 Active Kingmaker hand-grant) because **no formal
   dynasty mechanic exists**, and the boot has no place to put one.

3. **NO faction leaders pre-selected at boot, NO career-track pols.**
   - **Faction leaders are EMPTY at boot.** They are selected **after the first general
     election** (`pop` POST 359). The boot's first primary therefore falls back to **generic
     Major-candidate criteria — 1 command + matching ideology + matching interest/lobby
     match** (`pop` POST 30), not the §25.1 75/25-PL rule that requires a faction leader to
     exist.
   - **Career-track pols are EMPTY at boot.** A long-running **3-year-stale design
     discussion** (`pop` POST 31, 33 — Lars: *"we've legit been having this discussion for
     almost three years now"*) treats career-track bootstrapping as an OPEN design issue
     (DH-25). Zagnut's houserule: "anyone drafted in 1996+ goes onto one track each"; Rodja
     hand-populated by GM ad-hoc (POST 38, 50). **Neither is canonical** — the build needs a
     stated rule before any modern scenario ships.

The implication for the build: **build the boot-sheet schema once, instantiate per era.**
Era identity is **data configuration**, not a code path. A `BootSheet` structure parameter-
ized by `{era, startYear, factions: FactionSeed[], sittingGovernment: …, stateRoster: …}`
covers 1788, 1856, 2012, and any future era boot, with the **"no leaders / no career tracks
/ no legacy at boot" baseline** as the default.

> **DH-24 reminder — boot-data quality is a real problem.** A fresh-modern boot's seed data
> can have stale Senate-class assignments (`pop` POST 272, 297, 298: Ron Johnson (WI) was
> up in 2010 not 2012; the GM had to swap classes mid-election). The boot pipeline needs a
> **Senate-class verifier** that checks each senator's last-election year against the class.
> Same shape for **DH-27 trait-conflict adjudication** (`pop` POST 1139: Quinn had both
> Integrity AND Controversial simultaneously — `TRAIT_CONFLICTS` is run only on trait-add
> events, not at dataset/boot import time). Validators run **at scenario-boot time**.

*(designed, not built — a `BootSheet` schema instantiated per era; a `scenarioBoot(era,
year)` pipeline producing a `FullGameSnapshot`; a Senate-class verifier; a `TRAIT_CONFLICTS`
validator running at boot/import; explicit "no faction leader" and "empty career-track"
baseline states with the generic-Major fallback for the first primary.)*

### 26.2 Era-of-Populism scenario boot specifics

The concrete instantiation for **2012 Obama-reelection** (`pop` POST 1, 12, 17, 30, 38, 45,
50, 54, 205, 264, 359, 419, 422, 426, 475):

#### 26.2.1 The 10 pre-built faction decks

**Two parties, 5 named factions each** (Blue = Dems / Red = Reps). **Per-faction era-tuned
ideology + interest + lobby decks** at boot. **No new card types** — the modern flat card
pool (the shipped pool augmented for the modern era) is the only pool; "era identity" is
**emergent from deck combinations**, not from new mechanical content.

| F | Archetype politicians | Ideology cards | Interest cards | Lobby cards |
|---|---|---|---|---|
| **B1** | **Bernie Sanders / RBG / Barney Frank** | LW Pop, Progressive | Reformist, Pacifist, LW Activist, Civil Rights | Environmentalists, Welfare, Public Housing |
| B2 | Biden / Harry Reid | Progressive, Liberal | Civil Rights, LW Activist, Reformist | Public Healthcare, Human Rights, LW Media, Labor Unions |
| B3 | Warren / Feinstein / Kerry | Liberal | Civil Rights | Environmentalists, Public Education, Science |
| B4 | Hillary / Pelosi / Cuomo | Moderate | Civil Rights | Human Rights |
| **B5** | **Obama / Hoyer / Klobuchar** (incumbent) | Moderate, Liberal | Civil Rights | Wall Street, Environmentalists, Big Pharma |
| **R1** | **Trump / Ron Paul / Sarah Palin** | RW Pop, Trad | Nationalist, Pacifist, Theocrat, RW Activist, Protectionist | RW Media, Isolationists |
| R2 | McConnell / Boehner | Conservative | Theocrat | Big Agriculture, Corporations, Wall Street, Free Trade |
| R3 | Rick Perry / Kevin McCarthy | Traditionalist, Conservative | Nationalist, RW Activist | Corporations, Wall Street, Oil and Gas |
| R4 | Clarence Thomas / Orrin Hatch | Moderate | Expansionist | Private Education, Oil and Gas, Globalists, Law and Order, Technology, Transportation |
| R5 | McCain / Romney | Moderate | Expansionist | Military Industrial Complex, Technology |

The era's mechanical identity is **R1's deck instantiating "Trumpism"** (RW Pop + Trad +
Nationalist + Protectionist + RW Media + Isolationists) and **B1's deck instantiating
"Bernie-populism"** (LW Pop + Progressive + Reformist + LW Activist + Welfare + Public
Housing). Both decks point at "anti-establishment / pro-base" play patterns through the
existing card scoring engine ([§12.8](#128-forum-design-layer-bill-scoring-sums-all-faction-cards-design-divergence)),
not through new mechanics. **`historical-context.md` §10** grounds this: "populist" =
**style** that attaches to both poles (Tea Party 2009 + Occupy 2011 → Sanders + Trump);
the game's R1/B1 split is the **same dual-pole populism**, mechanized via card decks.

#### 26.2.2 Sitting government pre-loaded

- **Pres. Obama (B5)** = 2012 incumbent facing reelection.
- **VP Biden (B2)** = incumbent VP.
- **Cabinet** has the 2009–2012 historical incumbents (Sebelius, Geithner) plus **Hillary as
  "former Sec of State"** — the boot reads **a partial career history** into the start
  state, not just the offices at year T.
- **Current Congress, governors, and ambassadors** all exist day-1 (the boot does not run
  the 2.1.x – 2.3.1 derivation; the offices are seeded, not derived).
- **9 named SCOTUS justices** seeded by name: Roberts, Kagan, Alito, Thomas, Kennedy,
  Sotomayor, Scalia, RBG, Breyer. **Court size = 9** (NOT the §22.7 dynamic court size; the
  boot starts at 9 and the court-packing bill can grow it).

#### 26.2.3 Boot omissions

The boot **explicitly LACKS**:
- **Faction leaders** (chosen after the first general election, POST 359).
- **Career-track pols** (DH-25; an OPEN design issue).
- **Inherited PV / legacy / dynasty / Kingmaker-Protégé pairs** (the boot is **flat**).
- **Alt-state assignments for boot pols** (procedural-gen kicks in later — see §26.3 / row
  #90, era-coded by Rule 3.0.18 to begin at the **2020 draft**, one new pol per state per
  cycle; before 2020, drafts are "really small handful of real ones" only).
- **53 states** — the 2012 boot is **50 + DC** (`pop` POST 264). The 53-state alt roster
  ([§22.10](#2210-53-state-alt-roster--modern-apportionment)) is **only reachable** via a
  60-yr in-game annexation chain (Cuba + PR via era events between 1948 and ~2012). For a
  fresh modern boot, the build needs the 50 + DC roster.

*(designed, not built — a `Scenario2012` boot with the 10-faction deck assignments above;
the 50 + DC state roster (NOT 53); seeded Obama/Biden + 7-Dept cabinet + Congress + 9-named
SCOTUS; explicit "no faction leaders / no career-track pols" baseline; the
generic-Major-candidate fallback for the first primary that 75/25 cannot apply to.)*

### 26.3 Era-coded scoring multipliers (double-points issues)

> **NEW per-era tunable.** The era's defining issues get a **DOUBLE-POINTS multiplier** on
> bill scoring during that era's half-terms. (`pop` POST 699 verbatim — GM Rodja: *"Keep in
> mind that bills related to Climate Crisis or Immigration are worth double points this
> turn."*)

The Era-of-Populism double-points issues are **Climate Crisis** and **Immigration**. These
are the era's mechanized tension: the two issues drive the bill catalog (the entire 2015-17
Climate Crisis slate; the Sessions/Fischbach/border-wall Immigration slate) and the
double-points multiplier means **each Climate-Crisis-tagged or Immigration-tagged bill's
±50/100/150 card scoring is doubled** during the Populism era's half-terms.

**Generalize to a per-era table:**

| Era | Double-points issues (designed) |
|---|---|
| federalism | (open — likely Slavery? tariff? Hamilton's financial program?) |
| nationalism | (open — likely Slavery; sectional balance — see §23.2's free/slave scoring) |
| gilded | (open — likely tariff; Reconstruction-related) |
| **modern Era-of-Populism** | **Climate Crisis + Immigration** (`pop` POST 699 — explicit) |
| modern Era-of-Future (the upcoming era after 2024) | (open) |

The shape is a **tunable table** keyed `{era → IssueTag[]}` that doubles the per-card
scoring magnitudes during the era's half-terms. Couples to §12.8 (bill scoring sums all
faction cards) — the multiplier applies at the per-card-hit stage.

> **DH-28 reminder — incomplete data tagging is gameable.** `pop` POST 552: the "deals
> with climate crisis" Repeal tag is **only on some bills**, not all that should carry it.
> Players gamed this — bills that should affect Planet Health but aren't tagged slip
> through scoring. **Build TODO:** per-bill meter-impact tags must be **complete and
> verified** at dataset-build time; the same tag completeness rule applies to the
> era-double-points tags. Generalizes: tags are load-bearing scoring inputs, not flavor —
> they need a CI-time validator.

*(designed, not built — add an `era.doubleScoringIssues: IssueTag[]` table; double
ideology/lobby/meter awards on signed bills tagged with those issues during the era;
authored per era; tag-completeness validator at dataset build time.)*

### 26.4 APOCALYPSE Planet-Health endgame — the 10-year clock (NEW endgame model)

> **NEW ENDGAME CONDITION — distinct from the shipped `triggersGameEnd` event-driven path.**
> `EraEvent.triggersGameEnd` exists in shipped (`types.ts:1635`) but is **event-driven**.
> `pop` records the **first meter-driven endgame**: when a meter falls into a specific
> bottom-tier, a **10-game-year countdown clock to mandatory game-end** starts. (`pop` POST
> 542, 548.)

**The trigger:** after Bill #3 lifted drilling subsidies and **Planet's Health crashed
into the bottom band**, GM Rodja announced verbatim:

> *"END OF THE WORLD IN 10 YEARS IF WE DON'T FIX THIS."* (`pop` POST 542)

**The mechanic:**

1. **Meter threshold:** Planet's Health falling to the **APOCALYPSE / bottom-tier band**
   triggers the clock. (The band name is the meter's bottom-of-ladder label — see
   §22.1's Planet's Health ladder: "Poor → Near Crisis → Crisis → APOCALYPSE".)
2. **Countdown:** a **10-game-year** clock starts (5 half-terms). During the clock, normal
   gameplay continues — bills, elections, events all proceed.
3. **Recovery:** if Planet's Health **recovers above the threshold** before the clock
   expires, the clock CLEARS and game continues normally.
4. **Expiry:** if the clock expires (10 game years elapsed with Planet's Health still in
   the bottom band), the **game ends** with a climate-apocalypse end-state — analogous to
   `triggersGameEnd` but **meter-derived**, not event-derived.

**Implication for the engine: BOTH endgame models must exist.**

| Endgame model | Trigger | Examples |
|---|---|---|
| **Event-driven** (shipped) | `EraEvent.triggersGameEnd = true` fires from era graph | Constitutional ratification end-state (1772); upcoming era events (designed) |
| **Meter-driven, countdown** (NEW, `pop`) | Meter into bottom-tier band → 10-year countdown → expiry | **Planet's Health → APOCALYPSE** (the canonical modern instance) |
| **Meter-driven, per-phase roll** (NEW, `rep1800`) | Worst-band meter(s) → a **per-event-phase game-end roll** (~20%) | the **early-republic enumerated game-over set** (below) |

> **★ A SECOND meter-driven endgame shape — the per-event-phase game-end roll (`rep1800`,
> batch 7).** Distinct from APOCALYPSE's *fixed 10-year countdown*: when meters sit at the
> worst band, the game can **END on a per-event-phase roll** (`rep1800` §C POST 7274, 7275). The
> enumerated game-end set (the early-republic instance — extends row #88):
> | Game-end | Condition | Roll |
> |---|---|---|
> | **Standard Coup** | DomStab ≤ 2 **AND** EconStab ≤ 2 | **10%** |
> | **Economic Collapse** | EconStab = 1 | **20%** |
> | **Autocratic Coup** | HonestGov = 1 (early-republic: scaled by an "Era of Democracy" meter → 0% until 1868; **modern: ~20%/phase, CONFIRMED FIRING — `terror2000`, see #88 RESOLVED below**) | **20%/phase (modern)** |
> | **Enemy Takes Defenseless US** | MilPrep = 1 **AND** a foreign power < Neutral | (per-phase) |
> | **(Civil War / secession)** | **DomStab = 1** | (the secession/CW trigger meter — §23.1 alt-CW; §23.2) |
>
> - **DomStab is the Civil-War / game-ender meter** — at its floor it fires the secession/CW
>   path (§23.1's "Southern States form the CSA" off DomStab=1), the lowest-tier game-over gate
>   for the era.
> - **Coup-at-low-meters mechanic (3.0.2):** "Standard Coup" anytime-events fire; the
>   **opposition PL chooses Move On With Coup / Condemn** (`rep1800` §C POST 9317, 9322).
> - **Balance note:** coups are **effectively dead mid/late game** — *"Our military is at max
>   prep so a coup is damned near impossible"* (MilPrep + foreign relations are trivially maxed
>   with a decent cabinet) (`rep1800` §C POST 9593). The coup path is real but rarely reachable
>   once the player has a competent Sec of War / Sec of State.

> **★★ #88 RESOLVED — the meter-driven AUTOCRATIC COUP end-condition FIRED for the FIRST TIME in
> ANY playtest (`terror2000`, batch 15).** The `rep1800` row above logged the coup as a *condition*
> (HonestGov at floor, scaled by an era meter, *"0% until 1868"*); **`terror2000` is the first
> record of it actually firing — and the first proven game-over/LOSS state in the entire KB.** In
> the 2000-start, **Honest-Gov sat at its FLOOR almost continuously from late-Bush onward** (the
> cabinet-fairness penalties + a corrupt cast quietly armed the clock), arming a **20%-per-event-
> phase "Autocratic Coup Ends America" roll** that finally hit (`terror2000#POST 827, 829`):
> | Property | Value |
> |---|---|
> | **Gate** | **Honest-Gov at its lowest level** (floor) |
> | **Roll** | **20% per event-phase** (the `rep1800` per-phase shape, now confirmed live in the MODERN era — NOT "0% until 1868") |
> | **Outcome** | **GAME OVER** — corporate magnate **Alphonso Rockefeather stages a coup**, arrests President Ridge days into his term, declares martial law; the dystopian "Rockefeather regime" |
> | **Aftermath state** | the roster splits into a **resistance** (Harris [CA Gov], Ventura [MN Gov, declares sovereignty], Gen. Schoomaker, Durbin, Bonior) vs. **collaborators** (Woody Johnson "Minister of State Stability," Gingrich "Director of National Reorganization") |
>
> Ted: *"the first time we've actually had a game-ending event happen in an AMPU playtest."* The
> final **cumulative-score winner** was then declared (`@matthewyoung123`, R4, `POST 839`) — i.e.
> the **meter-driven coup is a genuine terminal state that resolves to the standard cumulative-score
> ranking** (corroborates the cumulative-winner end condition, #102/#1). **This resolves the open
> balance question in #88** (whether the coup path is worth implementing): it **DOES fire and DOES
> end the game** — it is a **REAL end-condition**, not a dead branch. **The modern era is exactly
> where it is reachable** (Honest-Gov is far easier to crater than late-game MilPrep, so the
> "coups are dead once MilPrep is maxed" balance note above does NOT neutralize the *Honest-Gov*
> coup). **Build implication:** the **Autocratic Coup belongs in the per-event-phase game-end roll
> table as a SHIPPABLE terminal**, gated on Honest-Gov=floor at ~20%/phase, NOT event-only.
> (`terror2000#POST 827, 829, 839`; #88 RESOLVED.)

The Planet's Health instance is **the documented clock-trigger meter** for the modern era;
**analogous bottom-tier endgame clocks may exist for other meters/eras** but are not yet
documented. Players in-thread acknowledge climate is the **most likely game-end path** for
the populist arc — the model is **load-bearing** for the era's pacing, not edge-case.

> **NEW roadmap surface.** This is a NEW endgame mechanism — the build's roadmap needs an
> explicit item for it (separate from the existing event-driven `triggersGameEnd`). Pairs
> with §22.1 (the meter bank), §22.11 (the era clock), and `game-context.md` row #88.

*(designed, not built — add a **meter-derived endgame condition** model: per-meter
bottom-tier threshold + countdown clock + scheduled game-end if not recovered; persist the
clock in `FullGameSnapshot` (e.g. `game.endgameClocks: { meter; threshold; remainingYears
}[]`); render a HUD warning when active; reconcile with `EraEvent.triggersGameEnd` so both
paths terminate the game cleanly.)*

### 26.5 Era-event-creates-office (bill installs a new cabinet seat)

> **Generalizes the [§24.6 Progressive institutional layer](#246-66-the-progressive-era-institutional-layer-offices-created-in-game-by-law)
> across a 4th era (modern).** §24.6 documented Fed Reserve / Chief of Staff / FBI / CNO
> being created in-game by 1856-arc legislation. `pop` confirms the same generic mechanic
> in the modern era: **legislation creates a real cabinet office mid-game**, the office
> persists, and the cabinet expands.

**Worked case:** the 2015-17 Climate Crisis slate included **"Create Department of
Environment and Climate" (Wasserman Schultz)** (`pop` POST 699). It passed. The **2017
cabinet** then includes a new seat — **Sec. of Environment & Climate (Sally Jewell)** (`pop`
POST 1100). The seat persists into the next administration's cabinet.

**The rule shape:**

| Step | Action |
|---|---|
| 1 | A bill carries a `createsCabinetSeat: SeatSpec` flag in its `effects`. |
| 2 | When the bill is signed (`runPhase_2_6_4`-equivalent), the `SeatSpec` is appended to the **dynamic cabinet seat list** (rather than `cabinetSeatsForYear`'s static lookup, `types.ts:1196`). |
| 3 | The next **cabinet phase** (2.3.1) fills the new seat per the normal cabinet rules (Admin + party + faction-equity, etc.). |
| 4 | The seat **persists across administrations** (a new president's cabinet inherits the seat list, subject to the firing-precedent rules `pop` corroborates from `fed` §21.4). |

**Implication for the build: cabinet seat list is DATA, not hard-coded.**

The shipped `cabinetSeatsForYear` (`types.ts:1196`) is a year-keyed static lookup; the
designed model is a **dynamic seat list driven by passed legislation + era events**, with
the year-keyed lookup acting only as the **initial seed** at boot. Pairs with #66 (Progressive
institutional layer) and `game-context.md` row #89.

*(designed, not built — generalize `cabinetSeatsForYear` to a **dynamic cabinet-seat list**
in `FullGameSnapshot.game.cabinetSeats: SeatSpec[]`; add a `legislation.createsCabinetSeat:
SeatSpec?` field; on sign, append the spec; cabinet phase 2.3.1 reads the dynamic list.
Extends §24.6.)*

### 26.6 Modern SCOTUS confirmation rules — refinements

Two `pop` SCOTUS sharpenings, both already inlined at [§22.7](#227-scotus-subsystem-253--282)
but called out here as a small confirmation-rules cluster for cross-reference:

#### 26.6.1 Auto-AYE within 1 ideology step (declarative confirmation rule)

> **Declarative rule, not heuristic** (`pop` POST 561; first explicit form).

A faction whose center ideology is **within 1 step** of the nominee's ideology **auto-votes
AYE** at SCOTUS confirmation. Only factions **≥ 2 steps away** may oppose. This bypasses
the **cabinet 50/50 trap** ([§25.5](#255-cabinet-confirmation--designer-acknowledged-bug-36-of-88-nominees-passed) /
DH-23) for ideologically-close justices — a SCOTUS-specific override.

Worked case: KBJ + Goodwin Liu (both Lib) confirmed because only R1/R2/R3 were ≥2 steps
from Lib — insufficient bloc to block. Sharpens #52 SCOTUS confirmation; first time the
threshold is **declarative** rather than per-faction-heuristic.

#### 26.6.2 Manipulative Pres compels Justice retirement

> **Distinct from Iron-Fist compel-vote** (`pop` POST 555). A **Manipulative** president can
> compel a Justice's retirement **if the target lacks Integrity OR has Judicial < 5**.

This is a separate trait-power, **NOT** part of the Iron-Fist overload table. The three
distinct powers:

| Power | Trait | Gate |
|---|---|---|
| **Compel a vote** (Justice flips on a docket case) | Iron Fist | (no per-target gate) |
| **Compel a retirement** | Manipulative | target lacks Integrity OR Jud < 5 |
| **Age-/years-gated retire roll** | (none — automatic) | age ≥ 75 OR ≥ 12 yrs on court (shipped 0.15) |

Sharpens §25.9 by **removing** the Manipulative-compel-retire effect from the Iron-Fist
overload — it always belonged to Manipulative.

*(designed, not built — the within-1-step auto-AYE rule for SCOTUS confirmation; the
Manipulative-Pres compel-retirement gated on !Integrity OR Jud<5; both factored into §22.7
SCOTUS subsystem; remove the conflation in §25.9 Iron-Fist overload.)*

### 26.7 12th-Amendment-gated VP actions (amendments toggle capabilities)

> **NEW: amendments toggle in-game CAPABILITIES, not just durable state.** Sharpens
> [§21.3 amendments-as-durable-ratified-state](#213-amendments-as-durable-separately-ratified-state)
> and [§24.4 amendment-ratifier/threshold-as-era-keyed-tunable](#244-64-amendment-ratification-by-34-of-state-governors--era-keyed-then-tunable):
> a passed amendment doesn't only flip a rule-bound flag, it can **unlock** specific
> action-library entries. (`pop` POST 951.)

**The instance:** the general-election action **"Send VP to Shore Up Support"** (a
[§22.5 general-election library](#225-general-election-library-294) entry) **requires the
12th Amendment to be in place** — i.e. elections by party tickets. Before the 12th
ratifies, the action is **disabled**; after it ratifies, the action is **available**.

**Generalization:** the amendment store (`game.amendments`, designed at §21.3) gates more
than just **durable rules**; it gates **callable action entries** in the various action
libraries (general-election actions, exec actions, gov actions). Each library entry
carries a `requires: AmendmentId?` or `requires: (snapshot) => boolean` predicate that
checks the amendment state at action-evaluation time. The constitutional shape of the
game **evolves in-game**, and individual subsystems gate on it.

| Capability | Gated on | Source |
|---|---|---|
| **"Send VP to Shore Up Support"** general-election action | 12th Amendment ratified | `pop` POST 951 |
| Presidential **two-term limit** | Two-Term-Limit Amendment ratified (else open-ended) | §21.3 / `modern` POST 15-29 |
| **Income tax bills** | 16A-equivalent (income tax) amendment ratified — *unblocks* after Pollock | §22.7 / §24.4; `hd` POST 7250 |
| **VP-nomination authority** | VP-vacancy-fill Amendment ratified | §21.3 / `fed` 276-277 |
| **Filibuster (institute filibuster)** | "Institute Filibuster" law passed | §12.6 / `fed` 159 |
| **(other VP-by-party-ticket mechanics)** | 12th Amendment ratified (likely) | `pop` open |

Pairs with **§24.1 succession / acting-president state** (line-of-succession amendments
similarly toggle line-of-succession capabilities) and `game-context.md` row #91.

*(designed, not built — each action-library entry carries a `requires: AmendmentPredicate?`
field; at action-evaluation, the library is filtered against `game.amendments.passed`;
amendments toggle CAPABILITIES, not just rule-flags; pairs with §21.3 ratification flow.)*

---

> **Cross-reference for the roadmap.** §26 ties to roadmap items: **K3/K4 era-content
> registry** (the boot-sheet schema and per-era data lives here); **E22 gilded scenario /
> Phase-2 modern scenarios** (a 2012 boot is a separate scenario from the `modern`
> continuation — both need to ship); the **cabinet-seat-as-data** refinement (§26.5 extends
> §24.6 / row #66); and the **NEW APOCALYPSE meter-driven endgame** (§26.4) — a NEW engine
> surface that needs an explicit roadmap entry, not just a sub-item under the meter bank.

---

## 27. Early-republic era systems & the era model (designed, not built)

> **Entire section is designed, not built, and fills the 1800–1856 gap.** Sourced from the
> **7th ingested thread** — `6aa7309a`, *"AMPU 1800 Playtest — Era of Republicanism 1800–1868"*
> (`rep1800`), a 9943-post / ~400-page multiplayer campaign run by GM `ebrk85` (the **direct
> predecessor of batch-1's `f4c7c2c4`/`gilded`** — same GM, identical roster; the 1800 campaign
> is now documented **end-to-end**, 1800→1868 here + 1868→Gilded in batch 1). This is the only
> coverage of the **Jeffersonian → Era-of-Good-Feelings → Jacksonian → Manifest-Destiny**
> early-republic band — a period with **no prior KB coverage**. Cite `rep1800#POST N` (the
> digest's §A = 1800→1822, §B = 1822→1850, §C = 1846→1868). Cross-ref `game-context.md` rows
> through **#99** + design-holes **DH-29..DH-35**, and the real-history framing in
> `historical-context.md` **§2.5 / §2.6**.
>
> **Shipped reality check.** The shipped build has **no 1800 scenario** (only 1772 + 1856 boot),
> a **4-value `Era` enum** (`types.ts:1337`) with no Republicanism/Democracy/Manifest-Destiny
> bands, and **calendar-year phase gates** (`isDraftYear`/`isPresidentialYear` = `year % 4`,
> `isElectionYear` = `year % 2`, `phases.ts:49–58`). This section documents the **content-band
> era model** that contradicts that year-driven model (§27.1), the per-era boundary machinery
> (§27.2), and six early-republic subsystems (§27.3–§27.8). The core turn/phase loop, skills,
> conventions, meters, and career tracks all behave **exactly as documented** in §1–§18 — the
> novelty here is purely the **era content + the content-band architecture**.

### 27.1 ★ The era model — eras are content-bands gated by game-state + territory, NOT calendar year

> **THE HEADLINE FINDING and the biggest architecture delta in the knowledge base.** It is the
> central architecture question for the build, and it **inverts the shipped year-driven era
> model.** (`rep1800` §0 + §B; `game-context.md` ★ note + #92.)
>
> **★ MULTI-SAVE CONFIRMED (batch 8).** Two **independent saves started 28 in-game years apart**
> — `ad0f2875` (1772-start) and `rep1800` (`6aa7309a`, 1800-start) — emit **identical era-band
> labels at identical in-game dates**: Era of Federalists ~1800, Age of Republicanism ~1820, Era
> of Democracy ~1840, Era of Manifest Destiny ~1856, Era of Nationalism ~1868 (`ad0f2875` POST 21,
> 62, 91, 130, 153; `rep1800` POST 92). Because the bands are **start-scenario-independent** and
> game-state-gated (the `ad0f2875` Civil War opens on a Harper's-Ferry era event + pardon ruling,
> not a date; Reconstruction ends piecemeal by three "end Reconstruction in [states]" Acts,
> `ad0f2875` POST 153–156), this is now the **most-corroborated architectural finding in the KB**.
> The bands are deterministic content-gates on game-state, not flavor or per-thread GM invention.
> (game-context #92, #100; DH cross-ref below.)
>
> **★★ BATCH-9 REFINEMENT — the era model has TWO LEVELS (a THIRD start year, 1948; `nuke`).**
> The largest corpus in the KB emits the band model again — now confirmed across **1772 / 1800 /
> 1948** — and **refines** it into two distinct, separately-fired mechanics that an earlier
> extractor had conflated. **Both must be built; do not collapse them.** (`nuke` mid-C H1; POST
> 11287, 11295, 11637, 12027.)
>
> **Level (a) — Historical Eras = the point-banked content-bands** (the #92/#100 mechanic above).
> `nuke` spans only TWO of them:
> - **"Era of the Nuclear Age" = ONE band, 1948–2000** (the scenario title "Nuclear Age 1948-2004"
>   names this single band; civil rights + Vietnam + Reagan all fold INTO it — there is **no
>   separate "Civil Rights era" band**).
> - **"Era of Terror" = 2000–~2012**, explicitly named and entered at a 2000 boundary ("Welcome
>   to 2000-2002 and to the Era of Terror (2000-2012)!"). A **real band with rule deltas**, not
>   flavor: the GM gates rules on *"Now that we are in the Era of Terror…"* — e.g. **cabinet
>   region STOPS mattering → replaced by diversity + faction-balance checks** (§28.7). (POST
>   11295, 11307, 11421, 11724.)
> - **Transition trigger = the calendar YEAR hitting 2000** (reconciled from a partial
>   disagreement): the **end-of-era point-banking formula + standings reset** of §27.2 / §2.5
>   fires at the boundary (same +5/+3/+3/+3/−1 table), but the *trigger to cross* is the year, not
>   a manual ceremony. (Open Q manual-vs-year: resolved here as year-fired.)
> - **Downstream bands (Populists / Normalcy / Future) are NOT named here** — only "the future" /
>   "the 2030s". The successor `modern` thread (§22.11) then names **Era of Populism 2012–2024**.
>
> **Level (b) — Decade / census boundaries WITHIN an era** (1972, 1980, 1990) = a **SEPARATE,
> schedule-fired** mechanic (NOT a point-banking band). Each census does **three things at once**
> (detailed at §28.9): **(1)** bulk **EV reallocation** vs the prior census; **(2)** wholesale
> **state-bias re-lean** on the Blue5..Tossup..Red5 scale; **(3)** **content rotation** of the
> draft pool, lobby cards / "Faction Personalities", and era-activated industries. This is the
> per-decade `AMPU Census` doc (§28.9 / row #88), distinct from the per-era bias-table swap of
> §27.2 step 6. (`nuke` mid-B B / mid-C S2; POST 6374–6377, 8361–8364, 8410, 8547, 10008–10010.)
>
> **★ CORRECTION of an earlier-extractor error (logged so it is NOT re-introduced).
> "Neocons" / "Corporate Republicans" is a FACTION REBRAND (~1980–82), NOT an era band.** After
> the 1980 GOP win, players self-rename factions off an era-appropriate nickname menu (dkh64 →
> "Neocons"; pman → "Corporate Republicans"; menu also: Atari Democrats, Wall Street Democrats,
> Internationalists, Imperialists, Anti-Communist Republicans, Neoliberals). Faction nicknames
> are player-chosen and rotate constantly (ANKA Republicans, Foglecrats, Equality Democrats,
> Oligarchs, Cochran Republicans, Urbanites…). The **mislabel's source** is the shared sheet's
> own loose internal tab-naming ("Era of Neocons (1972-2000)") + GM flavor text at the 1972
> census boundary ("as we are entering a new era…"). The spreadsheet **conflates decade
> content-rotation with "era"**; the authoritative resolution is the two-level model above. Do
> **not** promote any faction nickname (Neocons, Corporate Republicans, …) to a Historical-Era
> band. (`nuke` mid-B B / mid-C H1; POST 6173, 6377, 6530–6538, 8063, 8167, 8168, 9538, 9840,
> 10106, 10707, 10953, 11286; reconciles `historical-context-1948-coldwar.md` lines 228–242.)
>
> **★ Era CONTENT is hard-coded and IGNORES player history (distinct from era BANDS being
> game-state-gated).** Three separate gates: era **bands** gate on game-state/year (above); the
> **decennial census** fires on its 10-year schedule (level b); and era **events / content** fire
> on a **scripted schedule decoupled from in-game history**. Scripted events land out of
> historical order vs the clock (Hungarian Revolution, James Meredith, Woodstock, Stagflation,
> Roe, Watergate, AIDS, Stonewall in decoupled windows); the **SCOTUS docket fires on its era
> schedule regardless of divergence** (Roe in a 1966-equivalent cycle; Lawrence/Romer/Roper
> "early" because the playtest ran so left). Some events are keyed to a prior choice (Nixon
> Doctrine gated OUT because the US never entered Vietnam). **Clearest statement:** a GOP-Taft
> player who ended Jim Crow **early** (legislation + federal troops) **cannot pre-empt the
> Civil-Rights-Movement content** — downstream events depend on it, so the GM **house-rules a
> ~5%/phase trigger roll** to fire it anyway. **Build implication:** era BANDS gate on game-state;
> era CONTENT fires on its own scripted clock — two different gates. (`nuke` mid-A B / mid-B C;
> POST 3333–3334, 3356, 5016, 5332, 6674, 6765, 7010, 7098–7099, 7413, 7451, 8258.) Worked
> example at §28.8.

**The claim.** An "era" in AMPU is a **fixed content-band** — a set of available
bills + era-events + draftees + a state-bias/census table — that the game advances through on
**game-state / meter / territory-ownership triggers, advanced per half-term**, NOT by matching a
real calendar date. **The calendar year is essentially cosmetic.**

**The evidence (this campaign's clock ran ~30 years "behind" its content):**

| Content beat | Real history | This campaign | Source |
|---|---|---|---|
| **Louisiana Purchase** succeeds | 1803 | **calendar 1834** (after *decades* of failed implementation rolls by multiple presidents) | §B POST 4281, 4672, 4918, 5255 |
| **Texas** acquired (purchased from Mexico via Exec Action, not annexed) | 1845 | **1834** (same Min-France son-in-law, Livingston, did both LA + Texas in 4 yrs) | §B POST 5602, 5608 |
| **Indian Removal / Five Civilized Tribes treaties** | 1830–38 | **1834–1838** | §B POST 5248, 5879 |
| **Federalists die / become Whigs** | ~1834 | **never** — Federalists stay the 2nd party, never become Whigs | §B POST 5255, 5669–5680 |

**Territory ownership GATES content** — the mechanism that *forces* the lag:

- Bills / draftees / era-events for **un-owned land are invalid**: Indian Removal is gated behind
  owning Louisiana; Louisiana-born pols are **un-playable until LA is owned**; MO/MI/FL residency
  is gated until those states are admitted (§B POST 5082, 5140, 5828–5837).
- ⇒ Because content is gated on *territory you actually hold*, an era's beats can only fire **once
  you've acquired the land** — which can be decades after the real date. This is *why* the clock
  drifts: eras advance on game state, and game state advances at whatever pace the players play.

**The contrast with shipped code (the divergence):**

| | Shipped engine (`phases.ts`) | Designed model (`rep1800`) |
|---|---|---|
| **What gates a phase** | `year % 4` (draft/presidential), `year % 2` (elections) | half-term cadence only; *content* gated on era-band + territory |
| **What an "era" is** | a 4-value `Era` enum (`types.ts:1337`) | a content-band (bills + events + draftees + bias table) |
| **What advances an era** | implied by year + the Constitutional-Convention transition | a **game-state / meter / territory** boundary, advanced at half-term |
| **Role of the calendar** | load-bearing (drives cadence AND era) | **cosmetic** — only the half-term cadence matters |

> **Reconciliation.** The shipped `year % 4` / `year % 2` predicates are still correct for the
> **cadence** of phases (a draft every 4 years, elections every 2). The delta is that the
> **era / content-band** must NOT be derived from the year — it must be an explicit game-state
> gate. This refines (does not contradict) the per-era point-banking boundary (§2.5 / row #68):
> point-banking happens *at* the content-band boundary, wherever that lands on the calendar.

**Internal era names are finer-grained than the shipped enum.** The forum runs **four
sub-bands** where the engine has **one `nationalism` value**:

| Forum-internal era | Year band (this campaign) | Maps to shipped `Era` |
|---|---|---|
| (Era of Federalism — pre-playtest) | <1800 | `federalism` |
| **Era of Republicanism** (GM also says "Era of Democracy" for 1820–40, §B POST 4798) | 1800–1820 / 1820–1840 | sub-band of `nationalism` |
| **Era of Manifest Destiny** | 1840–1856 | sub-band of `nationalism` |
| **Era of Nationalism** (= antebellum / Civil-War / Reconstruction) | 1856–1868 | **`nationalism`** (confirmed — §C-9, POST 9717, 9425) |

Only **"Era of Nationalism" maps to a shipped enum value** (`nationalism`, the value the 1856
scenario boots into — `scenario1856.ts:177`). The Republicanism / Democracy / Manifest-Destiny
bands have **no shipped enum representation at all**. (Open Q for the build: are these distinct
enum values, sub-phases, or just content-band markers on a game-state gate? — `rep1800` open-Q 2.)

*(designed, not built — replace year-derived era selection with an explicit `game.eraBand`
content-band gate advanced at a **game-state / territory boundary** (NOT `year % …`); keep the
year predicates for phase *cadence* only; model the era as a **registry of {bills, era-events,
draftees, bias-table}** keyed by band; gate every bill/event/draftee on **territory ownership**
so un-owned-land content is invalid. Pairs with §2.5 (point-banking at the boundary), §26
(the BootSheet / era-content registry), and `game-context.md` #92.)*

### 27.2 Era-boundary machinery (the "End of Historical Era" phase)

> **First explicit capture of the full per-era boundary** (`rep1800` §B POST 6187 / 6201 / 6203).
> Confirms and extends the per-era point-banking already documented at [§2.5](#25-era-boundaries--per-era-point-banking--the-new-era-boot-pipeline-designed-not-built)
> and `game-context.md` #68 — this is the concrete step list the prior threads only inferred.

At the **"End of Historical Era"** phase the game runs, in order:

1. **Faction-trade window** — players may trade factions by mutual agreement; **CPU factions
   auto-accept** offered trades (a CPU heuristic — pairs with §25).
2. **Point-banking** (the era's lasting reward; only banked points carry to end-game):
   | Recipient | Bank |
   |---|---|
   | Most-points faction | **+5** |
   | Most-points faction of the **other** party | **+3** |
   | 2nd-most if **same party** as the winner | **+3** |
   | **All** factions in the top-scoring party | **+3** |
   | **Penalty** if the winning party/faction has an allied faction finishing last / next-to-last | **−1** |
3. **Points reset** — all **non-banked** points reset to 0 (the GM forgot once and fixed it,
   §B POST 6421). Only banked points persist.
4. **New-era issue brief** posted — the canonical issue-menu for the incoming band (e.g. the
   Democracy brief: universal white-male suffrage, the national bank, federal internal
   improvements, the tariff, slavery — §A POST 3174; the Manifest-Destiny brief — §B POST 6203).
5. **Draft order for the new era = points from the JUST-COMPLETED era only** (NOT cumulative —
   §B POST 6201). Worst-finishing faction drafts first the next era.
6. **Per-era state-bias table swaps in wholesale** — each era ships a brand-new bias/census table
   (separate from the decennial census; the Democracy table swapped in at 1820, §A POST 3167,
   3174, 2450).

**★ DUAL era-scoring (batch 8, `ad0f2875`).** At each boundary the engine declares **two**
results, tracked independently:

1. a **per-era winning faction** ("winner of this era / round"), and
2. a running **cumulative "winner of the game so far"** spanning all bands.

The two diverge in play — `ad0f2875` POST 153 announces the **per-era winner R2** while the
**cumulative leader is B4** (cf. POST 91 round=B5/cumulative=B4; POST 130 era=B4/cumulative=B4).
Both scores are **keyed to faction slots `B1–B5` / `R1–R5`** (B = BLUE/Anti-Federalist→Democrat
side; R = RED/Federalist→Whig→Republican side; 1–5 by ideology rank). This dual-scoring shape
(per-era + cumulative) is what the point-banking table (step 2) feeds: the **banked** points are
the cumulative score; the **per-era** winner is the raw points at the moment of the boundary. The
exact point formula behind the cumulative leader is **not visible in `ad0f2875`** (only the
boundary announcements) — closest known formula is the `rep1800` POST 6201 step list above.
(`ad0f2875` POST 21, 62, 91, 130, 153; game-context #100, DH-37.)

*(designed, not built — already specced at §2.5; this adds the **faction-trade window with CPU
auto-accept** (step 1), the explicit **+5/+3/+3/+3 + −1 banking table** (step 2), the
**non-banked-points reset** (step 3), the **draft-order-by-last-era-points** rule (step 5), the
**wholesale per-era bias-table swap** (step 6), and the **dual per-era + cumulative scoring**
keyed to B#/R# slots (batch 8). Bank-points persist to end-game; everything else resets.)*

### 27.3 The 12th-Amendment before/after state machine (era-specific election mode toggle)

> **A genuine era-specific election-system MODE TOGGLE, absent from every later thread** (all
> later threads start post-12A). This is a major switch on the [§15 election machinery](#15-elections-29x-and-calcstatevote)
> and the [§21.2 per-state election method](#212-per-state-presidential-election-method) /
> [§24.3 EC-method-per-state](#243-63-primary-era--state-opt-in-primaries--presidential-primary-groups-15)
> (row #44). (`rep1800` §A POST 222, 264, 276, 502, 638, 691, 708, 2468.)

**PRE-12A mode (the early Republicanism band):**

- **No conventions at all** — the [§15.3 convention machinery](#153-convention-machinery-292--full-forum-design-designed-not-built) is **disabled**; nominees are produced
  without a brokered convention.
- **★ DH-62 (NEW, `oopscpu`) — the two-votes-per-state, NO-TICKET Electoral-College ballot mode.**
  Pre-12A there is **no Pres+VP ticket**: each elector casts **two votes** (the original
  Constitution's mechanism), there is **no separate VP ballot**, and the candidate with the most
  EVs is President / the runner-up is VP. The all-CPU 1788 run (1788 / 1792 / 1796 EC rounds)
  exercised this and exposed two CPU needs the modern ticket model doesn't have:
  - **Throwaway-vote tie risk** — with two undifferentiated votes, factions can **tie** unless
    someone deliberately throws a vote away. The CPU had **no rule** and risked **50/50 splits**;
    Ted's **pre-12A nomination trio** ([§25.1](#251-candidate-selection-open-seats-primaries-conventions--the-7525-rule):
    VP-retention + alternate-anti-tie + own-faction priority) is the fix (`oopscpu#POST 192`).
  - **★ Same-state-EV rule (`oopscpu#POST 197`)** — **two candidates from the same state cannot
    both take that state's EVs** (the original-12A home-state restriction, here as a per-state EV
    tally rule). The EV resolver must enforce this when both a faction's Pres pick and its
    alternate hail from one state.
- **Legislature-chosen presidential electors** in many states: for those states the EV winner is
  decided by **who holds Gov / Senate / Rep** (the **majority party** in the state's legislature;
  the **Gov's party breaks ties**) — **NOT** by `calcStateVote`'s PV + dice. This is **directly
  analogous to the shipped `senatePre17` per-state flag** (`types.ts:701`, which already makes
  pre-17th-Amendment Senators legislature-chosen) — call the presidential equivalent
  **`electorsByLegislature`**. The GM recomputes EV **after** the popular tally, swapping in the
  legislature result for those states.
- **Per-state, phases out by amendment.** In 1804: **CT / GA / MA / NJ / NY / SC / VT** were
  legislature-decided; the rest were popular-vote (§A POST 691, 708, 2468).

**Passing the in-game "President Elections by Party Tickets Amendment" (= the 12th) flips the
mode:**

- Unlocks **party-ticket + convention** mode (conventions become legal — the brokered convention
  of §15.3 only exists post-12A).
- Adds the **separate VP-on-the-ticket** rule; **"Separate VP Election"** and **"Send VP to Shore
  Up Support"** are **gated behind 12A being active** (independently confirmed by `pop` POST 951 →
  §26.7 / row #91). I.e. the 12th is one of the **amendments-toggle-capabilities** (§27.8).

**End-state of the 12A state machine** (Manifest Destiny): the **"Nationwide Surge in Legalized
Popular Vote"** era-event (§B POST 6650) switches **every state except SC** to popular-vote
electors — **retiring** the legislature-chooses-electors mechanic almost entirely (only SC keeps
it). Side-effects: +Reformists / LW-Pop / RW-Pop enthusiasm; Honest Gov +1.

*(designed, not built — a per-state `electorsByLegislature` flag (mirroring `senatePre17`,
`types.ts:701`) that, when set, resolves the state's EV by **legislature majority party (Gov
breaks ties)** instead of `calcStateVote`; a global **pre-12A `conventionsEnabled = false`**
gate that disables §15.3 conventions and the separate-VP rules until the "Party-Ticket Amendment"
ratifies; **DH-62: a pre-12A two-votes-per-state, no-ticket EC ballot mode** (top EV = Pres,
runner-up = VP, no separate VP ballot) with the **same-state-EV exclusion** (`oopscpu#POST 197`)
and the throwaway-tie defense via the §25.1 pre-12A nomination trio; the per-state flip-out by
amendment and the global flip by the "Nationwide Surge" event. Couples to §21.2 / §24.3 and §27.8.)*

### 27.4 Slavery-as-state-flag + the Cohens-v-Virginia amendment-only-abolition substrate

> **The engine substrate for the WHOLE early-republic / antebellum sectional design.** Refines
> the [§23 secession / sectional content](#23-civil-war--reconstruction-1856-arc-designed-not-built)
> and extends batch-1's state-policy-flag pattern (Jim Crow / poll-tax, [§11.4](#114-state-level-policy-flags-designed-not-built))
> *backward* to the gap era. (`rep1800` §A POST 2161, 2180–2182, 2675; §B POST 3363, 3366, 4329,
> 5567, 5820.)

- **Slavery ON/OFF is a persistent state-level policy flag tied to the Plantation industry.** A
  successful abolition bill turns OFF Plantation **nationwide** and **permanently deactivates all
  slavery legislation**; abolition only **"counts"** when **no state** has it active. (The
  Reconstruction "Plantation Economy ends → converts Plantation → Agriculture 2:1" beat in
  [§23.4](#234-57-reconstruction-readmission-subsystem-end-nationalism--gilded) is the same flag
  being switched off.)
- **★ The ahistorical `Cohens v. Virginia` precedent blocks LEGISLATIVE abolition.** This
  timeline's Marshall court held **federal law does NOT supersede existing state law**
  (state-supremacy — the *opposite* of the real ruling). The consequence:
  - Slavery in a slave state can **ONLY** be ended by a **constitutional Amendment** (or a
    **per-state Governor action**).
  - Abolition bills can only act **where slavery already doesn't exist**; **all new
    states/territories enter free**; **existing** slave states keep it; **spread is halted**.
  - Net: a permanent, ahistorical **SCOTUS rule-modifier on legislation** — and there is **no
    mechanism to reverse an ahistorical SCOTUS ruling via amendment** (a cross-thread AMPU-2
    need; SCOTUS rulings are otherwise irreversible — §19.1, `drums` DH cluster).
- This case is decided **at boot** via the finite era SCOTUS docket: Cohens came up as a **TIE →
  randomized → the ahistorical Nay** (the McCulloch/Cohens/Dartmouth docket "burns out fast,"
  only 4 cases — §A POST 231, 530). The dice picking Nay is what set the whole sectional design
  in motion in this campaign.
- **Free/Slave-state balance is a tracked tally** driving meter / enthusiasm / election effects —
  the sectional-balance crisis engine already documented at [§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine)
  (row #59). The gap-era flag is `slavery` / Plantation; §23.2 is the half-term scoring on the
  imbalance.

*(designed, not built — a per-state `slavery: boolean` flag bound to the **Plantation industry**;
abolition counts only when the flag is **off in all states**, and turning it off deactivates all
slavery legislation; a **persistent SCOTUS rule-modifier** representation for the `Cohens v.
Virginia` state-supremacy precedent that **disallows legislative abolition** in a state that has
the flag (so only an Amendment or a per-state Gov action clears it); a rule that **all new states
enter free**; and — the AMPU-2 need — a mechanism to **reverse an ahistorical ruling** via
amendment. Couples to §23.2 sectional-balance scoring and §27.8 amendments.)*

### 27.5 Statehood-by-bill + unorganized-territory gating

> **Refines [§21.5 bill-driven statehood](#215-bill-driven-statehood--auto-generated-officials)
> and `game-context.md` #43** with the two-step **organize → admit** pipeline and the
> draftability gate. (`rep1800` §A POST 250, 308, 332, 889, 1393, 1999–2002, 2117, 2161–2167,
> 3350; §B POST 5082, 5140, 5828–5837; §C POST 9127.)

- **Statehood-by-bill mints a state mid-game** (distinct from 1772's `admitState` era-graph):
  Ohio, **Mississippi (11th slave state → DomStab −2)**, Alabama, Indiana, **Maine (split from
  MA)**, etc. A newly minted state then spins up:
  - a **Governor election**,
  - **Class I/II/III Senator** appointments (so the new state's senators slot into the correct
    rotation),
  - **Electoral Votes** (it joins the EC tally).
  A new state's **bias can init +1 Red if its enabling vote was sabotaged** (the vote's outcome
  seeds the new state's lean).
- **★ Unorganized-territory gating (NEW).** Land you **own but have not organized into a
  territory** — LA-Purchase land + Michigan ("owned but never organized") — has politicians who
  are **undraftable AND unrelocatable until an organizing bill passes**. The pipeline is
  **two steps**: *organize the territory* → *admit the state*. Some admissions **skip the
  territory stage** (ME / WV / TX-from-Republic / VT / CA — and per §C POST 9127, the 13
  originals + VT/TX/CA/Deseret/Mexican-Cession/Quebec). The GM admits the **draft pool wrongly
  includes pols from unorganized territories** — a dataset/territory-gating bug (see §19 hole 5
  / `game-context.md` DH-class).

*(designed, not built — extend §21.5 with a `Territory.organized: boolean` stage (the
**organize → admit** two-step), a **draftability/relocatability gate** that excludes pols whose
state/territory is un-owned or unorganized, the Class-I/II/III senator-rotation assignment on
admission, the EV join, and the sabotaged-enabling-vote → +1-bias seeding. The dataset must
**filter out** unorganized-territory pols from the draft pool — a content/territory-gating fix.)*

### 27.6 Second Bank recharter clock + the Bank War exec action

> **A NEW stateful economic/institutional subsystem** — the central-bank-as-toggleable-office.
> Generalizes the [§24.6 institutional layer](#246-66-the-progressive-era-institutional-layer-offices-created-in-game-by-law)
> (offices created in-game by law) to the gap era, with a recharter clock the Progressive offices
> didn't have. (`rep1800` §A POST 954, 2123, 2161, 2350, 3175.)

- **The Second Bank of the US is created as a Crisis Bill** (the Democracy band's defining
  institution) and:
  - **recreates the President-of-US-Bank cabinet office** (a new cabinet seat — the
    era-event/bill-creates-office pattern of §24.6 / §26.5),
  - carries a **20-year recharter clock** — it **lapses** unless re-chartered,
  - the **President-of-US-Bank office is UNREMOVABLE while the Bank exists** (a same-faction /
    firing-precedent-adjacent guard — cf. [§21.4](#214-firing-precedent-gate-on-cabinet-changes),
    which already notes a same-faction guard on the US Bank President).
- **The Bank War in miniature** = the President's **"Weaken US Bank by Removing Deposits → State
  Banks"** executive action ([§14.1 exec-action library](#141-forum-design-layer-executive-actions-library-designed-not-built)).
  In this campaign the Bank had **lapsed** by the era boundary (the next President didn't reverse
  the deposit removal / didn't re-charter) — i.e. the clock + the exec action together **killed**
  the Bank, mirroring the historical Bank War.

> **★ The long-run content arc this institution sits inside (`arkzag`, batch 11) → [§29.7](#297--new--the-bank-war--independent-treasury-long-run-economic-engine-gap-116).**
> Where §27.6 is the *institution object* (the President-of-US-Bank seat + recharter clock +
> Bank-War exec action), `arkzag` plays the *content state machine* around it across a full arc: a
> recurring **"Establish Bank of the United States" CRISIS bill** that filibusters and returns, an
> active **Panic-of-1837 EconStab CRISIS**, and — under President Dudley (1840) — an
> **Independent-Treasury CRISIS bill that literally "Replaces Bank of the United States"** (Senate
> 35-17), plus a **tariff-change cooldown** ("can't change tariff rates until 1836") and a near-literal
> **Force Bill**. See §29.7 for the engine + its EconStab/Panic couplings (`game-context.md` #116).

*(designed, not built — a `game.secondBank` institution object with a **20-year recharter clock**
(`charteredUntilYear`); creating it **adds the President-of-US-Bank cabinet seat** (§26.5
dynamic-seat list) and marks that seat **unremovable while the Bank exists**; a **"Remove
Deposits"** exec-action that disables/kills the Bank; lapse on clock expiry if not re-chartered.
Couples to §24.6 / §26.5 (offices-by-law) and §14.1 (exec-action library).)*

### 27.7 The ideology chart becomes a CIRCLE (mid-era rule change)

> **The 7-point ideology scale wraps into a RING — directly contradicts a linear `Ideology`
> enum.** Refines the [§6/§7 ideology model](#6-politician-churn-213217) and the conversion
> adjacency rules ([§25.8](#258-conversion-ai--deterministic--rolls-with-pliable--ideology-adjacency-gating)
> / row #76). (`rep1800` §B POST 5717, 5730.)
>
> **★ TWO-THREAD CONFIRMED (batch 9).** The ideology-circle is no longer a single-thread finding:
> `nuke` (the independent 1948-start modern campaign) introduces the **same** rule from scratch —
> *"the ideology chart became a circle, not a line; LW-Pop can shift directly to RW-Pop (and vice
> versa) at 25% base"* (`nuke` mid-C H4; **POST 9842**). Two unrelated threads (`rep1800` 1800-start,
> `nuke` 1948-start) now independently agree the scale is a **ring with the two populist ends
> adjacent at the standard 25% one-step base** — promoting this from "designed in one playtest" to
> a corroborated rule.
>
> **★★ TED-RULED AUTHORITATIVE (batch 12b).** Ted's `tedchange#POST 24` makes the rule official
> in the rules doc: *"all ideologies are now a CIRCLE, rather than a line."* The 25% cross-circle
> shift rate is pinned, and the **`Two-Faced` trait is automatically applied on a successful
> cross-seam flip** (penalty for the unusual move; POST 28-29). **Integrity blocks at 10%; Puritan
> blocks at 0%.** This promotes the circle rule from "two-thread corroborated, designed-not-built"
> to **designer-authoritative**, with specific rates pinned. See
> [§6.3.y Ted-RULED ideology shift schedule](#63y--ted-ruled-ideology-shift-schedule-designer-authoritative-tedchange)
> for the integrated shift-rate table.

At a **mid-era rule change**, the ideology axis stops being a line and becomes a **circle**:

- **LW Populist ↔ RW Populist** — the two *ends* of the 7-point scale — become **adjacent**, with
  shifts between them allowed at a **25% base** (the same base as any other one-step shift).
- **Conversions extend to adjacent ideologies** under the ring: a faction may now poach
  same-party other-faction pols of the **same OR adjacent** ideology (it was **same-only**
  earlier, §B POST 5730).

**Why it matters for the build.** The shipped `Ideology` is the 7-value linear scale
`LW Populist → Progressive → Liberal → Moderate → Conservative → Traditionalist → RW Populist`
(`CLAUDE.md` domain quick-ref). Adjacency math (ideology-shift, conversion gating, the SCOTUS
auto-AYE-within-1-step rule §26.6) currently treats the two ends as **maximally distant**. The
design **wraps the index modulo-7** so `distance(LWPop, RWPop) = 1`, not 6.

*(designed, not built — make ideology adjacency **circular** (`distance = min(|a−b|, 7−|a−b|)`),
gated behind a mid-era rule-change flag (`game.ideologyIsCircular`); allow **LWPop↔RWPop** one-
step shifts at the standard ~25% base; extend conversion targeting to **adjacent** ideologies
under the ring. Audit every place that computes ideology distance — shifts (§6), conversion
gating (§25.8), SCOTUS within-1-step auto-AYE (§26.6), faction-center math — to use the circular
metric when the flag is set.)*

### 27.8 Amendments mutate core rules mid-game (the "Sexenio" experiment)

> **Amendments change CORE GAME PARAMETERS, not just durable flags.** Refines
> [§21.3 amendments-as-durable-state](#213-amendments-as-durable-separately-ratified-state),
> [§24.4 ratifier/threshold-as-tunable](#244-64-amendment-ratification-by-34-of-state-governors--era-keyed-then-tunable),
> and [§26.7 amendments-toggle-capabilities](#267-12th-amendment-gated-vp-actions-amendments-toggle-capabilities)
> (#16). (`rep1800` §B POST 5352, 5484–5595, 5579, 6095, 6134, 6411, 6431.)

**Ratification flow (gap-era specifics):** pass Congress → **2/3 of state Govs ratify** (an
*earlier* amendment had **lowered the bar from 3/4 to 2/3** — itself an amendment mutating a core
rule); take effect the **next half-term**; Govs vote per faction **except Puritan / Integrity
overrides** (those traits force a vote regardless of faction). Ratification is **one-shot** (no
open window; a failed amendment must be re-proposed — §A POST 2957–2959, corroborating #39/#64).

**★ The "Sexenio" — three amendments ratified 1834 mutated the Presidency into a Mexico-style
single six-year term:**

| Amendment | Effect | Core parameter changed |
|---|---|---|
| **16th** | Universal White Male Suffrage | the **suffrage / electorate** rule |
| **17th** | One-Term Limit | the **term-limit** rule |
| **18th** | Six-Year Presidential Term | the **presidential term length** (4 → 6 yrs) |

Together they produced a **6-year single-term Presidency** in play (with **25th-Amendment-style
succession**: a VP elevated **past the half-way point can't run**). Later context shows terms
**back to normal** — i.e. **player-passed amendments mutate core rules mid-game** (term length,
one-term limit, suffrage, tariff cadence) and can be **undone by later amendments**.

> **No grandfather clause modeled** (a player flagged that the real 22nd exempts the sitting
> incumbent; GM: *"my rules"*). This is a **design hole** (contrast `modern`'s grandfather
> clause, §21.3 / §24.4) — see `game-context.md` design-holes.

*(designed, not built — amendments mutate **core engine parameters** (term length, term limit,
suffrage rule, tariff cadence, the ratification supermajority itself), keyed in
`game.amendments`, taking effect **next half-term**; ratification by **2/3 of Govs** (era-keyed,
tunable per §24.4) with **Puritan/Integrity forced-vote overrides**; **one-shot** ratification
(re-propose on failure); a **25th-style succession rule** (VP past half-way can't run); and —
the hole — an optional **grandfather clause** flag. Extends §21.3 / §24.4 / §26.7.)*

---

> **Cross-reference for the roadmap (§27).** §27 is dominated by **one architecture decision** —
> **eras-are-content-bands** (§27.1) — which the tech-lead should treat as a top-level item: the
> era must become an explicit **game-state/territory content-band gate**, with `year % 4` / `year
> % 2` demoted to phase *cadence* only. The rest are era-content subsystems that slot under the
> **era-content registry** (K3/K4): the **12A election-mode toggle** (§27.3, mirrors
> `senatePre17`), **slavery-flag + Cohens state-supremacy** (§27.4, the sectional substrate),
> **organize→admit statehood gating** (§27.5), the **Second Bank recharter clock** (§27.6), the
> **circular ideology metric** (§27.7, a cross-cutting math change touching §6/§25.8/§26.6), and
> **amendments-mutate-core-params** (§27.8). All pair with §2.5 (boundary point-banking) and §26
> (the BootSheet). New design holes DH-29..DH-35 are logged in `game-context.md` (§19 below).
>
> **★ Batch 8 update.** The eras-are-content-bands finding (§27.1) is now **MULTI-SAVE CONFIRMED**
> — `ad0f2875` (1772-start) + `rep1800` (1800-start) emit identical band labels at identical
> in-game dates from **two different start years**, making this the most-corroborated architectural
> finding in the KB. §27.2 gains the **dual era-scoring** model (per-era winner + cumulative leader,
> keyed to B#/R# slots). **★ NEGATIVE RESULT:** despite its "to future" title `ad0f2875` **stalls at
> 1874 (mid-Gilded)** and completes no era beyond Gilded — **"Era of the Future" remains
> undocumented across all ingested threads**; the documented timeline end-state is unchanged. New
> design holes **DH-36..DH-44** (incl. the **DH-36 meta hole** — manual-upkeep GM burnout killed a
> 12-turn game) are logged in `game-context.md`.

---

## 28. Modern / Cold-War era (1948+) systems (designed, not built)

> **Entire section is designed, not built.** Sourced from the **9th ingested thread** —
> `be4e0f70`, *"AMPU 1948 Playtest: The Nuclear Age 1948–2004"* (`nuke`): a **12,228-post /
> 156-chunk** human-multiplayer campaign, the **single largest corpus in the KB** and the
> **fullest capture of the MODERN (Cold-War + early-21st-century) systems** anywhere in the
> knowledge base. GM/processor = `ebrk85`; designer = `vcczar`; co-designer/rules = `MrPotatoTed`.
> Cite `nuke#POST N` (the digest preserves `POST n` markers end-to-end across its three mid-reduce
> partials: mid-A 1948→1960, mid-B 1960→1982, mid-C 1982→~2005).
>
> **This is the chronological PREDECESSOR of the already-documented `modern` thread (§22, 2004→2020).**
> The forum physically broke at ~page 491 (Invision ~500-page cap) during the 2004–2006 half-term
> (final point ≈ mid-2005) and a successor thread (`3a9ac985`, the `modern` digest behind §22)
> opened at 2004→2020. **Read §28 + §22 as one continuous 1948→2020 campaign; the seam is the 2004
> election.** With §28 the mechanics doc now spans a **continuous 1772→2020 timeline.**
>
> **Relationship to other sections (read-this-first).** Most modern subsystems are **already
> documented** from the `modern`/`pop`/`drums` threads — §28 does NOT re-document them, it
> **cross-links + adds the deltas this 1948-start corpus uniquely reveals**:
> - The **era model** (two-level refinement) lives in **§27.1** (sharpened this batch), not here.
> - The **named-meter bank / Score economy / faction-enthusiasm election engine** → **§22.1–§22.2**.
> - The **presidential-primary / third-party / general-election / convention machinery** →
>   **§15.3, §22.3–§22.6, §25.1–§25.4, §25.12** (§28.6 adds the 1948-only refinements).
> - The **generic cross-era war system** → **§21.1, §13.3** (§28.2 = the headline negative-scope
>   finding: the Cold War IS this engine relabeled).
> - **Offices-by-law / amendments / SCOTUS-size** → **§21.6, §24.6, §26.5, §27.6** (§28.5 adds the
>   modern create-AND-abolish confirmations).
> - **CPU AI specs** → **§25**; **scenario-boot model** → **§26**.
>
> **Shipped reality check.** The shipped build has **no 1948 (or any modern) scenario** — only
> 1772 + 1856 boot into the engine; `Era` is a 4-value enum (`independence | federalism |
> nationalism | modern`, `types.ts:1337`) with the `modern` value **unreachable in play**.
> Diplomacy, primaries, conventions, the rich war engine, mutable cabinet, and the meter bank are
> all 1856-only or absent (§19). Everything in §28 is forum-sourced design.

### 28.1 ★ The 1948 modern boot (a distinct boot, alongside 1772 / 1856 / 2012)

> The value of this thread is the **1948 START STATE** — the engine booted mid-20th-century with
> the full modern federal apparatus already populated (no Continental/Constitutional Convention
> startup). It is a **fourth boot shape** for the BootSheet model of §26.1: 1772 (founding),
> 1856 (antebellum mid-government), **1948 (Cold-War mid-government)**, 2012 (`pop` fresh-modern).
> (`nuke` mid-A A; POST 1, 8.)

At boot:

| Boot facet | 1948 start state | Source |
|---|---|---|
| **Seated President / VP** | **Truman (D)** (just "re-elected" in the 1948 upset) + **VP Alben Barkley**; both chambers Democratic | POST 1, 8 |
| **States** | **48** — **no AK/HI** (both arrive mid-game as statehood *bills*, irreversibly — §28.10) | POST 973–974 |
| **Factions** | **10 starting factions, 5 RED / 5 BLUE** (the standard modern board) | POST 1, 17 |
| **Foreign-relation nations** | **8 standing ambassador nations** (UK, France, Spain, West Germany, USSR, PR China, Japan, Israel) — a fixed modern roster, each with a per-nation relation meter (§28.3) | POST 270, 343 |
| **Era clock** | **~6-yr title/clock offset** — game-years run ~6 behind the "1948" label; real cases/laws apply at the offset ("Civil Rights Act of 1964 (1948 in our case)") | POST 375, 606 |

- **Cold-War cabinet offices NOT in earlier boots** (the modern apparatus pre-seated): **CIA
  Director, FBI Director** (J. Edgar Hoover, 10-yr term), **UN Ambassador, Fed Reserve Chair**
  (6-yr term), **National Security Advisor, Key Advisor**, plus **Sec of Defense** (the modern
  post, not "Sec of War"). Full roster at §28.7. (POST 243, 270.)
- **Era-appropriate starting factions, two notable for the realignment (§28.4):** the
  **Dixiecrats sit INSIDE the BLUE party** (Murrman104 = Blue 5, "Graham Crackers", led by Rev.
  Billy Graham; hold Russell / Byrd / Thurmond + Theocrat / RW-Activist / Law-&-Order /
  Mil-Industrial / Big-Ag cards), and the **Reaganites start as BLUE Moderates** (ShortKing =
  Blue 4; **Reagan starts a Democrat**). (POST 1, 17, 134.)
- **Seed pols = the real 1948 roster** (Eisenhower, Nixon, JFK, LBJ, Taft, Rockefeller,
  MacArthur, Thurmond, Reagan-as-Dem…) but **less curated than the 1772/1856 datasets** —
  multiple boot bugs patched live (vacant RI/KS Senate seats; a Gov with 0 governing; Ike missing
  a Leadership trait; Barkley command 0). A modern dataset slice will need the same curation pass
  the founding datasets got. (POST 1, 36, 59–61, 204, 351–353, 362, 719, 733, 830.)

*(designed, not built — a 1948 `BootSheet` (§26.1): seated Truman/Barkley, 48 states, the 10-faction
5R/5B board with Dixiecrats-in-Blue + Reagan-a-Democrat, the full modern + Cold-War cabinet roster
(§28.7), 8 ambassador nations with relation meters (§28.3), and a curated modern dataset slice. The
~6-yr era→year offset must be explicit data, not implicit.)*

### 28.2 ★ The Cold War is NOT a system — it is the generic war engine RELABELED (NEGATIVE SCOPE)

> **The single biggest structural finding of the corpus, re-confirmed across all 156 chunks, and
> the most important line for the tech-lead: DO NOT build a bespoke Cold-War subsystem.** Despite
> the "Nuclear Age" title there is **NO purpose-built containment / nuclear / MAD / NATO /
> space-race engine.** The Cold War is the **generic cross-era naval→land d100 war engine (§21.1 /
> §13.3) relabeled with era-appropriate names, plus one-off events.** (`nuke` mid-A C1 / mid-B
> §War / mid-C H2; POST 494–500, 4851, 5422–5424, 6142, 6354–6358, 8236, 8331.)

**What actually exists** (all already specced at §21.1 — these are the 1948-era confirmations):

- **The same battle/war roller every era runs**, relabeled: **US–Spain/Franco** (~8 in-game yrs;
  "across all playtests it's always been Spain" — a misfit legacy war spawned by a bad-relations
  roll, §28.3), the **"Korean War"** (explicitly "our timeline's Vietnam quagmire", dragged to its
  ~17th–19th year in place of Vietnam), anachronistic GOP-opened wars (Invasion of Cuba,
  Cambodia/Mayaguez, Somalia, Rwanda), the **Gulf War** (Iraq-invades-Kuwait EraEvo), and the
  **Early War on Terror** (§28.13). The battle-resolution formula and KIA/Incompetent/momentum
  mechanics are **exactly §21.1** — see there. (POST 116, 4851, 5094, 5427, 5732, 6354.)
- **★ Negative findings to encode as scope boundaries:**

| Claimed Cold-War system | Reality in `nuke` | Source |
|---|---|---|
| Army / Navy / Air branches | **None** — army generals command navies, "naval" pols die in infantry attacks (repeatedly flagged) | POST 1101–1102, 1234 |
| Wars resolve | **They don't** — war-end roll `total war score × end-multiplier (0.5/1/2) × %` has odds so low the Korean War ran ~two decades | POST 5422, 5424, 6357 |
| Fall of the USSR / end of Cold War | **Never modeled — the USSR NEVER FALLS** (see below) | POST 11055, 11058–11060 |
| Nuclear / arms-race / MAD subsystem | **None** — nukes = scripted events + ONE legislative ×2 multiplier; **NASA = a bill + a prerequisite flag** | POST 400, 2508, 2650, 6765 |
| NATO / détente / SALT / Berlin | **One-off A/B events, not systems** (NATO = a single point-swing event, no Article 5, no bloc — players picked "no NATO") | POST 2599, 2606, 6266, 7097–7099 |
| Watergate → impeachment | **NO impeachment trigger** — Pres chose "allow the wiretapping", it succeeded undetected → pure upside (+1 all states, +100 pts) | POST 6674–6676 |

- **★ The USSR NEVER FALLS (the headline negative result).** The clock crosses 1982→2005 but
  there is no fall-of-USSR, no German reunification, no NATO, no MAD, no "peace dividend." The
  USSR is a **live, named ally + diplomatic actor in 2004–2005** (a sitting **Ambassador to the
  Soviet Union**; the Soviets launch Mir as a current event; the **Russo-Georgian War** event
  treats Russia as "the USSR, a nuclear power"). The dissolution event-chain **exists but is
  probabilistically gated and never fired**: Solidarity → Pope JPII → Glasnost/Perestroika → SDI →
  **Gorbachev leads USSR (~5% gate — never cleared)** → Revolutions of 1989 (20%) → Dissolution
  (10%), + a MilPrep 8–9 requirement. GM: *"we keep missing the 5% chance for the first event in
  that chain."* End-of-Cold-War triggers are also buggy (only "Dissolution of the USSR" or the
  "Soviet Alliance" event explicitly ends Cold-War status; an LW-Pop early alliance would prevent
  the Cold War triggering at all). → see **§19 hole DH-class** / digest hole #1. (POST
  11055–11060, 11398, 11466, 11706, 11750, 11752.)
- **Wars CAN be lost, with lasting penalties** (§21.1): the US LOST the US-France War (war-score
  −7 → 70% loss roll hit → **Treaty of Paris**: President permanent −1 all future elections, Party
  Pref −3, JCoS chair permanent −1 + −1 Military). A fresh war gives an initial **+Party-Pref
  patriotic boost** that decays if it drags. (POST 5620, 6070, 6354–6358.)

> **★ NEGATIVE-SCOPE directive for the build.** The "Cold War" requires **no new subsystem**.
> Build: (1) the generic war engine of §21.1 with era-relabeled battle/war names; (2) Cold-War
> *content* as ordinary EraEvos + A/B events + a few legislative multipliers (the Soviet-Nuclear-Test
> "arms race" ×2 flag; the NASA prerequisite flag); (3) the diplomacy subsystem of §28.3. **Do
> NOT build** nuclear/MAD/NATO/space-race/military-branch mechanics — they do not exist in the
> design. The USSR-dissolution chain + Cold-War-end triggers need **real population/event tuning
> + trigger fixes** (digest hole #1), and the war engine needs a **resolution path** (it never
> ends) and ideally **military branches** (digest hole #3) — both are §21.1 holes, not new systems.

### 28.3 The diplomacy system — the real, working Cold-War subsystem (2.7.1 / 2.6.1)

> **The one genuinely-exercised modern foreign subsystem** (vs the negative-scope Cold War of
> §28.2). Extends the §13.1 shipped diplomacy stub and the §13.3 forum design with the full
> 1948-era action set. (`nuke` mid-A C2 / mid-C S10; POST 270, 343, 475, 1089–1094, 2057–2062,
> 9792–9998, 10841, 10914.)

- **8 per-nation relation meters** (UK, France, Spain, Germany, Russia, China, Japan, Israel) on a
  **9-point scale Hostile < Enemy < Neutral < Friendly < Allies**. Sec of State *suggests* an
  action per ambassador; **President approves/overrides**; each ambassador sent **once/phase**.
- **Ambassador actions** (a Diplomacy phase, 2.7.1):

| Action | Effect / gate | 
|---|---|
| **Increase Relations** | success +1 / fail −1 |
| **Increase Trade Relations** | needs ≥ Neutral; roll 5–6 → +Rev/Budget, 1–2 → − |
| **Extend Credit / Take a Loan** | needs ≥ Neutral; +Rev/Budget; tracked on a Loans/National-Debt credit-debt scale, **gated by the Rev-Budget level** (stops a debt-manipulation exploit) |
| **Provoke** | retaliatory tariff/embargo; needs Congress approval until the Pres has full tariff powers; relations ≤ Neutral; −1 relations + 1–2% war chance |

- **Ambassador gating:** can't send to a nation Hostile-or-worse / at war; eligibility needs
  **Business / Foreign-Affairs / Trade expertise + Admin 2+**. The **Naive-Strategist trait gives
  −1 to every ambassador roll.**
- **Détente / summitry exec actions** (2.8.3): "First President to Visit the USSR" (+100 Globalists
  / −100 Nationalists); "Détente Policy w/ USSR" (+100 Globalists / −100 Mil-Ind, +1 Russia);
  **US–USSR Summit** general event (25% improve / 25% worsen Russia, +to 35% if Pres has Foreign
  Affairs or Sec State 4–5). (POST 1397, 1868, 1895, 2117, 2133.)
- **★ Relation meters "beyond broken"** (digest hole #2 / DH-class): by the late-90s the US is
  **Allies with EVERY nation simultaneously** (revision-to-mean + ambassador bonuses with **no
  downward pressure**). **Cold-War status hard-caps Russia/China ≤ Neutral while active** (lifted
  only by a "China Thaw" / "Soviet Alliance" EraEvo). A **war-on-bad-relations** rule (a meter at
  Enemies → 10% war next events phase) spawned the absurd Spain war; a later patch REMOVED the 10%
  chance but players ran a stale meters tab all game. (POST 494, 3710, 9952, 10841, 11058–11060.)
- **Two parallel "war" concepts** (don't conflate): **EraEvo "wars"** (Six-Day, Yom Kippur, Coup
  in Haiti) are **pure diplomatic event-flavor** that nudge a relation meter ±1 ("not wars being
  fought in game"); **engine wars** (Korea/Cuba/Cambodia/Somalia/Rwanda/Gulf/War-on-Terror) are
  the actual §21.1 battle roller. (POST 8990, 8993.)

*(designed, not built — 8 per-nation relation meters (9-point Hostile→Allies); a Diplomacy phase
(2.7.1) where Sec State suggests + Pres approves one action per ambassador/phase; the Increase-
Relations / Trade / Credit / Loan / Provoke action set with the listed gates; the credit-debt
scale gated on Rev-Budget; détente/summit exec actions. **Needs downward pressure** on relation
meters (hole #2) and the Cold-War ≤Neutral cap + its lift events. Couples to §13, §21.1, §28.2.)*

### 28.4 ★ The realignment — mechanically-but-GRADUALLY enforced (NOT a single scripted flip)

> **The dominant strategic story of the campaign, and the resolution of an upstream "forced vs
> gradual" ambiguity.** Designer's framing: the resorting *"began in 1964 (arguably the 1950s) and
> concluded in the early 1990s"* — a decade-by-decade gradual process, **enforced by four
> cooperating levers** (none of them a single scripted flip). Cross-link the historian companion
> `historical-context-1948-coldwar.md` (the load-bearing 1948→2004 framing). (`nuke` mid-A D /
> mid-B A / mid-C S9; POST 31, 1612, 1620–1623, 3485–3534, 4881, 6677, 7018, 7427, 8237.)

**The four levers** (each is an existing mechanic tuned to point one direction):

1. **Era-locked draft-pool ideology scarcity** (§28.11 / §6.3) — the per-era rookie roster starves
   Cons / Trad / RW-Pop slots, so factions drift Moderate over time and Dixiecrats → Mods. A
   faction loses a non-adjacent ideology because (a) you keep the ideology you have most of and
   (b) you can't hold non-adjacent ideologies without the middle one; the leftover card is
   reassigned to a random faction. The SAME person can get a different draft-ideology in a new
   band — but era-anchored figures are pinned ("Ted Cruz will be drafted Red regardless"). (POST
   31, 1612, 1620–1623, 3524, 3532–3534, 6538.)
2. **Enthusiasm-gated one-directional disgruntled-pol party-flips** (conversion step 2.1.6, §6.4) —
   a pol auto-flips parties (**25%**) when its faction's enthusiasm hits **max the opposite way**
   (e.g. a Lib pol in a faction at Blue +3); **high/max-enthusiasm factions are SHIELDED** and
   cannot be poached. Direction is **one-way toward modern polarity** (liberal Republicans → Dems;
   Cons/Trad Democrats → GOP). (POST 3485, 3492–3496, 5497, 5966.)
3. **Pinned party-preference** — GOP held at **Blue +3** for the realigning band so the sort has a
   stable gradient to run down. (POST 4881.)
4. **Per-decade CENSUS state-bias doc** (the `AMPU Census`, §28.9 — NOT era tables) **+ a "Revision
   to Mean"** centering damper applied every Lingering phase (§11.1). (POST 4879–4883, 6677, 7018,
   7427, 8237.)

**★ BLUE/RED meaning FLIPS during a 1948 game.** Dated trajectory:

| In-game date | State of the sort | Source |
|---|---|---|
| **1950s** | Dixiecrats INSIDE the BLUE party as its far-right wing; Moderates lean RED; Libs/Progs/LW-Pop lean BLUE; Dems hold a huge structural Party-Pref edge; Dixiecrats "completely collapsed by 1957" into Mods | POST 1, 36, 1070, 1723, 3523, 3530, 4123 |
| **1960–1964** | NOT yet enforced — Dems still hold the Solid South | POST 4743, 4881 |
| **1968–1972** | **transient mid-sort artifact** — players describe Dems = party of the CENTER, GOP = party of BOTH left AND right ("Fascist Liberals and Commie Conservatives"); **treat as a transient, NOT a stable alternate alignment** | POST 5966, 6155, 6234–6235 |
| **1976** | substantially modern (Libs Blue+3, Mods Blue+2, Cons/Trad Red+3) | POST 7272 |
| **1980** | **FULLY MODERN** — Blue=left, Red=right; Sunbelt an explicit Red strategy ("Blue a fringe leftward party" with a coastal-urban core) | POST 8000, 8041–8045, 8361, 8364 |

- Auto disgruntled-flips keep running **post-realignment as cleanup** → an ongoing engine process,
  not a one-time event. (POST 7578, 8109.)
- **Caveat (mid-C nuance):** "realignment done" applies to party **labels**; **ideology-bloc
  loyalty stays only PARTLY modern** — RW-Pop and LW-Pop frequently lean BLUE and Moderates swing
  hard even in the 90s–2000s (Mods are the swing bloc whose defection triggers forced 3rd-party
  runs, §22.4). (POST 10301, 11159, 11267.)

*(designed, not built — the realignment is an **emergent property of four existing tuned mechanics**,
not a scripted event: era-locked draft scarcity (§28.11), enthusiasm-max one-directional auto-flips
(§6.4), a pinned party-pref gradient, and the per-decade census + Revision-to-Mean (§28.9 / §11.1).
BLUE/RED semantics are **time-varying within a campaign** — the build must NOT hard-code which side
is "the left.")*

### 28.5 Modern legislation, mutable cabinet & amendments — the 1948 confirmations

> **Confirms + extends §21.6 (bill typing / budget-gated cap), §24.6 / §26.5 (offices-by-law), and
> §21.3 / §24.4 (amendments).** The novel finding is that **cabinet offices are created AND
> ABOLISHED by ordinary law in the modern era too** — founding→modern both confirmed. (`nuke`
> mid-A E / mid-B §Offices-by-law / mid-C S3; POST 379, 405, 436, 501, 1047, 1952, 6730, 6799,
> 10910, 11779.)

- **Pipeline (modern scale):** **12 Senate + 12 House proposers (era proposal cap = 24**, vs 12 in
  the 1800 era — a tunable parameter, digest hole #18); **spending-bill cap tied to the Rev/Budget
  meter** (a deficit caps how many spending bills can pass); committee vote → chair may **block +
  replace** a starred bill → chair may **package** passing bills into one S.R./H.R. (used as a
  weapon, "package tanks party pref"; ranking member may unpackage) → House (simple majority) →
  Senate → Pres sign/veto → override (2/3 both chambers). All per §12.4–§12.5. (POST 379, 405,
  1076, 5089, 5381–5417, 9742–9789.)
- **★ UNRESOLVED — Senate pass-threshold (flag as open, see §28.12).** mid-A/B report a built-in
  ~60% supermajority to **PASS** the Senate; mid-B's later partial says the GM mis-ran that and
  corrected to **simple-majority-to-pass** (67%/65 for amendments) with ~60% being **cloture only**.
  Genuinely ambiguous. **Needs the human/codebase to settle.** (POST 2746–2770, 8155, 8308.)
- **★ Mutable cabinet — offices created AND abolished by law** (the modern confirmation of §24.6 /
  §26.5): **created** across the run — OMB, HEW, HUD, Dept of Transportation, NSC + Office of
  National Security Advisor, Job Corps, **Dept of Energy** (HR.2), **Dept of Homeland Security**
  (Era of Terror); **HEW split into HHS + Education** (H.R.3); **Postmaster General office
  ABOLISHED** by the postal-independence bill. Cabinet appointment slots track these. (POST 379,
  405, 436, 501, 6730, 6799, 6946, 10910, 11779.)
- **★ SCOTUS size is LEGISLATED and variable** (§26.6 / §27): laws seen — "Set SC Justices to 10",
  "Set SC to 5", "Allow President to appoint an extra Justice when one turns 70" (court-packing) +
  a 40-Year-Minimum-Age Amendment. **Excess justices are NOT replaced** until the bench drops
  below the legislated cap (court legislated DOWN to 5 while physically holding 9–10). Platform
  planks literally read "Set SC to 31" / "just 3 if it looks like the GOP could win". (POST 4834,
  5095, 5442, 5687, 6371, 6710–6711, 7217–7218.)
- **Amendments** (a Judicial-bill subtype, §21.3 / §24.4): pass House + Senate at **2/3 (70 in the
  larger Senate)**, then **ratified by Governors needing 39 states** (52-state union). Passed &
  ratified: "Require President to Fill VP Vacancy"; **ERA / Equal Rights for Women** (exactly 39
  states); **Foreign-Born President Amendment** (let Canada-born Stan Stephens run); 40-yr SC age;
  Abolish Poll Tax; **Two-Term Limit for Presidents** (Era of Terror — see §28.6). Failed:
  Separate Election for VP; Direct Election of Federal Judges (37/39); term-limit / abolish-VP-veto
  repeatedly crushed. **VP-vacancy / 25th-Amendment fill is ad-hoc** ("making this up as we go" —
  digest hole #27, needs a real rule). (POST 379, 501, 5745, 6770–6798, 7800–7807, 8298, 10453.)
- **★ "Iron Fist" party force-vote** (§25.9): an Iron-Fist Speaker/Maj-Leader who is **also Legis
  5** controls **all** ally initial votes (LBJ as SML controls all 72 Dem votes; Nixon=1 cannot)
  and can **force a confirmation vote** but **can't compel** one. (POST 1058, 1824, 8627, 9311.)
- **Debate-sway** (post-floor, NEW vs build): an Orator flips 3 Senators of one faction / a Debater
  flips 1 (not a Puritan-led faction); a same-state Senator with a 2-Legis advantage converts one
  vote; one speech per half-term. (POST 1065–1068, 9997, 10283–10286.)

*(designed, not built — most of this is already specced at §21.6 / §24.6 / §26.5 / §21.3 / §24.4;
the 1948-era ADDS: cabinet offices **abolished** by law (not just created — §26.5 dynamic-seat list
must support removal), legislated **SCOTUS size with excess-not-replaced** semantics, the
**39-state Gov ratification** count in a 52-state union, the Iron-Fist **force-vote**, and
**debate-sway**. The Senate pass-vs-cloture threshold is an OPEN question — §28.12.)*

### 28.6 The modern election machine — 1948-era refinements

> **The fullest election-machinery capture in the KB.** The core machine is already documented at
> **§15.3 (conventions), §22.3–§22.6, §25.1–§25.4, §25.12** — §28.6 lists only the deltas /
> sharpenings this 1948-start corpus adds. (`nuke` mid-A F / mid-B §Election machinery / mid-C S2;
> POST 344–553, 1177–1490, 4456–4567, 5122–5196, 5767–6470, 7207–8052, 9385–10219, 11178–12015.)

- **Cadence:** midterms each even year (gov + a Senate class + all House); president every 4; **each
  pol runs for only ONE office per cycle** (vcczar anti-cheese fix); President → Governor → Senate
  → House order. (POST 1165, 1174, 3355, 4059.)
- **Primaries (2.9.1) deltas to §22.3:** state-grouped (delegate **Groups 1–5**; NH/DC first set by
  Gov "State Primary Placement"); by 1964 every state had a primary → conventions became a
  formality. **3 candidate types, max 2/faction:** **Major** (auto for incumbent Pres / faction
  leaders / Celebrity), **Minor** (home-state only; **promotable to Major** if it outperforms),
  **Favorite Son** (locks home-state delegates, never drops) — all need ≥1 Command. **Resign-to-run
  rolls** (appointed offices always resign; SC Justices & appointed Senators 25%; 20% a Gov/Sen/Rep
  resigns the seat; Pres/VP never; SCOTUS Justices must resign to run for President). **Incumbent
  quash** of intra-party challengers 75% (90% w/ Leadership+Iron-Fist; 50% Passive); an
  **Opposition Party Leader with Leadership/Iron-Fist can BLOCK an allied faction from running a
  challenger** (Luce blocked ALL 1972 R challengers → unopposed). **Per-group loop:** focus-state
  picks → Primary Debate → Scandal Rolls → **Primary Actions** (Presidential Promise to buy out a
  rival w/ VP/cabinet/SC-seat/plank; Demand-for-endorsement; Embrace Local Issue; Major Speech;
  Campaign Focus; Attack Rival; Withdraw+endorse) → Group Results → last-place penalty rolls.
  **★ Delegate-award quirk (rules-as-written, GM-flagged):** on a tie or 1-pt win ALL candidates
  split delegates evenly with leftovers to first → last-place candidates can tie the leaders
  (**likely needs a floor**). (POST 344, 362, 553, 1177–1209, 5767–5816, 6428–6465, 7782–7881.)
- **Conventions (2.9.2) deltas to §15.3:** the brokered convention is §15.3; 1948-era adds —
  **★ brokered-convention DESIGN HOLE** (digest hole #14): ballot 1 = primary result; if no
  majority, ballot 2 **RELEASES delegates which swing massively (80/20) to the momentum leader**,
  **ignoring** the primary result (LBJ 509-447-294 → 1009.5 on ballot 2); GM: *"the primary results
  should still have some kind of influence… we have not figured out [how]."* A "compromise
  candidate" call only after **10 ballots** (1 per allied faction; of-age + ≥1 Command). **Keynote
  speaker** chosen by the most-governors faction (a BAD keynote = −1 general + speaker gains
  Incoherent). **Platform = 5 planks** (Economic / Domestic / Judicial / Foreign-Military + a
  Presidential Action) + a **must-promise to resolve any ongoing crisis**; a **Pliable nominee +
  Manipulative faction leader ⇒ the leader writes the WHOLE platform.** (POST 1350–1399,
  5860–5872, 6466–6470, 7941–8011, 9450–9722.)
- **General election (2.9.4) deltas to §22.5:** **3 Pres debates + 1 VP debate** (VP debate "no
  effect" by design) → 2 General-Election Action rounds → **October Surprise** (rolled table;
  "incumbent" = incumbent PARTY). **★ A bad "incumbent interferes" October-Surprise roll = −2 Party
  Pref + permanent −1 + impeachment eligibility** (fired TWICE: Babbitt 1996, Kindness 2000).
  **Faithless electors** (a state won by a candidate who is its *least*-preferred ideology → roll
  1–5 faithless, max 3/state). **★ Tie resolution = per-state DIE ROLL, NOT a Bush-v-Gore subsystem**
  (1996 used a per-state coin-flip; 2000 was a clean EV win so no recount arose — **LOG AS GAP if a
  2000-specific recount is intended**, digest hole / open Q 4); a separate "challenge close states"
  path (controversial + propagandist auto-contest → recount roll-1-to-flip → unresolved go to
  **SCOTUS voted per-justice by ideology**; within-range candidate otherwise gets a **25% roll to
  challenge**). **★ "Appendix B" region-weighted 3rd-party PV** (mid-game recalibration because an
  Anderson-expy got ≥5% everywhere): **5–25% in home region, 0–4% elsewhere** — REQUIREMENT:
  3rd-party PV must be **region-weighted, not flat** (digest hole #17; refines §22.4). **GM: the
  game is HARD-WIRED to 2 parties** — a winning 3rd-party candidate just becomes that side's Party
  Leader (digest hole #16; v2 wish: dynamic party creation). **Split-EV** (10%/EV defection) is
  **acknowledged BROKEN for big states** (designed for ME/NE only — digest hole #13). **No 22nd-Amendment
  term limits** until an explicit "Two-Term Limit for Presidents Amendment" PASSED in the Era of
  Terror — before that a two-term limit is purely informal (LBJ could legally have run a 3rd term).
  (POST 932, 1467–1490, 5170–5195, 7251–7269, 8044–8052, 8845–8850, 10683–10692, 11272.)
- **Canon presidential results 1948–2004** (provenance anchors for this alt-timeline; the **2004
  Cuomo sweep is the seam to §22**): 1948 Truman → 1952 **Taft (R) def. Reagan** (contested, SCOTUS
  upheld 6-3) → 1956 Taft/**Brooke (first Black VP nominee)** → 1960 JFK → 1964 JFK def. **Clare
  Boothe Luce (R)** → 1968 **Luce (R) — FIRST WOMAN ELECTED PRESIDENT** [JFK resigned mid-term on a
  "Presidential ailment" event → VP Douglas became 38th Pres] → 1972 **LBJ 540–4 landslide** over
  incumbent Luce → 1976 LBJ 282–266 over Shirley Temple (R) → **1980 Reagan-analog GOP landslide,
  Stan Stephens (R) 418–132** (first human-led Red win "since Taft") → 1984 **Wesley Brown (D, Black
  admiral)** / RFK def. G.H.W. Bush → 1988 **Tom Kindness (R)** def. incumbent Brown → 1992
  **Shirley Chisholm (D) — 1st Black woman president** (this timeline) → 1996 Kindness (per-state
  die tie-break) → 2000 Kindness **3rd term** (clean EV win, no recount) → **2004 ★ Mario Cuomo (D)
  wins ALL 53 states** ("1st since Washington to win every state"; faithless electors gave Cuomo
  **700 EV**; coattails Senate 78D-28R, House 566D-35R). **The 2004 blowout exposed the
  landslide-margin-model misfire** (digest hole #8 — max-margin caps keyed to historical lean
  produce absurdities: won Idaho by 50, capped at +10 in tossup NH). (POST 4543–4567, 5191–5196,
  5894–5898, 7251–7259, 8045, 8830–8833, 9508–9518, 9831–9833, 10093–10219, 11272, 11998–12015.)

*(designed, not built — the machine is already specced at §15.3 / §22.3–§22.6 / §25; the 1948-era
ADDS/sharpens: the **3 candidate types** + Minor→Major promotion, the **Opposition-Leader challenger
BLOCK**, the **ballot-2 80/20 delegate-release hole + 10-ballot compromise call**, the **October-Surprise
"incumbent interferes" → impeachment-eligible** outcome, the **per-state-die tie resolution** (NOT a
recount subsystem — open Q 4), **region-weighted "Appendix B" 3rd-party PV**, and the **landslide
margin-cap misfire** (hole #8). The 2-party hard-wire (hole #16) and split-EV-for-big-states (hole #13)
are roadmap items.)*

### 28.7 Modern cabinet & the Era-of-Terror cabinet rework (2.3.1)

> **The fullest cabinet capture, and the Era-of-Terror rule delta that proves era BANDS carry rule
> changes (§27.1).** Extends §9 (shipped cabinet) and §22.9 (military tier). (`nuke` mid-A F5 /
> mid-B §Cabinet / mid-C H3+S4; POST 813, 1809–1844, 2456–2477, 4686–4748, 8516–8519, 9920–9942,
> 11398–11427, 11724.)

- **Full roster:** top-4 (State, Defense, AG, Treasury) + cabinet (Interior, Agriculture, Commerce,
  Labor, HEW→HHS+Education, HUD, Transportation, Energy) + **cabinet-level** (CIA Director, FBI
  Director [10-yr], Fed Reserve Chair [6-yr], UN Ambassador, National Security Advisor, Key
  Advisor) + **8 named-country Ambassadors** (incl. **Ambassador to the USSR**) + military officer
  corps (Chair JCoS, Army Chief of Staff, Chief of Naval Ops [4-yr], 6 Army Generals, 6 Squadrons).
- **★ Appointment ideology constraint: a President can only appoint pols within ±1 ideology step of
  his own** (reconfirmed modern — "a Prog won't serve under a Cons"; the transient inverted
  coalition of §28.4 made cross-ideology cabinets nearly impossible). (POST 6237–6239, 8184, 9928,
  11476, 11585.)
- **Retain ≤5 incumbents/term** (Key Advisor + CIA Director don't count; FBI/Fed terms don't count;
  military exempt, fired only for cause). **Sec of State = "the pinnacle"** — anyone who held it
  refuses any lesser post. Cross-party cap = 3 (≤1 in top-4); decline rolls (90% if previously held
  office; 75% Treasury/Commerce). Office requirements enforced (AG needs Justice exp; Fed Chair
  Admin ≥3; ambassadors Admin 2+ & Business/Foreign-Affairs/Trade; **FBI Director needs the Justice
  trait**; service chiefs need Military-Leadership). **Confirmation = committee (50%+1) → full Senate
  60%, later 70 (60→70% scaling with Senate size);** failed nominee = lifetime cabinet ban + −1 all
  future elections → SML names 5 acceptable replacements, Pres picks one, auto-confirmed.
- **Cabinet meter impact capped at ±1 per meter** (nerfed twice). **Cabinet → enthusiasm
  acknowledged BROKEN** (a strong cabinet swung Mod enthusiasm Red+3→Blue+3 in one shot; reworked
  mid-band into a **lobby-posts model**: 0 wanted posts → enthusiasm drop, 1 → neutral, ≥2 →
  increase, at 3 tiers — digest hole #15). **Incompetent President** = −3 to all blunder rolls, VP
  makes exec decisions, can't be retained.
- **★ Era-of-Terror cabinet rework (a BAND rule delta — proves §27.1 bands carry rules):**
  **pre-Terror**, a region absent from the cabinet = **−1 to the Pres in that region next
  presidential election**. **From the Era of Terror, region STOPS mattering** → replaced by:
  - a **diversity check** — factions with Civil Rights / Reformist / LW-Activist cards take **−2
    faction enthusiasm** if **<25%** of cabinet + cabinet-level are women / racial minorities; and
  - a **faction-balance check** — the Pres must balance appointments across **ALL same-party
    factions**; **−500 pts per slighted faction**.
  (POST 11398–11427, 11724.)

> **★ CORROBORATED + FORMALIZED by `terror2000` (batch 15, the first NATIVE 2000-start):** BOTH
> Era-of-Terror cabinet penalties above fire **natively** in a 2000-start (not just in `nuke`'s
> late-game). The **faction-balance check is now gap #151** with Ted's exact wording (*"−500 points
> per slighted same-party faction"*, fired LIVE twice — Bush −2000, Oprah −2000) and the
> **diversity check** was re-confirmed (female/minority Exec-tab flags). Full statement in
> **[§9.3.9](#939--ted-ruled-era-of-terror-cabinet-fairness--diversity-penalties-151-designer-authoritative-terror2000)**. The cabinet→enthusiasm channel was ALSO re-tuned LIVE here to the 3-state
> upset/fine/happy model (**[§9.3.7](#937--ted-ruled-cabinet--enthusiasm-rework-designer-authoritative-tedchange)**, #124 sharpened). (`terror2000#POST 1280, 428-441, 486-489, 154`.)

*(designed, not built — most is §9 / §22.9; the modern ADDS the **±1-ideology appointment gate**,
the **60→70% confirmation scaling**, the **lobby-posts enthusiasm model** (hole #15 — replaces the
broken direct swing), and — the era-BAND delta — the **Era-of-Terror diversity + faction-balance
checks replacing the region rule** (concrete proof that §27.1 era bands carry rule deltas, not just
content).)*

### 28.8 Civil Rights — distributed across systems, the canonical "era content via generic mechanics" example

> **The canonical worked example for §27.1's "era CONTENT fires on its own clock and is distributed
> across generic mechanics, not a bespoke subsystem."** Civil Rights is **never a standalone
> mechanic** — it is spread across THREE existing systems, with counter-historical play allowed.
> (`nuke` mid-A D / mid-B Civil Rights; POST 390–474, 1944, 2117, 3320–3405, 4767–5417, 6371.)

1. **Scripted / era EVENTS:** "Major Civil Rights Protests" (QoL −1); **Enrollment of James
   Meredith** (Response A federalize vs B let state block — JFK's cabinet picked B, segregationists
   win); "2nd Great Migration" (EV shifts + Civil Rights pts); Operation Wetback. (POST 4767, 5008,
   5029, 5332.)
2. **Ordinary ideology/lobby-scored BILLS:** Ban Discrimination in Housing, Ban Discriminatory
   Voting Practices, **Affirmative Action** (passes 1966), nationwide equal-access school funding,
   "Make lynching illegal" (Gov action), **Abolish Poll Tax** (ratified 1972, "deactivating Jim
   Crow nationwide") — scored vs Civil Rights / LW Activists / Human Rights cards. A GOP-Taft
   faction passed "Ban Racial Segregation…" as a **Crisis Bill in 1950** (Party-of-Lincoln framing,
   Dixiecrats voting no), later rendering Brown v Board moot in-game. (POST 390–474, 5108, 5155,
   5361, 5395, 6371.)
3. **SCHEDULE-FIRED SCOTUS docket that ignores in-game history:** Hernandez v US, Williams v Lee,
   **Heart of Atlanta Motel v US** (upholds CRA Title II 9-1), **Roe v Wade** (legal 7-3, fired in
   a **1966-equivalent** cycle!) — all flagged **"this is the historical outcome"** and award Civil
   Rights / Public Healthcare pts. (POST 4803, 5048, 5363.)

- **Per-state Jim-Crow / poll-tax law switches** (the §11.4 / §27.4 state-flag pattern, modern
  instance): active/inactive flags; **activating** needs a same-party Senator + RW-Activist;
  **deactivating** needs a same-party Senator + Civil Rights; Governor actions toggle them. **"Apply
  Federal Force to End Jim Crow Laws"** Presidential exec action ends Jim Crow but with **25% chance
  of −1 Dom-Stab per Jim-Crow state** + **−1 GOP in Upper/Deep South next presidential election**.
  (POST 1944, 2117, 2133.)
- **MLK = a historical-figure event pack** (the per-politician scripted-gate pattern): draftable in
  the **1956 class** (Red Lib; Orator/Leadership/Integrity + Obscure + Frail), hard-gated by **3
  attached events @5%/phase once the CR Movement begins** (assassination / survives / enters
  politics). He **cannot run / be nominated / party-flip** until "Martin Luther King Jr Seeks
  Political Office" fires; he later gave the **1964 Dem keynote**. (POST 3320–3405, 4913, 5163.)
- **Counter-historical play allowed; minority penalties until the CR era fires:** a woman in cabinet
  / a female presidential nominee pre-CR = −1 Party Pref; first Black VP nominee (Brooke, 1956).
  (POST 2456, 3138, 4485, 5164.) **The ~5%/phase trigger that fires the CR Movement even after a
  player ends Jim Crow early is the §27.1 worked proof** that era CONTENT runs on its own clock.

*(designed, not built — no bespoke Civil-Rights subsystem: it is **(a)** scripted EraEvos +
**(b)** ordinary ideology/lobby-scored bills (some Crisis Bills) + **(c)** the schedule-fired SCOTUS
docket (§28.5 / §22.7), over the per-state Jim-Crow/poll-tax flag (§11.4 / §27.4) and the
per-politician scripted-gate pattern (MLK). The pre-CR minority Party-Pref penalty and the
~5%/phase CR-Movement trigger are the concrete encodings.)*

### 28.9 The per-decade census + statehood/territory (the level-(b) census mechanic)

> **The detail behind §27.1 level (b).** The decennial census is a **schedule-fired** mechanic
> distinct from the per-era bias-table swap (§27.2 step 6). Refines §21.5 (statehood) and §22.10
> (apportionment). (`nuke` mid-A E / mid-B §Roster / mid-C S2+S10; POST 973–974, 1163, 2705–4325,
> 4879–4883, 6374–6377, 8410, 8547, 9806–10108, 10539.)

- **Census every 10 yrs** reapportions EVs + Focus Reps + state bias from an external **`AMPU
  Census` doc** — **per-decade, NOT era tables** (era-bias tables deprecated). Worked deltas: **1972**
  CA +13, NY −2, IL −2 (+ "focus Reps" shifts); **1990** CA +3, FL +5, TX +4, NY −4, OH −3. The
  sheet tracks its own EV column vs a historical-EV column. Some EV swings also come from **scripted
  events** (FL +3, PA −3, ME −1; Air Conditioner pre-loads AZ/FL; "Losing Jobs Overseas" ×2 kills
  US manufacturing → big EV penalties next census). Post-census, incumbents may run outside their
  old district that cycle. (POST 1163, 4879–4883, 6374–6377, 8410, 10008–10010.)
- **Wholesale state-bias re-lean** at each census on the Blue5..Tossup..Red5 scale (1970→72 shifted
  ~30 states mostly toward Tossup; 1980 shifted 10 states almost all toward Red; 1990: GA Blue+2→Red+3,
  MS Tossup→Red+3, CA/NY/IL/MD bluer). (POST 6376, 8364.)
- **Statehood is legislation, partisan-coded, and irreversible** (§21.5): **AK** admitted
  ~game-1950; **HI** a recurring football (Republicans blocked it twice — **blocking permanently
  LEFT-shifts a state's ideology**; on admission a special Hawaii election runs Gov-first → Gov
  appoints the Class I Senator). **DC + Puerto Rico admitted as 51st/52nd, Cuba as 53rd** (Cuba: 17
  EV / 3 focus reps, via Occupy → Annex → Territory → Statehood). New-state rules: 2 senators split
  Class I/II; **DC pols gain +1 Gov or Legis**; **PR/Cuba offices filled by randomly-generated
  Spanish-named pols** (70% Dem, 90% Hispanic, age 45) handed to the lowest-scoring player; **each
  future draft adds 2 random pols per new ahistorical state.** **Voting AGAINST a statehood bill
  carries a Party-Pref penalty.** (POST 973–974, 2705–2820, 3833–3838, 4321–4325, 9806–10108.)
- **Relocation (2.1.4, §6.2):** alt-state moves + overpopulated→underpopulated moves (d100 vs 25;
  gain Carpetbagger −1 until +10 yrs). (POST 8428, 9567–9576, 10539.)

*(designed, not built — a **per-decade `AMPU Census`** schedule-fired mechanic (EV reallocation +
Focus-Reps + wholesale state-bias re-lean) distinct from §27.2's per-era table swap; partisan-coded
**irreversible** statehood-by-bill (§21.5) with the blocked-state left-shift, the special-election
Gov-first admission, and auto-generated Spanish-named officials for PR/Cuba; the +2-pols-per-new-state
draft additive. **★ Data-loss hole (DH-class, digest hole #4):** the whole Neocon-era census/EV-delta
event block was accidentally moved to "Era of Terror" in the Sheet (events stored alphabetically-by-era
+ EV-change events lack "EV" in flavor text → unsearchable) — same theme as DH-36; → REQUIREMENT: era-event
data needs a **structured `evDelta`/census field** (not free-text flavor) + per-era completeness so a
10-yr census reallocation always fires.)*

### 28.10 The ~25-sub-phase modern turn loop (scale note)

> **The modern turn is far deeper than the shipped (draft / election / legislation / era-events)
> loop and the founding/1856 loops.** Each turn = **2 years / a half-term**; the numbered cycle is
> consistent with the shipped phase taxonomy (§2) but **much deeper** (~25 sub-phases). The full
> ordered list is documented at **§2 (shipped) and across §6–§16**; this is a scale callout, not a
> re-listing. (`nuke` mid-A G / mid-B §Roster / mid-C S1; POST 98, 136–178, 4571–4628, 9547–10286.)

The forum game adds, on top of the shipped loop: **career tracks (2.1.2), ideology shifts (2.1.5),
conversions (2.1.6), kingmaker/protégé (2.1.7), faction-personality drift (2.1.8), committees +
faction/party leaders (2.2.2–2.2.4), cabinet ±1-ideology gates (2.3.1), governor actions (2.5.2),
SCOTUS decisions + compelled retirements (2.5.3 / 2.8.4), diplomacy (2.7.1), exec actions (2.8.3),
filibuster + debate-sway + bill packaging (2.6.x), and the full primary→convention→general (2.9.x).**

- **★ Living, separately-versioned ruleset (the build targets a MOVING spec — digest hole #32):**
  mid-band revamps observed — cabinet→enthusiasm reworked (POST 9920–9921); faction-leader
  eligibility reordered (POST 9902, 10178); death + retirement recombined (POST 10823–10835);
  ideology-circle added (POST 9842). Closest design-freeze signal: vcczar says **Anthony is
  actively programming the app and has already coded all of phase 2.1**; rules are "as set as
  possible" because "changing one thing can break eight others" (POST 12064–12067). **Open Q
  (§28.12):** is "all of phase 2.1 coded, rules set" the authoritative app scope, or
  playtest-specific?

### 28.11 Modern draft, lobby cards & dataset (the era-locked content rotation)

> **The level-(b) content-rotation detail + the modern dataset facts.** Refines §4 (draft) and §7.4
> (card distribution). (`nuke` mid-A G / mid-B §Roster / mid-C S8+H3; POST 99, 3516–3519, 6538–6592,
> 8068–8093, 10762–10983, 11303, 11359, 12028–12120.)

- **Draft (2.1.1):** rookie classes per draft year (1952 = 168 pols; 1956 class has MLK); snake
  order **worst-score-picks-first**. **Draft-ideology is era-locked** (≠ faction cards) — the lever
  that drives realignment (§28.4). **★ Command is no longer granted at draft** ("V removed Command
  from rookies") — earned via Kingmakers, ~160 general events, faction leadership, moving meters as
  Congress/Gov, Gov re-election, and a 10% chance from passing a crisis bill. Modern-name cohorts
  enter on schedule (1968: Pelosi, Biden, Bernie, McConnell, Gingrich, Cheney; 1972: Bill/Hillary
  Clinton, Trump, Romney, GW Bush; 1980: Feingold, Oprah, Condi Rice, Roberts, Petraeus). (POST 99,
  3516–3519, 6538, 6589, 8068–8093.)
- **Lobby roster is era-banded** (content rotation): only ONE faction per party gets LW Media /
  LW Activist this era; modern lobbies emerge (Big Tech, Big Pharma, Military-Industrial, Wall
  Street, Free Trade, Human Rights, RW Media, RW Activists, Big Oil & Gas) — but the **lobby-card
  LAYER is era-agnostic** (Big Tech already tradable in the late-90s). Era-activated **industries**
  (High-Tech, Alt-Energy) rotate in too. (POST 6589–6592, 8909, 10762, 10983.)
- **★ Dataset facts for the modern slice:** **2000 + 2004 real draft classes** seeded from the
  dataset, **incl. designer vcczar and forum users drafted in as draftable pols** — 2000: Sununu,
  Stacey Abrams, Nikki Haley, Andrew Yang, Amy Coney Barrett, Beto O'Rourke, MTG, Elon Musk, Steve
  Bannon, Donald Trump; 2004: Clay Aiken, Ro Khanna, Andy Beshear, Wes Moore, **@vcczar drafted as
  "Jonathan Hobratsch"**, Tom Cotton, Ron DeSantis, Josh Hawley, Donald Trump Jr, **@matthewyoung123**.
  **★ Modern pols are overpowered / recency-biased** (digest hole #7): "Elon Musk… way too
  overpowered; we need to go through all recently added 'modern era' pols to ensure parity" → a
  balance pass on the modern dataset slice. (POST 11303, 12028, 12036, 11460.)

### 28.12 ★ Design intent (SOLO-first), the open question, and the timeline seam

> **The roadmap-load-bearing findings from this corpus.** (`nuke` digest holes #33 + open Q 1;
> POST 6518, 6966–6970, 7932, 2746–2770, 8155, 8308.)

- **★ DESIGN-INTENT — the digital APP is built for 1-human-vs-9-CPU** (the strongest corpus
  statement). Multiplayer "goes off the rails"; the **points system is for CPUs + enthusiasm, not
  humans** (low points = better draft order, so humans can tank). The tabletop/forum game is team
  multiplayer with CPU backfill; **both are true — the app is a solo adaptation.** Consequence: the
  app's **CPU-faction AI is entirely UNEXERCISED by this (human) playtest**, and a large
  multiplayer-only apparatus (party-leader elections, conversions, kingmaker pairings, committee
  assignment, cross-faction endorsements, forced 3rd-party runs) must be **AI-driven** in the solo
  build (§25). Designers also repeatedly defer fine mechanics to "when the computer game comes out."
  **This validates building solo-first with CPU-faction AI as load-bearing.** (POST 6518, 6966–6970,
  7932, 1134.)
- **★ OPEN QUESTION — Senate pass-threshold** (§28.5): a built-in **~60% supermajority to PASS** the
  Senate, OR **simple-majority-to-pass with ~60% being cloture only**? The mid-digests conflict and
  the rules text ("procedural rules may establish stricter rules") is genuinely ambiguous. **Needs
  the human/codebase to settle pass vs cloture.** (POST 2746–2770, 8155, 8308.)
- **Other open Qs** (digest): does the Era of Terror formally end at **2012** and what band follows
  (unnamed here; the successor `modern` names **Era of Populism 2012–2024**, §22.11); is a
  Bush-v-Gore **recount** intended for 2000 (absent — ties resolve by per-state die; §28.6).
- **Timeline seam:** this 1948 thread is the chronological **PREDECESSOR** of the already-documented
  `modern` 2004→2020 thread (§22). With §28 the mechanics doc now covers a **continuous 1772→2020
  timeline** (founding → early-republic § 27 → antebellum/Civil-War § 23–24 → Gilded/Progressive
  → Cold-War/modern § 28 → Era-of-Terror/Populism § 22). The 2004 Cuomo election (§28.6) is the
  exact seam to §22.

### 28.13 Era-of-Terror content (2000–~2005, fired in the late game)

> **The 2000-boundary BAND's distinctive content** (entered at the §27.1 level-(a) 2000 boundary).
> (`nuke` mid-C H3; POST 11359–12120.)

- **9/11-analog chain:** **1993 WTC Bombing** (truck bomb, "terrorist cell out of Afghanistan";
  choosing to invade = "**Trigger Early War on Terror**") + Terrorist Attack on US Troops (−1
  MilPrep, fires twice), Terrorist insurgency in Yemen (al-Qaeda; airstrike/drone option),
  Terrorists Strike London. (POST 11466, 11750.)
- **★ Early War on Terror = a Major war actually FOUGHT AND WON via the generic naval→ground engine**
  (unlike most wars here, §28.2): win 1 naval battle (Indian Ocean) → ground phase (Herat) → war-end
  roll `total War Score × 0.5` (rolled 23/30 → won) → "Agreement in Kabul": +3 Party Pref Red,
  generals gain Celebrity/Command, **Pres gains permanent +1 in ALL elections**. **STILL no
  NATO/MAD/space-race/nuke subsystem** — "Korea announces it has nukes" is just an event with
  sanction options. (POST 11583, 11858, 11859.)
- **Patriot-Act-analog bills (NEW content):** Mass Phone Data Collection for National Security; FBI
  covert searches w/o court order; State Surveillance Systems; **military drone program**; indefinite
  detainment of immigrants; **Create Dept of Homeland Security**; Regulate the Internet. (POST
  11466, 11506, 11524, 11779, 11784, 11790.)
- **2000s culture-war docket:** Protect/Recognize Gay Marriage, Ban Bump Stocks, Cryptocurrency,
  Subsidize Flight to Mars, Gradual Reduction of Carbon Emissions, Negative-Income-Tax/UBI,
  Federally Fund High-Speed Rail, Flat Tax 20%, **Two-Term Limit for Presidents Amendment (PASSED)**,
  **Wyoming Rule for Electoral College** (passed but **un-implementable** — the game has only EVs,
  no population, no 435 House cap, so the rule "literally can't exist"; GM hand-mapped real-2000
  math, admits it breaks "by the 2030s" → digest hole #5: BUILD must add a real
  population/apportionment model OR remove/redesign population-dependent content). A 2000s SCOTUS
  docket of era-appropriate real cases, often adjudicated ahistorically. (POST 11538–11618.)
- **Modern lobby cards** present on factions: Big Tech, RW Media, Big Pharma, Big Oil & Gas,
  Military-Industrial, Wall Street, Free Trade, Theocrats, Science, Nationalists, Isolationists,
  Globalists, Civil Rights, Public Healthcare/Education, LW/RW Activists, Reformists, Welfare, Human
  Rights, Environmentalists. (POST 11359, 11676, 12120.)

*(designed, not built — Era-of-Terror is the §27.1 level-(a) BAND after 2000: 9/11-analog event
chain → a winnable War on Terror via the §21.1/§28.2 generic engine, Patriot-Act surveillance/drone/
detention bills, DHS-by-law (§28.5), a 2000s culture-war legislative + SCOTUS docket (incl. the
un-implementable Wyoming Rule — hole #5), and modern lobby cards. Event firing-rate is bimodal —
~5% pre-Terror (USSR chain never starts) vs ~25% in the Era of Terror (first-ever hit of the
15-event/era cap) — digest hole #6.)*

> **★ CORROBORATED NATIVELY by `terror2000` (batch 15) — the first 2000-START record (`nuke` only
> *reached* 2004).** Every element above fired in a genuine 2000-start (#113): **9/11 fires
> VERBATIM** (`POST 484-520`) → Bush declares the **War on Terror + War in Afghanistan** via the
> generic naval→ground engine; the **Patriot-Act docket** is proposed (surveillance systems at
> airports/borders, military **drone program**, **Director of National Intelligence** office,
> deport-dangerous-immigrants, war bonds, voter-ID, prescription-drug Medicare, ban-lynching, `POST
> 602-650`); **era-gating CONFIRMED** (US Space Force / Sonny-Bono items locked until Era of
> Populism, `POST 619/623`); **designer `vcczar` drafted as "Jonathan Hobratsch"** + forum users as
> pols (`POST 60, 132`). **Two divergences from `nuke`:** (a) here the **War on Terror is LOST**
> ~2005 (`POST 639` — confirms the war engine resolves in DEFEAT too, [§21.1 #152](#211-generic-cross-era-war-system), Afghanistan
> →Phase II); (b) the **Iraq War NEVER fires** (timeline diverges — proof era CONTENT is a deck on
> its own clock, [§27.1](#271--the-era-model--eras-are-content-bands-gated-by-game-state--territory-not-calendar-year)). The one anachronism: a **"Paris Agreement" climate event** (`POST 508`).
> Conventions held in **NYC "milking the 9/11 angle"** (`POST 368`). (`terror2000#POST 484-520,
> 602-650, 619/623, 639, 60/132, 508, 368`.)

---

> **Cross-reference for the roadmap (§28).** The headline for the tech-lead is **NEGATIVE SCOPE**:
> the "Cold War" / "Nuclear Age" requires **no bespoke subsystem** — it is the generic war engine
> (§21.1) relabeled + ordinary EraEvos/A-B events + the diplomacy subsystem (§28.3). **Do NOT build**
> nuclear/MAD/NATO/space-race/military-branch mechanics. The genuinely-new build surface from this
> corpus is small and mostly **deltas to already-specced systems**: the **two-level era model**
> (§27.1, sharpened — point-banked bands + a separate per-decade census), the **diplomacy subsystem**
> (§28.3), the **Era-of-Terror cabinet rework** (§28.7, the cleanest proof that bands carry rule
> deltas), **mutable-cabinet abolition + legislated SCOTUS size** (§28.5), and the **realignment as
> an emergent property of four tuned mechanics** (§28.4, with BLUE/RED semantics time-varying). The
> **data-loss hole** (§28.9 / DH-class — lost census/EV events → structured `evDelta` field, same
> theme as DH-36) and the **broken USSR-collapse + relation-meter** holes (§28.2–§28.3) are the
> top tuning items. The **1-human-vs-9-CPU design intent** (§28.12) validates the roadmap's
> solo-first sequencing. New design holes from this batch are logged in `game-context.md`
> **DH-45..DH-58** and detail rows **#106..#114** (§19, not re-documented here). With §28 the doc
> now covers a continuous **1772→2020** timeline (the 2004 Cuomo election is the seam to §22).

---

## 29. The 1820 "Era of Democracy" start — scenario boot, the FULL 1820→1840 arc, GA rulings & forks (mostly designed/ruled)

> **Two playtests share this exact 1820 start; this section now covers BOTH.**
> - **Batch 10 — `cc37d770` "1820 — The Era of Democracy" (`dem1820`)** — a 947-post, 10-human
>   multiplayer **first 1820-START scenario**, GA'd by `@MrPotatoTed` (+`@matthewyoung123`,
>   `@ebrk85`/`@Arkansas Progressive`/`@vcczar`). It **stalled ~1822–23 after ~1.5 turns** (GA
>   burnout, DH-36) and **never reached 1824 / Jackson / Nullification**. Durable value: the
>   **scenario-boot procedure (§29.1)**, two design forks (§29.2 SCOTUS, §29.3), and the GA-rulings
>   cluster (§29.4–29.6). Cite `dem1820#POST N`.
> - **Batch 11 — `152c2881` "Ark and Zags — The Era of Democracy" (`arkzag`)** — the **direct
>   continuation of the SAME save** ("working off of where Ted quit"), now GA'd by **@Zagnut + @Ark**
>   (+ @vcczar/@ebrk85/@Ted as advisors). It ran the **FULL arc 1822 → 1824 → 1828 → 1832 → 1834 →
>   1836 → the 1840 conventions** — exercising a mountain of **late-game systems batch 10 never
>   reached**: multi-cycle presidential elections (8-stage general + brokered conventions +
>   presidential-promise buyouts), the **Bank War → Independent-Treasury** economic arc (§29.7), a
>   near-literal **Force Bill** + tariff fights, **constitutional-amendment machinery** (§29.8), a
>   **presidential assassination → VP succession → acting-president** chain (§29.9), an active
>   **Panic-of-1837 EconStab crisis**, and **late-game faction churn**. Its single most valuable
>   finding: the **final chunk publishes the canonical 4-step enthusiasm-shift rule verbatim**,
>   which **matches `drums`** and therefore **SETTLES the #51 fork** (§29.3, §29.10). Cite
>   `arkzag#POST N` (chunk markers `===== POST n =====`).
>
> **Almost everything here is DESIGNED/RULED, not SHIPPED** — the shipped engine boots only 1772 and
> 1856 (`scenario1772.ts`, `scenario1856.ts`); there is no 1820 scenario, no live SCOTUS docket
> ([§22.7](#227-scotus-subsystem-253--282); shipped court = `runPhase_2_5_3_Court` coin-flip
> ±0.1 partyPref + `runPhase_2_8_2_CourtMgmt` age-75 retire, `phaseRunners.ts:3397, 3648`), no
> focus-Rep House model, no sectional-balance crisis ([§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine)),
> and **no economic-arc / amendment-lifecycle / death→succession→acting-president state machine**
> (§29.7–29.9). Cross-ref `game-context.md` **#115/#116/#119** (the NEW gaps) + #1/#9/#11/#13/#18/
> #25/#40/#44/#51/#52/#54/#55/#59/#61/#76/#85/#92/#101/#108/#111 and DH-24/25/27/36/53/57/59/60.
>
> **Polarity & alt-history discipline (historian's discipline — `historical-context-1820-democracy.md`
> §§9–16).** At 1820 **BLUE = Democratic-Republicans** (dominant, agrarian/states'-rights pole) and
> **RED = the dying Federalists / "National Republicans"** — the **same** polarity as 1788/1800,
> **NOT** the 1856 RED=antislavery flip. The party system **never realigns**: through **1840** it is
> still **D-R (BLUE) vs "National Republicans"/"Federalists" (RED)** — **no Jackson presidency, no
> Whig Party, no Democratic-Party formation**. The fictional D-R president line is **Benton**
> (re-elected 1828) → **Cheves** (1832, re-elected 1836) → **Enoch Lincoln** (succeeds on Cheves's
> *assassination*) → **Dudley** (1840 incumbent). **"President Lincoln" = Enoch Lincoln of Maine,
> NOT Abraham Lincoln** (who is a separately-drafted rookie, `arkzag` ch30 POST 1378). The in-game
> **"13th Amendment" = a presidential-SUCCESSION rule, NOT abolition**. The **"Civil Rights"
> ideology token** is, at 1820–40, **antislavery / restrictionism** (Missouri-debate / Rufus-King
> kind), not the 20th-c. movement.

### 29.1 ★ The scenario-boot procedure as practiced (gap #115)

> **THE build-relevant headline + a NEW gap.** The single most-repeated meta-complaint was that
> **there are NO documented rules for CREATING a game** — the rulebook is written for *players*, not
> GMs (`Ted`: *"rules, or a how-to guide, on how to create a playtest is maybe our greatest need
> but to date nobody has stepped up to write one"*, POST 92; *"there aren't any written rules about
> how to create a game"*, POST 84). The setup was **improvised**, so house rules were undisclosed
> until challenged. **The build's scenario-boot pipeline IS the missing setup spec** — this is the
> canonical procedure-as-practiced, with every undocumented decision flagged. Extends the cross-era
> mid-government boot shape ([§26.1](#261-the-mid-government-boot-shape-general)) with a **third
> start year (1820)** and the **first explicit account of an inaugural live draft + career-track
> seed**. (`dem1820#POST 1, 2, 14, 23-34, 62, 79, 82, 84, 92, 117, 532, 859`; gap #115.)

The **1820 boot is a mid-government continuation boot** (same shape as 1856/1800/2012): sitting
**President Monroe + VP + Cabinet + a 6-then-9-member SCOTUS + Speaker + Senate Pro-Tem + full
Congress** pre-seated, **some seats VACANT** and appointment-filled in setup; **5 BLUE + 5 RED
named factions** (B1–B5 / R1–R5) spanning **LW-Pop → RW-Pop** across each party (the per-party-5
ideology-ladder pattern, here holding an **8th era**). The era pool is **Mod/Cons/Trad-heavy**;
"there are not a lot of Libs in this era" and Progressives barely exist (POST 943 — corroborates
the early-era drafting profile from a 3rd early-era thread).

**The procedure, in order:**

| # | Step | What happens | SHIPPED? |
|---|---|---|---|
| 1 | **Live first-10 draft** | A **live Discord draft of 10 marquee figures** (Marshall 1st overall, DeWitt Clinton, Rufus King, Macon, Clay, Webster, Monroe, Howard, Madison, Adams), then the rest by offline tiered lists (POST 2, 14). | DESIGNED — no draft-UI for a live first round. The shipped 1772 draft is dataset-driven ([§4](#4-draft-211)). |
| 2 | **Rookie (25-yr-old class) snake draft** | A snake **1820 Rookie Draft** of the ~1820 class — John Church Hamilton, Edward Everett, Thaddeus Stevens, G.M. Dallas, J.K. Polk, etc. (POST 23-26). | SHIPPED mechanic (draft on `year % 4`), but seeded by the boot, not live. |
| 3 | **Faction ideology assignment** | Fixed at **B1-B5 / R1-R5** spanning LW-Pop→RW-Pop per party (POST 1; reconfirmed POST 946). | DESIGNED (boot data). |
| 4 | **★ Inaugural career-track seed (the last 3 draft classes)** | **Verbatim rule (POST 28):** during the inaugural draft you may place rookies **from the past three draft classes** onto career tracks — a 1820 start seeds from **1820 / 1816 / 1812 / 1808** (4 classes incl. the current; POST 32). **Pols who begin already in a position (Rep, General, etc.) CANNOT be career-tracked.** | DESIGNED/RULED — the stated rule for the mid-game career-track-bootstrap hole (DH-25). Debated as too harsh (Zagnut wants "no >1 ability + 3-4/yr cap", POST 29; Largo wants pulled pols reset to year-1 stats, POST 34). |
| 5 | **★ "Strip Command from ≤40 boot pols w/o a job" (contested house rule)** | The GA **removed Command from anyone ≤ 40 without a non-career-track job** at boot, rationale: *"nobody should be born with command, or else people become President out of nowhere"* (POST 62, 79, 82). `KevinStorm` objected loudly — he'd drafted pols *specifically* for starting Command (POST 79, 91) — and it's **nowhere in the rules** ("vibes-based rules", POST 97). | DESIGNED/RULED — **NEW, undocumented house rule (#115).** The build's boot pipeline **must decide**: do inaugural-draft pols keep their dataset Command, or is Command zeroed below an age/office threshold? (Open Q, `game-context.md` #115.) |
| 6 | **Relocations / ideology shifts / kingmaker-protégé / faction-personality cards** | Standard 2.1.x churn run as part of setup; faction-personality cards drawn for the **1821-1823** band. | SHIPPED phases (2.1.3–2.1.8); run at boot here. |
| 7 | **Disgruntled-pol party-flips (2.1.6)** | **Fired turn 1** because the President IS a faction leader at this boot (note: `rep1800` SKIPPED 2.1.6 because no leaders exist at its boot — see [§29.6](#296-corroborations--the-era-slice-182023)). BLUE is **maxed enthusiasm** for Mod/Cons/Trad/RW-Pop, so **6 RED pols defected to BLUE** + 3 gained "Can Party Flip" (POST 72). | SHIPPED-adjacent — confirms the one-directional enthusiasm-gated auto-flip ([§6](#6-politician-churn-213217); #76/#108); flip direction is RED→BLUE because BLUE is maxed. |
| 8 | **Leadership + committees + faction/party leaders** | Speaker, PPT, committees, faction leaders, party leaders selected ([§8](#8-leadership-selection-22x)). PPT/Speaker incumbents **can't be challenged** unless they fail prerequisites OR a challenger's ideology enthusiasm drops below neutral (POST 159, 168, 172); **minority leadership offices don't exist this era** (POST 156). | SHIPPED phases; era-gated office set. |
| 9 | **Era-keyed industry init for new states** | (continues through play) new states init with **era-keyed industry, NOT zero**: Arkansas + Michigan each start with **1 Agriculture** (AR also **+1 Plantation**) per the era industry table (POST 532-534). | DESIGNED — `admitState` (`territories.ts`) doesn't seed era-keyed industry. |
| 10 | **Senate-class assignment + vacant-seat fill** | Senators assigned to a class; vacant seats filled by the appointment order in [§29.4](#294-ga-appointment--eligibility-rulings-senate-fill-order-card-distribution-replacement-gains). **Boot Senate-class data was WRONG** (ran the 1822 midterm as Class I, should be Class II — full re-submission, POST 758) — corroborates **DH-24**, now 2-thread; the boot needs a **Senate-class verifier**. | DESIGNED — boot data + a verifier (DH-24). |

> **★ Self-contradictory career-track eligibility (sharpens DH-25/DH-56).** §2.1 says career-track
> pols "will be unavailable to run in elections / to be appointed," but **many other sections let CT
> pols be pulled** — `Ted`: *"we'll ignore the 'cannot run or be appointed' rule because it isn't
> consistently applied"* (POST 850, 859). The build must pick **ONE coherent CT-eligibility rule**
> (and the appointment order in [§29.4](#294-ga-appointment--eligibility-rulings-senate-fill-order-card-distribution-replacement-gains)).
> Corroborated from a 3rd thread.

> **Build item for the tech-lead / roadmap-planner (#115).** The canonical `scenarioBoot(era,
> year)` pipeline must encode: (a) the 5+5 ideology-ladder faction roster + era-tuned ideology/
> interest/lobby decks; (b) the sitting-government seed (Pres/VP/Cabinet/SCOTUS/Speaker/PPT/Congress/
> governors) with **vacant-seat fill**; (c) the **inaugural career-track seed from the last 3 draft
> classes**, excluding already-in-office pols; (d) **the boot-Command decision** (keep dataset
> Command vs zero below an age/office threshold — currently unresolved); (e) **era-keyed industry
> init** for states; (f) **Senate-class assignment + a verifier** (DH-24); (g) a `TRAIT_CONFLICTS`
> validator at boot (DH-27 — see below). This is the same `BootSheet` schema as
> [§26.1](#261-the-mid-government-boot-shape-general), now with the inaugural-draft + strip-Command
> + industry-init steps made explicit.

### 29.2 ★ Unsettled fork A — player-controlled SCOTUS (gap #52)

> **DESIGNED/RULED + UNSETTLED.** A player-controlled Supreme Court appeared "for the first time in
> years" (`ebrk`, POST 420) and triggered a multi-party design argument. This **re-enables player
> control that `pop` (batch 6) recorded the designer as having disabled** (`pop` POST 479-480) — so
> the corpus now has **two conflicting signals** on whether the court is player-touchable. The
> shipped court is fully abstract/CPU (no docket, no player input — `phaseRunners.ts:3397, 3648`).
> Sharpens [§22.7](#227-scotus-subsystem-253--282). (`dem1820#POST 420-443`; #52.)

**The canonical rule the table DID agree on** (the part that is *settled*):

| Aspect | Rule | Cite |
|---|---|---|
| **Votes** | **NOT player-decided** — each Justice votes by **vcczar's by-ideology voting chart**; **ties roll a die.** A player Justice does **not** vote individual cases. | POST 424 |
| **Delay** | **IS a player action** — the controlling player may **delay** a case. | POST 430 |
| **Dismiss** | **IS a player action, but ONLY for a case brought by a Gov Action** — never a historical case. | POST 430 |
| **Must hear ≥ 1** | The controlling party **cannot delay them all** — must hear at least one case. A majority-party-on-the-court always hears; **CPU only delays when it lacks the numbers.** | POST 430 |
| **Tie outcome** | A **tie affirms the lower court** and is flagged **ahistorical** if it diverges from the real ruling. | POST 442-443 |

Worked: **Worcester v. Georgia → NAY 5-1** (flagged "historical", lone dissenter Todd); **Charles
River Bridge → 3-3, no swaying succeeds → split affirms the lower court, randomly rolled AYE
(ahistorical)**.

**★ THE UNSETTLED FORK — who controls the court?**

| Model | Proponent | Position |
|---|---|---|
| **All-CPU by ideology** | `Ted` / `Matt` (default) + the shipped abstraction | The court votes itself; players never touch it (matches `pop`'s "designer disabled it"). |
| **Player-controllable with restrictions** | `ebrk` / `Lars` | A player-controlled court is *"how the game should be"* (POST 421-422). The delay/dismiss-only model above is the restriction set. |
| **Trait-gated middle** | `Vee` | Only **Integrity / Disharmonious / Predictable** justices auto-vote; **Controversial / Pliable / Lackey** let the player decide, gated by a **Manipulative leader** (POST 426) — an unbuilt design wish. |

> **★ FORK RESOLVED for the ALL-CPU case (`oopscpu#POST 184, 276, 291, 349`).** The all-CPU 1788 run
> ran the **whole court on CPU** and used the **"All-CPU by ideology"** model end-to-end:
> **Justices vote by ideology-distance**; a **Controversial nominee (Rutledge) failed committee → the
> Pres offered a replacement**; the CPU nominee = **highest-Judicial / own-faction Moderate**;
> **no CPU Justice voluntarily retires** and **the Pres cannot compel retirements** (no
> Iron-Fist/Manipulative president was on the board); **no cases fired in the era.** This **resolves
> the #52 player-vs-CPU fork *for the all-CPU case* only** — when no human controls a Justice, the
> court is CPU-by-ideology-distance ([§22.7](#227-scotus-subsystem-253--282), [§25.14](#2514-long-term-justice-ideology-drift-the-canonical-drift-rule),
> CJ-selection [§22.7.y](#227y--ted-ruled-cpu-chief-justice-selection-ladder-designer-authoritative-tedchange)).
> The **player-vs-CPU fork above remains user-gated for HUMAN games** — `oopscpu` did not settle who
> controls the court when a human player owns a Justice; it only confirmed the CPU path.

**System interactions:** the **delay/dismiss split couples the docket to Gov Actions** — a case
can only be *dismissed* if a **Gov Action** ([§11.3](#113-governors-actions-library-designed-not-built)) put
it there, so the gov-actions library and the SCOTUS docket are linked. SCOTUS rulings also
**deactivate now-unconstitutional laws** ([§22.7](#227-scotus-subsystem-253--282)) and feed
`partyPreference` — so the player's delay/dismiss choices ripple into legislation and elections.

### 29.3 ★ The meter→enthusiasm→election model — #51 RESOLVED (drums 4-step) + #18 RESOLVED (terror2000 → V's 2-layer model) (gap #18/#51)

> **★★ UPDATE (batch 15 `terror2000`): #18 IS NOW RESOLVED.** Ted (the designer, running the
> 2000-start) **initially moved enthusiasm by the meters, then REVERSED his own reading to V's
> 2022 canonical intent** and pinned the **2-layer meter→election model** (`terror2000#POST
> 913-926`, ch12). This **closes the long-open #18 state-scope sub-question** (the "every state
> unless penalized" / "ideology-leaning only" / "primaries only" three-way fork below): the
> answer is **two independent layers that compose** (full statement under "★ #18 RESOLVED"
> below). The **#51 reshuffle ALGORITHM (the 4-step faction-performance shift) is unchanged** —
> it still governs *how* the per-ideology enthusiasm boxes MOVE each Congress; V's 2-layer model
> governs *where the enthusiasm + meter bonus APPLIES at election time*. The two are orthogonal:
> **#51 = the box-movement algorithm; #18 = the election-application scorer.** This is the
> **canonical election scorer**. None of it is shipped beyond the bare `enthusiasm × 2` /
> `partyPreference × 5` / `baseLean × 5` per-candidate terms in `calcStateVote`
> (`phaseRunners.ts:3709`, [§15.1](#151-calcstatevote--the-core-resolver-phaserunnersts3685)).
> (`terror2000#POST 913-926`; `dem1820#POST 569, 575, 618`; `arkzag#POST 195–207`; #18/#51.)

> **UPDATE (batch 11 `arkzag`): the ALGORITHM half (#51) is settled.** Batch 11's final chunk
> published the canonical 4-step faction-performance → enthusiasm rule VERBATIM, matching the
> `drums` model exactly — so the **reshuffle algorithm (#51) is SETTLED to the `drums` 4-step
> model** (full rule in [§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved) and
> [§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy)).
> (`arkzag#POST 195–207`.)

**SETTLED (the algorithm, #51).** The per-Congress pipeline (now confirmed across `modern`, `drums`,
and `arkzag`):

1. **Non-enthusiasm meters MOVE the per-ideology enthusiasm boxes** — a meter effect worded "−1 for
   Progs/Libs" shifts Prog + Lib enthusiasm +1 toward Red each (upstream of §22.1's meter→election
   table).
2. **Legislation is scored by-card → by-faction; then the 4-step enthusiasm reshuffle fires**
   ([§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved)): MOST-points dominant
   faction +1 toward dominant; LEAST-points dominant −1 away; MOST-points opposition faction +1
   toward **dominant** (only if it actually GAINED points); LEAST-points opposition faction +2 toward
   **opposition** (even if it gained). The four shifts **stack**, computed per-ideology-card then
   aggregated by faction.
3. **Enthusiasm boxes then apply to the per-state vote** (a +3 Blue LW-Pop box adds +3 to Blue LW-Pop
   candidates) — gated by the #18 state-scope question below.
4. **HARD ±3 CAP on the ideology + party-pref bonuses** (state-specific bonuses **uncapped**) — the
   election-engine instance of the cross-era ±3 swing cap ([§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter)),
   plus a **±meter clamp** to avoid overflow (`arkzag` ch32 POST 155–177) and the standard
   **Lingering 10-step** meter movement (`arkzag` ch4 POST 360).

**Why batch 11 settles #51, not opens a new fork:** two GAs (Zagnut + Ark) on a third start year
**converged on the canonical `drums`/#51 reshuffle** — applied per-Congress on the legislation tally
— and explicitly did **not** adopt batch 10's Ted "every state unless penalized" or Matt "primaries
only" *variants of step 3*. Those variants survive only as the **#18 state-scope** question.

**★ #18 RESOLVED (`terror2000` → V's 2-layer model).** Ted reversed his own batch-10 "every state
unless penalized" reading and adopted **V/vcczar's 2022 canonical intent** as the official scorer
(`terror2000#POST 913-926`). The settled answer is **TWO independent layers that BOTH feed the
per-state vote and COMPOSE additively** (then run through the §29.10 ±3 cap):

| Layer | What it is | Scope (which states / candidates) | Source |
|---|---|---|---|
| **(a) Universal per-ideology METER modifier** | A **flat modifier per ideology**, derived from the **top meters**, applied to **BOTH parties' candidates of that ideology, in EVERY state, in PRIMARY AND GENERAL** | **Universal** — every state, both parties (the "unless penalized" caveat is GONE; it's flat-everywhere) | `terror2000#POST 913-926` |
| **(b) Per-party ENTHUSIASM bonus** | The **per-ideology enthusiasm box** (moved by the §29.10 4-step reshuffle, #51) — a **separate per-PARTY, per-state-bias** bonus | **Per-party** (a +3 Blue LW-Pop box helps only Blue LW-Pop candidates), layered **on top** of layer (a) | `terror2000#POST 913-926`; #51 |

**The concrete meter→ideology table (layer a)** Ted published (`terror2000#POST 913-926`):

| Top meter | Per-ideology modifier (applies to BOTH parties, every state) |
|---|---|
| **Revenue/Budget** (high) | **Lib +1 / Trad −1** |
| **Honest-Gov** (high) | **Corrupt incumbent +1; Integrity-vs-Controversial challenger +1; LW-Pop −2 / RW-Pop −2 / Prog −1** |
| **Quality of Life** (high) | **Cons +1 / Trad +1; LW-Pop −1 / Prog −1** |
| **Planet's Health** (high) | **RW-Pop +1 / Prog −1** |

**How they compose at the ballot:** for a given candidate in a given state, the per-candidate
election term = **layer (a) [universal meter modifier for that ideology, both parties]** + **layer
(b) [that party's enthusiasm box for that ideology, scaled by state bias]** + the shipped
`baseLean × 5` + `partyPreference × 5` + `pv × 0.1` terms (`calcStateVote`, `phaseRunners.ts:3709`),
then the **±3 cap** ([§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved)) on
the ideology + party-pref bonuses (state-specific bonuses uncapped).

**Why this resolves the fork:** layer (a) is the OLD "Ted: every state" idea — but **demoted from
the enthusiasm box to a separate flat meter modifier, and stripped of the "unless penalized"
caveat** (so it is genuinely universal). Layer (b) is V's "concentrate it per-party/per-leaning"
idea — but **kept as a distinct enthusiasm channel** rather than collapsed into the meter modifier.
Matt's "primaries only" reading is **rejected** (layer (a) explicitly applies in primary AND
general). The three batch-10 variants are no longer live; **the build implements both layers.**

> **The retired batch-10/11 fork (for provenance — now CLOSED by #18 RESOLVED above).** The three
> earlier models were: **(Ted, batch 10)** "every state unless penalized"; **(V/vcczar)**
> "ideology-leaning states only"; **(Matt, batch 10)** "primaries + leaning states only." Ted's
> 2-layer model above supersedes all three. (`terror2000#POST 913-926` SUPERSEDES `dem1820`
> POST 569/575/618 + `oopscpu` POST 205-214's recurrence of the open fork.)

### 29.4 GA appointment & eligibility rulings (Senate fill order, card distribution, replacement-gains)

> **DESIGNED/RULED** — a cluster of GA rulings that sharpen appointment/eligibility mechanics. None
> are shipped as stated (the engine's back-fill is the simple "highest relevant skill, same party"
> sort, e.g. `runPhase_2_8_2_CourtMgmt`). (`dem1820#POST 149-154, 215-227, 291, 309-347, 837, 859,
> 882`.)

**(a) ★ Senate appointment / vacancy-fill order (the mid-thread re-ruling, POST 859).** After a
long argument the GA **changed the appointment-eligibility rule mid-thread** to a strict priority
ladder:

1. **Your-party, NOT on a career track** →
2. **Your-party, on a career track** →
3. **Opposite-party, NOT on a career track** →
4. **Opposite-party, on a career track** →
5. **Generate a 1-skill politician.**

Plus hard constraints: **you CANNOT leave a full-term Senate seat vacant** (must fill it);
**you cannot pull a career-track pol if any non-CT pol of your party is eligible** (preserves the
strategic cost of career-tracking — and resolves the §29.1 CT-eligibility contradiction *in
practice* by making CT pols **pulled last within each party**, not barred); and **Senate appointees
must be 30+** (a 27-yr-old was rejected, POST 882). Distinct from the **sudden-vacancy fill order
(3.0.28, POST 837)** — death/retirement/appointment-out may leave a seat empty in *some* cases, but
the **normal Senate appointment is separate** and may not.

> **★★ #154 (NEW) — the canonical 4-step SUDDEN-VACANCY fill ladder (`terror2000#POST 470, 480`,
> from the 3.0 doc). RULED. DESIGNED, not built.** The clean order for a **suddenly-vacated ELECTED
> seat** (dead / resigned Governor, Senator, etc. — the "sudden-vacancy fill order" §29.4(a)'s
> closing line gestures at), with a **from-the-state constraint**:
>
> 1. **same-party career-track ("CongressTier"/exec-track) pol from that state** →
> 2. **same-party UNEMPLOYED pol** →
> 3. **OTHER-party career-track pol** →
> 4. **other-party unemployed pol.**
>
> **★ Reconciliation with the existing ladders — note the ORDERING DIFFERENCE:**
> - The **§29.4(a) `dem1820` Senate ladder** puts your-party **NON-CT *before* your-party CT**
>   (to preserve the strategic cost of career-tracking — CT pols pulled *last* within a party).
>   The **#154 ladder puts same-party CT *first*** (the career-track pol is the natural fill).
>   These are **two different conventions** for the same situation — the build must pick one.
> - `terror2000` flags step 2↔3 as the contested swap: the listed order is **same-party-unemployed
>   before other-party-CT**, but a common **house-rule VARIANT swaps them** ("blue-CT-over-red-
>   unemployed", `POST 480`) — i.e. fill with *any* same-party body before reaching across the aisle,
>   vs. prefer a competent other-party CT pol over an idle same-party one.
> - Distinct from the **cabinet-fill Admin ladder** (#73 / [§25.5.4](#2554-replacement-chain-after-failure) / OC-5) and the **CPU
>   governor menu** (DH-19) — those are appointment/cabinet fills, this is **elected-seat** vacancy.
> - Relates to the `oopscpu` ladders in [§30.5](#305-rulings-folded-from-oopscpu-ted-run-all-cpu-1788-stress-test) (#144 nomination trio; appointment-replacement #146d) —
>   #154 is the **elected-seat sudden-vacancy** case, NOT the routine Senate-appointment case (§29.4(a))
>   nor the cabinet case. **Likely the unified canonical ladder for elected-seat vacancies** once the
>   step-order convention (CT-first vs NON-CT-first; the 2↔3 swap) is settled by the designer.
>
> *(designed, not built — implement the 4-step elected-seat vacancy-fill ladder with the from-the-state
> constraint; **decide the two open orderings** (same-party CT vs NON-CT first; same-party-unemployed
> vs other-party-CT at step 2/3) against the §29.4(a) Senate ladder. Pairs with #25 / #61 succession /
> DH-19. Cite `terror2000#POST 469-476, 480`.)*

**(b) Card-distribution order-of-operations (the 3 dilemmas, POST 149-154 — refines #24).**

1. A card is **NOT distributed if no faction has ≥ 5 of the relevant experience** (e.g. **no
   Environment card in 1820** — nobody has the experience).
2. An **interest card conflicting with a faction's ideology** goes to the **non-conflicting**
   faction; if none qualifies, it is **not given**.
3. **Era minimums are MINIMUMS, not maximums** — but the **bordering-ideology rule is the "prime
   directive"**: give a 1-Trad faction the **Trad** card so it can *also* hold the required RW-Pop
   card (adjacency wins over the bare minimum). The full card-distribution algorithm lives at
   [§7.4](#74-forum-design-layer-the-card-distribution-algorithm-designed-not-built); this is the
   precedence among its rules.

**(c) Replacement-gains timing (POST 291).** **New replacements (including faction leaders) get NO
gains until they hold the post through the next appointment/election phase — EXCEPT military
positions, which are always eligible for gains on appointment.** (`Ted` revoked a Command point he
had wrongly given a mid-turn faction-leader replacement.) Interacts with leadership churn
([§8](#8-leadership-selection-22x), [§25.10](#2510-faction-leader-replacement--4-condition-removal))
— a defection/death that installs a replacement does **not** immediately grant that pol the office's
stat bonuses.

> **★ Ted-RULED — being replaced by APPOINTMENT costs NO points (`oopscpu#POST 105-108`).**
> Complementing the *gains* side above: on the *loss* side, an incumbent **replaced at an appointed
> post (or replaced by an appointment to a seat) loses NO points** — it is **not a "loss."** **Only
> electoral defeat costs points.** So the symmetry is: appointment **in** grants no gains until held
> through a phase (POST 291); appointment **out** costs no points (POST 105-108); only the ballot box
> moves the score. (Sharpens the §22.2 Score economy point-loss-on-defeat rule.)

**(d) Confirmation gating by trait (POST 309-347).** A **Controversial** senior general needs a
**full Senate vote** (no Majority Leader exists this era to waive it) — Gaines confirmed **26/48**
(needed 25). A **non-Controversial** general (Zachary Taylor) **auto-confirms**. Mirrors the
modern cabinet/SCOTUS trait-sway rules ([§9](#9-cabinet--military-appointments-23x),
[§25.5](#255-cabinet-confirmation--designer-acknowledged-bug-36-of-88-nominees-passed)).

**(e) Kingmaker rule (2.1.7, POST 117).** An **active Kingmaker must be ≥ 35 and NOT on a career
track**; **max one active Kingmaker per state**; **no age limit on protégés**. Sharpens
[§6.5](#65-217-kingmakers--protégés) / [§25.11](#2511-kingmaker--endorsement-preference-rules).

**(f) Faction-nickname "era exits" (POST 215-227).** A nickname **cannot be used once its exit-era
begins** — `Ted` uses handles for the forum but notes the constraint is *"true for the computer game
once programmed"* (POST 227), confirming the per-(party, era) nickname-table gate (#40) is a build
requirement.

**(g) PPT gains nothing (POST 159, 168, 172).** The **Senate Pro-Tem gets no traits, only 100 pts**
(because pre-Majority-Leader the PPT rotated). An incumbent Speaker/PPT can't be challenged unless
they fail prerequisites or a challenger's ideology enthusiasm drops below neutral.

### 29.5 The focus-Rep House abstraction (gap #55)

> **DESIGNED/RULED — the most contested ruling of the batch (vcczar weighed in directly).** The
> House is **abstracted**: only "focus Reps" exist. Recorded inline at
> [§22.10](#2210-53-state-alt-roster--modern-apportionment); the full ruling + the long-term fork
> are here. None of it is shipped (the engine has no House-seat model; "focus Rep" appears only in
> the designed modern apportionment). The 1822 midterm took **~10 forum pages / 8 real days** ("the
> congressional election from hell", POST 938) — pure A9 scaling-wall tedium. (`dem1820#POST 643,
> 665-696, 704, 733, 758`; #55/A9.)

| Rule | Detail | Cite |
|---|---|---|
| **Rep count per state** | **(EV − 2) / 5, rounded up.** Each focus Rep controls a roughly equal share of a state's hidden seats. | POST 643 |
| **Incumbency is seat-specific** | vcczar: focus Reps "should be viewed as **incumbents**" of a specific seat (POST 676). You keep the **+2 incumbency bonus only in your own seat/district.** | POST 676, 682, 696 |
| **Census-year exception** | In **census/redistricting years (1822, 1832, 1842…)** you may run in **any** seat and keep the bonus. A Rep whose focus-seat is **eliminated in redistricting keeps the bonus elsewhere.** | POST 682, 696 |
| **Census timing** | The decennial census changes House seats in the **following half-term** (1820-22), reflected in the **first election of the new decade (1822)**; EV/presidential impact lands at the **first year-ending-in-2 presidential election** (1810 census → 1812 pres; 1830 → 1832). | POST 683-686 |

**★ The unsettled long-term fork:** the per-thread ruling above is **seat-locked incumbency with a
census-year exception**, but vcczar's stated long-term wish is **full per-district simulation** —
*"every real US House district + 30,000 more pols"* eventually (POST 704), flagged out-of-scope for
now. The build picks: the abstracted (EV−2)/5 focus-Rep model, or full district simulation.

**System interactions:** rep count keys off **EV** ([§22.10](#2210-53-state-alt-roster--modern-apportionment)),
so the **census** (which reapportions EV) drives both rep count *and* the incumbency-bonus
exception window; the **(EV−2)/5** formula and per-seat biases are the unbuilt House-election surface
the A9 scaling wall demands the build **persist + auto-fill** across cycles.

### 29.6 Corroborations & the era slice (1820–23)

> **Mostly CORROBORATION from a 3rd start year (1820).** The 1820 start independently confirms a
> wide swath of the gap log — strongest where a finding now holds across **1772 / 1800 / 1820**
> start years. (`dem1820#POST` as cited.)

**Confirmed mechanics (existing IDs strengthened):**

| ID | Confirmation from the 1820 start | Cite |
|---|---|---|
| **#92 era-bands** | The game's own per-faction draft-ideology table prints **"Era of Democracy (1820-1840)"** then **"Manifest Destiny (1840-1856)"** — the same content-bands the 1772/1800/1948 saves emit. **3rd start-year corroboration** of the content-band model. | POST 946 |
| **#1 multiplayer + handover + CPU fallback** | Two mid-thread faction handovers (RingTheDink→Saucialiste; Euri CPU'd twice) — confirms factions are transferable + CPU is a true per-faction fallback. | POST 412-414, 591, 601 |
| **#76/#108 enthusiasm-gated party-flips** | RED→BLUE defections at boot (BLUE maxed across Mod/Cons/Trad/RW-Pop) — see [§29.1](#291--the-scenario-boot-procedure-as-practiced-gap-115) step 7. **Note 2.1.6 RAN here** (President is a leader at boot) where `rep1800` skipped it (no leaders at its boot) — the phase is gated on a leader existing. | POST 42, 72 |
| **#59 sectional-balance crisis** | Fired at **14 slave / 12 free** "ending the Era of Good Feelings" — earliest observation; folded into [§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine). | POST 521, 526 |
| **#44 popular-vote-surge event** | "Nationwide Surge in Popular Vote" — **every state except DE + SC** gets the popular vote (the end-state of the legislature-electors retirement, [§21.2](#212-per-state-presidential-election-method)/[§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle)); DE separately repealed "legislature selects President" by a **gov action** (POST 381). | POST 350, 381 |
| **#9 bill packaging** | All legislation passed via **6 bundled packages** (no crisis, booming budget). | POST 462-521 |
| **#101 office-creation-by-bill** | **Postmaster General → cabinet** by bill ([§24.6](#246-66-the-progressive-era-institutional-layer-offices-created-in-game-by-law)/[§26.5](#265-era-event-creates-office-bill-installs-a-new-cabinet-seat)). | POST 487 |
| **#61 legislatable succession order** | **Speaker → 3rd in line of succession** by bill ([§24.1](#241-61-succession--eligibility--the-acting-president-state)). | POST 487 |
| **#25b era-gated power roster** | Diplomacy roster is **4 powers: UK / France / Spain / Russia** (Prussia = "minister since 1797"; Germany doesn't exist yet) — players want a Prussia→Germany resigns-ambassador event at the Franco-Prussian War. | POST 528, 535-546 |
| **#20 gov-action library** | Era-flavored gov actions: force-Native-assimilation (×5, all failed), build state university, **property requirement for voting** (passed in IN → Mod/Cons/Trad +1 there), 4-yr Gov terms, build Political Machine, two-term Gov limits, anti-corruption, improve-industry, comply-with-Fugitive-Slave-Act (×2 because Plantation leads in LA). | POST 378-415 |

**Era content observed (the 1820-23 slice):**

- **Era events fired** (POST 350): **Caroline Affair** (Pres A/B/C → "condemn but not war"; UK
  relations −1); **Nationwide Surge in Popular Vote**; **Uruguay independence** (Brazil rivalry
  reduced); **Spain reconquest attempt**; **westward-migration EV shift** (NJ −1, NY −6, OH +2,
  PA −4 next census).
- **Deaths/events** (2.4): Van Buren dies (July 1821, 38); Justice Duvall dies; **Andrew Jackson
  dies (1822, 53)** just after being made B5's faction leader; **John Adams dies (July 4, 1821)** —
  pure alt-history personnel divergence.
- **Bills passed:** 8% tariff (down from 25%), **Indian Removal** ("remove the Five Civilized
  tribes by treaty or force"), Florida Territory, **Arkansas + Michigan statehood**, **Set SCOTUS
  to 9**, Postmaster→cabinet, Speaker→3rd-in-line, US Naval Academy, Standardize Military Manuals,
  Land Grants for the Great Plains. **Two-Year Presidential Term Amendment FAILED** in committee
  3-9 (POST 489).
- **Exec actions implemented:** "Civilizing" Natives + Strict Fugitive Slave Act; 3 new SCOTUS
  justices appointed (**AG appoints 2, President 1**) + confirmed (POST 521-ff).

**Bugs / data holes corroborated (point to `game-context.md`, not re-documented):**

- **★ Bill EV-effect sign bug (corroborates DH-53).** Several laws are worded **"Until passed, −1
  EV in each state"** instead of **"When passed, +1 EV"** — `Ted`: *"Nobody is checking laws that
  were NOT passed when calculating EVs… should have just been a simple 'when passed'."* The
  Native-American laws "punish EVs until passed" (the "Offer Land Grants" + Indian-Removal laws are
  concrete instances). **Per-bill EV/meter effect tables need an authored, sign-checked pass.**
  (POST 462-466; DH-53.)
- **★ Dataset demographic corruption (BUG class).** The shared "Master" tab rendered **every
  politician as Black, openly LGBT, several as women** ("James Monroe comes up as Black and gay")
  — root cause a **column mismatch from trimmed columns**; fixed by re-deriving with INDEX/MATCH.
  The build **owning the data model eliminates this entire class** (reinforces DH-36). (POST 104-125.)
- **Stale-territory data.** The Lingering tab pulled phantom "Alabama/Arkansas Territory" rows
  after those became states — stale-territory data not cleaned on statehood. (POST 522.)
- **Trait-conflict not flagged in boot data (corroborates DH-27).** The GA hand-built conditional
  formatting for **"3.0.34" trait conflicts** across all 10 sheets — the conflict check isn't
  native; boot/draft seed data slips conflicting traits through. **`TRAIT_CONFLICTS` must run at
  boot/import** (cross-ref [§26.1](#261-the-mid-government-boot-shape-general)). (POST 577, 596;
  DH-27.)
- **★ GA burnout killed the game (DH-36, 2nd in the KB after `afc6cbd7`).** `Ted` ended it at POST
  900 — *"these used to be a lot of fun to run and now it just feels argumentative."* Proximate
  cause: **player friction over undocumented/inconsistent rules** (strip-Command, House-incumbency,
  CT-eligibility flip) **compounded** by relentless manual bookkeeping (10-page elections, constant
  sheet repair). **The strongest cross-cutting case yet** that the build must own all bookkeeping
  *and* publish a deterministic, disclosed ruleset (incl. the #115 boot spec). (POST 900-905; DH-36.)

> **Cross-reference for the roadmap (batch-10 items, §29.1–29.6).** The concrete build items: **(1)
> the #115 scenario-boot spec** — `scenarioBoot(era, year)` encoding the inaugural live draft +
> career-track-seed-from-last-3-classes + the boot-Command decision + era-keyed industry init +
> Senate-class assignment/verifier + vacant-seat fill ([§29.1](#291--the-scenario-boot-procedure-as-practiced-gap-115));
> **(2) resolve the SCOTUS fork** — player-vs-CPU ([§29.2](#292--unsettled-fork-a--player-controlled-scotus-gap-52))
> (the meter→enthusiasm **algorithm** is now resolved — §29.3 / §29.10 — only the #18 **state-scope**
> sub-question remains); **(3) the focus-Rep House** ((EV−2)/5 + seat-locked incumbency vs full
> district sim, [§29.5](#295-the-focus-rep-house-abstraction-gap-55)); **(4) couple statehood
> admission to the sectional-balance crisis** ([§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine));
> **(5) the appointment-order ladder + replacement-gains timing + card-distribution precedence**
> ([§29.4](#294-ga-appointment--eligibility-rulings-senate-fill-order-card-distribution-replacement-gains));
> **(6) the bill EV-effect sign-check pass** (DH-53) and **boot-time validators** (DH-24 Senate-class,
> DH-27 trait-conflict). DH-36 (GA burnout) re-confirms: **own the bookkeeping + ship a disclosed,
> deterministic ruleset.** Gap context logged to `game-context.md` **#115**. **The batch-11 full-arc
> late-game systems (§29.7–29.11) — the economic engine #116, amendment lifecycle #119, succession
> chain #61, and the resolved #51 enthusiasm rule — are the load-bearing additions; see their own
> roadmap note at the end of [§29.11](#2911-batch-11-corroborations-the-full-arc-bugs--the-roadmap-hand-off).**

### 29.7 ★ NEW — the Bank-War → Independent-Treasury long-run economic engine (gap #116)

> **NEW this batch (`arkzag`, the headline late-game content batch 10 never reached). DESIGNED, not
> built.** A multi-cycle **economic-content state machine**: a recurring **Second-Bank CRISIS** bill
> that filibusters/returns and is ultimately **replaced by an Independent Treasury**, a near-literal
> **Force Bill** + tariff fights with a **tariff-change cooldown**, all coupled to the EconStab meter
> and a **Panic-of-1837 EconStab CRISIS**. The shipped engine has **none of it** — no Bank/Treasury/
> nullification tokens, no economic-arc state machine; `applyEffect` only nudges the 7 numeric meters
> ([§11.1](#111-251-lingering-meters--runphase_2_5_1_lingering-phaserunnersts3260)). This **extends**
> the §27.6 Second-Bank-as-toggleable-office finding (the recharter clock + Bank-War exec action)
> with the **long-run content arc** that office sits inside. (`arkzag` ch11/ch20/ch24/ch25/ch33;
> `game-context.md` #116. Historian: `historical-context-1820-democracy.md` §9, §11, §13.)

**The arc, in order (a recurring CRISIS-bill economic content engine):**

| Beat | Mechanic | Cite |
|---|---|---|
| **Bank as a recurring CRISIS bill** | "Establish Bank of the United States" is tagged a **CRISIS** bill ([§12.7](#127-forum-design-layer-crisis-bill-tag-designed-not-built)) that is **filibustered** (Puritan senators with ≥2 legislative delay the vote a full half-term, [§12.6](#126-forum-design-layer-filibuster-designed-not-built)), **returns next session** ("Returning from last half-term's filibuster…"), and eventually **passes the House 123-92**. | ch11 POST 26; ch20 POST 344; ch25 POST 66 |
| **Panic-of-1837 EconStab CRISIS** | **EconStab sits in a named CRISIS state** ("Panic"/Stagnation step of the named-ordinal Economic-Stability meter, [§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter)) across several half-terms; **meter-crater Evos** fire ("Economic Collapse of the United States", EconStab → 3) under Cheves/Lincoln. | ch17 POST 402; ch19 POST 2005; ch27 |
| **Independent Treasury REPLACES the Bank** | Under President **Dudley** (1840) an **Independent-Treasury CRISIS bill** passes (Senate 35-17), **Dudley signs it**, and it carries the literal effect **"Replaces Bank of the United States"** — with full meter/point effects (**Agriculture states +100, Finance states −100, ±RevBudget/EconStab/HonestGov rolls**). | ch33 POST 106 |
| **Force Bill (nullification analog)** | A near-literal **Force Bill**: *"Expand Presidential Power to Allow the President to Force States to Comply with Federal Revenue Laws"* (Sen Duncan) — an exec-power expansion bill in the marquee 1834 policy Congress. | ch24 POST 906/1107 |
| **★ Tariff-change COOLDOWN** | **Dueling tariff bills (40% vs 10%) are BLOCKED by a tariff-rate cooldown:** *"we can't change tariff rates until 1836."* A passed tariff **can't be re-touched for N cycles** — an era-keyed legislation gate echoing the real 1833 Compromise-Tariff timing. | ch24 POST 928 |

**System interactions (economic engine ↔ EconStab meter ↔ Panic crisis ↔ legislation):**

- The **Bank CRISIS bill ↔ EconStab meter** loop is the engine's spine: a low EconStab meter **enters
  the Panic CRISIS state**, which tags Bank/Treasury bills as **CRISIS bills** (stronger scoring,
  spending-cap bypass, [§12.7](#127-forum-design-layer-crisis-bill-tag-designed-not-built)); passing
  one **resolves the crisis** and applies the sectional ±100 (Agriculture vs Finance) meter package.
- The **tariff cooldown** is the economic-content instance of the general **bill change-cooldown**
  ([§12.9](#129-forum-design-layer-executive-branch-interference--bill-relationship-graph-modern-designed-not-built):
  *"can't propose what we just repealed unless a chamber changed"*) — here keyed to a **fixed era
  year (1836)** rather than a chamber-flip, i.e. an **era-gated legislation cadence** ([§21.6](#216-bill-typing--budget-gated-spending-cap),
  [§92 era-gating](#296-corroborations--the-era-slice-182023)).
- This arc **subsumes** §27.6's recharter-clock + "Remove Deposits" exec action: §27.6 is the
  *institution object* (the President-of-US-Bank seat + 20-year clock + Bank-War exec action), and
  §29.7 is the *content state machine* (CRISIS bill → filibuster → return → pass → later replaced)
  that drives it. **Open design question (`game-context.md` #116 / §29.11):** is the Bank→Treasury
  sequence a **scripted branch**, or **emergent** from recurring EconStab-crisis legislation? (The
  save played it as **emergent** recurring CRISIS bills resolving an EconStab crisis.)

*(designed, not built — a `game.economy` state machine: a recurring **Bank CRISIS bill** keyed to a
**Panic/EconStab CRISIS state** ([§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter),
[§22.1](#221-the-named-meter-bank--numeric-debt--crisiscascade)); a **`Bill.replaces` field** so the
Independent-Treasury bill marks "Replaces Bank of the United States" and removes the Bank
institution (§27.6); a **per-bill-class change cooldown** (`Bill.lockedUntilYear`) implementing the
tariff cadence; sectional ±100 (Agriculture/Finance) meter effects on resolution. Couples to §12.7
crisis bills, §12.6 filibuster, §27.6 Bank office, §21.6 budget/era gating.)*

### 29.8 ★ NEW — the constitutional-amendment lifecycle (propose → committee → floor → governor-ratify → active/blocking) (gap #119)

> **NEW this batch (`arkzag`). DESIGNED, not built.** Amendments are **first-class era content with a
> full lifecycle**, and an **active amendment can BLOCK a whole legislation-class**. The shipped
> engine has no amendment object at all ([§14.2](#142-forum-design-layer-constitutional-amendments-durable-state-designed-not-built),
> [§21.3](#213-amendments-as-durable-separately-ratified-state)). This **sharpens** the existing
> amendment-substrate findings (§21.3 ratification flow, §24.4 governor-ratify-by-3/4, the E5
> amendment design) with the **end-to-end lifecycle + the legislation-class-block** observed across a
> full played arc. (`arkzag` ch7/ch13/ch17/ch24/ch25/ch28/ch33; `game-context.md` #119. Cross-ref
> §52/#90 amendment-blocks-a-legislation-class.)

**The lifecycle (each step observed in play):**

1. **Propose** — an amendment is introduced as a **bill of an amendment type** (it goes through the
   normal proposal slots). **Amendments CANNOT be bundled** with ordinary bills (ch24 POST 1530) —
   distinct from the §12.5 bill-packaging rule for ordinary legislation.
2. **Committee** — reviewed in committee like any bill (the suffrage amendment cleared committee
   **12-0**, ch24 POST 1502).
3. **Floor** — a supermajority floor vote (the suffrage amendment passed the **House 163-52**, ch25
   POST 63).
4. **★ Governor-ratify** — goes to the states for a **governor vote** ([§24.4](#244-64-amendment-ratification-by-34-of-state-governors--era-keyed-then-tunable):
   ratification by governors at an era-keyed state count); pending → ratified (the VP-vacancy
   amendment "ratified by governors", ch17 POST 453/496).
5. **Active / blocking** — once ratified the amendment is a **durable rule-changing flag**
   ([§21.3](#213-amendments-as-durable-separately-ratified-state)); some amendments **block a class
   of legislation until repealed.**

**Era-content amendments observed (the load-bearing instances):**

| Amendment | Lifecycle role / durable effect | Cite |
|---|---|---|
| **VP-Vacancy ("13th") Amendment** | Lets the president nominate a new VP if one dies/resigns; **pending → ratified by governor vote**. **This is the rule invoked when Enoch Lincoln succeeds Cheves** (§29.9). | ch17 POST 453/496 |
| **National Suffrage for White Male Property Owners** | The Era-of-Democracy suffrage fight; committee 12-0 → House 163-52. **An era-flavored *restriction*** (narrower than existing suffrage), not an expansion — players flag it (ch25 POST 25). **The active suffrage amendment BLOCKS a legislation-class.** | ch24 POST 1502; ch25 POST 63 |
| **Abolish Slavery Amendment** (tagged **CRISIS**) | Recurs **every Congress** and **always FAILS** (e.g. **3-9**) — the real antebellum trajectory; the **perpetually-failing** amendment. Failure triggers the crisis-bill-failure scoring rule ([§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved) / [§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine)). | ch20, ch24, ch28, ch33 |
| **Abolish Federal Excise Tax** | A **law-class-block-until-repealed** amendment — **bans any federal excise tax until repealed** (corroborates the #52/#90 amendment-blocks-a-legislation-class pattern). | ch24 |
| **40-Year Minimum Age for SC Justices** | Corroborates the SCOTUS-min-age amendment (#52). | ch24 |
| **Christianity as Official Religion** | Recurs as a faction-flavored amendment (corroborates `fed`'s rejected-9-7 instance, [§21.3](#213-amendments-as-durable-separately-ratified-state)). | ch24 |

**System interactions (amendment lifecycle ↔ crisis engine ↔ legislation-class blocking):**

- **Amendment ↔ crisis engine:** the **Abolish-Slavery amendment is a CRISIS bill** ([§12.7](#127-forum-design-layer-crisis-bill-tag-designed-not-built))
  that perpetually fails — so its failure feeds the **crisis-bill-failure scoring rule** (−100 pts,
  waived → +1 enthusiasm if ideology-aligned, [§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved)),
  and the underlying **free/slave sectional-balance crisis** ([§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine))
  is the meter the amendment never resolves. The amendment lifecycle and the slavery-era crisis
  engine are thus **coupled at the Abolish-Slavery amendment.**
- **Amendment ↔ legislation-class blocking:** an **active amendment can BLOCK a whole legislation
  class until repealed** — the suffrage amendment blocks a class; the excise-tax-ban amendment bans
  a class. This is the **amendment-tier** of the §12.9 bill-relationship graph (bills removable only
  via amendment) made into a **proactive block** on *future* bills, not just a repeal constraint on
  existing ones.
- **Amendment ↔ succession:** the **VP-Vacancy ("13th") amendment is the precondition** for the
  §29.9 succession chain — without it ratified, a dead president's VP-successor **cannot fill the VP
  vacancy** (cf. [§21.3](#213-amendments-as-durable-separately-ratified-state): "a dead VP leaves
  the office vacant until the VP-vacancy-fill amendment is ratified").

*(designed, not built — a `game.amendments[]` object with an explicit **lifecycle state**
(`proposed → inCommittee → onFloor → pendingRatification → active`), a **governor-ratify** vote at
the gov phase (§24.4), an **un-bundleable** flag, and an **`active amendment → blocks legislation
class`** effect binding checked at proposal time (suffrage class, excise-tax class). Couples to §21.3
amendment substrate, §24.4 governor ratify, §12.7 crisis bills, §23.2 slavery crisis, §29.9
succession.)*

### 29.9 ★ EXTENDED — death/assassination → VP succession → acting-president, end-to-end (gap #61)

> **CORROBORATED + EXTENDED (`arkzag`). DESIGNED, not built** — a **strong end-to-end corroboration**
> of the existing **#61** ([§24.1](#241-61-succession--eligibility--the-acting-president-state)), not
> a new ID. Batch 11 plays the **entire chain on one president**: an assassination Evo **kills a
> sitting president**, the VP **succeeds under the "13th"/VP-vacancy amendment** and must nominate a
> new VP, and the successor becomes an **acting president** whose actions a trait can divert. The
> shipped engine has **only** an "assassination survived" anytime event + a Succession-History UI;
> there is **no death → succession → acting-state engine** (`runPhase_2_4_2_Anytime`,
> `phaseRunners.ts:2782`). (`arkzag` ch27 POST 270–507; `game-context.md` #61.)
>
> **★ SCOPE NOTE — SUPERSEDED for the clean-death case by Ted (`oopscpu#POST 327–329`).** The
> "acting-president + action-divert roll" read below is **designer-authoritatively narrowed**: a VP
> who inherits on a President's **DEATH** becomes the **FULL President — NOT "acting", with NO
> action-divert roll** (see [§24.1](#241-61-succession--eligibility--the-acting-president-state)).
> The acting-president / action-divert detail here is now **retained ONLY for the distinct
> incapacity / inert-0-Command / foreign-born-ineligible-substitute cases** — read the table below
> as the *incapacity* branch, not the death branch.

**The chain, end to end (President Cheves, ~1834–35):**

| Step | Mechanic | Cite |
|---|---|---|
| **Trigger — assassination kills the president** | An **"Assassination Attempt" Anytime-Evo** fires on the incumbent, resolved by a **survival roll**. **Cheves dies (2/50).** vcczar: **"first presidential assassination this run"** (a rare event). | ch27 POST 276 |
| **Succession — VP assumes the presidency** | **VP Enoch Lincoln assumes the presidency "in accordance with the 13th Amendment"** (the VP-vacancy/succession amendment, §29.8) and **must nominate a new VP** (filling the VP vacancy the amendment authorizes). | ch27 POST 276 |
| **Acting-president decision** ⚠ *(incapacity branch only — see scope note)* | On first assuming office, the successor *in the `arkzag` read* must decide whether to refuse to be acting President. **★ Ted-RULED:** on a clean **death** the inheritor **always becomes FULL President** (refuses "Acting"), so this decision step **only applies to incapacity / inert-substitute cases** (`oopscpu#POST 327`). | ch27 POST 441/454 |
| **★ Trait-divert (acting-president action divert)** ⚠ *(incapacity branch only)* | Because Lincoln has **Easily Overwhelmed**, **50% of the time the VP performs presidential actions in his stead.** Lincoln also **GAINS Easily Overwhelmed + Pliable**. **SCOPED:** this divert roll fires for an **incapacity-acting** president, **not** a death-inheritor full President. | ch27 POST 306/441 |
| **Meter-crater Evos fire** | The assassination/instability cascade fires meter-crater Evos — EconStab **"Economic Collapse"**, DomStab **"Govt Overthrown"** — coupling the succession beat to the economic crisis (§29.7). | ch27 |

**System interactions (assassination ↔ succession ↔ acting-president ↔ VP-vacancy ↔ meters):**

- The chain is **gated on the §29.8 amendment lifecycle**: succession invokes the **VP-Vacancy
  ("13th") amendment**, and the *fill-a-new-VP* step is only available **because that amendment is
  ratified.** No ratified amendment ⇒ the VP seat stays empty (the `hd` 1883 Matthews/Morton case,
  [§24.1](#241-61-succession--eligibility--the-acting-president-state)).
- The **acting-president state is trait-gated**: this run shows the **action-divert roll** specifically
  (Easily Overwhelmed → 50% of actions performed by the VP), distinct from the `hd` **0-Command acting
  president** who is fully inert ([§24.1](#241-61-succession--eligibility--the-acting-president-state)).
  Together they confirm the acting-president state is governed by **(a) Command (what an acting
  president *can* do) and (b) divert traits (whether the VP acts in his stead).**
- The succession also **couples to the economic engine (§29.7)**: the assassination cascade fires the
  EconStab/DomStab meter-crater Evos, so the **death → succession → acting-president** beat and the
  **Panic/EconStab CRISIS** are linked at the assassination event.

*(designed, not built — extends #61's spec ([§24.1](#241-61-succession--eligibility--the-acting-president-state)):
an **assassination/death Evo that can KILL the president** (not only "survived"); a **succession
engine** that promotes the VP and triggers the §29.8 **VP-vacancy fill** (gated on the amendment
being ratified); an **acting-president state** with an **action-divert roll** keyed to traits (Easily
Overwhelmed → 50% VP-acts) layered on the existing Command-gates-actions rule; and the
**trait-acquisition side-effect** (overwhelmed successor gains Easily Overwhelmed + Pliable). Couples
to §24.1, §29.8 amendment lifecycle, §29.7 economic engine.)*

### 29.10 ★★ The canonical 4-step enthusiasm-shift rule + crisis-bill-failure scoring (#51 RESOLVED)

> **★★ The single most valuable finding of batch 11. RULED (settled) — DESIGNED, not built.** The
> `arkzag` final chunk publishes the **legislation-scoring → enthusiasm** rule **VERBATIM**, and it
> **matches the `drums` model exactly** ([§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy)).
> This is therefore a **fork-RESOLUTION** of #51, not a new fork: the GAs here converged on the
> canonical `drums`/#51 model rather than batch 10's variants (§29.3). The shipped engine has only
> the bare `enthusiasm × 2` / `partyPreference × 5` terms in `calcStateVote`
> ([§15.1](#151-calcstatevote--the-core-resolver-phaserunnersts3685)). (`arkzag#POST 195–207`; #51.)

**The 4-step reshuffle (settled — fires per-Congress after bills are scored by-card → by-faction; the
four shifts STACK, and are computed by ideology-card then aggregated by faction):**

| # | Which faction | Enthusiasm move | Gate |
|---|---|---|---|
| 1 | Faction that gained the **MOST** points for the **dominant** party | its ideology cards **+1 toward the dominant party** | — |
| 2 | Faction that gained the **LEAST** points for the **dominant** party | **−1 away** from the dominant party | — |
| 3 | Faction that gained the **MOST** points for the **opposition** party | **+1 toward the DOMINANT party** ("the dominant party is taking care of the opposition faction's needs") | **only if it actually GAINED points** (not merely lost the least) |
| 4 | Faction that scored the **LEAST** points from the **opposition** party | **+2 toward the OPPOSITION party** ("furious at the incumbent") | applies **even if it gained points** |

- **"Dominant party" = the party that just gained more points** on the Congress's legislation tally;
  the other is the "opposition."
- Paired with the **±meter clamp** (meters clamp to avoid overflow, `arkzag` ch32 POST 155–177) and
  the standard **Lingering 10-step** meter movement (`arkzag` ch4 POST 360); the downstream
  per-state application carries the **hard ±3 cap** on ideology + party-pref bonuses (§29.3 step 4).
- **The #18 state-scope question is the only piece still open** — this model expresses shifts
  **per-ideology-card**; *which states* a card's enthusiasm then applies to is unresolved (§29.3).

**★ Crisis-bill-failure scoring (the −100 / waiver rule — CORROBORATED, refines #11):**

A **failed CRISIS bill scores −100 points**, **BUT the penalty is WAIVED if the bill conflicts with
the faction's ideology → instead that faction's enthusiasm shifts +1 toward its party** (`arkzag`
ch24 POST 1536; refines [§12.7](#127-forum-design-layer-crisis-bill-tag-designed-not-built) + #11).
Worked: the recurring **Abolish-Slavery CRISIS amendment** fails every Congress (§29.8) — a
pro-slavery faction's −100 is **waived** (the bill conflicts with its ideology) and instead it gets
**+1 enthusiasm**, while an antislavery faction eats the −100. Named CRISIS states are derived from
**meter thresholds** ([§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter)
named-ordinal meters: EconStab "Panic", HonestGov, DomStab), and the crisis-bill *bypass* (stronger
scoring + spending-cap skip) is the §12.7 rule.

**System interactions:** this scorer is the **hinge between legislation and elections** — bill scores
(incl. failed bills, [§12.8](#128-forum-design-layer-bill-scoring-sums-all-faction-cards-design-divergence))
→ the 4-step reshuffle → enthusiasm boxes → `enthusiasm × 2` in `calcStateVote`. It also couples to
the **crisis engines**: a failed **economic** CRISIS bill (§29.7) or a failed **Abolish-Slavery**
CRISIS amendment (§29.8/§23.2) routes through the **−100/waiver** rule, so the economic and
slavery-era crisis engines both feed enthusiasm via this scorer.

*(designed, not built — implement the 4-step reshuffle exactly as tabled (per-ideology-card,
aggregated by faction, stacking, with the step-3 "gained points" gate and step-4 "even if gained"
clause); the **−100 crisis-bill-failure penalty with the ideology-conflict waiver → +1 enthusiasm**;
wire both into the §22.2 Score economy + the §29.3 per-state application. Couples to §12.7/#11 crisis
bills, §23.2 slavery crisis, §29.7 economic engine.)*

### 29.11 Batch-11 corroborations (the full arc), bugs & the roadmap hand-off

> **Mostly CORROBORATION — strengthened by the SAME save run across a full 1822→1840 arc** (the
> strongest possible confirmation: one continuous campaign exercising every system many times). Plus
> two NEW shipped bugs and one NEW unsettled fork. (`arkzag#POST` as cited.)

**(a) ★ Convention + general-election machinery — CORROBORATED + sharpened (#13/#111, DH-57).** The
full multi-cycle presidential-election engine ([§15.3](#153-convention-machinery-292--full-forum-design-designed-not-built))
was exercised across the **1832 and 1840** conventions and confirms, with `arkzag` specifics:

| Mechanic | `arkzag` confirmation | Cite |
|---|---|---|
| **Brokered convention** | Each faction runs a **major candidate** (with a **nominator**; an **Orator** nominator gives a d6 momentum bonus) + minor/favorite-son candidates; multi-ballot. | ch21 POST 1717–1750 |
| **Command-gated convention actions** | A candidate with N command may take **N** of: force a rules change / offer a presidential promise / appeal to credibility / drop out (±endorsement). | ch21 POST 367/425 |
| **★ Presidential-promise buyouts decide a nomination** | **Cheves wins the 1832 D-R nomination on ballot 2 by buying endorsements** — **VP-for-Key, Sec-State-for-Clay** (offer-DOWN to candidates with **fewer** delegates, the §15.3.3 direction rule). | ch21 POST 444–488 |
| **★ Party-specific nomination thresholds** | **National-Republican convention needs 2/3 (436/649); Democratic-Republican needs 50%+1 (343/685)** — the historical 2/3 rule modeled **for one party only** (corroborates the asymmetric-threshold finding, DH-7). | ch32 POST 2465–2466 |
| **VP-selection scoring** | A **balance questionnaire** (digest counts it an **11-question** rubric; matches the §15.3.4 multi-check VP rubric — VP-from-another-faction? Mod/Cons/Lib on ticket? age gap? >50/<60? incumbent? can-be-independent/not-in-office? big+small state? different regions? VP obscure? → numeric VP score; **the lowest-scoring faction tends to get the VP**). *(Minor count variance vs the §15.3.4 10-check table — same rubric, treat the 10/11 difference as an enumeration variant, not a contradiction.)* | ch21 POST 1721 |
| **★ 8-stage general election** | **1st Pres Debate → 1st Action Phase → VP Debate → 2nd Pres Debate → 2nd Action Phase → 3rd Pres Debate → October Surprise → Election Day** (some unlocked by era/traits). **Action Phase:** send the **VP or faction leader** to *give a speech* (any state) or *shore up support* (surrogate's home region); each rolls a **d6** for ±1. **The presidential candidate CANNOT campaign in person until the Primary Era** ("campaigning as nominee was socially forbidden"); an incumbent may *Use the Incumbent Power of the Office*. **Scandal roll** each phase is **skipped for Integrity** pols, only bites a **Controversial** candidate. **Per-state result = d6 vs d6**, majority EV = president-elect; **loser of the presidency takes −1 on all future presidential bids.** | ch7 POST 584–606; ch15 POST 1232 |
| **Platform scoring** | **5 planks** (Economic/Domestic/Judicial/Foreign-military/**a Presidential pledge**), tallied **by-card → by-faction → by-party**, then the **3 yes/no questions** set Party Pref ±1 (§15.3.5). | ch7 POST 548; ch21 POST 1750; ch33 POST 2530 |
| **Per-cycle convention venues** | Conventions are **hosted in a named city per cycle** (1840: **Albany NY** / **Winston-Salem NC**). | ch32 POST 2462 |

**(b) ★ NEW UNSETTLED FORK — delegate-class assignment (AI-allocator vs player-rigged).** Distinct
from the now-resolved #51, a **new fork** opened on **who sets convention delegate classes**:

| Model | Proponent | Position |
|---|---|---|
| **AI-auto allocation** | **Zagnut** (house rule, ch3 POST 276–289) | Replace the human-governor "set delegate categories" step with **AI assignment** ("eliminates self-dealing… and saves time"), publishing the full **5-category EV×1…×4 formula** (Cat 1 = EV×1, Cat 2 = ×2, Cat 3 = ×3, Cat 4 = ×4, Cat 5 = ×3, with party-pref modifiers). |
| **Player-rigged (intended)** | **Ted** (ch3 POST 286) | **Delegate-rigging is *intended* design** — insiders rigging the convention is the point (corroborates the §15.3 host-Governor "the convention was rigged in my favor as I set the delegates" advantage). |

**Practice did NOT converge:** the **1840 convention reverted to human-set delegate classes** (ch32
POST 2466). **The build must pick one** (`game-context.md` §8 open Q). This is the convention-host
analog of the §29.2/§29.3 forks — record it as **unsettled**, separate from the resolved #51.

**(c) Other corroborations (existing IDs strengthened from the full arc):**

| ID | `arkzag` confirmation | Cite |
|---|---|---|
| **#44 per-state EC method** | **DE + SC still choose electors by LEGISLATURE** in the 1828 presidential election (era-keyed elector-appointment method persisting, [§21.2](#212-per-state-presidential-election-method)). | ch15 POST 1425 |
| **#85 death/retire rate** | **3% retirement + 2% death per faction** per half-term + era modifiers — **itemizes** batch 10's "5%/half-term" into the 3+2 split. | ch4 POST 313/319 |
| **#10 filibuster** | **Puritan senators with ≥2 legislative** may filibuster, delaying a vote a full half-term (the Bank bill recurs through this, §29.7). | ch11 POST 26 |
| **#54 investigations** | Fire during Congress-in-Session (2.6) against an officeholder who gained **Controversial in the SAME half-term** (not a prior one). | ch2 POST 192 |
| **#25 cabinet rules** | ≥2 Admin, ≥1 relevant expertise; **≥1 secretary from each of NE / Mid-Atlantic / Deep South / Upper South / Midwest** or a **50% chance of −1 DomStab** (the 5-region model); **≤1 cross-party in the top four**, **≤3 cross-party total**; **up to 5 retained** across administrations. | ch3 POST 267; ch16 POST 1412; ch23 POST 1028 |
| **#52 SCOTUS** | By-ideology docket continues: **US v. Amistad** ("ahistorical −50 Human Rights"), **Barron v. Baltimore**, **The Antelope Case**; SCOTUS-min-age amendment (§29.8). **Docket runs dry** — the GA had to **invent** the Amistad case (a content-supply gap). | ch5 POST 394; ch13 POST 71; ch32 |
| **#59 sectional balance** | Recurring **Abolish-Slavery CRISIS amendments always fail** — the antebellum trajectory continuing from the 1820 start ([§23.2](#232-59-freeslave-sectional-balance-crisis-scoring-the-slavery-era-crisis-engine), §29.8). | ch20/24/28/33 |
| **#1 multiplayer + CPU + transfer** | Mass CPU-conversion mid-run (BlockCPU/ConsECPU/KevinCPU/LarsCPU/VicxCPU; @ebrk85 takes over a Red faction) — **CPU is a true per-faction fallback** + factions are transferable. | POST 2, 14 |
| **#40 per-(party,era) nicknames** | RED **fragments into ~6 micro-factions** by 1832 (National Republicans, Carroll/Prentiss/Comegys Republicans, Adams/Arch-Federalists) — all under the **frozen "Federalist/National-Republican" RED label**; party-leader elections recur each cycle (Marshall 1822 → Scott 1828 → 1832 contenders). | ch16; ch22 |
| **#101 era-gated office creation** | **Minister to Japan** creatable by exec action **only in the Manifest-Destiny era**; military-academy / state-university only in later eras. | ch4 POST 359; ch5 |
| **Leadership eligibility (#51-adjacent)** | The verbatim **faction-leader eligibility cascade** + omission-fallback order (ch3 POST 229/233); **an elected President auto-leads his faction**; **incumbent-challenge gate** = can't challenge a same-party incumbent leader unless he fails prerequisites OR the challenger faction's ideology enthusiasm drops below neutral (ch2 POST 137). | ch2/ch3 |

**(d) ★ NEW shipped bugs (build-relevant):**

- **★ DH-59 — foreign-relations meter UNDER-FLOORS below its minimum.** *"Japan: 1 → 0 (↓ -1) #
  Error, should be 1 minimum lmao"* (`arkzag` ch9 POST 1259) — a **missing clamp**: a relations
  meter is allowed to fall **below the documented floor of 1** (the named-ordinal meters of
  [§21.8](#218-named-ordinal-meter-model--3-swing-cap--war-score-meter) / per-power relations
  [§13.3.1](#1331-per-power-relations-meters--an-era-dependent-power-roster) have a floor that isn't
  enforced). → **NEW BUG: clamp relations/meters to their floor.**
- **★ DH-60 — era-events fire with NO territory/asset prerequisite.** *"Force Open Trade with
  Japan"* fires with **no Pacific port**; *"Stubborn Cherokee"* fires **without owning the relevant
  territory** (`arkzag` ch4 POST 335/337/340). This is the **concrete face of #92's territory-content
  gating** (and BUG-1): the **era-Evo deck is not territory/asset-gated**. → **NEW BUG: add a
  per-event territory/asset prerequisite check** ([§10.3](#103-243-era-events--runphase_2_4_3_era-phaserunnersts2796),
  [§10.4](#104-forum-design-layer-for-era-events-designed-not-built)).
- **DH-53 (corroborated):** the "until passed −1 EV" vs "when passed +1 EV" bill-effect mis-signing
  persists in the shared sheet (several land/Indian bills still carry punish-until-passed wording).

**(e) Design-friction notes (point to `game-context.md`, not re-documented):** the relentless manual
upkeep drove an **aggressive automation push** (Zagnut/Ark script deaths/retirements, conventions,
delegate classes — DH-36 class, but **no GA-burnout collapse this time** because they scripted around
it); **heavy player attrition** (most factions CPU'd by ~1832 — reinforces the **solo-vs-CPU build**
as the natural shape, #114); a **party-flipper TRADE house-rule** design wish (trade one "can party
flip" pol per half-term; loser gains Flip-Flopper — **not in the build**, a candidate mechanic); and
**career-track replacement-eligibility still ad hoc** (DH-25, when Benton's Senate seat opened on
winning the presidency).

> **★ Roadmap hand-off — the load-bearing batch-11 build items (for the tech-lead / roadmap-planner).**
> The full-arc late-game systems are the batch's load-bearing additions, in priority order:
> 1. **#116 — the Bank-War → Independent-Treasury economic engine** ([§29.7](#297--new--the-bank-war--independent-treasury-long-run-economic-engine-gap-116)):
>    a recurring Bank CRISIS bill ↔ Panic/EconStab CRISIS state ↔ Independent-Treasury **`Bill.replaces`**
>    resolution, plus a **per-bill-class tariff cooldown** (`lockedUntilYear`). Extends §27.6.
> 2. **#119 — the constitutional-amendment lifecycle** ([§29.8](#298--new--the-constitutional-amendment-lifecycle-propose--committee--floor--governor-ratify--activeblocking-gap-119)):
>    `proposed → committee → floor → governor-ratify → active`, **un-bundleable**, with an **active
>    amendment → blocks-a-legislation-class** effect. Sharpens §21.3/§24.4.
> 3. **#61 — the death/assassination → succession → acting-president chain** ([§29.9](#299--extended--deathassassination--vp-succession--acting-president-end-to-end-gap-61)):
>    an Evo that **kills** the president, a succession engine that **fills the VP vacancy** (gated on
>    the §29.8 amendment), and an **acting-president action-divert roll** (Easily Overwhelmed → 50%).
>    Extends §24.1.
> 4. **#51 RESOLVED** — implement the [§29.10](#2910--the-canonical-4-step-enthusiasm-shift-rule--crisis-bill-failure-scoring-51-resolved)
>    **4-step enthusiasm reshuffle** + the **−100/waiver crisis-bill-failure** rule; **only the #18
>    state-scope** sub-question remains a human call (§29.3).
> 5. **Convention machinery** — the §15.3 engine + **party-specific thresholds (2/3 vs 50%+1)**,
>    **presidential-promise buyouts**, **VP-scoring rubric**, **8-stage general** are now multi-campaign
>    confirmed (§29.11a); **resolve the NEW delegate-class fork** (AI-allocator vs player-rigged, §29.11b).
> 6. **Two NEW bug fixes:** **DH-59** (clamp relations/meters to floor) and **DH-60** (territory/asset
>    prerequisite on era events). New gap context logged to `game-context.md` **#116/#119** (+ DH-59/60).

---

## 30. Designer ruling index (`tedchange` — AUTHORITATIVE)

> **★★ Highest-authority rules channel in the corpus.** This section indexes the canonical
> Ted-RULED rule patches from the **"Discussion: Ted's Change Log of Doom"** thread (forum slug
> `a0f0bf04`, Sept 2024 → Oct 2025 — the designer's official rules-doc rewrite/cleanup pass).
> Cross-references where each ruling was folded into the topical section above. **Authority
> hierarchy:** Ted (`tedchange` + `smallbugs` rules-doc patches) > playtest GA rulings > inference.
>
> **Companion thread (`smallbugs` = `cf82a7d3`)** carries vcczar's spot rulings nested in the
> bug catalog. **Same authority class.** Indexed here for cross-reference.
>
> **Companion thread (`oopscpu` = `699113d6`, the all-CPU 1788 CPU stress-test)** is **Ted-run**,
> so its GA rulings **carry Ted's designer authority** (same hierarchy as `tedchange`). It RULED
> the post-election Command decay (#143), the VP-inheritance-is-full-Presidency succession rule
> (folded into §24.1), the pre-12A nomination trio + same-state-EV rule (#144), and a procedural
> rulings list (#145, #146 + the list). Indexed in **§30.5** below; the **CPU-handler sub-gaps it
> surfaced (OC-1…OC-8)** are folded into the §25 handler sections (cross-referenced in §30.5).
>
> **Companion thread (`terror2000` = `3843da2d`, the first-native 2000-start modern campaign)** is
> **Ted-run** ⇒ **designer-authoritative** (same hierarchy). It RESOLVED **#18** (the meter→election
> scorer → V's 2-layer model), RE-TUNED **#124** LIVE (the 3-state cabinet→enthusiasm model), and
> RULED four NEW rules — **#151** (cabinet appointment-fairness penalty), **#152** (war-defeat
> resolution + multi-phase wars), **#153** (0-Command rookies + doubled gain + no-reroll expertise),
> **#154** (sudden-vacancy fill ladder) — plus produced the **first proven game-over (#88, the
> Autocratic Coup)**. Indexed in **§30.6** below.

### 30.1 Rulings folded into existing topical sections

Each ruling has been folded into its topical home section (with `★ Ted-RULED` subheaders).
This index is a fast-lookup table back to those folds.

| # | Topic | Ruling | Folded into | `tedchange` POSTs |
|---|---|---|---|---|
| **#124** | **Cabinet → enthusiasm REWORK** | RULED in concept (lobby gives points, ideology composition drives enthusiasm). Percentages OPEN. | [§9.3.7](#937--ted-ruled-cabinet--enthusiasm-rework-designer-authoritative-tedchange) | 1-4 |
| **#125** | Universal Election Modifier (UEM) | **OPEN — proposed but not finalized** | [§30.2 open items](#302-designer-decision-gated-open-items-tedchange) | 222-241 |
| **★ #126** | **Pres 2-step Admin-then-Command blunder rule** | RULED — canonical 5-tier wording | [§14.1.y](#141y--ted-ruled-pres-implementation--2-step-admin-then-command-blunder-rule-designer-authoritative-tedchange) | 159-164 |
| **#127** | Ideology shift / conversion rate schedule | RULED — 25% LW↔RW cross-circle + Two-Faced; 33% party-flip; same-party adjacency | [§6.3.y](#63y--ted-ruled-ideology-shift-schedule-designer-authoritative-tedchange) + [§6.4.y](#64y--ted-ruled-conversion-rate-schedule-designer-authoritative-tedchange) + [§27.7](#277-the-ideology-chart-becomes-a-circle-mid-era-rule-change) | 18-31, 34-39, 38, 51-53 |
| **★ #128** | **Kingmaker / Master Kingmaker scope** | RULED — Master = +1 in EVERY state (NOT either-or). **SUPERSEDES** Matt's reading. | [§6.5.y](#65y--ted-ruled-kingmaker-scope--trait-inheritance-allowlist-designer-authoritative-tedchange) | 316 |
| **#129** | Kingmaker → Protégé trait allowlist/blocklist | RULED | [§6.5.y](#65y--ted-ruled-kingmaker-scope--trait-inheritance-allowlist-designer-authoritative-tedchange) | 201-208, 279-283 |
| **★ #130** | **Retirement + death schedule** | RULED — Hale=½, Frail-first, ex-Pres death-only, 5% rate, era-scaled | [§10.1.y](#101y--ted-ruled-death--retirement-schedule-designer-authoritative-tedchange) | 89-100, 137-148, 195-197, 396 |
| **#131** | Integrity pol cannot nominate Controversial | RULED | [§9.3.8](#938--ted-ruled-nomination-filters-designer-authoritative-tedchange) | 276-278 |
| **#132** | Challenge-Legislation cannot target REPEAL | RULED | [§11.3.y](#113y--ted-ruled-gov-action-challenge-legislation-restrictions-designer-authoritative-tedchange--smallbugs) | 246-248 |
| **★ #133** | **1st / 2nd CC composition** | RULED — Big states (PA/MA/VA/MD) 4 / Medium 3 / Small (GA/RI/DE/NH) 2; appointment rule transitions on DoI | [§17.1.y](#171y--ted-ruled-1st--2nd-cc-composition--appointment-designer-authoritative-tedchange) | 211, 217-236, 277, 352-355 |
| **★ #134** | **Lingering 7-step strict ordering + decay carry-forward** | RULED — steps 1→7 in order, never re-done; volatility = this-phase-only; tax/tariff decay propagates to next phase's step 3 | [§11.1.y](#111y--ted-ruled-lingering-7-step-strict-ordering-designer-authoritative-tedchange) | 397-408 |
| **#135** | 50/50 House split → leadership to non-Senate-majority party | RULED — inverse-control rule | [§24.2](#242-62-contingent-house-election--tied-chamber-inverse-control) | 65 |
| **#136** | Random skill on draft has NO Command chance | RULED | [§4.1.y](#41y--ted-ruled-draft-rules-designer-authoritative-tedchange) | 7, 47 |
| **#137** | No cross-party draft (politicians always enter at IRL party) | RULED | [§4.1.y](#41y--ted-ruled-draft-rules-designer-authoritative-tedchange) | 8, 10, 48 |
| **★ #138** | **3 random traits + 3 random alt-states per draft** (SUPERSEDES 5/5) | RULED | [§4.1.y](#41y--ted-ruled-draft-rules-designer-authoritative-tedchange) + [§24.8](#248-69-draft-rookie-grants-re-ruled--3-traits--3-alt-states) | 50 |
| **#139** | Pres signature step lives in 2.6 (NOT 2.10) | RULED | [§12.3.y](#123y--ted-ruled-pres-signature-step-location--cpu-signveto-rule-designer-authoritative-tedchange--smallbugs) | 124-126 |
| **#140** | AnytimeEvo target pool tightening | RULED — events 5/17/23/24/25/39/66/117/118/119 restricted to Rep/Sen/Gov/Cabinet; Assassination 50/25/25 | [§10.2.y](#102y--ted-ruled-anytimeevo-target-pool-tightening-designer-authoritative-tedchange) | 249-275 |
| **#141** | First-time FL: 5% positive trait / 3% negative trait gain | RULED | (referenced inline in §8.5.x; per-cycle for positives, first-time-as-FL only for negatives) | 79 |
| **★ #142** | **CPU Chief Justice selection ladder** | RULED — Judicial → own faction → Pres-ideology match → lowest-scoring faction → matching-appointer-ideology → random | [§22.7.y](#227y--ted-ruled-cpu-chief-justice-selection-ladder-designer-authoritative-tedchange) | 387-390 |

### 30.2 Designer-decision-gated open items (`tedchange`)

> **These items Ted floated but did not finalize in the `tedchange` thread.** Each is a
> **LIVE design hole** — distinct from the user's review-gate-gated items. Listed for the
> roadmap-planner. *Carried from `tedchange` digest §6.*

1. **Mil-Prep meter level 4 fix** — Ted said "I'll check what I did" then "wasn't better"
   (POST 290-301). Community has three proposals: **30/40/30** (Umbrella POST 322 +
   `smallbugs#POST 579`); **30/60/10** (Eric POST 297); **40/50/10** (Nikk POST 300). **NOT
   RESOLVED.** Both `tedchange` and `smallbugs` have the bug logged but neither closes it.
2. **Universal Election Modifier (UEM)** — proposed by Ted (POST 222-241) as a common
   `+1/-1` modifier table for ALL elections at all levels in all eras. **Community pushback
   on stacking + age modifiers.** Ted didn't finalize. **Major design proposal — build should
   NOT pre-implement until finalized.**
3. **Crisis trait consolidation** — Ted proposed merging Crisis Manager / Crisis Admin /
   Crisis Gov into a single Crisis Manager trait, or a 2-tier Manager + Master ladder
   (POST 73, 77-87). vcczar "will consider"; **OPEN tending toward consolidation.**
4. **Term-limit Gov actions in pre-Senate era** — Umbrella reported CPU running a term-limit
   Gov action in 1818 → state ran out of candidates (POST 356-367). Two paths flagged:
   (a) **void Senator requirement** (Eric: 2.5.2 already has the conditional language); or
   (b) **move term-limit actions to Era of Federalism start** (Ark). Ted didn't rule.
5. **Faithless-elector mechanic rewording** — community agrees the current rule is "wonky"
   (POST 371-376). Ted didn't post a final wording. Faithless-elector rule remains as-is.
6. **Party rename trigger — PL vs Era Evo** — Matt proposed Party Leaders rename parties
   (like factions get nicknames, POST 391-395); Ark hashed in a separate thread; **Ted did
   not adopt.** ERA EVOS continue as the rename trigger. (Cross-ref [§25.13 Whig→Conservative
   rename](#2513-faction-rename-rule--whig-auto-rename-to-conservative-party-deterministic).)
7. **VP-must-be-same-party on resignation** — Vee01 proposed relaxation (POST 362). **No
   follow-up.** Currently same-party-only is enforced.
8. **Cabinet enthusiasm percentages** — ~~Ted's rework (#124) is **RULED in concept**; the
   actual numbers (Big-4 33% / others 25% etc., POST 4) are **TBD**.~~ **MOSTLY RESOLVED by
   `terror2000` (batch 15):** Ted RE-TUNED the enthusiasm channel LIVE to the **3-state
   upset/fine/happy model** — per-faction count of satisfied wants → fine(0) / happy(+1 @20%/10%) /
   upset(−1 @20%/10%), one roll/faction, same-ideology factions stack, ±3 cap ([§9.3.7](#937--ted-ruled-cabinet--enthusiasm-rework-designer-authoritative-tedchange),
   `terror2000#POST 486-489`). **The only residue** is whether the 20%/10% split maps to a Big-4-vs-
   rest-of-cabinet weighting (item 9 below).
9. **Cabinet ideology weighting — Big-4 vs rest vs cabinet-level** — Ted flagged but didn't
   finalize whether the three tiers get distinct ideology-enthusiasm weights (POST 1-4). (Now the
   *only* open piece of #124 after the `terror2000` 3-state re-tune resolves the channel shape; the
   20%/10% roll split in §9.3.7 may BE this weighting.)

### 30.3 Rulings folded from `smallbugs` (vcczar spot rulings)

The `smallbugs` thread (`cf82a7d3`) carries vcczar's case-by-case rulings in the bug
catalog. Same authority class as `tedchange` (both are designer-authoritative). Folded:

| Topic | Ruling | Folded into | `smallbugs` POSTs |
|---|---|---|---|
| **★ Relocation cap = 4** | **SETTLED 12-30-25**, vcczar approved | [§6.2.x](#62x-forum-design-layer-designed-not-built) + [§19.1 #9](#191-design-divergences-for-the-roadmap) | 734-735 |
| **★ Amendments NOT SCOTUS-challengeable** | RULED — rules doc updated; **CONFLICTS with `tea1772` #100** | [§11.3.y](#113y--ted-ruled-gov-action-challenge-legislation-restrictions-designer-authoritative-tedchange--smallbugs) + [§21.3 conflict flag](#213-amendments-as-durable-separately-ratified-state) | 236-269 |
| **No drafting from unorganized territories** | RULED — except ME (part of MA) + WV (part of VA) | [§4 Draft pool sourcing](#4-draft-211) | 259-267 |
| **Forbidden industries (MD/NJ Mining, PR Maritime, Plantation N states)** | RULED INTENTIONAL — *"good reasons for game purposes"* — NOT a bug | [§11.4](#114-state-level-policy-flags-designed-not-built) | 412-417 |
| **Regions map** | RULED INTENTIONAL — *"states need to stay in the regions I have them in"* — NOT a bug | [§22.10 / §11.4](#2210-53-state-alt-roster--modern-apportionment) | 117, 714-728 |
| **CPU President sign/veto rule** | RULED — signs if any faction in his party scores AND party total isn't negative | [§12.3.y](#123y--ted-ruled-pres-signature-step-location--cpu-signveto-rule-designer-authoritative-tedchange--smallbugs) | 417-423 |
| **House-cap to 100 Reps removal** | RULED — *"broken with 50 states; I'll have Anthony delete it"* | [§22.10](#2210-53-state-alt-roster--modern-apportionment) | 138-143 |
| **Isolationist Lobby criteria** | RULED — must have LW Pop / Prog / Trad / RW Pop; cannot join Expansionists / Moderates / Globalists | [§7.4.1](#741-era-gated-multi-pool-card-library-designed-not-built) | 40-42, 310-325 |
| **Statehood bills SCOTUS challenge** | RULED disallowed (per Orange POST 240) | [§11.3.y](#113y--ted-ruled-gov-action-challenge-legislation-restrictions-designer-authoritative-tedchange--smallbugs) | 240, 250-269 |
| **Reconstruction subtype** | RULED — all such bills should carry subtype="Reconstruction" | [§23.4](#234-57-reconstruction-readmission-subsystem-end-nationalism--gilded) | 688-693 |
| **Death/retirement rate** | Orange's 5%-of-faction-max formula → Ted accepted (corroborates §10.1.y) | [§10.1.y](#101y--ted-ruled-death--retirement-schedule-designer-authoritative-tedchange) | 195-197 |

### 30.5 Rulings folded from `oopscpu` (Ted-run all-CPU 1788 stress-test)

> **Ted-run ⇒ designer-authoritative** (same authority class as `tedchange`). The `oopscpu`
> (`699113d6`) all-CPU 1788 run RULED the rules below and surfaced the **CPU-handler sub-gaps
> OC-1…OC-8** (folded into the §25 handlers + their topical homes). Cite `oopscpu#POST n`.

**Marquee + procedural rulings (RULED):**

| # | Topic | Ruling | Folded into | `oopscpu` POSTs |
|---|---|---|---|---|
| **★ #143** | **Post-election Command decay** | RULED — any pol who did NOT run for **Pres or VP** has a **40% chance of −1 Command** per Presidential cycle ("shit or get off the pot") | [§14.1.z](#141z--ted-ruled-post-election-command-decay--shit-or-get-off-the-pot-designer-authoritative-oopscpu) + [§3.1](#31-the-four-character-axes) | 1, 224 |
| **★ #61★** | **VP-inheritance-on-DEATH = FULL Presidency** | RULED — inheritor becomes **full President, NOT "acting", NOT auto party/faction leader** (party re-runs leadership IRV). **SUPERSEDES** the `arkzag` "acting/action-divert" read for the death case (scoped to incapacity only) | [§24.1](#241-61-succession--eligibility--the-acting-president-state) + [§29.9 scope note](#299--extended--deathassassination--vp-succession--acting-president-end-to-end-gap-61) | 324-329 |
| **★ #144** | **Pre-12A CPU nomination trio + same-state-EV** | RULED (pre-12A only) — (a) incumbent Pres re-nominates incumbent VP if eligible (**VP retention**); (b) nominate an alternate when none exists (anti-tie); (c) own-faction priority; + two same-state candidates can't both take that state's EVs | [§25.1](#251-candidate-selection-open-seats-primaries-conventions--the-7525-rule) + [§25.2](#252-vp-selection--retention-rule-ruled-was-designer-acknowledged-bug) + [§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle) | 192-194, 197 |
| **★ #145** | **CPU governor "help allies" → term-config actions** | RULED — same-party state → lengthen/remove-limit; opposite → shorten/add-limit (OC-7) | [§11.3.z](#113z--oc-7--cpu-help-allies-gov-rule-includes-governor-term-config-actions-ruled-oopscpu) | 264, 275, 941 |
| **#146a** | **Strip over-cap crisis/spending bills BEFORE House vote** | RULED — removed pre-vote so they can't be packaged into a surviving bill; cap = 1 crisis (min Rev/Budget) / ≤2 non-crisis spending (Overspending) | [§21.6](#216-bill-typing--budget-gated-spending-cap) | 86, 277 |
| **#146b** | **Debt-table = single-meter roll** | RULED — roll which meter the debt level may hit, then roll whether it hits (ONE meter); N/A categories skipped | [§11.1.y](#111y--ted-ruled-lingering-7-step-strict-ordering-designer-authoritative-tedchange) | 148-153 |
| **#146c** | **New offices staffed at next 2.3** | RULED — a bill that creates an office defers staffing to the following appointments phase, not bill-passage | [§21.5](#215-bill-driven-statehood--auto-generated-officials) | 89 |
| **#146d** | **Appointment-replacement costs NO points** | RULED — being replaced at/into an appointed post is not a "loss"; only **electoral defeat** costs points | [§29.4(c)](#294-ga-appointment--eligibility-rulings-senate-fill-order-card-distribution-replacement-gains) | 105-108 |
| **#146e** | **9th/10th draft bonus = first PICK** | RULED — the draft-order skill bonus attaches to the faction's **first DRAFTED pol**, not its first-round attempt | [§4.3](#43--oc-4--cpu-draft-ideology-distance-gate-open-needs-human-design-call--draft-order-bonus-timing-oopscpu) | 239 |
| **#146f** | **Filibuster doesn't exist until enacted by law** | CORROBORATED — no filibuster in 1788; "Institute Filibuster" passes ~1794 → Puritan Senators may filibuster (#10) | [§25.6](#256-legislation-voting-heuristic-nayayenay) + [§12.6](#126-forum-design-layer-filibuster-designed-not-built) | 90-92, 284 |

**CPU-handler sub-gaps surfaced (OC-1…OC-8 → which handler must encode each):**

| OC | Gap | Handler / fix home | `oopscpu` POSTs |
|---|---|---|---|
| **OC-1** | CPU **scandal-smoother absent** — scandal-resignee immediately re-appointed | [§25.5.4](#2554-replacement-chain-after-failure) (cabinet/appointment) — add a recently-disgraced cooldown (instance of [§25.15](#2515-critical-missing-cpu-logic-architectural-gaps) #3 / DH-22) | 65 |
| **OC-2** | Cross-party-leadership × ≥60%-chamber-proposer **collision** (minority chair proposes under majority threshold) | [§25.3](#253-leadership--speaker--ppt--irv-style-bloc-vote-tie-break-ladder) — one canonical "chamber control" definition shared by leadership-select + proposer gate | 151 |
| **★ OC-3** | **(balance-breaking)** CPU crisis-support too generous → peaceful 1792 abolition; no ideology floor, no secession check | [§25.6](#256-legislation-voting-heuristic-nayayenay) — crisis-vote ideology-floor gate + secession/slavery-active check on abolition | 162-180 |
| **OC-4** | CPU drafts strong rookies **off-ideology** (Jackson into a left faction); no distance gate | [§4.3](#43--oc-4--cpu-draft-ideology-distance-gate-open-needs-human-design-call--draft-order-bonus-timing-oopscpu) — **OPEN** (Ted wants "a better third way"; do not silently ship a hard gate) | 227-228, 234 |
| **OC-5** | Court-as-firing-**loophole** — dump un-fireable cabinet members onto SCOTUS pre-precedent | [§25.5.4](#2554-replacement-chain-after-failure) — gate a cabinet-vacating SCOTUS appointment behind the firing-precedent rule ([§21.4](#214-firing-precedent-gate-on-cabinet-changes)) | 184-187 |
| **OC-6** | Kingmaker → protégé **pairing tiebreak** unspecified | [§25.11](#2511-kingmaker--endorsement-preference-rules) — house-ruled **highest Com+Leg+Gov** | 308, 117 |
| **OC-7** | help-allies gov rule scope (→ term-config actions) | RULED as #145 above ([§11.3.z](#113z--oc-7--cpu-help-allies-gov-rule-includes-governor-term-config-actions-ruled-oopscpu)) | 264, 275 |
| **OC-8** | **office-definition** gap for forced-out events (career track? faction/party leader?) | [§10.4.5](#1045--oc-8--what-is-an-office-definition-gap-for-forced-out-events-open-flagged-to-vcczar) — **OPEN**, flagged to vcczar (event-text rewrite + office def) | 334, 336 |

**DESIGNED rules also added this batch (not narrowly Ted-rulings — playtest-surfaced build needs):**

| ID | Rule | Folded into | `oopscpu` POSTs |
|---|---|---|---|
| **DH-61** | Scenario-boot must **seed era-active wars** (1788 → NW Indian War, 20%-loss / WS −2) | [§21.1](#211-generic-cross-era-war-system) | 338-344 |
| **DH-62** | Pre-12A **two-votes-per-state, no-ticket EC mode** (top EV = Pres, runner-up = VP) + same-state-EV exclusion | [§27.3](#273-the-12th-amendment-beforeafter-state-machine-era-specific-election-mode-toggle) | (EC rounds 1788/1792/1796), 197 |

**Decision-gated forks touched:** the all-CPU run **uses CPU SCOTUS by ideology-distance** —
resolves **#52 for the all-CPU case** ([§29.2](#292--unsettled-fork-a--player-controlled-scotus-gap-52)),
player-vs-CPU still user-gated for human games. The **convention CPU (#71)** is **untested** (1788
predates conventions). The **#18 meter→election state-scope fork RECURS unresolved** (POST 205-214)
— **now CLOSED by `terror2000` §30.6 below**.

### 30.6 Rulings folded from `terror2000` (Ted-run 2000-start modern campaign)

> **Ted-run ⇒ designer-authoritative** (same authority class as `tedchange` / `oopscpu`). The
> `terror2000` (`3843da2d`) **first-native 2000-start** modern campaign RULED the rules below —
> several **re-tuned LIVE** by Ted mid-thread — and produced the **first proven game-over** in any
> playtest. Mirrors the §30.5 oopscpu index. Cite `terror2000#POST n`.

**Marquee + new Ted rulings (RULED):**

| # | Topic | Ruling | Folded into | `terror2000` POSTs |
|---|---|---|---|---|
| **★ #18** | **Meter→election scorer RESOLVED** | RULED — Ted reversed his own reading to **V's 2-layer model**: (a) universal per-ideology METER modifier (BOTH parties, EVERY state, primary+general) **+** (b) per-PARTY enthusiasm box, composed additively then ±3-capped. **CLOSES the long-open state-scope fork.** | [§29.3](#293--the-meterenthusiasmelection-model--51-resolved-drums-4-step--18-resolved-terror2000--vs-2-layer-model-gap-1851) + [§22.2](#222-faction-enthusiasm--party-preference-election-engine--the-score-economy) | 913-926 |
| **★ #124** | **Cabinet→enthusiasm RE-TUNED LIVE** | RULED — replaced the broken "stacking happiness" (Mods +18) with a **3-state upset/fine/happy** model: per-faction satisfied-wants count → fine(0) / happy(+1 @20%/10%) / upset(−1 @20%/10%); **one roll/faction**, same-ideology factions stack, **±3 cap**. SHARPENS #124 (moves §30.2 #8 to mostly-resolved). | [§9.3.7](#937--ted-ruled-cabinet--enthusiasm-rework-designer-authoritative-tedchange) | 486-489 |
| **★ #151** | **Cabinet appointment-FAIRNESS penalty (NEW)** | RULED — Era-of-Terror-on: balance appointments across ALL same-party factions (incl. the Pres's own); **−500 pts per slighted same-party faction**. Fired LIVE twice (Bush −2000, Oprah −2000). | [§9.3.9](#939--ted-ruled-era-of-terror-cabinet-fairness--diversity-penalties-151-designer-authoritative-terror2000) | 1280, 154 |
| **★ #151b** | **Cabinet-DIVERSITY penalty active natively** | CORROBORATED — Era-of-Terror diversity penalty (−2 enthusiasm to Civil-Rights/Reformist/LW-Activist factions if <25% women/minority in cabinet+cabinet-level) operates in a 2000-start; female/minority flags requested on the Exec tab. | [§9.3.9](#939--ted-ruled-era-of-terror-cabinet-fairness--diversity-penalties-151-designer-authoritative-terror2000) + [§28.7](#287-modern-cabinet--the-era-of-terror-cabinet-rework-231) | 428, 434, 441 |
| **★ #152** | **War engine resolves in DEFEAT + multi-phase wars (NEW)** | RULED/CONFIRMED — loss package (officers −1 Mil + −1 all-elections; **President −1 all-future-elections**; Party-Pref crater) as the inverse of the victory bundle; wars are multi-phase (naval→ground; "Invasion"→"Counter-Terrorism"; Afghanistan→Phase II). War on Terror LOST ~2005. | [§21.1](#211-generic-cross-era-war-system) (+ [§23.3](#233-56-civil-war--the-two-theater-combat-engine-multi-term-subsystem) / [§28](#28-modern--cold-war-era-1948-systems-designed-not-built)) | 639, 656-662, 816-817, 1027 |
| **★ #153** | **0-Command rookies + DOUBLED Command-gain; no-reroll on held expertise (now OFFICIAL)** | RULED — (a) all rookies enter at 0 Command, every Command-gain % DOUBLED; (b) rolling an already-held expertise grants nothing (no re-roll). ebrk: adapted into official rules. | [§4.1.y](#41y--ted-ruled-draft-rules-designer-authoritative-tedchange) | 91-93 |
| **★ #154** | **Sudden-vacancy fill ladder (4-step, NEW)** | RULED — elected-seat vacancy: same-party-CT → same-party-unemployed → other-party-CT → other-party-unemployed (from the state); a house-rule variant swaps steps 2↔3. | [§29.4(a)](#294-ga-appointment--eligibility-rulings-senate-fill-order-card-distribution-replacement-gains) | 470, 480 |
| **★ #88** | **Autocratic-COUP end-condition FIRED (first ever)** | CONFIRMED — Honest-Gov at floor → **20%/event-phase "Autocratic Coup Ends America"** roll → GAME OVER (the "Rockefeather coup"). **First proven game-over/LOSS in the KB.** Resolves #88's "is it worth building" question (it fires + ends the game). | [§26.4](#264-apocalypse-planet-health-endgame--the-10-year-clock-new-endgame-model) | 827, 829, 839 |

**Procedural / corroborating Ted rulings (RULED, fold into existing homes):**

| Topic | Ruling | Folded into | `terror2000` POSTs |
|---|---|---|---|
| **50-50 Senate → VP's party = majority** | RULED — "if both parties have equal Senators, the VP's party is the majority" (the inverse of #135's 50/50-House rule). | [§24.2](#242-62-contingent-house-election--tied-chamber-inverse-control) | 265, 268, 1282 |
| **5% death+retirement, 1-death-max, retirements FIRST** | RULED (corroborates #85/#130) — up to 5% of a faction/cycle; **1 death max + rest retirements**; **roll retirements before deaths**; Frail=2% under 55. | [§10.1.y](#101y--ted-ruled-death--retirement-schedule-designer-authoritative-tedchange) | 457, 462-466, 496 |
| **Gov "Praise/Criticize President" uses SPECIAL rolls, not Gov** | RULED (corroborates DH-15/#20) — most criticize attempts have no measurable effect unless they hit the special roll. | [§11.3](#113-governors-actions-library-designed-not-built) | 557, 763 |
| **Gov "Improve Industry" success scoring** | vcczar RULED — Gov **and Senators** each give their faction **+100 per industry level** on success (even off-card); ebrk flagged possibly over-tuned. | [§11.5](#115-industry-leadership-scoring-designed-not-built) | 573 |
| **"Ambitious Judge" event = Justice-specific #143** | RULED — a Justice gains +1 Command but must run for President next cycle or lose it (the use-it-or-lose-it #143 rendered as an event). | [§14.1.z](#141z--ted-ruled-post-election-command-decay--shit-or-get-off-the-pot-designer-authoritative-oopscpu) | 430 |
| **Ideology-shift does NOT lose an Activist's card** | vcczar RULED NO — no mechanism to lose interests on an ideology shift; keep the card. (*Open, unruled:* Euri/V floated LW/RW Activists should have 0% to shift past Lib/Cons, POST 263.) | [§6.3](#63-215-ideology-shifts) | 257, 263 |
| **Leadership challenge gate** | RULED — incumbent can't be challenged unless prereq fails OR challenger's enthusiasm is below neutral (blocked McCain/DeMint/Helms). | [§8](#8-leadership-selection-22x) | 302-303 |
| **Chairs (not ranking members) can't propose unless party ≥66%** | RULED — only chairs gated; vcczar OK'd ranking members proposing (POST 642). FL must match faction ideology. | [§8](#8-leadership-selection-22x) | 642, 651-656, 435 |
| **Trait clarifications** | "Corruption" trait gone → treat as Controversial; **Illicit = opposite of Lawful**; Alex Jones's phantom 1-Military to be cleaned. | [§3](#3-politicians--stats) | 312, 321, 200 |
| **Census/EV via events (sharpens #92)** | RULED — all IRL inter-census changes done via events (per OrangeP); census changes come only from era events + industry changes + random rolls at census. | [§28.9](#289-the-per-decade-census--statehoodterritory-the-level-b-census-mechanic) + [§10.4.3](#1043-243-era-events--runphase_2_4_3_era-phaserunnersts2796) | 513-516 |

**Corroborations field-validated from the MODERN angle (no new rule — strengthen existing entries):**

| Existing entry | `terror2000` corroboration | POSTs |
|---|---|---|
| **#113** Era-of-Terror content band | 9/11 fires VERBATIM → War on Terror + War in Afghanistan via the generic naval→ground engine; Patriot-Act docket (surveillance, drone, DNI, deport, war bonds, voter-ID); era-gating (Space Force/Sonny-Bono locked until Era of Populism); designer (`vcczar`="Jonathan Hobratsch") + forum users as pols; Iraq War never fires (timeline diverges); "Paris Agreement" = the one anachronism. | 484-520, 602-650, 619/623, 60/132, 508 |
| **#56/#106** war engine native in 2000s | the success-chance formula + naval→ground gating + per-theater carry-roll re-confirmed natively (see #152). | 816-817, 152-277, 599-1027 |
| **#90/#92** modern dataset exhausts | drafts can't fill all 7 tracks in the 2000s; "after 2024 we'll have to start generating politicians" — proc-gen is year-triggered (Era of Populism) AND dataset-exhaustion-driven (#43). | 510-548 |
| **#1/#102/#135/#143/DH-25** | two CPU factions handed to humans mid-thread (faction handover, #1); cumulative-winner end condition (#102, the coup resolved to it); 50-50-Senate=VP-party (#135 inverse); Command use-it-or-lose-it (#143, the Ambitious-Judge event); 1-skill-bench bootstrap hole (DH-25, ebrk seeds ~2 pols/track/faction at boot). | 658-664, 839, 63-65 |

> **No NEW CPU sub-gaps** surfaced beyond the OC-1…OC-8 / #143 set — this run **field-validates the
> §25 CPU suite from the modern angle** (CPU draft + meta-passes, cabinet/leadership voting with
> trait-driven swing-NAYs, static faction-keyed gov menus, candidate selection) rather than extending
> it. Passive FLs make no conversion attempts (corroborates #76/#78, POST 1232).

### 30.4 Authority hierarchy reminder

When rule sources disagree:

1. **Ted's `tedchange` rulings** (highest authority — the official rules-doc rewrite channel).
2. **vcczar's `smallbugs` rulings** (designer spot rulings; same authority class as `tedchange`).
3. **The user's review-gate decisions** (the absolute top; e.g. batch 9's "60% cloture +
   majority" Senate ruling — `tedchange` did not touch it; it stands UNCONFLICTED).
4. **Playtest GA case-by-case rulings** (e.g. `tea1772`, `hd`, `rep1800`, `arkzag`).
5. **Inference** from system behavior.

**Where Ted-RULED items SUPERSEDE prior text in this doc, the topical section has been
rewritten to match Ted's call, with a one-line supersession marker citing the `tedchange`
POST#.** Where `tea1772` GA rulings conflict with Ted (e.g. amendments-NOT-SCOTUS), both
sides are preserved with the conflict flagged.

## 31. Gilded-Age era systems (designed, not built)

> **Source: batch 14 — `bf590684` / `gild1868`** (the **first dedicated native-1868 Gilded-Age
> multiplayer campaign**, 6318 posts, the largest thread in the KB; runs 1868 → ~1886 and **ends
> in GM burnout** — the 3rd GM-burnout death after `new1772`/`dem1820`). Prior Gilded coverage
> (`gilded`/`house-divided`/`drums`/`tea1772`) *reached* 1868 as a continuation of an earlier
> start; this one **boots there**, so it is the richest record of the Gilded issue engine actually
> played. **The Gilded Age is UNBUILT** — there is no `gilded`/1868 scenario file (only
> `scenario1772.ts` + `scenario1856.ts`) and no Gilded era-enum value; the era runs on **`modern`
> tuning** with hand-built data (gap #41). Everything in §31 is **designed, not built**.
>
> **★ POLARITY (load-bearing, flipped from the founding era): RED = Republicans** (Grant, bloody
> shirt, Reconstruction, tariff/business, Stalwart/Half-Breed/Mugwump) **and BLUE = Democrats**
> (Solid South, Tweed/Tammany, soft-money/Free-Silver). The chunk-001 faction sheet is explicit
> (`gild1868` POST 6). This is the OPPOSITE of the founding-era BLUE = Dem-Rep frame.
>
> **Shipped-vs-designed today:** the tariff is only a **±0.5 flavor bill** (`phaseRunners.ts:3421`
> "Tariff Increase" `meters: { revenue: 1, economic: -0.5 }`) — there is no national rate state, no
> `MonetaryRegime`, no Reconstruction timer, no civil-service axis, no special-election branch. §31
> is the **Gilded era-content spec** the tech-lead / roadmap-planner should treat as the unit of
> work for a `gilded` era.

### 31.1 (#147) Tariff-as-national-%-rate + the mutually-exclusive MonetaryRegime (designed)

> **Sharpens #3 and extends [§20.4](#204-the-hamiltonian-financial-program-as-bills-fed-38-250)
> (the federalism tariff-integer) with the strongest evidence yet that the tariff is a literal
> national integer the parties fight over.** Pairs with [§21.6](#216-bill-typing--budget-gated-spending-cap)
> (spending cap / bill typing) and [§12.9](#129-forum-design-layer-executive-branch-interference--bill-relationship-graph-modern-designed-not-built) (the bill-relationship graph).

**Tariff = a single national integer set by a literal rate-bill** (`gild1868` POST 6240, 846;
ch67/76/77 roll-calls). The Gilded floor runs **competing rate-bills** the parties fight over:

| Bill | Position |
|---|---|
| **"Set average tariff rate to 36%"** | protectionist (RED / Republican business) |
| **"Set average tariff rate to 25% and standardize and reform the tariff system"** | reform / lower (the reformist counter-bill) |

- The **single national rate is a meaningful party position** — not a meter nudge. Couples to the
  federalism **change-cadence** rule (§20.4: set once, then locked until a "first new tariff year"
  before it can change again).

**Currency = a parallel `MonetaryRegime` enum, MUTUALLY EXCLUSIVE** (`gild1868` POST 836, 884,
6245). One regime is active at a time; **passing one deactivates the others**:

| Regime | Effect (as a bill) |
|---|---|
| **Gold-Standard Act** | removes greenbacks; deflationary ("US dollar … gold standard — free of paper money and silver to cause deflation") |
| **Bimetallism / Free-Silver** | gold + silver bullion; inflationary, to ease debt repayment (the **same bill as the federalism bimetallism axis**, §20.4 — corroborated across 2 eras) |
| **National Banking System** | paper currency + war bonds |

*(designed, not built — add `game.tariffRate: number`, set/changed by a **"Set Average Tariff Rate
to N%"** bill type (+ a "standardize and reform" lower-rate variant), subject to the §20.4
change-cadence; add a `MonetaryRegime = 'gold' | 'bimetallic' | 'freeSilver' | 'nationalBank'` enum
where the regime bills are **mutually exclusive** — passing one clears the others. The missing
exclusivity constraint is DH-63, §31.5. Couples to the economic-content engine (#116) + the
bill-relationship graph (§12.9 / #42).)*

### 31.2 (#148) 20-year auto-expiring Reconstruction regime + appointment-by-leadership + Solid-South bias sunset (designed)

> **Extends — does NOT duplicate — [§23.4](#234-57-reconstruction-readmission-subsystem-end-nationalism--gilded)
> (#57, the readmission / war-victory spec).** `gild1868` (native 1868) models Reconstruction as a
> **time-boxed regime**, adding three things §23.4 lacked: a **20-year timer**, **appointment of
> seceded-state seats by congressional leadership**, and a **bias sunset to a Blue Solid South**.

- **Auto-expiring timer.** Reconstruction begins **1864** and **auto-ends 20 years later = 1884**,
  explicitly **"to prevent a one-party state"** (`gild1868` POST 73, 76). This is a regime clock,
  not just a per-state readmission flag.
- **Seceded-state seats are APPOINTED, not elected, while the regime is active** (rules
  **3.0.32 / 3.0.35**, `gild1868` POST 70, 143, 330):
  - **Military Governors** — President-appointed, **but must be the majority-Congress party**.
  - **Senators** — chosen by the **faction controlling the President Pro Tempore**.
  - **Representatives** — chosen by the **faction controlling the Speaker**.
  - **Appointees cannot have seceded** (the Unionist/secessionist data tag, §23.1 / #58).
- **+2 GOP (RED) bias** on those appointments/elections while the regime is active.
- **Bias SUNSET at expiry → Blue Solid South.** When the timer expires the **+2 RED bias sunsets**
  and southern states flip to a **Blue-heavy Solid South**: FL/GA/LA **Blue+3 → Blue+5**, VA
  **Blue+2 → Blue+5** (`gild1868` POST 5145). Models the *abandonment* of the freedmen by both
  parties (the era brief: African-Americans "forgotten by the GOP and ignored by the Democrats").
- **Per-state early end by repeal-bill** still works (a "Repeal Virginia Reconstruction" bill;
  **FAILED 4-12** here, POST 558) — the §23.4 readmission-by-(repeal-)bill path.

*(designed, not built — layer a **Reconstruction-regime timer** (`game.reconstruction = { startYear,
endsYear }`, auto-expire ~20 yrs) on §23.4; while active, **appoint seceded-state seats by
Speaker/PPT-faction** (majority-party military Govs, non-seceded appointees per the §23.1 tag);
a **+2 bias-while-active → sunset-to-Solid-South** at expiry (a time-boxed per-state bias modifier
keyed to the timer); per-state early end by repeal-bill. Pairs with §23.4 / §11.4 (#21) /
§10.4.3 census EV.)*

### 31.3 (#149) Civil-service merit-vs-spoils axis (+ era-gated reform content) (designed)

> **A real designed system, not flavor.** The Gilded brief (`gild1868` POST 1): "establish
> government jobs by merit and not party loyalty … **this has not happened yet**." Distinct from
> #3's bare "civil-service tree" line — this is the **merit/spoils axis** + its **era gating**.

- **The in-game Pendleton Act** — a **"Require most federal positions awarded on merit not party
  loyalty"** bill **PASSES the 41st Congress** (`gild1868` POST 842). It shifts how appointments
  work (merit vs the spoils economy).
- **The spoils lever** — **"Increase / Decrease State Gov Jobs"** governor actions feed
  **Domestic-Stability** and the spoils economy (`gild1868` POST 770, 803). NB the gov-action
  meter-move is **rare** (pass-roll, then a *separate* ~5% roll to actually move the meter, §11.2 /
  #20) — players spam "Increase State Gov Jobs" against a DomStab crisis largely fruitlessly
  (POST 805). Couples to the **Honest-Gov't / corruption** meter.
- **Reform content is ERA-GATED** to later (Progressive) eras:
  - **"Advocate Social Mobility"** governor action — **Progressive-era-only** (`gild1868` POST 811,
    2936; see [§11.3](#113-governors-actions-library-designed-not-built)).
  - The **income-tax bill** is **blocked until an income-tax amendment** ("Progressive Age at
    least"; §31.4 / §21.6).

*(designed, not built — add a **civil-service / spoils axis**: a merit-reform bill that changes how
appointments are filled, the **State-Gov-Jobs** spoils lever feeding DomStab + the spoils economy,
and the Honest-Gov't / corruption interplay; **gate reform content** (Social Mobility, income tax)
to the Progressive era via the era-content registry. Sharpens #3.)*

### 31.4 (#150) "1872 Rule" — disorganized-loser runs opposite-party independents (meter-gated special election) (designed)

> **Rule 3.0.17 "Special Election Conditions — the 1872 Rule"** (Tyler, `gild1868` POST 49). A
> narrow, era-specific **election-content** rule with no analogue in the build; pairs with §23.4 /
> §31.2 (Reconstruction) + [§22.4](#224-third-party-challenge-trigger-293) (the third-party
> trigger). Folds into the election/special-election surface ([§15](#15-elections-29x-and-calcstatevote)).

The post-Civil-War **disorganized losing party** (the South, immediately after the war) does **not
nominate normally** — instead the GM **runs independents of the OPPOSITE party** as its Pres/VP
nominee. It is **meter-gated**: at the **first election after Reconstruction begins**, if
**party-pref is Red+2 / Red+3 AND a d6 lands 1-2**, an **independent-GOP (RED) ticket** is fielded
as the (nominally Democratic / BLUE) candidate, and the **lowest-scoring Blue faction "runs" it**
(`gild1868` POST 56, 294, 774-775).

*(designed, not built — a **meter-gated "disorganized party" special-election branch** for the era
immediately after a civil war: opposite-party-independent nominee, gated by a **party-pref band +
d6**, run by the weakest faction of the loser. Niche; pairs with §23.4 / §31.2 + #48.)*

### 31.5 (DH-63) Currency-regime exclusivity bug (the missing relationship constraint)

> **DH-63 — a design hole.** `gild1868` had **Bimetallism AND the Gold-Standard Act both active
> simultaneously despite being mutually exclusive** (`gild1868` POST 6245, 6246) — the engine let
> two contradictory currency regimes hold at once because **there is no relationship/exclusivity
> rule between the currency bills**. The build's `MonetaryRegime` (§31.1 / #147) **must enforce
> mutual exclusion** (passing one regime deactivates the others). Pairs with the
> **bill-relationship graph** ([§12.9](#129-forum-design-layer-executive-branch-interference--bill-relationship-graph-modern-designed-not-built) / #42).
>
> **Adjacent open question** (same post cluster): the **filibuster carry-over rule is unclear** —
> a bill "held for a half-term": does it come back automatically, or must it be re-proposed? Rules
> are contradictory (`gild1868` POST 939) — matches the `drums` / `hd` open question on the
> filibuster ([§12.6](#126-forum-design-layer-filibuster-designed-not-built) / #10).

*(designed, not built — make currency-regime bills a **mutually-exclusive set** in the
bill-relationship graph: activating one **auto-deactivates** the contradictory regimes; resolve the
filibuster carry-over ambiguity. Logged as DH-63 in `game-context.md`.)*

### 31.6 Gilded content cluster + meta (corroborations, b14)

Native-1868 corroborations of the existing Gilded cluster (`gild1868 (b14)`):

- **#3 (tariff/currency/civil-service/imperialism)** — now the **strongest** evidence: the issue
  engine (tariff %, currency regimes, civil-service merit, trusts, ICC, imperialism) is exercised
  end-to-end (§31.1–§31.3; `gild1868` POST 1, 887 ICC PASSES, 697 Philippines-from-Spain era event,
  Purchase-Canada exec action). "Protect Monopolies, Mergers, Cartels from Regulations Amendment"
  is on the floor late (POST 6245).
- **#5 (per-era card library + Gilded faction nicknames)** — era-accurate Gilded nickname table
  (Stalwart / Half-Breed / Mugwump / Bourbon / Readjuster …), POST 6, ~324.
- **#6 (social-movement groups)** — feminists / socialists / communists / prohibitionists /
  eugenicists / labor activists "rumbling," and the engine already **gates this content** by era
  (women's suffrage **heavily penalized pre-Progressive**, players decline it for balance —
  `gild1868` POST 1, 697, 730, 3055).
- **#21 (state-policy flags) is EXTENSIBLE and gov-action-toggled** — see §11.4 below for the
  added-mid-game-flag detail (Poll Tax / Jim Crow / Prohibition / women's-suffrage all live as
  state switches; "lynching made illegal in Michigan" **added a new flag category mid-game**,
  POST 795, 2933).
- **#41 (era unbuilt / `modern` tuning)** — confirmed: no scenario file, runs on `modern`.
- **#92 (Gilded never reached a "future" era)** — negative result holds (the thread ends still in
  the Gilded Age at POST 6318).

> **★ META — 3rd GM-burnout death (no new mechanic).** This first-time-GM campaign **ended in GM
> burnout** (a 1884-86 GM/player conflict over a Lifetime-President amendment, POST 6273-6318) —
> the **3rd GM-burnout thread death in the KB** after `new1772` and `dem1820` (the DH-36 meta hole,
> §27 cross-ref / §26.4 endgame note). It reinforces the standing **automation-reduces-upkeep**
> argument: the spreadsheet legislative phase is the hardest to run by hand (DJBillyShakes, POST
> 868: "the phase I'm most looking forward to having a video-game UI for"). No new mechanic — a
> signal that the **single-player build's value is upkeep elimination**.

---

> **Cross-reference for the roadmap (§31 — the `gilded`-era content spec).** §31 is the unit of
> work for a **`gilded` era**: it needs (1) a **`gilded` scenario boot** like 1856 (§26.1 mid-government
> boot; one-party GOP: Senate 56-9 / House 141-70 RED, `gild1868` POST 71) + a Gilded era-enum value
> in the era-content registry (K3/K4); (2) the **tariff-rate state + mutually-exclusive
> `MonetaryRegime`** (§31.1, with the DH-63 exclusivity constraint, §31.5); (3) the **Reconstruction
> timer + appointment-by-leadership + bias-sunset** (§31.2, layered on §23.4); (4) the
> **civil-service / spoils axis** with era-gated reform content (§31.3); (5) the niche **1872-Rule
> special-election branch** (§31.4). All ride the **eras-are-content-bands** architecture (§27.1) and
> the §26 BootSheet. New design hole **DH-63** + corroborations of #3/#5/#6/#21/#41/#57 are logged in
> `game-context.md`.

---

> **Cross-reference for the roadmap (§27).** §27 is dominated by **one architecture decision** —
> **eras-are-content-bands** (§27.1) — which the tech-lead should treat as a top-level item: the
> era must become an explicit **game-state/territory content-band gate**, with `year % 4` / `year
> % 2` demoted to phase *cadence* only. The rest are era-content subsystems that slot under the
> **eras-are-content-bands** (§27.1) — which the tech-lead should treat as a top-level item: the
> era must become an explicit **game-state/territory content-band gate**, with `year % 4` / `year
> % 2` demoted to phase *cadence* only. The rest are era-content subsystems that slot under the
> **era-content registry** (K3/K4): the **12A election-mode toggle** (§27.3, mirrors
> `senatePre17`), **slavery-flag + Cohens state-supremacy** (§27.4, the sectional substrate),
> **organize→admit statehood gating** (§27.5), the **Second Bank recharter clock** (§27.6), the
> **circular ideology metric** (§27.7, a cross-cutting math change touching §6/§25.8/§26.6), and
> **amendments-mutate-core-params** (§27.8). All pair with §2.5 (boundary point-banking) and §26
> (the BootSheet). New design holes DH-29..DH-35 are logged in `game-context.md` (§19 below).
>
> **★ Batch 8 update.** The eras-are-content-bands finding (§27.1) is now **MULTI-SAVE CONFIRMED**
> — `ad0f2875` (1772-start) + `rep1800` (1800-start) emit identical band labels at identical
> in-game dates from **two different start years**, making this the most-corroborated architectural
> finding in the KB. §27.2 gains the **dual era-scoring** model (per-era winner + cumulative leader,
> keyed to B#/R# slots). **★ NEGATIVE RESULT:** despite its "to future" title `ad0f2875` **stalls at
> 1874 (mid-Gilded)** and completes no era beyond Gilded — **"Era of the Future" remains
> undocumented across all ingested threads**; the documented timeline end-state is unchanged. New
> design holes **DH-36..DH-44** (incl. the **DH-36 meta hole** — manual-upkeep GM burnout killed a
> 12-turn game) are logged in `game-context.md`.
