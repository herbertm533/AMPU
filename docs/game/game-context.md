# AMPU — Game Context

> **Batch-2 consolidation.** Written from the codebase + `CLAUDE.md`, then
> updated against three formally-ingested forum threads: a 343-post Gilded-Age
> multiplayer playtest (`gilded`), a 732-post 1788 federalism solo-with-AI
> playtest (`federalism`), and a 90-post 1772 solo "aesthetic experiment"
> (`1772-solo`) — see Sources. "What this game is / Eras / Core entities /
> Glossary" describe the **shipped build** (cited `file:line`). The gap log is
> grouped by area; each row is tagged `ingested` (forum-cited) or `codebase`,
> and notes when a delta is **corroborated across multiple eras** (the
> strongest signal that it is real and load-bearing). A separate **Confirmed
> shipped bugs** subsection lists defects (fixes, not features). Subsequent
> digests will continue to correct and extend.

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
| **1856 — Antebellum** | 1856, era `nationalism` (scenario1856.ts:177) | `nationalism` only | Slavery, popular sovereignty / free soil, sectional crisis, secession & union | **Built** |
| **1800 → Gilded Age (1868–1892)** | continuous campaign | Reaches a `gilded`-style era (likely the `modern` enum, or its own value) | **Tariff** (national integer set by legislation); **currency** (Gold-Standard vs Bimetallism/Free Silver); **civil-service reform / anti-corruption** ("Honest Gov't" crisis); **imperialism** (island naval bases); Native-relations bills; Chinese / Jewish immigration bans; women's suffrage (state-by-state); Jim Crow / Poll Tax / Prohibition policy switches | **Designed, not built** — confirmed by the gilded digest |
| **"The next era" (post-1892)** | implied | unknown | Feminists, socialists, communists, prohibitionists, eugenicists, labor activists — narrated as forthcoming in the Gilded-Age era brief | **Designed, scope unclear** |

The forward arc is therefore **nationalism → gilded → progressive(+)**: the
`nationalism` Civil-War scenario is built, but the gilded/progressive eras at
the end of the timeline are only `modern`-enum tuning rows with no scenario.
**federalism** sits *between* the two built scenarios and is now the
best-documented unbuilt era (it was a stub before this batch).

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
  reps/governor; 1772 colonies carry `ccDelegateSlots`/`colonySize`.
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
  and via events/legislation.
- **Interest groups / enthusiasm / party preference** — `InterestGroupScores`,
  `Enthusiasm` (ideology×party −5..+5), `partyPreference`: the electoral mood
  substrate.
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

## Built vs. Designed — gap log

The heart of this doc; the roadmap is built from this. Rows are grouped by area.
Each is tagged `ingested` (forum-cited via a digest under
`docs/game/playtest-digests/`) or `codebase` (derived from the AMPU source
tree). Digest shorthands: **`gilded`** = the f4c7c2c4 1868 Gilded-Age digest;
**`fed`** = the f55d3e21 1788 federalism digest; **`1772s`** = the 85f8e6b4
1772 solo "aesthetic" digest. A row marked **(corroborated across N eras)** has
been independently observed in multiple threads — the strongest signal that it
is a real, load-bearing rule rather than a one-off ruling.

> **DEFECTS vs. GAPS.** This table is *missing features* (designed-but-unbuilt).
> Outright **bugs in shipped behavior** live in the separate "Confirmed shipped
> bugs" subsection below — the roadmap should treat those as fixes, not
> features.

### Platform / cross-cutting

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 1 | **Multiplayer** | Single-player: one human faction (`isPlayer`), all others CPU (scenario1772.ts:64, scenario1856.ts:121) | **Multiplayer** — 8 human drafters across 2 parties (5 Blue + 5 Red), with handles; CPU factions only fill empty seats. (Both solo threads, `fed` + `1772s`, confirm the *same game* is also played solo-with-AI — so solo and multiplayer are two modes of one engine, not two games) | Multi-faction human control / turn arbitration; per-player handle + identity; async/seated turns; GM-style narration layer; CPU only as fallback. (corroborated across 3 eras: solo + multiplayer both real) | ingested (gilded 1, 12, 26, 113, 298; fed 1, 12; 1772s 1, 11) |
| 2 | **Eras covered** | Two scenarios: 1772 + 1856. `modern` era unreachable | A **continuous campaign** spanning independence → federalism → nationalism → Gilded Age → "the next era"; points reset at each era boundary | Continuous multi-era timeline (or chained scenarios w/ state hand-off); era enum likely needs `gilded` + a successor. (corroborated across 3 eras; `fed` post 518 shows a live era transition mid-thread + point reset) | ingested (gilded 1; fed 11, 518) |
| 4 | **Era-specific ideology drafting profile** | Static seed factions per scenario; no per-era drafting profile | Each faction's drafting ideology mix updates per era (gilded: Brocklin Lib/Mod → Prog/Lib; federalism is a heavily Mod/Cons era where "those [LW] ideos don't really matter") | Per-(faction, era) drafting profile, or a drift rule at era boundary. (corroborated across 2 eras) | ingested (gilded 1; fed 136, 330) |

