# Brief: First Continental Congress Builder (Phase 2.9.6, 1772 scenario)

## Approach

Phase 2.9.6 is **gate-swapped** for the 1772 scenario when the Intolerable
Acts have resolved with "Convene the First Continental Congress" (response
`ok`) AND `year >= 1774`. The existing 1856 House/Senate election logic in
`runPhase_2_9_6_Congressional` is untouched. The runner walks colonies in
alphabetical order, maintaining a transient `ccBuilderCursor` on the
snapshot, and returns `{ needsPlayer: true, payload: {...} }` (mirroring the
draft-runner contract at `phaseRunners.ts:82`) the moment the cursor lands
on a colony controlled by the player's faction. A new page
`continentalCongressBuilder` becomes the active page by the same
auto-navigation pattern `App.tsx` uses for the Draft page — Shell watches
the live-build sentinel and pushes the page on `cursor != null && gate met`.

The `assembleCC` post-effect dispatcher in `phaseRunners.ts:2428` is
amended with a **forward-looking guard** (option (a) in the prompt): when
the snapshot is the 1772 scenario, the event is `intolerable_acts`, and the
chosen response was `ok`, the dispatcher logs a deferral message and
returns without invoking `appointDelegates`. This keeps the auto-build path
intact for every OTHER `assembleCC` source (future Second-CC follow-on
work) and never touches `appointDelegates` itself. **One alternative
rejected:** wiring a "phase 2.9.6 will run this turn" lookahead — too
brittle given the cascade depth from 2.4.3 → 2.9.6 and a future change to
turn ordering would silently break it.

CC President selection at phase 2.2.1 (`electCCPresident`) is out of scope
and untouched. The First CC is built once per gate; durability for the
inaugural CC is enforced by reading `snap.game.continentalCongress?.delegates.length === 0`
at phase 2.9.6 entry. Second-CC rebuilds are future work.

## State & type changes

### `src/types.ts`

**1. `CCDelegate` — add optional `tier`** (line 563-568):

```ts
export interface CCDelegate {
  stateId: string;
  politicianId: string;
  factionId: string;
  servedLastTerm?: boolean;
  tier?: 'T1' | 'T2' | 'T3' | 'Wild' | 'Player';
}
```

Optional, no save migration. Existing `appointDelegates`-built delegates
have no `tier`; the read-only `ContinentalCongressPage` doesn't depend on
it. Old saves continue to load.

**2. `GameState` — add transient cursor** (insert ~line 830, near
`relocationAttempts?`):

```ts
ccBuilderCursor?: { colonyIdx: number; slotIdx: number };
```

Optional. Cleared at end of phase 2.9.6 (set to `undefined`). Lives only
across save/resume of a mid-phase build. Cursor indices reference the
**alphabetical colony order** produced by `colonyOrder1774(snap)` —
deterministic from `snap.states`. If the colony list ever changes mid-phase
(it cannot in this PR; expansion-states are out of scope), the cursor
becomes stale; the runner's safe-recovery is to clamp/skip past
`colonyIdx >= colonyOrder.length`.

**Save/migration impact:** Both fields are optional. Existing IndexedDB
saves load unchanged. No `repair()` logic needed in `GameContext`.

## Engine changes (pure logic)

### `src/engine/firstContinentalCongress.ts` — **NEW MODULE**

A dedicated module keeps the builder's pure helpers out of the already-loud
`continentalCongress.ts` (which is owned by the durable CC: appointment
cycles, president election, legislation). The new helpers are
First-CC-only and would clash semantically.

All functions are **pure** except where annotated otherwise.

