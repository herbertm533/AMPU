// PR4b engine playtest — drives 1772 (default) and 1856 (--1856) scenarios
// through ~600 phases, asserts the contract of PR4b's 7 new election-facing
// traits (+ Hale/Frail wound-grant rewire + Hale in oldAge.fadingPool +
// the 4 new TRAIT_CONFLICTS pairs), then classifies the engine-trace log
// lines by new-trait signature.
//
// Mirrors scripts/playtestTraitElectionEffects.ts (PR4a — closest template;
// PR4b extends PR4a's machinery). Also re-uses the d6/tryGrantTrait contract
// shape from scripts/playtestTraitLoss.ts (PR3) for the wound-grant 4-branch
// table.
//
//   Part 1: Contract tests with stubbed Math.random (deterministic).
//   Part 2: Engine scenario drive (auto-resolve player input).
//   Part 3: Event classification + trace JSON to docs/playtest/<slug>/.
//
// Run BOTH variants — 1772 + 1856 — for full coverage (Cosmopolitan /
// Provincial / Two-Faced / Hale all era-scale, and 1856 is where the new
// elections actually fire):
//   npx tsx scripts/playtestTraitPassB.ts          # 1772 default
//   npx tsx scripts/playtestTraitPassB.ts --1856   # 1856 path

// Stub import.meta.env for Node (Vite injects this in the browser).
// @ts-ignore
if (typeof import.meta.env === 'undefined') (import.meta as any).env = { DEV: false };

