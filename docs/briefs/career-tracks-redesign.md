# Brief: Career Tracks Redesign

## Approach
Rewrite `runPhase_2_1_2_CareerTracks` as a two-pass tick: a deterministic CPU-management pass (exhaustion reassign/clear, then 100% assign-by-best-uncapped-skill), followed by an accrual+rolls pass over **all** factions (player included) that adds +2 years and, on landing exactly on 4/8/12/16/20, fires three fixed-order rolls (skill 50%, themed 15–75%, random 12% at 75/25 pos/neg) via `src/rng.ts`. Gains append to a new persisted `game.careerGains` feed (FIFO cap 200). The 2.10 double-increment is deleted; `setPlayerCareerTrack` gains the engine-enforced `phaseId === '2.1.2'` lock and GameContext delegates to it. The page is rebuilt as a roster-management screen (faction dropdown, sortable/filterable table, gains feed, collapsible legend) with a second App.tsx auto-nav effect mirroring the draft pattern. All track/odds tables live as exported constants in `src/types.ts` so engine and legend share one source. Rejected alternative: making 2.1.2 a `needsPlayerInput` phase like the draft — unnecessary, since the snapshot already rests at `phaseId === '2.1.2'` between Advance clicks (engine.ts runs the phase named by `phaseId` on the *next* click), which is exactly the assignment window the spec describes; no engine.ts changes needed.

## State & type changes
- `src/types.ts`:
  - New interface (place near `DraftHistoryYear`, ~line 493):
    ```ts
    export interface CareerGainEntry {
      year: number;
      politicianId: string;
      factionId: string;        // faction at time of gain (feed filters on this, per spec)
      track: CareerTrack;
      thresholdYears: number;   // 4 | 8 | 12 | 16 | 20
      kind: 'skill' | 'trait';
      detail: SkillKey | Trait; // skill key gained, or trait name granted
      negative: boolean;        // true only for negative random traits
    }
    ```
  - `GameState`: add `careerGains?: CareerGainEntry[];` directly after `draftHistory` (line 481).
  - New exported constants (after `CAREER_TRACKS`, line 60) — single source for engine rolls and UI legend:
    ```ts
    export const TRACK_SKILL: Record<CareerTrack, SkillKey | null> = {
      Private: null, Military: 'military', Governing: 'governing',
      Administration: 'admin', Legislative: 'legislative',
      Judicial: 'judicial', Backroom: 'backroom',
    };
    export const TRACK_THEMED_TRAITS: Record<CareerTrack, Trait[]> = {
      Private: ['Celebrity', 'Business', 'Media'],
      Military: ['Military', 'Naval', 'Crisis Manager'],
      Governing: ['Leadership', 'Charismatic', 'Agriculture'],
      Administration: ['Efficient', 'Economics', 'Education'],
      Legislative: ['Orator', 'Debater', 'Reformist'],
      Judicial: ['Integrity', 'Egghead', 'Harmonious'],
      Backroom: ['Manipulative', 'Kingmaker', 'Numberfudger'],
    };
    export const CAREER_RANDOM_NEGATIVES: Trait[] =
      ['Corrupt', 'Scandalous', 'Controversial', 'Flip-Flopper'];
    export const CAREER_ODDS = {
      skill: 0.5,
      themedByThreshold: [0.15, 0.3, 0.45, 0.6, 0.75], // index = threshold N-1
      random: 0.12,
      randomPositiveShare: 0.75,
    } as const;
    export const CAREER_TRACK_MAX_YEARS = 20;
    export const CAREER_GAINS_CAP = 200;
    ```
    (These must live in types.ts, not the engine, so `CareerTracks.tsx` can render the legend without importing engine code. Note `Trait` must be moved/declared before `TRACK_THEMED_TRAITS` — it already is, line 62 vs. insertion point; insert the constants **after** the trait arrays, ~line 144, to keep declaration order valid.)
- **Save/migration impact**: existing IndexedDB saves load fine (`careerGains` is optional; `Politician` unchanged). `repair()` migrates once, gated on the legacy sentinel — see GameContext below. **The years-normalization must NOT run unconditionally**: in the new system years 4–20 are healthy mid-track state, and repair() runs on every load. Gate it inside `careerGains == null`.

