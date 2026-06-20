# Brief: Lobbies → expertise → industry + faction ideology (PR7)

## Approach
Wire four loose ends of the Lobbies system as four small, surgical pieces — no
new phase, no new persisted state, no new abstractions:

1. **Tables in `src/types.ts`**: add `LOBBY_EXPERTISE`, `LOBBY_INDUSTRY`,
   `EXPERTISE_IDEOLOGY_LEAN`, and two tuning consts (`LOBBY_EXPERTISE_GRANT_ODDS`,
   `FACTION_EXPERTISE_BIAS_WEIGHT`) beside the existing `ALIGNMENT_RULES` and
   `LEADERSHIP_RULES` blocks. These are the single source of truth.
2. **Engine — expertise grant** (item 1): a new **Pass 3** inside the existing
   `runPhase_2_1_2_CareerTracks` (between the existing Pass 2 and the
   `refreshPv` call). Per faction, per held lobby card, per living unretired
   member: `chance(LOBBY_EXPERTISE_GRANT_ODDS)` → `addExpertise(p, tag)` → log.
   Mirrors the existing committee/cabinet/General-in-Chief grant pattern
   exactly (same log shape, same dedupe-on-real-change discipline).
3. **Engine — industry nudge** (item 2): a new deterministic pure pass at the
   **top of `runPhase_2_1_8_FactionPersonalities`** (chosen over 2.2.1 because
   2.1.8 is the existing alignment-drift home — same conceptual neighborhood,
   reads the same faction `lobbyCards`). Walks `snap.states` × `snap.factions`
   in array order; for each state-member faction the union of held-card nudge
   keys that already exist on `s.industries` is bumped +1, clamped ≤5, with
   per-(state,key)-per-year dedupe. No RNG. No key creation.
4. **Engine — faction ideology bias** (item 4): edit `factionCenter` itself
   (only). Compute `rawMean` as today, compute `econLean` as the per-member
   mean of `EXPERTISE_IDEOLOGY_LEAN[x]` summed over tags, blend
   `biasedMean = rawMean + FACTION_EXPERTISE_BIAS_WEIGHT * econLean`, clamp to
   [0, 6], round same as today. All 17 call sites inherit the blend
   automatically — single definition of "faction ideology" preserved.
5. **UI — one JSX edit**: `StatesPage.tsx` industry cell renders entries with
   values (`cotton: 5, agriculture: 3`) instead of keys only, so the +1 nudge
   is observable. No new screen, no lobby-card management UI.

**Alternative rejected:** caching a per-faction `biasedCenter` field on
`Faction` for perf. Rejected because `factionCenter` is already a per-call
recompute, the call count is low (~17 sites), and a cached field would force
an IndexedDB save migration for no measurable win. Keeping `factionCenter`
pure preserves the determinism contract.

## State & type changes

### `src/types.ts` — additions only
Insert immediately **after** `ALIGNMENT_RULES` (line 370–371) and **before**
`ALIGNMENT_DRIFT_CAP`, so all lobby/expertise/industry tables sit beside the
existing alignment table. Exact shapes:

