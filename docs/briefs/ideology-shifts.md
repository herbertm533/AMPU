# Brief: Ideology Shifts (Phase 2.1.5)

## Approach
Delete the 5% random-walk `runPhase_2_1_5_Ideology` (phaseRunners.ts:593–611, both `addLog`s removed, not replaced) and rebuild the 2.1.5 section as a structural clone of the relocations system: the 2.1.5 resting window (engine.ts:32 already dispatches with `return {}`) is the player's attempt window; the Advance-out tick runs trait seeding → counter reset → CPU pass → passive drift → one `refreshPv` → one conditional summary log. Every active attempt (player and CPU, self and opposed) flows through one shared private resolver `resolveIdeologyShift(snap, actorFactionId, p)` that owns validation, the counter/stamp writes, the trait-modified roll, the one-step move toward the actor's live faction center, the opposed flip-flopper roll, and the feed append. Two exported pure helpers — `factionCenter` and `ideologyShiftOdds` — are used by both the resolver and the new page, so previewed odds and step targets are structurally what the engine rolls (the `relocationOdds` precedent). All numbers live in types.ts as `IDEOLOGY_SHIFT_ODDS` (engine + legend single source). Rejected alternative: passing `kind` as a resolver parameter — kind is fully derivable from actor-vs-subject faction, and a parameter would let a future caller desync the two; deriving it makes "self requires same faction / opposed requires a different, non-null faction" structural rather than policed. (Lazy tick-time trait seeding over constructor/repair() seeding inherits the relocations checkpoint decision unchanged.)

## State & type changes
- `/home/user/AMPU/src/types.ts`:
  - `Trait` union (ends `'Outsider'`, line 102): append `| 'Ideologue' | 'Impressionable'`.
  - `POSITIVE_TRAITS` (ends `'Leadership'`, line 130): append `'Ideologue'` (**+4 PV — positive, per checkpoint**). `NEGATIVE_TRAITS` (ends `'Outsider'`, line 147): append `'Impressionable'` (−5 PV). pv.ts imports the canonical lists (pv.ts:2) — **zero pv.ts edits**. No exhaustive `Record<Trait, …>` exists anywhere (verified), so the union additions break nothing.
  - `Politician` — directly after `lastRelocationAttemptYear?: number;` (line 233) add:
    ```ts
    ideologyTraitsSeeded?: boolean;
    lastIdeologyAttemptYear?: number; // stamps ATTEMPTS incl. failures, not shifts
    ```
  - `GameState` — directly after `relocationAttempts?` (line 536) add:
    ```ts
    ideologyShifts?: IdeologyShiftEntry[];
    ideologyAttempts?: { year: number; counts: Record<string, number> };
    ```
  - New interface directly after `RelocationEntry` (line 575):
    ```ts
    export interface IdeologyShiftEntry {
      year: number;
      politicianId: string;
      subjectFactionId: string | null; // subject's faction at shift time (feed: actor OR subject)
      actorFactionId?: string;         // absent on passive drift entries
      kind: 'drift' | 'stateBias' | 'self' | 'opposed';
      fromIdeology: Ideology;
      toIdeology: Ideology;            // === fromIdeology on failed attempts
      success: boolean;                // always true on drift entries (movements only)
      flipFlopper: boolean;            // opposed success that also landed the FF roll
    }
    ```
  - New consts directly after `CARPETBAGGER_LADDER` (line 194) — single source for engine AND legend:
    ```ts
    // Ideology-shift tables — single source for engine rolls AND the page legend.
    export const IDEOLOGY_SHIFT_ODDS = {
      drift: { faction: 0.08, stateBias: 0.04, stateBiasMin: 1.0, residual: 0.01 },
      attempt: { self: 0.65, opposed: 0.15, ffRisk: 0.5 }, // ffRisk is NOT trait-modified
      traitMods: {
        Ideologue: { drift: 0, self: 0.5, opposed: 0.25 },
        Impressionable: { drift: 2, self: 1, opposed: 2 },
      },
      seed: { ideologue: 0.1, impressionable: 0.08 }, // remainder (0.82) = neither
      cpu: { selfGate: 0.3, selfBudget: 3, opposedGate: 0.1, opposedScan: 10 },
    } as const;
    export const IDEOLOGY_ATTEMPTS_PER_TURN = 5;
    export const IDEOLOGY_SHIFTS_CAP = 200;
    ```
    `as const` notes: literal-typed numbers widen fine in arithmetic, so `rate * mult` and the legend's `pct(...)` products need no casts. `traitMods` is deliberately NOT keyed by the full `Trait` type — access is by literal property (`traitMods.Ideologue[kind]` with `kind: 'drift' | 'self' | 'opposed'`), guarded by `p.traits.includes('Ideologue')` checks in `traitMult` below; never index it with an arbitrary `Trait`.
