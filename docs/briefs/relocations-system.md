# Brief: Relocations System

## Approach
Rewrite the dead `runPhase_2_1_4_Relocations` (phaseRunners.ts:440–459) as a five-step tick — eager `relocations ??= []`, lazy altState seed pass (per-politician `altStateSeeded` sentinel, the single seeding site for all construction paths and legacy saves), lazy attempt-counter reset, a CPU pass, then one `refreshPv` — and route every attempt (player and CPU) through one shared private resolver `resolveRelocation(snap, p, destStateId)` that owns validation, the counter/cooldown writes, band math, the success and carpetbagger rolls, altState consumption, and the feed append. The player path is `attemptPlayerRelocation(...): boolean` called from a new GameContext `attemptRelocation` cloning the `setCareerTrack` delegation; the 2.1.4 resting window (engine.ts:31 dispatches with `return {}`) is the move window, exactly like careers. A pure exported helper `relocationOdds(p, from, dest)` is used by both the resolver and the new Relocations page picker, structurally guaranteeing odds shown === odds rolled. All numbers live as exported consts in types.ts (careers precedent) so the legend renders with zero literals. Rejected alternative: constructor-time altState seeding at the six politician-creation sites — it would require an `instantiateDraftees` signature change (it has no region data), six edit sites, and a repair() back-seed for legacy saves; tick-time lazy seeding costs only one unseeded first window per politician (checkpoint decision 4: no repair() changes at all).

## State & type changes
- `src/types.ts`:
  - `Trait` union (ends `'Traitor'`, line 100): append `| 'Carpetbagger' | 'Outsider'`.
  - `NEGATIVE_TRAITS` (lines 131–144): append `'Carpetbagger', 'Outsider'`. pv.ts already imports the canonical lists (pv.ts:2–5) → −5 PV each with zero pv.ts edits. Zero load-time PV impact: no existing politician holds either trait.
  - `Politician` — directly after `altState?: string;` (line 215) add:
    ```ts
    altStateSeeded?: boolean;
    lastRelocationAttemptYear?: number;
    ```
  - `GameState` — directly after `careerGains?` (line 516) add:
    ```ts
    relocations?: RelocationEntry[];
    relocationAttempts?: { year: number; counts: Record<string, number> };
    ```
  - New type + interface directly after `CareerGainEntry` (~line 543):
    ```ts
    export type RelocationBand = 'sameRegionAlt' | 'sameRegion' | 'crossRegionAlt' | 'crossRegion';

    export interface RelocationEntry {
      year: number;
      politicianId: string;
      factionId: string;     // faction at move time (feed filters on this)
      fromState: string;     // state ids
      toState: string;
      band: RelocationBand;
      success: boolean;
      traitsGained: Trait[]; // empty on failure; at most one entry in v1
    }
    ```
  - New consts directly after `CAREER_GAINS_CAP` (line 178, before `OfficeType`) — single source for engine AND legend:
    ```ts
    export const RELOCATION_ODDS = {
      success: { sameRegionAlt: 0.75, sameRegion: 0.5, crossRegionAlt: 0.4, crossRegion: 0.2 },
      carpetbagger: { sameRegion: 0.05, crossRegion: 0.3, altStateFactor: 0.5 },
      seed: { sameRegion: 0.4, crossRegion: 0.15 }, // remainder (0.45) = no altState
      cpuGate: { withAltState: 0.3, withoutAltState: 0.1 },
    } as const;
    export const RELOCATION_ATTEMPTS_PER_TURN = 5;
    export const RELOCATIONS_CAP = 200;
    export const CARPETBAGGER_LADDER: Trait[] = ['Carpetbagger', 'Outsider', 'Controversial', 'Unlikable'];
    ```
    Naming note: the spec's `CARPETBAGGER_POOL` is renamed `CARPETBAGGER_LADDER` per checkpoint decision 3 — it is an ordered ladder (first-not-held), not a draw pool. `Trait` is declared above (line 62), so declaration order is valid.
