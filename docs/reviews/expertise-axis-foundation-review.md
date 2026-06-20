# Review: Expertise Axis Foundation (PR1)

**Branch:** `claude/abilities-expertise-traits` · build commit `19dff09`
**Verdict:** **CLEAN** — Build green; both load-bearing guardrails hold
(`src/pv.ts` byte-identical, 0/18,558 trait leakage); 26/26 ACs pass; all 4
union-shrink deviations correct and rule-neutral; no determinism leak. No
findings requiring fix.

## Build

```
> tsc -b && vite build
✓ 117 modules transformed.
dist/assets/index-nu2-bCeO.js   652.97 kB │ gzip: 163.16 kB
✓ built in 2.45s
```

PASS. Pre-existing >500 kB chunk-size warning, not introduced by PR1.

## Scope note

`main...HEAD` diff-stat is misleading (carries earlier abilities-branch
commits). The actual PR1 build is `19dff09` (parent `8bb47c7`): 17 files,
matching the brief's plan. `Draft.tsx` is NOT touched by PR1.

## Migration correctness (highest-stakes)

- **Trait leakage — 0, confirmed independently.** Each of the 8 names produces
  `0` hits inside any `"traits"` array in
  `public/standard-draft-classes.json`. All **18,558** rows carry an
  `expertise` field.
- **Fallback regenerated cleanly:** `defaultDraftClasses.ts` 135 rows, 0 trait
  leakage, 0 missing-expertise. Robert Morris → `["Economics"]` `traits:[]`;
  admirals (Jones/Barry/Hopkins) → `["Naval"]` `traits:[]`.