## Engine changes (pure logic)
- `src/engine/phaseRunners.ts` — **rewrite `runPhase_2_1_2_CareerTracks`** (lines 265–297). Structure, in this exact order (determinism: both passes iterate `snap.politicians` in array order; RNG only in pass 2):
  1. `snap.game.careerGains ??= [];` — eager init so any save that has run one new-code tick can never be mistaken for legacy by repair().
  2. **Pass 1 — CPU management** (skip any `p` where `p.factionId == null`, `p.factionId === snap.game.playerFactionId`, `p.deathYear`, `p.retiredYear`, or `p.currentOffice`):
     - Exhausted (`p.careerTrack && p.careerTrackYears >= CAREER_TRACK_MAX_YEARS`): if `p.age < 60` reassign by best-uncapped rule (years = 0), else `careerTrack = null; careerTrackYears = 0`.
     - Unassigned (`!p.careerTrack && p.age < 50`): assign by best-uncapped rule. Best-uncapped rule: among `SKILLS.filter(k => p.skills[k] < 5)` take the highest value, **ties broken by `SKILLS` array order** (iterate in order, strict `>` to replace); if the filter is empty (all six at 5) skip entirely. Map skill→track via inverting `TRACK_SKILL` (CPU never assigns Private). Set `careerTrackYears = 0`.
     - CPU pols mid-track (years < 20) are never touched ("stay"). Running pass 1 before pass 2 means a newly CPU-assigned politician receives this tick's +2 — same as a player assignment made in the resting window. Exhaustion-reassign therefore happens on the tick *after* threshold 5 fires (years hits 20 in pass 2, reassigned at the top of the next tick).
  3. **Pass 2 — accrual + thresholds**, all factions: skip if `!p.careerTrack || p.factionId == null || p.deathYear || p.retiredYear || p.currentOffice` (pause rule: office keeps track+years, accrues nothing; fixes the unfiltered dead/retired loop). Then `p.careerTrackYears += 2;` — no upper gate on the increment (counter keeps climbing past 20 for the "Exhausted" display). If `p.careerTrackYears % 4 === 0 && p.careerTrackYears <= 20`, call the threshold helper with `N = years / 4`.
  4. `snap.politicians = refreshPv(snap.politicians);` (existing line, keep last).
- **New private helper `rollThreshold(snap, p, thresholdYears)`** — the three rolls, fixed order, all three always rolled (independent); pool selection only on success; failed/wasted rolls are silent (no entries, no `addLog`):
  1. *Skill* — `chance(CAREER_ODDS.skill)`. Non-Private: `k = TRACK_SKILL[track]`; if `p.skills[k] >= 5` → wasted; else `+1` (use `clamp(...,0,5)`) and record `kind:'skill', detail:k`. Private: `k = pick(SKILLS)`; if `p.skills[k] >= 5`, compute `below = SKILLS.filter(s => p.skills[s] < 5)`; if empty → wasted, else `k = pick(below)`; apply +1, record.
  2. *Themed trait* — `chance(CAREER_ODDS.themedByThreshold[N-1])`. Pool = `TRACK_THEMED_TRAITS[track].filter(t => !p.traits.includes(t))` (this filter IS the dedup rule — no re-roll loops anywhere). Empty → wasted; else `pick`, push to `p.traits`, record `kind:'trait', negative:false`. Granting `'Kingmaker'` does **not** set `p.isKingmaker`.
  3. *Random off-track trait* — `chance(CAREER_ODDS.random)`; then `chance(CAREER_ODDS.randomPositiveShare)` picks the branch. Positive pool = `POSITIVE_TRAITS` minus `TRACK_THEMED_TRAITS[track]` minus `p.traits`; negative pool = `CAREER_RANDOM_NEGATIVES` minus `p.traits`. Empty → wasted; else `pick`, push, record (`negative:true` on the negative branch). Gaining the `'Flip-Flopper'` trait does **not** touch `p.flipFlopperPenalty` (separate mechanic; the trait alone carries −5 PV after the pv.ts sync).