```ts
// PR7 — Lobby → Expertise grant. null = non-economic lobby (no grant).
// Covers all 15 LobbyCardIds. Drives the new Pass 3 in 2.1.2.
export const LOBBY_EXPERTISE: Record<LobbyCardId, Expertise | null> = {
  // 1772
  Merchants: 'Business',
  Planters: 'Agriculture',
  SmallFarmers: 'Agriculture',   // also appears in 1856
  Lawyers: 'Justice',
  Patriots: null,
  NationalUnity: null,
  Reformers: null,
  // 1856
  SlavePower: 'Agriculture',
  NorthernIndustry: 'Business',
  Expansionists: 'Foreign Affairs',
  UrbanLabor: 'Labor',
  Abolitionists: null,
  EvangelicalReform: null,
  ProUnion: null,
  Nativists: null,
};

// PR7 — Lobby → Industry +1 nudge. Empty = no nudge (non-economic or
// historically anachronistic, e.g. UrbanLabor 1856). Keys MUST match the era
// `State.industries` keys verbatim (states1772.ts:8–21, states1856.ts:5–36):
// fishing, lumber, manufacturing, shipping, finance, agriculture, tobacco,
// cotton (1772+); coal, sugar, cattle, mining (1856 only).
// A lobby card listing a key that doesn't exist on a given state is a no-op
// per the nudge pass (skip-if-missing). Cross-era safety: single combined map
// is correct because non-existent keys are skipped per-state.
export const LOBBY_INDUSTRY: Record<LobbyCardId, readonly string[]> = {
  // 1772 economic
  Merchants: ['shipping', 'finance'],
  Planters: ['tobacco'],                  // 1772: plantation = tobacco-led
  SmallFarmers: ['agriculture'],          // both eras
  // 1856 economic
  SlavePower: ['cotton', 'tobacco'],
  NorthernIndustry: ['manufacturing', 'coal'],
  Expansionists: ['agriculture'],
  // Non-economic or no defensible nudge
  Lawyers: [],
  UrbanLabor: [],                         // no union-vs-mfg sign in 1856
  Patriots: [],
  NationalUnity: [],
  Reformers: [],
  Abolitionists: [],
  EvangelicalReform: [],
  ProUnion: [],
  Nativists: [],
};

// PR7 — Expertise economic lean on the LW(−)…RW(+) axis. Partial: only
// economically-meaningful tags carry a sign; absent tags default 0. CHECKPOINT
// 1 values (approved as-is):
//   Agriculture +1   (agrarian/planter base, both eras)
//   Labor       -1   (wage-worker base)
//   Business    +0.5 (mildly RW: commercial/industrial; historiographically
//                     weak — 1772 Federalist/center, 1856 Northern industry
//                     was center-left Republican — deliberately half-weight)
// All others (Foreign Affairs, Justice, Education, Healthcare, Welfare,
// Military, Naval, Trade, etc.) → 0.
export const EXPERTISE_IDEOLOGY_LEAN: Partial<Record<Expertise, number>> = {
  Agriculture: 1,
  Business: 0.5,
  Labor: -1,
};

// PR7 — Tuning knobs. Co-located with the tables above so the human/architect
// can dial without touching engine code.
export const LOBBY_RULES = {
  expertiseGrantOdds: 0.10,          // per-eligible-member per-year trickle
  factionExpertiseBiasWeight: 0.5,   // max |econLean| is 1 → max |shift| is 0.5
} as const;
```

**Sanity-check vs. real era industry keys (verified by reading the data files):**

| Card | Keys it nudges | 1772 states with key? | 1856 states with key? |
|---|---|---|---|
| Merchants | shipping, finance | shipping: MA, RI, CT, NY, PA, SC; finance: NY | shipping: NY, LA, MD, MO, CA; finance: MA, CT, NY, PA |
| Planters | tobacco | MD, VA, NC | (would no-op on most 1856 states, but Planters is a 1772 card; spec confirms a 1772 card on a 1856 state is structurally fine — no error) |
| SmallFarmers | agriculture | NJ, PA, DE, MD, VA, NC, SC, GA | NH, VT, NJ, PA, DE, MD, VA, NC, SC, GA, FL, AL, MS, AR, TN, KY, MO, OH, IN, IL, WI, IA |
| SlavePower | cotton, tobacco | cotton: SC; tobacco: MD, VA, NC | cotton: SC, GA, FL, AL, MS, LA, TX, AR; tobacco: VA, NC, TN, KY |
| NorthernIndustry | manufacturing, coal | mfg: MA, RI, CT, NY, NJ, PA; (no `coal` in 1772 data) | mfg: NH, MA, RI, CT, NY, NJ, PA, DE, OH, IL; coal: PA |
| Expansionists | agriculture | (1856 card; no 1772 state exposure expected) | broad coverage as above |

