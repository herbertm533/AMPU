# Spec: First Continental Congress Builder (Phase 2.9.6, 1772 scenario)

> Turns the existing silent `assembleCC` post-effect (auto-fired from
> `intolerable_acts` in `eraEvents1772.ts:107`) into a **watched, state-by-state
> interactive build** that runs as phase **2.9.6** when (a) the Intolerable Acts
> have resolved with "Convene the First Continental Congress" chosen and (b)
> the year is at least 1774. The player picks delegates for states their faction
> dominates; AI factions auto-pick everywhere else and you watch it happen.
> CC-President selection is **out of scope** — that already lives at 2.2.1
> (1774). Inaugural build only — Second-CC follow-on is out of scope.

## Vision (as given)

Phase 2.9.6 (Congressional Elections) acts as the **First Continental Congress
builder** for the 1772 scenario, gated on the Intolerable Acts era event firing
AND the "Create the Continental Congress" response being chosen. Delegate
counts: Big (4) = PA, MA, VA, MD; Medium (3) = every other state; Small (2) =
GA, RI, DE, NH. The faction with the most politicians from that state chooses
its delegates; eligibility requires `legislative >= 1` from that state, with a
fallback to any state politician. Cross-faction / cross-party allowed.
Career-track politicians lose their track if they accept (may decline). AI
tiers: T1 own faction, T2 same-party closest ideology, T3 other-party
"crossable" ideology. Occasional wild-card departures from this logic. UX: a
new page/section where the player watches the phase happen state-by-state,
picks for player-controlled states, and sees AI picks with tier badges; CC
roster summary at end. CC President is OUT OF SCOPE (handled at 2.2.1 in 1774).

## Historical grounding (binding)

Source: `docs/research/first-continental-congress-historical-context.md`. The
historian's six binding facts are hard constraints on the design and are
re-stated as concrete acceptance criteria below:

- **(F1) Convening gate:** First CC convened Sept 5, 1774. Gate on
  `year >= 1774 && eraEventsCompleted.includes('intolerable_acts') &&
  intolerable_acts chosenResponseId === 'ok'` (the "Convene CC" option).
- **(F2) Georgia did not attend.** The user's spec gives GA 2 reps — flagged at
  CP1, recommend **honor history** (exclude GA from inaugural build, fold in
  later for Second CC, out of scope here).
- **(F3) Counts are a defensible but rough abstraction.** PA/MA/VA/MD as "Big"
  underweights NY/NJ/SC; the spec **keeps the user's existing counts**
  (already encoded in `states1772.ts` via `colonySize` + `ccDelegateSlots`) and
  surfaces an Open Question in the UI debrief noting the abstraction.
- **(F4) Selection was by assemblies / extra-legal conventions / committees**,
  not by "parties." The faction-most-politicians rule is the abstracted
  mechanic; **UI strings** must use period-correct framing
  ("The Virginia Convention selects…", "The Connecticut House selects…").
- **(F5) NO First-Party-System labels** in the UI. Delegate chips show
  **colony + name + AMPU faction badge + ideology**, plus optional derived
  Patriot/Moderate/Loyalist flavor band. Never "Federalist,"
  "Anti-Federalist," "Democrat," or "Republican." Internal faction IDs
  (`PARTIES_1772` BLUE/RED) stay in code but are never surfaced as party
  labels on First-CC UI.
- **(F6) "May decline" is well-grounded** (Bowdoin/health, Galloway,
  Randolph mid-session). The career-track-disruption mechanic stands as
  designed.

## Player experience

The player has built up their faction's roster across 1772 and steered the
Boston-Tea-Party-to-Coercive-Acts spine. The Intolerable Acts resolve and the
game advances into 1774. Instead of the existing silent auto-build, phase
2.9.6 opens a new **Continental Congress Builder** page that walks colony by
colony in alphabetical order. For each colony the UI announces the selecting
body ("The Pennsylvania Assembly selects…") and shows the candidate pool with
faction/ideology/skills. If the player's faction dominates that colony, they
pick delegates one slot at a time, accepting or declining career-track-invested
candidates via modal. Otherwise the AI picks, each pick stamped with a **tier
badge** (T1/T2/T3/Wild) explaining the logic. At the end a CC roster summary
shows all delegates grouped by colony, plus a tier/faction breakdown. The
tension: **which of your top politicians do you spend on Philadelphia versus
keep on track for what comes after?**

