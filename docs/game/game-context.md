# AMPU — Game Context

> **Bootstrap version.** Written from the codebase + `CLAUDE.md` before any forum
> thread was formally ingested. "What this game is / Eras / Core entities /
> Glossary" describe the **shipped build** (cited `file:line`). The gap log is
> seeded with big deltas from an **example forum export pending ingestion** —
> tagged as such, not yet verified post-by-post. Forum digests will correct and
> extend this over time.

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
| (Gilded Age / later) | — | `modern` exists in rule tables only | tariff, currency, civil-service reform, imperialism (see gap log) | **Designed, not built** |

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

The heart of this doc; the roadmap is built from this. Bootstrap rows tagged
**source: example export (pending ingestion)** come from an example forum thread
present under `docs/game/sources/` but **not yet post-by-post ingested** — treat
as strong preliminary signal, to be verified/expanded when that thread is
formally digested.

| Area | In the build today | In the documented design | Delta / requirement | Source |
|---|---|---|---|---|
| **Players** | Single-player: one human faction (`isPlayer`), all others CPU (scenario1772.ts:64, scenario1856.ts:121) | **Multiplayer** — multiple human drafters take turns; players have handles (e.g. @Brocklin, @jnewt) | Multi-faction human control / turn arbitration; per-player ownership, identity, and async/seated turns; CPU only fills empty seats | example export (pending ingestion): `f4c7c2c4-AMPU_1800_Playtest_Continued_1868.csv` |
| **Eras covered** | Two scenarios: 1772 (independence→federalism) + 1856 (nationalism). `modern` era unreachable | Many more eras — an 1800s line continuing into the **Gilded Age (1868–1892)** and beyond | New scenarios/era content past 1860; reachable `nationalism→modern` transition; later starts | example export (pending ingestion) — thread title "AMPU 1800 Playtest Continued 1868" |
| **Gilded-Age issues** | No tariff/currency/civil-service/imperialism systems; 1856 issue set is slavery/sectional | Era-specific issues: **tariff**, **currency (Gold-Standard vs Free-Silver)**, **civil-service reform**, **imperialism**, emergent social movements | New era-event spines + issue axes + interest groups for post-1868 politics; party meaning re-mapped for the period | example export (pending ingestion) |
| **Social movements** | Fixed interest-group/lobby sets per era | "Emergent social movements" arise over the timeline | Mechanism for movements/coalitions appearing dynamically across eras | example export (pending ingestion) |
| **Phase taxonomy** | Numbered phases 2.1.1–2.10 (phases.ts) | Same numbered taxonomy used in the forum ("2.1.1 Politician Draft", …) | None — confirms the build is an implementation of the forum game (alignment signal, not a gap) | example export (pending ingestion) |
| **`modern` era** | Rule tables carry `modern` rows (mortality, leadership, anytime-events, trait bands) | Implied late-timeline play that would use them | No scenario/transition activates `modern`; tables are dormant until a post-Gilded-Age scenario exists | codebase (types.ts:507, 460, 1076) |

Open balance/feel questions (build proves correctness, not fun) live below.

## Open questions

- How does the forum game arbitrate **simultaneous human drafters** (snake order,
  bidding, seat assignment)? Needed before multiplayer can be specified.
- What is the **era cadence** in the forum (one continuous campaign across all
  eras, or discrete scenarios)? The example thread is "1800 … continued 1868,"
  suggesting continuous play — to confirm on ingestion.
- For post-1860 eras: do BLUE/RED keep the same labels or get re-mapped per era?
  (1772 and 1856 already differ.)
- Does the forum use the same `NationalMeters` set, or era-specific meters
  (e.g. a currency/gold meter for the Gilded Age)?
- Is `modern` intended as "Gilded Age+" or a distinct later era? Tables exist but
  the design intent for that bucket is unconfirmed.

## Sources

- _No forum digests ingested yet (bootstrap)._ The four living docs were
  generated from the AMPU codebase + `CLAUDE.md`.
- **Pending ingestion:** `docs/game/sources/f4c7c2c4-ampu-1800-playtest-continued-1868/`
  (343 posts, 5 chunks) — an example export referenced for the multiplayer /
  Gilded-Age deltas above; not yet formally digested.
