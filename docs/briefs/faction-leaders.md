# Brief: Faction Leaders (Phase 2.2.3 Activation)

## Approach

Sixth 2.x activation. The 2.2.3 runner is replaced wholesale with a 6-step pipeline (Failed Bid decay → Ambitious seed → per-faction validation+Election → per-faction Challenge → single `refreshPv` → invariant log) that turns the leader slot into a real, tenure-tracked seat with prestige, propagation hooks, and an era-tuned auto-roll challenge mechanism. Leadership state is carried by a new optional `Politician.factionLeaderOf?: string | null` field (Checkpoint 1: federal-seat collision is **decoupled** — Faction Leader does NOT take `currentOffice`; `computePV` adds +8 PV when `factionLeaderOf` is non-null, additive to the existing currentOffice prestige). `factionCenter` weights the leader **1.5×** (single-line tune in `LEADERSHIP_RULES`); five trait-propagation hooks attach via a single `getFactionLeader(snap, factionId)` helper that filters dead/retired. Era-tuning lives in `LEADERSHIP_RULES.eraConfig: Record<Era, {...}>` — Roll A fire chance blends `ideologyTriggerWeight × ideoDist/6` and `patronageTriggerWeight × pvGap` (historian-binding: pre-1900 is patronage-dominant; modern is ideology-dominant). Page is a four-section read-only dashboard with cross-links. **Rejected**: writing `currentOffice = { type: 'FactionLeader' }` (the original spec model) — Checkpoint 1 chose `factionLeaderOf` to preserve dual-role PV (Senator + Leader stacks to +13 over baseline, not -1).

## State & type changes

All in `/home/user/AMPU/src/types.ts`.

### `Trait` union (line 62–106)

Append two literals at line 106 (after `'Opportunist'`):

```ts
  | 'Opportunist'
  | 'Ambitious'
  | 'Failed Bid';
```

### `POSITIVE_TRAITS` (line 108–137)

Append `'Ambitious'` after `'Loyal'` at line 137:

```ts
  'Loyal',
  'Ambitious',
];
```

### `NEGATIVE_TRAITS` (line 139–156)

Append `'Failed Bid'` after `'Opportunist'` at line 156:

```ts
  'Opportunist',
  'Failed Bid',
];
```

PV pickup is automatic: `pv.ts:73–76` already loops POSITIVE/NEGATIVE arrays → `'Ambitious'` gets `+4`, `'Failed Bid'` gets `-5`. No `pv.ts` trait edit needed.

### `LEADERSHIP_RULES` and `LEADERSHIP_FEED_CAP` (insert after `ALIGNMENT_DRIFT_CAP = 200` at line 323)

```ts
export const LEADERSHIP_FEED_CAP = 200;

export const LEADERSHIP_RULES = {
  // Selection (no-incumbent / invalidation election)
  fitPenalty: 1.0,
  traitBonusPerPositive: 2,
  traitBonusCap: 6,
  challengerPvFloor: 30,
  ideologyWeightInFactionCenter: 1.5,

  // Challenge auto-roll
  fireCap: 0.20,
  scoreNormalizer: 200,
  failedBidDecayTurns: 3,
  failedBidPvStamp: 5,
  ambitiousSeedRate: 0.05,
  ambitiousFireBonus: 0.05,

  // Trait propagation magnitudes
  oratorIdeologyShiftBonus: 0.05,
  manipulativeConversionBonus: 0.05,
  kingmakerProtegeBonus: 0.05,
  leadershipDropStableTurnsBonus: 1,

  // Federal-era election + legislation hooks
  electionOnBallotMul: 1.1,
  sponsorFloorBias: 0.05,

  // Per-era trigger mix + tuning (historian-binding).
  eraConfig: {
    independence: {
      baseFireChance: 0.015, incumbencyAdvantage: 30,
      ideologyTriggerWeight: 0.20, patronageTriggerWeight: 0.80,
    },
    federalism: {
      baseFireChance: 0.025, incumbencyAdvantage: 20,
      ideologyTriggerWeight: 0.30, patronageTriggerWeight: 0.70,
    },
    nationalism: {
      baseFireChance: 0.045, incumbencyAdvantage: 15,
      ideologyTriggerWeight: 0.40, patronageTriggerWeight: 0.60,
    },
    modern: {
      baseFireChance: 0.060, incumbencyAdvantage: 8,
      ideologyTriggerWeight: 0.80, patronageTriggerWeight: 0.20,
    },
  } as const satisfies Record<Era, {
    baseFireChance: number;
    incumbencyAdvantage: number;
    ideologyTriggerWeight: number;
    patronageTriggerWeight: number;
  }>,
} as const;
```

The `satisfies Record<Era, ...>` is the exhaustiveness lever: `Era` is `'independence' | 'federalism' | 'nationalism' | 'modern'` (verified at line 433); missing one is a TypeScript error. When a 5th era is added later, this const is the bind point.

### `OfficeType.FactionLeader` (line 344) — UNCHANGED

Stays in the union as dead code per Checkpoint 1 binding. `OFFICE_PRESTIGE.FactionLeader: 8` at `pv.ts:24` is also untouched; nothing reads it. Acceptable; no cosmetic cleanup in v1.

### `Politician` interface (lines 356–388)

Add three optional fields after `draftedYear?: number;` (line 387):

```ts
  draftedYear?: number;
  ambitiousSeeded?: boolean;
  failedBidExpiresYear?: number;
  factionLeaderOf?: string | null;
}
```

- `ambitiousSeeded` — one-shot lazy seed gate (mirrors `ideologyTraitsSeeded` / `conversionTraitsSeeded`).
- `failedBidExpiresYear` — decay clock for the `'Failed Bid'` trait; set at challenge loss, cleared by the runner's Step 0 sweep when expired.
- `factionLeaderOf` — denormalized mirror of `Faction.leaderId`. Non-null IFF this politician is currently the leader of that faction. **Read by `computePV` for the +8 bump.** Mutated ONLY at two sites (Election Step 2, Challenge Step 3); reads elsewhere must go through the `getFactionLeader` helper to defend the dead/retired filter window.

### `Faction` interface (line 390–400)

Add `leadershipStartYear?: number;` after `leaderId` at line 398:

```ts
  leaderId?: string | null;
  leadershipStartYear?: number;
  isPlayer: boolean;
}
```

Tenure derives as `snap.game.year - (f.leadershipStartYear ?? snap.game.year)`. Optional; legacy saves fall through.

### `GameState` (line 642–682)

Add `factionLeadership?: FactionLeadershipEntry[];` after `factionAlignmentDrift?:` at line 678:

