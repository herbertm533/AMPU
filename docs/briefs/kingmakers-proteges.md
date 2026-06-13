# Brief: Kingmakers & Protégés (Phase 2.1.7)

## Approach
Delete the placeholder `runPhase_2_1_7_Kingmakers` (phaseRunners.ts:1114–1124) and rebuild 2.1.7 as the fifth structural clone of the 2.1.x resting-window arc: an Advance-out tick that runs eager init → trait-grant pass (era-aware command gate) → lifecycle-sweep → graduation pass → CPU auto-assign → one unconditional `refreshPv` → one conditional summary log; player assigns/releases via two pure mutators (`assignProtege` / `releaseProtege`) clones of `attemptPlayerConversion`'s contract; one shared candidacy helper `protegeCandidates` is read by the resolver, the CPU pass, AND the page so preview === rule. The 2.1.2 acceleration is the cross-phase payoff and lives at the call site in `runPhase_2_1_2_CareerTracks` Pass 2 (NOT inside `rollThreshold`): after the normal `rollThreshold(snap, p, p.careerTrackYears)`, if `hasMentor(snap, p)` is true, a tiny new helper `rollMentorBonusSkill(snap, p, thresholdYears)` runs ONLY the skill block again — the second call must re-resolve below-cap skills from scratch because the first call may have already raised the chosen skill, changing which skills are below-cap. The read uses a new prodigy-only `hasMentor(snap, p)` predicate (not the broader `mentorBondAnchored`, which fires in both directions and would wrongly accelerate a Kingmaker for being someone's mentor — assumption #6). `isKingmaker` is removed from `Politician` and trait-derived everywhere (pv.ts:75 changes to a trait read, +6 preserved). The era-aware command gate uses `snap.game.scenarioId` (the field already exists and is referenced at phaseRunners.ts:28/98/1352/1393 and phases.ts:66 — battle-tested string keys) via a single helper `eraCommandGate(scenarioId)` keyed on `KINGMAKER_RULES.commandGateByScenario`; rejected the year-bracket alternative because scenario id is the explicit source of truth used everywhere else for era-divergent logic, and a future era will likely ship a new scenario id rather than re-bucket years. The draft top-up at 2.1.1 (uniform-random from the top half by PV) is the first cross-phase touchpoint outside the 2.1.2 link and is flagged as scope creep — see Risks. The page diverges from `Conversions.tsx` in one structural way: it is a roster-list of Kingmaker cards (one per Kingmaker, current protégé inline, "Choose protégé" expands into a candidate sub-table from `protegeCandidates`), NOT a single roster table with an Action column — because the subject of every action is a Kingmaker who owns at most one slot, not a politician you act ON. Rejected alternative: a third sortable table view sharing the Conversions skeleton — would force a Kingmaker → candidate two-step into one row (clunky) and would lose the per-Kingmaker slot-empty/slot-filled affordance.

## State & type changes
- `/home/user/AMPU/src/types.ts`:
  - `Politician` (lines 276–308):
    - **Remove** `isKingmaker: boolean;` (line 302). The trait `'Kingmaker'` (already in the `Trait` union line 70 and `POSITIVE_TRAITS` line 116) is the single source of truth.
    - `protegeId?: string | null;` (line 303) **kept unchanged**.
    - Directly after `lastConversionAttemptYear?: number;` (line 287) add:
      ```ts
      bondedYear?: number; // year the CURRENT bond on this protégé was formed; drives the 20-year graduation clock; lives on the PROTÉGÉ
      ```
  - `GameState` (line 545+) — directly after `conversionAttempts?` (line 594) add:
    ```ts
    kingmakers?: KingmakerEntry[];
    ```
    **No** `kingmakerAttempts` field (free-assignment model — no shared attempt counter).
  - New interface directly after `ConversionEntry` (lines 647–659):
    ```ts
    export interface KingmakerEntry {
      year: number;
      kind: 'anointed' | 'bonded' | 'graduated' | 'dissolved';
      politicianId: string;     // for 'anointed' = the newly-trait-granted politician
      mentorId?: string;        // bonded / graduated / dissolved
      protegeId?: string;       // bonded / graduated / dissolved
      factionId: string;        // mentor's faction (anointed: the politician's faction)
      reason?: 'death' | 'retire' | 'defect' | 'released' | 'draft-floor';
      trigger?: 'tenure' | 'office';
      actor?: 'player' | 'cpu';
    }
    ```
  - New consts directly after `CONVERSIONS_CAP` (line 244) — single source for engine AND legend:
    ```ts
    // Kingmaker tables — single source for engine rolls AND the page legend.
    export const KINGMAKER_RULES = {
      commandGateByScenario: { '1772': 1, '1856': 4 } as Record<string, number>,
      commandGateDefault: 4,
      factionFloor: 10,
      protegeMaxAge: 45,
      protegeMinPv: 20,
      graduationYears: 20,
      eligibleProtegeOffices: ['Representative', 'Governor'] as const,
      graduationOffices: ['Senator', 'President'] as const,
      graduationOdds: { command: 0.45, trait: 0.45, both: 0.10 },
      commandCap: 5,
      poachResistance: 0.5, // legend cross-reference to CONVERSION_ODDS.willingness.mentorBond; resolver still reads the conversions const
    } as const;
    export const KINGMAKERS_CAP = 200;
    ```
    `as const` notes: `commandGateByScenario` is typed `Record<string, number>` (NOT `as const`-narrowed) so the helper can index by arbitrary scenario id at runtime and fall through to `commandGateDefault`; literal-typed odd values widen fine in arithmetic; the office arrays are `as const` so they're typed as readonly literals matching `OfficeType`.

- **Save/migration impact**: `bondedYear` and `kingmakers` optional — legacy IndexedDB saves load unchanged. **No `repair()` changes** (binding, established pattern). The `isKingmaker` field is GONE from saves — TypeScript's structural typing means legacy `Politician` records with `isKingmaker: true/false` are read into the new shape and the extra property survives in-memory as an untyped key but is silently dropped on the next `JSON.parse(JSON.stringify(snapshot))` clone (every player action). The trait-grant pass (command ≥ `eraCommandGate`) re-derives the correct set on the first 2.1.7 tick after load: legacy 1856/draft saves where `isKingmaker:true` aligned with command≥4 will regain `'Kingmaker'` immediately; legacy 1772 saves where command≥1 had `isKingmaker:true` retain it via the era-1 gate. The accepted correction (spec assumption #2): a hand-edited save with `isKingmaker:true` but command < gate loses Kingmaker status unless they already hold the trait themed-naturally. `bondedYear` backfill is implicit: the graduation pass treats `(bondedYear ?? snap.game.year) - snap.game.year` so legacy bonds whose protégé lacks `bondedYear` are treated as bonded "this year" (the 20-year clock starts now, never fires a surprise instant graduation); office-trigger still fires immediately if the legacy protégé is already a Senator/President. No separate migration step.

