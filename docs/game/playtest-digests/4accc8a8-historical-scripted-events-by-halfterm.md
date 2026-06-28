# 4accc8a8 — "Historical Scripted Events by Half-Term"

**Type:** DATA / BALANCE AUDIT (NOT a playthrough). vcczar's per-era count of
**Scripted Events bucketed by half-term** (the 2-year turn), posted era-by-era
across the full game timeline, flagging half-terms with too few / too many.
**Scope:** 16 posts / 1 chunk (`chunk-001.md`), ~4.7KB. Forum topic 1782521822;
the closing exchange (POST 15-16) dates to 12/28/2022. Participants: **@vcczar**
(tier-1, the author/designer, POSTs 1-14) and **OrangeP47** (POST 15).
**Why it matters — TWO big signals:** (1) a **THIRD distinct, authoritative
era vocabulary** — 14 eras with explicit per-half-term boundaries — gold for the
#116 era-table reconciliation; (2) the **measured baseline of scripted-event
density per half-term** as a content-authoring/balance metric, the empirical
corroboration of #221's historical-density calibration rule. 100% authoring-side
design data — **0% shipped** (the shipped `Era` enum is 4-value; the Scripted-Event
content system is unbuilt, part of #221).

---

## 1. ★ THE ERA TABLE — capture EXACTLY (third authoritative era vocabulary)

vcczar walks **14 named eras**, each as a list of 2-year half-terms with an
event count, plus an era total. Transcribed verbatim from POSTs 1-14:

| Era | Span (this thread) | Half-term counts | Era total |
|---|---|---|---|
| **Independence** | 1772–1787 | 1772-73:**8**, 1774-75:11, 1776-77:10, 1778-79:8, **1780-81:3**, **1782-83:3**, 1784-85:6, 1786-87:7 | **56** |
| **Federalism** | 1788–1799 | 1788-89:4, 1790-91:6, 1792-93:7, 1794-95:7, 1796-97:5, 1798-99:7 | **36** |
| **Republicanism** | 1800–1819 | 1800-01:7, 1802-03:8, 1804-05:6, 1806-07:11, 1808-09:9, 1810-11:13, **1812-13:3**, 1814-15:9, 1816-17:14, 1818-19:12 | **92** |
| **Democracy** | 1820–1839 | 1820-21:7, **1822-23:3**, 1824-25:7, 1826-27:9, 1828-29:7, 1830-31:11, 1832-33:12, **1834-35:5**, 1836-37:14, 1838-39:8 | **83** |
| **Manifest Destiny** | 1840–1855 | 1840-41:10, **1842-43:5**, 1844-45:14, 1846-47:12, 1848-49:17, 1850-51:17, 1852-53:13, 1854-55:18 | **106** |
| **Nationalism** | 1856–1867 | 1856-57:17, 1858-59:20, 1860-61:13, 1862-63:10, 1864-65:18, 1866-67:13 | **91** |
| **Gilded Age** | 1868–1891 | 1868-69:12, 1870-71:16, 1872-73:11, 1874-75:19, 1876-77:12, 1878-79:13, 1880-81:12, 1882-83:18, 1884-85:17, 1886-87:10, **1888-89:7**, **1890-91:26** | **173** |
| **Progressivism** | 1892–1915 | 1892-93:10, 1894-95:8, 1896-97:9, 1898-99:14, 1900-01:10, 1902-03:16, 1904-05:18, 1906-07:16, 1908-09:10, 1910-11:21, 1912-13:10, 1914-15:11 | **153** |
| **Normalcy** | 1916–1927 | 1916-17:15, 1918-19:14, 1920-21:24, 1922-23:18, 1924-25:23, **1926-27:7** | **101** |
| **Ideologies** | 1928–1947 | 1928-29:15, 1930-31:13, 1932-33:17, **1934-35:6**, 1936-37:11, 1938-39:10, 1940-41:15, **1942-43:4**, 1944-45:15, 1946-47:19 | **125** |
| **Nuclear Age** | 1948–1971 | 1948-49:16, 1950-51:9, 1952-53:17, 1954-55:23, 1956-57:14, 1958-59:9, 1960-61:18, 1962-63:14, **1964-65:7**, 1966-67:11, 1968-69:9, 1970-71:8 | **155** |
| **Neocons** | 1972–1999 | 1972-73:17, 1974-75:11, 1976-77:7, 1978-79:8, 1980-81:16, 1982-83:12, 1984-85:13, 1986-87:12, 1988-89:10, 1990-91:13, 1992-93:8, 1994-95:9, **1996-97:6**, 1998-99:8 | **150** |
| **Terror** | 2000–2011 | 2000-01:12, 2002-03:8, 2004-05:9, 2006-07:8, 2008-09:7, **2010-11:6** | **50** |
| **Populism** | 2012–present | 2012-13:7, **2014-15:20**, 2016-17:13, 2018-19:11, 2020-21:11, **2022-23:2** | **64** |

**14 eras. Sum of era totals = 1,335 scripted events across the timeline.**
The full half-term granularity (boundaries land on the even/odd year pair, the
2-year turn) is itself a datum: the engine's content scheduler buckets by
**half-term**, not by single year. Cite: POSTs 1–14 respectively.

## 2. ★ Three-way (now FOUR-witness) era-table reconciliation — feeds #116/#206

This thread is a **third DISTINCT era vocabulary** alongside the two already
logged, and a **fourth authoring-side witness** to the era-band data model
(after `rulebook` §A, `benchmarkupd`, `rep1800`-class playtest band-labels).
Side-by-side of the three named tables (gap #116 is exactly "reconcile these into
one canonical EraBand"):

| Table | # eras | Boundary style | Notable divergences |
|---|---|---|---|
| **rulebook §A** (#206) | **15** | date-triggered LABELS / point-bank boundaries; includes a 15th **Era of the Future** | 15-value; Gilded Age + Progressivism are *separate* triggers (1892) |
| **benchmarkupd** (217d1977, #206/#253) | **13** | Red/Blue benchmark-header trigger-year table | folds Gilded Age end at **1892**; "Era of the Future = after current real-world cycle"; only 2/13 map to the shipped 4-enum |
| **THIS thread** (4accc8a8) | **14** | per-half-term content buckets w/ event totals | see below |

**Specific divergences visible in THIS table (record for #116):**
- **14 eras** (vs 15 rulebook, vs 13 benchmark) — a third cardinality. No
  standalone "Era of the Future" row; the timeline ends at **Populism
  2012–present** (POST 14), consistent with "content stops at the present"
  (#206).
- Uses the band labels **Republicanism / Democracy / Manifest Destiny /
  Ideologies / Nuclear Age / Neocons / Terror / Populism** — the same modern
  long-form vocabulary as the line-1398 band-label calendar (Independence 1774 →
  … → Populism 2012), but **with concrete half-term spans attached**, which the
  other tables do not give at this granularity.
- **Manifest Destiny starts 1840** (1840–1855 here); ends 1855 (Nationalism
  opens 1856). Matches benchmarkupd's "Manifest Destiny 1840–1856 / Nationalism
  1856–1868."
- **Nationalism is only 1856–1867** (6 half-terms) — the *shortest* major band,
  vs the shipped enum where `nationalism` is a single coarse bucket spanning the
  whole `rep1800→gilded` arc (1800–1868 in the playtest digests). Strong evidence
  the shipped 4-enum over-collapses this region.
- **Gilded Age 1868–1891** (12 half-terms, the **largest** at 173 events) — ends
  1891, i.e. Progressivism opens **1892**, matching rulebook's separate-trigger
  read and benchmarkupd's "Gilded Age …1892."
- **Independence starts 1772** here (the inaugural-draft year), where rulebook /
  benchmark / line-1398 calendar all start the *named* Independence/Federalism
  band labels at **1774 / 1788**. So this table extends the earliest band back to
  the 1772 game-start. (Minor: an extra 1772–1773 half-term the label-calendars
  don't index.)
- Era spans tile **contiguously with no gaps** (1772→present), so this is a clean
  partition candidate for the canonical EraBand year-spine.

**Engine reality (don't re-derive):** shipped `Era = 'independence' |
'federalism' | 'nationalism' | 'modern'` (4 values, `src/types.ts:1337`). None of
the three authoring tables (15 / 14 / 13) match it; this thread adds a third
band-count to the reconciliation backlog. → **#116** (reconcile era tables into
one canonical EraBand), cross-ref **#206** (era-band label spec / Future stub at
source) and **#92** (era-advance is game-state-gated, not a pure year flip; "the
trigger date is the *earliest* a band opens").

## 3. ★ Scripted-event DENSITY as a content-budget / balance metric — feeds #221

vcczar is explicitly auditing **events-per-half-term as an authoring balance
metric** and naming a target band.

- **Stated target band: ~6–11 events per half-term** (POST 1: "the average range
  would be about 6-11 events per half term here").
- **Floated engine rule — a per-half-term CONTENT BUDGET, randomized within a
  range:** POST 1 — "make a **range of 5–15** for Scripted Events for this era,
  or something to that effect." I.e. the scripted-event count is itself a
  **budget the engine should enforce/randomize within a per-half-term range**,
  not just a static authored list. This is the engine-side companion to #221's
  density-calibration curation rule.
- **Flagged outliers (too-few unless noted):**
  - **Independence 1780–1781 & 1782–1783 = 3 each** (POST 1) — a 4-year trough;
    vcczar plans to author flavor events to fill it ("not urgent yet").
  - **Republicanism 1812–1813 = 3** (POST 3, "primary issue here").
  - **Democracy 1822–1823 = 3 and 1834–1835 = 5** (POST 4).
  - **Manifest Destiny 1842–1843 = 5** (POST 5).
  - **Gilded Age: 1888–1889 = 7 vs 1890–1891 = 26** — "huge gap" / a **spike
    outlier** (POST 7), the single densest half-term in the timeline.
  - **Normalcy 1926–1927 = 7** (POST 9); **Normalcy 1920-21 = 24, 1924-25 = 23**
    are high (top-heavy region).
  - **Ideologies 1934–1935 = 6 and 1942–1943 = 4** ("two half-terms with too few",
    POST 10).
  - **Nuclear Age 1964–1965 = 7** (and generally "some imbalances", POST 11).
  - **Neocons 1996–1997 = 6** (POST 12).
  - **Populism 2014–2015 = 20** ("top-heavy", POST 14); **2022–2023 = 2** (the
    thinnest half-term in the table — recent, unfilled).
- **Per-era totals** (the measured baseline pool size per era): Independence 56,
  Federalism 36, Republicanism 92, Democracy 83, Manifest Destiny 106,
  Nationalism 91, **Gilded Age 173 (max)**, Progressivism 153, Normalcy 101,
  Ideologies 125, Nuclear Age 155, Neocons 150, **Terror 50 / Federalism 36
  (mins)**, Populism 64.
- **★ "Recent eras are thin because we don't yet know what'll be famous"** —
  designer-attributed structural reason the modern tail under-fills: POST 12
  (Neocons "low on events… we are starting to get to the present, which means we
  don't know what innovations, artists, inventors, writers… in the 1980s will be
  as famous as the ones we knew about in… 1900"); POST 13 (Terror "will
  definitely need more events"); POST 14. So the density shortfall in
  Neocons/Terror/Populism is a **known content-supply hole**, not a balance bug —
  the same Future/recent-band content hole as #206.
- **Authoring sequencing:** POST 14 — vcczar "won't add any new scripted events
  until early release is out, unless Anthony [Ted] suggests otherwise." So this
  audit is a **deferred backlog**, not an active fix.

→ This corroborates **#221**'s historical-density calibration rule (size each
half-term's content pool to a target band) and is the **measured baseline** for
it: the table in §1 is the literal current pool size per half-term, the ~6–11
band is the target, and the flagged outliers are the work items.

## 4. Minor authoring-workflow aside (NOT a game gap)

POST 15-16: OrangeP47 asks whether vcczar finished and **put the events back in
their original order** so he can resume the "alt states" work; vcczar (POST 16)
hasn't — he reordered the master event list to perform this count and needs to
restore the original order "without losing what I did." Pure spreadsheet/authoring
hygiene, not a game mechanic. Noted once; **do not create a gap for it.**

---

## 5. Candidate gaps / deltas for consolidation

*(Map to EXISTING gap IDs only — NO new numbers. Consolidation agent owns the
gap-log edit; this is the hand-off.)*

- **#116 (reconcile era tables → one canonical EraBand)** — CORROBORATE + EXTEND.
  Adds a **THIRD distinct era vocabulary**: **14 eras, 1772–present, with
  contiguous per-half-term spans** (full table §1). New cardinality alongside the
  rulebook §A **15** and benchmarkupd **13**. Specific divergences logged (§2):
  Nationalism only 1856–1867; Gilded Age 1868–1891 (the largest); Manifest
  Destiny starts 1840; no standalone Future row; Independence pushed back to the
  1772 game-start. Strengthens the case that the shipped 4-enum (`src/types.ts:1337`)
  over-collapses 1800–1868.
- **#206 (era-band label spec / Future-band content hole at source)** —
  CORROBORATE. Timeline ends at **Populism 2012–present** with the recent eras
  (Neocons 150 but thin-per-half-term, Terror 50, Populism 64) **deliberately
  under-filled** because "we don't know what'll be famous yet" (POST 12-14) —
  direct content-side confirmation of the recent/Future content hole. No "Era of
  the Future" row in this table.
- **#92 (era-as-content-band; advance is game-state-gated)** — CORROBORATE
  (indirect). The eras are content buckets keyed to half-terms, consistent with
  the band model; reinforces #116's reconciliation read.
- **#221 (3-primitive content system — Scripted-Events pool; historical-density
  calibration)** — CORROBORATE + SUPPLY BASELINE. This is the **measured baseline
  pool size per half-term** for the density-calibration rule (§1 table), with the
  designer's **target band ~6–11 events/half-term** (POST 1) and a concrete
  outlier work-list (§3). Also surfaces a sharper engine requirement: the
  **per-half-term scripted-event count is itself a content BUDGET the engine
  should enforce/randomize within a range** ("a range of 5–15," POST 1) — i.e.
  not merely author N events but bound how many fire per turn. Scripted Events
  remain **0% shipped** (part of the unbuilt #221 content system; shipped content
  lives in `eraEvents*.ts`/`anytimeEvents.ts`, a different shape).

## 6. Open questions (carry forward)

- Which of the three era cardinalities (15 / 14 / 13) is canonical for the
  EraBand? This 14-era table is the only one with full contiguous half-term spans
  — is it the most implementation-ready year-spine, or does the rulebook §A
  15-label set (with its explicit Future row) win? (→ #116 decision.)
- Is the "**range of 5–15** scripted events per half-term" (POST 1) meant as a
  **per-era** authored-pool floor/ceiling, or a **runtime** cap on how many fire
  per turn (a budget the engine randomizes within)? POST 1 is ambiguous; #221
  needs the human call.
- Did vcczar's deferred plan ("won't add events until early release," POST 14;
  fill 1780–1783 flavor, POST 1) ever execute in a later thread, or do these
  troughs/spikes still stand as the live baseline?

---

### Provenance notes
- Single chunk; all 16 posts read. Authoritative signal = vcczar (tier-1,
  designer) POSTs 1–14 and 16; POST 15 (OrangeP47) is the workflow question.
- All counts in §1 transcribed verbatim from POSTs 1–14 (`===== POST n =====`
  markers). Era spans are inferred from the half-term lists (first/last pair per
  era).
- Codebase verified at `src/` HEAD on 2026-06-28: shipped `Era` is the 4-value
  enum `'independence' | 'federalism' | 'nationalism' | 'modern'`
  (`src/types.ts:1337`) — does not match any of the 14/15/13 authoring tables.
- Cross-refs: `benchmarkupd` (217d1977 — the 13-era benchmark-header table,
  #206/#253), `rulebook` §A (the 15-era date-triggered table, #206), the
  line-1398 band-label calendar (Independence 1774 → … → Populism 2012), and the
  #116 three-way reconciliation row. Density rule cross-ref: the #221 content
  system + its curation/calibration law.
