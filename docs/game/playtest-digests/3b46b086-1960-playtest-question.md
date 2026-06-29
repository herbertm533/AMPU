# Digest — 3b46b086 "1960 Playtest Question" (topic 1382)

- **Source:** `docs/game/sources/3b46b086-1960-playtest-question/` — 1 chunk, 21 posts, ~7.5k chars.
- **Type:** Playtest BALANCE/DESIGN discussion (Discord-overflow into forum), not a playthrough. No narration, no in-game years simulated here — it's the diagnosis thread for the **1960 modern-era MP playtest** that the eras docs already track.
- **Cast (designers/playtesters):** vcczar / "Arkansas Progressive" (creator, the two are the same handle mid-rename — note POST 31 "Edited by Arkansas Progressive" on a vcczar quote), Murrman104 (raised the bug), Vols21 (the "draft classes 1944 & prior" sheet detail), OrangeP47, MrPotatoTed tagged. Playtester poll among the faction-players.
- **Era framing:** modern era (post-WWII band), 1960 start, JFK-era cabinet. See `docs/game/historical-context.md` for the 1960 governance context. No historian ran this batch.

## Provenance note — where this thread sits in the corpus
This is the **ROOT-CAUSE discussion** that sits UPSTREAM of the two 1960 threads
already deeply digested elsewhere:
- `8bc0231c` "The Big Red Button — 1960 playtest" (the original run that broke).
- `3c3c46f0` "Out of the Ashes — 1960 playtest restart" (the eventual restart/re-stat).

This thread is the moment the bug was first named and triaged (Murrman104 → vcczar),
the data-model vocabulary was stated by the author (rookie / midway / historic-peak
stats), the fix was specified (apply midway/peak to pre-game drafts only), and the
playtester poll chose **mid-course correction over restart, 8-4** (POST 15-18) —
though the corpus shows a full restart ultimately happened anyway (`3c3c46f0`).
It therefore corroborates and dates the existing gap rows **#186 / #187 / #179 /
#124 / #86 / #115 / DH-25**; it is not a new mechanic so much as the cleanest
statement of the **scenario-boot stat-initialization** requirement and the **peak-year
stat data model** behind it.

---

## What this thread reveals

### ★ HEADLINE 1 — Admin scarcity craters every cabinet (the symptom)
- POST 3 (Murrman104): "Politicians are too weak, this is fine for most stats but
  not for **admin**. There's maybe 8 … pols in the game rn with 3 admin and **none
  with more than 3**. This is leading to a scenario where every cabinet is filled
  with a bunch of **2's who crater the meters**."
- **Party-competence asymmetry / death-spiral risk** (POST 3): "the **Republicans
  have a far more competent array of cabinet officials. The Democrats have a far
  weaker selection and will likely continue to plunge the nation into a hole if/when
  they win in 64**." → a structurally lopsided bench means whichever weaker party
  wins drags the meters down with no recovery path.
