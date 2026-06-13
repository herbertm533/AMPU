# Brief: Founding Flow Cleanup (1772 — Event-Gated CC Assembly)

## Approach

Foundation pass for the 1772 era. The `appointDelegates(snap)` call that fires unconditionally every turn at the end of `runPhase_2_10_End` is the silent-turn-1 source — remove it, and the Continental Congress stays `null` until an event assembles it. The First CC is wired through the previously-declared-but-unused `EraEvent.postEffects` field, which we light up as a generic engine-side dispatcher (one new `applyPostEffects(snap, event)` helper, single switch on `pe.type`, one case `'assembleCC'`). The Intolerable Acts event gets that postEffect attached; resolution path runs `appointDelegates → electCCPresident → appointCCCommittees` atomically before the modal closes. Second and all future reassemblies are SCHEDULED off a new `cc.delegateTermStartYear` clock (`CC_TERM_YEARS = 4`); no Lexington/Concord hook. Articles ratification extends the existing templateId case to vacate the old President and re-elect for the Confederation Congress. The SpeakerOfHouse hack on `electCCPresident` is dropped for a real `OfficeType.CCPresident`; the underdog tiebreak flips to dominant-faction. The Convention dissolution path vacates the CC President's office before nulling the body. Rejected alternative: extending `handleScripted1772Consequences` with a new `case 'intolerable_acts':` (per the older spec recommendation) — Checkpoint 1 chose postEffects because (a) the event's `decider: 'auto'` single-response shape semantically matches "event happened, consequences fire", (b) it's the natural place for any future generic event consequence, and (c) future-proofs additional postEffect types without growing the templateId switch.

## State & type changes

All in `/home/user/AMPU/src/types.ts`.

### `OfficeType` union (line 346)

Add `'CCPresident'` as the next-to-last entry, before `'Ambassador'` at line 346:

```ts
  | 'PartyLeader'
  | 'CCPresident'
  | 'Ambassador';
```

### `ContinentalCongress` interface (lines 441–450)

Add two optional fields:

```ts
export interface ContinentalCongress {
  delegates: CCDelegate[];
  presidentId: string | null;
  committeeChairs: {
    domestic: string | null;
    foreignMilitary: string | null;
    economic: string | null;
    judicial: string | null;
  };
  delegateTermStartYear?: number;
  assemblyOrdinal?: number;
}
```

Both optional — legacy saves load unchanged. `delegateTermStartYear` powers the term clock; `assemblyOrdinal` drives "First / Second / Third …" log labeling.

### `EraEvent.postEffects` type union (line 569)

Add `'assembleCC'` to the existing union:

```ts
postEffects?: { type: 'startWar' | 'unlockGovernors' | 'unlockArticles' | 'startConvention' | 'endWar' | 'addPolitician' | 'assembleCC'; payload?: unknown }[];
```

### `EraEventResponse` (lines 550–555)

UNCHANGED. The Checkpoint 1 clarification is binding: we read postEffects from the top-level `EraEvent`, not from the response (the Intolerable Acts event is `decider: 'auto'` with one response, so "event happened" === "response 'ok' picked").

### Save / migration impact

- `delegateTermStartYear` is optional; the term-comparison fallback `?? snap.game.year` means a mid-game 1772 save with a populated CC but no field gets its clock started on first 2.10 sight (no surprise instant reassembly).
- `assemblyOrdinal` is optional; the reassembly code reads `?? 1` and the first scheduled reassembly will write `2`, so legacy populated CCs land as "Second Continental Congress" on their first scheduled reseat — semantically correct (it IS the second time delegates have been seated, just one of them being saved-from-load).
- No `repair()` extension needed. The optional fields and the in-engine `??` fallbacks cover it.
- The `OfficeType` union expansion is type-only; no seed politician currently has `currentOffice.type === 'CCPresident'` (the old hack used `'SpeakerOfHouse'`), so no migration code touches seed data. Mid-game saves where the old hack seated someone as `'SpeakerOfHouse'` for the CC role will keep that office string until the CC President is next vacated/re-elected — acceptable cosmetic legacy (the new election will rewrite to `'CCPresident'`).

