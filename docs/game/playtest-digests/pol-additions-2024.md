# Digest — `pol-additions-2024` (146 authoritative pol ADDITIONS + the 182-column intended DATA MODEL)

**Type:** DATASET INGEST (★ NOT a forum batch) — two things from one workbook:
(1) an authoritative community **proposal list of 146 real politician ADDITIONS**
to the roster, and (2) the ★ **182-column "Vstyle" intended politician DATA MODEL**
(WIP, 224 real figures) — the designer's far-richer successor to the shipped
`Politician` type / 63-col roster.
**Source:** `4b5d4ca7-Copy_of_Pol_additions_2024.xlsx` (3 tabs). Tag `pol-additions-2024`.
**★★ PLAYTESTERS EXCLUDED (user hard-rule):** the workbook's `Playtesters` tab was
dropped entirely and **7 playtester "vanity" rows were removed from the Vstyle tab**
in preprocessing. This digest references **NO playtester**. ("Added by" in Pols-2024
is contributor attribution, not a politician entry — the added figures are all real.)
Also filtered: **69 `#VALUE!` error rows**.
**Inputs (cite by CSV col/row + §):** `analysis.md` (two datasets, reconcile counts,
the 182-col categorization + schema deltas, data-quality); `pols2024.csv` (146 rows,
`Name/US_Rep/WinChanceNote/Wiki/AddedBy/Bio`); `vstyle_clean.csv` (224 rows, 182 cols,
playtester-free); `historical-context-pol-additions-2024.md` (the historian's grounding).
**No forum posts** — cite by file/column/row, not `POST n`.

> **Why it matters:** this batch does two jobs at once. As a **roster-expansion pass**
> it fills the roster's two thinnest seams the roster companion flagged — the dense-
> but-incomplete **founding bench** (obscure 1st–5th-Congress US Reps + Revolutionary
> officers the 1772 scenario draws from) and the **sparsest band, 2001+** (a deliberate
> **2024-cycle wave**). As a **schema R&D pass** the Vstyle model reveals the designer's
> *intended* per-politician data model — **name decomposition, dynasty/family links,
> full demographics with a natural-born-citizen presidency gate, a three-stage career
> skill ARC, dated party-flip/ideology-shift/relocation schedules, and an election-point
> ladder** — almost none of which the flat shipped `Politician` type can express. It is
> the single clearest statement in the KB of *where the politician data model is meant
> to go*, and it re-confirms/sharpens a large cluster of existing data-model gaps while
> surfacing one genuinely-new dimension (a temporal skill arc) and one genuinely-new
> gate (citizenship → presidency).

---

## ★ The 146 additions + roster reconcile (vs the 7,349-roster ground truth)

Two lists, leaning the same direction (per `analysis.md` §Reconcile; grounded by the
historian's era spread):

- **`Pols 2024`** — 146 names, **1 already in roster → 145 GENUINELY NEW**. Fields:
  `Name / US_Rep? / WinChanceNote / Wiki / AddedBy / Bio` (all 146 have a Wiki link;
  10 have bios). `US_Rep` populated for ~55/146.
- **`Vstyle`** — 224 names, **3 already in roster → 221 GENUINELY NEW** (after the
  7-playtester + 69-`#VALUE!` exclusions). Decomposed into the 182-col model.
- **Overlap:** 131 names appear on BOTH lists.

**Era & office spread** (the deliberate fill targets — historian §1):
- **Founding / early republic (draft ~1772–1800)** — the *single densest cohort*:
  obscure 1st–5th-Congress US Reps, Continental-Congress delegates, Revolutionary
  officers who served but never made the marquee roster (Silas Talbot, Thomas Truxtun,
  Aedanus Burke, Israel Jacobs, Matthew Lyon, Ira Allen, Titus/Hezekiah Hosmer), many
  **Pro-Admin/Anti-Admin**-labeled (the pre-party 1st-Congress framing).
- **Antebellum/Jacksonian, Gilded/Progressive, New Deal→late-20th c.** — second-tier
  Reps, reformers, **Reps-elect who died before taking office** (~39 rows: Andrew J.
  Campbell 1894, William Dowse 1812, Francis J. Harper 1836), mayors, athletes-turned-
  politicians (Harold Washington, Marion Barry, Lynn Swann, Bill "Spaceman" Lee).
- **Modern / 2024 cycle (draft ~2000–2024)** — the *largest deliberate theme*: 2024
  Senate/House/Gov nominees, winners AND losers (Alsobrooks, Gallego, Slotkin, Moreno,
  Vince Fong, Vivek Ramaswamy, Josh Stein, Mark Robinson, Marie Gluesenkamp Perez);
  plus a state-chief-justice run (Reiber, Rabner, Hecht, Rush, McGrath).

Fidelity is **high** (historian §2, 12 cross-era checks, no identity/attribution
errors); the additions are real, correctly stated, era-appropriate. Per the roster's
balance rule the marginal never-served / Reps-elect-who-died cohort correctly carries
**sub-floor** `Draft`/`Historic Value` — do NOT "correct" them out.

---

## ★ The 182-column Vstyle model — categorized (vs the shipped `Politician` + 63-col roster)

Verified against `vstyle_clean.csv` header by column index. The far-richer intended
schema (col ranges from `analysis.md` §182-col categorization):

- **identity / name (0–6):** Full Name, **PoliticianID** (a stable key vs the roster's
  known duplicate-name problem), **First / Middle / Surname / Suffix** (name
  decomposition), Wiki.
- **★ family / dynasty (7–10):** **Dynasty, Politician Father, Politician Mother,
  Politician Spouse** — first-class relational fields (proof-of-concept: Hezekiah L.
  Hosmer → father Titus Hosmer, a real founding father→son pair both in this batch).
- **values (11–13):** Special Draft, **Draft Value**, **Historic Value** (two scores).
- **state / team / ideology (14–16):** Initial State, Initial Team Color, Initial Ideology.
- **★ temporal lifecycle (17–24):** **Peak Abilities Year**, Draft Year, Historic
  Retirement, Age at Historic Death, Birth Year, Death Year, Year turns 25, Year turns 75.
- **★ temporal skills First/Midway/Historic × 6 (25–42):** 18 columns — First-Year /
  Midway / Historic × {Command, Legislative, Governing, Judicial, Military,
  Administrative}. A **three-stage career skill ARC** (entry → peak → historic ceiling).
- **expertise (43–63):** INITIAL + Total (Historic) EXPERTISE + **19 axes** —
  Agriculture, Business, Economics, Education, Energy, Environment, Foreign Affairs,
  Healthcare, Housing, Justice, Labor, Media, **Army**, Naval, Science, Technology,
  Trade, Transportation, Welfare. (Note **"Army"** where shipped uses **"Military"**.)
- **interests (64–72):** Total + 8 axes — Civil Rights, Expansionist, Nationalist,
  Pacifist, Left-Wing Activist, Reformist, Theocrat, Right-Wing Activist.
- **trait-gain years (73–77):** Obscure Removed, Year Gains Celebrity / Leadership /
  Military Leader / Controversial — dated trait acquisition.
- **traits (78–134):** 57 columns (superset of the roster's 55).
- **★ demographics (135–154):** 20 columns — **race×6** (White/Black/Hispanic/Asian/
  Native American/Tribal), **religion×9** (Muslim/Mormon/Non-Religious/Buddhist/Hindu/
  Jewish/Catholic/Protestant + the White-Protestant default), **citizenship** (Natural
  Born / Foreign Born — the presidency gate), **gender** (Man/Woman), **sexuality**
  (Straight / Openly LGBT).
- **★ party-flip + ideology-shift + alt-states (155–167):** 13 columns — Can be
  Independent, **Can Party Flip + Flip Date Year 1/2/3**, **Ideology Shift Date 1 +
  New Ideology 1**, **Alternate State 1/2/3 + When Relocated to AS 1/2/3**. Per-pol
  SCHEDULED data (dated switches + relocations).
- **election point tiers (168–178):** Election Bonus/Penalty + a ladder
  **20 / 10 / 7 / 5 / 3 / −3 / −5 / −7 / −10 / −20 pts** — the electability-scoring
  columns, authored per pol.
- **bio (179):** free-text biography prose.

---

## ★★ Schema reconciliation vs shipped (`src/` HEAD, code-verified 2026-07-01)

The Vstyle model is a **relational, time-aware, demographically-tagged** characterization;
the shipped `Politician` (`types.ts:1251-1291`) is a flat, static stat block. The deltas:

| Vstyle model dimension | Shipped reality (code-verified) | Delta |
|---|---|---|
| **Family/dynasty** (Dynasty + Father/Mother/Spouse) | `Politician` has NO family/parent/spouse field (grep `dynasty`/`father`/`mother`/`spouse` over `src/` = 0) | The first-class-FIELD form of the #194 dynasty graph (Father/Mother/Spouse columns) |
| **Name decomposition** (First/Middle/Surname/Suffix + PoliticianID) | single `firstName`/`lastName` (`types.ts:1253-1254`); id is a slug | model field — folds under #240 |
| **★ Temporal skill ARC** (First/Midway/Historic × 6) | `Skills = Record<SkillKey, number>` (`types.ts:41`), `skills` is STATIC (`:1271`); no time dimension | **NEW, MAJOR — no owner** (skills-grow-over-a-career; `Peak Abilities Year` + trait-gain years) |
| **Temporal lifecycle** (Peak-Abilities-Year, turns-25/75, Historic-Retirement, Age-at-Death) | `birthYear`/`deathYear?`/`age`/`retiredYear?`/`draftedYear?` only (`:1267-1287`) | richer than shipped; folds under #240 / the temporal-skill row |
| **Skills = Command + 5** (NO backroom) | `SkillKey` = 7 keys INCL. `backroom` (`types.ts:24-41`); `command` separate (`:1281`) | re-confirms **#319** from the intended-model side |
| **Expertise 19 axes** | `Expertise` = 19 axes (`types.ts:182-186`), matches EXCEPT authored **"Army" vs shipped "Military"** (`:185`) | naming delta only — reconcile on import, folds under #216/#240 |
| **Interests 8 axes** | `interests: string[]` (`:1282`) | map to the interest-card axis |
| **Traits 57** (incl. Everyman, Lawful, Union Loyalist) | `Trait` union = 55 (`types.ts:62-117`) | **#216** — adds 3 beyond even the 55-roster set (see below) |
| **★ Demographics** (race/religion/gender/sexuality/citizenship) | NO demographic field of any kind in `src/` (grep = 0) | **#238/#239** own gender + the race×religion×sex tuple; Vstyle extends to sexuality + citizenship |
| **★ Natural-Born vs Foreign-Born = presidency gate** | no citizenship field; no per-pol presidency-eligibility gate (the only foreign-born-ineligible note is the succession-line Acting-President edge case, glossary §548; Reconstruction "citizenship" is #324 stripping, unrelated) | **NEW gate — no owner** (Art. II eligibility, distinct from the #238 suffrage gate) |
| **Party-flip + ideology-shift SCHEDULE** (Can-Party-Flip + 3 flip-date years + shift-date + new-ideology) | `partyId`/`ideology` (`:1265-1266`); NO flip/shift date fields | **#4/#171** (+#239 owns the flip-COUNT) — the authored per-pol shift SCHEDULE |
| **Alt-States ×3 + when-relocated** | single `altState?` (`:1256`) | **#38** — multi-alt + relocation TIMING (the #4e518e05 historical-move-date layer) |
| **Election point tiers** (20/10/7/5/3/−3…−20) | `applyTraitElectionBonus` deterministic bands (`electionEffects.ts`) | **#189** — the authored per-pol point ladder |
| **Historic Value vs Draft Value** (two scores) | `computePV` DERIVES PV at runtime (`pv.ts`); no stored authored value | **#339** — splits realized weight from draft-time prestige |
| **Bio** (free text) | NO bio field (`Politician`, grep = 0) | **#338** — re-confirmed from BOTH lists (Vstyle + Pols-2024 carry Bio) |

---

## ★ Data-quality (import-hygiene caveats — SOURCE-DATA issues, NOT in-app code defects)

Per historian §4 + `analysis.md` §Data-quality. These are **source-data-quality notes
that gate a clean import**, not shipped-code bugs (so NO new DH row):

- **★ Citizenship flag mis-populated for naturalized/foreign-born figures** (the most
  consequential). Confirmed foreign-born figures are NOT flagged Foreign-Born (some
  read Natural-Born): **Matthew Lyon** (Irish-born) — neither flag set; **Robert Dale
  Owen** (Scottish-born) — `Natural Born Citizen = 1`; **Bernie Moreno** (Colombian-born
  per his own bio) — citizenship tail reads Natural-Born. Since this flag is the
  **presidency-eligibility gate**, mis-setting it would wrongly model naturalized
  citizens as president-eligible. **Verify each foreign-born figure's flag before wiring
  the gate to a mechanic.** (This feeds the NEW citizenship-gate row as an import caveat.)
- **Stale pre-Nov-2024 "candidate/nominee" bios** on figures who then WON: Alsobrooks
  (won MD Sen), Moreno (won OH Sen), Gallego (won AZ Sen), Slotkin (won MI Sen), Fong
  (won CA-20). Treat `Bio` strings as snapshot-dated; refresh before import (feeds #338).
- **`Age at Historic Death` garbage for living figures** — blank `Death Year` yields
  nonsense negatives (Alsobrooks −1971, Gloria Johnson −1962, Dean Barkley −1950).
  Ignore negative ages (spreadsheet formula artifact).
- **Truxtun's state (PA vs NY/NJ)** — Vstyle lists PA; sources tie him to NY/NJ. Verify.
- **`#VALUE!` rows already filtered (69); 7 playtester rows already excluded.** No action.
- **Sparse coverage** — Dynasty and demographic fields are only PARTLY filled (WIP): the
  obvious Matthew Lyon→Chittenden Lyon and Robert Owen→Robert Dale Owen dynasty links
  are left blank. Coverage, not concept, is the model's weakness.

---

## Shipped-vs-designed

**The entire 182-col model is ~0% shipped as a data model** — the shipped `Politician`
type is a flat static stat block missing every ★-flagged dimension. Concretely,
code-verified @HEAD (2026-07-01):

- `Politician` (`types.ts:1251-1291`): NO dynasty/father/mother/spouse; single
  `altState?` (`:1256`); `skills: Skills` STATIC (`:1271`, `Skills = Record<SkillKey,
  number>` `:41`); NO race/religion/gender/sexuality/citizenship; NO flip/shift-date
  fields; NO bio; NO stored draft/historic value (PV is derived by `computePV`, `pv.ts`).
- `SkillKey` (`types.ts:24-41`) = **7 keys incl. `backroom`** + separate `command`
  (`:1281`) — the model (and the authoritative roster) omit `backroom` (#319).
- `Trait` union (`:62-117`) = **55**; the model has **57** incl. Everyman / Lawful /
  Union Loyalist (#216).
- `Expertise` (`:182-186`) = **19 axes** using **"Military"**; the model authors **"Army"**
  (naming delta, #216/#240).
- The **dataset pipeline** (`scripts/seedDataset.mjs` `CURATED_ROWS`/`ERA_FIGURES`;
  `legislatorsToDataset.mjs`) does **NOT ingest these files** — grep of `scripts/` for
  `pol.additions`/`pols2024`/`vstyle` = 0. `CURATED_ROWS` builds to 143 marquee figures
  from the in-script `ROWS` array; none of these 146+221 additions are present (#240).

So the additions are un-ingested and the intended model is unrepresentable at runtime.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

**SHARPEN (owners exist):**
- **#240** (dataset pipeline) — the 146 Pols-2024 (145 new) + 221 genuinely-new Vstyle
  figures are `CURATED_ROWS`/`ERA_FIGURES` candidates the pipeline doesn't ingest today
  (grep `scripts/` = 0). They target exactly the roster's thin seams (founding bench +
  2001+ tail). ★ IMPORT-HYGIENE (fold here): exclude playtesters, filter `#VALUE!` rows,
  fix the citizenship flags + refresh the stale "nominee" bios BEFORE import; the
  never-served / Reps-elect-who-died cohort gets sub-floor stats (their low `Draft`/
  `Historic Value` already matches); reconcile authored **"Army" → shipped "Military"**.
  Name-decomposition (First/Middle/Surname/Suffix + PoliticianID) folds here as a
  data-model field (a real key for the roster's duplicate-name problem).
- **#216** (trait vocab) — the 182-col model carries **3 traits beyond even the
  authoritative 55-roster set: Everyman (col 113), Lawful (col 123), Union Loyalist
  (col 135)**, confirming from the intended-DATA-MODEL side the three the roster tracked
  only obliquely (Everyman = the `terminology`/`yearname` Low-Brow→Everyman rename;
  Lawful = the b44 Cop→Lawful rename; Union Loyalist = the #121 loyalty trait). Also
  re-confirms the 13 genuinely-missing (Disharmonious/Pliable/Bookkeeper/Cop/
  Geostrategist/Illicit/Easily-Overwhelmed/Teflon/Late-Bloomer/Lackey/Incoherent/
  Jurisprudence/Lowbrow) as actual columns. Extend #216's reconciliation with the +3.
- **#238 + #239** (demographics) — the Vstyle model has FULL demographics, not just
  gender: **race×6, religion×9, sexuality (Straight/Openly-LGBT), citizenship
  (Natural/Foreign-Born)**. #238 owns gender→suffrage; #239 owns the race×religion×sex
  tuple + the curated-override flags (Can-be-Independent / Can-Party-Flip / Alt-State).
  SHARPEN both: the Vstyle model is the intended-DATA-MODEL confirmation of that tuple,
  extended with **sexuality** and **citizenship** as concrete columns.
- **#4/#171** (ideology/party) — the model carries **Can-Party-Flip + Flip-Date-Year-1/2/3
  + Ideology-Shift-Date-1 + New-Ideology-1** as PER-POL SCHEDULED data (the authored
  schedule behind the party-shift/ideology-drift system; e.g. Moreno's dated 2021 →
  RW-Pop shift). #4 owns the era matrix + the era-relative team/ideology anchoring;
  #239 owns the flip-COUNT. SHARPEN: this is the per-pol DATED-SCHEDULE form.
- **#38** (relocation/alt-states) — **3 Alternate States + When-Relocated-to-each**
  (multi-alt + timing): the concrete-schema form of the #4e518e05 historical-move-date
  layer this row already flags. Shipped `Politician` has a single `altState?` (`:1256`).
  Examples: Matthew Lyon VT→KY (AS=KY, relocated 1801); Laphonza Butler MD→CA (2021,2023);
  Ira Allen VT→PA (1803). SHARPEN #38.
- **#189** (down-ballot election trait stack) — the **Election Bonus/Penalty point ladder
  (20/10/7/5/3/−3/−5/−7/−10/−20)** as authored per-pol data — the per-pol values behind
  the election-trait-scoring model. SHARPEN #189.
- **#319** (backroom) — re-confirms the model has **Command + 5 skills, NO backroom**
  (both the canonical reference AND the authoritative roster AND now the intended data
  model omit it). Reinforces the drop-from-`Skills` side.
- **#338** (bio) — the model (col 179) AND Pols-2024 (`Bio` col) BOTH carry a bio field,
  re-confirming the unhomed bio field; note the stale-nominee-bio hygiene item.
- **#339** (Draft Value) — the model splits **Historic Value vs Draft Value** (two scores:
  realized weight vs draft-time prestige) — extends the stored-prestige finding.
- **#194** (dynasty/lineage) — ★ JUDGMENT CALL: **#194 already OWNS the family/dynasty
  graph** (parent→child + marriage edges; "the shipped `Politician` has NO field for" a
  dynasty grouping). The Vstyle **Dynasty + Politician Father/Mother/Spouse columns** are
  the first-class-FIELD form of #194 — the exact schema decomposition prior curated
  rosters (histpres/strongnevernom/failednoms/VP) implied only as a "Dynasty" grouping.
  SHARPEN #194 (NOT a mint — the brief's "likely NEW" resolves to owned after grep).

**MINT (genuinely unowned — grep-confirmed 0 in `src/`, no owning gap row):**
- **★ TEMPORAL skill progression** (First-Year / Midway / Historic per skill = a career
  skill ARC; shipped `Skills` is STATIC). No owner. → **NEW #342.**
- **★ Natural-born-citizen PRESIDENCY-eligibility GATE** (the citizenship axis wired to
  Art. II). Distinct from the #238 gender→suffrage gate (different attribute, different
  office); the only near-mention is the succession-line Acting-President edge case
  (glossary §548), not a per-pol data-field gate; Reconstruction "citizenship" is #324
  stripping (a punishment, unrelated). No owner. → **NEW #343.** (Carries the
  citizenship-flag SOURCE-DATA bug as an import caveat, per #240.)

---

### Open questions (for the human / consolidation)

- **Temporal-skill arc — how does the engine consume it?** The model stores First/Midway/
  Historic per skill + `Peak Abilities Year`. Is the runtime intent to (a) interpolate a
  live skill value by year, (b) step skills at 3 discrete life stages, or (c) use it only
  to seed a single at-draft value + a growth schedule? Determines the `Skills` re-model.
- **Citizenship gate scope** — does the natural-born flag gate *presidency only* (Art. II),
  or also VP / other offices? And is it a hard bar or a heavy penalty? (Fix the SOURCE-DATA
  flag first — Lyon/Owen/Moreno are mis-tagged.)
- **Fuller-demographics home** — one big demographics tuple (race×religion×gender×sexuality×
  citizenship) on `Politician`, or split across #238/#239's existing homes? The model
  treats each as a boolean column.
- **Two value scores** — do Draft Value and Historic Value BOTH get stored, or is Historic
  Value derived / used only for scripted "realized-weight" effects? (Pairs with #339.)
- **Which additions actually land in `ROWS` vs `ERA_FIGURES`?** The full-strength 2024
  winners are `CURATED_ROWS`-class; the never-served / Reps-elect-who-died cohort is
  sub-floor `ERA_FIGURES`. Not enumerated per-figure here.
