# Spec: Draft Module Redesign (Full-Page Draft / Scouting / History)

## Vision (as given)
Replace the popup `DraftModal` with a full-page Draft module accessible from the
sidebar in all phases. The sidebar "Draft" entry resolves to one of three sister
pages that share a top tab bar:

1. **Draft** — the live draft for the current year. Available only during the
   draft phase; shows undraftable pool, picks side-by-side, and lets the player
   sim picks. Opens automatically when the draft phase begins.
2. **Draft Scouting** — the default landing tab outside the draft phase. Shows
   the next several upcoming draft classes (3 future years) with full stats so
   the player can plan. Prev/Next year navigation.
3. **Draft History** — past draft results year-by-year, with summary stats and
   the player's picks highlighted.

Inspiration: basketball-gm.com's Draft / Draft Scouting / Draft History trio.

## Player experience
The draft is the most consequential recurring decision the player makes — it's
where rosters are built. Today it's locked behind a modal that only appears
mid-turn, so the player has no way to plan ahead or reflect afterward. The new
module makes the draft a *place* in the game: between draft years they scout the
next class, during a draft year they execute their picks on a focused page, and
after the draft they can revisit any prior class to see how their decisions
played out. This turns the draft from a forced popup into a strategic ritual.

## User story
As a faction-running player, I want a persistent Draft section in the sidebar
that opens to the live draft during draft phases and to scouting between them,
so I can plan future classes, execute picks without a modal, and revisit my
draft history.

## Acceptance criteria

### Sidebar & navigation
- [ ] A new "Draft" entry appears in the sidebar in **every phase** (not gated
  by `lastDraftYear` like the current "Draft Summary" entry). It lives in the
  "Your Faction" section.
- [ ] Clicking the sidebar "Draft" entry routes to one of the three sister
  pages, defaulting based on game state: **Draft** if the current phase is
  `2.1.1` and there are active picks, otherwise **Draft Scouting**.
- [ ] All three sister pages render a shared tab bar at the top with three
  tabs: `Draft` / `Draft Scouting` / `Draft History`. The Draft tab is disabled
  (greyed, with a tooltip "No draft in progress") when the current phase is not
  `2.1.1` or the draft pool is empty.
- [ ] The old "Draft Summary" sidebar entry is removed; the `DraftSummary` page
  is either removed or repurposed as the per-year content inside Draft History.

### Auto-navigation on entering draft phase
- [ ] When the game advances *into* phase `2.1.1` and the player faction has at
  least one upcoming pick in `draftRoundOrder`, the app navigates the user to
  the Draft tab automatically — replacing the current popup modal behavior.
- [ ] Auto-navigation fires once per draft entry (tracked transiently in React
  state; not persisted). If the player navigates away mid-draft, the app does
  not yank them back; the sidebar pulse/badge (see below) is sufficient.
- [ ] The popup `DraftModal` is removed. The `modal: 'draft'` branch in
  `GameContext` is replaced with a navigation side-effect.