## User story

As the player of the 1772 scenario, after I resolve the Intolerable Acts by
choosing "Convene the First Continental Congress," I want to step through
phase 2.9.6 colony by colony and personally choose my faction's delegates
(while watching AI factions pick theirs with explained reasoning), so that
seating the inaugural Continental Congress feels like a participatory political
event with real opportunity-cost decisions instead of a silent state update.

## Acceptance criteria

Each AC tagged `[Locked]` (historian/user fact, baked in) or `[Open @ CP1]`
(user must approve at checkpoint; recommendation listed in Risks).

**Gating and trigger**
1. **[Locked]** Phase 2.9.6 runs **only** when all three are true:
   `snap.game.scenarioId === '1772'`, `snap.game.year >= 1774`,
   `snap.game.eraEventsCompleted.includes('intolerable_acts')` AND the
   resolved `intolerable_acts` event chose the `ok` response (F1).
2. **[Locked]** When the gate is not met, 2.9.6 is silently skipped in the
   independence era (preserves existing behavior at `phases.ts:108`).
3. **[Open @ CP1, recommend gate-swap]** When the gate IS met, 2.9.6's
   independence-era behavior **entirely replaces** the existing
   House/Senate-elections logic (which has no 1772 meaning anyway). The 1856
   path of `runPhase_2_9_6_Congressional` is unchanged.
4. **[Locked]** The existing `assembleCC` post-effect (`phaseRunners.ts:2428`)
   becomes a **no-op when 2.9.6 will run** to avoid double-building. The CC
   is built **once**, by 2.9.6, in the same turn the Intolerable Acts
   resolved (the 2.4.3 → 2.9.6 cascade within one turn).

**Colony scope and delegate counts**
5. **[Open @ CP1, recommend honor history]** **Georgia is excluded** from the
   inaugural First CC: 12 colonies seat delegates, GA is skipped with the
   flavor line "Royal Governor James Wright suppresses the call; Georgia
   will join the Second Continental Congress." If the user picks the
   game-shortcut option at CP1, GA is included with its existing 2 slots
   and a flavor caveat. (F2)
6. **[Locked]** Delegate counts use the existing `ccDelegateSlots` values
   on each colony in `states1772.ts` (PA/MA/VA/MD=4; CT/NY/NJ/NC/SC=3;
   NH/RI/DE=2; GA=2 only if included). No re-balancing in this PR. The
   F3 abstraction caveat is surfaced as a one-line UI footnote on the
   roster summary, not in the body text.

**Eligibility and selection rule**
7. **[Locked]** Per colony, the **"selecting faction"** is the faction with
   the **most living, non-deceased politicians in that colony**. Eligibility
   for the pool: alive, not retired, has a `factionId`, `state === colony.id`,
   AND `skills.legislative >= 1`. (F4 mechanic.)
8. **[Locked]** **Fallback rule**: if fewer than `ccDelegateSlots` eligible
   politicians meet the legislative-1 floor in the colony, the pool falls
   back to **all living state politicians** regardless of `legislative`
   score. The selecting faction is still the colony's largest faction.
9. **[Open @ CP1, recommend aggregate-state-PV]** **Tiebreaker** when two
   factions tie for "most politicians in colony": the tied faction with the
   **highest aggregate `pvCache` of its politicians in that colony** selects.
   Deterministic and meaningful (mirrors `electCCPresident` precedent).
10. **[Locked]** Cross-faction and cross-party picks are allowed — the
    selecting faction can pick any eligible politician in the colony, not
    only their own members. AI tiers (below) implement how often this
    happens.

**Player picks (player-controlled colonies)**
11. **[Open @ CP1, recommend modal accept/decline]** When the selecting
    faction equals `snap.game.playerFactionId`, the engine returns
    `{ needsPlayer: true }` for that colony (draft-runner pattern,
    `phaseRunners.ts:82`). UI shows the colony header, period-correct
    selecting body name, ranked pool, and a slot counter. Player picks
    one delegate at a time.
