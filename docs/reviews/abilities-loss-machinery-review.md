# Review: Abilities Loss Machinery (PR2a)

**Branch:** `claude/abilities-earn-loss` @ HEAD
**Verdict:** **CLEAN** — Build + lint green; `pv.ts` untouched; no new field/migration;
21/21 ACs pass; the 4 negative templates pass the anytime validator; zero
determinism leak; all 3 self-reported deviations correct and harmless. No
findings requiring fix.

## Build + lint
- `npm run build` → PASS (`✓ 118 modules transformed`, `✓ built in 2.32s`;
  only the pre-existing >500 kB chunk advisory).
- `npm run lint` (`tsc -b --noEmit`) → PASS, clean.

## Acceptance criteria (A–E)

**A. Helper + const**
- AC1 — `ABILITY_LOSS_RULES` between `MORTALITY_RULES` and `ANYTIME_EVENTS_RULES`,
  `as const satisfies {…}` (`types.ts:421–467`). All magnitudes here; no magic
  numbers in engine bodies.
- AC2 — `loseSkill`/`loseCommand` (`engine/abilities.ts:6,15`): floor 0, return
  `true` iff dropped, mutate in place. No loss path writes `p.skills`/`p.command`
  directly.
- AC3 — Helper pure: no `Math.random`/`chance()`/PV. Probability decided at call
  sites (`chance(decayChance)`, `phaseRunners.ts:2077`).

**B. Old-age decay** (`runPhase_2_4_1_Deaths`, `phaseRunners.ts:2066–2102`)
- AC4 — After death (`continue` 2055) + retire (2059–2064); just-died never
  decays. Single trailing `refreshPv` at 2105.
- AC5 — `p.age >= oa.minAge` (70); below = 0; per-turn `chance()` + age-bracket
  bonus (first-match-wins, 2071–2073).
- AC6 — `−1` to ONE random `>0` stat via `pick(pool)` (2084).
- AC7 — Pool = all 6 `SKILLS` (incl. `backroom`, `judicial`) plus `command` as a
  tagged sentinel (2080–2082); uniform pick over `{skills>0} ∪ {command>0}`.
- AC8 — `2.4.1` `addLog` with `politicianId`, gated on the boolean (2087–2098);
  empty pool silent (`pool.length > 0`, 2083).
- AC9 — `Hale` deferred; `haleChanceMult: 1.0` is the documented no-op hook.

**C. Negative anytime** (`phaseRunners.ts:2346–2365`, `anytimeEvents.ts:354–388`)
- AC10 — Negative `amount` on the existing `AnytimeEventEffect` union; no new kind.
- AC11 — **Bugfix verified.** Sign-split: `amount < 0` routes through the helper
  (applies when stat `>0`, **including at cap 5**); positive still `< cap`-gated.
  `didMutate` set strictly on a real change.
- AC12 — 4 low-weight templates (weights 1–2 vs. positive pool 2–6),
  `legislative`/`governing`/`command` only, each with a `pvHit` sibling.
- AC13 — Validator untouched and passes; `FORBIDDEN_SKILLS` intact.

**D. Battle penalties** (`revolutionaryWar.ts`)
- AC14 — `applyBattleLoss` (108–124) docks senior `general`/`admiral`; reads
  post-casualty state.
- AC15 — Ground tiers match F-BATTLE-TIER exactly (`difficult {military}`;
  `moderate`/`easy {military, governing, legislative, admin}`, `types.ts:443–447`);
  naval = `military` only. `command`/`judicial` never appear in any battle map.
- AC16 — Majority-ground-loss `admin −1` (191–197), IN, diffs against a pre-loop
  snapshot (`groundLossesBefore`/`groundWinsBefore`, 161–162) — correct per-phase
  delta on the cumulative-across-war tallies.
- AC17 — `2.7.2` `addLog` per real change with `politicianId`+`battle`; no PV
  write added.
- AC18 — Battle earn (`military +1` survivor roll), casualty logic, win/loss
  thresholds, French-alliance path all unchanged.

