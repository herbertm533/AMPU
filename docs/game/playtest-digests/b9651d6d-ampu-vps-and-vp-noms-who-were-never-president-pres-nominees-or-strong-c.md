# Digest — AMPU VPs & VP Noms who were never President/Pres Nominees/Strong Candidates

- **Slug:** `b9651d6d-ampu-vps-and-vp-noms-who-were-never-president-pres-nominees-or-strong-c`
- **Source CSV:** `b9651d6d-AMPU_VPs_and_VP_Noms_who_were_never_President_Pres_Nominees_or_Strong_Candidates.csv`
- **Topic 802**, author **@vcczar** (one feedback reply from **ConservativeElector2**). 18 posts, 1 chunk, ~11.5k chars.
- **Type:** **CURATED dataset-authoring thread** (marquee stat blocks), **NOT a playtest.** No years/eras simulated; no GM rulings. This is an author-time roster spec.
- **★ STATUS: EXPLICITLY UNFINISHED / PROVISIONAL.** vcczar paused (POST 6) and then abandoned (POST 17, 18) the thread for kickstarter + rules-simplification + event-description work, warning twice "some of the components might change" / "lots and lots of double-checking." Treat every block below as a **draft candidate**, not a final curated entry.
- **Pipeline placement:** these are marquee in-game figures who DID serve in Congress, so by `docs/draft-class-authoring.md` they belong in **`CURATED_ROWS`** (the override tier in `scripts/seedDataset.mjs`), NOT `ERA_ROWS`. **Per project dataset rules, do NOT hand-edit the generated files** (`public/standard-draft-classes.json`, `politicians-dataset.csv`, `defaultDraftClasses.ts`) — any adoption flows through `seedDataset.mjs` + regenerate.

---

## 1. The authoring stat-block FORMAT (the schema vcczar uses)

Each post is a free-text block, consistently ordered:

```
<Full Name>
[<Dynasty> dynasty]                  ← optional, only for dynastic families
<Ideology>                           ← 7-point scale (abbrev sometimes: "LW Pop")
<N> command, <N> <skill>, ...        ← skills as COUNTS, only nonzero ones listed
<Expertise> as initial expertise     ← SINGULAR "initial expertise"
<Trait>, <Trait>, ...                ← traits, sometimes split across two lines
[Can be independent]                 ← optional flag (Colfax only)
Notes: <historical + design rationale, role/office fit, crisis suitability>
```

Conventions the format reveals:
- **Skills are authored as counts of named skills** ("1 command, 2 legislative, 1 governing"), mapping to the shipped 0–5 integer skill model + separate `command`. Most VPs are deliberately **flat/low** (mostly 1s) — these are second-bananas, not stars.
- **"initial expertise" is singular** in the prose, but the shipped model is `expertise: Expertise[]` (an array; see `src/types.ts` and `"expertise":[]` in the JSON). Adoption = wrap as a one-element array.
- **Notes always include a "Best for <office>" role tag** and frequently a **crisis-president verdict** ("would have been a good president in an economic crisis"; "if becomes president, you better be at war"; "would make a great crisis president"). This encodes designer intent for the as-president / crisis-governance layer.
- **Regional-ticket-balancer design heuristic** is explicit and recurring: a VP is valued for *which state he delivers on the ticket* — Clinton "will likely win you NY if he's on the ticket, unless facing another ticket with NY" (POST 14); Nicholas Butler "help win the crucial state of NY" (POST 8); Wm. O. Butler / Barkley → **KY** (POST 9, 3); Colfax → **IN** (POST 15). This is a design ask: **VP-on-ticket should confer a home-state electoral bonus**, gated against same-state opposing tickets.

### Representative full blocks

**Spiro T. Agnew** (POST 2) — Moderate (→ more conservative). `1 command, 1 governing, 1 military`. Initial expertise: **Business**. Traits: **Efficient, Manipulative, Pliable, Controversial, Cop**. Notes: 2nd VP ever to resign / 1st over scandal; "would have been a better president than Ford, executively"; excels in a **judicial crisis** but susceptible to influence; **best as a governor**.

**George Clinton** (POST 14) — **Clinton Dynasty**. Moderate ("really hard to classify—in some ways populist too"). `1 command, 1 legislative, 3 governing, 1 military`. Initial expertise: **Justice**. Traits: **Iron Fist, Leadership, Provincial, Bookkeeper, Domestic Warrior**. Notes: ideal for **governor and faction leader**; better VP than President *because of Provincial*; **delivers NY** if on the ticket (unless opposed by an NY ticket); **great crisis president**; longest-serving NY governor, first Jeffersonian pres candidate, died in office as Madison's VP.

