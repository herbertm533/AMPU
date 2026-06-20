# Brief: Trait Loss + d6 Conflict (PR3)

## Approach

Add the **erosion + conflict** half of the trait lifecycle — the trait-axis
counterpart to PR2a/PR2b's ability lifecycle and PR1's expertise primitive.
Today AMPU mutates `Politician.traits[]` via raw `traits.push` / `traits.filter`
across ~24 sites (the F-RECONCILE table), with no general loss path and no
conflict resolution; traits are a one-way ratchet. PR3 lands one tuning const
(`TRAIT_LIFECYCLE_RULES` in `src/types.ts`, beside `ABILITY_EARN_RULES`) +
one paired symmetric lookup (`TRAIT_CONFLICTS`) + one new pure helper module
(`src/engine/traits.ts`) exposing **three** primitives — `addTrait`,
`removeTrait`, and `tryGrantTrait` — that every gain/loss path now routes
through. The structural analog is `src/engine/abilities.ts`'s
`addSkillPoint`/`loseSkill` pair: pure, no RNG inside the boolean primitives,
return `true` iff the array actually changed; the d6 lives **inside**
`tryGrantTrait` because the conflict-resolution semantic is the primitive's
purpose. Old-age trait decay is inserted into `runPhase_2_4_1_Deaths`
**beside** PR2a's old-age ability decay (independent rolls, both can fire in
the same tick on the same politician); the `Leadership` Lost battle trigger
hooks `revolutionaryWar.ts` next to PR2a's `applyBattleLoss`. F-RECONCILE
rewires every existing trait mutation site to the new helpers; the seed-time
mutually-exclusive `Ideologue↔Impressionable` and `Loyal↔Opportunist`
pushes (`phaseRunners.ts:769–770` / `1087–1088`) **remain direct** because
they fire once per politician under their own `else if` guard — the d6 path
is for **post-seed** trait grants. PV formula stays untouched; no new field
on `Politician` / `GameState`; no `repair()` change; the helpers use `d` from
`src/rng.ts` and the existing `chance()` for the old-age roll — no new
`Math.random`.

**Locked CP1 decisions carried in (do not relitigate):** One PR (loss
machinery + d6 ship together). `TRAIT_LIFECYCLE_RULES.conflictD6Threshold =
4` (flat 50%, d6 ≥ 4 = new wins). All seven conflict pairs locked
(`Charismatic↔Unlikable`, `Harmonious↔Puritan`, `Integrity↔Corrupt`,
`Efficient↔Passive`, `Egghead↔Incompetent`, `Ideologue↔Impressionable`,
`Loyal↔Opportunist`). Partial-apply on failed d6 — the rest of the
template's effects still apply, only the trait grant is voided. No
`unelected-president → Leadership loss` (DEFER, no clean hook).

**Alternative rejected — a merged `setTrait(p, t, { resolveConflict })`.**
A single bag-of-options trait setter would centralize the API but collapse
the two semantically distinct call sites (no-conflict-possible gains vs.
conflict-aware gains) into one branch, force every caller to pass an
options literal, and break the PR2a `addSkillPoint`/`loseSkill` precedent
the codebase already follows. The three-function shape (`addTrait`,
`removeTrait`, `tryGrantTrait`) lets each call site pick the right
primitive at the call site (the F-RECONCILE column tells the builder
which) and keeps the d6 a discrete primitive inside `tryGrantTrait`.

## State & type changes

### `src/types.ts` — new `TRAIT_LIFECYCLE_RULES` const + symmetric `TRAIT_CONFLICTS` map

Add **immediately after** `TRACK_SECONDARY_SKILLS` (closes at `types.ts:521`)
and **before** `ANYTIME_EVENTS_RULES` (`types.ts:523`). This places the trait
lifecycle const adjacent to the ability earn/loss consts — the established
"all magnitudes for the axis live in one place" pattern from PR1/PR2a/PR2b.

```ts
// PR3 trait lifecycle. Magnitudes for every trait erosion / d6 conflict live
// here so engine bodies stay free of magic numbers (mirrors ABILITY_LOSS_RULES /
// ABILITY_EARN_RULES above).
export const TRAIT_LIFECYCLE_RULES = {
  // --- Old-age advantageous-trait decay (runPhase_2_4_1_Deaths) ---
  // Mirrors ABILITY_LOSS_RULES.oldAge shape; gentler than the ability decay
  // (half the base) per the spec's "advantageous ones fade with old age"
  // framing — trait loss swings PV by 4-5 per trait, ability loss by less.
  oldAge: {
    minAge: 70,            // same age gate as ABILITY_LOSS_RULES.oldAge
    baseChance: 0.05,      // per-turn P(one trait-decay event) — HALF of PR2a's 0.10
    ageBracketBonus: [
      { minAge: 85, bonus: 0.03 },
      { minAge: 78, bonus: 0.02 },
      { minAge: 70, bonus: 0.0  },
    ],
    amount: 1,             // traits removed per fired event (always exactly one)
    // Conservative fading-trait pool (Q2 resolution — see below). Cosmetic
    // "fame fades / charm fades" traits only; structural / character traits
    // (Leadership, Integrity, Kingmaker, Ambitious) are EXCLUDED.
    fadingPool: ['Celebrity', 'Charismatic'] as Trait[],
  },

  // --- Leadership Lost on battle loss (revolutionaryWar.ts:runRevWarBattles) ---
  // Probability the senior commander loses Leadership after a lost battle
  // (Q8 resolution — coin flip; they lost the battle, but Leadership is a
  // charismatic-leader trait that can survive a single defeat).
  leadershipLossOnBattleLoss: { chance: 0.5 },

  // --- d6 conflict resolution (tryGrantTrait) ---
  // d6 >= threshold means the NEW trait wins (held trait removed, new added);
  // d6 < threshold means the OLD trait holds (new does not take). Default 4
  // = flat 50% (locked CP1).
  conflictD6Threshold: 4,
} as const satisfies {
  oldAge: {
    minAge: number; baseChance: number;
    ageBracketBonus: { minAge: number; bonus: number }[];
    amount: number;
    fadingPool: Trait[];
  };
  leadershipLossOnBattleLoss: { chance: number };
  conflictD6Threshold: number;
};

// Symmetric trait-conflict pairing. Both directions listed so a lookup of
// either side works (e.g. both Charismatic -> Unlikable AND Unlikable ->
// Charismatic). Locked CP1: all seven semantic-opposite pairs in the current
// Trait union; Hale/Likable/Two-Faced conflicts are PR4 content (DEFER).
export const TRAIT_CONFLICTS: Partial<Record<Trait, Trait>> = {
  Charismatic:    'Unlikable',
  Unlikable:      'Charismatic',
  Harmonious:     'Puritan',
  Puritan:        'Harmonious',
  Integrity:      'Corrupt',
  Corrupt:        'Integrity',
  Efficient:      'Passive',
  Passive:        'Efficient',
  Egghead:        'Incompetent',
  Incompetent:    'Egghead',
  Ideologue:      'Impressionable',
  Impressionable: 'Ideologue',
  Loyal:          'Opportunist',
  Opportunist:    'Loyal',
};
```

`Trait` is declared at `types.ts:62–100`, above this point — the
`as Trait[]` cast on `fadingPool` and the `Partial<Record<Trait, Trait>>`
on `TRAIT_CONFLICTS` both resolve. The `as const satisfies …` shape gives
compile-time protection against typos in `oldAge` / `leadershipLossOnBattleLoss`
keys.

### Save / migration impact

**None.** AC #22: PR3 adds no field to `Politician`, `GameState`, or any
snapshot type and requires **no `repair()` change**. It only reads/mutates
the existing `traits: Trait[]` array (and the existing `failedBidExpiresYear`
already used by Failed-Bid decay) and adds a const + helper + log lines. Old
IndexedDB saves load and play unchanged; they simply begin to experience
trait loss / d6 conflicts going forward. **Defensive edge:** a legacy save
with both sides of a conflict pair present (e.g. both `Loyal` and
`Opportunist` from corrupt data) is handled — `addTrait` no-ops (already
held), `tryGrantTrait` no-ops on a no-conflict re-grant, the state is
detected but not destructively repaired (per spec Edge case).

## Engine changes (pure logic)

