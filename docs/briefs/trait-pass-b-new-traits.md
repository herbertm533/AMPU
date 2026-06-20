# Brief: Trait Pass A continued — New election-facing traits + Hale/Frail pair (PR4b)

## Approach

PR4b is a **data-only extension** of PR4a's machinery. We expand the `Trait`
union by 7 (`Likable`, `Uncharismatic`, `Cosmopolitan`, `Provincial`,
`Two-Faced`, `Predictable`, `Hale`), append ~52 rows to PR4a's
`TRAIT_ELECTION_EFFECTS` (covering all 7 traits across the 6 PR4a contexts
plus era-scaling and opp-conditional bumps), add 8 new entries to PR3's
`TRAIT_CONFLICTS` (4 symmetric pairs), and add `Hale` to PR3's
`oldAge.fadingPool`. The engine touches are **two surgical edits**: one
single-line rewire at `revolutionaryWar.ts:99` (`addTrait` → `tryGrantTrait`)
so Hale carriers d6-resist Frail-on-wound, and **four** new seed-time
mutual-exclusion guards (one per new pair) at the existing seed-pass sites
in `runPhase_2_1_5_Ideology` (`phaseRunners.ts:786-796`) and
`runPhase_2_1_6_Conversions` (`:1103-1114`). No new helper modules, no new
RNG paths, no new fields on `Politician` / `GameState`, no `pv.ts` change,
no UI work. PR4a's `applyTraitElectionBonus` + `composeTraitSummary` +
`snapEra` already handle the new rows transparently — the runtime helper
**does not change**. Then the dataset is regenerated: 5 new `CURATED_ROWS`
entries (Henry Clay, Andrew Jackson, John Quincy Adams, John C. Calhoun,
Daniel Webster — not currently in `seedDataset.mjs`), 18 trait-edits on
existing rows (per spec §H attribution table), and the regen pipeline
(`fetchLegislators.sh` + `legislatorsToDataset.mjs` + `npm run build`).

