# AMPU — Game Context

> **Batch-5 consolidation.** Written from the codebase + `CLAUDE.md`, then
> updated against six formally-ingested forum threads: a 343-post Gilded-Age
> multiplayer playtest (`gilded`), a 732-post 1788 federalism solo-with-AI
> playtest (`federalism`), a 90-post 1772 solo "aesthetic experiment"
> (`1772-solo`), a **2276-post modern (2004→2020) multiplayer 1948 campaign**
> (`modern`), a **9051-post 1856-native multiplayer campaign**
> (`house-divided`, the 1856→1904 alt-history "A House Divided" Part 2), and a
> **7540-post all-CPU 1841→1924 playtest** (`drums`, "Drums of War") — see
> Sources. "What this game is / Eras / Core entities / Glossary" describe the
> **shipped build** (cited `file:line`). The gap log is grouped by area; each row
> is tagged `ingested` (forum-cited) or `codebase`, and notes when a delta is
> **corroborated across multiple eras** (the strongest signal that it is real and
> load-bearing). A separate **Confirmed shipped bugs** subsection lists defects
> (fixes, not features). The `modern` thread is the most mechanically *mature*
> source; the `house-divided` thread is the most mechanically *unique* (1856-
> native, Civil War / Reconstruction); the **`drums` thread is the most
> mechanically *interior*** — an **all-CPU** run that exposes CPU heuristics,
> thresholds, tie-breaks, and design-holes that prior multiplayer threads couldn't
> capture. The core loop is now **corroborated across 5+ eras / 6 threads**.
>
> **★ The forum DRIVES the build.** `house-divided` is direct, dated evidence that
> the playtests are the design source of truth: mid-thread the engine designer
> (`vcczar`) changed the relocation cap to **4** pols on a player's request and it
> went **LIVE in the running playtest** (digest §0 / I-1; `house-divided` POST
> 7062–7066, 7555) — while the **shipped build is still at 5**
> (`RELOCATION_ATTEMPTS_PER_TURN`, types.ts:247). The canonical spec is the latest
> playtest, not a frozen rulebook; a few shipped constants already lag the design.
> **`drums` reconfirms this theme:** mid-thread `vcczar`/`Tyler` patched the CPU
> IRV (continuous elimination, first-round-only randomization, POST 3419), the
> ±3 ideology-swing cap (POST 4574), the 5%/half-term retirement/death rate (POST
> 5437), and added a deterministic faction-rename-to-"Conservative-Party" trigger
> (POST 7406). The build must absorb these patches.
>
> **★ `drums` RESOLVES much of DH-8 (CPU AI under-spec).** Because the run was
> all-CPU, it is the **first explicit record of CPU heuristics** for candidate
> selection, leadership IRV, convention behavior, cabinet picks, legislation
> voting, scripted-event A/B/C choices, conversion %-rolls, faction-leader
> replacement, and faction renaming. The new **"CPU AI specifications"** cluster
> in the gap log (rows #70-#78) is the explicit spec; DH-8 is marked **RESOLVED**
> for the heuristics it covers and **REMAINING** for the architectural gaps
> (no vote-trading, no meter-guarding on event picks, static gov menu).

## What this game is

AMPU is a turn-based American political strategy game that runs in the browser
(React + TypeScript + Vite; state persists in IndexedDB). The player runs a
**faction** inside one of two parties (BLUE / RED) and steers it across a
historical timeline: draft politicians, develop them, win elections, staff the
government, pass legislation, fight wars, and resolve era-defining decision
events. There is no single win screen baked in for both scenarios; play is a
campaign across a sequence of phases per turn, with terminal endings on certain
era events (`GameState.gameEnded`, `EraEvent.triggersGameEnd`, types.ts:1476,
1635).

As shipped, AMPU is **single-player**: the human owns exactly one faction
(`Faction.isPlayer`, types.ts:1303; `playerFactionId`, types.ts:1566) and the
engine drives every other faction as CPU. The turn loop is a fixed **phase
sequence** of ~36 phases grouped into 10 categories (`PHASE_SEQUENCE`,
phases.ts:3-47), advanced two years at a time (`nextPhaseInfo` adds 2 per turn
rollover, phases.ts:161). Most systems are **pure functions over a single
`FullGameSnapshot`** (types.ts:1811) in `src/engine/`; the UI is a registry of
~35 pages (registry.ts) with no router.

The engine is deterministic by design (seeded RNG, `src/rng.ts`) and the phase
taxonomy is numbered ("2.1.1 Politician Draft", "2.9.4 Presidential Election",
…) — the same taxonomy the forum game uses, so this build is recognizably an
implementation of that game.

The player's goal is open-ended faction-building: accumulate Political Value
(PV) across your politicians, control offices (Presidency, Congress, governors,
cabinet, courts), shape national meters and interest-group standing, and survive
/ steer the era's crises. **PV drives elections** (`src/pv.ts`; CLAUDE.md).

## Eras & scenarios

The codebase has **four era values** — `independence`, `federalism`,
`nationalism`, `modern` (`Era`, types.ts:1337) — but only **two shipped
scenarios**, and only **three eras are reachable in play**. The forum runs a
**continuous multi-era campaign** (a 1772 or 1800 start runs straight through
independence → federalism → nationalism → gilded → …), with **points reset at
each era boundary** (federalism digest post 518). Eras are not just flavor: each
is a balance dimension *and* carries its own faction roster, nickname table,
draft-ideology profile, era-event spine, bill catalog, card pool, and SCOTUS
case set.

| Scenario | Start | Era(s) reachable | Defining issues | Status |
|---|---|---|---|---|
| **1772 — Founding** | 1772, era `independence` (scenario1772.ts:97) | `independence` → `federalism` on Constitution ratification (constitutionalConvention.ts:198) | Independence vs. loyalty, the Revolutionary War, confederation vs. federal union, writing the Constitution | **Built** |
| **1788 — Early Republic** | 1788, era `federalism` | `federalism` (1788–1800) → `nationalism` at ~1800 | **Hamilton vs. Jefferson**: assume Rev-War debt, Bank of the US, US Mint, tariff (set to 10%), bimetallic currency, Militia Act; Compromise of 1790; Whiskey/Fries rebellions; **party-formation as era events** (~1792); French-Revolution wars (War of 1795, Barbary); per-state shift to popular-vote electors; state-by-state slavery abolition vs. Cotton Gin; Louisiana Purchase | **Designed, not built** — now richly documented (federalism digest is the spec) |
| **1856 — Antebellum** | 1856, era `nationalism` (scenario1856.ts:177) | **Shipped:** `nationalism` only (spine ends at the Trent Affair, 1861). **Designed (`hd`):** the same start runs **continuously 1856→1904+** through Nationalism → Gilded (1868) → Progressivism (1892) | Slavery, popular sovereignty / free soil, sectional crisis, **secession & Civil War → Reconstruction** — then forward into the tariff/currency/civil-service/imperialism Gilded issues and the Progressive issue-space | **Partially built** — the antebellum *start* ships, but the **Civil-War combat engine, Reconstruction subsystem, secession-trait gating, sectional-balance crisis, and Canada/era-continuation** are designed-not-built (`hd` digest is the spec; gap rows #56–#69) |
| **1800 → Gilded Age (1868–1892)** | continuous campaign | Reaches a `gilded`-style era (likely the `modern` enum, or its own value) | **Tariff** (national integer set by legislation); **currency** (Gold-Standard vs Bimetallism/Free Silver); **civil-service reform / anti-corruption** ("Honest Gov't" crisis); **imperialism** (island naval bases); Native-relations bills; Chinese / Jewish immigration bans; women's suffrage (state-by-state); Jim Crow / Poll Tax / Prohibition policy switches | **Designed, not built** — confirmed by the gilded digest |
| **1948 → Modern (the `modern` arc, played 2004→2020)** | continuous campaign (a 1948 start) | The full **`modern`** era — the only fully-tuned modern rows; the game's own fictional eras ("Era of Terror" …–2012, "Era of Populism" 2012–2024) | **Most mechanically mature era.** Modern issue menu (tariff power to the President, income-tax brackets, healthcare, immigration, climate, Wall Street, gun control); the **named meter bank + enthusiasm/Party-Pref engine**; **full primary→convention→general** presidential subsystem; **named-Justice SCOTUS docket** (court-packing, compelled votes); modern legislative depth (Crisis Bills, packaging, Executive-Branch-Interference, investigation committees); 53-state alt roster (incl. DC/Cuba/PR) under a Wyoming-Rule apportionment | **Designed, not built** — the `modern` digest is the spec |
| **"The next era" (post-1892, pre-modern)** | implied | unknown | Feminists, socialists, communists, prohibitionists, eugenicists, labor activists — narrated as forthcoming in the Gilded-Age era brief | **Designed, scope unclear** |

The forward arc is therefore **nationalism → gilded → progressive → … →
modern**: the `nationalism` Civil-War scenario is built, but the gilded/
progressive/modern eras at the end of the timeline are only `modern`-enum tuning
rows with no scenario. **federalism** sits *between* the two built scenarios and
is well-documented (`fed`); the **modern** end-state is now the best-documented
unbuilt era (`modern` digest — a 2276-post campaign).

**Alt-history note.** The forum campaigns are **alternate timelines**, not
re-enactments. The `modern` campaign began at **1948** and 60 in-game years of
player decisions produced a divergent present: a **53-state** union (DC, **Cuba**,
**Puerto Rico** are full states), ahistorical presidents (Cuomo, Kirk, a 3-term
Cochran), and ahistorical SCOTUS rulings (Janus/Atkins/Dobbs all decided
differently, flagged "ahistorical"). The game runs on **its own clock**, with
**fictional era names** ("Era of Terror" …–2012, "Era of Populism" 2012–2024) and
events firing ~10 years behind real tech. Real history supplies *texture and the
menu of plausible issues*; outcomes, officeholders, and the enacted-law record are
the campaign's own. (Per historical-context.md §10, the **modern era is the one
window where BLUE=Democrat=left / RED=Republican=right with no polarity caveat**,
and the shipped flat interest-group pool — Big Tech, Big Oil & Gas, Globalists,
LW/RW Media, anachronistic in 1856/1868 — **fits here**.) `modern` 426, 1080,
2067; historical-context §10.

- **1772** is a long "expansion-style" inaugural draft: the entire politician
  pool is drafted snake-order (scenario1772.ts:86, 107-117); historical founders
  enter via the CSV-driven inaugural draft, not the seed roster. It starts with
  **no government** — no president, no cabinet, no governors, no courts — which
  unlock through era events (Declaration → governors; Constitution → presidency,
  courts, cabinet). Era-event spine (eraEvents1772.ts): Intolerable Acts,
  Lexington & Concord, Continental Army, Alliance with France, Declaration of
  Independence, Articles of Confederation, Treaty of Paris, Annapolis →
  Constitutional Convention, plus westward events (Vermont, Fort Stanwix).
- **1856** starts **mid-government**: Buchanan is president, the Constitution is
  ratified, governors and courts exist (scenario1856.ts:179-193). It begins past
  the draft phase (`phaseId: '2.1.2'`, scenario1856.ts:153). Era-event spine
  (eraEvents1856.ts): Bleeding Kansas, Dred Scott, Panic of 1857, Southern
  Secession Threat, Secession Winter (1860–61), Trent Affair.
- **Era is also a balance dimension**, not just flavor: many rule tables are keyed
  by `Era` — mortality multipliers (`MORTALITY_RULES.eraConfig`, types.ts:507),
  faction-leadership churn (`LEADERSHIP_RULES.eraConfig`, types.ts:460), anytime-
  event rates (`ANYTIME_EVENTS_RULES.eraConfig`, types.ts:1076), and several
  trait election/governance effects are era-scaled. `modern` rows exist
  throughout but no shipped scenario reaches that era.

## Core entities & systems (index)

One line each; see `game-mechanics.md` for the actual rules/math.

- **Politician** (types.ts:1251) — the unit. Has `skills` (6 keys, 0–5),
  `command`, `traits[]`, `expertise[]`, `ideology`, faction/party, age, office,
  career track, PV cache, loyalty. **Drafted, never hand-placed** in 1772.
- **Skills** (types.ts:24) — `admin, legislative, judicial, military, governing,
  backroom`, integers 0–5.
- **Command** — a separate combat/leadership stat (not in `Skills`), gates
  kingmaking and military command.
- **Traits** (types.ts:62) — ~60 positive/negative tags (Charismatic, Integrity,
  Corrupt, Iron Fist, …) added over time (PR4b/PR6 batches), with symmetric
  conflict pairs (`TRAIT_CONFLICTS`, types.ts:658) and election/governance
  effects (`TRAIT_ELECTION_EFFECTS`, `TRAIT_GOVERNANCE_EFFECTS`).
- **Expertise** (types.ts:182) — a third axis, 19 policy domains (Economics,
  Foreign Affairs, Military, Labor, …), granted by office/career/lobby.
- **Ideology** (types.ts:5) — 7-point scale `LW Populist … RW Populist`; drifts
  and can be deliberately shifted.
- **Career tracks** (types.ts:43) — 7 tracks; politicians accrue skills/traits/
  expertise over up to 20 years on a track (phase 2.1.2).
- **Faction** (types.ts:1293) — what the player runs. Belongs to a party, has a
  `personality` (LW/Center/RW) and three card decks: `ideologyCards`,
  `lobbyCards`, `interestCards`. Factions drift alignment over time (phase 2.1.8).
- **Party** (types.ts:1306) — two: BLUE and RED. Meaning is **era-specific**
  (see glossary).
- **State** (types.ts:1318) — 13 colonies (states1772.ts) or 31 states
  (states1856.ts); has region, electoral votes, `bias`, `industries`, senators/
  reps/governor; 1772 colonies carry `ccDelegateSlots`/`colonySize`. The `region`
  enum already includes `Caribbean`/`Latin America`/`Pacific`/`Atlantic` — partial
  readiness for the modern 53-state alt roster (DC/Cuba/PR as states; gap-log #55).
- **Offices** (`OfficeType`, types.ts:1111) — President, VP, 7 cabinet seats
  (era-gated by year, `cabinetSeatsForYear`, types.ts:1196), General-in-Chief /
  Admiral, Chief/Associate Justice, Senator, Representative, Governor, Speaker,
  Pro Tem, Committee Chair, Faction/Party Leader, CC President, Ambassador.
- **Elections** (`calcStateVote`; `ElectionContext`, types.ts:697) — 6 contexts:
  presGeneral, presPrimary, house, senatePre17 (both eras use pre-17th-Amendment
  legislature-elected senate), governor, internalParty. PV-driven.
- **Legislation** (types.ts:1506) — factions propose bills routed to one of four
  committees (Domestic/Foreign/Economic/Justice), committee review, then House +
  Senate floor votes (phases 2.6.1–2.6.3).
- **National meters** (`NationalMeters`, types.ts:1399) — revenue, economic,
  military, domestic, honest, quality, planet; tick in the Lingering phase (2.5.1)
  and via events/legislation. The forum's modern bank adds **Party Preference**,
  **per-power relation meters** (8 powers), and **per-ideology enthusiasm** to this
  set, with crisis/cascade rules (gap-log #50).
- **Interest groups / enthusiasm / party preference** — `InterestGroupScores`,
  `Enthusiasm` (ideology×party −5..+5), `partyPreference`: the electoral mood
  substrate. The forum drives these via a formalized **4-part enthusiasm-reshuffle
  + faction-Score** engine (gap-log #51).
- **Era events** (`EraEvent`, types.ts:1466) — interactive scripted decisions
  (phase 2.4.3) with a `decider` (president/congress/cabinet/cc-president/auto)
  and effect-bearing responses; some unlock systems or end the game. 1772 also
  has a data-driven **precondition graph** (`Predicate`, types.ts:1487;
  `ERA_GRAPH_RULES`).
- **Anytime events** (phase 2.4.2) — non-scripted historical/scandal events
  (anytimeEvents.ts, anytimeNationalEvents.ts), era-rate-scaled.
- **Era systems (1772 only, in the build):** Continental Congress
  (`ContinentalCongress`, types.ts:1347; built via phase 2.9.6), Revolutionary
  War (`RevolutionaryWar`, types.ts:1371; battles in 2.7.2), Constitutional
  Convention (`ConstitutionalConvention`, types.ts:1801; sets
  `ConstitutionalArticles`). **Design intent:** war is a *generic* cross-era
  system (War of 1795, Barbary, 1812) — see gap-log #45 — and Constitutional
  change continues post-founding via durable **Amendments** (gap-log #39).
- **Player meta-systems (per-turn passes, phases 2.1.3–2.1.8):** Flip-Flopper
  cleanup, Relocations, Ideology Shifts, Faction Conversions (poaching/signing),
  Kingmakers & Protégés, Faction Personalities/Alignment drift. Each has its own
  rule const block and event feed in types.ts.
- **Cabinet & loyalty (PR5/PR6)** — cabinet appointments scored per seat
  (`CABINET_SEAT_SCORING`); 1856 cabinet members carry `loyalty` that decays in
  the Secession Winter event and can trigger defection.
- **Draft dataset** — bundled "standard draft classes" are **generated** by Node
  scripts (`scripts/`), ~18.5k politicians runtime-loaded from
  `public/standard-draft-classes.json`; users can import custom draftees
  (`ImportedDraftee`, types.ts:1780). Do not hand-edit generated files.

## Glossary

- **PV (Political Value)** — a politician's weighted worth, office-weighted;
  the currency that drives elections (`computePV`/`refreshPv`, src/pv.ts).
- **BLUE / RED** — the two parties; **meaning is era-specific.** 1772: BLUE =
  Patriots / Anti-Federalists, RED = Federalists (factions1772.ts:27-28). 1856:
  BLUE = Democratic Party, RED = Republican Party (factions1856.ts:19-22). Do not
  assume a fixed left/right reading across eras.
- **Faction personality** — `LW | Center | RW`, the faction's coarse lean;
  distinct from a politician's 7-point `ideology`.
- **Era** — engine bucket (`independence/federalism/nationalism/modern`), a
  superset of scenario; used for balance scaling, not just narrative.
- **Half-term / turn** — the loop advances 2 years per full pass of the phase
  sequence; `HalfTermSummary` (types.ts:1762) records per-turn deltas.
- **senatePre17** — election context: both shipped scenarios predate the 17th
  Amendment, so senators are chosen by state legislatures, never popular vote
  (types.ts:696-703).
- **Command** — combat/leadership stat outside the 0–5 skill set; gates military
  command and kingmaker eligibility (`KINGMAKER_RULES.commandGateByScenario`).
- **Kingmaker / Protégé** — a high-Command mentor anoints a young protégé who
  graduates to higher office after ~20 years (`KINGMAKER_RULES`, types.ts:295).
- **Lingering phase (2.5.1)** — per-turn drift of national meters based on
  cabinet/conditions.
- **Sub-floor stats** — failed candidates / era figures in the dataset get
  deliberately weak electoral stats so they rarely win (CLAUDE.md dataset rules).
- **Lobby / Ideology / Interest cards** — the three faction card decks that
  define a faction's coalition and shift over time (types.ts:1298-1300).
- **Southern Unionist (trait) / Secessionists (pool)** *(1856-arc, `hd`)* — on
  secession, pols of seceded/border states go inactive into a "Secessionists"
  pool **unless** they hold the `Southern Unionist` trait; they return on the
  state's readmission. The draft dataset carries the trait on Southern pols.
- **Reconstruction +2-Red bias** *(1856-arc, `hd`)* — a time-boxed (8-yr,
  sunsetting) per-state partisan bias toward the incumbent party, granted by the
  Ironclad-Oath readmission plan; distinct from the permanent `State.bias`.
- **Acting President** *(1856-arc, `hd`)* — when the elected line fails (e.g. a
  foreign-born Speaker is ineligible), the Senate Pro Tempore acts; a **0-Command
  acting president is inert** (no exec actions, can't compel SCOTUS, can't be
  elected). The succession order is itself legislatable.
- **Primary Group (1–5)** *(Primary Era, `hd`)* — states opt into presidential
  primaries (via a Gov action) and are bucketed into 5 sequentially-voting groups;
  once any state opts in, the Primary Era begins (primaries precede conventions).
- **War Score** *(`hd`)* — per-theater Civil-War tally (+1 win / +3 Difficult land
  / −1 loss); **+10 auto-wins the theater**, else a carry-roll continues the war
  next half-term.

## Built vs. Designed — gap log

The heart of this doc; the roadmap is built from this. Rows are grouped by area.
Each is tagged `ingested` (forum-cited via a digest under
`docs/game/playtest-digests/`) or `codebase` (derived from the AMPU source
tree). Digest shorthands: **`gilded`** = the f4c7c2c4 1868 Gilded-Age digest;
**`fed`** = the f55d3e21 1788 federalism digest; **`1772s`** = the 85f8e6b4
1772 solo "aesthetic" digest; **`modern`** = the 3a9ac985 1948→2004+ digest;
**`hd`** (= `house-divided`) = the 77db6e6f **1856-native** 1856→1904 digest
(cited `hd I-n` for its Part-I unique-system sections, else `hd POST n`). A row
marked **(corroborated across N eras)** has been independently observed in
multiple threads — the strongest signal that it is a real, load-bearing rule
rather than a one-off ruling.

> **DEFECTS vs. GAPS.** This table is *missing features* (designed-but-unbuilt).
> Outright **bugs in shipped behavior** live in the separate "Confirmed shipped
> bugs" subsection below — the roadmap should treat those as fixes, not
> features.

### Platform / cross-cutting

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 1 | **Multiplayer** | Single-player: one human faction (`isPlayer`), all others CPU (scenario1772.ts:64, scenario1856.ts:121) | **Multiplayer** — 8–10 human drafters across 2 parties (5 Blue + 5 Red), with handles; CPU factions only fill empty seats; **factions are transferable between humans mid-campaign** and CPU is a true per-faction fallback (`modern`: a new player took a CPU faction and won the presidency days later). (Both solo threads, `fed` + `1772s`, confirm the *same game* is also played solo-with-AI — so solo and multiplayer are two modes of one engine) | Multi-faction human control / turn arbitration; per-player handle + identity; async/seated turns; GM-style narration layer; CPU only as fallback; faction-handover support. (corroborated across 5 eras — very high confidence) | ingested (gilded 1, 12, 26, 113, 298; fed 1, 12; 1772s 1, 11; modern 1, 7, 424, 444; **hd 1, 38, 153, 456, 875; 1856-native**) |
| 2 | **Eras covered** | Two scenarios: 1772 + 1856. `modern` era unreachable | A **continuous campaign** spanning independence → federalism → nationalism → Gilded Age → … → modern; points reset at each era boundary; the **card-count economy rescales** at each boundary; **end-of-era point awards** are paid out | Continuous multi-era timeline (or chained scenarios w/ state hand-off); era enum likely needs `gilded` + `progressive`; per-era card-count table + era-end award rules; **a ~12-step era-boundary boot pipeline** (#68). (corroborated across 5 eras; `fed` 518 + `modern` 1080/1172 + **`hd` show live era transitions at 1868 & 1892, per-era point banking, and era-end awards** — `hd` resolves the prior point-reset open question: points bank per era) | ingested (gilded 1; fed 11, 518; modern 1, 769, 1080, 1106, 1172; **hd I-12, 2151, 2441, 6679-6816, 6681**) |
| 4 | **Era-specific ideology drafting profile** | Static seed factions per scenario; no per-era drafting profile | Each faction's drafting ideology mix updates per era (gilded: Brocklin Lib/Mod → Prog/Lib; federalism is a heavily Mod/Cons era; modern: the procedurally-generated class is hand-tuned to include "some moderates") | Per-(faction, era) drafting profile, or a drift rule at era boundary. (corroborated across 3 eras) | ingested (gilded 1; fed 136, 330; modern 460, 1088) |

### Legislative (committees, bills, crises, budget)

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 8 | **Committee block-and-replace** | Bills proposed → committee → floor (phases 2.6.1–2.6.3). No block-and-replace | Committee chair can **block and/or replace** a bill from their own committee's domain (Block alone kills it); some bills can't be blocked. Chair eligibility requires prior committee service (`modern`: **Leadership OR Legis ≥ 2**). Bills marked with a star/`##` are block-eligible | Add committee-chair "block-and-replace" action with same-committee replacement check + chair-eligibility gate. (corroborated across 5 eras; pervasive — `hd` sharpens the rule: a chair may replace only a bill whose **proposer has LESS Legislative AND lacks Efficient**) | ingested (gilded 160-163; fed 160, 209, 305, 380, 563, 723; modern 46, 285, 1312, 1870; **hd 195-203, 469, 5123**) |
| 9 | **Bill packaging / bundling** | Each bill votes separately | Chair can package multiple committee bills into one floor vote that passes/fails as one; **packages can't be split-voted** (`modern` 1341). Federalism nuance: a chair **won't bundle** a net-negative bill *unless* it's a statehood bill; CPU bundles ~75%. Used as a weapon (`modern`: pair a poison-pill with a desired bill so both die) | Add packaging + vote aggregation; bundling-eligibility rule; no-split-vote constraint. (corroborated across 3 eras) | ingested (gilded 176-179, 188, 194; fed 160, 213, 564-565; 1772s 18, 46, 57; modern 60, 297, 1327, 1341, 2004) |
| 10 | **Filibuster + cloture** | No filibuster | A senate floor leader / eligible senator can filibuster a bill or package; filibustered bills die *or* return next term. Federalism: a **standing rule toggled ON by a law** ("Institute Filibuster", 1792); trait-gated (a Puritan senator). `modern` adds: gate is **Puritan + Legislative > 1** (**not a roll** — you qualify or not); **Disharmonious filibusters twice**; SML calls **Cloture**, which needs **~67%** (ties sustain the filibuster). **`drums` sharpens to "deterministic per-Senator" (no roll)**: specific named pols (Yulee, Morgan, Dorr, Cockrell, Simmons, Sweet) filibuster automatically per trait; **CPUs filibuster crisis legis they ideologically oppose to extend the crisis to election day** (POST 7081); **Iron-Fist CPU Maj Leader auto-cloture** for majority items (POST 5920) | Add `Filibuster` action (one per faction w/ eligible senator); unlocked-by-law gate; `Cloture` counter-action w/ supermajority threshold; filibustered bills persist; **deterministic per-Senator dispatch + CPU-Maj-Leader-IF auto-cloture**. (**5-era cpu-confirmed** — `hd`: Disharmonious filibusters twice; filibustered bills carry to next session and must re-pass BOTH chambers; no Cloture until the Cloture bill passes, ⅔. **Open: package re-filibuster** — Tyler "rules actually don't say" POST 3275) | ingested (gilded 189-194; fed 159, 566, 725, 730; modern 72-91, 1355, 1598, 2015; **hd 222, 242, 498-501, 3500-3502, 5167, 6205, 8166-8167**; **drums 48, 140, 2716, 2871, 3115, 3273, 3275, 4610, 4751, 5103-5105, 5494, 5496, 5920, 5921, 6554, 7081**) |
| 11 | **Crisis Bills + national-crisis state** | `Crisis Admin/Gov` traits exist (types.ts:85-86) but no crisis-bill tag and no national-crisis state | Bills tagged `*Crisis Bill*` *resolve* an active national crisis and **bypass the spending cap**; the nation enters/exits named crises by meter movement. Crisis taxonomy is **era-dependent** (fed: Budget/Economy/DomStab/HonestGov; gilded adds Anti-Naturalization/-Native/-Chinese). `modern` adds **collective accountability**: if a chamber lets *most* crisis bills die, the chamber's controlling party loses Party Pref (or it blames the President, unless a Charismatic save) | Add `Crisis` model + `bill.resolvesCrisis` link + crisis-bypasses-budget rule + crisis-bill collective-accountability penalty; meter-derived crisis entry/exit. (corroborated across 3 eras) | ingested (gilded 160, 164, 167, 176; fed 39, 159, 166, 372, 477, 480; modern 32, 46, 943, 1597, 2015) |
| 12 | **Bill scoring uses *all* faction cards; failed bills also score** | Mixed; needs audit | Legislation scores *every* ideology/lobby/interest card on each faction (opposite cards net toward 0), not just the leader's `ideology`; 1772s adds the **staged tabulation method**. `modern` confirms **failed bills also score** (reverse effects + meter moves) and that scoring also awards **±1 to named pols' reelection** | Verify scorer iterates all three card decks + scores failed bills + applies per-pol reelection deltas. (corroborated across 3 eras) | ingested (gilded 237; 1772s 27, 29, 42, 44; modern 95, 316, 1373) |
| 42 | **Bill typing (Foundational / Spending / Crisis) + budget-gated spending cap + bill-relationship graph** | No type tag on `Legislation` (grep: none); `revenue` ordinal meter only | Bills are typed (`*Crisis Bill*` + `**Spending Bill**` are **independent** tags); **non-crisis spending bills are capped by a per-turn spending budget** — a bill can pass the floor yet be "BLOCKED DUE TO BUDGET" (at Overspending only ~3 pass; ordering matters). **Foundational** bills (Create Dept., Bank) carry special handling. `modern` adds a **bill-relationship graph**: bills carry replace/repeal constraints ("Not repealable", "can only be replaced by X", and **amendment-tier bills repealable only via amendment**); some passed policies are downgrade-only | Add `bill.type` + tag set + numeric per-turn spending budget gating non-crisis spending bills + a bill-relationship/replacement model. (corroborated across 3 eras) | ingested (1772s B4, posts 18, 46, 57; fed 159, 561, 566, 703; modern 32, 46, 92, 284, 2265) |
| 12b | **Executive-Branch-Interference / cabinet-proposed legislation (incl. "free pick-up")** | Not in build | A high-skill cabinet sec proposes extra department-related bills with presidential assent. `modern` formalizes it as **"Executive Branch Interference"**: a cabinet member with **Admin 4–5 (or Crisis-Admin in a relevant in-department crisis)** may propose a dept-related bill, subject to presidential approval; **a new cabinet-department bill spawns a new Cabinet Sec**. 1772s shows the Treasurer "free pickup" variant (double points to proposer + Treasurer; −50 if not picked up). **Under-designed in the forum** (rules were thin/blank, worked out in play) | Cabinet-seeded proposal slot gated by Admin/crisis + presidential-assent step + new-dept→new-seat hook. (corroborated across 3 eras) | ingested (1772s 57; fed 38, 57; modern 32, 1281, 1982, 2038) |
| 54 | **Investigation committees (investigate-a-lobby/interest bills)** — NEW | Not in build | A bill type "Investigate Lobby or Special Interest" forms a **special investigation committee** (special chair + ranking + members) that **rolls for whether enough evidence is found**; the target is always a member of the **dominant party** (not the proposer's). **Explicitly under-designed** — the designer left the rules blank and a **player authored them mid-game** | Add an investigation-bill type + special-committee formation + evidence roll + dominant-party targeting. (NEW — modern only; design hole) | ingested (modern 1294, 1369-1372) |

### Convention & elections

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 13 | **Convention machinery** | Phase 2.9.2 Conventions exists (phases.ts:40); ballot/momentum/promise mechanics absent | Multi-ballot convention: delegate counts per state, major/minor/favorite-son candidate types, nominator-speech d6 → momentum, separate keynote roll, inter-ballot actions (drop-out+endorse, cabinet-seat promises — *rejectable*), unit rule, kingmaker boosts, **convention host sets delegate categories and is favored**, **PL can overrule the nominee's VP pick**. `modern` supplies a **CPU delegate engine** (per-state EV × category multiplier, 4–5 categories, ideology/control-aware; 53 states = **1,300 delegates / majority 651**) and **replacing a sitting VP needs a roll + a "rash/desperate" penalty roll** | Full convention subsystem: ballot loop, inter-ballot actions, momentum scalar, promise tracker, host-advantage, PL-VP-override, delegate-apportionment engine. (**5-era cpu-confirmed**; `drums` is the deepest CPU-AI spec — see #71 for the explicit per-ballot menu, compromise picker, dark-horse). `hd` adds the **presidential-promise DIRECTION rule** [offer-DOWN / request-UP only], **asymmetric R/D thresholds** [Dems 3/4 vs GOP 2/3→½+1, mutable & persistent], **momentum carries across cycles**, and flags the **CPU convention AI as buggy** + the **ballot-shift rule as ambiguous** | ingested (gilded 211, 220-246; fed 90, 202-247, 394-417, 580-606, 714-727; modern 14, 367-398, 1705-1724, 2240; **hd 555, 567, 2010, 3261-3290, 3893-3944, 4646-4726, 5594-5713; ballot-shift 2025-2038; CPU 4686-4690**; **drums 769-786, 1152-1168, 1841, 2552-2566, 3294-3318, 3719, 3737-3766, 4063-4117, 4779-4822, 7229-7244**) |
| 14 | **Platform = 5 planks** | Not visible in code | Platform = 5 planks (Domestic / Foreign / Economic / Judicial / Executive), each a catalog bill/policy; compared between parties for a party-pref swing + enthusiasm shifts; delegable (**Iron-Fist nominee cannot delegate** — `modern`). Fed: **Blue picks planks first, constraining Red**; scoring itemized per faction (3 binary checks). `modern` adds a **failed-platform penalty**: if the incumbent completed **<50% of his prior-term planks**, 25% each of party-wide enthusiasm + party-pref drop | Platform subsystem: planks reference the bill catalog; pick-order + delegation (Iron-Fist gate) + scoring + prior-term completion-tracking penalty. (corroborated across 3 eras) | ingested (gilded 224, 226, 248, 251; fed 238-251, 406-410, 601-602; modern 367-398, 1712, 1728) |
| 15 | **VP impact** | `vicePresidentId` exists (types.ts:1568) | Multi-check VP-impact scoring (~9 binary items: different faction +enthusiasm if lowest-enth, has Mod/Cons/Lib, ≥20 yrs apart, someone >50, someone <60, incumbent same-ticket, an out-of-office "outsider", big+small state, different regions) → party-pref delta; an **obscure-VP d6 reveal table** can give the VP Leadership/Charisma or Disharmonious/Controversial/lose Obscure. **`drums` publishes the canonical 8-element rubric verbatim 4× (deterministic)** (POSTS 5159, 5556, 5983, 6380, 7275): each +1 → VP from another faction; ticket has Mod/Cons/Lib; ticket age spread ≥20 yrs; one ≥50; one <60; exactly one independent / out of office; big-state+small-state; different regions; **Obscure roll** d6 (5-6 lose Obscure / 3-4 keep + add trait); **higher-scoring ticket = Party Pref +1 + dominant-ideology +1** | Add deterministic 8-element VP-impact rubric (the binary checklist) at convention close + VP-reveal d6 table. (**4-era cpu-confirmed**) | ingested (gilded 225, 250; fed 247, 408, 600; modern 369, 396, 1711, 1721; **drums 788, 1183, 1530, 2572, 2904, 3318, 4109, 4435, 5159, 5556, 5983, 6380, 7275**) |
| 16 | **General-election action library + debates + October Surprise** | Not surveyed | Per action phase: "Give a Speech" (target state, roll; Orator separate +1), "Send VP to Shore Up Support" (trait-branched), **Incumbent Using Power of Office** (5-6 → +1 party pref, repeatedly decisive), **Help from the Media** (LW/RW Media card), **President Focuses on a Region** (`Delegator` pres sends VP anywhere). `modern` adds **3 Presidential Debates + 1 VP debate** (Debater +2 / Leadership+Charisma +1 / winner moves party pref), per-debate scandal rolls, and an **October Surprise** roll (**only bites during an active crisis**); incumbent may **kill the debates**. Fed adds the bonus stack: crises-solved (+2), **down-ballot bonus when a party clears 66% of a *state's* popular vote** (per-state), state ties → re-roll | `electionAction` enum + handlers + debates subsystem + October-Surprise roller + the documented bonus stack incl. the 66%-per-state rule. (corroborated across 3 eras) | ingested (gilded 256-265; fed 414, 420-422, 569, 605-609; modern 412, 1726-1739) |
| 17 | **Scandal rolls** | Not visible | 1d6 per major candidate per action phase (and per debate in `modern`); on a hit, magnitude = severity; `Integrity` grants immunity; **`Propagandist` / LW-RW Media can spin/diminish** a scandal (`modern`); offset by incumbency | Add per-cycle + per-debate scandal roller; severity → election malus; immunity/spin traits. (corroborated across 3 eras) | ingested (gilded 255, 262; fed 254, 414; modern 349-366, 1726) |
| 18 | **Meters → election bonus mapping** | Meters tick in Lingering (2.5.1); mapping to election outcomes not surveyed | Each `NationalMeter` value maps to a specific election bonus/penalty; Party Pref → direct numeric advantage. `modern` supplies the **canonical itemized "State of the Meters" table**, published before every election (e.g. EconStab bad → −3 incumbent party; Honest Gov't → **Controversial pols −2 extra**; Q-of-Life → RW-Pop+Mod +1; Planet's Health → Mod +1/Prog −1; per-ideology enthusiasm → per-ideology bonus). **Open design choice** (1772s C1): flat bonus vs. a graduated multiplier with a 3rd-party-at-Neutral rule | Add `metersToElectionBonus(meters)` using the modern table; decide flat-vs-multiplier (human call). (corroborated across 3 eras) | ingested (gilded 266; fed 607-609; 1772s 25, 49, 90; modern 114, 424, 1742, 2061) |
| 19 | **Faithless electors** | Not visible | Random per-state EC desertions add stray votes to off-ticket candidates (`modern`: 3 faithless, 2 CA + 1 ME, EVs to off-ticket pols) | Add faithless-elector roller in EC tally. (corroborated across 2 eras) | ingested (gilded 267; modern 428) |
| 47 | **Presidential primary subsystem (2.9.1)** — NEW | Phase 2.9.1 presPrimary context exists (types.ts:697) but no primary loop | A full subsystem: each faction runs **1 Major** (faction leader / Celebrity w/ Command) + **1 Minor** (anyone w/ Command), each picking **3 focus states**; a running incumbent **can't be primaried**; an **Iron-Fist + Leadership PL blocks intra-party challengers** unless the challenger leans to the other party. Focus-state rolls are **charisma-trait-tabled** (Charisma/Likable/Uncharismatic/Unlikable/Orator/Debater). Candidates get a numeric **Strength** score, then run a **per-Primary-Group loop**: Primary Debate (momentum ±1; **front-runner −2 for losing**) → Scandal Rolls (Integrity immune; Media/Propagandist spin) → **Broke Candidate Check** (forces a drop-out) → Primary Actions (Embrace Issue, Campaign Focus, Major Speech, **Attack**, **Presidential Promise** [rejectable], Withdraw+endorse). **Delegates** accumulate (mix of winner-take-all + proportional); drop-outs **transfer delegates**; primary groups are set by governor "State Primary Placement" actions | Full primary subsystem: candidate eligibility + blocking, focus-state trait table, Strength score, per-group debate/scandal/broke/action loop, delegate accumulation + transfer, primary-group assignment from gov actions. (NEW — modern only) | ingested (modern 340-366, 980-1062, 1646-1704) |
| 48 | **Third-party challenge trigger** — NEW | Two-party engine only | A 3rd-party ticket spawns when **Party Pref sits in the middle 3 boxes** AND an ideology is "discontented with both parties" (sits Neutral): the **discontented faction of the incumbent's party** runs independent (randomize if several); carve-out — if the *president's own* ideology is the discontent one, his party's **lowest-scoring** faction runs. A **Celebrity** 3rd-party candidate appears on the ballot nationwide. (Lower-stakes 3rd-party runs also appear historically, e.g. Carlson 1984.) | Add a 3rd-party-trigger check at the general (party-pref-band + ideology-discontent), spawn an independent ticket from the rule-selected faction, nationwide-ballot for Celebrity | ingested (modern 400-410, 2116) |

### Executive & cabinet

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 22 | **Egghead cabinet advisory + multi-decider / implementation-roll era events** | `EraEvent.decider` is single-role (types.ts) | Cabinet secretaries with `Egghead`/`Efficient` "suggest" choices a Passive/Pliable Pres accepts (cabinet *majority* recommendation); **multi-role implementation** where a secretary "blunders the implementation" but a high-stat Pres bails them out. `modern` confirms across many era events (rescue mission, treaties): implementation handled by highest-Admin/Efficient official via d100 + Easy/Mod/Difficult tiers; **+20% for `Geostrategist`**; a **Controversial** pres who blunders triggers a scandal → −1 next election | Multi-decider model + Egghead advisory step + implementation-roll layer (difficulty tiers, trait re-rolls, blunder→scandal). (corroborated across 3 eras) | ingested (gilded 126-129; fed 29, 65, 475, 496, 575, 702; modern 6-9, 11, 257, 877, 1624) |
| 23 | **Executive Actions library (2.8.1)** | Phase exists; only 4 hardcoded one-shots (phaseRunners.ts ~3636); library + persistence absent | Pres takes N actions/half-term (N varies by traits — `modern`: 4 standard, **Efficient+Domestic Warrior → 5th if domestic**; `Easily Overwhelmed` hands off); **persistent active actions** (green = stays, yellow = auto-deactivates on admin/party change, white = inactive). Large era-specific library; many actions are **gated by a prerequisite policy/government type** (`modern`: Strict Immigration needs a prereq; "Ban Foreign Aid…" needs an authoritarian govt) and **implemented via blunder rolls**. (gilded/fed libraries: Swing around the circle, Monroe Doctrine, Pledge to Serve One Term, …) | Add `GameState.activeExecutiveActions` + library + activate/deactivate-on-admin-change sweep + per-action gating + blunder rolls. (corroborated across 3 eras) | ingested (gilded 201-203; fed 46, 89, 170, 201, 392, 496, 575; modern 100-104, 729, 1390, 2043) |
| 23b | **Exec-action control-handoff chain + multi-manipulator tie-break** | Not in build | When Pres is Incompetent → VP; if VP is Pliable+Passive → a Manipulative cabinet member / Key Advisor *seizes* control. Player flags an **undefined tie-breaker** when multiple Manipulative advisors each qualify | Define control-handoff chain + order-of-operations when several manipulators qualify (open design Q) | ingested (fed 226-228) |
| 25 | **Firing-precedent gate + per-officer tenure rules on cabinet** | Cabinet appointment/confirmation exists; no firing gate | A Pres **cannot freely fire/replace** cabinet until a *firing precedent* is set; until then cabinets are hold-overs across administrations, even cross-party. The **US Bank President can only be removed by a same-faction Pres**. `modern` adds concrete per-officer tenure rules: **CIA** removable at appointment at **25% −mil-prep** unless incompetent/easily-overwhelmed/over-70; **FBI** fixed **10-year term** (fireable); **Fed Chair** fixed multi-year term + service cap; **Key Advisor** locked for the half-term; opp-party cabinet count **capped**; **military auto-confirmed**; **5 may be retained** (CIA/FBI don't count) | Firing-precedent state + per-officer tenure/term fields + same-faction Bank guard + opp-party cap + retention rules. (corroborated across 2 eras) | ingested (fed 41, 119, 131, 177, 354, 392, 454, 547; modern 587-605, 1499-1513, 1903, 2172) |
| 31 | **Cabinet scoring penalties: regional + diversity + intra-party equity** | Cabinet scoring exists (CABINET_SEAT_SCORING, types.ts:1221) | If the Pres's party has *no* cabinet rep from a region, that region gets −1 next Presidential race. `modern` adds two more penalty dimensions: a **diversity floor** ("≥25% women/minorities" avoids penalty) and **intra-party faction-equity** (positions must be balanced across the president's *allied factions* — observed −500/−1000 for imbalance). `drums` corroborates the **5/8-region missing-cabinet -1 penalty** in 1860s-1920s and adds the **cabinet enthusiasm-via-lobbies overwhelms presidential signal** problem (POSTS 877, 880, 3044): 3 Moderate appointees can move Mod enthusiasm +3 the OTHER direction because cards trump individual ideology — partially patched by the **±3 per-phase cap (POST 4574)** | Per-region cabinet-coverage check + demographic-diversity check + intra-party faction-balance check → scoring/election effects + ±3 cabinet-swing cap. (**4-era cpu-confirmed**) | ingested (gilded 112; fed 5, 29, 60, 457, 681; modern 229, 604, 1223, 1512; **drums 877, 880, 2498, 2668, 3044-3065, 3050, 3903, 4006, 4368, 4574, 5290**) |
| 32 | **Cabinet eligibility ties to state status** | `cabinetSeatsForYear` is year-keyed; state-status not visible | A pol from a non-state / not-yet-territory cannot be appointed to cabinet | Cabinet appointment guard on state status | ingested (gilded 103) |
| 49 | **Military-leadership appointment tier** — NEW | `GeneralInChief`/`Admiral` seats exist (types.ts:1121) but no multi-rank military ladder | A distinct military-leadership tier inside cabinet appointments: **Chairman of Joint Chiefs, Army Chief of Staff, Chief of Naval Ops, Generals, Admirals**. **Auto-confirmed** (no Senate vote); **back-filled on promotion**; rank constraints enforced (a general can't be made an admiral); officers passed over for promotion may **resign**; feeds the war system's per-battle modifiers (SecDef + Joint-Chiefs ×2, leading-officer ×10). Iron-Fist pres may fire generals pre-war (20% −mil-prep each) | Add a military-rank ladder to the appointment phase: JCS/Army/Navy chiefs + Generals/Admirals, auto-confirm, promotion back-fill, rank-mismatch + resign rules; wire to the war engine. (NEW — modern only; pairs with #45) | ingested (modern 214-229, 848, 952, 1386, 2172-2182) |

### Governors, states, statehood

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 20 | **Governor's actions library** | Phase 2.5.1/2.5.2 exists but no `governor.takeAction` library | Each governor takes 1–N actions/half-term against a fixed library, rolled vs threshold (~d100 vs 20·`Gov`; **Efficient → +1 action**). Era-flavored sets: gilded (Gerrymander, Women's Suffrage, Jim Crow…), fed (Native-lands, assimilation, criticize Pres…), 1772 (improve industry, set term length). `modern` adds primary-control (**Set Primaries WTA**, **State Primary Placement Group N**, **Split Electoral Votes**), voter-suppression (Purge Rolls / Strict ID / Decrease Polling Stations / Literacy Test — **all blocked while Honest-Gov't maxed**), culture (Ban Evolution, Arm Teachers), and **success can grant +1 Command**. **Some gov actions are ideology-gated** (a non-Mod fails an industry action). `drums` adds **fixed faction-archetype CPU mapping** (Theocrat→Prohibition/Abortion/Ban Evolution; Mining-state→Improve Mining; Liberal/Prog→Strengthen Labor Unions; Reformist→Allow State Primaries; Big-Ag→Major Irrigation) and the **small/large-state action-impact multiplier** (RI at 2.5% half of 5%; large states double — POSTS 6676-6680) | New governor-action enum + handlers + per-action prereqs (incl. ideology gate + Honest-Gov't gate + small/large-state ×0.5/×2 multiplier) + state-status checks + Efficient extra-action + faction-archetype CPU mapping. (**5-era cpu-confirmed** — `hd` adds **skill-match doubles success, 5-Gov autopass, success→10% +1 Command [except autopass actions], national-meter-impact roll, Gov incumbency decay after 8/12 yrs**, and the **"Activate State Primaries"** action [#63]; `drums` adds the static fixed-menu archetype rule, the small/large multiplier, **and the no-industry-stack-awareness gap → no-op silently when capped — see DH-19**) | ingested (gilded 134-150; fed 33, 79, 144, 205, 298, 375, 482, 558, 713; 1772s 25, 46, 56, 90; modern 17-28, 1962, 2234-2245; **hd 125, 889, 2936-2945, 3094, 3134, 6119-6153, 6997**; **drums 30, 372-373, 574, 580, 584, 588, 721, 914-917, 1456, 2516, 2520, 3081-3083, 5894, 6159, 6289, 6519, 6671, 6676-6680, 6888, 7062, 7424, 7532**) |
| 21 | **State-level policy flags + State Bias integer + loyalist fill** | `State` (types.ts:1318) has `bias` but no `policies[]` flag, no loyalist-fill | Persistent state policy switches: Poll Tax, Jim Crow, Prohibition, Women's Suffrage, Segregation, Sanctuary Cities, Political Machine, Gerrymander — toggled by Gov actions / era events; some time-bounded (Jim Crow = 3× points for 30 years). `modern` confirms two more persistent state fields: a partisan **Bias integer** ("Red+3"/"Tossup") shifted by events + census, and an **ideological "loyalist fill"** that **gates gov-action success** (a Gov fails an action because the state is filled with opposing-ideology loyalists; an Anti-Corruption action can clear a Machine) | Add `State.policies` map + duration support; surface `State.bias` as event/census-driven; add a `loyaltyFill`/loyalist-ideology field that gates gov actions | ingested (gilded 125; modern 25-26, 613, 2222, 2245) |
| 35 | **Industry leadership + scoring + per-state term config** | `state.industries` exists; no leader table, no per-state governor term fields | Leading state per industry tracked; points to the faction holding that state's Gov/Sen at half-term close (industry-bill points **only if the state leads**). Governors set **per-state term length + term limits** as persistent state config. **Industry vocabulary is era-dependent** — `states1772.ts` uses fishing/lumber/cotton; the **`modern` industry set is Agriculture / Alt Energy / Maritime / Mining / Finance / Manufacturing / High Tech / Natural Gas**, and industry leadership shifts **per-region** via era events ("Manufacturing −2 in the Midwest") | Leader-table compute + scoring hook; add `state.governorTermLength`/`termLimits`; reconcile industry taxonomy + add a **per-era industry set** (incl. the modern 8); support regional industry shifts. (corroborated across 4 eras) | ingested (gilded 133; fed 35, 79, 193; 1772s 25, 46, 56, 90, B6, B7; modern 13, 619, 1224, 1960) |
| 43 | **Bill-driven statehood + procedural politician generation (dataset exhaustion)** | `admitState` exists (territories.ts); `expansionStates.ts` is a static registry; no bill-driven admission; draft pool is the finite generated dataset | Statehood/Territory **bills** admit land; annexation also via era event/war. When a new state has too few pols, the engine must **generate filler officials**. **`modern` escalates this to a hard requirement:** the ~18.5k real-person dataset **runs out** in the deep-modern era → the GM **switches to procedurally generating rookie draft classes** (~188 pols/class, hand-rolled traits/demographics; he asked for a generation script). **Product signals:** the **name generator must produce plausible, ethnically-varied names and be toggleable** (players rejected silly names), and the long tail needs **procedural portraits** (links to A1) | Wire statehood bills → `admitState`; event/war annexation; **a procedural politician generator** (stats/ideology/traits/demographics distribution, plausible-name engine w/ toggle, portraits) for sparse states *and* dataset-exhaustion filler. (corroborated across 2 eras) | ingested (fed 81, 158, 168, 302, 379, 386, 560, 571, 702, 718; modern 456-468, 1088-1101, 1159, 1771) |
| 44 | **Per-state presidential-election method (popular vote vs legislature-chosen)** | No `State.electionMethod` flag | Several states choose presidential electors by **state legislature**, not popular vote, into the 1790s (CT/GA/MA/NJ/NY/RI/SC in 1796) — decisive in elections. States switch to popular vote individually via era events ("Popular Vote in KY and NC") or a national amendment that forces all states onto popular vote | Add `State.electionMethod` (popular/legislature) flipped per-state by era event and by amendment. (distinct from #21 state-policy flags: this is EC selection mode) | ingested (fed 194, 220, 255, 258, 306-307, 373) |

### Foreign relations & war

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 25b | **Foreign-relations meters (per-power)** | Single-meter set assumed | Separate per-power relation meters; the **roster is era-dependent**: fed = 5 (UK/France/Spain/Prussia/Russia); gilded = 6 (adds China; Prussia → Germany); **`modern` = 8** (UK/France/Spain/Germany/Russia/China/Japan/**Israel**), laddered Neutral → Friendly → Nearly Allies → Allies | Per-power relation meters + era-dependent roster (incl. the modern 8) + era-renames. (corroborated across 3 eras) | ingested (gilded 132; fed 32, 75, 88, 296, 479, 711; modern 12, 618) |
| 26 | **Diplomacy actions (2.7.1)** | Phase exists | Increase Relations (±1), Increase Trade Relations (≥neutral; success → +rev/budget, blunder → −), Extend/Take Credit/Loan (adds debt), **Provoke w/ retaliatory tariff/embargo** (needs Congress until Pres has full tariff power; ≤neutral; −1 relation + chance of WAR) — all rolled per nation by Admin | Four diplomacy handlers + budget/debt integration + war-trigger on provoke. (corroborated across 3 eras) | ingested (gilded 198; fed 45, 88, 311, 388, 491, 572; modern 97-99, 1375, 2040) |
| 27 | **Numeric national budget / surplus / debt** | `revenue` ordinal meter only | A **numeric** national budget/surplus/debt tracked alongside the ordinal `revenue` meter ("national surplus +16"; `modern` "National Debt −5 / deficit −7"); loans add debt; spending bills gated by it; debt can go "too in the hole" | New numeric `nationalBudget`/`surplus`/`debt` field separate from the ordinal meter; feeds the spending cap (#42). (corroborated across 3 eras) | ingested (gilded 200; fed 311, 372, 480, 703; modern 99, 1537, 2042) |
| 45 | **Generic war system (any war, any era)** | `revolutionaryWar.ts` is 1772-scoped | A generic war phase used in every era (War of 1795, Barbary, 1812; `modern` Grenada). Per half-term 1–N battles (`modern`: **naval then land, ≥1 naval win required first**), each with **Chance of Success = base + commander-mil(×10) + (SecDef+JointChiefs ×2) + difficulty + mil-prep(+25) + benchmarks**, d100; **War Score** accumulates (win +1, lose −3); a separate **war-end roll** (`warscore × ~×2 multiplier → %` to lose outright); **Momentum** = turn-vs-turn; defeated commander gains Incompetent + relieved → confirmation/back-fill cascade; loss applies a debuff package (Party Pref −3, **permanent −1 election malus** for the pres). **`drums` reconfirms battle formula across maps 5/8/10/11 + WWI + Mexico** — identical structure (Difficulty + Planning(SecMil+CoS) + Officer×10 + MilPrep + Benchmarks → win%); **auto-win at WS ≥ +11** (POST 5111, 6708); **post-war defeat % = `|WS|×2×10`**; **officer KIA on natural 1** (auto-nominated replacement, unanimous confirm); **catastrophic 100/100**: -3 WS + general loses 1 Mil + Leadership + Military Leader (POST 2728) | Generalize to a `War` model: success-chance formula, naval→land phasing, warscore/momentum/end-multiplier, officer-promotion/Incompetent + confirmation cascade, loss-debuff, **WS≥+11 auto-win, |WS|×2×10 post-war defeat, KIA-on-nat-1, catastrophic 100/100 cascade**. (**5-era cpu-confirmed** — **`hd` is the deepest spec; see #56** for the full multi-theater Civil-War engine + Major/Minor/Operation tiers that this row generalizes; `drums` is the deepest CPU-AI confirmation) | ingested (fed 222, 312, 389, 492, 573; 1772s 20, 22, 48, 60; modern 949-952, 1378; **hd I-1**; **drums 123, 1725, 1728, 1731, 2199, 2539, 2728, 2881-2882, 3278, 3540, 5111-5114, 5353-5357, 6181, 6317, 6571-6572, 6705-6708, 6708, 6924**) |

### Era content (events, amendments, cards, lifecycle)

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 3 | **Issue axes: tariff / currency / civil-service / imperialism** | No tariff / currency / civil-service / imperialism in code | Tariff = **national integer** set by legislation; currency = Gold vs Bimetallism/Free Silver; civil-service / anti-corruption; imperialism. Fed adds the **tariff change-cadence** rule. `modern` confirms tariff strongly: a single national rate, an unlockable **"grant the President tariff power"** exec power (after which there are **no legislative tariff bills**), a repeal→forces-a-tariff-bill consequence, and a re-propose cooldown | Tariff integer + change-cadence + president-tariff-power toggle; `MonetaryRegime` enum + bills; civil-service tree; imperialism flow. (corroborated across 3 eras for tariff) | ingested (gilded 1, 152, 155, 164, 190, 224, 248; fed 38, 250; modern 97, 316, 535, 2258) |
| 5 | **Faction card decks — full per-era library** | `Faction.ideologyCards/lobbyCards/interestCards` exist (types.ts:1298-1300); per-era library not surveyed | Large multi-era card pool; **lobbies activate via events**; a **new card pool appears at each era boundary**, and `modern` adds that the **card *count* per ideology/interest rescales at the boundary** (and can force the Prog/LW-Pop cards to split across 2 factions). The shipped flat pool (Big Tech, Big Oil & Gas, Globalists, LW/RW Media) is anachronistic pre-1900 but **correct for the modern era** | Audit shipped pool; era-gate cards (no Big Tech in 1868; they belong in modern); per-era card-count table; event-driven lobby activation. (corroborated across 4 eras) | ingested (gilded 49; fed 485; 1772s 18, 28; modern 530, 1172, 1200) |
| 6 | **Social-movement activist groups** | No coalition-emergence machinery | Feminists, socialists, communists, prohibitionists, eugenicists, labor activists emerge mid-era and influence the next era | Movement/coalition spawning across eras; new governor actions + bill types | ingested (gilded 1, 150) |
| 24 | **Faction Personalities (2.1.8) — card-distribution algorithm** | Cards exist; distribution + drift rules not in code | **Now fully specified** (1772s B9): (1) a faction's ideology card = the ideology held by the most of its pols; (2) remaining era-minimum ideologies → the faction with the most pols of that ideology; (3) a faction's ideology cards must be **adjacent on the 7-point scale** — gaps resolved by dropping the card with the fewest pols on either side; (4) interest/lobby cards → faction with the most "interested" pols, then disinterested factions top-up with their most-represented interest, **subject to a ≥5-pol floor on the top-up only**; (5) lobbies activate via events. Per-half-term the set drifts (add/lose cards), legislative-record-driven; `modern` confirms the per-half-term add/lose drift with explicit per-faction deltas and that **card counts rescale at era boundaries** (see #5) | Implement the distribution algorithm + per-half-term drift + per-era card-count scaling. (corroborated across 3 eras) | ingested (1772s 5, 15, 28, 53; gilded 49, 323; modern 165, 530, 1468, 1845) |
| 33 | **Foreign-territory acquisition via era event** | `admitState` exists (territories.ts) | Era event grants territories en bloc (Oregon Treaty: BC/WA/OR/ID at once); organized vs unorganized territories precede statehood; State-of-the-Union view tracks held lands | Era-event → territory grant + organized/unorganized status + State-of-the-Union view. (see also #43 bill-driven path) | ingested (gilded 106, 129) |
| 34 | **Census-driven EV changes + Wyoming-Rule apportionment + State Bias reset** | `state.electoralVotes` is static-ish | Events stash EV deltas that apply at the next **decennial census**; fed adds census timing (run decade N, effect N+2) + **focus-rep House seats + relocations**. `modern` adds a **Wyoming-Rule apportionment** (total EVs recomputed, e.g. 706→678; House ballooned to ~601) that also **resets every state's partisan Bias** and adds/removes a focus-rep at census | Pending-census-delta queue + decennial tick + focus-rep seats + a Wyoming-Rule apportionment recompute that resets EV counts + state Bias. (corroborated across 3 eras) | ingested (gilded 125; fed 140, 368, 385, 475, 507, 555; modern 185, 870, 964) |
| 39 | **Constitutional Amendments as durable, separately-ratified state** | `constitutionalConvention.ts` covers the *initial* Constitution; later amendments not surveyed | Amendments pass Congress then go **to the states for ratification**. They durably change rules: term-length, popular-vote-everywhere, VP-vacancy fill, court size, suffrage. **Ratification mechanism + threshold vary by era** (fed/gilded: by state legislatures, often unanimous / "2/3 of states"; **`modern`: by GOVERNORS, fixed count 40 of 53**), and amendments need a **2/3-House supermajority** to pass (382/572). A **grandfather clause** can exempt the sitting officeholder. NB: **a presidential two-term limit doesn't exist until ratified** (still debated in the modern campaign's 2008) | New `amendments[]` state + cross-state ratification vote (era-specific ratifier + threshold field) + 2/3-House pass gate + effect-binding + grandfather support + amendment bill type. (corroborated across 3 eras) | ingested (gilded 159, 164, 173, 188, 276-277; fed 38, 76, 201, 214, 297, 306, 373, 468, 746; modern 15-29, 938, 1278, 1597) |
| 40 | **Faction nicknames / per-era relabel table + deterministic party-rename triggers** | `Faction.nickname` exists (types.ts:1297) | Nicknames evolve per era, gated by the leader's traits/ideology and a "names table" (fed relabels almost every turn). `modern` confirms renames are chosen **from a fixed per-(party,era) menu** (Red: Conservatives/Wall Street Republicans/Plutocrats/Paleoconservatives/Establishment…; plus player flavor like Cuomocrats/ANKA Republicans). **`drums` adds the explicit 3-condition Whig→"Conservative Party" auto-rename trigger** (POST 7406): (1) no Republican Party exists + (2) Red leader has Protectionist lobby card + (3) Blue Party has won 3 presidential elections in a row. New faction names auto-generate by appending "Conservatives" — GM notes lazy default needs configurable name pool (POST 7407). Also: leader-trait-driven rebrands (Easily Overwhelmed → POST 5844; wrong-ideology → POST 5846; identity loss → POST 6110); faction-leader secession forces rename (Pop Sov Dems → Copperhead Democrats; Conscience Whigs → Abolitionists) | Surface the mechanic: an authored names table per (party, era, ideology) + leader-trait gating + **deterministic party-rename trigger function (3 multi-condition predicates)** + per-faction rebrand triggers (leader trait / ideology mismatch / identity loss / secession). (**4-era cpu-confirmed**) | ingested (gilded 298; fed 2, 24, 140, 184; modern 134, 1890, 2163; **drums 87, 226, 233, 337, 856, 1649, 2481, 2482, 2653, 3007, 4523-4524, 4868, 4889, 5039-5040, 5844, 5846, 6110, 7003, 7406, 7407**) |
| 36 | **Stat decay + trait gain/loss at old age** | `MORTALITY_RULES` handles death | At end of half-term, "Old-Age Rolls" can drop a skill by 1 (separate from the death roll). `modern` extends this: old age can also **add a negative trait** (Pliable/Passive/Easily-Overwhelmed/Uncharismatic/Frail) **or strip a trait** (a president lost **Iron Fist** to old age) | Age-keyed table (skill −1 / add-negative-trait / strip-trait), separate from mortality. (corroborated across 3 eras) | ingested (gilded 297; fed 139; modern 132, 1433) |
| 37 | **Defeated-incumbent auto-retire** | Not visible | Defeated presidential/gubernatorial/House incumbents auto-retire at half-term end. Fed: a 6-year presidential-loss malus is amendment-gated. `modern` clarifies the retirement roll **only fires if they ran** (declining to run avoids it — strategic); a defeated Pres/VP also carries a −1 next-election malus | Auto-retirement after losing (only-if-ran); era/amendment-gate the loss-malus; defeat election-malus. (corroborated across 3 eras) | ingested (gilded 297; fed 52, 110, 111, 176, 266, 331, 437, 517; modern 132, 438, 459) |
| 38 | **Auto-Carpetbagger on alt-state moves + relocation cap (build is STALE)** | Carpetbagger trait exists; **`RELOCATION_ATTEMPTS_PER_TURN = 5` (types.ts:247)** | A successful alt-state/overpop→underpop relocation auto-awards Carpetbagger; 1772s: **removed after 10 years**, alt-state moves **don't count against the cap**. `modern` + `hd` confirm the cap is **4 attempted moves/half-term** (alt-state exempt). **★ `hd` is direct proof the forum drives the build:** the designer (`vcczar`) changed the cap to 4 on a player request mid-thread and it went LIVE in the playtest (chunk 120) — **the shipped build is still at 5** (a stale constant; fix to 4) | Auto-apply trait on relocation outcome + 10-year expiry; **change `RELOCATION_ATTEMPTS_PER_TURN` from 5 → 4** with alt-state exemption. (corroborated across 4 eras) | ingested (gilded 36; 1772s 3, 4, 28, 52; modern 147, 1438, 1814; **hd I-1/§0, 7062-7066, 7555**) + codebase (types.ts:247) |

### Leadership pipeline

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 28 | **Congressional Leadership pipeline (2.2.1)** | Phase exists | Speaker, House/Senate Maj+Min Leaders + Whips + **Pres Pro Tem** (`modern`: auto-assigned by seniority); **majority leadership of the dominant party is uncontestable** (the minority side can be challenged by Mod factions); challenges resolved by **weighted/ranked vote**; **committee-chair eligibility requires prior committee service** (`modern`: **Leadership OR Legis ≥ 2**); each role grants ±points + traits. `modern` adds a **CPU committee auto-fill** rule (keep current, even out new, Ranking→Chair). `drums` confirms the **on-win-bundle is asymmetric**: Speaker on win loses Obscure + gains Leadership/Legis+1/Kingmaker; Speaker re-elect Legis+1+Magician; **PPT gains nothing** | Pipeline runner + RCV/weighted vote + committee-eligibility check + role-effect table + Pro-Tem-by-seniority + CPU auto-fill + asymmetric on-win bundle. (**4-era cpu-confirmed**; `drums` is the CPU-AI spec — see #70 for the explicit IRV tie-break ladder + 3-inconclusive-ballot collective endorse) | ingested (gilded 50, 60, 61, 66, 324, 333, 334; fed 3, 447, 539; modern 167-213, 1860, 1870, 2125, 2148; **drums 604, 679-680, 847-851, 1010, 1158, 2657, 2992-2994, 3170-3173, 3419, 3427, 3596-3597, 3885, 4175-4177, 4322-4326, 4667-4671, 4872-4877, 5014, 5272, 5841, 6099, 7349, 7500**) |
| 29 | **Faction Leaders Selected (2.2.3)** | Phase exists | Leader can step down and **anoint** a successor; Passive/unelected → must be replaced; auto-replacement pool is trait-filtered. 1772s supplies the **canonical 6-criterion filter** (ideology-card match → not Incompetent/Lackey/Passive → interest/lobby match → not on track → has Leadership → not Obscure). `modern` confirms the **ideology-card-match requirement** is binding (a leader must hold one of the faction's cards) and that selection is often forced ("your only option") | Anointment flow + the documented 6-criterion eligibility filter (card-match binding). (corroborated across 4 eras) | ingested (gilded 67, 71, 78, 341; fed 56; 1772s 5, 15, 33, 54, 80-87; modern 133, 831, 1202, 1873) |
| 30 | **Party-Leader incumbency fatigue (2.2.4) + on-elect effects + Independence gating** | Phase exists | Long PL tenure → party pref −1 (cancellable by Likable); trait-driven enthusiasm on PL election; PL re-run needs `Charisma`. `modern` adds the full on-elect package: **PL elected by ranked/weighted faction-leader vote (RCV runoff)**; **Easily Overwhelmed disqualifies**; winner gains **Kingmaker + Iron Fist + "+3 in primaries while PL"**, triggers matching-ideology **"Lackeys" flipping to the PL's faction**, and an **Iron-Fist leader may share a card with allies** (except Puritan-led). **Critical era-gate: Party Leaders don't exist until Federalism** — suppress 2.2.4 + inter-party Conversion in `independence` | PL-term counter + RCV election + disqualify-Easily-Overwhelmed + on-elect bundle (Kingmaker/Iron Fist/primary bonus/Lackey flips/card-share); suppress 2.2.4 + inter-party conversion in `independence`. (corroborated across 3 eras) | ingested (gilded 85; fed 351, 655; 1772s 5, 6, 7; modern 213, 562-589, 1497-1498, 1894-1902) |

### Modern macro-state, enthusiasm engine & SCOTUS (NEW — mostly modern-era)

The prior threads saw meters/enthusiasm/SCOTUS in pieces; the `modern` thread
supplies the concrete, mature specifications below — the spine of the modern
election engine.

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 50 | **The named meter bank (concrete set) + crisis/cascade rules** | `NationalMeters` exists (types.ts:1399): revenue, economic, military, domestic, honest, quality, planet | The concrete modern bank, each on a **banded-text ladder** nudged ±1 by phases/cabinet/"Lingering"/"Revision to Mean"/"Volatility"/legislation: **Revenue-Budget, Economic Stability, Military Preparedness, Domestic Stability, Honest Gov't, Quality of Life, Planet's Health, Party Preference** + **per-ideology enthusiasm** + the **8 per-power relation meters**. Dropping a meter into a bad tier **begins a named Crisis** with knock-ons; recovery ends it; meters **cascade** (one level caps/forces another); top-of-meter has hard rules (**Honest Gov't maxed deactivates all Political Machines + Gerrymandering**) | Verify the shipped meter set matches; add banded-text ladders + crisis entry/exit by tier + cascade rules + top-of-ladder effects. (modern is the canonical spec; **`hd` corroborates across a 2nd era and extends it — see #67 for the full ~16-meter bank incl. per-power relations + per-ideology enthusiasm + the inactive "Israel" placeholder + the 9-part Lingering resolution + policy-gated caps**) | ingested (modern 12, 114, 618, 721, 1238, 1537, 1962, 2230; **hd I-12**) |
| 51 | **Faction-enthusiasm / Party-Preference election engine** | `Enthusiasm` (ideology×party −5..+5) + `partyPreference` exist; the driving algorithm is not in code | Every ideology holds an **enthusiasm position on a Blue↔Red track**; **Party Preference** is the master partisan meter. After legislation scoring a fixed **4-part rule** reshuffles enthusiasm by which faction gained most/least for the dominant vs opposition party. A running **faction Score** drives this and pays **end-of-era awards**; a team's **lowest-scoring faction penalizes teammates**. "State of the Meters" then maps the whole bank → per-election bonuses (#18). **`drums` independently confirms the 4-step loop across a 3rd era** (POSTS 50, 86, 295, 442, 2537, 2726, 2879, 3115) — (1) events award/penalize per-faction; (2) **most-points dominant faction shifts +1**; (3) **least-points dominant faction shifts -1**; (4) **most-points opposition +1 / least-points opposition -1**; per-faction enthusiasm shifts: dominant ±1, others ±1 per faction-level comparison. **Era-end scoring rewards** (POST 4477): +5 most points, +3 second, etc. **±3 cap on per-phase ideology swings** (POST 4574) — Tyler patched mid-thread; Mods swung +7 raw → capped at +3. **Cabinet enthusiasm-via-lobbies overwhelms presidential signal** without cap (POSTS 877, 880) | Implement the 4-part enthusiasm-reshuffle algorithm + faction Score economy + era-end awards + lowest-faction penalty + **±3 per-phase ideology-swing cap**; wire to the meter→election map. (**3-era cpu-confirmed**) | ingested (modern 96, 134, 722, 768, 945, 1080, 2039; **hd 1394, 1568, 6535, 7799, I-12**; **drums 50, 86, 295, 442, 877, 880, 647, 813, 979, 1880, 2537, 2726, 2879, 3044-3065, 3115, 4477, 4574**) |
| 52 | **SCOTUS subsystem (named-Justice docket + court-packing + compelled votes)** | `Chief/Associate Justice` offices + a confirmation path exist; no docket, no court-size dynamics, no compel mechanics | A full subsystem: a **named-Justice docket** (real cases; each Justice votes Yea/Nay by ideology; outcomes steered to/away from history, flagged "ahistorical"); **Chief Justice may delay** a case; **Iron-Fist/Manipulative president compels a Justice's vote or retirement** (separate court-vs-game rolls; **12-yr minimum service**; conditional-retirement bargaining); **dynamic court size** (court-packing bill: appoint extra when an incumbent hits 70; ≥target ⇒ 70+ retirement shrinks the court; bills to set the Justice count); **appointee ideology reveal on joining** + **shift after 10 yrs**; confirmation needs **64/60%** with a **failed-nominee → moderate/other-party auto-confirmed** recovery (no Orator/Debater swaying); **rulings deactivate now-unconstitutional laws**. `hd` extends: a **5-5 tie affirms the lower court & sets no precedent**, and a ruling can **block a whole class of legislation until an amendment passes** (*Pollock* → no income-tax bill until the Income-Tax Amendment). **`drums` confirms the 10-year drift mechanic verbatim** (POST 7533): **25% mid / 10% left / 5% right every 10 yrs; Puritan blocks all shifts** (this is the canonical drift rule, refines the row); also: **Pollock v Farmers Loan** + Income-Tax Amendment lineage confirmed in 1895-1898 (POSTS 4596, 4607, 4741, 4956, 4962) + **Manipulative Pres compelled retirement = d6 5-6** (POST 1142, ~33%); SCOTUS sway = ONE vote per swayer + only if initial vote not unanimous (POSTs 4591, 4741, 5079); **Iron-Fist Pres compels cross-party justices without Integrity to vote Nay** (POST 6293) | New SCOTUS module: case docket + ideology-vote model + compel-vote/compel-retire (Iron-Fist/Manipulative; **5 Judicial + Integrity = immune**) + dynamic court size & packing + appointee reveal/**10-yr drift (25%/10%/5% mid/left/right, Puritan blocks)** + confirmation+recovery rules + ruling→law-deactivation hook + ruling→law-class-block-until-amendment + Manipulative-Pres 33% compelled retire. (**3-era cpu-confirmed**; `drums` is the canonical drift-percentage source) | ingested (modern 30-31, 105-113, 277, 324-339, 911, 974, 1280, 1418, 2046, 2250; hd 4616-4632, 7250, 8181, 8536, 8651; **drums 39, 118, 378, 462, 726, 1142, 1322, 1465, 1675, 3660, 4591, 4741, 4956, 4962, 5079, 5895, 5896, 6293, 6815, 6977, 7533**) |

### 1856-arc systems: Civil War, Reconstruction, secession (NEW — `hd`-only)

The `house-divided` thread is the **first 1856-native procedural record** and the
**only source for the antebellum → Civil-War → Reconstruction → Progressive-finale
machinery**. These rows are not surfaced by the prior four threads. The shipped
`scenario1856.ts` / `eraEvents1856.ts` spine **ends at the Trent Affair (1861)**
and has none of this — the war the campaign plays is host-improvised content.

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 56 | **Civil War two-theater combat engine + tiered war framework** | No Civil War model; `eraEvents1856.ts` ends at Trent Affair (1861); `revolutionaryWar.ts` is 1772-scoped | A multi-term subsystem **separate from the turn loop**: **two theaters (East/West), both fought; 3 naval wins gate ground combat**; per-battle `success% = base − difficulty + planning(SecWar+SrGeneral / SecNavy+SrAdmiral) + officer(Mil×10, +10 Decisive) + meters(+15) + benchmarks(+15)` → d100; **per-theater War Score** (+1 easy/naval, +3 Difficult land, −1 loss; **+10 auto-wins**; else end-of-phase roll vs WarScore×mult to carry to next half-term); **named historical battles kill named military-track pols** (both sides); officers gain Leadership/Military-Leader/+Mil/Decisive/Celebrity; **`Naval experience` ≠ a `Naval` trait** (gates Admiral). War-active globals (incumbent −2 elections at crisis DomStab; opp-VP penalty −1). **Union win**: Treaty of Appomattox, +250 to 6 lobbies, **President gains a PERMANENT +1 in ALL elections**, seceded states → Reconstruction, 25% guerrilla-war roll. **War-hero down-ballot +1 in every state if a major war ended <20 yrs prior.** Same engine runs **tiered Major / Minor / Operation** wars (×-multipliers + reward packages differ): China Naval War, Red Cloud's War, Spain → Puerto Rico; allies assist. **`drums` independently confirms the formula end-to-end** across maps 5/8/10/11 + Eastern + Western theatres + Utah + WWI + Mexico (all theatres + tiers) and adds: **WS≥+11 auto-win** (POST 5111, 6708); **naval-N-then-ground gating is per-war** (Mexico=3, WWI=2); **post-war defeat = |WS|×2×10%**; **officer KIA on natural 1** auto-replaced unanimously; **catastrophic 100/100**; **Treaty A-D tiers + Basic vs Special routing by Admin** (POST 6928); **WS-momentum bonus +1/-2 turn-vs-turn** | Build a generic multi-theater `War` model with the success-chance formula, naval→land gating (per-war N), per-theater WarScore + auto-win + carry-roll + post-war-defeat formula + KIA-on-nat-1, named-battle casualties on the military track, war-end reward package + permanent presidential election bonus, war-hero <20yr bonus, and a Major/Minor/Operation tier with per-tier multipliers, **+ Treaty A-D tier + Basic-vs-Special routing**. (Generalizes & deepens #45/#49; this is the canonical multi-theater spec; **drums reconfirms across 5+ wars + 2 additional eras**) | ingested (hd I-1; POST 527, 888, 1196, 1325-1332, 1396, 1408, 1710, 1723, 1871-1979, 2985, 3195, 3942, 4767; **drums 123, 1645, 1725-1731, 2199, 2539, 2728, 2881-2882, 3278, 3540, 5111-5114, 5353-5357, 6181, 6317, 6571-6572, 6705-6708, 6710-6712, 6928, 6924**) |
| 57 | **Reconstruction readmission subsystem (+ amnesty law) + END exec action** | None | After Union victory, ex-Confederate states sit **under Military Reconstruction** (occupation/districts, President-appointed military Governors on 2-yr terms, **no congressional representation**). **Readmission is a per-state BILL** through the normal pipeline; passage re-enters the state and **fires Gov/Rep/Senate elections**. **Three readmission plans** (Exec Action): Ironclad-Oath (**+2 toward incumbent party for 4 cycles / 8 yrs**, a time-boxed event-sourced bias) / Military Districts (requires 14th-equiv ratification; ex-Confederate pols barred until pardon) / Pardon-Soldiers (rank-and-file). The **+2-Red bias SUNSETS** (mid-1882 for AR/MS/SC/TX/VA) and readmission **adds Black voters** (can flip down-ballot; first Black governor), after which Southern Govs deploy Jim-Crow/literacy/disenfranchisement Gov actions. **Amnesty is contested law**: strip-leaders bill **removes named CSA leadership pols from the game** and **returns other pardoned pols to their origin factions** (prune broken Kingmaker pairs). **Moving INTO a reconstructed state doubles the Carpetbagger chance**. **`drums` adds the Reconstruction END exec action** (POST 2812, NEW): "Voters Tire of Costs of Reconstruction" event → AG Admin roll vs threshold (Taylor 67/100 = success) → **+100pts to RW Activists / Trads / RW Pop / Cons; -100 Civil Rights**; triggers **White League / Red Shirts** paramilitary event A/B; Reconstruction Riots if continued. Also: **no default penalty for returning Confederates** = critical balance hole (POSTS 1742-1752); **Persistent +2 Red election bias** dominates 1864/68 (POST 2269); **14th Amendment effect** shifts Deep South state bias 1 toward incumbent party (POST 1833); **Lenient 10% Loyalty plan** = judicial bill (POSTS 2524-2535) | Add a Reconstruction state-status model (occupied / military-gov / readmitted) + per-state readmission bills that gate election unlock + a time-boxed bias modifier + the 3-plan exec action + **Reconstruction END exec action (AG-Admin roll + lobby payouts + White League/Red Shirts trigger)** + amnesty law that removes-or-returns pols + the carpetbagger-doubling hook + a **returning-Confederate penalty (currently absent — pick from voting-ban / +9-to-victors / one-phase-delay / auto-Articles)**. Pairs with #21 (state policy flags) and #58 secession gate | ingested (hd I-3; POST 1182-1194, 1960, 1987-1988, 2111-2120, 2320-2332, 2445, 2589-2670, 2979, 3024, 3094, 3532-3561, 4179-4297; **drums 1703-1746, 1833, 2027-2047, 2188, 2269, 2472, 2524-2535, 2578, 2698, 2716, 2812, 4569, 4571, 4718, 4729**) |
| 58 | **Secession + Southern-Unionist / Secessionist trait gating** | `scenario1856.ts` has Secession-Winter loyalty decay but no secession-trait gate or Secessionists pool | Secession is a **scripted Era-Event chain** (here triggered by a **bungled presidential decision** — Seward blundering John Brown's Raid → "automatic secession convention and Civil War"). The CSA forms as an event (11 states + separately-handled border states DE/MD/KY/MO). A **per-politician secession roll** makes pols of seceded/border states **inactive (a "Secessionists" pool) unless they hold `Southern Unionist`** (`Nationalist` → a roll to stay); **newly drafted/career-track pols from those states auto-join the Secessionists** — the draft dataset carries the trait. **Can't relocate INTO rebelling states.** The CSA gets its own event-seeded Pres/VP/generals/capital | Add a `Southern Unionist` / Secessionist gate: a secession event chain (decision-blunder-triggered), a Secessionists inactive pool keyed to seceded/border-state membership + the trait, draft-pool tagging, a no-relocate-into-rebel-state rule, and CSA officeholder seeding. (Dataset already needs the trait on Southern pols) | ingested (hd I-2; POST 1166-1175, 1422-1452, 1469, 1495, 1607, 2152) |
| 59 | **Free/Slave sectional-balance crisis scoring (Nationalism crisis engine)** | `SLAVE_STATES_1856` const exists in types.ts; no sectional-balance scoring/meter | The defining Nationalism crisis: when **free states outnumber slave states**, a half-term-close penalty fires — **Speaker & Pro-Tem −250 + −1 next election; all Moderate factions −250; DomStab −2; Party Pref +2 Red; Civil Rights +250 / RW-Activists −250; all RW-Activist candidates +2 next election**. **Removed entirely once slavery is abolished** (13th-Amendment beat). **`drums` independently confirms** the same penalty package in a 2nd campaign and adds CA-split-into-Upper+Lower-California as a balance-preservation move (POST 758) | Add a sectional free-vs-slave state counter feeding the listed score/meter/election effects, keyed to the Nationalism era and **retired on emancipation**. (Uses the existing `SLAVE_STATES_1856` set; **2-era cpu-confirmed**) | ingested (hd I-4; POST 302, 747, 1070, 1766; **drums 758, 1362, 1511**) |
| 60 | **Canada conquest → era-gated statehood + Canadian draft + Canada election penalties** | `expansionStates.ts` lists all Canadian provinces (region 'Canada'); no era-gated admission rules, no Canadian draft pool, no Canada election penalties | War can **annex Canada**; provinces then enter via the territory→statehood **bill** pipeline, **era-gated** (1856: Quebec→statehood directly, Ontario must be a territory first, NF/NM/Utah locked until Gilded). Annexation triggers a **special Canadian draft (~70 historical Canadian pols)**; **Canadian-born pols can run for President once all of Canada is in the US** (relaxes native-born). **Canada-states electoral penalties:** a candidate unpopular in Canada takes **−3 in Canadian states**; a cabinet with **no Canadian member → −1 for the President in Canada** | Add per-(state, era) admission gating to the statehood pipeline (#43); a region-keyed bonus draft pool (Canada) on annexation; relax native-born once a region is fully annexed; add the Canada-region candidate/cabinet election penalties. (Roster already in `expansionStates.ts`) | ingested (hd I-5; POST 528-531, 787, 916-933, 1301-1321, 2009, 3731, 3942, 4154) |
| 61 | **Succession / eligibility / acting-president (foreign-born + line-of-succession + 0-Command)** | `vicePresidentId` exists; no eligibility gate, no configurable succession line, no acting-president state | Two crises expose gaps: a **VP vacancy cannot be filled pre-25th-Amendment** (seat stays empty until a "Fill VP Vacancy" amendment ratifies, applying only to the next vacancy); a **foreign-born Speaker is constitutionally INELIGIBLE**, so on a Pres+VP double-death the **Senate Pro Tempore becomes ACTING President** — and a **0-Command acting president is fully inert** (no exec actions, can't compel SCOTUS retirements, ineligible to be elected). **Line of succession is set by passed legislation** (Speaker vs SoS as 3rd-in-line, changed twice). **Foreign-born faction leaders are ineligible for the Presidency** | Add native-born/foreign-born eligibility gating the presidency (and convention Major candidacy), a **configurable line of succession** (legislatable order), and an **acting-president state** whose Command (often 0) governs what they can do; era-gate the VP-vacancy-fill on the amendment | ingested (hd I-6; POST 4472-4480, 5414-5471, 5466, 5470, 5573, 5581, 7795) |
| 62 | **Contingent House election + tied-chamber control rules** | Two-party EC tally only; no contingent-election path | On no EC majority, a **contingent election in the House**: **each state casts 1 vote** by its House delegation's majority party (tie → Governor's party); **Senate elects the VP**. **House-rule deviation flagged:** GM uses **top 2** candidates, overruling the 12th Amendment's **top 3** ("Game rules") — **build must pick a stated rule.** Edge case: a **tied House** is controlled by **whoever does NOT control the Senate** (inverse tiebreaker) | Add a contingent-election path (1-vote-per-state by delegation, Governor tiebreak, Senate-elects-VP) with a **configurable top-2-vs-top-3** cutoff + the tied-chamber inverse-control rule | ingested (hd I-7; POST 5713-5762, 5720-5721, 6229, 6257) |
| 63 | **Primary Era — state-opt-in primaries → Presidential-Primary Groups 1–5** | Phase 2.9.1 presPrimary context exists; `modern` (#47) specifies a primary loop but `hd` adds the **emergent state-opt-in calendar** | A **Governor action "Activate State Primaries"** turns a state into a primary state (**WTA / plurality / proportional**) and assigns it to a **Primary Group 1–5** (random roll); once any state has them, the game enters the **Primary Era** (primaries precede the convention), spreading by bill/Gov-action until all states have them. The designated Gov also buckets states into **5 delegate Classes**. **Groups vote in sequence**; **Momentum carries between groups but halves when large**; per-group debate scored numerically; per-group actions (3 Focus States, Presidential Promise, Embrace Local Issue, Withdraw+endorse/release/hold, Major Speech, Attack); **Broke check** drops trailers; **incumbent-block** (Iron-Fist+Leadership 90%). **Resign-to-run** cascade. **`drums` confirms across a 3rd era + adds the CPU-AI spec** (see #75): fixed action template (Speech+Focus+Attack+Embrace+Promise) with 1d6 per action; **attack target = highest-PV rival regardless of context** (no underdog logic); **presidential-promise acceptance** requires target < half delegate target needed (POSTS 7173, 7184); **frontrunner determined by Party Leader's faction** (out-of-power) / faction-running-a-major-with-highest-points (in-power); **primary winner is the frontrunner** once primaries exist, overrides PL bonus (POST 6754); **broke roll** 1d6 5-6 → drop out; primary-state Groups 1-3 cap at 3 each, then round-robin (POSTS 5708-5732, implementation undocumented); McGovern-Fraser triggers (15 states) vs Women's Suffrage 1920 (all states) **inconsistent** | Extend #47 with the emergent primary calendar: a "Activate State Primaries" gov action (WTA/plurality/proportional + Primary-Group assignment), a Primary-Era flag flipping primaries-before-convention, the 5 delegate Classes, the per-group sequence/Momentum-halving/debate/broke/actions loop, the resign-to-run cascade, **and the explicit CPU template (#75)**. (**3-era cpu-confirmed**; designer flagged CPU AI as under-tuned, POST 7135) | ingested (hd I-8; modern #47; POST 6879, 6900-6907, 8103, 8200-8237, 8530, 8947-9051; **drums 5125-5132, 5159, 5174, 5511-5523, 5537, 5708-5732, 6754, 6755, 7135, 7154, 7163-7184, 7195, 7207**) |
| 64 | **Amendment ratification by 3/4 of Governors — era-keyed AND in-game-tunable** | `modern` (#39) has ratification by Governors at a fixed 40/53 | 1856 ratification = **3/4 of state Governors** (after 2/3 of both chambers); the threshold is itself a **tunable in-game mechanic** with a full options table (2/3 +Mods; 50%+1 +Progs; Unanimous +Trads; Popular-Vote +Progs/Reform), and the in-game default **drops to 2/3 of states in the Gilded Age**. So the ratifier + threshold are **era-keyed and changeable by passed amendment**, not a fixed constant | Make #39's ratifier + threshold an **era-keyed, in-game-changeable field** (Governors at 3/4 in 1856 → 2/3 default later), with the documented options table as the menu | ingested (hd I-9; extends #39; POST 503, 518, 1721-1722, 2974) |
| 65 | **Investigation "3.0.40" — authored 5d6 special-committee spec** | Not in build (#54 flagged it as a design hole with blank rules) | The concrete spec #54 was missing: Speaker forms a committee (Chair + Ranking + 3); **roll 5d6** + mods (**−2 target has Leadership; +1 no member shares target's faction; +3 target ideology >1 slot from all same-party members; +4 target Controversial**); **21–25 ⇒ guilty (resign, barred from cabinet)** + integrity/leadership/honest-gov ripples. (1856 stopgap borrowed Court-Martial d6 rules before this existed) | Implement #54 with this 5d6 formula + thresholds + on-guilt effects (and the Court-Martial-d6 fallback) | ingested (hd I-10; fills #54; POST 202, 2585, 2591, 2651) |
| 66 | **Progressive institutional layer (Fed Chair / CoS / CNO / FBI) + offices created by law** | `cabinetSeatsForYear` is year-keyed and fixed; no in-game office creation | Offices are **created in-game by legislation/exec-action**, evolving the cabinet to ~21 posts: **Federal Reserve Chair** (6-yr term; creating the Fed **deactivates the Independent Treasury**); **Chief of Staff** (+1 exec action) and **Chief of Naval Operations** (replaces Senior Admiral, 4-yr term; each grants +1 Command); **FBI Director** (10-yr term, Senate-confirmed, doesn't count vs the 5-retention cap); **Commerce & Labor split into two departments**. Many decline ~90% if they previously held elected office; PMG must be same-party + Kingmaker | Support **bill/exec-action-created offices** with their own term lengths + eligibility + decline rules + side-effects (Fed deactivates Independent Treasury; CoS/CNO grant +1 Command); generalize the cabinet beyond a fixed year-keyed seat list. (Extends #25/#49) | ingested (hd I-11; POST 6963, 6976, 7160, 7348, 7800-7804, 8175, 8845) |
| 67 | **~16-meter Lingering bank (per-power relations + enthusiasm + Israel placeholder) + policy-gated caps** | `NationalMeters` has 7 meters incl. `planet` (types.ts:1406); no per-power relations, no per-ideology enthusiasm meters, no Israel | The full bank: Revenue-Budget, Economic-Stability, **8 foreign-relation tracks** (UK/France/Spain/Germany/Russia/China/Japan + **"Israel" present but INACTIVE/0** — the resolver prints "Skipping Israel — inactive"), Military-Prep, Domestic-Stability, Honest-Gov, Quality-of-Life, **Planet's-Health** (activated 1890 by an Era Evo, in a 19th-century scenario), Party-Preference, + **7 per-ideology enthusiasm tracks**. Foreign meters are **era-gated** (activated as nations become relevant; Israel's trigger unknown). **2.5.1 Lingering = a deterministic ~9-part resolution** (econ extremes → maxed-caps **Mil Prep & Planet Health = 8** → lingering effects → middle-drift −1 → volatility → tax/tariff decay [bills expire 10 yrs; tariff locked 8 yrs] → per-officer admin modifications → wars → corruption). **Policy-gated caps:** QoL ≤ 7 without national Healthcare; Honest-Gov 8 → Controversial −1 election; Honest-Gov 9 → no Gerrymander/machines. **`drums` independently corroborates across a 2nd era** (POSTS 6883-6885: Honest Gov capped at 8 while any political machine or gerrymander is active; 9/10 only with Fair Districting + anti-corruption) and adds that **Arkansas Progressive AUTHORED a runnable script for the Lingering phase** (POST 7526) — categories Maxed-Out Meters / Lingering Meters / Middle-of-Meter Movements / Volatility Rolls / Administrative Meddling — **implementation reference for the build** | Extend #50: add **era-gated per-power relation meters** (incl. an inactive Israel placeholder) + **per-ideology enthusiasm meters** to the bank, the **9-part Lingering resolution order**, hard caps (Mil Prep/Planet Health = 8), tax/tariff decay timers, **policy-gated meter caps** (Healthcare→QoL, Honest-Gov→machines/gerrymander), **and absorb Arkansas Progressive's runnable Lingering script as the canonical resolution order**. (**2-era cpu-confirmed**) | ingested (hd I-12; extends #50; POST 6431, 6863, 7216, 8503, 8896, 8897; **drums 50, 86, 295, 442, 2509, 3074, 6280, 6883-6885, 7526**) |
| 68 | **Per-era faction-point banking + ~12-step new-era boot pipeline** | No era-to-era carryover; flat phase loop in one scenario | At each era boundary (1868, 1892) a **heavyweight ~12-step boot pipeline** runs: end-of-era awards + **faction-point reset to per-era banks** + faction trades + a full 2.1.x→2.3.1 re-run + new card/draft/SCOTUS pool. **Resolves the prior open question: points DO bank per era** (the cumulative scores seen mid-Gilded were within-era, banked at the boundary) — the per-era banks likely sum to the cross-era win total | Add an era-boundary boot pipeline: end-of-era award payout + per-era point bank + faction trades + full pre-turn-phase re-run + content-pool swap. (Confirms/extends #2; resolves the era-reset open question) | ingested (hd I-12-adjacent; confirms #2; POST 6679-6816) |
| 69 | **"3 traits + 3 alt-states" draft re-rule** | Draft grants rookies random traits/alt-states (count not surveyed) | At the 1868 draft ("Ted's revisions") rookies now get **3 random traits + 3 random/alt-states** (down from 5/5 in earlier threads). **Open: is 3/3 canonical going forward?** Pick-position skill bonuses + **reverse-total-PV order** confirmed | Decide + apply the rookie trait/alt-state count (3/3 per the latest playtest); confirms reverse-PV draft order + pick-position bonuses (#38-adjacent / drafter-ordering open Q) | ingested (hd POST 3, 2155) |

### Presentation / UX (from the 1772 "aesthetic experiment")

The 1772 solo thread exists specifically to prototype the **look and feel** of
the eventual computerized AMPU. Its thesis: *a political sim wearing
fantasy-sports / trading-card clothes with an old-school almanac vibe.* None of
this is a deliberate visual language in the shipped UI (functional pages only).

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| A1 | **Politician portrait / art pipeline** | `Politician` (types.ts) has no image/portrait field; no card view | Hand-authored art for marquee figures + **CK2-style procedural portraits** for the ~18.5k long tail. **Hard stance: no AI-generated imagery or text in the shipped product** (AI used only as a proof-of-concept stand-in). **`modern` reinforces:** the dataset runs out in deep-modern → procedurally-generated pols (#43) need procedural portraits too, so the portrait system must cover *generated* pols, not just the real dataset | Add a portrait field + a procedural-portrait system covering generated pols; commit to no-AI-in-product art direction | ingested (1772s 13, 14, 51, 860; modern 456, 1771) |
| A2 | **Canonical ideology→color palette (cross-cutting)** | `components/Meter.tsx` colors meters; no documented 7-ideology palette reused everywhere | A canonical ideology→color mapping (Prog/Lib/Mod/Cons/Trad/RW-Pop legend) used consistently across roster, congress, maps, score sheets. Color-coding is core to both *reading* and *playing* (it makes Committees tractable) | Define + apply one ideology→color palette app-wide | ingested (1772s 12, 25, 70, 71) |
| A3 | **"Sport-card" politician infobox + styled persistent scoreboard** | `Roster.tsx` is tabular; scoring has `HalfTermSummary` (types.ts:1762) but no marquee leaderboard view | Per-politician character "sport card" (portrait/traits/stats/PV/office) + an always-on styled scoreboard rendered each turn | Add a card component + a persistent scoreboard view | ingested (1772s 13, 14, 15, 22, 53) |
| A4 | **Legible battle-card with additive-odds breakdown** | Rev-War dashboard exists (`RevWarDashboard.tsx`); whether it surfaces the additive odds breakdown is unverified | A battle card showing the itemized to-hit math (difficulty + planning + commander + meters + benchmarks → % victory) | Verify/add the additive-odds breakdown in the war UI (pairs with #45) | ingested (1772s 22, 48, 60) |
| A5 | **Era/colony-specific office titles** | Generic "Governor" label | Period-correct executive titles ("President of the Supreme Executive Council of Pennsylvania", "1st President of Delaware", …) per colony and era | Per-(office, era, state) title strings | ingested (1772s 25) |
| A6 | **Honorific-memory + "remembered for…" legacy lines** | Not in build | Persist a politician's prior-office honorific ("Senator X") for use in narration, and award durable legacy/epitaph lines from era-event participation | Add honorific-memory + legacy-line fields driven by office history + era-event participation | ingested (1772s 16, 17, 18) |
| A7 | **Election-result maps + popular-vote atlas + era-correct flags** | No election maps; no era iconography | Election-result maps + era-correct flags as set-pieces. `modern` shows the bar concretely: players hand-build **yapms.com / Election-Atlas maps** and the GM hand-produces a **per-state popular-vote % table + national totals** every presidential election — the build should generate this 53-state map + popular-vote atlas automatically | Map renderer + per-state popular-vote atlas + era-iconography assets | ingested (1772s 23, 24, 40; modern 131, 438, 1082, 1749) |
| A8 | **Narration density / voice** | `EraEvent` text fields exist (types.ts); generated-log voice unverified | The build's generated log should aim for the forum's in-character narration density (verbatim historical flavor + editorializing asides) | Verify `log.ts` output voice against the forum bar | ingested (1772s 9, 18, 37, 56) |
| A9 | **Persist + auto-fill House candidate slates & committee rosters** — NEW | Election + committee assignment exist; no persistence of slates across cycles | At modern scale (House **~572-601** under the Wyoming Rule, Senate 106) the **manual** House-election and committee-staffing phases are the dominant tedium — the forum's RepElections tab is **wiped every cycle**, players keep companion files, and **a human quit over it**. **Hard requirement:** persist a faction's House candidate slate + committee rosters across cycles and **auto-fill/carry-forward** by default | Persist `House` candidate slates + committee rosters in the snapshot; default to carry-forward + bulk auto-fill; this is a *scaling-wall* requirement, not cosmetic | ingested (modern 115, 185, 419-421, 1281) |

### Data-model / dormant

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 41 | **`modern` era is dormant** | Rule tables carry `modern` rows (mortality 507, leadership 460, anytime-events 1076, trait bands) | Implied late-timeline play; **`modern` is the fully-tuned end-state** the 1948 campaign plays (2004→2020) — the richest era — *and* the Gilded-Age era likely wants its own value | Activate `modern` with a modern scenario; likely split the long timeline into `gilded` + `progressive` + `modern`. The `modern` rows are no longer hypothetical — there's a 2276-post spec | codebase + ingested (gilded 1; modern 1, 769, 1106) |
| 46 | **Foreign-volunteer / generated pols routed by score+ideology** | `ImportedDraftee` exists (types.ts:1780); no "event introduces a future-draftable figure" flow | Foreign volunteers (Lafayette, von Steuben) are **scheduled into a future draft class** (Lafayette draftable 1784) and assigned to the **lowest-scoring faction allowed to draft that ideology** | Event → future-draftable figure routed by score + ideology | ingested (1772s 37, 56) |
| 55 | **53-state alt roster + modern apportionment + two-home-state pols** | `states1772.ts` (13) / `states1856.ts` (31); `state.electoralVotes` static; a pol has one home state | The modern timeline runs **53 states** incl. **DC, Cuba (CU), Puerto Rico (PR)** as full states; **House ~572-601 (Wyoming Rule), Senate 106**; per-state **Bias** + EV recomputed at census. `modern` also shows **politicians with two home states** (an alt-state add at draft, e.g. "AOC (NY) adds CO") affecting relocation/Carpetbagger + kingmaker chaining | A modern state roster (53, incl. annexed states); modern apportionment (Wyoming-Rule House size + 106 Senate); politician **multi-home-state** support | ingested (modern 426, 438, 462, 495, 1785, 2240) |

## Confirmed shipped bugs

**Defects in existing behavior + design holes** (roadmap = fixes, not features).
`BUG-*` are shipped-code defects (surfaced by `fed`, verified against the codebase
where quick); `DH-*` are **GM-confirmed rules gaps / design holes** from the forum
where the rulebook had no answer (these are design defects to spec, not crashes).

| # | Bug | Symptom | Root cause / status | Source |
|---|---|---|---|---|
| BUG-1 | **Era events don't deactivate for non-1772/1856 start years** | A scenario whose **start year is past an era** still has that era's events in the roll table, *and* (per the official ruling) events deactivate **only** if the start year is past the era — so e.g. an **1800-start game wrongly loses the Louisiana Purchase**. Stale events also dilute the roll table | The 1856 path calls `buildEraEventsForYear(year)` with **no era-vs-start-year filter** (phaseRunners.ts:2817). **Latent in the shipped build** (only 1772/1856 ship today) but a hard blocker the moment a federalism/1800 scenario is added. Wants an "era-lock" filter (unbuilt, fed posts 524, 535). Official ruling: `@Ich_bin_Tyler`, post 524 | ingested (fed 521-535) |
| BUG-2 | **`Chisholm v. Georgia` lacks an "11th Amendment not ratified" gate** | The SCOTUS case should be gated on the 11th Amendment not yet being ratified | **Case not yet in the build** — no SCOTUS case data file contains it (grep: 0 hits in src). So this is a *forward requirement on the SCOTUS-case content*, not a live crash today. Logged to the dev's Basecamp by the forum | ingested (fed 145-150) |
| BUG-3 | **No fallback when there is no viable PM General candidate** | If no eligible politician exists for the PM General / `GeneralInChief` cabinet seat, the procedure is undefined → potential crash (player hand-waved with a "Hand of God" stat bump) | `GeneralInChief` is a real seat (types.ts:1121) gated by `cabinetSeatsForYear` (types.ts:1196), but the no-candidate path isn't covered. **Reported, crash-path unverified** — escalated to the dev (fed post 5) | ingested (fed 5, 119) |
| DH-1 | **A filibustered "MUST-pass" bill has no rules remedy** | The GM can declare a bill "MUST pass" (e.g. a required tariff each session); when the required tariff bill was **filibustered to death**, the rulebook had **no remedy**. The GM **improvised** a "special committee" of the 4 congressional leaders who must agree on a tariff that auto-passes, dropping EconStab + applying election penalties **per day until they agree** (an "AMPU government shutdown") | **GM-confirmed rules gap — VERIFIED in-thread** (GM explicitly flagged it to fix). The shipped engine needs a defined rule for a failed required/MUST-pass bill (deadlock-resolution: forced compromise, shutdown penalty clock, or fallback auto-pass) | ingested (modern 640, 696, 711, 716) |
| DH-2 | **Modern era-event deck appears decoupled from the literal year** | In the ~2018 turn the EraEvos deck pulled **2008-era cards** (Subprime Mortgage Crisis, ABM/INF treaties) — events fired years out of phase with the campaign clock | **Possible bug — REPORTED, not verified.** Could be intended shuffle/backlog or a scheduling defect; reconcile with BUG-1 (era-event scheduling/era-lock) and the era-event scheduling-model open question | ingested (modern 2221) |
| DH-3 | **Career-track pols can run for President** | A career-track pol is barred from Gov/Rep/leadership/Kingmaker but **no rule bars a presidential run** | **GM-acknowledged rules gap, intended-to-fix, unbuilt.** Bar career-track pols from the presidential candidate pool (and from CPU presidential selection) | ingested (hd 8205-8219; relates to #63) |
| DH-4 | **"Extend Credit to all nations" near-auto-win foreign loop** | Diplomacy "Extend Credit" is per-nation | **Balance flag:** extending credit to all 7 powers "works amazingly every time" — a positive trade balance with all nations triggers a stacked bonus (EconStab→Booming + random industry + random foreign relation). Needs a diminishing-returns / cap rule | ingested (hd 7346; relates to #26/#27) |
| DH-5 | **Kingmaker-flip grabs the protégé(s) — "insanely OP"** | Kingmaker/Protégé pairing exists (#design) | **Balance flag:** converting/flipping a Kingmaker also seizes his protégés (and their +1 election standing) — flagged "insanely OP." Needs a pairing-dissolution-on-flip rule (or no protégé transfer) | ingested (hd 7589, 8762; relates to #29/#30) |
| DH-6 | **Contingent-election top-2 vs top-3 deviation** | No contingent-election path | **House-rule deviation:** GM uses **top 2** vs the 12th Amendment's **top 3**, overruled "Game rules." Build must **pick a stated rule** | ingested (hd 5720-5721; see #62) |
| DH-7 | **R/D convention-threshold asymmetry + Iron-Fist unilateral change** | No convention thresholds | Dems run **3/4**, GOP **2/3→½+1** — fixed era/party rule or temporary? And an **Iron-Fist PL can unilaterally lower the threshold**, which (with the Leadership-rigs-rules-changes issue) over-empowers humans. Document a chosen rule + re-gate the rules-change power | ingested (hd 4726, 623-630, 5594-5713; see #13) |
| DH-8 | **CPU convention AI unstable; ballot-shift rule ambiguous** | No convention AI / ballot mechanics | **GM-acknowledged:** the CPU convention AI is "rough/awful, needs a 2.9 rework" and **cannot perform some actions humans can**; separately the **ballot-shift rule is genuinely ambiguous** (mid-ballot vs next-ballot; GM ruled next round). Both need firm specs | ingested (hd 4686-4690, 2025-2038, 2056, 2098; see #13) |
| DH-9 | **Exec/Gov-action ability stat inconsistent (Command vs Admin/Gov/Justice)** | Exec actions = Command in build; gov actions use Gov | **Designer-flagged:** the ability stat differs across actions/events; designers think it should all be Command. A live **"all-Admin implementation" rebalance** was applied, and an **A-branch event can no-op** on a failed implementation roll. Needs one canonical decision | ingested (hd 2274, 2279-2282, 3097-3098; relates to #22/#23) |
| DH-10 | **Blundered implementations still score (generic) unless a specific event overrides** | Implementation rolls exist (#22) | **Designer ruling (vcczar/MrPotatoTed/ebrk):** a FAILED (blundered) implementation **still scores points & moves meters "as if it succeeded"**; the blunder only risks scandal/resignation — UNLESS a specific event/action overrides (does-not-pass / retriable). **Needs a per-action data flag + appendix** | ingested (hd 8649-8672; refines #22) |
| DH-11 | **Apparent Dem 3rd-party structural bias; lobby cards too inelastic** | 3rd-party trigger is `modern`-only design (#48); lobby cards exist | **Balance flags:** Dems reportedly "won every instance a 3rd-party run was a factor" (possible structural bias in #48); and **lobby cards are too inelastic** (raw-pol-count-driven → a trifecta party can lack lobbies). Both need rebalancing | ingested (hd 7480-block, 7799; relates to #48/#5) |

Open balance/feel questions (build proves correctness, not fun) live below.

## Open questions

_Resolved by batch 2:_ **era cadence**, **foreign-relations roster** (era-dependent),
**faction card-distribution algorithm** (`1772s` B9). _Confirmed/extended by batch
3 (`modern`):_ the **meter set** (concrete bank + crisis/cascade), the
**enthusiasm/Party-Pref engine** (4-part reshuffle), the **full presidential
subsystem**, the **SCOTUS subsystem**, **amendment ratification by governors
(40/53) + 2/3-House**, and the **8-power relations roster (+Israel)**.
_Resolved/clarified by batch 4 (`hd`):_ the **era-boundary point question** —
points **DO bank per era** via a ~12-step boot pipeline (#68); the **per-party
faction cap** = **5 Blue + 5 Red** holds across a 5th era; the **amendment
ratifier/threshold is era-keyed AND in-game-tunable** (3/4 Governors in 1856 →
2/3 default later, #64); the **investigation spec** now has a concrete 5d6 rule
(#65, fills #54). New `hd` open questions are folded into the list below
(per-era point-bank as the cross-era win condition; Israel/foreign-meter
activation rule; the meter→per-state election formula; Civil-War end-year;
whether 3/3 traits-and-alt-states is the canonical draft re-rule). New open
questions from `modern` are appended at the end. Still open:

- **Era enum**: is `Gilded Age` a distinct `Era` entry or does `modern` cover
  1868→present? Forum frames 1868–1892 *and* "the next era" — likely needs
  `gilded` + `progressive`. (And: is `federalism` boot a `scenario1788` or a
  continuation of a 1772 game?)
- **Federalism scenario boot**: should a 1788 scenario pre-seat Washington's
  cabinet/Congress/SCOTUS (like 1856) and start at phase 2.1.2, or re-derive
  leadership/cabinet at start? (`fed` 1, 14)
- **Per-era ideology drafting profile**: authored per-(faction, era) table, or
  rule-driven drift at the boundary? (`gilded` 1; `fed` 136)
- **Tariff representation**: national integer set by legislation, with the
  change-cadence rule ("first year we can change it"). Confirm one integer.
- **Currency representation**: `MonetaryRegime` enum (Gold / Bimetallic /
  Silver) as a single national choice (same bimetallism bill in both eras).
- **Crisis taxonomy + crisis-bill eligibility**: federalism shows
  Budget/Economy/DomStab/HonestGov; gilded adds Anti-Naturalization/-Native/
  -Chinese. Fixed list, era-scaled, or meter-derived? How is a bill marked
  `(Crisis)` and how does it bypass the spending cap?
- **Spending cap on legislation**: numeric per-turn budget that gates non-crisis
  spending bills (a bill can pass the floor yet be "blocked due to budget")?
  Relation to the `revenue` ordinal meter and the numeric surplus.
- **Amendment ratification**: threshold (mostly unanimous + a "2/3 of states"
  amendment that raises the bar) and effect-binding for term-length /
  popular-vote / VP-vacancy / court-size / suffrage.
- **Per-state EC selection mode**: a `State.electionMethod` flag flipped by
  per-state era events *and* a national amendment? Confirm the full set of
  states that start legislature-chosen in 1788.
- **Generic war system**: is the success-chance formula
  (`base + commander + difficulty + milPrep − 25`) + warscore/momentum/×2
  resolution canonical across all eras, or rev-war-specific tuning?
- **Firing precedent**: what exactly sets it (two-step + card config)? And the
  missing **no-viable-PM-General fallback** (BUG-3) needs a defined rule.
- **Multi-manipulator exec-action control chain**: tie-breaker when several
  Manipulative advisors each qualify to control a Pliable+Passive VP. (`fed` 226)
- **State policy flag set**: are Poll Tax / Jim Crow / Prohibition / Women's
  Suffrage / Segregation the full set, or larger?
- **Per-party faction cap**: both forum games run 5 Blue + 5 Red = 10. Is the
  design capped at 5 factions per party?
- **Faction nickname/relabel table**: an authored names table per (party, era,
  ideology) gated by leader traits, or free-text GM flavor? (`fed` 184)
- **VP impact rule set**: confirm the binary-check list across `gilded` 225/250
  and `fed` 247/408/600 is canonical.
- **Old-age stat decay**: age-keyed table or randomized?
- **National surplus / budget** (integer) vs `revenue` (ordinal): two distinct
  quantities (the spending cap reads off the numeric one).
- **Enthusiasm→election mapping**: flat bonus (current/#18) vs. the 1772 player's
  **graduated multiplier with a 3rd-party-at-Neutral** rule — which is intent?
- **Drafter ordering**: snake / election-result-weighted / fixed-list? `1772s`
  shows the inaugural draft score-reversed; `modern` confirms **draft order =
  reverse score** (worst faction first) with **pick-position skill bonuses**.
- **Presentation art direction** (A1/A3): is the "fantasy-sports trading-card +
  old-school almanac" look ratified design intent, or one player's RP styling?
  Procedural portraits for the long tail — in scope, and on what tech?
- **Era-event scheduling model**: should the engine adopt the forum's
  historical-year-sorted, per-half-term-capped, roll-≤-%-to-fire (with
  spill-to-anytime) model, or keep the current `coreSpine` precondition graph?
  They produce different event sequences (`1772s` B1 — biggest 1772 divergence).
  Relates to DH-2 (modern deck fired 2008 cards in 2018 — bug or intended?).
- **Spending-cap derivation** (`modern`): is "3 spending bills" meter-derived
  (off Rev/Budget tier) or a fixed per-crisis cap?
- **Cloture threshold** (`modern`): observed ~67% with ties sustaining — confirm.
- **Primary delegate allocation** (`modern`): the per-group mix of winner-take-all
  vs proportional, the candidate-"Strength" formula, and the CPU engine's
  EV×category multiplier — which is canonical?
- **Procedural pol generation** (`modern`/#43): what stat/ideology/trait/
  demographic distribution should generated modern rookies use (GM wanted "some
  moderates"), and what name-generation tech (plausible, ethnically-varied,
  toggleable)?
- **Two-home-state pols** (`modern`/#55): data-model needs a pol to carry ≥1 home
  state with an alt-state list — confirm and reconcile with relocation/Carpetbagger.
- **Modern apportionment** (`modern`/#34/#55): House at **601** (Wyoming Rule) vs
  **572** both appear — confirm the size the build should model; Senate = 106.
- **53-state modern roster** (`modern`/#55): the full annexed-state list (DC/Cuba/
  PR confirmed) and whether modern is a `scenario1948` or a continuation.
- **Per-era point banking as the cross-era win condition?** (`hd`/#68) One
  playthrough traverses Antebellum→Civil-War→Reconstruction→Gilded→Progressive→…;
  is the per-era faction-point bank → end-of-game total the canonical win, and is
  it modeled at all?
- **Foreign-meter activation rule** (`hd`/#67): foreign-relation meters are
  era-gated and **"Israel" is present but inactive (0)** in the 1900 of an 1856
  game — what activates it (and the others)?
- **Meter → per-state election formula** (`hd`): the exact mapping from the bank
  to per-state ± election modifiers is applied by the GM but never written down.
- **Civil-War end-year** (`hd`/#56): 1866 vs 1867 ambiguity affects the war-hero
  "<20 yrs" down-ballot window — confirm.
- **Draft rookie grants** (`hd`/#69): is **3 traits + 3 alt-states** ("Ted's
  revisions," down from 5/5) the canonical going-forward rule?
- **Contingent-election cutoff** (`hd`/#62/DH-6): top-2 (house rule) vs top-3
  (12th Amendment) — which does the build adopt?

## Sources

- **Ingested digests:**
  - [`f4c7c2c4-ampu-1800-playtest-continued-1868`](playtest-digests/f4c7c2c4-ampu-1800-playtest-continued-1868.md)
    (`gilded`) — 343 posts / 5 chunks. Gilded-Age (1868–1872) **multiplayer**
    playtest, 8 human factions + 2 CPU per party; continuation of a longer
    1800-start campaign. Establishes the multiplayer, multi-era, Gilded-Age,
    and convention / legislation / governor gap rows. GM: @ebrk85.
  - [`f55d3e21-orange-democracy-1788-with-benevolent-elitism`](playtest-digests/f55d3e21-orange-democracy-1788-with-benevolent-elitism.md)
    (`fed`) — 732 posts / 9 chunks. **1788 federalism** solo-with-AI playtest
    (Hamilton's Arch Federalists), spanning 1788→1808 with a live
    federalism→nationalism transition. The primary source for the unbuilt
    **federalism era**: faction roster + nickname table, era-event spine,
    party-formation events, per-state EC method, generic war system,
    amendments-as-state, firing precedent, bill-driven statehood — and it
    **corroborates ~16 prior gilded deltas across a second era**. GM/player:
    @OrangeP47; rules confirmed by @matthewyoung123 / @MrPotatoTed / @vcczar
    (game creator). Source of the three Confirmed shipped bugs.
  - [`85f8e6b4-for-the-people-1772-solo-pt-an-esthetic-experiment`](playtest-digests/85f8e6b4-for-the-people-1772-solo-pt-an-esthetic-experiment.md)
    (`1772s`) — 90 posts / 4 chunks. **1772 solo** "aesthetic experiment"
    (@Saucialiste) prototyping the **look and feel** of the eventual
    computerized AMPU. Source of the presentation/UX rows (A1–A8: portraits,
    ideology→color palette, sport-cards, battle-cards, era office titles,
    legacy lines, maps; hard no-AI-in-product stance), the fully-specified
    **Faction-Personalities card-distribution algorithm**, the **era-event
    scheduling divergence**, and bill-typing / meter-model nuances for 1772.
  - [`3a9ac985-ampu-1948-playtest-continued-2004-and-beyond`](playtest-digests/3a9ac985-ampu-1948-playtest-continued-2004-and-beyond.md)
    (`modern`) — **2276 posts / 32 chunks** (map-digested into 4 partials, then
    reduced). The **modern arc** of a continuous 1948 multiplayer campaign, played
    in-game **2004→2020** (ends mid-session, no 2020 election); GM @ebrk85,
    designer @vcczar. The **most mechanically mature** source: an **alt-history**
    (53 states incl. DC/Cuba/PR; alt presidents Cuomo/Kirk; ahistorical SCOTUS),
    on the game's own clock with **fictional era names** ("Era of Terror",
    "Era of Populism"). Primary source for the **full presidential subsystem**
    (primaries→convention→general), the **named meter bank + enthusiasm/Party-Pref
    engine**, the **SCOTUS subsystem**, **modern legislative depth** (Crisis Bills,
    packaging, Executive-Branch-Interference, investigation committees), the
    **military-leadership tier**, modern apportionment, and the **dataset-exhaustion
    → procedural-generation** + **House-bloat → persist/auto-fill** scaling walls.
    **Corroborates ~30 prior deltas across a 4th era.** Source of DH-1/DH-2.
  - [`77db6e6f-a-house-divided-1856-ampu-playtest-part-2`](playtest-digests/77db6e6f-a-house-divided-1856-ampu-playtest-part-2.md)
    (`hd` / `house-divided`) — **9051 posts / 148 chunks** (map-digested into 15
    partials → 3 section-digests → this final reduce). The **first 1856-native
    procedural record** — a continuous multiplayer **1856→1904 alt-history**
    (Seward not Lincoln; secession ~1863 via a bungled John Brown's Raid; CSA
    pres Quitman), crossing **Nationalism → Gilded (1868) → Progressivism (1892)**
    and **ending mid-1904 primary with no nominee** (live game); ~50-state map
    incl. 8 Canadian provinces. GM @matthewyoung123 + co-GM @ebrk85
    (Arkansas Progressive); designer @vcczar + @MrPotatoTed rule in-thread. The
    **only source for the antebellum→Civil-War→Reconstruction machinery** (rows
    #56–#60) and the succession/eligibility, contingent-election, Primary-Era,
    amendment-by-Governors, investigation-3.0.40, institutional-layer, and
    ~16-meter-Lingering systems (#61–#69). **Corroborates a large swath of the gap
    log across a 5th era** (#1/#2/#8/#10/#13/#20/#45/#50/#51 et al.). Source of
    DH-3…DH-11 and the **★ "forum drives the build"** finding (relocation cap
    4 went live mid-thread; shipped build still 5 — gap #38 / §0).
- The shipped-build description ("What this game is / Eras / Core entities /
  Glossary") was generated from the AMPU codebase + `CLAUDE.md`.