### Legislative (committees, bills, crises, budget)

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 8 | **Committee block-and-replace** | Bills proposed → committee → floor (phases 2.6.1–2.6.3). No block-and-replace | Committee chair can block a bill and substitute another *from their own committee's domain*; eligibility to chair requires prior service on that committee | Add committee-chair "block-and-replace" action with same-committee replacement check. (corroborated across 2 eras; pervasive in federalism) | ingested (gilded 160-163; fed 160, 209, 305, 380, 563, 723) |
| 9 | **Bill packaging / bundling** | Each bill votes separately | Chair can package multiple committee bills into one floor vote that passes/fails as one. Federalism nuance: a chair **won't bundle** a net-negative bill *unless* it's a statehood bill; CPU bundles ~75% unless hostile/random | Add packaging + vote aggregation; bundling-eligibility rule. (corroborated across 2 eras) | ingested (gilded 176-179, 188, 194; fed 160, 213, 564-565; 1772s 18, 46, 57) |
| 10 | **Filibuster** | No filibuster | A senate floor leader / eligible senator can filibuster a bill or package; filibustered bills die *or* return next term. Federalism clarifies it's a **standing rule toggled ON by a law** ("Institute Filibuster", 1792); trait-gated (a Puritan senator filibusters) | Add `Filibuster` action (one per faction w/ eligible senator); unlocked-by-law gate; filibustered bills persist. (corroborated across 2 eras) | ingested (gilded 189-194; fed 159, 566, 725, 730) |
| 11 | **Crisis Bills + national-crisis state** | `Crisis Admin/Gov` traits exist (types.ts:85-86) but no crisis-bill tag and no national-crisis state | Bills tagged `(Crisis)` *resolve* an active national crisis and **bypass the spending cap**; the nation enters/exits named crises by meter movement. Crisis taxonomy is **era-dependent**: federalism = Budget/Economy/DomStab/HonestGov; gilded adds Anti-Naturalization/Anti-Native/Anti-Chinese | Add `Crisis` model + `bill.resolvesCrisis` link + crisis-bypasses-budget rule; meter-derived crisis entry/exit. (corroborated across 2 eras) | ingested (gilded 160, 164, 167, 176; fed 39, 159, 166, 372, 477, 480) |
| 12 | **Bill scoring uses *all* faction cards** | Mixed; needs audit | Legislation scores *every* ideology/lobby/interest card on each faction (a faction holding opposite-side cards nets toward 0), not just the leader's `ideology`. 1772s adds the **staged tabulation method**: tabulate each card, then sum per faction | Verify scorer iterates `Faction.ideologyCards + lobbyCards + interestCards`. (corroborated across 2 eras — same author ruling) | ingested (gilded 237; 1772s 27, 29, 42, 44) |
| 42 | **Bill typing (Foundational / Spending / Crisis) + budget-gated spending cap** | No type tag on `Legislation` (grep: none); `revenue` ordinal meter only | Bills are typed; **non-crisis spending bills are capped by a per-turn spending budget** — a bill can pass the floor yet be "BLOCKED DUE TO BUDGET". At Overspending only 3 spending bills pass; ordering matters. **Foundational** bills (Create Dept. of State/War/Treasury, Bank of N. America/US) carry special handling | Add `bill.type` (Foundational/Spending/Crisis/…) + numeric per-turn spending budget that gates non-crisis spending bills at the floor. (corroborated across 2 eras) | ingested (1772s B4, posts 18, 46, 57; fed 159, 561, 566, 703) |
| 12b | **"Free pick-up" legislation by a skilled Treasurer** | Not in build | A high-skill Treasury Sec can propose a free extra bill: double points to proposer + Treasurer; −50 to the Treasurer if not picked up. (Federalism shows the broader "cabinet suggests / free pickup" seeding) | Executive-interference legislative power: cabinet-seeded free proposal slot | ingested (1772s 57; fed 38, 57) |

