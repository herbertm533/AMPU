# Brief: Deaths & Retirements (Phase 2.4.1 Activation)

## Approach

Seventh 2.x activation. The 18-line runner is replaced wholesale with a four-step body (read era cfg → per-politician death roll with trait composition → per-politician retire roll without office gate → end-of-runner single `refreshPv`). The first-turn-skip line at `phases.ts:113` is deleted so 2.4.1 fires from turn 1 in 1772. All magic numbers move into a new `MORTALITY_RULES` const inserted after `LEADERSHIP_RULES` in `types.ts`, with `eraConfig: Record<Era, {...}>` exhaustiveness mirroring the Faction Leaders precedent. Cross-system cleanup (faction leadership and protégé bonds) is performed inline at the death/retire site to close the 1-turn window between this phase and the next 2.2.3 / 2.1.7 validation sweep — cheap (~5 lines per transition), defensive, and identical for both transitions so it's a single helper call. Roster gains a `Show retired` ephemeral `useState` toggle (default off), muted styling on retired rows, and a `Retired YYYY` badge replacing the office cell content. **Rejected**: adding a `Politician.deathCause`/scripted-death map (per spec out-of-scope); skipping the cross-system cleanup and relying solely on read-site defenses (the Faction Leaders / Kingmaker precedents already filter dead/retired at reads, but the spec explicitly binds proactive cleanup at criteria #10–12).

## State & type changes

All in `/home/user/AMPU/src/types.ts`.

### `MORTALITY_RULES` const (insert after `LEADERSHIP_RULES` ending at line 376)

```ts
export const MORTALITY_RULES = {
  // Age-banded base rates (descending; first matching threshold wins).
  // Anchored to modern (post-1980) US rates; era multipliers shape pre-modern.
  deathBracket: [
    { minAge: 80, rate: 0.18 },
    { minAge: 70, rate: 0.07 },
    { minAge: 60, rate: 0.025 },
    { minAge: 0,  rate: 0.005 },
  ],
  retireBracket: [
    { minAge: 70, rate: 0.08 },
    { minAge: 60, rate: 0.025 },
    { minAge: 0,  rate: 0.005 },
  ],

  // Trait multipliers (death only — retire is unaffected by traits in v1).
  frailDeathMult: 1.5,          // anchored: W.H. Harrison, FDR, Wilson, Calhoun, Webster
  crisisManagerDeathMult: 0.85, // gameplay-only; UI-flagged '(gameplay)' per historian

  // Per-era multipliers applied to base bracket rates.
  // Pre-1860 mortality ~1.5-2× modern; 1860-1900 ~1.2-1.5×; modern baseline.
  // retireMult floored at ~25% of modern's 1.5 per user-binding game-feel override.
  eraConfig: {
    independence: { deathMult: 1.8, retireMult: 0.5 },
    federalism:   { deathMult: 1.6, retireMult: 0.6 },
    nationalism:  { deathMult: 1.3, retireMult: 0.9 },
    modern:       { deathMult: 1.0, retireMult: 1.5 },
  } as const satisfies Record<Era, {
    deathMult: number;
    retireMult: number;
  }>,
} as const;
```

`satisfies Record<Era, ...>` mirrors `LEADERSHIP_RULES.eraConfig` (types.ts:370). `Era` is the four-member union at types.ts:490 — verified; adding a 5th era forces a compile-time update here.

### Politician / Faction / GameState — UNCHANGED

- `Politician.deathYear?: number` already at types.ts:427.
- `Politician.retiredYear?: number` already at types.ts:428.
- `Politician.factionLeaderOf?: string | null` already at types.ts:443 (Faction Leaders shipped).
- `Politician.protegeId?: string | null` already at types.ts:436 (mentor side).
- `Politician.bondedYear?: number` already at types.ts:421 (protégé side).
- `Faction.leaderId?: string | null` and `Faction.leadershipStartYear?: number` already at types.ts:454-455.
- `Trait` union already contains `'Frail'` (line 97) and `'Crisis Manager'` (line 69).
- `EventEntry.category` already contains `'death'` and `'retire'` (types.ts:595) — verified, no log-category addition needed.

**Faction cleanup completeness (architect call, see Risks)**: `Faction` has exactly two leadership-related fields: `leaderId` and `leadershipStartYear` (types.ts:454-455). There is NO `leaderSince` / `leaderHistory` / `leaderTermStartYear` field. Cleanup at criterion #10 is complete with the two clears called out in the runner.

