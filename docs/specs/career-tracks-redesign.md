# Spec: Career Tracks Redesign (Milestone Development & Roster Management)

## Vision (as given)
Career Tracks today is a passive engine tick driving a basic dropdown table.
Redesign it into the player's main inter-draft optimization screen: actively
manage roster development, see CPU factions doing the same, with real
risk/reward at each milestone. Keep all seven tracks, each mapped to its skill
(Private is a wildcard that grants a random skill). Skill gains come from
independent 50/50 rolls at 4/8/12/16/20 years on track; each threshold also
rolls a track-themed trait (rising odds, capped 75%) and a flat-odds random
off-track trait that can be negative (Corrupt, Scandalous, Controversial,
Flip-Flopper). Assignment is locked to phase 2.1.2 with auto-navigation on
entry (draft-page pattern); other factions' tracks are viewable read-only.

## Player experience
Between drafts, the player walks into the Career Tracks office once a turn,
reviews who is developing, and places bets: park a young talent on a 20-year
Legislative arc, or churn short 4-year stints for quick 50/50 payoffs?
Milestones create anticipation ("Hayes hits his 12-year milestone next turn"),
the gains feed delivers the payoff/whiff drama, and the random-trait slice
means even a well-run program can mint a Corrupt liability. Scouting rival
factions' tracks shows what monsters the CPU is growing — and when to draft
to counter them.

## User story
As a faction-running player, I want to assign my free politicians to career
tracks during the Career Tracks phase and watch milestone rolls pay off (or
not) over the following turns, so that roster development becomes a deliberate
long-game strategy instead of an invisible background tick.

## Verified engine facts (drive the design; architect must not re-derive)
- One full phase cycle = **+2 game years** (`nextPhaseInfo` wraps with
  `nextYear = year + 2`, `src/phases.ts:149`). Phase 2.1.2 runs every turn
  (no gate in `shouldRunPhase`) and the game **rests at 2.1.2** between
  Advance clicks — that resting window is the player's assignment window.
- Current code has three live bugs this redesign supersedes:
  1. `runPhase_2_1_2_CareerTracks` skips the player faction and nothing else
     grants their skill — **player tracks never pay off today**.
  2. `runPhase_2_10_End` (phaseRunners.ts:1285) also does
     `careerTrackYears += 2` — CPU politicians accrue +4/turn (graduate
     roughly every turn). The 2.10 increment must be **removed**; 2.1.2
     becomes the sole owner of accrual and resolution.
  3. Dead/retired politicians are not filtered; `Private` resolves to a null
     skill key and grants nothing.
- `src/rng.ts` (`chance`, `pick`, `d100`) is the sanctioned RNG seam — no raw
  `Math.random` in engine code. Roll order must be fixed (see below) so a
  future seeded RNG stays deterministic.

## Mechanics (decided values)

### Cadence (open call #1 — decided)
- `careerTrackYears` counts **game years**; each 2.1.2 tick adds **+2** for
  every living, non-retired politician with a track, **all factions including
  the player's**, except those currently in office (see pause rule). Rationale:
  one tick = 2 game years, so "+= 2" keeps the counter meaning literal years,
  matching `age += 2` in 2.10; thresholds 4/8/12/16/20 land exactly.
- The `careerTrackYears` increment in `runPhase_2_10_End` is deleted.
- **Pause rule**: a politician who wins office while on a track keeps the
  track and years but accrues nothing until free again (track assignment is
  not cleared by taking office).
- **Threshold fires** when, after the +2, `careerTrackYears % 4 === 0` and
  `careerTrackYears <= 20`. Threshold number N = years / 4 (N = 1..5).
- After the 20-year threshold the track is **exhausted**: no further rolls;
  the counter keeps incrementing for display and the UI flags "Exhausted".
- **repair() migration**: for any politician with a track and
  `careerTrackYears >= 4` (legacy stuck/double-counted state), set
  `careerTrackYears = 2` so threshold #1 fires on their next tick. Values 0
  and 2 pass through unchanged. Also initialize `game.careerGains = []` when
  absent (legacy saves; history unrecoverable).

### Rolls at each threshold (three independent rolls, fixed order)
Per on-track politician hitting threshold N, in stable `snap.politicians`
array order, roll in this exact sequence using `src/rng.ts`:

1. **Skill roll — 50%** (`chance(0.5)`). Success: +1 to the track's mapped
   skill, clamped at 5. If the mapped skill is already 5 the gain is wasted
   (no substitution). **Private**: success draws a uniformly random skill of
   the six; if the drawn skill is at 5, re-draw among skills below 5; if all
   six are at 5 the gain is wasted.