- **Save/migration impact**: all new fields optional — existing IndexedDB saves load unchanged. **No repair() changes** (binding). Legacy politicians are "unseeded" until their first 2.1.5 tick; the tick's eager `ideologyShifts` init is the only array init. The first window after load shows no new traits and base odds — previews still match rolls exactly (×1 multipliers).

## Engine changes (pure logic)
All in `/home/user/AMPU/src/engine/phaseRunners.ts`, replacing the 2.1.5 section (delete lines 593–611 wholesale). Import additions: `IdeologyShiftEntry` to the type import (line 1); `IDEOLOGY_SHIFT_ODDS`, `IDEOLOGY_ATTEMPTS_PER_TURN`, `IDEOLOGY_SHIFTS_CAP` to the value import (line 2). `chance`/`rand`/`clamp`/`pick`, `IDEOLOGY_ORDER`, `refreshPv`, `addLog` are already imported. All randomness via rng.ts; all passes iterate `snap.politicians` / `snap.factions` in array order. `engine.ts`, `phases.ts`, `pv.ts`: **no changes** (2.1.5 already rests via `return {}`, has no gate, and runs on the 1772 first turn — 2.1.3 FF decay is first-turn-skipped, 2.1.5 is not).

- **New private `ideologyAttemptCounts(snap): Record<string, number>`** — exact clone of `attemptCounts` (442–448) over `g.ideologyAttempts` (lazy year normalization; the only counter accessor; named distinctly because `attemptCounts` already exists in this file). Same-year counts always survive, so the player's pre-tick attempts are never wiped by the tick.

- **New private `traitMult(p: Politician, kind: 'drift' | 'self' | 'opposed'): number`** — multiplicative composition:
  ```ts
  let m = 1;
  if (p.traits.includes('Ideologue')) m *= IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue[kind];
  if (p.traits.includes('Impressionable')) m *= IDEOLOGY_SHIFT_ODDS.traitMods.Impressionable[kind];
  return m;
  ```
  Both-traits hand-edit edge composes correctly: drift 0 × 2 = 0 (Ideologue dominates).

- **New exported pure `factionCenter(snap: FullGameSnapshot, factionId: string): number | null`** — mean `IDEOLOGY_ORDER` index over members with `p.factionId === factionId && !p.deathYear && !p.retiredYear`; `null` when no such members; else `Math.round(mean)` (JS half-up: a x.5 mean rounds toward RW — deterministic, document in a one-line comment). Always lands in [0,6]. Deliberately diverges from 2.1.8's unfiltered (dead-counting) average; 2.1.8 (650–659) is untouched.

- **New private `stepToward(fromIdx: number, targetIdx: number): number`** — `fromIdx === targetIdx ? fromIdx : fromIdx + Math.sign(targetIdx - fromIdx)`. Single-step, no overshoot by construction.

- **New exported pure `ideologyShiftOdds(p: Politician, kind: 'self' | 'opposed', actorCenter: number): { success: number; ffRisk: number; from: Ideology; to: Ideology }`** — the preview === roll seam:
  ```ts
  success = clamp(IDEOLOGY_SHIFT_ODDS.attempt[kind] * traitMult(p, kind), 0, 1);
  ffRisk  = kind === 'opposed' ? IDEOLOGY_SHIFT_ODDS.attempt.ffRisk : 0;
  from = p.ideology; to = IDEOLOGY_ORDER[stepToward(IDEOLOGY_ORDER.indexOf(p.ideology), actorCenter)];
  ```
  The clamp guards future tuning (current max product is 0.30). `to === from` only when the subject is at `actorCenter` — the resolver rejects that case before rolling and the page disables the action, so a resolved attempt always has `to !== from`.

- **New private `recordIdeologyShift(snap, entry: IdeologyShiftEntry)`** — mirror of `recordRelocation` (466–471): init array, push, `splice(0, len - IDEOLOGY_SHIFTS_CAP)`.