### Convention & elections

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 13 | **Convention machinery** | Phase 2.9.2 Conventions exists (phases.ts:40); ballot/momentum/promise mechanics absent | Multi-ballot convention (routinely 4–7 ballots to 50%+1): delegate counts per state, major/minor/favorite-son candidate types, nominator-speech d6 → momentum (Orator/high → +1, low → −1), separate keynote roll, inter-ballot actions (drop-out+endorse, presidential cabinet-seat promises — *rejectable by stubborn AI*), unit rule, kingmaker boosts. Federalism adds: **convention host (the faction that sets delegate categories) is favored** ("rigged in my favor"); **party leader can overrule the nominee's VP pick** | Full convention subsystem: ballot loop, inter-ballot actions, momentum scalar, promise tracker, host-advantage, PL-VP-override. (corroborated across 2 eras — very high confidence) | ingested (gilded 211, 220, 222, 227, 229-246; fed 90, 202-203, 231-247, 394-417, 580-606, 714-727) |
| 14 | **Platform = 5 planks** | Not visible in code | Platform is 5 planks (Domestic / Foreign / Economic / Judicial / Executive), each filled by a catalog bill/policy; compared between parties for a party-pref swing + ideology-enthusiasm shifts; delegable. Federalism adds **Blue picks planks first, constraining Red**; scoring itemized per faction | New platform subsystem; planks reference the bill catalog; pick-order + delegation + scoring. (corroborated across 2 eras) | ingested (gilded 224, 226, 248, 251; fed 238-239, 249-251, 406-410, 601-602) |
| 15 | **VP impact** | `vicePresidentId` exists (types.ts:1568) | Multi-check VP-impact scoring (different faction, ideology/age spread, incumbent/outsider, big/small state, region, …) → party-pref delta; a bad **VP reveal** can give the VP Disharmonious/Controversial/lose Obscure | Add VP-impact scorer at convention close + VP-reveal trait effects. (corroborated across 2 eras) | ingested (gilded 225, 250; fed 247, 408, 600) |
| 16 | **General-election action library** | Not surveyed | Per action phase the ticket can "Give a Speech" (target state, roll for +1; Orator separate +1) and "Send VP to Shore Up Support" (trait-branched). Federalism shows the **general-election bonus stack**: incumbency, crises-solved (+2), legislation-support, meters→pref, per-state speech/VP effects, **state ties resolved by re-roll**, **down-ballot bonus when a party clears 66% of a *state's* popular vote** (per-state, not national EC — house interpretation) | Add `electionAction` enum + handlers; assemble the documented election-bonus stack incl. the 66%-per-state down-ballot rule. (corroborated across 2 eras) | ingested (gilded 256-265; fed 414, 569, 605, 608, 609, 420-422) |
| 17 | **Scandal rolls** | Not visible | 1d6 per major candidate per action phase; on a hit, magnitude rolled = severity; `Integrity` grants immunity; offset by incumbency | Add per-cycle scandal roller; severity → election malus. (corroborated across 2 eras) | ingested (gilded 255, 262; fed 254, 414) |
| 18 | **Meters → election bonus mapping** | Meters tick in Lingering (2.5.1); mapping to election outcomes not surveyed | Each `NationalMeter` value maps to a specific election bonus/penalty; Party Pref → direct numeric advantage. **Open design choice** (1772s C1): flat bonus (current reading) vs. a *graduated multiplier* with a 3rd-party-at-Neutral rule, which the 1772 player found less "lopsided" | Add `metersToElectionBonus(meters)`; decide flat-vs-multiplier (human call). (corroborated across 2 eras) | ingested (gilded 266; fed 607-609; 1772s 25, 49, 90) |
| 19 | **Faithless electors** | Not visible | Random per-state EC desertions add stray votes to off-ticket candidates | Add faithless-elector roller in EC tally | ingested (gilded 267) |