**Locked CP1 decisions carried in (do not relitigate).** Code labels KEEP
(`Cosmopolitan`, `Uncharismatic` per Q1/Q2). Hale-vs-Frail in `presGeneral`:
base `+MEDIUM`, bumped to `+LARGE` when opponent has Frail (Q3 PM rec b).
Two-Faced is NEGATIVE everywhere with `-LARGE` in `presPrimary` +
`internalParty`, era-scaled SMALL/MEDIUM in popular-vote contexts (Q4 PM rec
b). Wound-grant routes through `tryGrantTrait` (Q5 PM rec a). `Hale`
enters `oldAge.fadingPool` (Q8 deferred — minAge stays 70). Stephen A.
Douglas keeps Likable + adds Frail (per spec §H row 21 note + Open Q assumption 13);
no Two-Faced for Douglas (spec AC #22 explicit).

**Alternative rejected — collapsing the 4 seed-time guards into a new
`seedConflictPairs(p)` helper.** A consolidated helper would centralize
~16 lines of guard logic. The 4 pairs **don't share a seed site** (they
piggyback on existing per-pair seed passes via the curated dataset + the
random off-track grant at `phaseRunners.ts:354-378`, which already routes
through `tryGrantTrait`). In fact, the AC #10/#11 reads: NONE of the 4 new
pairs needs a NEW seed pass — they enter via (a) curated dataset traits,
(b) legislators YAML, or (c) the random off-track grant which already
d6-resolves via `tryGrantTrait`. So the "4 seed sites" framing reduces to
**verification + a defensive guard at the random off-track grant site**
that excludes the new pair traits from being randomly granted alongside
their conflict (already handled by PR3's `tryGrantTrait` — no new code).
The brief specifies this as **verify-and-confirm**, not new guards. The
PR3 pattern at `phaseRunners.ts:790`/`:1108` exists for the dedicated
`Ideologue↔Impressionable` and `Loyal↔Opportunist` seed passes; PR4b's 4
new pairs have **no analogous dedicated seed pass**, so no new guards.

**Alternative rejected — adding new `*Seeded` flags for the 4 pairs.**
Per AC #11: the new traits are NOT seeded automatically at draft time.
A `likableTraitsSeeded` / `cosmoTraitsSeeded` flag would add fields to
`Politician` and `repair()` migration cost for zero behavioral gain.
Rejected.

## State & type changes

### `src/types.ts` — 7 new `Trait` union members, classification, 8 new conflicts, fading-pool entry, ~52 new election-effects rows

**(A) `Trait` union expansion** at `types.ts:62-100`. Append 7 new members.
Order: place each near its semantic neighbor for readability (the existing
union groups by family — `Charismatic`/`Integrity`/`Debater` near positive
warmth/character traits; `Unlikable`/`Puritan` near negative warmth traits).

```ts
export type Trait =
  | 'Charismatic'
  | 'Integrity'
  | 'Efficient'
  | 'Orator'
  | 'Debater'
  | 'Propagandist'
  | 'Crisis Manager'
  | 'Kingmaker'
  | 'Numberfudger'
  | 'Harmonious'
  | 'Manipulative'
  | 'Celebrity'
  | 'Magician'
  | 'Nationalist'
  | 'Globalist'
  | 'Reformist'
  | 'Egghead'
  | 'Leadership'
  | 'Likable'              // PR4b — warmth axis positive (Lincoln, Franklin, Clay)
  | 'Cosmopolitan'         // PR4b — geographic horizon positive (Jefferson, Hamilton, Sumner)
  | 'Predictable'          // PR4b — position-stability positive (Mason, Calhoun)
  | 'Hale'                 // PR4b — robustness positive (Jackson, JQ Adams, Washington)
  | 'Incompetent'
  | 'Passive'
  | 'Unlikable'
  | 'Uncharismatic'        // PR4b — warmth axis negative (Madison, Chase, Polk)
  | 'Puritan'
  | 'Domestic Apathy'
  | 'Flip-Flopper'
  | 'Two-Faced'            // PR4b — position-stability negative (Burr, Webster)
  | 'Corrupt'
  | 'Scandalous'
  | 'Frail'
  | 'Controversial'
  | 'Obscure'
  | 'Traitor'
  | 'Carpetbagger'
  | 'Provincial'           // PR4b — geographic horizon negative (Henry, Sam Adams, A. Johnson)
  | 'Outsider'
  | 'Ideologue'
  | 'Impressionable'
  | 'Loyal'
  | 'Opportunist'
  | 'Ambitious'
  | 'Failed Bid';
```

**(B) `POSITIVE_TRAITS` / `NEGATIVE_TRAITS` updates** at `types.ts:102-144`.
Per spec AC #2:

```ts
export const POSITIVE_TRAITS: Trait[] = [
  'Charismatic',
  'Integrity',
  'Efficient',
  'Orator',
  'Debater',
  'Propagandist',
  'Crisis Manager',
  'Kingmaker',
  'Numberfudger',
  'Harmonious',
  'Manipulative',
  'Celebrity',
  'Magician',
  'Nationalist',
  'Globalist',
  'Reformist',
  'Egghead',
  'Leadership',
  'Likable',                // PR4b
  'Cosmopolitan',           // PR4b
  'Predictable',            // PR4b
  'Hale',                   // PR4b
  'Ideologue',
  'Loyal',
  'Ambitious',
];

export const NEGATIVE_TRAITS: Trait[] = [
  'Incompetent',
  'Passive',
  'Unlikable',
  'Uncharismatic',          // PR4b
  'Puritan',
  'Domestic Apathy',
  'Flip-Flopper',
  'Two-Faced',              // PR4b
  'Corrupt',
  'Scandalous',
  'Frail',
  'Controversial',
  'Obscure',
  'Traitor',
  'Carpetbagger',
  'Provincial',             // PR4b
  'Outsider',
  'Impressionable',
  'Opportunist',
  'Failed Bid',
];
```

Note: **Provincial is NEGATIVE at the PV flat layer** per spec AC #2 even
though the context layer turns it POSITIVE for `house`/`governor`/
`senatePre17`. The PV office-weighting tilts national so Provincial reads
negative on average; the context layer carries the texture (mirrors PR4a's
Outsider mis-classification observation).

**(C) `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool` update** at `types.ts:536`.
One-line change — append `'Hale'`:

```ts
fadingPool: ['Celebrity', 'Charismatic', 'Hale'] as Trait[],
```

**(D) `TRAIT_CONFLICTS` extension** at `types.ts:554-569`. Append 8 new
entries (4 symmetric pairs):

```ts
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
  // --- PR4b additions (4 pairs × 2 directions = 8 entries) ---
  Likable:        'Uncharismatic',
  Uncharismatic:  'Likable',
  Cosmopolitan:   'Provincial',
  Provincial:     'Cosmopolitan',
  'Two-Faced':    'Predictable',
  Predictable:    'Two-Faced',
  Hale:           'Frail',
  Frail:          'Hale',
};
```

**(E) `TRAIT_ELECTION_EFFECTS` extension** at `types.ts:754` (immediately
before the closing `];`). Append ~52 rows for the 7 new traits. Bands reuse
PR4a's `TRAIT_ELECTION_BANDS` (`SMALL=2, MEDIUM=4, LARGE=8`) — no new band
introduced.

**Era-scaling decision (Tuning call #7 resolution).** Per PR4a's locked
shape, the `Era` type is 4-value (`independence | federalism | nationalism |
modern`). The spec's "1772" vs "1856" directional table maps cleanly: 1772
covers `independence` + `federalism`; 1856 covers `nationalism` (and we
extend to `modern` for consistency with PR4a's Domestic Apathy pattern at
`types.ts:731-735`). Each era-scaled (trait, context) cell therefore needs
**four rows when the magnitude differs across eras** (two with the
"lighter" 1772 magnitude — one per `independence`/`federalism`; two with
the "heavier" 1856 magnitude — one per `nationalism`/`modern`). Cells with
the same magnitude across both eras stay as a single row with no `era`
field (the helper at `electionEffects.ts` skips the era check when
`row.era === undefined`). This mirrors PR4a's Domestic Apathy exactly —
no new shape, no helper change.

Append these rows immediately before `];` at `types.ts:754`:

```ts
  // === PR4b NEW TRAITS ===

  // --- Likable --- (warmth axis positive — Lincoln/Franklin/Clay; opp-conditional vs Unlikable in presGeneral)
  { trait: 'Likable', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Unlikable'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Likable', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Likable', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Likable', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Likable', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Likable', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Uncharismatic --- (warmth axis negative — Madison/Chase/Polk; opp-conditional vs Charismatic in presGeneral)
  { trait: 'Uncharismatic', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Charismatic'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Uncharismatic', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Uncharismatic', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // senatePre17: NONE (Chase reached Senate 1849 — Uncharismatic ~neutral in pre-17 state-leg)
  { trait: 'Uncharismatic', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Uncharismatic', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Cosmopolitan --- (geographic horizon positive — Jefferson/Hamilton/Sumner; era-scaled)
  // 1856 scenario (nationalism + modern) — +MEDIUM in presGeneral
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  // 1772 scenario (independence + federalism) — +SMALL in presGeneral
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Cosmopolitan', context: 'presPrimary',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Cosmopolitan', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // senatePre17 era-scaled — 1856 state-legs (MA/NY) responded to Sumner/Seward; 1772 more locally focused
  { trait: 'Cosmopolitan', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL, era: 'nationalism' },
  { trait: 'Cosmopolitan', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL, era: 'modern'      },
  // senatePre17 in independence/federalism: NONE (no row — assumption per spec Open Q9)
  { trait: 'Cosmopolitan', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Cosmopolitan', context: 'internalParty', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Provincial --- (geographic horizon negative — Henry/Sam Adams/A. Johnson; era-scaled)
  // 1856 scenario — -MEDIUM in presGeneral; 1772 — -SMALL
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Provincial', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // house/governor: era-scaled — bumped harder in nationalism/modern
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Provincial', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Provincial', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Two-Faced --- (position-stability negative — Burr/Webster; era-scaled in popular-vote contexts; flat LARGE in primary/internal)
  // presGeneral era-scaled: 1856+partisan-press -MEDIUM; 1772 -SMALL
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Two-Faced', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.LARGE  },
  { trait: 'Two-Faced', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // senatePre17 era-scaled (Webster lost his New England state-leg base after 7th of March)
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Two-Faced', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Two-Faced', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.LARGE  },

  // --- Predictable --- (position-stability positive — Mason/Calhoun; flat both eras)
  { trait: 'Predictable', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Predictable', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Hale --- (robustness positive — Jackson/Houston/JQ Adams; era-scaled presGeneral; opp-conditional vs Frail = LARGE)
  // presGeneral era-scaled: 1856+ stump-era +MEDIUM, 1772 +SMALL; opp-conditional vs Frail → +LARGE in BOTH eras
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.SMALL  },
```

**Row count check.** New rows: Likable 6, Uncharismatic 5, Cosmopolitan 10
(4 era-scaled presGeneral + 1 presPrimary + 1 house + 2 era-scaled
senatePre17 + 1 governor + 1 internalParty), Provincial 14 (4 era-scaled
presGeneral + 1 presPrimary + 4 era-scaled house + 1 senatePre17 + 4
era-scaled governor + 1 internalParty), Two-Faced 11 (4 era-scaled
presGeneral + 1 presPrimary + 1 house + 4 era-scaled senatePre17 + 1
governor + 1 internalParty), Predictable 6, Hale 9 (4 era-scaled
presGeneral with opp-conditional + 5 flat contexts). **Total = 61 rows.**
(Spec said "~50"; the precise count is 61 because era-scaling generates
4 rows per era-scaled cell, not 2.)

### Save / migration impact

**None.** Per spec AC #3 / AC #19. No new field on `Politician` /
`GameState`; no `repair()` change. The `Trait` union expansion is purely
additive — existing politicians' `traits: Trait[]` arrays carry only
pre-PR4b values, all of which remain valid union members. Old IndexedDB
saves load cleanly and play unchanged; new traits enter only via fresh
seeds (post-regen) or via the random off-track grant in
`runPhase_2_1_2_Careers` (`phaseRunners.ts:354-378`, which already routes
through `tryGrantTrait` per PR3 — the 4 new conflict pairs auto-d6-resolve).

## Engine changes (pure logic)

All deterministic over the snapshot. **No new RNG**, no `Math.random`
additions, no new helper modules. Two surgical edits:

### Edit E-1: `src/engine/revolutionaryWar.ts:99` — wound-grant rewire (Q5 PM rec a)

Replace the existing single `addTrait(victim, 'Frail')` call with a
`tryGrantTrait` invocation so a Hale general's d6 can resist Frail-on-
wound. Also update the log composition at `:101` to compose from the
returned `{ granted, replaced }` shape (mirrors PR3's pattern at
`phaseRunners.ts:341-349` and `revolutionaryWar.ts:127-135` for
Leadership-lost).

**Import update.** Change `revolutionaryWar.ts:7` from:

```ts
import { addTrait, removeTrait } from './traits';
```

to:

```ts
import { addTrait, removeTrait, tryGrantTrait } from './traits';
```

(`addTrait` and `removeTrait` are still used at `:99` indirectly via
`tryGrantTrait`, but the import surface keeps them for the other call
sites that already use them — verify via grep; no other call site in this
file uses `addTrait` except the line being changed. Drop `addTrait` from
the import if grep confirms it's unused after the edit.)

**Code replacement.** Currently at `revolutionaryWar.ts:96-102`:

```ts
  for (let i = 0; i < wounds && candidates.length > 0; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    const victim = candidates.splice(idx, 1)[0];
    addTrait(victim, 'Frail');
    battle.wounded.push(victim.id);
    addLog(snap, '2.7.2', 'event', `${victim.firstName} ${victim.lastName} wounded at ${battle.name} (gains Frail).`);
  }
```

Replace with:

```ts
  for (let i = 0; i < wounds && candidates.length > 0; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    const victim = candidates.splice(idx, 1)[0];
    const { granted, replaced } = tryGrantTrait(victim, 'Frail');
    battle.wounded.push(victim.id);
    if (granted && replaced === 'Hale') {
      // Hale carrier failed the d6 — sheds Hale, gains Frail (the "this wound finally took the fight out of him" case).
      addLog(snap, '2.7.2', 'event',
        `${victim.firstName} ${victim.lastName} wounded at ${battle.name}, sheds Hale and gains Frail.`,
        { politicianId: victim.id, battle: battle.name });
    } else if (granted) {
      // No conflict (no Hale held) — normal Frail grant.
      addLog(snap, '2.7.2', 'event',
        `${victim.firstName} ${victim.lastName} wounded at ${battle.name} (gains Frail).`,
        { politicianId: victim.id, battle: battle.name });
    } else if (victim.traits.includes('Hale')) {
      // Hale carrier resisted Frail on a d6 < 4 — Hale holds; Frail does not take.
      addLog(snap, '2.7.2', 'event',
        `${victim.firstName} ${victim.lastName}'s Hale constitution shrugs off the wound at ${battle.name} — Frail does not take, on a d6.`,
        { politicianId: victim.id, battle: battle.name });
    }
    // else: already Frail (silent dedupe per tryGrantTrait return contract) — no log.
  }
