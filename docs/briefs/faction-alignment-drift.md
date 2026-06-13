# Brief: Faction Alignment Drift (Phase 2.1.8)

## Approach

The fifth (and final) installment of the 2.1.x placeholder-conversion arc closes the consequence loop: the player's prior choices in 2.1.5 / 2.1.6 / 2.6 / 2.9 already drive `game.interestGroups`, and now those scores write into faction identity (cards) which in turn add a small additive bias at every per-voter site that reads `bill.effects.interestGroups`, plus a per-candidate election bias on `calcStateVote`. There is NO player action, NO confirm card, NO auto-nav, NO `GameContext` mutator; 2.1.8 itself is silent. The dedicated page is purely educational — a read-only Values Reference Library, reachable anytime because nothing on it is interactive or phase-locked. The Layer-1 string-to-union migration is the single change that pins everything else: replace `Faction.{ideology,lobby,interest}Cards: string[]` with the three typed unions enumerated in the spec, and add a single `ALIGNMENT_RULES` const that holds every threshold, bias rate, soft cap, and bucket map — zero hardcoded numbers in the runner or the page JSX. Two new pure exported helpers (`cardVoteBias`, `electionFactionBias`) get called additively at the four binding voting/election sites; a tiny FIFO recorder (`recordAlignmentDrift`) mirrors the established `recordConversion` / `recordKingmaker` contract. The 2.1.8 runner is rewritten wholesale as a 5-step drift tick (personality refresh fixes the documented dead-counting bug; per-faction ideology / interest / lobby drift uses a flat `K = 2` stable-turns clock kept in `game.alignmentStability`; a defensive `refreshPv` and one conditional summary log close it out). Rejected alternative: a separate `Faction.alignmentScore: number` running aggregate (proposed during exploration) — would have duplicated `game.interestGroups` (the existing single source) and given the runner two scores to keep in sync; the proxy-via-`lobbyToInterest` plus direct interest reads keeps a single arithmetic source.

## State & type changes

All in `/home/user/AMPU/src/types.ts`.

### Card union types (inserted AFTER line 260, before `OfficeType` at line 262)

Three string-literal unions exactly matching the spec audit (15 / 15 / 22 members). The `FreeTrade` and `CivilRights` dual-use names are intentional — same string in two typed namespaces, resolved by which array the card sits in:

```ts
export type InterestCardId =
  | 'Planters' | 'Manufacturers' | 'Settlers' | 'Workers' | 'Reformers'
  | 'Abolitionists' | 'Nativists' | 'Immigrants' | 'Border' | 'Freedmen'
  | 'WallStreet' | 'FreeTrade' | 'MilitaryIndustrial' | 'CivilRights'
  | 'LawAndOrder';

export type LobbyCardId =
  | 'Patriots' | 'Merchants' | 'NationalUnity' | 'Planters' | 'SmallFarmers'
  | 'Lawyers' | 'Reformers' | 'SlavePower' | 'Expansionists' | 'ProUnion'
  | 'UrbanLabor' | 'NorthernIndustry' | 'Abolitionists' | 'EvangelicalReform'
  | 'Nativists';

export type IdeologyCardId =
  | 'Independence' | 'Republicanism' | 'Whiggery' | 'Tradition' | 'StatesRights'
  | 'Reformism' | 'Compromise' | 'Federalism' | 'StrongCenter'
  | 'SlaveryRights' | 'Manifestdestiny' | 'Populism' | 'Antimonopoly'
  | 'FreeTrade' | 'GradualEmancipation' | 'FreeSoil' | 'Industry'
  | 'Antislavery' | 'Abolition' | 'CivilRights' | 'Nativism' | 'Protestantism';
```

**CRITICAL** — do NOT auto-expand `InterestCardId` to all 31 entries in `INTEREST_GROUPS` (factions1856.ts:24-31). The other 16 keys (`LaborUnions`, `BigTech`, `BigOilGas`, `BigAg`, `Protectionists`, `HumanRights`, `Welfare`, `PublicHousing`, `Globalists`, `Isolationists`, `Nationalists`, `Theocrats`, `Expansionists` as an interest, `Pacifists`, `RWActivists`, `LWActivists`, `RWMedia`, `LWMedia`) are dead scaffolding — none are referenced by any seed faction card, any `BILL_TEMPLATES` impact, or any 1856 era-event impact. The 15-member union is the closed audit.

### `ALIGNMENT_RULES` and `ALIGNMENT_DRIFT_CAP` (inserted directly AFTER `KINGMAKERS_CAP` at line 260)

```ts
// Faction alignment drift — single source for engine AND legend.
export const ALIGNMENT_RULES = {
  dropThreshold: -4,
  addThreshold: 4,
  stableTurns: 2, // K
  cardBiasPerDelta: 0.03,
  electionBiasPerScore: 0.5,
  electionBiasCap: 3,
  personalityBuckets: { lwMax: 2.5, rwMin: 4.5 },
  cardCapPerType: 4, // soft cap on interest + lobby separately
  lobbyToInterest: {
    Patriots: 'Reformers',
    Merchants: 'Manufacturers',
    NationalUnity: 'Border',
    Planters: 'Planters',
    SmallFarmers: 'Settlers',
    Lawyers: 'Manufacturers',
    Reformers: 'Reformers',
    SlavePower: 'Planters',
    Expansionists: 'Settlers',
    ProUnion: 'Border',
    UrbanLabor: 'Workers',
    NorthernIndustry: 'Manufacturers',
    Abolitionists: 'Abolitionists',
    EvangelicalReform: 'Reformers',
    Nativists: 'Nativists',
  } as Record<LobbyCardId, InterestCardId>,
  ideologyCardBucket: {
    Independence: 'LW', Republicanism: 'LW', Reformism: 'LW', Populism: 'LW',
    Antimonopoly: 'LW', Antislavery: 'LW', Abolition: 'LW', CivilRights: 'LW', FreeSoil: 'LW',
    Whiggery: 'Center', Compromise: 'Center', Federalism: 'Center', StrongCenter: 'Center',
    GradualEmancipation: 'Center', Manifestdestiny: 'Center', Industry: 'Center', FreeTrade: 'Center',
    Tradition: 'RW', StatesRights: 'RW', SlaveryRights: 'RW', Nativism: 'RW', Protestantism: 'RW',
  } as Record<IdeologyCardId, 'LW' | 'Center' | 'RW'>,
  interestCardBucket: {
    Abolitionists: 'LW', Reformers: 'LW', Workers: 'LW', Immigrants: 'LW',
    Freedmen: 'LW', CivilRights: 'LW',
    Manufacturers: 'Center', Settlers: 'Center', Border: 'Center',
    FreeTrade: 'Center', WallStreet: 'Center',
    Planters: 'RW', Nativists: 'RW', MilitaryIndustrial: 'RW', LawAndOrder: 'RW',
  } as Record<InterestCardId, 'LW' | 'Center' | 'RW'>,
};
export const ALIGNMENT_DRIFT_CAP = 200;
```

**`as const` semantics**: the outer object is NOT `as const`-narrowed because the runner reads `cardBiasPerDelta`, `addThreshold`, etc. at runtime and would resent literal-narrowing on every arithmetic site. The three bucket maps are typed as `Record<...>` (not `as const`) so indexing by any union member is type-safe and the runner's `ALIGNMENT_RULES.interestCardBucket[c]` lookup returns `'LW' | 'Center' | 'RW' | undefined`. The `personalityBuckets` inner object also is NOT `as const` — Step 1 of the runner just reads the numbers. This matches the `CONVERSION_ODDS` / `KINGMAKER_RULES` precedent above.