All deterministic over the snapshot. The d6 conflict roll uses `d(6)` from
`src/rng.ts` (already used for casualties at `revolutionaryWar.ts:70–79`),
and the old-age trait-decay roll uses `chance()` like PR2a's
`oldAge.baseChance`. **No new `Math.random`** is added anywhere (the two
pre-existing `Math.random` calls at `revolutionaryWar.ts:88,96` remain out
of scope per PR2a). Every mutation that actually changes `p.traits` writes
one `addLog` line at the call site; the helpers are pure.

### `src/engine/traits.ts` — NEW MODULE (AC #2)

Mirror `expertise.ts` / the `loseSkill`/`addSkillPoint` shape from
`abilities.ts`: pure, return-boolean-on-real-change. **Three** exports:

```ts
import type { Politician, Trait } from '../types';
import { TRAIT_CONFLICTS, TRAIT_LIFECYCLE_RULES } from '../types';
import { d } from '../rng';

// Push if absent. Returns true iff a trait was actually added, so callers
// can gate their addLog line on a real change. Does NOT consult conflicts —
// callers route conflict-aware gains through tryGrantTrait. Pure; no PV refresh.
export function addTrait(p: Politician, t: Trait): boolean {
  if (p.traits.includes(t)) return false;
  p.traits.push(t);
  return true;
}

// Filter out. Returns true iff the politician actually held the trait. Pure.
export function removeTrait(p: Politician, t: Trait): boolean {
  if (!p.traits.includes(t)) return false;
  p.traits = p.traits.filter((x) => x !== t);
  return true;
}

// Conflict-aware grant. Resolution table:
//   - already held         -> { granted: false, replaced: null }  (silent dedupe)
//   - no conflict pair     -> addTrait, { granted: true, replaced: null }
//   - conflict NOT held    -> addTrait, { granted: true, replaced: null }
//   - conflict held + d6 OK -> remove held, add new, { granted: true, replaced: <held> }
//   - conflict held + d6 NG -> no change, { granted: false, replaced: null }
//
// The d6 lives inside this helper because the conflict-resolution semantic is
// the primitive's purpose; callers compose the log line from the returned
// { granted, replaced } shape. d() is from src/rng.ts (seeded RNG path).
export function tryGrantTrait(
  p: Politician,
  t: Trait,
): { granted: boolean; replaced: Trait | null } {
  if (p.traits.includes(t)) return { granted: false, replaced: null };
  const conflict = TRAIT_CONFLICTS[t];
  if (!conflict || !p.traits.includes(conflict)) {
    p.traits.push(t);
    return { granted: true, replaced: null };
  }
  // Conflict present: roll d6, >= threshold = new wins.
  if (d(6) >= TRAIT_LIFECYCLE_RULES.conflictD6Threshold) {
    p.traits = p.traits.filter((x) => x !== conflict);
    p.traits.push(t);
    return { granted: true, replaced: conflict };
  }
  return { granted: false, replaced: null };
}
```

Why `tryGrantTrait` takes only `p, t` (no `snap`): the d6 is read off
`src/rng.ts`'s module-level `Math.random`, which is the seeded path the
codebase already uses; PR2a's `applyBattleLoss` and `runPhase_2_4_1_Deaths`
follow the same convention (`chance`, `pick`, `d` are imported from
`'../rng'`, not threaded through `snap`). Keeping the helper
dependency-light matches `expertise.ts` (one type import + nothing else).

### `src/types.ts` — adjacency only

The only change in `types.ts` is the new const + map block above. **No
change** to the `Trait` union (AC #21), no change to `Politician` /
`GameState`, no migration. `src/engine/abilities.ts` is **not touched**
(the spec briefly questioned the adjacency — confirm: the new
`TRAIT_LIFECYCLE_RULES` lives in `types.ts` alongside its sibling rules
consts; `abilities.ts` exports the ability-axis helpers only, and there's no
reason to crowd a trait helper into it. Helpers live in the new
`traits.ts`).

### `src/engine/phaseRunners.ts` — imports + F-RECONCILE rewire + old-age trait decay + Step-2 guard

**Imports.** Extend the existing types-side import at **line 2**: add
`TRAIT_LIFECYCLE_RULES` to the named list (the table `TRAIT_CONFLICTS` is
read transitively via `tryGrantTrait`, so it does **not** need to be
imported into `phaseRunners.ts` directly — only `TRAIT_LIFECYCLE_RULES` is
read from this file, for the old-age decay block). Extend the helper imports
beside `'./abilities'` (line 5) with a new `'./traits'` line: `import {
addTrait, removeTrait, tryGrantTrait } from './traits';`. `chance`, `pick`,
`d` are already imported from `'../rng'` (line 6) — no rng import change
beyond confirming `d` is in the list (it is not currently — `d100` is, but
not `d`. Add `d` to the rng import on line 6).

---

**(a) F-RECONCILE rewire (12 sites in this file).** Each site replaces a
raw `traits.push` / `traits.filter` with one of the helpers, and (for the
d6 sites) composes a log line from the `{ granted, replaced }` shape.

**Site 1 — `phaseRunners.ts:336` (themed-trait roll, `rollThreshold`).**
Route through `tryGrantTrait`. The themed pool already filters held
(`.filter((t) => !p.traits.includes(t))` at line 333), so the only
behavior change is: when the picked trait conflicts with one the politician
holds (e.g. a Judicial-track politician with `Puritan` rolling `Harmonious`),
the d6 fires.

```ts
  if (chance(CAREER_ODDS.themedByThreshold[n - 1])) {
    const pool = TRACK_THEMED_TRAITS[track].filter((t) => !p.traits.includes(t));
    if (pool.length > 0) {
      const t = pick(pool);
      const { granted, replaced } = tryGrantTrait(p, t);
      if (granted) {
        recordCareerGain(snap, p, thresholdYears, 'trait', t, false);
        if (replaced) {
          addLog(snap, '2.1.2', 'event',
            `${p.firstName} ${p.lastName} sheds ${replaced} and earns ${t} — the gain wins on a d6.`,
            { politicianId: p.id });
        }
      } else {
        addLog(snap, '2.1.2', 'event',
          `${p.firstName} ${p.lastName} would have gained ${t}, but ${TRAIT_CONFLICTS[t]} holds on a d6.`,
          { politicianId: p.id });
      }
    }
  }
```

(Add `TRAIT_CONFLICTS` to the types import on line 2 — needed for the
failed-d6 log composition.) The "no-conflict, normal gain" path (e.g.
`Charismatic` on a politician with no `Unlikable`) writes no extra log —
the existing `recordCareerGain` is the career-feed surface, consistent with
the primary skill roll's silence at line 313 (no `addLog`).

**Site 2 — `phaseRunners.ts:351` (random off-track positive/negative).**
Same pattern as Site 1 — route through `tryGrantTrait`, compose the
swap/failed-d6 log. This is the highest-volume d6 surface (the random pool
draws `Charismatic` / `Unlikable` / etc. across the entire roster):

```ts
  if (chance(CAREER_ODDS.random)) {
    const positive = chance(CAREER_ODDS.randomPositiveShare);
    const pool = positive
      ? POSITIVE_TRAITS.filter((t) => t !== 'Ideologue' && t !== 'Loyal' && !TRACK_THEMED_TRAITS[track].includes(t) && !p.traits.includes(t))
      : CAREER_RANDOM_NEGATIVES.filter((t) => !p.traits.includes(t));
    if (pool.length > 0) {
      const t = pick(pool);
      const { granted, replaced } = tryGrantTrait(p, t);
      if (granted) {
        recordCareerGain(snap, p, thresholdYears, 'trait', t, !positive);
        if (replaced) {
          addLog(snap, '2.1.2', 'event',
            `${p.firstName} ${p.lastName} sheds ${replaced} and earns ${t} — the gain wins on a d6.`,
            { politicianId: p.id });
        }
      } else {
        addLog(snap, '2.1.2', 'event',
          `${p.firstName} ${p.lastName} would have gained ${t}, but ${TRAIT_CONFLICTS[t]} holds on a d6.`,
          { politicianId: p.id });
      }
    }
  }
```

**Site 3 — `phaseRunners.ts:540` (Carpetbagger ladder on relocation).**
Route through `addTrait`. No conflict pair for the ladder set
(`Carpetbagger`/`Outsider`/`Controversial`/`Unlikable`); the ladder is
already order-preserving via `.find((tr) => !p.traits.includes(tr))`, so
`addTrait`'s dedupe is the only invariant. No log change needed (the
ladder gain is recorded via `traitsGained.push(t)` into the relocation
entry, line 541 — keep that, but route the underlying push):

