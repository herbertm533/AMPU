// PR3 engine playtest — drives the 1772 scenario through ~200 phases and
// reports counts of trait swaps, failed-d6 holds, old-age trait decays, and
// Leadership-Lost battle events. Mirrors scripts/playtestEngineEarn.ts (PR2b).
//
// Also includes inline contract tests for `tryGrantTrait` (6-row resolution
// table * 7 conflict pairs) with stubbed Math.random for determinism.
//
// Run: npx tsx scripts/playtestTraitLoss.ts

// @ts-ignore
if (typeof import.meta.env === 'undefined') (import.meta as any).env = { DEV: false };

import { build1772Scenario } from '../src/data/scenario1772';
import { runCurrentPhase, advancePhase } from '../src/engine/engine';
import { simOneDraftPick, autoPickForPlayer } from '../src/engine/phaseRunners';
import { addTrait, removeTrait, tryGrantTrait } from '../src/engine/traits';
import { TRAIT_CONFLICTS, TRAIT_LIFECYCLE_RULES } from '../src/types';
import type { FullGameSnapshot, Politician, Trait } from '../src/types';
import { writeFileSync } from 'node:fs';

const OUT = '/home/user/AMPU/docs/playtest/trait-loss-d6-conflict/engine-trace.json';

// ---------------------------------------------------------------------------
// Phase 1: contract tests for tryGrantTrait (stubbed RNG)
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
  else {
    contractFail++;
    contractFailures.push(label);
  }
}

// 1. addTrait: returns true iff newly added; idempotent on second call.
{
  const p = mkPol([]);
  assert(addTrait(p, 'Charismatic') === true, 'addTrait first call returns true');
  assert(p.traits.includes('Charismatic'), 'addTrait pushed Charismatic');
  assert(addTrait(p, 'Charismatic') === false, 'addTrait second call returns false');
  assert(p.traits.filter((t) => t === 'Charismatic').length === 1, 'addTrait no double-push');
}

// 2. removeTrait: returns true iff actually held.
{
  const p = mkPol(['Charismatic']);
  assert(removeTrait(p, 'Unlikable') === false, 'removeTrait not-held returns false');
  assert(removeTrait(p, 'Charismatic') === true, 'removeTrait held returns true');
  assert(!p.traits.includes('Charismatic'), 'removeTrait actually removed');
  assert(removeTrait(p, 'Charismatic') === false, 'removeTrait second call returns false');
}

// 3. tryGrantTrait — full 5-row resolution table across all 7 conflict pairs.
const PAIRS: [Trait, Trait][] = [
  ['Charismatic', 'Unlikable'],
  ['Harmonious', 'Puritan'],
  ['Integrity', 'Corrupt'],
  ['Efficient', 'Passive'],
  ['Egghead', 'Incompetent'],
  ['Ideologue', 'Impressionable'],
  ['Loyal', 'Opportunist'],
];

// 3a. TRAIT_CONFLICTS is symmetric.
for (const [a, b] of PAIRS) {
  assert(TRAIT_CONFLICTS[a] === b, `TRAIT_CONFLICTS[${a}] === ${b}`);
  assert(TRAIT_CONFLICTS[b] === a, `TRAIT_CONFLICTS[${b}] === ${a}`);
}

// 3b. Resolution per pair.
for (const [a, b] of PAIRS) {
  // already held -> { granted: false, replaced: null }, silent
  {
    const p = mkPol([a]);
    const r = tryGrantTrait(p, a);
    assert(r.granted === false && r.replaced === null, `${a} already-held returns silent`);
    assert(p.traits.length === 1, `${a} already-held no double-push`);
  }
  // conflict NOT held -> push, no swap
  {
    const p = mkPol([]);
    const r = tryGrantTrait(p, a);
    assert(r.granted === true && r.replaced === null, `${a} no-conflict-held returns push-no-swap`);
    assert(p.traits.includes(a), `${a} no-conflict-held actually pushed`);
  }
  // conflict held + d(6) high (force >= threshold 4) -> swap
  {
    stubbedRandom = () => 0.99; // d(6) -> floor(0.99*6)+1 = 6 >= 4
    const p = mkPol([b]);
    const r = tryGrantTrait(p, a);
    assert(r.granted === true && r.replaced === b, `${a} vs ${b} on d6=6 swaps`);
    assert(p.traits.includes(a) && !p.traits.includes(b), `${a} vs ${b} on d6=6 final state`);
  }
  // conflict held + d(6) low (force < threshold 4) -> no change
  {
    stubbedRandom = () => 0.0; // d(6) -> 1 < 4
    const p = mkPol([b]);
    const r = tryGrantTrait(p, a);
    assert(r.granted === false && r.replaced === null, `${a} vs ${b} on d6=1 no-op`);
    assert(p.traits.includes(b) && !p.traits.includes(a), `${a} vs ${b} on d6=1 keeps ${b}`);
  }
  // d(6) === threshold (4) -> swap (>= boundary)
  {
    stubbedRandom = () => 0.5; // d(6) -> floor(0.5*6)+1 = 4 == threshold
    const p = mkPol([b]);
    const r = tryGrantTrait(p, a);
    assert(r.granted === true && r.replaced === b, `${a} vs ${b} on d6=4 boundary swaps`);
  }
  // d(6) === threshold - 1 (3) -> no swap (< boundary)
  {
    stubbedRandom = () => 0.34; // d(6) -> floor(0.34*6)+1 = 3 < 4
    const p = mkPol([b]);
    const r = tryGrantTrait(p, a);
    assert(r.granted === false && r.replaced === null, `${a} vs ${b} on d6=3 boundary no-op`);
  }
}