## Engine changes (pure logic)

All randomness via `rng.ts`. The new dispatcher is pure over snapshot; all calls deterministic.

### 1) `/home/user/AMPU/src/pv.ts` — CCPresident in OFFICE_PRESTIGE and officeWeights

**`OFFICE_PRESTIGE` map (lines 7–29)** — insert `CCPresident: 25` between `SpeakerOfHouse: 12` (line 20) and `President: 30` ordering-wise; physically place it next to `SpeakerOfHouse` (line 20–21 area):

```ts
  SpeakerOfHouse: 12,
  CCPresident: 25,
  SenateProTem: 10,
```

Magnitude: +25 sits +20 above Senator (5), +13 above Speaker (12), −5 below President (30) — reflects chief presiding officer of pre-constitutional federal government.

**`officeWeights` (lines 31–61)** — add `CCPresident` to the legislative-bucket case-fallthrough cluster at lines 42–47:

```ts
    case 'Senator':
    case 'SpeakerOfHouse':
    case 'SenateProTem':
    case 'Representative':
    case 'CommitteeChair':
    case 'CCPresident':
      return { admin: 0.5, legislative: 2.5, judicial: 0.5, military: 0, governing: 0.5, backroom: 1 };
```

Falling into `default` (flat weights) would silently understate the legislative weighting.

### 2) `/home/user/AMPU/src/engine/continentalCongress.ts` — term constant, ordinal helper, appointDelegates tail, electCCPresident tiebreak + office

**Top of file (after the existing imports at line 4)** — add:

```ts
export const CC_TERM_YEARS = 4;

function numberToOrdinal(n: number): string {
  const map = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
  return map[n] ?? `${n}-th`;
}
```

`CC_TERM_YEARS` is exported because `runPhase_2_10_End` (in phaseRunners.ts) reads it; `numberToOrdinal` stays file-local (only used here and within phaseRunners — see Step 4 below; the phaseRunners callsite imports it).

