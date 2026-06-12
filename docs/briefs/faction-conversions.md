# Brief: Faction Conversions (Phase 2.1.6)

## Approach
Delete the placeholder `runPhase_2_1_6_Conversions` (phaseRunners.ts:816–830) and rebuild the 2.1.6 section as a third structural clone of the relocations / ideology-shifts architecture: the 2.1.6 resting window (engine.ts:33 already dispatches with `return {}`) is the player's attempt window; the Advance-out tick runs trait seeding → counter reset → tick-start center map + within-party rank map → CPU pass (sign-then-poach) → passive defection pass → one unconditional `refreshPv` → one conditional summary log. Every active attempt (player and CPU, sign and poach) flows through ONE shared private resolver `resolveConversion(snap, actorFactionId, p)` that owns validation, counter/stamp writes, the composed-multiplier roll, the faction+party rewrite, the FF stack application, and the feed append. Two exported pure helpers — `passiveConversionChance` and `conversionOdds` — are used by both the resolver/CPU pass and the new page, so previewed odds and risk badges are structurally what the engine rolls (the established `relocationOdds` / `ideologyShiftOdds` precedent); `factionCenter` is REUSED from 2.1.5, not redefined. All numbers live in types.ts as `CONVERSION_ODDS` (engine + legend single source). Rejected alternative: a separate `resolveSign` / `resolvePoach` split — kind is fully derivable from `subject.factionId` vs `actorFactionId` (factionless → sign; same → reject; different → poach) and a parameter would let a future caller desync the two; deriving it keeps "factionless ARE never poached, own members ARE never subjects" structural rather than policed. Passive defections never go through `resolveConversion` (no actor, no counter charge, no stamp) — they are their own pass with their own loss-cap accounting.

## State & type changes
- `/home/user/AMPU/src/types.ts`:
  - `Trait` union (ends `'Impressionable'`, line 104): append `| 'Loyal' | 'Opportunist'`.
  - `POSITIVE_TRAITS` (ends `'Ideologue'`, line 133): append `'Loyal'` (**+4 PV — passive defense, per binding**). `NEGATIVE_TRAITS` (ends `'Impressionable'`, line 151): append `'Opportunist'` (−5 PV). pv.ts imports the canonical lists (pv.ts:2) — **zero pv.ts edits**. Neither appears in `CAREER_RANDOM_NEGATIVES` (line 175) or any `TRACK_THEMED_TRAITS` entry; `'Loyal'` is excluded from the career random POSITIVE pool at the exact filter site already excluding `'Ideologue'` (phaseRunners.ts:320) — extend that filter to `t !== 'Ideologue' && t !== 'Loyal'`.
  - `Politician` — directly after `lastIdeologyAttemptYear?: number;` (line 253) add:
    ```ts
    conversionTraitsSeeded?: boolean;
    lastConversionAttemptYear?: number; // stamps ATTEMPTS incl. failures; blocks the passive pass too
    ```
  - `GameState` — directly after `ideologyAttempts?` (line 558) add:
    ```ts
    conversions?: ConversionEntry[];
    conversionAttempts?: { year: number; counts: Record<string, number> };
    ```
  - New interface directly after `IdeologyShiftEntry` (lines 599–609):
    ```ts
    export interface ConversionEntry {
      year: number;
      politicianId: string;
      fromFactionId: string | null;     // null on sign rows
      toFactionId: string;              // destination faction; on failed attempts = actor's faction
      fromPartyId: PartyId | null;      // null on sign rows
      toPartyId: PartyId;               // ALWAYS populated (binding); destination faction's party
      actorFactionId?: string;          // absent on passive 'defect' entries
      kind: 'defect' | 'poach' | 'sign';
      crossParty: boolean;              // derived from the two FACTIONS' partyIds
      success: boolean;
      ffGained: number;                 // 0 on failures and signs; 1 same-party / 2 cross-party on success
    }
    ```
  - New consts directly after `IDEOLOGY_SHIFTS_CAP` (line 212) — single source for engine AND legend:
    ```ts
    // Faction-conversion tables — single source for engine rolls AND the page legend.
    export const CONVERSION_ODDS = {
      passive: { rate: 0.02, oneAway: 0.9, anyFaction: 0.1, lossCapPerFaction: 2 },
      // Matrix access: poach.matrix[crossParty ? 'cross' : 'same'][inOffice ? 'inOffice' : 'notInOffice']
      poach: {
        matrix: {
          same:  { notInOffice: 0.20, inOffice: 0.05 },
          cross: { notInOffice: 0.10, inOffice: 0.02 },
        },
      },
      sign: { base: 0.20, fitBandClose: 1.5, fitBandFar: 0.5, fitCloseMax: 1, fitFarMin: 3 },
      willingness: {
        fitBetter: 1.5, fitWorse: 0.5,        // poach only (sign uses distance bands)
        ffHistory: 1.25, mentorBond: 0.5,
        highPv: 0.75, highPvThreshold: 50,
        flipFlopperTrait: 1.25,
      },
      traits: {
        Loyal:       { passive: 0, attempt: 0.25 },
        Opportunist: { passive: 2, attempt: 1.5 },
      },
      ffStacks: { same: 1, cross: 2 },         // poach success and passive defection
      seed: { loyal: 0.08, opportunist: 0.08 },// remainder (0.84) = neither
      cpu: { signGate: 0.35, signScan: 6, signBudget: 2, poachGate: 0.15, poachScan: 8 },
    } as const;
    export const CONVERSION_ATTEMPTS_PER_TURN = 5;
    export const CONVERSIONS_CAP = 200;
    ```
    `as const` notes: literal-typed numbers widen fine in arithmetic; the matrix is accessed by two-step literal indexing — `CONVERSION_ODDS.poach.matrix[crossParty ? 'cross' : 'same'][inOffice ? 'inOffice' : 'notInOffice']` — never by `Trait` or arbitrary key. `traits` is keyed by literal name (`traits.Loyal.passive`), guarded by `p.traits.includes('Loyal')` checks.