### Draft page (live draft)
- [ ] Header strip shows: current pick number (`Round X, Pick Y` and overall
  pick #), current faction on the clock, next pick faction, and "You're up in N
  picks" (or "You're on the clock" / "Draft complete").
- [ ] Action buttons:
  - **Sim one pick** — runs the next pick (CPU pick if not the player; if the
    player is on the clock the button is disabled).
  - **To my next pick** — runs CPU picks until the player faction is on the
    clock or the draft ends.
  - **To end of draft** — runs all remaining picks. If a player pick is
    encountered, it must auto-pick the highest-PV available politician for the
    player's faction (treated as "best available") and continue. A confirm
    dialog warns the user before auto-picking on their behalf.
- [ ] Two side-by-side tables fill the page body:
  - **Undrafted Pool** (left) — every politician currently in
    `pendingDraftPool`. Columns: # / Name / State / Age / Ideology / PV / Adm /
    Leg / Jud / Mil / Gov / Bck / Cmd / Traits / Draft button. Sortable by any
    numeric column (default PV desc). A search box filters by name/state.
  - **Draft Results** (right) — one row per pick slot. Filled rows show pick #,
    round, faction (PartyBadge + name), politician name + state + PV. Unfilled
    rows show pick # and the faction on the clock with a "Sim to pick" button
    that fast-forwards CPU picks up to but not including that slot.
- [ ] The "Draft" button on a pool row is enabled only when the player faction
  is currently on the clock; otherwise it is disabled with a tooltip "Not your
  pick".
- [ ] When the player drafts, the row is removed from the pool, added to
  Results, and any subsequent CPU picks autoresolve up to the next player pick
  (same behavior as today's `draftPick` callback).
- [ ] When the draft ends (pool empty or `draftRoundOrder` exhausted), the
  page shows a "Draft complete" banner with a "Continue to next phase" button
  that calls `advance()`.
- [ ] An "Empty pool" state shows a "Continue" button identical to today's
  fallback in `DraftModal`.

### Draft Scouting page
- [ ] Intro paragraph (one or two sentences) explains that these are the
  upcoming draft classes drawn from the standard historical dataset (or the
  player's imported CSV) and that ratings may shift slightly when politicians
  are instantiated. Mentions that only politicians whose home state is in the
  Union can actually be drafted (matches existing `instantiateDraftees` rule).
- [ ] Prev / Next buttons step the *starting* year of the visible window by 4
  years. Out-of-range navigation is disabled.
- [ ] Three columns side-by-side, one per upcoming draft year, each showing
  the year header and a table of candidates with columns: # / Name / State /
  Age (at draft) / Ideology / Projected PV / Adm / Leg / Jud / Mil / Gov / Bck
  / Traits. Sort default: projected PV desc.
- [ ] Default visible window starts at the next draft year strictly *after*
  `snap.game.year` (e.g. if year is 1858, show 1860/1864/1868).
- [ ] Candidate source: `STANDARD_DRAFT_CLASSES` overlaid with
  `game.customDraftClasses` (custom takes precedence when same name+year),
  filtered to `draftYear === Y`. Projected PV is computed from the same fields
  `computePV` consumes on the rookie shape (no current office, no traits
  bonuses beyond what the data carries) so it matches what they'll show with
  on draft day.
- [ ] Candidates whose home state is not yet in the Union are visually marked
  (greyed row + "Not yet admitted" badge) so the player understands they may
  be held back at draft time.
- [ ] Each column has an "Export class" button (downloads JSON of that year's
  candidates) — Import is **out of scope** for v1 to avoid overlapping with
  the existing Settings import.

### Draft History page
- [ ] Header: `Draft History — <year>` with prev/next year buttons and a
  "Jump to year" dropdown listing every year for which a draft has occurred.
- [ ] If no drafts have occurred yet, shows an empty state explaining "No
  drafts have been held yet."
- [ ] Summary stats strip across the top (AMPU-appropriate, not BBGM's):
  - **First pick** — politician name, state, PV at draft.
  - **Highest PV today** — politician with the highest current `pvCache`.
  - **Most offices** — politician with the most distinct offices held
    historically (may need to count from event log or default to "current
    office is most prestigious").
  - **Presidents from class** — count of class members who have served as
    President at any point.
  - **Cabinet members from class** — count who have held any cabinet office.
  - **Deceased** — count who have died.
- [ ] Main table: one row per pick, columns grouped under three headers:
  - **At Draft**: Pick # / Faction / Name / State / Age / Ideology / PV / Adm
    / Leg / Jud / Mil / Gov / Bck
  - **Current**: Age / Current office / Current PV / Status (Active / Retired
    / Deceased)
  - **Career**: Highest office held / Years served (sum of `careerTrackYears`
    + office tenure if tracked; otherwise omit Years served and call this out
    as scope-trim)
- [ ] Picks made by the player's faction are highlighted with a coloured row
  background.
- [ ] "Export class" button downloads the year's draft results as JSON.

### State-shape changes (call out for architect)
- [ ] **New persisted field** on `GameState` to record draft history:
  `draftHistory: { year: number; picks: { pickNumber: number; factionId:
  string; politicianId: string }[] }[]`. Populated when a pick is made (both
  player and CPU paths). This is required because today only the *winning*
  faction is recorded on the politician (via `factionId` + `draftedYear`); the
  pick *order* is lost, which Draft History needs to render rounds properly.
- [ ] A snapshot repair step (in `GameContext.repair`) backfills
  `draftHistory` from `politician.draftedYear` + `factionId` for legacy saves,
  using PV-desc as a best-effort ordering when the true pick order is gone.

## Edge cases
- **1772 inaugural draft**: the inaugural seed is dataset-driven and runs even
  though `year === startYear`. The Draft page must work for this case (it
  already shares `pendingDraftPool` / `draftRoundOrder`).
- **Stuck draft repair**: `GameContext.repair` already drains a draft schedule
  with no eligible politicians. The Draft page must show the "Empty pool"
  empty state when this happens between sessions.
- **Custom imported draft class**: when `game.customDraftClasses` is set, the
  Scouting page must show the player's imports (precedence over standard) for
  matching years.
- **Non-draft years**: in `1856` and similar 2-year-turn scenarios, draft
  years occur every 4 years. Scouting must skip non-draft years entirely; the
  prev/next stepping moves by 4.
- **Held-back draftees**: politicians whose home state isn't admitted yet are
  not instantiated. Scouting still lists them (greyed); Draft does not (they
  never enter `pendingDraftPool`).
- **Mid-draft save/load**: the page must render correctly when loaded into an
  in-progress draft — i.e. read from `pendingDraftPool` + `draftRoundOrder`
  and the partial entries in `draftHistory[currentYear]`.
- **CC delegate draft (1772)**: the 1772 expansion draft uses faction
  ideology constraints. The "best available" auto-pick used by the
  **To end of draft** button must respect those constraints when picking on
  behalf of the player (reuse the existing CPU scoring logic).
- **Pool exhausted but order remains**: existing engine drains and logs; UI
  surfaces the "Draft complete" banner.

## Out of scope
- A potential rating ("Pot") column. AMPU has no peak-projection model and
  inventing one would be a balance-affecting change.
- A position ("Pos") column. AMPU has no clean equivalent — career track is
  unset for rookies and primary skill is already visible.
- CSV/JSON *import* on the Scouting page. Settings already has the dataset
  import flow; duplicating it would split the source of truth.
- Comparison tool ("Compare top N prospects") from BBGM — defer to v2.
- Manual reordering of the draft order or trading picks.
- Mobile-specific layout polish; the side-by-side tables assume desktop
  widths.

## Open questions / assumptions

### Riskiest first
- **State-shape change for draft history persistence**: I am assuming the
  architect will add a `draftHistory` field to `GameState` (see above). Without
  this the History page can only show the most recent draft (today's
  `lastDraftYear` behavior). Confirm at checkpoint whether to ship this or
  scope History down to "most recent draft only" for v1.
- **Auto-navigation policy**: I'm assuming the app navigates to the Draft tab
  **once per entry** into phase `2.1.1`, and never yanks the user back if they
  leave. Alternative would be "always navigate while it's the player's turn,"
  which is more aggressive.
- **"To end of draft" auto-picking for the player**: I'm assuming the button
  auto-picks the highest-PV-in-faction-lane available politician for the
  player (mirroring the CPU scoring) after a confirmation dialog. The
  alternative is to disable the button when the player still has picks left.
- **Removal of `DraftModal`**: I'm assuming we delete the component entirely
  and remove the `{ type: 'draft' }` variant from `GameContext.Modal`. No
  fallback. The architect should confirm there is no other call site.

### Other assumptions
- **Scouting window size**: 3 upcoming draft years shown side-by-side (matches
  the BBGM reference and AMPU's 4-year draft cadence covers a 12-year horizon).
- **Draft Summary page**: deleted; its UX is subsumed by the History page's
  per-year view (the player's picks are highlighted there). The sidebar entry
  goes away.
- **Sim controls map to existing engine functions**: "Sim one pick" calls
  through a new `simOneDraftPick` helper that runs one CPU iteration of
  `runPhase_2_1_1_Draft`. "To my next pick" and "To end of draft" loop on it.
  These do not require new engine math, only loop control — architect to
  confirm shape.
- **History row highlighting**: player's faction picks highlighted with the
  same emerald accent already used in `DraftSummary`.
- **Export format**: JSON for both Scouting and History. CSV could be added
  later if asked.
- **Projected PV vs. realized PV**: Scouting uses `computePV` on the raw
  `ImportedDraftee` (no office, no career track) to match draft-day reality.
  Slight mismatch (e.g. age-at-draft vs. age-now) is acceptable and
  explained in the intro paragraph.
- **Tab disabled state**: tabs are visible but the Draft tab is greyed when
  no draft is active, rather than hidden, so the player learns the structure.
- **"Most offices" stat**: AMPU does not track historical office tenure
  per-politician today; for v1 we may fall back to "highest current office"
  for that summary stat. Architect to confirm whether to add tenure tracking
  now or defer.