**E. Guardrails**
- AC19 — `git diff main...HEAD -- src/pv.ts` = 0 lines. No Use gate touched.
- AC20 — No new field on `Politician`/`GameState`/snapshot; no `repair()`/migration.
- AC21 — Build + lint green; `as const satisfies` compiles.

## 4-template validator trace (`validateAnytimeTemplates`)
| id | category | scandalScaled | mutator sibling | FORBIDDEN_SKILLS | verdict |
|---|---|---|---|---|---|
| setback-legislative-blunder | scandal-verbal | true ✓ | skillBump legislative + pvHit ✓ | legislative ok ✓ | PASS |
| setback-governing-fiasco | family-event | absent ✓ | skillBump governing + pvHit ✓ | governing ok ✓ | PASS |
| setback-command-burnout | illness-chronic | absent ✓ | commandBump + pvHit ✓ | n/a (command) ✓ | PASS |
| setback-governing-scandal | scandal-financial | true ✓ | skillBump governing + pvHit ✓ | governing ok ✓ | PASS |

None set `eras` → exempt from anachronism checks. None throw at DEV boot.

## Deviation verdicts (all 3 correct)
1. `haleChanceMult` now read (`phaseRunners.ts:2076` `clamp(decayChance * oa.haleChanceMult, 0, 1)`) — CORRECT; ×1.0, behaviorally identical, turns a dead field into a live longevity hook.
2. `let decayChance: number` (2070) — CORRECT; `as const` narrows `baseChance` to literal `0.1`, so the `+= bonus` reassignment needs the widening annotation.
3. Majority `general &&` redundancy dropped — CORRECT; the check sits inside the existing `if (general)` block.

## Determinism
Added lines with `Math.random`/`Date.now`: NONE. The two `Math.random` in
`revolutionaryWar.ts` (88, 96) are pre-existing `applyCasualties` calls, untouched
(allowed per Q6). New rolls use `chance`/`pick` from `rng.ts`.

## Balance sanity (gentle, as intended)
- Effective P(decay) = 10% @ 70, 13% @ 78, 16% @ 85+ (0% below 70); −1 to one stat.
- Command-loss rare: command ~1/7 of a full pool ⇒ ~1.9%/turn @ 78; no battle
  penalty ⇒ presidential-gate disqualification stays occasional intended drama.
- Battle stacking up to `military −3`/turn on a 3-loss campaign (floored) — the
  intended catastrophe (Q3), accepted.

## Out-of-scope confirmation
No Earn work (no new stat grants); no trait loss (Leadership-on-battle-loss is PR3,
absent); no expertise change. PR2b correctly absent.

## Benign PV-timing note (no action)
`runPhase_2_7_2_Military` returns without an in-phase `refreshPv`, so battle-loss
stat drops don't update `pvCache` until the turn-end `refreshPv` (`2.10`). The
presidential gate reads live `command` (never battle-docked) and `refreshPv` is an
idempotent recompute, so there's no stale-PV election bug. Noted only so a future
builder knows the battle path relies on the turn-end refresh.

## Findings requiring fix
None.

## Must playtest live (rng.ts non-seeded → qualitative)
1. **Old-age decay gentle ebb** — age a roster ≥70; confirm `2.4.1` "lost a step"
   lines (one stat, −1, per politician per turn; nobody <70 decays); DevTools
   confirm the stat dropped and `pvCache` fell.
2. **Command edge** — an aging `command 2` exec who loses command falls to 1 and
   drops off the next presidential candidate list (`command >= 2` gate).
3. **Negative anytime** — over many turns, a `setback-*` template drops the named
   stat −1 + logs a `pvHit`; a politician at 5 in legislative/governing/command
   still loses the point (AC11 fix).
4. **Lost Rev War battle** — ground loss docks the senior general per tier
   (military all tiers; governing/legislative/admin on moderate/easy); naval loss
   docks the admiral military only; command/judicial never move; a majority-loss
   phase adds one `admin −1`.