```ts
    if (chance(pC)) {
      const t = CARPETBAGGER_LADDER.find((tr) => !p.traits.includes(tr));
      if (t && addTrait(p, t)) {
        traitsGained.push(t);
      }
    }
```

**Sites 4 & 5 — `phaseRunners.ts:769–770` and `1087–1088` (seed-time
mutually-exclusive Ideologue/Impressionable + Loyal/Opportunist).**
**Leave as direct push, no change.** Per the locked CP1 decision and the
F-RECONCILE "Leave as direct push" tag: these are one-shot lazy seeds gated
by `p.ideologyTraitsSeeded` / `p.conversionTraitsSeeded` (set true at the
end of the block, never re-rolled), AND the mutual exclusion is enforced by
the surrounding `if (!includes('Ideologue') && !includes('Impressionable'))`
guard — the two paths cannot co-grant. Documented in the brief as
intentional: the d6 path is for **post-seed** trait grants (e.g.
kingmaker-inheritance picking `Opportunist` for a politician already seeded
`Loyal` — that's where the d6 fires, at site 8).

**Site 6 — `phaseRunners.ts:1296` (Kingmaker draft-floor top-up).**
Route through `addTrait`. `Kingmaker` has no conflict pair; the only
invariant is dedupe (the `noTrait` filter at line 1288 already excludes
held). Replace the unconditional `g.traits.push('Kingmaker')`:

```ts
    for (const g of grants) {
      if (addTrait(g, 'Kingmaker')) {
        recordKingmaker(snap, {
          year: snap.game.year, kind: 'anointed',
          politicianId: g.id,
          factionId: f.id, reason: 'draft-floor',
        });
        granted++;
      }
    }
```

(Defensive: the `noTrait` filter pre-empts the `addTrait` false path, but
the boolean gate matches PR2a's idiom — a real-change log invariant.)

**Site 7 — `phaseRunners.ts:1324` (Kingmaker command-gate anoint).**
Route through `addTrait`. Same logic as Site 6 — `Kingmaker` has no
conflict pair, the surrounding `if (p.traits.includes('Kingmaker'))
continue` already pre-empts re-grants:

```ts
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (!p.factionId) continue;
    if (p.command < gate) continue;
    if (p.traits.includes('Kingmaker')) continue;
    if (addTrait(p, 'Kingmaker')) {
      recordKingmaker(snap, {
        year: snap.game.year, kind: 'anointed',
        politicianId: p.id,
        factionId: p.factionId,
      });
      anointed++;
    }
  }
```

**Site 8 — `phaseRunners.ts:1381` (kingmaker-protege graduation
inheritance).** **Key d6 site** — the inherited trait is drawn from the
mentor's positive trait set, which can collide with a held opposite (a
mentor with `Charismatic` whose protege carries `Unlikable`). Route
through `tryGrantTrait` and compose the swap/failed-d6 log under phase
`2.1.7`:

```ts
    if (traitBranch || bothBranch) {
      const inheritable = k.traits.filter((t) => POSITIVE_TRAITS.includes(t) && !c.traits.includes(t));
      if (inheritable.length > 0) {
        const t = pick(inheritable);
        const { granted, replaced } = tryGrantTrait(c, t);
        if (granted && replaced) {
          addLog(snap, '2.1.7', 'event',
            `${c.firstName} ${c.lastName} inherits ${t} from ${k.firstName} ${k.lastName}, shedding ${replaced} on a d6.`,
            { politicianId: c.id });
        } else if (!granted) {
          addLog(snap, '2.1.7', 'event',
            `${c.firstName} ${c.lastName} would have inherited ${t} from ${k.firstName} ${k.lastName}, but ${TRAIT_CONFLICTS[t]} holds on a d6.`,
            { politicianId: c.id });
        }
        // Plain grant (no conflict, no swap) is silent — the kingmaker
        // entry below is the structural surface (kind: 'graduated').
      }
    }
```

Failed-inheritance behavior: a single `pick(inheritable)` draw, no re-roll
on d6 failure (per the spec's Open Q8 recommendation — recommend DROP, not
re-roll, to avoid a loop and match the "almost happened" semantic).

**Site 9 — `phaseRunners.ts:1391` (mentor reward — `Leadership`).**
Route through `addTrait`. `Leadership` has no conflict pair in PR3's
table; the existing `if (!k.traits.includes('Leadership'))` guard is
replaced by `addTrait`'s dedupe:

```ts
    if (addTrait(k, 'Leadership')) {
      // (no addLog here — the structural kingmaker entry below is the surface)
    }
```

(The unconditional push has no surrounding log; just the dedupe boolean.)

**Site 10 — `phaseRunners.ts:1835` (Failed Bid decay sweep).**
**Existing time-based decay** — route the `traits.filter` through
`removeTrait` for consistency, no behavior change:

```ts
  for (const p of snap.politicians) {
    if (p.failedBidExpiresYear !== undefined && year >= p.failedBidExpiresYear) {
      removeTrait(p, 'Failed Bid');
      p.failedBidExpiresYear = undefined;
    }
  }
```

No log — the decay is silent today (intentional; PR3 preserves).

**Site 11 — `phaseRunners.ts:1844` (Ambitious seed).** **Leave as direct
push.** Per F-RECONCILE: seed pass, one-shot, gated by
`p.ambitiousSeeded`. The Ambitious trait has no conflict pair. (The
surrounding `if (!p.traits.includes('Ambitious')) p.traits.push('Ambitious');`
could be routed through `addTrait` for stylistic consistency, but the spec
explicitly tags this row "Leave as direct push" — comply.)

**Site 12 — `phaseRunners.ts:1960` (Failed Bid grant on lost challenge).**
Route through `addTrait`. No conflict pair for `Failed Bid`. Existing
guard `if (!challenger.traits.includes('Failed Bid'))` is replaced by
`addTrait`'s dedupe:

```ts
    } else {
      addTrait(challenger, 'Failed Bid');
      challenger.failedBidExpiresYear = year + 2 * LEADERSHIP_RULES.failedBidDecayTurns;
      // ... existing recordFactionLeadership + addLog stay ...
    }
```

**Site 13 — `phaseRunners.ts:2476` (anytime `grantTrait` effect).**
**Big surface — every anytime template that mints a trait now d6-resolves
on conflict.** Route through `tryGrantTrait`. The existing
`if (!p.traits.includes(eff.trait))` guard becomes the dedupe half of
`tryGrantTrait`. Compose the swap/failed-d6 log under phase `2.4.2`.
**Crucially — per locked CP1 decision (Q7 partial-apply):** on a failed
d6, the rest of the template's effects (pvBump/pvHit/skillBump/etc.) STILL
apply. The existing `didMutate = true` semantic and the trailing
`if (didMutate) mutated = true` block (line 2530) and the template's
`addLog` (line 2540) must continue to fire. The trait-grant effect just
no-ops on its own line.

```ts
        case 'grantTrait': {
          const result = tryGrantTrait(p, eff.trait);
          if (result.granted) {
            didMutate = true;
            if (result.replaced) {
              addLog(snap, '2.4.2', 'event',
                `${p.firstName} ${p.lastName} sheds ${result.replaced} and earns ${eff.trait} — the gain wins on a d6.`,
                { politicianId: p.id });
            }
          } else if (TRAIT_CONFLICTS[eff.trait] && p.traits.includes(TRAIT_CONFLICTS[eff.trait]!)) {
            // d6 failed — log it; the rest of the template's effects still apply.
            addLog(snap, '2.4.2', 'event',
              `${p.firstName} ${p.lastName} would have gained ${eff.trait}, but ${TRAIT_CONFLICTS[eff.trait]} holds on a d6.`,
              { politicianId: p.id });
          }
          // Already-held (granted: false, no conflict held) — silent dedupe,
          // matches the previous `if (!p.traits.includes(...))` silence.
          break;
        }
```

The `case` body now opens a block scope (`case 'grantTrait': { … break; }`)
to declare `const result` cleanly — TypeScript otherwise complains about
lexical declaration in case clause.

**Site 14 — `phaseRunners.ts:2521` (scandal-scaling forced `Corrupt`).**
**Notable d6 site** — `Integrity ↔ Corrupt` conflict resolves here ("the
scandal sticks" vs. "their Integrity weathers it"). Route through
`tryGrantTrait`; the `mult >= 1.0` gate stays; the `flipFlopperPenalty`
stamp at line 2525 is **independent** of the trait roll (always applies on
mult >= 1.2).

```ts
    if (tpl.scandalScaled) {
      const mult = cfg.scandalMagnitudeMult;
      if (mult >= 1.0) {
        const result = tryGrantTrait(p, 'Corrupt');
        if (result.granted) {
          didMutate = true;
          if (result.replaced) {
            addLog(snap, '2.4.2', 'event',
              `${p.firstName} ${p.lastName} sheds ${result.replaced} as the scandal sticks — Corrupt now.`,
              { politicianId: p.id });
          }
        } else if (p.traits.includes('Integrity')) {
          addLog(snap, '2.4.2', 'event',
            `${p.firstName} ${p.lastName}'s Integrity weathers the scandal — Corrupt does not take, on a d6.`,
            { politicianId: p.id });
        }
        // Already-Corrupt politician: silent dedupe (matches today's behavior).
      }
      if (mult >= 1.2) {
        p.flipFlopperPenalty += LEADERSHIP_RULES.failedBidPvStamp;
        didMutate = true;
      }
    }
