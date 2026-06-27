# Digest — `853ce63f-ampu-historical-data` ("AMPU Historical Data")

**Batch 30 · 89 posts / 3 chunks (read in full) · DATA / AUTHORING-SOURCE thread, not a playtest.**
This is the **raw era-content authoring source** behind the per-era content model (gap-log
**#92** eras-as-content-bands; **#206** Era-of-the-Future doubly-unbuilt; the K4 era-content
registry). vcczar (tier-1) walks the entire timeline **administration by administration** (plus
the three pre-constitutional Congresses), posting each one's scripted events, legislation,
presidential actions, SCOTUS cases, and warfare, soliciting *historical* gap-fills. Mostly
content DATA, so this digest captures the **data-model shape** and the **era-completeness
signal**, not a long gap list. Post numbers cite the `===== POST n =====` markers.

---

## 1. The content-data-model shape (the heart of this thread)

vcczar's organizing thesis (**POST 1**): *"I'm going to start posting all the historical legis
props, pres actions, etc by Presidential Administration (and Continental Congresses). I think by
organizing it this way, I can figure out if any proposals…are needed for a specific time
period. I'm fixing a lot of things in the spreadsheets as I put these together."*

**The unit of authoring = one presidential administration (or Continental Congress).** Each post
is a fixed-schema record with these **6 categories**, every one tagged with a historical year:

| Category (thread label) | Maps to build entity | Notes |
|---|---|---|
| **Scripted Events (excl. flavor)** | `EraEvent` (`eraEvents1772.ts`/`eraEvents1856.ts`) | The "excl. flavor" qualifier is explicit and load-bearing: **two-tier event model** — *scripted* (modeled) vs *flavor* (narration-only). vcczar declines all 2nd/3rd-tier flavor-event suggestions (**POST 4, 41**). |
| **Legis Props** (a.k.a. "Legis Prop Activated") | Bill / legislation catalog | The biggest declared gap area (see §3). Includes statehood admissions, amendments, tariffs, dept creation, and **deactivations/repeals** (e.g. "Deactivated the Alien Friends Act," POST 11). |
| **Pres Actions** | Presidential-action catalog | Executive-branch acts not requiring Congress. Sparse in early eras ("*Not functional until post-Constitution*," POST 1; many `n/a`). |
| **SC Cases** | Named-Justice SCOTUS docket | "*Not functional yet*" before 1789 (POST 1, 2, 5). |
| **Warfare** | War charts / war engine | begins/continues/resolved markers per year (Rev War, Indian wars, Barbary, 1812, Mexican, Civil War, Korea, Vietnam, Grenada, Gulf…). |
| **New Gov Actions Available/Unavailable** | Gov-action unlocks | Only appears in the 1st Congress post (POST 1) as "*Not functional until Post-Independence*"; effectively dormant thereafter. |

**Two structural rulings this implies for the K4 era-content registry / #92 / #206:**
- The natural **keying dimension of the content model is the administration/era-band, not the
  calendar year** — vcczar chose this axis *because* it lets him spot per-period coverage holes
  (POST 1). This is the authoring-side mirror of #92 (content gated by game-state band, not
  `year % n`).
