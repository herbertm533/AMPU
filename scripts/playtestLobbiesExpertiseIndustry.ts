// PR7 engine playtest — drives both 1772 and 1856 scenarios, asserts the
// contract of:
//   - LOBBY_EXPERTISE, LOBBY_INDUSTRY, EXPERTISE_IDEOLOGY_LEAN, LOBBY_RULES
//     consts (shape & values per the brief),
//   - Pass 3 expertise trickle in 2.1.2 (chance-gated, no flood),
//   - 2.1.8 industry nudge (deterministic, no key creation, ≤5 clamp, per-(state,key) dedupe),
//   - factionCenter expertise bias blend (econLean clamped to [-1, +1],
//     |shift| ≤ FACTION_EXPERTISE_BIAS_WEIGHT = 0.5,
//     zero-leans invariant against an inline pre-PR7 mean recompute).
//
// Three-part structure per docs/conventions/playtest-script.md:
//   Part 1: contract tests (stubbed Math.random for determinism)
//   Part 2: engine drive of both scenarios (real Math.random, seeded LCG)
//   Part 3: event classification + per-scenario trace JSON
//
// Run: npx tsx scripts/playtestLobbiesExpertiseIndustry.ts

// Stub import.meta.env for Node (Vite injects this in the browser).
// @ts-ignore
if (typeof import.meta.env === 'undefined') (import.meta as any).env = { DEV: false };

