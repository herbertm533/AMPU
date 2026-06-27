# Digest — e6ff0ddc "Historic US Presidents in AMPU"

**Type:** DATASET-AUTHORING source (not a playthrough). vcczar (tier-1 / game
designer) posts the authoritative AMPU statline for real US Presidents, one per
post ("one new president every day"), 2021-10-01 → 2021-10-15.
**Scope:** 1 chunk / 54 posts. **47 presidents statted** (Washington → Biden;
Cleveland counted once). Remaining posts are chatter / follow-up promises
(failed-nominees & Historic-VP lists "maybe", POST 25-26, 52-54).
**Pipeline relevance:** these are **CURATED_ROWS-style overrides** — they belong
in `scripts/seedDataset.mjs`, NOT the generated files. `CURATED_ROWS` is
**currently empty** (`export const CURATED_ROWS = []`), so **none of these 47 are
authored into the dataset today.** This thread is the canonical source to fill it.
**Provenance:** post numbers cite the `===== POST n =====` markers in chunk-001.

---

## The canonical curated-pol statline schema (the headline)

Every president is one fixed-shape record (POST 1 is the template):

| Field | Meaning | Maps to shipped type? |
|---|---|---|
| **Name** | first + last | `firstName`/`lastName` |
| **Dynasty** | named lineage + members (spouse/children/nephews/"what-ifs") | **NO field** — see Gap D1 (#194) |
| **Ideology** | one of the 7-point scale (abbrev: Mod/Cons/Lib/Prog/RW Pop) | `Ideology` (after expand, OK) |
| **Initial Abilities** | the **6 skills 0-5**: Command, Legislative, Governing, Judicial, Military, Administrative | `command` (separate) + `Skills{legislative,governing,judicial,military,admin}` |
| **Initial Expertise** | ONE expertise tag (Justice/Military/Naval/Business/Economics/Education/Labor/Media/Foreign Affairs/Science) | `Expertise[]` (all 10 valid) |
| **Special Interests** | 0-3 interest tags (Expansionist, Reformist, Nationalist, Civil Rights, Pacifist, RW/LW Activist, Theocrat, …) | `interests: string[]` (free-string today) |
| **Traits** | list of named traits; note **"doesn't start with Obscure"** is itself a stated flag | `Trait[]` — **14 names DON'T match the union** (Gap D2 / #216) |
| **Misc** | flags: `Can be Independent`, `Can party flip N times`, `Southern Unionist (won't secede)`, `Can move from <ST> to <ST>` | **NO fields** — see Gap D3 |
| **Demographics** | "Standard (White Protestant Male)" or e.g. White Catholic / Black Protestant | **NO field today** |
| **Notes** | prose: ideal office, crisis fit, manipulator risk (design rationale, not data) | n/a (authoring rationale) |

> Note the schema treats **Command as the 1st of "6 abilities"** even though the
> code splits `command` out from the 5-key `Skills`. Same data, different grouping.

---

## Statted presidents (compact)

Format: **Pres** — Ideo | Cmd/Leg/Gov/Jud/Mil/Adm | Expertise | dynasty? | misc flags.

| # | President | Ideo | Cmd/Leg/Gov/Jud/Mil/Adm | Expertise | Dynasty | Misc |
|---|---|---|---|---|---|---|
| 1 | Washington | Mod | 2/2/0/0/3/0 | Military | Washington | Indep; **S.Unionist** |
| 2 | J. Adams | Mod | 2/2/0/2/0/2 | Justice | Adams | — |
| 3 | Jefferson | RW Pop | 2/2/1/0/0/3 | Justice | Jefferson | — |
| 4 | Madison | Cons | 2/3/0/1/0/2 | Justice | Madison | — |
| 5 | Monroe | Cons | 2/1/1/0/1/2 | Military | Monroe | — |
| 6 | JQ Adams | Liberal | 1/1/1/1/0/3 | Justice | Adams | Indep; flip×2 |
| 7 | Jackson | RW Pop | 2/1/1/1/2/0 | Military | Jackson | **S.Unionist** |
| 8 | Van Buren | Mod | 1/1/1/0/0/1 | Justice | Van Buren | — |
| 9 | W.H. Harrison | Mod | 1/1/1/0/2/1 | Military | Harrison | — |
| 10 | Tyler | Cons | 1/1/1/1/1/0 | Justice | Tyler | Indep; flip×2 |
| 12 | Polk | Cons | 1/2/1/0/0/0 | Justice | n/a | — |
| 13 | Z. Taylor | Mod | 1/0/0/0/2/0 | Military | Taylor | Indep; **S.Unionist**; KY→LA |
| 14 | Fillmore | Mod | 1/1/1/0/0/1 | Economics | Fillmore | Indep |
| 15 | Pierce | Cons | 1/1/0/0/1/0 | Military | Pierce | — |
| 16 | Buchanan | Cons | 1/1/0/0/0/1 | Justice | n/a | flip×1 |
| 17 | Lincoln | Mod | 3/1/0/0/0/0 | Justice | Lincoln | — |
| 18 | A. Johnson | Mod | 1/1/2/0/1/0 | Business | n/a | **S.Unionist** |
| 19 | Grant | Mod | 2/0/0/0/3/1 | Military | Grant | OH→IL |
| 20 | Hayes | Mod | 1/1/2/0/1/0 | Justice | Hayes | — |
| 21 | Garfield | Mod | 1/1/0/0/1/0 | Education | Garfield | — |
| 22 | Arthur | Mod | 1/0/0/0/1/1 | Justice | n/a | — |
| 23 | Cleveland | Cons | 3/0/1/0/0/0 | Justice | Cleveland | — |
| 24 | B. Harrison | Mod | 1/1/0/0/1/0 | Justice | Harrison | — |
| 27 | McKinley | Cons | 2/1/1/0/1/0 | Military | n/a | — |
| 28 | T. Roosevelt | Lib | 3/1/1/0/1/1 | Military | Roosevelt | Indep |
| 29 | Taft | Mod | 1/0/1/3/0/1 | Justice | Taft | — |
| 30 | Wilson | Lib | 2/0/1/0/0/0 | Education | Wilson | — |
| 31 | Harding | Cons | 1/1/1/0/0/0 | Media | Harding | — |
| 32 | Coolidge | Cons | 1/1/1/0/0/0 | Justice | Coolidge | — |
| 33 | Hoover | Mod | 1/0/0/0/0/2 | Labor | Hoover | — |
| 34 | FDR | Lib | 3/1/1/0/0/1 | Naval | Roosevelt | — |
| 35 | Truman | Mod | 2/1/0/1/1/0 | Justice | n/a | — |
| 36 | Eisenhower | Mod | 2/0/1/0/3/1 | Military | Eisenhower | Indep; flip×1 |
| 37 | JFK | Mod | 1/1/0/0/1/0 | Naval | Kennedy | White Catholic |
| 38 | LBJ | Mod | 2/3/0/0/1/0 | Labor | Johnson | — |
| 39 | Nixon | Cons | 3/1/1/0/1/0 | Naval | Nixon | — |
| 40 | Ford | Mod | 1/2/0/0/1/0 | Naval | n/a | — |
| 41 | Carter | Mod | 1/1/1/0/1/0 | Naval | Carter | — |
| 42 | Reagan | Cons | 2/0/2/0/1/0 | Media | n/a | **starts as Dem**, can party-flip |
| 43 | GHW Bush | Mod | 1/1/0/0/1/1 | Naval | Bush | — |
| 44 | Clinton | Mod | 2/0/2/0/0/1 | Education | Clinton | — |
| 45 | GW Bush | Mod | 2/1/2/0/0/0 | Business | Bush | — |
| 46 | Obama | Lib | 2/1/0/1/0/1 | Justice | Obama | **Black Protestant** |
| 47 | Trump | RW Pop | 2/0/1/0/0/0 | Business | Trump | Indep; **flip×3**; NY→FL |
| 48 | Biden | Mod | 1/2/0/0/0/1 | Foreign Affairs | Biden | White Catholic |

*(Monroe re-posted at POST 11 = corrected/duplicate of POST 5; same stats.)*

---

## Notable picks & rulings (signal)

- **Strongest figures (high Command + dense traits):** Lincoln 3-Cmd, Cleveland
  3-Cmd, TR 3-Cmd, FDR 3-Cmd, Nixon 3-Cmd (POST 17,23,28,34,39). Designer calls
  Washington "one of the strongest in the game, **esp. with the addition of new
  traits**" (POST 1) and TR "absolutely uncanny" (POST 28) — these are the
  high-PV exemplars relevant to #214 tuning.
- **Skill cap = 3, not 5, in practice:** every president maxes a single skill at
  **3** (Madison 3-Leg, Taft 3-Jud, Grant/Eisenhower 3-Mil, LBJ 3-Leg). No 4s/5s
  anywhere — consistent with the curated marquee tier topping out at 3.
- **Ideology is single-point but volatile in prose:** designer repeatedly notes a
  pol "swerves"/"shifts" (Jefferson "all over the place" → RW Pop; Madison
  Mod→Cons; many "shifted Liberal as president"). Statline pins ONE ideology;
  the drift is the ideology-shift mechanic's job (corroborates the 2.1.5
  ideology-shift pass). POST 3,4,5,18,35,37,38,44,48.