**Dick Cheney** (POST 10) — **Cheney dynasty**. Conservative. `1 command, 1 legis, 1 admin`. Initial expertise: **Economics**. Traits: **Expansionist, Kingmaker, Manipulative, Uncharismatic, Unlikable, Geostrategist, Illicit, Domestic Apathy**. Notes: best as **legislator**; "if becomes president, you better be at war"; **would fail in a domestic crisis**; not electable; "actually best as a backroom politician but Wyoming isn't a very helpful place" (i.e. weak home state for the backroom role).

### The rest (compact)

| Post | Name | Ideology | Headline skills | Expertise | Key traits | Dynasty / flags | Role note |
|---|---|---|---|---|---|---|---|
| 3 | Alben W. Barkley | Liberal | 2 legis (+1 cmd, 1 gov) | Justice | Kingmaker, **Likable**, Bookkeeper | — | Best legislature; good econ-crisis pres; delivers KY |
| 4/11/13 | Lloyd Bentsen | Moderate | 2 legis (+cmd,jud,mil,admin all 1) | Military | Debater, Bookkeeper, **Likable**¹ | — | Wide range (5 of 6 skills); best legislature; not electable |
| 5 | Francis P. Blair Jr | Moderate | 1 each cmd/legis/mil/admin | Justice | Frail, Pliable, Propagandist, **Illicit, Southern Unionist** | **Blair Dynasty** | Great range; mid Pres/VP; 1868 Seymour VP nom |
| 7 | Charles W. Bryan | LW Populist | 1 each cmd/legis/gov | Business | **Reformist, Propagandist, Uncharismatic, Provincial, Passive** | **Bryan dynasty** | Best governor; VP to shore up an ideology; Provincial = regional support |
| 8 | Nicholas M. Butler | Conservative | 1 cmd, 1 admin | Education | **Nationalist, Disharmonious, Egghead, Naive Strategiest², Delegator** | — | VP = best spot (delivers NY); weak president; "don't let the pres die" |
| 9 | William O. Butler | Moderate | 1 each cmd/legis/mil | Military | Integrity, **Hale** | — | Best military; no flaws, no star quality; delivers KY |
| 15 | Schuyler Colfax | Liberal | 2 legis (+1 cmd) | Media | **Civil Rights**, Manipulative, Propagandist, Controversial, Micromanager | **Colfax Dynasty**; **Can be independent** | Best legislature (Speaker); delivers IN; scandal-prone president |
| 16 | Charles Curtis | Moderate | 2 legis (+1 cmd) | Business | **Civil Rights**, Egghead, Integrity, **Likable**, Pliable, Uncharismatic, **Lackey**, Harmonious, Passive | — | Senate leader; "perfect VP for Hoover" but a puppet as pres |

¹ Bentsen **gained `Likable` via in-thread feedback** (ConservativeElector2 POST 11 → vcczar "Added likable to Bentsen" POST 13).
² Spelled "Naive Strategiest" in source = the **Naive Strategist** trait (typo).

### Dynasties named (5)
**Blair** (Francis P. Blair Jr), **Bryan** (Charles W., brother of WJB), **Cheney** (Dick), **Clinton** (George; note mentions nephew DeWitt Clinton), **Colfax** (Schuyler). Treated as a first-class field in the schema — implies a **family/dynasty grouping** for politicians.

### "Can be independent" flag
Appears only on **Colfax** (POST 15) as a standalone line, distinct from traits — i.e. a marker that this figure can run/sit outside the two-party system.

---

## 2. Trait vocabulary observed vs. shipped `Trait` union (`src/types.ts`)

Checked every cited trait against the shipped union and `ALL_TRAITS`/expertise model.

**Cited traits that EXIST in the shipped union (adopt as-is):**
Efficient, Manipulative, Controversial, Kingmaker, Likable, Debater, Frail, Propagandist, Reformist, Uncharismatic, Provincial, Passive, Nationalist, Egghead, Naive Strategist (fix typo), Delegator, Integrity, Hale, **Iron Fist**, **Domestic Warrior**, Micromanager, Leadership, Harmonious.

**Cited traits / flags that do NOT exist in the shipped `Trait` union — reconcile before adoption:**

