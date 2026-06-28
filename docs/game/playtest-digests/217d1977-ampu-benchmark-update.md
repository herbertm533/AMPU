# 217d1977 — "AMPU Benchmark Update"

**Type:** CONTENT-AUTHORING / DESIGN (NOT a playthrough; no dice, no state, no
GM rulings on play). GM @vcczar posts the finished **Red Party** and **Blue
Party** per-era BENCHMARK lists — **10 benchmarks per era, scored at end-of-era**
— across the full **13-era timeline**. **Source:** `217d1977-AMPU_Benchmark_Update.csv`,
3 posts / 1 chunk (read in full). Author: @vcczar (creator; tier-1 authority),
sole poster. **One-line scope:** the canonical end-of-era win/score content for
both parties, and — incidentally — the **most complete era trigger-year table**
seen in any thread.

**Feeds:** **#68 / #102** (era-end scoring + win-condition — this IS that content)
and **#206 / #92** (the shipped 4-value `Era` enum vs. the real 13-era timeline).
**Net-new:** (a) the 13-era trigger-year table; (b) the Red/Blue dual-benchmark
content model; (c) confirmation the OLD benchmark point system is RETAINED, only
"slightly amended."

---

## 1. ★ The 13-era timeline + trigger years (POST 1 & 2, identical in both)

vcczar lists the eras as benchmark headers with explicit **year ranges**. This is
effectively the era trigger-year table — far more granular than anything shipped:

| # | Era | Years |
|---|-----|-------|
| 1 | Federalism | 1788–1800 |
| 2 | Republicanism | 1800–1820 |
| 3 | Democracy | 1820–1840 |
| 4 | Manifest Destiny | 1840–1856 |
| 5 | Nationalism | 1856–1868 |
| 6 | The Gilded Age | 1868–1892 |
| 7 | Progressivism | 1892–1916 |
| 8 | Normalcy | 1916–1928 |
| 9 | Ideologies | 1928–1948 |
| 10 | The Nuclear Age | 1948–1972 |
| 11 | The Neocons | 1972–2000 |
| 12 | Terror | 2000–2012 |
| 13 | Populism | 2012–2024 |

Notes:
- **13 eras, NOT continuous boundaries to today** (last ends 2024). An "Era of
  Independence" (pre-1788 founding/Rev-War) and an "Era of the Future" (post-2024)
  — both seen as authored content elsewhere (`eaf5cc51`, `aa227625`) — are **NOT
  in this benchmark list**, so this is the "main historical run," not the full
  scenario set.
- **Conflicts hard with the shipped 4-value `Era` enum** (`src/types.ts:1337` =
  `independence | federalism | nationalism | modern`). Of the 13 names here, only
  **Federalism** and **Nationalism** map to shipped enum members; `independence`
  and `modern` (shipped) are NOT in this list at all, and 11 of the 13 era names
  here have no enum representation. This corroborates the #206/#92 direction that
  the shipped enum is a coarse 4-band approximation and the real design needs a
  ~13+-value era model (trending toward a two-level content-band DATA model, not a
  growing hardcoded enum).
- These are 20–24-year bands keyed to historical inflection points (election
  years), consistent with `isElectionYear`/`isPresidentialyear` cadence but with
  bespoke, irregular boundaries (12 yrs for Terror, 28 yrs for Neocons).

---

## 2. ★ The benchmark scoring model (POST 1, 3)