## Engine changes (pure logic)
All in `/home/user/AMPU/src/engine/phaseRunners.ts`, replacing the 2.1.7 section (delete lines 1114–1124 wholesale). Import additions: add `KingmakerEntry` to the type import (line 1) alongside `ConversionEntry`; add `KINGMAKER_RULES`, `KINGMAKERS_CAP` to the value import (line 2). `chance`/`rand`/`pick`, `POSITIVE_TRAITS`, `refreshPv`, `addLog` already imported. **REUSE `mentorBondAnchored` (already exported at line 837) unchanged.** All randomness via rng.ts; all passes iterate `snap.politicians` / `snap.factions` in array order. `engine.ts`, `phases.ts`: **no changes** (2.1.7 already rests via `return {}` at engine.ts:34; 2.1.7 is not first-turn-skipped, runs 1772 turn 1 — verified). pv.ts: ONE line change (criterion 4 below).

### Era detection helper (top of the 2.1.7 section)

- **New private `eraCommandGate(scenarioId: string): number`** — single source for both the trait-grant pass and the draft top-up:
  ```ts
  function eraCommandGate(scenarioId: string): number {
    return KINGMAKER_RULES.commandGateByScenario[scenarioId] ?? KINGMAKER_RULES.commandGateDefault;
  }
  ```
  Default 4 catches any future scenario id; explicit `'1772' → 1`, `'1856' → 4`.

### Helpers (pure, two exported)

- **New exported pure `hasMentor(snap: FullGameSnapshot, p: Politician): boolean`** — prodigy-direction only; the second branch of `mentorBondAnchored`. Read at 2.1.2 ONLY:
  ```ts
  export function hasMentor(snap: FullGameSnapshot, p: Politician): boolean {
    if (!p.factionId) return false;
    return snap.politicians.some((m) => m.protegeId === p.id && m.factionId === p.factionId && !m.deathYear && !m.retiredYear);
  }
  ```
  **WHY a Kingmaker doesn't get accelerated for being someone's mentor**: candidacy gate #6 (`!c.traits.includes('Kingmaker')`) excludes Kingmakers from being protégés, so a "mentor who is also someone else's protégé" is impossible AT ASSIGN TIME. The narrower predicate matters only post-hoc — if a bonded protégé later gains the `'Kingmaker'` themed trait via Backroom track (or via crossing into command threshold during era systems and getting trait-granted at the next 2.1.7) AND that newly-Kingmaker politician later takes their own protégé. In that branch `hasMentor` still fires (their original mentor still has `protegeId === their.id`) and accelerates correctly; using `mentorBondAnchored` would have double-counted via the new mentor-direction.

- **New exported pure `protegeCandidates(snap: FullGameSnapshot, kingmakerId: string): Politician[]`** — the gate #1–#9 list, used by the resolver, the CPU pass, AND the page (preview === rule):
  ```ts
  export function protegeCandidates(snap: FullGameSnapshot, kingmakerId: string): Politician[] {
    const k = snap.politicians.find((p) => p.id === kingmakerId);
    if (!k || !k.factionId || k.deathYear || k.retiredYear) return [];
    if (!k.traits.includes('Kingmaker')) return [];
    return snap.politicians.filter((c) => {
      if (c.id === k.id) return false;
      if (c.factionId !== k.factionId || !c.factionId) return false;
      if (c.state !== k.state) return false;
      if (c.deathYear || c.retiredYear) return false;
      if (snap.politicians.some((m) => m.protegeId === c.id && !m.deathYear && !m.retiredYear)) return false; // one-mentor-per-prodigy
      if (c.traits.includes('Kingmaker')) return false;
      if (c.age >= KINGMAKER_RULES.protegeMaxAge) return false; // young
      const t = c.currentOffice?.type;
      if (t && t !== 'Representative' && t !== 'Governor') return false; // pre-Senate
      if (c.pvCache < KINGMAKER_RULES.protegeMinPv) return false; // PV threshold (>=, 1-PV cosmetic shift from the old runner's >20)
      return true;
    });
  }
  ```

### Mutators (two exported)

- **New `recordKingmaker(snap, entry: KingmakerEntry): void`** — mirror of `recordConversion`: init array, push, splice to `KINGMAKERS_CAP`.

