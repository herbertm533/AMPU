# Brief: Trait Pass B — Governance traits + era-event expertise routing (PR6)

## CP1 USER REVISION carried in (binding override)

User at CP1 chose **option (b) Add `loyalty: number` field on Politician**
over the PM's recommended ideology+state proxy. The brief reconciles the
spec's proxy-only text by substituting a real schema field everywhere the
spec said "ideology + state proxy for cabinet loyalty":

- `Politician` gains a non-optional `loyalty: number` field, range
  `[0.0, 1.0]`, default `1.0`.
- A new `LOYALTY_DECAY` table indexed by (state region × ideology) drives
  per-event decay during Secession Winter.
- Secession Winter defection threshold is `loyalty < 0.4`.
- Save migration in `repair()` backfills `loyalty = 1.0` on existing saves.
- 4 marquee `CURATED_ROWS` carry explicit starting loyalty (Cobb 0.5,
  Floyd 0.5, Thompson 0.5, Cass 0.9). All other rows default to 1.0.

Everywhere the spec wrote "compute pro-slavery flag from `ideology +
state`" for the **Secession Winter defection candidate test**, the brief
substitutes `LOYALTY_DECAY` resolution + threshold compare. The
**John Brown slavery-position proxy** (Section H of spec, AC #29) is
NOT loyalty-based — it stays as `ideology ∈ {Conservative,
Traditionalist, RW Populist} && state ∈ SLAVE_STATES_1856`, because the
historical question there is "does this Sec read pro-slavery" not "will
this Sec defect." The two mechanisms are independent.

The other CP1 questions resolved at PM recommendations (no override):
- **Q5 fading pool**: add Crisis Admin + Crisis Gov + Decisive General.
- **Q4 code labels**: KEEP Crisis Admin / Crisis Gov / Delegator / Micromanager.
- **Q3 magnitude bands**: reuse PR4a's `SMALL=2, MEDIUM=4, LARGE=8`.
- **Q7 Overeager hook**: simple flat bonus, no threshold mechanic.
- **Q6 Master Kingmaker**: additive-only `+LARGE` on `internal_party`.
- **Q8 Pierce within-pair stack**: ship Overeager + Passive both (special case).
- **Q9 Buchanan attribution**: drop Efficient, add Passive + Naive Strategist.

---

## Approach

PR6 is a **types + engine + dataset + event-data** layer that closes the
PR1 (expertise) / PR5 (cabinet expertise scoring) loop on the governance
side. We extend the `Trait` union by 10, classify each into
`POSITIVE_TRAITS` / `NEGATIVE_TRAITS`, add a new top-level
`TRAIT_GOVERNANCE_EFFECTS` table (rule-row shape mirroring PR4a's
`TRAIT_ELECTION_EFFECTS` at `types.ts:639+`) with ~30 rows across 4
governance contexts (`governance_crisis` / `lingering_phase` /
`military_command` / `internal_party`), add 5 conflict pairs to
`TRAIT_CONFLICTS`, and append 3 traits to the `oldAge.fadingPool`. We add
a non-optional `loyalty: number` field on `Politician` plus a
`LOYALTY_DECAY` table and a hand-rolled `SLAVE_STATES_1856` constant
(inline in `types.ts`, near `OFFICE_EXPERTISE`). We layer per-trait
governance modulation into three engine sites: (E-1) the
`runPhase_2_5_1_Lingering` cabinet bonus pass at line 3032, (E-2) the
`runPhase_2_3_2_Military` wartime command grant at line 2197, and (E-3)
a new pre-`applyEffect` modulation pass in `resolveEraEvent` at line
2735 via a new pure helper `modulateEraEventEffect`. We modify 2
existing era events (Dred Scott, John Brown) and add 2 new ones
(Secession Winter, Trent Affair) in `src/data/eraEvents1856.ts`. We
update 20 marquee `CURATED_ROWS` entries in `scripts/seedDataset.mjs`.
Save migration in `repair()` adds `loyalty` defaults. No PV formula
change, no election arithmetic change, no UI work.

**Alternative rejected — adding `TRAIT_GOVERNANCE_EFFECTS` as a flat
`Record<Trait, Record<GovernanceContext, number>>` nested map.** The
flat rule-row array shape (`TraitGovernanceRule[]`) mirrors PR4a's
precedent, allows multiple rows per (trait, context) cell for Iron
Fist's split honest/domestic in `lingering_phase`, and accommodates the
optional `meter?: keyof NationalMeters` + `multiplier?: number` fields
without forcing a sentinel-object shape. PR4a's
`TRAIT_ELECTION_EFFECTS[639]` already proved this pattern at scale.

**Alternative rejected — splitting `LOYALTY_DECAY` per-state instead of
per-region.** A per-state table (15 slave states × 7 ideologies = 105
cells) would over-specify the model. Per-region (3 buckets: South,
Border, Other) × 7 ideologies = 21 cells gives the same Cobb-defects /
Cass-stays outcomes named in the historical brief with much less surface.
The `SLAVE_STATES_1856` constant remains needed for the John Brown
ideology+state proxy (which IS per-state via set membership) — but the
loyalty decay reads region via the existing `state.region` field on
`State`.

**Alternative rejected — Pierce within-pair stack option (b) prune
Overeager.** Per Open Q8 / PR4b precedent (curated dataset rows write
traits directly via `traits.push`, bypassing `tryGrantTrait`'s d6
conflict check at seed time). Pierce historically signals both Passive
AND Overeager — "knew it would cause catastrophe and signed anyway."
The brief ships both with an inline comment in `seedDataset.mjs`
flagging the curated exception. Architect-CP2 retains the prune option
if `npm run build` typechecks fail (it should not — the trait array is
`Trait[]` with no compile-time exclusion).

**Alternative rejected — multiplier reads on `partyPreference` /
`enthusiasm` / `interestGroups` for Delegator/Micromanager.** PM
recommendation: `meters` only. Multiplying enthusiasm + partyPreference
would compound across already-loaded election context and risk runaway
swings; `meters` is the visible governance surface in the
`EraEventModal` and lingering log.

**Alternative rejected — promoting John Brown decider from `'president'`
to `'cabinet'`.** Per CP2-deferable open Q10 / Deviation C in spec. The
existing event flow expects President-chooses-response shape. Modulation
captures the SecWar signal at resolve time. Future PR can promote.

**Locked CP1 decisions carried in:** Q1 loyalty data model = (b)
`loyalty: number` field (user override). Q2 John Brown slavery proxy =
(a) ideology + state set membership. Q3 bands = (a) reuse PR4a's
`SMALL=2/MEDIUM=4/LARGE=8`. Q4 code labels = (a) KEEP. Q5 fading pool =
(b) add the 3 governance traits. Q6 Master Kingmaker = (b) additive-only.
Q7 Overeager hook = (c) flat bonus, no threshold. Q8 Pierce = ship both.
Q9 Buchanan = drop Efficient + add Passive + Naive Strategist.

## State & type changes

### `src/types.ts` — Trait union expansion + 6 new constants + Politician.loyalty

**(A) `Trait` union expansion** at `types.ts:62-107`. The union goes
from 45 members to 55. Append the 10 new entries near their semantic
neighbors. Crisis Admin / Crisis Gov near `Crisis Manager` (line 69);
Decisive General / Naive Strategist near the military / `Leadership`
cluster; Iron Fist / Delegator / Micromanager near positive command;
Domestic Warrior in positives; Master Kingmaker near `Kingmaker`;
Overeager in negatives near `Passive`. Final placement is architect's
call — the spec AC #1 leaves order flexible:

```ts
// (positives section additions)
  | 'Crisis Admin'         // PR6 — fiscal crisis competence (Hamilton, Chase)
  | 'Crisis Gov'           // PR6 — constitutional crisis competence (Lincoln, Washington Whiskey)
  | 'Decisive General'     // PR6 — wartime command effectiveness (Grant, Washington Trenton)
  | 'Domestic Warrior'     // PR6 — legislative / domestic-policy ranger (Calhoun, Clay, Sumner)
  | 'Iron Fist'            // PR6 — authoritarian governance (Jackson, Polk, Lincoln habeas)
  | 'Delegator'            // PR6 — multiplier UP on cabinet effects (Lincoln Team of Rivals)
  | 'Master Kingmaker'     // PR6 — internal_party install power (Clay 1824, Van Buren Albany Regency)
// (negatives section additions)
  | 'Naive Strategist'     // PR6 — strategic incompetence (McClellan, St. Clair, Hull)
  | 'Micromanager'         // PR6 — multiplier DOWN on cabinet effects (Polk diary, Adams 1798)
  | 'Overeager'            // PR6 — acts before circumstances warrant (Pierce KS-NE, Wilkes Trent)
```

**(B) `POSITIVE_TRAITS` / `NEGATIVE_TRAITS` updates** at `types.ts:109-158`.
Per spec AC #2: 7 added to POSITIVE_TRAITS (Crisis Admin, Crisis Gov,
Decisive General, Domestic Warrior, Iron Fist, Delegator, Master
Kingmaker). 3 added to NEGATIVE_TRAITS (Naive Strategist, Micromanager,
Overeager). Iron Fist is POSITIVE at the flat-PV layer because Jackson +
Lincoln both read national PV positive — the trait's COST surfaces at
the `lingering_phase` honest/domestic split (AC #6 / #16) and at the
governance event hits. Mirrors PR4b's Provincial structural-negative-
with-context-positive pattern.

**(C) `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool` update** at `types.ts:551`.
Append 3 entries:

```ts
fadingPool: ['Celebrity', 'Charismatic', 'Hale',
             'Crisis Admin', 'Crisis Gov', 'Decisive General'] as Trait[],
```

The existing PR2a/PR3 fading code path at `phaseRunners.ts:2327-2345`
iterates `fadingPool.filter((t) => p.traits.includes(t))` — no engine
change needed. The 3 new traits roll-decay at age 70+ with the same
`baseChance + ageBracketBonus` schedule.

**(D) `TRAIT_CONFLICTS` extension** at `types.ts:569-593`. Append 10
entries (5 pairs × 2 directions for the symmetric lookup PR3 requires):

```ts
  // --- PR6 additions (5 pairs × 2 directions = 10 entries) ---
  'Decisive General': 'Naive Strategist',
  'Naive Strategist': 'Decisive General',
  Delegator:          'Micromanager',
  Micromanager:       'Delegator',
  'Domestic Warrior': 'Domestic Apathy',
  'Domestic Apathy':  'Domestic Warrior',
  'Master Kingmaker': 'Outsider',
  Outsider:           'Master Kingmaker',
  Overeager:          'Passive',
  Passive:            'Overeager',
```

Crisis Admin, Crisis Gov, Iron Fist remain standalone (no conflict pair)
per AC #11. The d6 threshold (`conflictD6Threshold = 4` at `types.ts:554`)
applies unchanged via PR3's `tryGrantTrait` at `engine/traits.ts:27-43`.

**(E) New `GovernanceContext` type + `TRAIT_GOVERNANCE_BANDS` +
`TraitGovernanceRule` + `TRAIT_GOVERNANCE_EFFECTS` table.** Insert
immediately AFTER `TRAIT_ELECTION_EFFECTS` (which closes around
`types.ts:907` or wherever the existing `];` lands — append at the next
blank line after the closing bracket). Co-locating with the election
table mirrors the data shape. Numerically identical bands to PR4a's
`TRAIT_ELECTION_BANDS` per Q3 / AC #4:

```ts
// PR6 governance contexts — 4 contexts orthogonal to PR4a's 6 election contexts.
// governance_crisis: era-event modulation (Dred Scott, John Brown, Secession Winter, Trent Affair)
// lingering_phase:   per-turn meter drift in runPhase_2_5_1_Lingering
// military_command:  wartime Command grant in runPhase_2_3_2_Military
// internal_party:    faction-leader / dark-horse install bonus (faction scoring path)
export type GovernanceContext =
  | 'governance_crisis'
  | 'lingering_phase'
  | 'military_command'
  | 'internal_party';