The "no-`coal`-in-1772" / "no-`tobacco`-in-most-1856-states" cases are
**deliberate no-ops**, **not** errors. The spec explicitly relies on "skip-if-key-missing"
behavior (Edge cases) so a single combined `LOBBY_INDUSTRY` map is correct in
both eras with no era branch. Planters' `tobacco` entry being a no-op on a
state without tobacco is fine — the spec's "no need to gate" guidance.

### Save/migration impact
**None.** Confirmed by inspection of `src/db.ts:60` (`DB_VERSION = 1` stays).
Justification:
- `LOBBY_EXPERTISE`, `LOBBY_INDUSTRY`, `EXPERTISE_IDEOLOGY_LEAN`, `LOBBY_RULES`
  are static const tables, not snapshot fields.
- `state.industries` already persists in saves (verified — `State.industries`
  is at `types.ts:1265` and lives in the snapshot today).
- `factionCenter` recomputes on every call; the bias adds no cache.
- `addExpertise` writes to `p.expertise: Expertise[]` which already persists
  (verified at `types.ts:1214`).
- No new `careerGains` or feed shape is needed for the lobby-grant log; the
  grant only writes through `addLog` (same as the existing committee grant at
  `phaseRunners.ts:1872`).

## Engine changes (pure logic)

### A. `src/engine/phaseRunners.ts` — `factionCenter` (line 682–696)
Replace the body. **Determinism preserved** (no RNG, pure read of snapshot).
**Shape preserved** (`number | null`, integer in [0, 6]).

Outline:
1. Build `members` and the `null` early-return as today (line 683–684).
2. Compute `rawMean` exactly as today: leader weighted 1.5×, mean over
   `IDEOLOGY_ORDER.indexOf(p.ideology)`.
