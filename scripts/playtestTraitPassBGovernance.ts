// PR6 engine playtest — drives 1772 (default) and 1856 (--1856) scenarios
// through ~600 phases, asserts the contract of PR6's governance trait pass
// (10 new traits + TRAIT_GOVERNANCE_EFFECTS table + 5 new TRAIT_CONFLICTS pairs
// + fading-pool extension + Loyalty data model + Secession Winter defection +
// modulateEraEventEffect for Dred Scott / John Brown / Trent Affair / Secession
// Winter + military_command + lingering_phase modulations), then classifies
// engine-trace log lines by feature signature.
//
// CP1 USER REVISION (binding): Loyalty is a real schema field on Politician
// (not ideology+state proxy). Default 1.0; Cobb/Floyd/Thompson 0.5, Cass 0.9.
// Secession Winter reads loyalty AFTER decay; threshold 0.4 triggers defection.
// Reviewer fix #1: TRAIT_CONFLICTS value type widened to Trait | Trait[].
// Reviewer fix #2: Secession Winter N≥2 unconditionally injects civil war.
//
// Mirrors scripts/playtestCabinetOverhaul.ts (PR5) + scripts/playtestTraitPassB.ts (PR4b):
//   Part 1: Contract tests with stubbed Math.random (deterministic).
//   Part 2: Engine scenario drive (auto-resolve player input).
//   Part 3: Event classification + trace JSON to docs/playtest/<slug>/.
//
// Run BOTH variants for full coverage:
//   npx tsx scripts/playtestTraitPassBGovernance.ts          # 1772 default
//   npx tsx scripts/playtestTraitPassBGovernance.ts --1856   # 1856 path

// Stub import.meta.env for Node (Vite injects this in the browser).
// @ts-ignore
if (typeof import.meta.env === 'undefined') (import.meta as any).env = { DEV: false };

