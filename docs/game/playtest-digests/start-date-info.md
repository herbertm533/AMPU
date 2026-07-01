# Digest — `start-date-info` (DATASET ingest, not a forum thread)

**Source:** `Start_Date_Info.xlsx` (`Copy_of_Start_Date_Info.xlsx`), single **"Offices"**
tab, **1022 rows × 16 cols**. Gitignored preprocess artifact under
`docs/game/sources/start-date-info/` (`analysis.md` structure, `sample.md` 20×15
excerpt, `startdate_offices.csv` the full 2,480-name matrix — NOT transcribed here).
Historian grounding: `docs/game/historical-context-start-date-seeds.md`.

**Provenance form:** dataset — cite by column (start-date window), office-row band,
or the two companion analysis docs. **No forum POST numbers exist**; do NOT invent
`POST n` cites for this source. Playtester-name scan: **0 hits** (all real figures).

---

## What this dataset is (one line)
The authoritative **scenario-boot SEED**: who really held every modeled government
office at each of the game's **15 playable election-cycle start-date windows** — the
data spec for *"the associated politicians start in those offices when starting a
game on the specified start date."*

## The 15 start-date windows (two-year election cycles)
`1772-74 · 1788-90 · 1800-02 · 1820-22 · 1840-42 · 1856-58 · 1868-70 · 1892-94 ·
1916-18 · 1928-30 · 1948-50 · 1972-74 · 2000-02 · 2012-14 · 2024-26`

Each column = "the administration that governs the 2-year cycle" (an
**inauguration-boundary** convention — the sheet picks the INCOMING president, not
the Jan-1 incumbent). This corroborates the **#92** era-band / 16-window roster
(the `0bde31bd` forum roster the b60 note folded into #92) at the DATA level — one
fewer window than the forum's 16 (no separate 1896 vs 1892 / the 2020-vs-2024 fork
collapses to a single 2024-26 column here); reconcile #92's date-list against this
data version, they agree on the shape.

## Shipped-boot reconciliation (the two built windows)
- **1772-74 = entirely `n/a`** (0 filled, 0 states) → matches shipped `scenario1772.ts`
  (`startYear 1772`, cold draft, no incumbents). ✔ consistent.