```ts
// PURE. Reads gate predicates: scenarioId, year, eraEventsCompleted,
// and the resolved intolerable_acts node's chosenResponseId.
export function cc1774GateMet(snap: FullGameSnapshot): boolean

// PURE. Returns the 13 colonies (or 12 if Georgia ever flips to excluded
// in future work) sorted by `abbr` ascending — deterministic.
export function colonyOrder1774(snap: FullGameSnapshot): State[]

// PURE. Returns the selecting faction id for a colony per AC #7-9:
// most living politicians in colony, with aggregate state PV as
// tiebreaker. `tiebreakerNote` is set when a tiebreaker fired (for UI).
export function selectingFactionFor(
  snap: FullGameSnapshot,
  state: State,
): { factionId: string; tiebreakerNote?: string }

// PURE. Pool per AC #7-8: alive, not retired, factionId set, state matches,
// skills.legislative >= 1. Falls back to all alive state politicians (no
// legislative floor) when fewer than ccDelegateSlots eligible. De-duplicates
// against `alreadySeated` (other slots already filled in this colony AND
// already-delegate ids from `snap.game.continentalCongress.delegates`).
export function eligiblePoolFor(
  snap: FullGameSnapshot,
  state: State,
  alreadySeated: Set<string>,
): Politician[]

// PURE-ish (uses seeded `chance()` and `pick()` from rng.ts). Returns the
// AI's pick per AC #14-17: walks T1 -> T2 -> T3, applies 12% wild-card
// roll, applies AI deterministic decline for careerTrackYears >= 4
// (AC #16). Returns the chosen politician id + the tier badge to stamp.
export function aiPickDelegate(
  snap: FullGameSnapshot,
  state: State,
  pool: Politician[],
  selectingFactionId: string,
  alreadySeated: Set<string>,
): { politicianId: string; tier: 'T1' | 'T2' | 'T3' | 'Wild' } | null

// MUTATING. Appends to cc.delegates, clears careerTrack/careerTrackYears
// on the politician (AC #12), logs per AC #24, advances the cursor.
// Player-driven path passes tier 'Player'.
export function commitDelegate(
  snap: FullGameSnapshot,
  stateId: string,
  politicianId: string,
  tier: 'T1' | 'T2' | 'T3' | 'Wild' | 'Player',
  selectingFactionId: string,
): void

// PURE. AC #16 predicate. Used by aiPickDelegate to skip over heavily
// invested AI politicians.
export function applyAIDeclineRule(p: Politician): boolean

// PURE. AC #19. Static per-colony selecting-body label (see "label map"
// section below).
export function selectingBodyLabel(stateId: string): string
```

### `src/engine/phaseRunners.ts`

**1. `runPhase_2_9_6_Congressional` — signature change** (line 3041):

```ts
export function runPhase_2_9_6_Congressional(
  snap: FullGameSnapshot,
): {
  needsPlayer?: boolean;
  payload?: {
    stateId: string;
    pool: Politician[];
    selectingFactionId: string;
    declineRequired?: boolean;
  };
} | void
```