### Executive & cabinet

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 22 | **Egghead cabinet advisory + multi-decider / implementation-roll era events** | `EraEvent.decider` is single-role (types.ts) | Cabinet secretaries with `Egghead`/`Efficient` "suggest" choices a Passive/Pliable/micromanager Pres accepts (cabinet *majority* recommendation); **multi-role implementation** where a secretary "blunders the implementation" but a high-stat Pres bails them out (e.g. Sec State + UK Minister rolling for a treaty) | Multi-decider model + Egghead advisory step + implementation-roll layer. (corroborated across 2 eras) | ingested (gilded 126-129; fed 29, 65, 475, 496, 575, 702) |
| 23 | **Executive Actions library (2.8.1)** | Phase exists; only 4 hardcoded one-shots (phaseRunners.ts ~3636); library + persistence absent | Pres takes N actions/half-term (N varies by traits; `Easily Overwhelmed` hands off); **persistent active actions** (green = stays, yellow = auto-deactivates on admin change). Large era-specific library (gilded: Swing around the circle, Establish Bureau of Labor; federalism: Pro/Anti-Military budget policy, Civilizing Native Americans, Monroe Doctrine, Set Precedence of State of the Union, Abolish National Debt, Pledge to Serve One Term, …) | Add `GameState.activeExecutiveActions` + library + activate/deactivate-on-admin-change sweep. (corroborated across 2 eras) | ingested (gilded 201-203; fed 46, 89, 170, 201, 392, 496, 575) |
| 23b | **Exec-action control-handoff chain + multi-manipulator tie-break** | Not in build | When Pres is Incompetent → VP; if VP is Pliable+Passive → a Manipulative cabinet member / Key Advisor *seizes* control. Player flags an **undefined tie-breaker** when multiple Manipulative advisors each qualify | Define control-handoff chain + order-of-operations when several manipulators qualify (open design Q) | ingested (fed 226-228) |
| 25 | **Firing-precedent gate on cabinet** | Cabinet appointment/confirmation exists; no firing gate | A Pres **cannot freely fire/replace** cabinet members until a *firing precedent* is set (multi-step, tied to card config + the exec action "Set Precedence for Firing Cabinet Members"). Until then cabinets are hold-overs across administrations, even cross-party; replacement only via death/retire/resign or wrong-party PM-General auto-rotation. The **US Bank President can only be removed by a same-faction Pres** | New firing-precedent state + gate on cabinet replacement; same-faction guard on Bank President removal | ingested (fed 41, 119, 131, 177, 354, 392, 454, 547) |
| 31 | **Cabinet *regional* penalty for unrepresented regions** | Cabinet scoring exists (CABINET_SEAT_SCORING, types.ts:1221) | If the Pres's party has *no* cabinet rep from a region, that region gets −1 in the next Presidential race | Add per-region cabinet-coverage check → election malus. (corroborated across 2 eras) | ingested (gilded 112; fed 5, 29, 60, 457, 681) |
| 32 | **Cabinet eligibility ties to state status** | `cabinetSeatsForYear` is year-keyed; state-status not visible | A pol from a non-state / not-yet-territory cannot be appointed to cabinet | Cabinet appointment guard on state status | ingested (gilded 103) |