### Save / migration impact

**No save migration required.** Zero new fields on `Politician` / `Faction` / `GameState`. Legacy saves load unchanged. The new runner is purely additive in behavior on the next tick. No `repair()` changes. No `db.ts` migration.

## Engine vs UI split

**Engine** (pure, deterministic, all randomness via `chance()`):
- `phases.ts:113` — delete one line (the first-turn skip).
- `phaseRunners.ts:1954-1971` — replace the 18-line `runPhase_2_4_1_Deaths` body wholesale.
- `phaseRunners.ts` imports — add `MORTALITY_RULES` to the existing `import { ... } from '../types'` at line 2.
- `vacateOffice` (phaseRunners.ts:1973-2005) — UNCHANGED.
- `pv.ts` — UNCHANGED (PV recompute happens via end-of-runner `refreshPv` call and `vacateOffice` clearing `currentOffice`; the `factionLeaderOf = null` cleanup also flows through `refreshPv` since `computePV` reads that field at pv.ts:81).

**UI** (component-local state, no snapshot mutation):
- `Roster.tsx` — add `useState<boolean>(false)` for `showRetired`, extend the filter at line 10, add a checkbox in the header row, mute retired rows, change Office column for retired rows to show `Retired YYYY` badge.

## Implementation steps

Ordered. A sub-architect can execute without re-reading the spec.

### Step 1 — Add `MORTALITY_RULES` const to types.ts

After `LEADERSHIP_RULES` closing `} as const;` at line 376, insert the `MORTALITY_RULES` const verbatim from the "State & type changes" section above. Keep one blank line of separation. No export type addition needed — TypeScript infers everything from the literal.

### Step 2 — Delete the first-turn skip in phases.ts

Delete line 113:

```ts
if (phaseId === '2.4.1') return false; // no deaths
```

Leave the surrounding `if (isFirstTurn) { ... }` block intact (still contains 2.1.3, 2.4.2, 2.5.1, 2.6.x, 2.7.x, 2.2.1/2 first-turn skips).

### Step 3 — Add `MORTALITY_RULES` to phaseRunners.ts imports

In the long type-value import at `phaseRunners.ts:2`, append `, MORTALITY_RULES` after `LEADERSHIP_FEED_CAP`. Single-token addition.

### Step 4 — Replace `runPhase_2_4_1_Deaths` body wholesale

Replace lines 1954-1971 with:

```ts
export function runPhase_2_4_1_Deaths(snap: FullGameSnapshot): void {
  const cfg = MORTALITY_RULES.eraConfig[snap.game.currentEra];

  const deathRateFor = (age: number): number => {
    for (const b of MORTALITY_RULES.deathBracket) {
      if (age >= b.minAge) return b.rate;
    }
    return 0;
  };
  const retireRateFor = (age: number): number => {
    for (const b of MORTALITY_RULES.retireBracket) {
      if (age >= b.minAge) return b.rate;
    }
    return 0;
  };

  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;

    // Death roll: bracket × era × trait composition.
    const baseDeath = deathRateFor(p.age);
    const frailMult = p.traits.includes('Frail') ? MORTALITY_RULES.frailDeathMult : 1;
    const crisisMult = p.traits.includes('Crisis Manager') ? MORTALITY_RULES.crisisManagerDeathMult : 1;
    const deathChance = clamp(baseDeath * cfg.deathMult * frailMult * crisisMult, 0, 1);

    if (chance(deathChance)) {
      p.deathYear = snap.game.year;
      cleanupLeadershipAndProtegeChains(snap, p);
      addLog(snap, '2.4.1', 'death', `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has died.`);
      vacateOffice(snap, p);
      continue;
    }

    // Retire roll: bracket × era. No office gate, no trait modifiers in v1.
    const retireChance = clamp(retireRateFor(p.age) * cfg.retireMult, 0, 1);
    if (chance(retireChance)) {
      p.retiredYear = snap.game.year;
      cleanupLeadershipAndProtegeChains(snap, p);
      addLog(snap, '2.4.1', 'retire', `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has retired.`);
      vacateOffice(snap, p);
    }
  }

  // Single refreshPv at end: picks up vacated offices, cleared factionLeaderOf
  // (which is read by computePV at pv.ts:81 for the +8 leader prestige), and
  // any downstream consumer reading pvCache in the same tick.
  snap.politicians = refreshPv(snap.politicians);
}
```