- **New exported `assignProtege(snap: FullGameSnapshot, kingmakerId: string, protegeId: string): boolean`** — phase-locked to `'2.1.7'`; validates Kingmaker (alive, non-retired, has trait, slot empty); validates candidate via `protegeCandidates` (the full gate; defensive re-check of one-mentor-per-prodigy). Boolean contract clone of `attemptPlayerConversion`:
  ```ts
  // Contract clone of attemptPlayerConversion: TRUE means the assignment APPLIED
  // (mutation + feed entry written, caller must persist); FALSE means rejected,
  // nothing changed.
  export function assignProtege(snap: FullGameSnapshot, kingmakerId: string, protegeId: string): boolean {
    const g = snap.game;
    if (g.phaseId !== '2.1.7') return false;
    const k = snap.politicians.find((p) => p.id === kingmakerId);
    if (!k || k.deathYear || k.retiredYear || !k.factionId) return false;
    if (!k.traits.includes('Kingmaker')) return false;
    if (k.protegeId) return false; // slot full
    const candidates = protegeCandidates(snap, kingmakerId);
    const c = candidates.find((cc) => cc.id === protegeId);
    if (!c) return false;
    k.protegeId = c.id;
    c.bondedYear = g.year;
    if (!g.kingmakers) g.kingmakers = [];
    recordKingmaker(snap, {
      year: g.year, kind: 'bonded',
      politicianId: c.id, mentorId: k.id, protegeId: c.id,
      factionId: k.factionId, actor: 'player',
    });
    return true;
  }
  ```
  **No `addLog`, no `refreshPv` inside** (assign doesn't move PV inputs — Kingmaker's +6 is on the mentor regardless; the protégé didn't gain a trait or skill).

- **New exported `releaseProtege(snap: FullGameSnapshot, kingmakerId: string): boolean`** — phase-locked; validates Kingmaker has a non-null protégé:
  ```ts
  export function releaseProtege(snap: FullGameSnapshot, kingmakerId: string): boolean {
    const g = snap.game;
    if (g.phaseId !== '2.1.7') return false;
    const k = snap.politicians.find((p) => p.id === kingmakerId);
    if (!k || !k.protegeId || !k.factionId) return false;
    const c = snap.politicians.find((p) => p.id === k.protegeId);
    const protegeId = k.protegeId;
    k.protegeId = null;
    if (c) c.bondedYear = undefined;
    if (!g.kingmakers) g.kingmakers = [];
    recordKingmaker(snap, {
      year: g.year, kind: 'dissolved',
      politicianId: protegeId, mentorId: k.id, protegeId,
      factionId: k.factionId, reason: 'released', actor: 'player',
    });
    return true;
  }
  ```

### Draft-year top-up (one call into 2.1.1)

- **New private `runDraftKingmakerTopUp(snap: FullGameSnapshot): void`** — called from `runPhase_2_1_1_Draft` AFTER the CPU-pick `while` loop completes its rookie-faction-assignment work. Insertion point: phaseRunners.ts line 247 (immediately before `snap.game.pendingDraftPool = [];` finalization). All rookies have a `factionId` by then via `recordDraftPick`. Body:
  ```ts
  function runDraftKingmakerTopUp(snap: FullGameSnapshot): void {
    const gate = eraCommandGate(snap.game.scenarioId);
    for (const f of snap.factions) {
      const members = snap.politicians.filter((p) => p.factionId === f.id && !p.deathYear && !p.retiredYear);
      const haveTrait = members.filter((p) => p.traits.includes('Kingmaker'));
      const needed = KINGMAKER_RULES.factionFloor - haveTrait.length;
      if (needed <= 0) continue;
      const noTrait = members.filter((p) => !p.traits.includes('Kingmaker'));
      if (noTrait.length === 0) continue;
      // Uniform-random from the top half by PV — simple, transparent in the
      // legend, fault-tolerant in lopsided rosters (assumption #2b recommendation).
      const sorted = [...noTrait].sort((a, b) => b.pvCache - a.pvCache || a.id.localeCompare(b.id));
      const topHalf = sorted.slice(0, Math.ceil(sorted.length / 2));
      const shuffled = shuffle(topHalf); // rng.ts
      const grants = shuffled.slice(0, Math.min(needed, shuffled.length));
      for (const g of grants) {
        g.traits.push('Kingmaker');
        recordKingmaker(snap, {
          year: snap.game.year, kind: 'anointed',
          politicianId: g.id,
          factionId: f.id, reason: 'draft-floor',
        });
        // Note: the gate variable above is unused inside this loop — the
        // floor is a faction-count guarantee, NOT a command-gated grant. Era
        // gate logic lives in the 2.1.7 trait-grant pass; this is the bench
        // backstop. Kept gate-lookup outside the loop for ordering clarity.
      }
    }
    snap.politicians = refreshPv(snap.politicians); // +6 PV per grant
  }
  ```
  **Insert one line in `runPhase_2_1_1_Draft`**: after the while loop terminates with the pool empty (the existing line 247 `snap.game.pendingDraftPool = [];`), call `runDraftKingmakerTopUp(snap);` BEFORE the `snap.game.lastDraftYear = snap.game.year;` finalization at line 249. The top-up runs only when 2.1.1 ran (which is itself gated by `isDraftYear` in `shouldRunPhase`); no extra year guard needed inside the helper.

### 2.1.2 acceleration (the cross-phase link)

- **New private `rollMentorBonusSkill(snap: FullGameSnapshot, p: Politician, thresholdYears: number): void`** — clone of ONLY the skill block of `rollThreshold` (phaseRunners.ts:289–302). Re-resolves below-cap skills from scratch because the first `rollThreshold` call may have raised the chosen skill:
  ```ts
  // Mentor-bonus skill: ONE extra skill roll for bonded protégés. Mirrors
  // rollThreshold's skill block exactly — re-resolves below-cap from scratch
  // because the primary roll may have just raised this politician's chosen
  // skill, changing which skills are now below the 0–5 cap.
  function rollMentorBonusSkill(snap: FullGameSnapshot, p: Politician, thresholdYears: number): void {
    const track = p.careerTrack!;
    if (!chance(CAREER_ODDS.skill)) return;
    let k = TRACK_SKILL[track];
    if (track === 'Private') {
      k = pick(SKILLS);
      if (p.skills[k] >= 5) {
        const below = SKILLS.filter((s) => p.skills[s] < 5);
        k = below.length > 0 ? pick(below) : null;
      }
    }
    if (k && p.skills[k] < 5) {
      p.skills[k] = clamp(p.skills[k] + 1, 0, 5);
      recordCareerGain(snap, p, thresholdYears, 'skill', k, false);
    }
  }
  ```
  No themed-trait roll, no random-trait roll — doubled SKILL only (spec criterion 7). Each gain feeds the existing `CAREER_GAINS_CAP = 200` FIFO.

- **Modify `runPhase_2_1_2_CareerTracks` Pass 2 (phaseRunners.ts:393–400)** — the only change is inside the threshold branch:
  ```ts
  // Pass 2 — accrual + thresholds, all factions (player included).
  for (const p of snap.politicians) {
    if (!p.careerTrack || !p.factionId) continue;
    if (p.deathYear || p.retiredYear || p.currentOffice) continue;
    p.careerTrackYears += 2;
    if (p.careerTrackYears % 4 === 0 && p.careerTrackYears <= CAREER_TRACK_MAX_YEARS) {
      rollThreshold(snap, p, p.careerTrackYears);
      // Mentor acceleration: live predicate. A mentor who died at last turn's
      // 2.4.1 (NOT YET swept by next turn's 2.1.7) does NOT accelerate — the
      // hasMentor predicate already requires the mentor be alive, non-retired,
      // same-faction (ordering crux — see brief Risks #1).
      if (hasMentor(snap, p)) {
        rollMentorBonusSkill(snap, p, p.careerTrackYears);
      }
    }
  }
  ```
  Risk-mitigating comment is mandatory — keeps the live-read invariant visible to anyone tempted to "optimize" into a raw `protegeId` lookup.

### 2.1.7 tick — rewrite of `runPhase_2_1_7_Kingmakers` (replace lines 1114–1124)

Exact phase order (one comment per phase, no extra commentary):

```ts
export function runPhase_2_1_7_Kingmakers(snap: FullGameSnapshot): void {
  // Phase 1: eager init
  if (!snap.game.kingmakers) snap.game.kingmakers = [];

  const gate = eraCommandGate(snap.game.scenarioId);
  let anointed = 0;
  let bonded = 0;
  let graduated = 0;
  let dissolved = 0;

  // Phase 2: trait-grant pass — newly-minted Kingmakers can assign this tick.
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (!p.factionId) continue; // factionless never anointed
    if (p.command < gate) continue;
    if (p.traits.includes('Kingmaker')) continue;
    p.traits.push('Kingmaker');
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'anointed',
      politicianId: p.id,
      factionId: p.factionId,
    });
    anointed++;
  }

  // Phase 3: lifecycle sweep — break dead/retired/cross-faction bonds.
  for (const k of snap.politicians) {
    if (!k.protegeId) continue;
    const c = snap.politicians.find((q) => q.id === k.protegeId);
    let reason: 'death' | 'retire' | 'defect' | null = null;
    if (!c) reason = 'defect'; // missing partner treated as cross-faction (rare)
    else if (k.deathYear) reason = 'death';
    else if (c.deathYear) reason = 'death';
    else if (k.retiredYear) reason = 'retire';
    else if (c.retiredYear) reason = 'retire';
    else if (c.factionId !== k.factionId) reason = 'defect';
    if (!reason) continue;
    const protegeId = k.protegeId;
    k.protegeId = null;
    if (c) c.bondedYear = undefined;
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'dissolved',
      politicianId: protegeId, mentorId: k.id, protegeId,
      factionId: k.factionId ?? c?.factionId ?? '',
      reason,
    });
    dissolved++;
  }

  // Phase 4: graduation pass — dual trigger; weighted legacy roll.
  for (const k of snap.politicians) {
    if (!k.protegeId) continue;
    if (k.deathYear || k.retiredYear || !k.factionId) continue; // swept already
    const c = snap.politicians.find((q) => q.id === k.protegeId);
    if (!c || c.deathYear || c.retiredYear) continue; // swept already
    const bondYear = c.bondedYear ?? snap.game.year; // implicit legacy backfill
    const tenure = snap.game.year - bondYear >= KINGMAKER_RULES.graduationYears;
    const officeTrigger = c.currentOffice?.type === 'Senator' || c.currentOffice?.type === 'President';
    if (!tenure && !officeTrigger) continue;
    const trigger: 'tenure' | 'office' = officeTrigger ? 'office' : 'tenure';

    // Single weighted rand() partitioned across 0.45 / 0.45 / 0.10.
    const r = rand();
    const commandBranch = r < KINGMAKER_RULES.graduationOdds.command;
    const traitBranch = !commandBranch && r < KINGMAKER_RULES.graduationOdds.command + KINGMAKER_RULES.graduationOdds.trait;
    const bothBranch = !commandBranch && !traitBranch;

    if (commandBranch || bothBranch) {
      // +1 command capped at 5; clean no-op at cap (accepted per checkpoint-1).
      c.command = Math.min(KINGMAKER_RULES.commandCap, c.command + 1);
    }
    if (traitBranch || bothBranch) {
      const inheritable = k.traits.filter((t) => POSITIVE_TRAITS.includes(t) && !c.traits.includes(t));
      if (inheritable.length > 0) {
        const t = pick(inheritable);
        c.traits.push(t);
      }
    }

    // Mentor reward — independent of which branch fired for the protégé:
    // one-time unheld 'Leadership' grant (POSITIVE_TRAIT, +4 PV).
    if (!k.traits.includes('Leadership')) {
      k.traits.push('Leadership');
    }

    const factionId = k.factionId;
    k.protegeId = null;
    c.bondedYear = undefined;
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'graduated',
      politicianId: c.id, mentorId: k.id, protegeId: c.id,
      factionId, trigger,
    });
    graduated++;
  }

  // Phase 5: CPU auto-assign — CPU factions only; same-state-gated; free.
  for (const k of snap.politicians) {
    if (!k.factionId || k.deathYear || k.retiredYear) continue;
    if (!k.traits.includes('Kingmaker')) continue;
    if (k.protegeId) continue; // slot full
    if (k.factionId === snap.game.playerFactionId) continue; // player assigns manually
    const candidates = protegeCandidates(snap, k.id);
    if (candidates.length === 0) continue;
    const c = pick(candidates);
    k.protegeId = c.id;
    c.bondedYear = snap.game.year;
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'bonded',
      politicianId: c.id, mentorId: k.id, protegeId: c.id,
      factionId: k.factionId, actor: 'cpu',
    });
    bonded++;
  }

  // Phase 6: PV refresh — trait grants and command/trait graduation payoffs.
  snap.politicians = refreshPv(snap.politicians);

  // Phase 7: conditional summary log.
  if (anointed + bonded + graduated + dissolved > 0) {
    addLog(snap, '2.1.7', 'system', `Mentorship: ${anointed} anointed; ${bonded} bonds formed; ${graduated} graduated; ${dissolved} dissolved.`);
  }
}
```

All passes iterate `snap.politicians` in array order. Randomness via `rand`/`pick` (rng.ts). No other `addLog` anywhere in 2.1.7 (binding — per-pairing logs from the old runner are deleted, not replaced).

### `isKingmaker` removal — full audit

Field write sites (delete the line in each):
- `/home/user/AMPU/src/data/politicians1772.ts:100` — `isKingmaker: s.command >= 1,` (seeded patriots)
- `/home/user/AMPU/src/data/politicians1772.ts:138` — `isKingmaker: false,` (filler colonials)
- `/home/user/AMPU/src/data/politicians1856.ts:134` — `isKingmaker: seed.command >= 4,` (seed politicians)
- `/home/user/AMPU/src/data/politicians1856.ts:180` — `isKingmaker: false,` (filler congress)
- `/home/user/AMPU/src/data/draftImport.ts:255` — `isKingmaker: d.command >= 4,` (imported draftees)
- `/home/user/AMPU/src/engine/phaseRunners.ts:202` — `isKingmaker: false,` (rookie-gen at 2.1.1)
- `/home/user/AMPU/src/pages/draftScoutingHelpers.ts:22` — `isKingmaker: d.command >= 4,` (PV projection)

**The spec listed 5 sites; this audit finds 7** (both filler-pol sites in 1772/1856 were missed). All 7 are just the literal `isKingmaker: <expr>,` field on a `Politician` object literal — straight deletion. No `Pick<Politician, 'isKingmaker'>` use, no destructure, no sort/filter input. Removing the field from `Politician` makes the literal-object-construction sites mandatory deletions (else TypeScript errors). Grep-verified: no other reads or writes anywhere in the codebase.

Field read sites (replace each):
- `/home/user/AMPU/src/pv.ts:75` — `if (p.isKingmaker) total += 6;` → `if (p.traits.includes('Kingmaker')) total += 6;` (+6 PV preserved exactly; criterion 4).
- `/home/user/AMPU/src/pages/Kingmakers.tsx:7` — `const kingmakers = mine.filter((p) => p.isKingmaker || p.command >= 4);` — superseded entirely by the page rewrite (this file gets a full-body rewrite, see UI section).
- `/home/user/AMPU/src/engine/phaseRunners.ts:1116` — `if (!p.isKingmaker || p.protegeId) continue;` — superseded by the 2.1.7 tick rewrite above.

Two read sites are inside files being fully rewritten; pv.ts is the only single-line edit. Net read-site impact: 1 line + 1 file rewrite + 1 file already being rewritten.

## UI changes

- `/home/user/AMPU/src/state/GameContext.tsx`:
  - Add `assignProtege, releaseProtege` to the phaseRunners import (line 7) alongside `attemptPlayerConversion`.
  - `GameContextValue` interface: add directly after `attemptConversion` (line 34):
    ```ts
    assignProtege: (kingmakerId: string, protegeId: string) => Promise<void>;
    releaseProtege: (kingmakerId: string) => Promise<void>;
    ```
  - Implementation directly after `attemptConversion` (lines 356–364), exact clone of the `attemptConversion` shape:
    ```ts
    const assignProtegeAction = useCallback(async (kingmakerId: string, protegeId: string) => {
      if (!snapshot) return;
      const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
      if (!assignProtege(draft, kingmakerId, protegeId)) return;
      setSnapshot(draft);
      await persist(draft);
    }, [snapshot, persist]);

    const releaseProtegeAction = useCallback(async (kingmakerId: string) => {
      if (!snapshot) return;
      const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
      if (!releaseProtege(draft, kingmakerId)) return;
      setSnapshot(draft);
      await persist(draft);
    }, [snapshot, persist]);
    ```
    Use `assignProtegeAction` / `releaseProtegeAction` for the local variable names to avoid shadowing the imported pure functions; expose them in the `value` object under the public names `assignProtege` / `releaseProtege` directly after `attemptConversion` (around line 435). `repair()` untouched (binding).

- `/home/user/AMPU/src/App.tsx`:
  - Add `const lastKingmakerEntryKey = useRef<string | null>(null);` directly after line 18 (the conversion ref).
  - Add a FIFTH effect after the conversions one (lines 86–97), identical shape: `phaseId === '2.1.7'` (unconditional — fires even when the tick produced no events), key `` `${g.year}:2.1.7` ``, `setPage('kingmakers')` once per entry; else-branch resets the ref. Deps: `snapshot?.game.phaseId`, `snapshot?.game.year`. Phase-scoped key keeps all six refs from fighting.
  - **The six-hop draft-turn rhythm (draft → careers → relocations → ideology → conversions → kingmakers) is a known playtest watch-item — fourth escalation of the auto-nav cadence**, flagged in Risks #5.

- `/home/user/AMPU/src/pages/registry.ts`: **NO changes** — `'kingmakers'` PageId already exists (line 38), `kingmakers: Kingmakers` registry entry already exists (line 69), import already present (line 7).

- `/home/user/AMPU/src/components/Sidebar.tsx`: **NO changes** — "Kingmakers & Protégés" already present (line 38).

- `/home/user/AMPU/src/pages/Kingmakers.tsx` — **full body rewrite** (the current 29-line file is replaced wholesale). Structural divergences from `Conversions.tsx` are real:

  - **Imports**: `useState` from react; `useGame`; `PartyBadge`; from types: `KINGMAKER_RULES`, `IDEOLOGY_ORDER`, `NEGATIVE_TRAITS` + types `Politician`, `KingmakerEntry`; from `'../engine/phaseRunners'`: `protegeCandidates` (the sanctioned pure page→engine import — fourth use). NO `SortableTable` for the main list (per-Kingmaker card model); a small `SortableTable` is used for the candidate sub-table that appears inside the active picker.
  - **Local constants**: `KIND_LABELS: Record<KingmakerEntry['kind'], string> = { anointed: 'Anointed', bonded: 'Bonded', graduated: 'Graduated', dissolved: 'Dissolved' }`. `REASON_LABELS: Record<NonNullable<KingmakerEntry['reason']>, string> = { death: 'Death', retire: 'Retire', defect: 'Defect', released: 'Released', 'draft-floor': 'Draft floor' }`. `TRIGGER_LABELS: Record<NonNullable<KingmakerEntry['trigger']>, string> = { tenure: '20 yrs', office: 'Office' }`.
  - **Component state**: `viewFactionId: string | null` (null means player view), `picking: { kingmakerId: string } | null` (one open at a time — clicking a different Kingmaker's "Choose protégé" replaces). Dropdown `onChange` resets `picking` to null. **No status filter** (the candidate list is already gated by `protegeCandidates`; the Kingmaker roster is small).
  - **Derived**: `playerFactionId = g.playerFactionId`; `activeFactionId = viewFactionId ?? playerFactionId`; `isPlayerView = activeFactionId === playerFactionId`; `phaseLocked = g.phaseId !== '2.1.7'`; `viewedFaction = snap.factions.find((f) => f.id === activeFactionId)`. **No `Free Agents` view** (the spec doesn't introduce one and same-state intra-faction candidacy makes free agents structurally irrelevant — a Kingmaker can't take a factionless protégé, so there's nothing to show). **No attempts counter / badge** (free-assignment model — no `kingmakerAttempts` field exists).
  - **Dropdown options**: player faction first with `(you)` suffix; then other factions in `snap.factions` order. NO synthetic option.
  - **Header / status badge**: title "Kingmakers & Protégés"; functional faction dropdown; `PartyBadge` of the viewed faction; small status badge: `Kingmakers: X · Bonded: Y` where X = `viewedFactionMembers.filter((p) => p.traits.includes('Kingmaker')).length` and Y = the subset of those with non-null `protegeId`. No attempts badge.
  - **Roster source**: `kingmakers = snap.politicians.filter((p) => p.factionId === activeFactionId && !p.deathYear && !p.retiredYear && p.traits.includes('Kingmaker'))`, sorted by `pvCache` desc.
  - **Own view — interactive per-Kingmaker card** (list, not table):
    - One card per Kingmaker. Header row: name + `(Cmd N)` + `St` + `PV`.
    - Body row: "Protégé: " + either the protégé's name/state with a `Cmd N` chip, the bond progress badge `{Math.min(KINGMAKER_RULES.graduationYears, year - (protege.bondedYear ?? year))}/{KINGMAKER_RULES.graduationYears} yrs` plus `Senate-track` badge when the protégé holds Representative/Governor (informational), OR `— None —` styled muted.
    - Action row:
      - Empty slot: an **Assign protégé** button. Disabled-title precedence: `phaseLocked` → "Mentorship opens during the Kingmakers & Protégés phase" → `protegeCandidates(snap, k.id).length === 0` → "No eligible same-state protégés". Click → `setPicking({ kingmakerId: k.id })`.
      - Filled slot: a **Release** button. Disabled-title precedence: `phaseLocked` → "Mentorship opens during the Kingmakers & Protégés phase". Click → `await releaseProtege(k.id)`.
    - When `picking?.kingmakerId === k.id`, the card expands inline with a `SortableTable` of candidates from `protegeCandidates(snap, k.id)`: columns Name, St, Age, Office (Representative / Governor / `—`), PV, Ideology (sortValue from `IDEOLOGY_ORDER`), Traits (rendered like Conversions — `NEGATIVE_TRAITS.includes(t)` red, else neutral), and an **Assign** action per row. Action click → `await assignProtege(k.id, c.id); setPicking(null);` (immediate result: slot fills, `bonded` feed entry appears, picker collapses). A **Cancel** button under the table → `setPicking(null)`. Pre-confirm card text: "Bonded protégés develop ~2× skill per career threshold (one extra skill roll) and resist poaching at 0.5× — they graduate at Senate/President or 20 yrs." (legend cross-reference, structurally derived from `KINGMAKER_RULES.graduationYears`).
    - **Empty state**: `kingmakers.length === 0` → "No Kingmakers in your faction — anointed when a politician reaches Command {KINGMAKER_RULES.commandGateByScenario[g.scenarioId] ?? KINGMAKER_RULES.commandGateDefault}."
  - **Rival view — read-only** (also card list, no buttons): the rival faction's Kingmakers and current protégés (name / state / age / `Cmd N` for the protégé). The picker and action buttons are absent. This surfaces who rivals are grooming without exposing rival rosters' candidacy detail.
  - **Feed**: `(g.kingmakers ?? []).filter((e) => e.factionId === activeFactionId).slice(-20).reverse()`. Row: year (mono), kind badge from `KIND_LABELS`, mentor → protégé names where applicable (lookup via `snap.politicians`), trigger sub-badge (Senate / 20 yrs) on graduated, reason sub-badge (Death / Retire / Defect / Released / Draft floor) on dissolved/anointed, You/CPU tag on bonded rows from `e.actor`. Empty: "No mentorships yet."
  - **Legend `<details>`** rendered entirely from `KINGMAKER_RULES` (zero literals in JSX): the era-aware command-anointing gate as a small table (1772 → 1, 1856 → 4); the per-faction draft floor of `factionFloor` Kingmakers; same-state, same-faction, age < `protegeMaxAge`, pre-Senate (`eligibleProtegeOffices.join(' / ')`), PV ≥ `protegeMinPv` candidacy; the 2.1.2 acceleration (one extra skill roll, cap-respecting at 5); the dual graduation trigger (`graduationYears` yrs OR `graduationOffices.join(' / ')`); the weighted graduation odds (`pct(graduationOdds.command)`% command / `pct(graduationOdds.trait)`% trait / `pct(graduationOdds.both)`% both); the +1 command (capped `commandCap`); the mentor `Leadership` reward; the lifecycle break rules; the `pct(poachResistance)`× poach resistance cross-referenced to Faction Conversions.
  - **All `pct` helper inline**: `const pct = (x: number): number => +(x * 100).toFixed(0);` (graduation odds round cleanly — 45/45/10).

## Files to touch (exact, ordered)
1. `/home/user/AMPU/src/types.ts` — remove `Politician.isKingmaker`; add `Politician.bondedYear`; add `GameState.kingmakers`; add `KingmakerEntry` interface; add `KINGMAKER_RULES` and `KINGMAKERS_CAP` consts.
2. `/home/user/AMPU/src/pv.ts` — line 75: `p.isKingmaker` → `p.traits.includes('Kingmaker')` (one-line edit; +6 PV preserved).
3. `/home/user/AMPU/src/data/politicians1772.ts` — delete lines 100 and 138 (the two `isKingmaker:` fields).
4. `/home/user/AMPU/src/data/politicians1856.ts` — delete lines 134 and 180 (the two `isKingmaker:` fields).
5. `/home/user/AMPU/src/data/draftImport.ts` — delete line 255 (`isKingmaker:` field).
6. `/home/user/AMPU/src/pages/draftScoutingHelpers.ts` — delete line 22 (`isKingmaker:` field).
7. `/home/user/AMPU/src/engine/phaseRunners.ts` — import additions (lines 1–2); delete line 202 (`isKingmaker: false,` in rookie gen); add `runDraftKingmakerTopUp` call inside `runPhase_2_1_1_Draft` after the CPU-pick `while` loop terminates with pool empty (line 247-area); modify `runPhase_2_1_2_CareerTracks` Pass 2 to call `rollMentorBonusSkill` when `hasMentor` is true; add new section after 2.1.6 (`eraCommandGate`, `hasMentor`, `protegeCandidates`, `assignProtege`, `releaseProtege`, `recordKingmaker`, `runDraftKingmakerTopUp`, `rollMentorBonusSkill`); REPLACE `runPhase_2_1_7_Kingmakers` (lines 1114–1124) wholesale with the 7-phase rewrite.
8. `/home/user/AMPU/src/state/GameContext.tsx` — `assignProtege` / `releaseProtege` (interface + delegations + value); import addition; repair() untouched.
9. `/home/user/AMPU/src/App.tsx` — `lastKingmakerEntryKey` ref + sixth auto-nav effect (key `` `${year}:2.1.7` ``, page `'kingmakers'`).
10. `/home/user/AMPU/src/pages/Kingmakers.tsx` — full body rewrite: header / dropdown / per-Kingmaker card list (own = interactive, rival = read-only) / inline candidate picker SortableTable / feed / legend / empty states.

Confirmed scope: `/home/user/AMPU/src/pages/registry.ts` and `/home/user/AMPU/src/components/Sidebar.tsx` are NOT touched (`'kingmakers'` PageId + entry + import + Sidebar item all already exist).

## Test / verification plan
- Build/typecheck: `npm run build`. **Critical type-check expectation**: removing `Politician.isKingmaker` will surface TypeScript errors at all 7 write sites and all 3 read sites listed above. The deletion order in the file list above is engineered so each edit independently compiles only after `types.ts` is updated; doing types.ts last would leave a longer-than-necessary broken-tree window. (If a stash mid-build feels risky, the fallback in Risks #4 is "keep `isKingmaker` as a synced boolean" — same shipped behavior, much smaller diff.)

- **Playtest 1856 (`npm run dev`, new game)**:
  1. Reach 2.1.7 on turn 1 (it runs first turn — not in the skip list). Sixth auto-nav lands on Kingmakers & Protégés. Own view lists the command-4+ seeds as anointed Kingmakers (the trait-grant pass ran first). Confirm the `Anointed` feed entries appear with no mentor/protégé fields. **Draft top-up smoke** (1856 has no 2.1.1 first turn since it starts at 2.1.2 per scenario1856.ts:152 — so the first draft will be in 1860): advance to year 1860 turn 1, reach 2.1.1 → draft completes → confirm each faction's Kingmaker count ≥ 10 by checking the own/rival cards count after 2.1.7 fires that turn.
  2. Assign a same-state protégé via "Choose protégé" → candidate sub-table shows only same-state, sub-Senate, age<45, PV≥20, non-Kingmaker, unmentored fellows — confirm a Senator/President/existing-Kingmaker/cross-state candidate is absent. Click Assign → slot fills same render, `Bonded` feed entry appears with You tag. Verify "Bonded" badge shows on that protégé in the Conversions own-view (Mentor column lit via `mentorBondAnchored`).
  3. Release → slot empties, `Dissolved (Released)` feed entry, clock cleared on the ex-protégé. Re-assign a different candidate → clock restarts (`bondedYear = g.year`).
  4. Advance a few turns. At each 2.1.2, confirm a bonded protégé out-develops a comparable unbonded peer on the Career Tracks gains feed (one extra `skill` entry per fire — visible at thresholds 4/8/12/16/20).
  5. Drive a protégé to the Senate (election at 2.9.6). Advance to next turn's 2.1.7 → verify a `Graduated` feed entry with trigger Senate/Office; verify the protégé's command is +1 (45% chance) OR they gained one positive mentor trait (45% chance) OR both (10% chance) — confirm the mentor gained `'Leadership'` if they didn't already hold it; verify the bond cleared (mentor's slot empty, available to re-pair this same tick if a candidate exists).
  6. Tenure graduation requires 10 turns (20 yrs). Faster path: in DevTools edit the bonded protégé's `bondedYear` to `g.year - 20` mid-window, advance → 2.1.7 fires Graduated with trigger Tenure.
  7. Kill a mentor (DevTools edit `deathYear`, or wait for natural 2.4.1 — `runPhase_2_4_1_Deaths` is line 1280). Advance to NEXT turn's 2.1.7 → `Dissolved (Death)` feed entry; bond cleared. **Cross-phase ordering verification (THE risk)**: confirm that on the turn the mentor died at 2.4.1, the protégé did NOT accelerate at that turn's 2.1.2 (which ran BEFORE the death) — open the Career Tracks gain feed; confirm no double-skill entry for that politician at that year's threshold even if the threshold fired. Verify next turn's 2.1.2 (sweep is at this turn's 2.1.7) also doesn't accelerate (mentor dead). Verify the sweep at next turn's 2.1.7 emits a Dissolved feed entry with `reason: 'death'`.
  8. Have a rival CPU poach a bonded protégé at 2.1.6 (or DevTools rewrite `factionId`). Verify the bond is gone by next 2.1.7 (`Dissolved (Defect)`); the acceleration stopped exactly at the SAME-turn 2.1.6, but that turn's 2.1.2 had already accelerated — accepted, documented (spec edge case).
  9. Reload mid-window: slots, bondedYears, and feed intact; auto-nav refires.

- **1772 smoke**: turn 1 reaches 2.1.7 (not first-turn-skipped). With era-1 gate, the 7 command-1 founders (S. Adams, Jefferson, Henry, Hancock, Washington, J. Adams, Franklin) are anointed on the first tick — confirm `Anointed` feed shows 7 entries from the player + CPU factions combined (one per founder regardless of faction). Free-Agents view is absent (intentional). The inaugural draft also fires on 1772 turn 1 (`shouldRunPhase` line 66) — the draft top-up runs AFTER assignments; confirm each faction hits ≥10 Kingmaker count after 2.1.7's trait-grant pass plus the 2.1.1 top-up combined. With seeded patriots at command 1 across the 1772 5-faction structure plus the floor top-up, expect every faction to hit the floor. Advance several turns; confirm a 1772 politician trained to command 4+ later through era systems is anointed at that turn's 2.1.7.

- **Edge cases from the spec to verify manually**:
  - Protégé relocates out of state (2.1.4) after bonding → bond PERSISTS (same-state checked only at assign); 2.1.2 acceleration continues. Verify by DevTools-editing `state` post-bond.
  - Protégé reaches command 5 before graduating → graduation +1 is a clean no-op at cap (no fallback); the trait branch still works if the roll lands there.
  - Multiple Kingmakers same state, one candidate → array order wins (first Kingmaker in `snap.politicians` order claims; gate #5 excludes the candidate for the second). Verify by setting up two same-state Kingmakers and one viable protégé; advance 2.1.7; only the earlier-iterated Kingmaker gets the bond.
  - SenateProTem holder does NOT office-graduate (only `Senator`/`President` literal match); a 20-year clock still fires. Verify by giving a bonded protégé `currentOffice.type = 'SenateProTem'` mid-bond; advance; no graduation triggers until tenure.
  - Legacy save: load a 1856 save from before this feature; first 2.1.7 tick anoints all command≥4 politicians (regardless of the dropped `isKingmaker` field surviving in untyped storage); confirms no crash, no `repair()` change.

## Risks
1. **Cross-phase 2.1.2 / 2.1.7 ordering — THE risk (binding)**. 2.1.2 (acceleration read) runs BEFORE 2.1.6 (defection) and 2.4.1 (death/retire), and the lifecycle sweep is at 2.1.7 (latest of all). The stored `protegeId` CAN be stale at 2.1.2 time: a partner who died at last turn's 2.4.1 is only swept next turn's 2.1.7. **Mitigation**: `hasMentor(snap, p)` requires a living, non-retired, same-faction partner — so a dead/retired/defected mentor never accelerates regardless of sweep timing. The architect MUST NOT optimize the 2.1.2 read into a raw `protegeId` lookup. A comment inside Pass 2 of `runPhase_2_1_2_CareerTracks` calls out the invariant. The 2.1.7 sweep is cleanup (feed + reassignment correctness), not payoff correctness.
2. **The 2.1.1 draft top-up is the first cross-phase touchpoint outside 2.1.2 — a small scope creep beyond the spec's "lives in 2.1.7" promise**. The hook is one function call inserted at one line in `runPhase_2_1_1_Draft` (just before the finalization assignments), but it makes 2.1.1 a third site that grants the `'Kingmaker'` trait (alongside 2.1.7's trait-grant pass and the Backroom themed-trait roll in `rollThreshold`). If a future change to the draft pipeline (rookie generation, custom draft classes, expansion-state late seeds) breaks the assumption that "every rookie has a `factionId` by the time the top-up runs," the floor pass could double-grant or miss factions. Mitigation: the helper iterates `snap.factions` not draftees — the floor is a faction-roster guarantee, not a draftee-specific operation; the top-up is robust to draft-pool variations.
3. **Era detection by `scenarioId`** (future-proofing). The chosen `KINGMAKER_RULES.commandGateByScenario` is keyed by scenario id strings (`'1772'`, `'1856'`); unknown scenarios fall through to `commandGateDefault = 4`. This is consistent with the existing scenario-id branching pattern (phaseRunners.ts:28/98/1352/1393, phases.ts:66) — adding a new era means adding a new scenario id and possibly a new gate entry. Rejected the year-bracket alternative (`year < 1800 ? 1 : 4`) because it would silently re-bucket years across scenarios that didn't intend that (e.g., a future 1900 scenario with no command gate change would still use 4 either way). If a new scenario ships without explicit `KINGMAKER_RULES.commandGateByScenario` entry, the default-4 behavior is the spec-correct conservative choice.
4. **Removing `isKingmaker` from `Politician` has a real diff blast radius** — 7 write sites + 3 read sites all need touching, and TypeScript will fail every untouched literal. Mid-build fallback: keep `isKingmaker: boolean` on `Politician`, ALWAYS derive it from `traits.includes('Kingmaker')` (delete all seed expressions, set `false` everywhere it's literally constructed; have the 2.1.7 trait-grant pass set `p.isKingmaker = true` synchronously with the trait push; same in `runDraftKingmakerTopUp`). pv.ts:75 stays unchanged in the fallback. Behavior identical; diff much smaller. The brief commits to removal; the fallback exists if the build goes ugly.
5. **Six-hop draft-turn rhythm — fourth escalation of the auto-nav cadence**. Draft → Careers → Relocations → Ideology → Conversions → Kingmakers. Phase-scoped key strings can't fight (each effect has its own ref), but six forced page hops per draft turn is a real UX cost to re-watch. Documented; no engine mitigation possible at this layer.
6. **The mentor reward (one-time unheld `'Leadership'` grant) fires on EVERY graduation regardless of outcome branch** — including the rare case where the protégé legacy roll is a clean no-op (command at cap with no inheritable positive traits and the both branch). This is a feature, not a bug (the mentor mentored a graduate; the legacy is on them), but a player might notice the protégé got nothing while the mentor got Leadership and read it as a bug. The legend explicitly calls out the mentor reward as separate.
7. **Fourth page→engine import** (`Kingmakers.tsx` imports pure `protegeCandidates` from phaseRunners). Sanctioned by the conversions/ideology-shifts/relocations precedent for preview === rule parity; the candidate list shown to the player IS the list the resolver validates against. No other engine functions imported.
8. **The `command` stat is touched by the graduation pass** (+1 capped 5) — the only place outside era systems that grows command. Spec calls this out as binding: "command still grows only via era systems; the only new command change is the +1 graduation legacy." pv.ts's `command * 10` term unchanged.
9. **Feed economics**: anointing is a one-time burst (first tick + after each draft floor top-up); ongoing rate is a handful of bonds/graduations/dissolutions per turn world-wide. The `KINGMAKERS_CAP = 200` lasts many turns and is invisible at the 20-entry display depth.

Brief path: `/home/user/AMPU/docs/briefs/kingmakers-proteges.md`

## Checkpoint-2 summary
- **Approach**: fifth structural clone of the 2.1.x resting-window arc — eager-init → trait-grant (era-aware via `scenarioId`) → lifecycle-sweep → graduation (weighted-rand legacy + mentor `'Leadership'` reward) → CPU auto-assign → refreshPv → conditional summary. Player flow via two `assignProtege` / `releaseProtege` mutators (boolean contract clones of `attemptPlayerConversion`). 2.1.2 acceleration via a tiny `rollMentorBonusSkill` helper called at the rollThreshold site behind a live `hasMentor(snap, p)` guard (not optimized into a raw `protegeId` lookup — ordering crux). Draft-year per-faction top-up to 10 Kingmakers inserted at the tail of `runPhase_2_1_1_Draft` (uniform-random from the top-half by PV). `isKingmaker` removed from `Politician`; trait-derived everywhere (7 writes deleted, pv.ts:75 swapped to a trait read).
- **Files (10)**: `types.ts`, `pv.ts`, `data/politicians1772.ts`, `data/politicians1856.ts`, `data/draftImport.ts`, `pages/draftScoutingHelpers.ts`, `engine/phaseRunners.ts` (the bulk), `state/GameContext.tsx`, `App.tsx`, `pages/Kingmakers.tsx` (full body rewrite). Confirmed NOT touched: `registry.ts`, `Sidebar.tsx` (the page slot already exists).
- **Top risk**: cross-phase 2.1.2/2.1.7 ordering — the acceleration MUST read live via `hasMentor`, never the raw `protegeId`, because a mentor's death at last turn's 2.4.1 is only swept at next turn's 2.1.7; a stale pointer at THIS turn's 2.1.2 would wrongly accelerate. Mitigation is a one-line invariant guard and a code comment at the call site. The 2.1.1 draft top-up's scope-creep flag is risk #2 (a tiny new cross-phase touchpoint beyond the 2.1.2 primary link); the `isKingmaker` removal's diff blast radius is risk #4 (7 writes + 3 reads, with a "keep synced boolean" fallback documented).
