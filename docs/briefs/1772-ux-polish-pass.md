# Brief: 1772 UX Polish Pass — Three Bundled Spikes

## Approach

A presentation-layer pass over existing engine state. Spike 1 (What-Just-Happened)
surfaces today's invisible engine actions by adding two new pages
(`deathsRetirements`, `endOfHalfTerm`), 10 new auto-nav `useEffect`s in
`App.tsx`, an acknowledgement-mode for `EraEventModal`, and year-stamp polish
on `EraTimeline`. Spike 2 retitles the Draft header when `g.year === g.startYear`
(scenario-agnostic, ~30 lines). Spike 3 replaces `GameOverScreen` with a
five-panel retrospective keyed off `game.gameEnded.templateId` using the
historian's verbatim contrast lines.

The single substantive engine touch is the **per-turn delta tracker**: a new
`game.halfTermSummaries: HalfTermSummary[]` array populated incrementally by
phase runners (PM Option B). Choice rationale: a `prevSnapshot` field
(Option A) would double the autosave payload (politicians + factions arrays)
on every turn, while a structured `HalfTermSummary` carries only the deltas
the page actually reads (~1KB/turn). The summary array also naturally feeds
the Campaign-Over retrospective's "defining decisions" panel without
re-scanning the full event log.

One alternative rejected: a single centralized phase→page dispatcher in
`App.tsx` (Open Q #2 Option B). Per F3 we keep 10 parallel `useEffect`s
matching the existing six's pattern; centralization is deferred until the
effect count exceeds ~25.

The acknowledgement-modal queue is the only React-state-only piece (lives in
`GameContext` modal state, not the snapshot). On save/reload the queue is
dropped per the spec's "Save/reload mid-acknowledgement-queue" edge case —
the events are already resolved in the engine and persist in the event log.

## State & type changes

### `src/types.ts`

**1. New `HalfTermSummary` interface** (insert after `FactionLeadershipEntry`,
~line 963):

```ts
// Per-half-term delta record. Opened at the start of a new turn (the first
// runCurrentPhase call where the current half-term has no summary yet),
// populated by phase runners as the turn unfolds, and closed at 2.10. Read by
// the End-of-Half-Term page (current-turn entry) and Campaign-Over recap
// (historical entries).
export interface HalfTermSummary {
  startYear: number; // game.year at the moment the summary was opened
  endYear: number;   // game.year at 2.10 close (initialized to startYear; bumped at close)
  metersStart: NationalMeters; // snapshot of game.meters when opened
  metersEnd: NationalMeters;   // snapshot of game.meters at 2.10 close (initialized = metersStart)
  factionSizesStart: Record<string, number>; // factionId -> living-member count when opened
  factionSizesEnd: Record<string, number>;   // factionId -> living-member count at 2.10 close
  pvSnapshotStart: Record<string, number>;   // politicianId -> pvCache when opened (living only)
  // pvSnapshotEnd derived at render time from snap.politicians for the
  // current-turn entry; for historical entries the EOH page is the only
  // consumer and it reads pvSnapshotStart of the NEXT summary OR
  // snap.politicians (campaign-end).
  deaths: { politicianId: string; year: number; cause: DeathCause }[];
  retirements: { politicianId: string; year: number; cause: RetireCause }[];
  billsPassed: string[];  // legislation.id
  billsFailed: string[];  // legislation.id
  eraEventsResolved: { eraEventId: string; templateId?: string; aiResolved: boolean; chosenResponseId: string }[];
  // Open-ended; phase runners append their key transitions:
  // 'governorsExist', 'articlesOfConfederation', 'constitutionRatified',
  // 'eraFlipped', 'warStarted', 'warEnded'. Used by the EOH "Key events
  // fired" bullet list as a cheap pre-sorted feed.
  milestones: { phase: PhaseId; text: string }[];
}

export type DeathCause =
  | 'age'        // 2.4.1 mortality roll
  | 'battle'     // 2.7.2 Rev War / generic war battle casualties
  | 'event'      // 2.4.2 anytime-event death effect
  | 'assassination'; // reserved for future event templates; not currently emitted

export type RetireCause =
  | 'age'        // 2.4.1 retirement roll
  | 'event'      // 2.4.2 forceRetire effect
  | 'court';     // 2.8.2 justice retirement
```

**2. `GameState` — add `halfTermSummaries`** (insert near the other
optional history arrays around line 822):

```ts
halfTermSummaries?: HalfTermSummary[];
```

Optional. Old saves load with `undefined`; `repair()` initializes to `[]`
once and stamps no historical entries (acceptable — we only need them going
forward, and the Campaign-Over recap handles missing data by showing fewer
panel rows). See Save/migration impact below.

**3. `EventEntry.meta` — document conventional keys**.
No type change (it's `Record<string, unknown>`); the new keys we set are
`deathCause: DeathCause`, `retireCause: RetireCause`. Existing keys
(`templateId`, `aiResolved`, `eraEvent`, `politicianId`) stay.

**Save/migration impact:** Both fields are optional. `repair()` in
`GameContext.tsx` initializes `s.game.halfTermSummaries ??= []` (one-liner,
gated by `null` check like the existing `careerGains` migration at line
137-148). Existing saves load unchanged; the EOH page handles an empty
array by showing the first half-term meter values without deltas and a
"First half-term complete" framing (per spec edge case).

## Engine changes (pure logic)

All deterministic over the snapshot. No `Math.random` calls; reuse `chance()`
from `rng.ts` where any randomness is touched (none here).

### `src/engine/halfTermSummary.ts` — **NEW MODULE**

A small dedicated module keeps the per-turn delta plumbing isolated from the
already-loud `phaseRunners.ts`.

```ts
// Returns the active (open) summary, or null if none. A summary is "open"
// when its endYear === startYear AND startYear === snap.game.year.
export function activeSummary(snap: FullGameSnapshot): HalfTermSummary | null

// Idempotent. Called at the top of runCurrentPhase BEFORE the phase switch.
// If there is no active summary for the current game.year, opens a new one
// and pushes onto snap.game.halfTermSummaries. Captures metersStart,
// factionSizesStart, pvSnapshotStart.
export function openSummaryIfNeeded(snap: FullGameSnapshot): void

// Called by runPhase_2_10_End. Stamps endYear, metersEnd, factionSizesEnd.
export function closeSummary(snap: FullGameSnapshot): void

// Per-phase recorders, no-ops if no active summary. Pushed by phase runners.
export function recordDeath(snap: FullGameSnapshot, politicianId: string, cause: DeathCause): void
export function recordRetirement(snap: FullGameSnapshot, politicianId: string, cause: RetireCause): void
export function recordBillPassed(snap: FullGameSnapshot, billId: string): void
export function recordBillFailed(snap: FullGameSnapshot, billId: string): void
export function recordEraEvent(snap: FullGameSnapshot, eraEventId: string, templateId: string | undefined, aiResolved: boolean, chosenResponseId: string): void
export function recordMilestone(snap: FullGameSnapshot, phase: PhaseId, text: string): void
```

### `src/engine/engine.ts`

**1. `runCurrentPhase` — call `openSummaryIfNeeded(snap)`** at the top of
the function (line 16, after the convention guard). Idempotent; safe to call
on every phase run.

**2. Extend the return type to thread era-event acknowledgements:**

```ts
export function runCurrentPhase(snap: FullGameSnapshot): {
  needsPlayerInput?: 'draft' | 'eraEvent' | 'cabinet' | 'convention' | 'ccBuilder' | 'ccAIConfirm';
  payload?: unknown;
  acknowledgements?: EraEvent[]; // NEW: auto-resolved era events to surface
}
```

Only the `'2.4.3'` case populates `acknowledgements`. The case becomes:

```ts
case '2.4.3': {
  const r = P.runPhase_2_4_3_Era(snap);
  // r is { event: EraEvent | null; acknowledgements: EraEvent[] }
  if (r.event) return { needsPlayerInput: 'eraEvent', payload: r.event, acknowledgements: r.acknowledgements };
  return { acknowledgements: r.acknowledgements };
}
```

### `src/engine/phaseRunners.ts`

**1. `runPhase_2_4_3_Era` — return acknowledgements** (line 2360).

Today returns `EraEvent | null`. Change signature to:

```ts
export function runPhase_2_4_3_Era(snap: FullGameSnapshot): {
  event: EraEvent | null;
  acknowledgements: EraEvent[]; // auto-resolved events to acknowledge
}
```

In the 1772 `while (event && isAutoResolved(snap, event))` loop, **before**
calling `resolveEraEvent`, snapshot the `event` reference; **after** the
resolve, **if** `!event.triggersGameEnd` push a deep-copy of the resolved
event (with `resolved: true` and `chosenResponseId` populated by
`resolveEraEvent`) into the local `acknowledgements: EraEvent[]` array.
Per F6, terminal-ending nodes are excluded so the Campaign-Over screen owns
the surface. Return `{ event: eventOrNull, acknowledgements }`. For the 1856
branch, return `{ event: next ?? null, acknowledgements: [] }`.

Inside `resolveEraEvent` (line 2385), after the existing `addLog` at line
2397, call `recordEraEvent(snap, event.id, event.templateId, aiResolved,
responseId)` to feed the half-term summary.

**2. `runPhase_2_4_1_Deaths` — log cause meta + record summary** (line 2000).

For the age-death `addLog` at line 2026, add a meta object:
`{ deathCause: 'age', politicianId: p.id }`. Same for the retirement `addLog`
at line 2034: `{ retireCause: 'age', politicianId: p.id }`. Immediately
before each `markPolitician*` call, call
`recordDeath(snap, p.id, 'age')` / `recordRetirement(snap, p.id, 'age')`.

**3. `runPhase_2_4_2_Anytime` — log cause meta + record** (line 2298, 2303).

The anytime `death` effect at line 2298: add `{ deathCause: 'event', politicianId: p.id }`
to the existing `addLog` call at line 2334 if `tpl.effects` contains a
`death` kind (use the `didMutate` path's existing event-emission point;
detect the death case by checking `tpl.effects.find(e => e.kind === 'death')`).
Same for `forceRetire` (line 2303). Add `recordDeath` / `recordRetirement`
calls inline (cause `'event'`).

**4. `runPhase_2_7_2_Military` / `revolutionaryWar.ts` — battle deaths** (line 89).

In `revolutionaryWar.ts:89`, the death `addLog` call gains
`{ deathCause: 'battle', politicianId: victim.id, battle: battle.name }` and
a `recordDeath(snap, victim.id, 'battle')` call. The 1856 war path at
`phaseRunners.ts:2867` does not currently kill politicians (no `deathYear`
set); leave it. If a future generic war does, the same pattern applies.

**5. `runPhase_2_5_1_Lingering` — already mutates meters live** (line 2607).
**No change** — `metersEnd` is captured at close time in `runPhase_2_10_End`
via `closeSummary`, so the per-meter delta arrives naturally. The existing
`apply()` helper's `addLog('meter', ...)` calls stay as-is.

**6. `runPhase_2_6_3_Floor` — record bills** (line 2769).

In each branch (1772 CC at line 2780 / 2787 and 1856 House+Senate further
down), after the existing pass/fail `addLog` call, call
`recordBillPassed(snap, bill.id)` / `recordBillFailed(snap, bill.id)`.
The 1856 path needs the same calls in both branches (line 2780 and onward;
search for `"PASSED Continental"` and the 1856 equivalent `bill.status = 'passed'`).

**7. `runPhase_2_8_2_CourtMgmt` — retirement cause** (line 2911).

The existing court retirement `addLog` gains `{ retireCause: 'court',
politicianId: j.id }`; call `recordRetirement(snap, j.id, 'court')`.

**8. `runPhase_2_10_End` — close summary** (line 3355).

After the existing `addLog('system', ...)` at line 3377, call
`closeSummary(snap)`. The function still increments ages and refreshes PV
as today (line 3357-3360); closing the summary AFTER PV refresh ensures
`metersEnd` is current.

**9. Era milestone milestones** — when `runPhase_2_4_3_Era`'s
`resolveEraEvent` flips a known milestone (governors unlocked, articles
ratified, constitution ratified, era flipped, war started/ended), call
`recordMilestone(snap, '2.4.3', '...')`. Hook the existing handlers (the
`if (event.unlocks?.includes('governors'))` block at line 2410, the
`triggersGameEnd` block at line 2419, and `handleScripted1772Consequences`).
For `warStarted` use the `effect.startWar` branch around line 2599.

### `src/phases.ts`

**No change.** Per Open Q #6, the existing `shouldRunPhase` skip predicate
at line 134 (`if (phaseId === '2.7.2' && !isFirstTurn && !game.revolutionaryWar?.active) return false`)
is trusted. The auto-nav effect for 2.7.2 only fires when the phase
actually runs, so an inactive war never lands on `revWar`.

## UI changes

### `src/App.tsx` — 10 new auto-nav `useEffect`s

All match the existing pattern at lines 26-114: one `useRef<string|null>`
sentinel per effect, keyed on `${year}:${phaseId}`. Per F3, ADD parallel
effects; do not centralize. Each goes between the existing kingmaker effect
(line 114) and the existing CC builder effect (line 120).

New effects in order:

```ts
const lastDeathsEntryKey = useRef<string|null>(null);          // 2.4.1 -> deathsRetirements
const lastAnytimeEntryKey = useRef<string|null>(null);          // 2.4.2 -> anytimeEvents
const lastEraEventsEntryKey = useRef<string|null>(null);        // 2.4.3 -> eraEvents
const lastMetersEntryKey = useRef<string|null>(null);           // 2.5.1 -> meters
const lastGovernorsEntryKey = useRef<string|null>(null);        // 2.5.2 -> governors
const lastLegislationEntryKey = useRef<string|null>(null);      // 2.6.1/.2/.3 -> legislation
const lastDiplomacyEntryKey = useRef<string|null>(null);        // 2.7.1 -> diplomacy
const lastRevWarEntryKey = useRef<string|null>(null);           // 2.7.2 -> revWar (war active only)
const lastCongressEntryKey = useRef<string|null>(null);         // 2.2.1/.2 -> congress
const lastFactionLeaderEntryKey = useRef<string|null>(null);    // 2.2.3 -> factionLeader
const lastElectionsEntryKey = useRef<string|null>(null);        // 2.9.5 -> elections
const lastEndOfHalfTermEntryKey = useRef<string|null>(null);    // 2.10 -> endOfHalfTerm
```

(12 refs covering 12 destinations; legislation/congress collapse three phase
ids each into a single effect using an `if` over the three ids.)

Each effect's body mirrors the existing 2.1.2 careers effect (lines 46-57)
with the appropriate page id. The 2.7.2 effect gates on
`g.revolutionaryWar?.active === true` per AC #13. Per AC #15, these new
effects **do not** override the existing draft/career/relocation/ideology/
conversion/kingmaker/CC-builder effects (those win because their predicates
are stricter than just `phaseId`).

### `src/state/GameContext.tsx`

**1. Modal-state-union extension** (line 14-17):

```ts
type Modal =
  | { type: 'none' }
  | { type: 'eraEvent'; event: EraEvent }
  | { type: 'eraEvent'; event: EraEvent; mode: 'acknowledge' }  // NEW variant
  | { type: 'convention'; convention: ConstitutionalConvention };
```

Use a discriminator field `mode?: 'pick' | 'acknowledge'` (default `'pick'`)
on the `eraEvent` variant rather than two separate variants — cleaner:

```ts
type Modal =
  | { type: 'none' }
  | { type: 'eraEvent'; event: EraEvent; mode?: 'pick' | 'acknowledge' }
  | { type: 'convention'; convention: ConstitutionalConvention };
```

**2. Acknowledgement queue** — React state only, not in the snapshot:

```ts
const [ackQueue, setAckQueue] = useState<EraEvent[]>([]);
```

**3. New context action** `acknowledgeEraEvent`:

```ts
acknowledgeEraEvent: () => void;
```

Pops the head of `ackQueue` and either re-surfaces the next event
(`setModal({ type: 'eraEvent', event: next, mode: 'acknowledge' })`) or
clears the modal (`setModal({ type: 'none' })`).

**4. `advance()` augmentation** (line 210-262). After `runCurrentPhase`
returns:
- If `result.acknowledgements?.length > 0`: filter out any that match
  `draft.game.gameEnded?.templateId` (defense in depth on top of F6's
  engine-side exclusion). Push remainder into `ackQueue` via
  `setAckQueue((q) => [...q, ...rest])`.
- After persisting the snapshot, if `ackQueue` is empty and we just enqueued
  any acknowledgements, surface the first one immediately:
  `setModal({ type: 'eraEvent', event: acks[0], mode: 'acknowledge' })` and
  `setAckQueue(acks.slice(1))`.

**5. `chooseEraResponse` augmentation** (line 353). The replay path at line
399 (`const replay = runCurrentPhase(draft)`) gets the same acknowledgements
treatment — auto-resolutions after a player pick (the cascade) also surface
as a modal queue.

### `src/components/EraEventModal.tsx`

**Add `mode` prop and acknowledge render branch** (currently 61 lines).

```ts
export function EraEventModal({ event, mode = 'pick' }: {
  event: EraEvent;
  mode?: 'pick' | 'acknowledge';
}): JSX.Element {
  const { chooseEraResponse, acknowledgeEraEvent, snapshot } = useGame();
  // ... existing setSelected etc. ...
```

When `mode === 'acknowledge'`:
- The header text bumps from "Era Event — {year}" to **"Era Event (Auto) — {year}"**
- The response list (lines 28-48) collapses to a single read-only card
  showing the event's chosen response (`event.responses.find(r => r.id === event.chosenResponseId)`),
  rendered in the same `EffectChips`+label format but non-clickable (no
  selected-state styling, no onClick).
- The footer button (lines 49-57) becomes a single **"Acknowledge"** button
  wired to `acknowledgeEraEvent()`. The "Confirm Response" button is hidden.

Per AC #19, a tiny copy variant: if `event.decider === 'cc-president'` AND
the resolving president's faction is not the player's, prefix the label
with "Your CC President {faction} chose:" — read
`snapshot.game.continentalCongress.presidentId` to look up the resolving
president's faction. (Edge case from spec; finalize copy at implementation.)

### `src/components/EraTimeline.tsx` (current: 39 lines)

**Year stamps + tooltip polish.** Replace the inner `MILESTONES_1772.map`
body (lines 23-35):

For each milestone:
- If `done`, scan `snapshot.events` for an entry where
  `category === 'event'` AND `meta?.templateId === m.templateId`. Take the
  most recent matching `EventEntry.year` as the stamp. (Year stamp source
  is `EventEntry.year` per AC #20; meta is set at `phaseRunners.ts:2397`.)
  If no entry matches (corrupted save edge case): render the completed chip
  without a year stamp, no crash.
- Render label + year stamp on two lines: `<div>{m.label}</div><div className="text-[10px] opacity-80">{yearStr}</div>`.
- For `isCurrent` chips, add a `animate-pulse` Tailwind class to the
  existing amber background (AC #20 pulsing border).
- For completed chips, wrap in a `<span title={tooltipText}>` where
  `tooltipText` is the matching `EventEntry.text`. Native browser tooltip is
  fine (matches the cheapness of the existing component); no custom tooltip
  library.

### `src/pages/Draft.tsx` (line 24, 107)

**Spike 2.** Two inserts:

1. Replace the unconditional `<h2 className="text-xl font-bold mb-2">Draft</h2>`
   at line 24 (no-live-draft branch) and `<h2 className="text-xl font-bold">Draft — {g.year}</h2>`
   at line 107 (live-draft branch) with a shared `<DraftHeader />`-style
   inline block. Title: `g.year === g.startYear ? 'Inaugural Draft' : 'Draft'` + ` — ${g.year}`.
2. Pill badge right-aligned in the header `flex` container at line 105:
   ```tsx
   <span className={`text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 ${
     g.year === g.startYear ? 'bg-amber-500 text-slate-900' : 'bg-slate-300 text-slate-700'
   }`}>
     {g.year === g.startYear ? 'INAUGURAL' : 'ROOKIE'}
   </span>
   ```
3. When `g.year === g.startYear`, render the AC #24 amber banner subtitle
   directly under the title (within the same header block at line 105):
   ```tsx
   <div className="mt-2 rounded border border-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
     The founding generation. These are the marquee historical figures of pre-revolutionary America, drafted onto factions in snake order. From {g.startYear + 4} onward, drafts will be smaller classes of newly-eligible rookies (born ~25 years ago).
   </div>
   ```
   Banner only renders in the live-draft branch (post-line 102). The
   no-live-draft branch shows the title + pill but not the banner.

### `src/pages/DeathsRetirementsPage.tsx` — **NEW**

Spike 1 AC #1-#6. Sortable table + demographic mini-chart + empty state.

Page reads from the current-turn `HalfTermSummary` (the head of
`snapshot.game.halfTermSummaries`). Rows: for each `summary.deaths`
entry, look up the politician (still in `snap.politicians` — they're
flagged `deathYear` but not removed). Render columns: Name · Faction
(via `factions.find`) · State · Office (`p.currentOffice?.type`, null if
vacated — but `vacateOffice` runs in the same phase, so prefer reading
the **logged** office: store it in `summary.deaths[i].office?` at record
time — see addendum below) · Age (`p.age`) · PV (`p.pvCache`) · Cause
(human-friendly label from the `DeathCause` enum: "Died of age",
"Killed in battle", "Died in anytime event", "Assassinated").

**Office-at-death addendum:** `vacateOffice` (line 2042-2074) wipes
`p.currentOffice` synchronously. To preserve the office string for the
Deaths page, extend `HalfTermSummary.deaths[i]` with `office?: string` and
populate it in `recordDeath` BEFORE the vacate call. (Add the field to the
type definition above.)

Sort: default by PV descending, sortable by column header (mirror
`Draft.tsx`'s `SortKey` pattern at line 5).

Demographic mini-chart: bucket `summary.deaths` + `summary.retirements`
by age range (50s/60s/70s/80s+) and render a tiny horizontal bar chart
using existing Tailwind patterns (see `Roster.tsx` or
`FactionAlignments.tsx` for examples — pick the cheapest).

Empty state (zero deaths AND zero retirements): single line
"No deaths or retirements this half-term." + Continue button that calls
`advance()`.

Header: "Deaths & Retirements — {year-2} to {year}". Header summary line:
"X died, Y retired this half-term."

### `src/pages/EndOfHalfTermPage.tsx` — **NEW**

Spike 1 AC #7-#11. Reads from the current `HalfTermSummary` (head of
`game.halfTermSummaries`). Sections in spec order:

1. **National meters delta panel** — one row per meter
   (`metersStart[k]` → `metersEnd[k]`) with `(delta).toFixed(1)` and a
   colored arrow (up = emerald, down = rose). Iterate over
   `Object.keys(summary.metersEnd)` since `NationalMeters` has 7 fixed keys.
2. **Faction-strength chart** — for each faction id in `summary.factionSizesEnd`,
   render a horizontal bar with `start → end` count and the delta.
   Cap bar width at 100% of the largest faction's end count.
3. **Top PV winners (5) and losers (5)** — iterate over `snap.politicians`
   where `!p.deathYear && !p.retiredYear`, compute
   `p.pvCache - (summary.pvSnapshotStart[p.id] ?? p.pvCache)`. Filter out
   `summary.deaths`/`retirements` ids. Sort, take top 5 / bottom 5.
4. **Key events fired this half-term** — render
   `summary.milestones` + a derived summary of `summary.eraEventsResolved`
   (title from the resolved event in `snap.events` filtered by
   `meta.eraEvent === true` AND year in `[summary.startYear, summary.endYear]`) +
   `summary.billsPassed`/`billsFailed`. Cap at 10; expand-toggle for the rest.
5. **Next-turn preview** — call `shouldRunPhase(p.id, snap.game.year+2, snap.game)`
   for each phase in `PHASE_SEQUENCE` and surface any phase that:
   (a) is one of the player-input phases (the same set the new auto-nav
   effects cover: 2.1.1, 2.4.3, 2.9.6 in 1772+gate, conventions),
   and (b) has a non-trivial "will need you" predicate (draft pool
   forecast, era event pending, etc.).
   First-pass implementation: a simple `PHASE_SEQUENCE`-walk with a
   static set of "interesting" phase ids, no deep prediction.

Continue button at the bottom: "Continue to {snap.game.year + 2}" calling
`advance()`.

First-turn handling (no prior summary): the page reads the current open
summary (`metersStart === metersEnd` because we just opened it at the
start of 2.10 — wait, no: by the time 2.10 runs, the summary has been open
since the first phase of this turn, and `closeSummary` runs AT 2.10. So
`metersEnd` is fresh). Show "First half-term complete" framing as the
section header on turn 1 (when `summary.deaths.length === 0` etc., though
that's a coincidence — the better signal is
`snap.game.halfTermSummaries.length === 1`).

### `src/components/GameOverScreen.tsx` (current: 36 lines)

**Replace entirely** with the five-panel retrospective. Spike 3 AC #28-#36.

```tsx
export function GameOverScreen(): JSX.Element {
  const { snapshot, resetGame, startNewGame, exportSave } = useGame();
  if (!snapshot) return <div />;
  const { game, politicians, factions, events } = snapshot;
  const ended = game.gameEnded;
  const playerFaction = factions.find(f => f.id === game.playerFactionId);
  // ...
}
```

Layout: a vertical stack of panels in a `max-w-4xl` centered container.
Below `md` breakpoint, single-column scroll (Tailwind `space-y-6 md:space-y-8`).

**Banner** (AC #29): "Campaign Over — {year}" + headline = `ended.reason`
+ subtitle = "Played as {playerFaction.name} ({game.playerFactionId's partyId})
from {game.startYear} to {game.year}." Reuse the existing top banner styling.

**Panel 1 — Final faction snapshot** (AC #30):
- Faction PV total: `politicians.filter(p => p.factionId === game.playerFactionId && !p.deathYear && !p.retiredYear).reduce((s,p) => s + p.pvCache, 0)`
- Top 5 living members by PV (name + state + PV + `currentOffice?.type ?? '—'`)
- Member count vs starting roster size: derive `starting` from the first
  summary's `factionSizesStart[playerFactionId] ?? politicians.filter(p => p.factionId === ...).length`
  — best-effort, OK if first summary is missing.
- Ideology alignment chart: count by 7-point ideology across living
  faction members. Horizontal bar chart, reuse `FactionAlignments.tsx`
  patterns if cheap, otherwise inline a small Tailwind grid.
- Key losses (5): from `politicians.filter(p => p.factionId === ... && (p.deathYear || p.retiredYear))`,
  sort by `pvCache` desc, take 5. (Per spec AC #30, peak-PV proxy with
  `pvCache` is the documented fallback — no peakPv field exists on Politician.)

**Panel 2 — Your faction's defining decisions** (AC #31):
- Filter: `events.filter(e => e.category === 'event' && e.meta?.eraEvent === true && e.meta?.aiResolved === false)`.
- Each row: year (`e.year`), event title (parse from `e.text` up to the first `:`),
  response label (after `:` up to `.`), the effect text (rest of `e.text`).
- The pre-set `e.meta.templateId` is the canonical identifier — use it for
  optional alt-history detection (Panel 3).
- Empty state per spec: "Your faction's voice was rarely heard in the great debates."

**Panel 3 — Era timeline** (AC #32):
- Render `<EraTimeline snapshot={snapshot} />` directly. The post-Spike-1
  polish (year stamps + tooltips) carries over.
- Below it: "Alt-history branches taken" list. Source:
  `ERA_GRAPH_1772.filter(n => n.realEvent === false && game.eraEventsCompleted.includes(n.templateId))`
  → for each, look up its resolution in `events` to read the chosen response.
  Imports needed: `ERA_GRAPH_1772` from `../data/eraEvents1772.ts`.
  Gated to `game.scenarioId === '1772'`; renders empty section for 1856
  (which has no alt-history graph).

**Panel 4 — Historical contrast** (AC #33, F5):
- A `const CONTRAST_LINES: Record<string, string>` keyed off `templateId`,
  with the historian's three verbatim lines for `lost_war`, `dominion_autonomy`,
  `confederation_remains`, plus a `'__fallback'` key for the "no terminal
  fired" path.
- Render as `<blockquote className="italic border-l-4 border-amber-500 pl-4 py-2 text-slate-300">{line}</blockquote>`.
- Selection: `CONTRAST_LINES[ended.templateId] ?? CONTRAST_LINES.__fallback`.

The verbatim text (transcribe exactly from
`docs/research/1772-ux-polish-pass-historical-context.md`):
- `lost_war` — the "Historically, the colonies declared independence on
  July 4, 1776..." paragraph.
- `dominion_autonomy` — the "Historically, Congress rejected Lord North's
  Conciliatory Resolution..." paragraph.
- `confederation_remains` — the "Historically, the Annapolis Convention's
  1786 report..." paragraph.
- `__fallback` — the "Historically, the United States declared
  independence in 1776..." paragraph.

**Panel 5 — Buttons row** (AC #34, #36):
- **New Game** — keeps existing behavior: `resetGame()` + `window.location.reload()`.
  (Open Q #5 deviation noted: the reload is jarring. We **recommend**
  changing it to no-reload via a new `resetGame` follow-up that surfaces
  `NewGameScreen` directly — but that's a small bonus the architect calls
  out as deviation; ship as-is for safety.)
- **Replay Same Scenario** — calls
  `startNewGame(game.playerFactionId, game.scenarioId as '1772' | '1856')`.
  Per Open Q #5 confirmation, `startNewGame` already does
  `clearDb()` → `build*Scenario()` → `saveSnapshot()` → `setSnapshot()`
  without reload (GameContext.tsx:187-195). No engine work needed.
- **Export Save** — call `exportSave()` → JSON. Trigger a Blob URL
  download. (`exportSave` returns the JSON string; UI wraps it in a Blob
  and an `<a download>` click.)

### `src/pages/registry.ts`

Add `'deathsRetirements'` and `'endOfHalfTerm'` to the `PageId` union (line
36-68) and to the `Pages` map (line 70-104). Imports at the top
(lines 1-33). Per the spec's spike-1 vision (auto-nav only), these pages
are NOT added to `Sidebar.tsx`'s nav list — they're reachable only via
auto-nav from their phase entry.

## Files to touch (exact, ordered)

Grouped by spike. New files marked **NEW**; otherwise edited.

**Spike 1 — What Just Happened:**

1. `src/types.ts` — Add `HalfTermSummary` interface, `DeathCause`/`RetireCause`
   types; add `halfTermSummaries?` to `GameState`; document the new
   `EventEntry.meta` keys (no code change to `EventEntry`).
2. `src/engine/halfTermSummary.ts` — **NEW**. Recorder helpers
   (`openSummaryIfNeeded`, `closeSummary`, `recordDeath`, `recordRetirement`,
   `recordBillPassed`, `recordBillFailed`, `recordEraEvent`, `recordMilestone`,
   `activeSummary`).
3. `src/engine/engine.ts` — Call `openSummaryIfNeeded` at the top of
   `runCurrentPhase`. Extend the return type with `acknowledgements?: EraEvent[]`.
   Update the `2.4.3` case to thread the new shape from
   `runPhase_2_4_3_Era`.
4. `src/engine/phaseRunners.ts` —
   (a) `runPhase_2_4_3_Era` (line 2360) returns `{ event, acknowledgements }`;
   `resolveEraEvent` (line 2385) calls `recordEraEvent` after the addLog.
   Era-milestone hooks: `recordMilestone` calls in the
   `unlocks?.includes('governors')` block (line 2410), `triggersGameEnd`
   block (line 2419), war-start (line 2599-2601), war-end (in
   `handleScripted1772Consequences` — needs a survey).
   (b) `runPhase_2_4_1_Deaths` (line 2000) — add `deathCause` / `retireCause`
   meta to the logs, call `recordDeath` / `recordRetirement` (cause `'age'`).
   (c) `runPhase_2_4_2_Anytime` (line 2346) / `rollPersonalEvents`
   (line 2298, 2303) — `deathCause: 'event'` / `retireCause: 'event'` +
   `recordDeath` / `recordRetirement`.
   (d) `runPhase_2_8_2_CourtMgmt` (line 2911) — `retireCause: 'court'` +
   `recordRetirement`.
   (e) `runPhase_2_6_3_Floor` (line 2769) — `recordBillPassed` /
   `recordBillFailed` in both 1772 and 1856 branches.
   (f) `runPhase_2_10_End` (line 3355) — `closeSummary(snap)` after the
   final addLog.
5. `src/engine/revolutionaryWar.ts` — line 89, `deathCause: 'battle'` meta
   + `recordDeath(snap, victim.id, 'battle')`.
6. `src/state/GameContext.tsx` —
   (a) Modal-type extension (line 14-17, add `mode?` to `eraEvent` variant).
   (b) `ackQueue` state + `acknowledgeEraEvent` action.
   (c) `advance` (line 210) and `chooseEraResponse` (line 353) read
   `result.acknowledgements`, push into `ackQueue`, surface first one.
   (d) `repair` (line 87) one-liner: `s.game.halfTermSummaries ??= []`.
   (e) Add `acknowledgeEraEvent` to the context value (line 603).
7. `src/components/EraEventModal.tsx` — Add `mode?: 'pick' | 'acknowledge'`
   prop, branch the response list + footer for `acknowledge`.
8. `src/App.tsx` — 10 new `useEffect` auto-nav blocks between line 114 and
   line 120. The modal render at line 178 stays as-is (the `mode` prop
   threads automatically once the union has it; pass it through:
   `<EraEventModal event={modal.event} mode={modal.mode} />`).
9. `src/components/EraTimeline.tsx` — Year stamps + tooltips + amber-pulse
   border. Imports from `snapshot.events` (already passed in via prop).
10. `src/pages/DeathsRetirementsPage.tsx` — **NEW**. Spike 1 surface.
11. `src/pages/EndOfHalfTermPage.tsx` — **NEW**. Spike 1 surface.
12. `src/pages/registry.ts` — Add page ids + Pages-map entries (lines 1-33,
    36-68, 70-104).

**Spike 2 — Inaugural-Draft Signage:**

13. `src/pages/Draft.tsx` — Title + pill + amber banner. Header changes at
    lines 24 and 102-115 only.

**Spike 3 — Campaign-Over Recap:**

14. `src/components/GameOverScreen.tsx` — Replace the existing 36-line
    component with the five-panel layout. Imports `EraTimeline`,
    `ERA_GRAPH_1772` from `../data/eraEvents1772.ts`. `CONTRAST_LINES`
    constant near the top.

**Not touched (explicit guardrails):**
- `src/components/Sidebar.tsx` — auto-nav only per spec.
- `src/pv.ts` — no PV formula change.
- `src/rng.ts` — no determinism change.
- `src/engine/phases.ts` — no phase order or skip-predicate change.
- `src/data/eraEvents1772.ts` — no era content change.
- Other phase runners not listed above.

**File count delta:** 11 modified + 3 new = 14 files.

## Test / verification plan

`npm run build` (= `tsc -b && vite build`) must pass. The new
`halfTermSummary.ts` module compiles; the new pages import; no existing
imports break.

**Playtest (1772 scenario) — group by spike.**

### Spike 1 ACs

- **AC #1, #14 (Deaths auto-nav once per phase)**: start 1772, advance
  to 1774 turn's phase 2.4.1. Verify the page auto-navigates exactly once,
  click away to Roster, advance phase, return to 2.4.1 next half-term —
  verify auto-nav re-fires for the new year.
- **AC #2, #3 (header + table)**: scroll through 2-3 half-terms with at
  least one death/retirement. Verify the header reads correctly and the
  table columns are populated. Sort by each column.
- **AC #4 (cause)**: trigger a battle death via 2.7.2 in the Rev War —
  verify "Killed in battle" cause. Trigger an age death — verify "Died of age".
- **AC #5 (empty state)**: hit a 2.4.1 with zero events (very early game,
  no old politicians). Verify the empty state + Continue button.
- **AC #6 (demographic chart)**: visually confirm age-bracket bars.
- **AC #7 (EOH auto-nav)**: each turn's 2.10. Verify single navigation,
  no yank-back.
- **AC #9 (panels)**: verify each section renders: meter deltas (compare
  to manual 2.5.1 log inspection), faction-strength bars, top 5/5 PV
  winners/losers, key events bullet list, next-turn preview.
- **AC #10 (Continue button)**: click "Continue to {year+2}", verify
  `advance()` fires.
- **AC #11 (scenario-agnostic)**: switch to 1856 scenario, advance one
  turn. Verify EOH page auto-navs at 2.10 there too.
- **AC #12-15 (auto-nav table)**: walk through one full turn in 1772
  (1774). Verify every listed phase id lands on the right page. Test
  override priorities: in 2.1.1 draft year, the draft auto-nav (existing)
  wins. In 2.7.2 with revolutionaryWar inactive (post-victory), confirm
  the new auto-nav effect does NOT fire (gated).
- **AC #16-17 (auto-resolve acknowledgement queue)**: play to a phase
  where 3+ auto events fire in a single 2.4.3 (the 1772 spine cluster
  around the Stamp Act / Tea Act / Intolerable Acts cascade). Verify the
  acknowledgement modal queues them and each is dismissed individually.
- **AC #18 (terminal nodes skip ack modal)**: force a `confederation_remains`
  terminal via the Annapolis branch. Verify Campaign-Over fires directly,
  NO acknowledgement modal in between.
- **AC #19 (modal copy)**: in acknowledge mode, verify only the
  engine-chosen response is shown, no alternates, single "Acknowledge"
  button.
- **AC #20-22 (Era Progress timeline)**: visit Dashboard after completing
  one milestone. Verify the year stamp appears below the label, current
  chip pulses amber, hover reveals the tooltip text (the resolved log).
  Switch to 1856 — timeline component returns `<div />` unchanged.

### Spike 2 ACs

- **AC #23-25**: on 1772 startYear (1772) draft, verify "Inaugural Draft —
  1772" title, amber banner with the verbatim text, "INAUGURAL" amber pill.
  Advance to 1776 draft — verify "Draft — 1776" title, no banner, "ROOKIE"
  slate pill.
- **AC #26 (scenario-agnostic)**: start a fresh 1856 game, verify
  "Inaugural Draft — 1856" + banner + amber pill on startYear's draft.
- **AC #27**: confirm pool composition and snake order unchanged from
  pre-feature (smoke test).

### Spike 3 ACs

- **AC #28-29 (banner)**: force a terminal `lost_war` (e.g., via save edit
  or playing to it). Verify "Campaign Over — {year}", headline = event
  title, subtitle = "Played as {faction} ({BLUE|RED}) from 1772 to {year}".
- **AC #30 (Panel 1)**: verify faction PV total, top 5 living, member
  count vs starting, ideology chart, key losses (sorted by PV).
- **AC #31 (Panel 2)**: verify chronological list of player-resolved era
  events. Test the empty state by playing a faction with no CC-president.
- **AC #32 (Panel 3)**: verify the polished `EraTimeline` renders + the
  alt-history list shows any `realEvent === false` resolved nodes.
- **AC #33 (Panel 4)**: verify the three terminal contrast lines match
  the historian's text verbatim. Force each terminal node in three
  separate playthroughs. Test the fallback by editing a save to set
  `gameEnded.templateId` to something not in the contrast map.
- **AC #34, #36 (buttons)**: click Replay Same Scenario — verify
  `clearDb()` runs, a fresh scenario builds with the same faction and
  scenario id, no page reload. Click New Game — verify existing behavior
  unchanged. Click Export Save — verify a JSON file downloads.
- **AC #35 (responsive)**: resize window below `md` breakpoint, verify
  panels stack vertically without horizontal scroll.

### Engine cross-cutting checks

- **First-turn EOH** (no prior summary): start a fresh 1772 game, advance
  to the first 2.10. Verify the EOH page shows meter values without
  delta arrows (or zero deltas) and a sensible framing.
- **Save/reload mid-acknowledgement-queue**: queue 3 acks, refresh the
  browser. Verify the queue drops (acceptable loss per spec edge case);
  the events remain in the Era Events page log.
- **Save/reload after `halfTermSummaries` field exists**: confirm the
  existing IndexedDB save migrates clean via `repair()` (the optional
  field stays `[]`, never breaks).

## Open Question resolutions

### Q1 (Highest risk): Per-turn delta tracking

**Quoted**: "The engine has no existing concept of 'start-of-turn snapshot.'
Architect must choose between (A) `prevSnapshot`... (B) `game.halfTermSummaries: HalfTermSummary[]`..."

**Decision**: Option B. `game.halfTermSummaries: HalfTermSummary[]`,
incrementally populated by phase runners via helpers in a new
`src/engine/halfTermSummary.ts` module.

**Rationale**: Option A (a snapshot of `politicians` + `factions` +
`game`) would roughly double the autosave size (politicians is the
largest array; ~hundreds of full records per turn). Option B's payload
is bounded by the per-turn event count — typically ~1KB/turn even in
busy half-terms. Option B also feeds the Campaign-Over retrospective
naturally (Panel 2 reads `halfTermSummaries[*].eraEventsResolved` more
cheaply than re-scanning the full event log). The cost is a wider engine
touch: every phase runner that mutates the snapshot in a way the EOH
page reports calls a recorder helper. That cost is acceptable because
the helpers are pure and trivially testable. Initialization: at the top
of `runCurrentPhase` (called every phase), `openSummaryIfNeeded`
idempotently opens a new summary if one isn't already open for the
current year. Close: in `runPhase_2_10_End` via `closeSummary`.
Retention: **keep all summaries forever** — the Campaign-Over
retrospective wants the full history, and a 50-turn campaign is at most
~50KB of summaries (well below the autosave's existing ~200KB politicians
payload). No cap needed for the v1 scope.

### Q2: Auto-nav add vs centralize

**Quoted**: "Add 10 parallel `useEffect`s vs. centralize into one
phase→page map."

**Decision**: ADD parallel effects per F3. No centralization in this PR.

**Rationale**: The existing six effects use a stable, idiomatic pattern
(useRef sentinel + year+phaseId key). The 10 new effects fit that pattern
1:1, costing ~120 lines in `App.tsx` (a file that's already 191 lines and
growing). A centralized phase→page dispatcher is plausible engineering,
but premature: the final phase→page map is still in flux (this PR adds
10; future PRs may add more; some effects have non-trivial predicates —
2.1.1's live-draft check, 2.9.6's CC-builder cursor, 2.7.2's war-active
gate — that don't reduce to a static map). When the count crosses ~25,
revisit centralization as a dedicated refactor PR.

### Q3: Era-event acknowledgement queue mechanism

**Quoted**: "The engine resolves multiple auto events in a tight `while`
loop... acknowledgement modal must queue them and present one at a time.
PM recommends `result.acknowledgements: EraEvent[]`."

**Decision**: Engine returns acknowledgements; React state holds the queue.
Specifically:
- `runPhase_2_4_3_Era` returns `{ event: EraEvent | null; acknowledgements: EraEvent[] }`.
- `runCurrentPhase`'s return type adds optional `acknowledgements?: EraEvent[]`.
- `GameContext.advance` and `chooseEraResponse` push acknowledgements into a
  React `useState<EraEvent[]>` queue. They surface the head immediately as
  `setModal({ type: 'eraEvent', event: head, mode: 'acknowledge' })`.
- The modal's "Acknowledge" button calls `acknowledgeEraEvent()`, which pops
  the queue head and either surfaces the next event or clears the modal.

**Rationale**: Engine return shape stays pure (a serializable list of events).
Queue mechanics live in React state, not the snapshot — the spec accepts
the save/reload loss (the engine already persisted the resolutions and
log entries). The modal-state-union gets a `mode?` discriminator field
on the existing `eraEvent` variant rather than a new union variant,
because the data is identical (an `EraEvent`); the only difference is
render mode. F6 (terminal endings skip the ack modal) is enforced in
the engine: `runPhase_2_4_3_Era` does not push `triggersGameEnd: true`
events into `acknowledgements`. As a defense-in-depth, `GameContext`
also filters by `game.gameEnded?.templateId` before pushing.

### Q4: Cause-of-death derivation

**Quoted**: "Log-scraping vs. new `Politician.deathCause`/`retireCause`
field. PM recommends log-derived."

**Decision**: **Log-side meta**. Add `meta.deathCause: DeathCause` and
`meta.retireCause: RetireCause` to the `addLog` call sites in
`runPhase_2_4_1_Deaths` (cause `'age'`), `runPhase_2_4_2_Anytime`
(cause `'event'`), `runPhase_2_7_2_Military` / `revolutionaryWar.ts`
(cause `'battle'`), `runPhase_2_8_2_CourtMgmt` (cause `'court'` for
retirements only). Also record into `HalfTermSummary.deaths[].cause` /
`retirements[].cause` so the Deaths page reads cheaply from one source.

**Rationale**: Pure render-time derivation from `EventEntry.phase`
(scanning `events` to find the matching log line and inferring cause
from phase id) is fragile: new event sources (future scenarios, anytime
event additions) would need the render-time switch updated in lockstep,
and the matching logic must handle missing/stale entries. A meta-field
on the log + a structured field on `HalfTermSummary` is a single
authoritative source, written exactly once per death/retirement at the
moment of the engine-side decision. Cost: ~6 edited addLog sites and 6
recorder calls, all 1-line changes. The `DeathCause`/`RetireCause`
enums are extensible.

### Q5: Replay Same Scenario button

**Quoted**: "Reuses existing `startNewGame(factionId, scenarioId)`.
Confirm the in-context call clears DB cleanly without reload..."

**Decision**: Confirmed. `startNewGame(playerFactionId, scenarioId)` at
`GameContext.tsx:187-195` already calls `clearDb()` →
`build*Scenario(factionId)` → `saveSnapshot(fresh)` → `setSnapshot({ ...fresh })`.
No engine work. The GameOverScreen's button passes
`game.playerFactionId` and `game.scenarioId as '1772' | '1856'`.

**Side note (deviation flagged)**: The existing "New Game" button uses
`resetGame()` + `window.location.reload()` — a jarring full page reload
that doesn't match the no-reload `startNewGame` pattern. We **recommend**
also switching the New Game button to the no-reload pattern (it can call
`resetGame()` then surface `NewGameScreen` by returning `null` snapshot,
which the `Shell` already routes via `if (!snapshot && !hasSave) return <NewGameScreen />`).
But that's a bonus deviation; ship the original `resetGame()` + reload
for safety unless the user approves at CP3.

### Q6: 2.7.2 auto-nav gating

**Quoted**: "Auto-nav for 2.7.2 (Military) is gated on
`revolutionaryWar?.active`. Confirm the engine never lingers on 2.7.2..."

**Decision**: Trust the existing skip predicate (`phases.ts:134`). The
new 2.7.2 auto-nav effect explicitly tests
`g.revolutionaryWar?.active === true` AND `g.phaseId === '2.7.2'`. If
the war ends mid-phase (war-score crosses threshold during
`runRevWarBattles`), the phase still completes that turn, the auto-nav
fires once (war was active when the phase started), and the player sees
the (now-final) war state. Acceptable per spec.

### Q7: Era timeline year stamps

**Quoted**: "Milestone-template IDs must reliably map to `EventEntry`
entries with `meta.templateId`."

**Decision**: Confirmed. `phaseRunners.ts:2397` sets
`meta.templateId` on every era-event log entry. The `EraTimeline`
component scans `snapshot.events.filter(e => e.category === 'event' && e.meta?.templateId === m.templateId)`
and takes the most recent `e.year`. Defensive fallback: if no matching
entry, render the chip as completed without a year stamp; do not crash.

### Q8: Empty Deaths page

**Quoted**: "Empty Deaths page does not feel like dead weight. PM wants
the page to auto-nav even on empty (AC #5)."

**Decision**: Per F8, the page auto-navs on empty. The empty state is a
single-line "No deaths or retirements this half-term." with a Continue
button. The Deaths page existing reassures the player that 2.4.1 ran;
without the auto-nav, the player wouldn't know.

## Risks

Top three, ordered.

1. **Per-turn delta tracking is the riskiest change.** Phase runners
   today are pure-but-cheap; this PR wires recorder calls into ~6 sites
   across `phaseRunners.ts` and `revolutionaryWar.ts`. If any site is
   missed, the EOH page silently shows incomplete data. **Mitigation**:
   the recorder helpers are `void` and no-op if no active summary, so
   miscalls never crash. Coverage check during playtest: walk a full
   half-term and verify the EOH page shows expected deltas for meters
   (compare against the 2.5.1 log spam), faction sizes (compare against
   the politicians list), bills (compare against the 2.6.3 log spam),
   and deaths (compare against the 2.4.1 page). **Failure mode**: a
   "ghost" half-term summary with stale fields (e.g., `factionSizesEnd`
   not updated because a future phase mutates faction membership after
   2.10 — but no phase does today). If a future migration adds
   politician-membership churn after 2.10, the EOH would silently lag.
   Acceptable risk for v1.

2. **Acknowledgement-queue UX edge cases.** Multiple auto-events firing
   in succession (the 1772 spine has clusters: Gaspee → Tea Act → Boston
   Tea Party → Intolerable Acts can fire in adjacent or even same-phase
   visits if preconditions stack). The modal queue surfaces them one at
   a time; a player who clicks Acknowledge fast may flash through 3-4
   events. **Mitigation**: each modal's "Acknowledge" handler pops the
   queue synchronously; there is no animation delay. If pacing feels
   bad, add a 100ms debounce to `acknowledgeEraEvent` (deferred — out
   of scope unless the playtest demands it). **Failure mode**: the
   queue drops on reload, but that's accepted by the spec.

3. **`game.gameEnded` flowing past the acknowledgement queue.** F6 says
   terminal endings skip the ack modal. The engine excludes them from
   `acknowledgements` already (the `while` loop short-circuits on
   `triggersGameEnd: true` per `phaseRunners.ts:2418-2422`). The
   `GameContext` also defensively filters by
   `gameEnded?.templateId` before pushing into the queue. **But**: if a
   non-terminal auto event fires immediately before a terminal one in
   the same `runCurrentPhase` call, the non-terminal ack is enqueued,
   then the terminal triggers `gameEnded` and `App.tsx:161` short-circuits
   to `<GameOverScreen />`. The queue is silently abandoned. Acceptable
   per spec edge case ("Game ends mid-turn... Acknowledgement modals
   queued behind the terminal node are dropped"), and the player sees
   the dropped event in the Era Events page log. No code change needed
   — just verify the path in playtest.

## Out of scope — explicit guardrails

- **Persisting the acknowledgement queue across reload** — accepted loss.
- **1856-specific timeline polish** — `EraTimeline` is already gated to
  1772 (line 17); no change for 1856.
- **PV/skill tooltip pass on Draft** — future feature.
- **`PartyBadge` D/R label leak on the read-only CC page** — separate cleanup.
- **Single-dispatcher refactor of auto-nav effects** — premature per F3.
- **Engine rule changes** (PV formula, draft mechanics, era-event
  resolution logic) — F1 forbids.
- **New era content** — historian's H1-H3 govern.
- **`New Game` button no-reload upgrade** — bonus deviation; ship the
  existing reload path unless user approves.

## Definition of Done

- `npm run build` passes (`tsc -b && vite build`).
- New pages `deathsRetirements` and `endOfHalfTerm` registered and render
  without errors on both 1772 and 1856 scenarios.
- All 10 new auto-nav `useEffect`s in `App.tsx` trigger exactly once per
  `(year, phaseId)` combination per session.
- Playing through a 1772 scenario to a terminal node (any of `lost_war`,
  `dominion_autonomy`, `confederation_remains`) shows the Campaign-Over
  recap with the correct verbatim historian's contrast line.
- An auto-resolved era event (e.g., Boston Tea Party in 1773) opens the
  acknowledgement modal exactly once and dismisses cleanly.
- 3+ auto events in a single phase queue and present sequentially.
- Inaugural-Draft header shows on year `startYear` of both scenarios; the
  rookie header shows on every later draft year.
- Era Progress timeline shows year stamps for completed milestones.
- EOH page shows meter deltas, top PV winners/losers, faction-strength
  deltas, and a next-turn preview at every 2.10 visit.
- Deaths page renders the most-recent half-term's events including the
  demographic mini-chart and the empty state.
- **Playtest** (per CLAUDE.md): launch `npm run dev`, play one
  half-term in 1772, confirm every Spike 1 auto-nav lands. Force a
  Campaign-Over and confirm all 5 panels render.

---

**Checkpoint summary (for phone approval):**

- **Approach**: presentation-layer over engine state, plus one delta-
  tracking field (`game.halfTermSummaries: HalfTermSummary[]`) populated
  incrementally by ~6 phase runners via a new
  `src/engine/halfTermSummary.ts` module. Two new pages, one modal mode,
  10 new auto-nav effects, one revamped GameOverScreen, one Draft header
  tweak. Engine stays pure; ack-queue is React state only.
- **Files touched**: 14 — 3 new (`halfTermSummary.ts`,
  `DeathsRetirementsPage.tsx`, `EndOfHalfTermPage.tsx`), 11 modified
  (`types.ts`, `engine.ts`, `phaseRunners.ts`, `revolutionaryWar.ts`,
  `GameContext.tsx`, `EraEventModal.tsx`, `App.tsx`, `EraTimeline.tsx`,
  `registry.ts`, `Draft.tsx`, `GameOverScreen.tsx`).
- **Top risk**: per-turn delta tracking spread across ~6 phase runner
  sites. A missed recorder call silently corrupts the EOH page's deltas.
  Mitigation is playtest coverage — verify each panel against the
  existing log feeds.
- **Out of scope**: 1856-specific timeline polish, ack-queue persistence
  across reload, PV/draft mechanics, single-dispatcher refactor, new
  era content, `New Game`-button reload removal (deviation flagged but
  not adopted).