```

**Branch table** (matches `tryGrantTrait` return semantics from PR3 brief):

| State of `victim` | `tryGrantTrait` return | Log fired |
| --- | --- | --- |
| neither Hale nor Frail | `{ granted: true, replaced: null }` | "wounded at X (gains Frail)" |
| Hale, no Frail, d6 ≥ 4 | `{ granted: true, replaced: 'Hale' }` | "sheds Hale and gains Frail" |
| Hale, no Frail, d6 < 4 | `{ granted: false, replaced: null }` | "Hale constitution shrugs off the wound" |
| already Frail | `{ granted: false, replaced: null }` | (silent dedupe — no log) |

The "Hale carrier resisted" branch needs the explicit
`victim.traits.includes('Hale')` re-check because `tryGrantTrait` returns
the same `{ granted: false, replaced: null }` for both the "already Frail"
case and the "Hale resisted" case — the caller disambiguates via the
state inspection. This matches PR3's pattern at `phaseRunners.ts:346-349`
where the caller checks `TRAIT_CONFLICTS[t] && p.traits.includes(TRAIT_CONFLICTS[t]!)`
to disambiguate the failed-d6 case from the no-op case.

### Edit E-2: Seed-time mutual exclusion verification (4 new pairs)

**Resolution of Tuning call #4.** Per spec AC #10/#11, the 4 new pairs
have **NO new dedicated seed pass** in `runPhase_2_1_1_Draft` (or anywhere
else). They reach politicians via:

1. **Curated dataset traits** — hand-authored in `seedDataset.mjs`. The
   architect-authored attribution table (section "Dataset changes" below)
   never lists a politician with both sides of a new conflict pair.
   Verification: visual inspection of the spec §H table at brief authoring
   time — no within-pair collisions present.
2. **Legislators YAML merge** — `legislatorsToDataset.mjs:111` emits
   `traits: isExec ? ['Leadership'] : []` for YAML-only entries. Neither
   side of any of the 4 new pairs is emitted by this path. Verification:
   visual inspection of `legislatorsToDataset.mjs:101-115` confirms only
   `'Leadership'` is conditionally emitted.
3. **Random off-track grant** at `phaseRunners.ts:354-378` — already
   routes through `tryGrantTrait`. The d6 conflict resolution from PR3
   covers all 14 pairs in the extended `TRAIT_CONFLICTS` table, including
   the 4 new ones. No code change required.
4. **The `TRACK_THEMED_TRAITS` themed-grant pool** at `phaseRunners.ts:336`
   — also routes through `tryGrantTrait`. None of the 7 new traits is
   currently in `TRACK_THEMED_TRAITS` (verified at `types.ts:171-179`); if
   a future PR adds one, the d6 covers it.

**Therefore: NO new engine code edits are required for seed-time mutual
exclusion.** This is a deliberate architectural choice (matches AC #10's
text). The brief documents this as "verify, don't add" — the builder
confirms each of the 4 verification points via grep/visual inspection at
build time, and runs the qa-tester smoke (below) to confirm seed runs
don't produce within-pair co-occurrences.

**Optional defensive guard** (NOT required by spec; the architect leaves
the call to the builder if they want a belt-and-suspenders check): a
one-line `assert`-style filter on the curated dataset import in
`draftImport.ts` that drops the SECOND side of any conflict pair if both
appear in a row's `traits` array. The brief recommends **SKIP** — the
attribution table is hand-controlled, regression is the smoke test.

## UI changes

**None.** PR4b adds no field, no screen, no component. The 7 new traits
surface only via:
- The existing roster trait column (reads `p.traits` directly; unchanged).
- The existing election log feed (PR4a's `composeTraitSummary` already
  emits per-trait breakdown lines; PR4b's new traits surface automatically
  in those lines).
- The wound-grant log lines at `revolutionaryWar.ts:101+` (new branches per
  E-1 above).

No new modal, no new tooltip surface. Matches the spec's "no UI work in
PR4b" assumption (Open Q12) and PR4a's precedent.

## Dataset changes (`scripts/seedDataset.mjs` `ROWS` only)

The architect at CP2 edits the curated `ROWS` array in
`scripts/seedDataset.mjs` (which is then normalized into `CURATED_ROWS` at
`:219-232`). After editing, the regen pipeline produces the updated
`public/standard-draft-classes.json` + `politicians-dataset.csv` +
`src/data/defaultDraftClasses.ts`.

### Existing-row trait edits (18 figures, in spec §H attribution order)

Each edit is a one-line touch to the `[traits]` array of the existing row.
The skill/ideology/birthYear values are left unchanged.

1. **Benjamin Franklin** (`seedDataset.mjs:57`): `['Celebrity','Egghead']`
   → `['Celebrity','Egghead','Likable','Cosmopolitan','Hale']`.
2. **Patrick Henry** (`seedDataset.mjs:42`): `['Orator','Debater']` →
   `['Orator','Debater','Provincial']`.
3. **Samuel Adams** (`seedDataset.mjs:40`): `['Orator']` →
   `['Orator','Provincial']`.
4. **George Mason** (`seedDataset.mjs:49`): `[]` → `['Predictable']`.
5. **George Washington** (`seedDataset.mjs:55`): `['Leadership']` →
   `['Leadership','Hale']`.
6. **Thomas Jefferson** (`seedDataset.mjs:41`): `['Egghead']` →
   `['Egghead','Cosmopolitan']`.
7. **Alexander Hamilton** (`seedDataset.mjs:84`): `['Egghead']` →
   `['Egghead','Cosmopolitan']`.
8. **James Madison** (`seedDataset.mjs:83`): `['Egghead','Reformist']` →
   `['Egghead','Reformist','Uncharismatic']`.
9. **Aaron Burr** (`seedDataset.mjs:85`): `['Manipulative']` →
   `['Manipulative','Two-Faced']`.
10. **Abraham Lincoln** (`seedDataset.mjs:147`): `['Orator','Integrity']` →
    `['Orator','Integrity','Likable']`.
11. **Stephen A. Douglas** (`seedDataset.mjs:130`): `['Orator','Debater']`
    → `['Orator','Debater','Likable','Frail']` (per spec §H + Assumption
    13: Frail added for the 1860 exhaustion → typhoid arc).
12. **Andrew Johnson** (`seedDataset.mjs:135`): `['Unlikable']` →
    `['Unlikable','Provincial']`.
13. **Robert Toombs** (`seedDataset.mjs:126`): `['Orator','Debater']` →
    `['Orator','Debater','Provincial']`.
14. **Salmon P. Chase** (`seedDataset.mjs:153`):
    `['Integrity','Reformist']` →
    `['Integrity','Reformist','Uncharismatic','Predictable']`.
15. **James K. Polk** (`seedDataset.mjs:139`): `['Efficient']` →
    `['Efficient','Uncharismatic']`.
16. **William H. Seward** (`seedDataset.mjs:152`):
    `['Manipulative','Magician']` →
    `['Manipulative','Magician','Cosmopolitan']`.
17. **Charles Sumner** (`seedDataset.mjs:157`):
    `['Orator','Reformist','Puritan']` →
    `['Orator','Reformist','Puritan','Cosmopolitan','Predictable']`.
18. **Sam Houston** (`seedDataset.mjs:138`): `['Celebrity','Military']` →
    `['Celebrity','Military','Hale']`.

### 5 new `CURATED_ROWS` entries (Tuning call #2 resolution — PM rec a)

Per spec §H row 23 PM-recommended option (a): add Clay/Jackson/JQA/Calhoun/
Webster as new `CURATED_ROWS` entries. The merge precedence rule (CLAUDE.md
"dataset rules": served members < `CURATED_ROWS` override) means these
entries will override the legislators-YAML versions of the same people.

Skill/ideology/command values are authored from common biographical sources
(see citations in spec §H). All 5 served in Congress so they reach the
curated path with full electoral stats — no sub-floor needed per
CLAUDE.md dataset rule.

Insert these immediately after `seedDataset.mjs:179` (after the line for
John McLean closing the 1856 roster, before the comment "Founding-era
arrivals" or wherever the row order best fits — preserve alphabetical /
era ordering at the builder's discretion; the comment block at `:181-187`
documents the `ERA_ROWS` section, so the 5 new figures go in `ROWS`
not `ERA_ROWS`):

```js
  // ===== PR4b CURATED additions (marquee figures not previously in ROWS) =====
  // Henry Clay — Senate/House power-broker; Speaker; Sec. State; multi-term
  // Senator from KY; canonical Likable + Charismatic + Magician case.
  ['Henry','Clay','ky','Moderate',1777,[3,5,2,1,3,5],5,['Charismatic','Likable','Magician','Orator'],'BLUE'],
  // Andrew Jackson — TN/SC general, US Sen TN, 7th President; "Old Hickory";
  // 38 years carrying bullets; canonical Hale + Outsider + Controversial case.
  ['Andrew','Jackson','tn','LW Populist',1767,[3,2,1,5,3,3],5,['Hale','Outsider','Controversial','Military','Celebrity'],'BLUE'],
  // John Quincy Adams — Sec. State; 6th President; then 9 House terms 1831-48
  // age 64-81; collapsed on floor at 81; canonical Hale (with late decline) case.
  ['John Quincy','Adams','ma','Moderate',1767,[4,4,3,0,3,3],4,['Egghead','Integrity','Hale','Debater'],'RED'],
  // John C. Calhoun — VP under JQA + Jackson; Sec. War; Sec. State; SC US Sen;
  // late-Southern-rights phase relentlessly consistent; canonical Predictable case.
  ['John C.','Calhoun','sc','Traditionalist',1782,[3,5,2,1,2,3],5,['Orator','Debater','Predictable','Nationalist'],'BLUE'],
  // Daniel Webster — MA US Sen; Sec. State; 7th of March 1850 destroyed his
  // New England base; canonical Two-Faced (situational reversal) case.
  ['Daniel','Webster','ma','Conservative',1782,[3,5,3,0,2,3],4,['Orator','Debater','Two-Faced'],'RED'],