```

**Sites 15 & 16 — `phaseRunners.ts:2678` and `2686` (Boston Tea Party
Sam Adams Celebrity, Common Sense Paine Celebrity).** Route both through
`addTrait`. No conflict pair for `Celebrity`. The existing `if
(!includes('Celebrity'))` guards become `addTrait`'s dedupe:

```ts
    // Site 15: Sam Adams Celebrity (Boston Tea Party)
    case 'boston_tea_party': {
      const samAdams = snap.politicians.find((p) => p.firstName === 'Samuel' && p.lastName === 'Adams');
      if (samAdams && addTrait(samAdams, 'Celebrity')) {
        addLog(snap, '2.4.3', 'event', 'Samuel Adams gains the Celebrity trait.');
      }
      break;
    }
    // Site 16: Common Sense Paine Celebrity + Obscure removal
    case 'common_sense': {
      const paine = snap.politicians.find((p) => p.firstName === 'Thomas' && p.lastName === 'Paine');
      if (paine) {
        addTrait(paine, 'Celebrity');         // dedupe via helper
        removeTrait(paine, 'Obscure');        // see Site 17 below
      }
      break;
    }
```

**Site 17 — `phaseRunners.ts:2687` (Common Sense Paine sheds Obscure).**
Route through `removeTrait` (covered in Site 16 above — `removeTrait(paine,
'Obscure')`). No-op if not held, returns false; no log line today
(intentional, PR3 preserves silence — the surrounding event log line is
the surface).

---

**(b) Old-age trait decay — NEW block in `runPhase_2_4_1_Deaths`
(`phaseRunners.ts:2200+`).** Insert **immediately after** PR2a's old-age
ability decay (closes at line 2236) and **before** the for-loop closes at
line 2237. Both blocks share the `if (p.age >= oa.minAge)` age gate but use
their own probability roll — **independent rolls** (Q4 confirmed:
INDEPENDENT — both can fire in the same tick on the same politician, they
are orthogonal lifecycle erosions). Each fired decay event removes **one**
trait from the politician's intersection of `TRAIT_LIFECYCLE_RULES.oldAge.
fadingPool` and `p.traits`, randomized via `pick`. The trailing single
`refreshPv(snap.politicians)` at line 2239 picks up the PV change — no new
PV write here.

Shape (placed inside the `for (const p of snap.politicians)` loop, after
PR2a's decay block at line 2236):

```ts
    // Old-age trait decay (PR3). Independent of PR2a's ability decay above —
    // both can fire in the same tick on the same politician (intentional
    // "decline drama" — flagged for playtest balance). Same age gate, own roll.
    const ot = TRAIT_LIFECYCLE_RULES.oldAge;
    if (p.age >= ot.minAge) {
      let traitChance: number = ot.baseChance;
      for (const b of ot.ageBracketBonus) {
        if (p.age >= b.minAge) { traitChance += b.bonus; break; }
      }
      traitChance = clamp(traitChance, 0, 1);
      if (chance(traitChance)) {
        // Pool = held traits in the fading set. Empty pool -> silent no-op
        // (common for fresh draftees / Kingmaker-only carriers).
        const held = ot.fadingPool.filter((t) => p.traits.includes(t));
        if (held.length > 0) {
          const t = pick(held);
          if (removeTrait(p, t)) {
            addLog(snap, '2.4.1', 'event',
              `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has lost their ${t} step — the years catch up.`,
              { politicianId: p.id });
          }
        }
      }
    }
```

`clamp` is already imported from `'../rng'` (line 6); `pick` likewise; `chance`
likewise; `TRAIT_LIFECYCLE_RULES` is imported on line 2 via the types-side
import extension above. The death/retire branches at lines 2184–2198
already `continue` (death) or fall through (retire) — the PR2a block at
line 2200 placed itself after the retire roll so a just-died politician is
skipped (death `continue`s above); PR3's block sits one tick further down
the same loop body, same skip semantics.

---

**(c) Step-2 re-validation guard in `runPhase_2_2_3_FactionLeaders`
(`phaseRunners.ts:1891–1905`).** The PR2b review carryover (spec AC #19).
The Step 2 install path captures `formerLeaderId = current?.id` at line
1892 then UNCONDITIONALLY calls `applyFactionLeaderGrants(snap, winner,
f.name)` at line 1904 — but in the re-validation edge (a leader flickered
invalid then re-elected as the same person; possible if the previous tick's
`current` was somehow `null`-or-invalid but the sort returned the same id),
the 4-stat grant fires on a politician who never lost the chair.

Add a one-line guard before the grant call:

```ts
        addLog(snap, '2.2.3', 'appointment',
          `${winner.firstName} ${winner.lastName} elected to lead the ${f.name}.`);
        if (winner.id !== formerLeaderId) {
          applyFactionLeaderGrants(snap, winner, f.name);
        }
        newSeats++;
```

The election log line still fires (the surface is a legitimate
re-validation event); only the stat grants are skipped on a same-id
re-validation. Step 3 (`1957`) is correct as-is — challenge-success
implies `challenger.id !== leader.id` by the pool filter at line 1918
(`p.id !== leader.id`). No change to Step 3.

### `src/engine/continentalCongress.ts` — 2 F-RECONCILE sites

**Imports.** Extend the existing `'./abilities'` import at line 4 with a
new `'./traits'` import: `import { addTrait, removeTrait } from
'./traits';`. No new types import.

**Site CC-1 — `continentalCongress.ts:144` (CC President sheds Obscure).**
Route through `removeTrait`. No behavior change — `removeTrait` is the
filtered-out path. No log (today silent; PR3 preserves):

```ts
  cc.presidentId = winner.id;
  removeTrait(winner, 'Obscure');
  winner.skills.legislative = Math.min(5, winner.skills.legislative + 1);
  winner.command = Math.min(5, winner.command + 1);
```

**Site CC-2 — `continentalCongress.ts:147` (CC President 20% Leadership
reward).** Route through `addTrait`. No conflict pair for `Leadership`.
The existing guard `if (… && !winner.traits.includes('Leadership'))` is
replaced by `addTrait`'s dedupe:

```ts
  if (chance(0.2)) addTrait(winner, 'Leadership');
