# Spec: 1772 UX Polish Pass — Three Bundled Spikes

> A UX-quality pass on the 1772 scenario that surfaces engine-side state
> changes the UI currently hides. Three loosely-related spikes share one theme:
> **the player should be able to see what just happened.** Spike 1 (What Just
> Happened) surfaces deaths/retirements, half-term wrap-ups, the auto-fired
> 1772 era spine, and a richer Era Progress timeline; Spike 2 (Inaugural-Draft
> Signage) re-labels the founding-generation draft as a one-time event; Spike 3
> (Campaign-Over Recap) replaces the bare `GameOverScreen` with a campaign
> retrospective keyed on the terminal era-event node that fired. No engine
> rule changes other than the per-turn delta tracking required by the Half-Term
> wrap-up (flagged for the architect).

## Historical grounding (binding)

Source: `docs/research/1772-ux-polish-pass-historical-context.md`. The
historian confirms this is a **presentation-layer pass over existing engine
state**; no era content changes. The only era-content touch is the
Campaign-Over historical-contrast callout, which uses the historian's
pre-researched lines as the actual copy. Binding facts:

- **(H1)** The 1772 era graph has exactly **three** terminal nodes
  (`triggersGameEnd: true`): `lost_war`, `dominion_autonomy`,
  `confederation_remains`. Each gets its own historical-contrast line.
- **(H2)** A campaign that ends **without** a terminal node firing (timed out
  mid-war or mid-Confederation) gets a generic fallback line (see historian
  brief, "time-out / no-terminal-fired contrast line").
- **(H3)** Era-event titles, descriptions, and decider semantics are unchanged.
  This spec only changes whether/how `decider: 'auto'` events surface to the
  player UI — the engine resolution path is untouched.

## Player experience

Today, half of the 1772 scenario happens off-screen: politicians die during
2.4.1 with only a single-line buried entry in the Recent Events list; the
Boston Tea Party, Intolerable Acts, Lexington & Concord and friends fire as
`decider: 'auto'` events whose only visible trace is a log entry the player
must scroll back to find; and when the campaign ends, the player gets a single
flavor sentence and a New Game button. After this pass, every phase the player
returns to gets auto-navigation; auto-resolved era events surface as a small
acknowledgement modal so the player sees the Stamp Act fire instead of just
reading about it later; a dedicated "What Just Happened" page summarizes each
half-term's deaths and retirements; an End-of-Half-Term page wraps every turn
with meter deltas, top PV winners/losers, and a preview of what next turn will
ask; the Era Progress timeline shows year-stamped completed milestones and
highlights what's next; the inaugural founding draft is clearly framed as
once-in-a-game; and Campaign-Over becomes a real retrospective with the
faction's defining choices, the era timeline, a historical contrast line
keyed on the terminal node, and Replay/Export buttons.

## User Story

As the 1772 scenario player, I want every meaningful engine-side state change
to surface in a dedicated UI surface (auto-navigated when the player advances
to it), so that the campaign reads as a connected sequence of events I lived
through instead of a series of black-box turn cranks that occasionally
generate a log line.

## Acceptance Criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP2]` (architect must
resolve at the design checkpoint; PM recommendation in parentheses).

---

### Spike 1 — "What Just Happened" Pass

**Deaths & Retirements page (phase 2.4.1)**

1. **[Locked]** A **new page** `deathsRetirements` is registered in
   `src/pages/registry.ts` and auto-navigated whenever the snapshot's
   `game.phaseId === '2.4.1'`. Uses the same year+phaseId key scheme as the
   existing six auto-nav `useEffect`s in `App.tsx` so it triggers once per
   2.4.1 visit and not on every re-render.
2. **[Locked]** The page header reads **"Deaths & Retirements — {year-2} to
   {year}"** and shows a one-line summary: "X died, Y retired this
   half-term." (Half-term span comes from `game.year - 2` to `game.year` to
   mirror the 2.10 log convention.)