The order within each transition is binding: **(a) set deathYear/retiredYear → (b) cleanup cross-system → (c) addLog → (d) vacateOffice → (e) `continue` on death**. Rationale:
- Setting `deathYear` first means any inline read inside `cleanupLeadershipAndProtegeChains` that re-checks the politician sees them as dead. Defensive.
- Cleanup before addLog so the feed entry is the last side effect before vacateOffice; the log line is the canonical user-visible record after state has settled.
- `vacateOffice` last because it mutates the most cross-cutting state (state senators/reps arrays, cabinet, presidentId, etc.); putting it after cleanup means cleanup runs on a politician with intact `currentOffice` if a future consumer needs that context.
- `continue` after death so a dying politician cannot also roll retire this tick (matches the existing runner's behavior; spec criterion #8).

### Step 5 — Add `cleanupLeadershipAndProtegeChains` helper to phaseRunners.ts

Insert directly above `runPhase_2_4_1_Deaths` (around line 1953, after the 2.3.2 closing brace at 1949):

```ts
// Proactive cleanup invoked at every death/retire transition in 2.4.1.
// Closes the 1-turn window between this phase and the next 2.2.3 Step 2
// (leadership) and 2.1.7 (mentor/protégé) validation sweeps. The read-site
// defenses (factionLeaderOf checks via getFactionLeader; protégé reads
// filtered by !deathYear && !retiredYear) already cover correctness; this
// keeps DevTools inspection clean and removes the half-tick risk that a
// future read site forgets the filter.
function cleanupLeadershipAndProtegeChains(snap: FullGameSnapshot, p: Politician): void {
  // Faction leadership: this politician was a leader.
  if (p.factionLeaderOf != null) {
    const f = snap.factions.find((ff) => ff.id === p.factionLeaderOf);
    if (f) {
      f.leaderId = null;
      f.leadershipStartYear = undefined;
    }
    p.factionLeaderOf = null;
  }

  // Mentor side: this politician is a kingmaker holding a protégé.
  if (p.protegeId) {
    const protege = snap.politicians.find((q) => q.id === p.protegeId);
    if (protege) protege.bondedYear = undefined;
    p.protegeId = null;
  }

  // Protégé side: this politician is the protégé of some kingmaker.
  // Symmetric scan; clears every mentor that pointed at this id.
  for (const q of snap.politicians) {
    if (q.protegeId === p.id) {
      q.protegeId = null;
    }
  }
  // bondedYear lives on the protégé (self); we don't need to clear it here
  // because the politician is now dead/retired and won't be read as a protégé
  // (all 5 protégé read sites filter !deathYear && !retiredYear). Leave it
  // for forensic value; vacateOffice does not touch bondedYear either.
}
```

Field-name correctness verified against existing code:
- `protegeId` lives on the **mentor** (kingmaker holds the pointer); `bondedYear` lives on the **protégé** (per types.ts:421 comment "year the current bond on this PROTÉGÉ was formed"). Verified at phaseRunners.ts:1220-1221 (`assignProtege` sets `k.protegeId = c.id; c.bondedYear = g.year;`) and 1237-1238 (release sets `k.protegeId = null; c.bondedYear = undefined`).
- `factionLeaderOf` mirrors `Faction.leaderId` (types.ts:443).

### Step 6 — Update Roster.tsx for `showRetired` toggle and muted retired rows

Replace `Roster.tsx` wholesale (it's only 46 lines):

```tsx
import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import type { Politician } from '../types';

export function Roster(): JSX.Element {
  const { snapshot } = useGame();
  const [showRetired, setShowRetired] = useState(false);
  if (!snapshot) return <div />;
  const { politicians, game } = snapshot;
  const mine = politicians.filter(
    (p) => p.factionId === game.playerFactionId && !p.deathYear && (showRetired || !p.retiredYear),
  );
  const activeCount = mine.filter((p) => !p.retiredYear).length;
  const retiredCount = mine.length - activeCount;

  const columns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className={`font-semibold ${p.retiredYear ? 'text-slate-500 dark:text-slate-400' : ''}`}>{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'State', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'party', label: 'Party', sortValue: (p) => p.partyId ?? '', render: (p) => <PartyBadge party={p.partyId} /> },
    { key: 'ideo', label: 'Ideology', sortValue: (p) => p.ideology },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, className: 'text-right font-mono', render: (p) => <span className={`font-bold ${p.retiredYear ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{p.pvCache}</span> },
    { key: 'cmd', label: 'Cmd', sortValue: (p) => p.command, className: 'text-right' },
    { key: 'admin', label: 'Adm', sortValue: (p) => p.skills.admin, className: 'text-right' },
    { key: 'leg', label: 'Leg', sortValue: (p) => p.skills.legislative, className: 'text-right' },
    { key: 'jud', label: 'Jud', sortValue: (p) => p.skills.judicial, className: 'text-right' },
    { key: 'mil', label: 'Mil', sortValue: (p) => p.skills.military, className: 'text-right' },
    { key: 'gov', label: 'Gov', sortValue: (p) => p.skills.governing, className: 'text-right' },
    { key: 'back', label: 'Back', sortValue: (p) => p.skills.backroom, className: 'text-right' },
    {
      key: 'office',
      label: 'Office',
      sortValue: (p) => p.retiredYear ? 'zzy' : (p.currentOffice?.type ?? 'zzz'),
      render: (p) => {
        if (p.retiredYear) {
          return <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">Retired {p.retiredYear}</span>;
        }
        return p.currentOffice ? <span className="text-xs">{officeName(p)}</span> : <span className="text-xs text-slate-400">{p.careerTrack ?? 'Free'}</span>;
      },
    },
    { key: 'traits', label: 'Traits', sortValue: (p) => p.traits.join(','), render: (p) => <span className="text-xs">{p.traits.slice(0, 2).join(', ')}</span> },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold">
          Roster — {mine.length} Politicians
          {showRetired && retiredCount > 0 && (
            <span className="text-xs font-normal text-slate-500 ml-2">({activeCount} active, {retiredCount} retired)</span>
          )}
        </h2>
        <label className="text-xs text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="rounded"
            checked={showRetired}
            onChange={(e) => setShowRetired(e.target.checked)}
          />
          Show retired
        </label>
      </div>
      <SortableTable rows={mine} columns={columns} rowKey={(p) => p.id} initialSort={{ key: 'pv', dir: 'desc' }} />
    </div>
  );
}

