// Engine-driven playtest for PR2b. Bypasses the UI: builds a 1772 scenario
// programmatically and drives the engine through ~10 phases to surface the
// new earn grants in the events list. Writes a JSON summary to
// docs/playtest/abilities-earn-expansion/.
//
// Compile + run from project root:
//   npx tsc --outDir /tmp/ampu-playtest --module nodenext --target es2022 \
//     --moduleResolution nodenext --esModuleInterop scripts/playtestEngineEarn.ts \
//     src/engine/**.ts src/data/**.ts src/types.ts src/phases.ts src/pv.ts src/rng.ts src/db.ts
// (db.ts trips on idb deps — workaround below: stub idb.)

// Stub import.meta.env for Node (Vite injects this in the browser).
// @ts-ignore
if (typeof import.meta.env === 'undefined') (import.meta as any).env = { DEV: false };

import { build1772Scenario } from '../src/data/scenario1772';
import { runCurrentPhase, advancePhase } from '../src/engine/engine';
import { simOneDraftPick, autoPickForPlayer } from '../src/engine/phaseRunners';
import type { FullGameSnapshot } from '../src/types';
import { writeFileSync } from 'node:fs';

const OUT = '/home/user/AMPU/docs/playtest/abilities-earn-expansion/engine-trace.json';

// Scenario picker. The default is 1772 (covers 2.2.3 faction leader installs);
// pass --1856 to switch to 1856 (covers 2.2.1 Speaker, 2.2.2 committees, 2.2.4
// party leaders, 2.3.1 cabinet, 2.6.3 bill sponsor).
const use1856 = process.argv.includes('--1856');
const { build1856Scenario } = await import('../src/data/scenario1856');
const snap: FullGameSnapshot = use1856
  ? build1856Scenario('fact_blue_cons')
  : build1772Scenario('fact_blue_lw_1772');
console.log(`Scenario: ${use1856 ? '1856' : '1772'}`);

console.log(`Built scenario: year=${snap.game.year}, phase=${snap.game.phaseId}, factions=${snap.factions.length}, politicians=${snap.politicians.length}`);

// Drive the inaugural draft to completion via auto-pick.
runCurrentPhase(snap); // Seeds the inaugural draft pool + round order.
while (snap.game.draftRoundOrder.length > 0) {
  const r = simOneDraftPick(snap);
  if (r.needsPlayer) autoPickForPlayer(snap);
}
console.log(`Draft complete: ${snap.politicians.length} politicians, draftRoundOrder.length=${snap.game.draftRoundOrder.length}`);

// Now advance phases up to ~50 times, running through the 1772 turn and a few more.
// Each loop: runCurrentPhase, then advancePhase.
let phasesRun = 0;
const eventCountBefore = snap.events.length;
const skipPhases = new Set(['2.4.2', '2.4.3']); // Vite-injected import.meta.env throws under tsx; skip.
let skippedCount = 0;
for (let i = 0; i < 200; i++) {
  if (skipPhases.has(snap.game.phaseId)) {
    advancePhase(snap);
    skippedCount++;
    continue;
  }
  let res: ReturnType<typeof runCurrentPhase>;
  try {
    res = runCurrentPhase(snap);
  } catch (e) {
    console.log(`Phase ${snap.game.phaseId} threw: ${(e as Error).message.slice(0, 80)} — skipping.`);
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
    if (evt && evt.responses && evt.responses.length > 0) {
      const { resolveEraEvent } = await import('../src/engine/phaseRunners');
      resolveEraEvent(snap, evt.id, evt.responses[0].id);
    }
  } else if (res.needsPlayerInput === 'ccBuilder') {
    const payload = res.payload as { stateId: string; eligible: { id: string }[] };
    const { playerCCDelegatePick } = await import('../src/engine/phaseRunners');
    if (payload && payload.eligible && payload.eligible[0]) {
      playerCCDelegatePick(snap, payload.stateId, payload.eligible[0].id);
    }
  } else if (res.needsPlayerInput === 'ccAIConfirm') {
    const { confirmCCAIPick } = await import('../src/engine/phaseRunners');
    confirmCCAIPick(snap);
  }
  advancePhase(snap);
  phasesRun++;
}
console.log(`Ran ${phasesRun} phases; skipped ${skippedCount} (vite-env phases).`);
const eventCountAfter = snap.events.length;

console.log(`Ran ${phasesRun} phases. Events: ${eventCountBefore} -> ${eventCountAfter}`);

// Filter for PR2b-specific earn lines.
const pr2bPatterns = [
  /gains Command leading the/i,
  /gains Legislative leading the/i,
  /gains Governing leading the/i,
  /gains Admin leading the/i,
  /gains Legislative from the Speaker/i,
  /gains Legislative from the Pro Tem/i,
  /gains Command from chairing/i,
  /gains Legislative from chairing/i,
  /gains Legislative from the committee chair/i,
  /gains Admin from confirmation/i,
  /gains Command from the Secretary of State portfolio/i,
  /gains Command as wartime/i,
  /gains Command from passage of/i,
  /grows in stature commanding/i,
  /re-elected leader of/i,
];

const matches = snap.events.filter((e) =>
  pr2bPatterns.some((rx) => rx.test(e.text ?? ''))
);

console.log(`\nPR2b-specific earn lines fired: ${matches.length}`);
for (const m of matches.slice(0, 40)) {
  console.log(`  [${m.year} ${m.phase} ${m.category}] ${m.text}`);
}

// Per-phase breakdown of all events.
const phaseCounts: Record<string, number> = {};
for (const e of snap.events) {
  phaseCounts[e.phase ?? '?'] = (phaseCounts[e.phase ?? '?'] ?? 0) + 1;
}
console.log(`\nEvents by phase: ${JSON.stringify(phaseCounts)}`);

// Sample 5 events from each PR2b-relevant phase.
const relevantPhases = ['2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.3.1', '2.3.2', '2.6.3', '2.7.2'];
for (const ph of relevantPhases) {
  const inPhase = snap.events.filter((e) => e.phase === ph);
  console.log(`\nPhase ${ph}: ${inPhase.length} events`);
  for (const e of inPhase.slice(0, 5)) console.log(`    ${e.text}`);
}

// Write a summary JSON.
const summary = {
  scenario: '1772',
  finalYear: snap.game.year,
  finalPhase: snap.game.phaseId,
  totalEvents: snap.events.length,
  pr2bEarnLines: matches.length,
  pr2bEarnSamples: matches.slice(0, 80).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
  phaseCounts,
};
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(`\nWrote ${OUT}`);