```ts
  factionAlignmentDrift?: FactionAlignmentDriftEntry[];
  factionLeadership?: FactionLeadershipEntry[];
  alignmentStability?: Record<string, { firstSeenYear: number }>;
```

### `FactionLeadershipEntry` interface (insert after `FactionAlignmentDriftEntry` ending at line 768)

```ts
export interface FactionLeadershipEntry {
  year: number;
  factionId: string;
  kind: 'installed' | 'challenged' | 'vacated';
  leaderId?: string;       // new leader for 'installed' and successful 'challenged'
  formerLeaderId?: string; // prior leader for 'installed' (after replacement) or 'vacated'
  challengerId?: string;   // for 'challenged' (the challenger; winner on success, loser on fail)
  success?: boolean;       // for 'challenged' only
  reason?: 'death' | 'retire' | 'defect' | 'promoted' | 'replaced' | 'challenge-win'
         | 'challenge-loss' | 'election';
}
```

Shape mirrors `FactionAlignmentDriftEntry`. `kind === 'installed'` covers initial seating and post-replacement Election. `kind === 'challenged'` covers Roll A fires (both outcomes recorded via `success`). `kind === 'vacated'` is reserved — see "vacateOffice" note below.

### Save / migration impact

- All five Politician/Faction/GameState additions are optional. Legacy saves load unchanged.
- `factionLeaderOf` is NOT retroactively populated on load. The first post-update 2.2.3 tick handles it: Step 2 validation reads `f.leaderId`, looks up the politician, finds `factionLeaderOf` is undefined ≠ `f.id` → triggers Election → assigns `factionLeaderOf = f.id` on the winner. (One mild log churn on the upgrade-tick; acceptable, documented in spec criterion #34.)
- `ambitiousSeeded` defaults undefined → Step 1 picks up un-seeded politicians on first tick; one-shot 5% roll per career.
- `failedBidExpiresYear` undefined on legacy → Step 0 sweep is a no-op for any politician without the field.
- `leadershipStartYear` undefined on legacy → tenure displays as `0`.
- `factionLeadership` undefined on legacy → `recordFactionLeadership` helper lazy-inits to `[]` on first write (matches `recordAlignmentDrift` pattern at `phaseRunners.ts:1414–1419`).
- No `repair()` changes; no `db.ts` migration. The runner's Step 0/1 + lazy-init pattern covers backfill.

## Engine changes (pure logic)

All randomness via `src/rng.ts` (`chance`, `rand`); single `refreshPv` at end of runner. The new helpers are pure over the snapshot. PV propagation: any change that mutates skills/traits/office/factionLeaderOf calls `refreshPv` so `pvCache` reflects it next read.

### 1) `/home/user/AMPU/src/pv.ts` — `computePV` adds +8 via `factionLeaderOf`

Inside `computePV` at line 65, after the `currentOffice` prestige block (line 78–80), add ONE conditional:

```ts
  if (p.currentOffice) {
    total += OFFICE_PRESTIGE[p.currentOffice.type] ?? 0;
  }
  if (p.factionLeaderOf != null) {
    total += 8;
  }
  // age penalty over 70 ...
```

**Signature unchanged.** `computePV(p)` reads only the politician's own fields; no snapshot lookup. The +8 is **additive** to currentOffice prestige — a Senator (5) who becomes Faction Leader stacks to +13 over baseline; a free agent who becomes Faction Leader gets +8.

Hardcoded `8` is acceptable (it mirrors the now-dead `OFFICE_PRESTIGE.FactionLeader: 8` at line 24; if the spec value changes, change both for symmetry — or better, when cosmetic cleanup removes the dead OfficeType case, replace this literal with a named constant). Spec consistency: `LEADERSHIP_RULES` doesn't currently include the +8 leader-PV magnitude as a field; PM-tuning hook is intentionally minimal. Leave the literal.

### 2) `/home/user/AMPU/src/engine/phaseRunners.ts`

Most of the work lives here. Edits ordered top-to-bottom.

#### 2a. `factionCenter` (lines 620–625) — leader weighted 1.5×

Replace in place:

```ts
export function factionCenter(snap: FullGameSnapshot, factionId: string): number | null {
  const members = snap.politicians.filter((p) => p.factionId === factionId && !p.deathYear && !p.retiredYear);
  if (members.length === 0) return null;
  const faction = snap.factions.find((f) => f.id === factionId);
  const leaderId = faction?.leaderId ?? null;
  let sum = 0, count = 0;
  for (const p of members) {
    const w = (leaderId !== null && p.id === leaderId)
      ? LEADERSHIP_RULES.ideologyWeightInFactionCenter
      : 1;
    sum += IDEOLOGY_ORDER.indexOf(p.ideology) * w;
    count += w;
  }
  return Math.round(sum / count);
}
```

Behavioral notes:
- When `leaderId` is null (empty faction, pre-Election, post-vacate window), every member gets weight 1 — degrades to today's unweighted-mean implementation, no regression.
- Result still rounded to integer 0..6, so downstream consumers (2.1.5, 2.1.6, 2.1.8 personality + drift) see the same bucket boundaries; change is only at the boundaries.
- This is the spec's **#1 cross-system blast risk** (see Risks). The 1.5× value is identity-preserving in expectation (a leader at the mean shifts the mean by zero); the effect is sharpening, not biasing.

#### 2b. `getFactionLeader` helper (insert near `factionCenter`, before line 627)

```ts
function getFactionLeader(snap: FullGameSnapshot, factionId: string | null | undefined): Politician | null {
  if (!factionId) return null;
  const f = snap.factions.find((ff) => ff.id === factionId);
  if (!f || !f.leaderId) return null;
  const leader = snap.politicians.find((p) => p.id === f.leaderId);
  if (!leader) return null;
  if (leader.deathYear || leader.retiredYear) return null;
  return leader;
}
```

**This helper is mandatory.** Every leader-trait read (Orator/Manipulative/Kingmaker/Leadership/on-ballot/sponsor) goes through it. The reason: there's a 1-turn window between 2.4.1 (death) and the next 2.2.3 (Step 2 validation sweep) where a dead leader's `factionLeaderOf` field is still set and `f.leaderId` still points to them; an inline lookup pattern like `snap.factions.find(...).leaderId ? snap.politicians.find(...) : null` misses the death/retire filter and would let a dead leader keep granting Orator/Manipulative bonuses for one turn. The helper closes that window. File-local (not exported); used only in this file.

#### 2c. `ideologyShiftOdds` signature + body (line 633–638)

Add an optional `actorLeader` param; apply Orator bonus before clamp:

```ts
export function ideologyShiftOdds(
  p: Politician,
  kind: 'self' | 'opposed',
  actorCenter: number,
  actorLeader?: Politician | null,
): { success: number; ffRisk: number; from: Ideology; to: Ideology } {
  const oratorBonus = actorLeader?.traits.includes('Orator')
    ? LEADERSHIP_RULES.oratorIdeologyShiftBonus
    : 0;
  const success = clamp(IDEOLOGY_SHIFT_ODDS.attempt[kind] * traitMult(p, kind) + oratorBonus, 0, 1);
  const ffRisk = kind === 'opposed' ? IDEOLOGY_SHIFT_ODDS.attempt.ffRisk : 0;
  const fromIdx = IDEOLOGY_ORDER.indexOf(p.ideology);
  return { success, ffRisk, from: p.ideology, to: IDEOLOGY_ORDER[stepToward(fromIdx, actorCenter)] };
}
```

**Call site update — `resolveIdeologyShift` (line 668):**

```ts
const actorLeader = getFactionLeader(snap, actorFactionId);
const { success: pS, ffRisk, to } = ideologyShiftOdds(p, kind, center, actorLeader);
```

Other call sites: per Grep, `ideologyShiftOdds` is only called from `resolveIdeologyShift` inside `phaseRunners.ts`. The function is `export`ed; if a page preview consumes it, the param is optional and back-compat is preserved (no leader bonus surfaces in the preview — acceptable for v1). **Architect note**: search `src/pages` for `ideologyShiftOdds` usage; if a preview page exists, thread `actorLeader` for symmetry. (Spec criterion #14 mandates this.)

#### 2d. `conversionOdds` (line 865–910) — Manipulative leader +0.05

The cleanest injection point is the final clamp at line 902. After the existing `success` calc, add:

```ts
  const actorLeader = getFactionLeader(snap, actorFactionId);
  const manipulativeBonus = actorLeader?.traits.includes('Manipulative')
    ? LEADERSHIP_RULES.manipulativeConversionBonus
    : 0;
  const success = clamp(
    base * fit * ffHistory * mentorBond * highPv * flipFlopperTrait * loyal * opportunist + manipulativeBonus,
    0, 1,
  );
```

Additive on top of the multiplicative chain; clamped `[0, 1]`. Applies to both `sign` and `poach` kinds (the spec doesn't distinguish). `conversionOdds` is `export`ed and called from `resolveConversion` (line 981) and two CPU candidate-scoring lines (1046, 1062); all three sites pass an `actorFactionId`, so the in-function `getFactionLeader` call works at every site without param churn.

#### 2e. `runPhase_2_1_7_Kingmakers` Phase 4 graduation pass (lines 1300–1339)

After the existing branch resolution (and BEFORE the mentor-reward at line 1328), add the Kingmaker-leader bonus roll:

```ts
    if (traitBranch || bothBranch) {
      const inheritable = k.traits.filter((t) => POSITIVE_TRAITS.includes(t) && !c.traits.includes(t));
      if (inheritable.length > 0) {
        c.traits.push(pick(inheritable));
      }
    }

    // Leader propagation: Kingmaker-trait leader of the mentor's faction grants
    // a separate +1 command bonus roll for the protégé (faction-local).
    const mentorFactionLeader = getFactionLeader(snap, k.factionId);
    if (mentorFactionLeader?.traits.includes('Kingmaker') && chance(LEADERSHIP_RULES.kingmakerProtegeBonus)) {
      c.command = Math.min(KINGMAKER_RULES.commandCap, c.command + 1);
    }

    // Mentor reward — independent of which branch fired for the protégé.
    if (!k.traits.includes('Leadership')) k.traits.push('Leadership');
```

A separate `chance(0.05)` gate, NOT a multiplier on the 0.45/0.45/0.10 split (preserves the original distribution). Cap respects `KINGMAKER_RULES.commandCap = 5` (verified at line 1318). Mutually inclusive with the command-branch roll: a protégé could gain +1 from the main split AND +1 from this bonus, capped at 5.

#### 2f. `runPhase_2_1_8_FactionPersonalities` drop pass (line 1426 + the drop pass loop)

The current per-faction K is read once at line 1426 as a constant: `const K = ALIGNMENT_RULES.stableTurns;`. The Leadership propagation needs K to be per-faction. Inside the drop-pass loop (search for the existing drop K usage — verify location; spec text references "the drop pass" without exact line), introduce a per-faction effective K:

```ts
const dropK = ALIGNMENT_RULES.stableTurns
  + (getFactionLeader(snap, f.id)?.traits.includes('Leadership')
      ? LEADERSHIP_RULES.leadershipDropStableTurnsBonus
      : 0);
```

Replace the K read inside the drop pass with `dropK`. The ADD pass is unchanged (Leadership doesn't help you gain new cards). **Architect note**: the exact line of the drop K read depends on the current 2.1.8 implementation; verify by reading the runner body. The spec is precise about the semantic ("drop pass K = `stableTurns + (leaderHasLeadership ? 1 : 0)`"); the implementation detail is one variable substitution.

#### 2g. `electionFactionBias` (lines 1398–1412) — leader-on-ballot ×1.1

Add an optional `candidateId` param; apply the multiplier inside the function:

```ts
export function electionFactionBias(
  snap: FullGameSnapshot,
  factionId: string | null,
  candidateId?: string,
): number {
  if (!factionId) return 0;
  const faction = snap.factions.find((f) => f.id === factionId);
  if (!faction) return 0;
  let score = 0;
  for (const ic of faction.interestCards) {
    score += snap.game.interestGroups[ic] ?? 0;
  }
  for (const lc of faction.lobbyCards) {
    const proxy = ALIGNMENT_RULES.lobbyToInterest[lc];
    if (proxy) score += snap.game.interestGroups[proxy] ?? 0;
  }
  const raw = ALIGNMENT_RULES.electionBiasPerScore * score;
  let bias = clamp(raw, -ALIGNMENT_RULES.electionBiasCap, ALIGNMENT_RULES.electionBiasCap);
  if (
    candidateId != null
    && faction.leaderId === candidateId
    && snap.game.currentEra !== 'independence'
  ) {
    bias *= LEADERSHIP_RULES.electionOnBallotMul;
  }
  return bias;
}
```

The guard checks (a) candidateId is provided, (b) candidate IS the faction's leader, (c) era is not independence. Independence-era is belt-and-suspenders (independence has no 2.9.x elections that fan out through this function), but the guard protects against future scenarios.

**Call site update — `calcStateVote` (line 2363):**

```ts
const factionBias = electionFactionBias(snap, c.factionId, c.id);
```

That's the only existing call site (verified by Grep). All four 2.9.x fan-outs (`runPhase_2_9_4_PresidentialGeneral`, `runPhase_2_9_5_Governors`, `runPhase_2_9_6_*`) inherit the multiplier through this single touch.

#### 2h. `runPhase_2_6_3_Floor` federal-era tally (lines 2222–2236)

Inside the `tally` function for federal-era voting, compute leader-sponsor status ONCE before the loop and apply the bonus per-member:

```ts
    const sponsorLeader = getFactionLeader(snap, sponsor.factionId);
    const sponsorIsLeader = !!(sponsorLeader && sponsorLeader.id === sponsor.id);
    const tally = (members: Politician[]) => {
      let yea = 0, nay = 0;
      for (const m of members) {
        const sameParty = m.partyId === sponsor.partyId;
        const sameFaction = m.factionId === sponsor.factionId;
        let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.15;
        const dist = Math.abs(IDEOLOGY_ORDER.indexOf(m.ideology) - IDEOLOGY_ORDER.indexOf(sponsor.ideology));
        p -= dist * 0.05;
        const leaderSponsorBonus = (sponsorIsLeader && m.factionId === sponsor.factionId)
          ? LEADERSHIP_RULES.sponsorFloorBias
          : 0;
        p = clamp(p + cardVoteBias(snap, m.factionId, bill.effects.interestGroups) + leaderSponsorBonus, 0, 1);
        if (chance(p)) yea++;
        else nay++;
      }
      return { yea, nay };
    };
```

Hoist `sponsorLeader` / `sponsorIsLeader` outside the loop (computed once per bill). Bonus is additive on top of `cardVoteBias` and the sameFaction base (0.92); final `p` clamped `[0, 1]`. Cross-faction members (even same-party) do NOT get the bonus — the spec binds this to faction-local. 2.6.2 committee tally and `voteCC` (1772 CC) are **NOT modified** in v1.

#### 2i. `recordFactionLeadership` helper (insert near `recordAlignmentDrift` at line 1414)

```ts
function recordFactionLeadership(snap: FullGameSnapshot, entry: FactionLeadershipEntry): void {
  if (!snap.game.factionLeadership) snap.game.factionLeadership = [];
  const arr = snap.game.factionLeadership;
  arr.push(entry);
  if (arr.length > LEADERSHIP_FEED_CAP) arr.splice(0, arr.length - LEADERSHIP_FEED_CAP);
}
```

Lazy-init, FIFO cap at 200. Mirrors `recordAlignmentDrift` line-for-line.

#### 2j. `runPhase_2_2_3_FactionLeaders` (lines 1672–1678) — replace wholesale

The new runner body. Six explicit steps:

```ts
export function runPhase_2_2_3_FactionLeaders(snap: FullGameSnapshot): void {
  const year = snap.game.year;
  const era = snap.game.currentEra;
  const cfg = LEADERSHIP_RULES.eraConfig[era];

  // Step 0: Failed Bid decay sweep.
  let decayed = 0;
  for (const p of snap.politicians) {
    if (p.failedBidExpiresYear !== undefined && year >= p.failedBidExpiresYear) {
      p.traits = p.traits.filter((t) => t !== 'Failed Bid');
      p.failedBidExpiresYear = undefined;
      decayed++;
    }
  }

  // Step 1: Ambitious seed pass (one-shot lazy; matches 2.1.5/2.1.6 pattern).
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear || p.ambitiousSeeded) continue;
    if (chance(LEADERSHIP_RULES.ambitiousSeedRate)) {
      if (!p.traits.includes('Ambitious')) p.traits.push('Ambitious');
    }
    p.ambitiousSeeded = true;
  }

  // Step 2 & 3: per-faction validation + Election OR Challenge (mutually exclusive).
  let challenges = 0, unseated = 0, newSeats = 0;
  for (const f of snap.factions) {
    const current = f.leaderId
      ? snap.politicians.find((p) => p.id === f.leaderId) ?? null
      : null;
    const invalid =
      !current
      || !!current.deathYear
      || !!current.retiredYear
      || current.factionId !== f.id
      || current.factionLeaderOf !== f.id;

    if (invalid) {
      // Step 3 path: Election (no incumbent OR invalidation).
      if (current && current.factionLeaderOf === f.id) {
        current.factionLeaderOf = null; // defensive cleanup
      }
      const center = factionCenter(snap, f.id);
      const eligible = snap.politicians.filter((p) =>
        !p.deathYear && !p.retiredYear
        && p.factionId === f.id
        && !p.traits.includes('Failed Bid')
      );
      const scoreOf = (p: Politician): number => {
        const idol = IDEOLOGY_ORDER.indexOf(p.ideology);
        const fitPenalty = center !== null
          ? LEADERSHIP_RULES.fitPenalty * Math.abs(idol - center)
          : 0;
        const posCount = p.traits.filter((t) => POSITIVE_TRAITS.includes(t)).length;
        const traitBonus = Math.min(
          LEADERSHIP_RULES.traitBonusCap,
          LEADERSHIP_RULES.traitBonusPerPositive * posCount,
        );
        return p.pvCache - fitPenalty + traitBonus;
      };
      eligible.sort((a, b) => {
        const sa = scoreOf(a), sb = scoreOf(b);
        if (sa !== sb) return sb - sa;
        return a.id.localeCompare(b.id);
      });
      const winner = eligible[0] ?? null;
      if (winner) {
        const formerLeaderId = current?.id;
        f.leaderId = winner.id;
        f.leadershipStartYear = year;
        winner.factionLeaderOf = f.id;
        recordFactionLeadership(snap, {
          year, factionId: f.id, kind: 'installed',
          leaderId: winner.id,
          formerLeaderId,
          reason: 'election',
        });
        addLog(snap, '2.2.3', 'appointment',
          `${winner.firstName} ${winner.lastName} elected to lead the ${f.name}.`);
        newSeats++;
      } else {
        f.leaderId = null;
        f.leadershipStartYear = undefined;
      }
      continue; // Mutually exclusive with Challenge
    }

    // Step 3 path: Challenge roll (only on valid incumbent).
    const leader = current!;
    const pool = snap.politicians.filter((p) =>
      !p.deathYear && !p.retiredYear
      && p.factionId === f.id
      && p.id !== leader.id
      && p.pvCache >= LEADERSHIP_RULES.challengerPvFloor
      && !p.traits.includes('Failed Bid')
    );
    if (pool.length === 0) continue;
    pool.sort((a, b) =>
      a.pvCache !== b.pvCache ? b.pvCache - a.pvCache : a.id.localeCompare(b.id),
    );
    const challenger = pool[0];

    const center = factionCenter(snap, f.id) ?? IDEOLOGY_ORDER.indexOf(leader.ideology);
    const ideoDist = Math.abs(IDEOLOGY_ORDER.indexOf(leader.ideology) - center);
    const pvGap = Math.max(0, (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer);
    const ideologyTrigger = ideoDist / 6;
    const patronageTrigger = pvGap;
    let fireRaw = cfg.baseFireChance
      + cfg.ideologyTriggerWeight * ideologyTrigger
      + cfg.patronageTriggerWeight * patronageTrigger;
    if (challenger.traits.includes('Ambitious')) fireRaw += LEADERSHIP_RULES.ambitiousFireBonus;
    const fireChance = clamp(fireRaw, 0, LEADERSHIP_RULES.fireCap);

    if (!chance(fireChance)) continue;

    challenges++;
    const edge = (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer;
    const successChance = clamp(0.5 + edge - cfg.incumbencyAdvantage / 100, 0.05, 0.95);

    if (chance(successChance)) {
      // Challenger wins: swap the chair.
      leader.factionLeaderOf = null;
      challenger.factionLeaderOf = f.id;
      f.leaderId = challenger.id;
      f.leadershipStartYear = year;
      recordFactionLeadership(snap, {
        year, factionId: f.id, kind: 'challenged',
        leaderId: challenger.id, formerLeaderId: leader.id,
        challengerId: challenger.id, success: true, reason: 'challenge-win',
      });
      addLog(snap, '2.2.3', 'appointment',
        `${challenger.firstName} ${challenger.lastName} unseats ${leader.firstName} ${leader.lastName} as leader of the ${f.name}.`);
      unseated++;
    } else {
      // Challenger loses: Failed Bid stamp.
      if (!challenger.traits.includes('Failed Bid')) challenger.traits.push('Failed Bid');
      challenger.failedBidExpiresYear = year + 2 * LEADERSHIP_RULES.failedBidDecayTurns;
      recordFactionLeadership(snap, {
        year, factionId: f.id, kind: 'challenged',
        challengerId: challenger.id, success: false, reason: 'challenge-loss',
      });
      addLog(snap, '2.2.3', 'appointment',
        `${challenger.firstName} ${challenger.lastName}'s bid to lead the ${f.name} fails; the chair holds.`);
    }
  }

  // Step 4: single refreshPv at end (picks up Ambitious seeds, Failed Bid
  // stamps/decays, and +8 leader prestige deltas via factionLeaderOf).
  snap.politicians = refreshPv(snap.politicians);

  // Step 5: end-of-phase invariant check. Empty factions and all-Failed-Bid
  // factions are expected exceptions; everything else with eligible members
  // must have a leader.
  for (const f of snap.factions) {
    if (f.leaderId) continue;
    const hasEligible = snap.politicians.some((p) =>
      p.factionId === f.id && !p.deathYear && !p.retiredYear && !p.traits.includes('Failed Bid'),
    );
    if (hasEligible) {
      addLog(snap, '2.2.3', 'system', `No eligible leader for ${f.name}.`);
    }
  }

  if (challenges + newSeats > 0) {
    addLog(snap, '2.2.3', 'system',
      `Leadership: ${challenges} challenges resolved (${unseated} unseated); ${newSeats} new leaders installed.`);
  }
}
```

Key semantics:
- **Steps 2 and 3 are mutually exclusive per faction.** `continue` after Election skips the Challenge path. Spec criterion #11.
- **Failed Bid decay (Step 0) runs BEFORE Ambitious seed (Step 1) BEFORE per-faction logic.** A politician whose Failed Bid expires this turn is immediately eligible to challenge again.
- **`factionLeaderOf` mutations are confined to Steps 2 and 3.** The Election path clears old + sets new; the Challenge-win path clears old + sets new; the Challenge-loss path leaves both untouched. No other site in the codebase writes `factionLeaderOf`.
- **`refreshPv` runs ONCE at the end** (Step 4). The +8 leader prestige, Failed Bid -5 stamp, Ambitious +4 stamp all land on the same tick — no intermediate refresh drift.
- **The invariant check (Step 5)** only fires a warning log if a non-empty faction has no leader AND has at least one eligible member. Empty factions or all-Failed-Bid factions are silent (expected edge cases).
- **`failedBidExpiresYear = year + 2 * failedBidDecayTurns`**: spec binds 3 turns × 2 years/turn = 6 years. A challenge that loses at year 1772 expires at year 1778 (>= check, so the year-1778 2.2.3 head clears it).

#### 2k. `vacateOffice` (lines 1770–1802) — UNCHANGED

Per Checkpoint 1 binding: NO `FactionLeader` arm. The leader role is no longer carried by `currentOffice`, so `vacateOffice` has nothing to do here. Stale leadership on death/retire/defect is caught by the runner's Step 2 validation on the very next 2.2.3 tick; the `getFactionLeader` helper defends every read in the interim 1-turn window.

#### 2l. Imports at top of phaseRunners.ts

Add to the existing `import { ... } from '../types';` line:

```ts
LEADERSHIP_RULES, LEADERSHIP_FEED_CAP,
type FactionLeadershipEntry,
```

`Era` is already used elsewhere in the file (Grep confirms) and no new type-only import needed beyond `FactionLeadershipEntry`.

### 3) `/home/user/AMPU/src/pages/FactionLeaderPage.tsx` — wholesale rewrite (39 lines → ~four-section read-only dashboard)

Replace the file. Structure:

```tsx
import { useGame } from '../state/GameContext';
import { useNavigation } from '../state/NavigationContext';
import { PartyBadge } from '../components/PartyBadge';
import {
  LEADERSHIP_RULES, IDEOLOGY_ORDER, POSITIVE_TRAITS,
  type Politician, type Faction, type FactionLeadershipEntry, type FullGameSnapshot, type Era,
} from '../types';
import { factionCenter } from '../engine/phaseRunners';

// Era-conditional plain-English tooltip text for Section C "Why?" hover.
const ERA_RISK_BLURB: Record<Era, string> = {
  independence: 'Pre-1800: challenges are rare; patronage and PV dominate over ideology distance.',
  federalism:   '1800s caucus era: patronage still drives most challenges; ideology weighs ~30%.',
  nationalism:  '1865-1900 machine era: patronage rivalry ~60%; ideology distance ~40%.',
  modern:       '21st century: ideology distance drives ~80% of challenge risk; primaries reign.',
};

function preview(snap: FullGameSnapshot, f: Faction, leader: Politician, challenger: Politician):
    { risk: number; threat: number } {
  const cfg = LEADERSHIP_RULES.eraConfig[snap.game.currentEra];
  const center = factionCenter(snap, f.id) ?? IDEOLOGY_ORDER.indexOf(leader.ideology);
  const ideoDist = Math.abs(IDEOLOGY_ORDER.indexOf(leader.ideology) - center);
  const pvGap = Math.max(0, (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer);
  let fireRaw = cfg.baseFireChance + cfg.ideologyTriggerWeight * (ideoDist / 6) + cfg.patronageTriggerWeight * pvGap;
  if (challenger.traits.includes('Ambitious')) fireRaw += LEADERSHIP_RULES.ambitiousFireBonus;
  const risk = Math.max(0, Math.min(LEADERSHIP_RULES.fireCap, fireRaw));
  const edge = (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer;
  const threat = Math.max(0.05, Math.min(0.95, 0.5 + edge - cfg.incumbencyAdvantage / 100));
  return { risk, threat };
}

export function FactionLeaderPage(): JSX.Element {
  const { snapshot } = useGame();
  const { navigateTo } = useNavigation();
  if (!snapshot) return <div />;

  const f = snapshot.factions.find((ff) => ff.id === snapshot.game.playerFactionId);
  if (!f) return <div />;
  const leader = f.leaderId ? snapshot.politicians.find((p) => p.id === f.leaderId) ?? null : null;
  const cfg = LEADERSHIP_RULES.eraConfig[snapshot.game.currentEra];

  // Cross-link header (matches FactionAlignments pattern).
  const CrossLinks = () => (
    <div className="text-xs text-slate-500 space-x-2">
      <button onClick={() => navigateTo('factionAlignments')} className="underline">Faction Alignments</button>
      <span>/</span>
      <button onClick={() => navigateTo('factionConversions')} className="underline">Conversions</button>
      <span>/</span>
      <button onClick={() => navigateTo('ideologyShifts')} className="underline">Ideology Shifts</button>
      <span>/</span>
      <button onClick={() => navigateTo('kingmakers')} className="underline">Kingmakers</button>
    </div>
  );

  // Section A — Current leader card.
  // Section B — Leadership benefits panel (era-conditional from LEADERSHIP_RULES).
  // Section C — Top-3 challengers with Risk % and Threat %.
  // Section D — Succession history (last 10, filtered to viewed faction).
  // ... render JSX ...
}
```

**Section A — Current leader card.** Renders `leader.firstName/lastName + PartyBadge`, ideology, state, age, `pvCache`, `command`, tenure (`year - (f.leadershipStartYear ?? year)`), faction-fit distance (`|IDEOLOGY_ORDER.indexOf(leader.ideology) - factionCenter(snap, f.id)|`), trait pills. Highlights propagation-active traits with inline blurbs read from `LEADERSHIP_RULES` magnitudes (Orator → `"+${LEADERSHIP_RULES.oratorIdeologyShiftBonus} to faction ideology shifts"`; etc.). Threat chip: color-coded display of top challenger's `preview(...).risk` (green < 0.05, yellow 0.05-0.12, red > 0.12).

**Section B — Leadership benefits panel.** Renders every active bonus from `LEADERSHIP_RULES`, era-conditional. Always: "+8 PV via FactionLeader prestige"; "leader counted 1.5× in faction ideology center"; for non-independence era: "+10% to election bias when leader is on the ballot" (read from `electionOnBallotMul`), "+0.05 per-faction-member vote on bills the leader sponsors" (read from `sponsorFloorBias`). Trait-conditional rows appear ONLY if the leader carries the relevant trait. **Zero hardcoded numbers**: every magnitude reads `LEADERSHIP_RULES.x`.

**Section C — Top-3 challengers.** Compute the pool per Step 2 of the runner: same-faction, alive, non-retired, `pvCache >= LEADERSHIP_RULES.challengerPvFloor`, not holding Failed Bid, not the leader. Sort by `pvCache` descending (id tiebreak). Take top 3. Per row: name, ideology, PV, trait chips, **Risk %** = `(preview.risk * 100).toFixed(1) + '%'`, **Threat %** = `(preview.threat * 100).toFixed(1) + '%'`, and a "Why?" hover tooltip with `ERA_RISK_BLURB[snapshot.game.currentEra]`.

**Section D — Succession history.** `(snapshot.game.factionLeadership ?? []).filter((e) => e.factionId === f.id).slice(-10).reverse()`. Per row: year, kind badge (Installed / Challenged-Win / Challenged-Loss / Vacated), former leader name lookup (if `formerLeaderId`), new leader name lookup (if `leaderId`), challenger name lookup (if `challengerId`), reason chip. Empty state: "No leadership transitions yet."

No GameContext mutator. No sidebar changes. No auto-nav ref. Page id `'factionLeader'` is already registered (`registry.ts:73`, `Sidebar.tsx:33`).

## Files to touch (exact, ordered)

1. `/home/user/AMPU/src/types.ts` — Append `'Ambitious'` and `'Failed Bid'` to `Trait` union (line 106); append `'Ambitious'` to `POSITIVE_TRAITS` (line 137); append `'Failed Bid'` to `NEGATIVE_TRAITS` (line 156); add `LEADERSHIP_RULES` const + `LEADERSHIP_FEED_CAP = 200` after line 323; add `ambitiousSeeded?: boolean`, `failedBidExpiresYear?: number`, `factionLeaderOf?: string | null` to `Politician` interface after line 387; add `leadershipStartYear?: number` to `Faction` interface after line 398; add `factionLeadership?: FactionLeadershipEntry[]` to `GameState` after line 678; add `FactionLeadershipEntry` interface after line 768.

2. `/home/user/AMPU/src/pv.ts` — `computePV` adds `if (p.factionLeaderOf != null) total += 8;` after the existing `currentOffice` prestige block at line 78–80. Signature unchanged.

3. `/home/user/AMPU/src/engine/phaseRunners.ts` — Imports gain `LEADERSHIP_RULES`, `LEADERSHIP_FEED_CAP`, `type FactionLeadershipEntry`. Modify `factionCenter` (lines 620–625) for 1.5× leader weight. Insert `getFactionLeader` helper near line 627. Modify `ideologyShiftOdds` (line 633) to add optional `actorLeader` param + Orator bonus; update `resolveIdeologyShift` call site (line 668) to pass `getFactionLeader(snap, actorFactionId)`. Modify `conversionOdds` (line 902) to add Manipulative bonus via `getFactionLeader`. Insert Kingmaker bonus roll in `runPhase_2_1_7_Kingmakers` Phase 4 graduation pass (before line 1328). Modify `runPhase_2_1_8_FactionPersonalities` drop pass K to per-faction effective K with Leadership +1. Insert `recordFactionLeadership` helper near line 1414 (next to `recordAlignmentDrift`). Modify `electionFactionBias` (lines 1398–1412) to accept optional `candidateId` + apply ×1.1 multiplier with era + leader guards; update `calcStateVote` call site (line 2363) to pass `c.id`. Replace `runPhase_2_2_3_FactionLeaders` wholesale (lines 1672–1678) with the Step 0-5 runner. Modify `runPhase_2_6_3_Floor` federal-era tally (lines 2222–2236) to add `leaderSponsorBonus` via `getFactionLeader`. `vacateOffice` UNCHANGED.

4. `/home/user/AMPU/src/pages/FactionLeaderPage.tsx` — Replace 39-line file with the four-section read-only dashboard described above. Imports `useGame`, `useNavigation`, `PartyBadge`, types, `LEADERSHIP_RULES`, `IDEOLOGY_ORDER`, `POSITIVE_TRAITS`, `factionCenter`. Local `preview` helper for Risk/Threat percentages and `ERA_RISK_BLURB` const.

Confirmed UNTOUCHED: `engine.ts`, `phases.ts`, `registry.ts`, `Sidebar.tsx`, `GameContext.tsx`, `App.tsx`, every scenario data file, the draft pipeline, every other page/component.

## Test / verification plan

- **Build/typecheck**: `npm run build`. The `Trait` union expansion flows through POSITIVE/NEGATIVE arrays and PV math. `LEADERSHIP_RULES.eraConfig satisfies Record<Era, {...}>` enforces exhaustiveness — all four eras must be present, no extras. `FactionLeadershipEntry` interface is type-only; new optional Politician/Faction/GameState fields are back-compat.

- **Playtest 1772 (new game, `npm run dev`)**:
  1. Turn 1 (year 1772): open Faction Leader page. Verify Section A renders the player faction's expected leader (Sam Adams expected for Sons of Liberty per historian binding). Verify PV shows +8 baseline bump (Sam Adams baseline PV plus 8). Verify Section B lists independence-era benefits only (no on-ballot ×1.1, no sponsor floor bias rows — federal-era gated). Verify Section C shows top 3 challengers with Risk % near 0-3% (era multiplier × 0.015 base × low ideo/PV deltas at turn 1) and Threat % around 20-30% (`incumbencyAdvantage = 30` for independence). Verify Section D empty state ("No leadership transitions yet."). Cross-links navigate to Faction Alignments / Conversions / Ideology Shifts / Kingmakers.
  2. Verify (DevTools): every faction has `leaderId` set; every leader has `factionLeaderOf === f.id`; every leader has `leadershipStartYear === 1772`; `factionLeadership` array contains one `installed` entry per faction with `reason: 'election'`.
  3. Verify `factionCenter` 1.5× weight observable: pick a faction with the leader at a distinct ideology from members; compare the returned center value pre-edit (mental math) and post-edit. Edge case — if no behavioral change occurs at bucket boundaries, 2.1.8 personality may be unchanged (acceptable; per spec, the change is at boundaries only).
  4. Advance ~10 turns. Watch the feed for `2.2.3` lines. Expectation: very few challenges fire (independence has the lowest era baseline). Verify no crashes; verify `factionCenter` is read by 2.1.5 / 2.1.8 / 2.1.6 with no errors. Verify Ambitious trait surfaces on ~5% of politicians per tick (cumulative over multiple ticks reaches several percent of the population).
  5. Force a leader defection via DevTools (mutate leader.factionId): next 2.2.3 should detect `factionId !== f.id` → invalidation → Election → log "X elected to lead the Y." Feed gains one `installed` entry with `formerLeaderId` set, `reason: 'election'`. Old leader's `factionLeaderOf` is cleared by the runner's defensive cleanup.

- **Playtest 1856 (new game)**:
  1. Turn 1: every faction has a leader with `factionLeaderOf` set; PV reflects +8 bump; Section B lists nationalism-era benefits (election ×1.1, sponsor floor bias rows visible). Section C Risk values around 5-12% range (nationalism `baseFireChance = 0.045`, `incumbencyAdvantage = 15`).
  2. Advance ~10 turns. Watch for challenge fires (expect 1-3 over a 10-turn window at nationalism era). Verify Failed Bid trait appears on losers; verify decay 6 years later (turn after `year + 6`).
  3. Sponsor a bill where the player faction leader is the sponsor: verify federal-era 2.6.3 tally produces an observably higher yea rate for same-faction members vs baseline. Eyeball the votes line.

- **Dual-role verification (1856)**:
  1. Find a Senator who is also the Faction Leader (likely by turn 2-3). DevTools `pvCache` should equal `computePV(p)`. Verify with `p.currentOffice = { type: 'Senator', ... }` AND `p.factionLeaderOf === f.id`: baseline PV + 5 (Senator) + 8 (Leader) = +13 over a free agent baseline.
  2. Vacate the Senator office (e.g., force retirement, but for tests just force `runPhase_2_4_1_Deaths` mutate): verify `factionLeaderOf` is NOT cleared by `vacateOffice` (it shouldn't be — `vacateOffice` doesn't have a FactionLeader arm). Leadership state survives the federal-seat vacate, as intended.

- **`getFactionLeader` dead-leader defense**:
  1. Force-kill a leader mid-turn (DevTools `p.deathYear = year`); inspect a subsequent 2.1.5 / 2.1.6 / 2.1.7 / 2.6.3 / `calcStateVote` run BEFORE the next 2.2.3 tick. Verify no Orator/Manipulative/Kingmaker/Leadership bonus is granted (the helper's death/retire filter catches the stale state).

- **Edge cases from the spec to verify manually**:
  - Empty faction (zero living members): runner skips with no log entry; page Section A shows a vacant state if the player's faction is somehow empty.
  - All-Failed-Bid faction: warning log fires ("No eligible leader for X."); resolves next turn as decay clears stamps.
  - Leader-on-ballot in 1856 presidential election: confirm `electionFactionBias` returns +bias × 1.1 for the leader candidate vs same-faction non-leader candidates. Independence-era guard prevents 1772 confusion (verified by code; no 2.9.x runs in 1772 per spec note).

## Risks

1. **`factionCenter` 1.5× propagation across three live 2.x systems.** This is the spec's PM-flagged #1 risk. `factionCenter` is consumed by 2.1.5 ideology shifts (line 657), 2.1.6 conversion fit (lines 878, 886), 2.1.8 personality + drift (lines 1431, 1450), AND the new 2.2.3 challenge fire trigger. The 1.5× weight changes the integer bucket at boundaries only — identity-preserving in expectation — but a leader ideologically far from a near-bucket-boundary faction can flip personality at the upgrade tick. Mitigation: the constant is a single-line tune. Reviewer must verify 1772 and 1856 turn-1 bucket math produces sensible factions; if any flip from LW↔Center or Center↔RW at the upgrade tick is jarring, lower to 1.25× or 1.0×.

2. **`getFactionLeader` helper is load-bearing for the 1-turn dead-leader defense window.** Every propagation read MUST go through this helper. The phaseRunners.ts edits enumerate the call sites (2.1.5 `resolveIdeologyShift`, 2.1.6 `conversionOdds`, 2.1.7 Phase 4 graduation, 2.1.8 drop pass K, 2.6.3 floor tally). If any future leader-trait read inlines its own `snap.factions.find(...).leaderId ? snap.politicians.find(...) : null` lookup instead of using the helper, a dead leader's traits could leak bonuses for the 1-turn window between 2.4.1 death and the next 2.2.3 Step 2 validation sweep.

3. **`factionLeaderOf` cleanup discipline.** Mutated at exactly two sites (Election Step 2 and Challenge Step 3 winner-resolve) within the 2.2.3 runner. On death/retire/defect MID-TURN, NO immediate cleanup of `factionLeaderOf` occurs — the next 2.2.3 Step 2 catches the stale state and runs Election. The `getFactionLeader` helper defends every read in the interim. If a future contributor adds a third `factionLeaderOf` mutation site without coordination, the invariants break.

4. **`eraConfig` exhaustiveness via `Record<Era, ...>`.** `Era` is fixed at four members today (`'independence' | 'federalism' | 'nationalism' | 'modern'`, types.ts:433). The `satisfies` clause enforces this at compile time. When a future feature expands `Era` (e.g., adds `'gilded-age'` or `'progressive-era'`), the `LEADERSHIP_RULES.eraConfig` const MUST be updated in the same PR or the build breaks (good — visible failure). The historian's brief flags `nationalism` as too coarse for the 1865-1900 patronage-machine window; tunable, but out of scope for v1.

5. **Save migration: `factionLeaderOf` not retroactively set on legacy saves.** Per Acceptance Criterion #34: legacy saves where the old 6-line runner set `f.leaderId` without ever assigning `currentOffice.type === 'FactionLeader'` will trigger an invalidation Election at the first post-update 2.2.3 (since the validation now checks `current.factionLeaderOf === f.id` and finds undefined). The same incumbent will likely re-win under the new selection formula (they were already top-PV); one `installed` feed entry per faction on the upgrade-tick. Mild log churn; expected.

6. **Hardcoded `8` in `pv.ts` mirrors `OFFICE_PRESTIGE.FactionLeader`.** Two sources for the leader-PV magnitude (the live `factionLeaderOf` branch in `computePV`; the dead `OFFICE_PRESTIGE.FactionLeader` field). If a future tune changes one without the other, the dead code drifts from live behavior — harmless (the dead field is never read) but confusing. Future cosmetic-cleanup feature should remove `OFFICE_PRESTIGE.FactionLeader` along with the dead `OfficeType.FactionLeader` union member.

7. **2.1.8 drop-pass K substitution requires finding the exact read site.** The spec gives the semantics ("drop K = `stableTurns + (Leadership ? 1 : 0)`") but the current implementation uses a top-of-runner `const K = ALIGNMENT_RULES.stableTurns;` at line 1426 — global per-tick, not per-faction. Builder must restructure to per-faction effective K inside the drop loop. If they accidentally also modify the ADD loop, Leadership starts granting cards (wrong — Leadership only helps you keep cards). Read the runner body carefully and confirm separation.

---

Brief path: `/home/user/AMPU/docs/briefs/faction-leaders.md`

## Checkpoint-2 summary

- **Approach**: Wholesale replace the 6-line 2.2.3 stub with a 6-step pipeline (Failed Bid decay → Ambitious seed → per-faction validation+Election → per-faction Challenge → single refreshPv → invariant log). Leadership state carried by new `Politician.factionLeaderOf` (decoupled from `currentOffice` per Checkpoint 1; `computePV` adds +8 additively). `factionCenter` weights leader 1.5×. Five trait-propagation hooks attach via mandatory `getFactionLeader(snap, factionId)` helper that filters dead/retired (closes the 1-turn window between 2.4.1 and the next 2.2.3). Era-tuned challenge mechanism lives in `LEADERSHIP_RULES.eraConfig: Record<Era, ...>` with TypeScript exhaustiveness — Roll A blends ideology-distance and PV-gap triggers per era (historian-binding); Roll B uses per-era `incumbencyAdvantage`. Page is a 4-section read-only dashboard reading every magnitude from `LEADERSHIP_RULES`. `vacateOffice` UNTOUCHED.

- **Files (4, all required)**: `src/types.ts` (Trait union + POSITIVE/NEGATIVE arrays + Politician fields + Faction field + GameState field + FactionLeadershipEntry interface + LEADERSHIP_RULES const + LEADERSHIP_FEED_CAP); `src/pv.ts` (+8 PV via `factionLeaderOf` read in `computePV`); `src/engine/phaseRunners.ts` (runner rewrite + factionCenter 1.5× + getFactionLeader helper + ideologyShiftOdds Orator + conversionOdds Manipulative + 2.1.7 Kingmaker bonus roll + 2.1.8 drop K Leadership + electionFactionBias on-ballot + calcStateVote pass-through + 2.6.3 tally sponsor bias + recordFactionLeadership helper); `src/pages/FactionLeaderPage.tsx` (wholesale rewrite to 4-section read-only dashboard with preview helper).

- **Top risk**: `factionCenter` 1.5× propagation. The function is consumed by 2.1.5, 2.1.6, 2.1.8, AND the new 2.2.3 challenge math — four live systems share it. The 1.5× weight is identity-preserving in expectation and the return is rounded to integer 0..6, so behavioral change only at bucket boundaries. But at the upgrade tick, a faction with a leader near a bucket boundary may flip personality once (1772 and 1856 turn-1 should be reviewer-verified). Mitigation: single-const tune via `LEADERSHIP_RULES.ideologyWeightInFactionCenter`. Secondary risk: `getFactionLeader` helper must be used at every propagation read — inline lookups would miss the dead/retired filter and leak bonuses through a 1-turn window between 2.4.1 death and the next 2.2.3 validation.