- **Categories activate per era** ("Not functional until post-Constitution / post-Independence /
  yet"). The registry must model each content category as **era-gated on/off**, matching the
  observed Pres-Actions/SC-Cases/Gov-Actions dormancy in the founding bands (corroborates the
  era-gated-content cluster, esp. #68/#92).

The build's shipped `EraEvent` shape (year-windowed, `decider: president|cabinet`, branching
`responses` with meter / enthusiasm / interest-group deltas — see `eraEvents1856.ts` Bleeding
Kansas / Dred Scott / Panic of 1857) is the **runtime form of one "Scripted Event" row here**.
This thread is the flat authored list; the build hand-expands a tiny subset into full branching
events. (Branch-response payloads are NOT in this thread — it is the *index*, not the effects.)

---

## 2. Era coverage map (administration-by-administration)

**Complete, contiguous, one post per administration**, 1774 → 2022. Pre-presidential periods are
modeled as Congresses. Density tracks real historical activity.

| # | Administration / Congress | Years | Post | Density (events / legis / pres / SC / war) | Declared need (vcczar) |
|---|---|---|---|---|---|
| — | 1st Continental Congress | 1774 | 1 | 5 / 2 / — / — / none | well-covered ("impotent" Congress) |
| — | 2nd Continental Congress | 1775–81 | 2 | ~20 / 13 / — / — / RevWar | **legis 1777–1780** (1/yr, ≤4–5 total) |
| — | Confederation Congress | 1781–89 | 5 | 13 / 21 / — / — / RevWar→NW | **legis 1781–1785** (≤5 total) |
| 1 | Washington | 1789–97 | 6 | 17 / 26 / 2 / 3 / NW Indian | legis 1795–96 (→4); more pres actions |
| 2 | J. Adams | 1796–1801 | 11 | 4 / 12 / 1 / 1 / Quasi-War | **more pres actions**; ≤2 legis 1799 |
| 3 | Jefferson | 1801–09 | 14 | 13 / 18 / 4 / 2 / Barbary | more pres actions; legis 1802/04/05/08 |
| 4 | Madison | 1809–17 | 17 | 14 / 7 / 0 / 2 / 1812+ | **pres actions; 8–10 legis** (high need) |
| 5 | Monroe | 1817–25 | 18 | 15 / 14 / 1 / 5 / Seminole | ~4 legis; more pres actions (hard) |
| 6 | J.Q. Adams | 1825–29 | 19 | 4 / 1 / 0 / 0 / none | **7–8 legis, pres actions, 1 SC** (highest need) |
| 7 | Jackson | 1829–37 | 24 | 12 / 10 / 13 / 2 / Black Hawk | a few more legis |
| 8 | Van Buren | 1837–41 | 27 | 11 / 3 / 0 / 1 / Seminole | **legis, pres actions, 1 SC** |
| 9 | W.H. Harrison | 1841 | 28 | all `n/a` (died) | none (too short) |
| 10 | Tyler | 1841–45 | 29 | 6 / 2 / 1 / 0 / Seminole | pres actions, legis, 1 SC |
| 11 | Polk | 1845–49 | 30 | 9 / 9 / 1 / 0 / Mexican | more legis, pres actions, 1 SC |
| 12 | Taylor | 1849–50 | 31 | 5 / 0 / 0 / 0 / Apache+Navajo | a few legis, pres actions, 1 SC |
| 13 | Fillmore | 1850–53 | 33 | 4 / 8 / 1 / 1 | legis 1851–52, pres actions |
| 14 | Pierce | 1853–57 | 34 | 7 / 5 / 1 / 0 | legis, pres actions, ≥1 SC |
| 15 | Buchanan | 1857–61 | 35 | 10 / 5 / 0 / 2 / Utah | legis, pres actions |
| 16 | Lincoln | 1861–65 | 36 | 9 / 23 / 1 / 0 / **Civil War** | pres actions, SC cases |
| 17 | A. Johnson | 1865–69 | 37 | 8 / 7 / 1 / 2 | pres actions; more legis (not over-veto) |
| 18 | Grant | 1869–77 | 39 | 19 / 10 / 1 / 3 / Sioux | pres actions; a few legis |
| 19 | Hayes | 1877–81 | 44 | 6 / 1 / 1 / 3 | legis + pres actions |
| 20 | Garfield | 1881 | 45 | 2 / 0 / 0 / 0 | legis Apr–Sep 1881 if found |
| 21 | Arthur | 1881–85 | 46 | 2 / 5 / 0 / 2 | pres actions only |
| 22 | Cleveland I | 1885–89 | 47 | 6 / 6 / 1 / 2 | more legis + pres actions |
| 23 | B. Harrison | 1889–93 | 48 | 9 / 14 / 0 / 2 | pres actions |
| 24 | Cleveland II | 1893–97 | 50 | 7 / 3 / 2 / 3 | legis + pres actions |
| 25 | McKinley | 1897–1901 | 51 | 6 / 6 / 0 / 3 / Span-Am | pres actions; a few legis |
| 26 | T. Roosevelt | 1901–09 | 52 | 11 / 10 / 4 / 6 | ~1 legis, 1 pres action |
| 27 | Taft | 1909–13 | 53 | 6 / 6 / 1 / 0 | pres actions, ≥1 SC, maybe 1 legis |
| 28 | Wilson | 1913–21 | 54 | 22 / 27 / 4 / 6 / WWI | pres actions only |
| 29 | Harding | 1921–23 | 56 | 4 / 6 / 1 / 2 | pres actions |
| 30 | Coolidge | 1923–29 | 57 | 7 / 6 / 1 / 4 | a few legis + pres actions |
| 31 | Hoover | 1929–33 | 58 | 8 / 8 / 2 / 3 | pres actions |
| 32 | F.D. Roosevelt | 1933–45 | 59 | 18 / 36 / 12 / 11 / WWII | more pres actions |
| 33 | Truman | 1945–53 | 60 | 18 / 12 / 10 / 4 / Korea | ~1 more pres action |
| 34 | Eisenhower | 1953–61 | 61 | 21 / 14 / 4 / 7 | pres actions; maybe 1 legis |
| 35 | Kennedy | 1961–63 | 62 | 8 / 1 / 3 / 2 | **legis passed under JFK (not LBJ)**; pres actions |
| 36 | L.B. Johnson | 1963–69 | 66 | 6 / 24 / 2 / 5 / Vietnam | more pres actions |
| 37 | Nixon | 1969–74 | 68 | 15 / 15 / 9 / 7 | none (well-covered) |
| 38 | Ford | 1974–77 | 69 | 5 / 0 / 0 / 0 | **legis, pres actions, SC — all high need** |
| 39 | Carter | 1977–81 | 70 | 11 / 9 / 8 / 1 | none high-need |
| 40 | Reagan | 1981–89 | 73 | 18 / 9 / 5 / 4 / Grenada | a few legis + pres actions |
| 41 | G.H.W. Bush | 1989–93 | 76 | 9 / 7 / 2 / 5 / Gulf | pres actions, 1–2 legis |
| 42 | Clinton | 1993–2001 | 77 | 24 / 15 / 1 / 5 | pres actions |
| 43 | G.W. Bush | 2001–09 | 78 | 21 / 11 / 5 / "8 SC" | pres actions, maybe 1 legis |
| 44 | Obama | 2009–17 | 79 | 27 / 10 / 5 / "5 SC" | ~2 legis, more pres actions |
| 45 | Trump | 2017–21 | 80 | 15 / 6 / 8 / "5 SC" | **more legis** (rhetoric-only president) |
| 46 | **Biden** | **2021–present** | **81** | **4 / 4 / 5 / "1 SC"** | **legis, pres actions, ~1 SC** |

**Terminal edge:** Biden is the last administration; his final scripted event is **Russia Invades
Ukraine — 2022** (POST 81). The data **stops cold at the present day (2022).**

**Density observations:** the sparsest-content presidencies (the explicit high-need set) are
**J.Q. Adams, Madison, Van Buren, Tyler, Taylor, Garfield, Ford, Kennedy, Biden** — short terms,
do-nothing/obstructed terms, and the live present. The richest are **FDR, Wilson, LBJ, Lincoln,
Obama, Clinton** (high event/legis counts). For a few late presidencies vcczar abbreviated SC
cases as a count ("He has 8 total SC cases," POST 78/79/80/81) — those rows are placeholders, not
enumerated data.

---

## 3. Era-content completeness signal (the #206 / K4 payload)

- **★ NO Era-of-the-Future content exists in this thread.** The authored timeline terminates at
  Biden / 2022 (POST 81). There are **zero** scripted events, legislation, pres actions, SC
  cases, or wars authored for any post-2022 / synthetic-future band. This is the **authoring-side
  confirmation of #206**: the Era-of-the-Future is under-content'd at source, not merely missing
  from the shipped `Era` enum. The future band is a **stub with no authored content rows at all**
  in the canonical data.
- **The present band (Biden, 2021–2022) is itself the thinnest live era** (4/4/5/1) and is flagged
  high-need by vcczar (POST 81). Corroborates **#169** (post-2020 Biden content band needs fill).
- **Founding bands are content-complete but category-gated:** Pres Actions / SC Cases / Gov Actions
  are explicitly "*Not functional*" pre-1789 (POST 1, 2, 5). The registry must support
  **per-era category activation**, not a uniform schema across all bands (corroborates #68/#92).
- **Declared per-period legislation gaps** (the only systematic content holes vcczar named):
  legis for **1777–1780**, **1781–1785**, **1795–96**, **1799**, **1802/04/05/08**, Madison's
  terms (8–10), Monroe (~4), **J.Q. Adams (7–8)**, Van Buren, Tyler, Polk, Pierce, Buchanan,
  Fillmore (1851–52), Hayes, Ford (all categories), **Kennedy (JFK-not-LBJ legis)**. These are
  *content-authoring* tasks, not engine gaps.

---

## 4. Authoritative content fixes / rulings (vcczar, tier-1)

vcczar said *"I'm fixing a lot of things in the spreadsheets as I put these together"* (POST 1).
The decisions he stated in-thread that are authoritative for the content model:

- **Two-tier event taxonomy is fixed policy:** only *scripted (non-flavor)* events are tracked
  here; flavor/2nd–3rd-tier events are deferred to *after* early release (POST 4). vcczar
  repeatedly declines scripted-event suggestions — **this thread accepts ONLY historical legis,
  pres actions, and SC cases** (POST 4, 41).
- **Bills must be historically-enacted**, not merely proposed/debated — JQA's never-realized ideas
  (national university/observatory/weights & measures) are already in-game as proposals and were
  *rejected* as "passed legislation" fills (POST 20–22).
- **Event-vs-action reclassification:** the suggested Washington "war in Europe" executive-order
  branches are actually **responses to the French Revolution scripted event**, not standalone pres
  actions (POST 7→9) — events carry branching responses; standalone actions do not.
- **Cabinet inheritance as an unlockable pres action:** until a "name your own cabinet" action is
  taken (origin: J. Adams couldn't fire Washington's cabinet), the player **inherits** the prior
  cabinet (POST 12→13). A concrete pres-action-unlock-gate design ruling.
- **Carry-over events are presently one-shot:** McCarthyism (and similar) "*really should carry
  over, but they're one-time events*"; vcczar's fix is a **conditional follow-on Pres Action** if
  the tagged politician ("McCarthy") is still in office, rather than a recurring event (POST 65).
  A second instance: war markers use begins/continues/resolved across multiple administrations to
  simulate continuity manually.
- **Civil-War start-year placement is a known content compromise:** secession/CSA events are keyed
  to **Lincoln** even though the war historically began under Buchanan, *because* AMPU-1's phase
  system can't model a sub-year handoff. vcczar notes **AMPU-2** intends turn=month phases to fix
  this; **AMPU-1 keeps the phase system** (POST 35). (AMPU-2 marker — out of scope for the build.)
- **Date-correctness is actively maintained:** vcczar corrected the missing Barbary War dates on
  the spot (POST 16); flagged congress.gov as an unreliable bill source (POST 32).

---

## 5. Candidate gaps for consolidation

Mostly **corroborations** of existing rows — this is authoring DATA. The consolidation agent owns
the gap-log writes; proposed deltas, lowest-noise first:

1. **Corroborates #92 (data-model side):** canonical era content is authored/keyed by
   **administration / era-band**, deliberately *not* by calendar year, to expose per-band coverage
   — the authoring mirror of the runtime content-band model (POST 1).
2. **★ Corroborates #206 (strongly):** the canonical content data **terminates at Biden/2022 with
   zero authored future-band rows** — Era-of-the-Future content is a true stub at source, not just
   an absent enum value (POST 81, terminal edge of the whole thread).
3. **Corroborates the K4 era-content registry shape:** the registry's per-era payload =
   **{ scripted events (excl. flavor), legislation (incl. deactivations), pres actions, SC cases,
   warfare, gov-action unlocks }**, with **per-era category on/off gating** (Pres/SC/Gov dormant
   pre-1789) (POST 1, 2, 5).
4. **Corroborates #169:** the present Biden band (2021–2022) is the thinnest live era and
   explicitly high-need (POST 81); plus the per-period legislation holes listed in §3.
5. **Possible NEW (small): two-tier event taxonomy as an explicit content-model field.** "Scripted
   vs flavor" is a hard, designer-stated distinction (POST 4, 41) that the content model and
   importer must carry as a tier flag; flavor events are post-launch scope. If not already a row
   under the event/era-content cluster, worth a one-line note.
6. **Possible NEW (small): pres-action / SC-case / gov-action era-activation gates.** The
   "Not functional until post-Constitution/Independence/yet" markers (POST 1, 2, 5) imply the
   registry needs explicit **first-active-era** metadata per content category, not a flat schema.
7. **AMPU-2 marker (NOT a build gap):** turn=month phasing to fix sub-year handoffs like the
   Buchanan→Lincoln Civil-War start (POST 35) — record under the existing AMPU-2 quarantine row.

**No new engine/mechanics gaps.** This thread is the flat content index; branch-response effect
payloads, balance numbers, and the runtime `EraEvent` expansion are out of its scope.