```

### `src/engine/constitutionalConvention.ts` — 2 F-RECONCILE sites

**Imports.** This file currently imports nothing from `./traits` or
`./abilities` (no PR2a/PR2b touch — confirmed by reading lines 1–4). Add
`import { addTrait, tryGrantTrait } from './traits';` beside the existing
imports. Add `TRAIT_CONFLICTS` to the types import on line 1 for the
failed-d6 log composition.

**Site CV-1 — `constitutionalConvention.ts:156` (Father of Constitution
`Celebrity`).** Route through `addTrait`. No conflict pair. The existing
guard `if (!father.traits.includes('Celebrity'))` is replaced by
`addTrait`'s dedupe:

```ts
    if (father) {
      conv.fatherOfConstitutionId = father.id;
      addTrait(father, 'Celebrity');
      father.command = Math.min(5, father.command + 1);
      addLog(snap, '2.4.3', 'event', `${father.firstName} ${father.lastName} hailed as Father of the Constitution.`);
    }
```

**Site CV-2 — `constitutionalConvention.ts:168` (Federalist author
`Egghead`).** **Notable d6 site** — `Egghead ↔ Incompetent` conflict
resolves here. Route through `tryGrantTrait`; the `if
(!authors.includes(a.id))` outer guard stays (it dedupes the picker, not
the trait). Compose the swap/failed-d6 log under phase `2.4.3`:

```ts
    for (let i = 0; i < 3 && candidates.length > 0; i++) {
      const a = pick(candidates);
      if (!authors.includes(a.id)) {
        authors.push(a.id);
        a.command = Math.min(5, a.command + 1);
        const { granted, replaced } = tryGrantTrait(a, 'Egghead');
        if (granted && replaced) {
          addLog(snap, '2.4.3', 'event',
            `${a.firstName} ${a.lastName} sheds ${replaced} and earns Egghead authoring the Federalist Papers — d6 wins.`,
            { politicianId: a.id });
        } else if (!granted && TRAIT_CONFLICTS['Egghead'] && a.traits.includes(TRAIT_CONFLICTS['Egghead']!)) {
          addLog(snap, '2.4.3', 'event',
            `${a.firstName} ${a.lastName} would have gained Egghead authoring the Federalist Papers, but Incompetent holds on a d6.`,
            { politicianId: a.id });
        }
      }
    }
```

`TRAIT_CONFLICTS['Egghead']` is `'Incompetent'` (the symmetric map), so the
log line composes correctly.

### `src/engine/revolutionaryWar.ts` — 2 sites: Frail wound grant + Leadership Lost on battle loss

**Imports.** Extend the existing `'./abilities'` import at line 6 with a
new `'./traits'` import: `import { addTrait, removeTrait } from
'./traits';`. Extend the types import at line 2 with `TRAIT_LIFECYCLE_RULES`:
`import { ABILITY_LOSS_RULES, TRAIT_LIFECYCLE_RULES } from '../types';`.
`chance` is already imported from `'../rng'` (line 4).

**Site RW-1 — `revolutionaryWar.ts:98` (Frail wound grant).** Route
through `addTrait`. Per Q11: `Frail` has no conflict pair in PR3 (would
conflict with `Hale` once Hale lands in PR4 — for now the d6 path is
unused). The existing guard `if (!victim.traits.includes('Frail'))` is
replaced by `addTrait`'s dedupe:

```ts
  for (let i = 0; i < wounds && candidates.length > 0; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    const victim = candidates.splice(idx, 1)[0];
    if (addTrait(victim, 'Frail')) {
      battle.wounded.push(victim.id);
      addLog(snap, '2.7.2', 'event', `${victim.firstName} ${victim.lastName} wounded at ${battle.name} (gains Frail).`);
    }
  }
