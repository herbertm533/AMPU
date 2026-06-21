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
> **Forum-design batches absorbed.** `f4c7c2c4` (1868–1872 Gilded-Age playtest): the
> convention machinery, governor's actions library, state policy flags, executive
> actions library, per-power foreign relations, legislative micro-mechanics, and
> Gilded-Age era. See [§19](#19-shipped-vs-designed-boundary).
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

### 7.4 Forum design layer: era-gated multi-pool card library (designed, not built)

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
*(designed, not built — encode trait gates on faction-leader eligibility; add anointing
flow.)*

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
*(designed, not built — extend `Office` enum with Minister-* offices and admiral-bench
slots; add cross-party cap.)*

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

Forum era events can route a response through **multiple offices** working in tandem
(post 129: "Oregon Treaty: To be implemented (Diff) by Pres Clinton, Sec of State Delano
and UK Minister Clay"). The shipped `EraEvent.decider` is a single role; the design
permits a list of deciders, each rolling at a different difficulty. *(designed, not built —
extend `decider` to `decider: Role | Role[]`; resolution rolls per role.)*

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

### 12.4 Forum design layer: committee block-and-replace (designed, not built)

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
  effectively a meta-bill whose `effects` are the *union* of its members'. *(designed,
  not built — add `Bill.packageOf?: BillId[]` and a chair-side bundling action.)*

### 12.6 Forum design layer: filibuster (designed, not built)

Between the House vote and the Senate vote (posts 189-194), **each faction with a
Senate-floor presence** is offered the option to filibuster one bill/package:

- One filibuster attempt per faction per session.
- If filibustered, the targeted bill **dies** (post 194: "S.2 ... Filibustered" — no
  vote tallied).
- Engine has no concept; floor vote runs in House then Senate without an inter-chamber
  hook. *(designed, not built — add a 2.6.2.5 hook between House and Senate tallies for
  per-faction filibuster choice; cap one per faction.)*

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
150-points-per-faction-card hits). *(designed, not built — introduce
`game.activeCrises: CrisisId[]` and `Bill.resolvesCrisis?: CrisisId`; on passage of a
crisis bill, pop the crisis off and apply a stronger scoring multiplier.)*

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

#### 13.3.1 Per-power relations meters

Forum tracks **separate relation meters** per major foreign power (post 132): UK, France,
Spain, Prussia, Russia, China. Each runs on the same `[−5,+5]` band with descriptors
(`Friendly`, `Neutral`, `Hostile`, `Maxed`). Engine has `game.diplomacy` indexed by
nation key, but the **list of seeded nations is era-dependent** (Prussia post-1871 →
Germany; China post-1911 → ROC). *(designed, not built — extend `diplomacy` to a
per-era seed set with renaming/merging hooks across era transitions.)*

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
**every** presidential cycle (posts 211, 220-267). The full subsystem:

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

### 19.1 Design divergences for the roadmap

Three rules where the **forum and the shipped engine genuinely disagree** (not just
"forum has more"):

1. **Bill scoring**: shipped engine uses `factionCenter` (one ideology index, PR7-biased)
   in `cardVoteBias` at `0.03 × delta` per matching card. Forum scores **every** ideology
   + lobby + interest card at ±50/±100/±150 per card hit. (See §12.8.)
2. **Carpetbagger trait grant**: shipped engine rolls (`0.05`–`0.30`) on cross-state move
   with a 4-step ladder. Forum **auto-grants** on alt-state moves. (See §6.2.x.)
3. **Conversion targeting**: shipped engine uses a multiplicative willingness table
   keyed on fit/PV/Loyal/Opportunist. Forum gates strictly on `Can Party Flip` (cross
   party) and `Pliable + adjacent ideology` (same party), with hard per-base rates of
   5/10/15%. (See §6.4.x.)