### `Faction` field type changes (lines 331–333)

Replace the three `string[]` with the typed unions (the seed data already only uses valid ids per Layer 1 audit — confirmed by the Explore agent):

```ts
ideologyCards: IdeologyCardId[];
lobbyCards: LobbyCardId[];
interestCards: InterestCardId[];
```

### `GameState` additions (inserted AFTER `kingmakers?` at line 611)

```ts
factionAlignmentDrift?: FactionAlignmentDriftEntry[];
alignmentStability?: Record<string, { firstSeenYear: number }>;
```

Both optional; legacy saves load via `?? []` / `?? {}` first-read defaults (eager init inside the runner — `snap.game.factionAlignmentDrift ??= []` and `snap.game.alignmentStability ??= {}` on Step 1 entry, matching the established pattern).

### `FactionAlignmentDriftEntry` interface (inserted AFTER `KingmakerEntry` at line 688)

```ts
export interface FactionAlignmentDriftEntry {
  year: number;
  factionId: string;
  kind: 'personality-shift' | 'card-added' | 'card-dropped' | 'card-swapped';
  cardType?: 'interest' | 'lobby' | 'ideology';
  cardId?: InterestCardId | LobbyCardId | IdeologyCardId;
  fromCardId?: InterestCardId | LobbyCardId | IdeologyCardId; // for 'card-swapped'
  fromPersonality?: 'LW' | 'Center' | 'RW';                    // for 'personality-shift'
  toPersonality?: 'LW' | 'Center' | 'RW';                      // for 'personality-shift'
  reason?: 'crashed' | 'emerging' | 'realigned' | 'composition';
}
```

### Save / migration impact

- The two new `GameState` fields are optional — legacy IndexedDB saves load unchanged.
- The `Faction` `string[]` → typed-union[] migration is **type-only**. Per the Layer 1 audit confirmed by Explore, every seed value in `factions1772.ts` and `factions1856.ts` is in the unions. **However**, a defensive load-time filter is added to `repair()` (see GameContext changes below) to silently strip any unknown card ids from all three Faction arrays — this defends future modders / save-format drift and is the only migration code that ships with the feature.
- `repair()` is NOT structurally extended (no new repair pass for absent fields — the optional `??=` eager init inside the runner is enough); only the defensive filter is added.

## Engine changes (pure logic)

All randomness via `rng.ts`. All passes iterate `snap.politicians` / `snap.factions` in array order. Type imports at line 1 add `FactionAlignmentDriftEntry`; value imports at line 2 add `ALIGNMENT_RULES`, `ALIGNMENT_DRIFT_CAP`. (`refreshPv`, `clamp`, `chance`, `pick`, `IDEOLOGY_ORDER`, `factionCenter` already imported / defined in scope.)

### 1) New helper `recordAlignmentDrift` (mirror of `recordKingmaker` / `recordConversion`)

Insert directly above `runPhase_2_1_8_FactionPersonalities` (the runner being rewritten):

```ts
function recordAlignmentDrift(snap: FullGameSnapshot, entry: FactionAlignmentDriftEntry): void {
  if (!snap.game.factionAlignmentDrift) snap.game.factionAlignmentDrift = [];
  const arr = snap.game.factionAlignmentDrift;
  arr.push(entry);
  if (arr.length > ALIGNMENT_DRIFT_CAP) arr.splice(0, arr.length - ALIGNMENT_DRIFT_CAP);
}
```

Pure. Mutates `snap.game.factionAlignmentDrift` in place. FIFO-capped at 200. Not exported (used only by the runner).

### 2) New exported pure helper `cardVoteBias`

Insert directly above `recordAlignmentDrift`:

```ts
export function cardVoteBias(
  snap: FullGameSnapshot,
  factionId: string | null,
  impacts: { id: string; delta: number }[] | undefined,
): number {
  if (!factionId || !impacts || impacts.length === 0) return 0;
  const faction = snap.factions.find((f) => f.id === factionId);
  if (!faction) return 0;
  let total = 0;
  for (const imp of impacts) {
    const heldAsInterest = (faction.interestCards as readonly string[]).includes(imp.id);
    const heldAsLobby = faction.lobbyCards.some(
      (l) => ALIGNMENT_RULES.lobbyToInterest[l] === imp.id,
    );
    if (heldAsInterest || heldAsLobby) {
      total += ALIGNMENT_RULES.cardBiasPerDelta * imp.delta;
    }
  }
  return total;
}
```