- **1856-58 President = James Buchanan** → matches `scenario1856.ts` ("James Buchanan
  is President"). ✔ **but** the sheet additionally supplies Buchanan's full cabinet,
  9-seat Court, congressional leadership, and 31-state Gov/Sen/Rep roster — the
  **complete seed** the shipped 1856 scenario only PARTIALLY expresses today (`scenario1856.ts`
  seats Buchanan + a partial cabinet + algorithmic senators, `:61-89`/`:124-193`, but
  does not express the full sheet). This sheet IS the authoritative seed the shipped
  1856 boot should build against.
- The other **13 windows** have **no code boot** — designed-but-unbuilt; this matrix
  is their authoritative seed spec. (Corroborates #92's "shipped = 2/16 boot".)

## Office taxonomy — 7 bands, ~369 labeled rows (structure only, no names)
| Band | ~Count | Examples |
|---|---|---|
| Federal executive | 39 | President, VP, era-varying cabinet secretaries, ambassadors, DNI, CIA/FBI/NSA chiefs, Fed Reserve Chair, Joint Chiefs, Army Chief of Staff |
| Military flag officers | 8 | Senior General + 3 Generals, Senior Admiral + 3 Admirals (**8, not the full corps**) |
| Supreme Court | 10 | Chief Justice (`ChJ`) + 9 Associate Justices (`AssocJ`) |
| Congressional leadership | 14 | Speaker, House/Senate Maj+Min Leaders + Whips, President Pro Tempore |
| State Governors | 50 | `AL Gov` … `WY Gov` |
| State Senators | 100 | 2 per state |
| State Representatives | 148 | **compressed apportionment** (`CA Rep 1..10`, small states 1-2) — NOT the real 435 |

## ★ Era-appropriate OFFICE evolution (the office SET changes by window — the key insight)
The sheet is **not a flat roster**: the modeled office set itself appears/vanishes by
era, tracking real US institutional history (historian-verified, `historical-context-start-date-seeds.md`):
- **Sec of War** 1788→1928, then **replaced by Sec of Defense** 1948→2024 (National
  Security Act 1947). **Sec of Navy** 1800→1928 (folded into DoD 1949). **PM Gen**
  (Postmaster General) cabinet 1840→1948, then `n/a` from 1972 (left cabinet Jul 1971).
- **Cabinet grows:** Interior (1856), Agriculture (1892), Commerce & Labor (1916 split),
  HUD + Transportation (1972), Energy/Education/VA (2000), Homeland Security (`Sec of HL Sec`)
  + DNI (`Dir of Nat Intel`) (2012).
- **Fed Reserve Chair** from 1916 (Fed founded 1913). CIA/FBI/NSA/Joint Chiefs are modern-only.
- **SCOTUS grows** 6 (1800-1820) → 7 → 9 (1840s+; settled at 9 by the Judiciary Act 1869).
- **Congressional floor leadership:** Speaker + Pres Pro Tempore from 1788, but formal
  **Maj/Min Leaders + Whips only from 1916** (party floor-leadership is an early-20th-c.
  institution).
- **Reserved-but-empty rows** reflect real gaps, not errors: `Sec of Commerce and Labor`
  (the 1903-1913 combined dept), `Amb to Ger/Japan/Israel` (ambassadorships never filled).

## ★ Era-appropriate STATE roster (states populate as admitted)
Corroborates the game's `admitState` / `expansionStates.ts` territory system and #92:

| Window | States | Window | States |
|---|---|---|---|
| 1772-74 | 0 (pre-Constitution) | 1892-94 | 44 |
| 1788-90 | 13 | 1916-1948 | 48 |
| 1800-02 | 16 | 1972-2014 | 50 |
| 1820-22 | 24 | 2024-26 | **0 (data hole — see below)** |
| 1840-42 | 26 | | |
| 1856-58 | 31 | | |
| 1868-70 | 37 | | |

Occupancy grows with the timeline: `1772 = 0 filled` → `1788 = 71` → ramping to
**~300 by the modern era**. So a boot at window *D* must select **both** the
era-appropriate office SET **and** the era-appropriate state ROSTER for *D*.

## ★ THE CORE REQUIREMENT (user directive, this ingest)
> *"the game will need to have the associated politicians start in those offices when
> starting a game on the specified start date."*

When a game begins at start date *D*, each politician named in column *D* must **start
already holding their office** (President, VP, cabinet, SCOTUS, congressional
leadership, and state Gov/Sen/Rep), using the era-appropriate office set + state
roster for *D*. Today only 1772 (empty) and 1856 (partial) boot; the general
**seed-offices-at-boot** pipeline driven by this matrix is the primary new gap
(→ **#344**). **No code changes this ingest** — captured as gap/roadmap/mechanics only.

## ★ The 5 historian divergence/turnover flags (design-relevant facts)
1. **1840-42 Harrison/Tyler.** Sheet seeds Harrison=Pres + Tyler=VP — a pairing real
   for only **31 days** (Harrison died Apr 4, 1841; first VP succession). A single
   living-President snapshot; the real arc is a death/succession event. The seed is a
   deliberate fixed-point simplification.
2. **1972-74 Nixon/Agnew.** Seeds Nixon=Pres + Agnew=VP — real only through Oct 10, 1973.
   This window actually contains TWO successions (Agnew→Ford Dec 1973; Nixon→Ford Aug
   1974). The single seed captures neither.
   → Flags 1+2 = the **start-date-turnover single-snapshot design question** (**#347**):
   the sheet must pick ONE holder per 2-year window, but real history changed mid-window.
3. **Inauguration-boundary convention.** The sheet consistently picks the INCOMING
   administration governing the cycle (Jefferson not Adams; Buchanan not Pierce; Grant
   not A. Johnson; Cleveland not B. Harrison; Hoover not Coolidge; Bush not Clinton;
   Trump not Biden). Treat each window as "the administration that governs the cycle,"
   not "who held office on Jan 1." This is the *correct* boot semantics for #86/#186 —
   folded into #344's convention note, not a separate gap.
4. **Reconstruction vacancies (1868-70).** Ex-Confederate states correctly have **vacant**
   Senate/House seats (not yet readmitted — e.g. `VA Sen = vacant`; readmissions Jun 1868,
   VA/TX/MS/GA in 1870). **Force-filling would be LESS accurate.** The sheet's vacancies
   are intentional — the boot seeder must be able to seat a **vacant** office, not require
   a name for every seat. Folded into #344 (a boot-fidelity constraint), cross-refs #86
   (which already notes "some seats VACANT to be appointment-filled").
5. **2024-26 real-but-partial** (~**280-seat hole**: fed-exec only ~20/1021 filled; 0
   states, no Court/Congress/state rows). Flag as a **data gap** — **do NOT infer or
   backfill** (**#346**). Structural compression (148 House seats not 435; 8 flag
   officers; single ambassador per country; one snapshot per cycle) is a **deliberate
   game-scale abstraction**, not a historical error — downstream roles must not
   "correct" it toward real headcounts.

## Reconciliation vs prior ingests (cross-reference, do NOT duplicate)
- **#92** (era-band / 16-window start roster): this is the concrete SEED DATA behind
  that model — a data-level corroboration from a non-forum source; agrees on the
  window shape (15 here vs 16 forum, reconciled above). Not re-logged.
- **#86** (scenario-boot DATA-SHAPE keystone — "the BootSheet owns the per-year boot
  data"): this matrix is the ground-truth `BootSheet` content #86 specs. Sharpened,
  not duplicated. #86 already anticipates vacant seats + mid-government seating.
- **#115** (boot PROCEDURE/rules gap) + **#186** (deterministic late/mid-cycle boot):
  this matrix is the authoritative INPUT DATA those procedures consume; #186 already
  carries the "start-date sheet has seat/incumbent ERRORS" data-quality caveat
  (`b15af728`) — the seat-correctness pass is a precondition to using this sheet.
- **Forum `0bde31bd-start-dates`** (discussion of start dates, already ingested and
  folded into #92): this xlsx is the authoritative DATA version — it **corroborates**
  that discussion; the discussion is not re-logged.
- **Politician-dataset (#338/#339)** + **pol-additions-2024 (#342/#343)**: those seed
  WHO EXISTS to draft (the draft pool + intended data model); THIS seeds WHO ALREADY
  HOLDS OFFICE at boot — **complementary**, not overlapping. The boot seeder must
  resolve each sheet-named officeholder to a roster politician (a join between the two
  datasets), which is an import-integration note under #344 (a name that appears here
  must map to a draftable/existing politician record).

## Data quirks (for accuracy — not for committed docs)
- `Sec of HL Sec` = Homeland Security; `Sec of VA` = Veterans Affairs; `PM Gen` =
  Postmaster General.
- Duplicate `General` / `AssocJ` / `Admiral` labels are DISTINCT seats (multiple
  holders of the same rank/bench), not errors.
- Anomalous `PM` 2-letter state code (likely a stray/typo row) — flag, don't block.
- `Meville Fuller` in-sheet = Melville Fuller (CJ 1888-1910) — a sheet typo.

## New gaps minted this ingest
- **#344** — Scenario-boot must SEED the era-correct officeholders at boot (the primary
  requirement; the data spec is this matrix).
- **#345** — Era-appropriate OFFICE-SET evolution as boot data (which offices exist per
  window).
- **#346** — Era-appropriate STATE-roster + the 2024-26 ~280-seat DATA HOLE (do not
  backfill).
- **#347** — Start-date single-snapshot TURNOVER design question (Harrison/Tyler,
  Nixon/Agnew — one holder per 2-year window vs mid-window succession).

## Open questions (for the human)
1. **Turnover snapshots (#347):** for windows containing a real mid-cycle succession
   (1840 Harrison→Tyler; 1972 Nixon→Agnew→Ford), does the boot seed the single
   living-President snapshot (fixed-point simplification) OR schedule the succession as
   a scripted era event shortly after boot? The sheet only supports the single snapshot.
2. **2024-26 backfill (#346):** the ~280 missing seats (0 states / no Court / no Congress)
   are a data hole. Confirm the boot for a 2024 start either (a) refuses to boot until
   the column is completed, or (b) falls back to inferring modern incumbents from another
   source. User directive this ingest: do NOT infer/backfill — flag only.
3. **Officeholder→roster JOIN (#344):** does every sheet-named holder resolve to a
   politician record in the draft dataset (#338/#342), and what happens on a miss
   (generate a filler pol per #115, or hard error)?
4. **Vacant-office seating (#344/flag 4):** confirm the boot seeder can leave an office
   vacant (Reconstruction Senate seats) rather than requiring a name — and whether
   vacant boot seats enter the normal appointment/election fill pipeline.

## Sources
- `docs/game/sources/start-date-info/analysis.md` — dataset structure, 15 windows,
  office/state evolution, occupancy, reconciliation (gitignored preprocess of
  `Start_Date_Info.xlsx`).
- `docs/game/sources/start-date-info/sample.md` — 20-office × 15-window excerpt.
- `docs/game/historical-context-start-date-seeds.md` — historian era-by-era grounding
  + the 5 divergence/turnover flags + verified office/state transition anchors.
- Full 2,480-name matrix: `startdate_offices.csv` (gitignored — not transcribed).