- **New private `resolveIdeologyShift(snap, actorFactionId: string, p: Politician): IdeologyShiftEntry | null`** — the single attempt path (player and CPU). **Return contract (code comment required): `null` = REJECTED, nothing meaningful changed (only a harmless stale-year counter normalization); non-null = the attempt RAN — counter, stamp, and feed are mutated whether the roll succeeded or failed.** Kind is DERIVED, never passed. Order:
  1. Validation, any failure → `null`: `g.phaseId !== '2.1.5'`; `p.deathYear || p.retiredYear` (**`currentOffice` deliberately NOT checked — in-office politicians are valid subjects**); `!p.factionId` (factionless are never subjects); derive `const kind = p.factionId === actorFactionId ? 'self' : 'opposed';` (steps 3+4 make the opposed "different, non-null faction" rule structural); `const center = factionCenter(snap, actorFactionId)` — **live** — `center === null` → null; `IDEOLOGY_ORDER.indexOf(p.ideology) === center` (at-center, nothing to gain); `p.lastIdeologyAttemptYear === g.year` (subject lock — one attempt per subject per turn regardless of attacker); `(ideologyAttemptCounts(snap)[actorFactionId] ?? 0) >= IDEOLOGY_ATTEMPTS_PER_TURN` (cap).
  2. Charge: `counts[actorFactionId] = (counts[actorFactionId] ?? 0) + 1`; `p.lastIdeologyAttemptYear = g.year` (**stamps failures too**). Capture `const from = p.ideology` before mutation.
  3. `const { success: pS, ffRisk, to } = ideologyShiftOdds(p, kind, center);` roll `const success = chance(pS);` — exactly one success draw per resolved attempt.
  4. On success: `p.ideology = to;` then iff `kind === 'opposed'`: `chance(ffRisk)` → `p.flipFlopperPenalty += 1` and `flipFlopper = true` (the only extra draw, opposed-success only; counter-only v1, no `'Flip-Flopper'` trait grant — same counter 2.1.6 increments at line 626 and 2.1.3 decays at 427–435).
  5. Build `{ year, politicianId: p.id, subjectFactionId: p.factionId, actorFactionId, kind, fromIdeology: from, toIdeology: success ? to : from, success, flipFlopper }`, `recordIdeologyShift`, return it. **No `addLog`, no `refreshPv` inside** (callers own PV refresh).

- **New exported `attemptPlayerIdeologyShift(snap, politicianId: string): boolean`** — find `p`; `!p` → `false`; `const entry = resolveIdeologyShift(snap, snap.game.playerFactionId, p);` `!entry` → `false`; `if (entry.flipFlopper) snap.politicians = refreshPv(snap.politicians);` return `true`. No destination/kind parameter — kind derives from the subject's faction, direction is always toward the player's live center. **PV refresh is FF-conditional and sufficient**: `flipFlopperPenalty` IS a PV input (pv.ts:82) and is the only PV input the resolver can touch — ideology itself never enters `computePV`. No attempt gate: the click IS the roll. **Boolean contract (code comment, clone of `attemptPlayerRelocation`:520–522): `true` = the attempt RAN — a failed roll returns `true` and HAS mutated counter + stamp + feed and must persist; `false` = rejected, nothing meaningful changed.**