- **Save/migration impact**: all new fields optional — existing IndexedDB saves load unchanged. **No repair() changes** (checkpoint decision 4, binding): legacy politicians are simply "unseeded" and the next 2.1.4 tick seeds them; the tick's eager `relocations ??= []` is the only init. No destructive migration exists anywhere.

## Engine changes (pure logic)
All in `/home/user/AMPU/src/engine/phaseRunners.ts`, replacing the 2.1.4 section (delete lines 440–459 wholesale, including both `addLog` calls — they are removed, not replaced). Import additions: `State`, `RelocationEntry`, `RelocationBand` (type import, line 1); `RELOCATION_ODDS`, `RELOCATION_ATTEMPTS_PER_TURN`, `RELOCATIONS_CAP`, `CARPETBAGGER_LADDER` (line 2); `rand` (line 4). All randomness via `src/rng.ts`; all passes iterate `snap.politicians` in array order (fixed roll order for a future seeded RNG).

- **New private `attemptCounts(snap): Record<string, number>`** — lazy year normalization, the only counter accessor:
  ```ts
  if (!g.relocationAttempts || g.relocationAttempts.year !== g.year) {
    g.relocationAttempts = { year: g.year, counts: {} };
  }
  return g.relocationAttempts.counts;
  ```
  Same-year counts always survive — the player's pre-tick attempts (which already stamped `year`) are never wiped by the tick. 2.1.4 occurs once per turn and the year is unique per turn, so this is sufficient.

- **New exported pure `relocationOdds(p: Politician, from: State, dest: State): { band: RelocationBand; success: number; carpetbagger: number }`** — the shared band/odds math:
  `sameRegion = from.region === dest.region`; `isAlt = p.altState === dest.id`; band = the 4-way classification; `success = RELOCATION_ODDS.success[band]`; `carpetbagger = (sameRegion ? .05 : .3) * (isAlt ? altStateFactor : 1)` (→ 2.5/5/15/30 by band). Region equality is pure classification — the sole-region CA case needs no special handling here. Lives in phaseRunners.ts; the page imports it (first page→engine import — acceptable for a pure function, and the only way to make the picker readout provably match the rolls).

- **New private `recordRelocation(snap, entry: RelocationEntry)`** — mirrors `recordCareerGain` (line 265): `relocations ??= []`, push, trim oldest via `splice(0, len - RELOCATIONS_CAP)`.

- **New private `resolveRelocation(snap, p, destStateId): RelocationEntry | null`** — the single attempt path, used by both entry points. **Return contract: `null` = REJECTED (no attempt happened; snapshot untouched except a harmless stale-year counter normalization); non-null = the attempt RAN** — counter, cooldown, and feed are mutated whether the roll succeeded or failed. Order:
  1. Validation, in spec order, any failure → `null`: `phaseId !== '2.1.4'`; `p.deathYear || p.retiredYear || p.currentOffice || !p.factionId`; `from`/`dest` looked up in `snap.states` — `!from || !dest || destStateId === p.state` (admitted-only and ≠ current; an unadmitted altState can therefore never be a valid destination); `p.lastRelocationAttemptYear === game.year` (cooldown); `(attemptCounts(snap)[p.factionId] ?? 0) >= RELOCATION_ATTEMPTS_PER_TURN` (cap).
  2. Charge: `counts[p.factionId] = (counts[p.factionId] ?? 0) + 1`; `p.lastRelocationAttemptYear = game.year`. Capture `fromState = p.state` before any mutation.
  3. `const { band, success: pS, carpetbagger: pC } = relocationOdds(p, from, dest)`; roll 1: `const success = chance(pS)`.
  4. On success only: `p.state = dest.id`; **consume altState iff `p.altState === dest.id`** (`p.altState = undefined`) — moving elsewhere keeps the tie (checkpoint decision 2); roll 2: `chance(pC)` → on hit, `const t = CARPETBAGGER_LADDER.find(t => !p.traits.includes(t))` — push to `p.traits` and to `traitsGained` if found; all four held → no trait, move stands.
  5. Build the entry `{ year, politicianId, factionId, fromState, toState: dest.id, band, success, traitsGained }`, `recordRelocation`, return it. **No `addLog`, no `refreshPv` inside the resolver** (callers own PV refresh).