```

(Pre-existing `Math.random` at line 96 is **out of scope** per PR2a's
exclusion — leave it.)

**Site RW-2 — `revolutionaryWar.ts:applyBattleLoss` (Leadership Lost on
battle loss).** Per spec AC #10–#13 (the `Leadership` Loss list, items b
and c). Q8 resolution: **senior commander only**, **0.5 chance per
lost battle** (not 1.0 — Leadership is a charismatic-leader trait that
can survive a single defeat). The naval branch (Q6: IN per the spec —
naval-loss-counts) and ground branch are both covered: `applyBattleLoss`
is called from both the naval loss site (line 177) and the ground loss
site (line 207) AND the majority-ground-loss site (line 217). All three
are senior-commander-targeted, so a one-place addition in
`applyBattleLoss` covers all three at once. Add immediately after the
existing skill-decrement loop (after line 125, before the closing brace at
126):

```ts
function applyBattleLoss(
  snap: FullGameSnapshot,
  commander: Politician | undefined,
  penalties: Partial<Record<SkillKey, number>>,
  battleName: string,
): void {
  if (!commander || commander.deathYear) return;
  for (const [skill, amount] of Object.entries(penalties) as [SkillKey, number][]) {
    const before = commander.skills[skill];
    if (loseSkill(commander, skill, amount)) {
      addLog(snap, '2.7.2', 'event',
        `${commander.firstName} ${commander.lastName} falters after the defeat at ${battleName} — ${skill[0].toUpperCase() + skill.slice(1)} ${before} → ${commander.skills[skill]}.`,
        { politicianId: commander.id, battle: battleName });
    }
  }
  // PR3 Leadership Lost on battle loss — senior commander, 0.5 chance per loss.
  // Naval and ground both flow through here; the majority-loss synthesized call
  // ('the campaign') also rolls — intended, a campaign-of-defeats commander
  // gets two shots per phase (per-battle + per-campaign), but they share the
  // same trait, so subsequent rolls find no Leadership to remove (silent).
  if (commander.traits.includes('Leadership')
      && chance(TRAIT_LIFECYCLE_RULES.leadershipLossOnBattleLoss.chance)) {
    if (removeTrait(commander, 'Leadership')) {
      addLog(snap, '2.7.2', 'event',
        `${commander.firstName} ${commander.lastName}'s aura of Leadership fades after the defeat at ${battleName}.`,
        { politicianId: commander.id, battle: battleName });
    }
  }
}
```

The Leadership-loss roll fires on **every** invocation of
`applyBattleLoss` — naval loss (line 177), per-ground-battle loss (line
207), per-campaign majority-loss (line 217). The trait is removed at most
once per phase (subsequent rolls see no `Leadership` to remove). The 0.5
flat chance per lost-battle is the locked Q8 magnitude; the threshold
lives in `TRAIT_LIFECYCLE_RULES.leadershipLossOnBattleLoss.chance` for
one-place tuning.

Naval-loss naval-Leadership question (spec Q6: recommend IN): the
admiral's call path is `applyBattleLoss(snap, admiral, ..., navalName)` —
the new Leadership-loss block fires for the admiral on a naval loss
exactly as it does for the general on a ground loss. **Confirmed naval IN.**

### F-RECONCILE rows tagged DEFER / ALREADY COVERED / Read-only

For completeness — these rows in the spec table need NO code change:

- **`phaseRunners.ts:1379`** (`k.traits.filter(...)` to build the
  inheritable set) — read-only `.filter()`, not a mutation. **No change.**
- **`phaseRunners.ts:1878`** (`p.traits.filter((t) => POSITIVE_TRAITS.
  includes(t)).length` in the faction-leader scoring) — read-only.
  **No change.**
- **`phaseRunners.ts:2287`** (constant array of trait names, not a
  mutation). **No change.**
- **`data/draftImport.ts:26, 223`** (`traits.push(t)` at import time) —
  **leave as direct push.** Per F-RECONCILE: import-time data
  construction, not engine state mutation; the dataset is authored data,
  not a runtime trait grant. **No change.**
- **`pages/FactionLeaderPage.tsx:172`** — UI display. **No change.**
- **Reference `Easily Overwhelmed` / `Flipflopper` time-decay /
  unelected-president `Leadership` loss** — DEFER per spec
  F-LEADERSHIP-LOSS / F-NO-OTHER-PER-TRAIT-TRIGGERS. **No change.**

## UI changes

**None.** PR3 adds no field, no screen, no component. Trait loss /
swap / failed-d6 outcomes surface through the existing log feeds
(`2.1.2`, `2.1.7`, `2.2.3`, `2.4.1`, `2.4.2`, `2.4.3`, `2.7.2` entries
already render in the Half-Term Summary / log feed) and the live Roster
trait column (which reads `p.traits` directly). No new modal, no new
column. Matches AC #22 (no new field) and PR2a/PR2b's "UI: none"
precedent.

## Files to touch (exact, ordered)

**New:** 1 (`src/engine/traits.ts`). **Modified:** 5 engine + types
files.

1. `src/types.ts` — add `TRAIT_LIFECYCLE_RULES` const and `TRAIT_CONFLICTS`
   symmetric map (after `TRACK_SECONDARY_SKILLS` at line 521, before
   `ANYTIME_EVENTS_RULES` at line 523). `as const satisfies` shape.
   **No interface change.**
2. `src/engine/traits.ts` — **NEW.** Pure exports `addTrait`,
   `removeTrait`, `tryGrantTrait` (the last with `d(6)` from `'../rng'`
   and the conflict lookup against `TRAIT_CONFLICTS`).
3. `src/engine/phaseRunners.ts` — imports (lines 2, 5, 6: `TRAIT_LIFECYCLE_RULES`
   + `TRAIT_CONFLICTS`; `addTrait`/`removeTrait`/`tryGrantTrait`; `d`);
   F-RECONCILE rewire at sites 1, 2, 3, 6, 7, 8, 9, 10, 12, 13, 14, 15,
   16, 17 (12 distinct edit blocks); old-age trait decay block after PR2a's
   block (~line 2236); Step-2 re-validation guard in
   `runPhase_2_2_3_FactionLeaders` (~line 1903).
4. `src/engine/continentalCongress.ts` — add `'./traits'` import (after
   line 4); rewire `:144` (CC President Obscure removal via `removeTrait`)
   and `:147` (CC President 20% Leadership via `addTrait`).
5. `src/engine/constitutionalConvention.ts` — add `'./traits'` import (after
   line 3); add `TRAIT_CONFLICTS` to types import on line 1; rewire `:156`
   (Father of Constitution Celebrity via `addTrait`) and `:168`
   (Federalist Egghead via `tryGrantTrait` — d6 site).
6. `src/engine/revolutionaryWar.ts` — extend `'./abilities'` import to add
   `'./traits'` import (after line 6); add `TRAIT_LIFECYCLE_RULES` to types
   import on line 2; rewire `:98` (Frail wound via `addTrait`); add the
   Leadership-loss block inside `applyBattleLoss` (after line 125, before
   the closing brace at 126).

**File count delta:** 1 new code module + 5 modified files = **6 files**
(excluding this brief). **No UI, no dataset regen, no `repair()`/
migration, no `pv.ts` change.**

**Not touched (guardrails):** `src/pv.ts` (no PV-formula change, AC #20);
`src/rng.ts` (no new `Math.random`; PR2a's pre-existing calls at
`revolutionaryWar.ts:88,96` remain out of scope); `src/phases.ts`;
`GameContext.tsx` / `repair()` (no migration, AC #22); the `Trait` union
itself (AC #21 — no new content); `factionLeaderOf` / `presidentId` /
`cabinet` writes (AC #24 — trait loss is politician-local); all PR1/PR2a/
PR2b grant/loss sites (`addExpertise`, `addSkillPoint`/`addCommandPoint`,
`loseSkill`/`loseCommand`, `applyBattleLoss`/`applyBattleEarn`,
`applyFactionLeaderGrants`/`applyPartyLeaderGrants`) — all of these
**remain intact**; PR3 routes the trait-axis half of the same sites
through the new helpers. **No change** to the seed-time `Ideologue`/
`Loyal`/`Ambitious` pushes (locked CP1 / F-RECONCILE "Leave as direct push").
**No `Hale` content** (PR4). **No `Easily Overwhelmed` / `Flipflopper`
time decay** (PR4 designer call). **No unelected-president `Leadership`
loss** (DEFER). **No anytime template content additions** (the existing
`grantTrait` templates fire through the rewired `case 'grantTrait'`).
**No dataset import-time push change** (`draftImport.ts:26,223` left as
direct).

## Test / verification plan

**Build / typecheck.** `npm run build` (`tsc -b && vite build`) and
`npm run lint` (`tsc -b --noEmit`) must both be green (AC #25). Tripwires
to expect: the `TRAIT_LIFECYCLE_RULES` `as const satisfies` shape (any
typo in `oldAge` / `leadershipLossOnBattleLoss` keys fails); the
`TRAIT_CONFLICTS` `Partial<Record<Trait, Trait>>` typing (any trait that
isn't in the `Trait` union fails); the case-block scope around the
rewritten `case 'grantTrait'` in `rollPersonalEvents`; the `as Trait[]`
on `fadingPool`; the non-null assertion `TRAIT_CONFLICTS[t]!` in the
failed-d6 log composition (necessary because `Partial<Record<…>>`
lookups return `T | undefined`).

**Engine smoke test (recommended).** A tiny Node smoke script that
imports the three helpers and exercises:
- **`addTrait` contract:** push absent returns `true`; push held returns
  `false`; the underlying array changed exactly once (no duplicate insert).
- **`removeTrait` contract:** remove held returns `true`; remove absent
  returns `false`; the array filtered exactly the named trait.
- **`tryGrantTrait` no-conflict path:** grant `Kingmaker` on empty
  `traits[]` → `{ granted: true, replaced: null }`; re-grant same →
  `{ granted: false, replaced: null }` (dedupe).
- **`tryGrantTrait` conflict-not-held path:** grant `Charismatic` on
  `traits: ['Leadership']` → `{ granted: true, replaced: null }`
  (Charismatic's conflict is Unlikable, not held; falls through to
  `addTrait`).
- **`tryGrantTrait` conflict-held path, d6 ≥ 4 (mock the rng):** grant
  `Charismatic` on `traits: ['Unlikable']` with mocked `d` returning 4 →
  `{ granted: true, replaced: 'Unlikable' }`; the trait array no longer
  contains `Unlikable` and now contains `Charismatic`.
- **`tryGrantTrait` conflict-held path, d6 < 4:** mocked `d` returns 3 →
  `{ granted: false, replaced: null }`; the trait array unchanged.
- **Symmetric conflict pairs:** for each of the seven pairs above
  (`Charismatic↔Unlikable`, `Harmonious↔Puritan`, `Integrity↔Corrupt`,
  `Efficient↔Passive`, `Egghead↔Incompetent`, `Ideologue↔Impressionable`,
  `Loyal↔Opportunist`), assert both directions of `TRAIT_CONFLICTS` resolve
  (e.g. `TRAIT_CONFLICTS.Charismatic === 'Unlikable'` AND
  `TRAIT_CONFLICTS.Unlikable === 'Charismatic'`).
- **Flat 50% threshold check:** with mocked `d(6)` returning each of
  `1..6`, `tryGrantTrait` granted/replaced exactly when the mocked roll is
  `≥ 4` (so 4, 5, 6 grant; 1, 2, 3 do not).

The smoke script is optional but high-value — the three helpers compose
the entire trait-axis contract and the build alone cannot fully verify
the d6 path.

**Playtest (per CLAUDE.md — `npm run dev`, exercise each path).**

> **Determinism caveat (carried from PR2a/PR2b):** `src/rng.ts` wraps
> `Math.random` — runs are **not** bit-reproducible. Verify each behavior
> **qualitatively** (the swap/failed-d6 happens, the log line reads right,
> the trait array changed by exactly one entry), not by reproducing an
> exact seed. CPU politicians accrue/lose traits invisibly to the UI —
> verify via the log feed and DevTools/IndexedDB save inspection.

A **1772 run** exercises five of the seven conflict pair sites in one
playthrough — the perfect live evidence vehicle:

- **Themed-trait conflict (Site 1).** Start 1772; run several half-terms
  past the inaugural draft so career tracks accumulate threshold years
  (year 4/8/12+). Watch the `2.1.2` log for a `"… sheds X and earns Y —
  the gain wins on a d6."` line on a politician with a held opposite
  (most likely on a Judicial-track politician with `Puritan` rolling
  `Harmonious`). Confirm in DevTools that the array changed by exactly
  one entry (`Puritan` removed, `Harmonious` added).

- **Kingmaker-protege graduation inheritance (Site 8).** Easiest path —
  let a Kingmaker bond mature in 1772, let the protege take Senator
  office, run `2.1.7`. With ~50% odds per fired graduation, several
  graduation cycles will hit the d6 site. Confirm one `"… inherits X
  from <mentor>, shedding Y on a d6."` line on a protege with a held
  opposite; on the failure path, confirm one `"… would have inherited X
  …, but Y holds on a d6."` line.