3. **[Locked]** A **sortable table** lists every politician who died or
   retired during the most-recent 2.4.1 run. Columns: **Name · Faction ·
   State · Office (at time of death/retirement) · Age · PV · Cause**.
   Default sort: PV descending.
4. **[Open @ CP2, recommend log-derived]** **Cause** is one of:
   `died-of-age`, `retired-naturally`, `killed-in-battle`,
   `assassinated`, `died-in-anytime-event` — derived from the
   `EventEntry.phase` + `category` of the log line that flipped the
   politician's `deathYear`/`retiredYear`. The PM recommendation is to
   **derive at render time** from `snapshot.events` (no engine schema
   change). The architect may instead decide to add an optional
   `deathCause`/`retireCause` field on `Politician` if log-scraping is
   fragile.
5. **[Locked]** **Empty state**: if zero deaths and zero retirements this
   half-term, the page shows: "No deaths or retirements this half-term."
   plus a Continue button. The page still auto-navigates so the player sees
   the empty state and confirms nothing happened (this is intentional —
   reassures the player that 2.4.1 actually ran).
6. **[Locked]** Below the table, a **demographic mini-chart** shows the
   age-bracket distribution of the dead/retired (e.g., 60s: 2, 70s: 4,
   80s+: 1) so the player can tell at a glance whether this was an
   age-driven cull or a war-driven one.

**End-of-Half-Term page (phase 2.10)**

7. **[Locked]** A **new page** `endOfHalfTerm` is registered and
   auto-navigated whenever `game.phaseId === '2.10'`. Same year+phaseId key
   scheme. **This is the single most valuable missing page in the game and
   gets priority architecture attention.**
8. **[Open @ CP2, recommend `prevSnapshot` field on `FullGameSnapshot`]**
   The page needs **per-turn state deltas** (meter deltas, faction-strength
   deltas, top PV winners/losers vs start-of-turn). The engine must track
   these somewhere. **Two options for the architect:**
   - **(A) `snap.prevSnapshot: Pick<FullGameSnapshot, 'game' | 'politicians' | 'factions'>` captured at turn start** (cheapest, but doubles the autosave size).
   - **(B) `snap.game.halfTermSummaries: HalfTermSummary[]` populated incrementally during the turn** (smaller payload, more engine touch).

   **PM recommendation: (B)** — a structured `HalfTermSummary` object built
   up by phase runners is the least-bloating approach and naturally feeds
   the "key events fired this half-term" list. **This is the riskiest
   technical assumption in the spec.** Flagged here, called out again in
   Open Questions.
9. **[Locked]** Page sections, in order:
   - **National meters delta panel** — one row per meter (revenue,
     economic, military, domestic, honest, quality, planet) showing
     start-of-turn → end-of-turn with a colored delta arrow.
   - **Faction-strength chart** — bar chart of all factions' member counts
     vs. start-of-turn, with delta numbers.
   - **Top PV winners (5) and losers (5)** — politicians ranked by
     `pvCache` delta over the half-term, excluding deaths and
     retirements.
   - **Key events fired this half-term** — bullet list pulled from
     `snapshot.events` filtered to entries with `year` in
     `[game.year-2, game.year]`. Categories surfaced: era-event
     resolutions, bills passed/failed, deaths (count), milestones
     (e.g., `governorsExist` flipped, era flipped, `constitutionRatified`
     flipped). Capped at top 10; "+N more" toggle expands.
   - **Next-turn preview** — list of phases that will run **and need
     player input** next turn (drafts, era events, conventions, CC
     builder, etc.). Derived by walking `PHASE_SEQUENCE` with
     `shouldRunPhase(p.id, game.year+2, game)` and flagging phases that
     the existing auto-nav effects would land on (draft pool present,
     era event pending, etc.).
10. **[Locked]** A prominent **"Continue to {year+2}"** button at the
    bottom advances to the next turn (calls the standard `advance()`).