function officeName(p: Politician): string {
  const o = p.currentOffice;
  if (!o) return '';
  if (o.type === 'Senator' || o.type === 'Representative' || o.type === 'Governor') {
    return `${o.type} (${(o.stateId ?? p.state).toUpperCase()})`;
  }
  return o.type;
}
```

Placement rationale for the toggle: top-right of the header row, parallel to the `<h2>` title, using a `<label>` wrapping a native `<input type="checkbox">` with Tailwind classes. The codebase has no existing checkbox/toggle component pattern (verified via Grep — no `type="checkbox"` anywhere). The pattern matches the FactionLeaderPage header layout (`flex items-baseline justify-between gap-3 flex-wrap`) at FactionLeaderPage.tsx:75. Native checkbox is the simplest TypeScript-clean choice and matches the project's "minimal abstractions" convention.

The muted styling uses `text-slate-500 dark:text-slate-400` on the Name and PV cells (the most visually prominent columns). `SortableTable` does not support per-row className via `Column<T>` — verified at SortableTable.tsx:3-9; injecting per-row opacity at the row wrapper would require a new prop. Per-cell muted text is sufficient and keeps the change minimal. Sort behavior: retired rows sort mixed in with active by the user's chosen column; the office column's `sortValue` returns `'zzy'` for retired (one less than `'zzz'` for free agents) so when sorted ascending alphabetically retired rows cluster slightly distinctly — a minor concession to grouping without imposing a separate section.

### Step 7 — Skip the Frail / Crisis Manager trait tooltip update in this brief

**Architect call**: The spec's Open Question #6 mandates the `(gameplay)` flag for Crisis Manager and updated text for Frail. **Defer to a polish follow-up**, not in this brief's scope. Rationale:
1. No `TraitChip` or shared `TRAIT_BLURB` component exists outside `FactionLeaderPage.tsx` (verified by Grep: `TRAIT_BLURB` is local to that file at line 30, blurbs are leader-trait-specific).
2. Adding tooltip blurbs for Frail and Crisis Manager requires identifying the surfaces (Roster's Traits column uses raw `p.traits.slice(0, 2).join(', ')` with no tooltip; DraftScouting and Draft also render traits without hover tooltips).
3. To do this properly would touch 3-4 files (a new `traitBlurbs.ts` lookup or 4 inline patches), exceeds the "≤5 LoC in one file" threshold, and is genuinely a polish surface independent of the runner activation.

Note in the brief that the trait UI flag is deferred and flagged in Risks.

## Test plan

### Build & typecheck

- `npm run lint` (typecheck only). The `satisfies Record<Era, {...}>` clause enforces all four eras are present; missing one is a compile error.
- `npm run build`. Production bundle. No `MORTALITY_RULES` runtime check beyond what `chance()` already validates.

### Determinism

Start a fresh 1772 scenario, advance 5 turns, note the death/retire feed entries. Restart the scenario with the same seed, advance 5 turns: feed entries should match exactly (same names, same years). Re-verify after a refresh (the IndexedDB save reloads the same seed state).

### 1772 turn-1 first-turn-skip removal

Start the 1772 scenario. The phase log on turn 1 should now include a 2.4.1 entry (Deaths & Retirements ran). Expected ~1-2 turn-1 deaths from the senior cohort (Franklin at 66 has `0.025 × 1.8 = 4.5%/yr` death chance; ~5 politicians in the 60+ band sum to ~0.45 expected deaths, plus tiny contributions from the under-60 majority). If 4+ deaths fire on turn 1 across multiple seeds, the spec's Open Question 1 advises lowering `independence.deathMult` to 1.6 — single-const tune.

### Worked examples (verify in DevTools or by reading the runner)

- **Independence age 60, no traits**: `0.025 × 1.8 × 1 × 1 = 0.045` → 4.5%/yr death; retire `0.025 × 0.5 = 0.0125` → 1.25%/yr. Matches spec § Worked example.
- **Modern age 70, no traits**: `0.07 × 1.0 × 1 × 1 = 0.07` → 7%/yr death; retire `0.08 × 1.5 = 0.12` → 12%/yr. Matches spec.
- **Independence age 60 with Frail**: `0.045 × 1.5 = 0.0675` → 6.75%/yr.
- **Independence age 60 with Crisis Manager**: `0.045 × 0.85 = 0.038` → 3.8%/yr.
- **Both Frail AND Crisis Manager at independence age 60**: `0.025 × 1.8 × 1.5 × 0.85 = 0.0574` → 5.74%/yr (i.e., the trait composition `1.5 × 0.85 = 1.275`).

### Cross-system cleanup verification

1. **Dead leader's faction has `leaderId = null` immediately** (criterion #10). Force-kill a leader via DevTools (`snap.politicians.find((p) => p.id === SOME_LEADER).deathYear = year`) then run 2.4.1 once. The leader's faction should have `f.leaderId === null` and `f.leadershipStartYear === undefined` BEFORE the next 2.2.3 tick. No 1-turn stale window.
2. **Dead mentor's protégé has `protegeId` cleared on both sides** (criteria #11-12). Pair a Kingmaker with a protégé via the Kingmakers page. Force-kill the mentor in DevTools. After 2.4.1 runs, the mentor's `protegeId` is null AND the protégé's `bondedYear` is undefined.
3. **Dead protégé**: force-kill a protégé (the mentor's `protegeId` points at them). After 2.4.1, the mentor's `protegeId` is null (the symmetric scan in `cleanupLeadershipAndProtegeChains`).

### Roster page

1. Open Roster on a fresh 1772 scenario. The `Show retired` checkbox is present in the header row, unchecked by default. Header reads `Roster — N Politicians` (no parenthetical).
2. Advance turns until at least one player-faction politician retires (1772 retire rate is 1.25%/yr at age 60; ~10 turns × 20 politicians × 1.25% ≈ expected 2-3 retirements over 10 turns).
3. Toggle `Show retired` on. The retired politician appears in the table. Header now reads `Roster — N Politicians (A active, R retired)`. The retired row's Name and PV cells use muted text (`text-slate-500`). The Office column shows a `Retired YYYY` badge instead of office/career-track text.
4. Sort by PV descending. The retired row sorts mixed in by PV (its raw `pvCache` is used as the sort value). Sort by Office ascending: retired rows cluster near the end (alphabetic `'zzy'`).
5. Toggle off. Retired rows disappear; header returns to compact form. Dead politicians remain unconditionally filtered (no `Show dead` toggle in v1).

### Edge cases (manual sanity)

- A free agent (no `currentOffice`) who rolls retire: `vacateOffice` early-returns at line 1974 (`if (!p.currentOffice) return;`). `retiredYear` is set, cleanup runs, no crash.
- A politician with `factionLeaderOf` set but their `Faction.leaderId` already null (mid-corrupt-state from a future bug): the cleanup's `if (f)` guard handles missing faction; the politician's own `factionLeaderOf` clears regardless.
- Empty player faction after cascading deaths: no crash. Roster shows `Roster — 0 Politicians`; the table renders empty. Game-loss conditions are handled elsewhere (not this spec's concern).

## Risks

1. **`MORTALITY_RULES` does not include `MORTALITY_FEED_CAP`.** The spec explicitly forbids it; the existing `addLog` infrastructure handles narration. Reviewer should NOT add a structured feed entry type. (Easy regression for a future contributor.)
2. **End-of-runner `refreshPv` call — architect call: YES, KEEP.** Rationale: `cleanupLeadershipAndProtegeChains` clears `factionLeaderOf` which is read by `computePV` at pv.ts:81 for the +8 leader prestige bump. Without `refreshPv` here, a dead leader's `pvCache` would still include +8 until the next phase's natural recompute. The dead politician is filtered out of all eligibility reads, so it's not a correctness bug — but Roster shows the politician (when `Show retired` is on we'd show the dead, but dead are unconditionally filtered so this specific case is benign; the retired case IS visible to the user). The `refreshPv` call costs O(n) per turn (we already pay it in 2.2.3 and elsewhere); the symmetry with `runPhase_2_2_3_FactionLeaders` Step 4 (per Faction Leaders brief) is worth the consistency. **Decision: include the `snap.politicians = refreshPv(snap.politicians)` call at the end of the runner.**
3. **1.5× factionCenter weight still applies.** The Faction Leaders spec already shipped the 1.5× weight in `factionCenter` (phaseRunners.ts), so when a leader dies and `factionLeaderOf` clears (via cleanup), the very next read of `factionCenter` for that faction sees no leader → uniform weight 1. This is correct behavior, but the integer bucket can flip at the upgrade tick; if any 2.4.1 death triggers a personality flip that cascades into a chain of unexpected 2.1.5 / 2.1.6 / 2.1.8 events on the SAME tick, hard to debug. Mitigation: `2.4.1` runs before `2.1.5/6/8` in the next half-turn (it's the LAST phase in 2.4.x for this turn), so the cascade hits next turn naturally — no within-tick chain. Low risk.
4. **`leaderId` is `null` after cleanup but the faction has eligible members.** Next 2.2.3 Step 2 detects the vacancy and runs an Election (per Faction Leaders runner Step 2). One `installed` feed entry per dead-leader faction on the following turn. Expected, documented in Faction Leaders spec criterion #34.
5. **Trait UI flag for `Crisis Manager (gameplay)` is deferred.** Spec Open Question 6 mandates the flag at criterion #6 sites. This brief defers it because the codebase lacks a shared trait-tooltip surface. Risk: the player has no in-UI indication that Crisis Manager affects mortality. Mitigation: feed entries narrate every death; a follow-up polish PR can add a `TRAIT_MORTALITY_BLURB` map to a single new file and wire it into Roster's traits column and DraftScouting. Flag for the next polish cycle.
6. **Builder must NOT accidentally re-introduce the `if (p.currentOffice)` retire gate.** The original 18-line runner gated retire on office; the spec binds this is lifted (Layer 3, criterion #7). A copy-paste-then-modify approach risks leaving the gate. The runner replacement is wholesale, not a patch — verify the binary text contains no `if (p.currentOffice && chance(retireChance))`.
7. **`continue` after death is preserved.** Spec criterion #8. A politician cannot both die AND retire in one tick. The `continue` at the end of the death branch is binding; without it, the politician would also roll retire (low probability of both firing, but still wrong).
8. **`Roster.tsx` rewrite is wholesale, not surgical.** The original 46 lines are fully replaced. Builder should verify no other file imports anything from `Roster.tsx` besides the default-named export — Grep confirms `Roster` is only registered at `registry.ts` and consumed by the page system; no shared helpers leak.

## Dependencies / sequencing

None. All four 2.x predecessors (Relocations, Ideology, Conversions, Kingmakers, Alignment Drift, Faction Leaders) are already shipped. The Faction Leaders precedent (the `factionLeaderOf` field, the `LEADERSHIP_RULES` pattern, the `satisfies Record<Era, ...>` device, the `getFactionLeader` defense) is in place and directly informs this brief's cleanup discipline. The Kingmaker precedent (`protegeId` / `bondedYear` semantics) is in place.

This is a single-PR feature. No staged rollout. No flag.

## What NOT to do

Explicit list to keep the implementation from drifting:

- **NO new `Politician.deathCause` field.** All deaths log uniformly via `addLog`'s text string. No `'natural' | 'duel' | 'assassination'` taxonomy.
- **NO scripted historical deaths map.** No `HISTORICAL_DEATHS: Record<string, number>` keyed by `firstName_lastName`. Hamilton can survive to 80; Washington can die at 50.
- **NO `MORTALITY_FEED_CAP` const.** No structured feed entry type. Use `addLog(snap, '2.4.1', 'death' | 'retire', ...)` only.
- **NO dueling sub-system.** Per spec out-of-scope. Even if the player or a contributor proposes it during implementation, defer.
- **NO new Deaths page in `registry.ts` / `Sidebar.tsx`.** Roster + EventLog are sufficient.
- **NO `Show dead` Roster toggle.** Only `Show retired` in v1.
- **NO retroactive scripted-death backfill on legacy saves.** No `repair()` migration. No `db.ts` change.
- **NO trait modifiers on retire chance** in v1. Frail-retires-early, Crisis-Manager-stays-late, etc. are v2 flags.
- **NO era-conditional log text** ("withdraws to private life" pre-1796 vs "retires" post-1935). Uniform string "has retired" in v1.
- **NO modification of `vacateOffice`.** The function correctly handles all office types; the runner calls it; that's the contract.
- **NO new traits.** `'Frail'` and `'Crisis Manager'` already exist in the `Trait` union.
- **NO new `Politician`, `Faction`, or `GameState` fields.** All required state already exists.
- **NO `if (p.currentOffice)` retire gate.** The binding lift (Layer 3, criterion #7) is non-negotiable.
- **NO splitting of `cleanupLeadershipAndProtegeChains` into separate `cleanupLeadership` / `cleanupProtege` helpers.** One helper, two transition sites; matches the "minimal abstraction" CLAUDE.md convention.

---

Brief path: `/home/user/AMPU/docs/briefs/deaths-retirements.md`

## Checkpoint-2 summary

- **File count**: 3 — `src/types.ts`, `src/phases.ts`, `src/engine/phaseRunners.ts`, `src/pages/Roster.tsx`. (4 files; counted phases.ts as a one-line delete.)
- **LoC estimate**: ~120 lines added / ~30 modified / 1 deleted. Breakdown: `types.ts` +28 (the const); `phases.ts` -1; `phaseRunners.ts` +60 (helper + replacement runner) – 18 (old runner); `Roster.tsx` +25 net (wholesale rewrite of a 46-line file to ~65 lines).
- **Riskiest implementation step**: Step 4 (replacing `runPhase_2_4_1_Deaths`). The order-of-operations binding (set deathYear → cleanup → addLog → vacateOffice → continue) is the critical correctness contract, and the `clamp(... , 0, 1)` discipline on both `deathChance` and `retireChance` plus the trait-composition logic (`frailMult × crisisMult` multiplicative, never cancel) all live in this one function. The cleanup helper is the second-riskiest — getting `protegeId` (mentor) vs `bondedYear` (protégé) right requires reading the existing Kingmaker code, not inferring from field names.
- **Single most important architect-only decision**: Include the end-of-runner `snap.politicians = refreshPv(snap.politicians)` call (spec Open Question 10). The PV-on-leader-death freshness consideration tips it; symmetry with 2.2.3 Step 4 reinforces it. Documented in Risks #2.
- **Recommend single PR**: YES, single PR. The feature is tight: one const, one phase activation, one runner rewrite, one helper, one page rewrite. No backwards-compat shim, no migration, no staged rollout. Splitting (e.g., "Layer 1 engine first, Layer 4 UI second") would force two playtests and double the review surface for no gain — the engine without the UI shows muted retired-row absence as a regression on the playtest path. Single PR.
