# Digest — 326eee56 "AMPU Strong Never-Nominated Candidates"

**Type:** DATASET-AUTHORING source (not a playthrough). vcczar (tier-1 / game
designer) posts the authoritative AMPU statline for **strong candidates who were
never their party's nominee** (frontrunners, near-misses, perennial #2s), one per
post, **reverse-chronological** (Sanders 2021 → Leonard Wood 1920), 2021-10-12 →
2021-10-23. **Sibling of `histpres` (#240) / `presidents` / `ampuData`** — same
curated-pol record SCHEMA, different roster (the "failed-nominees" list `histpres`
POST 25-26 promised "maybe"; this is that list, delivered separately).
**Scope:** 1 chunk / 46 posts. **16 figures statted.** Remaining posts are
chatter / trait-definition Q&A. **Pipeline relevance:** these are
**CURATED_ROWS-style overrides** for `scripts/seedDataset.mjs` — but they sit in
**tension with the sub-floor balance rule** (see Gap N1, the headline finding).
**Provenance:** cite the `===== POST n =====` markers in chunk-001.

---

## Schema (identical to #240 / histpres)

Same fixed-shape curated record: **Name / Dynasty / Ideology (7-pt) / 6 abilities
(Command + 5 Skills 0-5) / Initial Expertise / Special Interests (0-n) / Traits /
Misc flags / Demographics / Notes(rationale)**. No new schema fields vs. #240.
Maps to shipped types exactly as documented in the histpres digest (Dynasty, Misc,
Demographics still have **no shipped field** — #194 / #239 / #238).

---

## Statted figures (compact)

Format: **Cmd/Leg/Jud/Mil/Gov/Adm** (6 abilities, 0 where unstated). "Expertise"
= initial expertise tag; "Interests" = special-interest tags; dynasty noted.

| POST | Figure | Era | Ideo | Cmd/Leg/Jud/Mil/Gov/Adm | Expertise | Interests | Dynasty | Demo/Misc |
|---|---|---|---|---|---|---|---|---|
| 1 | Bernie Sanders | 2016/20 | LW Populist | 2/1/0/0/1/0 | Labor | Pacifist, LW Activist, Reformist | **Sanders** (wife/son/dau) | — |
| 10 | Thomas F. Bayard | 1880s | (Cons impl.) | 1/1/0/0/0/1 | Justice | — | **Bayard** (large) | — |
| 14 | Aaron Burr | 1800 | Liberal | 1/2/0/2/1/1 | Military | — | none (dau via marriage) | — |
| 17 | John C. Calhoun | antebellum | Traditionalist | 1/3/0/0/0/2 | Agriculture* | RW Activist | **Calhoun** | — |
| 18 | Champ Clark | 1912 | Liberal | 1/2/0/0/0/0 | Justice | Pacifist, Reformist | **Clark** (son) | — |
| 20 | George Clinton | founding | Moderate | 1/1/0/1/3/0 | Justice | — | **Clinton** (many) | — |
| 23 | William H. Crawford | 1824 | Conservative | 1/2/1/0/0/3 | Justice | Expansionist | **Crawford** | (was a nominee†) |
| 24 | Gary Hart | 1984/88 | Moderate | 1/2/0/1/0/1 | Justice | — | none | — |
| 25 | Jesse Jackson | 1984/88 | Progressive | 2/1/0/0/0/0 | Media | Civil Rights, LW Activist, Reformist | **Jackson** (son) | **African-American** |
| 26 | Estes Kefauver | 1952/56 | Liberal | 1/2/0/0/0/0 | Justice | Reformist | none | — |
| 27 | Robert F. Kennedy | 1968 | Liberal | 1/1/0/0/0/2‡ | Justice | Civil Rights, Reformist | **Kennedy** | **Catholic** |
| 28 | Ted Kennedy | 1980 | Liberal | 1/3/0/0/0/0 | Justice | LW Activist | **Kennedy** | — |
| 30 | William G. McAdoo | 1920/24 | Moderate | 1/1/0/0/0/1 | Transportation* | Reformist, Theocrat | none (Wilson son-in-law) | — |
| 31 | Eugene McCarthy | 1968 | Progressive | 1/1/0/0/0/0 | Labor | Civil Rights, Pacifist, LW Activist, Reformist | none | **Catholic; Can be Independent** |
| 32 | Nelson Rockefeller | 1960s | Liberal | 2/0/0/0/3/1 | Business | Civil Rights | **Rockefeller** | — |
| 37 | William H. Seward | 1860 | Liberal | 1/2/0/0/2/2 | Foreign Affairs | Civil Rights | **Seward** | — |
| 40 | Robert Taft | 1940s/52 | Conservative | 1/3/0/0/0/0 | Business | Pacifist, Civil Rights | **Taft** (father=Pres Taft) | — |
| 42 | Leonard Wood | 1920 | Moderate | 1/0/0/2/1/0 | Military | Expansionist | none | — |

*`Agriculture` and `Transportation` are NOT in the shipped 10-expertise union
(seedDataset `EXPERTISE_NAMES` has Agriculture; Transportation is novel — see Gap N3).
†Crawford was the 3rd-strongest in the 1824 4-man race, so technically a nominee
(POST 23) — included anyway as a "frontrunner who lost."
‡RFK stated as "2 cabinet" — read as Administrative (the 6th ability).

(18 rows; "16 figures statted" in the header counts the unambiguous never-nominee
core; Crawford is a borderline-nominee and Burr was eventually a near-winner.)

---

## Trait-name notes (corroborates #216)

Same trait vocabulary as #240. Names appearing here that **mismatch / are absent
from the shipped Trait union** (per #216's 14/50-mismatch finding) include:
**Domestic Warrior, Domestic Apathy, Crisis Admin, Geostrategist, Numberfudger,
Late Bloomer, Predictable, Pliable, Low Brow, Iron Fist, Cop, Teflon,
Overeager, Provincial, Hale / Frail.** No new resolution here — same remap work.

- **Trait definitions clarified by vcczar (rules, durable):**
  - **Hale** (POST 34) = auto-assigned to any politician who lived past age 80;
    a longevity trait that helps them **avoid early death**. **Frail** (POST 35,
    Ted-confirmed implicitly) = the opposite, for those with serious health
    problems / early natural deaths (e.g. LBJ). → death-timing modifier, ties
    #114 / DH-36 (mortality).
  - **Predictable** (POST 12, vcczar) = the politician is so consistent in
    behavior/demands/rhetoric that the **opposition can strategize against them
    and stonewall** — concretely hurts passing legislation when Congress is
    opposed. Cited for Sanders, Bayard, Kefauver, Taft. (A trait-EFFECT data
    point for #220 / the PV-effects epic.)

## Dynasty notes (corroborates / extends #194)

Heavy dynasty content — a turnkey seed table for #194, same as #240. Named
dynasties: **Sanders, Bayard, Calhoun, Clark, Clinton, Crawford, Jackson (Jesse),
Kennedy (RFK+Ted), Rockefeller, Seward, Taft** (Taft links to **President Taft**
already in the #240 set → cross-roster dynasty link). Notable edge case: **Burr**
has "no dynasty, but his daughter joins another dynasty via marriage" (POST 14) —
implies dynasty membership can be acquired by **marriage**, not just birth (a
modeling nuance for #194). McAdoo = Wilson's son-in-law (marriage link, no
dynasty of his own).

---

## Built vs. designed — relevant deltas

- **No new mechanic gaps.** This is an authoring roster; it rides the existing
  curated-pol pipeline (#240), dynasty (#194), trait-remap (#216), demographics
  (#239/#238), and trait-effects (#220) gaps. It does NOT introduce a new system.
- The **one substantive new question** is N1 (the sub-floor rule conflict), below.

---

## Candidate gaps for consolidation (hand-off to consolidation agent)

- **N1 — Sub-floor balance rule vs. "strong never-nominated" full-strength stats
  (the headline tension; for tech-lead).** CLAUDE.md + `seedDataset.mjs:239-240`
  state that **failed / never-nominated candidates get sub-floor electoral stats
  (legislative ≤ 1, low command) so they rarely win** — but that rule is wired
  only to **`ERA_ROWS`/`ERA_FIGURES`** (never-served era notables). These 16+
  figures are *also* never-nominated, yet vcczar deliberately stats them at
  **full strength** (e.g. Ted Kennedy/Calhoun/Taft = **3 Legislative**;
  Sanders/Jackson/Rockefeller = **2 Command**; Burr = 2 Leg/2 Mil; many with rich
  trait sets) — the whole point is they were *strong*. **So the sub-floor rule
  does NOT apply to this roster.** These are **CURATED_ROWS-class (marquee,
  full-strength)** overrides, NOT `ERA_FIGURES`. Open Q for consolidation/tech-lead:
  if/when ingested, do these go into `ROWS` (full strength, no sub-floor) — and is
  there any guard keeping a never-nominee like Ted Kennedy from *winning the
  presidency* in-sim, or is "strong but historically never nominated" purely
  flavor with no electoral cap? vcczar explicitly notes several "may have a hard
  time getting elected" via **regional/likability/ideology** factors (Rockefeller,
  Seward, Calhoun, Jesse Jackson) rather than via stat-flooring — i.e. the
  *design* intent is to model never-winning through PV/electability mechanics, not
  stat suppression. Flag any wiring assumption to the contrary.
- **#240 (CURATED_ROWS fill).** Same canonical schema; this is a **second
  authoring roster** to fold into the curated dataset alongside the 47 presidents.
  Currently `CURATED_ROWS` builds from `ROWS` (143 marquee 1772/1856 figures +
  23 `ERA_FIGURES`); **none of these 16+ never-nominees are in the dataset today.**
  Mostly **modern-era figures (1900s-2020s)** — fills a roster gap distinct from
  the founding/antebellum `ROWS` and the presidents list.
- **#194 (dynasty).** Turnkey dynasty seed rows (11 named dynasties above);
  Taft links to the existing President-Taft dynasty; **marriage-based dynasty
  membership** (Burr's daughter, McAdoo) is a modeling nuance to capture.
- **#216 (trait-name remap).** Corroborates the trait-union mismatch (list above);
  plus durable **Hale/Frail** (longevity↔early-death, POST 34-35) and
  **Predictable** (anti-stonewall EFFECT, POST 12) definitions for #220.
- **#239 / #238 (Misc flags + demographics).** New demographic/Misc data points
  with no shipped home: **African-American** (Jesse Jackson), **Catholic** (RFK,
  McCarthy), **Can be Independent** (McCarthy) — same curated-override schema gap.

## Open questions (for the human)

- Should this roster be ingested as full-strength `ROWS` entries, or do
  never-nominees need *some* electoral cap distinct from both `ROWS` (full) and
  `ERA_FIGURES` (sub-floor)? (Core of N1.)
- Is **Transportation** a real intended expertise tag (McAdoo, POST 30), or a
  one-off to remap onto the shipped 10-expertise union? (Agriculture is already
  in `EXPERTISE_NAMES`; Transportation is not.)
- Crawford is flagged by vcczar himself as "technically a nominee" (POST 23) —
  include in the never-nominated set or exclude on ingest?