import { build1772Scenario } from '../src/data/scenario1772';
import { runCurrentPhase, advancePhase } from '../src/engine/engine';
import { simOneDraftPick, autoPickForPlayer } from '../src/engine/phaseRunners';
import { applyTraitElectionBonus } from '../src/engine/electionEffects';
import { tryGrantTrait } from '../src/engine/traits';
import {
  TRAIT_ELECTION_BANDS,
  TRAIT_ELECTION_EFFECTS,
  TRAIT_CONFLICTS,
  TRAIT_LIFECYCLE_RULES,
  POSITIVE_TRAITS,
  NEGATIVE_TRAITS,
} from '../src/types';
import type {
  ElectionContext,
  Era,
  FullGameSnapshot,
  Politician,
  Trait,
} from '../src/types';
import { readFileSync, writeFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Part 1: contract tests (stubbed RNG for the d6/tryGrantTrait branches)
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

// -- A. TRAIT_ELECTION_BANDS exact values ------------------------------------
assert(TRAIT_ELECTION_BANDS.SMALL === 2, 'TRAIT_ELECTION_BANDS.SMALL === 2');
assert(TRAIT_ELECTION_BANDS.MEDIUM === 4, 'TRAIT_ELECTION_BANDS.MEDIUM === 4');
assert(TRAIT_ELECTION_BANDS.LARGE === 8, 'TRAIT_ELECTION_BANDS.LARGE === 8');

// -- B. TRAIT_ELECTION_EFFECTS const integrity -------------------------------

// B.1: All 22 traits represented (15 PR4a + 7 PR4b).
const PR4A_TRAITS: Trait[] = [
  'Charismatic', 'Integrity', 'Debater', 'Propagandist', 'Harmonious',
  'Magician', 'Unlikable', 'Puritan', 'Numberfudger', 'Scandalous',
  'Controversial', 'Obscure', 'Domestic Apathy', 'Carpetbagger', 'Outsider',
];
const PR4B_TRAITS: Trait[] = [
  'Likable', 'Uncharismatic', 'Cosmopolitan', 'Provincial',
  'Two-Faced', 'Predictable', 'Hale',
];
const ALL_TRAITS = [...PR4A_TRAITS, ...PR4B_TRAITS];

const tableTraits = new Set(TRAIT_ELECTION_EFFECTS.map((r) => r.trait));
assert(tableTraits.size === 22,
  `TRAIT_ELECTION_EFFECTS covers exactly 22 traits (got ${tableTraits.size})`);
for (const t of ALL_TRAITS) {
  assert(tableTraits.has(t), `TRAIT_ELECTION_EFFECTS contains ${t}`);
}

// B.2: Total row count = PR4a's 83 + PR4b's 63 = 146 (per qa-tester task brief).
// PR4a 83: Charismatic 6, Integrity 6, Debater 6, Propagandist 6, Harmonious 6,
//          Magician 6, Unlikable 6, Puritan 6, Numberfudger 3, Scandalous 6,
//          Controversial 6, Obscure 5, Domestic Apathy 6 (4 era-split PG + house + governor),
//          Carpetbagger 3, Outsider 6 = 83.
// PR4b 63: Likable 6, Uncharismatic 5, Cosmopolitan 10, Provincial 15,
//          Two-Faced 12, Predictable 6, Hale 9 = 63.
//   Provincial 15 = 4-era PG + presPrimary + 4-era house + senatePre17 + 4-era governor + internalParty.
//   Two-Faced 12 = 4-era PG + presPrimary + house + 4-era senatePre17 + governor + internalParty.
const totalRows = TRAIT_ELECTION_EFFECTS.length;
const pr4aCount = TRAIT_ELECTION_EFFECTS.filter((r) => PR4A_TRAITS.includes(r.trait)).length;
const pr4bCount = TRAIT_ELECTION_EFFECTS.filter((r) => PR4B_TRAITS.includes(r.trait)).length;
assert(pr4aCount === 83, `PR4a row count (got ${pr4aCount}, expected 83)`);
assert(pr4bCount === 63, `PR4b row count (got ${pr4bCount}, expected 63)`);
assert(totalRows === 146, `Total rows (got ${totalRows}, expected 146)`);

// B.3: per-trait per-context row counts for the new 7 traits.
function rowsFor(trait: Trait): typeof TRAIT_ELECTION_EFFECTS {
  return TRAIT_ELECTION_EFFECTS.filter((r) => r.trait === trait);
}
function rowsForCtx(trait: Trait, ctx: ElectionContext) {
  return rowsFor(trait).filter((r) => r.context === ctx);
}
// Likable: 6 contexts, no era-split — 1 row each. presGeneral opp-conditional.
assert(rowsFor('Likable').length === 6, 'Likable has 6 rows total');
{
  const pg = rowsForCtx('Likable', 'presGeneral');
  assert(pg.length === 1 && pg[0].opponentConditional !== undefined,
    'Likable presGeneral opp-conditional present');
  assert(pg[0].opponentConditional?.ifOpponentHas.includes('Unlikable') ?? false,
    'Likable opp-conditional vs Unlikable');
  assert(pg[0].opponentConditional?.bumpedMagnitude === TRAIT_ELECTION_BANDS.LARGE,
    'Likable bumped LARGE vs Unlikable');
}
// Uncharismatic: 5 rows (no senatePre17); presGeneral opp-conditional.
assert(rowsFor('Uncharismatic').length === 5, 'Uncharismatic has 5 rows total');
assert(rowsForCtx('Uncharismatic', 'senatePre17').length === 0,
  'Uncharismatic has NO senatePre17 row');
{
  const pg = rowsForCtx('Uncharismatic', 'presGeneral');
  assert(pg.length === 1 && pg[0].opponentConditional !== undefined,
    'Uncharismatic presGeneral opp-conditional present');
  assert(pg[0].opponentConditional?.ifOpponentHas.includes('Charismatic') ?? false,
    'Uncharismatic opp-conditional vs Charismatic');
  assert(pg[0].opponentConditional?.bumpedMagnitude === -TRAIT_ELECTION_BANDS.MEDIUM,
    'Uncharismatic bumped -MEDIUM vs Charismatic');
}
// Cosmopolitan: 10 rows total (4 era-split presGeneral + presPrimary + house +
// 2 era senatePre17 + governor + internalParty).
assert(rowsFor('Cosmopolitan').length === 10, 'Cosmopolitan has 10 rows total');
assert(rowsForCtx('Cosmopolitan', 'presGeneral').length === 4,
  'Cosmopolitan presGeneral has 4 era-split rows');
assert(rowsForCtx('Cosmopolitan', 'senatePre17').length === 2,
  'Cosmopolitan senatePre17 has 2 era-split rows (nationalism + modern only)');
// Provincial: 15 rows (4 era PG + presPrimary + 4 era house + senatePre17 + 4 era governor + internalParty).
assert(rowsFor('Provincial').length === 15, 'Provincial has 15 rows total');
assert(rowsForCtx('Provincial', 'presGeneral').length === 4, 'Provincial presGeneral 4 era-split rows');
assert(rowsForCtx('Provincial', 'house').length === 4, 'Provincial house 4 era-split rows');
assert(rowsForCtx('Provincial', 'governor').length === 4, 'Provincial governor 4 era-split rows');
// Two-Faced: 12 rows (4 era PG + presPrimary + house + 4 era senatePre17 + governor + internalParty).
assert(rowsFor('Two-Faced').length === 12, 'Two-Faced has 12 rows total');
assert(rowsForCtx('Two-Faced', 'presGeneral').length === 4, 'Two-Faced presGeneral 4 era-split rows');
assert(rowsForCtx('Two-Faced', 'senatePre17').length === 4, 'Two-Faced senatePre17 4 era-split rows');
// Predictable: 6 rows, flat.
assert(rowsFor('Predictable').length === 6, 'Predictable has 6 rows total');
for (const r of rowsFor('Predictable')) {
  assert(r.era === undefined, `Predictable rows are era-flat (got ${r.context}/${r.era})`);
  assert(r.opponentConditional === undefined, `Predictable rows are not opp-conditional`);
}
// Hale: 9 rows (4 era presGeneral with opp-conditional + 5 flat contexts).
assert(rowsFor('Hale').length === 9, 'Hale has 9 rows total');
assert(rowsForCtx('Hale', 'presGeneral').length === 4, 'Hale presGeneral 4 era-split rows');
// All 4 Hale presGeneral rows carry opp-conditional vs Frail bumped LARGE.
for (const r of rowsForCtx('Hale', 'presGeneral')) {
  assert(r.opponentConditional !== undefined,
    `Hale presGeneral row (${r.era}) has opp-conditional`);
  assert(r.opponentConditional?.ifOpponentHas.includes('Frail') ?? false,
    `Hale presGeneral row (${r.era}) opp-conditional vs Frail`);
  assert(r.opponentConditional?.bumpedMagnitude === TRAIT_ELECTION_BANDS.LARGE,
    `Hale presGeneral row (${r.era}) bumped LARGE`);
}

// -- C. POSITIVE_TRAITS / NEGATIVE_TRAITS classifications --------------------
const POS = new Set(POSITIVE_TRAITS as Trait[]);
const NEG = new Set(NEGATIVE_TRAITS as Trait[]);
for (const t of ['Likable', 'Cosmopolitan', 'Predictable', 'Hale'] as Trait[]) {
  assert(POS.has(t), `POSITIVE_TRAITS includes ${t}`);
  assert(!NEG.has(t), `${t} not in NEGATIVE_TRAITS`);
}
for (const t of ['Uncharismatic', 'Provincial', 'Two-Faced'] as Trait[]) {
  assert(NEG.has(t), `NEGATIVE_TRAITS includes ${t}`);
  assert(!POS.has(t), `${t} not in POSITIVE_TRAITS`);
}

// -- D. TRAIT_CONFLICTS — 4 new pairs symmetric -----------------------------
const NEW_PAIRS: [Trait, Trait][] = [
  ['Likable', 'Uncharismatic'],
  ['Cosmopolitan', 'Provincial'],
  ['Two-Faced', 'Predictable'],
  ['Hale', 'Frail'],
];
for (const [a, b] of NEW_PAIRS) {
  assert(TRAIT_CONFLICTS[a] === b, `TRAIT_CONFLICTS[${a}] === ${b}`);
  assert(TRAIT_CONFLICTS[b] === a, `TRAIT_CONFLICTS[${b}] === ${a}`);
}
// Plus the 7 pre-existing PR3 pairs (sanity).
const PR3_PAIRS: [Trait, Trait][] = [
  ['Charismatic', 'Unlikable'],
  ['Harmonious', 'Puritan'],
  ['Integrity', 'Corrupt'],
  ['Efficient', 'Passive'],
  ['Egghead', 'Incompetent'],
  ['Ideologue', 'Impressionable'],
  ['Loyal', 'Opportunist'],
];
for (const [a, b] of PR3_PAIRS) {
  assert(TRAIT_CONFLICTS[a] === b, `[PR3 pre-existing] TRAIT_CONFLICTS[${a}] === ${b}`);
}

// -- E. TRAIT_LIFECYCLE_RULES.oldAge.fadingPool ------------------------------
{
  const pool = TRAIT_LIFECYCLE_RULES.oldAge.fadingPool;
  assert(pool.length === 3, `fadingPool has 3 entries (got ${pool.length})`);
  assert(pool.includes('Celebrity'), 'fadingPool includes Celebrity (PR3)');
  assert(pool.includes('Charismatic'), 'fadingPool includes Charismatic (PR3)');
  assert(pool.includes('Hale'), 'fadingPool includes Hale (PR4b)');
  // No other PR4b trait enters the pool.
  for (const t of ['Likable', 'Uncharismatic', 'Cosmopolitan', 'Provincial',
                   'Two-Faced', 'Predictable'] as Trait[]) {
    assert(!(pool as readonly string[]).includes(t),
      `fadingPool excludes ${t} (PR4b spec AC #9)`);
  }
}
// minAge unchanged per spec AC #8 deferral.
assert(TRAIT_LIFECYCLE_RULES.oldAge.minAge === 70, 'oldAge.minAge unchanged at 70');
assert(TRAIT_LIFECYCLE_RULES.conflictD6Threshold === 4,
  'conflictD6Threshold unchanged at 4');

// -- F. applyTraitElectionBonus resolution for new traits --------------------

// F.1 Likable in presGeneral: base MEDIUM (+4); bumped LARGE (+8) vs Unlikable.
{
  const p = mkPol(['Likable']);
  const r1 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  assert(r1.totalBonus === 4, `Likable PG base = +4 (got ${r1.totalBonus})`);
  const r2 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Unlikable'] });
  assert(r2.totalBonus === 8, `Likable PG vs Unlikable = +8 (got ${r2.totalBonus})`);
  // Other contexts:
  assert(applyTraitElectionBonus(p, 'presPrimary', { era: 'nationalism' }).totalBonus === 2,
    'Likable presPrimary = +2');
  assert(applyTraitElectionBonus(p, 'house', { era: 'nationalism' }).totalBonus === 4,
    'Likable house = +4');
  assert(applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism' }).totalBonus === 2,
    'Likable senatePre17 = +2');
  assert(applyTraitElectionBonus(p, 'governor', { era: 'nationalism' }).totalBonus === 4,
    'Likable governor = +4');
  assert(applyTraitElectionBonus(p, 'internalParty', { era: 'nationalism' }).totalBonus === 4,
    'Likable internalParty (faction-leader install) = +4 (item #4)');
}

// F.2 Uncharismatic: base -SMALL; bumped -MEDIUM vs Charismatic.
{
  const p = mkPol(['Uncharismatic']);
  const r1 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  assert(r1.totalBonus === -2, `Uncharismatic PG base = -2 (got ${r1.totalBonus})`);
  const r2 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Charismatic'] });
  assert(r2.totalBonus === -4, `Uncharismatic PG vs Charismatic = -4 (got ${r2.totalBonus})`);
  // senatePre17 NONE.
  assert(applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism' }).totalBonus === 0,
    'Uncharismatic senatePre17 = 0 (no row)');
  assert(applyTraitElectionBonus(p, 'internalParty', { era: 'nationalism' }).totalBonus === -4,
    'Uncharismatic internalParty = -4');
}

// F.3 Cosmopolitan era-scaling.
{
  const p = mkPol(['Cosmopolitan']);
  const rNat = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  assert(rNat.totalBonus === 4, `Cosmopolitan PG nationalism = +4 (got ${rNat.totalBonus})`);
  const rInd = applyTraitElectionBonus(p, 'presGeneral', { era: 'independence' });
  assert(rInd.totalBonus === 2, `Cosmopolitan PG independence = +2 (got ${rInd.totalBonus})`);
  const rFed = applyTraitElectionBonus(p, 'presGeneral', { era: 'federalism' });
  assert(rFed.totalBonus === 2, `Cosmopolitan PG federalism = +2 (got ${rFed.totalBonus})`);
  // senatePre17 era-split: SMALL in nationalism/modern, NONE in independence/federalism.
  assert(applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism' }).totalBonus === 2,
    'Cosmopolitan senatePre17 nationalism = +2');
  assert(applyTraitElectionBonus(p, 'senatePre17', { era: 'independence' }).totalBonus === 0,
    'Cosmopolitan senatePre17 independence = 0');
  // governor negative.
  assert(applyTraitElectionBonus(p, 'governor', { era: 'nationalism' }).totalBonus === -4,
    'Cosmopolitan governor = -4 (national-horizon hurts state office)');
  assert(applyTraitElectionBonus(p, 'internalParty', { era: 'nationalism' }).totalBonus === 4,
    'Cosmopolitan internalParty = +4');
}

// F.4 Provincial: POSITIVE in house/governor (sign-flip per spec)
// but NEGATIVE classification at PV layer. Era-scaled.
{
  const p = mkPol(['Provincial']);
  const rHouseNat = applyTraitElectionBonus(p, 'house', { era: 'nationalism' });
  assert(rHouseNat.totalBonus === 4,
    `Provincial house nationalism = +4 (POSITIVE despite NEGATIVE_TRAITS classification — sign-flip; got ${rHouseNat.totalBonus})`);
  const rHouseInd = applyTraitElectionBonus(p, 'house', { era: 'independence' });
  assert(rHouseInd.totalBonus === 2, `Provincial house independence = +2 (got ${rHouseInd.totalBonus})`);
  const rGovNat = applyTraitElectionBonus(p, 'governor', { era: 'nationalism' });
  assert(rGovNat.totalBonus === 4, `Provincial governor nationalism = +4`);
  const rSen = applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism' });
  assert(rSen.totalBonus === 2, `Provincial senatePre17 = +2 (flat both eras)`);
  // presGeneral negative.
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' }).totalBonus === -4,
    'Provincial PG nationalism = -4');
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'independence' }).totalBonus === -2,
    'Provincial PG independence = -2');
  assert(applyTraitElectionBonus(p, 'internalParty', { era: 'nationalism' }).totalBonus === -2,
    'Provincial internalParty = -2');
}