- **New exported `attemptPlayerRelocation(snap, politicianId, destStateId): boolean`** — find `p`; `!p || p.factionId !== snap.game.playerFactionId` → `false`; `const entry = resolveRelocation(...)`; `!entry` → `false`; `if (entry.traitsGained.length > 0) snap.politicians = refreshPv(snap.politicians);` return `true`. No attempt gate — the click IS the roll. **Contract (differs from `setPlayerCareerTrack`): `true` means the attempt resolved — a FAILED roll returns `true` and HAS mutated state (cooldown + counter + feed entry) and must be persisted.** `false` only for rejections (phase lock, ineligibility, bad destination, cooldown, cap, non-player faction), where nothing meaningful changed.

- **Rewritten `runPhase_2_1_4_Relocations(snap): void`** — exact order:
  1. `snap.game.relocations ??= [];`
  2. **Seed pass** — for each politician in array order: skip `deathYear`/`retiredYear`/`altStateSeeded === true`. Look up `home = snap.states.find(s => s.id === p.state)`; if found, one partitioned roll `const r = rand()`: `r < 0.40` → pool = admitted states in `home.region` minus home; `r < 0.55` → pool = admitted states outside `home.region`; else no altState. Non-empty pool → `p.altState = pick(pool).id`; empty pool (CA/West 1856) → no altState, **no re-route**. Always set `p.altStateSeeded = true` (also when the home lookup fails — defensive, no crash). In-office and factionless politicians ARE seeded (they can become movable later); altStates are never re-rolled.
  3. `attemptCounts(snap);` — lazy counter reset for the new year (no-op when the player already attempted this turn).
  4. **CPU pass** — first build `residentCount: Map<string, number>` once (living, non-retired, counted by `p.state`; snapshot-at-tick-start, not updated as moves land — deterministic and cheap; this is the small politicians-per-state helper, local to this pass). Then for each politician in array order, skip: `!p.factionId || p.factionId === playerFactionId`; `deathYear || retiredYear || currentOffice`; `lastRelocationAttemptYear === year`; `(attemptCounts(snap)[p.factionId] ?? 0) >= RELOCATION_ATTEMPTS_PER_TURN`. Branch:
     - altState usable (`p.altState && p.altState !== p.state &&` exists in `snap.states`): gate `chance(cpuGate.withAltState)` (30%); on pass → `resolveRelocation(snap, p, p.altState)`.
     - else: gate `chance(cpuGate.withoutAltState)` (10%); on pass → thin-state heuristic: `candidates = snap.states.filter(s => s.id !== p.state)`; empty → skip (only possible with one admitted state); sort by (same-region-as-home first → fewest `residentCount` (default 0) → state id asc); destination = first. The CA/empty-region fallback is automatic — zero same-region candidates just means the sort yields cross-region states; an unknown home region (defensive) treats all candidates as cross-region.
     A failed gate roll consumes nothing (no counter, no cooldown, no feed). The resolver re-validates cap/cooldown structurally, so CPU can never exceed either.
  5. `snap.politicians = refreshPv(snap.politicians);` — unconditional at tick end (careers precedent, phaseRunners.ts:400); covers any carpetbagger traits granted in the CPU pass. The player path refreshes conditionally per attempt (above), so −5 hits render immediately in the same window.

- **PV/election impact**: no formula changes anywhere. A successful mover contests the NEW state's races in this same turn's 2.9.x (`calcStateVote` pools candidates by `p.state`) — intended open-seat payoff. The only PV input changes are the two new NEGATIVE_TRAITS (−5 each) on carpetbagger hits.
- `src/engine/engine.ts`, `src/phases.ts`, `src/pv.ts` — **no changes**. 2.1.4 already dispatches with `return {}` (engine.ts:31), has no `shouldRunPhase` gate, and runs the 1772 first turn.