- **Trait union shrink — verified at the type level.** A TS probe assigning
  each of the 8 to `Trait` yields 8 `TS2322` errors → genuinely removed.
  `EXPERTISE` = exactly 19 in spec order. `POSITIVE_TRAITS` has 0 of the 8.
  `SkillKey`/`Skills` untouched (AC #3).
- **No trait-context survivors in `src/`.** Every remaining hit of the 8 names
  is expertise-context, a skill *label* (`military:'Military'`), or a seed
  literal now typed `string[]` and routed through `splitSeedTraits()`.
- **`repair()` trace** (`GameContext.tsx:169–192`): pre-PR1 politician
  `traits:['Economics','Naval']`, no `expertise` → `expertise` inits `[]`;
  both names mapped off `traits` into `expertise`; `traits=[]`; `dirty` set.
  Result `expertise:['Economics','Naval']`, `traits:[]`. Re-run is a no-op
  (idempotent); the `includes` guard dedupes a partially-migrated save.

## Acceptance criteria (A–H)

| AC | Status | Evidence |
|----|--------|----------|
| A1 Expertise union, 19 | PASS | types.ts:149–152 (probe: 19, spec order) |
| A2 `EXPERTISE` array | PASS | types.ts:154–158 |
| A3 separate axis | PASS | SkillKey unchanged (types.ts:24) |
| B4 `Politician.expertise` required | PASS | types.ts:531 |
| B5 `ImportedDraftee.expertise` | PASS | types.ts:1042; default `[]` (draftImport.ts:272) |
| C6 8 removed from Trait+POSITIVE_TRAITS | PASS | probe + node check clean |
| C7 `TRACK_THEMED_TRAITS` rewrite+backfill | PASS | types.ts:171–179; all pools ≥2 from surviving union |
| C8 scripts emit expertise | PASS | seedDataset.mjs + legislatorsToDataset.mjs |
| C9 artifacts regenerated | PASS | 18,558 JSON rows all have expertise; CSV+fallback consistent |
| D10 never undefined at runtime | PASS | every factory defaults `[]`; repair() backstops saves |
| D11 seeded from dataset rows (Option A) | PASS | splitSeedTraits in both scenario files |
| D12 idempotent | PASS | dedupe-on-insert (addExpertise), no sentinel |
| D13 unique tags | PASS | includes-guard; splitSeedTraits/repair dedupe |
| E14 career-exit grant | PASS | phaseRunners.ts:380–388; CPU-only (faithful, see below) |
| E15 cabinet grant (2.3.1+2.3.2) | PASS | phaseRunners.ts:1943–47, 1962–66, 1973–77 |
| E16 committee-chair grant (2.2.2+1772 CC) | PASS | phaseRunners.ts:1731–34; continentalCongress.ts:160–173 |
| E17 governor re-election DEFERRED | PASS | not wired |
| E18 ambassador DEFERRED | PASS | not wired |
| E19 deterministic + addLog | PASS | no RNG; addLog on real add only |
| F20 repair() init + strip | PASS | GameContext.tsx:169–192 |
| G22/23 Roster column | PASS | Roster.tsx:44 — after Traits, sortable, empty→blank |
| G24 Draft-scouting (Q7 IN) | PASS | DraftScouting.tsx:97,121 (ImportedDraftee view) |
| H25 PV unchanged | PASS | `git diff -- src/pv.ts` empty |
| H26 no eligibility/ideology/lobby reads | PASS | only 2 new `.expertise` reads, both Naval-pool fixes |

## The 4 union-shrink deviations (all correct)

1. **Naval read change** (`phaseRunners.ts` Admiral ~1969 + `revolutionaryWar.ts:41`):
   `traits.includes('Naval')` → `expertise.includes('Naval')`. **No
   chicken-and-egg.** The 3 historical admirals (Barry mil 2, Hopkins mil 3,
   Jones mil 3) carry `Naval` as a seed property in the dataset/fallback, not
   gated behind appointment, so the pool is non-empty independently. The cabinet
   filter `military>=2 || expertise.includes('Naval')` makes the pool
   identical-or-larger vs. the old trait read; the `OFFICE_EXPERTISE.Admiral`
   grant is a downstream write, never a prerequisite. Admiral eligibility
   preserved.
2. **`FORBIDDEN_TRAITS` (8 removed):** moot — `grantTrait.trait` is typed
   `Trait`; the 8 are no longer in `Trait`, so no anytime template can target
   them (0 templates reference any). Removing is correct.
3. **`phaseRunners.ts:195/207` rookie `expertise: []`:** plain 1856 factory
   default. Correct.
4. **Seed-array widening to `string[]` + `splitSeedTraits`:** the clean way to
   keep historical literals while the union shrinks. Correct.

## CPU-only career-exit limitation

Faithful reading, NOT a PR1 regression. The sole `careerTrackYears >=
CAREER_TRACK_MAX_YEARS` exit (`phaseRunners.ts:384`) sits inside the "Pass 1 —
CPU management" loop, which skips the player's faction (line 376). The player's
maxed track is never auto-cleared anywhere, so player-side career-exit
expertise is unreachable in PR1, as the brief documents. The CC/convention
forced resets are correctly NOT wired.

## Determinism / purity

PR1 added zero new `Math.random`/`Date.now`. `addExpertise` mutates in place,
pure over the snapshot. Pre-existing RNG sites are outside the gain paths.

## Findings requiring fix

None.

## Must playtest before merge (build/grep can't confirm)

1. **Fresh 1772 draft → Roster:** Expertise column renders after Traits, sorts
   by joined string, admirals show `Naval` / Morris-type shows `Economics`, a
   no-expertise rookie shows a blank cell.
2. **CPU gain paths over several half-terms** (inspect via save/DevTools — CPU
   expertise isn't on the player roster): cabinet seat → mapped expertise +
   `2.3.1`/`2.3.2` log; committee chairs (1856 four + 1772 CC four) → mapped
   expertise + `2.2.2` log; a CPU politician hitting `careerTrackYears==20` on a
   mapped track → grant + `2.1.2` log; dedupe (ex-Administration + Sec-Treasury
   ends with single `Economics`).
3. **Legacy save load:** a pre-PR1 save with `traits:['Economics','Military']`
   loads without error, re-reads as `expertise:['Economics','Military']` with
   those strings gone from Traits, and re-persists.
4. **1856 start → Roster:** Cobb/Fessenden `Economics`, Everett `Education`,
   generals `Military`.
5. **Pre-fetch/offline draft:** kill network, start 1772, inaugural draft still
   produces valid politicians with expertise (fallback path).