- **Save/migration impact**: all new fields optional — existing IndexedDB saves load unchanged. **No `repair()` changes** (binding). Legacy politicians are "unseeded" until their first 2.1.6 tick; the tick's eager `conversions` init is the only array init. The first window after load shows no new traits and base odds; previews still match rolls exactly (×1 multipliers). The first turn's passive pass sees an unseeded array, so Loyal/Opportunist effects appear on tick 2 of an upgraded save — same lazy-seed precedent as 2.1.5.

## Engine changes (pure logic)
All in `/home/user/AMPU/src/engine/phaseRunners.ts`, replacing the 2.1.6 section (delete lines 816–830 wholesale). Import additions: add `ConversionEntry` to the type import (line 1) alongside `IdeologyShiftEntry`; add `CONVERSION_ODDS`, `CONVERSION_ATTEMPTS_PER_TURN`, `CONVERSIONS_CAP` to the value import (line 2). `chance`/`rand`/`clamp`/`pick`, `IDEOLOGY_ORDER`, `refreshPv`, `addLog` already imported. **REUSE `factionCenter` (already exported at line 612) — do not redefine.** All randomness via rng.ts; all passes iterate `snap.politicians` / `snap.factions` in array order. `engine.ts`, `phases.ts`, `pv.ts`: **no changes** (2.1.6 already rests via `return {}` at engine.ts:33; 2.1.6 is not first-turn-skipped, runs 1772 turn 1).

- **New private `conversionAttemptCounts(snap): Record<string, number>`** — exact clone of `ideologyAttemptCounts` (595–601) over `g.conversionAttempts`. Same-year counts always survive, so the player's pre-tick attempts are never wiped by the tick.

- **New exported pure `passiveConversionChance(p: Politician): number`** — `Loyal` ×0 short-circuits to `0`; else `CONVERSION_ODDS.passive.rate * (p.traits.includes('Opportunist') ? CONVERSION_ODDS.traits.Opportunist.passive : 1)`. Both the passive pass AND the own-roster Risk % column read this — preview === roll. Returns 0 / 0.02 / 0.04.

- **New private helper `mentorBondAnchored(snap, p): boolean`** — given the subject `p` in their CURRENT faction (caller guards): `true` iff `(p.protegeId && some politician matches id === p.protegeId && factionId === p.factionId && !deathYear && !retiredYear)` OR `(snap.politicians.some(m => m.protegeId === p.id && m.factionId === p.factionId && !m.deathYear && !m.retiredYear))`. Bonds to dead/retired/defected partners do NOT anchor. Used by both the willingness multiplier and the own-view badge.

