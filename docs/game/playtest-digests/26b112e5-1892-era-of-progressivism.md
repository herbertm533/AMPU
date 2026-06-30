# Digest — `1892prog` (26b112e5): "1892: Era of Progressivism"

> **Batch 55.** 23 posts / 1 chunk (read in full). A **1892-start** era-playtest, GM
> **@Arkansas Progressive**, run **out of the Political Process Discord** with **mixed human +
> CPU factions**, **"automating just about everything but decisions that require player input
> (Era Evos and similar)"** (POST 1) — i.e. the script-heavy automation model. Only one in-game
> year is narrated: the **1892 leaders → appointments → confirmations → gains → deaths/retirements**
> cycle (no elections reached; first electoral year would be 1894/96). **★ The whole value is
> MECHANICAL**: it (a) names a **1892 "Era of Progressivism" START ERA** the app's 4-value `Era`
> enum can't express; (b) lists **10 era-specific faction NAMES** (period-accurate **Red =
> Republicans**); (c) prints the **Cabinet Appointment ENTHUSIASM Calculator** — a concrete
> per-faction, appointment-tier-roll enthusiasm spec **absent from the shipped build**; and
> (d) confirms the full 2.x phase loop. **Polarity = the 1896–1932 PRE-REALIGNMENT HINGE**
> (historical-context §5 / cross-era polarity map row "1896–1932"): in 1892 **BLUE = Democrats,
> RED = Republicans, progressivism in both parties** — do NOT read as modern left/right.

## Era framing (no re-research — see historical-context.md §5 + the cross-era polarity map)

The 1896–1932 row is already grounded: **the hinge, pre-realignment**, modern left/right does
**not** apply. This run sits just before it at **1892**: **BLUE = Democrats** (Cleveland, Bryan,
the Solid South), **RED = Republicans** (Reed, Blaine, Lodge — dominant/pro-business, plus
insurgent/Liberal wings). Period-accurate placements in the thread confirm Red = Republican:
**Frederick Douglass leads R1 "Liberals,"** **Henry Cabot Lodge Sr** leads R5 "Tariff Republicans,"
**Thomas Brackett Reed** = R3 "Moderates," **James G Blaine** = R4 "Imperialists." This is the same
band as `wilsons1916`/`solo1916` ("Era of Hollywood") but **four years earlier**, and a **NEW era
LABEL** — the GM calls the 1892 band **"Era of Progressivism"** (POST 1, thread title).

## ★ 1892 is a START ERA the build can't express (corroborates #92 / #301)

| Fact | Thread | Build reality |
|---|---|---|
| **1892 "Era of Progressivism" is a selectable start era** | "starting in the Era of Progressivism … a pre-rookie draft of the Era's established politicians" (POST 1) | **No 1892/Progressivism scenario** — only `scenario1772.ts` + `scenario1856.ts` (`ls src/data/scenario*.ts`). |
| **Era band ≠ any `Era` enum value** | "Era of Progressivism" | `Era = 'independence'\|'federalism'\|'nationalism'\|'modern'` — 4 values, `types.ts:1337`. There is **no Gilded-Age/Progressive band**; 1892 collapses into `modern`. The spreadsheet supports arbitrary-year starts; the app does not. |