Behavior:
- Early `if (snap.game.scenarioId === '1772' && cc1774GateMet(snap))` branch.
  Inside this branch:
  1. If `snap.game.continentalCongress?.delegates.length > 0` AND the cursor
     is unset, the CC was already built (durability gate, AC #27) — return
     `void` so the phase walker advances cleanly.
  2. Ensure `snap.game.continentalCongress` exists (call `ensureCC`); init
     `ccBuilderCursor` to `{ colonyIdx: 0, slotIdx: 0 }` if undefined.
  3. Inline loop, mirroring `runPhase_2_1_1_Draft`'s CPU-walk: read
     `colonyOrder1774`; while the cursor is in range:
     - Resolve current colony state, `selectingFactionFor`,
       `alreadySeated` set, and `eligiblePoolFor`.
     - Handle the "0 eligible after fallback" edge case from spec —
       advance to the next colony with the 0-delegates flavor log.
     - If `selectingFactionId === playerFactionId` AND
       `cursor.slotIdx < ccDelegateSlots`: **return** with the
       `needsPlayer` payload. The UI takes over; calls back via
       `pickCCDelegate` action.
     - Otherwise: call `aiPickDelegate`; commit via `commitDelegate`
       (which advances `cursor.slotIdx`). When `slotIdx === ccDelegateSlots`,
       roll the cursor to the next colony.
  4. After the loop completes: write the capstone log per AC #26
     (`"First Continental Congress seated: {N} delegates from {K}
     colonies."`), set `assemblyOrdinal = 1`, clear `ccBuilderCursor`.
- For 1856 (or any other scenario), fall through to the existing
  House/Senate election logic — **no change**.

**2. New player-action helpers** (placed near the
draft `playerDraftPick` pattern, ~line 260):

```ts
// MUTATING. Player picks a delegate for the current cursor's colony.
// Validates colony/slot match, validates the player faction is the
// selecting faction for this colony, validates the politician is in
// the live pool. Tags the delegate `tier: 'Player'`.
export function playerCCDelegatePick(
  snap: FullGameSnapshot,
  stateId: string,
  politicianId: string,
): void

// MUTATING. Decline: removes the politician id from the live pool for
// this colony (a per-colony exclusion-set lives on the cursor or is
// re-derived by the runner on next call). The slot remains open.
export function playerCCDelegateDecline(
  snap: FullGameSnapshot,
  stateId: string,
  politicianId: string,
): void
```

The exclusion-set is a minimal field on the cursor:
```ts
ccBuilderCursor?: {
  colonyIdx: number;
  slotIdx: number;
  excludedThisColony?: string[]; // declined politician ids for this colony only
};
```
This stays on the cursor (cleared per-colony in the runner when the cursor
advances). No new top-level field is needed.

**3. `applyPostEffects` `assembleCC` case — amended guard** (line 2428):

```ts
case 'assembleCC': {
  const ccExisting = snap.game.continentalCongress;
  if (ccExisting && ccExisting.delegates.length > 0) break;
  // 1772 First-CC gate-swap: defer to phase 2.9.6's interactive builder.
  // The intolerable_acts -> "Convene CC" path is owned by 2.9.6.
  if (
    snap.game.scenarioId === '1772'
    && event.templateId === 'intolerable_acts'
    && event.chosenResponseId === 'ok'
  ) {
    addLog(snap, '2.4.3', 'system',
      'The First Continental Congress is called to meet at Philadelphia. Delegations will be chosen by the colonies.');
    break;
  }
  appointDelegates(snap);
  electCCPresident(snap);
  appointCCCommittees(snap);
  const cc = snap.game.continentalCongress;
  if (cc) cc.assemblyOrdinal = 1;
  addLog(snap, '2.4.3', 'appointment',
    `First Continental Congress convenes in Philadelphia. Delegates from ${snap.states.length} colonies.`);
  break;
}
```

This is the **only** spot where the auto-build path is suppressed. The
2.10 scheduled-reassembly path that uses `appointDelegates` (line 3104,
post-Articles) is untouched — that's a different cadence and out of scope.

### `src/phases.ts`

**Line 108 replacement.** The blanket independence-era 2.9.6 skip must
become gate-aware:

```ts
// Old:
//   if (phaseId === '2.9.6') return false;
// New:
if (phaseId === '2.9.6') {
  // 1772: 2.9.6 = First Continental Congress builder. Run only when the
  // Intolerable Acts have resolved with "Convene CC" chosen and year >= 1774.
  if (game.scenarioId === '1772') {
    if (game.year < 1774) return false;
    if (!game.eraEventsCompleted.includes('intolerable_acts')) return false;
    const intolerable = game.pendingEraEvents.find(
      (e) => e.templateId === 'intolerable_acts' && e.resolved,
    );
    if (!intolerable || intolerable.chosenResponseId !== 'ok') return false;
    return true;
  }
  return false; // other independence-era scenarios: silent skip preserved
}
```

The function signature is `shouldRunPhase(phaseId, year, game?)` — `game`
is optional. The pre-existing year guard `!isElectionYear(year)` higher up
(line 76) still applies; 1774 is even, so the gate passes naturally.

**Note:** The 1772 graph keeps resolved era events on `pendingEraEvents`
(verified at `GameContext.tsx:397-401`), so the `intolerable.chosenResponseId`
lookup is reliable across save/load.

## UI changes

### `src/pages/ContinentalCongressBuilderPage.tsx` — **NEW**

The per-colony walker page. Renders different surfaces based on the
phase/cursor state:

- **Live build, AI colony**: colony header (name + selecting-body label
  from `selectingBodyLabel(stateId)`), slot counter ("Selecting 2 of 4…"),
  current AI pick panel (delegate chip with tier badge T1/T2/T3/Wild and
  one-line rationale), seated delegates list for this colony, "Continue"
  button (calls `advance()` to drive the next AI pick / colony / phase
  exit). AI picks are animated by re-rendering on each `advance()`
  callback — no setInterval, no React animation library.
- **Live build, player colony**: colony header + body label + slot
  counter + the eligible pool table (sortable, with the era-correct chip
  set from `labels.ts`). A "Pick" button on each row calls
  `pickCCDelegate(stateId, politicianId)`. If the politician's
  `careerTrack !== null` AND `careerTrackYears >= 1`, the pick opens the
  decline modal first.
- **Phase complete, before user advances**: end-of-phase roster summary
  per AC #23 — all delegates grouped by colony, faction tally bar,
  Patriot/Moderate/Loyalist flavor band derived from ideology, F3
  abstraction footnote, "Continue" button to advance the phase.

**Era-correct labels:** all faction chips use `formatPartyId(partyId,
scenarioId, year)` from `src/engine/labels.ts` (returns "Patriot"/"Federalist"
for pre-1789 1772). No `PARTIES_1772` color/name strings on chips.
The page can still display the **AMPU faction name** (`faction.name`,
e.g. "Sons of Liberty") since those are not party labels — F5 explicitly
allows that.

**Pool sort:** Tier-first ordering for AI colonies (display-only); for
player colonies, default-sort by `pvCache desc` and re-sort by the column
headers (mirror Draft.tsx's `SortKey` pattern).

### `src/components/CCDelegateDeclineModal.tsx` — **NEW**

Inline in the page would crowd it. A dedicated modal mirrors
`EraEventModal` / `ConventionModal` in spirit (visible-while-mounted,
buttons drive `pickCCDelegate` Accept or `declineCCDelegate` Decline).

Props: `politician`, `colonyName`, `onAccept`, `onDecline`. Body text:
"{Name} is invested in the {careerTrack} track ({careerTrackYears} years).
Accepting the appointment will end the career track."

### `src/pages/registry.ts`

Add `'continentalCongressBuilder'` to the `PageId` union and the `Pages`
map:

```ts
import { ContinentalCongressBuilderPage } from './ContinentalCongressBuilderPage';
// ...
export type PageId =
  | ...
  | 'continentalCongressBuilder';
export const Pages: Record<PageId, () => JSX.Element> = {
  ...,
  continentalCongressBuilder: ContinentalCongressBuilderPage,
};
```

### `src/state/GameContext.tsx`

Add two new context actions, parallel to `draftPick`:

```ts
pickCCDelegate: (stateId: string, politicianId: string) => Promise<void>;
declineCCDelegate: (stateId: string, politicianId: string) => Promise<void>;
```

Both: deep-copy snapshot, call the engine helper, then call
`runCurrentPhase(draft)` again (which will either return another
`needsPlayer` block for the next slot/colony OR walk the AI through the
rest of the phase). If the result has no further player input AND the
phase is still 2.9.6 with a cleared cursor, leave the snapshot on the
roster summary surface until the user clicks Continue (mirrors
Draft.tsx's end-of-draft pattern). Persist via the existing autosave.

The `advance()` action gets a small augmentation: when the current phase
is 2.9.6 in 1772 with an active cursor, after running `runCurrentPhase`,
if `result.needsPlayerInput` is not set but the cursor still has work,
loop one more `runCurrentPhase` call to drain remaining AI colonies (so
the user clicking "Continue" through AI animations is paced step-by-step,
not jumps to the roster).

Add a new `needsPlayerInput` variant `'ccBuilder'` to the
`runCurrentPhase` return union in `engine.ts`:

```ts
needsPlayerInput?: 'draft' | 'eraEvent' | 'cabinet' | 'convention' | 'ccBuilder';
```

The case `'2.9.6'` in `engine.ts:77` becomes:

```ts
case '2.9.6': {
  const r = P.runPhase_2_9_6_Congressional(snap);
  if (r && r.needsPlayer) return { needsPlayerInput: 'ccBuilder', payload: r.payload };
  return {};
}
```

### App routing — `src/App.tsx`

Add a new `useEffect` matching the existing Draft auto-navigate pattern
(lines 25-40). The sentinel:

```ts
const ccBuilderActive = !!g
  && g.phaseId === '2.9.6'
  && g.scenarioId === '1772'
  && g.ccBuilderCursor != null;
```

Plus the post-phase roster summary case: when `phaseId === '2.9.6'` AND
`scenarioId === '1772'` AND `eraEventsCompleted.includes('intolerable_acts')`
AND `continentalCongress.delegates.length > 0` AND cursor is null,
**stay on** the builder page so the user sees the roster summary before
advancing. Key on `${g.year}:2.9.6`.

The auto-navigate sets `setPage('continentalCongressBuilder')` once per
phase entry.

## Selecting-body label map (AC #19)

Static `Record<string, string>` in `firstContinentalCongress.ts`. Strings
derived from the historian's per-colony research (lines 108-140 of
historical context). Each colony gets a single string; the actual
historical date and process are surfaced as a single one-line UI flavor
beneath the colony header.

```ts
const SELECTING_BODY_LABELS: Record<string, string> = {
  nh: 'The New Hampshire town deputies select...',
  ma: 'The Massachusetts House of Representatives, meeting at Salem, selects...',
  ri: 'The Rhode Island General Assembly selects...',
  ct: 'The Connecticut House of Representatives selects...',
  ny: 'The New York city and county committees select...',
  nj: 'The New Jersey provincial committee selects...',
  pa: 'The Pennsylvania Assembly selects...',
  de: 'The Delaware county assemblies select...',
  md: 'The Maryland county-committee convention at Annapolis selects...',
  va: 'The First Virginia Convention selects...',
  nc: 'The First North Carolina Provincial Congress at New Bern selects...',
  sc: 'The South Carolina general meeting at Charleston selects...',
  ga: 'The Georgia provincial meeting selects... (game-mechanic abstraction)',
};
```

The Georgia label carries the parenthetical to make F2 abstraction visible
at the per-colony level too (in addition to the roster footnote).

## Files to touch (exact, ordered)

1. **`src/types.ts`** — Add `tier?` to `CCDelegate` (line 568); add
   `ccBuilderCursor?` to `GameState` (~line 830, near other transient
   `*Attempts?` fields).
2. **`src/engine/firstContinentalCongress.ts`** — **NEW**. All pure helpers
   listed above plus the selecting-body label map.
3. **`src/engine/phaseRunners.ts`** —
   (a) Amend `applyPostEffects` `assembleCC` case (line 2428) with the
   1772-gate guard.
   (b) Rewrite `runPhase_2_9_6_Congressional` (line 3041) to gate-swap on
   1772 + intolerable_acts ok.
   (c) Add `playerCCDelegatePick` / `playerCCDelegateDecline` exports near
   `playerDraftPick` (line 260).
4. **`src/engine/engine.ts`** — Update the `2.9.6` case to handle the new
   return shape; extend the `needsPlayerInput` union to include `'ccBuilder'`.
5. **`src/phases.ts`** — Replace line 108 with the gate-aware branch.
6. **`src/state/GameContext.tsx`** — Add `pickCCDelegate` /
   `declineCCDelegate` callbacks; extend the `advance` handler to surface
   `ccBuilder` like `draft`.
7. **`src/App.tsx`** — Add `ccBuilderActive` auto-navigate effect after the
   Draft effect (line 40).
8. **`src/pages/registry.ts`** — Register `'continentalCongressBuilder'`
   in `PageId` union and `Pages` map.
9. **`src/pages/ContinentalCongressBuilderPage.tsx`** — **NEW**. Per-colony
   walker, pool list, decline modal trigger, roster summary at end.
10. **`src/components/CCDelegateDeclineModal.tsx`** — **NEW**. Modal for
    careerTrackYears >= 1 player picks.

Out of touch: `src/engine/continentalCongress.ts` (untouched —
`appointDelegates` / `electCCPresident` / `appointCCCommittees` stay as
they are for the durable CC and 2.2.1 path); `src/pages/ContinentalCongressPage.tsx`
(untouched per AC #20); `src/data/eraEvents1772.ts` (the
`intolerable_acts` node already has the right postEffect — only the
dispatcher's behavior changes).

## Test / verification plan

**Build/typecheck**: `npm run build` (= `tsc -b && vite build`). The
optional `tier?` on `CCDelegate` is forward-compat; the new
`ccBuilderCursor?` is forward-compat; no existing call sites break.

**Playtest (1772 scenario):**

Start the 1772 scenario as a Blue-faction player. Advance turns until
you reach the Intolerable Acts era event (after Boston Tea Party →
Coercive Acts spine). On the modal, choose "Convene the First
Continental Congress". Advance phases.

- **AC #1**: phase 2.9.6 fires only in 1774+ with `intolerable_acts`
  completed + chosen `ok`. Force a 1772 save where the event was
  resolved but year is still 1772/73 → verify 2.9.6 is skipped. Advance
  to 1774 → verify 2.9.6 fires.
- **AC #2**: in a 1772 game where `intolerable_acts` was resolved with
  any OTHER response, verify 2.9.6 is silently skipped.
- **AC #3**: 1856 path verification — start an 1856 game and run
  through to a 2.9.6 congressional election year. Confirm
  House/Senate elections still run.
- **AC #4 + Risk #3**: the cascade — after picking "Convene CC" on the
  Intolerable Acts modal, watch the event-log feed. The
  `appointDelegates` capstone log
  ("First Continental Congress convenes in Philadelphia. Delegates
  from {N} colonies.") MUST NOT fire from 2.4.3; the deferred log
  ("…will be chosen by the colonies") fires instead. Then phase 2.9.6
  capstone log fires after the build.
- **AC #5**: roster summary shows all 13 colonies including Georgia,
  with the Georgia footnote.
- **AC #6**: delegate counts: PA/MA/VA/MD=4, CT/NY/NJ/NC/SC=3,
  NH/RI/DE/GA=2. Verify by counting roster summary slots.
- **AC #7-9**: in a colony where the player's faction has the most
  politicians, verify the player gets the prompt (decline path tested).
  Force a 2-faction tie in a colony (e.g. via `customDraftClasses` to
  seed exactly 2 politicians from BLUE-LW and 2 from RED-Center in the
  same colony) and verify the higher-aggregate-PV faction takes the slot.
- **AC #10**: with the player faction selecting in a colony where their
  faction members are weaker than another faction's eligible
  politicians, verify the cross-faction pick option is available in the
  pool.
- **AC #11-12**: pick a player-controlled colony's first slot. Choose a
  politician with `careerTrack !== null` and `careerTrackYears >= 1` →
  verify the modal appears with track name + years. Click Decline →
  the slot stays open, the politician is removed from the live pool;
  click Pick again on a different politician → the slot fills, the
  declined politician is gone for this colony.
- **AC #13**: confirm you cannot skip to "next colony" while slots
  remain open in the current colony (no skip button rendered).
- **AC #14**: with an AI selecting faction that has its own members in
  the colony pool, verify T1 picks fire. Manually validate ideology
  proximity by inspecting which faction-member was picked.
- **AC #15**: run the phase several times (save/reload between runs is
  fine for unseeded RNG). Verify Wild-card picks (`tier: 'Wild'`) appear
  at roughly 12% per AI slot.
- **AC #16**: seed a colony so all of its T1/T2/T3 pool politicians have
  `careerTrackYears >= 4` except one — verify the AI picks the
  un-invested one and logs a "declines" event for the skipped ones.
- **AC #17**: each AI pick chip shows a tier badge (T1/T2/T3/Wild).
- **AC #18**: inspect the seated CC after the phase: verify
  `cc.delegates[].tier` is populated.
- **AC #19**: per-colony selecting-body label fires (VA: "The First
  Virginia Convention selects…", etc.).
- **AC #20**: navigate to the existing read-only Continental Congress
  page after the build — should display the same 39 delegates with the
  CC President as "vacant" (will be elected at 2.2.1 in 1774).
- **AC #21**: confirm NO "(Anti-)Federalist" / D / R labels appear in
  the UI; confirm faction badges use era-correct
  `formatPartyId(partyId, '1772', 1774)` strings ("Patriot" / "Federalist").
- **AC #22**: AI picks animate one step per "Continue" click.
- **AC #23**: roster summary footnote about Georgia is visible.
- **AC #24**: each delegate seated emits the EventEntry per AC #24
  format. Spot-check the event log.
- **AC #25-26**: decline log + single capstone log fire as specified.
- **AC #27**: advance phases past 2.9.6 to 2.10 and back into a later
  election year; confirm 2.9.6 is silently skipped (cc.delegates already
  populated).

**Edge cases from the spec to verify manually:**
- Colony with 0 eligible politicians (even after fallback) → "No suitable
  delegates available…" log and roster summary surfacing.
- Player faction controls zero colonies → all 12 AI, phase completes
  without `needsPlayer` ever returning true; roster summary still fires.
- Save mid-phase → reload → cursor resumes at the saved colony/slot.
- Politician relocated to a colony in 2.1.4 (same turn) → eligible.

## Risks

1. **`assembleCC` no-op coordination across the 2.4.3 → 2.9.6 cascade.**
   The post-effect dispatcher fires immediately on era event resolve,
   which currently happens in `GameContext.chooseEraResponse` and then
   advances the phase. The phase walker will hit 2.9.6 next in the same
   turn (1774 is even; `shouldRunPhase` will return true). The amended
   `assembleCC` case must short-circuit cleanly without leaving partial
   state. Mitigation: the guard reads only `event.chosenResponseId` and
   `event.templateId`, both of which are set by `resolveEraEvent`
   BEFORE `applyPostEffects` runs (verified at phaseRunners.ts:2393-2396).
   Tested by AC #4. If we regress here, the CC is silently double-built
   and the player sees ghost delegates.

2. **Page-routing mechanism — auto-navigate vs. modal.** The choice here
   is a **page swap** (mirroring Draft.tsx), not a modal. Modals work
   for single-decision flows (era events, conventions); the First-CC
   builder is a multi-step walker with rich per-colony state. Risk: if
   the user navigates away during the build, the auto-navigate effect
   yanks them back. Mitigation: the `lastCCBuilderEntryKey` ref is keyed
   on `${year}:2.9.6`, so navigating away after the first auto-pull
   stays away within the same phase (mirrors Draft's pattern at
   `App.tsx:32-39`). If a player wants to inspect another page mid-build,
   they can; the builder resumes when they navigate back via the sidebar.

3. **Save-mid-phase resumption via the cursor.** The cursor is a transient
   field on `GameState`. The standard `GameContext` autosave runs each
   phase; the runner mutates the cursor inline as it walks. On reload,
   the runner reads `colonyOrder1774(snap)` (deterministic from
   `snap.states`) and the cursor's indices to resume. **Failure mode**:
   if a colony is added/removed mid-build (impossible in this PR — no
   expansion-states are active in 1772 pre-1789 — but a future change
   could regress), the cursor becomes stale. Mitigation: defensive
   `if (colonyIdx >= colonyOrder.length) clear cursor and exit phase`.

## Out of scope — explicit guardrails

- **CC President selection** (`electCCPresident` at
  `continentalCongress.ts:113`) — runs at phase 2.2.1 in 1774
  on the NEXT turn after the builder. Verified the 2.2.1 leadership phase
  reads `cc.delegates` correctly post-build.
- **Second Continental Congress (1775+)** — no path to re-fire 2.9.6 in
  this PR. The 2.10 reassembly path uses the durable-CC
  `appointDelegates` (phaseRunners.ts:3104).
- **1856 path** — entirely unchanged.
- **Per-colony slot rebalance** — keep existing `ccDelegateSlots` per AC #6.

---

**Checkpoint summary (for phone approval):**
- **Approach:** gate-swap 2.9.6 for 1772 when Intolerable Acts → "Convene"
  resolved AND year >= 1774; new per-colony walker page; cursor on
  `GameState` tracks progress; `assembleCC` post-effect defers in that
  exact gate case.
- **State changes:** `CCDelegate.tier?` (optional, no migration) +
  `GameState.ccBuilderCursor?` (transient, optional, no migration).
- **Files touched:** 10 — 4 new (`firstContinentalCongress.ts`, page,
  modal, brief), 6 amended (`types.ts`, `phaseRunners.ts`, `engine.ts`,
  `phases.ts`, `GameContext.tsx`, `App.tsx`, `registry.ts`).
- **Top risk:** the 2.4.3 → 2.9.6 cascade. The `assembleCC` guard MUST
  fire on `intolerable_acts + ok` only, and 2.9.6 MUST own the build
  uniquely. AC #4 verifies.
- **Out of scope:** CC President (2.2.1), Second CC (1775+), 1856 path,
  slot rebalance.