11. **[Locked]** End-of-half-term page is **scenario-agnostic** — runs
    for both 1772 and 1856. (The half-term wrap-up is universally
    useful; the spike groups it with the 1772 pass because that's where
    the polish is happening, but no scenario-gating.)

**Auto-nav useEffect passes (all in `App.tsx`)**

12. **[Open @ CP2, recommend ADD parallel effects]** New auto-nav
    effects map phase ids to page ids using the same year+phaseId ref
    sentinel pattern as the existing six. The architect chooses between:
    - **(A) ADD 10 more parallel `useEffect`s** alongside the existing
      six (zero refactor risk; `App.tsx` grows ~120 lines).
    - **(B) REFACTOR all to a single phase→pageId map + one
      dispatcher** (cleaner but presumes the final phase→page map is
      stable enough to merit centralization).

    **PM recommendation: (A)** for this PR. Premature centralization
    risk outweighs the duplication cost while the table is still
    growing.
13. **[Locked]** New auto-nav table:
    - `2.4.1` → `deathsRetirements` (covered by AC #1)
    - `2.4.2` → `anytimeEvents`
    - `2.4.3` → `eraEvents`
    - `2.5.1` → `meters`
    - `2.5.2` → `governors`
    - `2.6.1` → `legislation`
    - `2.6.2` → `legislation`
    - `2.6.3` → `legislation`
    - `2.7.1` → `diplomacy`
    - `2.7.2` → `revWar` **only when `game.revolutionaryWar?.active`**
    - `2.2.1` → `congress`
    - `2.2.2` → `congress`
    - `2.2.3` → `factionLeader`
    - `2.9.5` → `elections`
    - `2.10` → `endOfHalfTerm` (covered by AC #7)
14. **[Locked]** Each new effect uses the **same year+phaseId key**
    sentinel pattern: it triggers exactly once per (year, phaseId)
    combination per session, so a player who clicks away from the
    page is not yanked back.
15. **[Locked]** Auto-nav **never overrides** the existing draft (AC
    on `2.1.1`), career-track (`2.1.2`), relocation (`2.1.4`),
    ideology (`2.1.5`), conversion (`2.1.6`), kingmaker (`2.1.7`),
    or CC-builder (`2.9.6`) effects — those win when both would fire.

**Auto-resolved era event acknowledgement**

16. **[Open @ CP2, recommend acknowledgement modal]** Auto-resolved
    era events (`decider: 'auto'`) currently fire silently. They must
    now surface to the player. **Two options:**
    - **(A) Reuse `EraEventModal`** with the modal in read-only mode
      (no response buttons; just title, description, the
      auto-chosen response and its effect chips, plus a single
      "Acknowledge" button that dismisses).
    - **(B) Top-of-page toast** — a one-row notification at the top of
      whatever page the player is on, with title + "click to expand".

    **PM recommendation: (A) — modal with Acknowledge button.** The
    1772 spine (Gaspee, Tea Act, Boston Tea Party, Intolerable Acts,
    Lex & Concord, Declaration of Resolves, etc.) is the **story** of
    the scenario; toasts are too easy to dismiss without reading.
    Modal preserves the existing component and just hides the
    response-selection row when there's only one auto-chosen response.
17. **[Open @ CP2, recommend queue-and-show-one-at-a-time]**
    **Multiple auto events in the same phase.** The engine resolves
    auto nodes in a `while` loop (`phaseRunners.ts:2369`), so 3+
    events can fire in a single `runCurrentPhase` call. The
    acknowledgement modal must **queue** these and present them one
    at a time. PM recommendation: when `runPhase_2_4_3_Era` returns
    after resolving N auto events, the engine returns a list of
    resolved events to the UI layer (a new `result.acknowledgements:
    EraEvent[]` field on the phase-run result), and the
    `GameContext` walks the queue, surfacing one modal at a time.
    Architect must wire the engine-side return shape.
18. **[Locked]** The acknowledgement modal does **not** appear for
    terminal-ending nodes (`triggersGameEnd: true`). Those flow
    directly to the Campaign-Over recap (Spike 3); a modal in the
    middle would be redundant.
19. **[Locked]** The acknowledgement modal shows: event title, year,
    description, the **engine-chosen response label**, the response's
    effect chips, and a single "Acknowledge" button. No alternate
    responses are shown (the AI already picked).

**Era Progress timeline polish (Dashboard)**

20. **[Locked]** `EraTimeline.tsx` updates each milestone chip's
    visual state:
    - **Completed**: green background, white check icon, **year
      stamp below the label** (e.g., "Tea Act" + "1773"). Year comes
      from the matching `EventEntry` (`category: 'event'`,
      `meta.templateId === milestone.templateId`).
    - **Current/next**: amber background with a pulsing border;
      determined as today (the first not-yet-completed milestone
      after a completed one).
    - **Future**: muted slate; today's behavior preserved.
21. **[Locked]** The timeline reads left-to-right with arrows
    between chips (preserved). On hover/tap, each completed chip
    shows a tooltip with the resolved response text
    (`EventEntry.text`).
22. **[Locked]** Timeline behavior is unchanged for 1856 (the
    component is already gated to 1772 via
    `scenarioId === '1772'`).

---

### Spike 2 — Inaugural-Draft Signage

23. **[Locked]** The Draft page header (`src/pages/Draft.tsx`) checks
    `g.year === g.startYear`. When true, the title reads
    **"Inaugural Draft — {year}"** (today: "Draft — {year}").
24. **[Locked]** Below the title (in the same header block), an
    **amber banner subtitle** renders, with this copy:
    > "The founding generation. These are the marquee historical
    > figures of pre-revolutionary America, drafted onto factions in
    > snake order. From {startYear + 4} onward, drafts will be
    > smaller classes of newly-eligible rookies (born ~25 years ago)."
25. **[Locked]** Next to the header (right-aligned), a small **pill
    badge** shows **"INAUGURAL"** when `year === startYear`,
    otherwise **"ROOKIE"**. The pill is amber for inaugural, slate
    for rookie.
26. **[Locked]** The heuristic is **scenario-agnostic** — it uses
    `g.year === g.startYear`, so it generalizes to the 1856 scenario's
    inaugural draft. (Per vision: 1856 won't be playtested in this
    PR; the heuristic is the only assertion.)
27. **[Locked]** No changes to draft mechanics (snake order, pool
    composition, simulation buttons). Visual signage only.

---

### Spike 3 — Campaign-Over Recap

28. **[Locked]** The existing `GameOverScreen` component is
    **replaced** by a fuller recap. Same gate (`snapshot.game.gameEnded`
    triggers it from `App.tsx:161`), but the body becomes a
    multi-panel retrospective.
29. **[Locked]** Top banner: **"Campaign Over — {year}"** with the
    terminal node's title as the headline, then a one-line subtitle
    derived from the ending: "Played as {factionName} ({partyId})
    from {startYear} to {year}."
30. **[Locked]** **Panel 1 — Final faction snapshot**:
    - **Faction PV total** (sum of `pvCache` over your
      faction's living members)
    - **Top 5 politicians by PV** (name, state, PV, current office
      if any)
    - **Faction-strength tally** (member count vs. starting roster
      size, with delta)
    - **Ideology alignment chart** (count by 7-point ideology
      across your faction's living members; horizontal bar chart
      reusing existing patterns)
    - **Key losses** — up to 5 politicians who died or retired
      during the campaign, ranked by **peak PV** they reached
      (closest reasonable proxy to "most-missed talent"). If
      computing peak PV is too hard from the snapshot, fall back to
      "highest current/final PV among the dead/retired."
31. **[Locked]** **Panel 2 — Your faction's defining decisions**:
    - Chronological list of every **era-event response your faction
      chose**. Source: `snapshot.events` filtered to
      `category: 'event'`, `meta.eraEvent === true`,
      `meta.aiResolved === false` (the player resolved it).
    - Each row: year, event title, response label, the response
      effect text (one line).
    - If the campaign had **zero player-resolved era events** (rare
      — playing as a faction without CC-president for the entire
      run), the panel shows "Your faction's voice was rarely
      heard in the great debates." as a flavor empty state.
32. **[Locked]** **Panel 3 — Era timeline**:
    - The same `EraTimeline` component (with AC #20 polish) showing
      every completed milestone, year-stamped.
    - Below it, a small **"Alt-history branches taken"** list —
      lists templates not on the historical spine (the
      `realEvent === false` nodes from `eraEvents1772.ts`) that
      were resolved during the campaign, with their chosen
      responses. Source: `snapshot.events` cross-referenced
      against `ERA_GRAPH_1772` `realEvent` field.
33. **[Locked]** **Panel 4 — Historical contrast** (the one piece
    of era content this spec touches):
    - The contrast line copy is **the historian's pre-researched
      text**, verbatim, keyed off `game.gameEnded.templateId`:
      - `lost_war` → historian's "Defeat and Reabsorption" line
      - `dominion_autonomy` → historian's "Autonomy Within the
        Empire" line
      - `confederation_remains` → historian's "The Confederation
        Endures" line
      - **no terminal node** (game ended via some other path,
        e.g., the existing time-out story) → historian's generic
        fallback line
    - Styled as an italicized blockquote with the framing "In your
      timeline…" preserved from the historian's text.
34. **[Locked]** **Panel 5 — Buttons row** at the bottom:
    - **New Game** — same behavior as today (`resetGame()` + reload).
    - **Replay Same Scenario** — **new**: clears DB and calls
      `startNewGame(playerFactionId, scenarioId)` with the **same
      faction and scenario** the player just finished. See AC #36.
    - **Export Save** — calls existing `exportSave()` (which already
      returns JSON; UI triggers a file download via a Blob URL).
35. **[Locked]** The recap is **scrollable on small screens**; the
    panels stack vertically below md breakpoint.
36. **[Open @ CP2, recommend reuse existing signature]** **Replay
    Same Scenario** button uses `startNewGame(factionId, scenarioId)`
    — which **already exists** on the context with the right signature
    (`GameContext.tsx:24`). No engine work needed. Architect to
    confirm the call sequence: `clearDb()` → `build*Scenario()` →
    `saveSnapshot()` is internal to `startNewGame` already. **If
    confirmed, this AC is Locked.**

---

## F-numbered Facts (binding design decisions)

Override the vision if it disagrees. These were locked at CP1.

- **(F1)** This pass is **presentation-layer only** (plus the
  per-turn delta tracking required by the End-of-Half-Term page).
  No engine rule changes; no PV formula changes; no draft
  mechanics changes.
- **(F2)** Auto-resolved era events surface via the **existing
  `EraEventModal` reused in read-only "Acknowledge" mode** (not a
  toast). The 1772 spine is the story; the player must see it
  fire. (Override of any future hand-wave to a toast.)
- **(F3)** The auto-nav refactor (Spike 1 ACs #12–#15) **ADDS
  parallel `useEffect`s** rather than centralizing into a single
  dispatcher. A centralization refactor is explicitly punted.
- **(F4)** The Inaugural-Draft signage heuristic is
  `year === startYear` — scenario-agnostic by construction.
  1856 verification is out of scope, but the heuristic must not
  hard-code "1772" or "1856."
- **(F5)** The Campaign-Over historical-contrast copy is **the
  historian's text verbatim**, including the "Historically… In
  your timeline…" structure. Do not paraphrase.
- **(F6)** Terminal-ending nodes (`triggersGameEnd: true`) **skip
  the acknowledgement modal** and flow straight to Campaign-Over.
- **(F7)** The End-of-Half-Term page runs for **both scenarios**
  (1772 and 1856). It is scenario-agnostic by design. The other
  Spike 1 surfaces (Deaths page, auto-nav effects, era timeline
  polish) are also scenario-agnostic; only the era-event
  acknowledgement modal and the Era Progress polish are
  currently 1772-only-relevant by data shape (no `decider: 'auto'`
  events in 1856 today).
- **(F8)** Deaths & Retirements page uses **the most recent 2.4.1
  run's results only** — does not aggregate historical
  deaths/retirements. (Half-term-scoped, not campaign-scoped.)

## Open Questions (architect, CP2)

Highest-risk first.

1. **(Highest risk) Per-turn delta tracking for the
   End-of-Half-Term page.** The engine has no existing concept of
   "start-of-turn snapshot." Architect must choose between:
   - **(A)** A `prevSnapshot: Pick<FullGameSnapshot, 'game' |
     'politicians' | 'factions'>` field captured at the top of
     each `advancePhase` that wraps a turn.
   - **(B)** A structured `game.halfTermSummaries:
     HalfTermSummary[]` array built incrementally during the
     turn, where each phase runner pushes its key events and
     deltas into the current half-term's summary entry.

   **PM recommendation: (B)**. Smaller autosave payload; naturally
   matches the page's "key events fired this half-term" section.
   Architect to design the `HalfTermSummary` shape and confirm.
2. **Auto-nav effects — add 10 parallel `useEffect`s vs.
   centralize into one phase→page map.** PM recommends
   **ADD parallel** (F3) per the vision; architect may override if
   the duplication smells worse than the centralization risk.
3. **Era-event acknowledgement queue mechanism.** The engine
   resolves multiple auto events in a tight `while` loop
   (`phaseRunners.ts:2369`). The acknowledgement modal must queue
   them and present one at a time. PM recommends the engine return
   `result.acknowledgements: EraEvent[]` from
   `runCurrentPhase`; the `GameContext` walks the queue,
   surfacing one modal at a time. Architect to confirm shape.
4. **Cause-of-death derivation — log scraping vs. new
   `Politician.deathCause`/`retireCause` field.** PM recommends
   log-derived (no engine schema change). Architect may add the
   fields if log-scraping is fragile (the 2.4.1 / 2.7.2 / 2.4.2
   matrix is small enough that scraping should be fine).
5. **"Replay Same Scenario" button** — PM recommends reusing the
   existing `startNewGame(factionId, scenarioId)`. Architect to
   confirm the in-context call clears DB cleanly without the
   reload that the **New Game** button does today
   (`GameOverScreen.tsx:17–19`).
6. **Auto-nav for `2.7.2` (Military) is gated on
   `revolutionaryWar?.active`.** Confirm the engine never lingers
   on 2.7.2 when the war is inactive (`phases.ts:134` already
   skips it, so the page should never auto-nav there in that
   state — but if the war ends mid-phase, what then?). PM
   recommendation: trust the existing skip predicate.
7. **Era Progress timeline year stamps** — the milestone-template
   IDs in `EraTimeline.tsx` must reliably map to `EventEntry`
   entries with `meta.templateId`. Confirmed `meta.templateId` is
   set at `phaseRunners.ts:2397` for resolved era events. Should
   be safe; architect to verify.
8. **Empty Deaths page does not feel like dead weight.** PM
   wants the page to auto-nav even on empty (AC #5) — reassures
   the player that 2.4.1 ran. Architect/designer can override if
   they think it's worse UX; recommend keeping the empty state
   per F8.

## Edge cases

- **Turn 1 of a new game** — there are no deaths or retirements
  yet, and the End-of-Half-Term page has no prior snapshot to
  diff against. The Deaths page shows the empty state (AC #5);
  the End-of-Half-Term page shows meter values without deltas and
  a "First half-term complete" framing.
- **Multiple half-terms with zero player input** (player
  simulates several turns via the existing "advance" loop). The
  auto-nav effects still fire on each new (year, phaseId)
  combination, so the player sees the surface for each turn even
  if they're just clicking Continue.
- **Game ends mid-turn** (e.g., `lost_war` fires during 2.4.3).
  The Campaign-Over recap appears immediately; the
  End-of-Half-Term page is **skipped** for that turn (the recap
  supersedes it). Acknowledgement modals queued behind the
  terminal node are dropped (per F6).
- **Auto-resolved era event that the player previously had a
  chance to respond to** (e.g., the player abdicated the
  CC-president and an AI resolved a `cc-president` decider
  event). The acknowledgement modal still fires per AC #16; the
  modal copy should make clear "Your CC President [AI faction
  name] chose: {response}" — wording to be finalized at
  implementation, with the architect's input. Open.
- **Save/reload mid-acknowledgement-queue.** The queue lives in
  React state (not the snapshot), so a reload drops queued
  acknowledgements. PM accepts this — the events are already
  resolved in the engine and visible in the Era Events page; the
  modal is purely a presentation nicety. (If the architect wants
  to persist the queue, it's an extra field on `game` like
  `pendingAcknowledgements: string[]`.)
- **Inaugural-draft signage on a save loaded mid-draft.** The
  check is `g.year === g.startYear`, so a mid-draft save still
  shows INAUGURAL signage on resume. Correct.
- **Era Progress timeline year stamps when a milestone's
  `EventEntry` is missing** (corrupted save, manual JSON edit).
  Fall back to no year stamp; do not crash. Defensive render.

## Out of Scope

Per the vision; locked here.

- **PV/skill tooltip pass on the Draft page.** Future feature.
- **1856 scenario verification.** Spike 2's `year === startYear`
  heuristic generalizes by construction; not playtested in 1856
  for this PR.
- **`PartyBadge` D/R label leak on the read-only CC page.**
  Separate cleanup feature.
- **Single-dispatcher refactor of all per-phase auto-nav
  `useEffect`s.** Per F3, premature optimization until the final
  count is stable.
- **Engine rule changes** (PV formula, draft mechanics, era-event
  resolution logic). Presentation only (F1).
- **Persisting the era-event acknowledgement queue across
  reload.** Accepted loss; modal is presentation, not state.
- **New era content** — no new events, no new historical figures,
  no new milestones. Historian's binding facts (H1, H2, H3)
  govern.

## Definition of Done

- `npm run build` passes.
- New pages `deathsRetirements` and `endOfHalfTerm` registered in
  `src/pages/registry.ts` and render without errors for both
  scenarios.
- All 10 new auto-nav `useEffect`s in `App.tsx` trigger exactly
  once per (year, phaseId) combination per session.
- Playing through a 1772 scenario to a terminal node (any of
  `lost_war`, `dominion_autonomy`, `confederation_remains`)
  shows the Campaign-Over recap with the correct historian's
  contrast line.
- An auto-resolved era event (e.g., the Boston Tea Party in
  1773) opens the acknowledgement modal exactly once and
  dismisses cleanly with the Acknowledge button.
- When 3+ auto events fire in a single phase, the
  acknowledgement modal queues them and the player sees each
  one in turn.
- The Inaugural-Draft header shows on year `startYear` of both
  the 1772 and 1856 scenarios; the rookie header shows on every
  later draft year.
- The Era Progress timeline shows year stamps for completed
  milestones (sourced from the `EventEntry.year` of the
  resolution log line).
- The End-of-Half-Term page shows meter deltas, top PV
  winners/losers, faction-strength deltas, and a next-turn
  preview at every 2.10 visit.
- The Deaths & Retirements page renders the most-recent half-term's
  deaths/retirements, including the demographic mini-chart, and
  the empty state on turns with zero events.
- **Playtest** (per CLAUDE.md "Definition of done"): launch
  `npm run dev`, play through at least one half-term in 1772
  and confirm every Spike 1 auto-nav lands on the right page.
  Force a Campaign-Over by editing a save or playing to a
  terminal node; confirm the recap renders all 5 panels.