// Numerically identical to TRAIT_ELECTION_BANDS — named separately for
// clarity at consumer sites and to leave PR6 with its own dial.
export const TRAIT_GOVERNANCE_BANDS = {
  SMALL: 2,
  MEDIUM: 4,
  LARGE: 8,
} as const satisfies { SMALL: number; MEDIUM: number; LARGE: number };

export interface TraitGovernanceRule {
  trait: Trait;
  context: GovernanceContext;
  // Signed additive magnitude (default semantics). When `multiplier`
  // is set, the rule applies multiplicatively to the consumer's base
  // and `magnitude` is treated as 0.
  magnitude: number;
  // Optional meter override on lingering_phase split rows (Iron Fist
  // emits two rows: one for `honest`, one for `domestic`). When
  // omitted, the consumer uses the seat's primary meter or the chosen
  // response's `meters` field.
  meter?: keyof NationalMeters;
  // Delegator / Micromanager only. When set, the consumer multiplies
  // the base bonus / response-meter swing by this factor (1.5 = +50%,
  // 0.5 = -50%).
  multiplier?: number;
}

export const TRAIT_GOVERNANCE_EFFECTS: TraitGovernanceRule[] = [
  // --- Crisis Admin (Hamilton, Morris, Gallatin, Chase) ---
  { trait: 'Crisis Admin', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.LARGE  },
  { trait: 'Crisis Admin', context: 'lingering_phase',   magnitude: TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'economic' },
  { trait: 'Crisis Admin', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL  },

  // --- Crisis Gov (Lincoln, Washington Whiskey, Adams XYZ) ---
  { trait: 'Crisis Gov', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.LARGE  },
  { trait: 'Crisis Gov', context: 'lingering_phase',   magnitude: TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'domestic' },
  { trait: 'Crisis Gov', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL  },

  // --- Decisive General (Grant, Sherman, Washington Trenton) ---
  { trait: 'Decisive General', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Decisive General', context: 'military_command',  magnitude: TRAIT_GOVERNANCE_BANDS.LARGE },

  // --- Naive Strategist (McClellan, St. Clair, Hull, Floyd) ---
  { trait: 'Naive Strategist', context: 'governance_crisis', magnitude: -TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Naive Strategist', context: 'military_command',  magnitude: -TRAIT_GOVERNANCE_BANDS.LARGE },

  // --- Domestic Warrior (Calhoun, Clay, Sumner, Madison Bill of Rights) ---
  { trait: 'Domestic Warrior', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL  },
  { trait: 'Domestic Warrior', context: 'lingering_phase',   magnitude: TRAIT_GOVERNANCE_BANDS.MEDIUM, meter: 'domestic' },
  { trait: 'Domestic Warrior', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.MEDIUM },

  // --- Iron Fist (Jackson, Polk, Lincoln habeas, Adams Sedition) ---
  // SPLIT on lingering_phase: +SMALL honest, -SMALL domestic per AC #6.
  // Architect emits TWO rows, one per meter target.
  { trait: 'Iron Fist', context: 'governance_crisis', magnitude:  TRAIT_GOVERNANCE_BANDS.MEDIUM },
  { trait: 'Iron Fist', context: 'lingering_phase',   magnitude:  TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'honest'   },
  { trait: 'Iron Fist', context: 'lingering_phase',   magnitude: -TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'domestic' },
  { trait: 'Iron Fist', context: 'military_command',  magnitude:  TRAIT_GOVERNANCE_BANDS.SMALL  },
  { trait: 'Iron Fist', context: 'internal_party',    magnitude:  TRAIT_GOVERNANCE_BANDS.SMALL  },

  // --- Delegator (Lincoln Team of Rivals, Washington 1789-97) ---
  // MULTIPLIER on governance_crisis (event meters) + lingering_phase (PR5 +0.2 bonus).
  // Additive +SMALL on internal_party.
  { trait: 'Delegator', context: 'governance_crisis', magnitude: 0, multiplier: 1.5 },
  { trait: 'Delegator', context: 'lingering_phase',   magnitude: 0, multiplier: 1.5 },
  { trait: 'Delegator', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },

  // --- Micromanager (Polk 25-volume diary, Adams 1797-1801) ---
  // MULTIPLIER on governance_crisis (event meters) + lingering_phase (PR5 +0.2 bonus).
  // Additive +SMALL on military_command (Polk-Scott Mexican War).
  // Additive +SMALL on internal_party.
  { trait: 'Micromanager', context: 'governance_crisis', magnitude: 0, multiplier: 0.5 },
  { trait: 'Micromanager', context: 'lingering_phase',   magnitude: 0, multiplier: 0.5 },
  { trait: 'Micromanager', context: 'military_command',  magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Micromanager', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },

  // --- Overeager (Pierce KS-NE, Polk 1846 war message, Clay 1812) ---
  { trait: 'Overeager', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Overeager', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },

  // --- Master Kingmaker (Clay 1824, Van Buren Albany Regency, Weed, Burr 1800) ---
  // LARGE on internal_party per F-MK-KINGMAKER-RULES-SEPARATE — pure additive,
  // does not interact with KINGMAKER_RULES at types.ts:275-287.
  { trait: 'Master Kingmaker', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Master Kingmaker', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.LARGE },
];
```

**Row count:** Crisis Admin 3 + Crisis Gov 3 + Decisive General 2 +
Naive Strategist 2 + Domestic Warrior 3 + Iron Fist 5 + Delegator 3 +
Micromanager 4 + Overeager 2 + Master Kingmaker 2 = **29 rows**.
Architect lock.

**(F) New `SLAVE_STATES_1856` constant** at `types.ts` immediately after
`OFFICE_EXPERTISE` (line 954). Per CP2-deferable Q15: PM recommended a
new file `src/data/historicalStateRegions.ts` for future-PR cleanliness.
Architect overrides: PUT IT IN `types.ts`. Rationale: only one consumer
(the John Brown ideology+state proxy in the modulation helper), and the
constant is small (15 ids). A new file adds an import surface for one
read-only constant. Future PR that adds more region constants can
extract.

```ts
// PR6 hand-rolled slave-state set circa 1856. The 15 slave states circa
// the antebellum (eventual 11 CSA states + 4 border-loyal slave states).
// Used by John Brown event modulation (ideology + state proxy for slavery
// position) and Secession Winter loyalty decay lookup (state region maps
// via STATES_1856[].region — not via this set).
export const SLAVE_STATES_1856: ReadonlyArray<string> = [
  'va', 'sc', 'ga', 'al', 'ms', 'tn', 'nc', 'ky',
  'mo', 'fl', 'ar', 'tx', 'la', 'md', 'de',
];
```

**(G) New `LOYALTY_DECAY` table + threshold constants.** Insert
immediately after `SLAVE_STATES_1856`. Per USER REVISION item 2 (decay
fires DURING crisis events, not as passive per-turn drift) and the
architect lockset from the task brief:

```ts
// PR6 Secession Winter loyalty decay. Fires DURING the Secession Winter
// event resolution (not as passive per-turn drift). Indexed by
// (state-region, ideology) and returns per-event decay applied to
// each cabinet member's loyalty field. After decay, loyalty <
// LOYALTY_DEFECTION_THRESHOLD triggers defection (Sec resigns + Traitor
// trait granted + cabinet seat nulled).
//
// Region buckets per src/data/states1856.ts:
//   - 'South' (slave): SC, GA, FL, AL, MS, LA, TX, AR, NC, TN, VA
//   - 'Border' (slave): DE, MD, KY, MO
//   - 'Northeast' / 'Midwest' / 'West': loyalty unaffected
//
// Calhoun-anchor (Conservative South Sec): 0.5 * 1.0 = 0.5 → loyalty
// 0.5 - 0.5 = 0.0 → defects.
// Cass-anchor (Moderate Border-ish): the historical Cass was Michigan
// (Midwest, NORTH_BASE = 0.0), so decay = 0.0 * 0.3 = 0.0 → no change
// from his explicit 0.9 → stays.
export const LOYALTY_REGION_BASE = {
  South: 0.5,
  Border: 0.2,
  Northeast: 0.0,
  Midwest: 0.0,
  West: 0.0,
} as const satisfies Record<string, number>;

export const LOYALTY_IDEOLOGY_MULT: Record<Ideology, number> = {
  'RW Populist':    1.2,
  Traditionalist:   1.0,
  Conservative:     0.7,
  Moderate:         0.3,
  Liberal:          0.0,
  Progressive:     -0.2,
  'LW Populist':   -0.3,
};

// Defection trigger threshold. A cabinet member whose post-decay loyalty
// is strictly less than this value resigns. Tuned so the marquee
// defectors (Cobb 0.5→0.0, Floyd 0.5→0.0, Thompson 0.5→0.0) hit and
// Cass (0.9→0.9) stays.
export const LOYALTY_DEFECTION_THRESHOLD = 0.4;

// Loyalty field clamp range. Writes through tryGrantTrait-style helpers
// clamp to [0, 1]; consumer engine code can read directly.
export const LOYALTY_RANGE = { min: 0, max: 1 } as const;
```

Worked examples:
- **Cobb (GA, Conservative, start 0.5)**: region South → 0.5. Ideology
  Conservative → 0.7. Decay = 0.5 * 0.7 = 0.35. Post: 0.5 - 0.35 = 0.15
  → < 0.4 → defects.
- **Floyd (VA, Conservative, start 0.5)**: region South → 0.5. Decay
  0.35. Post: 0.15 → defects.
- **Thompson (MS, Conservative, start 0.5)**: same as above → defects.
  (For a more aggressive defector profile, swap to `Traditionalist`
  ideology to hit decay 0.5 — the spec leaves Thompson as Conservative
  per simple default; either choice triggers.)
- **Cass (MI, Moderate, start 0.9)**: region Midwest → 0.0. Decay 0.0.
  Post: 0.9 → stays.

**(H) `Politician.loyalty` field addition** at `types.ts:1019-1055`. Add
as non-optional immediately after `traits: Trait[]` at line 1040:

```ts
export interface Politician {
  id: string;
  firstName: string;
  lastName: string;
  state: string;
  // ... existing fields ...
  skills: Skills;
  traits: Trait[];
  loyalty: number;          // PR6 — [0, 1]; 1 = fully loyal, 0 = fully defected.
                            // Default 1.0; explicit values for 1856 marquee Secs
                            // (Cobb/Floyd/Thompson 0.5, Cass 0.9). Read by
                            // Secession Winter event resolution.
  expertise: Expertise[];
  currentOffice: OfficeRef | null;
  // ... existing fields continue ...
}
```

**Clamp semantics:** writes through engine code go via a thin helper
that clamps to `[0, 1]`. No clamp on raw struct assignment (a save load
with an out-of-range value should not crash type-checking — `repair()`
normalizes). Spec lock: **clamp on writes via the engine helper, no
runtime invariant on direct reads.**

**(I) Save / migration impact.** Old IndexedDB saves don't carry the
`loyalty` field. `repair()` at `src/state/GameContext.tsx:91-220`
backfills `loyalty = 1.0` for every politician missing the field (per
USER REVISION item 1). 1772-scenario politicians get default 1.0 (per
USER REVISION item 6 — the field is dormant in the 1772 scenario; no
defection mechanic fires). See Engine edit E-9 below for the exact
block.

The 10 new trait union entries are additive; existing saves don't
carry any of them, so no migration needed for the union expansion (per
spec AC #3, mirrors PR4b precedent).

### `scripts/seedDataset.mjs` — 20 marquee CURATED_ROWS edits

Per spec section L / AC #45. Architect's exact attribution table inline
below. All edits are to the `[traits]` array; skills / ideology /
birthYear unchanged unless flagged. The 4 explicit loyalty values
require the row shape to accept a new field — but the row tuple is
positional `[first, last, state, ideology, birthYear, [skills], command,
[traits], party]` and adding a 10th column for loyalty would touch
`CURATED_ROWS` normalization at `seedDataset.mjs:236-249`.

**Resolution of Tuning call #1.5 (loyalty in CURATED_ROWS shape).**
Architect picks the minimal-surface approach: extend the row tuple with
an OPTIONAL 10th column `[loyalty?]`. The 4 marquee Secs add this
column; all other rows omit it; the normalization at `:243-248` reads
the 10th element and defaults to 1.0 when undefined. Update
`seedDataset.mjs:237` destructure to `for (const [first, last, state,
ideo, birth, sk, cmd, traits, party, loyalty] of ROWS)` and
push `loyalty: loyalty ?? 1.0` into the normalized object. The
downstream `legislatorsToDataset.mjs` regen also needs to write
`loyalty` to `defaultDraftClasses.ts` + JSON + CSV — see Files to touch
#4-7.

**The 20 CURATED_ROWS edits (per historian §4 + spec AC #45):**

| # | Name | Line | Current traits | PR6 add | Loyalty | Source |
|---|---|---|---|---|---|---|
| 1 | Alexander Hamilton | seedDataset.mjs:84 | `Egghead, Cosmopolitan` | + Crisis Admin, Master Kingmaker | (default 1.0) | NY Fed Panic of 1792; Adair §1.1 / §1.10 |
| 2 | Robert Morris | :87 | `Economics` | + Crisis Admin | 1.0 | Mount Vernon Morris bio §1.1 |
| 3 | Albert Gallatin | NEW row | — | (skills `[3,3,2,0,3,2]`, command 2, `Crisis Admin`, party `BLUE`) | 1.0 | Treasury Sec 1801-14 §1.1; row authored per AC #49 |
| 4 | George Washington | :55 | `Leadership, Hale` | + Decisive General, Delegator | 1.0 | Trenton 1776 + Hamilton-Jefferson deference §1.3 / §1.7 |
| 5 | John Adams | :56 | `Egghead, Debater` | + Micromanager, Crisis Gov | 1.0 | XYZ 1798 + Convention of 1800 §1.2 / §1.8 |
| 6 | Arthur St. Clair | :78 | `Military` | + Naive Strategist | 1.0 | Wabash 1791 Army.mil §1.4 |
| 7 | Aaron Burr | :85 | `Manipulative, Two-Faced` | + Master Kingmaker | 1.0 | Tammany 1800 §1.10 |
| 8 | Abraham Lincoln | :147 | `Orator, Integrity, Likable` | + Crisis Gov, Delegator | 1.0 | First Inaugural §1.2; Team of Rivals §1.7 |
| 9 | James Buchanan | :122 | `Efficient` → DROP Efficient | REPLACE with `Passive, Naive Strategist` | 1.0 | F-BUCHANAN-CORRECTION §1.2; Miller Center key events |
| 10 | James K. Polk | :139 | `Efficient, Uncharismatic` | + Iron Fist, Micromanager, Overeager | 1.0 | Dickinson Polk diary §1.6 / §1.8 / §1.9 |
| 11 | Franklin Pierce | :133 | `Passive` | + Overeager (KEEP Passive — see Pierce edge case AC #46) | 1.0 | Miller Center Pierce KS-NE §1.9 |
| 12 | John C. Calhoun | :192 | `Orator, Debater, Predictable, Nationalist` | + Domestic Warrior | (default 1.0) | Nullification §1.5 |
| 13 | Henry Clay | :183 | `Charismatic, Likable, Magician, Orator` | + Master Kingmaker, Domestic Warrior | 1.0 | 1824 Corrupt Bargain §1.10 / §1.5 |
| 14 | Martin Van Buren | :142 | `Manipulative, Magician` | + Master Kingmaker | 1.0 | Albany Regency / 1844 Polk dark-horse §1.10 |
| 15 | Ulysses S. Grant | :167 | `Military` | + Decisive General | 1.0 | Overland Campaign §1.3 |
| 16 | William T. Sherman | :168 | `Military` | + Decisive General | 1.0 | Atlanta + March §1.3 |
| 17 | George B. McClellan | :169 | `Military, Passive` | + Naive Strategist (stack with Passive — clean, not a conflict pair) | 1.0 | Peninsula Campaign §1.4 |
| 18 | Edwin Stanton | NEW row | — | (skills `[4,2,3,0,3,3]`, command 3, `Crisis Admin, Iron Fist`, party `RED`) | 1.0 | Wartime logistics + press suppression §1.1 / §1.6; NOT Decisive General per historian deliberate correction |
| 19 | John B. Floyd | :128 | `Corrupt` | + Iron Fist, Naive Strategist | **0.5** | Utah War + Indian Bonds + cannon redistribution §1.4 / §1.6 |
| 20 | Salmon P. Chase | :153 | `Integrity, Reformist, Uncharismatic, Predictable` | + Crisis Admin | 1.0 | Greenbacks + National Banking Acts §1.1 |

**Additional CURATED_ROWS edits** (4 marquee Secs requiring explicit
loyalty, beyond the 20-attribution table above):

| # | Name | Line | Loyalty | Note |
|---|---|---|---|---|
| 21 | Howell Cobb | :127 | **0.5** | GA Conservative wavering by Dec 1860 |
| 22 | Jacob Thompson | NEW row (not currently in seedDataset.mjs) | **0.5** | MS Conservative Interior Sec; resigned Jan 8 1861. Author skills `[2,2,1,0,2,2]`, command 2, `Provincial`, party `BLUE`. |
| 23 | Lewis Cass | :131 | **0.9** | MI Moderate; resigned Dec 12 1860 in protest of Buchanan's refusal to reinforce — pro-Union despite Southern sympathies. Current traits `Globalist` kept; no PR6 trait additions. |

(Floyd already at row #19 above gets 0.5.)

**Pierce within-pair stack** (Overeager + Passive co-occurrence per
AC #46 / Open Q8 / Option (a) — ship both): the curated path
(`seedDataset.mjs` ROWS → `CURATED_ROWS`) writes traits directly to the
politician's `traits` array, bypassing `tryGrantTrait`'s conflict d6
(PR4b precedent at `data/draftImport.ts:26,223`). Add an inline comment
on the Pierce row:

```js
// PR6: Pierce uniquely both Overeager AND Passive — historical fact (KS-NE
// catastrophe-aware signing). Within-pair stack PM-allowed at curated seed
// time; conflict map prevents subsequent random grants of either.
['Franklin','Pierce','nh','Moderate',1804,[2,2,1,1,2,2],2,['Passive','Overeager'],'BLUE'],
```

**Buchanan attribution edit** (per AC #47 / Open Q9 / F-BUCHANAN-
CORRECTION). Replace the `Efficient` trait line with the corrected
attribution:

```js
// PR6: Buchanan correction — F-BUCHANAN-CORRECTION. He was the documented
// anti-case for both Efficient AND Iron Fist. Replace Efficient with the
// historian's Passive + Naive Strategist. PV swing: +4 → -10 = -14.
['James','Buchanan','pa','Conservative',1791,[4,3,2,0,3,3],4,['Passive','Naive Strategist'],'BLUE'],
```

After all `seedDataset.mjs` edits, the regen pipeline (`bash
scripts/fetchLegislators.sh && node scripts/legislatorsToDataset.mjs &&
npm run build`) produces updated `public/standard-draft-classes.json` +
`politicians-dataset.csv` + `src/data/defaultDraftClasses.ts`. PR6 does
NOT execute the regen — CP2 builder runs it. See Test Plan below for
the network-restriction fallback.

## Engine changes (pure logic)

All deterministic over the snapshot via `src/rng.ts`. The Secession
Winter event uses `chance()` for the d6-style probabilistic defection
trigger; no other new RNG path. **9 surgical edits.**

### Edit E-1: `runPhase_2_5_1_Lingering` trait-layer insertion

**Site:** `phaseRunners.ts:3032` (AFTER the PR5 `cabinetBonuses` loop
ending at line 3032, BEFORE the `nationalDebt` line at line 3035).

**Purpose:** Layer per-trait governance modulation on top of PR5's
per-seat `+0.2` expertise bonus. Per AC #16: read each cabinet seat's
occupant, filter `TRAIT_GOVERNANCE_EFFECTS` by `context ===
'lingering_phase'` AND held traits; apply additive rows to the seat's
primary meter (or `rule.meter` override for Iron Fist's split), apply
multiplier rows from the seated President to amplify/dampen the PR5
bonus on EVERY occupied seat.

**Code block to insert AFTER line 3032:**

```ts
  // PR6 per-trait lingering-phase modulation. Applies AFTER the PR5 expertise
  // bonus so the multiplier on Delegator/Micromanager-President compounds with
  // the per-seat +0.2. Pure: no RNG, no snapshot mutation outside `apply()`.
  //
  // 1. Read seated President's traits. Compute multiplier from Delegator (1.5)
  //    or Micromanager (0.5); default 1.0.
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  let presMultiplier = 1.0;
  if (president) {
    if (president.traits.includes('Delegator'))   presMultiplier = 1.5;
    if (president.traits.includes('Micromanager')) presMultiplier = 0.5;
  }

  // 2. If multiplier != 1.0, re-apply the differential of the PR5 expertise
  //    bonus to every occupied seat where the PR5 bonus fired. We re-walk the
  //    cabinetBonuses array (already in scope from line 3014) and apply
  //    (multiplier - 1.0) * 0.2 to each matched seat — the delta on top of
  //    PR5's already-applied +0.2.
  if (presMultiplier !== 1.0) {
    for (const { seat, meter } of cabinetBonuses) {
      const occupantId = snap.game.cabinet[seat];
      if (!occupantId) continue;
      const sec = snap.politicians.find((p) => p.id === occupantId);
      if (!sec) continue;
      const primaryExpertise = OFFICE_EXPERTISE[seat];
      if (primaryExpertise && sec.expertise.includes(primaryExpertise)) {
        apply(meter, (presMultiplier - 1.0) * 0.2);
      }
    }
  }

  // 3. Apply per-trait additive lingering_phase rules to each occupied seat
  //    AND to the President's own seat. Seat → primary meter mapping mirrors
  //    cabinetBonuses (President defaults to `honest` per AC #16's Iron Fist
  //    split; rule.meter override wins).
  const seatPrimaryMeter: Partial<Record<OfficeType, keyof NationalMeters>> = {
    SecretaryOfState:     'domestic',
    SecretaryOfTreasury:  'economic',
    SecretaryOfWar:       'military',
    SecretaryOfNavy:      'military',
    AttorneyGeneral:      'honest',
    SecretaryOfInterior:  'quality',
    PostmasterGeneral:    'quality',
  };
  const applyTraitsForSeat = (p: Politician, primary: keyof NationalMeters) => {
    for (const rule of TRAIT_GOVERNANCE_EFFECTS) {
      if (rule.context !== 'lingering_phase') continue;
      if (rule.multiplier != null) continue;       // multipliers applied above
      if (!p.traits.includes(rule.trait)) continue;
      apply(rule.meter ?? primary, rule.magnitude);
    }
  };
  for (const [seat, primary] of Object.entries(seatPrimaryMeter) as Array<[OfficeType, keyof NationalMeters]>) {
    const occupantId = snap.game.cabinet[seat];
    if (!occupantId) continue;
    const sec = snap.politicians.find((p) => p.id === occupantId);
    if (!sec) continue;
    applyTraitsForSeat(sec, primary);
  }
  // President applies on `honest` by default; the Iron Fist split row carries
  // its own `meter: 'domestic'` and gets routed correctly inside applyTraitsForSeat.
  if (president) applyTraitsForSeat(president, 'honest');
```

**Per-trait lingering-phase meter mapping** (the architect's locked
intent, encoded by the rule `meter` field where it differs from the
seat's primary):

| Trait | Seat read | Meter | Magnitude |
|---|---|---|---|
| Crisis Admin | President, Treasury | `economic` (override) | +SMALL = +2 |
| Crisis Gov | President | `domestic` (override) | +SMALL = +2 |
| Domestic Warrior | President, Cabinet | seat's primary OR `domestic` for President | +MEDIUM = +4 |
| Iron Fist | President | `honest` +SMALL; `domestic` −SMALL (split) | ±SMALL = ±2 |
| Delegator | President | (multiplier on PR5 bonus) | ×1.5 |
| Micromanager | President | (multiplier on PR5 bonus) | ×0.5 |

### Edit E-2: `runPhase_2_3_2_Military` Decisive General / Naive Strategist hook

**Site:** `phaseRunners.ts:2177-2203` (the GeneralInChief candidate block;
the wartime `+1` Command grant lands at line 2197).

**Purpose:** Layer Decisive General (+1 ADDITIONAL Command on top of
PR2b's wartime +1, net +2) and Naive Strategist (SUPPRESS the wartime
+1) onto the GeneralInChief candidate; also a Decisive General SecWar
boost on the GeneralInChief if SecWar is seated.

**Replacement code** for the existing GeneralInChief block at lines
2186-2202:

```ts
  if (!snap.game.cabinet.GeneralInChief) {
    const candidates = snap.politicians.filter((p) => !p.currentOffice && p.skills.military >= 3);
    candidates.sort((a, b) => b.skills.military - a.skills.military);
    if (candidates[0]) {
      const gic = candidates[0];
      snap.game.cabinet.GeneralInChief = gic.id;
      gic.currentOffice = { type: 'GeneralInChief' };
      addLog(snap, '2.3.2', 'appointment', `${gic.firstName} ${gic.lastName} appointed General in Chief.`);
      const xp = OFFICE_EXPERTISE.GeneralInChief;
      if (xp && addExpertise(gic, xp)) {
        addLog(snap, '2.3.2', 'appointment', `${gic.firstName} ${gic.lastName} gains ${xp} expertise.`);
      }
      if (warActive) {
        // PR6 trait modulation. Decisive General → +1 ADDITIONAL on top of the
        // PR2b wartime +1 (net +2). Naive Strategist → SUPPRESS the wartime +1.
        // Cross-trait stacking impossible per AC #10 conflict pair.
        const decisive = gic.traits.includes('Decisive General');
        const naive    = gic.traits.includes('Naive Strategist');
        const grant = naive ? 0 : (decisive ? 2 : 1);
        if (grant > 0 && addCommandPoint(gic, grant)) {
          if (decisive) {
            addLog(snap, '2.3.2', 'appointment',
              `${gic.firstName} ${gic.lastName} gains Command as wartime General in Chief (Decisive General bonus).`);
          } else {
            addLog(snap, '2.3.2', 'appointment',
              `${gic.firstName} ${gic.lastName} gains Command as wartime General in Chief.`);
          }
        } else if (naive) {
          addLog(snap, '2.3.2', 'appointment',
            `${gic.firstName} ${gic.lastName} appointed General in Chief — Naive Strategist, no wartime Command bump.`);
        }

        // PR6 SecWar Decisive General provides strategic cover → +1 to GIC.
        // Naive Strategist SecWar provides no bump.
        const secWar = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfWar);
        if (secWar?.traits.includes('Decisive General')) {
          if (addCommandPoint(gic, 1)) {
            addLog(snap, '2.3.2', 'appointment',
              `${gic.firstName} ${gic.lastName} gains Command from SecWar ${secWar.firstName} ${secWar.lastName}'s strategic cover.`);
          }
        }
      }
    }
  }
```

`addCommandPoint` already respects the existing `KINGMAKER_RULES.
commandCap = 5` ceiling (verify via grep). The SecWar Decisive General
boost ONLY fires when `warActive` is true. Both readings short-circuit
gracefully if the trait isn't held — no test for held conflict-pair
counter-trait needed (the d6 grant pipeline prevents within-pair
co-occurrence).

### Edit E-3: `resolveEraEvent` pre-modulation pass

**Site:** `phaseRunners.ts:2726-2767`. The existing function calls
`applyEffect(snap, resp.effect)` directly at line 2735.

**Purpose:** Insert a pre-`applyEffect` pass that wraps `resp.effect`
into a **modulated copy** with cabinet-expertise and trait-driven
multipliers applied to `meters` before the underlying meter clamps and
log lines fire.

**Replacement code** at lines 2726-2735:

```ts
export function resolveEraEvent(snap: FullGameSnapshot, eventId: string, responseId: string): void {
  const event = snap.game.pendingEraEvents.find((e) => e.id === eventId);
  if (!event) return;
  const resp = event.responses.find((r) => r.id === responseId);
  if (!resp) return;
  // For the 1772 graph: a node not controlled by the player was resolved by the
  // AI (tag the feed so the Era Events page can badge it). Computed BEFORE we
  // mark resolved/applyEffect, since control depends on current state.
  const aiResolved = snap.game.scenarioId === '1772' && isAutoResolved(snap, event);

  // PR6: Secession Winter pre-resolution defection check (must run BEFORE the
  // modulation pass — modulation reads the post-decay loyalty + N defectors).
  if (event.templateId === 'secession-winter') {
    runSecessionWinterDefections(snap, event, resp.id);
  }

  // PR6: Pre-modulation pass. Returns a deep-cloned effect with `meters`
  // adjusted per cabinet expertise + governance traits + Delegator/Micromanager
  // multiplier. Other effect fields (partyPreference, enthusiasm,
  // interestGroups, diplomacy, startWar) pass through unchanged.
  const modulatedEffect = modulateEraEventEffect(snap, event, resp);
  applyEffect(snap, modulatedEffect);

  event.resolved = true;
  // ... rest unchanged ...
}
```

The Secession Winter defection check runs FIRST so the modulation can
read the post-defection cabinet state when computing magnitudes
(specifically: the `N` defector count modulates the meter swings).

### Edit E-4: `modulateEraEventEffect` new pure helper

**Site:** New helper in `phaseRunners.ts`, placed immediately after
`resolveEraEvent`.

**Purpose:** Pure function that returns a NEW effect object (deep copy
of `meters`) with magnitudes adjusted. Reads from `snap` but does not
mutate it.

```ts
// PR6 era-event modulation helper. Pure: returns a NEW effect with `meters`
// adjusted; other fields (partyPreference, enthusiasm, etc.) reference the
// original object. Mutating engine code reads only `meters` for the multiplier
// pass; the other fields pass through unchanged.
//
// Mechanism (per spec sections G-J + AC #5 / #25 / #29 / #39):
// 1. Look up event-specific routing: which Sec(s) modulate, which trait keys.
// 2. Apply per-event multipliers in order:
//    a. Cabinet expertise (AG Justice for Dred Scott, SecWar Military for
//       John Brown, SecState Foreign Affairs for Trent Affair)
//    b. President governance traits (Iron Fist / Crisis Gov / Iron Fist on
//       relevant responses per the spec's per-event tables)
//    c. Cabinet member traits (SecWar Decisive General / Naive Strategist
//       on John Brown; SecState Crisis Gov / Iron Fist on Trent Affair)
//    d. President Delegator (×1.5) / Micromanager (×0.5) — LAST so it
//       multiplies the cumulative adjusted magnitude
// 3. Secession Winter additionally adjusts magnitudes by `N` defectors
//    (computed and stored in `event.metadata?.secessionDefectionCount`
//    by runSecessionWinterDefections at E-5 below).
function modulateEraEventEffect(
  snap: FullGameSnapshot,
  event: EraEvent,
  resp: EraEventResponse,
): EraEventResponseEffect {
  // Deep-clone meters; pass other fields by reference.
  const out: EraEventResponseEffect = {
    ...resp.effect,
    meters: resp.effect.meters ? { ...resp.effect.meters } : undefined,
  };
  if (!out.meters) return out;

  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  const cabinet = snap.game.cabinet;
  const getSec = (seat: OfficeType) => {
    const id = cabinet[seat];
    return id ? snap.politicians.find((p) => p.id === id) : undefined;
  };
  const ag      = getSec('AttorneyGeneral');
  const secWar  = getSec('SecretaryOfWar');
  const secState = getSec('SecretaryOfState');

  // Multiplier accumulator. Each branch multiplies into `mult`; meters get
  // mult-scaled at the end.
  let mult = 1.0;

  // --- Dred Scott (templateId === 'dred-scott' OR title-match for legacy) ---
  if (event.templateId === 'dred-scott' || event.title === 'Dred Scott Decision') {
    // AG Justice expertise softens domestic/honest by 0.5 (per spec AC #24).
    if (ag?.expertise.includes('Justice')) {
      // Apply only to domestic + honest (the law-trained AG would have
      // counseled narrower compliance). Implemented per-meter via the
      // adjustMeter helper below to keep `mult` cumulative.
      if (out.meters.domestic != null) out.meters.domestic *= 0.5;
      if (out.meters.honest   != null) out.meters.honest   *= 0.5;
    }
    if (president?.traits.includes('Iron Fist') && resp.id === 'r1') mult *= 1.3;
    if (president?.traits.includes('Crisis Gov') && (resp.id === 'r2' || resp.id === 'r3')) {
      if (out.meters.domestic != null) out.meters.domestic *= 0.7;
    }
  }

  // --- John Brown (templateId === 'john-brown' OR title-match) ---
  if (event.templateId === 'john-brown' || event.title.startsWith("John Brown")) {
    // SecWar Military expertise reduces all-meter magnitude by 0.8.
    if (secWar?.expertise.includes('Military')) mult *= 0.8;
    if (secWar?.traits.includes('Decisive General')) {
      if (out.meters.military != null) out.meters.military *= 1.2;
    }
    if (secWar?.traits.includes('Naive Strategist')) {
      if (out.meters.military != null) out.meters.military *= 0.7;
      if (out.meters.domestic != null) out.meters.domestic *= 1.3;
    }
    if (president?.traits.includes('Iron Fist') && resp.id === 'r3') mult *= 1.3;
    if (president?.traits.includes('Crisis Gov') && resp.id === 'r2') {
      if (out.meters.domestic != null) out.meters.domestic *= 0.7;
    }
    if (ag?.expertise.includes('Justice')) {
      if (out.meters.honest != null) out.meters.honest *= 0.8;
    }
    // Slavery-position routing per AC #29 (ideology + state proxy).
    if (secWar) {
      const proSlaveryIdeo = ['Conservative', 'Traditionalist', 'RW Populist'] as const;
      const antiSlaveryIdeo = ['Liberal', 'Progressive', 'LW Populist'] as const;
      const inSlaveState = SLAVE_STATES_1856.includes(secWar.state);
      const isPro  = (proSlaveryIdeo  as readonly Ideology[]).includes(secWar.ideology) && inSlaveState;
      const isAnti = (antiSlaveryIdeo as readonly Ideology[]).includes(secWar.ideology) && !inSlaveState;
      if (isPro  && resp.id === 'r3') mult *= 1.3;
      if (isAnti && resp.id === 'r1') {
        if (out.meters.domestic != null) out.meters.domestic *= 1.3;
      }
    }
  }

  // --- Trent Affair (templateId === 'trent-affair') ---
  if (event.templateId === 'trent-affair') {
    if (secState?.expertise.includes('Foreign Affairs')) {
      if (resp.id === 'r1') mult *= 0.7;
      if (resp.id === 'r3') mult *= 1.2;  // overridden — worse outcome
    }
    if (secState?.traits.includes('Crisis Gov') && resp.id === 'r1') mult *= 0.7;
    if (secState?.traits.includes('Iron Fist')  && resp.id === 'r3') mult *= 1.3;
    if (president?.traits.includes('Delegator')   && resp.id === 'r1') mult *= 1.5;  // boost the improvement direction
    if (president?.traits.includes('Micromanager') && resp.id === 'r1') mult *= 0.5;
  }

  // --- Secession Winter (templateId === 'secession-winter') ---
  if (event.templateId === 'secession-winter') {
    // N defectors stored on the event metadata by E-5 below.
    const N = (event as unknown as { secessionDefectionCount?: number }).secessionDefectionCount ?? 0;
    // Outcome banding per AC #35 — N + response + Crisis Gov president → band → multiplier.
    const band = secessionWinterBand(resp.id, N, president);
    mult *= band;
  }

  // President Delegator / Micromanager — LAST, multiplies cumulative.
  if (president?.traits.includes('Delegator'))    mult *= 1.5;
  if (president?.traits.includes('Micromanager')) mult *= 0.5;

  // Apply cumulative multiplier to every meter in the copy.
  if (mult !== 1.0) {
    for (const k of Object.keys(out.meters) as (keyof NationalMeters)[]) {
      const v = out.meters[k];
      if (v != null) out.meters[k] = v * mult;
    }
  }

  return out;
}

// PR6 Secession Winter band → multiplier per AC #35.
function secessionWinterBand(responseId: string, N: number, pres: Politician | undefined): number {
  const isCrisisGov = pres?.traits.includes('Crisis Gov') === true;
  const isPassive   = pres?.traits.includes('Passive')    === true;
  if (responseId === 'r1') {                                  // Reinforce
    if (N === 0 && isCrisisGov) return 0.3;                   // very good
    if (N === 0)                return 0.6;                   // good
    if (N <= 2)                 return 1.0;                   // partial
    return 1.5;                                               // bad
  }
  if (responseId === 'r2') {                                  // Diplomatic
    if (N === 0)                return isCrisisGov ? 0.6 : 1.0;
    if (N >= 2)                 return 1.5;                   // bad
    return 1.0;
  }
  // r3 (Acquiesce)
  if (N <= 1 && isPassive)     return 2.0;                    // very bad
  return 2.0;                                                 // any → very bad
}
```

The Trent Affair r1 multiplier compound (e.g. SecState Foreign Affairs
0.7 × SecState Crisis Gov 0.7 × Delegator 1.5 = 0.735 net on meters)
matches PM Assumption 6 — compounding accepted. Determinism: no RNG.

### Edit E-5: Secession Winter NEW event + `runSecessionWinterDefections` helper

**Site:** `src/data/eraEvents1856.ts` — new entry in `buildEraEventsForYear`
for `year >= 1860`, placed AFTER the existing "Southern Secession Threat"
block at lines 102-124. New helper `runSecessionWinterDefections` in
`phaseRunners.ts`.

**Event data:**

```ts
  if (year >= 1860) {
    out.push({
      id: uid('era'),
      templateId: 'secession-winter',                       // per Assumption 2
      year: 1860,
      title: 'Secession Winter',
      description: 'In the weeks after the November election, Southern cabinet officers are weighing whether to remain with the Union or join the new Confederacy. Charleston is arming. The cabinet table is splitting.',
      decider: 'president',
      responses: [
        {
          id: 'r1', label: 'Reinforce Federal Forts',
          description: 'Send relief to Sumter and Pickens. Treat secession as rebellion.',
          effect: { text: 'Federal forts reinforced; the country pivots to war footing.',
                    meters: { military: 2, domestic: -3, honest: 1 },
                    partyPreference: -0.5,
                    startWar: { name: 'American Civil War', against: 'Confederate States' } },
        },
        {
          id: 'r2', label: 'Hold the Line Diplomatically',
          description: 'Refuse to recognize secession, but do not provoke. Buy time for a peace conference.',
          effect: { text: 'A diplomatic standoff. The Union holds — for now.',
                    meters: { domestic: -2, military: -1 },
                    partyPreference: -0.5,
                    enthusiasm: [{ ideology: 'Liberal', party: 'RED', delta: 1 }] },
        },
        {
          id: 'r3', label: 'Acquiesce',
          description: 'Allow peaceful separation. The Republic will preserve itself.',
          effect: { text: 'The Confederate States of America forms unopposed.',
                    meters: { domestic: -3, military: -2, honest: -2 },
                    partyPreference: -1.0,
                    enthusiasm: [{ ideology: 'Traditionalist', party: 'BLUE', delta: 2 }],
                    interestGroups: [{ id: 'Planters', delta: 4 }, { id: 'Abolitionists', delta: -4 }] },
        },
      ],
    });
  }
```

Precondition note: the existing "Southern Secession Threat" event at
`eraEvents1856.ts:102-124` also fires on `year >= 1860`. Both will queue
the same turn unless gated. **Architect lock**: gate Secession Winter on
`year >= 1860 && snap.game.eraEventsCompleted.includes('southern-
secession-threat')` OR `year >= 1861`. The existing "Southern Secession
Threat" event has no `templateId` — add one (`'southern-secession-
threat'`) as part of this PR. Append-only edit to the existing event
data. (This is the single existing-event templateId addition; per spec
Assumption 2 — modulation pipeline requires templateId.)

**Helper code in `phaseRunners.ts`** (after `modulateEraEventEffect`):

```ts
// PR6 Secession Winter defection check. Runs BEFORE the modulation pass in
// resolveEraEvent. For each cabinet seat in {Treasury, War, Interior, State}:
//   1. Read occupant.
//   2. Apply LOYALTY_DECAY from (state region × ideology) tables.
//   3. If post-decay loyalty < LOYALTY_DEFECTION_THRESHOLD: defect.
//      - Set snap.game.cabinet[seat] = null
//      - Set occupant.currentOffice = null
//      - Grant 'Traitor' trait via tryGrantTrait
//      - Log line
// Stores N (defector count) on event metadata for the modulation pass.
function runSecessionWinterDefections(snap: FullGameSnapshot, event: EraEvent, _respId: string): void {
  const seats: OfficeType[] = ['SecretaryOfTreasury', 'SecretaryOfWar', 'SecretaryOfInterior', 'SecretaryOfState'];
  let defectionCount = 0;
  for (const seat of seats) {
    const occupantId = snap.game.cabinet[seat];
    if (!occupantId) continue;
    const sec = snap.politicians.find((p) => p.id === occupantId);
    if (!sec) continue;
    // Region lookup via STATES_1856 / 1772 states — read from snap.states.
    const stateRow = snap.states.find((s) => s.id === sec.state);
    const region = stateRow?.region ?? 'Northeast';
    const regionBase = (LOYALTY_REGION_BASE as Record<string, number>)[region] ?? 0;
    const ideoMult   = LOYALTY_IDEOLOGY_MULT[sec.ideology] ?? 0;
    const decay      = regionBase * ideoMult;
    // Clamp loyalty to [0, 1] on write.
    sec.loyalty = clamp(sec.loyalty - decay, LOYALTY_RANGE.min, LOYALTY_RANGE.max);
    if (sec.loyalty < LOYALTY_DEFECTION_THRESHOLD) {
      // Defection.
      snap.game.cabinet[seat] = null;
      sec.currentOffice = null;
      const { granted } = tryGrantTrait(sec, 'Traitor');
      defectionCount += 1;
      const traitorTag = granted ? ' (gains Traitor)' : '';
      addLog(snap, '2.4.3', 'event',
        `${sec.firstName} ${sec.lastName} (${sec.state.toUpperCase()}) resigns as ${seat} to join the Confederacy${traitorTag}.`,
        { politicianId: sec.id });
    }
  }
  (event as unknown as { secessionDefectionCount?: number }).secessionDefectionCount = defectionCount;
}
```

Import `tryGrantTrait` from `./traits` in `phaseRunners.ts` (verify
existing import — PR3 added it; if missing in this file, add).

### Edit E-6: Trent Affair NEW event

**Site:** `src/data/eraEvents1856.ts` — new entry for `year >= 1861`.
Insert after the Secession Winter entry from E-5.

```ts
  if (year >= 1861) {
    out.push({
      id: uid('era'),
      templateId: 'trent-affair',                            // Assumption 2
      year: 1861,
      title: 'Trent Affair',
      description: 'Captain Wilkes of USS San Jacinto has seized Confederate commissioners Mason and Slidell from the British mail packet Trent. London is incensed. Eight thousand British troops embark for Canada. The cabinet meets December 26 to draft a response.',
      decider: 'cabinet',
      responses: [
        {
          id: 'r1', label: 'Release with Face-Saving Framing',
          description: 'Seward drafts a note: Wilkes erred in failing to bring Trent into port for adjudication. No formal apology. Mason and Slidell released.',
          effect: { text: 'War averted. Northern public mood grudgingly accepts.',
                    meters: { domestic: -1 },
                    diplomacy: [{ nation: 'UK', delta: 1 }] },
        },
        {
          id: 'r2', label: 'Apologize and Release',
          description: 'Full apology to London. Mason and Slidell released.',
          effect: { text: 'War averted but Northern public outrage hardens.',
                    meters: { domestic: -3 },
                    diplomacy: [{ nation: 'UK', delta: 2 }] },
        },
        {
          id: 'r3', label: 'Refuse Release',
          description: 'Wilkes was right. Mason and Slidell stay in Boston harbor.',
          effect: { text: 'Britain declares war. The Union faces a two-front war.',
                    meters: { domestic: 1, military: -3, economic: -2 },
                    diplomacy: [{ nation: 'UK', delta: -5 }],
                    startWar: { name: 'Anglo-American War of 1862', against: 'United Kingdom' } },
        },
      ],
    });
  }
```

The r3 `startWar` reuses the existing `applyEffect` startWar mechanism
at `phaseRunners.ts:2953-2967` — pushes to `snap.wars[]` and
`snap.game.wars[]`. No new engine code needed.

**Log voice shift** (per AC #40 — the ONLY event with this mechanism):
the existing `addLog` call at `phaseRunners.ts:2738` builds
`${event.title}: ${resp.label}. ${resp.effect.text}` and the modulated
effect's `text` field is overridden when SecState has Foreign Affairs
+ response is r1. Implement inline in `modulateEraEventEffect` (E-4)
after the multiplier compounding for Trent Affair:

```ts
  // PR6 Trent Affair log voice shift (AC #40). When SecState has Foreign
  // Affairs expertise AND response is r1, override the effect text with
  // Seward's historical Dec 26 framing snippet.
  if (event.templateId === 'trent-affair' && resp.id === 'r1' && secState?.expertise.includes('Foreign Affairs')) {
    out.text = "Seward's note: Wilkes erred in failing to bring Trent into port for adjudication. War averted; Northern public mood grudgingly accepts.";
  }
```

### Edit E-7: Dred Scott event MODIFICATION (templateId only)

**Site:** `src/data/eraEvents1856.ts:30-52`. Existing event already has
`decider: 'cabinet'` and 3 responses. The modulation lives in E-4's
`modulateEraEventEffect` — the data file only needs a `templateId`
addition so the modulation can dispatch on it:

```ts
    out.push({
      id: uid('era'),
      templateId: 'dred-scott',         // PR6 — keys modulation
      year: 1857,
      title: 'Dred Scott Decision',
      // ... rest unchanged ...
    });
```

Per AC #27: response `effect.meters` / `partyPreference` / `enthusiasm`
/ `interestGroups` UNCHANGED — modulation happens at resolve-time.

### Edit E-8: John Brown event MODIFICATION (templateId only)

**Site:** `src/data/eraEvents1856.ts:78-100`. Same shape as E-7:

```ts
    out.push({
      id: uid('era'),
      templateId: 'john-brown',         // PR6 — keys modulation
      year: 1859,
      title: "John Brown's Raid on Harpers Ferry",
      // ... rest unchanged ...
    });
```

Decider stays `'president'` per Deviation C / AC #32.

### Edit E-9: Save migration in `repair()` for loyalty backfill

**Site:** `src/state/GameContext.tsx:91-220`. The existing PR5 cabinet
scrub at lines 193-218 already handles the PR5 OfficeType drops. PR6
inserts a `loyalty` backfill BEFORE the `return dirty ? { ...s } : s` at
line 219:

```ts
    // PR6: backfill `loyalty` field on politicians missing it. Default 1.0
    // (fully loyal). Engine code reads loyalty in Secession Winter only;
    // 1772 politicians get the default and never trigger the mechanic.
    // Single-pass + idempotent: a second repair() call finds all loyalty
    // values set and skips.
    let loyaltyBackfilled = false;
    for (const p of s.politicians as unknown as Array<Politician & { loyalty?: number }>) {
      if (typeof p.loyalty !== 'number') {
        p.loyalty = 1.0;
        loyaltyBackfilled = true;
      } else if (p.loyalty < 0 || p.loyalty > 1) {
        // Defensive clamp for any out-of-range writes from older builds.
        p.loyalty = Math.max(0, Math.min(1, p.loyalty));
        loyaltyBackfilled = true;
      }
    }
    if (loyaltyBackfilled) {
      dirty = true;
      // eslint-disable-next-line no-console
      console.log('[migration] PR6: backfilled politician.loyalty to 1.0 on missing entries.');
    }
```

The `as unknown as` cast is needed because TypeScript sees
`s.politicians: Politician[]` and `loyalty` is now non-optional —
existing saves will have `undefined` at runtime, but the type system
doesn't allow that read without the cast (mirrors PR5 cabinet-scrub
pattern at line 198's `as unknown as Record<string, …>`).

## UI changes

**None.** PR6 wires data and engine logic. The existing `EraEventModal`
renders the chosen response and its effect.text — the modulation
applies to `meters` at engine layer before `applyEffect`, so the modal
sees the same response options. The Trent Affair log voice shift
appears via the existing `addLog` call at `phaseRunners.ts:2738` (the
`effect.text` field is read directly into the log line).

The 10 new traits surface via:
- Existing roster / trait column on the Cabinet / Roster pages (reads
  `p.traits` directly — no change needed).
- Existing `addLog` for cabinet appointments (the expertise-specialist
  marker at `phaseRunners.ts:2126` doesn't need to change).
- The new Secession Winter defection log lines (E-5) and the John Brown
  / Dred Scott modulation log lines (architect leaves these to the
  default `addLog` from the modulated effect.text).

Per spec "Out of scope": no display-label rename. Code labels (Crisis
Admin / Crisis Gov / Delegator / Micromanager) stay per Carpetbagger /
Cosmopolitan precedent.

## Files to touch (exact, ordered)

**New files:** 0. **Modified files:** 6 source + 1 script + 3 generated
artifacts (after regen). **Total = 10 modified, 0 new.**

1. **`src/types.ts`** — `Trait` union expansion (`:62-107`, 10 additions);
   `POSITIVE_TRAITS` 7 additions + `NEGATIVE_TRAITS` 3 additions
   (`:109-158`); `oldAge.fadingPool` 3 additions (`:551`);
   `TRAIT_CONFLICTS` 10 additions (`:569-593`); NEW `SLAVE_STATES_1856`
   constant (after `:954`); NEW `LOYALTY_REGION_BASE`,
   `LOYALTY_IDEOLOGY_MULT`, `LOYALTY_DEFECTION_THRESHOLD`,
   `LOYALTY_RANGE` constants (after `SLAVE_STATES_1856`);
   `Politician.loyalty: number` field (after `:1040` `traits` line); NEW
   `GovernanceContext` type + `TRAIT_GOVERNANCE_BANDS` +
   `TraitGovernanceRule` + `TRAIT_GOVERNANCE_EFFECTS` table (29 rows;
   placed immediately after `TRAIT_ELECTION_EFFECTS` closing `];`).
2. **`src/engine/phaseRunners.ts`** — `runPhase_2_3_2_Military` rewrite
   per E-2 (lines 2186-2202); `resolveEraEvent` pre-modulation hook per
   E-3 (line 2735 area); NEW `modulateEraEventEffect` + `secession
   WinterBand` + `runSecessionWinterDefections` helpers per E-4 / E-5
   (placed after `resolveEraEvent`); `runPhase_2_5_1_Lingering` per-
   trait pass per E-1 (inserted after line 3032 `cabinetBonuses` loop);
   import updates at top of file (`TRAIT_GOVERNANCE_EFFECTS`,
   `SLAVE_STATES_1856`, `LOYALTY_REGION_BASE`, `LOYALTY_IDEOLOGY_MULT`,
   `LOYALTY_DEFECTION_THRESHOLD`, `LOYALTY_RANGE` from `'../types'`;
   `tryGrantTrait` from `'./traits'` if not already imported).
3. **`src/state/GameContext.tsx`** — `repair()` loyalty backfill block
   per E-9 (insert before line 219 `return` statement).
4. **`src/data/eraEvents1856.ts`** — Dred Scott templateId addition
   (`:30-52`, add `templateId: 'dred-scott'`); John Brown templateId
   addition (`:78-100`, add `templateId: 'john-brown'`); existing
   "Southern Secession Threat" templateId addition (`:102-124`, add
   `templateId: 'southern-secession-threat'`); NEW Secession Winter
   event (after `:124`); NEW Trent Affair event (after Secession Winter).
5. **`scripts/seedDataset.mjs`** — 20 marquee row trait edits + 2 NEW
   rows (Gallatin + Stanton + Thompson if absent) + Pierce + Buchanan
   special cases + extend tuple destructure for optional 10th `loyalty`
   column at `:236-249` (the `for (const [first, last, ...] of ROWS)`
   loop). Add 4 explicit loyalty values (Cobb 0.5, Floyd 0.5, Thompson
   0.5, Cass 0.9).
6. **`scripts/legislatorsToDataset.mjs`** — write the `loyalty` field
   through to the generated JSON / CSV / TS-fallback artifacts so
   `loadStandardDraftClasses` picks up the explicit values. Verify the
   tuple-shape generator passes the new field; default to 1.0 for
   non-curated entries.
7. **`public/standard-draft-classes.json`** — REGENERATED. Loyalty
   values per the curated rows (4 explicit, all others 1.0).
8. **`politicians-dataset.csv`** — REGENERATED.
9. **`src/data/defaultDraftClasses.ts`** — REGENERATED.
10. **`src/data/draftImport.ts`** — verify the field flows through
    `ImportedDraftee` to `Politician`. Spot the existing
    `Politician`-build site (search `loyalty:` and `traits:`) — the
    builder confirms the field passes through. If `ImportedDraftee`
    type carries `loyalty?: number`, add it; the importer reads and
    sets the politician's `loyalty` field.

**Not touched (guardrails):**
- `src/pv.ts` — no PV formula change. The 10 new traits flow through
  the existing `for (const t of p.traits)` loop in `pv.ts:74-87` via
  their `POSITIVE_TRAITS` / `NEGATIVE_TRAITS` membership (AC #2 / #50).
- `src/engine/electionEffects.ts` — `TRAIT_ELECTION_EFFECTS` unchanged;
  the 10 new traits are governance-facing, not election-facing (AC #51).
- `src/rng.ts` — no new RNG channel. Secession Winter defection uses
  the existing deterministic loyalty-decay math (no `chance()` per
  member; the d6 alternative per AC #34 PM rec is REJECTED by the
  loyalty-field model — the loyalty threshold IS the gate).
- `KINGMAKER_RULES` (`types.ts:275-287`) — untouched per F-MK-
  KINGMAKER-RULES-SEPARATE. Master Kingmaker is purely additive.
- `TRAIT_LIFECYCLE_RULES.conflictD6Threshold` — unchanged.
- Existing event responses' `effect.meters` / `partyPreference` /
  `enthusiasm` / `interestGroups` — UNCHANGED per AC #27. The
  modulation re-shapes magnitudes at resolve time.
- `EraEvent` shape — no schema additions (per Assumption 1). The
  Secession Winter defection count is stored via cast-on-write to a
  runtime-only field (`event.secessionDefectionCount`) that's not on
  the type definition; the modulation reads it via the same cast.
  *Architect note: if TypeScript strict + `noImplicitAny` flags the
  cast, the builder may add a one-line optional field to `EraEvent`
  at types.ts:1230-1243 — `secessionDefectionCount?: number` — as a
  defensive fallback. Spec does not require, but compile-time may.*

## Test / verification plan

### Build / typecheck

`npm run build` (`tsc -b && vite build`) and `npm run lint` (`tsc -b
--noEmit`) must both be green per AC #55. The `Trait` union 10 additions
cascade across consumer sites — every miss is a compile error:

- `POSITIVE_TRAITS` / `NEGATIVE_TRAITS` arrays must include the 10 new
  members (typed as `Trait[]`).
- `TRAIT_CONFLICTS` Partial<Record<Trait, Trait>> — quoted keys for
  hyphenated trait literals ('Decisive General', 'Naive Strategist',
  'Master Kingmaker', etc.).
- `TRAIT_GOVERNANCE_EFFECTS: TraitGovernanceRule[]` — every row's `trait`
  must be a valid `Trait` literal; every `context` must be a valid
  `GovernanceContext` literal; the optional `meter` must satisfy
  `keyof NationalMeters`.
- `oldAge.fadingPool: ['Celebrity', 'Charismatic', 'Hale', 'Crisis Admin',
  'Crisis Gov', 'Decisive General']` — every literal valid.
- `Politician.loyalty: number` — non-optional. Old saves with
  `undefined` get a TypeScript compile error if any consumer code reads
  `p.loyalty` without nullish coalescing — verify the only writes/reads
  go through the migration in `repair()` first (validated by the
  console log check below).
- `runSecessionWinterDefections` references — `tryGrantTrait` must be
  imported in `phaseRunners.ts`; verify via grep at edit time.
- `modulateEraEventEffect` — Trent Affair `out.text` override compiles
  because `EraEventResponseEffect.text` is non-optional `string`.

Tripwires to expect:
- The 5 new conflict pair keys (`'Decisive General'`, `'Naive Strategist'`,
  etc.) need quoted literals in `TRAIT_CONFLICTS` because of spaces.
- `'Master Kingmaker'` needs quotes for the same reason.
- The `seedDataset.mjs` Pierce row writes `['Passive', 'Overeager']` —
  the curated path bypasses `tryGrantTrait`, so no runtime conflict-
  check applies at seed time (per AC #46 / Pierce edge case).

### Smoke tests (recommended Node-script contract)

20 assertions:

**Trait union + classification (4 assertions):**
1. `assert(POSITIVE_TRAITS.includes('Crisis Admin' as Trait))`. Same
   for Crisis Gov, Decisive General, Domestic Warrior, Iron Fist,
   Delegator, Master Kingmaker.
2. `assert(NEGATIVE_TRAITS.includes('Naive Strategist' as Trait))`.
   Same for Micromanager, Overeager.
3. `assert(['Likable','Uncharismatic'].every((t) => allTraitsSet.has(t)))`
   — PR4b traits still present (no regression).
4. `assert(TRAIT_LIFECYCLE_RULES.oldAge.fadingPool.length === 6)` —
   Celebrity / Charismatic / Hale / Crisis Admin / Crisis Gov /
   Decisive General.

**Conflict pair symmetry (5 assertions):**
5-9. For each `(a, b)` in
`[['Decisive General','Naive Strategist'],['Delegator','Micromanager'],
['Domestic Warrior','Domestic Apathy'],['Master Kingmaker','Outsider'],
['Overeager','Passive']]`:
`assert(TRAIT_CONFLICTS[a] === b && TRAIT_CONFLICTS[b] === a)`.

**Loyalty math (3 assertions):**
10. `assert(LOYALTY_DEFECTION_THRESHOLD === 0.4)`.
11. Cobb math: GA → region 'South' → 0.5 base × Conservative 0.7 mult
    = 0.35 decay → starting 0.5 - 0.35 = 0.15 < 0.4. Expect defect.
12. Cass math: MI → region 'Midwest' → 0.0 base × Moderate 0.3 mult =
    0.0 decay → starting 0.9 - 0 = 0.9 > 0.4. Expect stay.

**TRAIT_GOVERNANCE_EFFECTS shape (3 assertions):**
13. `assert(TRAIT_GOVERNANCE_EFFECTS.filter((r) => r.trait === 'Iron Fist'
    && r.context === 'lingering_phase').length === 2)` — split-meter
    rows present.
14. `assert(TRAIT_GOVERNANCE_EFFECTS.some((r) => r.trait === 'Delegator'
    && r.multiplier === 1.5))`.
15. `assert(TRAIT_GOVERNANCE_EFFECTS.filter((r) => r.context ===
    'military_command').length === 4)` — Decisive General, Naive
    Strategist, Iron Fist, Micromanager only.

**Era event templateIds (3 assertions):**
16. `assert(buildEraEventsForYear(1857).find((e) => e.templateId ===
    'dred-scott'))`.
17. `assert(buildEraEventsForYear(1860).find((e) => e.templateId ===
    'secession-winter'))`.
18. `assert(buildEraEventsForYear(1861).find((e) => e.templateId ===
    'trent-affair'))`.

**Modulation smoke (2 assertions):**
19. Build a stub `snap` where President = Lincoln with [Crisis Gov,
    Delegator], cabinet has Chase (Treasury, Economics expertise);
    invoke `runPhase_2_5_1_Lingering`. Assert the `economic` meter
    received PR5 0.2 × 1.5 = 0.3 (Delegator multiplier compounded with
    PR5 expertise bonus).
20. Build a stub `snap` where President = Buchanan with [Passive, Naive
    Strategist], cabinet has Cobb (Treasury, loyalty 0.5, GA) + Floyd
    (War, loyalty 0.5, VA) + Thompson (Interior, loyalty 0.5, MS) +
    Cass (State, loyalty 0.9, MI). Invoke `resolveEraEvent` for the
    Secession Winter event with response r1. Assert: 3 cabinet seats
    are now null (Cobb, Floyd, Thompson defected; Cass stays); 3
    politicians' `currentOffice` is null; 3 politicians carry Traitor
    trait; the event's `secessionDefectionCount` is 3.

### Playtest (per CLAUDE.md, `npm run dev`)

> Determinism caveat: runs are not bit-reproducible per `rng.ts:5`
> (`Math.random`). Verify qualitatively via log lines.

**1856 scenario — the heart of PR6:**

1. Run the regen pipeline first (see CP2 Network note below). Open the
   1856 scenario as RED. Roster page: verify Lincoln shows `Crisis Gov`
   + `Delegator`; Buchanan shows `Passive` + `Naive Strategist` (NOT
   `Efficient`); Polk shows `Iron Fist` + `Micromanager` + `Overeager`;
   Calhoun shows `Domestic Warrior`; Clay shows `Master Kingmaker` +
   `Domestic Warrior`; Grant + Sherman show `Decisive General`;
   McClellan shows `Naive Strategist`; Floyd shows `Iron Fist` +
   `Naive Strategist` AND has loyalty 0.5 (verify via DevTools);
   Hamilton (drafted 1772) shows `Crisis Admin` + `Master Kingmaker`.
2. Continue to year 1857. Watch for Dred Scott event firing
   (`decider: 'cabinet'`). Pick an AG with Justice expertise (Black or
   Bates if seated). Select r2. In the event resolution log line,
   verify the meter swings are softened — `domestic` -1 reads as -0.5
   under the AG Justice multiplier (note: with a Crisis Gov president
   also seated, the `* 0.7` Crisis Gov multiplier compounds → -0.35;
   visually the meter log line shows the reduced delta).
3. Continue to year 1859. John Brown event fires (`decider:
   'president'`). With Floyd (Naive Strategist) as SecWar, pick r1
   (Execute). Verify the `military` meter is reduced by Floyd's 0.7
   multiplier and `domestic` is amplified by 1.3.
4. Continue to year 1860. Both "Southern Secession Threat" (existing)
   and Secession Winter (new) become eligible. The Threat must fire
   first (templateId gate prevents Secession Winter that turn).
   Resolve Threat. Continue. Secession Winter fires the next turn.
   With Buchanan cabinet (Cobb/Floyd/Thompson/Cass), pick r1
   (Reinforce). Verify the events feed:
   - "Howell Cobb (GA) resigns as SecretaryOfTreasury to join the
     Confederacy (gains Traitor)."
   - Same for Floyd + Thompson.
   - Cass stays (loyalty 0.9, MI Midwest → no decay).
   - "American Civil War begins against Confederate States." (the r1
     `startWar` fires through `applyEffect`.)
   - The resolved meter swings reflect band `bad` (N=3) → ×1.5 on r1:
     military +2 × 1.5 = +3, domestic -3 × 1.5 = -4.5.
5. Continue to year 1861. Trent Affair fires (`decider: 'cabinet'`).
   With Seward seated as SecState (Foreign Affairs expertise) + Lincoln
   Delegator-president, pick r1. Verify:
   - Log line uses the Seward voice shift: "Seward's note: Wilkes
     erred…"
   - `domestic` meter swings 0.7 × 1.5 = 1.05 × the -1 → -1.05 (the
     Foreign Affairs softener + Delegator multiplier).
   - `UK` diplomacy +1 fires through unchanged.

**1772 scenario** (verifies the union expansion doesn't crash and
1772-era traits attribute correctly):

6. Open 1772 scenario. Roster page: verify Washington shows
   `Decisive General` + `Delegator` (PR6 additions); Hamilton shows
   `Crisis Admin` + `Master Kingmaker`; Adams (John) shows
   `Micromanager` + `Crisis Gov`; St. Clair shows `Naive Strategist`;
   Burr shows `Master Kingmaker`.
7. Continue through to a Revolutionary War battle. Wartime command
   grant fires in 2.3.2 when GeneralInChief seated. Verify Washington
   (Decisive General) gets +2 Command on the wartime grant log line
   (not the PR2b +1) — log reads "Decisive General bonus".
8. Verify 1772 politicians' `loyalty` field reads 1.0 in DevTools (no
   Secession Winter event fires in 1772 — the mechanic is dormant).

**Save migration:**

9. Load a pre-PR6 save. Verify the migration log fires once in console:
   `[migration] PR6: backfilled politician.loyalty to 1.0 on missing
   entries.`. Re-load — verify it does NOT fire again (idempotency).
10. Verify all politicians have `loyalty: 1.0` in DevTools after the
    first repair() pass.

### CP2 Network restriction (per PR4b precedent)

The regen pipeline (`bash scripts/fetchLegislators.sh && node
scripts/legislatorsToDataset.mjs && npm run build`) requires outbound
access to `raw.githubusercontent.com`. If the build environment blocks:
- The `seedDataset.mjs` edits still encode the canonical PR6 state.
- The 4 marquee Secs' explicit loyalty values are present.
- `npm run build` passes without the regen (the bundled offline
  fallback `defaultDraftClasses.ts` won't yet have the new traits;
  in-app the player would see un-PR6'd politicians until the regen
  lands).
- Builder reports the failure in CP2 summary; human runs the regen on
  a network-permitted machine and commits the updated JSON / CSV / TS.

## Risks

Ordered, highest first.

1. **`loyalty` field cascade across consumer sites.** Adding a non-
   optional `Politician.loyalty: number` field is a schema-additive
   change but the type system flags every site that constructs a
   `Politician` literal without the field. `src/data/draftImport.ts`
   (the importer), `src/engine/phaseRunners.ts:1303+` (the draft pick),
   `src/data/scenario1856.ts` / `scenario1772.ts` (scenario seeds), and
   `src/data/politicians1856.ts` (the Buchanan-era pre-seeded figures)
   ALL need to write `loyalty: 1.0` (or an explicit value for the 4
   marquee Secs) on construction. **Mitigation:** the build cascade
   catches every miss at compile time; the architect's CP2 pass should
   `grep` for `Politician =` and `Politician {` to enumerate
   construction sites, and verify each receives a `loyalty` field.
2. **Modulation multiplier compound stack inflates meter swings beyond
   PR5's [-5, +5] clamp budget.** Worst-case stack: SecState Foreign
   Affairs 0.7 × SecState Crisis Gov 0.7 × Delegator 1.5 = 0.735 net
   on `r1`; Secession Winter band 2.0 × Delegator 1.5 = 3.0 on `r3`
   Acquiesce. The meter clamp absorbs at ±5, but a player carrying
   Buchanan + Cobb cabinet sees the full r3 ×3 swing on a -3 starting
   value → -9 → clamps to -5. The clamp protects but the qualitative
   feel may read "every Secession Winter outcome is catastrophic."
   **Mitigation:** the `TRAIT_GOVERNANCE_BANDS` constants AND the
   `secessionWinterBand` table are CP2 tuning dials. If playtest reads
   "always max-bad," architect lowers `SMALL=2 → 1` and `very bad
   ×2.0 → ×1.5`. The structure stays; the numerics tune.
3. **PR6 grants `Traitor` trait via `tryGrantTrait` which is a
   conflict-aware path.** `Traitor` has no conflict pair in
   `TRAIT_CONFLICTS` (verified at `types.ts:569-593`), so the grant
   succeeds. But the grant log emits `{ granted: true, replaced: null
   }` — the existing Secession Winter log line reads the `granted`
   field for the "(gains Traitor)" parenthetical. **Mitigation:**
   verified at E-5; no risk if `tryGrantTrait` semantics stay PR3.
4. **The Pierce within-pair Overeager + Passive stack causes runtime
   surprise.** Pierce can carry both even though the conflict map
   prevents NEW grants. If a future code path calls
   `tryGrantTrait(pierce, 'Overeager')`, the existing Overeager is
   detected and the grant is dedupe-skipped (per PR3 semantics: `if
   (p.traits.includes(t)) return { granted: false, replaced: null }`).
   No runtime issue. **Mitigation:** the curated-path comment in
   `seedDataset.mjs` flags the stack; CP2 builder can prune Overeager
   if `npm run build` typechecks fail (it shouldn't — `Trait[]` carries
   no exclusion constraint).
5. **Secession Winter outcome `r3` `very bad ×2.0` × Delegator `×1.5`
   = `×3.0` on Buchanan's acquiesce path.** A Delegator-Buchanan is
   counter-historical (Buchanan was Passive, not Delegator) — but the
   modulation engine doesn't know that. The runtime compound could
   read "Buchanan acquiesces and meters tank by 3×" on a hypothetical
   Delegator-Buchanan save. **Mitigation:** the spec / PM accepts this
   as the player-construction surface (player can install a player-
   drafted Buchanan as Delegator). Future PR can era-condition the
   trait stack. Not blocking.
6. **The 1856 "Southern Secession Threat" event NEEDS a templateId
   added** to prevent both that event AND Secession Winter from firing
   the same turn. The architect's lock at E-5 / E-6 says add the
   templateId `'southern-secession-threat'` to the existing event. This
   is a single-line edit but it's a SAVE format change: the
   `eraEventsCompleted` array tracks templateIds, so an old save where
   the Threat event already fired won't have the templateId tracked,
   and Secession Winter will gate on its absence — firing Secession
   Winter even though Threat already resolved. **Mitigation:**
   acceptable per spec § Edge cases ("a re-loaded save … defections
   re-fire — PM accepts").
7. **Pre-modulation pass on the existing Dred Scott / John Brown
   events introduces behavioral surface changes.** Pre-PR6, a player
   resolving Dred Scott r2 saw the flat `domestic: -1`. Post-PR6, the
   same r2 with an AG-Justice + Crisis Gov president reads
   `domestic: -0.5 × 0.7 = -0.35`. This is the intended PR6 behavior
   but a player loading a save mid-Dred-Scott-resolution sees
   different numbers than they would have pre-PR6. **Mitigation:**
   per spec AC #53 — old saves load cleanly; the Dred Scott event
   doesn't re-fire (template tracking) so existing players don't
   experience the behavior shift on continued play.

## Definition of done

- `npm run build` passes (`tsc -b && vite build`) and `npm run lint`
  (`tsc -b --noEmit`) is clean.
- `Trait` union has 55 members (45 + 10).
- `POSITIVE_TRAITS` has 7 additions; `NEGATIVE_TRAITS` has 3 additions.
- `TRAIT_CONFLICTS` has 5 new pairs (10 new entries).
- `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool` has 6 entries (was 3).
- `TRAIT_GOVERNANCE_BANDS` + `GovernanceContext` + `TraitGovernance
  Rule` + `TRAIT_GOVERNANCE_EFFECTS` (29 rows) present in `types.ts`.
- `SLAVE_STATES_1856` (15 ids) + `LOYALTY_REGION_BASE` +
  `LOYALTY_IDEOLOGY_MULT` + `LOYALTY_DEFECTION_THRESHOLD = 0.4` +
  `LOYALTY_RANGE` constants present in `types.ts`.
- `Politician.loyalty: number` field (non-optional) present in
  `types.ts`.
- `runPhase_2_5_1_Lingering` trait modulation block per E-1.
- `runPhase_2_3_2_Military` Decisive General / Naive Strategist hook
  per E-2.
- `resolveEraEvent` pre-modulation pass per E-3.
- `modulateEraEventEffect` + `runSecessionWinterDefections` +
  `secessionWinterBand` helpers per E-4 / E-5.
- Secession Winter event in `eraEvents1856.ts` (`year >= 1860`,
  templateId `'secession-winter'`).
- Trent Affair event in `eraEvents1856.ts` (`year >= 1861`, templateId
  `'trent-affair'`).
- Dred Scott templateId added (`'dred-scott'`); John Brown templateId
  added (`'john-brown'`); existing "Southern Secession Threat"
  templateId added (`'southern-secession-threat'`).
- `repair()` loyalty backfill per E-9; idempotency verified.
- `scripts/seedDataset.mjs` 20-row attribution table edits + Pierce
  special case + Buchanan correction + 2 new NEW rows (Gallatin,
  Stanton) + 1 new NEW row (Thompson) + 4 explicit loyalty values
  (Cobb 0.5, Floyd 0.5, Thompson 0.5, Cass 0.9).
- Regen pipeline executed (or builder reports network blocker per CP2
  fallback).
- 20 smoke tests pass.
- Playtest: 1856 scenario shows the 4 events firing with modulation
  log lines; Buchanan cabinet defects 3 Secs (Cobb/Floyd/Thompson) on
  Secession Winter; Cass stays; Lincoln-Seward Trent Affair shows
  Seward voice shift. 1772 scenario shows Washington Decisive General
  Command +2 in wartime; 10 new traits attribute on the founding
  generation per CURATED_ROWS.

---

**Checkpoint summary (for approval):**

- **Approach.** Types + engine + events + dataset. Trait union 45 →
  55. Add `Politician.loyalty: number` non-optional with default 1.0
  (USER REVISION override). Add `TRAIT_GOVERNANCE_EFFECTS` (29 rows,
  4 contexts, ±SMALL/MEDIUM/LARGE bands + Delegator/Micromanager
  multipliers). Add `LOYALTY_REGION_BASE × LOYALTY_IDEOLOGY_MULT`
  decay table with `LOYALTY_DEFECTION_THRESHOLD = 0.4`. Modulation
  pipeline: pre-`applyEffect` hook in `resolveEraEvent` calls a new
  `modulateEraEventEffect` pure helper that reads cabinet expertise +
  traits + Delegator/Micromanager multiplier on a deep-cloned `meters`
  copy. Secession Winter pre-resolution defection check applies
  decay, defects sub-threshold cabinet members (Cobb/Floyd/Thompson),
  grants Traitor trait. Trent Affair log voice shift on Foreign-
  Affairs SecState + r1. Lingering phase trait pass after PR5
  cabinetBonuses loop. Military command Decisive General / Naive
  Strategist hook on the wartime grant. Dred Scott + John Brown
  modifications are templateId additions only — modulation lives in
  the helper.
- **File-count delta.** 6 source + 1 script + 3 generated = 10
  modified, 0 new. (`src/types.ts`, `src/engine/phaseRunners.ts`,
  `src/state/GameContext.tsx`, `src/data/eraEvents1856.ts`,
  `scripts/seedDataset.mjs`, `scripts/legislatorsToDataset.mjs`,
  `public/standard-draft-classes.json`, `politicians-dataset.csv`,
  `src/data/defaultDraftClasses.ts`, `src/data/draftImport.ts`.)
- **Tuning resolutions to the 14 task-brief calls.**
  (1) `loyalty: number` non-optional, default 1.0, clamp on writes
  via engine helper to [0,1]. (2) `LOYALTY_REGION_BASE × LOYALTY_
  IDEOLOGY_MULT` per the locked tables; Cobb 0.5×0.7=0.35 decay
  hits 0.15 < 0.4 → defect; Cass 0.0×0.3=0 decay → 0.9 stays. (3)
  `LOYALTY_DEFECTION_THRESHOLD = 0.4`. (4) Pierce within-pair: ship
  both (Option a). (5) `TRAIT_GOVERNANCE_EFFECTS` 29 rows; Iron
  Fist split via `meter?: keyof NationalMeters`; Delegator /
  Micromanager via `multiplier?: number` (additive `magnitude` 0).
  (6) Lingering phase multiplier at line 3032; event resolution
  multiplier in `modulateEraEventEffect`; meters only (PM rec). (7)
  Pre-modulation pass at line 2735 via `modulateEraEventEffect`
  helper. (8) Secession Winter: year ≥ 1860, decider 'president', 3
  responses (r1 Reinforce, r2 Hold-Diplomatically, r3 Acquiesce);
  startWar fires on r1 unconditionally and on r2/r3 only at N ≥ 2
  defectors. (9) Trent Affair: year ≥ 1861, decider 'cabinet', 3
  responses; r3 startWar Anglo-American War of 1862. (10) Dred Scott
  modulation: AG Justice softens domestic + honest by ×0.5; Iron
  Fist Pres on r1 ×1.3; Crisis Gov Pres on r2/r3 softens domestic
  ×0.7. (11) John Brown modulation: SecWar Military ×0.8 all
  meters; Decisive General SecWar military ×1.2; Naive Strategist
  SecWar military ×0.7 + domestic ×1.3; pro-slavery SecWar on r3
  ×1.3; antislavery on r1 domestic ×1.3. (12) 20 marquee CURATED_
  ROWS edits per the locked table; explicit loyalty on Cobb / Floyd
  / Thompson (0.5) + Cass (0.9). (13) `repair()` loyalty backfill
  per E-9. (14) `oldAge.fadingPool` extends to 6 traits; existing
  `runPhase_2_4_1_Deaths` at lines 2327-2345 iterates the pool —
  no code change needed.
- **Top balance risk.** Modulation multiplier compound stack inflates
  Secession Winter `r3 × very bad × Delegator` to `×3.0` on a -3
  base meter → -9 clamped to -5. Meter clamp absorbs, but the
  qualitative read may be "always max-bad." Tune `TRAIT_GOVERNANCE_
  BANDS.SMALL` and `secessionWinterBand` numerics at CP2 if playtest
  reveals.
- **Beyond the spec.** (a) `SLAVE_STATES_1856` lives inline in
  `types.ts` (not a new `historicalStateRegions.ts` file — CP2 dial
  Q15 PM rec overridden for minimal-import surface). (b) `LOYALTY_
  REGION_BASE` uses 3 buckets keyed by `State.region` literals
  (`South`/`Border`/`Northeast`/`Midwest`/`West`) — not 15 per-state
  cells. (c) `EraEvent.secessionDefectionCount` stored via runtime
  cast on the event object; if `tsc strict` flags, builder adds a
  `secessionDefectionCount?: number` field to the `EraEvent` interface
  at types.ts:1230-1243. (d) Existing "Southern Secession Threat"
  gets a `templateId: 'southern-secession-threat'` added so the new
  Secession Winter can gate on its completion. (e) `scripts/seed
  Dataset.mjs` row tuple extended with optional 10th `loyalty` column;
  `legislatorsToDataset.mjs` carries the field to generated artifacts.
  (f) The pre-modulation helper passes `partyPreference`, `enthusiasm`,
  `interestGroups`, `diplomacy`, `startWar`, `text` through unchanged;
  multiplier scope is `meters` only.
- **Pierce stack choice:** **(a) allow both** — curated path special
  case; inline comment in `seedDataset.mjs` flags the exception.
- **LOYALTY_DECAY example math.** Cobb (GA Conservative, start 0.5):
  region South = 0.5, ideology Conservative = 0.7, decay = 0.5 ×
  0.7 = 0.35. Post-event: 0.5 - 0.35 = 0.15 < 0.4 → defects. Cass
  (MI Moderate, start 0.9): region Midwest = 0.0, ideology Moderate
  = 0.3, decay = 0.0 × 0.3 = 0.0. Post-event: 0.9 - 0.0 = 0.9 >
  0.4 → stays.

---

**Brief file:** `/home/user/AMPU/docs/briefs/trait-pass-b-governance.md`