// 4. Threshold constant matches brief.
assert(TRAIT_LIFECYCLE_RULES.conflictD6Threshold === 4, 'conflictD6Threshold === 4');

// 5. Fading pool matches brief Q2.
{
  const pool = TRAIT_LIFECYCLE_RULES.oldAge.fadingPool;
  assert(pool.length === 2, 'fadingPool has 2 entries');
  assert(pool.includes('Celebrity'), 'fadingPool includes Celebrity');
  assert(pool.includes('Charismatic'), 'fadingPool includes Charismatic');
  assert(!(pool as readonly string[]).includes('Leadership'), 'fadingPool excludes Leadership');
  assert(!(pool as readonly string[]).includes('Integrity'), 'fadingPool excludes Integrity');
}
// 5b. Old-age tuning matches brief Q6.
assert(TRAIT_LIFECYCLE_RULES.oldAge.minAge === 70, 'oldAge.minAge === 70');
assert(TRAIT_LIFECYCLE_RULES.oldAge.baseChance === 0.05, 'oldAge.baseChance === 0.05');

// 6. Leadership-loss probability matches brief Q8.
assert(
  TRAIT_LIFECYCLE_RULES.leadershipLossOnBattleLoss.chance === 0.5,
  'leadershipLossOnBattleLoss.chance === 0.5',
);

stubbedRandom = realRandom;
Math.random = realRandom;

console.log(`Contract tests: ${contractPass} passed, ${contractFail} failed`);
if (contractFailures.length) {
  for (const f of contractFailures) console.log(`  FAIL: ${f}`);
}

// ---------------------------------------------------------------------------
// Phase 2: engine playtest — drive 1772 scenario, count event types
// ---------------------------------------------------------------------------

const snap: FullGameSnapshot = build1772Scenario('fact_blue_lw_1772');
console.log(
  `Built 1772 scenario: year=${snap.game.year}, phase=${snap.game.phaseId}, ` +
    `factions=${snap.factions.length}, politicians=${snap.politicians.length}`,
);

// Drive inaugural draft to completion.
runCurrentPhase(snap);
while (snap.game.draftRoundOrder.length > 0) {
  const r = simOneDraftPick(snap);
  if (r.needsPlayer) autoPickForPlayer(snap);
}
console.log(`Inaugural draft complete: ${snap.politicians.length} politicians`);

// Snapshot initial trait totals.
const traitCountAt = (s: FullGameSnapshot, t: Trait): number =>
  s.politicians.filter((p) => p.traits.includes(t)).length;
const initialTraitCounts = {
  Charismatic: traitCountAt(snap, 'Charismatic'),
  Unlikable: traitCountAt(snap, 'Unlikable'),
  Harmonious: traitCountAt(snap, 'Harmonious'),
  Puritan: traitCountAt(snap, 'Puritan'),
  Integrity: traitCountAt(snap, 'Integrity'),
  Corrupt: traitCountAt(snap, 'Corrupt'),
  Efficient: traitCountAt(snap, 'Efficient'),
  Passive: traitCountAt(snap, 'Passive'),
  Egghead: traitCountAt(snap, 'Egghead'),
  Incompetent: traitCountAt(snap, 'Incompetent'),
  Ideologue: traitCountAt(snap, 'Ideologue'),
  Impressionable: traitCountAt(snap, 'Impressionable'),
  Loyal: traitCountAt(snap, 'Loyal'),
  Opportunist: traitCountAt(snap, 'Opportunist'),
  Leadership: traitCountAt(snap, 'Leadership'),
  Celebrity: traitCountAt(snap, 'Celebrity'),
};

