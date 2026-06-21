# AMPU — Game Context

> **First-ingest version.** Written from the codebase + `CLAUDE.md`, then
> updated against the first formally-ingested forum thread (a 343-post
> Gilded-Age playtest — see Sources). "What this game is / Eras / Core entities
> / Glossary" describe the **shipped build** (cited `file:line`). The gap log
> distinguishes deltas now backed by post citations (`ingested`) from
> remaining bootstrap-only assertions (`codebase`-sourced). Subsequent digests
> will continue to correct and extend.

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
scenarios**, and only **three eras are reachable in play**:

| Scenario | Start | Era(s) reachable | Defining issues | Status |
|---|---|---|---|---|
| **1772 — Founding** | 1772, era `independence` (scenario1772.ts:97) | `independence` → `federalism` on Constitution ratification (constitutionalConvention.ts:198) | Independence vs. loyalty, the Revolutionary War, confederation vs. federal union, writing the Constitution | **Built** |
| **1856 — Antebellum** | 1856, era `nationalism` (scenario1856.ts:177) | `nationalism` only | Slavery, popular sovereignty / free soil, sectional crisis, secession & union | **Built** |
| **1800 → Gilded Age (1868–1892)** | continuous campaign | Reaches a `gilded`-style era (likely the `modern` enum, or its own value) | **Tariff** (set by legislation as a national integer); **currency** (Gold-Standard vs Bimetallism/Free Silver); **civil-service reform / anti-corruption** ("Honest Gov't" crisis); **imperialism** (island naval bases); Native-relations bills; Chinese / Jewish immigration bans; women's suffrage (state-by-state); Jim Crow / Poll Tax / Prohibition policy switches | **Designed, not built** — confirmed by the f4c7c2c4 digest |
| **"The next era" (post-1892)** | implied | unknown | Feminists, socialists, communists, prohibitionists, eugenicists, labor activists — narrated as forthcoming in the Gilded-Age era brief | **Designed, scope unclear** |

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
- **Era systems (1772 only):** Continental Congress (`ContinentalCongress`,
  types.ts:1347; built via phase 2.9.6), Revolutionary War (`RevolutionaryWar`,
  types.ts:1371; battles in 2.7.2), Constitutional Convention
  (`ConstitutionalConvention`, types.ts:1801; sets `ConstitutionalArticles`).
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

The heart of this doc; the roadmap is built from this. Rows are tagged
`ingested` (forum-cited via a digest under `docs/game/playtest-digests/`),
`codebase` (derived from the AMPU source tree), or `bootstrap` (still
unverified bootstrap-era assertions). `gilded` = the f4c7c2c4 Gilded-Age
digest.

| # | Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|---|
| 1 | **Multiplayer** | Single-player: one human faction (`isPlayer`), all others CPU (scenario1772.ts:64, scenario1856.ts:121) | **Multiplayer** — 8 human drafters across 2 parties (5 Blue + 5 Red), with handles (@dkh64, @jnewt, @Brocklin, @10centjimmy, @Vicx, @matthewyoung123, @Arkansas Progressive + GM @ebrk85); CPU factions only fill empty seats (DinkCPU, EuriCPU, SKCPU) | Multi-faction human control / turn arbitration; per-player handle + identity; async/seated turns; GM-style narration layer; CPU only as fallback | ingested (gilded posts 1, 12, 26, 113, 298) |
| 2 | **Eras covered** | Two scenarios: 1772 + 1856. `modern` era unreachable | A continuous campaign that spans **at least** independence → federalism → nationalism (Civil War) → **Gilded Age (1868–1892)** → "the next era" (post-1892, where prohibitionists/feminists/socialists arrive) | Continuous multi-era timeline (or chained scenarios with state hand-off); explicit Gilded-Age scenario + a Progressive-Era-or-later scenario; era enum likely needs `gilded` + a successor | ingested (gilded post 1) |
| 3 | **Gilded-Age issue axes** | No tariff / currency / civil-service / imperialism in code (`grep`: 0 matches outside meter names) | Tariff as a national integer set by legislation ("Set average tariff to 36%" / "to 8%"); currency = Gold Standard vs Free Silver / Bimetallism (Sec Wentworth's bill, filibustered by Sen Hale); civil-service reform / anti-corruption frame; imperialism (island naval bases) | New tariff state (integer); `MonetaryRegime` enum + bills that change it; civil-service reform tree; imperialism / overseas-territory annexation flow | ingested (gilded posts 1, 152, 155, 164, 190, 224, 248) |
| 4 | **Era-specific ideology drafting** | Static seed factions per scenario; no per-era drafting profile | Each faction's drafting ideology mix updates per era (Brocklin: Lib/Mod → Prog/Lib on entering Gilded Age) | Per-(faction, era) drafting profile; or rule for shifting profile when era boundary crossed | ingested (gilded post 1) |
| 5 | **Faction card decks — Gilded-Age content** | `Faction.ideologyCards / lobbyCards / interestCards` exist (types.ts:1298-1300); full per-era card library not surveyed | Multi-era card pool includes Big Corporations, Big Tech, Big Pharma, Big Oil & Gas, Big Agriculture, Wall Street, Free Trade, Protectionist, Globalist, Isolationist, Law & Order, Welfare, Human Rights, Civil Rights, Reformists, Environmentalists, Theocrats, Public/Private Education, Public Healthcare, LW Media, RW Media, Pacifists, Nationalists, Expansionists, LW Activists, RW Activists, Labor Unions, Public Housing | Audit shipped card pool; add Gilded-Age cards; era-gate cards so anachronistic ones (Big Tech in 1868) only become draftable in the right era | ingested (gilded post 49) |
| 6 | **Social-movement activist groups** | No coalition-emergence machinery | Feminists, socialists, communists, prohibitionists, eugenicists, labor activists emerge mid-era and influence the next era; Women's Suffrage already executable as a governor action ("1st in the nation!") | Movement/coalition spawning across eras; new governor actions + bill types reflecting them | ingested (gilded posts 1, 150) |
| 7 | **Phase taxonomy alignment** | Numbered phases 2.1.1–2.10 (phases.ts:3-47) | Same numbered taxonomy used by the GM ("2.1.1 Politician Draft", "2.4.3 EraEvos", "2.6.1 Congress Proposals Phase", "2.8.1 Executive Actions") | None — *alignment signal*, not a gap. Confirms the build is the same game | ingested (gilded posts 1, 26, 125, 151, 201) |
| 8 | **Committee block-and-replace** | Bills proposed → committee → floor (phases 2.6.1–2.6.3). No block-and-replace | Committee chair can block a bill and substitute another, *but only from their own committee's domain* (GM ruling) | Add committee-chair "block-and-replace" action with same-committee replacement check | ingested (gilded posts 160-163) |
| 9 | **Bill packaging** | Each bill votes separately | Committee chair can package multiple committee bills into one floor vote (S1 (Packaged), H.R.1 (Packaged)); package votes pass/fail as one | Add packaging UI + vote aggregation; package preserves component effects on pass | ingested (gilded posts 176-179, 188, 194) |
| 10 | **Filibuster** | No filibuster | After House passes, each faction's senate floor leader / senior senator can filibuster one bill or package; filibustered bills die | Add `Filibuster` action between House vote and Senate vote; one per faction with eligible senator | ingested (gilded posts 189-194) |
| 11 | **Crisis Bills** | `Crisis Admin` / `Crisis Gov` traits exist (types.ts) but no "crisis bill" concept | Specific bills are tagged `*Crisis Bill*` and *resolve* an active national crisis (Economic, Honest Gov't / Corruption, Domestic, Anti-Naturalization, Anti-Native, Anti-Chinese) | Add `Crisis` model + `bill.resolvesCrisis` link; crisis bills get bonus pass-pressure and special scoring | ingested (gilded posts 160, 164, 167, 176) |
| 12 | **Bill scoring uses *all* faction cards, not just leader's ideology** | Mixed; needs audit | GM explicitly clarifies: legislation scores *every* ideology/lobby/interest card on each faction, not just the leader's `ideology` field | Verify scorer iterates `Faction.ideologyCards + lobbyCards + interestCards`, not `leader.ideology` | ingested (gilded post 237) |
| 13 | **Convention machinery** | Phase 2.9.2 Conventions exists (phases.ts:40) but ballot/momentum/promise mechanics not surveyed | Multi-ballot convention with: unit rule (suspendable by vote), momentum carry, presidential promises (cabinet seats for endorsements), kingmaker boosts (5-6 roll for ±1 momentum on allied), drop-out endorsements, ballot shifts; nominator speech d6 → momentum (Orator + roll-5 → +1); keynote speaker d6 separate; major/minor/favorite-son candidate types; one major + (one minor OR one favorite-son) per faction | Full convention subsystem: ballot loop, inter-ballot actions, momentum scalar, promise tracker that locks future cabinet picks | ingested (gilded posts 211, 220, 222, 227, 229-246) |
| 14 | **Platform scoring** | Not visible in code | Platform is 5 planks (Domestic / Foreign / Economic / Judicial / Executive); can be delegated to other factions; "best platform" is a 4-step tiebreak (party-points exceeded, lowest-faction-exceeded, nominee-ideology-tops, delegation bonus); +1 party pref to winner; negative-scoring ideology shifts enthusiasm away; delegating gives Mod +2 enthusiasm | New platform subsystem; planks reference existing bill catalog; delegation hand-off + scoring | ingested (gilded posts 224, 226, 248, 251) |
| 15 | **VP impact** | `vicePresidentId` exists (types.ts:1568) | 10-check VP-impact scoring (different faction, ideology, age spread, age >50, age <60, incumbent, outsider, big/small state, region, obscure roll); net feeds party pref | Add VP-impact scorer at convention close | ingested (gilded posts 225, 250) |
| 16 | **General-election actions** | Not surveyed | Per action phase, the ticket can "Give a Speech" (target state, 5-6 roll for +1 + Orator gives a separate roll for +1 party pref) and "Send VP to Shore Up Support" (with Likable / Harmonious / Unlikable / Disharmonious / Provincial / Cosmopolitan / Delegator branches) | Add `electionAction` enum + handlers; ties into existing trait effects | ingested (gilded posts 256-265) |
| 17 | **Scandal rolls** | Not visible | 1d6 per major candidate per action phase; on a 6, magnitude 2d6 = severity; `Integrity` trait grants immunity | Add per-cycle scandal roller; severity → election malus | ingested (gilded posts 255, 262) |
| 18 | **Meters → election bonus mapping** | Meters tick in Lingering (2.5.1) but mapping to election outcomes not surveyed | Each `NationalMeter` value translates to a specific election bonus/penalty (Rev/Budget +Trad +1 / -Prog enth; Dom Stab +1 → incumbent -1; Honest Gov't = no effect; Party Pref → direct numeric advantage) | Audit + add `metersToElectionBonus(meters)` function | ingested (gilded post 266) |
| 19 | **Faithless electors** | Not visible | Random per-state EC desertions add stray votes to off-ticket candidates (post 267: "one faithless elector each from IA, KS, WI") | Add faithless-elector roller in EC tally | ingested (gilded post 267) |
| 20 | **Governor's actions library** | Phase 2.5.1 Lingering exists but no `governor.takeAction` library | Each governor takes 1–N actions/half-term against a fixed library: Build roads/bridges/canals, Increase Maritime/Manufacturing/Agriculture/Mining/Finance, Major Irrigation (needs same-party senator), Establish State Bank, Gerrymander (needs Iron Fist+Justice+Controversial), Build State University, Improve best industry, Women's Suffrage in State, Increase state gov jobs, 2-year / 4-year terms, Discriminate against former Secessionists (seceded-state only), Anti-Corruption campaign, Enact Jim Crow Laws | New governor-action enum + handlers; d100 roll vs 20·`Gov` skill; per-action prereqs + state-status checks | ingested (gilded posts 134-150) |
| 21 | **State-level policy flags** | `State` (types.ts:1318) has no `policies[]` flag | Persistent state policy switches: Poll Tax, Jim Crow, Prohibition, Women's Suffrage, Segregation — turned ON/OFF by Gov actions or era events; some are *time-bounded* (Jim Crow Gov actions are 3x points for 30 years) | Add `State.policies` map + duration support | ingested (gilded post 125) |
| 22 | **Egghead Cabinet advisory + multi-decider era events** | `EraEvent.decider` is single-role (types.ts) | Cabinet secretaries with `Egghead` trait weigh in on era events; Passive/Pliable Pres accepts cabinet *majority* recommendation; Multi-role *implementation* (e.g. Sec of State + UK Minister rolling for Oregon Treaty diff) | Multi-decider model + Egghead advisory step + implementation roll layer | ingested (gilded posts 126-129) |
| 23 | **Executive Actions library (2.8.1)** | Phase exists; library not visible in code | Pres can take N actions/half-term (N varies by traits; `Easily Overwhelmed` rolls to hand off to VP); persistent active actions (green = stays, yellow = auto-deactivates on admin change); named actions: "Swing around the circle" (1-30 success / 31-50 fail / else no-op), "Establish Bureau of Labor", "Pro-military budget increase policy" | Add `executiveActions[]` state + library + activate/deactivate semantics | ingested (gilded posts 201-203) |
| 24 | **Faction Personalities drift (2.1.8)** | `Faction.ideologyCards/lobbyCards/interestCards` exist; drift rules unknown | Each half-term, factions *add and lose* cards (GM-narrated; e.g. Brocklin Added Big Corporations + Human Rights, Lost Liberals + Environmentalist + LW Media); apparently legislative-track-record driven | Surface the rule set; algorithmic vs GM-discretion question | ingested (gilded posts 49, 323) |
| 25 | **Foreign-relations meters (per-power)** | Single-meter set assumed | Separate per-power relation meters: UK / France / Spain / Prussia / Russia / China; era-dependent (Prussia → Germany post-1871) | Per-power relation meters + era-renames | ingested (gilded post 132) |
| 26 | **Diplomacy actions (2.7.1)** | Phase exists | Three documented actions: Increase Relations (±1), Increase Trade Relations (need ≥neutral; 5-6 → +rev/budget, 1-2 → -rev/budget), Extend Credit (rev/budget ≤ balanced; 10% relations +1 + 10% econ stab +1) | Three diplomacy handlers + budget integration | ingested (gilded post 198) |
| 27 | **National surplus integer** | `revenue` meter is ordinal | Forum tracks a *numeric* national surplus ("Our national surplus is now at +16") alongside the ordinal `revenue` meter | New `nationalSurplus: number` separate from the ordinal meter | ingested (gilded post 200) |
| 28 | **Congressional Leadership pipeline (2.2.1)** | Phase exists | Detailed rules: Speaker, House Maj/Min Leader, House Maj/Min Whip, Sen Maj Ldr + Maj Whip + Pres Pro Tem, Sen Min Ldr + Min Whip; Red incumbents can't be challenged in their position when Red is dominant; Whip races are ranked-choice (eliminate, redistribute by closest ideology); committee chair eligibility requires *previous service on that committee*; each role grants ±points + traits (e.g. Speaker → +1 Legis, lose Obscure, gain Propagandist/Kingmaker) | Pipeline runner + RCV + committee-eligibility check + role-effect table | ingested (gilded posts 50, 60, 61, 66, 324, 333, 334) |
| 29 | **Faction Leaders Selected (2.2.3)** | Phase exists | Faction leader can step down and *anoint* a successor; Passive → must be replaced; `Easily Overwhelmed` blocks running for Party Leader; auto-replacement candidate pool is rule-bound (post 341: "Pres Clinton is passive so you must switch... pick any Mod that has either Reformist or Business") | Anointment flow + trait-based eligibility filter | ingested (gilded posts 67, 71, 78, 341) |
| 30 | **Party-Leader incumbency fatigue (2.2.4)** | Phase exists | Being PL for 5+ terms → party pref -1; trait-driven enthusiasm shifts on PL election (Charisma +1 party pref; Iron-Fist Mod -2 enthusiasm; etc.) | Add PL-term counter + on-elect effect table | ingested (gilded post 85) |
| 31 | **Cabinet *regional* penalty for unrepresented regions** | Cabinet scoring exists (CABINET_SEAT_SCORING, types.ts:1221) | If the Pres's party has *no* cabinet rep from a region, that region gets -1 in the next Presidential race (post 112: "For having no representation in the cabinet the President's party will receive a -1 in the next Presidential race in the regions of: Upper South, Deep South, Midwest") | Add per-region cabinet-coverage check → election malus | ingested (gilded post 112) |
| 32 | **Cabinet eligibility ties to state status** | `cabinetSeatsForYear` is year-keyed; state-status not visible | A pol from a non-state / not-yet-territory cannot be appointed to cabinet (post 103: George Curry Law from OR fails because OR isn't a territory yet) | Cabinet appointment guard on state status | ingested (gilded post 103) |
| 33 | **Foreign-territory acquisition via era event** | `admitState` exists (territories.ts) | Era event can grant territories en bloc (Oregon Treaty: BC, WA, OR, ID at once); rolled implementation; *territories* (organized vs unorganized) precede statehood; State of the Union tab tracks held lands | Era-event → territory grant flow + organized/unorganized status + State-of-the-Union view | ingested (gilded posts 106, 129) |
| 34 | **Census-driven EV changes** | `state.electoralVotes` is static-ish | Events stash EV deltas that fire at the next census (post 125: "MN +1EV in the next census", "VT -1 EV in the next census") | Pending-census-delta queue + decennial census tick | ingested (gilded post 125) |
| 35 | **Industry leadership + scoring** | `state.industries` field exists | Leading state per industry tracked (Maritime ME, Finance NY+PA, Manufacturing RI, Agriculture TN, Mining WV); points to faction holding the Gov/Sen of that state at half-term close | Leader-table compute + scoring hook | ingested (gilded post 133) |
| 36 | **Stat decay at old age** | `MORTALITY_RULES` handles death | At end of half-term, "Old-Age Rolls" can drop a skill by 1 (post 297: Magnum -1 Admin) | Separate from death roll; needs age-keyed decay table | ingested (gilded post 297) |
| 37 | **Defeated-incumbent auto-retire** | Not visible | Defeated presidential candidates, defeated governors, defeated reps auto-retire at the end of the half-term | Auto-retirement after losing election | ingested (gilded post 297) |
| 38 | **Auto-Carpetbagger on alt-state moves** | Carpetbagger trait exists (`TRAITS_PR4b` etc.) | A successful alt-state relocation automatically awards Carpetbagger (post 36: "WI->MO (ALT-STATE) Done gains Carpetbagger") | Auto-apply trait on relocation outcome | ingested (gilded post 36) |
| 39 | **Constitutional Amendments as durable on/off state** | `constitutionalConvention.ts` covers the *initial* Constitution; later amendments not surveyed | Forum has passed amendments altering the presidency's term (4-yr default → 6-yr / repealed), VP-vacancy fill, etc. Repealing the 6-year amendment defaults back to 4 (post 173); options are limited (no-limit / 1-term-for-life / 2-term-for-life) | New `amendments[]` state with effect-bound rules; bill type for amendments; ratification threshold | ingested (gilded posts 159, 164, 173, 188, 276-277) |
| 40 | **Faction nicknames as era-flavored party labels** | `Faction.nickname` exists (types.ts:1297) | Nicknames evolve: "War Democrats", "Radical Republicans", "Finance National Republicans", "Mavericks", "Noell Democratic-Republicans"; party identity reskins itself per era | Surface mechanic; player-edit + algorithmic-update mix | ingested (gilded post 298) |
| 41 | **`modern` era is dormant** | Rule tables carry `modern` rows (mortality, leadership, anytime-events, trait bands) (types.ts:507, 460, 1076) | Implied late-timeline play; the Gilded-Age scenario *should* be `modern` or a sibling era | Activate `modern` with a Gilded-Age scenario, or split into `gilded` + `progressive` | codebase + ingested (gilded post 1 implies multi-era split) |

Open balance/feel questions (build proves correctness, not fun) live below.

## Open questions

- **Era enum**: is `Gilded Age` a distinct entry in the `Era` enum or does
  `modern` cover 1868→present? The forum frames 1868–1892 *and* "the next
  era" — implying at least two more eras beyond `nationalism`. Likely needs
  `gilded` + `progressive` (or similar).
- **Era cadence**: the digested thread is the *continuation* of an
  1800-start game, so the forum runs a **continuous multi-era campaign**, not
  discrete scenarios — confirmed. How does the engine carry state across an
  era boundary (party realignment, ideology profile shift, card-pool swap)?
- **Per-era ideology drafting profile**: post 1 shows Brocklin's drafting
  profile shifting Lib/Mod → Prog/Lib *on entering* the Gilded Age. Is this
  a per-(faction, era) authored table or a rule-driven drift?
- **Tariff representation**: meter integer vs. amendment-set integer vs.
  both? Forum reads it as a single national integer set by legislation
  (`Set average tariff to 36%`).
- **Currency representation**: a `MonetaryRegime` enum (Gold / Bimetallic /
  Silver) seems likeliest given the Bimetallism bill passed House and was
  *filibustered* in Senate; the regime is a single national choice.
- **`*Crisis Bill*` taxonomy**: which crises does the design recognize?
  Observed in-thread: Economic, Honest Gov't (Corruption), Domestic,
  Anti-Naturalization, Anti-Native, Anti-Chinese.
- **State policy flag set**: are Poll Tax / Jim Crow / Prohibition / Women's
  Suffrage / Segregation the full set, or larger?
- **Per-party faction cap**: this thread has 5 Blue + 5 Red factions = 10
  total. Is the design capped at 5 factions per party?
- **Faction-personality drift (2.1.8)**: GM-discretion or algorithmic? The
  per-half-term add/lose card list looks legislative-record-driven.
- **VP impact rule set**: confirm the 10 binary checks observed in posts
  225 and 250 are the canonical list.
- **Old-age stat decay**: age-keyed table or randomized?
- **Foreign-relations roster**: fixed at UK/France/Spain/Prussia/Russia/China
  or era-dependent (Prussia → Germany post-1871, China changes post-1911)?
- **National surplus** (integer, post 200 = +16) vs `revenue` (ordinal):
  same thing, or two separate quantities?
- **Drafter ordering**: this thread uses a fixed pick order (post 1) but
  doesn't show how it was set this turn — snake, election-result-weighted,
  or fixed-list?

## Sources

- **Ingested digests:**
  - [`f4c7c2c4-ampu-1800-playtest-continued-1868`](playtest-digests/f4c7c2c4-ampu-1800-playtest-continued-1868.md)
    — 343 posts / 5 chunks. Gilded-Age (1868–1872) multiplayer playtest, 8
    human factions + 2 CPU per party. The continuation of a longer 1800-start
    campaign, so it also confirms the design supports continuous play across
    eras. Establishes the multiplayer, multi-era, Gilded-Age, and
    convention / legislation / governor mechanics gap rows above. GM:
    @ebrk85.
- The shipped-build description ("What this game is / Eras / Core entities /
  Glossary") was generated from the AMPU codebase + `CLAUDE.md`.
