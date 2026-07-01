# Digest — politician-dataset (the authoritative hand-authored 7,349-politician ground-truth)

- **Type:** authoritative hand-authored politician dataset (NOT a forum playtest/discussion thread) — the curated ground-truth roster the designer/community use via Discord bots. Row-aligned across 3 files.
- **Sources (3 files, same 7,349 pols, verified same order):** `a960dbad`-AMPU_Statesmen.csv (identity + Draft Value + 6 skills 0-5 + Celebrity), `0ce36d10`-traitsearch.js (55 boolean traits), `2506843f`-biosearch.js (bio prose). Merged → `docs/game/sources/politician-dataset/merged.json` (7,349 records). Aggregate analysis: `docs/game/sources/politician-dataset/analysis.md`; decoded marquee: `sample.md`; historian grounding: `docs/game/historical-context-politician-roster.md`.
- **Tag:** `politician-dataset`. **Cited by post/row?** No post markers — cite by **field / file / row-index** and the analysis §.
- **Ingest kind:** dataset-reconciliation run (like `/ingest-playtest` but the "source" is a data artifact). No new DH. Deltas map to EXISTING gap IDs where owned; 2 NEW mints (#338 bio field, #339 Draft-Value-as-authored-prestige).

> **Why this matters.** This is the **SOURCE-OF-TRUTH** the shipped generated
> dataset + the trait/skill/PV systems are supposed to reconcile against — the
> hand-ranked, hand-charactered roster the game has actually been played from.
> It settles three long-open reconciliation questions the KB has been circling
> from the playtest side for dozens of batches: (1) it is the **authoritative
> trait ground-truth #216 asks for** — the exact 55-name authored vocabulary, so
> the "13 genuinely-missing traits" and "starting-vs-acquired" split are now
> pinned, not inferred; (2) it is the **pre-`backroom` skill ground-truth** that
> settles #319 (the authored source has NO backroom ability at all); (3) it is
> the **CURATED superset** the `histpres`/`strongnevernom`/`failednoms` rosters
> (#240) were all sampled from — the full ~7,349-row set the pipeline should
> reconcile against, not the ~18.5k generated one. Plus two net-new data-model
> gaps the shipped `Politician` type cannot hold: a **per-politician bio** and a
> **stored hand-ranked Draft Value / prestige score**.

---

## ★ Schema (the authored record shape)

Each of the 7,349 rows is `{ Full Name, Draft Value (PV), Initial State, Initial
Team Color (Red/Blue), Initial Ideology, Draft Year, Year Gains Celebrity,
Celebrity, skills{Command, Legislative, Governing, Judicial, Military,
Administative[sic] — all 0-5}, traits[] (55-boolean vocabulary), bio (prose) }`.

- **Era span:** Draft Years **1716→2020** (band counts in analysis.md §Era) — far
  beyond the two shipping scenarios. Densest bands: antebellum (992) + CW (854) +
  Progressive (1,046); thinnest: New-Deal/WWII (352) and 2001+ (110). Coverage
  tracks authoring effort against the game's real play surface (dense where 1772
  / 1856 ship and playtests cluster; thin at recent/living figures).
- **Draft Year formula matches shipped** (`birthYear + ~25`, nearest ×4) — the
  same rule CLAUDE.md documents for the generated pipeline.

## ★ Trait-vocabulary reconciliation (the #216 authoritative ground-truth)

Authored = **55 traits**; shipped `Trait` union (`types.ts:62-117`) = **55 traits**
— but a *substantially different roster*, verified by set-diff at `src/` HEAD.

**2 naming variants (same trait, spelling only — normalize on import):**
- authored `Charisma` → shipped `Charismatic` (Washington/Jefferson/Jackson/TR/FDR/Reagan/Napoleon carry `Charisma`).
- authored `Military Leader` → shipped `Leadership` (the general-competence positive; Washington/Napoleon carry `Military Leader`).
- (plus the two the analysis already normalizes: `Two-faced`→`Two-Faced`, `Flipflopper`→`Flip-Flopper`.)

**★ 13 genuinely-missing traits** (authored, NO shipped slot even after the 2
variants above are folded — this is the concrete "missing set" #216 has been
asking for since the PV revamp, now pinned from the ground-truth side):
> **Disharmonious** (246), **Pliable** (363), **Bookkeeper** (79), **Cop** (74),
> **Geostrategist** (68), **Illicit** (51), **Easily Overwhelmed** (33),
> **Teflon** (29), **Late Bloomer** (27), **Lackey** (26), **Incoherent** (21),
> **Jurisprudence** (16), **Lowbrow** (84).

(Frequencies from analysis.md §Trait; all 13 confirmed absent from the union by
`comm -23`.) Cross-refs from the playtest side that named subsets of these:
b57/`326c33dd` (Disharmonious/Illicit + Disgraced #327), b58/`1ae348bb` (Teflon
−5-investigation / Easily-Overwhelmed +2 / Pliable-on-acquittal), b55/`87c94e25`
(the 15-canon-absent list — the same set plus Everyman/Southern-Unionist,
neither an authored column here), b49/`b9651d6d` (Cop/Pliable/Bookkeeper/Illicit/
Geostrategist/Lackey on VP blocks). This dataset is the widest, most systematic
witness of all of them.

**★ The starting-vs-acquired insight (a real reconciliation finding, NOT a
discrepancy).** The **shipped-only** traits that are absent as authored columns —
`Corrupt, Scandalous, Traitor, Outsider, Failed Bid, Ideologue, Impressionable,
Loyal, Opportunist, Ambitious` (+ the mechanical `Celebrity, Nationalist,
Globalist, Reformist`) — are **in-game-GAINED traits, not seeded at draft**. The
authored file records a politician's *starting* state; these ten are earned
during play (corruption/scandal events grant `Corrupt`/`Scandalous`; failed
elections grant `Failed Bid`; ideology-play grants `Ideologue`; etc.). Their
absence from the dataset is therefore **expected and correct** — the dataset is
the *at-draft* snapshot, the union is *at-draft ∪ acquirable*. So the true #216
reconciliation is: **2 renames + 13 to-add(-or-cut) + a clean "these are
acquired, don't seed them" bucket**, not "~15 arbitrary mismatches."

## ★ Skill-vocabulary reconciliation (the #319 pre-`backroom` ground-truth)

Authored skills (6, all 0-5): **Command, Legislative, Governing, Judicial,
Military, Administative**[sic]. Shipped `SkillKey` (`types.ts:24-30`) = **6**:
`admin, legislative, judicial, military, governing, backroom`, **plus** a
separate `Politician.command` field (`:1789`, not a `SkillKey`).

- **Clean maps:** authored `Administative`→`admin`; `Command`→the separate
  `command` field (matching shipped — command is NOT a `SkillKey` on either side);
  the other four are identical.
- **★ The one delta = `backroom`.** The authored dataset has **NO backroom
  ability at all** — it is the **pre-`backroom` ground-truth**. This is direct,
  authoritative confirmation of #319 (code carries a 7th 0-5 ability the canonical
  6-ability spec does not recognize; the ground-truth roster likewise omits it).
  Backroom is a *career track* everywhere except the shipped `Skills` type.