- **New private helper `recordCareerGain(snap, p, thresholdYears, kind, detail, negative)`** (mirrors `recordDraftPick`, line 45): pushes `{ year: snap.game.year, politicianId: p.id, factionId: p.factionId!, track: p.careerTrack!, thresholdYears, kind, detail, negative }` onto `snap.game.careerGains` (init `[]` if absent), then trims oldest: `if (arr.length > CAREER_GAINS_CAP) arr.splice(0, arr.length - CAREER_GAINS_CAP)`.
- **Rewrite `setPlayerCareerTrack`** (lines 299–305) — return `boolean` (mutated or not):
  reject (`return false`) when `snap.game.phaseId !== '2.1.2'`, politician missing, not player faction, `currentOffice`, `deathYear`/`retiredYear`, **or `track === p.careerTrack`** (re-select no-op — must not reset the counter). Otherwise set `careerTrack = track; careerTrackYears = 0; return true`. Clearing (`track === null`) is a normal change.
- **Delete line 1285** in `runPhase_2_10_End`: `if (p.careerTrack && p.careerTrackYears < 4) p.careerTrackYears += 2;` — after this, the only `careerTrackYears` writers are the 2.1.2 runner, `setPlayerCareerTrack`, and object construction sites (verified by grep: data builders, draftImport, draft pool gen, scouting/history projections all just initialize 0 — untouched).
- `src/pv.ts` — **sync trait lists** (checkpoint decision 2): delete local `POSITIVE`/`NEGATIVE` (lines 3–10), import `POSITIVE_TRAITS`, `NEGATIVE_TRAITS` from `./types`, use them at lines 76–79. PV impact: holders of `Egghead`/`Leadership` gain +4; holders of `Frail`/`Controversial`/`Obscure`/`Traitor` drop −5 — applies immediately to existing saves and the full dataset on next `refreshPv`. Typical candidate PV is ~40–120, so this is a ~3–10% swing for affected individuals only; election (PV-driven) margins shift slightly wherever they run.
- `src/engine/engine.ts`, `src/phases.ts` — **no changes**. 2.1.2 already dispatches with `return {}` (engine.ts:29) and rests every turn.

