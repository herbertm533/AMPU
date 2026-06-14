# Brief: Anytime Events (Phase 2.4.2 Redesign)

## Approach

Eighth 2.x activation. The 14-line `runPhase_2_4_2_Anytime` stub (phaseRunners.ts:2062-2075) is replaced wholesale with a two-pool runner: STEP 1 rolls one **national-flavor** event per turn (`nationalBaseFireChance: 0.70` × per-era `nationalFireMult`) from a 22-template pool that ticks `meters` / `interestGroups` / `partyPreference` / per-state `bias`; STEP 2 loops every alive non-retired non-dead politician at `baseFireChance: 0.05` × per-era `fireMult` against a 33-template **personal** pool that grants traits, bumps skills/command, sets `deathYear`/`retiredYear`, and stamps scandals scaled by `scandalMagnitudeMult`. A single `refreshPv` fires only if any politician's skills/command/traits changed in STEP 2 (mirrors the 2.4.1 end-of-runner pattern). Both pools log via the existing `addLog(snap, '2.4.2', 'event', text, { templateId, politicianId?, pool, category })` plumbing; the new `AnytimeEventsPage` reads `snap.events.filter((e) => e.phase === '2.4.2')` directly — no new snapshot fields. The Amendment-C scandal scaler is applied two ways: personal scandalScaled templates double-stamp `Corrupt` at `mult ≥ 1.0` and bump `flipFlopperPenalty += 5` at `mult ≥ 1.2`; national executive-scandal `meterTick`/`partyPref` deltas are multiplied at `applyNationalEffects` time. The shared cross-system cleanup (`cleanupLeadershipAndProtegeChains` at phaseRunners.ts:1955-1976) is REUSED for `death` and `forceRetire` effects via two new tiny wrappers `markPoliticianDead` / `markPoliticianRetired` so 2.4.1 stays the canonical source. The 1772 first-turn skip at phases.ts:113 is deleted; 2.4.2 fires turn 1 alongside 2.4.1. **Rejected**: (a) inlining the 33 + 22 templates into types.ts (templates are data, not state shape — they live in `src/data/`); (b) extending `EventEntry.category` with a new `'anytime'` value (the spec binds reuse of `'event'` with `meta.pool` discrimination — keeps EventLog's existing category filter intact); (c) adding a `Politician.lastAnytimeEventYear` field (no spec criterion needs it; cooldown / fatigue is explicit v2 per OQ #25).

## State & type changes

All changes confined to additions; **no existing field renames, no save migration required.**

### `src/types.ts` — additions

#### `ANYTIME_EVENTS_RULES` const (insert after `MORTALITY_RULES` ending at line 409)

```ts
export const ANYTIME_EVENTS_RULES = {
  // Per-politician annual fire chance. Historian's 3-8%/yr window; midpoint 5%.
  baseFireChance: 0.05,
  // [B] Per-turn national-flavor pool fire chance.
  nationalBaseFireChance: 0.70,

  eraConfig: {
    independence: { fireMult: 0.8, nationalFireMult: 0.9,  scandalMagnitudeMult: 0.5 },
    federalism:   { fireMult: 0.9, nationalFireMult: 0.95, scandalMagnitudeMult: 0.7 },
    nationalism:  { fireMult: 1.0, nationalFireMult: 1.0,  scandalMagnitudeMult: 1.0 },
    modern:       { fireMult: 1.1, nationalFireMult: 1.1,  scandalMagnitudeMult: 1.3 },
  } as const satisfies Record<Era, {
    fireMult: number;
    nationalFireMult: number;
    scandalMagnitudeMult: number;
  }>,

  // Caps and floors.
  skillCap: 5,            // mirrors CLAUDE.md domain: skills are 0-5
  commandCap: 5,          // mirrors KINGMAKER_RULES.commandCap
  pvHitFloor: -25,
  pvBumpCeil: 15,
  careerEndScandalShareOfScandalPool: 0.05,

  // [C] Meter/partyPreference clamps used by applyNationalEffects.
  meterClampLow: -5,
  meterClampHigh: 5,
  partyPreferenceClampLow: -5,
  partyPreferenceClampHigh: 5,
} as const;

export const ANYTIME_EVENTS_FEED_CAP = 500;
```

`satisfies Record<Era, ...>` exhaustiveness mirrors `LEADERSHIP_RULES.eraConfig` (types.ts:370) and `MORTALITY_RULES.eraConfig` (types.ts:405). `Era` is at types.ts:523 (verified). The const is referenced by `flipFlopperPenalty +=` math via the existing `LEADERSHIP_RULES.failedBidPvStamp = 5` constant at types.ts:341 — no new field for that pathway.

#### `Politician` / `Faction` / `GameState` / `EventEntry` / `Trait` — UNCHANGED

Confirmed against types.ts:
- `Politician.deathYear?`/`retiredYear?` at lines 460-461; `traits: Trait[]` at 463; `skills: Skills` at 462; `command: number` at 467; `flipFlopperPenalty: number` at 470; `pvCache: number` at 471; `factionLeaderOf?` at 476; `protegeId?` at 469; `bondedYear?` at 454.
- `GameState.meters: NationalMeters` at 728; `partyPreference: number` at 729; `interestGroups: InterestGroupScores` at 731.
- `NationalMeters` six-field struct (revenue, economic, military, domestic, honest, quality, planet) at 584-592; `MeterKey = keyof NationalMeters` at 594.
- `InterestGroupScores` is `Record<string, number>` (line 596-598) — free-form keys, matches current stub's use of `BigAg`, `Nationalists`, `Immigrants`, `Nativists` (phaseRunners.ts:2065-2068).
- `State.region` is the 10-member union (line 508); `State.bias: number` (line 510, no explicit -1..+1 type but used as such per existing election math).
- `EventEntry.category` already contains `'event'` (line 628); `meta?: Record<string, unknown>` at 630 — pool/templateId/politicianId go in there.
- `Trait` union at 62-108 already contains every trait the personal pool grants: `Frail`, `Scandalous`, `Corrupt`, `Controversial`, `Unlikable`, `Orator`, `Charismatic`, `Crisis Manager`. **No new trait literals.**

#### New `PageId: 'anytimeEvents'` (added to registry, not types.ts)

The `PageId` union lives in `src/pages/registry.ts:32-62`, not types.ts. New entry appended.

### `src/data/anytimeEvents.ts` — NEW FILE (personal-pool templates + types)

Exports `AnytimeEventTemplate`, `AnytimeEventEffect`, `ANYTIME_EVENT_TEMPLATES` (33 entries).

```ts
import type { Era, State, Trait, SkillKey } from '../types';

export interface AnytimeEventTemplate {
  id: string;
  category:
    | 'illness-acute' | 'illness-chronic' | 'illness-epidemic'
    | 'injury' | 'transport-accident'
    | 'violence-duel' | 'violence-assault' | 'violence-assassination'
    | 'scandal-financial' | 'scandal-sexual' | 'scandal-verbal'
    | 'breakthrough-speech' | 'breakthrough-crisis'
    | 'family-event' | 'financial-event' | 'war-service';
  eras?: Era[];
  regions?: State['region'][];
  weight: number;
  eraWeightMult?: Partial<Record<Era, number>>;
  scandalScaled?: boolean;
  effects: AnytimeEventEffect[];
  text: string; // supports {first} {last} {state}
}

export type AnytimeEventEffect =
  | { kind: 'grantTrait';  trait: Trait }
  | { kind: 'pvHit';        amount: number }
  | { kind: 'pvBump';       amount: number }
  | { kind: 'skillBump';    skill: SkillKey; amount: number }
  | { kind: 'commandBump';  amount: number }
  | { kind: 'death' }
  | { kind: 'forceRetire' };

export const ANYTIME_EVENT_TEMPLATES: AnytimeEventTemplate[] = [
  // 33 entries per spec §1.3 table; categories distributed:
  //   illness-acute 3, illness-chronic 3, illness-epidemic 4, injury 2,
  //   transport-accident 5, violence-duel 2, violence-assault 1,
  //   violence-assassination 2, scandal-financial 3, scandal-sexual 2,
  //   scandal-verbal 1, breakthrough-speech 1, breakthrough-crisis 1,
  //   family-event 1, financial-event 1, war-service 1.
  // All 6 scandal-* templates set scandalScaled: true.
  // Era + region tags enforced by spec §1.3 / historian binding facts 1, 5, 8.
];
```

### `src/data/anytimeNationalEvents.ts` — NEW FILE (national-pool templates + types)

Exports `AnytimeNationalTemplate`, `AnytimeNationalEffect`, `ANYTIME_NATIONAL_TEMPLATES` (22 entries).

```ts
import type { Era, State, MeterKey } from '../types';

export interface AnytimeNationalTemplate {
  id: string;
  category:
    | 'economic-panic' | 'economic-boom' | 'economic-harvest'
    | 'economic-currency' | 'economic-tariff' | 'economic-commodity'
    | 'demographic-immigration' | 'demographic-migration'
    | 'demographic-urbanization' | 'demographic-frontier'
    | 'foreign-trade' | 'foreign-war-scare' | 'foreign-treaty'
    | 'foreign-ally-shift'
    | 'civic-state-ripple' | 'civic-executive-scandal' | 'civic-patriotic-groundswell'
    | 'cultural-revival' | 'cultural-reform' | 'cultural-technology'
    | 'natural-storm' | 'natural-epidemic';
  eras?: Era[];
  regions?: State['region'][];
  weight: number;
  eraWeightMult?: Partial<Record<Era, number>>;
  scandalScaled?: boolean;
  effects: AnytimeNationalEffect[];
  text: string; // supports {era} {region}
}

export type AnytimeNationalEffect =
  | { kind: 'meterTick';    meter: MeterKey; amount: number }
  | { kind: 'interestTick'; group: string;    amount: number }
  | { kind: 'partyPref';     amount: number }
  | { kind: 'stateBias';     amount: number };

export const ANYTIME_NATIONAL_TEMPLATES: AnytimeNationalTemplate[] = [
  // 22 entries per spec §1.4 table. The 5 current-stub events become 5
  // named seeds with stable ids:
  //   national:bumper-harvest, national:railroad-accident,
  //   national:patriotic-groundswell, national:immigration-wave,
  //   national:treasury-scandal.
  // Categories distributed across economic / demographic / foreign /
  // civic / cultural / natural per spec §1.4. Two scandalScaled
  // templates only: national:treasury-scandal + the generic
  // civic-executive-scandal entry.
];
```

### `AnytimeEventInstance` — not a distinct type

The spec binds reuse of `EventEntry` with discriminating `meta`. The "instance" is the existing `EventEntry`; no new interface in `types.ts`. The page reads it inline:

```ts
interface AnytimeEventMeta {
  templateId: string;
  politicianId?: string;
  pool: 'personal' | 'national';
  category: string;
}
```

The page narrows `e.meta` via a local helper; no exported type leaks elsewhere.

### Save / migration impact

**No save migration required.** Zero new fields on `Politician` / `Faction` / `GameState`. Legacy saves load unchanged. The new runner is purely additive on next tick (the 14-line stub's 5 events are absorbed into the national pool as the 5 named seeds with identical effect shapes — playthrough flavor continuity is preserved). No `repair()` changes. No `db.ts` migration.

## Engine vs UI split

**Engine** (pure, deterministic over `snap`; uses only `chance`, `pickWeighted`, `clamp` from `src/rng.ts`):
- `phases.ts:113` — delete one line (the first-turn skip).
- `phaseRunners.ts:2062-2075` — replace `runPhase_2_4_2_Anytime` body wholesale.
- `phaseRunners.ts` imports — add `pickWeighted` to the `'../rng'` import (verified absent at phaseRunners.ts:4); add `ANYTIME_EVENTS_RULES` to the `'../types'` import (line 2); import `ANYTIME_EVENT_TEMPLATES` from `'../data/anytimeEvents'` and `ANYTIME_NATIONAL_TEMPLATES` from `'../data/anytimeNationalEvents'`.
- `phaseRunners.ts` — extract two thin wrappers `markPoliticianDead(snap, p)` / `markPoliticianRetired(snap, p)` that call `cleanupLeadershipAndProtegeChains` + `vacateOffice` (mirror the existing 2.4.1 transition order). Refactor `runPhase_2_4_1_Deaths` to call these wrappers (NO behavior change to 2.4.1).
- `phaseRunners.ts` — add `applyNationalEffects(snap, tpl, cfg)` helper alongside the runner.
- `phaseRunners.ts` — add `validateAnytimeTemplates()` dev-only helper called once at runner-start (idempotent guard so the dev-mode throw doesn't repeat 100×/turn; module-level flag).

**UI** (no `GameContext` mutators added; pure read-only page):
- `src/pages/AnytimeEventsPage.tsx` — NEW page. Filter row + scrollable feed. Component-local `useState` only.
- `src/pages/registry.ts` — add `'anytimeEvents'` to `PageId` union and `Pages` record.
- `src/components/Sidebar.tsx` — add `{ id: 'anytimeEvents', label: 'Anytime Events' }` to the `Events` group at line 76-81 (third item after Event Log + War Dashboard).

**Autosave** — confirmed via `src/state/GameContext.tsx:77` (every state-mutating helper calls `saveSnapshot(s)` then `setSnapshot`). The phase-advance pipe already persists; no special-casing needed for 2.4.2.

## Files to touch (exact, ordered)

### CREATE

1. **`src/data/anytimeEvents.ts`** — personal-pool types (`AnytimeEventTemplate`, `AnytimeEventEffect`) and the 33-template `ANYTIME_EVENT_TEMPLATES` array. Authoring scope per spec §1.3 table + §2 carve-out + historian binding facts 1, 5, 6, 8 + Amendment C `scandalScaled: true` on all 6 scandal templates.
2. **`src/data/anytimeNationalEvents.ts`** — national-pool types (`AnytimeNationalTemplate`, `AnytimeNationalEffect`) and the 22-template `ANYTIME_NATIONAL_TEMPLATES` array. Authoring scope per spec §1.4 table + Amendment B (5 stub seeds preserved by id) + Amendment C `scandalScaled: true` on the 2 executive-scandal templates.
3. **`src/pages/AnytimeEventsPage.tsx`** — read-only feed page; 4-axis filter row (Pool / Era / Category / Faction) + Show-retired toggle + per-politician drill-down + effect chips.

### MODIFY

4. **`src/types.ts`** — append `ANYTIME_EVENTS_RULES` const + `ANYTIME_EVENTS_FEED_CAP` constant after `MORTALITY_RULES` (line 409). No type changes to `Politician`/`Faction`/`GameState`/`Trait`/`EventEntry`.
5. **`src/phases.ts`** — delete line 113 (the `if (phaseId === '2.4.2') return false;` first-turn skip per Amendment A). Surrounding `isFirstTurn` block is left intact (keeps 2.1.3, 2.5.1, 2.6.x, 2.7.x, 2.2.1/2 skips).
6. **`src/engine/phaseRunners.ts`** — (a) add `ANYTIME_EVENTS_RULES` to the types import at line 2; (b) add `pickWeighted` to the rng import at line 4; (c) add new imports for `ANYTIME_EVENT_TEMPLATES`, `ANYTIME_NATIONAL_TEMPLATES`, the two template-type imports for the helper signature; (d) add `markPoliticianDead` / `markPoliticianRetired` wrappers above `runPhase_2_4_1_Deaths` (near the existing `cleanupLeadershipAndProtegeChains` at line 1955); (e) refactor 2.4.1 to call the wrappers (lines 2005-2018) — NO behavior change; (f) add `applyNationalEffects` helper; (g) add `validateAnytimeTemplates` dev-only guard (module-level boolean to prevent re-running); (h) replace `runPhase_2_4_2_Anytime` body wholesale (lines 2062-2075).
7. **`src/pages/registry.ts`** — append `'anytimeEvents'` to `PageId` union (line 32-62) and the `Pages` record (line 64-95). Import `AnytimeEventsPage` at top.
8. **`src/components/Sidebar.tsx`** — insert `{ id: 'anytimeEvents', label: 'Anytime Events' }` in the Events `items` array at line 76-81, third position.

### READ-ONLY REFERENCE (no edits, just to ground the builder)

- `src/engine/log.ts` (existing `addLog` signature — no change needed; `meta?: Record<string, unknown>` accepts the new `pool` / `templateId` / `politicianId` / `category` payload as-is).
- `src/pv.ts` (existing `refreshPv(politicians: Politician[]): Politician[]` signature — runner must assign result back: `snap.politicians = refreshPv(snap.politicians)`, matching 2.4.1's pattern at phaseRunners.ts:2022).
- `src/rng.ts` (existing `pickWeighted({ value, weight }[])` signature — pool draws use the shape `nationalPool.map((t) => ({ value: t, weight: t.weight * (t.eraWeightMult?.[era] ?? 1) }))`).
- `src/types.ts:341` (existing `LEADERSHIP_RULES.failedBidPvStamp = 5` — Amendment C reuses this for `flipFlopperPenalty +=` at multiplier ≥ 1.2; the runner imports `LEADERSHIP_RULES`, already in scope per line 2).
- `src/engine/phaseRunners.ts:1955-1976` (existing `cleanupLeadershipAndProtegeChains`) and lines 2025-2057 (existing `vacateOffice`) — REUSED by the two new wrappers; no edits to these functions.

## Constants module location

**Decision: keep `ANYTIME_EVENTS_RULES` in `src/types.ts`**, not a new `src/engine/anytimeConstants.ts`. Rationale:
- Mirrors the established pattern: `MORTALITY_RULES`, `LEADERSHIP_RULES`, `KINGMAKER_RULES`, `ALIGNMENT_RULES`, `CONVERSION_ODDS`, `IDEOLOGY_SHIFT_ODDS`, `RELOCATION_ODDS`, `TRACK_THEMED_TRAITS`, `CAREER_RANDOM_NEGATIVES` — every per-phase constant block lives in types.ts.
- `satisfies Record<Era, ...>` exhaustiveness exercise is already a types.ts idiom — keeps adding a new era cheaply enforced in one place.
- The runner pulls a single named import from `'../types'`; no proliferation of engine-side const modules.
- The two data files (`src/data/anytimeEvents.ts`, `src/data/anytimeNationalEvents.ts`) host the **templates** — templates are data, not engine constants. The constants block (per-era multipliers, clamp bounds, fire chances) belongs with the type definitions because it shapes the engine's contract with the data files.

## Runner pseudocode (TypeScript signatures, binding)

### Entry function

```ts
export function runPhase_2_4_2_Anytime(snap: FullGameSnapshot): void {
  if (import.meta.env.DEV) validateAnytimeTemplates();
  const era = snap.game.currentEra;
  const cfg = ANYTIME_EVENTS_RULES.eraConfig[era];

  // [B] STEP 1 — National-flavor roll (single per-turn).
  rollNationalEvent(snap, era, cfg);

  // STEP 2 — Per-politician personal-events loop.
  const mutatedAny = rollPersonalEvents(snap, era, cfg);

  // [Cross-system] Single end-of-runner PV recompute if any politician
  // skill/trait/command changed. National-only turns skip this.
  if (mutatedAny) snap.politicians = refreshPv(snap.politicians);
}
```

### National roller

```ts
function rollNationalEvent(
  snap: FullGameSnapshot,
  era: Era,
  cfg: typeof ANYTIME_EVENTS_RULES.eraConfig[Era],
): void {
  const fireChance = ANYTIME_EVENTS_RULES.nationalBaseFireChance * cfg.nationalFireMult;
  if (!chance(fireChance)) return;

  const eligible = ANYTIME_NATIONAL_TEMPLATES.filter((t) => !t.eras || t.eras.includes(era));
  if (eligible.length === 0) return;

  const tpl = pickWeighted(eligible.map((t) => ({
    value: t,
    weight: t.weight * (t.eraWeightMult?.[era] ?? 1),
  })));

  applyNationalEffects(snap, tpl, cfg);

  const text = tpl.text
    .replace('{era}', era)
    .replace('{region}', tpl.regions?.join('/') ?? 'the country');

  addLog(snap, '2.4.2', 'event', text, {
    templateId: tpl.id,
    pool: 'national',
    category: tpl.category,
  });
}
```

### Personal roller

```ts
function rollPersonalEvents(
  snap: FullGameSnapshot,
  era: Era,
  cfg: typeof ANYTIME_EVENTS_RULES.eraConfig[Era],
): boolean {
  const fireChance = ANYTIME_EVENTS_RULES.baseFireChance * cfg.fireMult;
  let mutated = false;

  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (!chance(fireChance)) continue;

    const region = snap.states.find((s) => s.id === p.state)?.region;
    const pool = ANYTIME_EVENT_TEMPLATES.filter((t) => {
      if (t.eras && !t.eras.includes(era)) return false;
      if (t.regions && (!region || !t.regions.includes(region))) return false;
      return true;
    });
    if (pool.length === 0) continue;

    const tpl = pickWeighted(pool.map((t) => ({
      value: t,
      weight: t.weight * (t.eraWeightMult?.[era] ?? 1),
    })));

    let didMutate = false;
    for (const eff of tpl.effects) {
      switch (eff.kind) {
        case 'grantTrait':
          if (!p.traits.includes(eff.trait)) {
            p.traits.push(eff.trait);
            didMutate = true;
          }
          break;
        case 'skillBump':
          if (p.skills[eff.skill] < ANYTIME_EVENTS_RULES.skillCap) {
            p.skills[eff.skill] = clamp(
              p.skills[eff.skill] + eff.amount, 0, ANYTIME_EVENTS_RULES.skillCap,
            );
            didMutate = true;
          }
          break;
        case 'commandBump':
          if (p.command < ANYTIME_EVENTS_RULES.commandCap) {
            p.command = clamp(
              p.command + eff.amount, 0, ANYTIME_EVENTS_RULES.commandCap,
            );
            didMutate = true;
          }
          break;
        case 'death':
          p.deathYear = snap.game.year;
          markPoliticianDead(snap, p);
          didMutate = true;
          break;
        case 'forceRetire':
          p.retiredYear = snap.game.year;
          markPoliticianRetired(snap, p);
          didMutate = true;
          break;
        case 'pvHit':
        case 'pvBump':
          // Informational only; no direct pvCache write. Trait/skill/command
          // effects in the same template carry the real delta. The amount
          // is preserved in feed meta for UI display.
          break;
      }
    }

    // [C] Amendment C scandal scaling.
    if (tpl.scandalScaled) {
      const mult = cfg.scandalMagnitudeMult;
      if (mult >= 1.0 && !p.traits.includes('Corrupt')) {
        p.traits.push('Corrupt');
        didMutate = true;
      }
      if (mult >= 1.2) {
        p.flipFlopperPenalty += LEADERSHIP_RULES.failedBidPvStamp;
        didMutate = true;
      }
    }

    if (didMutate) mutated = true;

    const text = tpl.text
      .replace('{first}', p.firstName)
      .replace('{last}', p.lastName)
      .replace('{state}', p.state.toUpperCase());

    addLog(snap, '2.4.2', 'event', text, {
      templateId: tpl.id,
      politicianId: p.id,
      pool: 'personal',
      category: tpl.category,
      pvDelta: tpl.effects.find((e) => e.kind === 'pvHit' || e.kind === 'pvBump')?.amount,
    });
  }

  return mutated;
}
```

### National effects applier

```ts
function applyNationalEffects(
  snap: FullGameSnapshot,
  tpl: AnytimeNationalTemplate,
  cfg: typeof ANYTIME_EVENTS_RULES.eraConfig[Era],
): void {
  // [C] Scandal-magnitude scaler applies only to meterTick + partyPref effects.
  const scandalMult = tpl.scandalScaled ? cfg.scandalMagnitudeMult : 1;
  for (const eff of tpl.effects) {
    switch (eff.kind) {
      case 'meterTick': {
        snap.game.meters[eff.meter] = clamp(
          snap.game.meters[eff.meter] + eff.amount * scandalMult,
          ANYTIME_EVENTS_RULES.meterClampLow,
          ANYTIME_EVENTS_RULES.meterClampHigh,
        );
        break;
      }
      case 'interestTick': {
        // Uncapped (matches current stub + existing engine convention).
        snap.game.interestGroups[eff.group] =
          (snap.game.interestGroups[eff.group] ?? 0) + eff.amount;
        break;
      }
      case 'partyPref': {
        snap.game.partyPreference = clamp(
          snap.game.partyPreference + eff.amount * scandalMult,
          ANYTIME_EVENTS_RULES.partyPreferenceClampLow,
          ANYTIME_EVENTS_RULES.partyPreferenceClampHigh,
        );
        break;
      }
      case 'stateBias': {
        if (!tpl.regions) break;
        for (const s of snap.states) {
          if (tpl.regions.includes(s.region)) {
            s.bias = clamp(s.bias + eff.amount, -1, 1);
          }
        }
        break;
      }
    }
  }
}
```

### Shared cross-system cleanup wrappers (placed near phaseRunners.ts:1955)

```ts
// Shared by 2.4.1 (deaths/retirements) and 2.4.2 (anytime-events death/forceRetire).
// Closes the 1-turn window between death/retire and the next leadership /
// kingmaker validation sweep (matches the existing 2.4.1 pattern).
function markPoliticianDead(snap: FullGameSnapshot, p: Politician): void {
  cleanupLeadershipAndProtegeChains(snap, p);
  vacateOffice(snap, p);
}

function markPoliticianRetired(snap: FullGameSnapshot, p: Politician): void {
  cleanupLeadershipAndProtegeChains(snap, p);
  vacateOffice(snap, p);
}
```

**2.4.1 refactor (no behavior change):** in `runPhase_2_4_1_Deaths` (phaseRunners.ts:1997-2020), replace the two inline `cleanupLeadershipAndProtegeChains(snap, p); addLog(...); vacateOffice(snap, p);` sequences (lines 2007-2009 and 2016-2018) with `addLog(...); markPoliticianDead(snap, p);` and `addLog(...); markPoliticianRetired(snap, p);` respectively. The transition order — set deathYear/retiredYear → addLog → markPolitician* — is preserved. The `addLog` call must remain before the wrapper to keep the feed-line-before-state-settles invariant per the deaths-retirements brief's binding order rationale.

### Dev-only template validator

```ts
let anytimeValidatorRan = false;

function validateAnytimeTemplates(): void {
  if (anytimeValidatorRan) return;
  anytimeValidatorRan = true;
  // [Personal pool carve-out enforcement — spec §2 binding list]
  const FORBIDDEN_TRAITS: Trait[] = [
    'Ideologue', 'Impressionable', 'Flip-Flopper',         // 2.1.5
    'Loyal', 'Opportunist',                                 // 2.1.6
    'Carpetbagger', 'Outsider',                             // 2.1.4
    'Ambitious', 'Failed Bid',                              // 2.2.3
    'Kingmaker', 'Manipulative', 'Numberfudger',
    'Leadership', 'Debater', 'Reformist', 'Integrity',
    'Efficient', 'Magician', 'Harmonious', 'Egghead',
    'Propagandist',                                         // TRACK_THEMED
    'Naval', 'Military', 'Education', 'Economics', 'Business',
    'Agriculture', 'Environment', 'Media', 'Nationalist',
    'Globalist', 'Celebrity',                               // background
    'Traitor', 'Obscure', 'Puritan',                        // out per §2
  ];
  // [Skill carve-out — only legislative and governing allowed via skillBump]
  const FORBIDDEN_SKILLS: SkillKey[] = ['admin', 'judicial', 'military', 'backroom'];
  // Iterate ANYTIME_EVENT_TEMPLATES asserting:
  //   (a) no grantTrait effect uses a forbidden trait
  //   (b) no skillBump effect targets a forbidden skill
  //   (c) every scandal-* category template has scandalScaled: true
  //   (d) no scandalScaled: true template lives in a non-scandal category
  //   (e) every pvHit/pvBump effect has a trait/skill/command sibling effect
  //   (f) anachronism spot-checks: no eras:['independence'] template with
  //       transport-accident category whose text mentions 'auto'/'train'/'plane'/'rail';
  //       no eras:['independence'] template with illness-epidemic mentioning polio/flu;
  //       no eras:['modern'] template with violence-duel category;
  //       no eras:['modern'] template with illness-epidemic mentioning yellow fever/cholera.
  // Iterate ANYTIME_NATIONAL_TEMPLATES asserting:
  //   (g) no cultural-technology template with eras:['independence'] mentions
  //       'telegraph'/'radio'/'TV'/'internet'/'automobile'/'plane'/'railroad'
  //   (h) no natural-epidemic template with eras:['independence'] mentions
  //       'polio'/'1918 flu'/'modern pandemic'
  //   (i) no economic-panic template with eras:['independence']
  //   (j) only national:treasury-scandal + the generic civic-executive-scandal
  //       have scandalScaled: true; no other national templates set the flag
  //   (k) all 5 stub-seed ids exist:
  //       'national:bumper-harvest', 'national:railroad-accident',
  //       'national:patriotic-groundswell', 'national:immigration-wave',
  //       'national:treasury-scandal'
  // Throws Error in dev; silent in prod (caught at runtime since this only
  // runs when import.meta.env.DEV is true).
}
```

The validator's module-level `anytimeValidatorRan` flag guards against re-running 100×/turn during a long playtest (cheap one-shot at first runner call after page load / hot reload).

## UI page (`AnytimeEventsPage.tsx`) — binding shape

Read-only; mirrors `EventLog.tsx` filter pattern + adds 4 dropdowns and effect-chip rendering.

### Props / state

- Component-local `useState` for: `pool: 'all' | 'personal' | 'national'` (default `'all'`); `era: Era | 'all'` (default current); `category: string` (default `'all'`); `factionMode: 'all' | 'mine'` (default `'mine'`); `showRetired: boolean` (default `false`); `politicianFilter: string | null` (default `null`, set by clicking a name in the feed).

### Data sources

- `snap.events.filter((e) => e.phase === '2.4.2')` — the primary feed.
- `snap.politicians` — for name / age / state / ideology / factionId lookup by `meta.politicianId`.
- `snap.game.currentEra`, `snap.game.year`, `snap.game.startYear`, `snap.game.playerFactionId`.

### Year-to-era mapping

Each event's era is its `year` mapped to the era buckets. The page uses a small inline helper:

```ts
function eraForYear(year: number): Era {
  if (year < 1789) return 'independence';
  if (year < 1830) return 'federalism';
  if (year < 1933) return 'nationalism';
  return 'modern';
}
```

These breakpoints match the era seams used by `1772` and `1856` scenario configs. Architect call: inline rather than promoted to types.ts — the page is the only consumer; promoting would force a new `src/data/eraBoundaries.ts` for a 4-line lookup. **Disposition flagged** in Risks if the value reused elsewhere later (in which case a follow-up PR can promote).

### Sections

1. **Header.** `<h2>Anytime Events — {N} events</h2>`. Cross-link buttons to `Event Log` and `Roster` (via `useGame()`'s page navigation — not currently exported; the page uses direct `onClick` button styling consistent with other pages; navigation works via the sidebar).
2. **Filter row.** Pool / Era / Category / Faction dropdowns + `Show retired/dead` checkbox. Native `<select>` per Kingmakers / EventLog patterns. Category dropdown's options narrow by Pool: when Pool is `personal`, the 16 personal categories show; when `national`, the 22 national categories; when `all`, both (~38 entries grouped via `<optgroup>` Personal / National).
3. **Per-politician summary card** — rendered when `politicianFilter !== null`. Reads `snap.politicians.find((p) => p.id === politicianFilter)`. Shows name, age, state, ideology, current factionId, and count of personal-pool events for them. `[Clear]` button.
4. **Feed.** `<div className="max-h-[70vh] overflow-y-auto ...">` matching EventLog.tsx:23. Year-desc rows. Each row:
   - `[YEAR]` chip (tabular-nums).
   - `pool` chip: `Personal` (rose) or `National` (slate). For National, prefix with globe glyph (CSS pseudo or inline SVG); for Personal, the politician name is the row anchor and clicking sets `politicianFilter`.
   - Category badge: color-coded by family — illness=amber, scandal=rose, breakthrough=emerald, violence=red, transport-accident=slate, family/financial=stone, war-service=indigo; for national: economic=indigo, demographic=teal, foreign=violet, civic=blue, cultural=pink, natural=orange.
   - Event text (substituted server-side at runner-time; the page renders verbatim).
   - Effect chips derived from `templateId` lookup: builder must build a small `getTemplateById(id)` helper that searches both `ANYTIME_EVENT_TEMPLATES` and `ANYTIME_NATIONAL_TEMPLATES`; effects array iterates to chips (`+Trait`, `+1 legislative`, `+1 command`, `economic -1`, `+2 Workers`, `partyPref -0.3`, `South bias -0.1`).
5. **Empty state.** "No anytime events match these filters." prompt when filtered list length is 0.

### Filter logic

```ts
const filtered = snap.events.filter((e) => {
  if (e.phase !== '2.4.2') return false;
  const meta = (e.meta ?? {}) as Partial<AnytimeEventMeta>;
  if (pool !== 'all' && meta.pool !== pool) return false;
  if (era !== 'all' && eraForYear(e.year) !== era) return false;
  if (category !== 'all' && meta.category !== category) return false;
  if (politicianFilter && meta.politicianId !== politicianFilter) return false;
  if (factionMode === 'mine' && meta.pool === 'personal') {
    const p = snap.politicians.find((pp) => pp.id === meta.politicianId);
    if (!p || p.factionId !== snap.game.playerFactionId) return false;
  }
  // National events are always included regardless of faction filter (spec).
  if (!showRetired && meta.pool === 'personal' && meta.politicianId) {
    const p = snap.politicians.find((pp) => pp.id === meta.politicianId);
    if (p && (p.deathYear || p.retiredYear)) return false;
  }
  return true;
});
```

### Pure read-only

No GameContext mutators added. No buttons trigger phase advance. No sidebar auto-nav prompt. Matches the FactionAlignments / FactionLeader / Roster precedent.

## Test plan

Acceptance criteria from spec §Acceptance (numbered #1-#36).

### Build / typecheck (auto-verifiable)

- **`npm run lint` (tsc --noEmit)** verifies the `satisfies Record<Era, ...>` exhaustiveness in `ANYTIME_EVENTS_RULES.eraConfig` (#1). Missing an era is a compile error.
- **`npm run build`** verifies (a) the new data file exports compile and shape-conform to their template interfaces (#4, #4b, #4c); (b) the runner's `pickWeighted({ value, weight })` shape matches `rng.ts:21`; (c) the new `PageId` union value in registry.ts compiles into `Sidebar.tsx`'s `NavItem.id` typing.

These together satisfy criteria #1, #2, #3, #4, #4b, #4c, #9, #9b, #10-#22 implicitly (any deviation from the runner-signature shape breaks the type system).

### Determinism (manual)

Start a fresh 1772 scenario; advance 10 turns; note all 2.4.2 feed entries (template ids + politician ids + years). Restart with identical seed; advance 10 turns; entries should match exactly. **Caveat**: `src/rng.ts:5` currently uses `Math.random` (no seeded RNG plumbed yet — CLAUDE.md flags this as an aspiration). Determinism check is per-process; reload won't reproduce. The runner is structurally deterministic given `rand()` — the moment a seeded RNG is wired in, the runner picks it up automatically through `chance` / `pickWeighted`.

### Playtest — 1772 turn 1 first-turn-skip removal (criterion #21, #32)

1. Start the 1772 scenario.
2. Phase log on turn 1 should include a 2.4.2 entry (no longer skipped). Expected ~63% chance of a national-flavor entry (`0.70 × 0.9`); a 12-founder inaugural roster expects ~0.48 personal events (`0.05 × 0.8 × 12 = 0.48`) — sometimes 0, sometimes 1, rarely 2.
3. Open the new Anytime Events page. Should render at least one entry if anything fired.
4. Verify: **NO** auto-crash, plane-crash, polio, 1918-flu, telegraph, railroad, internet, or modern-pandemic events appear (era filter binding).
5. Duels MAY fire (universal in independence; the spec strips the region gate for I/F).
6. Yellow fever MAY fire (epidemic-yellow-fever has `eras: ['independence', 'federalism']`).

### Playtest — 1856 nationalism mid-game (#33, #36)

1. Start the 1856 scenario; advance ~10 turns.
2. Expect: 2-3 personal scandals, 1-2 personal illnesses (cholera plausible since `eras` includes federalism for the cholera variant), 0-1 duels (region-gated to South/Border in nationalism era), 6-8 national-pool entries spanning at least 3 distinct categories.
3. Watch a politician who acquires `Frail` this turn. **Next turn's** 2.4.1 should apply the `frailDeathMult: 1.5` mortality multiplier (visible via DevTools mortality math or via observation across multiple seeds).
4. Verify at least one of the 5 stub-seed templates fires (`national:bumper-harvest`, `national:railroad-accident`, `national:patriotic-groundswell`, `national:immigration-wave`, `national:treasury-scandal`). Check the National Meters page chip for the corresponding tick.

### Playtest — Anytime Events page (#23-#30, #34)

1. With the page open after a few turns:
   - **Pool: personal** — only personal entries render; politician names are clickable.
   - Click a politician name → drill-down card appears with their summary; feed narrows to them; `[Clear]` button works.
   - **Pool: national** — only national entries render; politician name column is blank or shows a globe glyph; effect chips include meter/interestTick/partyPref/stateBias variants.
   - **Pool: all** — both render; the Category dropdown shows grouped Personal / National sections via `<optgroup>`.
   - Era dropdown defaults to current era; switching to `all` shows entries across eras.
   - `Show retired/dead` OFF — personal events for dead/retired politicians vanish.
   - `Show retired/dead` ON — they reappear (national entries unaffected).
   - Header count updates correctly across filter changes.

### Playtest — Amendment C scandal scaling (#20d, #20e, #35) [CRITICAL]

This is the binding playtest criterion for Amendment C — the per-era spread must be observable.

1. Start a 1772 scenario; advance until a personal scandal-financial / scandal-sexual / scandal-verbal template fires on a player-faction politician. (Statistically every ~25 turns at 4%/yr per 12 politicians × ~10% scandal share of pool ≈ ~0.5/turn expected.) Note the politician's PV BEFORE and AFTER. Open the Roster page and the politician's traits list:
   - **1772 (`scandalMagnitudeMult = 0.5`)**: `Scandalous` stamps only. PV drops ~5 (the `-5` NEGATIVE_TRAITS baseline at pv.ts:75). `flipFlopperPenalty` unchanged.
2. Start a 1956 scenario (or advance into the modern era via cheats / a new scenario); trigger / wait for a scandal-template fire. Same instrumentation:
   - **1956 (`scandalMagnitudeMult = 1.3`)**: `Scandalous` AND `Corrupt` both stamp (PV -10 baseline). `flipFlopperPenalty += 5` (effective PV impact -15 via pv.ts:85 `total -= p.flipFlopperPenalty * 5` — note the 5× multiplier in PV math means `flipFlopperPenalty += 5` → -25 PV. **Risk: per spec criterion #35 the "effective PV -15" wording is the spec author's note; the actual pv.ts math at line 85 multiplies penalty by 5, so the real impact is -25 PV from the penalty alone PLUS -10 from the two trait stamps = -35 total. Architect call**: flag this for verification — the spec may have miscounted the multiplier. See Risks #4.
3. Verify the per-era spread is visible in (a) the Roster's PV column for the scandal-hit politician and (b) the Anytime Events page's effect chips. The chip should show `+Scandalous` and (for modern) `+Corrupt` separately.

### Playtest — National-only turn (criterion 19)

1. Across multiple turns, watch for a turn where ONE national event fires but ZERO personal events fire. (`~21% × ~70% = ~15%` of turns at low roster sizes.)
2. The runner's `mutationCount > 0` guard means `refreshPv` should NOT be called. **Verification**: place a temporary `console.log` in `refreshPv` and confirm it's not called on national-only turns. (Builder MUST remove the log before commit.) Alternative: confirm via the `pvCache` field of a known politician — it should be byte-identical before and after a national-only 2.4.2 tick.

### Playtest — 1772 turn-1 national pool seeds visible

Per spec criterion #36, one of the 5 named seed templates fires within ~6 turns at 70% × 5/22 = ~16%/turn. Start a fresh 1772 scenario; advance 6 turns; verify a `national:*` event ID surfaces in the feed.

### Edge case verification (manual sanity)

- **Politician dies in 2.4.1 same turn** (spec edge cases). 2.4.1 ran first; their `deathYear` is set; 2.4.2's `if (p.deathYear || p.retiredYear) continue` excludes them. Verifiable via DevTools at the boundary.
- **`death` effect fires on faction leader.** `markPoliticianDead` calls `cleanupLeadershipAndProtegeChains` → `f.leaderId = null`. Next 2.2.3 detects vacancy + runs an Election. Matches Faction Leaders criterion #34.
- **Region lookup fails** (politician's `state` not in `snap.states`). `region = undefined`; templates with a `regions` tag are filtered out. Templates with no `regions` tag still fire. Matches 2.1.4 relocations defensiveness.
- **A scandalScaled template hits a politician with no `currentOffice`.** PV math still lands (via trait stamps); `flipFlopperPenalty` is on the politician, independent of office. Documented in spec.
- **Two scandals on the same politician in nationalism/modern.** Second `Corrupt` stamp no-ops via `includes` guard. But `flipFlopperPenalty += 5` IS applied a second time — additive, not idempotent. Documented in spec. Verify the math holds for 3 consecutive modern scandals (expected: `flipFlopperPenalty += 15` total, `Scandalous` once, `Corrupt` once).
- **National event with `regions: ['West']` fires in 1772** when no West-region states exist. `stateBias` loop matches zero states; other effects still apply. No crash.
- **`interestGroups` write to a new key.** `?? 0` fallback initializes; matches phaseRunners.ts:2065-2068 current-stub pattern.

### Dev validator (criterion #6, #7, #4e)

In development, the first 2.4.2 run after page-load triggers `validateAnytimeTemplates()`. Any authoring drift (forbidden trait grant; missing scandalScaled flag; anachronism string) throws `Error`. Verify by opening DevTools console after a 2.4.2 tick — no errors should appear with a well-authored pool. Confirm a forced violation (e.g. temporarily set `grantTrait: 'Flip-Flopper'` in one template) throws and the page surfaces the error.

## Open question dispositions

### #24 — National-pool region scoping (riskiest, flagged in Spec OQ)

**Architect disposition: SHIP V1 WITH `stateBias` ONLY.** Rationale: `State.bias` is already a real engine field (types.ts:510) read by the election math (verified via Grep — `bias` is consumed by `calcStateVote` and elsewhere; meaningful semantic lever even if narrow). Adding a per-state `meters` substructure (parallel to `NationalMeters`) would touch `State`'s type, scenario seed data, `repair()` migration, and an unknown number of read sites. That's a separate feature, not anytime-events scope. **Action**: implement `stateBias` per spec §1.4 effect taxonomy. If playtest finds the region lever too weak (e.g. a Civil War-approach `national:harvest-southern-collapse` doesn't visibly shift Southern elections), open a follow-up spec for per-state meters in v2.

### #25 — National-template fatigue / cooldowns

**Architect disposition: OUT FOR V1.** Rationale: the spec explicitly defers (§ Open Question 25, § Out of Scope). The v1 weighting `t.weight * eraWeightMult?.[era]` is the only throttle; consecutive same-template fires are allowed by design (panics recur; epidemics recur; bumper harvests stack). **Action**: no `cooldownTurns` field, no `lastFiredYear` tracker. If playtest finds the same template firing 4+ times in 6 turns and feels repetitive, the data fix is dropping the template's `weight`; the engine fix is v2.

### #26 — Breakthrough magnitude (playtest-tune)

**Architect disposition: SHIP V1 WITH SPEC DEFAULTS; PLAYTEST-TUNE.** Rationale: the spec binds 2 breakthrough templates (~6% of the pool) granting `Orator + +1 command` and `Crisis Manager + +1 command`. The historian's binding fact #6 prefers latent-ability surfacing — the spec's defaults already lean conservative. **Action**: author the two breakthrough templates at the spec's recommended weight (~5-7 each in the personal pool — middling). Document the levers (template `weight` field, the `eraWeightMult` per-era tilt) so the human playtester can dial up/down. If a 30-turn 1856 game produces 0 breakthroughs, raise weights in a follow-up; if 4+ breakthroughs in 30 turns make every player faction feel like Bryan, lower them.

### #27 — Interest-group key naming convention

**Architect disposition: KEEP FREE-FORM STRING KEYS.** Rationale: the spec binds this (§1.4 Notes, § Open Question 27). The current stub uses free-form keys (`BigAg`, `Nationalists`, `Immigrants`, `Nativists` — verified at phaseRunners.ts:2065-2068). `InterestGroupScores` is typed as `Record<string, number>` (types.ts:596-598), not `Record<InterestCardId, number>`. **Action**: the 22 national templates use the free-form keys listed in spec §1.4 (`BigAg`, `Nationalists`, `Immigrants`, `Nativists`, `Reformers`, `Workers`, `Manufacturers`, `Planters`, `WallStreet`, `MilitaryIndustrial`, `Settlers`, `FreeTrade`, `LawAndOrder`). String literals only. No `as const` enum; no type narrowing. If a future PR wants to lock to `InterestCardId` literals, it's an independent refactor across all consumers (alignment cards, election math, scenario seeds) — not part of anytime-events.

## Risks

1. **Authoring cost — 55 templates is the biggest content risk.** The 33 personal + 22 national templates each need an `id`, `category`, `eras` / `regions` / `eraWeightMult` (where applicable), `weight`, `effects` array (1-4 entries each), `text` with placeholder substitution, and `scandalScaled` flag (8 templates total). Total authoring volume: ~300 lines of well-formed TypeScript object literals across two files. Mitigation: author the personal pool first (the user-facing flagship per the vision), then the national pool. The 5 stub seeds for the national pool provide identical effect shapes — keep them verbatim and just add era tags + ids. **Spec §1.3 and §1.4 tables are the authoring contract; the historian binding facts 1-8 are the era/region grounding** — do NOT improvise era windows or region scopes outside what the historian binding established.

2. **Era multiplier math — multiple multipliers compose; off-by-one easy.** The personal-fire math is `chance(baseFireChance × fireMult)` and the pick weight is `weight × (eraWeightMult?.[era] ?? 1)`. The Amendment C scaler multiplies `pvHit.amount` for feed display AND drives the second-trait/flipFlopperPenalty branch. The Amendment C national-side scaler multiplies `meterTick` and `partyPref` deltas BEFORE the clamp. **Builder must keep `scandalMult` applied only inside the `scandalScaled: true` branch — applying it to non-scandal effects breaks the asymmetric Amendment-C design.** Verify by reading the multiplier site in `applyNationalEffects` (a `const scandalMult = tpl.scandalScaled ? cfg.scandalMagnitudeMult : 1;` at the top) and confirming it's the ONLY scalar applied to those deltas.

3. **2.4.2 stub migration — wholesale replace, not incremental evolve.** The existing 14-line stub at phaseRunners.ts:2062-2075 is REPLACED, not extended. Builder must NOT leave behind any `chance(0.35)` or hardcoded text in the runner; the 5 stub events are RE-AUTHORED as the 5 national-pool seeds with stable ids (`national:bumper-harvest` etc. per criterion #4d). Migration check: after the replace, `grep -n "bumper harvest" src/engine/phaseRunners.ts` returns zero hits; the string now lives in `src/data/anytimeNationalEvents.ts` exactly once per seed.

4. **`pv.ts:85` `flipFlopperPenalty * 5` multiplier discrepancy with spec criterion #35.** The spec says "1956 senator scandal stamps `Scandalous` + `Corrupt` (PV -10) + flipFlopperPenalty += 5 (effective PV -15)". But pv.ts:85 reads `total -= p.flipFlopperPenalty * 5`, so a `+5` to `flipFlopperPenalty` is actually `-25` PV via that field alone, plus `-10` from the two trait stamps = `-35` total. **The spec author appears to have miscounted the `* 5` multiplier.** Architect disposition: ship the runner per spec pseudocode (`p.flipFlopperPenalty += LEADERSHIP_RULES.failedBidPvStamp` where `failedBidPvStamp = 5`) and let playtest reveal whether the resulting -35 PV impact on a modern scandal feels too sharp. If yes, the lever is `LEADERSHIP_RULES.failedBidPvStamp` (a global change affecting 2.2.3 also — undesirable) OR add a local divisor at the 2.4.2 use site (e.g. `p.flipFlopperPenalty += LEADERSHIP_RULES.failedBidPvStamp / 5` rounded). Flag for human checkpoint review. **This is the highest-priority risk: it touches PV math, which CLAUDE.md flags as election-affecting.**

5. **The dev validator must NOT throw in production.** The `import.meta.env.DEV` guard at the runner-call site is the binding gate. If a malformed template ships to production (e.g. `grantTrait: 'Flip-Flopper'` slipping through), the production runner silently grants the bad trait (no validation) — but the spec accepts this trade-off (validator catches at authoring time; prod doesn't pay the cost). Builder MUST verify the guard fires only in dev.

6. **The `markPoliticianDead` / `markPoliticianRetired` 2.4.1 refactor must preserve exact 2.4.1 behavior.** The deaths-retirements brief binds the transition order: set deathYear → cleanup → addLog → vacateOffice → continue. The refactor moves the cleanup + vacateOffice into a wrapper, but the call-site order in 2.4.1 must still be `p.deathYear = year` → `addLog` → `markPoliticianDead(snap, p)` → `continue`. Verify the existing 2.4.1 acceptance criteria (deaths-retirements brief) still pass after the refactor.

7. **`refreshPv` returns a new array — runner must assign.** `snap.politicians = refreshPv(snap.politicians)` is the correct call shape (per pv.ts:89 and the 2.4.1 precedent at phaseRunners.ts:2022). Calling `refreshPv(snap.politicians)` and discarding the result silently breaks PV freshness for any politician whose skills/command/traits changed. Type checker doesn't catch this (return value is `Politician[]`, which `void` contexts swallow).

8. **`State.bias` clamp range.** Spec §1.4 says `[-1, 1]` and current usage of `bias` is consistent with that range (Grep confirms scenario seeds initialize bias as floats around 0). `applyNationalEffects`'s `stateBias` case uses `clamp(s.bias + eff.amount, -1, 1)` — but the `State` type at line 510 (`bias: number`) has no explicit range constraint. If a future feature sets bias outside [-1, 1], this clamp will tighten it. Acceptable in v1; flag for review.

## Out of scope (carry forward from spec §9)

- Hidden / visible illness modeling (Wilson's stroke pattern).
- Direct `ideology` mutation (delegated to 2.1.5 via `Reformist` trait grant; `Puritan` reserved for v2 sub-mechanic).
- Skill bumps to `admin` / `judicial` / `military` / `backroom`.
- Per-event animations / modals.
- Cross-politician event chains (multi-politician duels — single-politician only in v1).
- Age-modulated weighting on illness / cardiac events.
- `Politician.scandalCount` or other accumulating field.
- Save migration / backfill of historical events.
- `Show retired/dead` toggle styling — toggle is binary (include/exclude rows only; no muted styling).
- In-game `AnytimeEventTemplate` authoring UI.
- National pool per-template fatigue / cooldown (OQ #25).
- Per-state granular meters beyond `stateBias` (OQ #24).
- `scandalMagnitudeMult` applied to non-scandal templates / breakthrough scaling (OQ #26).
- 2.4.1 / 2.4.3 changes (other than the `markPoliticianDead` / `markPoliticianRetired` no-behavior-change refactor).
- Page polish: timeline view, per-politician sparkline, national-meter-history graph.
- Per-event PV log entries (the `pvDelta` is in `meta`; no separate log category).

---

Brief path: `/home/user/AMPU/docs/briefs/anytime-events.md`

## Checkpoint-2 summary

- **File count**: 8 — 3 CREATE (`src/data/anytimeEvents.ts`, `src/data/anytimeNationalEvents.ts`, `src/pages/AnytimeEventsPage.tsx`) + 5 MODIFY (`src/types.ts`, `src/phases.ts`, `src/engine/phaseRunners.ts`, `src/pages/registry.ts`, `src/components/Sidebar.tsx`).
- **LoC estimate**: ~700 lines added / ~30 modified / ~14 deleted. Breakdown: anytimeEvents.ts +250 (33 templates × ~7 lines each + types + ANYTIME_EVENT_TEMPLATES array); anytimeNationalEvents.ts +180 (22 templates + types); AnytimeEventsPage.tsx +180 (filter row + feed + drill-down card); types.ts +30 (const + feed cap); phases.ts -1; phaseRunners.ts +90 (runner + applyNationalEffects + 2 wrappers + validator) -14 (stub replaced) +0 net to 2.4.1 (refactor is structural); registry.ts +2; Sidebar.tsx +1.
- **Runner entry-point name**: `runPhase_2_4_2_Anytime` (UNCHANGED — same name as the existing stub at phaseRunners.ts:2062; `engine.ts:43` dispatch is untouched). Internal helpers: `rollNationalEvent`, `rollPersonalEvents`, `applyNationalEffects`, `markPoliticianDead`, `markPoliticianRetired`, `validateAnytimeTemplates`.
- **OQ dispositions**: #24 (region scoping) — ship v1 with `stateBias` only; per-state meters is a separate v2 feature. #25 (fatigue / cooldowns) — out of v1, weight-only throttle is the lever. #26 (breakthrough magnitude) — ship spec defaults, playtest-tune via `weight`. #27 (interest-group keys) — keep free-form strings, no `InterestCardId` narrowing.
- **Riskiest implementation step**: replacing `runPhase_2_4_2_Anytime` wholesale AND the Amendment-C scandal scaling pathway. The `flipFlopperPenalty += 5` math (Risk #4) interacts with `pv.ts:85`'s `* 5` multiplier in a way the spec may have miscounted (-35 PV total impact, not -15) — this is the highest-priority human-checkpoint item; the builder ships the spec pseudocode and the human dials it back if it's too sharp.
- **Top-3 risks flagged**: (1) **PV math discrepancy** — Risk #4 — `flipFlopperPenalty += 5` × `pv.ts:85`'s `* 5` multiplier gives an effective -25 PV from the penalty alone, not -5 as the spec criterion #35 implies. Needs human gut-check or spec amendment. (2) **55-template authoring volume** — Risk #1 — biggest content burden; mitigated by deferring to spec §1.3 / §1.4 tables verbatim and not improvising. (3) **2.4.2 stub wholesale replacement** — Risk #3 — must NOT leave behind any of the existing hardcoded text; the 5 stub events are RE-AUTHORED as named seeds in the national pool. Migration check: `grep` confirms zero hits in `phaseRunners.ts` for the stub strings after the change.
- **Recommend single PR**: YES. The feature is internally coherent (one const block, one phase activation, one runner rewrite, two data files, one page). Splitting (e.g. "engine first, page second") would force two playtests and double the review surface — the page without the engine is empty; the engine without the page lacks visible verification of criterion #34. Single PR.