- **Southern Unionist** tagged on **Washington, Jackson, Z. Taylor, A. Johnson**
  ("won't secede if the South secedes") — corroborates #121/#122. Tagged as a
  **Misc flag**, separate from Traits. (See Gap D3.)
- **"Doesn't start with Obscure"** is an explicit per-pol flag (Washington POST 1)
  — implies the dataset default is to grant `Obscure`; marquee pols opt out.
- **Designer prunes for game balance, not history:** removed `Controversial` from
  Grant ("not personally controversial — his cabinet was", POST 19). Confirms the
  authoring bar is in-game effect, not biography.
- **Demographics axis exists in the source** (White/Black × Protestant/Catholic ×
  Male) but has **no shipped field** — JFK/Biden = White Catholic, Obama = Black
  Protestant (POST 37,46,48).
- **"Failed nominees / strong candidates / notables" promised** (POST 26) and
  **Historic VPs** maybe (POST 54) — those are the **sub-floor** ERA_FIGURES /
  failed-candidate tier, the companion authoring sources to watch for.

---

## Schema-vs-code mismatches (verified against `src/types.ts`)

### Ideology — OK
Thread abbrevs map cleanly to the shipped 7-point `Ideology` union
(Mod=Moderate, Cons=Conservative, Lib=Liberal, Prog=Progressive, RW Pop=RW
Populist). No out-of-scale values. Note Progressive is never used here (earliest
"Prog" mentions are parentheticals on TR/JQA).