**Type-narrowing note on `heldAsInterest`**: `imp.id` is a `string` (bill effects' `interestGroups` array is typed `{ id: string; delta: number }[]` — never narrowed to `InterestCardId`). The `(faction.interestCards as readonly string[]).includes(imp.id)` cast is the cleanest way to ask "is this string-keyed impact id present in our typed-string array?" without forcing a re-cast at each call site. The lobby `.some()` lookup goes through `ALIGNMENT_RULES.lobbyToInterest[l] === imp.id` — both sides are strings at runtime, types validate.

**Null-safe**: returns 0 on (a) null/missing factionId, (b) missing faction, (c) empty/undefined impacts. The caller always clamps the resulting `p + bias` into `[0, 1]` via the `clamp` helper.

### 3) New exported pure helper `electionFactionBias`

Insert directly above `cardVoteBias`:

```ts
export function electionFactionBias(snap: FullGameSnapshot, factionId: string | null): number {
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
  return clamp(raw, -ALIGNMENT_RULES.electionBiasCap, ALIGNMENT_RULES.electionBiasCap);
}
```

`clamp` is already imported from `../rng` at phaseRunners.ts:4 (verified). Pure; cap ±3 per the spec. Stacks interest + lobby-via-proxy intentionally (spec assumption #7).

### 4) 2.6.2 Committee — chair pass chance gets the bias

Site: phaseRunners.ts:1912 — `const passChance = sameParty ? 0.85 : 0.25;`.

**BEFORE** (lines 1910–1913):
```ts
const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
const sameParty = chair.partyId === sponsor?.partyId;
const passChance = sameParty ? 0.85 : 0.25;
if (chance(passChance)) {
```

**AFTER**:
```ts
const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
const sameParty = chair.partyId === sponsor?.partyId;
const passChance = clamp(
  (sameParty ? 0.85 : 0.25) + cardVoteBias(snap, chair.factionId, bill.effects.interestGroups),
  0, 1,
);
if (chance(passChance)) {
```

Existing same-party 0.85 / cross 0.25 unchanged; bias additive, clamp `[0, 1]` defends `chance()`.

### 5) 2.6.3 Floor House+Senate — shared `tally()` gets the per-member bias

Site: phaseRunners.ts:1953–1966 (the shared `tally` closure used for BOTH chambers).

**BEFORE** (lines 1955–1963):
```ts
for (const m of members) {
  const sameParty = m.partyId === sponsor.partyId;
  const sameFaction = m.factionId === sponsor.factionId;
  let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.15;
  // ideology distance
  const dist = Math.abs(IDEOLOGY_ORDER.indexOf(m.ideology) - IDEOLOGY_ORDER.indexOf(sponsor.ideology));
  p -= dist * 0.05;
  if (chance(p)) yea++;
  else nay++;
}
```

**AFTER**:
```ts
for (const m of members) {
  const sameParty = m.partyId === sponsor.partyId;
  const sameFaction = m.factionId === sponsor.factionId;
  let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.15;
  // ideology distance
  const dist = Math.abs(IDEOLOGY_ORDER.indexOf(m.ideology) - IDEOLOGY_ORDER.indexOf(sponsor.ideology));
  p -= dist * 0.05;
  p = clamp(p + cardVoteBias(snap, m.factionId, bill.effects.interestGroups), 0, 1);
  if (chance(p)) yea++;
  else nay++;
}
```

Modifying `tally()` once covers BOTH chambers (the function is called as `tally(houseMembers)` and `tally(senateMembers)` at lines 1967–1968). Existing partisan / ideology-distance terms unchanged. Per-member `clamp [0, 1]` defends `chance(p)`.

### 6) `voteCC` (continentalCongress.ts) — per-delegate `p` gets the bias

Site: continentalCongress.ts:175 — `let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.2;`.

**BEFORE** (lines 170–177):
```ts
for (const d of delegates) {
  const dpol = snap.politicians.find((p) => p.id === d.politicianId);
  if (!dpol) continue;
  const sameFaction = dpol.factionId === sponsor.factionId;
  const sameParty = dpol.partyId === sponsor.partyId;
  let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.2;
  if (chance(p)) aye++; else nay++;
}
```

**AFTER**:
```ts
for (const d of delegates) {
  const dpol = snap.politicians.find((p) => p.id === d.politicianId);
  if (!dpol) continue;
  const sameFaction = dpol.factionId === sponsor.factionId;
  const sameParty = dpol.partyId === sponsor.partyId;
  let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.2;
  p = clamp(p + cardVoteBias(snap, dpol.factionId, bill.effects.interestGroups), 0, 1);
  if (chance(p)) aye++; else nay++;
}
```

**Import additions** at continentalCongress.ts:3 (verified the file currently imports only `uid, chance, pick` from `../rng`):
- Add `clamp` to the rng import: `import { uid, chance, pick, clamp } from '../rng';`
- Add cross-file engine import: `import { cardVoteBias } from './phaseRunners';` (per the spec; cross-engine-file import is sanctioned).

Existing same-faction 0.92 / same-party 0.6 / cross 0.2 unchanged.

### 7) `calcStateVote` (phaseRunners.ts) — per-candidate election bias

Site: phaseRunners.ts:2093 — the score formula.

**BEFORE** (line 2093):
```ts
const score = 50 + baseLean * 5 + partyPref * 5 + enthusiasm * 2 + pv * 0.1 + (Math.random() - 0.5) * 8;
```

**AFTER**:
```ts
const factionBias = electionFactionBias(snap, c.factionId);
const score = 50 + baseLean * 5 + partyPref * 5 + enthusiasm * 2 + pv * 0.1 + factionBias + (Math.random() - 0.5) * 8;
```

Term injected between `pv * 0.1` and `(Math.random() - 0.5) * 8` exactly as the spec writes. **`Math.random()` is NOT converted** to `rng.ts` (pre-existing concern, spec assumption #8). Used by 2.9.4 / 2.9.5 / 2.9.6 via the shared function. Cap ±3 is enforced inside `electionFactionBias` itself — score formula stays simple.

### 8) Drift runner — replace `runPhase_2_1_8_FactionPersonalities` wholesale (phaseRunners.ts:1372–1381)

Rename the function to `runPhase_2_1_8_FactionAlignmentDrift` and update the dispatch in `engine.ts` to call the new name. **NOTE**: per `engine.ts` dispatch convention (verified pattern from kingmakers brief — `engine.ts` and `phases.ts` untouched), check that engine.ts actually references this symbol by name; if it does, the rename ripples to one engine.ts line. If engine.ts dispatches via a phase-id-to-function map, the map entry's value updates. Either way, the change is one line in engine.ts. **CONFIRM AT BUILD TIME** (if engine.ts uses the old name as a string key in a phase dispatcher, it stays; if it uses a function ref, that ref updates). Conservative fallback: keep the function name `runPhase_2_1_8_FactionPersonalities` (the externally-referenced symbol stays stable) and just rewrite the body. **Recommendation**: keep the existing function name to avoid the engine.ts rename ripple — the function is what runs, the name is incidental.

Exact step order — **5 steps, no extra commentary**:

```ts
export function runPhase_2_1_8_FactionPersonalities(snap: FullGameSnapshot): void {
  // Eager init
  if (!snap.game.factionAlignmentDrift) snap.game.factionAlignmentDrift = [];
  if (!snap.game.alignmentStability) snap.game.alignmentStability = {};
  const stability = snap.game.alignmentStability;
  const year = snap.game.year;
  const K = ALIGNMENT_RULES.stableTurns;
  let personalityShifts = 0, added = 0, dropped = 0, swapped = 0;

  // Step 1: Personality refresh — fixes the dead-counting bug via factionCenter
  // (living-only mean). Same < 2.5 / >= 4.5 thresholds as today's runner; only
  // the input changes.
  for (const f of snap.factions) {
    const center = factionCenter(snap, f.id);
    if (center === null) continue;
    const before = f.personality;
    const next: 'LW' | 'Center' | 'RW' =
      center < ALIGNMENT_RULES.personalityBuckets.lwMax ? 'LW' :
      center >= ALIGNMENT_RULES.personalityBuckets.rwMin ? 'RW' : 'Center';
    if (next !== before) {
      f.personality = next;
      recordAlignmentDrift(snap, {
        year, factionId: f.id, kind: 'personality-shift',
        fromPersonality: before, toPersonality: next,
      });
      personalityShifts++;
    }
  }

  // Step 2: Per-faction card drift — ideology swap → interest drop+add → lobby drop+add
  for (const f of snap.factions) {
    const center = factionCenter(snap, f.id);
    if (center === null) continue;
    const bucket: 'LW' | 'Center' | 'RW' =
      center < ALIGNMENT_RULES.personalityBuckets.lwMax ? 'LW' :
      center >= ALIGNMENT_RULES.personalityBuckets.rwMin ? 'RW' : 'Center';

    // --- Step 2a: IdeologyCard drift (center-driven, K-stable bucket clock) ---
    const persoKey = `${f.id}|__personality`;
    const persoEntry = stability[persoKey];
    if (!persoEntry) {
      stability[persoKey] = { firstSeenYear: year };
    } else if (year - persoEntry.firstSeenYear >= K) {
      // Eligible to swap one out-of-bucket card for one in-bucket card.
      const outOfBucket = [...f.ideologyCards]
        .filter((c) => ALIGNMENT_RULES.ideologyCardBucket[c] !== bucket)
        .sort();
      const candidatesIn = (Object.keys(ALIGNMENT_RULES.ideologyCardBucket) as IdeologyCardId[])
        .filter((c) => ALIGNMENT_RULES.ideologyCardBucket[c] === bucket && !f.ideologyCards.includes(c))
        .sort();
      if (outOfBucket.length > 0 && candidatesIn.length > 0) {
        const fromCardId = outOfBucket[0];
        const cardId = candidatesIn[0];
        f.ideologyCards = f.ideologyCards.filter((c) => c !== fromCardId);
        f.ideologyCards.push(cardId);
        recordAlignmentDrift(snap, {
          year, factionId: f.id, kind: 'card-swapped', cardType: 'ideology',
          fromCardId, cardId, reason: 'realigned',
        });
        swapped++;
      }
    }
    // Note: bucket mismatch is handled by deleting/resetting the persoEntry on the
    // *next* tick where the center differs — but the personality field itself
    // updated in Step 1 and the next 2.1.8 tick will recompute bucket from
    // factionCenter. We do NOT compare against stored bucket here — the clock is
    // simply "stable >= K turns since first seen"; a personality-shift in Step 1
    // implies a bucket change which is *also* a clock reset, which we capture by
    // deleting the persoEntry when Step 1 emits a shift:
    // (handled by inserting `delete stability[persoKey];` inside the
    //  `if (next !== before)` block of Step 1 above.)

    // --- Step 2b: InterestCard drift — DROP then ADD ---
    // DROP pass
    for (const c of [...f.interestCards]) {
      const score = snap.game.interestGroups[c] ?? 0;
      const key = `${f.id}|interest:${c}`;
      if (score <= ALIGNMENT_RULES.dropThreshold) {
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= K) {
          f.interestCards = f.interestCards.filter((x) => x !== c);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-dropped', cardType: 'interest',
            cardId: c, reason: 'crashed',
          });
          dropped++;
        }
      } else if (stability[key]) {
        delete stability[key];
      }
    }
    // ADD pass — one per tick, soft cap respected
    if (f.interestCards.length < ALIGNMENT_RULES.cardCapPerType) {
      const heldProxy = new Set(f.lobbyCards.map((l) => ALIGNMENT_RULES.lobbyToInterest[l]).filter(Boolean));
      const candidates = (Object.keys(ALIGNMENT_RULES.interestCardBucket) as InterestCardId[])
        .filter((cand) => !f.interestCards.includes(cand))
        .filter((cand) => !heldProxy.has(cand))
        .filter((cand) => (snap.game.interestGroups[cand] ?? 0) >= ALIGNMENT_RULES.addThreshold)
        .filter((cand) => ALIGNMENT_RULES.interestCardBucket[cand] === bucket)
        .sort();
      for (const cand of candidates) {
        const key = `${f.id}|interest:${cand}`;
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= K) {
          f.interestCards.push(cand);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-added', cardType: 'interest',
            cardId: cand, reason: 'emerging',
          });
          added++;
          break; // at most one ADD per faction per tick
        }
      }
      // Lapsed candidates (held / already-proxied) — clear stale clocks.
      for (const key of Object.keys(stability)) {
        if (!key.startsWith(`${f.id}|interest:`)) continue;
        const cardId = key.slice(`${f.id}|interest:`.length) as InterestCardId;
        if (f.interestCards.includes(cardId)) continue; // it was just added; entry already deleted
        const sc = snap.game.interestGroups[cardId] ?? 0;
        if (sc < ALIGNMENT_RULES.addThreshold && sc > ALIGNMENT_RULES.dropThreshold) {
          // No longer qualifying for drop OR add — clear the clock.
          delete stability[key];
        }
      }
    }

    // --- Step 2c: LobbyCard drift — identical shape, proxied scores, namespaced keys ---
    // DROP
    for (const c of [...f.lobbyCards]) {
      const proxy = ALIGNMENT_RULES.lobbyToInterest[c];
      const score = snap.game.interestGroups[proxy] ?? 0;
      const key = `${f.id}|lobby:${c}`;
      if (score <= ALIGNMENT_RULES.dropThreshold) {
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= K) {
          f.lobbyCards = f.lobbyCards.filter((x) => x !== c);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-dropped', cardType: 'lobby',
            cardId: c, reason: 'crashed',
          });
          dropped++;
        }
      } else if (stability[key]) {
        delete stability[key];
      }
    }
    // ADD
    if (f.lobbyCards.length < ALIGNMENT_RULES.cardCapPerType) {
      const candidates = (Object.keys(ALIGNMENT_RULES.lobbyToInterest) as LobbyCardId[])
        .filter((cand) => !f.lobbyCards.includes(cand))
        .filter((cand) => {
          const proxy = ALIGNMENT_RULES.lobbyToInterest[cand];
          return (snap.game.interestGroups[proxy] ?? 0) >= ALIGNMENT_RULES.addThreshold;
        })
        .filter((cand) => {
          const proxy = ALIGNMENT_RULES.lobbyToInterest[cand];
          return ALIGNMENT_RULES.interestCardBucket[proxy] === bucket;
        })
        .sort();
      for (const cand of candidates) {
        const key = `${f.id}|lobby:${cand}`;
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= K) {
          f.lobbyCards.push(cand);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-added', cardType: 'lobby',
            cardId: cand, reason: 'emerging',
          });
          added++;
          break;
        }
      }
      for (const key of Object.keys(stability)) {
        if (!key.startsWith(`${f.id}|lobby:`)) continue;
        const cardId = key.slice(`${f.id}|lobby:`.length) as LobbyCardId;
        if (f.lobbyCards.includes(cardId)) continue;
        const proxy = ALIGNMENT_RULES.lobbyToInterest[cardId];
        const sc = snap.game.interestGroups[proxy] ?? 0;
        if (sc < ALIGNMENT_RULES.addThreshold && sc > ALIGNMENT_RULES.dropThreshold) {
          delete stability[key];
        }
      }
    }
  }

  // Step 3: feed append already done inline via recordAlignmentDrift in Steps 1+2.

  // Step 4: defensive PV refresh (no PV input today moves, but cheap insurance).
  snap.politicians = refreshPv(snap.politicians);

  // Step 5: conditional summary log — at most one line per tick.
  const total = personalityShifts + added + dropped + swapped;
  if (total > 0) {
    addLog(snap, '2.1.8', 'system',
      `Alignments: ${personalityShifts} personality shifts; ${added} added; ${dropped} dropped; ${swapped} swapped.`);
  }
}
```

**Important inline edit to Step 1 personality-shift branch** (called out above): inside `if (next !== before) { ... }` also append `delete stability[\`${f.id}|__personality\`];` so the ideology-card-swap clock resets on a bucket change. (This is the spec's "entries are deleted the moment the qualifying condition lapses" rule applied to the personality clock.) Place the delete just before `personalityShifts++` to keep the bucket-reset close to the bucket-change emission.

**Order within a tick**: personality-shifts first (Step 1 iterates all factions), then per-faction (Step 2 outer loop, in `snap.factions` array order) 2a → 2b → 2c. Matches spec ordering verbatim.

**Stability key conventions** (pinned):
- `${factionId}|__personality` for the ideology-swap bucket clock
- `${factionId}|interest:${cardId}` for InterestCard add/drop
- `${factionId}|lobby:${cardId}` for LobbyCard add/drop

All three keys live in the same flat `Record<string, { firstSeenYear: number }>` map; the namespace prefix prevents collisions across kinds.

**`pickBestForFaction` (phaseRunners.ts:23–43)** — NOT MODIFIED. Draft AI reads `faction.personality`, which is now updated correctly by Step 1; that is the entire 2.1.8 → draft AI consequence chain.

**`applyEffect` (phaseRunners.ts:1725–1760)** — NOT MODIFIED. Reused unchanged as the single mutation point for `game.interestGroups`.

## UI changes

### `/home/user/AMPU/src/state/GameContext.tsx` — defensive load filter only

Add a one-time defensive filter inside `repair()` AFTER the existing career-track migration block (after line 143) and BEFORE the `return dirty ? { ...s } : s;` at line 144. The filter silently drops any unknown card ids from all three Faction arrays — guarantees engine reads `ALIGNMENT_RULES.interestCardBucket[c]` / etc. never resolve to `undefined`:

```ts
// Defensive card-id filter — strip any unknown ids from Faction card arrays
// so engine reads against ALIGNMENT_RULES bucket maps never resolve undefined.
// Cost: 100 factions x ~15 cards = 1500 trivial filter ops per load — negligible.
const validInterest = new Set(Object.keys(ALIGNMENT_RULES.interestCardBucket));
const validLobby = new Set(Object.keys(ALIGNMENT_RULES.lobbyToInterest));
const validIdeology = new Set(Object.keys(ALIGNMENT_RULES.ideologyCardBucket));
for (const f of s.factions) {
  const ic = f.interestCards.filter((c) => validInterest.has(c));
  const lc = f.lobbyCards.filter((c) => validLobby.has(c));
  const ig = f.ideologyCards.filter((c) => validIdeology.has(c));
  if (ic.length !== f.interestCards.length) { f.interestCards = ic as typeof f.interestCards; dirty = true; }
  if (lc.length !== f.lobbyCards.length) { f.lobbyCards = lc as typeof f.lobbyCards; dirty = true; }
  if (ig.length !== f.ideologyCards.length) { f.ideologyCards = ig as typeof f.ideologyCards; dirty = true; }
}
```

Add `ALIGNMENT_RULES` to the types-imports at GameContext.tsx top (currently the imports are `FullGameSnapshot, EraEvent, ConstitutionalConvention, Politician` from `'../types'` at line 2 — add `ALIGNMENT_RULES` to the same line). **This filter runs on EVERY load AND every patch** because `repair()` is invoked on initial load (lines 160, 184) AND after mutations (line 199 in the existing pattern); if the union ever changes, legacy cards get silently dropped, which is the documented desired behavior.

No new `GameContext` methods. No new `useCallback`. No `value` object additions.

### `/home/user/AMPU/src/pages/registry.ts` — register the new page

Insert PageId between `'kingmakers'` (line 38) and the next entry in the union. Add the `Pages` record entry and the import.

- Line 8 (after `import { Kingmakers } from './Kingmakers';`): `import { FactionAlignments } from './FactionAlignments';`
- PageId union (lines 31–60): add `'factionAlignments'` between `'kingmakers'` (line 38) and `'factionLeader'` (line 39):
  ```ts
  | 'kingmakers'
  | 'factionAlignments'
  | 'factionLeader'
  ```
- `Pages` record (around line 69, between `kingmakers: Kingmakers,` and `factionLeader: FactionLeaderPage,`):
  ```ts
  kingmakers: Kingmakers,
  factionAlignments: FactionAlignments,
  factionLeader: FactionLeaderPage,
  ```

### `/home/user/AMPU/src/components/Sidebar.tsx` — sidebar entry between Kingmakers and Draft

Insert one line in the "Your Faction" section between line 38 (`{ id: 'kingmakers', label: 'Kingmakers & Protégés' }`) and line 39 (`{ id: 'draft', label: 'Draft' }`):
```ts
{ id: 'factionAlignments', label: 'Faction Alignments' },
```

### `/home/user/AMPU/src/pages/FactionAlignments.tsx` — NEW page (full body)

Read-only educational page; zero `GameContext` mutators. Structurally three sections (A roster, B feed, C library) plus a one-line header cross-link strip.

**Imports**:
```ts
import { useGame } from '../state/GameContext';
import { useNavigation } from '../state/NavigationContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import {
  ALIGNMENT_RULES, ALIGNMENT_DRIFT_CAP,
  type InterestCardId, type LobbyCardId, type IdeologyCardId, type Faction,
  type FactionAlignmentDriftEntry,
} from '../types';
import { factionCenter } from '../engine/phaseRunners';
```

`factionCenter` is the only engine import — the page's "precise center" hover uses the same living-only mean the runner uses (preview === rule parity, matching the established pattern from Conversions / Kingmakers).

**Cross-link header strip** (between the page title and Section A):

```tsx
<div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
  <span>See also:</span>
  <button onClick={() => navigateTo('ideology')} className="underline hover:text-blue-600">Ideology Shifts</button>
  <button onClick={() => navigateTo('conversions')} className="underline hover:text-blue-600">Faction Conversions</button>
  <button onClick={() => navigateTo('legislation')} className="underline hover:text-blue-600">Legislation</button>
  <button onClick={() => navigateTo('dashboard')} className="underline hover:text-blue-600">Dashboard</button>
  <button onClick={() => navigateTo('interestGroups')} className="underline hover:text-blue-600">Interest Groups</button>
</div>
```

`navigateTo` is obtained via `const { navigateTo } = useNavigation();` at the top of the component. NavigationProvider already wraps every page (App.tsx:137 — verified). The five target PageIds are real (`'ideology'`, `'conversions'`, `'legislation'`, `'dashboard'`, `'interestGroups'` — verified against registry.ts lines 36, 37, 49, 32, 46).

**Section A — Faction roster** (`SortableTable<Faction>`):

```tsx
const rosterRows: Faction[] = [
  ...snapshot.factions.filter((f) => f.id === snapshot.game.playerFactionId),
  ...snapshot.factions.filter((f) => f.id !== snapshot.game.playerFactionId),
];

const rosterColumns: Column<Faction>[] = [
  {
    key: 'name', label: 'Faction',
    sortValue: (f) => f.name,
    render: (f) => (
      <span className="font-semibold">
        {f.name}{f.id === snapshot.game.playerFactionId && <span className="ml-1 text-xs text-emerald-600">(you)</span>}
      </span>
    ),
  },
  {
    key: 'party', label: 'Party',
    sortValue: (f) => f.partyId,
    render: (f) => <PartyBadge party={f.partyId} />,
  },
  {
    key: 'personality', label: 'Personality',
    sortValue: (f) => f.personality,
    render: (f) => {
      const c = factionCenter(snapshot, f.id);
      const title = c == null ? 'No living members' : `Center: ${c.toFixed(2)}`;
      return <span title={title} className="text-xs">{f.personality}</span>;
    },
  },
  {
    key: 'interest', label: 'Interest cards',
    render: (f) => (
      <div className="flex flex-wrap gap-1">
        {f.interestCards.map((c) => {
          const sc = snapshot.game.interestGroups[c] ?? 0;
          const tense = sc <= -3 ? 'border-yellow-500' : sc >= 3 ? 'border-emerald-500' : 'border-slate-300';
          return <span key={c} className={`rounded border px-1 text-[10px] bg-blue-50 dark:bg-blue-900/30 ${tense}`}>{c}</span>;
        })}
      </div>
    ),
  },
  {
    key: 'lobby', label: 'Lobby cards',
    render: (f) => (
      <div className="flex flex-wrap gap-1">
        {f.lobbyCards.map((c) => {
          const proxy = ALIGNMENT_RULES.lobbyToInterest[c];
          const sc = snapshot.game.interestGroups[proxy] ?? 0;
          const tense = sc <= -3 ? 'border-yellow-500' : sc >= 3 ? 'border-emerald-500' : 'border-slate-300';
          return <span key={c} className={`rounded border px-1 text-[10px] bg-purple-50 dark:bg-purple-900/30 ${tense}`} title={`Proxies → ${proxy}`}>{c}</span>;
        })}
      </div>
    ),
  },
  {
    key: 'ideology', label: 'Ideology cards',
    render: (f) => (
      <div className="flex flex-wrap gap-1">
        {f.ideologyCards.map((c) => (
          <span key={c} className="rounded px-1 text-[10px] bg-amber-50 dark:bg-amber-900/30 border border-slate-300">{c}</span>
        ))}
      </div>
    ),
  },
];
```

Hover on personality cell shows `Center: 3.42` to two decimals; YELLOW chip border on cards whose score (proxy-resolved for lobby) `<= -3` (one step from `dropThreshold`); GREEN chip border for `>= +3`. Per-row expandable drift sub-section: omit in v1 to keep the section tight (Section B is the global feed; per-faction filter is via the feed's faction-name column — accepted simplification noted in Risks).

**Section B — Global drift feed**:

```tsx
const feed = (snapshot.game.factionAlignmentDrift ?? []).slice(-30).reverse();
const factionName = (id: string): string => snapshot.factions.find((f) => f.id === id)?.name ?? '(unknown)';
const KIND_LABELS: Record<FactionAlignmentDriftEntry['kind'], string> = {
  'personality-shift': 'Personality',
  'card-added': 'Added',
  'card-dropped': 'Dropped',
  'card-swapped': 'Swapped',
};
const REASON_LABELS: Record<NonNullable<FactionAlignmentDriftEntry['reason']>, string> = {
  crashed: 'Crashed', emerging: 'Emerging', realigned: 'Realigned', composition: 'Composition',
};
```

Render as a row list (not SortableTable — the feed is chronological by construction):
```tsx
<ul className="space-y-1">
  {feed.length === 0 && <li className="text-xs text-slate-500">No alignment drift yet.</li>}
  {feed.map((e, i) => (
    <li key={i} className="text-xs flex items-baseline gap-2 border-b border-slate-200 dark:border-slate-700/50 py-1">
      <span className="font-mono w-12">{e.year}</span>
      <span className="font-semibold">{factionName(e.factionId)}</span>
      <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px]">{KIND_LABELS[e.kind]}</span>
      {e.cardType && <span className="rounded bg-blue-100 dark:bg-blue-900/40 px-1 text-[10px]">{e.cardType}</span>}
      {e.cardId && <span className="font-mono text-[11px]">{e.cardId}</span>}
      {e.fromCardId && <span className="text-slate-500 text-[10px]">← {e.fromCardId}</span>}
      {e.fromPersonality && e.toPersonality && (
        <span className="text-[10px] text-slate-600">{e.fromPersonality} → {e.toPersonality}</span>
      )}
      {e.reason && <span className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 text-[10px]">{REASON_LABELS[e.reason]}</span>}
    </li>
  ))}
</ul>
```

**Section C — Values Reference Library**

A `<details>` legend at the top of Section C (collapsed by default; numbers derived from `ALIGNMENT_RULES` — zero literals in JSX). Then three sub-tables (C1 interest, C2 lobby, C3 ideology).

**`cardProfiles(snap)` helper — PIN**: lives in the page file as a local helper (NOT exported from phaseRunners). Justification: pure derivation over `BILL_TEMPLATES` (which we'd need to also export from phaseRunners), but more importantly, the derivation is presentation-shaped — it returns rows sorted by delta with the bill title preserved for display, which isn't a useful engine artifact. The cost is a tiny page→engine API boundary: `BILL_TEMPLATES` lives at phaseRunners.ts:1849–1858 and would need to become `export const BILL_TEMPLATES` for the page to read it; the 1856 era-event impacts come from `buildEraEventsForYear(year)` in `eraEvents1856.ts` which is already exported. **If `cardProfiles` grows past ~30 LOC, lift to phaseRunners as `interestCardStrengthenedBy(id) / weakenedBy(id)` — but for v1, keep in the page file.** Mirrors the precedent that `pct = (x) => ...` lives at the top of Conversions.tsx as a local helper.

The helper:
```ts
// Local helper — derives Strengthened/Weakened bill lists for an InterestCardId.
// Reads BILL_TEMPLATES (newly exported from phaseRunners) and the era-events
// for the current year's era window. Page-local; not engine-shaped.
function cardProfiles(snap: FullGameSnapshot, id: InterestCardId): {
  strengthenedBy: { title: string; delta: number }[];
  weakenedBy: { title: string; delta: number }[];
} {
  const hits: { title: string; delta: number }[] = [];
  for (const tpl of BILL_TEMPLATES) {
    const imp = tpl.effect.interestGroups?.find((ig) => ig.id === id);
    if (imp) hits.push({ title: tpl.title, delta: imp.delta });
  }
  for (const ev of buildEraEventsForYear(snap.game.year)) {
    for (const r of ev.responses) {
      const imp = r.effect.interestGroups?.find((ig) => ig.id === id);
      if (imp) hits.push({ title: `${ev.title} — ${r.label}`, delta: imp.delta });
    }
  }
  return {
    strengthenedBy: hits.filter((h) => h.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 3),
    weakenedBy: hits.filter((h) => h.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 3),
  };
}
```

**Required export change in phaseRunners.ts**: at line 1849, change `const BILL_TEMPLATES = [...];` to `export const BILL_TEMPLATES = [...];` so the page can import it. This is a one-character edit; no other code references it from outside phaseRunners.ts (verified with Grep). Page imports: add `BILL_TEMPLATES` from `'../engine/phaseRunners'` and `buildEraEventsForYear` from `'../data/eraEvents1856'`.

**Section C structure** — three sub-tables, each a `SortableTable`:

```tsx
// C-Legend
<details className="rounded border border-slate-300 dark:border-slate-700 p-2 text-xs">
  <summary className="cursor-pointer font-semibold">How alignment drift works</summary>
  <ul className="mt-2 space-y-1 ml-4 list-disc">
    <li>Interest groups that score ≤ {ALIGNMENT_RULES.dropThreshold} for {ALIGNMENT_RULES.stableTurns} consecutive ticks get dropped from a faction's card list ('crashed').</li>
    <li>Interest groups that score ≥ {ALIGNMENT_RULES.addThreshold} for {ALIGNMENT_RULES.stableTurns} consecutive ticks become emerging cards if they fit the faction's bucket.</li>
    <li>Personality buckets: LW (center &lt; {ALIGNMENT_RULES.personalityBuckets.lwMax}), RW (center ≥ {ALIGNMENT_RULES.personalityBuckets.rwMin}), else Center.</li>
    <li>Vote bias: every held card adds <span className="font-mono">{ALIGNMENT_RULES.cardBiasPerDelta}</span> × bill delta to a voter's pass chance when the bill impacts that group.</li>
    <li>Election bias: a candidate's faction-card scores add <span className="font-mono">{ALIGNMENT_RULES.electionBiasPerScore}</span> × (sum of held group scores), capped ±{ALIGNMENT_RULES.electionBiasCap}.</li>
    <li>Soft cap: at most {ALIGNMENT_RULES.cardCapPerType} interest cards and {ALIGNMENT_RULES.cardCapPerType} lobby cards per faction.</li>
  </ul>
</details>
```

**C1 — Interest Cards table**:

```tsx
type C1Row = { id: InterestCardId; bucket: 'LW' | 'Center' | 'RW'; score: number; holders: string[]; profiles: ReturnType<typeof cardProfiles> };
const c1Rows: C1Row[] = (Object.keys(ALIGNMENT_RULES.interestCardBucket) as InterestCardId[]).map((id) => ({
  id,
  bucket: ALIGNMENT_RULES.interestCardBucket[id],
  score: snapshot.game.interestGroups[id] ?? 0,
  holders: snapshot.factions.filter((f) => f.interestCards.includes(id)).map((f) => f.name),
  profiles: cardProfiles(snapshot, id),
}));
const c1Columns: Column<C1Row>[] = [
  { key: 'id', label: 'Card', sortValue: (r) => r.id, render: (r) => <span className="font-semibold">{r.id}</span> },
  { key: 'bucket', label: 'Fits', sortValue: (r) => r.bucket, render: (r) => <span className="text-xs">{r.bucket}</span> },
  {
    key: 'score', label: 'Score',
    sortValue: (r) => r.score,
    render: (r) => {
      const pct = ((r.score + 10) / 20) * 100;
      return (
        <div className="flex items-center gap-2 w-32">
          <span className="font-mono text-xs w-8 text-right">{r.score.toFixed(1)}</span>
          <div className="flex-1 h-1.5 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className={`h-full ${r.score >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    },
  },
  { key: 'strengthened', label: 'Strengthened by',
    render: (r) => <span className="text-[11px]">{r.profiles.strengthenedBy.map((b) => `${b.title} (+${b.delta})`).join('; ') || '—'}</span> },
  { key: 'weakened', label: 'Weakened by',
    render: (r) => <span className="text-[11px]">{r.profiles.weakenedBy.map((b) => `${b.title} (${b.delta})`).join('; ') || '—'}</span> },
  { key: 'holders', label: 'Held by',
    sortValue: (r) => r.holders.length,
    render: (r) => <span className="text-[11px]">{r.holders.join(', ') || '—'}</span> },
  { key: 'bonus', label: 'Bonus',
    render: () => <span className="text-[11px] font-mono">+{ALIGNMENT_RULES.cardBiasPerDelta} × Δ</span> },
];
```

**C2 — Lobby Cards table**: identical shape, but score is `interestGroups[lobbyToInterest[id]]` (proxy), profiles call `cardProfiles(snap, proxy)`, and add a "Proxies → " column showing the underlying interest id. Holders filter on `f.lobbyCards.includes(id)`.

**C3 — Ideology Cards table**: lean. Columns: `id`, `bucket` (from `ideologyCardBucket`), `holders` (factions where `f.ideologyCards.includes(id)`). No score, no bill scoring, no bonus column (ideology cards don't bias votes in v1; documented in the legend).

### Cross-link headers on the other three pages (optional, one line each)

Spec criterion 29 calls for cross-links FROM the new page to five others. Spec doesn't strictly require headers ON those five pages back to Faction Alignments, but the kingmakers brief precedent and the spec's "one cross-link header in each" line (spec Out-of-Scope item #15) imply ONE-line additions to:

- `/home/user/AMPU/src/pages/FactionsPage.tsx` — insert one line after the `<h2>` at line 11
- `/home/user/AMPU/src/pages/InterestGroupsPage.tsx` — insert one line after the `<h2>` at line 10
- `/home/user/AMPU/src/pages/LegislationPage.tsx` — insert one line after the `<h2>` at line 22

Each insert is exactly:
```tsx
<button onClick={() => navigateTo('factionAlignments')} className="text-xs underline text-slate-500 hover:text-blue-600">→ Faction Alignments</button>
```
Plus the `useNavigation` import: `import { useNavigation } from '../state/NavigationContext';` and a destructure inside the component: `const { navigateTo } = useNavigation();`. These three are tagged **optional** in the files list — feature works without them; ship if low-effort.

### NO changes
- `engine.ts`, `phases.ts`, `pv.ts` — UNTOUCHED.
- `App.tsx` — UNTOUCHED. No new auto-nav `useRef` for 2.1.8 (the page is informational, the spec binds "NO auto-nav").
- No new `GameContext` methods.
- No `GameContext` `value` additions.
- No scenario-data changes (`game.interestGroups` keeps its existing 31-key seed; the 15-id union is a strict subset of present keys, so all reads resolve).

## Files to touch (exact, ordered)

1. `/home/user/AMPU/src/types.ts` — three union types + `ALIGNMENT_RULES` const + `ALIGNMENT_DRIFT_CAP` + `Faction` field type changes (`string[]` → typed unions) + `GameState` `factionAlignmentDrift` and `alignmentStability` optional fields + `FactionAlignmentDriftEntry` interface.
2. `/home/user/AMPU/src/engine/phaseRunners.ts` — type/value import additions (line 1–2); export `BILL_TEMPLATES` at line 1849; three new exported helpers (`cardVoteBias`, `electionFactionBias`, `recordAlignmentDrift`); 2.6.2 chair pass-chance bias (line 1912 area); 2.6.3 `tally()` per-member bias (line 1961 area); `calcStateVote` electionFactionBias term (line 2093); wholesale replacement of `runPhase_2_1_8_FactionPersonalities` body (lines 1372–1381).
3. `/home/user/AMPU/src/engine/continentalCongress.ts` — add `clamp` to rng import (line 3); add `cardVoteBias` cross-file engine import; per-delegate bias inside `voteCC` (line 175 area).
4. `/home/user/AMPU/src/state/GameContext.tsx` — add `ALIGNMENT_RULES` to types import (line 2); add defensive load filter to `repair()` after line 143 before the return at line 144.
5. `/home/user/AMPU/src/pages/registry.ts` — `import { FactionAlignments } from './FactionAlignments';` (line 8); insert `'factionAlignments'` into PageId union between `'kingmakers'` and `'factionLeader'`; insert `factionAlignments: FactionAlignments,` into the Pages record at the matching position.
6. `/home/user/AMPU/src/components/Sidebar.tsx` — insert `{ id: 'factionAlignments', label: 'Faction Alignments' }` into the "Your Faction" section items between the `'kingmakers'` entry (line 38) and the `'draft'` entry (line 39).
7. `/home/user/AMPU/src/pages/FactionAlignments.tsx` — NEW page: cross-link header + Section A roster `SortableTable` + Section B feed row list + Section C library (`<details>` legend + C1 / C2 / C3 SortableTables) + local `cardProfiles` helper.
8. `/home/user/AMPU/src/pages/FactionsPage.tsx` — OPTIONAL one-line cross-link button to Faction Alignments (with `useNavigation` import).
9. `/home/user/AMPU/src/pages/InterestGroupsPage.tsx` — OPTIONAL one-line cross-link.
10. `/home/user/AMPU/src/pages/LegislationPage.tsx` — OPTIONAL one-line cross-link.

Confirmed UNTOUCHED: `engine.ts`, `phases.ts`, `pv.ts`, `App.tsx`. No scenario-data changes, no new GameContext methods, no new auto-nav ref.

## Test / verification plan

- **Build/typecheck**: `npm run build`. The Faction `string[]` → typed-union[] migration is type-only; TypeScript will surface any seed-data id NOT in the unions (Layer 1 audit confirms there are none). The `BILL_TEMPLATES` export change is a one-character addition; no breaks.

- **Playtest 1856 (`npm run dev`, new game)**:
  1. Reach 2.1.8 — no auto-nav (page is informational). Open Faction Alignments manually via sidebar. Section A renders all 10 1856 factions with seed cards as colored chips (interest blue, lobby purple, ideology amber). Personality column shows seed values; hover reveals `Center: N.NN` via `factionCenter`.
  2. The first 2.1.8 tick may emit 0–2 personality-shift entries (the dead-counting → living-only correction). Section B feed shows them, year-stamped, with `LW → Center` style arrows. Confirm no card events fire on tick 1 (clocks start fresh).
  3. Run a `Fugitive Slave Act Strengthening` (Planters +3, Abolitionists −3) to completion at 2.6 → confirm at next 2.6.3 Floor vote that Conservative Democrats (holds `Planters` interest) get a small Aye nudge on Planter-friendly bills. Verify by inspecting `house.yea` counts before/after on a Planter-positive bill — bias should shift a typical 50/40 split by 1–3 votes.
  4. Drive `Abolitionists` to ≥+4 via 2–3 Personal Liberty Laws; on the 2.1.8 tick TWO turns later, observe an `'emerging'` `'card-added'` event for an LW-bucket faction (Liberal/Radical Republicans). Confirm the feed entry has `cardType: 'interest'`, `reason: 'emerging'`, and the faction's chip count went +1 (capped at 4).
  5. Drive `Planters` to ≤−4 for 2 ticks; observe `'crashed'` `'card-dropped'` for Conservative Democrats. Confirm chip vanishes from Section A.
  6. Run a presidential election (2.9.4 advances via shared `calcStateVote`); verify a candidate from a faction with positive card scores gets a small per-state bias (eyeball `ElectionsPage` pct values — should shift by ≤3 pp). Verify a candidate with negative card scores trends down equivalently.
  7. Reload mid-game (`npm run dev` already persists via IndexedDB on advance). Cards, drift feed, and `alignmentStability` survive intact; section A re-renders identical to pre-reload.

- **Playtest 1772 smoke**:
  1. Turn-1 2.1.8 runs without crash. Section C C1 renders the 15 interest cards with seed scores (mostly 0 — none of the 1772 era events touch interest groups by default in the verified eraEvents1772 dataset).
  2. Reach `voteCC` (era of Independence) — confirm `cardVoteBias` is applied per-delegate (verify by reading `console.log`ed `p` values temporarily, or trust the math: a delegate from `fact_blue_lw_1772` whose faction holds `interestCards: ['Reformers']` voting on a Reformers-impact bill gets `p` shifted by `0.03 × delta`).
  3. Verify Section C-Legend renders all literals from `ALIGNMENT_RULES` (no hardcoded `-4`, `+4`, `0.03`, `0.5`, `3` anywhere in the JSX — grep the page file for those numbers as a guard).
  4. Cross-link header: click each of the 5 links; confirm each navigates to the target page. NavigationProvider wraps every page (verified at App.tsx:137).

- **Edge cases**:
  - Faction at the interest soft cap (4): drive a fifth qualifying card. Confirm the ADD pass skips while still ticking the candidate's clock; on the next turn when a drop frees a slot, the ADD lands.
  - Bucket boundary jitter: a faction whose center oscillates 2 → 3 → 2 emits a single LW → Center → LW personality-shift sequence; each shift deletes the ideology-swap clock (no stuck swap).
  - Empty faction (`factionCenter` returns null): all steps skip; no feed entry.
  - Bill with no `interestGroups` impacts: `cardVoteBias` returns 0; votes identical to pre-feature behavior.
  - `alignmentStability` doesn't grow unboundedly — confirm by triggering several score oscillations and re-loading; the `delete stability[key]` lapse logic clears stale entries.
  - Defensive load filter: hand-edit a saved IndexedDB faction's `interestCards` to include a bogus id (`['Planters', 'Bogus']`) via DevTools, reload; the bogus id is silently stripped, no crash.

## Risks

1. **Cross-system blast radius (THE risk, lead).** This is the largest single feature in the 2.1.x arc: it touches the 2.6.2 committee, 2.6.3 House + Senate, `voteCC`, AND `calcStateVote` (which fans out to 2.9.4 / 2.9.5 / 2.9.6) in one ship. Any miscalibration of `cardBiasPerDelta` (0.03), `electionBiasPerScore` (0.5), or the bucket maps cascades through every vote and every election simultaneously. Mitigations baked into the spec: bias is purely additive (turning `cardBiasPerDelta` to 0 reverts every site to pre-feature behavior in a single const edit); election bias capped at ±3; every site clamps `[0, 1]` on the gated `p`; all values live in `ALIGNMENT_RULES` (single-file tune). The five-line voting-site enumeration in this brief MUST be verified by the reviewer against the live runner before merge.
2. **`alignmentStability` tracking is the only state that grows mid-game; must reset cleanly on score-recovery.** The `delete stability[key]` "lapse" logic runs on score returning inside the threshold band, on bucket change (the explicit `delete stability[${f.id}|__personality]` inserted in Step 1's personality-shift branch), and on successful add/drop (entry consumed). If any of these three deletes is missed in implementation, the K-clock survives the qualifying condition and fires a spurious card event two turns later. Builder MUST verify all three delete sites compile and run.
3. **`repair()` defensive load filter runs on every load AND every patch.** Cost: ~10 factions × ~15 ids per array × 3 arrays = ~450 hash-set lookups per load — trivially fast. Accepted cost for the silent-strip-on-unknown invariant. The filter is engine-shape-safe (the `Set` of valid keys is built from `ALIGNMENT_RULES` directly so a future union edit auto-updates).
4. **Soft-cap-4 churn behavior** — a faction at the interest cap whose DROP pass succeeds AND whose ADD candidate qualifies in the same tick: the DROP fires first (Step 2b order is DROP-then-ADD per spec), and then the slot count drops to 3, allowing the ADD to land. Verify: a faction with `interestCards.length === 4` holding a crashed Planters and an emerging Workers can shed Planters and gain Workers in one tick. The spec edge case explicitly documents this is correct; builder confirms both events fire in the feed for that turn.
5. **`cardProfiles` lives in the page file, not phaseRunners** (architect decision). It's pure derivation over `BILL_TEMPLATES` and `buildEraEventsForYear`, but presentation-shaped. The one boundary call this introduces is the page importing `BILL_TEMPLATES` from phaseRunners (which the spec sanctions; precedent set by `protegeCandidates` / `factionCenter` page→engine imports). If the helper grows past ~30 LOC, lift to phaseRunners.
6. **`Math.random()` in `calcStateVote` line 2093 stays as-is** (spec assumption #8). This is a pre-existing concern outside scope; flagged for a future cleanup pass. Drift runner uses `rng.ts` (deterministic) per CLAUDE.md.
7. **The 5-step runner adds `Object.keys()` iteration over 3 bucket maps per faction per tick**. Cost: 22 + 15 + 15 = 52 key reads × ~10 factions = ~520 ops per tick — trivially fast.
8. **The `BILL_TEMPLATES` export is the only nontrivial pre-existing-engine edit.** It promotes a previously-private array to public, which slightly broadens the engine's API surface. Acceptable because (a) the array is data, not logic, (b) no engine code outside `runPhase_2_6_1_Proposals` reads it, (c) the page is the only new consumer.
9. **Composition-change K modifier is DEFERRED to v2** (spec Step 2d; assumption #5). Flat K = 2 everywhere in v1. Builder MUST NOT speculate-implement.

---

Brief path: `/home/user/AMPU/docs/briefs/faction-alignment-drift.md`

## Checkpoint-2 summary
- **Approach**: silent 5-step drift tick (personality refresh fixes the dead-counting bug → ideology-card swap → interest-card drop+add → lobby-card drop+add → conditional summary log) at 2.1.8; three new typed-union types + one `ALIGNMENT_RULES` const + one `FactionAlignmentDriftEntry` shape; two new pure helpers (`cardVoteBias`, `electionFactionBias`) injected additively at 2.6.2 / 2.6.3 / `voteCC` / `calcStateVote`; one new read-only educational page (`FactionAlignments.tsx`) registered in the sidebar between Kingmakers and Draft; defensive load filter in `repair()`; NO auto-nav, NO `GameContext` mutator, NO scenario-data changes, NO `engine.ts` / `phases.ts` / `pv.ts` / `App.tsx` edits.
- **Files (10, last 3 optional)**: `types.ts`, `engine/phaseRunners.ts` (bulk: runner rewrite + 3 helpers + 3 vote-site mods + `BILL_TEMPLATES` export), `engine/continentalCongress.ts` (one-line bias at `voteCC`), `state/GameContext.tsx` (defensive load filter), `pages/registry.ts` (PageId + Pages + import), `components/Sidebar.tsx` (sidebar entry), `pages/FactionAlignments.tsx` (NEW page), and optionally `pages/FactionsPage.tsx`, `pages/InterestGroupsPage.tsx`, `pages/LegislationPage.tsx` (one cross-link line each).
- **Top risk**: cross-system blast radius — four voting/election sites take additive bias in one ship; any miscalibration of `cardBiasPerDelta` / `electionBiasPerScore` / the bucket maps cascades through every vote and every election simultaneously. Mitigation: all tunables in `ALIGNMENT_RULES` (single-file edit), additive design (zeroing `cardBiasPerDelta` reverts to pre-feature behavior), per-site `clamp [0, 1]` and per-candidate `electionBiasCap = 3` ceilings. Reviewer must verify the four voting-site code blocks in this brief against the live runner before merge.