// F.5 Two-Faced: -LARGE in presPrimary & internalParty (item #5); era-split elsewhere.
{
  const p = mkPol(['Two-Faced']);
  for (const era of ['independence', 'federalism', 'nationalism', 'modern'] as Era[]) {
    assert(applyTraitElectionBonus(p, 'presPrimary', { era }).totalBonus === -8,
      `Two-Faced presPrimary (${era}) = -8 LARGE flat (item #5 headline)`);
    assert(applyTraitElectionBonus(p, 'internalParty', { era }).totalBonus === -8,
      `Two-Faced internalParty (${era}) = -8 LARGE flat`);
  }
  // presGeneral era-split.
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' }).totalBonus === -4,
    'Two-Faced PG nationalism = -4');
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'independence' }).totalBonus === -2,
    'Two-Faced PG independence = -2');
  // senatePre17 era-split.
  assert(applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism' }).totalBonus === -4,
    'Two-Faced senatePre17 nationalism = -4');
  assert(applyTraitElectionBonus(p, 'senatePre17', { era: 'federalism' }).totalBonus === -2,
    'Two-Faced senatePre17 federalism = -2');
}

// F.6 Predictable: flat positive across all 6 contexts.
{
  const p = mkPol(['Predictable']);
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' }).totalBonus === 2,
    'Predictable PG = +2');
  assert(applyTraitElectionBonus(p, 'presPrimary', { era: 'nationalism' }).totalBonus === 2,
    'Predictable presPrimary = +2');
  assert(applyTraitElectionBonus(p, 'house', { era: 'nationalism' }).totalBonus === 2,
    'Predictable house = +2');
  assert(applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism' }).totalBonus === 4,
    'Predictable senatePre17 = +4 (MEDIUM)');
  assert(applyTraitElectionBonus(p, 'governor', { era: 'nationalism' }).totalBonus === 2,
    'Predictable governor = +2');
  assert(applyTraitElectionBonus(p, 'internalParty', { era: 'nationalism' }).totalBonus === 4,
    'Predictable internalParty = +4 MEDIUM (item #4 — Predictable +MEDIUM)');
}