2. **Themed trait roll — rising**: 15% / 30% / 45% / 60% / 75% at thresholds
   1–5. Success: grant one trait picked uniformly from the track's themed pool
   (below) excluding traits already held. If the politician holds the whole
   pool, the gain is wasted.
3. **Random off-track trait roll — flat 12%** at every threshold. Success:
   75% positive / 25% negative.
   - Positive: uniform pick from `POSITIVE_TRAITS` minus the current track's
     themed pool minus traits already held.
   - Negative: uniform pick from **{Corrupt, Scandalous, Controversial,
     Flip-Flopper}** minus traits already held.
   - If the eligible pool is empty, the gain is wasted.

Net feel over a full 20-year stint: ~2.5 expected skill points, ~2.25 themed
traits, ~0.45 random positives, ~0.15 negatives (≈14% chance of at least one
negative — real but not punishing).

### Track → skill → themed-trait map (open call #2 — decided)
Pools are disjoint (each trait appears in at most one themed pool) so the
legend reads cleanly. All from `POSITIVE_TRAITS` in `src/types.ts`.

| Track          | Skill            | Themed trait pool                     |
|----------------|------------------|---------------------------------------|
| Private        | random of six    | Celebrity, Business, Media             |
| Military       | military         | Military, Naval, Crisis Manager        |
| Governing      | governing        | Leadership, Charismatic, Agriculture   |
| Administration | admin            | Efficient, Economics, Education        |
| Legislative    | legislative      | Orator, Debater, Reformist             |
| Judicial       | judicial         | Integrity, Egghead, Harmonious         |
| Backroom       | backroom         | Manipulative, Kingmaker, Numberfudger  |

Private gets a real themed pool (private-life fame and fortune) so all seven
tracks are structurally identical; its wildcard nature lives in the skill roll.
Leftover positives (Propagandist, Magician, Environment, Nationalist,
Globalist) are reachable only via the random roll. Granting the `Kingmaker`
trait does **not** set the separate `isKingmaker` flag.

### Track switching
- Gains already banked are permanent. Assigning a different track (or
  clearing to none) resets `careerTrackYears` to 0.
- Re-selecting the politician's **current** track is a no-op (does not reset
  the counter).