12. **[Open @ CP1, recommend modal accept/decline]** If the picked
    politician has `careerTrack !== null` AND `careerTrackYears >= 1`,
    the UI shows an **Accept/Decline** modal naming the politician's
    track and years invested. On Accept: `careerTrack` and
    `careerTrackYears` are cleared. On Decline: the slot remains open
    and the politician is removed from this colony's pool for the
    remainder of this build.
13. **[Locked]** The player cannot reorder colonies, skip ahead, or leave
    slots empty: each colony resolves fully before the next begins.

**AI picks (non-player colonies)**
14. **[Locked]** AI selection ordering, per slot, walks tiers and picks
    the first match found:
    - **T1** — selecting faction's own members in colony, ranked by `pvCache`.
    - **T2** — same-party (same `partyId` as selecting faction's
      majority party), ranked by **closest ideology distance** to the
      selecting faction's `personality` band (`LW/Center/RW`), then by
      `pvCache`.
    - **T3** — **other-party but "crossable"**: ideology distance to
      the selecting faction's personality band is ≤ **2** steps on
      `IDEOLOGY_ORDER`. Ranked by ideology proximity, then `pvCache`.
15. **[Open @ CP1, recommend 12% per slot]** **Wild-card** roll fires per
    AI slot at **12% chance** (via `chance()` from `rng.ts`, seeded). On
    fire: AI picks a random eligible politician outside the tier the
    deterministic logic would have chosen, prioritizing un-picked names.
    Logged with a "Wild" badge and a one-liner reason ("an unexpected
    nod to the X-faction").
16. **[Locked]** AI decline for career-track-invested picks is
    **deterministic**: if the AI-selected politician has
    `careerTrack !== null` AND `careerTrackYears >= 4`, the AI **skips
    them** and falls through to the next match. (Mirrors the
    "one-tier-worth investment" floor.) No modal; logged as "decline."
17. **[Locked]** Each AI pick is stamped with a **tier badge** stored on
    the delegate record (`tier: 'T1' | 'T2' | 'T3' | 'Wild'`) so the
    UI can render it.

**Storage and data shape**
18. **[Open @ CP1, recommend structured array]** Extend the existing
    `CCDelegate` interface (already at `types.ts:563`) with optional
    `tier?: 'T1' | 'T2' | 'T3' | 'Wild' | 'Player'` and persist on
    `snap.game.continentalCongress.delegates`. (`stateId`, `politicianId`,
    `factionId` already exist.) No flat `delegateIds` array.
19. **[Locked]** Period-correct selecting-body labels are derived from a
    static map keyed by colony id (per historian: "Virginia Convention,"
    "Connecticut House of Representatives," "Pennsylvania Assembly," etc.)
    rendered in the UI body — not stored on the delegate. (F4)

**UI surfaces**
20. **[Locked]** A new page `continentalCongressBuilder` is registered in
    `src/pages/registry.ts` and is **the active page** while phase 2.9.6
    is gated-on for 1772. The existing read-only `ContinentalCongressPage`
    is untouched and continues to display the seated CC after the build.
21. **[Locked]** Each colony step shows: colony name, selecting-body
    flavor string, slot counter ("Selecting 2 of 4…"), and the eligible
    pool sorted by tier. Delegate chips display **colony abbr + first
    & last name + AMPU faction badge + ideology label**, plus a derived
    Patriot/Moderate/Loyalist flavor band where the ideology fits
    cleanly. **NO** `(Anti-)Federalist`/`Democrat`/`Republican` labels
    anywhere in this UI. **NO** `PARTIES_1772` BLUE/RED party color
    chips as party-affiliation badges (color-by-faction is fine). (F5)
22. **[Locked]** AI picks animate in one at a time with a tier badge and
    one-line rationale; the player can click "next colony" to advance.
    A "skip animation" toggle is acceptable but not required.
23. **[Locked]** End-of-phase **roster summary** shows all delegates
    grouped by colony, a faction tally, and the one-line F3 abstraction
    footnote. The summary also calls out the CC President will be
    chosen separately at phase 2.2.1 (so the player knows it's coming).

**Logging**
24. **[Locked]** Each delegate seated emits an `EventEntry` with
    `phase: '2.9.6'`, `category: 'appointment'`, text:
    `"{firstName} {lastName} ({COLONY}, {Faction}) seated to the First
    Continental Congress."` AI picks include the tier in `meta.tier`.
25. **[Locked]** Declines emit a `category: 'event'` entry:
    `"{Name} declines appointment to the Continental Congress."`
26. **[Locked]** A single capstone log at phase end:
    `"First Continental Congress seated: {N} delegates from {K} colonies."`
    The existing `assembleCC`-path capstone log (`phaseRunners.ts:2436`)
    is suppressed when 2.9.6 built it.

**Durability**
27. **[Open @ CP1, recommend durable-this-PR]** The seated First CC is
    **durable**: phase 2.9.6 does NOT re-fire on later election years
    while `intolerable_acts` is the most recent gating event. Year-over-year
    rebuilds (Second CC after Lexington & Concord, 1776+) are explicitly
    out of scope and tracked as a follow-on feature.

## Edge cases

- **Colony has 0 eligible politicians, even after fallback.** The colony is
  recorded with **0 delegates seated** and a flavor log: "No suitable
  delegates available — {Colony} sends no representatives this session."
  The roster summary surfaces this prominently.
- **Colony has only career-track-invested politicians with years ≥ 4 (AI).**
  The AI's deterministic skip exhausts the pool; the colony seats whoever
  the AI does *not* skip (lower-year-investment names first). If literally
  every eligible politician is at years ≥ 4, the AI **fills slots starting
  from the lowest-years-invested** with a logged "{Name} reluctantly
  serves" entry.
- **Player faction controls zero colonies** (no colony where they have the
  most politicians). All 12 colonies resolve AI; the player watches.
  Phase still runs to completion; engine never returns `needsPlayer:true`.
  Roster summary still ends the phase cleanly.
- **Player faction ties on "most politicians" with another faction in a
  colony.** AC #9 tiebreaker (aggregate state PV) decides. If the player
  loses the tiebreaker, that colony is AI-handled and the player watches.
- **A politician's home state changed earlier this turn** (2.1.4
  Relocations runs before 2.4.3 within the same turn; both run before
  2.9.6). The engine reads `politician.state` at 2.9.6 entry time — fine,
  no special-casing needed. Acceptance: a politician who relocated TO a
  colony in 2.1.4 IS eligible to be seated from that colony.
- **Save/reload mid-phase.** Standard autosave behavior covers this:
  partial `cc.delegates` array persists per the `GameContext` autosave
  pattern, the next colony resumes from where it stopped. **Open
  Question @ CP1:** what state holds "current colony cursor"? Recommend
  a transient `snap.game.ccBuilderCursor?: { colonyIdx: number;
  slotIdx: number }` field cleared at phase end. (Flagged for the
  architect to detail.)
- **Cascading from era-event resolve in the same turn.** Phase 2.4.3
  resolves `intolerable_acts` → that post-effect dispatcher runs (AC #4
  makes it a no-op when 2.9.6 will run later in the same turn) →
  phase walker advances to 2.9.6 next election-year-eligible step
  (year 1774 is even, so 2.9.6 is reachable). The 2.4.3-side flavor log
  "the First Continental Congress is called to meet" still fires; the
  actual build happens at 2.9.6.
- **Year drift edge:** Intolerable Acts resolves in 1772 or 1773 (preconditions
  allow it). The phase 2.9.6 gate REQUIRES `year >= 1774`, so the builder
  will not seat the CC until the player advances to 1774, matching history
  (F1). The era-event-side log fires when the player chooses "Convene"; the
  actual seating waits.
- **Player picks an eligible politician already seated by an earlier colony**
  (impossible by construction — pool is per-colony, filtered by state — but
  if someone relocates mid-build between colonies via a not-yet-built path,
  the engine de-duplicates against `cc.delegates`).

## Out of scope

- **CC President selection.** Already handled at phase 2.2.1 in 1774;
  `electCCPresident` (`continentalCongress.ts:113`) stays as-is.
- **Second Continental Congress (1775/76).** Including Georgia's late
  arrival per Lyman Hall (historian fact F2). Tracked as a follow-on feature.
- **1856 path.** `runPhase_2_9_6_Congressional` for 1856 is unchanged.
- **Per-colony delegation-size re-balancing.** The historian flagged the
  Big/Medium/Small abstraction as off vs. real headcounts; we **keep** the
  existing `ccDelegateSlots`. Adjustments are a separate PR.
- **Admitting new colonies.** Inaugural-only; expansion-states (`expansionStates.ts`)
  is not in play here.
- **Mid-session amendments to seated delegations** (Dickinson added late
  historically). Once seated, a delegate is fixed for this PR.
- **Career-track gameplay reverberations** beyond the AC #12 reset.
  No retroactive penalty/bonus to the politician's faction beyond what
  losing a career track normally costs.

## Risks / open questions (CP1 decisions)

The user explicitly asked these 7 decisions to be locked at CP1.
Recommendations bolded.

1. **Phase reuse vs. branch.** **Recommend: gate-swap** — 2.9.6's
   independence-era behavior entirely replaces the existing
   Congressional-elections logic when gated. Cleanest given 2.9.6 isn't
   yet 1772-aware. (AC #3)
2. **Storage shape on `continentalCongress.delegates`.** **Recommend:
   structured array with `tier?` added to `CCDelegate`** — already needed
   for state-grouped roster UI. (AC #18)
3. **Tiebreaker when factions tie on "most in colony."** **Recommend:
   aggregate state PV** — deterministic, mirrors `electCCPresident`
   precedent. (AC #9)
4. **Decline mechanics.** **Recommend: modal Accept/Decline for the
   player** at `careerTrackYears >= 1`; **deterministic AI skip** at
   `careerTrackYears >= 4`. (ACs #12, #16)
5. **Wild-card frequency.** **Recommend: 12% per AI slot** — visible
   without breaking AI logic. (AC #15)
6. **Year-over-year rebuilds.** **Recommend: inaugural CC is durable
   this PR**; Second CC and dissolutions are future work. (AC #27)
7. **Georgia inclusion.** **Recommend: honor history — exclude GA from
   the 1774 build**; fold in via the Second-CC follow-on later. (AC #5)

## Riskiest assumptions (top 3, ranked)

1. **The "selecting faction" abstraction will read as historically
   grounded if we surface period-correct selecting-body labels in the UI.**
   F4 says historically there was no faction-selected delegation; if the
   labels read flat, the player feels the lie. Mitigation: the
   selecting-body string is mandatory (AC #19), not optional flavor.
2. **The T1/T2/T3 tier UI will read as informative rather than wonky.**
   Tier badges on chips presume the player understands the tiering model.
   Mitigation: a brief on-page legend ("T1 = own faction; T2 = same
   party; T3 = crosses the aisle") in the roster summary.
3. **Cascading from 2.4.3 to 2.9.6 in the same turn is well-modeled.**
   The 2.4.3-side post-effect already builds the CC silently today;
   skipping that post-effect when 2.9.6 will run requires a
   forward-looking check ("is 2.9.6 still ahead this turn?"). Risk:
   the post-effect runs anyway and the CC is double-built or partially
   stomped. Mitigation: the `assembleCC` dispatcher checks
   `snap.game.continentalCongress?.delegates.length > 0` (already at
   `phaseRunners.ts:2430`) AND additionally checks the inverse "is
   this turn going to run 2.9.6 for 1772 with the gate met?" before
   building. The architect must wire this carefully.

---

**Checkpoint summary (for phone approval):**
- **Story:** Phase 2.9.6 becomes the interactive First-CC builder for
  1772, gated on Intolerable Acts → "Convene." Player picks delegates
  for colonies their faction dominates; AI picks elsewhere with T1/T2/T3
  badges; CC President remains the 2.2.1 job.
- **Big locks needed at CP1:** (a) **Exclude Georgia** to honor history?
  (b) **12% wild-card** per AI slot OK? (c) **Modal decline** for the
  player, **deterministic skip** for the AI on career-track ≥ 4 years?
- **Top design lock:** **Gate-swap** 2.9.6's 1856 logic for the 1772
  interactive build when gated (replace, don't branch).
- **Hardest risk:** the 2.4.3 → 2.9.6 cascade must NOT double-build the
  CC — the architect needs to make `assembleCC` a no-op when 2.9.6
  will run.
- **Out of scope (be explicit):** CC President, Second CC, 1856 path,
  delegate-count re-balance, mid-session amendments.