### Expertise — OK
All 10 expertise tags used (Justice, Military, Naval, Business, Economics,
Education, Labor, Media, Foreign Affairs, Science) are valid members of the
shipped 19-tag `Expertise` union.

### Traits — 14 of 50 names DO NOT match the shipped `Trait` union (#216)
This is the highest-signal finding. The thread (2021) predates the shipped
trait-name set; an importer needs a **rename/expand map**.

- **`Charisma` → `Charismatic`** — pure rename; the clean #216 exhibit (used
  on Washington, Jefferson, Jackson, TR, FDR, Reagan, Obama…). POST 1,3,7,28,34,42,46.
- **Not in the union at all (13)** — either renamed or genuinely absent:
  `Bookkeeper, Cop, Disharmonious, Geostrategist, Illicit, Incoherent,
  Jurisprudence, Lackey, Late Bloomer, Low Brow, Military Leader, Pliable, Teflon`.
  - Likely-renamed candidates: `Disharmonious`≈inverse-of-`Harmonious`;
    `Low Brow`≈`Uncharismatic`/`Provincial`?; `Lackey`≈`Loyal`/`Impressionable`?;
    `Pliable`≈`Impressionable`?; `Teflon`≈(no analog — scandal-immunity, NEW).
  - Likely genuinely-NEW (no shipped analog): `Bookkeeper`, `Cop`,
    `Geostrategist`, `Illicit`, `Incoherent`, `Jurisprudence`, `Late Bloomer`,
    `Military Leader`, `Teflon`. **These may be dropped/folded traits from the
    #214/#216 revamp** — flag for the trait-table owner to confirm rename vs
    cut.
- **36 of 50 names DO match** the union (Integrity, Cosmopolitan, Harmonious,
  Delegator, Crisis Manager, Decisive General, Obscure, Debater, Unlikable,
  Hale, Domestic Warrior, Micromanager, Iron Fist, Leadership, Manipulative,
  Controversial, Naive Strategist, Egghead, Kingmaker, Uncharismatic, Likable,
  Passive, Crisis Admin, Numberfudger, Puritan, Provincial, Domestic Apathy,
  Efficient, Predictable, Frail, Orator, Propagandist, Crisis Gov, Celebrity,
  Magician, Overeager) — so the bulk of the vocabulary is stable.