### Governors, states, statehood

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 20 | **Governor's actions library** | Phase 2.5.1/2.5.2 exists but no `governor.takeAction` library | Each governor takes 1–N actions/half-term against a fixed library, rolled vs threshold (d100 vs 20·`Gov`). Era-flavored sets: gilded (Gerrymander, Women's Suffrage in State, Enact Jim Crow, Discriminate against Secessionists, …), federalism (Encourage settlement on Native lands, Force a tribe to assimilate, Advocate Military Service, Criticize the incumbent Pres, Remove age restrictions, …), 1772 (improve industry 20/10/5, lower taxes, set term length/limits). **Industry-vs-roads tradeoff**: building roads hurts agriculture-leading states | New governor-action enum + handlers + per-action prereqs + state-status checks. (corroborated across 3 eras) | ingested (gilded 134-150; fed 33, 79, 144, 205, 298, 375, 482, 558, 713; 1772s 25, 46, 56, 90) |
| 21 | **State-level policy flags** | `State` (types.ts:1318) has no `policies[]` flag | Persistent state policy switches: Poll Tax, Jim Crow, Prohibition, Women's Suffrage, Segregation — toggled by Gov actions or era events; some time-bounded (Jim Crow = 3× points for 30 years) | Add `State.policies` map + duration support | ingested (gilded 125) |
| 35 | **Industry leadership + scoring + per-state term config** | `state.industries` exists; no leader table, no per-state governor term fields | Leading state per industry tracked; points to the faction holding that state's Gov/Sen at half-term close (industry-bill points awarded **only if the state leads** that industry). Governors set **per-state term length (2/4-yr) and term limits (one/two/no-limit)** as persistent state config — distinct from the Constitutional `termLimits` article (types.ts:1396). **Industry vocabulary mismatch**: `states1772.ts` uses fishing/lumber/shipping/tobacco/cotton; forum uses Agriculture/Finance/Maritime/Manufacturing/Plantation/Mining | Leader-table compute + scoring hook; add `state.governorTermLength`/`termLimits`; reconcile industry taxonomy + add an era industry set. (corroborated across 3 eras) | ingested (gilded 133; fed 35, 79, 193; 1772s 25, 46, 56, 90, B6, B7) |
| 43 | **Bill-driven statehood + auto-generate officials for sparse states** | `admitState` exists (territories.ts); `expansionStates.ts` is a static registry; no bill-driven admission | Statehood/Territory **bills** admit land (VT/KY/OH/TN/AL states; MS/IN/MI/IL/LA territories); annexation also via era event/war (Louisiana Purchase; "rights to Canada/Quebec" on winning a war). When a new state has too few pols, the engine must **generate filler officials** | Wire statehood bills → `admitState`; event-driven annexation; auto-generate politicians for sparse new states. (extends gilded #33 with bill-driven path) | ingested (fed 81, 158, 168, 302, 379, 386, 560, 571, 718, 702) |
| 44 | **Per-state presidential-election method (popular vote vs legislature-chosen)** | No `State.electionMethod` flag | Several states choose presidential electors by **state legislature**, not popular vote, into the 1790s (CT/GA/MA/NJ/NY/RI/SC in 1796) — decisive in elections. States switch to popular vote individually via era events ("Popular Vote in KY and NC") or a national amendment that forces all states onto popular vote | Add `State.electionMethod` (popular/legislature) flipped per-state by era event and by amendment. (distinct from #21 state-policy flags: this is EC selection mode) | ingested (fed 194, 220, 255, 258, 306-307, 373) |

### Foreign relations & war

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 25b | **Foreign-relations meters (per-power)** | Single-meter set assumed | Separate per-power relation meters; the **roster is era-dependent**: federalism = 5 powers (UK/France/Spain/Prussia/Russia, no China); gilded = 6 (adds China; Prussia → Germany post-1871) | Per-power relation meters + era-dependent roster + era-renames. (corroborated across 2 eras) | ingested (gilded 132; fed 32, 75, 88, 296, 479, 711) |
| 26 | **Diplomacy actions (2.7.1)** | Phase exists | Increase Relations (±1), Increase Trade Relations (≥neutral; success → +rev/budget, blunder → −), Extend/Take Credit/Loan (adds debt) — with success/blunder rolls | Three diplomacy handlers + budget integration. (corroborated across 2 eras) | ingested (gilded 198; fed 45, 88, 311, 388, 491, 572) |
| 27 | **Numeric national budget / surplus** | `revenue` ordinal meter only | A **numeric** national budget/surplus tracked alongside the ordinal `revenue` meter: "national surplus +16"; loans add debt; spending bills gated by it; debt can go "too in the hole" | New numeric `nationalBudget`/`surplus` field separate from the ordinal meter; feeds the spending cap (#42). (corroborated across 2 eras) | ingested (gilded 200; fed 311, 372, 480, 703) |
| 45 | **Generic war system (any war, any era)** | `revolutionaryWar.ts` is 1772-scoped | A generic war phase used for War of 1795, Barbary War, War of 1812 — not just the Revolution. Per half-term 1–N battles, each with Difficulty + an explicit **Chance of Success = base(6 navy/8 army) + commander-mil + difficulty mod + mil-prep − 25**, d100; a separate **war-resolution roll** (`warscore + momentum → %`) with a **×2 multiplier** that escalates over time; defeated commander gains Incompetent + is fired → **Senate-confirmation drama** for replacements; outcome feeds meters + grants/denies territory | Generalize to a `War` model usable in any era: success-chance formula, warscore/momentum/multiplier resolution, confirmation-cascade side effects. (1772s confirms the same battle-card breakdown for the Rev War) | ingested (fed 222, 312, 389, 492, 573; 1772s 20, 22, 48, 60) |

### Era content (events, amendments, cards, lifecycle)

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 3 | **Gilded-Age issue axes** | No tariff / currency / civil-service / imperialism in code | Tariff = national integer set by legislation; currency = Gold vs Bimetallism/Free Silver; civil-service / anti-corruption; imperialism (island naval bases). Federalism adds the **tariff change-cadence** rule (set 10% in 1789; "1796 first year we can change it") and shows the *same* bimetallism bill | New tariff integer + change-cadence; `MonetaryRegime` enum + bills; civil-service tree; imperialism flow. (corroborated across 2 eras for tariff + currency) | ingested (gilded 1, 152, 155, 164, 190, 224, 248; fed 38, 250) |
| 5 | **Faction card decks — full per-era library** | `Faction.ideologyCards/lobbyCards/interestCards` exist (types.ts:1298-1300); per-era library not surveyed | Large multi-era card pool (Big Corporations, Wall Street, Free Trade, Human Rights, Reformists, Theocrats, Labor Unions, …); **lobbies activate via events** (1772: Lexington & Concord activated Military-Industrial + Big Agriculture); a **new card pool appears at each era boundary** | Audit shipped pool; era-gate cards (no Big Tech in 1868); event-driven lobby activation. (corroborated across 3 eras) | ingested (gilded 49; fed 485; 1772s 18, 28) |
| 6 | **Social-movement activist groups** | No coalition-emergence machinery | Feminists, socialists, communists, prohibitionists, eugenicists, labor activists emerge mid-era and influence the next era | Movement/coalition spawning across eras; new governor actions + bill types | ingested (gilded 1, 150) |
| 24 | **Faction Personalities (2.1.8) — card-distribution algorithm** | Cards exist; distribution + drift rules not in code | **Now fully specified** (1772s B9): (1) a faction's ideology card = the ideology held by the most of its pols; (2) remaining era-minimum ideologies → the faction with the most pols of that ideology; (3) a faction's ideology cards must be **adjacent on the 7-point scale** — gaps resolved by dropping the card with the fewest pols on either side; (4) interest/lobby cards → faction with the most "interested" pols, then disinterested factions top-up with their most-represented interest, **subject to a ≥5-pol floor on the top-up only**; (5) lobbies activate via events. Per-half-term the set drifts (add/lose cards), legislative-record-driven | Implement the distribution algorithm + per-half-term drift. (corroborated across 2 eras; 1772s supplies the algorithm gilded only saw as drift) | ingested (1772s 5, 15, 28, 53; gilded 49, 323) |
| 33 | **Foreign-territory acquisition via era event** | `admitState` exists (territories.ts) | Era event grants territories en bloc (Oregon Treaty: BC/WA/OR/ID at once); organized vs unorganized territories precede statehood; State-of-the-Union view tracks held lands | Era-event → territory grant + organized/unorganized status + State-of-the-Union view. (see also #43 bill-driven path) | ingested (gilded 106, 129) |
| 34 | **Census-driven EV changes** | `state.electoralVotes` is static-ish | Events stash EV deltas that apply at the next **decennial census**; federalism adds **census timing (run decade N, take effect N+2)** and **new "focus rep" House seats + relocations** triggered at census | Pending-census-delta queue + decennial tick + focus-rep seats. (corroborated across 2 eras) | ingested (gilded 125; fed 140, 368, 385, 475, 507, 555) |
| 39 | **Constitutional Amendments as durable, separately-ratified state** | `constitutionalConvention.ts` covers the *initial* Constitution; later amendments not surveyed | Amendments pass Congress then go **to the states (next gov phase) for ratification** (often unanimous; a "2/3 of states" amendment itself raises the bar; "Christianity as Official Religion" rejected 9-7). They durably change rules: term-length (4↔6-yr), popular-vote-everywhere, VP-vacancy fill (note: **no VP-replacement amendment exists yet** in either timeline, so a dead VP leaves the office vacant), court size, suffrage | New `amendments[]` state + cross-state ratification vote + effect-binding + amendment bill type. (corroborated across 2 eras) | ingested (gilded 159, 164, 173, 188, 276-277; fed 38, 76, 201, 214, 297, 306, 373, 468, 746) |
| 40 | **Faction nicknames / per-era relabel table** | `Faction.nickname` exists (types.ts:1297) | Nicknames evolve per era, tracking real party evolution, gated by the faction-leader's traits/ideology and a "names table" (federalism relabels factions almost every turn: Federalists ↔ Arch/States'-Rights/Knox/Moderate; Dem-Reps ↔ Old Republicans/Republicans/Fusion/Populists) | Surface the mechanic: an authored names table per (party, era, ideology) + leader-trait gating; player-edit + algorithmic mix. (corroborated across 2 eras — dense in federalism) | ingested (gilded 298; fed 2, 24, 140, 184) |
| 36 | **Stat decay at old age** | `MORTALITY_RULES` handles death | At end of half-term, "Old-Age Rolls" can drop a skill by 1 (separate from the death roll) | Age-keyed decay table, separate from mortality. (corroborated across 2 eras) | ingested (gilded 297; fed 139) |
| 37 | **Defeated-incumbent auto-retire** | Not visible | Defeated presidential/gubernatorial/House incumbents auto-retire at half-term end. Federalism nuance: a **6-year presidential-loss retirement malus is amendment-gated** (doesn't exist pre-12th-Amendment) | Auto-retirement after losing; era/amendment-gate the loss-malus. (corroborated across 2 eras) | ingested (gilded 297; fed 52, 110, 111, 176, 266, 331, 437, 517) |
| 38 | **Auto-Carpetbagger on alt-state moves** | Carpetbagger trait exists | A successful alt-state relocation auto-awards Carpetbagger; 1772s adds it is **removed after 10 years** (re-earnable) and alt-state moves **don't count against the relocation cap** | Auto-apply trait on relocation outcome + 10-year expiry; exempt alt-state moves from the cap. (corroborated across 2 eras) | ingested (gilded 36; 1772s 3, 4, 28, 52) |

### Leadership pipeline

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 28 | **Congressional Leadership pipeline (2.2.1)** | Phase exists | Speaker, House/Senate Maj+Min Leaders + Whips + Pres Pro Tem; **incumbent leaders can't be challenged when their party's meters are sky-high**; Whip races are ranked-choice; committee-chair eligibility requires **prior service on that committee**; each role grants ±points + traits. Federalism shows a six-ballot Pro Tem race | Pipeline runner + RCV + committee-eligibility check + role-effect table. (corroborated across 2 eras) | ingested (gilded 50, 60, 61, 66, 324, 333, 334; fed 3, 447, 539) |
| 29 | **Faction Leaders Selected (2.2.3)** | Phase exists | Leader can step down and **anoint** a successor; Passive/unelected → must be replaced (Adams ousted as faction leader for being unelected); auto-replacement pool is trait-filtered. 1772s supplies the **canonical 6-criterion filter, waived in reverse priority** (ideology-card match → not Incompetent/Lackey/Passive → interest/lobby match → not on track → has Leadership → not Obscure) | Anointment flow + the documented 6-criterion eligibility filter. (corroborated across 3 eras — 1772s quotes the rulebook filter verbatim) | ingested (gilded 67, 71, 78, 341; fed 56; 1772s 5, 15, 33, 54, 80-87) |
| 30 | **Party-Leader incumbency fatigue (2.2.4)** + Independence gating | Phase exists | Long PL tenure → party pref −1; trait-driven enthusiasm on PL election; PL re-run needs `Charisma`. **Critical era-gate: Party Leaders do not exist until Federalism** — phase 2.2.4 and inter-party Conversion must be suppressed in `independence` | Add PL-term counter + on-elect effects; **suppress 2.2.4 + inter-party conversion in the `independence` era**. (corroborated across 2 eras) | ingested (gilded 85; fed 351, 655; 1772s 5, 6, 7) |

### Presentation / UX (from the 1772 "aesthetic experiment")

The 1772 solo thread exists specifically to prototype the **look and feel** of
the eventual computerized AMPU. Its thesis: *a political sim wearing
fantasy-sports / trading-card clothes with an old-school almanac vibe.* None of
this is a deliberate visual language in the shipped UI (functional pages only).

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| A1 | **Politician portrait / art pipeline** | `Politician` (types.ts) has no image/portrait field; no card view | Hand-authored art for marquee figures + **CK2-style procedural portraits** for the ~18.5k long tail. **Hard stance: no AI-generated imagery or text in the shipped product** (AI used only as a proof-of-concept stand-in) | Add a portrait field + a procedural-portrait system; commit to the no-AI-in-product art direction | ingested (1772s 13, 14, 51, 860) |
| A2 | **Canonical ideology→color palette (cross-cutting)** | `components/Meter.tsx` colors meters; no documented 7-ideology palette reused everywhere | A canonical ideology→color mapping (Prog/Lib/Mod/Cons/Trad/RW-Pop legend) used consistently across roster, congress, maps, score sheets. Color-coding is core to both *reading* and *playing* (it makes Committees tractable) | Define + apply one ideology→color palette app-wide | ingested (1772s 12, 25, 70, 71) |
| A3 | **"Sport-card" politician infobox + styled persistent scoreboard** | `Roster.tsx` is tabular; scoring has `HalfTermSummary` (types.ts:1762) but no marquee leaderboard view | Per-politician character "sport card" (portrait/traits/stats/PV/office) + an always-on styled scoreboard rendered each turn | Add a card component + a persistent scoreboard view | ingested (1772s 13, 14, 15, 22, 53) |
| A4 | **Legible battle-card with additive-odds breakdown** | Rev-War dashboard exists (`RevWarDashboard.tsx`); whether it surfaces the additive odds breakdown is unverified | A battle card showing the itemized to-hit math (difficulty + planning + commander + meters + benchmarks → % victory) | Verify/add the additive-odds breakdown in the war UI (pairs with #45) | ingested (1772s 22, 48, 60) |
| A5 | **Era/colony-specific office titles** | Generic "Governor" label | Period-correct executive titles ("President of the Supreme Executive Council of Pennsylvania", "1st President of Delaware", …) per colony and era | Per-(office, era, state) title strings | ingested (1772s 25) |
| A6 | **Honorific-memory + "remembered for…" legacy lines** | Not in build | Persist a politician's prior-office honorific ("Senator X") for use in narration, and award durable legacy/epitaph lines from era-event participation | Add honorific-memory + legacy-line fields driven by office history + era-event participation | ingested (1772s 16, 17, 18) |
| A7 | **Election-result maps + era-correct flags** | No election maps; no era iconography | Election-result maps + era-correct national/state flags as set-pieces (anticipated marquee feature once more states exist) | Map renderer + era-iconography assets | ingested (1772s 23, 24, 40) |
| A8 | **Narration density / voice** | `EraEvent` text fields exist (types.ts); generated-log voice unverified | The build's generated log should aim for the forum's in-character narration density (verbatim historical flavor + editorializing asides) | Verify `log.ts` output voice against the forum bar | ingested (1772s 9, 18, 37, 56) |

### Data-model / dormant

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 41 | **`modern` era is dormant** | Rule tables carry `modern` rows (mortality 507, leadership 460, anytime-events 1076, trait bands) | Implied late-timeline play; the Gilded-Age scenario *should* be `modern` or a sibling era | Activate `modern` with a Gilded-Age scenario, or split into `gilded` + `progressive` | codebase + ingested (gilded 1) |
| 46 | **Foreign-volunteer / generated pols routed by score+ideology** | `ImportedDraftee` exists (types.ts:1780); no "event introduces a future-draftable figure" flow | Foreign volunteers (Lafayette, von Steuben) are **scheduled into a future draft class** (Lafayette draftable 1784) and assigned to the **lowest-scoring faction allowed to draft that ideology** | Event → future-draftable figure routed by score + ideology | ingested (1772s 37, 56) |

## Confirmed shipped bugs

**Defects in existing behavior** (roadmap = fixes, not features). Surfaced by the
federalism digest (`fed`); verified against the codebase where quick.

| # | Bug | Symptom | Root cause / status | Source |
|---|---|---|---|---|
| BUG-1 | **Era events don't deactivate for non-1772/1856 start years** | A scenario whose **start year is past an era** still has that era's events in the roll table, *and* (per the official ruling) events deactivate **only** if the start year is past the era — so e.g. an **1800-start game wrongly loses the Louisiana Purchase**. Stale events also dilute the roll table | The 1856 path calls `buildEraEventsForYear(year)` with **no era-vs-start-year filter** (phaseRunners.ts:2817). **Latent in the shipped build** (only 1772/1856 ship today) but a hard blocker the moment a federalism/1800 scenario is added. Wants an "era-lock" filter (unbuilt, fed posts 524, 535). Official ruling: `@Ich_bin_Tyler`, post 524 | ingested (fed 521-535) |
| BUG-2 | **`Chisholm v. Georgia` lacks an "11th Amendment not ratified" gate** | The SCOTUS case should be gated on the 11th Amendment not yet being ratified | **Case not yet in the build** — no SCOTUS case data file contains it (grep: 0 hits in src). So this is a *forward requirement on the SCOTUS-case content*, not a live crash today. Logged to the dev's Basecamp by the forum | ingested (fed 145-150) |
| BUG-3 | **No fallback when there is no viable PM General candidate** | If no eligible politician exists for the PM General / `GeneralInChief` cabinet seat, the procedure is undefined → potential crash (player hand-waved with a "Hand of God" stat bump) | `GeneralInChief` is a real seat (types.ts:1121) gated by `cabinetSeatsForYear` (types.ts:1196), but the no-candidate path isn't covered. **Reported, crash-path unverified** — escalated to the dev (fed post 5) | ingested (fed 5, 119) |

Open balance/feel questions (build proves correctness, not fun) live below.

## Open questions

_Resolved by batch 2:_ **era cadence** — confirmed a continuous multi-era
campaign with points reset at each boundary and a new card-pool/bill-catalog per
era (`fed` 11, 485, 518). **Foreign-relations roster** — confirmed
era-dependent (5 powers in federalism, 6 in gilded; `fed` 32). **Faction
card-distribution algorithm** — now fully specified (`1772s` B9). Still open:

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
  shows the inaugural draft as score-reversed, alternating Red/Blue.
- **Presentation art direction** (A1/A3): is the "fantasy-sports trading-card +
  old-school almanac" look ratified design intent, or one player's RP styling?
  Procedural portraits for the long tail — in scope, and on what tech?
- **Era-event scheduling model**: should the engine adopt the forum's
  historical-year-sorted, per-half-term-capped, roll-≤-%-to-fire (with
  spill-to-anytime) model, or keep the current `coreSpine` precondition graph?
  They produce different event sequences (`1772s` B1 — biggest 1772 divergence).

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
- The shipped-build description ("What this game is / Eras / Core entities /
  Glossary") was generated from the AMPU codebase + `CLAUDE.md`.
