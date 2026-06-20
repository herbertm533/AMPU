# Brief: Expertise Axis Foundation (PR1)

## Approach

Add a third character axis — `Expertise` (19 tags) — as a required
`expertise: Expertise[]` field on `Politician` and `ImportedDraftee`, fully
migrated per **D3 Option A**: the 8 mis-filed tags (Agriculture, Business,
Economics, Education, Environment, Media, Military, Naval) leave the `Trait`
union / `POSITIVE_TRAITS` / `TRACK_THEMED_TRAITS` and become expertise. Seeding
comes from the dataset rows (regenerated from the two author scripts) and from
inline scenario `Politician` factories; every factory site gains an `expertise`
array. Three forward-going gain triggers that map to systems that **already
exist** are wired in `phaseRunners.ts` (career-track exit, cabinet appointment,
committee-chair appointment) plus the 1772 Continental-Congress chair path; each
grant dedupes and writes an `addLog` line. The data lives in single-source
constant tables in `types.ts` (`EXPERTISE`, `TRACK_EXPERTISE`, `OFFICE_EXPERTISE`,
`COMMITTEE_EXPERTISE`); the one piece of logic — `addExpertise(p, tag)` — lives
in a tiny new `src/engine/expertise.ts` so `types.ts` stays data-only and the
helper is reused by every gain site. The Roster gets a read-only Expertise column
(and Draft-scouting a small inline addition); `repair()` initializes
`expertise = []` on legacy saves and strips the now-unknown 8 trait strings,
back-deriving expertise from them. PV is untouched.

**Idempotency (Q4): dedupe-on-insert, no sentinel.** `addExpertise` no-ops if the
tag is already present, which AC #13 requires of every gain path anyway; a
`expertiseSeeded` flag would be redundant state. Rejected the sentinel approach
for that reason.

**Alternative rejected: D3 Option B (additive / dual-list).** Leaving the 8 in
`Trait` and mapping them to expertise at load time avoids the dataset regen and
the legacy-save strip, but bakes in the exact tech debt PR1 exists to remove and
forces a future cleanup PR. Network to `raw.githubusercontent.com` is confirmed
reachable (HTTP 200), so the full regen is feasible and Option A is taken.

## State & type changes

### `src/types.ts`

