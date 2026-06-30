# Digest — "Era of Ideologies — a duo (1928 playtest)"

- **Slug:** `eb573c91-era-of-ideologies-a-duo-1928-playtest`
- **Source CSV:** `eb573c91-Era_of_Ideologies_a_duo_1928_playtest.csv`
- **Posts:** 17 (1 chunk, ~13.6k chars). Opened by **@Vee01** (GM + a player).
- **Participants:** **Vee01** (GM; starts as **B1 / BlueLW**), **@KevinStorm**
  (co-player; starts as **R5 / RedRW**), plus kibitzers **Zagnut** (proposes
  dropping the CPU rules), and the @-tagged thread regulars. **Aug 9–12, 2025**
  (post edit-stamps).
- **Type:** **Played chronicle — a 1928-start "Era of Ideologies" run, played as a
  DUO (2 humans).** This is a **SECOND, INDEPENDENT** 1928 playtest, distinct from
  `e45a756c`/`ideo1928` ("Era of Ideologies — Playtest from 1928"), the one already
  grounded in `historical-context.md` §5. POST 2 ("Pepperidge Farm remembers the
  first iteration") confirms it is a re-run of the same scenario.
- ⚠ **Multiplayer-table observations are DESIGN data, not the shipped app.** The
  browser build is **single-player** (one human faction vs CPU). The duo/house-rule
  table dynamics here describe the *meant-to-play* multiplayer game; read every
  "we played X" as the designed-intent column, not shipped reality.
- ⚠ **1928 is NOT a shipped scenario.** The app ships **1772 + 1856 only**
  (`NewGameScreen.tsx:6,8`); a 1928 start is a custom/imported-draft scenario. See
  Shipped-vs-designed.
- ⚠ **The chronicle is THIN.** The export captures only the **setup + 20-year
  career-track passes** (drafting, career placement). It **never reaches an
  election or an era event** — there are NO played election results, NO event
  firings, NO meter readouts in these 17 posts. (Contrast `ideo1928`, which runs
  1928→1936.) So this digest's electoral/event sections are necessarily empty;
  its value is the **draft/career-track + faction-mapping + house-rule** record.
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** It is a **clean second witness** to the 1928 "Era
> of Ideologies" hinge being played as a forum game — corroborating, from an
> independent table, the era's **scripted setup** (Hoover/Republicans = RED crush
> Al Smith/Democrats = BLUE, 444–87, "everything outside the Deep South"; POST 1),
> the **10-faction R1–R5 / B1–B5 ideology ladder** with **era-stamped draft
> ideologies** (#4/#92), and the **draft + 20-year career-track machinery** run by
> hand (the procedure the app's draft/career-track phases must reproduce). It also
> records two **house-rule / mode** data points relevant to #114 (the solo-vs-MP
> tension): the table abandoned per-faction CPU-ing for **"Mixed Doubles"** (each
> human runs a left-wing and a right-wing cluster), and notes a **"Reds vs Blues"
> ("Mixed Singles") rule set is planned**. No new mechanic and no bug surface; it
> is **almost entirely corroboration** of already-logged gaps.

---

## ★ The run: setup, factions, and the 10-faction ideology ladder

**Scenario opener (POST 1).** Verbatim-real 1928 framing: "Herbert Hoover and the
Republicans have delivered a crushing defeat to Al Smith and the Democrats … 444
electoral votes to Smith's mere 87 and carrying everything outside the Deep South,"
Republican majorities in both houses + the Court, a booming-but-cracking economy
(farm distress, inequality, speculation), and the era framed as **"liberalism,
fascism, and communism … competing for global dominance."** This matches
`historical-context.md` §5 (1928 Hoover def. Smith 444–87) exactly — the GM is
narrating real history as the era's cold-open, then handing it to the players.

**Era name in-game:** "**the Era of Ideologies**" (POST 1) — corroborates the
canonical band label (`historical-context.md` §5; game-context #92's 14-band map:
"Ideologies 1928-Hoover").

**The 10 factions = the R1–R5 / B1–B5 ideology ladder with ERA-STAMPED draft
profiles (POST 3).** The draft-order list prints each faction's allowed draft
ideologies — the per-(faction, era) ideology profile (#4) made literal for 1928:

| Slot | Faction | Draft ideologies (POST 3) |
|---|---|---|
| R5 | **RedRW** | Cons, Trads, RW pop |
| R1 | **RedLW** | Lib / Prog / LW Pop |
| R3 | **RedCent** | Libs, Mods, Cons |
| R4 | **RedRight** | Mods / Cons |
| R2 | **RedLeft** | Lib, Mod |
| B5 | **BlueRW** | Trad, RW Pop |
| B2 | **BlueLeft** | Lib, Mod |
| B1 | **BlueLW** | LW Pop, Prog |
| B4 | **BlueRight** | Cons / Trads |
| B3 | **BlueCent** | Mods, Cons |

Notes for the era-aware reader:
- This is the **1928 interwar polarity, mid-realignment** — BOTH parties still
  span a wide ideological range (a RED party that carries a **Lib/Prog/LW-Pop**
  faction in R1, a BLUE party with a **Cons/Trad** faction in B4). Do **not** read
  1928 RED/BLUE as the clean modern split. This is the §5 "polarity in flux" hinge.
- The endpoint factions (R5=Cons/Trad/RW-Pop, R1=Lib/Prog/LW-Pop, B5=Trad/RW-Pop,
  B1=LW-Pop/Prog) carry the wings; the center slots converge on Mod/Cons. Same
  shape as the shipped 1772 `eligibleIdeologies` data (#4) and the b52/b56
  per-slot matrix — one more independent witness that the matrix is **era-keyed**
  and that 1928 sits between the founding spread and the modern desync.
- Draft order at boot is **randomized** ("no points yet so just randomized," POST 3)
  — corroborates the cold-start-draft-order rule (draft order = prior-era points;
  none exist at a fresh start) (#2/#68/#232).

**Draftee cast = real ~1940s-50s-vintage figures drafted onto the 1928 board**
(POST 3): e.g. BlueLW gets **Tallulah Bankhead, Helen Gahagan Douglas, Marion
Zioncheck**; BlueLeft gets **Adlai Stevenson II, Stuart Symington, Mike Mansfield**;
RedCent gets **Thomas E. Dewey, Herbert Hoover Jr.**; RedRW gets **Charles
Lindbergh, Charles A. Halleck, Arthur Langlie**; BlueRW gets **Strom Thurmond, John
C. Stennis, Martin Dies Jr.** Treat the **roster as alt-history** (a deep
real-politician draft pool keyed to `draftYear`, not a curated 1928 class) — same
methodology note already logged for the 1916 starts (`historical-context.md` §5).
POST 7–8 flavor: "Tallulah Bankhead as a pol in this game is amazing" — a
non-Congress celebrity figure is draftable (the ERA_FIGURES / non-served-pol path).

## ★ The draft + 20-year career-track machinery (run by hand)

This is the load-bearing content of the export: the **draft** (POST 3) then the
**career-track placement** passes (POSTs 5–6) and a **20-year career-track
removal/development** pass (POST 17). It documents the procedure the app's
`runPhase_2_1_1_Draft` + career-track phase must reproduce:

- **Career-track placement = roll-vs-threshold per slot, with a fallback random
  pick from the eligible stat-pool (POSTs 5, 6).** Each faction places pols onto
  7 tracks (Private / Military / Judicial / Executive / Legislative / Admin /
  Backroom). Many placements show an explicit **`roll/threshold`**:
  - Successes: "Joseph Bottum (requires roll; 21/50, succeeds)"; "Howard Baker Sr
    … requires roll; 45/50 succeeds" (POST 5).
  - **Failures (threshold not met → slot left empty):** "Executive: None (90/75)";
    "Admin: None (91/75)"; "Backroom: None (87/75)"; "Military: Thomas
    D'Alesandro Jr (92/75, failed)" (POSTs 5–6). The recurring **`/75`** threshold
    is the standard career-track success bar; **`/50`** appears for a different
    (harder) class of placement.
  - **Eligibility-pool sub-selection:** when multiple pols qualify, the placement
    is "**randomly selected from pols with N [skill]**" — e.g. "Burton M Cross
    (7/75 to place, randomly selected from pols with 1 leg)"; "Kenneth Keating …
    randomly selected between 2 remaining pols with 2 admin"; and a nested
    geographic tiebreak: "William J Sebald … randomly selected from 2 pols in MD,
    itself randomly selected from the 4 states with the most B3 pols" (POSTs 5, 6).
    → the career-track placement is a **multi-stage seeded roll** (qualify by
    skill floor → random among the qualified pool → roll vs threshold). Same
    "resolve every step to a die roll" shape as the CPU-rules objective (#296).
  - **PV / highest-PV** is the tiebreak for the Private track: "Daniel Flood (6/75,
    highest PV)"; "Robert F. Kennon (1/75, highest PV)" (POST 6).
- **The 20-year career-track development pass (POST 17): track tenure grants
  skill points + traits.** After ~20 years on a track, a pol gains stat bumps +
  expertise + traits — e.g. "Noah M Mason gains +3 leg, Media, Debater, Theocrat,
  Manipulative"; "Tom Terral gains +4 gov, Military, Nationalist, Charisma,
  Debater, Efficient, Harmonious"; "Sheridan Downey gains +1 admin, +3 gov,
  Housing, Naval, Civil Rights, **loses Obscure**"; "Ruth Bryan Owen gains +2 admin,
  **+1 command**, Economics, Civil Rights, Egghead." This corroborates the shipped
  career-track development mechanic (`careerTrack`/`careerTrackYears`,
  `addSkillPoint`, `CAREER_TRACK_MAX_YEARS = 20`) — the gains-per-tenure +
  trait/expertise acquisition + "remove Obscure" are exactly the in-game
  development path (#289's *in-game* tier, which the build ships; the *boot-time*
  back-fill is the missing part).

## ★ House rules / mode — the duo wrestled with how to run 8 CPU factions

A live **mode-design** thread within the chronicle (POSTs 1, 9–16), relevant to
#114 (solo-vs-MP) and the multiplayer model (#1):

- **Plan A (POST 1): co-GA + per-faction CPU.** Vee = B1, Kevin = R5; the **other
  8 factions run as CPUs**, with each human doing the CPU actions for the *other's*
  team. "Neither of us have any experience running these … a light mix of house
  rules to keep things running smoothly." → confirms the **per-faction CPU-fallback**
  model (#1/#114): a 2-human game fills the remaining 8 seats with CPU.
- **Zagnut's objection (POST 9):** "much more fun if you dropped the CPU rules and
  just run it normally as human players" — i.e. **running CPU factions by hand is
  tedious** (a recurring CPU-burden complaint; corroborates the "CPU rules need to
  be no-interpretation / automatable" objective #296, and the GA-burnout finding).
- **Plan B → adopted (POSTs 14–15): "Mixed Doubles."** Instead of CPU-ing, the two
  humans split into **two ideological clusters**: a **left-wing cluster (R1, R2 +
  B1, B2, B3) run by Vee** and a **right-wing cluster (B4, B5 + R3, R4, R5) run by
  Kevin**, "still play each faction separately to roleplay … it wont just play as
  if there were 2 big factions." → a **cross-party, ideology-based team split** —
  one human controls multiple factions spanning *both* parties at the same end of
  the spectrum.
- **★ Planned rule set "Reds vs Blues" ("Mixed Singles") (POST 16):** one human
  runs ALL Red, the other ALL Blue — explicitly called "a planned rule set,
  apparently." → a **2-player party-vs-party mode** is on the design roadmap.
  (New *terminology* only; the underlying multi-faction-per-human control is
  already covered by #1. Logged so the names are traceable.)

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-30)

- **★ 1928 is NOT a shipped scenario.** `NewGameScreen.tsx` offers exactly two:
  `ScenarioId = '1772' | '1856'` (`:6`), `SCENARIOS = [{id:'1772',year:1772}, {id:'1856',year:1856}]`
  (`:8-18`); `startNewGame(factionId, scenarioId)` (`:39`) only accepts those.
  Scenario data ships only as `scenario1772.ts` + `scenario1856.ts` (glob = 2
  files). A 1928 "Era of Ideologies" start is a **custom/imported-draft** scenario
  the forum runs off a spreadsheet, with **no shipped boot pipeline** — corroborates
  #92 (the model is start-anywhere; the build hardcodes two scenarios) and #301
  (scenario flexibility). The interwar faction roster, era-stamped draft profiles,
  and era-event spine for 1928 are all **UNBUILT**.
- **★ No 1928 faction set; factions are static per-scenario 3-bucket sets.**
  Factions ship as `FACTIONS_1772` / `FACTIONS_1856` (`factions1772.ts` /
  `factions1856.ts`); `Faction.personality` is the coarse `'LW'|'Center'|'RW'`
  3-bucket (verified `factions1856.ts:5-16`). The thread's **R1–R5 / B1–B5 ladder
  has NO representational home** — the build cannot express a 1-to-5 ideology rank
  per party (already logged on #293/#4). The per-faction era-stamped draft
  ideologies (POST 3) are the #4 per-era profile — shipped only for the **1772
  inaugural draft** (`factions1772.ts` `eligibleIdeologies` consumed by the
  `isExpansion1772` branch); **no 1928 profile, no later-draft profile**.
- **Ideology 7-point scale MATCHES.** The thread's `LW Pop / Prog / Lib / Mod /
  Cons / Trad / RW Pop` is exactly the shipped `Ideology` union (`types.ts:5-12`)
  + `IDEOLOGY_ORDER` (`:14-22`). No delta here — corroboration only.
- **7 NationalMeters confirmed; none read in this thread.** `NationalMeters` =
  `{revenue, economic, military, domestic, honest, quality, planet}`
  (`types.ts:1399-1407`). The chronicle never reaches a meter readout, so no
  meter-behavior claim to verify; the era-gated-`quality`/`planet` inversion
  (#292) is untouched here.
- **Career-track development DOES ship; placement-by-roll is the in-game path.**
  The POST-17 "+N skill, +traits, loses Obscure" gains are the shipped career
  track (`careerTrack`/`careerTrackYears`, `CAREER_TRACK_MAX_YEARS = 20`); the
  POST 5–6 placement rolls are the draft/career-placement phase. Corroborates the
  *in-game* development tier of #289 (the boot-time multi-tier stat back-fill is
  the part still missing — not exercised here).
- **No election/event firing to verify.** The export stops before any
  `calcStateVote` or era-event runs, so the canonical 1928 election-engine and
  era-event findings (#247 state-lean, #292 election scoring) are **not**
  independently re-witnessed by this thread (they ARE by the sibling `ideo1928`).

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned. This thread is almost entirely corroboration of a
second-witness kind; one terminology-only addition flagged NEW for consolidation.)*

- **CORROBORATES #92 (eras-as-content-bands; start-anywhere) — SECOND 1928
  witness.** A second, independent 1928-start run prints the "Era of Ideologies"
  band + its era-stamped 10-faction draft profile (POST 1, 3); the app ships 1772
  + 1856 only (`NewGameScreen.tsx:6-18`). Distinct thread from `ideo1928`
  (`e45a756c`) already cited on #92. UNBUILT.
- **CORROBORATES #4 (per-(faction, era) ideology drafting profile).** POST 3 is a
  literal 1928 instance of the per-faction allowed-ideology table (R1=Lib/Prog/LW-Pop
  … B5=Trad/RW-Pop), confirming the matrix is era-keyed and that 1928 sits between
  the founding spread and the modern desync. Shipped only for the 1772 inaugural
  draft; 1928 profile UNBUILT.
- **CORROBORATES #293 (difficulty = faction ideology × era) + its R1–R5/B1–B5
  representational gap.** The thread runs the full 10-slot ladder the build's
  3-bucket `Faction.personality` (`factions1856.ts:5`) cannot represent. No new
  difficulty data; reinforces the missing 1-to-5 rank axis.
- **CORROBORATES #1 / #114 (multiplayer model; per-faction CPU fallback; solo-vs-MP
  tension).** A 2-human game fills the other 8 seats with CPU (POST 1); the CPU
  burden is felt and rejected mid-thread (POST 9). Confirms CPU-as-per-faction
  fallback + that the *forum* game is multiplayer while the app is solo.
- **CORROBORATES #296 (CPU rules must be no-interpretation / automatable) — from
  the table-burden side.** "Drop the CPU rules … much more fun as human players"
  (POST 9) is another instance of by-hand CPU operation being tedious; and the
  career-track placement is itself a **multi-stage seeded `roll/threshold`** (POSTs
  5–6, `/75` and `/50` bars) — the exact d100-vs-band shape #296 wants reproducible.
- **CORROBORATES #289 (in-game career-track development tier).** POST 17's
  per-tenure "+N skill / +expertise / +traits / loses Obscure / +1 command" gains
  are the shipped career-track path; the boot-time multi-tier back-fill (the
  missing half of #289) is not exercised here.
- **CORROBORATES #232 (cold-start draft order).** "No points yet so just
  randomized" (POST 3) confirms draft order = prior-era points, randomized at a
  fresh start.
- **NEW (terminology only → consolidation may fold into #1/#114) — named 2-player
  modes "Mixed Doubles" and "Mixed Singles / Reds vs Blues".** "Mixed Doubles" =
  each human runs a cross-party ideological cluster (left: R1,R2,B1,B2,B3 / right:
  B4,B5,R3,R4,R5; POSTs 14–15); "Mixed Singles" = one human all-Red vs one
  all-Blue, **a planned rule set** (POST 16). No new *mechanic* (multi-faction
  human control is #1) — record the names so the planned "Reds vs Blues" mode is
  traceable.

### Open questions (parking lot)
- **Q1 — career-track placement thresholds:** the export shows `/75` as the
  standard placement bar and `/50` for some (Bottum, Howard Baker Sr) — what
  distinguishes the two bars? (Skill-floor met vs not? A harder track?) Not stated
  in-thread; the shipped placement phase is the authority to reconcile against.
- **Q2 — does this run continue elsewhere?** The export ends at the 20-year
  career-track pass (POST 17) with no election/event ever played. If a continuation
  thread exists, it (not this one) would carry the 1928 election/event corroboration.