vcczar, POST 1: *"I've finished the Red Party benchmarks. I am yet to determine
how much these will score/penalize. They will all require that these are active
(or issued if they don't linger) at the end of the era… **10 Benchmarks for every
era.** This sort of make winning the election right before an era change really
important."*

Key mechanics captured:
- **10 benchmarks per era × 13 eras = ~130 benchmarks per party** (260 total
  Red+Blue). Authored content, party-specific.
- **Scoring is evaluated at END OF ERA** — a benchmark must be **active at era
  end** (for lingering policies/states) **or "issued" during the era** (for
  one-shot actions that don't linger). This is the era-end checkpoint #68/#102
  describes; **0% shipped** (no end-of-era scoring exists in `src/`, verified).
- **Design consequence (vcczar's own emphasis):** "winning the election right
  before an era change really important" — the era boundary is a deliberate
  high-stakes scoring moment, which makes the era trigger-year table (§1)
  load-bearing for the scoring engine, not just flavor.
- **Each benchmark is a predicate over game state** at era end. Predicate types
  observed (see §3) span policy-active checks, action-issued checks, relations
  thresholds, counts ("3 states", "two chairmen"), comparatives ("higher than
  previous era"), and identity/representation checks ("a woman president").
- **Score/penalty weights are TBD** — vcczar: "yet to determine how much these
  will score/penalize" and "I'll craft rules for these later" (POST 2). Benchmarks
  "subject to change as I think of better alternatives." So the CONTENT is settled;
  the scoring formula is not yet authored.
- **The OLD benchmark point system is KEPT** (POST 3, full text): *"Ok, for now at
  least, I'm keeping the old benchmark point system. I only slightly amended it."*
  → This per-era benchmark list SUPPLEMENTS / refines the existing benchmark
  scoring rather than replacing the whole win-condition framework.

---

## 3. Red vs. Blue framing + benchmark content shape (POST 1, 2)

Two **mirrored, partisan** benchmark sets — the same era skeleton, opposite policy
goals — encoding each party's ideological "win state" per era:

- **Red Party** (POST 1) rewards: Pro-British trade/foreign-policy rhetoric; US
  Bank active; high/rising tariffs; lower income-tax brackets; strict immigration;
  pro-business-over-labor; pro-gun-rights; military/navy buildup; staying out of
  French Revolution/Napoleonic Wars; slavery contained (early) → later abolished;
  no Louisiana Purchase / no Florida acquisition (anti-expansion in some eras);
  abortion restrictions; RW-activist justices; keeping specific states red (e.g.
  South Carolina with Red Gov + 1 Red Sen).
- **Blue Party** (POST 2) rewards: Pro-states-rights (early); pro-labor-over-
  business; pro-civil-rights; popular vote expansion; League of Nations / World
  Court / internationalism; minimum wage / Social Security / national healthcare /
  TVA / food stamps / public housing; LW-activist justices; environment-over-
  energy; civil-rights/representation milestones (black president, woman president,
  woman Speaker, black woman in Congress, LGBT officeholder); lower tariffs;
  higher income-tax brackets; keeping NY blue (1 Blue Gov + 1 Blue Sen).
- **Era-relative comparatives are first-class benchmark predicates:** "Tariff is
  higher than the previous era" (Red) / "lower than previous era" (Blue); "Income
  tax bracket is lower/higher than previous era." → the scoring engine must retain
  **per-era historical snapshots** of policy values to evaluate these, not just the
  current state. (Implication for #68/#102: era-end scoring needs a per-era
  archive of key economic levers.)
- Benchmarks reference a **large named-content surface** that must exist as
  addressable game objects: specific Legis-Props / Pres-Actions / policies (US
  Bank, Independent Treasury, Homestead Act, Civil Rights Act of 1964, TVA,
  Fugitive Slave Act, Budget & Accounting Act, etc.), policy toggles
  ("Pro-X over Y Policy is active/inactive"), relations meters per nation
  (UK/France/Russia/China at thresholds), war-state flags (French Revolution,
  Napoleonic Wars, Cold War, War on Terror), and identity/office records. This is
  the same content-primitive surface (#221) but **referenced by the scoring layer**.

> Source caveat: the CSV/preprocessor stripped the per-era grouping — POST 1/2
> render as the 13 era headers FIRST, then a flat run of benchmark lines, so
> exact era↔benchmark assignment is not 1:1 recoverable from this export. The
> COUNTS (10/era), the timeline, and the model are reliable; precise per-era
> benchmark membership should be re-sourced from the original sheet before
> implementation.

---

## 4. Relation to existing gaps

- **#68 / #102 (era-end scoring + win-condition) — this thread IS the content.**
  Confirms the win/score model is **per-era benchmark checkpoints**, party-
  specific, evaluated at era boundary (active-or-issued semantics), with weights
  still TBD and the **old point system retained**. NEW vs. those gaps: the
  active-vs-issued distinction, the "previous-era comparative" predicate class
  (needs per-era policy snapshots), and the ~260-benchmark content volume.
- **#206 / #92 (era model / `Era` enum) — strong corroboration + sharpening.**
  The 13-era trigger-year table is concrete evidence the shipped 4-value enum is
  insufficient; 11/13 era names have no enum member. Reinforces the two-level
  content-band DATA-model direction over a growing hardcoded enum. NEW: the
  authoritative year boundaries for all 13 eras.
- **#221 (content-primitive registry) — corroborates (as a CONSUMER).** Benchmarks
  are predicates over the Legis-Prop/Pres-Action/policy/relations surface; many
  named items (US Bank, TVA, Fugitive Slave Act, etc.) must be addressable objects
  for benchmark evaluation. Not new content here, but a new *consumer* of it.
- **#237 (policy-genre / stateful policy meters) — adjacent.** "Pro-X over Y
  Policy is active" benchmarks presume the stateful toggleable-policy families;
  relations-threshold and economic-comparative benchmarks presume stateful meters
  with history.

## 5. Shipped reality (verified spot-check)

- Shipped `Era` enum: **4 values only** (`src/types.ts:1337`).
- **No benchmark or end-of-era scoring code exists** in `src/` (grep for
  `benchmark|endOfEra|eraScore|winCondition` → no matches). The entire scoring
  model in this thread — benchmarks, era-end checkpoint, active/issued semantics,
  previous-era comparatives — is **0% shipped**; it is designed-only content.

---

## Candidate gaps for consolidation (consolidation agent owns the gap-log write)

1. **(→ #68/#102) Per-era benchmark scoring is the win/score model — content now
   authored.** ~10 benchmarks/era × 13 eras × 2 parties (~260), each a state
   predicate evaluated **at end-of-era** with **active-or-issued** semantics;
   weights still TBD; the OLD benchmark point system is RETAINED and only slightly
   amended (supplements, not replaces). 0% shipped. Source: POST 1, 3.
2. **(→ #68/#102, NEW sub-requirement) "Previous-era comparative" benchmark
   predicates require per-era policy SNAPSHOTS.** Benchmarks like "Tariff higher/
   lower than previous era" and "Income tax bracket higher/lower than previous
   era" need the scoring engine to archive key economic levers at each era
   boundary, not just read current state. Source: POST 1, 2.
3. **(→ #206/#92) Authoritative 13-era trigger-year table.** Federalism 1788 →
   Populism 2012–2024 (full table in §1); only 2 of 13 names map to the shipped
   4-value `Era` enum; 11 have no representation. Concrete evidence/boundaries for
   the era-band DATA-model direction; note this list EXCLUDES Era-of-Independence
   (pre-1788) and Era-of-the-Future (post-2024), so the full scenario set is
   larger still. Source: POST 1, 2.
4. **★ NEW — dual partisan (Red/Blue) benchmark sets as the per-party win-state
   encoding.** Mirrored era skeletons with opposite policy goals define each
   party's ideological "victory conditions" per era (Red: tariffs/bank/business/
   guns/strict-immigration; Blue: labor/civil-rights/popular-vote/welfare/
   environment + representation milestones). Implies the scoring layer is
   party-relative. Source: POST 1, 2.
5. **(→ #221, CORROBORATES) Benchmarks are a CONSUMER of the content-primitive
   surface.** Evaluation requires named Legis-Props/Pres-Actions/policies,
   per-nation relations meters, war-state flags, and identity/office records to be
   addressable game objects. Source: POST 1, 2.
6. **Open item / data-fidelity flag:** the export FLATTENED per-era benchmark
   grouping (13 headers then a flat benchmark run) — exact era↔benchmark
   assignment is not fully recoverable from this CSV; re-source the original sheet
   before implementation. Counts/timeline/model are reliable. Source: POST 1, 2
   structure.
