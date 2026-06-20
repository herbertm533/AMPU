# Brief: Abilities Loss Machinery (PR2a)

## Approach

Add the missing *erosion* half of the ability lifecycle — abilities can now drop,
not just grow — across the three reference loss triggers and **only** those:
**old-age decay**, **negative anytime evolutions**, and **battle-loss penalties**.
The work mirrors the PR1 pattern exactly: one tuning const (`ABILITY_LOSS_RULES`
in `src/types.ts`, beside `MORTALITY_RULES`/`ANYTIME_EVENTS_RULES`) holds every
magnitude and odd, and one tiny pure module (`src/engine/abilities.ts`, mirroring
`src/engine/expertise.ts`'s `addExpertise`) exposes the single decrement
primitive — `loseSkill(p, key, amount)` / `loseCommand(p, amount)` — that **every**
loss path routes through (clamp to 0, return `true` iff the value actually
dropped, so callers gate their log line on a real change). No loss path mutates
`p.skills` / `p.command` directly; no probability lives inside the helper (it is
decided at the call site via `src/rng.ts`). Old-age decay is inserted into the
existing mortality phase `runPhase_2_4_1_Deaths`, *after* the death/retire
`continue` branches, age-gated (≥70) and probabilistic, removing −1 from one
random `>0` stat (including `command` and `backroom`). The anytime applier's cap
guard is widened (AC #11 bugfix) so a negative `amount` applies when the stat is
`>0` while positive still only applies below cap, and 2–4 low-weight negative
templates are added. Battle-loss penalties hook `runRevWarBattles` at the point
each outcome/difficulty is known, docking the senior commander per the
F-BATTLE-TIER table. PV is never written — the `refreshPv` sweeps already present
in both phases recompute it. No new field, no migration, no UI.

**Locked decisions carried in (do not relitigate):** command **is** eligible for
old-age/anytime decay even though it can drop a politician below the presidential
gate `command >= 2` (`phaseRunners.ts:3007`) — that disqualification is intended
drama; command still takes **no** battle-loss penalty. Decay is gentle: minAge
70, ~8–12%/turn base, at most −1 to ONE stat per fired event. The **Earn**
expansion (the ~12 command grants + primary/secondary track nuance) is **PR2b**
and is explicitly **not** built here.

**Alternative rejected — a probability-bearing helper.** A single
`decaySkill(p, chance)` that rolls internally would centralize the odds but force
`Math.random`/`rng` *inside* the engine helper, breaking the pure-helper
invariant AC #2/#3 require (and the PR1 `addExpertise` precedent). Keeping the
helper a pure clamp-and-floor primitive and rolling at each call site is the
chosen design.

## State & type changes

### `src/types.ts` — new `ABILITY_LOSS_RULES` const (no type/interface change)

Add one `as const` tuning const immediately **after** `MORTALITY_RULES`
(`types.ts:388–419`, which closes with `} as const;` at line 419) and before
`ANYTIME_EVENTS_RULES` (line 421) — adjacent to its neighbors, no magic numbers in
any engine body (AC #1). The battle-penalty table is keyed by battle outcome and
difficulty tier so the F-BATTLE-TIER mapping lives entirely in data:

```ts
export const ABILITY_LOSS_RULES = {
  // --- Old-age decay (runPhase_2_4_1_Deaths) ---
  oldAge: {
    minAge: 70,            // below this, decay chance is 0 (aligns with pv.ts:83 age penalty + the 70+ death/retire brackets)
    baseChance: 0.10,      // per-turn P(one decay event) at/above minAge; mid of the ~8-12% band
    // Additive bumps to baseChance by age bracket (descending; first match wins, like MORTALITY_RULES.deathBracket).
    ageBracketBonus: [
      { minAge: 85, bonus: 0.06 },
      { minAge: 78, bonus: 0.03 },
      { minAge: 70, bonus: 0.0  },
    ],
    amount: 1,             // points removed from the chosen stat per fired event
    // Longevity mitigation slot (Q9): Hale is NOT in the Trait union, so this is
    // unused in PR2a and left here only as the documented hook for the trait PR.
    haleChanceMult: 1.0,
  },

  // --- Battle-loss penalties (runRevWarBattles) ---
  // Per the F-BATTLE-TIER reference. Each entry is the stat -> points to dock the
  // senior commander on a LOST battle of that type/tier. Command & judicial never appear.
  battle: {
    // Ground losses, by difficulty tier.
    groundLossByTier: {
      difficult: { military: 1 },
      moderate:  { military: 1, governing: 1, legislative: 1, admin: 1 },
      easy:      { military: 1, governing: 1, legislative: 1, admin: 1 },
    },
    // Naval losses have no difficulty tier in AMPU -> military only.
    navalLoss: { military: 1 },
    // Phase-level: losing the MAJORITY of ground battles this phase -> admin -1 (Q16: IN).
    majorityGroundLossAdmin: 1,
  },
} as const satisfies {
  oldAge: {
    minAge: number; baseChance: number;
    ageBracketBonus: { minAge: number; bonus: number }[];
    amount: number; haleChanceMult: number;
  };
  battle: {
    groundLossByTier: Record<'difficult' | 'moderate' | 'easy', Partial<Record<SkillKey, number>>>;
    navalLoss: Partial<Record<SkillKey, number>>;
    majorityGroundLossAdmin: number;
  };
};
```

`SkillKey` is already declared above this point (`types.ts:24`), so the
`Partial<Record<SkillKey, number>>` typing resolves. No `Era`-keyed exhaustiveness
is needed (decay/battle odds are era-agnostic), so AC #21's `as const satisfies
Record<Era, …>` concern does not arise here — but the `satisfies` shape above
still gives compile-time protection against typos in the tier/stat keys.

### Save / migration impact

**None.** AC #20: PR2a adds no field to `Politician`, `GameState`, or any snapshot
type and requires **no `repair()` change**. It only reads/decrements existing
`skills` / `command` and adds a const + helper + templates + log lines. Old
IndexedDB saves load and play unchanged; they simply begin to experience loss
going forward. `repair()` (`GameContext.tsx`) is **not touched**.

## Engine changes (pure logic)

All deterministic over the snapshot. Any roll uses `src/rng.ts` (`chance`,
`pick`); **no new `Math.random`** is added anywhere (the two pre-existing
`Math.random` calls at `revolutionaryWar.ts:86,95` are out of scope per Q6 and are
left as-is). Every decrement that actually lowers a stat writes one `addLog` line.

### `src/engine/abilities.ts` — NEW MODULE (AC #2, #3)

Mirror `expertise.ts`: pure, no RNG, no PV, return-boolean-on-real-change. This is
the single decrement primitive for **all three** loss paths.

```ts
import type { Politician, SkillKey } from '../types';

// Decrement a skill by `amount` (default 1), floored at 0. Returns true iff the
// value actually dropped, so callers gate their addLog line on a real change.
// Pure: probability is decided at the call site, never here.
export function loseSkill(p: Politician, key: SkillKey, amount = 1): boolean {
  const next = Math.max(0, p.skills[key] - amount);
  if (next === p.skills[key]) return false;
  p.skills[key] = next;
  return true;
}

// Same contract for the separate `command` field. command IS eligible for
// old-age / anytime loss (never battles) — see ABILITY_LOSS_RULES / spec F-COMMAND-LOSS.
export function loseCommand(p: Politician, amount = 1): boolean {
  const next = Math.max(0, p.command - amount);
  if (next === p.command) return false;
  p.command = next;
  return true;
}
```

(Use `Math.max(0, …)` rather than importing `clamp` — `loseSkill` only has a
floor, no ceiling, and this keeps the module dependency-free like `expertise.ts`.)

### `src/engine/phaseRunners.ts` — old-age decay + anytime applier bugfix

**Imports.** Add `ABILITY_LOSS_RULES` to the existing types import on **line 2**
(it already imports `MORTALITY_RULES, ANYTIME_EVENTS_RULES` from `../types`). Add
a new helper import beside line 4: `import { loseSkill, loseCommand } from
'./abilities';`. `chance`, `pick`, `clamp` are **already imported** from `../rng`
(line 5) — no rng import change.

**(a) Old-age decay — AC #4–#9, in `runPhase_2_4_1_Deaths`
(`phaseRunners.ts:2024–2066`).** Insert a decay block **inside** the existing
`for (const p of snap.politicians)` loop, *after* the retire roll
(`phaseRunners.ts:2057–2062`) and *before* the loop closes at line 2063. Both the
death branch (line 2053) and retire branch (line 2062, falls through but the
death branch already `continue`d) mean a politician who just died this tick never
reaches the decay block — death `continue`s; retire does not `continue` but a
retired politician is harmless to decay and AC #4 only requires excluding the
*just-died* (the spec says "after the death/retire rolls" and the retire branch is
the last statement, so placing decay after it is correct). The single trailing
`refreshPv` at **line 2065** recomputes PV — **add no PV write** (AC #3).

Shape (gated, single event, random `>0` stat including `command` and `backroom`):

```ts
    // Old-age ability decay (PR2a). After the death/retire rolls so a just-
    // died politician (death branch continues above) is never decayed.
    const oa = ABILITY_LOSS_RULES.oldAge;
    if (p.age >= oa.minAge) {
      let decayChance = oa.baseChance;
      for (const b of oa.ageBracketBonus) {
        if (p.age >= b.minAge) { decayChance += b.bonus; break; }
      }
      // haleChanceMult is the documented longevity hook; Hale is not yet a trait
      // (Q9 deferred), so this multiplier is 1.0 and a no-op in PR2a.
      decayChance = clamp(decayChance, 0, 1);
      if (chance(decayChance)) {
        // Pool of currently-decayable stats: every skill > 0, plus `command`
        // (a separate field) when > 0. Tag each so we know which helper to call.
        const pool: ({ kind: 'skill'; key: SkillKey } | { kind: 'command' })[] = [];
        for (const k of SKILLS) if (p.skills[k] > 0) pool.push({ kind: 'skill', key: k });
        if (p.command > 0) pool.push({ kind: 'command' });
        if (pool.length > 0) {
          const target = pick(pool);
          if (target.kind === 'skill') {
            const before = p.skills[target.key];
            if (loseSkill(p, target.key, oa.amount)) {
              addLog(snap, '2.4.1', 'event',
                `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has lost a step — ${capitalize(target.key)} ${before} → ${p.skills[target.key]}.`,
                { politicianId: p.id });
            }
          } else {
            const before = p.command;
            if (loseCommand(p, oa.amount)) {
              addLog(snap, '2.4.1', 'event',
                `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has lost a step — Command ${before} → ${p.command}.`,
                { politicianId: p.id });
            }
          }
        }
      }
    }
```

`SKILLS` is already imported (line 2). The decay log uses `addLog(..., '2.4.1',
'event', …)` carrying `politicianId`, consistent with the surrounding
death/retire logs (AC #8). **`command` is folded into the pool** as a tagged
sentinel (it lives on `p.command`, not in `p.skills`, so it can't be iterated with
`SKILLS`); the `pick` is uniform over `{skills>0} ∪ {command if >0}` so a
6-skills-zero / command-2 politician can still lose command. A fired-but-empty
roll (all stats 0) is silent (AC #8 edge). **Capitalization of the skill label:**
`SkillKey` values are lowercase (`'admin'`, `'legislative'`, …); add a tiny local
`const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);` near the top
of the function (or reuse an existing label helper if one is already in scope —
**verify**; if none, the 1-liner is the minimal addition and stays local to this
function). Do not invent a shared util.

**(b) Anytime applier bugfix — AC #10, #11, in `rollPersonalEvents`
(`phaseRunners.ts:2272–2374`).** The two cap guards block **all** mutation at cap
regardless of sign. Rewrite **only** the `skillBump` case (lines 2306–2312) and
the `commandBump` case (lines 2314–2321) so a negative `amount` decrements via the
Part-A helper when the stat is `>0`, and a positive `amount` still uses the
existing `clamp(..., 0, cap)` only below cap; `didMutate` is set strictly on a
real change (the helper's / clamp's actual effect):

```ts
        case 'skillBump':
          if (eff.amount < 0) {
            if (loseSkill(p, eff.skill, -eff.amount)) didMutate = true;
          } else if (p.skills[eff.skill] < ANYTIME_EVENTS_RULES.skillCap) {
            p.skills[eff.skill] = clamp(
              p.skills[eff.skill] + eff.amount, 0, ANYTIME_EVENTS_RULES.skillCap,
            );
            didMutate = true;
          }
          break;
        case 'commandBump':
          if (eff.amount < 0) {
            if (loseCommand(p, -eff.amount)) didMutate = true;
          } else if (p.command < ANYTIME_EVENTS_RULES.commandCap) {
            p.command = clamp(
              p.command + eff.amount, 0, ANYTIME_EVENTS_RULES.commandCap,
            );
            didMutate = true;
          }
          break;
```

This fixes the "stat at 5 can never be decremented" edge (spec Edge case). No
other case in the switch changes; the `pvHit`/`pvBump` sibling, scandal scaling,
log line, and `refreshPv`-on-mutation (line 2384) all stay as-is. The validator
(`validateAnytimeTemplates`, lines 2108–2199) is untouched and continues to pass
(AC #13) because the new templates target permitted skills only (see below).

### `src/data/anytimeEvents.ts` — negative templates (AC #12, Q5)

Add **2–4** low-weight negative-evolution templates to `ANYTIME_EVENT_TEMPLATES`.
Per Q5 (confirmed below) they target only the **permitted** `legislative` /
`governing` skills and `command` — never a `FORBIDDEN_SKILLS` member
(`admin/judicial/military/backroom`, `phaseRunners.ts:2124`), so the validator
does not throw. Each pairs the negative bump with a `pvHit` sibling (mirroring the
existing positive `commandBump +1` + `pvBump` invariant at lines 301–305 /
336/348, and satisfying the `pvHit`/`pvBump`-needs-a-mutator-sibling validator
rule at line 2146). Weights are **low** relative to the positive/illness pool
(existing positives weigh 2–6). Use the existing `AnytimeEventEffect` union
unchanged (`anytimeEvents.ts:21–28`) — a negative `amount` is a loss, no new
effect kind (AC #10). Recommended four (designer may retune text/weights freely):

```ts
  // ---------------- negative evolutions (PR2a loss) ----------------
  {
    id: 'setback-legislative-blunder',
    category: 'scandal-verbal',
    scandalScaled: true,            // scandal-* categories require scandalScaled (validator line 2140)
    weight: 2,
    effects: [{ kind: 'skillBump', skill: 'legislative', amount: -1 }, { kind: 'pvHit', amount: -6 }],
    text: '{first} {last} ({state}) badly misjudges a floor fight — colleagues lose faith in their legislative touch.',
  },
  {
    id: 'setback-governing-fiasco',
    category: 'family-event',       // non-scandal -> must NOT set scandalScaled (validator line 2143)
    weight: 2,
    effects: [{ kind: 'skillBump', skill: 'governing', amount: -1 }, { kind: 'pvHit', amount: -6 }],
    text: '{first} {last} ({state}) sees a signature state initiative collapse in mismanagement.',
  },
  {
    id: 'setback-command-burnout',
    category: 'illness-chronic',
    weight: 1,
    effects: [{ kind: 'commandBump', amount: -1 }, { kind: 'pvHit', amount: -8 }],
    text: '{first} {last} ({state}) is visibly worn down — the old air of command has dimmed.',
  },
  {
    id: 'setback-governing-scandal',
    category: 'scandal-financial',
    scandalScaled: true,
    weight: 1,
    effects: [{ kind: 'skillBump', skill: 'governing', amount: -1 }, { kind: 'pvHit', amount: -6 }],
    text: '{first} {last} ({state}) is caught flat-footed by a procurement scandal back home.',
  },
```

**Validator constraints to honor (compile/boot-enforced):** (1) any
`scandal-financial` / `scandal-sexual` / `scandal-verbal` category **must** set
`scandalScaled: true`, and any non-scandal category **must not**
(`phaseRunners.ts:2140–2145`); the four above comply. (2) Era-anachronism rules
(lines 2150–2165) only bite on single-era `independence`/`modern` templates — the
four above are era-agnostic (no `eras` field), so they are exempt. (3) The
`pvHit` + skill/command sibling rule (line 2146) is satisfied. **Do not** add an
`admin`/`judicial`/`military`/`backroom` negative — it throws at startup by
design; keep `FORBIDDEN_SKILLS` intact (Q5).

### `src/engine/revolutionaryWar.ts` — battle-loss penalties (AC #14–#18)

**Imports.** Add `import { loseSkill } from './abilities';` (file currently imports
`addLog`, rng helpers, `recordDeath` — lines 2–4). `ABILITY_LOSS_RULES` from
`../types` must be imported (the file currently imports no types const — add
`import { ABILITY_LOSS_RULES } from '../types';`). Only `loseSkill` is needed —
command/judicial are never battle-docked (F-COMMAND-LOSS), so `loseCommand` is not
imported here.

A small local helper keeps the per-tier table application DRY and logs once per
real change under phase `2.7.2` (AC #17), next to the existing battle logs:

```ts
// Apply a per-tier penalty map to one commander, after casualties. Skips a
// commander already killed this battle (deathYear set by applyCasualties) so a
// dead general is not also "demoted". Logs each stat that actually drops.
function applyBattleLoss(
  snap: FullGameSnapshot,
  commander: Politician | undefined,
  penalties: Partial<Record<SkillKey, number>>,
  battleName: string,
): void {
  if (!commander || commander.deathYear) return;
  for (const [skill, amount] of Object.entries(penalties) as [SkillKey, number][]) {
    const before = commander.skills[skill];
    if (loseSkill(commander, skill, amount)) {
      addLog(snap, '2.7.2', 'event',
        `${commander.firstName} ${commander.lastName} falters after the defeat at ${battleName} — ${skill[0].toUpperCase() + skill.slice(1)} ${before} → ${commander.skills[skill]}.`,
        { politicianId: commander.id, battle: battleName });
    }
  }
}
```

(Add `SkillKey` and `Politician` to the type import on line 1 — `Politician` is
already imported; add `SkillKey`.)

**Insertion points (read post-casualty state — CRITICAL edge):**

- **Naval engagement** (`revolutionaryWar.ts:117–134`): the naval `win` is
  resolved at line 122 and there is **no** `applyCasualties` call in the naval
  block and **no** difficulty tier (AC #15 edge). Immediately after `if (win)
  war.navalWins++; else war.navalLosses++;` (line 133), on a **loss** apply the
  naval penalty to the admiral:
  ```ts
  if (!win) applyBattleLoss(snap, admiral, ABILITY_LOSS_RULES.battle.navalLoss, navalName);
  ```
  (The admiral cannot have died in the naval block — no casualties run there — but
  the `deathYear` guard in `applyBattleLoss` is harmless and future-proofs it.)

- **Ground loop** (`revolutionaryWar.ts:137–162`): `difficulty` is resolved at
  line 143 and `win` at line 146; `applyCasualties(...)` runs at **line 159**
  (which may kill participants — but **spares** the senior general, line 84). The
  penalty hook must run **after** line 159 so it reads post-casualty `deathYear`.
  Insert immediately after the `applyCasualties(...)` call (line 159), before
  `battleCount++` (line 160):
  ```ts
  if (!win) {
    applyBattleLoss(snap, general, ABILITY_LOSS_RULES.battle.groundLossByTier[difficulty], name);
  }
  ```
  Because the senior general is always spared by `applyCasualties`, the
  `deathYear` guard is belt-and-suspenders for the senior commander but **does**
  correctly protect the path if a future change lets the senior general die. The
  per-tier map (`groundLossByTier[difficulty]`) supplies exactly the
  F-BATTLE-TIER stats: `military` on all tiers; `governing`/`legislative`/`admin`
  added only on `moderate`/`easy`. Multiple losses in one phase each apply their
  own −1 (floored), so `military` can drop up to 3 in a disastrous turn — intended
  catastrophe (Q3, spec Edge case).

- **Majority-of-ground-losses → `admin −1`** (AC #16, Q16: **IN**): after the
  ground `do…while` loop closes (line 162) and **before** the win/loss condition
  check (line 164), the tallies `war.currentGroundWins` / `war.currentGroundLosses`
  are final for the phase. These tallies are **cumulative across the war**, not
  per-phase — but the resolver runs once per war phase and the only fresh deltas
  are this phase's 1–3 battles. To key on **this phase**, capture the loss count
  before the loop and diff:
  ```ts
  // before the ground `do { … } while` loop:
  const groundLossesBefore = war.currentGroundLosses;
  const groundWinsBefore = war.currentGroundWins;
  // after the loop, before the win/loss condition check (line 164):
  const lostThisPhase = war.currentGroundLosses - groundLossesBefore;
  const wonThisPhase = war.currentGroundWins - groundWinsBefore;
  if (general && lostThisPhase > wonThisPhase && lostThisPhase > 0) {
    applyBattleLoss(snap, general, { admin: ABILITY_LOSS_RULES.battle.majorityGroundLossAdmin }, 'the campaign');
  }
  ```
  This is genuinely low-cost (the tallies are right there; ~6 lines), so it ships
  in PR2a. The symmetric Admin **earn** for winning the majority remains PR2b.

**Unchanged (guardrails, AC #18):** the existing battle **earn** (survivors gain
`military +1` on a 10% roll, line 102), `applyCasualties` itself, win/loss
thresholds, and the French-alliance path are **not** altered — PR2a only **adds**
the loss-on-defeat hook. The downstream `refreshPv` (the engine refreshes PV after
the war phase) recomputes PV; PR2a adds no PV write (AC #17).

## UI changes

**None.** PR2a adds no field, no screen, no component. Loss surfaces only through
existing log lines (the Half-Term Summary / log feed already render `2.4.1` /
`2.4.2` / `2.7.2` entries). The Roster reads `p.skills` / `p.command` live, so a
decremented stat shows automatically with no Roster change. This matches AC #20
(no new field) and the spec's "UI: likely none".

## Files to touch (exact, ordered)

New files marked **NEW**; all others modified.

1. `src/types.ts` — add `ABILITY_LOSS_RULES` const (after `MORTALITY_RULES`,
   line 419) with the old-age + battle-tier tunables and the `as const satisfies`
   shape. No type/interface change.
2. `src/engine/abilities.ts` — **NEW**. Pure `loseSkill(p, key, amount)` /
   `loseCommand(p, amount)` (clamp-to-0, return-boolean-on-real-change).
3. `src/engine/phaseRunners.ts` — import `ABILITY_LOSS_RULES` (line 2) and
   `loseSkill`/`loseCommand` (line 4); add the old-age decay block in
   `runPhase_2_4_1_Deaths` (after the retire roll, ~line 2062); widen the
   `skillBump`/`commandBump` cap guards in `rollPersonalEvents` (lines 2306–2321)
   to apply negative bumps via the helper.
4. `src/data/anytimeEvents.ts` — add 2–4 low-weight negative templates
   (`legislative`/`governing`/`command` only) to `ANYTIME_EVENT_TEMPLATES`, each
   with a `pvHit` sibling and correct `scandalScaled` per category.
5. `src/engine/revolutionaryWar.ts` — import `loseSkill` (./abilities) +
   `ABILITY_LOSS_RULES` and `SkillKey` (../types); add the `applyBattleLoss`
   helper; hook it on naval loss (~line 133), ground loss (after `applyCasualties`,
   ~line 159), and majority-ground-loss `admin −1` (after the ground loop, ~line
   162).

**File count delta:** 1 new code module (`abilities.ts`) + 4 modified files =
**5 files** (excluding this brief). **No UI, no dataset regen, no `repair()`/
migration, no `pv.ts` change.**

**Not touched (guardrails):** `src/pv.ts` (no PV-formula change, AC #19);
`src/rng.ts` (no determinism fix — Q6 out of scope; no new `Math.random`);
`src/phases.ts`; `GameContext.tsx`/`repair()` (no migration, AC #20); the anytime
**validator** (`validateAnytimeTemplates`) and `FORBIDDEN_SKILLS` (kept intact,
Q5); the battle **earn** at `revolutionaryWar.ts:102` (AC #18); all Use gates
(presidential `command >= 2`, SCOTUS `judicial >= 2`, Gen/Adm `military` mins,
sponsor `legislative >= 1`, gov-action %, AC #19) — loss feeds them only by
lowering the underlying stat. **No trait loss** (Leadership-on-battle-loss is PR3,
not built). **No Earn work** (PR2b).

## Test / verification plan

**Build / typecheck:** `npm run build` (`tsc -b && vite build`) and `npm run lint`
(`tsc -b --noEmit`) must both be green (AC #21). Typecheck tripwires to expect:
the `ABILITY_LOSS_RULES` `as const satisfies` shape (any tier/stat key typo
fails), the `Object.entries(...) as [SkillKey, number][]` cast in `applyBattleLoss`,
and the tagged-union `pool` in the decay block. The new negative templates compile
against the existing `AnytimeEventEffect` union with no union change.

**Validator boot check (dev):** start `npm run dev`; `validateAnytimeTemplates`
runs in DEV on the first `2.4.2` phase. A misfiled negative (e.g. an `admin −1`
bump, or a `scandal-*` template missing `scandalScaled`) throws at boot — green
boot confirms the four templates are well-formed.

**Playtest (per CLAUDE.md — `npm run dev`, exercise each loss path):**

> **Determinism caveat (state up front):** `src/rng.ts` wraps `Math.random`
> (Q6) — runs are **not** bit-reproducible, so verify each behavior
> **qualitatively** (it happens, magnitudes are −1, log lines read right), not by
> reproducing an exact seed. Loss paths run for **every** politician (CPU
> included), so most observation of CPU stars needs the in-game log feed plus a
> DevTools/IndexedDB save inspection of `p.skills` / `p.command`.

- **Old-age decay reads as a gentle ebb (B).** Start a scenario, advance many
  half-terms until the roster has politicians aged ≥70 (1772 ages quickly; or load
  a late-game save). Watch the `2.4.1` log for `"… has lost a step — {Stat} N →
  N-1."` lines. Confirm: at most **one** stat, **−1**, per politician per turn; a
  politician below 70 never decays; over several turns an aging legend's stats
  drift down a step at a time (not a crater). Verify in DevTools that a decayed
  CPU politician's `p.skills`/`p.command` actually dropped and `pvCache` fell
  (refreshPv ran). **Command edge:** find an aging `command 2` executive and
  confirm that if command is the picked stat they fall to `command 1` and (next
  presidential cycle) drop off the candidate list at `phaseRunners.ts:3007` —
  intended drama, the sharpest balance edge.

- **Negative anytime evolution fires and applies (C).** Anytime events fire at a
  low base rate (`baseFireChance 0.05`), so advance **many** turns (or temporarily
  raise `ANYTIME_EVENTS_RULES.baseFireChance` locally while testing — revert
  before commit). Watch the `2.4.2` feed for one of the four setback templates;
  confirm the named stat dropped −1 (DevTools), a `pvHit` was logged, and — the
  AC #11 bugfix — a politician **at 5** in `legislative`/`governing`/`command`
  **still** loses the point (previously blocked by the `< cap` guard).

- **A lost Rev War battle docks the general (D).** Start 1772, progress to the
  Revolutionary War (or load a save mid-war). In `2.7.2`, on a **lost ground
  battle** confirm the senior general logs `"… falters after the defeat at
  {battle} — Military N → N-1."`; on a **moderate/easy** loss confirm
  `governing`/`legislative`/`admin` also each drop −1; on a **difficult** loss
  confirm **only** `military` drops. On a **lost naval battle** confirm the
  **admiral** loses `military −1` only. Confirm **command** and **judicial** are
  **never** touched. **Majority edge (Q16):** in a phase that loses more ground
  battles than it wins, confirm one extra `admin −1` ("falters after the defeat at
  the campaign"). **Dead-commander edge:** if the senior general is ever killed
  the same turn, confirm no "demotion" line for them (the senior is spared by
  `applyCasualties`, so this is belt-and-suspenders — verify the guard by reading
  post-casualty `deathYear`).

**Edge cases to verify manually (from the spec):**
- Stat already at 0 → no-op, no log (helper returns false).
- Stat at 5 → old-age decay and negative anytime **still apply** (the AC #11 fix).
- Multiple ground losses in one phase → `military` can drop up to 3 (floored at 0)
  — confirm it floors and does not go negative.
- War with no senior general/admiral assigned → `appointMilitary` auto-appoints;
  if a slot is still empty, the penalty hook no-ops (no crash).
- Legacy save → loads unchanged (no migration), then begins to experience loss.

## Risks

Ordered, highest first.

1. **Command-loss vs. the presidential gate (the sharpest balance lever).**
   Old-age/anytime decay can drop an aging executive below `command >= 2` and
   disqualify them from the presidency (`phaseRunners.ts:3007`). This is the
   **intended** stakes-y drama (locked), but it is the single edge most likely to
   feel punishing if `oldAge.baseChance`/`ageBracketBonus` are too high or the
   `command-burnout` template weight is too generous. Mitigation: command is one
   of ~7 pool members so it's picked ~1/7 of fired decays; keep the burnout
   template at weight 1; the human tunes `ABILITY_LOSS_RULES.oldAge` at playtest.
   **This does not change the gate or the PV formula** — only the underlying stat
   can fall.

2. **Battle-loss stacking can gut a general's `military` in one turn.** Up to 3
   ground losses/turn each dock `military −1` (Q3 senior-commander-only, accepted
   as catastrophe), and on moderate/easy losses `governing`/`legislative`/`admin`
   stack too — a disastrous campaign can shave several stats at once. Floored at 0
   so it can't go negative, but a mid-war general can visibly decline fast.
   Mitigation: all magnitudes are −1 in `ABILITY_LOSS_RULES.battle`; the human can
   cap or soften per-phase after playtest. Flagged for balance, not correctness.

3. **Decay game-feel rides entirely on the `ABILITY_LOSS_RULES.oldAge` defaults.**
   The whole "gentle, not punishing" guardrail is the minAge 70 / ~8–12% band /
   −1-one-stat numbers, and with **no `Hale` mitigation** (Q9 deferred) there is no
   longevity offset for unlucky stars. Mitigation: defaults are mid/low-band and
   live in one const for one-place tuning; the playtester verifies it reads as a
   step lost over turns, not a collapse, and leans to the low end if it stings.

4. **Anytime applier rewrite touches a hot, validated path.** The
   `skillBump`/`commandBump` guard rewrite sits in `rollPersonalEvents`, which also
   handles death/forceRetire/scandal-scaling. The change is surgical (two `case`
   bodies, sign-split) and `didMutate` is set strictly on a real change, but a
   regression here would mis-fire PV refresh or the log. Mitigation: the validator
   still gates the templates; build + the negative-evo playtest confirm both signs
   apply correctly (positive below cap, negative above 0).

## Definition of Done

- `npm run build` passes (`tsc -b && vite build`) and `npm run lint`
  (`tsc -b --noEmit`) is clean (AC #21).
- `ABILITY_LOSS_RULES` holds every PR2a magnitude/odd as one `as const satisfies`
  const beside `MORTALITY_RULES`; **no magic numbers** in any engine body (AC #1).
- `src/engine/abilities.ts` exports pure `loseSkill` / `loseCommand` (clamp-to-0,
  return-boolean-on-real-change, no RNG, no PV); **every** loss path routes through
  them (AC #2, #3).
- Old-age decay fires in `runPhase_2_4_1_Deaths` after the death/retire rolls,
  age-gated ≥70, −1 to one random `>0` stat (incl. `command` and `backroom`), with
  a `2.4.1` log on a real change; the trailing `refreshPv` recomputes PV with no
  added PV write (AC #4–#9; Hale deferred per Q9).
- The anytime applier applies **negative** `skillBump`/`commandBump` at the cap
  (AC #11 bugfix verified at stat = 5), `didMutate` set only on a real change; 2–4
  low-weight negative templates (`legislative`/`governing`/`command` only, each
  with a `pvHit` sibling) fire in play; the validator still passes, `FORBIDDEN_SKILLS`
  intact (AC #10, #12, #13; Q5).
- Rev War battle losses dock the senior commander per F-BATTLE-TIER (ground:
  `military` all tiers + `governing`/`legislative`/`admin` on moderate/easy; naval:
  `military` only), `command`/`judicial` never touched, a dead commander is skipped
  (post-casualty `deathYear`), majority-ground-loss adds `admin −1` (Q16 IN), with
  `2.7.2` logs; the existing battle earn and casualty logic are unchanged (AC #14–#18).
- `src/pv.ts` unchanged; no Use gate changed; no new field; no migration
  (AC #19, #20). No UI change.
- **Playtest** (per CLAUDE.md): old-age decay observed reading as a gentle ebb on
  an aging roster; a negative anytime evolution observed firing and applying
  (including at cap); a lost Rev War battle observed docking the general's stats —
  all verified **qualitatively** given the rng.ts determinism caveat, with CPU
  observation via the log feed + DevTools/save inspection.

---

**Checkpoint summary (for approval):**

- **Approach:** add the erosion half of the ability lifecycle via one tuning const
  (`ABILITY_LOSS_RULES`) + one pure helper module (`abilities.ts`:
  `loseSkill`/`loseCommand`) routed by all three loss paths — old-age decay in the
  mortality phase, negative anytime evos (applier cap-guard bugfix + 2–4 low-weight
  templates), and F-BATTLE-TIER battle-loss penalties in the Rev War resolver. PV,
  Use gates, fields, migration, and UI all untouched.
- **Files:** 5 (1 new `src/engine/abilities.ts`; 4 modified: `src/types.ts`,
  `src/engine/phaseRunners.ts`, `src/data/anytimeEvents.ts`,
  `src/engine/revolutionaryWar.ts`). No UI, no dataset, no migration.
- **Q3/Q4/Q5/Q9/Q16 resolutions:** **Q3** senior commander only (accept up to
  `military −3`/turn stacking, floored — intended catastrophe). **Q4** `backroom`
  eligible for old-age decay like the other stats. **Q5** keep `FORBIDDEN_SKILLS`
  intact; ship negatives only for `legislative`/`governing`/`command`, each with a
  `pvHit` sibling. **Q9** `Hale` is **absent** from the `Trait` union (grep-
  confirmed) → longevity mitigation **deferred**; old-age decay ships with no
  modifier (a documented `haleChanceMult: 1.0` no-op hook only). **Q16** majority-
  ground-loss `admin −1` is **IN** (~6 lines off the existing
  `currentGroundWins`/`currentGroundLosses` tallies, diffed per-phase).
- **Highest balance risk:** command-loss disqualifying an aging executive below
  the presidential `command >= 2` gate — intended drama but the edge most likely to
  feel punishing; all command-loss odds live in `ABILITY_LOSS_RULES` for one-place
  tuning and command takes no battle penalty.
- **Decided beyond the spec:** (a) the battle-penalty table is keyed by
  outcome→tier→stat *in the const* so F-BATTLE-TIER lives entirely in data, not
  engine branches; (b) the majority check diffs `currentGroundLosses` against a
  pre-loop snapshot because those tallies are cumulative-across-the-war, not
  per-phase (a subtlety the spec's "tallies are right there" glosses); (c) a tiny
  local `capitalize` for the decay/battle log stat label (no shared util added);
  (d) `command` folded into the decay pool as a tagged sentinel since it lives on
  `p.command`, not in `p.skills`.

**Brief file:** `/home/user/AMPU/docs/briefs/abilities-loss-machinery.md`
