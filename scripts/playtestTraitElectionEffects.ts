// PR4a engine playtest — drives 1772 (default) and 1856 (--1856) scenarios
// through ~600 phases, asserts the contract of `applyTraitElectionBonus` /
// `composeTraitSummary` / `snapEra` / `TRAIT_ELECTION_BANDS` /
// `TRAIT_ELECTION_EFFECTS`, then counts the new "<Name>'s traits net ±X in
// the <race> race —" log lines by election context.
//
// Mirrors scripts/playtestTraitLoss.ts (PR3 — most complete in-repo template):
//   Part 1: Contract tests with stubbed Math.random (deterministic).
//   Part 2: Engine scenario drive (auto-resolve player input).
//   Part 3: Event classification + trace JSON to docs/playtest/<slug>/.
//
// Run BOTH variants for full coverage (Domestic Apathy era-scaled rows only
// fire when the live snap.game.currentEra matches):
//   npx tsx scripts/playtestTraitElectionEffects.ts          # 1772 default
//   npx tsx scripts/playtestTraitElectionEffects.ts --1856   # 1856 path

// Stub import.meta.env for Node (Vite injects this in the browser).
// @ts-ignore
if (typeof import.meta.env === 'undefined') (import.meta as any).env = { DEV: false };

import { build1772Scenario } from '../src/data/scenario1772';
import { runCurrentPhase, advancePhase } from '../src/engine/engine';
import { simOneDraftPick, autoPickForPlayer } from '../src/engine/phaseRunners';
import {
  applyTraitElectionBonus,
  composeTraitSummary,
  snapEra,
} from '../src/engine/electionEffects';
import {
  TRAIT_ELECTION_BANDS,
  TRAIT_ELECTION_EFFECTS,
} from '../src/types';
import type {
  ElectionContext,
  Era,
  FullGameSnapshot,
  Politician,
  Trait,
  TraitElectionRule,
} from '../src/types';
import { writeFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Part 1: contract tests (stubbed RNG — though this helper is pure, stubbing
// keeps the pattern consistent with PR3 and guards against future regressions).
// ---------------------------------------------------------------------------

const realRandom = Math.random;
let stubbedRandom: () => number = realRandom;
Math.random = () => stubbedRandom();

function mkPol(traits: Trait[]): Politician {
  return { traits } as unknown as Politician;
}

let contractPass = 0;
let contractFail = 0;
const contractFailures: string[] = [];
function assert(cond: boolean, label: string) {
  if (cond) contractPass++;
  else { contractFail++; contractFailures.push(label); }
}

// -- 1. TRAIT_ELECTION_BANDS values exact (spec AC #3, brief PM rec) --------
assert(TRAIT_ELECTION_BANDS.SMALL === 2, 'TRAIT_ELECTION_BANDS.SMALL === 2');
assert(TRAIT_ELECTION_BANDS.MEDIUM === 4, 'TRAIT_ELECTION_BANDS.MEDIUM === 4');
assert(TRAIT_ELECTION_BANDS.LARGE === 8, 'TRAIT_ELECTION_BANDS.LARGE === 8');

// -- 2. TRAIT_ELECTION_EFFECTS const integrity -------------------------------

// All 15 PR4a traits present at least once.
const PR4A_TRAITS: Trait[] = [
  'Charismatic', 'Integrity', 'Debater', 'Propagandist', 'Harmonious',
  'Magician', 'Unlikable', 'Puritan', 'Numberfudger', 'Scandalous',
  'Controversial', 'Obscure', 'Domestic Apathy', 'Carpetbagger', 'Outsider',
];
for (const t of PR4A_TRAITS) {
  const has = TRAIT_ELECTION_EFFECTS.some((r) => r.trait === t);
  assert(has, `TRAIT_ELECTION_EFFECTS contains trait ${t}`);
}

// No rule rows for traits OUTSIDE the PR4a 15.
const tableTraits = new Set(TRAIT_ELECTION_EFFECTS.map((r) => r.trait));
assert(tableTraits.size === 15, `TRAIT_ELECTION_EFFECTS covers exactly 15 traits (got ${tableTraits.size})`);
for (const t of tableTraits) {
  assert(PR4A_TRAITS.includes(t as Trait), `Table trait ${t} is in PR4a list`);
}

// Per-trait, the set of contexts covered matches the spec table.
function contextsOf(trait: Trait): Set<ElectionContext> {
  return new Set(
    TRAIT_ELECTION_EFFECTS.filter((r) => r.trait === trait).map((r) => r.context),
  );
}
const SIX_CTXS: ElectionContext[] = ['presGeneral', 'presPrimary', 'house', 'senatePre17', 'governor', 'internalParty'];

const traitCtxExpected: Record<string, ElectionContext[]> = {
  Charismatic:     [...SIX_CTXS],
  Integrity:       [...SIX_CTXS],
  Debater:         [...SIX_CTXS],
  Propagandist:    [...SIX_CTXS],
  Harmonious:      [...SIX_CTXS],
  Magician:        [...SIX_CTXS],
  Unlikable:       [...SIX_CTXS],
  Puritan:         [...SIX_CTXS],
  Numberfudger:    ['presGeneral', 'house', 'governor'],            // no internal/senate/primary
  Scandalous:      [...SIX_CTXS],
  Controversial:   [...SIX_CTXS],
  Obscure:         ['presGeneral', 'presPrimary', 'house', 'governor', 'internalParty'], // no senatePre17
  'Domestic Apathy': ['presGeneral', 'house', 'governor'],          // no primary/senate/internal
  Carpetbagger:    ['house', 'senatePre17', 'governor'],            // state-level only
  Outsider:        [...SIX_CTXS],
};
for (const [trait, expectedList] of Object.entries(traitCtxExpected)) {
  const got = contextsOf(trait as Trait);
  const expected = new Set(expectedList);
  let match = got.size === expected.size;
  for (const c of expected) if (!got.has(c)) match = false;
  assert(match, `${trait} contexts match spec table (got ${[...got].join(',')})`);
}

// Opponent-conditional rows ONLY in presGeneral / house / governor (AC #15).
const OPP_OK: Set<ElectionContext> = new Set(['presGeneral', 'house', 'governor']);
for (const row of TRAIT_ELECTION_EFFECTS) {
  if (row.opponentConditional !== undefined) {
    assert(OPP_OK.has(row.context),
      `Opp-conditional row only in presGeneral/house/governor (${row.trait}/${row.context} has opp)`);
  }
}

// Era field undefined for all rows EXCEPT Domestic Apathy presGeneral.
for (const row of TRAIT_ELECTION_EFFECTS) {
  const isDA_PG = row.trait === 'Domestic Apathy' && row.context === 'presGeneral';
  if (row.era !== undefined) {
    assert(isDA_PG, `Era field only on Domestic Apathy presGeneral (got ${row.trait}/${row.context}/${row.era})`);
  } else {
    if (isDA_PG) {
      assert(false, `Domestic Apathy presGeneral should always carry era (row has undefined)`);
    }
  }
}
// 4 era-split rows for Domestic Apathy presGeneral.
const daPgRows = TRAIT_ELECTION_EFFECTS.filter(
  (r) => r.trait === 'Domestic Apathy' && r.context === 'presGeneral',
);
assert(daPgRows.length === 4, `Domestic Apathy presGeneral has 4 era-split rows (got ${daPgRows.length})`);
const daEraToMag: Record<string, number> = {};
for (const r of daPgRows) daEraToMag[r.era as string] = r.magnitude;
assert(daEraToMag['independence'] === -TRAIT_ELECTION_BANDS.SMALL, 'DA presGeneral independence = -SMALL');
assert(daEraToMag['federalism'] === -TRAIT_ELECTION_BANDS.SMALL, 'DA presGeneral federalism = -SMALL');
assert(daEraToMag['nationalism'] === -TRAIT_ELECTION_BANDS.MEDIUM, 'DA presGeneral nationalism = -MEDIUM');
assert(daEraToMag['modern'] === -TRAIT_ELECTION_BANDS.MEDIUM, 'DA presGeneral modern = -MEDIUM');

// -- 3. applyTraitElectionBonus resolution ----------------------------------

// 3a. Trait NOT held -> no row contribution.
{
  const p = mkPol([]);
  for (const ctx of SIX_CTXS) {
    const r = applyTraitElectionBonus(p, ctx, { era: 'nationalism' });
    assert(r.totalBonus === 0, `empty traits + ${ctx} -> 0`);
    assert(r.perTraitBreakdown.length === 0, `empty traits + ${ctx} -> empty breakdown`);
  }
}

// 3b. Trait held + matching context, no opp-conditional -> magnitude added.
{
  // Loop the full grid: each row, build politician with just that trait.
  for (const row of TRAIT_ELECTION_EFFECTS) {
    if (row.opponentConditional !== undefined) continue; // tested in 3c
    if (row.era !== undefined) continue; // tested in 3e
    const p = mkPol([row.trait]);
    const r = applyTraitElectionBonus(p, row.context, { era: 'nationalism' });
    assert(r.totalBonus === row.magnitude,
      `${row.trait}+${row.context} -> ${r.totalBonus}, expected ${row.magnitude}`);
    assert(r.perTraitBreakdown.length === 1
        && r.perTraitBreakdown[0].trait === row.trait
        && r.perTraitBreakdown[0].bonus === row.magnitude,
      `${row.trait}+${row.context} breakdown shape`);
  }
}

// 3c. Trait held + matching context + opp-conditional fires -> bumpedMagnitude REPLACES base.
//     Integrity vs Scandalous: presGeneral bumps SMALL -> MEDIUM.
{
  const p = mkPol(['Integrity']);
  const r = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Scandalous'] });
  assert(r.totalBonus === TRAIT_ELECTION_BANDS.MEDIUM,
    `Integrity vs Scandalous presGeneral -> MEDIUM (got ${r.totalBonus})`);
}
// vs Controversial (also in ifOpponentHas)
{
  const p = mkPol(['Integrity']);
  const r = applyTraitElectionBonus(p, 'governor', { era: 'nationalism', opponentTraits: ['Controversial'] });
  assert(r.totalBonus === TRAIT_ELECTION_BANDS.MEDIUM,
    `Integrity vs Controversial governor -> MEDIUM (got ${r.totalBonus})`);
}
// vs Corrupt (third in list)
{
  const p = mkPol(['Integrity']);
  const r = applyTraitElectionBonus(p, 'house', { era: 'nationalism', opponentTraits: ['Corrupt'] });
  assert(r.totalBonus === TRAIT_ELECTION_BANDS.MEDIUM,
    `Integrity vs Corrupt house -> MEDIUM (got ${r.totalBonus})`);
}
// Scandalous bumped vs Integrity
{
  const p = mkPol(['Scandalous']);
  const r = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Integrity'] });
  assert(r.totalBonus === -TRAIT_ELECTION_BANDS.LARGE,
    `Scandalous vs Integrity presGeneral -> -LARGE (got ${r.totalBonus})`);
}
// Controversial bumped vs Integrity
{
  const p = mkPol(['Controversial']);
  const r = applyTraitElectionBonus(p, 'governor', { era: 'nationalism', opponentTraits: ['Integrity'] });
  assert(r.totalBonus === -TRAIT_ELECTION_BANDS.LARGE,
    `Controversial vs Integrity governor -> -LARGE (got ${r.totalBonus})`);
}
// Unlikable bumped vs Charismatic (presGeneral only — the one Unlikable opp row)
{
  const p = mkPol(['Unlikable']);
  const r = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Charismatic'] });
  assert(r.totalBonus === -TRAIT_ELECTION_BANDS.LARGE,
    `Unlikable vs Charismatic presGeneral -> -LARGE (got ${r.totalBonus})`);
}

// 3d. Trait held + matching context + opp-conditional defined but NO match -> base magnitude.
{
  const p = mkPol(['Integrity']);
  const r = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Charismatic'] });
  assert(r.totalBonus === TRAIT_ELECTION_BANDS.SMALL,
    `Integrity vs clean opp presGeneral -> base SMALL (got ${r.totalBonus})`);
}
{
  const p = mkPol(['Unlikable']);
  const r = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Integrity'] });
  assert(r.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM,
    `Unlikable vs Integrity (not Charismatic) presGeneral -> base -MEDIUM (got ${r.totalBonus})`);
}
{
  // Opp-conditional in senatePre17 / presPrimary / internalParty does NOT fire (AC #15).
  const p = mkPol(['Integrity']);
  const rSenate = applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism', opponentTraits: ['Scandalous'] });
  assert(rSenate.totalBonus === TRAIT_ELECTION_BANDS.SMALL,
    `Integrity vs Scandalous senatePre17 -> base SMALL (no bump in senate; got ${rSenate.totalBonus})`);
  const rPrim = applyTraitElectionBonus(p, 'presPrimary', { era: 'nationalism', opponentTraits: ['Scandalous'] });
  assert(rPrim.totalBonus === TRAIT_ELECTION_BANDS.SMALL,
    `Integrity vs Scandalous presPrimary -> base SMALL (no bump in primary; got ${rPrim.totalBonus})`);
  const rInt = applyTraitElectionBonus(p, 'internalParty', { era: 'nationalism', opponentTraits: ['Scandalous'] });
  assert(rInt.totalBonus === TRAIT_ELECTION_BANDS.SMALL,
    `Integrity vs Scandalous internalParty -> base SMALL (no bump in internal; got ${rInt.totalBonus})`);
}

// 3e. Era-split rows: only matching snap.game.currentEra row contributes.
{
  const p = mkPol(['Domestic Apathy']);
  const rInd = applyTraitElectionBonus(p, 'presGeneral', { era: 'independence' });
  assert(rInd.totalBonus === -TRAIT_ELECTION_BANDS.SMALL,
    `DA presGeneral independence -> -SMALL (got ${rInd.totalBonus})`);
  const rFed = applyTraitElectionBonus(p, 'presGeneral', { era: 'federalism' });
  assert(rFed.totalBonus === -TRAIT_ELECTION_BANDS.SMALL,
    `DA presGeneral federalism -> -SMALL (got ${rFed.totalBonus})`);
  const rNat = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  assert(rNat.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM,
    `DA presGeneral nationalism -> -MEDIUM (got ${rNat.totalBonus})`);
  const rMod = applyTraitElectionBonus(p, 'presGeneral', { era: 'modern' });
  assert(rMod.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM,
    `DA presGeneral modern -> -MEDIUM (got ${rMod.totalBonus})`);
  // Non-presGeneral DA: era-independent flat MEDIUM on house+governor; nothing elsewhere.
  const rHouse = applyTraitElectionBonus(p, 'house', { era: 'independence' });
  assert(rHouse.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM,
    `DA house any-era -> -MEDIUM (got ${rHouse.totalBonus})`);
  const rGov = applyTraitElectionBonus(p, 'governor', { era: 'nationalism' });
  assert(rGov.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM,
    `DA governor any-era -> -MEDIUM (got ${rGov.totalBonus})`);
  const rPrim = applyTraitElectionBonus(p, 'presPrimary', { era: 'nationalism' });
  assert(rPrim.totalBonus === 0, `DA presPrimary -> 0 (no row; got ${rPrim.totalBonus})`);
  const rSen = applyTraitElectionBonus(p, 'senatePre17', { era: 'nationalism' });
  assert(rSen.totalBonus === 0, `DA senatePre17 -> 0 (no row; got ${rSen.totalBonus})`);
  const rIntp = applyTraitElectionBonus(p, 'internalParty', { era: 'nationalism' });
  assert(rIntp.totalBonus === 0, `DA internalParty -> 0 (no row; got ${rIntp.totalBonus})`);
}

// 3f. Politician with multiple PR4a traits sums correctly (governor MEDIUM+SMALL+SMALL = 8).
{
  const p = mkPol(['Charismatic', 'Integrity', 'Harmonious']);
  const r = applyTraitElectionBonus(p, 'governor', { era: 'nationalism' });
  // Charismatic gov MEDIUM (4) + Integrity gov SMALL (2) + Harmonious gov SMALL (2) = 8
  assert(r.totalBonus === 8, `Charismatic+Integrity+Harmonious governor -> +8 (got ${r.totalBonus})`);
  assert(r.perTraitBreakdown.length === 3, `breakdown has 3 entries (got ${r.perTraitBreakdown.length})`);
}
// Worst-case stacking spec scenario: Scandalous + Controversial + Unlikable
// vs (Integrity + Charismatic) opponent in presGeneral -> -24.
{
  const p = mkPol(['Scandalous', 'Controversial', 'Unlikable']);
  const r = applyTraitElectionBonus(p, 'presGeneral', {
    era: 'nationalism',
    opponentTraits: ['Integrity', 'Charismatic'],
  });
  assert(r.totalBonus === -24,
    `Worst-case stacking presGeneral -> -24 (got ${r.totalBonus})`);
}
// Multi-opponent / >2 field: opp-conditional fires if ANY opp matches.
{
  const p = mkPol(['Scandalous']);
  const r = applyTraitElectionBonus(p, 'presGeneral', {
    era: 'nationalism',
    opponentTraits: ['Charismatic', 'Integrity', 'Debater'],
  });
  assert(r.totalBonus === -TRAIT_ELECTION_BANDS.LARGE,
    `Scandalous + multi-opp containing Integrity presGeneral -> -LARGE (got ${r.totalBonus})`);
}

// 3g. Empty trait list -> 0 / empty (re-cover with explicit opp).
{
  const p = mkPol([]);
  const r = applyTraitElectionBonus(p, 'presGeneral', {
    era: 'nationalism',
    opponentTraits: ['Charismatic', 'Integrity'],
  });
  assert(r.totalBonus === 0 && r.perTraitBreakdown.length === 0,
    'empty traits + opp still -> 0');
}

// -- 4. composeTraitSummary resolution --------------------------------------

// 4a. Empty breakdown -> null.
assert(composeTraitSummary('Alice Smith', 'NY governor', []) === null,
  'composeTraitSummary empty breakdown -> null');

// 4b. Single positive trait -> includes positive section, no negative.
{
  const s = composeTraitSummary('Bob Jones', 'governor', [{ trait: 'Charismatic', bonus: 4 }]);
  assert(s !== null && s.includes('Charismatic (+4)'), 'positive includes Charismatic (+4)');
  assert(s !== null && /traits net \+4 in the governor race/.test(s), 'positive sign + race label');
  assert(s !== null && !/\(-\d+\)/.test(s), 'positive has no negative section');
}

// 4c. Single negative trait -> includes negative section, no positive.
{
  const s = composeTraitSummary('Carol Doe', 'NY house',
    [{ trait: 'Scandalous', bonus: -4 }]);
  assert(s !== null && s.includes('Scandalous (-4)'), 'negative includes Scandalous (-4)');
  assert(s !== null && /traits net -4 in the NY house race/.test(s),
    `negative sign correct: got ${s}`);
  assert(s !== null && !/\(\+\d+\)/.test(s), 'negative has no positive section');
}

// 4d. Mixed: both sections present, correct ± total.
{
  const s = composeTraitSummary('Dora Lee', 'presidential general', [
    { trait: 'Charismatic', bonus: 4 },
    { trait: 'Integrity', bonus: 2 },
    { trait: 'Scandalous', bonus: -8 },
  ]);
  // sum = -2 -> "traits net -2", parts joined by " / ".
  assert(s !== null && /traits net -2 in the presidential general race/.test(s),
    `mixed sum: got ${s}`);
  assert(s !== null && s.includes('Charismatic, Integrity (+6)'), 'mixed positives joined');
  assert(s !== null && s.includes('Scandalous (-8)'), 'mixed negatives joined');
  assert(s !== null && s.includes(' / '), 'mixed sections joined by " / "');
}

// -- 5. Sign-flip spot tests (Outsider, Obscure dark-horse) -----------------
{
  const p = mkPol(['Outsider']);
  const rGen = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  const rPrim = applyTraitElectionBonus(p, 'presPrimary', { era: 'nationalism' });
  assert(rGen.totalBonus === TRAIT_ELECTION_BANDS.SMALL,
    `Outsider presGeneral -> +SMALL (got ${rGen.totalBonus})`);
  assert(rPrim.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM,
    `Outsider presPrimary -> -MEDIUM (got ${rPrim.totalBonus})`);
}
{
  const p = mkPol(['Obscure']);
  const rGen = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  const rPrim = applyTraitElectionBonus(p, 'presPrimary', { era: 'nationalism' });
  assert(rGen.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM,
    `Obscure presGeneral -> -MEDIUM (got ${rGen.totalBonus})`);
  // Pierce-1852 dark-horse: positive in presPrimary.
  assert(rPrim.totalBonus === TRAIT_ELECTION_BANDS.SMALL,
    `Obscure presPrimary (Pierce) -> +SMALL (got ${rPrim.totalBonus})`);
}

// -- 6. snapEra derivation (helper exists; engine doesn't use it but the
//      export earns its keep). Stub snap.game.currentEra at each Era and assert. --
{
  const eras: Era[] = ['independence', 'federalism', 'nationalism', 'modern'];
  for (const e of eras) {
    const stub = { game: { currentEra: e } } as unknown as FullGameSnapshot;
    assert(snapEra(stub) === e, `snapEra returns ${e}`);
  }
}

// -- 7. Determinism: back-to-back calls return identical outputs. ------------
{
  const p = mkPol(['Charismatic', 'Integrity', 'Outsider']);
  const r1 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Scandalous'] });
  const r2 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism', opponentTraits: ['Scandalous'] });
  assert(r1.totalBonus === r2.totalBonus, 'determinism: totalBonus stable');
  assert(JSON.stringify(r1.perTraitBreakdown) === JSON.stringify(r2.perTraitBreakdown),
    'determinism: breakdown stable');
}

// -- 8. PR3 conflict-swap freshness contract (helper reads p.traits fresh) --
{
  const p = mkPol(['Unlikable']);
  const r1 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  assert(r1.totalBonus === -TRAIT_ELECTION_BANDS.MEDIUM, 'pre-swap Unlikable -> -MEDIUM');
  // Simulate a PR3 swap: Unlikable -> Charismatic (mutate p.traits in place).
  p.traits.length = 0;
  p.traits.push('Charismatic');
  const r2 = applyTraitElectionBonus(p, 'presGeneral', { era: 'nationalism' });
  assert(r2.totalBonus === TRAIT_ELECTION_BANDS.MEDIUM,
    `post-swap Charismatic -> +MEDIUM (helper reads p.traits fresh; got ${r2.totalBonus})`);
}

stubbedRandom = realRandom;
Math.random = realRandom;

console.log(`Contract tests: ${contractPass} passed, ${contractFail} failed`);
if (contractFailures.length) {
  for (const f of contractFailures) console.log(`  FAIL: ${f}`);
}

// ---------------------------------------------------------------------------
// Part 2: engine scenario drive (1772 default, 1856 with --1856)
// ---------------------------------------------------------------------------

const use1856 = process.argv.includes('--1856');
const SLUG = use1856 ? '1856' : '1772';
const OUT = `/home/user/AMPU/docs/playtest/trait-election-effects/engine-trace-${SLUG}.json`;

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

// Drive inaugural draft (1772 only seeds one) to completion.
runCurrentPhase(snap);
while (snap.game.draftRoundOrder.length > 0) {
  const r = simOneDraftPick(snap);
  if (r.needsPlayer) autoPickForPlayer(snap);
}
console.log(`Initial-phase draft complete: ${snap.politicians.length} politicians`);

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

// ---------------------------------------------------------------------------
// Part 3: event classification + trace JSON
// ---------------------------------------------------------------------------

// PR4a's summary-log shape from composeTraitSummary:
//   "{name}'s traits net {+|-}{N} in the {raceName} race — {parts}."
const SUMMARY_RX = /'s traits net [-+]?\d+ in the .+ race —/;

// Classify by raceName fragment in the trace.
//   presGeneral   -> " in the presidential general race —"
//   governor      -> " in the XX governor race —" (2-letter abbr)
//   senatePre17   -> " in the XX senate race —"
//   house         -> " in the XX house race —"
//   presPrimary   -> " in the Democratic primary race —" / "Republican primary race —"
//   internalParty -> " in the {factionName} leadership race —"
const presGenRx = /traits net [-+]?\d+ in the presidential general race/;
const governorRx = /traits net [-+]?\d+ in the [A-Z]{2,3} governor race/;
const senateRx = /traits net [-+]?\d+ in the [A-Z]{2,3} senate race/;
const houseRx = /traits net [-+]?\d+ in the [A-Z]{2,3} house race/;
const primaryRx = /traits net [-+]?\d+ in the (Democratic|Republican) primary race/;
const leadershipRx = /traits net [-+]?\d+ in the .+ leadership race/;

const allSummary = snap.events.filter((e) => SUMMARY_RX.test(e.text ?? ''));
const presGenEvents = snap.events.filter((e) => presGenRx.test(e.text ?? ''));
const governorEvents = snap.events.filter((e) => governorRx.test(e.text ?? ''));
const senateEvents = snap.events.filter((e) => senateRx.test(e.text ?? ''));
const houseEvents = snap.events.filter((e) => houseRx.test(e.text ?? ''));
const primaryEvents = snap.events.filter((e) => primaryRx.test(e.text ?? ''));
const leadershipEvents = snap.events.filter((e) => leadershipRx.test(e.text ?? ''));

console.log(`\nPR4a summary-log counts (${SLUG}):`);
console.log(`  total trait-summary lines: ${allSummary.length}`);
console.log(`  presGeneral:    ${presGenEvents.length}`);
console.log(`  governor:       ${governorEvents.length}`);
console.log(`  senatePre17:    ${senateEvents.length}`);
console.log(`  house:          ${houseEvents.length}`);
console.log(`  presPrimary:    ${primaryEvents.length}`);
console.log(`  internalParty:  ${leadershipEvents.length}`);

// Log-volume sanity: how many summary lines did each 2.9.6 cycle emit?
// Group house+senate events by year+phase pair.
type YPKey = string;
const cycleCounts: Record<YPKey, number> = {};
for (const e of [...houseEvents, ...senateEvents]) {
  const key = `${e.year}/${e.phase}`;
  cycleCounts[key] = (cycleCounts[key] ?? 0) + 1;
}
const cyclesSorted = Object.entries(cycleCounts).sort((a, b) => b[1] - a[1]);
console.log(`\n2.9.6 cycle log-volume (year -> trait-summary line count):`);
for (const [k, v] of cyclesSorted.slice(0, 8)) console.log(`  ${k}: ${v}`);
const avgPerCycle = cyclesSorted.length
  ? Math.round(cyclesSorted.reduce((s, [, v]) => s + v, 0) / cyclesSorted.length)
  : 0;
console.log(`  cycles observed: ${cyclesSorted.length}; avg per cycle: ${avgPerCycle}`);

// Sample 6 of each.
const sample = (arr: typeof snap.events, n: number) => arr.slice(0, n);
function dumpSample(label: string, arr: typeof snap.events) {
  if (arr.length === 0) {
    console.log(`\n${label} samples: (none)`);
    return;
  }
  console.log(`\n${label} samples (first 6):`);
  for (const e of sample(arr, 6)) console.log(`  [${e.year} ${e.phase}] ${e.text}`);
}
dumpSample('presGeneral', presGenEvents);
dumpSample('governor', governorEvents);
dumpSample('senatePre17', senateEvents);
dumpSample('house', houseEvents);
dumpSample('presPrimary', primaryEvents);
dumpSample('internalParty', leadershipEvents);

// Spot-check: any summary line containing two specific opp-conditional shapes.
// Look for any presGeneral line containing both Integrity and Scandalous (or
// Charismatic + Unlikable), which would indicate the opp-conditional bump
// triggered in a real engine race.
const oppCondCases = presGenEvents.filter(
  (e) => /Scandalous|Controversial/.test(e.text ?? '')
       && /\(-8\)/.test(e.text ?? ''), // bumped LARGE = 8 magnitude
);
console.log(`\npresGeneral lines showing opp-conditional bump magnitudes (|-8|): ${oppCondCases.length}`);
for (const e of oppCondCases.slice(0, 4)) console.log(`  [${e.year}] ${e.text}`);

const unlikableBumped = presGenEvents.filter(
  (e) => /Unlikable \(-8\)/.test(e.text ?? ''),
);
console.log(`presGeneral lines showing Unlikable (-8) bump: ${unlikableBumped.length}`);

// Era-specific spot: in 1772 run, DA presGeneral should be -2 (independence/federalism);
//                    in 1856 run, DA presGeneral should be -4 (nationalism).
const daPresGen = presGenEvents.filter((e) => /Domestic Apathy/.test(e.text ?? ''));
console.log(`presGeneral lines mentioning Domestic Apathy: ${daPresGen.length}`);
for (const e of daPresGen.slice(0, 4)) console.log(`  [${e.year}/${snap.game.currentEra}] ${e.text}`);

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
  pr4aCounts: {
    summaryLinesTotal: allSummary.length,
    presGeneral: presGenEvents.length,
    governor: governorEvents.length,
    senatePre17: senateEvents.length,
    house: houseEvents.length,
    presPrimary: primaryEvents.length,
    internalParty: leadershipEvents.length,
    oppCondBumpsObserved: oppCondCases.length,
    unlikableLargeBumpsObserved: unlikableBumped.length,
    domesticApathyPresGenLines: daPresGen.length,
  },
  cycleLogVolume: {
    cyclesObserved: cyclesSorted.length,
    avgSummaryLinesPerCycle: avgPerCycle,
    busiestCycles: cyclesSorted.slice(0, 8).map(([k, v]) => ({ key: k, lines: v })),
  },
  pr4aSamples: {
    presGeneral: sample(presGenEvents, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    governor: sample(governorEvents, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    senatePre17: sample(senateEvents, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    house: sample(houseEvents, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    presPrimary: sample(primaryEvents, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    internalParty: sample(leadershipEvents, 10).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    oppCondBumps: oppCondCases.slice(0, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    domesticApathyPresGen: daPresGen.slice(0, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
  },
};
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(`\nWrote ${OUT}`);

if (contractFail > 0) {
  console.log(`\nFAIL: ${contractFail} contract assertions failed.`);
  process.exit(1);
}
console.log(`\nDONE.`);