// F.7 Hale: opp-conditional LARGE vs Frail in BOTH eras (item #3 headline).
{
  const p = mkPol(['Hale']);
  // Base era-split:
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' }).totalBonus === 4,
    'Hale PG nationalism base = +4');
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'modern' }).totalBonus === 4,
    'Hale PG modern base = +4');
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'independence' }).totalBonus === 2,
    'Hale PG independence base = +2');
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'federalism' }).totalBonus === 2,
    'Hale PG federalism base = +2');
  // vs Frail bumped LARGE in all 4 eras:
  for (const era of ['independence', 'federalism', 'nationalism', 'modern'] as Era[]) {
    const r = applyTraitElectionBonus(p, 'presGeneral', { era, opponentTraits: ['Frail'] });
    assert(r.totalBonus === 8, `Hale PG vs Frail (${era}) = +8 LARGE (item #3 1840 case; got ${r.totalBonus})`);
  }
  // Other contexts flat SMALL.
  for (const ctx of ['presPrimary', 'house', 'senatePre17', 'governor', 'internalParty'] as ElectionContext[]) {
    assert(applyTraitElectionBonus(p, ctx, { era: 'nationalism' }).totalBonus === 2,
      `Hale ${ctx} = +2`);
  }
}

// F.8 Likable + Charismatic stacking (Lincoln warm-not-magnetic vs Clay
// historian's two-axis case from spec H §F-MARQUEE-ATTRIBUTIONS).
{
  const p = mkPol(['Likable', 'Charismatic']);
  const r = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  // Likable +4 (base MEDIUM) + Charismatic +4 (PR4a MEDIUM) = +8.
  assert(r.totalBonus === 8, `Lincoln (Likable + Charismatic) PG = +8 stack (got ${r.totalBonus})`);
  assert(r.perTraitBreakdown.length === 2, 'breakdown has 2 entries for stack');
}