- Pairs with the **cabinet→meters lever (#124)** and **legislation→meters (#12)**:
  appointee Admin is the input that the lingering/meter engine multiplies, so a
  whole roster capped at 2-3 Admin guarantees a meter crisis at turn 1.

### ★★ HEADLINE 2 — ROOT CAUSE: the scenario booted everyone on ROOKIE/draft stats
This is the load-bearing revelation and it exposes a **data model the shipped build
does not have**:
- POST 5-6 (vcczar): the data model has, **per politician**, three stat tiers:
  - **historic stats** — "take place at **peak year** or after. Each politician has
    a **peak year**."
  - **midway stats** — "for politicians … that start **after draft year but before
    the peak year**."
  - (implied) **rookie/draft-start stats** — the floor at draft.
- POST 6: the 1960 run "used the stats that **Cal started the playtest with** and the
  **old traits**. So **midway and peak stats were NOT added**." (Plan: add them "in 64.")
- POST 7 (vcczar): "Without them, **everyone is starting with rookie stats**. Apply it
  **only to those that were drafted BEFORE game start**. Those **drafted in-game** have
  to **develop naturally via career track** and etc." (POST 8: "yea that's the plan.")
- POST 9 (Vols21, citing the sheet): the boot rule keyed to draft-class AGE —
  **draft classes 1944 & prior = MAXED** ("16 years which follows the **career path
  logic**"); **8-15 years = MIDPOINT**. (i.e. ≥16 career-years → peak; 8-15 → midway;
  <8 → rookie.) This is the concrete **scenario-BOOT stat-initialization formula**.
- → Cross-ref the **scenarioBoot keystone** + **peak-year stat model**: the boot must
  walk each pre-game draft class, compute its career-age at the start year, and apply
  rookie / midway / peak stats accordingly. The 1960 boot skipped this entirely.

### ★ HEADLINE 3 — CJCS / military-admin coupling (the residual problem after the fix)
Even WITH maxed stats applied, the cabinet problem only partly resolves:
- POST 9-10 (Vols21): "even with maxed-out stats, **most Generals have ZERO Admin**,
  so the **Chairmen of Joint Chiefs will continue to tank the military prep** as
  evidenced by the hole dug so far." (POST 10 alt: "or we use **mil during lingering
  phase**, depending on what rules we want.")
- POST 12 (designer consensus, "ton of discussions lately on the JC"): **do NOT beef
  up Admin for generals** — "then they'll end up being **used for Cabinet and
  Ambassador roles in ways not often done in history** (the exceptions have extra
  admin already)." Historical-fidelity guard against mis-using high-Admin generals.
- **Hybrid fixes floated** (the CJCS military-admin coupling design space):
  - POST 12 — CJCS effectiveness = **military skill + admin gained upon appointment**
    (totals "**3 with some getting 4**" for the ones checked). [preferred]
  - POST 10/11 — alternatively, **use military ability during the Lingering phase**
    for the CJCS seat instead of Admin.
  - POST 11 — give CJCS **admin −1 for historical** (i.e. equivalent-admin = mil−1)
    **and +1 on a future appointment with a base of 0** — "as a forum test."
- → Requirement: the meter/lingering engine must read a **role-specific competence
  value** for the CJCS seat (military-derived, not raw Admin), and military-track
  officers must gain a small Admin/competence bump **on appointment** rather than
  carrying high base Admin. Cross-ref the **military-appointment** and **officer
  cohort** work the corpus already tracks (DH-75 / #209).

### Process / methodology (POST 13-21)
- The choice presented (POST 15): **Option 1 = mid-course correction** (adjust stats
  for 1964, keep playing) vs **Option 2 = complete restart in 1960**.
- Poll result: **8-4 in favor of Option 1** (mid-course correction) among playtesters
  (POST 16-18); poll was a **playtester poll** with who-voted hidden during voting
  and a close date (POST 19-21). 12 votes > number of factions → it was a general
  playtester poll, not one-vote-per-faction.
- **Meta-verdict (POST 14):** "**the game failed the test so far** — didn't have
  correct stats to start AND **some rules have been completely rewritten**, plus one
  more unique to post-WWII eras still up in the air." Suggestion to **restart 1960
  (or another year) with the edits**, possibly **mix up the teams** for testing.
- **Election process flagged for its OWN standalone test** (POST 14): "I still think
  the **election process needs its own standalone testing** to help determine if all
  the changes made went too far." → corroborates the existing "election-scorer needs
  isolated testing" thread of the corpus.

---

## Shipped reality check (grep src/, this batch)
Verified against the current build so the deltas are labelled honestly:

| Designed (this thread) | Shipped today | Verdict |
|---|---|---|
| Per-politician **peak year** + 3 stat tiers (rookie / midway / historic-peak) | `Politician` carries **ONE** `skills: Skills` block + **one** `command` (`src/types.ts:1271,1281`). No `peakYear`/`midway`/`peak`/`rookie` field anywhere in `src/` (every "peak" grep hit is "Speaker"/"speak"). Seed rows (`src/data/draftImport.ts:13`, `politicians1856.ts`) and the draft CSV (`CSV_COLUMNS`, draftImport.ts:31) author exactly ONE stat set. | **NOT BUILT** — the multi-tier stat model the author describes does not exist in code; the build hard-codes a single "current" stat block per politician. |
| Boot applies midway/peak by **draft-class age** (≥16 yrs maxed, 8-15 midway, <8 rookie) for pre-game drafts | `scenario1856.ts` / `scenario1772.ts` seed fixed authored stats; **no boot-time stat scaling by draft-class age** exists. | **NOT BUILT** — boot does no age-based stat initialization. |
| In-game drafts "develop naturally via career track" | **EXISTS** — `careerTrack`/`careerTrackYears` (`types.ts:1279-1280`), `CAREER_TRACK_MAX_YEARS = 20`, `rollThreshold` every 4 career-years applying `addSkillPoint` on `TRACK_SKILL` (`phaseRunners.ts:455-470`), mentor acceleration. | **BUILT (partial match)** — the in-game development path the author wants is real; only the **pre-game back-fill** (apply the equivalent of N career-years at boot) is missing. NOTE career cap is **20** in code vs the sheet's **16-yr "maxed"** path — reconcile. |
| CJCS / Joint Chiefs seat; military-prep meter; mil-during-lingering | **NOT FOUND** — no `jointChief`/`CJCS`/`chairman` (only "Speaker") and no military-prep meter in `src/`. Build ships **1772 + 1856 only**; the whole modern-era cabinet/officer apparatus is unbuilt. | **NOT BUILT** — entire CJCS coupling is future modern-era content. |
| Party-fatigue penalty (referenced as not-applied in the 1960 boot, POST 14's "rules rewritten") | tracked at **#187** in game-context. | **NOT BUILT** (per existing gap log). |

---

## Deltas vs current build (the handoff list)

- **★ DELTA-1 (boot stat-init):** Scenario boot MUST apply midway/peak stats to
  pre-game draft classes by **career-age** (POST 9 sheet rule: **≥16 yrs → maxed/peak,
  8-15 yrs → midway, <8 yrs → rookie**), else the roster boots at rookie/draft stats,
  Admin caps at 2-3 across the board, and **every cabinet craters the meters at turn 1**
  (POST 3, 5-9). In-game drafts continue to develop via the existing career track
  (POST 7-8 — that path is BUILT). Requires a **multi-tier stat data model** that the
  shipped `Politician` (single `skills` block, no `peakYear`) does **not** have.
  → Cross-ref **scenarioBoot keystone**, **#186** (deterministic late/mid-era boot),
  **#86/#115** (boot data/procedure), **DH-25** (back-date recent draft classes into
  career tracks). This thread is the upstream root-cause statement for all of them.

- **★ DELTA-2 (cabinet→meters dependency, #124 / #12):** the meter/lingering engine
  multiplies appointee **Admin**; with no high-Admin bench it is structurally
  un-survivable. Boot-stat-init (DELTA-1) is the **precondition** for #124/#12 to
  behave — without correct seed stats the cabinet→meter lever (#124) and
  legislation→meter lever (#12) both read garbage inputs and spiral.

- **★ DELTA-3 (party-competence asymmetry):** authored benches are lopsided (GOP >>
  Dem cabinet competence in 1960, POST 3) → whichever weaker party wins triggers a
  meter **death-spiral**. Boot stat-init alone won't fix it; the per-era bench needs a
  **competence-parity balance pass** (or the meter engine needs floors). New balance
  requirement, not yet a tracked row.

- **★ DELTA-4 (CJCS military-admin hybrid):** the Joint-Chiefs seat must NOT consume
  raw Admin (generals have 0 Admin by design, and high-Admin generals get mis-used as
  cabinet/ambassadors, POST 12). Designer-preferred fix: **CJCS effectiveness =
  military skill + admin-gained-on-appointment** (≈3-4 total, POST 12); alternatives:
  **use military ability in the Lingering phase** (POST 10) or **admin-1 historical /
  base-0 +1-on-future-appointment** (POST 11). Requires a **role-specific competence
  read** for the CJCS seat + an **on-appointment competence bump** for military-track
  officers. → Cross-ref **DH-75** (military appointment) / **#209** (officer cohort).

- **DELTA-5 (election process needs isolated testing):** POST 14 — the election/scorer
  changes "may have gone too far" and warrant a **standalone election test** separate
  from the campaign playtest. Corroborates the existing election-scorer-testing thread.

- **Process datapoint (no code delta):** playtesters chose **mid-course correction over
  restart 8-4** (POST 15-18); corpus shows a restart (`3c3c46f0`) happened anyway —
  evidence that a stat-bump patch mid-game was judged insufficient once the boot was
  wrong, reinforcing DELTA-1's "boot it correctly the first time."

## Open questions (for the human)
- **Career-age thresholds vs code:** sheet says **16 yrs = maxed / 8-15 = midpoint**
  (POST 9); shipped `CAREER_TRACK_MAX_YEARS = 20`. Which governs the boot back-fill —
  the 16-yr "career path" figure, or the 20-yr in-game cap? Reconcile before authoring.
- **Stat-tier storage:** does the eventual model store 3 explicit stat blocks per
  politician (rookie/midway/peak + a peakYear), or store peak + a derivation rule that
  computes rookie/midway from career-age? (The author speaks of authored tiers; the
  cheaper build might derive them.)
- **CJCS competence formula:** which of the three hybrids (POST 10/11/12) is canon?
  POST 12's "military + on-appointment admin" reads as the front-runner but was never
  finalized in-thread; the redbutton restart eyeballed the cabinet re-stat (per the
  existing #186 note), so the per-era cabinet/officer strength seed remains OPEN.
- **Bench-parity:** is competence asymmetry between parties intended era-flavor (1960
  GOP genuinely had a deeper executive bench) or a balance bug to flatten?

## Cross-references
- **scenarioBoot keystone** (`docs/game/game-context.md`, gap **#186**: deterministic
  late/mid-era boot incl. back-dated career tracks) — this thread is its **root-cause
  origin**; the `BootSheet` must include the per-draft-class stat-tier back-fill.
- **#124** cabinet→meters lever; **#12** legislation→meters — both depend on DELTA-1.
- **#179** lingering-roll engine (the mechanism that craters meters from low Admin).
- **#187** party-fatigue penalty (POST 14 "rules rewritten").
- **#86 / #115** boot data + boot procedure; **DH-25** back-date recent draft classes.
- **DH-75 / #209** military appointment + officer cohort (the CJCS hybrid, DELTA-4).
- Companion 1960 threads already digested: `8bc0231c` (original run), `3c3c46f0`
  (restart/re-stat) — this thread is the diagnosis between them.