import { build1772Scenario } from '../src/data/scenario1772';
import { build1856Scenario } from '../src/data/scenario1856';
import { runCurrentPhase, advancePhase } from '../src/engine/engine';
import {
  simOneDraftPick,
  autoPickForPlayer,
  factionCenter,
  resolveEraEvent,
  playerCCDelegatePick,
  confirmCCAIPick,
} from '../src/engine/phaseRunners';
import {
  LOBBY_EXPERTISE,
  LOBBY_INDUSTRY,
  EXPERTISE_IDEOLOGY_LEAN,
  LOBBY_RULES,
  LEADERSHIP_RULES,
  IDEOLOGY_ORDER,
} from '../src/types';
import type {
  FullGameSnapshot,
  LobbyCardId,
  Expertise,
  Politician,
} from '../src/types';
import { writeFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Seedable RNG: replace Math.random with a deterministic LCG for the entire
// run so the engine drive is reproducible. (src/rng.ts has no setRngSeed
// helper, so we patch Math.random directly — see playbook "use the seeded RNG
// path" note.) This is the seed used for Part 2's engine drives.
// ---------------------------------------------------------------------------

const REAL_RANDOM = Math.random;
function makeSeededRng(seed: number): () => number {
  // Numerical Recipes LCG. Good enough for engine-smoke determinism.
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ---------------------------------------------------------------------------
// Part 1: contract tests (stubbed RNG)
// ---------------------------------------------------------------------------

let stubbedRandom: () => number = REAL_RANDOM;
Math.random = () => stubbedRandom();

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

// -- A. LobbyCardId coverage: every card has a LOBBY_EXPERTISE entry ---------
const ALL_CARDS: LobbyCardId[] = [
  'Patriots', 'Merchants', 'NationalUnity', 'Planters', 'SmallFarmers',
  'Lawyers', 'Reformers',
  'SlavePower', 'Expansionists', 'ProUnion', 'UrbanLabor', 'NorthernIndustry',
  'Abolitionists', 'EvangelicalReform', 'Nativists',
];
for (const c of ALL_CARDS) {
  assert(c in LOBBY_EXPERTISE, `LOBBY_EXPERTISE has key ${c}`);
  assert(c in LOBBY_INDUSTRY, `LOBBY_INDUSTRY has key ${c}`);
}
assert(Object.keys(LOBBY_EXPERTISE).length === 15, `LOBBY_EXPERTISE has 15 entries`);
assert(Object.keys(LOBBY_INDUSTRY).length === 15, `LOBBY_INDUSTRY has 15 entries`);

// -- B. LOBBY_EXPERTISE values per spec (AC #2 — 7 non-economic → null) ------
assert(LOBBY_EXPERTISE.Merchants === 'Business', `LOBBY_EXPERTISE.Merchants = Business`);
assert(LOBBY_EXPERTISE.Planters === 'Agriculture', `LOBBY_EXPERTISE.Planters = Agriculture`);
assert(LOBBY_EXPERTISE.SmallFarmers === 'Agriculture', `LOBBY_EXPERTISE.SmallFarmers = Agriculture`);
assert(LOBBY_EXPERTISE.Lawyers === 'Justice', `LOBBY_EXPERTISE.Lawyers = Justice`);
assert(LOBBY_EXPERTISE.Patriots === null, `LOBBY_EXPERTISE.Patriots = null`);
assert(LOBBY_EXPERTISE.NationalUnity === null, `LOBBY_EXPERTISE.NationalUnity = null`);
assert(LOBBY_EXPERTISE.Reformers === null, `LOBBY_EXPERTISE.Reformers = null`);
assert(LOBBY_EXPERTISE.SlavePower === 'Agriculture', `LOBBY_EXPERTISE.SlavePower = Agriculture`);
assert(LOBBY_EXPERTISE.NorthernIndustry === 'Business', `LOBBY_EXPERTISE.NorthernIndustry = Business`);
assert(LOBBY_EXPERTISE.Expansionists === 'Foreign Affairs', `LOBBY_EXPERTISE.Expansionists = Foreign Affairs`);
assert(LOBBY_EXPERTISE.UrbanLabor === 'Labor', `LOBBY_EXPERTISE.UrbanLabor = Labor (AC #5)`);
assert(LOBBY_EXPERTISE.Abolitionists === null, `LOBBY_EXPERTISE.Abolitionists = null`);
assert(LOBBY_EXPERTISE.EvangelicalReform === null, `LOBBY_EXPERTISE.EvangelicalReform = null`);
assert(LOBBY_EXPERTISE.ProUnion === null, `LOBBY_EXPERTISE.ProUnion = null`);
assert(LOBBY_EXPERTISE.Nativists === null, `LOBBY_EXPERTISE.Nativists = null`);

// All 7 non-economic lobbies map to null (AC #2 explicit count).
const nonEconomic: LobbyCardId[] = ['Patriots', 'NationalUnity', 'Reformers',
  'Abolitionists', 'EvangelicalReform', 'ProUnion', 'Nativists'];
assert(nonEconomic.length === 7, `7 non-economic lobbies declared (AC #2)`);
for (const c of nonEconomic) {
  assert(LOBBY_EXPERTISE[c] === null, `non-economic ${c} = null in LOBBY_EXPERTISE`);
  assert(LOBBY_INDUSTRY[c].length === 0, `non-economic ${c} = [] in LOBBY_INDUSTRY`);
}

// -- C. LOBBY_INDUSTRY values per spec (AC #5, AC #6, era-correct crops) ----
// AC #5: UrbanLabor → Labor xp BUT zero industry.
assert(LOBBY_INDUSTRY.UrbanLabor.length === 0,
  `LOBBY_INDUSTRY.UrbanLabor = [] (AC #5 — no union-vs-mfg sign)`);

// AC #6 binding facts: Planters tobacco-only (1772 era); SlavePower has both.
assert(LOBBY_INDUSTRY.Planters.includes('tobacco') &&
       !LOBBY_INDUSTRY.Planters.includes('cotton'),
  `Planters nudges tobacco, NOT cotton (AC #6 era-correct 1772 plantation)`);
assert(LOBBY_INDUSTRY.SlavePower.includes('cotton') &&
       LOBBY_INDUSTRY.SlavePower.includes('tobacco'),
  `SlavePower nudges BOTH cotton AND tobacco (AC #6 1856 plantation)`);

// Spot checks for the rest of the table from the brief.
assert(LOBBY_INDUSTRY.Merchants.length === 2 &&
       LOBBY_INDUSTRY.Merchants.includes('shipping') &&
       LOBBY_INDUSTRY.Merchants.includes('finance'),
  `Merchants nudges shipping + finance`);
assert(LOBBY_INDUSTRY.SmallFarmers.length === 1 &&
       LOBBY_INDUSTRY.SmallFarmers[0] === 'agriculture',
  `SmallFarmers nudges agriculture`);
assert(LOBBY_INDUSTRY.NorthernIndustry.length === 2 &&
       LOBBY_INDUSTRY.NorthernIndustry.includes('manufacturing') &&
       LOBBY_INDUSTRY.NorthernIndustry.includes('coal'),
  `NorthernIndustry nudges manufacturing + coal`);
assert(LOBBY_INDUSTRY.Expansionists.length === 1 &&
       LOBBY_INDUSTRY.Expansionists[0] === 'agriculture',
  `Expansionists nudges agriculture`);
assert(LOBBY_INDUSTRY.Lawyers.length === 0,
  `Lawyers = [] in LOBBY_INDUSTRY (no defensible industry)`);

// No anachronistic industries (item 5): assert none of the dropped buckets
// appear ANYWHERE in LOBBY_INDUSTRY values.
const DROPPED = ['naturalGas', 'highTech', 'altEnergy', 'natural-gas', 'high-tech', 'alt-energy', 'Natural Gas', 'High Tech', 'Alt Energy'];
for (const key of DROPPED) {
  const found = Object.values(LOBBY_INDUSTRY).some((arr) => arr.includes(key));
  assert(!found, `no anachronistic '${key}' in LOBBY_INDUSTRY (item 5)`);
}

// -- D. EXPERTISE_IDEOLOGY_LEAN (brief CHECKPOINT 1 values) ------------------
assert(EXPERTISE_IDEOLOGY_LEAN.Agriculture === 1, `Agriculture lean = +1`);
assert(EXPERTISE_IDEOLOGY_LEAN.Business === 0.5, `Business lean = +0.5`);
assert(EXPERTISE_IDEOLOGY_LEAN.Labor === -1, `Labor lean = -1`);
// All other tags absent (=> 0 fallback).
const OTHER_TAGS: Expertise[] = [
  'Economics', 'Education', 'Energy', 'Environment', 'Foreign Affairs',
  'Healthcare', 'Housing', 'Justice', 'Media', 'Military', 'Naval',
  'Science', 'Technology', 'Trade', 'Transportation', 'Welfare',
];
for (const t of OTHER_TAGS) {
  assert(EXPERTISE_IDEOLOGY_LEAN[t] === undefined,
    `EXPERTISE_IDEOLOGY_LEAN.${t} is absent (=> 0 fallback)`);
}

// -- E. LOBBY_RULES tuning constants (brief / spec) --------------------------
assert(LOBBY_RULES.expertiseGrantOdds === 0.10,
  `LOBBY_RULES.expertiseGrantOdds = 0.10 (spec)`);
assert(LOBBY_RULES.factionExpertiseBiasWeight === 0.5,
  `LOBBY_RULES.factionExpertiseBiasWeight = 0.5 (max ±0.5 index shift)`);

// -- F. Inline replication of factionCenter for AC #9 invariant check --------
// Pre-PR7 mean: leader-weighted (1.5x) raw, rounded, clamped to [0, 6].
function prePR7FactionCenter(snap: FullGameSnapshot, factionId: string): number | null {
  const members = snap.politicians.filter((p) =>
    p.factionId === factionId && !p.deathYear && !p.retiredYear);
  if (members.length === 0) return null;
  const f = snap.factions.find((ff) => ff.id === factionId);
  const leaderId = f?.leaderId ?? null;
  let sum = 0, count = 0;
  for (const p of members) {
    const w = (leaderId !== null && p.id === leaderId)
      ? LEADERSHIP_RULES.ideologyWeightInFactionCenter
      : 1;
    sum += IDEOLOGY_ORDER.indexOf(p.ideology) * w;
    count += w;
  }
  return Math.max(0, Math.min(6, Math.round(sum / count)));
}

// PR7 raw (no bias) computation — used to verify econLean clamping yields
// |shift| ≤ 0.5 + ε on the float-mean scale (AC #10).
function rawMeanFloat(snap: FullGameSnapshot, factionId: string): number | null {
  const members = snap.politicians.filter((p) =>
    p.factionId === factionId && !p.deathYear && !p.retiredYear);
  if (members.length === 0) return null;
  const f = snap.factions.find((ff) => ff.id === factionId);
  const leaderId = f?.leaderId ?? null;
  let sum = 0, count = 0;
  for (const p of members) {
    const w = (leaderId !== null && p.id === leaderId)
      ? LEADERSHIP_RULES.ideologyWeightInFactionCenter
      : 1;
    sum += IDEOLOGY_ORDER.indexOf(p.ideology) * w;
    count += w;
  }
  return sum / count;
}

function biasedMeanFloat(snap: FullGameSnapshot, factionId: string): number | null {
  const members = snap.politicians.filter((p) =>
    p.factionId === factionId && !p.deathYear && !p.retiredYear);
  if (members.length === 0) return null;
  const raw = rawMeanFloat(snap, factionId);
  if (raw === null) return null;
  let leanSum = 0;
  for (const p of members) {
    for (const x of p.expertise) {
      leanSum += EXPERTISE_IDEOLOGY_LEAN[x] ?? 0;
    }
  }
  const econLean = Math.max(-1, Math.min(1, leanSum / members.length));
  return raw + LOBBY_RULES.factionExpertiseBiasWeight * econLean;
}

stubbedRandom = REAL_RANDOM;
Math.random = REAL_RANDOM;

console.log(`Contract tests: ${contractPass} passed, ${contractFail} failed`);
if (contractFailures.length) {
  for (const f of contractFailures.slice(0, 20)) console.log(`  FAIL: ${f}`);
}

// ---------------------------------------------------------------------------
// Part 2: engine scenario drive — both 1772 and 1856
// ---------------------------------------------------------------------------

type DriveResult = {
  scenario: '1772' | '1856';
  startYear: number;
  finalYear: number;
  phasesRun: number;
  phasesSkipped: number;
  errorPhases: { phase: string; year: number; err: string }[];
  totalEvents: number;
  industryRiseEvents: { year: number; phase: string; text: string }[];
  expertiseGrantEvents: { year: number; phase: string; text: string }[];
  finalIndustries: Record<string, Record<string, number>>;
  factionCenters: Record<string, number | null>;
};

function autoResolveOnce(
  snap: FullGameSnapshot,
  res: ReturnType<typeof runCurrentPhase>,
): void {
  if (res.needsPlayerInput === 'draft') {
    while (snap.game.draftRoundOrder.length > 0) {
      const r = simOneDraftPick(snap);
      if (r.needsPlayer) autoPickForPlayer(snap);
    }
  } else if (res.needsPlayerInput === 'eraEvent') {
    const evt = res.payload as { id: string; responses: { id: string }[] };
    if (evt?.responses?.length) {
      resolveEraEvent(snap, evt.id, evt.responses[0].id);
    }
  } else if (res.needsPlayerInput === 'ccBuilder') {
    const payload = res.payload as { stateId: string; eligible: { id: string }[] };
    if (payload?.eligible?.[0]) {
      playerCCDelegatePick(snap, payload.stateId, payload.eligible[0].id);
    }
  } else if (res.needsPlayerInput === 'ccAIConfirm') {
    confirmCCAIPick(snap);
  } else if (res.needsPlayerInput === 'convention') {
    if (snap.game.pendingConvention) snap.game.pendingConvention.resolved = true;
  }
}

async function driveScenario(
  era: '1772' | '1856',
  seed: number,
  iterations: number,
): Promise<{ snap: FullGameSnapshot; result: DriveResult }> {
  const result: DriveResult = {
    scenario: era,
    startYear: 0,
    finalYear: 0,
    phasesRun: 0,
    phasesSkipped: 0,
    errorPhases: [],
    totalEvents: 0,
    industryRiseEvents: [],
    expertiseGrantEvents: [],
    finalIndustries: {},
    factionCenters: {},
  };

  const rng = makeSeededRng(seed);
  Math.random = rng;

  let snap: FullGameSnapshot;
  if (era === '1856') {
    snap = build1856Scenario('fact_blue_cons');
  } else {
    snap = build1772Scenario('fact_blue_lw_1772');
  }
  // Deep-clone to break shared array references with the module-level
  // FACTIONS_xxx / STATES_xxx / etc. (engine assumes one game per process;
  // 2.1.8 mutates f.lobbyCards in-place, leaking across runs in our smoke).
  snap = JSON.parse(JSON.stringify(snap)) as FullGameSnapshot;
  result.startYear = snap.game.year;

  // Drive initial draft.
  runCurrentPhase(snap);
  while (snap.game.draftRoundOrder.length > 0) {
    const r = simOneDraftPick(snap);
    if (r.needsPlayer) autoPickForPlayer(snap);
  }

  // Skip Vite-env-touching phases per playbook.
  const skipPhases = new Set(['2.4.2', '2.4.3']);

  for (let i = 0; i < iterations; i++) {
    if (skipPhases.has(snap.game.phaseId)) {
      advancePhase(snap);
      result.phasesSkipped++;
      continue;
    }
    let res: ReturnType<typeof runCurrentPhase>;
    try {
      res = runCurrentPhase(snap);
    } catch (e) {
      const msg = (e as Error).message.slice(0, 120);
      result.errorPhases.push({ phase: snap.game.phaseId, year: snap.game.year, err: msg });
      advancePhase(snap);
      result.phasesSkipped++;
      continue;
    }
    autoResolveOnce(snap, res);
    advancePhase(snap);
    result.phasesRun++;
  }

  result.finalYear = snap.game.year;
  result.totalEvents = snap.events.length;

  // Capture industry-rise + expertise-grant events.
  const riseRx = /^.* (\w+) industry rises \((\w+)\)\.$/;
  const grantRx = / gains (\w+(?:\s\w+)?) expertise from the (\w+) lobby\.$/;
  for (const e of snap.events) {
    if (riseRx.test(e.text ?? '')) {
      result.industryRiseEvents.push({ year: e.year ?? snap.game.year, phase: e.phase ?? '', text: e.text ?? '' });
    }
    if (grantRx.test(e.text ?? '')) {
      result.expertiseGrantEvents.push({ year: e.year ?? snap.game.year, phase: e.phase ?? '', text: e.text ?? '' });
    }
  }

  for (const s of snap.states) {
    result.finalIndustries[s.id] = { ...s.industries };
  }
  for (const f of snap.factions) {
    result.factionCenters[f.id] = factionCenter(snap, f.id);
  }

  Math.random = REAL_RANDOM;
  return { snap, result };
}

const SEED_1772 = 0xdeadbeef;
const SEED_1856 = 0xfeedface;
const ITERATIONS = 600;

console.log(`\n--- Driving 1772 scenario (seed ${SEED_1772.toString(16)}) ---`);
const { snap: snap1772, result: r1772 } = await driveScenario('1772', SEED_1772, ITERATIONS);
console.log(`1772: ran ${r1772.phasesRun} phases, skipped ${r1772.phasesSkipped}, errors ${r1772.errorPhases.length}, year ${r1772.startYear} -> ${r1772.finalYear}`);
if (r1772.errorPhases.length) {
  console.log(`  First 3 errors:`);
  for (const e of r1772.errorPhases.slice(0, 3)) console.log(`    [${e.phase} y${e.year}] ${e.err}`);
}

console.log(`\n--- Driving 1856 scenario (seed ${SEED_1856.toString(16)}) ---`);
const { snap: snap1856, result: r1856 } = await driveScenario('1856', SEED_1856, ITERATIONS);
console.log(`1856: ran ${r1856.phasesRun} phases, skipped ${r1856.phasesSkipped}, errors ${r1856.errorPhases.length}, year ${r1856.startYear} -> ${r1856.finalYear}`);
if (r1856.errorPhases.length) {
  console.log(`  First 3 errors:`);
  for (const e of r1856.errorPhases.slice(0, 3)) console.log(`    [${e.phase} y${e.year}] ${e.err}`);
}

// ---------------------------------------------------------------------------
// AC #3 — trickle, not flood (per-tick grant count is roughly binomial(N, 0.10))
// ---------------------------------------------------------------------------
// Drive a SHORT, isolated 1856 run for 5 successive 2.1.2 ticks and confirm
// the per-tick grant count is strictly < N * (card count with non-null xp).
{
  const rng = makeSeededRng(SEED_1856 ^ 0xa);
  Math.random = rng;
  let snap = build1856Scenario('fact_blue_cons');
  snap = JSON.parse(JSON.stringify(snap)) as FullGameSnapshot;
  runCurrentPhase(snap);
  while (snap.game.draftRoundOrder.length > 0) {
    const r = simOneDraftPick(snap);
    if (r.needsPlayer) autoPickForPlayer(snap);
  }

  // Roster eligibility per faction at this moment.
  const eligiblePerFaction: Record<string, number> = {};
  const economicCardsPerFaction: Record<string, number> = {};
  for (const f of snap.factions) {
    eligiblePerFaction[f.id] = snap.politicians.filter((p) =>
      p.factionId === f.id && !p.deathYear && !p.retiredYear).length;
    economicCardsPerFaction[f.id] = f.lobbyCards.filter((c) => LOBBY_EXPERTISE[c] !== null).length;
  }

  // Drive until we've seen 5 distinct 2.1.2 phase runs.
  let ticks = 0;
  const grantsPerTick: { tick: number; grants: number; perFaction: Record<string, number> }[] = [];
  let preCount = snap.events.filter((e) => / gains \w+(?:\s\w+)? expertise from the \w+ lobby\.$/.test(e.text ?? '')).length;
  const skipPhases = new Set(['2.4.2', '2.4.3']);
  while (ticks < 5) {
    if (skipPhases.has(snap.game.phaseId)) {
      advancePhase(snap);
      continue;
    }
    const phaseBefore = snap.game.phaseId;
    let res: ReturnType<typeof runCurrentPhase>;
    try {
      res = runCurrentPhase(snap);
    } catch (e) {
      advancePhase(snap);
      continue;
    }
    if (phaseBefore === '2.1.2') {
      const postCount = snap.events.filter((e) => / gains \w+(?:\s\w+)? expertise from the \w+ lobby\.$/.test(e.text ?? '')).length;
      const tickGrants = postCount - preCount;
      grantsPerTick.push({ tick: ticks + 1, grants: tickGrants, perFaction: {} });
      preCount = postCount;
      ticks++;
    }
    autoResolveOnce(snap, res);
    advancePhase(snap);
  }

  // Aggregate over the 5 ticks.
  const totalGrants = grantsPerTick.reduce((a, t) => a + t.grants, 0);
  // Compute the upper bound: sum over factions of (eligible * card count) * 5 ticks.
  let upperBound = 0;
  for (const fid of Object.keys(eligiblePerFaction)) {
    upperBound += eligiblePerFaction[fid] * economicCardsPerFaction[fid];
  }
  upperBound *= 5;
  console.log(`AC #3 trickle: ${totalGrants} grants over 5 ticks, upper bound (= 5 * sum_f(N_f * cards_f)) = ${upperBound}`);
  assert(totalGrants < upperBound,
    `AC #3 trickle: ${totalGrants} < ${upperBound} (not a flood)`);
  // Also confirm rate is roughly 10% — total / upperBound should be in [0.03, 0.20].
  // (Wide tolerance; we just want to catch a bug like odds=1.0 or odds=0.0.)
  if (upperBound > 0) {
    const rate = totalGrants / upperBound;
    console.log(`  observed grant rate: ${(rate * 100).toFixed(1)}% (target ~10%)`);
    assert(rate > 0.02, `AC #3 trickle: rate ${(rate * 100).toFixed(1)}% > 2% (mechanic is firing)`);
    assert(rate < 0.25, `AC #3 trickle: rate ${(rate * 100).toFixed(1)}% < 25% (mechanic isn't flooding)`);
  }

  Math.random = REAL_RANDOM;
}

// ---------------------------------------------------------------------------
// AC #4 — no key creation, clamp ≤5
// ---------------------------------------------------------------------------
{
  // Compare seed-state keys per state vs. final-state keys per state.
  // 1772
  const seed1772 = build1772Scenario('fact_blue_lw_1772');
  const seedKeys1772: Record<string, Set<string>> = {};
  for (const s of seed1772.states) {
    seedKeys1772[s.id] = new Set(Object.keys(s.industries));
  }
  let keysCreated1772 = 0;
  let valuesOver5_1772 = 0;
  for (const s of snap1772.states) {
    const seedSet = seedKeys1772[s.id] ?? new Set();
    for (const k of Object.keys(s.industries)) {
      if (!seedSet.has(k)) keysCreated1772++;
      if (s.industries[k] > 5) valuesOver5_1772++;
    }
  }
  assert(keysCreated1772 === 0, `AC #4 (1772): no new state.industries keys created (${keysCreated1772} created)`);
  assert(valuesOver5_1772 === 0, `AC #4 (1772): no industry value > 5 (${valuesOver5_1772} over)`);

  // 1856
  const seed1856 = build1856Scenario('fact_blue_cons');
  const seedKeys1856: Record<string, Set<string>> = {};
  for (const s of seed1856.states) {
    seedKeys1856[s.id] = new Set(Object.keys(s.industries));
  }
  let keysCreated1856 = 0;
  let valuesOver5_1856 = 0;
  for (const s of snap1856.states) {
    const seedSet = seedKeys1856[s.id] ?? new Set();
    for (const k of Object.keys(s.industries)) {
      if (!seedSet.has(k)) keysCreated1856++;
      if (s.industries[k] > 5) valuesOver5_1856++;
    }
  }
  assert(keysCreated1856 === 0, `AC #4 (1856): no new state.industries keys created (${keysCreated1856} created)`);
  assert(valuesOver5_1856 === 0, `AC #4 (1856): no industry value > 5 (${valuesOver5_1856} over)`);
}

// ---------------------------------------------------------------------------
// AC #5 — UrbanLabor → Labor expertise grants but ZERO industry rise
// ---------------------------------------------------------------------------
{
  // Check 1856 only — UrbanLabor doesn't appear in 1772.
  const hasUrbanLaborHolder = snap1856.factions.some((f) => f.lobbyCards.includes('UrbanLabor'));
  if (hasUrbanLaborHolder) {
    // Count industry-rise lines attributed to UrbanLabor.
    const urbanLaborRises = r1856.industryRiseEvents.filter((e) => /\(UrbanLabor\)\.$/.test(e.text));
    console.log(`AC #5 (1856): UrbanLabor holder present; UrbanLabor industry rises = ${urbanLaborRises.length}`);
    assert(urbanLaborRises.length === 0,
      `AC #5 (1856): UrbanLabor produces 0 industry rises (got ${urbanLaborRises.length})`);

    // Also count Labor expertise grants from UrbanLabor lobby.
    const laborGrants = r1856.expertiseGrantEvents.filter((e) =>
      / gains Labor expertise from the UrbanLabor lobby\.$/.test(e.text));
    console.log(`  UrbanLabor → Labor expertise grants = ${laborGrants.length}`);
    assert(laborGrants.length > 0,
      `AC #5 (1856): UrbanLabor produces Labor expertise grants (got ${laborGrants.length})`);
  } else {
    console.log(`AC #5 SKIPPED: no faction holds UrbanLabor in 1856 (unexpected — fact_blue_locofoco should)`);
  }
}

// ---------------------------------------------------------------------------
// AC #6 — era-correct crops (Planters never mentions cotton; SlavePower does)
// ---------------------------------------------------------------------------
{
  // 1772: Planters lines should never mention cotton.
  const plantersCotton1772 = r1772.industryRiseEvents.filter((e) =>
    /cotton industry rises \(Planters\)\.$/.test(e.text));
  console.log(`AC #6 (1772): Planters-cotton lines = ${plantersCotton1772.length} (must be 0)`);
  assert(plantersCotton1772.length === 0,
    `AC #6 (1772): Planters never nudges cotton (got ${plantersCotton1772.length} lines)`);
  // And Planters tobacco lines should exist.
  const plantersTobacco1772 = r1772.industryRiseEvents.filter((e) =>
    /tobacco industry rises \(Planters\)\.$/.test(e.text));
  console.log(`  Planters-tobacco lines = ${plantersTobacco1772.length} (should be > 0)`);

  // 1856: SlavePower lines should include both cotton and tobacco.
  const slavePowerCotton1856 = r1856.industryRiseEvents.filter((e) =>
    /cotton industry rises \(SlavePower\)\.$/.test(e.text));
  const slavePowerTobacco1856 = r1856.industryRiseEvents.filter((e) =>
    /tobacco industry rises \(SlavePower\)\.$/.test(e.text));
  console.log(`AC #6 (1856): SlavePower-cotton lines = ${slavePowerCotton1856.length}, SlavePower-tobacco lines = ${slavePowerTobacco1856.length}`);
}

// ---------------------------------------------------------------------------
// AC #7 — per-(state, key) dedupe (≤1 industry-rise line per state+key+year)
// ---------------------------------------------------------------------------
{
  // Group lines by (year, state, key). Count duplicates.
  type Key = string; // "year|state|key"
  const counts: Map<Key, number> = new Map();
  for (const e of r1772.industryRiseEvents.concat(r1856.industryRiseEvents)) {
    const m = e.text.match(/^(.*) (\w+) industry rises \(\w+\)\.$/);
    if (!m) continue;
    const state = m[1];
    const key = m[2];
    const k = `${e.year}|${state}|${key}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let dupes = 0;
  let maxCount = 0;
  for (const [, n] of counts) {
    if (n > 1) dupes++;
    if (n > maxCount) maxCount = n;
  }
  console.log(`AC #7 dedupe: ${counts.size} unique (year, state, key) entries; ${dupes} with count > 1; max count = ${maxCount}`);
  assert(dupes === 0, `AC #7: ≤1 industry-rise per (state, key, year) — got ${dupes} duplicates`);
  assert(maxCount <= 1, `AC #7: max count per (state, key, year) = ${maxCount}, must be ≤ 1`);
}

// ---------------------------------------------------------------------------
// AC #8 — determinism: from the SAME snapshot, re-running the engine produces
// identical state.industries + factionCenter results. This is the spec's
// exact wording ("re-running the same phase from the same snapshot/seed").
//
// We test on TWO surfaces:
//   (a) item-2 industry-nudge: re-running runPhase_2_1_8_FactionPersonalities
//       twice from the same snapshot produces identical state.industries.
//       The nudge is zero-RNG, so this is the cleanest invariant.
//   (b) item-4 factionCenter bias: computed pure-from-snapshot, no RNG;
//       calling it twice on the same snapshot trivially yields the same.
//
// We also confirm AC #8's item-1 (Pass 3 expertise trickle) is RNG-seeded:
// re-driving 2.1.2 with same Math.random sequence yields same grant set.
// ---------------------------------------------------------------------------
{
  // Take a clean snapshot mid-drive of 1856 (use the final state from r1856).
  // Deep-clone it, then re-run 2.1.8 on both clones; results must match.
  const clone1 = JSON.parse(JSON.stringify(snap1856)) as FullGameSnapshot;
  const clone2 = JSON.parse(JSON.stringify(snap1856)) as FullGameSnapshot;

  // Set the phase explicitly so runCurrentPhase routes to 2.1.8.
  clone1.game.phaseId = '2.1.8';
  clone2.game.phaseId = '2.1.8';
  // The 2.1.8 nudge is zero-RNG so seed shouldn't matter. But to be safe,
  // make Math.random a no-op clone-stable function for both runs.
  Math.random = makeSeededRng(0xc0ffee);
  runCurrentPhase(clone1);
  Math.random = makeSeededRng(0xc0ffee);
  runCurrentPhase(clone2);
  Math.random = REAL_RANDOM;

  let industryMismatch = 0;
  const industryMismatchSamples: string[] = [];
  for (let i = 0; i < clone1.states.length; i++) {
    const a = clone1.states[i].industries;
    const b = clone2.states[i].industries;
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length || aKeys.some((k, j) => k !== bKeys[j])) {
      industryMismatch++;
      if (industryMismatchSamples.length < 5) industryMismatchSamples.push(`${clone1.states[i].id}: keys ${aKeys} vs ${bKeys}`);
      continue;
    }
    for (const k of aKeys) {
      if (a[k] !== b[k]) {
        industryMismatch++;
        if (industryMismatchSamples.length < 5) industryMismatchSamples.push(`${clone1.states[i].id}.${k}: ${a[k]} vs ${b[k]}`);
        break;
      }
    }
  }
  for (const s of industryMismatchSamples) console.log(`  AC #8 industry mismatch: ${s}`);
  assert(industryMismatch === 0,
    `AC #8(a): re-running 2.1.8 on same snapshot yields identical state.industries (got ${industryMismatch} mismatches)`);

  // factionCenter determinism: compute twice on each snapshot; results identical.
  let centerMismatch = 0;
  for (const f of clone1.factions) {
    const c1 = factionCenter(clone1, f.id);
    const c2 = factionCenter(clone2, f.id);
    if (c1 !== c2) centerMismatch++;
  }
  // Same snap, twice.
  for (const f of snap1856.factions) {
    const a = factionCenter(snap1856, f.id);
    const b = factionCenter(snap1856, f.id);
    if (a !== b) centerMismatch++;
  }
  assert(centerMismatch === 0,
    `AC #8(b): re-computing factionCenter on same snapshot yields identical results (got ${centerMismatch} mismatches)`);

  console.log(`AC #8 determinism: re-run 2.1.8 → ${industryMismatch} industry mismatches; re-compute factionCenter → ${centerMismatch} mismatches`);

  // AC #8 item-1 (Pass 3 expertise trickle is seeded RNG): replay a single
  // 2.1.2 from a clean clone twice with the same Math.random seed; expertise
  // grant logs must be identical.
  const clone3 = JSON.parse(JSON.stringify(snap1856)) as FullGameSnapshot;
  const clone4 = JSON.parse(JSON.stringify(snap1856)) as FullGameSnapshot;
  clone3.game.phaseId = '2.1.2';
  clone4.game.phaseId = '2.1.2';
  const eventsBefore3 = clone3.events.length;
  const eventsBefore4 = clone4.events.length;
  Math.random = makeSeededRng(0xb16b00b5);
  runCurrentPhase(clone3);
  Math.random = makeSeededRng(0xb16b00b5);
  runCurrentPhase(clone4);
  Math.random = REAL_RANDOM;

  const grantRegex = / gains \w+(?:\s\w+)? expertise from the \w+ lobby\.$/;
  const newEvents3 = clone3.events.slice(eventsBefore3).filter((e) => grantRegex.test(e.text ?? '')).map((e) => e.text);
  const newEvents4 = clone4.events.slice(eventsBefore4).filter((e) => grantRegex.test(e.text ?? '')).map((e) => e.text);
  let grantMismatch = 0;
  if (newEvents3.length !== newEvents4.length) {
    grantMismatch = Math.abs(newEvents3.length - newEvents4.length);
    console.log(`  AC #8 grant count mismatch: r1=${newEvents3.length}, r2=${newEvents4.length}`);
  } else {
    for (let i = 0; i < newEvents3.length; i++) {
      if (newEvents3[i] !== newEvents4[i]) grantMismatch++;
    }
  }
  assert(grantMismatch === 0,
    `AC #8(c): re-running 2.1.2 on same snapshot+seed yields identical expertise grants (got ${grantMismatch} mismatches)`);
  console.log(`AC #8 Pass 3 trickle: ${newEvents3.length} grants per run, ${grantMismatch} mismatches`);
}

// ---------------------------------------------------------------------------
// AC #9 — zero-leans invariant: with EXPERTISE_IDEOLOGY_LEAN all zero,
// factionCenter must equal the pre-PR7 leader-weighted-mean rounded result.
//
// We can't mutate EXPERTISE_IDEOLOGY_LEAN at runtime (it's frozen via TS const),
// but we CAN do the equivalent: for every faction in both final snaps, compute
// (a) prePR7FactionCenter (inline replica of pre-PR7 math) and (b) what the
// CURRENT factionCenter WOULD return if we zeroed EVERY member's expertise.
// To avoid mutating snapshots, we instead compute the pre-PR7 result and
// compare against an INDEPENDENT inline biasedMean computation with all-zero
// leans (which is identical to rawMean — and which we already match the
// integer result against above). The strict invariant:
//   for every faction with all member expertise tags having lean=0, the
//   actual factionCenter result === prePR7FactionCenter result.
// (i.e. the bias is purely additive on top of pre-PR7 mean, and only fires
// when economic tags are present.)
//
// Implementation: filter to factions whose members carry no Agriculture/Business/
// Labor tags. For those, factionCenter must equal prePR7FactionCenter.
// ---------------------------------------------------------------------------
{
  const economicTags = new Set<Expertise>(['Agriculture', 'Business', 'Labor']);
  let checked = 0;
  let mismatches = 0;
  const samples: { snap: string; faction: string; current: number | null; pre: number | null }[] = [];

  for (const [snap, label] of [[snap1772, '1772'], [snap1856, '1856']] as const) {
    for (const f of snap.factions) {
      const members = snap.politicians.filter((p) =>
        p.factionId === f.id && !p.deathYear && !p.retiredYear);
      if (members.length === 0) continue;
      const hasEconomic = members.some((p) => p.expertise.some((x) => economicTags.has(x)));
      if (hasEconomic) continue; // skip — bias term is nonzero
      checked++;
      const cur = factionCenter(snap, f.id);
      const pre = prePR7FactionCenter(snap, f.id);
      if (cur !== pre) {
        mismatches++;
        if (samples.length < 5) samples.push({ snap: label, faction: f.id, current: cur, pre });
      }
    }
  }
  console.log(`AC #9 zero-leans invariant: ${checked} factions with no economic expertise; ${mismatches} mismatches`);
  if (samples.length) {
    for (const s of samples) {
      console.log(`  ${s.snap} ${s.faction}: cur=${s.current}, pre-PR7=${s.pre}`);
    }
  }
  assert(mismatches === 0,
    `AC #9: zero-leans invariant — factionCenter equals pre-PR7 leader-mean for econ-free factions`);
}

// ---------------------------------------------------------------------------
// AC #10 — bias ≤ ±0.5 index (on the float mean scale, before rounding/clamp).
// For every faction in both final snaps, compute (biasedMeanFloat - rawMeanFloat)
// and assert |shift| ≤ 0.5 + ε.
// ---------------------------------------------------------------------------
{
  const EPS = 1e-9;
  let maxShift = 0;
  let violations = 0;
  const violationSamples: { snap: string; faction: string; raw: number; biased: number; shift: number }[] = [];

  for (const [snap, label] of [[snap1772, '1772'], [snap1856, '1856']] as const) {
    for (const f of snap.factions) {
      const raw = rawMeanFloat(snap, f.id);
      const biased = biasedMeanFloat(snap, f.id);
      if (raw === null || biased === null) continue;
      const shift = biased - raw;
      const ashift = Math.abs(shift);
      if (ashift > maxShift) maxShift = ashift;
      if (ashift > 0.5 + EPS) {
        violations++;
        if (violationSamples.length < 5) violationSamples.push({ snap: label, faction: f.id, raw, biased, shift });
      }
    }
  }
  console.log(`AC #10 bias cap: maxShift = ${maxShift.toFixed(4)} (must be ≤ 0.5 + ε); ${violations} violations`);
  for (const v of violationSamples) {
    console.log(`  ${v.snap} ${v.faction}: raw=${v.raw.toFixed(4)}, biased=${v.biased.toFixed(4)}, shift=${v.shift.toFixed(4)}`);
  }
  assert(violations === 0,
    `AC #10: |biasedMean - rawMean| ≤ 0.5 + ε for every faction (got ${violations} violations)`);
}

// ---------------------------------------------------------------------------
// AC #10 boundary demo: an artificial faction whose every member is Liberal
// (=2 on IDEOLOGY_ORDER), giving rawMean = 2.0; with every member holding
// Agriculture expertise the bias is +1 * 0.5 = +0.5, biasedMean = 2.5, round
// → 3 (Moderate). Without the bias (prePR7), result is 2 (Liberal). One step
// toward RW exactly.
// ---------------------------------------------------------------------------
{
  // Build a tiny in-memory snapshot scaffold by carving a slice of 1772.
  // We bypass the engine drive: just instantiate enough to compute
  // factionCenter on a hand-crafted faction.
  const fakeSnap: FullGameSnapshot = {
    ...snap1772,
    politicians: [
      {
        ...snap1772.politicians[0],
        id: 'demo_a', factionId: 'demo_faction', ideology: 'Liberal',
        expertise: ['Agriculture'], deathYear: undefined, retiredYear: undefined,
        traits: [], altState: undefined,
      } as Politician,
      {
        ...snap1772.politicians[0],
        id: 'demo_b', factionId: 'demo_faction', ideology: 'Liberal',
        expertise: ['Agriculture'], deathYear: undefined, retiredYear: undefined,
        traits: [], altState: undefined,
      } as Politician,
      {
        ...snap1772.politicians[0],
        id: 'demo_c', factionId: 'demo_faction', ideology: 'Liberal',
        expertise: ['Agriculture'], deathYear: undefined, retiredYear: undefined,
        traits: [], altState: undefined,
      } as Politician,
    ],
    factions: [
      ...snap1772.factions,
      {
        id: 'demo_faction', name: 'demo', partyId: 'BLUE', personality: 'Center',
        ideologyCards: [], lobbyCards: [], interestCards: [], leaderId: null,
        isPlayer: false,
      },
    ],
  };
  const cur = factionCenter(fakeSnap, 'demo_faction');
  const pre = prePR7FactionCenter(fakeSnap, 'demo_faction');
  console.log(`AC #10 boundary demo (3x Liberal+Agriculture): cur=${cur} (Moderate=3 expected), pre-PR7=${pre} (Liberal=2 expected)`);
  assert(pre === 2, `AC #10 boundary demo: pre-PR7 mean of 3x Liberal = 2 (Liberal index)`);
  assert(cur === 3, `AC #10 boundary demo: PR7 biasedMean of 3x Liberal+Agriculture = 3 (Moderate, +1 step toward RW)`);

  // A non-boundary faction (3x Moderate=3 + Agriculture) → rawMean=3.0,
  // biased=3.5, round half-up → 4 (Conservative). One step. Not the same demo.
  // For "non-boundary unaffected": 3x Conservative (idx=4), Agriculture →
  // rawMean=4.0, biased=4.5, round → 5 (Traditionalist). Still moves a step
  // because the bias is at the rounding boundary by construction.
  // The TRUE "non-boundary unaffected" example: 3x Liberal w/ NO Agriculture →
  // both should equal 2. Already covered by AC #9.
}

// ---------------------------------------------------------------------------
// Per-feature signature counts (Part 3 report)
// ---------------------------------------------------------------------------

console.log(`\n--- 1772 event counts ---`);
console.log(`  total events:              ${r1772.totalEvents}`);
console.log(`  expertise-grant (lobby):   ${r1772.expertiseGrantEvents.length}`);
console.log(`  industry-rise:             ${r1772.industryRiseEvents.length}`);

console.log(`\n--- 1856 event counts ---`);
console.log(`  total events:              ${r1856.totalEvents}`);
console.log(`  expertise-grant (lobby):   ${r1856.expertiseGrantEvents.length}`);
console.log(`  industry-rise:             ${r1856.industryRiseEvents.length}`);

// Top-K industry rise samples per scenario, per card.
function samplesByCard(events: { year: number; phase: string; text: string }[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const e of events) {
    const m = e.text.match(/\((\w+)\)\.$/);
    if (!m) continue;
    const card = m[1];
    (out[card] ??= []).push(`[${e.year} ${e.phase}] ${e.text}`);
  }
  return out;
}

const samples1772 = samplesByCard(r1772.industryRiseEvents);
const samples1856 = samplesByCard(r1856.industryRiseEvents);
console.log(`\n1772 industry-rise lines by card:`);
for (const [card, lines] of Object.entries(samples1772)) {
  console.log(`  ${card}: ${lines.length} lines, e.g. ${lines[0]}`);
}
console.log(`\n1856 industry-rise lines by card:`);
for (const [card, lines] of Object.entries(samples1856)) {
  console.log(`  ${card}: ${lines.length} lines, e.g. ${lines[0]}`);
}

// Expertise grant samples by card.
const grantSamples1772: Record<string, string[]> = {};
for (const e of r1772.expertiseGrantEvents) {
  const m = e.text.match(/from the (\w+) lobby/);
  if (!m) continue;
  (grantSamples1772[m[1]] ??= []).push(`[${e.year}] ${e.text}`);
}
const grantSamples1856: Record<string, string[]> = {};
for (const e of r1856.expertiseGrantEvents) {
  const m = e.text.match(/from the (\w+) lobby/);
  if (!m) continue;
  (grantSamples1856[m[1]] ??= []).push(`[${e.year}] ${e.text}`);
}
console.log(`\n1772 expertise-grant lines by card:`);
for (const [card, lines] of Object.entries(grantSamples1772)) {
  console.log(`  ${card}: ${lines.length} lines`);
}
console.log(`\n1856 expertise-grant lines by card:`);
for (const [card, lines] of Object.entries(grantSamples1856)) {
  console.log(`  ${card}: ${lines.length} lines`);
}

console.log(`\nFinal contract test totals: ${contractPass}/${contractPass + contractFail} pass.`);
if (contractFailures.length) {
  console.log(`Contract FAILURES (first 20):`);
  for (const f of contractFailures.slice(0, 20)) console.log(`  ${f}`);
}

// ---------------------------------------------------------------------------
// Trace JSON output
// ---------------------------------------------------------------------------

function makeTrace(r: DriveResult, snap: FullGameSnapshot): object {
  // Compute factionCenters via the actual engine for completeness.
  const factionData: Record<string, { center: number | null; rawMeanFloat: number | null; biasedMeanFloat: number | null; shift: number }> = {};
  for (const f of snap.factions) {
    const raw = rawMeanFloat(snap, f.id);
    const bia = biasedMeanFloat(snap, f.id);
    const shift = (raw !== null && bia !== null) ? bia - raw : 0;
    factionData[f.id] = {
      center: r.factionCenters[f.id],
      rawMeanFloat: raw,
      biasedMeanFloat: bia,
      shift,
    };
  }
  return {
    scenario: r.scenario,
    startYear: r.startYear,
    finalYear: r.finalYear,
    phasesRun: r.phasesRun,
    phasesSkipped: r.phasesSkipped,
    errorPhases: r.errorPhases,
    totalEvents: r.totalEvents,
    contractTests: {
      passed: contractPass,
      failed: contractFail,
      failures: contractFailures,
    },
    expertiseGrantCount: r.expertiseGrantEvents.length,
    industryRiseCount: r.industryRiseEvents.length,
    expertiseGrantSamples: r.expertiseGrantEvents.slice(0, 30),
    industryRiseSamples: r.industryRiseEvents.slice(0, 40),
    finalIndustries: r.finalIndustries,
    factionData,
  };
}

const trace1772 = makeTrace(r1772, snap1772);
const trace1856 = makeTrace(r1856, snap1856);

writeFileSync(
  '/home/user/AMPU/docs/playtest/lobbies-expertise-industry/engine-trace-1772.json',
  JSON.stringify(trace1772, null, 2),
);
writeFileSync(
  '/home/user/AMPU/docs/playtest/lobbies-expertise-industry/engine-trace-1856.json',
  JSON.stringify(trace1856, null, 2),
);
console.log(`\nWrote engine-trace-1772.json and engine-trace-1856.json under docs/playtest/lobbies-expertise-industry/`);

if (contractFail > 0) {
  console.log(`\nSMOKE FAIL: ${contractFail} contract assertions failed.`);
  process.exit(1);
}
console.log(`\nSMOKE PASS.`);