This is the recurring **era-granularity (#92) + scenario-flexibility (#301)** gap: the GM boots an
arbitrary historical year off a spreadsheet ("pre-rookie draft of the Era's established
politicians"), which the engine has no scenario/era-band content for. One more datapoint that the
game is *designed* as era-agnostic and *built* with two hardcoded scenarios.

## 10 era-specific faction names (the #40/#306 era-faction-identity system in action)

Period-accurate **Red = Republicans** / **Blue = Democrats** (POST 12; leaders in parens):

| Blue (Democrats) | Red (Republicans) |
|---|---|
| **B1 Progressives** — William Jennings Bryan | **R1 Liberals** — Frederick Douglass |
| **B2 Conservationists** — Charles Barwig | **R2 School Book Liberals** — William B Allison |
| **B3 Conservatives** — William C Redfield | **R3 Moderates** — Thomas Brackett Reed |
| **B4 Traditionalists** — John B Gordon | **R4 Imperialists** — James G Blaine |
| **B5 Traditionalist Democrats** — Grover Cleveland (kept) | **R5 Tariff Republicans** — Henry Cabot Lodge Sr |

Corroborates **#40/#306** (era-specific faction naming): the shipped factions are hardcoded
per-scenario (`factions1772.ts`, `factions1856.ts`); these 10 Progressive-era names are
GM-spreadsheet content with no build representation. Note B2 **"Conservationists"** + the
**Environmentalist** lobby card below = the era's distinctive (TR-adjacent) conservation politics.

## ★★ Cabinet Appointment ENTHUSIASM Calculator — concrete spec (POST 20) — *the sharpest NEW delta*

A script (output verbatim as "CABINET APPOINTMENT ENTHUSIASM CALCULATOR") runs **per
lobby/interest group** after appointments. For each group it rolls **once per post-tier the group
holds influence in**; a roll **≤ the tier threshold** triggers, applying **−1 enthusiasm to the
faction(s) that hold that group's card**:

| Tier | Trigger chance | Roll semantics (d100) |
|---|---|---|
| **Cabinet** | **20%** | "rolled NN (need <==20 to trigger)" |
| **Cabinet-Level** | **10%** | "need <==10" |
| **Ambassador / Gen / Adm** | **5%** | "need <==05" |

On trigger → "**TRIGGERED -> -1**" + "**Affected factions (-1): <factions>**". The 1892 run fired
six: **Private Education** (roll 07 → cabinet), **Environmentalist** (06 → −1 Blue 2),
**Military-Industrial** (03), **Science** (20 → −1 Red 1), **Protectionist** (12 → −1 Blue 5 + Red 5),
**Transportation** (09 → −1 Red 3). Net **FACTION ENTHUSIASM SUMMARY**: Blue 2, Blue 5, Red 1, Red 3,
Red 5 each −1. That faction-enthusiasm then rolls up into **ideology→party movement** ("TOTAL
MOVEMENT": Mod −2 Blue, Cons −2 Blue, Trad/RW Pop/LW Pop/Prog/Lib each −1 Blue).

**This is NOT the shipped enthusiasm system.** Shipped `Enthusiasm` is **per-ideology → party**, a
−5..+5 scale (`types.ts:1415-1418`: `{ [ideology]: { BLUE; RED } }`), built once at scenario start
(`scenario1856.ts:18` `buildEnthusiasm`), surfaced read-only on `EnthusiasmPage.tsx`, and **moved
only by era-event effects** (`enthusiasm: [{ideology, party, delta}]`, e.g. `eraEvents1856.ts:20`).
There is **no per-faction enthusiasm value**, **no interest-group-card → faction binding for
enthusiasm**, and **no appointment-tier 20/10/5% roll** anywhere in the engine
(verified `phaseRunners.ts` 2.3.x appointment/confirmation; grep `enthusiasm`/`faction.*enthusiasm`).
The calculator is an external community script; the build has a *coarser, differently-shaped*
mechanic. **Genuinely NEW** (closest existing relative: the per-faction-enthusiasm need flagged by
the `e45a756c`/`5027f0f3` era runs; this thread gives the exact 20/10/5% appointment-roll formula).

## Full 2.x phase loop confirmed (corroborates the standard turn flow)

POSTs 8–23 walk one 1892 year in order — confirms the engine's phase sequence end-to-end:

| Phase shown | Thread | Mechanic note |
|---|---|---|
| Career-track rolls | "rolls to assign career tracks to all factions … tedious" (POST 8) | corroborates #24 (per-pol career-track rolls) |
| Kingmakers & Protégés | POST 9 | corroborates the Kingmaker/Protégé pass |
| Cards distributed | POST 10 | corroborates #24 (lobby/interest card distribution) |
| **Congressional Leaders** | Speaker **Crisp beats Bryan 241-115**; Crisp gains **+1 legis (5), Leadership, Manipulative, Unlikable**; PPT **Harris unseated by Irby 54-34**; 4 House + 4 Senate chairs (POST 11) | corroborates 2.2.1/2.2.2 leadership + chair election; **leader-win grants ability/trait bumps** |
| Faction Leaders | 10 FLs selected; **B5 "had to keep Cleveland"** (no qualifying alternative — the fallback ladder) (POST 12) | corroborates #110 leadership pipeline / FL fallback |
| **Party Leaders** | Cleveland **party leader by default** (+leadership, **+100pts**, Cons +2 Blue / LW Pop·Prog·Lib −1 Blue, "**17/5 to avoid drop**"); Reed wins **after 3 ballots** (+1 command, **+100pts**, Mod +2 Red…, "**20/5 to avoid drop**") (POST 13) | corroborates #110/#185; **concrete party-leader rewards spec** (see below) |
| **Presidential Appointments** | Key Advisor + AG + 6 Secs + 7 Ministers + Senior Admiral/General + 3 Admirals (POST 14); per-pol stat+ideology+trait+RED-faction tags | corroborates 2.3.1; **exp-type→post matching enforced by hand**: "Benson has no Navy expertise, subbed with Robert Coontz" (POST 14) |
| **Interim Appointments** | Govs (OH McKinley, VA McKinney) appoint to **finish the Senate terms vacated by cabinet members** (Sherman, Swanson) (POST 15) | corroborates #61-adjacent vacancy-fill; **cabinet appointment vacates the appointee's prior seat → gubernatorial interim fill** |
| **Required Confirmation Votes** | committee + floor tallies per appointee (e.g. 18-4 & 76-12); **Minister Swanson REJECTED 10-12** (POST 16) | corroborates 2.3.1 confirmation; **failed confirmations exist** |
| Confirmation fallout | "Blame for Swanson's failure lies with Irby and the Senate Democrats, **shifting preference towards the Republican Party. Swanson gains controversial.**" (POST 17); Cleveland re-picks **Eustis, confirmed automatically** (POST 18) | **see NEW delta below** |
| **GAINS** | ability **+1 rolls w/ explicit roll/chance** ("AG gained +1 Admin (roll: 5, chance: 20%)", Spain +1 Admin 14/30%, Japan +1 Admin 1/20%); "**State rolled a 5 and removed 'obscure'**"; **expertise per office** ("State gains Army, Treasury gains Business…") (POST 19) | corroborates 2.3.1 post-confirm ability/expertise earn (cf. `ABILITY_EARN_RULES.cabinetConfirmAdmin`, `phaseRunners.ts:2203`) |
| **Cabinet Enthusiasm Calculator** | POST 20 (see ★★ above) | **NEW** |
| Regions / Available Posts | "**Regions: 8 … Available Posts: 9**"; "Cleveland −1 in Upper South, Mountain States, West Coast in 1896" (POST 21) | regional favorability set forward to next election (#293 era-favorability) |
| **Deaths & Retirements** | 30 deaths (old-age + **disease/accident**, each w/ **named cause + age**: pneumonia/cancer/diphtheria/dysentery/TB/"deadly accident"/heart attack/Bright's Disease/"unknown cause"); 18 retirements w/ **varied flavor reasons** (private sector, "pressured out," lobbyist, university president, disillusioned, family/health) (POST 22) | corroborates the deaths/retirement subsystem (#age-attrition); **named-cause + flavor-reason generators** |
| **Replacements** | interim gov appointment; **chamber counts update** (House 224 D-132 R; **Senate flips R 46-42**); **Senior General succession** (Merritt promoted, Martin replaces) (POST 23) | corroborates vacancy/replacement + senior-officer succession |

## Smaller concrete mechanics (each: NEW vs corroborates-#)

- **Party-leader election reward spec** — winner/default leader gets **leadership + 100 pts + an
  ideology→party-preference swing** (e.g. "Cons +2 Blue") **+ an "X/5 to avoid [ability] drop"
  roll** (POST 13: Cleveland 17/5, Reed 20/5). Concrete numbers for the party-leader payoff.
  Corroborates #110/#185 (leadership/convention rewards). `GM⇒App`.
- **★ Rejected confirmation → Controversial trait + party-preference shift** — a failed Senate
  confirmation (Swanson 10-12) **grants the appointee `controversial`** and **shifts state/party
  preference toward the rejecting party** (POSTs 16-17). The shipped 2.3.1 path handles successful
  confirmation (Admin/expertise earn) but **no rejection→Controversial/pref-shift branch exists**
  (grep `reject`/`Controversial` in `src/engine` finds only resolver-bool comments, not this).
  **Genuinely NEW.** `GM⇒App`.
- **Ability +1 gains are explicit die rolls vs. a per-office chance** (POST 19, "roll: 5, chance:
  20%") and **"obscure" is removed by a roll** ("State rolled a 5 and removed 'obscure'").
  Corroborates the post-confirm ability-earn engine (`ABILITY_EARN_RULES`, `phaseRunners.ts:2203`).
- **Expertise assigned per office** (State→Army, Treasury→Business, Navy→Naval, …; POST 19) —
  corroborates the appointment expertise-grant (`phaseRunners.ts:435/486/2221`, "gains expertise").
- **Exp-type→post matching is required** ("Benson has no Navy expertise, subbed," POST 14) —
  corroborates the appointment eligibility gate (and the `wilsons1916` Nimitz/branch finding).
- **Cabinet appointment vacates the appointee's old elected seat → interim gubernatorial fill**
  (POSTs 15, 23). Corroborates the vacancy/replacement chain.
- **Era-evo automation model** — GM **automates everything except player-input decisions (Era
  Evos)** (POST 1). One more datapoint that an end-to-end engine is *designed*; humans intervene
  only at branch points. `GM⇒App` (relates to the script-automation track #79).

## Open questions (for consolidation)

- **Per-faction enthusiasm vs. the shipped per-ideology→party enthusiasm** — are these two layers
  (faction-level enthusiasm rolling up into ideology→party movement), or is the build's model an
  intentional simplification of the calculator? The calculator clearly treats **enthusiasm as a
  per-faction quantity** the build does not have.
- **Should appointments perturb enthusiasm at all?** The build currently moves enthusiasm only via
  era-event effects; the calculator adds an **appointment-driven** source (20/10/5% per tier).
- **Is the rejected-confirmation→Controversial+pref-shift a generalizable rule** (any failed
  confirmation) or Swanson-specific GM flavor? Thread implies a rule (blame attribution logic).

## Candidate gaps/bugs for consolidation (each: NEW vs corroborates-#)

- **NEW — Cabinet-Appointment-Enthusiasm mechanic** (per-lobby, per-tier **20% / 10% / 5%** roll →
  **−1 enthusiasm** to card-holding factions, rolling up to ideology→party movement) is **absent
  from the build**; shipped enthusiasm is per-ideology→party (−5..+5, `types.ts:1415`), event-moved
  only (POST 20). The sharpest new delta. `GM⇒App`.
- **NEW — rejected confirmation → appointee gains `controversial` + state/party-preference shift**
  toward the rejecting party; no such branch in `phaseRunners.ts` 2.3.1 (POSTs 16-17). `GM⇒App`.
- **NEW — "Era of Progressivism" era-band LABEL at an 1892 start** — names a band distinct from the
  adjacent "Era of Hollywood"(1916)/"Era of Ideologies"(1928); off a spreadsheet "pre-rookie draft"
  (POST 1). Corroborates **#92 / #301** (era granularity / arbitrary-start scenario flexibility);
  the `Era` enum (`types.ts:1337`, 4 values) cannot express it.
- **NEW — 10 Progressive-era faction names** (period-accurate Red=Republican; Douglass→R1 Liberals,
  Lodge→R5 Tariff Republicans, Bryan→B1 Progressives) (POST 12). Corroborates **#40/#306**
  (era-specific faction identity); not in shipped hardcoded faction rosters.
- **NEW — concrete party-leader reward numbers** (+100 pts + leadership + ideology→party swing +
  "X/5 to avoid ability drop") (POST 13). Corroborates #110/#185. `GM⇒App`.
- **Corroborates the full 2.x phase loop** end-to-end (career-track → kingmakers → cards →
  cong. leaders → faction leaders → party leaders → appointments → interim → confirmations → gains
  → enthusiasm → regions → deaths/retirements → replacements) (POSTs 8-23).
- **Corroborates #293 era-favorability** — RED=Republican structurally strong in 1892 (Senate flips
  R 46-42 in the very first year; regional favorability set forward to 1896) (POSTs 21, 23).
- **Corroborates age-attrition deaths/retirements** — named-cause-of-death + age generator (disease/
  accident) and varied flavor retirement-reason generator (POST 22). `GM⇒App`.
- **Corroborates appointment eligibility / expertise** — exp-type→post matching enforced
  ("no Navy expertise, subbed," POST 14); per-office expertise + ability-earn die rolls (POSTs 14, 19).

## Source

`1892prog` (26b112e5) "1892: Era of Progressivism" — 23 posts / 1 chunk. **1892-start**, mixed
human+CPU, GM @Arkansas Progressive, run on the Political Process Discord, **script-automated except
player-input Era Evos** (POST 1). Narrates the **1892 leaders→appointments→confirmations→gains→
deaths cycle** only (no election reached). **Pre-realignment hinge polarity — BLUE = Democrats,
RED = Republicans** (historical-context §5). Cited `POST n` (`===== POST n =====` markers), 1 chunk.