3. Compute `econLean`: `sum over members of (sum over p.expertise of
   EXPERTISE_IDEOLOGY_LEAN[x] ?? 0) / members.length` (use **per-member mean**,
   not weighted by leader — spec edge case "do not double-weight the leader in
   the lean term").
4. `biasedMean = rawMean + LOBBY_RULES.factionExpertiseBiasWeight * econLean`.
5. Return `clamp(Math.round(biasedMean), 0, 6)` using `clamp` already imported
   from `../rng` (verified line 9).

**Invariant tied to AC #9:** with all `EXPERTISE_IDEOLOGY_LEAN` set to 0,
`econLean = 0` for every faction → `biasedMean = rawMean` → identical output
to today, byte-for-byte. The QA-tester's playtest verifies this by setting the
three lean values to 0 in `types.ts`, restarting a save, observing every
`factionCenter`-consumer screen (Conversions, IdeologyShifts, FactionAlignments,
FactionLeaderPage) produces the pre-PR7 ideology labels, then restoring.

### B. `src/engine/phaseRunners.ts` — new Pass 3 in `runPhase_2_1_2_CareerTracks` (between line 470 and line 472)
Insert before `snap.politicians = refreshPv(snap.politicians);` (line 472).
Mirrors the existing exit-grant pattern at line 433–436.

Outline:
```
// Pass 3 — Lobby → Expertise trickle (PR7). Per faction, per held lobby
// card with a non-null expertise tag, per eligible living unretired member:
// chance(LOBBY_RULES.expertiseGrantOdds) → addExpertise → log on real change.
// Deterministic-modulo-seeded-RNG, same `chance()` source as the rest of 2.1.2.
for (const f of snap.factions) {
  for (const card of f.lobbyCards) {
    const xp = LOBBY_EXPERTISE[card];
    if (!xp) continue;
    for (const p of snap.politicians) {
      if (p.factionId !== f.id) continue;
      if (p.deathYear || p.retiredYear) continue;
      if (!chance(LOBBY_RULES.expertiseGrantOdds)) continue;
      if (addExpertise(p, xp)) {
        addLog(snap, '2.1.2', 'appointment',
          `${p.firstName} ${p.lastName} gains ${xp} expertise from the ${card} lobby.`);
      }
    }
  }
}
```
- **Determinism contract:** uses `chance()` from `../rng` (line 9 import, already
  present). No `Math.random` is introduced. Order is deterministic
  (factions × cards × politicians, all array iteration).
- **Edge case "draft years":** runs every 2.1.2 tick regardless of
  `year % 4 === 0`. The exit-grant at line 433 also runs every tick; this is
  consistent. `addExpertise` dedupes so a re-grant is a silent no-op (matches
  the existing committee/cabinet pattern at line 1871, 2161, 2205).
- **Trickle property (AC #3):** at 10% per member per tick, a 20-member
  faction expects ~2 grants/year for a single card — clearly not a flood.

Add `LOBBY_EXPERTISE`, `LOBBY_RULES` to the existing `types` import (line 2).

### C. `src/engine/phaseRunners.ts` — new lobby → industry nudge pass at top of `runPhase_2_1_8_FactionPersonalities` (after line 1593)
Insert immediately after the existing `if (!snap.game.factionAlignmentDrift)`
init (line 1592) and **before** Step 1 (the personality refresh at line 1599).
2.1.8 chosen over 2.2.1 because: (a) 2.1.8 already reads `f.lobbyCards` and
shapes alignment behavior, conceptually adjacent; (b) 2.2.1 is era-branched
(`if (snap.game.currentEra === 'independence')` at line 1786, separate CC
path), making the insertion uglier.

Outline:
```
// PR7 — Lobby → Industry +1 nudge (deterministic, no RNG). Per state, the
// union of {nudge keys from held lobby cards of every faction with a member
// representing this state} that already exist on s.industries is bumped +1,
// clamped to ≤5. Dedupe per-(state, key): at most one +1 per state per key
// per year regardless of how many factions/cards target it. Keys not already
// present on a state are NOT created.
for (const s of snap.states) {
  const bumped = new Set<string>();
  for (const f of snap.factions) {
    const hasMember = snap.politicians.some(
      (p) => p.factionId === f.id && p.state === s.id && !p.deathYear && !p.retiredYear);
    if (!hasMember) continue;
    for (const card of f.lobbyCards) {
      for (const key of LOBBY_INDUSTRY[card]) {
        if (bumped.has(key)) continue;
        if (!(key in s.industries)) continue;          // skip-if-missing
        if (s.industries[key] >= 5) { bumped.add(key); continue; } // clamp; mark to skip
        s.industries[key] = s.industries[key] + 1;
        bumped.add(key);
        addLog(snap, '2.1.8', 'system',
          `${s.name} ${key} industry rises (${card}).`);
      }
    }
  }
}
```
- **Living-member tie:** confirmed approved per CHECKPOINT 1: `member.state === s.id`.
  No new lookup; uses existing `Politician.state` and `State.id`.
- **Determinism:** zero RNG. Array iteration order (`snap.states`,
  `snap.factions`) is the snapshot's persisted order — deterministic.
- **AC #7 (per-key dedupe):** the `bumped` Set is reset per state; once a key
  bumps in a state, subsequent factions/cards targeting it in the same year
  are silently skipped.
- **AC #4 (no key creation):** the `if (!(key in s.industries)) continue;`
  guard is non-negotiable — the spec is explicit.
- **Logging:** "system" category (not "appointment") matches the 2.1.8 summary
  log at line 1777. One line per actual +1; capped states are silent (no log
  spam, per spec edge case "no log spam (only log on an actual change)").

Add `LOBBY_INDUSTRY` to the existing types import.

## UI changes

### `src/pages/StatesPage.tsx` — one JSX edit (line 28)
Change the `render` for the `industries` column from
`Object.keys(s.industries).join(', ')` to render entries-with-values. Match
the existing terse style:
```
render: (s) => (
  <span className="text-xs text-slate-500">
    {Object.entries(s.industries)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}
  </span>
),
```
- No new screen, no modal, no lobby-card management UI (out of scope).
- This is the only UI edit. All 5 existing `factionCenter` UI call sites
  (`Conversions.tsx:42`, `IdeologyShifts.tsx:45`, `FactionAlignments.tsx:75`,
  `FactionLeaderPage.tsx:19, 48`) inherit the blend automatically — they
  consume a `number | null` exactly as today.

## Files to touch (exact, ordered)
1. **`src/types.ts`** — add `LOBBY_EXPERTISE`, `LOBBY_INDUSTRY`,
   `EXPERTISE_IDEOLOGY_LEAN`, `LOBBY_RULES` consts after `ALIGNMENT_RULES`
   (after line 370, before line 371's `ALIGNMENT_DRIFT_CAP`). No type
   additions, no interface changes.
2. **`src/engine/phaseRunners.ts`** — three surgical edits in one file:
   (a) extend the `'../types'` import on line 2 to include `LOBBY_EXPERTISE`,
       `LOBBY_INDUSTRY`, `EXPERTISE_IDEOLOGY_LEAN`, `LOBBY_RULES`;
   (b) rewrite `factionCenter` body (lines 683–695) to add the bias blend;
   (c) insert Pass 3 in `runPhase_2_1_2_CareerTracks` between lines 470–472;
   (d) insert the industry-nudge pass at the top of
       `runPhase_2_1_8_FactionPersonalities` (after line 1593, before line 1599).
3. **`src/pages/StatesPage.tsx`** — replace the industries `render` on
   line 28 with entries-with-values output.

No new files, no helper extraction. The Pass 3 body is ~12 lines and the
nudge pass is ~18 lines — extracting either to a helper would only add
indirection. The `factionCenter` bias is local to that one function.

## Test / verification plan

### Build / typecheck (AC #12)
`npm run build` must pass (tsc strict + vite). No new lint waivers.

### Playtest — 1772 scenario (~10 years)
1. `npm run dev`, start the 1772 founding scenario as any faction holding
   `Planters` or `Merchants` (both are seeded 1772 lobby cards per
   `src/data/factions1772.ts`).
2. Advance ~5–10 turns (cover several 2.1.2 cycles and several 2.1.8 cycles).
3. **AC #3 (expertise trickle):** open the politicians page; over 5 turns
   confirm 2.1.2 logs grant `Agriculture` (or `Business`) expertise to *some*
   members holding the relevant card, not all members in one turn. The
   per-member-per-turn odds are 10%, so over 5 turns ~40% of a faction's
   members should have picked up a single tag.
4. **AC #6 (era-correct plantation crop):** confirm the 2.1.8 log shows
   `Virginia tobacco industry rises (Planters)` etc., **never**
   `... cotton ... (Planters)`. Open the States page; VA tobacco should
   incrementally climb from 4 toward 5; SC cotton should NOT move from the
   Planters card (it would only move via SlavePower in 1856).
5. **AC #4 (no key creation):** confirm NJ (industries `{agriculture: 3}`)
   never grows a `tobacco` or `cotton` key in the States page output, even
   if the player's faction holds Planters. The `Object.entries` cell should
   only ever list keys present at scenario seed.
6. **AC #11 (industry values visible):** confirm StatesPage shows
   `tobacco: 4, agriculture: 4` style strings, not `tobacco, agriculture`.
7. **AC #5 (UrbanLabor irrelevant in 1772):** not applicable to 1772 (no
   UrbanLabor card seeded). Verified by inspection of `LOBBY_INDUSTRY` and
   `LOBBY_EXPERTISE` — UrbanLabor expertise = `Labor` but industry = `[]`.

### Playtest — 1856 scenario (~10 years)
1. Start 1856 as a Northern faction holding `NorthernIndustry` and a Southern
   faction holding `SlavePower` (both are seeded — verify in
   `src/data/factions1856.ts`).
2. **AC #5 (UrbanLabor):** a faction holding `UrbanLabor` grants `Labor`
   expertise via 2.1.2 logs over several turns but produces **zero**
   industry-rise lines from UrbanLabor in 2.1.8.
3. **AC #6 (1856 plantation crop):** SlavePower-holding faction nudges both
   cotton and tobacco on states where those keys exist (AL cotton, VA tobacco).
4. **AC #7 (per-key dedupe):** in a state where two different factions both
   hold cards targeting the same key (e.g. PA: both NorthernIndustry and
   SmallFarmers nudge `agriculture` indirectly? — NorthernIndustry does not,
   but a state where two cards collide), confirm only one log line per
   (state, key) per year.
5. **AC #10 (boundary nudge demonstration):** find or construct a faction
   sitting exactly at the LW/RW personality bucket boundary (e.g.
   `factionCenter` exactly 2.5 with all members `Liberal`/`Moderate`).
   With every member holding `Agriculture` expertise the bias should push
   `factionCenter` from 2 → 3 (or 3 → 3, depending on rounding); with the
   bias weight zeroed it stays unchanged. The FactionAlignments page exposes
   `factionCenter` directly and is the easiest observation point.

### AC #9 — "identical to today when leans zeroed" (safety-net invariant)
Recommended verification: a brief in-place test by the qa-tester. Temporarily
set `Agriculture: 0, Business: 0, Labor: 0` in `EXPERTISE_IDEOLOGY_LEAN`,
restart a known save, open `FactionAlignmentsPage` and `IdeologyShiftsPage`,
record the `factionCenter` integer for every faction. Restore the lean values
in code, restart the same save, confirm the integers are byte-identical.
(This is a fast 30-second sanity check — no automated test scaffold exists in
the repo, per CLAUDE.md's "Build/typecheck prove correctness — not that the
game is fun or balanced.")

### AC #8 — determinism re-run
Save a snapshot at the start of a 2.1.8 tick (autosave already covers this);
manually replay the same phase (advance one turn, restore the save, advance
again); confirm `state.industries` values and every `factionCenter` integer
are identical on both runs. The only RNG source in PR7 is `chance()` in
Pass 3 (item 1), which is seeded; items 2 and 4 are pure deterministic
transforms.

### Edge cases from the spec to verify manually
- **Empty faction:** start a scenario, retire/kill all members of a small
  faction; confirm `factionCenter` returns `null` (FactionAlignments shows
  "—" or whatever the existing UI displays) and no NaN errors appear.
- **Member with no expertise tags:** confirm baseline factions (where most
  draftees start with empty `expertise`) show a small `econLean` and very
  small bias.
- **Industry already at 5:** confirm NY 1856 `finance: 5` is held at 5 by
  the clamp (never 6) when a Merchant-card faction has NY-resident members.
- **Cross-era safety:** confirm no console errors when a 1772 game advances
  through 2.1.8 (e.g. Planters' `tobacco` no-ops on most states without
  errors).

## Risks (ranked)

### 1. Indirect election impact via 2.1.5 ideology shifts (TOP)
**This is the spec's flagged top balance risk and is the designated playtest
focus.** The biased `factionCenter` flows into `runPhase_2_1_5_Ideology`
(lines 741, 811, 817 — drift pass and CPU pass): a biased center changes
which members the ideology-shift pass pulls toward center, slowly moving
their actual `p.ideology`, which then changes enthusiasm-driven vote share
in `calcStateVote` over several turns. With `factionExpertiseBiasWeight =
0.5` and `econLean ∈ [-1, +1]`, the maximum shift is ±0.5 index — sufficient
to tip a faction sitting exactly on a boundary, never to override a clear
member-ideology consensus. **Mitigation:** the playtest must run both
scenarios for at least 10 years (5 election cycles) and confirm that
faction centers and election outcomes move *plausibly and slowly*, not
abruptly. If a strong Agriculture-heavy faction's center jumps and triggers
sweeping ideology shifts in 2.1.5 that flip a state's election, dial down
`factionExpertiseBiasWeight` to 0.25 (single-line tuning change). The
mechanism is correct; only the magnitude is potentially over-tuned.

### 2. Industry-nudge ratcheting toward 5 across all dominant states
With every relevant state-faction tie nudging +1/year, the dominant industry
in every state will saturate at 5 over ~5 years. This is plausible (slavery's
cotton bloc *did* dominate by 1860) but means the StatesPage display becomes
visually monotonic. **Mitigation:** acceptable for PR7; industry **decay** is
explicitly out of scope. If saturation is too rapid in playtest, the per-year
+1 magnitude could be revisited in a follow-up (e.g. +1 every 2 years), but
this is a tuning concern not a correctness concern.

### 3. Lobby-card holdings churn via 2.1.8 alignment drift
2.1.8 itself can drop/add `lobbyCards` on factions (existing behavior, lines
1711–1770). The PR7 industry-nudge pass runs **before** 2.1.8's lobby drift
(at the top of the phase), so each year the nudge reflects the snapshot's
*incoming* lobby holdings, not the outgoing. This is the correct semantic
(the held card had effect this year before being dropped), but it does mean
the trickle expertise grant in 2.1.2 the *next* year will reflect the *new*
lobby holdings. Acceptable, but a subtle ordering decision worth flagging
for the qa-tester to confirm matches design intent.

## Determinism contract
- **Item 1 (Pass 3 grant)** uses `chance(LOBBY_RULES.expertiseGrantOdds)` per
  eligible member — the existing seeded RNG from `src/rng.ts:45`. Iteration
  order is `snap.factions × f.lobbyCards × snap.politicians`, all array
  order, deterministic.
- **Item 2 (industry nudge)** uses zero RNG. Pure transform: `snap.states ×
  snap.factions`, deterministic dedupe via per-state Set, clamp to ≤5.
- **Item 4 (factionCenter bias)** uses zero RNG. Pure arithmetic over the
  member list, identical iteration order to today, deterministic rounding
  with the same `Math.round` and same x.5→RW tie behavior.
- **No `Math.random` is introduced.** The pre-existing `Math.random` at
  `phaseRunners.ts:3652` (governor election jitter) is untouched per spec.

## What is out of scope (explicit)
- The pre-existing `Math.random` at `phaseRunners.ts:3652` (governor election
  jitter). Spec is explicit: not PR7's to fix.
- New lobby-card UI (acquiring, dropping, trading lobby cards). No new
  screen or modal.
- New industries (Natural Gas / High Tech / Alt Energy explicitly dropped).
- Industry **decay** or down-nudges. PR7 is +1 only.
- Modern/nationalism-era scenarios.
- Making `state.industries` values feed PV, `calcStateVote`, governance, or
  any system besides the StatesPage display.
- Changes to `electionFactionBias`, `lobbyToInterest`, interest-group
  scoring, or `calcStateVote` math.
- Reworking expertise *earn* sources from PR1 (tracks, committees, offices,
  cabinet, General-in-Chief). PR7 *adds* a new source via lobby cards; the
  existing five callers of `addExpertise` (lines 434, 1871, 2161, 2205 in
  phaseRunners.ts and 183 in continentalCongress.ts) are untouched.
- Skills (0–5), the 7-point ideology scale, draft-on-`year % 4`, the PV
  election driver. Indirect influence on the latter via 2.1.5 is the
  intended mechanism, not a change to the math.
- An IndexedDB save migration. `DB_VERSION` stays at 1; no new persisted
  fields are added.