### CPU AI policy (open call #4 — decided)
Runs inside the 2.1.2 tick, CPU factions only (player faction fully exempt
from all auto-management):
- **Assign**: any living CPU politician with no office, no track, and
  age < 50 is assigned immediately (100%, replacing today's 30%/tick) to the
  track of their highest skill **that is below 5** (ties broken by `SKILLS`
  array order). If all six skills are 5, skip (see below).
- **Stay**: CPU never switches tracks before exhaustion.
- **At exhaustion** (years ≥ 20 with no more thresholds): if age < 60,
  reassign by the same best-uncapped-skill rule (counter resets); otherwise
  clear the track.
- On-track CPU politicians remain eligible for offices/elections exactly as
  today (election candidate filters do not check `careerTrack`); winning an
  office pauses accrual per the pause rule.

### Maxed-out politicians (open call #5 — decided)
- CPU skips auto-assigning politicians with all six skills at 5.
- No one is ever auto-cleared mid-track for being maxed (trait rolls still
  have value; skill rolls simply waste).
- Player rows with all six skills at 5 show a "Maxed" badge so the player can
  judge whether trait upside justifies the slot.

## Acceptance criteria

### Engine (src/engine/phaseRunners.ts — rewrite of runPhase_2_1_2_CareerTracks)
- [ ] Each 2.1.2 tick adds +2 `careerTrackYears` to every politician with a
  track who is alive (`!deathYear`), not retired (`!retiredYear`), and not in
  office — **including the player's faction**.
- [ ] The `careerTrackYears += 2` line in `runPhase_2_10_End` is removed; no
  other code path mutates `careerTrackYears` except 2.1.2 and assignment.
- [ ] When a tick lands `careerTrackYears` on 4/8/12/16/20, exactly three
  independent rolls fire (skill 50%, themed 15–75% by threshold, random 12%)
  with the pools, caps, wastage, and Private re-draw rules defined above.
- [ ] All randomness goes through `src/rng.ts`; rolls execute in the fixed
  order (skill, themed, random) per politician in array order.
- [ ] Past 20 years a track fires no further rolls (exhausted).
- [ ] CPU auto-assign/stay/exhaustion policy works as specified; player
  faction politicians are never auto-assigned, auto-cleared, or auto-rolled
  differently from CPU ones (rolls themselves are faction-blind).
- [ ] Every applied gain (skill point, themed trait, random trait, negative
  trait) appends an entry to `game.careerGains` (shape below) and the tick
  ends with `refreshPv` (existing behavior) so PV reflects new skills/traits.
- [ ] Wasted rolls and failed rolls produce no entries and no logs.

### State shape (for the architect)
- [ ] New persisted field `GameState.careerGains?: CareerGainEntry[]` where an
  entry carries: `year`, `politicianId`, `factionId`, `track`,
  `kind: 'skill' | 'trait'`, `detail` (skill key or trait name),
  `thresholdYears` (4–20), and `negative: boolean`. Array is FIFO-capped at
  **200** entries to bound save size.
- [ ] `repair()` in GameContext: initialize missing `careerGains` to `[]`;
  normalize legacy on-track `careerTrackYears >= 4` to `2`.

### Player agency & locking
- [ ] Track assignment (player faction) is possible **only while
  `game.phaseId === '2.1.2'`** — enforced in the engine setter
  (`setPlayerCareerTrack`) and GameContext (`setCareerTrack`), not just UI.
  GameContext should delegate to the engine setter instead of duplicating its
  logic (today it is inlined).
- [ ] Outside 2.1.2 the page stays fully viewable for planning; assignment
  controls are disabled with tooltip "Assignments open during the Career
  Tracks phase".
- [ ] In-office politicians cannot be (re)assigned (existing rule kept);
  their control is disabled with an "In office" tooltip, and if they hold a
  paused track the row shows "Paused — in office".
- [ ] Assignments made during the 2.1.2 window take effect on the very next
  Advance click (the tick that runs 2.1.2): a just-assigned politician
  receives that tick's +2 (counter shows 2 after the turn).
- [ ] Re-selecting the current track does not reset `careerTrackYears`.

### Auto-navigation (open call #6 — decided: yes, even with nothing to decide)
- [ ] When the snapshot comes to rest at `phaseId === '2.1.2'`, the app
  navigates to the Career Tracks page **once per entry**, using the same
  ref-keyed pattern as the draft auto-nav in `src/App.tsx`
  (`lastDraftEntryKey`; key = `${year}:2.1.2`, cleared when the condition is
  false). Navigating away mid-window does not yank the player back.
- [ ] Auto-nav fires even when the player has no assignable politicians; the
  table then shows an empty-state line ("No free politicians to assign") while
  the gains feed and CPU views remain useful.

### Career Tracks page (src/pages/CareerTracks.tsx — rebuilt)
- [ ] Roster table, one row per living/non-retired politician of the viewed
  faction, with inline: six skills, command, traits (badges, negatives
  visually distinct), PV, age, ideology, state, status
  (Free / In office / On track / Paused), current track, years on track, and
  years until next threshold ("—" when no track or exhausted).
- [ ] Filters: by track (including "No track") and by status
  (Free / In office / On track). Sortable at minimum by: years until next
  threshold, age, ideology (IDEOLOGY_ORDER), PV, and name.
- [ ] "Milestone next turn" indicator on rows exactly one tick from a
  threshold (`careerTrack` set, not paused, `careerTrackYears % 4 === 2`,
  `careerTrackYears < 20`); "Exhausted" badge at years ≥ 20; "Maxed" badge
  when all six skills are 5.
- [ ] Assignment control per player-faction row (track select incl. "None"),
  honoring all locking rules above.
- [ ] **Recent gains feed**: the last 20 entries of `careerGains` for the
  currently viewed faction, newest first — year, politician name, track,
  what was gained; negative traits visually flagged (e.g. red).
- [ ] **Legend panel** (collapsible): full track → skill → themed-pool table,
  threshold curve (4/8/12/16/20 yrs), the 50/50 skill rule + cap-wastage +
  Private wildcard, themed curve 15→75%, flat 12% random (75/25
  positive/negative, the four negatives named), pause rule, and the
  phase-2.1.2 lock rule.
- [ ] Stale copy ("cannot hold office") is removed; on-track politicians are
  described accurately as remaining eligible for office (accrual pauses).

### CPU faction view (open call: selector — decided: dropdown)
- [ ] A faction **dropdown selector** (not a tab bar — up to 10 factions
  would wrap badly) above the table, defaulting to the player's faction and
  listing it first; remaining factions in roster order with party color/badge.
- [ ] Viewing any non-player faction renders the identical table and gains
  feed, read-only: assignment controls hidden or disabled with tooltip
  "You can only manage your own faction".

### Definition of done (per CLAUDE.md)
- [ ] `npm run build` passes.
- [ ] Playtested in the 1856 scenario: assign tracks turn 1, advance ~10+
  turns, observe milestone gains in the feed, a CPU faction's view, the lock
  outside 2.1.2, and the auto-nav rhythm.

## Edge cases
- **1772 first turn**: 2.1.2 runs on the very first turn; CPU mass-assignment
  happens immediately. Must not crash with the scripted-scenario roster.
- **Draft-year flow**: 2.1.1 → 2.1.2 means fresh draftees are assignable the
  same turn they are drafted (intended core loop; verify in playtest).
- **Death/retirement on a track**: dead/retired politicians accrue nothing and
  roll nothing (fixes current unfiltered loop). Their last gains remain in the
  feed.
- **Office won mid-track**: pause (keep track + years); resume accrual when
  free. Office vacated the same turn as a threshold: the threshold fires on
  the next tick they accrue into it, never retroactively.
- **All six skills at 5 + full themed pool**: every roll wastes; entry shows
  Maxed/Exhausted badges so the player notices the dead slot.
- **Legacy saves**: `careerTrackYears` values in the wild are {0, 2, 4} (plus
  player pols stuck at 4); repair() handles 4 → 2; feed starts empty.
- **careerGains cap**: at 200 entries the oldest are trimmed; the feed only
  ever shows the latest 20 per faction, so trimming is invisible in normal
  play but documented for the architect.
- **Mid-window save/load**: loading a save resting at 2.1.2 must re-trigger
  auto-nav (ref starts null on app mount) and keep assignment unlocked.
- **Faction conversions (2.1.6)**: a politician changing factions keeps track
  and years; historical feed entries keep the `factionId` they were earned
  under (feed is filtered by stored factionId, not current membership).

## Out of scope
- Changing election/appointment eligibility for on-track politicians (they
  remain electable, as the engine already allows; only the page copy changes).
- Event-log (`EventEntry`) entries for career gains — the feed is the sole
  surface; no log spam.
- `command` gains, negative-trait removal/rehab mechanics, trait caps, or any
  new skills.
- Sidebar badges/pulses for pending milestones (possible v2).
- Notifying the player of CPU gains outside the feed; cross-faction
  comparison dashboards.
- Mobile layout polish; assume desktop widths like the draft module.
- Seeding/replacing `src/rng.ts`'s Math.random backing — out of scope here;
  this feature only routes through its helpers.

## Open questions / assumptions
Riskiest first:
1. **CPU development slows dramatically.** Today CPU pols effectively gain +1
   skill per ~1 turn (double-increment bug); the new system averages ~2.5
   skill points per 10 turns. This is a deliberate, large balance shift that
   also finally makes player tracks function at all — but overall politician
   quality growth across a campaign will flatten. Needs playtest sign-off.
2. **pv.ts trait-list desync.** `src/pv.ts` keeps local POSITIVE/NEGATIVE
   lists that are out of sync with `types.ts`: `Egghead`, `Leadership`
   (both in my themed pools) and `Controversial` (in the negative pool)
   currently have **zero PV effect**. I assume the architect syncs pv.ts to
   import `POSITIVE_TRAITS`/`NEGATIVE_TRAITS` from types.ts so every gainable
   trait moves PV (+4/−5). This is a small PV change (PV drives elections) —
   confirm at checkpoint; if declined, the feature still works but three
   traits become PV-inert flavor.
3. **Phase lock is a behavior regression by design.** Assignment is currently
   possible any time; locking to the 2.1.2 resting window is the user's ask,
   but if playtest shows it feels restrictive the gate is a one-line relax.
4. **Auto-nav every turn.** 2.1.2 rests every turn, so the page opens every
   turn. User leans yes (including empty states); if it proves naggy, add a
   "don't auto-open" toggle in v2 rather than weakening the spec now.
5. **repair() forfeits 2 nominal years** for legacy stuck-at-4 politicians
   (4 → 2) instead of retroactively rolling threshold #1 — avoids RNG inside
   repair(). Those saves were bugged (no payoff ever), so this is strictly an
   improvement for them.
6. **Pause-in-office rule is my invention** (user only specified the
   assignment lock). Alternative was auto-clearing tracks on taking office;
   pausing preserves investment and reads better with "gains are permanent".
7. **Numbers I chose** within delegated ranges: flat random 12%, 75/25
   positive/negative split, themed curve 15/30/45/60/75 (user's suggestion
   kept), feed shows 20, persistence cap 200, CPU assign-age < 50, CPU
   reassign-at-exhaustion age < 60.
8. **Private's themed pool** (Celebrity, Business, Media) — user allowed
   "only random" instead; I gave it a pool so all tracks share one structure
   and Private isn't strictly weaker on traits.
9. **Faction selector is a dropdown**, not a tab bar (10 factions in 1856
   would wrap); breaks visual symmetry with DraftTabs but scales.
10. **Recent-gains feed is persistent** in GameState (user's lean; parity
    with `draftHistory`), capped rather than unbounded.
11. **Wasted/failed rolls are silent** (no feed entries) to keep the feed
    high-signal; if playtest wants "missed roll" drama, add later.