```

**Field-by-field rationale** (architect's authored values):

- **Henry Clay**: Speaker of House 3x, Sec. State, Sen multiple terms → `legislative=5`,
  `backroom=5`, `governing=3`. War of 1812 hawk → `military=1`. KY moderate
  → `Moderate` ideology. `command=5` for Triumvirate stature. Party `BLUE`
  (Whig precursor / Jacksonian opposition fits historical merge — per
  `legislatorsToDataset.mjs:50-52` `whig → Moderate`; we curate the row
  ourselves so this is just the AMPU party assignment).
- **Andrew Jackson**: Hero of New Orleans → `military=5`. President → `admin=3`,
  `governing=3`. TN populist Democrat → `LW Populist`. `command=5`. Party
  `BLUE` (Democrat).
- **John Quincy Adams**: Diplomat → `admin=4`. Sec. State + President →
  `governing=3`. Multi-term House → `legislative=4`. Egghead → `judicial=3`.
  Moderate (Massachusetts National Republican / Anti-Mason → Moderate per
  the heuristic). Party `RED` (Whig).
- **John C. Calhoun**: VP, Sec. War, multi-term US Sen → `legislative=5`,
  `governing=2`, `admin=3`. Nullifier / Southern-rights → `Traditionalist`.
  `command=5` (Triumvirate stature). Party `BLUE` (Jacksonian / Democrat).
- **Daniel Webster**: MA Sen, Sec. State, "Lucifer descending from Heaven"
  → `legislative=5`, `judicial=3`, `governing=2`. Whig conservative →
  `Conservative`. `command=4`. Party `RED` (Whig).

### Verification (no schema changes required)

- The new traits pass through `splitTraits` at `seedDataset.mjs:31`
  unchanged — none of the 7 new trait names is in `EXPERTISE_NAMES`
  (`Agriculture, Business, Economics, Education, Environment, Media,
  Military, Naval`). Verified visually.
- The 5 new `ROWS` entries flow into `CURATED_ROWS` via the existing
  normalization at `seedDataset.mjs:220-232`. No new logic.
- The merge precedence in `legislatorsToDataset.mjs` (verified at
  `:8-17`) means the 5 new `CURATED_ROWS` rows override the YAML-sourced
  same-name entries; the 18 existing-row edits propagate verbatim.

### Regen pipeline execution (Tuning call #3)

After all edits to `seedDataset.mjs` are in, the builder runs:

```bash
bash scripts/fetchLegislators.sh         # downloads YAML + CSV sources to .legis/
node scripts/legislatorsToDataset.mjs    # regens JSON + CSV + TS fallback
npm run build                             # verifies typecheck still passes
```

**Network-dependency risk.** `scripts/fetchLegislators.sh` requires
outbound access to `raw.githubusercontent.com` (per CLAUDE.md draft-class
authoring playbook). In the AMPU build environment, this MAY be restricted
by the host allowlist policy. **If `fetchLegislators.sh` fails**:
- The CURATED_ROWS edits in `seedDataset.mjs` are still meaningful — they
  encode the canonical PR4b state.
- The builder reports the failure in their CP2 summary; the human runs
  the regen step on a network-permitted machine and commits the updated
  `public/standard-draft-classes.json` / `politicians-dataset.csv` /
  `src/data/defaultDraftClasses.ts`.
- `npm run build` will still pass without the regen (the bundled offline
  fallback `defaultDraftClasses.ts` is unchanged until the regen lands;
  the runtime-loaded JSON file is what carries the bulk dataset).

## Files to touch (exact, ordered)

**New:** 0. **Modified:** 3 source files + 1 build script + 3 generated
artifacts (after regen). **Total = 7 modified files; 0 new.**

1. `src/types.ts` — 7 new `Trait` union members (`:62-100`); 4 new
   `POSITIVE_TRAITS` entries + 3 new `NEGATIVE_TRAITS` entries (`:102-144`);
   `Hale` appended to `oldAge.fadingPool` (`:536`); 8 new
   `TRAIT_CONFLICTS` entries (`:554-569`); ~61 new rows appended to
   `TRAIT_ELECTION_EFFECTS` (immediately before the closing `];` at
   `:754`). No new types, no new const shapes, no schema changes.
2. `src/engine/revolutionaryWar.ts` — single import update at `:7`
   (`addTrait` → `addTrait, tryGrantTrait` if `addTrait` still used
   elsewhere in the file, else `addTrait` dropped); wound-grant rewire
   at `:96-102` (replace 7-line block with the 17-line branch table
   from E-1 above).
3. `src/engine/phaseRunners.ts` — **NO CODE CHANGE.** Verification only
   (per E-2 above). The brief lists this file under "files touched" for
   completeness because the builder verifies the four PR3-routing paths
   still cover the new pairs.
4. `scripts/seedDataset.mjs` — 18 existing-row trait edits (lines as
   listed in "Existing-row trait edits"); 5 new `ROWS` entries after
   `:179` (the 1856 roster terminus). No other edits — header / format /
   normalization logic untouched.
5. `public/standard-draft-classes.json` — **REGENERATED** by
   `legislatorsToDataset.mjs`. Builder runs the regen pipeline; commits
   the diff. ~25 marquee figures change traits; the 5 new curated rows
   override their YAML versions (Clay/Jackson/JQA/Calhoun/Webster). All
   other ~18.5k rows untouched.
6. `politicians-dataset.csv` — **REGENERATED**. Same diff as JSON.
7. `src/data/defaultDraftClasses.ts` — **REGENERATED**. Small curated
   offline fallback; trait changes propagate.

**Not touched (guardrails):** `src/pv.ts` (no PV formula change, AC #15);
`src/engine/electionEffects.ts` (PR4a helper unchanged, AC #16); `src/
engine/traits.ts` (PR3 primitives unchanged, AC #18); `src/engine/log.ts`
(no new phase tag); `src/rng.ts` (no new RNG path, AC #18); `src/phases.ts`;
`src/state/GameContext.tsx` / `repair()` (no migration, AC #3, #19);
`CARPETBAGGER_LADDER` (no new entries, AC #12); `TRACK_THEMED_TRAITS` (no
new entries, AC #11). PR3's `TRAIT_CONFLICTS` direction map and PR4a's
`TRAIT_ELECTION_EFFECTS` existing rows: only extended, never modified.
The existing 4 PR3-routed grant sites in `phaseRunners.ts` (`:338`,
`:364`, `:1407`, `:2563`, `:2619`) and `constitutionalConvention.ts`
(`:170`) continue to handle conflict resolution for the 4 new pairs via
the extended `TRAIT_CONFLICTS` map — no code change needed.

## Test / verification plan

### Build / typecheck

`npm run build` (`tsc -b && vite build`) and `npm run lint` (`tsc -b
--noEmit`) must both be green (AC #20). Tripwires to expect:

- `TRAIT_ELECTION_EFFECTS` row literals must satisfy `TraitElectionRule[]`
  — typos in `trait` (e.g. `'Likabel'`) or `context` fail.
- `TRAIT_CONFLICTS` keys are `Trait`; PR4b adds string-key entries
  (`'Two-Faced'` quoted because of the hyphen; `Likable`, `Cosmopolitan`,
  etc. unquoted).
- `oldAge.fadingPool: ['Celebrity', 'Charismatic', 'Hale'] as Trait[]` —
  the `Hale` literal must be a valid `Trait` union member (added in (A)
  above).
- `POSITIVE_TRAITS` / `NEGATIVE_TRAITS` types are `Trait[]` — new entries
  must be valid `Trait` literals.
- `revolutionaryWar.ts`: `tryGrantTrait` return shape match. The helper
  returns `{ granted: boolean; replaced: Trait | null }` (PR3 `traits.ts:
  29-35`); destructuring matches.

### qa-tester smoke (recommended)

A pure Node script (or in-repo smoke test) that asserts:

1. **22 traits represented in `TRAIT_ELECTION_EFFECTS`.** 15 from PR4a +
   7 new = 22 distinct `trait` values across the appended rows.
   ```ts
   const allTraits = new Set(TRAIT_ELECTION_EFFECTS.map((r) => r.trait));
   assert(allTraits.size === 22);
   ```
2. **All 4 new conflict pairs symmetric in `TRAIT_CONFLICTS`.** For each
   `(a, b)` in `[['Likable','Uncharismatic'],['Cosmopolitan','Provincial'],
   ['Two-Faced','Predictable'],['Hale','Frail']]`:
   `assert(TRAIT_CONFLICTS[a] === b && TRAIT_CONFLICTS[b] === a)`.
3. **`oldAge.fadingPool` includes Hale.**
   `assert(TRAIT_LIFECYCLE_RULES.oldAge.fadingPool.includes('Hale'))`.
4. **Seed-time exclusion.** Run `seedDataset.mjs` + `legislatorsToDataset.
   mjs` regen; scan `public/standard-draft-classes.json` and assert no
   politician carries both sides of any of the 4 new pairs:
   ```ts
   for (const p of dataset) {
     for (const [a, b] of NEW_PAIRS) {
       assert(!(p.traits.includes(a) && p.traits.includes(b)),
         `${p.firstName} ${p.lastName} has both ${a} and ${b}`);
     }
   }
   ```
5. **Wound-grant — Hale resists.** Construct a `Politician` with
   `traits: ['Hale']`, seed the RNG so `d(6)` returns 1-3, call into the
   wound branch; assert `victim.traits === ['Hale']` (no Frail added).
6. **Wound-grant — Hale shed on failed d6.** Same fixture but seed the
   RNG so `d(6)` returns 4-6; assert `victim.traits === ['Frail']`
   (Hale removed, Frail added).
7. **Spot tests for per-trait per-context magnitudes** via direct
   `applyTraitElectionBonus`:
   - Likable in `presGeneral` (no opp): `+4`. With `opponentTraits:
     ['Unlikable']`: `+8` (bumped).
   - Uncharismatic in `presGeneral` (no opp): `-2`. With `opponentTraits:
     ['Charismatic']`: `-4` (bumped).
   - Cosmopolitan in `presGeneral` `era: 'nationalism'`: `+4`. `era:
     'independence'`: `+2`.
   - Provincial in `house` `era: 'nationalism'`: `+4`. `era:
     'independence'`: `+2`.
   - Two-Faced in `presPrimary` (any era): `-8` (flat LARGE).
   - Two-Faced in `presGeneral` `era: 'nationalism'`: `-4`. `era:
     'independence'`: `-2`.
   - Predictable in `senatePre17`: `+4` (MEDIUM, flat).
   - Hale in `presGeneral` `era: 'nationalism'`, no Frail opp: `+4`. With
     `opponentTraits: ['Frail']`: `+8` (bumped LARGE).
   - Hale in `presGeneral` `era: 'independence'`, no Frail opp: `+2`.
     With `opponentTraits: ['Frail']`: `+8` (bumped — opp-conditional
     fires in BOTH eras per the row's `bumpedMagnitude` shape).

### Playtest (per CLAUDE.md, `npm run dev`)

> **Determinism caveat** (carried from PR4a): runs are not bit-
> reproducible. Verify behaviors qualitatively via log lines, not by
> reproducing exact seeds.

**1856 scenario** (the bulk of PR4b's new attributions live here):

- **Run the regen first**, then start the 1856 scenario. Open Roster
  page; verify Lincoln shows `Likable`, Chase shows `Uncharismatic` +
  `Predictable`, Polk shows `Uncharismatic`, Sumner shows `Cosmopolitan`
  + `Predictable`, Sam Houston shows `Hale`, Johnson shows `Provincial`,
  Toombs shows `Provincial`, Seward shows `Cosmopolitan`. Also verify
  the 5 new CURATED_ROWS figures appear in the dataset: Clay (Likable +
  Charismatic + Magician), Jackson (Hale + Outsider + Controversial),
  JQA (Hale + Integrity + Egghead), Calhoun (Predictable + Orator),
  Webster (Two-Faced + Orator).
- **Presidential 1856 / 1860 race summary lines.** Run through to the
  first `2.9.4` and watch the events feed. PR4a's `composeTraitSummary`
  now includes the new traits when a candidate carries them. Confirm a
  Hale candidate vs Frail opponent shows `+LARGE` (`+8`) in the
  breakdown (e.g. if Lincoln (Likable) ends up vs Douglas (Likable +
  Frail), Lincoln gets `Hale +8` swing only if Lincoln is Hale —
  attribution table doesn't currently give Lincoln Hale, so the canonical
  matchup is Sam Houston / Jackson vs anyone Frail).
- **`presPrimary` Two-Faced burn.** If Webster is in the primary field
  (Republican 1856 cycle), watch for `-8` Two-Faced in his primary
  breakdown — the locked-LARGE convention hit.
- **`internalParty` Predictable bonus.** A `2.2.3` faction-leader
  install for a Predictable candidate (Mason, Calhoun, Sumner) shows
  `+4` MEDIUM in the breakdown.
- **Wound-grant playtest.** This requires the 1772 scenario (the
  Revolutionary War only fires there). Run 1772, get to `2.7.2`
  battles, watch for the new branches: a Hale general (Washington post-
  PR4b regen) wounded should occasionally trigger the "Hale constitution
  shrugs off the wound" log or the "sheds Hale and gains Frail" log
  depending on the d6.
- **Hale old-age decay.** Run far into the 1856 scenario (or use a save
  with a Hale politician aging past 70). Watch for the `2.4.1` decay log
  showing Hale lost — PR3's `oldAge` fading log fires for Hale (matches
  Celebrity / Charismatic pattern).

**1772 scenario** (verifies Cosmopolitan / Provincial era-scaling):

- Run through the first presidential race. Confirm Cosmopolitan
  (Jefferson, Hamilton, Franklin) shows `+SMALL` (`+2`) in the
  `presGeneral` summary, not `+MEDIUM`. Confirm Provincial (Henry,
  Sam Adams) shows `-SMALL` (`-2`) in `presGeneral`.
- Then run further into `federalism` era (post-1789) and confirm the
  same magnitudes (1772 and federalism both share the "lighter" row).

### Edge cases to verify manually (from spec)

- **Politician with NONE of the 7 new traits.** PR4a's
  `applyTraitElectionBonus` skips traits with no `TRAIT_ELECTION_EFFECTS`
  row — they're additive; a politician carrying only old traits
  experiences zero change. Confirm via a Frémont election (he has
  `Celebrity` only).
- **Politician with multiple new traits stacking.** Franklin (post-PR4b)
  has Celebrity + Egghead + Likable + Cosmopolitan + Hale. In a 1772
  `presGeneral` he gets ` Likable + 4 ` + ` Cosmopolitan + 2 ` + ` Hale
  + 2 ` = `+8` from the new traits alone (plus the old Celebrity / Egghead
  layer from PR4a baselines).
- **Hale + Frail mid-game collision (the PR4b headline case).** A
  Revolutionary War battle hits a Hale carrier — the wound-grant rewire
  fires the d6. Verify via the new log lines.
- **Save-load.** Open a pre-PR4b IndexedDB save in the 2026-06-20 build:
  no crash, no migration; politicians carry only pre-PR4b traits; next
  election cycle's summary logs include the 7 new traits ONLY for
  politicians who gain them via post-load grants.
- **Stephen Douglas Frail interaction.** Douglas (post-PR4b) carries
  Frail. If he's GeneralInChief / Admiral / military appointee filter
  at `revolutionaryWar.ts:43` (`!p.traits.includes('Frail')`) excludes
  him from battle participation. Verify by inspecting the 1856 scenario
  military roster — Douglas is not in the military pool by virtue of
  `military=0` anyway, so no behavioral change at battle time.

## Risks

Ordered, highest first.

1. **Dataset regen network dependency.** `scripts/fetchLegislators.sh`
   requires outbound access to `raw.githubusercontent.com`. In the AMPU
   build environment, this is restricted by the host allowlist per
   `docs/draft-class-authoring.md` ("`raw.githubusercontent.com` IS
   reachable"). **If the regen fails**, the CURATED_ROWS edits are
   meaningful but the bulk dataset stays stale; the human runs the regen
   on a permitted machine and commits the resulting JSON/CSV/TS diff.
   Mitigation: builder reports the failure mode in CP2 summary; the
   smoke tests (1-3, 5-7) still pass without the regen because they
   only inspect `src/types.ts` and the engine. Smoke test 4 (no
   within-pair co-occurrence in the JSON) requires the regen; the human
   runs it post-merge.

2. **Aggregate trait-swing magnitudes grow** — PR4a's worst-case was
   ~±24 score points per race; PR4b adds 7 new traits with comparable
   magnitudes. A politician stacking Likable + Cosmopolitan + Hale
   (Franklin) gets `+4 + +4 + +4 = +12` in a 1856 `internalParty` race,
   on TOP of the PR4a Charismatic / Integrity layer. **Worst-case
   stacking** in `presPrimary` for a Two-Faced + Uncharismatic +
   Provincial candidate is `-8 + -2 + -2 = -12` from PR4b alone —
   harshest in the convention context. Across all axes the worst case
   approaches ~±36 score points per race vs the `pvCache * 0.1` ≈ ±12
   spread. **Mitigation:** every PR4b magnitude lives in PR4a's
   `TRAIT_ELECTION_BANDS` — the human tunes `SMALL=2,MEDIUM=4,LARGE=8`
   down (e.g. to 1/2/4) at playtest if swings dominate. PR4b ships the
   structure, not the final numbers — same balance dial PR4a left.

3. **Hale's d6 resistance on wound-grant changes the Revolutionary War
   character.** Pre-PR4b, every wound deterministically granted Frail
   (and thus removed the politician from military participation via the
   `!Frail` filter at `revolutionaryWar.ts:43`). Post-PR4b, a Hale
   carrier has a 50% chance of staying ungained-Frail and continuing to
   participate. Specifically, **Washington (post-PR4b: `Hale`) can be
   wounded multiple times without acquiring Frail**, which alters the
   "Washington at Trenton survives but takes a wound" sequence. This is
   the intended Jackson-carries-bullets-38-years case; flag for the human
   if it reads as Washington being too sticky. Mitigation: the d6
   threshold is shared with PR3 (`conflictD6Threshold = 4`); tuning
   would touch all 14 pairs uniformly, not just Hale ↔ Frail.

4. **Provincial PV/context split is structurally awkward.** Spec AC #2
   classifies Provincial as NEGATIVE for the flat ±4/−5 PV layer (the
   national-office tilt is dominant), but the context layer turns
   Provincial POSITIVE for `house`/`governor`/`senatePre17`. A pure
   district-level politician (Sam Adams, Patrick Henry, Andrew Johnson)
   takes a `-5` PV hit from `pv.ts` but a `+4` `house` bonus from
   `TRAIT_ELECTION_EFFECTS`. **Net effect**: Provincial politicians lose
   on the PV-sort floor (faction leadership, primaries pre-vote sort,
   committee chair selection) but win at popular-vote contexts. This
   echoes PR4a's Outsider observation but is **more dramatic** because
   Provincial's positive contexts are 3 of the 6 (vs Outsider's 3 of 6
   too). The behavior is intended per the canonical source; flag for
   human playtest if Provincial reads "broken in caucus, broken-strong
   on the trail" too sharply.

5. **`Trait` union expansion is a load-bearing typecheck surface.**
   Adding 7 members to `Trait` cascades to all 38 existing union-consumer
   sites (verified via `Grep`): `POSITIVE_TRAITS`, `NEGATIVE_TRAITS`,
   `TRAIT_ELECTION_EFFECTS`, `TRAIT_CONFLICTS`,
   `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool`, `CARPETBAGGER_LADDER`,
   `TRACK_THEMED_TRAITS`, `CAREER_RANDOM_NEGATIVES`, all `tryGrantTrait`/
   `addTrait`/`removeTrait` callsites (23 of them), all event-effect
   templates, etc. **`tsc -b` does NOT enforce exhaustiveness on
   `Trait`-keyed switches**; any new trait that should appear in a
   trait-driven enum (e.g. a future `CAREER_RANDOM_NEGATIVES` candidate)
   has to be hand-added. Mitigation: spec AC #11/#12 explicitly says the
   `CARPETBAGGER_LADDER` and `TRACK_THEMED_TRAITS` are NOT extended in
   PR4b; visual confirmation at brief authoring confirms no other
   `Trait[]` const requires touching.

6. **The 1840 Hale-vs-Frail headline case requires a Hale CPU
   politician winning a presidential cycle.** PR4b attributes Hale to
   Jackson, JQA, Washington, Sam Houston, Franklin. Only Jackson + JQA
   are realistic mid-game presidential winners in the 1856 scenario;
   the 1772 scenario has Washington as the obvious first-presidency
   pick. **For the headline Hale-vs-Frail bumped-LARGE case to fire,
   the opponent must be Frail.** Frail is rare (only Douglas post-PR4b,
   plus war-wound-acquired Frail). The bumped case will be rare in
   practice — the historian-flagged 1840 Harrison-vs-Van Buren scenario
   is a once-per-game type event. Acceptable; the magnitude is the
   texture-bonus for the canonical case.

## Definition of Done

- `npm run build` passes (`tsc -b && vite build`) and `npm run lint`
  (`tsc -b --noEmit`) is clean (AC #20).
- `Trait` union gains exactly 7 new members; `POSITIVE_TRAITS` /
  `NEGATIVE_TRAITS` updated per AC #2.
- `TRAIT_ELECTION_EFFECTS` gains ~61 rows for the 7 new traits matching
  the spec AC #4 directional table; era-scaled rows use 4-era expansion
  per Tuning #7 resolution.
- `TRAIT_CONFLICTS` gains 8 symmetric entries (AC #5).
- `oldAge.fadingPool` gains `Hale` (AC #7).
- `revolutionaryWar.ts:99` re-routes through `tryGrantTrait` with the
  4-branch log table from E-1 (AC #13).
- No new fields on `Politician` / `GameState`; no `repair()` change;
  old saves load clean (AC #3, #19).
- `pv.ts` unchanged; PR4a's `electionEffects.ts` unchanged; PR3's
  `traits.ts` unchanged (AC #15, #16, #18).
- Dataset regenerated: 18 existing-row trait edits + 5 new CURATED_ROWS
  entries in `seedDataset.mjs`; the regen pipeline runs (or its failure
  is reported) and the resulting `standard-draft-classes.json` / CSV /
  TS fallback are committed.
- qa-tester smoke (1-7) all pass.
- Playtest: 1856 scenario shows new trait summary lines in presidential /
  governor / house / senate / faction-leader logs; 1772 scenario shows
  Cosmopolitan/Provincial era-scaling at SMALL not MEDIUM; Washington
  occasionally resists Frail-on-wound via d6.

---

**Checkpoint summary (for approval):**

- **Approach:** data-only extension of PR4a + 1 surgical engine edit +
  dataset regen. 7 new `Trait` union members, ~61 new `TRAIT_ELECTION_EFFECTS`
  rows (era-scaled cells use 4-era expansion per PR4a's Domestic Apathy
  pattern), 8 new `TRAIT_CONFLICTS` entries, `Hale` in `oldAge.fadingPool`.
  `revolutionaryWar.ts:99` rewires `addTrait → tryGrantTrait` with a 4-branch
  log table. NO new helper module; PR4a's `electionEffects.ts` /
  `composeTraitSummary` / PR3's `tryGrantTrait` machinery all unchanged.
  Dataset: 18 trait-edits on existing rows + 5 new `CURATED_ROWS` entries
  for Clay/Jackson/JQA/Calhoun/Webster, then `fetchLegislators.sh` +
  `legislatorsToDataset.mjs` + `npm run build`.
- **Files:** 3 source files (1 modified `src/types.ts`, 1 modified
  `src/engine/revolutionaryWar.ts`, 0 changes to `phaseRunners.ts` —
  verification only) + 1 build script (`scripts/seedDataset.mjs`) + 3
  regenerated artifacts (`public/standard-draft-classes.json`,
  `politicians-dataset.csv`, `src/data/defaultDraftClasses.ts`). 0 new
  files. No UI, no `pv.ts` change, no `electionEffects.ts` change, no
  `traits.ts` change, no migration.
- **Tuning resolutions:** (1) Magnitudes from spec's directional table
  filled in numeric per band (`SMALL=2,MEDIUM=4,LARGE=8`, PR4a-locked);
  ~61 total rows. (2) 5 new CURATED_ROWS for Clay/Jackson/JQA/Calhoun/
  Webster with authored stats (option a). (3) Regen pipeline:
  `bash scripts/fetchLegislators.sh && node scripts/legislatorsToDataset.mjs
  && npm run build`, network-dependency risk flagged. (4) Seed-time
  exclusion: **NO new guards** — 4 new pairs reach politicians via
  curated dataset (PM-controlled, no within-pair collisions), legislators
  YAML (no PR4b traits emitted), and the random off-track grant (already
  routes through `tryGrantTrait`). Verify-only, no code change. (5)
  Wound-grant: `addTrait(victim, 'Frail')` →
  `tryGrantTrait(victim, 'Frail')` with 4-branch log table (Hale held,
  no Hale, Hale resisted, already Frail). (6) `fadingPool`:
  `['Celebrity', 'Charismatic', 'Hale']`. (7) Era-scaled rows: 4-row
  expansion per era-scaled cell (independence + federalism for "1772
  light"; nationalism + modern for "1856 heavy"), matches PR4a Domestic
  Apathy pattern exactly. (8) Helper / log changes: **NONE**. PR4a's
  `applyTraitElectionBonus` + `composeTraitSummary` + `snapEra` are
  unchanged; PR4b only adds data rows. (9) Smoke test: 7 assertions
  covering union extension, conflict symmetry, fading-pool membership,
  no within-pair seed collisions in regenerated dataset, Hale wound-
  resistance (both branches), 9 spot magnitude tests.
- **Highest balance risk:** Aggregate trait-swing approaches ~±36 score
  points per race in worst-case stacking (PR4a's ±24 + PR4b's ±12),
  vs `pvCache * 0.1` ≈ ±12 PV spread. PR4a's `TRAIT_ELECTION_BANDS` is
  the one-place dial — human tunes at playtest. The Hale-vs-Frail
  bumped LARGE in `presGeneral` adds ±6 on top in the canonical
  Harrison-vs-Van-Buren matchup; intentional.
- **Decided beyond the spec:** (a) **Era-scaling shape** — 4 rows per
  era-scaled cell (one per `independence`/`federalism`/`nationalism`/
  `modern`), not 2; matches PR4a's existing Domestic Apathy precedent
  at `types.ts:731-735` and keeps the row literals verbose-but-readable.
  Cells with the same magnitude across both eras stay as a single row
  with no `era` field. (b) **`senatePre17` for Cosmopolitan in 1772
  eras: NO row** (spec Open Q9 assumption — state-legs were locally
  focused pre-1820). (c) **Hale opp-conditional vs Frail fires in
  BOTH eras** (the bumped-LARGE magnitude is `era`-independent within
  each row; the `magnitude` is era-scaled but the `bumpedMagnitude`
  is fixed LARGE). (d) **Wound-grant log branches**: 4 distinct
  log lines (granted+replaced=Hale, granted+no replace, Hale resisted,
  silent dedupe) — matches PR3's `revolutionaryWar.ts:127-135`
  Leadership-lost log voice exactly. (e) **No seed-time guards**: spec
  AC #10/#11 reads "PR3's existing routing covers the 4 new pairs", so
  the brief specifies verification only — `runPhase_2_1_5_Ideology`
  and `runPhase_2_1_6_Conversions` seed passes are pair-specific
  (Ideologue/Impressionable + Loyal/Opportunist), not generic; the 4
  new pairs don't get dedicated seed passes. (f) **5 new CURATED_ROWS
  authored stats** — informed by biographical sources (e.g. Clay's
  multi-term Senate / Speaker stature gives `legislative=5` /
  `backroom=5` / `command=5`); these are the architect's CP2 calls,
  CP1 human may adjust.

**Brief file:** `/home/user/AMPU/docs/briefs/trait-pass-b-new-traits.md`