- **Scandal-scaling forced Corrupt (Site 14).** Anytime events fire at
  `baseFireChance 0.05`, so advance many turns. On a high-`scandalMagnitudeMult`
  era (e.g. nationalism / modern; for 1772 it's `0.5` — scandal won't
  always force; bump `cfg.scandalMagnitudeMult` locally to test). On a
  politician with `Integrity`, watch for `"… Integrity weathers the
  scandal — Corrupt does not take, on a d6."` (failure) OR `"… sheds
  Integrity as the scandal sticks — Corrupt now."` (success).

- **Anytime `grantTrait` partial-apply (Site 13).** Find an anytime
  template that grants `Charismatic` (or modify one for testing) on a
  politician with `Unlikable`. On failed d6, confirm the trait grant
  no-ops BUT the template's `pvBump`/`pvHit`/`skillBump` effects still
  apply and the template's `addLog` line at `2.4.2` (the flavor text)
  still fires. (Per Q7 locked decision.)

- **Federalist Egghead conflict (Site CV-2, constitutionalConvention.ts).**
  Progress 1772 through the Constitutional Convention. Three Federalist
  authors are picked; if any has `Incompetent`, the d6 fires for that
  one. Confirm the `2.4.3` swap/failed log line.

- **Old-age trait decay (B).** Advance many half-terms until the roster
  has politicians aged ≥70 holding `Celebrity` or `Charismatic` (e.g.
  an aging Sam Adams with `Celebrity`). Watch the `2.4.1` log for
  `"… has lost their <Trait> step — the years catch up."`. Confirm: at
  most **one** trait, **−1**, per politician per turn; a politician below
  70 never decays; a politician holding neither `Celebrity` nor
  `Charismatic` is silent. **Independent-roll edge:** an aging legend
  can lose both an ability step (PR2a's `2.4.1` log) AND a trait step
  (PR3's `2.4.1` log) in the same tick — confirm and judge for
  balance.

- **Leadership Lost on battle loss (C).** Progress 1772 to the Rev War.
  On any lost battle (ground or naval) where the senior commander holds
  `Leadership`, the 0.5 chance fires; confirm a `"…'s aura of Leadership
  fades after the defeat at <battle>."` log line under `2.7.2`. After
  the trait is removed, subsequent losses are silent (no Leadership to
  remove). The kingmaker-graduated general (Site 9) granted
  `Leadership` to the mentor, so this site has an evident interaction.

- **Step-2 re-validation guard (F).** Hand-craft a save where Step 2 of
  `2.2.3` selects the **same person** as the prior tick's leader
  (e.g. the prior leader was momentarily invalid because of a `factionLeaderOf`
  mismatch but is still the top-PV candidate). Confirm the election log
  fires (`2.2.3`, "elected to lead the …") but the **four stat-gain log
  lines do NOT fire** (the guard skips `applyFactionLeaderGrants`).

**Edge cases to verify manually (from the spec):**
- Politician at empty `fadingPool` intersection (e.g. an 80-year-old
  with no `Celebrity` and no `Charismatic`) → old-age decay event fires
  but pool is empty; silent no-op (no log, no PV change).
- Legacy save with both `Loyal` and `Opportunist` (corrupted data) →
  `addTrait` no-ops on either, `tryGrantTrait` no-ops on a no-conflict
  re-grant; the state is detected but not destructively repaired.
- Seeding pass (sites 4 & 5): an already-`Ideologue`-seeded politician
  later picks `Impressionable` via Site 2 or Site 13 — the d6 fires
  correctly (the seed-time mutual exclusion is one-shot; post-seed
  conflicts go through `tryGrantTrait` as designed).
- A commander loses a battle and the Leadership-loss roll fires while
  they're also in the casualty-deaths queue — `applyBattleLoss` returns
  early if `commander.deathYear` is set, which `applyCasualties` (line
  86) spares for senior commanders. Belt-and-suspenders.
- An aging executive in the `fadingPool` set (e.g. holding
  `Charismatic`) is the President — losing `Charismatic` swings their
  PV by ~4 (PV-formula reads positive traits at +4). The election cycle
  picks up the new PV via the trailing `refreshPv` at line 2239.
- Carpetbagger ladder hitting all four traits held → `find` returns
  `undefined`, the `if (t && addTrait(...))` guard short-circuits, no
  log line. (Existing behavior, preserved.)

## Risks

Ordered, highest first.

1. **Aggregate trait churn across a long campaign (the headline balance
   risk).** Across the seven conflict pairs × 5+ gain sites × the d6's
   50% rate, trait identity becomes **mutable** in a way it never has
   been before. A politician's `Unlikable` no longer stamps them for
   life — a single career-track random off-track positive (Site 2) at
   threshold N gives a 50% chance to swap into `Charismatic`. Across a
   20-year career that's several conflict-roll opportunities per
   politician. The cumulative effect could read as "traits churn too
   freely" — opposite of the spec's intended rare-and-legible feel.
   Mitigation: every magnitude lives in `TRAIT_LIFECYCLE_RULES` (incl.
   the d6 threshold) for one-place tuning; the human dials
   `conflictD6Threshold` up (5 = 33%) or back (3 = 67%) at playtest.
   The fact that *negative*-on-*positive* swaps work both ways (an
   `Integrity` politician can roll into `Corrupt` and vice versa)
   means the net PV pressure averages out — but PER-POLITICIAN, identity
   feels less stable.

2. **PV swing per swap is up to ~9 points (lose −5/+5, gain +4 or
   −4).** F-PV-BALANCE: trait removal swings PV by 4–5, swap (lose +
   gain) swings up to 9. The d6 cadence (per-event, not per-turn) bounds
   the rate, but a politician swapping `Unlikable` for `Charismatic`
   gains +5 (removed negative) +4 (gained positive) = +9 PV in a single
   tick. That's an election-tipping swing on a marginal candidate.
   Mitigation: the d6 rate is bounded to 50% per fired gain, and the
   gain sites themselves (themed-trait roll, random off-track,
   kingmaker-protege inheritance, anytime `grantTrait`, scandal-Corrupt,
   Federalist Egghead) fire at low individual rates. PV formula
   unchanged — only the underlying `traits[]` array changes.

3. **Old-age trait decay collides with PR2a's old-age ability decay
   (Q4 independent rolls).** Both fire at minAge 70+ with their own
   probability; both can fire on the same politician in the same tick.
   An aging legend (President at 75) can lose `Charismatic` (PR3) AND a
   step of `command` (PR2a) in one `2.4.1` tick — a double PV hit (~9
   points from the trait, ~3 from command-weight) plus a potential
   disqualification from the presidential `command >= 2` gate. Spec
   confirms this as **intended decline drama** but flags it for
   playtest balance. The trait-decay base (`0.05`) is half the
   ability-decay base (`0.10`), so co-fires are rare; mitigation lives
   in `TRAIT_LIFECYCLE_RULES.oldAge.baseChance` if it stings.

4. **Conflict-pair invariant after legacy-save loads.** Saves that
   predate PR3 may have politicians holding both sides of a conflict
   pair (data corruption, or a path PR3 missed). The defensive
   handling (`tryGrantTrait` no-ops on already-held; `addTrait` no-ops;
   `removeTrait` is targeted) means the state is harmless, but it
   means a politician with both `Loyal` and `Opportunist` will read
   both in the Roster — a UI inconsistency. Mitigation: not a code-
   correctness issue; the human can sweep via DevTools if it
   surfaces. **No destructive repair in PR3.**

5. **Leadership-loss-on-battle-loss interacts with the kingmaker mentor
   reward (Site 9).** Site 9 grants `Leadership` to the kingmaker
   mentor on protege graduation; the new RW-2 Leadership-loss block
   can immediately remove it if the same mentor commands a lost battle.
   This is the spec's intended "Leadership is a charismatic-leader
   trait that can survive a single defeat" framing (0.5 chance per
   loss), but the **mentor-then-general** churn could feel
   particularly drama-y — a kingmaker who graduates a protege and
   takes a Sec State command grant (PR2b) then loses a war battle
   and loses Leadership is a plausible chain. Intended; flag for
   playtest narrative quality.

6. **The Step-2 re-validation guard is correct as a one-liner but
   exposes a deeper question.** The current PR2b code calls
   `applyFactionLeaderGrants` unconditionally after `addLog`; the
   re-validation case (same person flickered invalid then re-elected)
   does happen if `current` was `null` at the start of the tick. PR3
   adds a one-line `winner.id !== formerLeaderId` guard. **The deeper
   question** — whether the "leader was somehow null but re-elects as
   the same person" is a state-shape bug elsewhere — is OUT of scope.
   The guard is a correctness fix at the symptom level. (Spec AC #19
   recommended addressing here; the architect confirms.)

## Definition of Done

- `npm run build` passes (`tsc -b && vite build`) and `npm run lint`
  (`tsc -b --noEmit`) is clean (AC #25).
- `TRAIT_LIFECYCLE_RULES` and `TRAIT_CONFLICTS` live in `src/types.ts`
  immediately after `TRACK_SECONDARY_SKILLS`, each `as const satisfies …`
  / `Partial<Record<…>>`-typed; **no magic numbers** in any engine body
  (AC #1).
- `src/engine/traits.ts` exports pure `addTrait` / `removeTrait` /
  `tryGrantTrait`; `tryGrantTrait` uses `d(6)` from `'../rng'` and
  returns `{ granted, replaced }` data — no logging, no PV refresh, no
  side effect beyond `p.traits` (AC #2, #3).
- All 12 phaseRunners.ts F-RECONCILE sites route through the new
  helpers; the two seed-time pushes (`:769–770`, `:1087–1088`) and the
  Ambitious seed (`:1844`) are unchanged per "Leave as direct push";
  the dataset import (`draftImport.ts:26,223`) is unchanged (import-time,
  not engine state, AC #18).
- Old-age trait decay fires in `runPhase_2_4_1_Deaths` after PR2a's
  ability decay block (independent roll, same age gate), removes one
  trait from the held intersection of `TRAIT_LIFECYCLE_RULES.oldAge.
  fadingPool`, with a `2.4.1` log on a real removal; the trailing
  `refreshPv` recomputes PV with no added PV write (AC #4–#9).
- Leadership Lost in `applyBattleLoss` fires on every loss (naval,
  per-ground, per-campaign), at the locked `0.5` chance, removing
  `Leadership` from the senior commander on a real change, with a
  `2.7.2` log; the unelected-president trigger remains DEFER (AC #10–#13).
- `TRAIT_CONFLICTS` lists all 14 entries (seven symmetric pairs),
  `tryGrantTrait` resolves the d6 at threshold `≥ 4` on conflict-held,
  and grants normally on conflict-not-held; the call sites at Sites 1,
  2, 8, 13, 14, CV-2 compose the swap / failed-d6 log lines (AC #14–#17).
- Step-2 re-validation guard in `runPhase_2_2_3_FactionLeaders` skips
  `applyFactionLeaderGrants` when `winner.id === formerLeaderId` (AC #19).
- `src/pv.ts` unchanged; no Use gate changed; no new field; no
  migration (AC #20, #22, #24). No UI change.
- **Playtest** (per CLAUDE.md, 1772 run): themed-trait d6 observed
  resolving on at least one Judicial-track politician; kingmaker-
  protege graduation inheritance d6 observed on at least one bonded
  pair; scandal-scaling Corrupt d6 observed on at least one
  high-`scandalMagnitudeMult` tick; anytime `grantTrait` partial-apply
  observed; Federalist Egghead d6 observed at the Convention; old-age
  trait decay observed on an aging Sam-Adams-type with `Celebrity`;
  Leadership Lost observed on a senior commander after a lost battle —
  all verified **qualitatively** given the rng.ts determinism caveat,
  with CPU observation via the log feed + DevTools/save inspection.

---

**Checkpoint summary (for approval):**

- **Approach:** add the erosion + conflict half of the trait lifecycle
  via one tuning const (`TRAIT_LIFECYCLE_RULES`) + one symmetric lookup
  (`TRAIT_CONFLICTS`) + one new pure helper module
  (`src/engine/traits.ts`: `addTrait` / `removeTrait` / `tryGrantTrait`,
  the last with the d6 inside). F-RECONCILE rewires 12 sites in
  phaseRunners.ts, 2 in continentalCongress.ts, 2 in
  constitutionalConvention.ts, 2 in revolutionaryWar.ts (Frail wound
  grant + Leadership-loss-on-battle-loss inside `applyBattleLoss`).
  Old-age trait decay sits beside PR2a's old-age ability decay in
  `runPhase_2_4_1_Deaths` (independent rolls). Step-2 re-validation
  guard added to `runPhase_2_2_3_FactionLeaders` (PR2b review carryover).
  PV formula, Use gates, fields, migration, and UI all untouched.
- **Files:** 6 (1 new `src/engine/traits.ts`; 5 modified:
  `src/types.ts`, `src/engine/phaseRunners.ts`,
  `src/engine/continentalCongress.ts`,
  `src/engine/constitutionalConvention.ts`,
  `src/engine/revolutionaryWar.ts`). `src/engine/abilities.ts` is
  **NOT** modified (trait-axis const + helpers live in their own files,
  matching the PR1/PR2a/PR2b adjacency pattern). No UI, no dataset, no
  migration.
- **Q2 / Q4 / Q6 / Q8 / Q11 resolutions:** **Q2** old-age trait
  fading pool = `['Celebrity', 'Charismatic']` only (cosmetic fame/
  charm — character traits like `Leadership` / `Integrity` excluded).
  **Q4** old-age trait decay and PR2a's old-age ability decay are
  **independent rolls** (both can fire same tick — intentional decline
  drama). **Q6** old-age trait decay magnitudes: `minAge: 70`,
  `baseChance: 0.05` (HALF of PR2a's 0.10), `ageBracketBonus: {78:
  0.02, 85: 0.03}` (gentler than PR2a's), one trait per fired event.
  **Q8** Leadership Lost fires on **senior commander only** at **0.5
  probability** per lost battle (naval + ground + per-campaign,
  unified via `applyBattleLoss`). **Q11** `Frail` wound grant routes
  through `addTrait` — no `Hale` conflict yet (PR4 content).
- **Highest balance risk:** aggregate trait churn across a long
  campaign — the d6 makes trait identity mutable in a way it never has
  been, with up to ~9 PV swing per swap. The risk is "traits churn too
  freely" — opposite of the spec's rare-and-legible intent. All
  magnitudes live in `TRAIT_LIFECYCLE_RULES` for one-place tuning; the
  human dials `conflictD6Threshold` (5 = sticky incumbent, 3 =
  replacement-leaning) at playtest.
- **Decided beyond the spec:** (a) `TRAIT_CONFLICTS` lives **outside**
  `TRAIT_LIFECYCLE_RULES` (sibling const, not nested) — the spec sketched
  both shapes; the sibling shape is cleaner (the const holds magnitudes,
  the map holds pairings, separating concerns matches PR1's
  `OFFICE_EXPERTISE` / `COMMITTEE_EXPERTISE` sibling pattern). (b)
  `tryGrantTrait` takes `(p, t)` only (not `(p, t, snap)`) and reads
  `d` directly from `'../rng'` — matches the codebase's convention
  (`chance` / `pick` / `d` are module-level imports, never threaded
  through `snap`). (c) Leadership-loss-on-battle-loss is placed
  **inside** `applyBattleLoss` so a single insertion covers naval +
  per-ground + per-campaign losses; subsequent rolls find no Leadership
  to remove (silent). (d) Old-age trait decay log line shape mirrors
  PR2a's "has lost their {Trait} step — the years catch up." (one
  log per real removal, silent on empty pool). (e) Failed-d6 log lines
  fire on EVERY conflict-held path that fails the roll (Sites 1, 2, 8,
  13, 14, CV-2 all compose a `"… would have gained X, but Y holds on a
  d6."` line) — gives the player visible feedback that the resolution
  fired. (f) The kingmaker-inheritance failed-d6 path **drops** the
  pick (per Q8 recommendation), no re-roll over `inheritable`. (g)
  Site 13 (anytime `grantTrait`) opens a block scope around the case
  body to declare `const result` — TypeScript otherwise complains
  about lexical declaration in case clause.

**Brief file:** `/home/user/AMPU/docs/briefs/trait-loss-d6-conflict.md`