// F.9 Empty traits / politician with no PR4b traits — 0 contribution.
{
  const p = mkPol(['Charismatic']); // PR4a trait only
  // Charismatic PG = +4; no PR4b contribution.
  assert(applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' }).totalBonus === 4,
    'Politician with only PR4a Charismatic — PR4b adds nothing');
}

// -- G. Wound-grant 4-branch table via tryGrantTrait -------------------------
// Item #6 — Rev War wound-grant: stub d6, walk the 4 branches.
{
  // Branch 1: neither Hale nor Frail. RNG irrelevant.
  const p = mkPol(['Leadership']);
  stubbedRandom = () => 0.0;
  const r = tryGrantTrait(p, 'Frail');
  assert(r.granted === true && r.replaced === null,
    `Branch 1 (no Hale/Frail): { granted: true, replaced: null }`);
  assert(p.traits.length === 2 && p.traits.includes('Leadership') && p.traits.includes('Frail'),
    `Branch 1: traits become [Leadership, Frail]`);
}
{
  // Branch 2: Hale, no Frail, d6 >= 4 -> swap Hale -> Frail.
  const p = mkPol(['Leadership', 'Hale']);
  stubbedRandom = () => 0.99; // d(6) -> 6, >= 4 threshold
  const r = tryGrantTrait(p, 'Frail');
  assert(r.granted === true && r.replaced === 'Hale',
    `Branch 2 (Hale + d6=6): { granted: true, replaced: 'Hale' }`);
  assert(!p.traits.includes('Hale') && p.traits.includes('Frail'),
    `Branch 2: traits shed Hale, gain Frail`);
}
{
  // Branch 3: Hale, no Frail, d6 < 4 -> no-op, Hale holds.
  const p = mkPol(['Leadership', 'Hale']);
  stubbedRandom = () => 0.0; // d(6) -> 1, < 4
  const r = tryGrantTrait(p, 'Frail');
  assert(r.granted === false && r.replaced === null,
    `Branch 3 (Hale + d6=1): { granted: false, replaced: null }`);
  assert(p.traits.includes('Hale') && !p.traits.includes('Frail'),
    `Branch 3: traits stay [Leadership, Hale]`);
}
{
  // Branch 4: already Frail -> silent dedupe.
  const p = mkPol(['Frail']);
  stubbedRandom = () => 0.99;
  const r = tryGrantTrait(p, 'Frail');
  assert(r.granted === false && r.replaced === null,
    `Branch 4 (already Frail): silent dedupe`);
  assert(p.traits.length === 1 && p.traits.includes('Frail'),
    `Branch 4: no double-push`);
}

// Boundary: d6 == 4 (threshold). 0.5 -> floor(0.5*6)+1 = 4 == threshold (>=).
{
  const p = mkPol(['Hale']);
  stubbedRandom = () => 0.5;
  const r = tryGrantTrait(p, 'Frail');
  assert(r.granted === true && r.replaced === 'Hale',
    `Boundary d6=4 (threshold): swap Hale -> Frail`);
}
// And the same for any of the 4 new symmetric pair seedings.
for (const [a, b] of NEW_PAIRS) {
  // Conflict held + high d6 -> swap a (held b removed).
  const p = mkPol([b]);
  stubbedRandom = () => 0.99;
  const r = tryGrantTrait(p, a);
  assert(r.granted === true && r.replaced === b,
    `Conflict-pair (${a} vs ${b}) on d6=6 swaps`);
  // Reverse direction.
  const p2 = mkPol([a]);
  stubbedRandom = () => 0.99;
  const r2 = tryGrantTrait(p2, b);
  assert(r2.granted === true && r2.replaced === a,
    `Conflict-pair (${b} vs ${a}) on d6=6 swaps`);
}