- **Rewritten `runPhase_2_1_5_Ideology(snap): void`** — exact order:
  1. `if (!snap.game.ideologyShifts) snap.game.ideologyShifts = [];`
  2. **Trait-seed pass** — for each politician in array order: skip `deathYear || retiredYear || ideologyTraitsSeeded`. If `p.traits` already includes `'Ideologue'` or `'Impressionable'` → set sentinel only (no roll). Else one partitioned roll `const r = rand()`: `r < IDEOLOGY_SHIFT_ODDS.seed.ideologue` (0.10) → push `'Ideologue'`; `else if (r < seed.ideologue + seed.impressionable)` (0.18) → push `'Impressionable'`; else neither (mutually exclusive). Always `p.ideologyTraitsSeeded = true`. In-office and factionless politicians ARE seeded.
  3. `ideologyAttemptCounts(snap);` — lazy counter reset for the new year (no-op when the player already attempted this turn).
  4. **Tick-start center map** — `const centers = new Map<string, number | null>(); for (const f of snap.factions) centers.set(f.id, factionCenter(snap, f.id));` — built **BEFORE the CPU pass** so the drift pass measures the turn-start environment, untouched by this tick's CPU successes.
  5. **CPU pass** — `let cpuAttempts = 0;` for each `f` of `snap.factions` in array order, skip `f.id === snap.game.playerFactionId` (convention: id comparison, not `isPlayer`). Per faction:
     - `const center = factionCenter(snap, f.id); if (center === null) continue;` — live pass-start center, used for candidate SELECTION only; the resolver re-validates everything live per attempt (mid-pass center movement can turn a selected candidate into a clean rejection — no charge, by design).
     - **Self pass**: candidates = members (`factionId === f.id`), alive, non-retired, off `center`, unstamped (`lastIdeologyAttemptYear !== year`); sort by `Math.abs(idx - center)` desc, then `pvCache` desc, then `id` asc (`localeCompare`). Iterate with `let selfUsed = 0;`: break when `(ideologyAttemptCounts(snap)[f.id] ?? 0) >= IDEOLOGY_ATTEMPTS_PER_TURN` or `selfUsed >= IDEOLOGY_SHIFT_ODDS.cpu.selfBudget`; per candidate `chance(cpu.selfGate)` (30%); on gate pass → `const e = resolveIdeologyShift(snap, f.id, p);` non-null → `selfUsed++; cpuAttempts++;`.
     - **Opposed pass**: candidates = politicians with `p.factionId && p.factionId !== f.id` (**player's included — CPUs DO target the player**), alive, non-retired, **`p.currentOffice` truthy** (officeholder heuristic — player targeting is broader, CPU's is not), off `center`, unstamped; sort `pvCache` desc, then `id` asc; `slice(0, cpu.opposedScan)` (top 10). Iterate: break when capped; per candidate `chance(cpu.opposedGate)` (10%); gate pass → resolver; non-null → `cpuAttempts++`.
     - Failed gate rolls consume nothing (no counter, no stamp, no feed) — relocations precedent. Cap and subject lock are enforced structurally by the resolver, never by policy discipline.
  6. **Passive drift pass** — `let driftCount = 0;` for each politician in array order: skip `deathYear || retiredYear`; skip `p.lastIdeologyAttemptYear === snap.game.year` (covers the player's window attempts AND this tick's CPU stamps — drift never writes the stamp itself); `const dm = traitMult(p, 'drift'); if (dm === 0) continue;` (Ideologue immunity — explicit skip, zero RNG draws; both-traits composes to 0). Cascade — up to three rolls, at most one move, first success ends the chain:
     - **Rung 1 (faction, 8%)**: applicable iff `p.factionId` non-null AND `centers.get(p.factionId)` is a number AND `idx !== center` (tick-start map, NOT live). `chance(drift.faction * dm)` → move `stepToward(idx, center)`, kind `'drift'`. Stop-at-center is structural (single step toward).
     - **Rung 2 (state, 4%)**: reached iff rung 1 inapplicable or missed. `const st = snap.states.find((s) => s.id === p.state);` applicable iff `st && Math.abs(st.bias) >= drift.stateBiasMin` AND the step stays in [0,6] (`dir = st.bias > 0 ? 1 : -1` — positive bias = red = higher index). `chance(drift.stateBias * dm)` → move `idx + dir`, kind `'stateBias'`. NOT center-bound — may move past/away from the faction center by design.
     - **Rung 3 (residual, 1%)**: reached iff rungs 1–2 inapplicable or missed. `chance(drift.residual * dm)` → only then `const dir = chance(0.5) ? 1 : -1;` (direction draw AFTER the rate hit — two draws on a residual hit); `idx + dir` outside [0,6] → no-op, unrecorded; else move, kind `'drift'`.
     - A movement = `p.ideology = IDEOLOGY_ORDER[newIdx]`, append `{ year, politicianId, subjectFactionId: p.factionId, kind, fromIdeology, toIdeology, success: true, flipFlopper: false }` (no `actorFactionId` key) via `recordIdeologyShift`, `driftCount++`. Failed/no-op rolls are non-events. Factionless politicians skip rung 1 (state + residual only); their `subjectFactionId: null` entries are feed-invisible by filter.
  7. `snap.politicians = refreshPv(snap.politicians);` — unconditional (covers seeded trait PV deltas + CPU FF hits; drift alone never moves PV).
  8. `if (driftCount + cpuAttempts > 0) addLog(snap, '2.1.5', 'system', \`Ideological currents: ${driftCount} politicians drifted; ${cpuAttempts} shift attempts resolved.\`);` — tick events only (player attempts already surfaced in the feed); at most one line; silent when idle. **No other logs anywhere in 2.1.5 code.**

