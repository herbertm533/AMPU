# Playtest script convention

This is the playbook for the engine-smoke artifact every `/build-feature`
ships alongside the spec, brief, and build. The `qa-tester` agent writes one
of these per feature; humans can re-run them after future engine changes to
catch regressions.

The convention is **proven**, not theoretical — see the in-repo precedents:

- `scripts/playtestEngineEarn.ts` (PR2b, abilities earn expansion)
- `scripts/smokeTestAbilitiesEarn.mjs` (PR2b, unit-style assertions)
- `scripts/playtestTraitLoss.ts` (PR3, trait loss + d6 conflict — combines
  both shapes into one file)

For a new feature, copy `scripts/playtestTraitLoss.ts` as the starting
template (it's the most complete) and adapt the four feature-specific blocks.

## What a playtest script is, and isn't

It **is** an engine-level smoke. It boots the actual pure-function engine
(no React), drives a scenario through many phases, and verifies:

- helper modules' contracts (with stubbed `Math.random` for determinism)
- typed const tables (presence, shape, values from the brief)
- runtime behavior over a long scenario (no exceptions, expected log lines
  fire, counts in the expected order of magnitude)

It **is not** a UI test. It cannot render React, cannot click buttons,
cannot take screenshots. Those still belong to the human playtest at CP5.

It **is not** a balance test. Counts in the trace tell you the mechanic
**fires**; whether the rate feels right is human judgment.

## Required structure

A playtest script has **three parts** in this order:

### Part 1 — contract tests for new helpers / consts (stubbed RNG)

For every helper module the feature introduces (e.g. `src/engine/traits.ts`,
`src/engine/abilities.ts`), assert the contract directly:

```ts
const realRandom = Math.random;
let stubbedRandom: () => number = realRandom;
Math.random = () => stubbedRandom();

let pass = 0, fail = 0;
const failures: string[] = [];
function assert(cond: boolean, label: string) {
  if (cond) pass++;
  else { fail++; failures.push(label); }
}

// ... assertions ...

stubbedRandom = realRandom;
Math.random = realRandom;
```

Cover the **full resolution table** of every helper. For a function with
N input cases and M states, write N×M assertions. The PR3 helper had
6 cases × 7 conflict pairs = 42 d6-resolution assertions plus the rest
of the contract; the script clears 101 assertions in well under a second.

Also assert the **shape and values of every new typed const** the brief
introduces (e.g. `TRAIT_LIFECYCLE_RULES.conflictD6Threshold === 4`). Catches
silent drift if the const is reshuffled.

### Part 2 — engine scenario drive

Boot the 1772 scenario (and/or 1856 if the feature touches it), auto-resolve
player input, drive ~500 phases. The PR3 script reached year 1834 from 1772
in 538 phases — long enough to see many half-terms, repeated election cycles,
old-age decay window, etc.

```ts
const snap = build1772Scenario('fact_blue_lw_1772');
runCurrentPhase(snap); // seeds inaugural draft
while (snap.game.draftRoundOrder.length > 0) {
  const r = simOneDraftPick(snap);
  if (r.needsPlayer) autoPickForPlayer(snap);
}

const skipPhases = new Set(['2.4.2', '2.4.3']); // see "coverage gaps"
let phasesRun = 0, skipped = 0;
const errors: { phase: string; err: string }[] = [];
for (let i = 0; i < 600; i++) {
  if (skipPhases.has(snap.game.phaseId)) {
    advancePhase(snap); skipped++; continue;
  }
  try {
    const res = runCurrentPhase(snap);
    // ... auto-resolve needsPlayerInput: draft/eraEvent/ccBuilder/ccAIConfirm/convention ...
  } catch (e) {
    errors.push({ phase: snap.game.phaseId, err: (e as Error).message.slice(0, 120) });
    advancePhase(snap); skipped++; continue;
  }
  advancePhase(snap);
  phasesRun++;
}
```

### Part 3 — event classification + trace JSON

Match the events log against feature-specific regex patterns to count
mechanic fires:

```ts
const swapPatterns = [/sheds .* and earns/i, /sheds .* — .* now/i];
const failedPatterns = [/holds .* on a d6/i, /would have gained .* but/i];

const swapEvents = snap.events.filter((e) =>
  swapPatterns.some((rx) => rx.test(e.text ?? '')),
);
console.log(`d6 swap won: ${swapEvents.length}`);
// ... sample 6 of each, log them ...
```

Write a trace JSON to `docs/playtest/<slug>/engine-trace.json` with the same
shape PR3 uses: `contractTests`, `finalYear`, `phasesRun`, `phasesSkipped`,
`errorPhases`, feature-specific counts, sampled events. Future runs can diff
this file to catch regressions.

## Coverage gaps (the limits to be honest about)

These are real and apply to **every** playtest script under the current
container setup. Always declare them in the agent's coverage report.

| Gap | Why | Workaround |
|---|---|---|
| **UI rendering** | No browser in the remote container (`chromium-cli`, `playwright`, `puppeteer` unavailable). | Human playtest at CP5. |
| **Phase 2.4.2** (anytime events) | Vite's `import.meta.env` is undefined under Node; the phase runner trips on it. | Always skipped. Mechanics gated behind anytime events (most `grantTrait` templates, most scandal paths) are NOT exercised. |
| **Phase 2.4.3** (era events) | Same. | Always skipped. Anything triggered by era events — including Rev War (and therefore battle-loss paths in `2.7.2` that depend on Rev War having fired) — is NOT exercised. |
| **Balance / aesthetics** | A trace JSON can't tell you whether a rate feels right or a log line reads cleanly. | Human judgment. |
| **RNG-dependent rarities** | The auto-playtest uses real `Math.random`. A specific RNG-dependent event (e.g., scandal hitting a particular politician) may or may not fire in any given run. | Re-run the script; or stub `Math.random` for a targeted check. |

If a feature's mechanics live primarily behind one of these gates, the
playtest will be thinner than for an engine-resident feature. **State that
explicitly in the coverage report** so the human checklist at CP5 is
appropriately weighted.

## Output expected from the qa-tester agent

Three artifacts, committed to the feature branch:

1. `scripts/playtest<Slug>.ts` (or `.mjs` if no engine import is needed) — the smoke script
2. `docs/playtest/<slug>/engine-trace.json` — the run's trace
3. A coverage report posted in the agent's reply (and effectively
   embedded as the commit message). Shape:

```
## Playtest: <feature>

Build:  PASS / FAIL
Contract tests: <n>/<m> pass — <failures inline>
Engine drive: <phases> phases, <skipped> skipped, <errors> errors,
              year <start> -> <end>

### Feature counts (observed)
- <signature 1>: <n>
- <signature 2>: <n>
- ...

### Coverage gaps
- <bullet list — items the smoke could NOT reach, why,
   and what the human playtest checklist must therefore cover>

### Suggested CP5 checklist
- <items here are the ACs that need human eyes,
   pruned from the reviewer's list by removing anything the smoke verified>
```

## How to run a playtest script

From the repo root:

```bash
npx tsx scripts/playtest<Slug>.ts
```

`tsx` is on the dev node modules path; no install needed.

For long runs, redirect to a file and grep:

```bash
npx tsx scripts/playtest<Slug>.ts | tee /tmp/playtest.log
grep -E "d6 swap|failed-d6|FAIL" /tmp/playtest.log
```

The trace JSON is the authoritative artifact; the stdout log is for
fast-scan triage during the agent run.