// -- H. Dataset regression: no within-pair co-occurrence across all 18k+ rows
// Re-confirm builder's check.
{
  let datasetPolCount = 0;
  let withinPairViolations: string[] = [];
  try {
    const raw = readFileSync('/home/user/AMPU/public/standard-draft-classes.json', 'utf8');
    const arr = JSON.parse(raw) as { firstName: string; lastName: string; traits: string[] }[];
    datasetPolCount = arr.length;
    for (const p of arr) {
      for (const [a, b] of NEW_PAIRS) {
        if (p.traits.includes(a) && p.traits.includes(b)) {
          withinPairViolations.push(`${p.firstName} ${p.lastName}: ${a}+${b}`);
        }
      }
    }
    assert(withinPairViolations.length === 0,
      `Dataset within-pair co-occurrence: 0 (got ${withinPairViolations.length})`);
    if (withinPairViolations.length > 0) {
      for (const v of withinPairViolations.slice(0, 6)) {
        contractFailures.push(`  dataset violation: ${v}`);
      }
    }
  } catch (e) {
    contractFail++;
    contractFailures.push(`Dataset read/parse failed: ${(e as Error).message.slice(0, 100)}`);
  }
  console.log(`Dataset scan: ${datasetPolCount} politicians, ${withinPairViolations.length} within-pair violations`);
}

stubbedRandom = realRandom;
Math.random = realRandom;

console.log(`Contract tests: ${contractPass} passed, ${contractFail} failed`);
if (contractFailures.length) {
  for (const f of contractFailures.slice(0, 30)) console.log(`  FAIL: ${f}`);
}

// ---------------------------------------------------------------------------
// Part 2: engine scenario drive
// ---------------------------------------------------------------------------

const use1856 = process.argv.includes('--1856');
const SLUG = use1856 ? '1856' : '1772';
const OUT = `/home/user/AMPU/docs/playtest/trait-pass-b-new-traits/engine-trace-${SLUG}.json`;

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

// Initial trait counts for the 7 new traits + Frail (reference).
const traitCountAt = (s: FullGameSnapshot, t: Trait): number =>
  s.politicians.filter((p) => p.traits.includes(t)).length;
const TRACKED: Trait[] = [...PR4B_TRAITS, 'Frail', 'Celebrity', 'Charismatic'];
const initialTraitCounts: Record<string, number> = {};
for (const t of TRACKED) initialTraitCounts[t] = traitCountAt(snap, t);
console.log(`Initial trait counts:`, initialTraitCounts);

// Drive ~600 phases. Skip Vite-env-touching phases per playbook.
const skipPhases = new Set(['2.4.2', '2.4.3']);
let phasesRun = 0;
let skippedCount = 0;
const errorPhases: { phase: string; err: string }[] = [];
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
    errorPhases.push({ phase: snap.game.phaseId, err: msg });
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
  for (const e of errorPhases.slice(0, 5)) console.log(`  [${e.phase}] ${e.err}`);
}

// Final trait counts.
const finalTraitCounts: Record<string, number> = {};
for (const t of TRACKED) finalTraitCounts[t] = traitCountAt(snap, t);
console.log(`Final trait counts:`, finalTraitCounts);
console.log(`Trait deltas:`);
for (const t of TRACKED) {
  const a = initialTraitCounts[t];
  const b = finalTraitCounts[t];
  if (a !== b) console.log(`  ${t}: ${a} -> ${b} (Δ ${b - a})`);
}

// ---------------------------------------------------------------------------
// Part 3: event classification + trace JSON
// ---------------------------------------------------------------------------

// PR4a's summary-log shape: "<Name>'s traits net ±X in the <race> race — <parts>."
// To count per-NEW-trait fires, we filter summary lines containing the trait name
// in the parentheses-tagged breakdown parts.
const SUMMARY_RX = /'s traits net [-+]?\d+ in the .+ race —/;
const allSummary = snap.events.filter((e) => SUMMARY_RX.test(e.text ?? ''));

// Context regexes (lifted verbatim from PR4a smoke).
const presGenRx = /traits net [-+]?\d+ in the presidential general race/;
const governorRx = /traits net [-+]?\d+ in the [A-Z]{2,3} governor race/;
const senateRx = /traits net [-+]?\d+ in the [A-Z]{2,3} senate race/;
const houseRx = /traits net [-+]?\d+ in the [A-Z]{2,3} house race/;
const primaryRx = /traits net [-+]?\d+ in the (Democratic|Republican) primary race/;
const leadershipRx = /traits net [-+]?\d+ in the .+ leadership race/;

// Per-NEW-trait per-context count: for each new trait, count summary lines
// referencing that trait in the breakdown.
type PerCtxCount = {
  presGeneral: number; presPrimary: number; house: number;
  senatePre17: number; governor: number; internalParty: number;
  total: number;
};
function emptyCtxCount(): PerCtxCount {
  return { presGeneral: 0, presPrimary: 0, house: 0, senatePre17: 0, governor: 0, internalParty: 0, total: 0 };
}
function classifyCtx(text: string): keyof PerCtxCount | null {
  if (presGenRx.test(text)) return 'presGeneral';
  if (primaryRx.test(text)) return 'presPrimary';
  if (houseRx.test(text)) return 'house';
  if (senateRx.test(text)) return 'senatePre17';
  if (governorRx.test(text)) return 'governor';
  if (leadershipRx.test(text)) return 'internalParty';
  return null;
}