Actually — re-pin: `numberToOrdinal` is needed in two sites (the scheduled-reassembly log in `runPhase_2_10_End` and, via the postEffects dispatcher's hardcoded first-time string, only "First" matters there as a literal). Cleaner to **export `numberToOrdinal`** so phaseRunners can import it for the scheduled-reassembly log. Pin: `export function numberToOrdinal(...)`.

**`appointDelegates` tail (after line 89 — the existing `addLog`)** — append:

```ts
  cc.delegateTermStartYear = snap.game.year;
```

NOTE: `appointDelegates` is now called from THREE sites (the postEffects dispatcher for First CC, `runPhase_2_10_End` for scheduled reseats, and indirectly any future code path). The `cc.delegateTermStartYear` write at the tail is the single source — every appoint resets the clock. Do NOT also write the field from the dispatcher; one source.

**`electCCPresident`** — three edits inside the function (lines 105–140):

(a) **Remove the comment at line 115** (`// pick the tied faction with lowest total PV (an underdog tiebreak)`) and replace with `// pick the tied faction with highest total PV (dominant-faction)`.

(b) **Flip the tiebreak comparator at line 121** from `a.sum - b.sum` to `b.sum - a.sum`. Result:

```ts
    sums.sort((a, b) => b.sum - a.sum);
```

(c) **Change the winner office at line 138** from `{ type: 'SpeakerOfHouse' }` to `{ type: 'CCPresident' }`. Remove the `// re-using closest existing OfficeType` trailing comment:

```ts
  winner.currentOffice = { type: 'CCPresident' };
```

**`ensureCC` (lines 92–101)** — UNCHANGED. The shell-materialization hazard is handled by phase-runner guards (see Step 3), not by altering `ensureCC` itself. The function stays as a lazy-init for the case where the dispatcher or 2.10 reseat path needs a fresh CC after a save migration or a from-null assembly.

### 3) `/home/user/AMPU/src/engine/phaseRunners.ts` — dispatcher, resolveEraEvent integration, scheduled reseat, ensureCC guards, Articles consequence, vacateOffice CCPresident

**Imports (top of file)** — confirm `appointDelegates`, `electCCPresident`, `appointCCCommittees` are already imported from `'./continentalCongress'`; ADD `CC_TERM_YEARS, numberToOrdinal` to that same import line.

**New helper `applyPostEffects` — insert directly above `handleScripted1772Consequences` (just before line 1875)**:

```ts
function applyPostEffects(snap: FullGameSnapshot, event: EraEvent): void {
  if (!event.postEffects || event.postEffects.length === 0) return;
  for (const pe of event.postEffects) {
    switch (pe.type) {
      case 'assembleCC': {
        // Idempotent: skip if already assembled (defensive against save-migration replays).
        const ccExisting = snap.game.continentalCongress;
        if (ccExisting && ccExisting.delegates.length > 0) break;
        appointDelegates(snap);
        electCCPresident(snap);
        appointCCCommittees(snap);
        const cc = snap.game.continentalCongress;
        if (cc) {
          cc.assemblyOrdinal = 1;
          // delegateTermStartYear already set by appointDelegates tail.
        }
        addLog(snap, '2.4.3', 'appointment', `First Continental Congress convenes in Philadelphia. Delegates from ${snap.states.length} colonies.`);
        break;
      }
      default:
        // Unknown postEffect type — log and ignore. Defensive for future additions.
        addLog(snap, '2.4.3', 'system', `Unknown postEffect type: ${pe.type}.`);
        break;
    }
  }
}
```

Pure; iterates `event.postEffects` in array order; idempotent on `'assembleCC'`; defensive default arm logs unknown types so a future addition that wasn't wired here is visible in the feed instead of silently no-op. NO `response` parameter — the Checkpoint 1 clarification binds this.

**`resolveEraEvent` (lines 1849–1873)** — insert the `applyPostEffects` call AFTER the existing `handleScripted1772Consequences(snap, event, responseId)` call at line 1863, BEFORE the generic unlocks block at line 1866:

```ts
  // Handle 1772-specific consequences
  if (snap.game.scenarioId === '1772') {
    handleScripted1772Consequences(snap, event, responseId);
  }

  // Generic engine-side postEffects dispatcher (scenario-agnostic).
  applyPostEffects(snap, event);

  // Generic unlocks
  if (event.unlocks?.includes('governors')) {
```

Order matters: `applyEffect` (line 1854) → templateId scripted consequences (line 1863) → postEffects dispatcher → generic unlocks. The dispatcher runs AFTER `handleScripted1772Consequences` so that the existing templateId path's behaviors land first; the First-CC assembly is purely additive on top.

**`handleScripted1772Consequences` — extend `articles_of_confederation` case (lines 1905–1908)** — REPLACE in place:

```ts
    case 'articles_of_confederation': {
      snap.game.articlesOfConfederation = true;
      const cc = snap.game.continentalCongress;
      if (cc) {
        const oldPres = cc.presidentId ? snap.politicians.find((p) => p.id === cc.presidentId) : null;
        if (oldPres && oldPres.currentOffice?.type === 'CCPresident') oldPres.currentOffice = null;
        cc.presidentId = null;
        electCCPresident(snap);
        addLog(snap, '2.4.3', 'appointment', 'The Confederation Congress elects its first President.');
      }
      break;
    }
```

The defensive `oldPres.currentOffice?.type === 'CCPresident'` check ensures we don't accidentally clear a different office that a CC President somehow held (impossible by design but harmless to gate). Delegate roster is unchanged — only the President seat rotates.

**`lexington_concord` case (lines 1894–1899)** — UNCHANGED. The Second CC is scheduled, not event-driven.

**`intolerable_acts` case** — NOT ADDED. Wired via `applyPostEffects` instead.

**`vacateOffice` (lines 1768–1797)** — insert ONE line before the cabinet loop at line 1793:

```ts
  if (t === 'CCPresident' && snap.game.continentalCongress) snap.game.continentalCongress.presidentId = null;
```

Place it after the `if (t === 'Governor')` block (lines 1787–1791) and before the cabinet loop opener (line 1793). The `&& snap.game.continentalCongress` guard handles the unlikely case where a CCPresident is vacated after the CC has already been nulled (e.g., during the Convention ratification window).

**`runPhase_2_10_End` (lines 2480–2491)** — REPLACE the unconditional independence-era block (lines 2487–2489) with the scheduled-reseat logic:

```ts
  // 1772: reassemble Continental Congress on term clock (CC_TERM_YEARS).
  if (snap.game.currentEra === 'independence' && snap.game.continentalCongress) {
    const cc = snap.game.continentalCongress;
    const termStart = cc.delegateTermStartYear ?? snap.game.year;
    if (snap.game.year - termStart >= CC_TERM_YEARS) {
      appointDelegates(snap);
      // appointDelegates resets delegateTermStartYear at its tail.
      cc.assemblyOrdinal = (cc.assemblyOrdinal ?? 1) + 1;
      const ordinal = numberToOrdinal(cc.assemblyOrdinal);
      addLog(snap, '2.10', 'appointment', `${ordinal} Continental Congress convenes in Philadelphia.`);
      // Defensive: if the old President is no longer in the roster, re-elect.
      if (cc.presidentId && !cc.delegates.find((d) => d.politicianId === cc.presidentId)) {
        electCCPresident(snap);
      }
    }
  }
  addLog(snap, '2.10', 'system', `End of ${snap.game.year - 2}-${snap.game.year} term.`);
```

Three behaviors:
1. CC stays `null` until `applyPostEffects` assembles it — the `if (cc)` outer guard short-circuits cleanly.
2. The `?? snap.game.year` fallback handles the mid-game save migration: legacy saves' clocks start the moment 2.10 first sees the field is missing.
3. Defensive President re-election covers the case where the dominant-faction shift during reseat removed the incumbent from the new roster.

**ensureCC guards — independence-era branches at four phase entry points** (Checkpoint 1 binding):

(a) **`runPhase_2_2_1_CongressLeadership` (line 1613)** — the existing branch:

```ts
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    electCCPresident(snap);
    return;
  }
```

Insert the new guard between the era check (line 1613) and the `electCCPresident(snap)` call (line 1615).

(b) **`runPhase_2_2_2_Committees` (line 1649)**:

```ts
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    appointCCCommittees(snap);
    return;
  }
```

Insert before line 1650.

(c) **`runPhase_2_6_1_Proposals` (line 2087)**:

```ts
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    generateCCBills(snap);
    return;
  }
```

Insert before line 2088.

(d) **`runPhase_2_6_3_Floor` (line 2153)**:

```ts
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    for (const billId of snap.game.pendingLegislation) {
```

Insert before line 2154.

NOTE on 2.6.2: `runPhase_2_6_2_Committee` (line 2117) in the independence era just iterates `snap.game.pendingLegislation` and bumps statuses — does NOT call into the CC functions that would trigger `ensureCC`. No guard needed; the existing era branch is benign.

These guards keep `snap.game.continentalCongress === null` literally true until `applyPostEffects` assembles it, preserving the page's `!cc || cc.delegates.length === 0` empty-state check (page line 8) as the source of truth.

### 4) `/home/user/AMPU/src/engine/constitutionalConvention.ts` — vacate CC President before nulling CC

**`applyConvention` (lines 186–197)** — before the `snap.game.continentalCongress = null` at line 189, vacate the President's office:

```ts
  if (conv.ratified) {
    snap.game.constitutionRatified = true;
    snap.game.currentEra = 'federalism';
    const cc = snap.game.continentalCongress;
    if (cc) {
      const pres = cc.presidentId ? snap.politicians.find((p) => p.id === cc.presidentId) : null;
      if (pres && pres.currentOffice?.type === 'CCPresident') pres.currentOffice = null;
    }
    snap.game.continentalCongress = null;
    snap.game.articlesOfConfederation = false;
    addLog(snap, '2.4.3', 'system', 'The Constitution takes effect. The Confederation Congress is dissolved. Federalism begins.');
    // Federal Republic: states are no longer colonies
    for (const s of snap.states) {
      s.isColony = false;
      s.electoralVotes = Math.max(3, (s.ccDelegateSlots ?? 2) + 1);
    }
  }
```

Defensive `pres.currentOffice?.type === 'CCPresident'` check so we don't clear a federal office a dual-roled politician might already have transitioned into. No retire, no death — the ex-CC-President becomes a free agent eligible for federal office in the new republic.

### 5) `/home/user/AMPU/src/data/eraEvents1772.ts` — attach assembleCC postEffect

**Intolerable Acts (lines 47–58)** — change `postEffects: []` at line 56 to:

```ts
      postEffects: [{ type: 'assembleCC' }],
```

Lexington/Concord (lines 94–119) and Articles (lines 220–235) — UNCHANGED. Lex/Concord's `postEffects: []` stays inert (per Checkpoint 1, Second CC is scheduled). Articles' consequence extension lives in `handleScripted1772Consequences`, not in the data.

## UI changes

None. `ContinentalCongressPage` (line 8: `!cc || cc.delegates.length === 0`) already handles the null/empty case with the correct copy ("No delegates appointed yet. The First Continental Congress will assemble after the Intolerable Acts."). Page header (line 34) already switches "Continental Congress" vs "Confederation Congress" on `articlesOfConfederation`.

`GameContext.tsx` — UNCHANGED. The `chooseEraResponse` callback at line 291 calls `resolveEraEvent`, and the new `applyPostEffects` dispatcher runs inside `resolveEraEvent` — so the modal closes only after the full assembly has happened (Spec criterion #3 is satisfied without any GameContext mutator additions).

## Files to touch (exact, ordered)

1. `/home/user/AMPU/src/types.ts` — `OfficeType` adds `'CCPresident'` (line 346); `ContinentalCongress` adds optional `delegateTermStartYear?: number` and `assemblyOrdinal?: number` (after line 449); `EraEvent.postEffects` type union adds `'assembleCC'` (line 569).
2. `/home/user/AMPU/src/pv.ts` — `OFFICE_PRESTIGE` gains `CCPresident: 25` (next to SpeakerOfHouse, line 20–21 area); `officeWeights` adds `case 'CCPresident':` to the legislative-bucket fallthrough cluster (after line 46).
3. `/home/user/AMPU/src/engine/continentalCongress.ts` — export `CC_TERM_YEARS = 4` and `numberToOrdinal` helper at top of file (after imports); `appointDelegates` tail writes `cc.delegateTermStartYear = snap.game.year` (after line 89); `electCCPresident` flips tiebreak comparator (line 121) from `a.sum - b.sum` to `b.sum - a.sum`, removes the underdog comment (line 116), and changes the winner office (line 138) to `{ type: 'CCPresident' }`.
4. `/home/user/AMPU/src/engine/phaseRunners.ts` — import `CC_TERM_YEARS, numberToOrdinal` from `./continentalCongress`; new `applyPostEffects(snap, event)` helper above line 1875; `resolveEraEvent` calls it after line 1863 and before line 1866; four ensureCC guards (lines 1613 / 1650 / 2088 / 2154 entry-points get `if (snap.game.continentalCongress === null) return;` right after the era check); `vacateOffice` adds the CCPresident arm before the cabinet loop at line 1793; `handleScripted1772Consequences` extends `articles_of_confederation` case (lines 1905–1908) to vacate the old President and re-elect; `runPhase_2_10_End` replaces the unconditional `appointDelegates` call (lines 2487–2489) with the term-clock scheduled reseat.
5. `/home/user/AMPU/src/engine/constitutionalConvention.ts` — `applyConvention` (lines 186–197) clears the CC President's `currentOffice` before nulling `snap.game.continentalCongress` at line 189.
6. `/home/user/AMPU/src/data/eraEvents1772.ts` — Intolerable Acts `postEffects: []` (line 56) becomes `postEffects: [{ type: 'assembleCC' }]`.

Confirmed UNTOUCHED: `engine.ts`, `phases.ts`, `pages/ContinentalCongressPage.tsx`, `state/GameContext.tsx`, scenario data, draft pipeline, every page/component.

## Test / verification plan

- **Build/typecheck**: `npm run build`. `OfficeType` expansion is type-safe — the new literal flows through `OfficeRef`, `OFFICE_PRESTIGE` (string-keyed Record, accepts), `officeWeights` (switch, new case added). `ContinentalCongress` optional fields are backward-compatible. `EraEvent.postEffects` type-union expansion accepts the new `'assembleCC'` literal at the Intolerable Acts data site.

- **Playtest 1772 (`npm run dev`, new game)**:
  1. Turn 1 (year 1772): open the `ContinentalCongressPage` (sidebar Era → Continental Congress). Verify the empty-state message renders: "No delegates appointed yet. The First Continental Congress will assemble after the Intolerable Acts." Inspect `snap.game.continentalCongress` via DevTools — should be `null` after the entire turn-1 sequence including 2.10.
  2. Advance phases: `Gaspee → Committees of Correspondence → Tea Act → Boston Tea Party → Intolerable Acts`. The Intolerable Acts modal fires with one button "Convene the First Continental Congress". Click it. Before the modal closes (atomically): the CC populates (delegates from all 13 colonies, a President seated with `currentOffice.type === 'CCPresident'`, four committee chairs). The event feed shows a `2.4.3` `appointment` entry: "First Continental Congress convenes in Philadelphia. Delegates from 13 colonies." Then the existing `2.10` `appointment` entry "Continental Congress delegates appointed: N delegates from 13 states." (two log lines is acceptable for the historical moment per spec recommendation).
  3. Advance turns 1774 → 1776: roster persists (no churn). Verify `cc.delegateTermStartYear === 1774` (or whichever year Intolerable Acts fired). Verify `cc.assemblyOrdinal === 1`.
  4. Advance to year 1778 (= 1774 + CC_TERM_YEARS): `runPhase_2_10_End` fires the scheduled reseat. Feed shows "Second Continental Congress convenes in Philadelphia." `cc.assemblyOrdinal === 2`. `cc.delegateTermStartYear === 1778`. Delegate roster may shift (per existing factional logic); President carries over if still a delegate, otherwise re-elected (verify via the defensive re-election branch).
  5. Lexington/Concord (1775) fires somewhere between steps 3 and 4 depending on event ordering — verify it DOES NOT trigger a CC reassembly (no "Second CC convenes" log on the Lex/Concord turn unless the term clock has elapsed by then). Lex/Concord starts the Rev War per the existing `handleScripted1772Consequences` lex case (unchanged).
  6. Articles of Confederation event (gateYear 1777): click "Ratify the Articles". `articlesOfConfederation` flips true; the old CC President's `currentOffice` clears to null; `electCCPresident` re-runs (possibly the same person, possibly different — dominant-faction tiebreak fires). Feed shows "The Confederation Congress elects its first President." Page header swaps to "Confederation Congress".
  7. Continue through Declaration of Independence, Treaty of Paris, Constitutional Convention. On Convention ratification, `applyConvention` clears the CC President's `currentOffice` and nulls `snap.game.continentalCongress`. The ex-President is a free agent in federalism era (no office block); they show up in `Politicians` page with `currentOffice: null`.
  8. CC President death between turns: if the President dies at 2.4.1, `vacateOffice` clears `cc.presidentId` via the new arm. Next 2.2.1 (independence-era branch) calls `electCCPresident` again on the existing delegate roster (verified the guard `if (snap.game.continentalCongress === null) return;` does NOT trip because CC is still assembled). Vacancy auto-filled at the next 2.2.1 tick.

- **Playtest 1856 smoke**:
  1. Start an 1856 game. Verify turn 1 → turn 2 sequence produces the same logs and state shape as before — `currentEra === 'federalism'` short-circuits the new `runPhase_2_10_End` CC block; the four ensureCC guards in 2.2.1 / 2.2.2 / 2.6.1 / 2.6.3 sit inside `if (currentEra === 'independence')` branches, so federalism era never enters them.

- **Mid-game 1772 save migration check**:
  1. From a pre-feature save where CC is fully populated and `delegateTermStartYear` is undefined: load the save. The page renders identically. On the first 2.10 after load, the term comparison falls through `?? snap.game.year`, so `year - year = 0 < 4` → no reassembly. The clock effectively restarts on first 2.10 sight.
  2. From a pre-feature save before the Intolerable Acts (CC === null, `'intolerable_acts'` NOT in `eraEventsCompleted`): load the save. CC stays null. Player assembles it via the event when it fires.
  3. Pathological: from a save where `'intolerable_acts'` IS in `eraEventsCompleted` but CC === null (shouldn't happen but defensible): the dispatcher's idempotent guard `if (ccExisting && ccExisting.delegates.length > 0) break;` does NOT trip (cc is null), so the assembly fires when the event is replayed. But the event has `resolved: true` in `pendingEraEvents`, so it won't be replayed — meaning this pathological save stays CC-null forever. This is acceptable; not a binding migration concern per Checkpoint 1 (no autonomous load-time re-assembly).

- **Edge cases**:
  - Player advances past turn 1 with no CC, before Intolerable Acts fires: 2.2.1 / 2.2.2 / 2.6.1 / 2.6.3 independence branches all early-return on the null guard. No `ensureCC` shell materialization. Page stays at empty-state copy.
  - CC President defects (2.1.6): faction changes, but `cc.presidentId` is by id, so they remain President. Re-election only fires at scripted moments (Articles flip) or at scheduled-reassembly defensive re-election if they're no longer a delegate.
  - First CC clicks, then immediately the Articles event fires same turn: spec verifies the templateId switch runs first (line 1863, `handleScripted1772Consequences`) before the postEffects dispatcher (new line). But the Intolerable Acts and Articles events are gated apart by `requiresTemplate` chain — they cannot both fire same turn. Not a real conflict.
  - Constitution ratifies in same turn the President just died (no current President): `cc.presidentId` is null, the `pres` lookup returns null, the `if (pres && ...)` clear is a no-op, and `continentalCongress = null` proceeds normally. No crash.
  - Soft check: grep for any leftover `'SpeakerOfHouse'` references in the CC code path — the hack site (continentalCongress.ts:138) is the only one. Speaker references in `runPhase_2_2_1_CongressLeadership` (line 1633) are the real federal Speaker and stay.

## Risks

1. **`ensureCC` shell-materialization hazard (lead).** If any of the four phase-runner guards (2.2.1 / 2.2.2 / 2.6.1 / 2.6.3) is missed, the lazy `ensureCC` materializes a `{ delegates: [], presidentId: null, committeeChairs: {…null} }` shell when `electCCPresident` or `appointCCCommittees` is called speculatively in the pre-Intolerable-Acts independence-era turns. The page's `!cc || cc.delegates.length === 0` check (line 8) is a safety net but the spec binds "literally null" as source of truth. The builder MUST verify all four guards land at the correct lines (1613, 1650, 2088, 2154) before merge. Lex/Concord and pre-Intolerable Acts turn-1 are the highest-risk windows.
2. **`postEffects` dispatcher lit up for the first time.** Any future postEffect type added to the engine must be handled by the dispatcher; the spec mandates a defensive `default` arm that logs unknown types so silent no-ops are visible. Builder MUST keep the `default` arm in `applyPostEffects` even if it feels noisy — it's the contract.
3. **Articles `articles_of_confederation` case extension is in place, not replaced.** The existing line at 1906 (`snap.game.articlesOfConfederation = true`) MUST stay. The new vacate + re-elect logic appends to it; replacing the case would silently lose the meters flag. Easy to miss this on cursory reading.
4. **Save migration safety.** The `?? snap.game.year` fallback for `delegateTermStartYear` is the entire backward-compat story for legacy populated CCs. If the builder forgets the `??`, every legacy 1772 save with a populated CC instantly fires a "Second CC convenes" reseat on first load — wrong behavior, surprising for the player. Triple-check the `??` in `runPhase_2_10_End`.
5. **1772-only scope is the real mitigation.** None of these changes touch 1856 — the era guards in 2.10, 2.2.1, 2.2.2, 2.6.1, 2.6.3 cleanly partition (verified). The OfficeType expansion and PV map additions are inert for 1856 (no politician gets `CCPresident` office there). Build/typecheck is decisive for the cross-scenario safety.
6. **`numberToOrdinal` overflow.** Map covers 1–10 explicitly; fallback to `${n}-th` for 11+. A normal 1772 game won't reach 10 reassemblies (12-year independence arc / 4-year terms = 3 reassemblies max before Constitution ratifies). Edge case for completeness.
7. **The dispatcher's idempotency guard (`if (ccExisting && ccExisting.delegates.length > 0) break;`) prevents double-assembly** if Intolerable Acts is somehow replayed — but a replayed event would already have `resolved: true`, so this branch shouldn't actually fire in practice. Defensive only.

---

Brief path: `/home/user/AMPU/docs/briefs/founding-flow-cleanup.md`

## Checkpoint-2 summary

- **Approach**: silent unconditional `appointDelegates` removed from `runPhase_2_10_End`; First CC wired through a newly-lit `EraEvent.postEffects` dispatcher (one new `applyPostEffects(snap, event)` helper, one case `'assembleCC'`, defensive default arm); Second+ reassemblies SCHEDULED off `CC_TERM_YEARS = 4` clock kept on `cc.delegateTermStartYear` with `cc.assemblyOrdinal` counter; Articles ratification re-elects the President in-place via existing templateId switch extension; `applyConvention` clears the President's office before nulling the CC; SpeakerOfHouse hack replaced with real `OfficeType.CCPresident` (prestige 25, legislative-bucket weights); underdog tiebreak in `electCCPresident` flipped to dominant-faction; four ensureCC guards added at 2.2.1 / 2.2.2 / 2.6.1 / 2.6.3 independence-era entry points to keep CC literally `null` pre-assembly.
- **Files (6, all required)**: `types.ts` (OfficeType + ContinentalCongress + EraEvent.postEffects), `pv.ts` (OFFICE_PRESTIGE + officeWeights), `engine/continentalCongress.ts` (CC_TERM_YEARS const + numberToOrdinal helper + appointDelegates tail + electCCPresident tiebreak/office), `engine/phaseRunners.ts` (applyPostEffects helper + resolveEraEvent integration + runPhase_2_10_End term-based reassembly + 4 ensureCC guards + handleScripted1772Consequences Articles extension + vacateOffice CCPresident case), `engine/constitutionalConvention.ts` (applyConvention President vacate), `data/eraEvents1772.ts` (Intolerable Acts postEffects entry).
- **Top risk**: `ensureCC` shell-materialization hazard. If any of the four phase-runner guards (2.2.1 / 2.2.2 / 2.6.1 / 2.6.3) is missed, lazy `ensureCC` materializes an empty CC shell speculatively in pre-Intolerable-Acts turns, breaking the "CC is literally null until assembly" invariant. Mitigation: spec binds all four guards as `if (snap.game.continentalCongress === null) return;` at exact lines 1613 / 1650 / 2088 / 2154 immediately after the era check and before any CC function call. Builder must verify all four land.
