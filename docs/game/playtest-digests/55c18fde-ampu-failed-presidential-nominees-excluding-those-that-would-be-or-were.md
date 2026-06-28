# Digest — AMPU Failed Presidential Nominees (`55c18fde`)

**Type:** DATASET-AUTHORING source, NOT a playthrough. **Batch 36.** 46 posts / 1 chunk
(chunk-001, Oct 8–13 2021, politicslounge thread #764). Source CSV:
`55c18fde-AMPU_Failed_Presidential_Nominees_excluding_those_that_would_be_or_were_president.csv`.

vcczar posts AMPU statlines for **~36 failed major-party presidential nominees** (Pinckney → Hillary
Clinton) — the **same curated-pol record schema** as `histpres` (#240, 47 presidents) and
`strongnevernom` (#246, ~18 never-nominated). These are **CURATED_ROWS-class marquee figures**, statted
at **full strength** (not sub-floor; same class/tension as `strongnevernom` N1). The closing post 42
declares "this concludes the failed major party nominees." Sibling roster to `histpres`/`strongnevernom`
→ all feed the `seedDataset.mjs` `CURATED_ROWS`/`ROWS` source array (do NOT hand-edit generated files).
**No net-new gaps** — pure corroboration of #240 / #194 / #216 / #239 + the #214/#215/#220 PV revamp.

Schema per row: **Name / Dynasty / Ideology / Abilities (0–5 ×6) / Initial expertise / Interests / Traits
/ Misc flags / Notes.** (Notes are designer rationale — included only where load-bearing.)

## Statlines (post = `===== POST n =====` marker)

| # | Name | Dynasty | Ideology | Abilities | Init. expertise | Interests | Notable traits | Misc flags |
|---|------|---------|----------|-----------|-----------------|-----------|----------------|------------|
| 1 | CC Pinckney | Pinckney | Conservative | 2 Cmd, 2 Mil, 2 Adm, 1 Leg | Military | Nationalist | Likable, Pliable, **Uncharismatic**, Geostrategist, Passive, Predictable | two-time nominee; "likely a puppet" |
| 5 | DeWitt Clinton | Clinton (uncle George Clinton) | Liberal | 1 Cmd, 1 Leg, 3 Gov | Trade | Reformist | Efficient, Frail, Kingmaker, Pliable, Cosmopolitan, Bookkeeper, Domestic Warrior, Overeager | "good/great what-if" |
| 6 | Rufus King | King (siblings/descendants) | Liberal | 1 each Cmd/Leg/Gov/Justice/Mil/Adm | Justice | Civil Rights | Provincial, Cop | ability in every skill; regional |
| 7 | **Henry Clay** | Clay (sons) | Moderate | 2 Cmd, **4 Leg**, 1 Adm | Justice | Expansionist, Nationalist, Reformist | Debater, Efficient, Iron Fist, Leadership, Manipulative, Orator, Propagandist, Cosmopolitan, Bookkeeper, Domestic Warrior, Overeager | **Can Party Flip once**; "with TR, most powerful in game" (PV 98) |
| 8 | Lewis Cass | — | Conservative | 1 Cmd, 1 Leg, 2 Gov, 2 Mil, 2 Adm | Military | Expansionist | Efficient, Propagandist, Hale, Geostrategist | **can move OH→MI** |
| 9 | Winfield Scott | — | Moderate | 1 Cmd, 4 Mil | Military | Nationalist | Efficient, Leadership, Unlikable, Cosmopolitan, Numberfudger, Geostrategist, Micromanager, Decisive General | **Southern Unionist**; **can move VA→NJ/NY** |
| 10 | John C Frémont | Frémont (wife = Benton's dau.) | Progressive | 1 each Cmd/Leg/Gov/Mil | Military | Civil Rights, LW Activist, Reformist | Celebrity, Charisma, Disharmonious, Controversial, Teflon, Cosmopolitan, Numberfudger, Naive Strategist, Domestic Warrior, Delegator, Illicit | **Can party flip once; Can be Independent** |
| 12 | Stephen A Douglas | — | Moderate | 1 Cmd, 2 Leg, 1 Jud | Judicial | Expansionist | Debater, Efficient, Frail, Kingmaker, Manipulative, Orator, Propagandist, Unlikable, Cosmopolitan, Magician, Domestic Warrior, Cop | — |
| 13 | John C Breckinridge | Breckinridge (large) | Traditionalist | 1 each Cmd/Leg/Mil/Adm | Judicial | — | Frail, Cosmopolitan, Geostrategist | youngest VP (~36) |
| 15 | George B McClellan | McClellan (son) | Conservative | 1 Cmd, 1 Gov, 2 Mil | Military | — | Charisma, Disharmonious, Efficient, Frail, Pliable, Cosmopolitan, Numberfudger, Micromanager, Overeager | "electable vs mediocre opp" |
| 18 | Horatio Seymour | Seymour (bro/son) | Conservative | 1 each Cmd/Leg/Gov | Business | — | Integrity, Pliable | 1868 "sacrificial lamb" vs Grant |
| 19 | Horace Greeley | Greeley (wife) | Progressive | 1 Cmd, 1 Leg | Media | Civil Rights, Expansionist, Pacifist, Reformist | Egghead, Pliable, Propagandist, **Uncharismatic**, Native Strategist*, Micromanager | **Can be Independent; Can Party Flip once**; "weakest nominee in US history" |
| 20 | Samuel J Tilden | — | Conservative (bouts Traditionalist) | 1 each Cmd/Leg/Gov | Business | Reformist, RW Activist | Integrity, Kingmaker, Leadership, Puritan, Bookkeeper, Micromanager, Predictable, Cop, Late Bloomer, Domestic Apathy | — |
| 21 | Winfield S Hancock | — | Moderate | 1 Cmd, 2 Mil | Military | — | Integrity, Pliable, Cosmopolitan, Numberfudger, Harmonious, Low Brow, Delegator, Passive, Domestic Apathy | "electable but terrible pres" |
| 22 | William J Bryan | Bryan (father/wife/bro/2 kids) | Progressive | 1 Cmd, 1 Leg, 1 Adm | Justice | LW Activist, Reformist, Theocrat | Charisma, Debater, Kingmaker, Leadership, Orator, Puritan, Numberfudger, Naive Strategist, Domestic Warrior, Low Brow, Micromanager | — |
| 23 | Alton B Parker | — | Conservative | 1 Cmd, 1 Jud | Justice | Reformist | Egghead, Integrity, **Uncharismatic**, Harmonious, Passive, Predictable, Cop, Domestic Apathy, Late Bloomer | "one-shot pol / SC justice" |
| 24 | Charles E Hughes | Hughes (son) | Moderate | 1 Cmd, 1 Gov, 3 Jud, 1 Adm | Justice | Reformist | Debater, Efficient, Egghead, Integrity, Pliable, **Uncharismatic**, Hale, Bookkeeper, Geostrategist, Harmonious, Cop | — |
| 25 | James M Cox | Cox (daughter) | Liberal | 1 Cmd, 1 Leg, 2 Gov | Media | Nationalist, LW Activist, Reformist | Likeable, **Uncharismatic**, Hale | — |
| 26 | John W Davis | Davis (father) | Conservative | 1 Cmd, 1 Leg, 1 Adm | Foreign Affairs | Expansionist | Egghead, Integrity, **Uncharismatic**, Cosmopolitan, Geostrategist, Passive, Domestic Apathy | "last conservative Dem nominee (1924)" |
| 27 | Al Smith | — | Liberal (→Mod/Cons under FDR) | 1 Cmd, 1 Leg, 2 Gov | Justice | — | Disharmonious, Likable, Pliable, Naive Strategist, Delegator | **Catholic** (demographics flag) |
| 28 | Alf Landon | Landon (daughter) | Moderate | 1 Cmd, 1 Gov, 1 Adm | Business | — | Egghead, Integrity, **Uncharismatic**, Hale, Harmonious, Crisis Gov | — |
| 29 | Wendell Willkie | — | Moderate | 2 Cmd | Business | Civil Rights | Frail, Likable, Cosmopolitan | **Can be Independent; Can Party Flip** |
| 30 | Thomas E Dewey | — | Moderate | 2 Cmd, 2 Gov | Justice | — | Debater, Efficient, Kingmaker, Leadership, Pliable, **Uncharismatic**, Cosmopolitan, Cop | — |
| 31 | Adlai Stevenson II | Stevenson (father/gf/son) | Moderate | 2 Cmd, 1 Leg, 1 Gov, 2 Adm | Naval | — | Debater, Efficient, Egghead, Orator, **Uncharismatic**, Cosmopolitan, Bookkeeper, Geostrategist, Harmonious, Delegator | — |
| 32 | Barry Goldwater | Goldwater (son/uncle/rel.) | Traditionalist | 1 Cmd, 2 Leg, 2 Mil | Military | Expansionist, Reformist, RW Activist | Integrity, Leadership, Hale, Naive Strategist, Predictable, Domestic Apathy, Unlikable | ideology gets MORE electable post-1972; Hale → "run at 91" |
| 33 | Hubert Humphrey | Humphrey (son/gson) | Liberal | 1 Cmd, 2 Leg, 1 Gov | Healthcare | Civil Rights, LW Activist, Reformist | Egghead, Pliable, Domestic Warrior, Cop | — |
| 34 | George McGovern | — | Liberal | 1 each Cmd/Leg/Mil/Adm | Military | Reformist | Integrity, Pliable, **Uncharismatic**, Hale, Numberfudger, Naive Strategist, Domestic Warrior | "liberal Goldwater" |
| 35 | Walter Mondale | Mondale (son) | Liberal | 1 Cmd, 1 Leg, 1 Adm | Military | — | Integrity, **Uncharismatic**, Hale | post 45/46: Likable debated but kept Unchar. |
| 36 | Michael Dukakis | — | Moderate | 1 Cmd, 1 Leg, 2 Gov | Military | — | **Uncharismatic**, Hale, Bookkeeper, Predictable | — |
| 37 | Bob Dole | Dole (wife) | *(none listed)* | 1 Cmd, 2 Leg, 1 Mil | Military | — | **Uncharismatic**, Hale | ideology field absent in post |
| 38 | Al Gore | Gore (father) | Moderate | 1 Cmd, 2 Leg, 1 Adm | Science | — | Egghead, Pliable, **Uncharismatic** | — |
| 39 | John Kerry | — | Liberal | 1 Cmd, 2 Leg, 1 Gov, 1 Mil, 1 Adm | Naval | — | **Uncharismatic** | — |
| 40 | John McCain | McCain (father/gf/dau.) | Moderate | 2 Cmd, 2 Leg, 1 Mil | Naval | Expansionist | Integrity, Geostrategist, Late Bloomer | "good pick in military crisis" |
| 41 | Mitt Romney | Romney (father/mom/niece) | Moderate | 1 Cmd, 1 Leg, 1 Gov, 1 Adm | Business | — | Pliable, Cosmopolitan | "safe pick" |
| 42 | Hillary Clinton | Clinton (husband Bill) | Moderate (Liberal as nominee) | 2 Cmd, 1 Gov, 1 Leg, 1 Adm | Justice | Civil Rights | Egghead, Kingmaker, Unlikable, **Uncharismatic**, Cosmopolitan, Cop, Late Bloomer, Delegator | Gov=1 = Bill's "Hillary-as-AR-gov" plot; Controversial debated→declined (post 44) |

\* post 19 spells it "Native Strategist" — shipped union has **Naive Strategist** (typo to normalize on import).
Posts 2–4, 16–17, 43, 45–46 are forum chatter / dupes; post 11 = vcczar threatens to stop, post 12 = thread revived.

## ★ PV-revamp corroboration (post 14)

Direct confirmation of the #214/#215/#220 PV revamp, in vcczar's own words:
- **"recalculated the political values in the master spreadsheet to create a 0-100 scale (although someone can
  go beyond 100 and below 0)."** → corroborates **#220** display-scale (0–100, can exceed) and `groupthinkpv`
  POST 39/43 (50 = average).
- **"Clay is a historical 98, while Theodore Roosevelt is a historical 100."** → top-end PV anchors; matches
  the in-thread "Clay + TR most powerful in game" (post 7).
- **"I made Command worth more points"** → corroborates **#215** Command re-weight (`groupthinkpv` Command×15
  vs Legis/Gov/Adm×10 vs Mil/Jud×5).
- **"created a bunch of new traits, of which Roosevelt has a few and Clay has like one. The new traits also
  raised Reagan significantly."** → corroborates **#214** (per-trait PV tiers) + #216 trait expansion.

## ★ Charisma → electability balance signal (posts 45–46)

vcczar: **"every failed nominee from McGovern to Kerry has uncharismatic as a trait"** — confirmed in the
table (McGovern, Mondale, Dukakis, Dole, Gore, Kerry — and Humphrey via post 33 has Pliable not Unchar.,
but the 1972→2004 nominee run is otherwise uniformly Uncharismatic). ConservativeElector2: *"their blandness
was a huge reason they didn't win."* → the **charisma/warmth axis as the primary electability lever** for
the modern era; designer treats Uncharismatic as the canonical "lost-because-bland" tag. Open micro-call:
Mondale Likable-vs-Uncharismatic (left unresolved, post 46).

## Notes / observations

- **#194 dynasties:** 25 of 36 rows carry a named dynasty; several are **marriage-based** membership
  (Greeley wife post 19, Frémont wife=Benton's daughter post 10, Hillary↔Bill post 42, Cox daughter, Dole
  wife) — same lineage model as `strongnevernom` (11 dynasties, marriage links). Turnkey seed rows.
- **#239 Misc-flags / curated-override** observed: **Can Party Flip / Can Party Flip once** (Clay, Frémont,
  Greeley, Willkie), **Can be Independent** (Frémont, Greeley, Willkie), **Southern Unionist** (Scott),
  **can-move-state** (Cass OH→MI, Scott VA→NJ/NY), **Catholic** demographics (Al Smith). Frémont carries the
  full Party-Flip + Independent + Illicit combo. Same flag vocabulary as #240/#239 with no shipped home.
- **#216 trait-name reconciliation:** thread uses **`Charisma`** (Frémont, McClellan, Bryan) — shipped union
  is **`Charismatic`**. **`Hale`** appears widely (Cass, Hughes, Cox, Landon, Goldwater, McGovern, Mondale,
  Dukakis, Dole) but **is NOT in the shipped `Trait` union** (`types.ts:530` — modeled as a longevity-mitigation
  slot, ties #226 age-cutoff). Thread traits needing consolidator union-check: **Geostrategist, Bookkeeper,
  Late Bloomer, Low Brow, Teflon, Cop, Pliable, Egghead, Delegator, Celebrity, Disharmonious, Illicit,
  Pacifist, Theocrat-interest.** Confirmed already in union: Crisis Gov, Decisive General, Domestic Warrior,
  Domestic Apathy, Naive Strategist, Kingmaker, Numberfudger, Iron Fist, Magician, Cosmopolitan, Provincial,
  Predictable, Likable, Unlikable, Uncharismatic, Integrity, Debater, Propagandist, Harmonious, Puritan,
  Efficient, Passive, Overeager, Micromanager, Frail, Leadership, Orator, Manipulative, Controversial.
- **#246 / N1 tie:** failed nominees are full-strength marquee (Clay = PV 98), **not** sub-floor — the
  sub-floor rule is wired only to `ERA_ROWS`/`ERA_FIGURES`. Same open question as `strongnevernom`: a
  full-strength "always-lost" pol's failure must come from **PV/electability** (Uncharismatic, low Command,
  regional/Provincial, weak ideology-fit), not stat suppression. Many notes explicitly frame these as
  "electable vs a weak opponent but bad president" or "keep in Congress/military" — the **designed
  office-fit vs. electability split**.
- Ideology field **absent for Bob Dole** (post 37) — import should default/flag.

## Candidate gaps for consolidation (→ existing rows; NO net-new)

1. **#240 (CURATED_ROWS / `ROWS` roster):** add this ~36-name failed-nominee block as a third
   marquee roster alongside `histpres` (47 presidents) and `strongnevernom` (~18 never-nominated). Same
   record schema. Full-strength, not sub-floor.
2. **#214 / #215 / #220 (PV revamp):** post 14 is a **direct designer corroboration** — 0–100 scale
   (can exceed 0/100), Command worth more, new traits (Clay 98 / TR 100, Reagan raised). Reinforces
   `groupthinkpv`/`revampPV`.
3. **#194 (dynasties):** 25 named dynasties incl. marriage-based membership (Greeley/Frémont/Hillary/
   Cox/Dole) — turnkey seed rows.
4. **#216 / #239 (trait-name remap + Misc-flags/demographics override schema):** Charisma→Charismatic;
   Hale not in union (ties #226); Party-Flip / Independent / Southern Unionist / can-move-state /
   Catholic flags — same override vocabulary with no shipped home.
5. **#246 / N1 (full-strength always-loses tension):** failed nominees mirror the never-nominated class —
   failure modeled by PV/electability (Uncharismatic = the modern lever), not stat suppression.
6. **Charisma→electability design signal:** McGovern→Kerry all Uncharismatic; "blandness = lost"
   (posts 45–46) — supports the warmth-axis electability weighting in the modern era.

## Open questions

- Can a full-strength failed-nominee (or never-nominee) actually win the presidency in-sim, or do PV/
  electability penalties make them reliable also-rans by design? (shared with `strongnevernom` N1)
- Mondale: Likable vs Uncharismatic — left unresolved by vcczar (post 46).
- Hillary Clinton: Controversial considered then declined (post 44) — re-evaluate if evidence added.