**1. New `Expertise` union + `EXPERTISE` array** (insert immediately after the
`Trait`/`POSITIVE_TRAITS`/`NEGATIVE_TRAITS` block, ~line 160). Exactly 19 members
in spec order (AC #1, #2):

```ts
export type Expertise =
  | 'Agriculture' | 'Business' | 'Economics' | 'Education' | 'Energy'
  | 'Environment' | 'Foreign Affairs' | 'Healthcare' | 'Housing' | 'Justice'
  | 'Labor' | 'Media' | 'Military' | 'Naval' | 'Science' | 'Technology'
  | 'Trade' | 'Transportation' | 'Welfare';

export const EXPERTISE: Expertise[] = [
  'Agriculture','Business','Economics','Education','Energy','Environment',
  'Foreign Affairs','Healthcare','Housing','Justice','Labor','Media',
  'Military','Naval','Science','Technology','Trade','Transportation','Welfare',
];
```

**2. Remove the 8 from `Trait` and `POSITIVE_TRAITS`** (AC #6). Delete these
union members at `types.ts:77–86`: `'Education' | 'Economics' | 'Business' |
'Agriculture' | 'Environment' | 'Media'` and `'Naval'` (line 76) and `'Military'`
(line 86). Delete the same 8 string literals from `POSITIVE_TRAITS`
(`types.ts:124–134`: `'Naval','Education','Economics','Business','Agriculture',
'Environment','Media','Military'`). `NEGATIVE_TRAITS` is unaffected.

**3. Rewrite `TRACK_THEMED_TRAITS`** (AC #7, Q5 backfill) at `types.ts:173–181`.
Remove the 5 expertise names (`Business`, `Media`, `Agriculture`, `Economics`,
`Education`) and `Military`/`Naval`, then backfill each thinned pool to ≥2
era-appropriate members **drawn only from the surviving `Trait` union**:

```ts
export const TRACK_THEMED_TRAITS: Record<CareerTrack, Trait[]> = {
  Private: ['Celebrity', 'Propagandist', 'Orator'],      // was Celebrity, Business, Media
  Military: ['Crisis Manager', 'Leadership'],            // was Military, Naval, Crisis Manager
  Governing: ['Leadership', 'Charismatic', 'Harmonious'],// was Leadership, Charismatic, Agriculture
  Administration: ['Efficient', 'Egghead', 'Leadership'],// was Efficient, Economics, Education
  Legislative: ['Orator', 'Debater', 'Reformist'],       // unchanged
  Judicial: ['Integrity', 'Egghead', 'Harmonious'],      // unchanged
  Backroom: ['Manipulative', 'Kingmaker', 'Numberfudger'],// unchanged
};
```

Military's expertise now comes from the Military-track *expertise* grant
(`TRACK_EXPERTISE.Military = 'Military'`), so dropping `Military`/`Naval` from its
themed-trait pool is intended; the pool keeps 2 traits (Crisis Manager,
Leadership) so the AC's "no pool < 2 options" rule holds.

**4. New expertise-grant tables** (single source for the engine grants; insert
after `TRACK_THEMED_TRAITS`). `null` = no grant for PR1 (Q5/Q6 calls baked in):

```ts
// Career-track exit -> expertise (AC #14). Legislative/Backroom grant none.
export const TRACK_EXPERTISE: Record<CareerTrack, Expertise | null> = {
  Private: 'Business',
  Military: 'Military',
  Governing: 'Agriculture',
  Administration: 'Economics',
  Legislative: null,
  Judicial: 'Justice',
  Backroom: null,
};

// Cabinet / cabinet-level appointment -> expertise (AC #15). PMG/KeyAdvisor none.
export const OFFICE_EXPERTISE: Partial<Record<OfficeType, Expertise>> = {
  SecretaryOfState: 'Foreign Affairs',
  SecretaryOfTreasury: 'Economics',
  SecretaryOfWar: 'Military',
  AttorneyGeneral: 'Justice',
  GeneralInChief: 'Military',
  Admiral: 'Naval',
};

// Committee-chair appointment -> expertise (AC #16). Domestic -> Welfare (Q6).
export const COMMITTEE_EXPERTISE: Record<'Domestic' | 'Foreign' | 'Economic' | 'Justice', Expertise> = {
  Domestic: 'Welfare',
  Foreign: 'Foreign Affairs',
  Economic: 'Economics',
  Justice: 'Justice',
};
```

(`OFFICE_EXPERTISE` / `COMMITTEE_EXPERTISE` must be declared after `OfficeType` at
`types.ts:449–471`; place the whole expertise block there, or keep `EXPERTISE`/
`TRACK_EXPERTISE` near the trait tables and the office/committee maps after the
`OfficeType` declaration. Either ordering compiles; keep them adjacent for
readability.)

**5. `Politician.expertise`** (AC #4) — add to the interface at `types.ts:480–515`,
required:

```ts
expertise: Expertise[];
```

**6. `ImportedDraftee.expertise`** (AC #5) — add to the interface at
`types.ts:1001`:

```ts
expertise: Expertise[];
```

### Save / migration impact

A pre-PR1 IndexedDB save loads after `repair()` (`GameContext.tsx:91`) is
extended (see Engine changes → repair). Two effects: (a) every politician without
`expertise` is initialized to `[]`; (b) the 8 now-removed trait strings (e.g.
`'Economics'`) are stripped from `p.traits` and back-derived into `p.expertise`,
so a legacy Treasury type ends up with `expertise: ['Economics']` and no junk
trait. Without the strip, those strings are inert but would render in the Traits
column and widen the `Trait[]` array with values not in the union — the strip
keeps types honest. `dirty` is set so the repaired save is re-persisted.

The runtime JSON (`standard-draft-classes.json`) is cast `as ImportedDraftee[]`
with no per-row validation (`standardDraftClasses.ts:20`). A stale JSON fetched
before the regen ships would yield rows lacking `expertise`; `instantiateDraftees`
must default the field (`expertise: [...(d.expertise ?? [])]`) so a pre-fetch /
stale-cache draft never produces `expertise === undefined`. This satisfies AC #5
("defaults to `[]` when a row supplies none") and AC #10 (never undefined at
runtime).

## Engine changes (pure logic)

All deterministic over the snapshot; no `Math.random`. The recommended grants are
guaranteed-on-trigger (no RNG roll). Each grant that adds a *new* tag writes an
`addLog` line (AC #19).

### `src/engine/expertise.ts` — NEW MODULE

One tiny pure helper, reused by every gain site and by `repair()`'s
back-derivation. Returns whether a new tag was actually added (so callers can
gate their `addLog`):

```ts
import type { Politician, Expertise } from '../types';

// Dedupe-on-insert (AC #12, #13). Returns true iff a new tag was added.
export function addExpertise(p: Politician, tag: Expertise): boolean {
  if (p.expertise.includes(tag)) return false;
  p.expertise.push(tag);
  return true;
}
```

### `src/data/draftImport.ts` — draftee factory

- `instantiateDraftees` (line 238–258): add `expertise: [...(d.expertise ?? [])]`
  to the mapped object. This is the factory for every dataset-drafted politician
  and the single defensive default for stale/older JSON rows.

### `src/engine/phaseRunners.ts`

Add `addExpertise` to the engine imports (line 18 region) and pull
`TRACK_EXPERTISE`, `OFFICE_EXPERTISE` from types (line 2 import list). Three
insertion points:

**(a) Career-track exit — AC #14.** The single auto-clear of a maxed track is in
Pass 1 (CPU) at `phaseRunners.ts:378–382` (`careerTrackYears >=
CAREER_TRACK_MAX_YEARS` → `careerTrack = null`). Capture the track before clearing
and grant:

```ts
if (p.careerTrack && p.careerTrackYears >= CAREER_TRACK_MAX_YEARS) {
  const exiting = p.careerTrack;                 // capture before clearing
  const oldKey = slotKey(fid, p.careerTrack);
  trackCount.set(oldKey, (trackCount.get(oldKey) ?? 1) - 1);
  p.careerTrack = null;
  p.careerTrackYears = 0;
  const xp = TRACK_EXPERTISE[exiting];
  if (xp && addExpertise(p, xp)) {
    addLog(snap, '2.1.2', 'appointment', `${p.firstName} ${p.lastName} gains ${xp} expertise.`);
  }
  // ... existing age<60 bestAvailableTrack block unchanged ...
}
```

> NOTE — scope decision: the player's own maxed track is **never** auto-cleared
> in code (only the CPU exit at line 378 clears; the player keeps a maxed track
> until manual re-selection via `setPlayerCareerTrack`). The CC-acceptance reset
> at `firstContinentalCongress.ts:253` and the convention reset are *forced*
> resets, not the AC's "maxing-out" payoff. PR1 wires the grant at the
> AC-specified trigger (the line-378 maxed exit) **only**, which fires for CPU
> politicians. This matches AC #14's locked trigger point and the "CPU
> politicians accrue silently" edge case; player-side career-exit expertise is not
> reachable until a future PR gives the player a maxed-track exit. Do not add the
> grant to the CC/convention resets (that would be a different, non-AC trigger).

**(b) Cabinet / cabinet-level appointment — AC #15.** Two functions:

- `runPhase_2_3_1_Cabinet` (line 1918–1934): inside the `if (pick)` block after
  `snap.game.cabinet[pos] = pick.id`, add:
  ```ts
  const xp = OFFICE_EXPERTISE[pos as OfficeType];
  if (xp && addExpertise(pick, xp)) {
    addLog(snap, '2.3.1', 'appointment', `${pick.firstName} ${pick.lastName} gains ${xp} expertise.`);
  }
  ```
  `PostmasterGeneral`/`KeyAdvisor` are absent from `OFFICE_EXPERTISE`, so `xp` is
  `undefined` and nothing is granted (Q-call: none for PR1).
- `runPhase_2_3_2_Military` (line 1939–1958): in both the `GeneralInChief` and
  `Admiral` `if` blocks, after the office assignment, grant via
  `OFFICE_EXPERTISE['GeneralInChief']` (Military) / `OFFICE_EXPERTISE['Admiral']`
  (Naval) with the same `addExpertise` + `addLog` pattern, phase `'2.3.2'`.

  Re-appointment to the same post is a no-op because `addExpertise` dedupes
  (AC #13, the re-appointment edge case).

**(c) Committee-chair appointment — AC #16.** Two paths:

- 1856/general `runPhase_2_2_2_Committees` (line 1718–1725): inside the
  `if (candidate)` block after `snap.game.committeeChairs[c] = candidate.id`:
  ```ts
  const xp = COMMITTEE_EXPERTISE[c];
  if (addExpertise(candidate, xp)) {
    addLog(snap, '2.2.2', 'appointment', `${candidate.firstName} ${candidate.lastName} gains ${xp} expertise.`);
  }
  ```
- 1772 Continental-Congress chairs (`appointCCCommittees`,
  `continentalCongress.ts:151–164`): the CC committee taxonomy differs
  (`domestic`, `foreignMilitary`, `economic`, `judicial`). After each
  `cc.committeeChairs.X = pick?.id`, grant the corresponding expertise to that
  picked delegate: `domestic → Welfare`, `foreignMilitary → Foreign Affairs`,
  `economic → Economics`, `judicial → Justice`. Import `addExpertise` and (a
  literal or) `COMMITTEE_EXPERTISE` into `continentalCongress.ts`. Use the
  `pickByStat(...)` result directly (it returns the `Politician`), e.g.:
  ```ts
  const econ = pickByStat('admin');
  cc.committeeChairs.economic = econ?.id ?? null;
  if (econ && addExpertise(econ, 'Economics')) {
    addLog(snap, '2.2.2', 'appointment', `${econ.firstName} ${econ.lastName} gains Economics expertise.`);
  }
  ```
  (Map `foreignMilitary` → `'Foreign Affairs'`, `domestic` → `'Welfare'`,
  `judicial` → `'Justice'` the same way.)

**Deferred gains (AC #17, #18) — DO NOT WIRE.** Governor re-election has no clean
hook (`runPhase_2_9_5_Governors` vacates incumbents before the vote) and
ambassadorship has no appointment phase. Both are marked deferred; building them
is later-PR election machinery. No code.

### `src/data/politicians1772.ts` — scenario factories

- `buildPoliticians1772`, seeded branch (line 83–104): add `expertise:
  expertiseFromTraits(s.traits ?? [])` to the returned object (see helper note
  below); the seed rows' traits include the 8 (e.g. `Francis Marion` →
  `Military`, the `Naval` admirals), so back-deriving keeps them on the correct
  axis. Strip the migrated names from the `traits` array in the same expression.
- Filler branch (line 120–141): add `expertise: []` (filler only ever carries
  `'Obscure'`).

### `src/data/politicians1856.ts` — scenario factories

- `buildPoliticians1856` (line 117–138): add `expertise:
  expertiseFromTraits(seed.traits)` and strip migrated names from `traits`. The
  1856 seeds carry `Economics` (Cobb, Fessenden), `Education` (Everett),
  `Military`/`Naval`, etc.
- `buildFillerPoliticians` (line 162–183): add `expertise: []`.

**Migration helper for the inline seed factories.** Add a small shared helper
(e.g. in `src/data/draftImport.ts`, exported, since both scenario files already
import from `../types` and it is author-data plumbing — or inline a 4-line const
in each file). It splits a seed `Trait[]` into `{ traits, expertise }` by the
8-name set, so the same literal seed arrays migrate without hand-editing every
row:

```ts
const MIGRATED: Record<string, Expertise> = {
  Agriculture:'Agriculture', Business:'Business', Economics:'Economics',
  Education:'Education', Environment:'Environment', Media:'Media',
  Military:'Military', Naval:'Naval',
};
// seed arrays are typed Trait[] today but literally contain the 8 names;
// read them as string[] for the split.
export function splitSeedTraits(raw: string[]): { traits: Trait[]; expertise: Expertise[] } {
  const traits: Trait[] = [], expertise: Expertise[] = [];
  for (const t of raw) {
    const xp = MIGRATED[t];
    if (xp) { if (!expertise.includes(xp)) expertise.push(xp); }
    else traits.push(t as Trait);
  }
  return { traits, expertise };
}
```

Then in each factory: `const { traits, expertise } = splitSeedTraits(seed.traits
?? []);` and assign both. **Important typing detail:** once the 8 names leave the
`Trait` union, the seed literals (`traits: ['Military']`, `['Economics']`, …) in
`politicians1772.ts`/`politicians1856.ts` and in `seedDataset.mjs`-derived data
will *fail typecheck* if still typed `Trait[]`. Widen the seed-array element type
to `string` (the `Seed1772.traits` / `Seed1856.traits` field types at
`politicians1772.ts:12` and `politicians1856.ts:14`) so the raw arrays accept the
8 names, and let `splitSeedTraits` produce correctly-typed outputs. This is the
cleanest way to keep the historical seed literals intact while the union shrinks.

### `src/pages/draftScoutingHelpers.ts` — transient PV shape

- `computeProjectedPV` (line 5–25) builds a throwaway `Politician` to feed
  `computePV`. Add `expertise: [...d.expertise]` (or `expertise: []`) so the
  literal satisfies the now-required field. `DraftHistory.tsx:189` uses `...p`
  spread and needs no change.

### `src/state/GameContext.tsx` — `repair()` (AC #20, legacy strip)

Extend `repair()` (line 91–170). Add one pass over `s.politicians`:

```ts
// Expertise axis (PR1): init missing arrays + migrate the 8 legacy trait
// strings off old saves onto the expertise axis (D3 Option A).
const LEGACY_EXPERTISE: Record<string, Expertise> = {
  Agriculture:'Agriculture', Business:'Business', Economics:'Economics',
  Education:'Education', Environment:'Environment', Media:'Media',
  Military:'Military', Naval:'Naval',
};
for (const p of s.politicians) {
  if (p.expertise == null) { p.expertise = []; dirty = true; }
  // traits may carry now-unknown strings from a pre-PR1 save.
  const keptTraits: Trait[] = [];
  let changed = false;
  for (const t of p.traits as unknown as string[]) {
    const xp = LEGACY_EXPERTISE[t];
    if (xp) {
      changed = true;
      if (!p.expertise.includes(xp)) p.expertise.push(xp);
    } else {
      keptTraits.push(t as Trait);
    }
  }
  if (changed) { p.traits = keptTraits; dirty = true; }
}
```

Mirrors the defensive card-id filter at `GameContext.tsx:157–168` in spirit
(strip unknown values, set `dirty`). Import `Expertise`, `Trait` types as needed.
Under Option A no further legacy mapping is required (AC #21 is N/A for A).

## UI changes

### `src/pages/Roster.tsx` — Expertise column (AC #22, #23)

Add a column to the `columns` array, placed after the Traits column
(`Roster.tsx:43`), matching its render/sort exactly:

```tsx
{ key: 'expertise', label: 'Expertise', sortValue: (p) => p.expertise.join(','),
  render: (p) => <span className="text-xs">{p.expertise.slice(0, 2).join(', ')}</span> },
```

Read-only, no tooltip, empty array → blank cell (consistent with Traits). No
other Roster change.

### Draft scouting — inline expertise next to traits (AC #24, Q7: IN)

Q7 resolution: **IN** — it is a small inline addition. The scouting surface
renders skills/traits inline; locate the traits render (the component that shows
`d.traits` for a scouted draftee) and add expertise beside it as a comma-joined
`text-xs` span, e.g. `{d.expertise.join(', ')}`, only when non-empty. Confirm the
exact file/line at build time: search `Draft.tsx` and any `DraftScouting*`
component for where `.traits` is rendered for a draftee row, and mirror it. If the
scouting render turns out to read a `Politician` (not `ImportedDraftee`), it
already has `p.expertise`; if it reads the raw `ImportedDraftee`, the field is now
present too. No new component, no detail view.

## Dataset changes (author-time scripts + regen)

Per CLAUDE.md the generated artifacts are **never hand-edited** — edit the scripts
and regenerate. Both scripts must emit `expertise` and stop emitting the 8 as
traits.

### `scripts/seedDataset.mjs`

The `ROWS` / `ERA_ROWS` literals list the 8 inside each row's traits array (e.g.
`['Robert','Morris',...,['Economics'],'RED']`, `['Howell','Cobb',...,
['Economics'],'BLUE']`, `['Edward','Everett',...,['Orator','Education'],'BLUE']`,
the many `['Military']`/`['Naval']`). Two minimal changes — no need to re-author
the rows:

1. Add a split helper at the top:
   ```js
   const EXPERTISE_NAMES = new Set(['Agriculture','Business','Economics','Education','Environment','Media','Military','Naval']);
   const splitTraits = (arr) => {
     const traits = [], expertise = [];
     for (const t of arr) (EXPERTISE_NAMES.has(t) ? expertise : traits).push(t);
     return { traits, expertise: [...new Set(expertise)] };
   };
   ```
2. In the `CURATED_ROWS` normalization loop (line 211–222) and the `ERA_FIGURES`
   loop (line 227–235), replace `traits,` with the split:
   ```js
   const { traits: t2, expertise } = splitTraits(traits);
   CURATED_ROWS.push({ ...existing fields..., traits: t2, expertise, ... });
   ```
   (same for `ERA_FIGURES`).
3. The standalone CSV writer (line 238–249): add an `expertise` column to
   `header` (after `traits`) and `r.expertise.join('|')` to the row. Keep it
   parallel to the bulk script's CSV.

### `scripts/legislatorsToDataset.mjs`

The bulk heuristic (`record` line 61–115, `mkLoser` line 229–249) **never**
assigns any of the 8 names — `record` emits `traits: isExec ? ['Leadership'] :
[]` and `mkLoser` emits `traits: []`. So bulk rows only need `expertise: []`:

1. In `record`'s returned object (line 101–114) add `expertise: [],`.
2. In `mkLoser`'s returned object (line 235–248) add `expertise: [],`.
3. `CURATED_ROWS` / `ERA_FIGURES` already carry `expertise` (from the seedDataset
   change) — the overlay (line 267–270) and additive merge (line 288–298) pass
   them through unchanged.
4. JSON emit (line 311–312): `jsonList` currently strips only `party, wikiUrl,
   age`; `expertise` survives the `...keep` rest, so the runtime JSON gains the
   field automatically. **Verify** the destructure keeps it.
5. CSV emit (line 315–325): add `expertise` to `header` after `traits` and
   `r.expertise.join('|')` to each row.
6. Offline fallback emit (line 327–342): `fallback = CURATED_ROWS.map(({party,
   wikiUrl, ...keep}) => keep)` already keeps `expertise`; the generated
   `defaultDraftClasses.ts` will include it and must typecheck against the new
   `ImportedDraftee` (it will, since every curated row now has the field).

### Regen runbook (Option A, full regen)

Network to `raw.githubusercontent.com` is confirmed (HTTP 200), so run the full
pipeline:

```bash
bash scripts/fetchLegislators.sh          # downloads YAML + MEDSL CSVs into .legis/ (gitignored)
node scripts/legislatorsToDataset.mjs     # regenerates the 3 artifacts
npm run build                             # tsc -b && vite build must pass
```

Artifacts regenerated (commit all three):
- `public/standard-draft-classes.json` — full ~18.5k rows, runtime-loaded.
  **~4.2 MB; expect a large, mostly-noise diff** (every row gains
  `"expertise":[]`, the ~8 affected curated rows gain a populated array and lose a
  trait). This is expected and unavoidable for a regenerated asset; do not
  hand-trim it.
- `politicians-dataset.csv` — human-review mirror, **~2 MB; large diff** (new
  `expertise` column on every row).
- `src/data/defaultDraftClasses.ts` — small curated offline fallback; small,
  reviewable diff (the founders + marquee figures, now with `expertise`).

If `fetchLegislators.sh` fails for any reason, the fallback path is: run only
`node scripts/legislatorsToDataset.mjs` off an existing `.legis/` cache (the JSON
is runtime-loaded and nothing reads expertise yet, so a temporarily-stale full
JSON is tolerable) — but `defaultDraftClasses.ts` and the types **must** be
regenerated and consistent. Full regen is the intended path.

## Files to touch (exact, ordered)

New files marked **NEW**; all others modified.

1. `src/types.ts` — add `Expertise` union + `EXPERTISE`; remove 8 names from
   `Trait` + `POSITIVE_TRAITS`; rewrite `TRACK_THEMED_TRAITS`; add
   `TRACK_EXPERTISE` / `OFFICE_EXPERTISE` / `COMMITTEE_EXPERTISE`; add
   `expertise` to `Politician` and `ImportedDraftee`.
2. `src/engine/expertise.ts` — **NEW**. `addExpertise(p, tag)` dedupe helper.
3. `scripts/seedDataset.mjs` — split helper; `CURATED_ROWS`/`ERA_FIGURES` emit
   `{ traits, expertise }`; CSV gains `expertise` column.
4. `scripts/legislatorsToDataset.mjs` — `record`/`mkLoser` emit `expertise: []`;
   verify JSON/fallback keep the field; CSV gains `expertise` column.
5. `public/standard-draft-classes.json` — **REGENERATED** (~4.2 MB, large diff).
6. `politicians-dataset.csv` — **REGENERATED** (~2 MB, large diff).
7. `src/data/defaultDraftClasses.ts` — **REGENERATED** (small diff).
8. `src/data/draftImport.ts` — `instantiateDraftees` defaults+threads
   `expertise`; export `splitSeedTraits` helper used by the scenario factories.
9. `src/data/politicians1772.ts` — widen `Seed1772.traits` to `string[]`;
   seeded + filler factories set `expertise` (seeded via `splitSeedTraits`).
10. `src/data/politicians1856.ts` — widen `Seed1856.traits` to `string[]`;
    seeded + filler factories set `expertise` (seeded via `splitSeedTraits`).
11. `src/engine/phaseRunners.ts` — imports; career-exit grant (l.378), cabinet
    grant (`2_3_1`, `2_3_2`), committee-chair grant (`2_2_2`).
12. `src/engine/continentalCongress.ts` — `appointCCCommittees` grants chair
    expertise (imports `addExpertise`).
13. `src/pages/draftScoutingHelpers.ts` — transient PV shape adds `expertise`.
14. `src/state/GameContext.tsx` — `repair()` inits `expertise` + strips/migrates
    the 8 legacy trait strings.
15. `src/pages/Roster.tsx` — Expertise column.
16. Draft-scouting render (confirm exact file: `Draft.tsx` or a
    `DraftScouting*`/`draftScoutingHelpers` consumer) — inline expertise next to
    traits.

**File count delta:** 1 new code module (`expertise.ts`) + 13 modified code/data
files + 3 regenerated artifacts = **17 files** (excluding the brief). If the
Draft-scouting render lives in a file already in the list (`Draft.tsx` is not yet
listed; add it as #16 if so), adjust accordingly.

**Not touched (guardrails):** `src/pv.ts` (no PV change, AC #25); cabinet
eligibility / faction-ideology / lobby code (PR5/PR7, AC #26); `src/rng.ts`;
`src/phases.ts`; `firstContinentalCongress.ts` track-reset (out of scope per the
career-exit note); the CSV-import template `buildCsvTemplate` (user-CSV expertise
import is out of scope — the importer already ignores unknown columns, and
`parseDraftCsv` will emit `expertise: []` only if updated; **leave `parseDraftCsv`
defaulting `expertise: []`** so user-imported drafts still satisfy the required
field — add `expertise: []` to the `draftees.push({...})` object at
`draftImport.ts:206–217`).

> Correction to the list: `draftImport.ts` (file #8) also needs `expertise: []`
> added to `parseDraftCsv`'s pushed object (line 206–217) so user-CSV imports
> compile against the required field. No new UI column for CSV expertise in PR1.

## Test / verification plan

**Build / typecheck:** `npm run build` (`tsc -b && vite build`) must pass. The
union shrink is the typecheck tripwire — any lingering `'Economics'`/`'Military'`/
etc. typed as `Trait` (seed literals, dataset fallback, tests) surfaces here.
Confirm `defaultDraftClasses.ts` typechecks against the new `ImportedDraftee`.

**Dataset regen:** run the runbook; confirm the three artifacts regenerate, the
JSON parses, and a spot-check row (e.g. Robert Morris) shows `"expertise":
["Economics"]` and no `Economics` in `traits`.

**Playtest (per CLAUDE.md — `npm run dev`, exercise the feature):**

- **Fresh 1772 draft seeds expertise.** Start 1772, run the inaugural draft, open
  Roster: marquee figures show expertise (admirals → `Naval`, `Robert Morris` /
  treasury types → `Economics`); the Expertise column renders and sorts; a
  rookie with none shows a blank cell (AC #10, #22, #23, edge: empty).
- **Roster column.** Verify it sits after Traits, comma-joins the first ~2 tags,
  sorts by `expertise.join(',')`.
- **Draft-scouting surface.** Open the scouting view on a draftee with the 8
  migrated onto expertise; confirm expertise renders inline next to traits
  (AC #24/Q7).
- **CPU politicians accrue expertise (gain paths).** Advance multiple half-terms
  in 1772:
  - Cabinet: when a President seats Treasury/State/War/AG, confirm the appointee
    gains Economics/Foreign Affairs/Military/Justice (log line + Roster if it's a
    player politician; for CPU, verify via DevTools/save inspection) (AC #15).
  - Committee chairs: after `2.2.2`, confirm the four CC chairs (1772) / four
    committee chairs (1856) gained the mapped expertise (AC #16).
  - Career exit: let a CPU politician reach `careerTrackYears == 20` on a mapped
    track (Administration/Military/Governing/Judicial/Private) and confirm the
    exit grants the expertise with a `2.1.2` log line (AC #14). (Legislative /
    Backroom grant nothing.)
  - Dedupe: a politician who is both ex-Administration and Sec-Treasury ends with
    a single `Economics` (AC #13 / duplicate-grant edge).
- **Legacy save loads clean (legacy strip).** Load a pre-PR1 IndexedDB save (or a
  hand-built one with `traits: ['Economics','Military']` and no `expertise`).
  Confirm no crash, the politician now reads `expertise: ['Economics','Military']`
  with those strings gone from Traits, and the save re-persists (AC #20, the
  Option-A legacy edge).
- **1856 scenario.** Start 1856, open Roster: Cobb/Fessenden show `Economics`,
  Everett `Education`, the generals `Military`. Confirm the seed migration ran.
- **Themed-trait pools still mint.** Run several half-terms; confirm
  career-track themed-trait rolls still fire (no empty-pool no-ops for
  Private/Administration/Governing) and never mint the 8 as traits.

**Edge cases to verify manually (from the spec):** empty expertise (blank cell,
not error); duplicate-grant dedupe; re-appointment no-op; legacy save with the 8
traits; pre-fetch draft using the offline fallback (kill the network, start 1772,
confirm the inaugural draft still produces valid politicians with expertise).

## Risks

Ordered, highest first.

1. **Dataset regen produces a multi-MB diff and depends on an external download.**
   The JSON (~4.2 MB) and CSV (~2 MB) regenerate wholesale; reviewers see a huge
   diff that's almost entirely `"expertise":[]` noise. Mitigation: call it out in
   the PR description; verify a handful of curated rows by hand. If
   `fetchLegislators.sh` can't reach the sources at build time, the build still
   passes off the offline fallback, but the full JSON would be stale — acceptable
   for PR1 (nothing reads expertise yet) but must be re-run before any
   expertise-consuming PR.

2. **The `Trait` union shrink is a wide typecheck break.** Every literal that
   typed one of the 8 as a `Trait` breaks: the two scenario seed files, the
   regenerated `defaultDraftClasses.ts`, `parseDraftCsv`, and any test fixtures.
   Mitigation: widen the seed-array element type to `string` and route through
   `splitSeedTraits`; regenerate the fallback; the build is the gate — green build
   means every site is handled. This does **not** change a core election rule (PV
   is untouched), but it touches the draft seed data broadly.

3. **Career-exit grant only fires for CPU; player-side never triggers in PR1.**
   Because the player's maxed track isn't auto-cleared in code, the
   career-exit expertise (AC #14) is unreachable for the player's own politicians
   until a later PR adds a player maxed-exit. This is faithful to the locked
   trigger point but means a playtester watching only their own roster won't see
   career-exit expertise — verify via a CPU politician or save inspection.
   Documented so it isn't read as a bug.

4. **Migration must not double-count or drop tags.** `splitSeedTraits` /
   `repair()` back-derivation both dedupe; a seed row with `['Military','Naval']`
   must yield `expertise: ['Military','Naval']` and an empty/reduced `traits`.
   Mitigation: the dedupe in `addExpertise` and the `Set` in `splitTraits`/the
   `includes` guard cover it; the curated-row spot-check in the regen step
   confirms it on real data.

## Definition of Done

- `npm run build` passes (`tsc -b && vite build`).
- Dataset regenerated via the runbook; all three artifacts committed; a spot-check
  curated row shows populated `expertise` and the 8 removed from its `traits`.
- A fresh 1772 inaugural draft produces politicians whose `expertise` reflects
  their dataset rows; the Roster Expertise column renders, sorts, and blanks on
  empty.
- The three gain paths fire (career-track exit for CPU, cabinet appointment,
  committee-chair appointment in both the 1772 CC and 1856 committee systems),
  each writing an `addLog` line and deduping.
- A pre-PR1 IndexedDB save loads without error: `expertise` initialized and the 8
  legacy trait strings migrated onto the expertise axis and stripped from traits.
- `src/pv.ts` unchanged; no cabinet-eligibility / faction-ideology / lobby code
  touched.
- **Playtest** (per CLAUDE.md): `npm run dev`, start 1772, run the inaugural
  draft and confirm the Roster column; advance several half-terms and confirm a
  cabinet/committee appointment grants expertise; load a legacy save and confirm
  the strip.

---

**Checkpoint summary (for approval):**

- **Approach:** add `Expertise` (19 tags) as a required `expertise: Expertise[]`
  field on `Politician`/`ImportedDraftee`; full D3 Option-A migration of the 8
  mis-filed tags out of `Trait`/`POSITIVE_TRAITS`/`TRACK_THEMED_TRAITS`;
  single-source grant tables in `types.ts`; one `addExpertise` helper; three
  gain triggers in the engine; Roster + Draft-scouting read-only surfaces;
  `repair()` legacy strip; full dataset regen. PV untouched.
- **Files:** 17 (1 new `expertise.ts`, 13 modified code/data, 3 regenerated
  artifacts).
- **Q4–Q7 resolutions:** Q4 dedupe-on-insert (no sentinel); Q5 track map as
  recommended (Admin→Economics, Military→Military, Governing→Agriculture,
  Judicial→Justice, Private→Business, Legislative/Backroom→none) + themed-trait
  backfill (Private: Celebrity/Propagandist/Orator; Administration:
  Efficient/Egghead/Leadership; Governing: Leadership/Charismatic/Harmonious);
  Q6 Domestic→Welfare; Q7 Draft-scouting IN (small inline addition).
- **Top risk:** the dataset regen — a multi-MB JSON/CSV diff plus an external
  download dependency; the `Trait` union shrink is a wide (but build-gated)
  typecheck break.
- **Decided beyond the spec:** (a) career-exit grant fires only for CPU in PR1
  because the player's maxed track is never auto-cleared in code — wired at the
  one AC-specified trigger only; (b) `instantiateDraftees` and `parseDraftCsv`
  default `expertise: []` so stale JSON / user CSV imports satisfy the required
  field; (c) widen seed-array element types to `string` + a `splitSeedTraits`
  helper so historical seed literals migrate without re-authoring; (d) the 1772
  Continental-Congress chairs (distinct taxonomy) get the committee grant too, not
  just the 1856 committees.

**Brief file:** `/home/user/AMPU/docs/briefs/expertise-axis-foundation.md`
