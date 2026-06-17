# Spec: Events Phase Manual Trigger & Data Visualization

## Vision (as given)

For both phase 2.4.2 (Anytime Events) and phase 2.4.3 (Era Events), the player
needs a way to manually trigger/advance events from within the phase, instead of
only seeing them after advancing to the next phase. When the phase opens, show
every pending and newly-eligible event, let the player step through them one at
a time via an explicit "Run next event" button (auto-resolve AI-decided nodes
inline), and surface the underlying data: (a) the **prelude** — the human-readable
`Predicate` that was satisfied (which year/meter/diplomacy thresholds passed,
which prior events were chosen), (b) the **payload** (title, description,
options, decider/controlling faction), and (c) the **effects**
(`EraEventResponseEffect` / anytime event effect — meters, interests, war
flags, state admission, etc.). Effects show as a preview pre-resolution and as a
log entry post-resolution. Out of scope: engine selection algorithm changes,
threshold rebalancing, new events.

## Historical grounding (binding)

Per `docs/research/events-phase-manual-trigger-historical-context.md`, all
surfaced strings are era-gated. The binding facts driving acceptance criteria:
(1) the U.S. Presidency does not exist before Mar 4, 1789, so `cc-president`
must render as "President of the Continental Congress" (≤1780) or "President of
the Confederation Congress" (≥1781); (2) `→D`/`→R` enthusiasm polarity is
correct for 1856 but anachronistic for 1772, which must use
`→Patriot`/`→Federalist` (the game's own `PARTIES_1772` names); (3) `warActive`
must read "the colonies are at war" pre-1776, not "the United States is at war";
(4) `warVictoryGuaranteed` framing must soften to "French alliance: defeat
unlikely" rather than "war victory guaranteed"; (5) modern interest-group IDs
(`BigTech`, `MilitaryIndustrial`, `LWMedia`, `RWMedia`, `Globalists`,
`Pacifists`) must never render on a pre-1789 event chip.

## Player experience

The player opens 2.4.2 or 2.4.3 and sees a queue of pending events with a
prominent "Run next event" button. Each step reveals **why** the event fired
(prelude chips: "1775+", "Lexington & Concord chose 'Mobilize'", "Manpower ≥ 30")
before showing the decision modal. After resolving (or watching the engine
auto-resolve a node the player doesn't control), the effects appear inline in
the queue and as a permanent log entry. The payoff: the player understands
causality and consequence in a system that previously felt like a black box —
"why did this fire now, and what did my choice actually do?"

## User story

As a player running a turn, I want to manually advance through each pending
era / anytime event from within phase 2.4.2 and 2.4.3 — seeing the precondition
that triggered it, the decision payload, and the projected/actual effects in
era-appropriate language — so that I understand the causal chain of my campaign
instead of discovering resolutions only on the next phase.

## Acceptance criteria

**Manual trigger (functional core)**
1. Phase 2.4.3 (`EraEventsPage`) renders a "Run next event" button whenever
   `selectEraGraphNode` would return a node (player-controlled OR AI-controlled).
   Clicking it surfaces the next event: player-controlled nodes open the modal;
   AI-controlled / `auto` nodes resolve inline with a visible "AI decided"
   readout in the queue (no full modal, but the prelude + payload + chosen
   response + effect chips are all visible).
2. Phase 2.4.2 (`AnytimeEventsPage`) renders a "Run next event" button that
   triggers one anytime event roll (national or personal) on demand within the
   phase. Each click appends one new event to the visible feed; the page no
   longer requires advancing the phase to see new entries.
3. Both pages distinguish three queue states: **Pending** (eligible, not yet
   fired), **Newly fired this phase** (highlighted), and **Resolved earlier**.
4. The engine's "one era event per turn" cap is preserved: the era-events
   "Run next event" sequence steps through the player-controlled node **plus
   any AI/`auto` cascading nodes** that fire as scripted consequences of
   resolution, then stops. (See edge case: cascading consequences.)
5. Save/reload mid-phase preserves the visible queue exactly: persist
   `pendingEraEvents` (already durable) and a new transient marker for
   "newly fired this phase" so highlight state survives autosave.

**Prelude / payload / effects visualization**
6. For every era event surfaced, the page renders a **prelude block** above the
   payload listing the satisfied `Predicate` clauses as human-readable chips
   (e.g. `yearAtLeast: 1778` → "Year ≥ 1778"; `eventCompleted: lexington_concord`
   → "After: Lexington & Concord"; `meterAtLeast` → "Manpower ≥ 30"). The
   architect writes the renderer; this spec requires it cover every variant of
   the `Predicate` union in `src/types.ts:707`.
7. Each event displays its **decider/controlling faction** chip (see ACs 9-10)
   and lists all response options with their effect chips visible **before**
   the player commits. Effect chips remain visible after resolution as a
   post-log entry.
8. The chosen response's effects also append to `snapshot.events` (existing
   pattern via `addLog`) so the post-phase history view is consistent.

**Historian-binding label rules (all five must be ACs)**
9. **Decider labels are era-gated.** A single helper (e.g.
   `formatDecider(event, year)`) renders: `cc-president` → "President of the
   Continental Congress" when `year < 1781`, "President of the Confederation
   Congress" when `1781 ≤ year < 1789`; `president` → "President of the United
   States" (only valid `year ≥ 1789`); `cabinet` → "Your Cabinet"; `auto` →
   "Automatic (no decider)". The current `EraEventModal.tsx:30` raw-string
   fallback is removed.
10. **Enthusiasm chip polarity is era-gated.** When scenarioId is `1772` (or
    `year < 1789`), chips render `Ideology→Patriot` (BLUE) /
    `Ideology→Federalist` (RED). When scenarioId is `1856` (or `year ≥ 1828`),
    chips render `Ideology→D` / `Ideology→R` as today.
11. **`warActive: true` predicate label is era-gated.** Pre-1776: "The colonies
    are at war with Britain." 1776–1783: "The Revolutionary War is being
    fought." 1856 scenario: "The Civil War is being fought." Never "the United
    States is at war" before 1776.
12. **`warVictoryGuaranteed` flag** (when surfaced as a prelude chip via
    `flag: 'warVictoryGuaranteed'`) renders as "French alliance: defeat
    unlikely" — never "war victory guaranteed."
13. **Interest-group IDs era-gate in effect chips.** A pre-1789 event (1772
    scenario or `year < 1789`) that surfaces any of
    `BigTech | MilitaryIndustrial | LWMedia | RWMedia | Globalists | Pacifists |
    WallStreet` renders that chip as a debug-only warning style (e.g.
    "(anachronism: BigTech)") and logs a dev-mode console warning. Era-correct
    IDs (`frontier`, `Abolitionists`, `Planters`, `Settlers`, `Workers`,
    `Nativists`, `LawAndOrder`) render normally.

**Pre-existing bug folded in**
14. The decider-label helper from AC 9 replaces every raw `event.decider`
    string emission in `EraEventModal.tsx` and `EraEventsPage.tsx`. Verifiable
    by playtesting an 1856 scenario: the Dred Scott event must read "Your
    Cabinet," not literal "cabinet."

## Edge cases

- **No pending events**: both pages show the existing empty-state copy ("No
  decisions are awaiting you") and the "Run next event" button is disabled with
  a tooltip ("No more events this phase").
- **Player-controlled vs. AI-controlled decider**: the modal opens only for
  player-controlled nodes; AI/auto nodes resolve inline and animate a "Resolved
  by AI" chip into the queue with the chosen response's label and effect chips.
- **Cascading consequences**: when resolving an event triggers another node
  (via `handleScripted1772Consequences` or generic predicate eligibility), the
  next click of "Run next event" picks up the cascaded node. The engine's
  one-per-turn cap still bounds the player-controlled count to 1; AI/auto
  cascades may chain.
- **Save/reload mid-phase**: the queue state survives. Resolved events stay
  resolved; pending events remain pending; the "Newly fired this phase" badge
  resets on phase-advance, not on reload.
- **Era handoff (1772 → Federalism) mid-event**: if the player resolves the
  terminal node (`triggersGameEnd`), no further events surface; the gameEnded
  short-circuit in `runPhase_2_4_3_Era` already handles this. ACs 10-12 use
  `event.year` (not `snap.game.year`) for era-gating so a 1789-era resolution
  of a 1788 event still labels correctly.
- **`event.year` mismatch with current scenario**: era-gating helpers prefer
  `event.year` over `scenarioId` so a single event always labels by its own
  date.
- **Empty `Predicate`** (e.g. `{ all: [] }` used for the core-spine bypass): the
  prelude block renders "Unconditional (core spine event)" rather than an
  empty chip row.

## Out of scope

- Changes to the era-event **selection algorithm** (`selectEraGraphNode`,
  `evalPredicate`, history-pressure weights, fireChance).
- Rebalancing predicate thresholds or response effect magnitudes.
- Adding new era events, new anytime events, or new `Predicate` variants.
- Changes to the **anytime events engine** (`rollPersonalEvents`,
  `rollNationalEvent`). The manual-trigger button calls the existing
  `runPhase_2_4_2_Anytime` on demand; it does not change selection logic.
- Replacing the 1856 `cabinet` decider on Dred Scott with a more historically
  defensible one (the historian flagged this as a content choice, not a
  labeling issue).
- A persistent "play through the whole phase" automation: this is explicitly
  manual; the player clicks once per event.

## Open questions / assumptions

**Riskiest first:**

1. **Anytime-events "Run next event" semantics.** The engine currently rolls
   personal + national in one call (`runPhase_2_4_2_Anytime`). Assumption:
   "Run next event" calls that whole runner once per click (so one click can
   produce 1 national + multiple personal events at once) rather than
   refactoring the runner into a per-event step. **Flag for CP1**: confirm
   one-click-equals-one-runner-invocation is acceptable, or whether the user
   wants a finer-grained "roll exactly one event at a time" — the latter is an
   engine change and would expand scope.
2. **Cascading AI nodes are stepped vs. resolved silently.** When resolving a
   player node triggers AI cascades, do they animate one-at-a-time into the
   queue (requiring no further clicks), or does each cascade require its own
   "Run next event" click? Assumption: they auto-chain inline with a brief
   per-event readout (matches the engine's existing `while` loop in
   `runPhase_2_4_3_Era:2364`). If the user wants step-by-step clicks even for
   AI cascades, that's a richer UI and should be confirmed.
3. **Prelude renderer for compound `Predicate` trees.** A deeply nested
   `{ all: [{ any: [...] }, { not: ... }] }` is hard to chip-ify. Assumption:
   we render a flattened conjunction (every leaf chip rendered separately,
   `not` as a strikethrough chip, `any` as a "one of: A | B" composite chip).
   If the architect needs a different rendering strategy, it should escalate
   before implementation.

**Other assumptions:**

- The "Newly fired this phase" highlight is a UI-only marker on `pendingEraEvents`
  entries that resolved during the current 2.4.3 invocation, cleared on
  `advancePhase`. No new schema field on `EraEvent`.
- The anachronistic-interest-group warning in AC 13 is informational only — the
  chip still renders the delta (we don't suppress the engine effect), but
  visually flags the content bug for future cleanup.
- The decider-label helper lives in `src/components/eraLabels.ts` (new file) so
  both `EraEventModal.tsx` and `EraEventsPage.tsx` import from one place. The
  architect may relocate it.
- "Run next event" buttons can be triggered repeatedly within the phase; the
  phase advances normally via the existing phase-advance button when the player
  is done.
- No deviations from the historian's binding facts — every flagged rule is in
  the AC list above.

## Checkpoint summary

- **Two pages get a "Run next event" button** (2.4.2 anytime, 2.4.3 era);
  manual stepping replaces the silent post-phase reveal.
- **Each event shows prelude (why it fired), payload (decision), and effects
  (chips)** — preview pre-resolution, log post-resolution; renderer covers
  every `Predicate` variant.
- **All five historian rules are ACs**: decider era-gating, enthusiasm
  polarity, `warActive` framing, `warVictoryGuaranteed` softening, modern
  interest-group ID guards.
- **The `EraEventModal.tsx:30` bug** (raw "cabinet"/"president" strings on 1856
  events) is folded into AC 9/14 via one shared `formatDecider` helper.
- **Out of scope** is explicit: no engine selection changes, no rebalancing,
  no new events, no anytime-engine refactor.
- **Top risk for CP1**: whether "Run next event" in 2.4.2 fires one entire
  `runPhase_2_4_2_Anytime` invocation per click (the assumption) or requires
  refactoring the anytime engine to single-event granularity (out-of-scope
  scope creep).