- **New exported pure `conversionOdds(snap, actorFactionId, p): { kind: 'sign' | 'poach'; crossParty: boolean; inOffice: boolean; base: number; factors: { fit: number; ffHistory: number; mentorBond: number; highPv: number; flipFlopperTrait: number; loyal: number; opportunist: number }; success: number; ffOnSuccess: number }`** — the preview === roll seam (signature decision: pass `snap` because the fit calc needs `factionCenter` lookups on TWO factions and the mentor predicate needs roster scans; passing pre-derived params would force two upstream call sites to recompute the same `factionCenter` per render and per CPU candidate. `snap` is already cheap-pure here — no engine.ts/IO surface). Composition:
  - `const actor = snap.factions.find(f => f.id === actorFactionId);` — caller guards non-null.
  - `kind = !p.factionId ? 'sign' : 'poach'`. If `kind === 'poach'`, find `current = snap.factions.find(f => f.id === p.factionId)`; `crossParty = !!current && current.partyId !== actor.partyId`. If `kind === 'sign'`, `crossParty = false` (binding: free agents have `partyId: null` — cross-party sign is structurally impossible).
  - `inOffice = !!p.currentOffice` (relevant for poach matrix only).
  - `base`: sign → `CONVERSION_ODDS.sign.base` (0.20); poach → `CONVERSION_ODDS.poach.matrix[crossParty ? 'cross' : 'same'][inOffice ? 'inOffice' : 'notInOffice']`.
  - **Fit factor**:
    - Poach: `actorC = factionCenter(snap, actorFactionId); currentC = factionCenter(snap, p.factionId!)`; `idx = IDEOLOGY_ORDER.indexOf(p.ideology)`; if either center is null → `fit = 1` (binding: empty recruiter still poaches at neutral fit — deviation from ideology-shifts' actor-center rejection); else `dA = Math.abs(idx - actorC); dC = Math.abs(idx - currentC);` → `dA < dC ? willingness.fitBetter : dA > dC ? willingness.fitWorse : 1`.
    - Sign: `actorC = factionCenter(snap, actorFactionId)`; if null → `fit = 1`; else `d = Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - actorC)`; `d <= sign.fitCloseMax ? sign.fitBandClose : d >= sign.fitFarMin ? sign.fitBandFar : 1`.
  - `ffHistory = p.flipFlopperPenalty > 0 ? willingness.ffHistory : 1`.
  - `mentorBond = kind === 'poach' && p.factionId && mentorBondAnchored(snap, p) ? willingness.mentorBond : 1` (signs have no current-faction bond to anchor against; the binding's mentor multiplier targets poach defense).
  - `highPv = p.pvCache >= willingness.highPvThreshold ? willingness.highPv : 1`.
  - `flipFlopperTrait = p.traits.includes('Flip-Flopper') ? willingness.flipFlopperTrait : 1`.
  - `loyal = p.traits.includes('Loyal') ? CONVERSION_ODDS.traits.Loyal.attempt : 1`; `opportunist = p.traits.includes('Opportunist') ? CONVERSION_ODDS.traits.Opportunist.attempt : 1`.
  - `success = clamp(base * fit * ffHistory * mentorBond * highPv * flipFlopperTrait * loyal * opportunist, 0, 1)`.
  - `ffOnSuccess = kind === 'poach' ? CONVERSION_ODDS.ffStacks[crossParty ? 'cross' : 'same'] : 0` (sign success grants 0 FF — binding).
  - Returns the itemized factors record so the confirm card builds the readout from the same structure the resolver rolls. (Both-traits hand-edit composes correctly: `0.25 * 1.5 = 0.375`.)

- **New private `factionRankMap(snap): Map<string, { rank: number; partyRanks: string[] }>`** — tick-start ordered rank within party. Implementation: for each `partyId of ['BLUE', 'RED'] as const`: collect factions of that party with non-null `factionCenter(snap, f.id)`; sort `(a, b) => centers[a] - centers[b] || a.id.localeCompare(b.id)`; assign `rank = index`. Empty-centered factions are excluded from the rank list AND get no map entry (caller guard for the 90% bucket: subject's faction without a rank fizzles). `partyRanks` is the ordered array of faction ids (shared per-party reference; cheap, never mutated). Built ONCE in the tick; UI calls compute live — equality at the tick boundary by construction.

- **New private `defectionDestination(snap, p, rankMap, partyId: PartyId, oneAwayRoll: boolean): { toFactionId: string; crossParty: boolean } | null`** — pure given inputs. If `oneAwayRoll` (the 90% bucket):
  - Look up `entry = rankMap.get(p.factionId!)`; if missing → null (excluded faction). `partyRanks = entry.partyRanks`; if `partyRanks.length <= 1` → null (fizzle: nowhere to go in-party).
  - Direction: edge ranks forced inward (rank 0 → +1, rank `length-1` → −1); interior ranks 50/50 `chance(0.5) ? +1 : -1`. Compute `targetIdx = entry.rank + dir`; pick `partyRanks[targetIdx]`. `crossParty = false` (same-party by construction).
  - Else (the 10% wild-card bucket): collect `pool = snap.factions.filter(f => f.id !== p.factionId && factionCenter(snap, f.id) !== null)` (LIVE check, allowed — wild card uses present-state; spec allows; the tick-start map could be reused but the wild-card pool is rare and the live call is cleaner). Empty pool → null. `pick(pool)` then `crossParty = dest.partyId !== partyId`.
  - Returns destination + crossParty.

- **New private `recordConversion(snap, entry)`** — mirror of `recordIdeologyShift` (632–637): init array, push, `splice(0, len - CONVERSIONS_CAP)`.

- **New private `resolveConversion(snap, actorFactionId: string, p: Politician): ConversionEntry | null`** — the single active attempt path (player and CPU; sign and poach). **Return contract (code comment required, clone of resolveIdeologyShift comment): `null` = REJECTED, nothing meaningful changed (only a harmless stale-year counter normalization); non-null = the attempt RAN — counter, stamp, and feed are mutated whether the roll succeeded or failed.** Kind is DERIVED, never passed. Order:
  1. `const g = snap.game; if (g.phaseId !== '2.1.6') return null;` `if (p.deathYear || p.retiredYear) return null;`
  2. **Derive kind** before stamp/cap checks (cheap and structural): if `p.factionId === actorFactionId` → return null (own members rejected: spec assumption #3 — own view has no action; this is the defensive backstop). `const kind: 'sign' | 'poach' = !p.factionId ? 'sign' : 'poach';`
  3. `if (p.lastConversionAttemptYear === g.year) return null;` (one attempt per subject per turn; ALSO blocks the passive pass).
  4. `const actor = snap.factions.find(f => f.id === actorFactionId); if (!actor) return null;` For poach: `const current = snap.factions.find(f => f.id === p.factionId); if (!current) return null;` (target faction must exist).
  5. `const counts = conversionAttemptCounts(snap); if ((counts[actorFactionId] ?? 0) >= CONVERSION_ATTEMPTS_PER_TURN) return null;`
  6. Charge: `counts[actorFactionId] = (counts[actorFactionId] ?? 0) + 1;` `p.lastConversionAttemptYear = g.year;` (stamps failures too).
  7. Capture pre-mutation snapshot: `const fromFactionId = p.factionId; const fromPartyId = p.partyId;`
  8. `const odds = conversionOdds(snap, actorFactionId, p);` `const success = chance(odds.success);`
  9. On success: `p.factionId = actor.id; p.partyId = actor.partyId;` (always rewrite both — even same-party is identity-safe and self-heals stale `p.partyId`). For poach: `p.flipFlopperPenalty += odds.ffOnSuccess;` (`ffOnSuccess` already encodes 1 same / 2 cross).
  10. Build entry — `toFactionId` on FAILURE = `actor.id` (relocations precedent, NOT the ideology-shifts from===to shape; binding):
      ```ts
      const entry: ConversionEntry = {
        year: g.year,
        politicianId: p.id,
        fromFactionId: success ? fromFactionId : fromFactionId,
        toFactionId: success ? actor.id : actor.id,
        fromPartyId,
        toPartyId: actor.partyId,         // ALWAYS populated (binding)
        actorFactionId,
        kind,
        crossParty: odds.crossParty,
        success,
        ffGained: success ? odds.ffOnSuccess : 0,
      };
      ```
      (Both `fromFactionId` ternaries collapse to the same value — kept explicit for the diff against the resolver's mutation order.)
  11. `recordConversion(snap, entry); return entry;` **No `addLog`, no `refreshPv` inside** (callers own PV refresh — established pattern).

- **New exported `attemptPlayerConversion(snap, politicianId: string): boolean`** — find `p`; `!p` → `false`; `const entry = resolveConversion(snap, snap.game.playerFactionId, p);` `!entry` → `false`; **PV refresh on `entry.ffGained > 0`** (FF is the only PV input touched by a resolved attempt — sign success grants 0 FF, poach success grants 1/2, failures grant 0; faction membership itself is not a PV input). Return `true`. **Boolean contract (code comment, clone of `attemptPlayerIdeologyShift`:686–688): `true` = the attempt RAN — a failed roll returns `true` and HAS mutated counter + stamp + feed and must persist; `false` = rejected, nothing meaningful changed.**

- **Rewritten `runPhase_2_1_6_Conversions(snap): void`** — exact order:
  1. `if (!snap.game.conversions) snap.game.conversions = [];`
  2. **Trait-seed pass** — for each politician in array order: skip `deathYear || retiredYear || conversionTraitsSeeded`. If `p.traits` already includes `'Loyal'` or `'Opportunist'` → set sentinel only (no roll, no consumed RNG). Else one partitioned roll `const r = rand()`: `r < CONVERSION_ODDS.seed.loyal` (0.08) → push `'Loyal'`; `else if (r < seed.loyal + seed.opportunist)` (0.16) → push `'Opportunist'`; else neither (mutually exclusive). Always `p.conversionTraitsSeeded = true`. **In-office AND factionless politicians ARE seeded** (binding: a Loyal free agent is harder to sign — the pass hits the whole politicians array unconditionally).
  3. `conversionAttemptCounts(snap);` — lazy counter reset for the new year.
  4. **Tick-start rank map**: `const rankMap = factionRankMap(snap);` built BEFORE both CPU and passive passes — both passes measure the turn-start environment, untouched by mid-tick faction churn.
  5. **CPU pass** — `let cpuAttempts = 0;` for each `f` of `snap.factions` in array order, skip `f.id === snap.game.playerFactionId`. Per faction, sign first (cheap growth) then poach:
     - **Sign pass**: `const signCandidates = snap.politicians.filter(p => !p.factionId && !p.deathYear && !p.retiredYear && p.lastConversionAttemptYear !== snap.game.year)`; sort by composed `conversionOdds(snap, f.id, p).success` desc, then `pvCache` desc, then `id.localeCompare`; `slice(0, CONVERSION_ODDS.cpu.signScan)` (top 6). Iterate with `let signUsed = 0;`: break when `(counts[f.id] ?? 0) >= CONVERSION_ATTEMPTS_PER_TURN` OR `signUsed >= CONVERSION_ODDS.cpu.signBudget` (resolved attempts, not gate passes — successes AND failures count); per candidate `chance(CONVERSION_ODDS.cpu.signGate)` (35%); on gate pass → `if (resolveConversion(snap, f.id, p)) { signUsed++; cpuAttempts++; }`.
     - **Poach pass**: `const poachCandidates = snap.politicians.filter(p => p.factionId && p.factionId !== f.id && !p.deathYear && !p.retiredYear && p.lastConversionAttemptYear !== snap.game.year)` (**player's roster included — binding; symmetric**); sort by composed odds desc, then `pvCache` desc, then `id.localeCompare`; `slice(0, CONVERSION_ODDS.cpu.poachScan)` (top 8). Iterate: break when capped; per candidate `chance(CONVERSION_ODDS.cpu.poachGate)` (15%); gate pass → resolver; non-null → `cpuAttempts++`.
     - Failed gate rolls consume nothing (no counter, no stamp, no feed) — relocations precedent. Cap and subject stamp enforced structurally by the resolver, never by policy discipline.
  6. **Passive defection pass** — `let defects = 0; const lossCounter = new Map<string, number>();` for each politician in array order:
     - Skip `deathYear || retiredYear || !p.factionId || lastConversionAttemptYear === snap.game.year` (stamp-blocks the passive pass — established pattern).
     - Skip Loyal holders (explicit `passiveConversionChance(p) === 0` short-circuit — zero RNG draws; spec binding).
     - **Loss cap gate (pre-roll)**: `if ((lossCounter.get(p.factionId) ?? 0) >= CONVERSION_ODDS.passive.lossCapPerFaction) continue;` (zero RNG draws once a source faction is capped; binding determinism: earlier-iteration politicians get to leave before later ones see the closed gate).
     - Roll `chance(passiveConversionChance(p))`. Miss → no-op, unrecorded.
     - On hit, destination cascade (one partitioned draw): `const oneAway = chance(CONVERSION_ODDS.passive.oneAway)`; `const dest = defectionDestination(snap, p, rankMap, p.partyId!, oneAway);` `if (!dest) continue;` (fizzled, unrecorded — defensive: single-faction party or empty wild-card pool).
     - Apply: `const fromFactionId = p.factionId; const fromPartyId = p.partyId; const destFaction = snap.factions.find(f => f.id === dest.toFactionId)!; p.factionId = destFaction.id; p.partyId = destFaction.partyId; p.flipFlopperPenalty += CONVERSION_ODDS.ffStacks[dest.crossParty ? 'cross' : 'same'];` (binding: +1 same / +2 cross — generalized for passive too); `lossCounter.set(fromFactionId, (lossCounter.get(fromFactionId) ?? 0) + 1); defects++;`
     - `recordConversion(snap, { year: snap.game.year, politicianId: p.id, fromFactionId, toFactionId: destFaction.id, fromPartyId, toPartyId: destFaction.partyId, kind: 'defect', crossParty: dest.crossParty, success: true, ffGained: CONVERSION_ODDS.ffStacks[dest.crossParty ? 'cross' : 'same'] });` (no `actorFactionId` key — passive entries have none).
     - **Passive pass NEVER writes the subject stamp** (established pattern — it is the turn's last actor; stamps self-expire at year +2 via the `=== g.year` predicate next turn).
  7. `snap.politicians = refreshPv(snap.politicians);` — unconditional (covers Loyal/Opportunist PV deltas at seed time + every FF stack inflicted this tick).
  8. `if (defects + cpuAttempts > 0) addLog(snap, '2.1.6', 'system', \`Realignment currents: ${defects} defections; ${cpuAttempts} recruitment attempts resolved.\`);` — tick events only (player attempts already surfaced in the feed); at most one line; silent when idle. **No other logs anywhere in 2.1.6 code** (the per-switch `addLog` from the deleted runner is gone, not replaced).

- **PV/election impact**: no formula changes. PV inputs touched: the two new traits (+4/−5 at seed time) and the existing `flipFlopperPenalty` counter (−5/stack). Faction membership and party labels are NOT PV inputs (verified via pv.ts). Cross-party flips at 2.1.6 reshape THIS turn's 2.2.1 chamber majorities, 2.6.3 floor votes, and 2.9.x election filters — intended (all those sites recompute live from `p.partyId`; no cached party rosters exist, verified via the Explore audit). Election-result records keep their historical `partyId` (types.ts:480) — correctly frozen.

## UI changes
- `/home/user/AMPU/src/state/GameContext.tsx`:
  - Add `attemptPlayerConversion` to the phaseRunners import (line 7) alongside `attemptPlayerIdeologyShift`.
  - `GameContextValue`: add `attemptConversion: (politicianId: string) => Promise<void>;` after `attemptIdeologyShift` (line 33).
  - Implementation directly after `attemptIdeologyShift` (346–353), exact clone with the same contract comment (failed rolls persist counter + stamp + feed): deep-clone → `if (!attemptPlayerConversion(draft, politicianId)) return;` → `setSnapshot(draft)` + `await persist(draft)`. Add to the `value` object after `attemptIdeologyShift` (line 423). `repair()` untouched (binding). **Single method**, no kind parameter — kind derives from subject state inside the resolver (factionless → sign; different faction → poach; own faction → resolver rejects with null → context returns early).
- `/home/user/AMPU/src/App.tsx`: add `const lastConversionEntryKey = useRef<string | null>(null);` after line 17 and a FIFTH effect after the ideology one (71–82), same shape: `phaseId === '2.1.6'` (unconditional — fires even with nothing to do), key `` `${g.year}:2.1.6` ``, `setPage('conversions')` once per entry; else-branch resets the ref. Deps: `snapshot?.game.phaseId`, `snapshot?.game.year`. Phase-scoped keys keep all five effects from fighting. **The 5-hop draft-turn rhythm (draft → careers → relocations → ideology → conversions) is a known playtest watch-item** (third escalation of the auto-nav cadence flagged in the relocations and ideology briefs).
- `/home/user/AMPU/src/pages/registry.ts`: import `Conversions`; add `| 'conversions'` to `PageId` after `'ideology'` (line 35); add `conversions: Conversions,` to `Pages` after `ideology` (line 65).
- `/home/user/AMPU/src/components/Sidebar.tsx`: insert `{ id: 'conversions', label: 'Faction Conversions' }` between `ideology` (line 36) and `kingmakers` (line 37) → Roster, Faction Leader, Career Tracks, Relocations, Ideology Shifts, **Faction Conversions**, Kingmakers & Protégés, Draft.
- `/home/user/AMPU/src/pages/Conversions.tsx` — **new page**, cloned block-by-block from IdeologyShifts.tsx with these exact divergences:
  - **Imports**: `useGame`; `SortableTable`/`Column`; `PartyBadge`; from types: `CONVERSION_ODDS`, `CONVERSION_ATTEMPTS_PER_TURN`, `NEGATIVE_TRAITS`, `IDEOLOGY_ORDER` + types `Politician`, `ConversionEntry`; from `'../engine/phaseRunners'`: `factionCenter`, `conversionOdds`, `passiveConversionChance` (the sanctioned pure page→engine import — third use). Clone the `pct` helper (IdeologyShifts.tsx:21).
  - **Local constants**: `const FREE_AGENTS_VIEW = '__FREE__';` (synthetic dropdown value — never collides with a real faction id, which all use the `f_` prefix in the seed data). `KIND_LABELS: Record<ConversionEntry['kind'], string>` = `{ defect: 'Defect', poach: 'Poach', sign: 'Sign' }`.
  - **Component state**: `viewFactionId: string | null` (null means player view), `statusFilter`, `confirming: { politicianId: string } | null`. Dropdown `onChange` resets `confirming` to null. **No destination select** — destination is always the player's faction (or null for Risk %).
  - **Derived**: `playerFactionId = g.playerFactionId`; `activeFactionId = viewFactionId ?? playerFactionId`; `isPlayerView = activeFactionId === playerFactionId`; `isFreeAgentsView = activeFactionId === FREE_AGENTS_VIEW`; `isRivalView = !isPlayerView && !isFreeAgentsView`; `shiftLocked = g.phaseId !== '2.1.6'`; `playerCenter = factionCenter(snapshot, playerFactionId)` — live every render; `attempts = g.conversionAttempts?.year === g.year ? (g.conversionAttempts.counts[playerFactionId] ?? 0) : 0` — **ALWAYS the player's count, every view** (established pattern: you spend YOUR attempts regardless of viewed roster); `capReached = attempts >= CONVERSION_ATTEMPTS_PER_TURN`.
  - **Dropdown options** (sequence): player faction first with `(you)` suffix; then other factions in `snap.factions` order; then a synthetic `<option value={FREE_AGENTS_VIEW}>Free Agents</option>`. The `PartyBadge` reads from a `viewedFaction` lookup that's `null` on Free Agents view (badge omitted).
  - **Roster source**:
    - Own/rival faction view: `base = snap.politicians.filter(p => p.factionId === activeFactionId && !p.deathYear && !p.retiredYear)`.
    - Free Agents view: `base = snap.politicians.filter(p => !p.factionId && !p.deathYear && !p.retiredYear)`.
  - **`statusOf(p)`** — `type StatusFilter = 'all' | 'available' | 'attempted';` (NO `inOffice`/`atCenter` — in-office is priced via the matrix, not status-filtered; conversions has no center analog). Stamped (`lastConversionAttemptYear === g.year`) → `'Attempted this turn'`; else `'Available'`.
  - **Own view columns** (NO action button per binding): Name, St, Age, Ideology (`IDEOLOGY_ORDER` sortValue), PV, Fit (distance from MY live center: `playerCenter !== null ? Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - playerCenter) : '—'`), **Risk %** (`sortValue: passiveConversionChance(p)`; render `0%` / `2%` / `4%`, rose styling at 4%), Traits (Loyal renders neutral via POSITIVE_TRAITS auto-styling, Opportunist auto-renders red via NEGATIVE_TRAITS — both via the existing `NEGATIVE_TRAITS.includes(t)` branch), **FF** (clone of the IdeologyShifts FF column — `sortValue: p.flipFlopperPenalty`, rose count when `> 0`, em-dash otherwise), **Mentor** (badge column: `mentorBondAnchored(snap, p) ? 'Bonded' : '—'` — uses the same predicate the willingness multiplier reads). **No skill columns** (vision-binding, established pattern).
  - **Rival view columns**: Name, St, Age, Ideology, PV, Fit (to MY center), Traits, FF, **Party match badge** (`'Same'` / `'Cross'` indicating which matrix cell applies — derived from `viewedFaction.partyId !== playerFaction.partyId`), **Office** (`p.currentOffice ? p.currentOffice.type : '—'` — informational only, NOT a status filter; the matrix prices it instead), Status, **Action** (Poach button). Action disabled `title` precedence (binding): `shiftLocked` → "Conversions open during the Faction Conversions phase"; `capReached` → `` `No attempts remaining this phase (${CONVERSION_ATTEMPTS_PER_TURN}/${CONVERSION_ATTEMPTS_PER_TURN})` ``; stamped → "Already attempted this turn"; `playerCenter === null` → "Your faction has no living members" (defensive guard, mirrors ideology-shifts); `p.factionId === playerFactionId` → "Member of your faction" (defensive: dropdown should prevent but the row predicate is the real guard). **NOT disabled for in-office** (matrix prices it).
  - **Free Agents view columns**: Name, St, Age, Ideology, PV, Fit to MY center (with distance band label `'Close'` if `d <= 1`, `'Far'` if `d >= 3`, else `'Mid'` — shows the player which sign band applies), Traits, **Sign odds** (live composed `conversionOdds(snap, playerFactionId, p).success` — preview === roll), Status, **Action** (Sign button, same disabled precedence; `p.factionId === playerFactionId` clause never fires here).
  - **Confirm card** (clone IdeologyShifts.tsx:162–190, NEW itemized readout from `conversionOdds`): heading varies by kind (`'Signing:'` / `'Poaching:'`). Readout when `confirmingPol && playerCenter !== null` (defensive — the resolver also guards the null-center case):
    ```
    const odds = conversionOdds(snapshot, playerFactionId, confirmingPol);
    // Sign:   "20% base × 1.5 (close fit) × 1 (FF) × 1 (mentor n/a) × 1 (PV) × 0.25 (Loyal) = 7.5%"
    // Poach:  "5% base × 1.5 (better fit) × 1.25 (FF history) × 0.5 (mentor) × 0.75 (high PV) × 1.5 (Opportunist) = 5.3%"
    ```
    Each factor renders as `pct(factor) === 100 ? null : <span>× {factor} ({label})</span>` so neutral ×1 factors are hidden (less noise). Final line: `Success: {pct(odds.success)}%` bold. **FF stakes line on poach only**: `odds.crossParty ? '+2 FF stacks on success (cross-party)' : '+1 FF stack on success'` rose styling. Buttons: **Attempt** — disabled/titled by the SAME row logic (stale-panel guard) → `await attemptConversion(confirmingPol.id); setConfirming(null);` (result visible same render: feed entry, status flips, badge increments, party badge updates on a successful cross-party poach); **Cancel** → null.
  - **Feed** filter (NEW per-view semantics):
    - Own/rival faction view: `(g.conversions ?? []).filter(e => e.fromFactionId === activeFactionId || e.toFactionId === activeFactionId).slice(-20).reverse()` — own faction sees losses (defect/poach FROM) AND gains (poach/sign TO) AND own actions on others; rival view sees their losses + the player's attempts against them. (Defects with `actorFactionId` absent still match by `fromFactionId`/`toFactionId`.)
    - Free Agents view: `(g.conversions ?? []).filter(e => e.kind === 'sign').slice(-20).reverse()` (binding: sign rows have `fromFactionId === null`; this is the precise filter, simpler than null-checking).
    - Row: year (mono), kind badge from `KIND_LABELS`, **cross-party badge** when `e.crossParty` (rose `'Cross-party!'`), politician name (lookup), `{fromFactionName ?? 'Free Agent'} → {toFactionName}` (lookup; `null` renders `'Free Agent'`), Success/Failed badge, **`FF +{e.ffGained}`** rose badge when `e.ffGained > 0`. Empty: `'No conversions yet.'`
  - **Legend** `<details>` rendered entirely from `CONVERSION_ODDS` / `CONVERSION_ATTEMPTS_PER_TURN` — zero literals in JSX:
    - The passive cascade: `{pct(passive.rate)}% per turn (×{traits.Opportunist.passive} for Opportunists, ×0 for Loyal)`, split `{pct(passive.oneAway)}% one faction away (rank ±1 within your party — edges forced inward)` and `{pct(passive.anyFaction)}% wild card (ANY faction, cross-party allowed — the realignment card)`. Loss cap `{passive.lossCapPerFaction}` per source faction per tick.
    - The four-cell poach matrix as a `<table>`, columns Not-in-office / In-office, rows Same-party / Cross-party, cell text `{pct(matrix[party][office])}%`.
    - Sign at `{pct(sign.base)}% flat`, distance bands `≤{sign.fitCloseMax} → ×{sign.fitBandClose}`, `≥{sign.fitFarMin} → ×{sign.fitBandFar}`.
    - **Willingness table** (poach only): rows for each named factor with their `×N` value, plus a one-line note `Sign: only fit bands + Loyal/Opportunist apply`.
    - FF stacks: `+{ffStacks.same}` same-party, `+{ffStacks.cross}` cross-party (passive AND poach); −5 PV/stack with `−1/turn` decay at 2.1.3.
    - Trait seeds: `~{pct(seed.loyal)}% Loyal` / `~{pct(seed.opportunist)}% Opportunist` / `~{pct(1 - seed.loyal - seed.opportunist)}% neither`; Loyal +4 PV passive-immune, Opportunist −5 PV double-risk.
    - The {CONVERSION_ATTEMPTS_PER_TURN}-attempt cap (failures count); the one-attempt-per-subject lock; the phase lock; that in-office politicians are valid subjects (the matrix prices them).
  - **Empty roster**: `base.length === 0` → own view `'No politicians in your faction.'`; rival view `'This faction has no active politicians.'`; Free Agents view `'No free agents available.'`; feed and legend always render.

## Files to touch (exact, ordered)
1. `/home/user/AMPU/src/types.ts` — Trait union + POSITIVE_TRAITS / NEGATIVE_TRAITS additions; `Politician.conversionTraitsSeeded` / `lastConversionAttemptYear`; `GameState.conversions` / `conversionAttempts`; `ConversionEntry`; `CONVERSION_ODDS`, `CONVERSION_ATTEMPTS_PER_TURN`, `CONVERSIONS_CAP`
2. `/home/user/AMPU/src/engine/phaseRunners.ts` — delete old 2.1.6 body (816–830); add Loyal exclusion to existing career-pool filter (line 320); add `conversionAttemptCounts`, `passiveConversionChance` (exported), `mentorBondAnchored`, `conversionOdds` (exported), `factionRankMap`, `defectionDestination`, `recordConversion`, `resolveConversion`, `attemptPlayerConversion` (exported); rewrite `runPhase_2_1_6_Conversions`; import additions
3. `/home/user/AMPU/src/state/GameContext.tsx` — `attemptConversion` (interface + delegation + value); import; repair() untouched
4. `/home/user/AMPU/src/pages/Conversions.tsx` — new page: header/badge/functional dropdown with Free Agents pseudo-view, three view modes (own/rival/free-agents) with view-specific columns + actions (own = NO action button, rival = Poach, free agents = Sign), confirm card with itemized multiplier readout + FF stakes line, feed with per-view filter, legend, empty states
5. `/home/user/AMPU/src/pages/registry.ts` — `'conversions'` PageId + Pages entry + import
6. `/home/user/AMPU/src/components/Sidebar.tsx` — `'Faction Conversions'` item after Ideology Shifts
7. `/home/user/AMPU/src/App.tsx` — `lastConversionEntryKey` ref + fifth auto-nav effect (key `` `${year}:2.1.6` ``, page `'conversions'`)

## Test / verification plan
- Build/typecheck: `npm run build`.
- Playtest 1856 (`npm run dev`, new game):
  1. Advance through draft → careers → relocations → ideology → rest at 2.1.6: fifth auto-nav lands on Faction Conversions. First window: zero Loyal/Opportunist badges anywhere (seeding is in the tick), previews show base 20% sign / matrix cell × 1.0 for unmodified targets.
  2. Own view: confirm NO action button anywhere in the roster, Risk % column reads `2%` on most rows (no Opportunists yet), Mentor column shows `Bonded` on the kingmaker's protégé (and the kingmaker if reciprocal).
  3. Switch dropdown to a same-party rival: party-match badge `'Same'`, Poach buttons enabled; pick an out-of-office target with worse fit → confirm card shows `20% × 0.5 (worse fit) = 10.0%`; Attempt to a Success → faction+party badge updates same render, FF +1 visible in feed.
  4. Same-party in-office target: matrix cell `5%` × any fit → preview matches. Attempt → either Success (rare; if it lands, verify the senator's seat label persists but party label flips, and 2.2.1 chamber math next phase reflects the new partyId) or Failed (feed reads `A → B Failed`, badge increments, subject stamped).
  5. Cross-party out-of-office Poach: confirm card shows the `'+2 FF stacks on success (cross-party)'` rose stakes line; base 10%; land a success → cross-party badge in feed, FF +2 visible, victim's PV drops −10. Cross-party in-office (2%): low odds, primarily to verify the price; if it lands, **confirm the senate/house majority count reflects the flipped party** (CongressPage / Dashboard render-time computed).
  6. Free Agents view: dropdown reads `Free Agents`, no PartyBadge; signed candidates show `Close`/`Mid`/`Far` band + computed Sign odds; pick a close-fit free agent and Sign → success applies recruiter's party (verify `partyId` lookup downstream isn't null anywhere).
  7. Spend all 5 attempts (sign + poach share the cap) → every Action disabled with `'No attempts remaining this phase (5/5)'`. Verify the player's count drives the badge regardless of viewed dropdown.
  8. Reload mid-window: badge + stamps + feed intact; auto-nav refires. Outside 2.1.6 the buttons read the phase-lock tooltip (page stays viewable).
  9. Advance (tick): feed gains Defect entries with no `actorFactionId` (rendered with same row layout, `Poach`/`Sign` badge absent → `Defect` badge present); confirm **≤2 passive losses per source faction**; verify at least one **wild-card cross-party defection** appears within ~5–10 turns (`Cross-party!` badge visible on a Defect row); confirm Loyal/Opportunist badges appear with their PV deltas after the first tick (+4 / −5 visible in PV column); confirm CPU Sign/Poach entries **including attacks on the player's roster** (own-view feed shows `actorFactionId` from a rival); confirm exactly ONE `'Realignment currents: …'` line in the Event Log per tick that did anything.
  10. Next turn: the poached/defected politician's FF stack decayed by 1 at 2.1.3; the stamped politician from step 4 is attemptable again (year advanced — stamp self-expired).
  11. Over ~10 turns: passive defection rate eyeballs ≈ 2% × (200 living world-wide − Loyal share − loss-capped late entries) → ~3–5 defects/turn — well within the 200-cap; CPU pass ≈ 0.7 sign + 1.2 poach per CPU faction (≈ 17 attempts/turn world-wide).
- **1772 smoke**: turn 1 reaches 2.1.6 (2.1.6 is NOT first-turn-skipped); the inaugural-draft leftovers populate the **Free Agents view immediately** — verify signs work on the inaugural class, no crash; verify 1772's 5/5 BLUE/RED faction structure ranks identically (rank map populates with 5 ranks per party); verify 1772 turn 5 free-agent count is non-zero (dataset leftovers persist for several years).
- **Edge cases from the spec to verify manually**:
  - Single-living-faction party (defensive only — can't occur with shipped data): rig via console state edits → confirm 90% one-away bucket fizzles unrecorded, the 10% wild card still works.
  - All-same-center factions tie-breaking: confirm rank order is stable across reloads (faction-id tie-break is deterministic by `localeCompare`).
  - Empty recruiter faction: poach button still enabled with fit ×1 preview (binding deviation from ideology-shifts); a successful poach from an empty faction populates that faction's roster with one member.
  - Stale mentor bond after a kingmaker defects: protégé's mentor badge clears (predicate requires partner in CURRENT faction); 2.1.7 doesn't reassign (binding accepted-staleness — document only).
  - Both-traits hand edit: `Loyal + Opportunist` → passive 0 (Loyal dominates), poach/sign multiplier 0.375.
  - Legacy save loads with zero `repair()` churn; seeds on first 2.1.6 tick; previews match rolls exactly (×1) until then.

## Risks
1. **TRIPLE-SYSTEM PRE-ELECTION CHURN NOW ALSO TOUCHES `partyId` MID-TURN — biggest blast radius of any feature so far despite the audit being clean.** Cross-party flips at 2.1.6 reshape THIS turn's 2.2.1 chamber majorities (senate/house counts recompute live), 2.6.3 floor votes (sponsor + caucus filters live), and 2.9.x election candidate filters (primary brackets live) — verified zero cached party rosters exist (Senator/State seat structs store `politicianId` only, ~26 live `p.partyId` read sites all recompute), but the AGGREGATE effect on a single turn is unprecedented: a flipped senator changes who controls the Senate next phase. Election-result records (`ElectionResult.candidates[].partyId`, types.ts:480) are correctly frozen and unaffected. NO PV or election FORMULA changes — all churn flows through existing live reads. The POTUS-can-defect binding (no v1 exception) is the loudest single sub-risk: a 0.2%/turn wild-card party-flipped presidency is intended drama but flagged for playtest sign-off — the guard is one line if rejected.
2. **The shared 5-attempt cap (sign + poach) is a real opportunity cost** — same shape as the ideology-shifts cap, but here every poach attempt against a CPU drains a sign attempt on a free agent and vice versa. CPU hard-reserves `signBudget = 2`, so a hot sign pass leaves CPUs with only ≤3 poach attempts. The two CPU gates (signGate 0.35 / poachGate 0.15) are my numbers — tune via the const if turns feel starved or spammy; do not split the counter into two pools without a new checkpoint.
3. **Boolean contract divergence (inherited triple — relocations → ideology-shifts → conversions):** `attemptPlayerConversion`'s `true` means "attempt RAN" — a failed roll returns `true` and has mutated counter/stamp/feed (must persist). The single `attemptConversion(politicianId)` context method derives kind from subject state, so a future caller passing a same-faction member will see the resolver return null → context returns early (correctly persisting nothing). Document at the function exactly like `attemptPlayerIdeologyShift`:686–688.
4. **Quintuple auto-nav on draft turns** (draft → careers → relocations → ideology → conversions). Phase-scoped keys can't fight, but the rhythm escalates again — five forced page hops per draft turn is a real UX cost to re-watch.
5. **Stale mentor bonds after defections** (binding accepted in v1): a defected kingmaker's `protegeId` now points cross-faction; the bond anchors neither side (predicate requires partner in CURRENT faction); 2.1.7 never reassigns (checks `!p.protegeId` at line 837). Cosmetically the protégé still shows a `Kingmaker` trait on the kingmaker's old faction-mate, but the multiplier no longer fires. Accepted; documented but not fixed.
6. **Loss-counter ordering determinism**: passive iteration in `snap.politicians` array order with a per-source loss counter means earlier-iteration politicians get to leave a faction before its cap closes the gate. This IS the intended behavior (matches the relocations resident-count snapshot precedent), but it's a real ordering dependency — array reordering anywhere (e.g., a future "sort politicians by id" repair pass) would shift which member of a 3+ defector faction defects. Document via comment in the passive pass.
7. **Free-agent seeding hits BOTH Loyal AND Opportunist** (binding): a Loyal free agent is harder to sign than a baseline one, which matters more in the 1772 founding scenario where the dataset leftovers populate the dead pool. Eyeball that ≥8% of free-agent sign attempts return ~5% odds rather than ~20% on turn 1.
8. **Third page→engine import** (`Conversions.tsx` imports pure `factionCenter` + `conversionOdds` + `passiveConversionChance` from phaseRunners). Sanctioned for preview === roll parity (relocations and ideology-shifts established the door); importing anything stateful from engine into pages remains off-limits. `mentorBondAnchored` is private — the page surfaces it via `conversionOdds.factors.mentorBond !== 1` for the rival-view tooltip and reads `Mentor` column on the own view via a tiny clone of the predicate (or: export it as a fourth helper — pick: export it, since the own-view badge is a heavy enough use to deserve a single-source predicate).
9. **Feed economics**: ~3–5 passive defects + ~17 CPU attempts + up to 5 player attempts ≈ 25 entries/turn world-wide → the 200-cap drains in ~8 turns (invisible at the 20-entry display depth — raise `CONVERSIONS_CAP` only if a deeper history view ships). Same shape as the ideology-shifts feed cap risk.
10. **The own-view "no action button" is binding** (vision-confirmed, spec assumption #3). Defensive levers are Loyal seeds (passive-immune + 0.25× poach), mentor bonds (0.5× poach), 2.1.5 cohesion (better fit → worse poach odds on your members), and stamping CONTESTED rivals/free agents to first-mover lock them. A future request to add a "stamp my own member" action would require a new checkpoint — it changes the kind taxonomy and adds a third attempt-counter pool.