---

## Candidate gaps for consolidation

> For the consolidation agent — proposed gap-log rows / corroborations. Format:
> NEW vs corroborates-#. All sourced to this digest (`hist-pres#POST`).

- **D-PIPELINE (NEW — dataset authoring):** `CURATED_ROWS` in
  `scripts/seedDataset.mjs` is **empty**; these **47 presidential statlines are
  the canonical fill** (marquee in-game figures → CURATED_ROWS overrides, per
  CLAUDE.md merge precedence). Author task for the tech-lead: encode this thread
  + its sibling authoring threads (`playtest-presidents` 5e00ec8e,
  `ampu-historical-data` 853ce63f) as CURATED_ROWS; **do NOT hand-edit**
  `defaultDraftClasses.ts` / `public/standard-draft-classes.json` /
  `politicians-dataset.csv`. `hist-pres#1-48`.

- **D1 — Dynasty/lineage data (corroborates #194):** every statline carries a
  named **Dynasty** with explicit members (spouse/children/nephews + "what-if"
  early-death descendants), but `Politician`/`ImportedDraftee` have **no
  `dynasty` field**. This thread is a **ready-made dynasty seed table** (~37
  named dynasties incl. multi-president Adams/Harrison/Roosevelt/Bush; "n/a" for
  Polk/Buchanan/A.Johnson/Arthur/McKinley/Truman/Ford/Reagan/Trump-era loners).
  Feeds the #194 dynasty/lineage system its initial data. `hist-pres#1-48`.

- **D2 — Trait-name remap (corroborates #216, informs #214):** **14/50 thread
  trait names are NOT in the shipped `Trait` union** (`Charisma`→`Charismatic`
  is the textbook rename; +13 others incl. several with no shipped analog —
  `Teflon`/`Geostrategist`/`Cop`/`Jurisprudence`/`Bookkeeper`/`Illicit`/
  `Incoherent`/`Late Bloomer`/`Military Leader`/`Disharmonious`/`Lackey`/
  `Low Brow`/`Pliable`). Any importer of this source needs a rename/cut map; the
  set of high-Command marquee pols (Lincoln/TR/FDR/Nixon/Cleveland 3-Cmd) is the
  exhibit for #214 PV trait-tier weighting. `hist-pres#1-48`.

- **D3 — "Misc" flags have no schema home (NEW, partially corroborates
  #121/#122):** the `Misc:` line encodes **four orthogonal flags** with no
  fields today: (a) **`Southern Unionist`** (Washington/Jackson/Taylor/
  A.Johnson — corroborates #121/#122, currently trait-only string per
  game-context §524-527); (b) **`Can be Independent`**; (c) **`Can party flip
  N times`** (Trump ×3, JQA/Tyler ×2, Buchanan/Eisenhower ×1, **Reagan starts
  Dem**); (d) **`Can move from <ST> to <ST>`** (Taylor KY→LA, Grant OH→IL,
  Trump NY→FL). Needs a curated-override flag set. `hist-pres#1,7,10,13,19,36,42,47`.

- **D4 — Demographics axis (NEW):** statlines carry Race × Religion × Sex
  (Standard = White/Protestant/Male; JFK/Biden White Catholic; Obama Black
  Protestant) with **no shipped field**. Low priority but a documented data axis.
  `hist-pres#37,46,48`.

- **D5 — Special Interests vocabulary (corroborates interest-acquisition #193):**
  free-string `interests[]` today; this source enumerates the curated interest
  tag set actually used (Expansionist, Reformist, Nationalist, Civil Rights,
  Pacifist, RW Activist, LW Activist, Theocrat). Useful to type-narrow
  `interests`. `hist-pres#3,6,23,27,46`.

## Open questions (for the human)
- For the 13 non-`Charisma` mismatched traits: which are **renames** of a shipped
  trait vs **cut** in the #214/#216 revamp? (`Teflon`, `Geostrategist`, `Cop`,
  `Jurisprudence` have no obvious shipped analog — confirm intent.)
- Is `command` meant to be modeled inside the "6 abilities" UI grouping the
  designer uses, or kept visibly separate as the code does?
- These statlines are **2021-vintage** (pre-#214 PV revamp). Should the importer
  trust the raw skill numbers, or re-derive them under the current PV curve?