| Cited token | Posts | Shipped status | Likely resolution |
|---|---|---|---|
| **Cop** | 2 (Agnew) | **Not in union.** Prior batch **b44 logged a `cop`→`lawful` rename**; `lawful` is also **not** in the current shipped union. | Define a `Lawful`/law-and-order trait, or map to existing (e.g. nothing close ships today). Open. |
| **Pliable** | 2, 5, 16 | Not in union. | Semantically ≈ shipped **`Impressionable`** (influence-susceptible). Candidate alias. |
| **Bookkeeper** | 3, 4, 14 | Not in union. | "ability with numbers" → ≈ **`Numberfudger`**? or a new fiscal-competence trait. Note shipped has `Crisis Admin` (fiscal). Open. |
| **Illicit** | 5, 10 | Not in union. | ≈ shipped **`Corrupt`**/**`Scandalous`**. Candidate alias. |
| **Southern Unionist** | 5 | Not in union. | Era/flavor faction tag, not a mechanical trait. Drop or model as alignment. |
| **Disharmonious** | 8 | Not in union. | Inverse of `Harmonious`; closest shipped negative is **`Puritan`** (the Harmonious conflict-pair). Candidate alias. |
| **Expansionist** | 10 | Not in union. | ≈ shipped **`Nationalist`**/**`Globalist`**? expansion = foreign-policy lean. Note shipped expertise has `Foreign Affairs`. Open. |
| **Geostrategist** | 10 | Not in union. | Foreign-policy competence; no shipped equivalent (closest: `Crisis Gov`?). Open. |
| **Civil Rights** | 15, 16 | Not in union. | Policy-domain tag; closest model is **expertise**, not trait. Reconcile axis. |
| **Lackey** | 16 | Not in union. | ≈ subservient; overlaps `Loyal`/`Impressionable`/`Passive`. Candidate alias. |
| **Can be independent** | 15 | **Not in `Trait` union** (confirmed; prior **b48** also found it absent). The `independent` substring in types.ts is unrelated code. | Needs a real model (party-independence flag), not currently shipped. Open. |

**Cited expertise — ALL exist in the shipped `Expertise` union:** Business, Justice, Military, Education, Economics, Media. (No reconciliation needed; only the singular-vs-array wrapping differs.)

---

## 3. ★ Shipped reality vs. this thread (the headline delta)

**These figures already ship — but as auto-generated congress-legislators rows, NOT with vcczar's hand-authored design.** Verified against `public/standard-draft-classes.json`:

| Figure | Shipped JSON today (auto-derived) | This thread's authored intent | Delta |
|---|---|---|---|
| Spiro Agnew | ideo **Conservative**; admin 4/legis 2/gov 3; traits `[Leadership]`; exp `[]` | **Moderate**; cmd1/gov1/mil1; exp **Business**; Efficient/Manipulative/Pliable/Controversial/**Cop** | Ideology, skills, expertise, traits **all differ**; dynasty n/a |
| George Clinton | **ABSENT** from JSON (founder who *was* a senator but block not present under that name) | full block, **Clinton Dynasty**, gov 3, Iron Fist/Leadership/Provincial/Domestic Warrior | Marquee founder block **missing**; needs CURATED add |
| Charles W. Bryan | **ABSENT** | LW Pop, Bryan dynasty, Reformist/Propagandist/… | Missing; needs add |
| William O. Butler | **ABSENT** (no `William O Butler`; only other Butlers) | Moderate, mil, Integrity/Hale, delivers KY | Missing; needs add |
| Francis P. Blair Jr | **ABSENT** under that exact name | Blair Dynasty block | Missing; needs add |
| Alben Barkley | Liberal; legis 5/backroom 4; traits `[]`; exp `[]` | Liberal; legis 2; exp **Justice**; **Kingmaker/Likable/Bookkeeper** | Skills differ (5 vs 2), **no traits/expertise/dynasty applied** |
| Lloyd Bentsen | Liberal; legis 5/backroom 3; traits `[]` | Moderate; multi-skill range; Debater/Bookkeeper/Likable; exp Military | Ideology + skills + traits differ |
| Nicholas M. Butler | **ABSENT** (Columbia pres, never in Congress → should be **ERA_ROWS** not CURATED) | Conservative; Education; Nationalist/Egghead/… | Missing; **wrong tier** — never-served ⇒ `ERA_ROWS` candidate |
| Schuyler Colfax | Liberal; legis 3/backroom 3; traits `[Charismatic]`; exp `[]` | Liberal; legis 2; **Media**; Civil Rights/Manipulative/…/**Can be independent** | Traits differ (Charismatic vs thread set), no expertise/dynasty |
| Charles Curtis | Conservative; legis 5/backroom 3; traits `[]` | Moderate; legis 2; **Business**; long trait list incl Civil Rights | Ideology + skills + traits differ |
| Dick Cheney (Richard Cheney) | Conservative; legis 3; traits `[]`; exp `[]` | Conservative; cmd/legis/admin 1; **Economics**; Expansionist/Kingmaker/…/Domestic Apathy | Skills + traits + expertise + dynasty all unapplied |

**Pattern:** the shipped curated/override layer has **not** ingested this thread at all. Served figures carry generic real-data stats (no traits, no expertise, no dynasty, often inflated legislative/backroom 5/4 that contradict vcczar's deliberately-flat "second banana" design). Never-served figures (Nicholas Butler, George Clinton if treated as non-congressional, Wm. O. Butler, C.W. Bryan, F.P. Blair Jr) are simply **absent**.

---

## 4. Feedback / discussion captured
- **POST 11–13:** ConservativeElector2 flags Bentsen lacking `Likable` (citing vcczar's own "Dems picked likable Bentsen over charismatic Jesse Jackson '88"); vcczar **adds Likable**. (Shows the warmth-axis Likable/Charismatic distinction the shipped PR4b model later formalized.)
- **POST 11–12:** side debate on whether Barkley would have beaten Eisenhower in '52 (CE2: no — Stevenson had urban appeal; "need another WWII hero like Marshall"). Flavor only; no mechanic.

## 5. Open questions (for the human)
1. **Adopt this thread into `CURATED_ROWS`?** It is provisional/abandoned (POST 18) — vcczar may have revised these post-kickstarter. Confirm before encoding.
2. **Trait reconciliation:** decide each non-shipped token (Cop/Lawful, Pliable, Bookkeeper, Illicit, Disharmonious, Expansionist, Geostrategist, Lackey) — alias to an existing trait or add new? `Civil Rights` and `Can be independent` likely need *new axes* (policy-domain / party-independence), not the trait union.
3. **"Can be independent":** model a third-party / independent-run flag? Not shipped (confirmed b48).
4. **Dynasty field:** is a `dynasty` grouping planned for `Politician`? Five families named here; not in shipped `types.ts`.
5. **Tier for Nicholas Murray Butler** (never served in Congress) → `ERA_ROWS`, not `CURATED_ROWS`.
6. **Skill philosophy clash:** vcczar wants VPs deliberately flat (mostly 1s); auto-data gives several legis/backroom 5/4. Curated override would have to *lower* shipped stats — confirm that's intended.

---

## 6. Deltas vs current build (handoff)

- **Headline:** a **provisional, explicitly-unfinished CURATED marquee-VP stat-block set** (11 figures: Agnew, Barkley, Bentsen, F.P. Blair Jr, C.W. Bryan, N.M. Butler, W.O. Butler, Cheney, G. Clinton, Colfax, C. Curtis) + the **author-time conventions** it reveals (block schema; "best-for-office" role tags; crisis-president verdicts; **VP-as-regional-ticket-balancer home-state bonus**; dynasties; "Can be independent" flag).
- **Not ingested:** the shipped curated/override layer reflects **none** of this — served figures carry generic real-data stats (no traits/expertise/dynasty, often inflated skills that contradict the "flat second-banana" intent); never-served figures (N.M. Butler, W.O. Butler, C.W. Bryan, F.P. Blair Jr, and George Clinton under that name) are **absent**.
- **Trait-union gaps to reconcile:** `Cop`/`Lawful` (b44 rename, still not shipped), `Pliable`(≈Impressionable), `Bookkeeper`, `Illicit`(≈Corrupt/Scandalous), `Disharmonious`(≈Puritan), `Expansionist`, `Geostrategist`, `Lackey` — none in the shipped `Trait` union.
- **New-axis asks:** `Civil Rights` (policy-domain, not a trait), **`Can be independent`** (party-independence flag — confirmed absent, also flagged b48), and a **`dynasty`** field on `Politician` (5 families named).
- **Expertise:** singular "initial expertise" in prose vs shipped `expertise: Expertise[]`; all 6 cited tags (Business, Justice, Military, Education, Economics, Media) already in the `Expertise` union — only array-wrapping needed.
- **Design feature implied:** VP-on-ticket should grant a **home-state electoral bonus**, gated against an opposing same-state ticket (NY/KY/IN examples) — not evidenced in current `calcStateVote`.
- **Provenance caution:** abandoned thread (POST 6/17/18, "components might change") — adopt only with human confirmation; do **not** hand-edit generated dataset files (route via `scripts/seedDataset.mjs`).

---
`wc -l` of this digest: see below.