const perTraitCounts: Record<string, PerCtxCount> = {};
for (const t of PR4B_TRAITS) perTraitCounts[t] = emptyCtxCount();

// Trait name appears in summary breakdown lines. Care with 'Two-Faced' (hyphen).
const traitNameRx: Record<string, RegExp> = {
  Likable: /\bLikable\b/,
  Uncharismatic: /\bUncharismatic\b/,
  Cosmopolitan: /\bCosmopolitan\b/,
  Provincial: /\bProvincial\b/,
  'Two-Faced': /Two-Faced/,
  Predictable: /\bPredictable\b/,
  Hale: /\bHale\b/,
};

for (const e of allSummary) {
  const text = e.text ?? '';
  const ctx = classifyCtx(text);
  if (!ctx) continue;
  for (const t of PR4B_TRAITS) {
    if (traitNameRx[t].test(text)) {
      perTraitCounts[t][ctx]++;
      perTraitCounts[t].total++;
    }
  }
}

// Per-context aggregates over PR4b new-trait surface area.
const presGenAll = snap.events.filter((e) => presGenRx.test(e.text ?? ''));
const governorAll = snap.events.filter((e) => governorRx.test(e.text ?? ''));
const senateAll = snap.events.filter((e) => senateRx.test(e.text ?? ''));
const houseAll = snap.events.filter((e) => houseRx.test(e.text ?? ''));
const primaryAll = snap.events.filter((e) => primaryRx.test(e.text ?? ''));
const leadershipAll = snap.events.filter((e) => leadershipRx.test(e.text ?? ''));

console.log(`\nPR4b new-trait per-context counts (${SLUG}):`);
console.log(`  total trait-summary lines: ${allSummary.length}`);
for (const t of PR4B_TRAITS) {
  const c = perTraitCounts[t];
  console.log(
    `  ${t}: total=${c.total}  PG=${c.presGeneral}  Pri=${c.presPrimary}  ` +
    `House=${c.house}  Sen=${c.senatePre17}  Gov=${c.governor}  IntParty=${c.internalParty}`,
  );
}
console.log(`Aggregate counts by context:`);
console.log(`  presGeneral:   ${presGenAll.length}`);
console.log(`  governor:      ${governorAll.length}`);
console.log(`  senatePre17:   ${senateAll.length}`);
console.log(`  house:         ${houseAll.length}`);
console.log(`  presPrimary:   ${primaryAll.length}`);
console.log(`  internalParty: ${leadershipAll.length}`);

// Hale-vs-Frail headline: bumped LARGE = +8 in presGeneral.
const halevsFrailBumped = presGenAll.filter((e) => /Hale \(\+8\)/.test(e.text ?? ''));
console.log(`\nHale (+8) presGeneral bumps (1840 archetype, item #3): ${halevsFrailBumped.length}`);
for (const e of halevsFrailBumped.slice(0, 4)) console.log(`  [${e.year}] ${e.text}`);

// Two-Faced -LARGE in presPrimary (item #5).
const twoFacedPrimary = primaryAll.filter((e) => /Two-Faced \(-8\)/.test(e.text ?? ''));
console.log(`\nTwo-Faced (-8) presPrimary (item #5 -LARGE convention burn): ${twoFacedPrimary.length}`);
for (const e of twoFacedPrimary.slice(0, 4)) console.log(`  [${e.year}] ${e.text}`);

// Likable opp-conditional (+8) vs Unlikable in presGeneral.
const likableBumped = presGenAll.filter((e) => /Likable \(\+8\)/.test(e.text ?? ''));
console.log(`\nLikable (+8) presGeneral bumps (vs Unlikable): ${likableBumped.length}`);
for (const e of likableBumped.slice(0, 3)) console.log(`  [${e.year}] ${e.text}`);

// Uncharismatic -MEDIUM vs Charismatic in presGeneral (-4).
const unchBumped = presGenAll.filter((e) => /Uncharismatic \(-4\)/.test(e.text ?? ''));
console.log(`\nUncharismatic (-4) presGeneral bumps (vs Charismatic): ${unchBumped.length}`);
for (const e of unchBumped.slice(0, 3)) console.log(`  [${e.year}] ${e.text}`);

// Internal-party +MEDIUM bumps for Predictable / Likable (item #4 headline).
const internalMedium = leadershipAll.filter((e) =>
  /(Predictable|Likable) \(\+4\)/.test(e.text ?? ''),
);
console.log(`\nInternal-party Predictable/Likable (+4) MEDIUM bumps (item #4): ${internalMedium.length}`);
for (const e of internalMedium.slice(0, 3)) console.log(`  [${e.year}] ${e.text}`);