- **PV/election impact**: no formula changes. PV inputs touched: the two new traits (+4/−5 at seed time) and the existing `flipFlopperPenalty` counter (−5/stack). Opposed FF hits land before this turn's 2.9.x — intended. Ideology movement feeds 2.6.3 floor votes (−5% yea per step of distance, line 1238) and the 2.1.8 personality rollup through existing reads only.

## UI changes
- `/home/user/AMPU/src/state/GameContext.tsx`:
  - Add `attemptPlayerIdeologyShift` to the phaseRunners import (line 7).
  - `GameContextValue`: add `attemptIdeologyShift: (politicianId: string) => Promise<void>;` after `attemptRelocation` (line 32).
  - Implementation directly after `attemptRelocation` (335–343), exact clone with the same contract comment: deep-clone → `if (!attemptPlayerIdeologyShift(draft, politicianId)) return;` → `setSnapshot(draft)` + `await persist(draft)`. Persist-on-`true` correctly persists failed rolls (counter/stamp/feed changed). Add to the `value` object after `attemptRelocation` (line 412). `repair()` untouched (binding).
- `/home/user/AMPU/src/App.tsx`: add `const lastIdeologyEntryKey = useRef<string | null>(null);` after line 16 and a FOURTH effect after the relocations one (54–67), same shape: `phaseId === '2.1.5'` (unconditional — fires even with nothing to do), key `` `${g.year}:2.1.5` ``, `setPage('ideology')` once per entry; else-branch resets the ref. Deps: `snapshot?.game.phaseId`, `snapshot?.game.year`. Phase-scoped keys keep all four effects from fighting.
- `/home/user/AMPU/src/pages/registry.ts`: import `IdeologyShifts`; add `| 'ideology'` to `PageId` after `'relocations'` (line 33); add `ideology: IdeologyShifts,` to `Pages` after `relocations` (line 62).
- `/home/user/AMPU/src/components/Sidebar.tsx`: insert `{ id: 'ideology', label: 'Ideology Shifts' }` between `relocations` (line 35) and `kingmakers` → Roster, Faction Leader, Career Tracks, Relocations, Ideology Shifts, Kingmakers & Protégés, Draft.
- `/home/user/AMPU/src/pages/IdeologyShifts.tsx` — **new page**, cloned block-by-block from Relocations.tsx with these exact divergences:
  - Imports: `useGame`; `SortableTable`/`Column`; `PartyBadge`; from types: `IDEOLOGY_SHIFT_ODDS`, `IDEOLOGY_ATTEMPTS_PER_TURN`, `NEGATIVE_TRAITS`, `IDEOLOGY_ORDER` + type `Politician`; from `'../engine/phaseRunners'`: `factionCenter`, `ideologyShiftOdds` (the sanctioned pure page→engine import, relocations precedent). Clone the `pct` helper (Relocations.tsx:21).
  - **Component state**: `viewFactionId: string | null`, `statusFilter`, and `confirming: { politicianId: string } | null` — **no destId** (the to-step is determined: always one step toward the player's center). Dropdown `onChange` resets `confirming` to null (clone of Relocations.tsx:175).
  - Derived: `activeFactionId`/`isPlayerView` (clone); `kind: 'self' | 'opposed' = isPlayerView ? 'self' : 'opposed'` (uniform per view — every row in a viewed roster shares the faction); `shiftLocked = g.phaseId !== '2.1.5'`; **`playerCenter = factionCenter(snapshot, playerFactionId)` — live every render** (mid-window shifts move your own center and re-validate statuses in the same render); `attempts = g.ideologyAttempts?.year === g.year ? (g.ideologyAttempts.counts[playerFactionId] ?? 0) : 0` — **ALWAYS the player's count, both views** (binding deviation from the relocations viewed-faction badge: you spend YOUR attempts regardless of viewed roster); `capReached`.
  - `statusOf(p)` — `type StatusFilter = 'all' | 'available' | 'attempted' | 'atCenter';` (decided: NO `inOffice` status/filter — in-office is not a disable cause here and rows are fully actionable; this is the deliberate divergence from relocations' status set). Stamped (`lastIdeologyAttemptYear === g.year`) → `'Attempted this turn'` (takes precedence); else `playerCenter !== null && IDEOLOGY_ORDER.indexOf(p.ideology) === playerCenter` → `'At center'`; else `'Available'`. Reference center is ALWAYS the player's, in both views. Status filter `<select>` at the bottom (clone 304–314) with the four options.
  - **Header** (clone 162–183): title "Ideology Shifts"; attempts badge "Attempts: {attempts} / {IDEOLOGY_ATTEMPTS_PER_TURN}", amber at cap; `PartyBadge`; functional faction dropdown (player first, "(you)" suffix). Intro paragraph: one sentence on drift + agency; amber note when `shiftLocked` ("Shifts are locked until the Ideology Shifts phase."); on other-faction views an amber note that Target pulls rivals toward YOUR center and risks branding them flip-floppers — NOT "read-only" (deviation: the dropdown is actionable).
  - **Roster table** (clone column patterns 96–158): rows = viewed faction's living, non-retired politicians, filtered by status. Columns — Name, St, Age, Ideology (`IDEOLOGY_ORDER` sortValue), PV, Traits (red when in `NEGATIVE_TRAITS` — `Impressionable` auto-renders red, `Ideologue` neutral), **FF** (`sortValue: p.flipFlopperPenalty`; render the count in rose styling only when `> 0`, else `<span className="text-slate-400">—</span>`; right-aligned — first UI surfacing of `flipFlopperPenalty` anywhere), Status, **Action**. **No skill columns** (vision-binding). Action button label: `isPlayerView ? 'Shift' : 'Target'`; onClick `setConfirming({ politicianId: p.id })`.
  - Action disabled + `title` precedence (spec order, with the degenerate guard slotted before the at-center check because at-center is unevaluable without a center): `shiftLocked` → "Shifts open during the Ideology Shifts phase"; `capReached` → `` `No attempts remaining this phase (${IDEOLOGY_ATTEMPTS_PER_TURN}/${IDEOLOGY_ATTEMPTS_PER_TURN})` ``; stamped → "Already attempted this turn"; `playerCenter === null` → "Your faction has no living members"; at player center → "Already at your faction's center". **No `!isPlayerView` cause and no in-office cause.** Disabled, never hidden; the resolver is the real enforcement.
  - **Confirm card** (clone picker card 192–240, minus the destination `<select>`): heading `isPlayerView ? 'Shifting:' : 'Targeting:'` + name + (ST). Readout from `confirmingPol && playerCenter !== null ? ideologyShiftOdds(confirmingPol, kind, playerCenter) : undefined`: `{odds.from} → {odds.to}` arrow, `Success: {pct(odds.success)}%` (trait-modified — an Ideologue target previews 3.75%), and only when `kind === 'opposed'`: `Flip-flopper risk on success: {pct(odds.ffRisk)}%` in rose. Buttons: **Attempt** — disabled/titled by the SAME row logic (stale-panel guard) → `await attemptIdeologyShift(confirmingPol.id); setConfirming(null);` (result visible same render: feed entry, status flips, badge increments); **Cancel** → null.
  - **Feed** (clone 84–88 + 277–302): `(g.ideologyShifts ?? []).filter((e) => e.actorFactionId === activeFactionId || e.subjectFactionId === activeFactionId).slice(-20).reverse()` — actor-OR-subject, so attacks ON the viewed faction appear (one opposed entry shows in two factions' feeds). Row: year (mono), kind badge from a local `KIND_LABELS: Record<IdeologyShiftEntry['kind'], string>` map (`drift` → "Drift", `stateBias` → "State", `self` → "Self", `opposed` → "Opposed"; neutral slate badge styling), politician name lookup, `{fromIdeology} → {toIdeology}` (renders `X → X` on failures), Success (emerald) / Failed (rose) badge, and a rose "Flip-Flopper +1" badge when `e.flipFlopper`. Empty: "No ideology shifts yet."
  - **Legend** `<details>` (clone 242–275), rendered entirely from `IDEOLOGY_SHIFT_ODDS` / `IDEOLOGY_ATTEMPTS_PER_TURN` — zero literals in JSX: the drift cascade (faction `pct(drift.faction)`%, state `pct(drift.stateBias)`% when |bias| ≥ `drift.stateBiasMin`, residual `pct(drift.residual)`%; one move max, first success ends the chain); the faction-center definition (living-member mean, rounded); self vs opposed odds + FF risk, the −5 PV per stack and the −1/turn decay; a trait table rendered from `traitMods` (rows Ideologue/Impressionable × columns Drift/Self/Opposed, shown as ×N multipliers with effective %s computed inline, e.g. `pct(attempt.self * traitMods.Ideologue.self)`); seed rates incl. the computed neither-share; the {IDEOLOGY_ATTEMPTS_PER_TURN}-attempt cap (failures count); the one-attempt-per-subject lock; the phase lock; that in-office politicians are valid subjects.
  - **Empty roster**: `base.length === 0` → player view "No politicians to shift.", other view "This faction has no active politicians."; feed and legend always render.

## Files to touch (exact, ordered)
1. `/home/user/AMPU/src/types.ts` — Trait union + POSITIVE_TRAITS/NEGATIVE_TRAITS additions; `Politician.ideologyTraitsSeeded`/`lastIdeologyAttemptYear`; `GameState.ideologyShifts`/`ideologyAttempts`; `IdeologyShiftEntry`; `IDEOLOGY_SHIFT_ODDS`, `IDEOLOGY_ATTEMPTS_PER_TURN`, `IDEOLOGY_SHIFTS_CAP`
2. `/home/user/AMPU/src/engine/phaseRunners.ts` — delete old 2.1.5 body (593–611); add `ideologyAttemptCounts`, `traitMult`, `factionCenter` (exported), `stepToward`, `ideologyShiftOdds` (exported), `recordIdeologyShift`, `resolveIdeologyShift`, `attemptPlayerIdeologyShift` (exported); rewrite `runPhase_2_1_5_Ideology`; import additions
3. `/home/user/AMPU/src/state/GameContext.tsx` — `attemptIdeologyShift` (interface + delegation + value); import; repair() untouched
4. `/home/user/AMPU/src/pages/IdeologyShifts.tsx` — new page: header/badge/functional dropdown, roster + FF/Status/Action columns, confirm card, feed with kind badges, legend, empty states
5. `/home/user/AMPU/src/pages/registry.ts` — `'ideology'` PageId + Pages entry + import
6. `/home/user/AMPU/src/components/Sidebar.tsx` — "Ideology Shifts" item after Relocations
7. `/home/user/AMPU/src/App.tsx` — `lastIdeologyEntryKey` ref + fourth auto-nav effect (key `` `${year}:2.1.5` ``, page `'ideology'`)

## Test / verification plan
- Build/typecheck: `npm run build`.
- Playtest 1856 (`npm run dev`, new game):
  1. Advance through draft → careers → relocations → rest at 2.1.5: fourth auto-nav lands on Ideology Shifts. First window: zero Ideologue/Impressionable badges anywhere (seeding is in the tick), previews show base 65%/15% — and rolls match (×1).
  2. Own view: pick an off-center stray — confirm card shows `{from} → {to}` one step toward your center and Success 65%; Attempt until the feed shows both a Success and a Failed Self row (failure records `X → X`, badge increments, row flips "Attempted this turn").
  3. Player center movement: after a successful self shift, verify "At center" statuses re-derive live in the same render (center is recomputed per render).
  4. Switch the dropdown to a rival: buttons read "Target", preview shows 15% + "Flip-flopper risk on success: 50%"; a rival already at YOUR center is disabled ("Already at your faction's center"); land an opposed hit → red "Flip-Flopper +1" badge in the feed, FF column shows 1, victim's PV dips 5.
  5. Spend all 5 attempts (self + opposed share the cap) → every Action disabled with "No attempts remaining this phase (5/5)".
  6. Reload mid-window: badge + stamps intact (persisted state), auto-nav refires. Outside 2.1.5 the buttons read "Shifts open during the Ideology Shifts phase" (page stays viewable).
  7. Advance (tick): feed gains Drift and State entries (no actor faction), CPU Self/Opposed entries **including attacks on your roster** (actor-OR-subject filter), Ideologue/Impressionable badges appear with ±PV deltas (first tick only), exactly one "Ideological currents: …" log line in the Event Log. Eyeball CPU volume ≈ 3 self + ~1 opposed per faction (cpu gates sign-off).
  8. Next turn: the FF victim's stack decayed by 1 at 2.1.3; the stamped politician from step 2 is attemptable again (year advanced +2 — stamp self-expired); a politician stamped this turn never appears in this turn's drift entries.
  9. Scale ends: a LW Populist in a blue-lean (bias ≤ −1.0) state never steps left (state rung inapplicable → cascades to residual; residual left-steps are unrecorded no-ops). Mirror at RW Populist.
  10. Over ~10 turns: 2.1.8 faction personalities cohere rather than dissolve; feed kind mix looks sane (~15–25 drifts/turn world-wide).
- 1772 smoke: first turn reaches 2.1.5 (2.1.5 is NOT first-turn-skipped; 2.1.3 is) with the inaugural class — no traits, base odds, no crash; over a few turns MA's +1.5 bias produces rightward State entries; only 4/13 colonies have |bias| ≥ 1.0.
- Edge cases from the spec to verify manually: empty/dead CPU faction → no center → cleanly inert (no crash, attempts toward it rejected); factionless politicians drift via state+residual only and never appear in faction feeds; player-center-null degenerate shows the guard tooltip; legacy save loads with zero repair churn and seeds on its first tick.

## Risks
1. **Triple-system pre-election churn (LOUD — replaces a core background rule).** The 5% ideology random walk that has shaped every save since launch is replaced by directed drift PLUS up to 5 CPU attempts per faction per turn, stacked on the relocations CPU pass in the same pre-election stretch. CPUs now attack the player's PV directly (FF −5 lands before the same turn's floor votes and 2.9.x), ideology distance moves 2.6.3 floor votes (−5%/step), and 2.1.8 personalities will cohere instead of random-walking — which also changes draft behavior downstream (`pickBestForFaction` scores on personality). No PV or election FORMULA changes — all churn flows through existing inputs — but pacing needs the same playtest sign-off relocations got; every number is a const for cheap tuning.
2. **The shared 5-attempt cap (self + opposed) is a real opportunity cost.** Every opposed attack starves your own consolidation and vice versa; CPU policy hard-reserves only `selfBudget = 3`, so a hot self pass can leave CPUs attack-less and an aggressive player consolidation-less. If turns feel starved (or spammy), tune `IDEOLOGY_ATTEMPTS_PER_TURN` / `cpu.*` — do not split the counter into two pools without a new checkpoint.
3. **Boolean contract divergence (inherited from relocations):** `attemptPlayerIdeologyShift`'s `true` means "attempt RAN" — a failed roll returns `true` and has mutated counter/stamp/feed (must persist). A future caller copying the `setPlayerCareerTrack` pattern breaks attempt accounting. Document at the function, exactly like `attemptPlayerRelocation`:520–522.
4. **Quadruple auto-nav on draft turns** (draft → careers → relocations → ideology): phase-scoped keys can't fight, but the relocations brief's triple-nav flag escalates — four forced page hops per draft turn is a rhythm cost to re-watch in playtest.
5. **Stamp-name semantics:** `lastIdeologyAttemptYear` stamps ATTEMPTS (including failures) and is also the drift-skip key — renaming it to anything shift-flavored, or writing it from drift, silently changes the lock and drift-exclusion rules. The accurate name is load-bearing.
6. **Counter normalization during rejected validation:** `ideologyAttemptCounts` replaces a stale-year counter even when the attempt is then rejected — harmless (player path discards the clone on `false`; the tick persists regardless); noted so it isn't "fixed" into a bug.
7. **Second page→engine import:** `IdeologyShifts.tsx` imports pure `factionCenter` + `ideologyShiftOdds` from phaseRunners (relocations opened this door). Sanctioned for preview === roll parity; importing anything stateful from engine into pages remains off-limits.
8. **Feed/log economics:** ~15–25 drift movements per turn world-wide consume the 200-entry history in ~8–12 turns (invisible at the 20-entry display depth — raise `IDEOLOGY_SHIFTS_CAP` only if a deeper history view ever ships), and the Event Log gets quieter (per-politician 2.1.5 logs deleted; one conditional summary line remains).