## ★ Draft Value = the curated PV / prestige score (→ NEW #339)

`Draft Value` is a **hand-ranked prestige/electoral-weight score, stored per
politician**: min **−25**, p10 3, median 13, p90 30, **max 241** (Napoleon), 110
negatives. Marquee tier sits far above the long tail: Clay 140, Franklin 140, TR
139, Lincoln 118, Washington 120, FDR 114, Jackson 113, Jefferson 104, Calhoun 96
— vs one-term relatives at 1-20 and joke/nobody entries at negatives (the DV −25
floor is the fictional "Duopoly Patine-Mambo" last row).

- **Shipped model has no equivalent field.** `computePV` (`pv.ts:67-89`)
  **derives** PV at *runtime* from skills×office-weights + command×10 +
  trait ±4/±5 + office prestige + age curve — it is a live function, not a stored
  authored number, and `Politician`/`ImportedDraftee` carry no `draftValue` field.
  The authored DV is the designer's *editorial* hand-ranking of historical
  weight/electability (the roster's clearest fingerprint) and drives **draft
  ordering** in the source game. → the closest shipped consumer is `computePV`'s
  output used for draft-order, but the authored DV is an *input* the shipped model
  re-derives rather than stores. NEW #339 (no owner found; not #240's pipeline
  concern, not the #214 trait→PV tiers).

## ★ NEW — the BIO field (→ NEW #338)

**7,346 / 7,349** rows carry a prose biography (avg 265 chars, max 2,458; 3
empty). `sample.md` shows the shape (Washington: "1st President… President of the
Constitutional Convention… deferred to Alexander Hamilton early on…"). The
shipped `Politician` type (`types.ts:~1780-1793`) has `draftYear, firstName,
lastName, state, ideology, birthYear, age, skills, command, traits, expertise,
loyalty?` — and **no `bio`/`description`/`biography` field** (grep on the type =
0; the `description` fields at `types.ts:1435/1462/1471/1510/1552` are on
legislation/era-event types, not `Politician`). `ImportedDraftee` (`:1780`) and
the generated `DEFAULT_DRAFT_CLASSES` rows (`defaultDraftClasses.ts`) likewise
carry no bio. So a per-politician biography field is **fully unbuilt** — a net-new
data-model + UI surface (bios are ideal for a politician detail/portrait card,
ties the #235-family presentation rows). NEW #338 (no owner; #265 is cabinet-
agency, unrelated).

## ★ Roster size vs the generated dataset (→ SHARPEN #240)

- **Authored:** 7,349 curated hand-authored pols.
- **Shipped generated:** `public/standard-draft-classes.json` (4.7 MB, ~18.5k
  runtime entries) is a **superset generated** from `unitedstates/congress-
  legislators` + MEDSL failed-candidate CSVs by `scripts/legislatorsToDataset.mjs`.
  The curated override layer is `scripts/seedDataset.mjs` `CURATED_ROWS` (built
  from a `ROWS` source array, 143 entries at runtime) + `ERA_FIGURES` (23).
- **★ This authored 7,349-set IS the ground-truth the pipeline should reconcile
  against.** The `histpres` (47 presidents), `strongnevernom` (~18), `failednoms`
  (~36), `kiaofficers`, `b9651d6d`-VPs rosters that #240 tracks as `CURATED_ROWS`
  fills are all **samples of this same authored corpus** (same fixed-shape record:
  name / DV / ideology / 6 abilities / traits / bio). The full authored file is
  the master `CURATED_ROWS` source, superseding the piecemeal thread-by-thread
  fills. Grep confirms **no script references `AMPU_Statesmen`/Draft-Value/bio** —
  the pipeline does NOT ingest this authoritative set today; it re-derives figures
  from congress-legislators + MEDSL and hand-fills a few marquee `ROWS`. Reconciling
  the generated superset against this 7,349-row ground-truth (import DV, bios, the
  authored skills/traits/team/ideology, key on row index) is the #240 pipeline task
  at full scale.

## ★ Era-relative ideology / team — the roster is STRONGER evidence than playtests (→ CORROBORATE #4)

`Initial Team Color` (Red 3,694 / Blue 3,653) and `Initial Ideology` (Mod 46% /
Cons 26% / Lib 15% / Trad/Prog/LW-Pop/RW-Pop tails) are **era-relative tokens,
assigned by each figure's alignment in their draft-era**, anchored to `draftYear`
— NOT modern GOP-red/Dem-blue. The roster breaks *within-party* consistency in
ways playtests can't:
- **Two Republican presidents on opposite TEAMS:** Reagan = **Blue** (drafted
  1936, a real FDR-era Democrat) vs Nixon = **Red** (drafted 1940). Team tracks
  era-of-entry alignment, not lifetime party — the crispest single proof.
- **Modern opposites share a team:** Trump (Blue/RW-Pop) + Pelosi (Blue/Lib) both
  **Blue**; McCarthy **Red**. Blue ≠ "the Democrats" across the file.
- **The 1856 flip is baked into the data:** antislavery figures **Red** (Lincoln,
  Grant, Douglass, Sumner, Chase, Stevens); pro-slavery/Southern-Democratic
  figures **Blue** (Calhoun, Jefferson Davis, Douglas) — the reverse of modern
  polarity, matching `scenario1856.ts`.
- **Founding pole:** Federalists **Red** (Washington/Hamilton/Franklin),
  Jeffersonians **Blue** (Jefferson/Madison).
Every ideology read must anchor to `draftYear` (Wilson/TR "Lib" = Progressive-era
reform liberalism ≠ FDR New-Deal "Lib" ≠ modern "Lib"). This is the same #4
era-relative-drafting concept, now corroborated from the roster with the
strongest available evidence (the Reagan/Nixon pair).

## ★ Data-quality — an ingest/import-hygiene requirement (fold under #240 / #216)

Normalize on import (do NOT mint standalone):
- **Name is NOT a unique key** — 40 shared names across eras/people (Daniel
  Webster×2, John McLean×2, James Wilson×2, John Bell×2, John Page×2, Richard
  Stockton×2); **"John Kennedy" LA/1976 = Sen. John Neely Kennedy, NOT JFK**. →
  **key on row index**, never name.
- **Dirty ideology values** (team-color/typo leak): `"Red"`(×2), `"LIb"`(×1).
- **Dirty team values** (ideology leak): `"RW Pop"`(×1), `"Trad"`(×1).
- **3 empty bios.**
- **CSV header typo** `"Administative"` (missing r) — map to `admin` on import.
- **Intentional non-historical content (do NOT "fix"):** Napoleon (alt-history,
  DV 241, "what if… New Orleans"); "Duopoly Patine-Mambo" (fictional, DV −25 floor);
  imported foreigners (Stephen Harper et al., `state:"Canada"`). These are game
  content per the historian's grounding, not data errors.

---

## Shipped-vs-designed (verified against `src/` HEAD 2026-07-01)

| Aspect | Authored ground-truth | Shipped `src/` | Verdict |
|---|---|---|---|
| Trait vocabulary | 55 authored names | 55-name `Trait` union (`types.ts:62-117`) — different roster | 2 renames + 13 to-add/cut + 10 acquired-not-seeded → **#216** |
| Skills | Command + 5 (no backroom) | `SkillKey` 6 incl. `backroom` + separate `command` | authored omits `backroom` → **#319** confirmed |
| Draft Value | stored hand-ranked score −25…241 | `computePV` derives PV at runtime; no stored field | **NEW #339** |
| Bio | 7,346 prose bios | no `bio` field on `Politician`/`ImportedDraftee` | **NEW #338** |
| Roster | 7,349 curated ground-truth | ~18.5k generated superset; `CURATED_ROWS`=143 | authored = master curated source → **#240** |
| Team/Ideology | era-relative, anchored to draftYear | scenario seeds + `scenario1856.ts` flip | corroborates **#4** |

## Delta list — map to EXISTING gap IDs

- **★ #216** (trait vocab ≠ shipped — BLOCKING) — SHARPENED: this dataset is the
  authoritative trait ground-truth; the exact 55-name authored vocab, the **13
  genuinely-missing** (Disharmonious, Pliable, Bookkeeper, Cop, Geostrategist,
  Illicit, Easily-Overwhelmed, Teflon, Late-Bloomer, Lackey, Incoherent,
  Jurisprudence, Lowbrow), the **2 naming variants** (Charisma→Charismatic,
  Military-Leader→Leadership), and the **starting-vs-acquired** resolution (the 10
  shipped-only traits are in-game-GAINED, which is WHY they're absent).
- **★ #319** (backroom skill) — SHARPENED: the authored source omits `backroom`
  entirely (pre-backroom ground-truth); Command is separate, matching shipped.
- **★ #339 (NEW)** — Draft Value = the stored hand-ranked prestige/PV score
  (−25…241) with no shipped equivalent (`computePV` derives, doesn't store).
- **★ #338 (NEW)** — per-politician bio field (7,346 authored bios) with no home
  in the shipped `Politician` type.
- **★ #240** (dataset pipeline / `CURATED_ROWS`) — SHARPENED: the authored 7,349
  is the master curated ground-truth the piecemeal `histpres`/`strongnevernom`/
  `failednoms`/VP rosters were sampled from; the pipeline should reconcile the
  generated superset against it; plus the import-hygiene rules (row-index key,
  dirty-value cleanup, header typo).
- **#4** (era-relative ideology/team) — CORROBORATED: Red/Blue + ideology are
  era-relative, anchored to `draftYear` (Reagan=Blue-1936 vs Nixon=Red-1940;
  Trump+Pelosi Blue; 1856 flip baked in). Stronger evidence than any playtest.

## Open questions (for the human)

1. **Draft Value adoption:** import the authored DV as a stored field (and let
   `computePV` seed/override from it), or keep deriving PV and use DV only for
   draft-ordering at import time? The two coexist awkwardly (#339/#214).
2. **Bio adoption:** add `bio` to `Politician`/`ImportedDraftee` (and the pipeline
   output), or keep bios out of the runtime model and only in an author-time
   reference? Determines whether #338 is a data-model change or docs-only.
3. **Pipeline reconciliation scope:** replace the generated superset's curated
   layer wholesale with this 7,349-row authored set, or keep generating from
   congress-legislators/MEDSL and use the authored file only as an override source
   (like today's `CURATED_ROWS` but at full scale)? (#240)
4. **The 13 missing traits:** add all 13 to the `Trait` union, or cut the
   low-frequency ones (Two-faced ships as a rename but has near-zero authored use;
   Incoherent 21 / Jurisprudence 16 are rare) — a design call the PV revamp #214
   needs settled.