// Provincial sign-flip: POSITIVE +M in house/governor logs.
const provincialHousePos = houseAll.filter((e) => /Provincial \(\+/.test(e.text ?? ''));
console.log(`\nProvincial (+...) house race POSITIVE sign-flip (per item #4 brief): ${provincialHousePos.length}`);
for (const e of provincialHousePos.slice(0, 3)) console.log(`  [${e.year}] ${e.text}`);

// Cosmopolitan in PG: era-scaled (+2 in 1772, +4 in 1856).
const cosmoPgPlus2 = presGenAll.filter((e) => /Cosmopolitan \(\+2\)/.test(e.text ?? ''));
const cosmoPgPlus4 = presGenAll.filter((e) => /Cosmopolitan \(\+4\)/.test(e.text ?? ''));
console.log(`\nCosmopolitan PG era-scaling: +2 fires (independence/federalism)=${cosmoPgPlus2.length}, ` +
  `+4 fires (nationalism/modern)=${cosmoPgPlus4.length}`);

// Wound-grant logs in 2.7.2 (Hale resistance OR Hale shed). Should be 0 if no Rev War fired.
const woundShedHale = snap.events.filter((e) => /shakes off their Hale constitution/.test(e.text ?? ''));
const woundHoldsHale = snap.events.filter((e) => /Hale constitution shrugs off/.test(e.text ?? ''));
const woundFrailPlain = snap.events.filter((e) => /sustains a wound — they are Frail now/.test(e.text ?? ''));
console.log(`\nRev War wound-grant logs (item #6 4-branch table):`);
console.log(`  Hale shed -> Frail (branch 2): ${woundShedHale.length}`);
console.log(`  Hale resists (branch 3):       ${woundHoldsHale.length}`);
console.log(`  Plain Frail (branch 1):        ${woundFrailPlain.length}`);
console.log(`  (Branch 4 — already-Frail dedupe — silent; no log.)`);

// Hale old-age decay (2.4.1 PR3 line shape).
const haleAgeDecay = snap.events.filter((e) =>
  /has lost their Hale step — the years catch up/.test(e.text ?? ''),
);
console.log(`\nHale old-age decay (2.4.1, item #7): ${haleAgeDecay.length}`);
for (const e of haleAgeDecay.slice(0, 4)) console.log(`  [${e.year}] ${e.text}`);

// 1772 era-scaling check (item #8): Cosmopolitan/Provincial PG SMALL in independence
// vs MEDIUM in nationalism.
const provPgSmall = presGenAll.filter((e) => /Provincial \(-2\)/.test(e.text ?? ''));
const provPgMed = presGenAll.filter((e) => /Provincial \(-4\)/.test(e.text ?? ''));
console.log(`\nProvincial PG era-scaling: -2 fires (1772-era)=${provPgSmall.length}, ` +
  `-4 fires (nationalism)=${provPgMed.length}`);

// Sample 6 PG / Pri / Internal raw lines.
const sample = (arr: typeof snap.events, n: number) => arr.slice(0, n);
function dumpSample(label: string, arr: typeof snap.events) {
  if (arr.length === 0) {
    console.log(`\n${label} samples: (none)`);
    return;
  }
  console.log(`\n${label} samples (first 4):`);
  for (const e of sample(arr, 4)) console.log(`  [${e.year} ${e.phase}] ${e.text}`);
}
dumpSample('presGeneral (all)', presGenAll);
dumpSample('presPrimary (all)', primaryAll);
dumpSample('internalParty (all)', leadershipAll);

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
  pr4bCounts: {
    summaryLinesTotal: allSummary.length,
    perTraitPerContext: perTraitCounts,
    aggregateByContext: {
      presGeneral: presGenAll.length,
      presPrimary: primaryAll.length,
      house: houseAll.length,
      senatePre17: senateAll.length,
      governor: governorAll.length,
      internalParty: leadershipAll.length,
    },
    headlineCases: {
      halevsFrailLargeBumps: halevsFrailBumped.length,
      twoFacedPrimaryLarge: twoFacedPrimary.length,
      likableLargeBumps: likableBumped.length,
      uncharismaticMediumBumps: unchBumped.length,
      internalPartyPredictableLikableMedium: internalMedium.length,
      provincialHousePositive: provincialHousePos.length,
      cosmopolitanPgSmall: cosmoPgPlus2.length,
      cosmopolitanPgMedium: cosmoPgPlus4.length,
      provincialPgSmall: provPgSmall.length,
      provincialPgMedium: provPgMed.length,
    },
    revWarWoundGrant: {
      branch1PlainFrail: woundFrailPlain.length,
      branch2HaleShed: woundShedHale.length,
      branch3HaleResists: woundHoldsHale.length,
    },
    haleOldAgeDecay: haleAgeDecay.length,
  },
  initialTraitCounts,
  finalTraitCounts,
  samples: {
    halevsFrail: sample(halevsFrailBumped, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    twoFacedPrimary: sample(twoFacedPrimary, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    likableBumped: sample(likableBumped, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    internalPartyMedium: sample(internalMedium, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    provincialHousePos: sample(provincialHousePos, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    cosmopolitanPgSmall: sample(cosmoPgPlus2, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    cosmopolitanPgMedium: sample(cosmoPgPlus4, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    haleOldAgeDecay: sample(haleAgeDecay, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    revWarWoundShed: sample(woundShedHale, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    revWarWoundResist: sample(woundHoldsHale, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    presGeneral: sample(presGenAll, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    presPrimary: sample(primaryAll, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    internalParty: sample(leadershipAll, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
  },
};
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(`\nWrote ${OUT}`);

if (contractFail > 0) {
  console.log(`\nFAIL: ${contractFail} contract assertions failed.`);
  process.exit(1);
}
console.log(`\nDONE.`);