## UI changes
- `/home/user/AMPU/src/state/GameContext.tsx`:
  - Add `attemptPlayerRelocation` to the phaseRunners import (line 7).
  - `GameContextValue`: add `attemptRelocation: (politicianId: string, destStateId: string) => Promise<void>;` after `setCareerTrack` (line 31).
  - Implementation clones the `setCareerTrack` delegation (lines 334–340): deep-clone → `if (!attemptPlayerRelocation(draft, politicianId, destStateId)) return;` → `setSnapshot(draft)` + `persist(draft)`. Per the engine contract, persist-on-`true` correctly persists failed rolls (cooldown/counter/feed changed). Add to the `value` object.
  - `repair()` (lines 77–140): **untouched** (binding).
- `/home/user/AMPU/src/App.tsx`: add `lastRelocationEntryKey` ref (after line 15) and a third effect after the careers one (lines 40–51), same shape: when `phaseId === '2.1.4'` (unconditional — fires even with nothing to do), key `` `${g.year}:2.1.4` ``, navigate `setPage('relocations')` once per entry; else-branch resets the ref. Deps: `snapshot?.game.phaseId`, `snapshot?.game.year`. Phase-scoped keys mean the three auto-nav effects can never fight.
- `/home/user/AMPU/src/pages/registry.ts`: import `Relocations`; add `'relocations'` to `PageId` after `'careers'` (line 31); add `relocations: Relocations,` to `Pages` after `careers` (line 59).
- `/home/user/AMPU/src/components/Sidebar.tsx`: insert `{ id: 'relocations', label: 'Relocations' }` between `careers` (line 34) and `kingmakers` (line 35) → Roster, Faction Leader, Career Tracks, Relocations, Kingmakers & Protégés, Draft.
- `/home/user/AMPU/src/pages/Relocations.tsx` — **new page**, cloned block-by-block from CareerTracks.tsx:
  - Imports: `useGame`; `SortableTable`/`Column`; `PartyBadge`; from types: `RELOCATION_ODDS`, `RELOCATION_ATTEMPTS_PER_TURN`, `CARPETBAGGER_LADDER`, `NEGATIVE_TRAITS`, `IDEOLOGY_ORDER` + types `Politician`, `State`; from `'../engine/phaseRunners'`: `relocationOdds` (the sanctioned pure import).
  - **Component state** (the row-expansion shape): `viewFactionId: string | null` (null → player, careers pattern) and `moving: { politicianId: string; destId: string } | null` — exactly one picker open; a row's Move button sets `moving` with `destId` defaulted to the first entry of that politician's ordered destination list (= the altState when present and admitted); clicking another row's Move repoints the panel; Cancel and a resolved Attempt set it to `null`.
  - Derived: `isPlayerView`; `moveLocked = g.phaseId !== '2.1.4'`; `attempts = g.relocationAttempts?.year === g.year ? (g.relocationAttempts.counts[activeFactionId] ?? 0) : 0`; `capReached = attempts >= RELOCATION_ATTEMPTS_PER_TURN`; a `statesById` map. Percent formatting everywhere: `+(x * 100).toFixed(1)` — avoids `0.05 * 100 === 5.000000000000001` artifacts and renders 2.5 correctly.
  - **Header** (clone careers 171–184): title "Relocations", `PartyBadge` + faction `<select>` (player first, "(you)" suffix). Next to it the **attempts badge** (style ref careers badge strip 187–202): "Attempts: {attempts} / {RELOCATION_ATTEMPTS_PER_TURN}", amber styling when `capReached`. Reads persisted counts only when `year === game.year`, else 0 (truthful on CPU views post-tick; genuinely 0 during the player's window).
  - **Roster table** (clone careers columns 78–167, minus Cmd/Track/Yrs/Next): rows = viewed faction's living, non-retired politicians (in-office rows listed, Move disabled). Columns: Name, St, Age, Ideology (`IDEOLOGY_ORDER` sortValue), PV, the six skills (`skillCol` pattern), Traits (red when in `NEGATIVE_TRAITS` — careers 91–101), **Alt State** (`p.altState` → uppercase badge, else "—"; unseeded also shows "—" by design), **Status** (`currentOffice` → "In office"; `lastRelocationAttemptYear === g.year` → "On cooldown"; else "Free"), **Move** button.
  - Move disabled + `title` precedence (spec order): `!isPlayerView` → "You can only manage your own faction"; `moveLocked` → "Moves open during the Relocations phase"; `currentOffice` → "In office"; cooldown → "Already attempted this turn"; `capReached` → "No attempts remaining this phase (5/5)". Disabled, never hidden; the engine lock is the real enforcement.
  - **Picker panel** — an in-flow card rendered between the header and the table (SortableTable has no row-expansion support; "inline panel, not a modal" = this card, one at a time): "Moving: {name} ({ST})", a destination `<select>` over admitted states minus current, ordered: altState first (label "{name} — alt state"), then same-region by name, then the rest by name. Below it the live readout from `relocationOdds(p, statesById[p.state], statesById[destId])`: "Success: {pct}% · Carpetbagger risk: {pct}%". Buttons: **Attempt** → `attemptRelocation(p.id, destId)` then close (result visible same render: feed entry appears, row flips "On cooldown", badge increments — no confirm step) — reuse the row's disabled/tooltip logic so a stale panel can't fire; **Cancel** → close.
  - **Feed** (clone careers 278–302): `(g.relocations ?? []).filter(e => e.factionId === activeFactionId).slice(-20).reverse()`; row: year (mono), politician name lookup, `{fromState.toUpperCase()} → {toState.toUpperCase()}`, Success (emerald) / Failed (rose) badge, `traitsGained` as red badges. Empty: "No relocations yet."
  - **Legend** `<details>` (clone careers 211–244), rendered entirely from the consts (no literals): the four success bands; carpetbagger risk per band including the `altStateFactor` halving (compute 2.5/5/15/30 inline); what altState means + the 40/15/45 seeding (none-share computed as `1 - sameRegion - crossRegion`); the 5-attempt faction cap; the one-attempt-per-politician cooldown; the phase lock; the no-office rule; consumption only when moving TO the altState; the `CARPETBAGGER_LADDER` order.
  - **Empty state**: `base.length === 0` → player view "No free politicians to relocate.", CPU view "This faction has no active politicians."; feed and legend always render. CPU view fully read-only.

## Files to touch (exact, ordered)
1. `/home/user/AMPU/src/types.ts` — Trait union + NEGATIVE_TRAITS additions; `Politician.altStateSeeded`/`lastRelocationAttemptYear`; `GameState.relocations`/`relocationAttempts`; `RelocationBand`/`RelocationEntry`; `RELOCATION_ODDS`, `RELOCATION_ATTEMPTS_PER_TURN`, `RELOCATIONS_CAP`, `CARPETBAGGER_LADDER`
2. `/home/user/AMPU/src/engine/phaseRunners.ts` — delete old 2.1.4 body (440–459); add `attemptCounts`, `relocationOdds` (exported), `recordRelocation`, `resolveRelocation`, `attemptPlayerRelocation`; rewrite `runPhase_2_1_4_Relocations`
3. `/home/user/AMPU/src/state/GameContext.tsx` — `attemptRelocation` (interface + delegation + value); import; repair() untouched
4. `/home/user/AMPU/src/pages/Relocations.tsx` — new page: header/badge, roster + Move column, picker panel, feed, legend, empty state
5. `/home/user/AMPU/src/pages/registry.ts` — `'relocations'` PageId + Pages entry + import
6. `/home/user/AMPU/src/components/Sidebar.tsx` — "Relocations" item after Career Tracks
7. `/home/user/AMPU/src/App.tsx` — `lastRelocationEntryKey` ref + third auto-nav effect (key `` `${year}:2.1.4` ``)

## Test / verification plan
- Build/typecheck: `npm run build`.
- Playtest 1856 (`npm run dev`, new game):
  1. Draft → careers window → Advance to rest at 2.1.4 → auto-nav lands on Relocations. Turn 1: ALL Alt State cells show "—" (seed pass runs in this phase's tick, which hasn't fired yet); attempts badge 0/5.
  2. Live odds: pick a Northeast politician — same-region destination shows 50% / 5%; cross-region shows 20% / 30%. The 2.5% line appears only after altStates exist (turn 2+, same-region alt destination: 75% / 2.5%).
  3. Attempt until the feed shows both a Success and a Failed row (failures visible — cap accounting must be readable); each attempt flips the row to "On cooldown" (tooltip "Already attempted this turn") and increments the badge.
  4. Spend all 5 attempts → every remaining Move disabled with "No attempts remaining this phase (5/5)".
  5. Reload mid-window: badge and cooldowns intact (persisted on GameState/Politician, not component state); auto-nav refires.
  6. Advance (the tick runs: seed + CPU): outside 2.1.4 the Move buttons read "Moves open during the Relocations phase" (page stays viewable). Switch the dropdown to a CPU faction: feed has entries, attempts badge shows its tick count (≤5); eyeball volume ~2–3 attempts/faction (CPU gate sign-off).
  7. Next turn's window: Alt State badges now populated (~55% of politicians); the cooled-down politician from step 3 is attemptable again (year advanced +2 — cooldown self-expired across the turn boundary).
  8. altState survival: move a politician whose altState is X to some Y ≠ X (retry across turns until a success) → badge still shows X; later move to X → success consumes it ("—" permanently, never re-seeded).
  9. Carpetbagger + ladder: over ~10 turns confirm at least one red Carpetbagger badge with a −5 PV dip on a cross-region mover; a second stigma on the same politician must be Outsider (deterministic ladder) — low probability, verify by inspection plus any occurrence in CPU feeds.
  10. CA edge (sole West state): a CA politician's picker shows only cross-region odds for every destination, no crash, no mislabeled band; CA-homed politicians seed cross-region altStates or none (same-region bucket empty → none, no re-route).
- 1772 smoke: first turn reaches 2.1.4 (no first-turn skip) with the full inaugural class — all "—", no crash; Advance; turn 2 shows seeded badges; CPU may have used fresh altStates on the very first tick (seed pass precedes CPU pass — expected).
- Legacy save: load a pre-feature save → loads with zero repair churn; its first 2.1.4 window is fully "—" (back-seeding is the tick, not repair); badges appear next turn.
- Election ripple sanity: after a successful move, the politician appears among the NEW state's candidates in this same turn's 2.9.x (Elections page).

## Risks
1. **Bench redistribution shifts elections (loud — core-adjacent).** No formula changes, but CPU factions now actively re-seat ~2–3 politicians per faction per turn toward thin states, movers contest the new state's races the same turn, and carpetbagger hits subtract 5 PV. Over a campaign, PV-driven election fields will look materially different from pre-feature play. CPU gates (30%/10%) and band numbers need playtest sign-off (spec assumption #6).
2. **Boolean contract divergence:** `attemptPlayerRelocation`'s `true` means "attempt ran" — a failed roll returns `true` and has mutated cooldown/counter/feed (must persist). Any future caller copying the `setPlayerCareerTrack` pattern and treating `false` as "move failed" breaks attempt accounting. Document the contract in a code comment at the function.
3. **First-window blindness by design:** every politician's first 2.1.4 window after creation (and one whole window for legacy saves and both scenarios' turn 1) is altState-less — odds shown equal odds rolled, but it can read as "feature missing" on turn 1. Watch for confusion in playtest.
4. **Triple auto-nav on draft turns** (draft → careers → relocations): accepted rhythm cost; keys are phase-scoped so the effects can't fight, but the stacking was already flagged in the careers brief — re-watch it.
5. **Counter normalization during rejected validation:** `attemptCounts` replaces a stale-year counter even when the attempt is then rejected. Harmless (player path discards the clone on `false`; the tick persists regardless) — noted so it isn't "fixed" into a bug later.
6. **Precedent break — page imports engine:** `Relocations.tsx` imports the pure `relocationOdds` from phaseRunners.ts (first page→engine import). Sanctioned to guarantee picker odds === resolver odds; importing anything stateful from engine into pages remains off-limits.
7. **Event Log gets quieter:** the old per-attempt 2.1.4 'roll' logs are deleted, not replaced — the feed is the sole surface (spec). If players miss a turn-summary line, add one aggregate log later rather than per-attempt spam.