// Advance many phases. Skip Vite-env-touching phases per PR2b precedent.
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
    // Skip convention by marking resolved
    if (snap.game.pendingConvention) snap.game.pendingConvention.resolved = true;
  }
  advancePhase(snap);
  phasesRun++;
}
console.log(`Ran ${phasesRun} phases, skipped ${skippedCount}, errors ${errorPhases.length}, year ${snap.game.year}`);

// ---------------------------------------------------------------------------
// Phase 3: classify events
// ---------------------------------------------------------------------------

// PR3-specific log signatures. The brief specifies the shape; matching loosely.
const swapWonPatterns = [
  /sheds .* and earns/i,
  /sheds .* as .* gains/i,
  /sheds .* — .* now/i,
  /shedding .* to gain/i,
];
const failedD6Patterns = [
  /holds .* on a d6/i,
  /would have gained .* but/i,
  /weathers .* — .* does not take, on a d6/i,
  /'s .* weathers/i,
  /does not take, on a d6/i,
];
const oldAgeDecayPatterns = [/has lost their .* step/i, /the years catch up/i];
const leadershipLostPatterns = [/aura of leadership fades/i, /leadership .* fades/i];

const matchesAny = (text: string, patterns: RegExp[]) => patterns.some((rx) => rx.test(text));

const swapEvents = snap.events.filter((e) => matchesAny(e.text ?? '', swapWonPatterns));
const failedD6Events = snap.events.filter((e) => matchesAny(e.text ?? '', failedD6Patterns));
const oldAgeDecayEvents = snap.events.filter((e) => matchesAny(e.text ?? '', oldAgeDecayPatterns));
const leadershipLostEvents = snap.events.filter((e) => matchesAny(e.text ?? '', leadershipLostPatterns));

console.log(`\nPR3 event counts:`);
console.log(`  d6 swap (won):       ${swapEvents.length}`);
console.log(`  d6 failed (held):    ${failedD6Events.length}`);
console.log(`  old-age trait decay: ${oldAgeDecayEvents.length}`);
console.log(`  Leadership Lost:     ${leadershipLostEvents.length}`);

// Sample lines from each.
const sample = (arr: typeof snap.events, n: number) => arr.slice(0, n);
if (swapEvents.length) {
  console.log(`\nd6 swap samples:`);
  for (const e of sample(swapEvents, 6)) console.log(`  [${e.year} ${e.phase}] ${e.text}`);
}
if (failedD6Events.length) {
  console.log(`\nd6 failed-d6 samples:`);
  for (const e of sample(failedD6Events, 6)) console.log(`  [${e.year} ${e.phase}] ${e.text}`);
}
if (oldAgeDecayEvents.length) {
  console.log(`\nold-age trait decay samples:`);
  for (const e of sample(oldAgeDecayEvents, 6)) console.log(`  [${e.year} ${e.phase}] ${e.text}`);
}
if (leadershipLostEvents.length) {
  console.log(`\nLeadership Lost samples:`);
  for (const e of sample(leadershipLostEvents, 6)) console.log(`  [${e.year} ${e.phase}] ${e.text}`);
}

// Final trait totals — see if anything shifted.
const finalTraitCounts = Object.fromEntries(
  Object.keys(initialTraitCounts).map((t) => [t, traitCountAt(snap, t as Trait)]),
) as typeof initialTraitCounts;

console.log(`\nTrait counts (initial -> final):`);
for (const t of Object.keys(initialTraitCounts) as (keyof typeof initialTraitCounts)[]) {
  const a = initialTraitCounts[t];
  const b = finalTraitCounts[t];
  if (a !== b) console.log(`  ${t}: ${a} -> ${b} (Δ ${b - a})`);
}

// Write summary.
const summary = {
  scenario: '1772',
  contractTests: { passed: contractPass, failed: contractFail, failures: contractFailures },
  finalYear: snap.game.year,
  finalPhase: snap.game.phaseId,
  phasesRun,
  phasesSkipped: skippedCount,
  errorPhases,
  totalEvents: snap.events.length,
  pr3Counts: {
    swapWon: swapEvents.length,
    failedD6: failedD6Events.length,
    oldAgeDecay: oldAgeDecayEvents.length,
    leadershipLost: leadershipLostEvents.length,
  },
  pr3Samples: {
    swapWon: sample(swapEvents, 20).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    failedD6: sample(failedD6Events, 20).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    oldAgeDecay: sample(oldAgeDecayEvents, 20).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    leadershipLost: sample(leadershipLostEvents, 20).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
  },
  initialTraitCounts,
  finalTraitCounts,
};
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(`\nWrote ${OUT}`);

if (contractFail > 0) {
  console.log(`\nFAIL: ${contractFail} contract assertions failed.`);
  process.exit(1);
}
console.log(`\nDONE.`);