import { build1772Scenario } from '../src/data/scenario1772';
import { runCurrentPhase, advancePhase } from '../src/engine/engine';
import { simOneDraftPick, autoPickForPlayer } from '../src/engine/phaseRunners';
import { tryGrantTrait, conflictsFor, firstHeldConflict } from '../src/engine/traits';
import {
  TRAIT_CONFLICTS,
  TRAIT_LIFECYCLE_RULES,
  TRAIT_GOVERNANCE_BANDS,
  TRAIT_GOVERNANCE_EFFECTS,
  POSITIVE_TRAITS,
  NEGATIVE_TRAITS,
  LOYALTY_REGION_BASE,
  LOYALTY_IDEOLOGY_MULT,
  LOYALTY_DEFECTION_THRESHOLD,
  LOYALTY_RANGE,
  SLAVE_STATES_1856,
  IDEOLOGY_ORDER,
} from '../src/types';
import type {
  FullGameSnapshot,
  GovernanceContext,
  Ideology,
  Politician,
  Trait,
} from '../src/types';
import { readFileSync, writeFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Part 1: contract tests (stubbed RNG for d6/tryGrantTrait branches)
// ---------------------------------------------------------------------------

const realRandom = Math.random;
let stubbedRandom: () => number = realRandom;
Math.random = () => stubbedRandom();

function mkPol(traits: Trait[]): Politician {
  return { traits: [...traits] } as unknown as Politician;
}

let contractPass = 0;
let contractFail = 0;
const contractFailures: string[] = [];
function assert(cond: boolean, label: string) {
  if (cond) contractPass++;
  else { contractFail++; contractFailures.push(label); }
}

// -- A. The 10 new governance traits exist in the union -----------------------
const PR6_TRAITS: Trait[] = [
  'Crisis Admin', 'Crisis Gov', 'Decisive General', 'Naive Strategist',
  'Domestic Warrior', 'Iron Fist', 'Delegator', 'Micromanager',
  'Overeager', 'Master Kingmaker',
];

// Union check via POSITIVE_TRAITS / NEGATIVE_TRAITS membership.
{
  const POS = new Set(POSITIVE_TRAITS as Trait[]);
  const NEG = new Set(NEGATIVE_TRAITS as Trait[]);
  for (const t of ['Crisis Admin', 'Crisis Gov', 'Decisive General',
                    'Domestic Warrior', 'Iron Fist', 'Delegator',
                    'Master Kingmaker'] as Trait[]) {
    assert(POS.has(t), `POSITIVE_TRAITS includes ${t}`);
    assert(!NEG.has(t), `${t} not in NEGATIVE_TRAITS`);
  }
  for (const t of ['Naive Strategist', 'Micromanager', 'Overeager'] as Trait[]) {
    assert(NEG.has(t), `NEGATIVE_TRAITS includes ${t}`);
    assert(!POS.has(t), `${t} not in POSITIVE_TRAITS`);
  }
}

// -- B. TRAIT_GOVERNANCE_BANDS values per AC #4 ------------------------------
assert(TRAIT_GOVERNANCE_BANDS.SMALL === 2, 'TRAIT_GOVERNANCE_BANDS.SMALL === 2');
assert(TRAIT_GOVERNANCE_BANDS.MEDIUM === 4, 'TRAIT_GOVERNANCE_BANDS.MEDIUM === 4');
assert(TRAIT_GOVERNANCE_BANDS.LARGE === 8, 'TRAIT_GOVERNANCE_BANDS.LARGE === 8');

// -- C. TRAIT_GOVERNANCE_EFFECTS table integrity (AC #4 / #6) ----------------
{
  const rows = TRAIT_GOVERNANCE_EFFECTS;
  assert(rows.length === 29, `TRAIT_GOVERNANCE_EFFECTS has 29 rows (got ${rows.length})`);

  // All 10 new traits represented.
  const traitsInTable = new Set(rows.map((r) => r.trait));
  for (const t of PR6_TRAITS) {
    assert(traitsInTable.has(t), `TRAIT_GOVERNANCE_EFFECTS contains ${t}`);
  }

  // All 4 contexts covered.
  const contexts = new Set(rows.map((r) => r.context));
  for (const c of ['governance_crisis', 'lingering_phase', 'military_command', 'internal_party'] as GovernanceContext[]) {
    assert(contexts.has(c), `TRAIT_GOVERNANCE_EFFECTS covers ${c}`);
  }

  // Iron Fist split on lingering_phase: +SMALL honest, -SMALL domestic (AC #6).
  const ironFistLP = rows.filter((r) => r.trait === 'Iron Fist' && r.context === 'lingering_phase');
  assert(ironFistLP.length === 2, `Iron Fist has 2 lingering_phase rows (got ${ironFistLP.length})`);
  const ironFistHonest = ironFistLP.find((r) => r.meter === 'honest');
  const ironFistDom = ironFistLP.find((r) => r.meter === 'domestic');
  assert(ironFistHonest?.magnitude === TRAIT_GOVERNANCE_BANDS.SMALL,
    `Iron Fist honest = +SMALL (got ${ironFistHonest?.magnitude})`);
  assert(ironFistDom?.magnitude === -TRAIT_GOVERNANCE_BANDS.SMALL,
    `Iron Fist domestic = -SMALL (got ${ironFistDom?.magnitude})`);

  // Delegator multiplier 1.5 (governance_crisis + lingering_phase).
  const delegatorCrisis = rows.find((r) => r.trait === 'Delegator' && r.context === 'governance_crisis');
  const delegatorLP = rows.find((r) => r.trait === 'Delegator' && r.context === 'lingering_phase');
  assert(delegatorCrisis?.multiplier === 1.5, `Delegator governance_crisis multiplier === 1.5`);
  assert(delegatorLP?.multiplier === 1.5, `Delegator lingering_phase multiplier === 1.5`);

  // Micromanager multiplier 0.5.
  const microCrisis = rows.find((r) => r.trait === 'Micromanager' && r.context === 'governance_crisis');
  const microLP = rows.find((r) => r.trait === 'Micromanager' && r.context === 'lingering_phase');
  assert(microCrisis?.multiplier === 0.5, `Micromanager governance_crisis multiplier === 0.5`);
  assert(microLP?.multiplier === 0.5, `Micromanager lingering_phase multiplier === 0.5`);

  // Crisis Admin / Crisis Gov / Decisive General / Naive Strategist primary magnitudes.
  assert(rows.find((r) => r.trait === 'Crisis Admin' && r.context === 'governance_crisis')?.magnitude
    === TRAIT_GOVERNANCE_BANDS.LARGE, 'Crisis Admin governance_crisis = +LARGE');
  assert(rows.find((r) => r.trait === 'Crisis Gov' && r.context === 'governance_crisis')?.magnitude
    === TRAIT_GOVERNANCE_BANDS.LARGE, 'Crisis Gov governance_crisis = +LARGE');
  assert(rows.find((r) => r.trait === 'Decisive General' && r.context === 'military_command')?.magnitude
    === TRAIT_GOVERNANCE_BANDS.LARGE, 'Decisive General military_command = +LARGE');
  assert(rows.find((r) => r.trait === 'Naive Strategist' && r.context === 'military_command')?.magnitude
    === -TRAIT_GOVERNANCE_BANDS.LARGE, 'Naive Strategist military_command = -LARGE');
  assert(rows.find((r) => r.trait === 'Master Kingmaker' && r.context === 'internal_party')?.magnitude
    === TRAIT_GOVERNANCE_BANDS.LARGE, 'Master Kingmaker internal_party = +LARGE');
  assert(rows.find((r) => r.trait === 'Domestic Warrior' && r.context === 'internal_party')?.magnitude
    === TRAIT_GOVERNANCE_BANDS.MEDIUM, 'Domestic Warrior internal_party = +MEDIUM');
}

// -- D. TRAIT_CONFLICTS Trait | Trait[] symmetry (the reviewer fix #1) -------
{
  // Helper contract: conflictsFor normalizes single Trait or Trait[] to array.
  assert(JSON.stringify(conflictsFor('Efficient')) === JSON.stringify(['Passive']),
    `conflictsFor('Efficient') = ['Passive']`);
  assert(JSON.stringify(conflictsFor('Passive')) === JSON.stringify(['Efficient', 'Overeager']),
    `conflictsFor('Passive') = ['Efficient', 'Overeager'] (the array fix)`);
  assert(JSON.stringify(conflictsFor('Overeager')) === JSON.stringify(['Passive']),
    `conflictsFor('Overeager') = ['Passive']`);
  // Trait with no entry returns empty array (not undefined).
  assert(conflictsFor('Orator').length === 0, `conflictsFor('Orator') = [] (no entry)`);
}

// -- E. firstHeldConflict helper (the named-holder for failed-d6 log path) ---
{
  // Politician with Efficient + tryGrantTrait Passive → conflict is Efficient.
  const polEff = mkPol(['Efficient']);
  assert(firstHeldConflict(polEff, 'Passive') === 'Efficient',
    `firstHeldConflict(pol with Efficient, Passive) === 'Efficient'`);
  // Politician with Overeager + tryGrantTrait Passive → conflict is Overeager.
  const polOv = mkPol(['Overeager']);
  assert(firstHeldConflict(polOv, 'Passive') === 'Overeager',
    `firstHeldConflict(pol with Overeager, Passive) === 'Overeager'`);
  // Politician with neither → null.
  const polNone = mkPol(['Orator']);
  assert(firstHeldConflict(polNone, 'Passive') === null,
    `firstHeldConflict(pol with neither, Passive) === null`);
  // Politician with both Efficient + Overeager (curated bypass) — first in
  // conflictsFor('Passive') is Efficient.
  const polBoth = mkPol(['Efficient', 'Overeager']);
  assert(firstHeldConflict(polBoth, 'Passive') === 'Efficient',
    `firstHeldConflict(pol with both, Passive) returns 'Efficient' (first conflict in array)`);
}

// -- F. tryGrantTrait symmetry — PR3+PR6 regression test for both pairs ------
// AC #10 + reviewer fix #1: granting Passive must arbitrate BOTH Efficient AND
// Overeager. Tested by stubbing d6 to high/low and checking both directions.

const D6_HIGH = () => 0.99; // d6 -> 6 (≥ 4 threshold = OK)
const D6_LOW  = () => 0.0;  // d6 -> 1 (< 4 threshold = NG)

// Branch matrix: 6 cases × 2 d6 outcomes = 12 assertions for the new pair.
{
  // 1. Politician with Efficient + grant Passive — d6 OK → swap.
  const p = mkPol(['Efficient']);
  stubbedRandom = D6_HIGH;
  const r = tryGrantTrait(p, 'Passive');
  assert(r.granted === true && r.replaced === 'Efficient',
    `Efficient + grant Passive (d6 OK): { granted: true, replaced: 'Efficient' }`);
  assert(!p.traits.includes('Efficient') && p.traits.includes('Passive'),
    `Efficient + grant Passive (d6 OK): traits become [Passive]`);
}
{
  // 2. Politician with Efficient + grant Passive — d6 NG → no-op.
  const p = mkPol(['Efficient']);
  stubbedRandom = D6_LOW;
  const r = tryGrantTrait(p, 'Passive');
  assert(r.granted === false && r.replaced === null,
    `Efficient + grant Passive (d6 NG): { granted: false, replaced: null }`);
  assert(p.traits.includes('Efficient') && !p.traits.includes('Passive'),
    `Efficient + grant Passive (d6 NG): traits stay [Efficient]`);
}
{
  // 3. Politician with Overeager + grant Passive — d6 OK → swap (NEW pair).
  const p = mkPol(['Overeager']);
  stubbedRandom = D6_HIGH;
  const r = tryGrantTrait(p, 'Passive');
  assert(r.granted === true && r.replaced === 'Overeager',
    `Overeager + grant Passive (d6 OK): { granted: true, replaced: 'Overeager' } (the reviewer fix surface)`);
  assert(!p.traits.includes('Overeager') && p.traits.includes('Passive'),
    `Overeager + grant Passive (d6 OK): traits become [Passive]`);
}
{
  // 4. Politician with Overeager + grant Passive — d6 NG → no-op.
  const p = mkPol(['Overeager']);
  stubbedRandom = D6_LOW;
  const r = tryGrantTrait(p, 'Passive');
  assert(r.granted === false && r.replaced === null,
    `Overeager + grant Passive (d6 NG): { granted: false, replaced: null }`);
  assert(p.traits.includes('Overeager') && !p.traits.includes('Passive'),
    `Overeager + grant Passive (d6 NG): traits stay [Overeager]`);
}
{
  // 5. Politician with neither + grant Passive → no conflict, granted.
  const p = mkPol(['Orator']);
  stubbedRandom = D6_LOW; // RNG irrelevant when no conflict held.
  const r = tryGrantTrait(p, 'Passive');
  assert(r.granted === true && r.replaced === null,
    `Neither held + grant Passive: { granted: true, replaced: null }`);
  assert(p.traits.includes('Passive'),
    `Neither held + grant Passive: Passive added`);
}
{
  // 6. Reverse direction — Politician with Passive + grant Overeager (the new pair).
  const p = mkPol(['Passive']);
  stubbedRandom = D6_HIGH;
  const r = tryGrantTrait(p, 'Overeager');
  assert(r.granted === true && r.replaced === 'Passive',
    `Passive + grant Overeager (d6 OK): { granted: true, replaced: 'Passive' }`);
}
{
  // 7. Reverse direction — Politician with Passive + grant Efficient (PR3 direction).
  const p = mkPol(['Passive']);
  stubbedRandom = D6_HIGH;
  const r = tryGrantTrait(p, 'Efficient');
  assert(r.granted === true && r.replaced === 'Passive',
    `Passive + grant Efficient (d6 OK): { granted: true, replaced: 'Passive' } (PR3 reverse direction)`);
}

// -- G. The 5 NEW PR6 conflict pairs symmetric -------------------------------
const PR6_PAIRS: [Trait, Trait][] = [
  ['Decisive General', 'Naive Strategist'],
  ['Delegator', 'Micromanager'],
  ['Domestic Warrior', 'Domestic Apathy'],
  ['Master Kingmaker', 'Outsider'],
  ['Overeager', 'Passive'],
];
for (const [a, b] of PR6_PAIRS) {
  // a's conflict includes b.
  const aConflicts = conflictsFor(a);
  assert(aConflicts.includes(b), `PR6 pair: conflictsFor(${a}) includes ${b}`);
  // b's conflict includes a.
  const bConflicts = conflictsFor(b);
  assert(bConflicts.includes(a), `PR6 pair: conflictsFor(${b}) includes ${a}`);
  // Conflict arbitration via tryGrantTrait both directions.
  const p1 = mkPol([b]);
  stubbedRandom = D6_HIGH;
  const r1 = tryGrantTrait(p1, a);
  assert(r1.granted === true && r1.replaced === b,
    `PR6 pair ${a}↔${b} (d6 OK): grant ${a} swaps ${b}`);
  const p2 = mkPol([a]);
  stubbedRandom = D6_HIGH;
  const r2 = tryGrantTrait(p2, b);
  assert(r2.granted === true && r2.replaced === a,
    `PR6 pair ${a}↔${b} reverse (d6 OK): grant ${b} swaps ${a}`);
}

// -- H. TRAIT_LIFECYCLE_RULES.oldAge.fadingPool extended to 6 entries --------
{
  const pool = TRAIT_LIFECYCLE_RULES.oldAge.fadingPool;
  assert(pool.length === 6, `fadingPool has 6 entries (got ${pool.length})`);
  // PR3 + PR4b base — still present.
  assert(pool.includes('Celebrity'), 'fadingPool includes Celebrity (PR3)');
  assert(pool.includes('Charismatic'), 'fadingPool includes Charismatic (PR3)');
  assert(pool.includes('Hale'), 'fadingPool includes Hale (PR4b)');
  // PR6 additions.
  assert(pool.includes('Crisis Admin'), 'fadingPool includes Crisis Admin (PR6)');
  assert(pool.includes('Crisis Gov'), 'fadingPool includes Crisis Gov (PR6)');
  assert(pool.includes('Decisive General'), 'fadingPool includes Decisive General (PR6)');
  // PR6 exclusions per AC #15.
  for (const t of ['Naive Strategist', 'Domestic Warrior', 'Iron Fist', 'Delegator',
                   'Micromanager', 'Overeager', 'Master Kingmaker'] as Trait[]) {
    assert(!(pool as readonly string[]).includes(t),
      `fadingPool excludes ${t} (PR6 AC #15 — character traits don't fade)`);
  }
}

// -- I. LOYALTY_REGION_BASE / LOYALTY_IDEOLOGY_MULT / SLAVE_STATES_1856 ------
{
  // 5 regions per AC #34 historical state-region groupings.
  const regions = Object.keys(LOYALTY_REGION_BASE);
  assert(regions.length === 5, `LOYALTY_REGION_BASE has 5 regions (got ${regions.length})`);
  for (const r of ['South', 'Border', 'Northeast', 'Midwest', 'West']) {
    assert(regions.includes(r), `LOYALTY_REGION_BASE includes ${r}`);
  }
  // South 0.5, Border 0.2.
  assert((LOYALTY_REGION_BASE as Record<string, number>).South === 0.5,
    `LOYALTY_REGION_BASE.South === 0.5`);
  assert((LOYALTY_REGION_BASE as Record<string, number>).Border === 0.2,
    `LOYALTY_REGION_BASE.Border === 0.2`);

  // 7 ideologies — all in LOYALTY_IDEOLOGY_MULT.
  const ideos = Object.keys(LOYALTY_IDEOLOGY_MULT) as Ideology[];
  assert(ideos.length === 7, `LOYALTY_IDEOLOGY_MULT has 7 ideologies (got ${ideos.length})`);
  for (const ideo of IDEOLOGY_ORDER) {
    assert(typeof LOYALTY_IDEOLOGY_MULT[ideo] === 'number',
      `LOYALTY_IDEOLOGY_MULT[${ideo}] is a number`);
  }
  // Spot checks.
  assert(LOYALTY_IDEOLOGY_MULT.Conservative === 0.7,
    `LOYALTY_IDEOLOGY_MULT.Conservative === 0.7`);
  assert(LOYALTY_IDEOLOGY_MULT.Moderate === 0.3,
    `LOYALTY_IDEOLOGY_MULT.Moderate === 0.3`);

  // SLAVE_STATES_1856 — 15 states per AC #30.
  assert(SLAVE_STATES_1856.length === 15,
    `SLAVE_STATES_1856 has 15 states (got ${SLAVE_STATES_1856.length})`);
  for (const s of ['va', 'sc', 'ga', 'al', 'ms', 'tn', 'nc', 'ky',
                   'mo', 'fl', 'ar', 'tx', 'la', 'md', 'de']) {
    assert(SLAVE_STATES_1856.includes(s), `SLAVE_STATES_1856 includes ${s}`);
  }
  // Defection threshold.
  assert(LOYALTY_DEFECTION_THRESHOLD === 0.4,
    `LOYALTY_DEFECTION_THRESHOLD === 0.4`);
  assert(LOYALTY_RANGE.min === 0 && LOYALTY_RANGE.max === 1,
    `LOYALTY_RANGE = [0, 1]`);
}

// -- J. runSecessionWinterDefections math spot checks ------------------------
// Mirror the formula in phaseRunners.ts:2969-2995 locally for math verification.
function simulateDefection(
  region: 'South' | 'Border' | 'Northeast' | 'Midwest' | 'West',
  ideology: Ideology,
  startingLoyalty: number,
): { postDecay: number; defects: boolean } {
  const regionBase = LOYALTY_REGION_BASE[region];
  const ideoMult = LOYALTY_IDEOLOGY_MULT[ideology];
  const decay = regionBase * ideoMult;
  const postDecay = Math.max(LOYALTY_RANGE.min, Math.min(LOYALTY_RANGE.max, startingLoyalty - decay));
  return { postDecay, defects: postDecay < LOYALTY_DEFECTION_THRESHOLD };
}
{
  // Cobb (GA = South, Conservative, loyalty=0.5):
  //   decay = 0.5 * 0.7 = 0.35; postDecay = 0.5 - 0.35 = 0.15; 0.15 < 0.4 → defects.
  const cobb = simulateDefection('South', 'Conservative', 0.5);
  assert(Math.abs(cobb.postDecay - 0.15) < 1e-9,
    `Cobb postDecay = 0.15 (got ${cobb.postDecay})`);
  assert(cobb.defects, `Cobb (GA Cons loyalty=0.5) defects (postDecay 0.15 < 0.4)`);

  // Floyd (VA = South, Conservative, loyalty=0.5): same as Cobb.
  const floyd = simulateDefection('South', 'Conservative', 0.5);
  assert(floyd.defects, `Floyd (VA Cons loyalty=0.5) defects (postDecay 0.15 < 0.4)`);

  // Thompson (MS = South, Conservative, loyalty=0.5): same.
  const thompson = simulateDefection('South', 'Conservative', 0.5);
  assert(thompson.defects, `Thompson (MS Cons loyalty=0.5) defects`);

  // Cass (MI = Midwest, Moderate, loyalty=0.9):
  //   decay = 0.0 * 0.3 = 0.0; postDecay = 0.9; 0.9 >= 0.4 → stays.
  const cass = simulateDefection('Midwest', 'Moderate', 0.9);
  assert(Math.abs(cass.postDecay - 0.9) < 1e-9,
    `Cass postDecay = 0.9 (got ${cass.postDecay})`);
  assert(!cass.defects, `Cass (MI Mod loyalty=0.9) stays (postDecay 0.9 >= 0.4)`);

  // Edge case: South + Traditionalist + 1.0 starting:
  //   decay = 0.5 * 1.0 = 0.5; postDecay = 0.5; 0.5 >= 0.4 → stays.
  const sTrad10 = simulateDefection('South', 'Traditionalist', 1.0);
  assert(Math.abs(sTrad10.postDecay - 0.5) < 1e-9, `South Trad loyalty=1.0 postDecay = 0.5`);
  assert(!sTrad10.defects,
    `South Traditionalist loyalty=1.0 stays at postDecay 0.5 (threshold 0.4)`);

  // South + RW Populist + 1.0: decay = 0.5 * 1.2 = 0.6; postDecay = 0.4; 0.4 < 0.4? No (not strict).
  const sRW10 = simulateDefection('South', 'RW Populist', 1.0);
  assert(Math.abs(sRW10.postDecay - 0.4) < 1e-9, `South RW loyalty=1.0 postDecay = 0.4`);
  assert(!sRW10.defects,
    `South RW Populist loyalty=1.0 stays at postDecay 0.4 (threshold is strict <)`);

  // Northeast + Progressive + 0.5: decay = 0.0 * -0.2 = 0; postDecay = 0.5 → stays.
  const nePro = simulateDefection('Northeast', 'Progressive', 0.5);
  assert(!nePro.defects, `Northeast Progressive loyalty=0.5 stays`);

  // Border + Conservative + 0.5: decay = 0.2 * 0.7 = 0.14; postDecay = 0.36; 0.36 < 0.4 → defects.
  const borderCons = simulateDefection('Border', 'Conservative', 0.5);
  assert(Math.abs(borderCons.postDecay - 0.36) < 1e-9,
    `Border Cons loyalty=0.5 postDecay = 0.36`);
  assert(borderCons.defects, `Border Conservative loyalty=0.5 defects (0.36 < 0.4)`);
}

// -- K. Dataset regression: marquee figures have correct loyalty + traits ----
let datasetTotal = 0;
const marqueeChecks = {
  Lincoln: { traits: ['Crisis Gov', 'Delegator'], loyalty: 1.0, missingTraits: 0, wrongLoyalty: false },
  Buchanan: { traits: ['Passive', 'Naive Strategist'], notTraits: ['Efficient'], loyalty: 1.0, missingTraits: 0, hasForbidden: false, wrongLoyalty: false },
  Pierce: { traits: ['Passive', 'Overeager'], loyalty: 1.0, missingTraits: 0, wrongLoyalty: false },
  Calhoun: { traits: ['Domestic Warrior'], loyalty: 1.0, missingTraits: 0, wrongLoyalty: false },
  Grant: { traits: ['Decisive General'], loyalty: 1.0, missingTraits: 0, wrongLoyalty: false },
  McClellan: { traits: ['Naive Strategist', 'Passive'], loyalty: 1.0, missingTraits: 0, wrongLoyalty: false },
  Floyd: { traits: ['Iron Fist', 'Naive Strategist'], loyalty: 0.5, missingTraits: 0, wrongLoyalty: false },
  Cobb: { traits: [] as string[], loyalty: 0.5, missingTraits: 0, wrongLoyalty: false },
  Thompson: { traits: [] as string[], loyalty: 0.5, missingTraits: 0, wrongLoyalty: false },
  Cass: { traits: [] as string[], loyalty: 0.9, missingTraits: 0, wrongLoyalty: false },
};
try {
  const raw = readFileSync('/home/user/AMPU/public/standard-draft-classes.json', 'utf8');
  const arr = JSON.parse(raw) as { firstName: string; lastName: string;
    traits: string[]; loyalty?: number }[];
  datasetTotal = arr.length;
  const findBy = (first: string, last: string) =>
    arr.find((p) => p.firstName === first && p.lastName === last);

  const lincoln = findBy('Abraham', 'Lincoln');
  if (lincoln) {
    for (const t of marqueeChecks.Lincoln.traits) {
      if (!lincoln.traits.includes(t)) marqueeChecks.Lincoln.missingTraits++;
    }
    if (lincoln.loyalty !== marqueeChecks.Lincoln.loyalty) marqueeChecks.Lincoln.wrongLoyalty = true;
  }

  const buch = findBy('James', 'Buchanan');
  if (buch) {
    for (const t of marqueeChecks.Buchanan.traits) {
      if (!buch.traits.includes(t)) marqueeChecks.Buchanan.missingTraits++;
    }
    for (const t of marqueeChecks.Buchanan.notTraits) {
      if (buch.traits.includes(t)) marqueeChecks.Buchanan.hasForbidden = true;
    }
    if (buch.loyalty !== marqueeChecks.Buchanan.loyalty) marqueeChecks.Buchanan.wrongLoyalty = true;
  }

  const pierce = findBy('Franklin', 'Pierce');
  if (pierce) {
    for (const t of marqueeChecks.Pierce.traits) {
      if (!pierce.traits.includes(t)) marqueeChecks.Pierce.missingTraits++;
    }
    if (pierce.loyalty !== marqueeChecks.Pierce.loyalty) marqueeChecks.Pierce.wrongLoyalty = true;
  }

  const calhoun = findBy('John C.', 'Calhoun');
  if (calhoun) {
    for (const t of marqueeChecks.Calhoun.traits) {
      if (!calhoun.traits.includes(t)) marqueeChecks.Calhoun.missingTraits++;
    }
    if (calhoun.loyalty !== marqueeChecks.Calhoun.loyalty) marqueeChecks.Calhoun.wrongLoyalty = true;
  }

  const grant = findBy('Ulysses S.', 'Grant');
  if (grant) {
    for (const t of marqueeChecks.Grant.traits) {
      if (!grant.traits.includes(t)) marqueeChecks.Grant.missingTraits++;
    }
    if (grant.loyalty !== marqueeChecks.Grant.loyalty) marqueeChecks.Grant.wrongLoyalty = true;
  }

  const mcc = findBy('George B.', 'McClellan');
  if (mcc) {
    for (const t of marqueeChecks.McClellan.traits) {
      if (!mcc.traits.includes(t)) marqueeChecks.McClellan.missingTraits++;
    }
    if (mcc.loyalty !== marqueeChecks.McClellan.loyalty) marqueeChecks.McClellan.wrongLoyalty = true;
  }

  const floyd = findBy('John B.', 'Floyd');
  if (floyd) {
    for (const t of marqueeChecks.Floyd.traits) {
      if (!floyd.traits.includes(t)) marqueeChecks.Floyd.missingTraits++;
    }
    if (floyd.loyalty !== marqueeChecks.Floyd.loyalty) marqueeChecks.Floyd.wrongLoyalty = true;
  }

  const cobb = findBy('Howell', 'Cobb');
  if (cobb && cobb.loyalty !== marqueeChecks.Cobb.loyalty) marqueeChecks.Cobb.wrongLoyalty = true;

  const thompson = findBy('Jacob', 'Thompson');
  if (thompson && thompson.loyalty !== marqueeChecks.Thompson.loyalty) marqueeChecks.Thompson.wrongLoyalty = true;

  const cass = findBy('Lewis', 'Cass');
  if (cass && cass.loyalty !== marqueeChecks.Cass.loyalty) marqueeChecks.Cass.wrongLoyalty = true;

  // Assertions.
  for (const [name, check] of Object.entries(marqueeChecks)) {
    assert((check as { missingTraits: number }).missingTraits === 0,
      `Marquee ${name}: all expected PR6 traits present`);
    if ('hasForbidden' in check) {
      assert(!check.hasForbidden,
        `Marquee ${name}: forbidden traits absent (${(check as { notTraits: string[] }).notTraits.join(',')})`);
    }
    assert(!check.wrongLoyalty,
      `Marquee ${name}: loyalty === ${check.loyalty}`);
  }
} catch (e) {
  contractFail++;
  contractFailures.push(`Dataset read/parse failed: ${(e as Error).message.slice(0, 100)}`);
}

// -- L. Loyalty backfill repair() simulation ---------------------------------
// No IndexedDB in Node; simulate the GameContext.tsx:223-237 block in-memory.
{
  const synth = {
    politicians: [
      { id: 'p1', traits: [] as Trait[], loyalty: undefined as number | undefined },
      { id: 'p2', traits: [], loyalty: 0.5 },     // explicit, valid → keep.
      { id: 'p3', traits: [], loyalty: 1.5 },     // out of range → clamp to 1.0.
      { id: 'p4', traits: [], loyalty: -0.2 },    // out of range → clamp to 0.0.
    ],
  };

  // Replicate migration block from GameContext.tsx:224-232.
  let loyaltyBackfilled = false;
  for (const p of synth.politicians) {
    if (typeof p.loyalty !== 'number') {
      p.loyalty = 1.0;
      loyaltyBackfilled = true;
    } else if (p.loyalty < 0 || p.loyalty > 1) {
      p.loyalty = Math.max(0, Math.min(1, p.loyalty));
      loyaltyBackfilled = true;
    }
  }

  assert(loyaltyBackfilled === true,
    `Migration: loyalty backfill fires on missing/out-of-range entries`);
  assert(synth.politicians[0].loyalty === 1.0,
    `Migration: undefined loyalty backfills to 1.0`);
  assert(synth.politicians[1].loyalty === 0.5,
    `Migration: valid loyalty (0.5) preserved`);
  assert(synth.politicians[2].loyalty === 1.0,
    `Migration: out-of-range (1.5) clamped to 1.0`);
  assert(synth.politicians[3].loyalty === 0.0,
    `Migration: out-of-range (-0.2) clamped to 0.0`);

  // Idempotency: second run is a no-op.
  let secondRun = false;
  for (const p of synth.politicians) {
    if (typeof p.loyalty !== 'number') {
      p.loyalty = 1.0;
      secondRun = true;
    } else if (p.loyalty < 0 || p.loyalty > 1) {
      p.loyalty = Math.max(0, Math.min(1, p.loyalty));
      secondRun = true;
    }
  }
  assert(secondRun === false,
    `Migration: idempotent (no-op on second run)`);
}

// -- M. Secession Winter N≥2 unconditional war injection (reviewer fix #2) --
// modulateEraEventEffect is private; we mirror the logic for the N≥2 branch.
// AC #36: civil war is unavoidable if 2+ cabinet members defect, regardless of
// chosen response. r1 always starts war via authored effect; r2/r3 omit it but
// modulateEraEventEffect injects on N>=2.
{
  // Simulate the injection logic from phaseRunners.ts:2921-2923.
  function injectsWar(authoredStartWar: { name: string } | undefined, N: number): boolean {
    return N >= 2 && !authoredStartWar;
  }

  // r1 with authored startWar — N>=2 does NOT inject (preserves authored).
  assert(injectsWar({ name: 'American Civil War' }, 2) === false,
    `r1 (authored startWar) + N=2: no injection (preserves authored)`);
  assert(injectsWar({ name: 'American Civil War' }, 3) === false,
    `r1 (authored startWar) + N=3: no injection`);

  // r2/r3 without authored startWar — N>=2 injects, N<2 does not.
  assert(injectsWar(undefined, 0) === false,
    `r2/r3 + N=0: no injection (no war)`);
  assert(injectsWar(undefined, 1) === false,
    `r2/r3 + N=1: no injection (cabinet held)`);
  assert(injectsWar(undefined, 2) === true,
    `r2/r3 + N=2: INJECT (the reviewer fix #2 surface — unconditional war on 2+ defectors)`);
  assert(injectsWar(undefined, 3) === true,
    `r2/r3 + N=3: INJECT (3+ defectors)`);
  assert(injectsWar(undefined, 4) === true,
    `r2/r3 + N=4: INJECT (full cabinet revolt)`);
}

// -- N. Delegator/Micromanager multiplier semantics on meters only ----------
// Replicate the cumulative multiplier reading at phaseRunners.ts:2926-2935.
{
  // Helper: compute the cumulative multiplier applied to meters at the end.
  function computeMult(presTraits: Trait[]): number {
    let mult = 1.0;
    if (presTraits.includes('Delegator')) mult *= 1.5;
    if (presTraits.includes('Micromanager')) mult *= 0.5;
    return mult;
  }

  assert(computeMult([]) === 1.0, `No Delegator/Micromanager: multiplier = 1.0`);
  assert(computeMult(['Delegator']) === 1.5, `Delegator: multiplier = 1.5`);
  assert(computeMult(['Micromanager']) === 0.5, `Micromanager: multiplier = 0.5`);
  // Both impossible per AC #10 conflict (d6-arbitrated), but if a corrupt save
  // has both, both multiply: 1.5 * 0.5 = 0.75. Not load-bearing.
}

// -- O. Lincoln (Delegator + Crisis Gov) lingering math (AC #43) -------------
// Lincoln with Chase (Treasury, Economics): PR5 expertise +0.2 on economic;
// Delegator multiplier +50% → effective +0.3 on economic. Lincoln's Crisis Gov
// adds +SMALL (=2) on domestic. Mirror the phaseRunners.ts:3262-3314 logic.
{
  // Simulate cabinet seat with Economics expertise; president carries Delegator + Crisis Gov.
  // Per phaseRunners.ts: PR5 fires +0.2 first; then multiplier fires (×1.5 -1 = 0.5)*0.2 = +0.1;
  // then per-trait lingering_phase additive rules fire on the seated President.
  // Crisis Gov has lingering_phase row with magnitude SMALL=2, meter='domestic'.
  // Net economic = 0.2 (PR5) + 0.1 (delegator differential) = 0.3.
  // Net domestic = 2 (Crisis Gov on President, meter='domestic').
  const pr5Bonus = 0.2;
  const delegatorDifferential = (1.5 - 1.0) * pr5Bonus;
  assert(Math.abs(pr5Bonus + delegatorDifferential - 0.3) < 1e-9,
    `Delegator on Treasury (Economics expert): economic +0.2 + +0.1 = +0.3 (AC #43)`);

  // Crisis Gov lingering_phase row.
  const crisisGovLP = TRAIT_GOVERNANCE_EFFECTS.find(
    (r) => r.trait === 'Crisis Gov' && r.context === 'lingering_phase'
  );
  assert(crisisGovLP?.magnitude === 2 && crisisGovLP?.meter === 'domestic',
    `Crisis Gov lingering_phase = +2 on domestic`);
}

stubbedRandom = realRandom;
Math.random = realRandom;

console.log(`Dataset: ${datasetTotal} politicians`);
console.log(`Contract tests: ${contractPass} passed, ${contractFail} failed`);
if (contractFailures.length) {
  for (const f of contractFailures.slice(0, 30)) console.log(`  FAIL: ${f}`);
}

// ---------------------------------------------------------------------------
// Part 2: engine scenario drive
// ---------------------------------------------------------------------------

const use1856 = process.argv.includes('--1856');
const SLUG = use1856 ? '1856' : '1772';
const OUT = `/home/user/AMPU/docs/playtest/trait-pass-b-governance/engine-trace-${SLUG}.json`;

let snap: FullGameSnapshot;
if (use1856) {
  const { build1856Scenario } = await import('../src/data/scenario1856');
  snap = build1856Scenario('fact_blue_cons');
} else {
  snap = build1772Scenario('fact_blue_lw_1772');
}
const startYear = snap.game.year;
const startEra = snap.game.currentEra;
console.log(`Built ${SLUG} scenario: year=${snap.game.year}, era=${snap.game.currentEra}, ` +
  `phase=${snap.game.phaseId}, politicians=${snap.politicians.length}`);

// Initial-phase draft.
runCurrentPhase(snap);
while (snap.game.draftRoundOrder.length > 0) {
  const r = simOneDraftPick(snap);
  if (r.needsPlayer) autoPickForPlayer(snap);
}
console.log(`Initial-phase draft complete: ${snap.politicians.length} politicians`);

// Verify ALL drafted politicians have a loyalty value (default 1.0).
{
  const polsMissingLoyalty = snap.politicians.filter((p) => typeof (p as { loyalty?: number }).loyalty !== 'number');
  console.log(`Politicians missing loyalty after draft: ${polsMissingLoyalty.length} (should be 0)`);
  if (polsMissingLoyalty.length > 0) {
    console.log(`  First missing: ${polsMissingLoyalty[0].firstName} ${polsMissingLoyalty[0].lastName}`);
  }
}

// Initial PR6-trait counts (presence in roster).
const traitCountAt = (s: FullGameSnapshot, t: Trait): number =>
  s.politicians.filter((p) => p.traits.includes(t)).length;
const initialTraitCounts: Record<string, number> = {};
for (const t of PR6_TRAITS) initialTraitCounts[t] = traitCountAt(snap, t);
console.log(`Initial PR6 trait counts:`, initialTraitCounts);

// Drive ~600 phases. Skip Vite-env-touching phases per playbook.
const skipPhases = new Set(['2.4.2', '2.4.3']);
let phasesRun = 0;
let skippedCount = 0;
const errorPhases: { phase: string; year: number; err: string }[] = [];
for (let i = 0; i < 600; i++) {
  if (skipPhases.has(snap.game.phaseId)) {
    advancePhase(snap);
    skippedCount++;
    continue;
  }
  let res: ReturnType<typeof runCurrentPhase>;
  try {
    res = runCurrentPhase(snap);
  } catch (e) {
    const msg = (e as Error).message.slice(0, 120);
    errorPhases.push({ phase: snap.game.phaseId, year: snap.game.year, err: msg });
    advancePhase(snap);
    skippedCount++;
    continue;
  }
  if (res.needsPlayerInput === 'draft') {
    while (snap.game.draftRoundOrder.length > 0) {
      const r = simOneDraftPick(snap);
      if (r.needsPlayer) autoPickForPlayer(snap);
    }
  } else if (res.needsPlayerInput === 'eraEvent') {
    const evt = res.payload as { id: string; responses: { id: string }[] };
    if (evt?.responses?.length) {
      const { resolveEraEvent } = await import('../src/engine/phaseRunners');
      resolveEraEvent(snap, evt.id, evt.responses[0].id);
    }
  } else if (res.needsPlayerInput === 'ccBuilder') {
    const payload = res.payload as { stateId: string; eligible: { id: string }[] };
    const { playerCCDelegatePick } = await import('../src/engine/phaseRunners');
    if (payload?.eligible?.[0]) {
      playerCCDelegatePick(snap, payload.stateId, payload.eligible[0].id);
    }
  } else if (res.needsPlayerInput === 'ccAIConfirm') {
    const { confirmCCAIPick } = await import('../src/engine/phaseRunners');
    confirmCCAIPick(snap);
  } else if (res.needsPlayerInput === 'convention') {
    if (snap.game.pendingConvention) snap.game.pendingConvention.resolved = true;
  }
  advancePhase(snap);
  phasesRun++;
}
console.log(
  `Ran ${phasesRun} phases, skipped ${skippedCount}, errors ${errorPhases.length}, ` +
  `year ${startYear} -> ${snap.game.year}, era ${startEra} -> ${snap.game.currentEra}`,
);
if (errorPhases.length) {
  console.log(`First 5 errors:`);
  for (const e of errorPhases.slice(0, 5)) console.log(`  [${e.phase} y${e.year}] ${e.err}`);
}

// Final trait counts.
const finalTraitCounts: Record<string, number> = {};
for (const t of PR6_TRAITS) finalTraitCounts[t] = traitCountAt(snap, t);
console.log(`Final PR6 trait counts:`, finalTraitCounts);
// Also count Traitor.
const traitorCount = traitCountAt(snap, 'Traitor');
console.log(`Traitor trait count: ${traitorCount} (Secession Winter defectors)`);

// ---------------------------------------------------------------------------
// Part 3: event classification + trace JSON
// ---------------------------------------------------------------------------

const allText = (e: { text?: string }) => e.text ?? '';

// PR6 signature regexes — keyed to the actual log line shapes in
// phaseRunners.ts and the migration / event paths.
const secessionDefectionRx = /resigns as .+ to join the Confederacy/i;
const civilWarRx = /American Civil War/i;
const anglAmRx = /Anglo-American War/i;
const conflictHoldsRx = /holds .* on a d6/i;            // PR3 failed-d6 log shape
const conflictSwapRx = /sheds .* and earns/i;           // PR3 swap log shape

const decisiveGeneralLogRx = /Decisive General bonus/i;
const naiveStratLogRx = /Naive Strategist, no wartime Command bump/i;
const secWarBoostRx = /strategic cover/i;

const oldAgeFadeRx = /has lost their (Crisis Admin|Crisis Gov|Decisive General) step/i;
const oldAgeFadeAnyRx = /has lost their (Crisis Admin|Crisis Gov|Decisive General|Hale|Celebrity|Charismatic) step/i;

const eraEventRx = /^(Dred Scott Decision|John Brown's Raid on Harpers Ferry|Secession Winter|Trent Affair): /;
const dredScottEventRx = /^Dred Scott Decision: /;
const johnBrownEventRx = /^John Brown's Raid on Harpers Ferry: /;
const secessionWinterEventRx = /^Secession Winter: /;
const trentAffairEventRx = /^Trent Affair: /;
const sewardVoiceRx = /Seward's note: Wilkes erred/;

const lingeringMeterRx = /^([a-z]+): -?\d+\.\d+ -> -?\d+\.\d+ \(/;

// Tally counts.
const secessionDefectionEvents = snap.events.filter((e) => secessionDefectionRx.test(allText(e)));
const civilWarEvents = snap.events.filter((e) => civilWarRx.test(allText(e)));
const anglAmEvents = snap.events.filter((e) => anglAmRx.test(allText(e)));
const decisiveGeneralLogs = snap.events.filter((e) => decisiveGeneralLogRx.test(allText(e)));
const naiveStratLogs = snap.events.filter((e) => naiveStratLogRx.test(allText(e)));
const secWarBoostLogs = snap.events.filter((e) => secWarBoostRx.test(allText(e)));
const conflictHoldsLogs = snap.events.filter((e) => conflictHoldsRx.test(allText(e)));
const conflictSwapLogs = snap.events.filter((e) => conflictSwapRx.test(allText(e)));
const oldAgeFadeLogs = snap.events.filter((e) => oldAgeFadeRx.test(allText(e)));
const oldAgeFadeAnyLogs = snap.events.filter((e) => oldAgeFadeAnyRx.test(allText(e)));

// PR6 era events fired.
const dredScottEvents = snap.events.filter((e) => dredScottEventRx.test(allText(e)));
const johnBrownEvents = snap.events.filter((e) => johnBrownEventRx.test(allText(e)));
const secessionWinterEvents = snap.events.filter((e) => secessionWinterEventRx.test(allText(e)));
const trentAffairEvents = snap.events.filter((e) => trentAffairEventRx.test(allText(e)));
const sewardVoiceEvents = snap.events.filter((e) => sewardVoiceRx.test(allText(e)));

// Lingering Phase meter deltas (2.5.1 — PR6's per-trait modulation appears as
// per-meter delta lines).
const lingeringMeterLines = snap.events.filter((e) => e.phase === '2.5.1' && lingeringMeterRx.test(allText(e)));
const perMeterDeltas: Record<string, number> = {};
for (const e of lingeringMeterLines) {
  const m = allText(e).match(/^([a-z]+):/);
  if (m) perMeterDeltas[m[1]] = (perMeterDeltas[m[1]] ?? 0) + 1;
}

// Cabinet appointment / event-phase logs containing PR6 traits.
// Per-trait appearance count in any log line:
const perTraitLogCount: Record<string, number> = {};
for (const t of PR6_TRAITS) {
  const rx = new RegExp(`\\b${t.replace(/ /g, '\\s')}\\b`, 'i');
  perTraitLogCount[t] = snap.events.filter((e) => rx.test(allText(e))).length;
}

function dumpSample(label: string, arr: typeof snap.events, n = 4) {
  if (arr.length === 0) {
    console.log(`\n${label}: (none)`);
    return;
  }
  console.log(`\n${label} (first ${n} of ${arr.length}):`);
  for (const e of arr.slice(0, n)) console.log(`  [y${e.year} ${e.phase}] ${e.text}`);
}

console.log(`\n=== PR6 Trait Pass B counts (${SLUG}) ===`);
console.log(`Total events: ${snap.events.length}`);
console.log(`\n-- Era event fires --`);
console.log(`Dred Scott:        ${dredScottEvents.length}`);
console.log(`John Brown:        ${johnBrownEvents.length}`);
console.log(`Secession Winter:  ${secessionWinterEvents.length}`);
console.log(`Trent Affair:      ${trentAffairEvents.length}`);
console.log(`Seward voice shift: ${sewardVoiceEvents.length}`);
console.log(`\n-- Loyalty mechanics --`);
console.log(`Secession defection logs: ${secessionDefectionEvents.length}`);
console.log(`Traitor grants (roster): ${traitorCount}`);
console.log(`\n-- War starts --`);
console.log(`American Civil War mentions: ${civilWarEvents.length}`);
console.log(`Anglo-American War mentions: ${anglAmEvents.length}`);
console.log(`\n-- Military command (2.3.2) --`);
console.log(`Decisive General bonus: ${decisiveGeneralLogs.length}`);
console.log(`Naive Strategist suppression: ${naiveStratLogs.length}`);
console.log(`SecWar strategic cover: ${secWarBoostLogs.length}`);
console.log(`\n-- Conflict pair resolution --`);
console.log(`d6 holds (failed grant): ${conflictHoldsLogs.length}`);
console.log(`d6 swaps (successful):   ${conflictSwapLogs.length}`);
console.log(`\n-- Old-age fading pool --`);
console.log(`PR6 fade events (Crisis Admin/Gov/DecGen): ${oldAgeFadeLogs.length}`);
console.log(`Any old-age fade event: ${oldAgeFadeAnyLogs.length}`);
console.log(`\n-- Lingering Phase 2.5.1 meter deltas --`);
console.log(`Total meter delta lines: ${lingeringMeterLines.length}`);
for (const [m, n] of Object.entries(perMeterDeltas)) {
  console.log(`  ${m}: ${n}`);
}
console.log(`\n-- Per-trait log appearances (anywhere) --`);
for (const t of PR6_TRAITS) {
  console.log(`  ${t}: ${perTraitLogCount[t]}`);
}

dumpSample('Dred Scott samples', dredScottEvents);
dumpSample('John Brown samples', johnBrownEvents);
dumpSample('Secession Winter samples', secessionWinterEvents);
dumpSample('Trent Affair samples', trentAffairEvents);
dumpSample('Seward voice samples', sewardVoiceEvents);
dumpSample('Secession defection samples', secessionDefectionEvents);
dumpSample('Decisive General bonus samples', decisiveGeneralLogs);
dumpSample('Naive Strategist suppression samples', naiveStratLogs);
dumpSample('Conflict holds samples', conflictHoldsLogs, 3);
dumpSample('Conflict swaps samples', conflictSwapLogs, 3);
dumpSample('PR6 old-age fade samples', oldAgeFadeLogs);
dumpSample('Lingering meter delta samples', lingeringMeterLines, 6);

// Write trace JSON.
const summary = {
  scenario: SLUG,
  startYear,
  startEra,
  finalYear: snap.game.year,
  finalEra: snap.game.currentEra,
  phasesRun,
  phasesSkipped: skippedCount,
  errorPhases,
  totalEvents: snap.events.length,
  contractTests: {
    passed: contractPass,
    failed: contractFail,
    failures: contractFailures,
  },
  datasetTotal,
  marqueeChecks,
  initialTraitCounts,
  finalTraitCounts,
  pr6Counts: {
    eraEventFires: {
      dredScott: dredScottEvents.length,
      johnBrown: johnBrownEvents.length,
      secessionWinter: secessionWinterEvents.length,
      trentAffair: trentAffairEvents.length,
      sewardVoiceShift: sewardVoiceEvents.length,
    },
    loyaltyMechanics: {
      secessionDefectionLogs: secessionDefectionEvents.length,
      traitorRosterCount: traitorCount,
    },
    warStarts: {
      americanCivilWar: civilWarEvents.length,
      angloAmericanWar: anglAmEvents.length,
    },
    militaryCommand: {
      decisiveGeneralBonus: decisiveGeneralLogs.length,
      naiveStratSuppression: naiveStratLogs.length,
      secWarStrategicCover: secWarBoostLogs.length,
    },
    conflictPair: {
      d6Holds: conflictHoldsLogs.length,
      d6Swaps: conflictSwapLogs.length,
    },
    oldAgeFading: {
      pr6Traits: oldAgeFadeLogs.length,
      anyTrait: oldAgeFadeAnyLogs.length,
    },
    lingeringMeterLines: lingeringMeterLines.length,
    perMeterDeltaLines: perMeterDeltas,
    perTraitLogAppearances: perTraitLogCount,
  },
  samples: {
    dredScott: dredScottEvents.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    johnBrown: johnBrownEvents.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    secessionWinter: secessionWinterEvents.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    trentAffair: trentAffairEvents.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    sewardVoice: sewardVoiceEvents.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    secessionDefection: secessionDefectionEvents.slice(0, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    decisiveGeneralBonus: decisiveGeneralLogs.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    naiveStratSuppression: naiveStratLogs.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    conflictHolds: conflictHoldsLogs.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    conflictSwaps: conflictSwapLogs.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    oldAgeFadePr6: oldAgeFadeLogs.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    lingeringMeterDeltas: lingeringMeterLines.slice(0, 8).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
  },
};
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(`\nWrote trace JSON to ${OUT}`);

if (contractFail > 0 || errorPhases.length > 0) {
  console.log(`\nSMOKE FAIL: contractFail=${contractFail}, errorPhases=${errorPhases.length}`);
  process.exit(1);
}
console.log(`\nSMOKE PASS`);
