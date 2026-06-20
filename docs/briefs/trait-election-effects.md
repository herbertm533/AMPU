# Brief: Trait Pass A — Election Effects (PR4a)

## Approach

Wire the 15 PR4a-listed traits (`Charismatic`, `Integrity`, `Debater`,
`Propagandist`, `Harmonious`, `Magician`, `Unlikable`, `Puritan`,
`Numberfudger`, `Scandalous`, `Controversial`, `Obscure`, `Domestic Apathy`,
`Carpetbagger`, `Outsider`) into the election arithmetic as **context-aware
additive deltas** layered on top of the existing PV term in `calcStateVote`
(`phaseRunners.ts:3271–3291`), the primaries sort key in
`runPhase_2_9_1_Primaries` (`:3293–3303`), the faction-leader `scoreOf` in
`runPhase_2_2_3_FactionLeaders` (`:1907–1918`), and the committee-chair sort
in `runPhase_2_2_2_Committees` (`:1833–1855`). One new tuning const
`TRAIT_ELECTION_EFFECTS` in `src/types.ts` (a **flat array of rule rows** —
see Tuning call #2) lives next to `TRAIT_LIFECYCLE_RULES`/`TRAIT_CONFLICTS`;
one new pure helper module `src/engine/electionEffects.ts` exposes
`applyTraitElectionBonus(p, ctx, { era, opponentTraits? })`, returning
`{ totalBonus, perTraitBreakdown }` so callers can compose the once-per-race
log line from data (mirrors PR1's `addExpertise` / PR2b's `applyBattleEarn` /
PR3's `tryGrantTrait` "helper returns data, callers compose logs" pattern).
The four call sites add the helper's `totalBonus` to their existing score and
the callers (which already know the winner and the race-id) emit a single
summary log line per race per politician. `pv.ts` is untouched (F-PV-
INTERACTION); the flat ±4 / −5 / Kingmaker +6 trait weights stay as the
structural floor and the new layer is texture (Tuning call #1 chose **`SMALL
= 2`, `MEDIUM = 4`, `LARGE = 8`** as PM-recommended; see below).

**Locked CP1 decisions carried in (do not relitigate).** Six contexts
(`presGeneral`, `presPrimary`, `house`, `senatePre17`, `governor`,
`internalParty`); Senate uses `senatePre17` in both eras (no era branch);
flat-array shape; Carpetbagger label KEEP; Numberfudger WIRE-SMALL; Debater
SHIP FLAT; opponent-conditional Integrity vs tainted (`+MED` → `+LRG`)
fires in `presGeneral` / `house` / `governor` only; symmetric for
Scandalous/Controversial vs Integrity; Domestic Apathy era-scaled
(`-SMALL` in `independence`/`federalism`, `-MEDIUM` in `nationalism`+).

**Alternative rejected — nested `Record<Trait, Record<Context, Magnitude>>`.**
The spec offered both shapes (AC #1). A nested record is denser for the
~50 magnitudes but **ugly for the four cross-cutting cases** PR4a needs:
the Domestic-Apathy era branch, the Integrity × tainted-opponent bump,
the Unlikable vs Charismatic bump, and the Scandalous/Controversial vs
Integrity bump. Each of those would force per-cell sentinel objects with
optional fields (`era?`, `opponentConditional?`) inside the inner record,
breaking the nested shape's readability. The **flat array of rule rows**
matches `TRAIT_LIFECYCLE_RULES.oldAge.ageBracketBonus`'s precedent (also
an array of small predicate-shaped rows), iterates cleanly in the helper,
and the type checker still gives exhaustiveness because every row's
`{ trait, context, magnitude }` is required.

**Alternative rejected — inlining the helper in `phaseRunners.ts`.** A
~50-line helper that handles 6 contexts + opponent-conditional + era-scaled
+ the per-trait breakdown for log composition is large enough to earn its
own module (Tuning call #3). The `src/engine/electionEffects.ts` placement
mirrors PR1's `expertise.ts`, PR2a/PR2b's `abilities.ts`, PR3's `traits.ts`
— the codebase's established "one axis, one helper file" shape.

## State & type changes

### `src/types.ts` — new `TRAIT_ELECTION_EFFECTS` const + `ElectionContext` union

Place **immediately after** `TRAIT_CONFLICTS` (closes at `types.ts:569`)
and **before** `ANYTIME_EVENTS_RULES` (`types.ts:571`). This keeps the
trait-axis consts adjacent (`TRAIT_LIFECYCLE_RULES`, `TRAIT_CONFLICTS`,
`TRAIT_ELECTION_EFFECTS`) — the established PR1/PR2b/PR3 "all magnitudes
for the axis live in one place" pattern.

```ts
// PR4a election contexts. Six locked contexts (spec AC #2). Senate uses
// senatePre17 in BOTH AMPU scenarios (neither reaches 1913 / 17th Amendment;
// spec F-SENATE-BOTH-ERAS).
export type ElectionContext =
  | 'presGeneral'
  | 'presPrimary'
  | 'house'
  | 'senatePre17'
  | 'governor'
  | 'internalParty';

// PR4a per-trait per-context magnitudes. Flat array of rule rows so the four
// cross-cutting cases (era-scaled Domestic Apathy, Integrity bump vs tainted
// opponent, Unlikable bump vs Charismatic opponent, Scandalous/Controversial
// bump vs Integrity opponent) fit naturally — a nested Record would force
// sentinel objects inside the inner shape.
//
// Magnitude bands (CP1 locked at the band level; numerics PM-recommended):
//   SMALL  = 2  (≈ 2 pct-pts on calcStateVote score; ≈ 2 score-pts on internal-party path)
//   MEDIUM = 4
//   LARGE  = 8
//
// Negative-trait rows carry negative magnitudes. `era` is undefined for rows
// that apply in BOTH AMPU scenarios; populated only on the Domestic-Apathy
// era split (per F-DOMESTIC-APATHY-ERA-SCALED). `opponentConditional` is the
// per-row bump that fires when the opponent holds the listed trait — used
// for the three locked cases (spec AC #15).
export const TRAIT_ELECTION_BANDS = {
  SMALL: 2,
  MEDIUM: 4,
  LARGE: 8,
} as const satisfies { SMALL: number; MEDIUM: number; LARGE: number };

export interface TraitElectionRule {
  trait: Trait;
  context: ElectionContext;
  magnitude: number;                 // signed; negative for hits
  era?: Era;                          // row applies only when snap era matches; undefined = all eras
  opponentConditional?: {
    ifOpponentHas: Trait[];          // if ANY opponent holds one of these, swap to bumped
    bumpedMagnitude: number;         // signed; replaces magnitude when triggered (not added)
  };
}

export const TRAIT_ELECTION_EFFECTS: TraitElectionRule[] = [
  // --- Charismatic --- (all eras; mild dampening in pre-17 Senate per F-SENATE-BOTH-ERAS)
  { trait: 'Charismatic', context: 'presGeneral',   magnitude:  TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Charismatic', context: 'presPrimary',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Charismatic', context: 'house',         magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Charismatic', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Charismatic', context: 'governor',      magnitude:  TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Charismatic', context: 'internalParty', magnitude:  TRAIT_ELECTION_BANDS.SMALL  },

  // --- Integrity --- (all eras; opponent-conditional MEDIUM vs tainted in presGeneral/house/governor only — AC #15)
  { trait: 'Integrity', context: 'presGeneral', magnitude: TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Scandalous', 'Controversial', 'Corrupt'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Integrity', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Integrity', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Scandalous', 'Controversial', 'Corrupt'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Integrity', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Integrity', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Scandalous', 'Controversial', 'Corrupt'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Integrity', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.SMALL },

  // --- Debater --- (all eras flat — Q3 SHIP FLAT; LARGE on internal-party / Webster-Hayne)
  { trait: 'Debater', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Debater', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Debater', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Debater', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Debater', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Debater', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.LARGE  },

  // --- Propagandist --- (concept-native to both eras; term anachronism is display-only)
  { trait: 'Propagandist', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Propagandist', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.SMALL  },

  // --- Harmonious --- (consensus archetype; Pierce 1852 — MEDIUM in convention/senate)
  { trait: 'Harmonious', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Harmonious', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Harmonious', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Harmonious', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Harmonious', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Harmonious', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Magician --- (Van Buren/Douglas; LARGE on senatePre17 + internal-party)
  { trait: 'Magician', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Magician', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Magician', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Magician', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.LARGE  },
  { trait: 'Magician', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Magician', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.LARGE  },

  // --- Unlikable --- (Adams 1800; opp-conditional vs Charismatic in presGeneral only)
  { trait: 'Unlikable', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Charismatic'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Unlikable', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Unlikable', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Unlikable', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Unlikable', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Unlikable', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Puritan --- (Garrison/Sumner — consensus blocker; MEDIUM hit on senatePre17/internal)
  { trait: 'Puritan', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Puritan', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Puritan', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Puritan', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Puritan', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Puritan', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Numberfudger --- (Q2 WIRE-SMALL; only popular-vote contexts, no internal/senate/primary)
  { trait: 'Numberfudger', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Numberfudger', context: 'house',       magnitude: -TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Numberfudger', context: 'governor',    magnitude: -TRAIT_ELECTION_BANDS.SMALL },

  // --- Scandalous --- (Hamilton-1797 vs Jackson-1828 contrast; opp-conditional vs Integrity)
  { trait: 'Scandalous', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Scandalous', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Scandalous', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Scandalous', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Scandalous', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Scandalous', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Controversial --- (Jackson/Douglas/Brooks; symmetric with Scandalous on Integrity)
  { trait: 'Controversial', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Controversial', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Controversial', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Controversial', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Controversial', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Controversial', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Obscure --- (Pierce 1852 dark-horse: POSITIVE in presPrimary; legislators know everyone in senatePre17)
  { trait: 'Obscure', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Obscure', context: 'presPrimary',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Obscure', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  // senatePre17: NONE (no row — legislators know everyone; spec's intentional gap)
  { trait: 'Obscure', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Obscure', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Domestic Apathy --- (F-DOMESTIC-APATHY-ERA-SCALED; era-split on presGeneral; flat on house/governor)
  // 1772 scenario (independence + federalism) — -SMALL on presGeneral
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  // 1856 scenario (nationalism+) — -MEDIUM on presGeneral
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism'  },
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'       },
  // House / Governor — flat MEDIUM all eras (domestic district / state issues hit consistently)
  { trait: 'Domestic Apathy', context: 'house',    magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Domestic Apathy', context: 'governor', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  // senatePre17 / presPrimary / internalParty: NONE (no rows)

  // --- Carpetbagger --- (label kept per Q1; trait alone is the gate — see Carpetbagger note below)
  { trait: 'Carpetbagger', context: 'house',       magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Carpetbagger', context: 'senatePre17', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Carpetbagger', context: 'governor',    magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  // presGeneral / presPrimary / internalParty: NONE (state-level only)

  // --- Outsider --- (Jackson/Frémont; flat per Q5 — no anti-establishment mood meter in PR4a)
  { trait: 'Outsider', context: 'presGeneral',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Outsider', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Outsider', context: 'house',         magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Outsider', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Outsider', context: 'governor',      magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Outsider', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
];
```

**Carpetbagger gate clarification (re-resolves Open Q7 in the spec).** The
spec's edge case worried about `p.birthState`. Reading `src/types.ts:659–695`:
`Politician` has **no** `birthState` field; the only relocation hooks are
`p.state` (current) and `p.altState` (the seeded target). Critically, the
**`Carpetbagger` trait is granted ONLY on a successful relocation roll**
(`phaseRunners.ts:560–565`, `resolveRelocation`). So `p.traits.includes
('Carpetbagger')` IS the "ran outside their birth state" signal — no extra
gate is required, the trait already encodes the geographic context. The
helper does not branch on state; it reads `p.traits` like every other
row. (If a future PR adds `birthState` for finer-grained checks,
`TRAIT_ELECTION_EFFECTS` can be extended with a row-level predicate; PR4a
does not need it.)

### Save / migration impact

**None.** Spec AC #5 / AC #22: PR4a adds no field to `Politician`,
`GameState`, or any snapshot type and requires **no `repair()` change**. The
helper reads existing `p.traits: Trait[]` and the era from `snap.game.
currentEra` (declared at `types.ts:991`). Old IndexedDB saves load unchanged
and the next election cycle immediately picks up the new effects.

## Engine changes (pure logic)

All deterministic over the snapshot (spec AC #19). The helper uses **no
`Math.random`**, no `chance()`, no `d()`. The pre-existing `Math.random` at
`calcStateVote:3281` is unchanged and out of scope per the spec.

### `src/engine/electionEffects.ts` — NEW MODULE (Tuning call #3: YES)

Place a single pure helper that all four call sites consume, returning a
`{ totalBonus, perTraitBreakdown }` shape so callers can compose either the
once-per-race summary log (default, Tuning call #5) or a per-trait breakdown
without rewriting the helper.

```ts
import type { Politician, Era, Trait, TraitElectionRule, ElectionContext } from '../types';
import { TRAIT_ELECTION_EFFECTS } from '../types';

export interface TraitElectionBreakdown {
  totalBonus: number;
  perTraitBreakdown: { trait: Trait; bonus: number }[];
}

// Per-trait per-context bonus for a single politician given the election context.
// Pure: deterministic in (p.traits, ctx, era, opts.opponentTraits). Iterates
// TRAIT_ELECTION_EFFECTS once. Era-scaled rows match on era; opponent-
// conditional rows swap to bumpedMagnitude when ANY opponent trait matches.
//
// AC #4: pure, no addLog, no RNG, no PV mutation. Callers compose the
// summary log line from the returned data.
export function applyTraitElectionBonus(
  p: Politician,
  ctx: ElectionContext,
  opts: { era: Era; opponentTraits?: Trait[] },
): TraitElectionBreakdown {
  const opp = opts.opponentTraits ?? [];
  const perTraitBreakdown: { trait: Trait; bonus: number }[] = [];
  let totalBonus = 0;
  for (const row of TRAIT_ELECTION_EFFECTS) {
    if (row.context !== ctx) continue;
    if (row.era !== undefined && row.era !== opts.era) continue;
    if (!p.traits.includes(row.trait)) continue;
    let bonus = row.magnitude;
    if (row.opponentConditional && opp.length > 0) {
      const triggered = row.opponentConditional.ifOpponentHas.some((t) => opp.includes(t));
      if (triggered) bonus = row.opponentConditional.bumpedMagnitude;
    }
    if (bonus !== 0) {
      totalBonus += bonus;
      perTraitBreakdown.push({ trait: row.trait, bonus });
    }
  }
  return { totalBonus, perTraitBreakdown };
}
```

Why `opts.era` is a parameter (not derived inside): per Tuning call #B
below, the era is `snap.game.currentEra` (already on `GameState` at
`types.ts:991`); the helper stays decoupled from `FullGameSnapshot` to match
PR3's `tryGrantTrait(p, t)` precedent — module-level dependency on
`'../types'` only, no `snap` plumbing. Callers pass `snap.game.currentEra`
at each site (one short line).

### `src/engine/phaseRunners.ts` — F-RECONCILE: 4 call-site wirings + log composition

**Imports.** Extend the existing types-side import at **line 2**: add
`ElectionContext, TraitElectionRule` to the named list (used only for the
helper's type signatures — the per-call-site code reads from
`TRAIT_ELECTION_EFFECTS` via the helper, so `TRAIT_ELECTION_EFFECTS` itself
need NOT be imported into `phaseRunners.ts`; the helper hides the table).
Add a new `'./electionEffects'` import line beside `'./traits'` (line 6):
`import { applyTraitElectionBonus } from './electionEffects';`. No new rng
import; the helper is pure.

---

**Site G-1: `calcStateVote` (`phaseRunners.ts:3271–3291`) — add context +
opponent threading.** This is the **one helper function** that already
serves four contexts (`presGeneral` via 2.9.4, `governor` via 2.9.5,
`senatePre17` via 2.9.6 Senate loop, `house` via 2.9.6 House loop) by being
called from four sites. The wire is at `calcStateVote` itself plus its four
callers.

**Signature change.** Add an `ElectionContext` parameter (spec AC #8):

```ts
function calcStateVote(
  snap: FullGameSnapshot,
  stateId: string,
  candidates: Politician[],
  ctx: ElectionContext,
): { politicianId: string; partyId: PartyId; pct: number; votes: number; traitBonus: number; traitBreakdown: { trait: Trait; bonus: number }[] }[] {
  const state = snap.states.find((s) => s.id === stateId)!;
  const totalVotes = 100_000 + state.electoralVotes * 5000;
  const era = snap.game.currentEra;
  const scores = candidates.map((c) => {
    const partyId = c.partyId!;
    const enthusiasm = snap.game.enthusiasm[c.ideology]?.[partyId] ?? 0;
    const baseLean = partyId === 'BLUE' ? -state.bias : state.bias;
    const partyPref = partyId === 'BLUE' ? -snap.game.partyPreference : snap.game.partyPreference;
    const pv = c.pvCache;
    const factionBias = electionFactionBias(snap, c.factionId, c.id);
    // PR4a trait election effects. Opponent = the OTHER candidate's traits in the
    // 2-candidate field. For the rare >2 case the helper sees the union; opp-
    // conditional rows fire if ANY opponent matches (spec Edge case).
    const opponentTraits = candidates
      .filter((other) => other.id !== c.id)
      .flatMap((other) => other.traits);
    const { totalBonus: traitBonus, perTraitBreakdown: traitBreakdown } =
      applyTraitElectionBonus(c, ctx, { era, opponentTraits });
    const score = 50 + baseLean * 5 + partyPref * 5 + enthusiasm * 2 + pv * 0.1
                + factionBias + traitBonus
                + (Math.random() - 0.5) * 8;
    return { c, score: Math.max(1, score), traitBonus, traitBreakdown };
  });
  const total = scores.reduce((s, x) => s + x.score, 0);
  return scores.map(({ c, score, traitBonus, traitBreakdown }) => ({
    politicianId: c.id,
    partyId: c.partyId!,
    pct: (score / total) * 100,
    votes: Math.round((score / total) * totalVotes),
    traitBonus,
    traitBreakdown,
  }));
}
```

The returned tally rows now carry `traitBonus` + `traitBreakdown` so the
**callers** (not `calcStateVote` itself, which runs per-state per-candidate)
emit the once-per-race summary log line from data. This matches the PM-
locked "once-per-race summary, not per-state" log fidelity (Tuning call #5).

**Caller wirings (4 sites).** Each passes the correct context; the
presidential general additionally composes the once-per-race log (because
presidential is one race across all states — log fires once per winner per
*election*, not per state).

- **`runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3305–3353`)** —
  `presGeneral` context. The per-state loop at `:3311–3320` aggregates
  state results; per-state trait deltas live in the tally rows but the log
  composition lives outside the loop (one log line per **candidate** per
  election, after the loop). Insert at line `3312`:

  ```ts
    const tally = calcStateVote(snap, s.id, candidates, 'presGeneral');
  ```

  Then **after the per-state loop closes** (line `3320`) and **before
  `const winner = ...`** (line `3321`), aggregate the breakdown and emit
  one summary log per candidate. The trait bonus is constant per
  politician per race (it depends only on `p.traits + opp.traits + ctx +
  era`), so the FIRST state's tally captures it cleanly:

  ```ts
    // Once-per-race trait-bonus summary log (spec AC #16). The bonus is
    // identical across states (only PV/lean/enthusiasm/noise vary); pull
    // the first state's breakdown.
    if (stateResults.length > 0) {
      const firstTally = calcStateVote(snap, snap.states[0].id, candidates, 'presGeneral');
      // ... (the above loop already ran calcStateVote per state; preserve
      // the FIRST iteration's tally outside the loop instead of re-running)
    }
  ```

  **Cleaner:** capture the breakdown from the FIRST iteration of the
  existing loop and emit logs after. Rewrite the loop head:

  ```ts
    let firstTally: ReturnType<typeof calcStateVote> | null = null;
    for (const s of snap.states) {
      const tally = calcStateVote(snap, s.id, candidates, 'presGeneral');
      if (firstTally === null) firstTally = tally;
      // ... existing blueEv/redEv/bluePop/redPop/stateResults push ...
    }
    // Once-per-race trait summary log (PM Tuning #5). Composed from the
    // captured firstTally — bonus is identical across all 50 states.
    if (firstTally) {
      for (const row of firstTally) {
        if (row.traitBreakdown.length === 0) continue;
        const c = candidates.find((cc) => cc.id === row.politicianId)!;
        addLog(snap, '2.9.4', 'election',
          composeTraitSummary(c, row.traitBreakdown, 'presidential general'),
          { politicianId: c.id });
      }
    }
  ```

- **`runPhase_2_9_5_Governors` (`phaseRunners.ts:3355–3385`)** —
  `governor` context. The per-state loop at `:3356–3384` runs an
  independent gubernatorial race per state. Each state's race is its own
  election → one summary log per winning candidate per state. Replace
  line `3364`:

  ```ts
        const tally = calcStateVote(snap, s.id, list, 'governor');
  ```

  Then **immediately after** `tally.sort((a, b) => b.pct - a.pct);`
  (line `3365`), compose the log for each candidate with a non-empty
  breakdown:

  ```ts
        for (const row of tally) {
          if (row.traitBreakdown.length === 0) continue;
          const c = list.find((cc) => cc.id === row.politicianId)!;
          addLog(snap, '2.9.5', 'election',
            composeTraitSummary(c, row.traitBreakdown, `${s.abbr} governor`),
            { politicianId: c.id, stateId: s.id });
        }
  ```

- **`runPhase_2_9_6_Congressional` Senate loop (`phaseRunners.ts:3418–
  3437`)** — `senatePre17` context. Each senate seat is its own race.
  Replace line `3428`:

  ```ts
        const tally = calcStateVote(snap, s.id, list, 'senatePre17');
  ```

  Compose log per race after `tally.sort` at line `3429`:

  ```ts
        for (const row of tally) {
          if (row.traitBreakdown.length === 0) continue;
          const c = list.find((cc) => cc.id === row.politicianId)!;
          addLog(snap, '2.9.6', 'election',
            composeTraitSummary(c, row.traitBreakdown, `${s.abbr} senate`),
            { politicianId: c.id, stateId: s.id });
        }
  ```

- **`runPhase_2_9_6_Congressional` House loop (`phaseRunners.ts:3439–
  3457`)** — `house` context. Each rep seat is its own race. Replace
  line `3448`:

  ```ts
        const tally = calcStateVote(snap, s.id, list, 'house');
  ```

  Compose log per race after `tally.sort` at line `3449`:

  ```ts
        for (const row of tally) {
          if (row.traitBreakdown.length === 0) continue;
          const c = list.find((cc) => cc.id === row.politicianId)!;
          addLog(snap, '2.9.6', 'election',
            composeTraitSummary(c, row.traitBreakdown, `${s.abbr} house`),
            { politicianId: c.id, stateId: s.id });
        }
  ```

**`composeTraitSummary` helper** — declare as a **module-level** private
function near the top of the file's election section (e.g. immediately
after `ideologyAlignment` at `phaseRunners.ts:3262–3269`). Pure string
composition; signature:

```ts
function composeTraitSummary(
  c: Politician,
  breakdown: { trait: Trait; bonus: number }[],
  raceLabel: string,
): string {
  const positives = breakdown.filter((b) => b.bonus > 0);
  const negatives = breakdown.filter((b) => b.bonus < 0);
  const sum = breakdown.reduce((s, b) => s + b.bonus, 0);
  const sign = sum >= 0 ? '+' : '';
  const parts: string[] = [];
  if (positives.length > 0) {
    const ptext = positives.map((b) => b.trait).join(', ');
    parts.push(`${ptext} (+${positives.reduce((s, b) => s + b.bonus, 0)})`);
  }
  if (negatives.length > 0) {
    const ntext = negatives.map((b) => b.trait).join(', ');
    parts.push(`${ntext} (${negatives.reduce((s, b) => s + b.bonus, 0)})`);
  }
  return `${c.firstName} ${c.lastName}'s traits net ${sign}${sum} in the ${raceLabel} race — ${parts.join(' / ')}.`;
}
```

Example output for a Charismatic + Integrity vs Scandalous opponent
governor in NY: `"Henry Clay's traits net +6 in the NY governor race —
Charismatic, Integrity (+6)."`. For a Scandalous + Controversial vs
Integrity opponent presidential: `"Alexander Hamilton's traits net -16 in
the presidential general race — Scandalous, Controversial (-16)."`. Format
matches PR2a/PR2b/PR3 log voice (third-person "Name's X did Y").

---

**Site G-2: `runPhase_2_9_1_Primaries` (`phaseRunners.ts:3293–3303`) —
`presPrimary` context.** Field-wide sort (not head-to-head), no opponent
arg. Replace lines `3296–3300`:

```ts
  for (const partyId of ['BLUE', 'RED'] as PartyId[]) {
    const candidates = snap.politicians.filter((p) => p.partyId === partyId && !p.deathYear && !p.retiredYear && p.age >= 35 && p.age <= 80 && p.command >= 2);
    const era = snap.game.currentEra;
    const sortable = candidates.map((c) => {
      const { totalBonus, perTraitBreakdown } = applyTraitElectionBonus(c, 'presPrimary', { era });
      return { c, score: c.pvCache + c.command * 5 + totalBonus, breakdown: perTraitBreakdown };
    });
    sortable.sort((a, b) => b.score - a.score);
    const top = sortable[0]?.c ?? null;
    out[partyId] = top;
    if (top) {
      addLog(snap, '2.9.1', 'election',
        `${top.firstName} ${top.lastName} wins ${partyId === 'BLUE' ? 'Democratic' : 'Republican'} primary.`);
      // Once-per-race trait summary log (PM Tuning #5). Only fire on the WINNER.
      const topRow = sortable[0]!;
      if (topRow.breakdown.length > 0) {
        addLog(snap, '2.9.1', 'election',
          composeTraitSummary(top, topRow.breakdown, `${partyId === 'BLUE' ? 'Democratic' : 'Republican'} primary`),
          { politicianId: top.id });
      }
    }
  }
```

No opponent for `presPrimary` (Tuning call #C): primaries are field-wide,
not head-to-head; opponent-conditional rows (Integrity vs tainted, Unlikable
vs Charismatic, etc.) do not apply in `presPrimary` per spec AC #15 anyway
("does NOT fire in `senatePre17`, `presPrimary`, or `internalParty`"), so
passing no `opponentTraits` is correct. Log fires once for the winner only
(noise minimization).

---

**Site G-3: `runPhase_2_2_3_FactionLeaders` `scoreOf`
(`phaseRunners.ts:1907–1918`) — `internalParty` context.** Composes with the
existing LEADERSHIP_RULES `posCount` floor (AC #10 / AC #24 — both layers
keep). The existing floor stays as the structural baseline; the new layer
is texture. Add the bonus inside the `scoreOf` closure:

```ts
      const era = snap.game.currentEra;
      const scoreOf = (p: Politician): number => {
        const idol = IDEOLOGY_ORDER.indexOf(p.ideology);
        const fitPenalty = center !== null
          ? LEADERSHIP_RULES.fitPenalty * Math.abs(idol - center)
          : 0;
        const posCount = p.traits.filter((t) => POSITIVE_TRAITS.includes(t)).length;
        const traitBonus = Math.min(
          LEADERSHIP_RULES.traitBonusCap,
          LEADERSHIP_RULES.traitBonusPerPositive * posCount,
        );
        // PR4a: per-trait per-context bonus. Composes additively with the
        // existing positives-count floor (AC #10/AC #24).
        const { totalBonus: pr4aBonus } = applyTraitElectionBonus(p, 'internalParty', { era });
        return p.pvCache - fitPenalty + traitBonus + pr4aBonus;
      };
```

**Opponent traits in `internalParty`** (Tuning call #C resolution): the
spec leaves the >2-candidate field-aggregation question open. Resolution:
**no `opponentTraits` passed** for the `internalParty` site. Per spec
AC #15, opponent-conditional rows do NOT fire in `internalParty` (the
historian's "legislators / party regulars internalize the scandal"
finding). So passing `opponentTraits` would be a no-op and adds plumbing
cost — skip. The faction-leader race is a multi-candidate sort, not a
head-to-head; field-aggregation semantics are moot here.

**Logging for `internalParty`** (Tuning call #5 resolution): match the
existing leadership-feed surface. The faction-leader install already emits
one `addLog` line at `:1936–1937` ("X elected to lead the Y"). Add a
summary log line **only on the winner** (the eligible-sort's top
politician), after the existing install log at `:1937`:

```ts
        addLog(snap, '2.2.3', 'appointment',
          `${winner.firstName} ${winner.lastName} elected to lead the ${f.name}.`);
        const { perTraitBreakdown: winnerBreakdown } =
          applyTraitElectionBonus(winner, 'internalParty', { era });
        if (winnerBreakdown.length > 0) {
          addLog(snap, '2.2.3', 'appointment',
            composeTraitSummary(winner, winnerBreakdown, `${f.name} leadership`),
            { politicianId: winner.id });
        }
```

Similarly add after the Step 3 challenge-success log at `:1991–1992`:

```ts
      addLog(snap, '2.2.3', 'appointment',
        `${challenger.firstName} ${challenger.lastName} unseats ${leader.firstName} ${leader.lastName} as leader of the ${f.name}.`);
      const { perTraitBreakdown: chBreakdown } =
        applyTraitElectionBonus(challenger, 'internalParty', { era });
      if (chBreakdown.length > 0) {
        addLog(snap, '2.2.3', 'appointment',
          composeTraitSummary(challenger, chBreakdown, `${f.name} leadership`),
          { politicianId: challenger.id });
      }
```

Same `era` variable can be declared once at the top of
`runPhase_2_2_3_FactionLeaders` (after `const cfg = ...` at `:1864`):
`const era = snap.game.currentEra;`. Both Step-2 and Step-3 sites share it.

---

**Site G-4: `runPhase_2_2_2_Committees` top-1 sort (`phaseRunners.ts:1833–
1855`) — `internalParty` context.** The current sort is on a single skill
key (`b.skills[skillKey] - a.skills[skillKey]`); adding `traitVoteAdjust`
to a 0–5 range easily dominates the skill spread (the SMALL band alone is
2 — equal to the difference between skill=3 and skill=5). Spec AC #11
recommended SKIP at the PM level. Architect resolution: **SKIP for PR4a**.

**Rationale.** (a) The skill-only sort is the established mechanic for
committee-chair selection; the trait bonus would overshadow it (a Magician
with `internalParty +8 LARGE` beats a Magician-less politician at skill=5
vs skill=2 with trait=0 — but the trait-only-skill-gate semantic is by
design — the chair is supposed to pick the most-skilled member). (b) The
spec's PM call was explicit: "**skip** unless architect finds it trivial",
and "trivial" the wire is **not** (the trait bonus dominates the
0–5 skill range, changing the mechanic's character). (c) PR4a's wider goal
is "traits matter in elections" — committee-chair selection is an
appointment, not an election; the F-RECONCILE row is included for
completeness but ships out-of-scope.

If the human at CP2 wants it in: the wire is

```ts
    const era = snap.game.currentEra;
    const candidate = all.sort((a, b) => {
      const aBonus = applyTraitElectionBonus(a, 'internalParty', { era }).totalBonus;
      const bBonus = applyTraitElectionBonus(b, 'internalParty', { era }).totalBonus;
      return (b.skills[skillKey] + bBonus) - (a.skills[skillKey] + aBonus);
    })[0];
```

Recommend deferring to a future "internal-leadership tuning" pass; the
brief includes the wire as ready-to-flip text.

### F-RECONCILE table (all sites, ordered)

| Site | File:line | Context | Wire | Logging |
| --- | --- | --- | --- | --- |
| G-1a | `phaseRunners.ts:3271` (`calcStateVote`) | (param) | Add `ctx: ElectionContext` arg; add `applyTraitElectionBonus` per-candidate inside the score; return `traitBonus` + `traitBreakdown` on each tally row | — (per-state; logs fire at callers) |
| G-1b | `phaseRunners.ts:3312` (`runPhase_2_9_4_PresidentialGeneral`) | `presGeneral` | Pass `'presGeneral'` to `calcStateVote`; capture first-iteration tally; after-loop summary log per candidate with non-empty breakdown | `2.9.4 election`, one line per candidate per election |
| G-1c | `phaseRunners.ts:3364` (`runPhase_2_9_5_Governors`) | `governor` | Pass `'governor'`; summary log per candidate per state after `tally.sort` | `2.9.5 election`, per state |
| G-1d | `phaseRunners.ts:3428` (`runPhase_2_9_6_Congressional` Senate) | `senatePre17` | Pass `'senatePre17'`; summary log per senate race | `2.9.6 election`, per senate seat |
| G-1e | `phaseRunners.ts:3448` (`runPhase_2_9_6_Congressional` House) | `house` | Pass `'house'`; summary log per house race | `2.9.6 election`, per house seat |
| G-2 | `phaseRunners.ts:3296–3300` (`runPhase_2_9_1_Primaries`) | `presPrimary` | Add bonus to sort key (`pvCache + command*5 + totalBonus`); summary log on winner only | `2.9.1 election`, one line per party winner |
| G-3a | `phaseRunners.ts:1917` (`runPhase_2_2_3_FactionLeaders` Step-2 `scoreOf`) | `internalParty` | Add `pr4aBonus` inside `scoreOf`; summary log after install log at `:1937` | `2.2.3 appointment`, on winner |
| G-3b | `phaseRunners.ts:1991` (`runPhase_2_2_3_FactionLeaders` Step-3 challenge-success) | `internalParty` | Summary log on successful challenger after the unseat log | `2.2.3 appointment`, on challenger |
| G-4 | `phaseRunners.ts:1835` (`runPhase_2_2_2_Committees` top-1 sort) | `internalParty` | **DEFER per AC #11** — wire prepared in the brief but not landed in PR4a | — |

### Determinism / RNG

The helper is **pure**. No `Math.random`, no `chance()`, no `d()`. The
log-composition helper `composeTraitSummary` is pure string building. The
pre-existing `Math.random` at `calcStateVote:3281` is unchanged and
explicitly out of scope per the spec (it was carried over from pre-PR1).

### Save/migration

**No new field; no `repair()` change.** `Politician`, `GameState`, and the
snapshot type are untouched. Old IndexedDB saves load and play unchanged
on their next election cycle.

## UI changes

**None.** PR4a adds no field, no screen, no component. Trait election
effects surface only via:
- The log feed (`2.9.1`, `2.9.4`, `2.9.5`, `2.9.6`, `2.2.3` summary lines
  rendered by the existing Half-Term Summary / events feed).
- The Roster trait column (reads `p.traits` directly; unchanged).

No new modal, no tooltip, no "why did this election go this way" surface.
Matches the spec's "no UI work in PR4a" assumption (Open Q11) and the
PR1/PR2a/PR2b/PR3 "UI: none" precedent.

## Files to touch (exact, ordered)

**New:** 1 module. **Modified:** 2 files.

1. `src/types.ts` — add `ElectionContext` union, `TraitElectionRule`
   interface, `TRAIT_ELECTION_BANDS` const, and the `TRAIT_ELECTION_EFFECTS`
   flat-array const (after `TRAIT_CONFLICTS` at line 569, before
   `ANYTIME_EVENTS_RULES` at line 571). **No interface change** to
   `Politician` / `GameState`.
2. `src/engine/electionEffects.ts` — **NEW.** Pure export
   `applyTraitElectionBonus(p, ctx, opts) → { totalBonus,
   perTraitBreakdown }`; reads `TRAIT_ELECTION_EFFECTS`; no addLog, no RNG,
   no PV mutation.
3. `src/engine/phaseRunners.ts` — imports (line 2: `ElectionContext`,
   `TraitElectionRule`; line 6 region: new `'./electionEffects'` import);
   add module-level `composeTraitSummary` helper after `ideologyAlignment`
   (~line 3270); wire G-1a (`calcStateVote` signature + body, ~3271);
   wire G-1b/c/d/e at the four callers (lines 3312, 3364, 3428, 3448);
   wire G-2 (`runPhase_2_9_1_Primaries`, lines 3296–3300); wire G-3a/b
   (`runPhase_2_2_3_FactionLeaders`, lines 1917 + 1937 + 1991). **No
   change** to G-4 (`runPhase_2_2_2_Committees`) — DEFER per AC #11.

**File count delta:** 1 new code module + 2 modified files = **3 files**
(excluding this brief). **No UI, no dataset regen, no `repair()`/migration,
no `pv.ts` change.**

**Not touched (guardrails):** `src/pv.ts` (no PV-formula change, AC #20);
`src/rng.ts` (no new `Math.random`; the pre-existing `calcStateVote:3281`
noise is out of scope); `src/phases.ts`; `src/state/GameContext.tsx` /
`repair()` (no migration, AC #22); the `Trait` union (no new content,
AC #21); PR3's `TRAIT_CONFLICTS` / `TRAIT_LIFECYCLE_RULES` / `tryGrantTrait`
(read-only here; AC #17/#18); `runPhase_2_2_2_Committees`'s skill-only sort
(AC #11 DEFER); LEADERSHIP_RULES (AC #24 — both layers compose); the
Continental Congress vote `voteCC` and era-event responses (AC #12 — out
of scope, no per-candidate trait surface). `src/engine/log.ts` is unchanged
(reuses existing `addLog` API — no new phase tag needed; the summary log
fires under the existing election phase IDs).

## Test / verification plan

### Build / typecheck

`npm run build` (`tsc -b && vite build`) and `npm run lint` (`tsc -b
--noEmit`) must both be green (AC #25). Tripwires to expect:

- `TRAIT_ELECTION_EFFECTS` row literals must satisfy `TraitElectionRule[]`
  — typos in `trait` (e.g. `'Charismatci'`) or `context` fail.
- `era?: Era` is optional; rows without `era` apply to all eras.
- `opponentConditional.ifOpponentHas` is `Trait[]`; typo-checked against the
  `Trait` union.
- `calcStateVote`'s new `ctx: ElectionContext` parameter cascades to all
  four call sites; missing or mistyped values at any caller fail typecheck.
- `composeTraitSummary` returns `string`; the `addLog` 4th-arg `meta` is
  optional and typed `Record<string, unknown>` (`src/engine/log.ts:4`).

### Engine smoke test (recommended, qa-tester runs)

A pure Node script importing `applyTraitElectionBonus` from
`src/engine/electionEffects.ts`. Exercises:

**Per-trait per-context grid coverage (the 15-trait × 6-context table).** For
each row in `TRAIT_ELECTION_EFFECTS`, build a minimal `Politician` carrying
exactly that one trait and assert
`applyTraitElectionBonus(p, row.context, { era: 'nationalism' }).totalBonus
=== row.magnitude` (for rows without `era`) or `=== row.magnitude` for the
matching era (Domestic Apathy rows). The grid is ~50 rows; the test is a
loop over `TRAIT_ELECTION_EFFECTS`.

**Empty-trait politician.** A politician with `traits: []` → `totalBonus ===
0`, `perTraitBreakdown === []` for every context. Covers spec Edge case
"Politician with NO trait in the PR4a list".

**Multi-trait additive stacking.** A politician with
`['Charismatic', 'Integrity', 'Harmonious']` in `governor` context →
`totalBonus === 4 + 2 + 2 === 8` (MEDIUM + SMALL + SMALL). Covers spec
Edge case "multiple PR4a traits stack additively".

**Opponent-conditional fires correctly.**
- Integrity vs Scandalous opponent in `presGeneral`:
  `applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism',
  opponentTraits: ['Scandalous'] })` returns `totalBonus === 4` (bumped
  MEDIUM, not the baseline SMALL=2).
- Integrity vs Scandalous opponent in `senatePre17`: returns `totalBonus ===
  2` (baseline SMALL — opponent-conditional does NOT fire in `senatePre17`
  per AC #15).
- Unlikable vs Charismatic opponent in `presGeneral`: returns `totalBonus
  === -8` (bumped LARGE).
- Unlikable vs Charismatic opponent in `internalParty`: returns `totalBonus
  === -4` (baseline MEDIUM — no opp-conditional firing in `internalParty`).
- Scandalous + Controversial vs Integrity opponent in `presGeneral`:
  returns `totalBonus === -8 + -8 === -16` (worst-case stacking, the
  reference's Hamilton-1797 case).
- Multi-opponent / >2 field with at least one Integrity: same as 2-candidate
  case (any opponent triggers the bump).

**Era-scaled Domestic Apathy.**
- `era: 'independence'`, Domestic Apathy in `presGeneral`: `totalBonus
  === -2` (SMALL).
- `era: 'nationalism'`, Domestic Apathy in `presGeneral`: `totalBonus
  === -4` (MEDIUM).
- `era: 'modern'`, Domestic Apathy in `presGeneral`: `totalBonus === -4`
  (MEDIUM — modern shares nationalism's row in the table).
- Domestic Apathy in `presPrimary`/`senatePre17`/`internalParty`:
  `totalBonus === 0` (no row).

**Carpetbagger.** A politician with `Carpetbagger` in `house`: returns
`-4`. In `presGeneral`: returns `0` (no row — state-level only).

**Obscure sign-flip in `presPrimary`.** A politician with `Obscure` in
`presPrimary`: returns `+2` (SMALL positive — the Pierce-1852 case). Same
politician in `presGeneral`: returns `-4` (MEDIUM negative). Covers the
spec Edge case "Obscure as a CONVENTION POSITIVE".

**Determinism contract.** Two back-to-back calls with identical inputs
return identical outputs (no internal state, no RNG).

**Worst-case stacking sanity check.** Scandalous + Controversial +
Unlikable vs (Integrity + Charismatic) opponent in `presGeneral`:
`totalBonus === -8 + -8 + -8 === -24`. This is the headline balance fact —
flag for human playtest tuning if it reads as too punishing. With
`SMALL=2, MEDIUM=4, LARGE=8` the worst-case is bounded at ~-24 per
politician per race; the PR4a layer is intentionally large enough to
matter at the margin without dominating PV (a top-PV candidate with
pvCache=120 has score ≈ 12 from PV alone, and the trait swing of ±8 is
~5–10% of total score).

### Playtest (per CLAUDE.md, `npm run dev`)

> **Determinism caveat** (carried from PR2a/PR2b/PR3): `src/rng.ts` wraps
> `Math.random`; runs are **not** bit-reproducible. Verify each behavior
> **qualitatively** (the log line fires, the magnitudes are in band, the
> opp-conditional bump triggers when expected), not by reproducing an exact
> seed. The pre-existing `Math.random` noise at `calcStateVote:3281`
> dominates close races — verify the trait layer fires by reading log lines,
> not by counting marginal swings.

**1856 scenario — exercises four contexts in one play-through.**

- **`presGeneral` summary log (Site G-1b).** Run through to the first
  presidential election (`2.9.4`). Watch the events feed for one
  `"<Name>'s traits net +X / -Y in the presidential general race —
  Charismatic, ..."` line per candidate with non-empty traits. Confirm
  Charismatic / Integrity / Magician etc. fire with positive signs;
  Unlikable / Scandalous fire with negative. Opp-conditional check: if
  the matchup is Integrity vs Scandalous, BOTH candidates' summary lines
  show the **bumped** magnitudes (Integrity +MEDIUM not +SMALL; Scandalous
  -LARGE not -MEDIUM).
- **`governor` summary log (Site G-1c).** Wait for a `2.9.5` tick (governor
  races fire at 0.4 chance per state per cycle). Each fired race emits one
  summary log per candidate with non-empty breakdown, in the events feed
  under `2.9.5 election`. Confirm Carpetbagger fires (any politician with
  the trait gets -MEDIUM); spot a non-Carpetbagger to confirm no spurious
  fire.
- **`house` / `senatePre17` summary logs (Sites G-1d, G-1e).** Run through
  to a `2.9.6` cycle (every 2 years). Expect dozens of log lines per
  cycle (one per race per candidate with non-empty breakdown). Spot-check:
  a Magician in a Senate race shows `+LARGE` on the senate breakdown
  (`+8`); a Carpetbagger in the same race shows `-SMALL` (`-2`); a
  Charismatic shows `+SMALL` (`+2`, dampened per F-SENATE-BOTH-ERAS).
- **`presPrimary` summary log (Site G-2).** Run through to a presidential
  year (`year % 4 === 0`). Watch for one `2.9.1` line per party WINNER (no
  log for non-winners). Confirm a Magician winning the Democratic primary
  shows `+MEDIUM` in the summary; a Harmonious winner shows `+MEDIUM`; an
  Obscure winner shows `+SMALL` (the Pierce-1852 case fires positively in
  conventions).
- **`internalParty` summary log (Site G-3a/b).** Watch the `2.2.3` log
  feed for "elected to lead the Y" followed by a summary log on the
  winner. A faction with no leader at the top of the tick triggers
  install (Step 2); a leader-challenge cycle triggers Step 3.

**1772 scenario — verifies Domestic Apathy era scaling.**

- Run through to the first presidential election in 1772 (`2.9.4`
  fires in 1776 or later). Confirm Domestic Apathy fires at `-SMALL`
  (`-2`) in the `presGeneral` summary log, not `-MEDIUM`. Then if the
  game progresses into `federalism` era (post-1789), confirm it stays
  at `-SMALL` (federalism row).
- For comparison, in 1856 (`nationalism`), Domestic Apathy fires at
  `-MEDIUM` (`-4`) — log lines visibly heavier.

**Edge cases to verify manually (from the spec):**

- **Politician with no PR4a traits.** No summary log line fires (the
  breakdown is empty; the if-guard skips the addLog). Confirm via the
  events feed.
- **Multiple PR4a traits stack.** A Charismatic + Integrity + Harmonious
  governor candidate gets a `+8` summary (`+4 + +2 + +2`).
- **Opp-conditional fires for BOTH sides.** Lincoln-style Integrity vs
  Hamilton-Reynolds Scandalous: both summary logs show bumped magnitudes.
- **Obscure-as-positive in `presPrimary`.** A Pierce-1852-shaped Obscure
  candidate's primary win line shows `+2` from Obscure (positive — the
  sign-flip).
- **Carpetbagger gate.** A politician with the `Carpetbagger` trait
  (granted by `resolveRelocation` on a successful relocation roll) fires
  the magnitude in `house` / `senatePre17` / `governor`; no `presGeneral`
  / `presPrimary` / `internalParty` fire (per the table).
- **Saves load clean.** Open a pre-PR4a IndexedDB save in `2026-06-20`
  build: no crash, no migration, next election cycle picks up the new
  effects.

## Risks

Ordered, highest first.

1. **Aggregate trait effects could swing elections away from PV-dominant
   shape** (headline balance risk). The PR4a layer adds up to ±24 score
   points per race in the stacked worst case (Scandalous + Controversial +
   Unlikable vs Integrity+Charismatic). With `calcStateVote`'s pv weight
   (`pv * 0.1` → ~12 from a max-PV politician at 120), the trait layer is
   ~double the PV term's spread at the worst-case end. The intent is that
   PV remains the structural advantage and traits are the "right race"
   texture (F-PV-INTERACTION); the magnitudes were tuned to that goal at
   `SMALL=2, MEDIUM=4, LARGE=8` (PM rec). Mitigation: every magnitude lives
   in `TRAIT_ELECTION_BANDS` for one-place tuning; the human dials the
   bands down (e.g. `SMALL=1, MEDIUM=3, LARGE=6`) at playtest if the swings
   read too high. The flat-array shape makes individual row tuning easy
   too. **This is the spec's locked CP2 dial; PR4a ships the structure,
   not the final numbers.**

2. **Opponent-conditional bumps create non-transitive election outcomes.**
   With Integrity bumped vs Scandalous (`+2 → +4`) AND Scandalous bumped vs
   Integrity (`-4 → -8`), the head-to-head matchup is much sharper than a
   round-robin (the spread is `+4 + 8 = 12` between Lincoln-vs-Hamilton vs.
   either alone). This is the intended F-NEGATIVE-MAGNITUDES-NONFLAT goal,
   but it means swapping the opponent in mid-campaign (impossible today)
   would produce wildly different scores. Playtest sanity check: in a
   matchup spotted as "Integrity vs Scandalous", confirm both summary log
   lines reflect the bumped magnitudes; in "Integrity vs Charismatic"
   confirm only baseline magnitudes (Charismatic is not in Integrity's
   `ifOpponentHas` list).

3. **Senate trait modulation is magnitude-shaped, not arithmetic-restructured
   (Open Q8 carry).** AC #7's `senatePre17` context modulates magnitudes
   per F-SENATE-BOTH-ERAS — Charismatic SMALL not MEDIUM, Magician LARGE,
   Carpetbagger SMALL, etc. — but `calcStateVote`'s Senate-loop arithmetic
   is **still popular-vote shaped** (a 2-candidate field, popular-vote
   winner picked). The PR4a magnitude shaping reflects the historical
   state-legislature reality WITHIN that flawed shape; a full conversion
   to state-legislature math is out of scope (a separate larger PR). This
   is a documented limitation, not a bug. **Risk:** a player who knows the
   historical Senate is state-legislature might find the Senate races
   feeling "shaped right" (Magician wins more, Charismatic doesn't
   dominate) but the underlying math is still 2-candidate popular-vote.
   No mitigation in PR4a.

4. **Log volume on a `2.9.6` cycle could overwhelm the events feed.** With
   50 states × 2 senate races (when in cycle) + 50 states × N house seats,
   each race emitting up to 2 summary log lines (one per candidate with
   non-empty breakdown), a single `2.9.6` tick could emit 200+ trait summary
   lines. Mitigation: the if-guard `if (row.traitBreakdown.length === 0)
   continue;` skips politicians with no PR4a traits (zero-mass cells in the
   table); given the trait incidence on the seed dataset (~3 traits per
   politician on average), the actual fire-rate is bounded. If playtest
   shows the feed is noisy, the human can tighten the threshold to "log
   only when `|totalBonus| >= MEDIUM`" — a one-line if-guard change.

5. **`calcStateVote` signature change forces every caller to thread `ctx`.**
   The four call sites are listed and migrated in this brief, but any
   future code adding a fifth caller (e.g. a hypothetical "primary
   challenge" or "runoff" phase) must pass a context. Mitigation: the
   `ElectionContext` union is locked at 6 values; a TypeScript error fires
   immediately at any caller that omits the arg. Future PRs adding a
   new context type extend the union and the lookup table together.

## Definition of Done

- `npm run build` passes (`tsc -b && vite build`) and `npm run lint`
  (`tsc -b --noEmit`) is clean (AC #25).
- `TRAIT_ELECTION_BANDS`, `TraitElectionRule`, `ElectionContext`, and
  `TRAIT_ELECTION_EFFECTS` all live in `src/types.ts` after
  `TRAIT_CONFLICTS` — **no magic numbers** in `calcStateVote`,
  primaries, faction-leader scoring, or the helper (AC #1, #3).
- `src/engine/electionEffects.ts` exports pure
  `applyTraitElectionBonus(p, ctx, opts) → { totalBonus,
  perTraitBreakdown }`; no `addLog`, no RNG, no PV mutation; reads
  `TRAIT_ELECTION_EFFECTS` (AC #4, #19).
- The 6 election contexts wire through the 4 call sites: `presGeneral`
  via 2.9.4, `governor` via 2.9.5, `senatePre17`/`house` via 2.9.6,
  `presPrimary` via 2.9.1, `internalParty` via 2.2.3 Step-2 + Step-3
  (AC #7, #8, #9, #10).
- The 15-trait × 6-context magnitude grid in
  `TRAIT_ELECTION_EFFECTS` matches the spec's AC #6 directional table
  exactly (PM-locked); architect-picked numerics within band per
  CP1-locked PM recommendation (`SMALL=2, MEDIUM=4, LARGE=8`).
- Opponent-conditional bumps fire in `presGeneral` / `house` /
  `governor` only (Integrity vs tainted; Scandalous/Controversial vs
  Integrity; Unlikable vs Charismatic). Domestic Apathy era-scaled per
  `independence`/`federalism` → `-SMALL` vs `nationalism`/`modern` →
  `-MEDIUM` (AC #13, #14, #15).
- One summary log line fires per candidate per race when their
  breakdown is non-empty (AC #16, Tuning #5). Logs route under existing
  phase IDs (`2.9.1`, `2.9.4`, `2.9.5`, `2.9.6`, `2.2.3`). The
  `composeTraitSummary` helper is the single source of log shape.
- `src/pv.ts` unchanged; no Use gate changed; no new field; no
  migration; no UI (AC #20, #21, #22). PR3's trait lifecycle
  (`TRAIT_CONFLICTS`, `tryGrantTrait`) untouched (AC #17, #18).
- Committee-chair sort at `runPhase_2_2_2_Committees` is **NOT
  wired** in PR4a (AC #11 DEFER) — brief includes the wire as a
  ready-to-flip future tuning hook.
- **Playtest** (per CLAUDE.md, both scenarios): 1772 run produces
  Domestic-Apathy `-SMALL` summary lines; 1856 run produces Domestic-
  Apathy `-MEDIUM` lines; Integrity vs Scandalous opponent matchup
  produces bumped magnitudes on both sides' summary lines; Obscure
  primary winner shows positive summary; Magician senatePre17 shows
  `+LARGE`; Carpetbagger house/governor shows `-MEDIUM` — all verified
  **qualitatively** given the rng.ts determinism caveat, with CPU
  observation via the events feed.

---

**Checkpoint summary (for approval):**

- **Approach:** add a per-trait per-context additive election bonus via one
  new typed const (`TRAIT_ELECTION_EFFECTS` as a flat rule-row array) in
  `src/types.ts` + one new pure helper module
  (`src/engine/electionEffects.ts` exposing `applyTraitElectionBonus`) +
  one log-composition helper (`composeTraitSummary` inline in
  `phaseRunners.ts`); wire 4 call sites in `phaseRunners.ts` —
  `calcStateVote` (signature gets `ctx: ElectionContext`, callers thread
  `presGeneral`/`governor`/`senatePre17`/`house`); `runPhase_2_9_1_
  Primaries` for `presPrimary`; `runPhase_2_2_3_FactionLeaders` Step-2 +
  Step-3 for `internalParty`. PV formula, fields, migration, and UI all
  untouched. Committee-chair sort (AC #11) DEFERRED.
- **Files:** 3 (1 new `src/engine/electionEffects.ts`; 2 modified:
  `src/types.ts`, `src/engine/phaseRunners.ts`). No UI, no dataset, no
  migration, no `pv.ts` change, no `log.ts` change.
- **Tuning resolutions:** (1) **Band numerics:** `SMALL=2, MEDIUM=4,
  LARGE=8` (PM-recommended; worst-case stacking ≈ ±24 vs PV's ≈ ±12 spread
  — high but intentional, with `TRAIT_ELECTION_BANDS` as the one-place dial
  if playtest reads as too sharp). (2) **Const shape:** **flat array of
  rule rows** (nested record would force sentinel objects for era + opp-
  conditional). (3) **Helper module:** YES — `src/engine/electionEffects.ts`
  matches PR1/PR2/PR3 axis-helper precedent and is ~50 LOC. (4) **Helper
  API:** `applyTraitElectionBonus(p, ctx, { era, opponentTraits? }) → {
  totalBonus, perTraitBreakdown }` — returns data so callers compose log.
  (5) **Log shape:** once-per-race summary on each candidate with non-empty
  breakdown, via `composeTraitSummary`: `"<Name>'s traits net ±X in the
  <race> race — <pos traits> (+P) / <neg traits> (-N)."`. (6) **Smoke
  test:** full 15×6 grid coverage, opp-conditional cases (6 spot tests),
  era-scaled Domestic Apathy (3 spot tests), Carpetbagger / Obscure-sign-
  flip edge, multi-trait stacking, empty-trait politician.
- **Highest balance risk:** aggregate trait swing (worst case ±24 score
  points) approaches the PV-term spread (~±12 from a 120-PV politician at
  `pv * 0.1`). The intent is "PV is the floor, traits are the texture";
  `TRAIT_ELECTION_BANDS` is the one-place dial. Human tunes at playtest.
- **Decided beyond the spec:** (a) **flat array** shape chosen over nested
  record (the 4 cross-cutting cases — Domestic Apathy era + 3 opp-
  conditional traits — make the flat array decisively cleaner). (b)
  **`composeTraitSummary` helper** declared as module-level in
  `phaseRunners.ts` so all 5 call sites share one log shape; signature
  `(c, breakdown, raceLabel) → string`. (c) **`presGeneral` log fires
  once per election per candidate** (not per state) — captured by saving
  the first-iteration tally outside the per-state loop, since the trait
  bonus is constant across all 50 states for a given matchup. (d)
  **`internalParty` skips `opponentTraits`** — spec AC #15 says opp-
  conditional rows don't fire there, so passing the field would be a
  no-op; the helper API supports the omission cleanly. (e) **G-4
  committee-chair DEFER** — the trait bonus (SMALL=2) easily dominates
  the 0–5 skill range, changing the mechanic's character; the wire is
  ready-to-flip text in the brief. (f) **No `birthState` gate for
  Carpetbagger** — `Politician` has no such field (`src/types.ts:659–
  695`); the `Carpetbagger` trait is granted **only** by
  `resolveRelocation` on a successful relocation roll (`phaseRunners.
  ts:560–565`), so the trait itself IS the geographic signal. Re-resolves
  spec Open Q7.

**Brief file:** `/home/user/AMPU/docs/briefs/trait-election-effects.md`