## UI changes
- `src/state/GameContext.tsx`:
  - `setCareerTrack` (lines 312–323): delete the inlined mutation; clone, call `setPlayerCareerTrack(draft, politicianId, track)` (add to the phaseRunners import at line 7); if it returns `false`, return without `setSnapshot`/`persist`.
  - `repair()` (lines 77–124): add one gated migration block —
    ```ts
    if (s.game.careerGains == null) {            // legacy-save sentinel
      s.game.careerGains = [];
      for (const p of s.politicians) {
        if (p.careerTrack && !p.factionId) { p.careerTrack = null; p.careerTrackYears = 0; }
        else if (p.careerTrack && p.careerTrackYears >= 4) p.careerTrackYears = 2;
      }
      dirty = true;
    }
    ```
    Restated rule: on-track years >= 4 → 2 (threshold #1 fires on their next accruing tick); 0 and 2 pass through. The factionless-clear handles old-bug free agents the previous runner auto-assigned (new system requires `factionId` for accrual and feed entries; this is a small, safe addition beyond the spec). The gate is **mandatory** — see Risks #1. Fresh games are safe even if reloaded before any gain: pre-first-tick years are all 0 (no-op), and the tick's eager `??= []` makes the block unreachable afterward.
- `src/App.tsx`: add `lastCareerEntryKey` ref and a **second** effect (separate from the draft one — different conditions, never both true): when `snapshot.game.phaseId === '2.1.2'`, key `` `${year}:2.1.2` ``, if key differs from ref → store and `setPage('careers')`; else (any other phase) reset ref to null. Deps: `snapshot?.game.phaseId`, `snapshot?.game.year`. Fires once per turn by design (2.1.2 rests every turn; year advances +2 per cycle so keys never collide), re-fires after a mid-window save/load (ref starts null), and never yanks back after navigating away within the window.
- `src/pages/CareerTracks.tsx` — full rebuild:
  - **State**: `viewFactionId` (default `game.playerFactionId`), `trackFilter: 'all' | 'none' | CareerTrack`, `statusFilter: 'all' | 'free' | 'inOffice' | 'onTrack'`. Derived: `isPlayerView`, `assignLocked = game.phaseId !== '2.1.2'`.
  - **Faction selector**: native `<select>` above the table — player faction first, then `snapshot.factions` in array order (skip player); option text `f.name`; render `<PartyBadge party={faction.partyId} />` beside the select for the current selection (options are text-only).
  - **Rows**: `politicians.filter(p => p.factionId === viewFactionId && !p.deathYear && !p.retiredYear)`, then the two filters. Status precedence: `currentOffice` → (`careerTrack` ? "Paused — in office" : "In office"); else `careerTrack` → "On track"; else "Free".
  - **Table**: reuse `SortableTable` (`src/components/SortableTable.tsx`; column-sort satisfies the sortability criteria). Columns: Name, State, Age, Ideology (sortValue `IDEOLOGY_ORDER.indexOf`), PV, Cmd, the six skills, Traits (badge per trait; red styling when in `NEGATIVE_TRAITS`), Status, Track, Yrs, Next (years to next threshold: no track or paused → "—"; `years >= 20` → "—" with **Exhausted** badge; else `4 - (years % 4)`; sortValue uses a large sentinel for "—"), Assign. Row badges: **Milestone next turn** when `careerTrack && !currentOffice && years % 4 === 2 && years < 20`; **Maxed** when all six skills are 5; **Exhausted** when `careerTrack && years >= 20`.
  - **Assign column**: `<select>` (None + `CAREER_TRACKS`) bound to `p.careerTrack`, `onChange` → `setCareerTrack`. Disabled states (tooltip via `title`): non-player view → "You can only manage your own faction"; `currentOffice` → "In office"; `assignLocked` → "Assignments open during the Career Tracks phase". Disabled (not hidden) in all three cases to keep layout stable; the engine lock is the real enforcement.
  - **Empty state**: player view with zero rows after the base filter → line "No free politicians to assign" (feed and legend still render).
  - **Recent gains feed**: `(game.careerGains ?? []).filter(e => e.factionId === viewFactionId).slice(-20).reverse()`; each row: year, politician name (lookup by id — politicians are never deleted, so safe), track, gain text (`kind === 'skill'` → "+1 {detail}", else "gained {detail}"); `negative` → red text/badge. Renders for CPU views too (read-only scouting).
  - **Legend panel**: native `<details>/<summary>` (collapsible, no state). Content rendered from the types.ts constants: full `TRACK_SKILL` + `TRACK_THEMED_TRAITS` table, thresholds 4/8/12/16/20, 50% skill rule + cap wastage + Private wildcard re-draw, themed curve from `CAREER_ODDS.themedByThreshold`, flat 12% random with 75/25 split and the four `CAREER_RANDOM_NEGATIVES` named, pause rule, 2.1.2 lock rule.
  - **Copy**: delete "cannot hold office"; new copy states on-track politicians remain eligible for office and accrual pauses while serving.
  - No registry/Sidebar/PageId changes — `'careers'` already wired (registry.ts:31/59, Sidebar.tsx:34).

## Files to touch (exact, ordered)
1. `/home/user/AMPU/src/types.ts` — `CareerGainEntry`, `GameState.careerGains`, track/odds/cap constants
2. `/home/user/AMPU/src/pv.ts` — replace local trait lists with `POSITIVE_TRAITS`/`NEGATIVE_TRAITS` imports
3. `/home/user/AMPU/src/engine/phaseRunners.ts` — rewrite 2.1.2 runner + `rollThreshold` + `recordCareerGain`; rewrite `setPlayerCareerTrack` (phase lock, no-op, boolean return); delete line 1285
4. `/home/user/AMPU/src/state/GameContext.tsx` — `setCareerTrack` delegation; gated repair() migration
5. `/home/user/AMPU/src/App.tsx` — second auto-nav effect for 2.1.2
6. `/home/user/AMPU/src/pages/CareerTracks.tsx` — full page rebuild

## Test / verification plan
- Build/typecheck: `npm run build`.
- Playtest (1856, per spec DoD): `npm run dev`, new game.
  1. Turn 1 draft completes → Advance → app auto-navigates to Career Tracks resting at 2.1.2. Assign three politicians: one Legislative (young), one Private, one whose mapped skill is already 5 (to observe wastage later). Re-select an assigned politician's current track → years unchanged.
  2. Advance one full turn → back at 2.1.2 (auto-nav again): assigned politicians show Yrs 2 and "Milestone next turn".
  3. Advance ~10 turns: feed entries appear at years 4/8/12/...; verify a skill gain (+1 visible in row), a themed trait, and ideally a red negative; threshold years in entries are 4/8/12/16/20 only; politician at 20 shows Exhausted and produces no further entries.
  4. Lock: while resting at any non-2.1.2 phase, open Career Tracks → all assign selects disabled with the phase tooltip; page fully viewable.
  5. Pause: get an on-track politician elected (or assign a track, then watch one win in 2.9.x) → status "Paused — in office", Yrs frozen across turns, control disabled "In office".
  6. CPU view: dropdown to a CPU faction → near-total track coverage for age<50 free pols after one tick, controls disabled with the faction tooltip, their feed populates; confirm CPU pols never switch mid-track and reassign/clear at 20 by age.
  7. 1772 smoke test: new 1772 game through the inaugural draft into 2.1.2 — mass CPU assignment, no crash.
- Migration: export a save, strip `careerGains`, set one on-track politician's `careerTrackYears` to 4 (and one to 6), import → both become 2, `careerGains: []`; reload again → values untouched (gate works). Then play forward: a politician at years 6 in a *post-feature* save reloads without being clamped.
- pv.ts ripple: in Roster, note PV of a politician holding Leadership or Egghead before/after the change → +4 exactly; one holding Obscure/Frail → −5.
- Edge cases from spec: all-skills-5 politician on Private (skill roll wastes silently, Maxed badge); full themed pool (themed roll wastes); empty player roster view shows the empty-state line; loading a save resting at 2.1.2 re-triggers auto-nav; faction-converted politician (2.1.6) keeps track and the feed keeps old `factionId`.

## Risks
1. **repair() clamp hazard (top risk).** The legacy years-normalization (>=4 → 2) is destructive if it ever runs on a healthy post-feature save — it would silently reset every mid-track politician on each load. It MUST be gated inside `careerGains == null`, and the 2.1.2 tick MUST eagerly init `careerGains ??= []` so the sentinel flips after the first tick. Both halves are required; implement them together.
2. **Core-rule change (loud, spec-mandated):** CPU development rate collapses — deleting the 2.10 double-increment plus replacing guaranteed 4-year graduation with 50% rolls cuts CPU skill growth from ~+1/turn to ~2.5 per 10 turns, while player tracks start working at all. Long-campaign politician quality curves, and therefore PV-driven election fields, will look materially different. Playtest sign-off required (spec open question #1).
3. **PV shift in existing saves (checkpoint-approved):** the pv.ts sync moves PV ±4/−5 for six previously inert traits across every save and the ~18.5k dataset on next `refreshPv` — small per-politician (~3–10%), but it changes election margins immediately on load, before the player does anything.
4. **Phase-lock regression by design:** `setCareerTrack` now no-ops outside 2.1.2. Only CareerTracks.tsx calls it (verified), but the silent-`false` contract means any future caller must check the return value. Relaxing is a one-line change if playtest hates it.
5. **Accrual now requires `factionId`:** legacy factionless on-track free agents freeze (then get cleared by the gated migration). Intentional invariant ("tracks are faction programs") — flagging because it slightly exceeds the spec's letter.
6. **Auto-nav every turn:** accepted by spec, but it changes the per-turn rhythm globally (every Advance that wraps to 2.1.2 jumps the page). If it collides with a future resting-phase auto-nav, keys are phase-scoped so they won't fight — but the UX stacking on draft turns (draft nav → careers nav in sequence) should be watched in playtest.
