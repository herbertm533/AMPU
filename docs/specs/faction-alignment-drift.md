# Spec: Faction Alignment Drift (Phase 2.1.8)

> Fifth activation of the 2.1.x placeholder-conversion arc (Relocations 2.1.4 →
> Ideology Shifts 2.1.5 → Faction Conversions 2.1.6 → Kingmakers 2.1.7 → this).
> Unlike the prior four, 2.1.8 has **NO player action, NO confirm card, NO
> auto-nav, NO `GameContext` mutator**. This is the **institutional-consequence
> tick** that closes the loop: every choice the player already made in 2.1.5 /
> 2.1.6 / 2.6 / 2.9 now writes faction identity here, and faction identity (via
> the card system) now biases the votes in 2.6 / CC / Convention and the
> elections in 2.9. The dedicated page is **purely educational** — a read-only
> values-reference library showing what each card is worth, who holds it, and
> what bills push it up or down. The page is reachable any time; nothing on it
> is phase-locked because nothing on it is interactive.

## Vision (as given)
Activate the 2.1.8 Faction Personalities phase. The current 9-line runner is a
dead-counting mean (KNOWN BUG — `factionCenter` at phaseRunners.ts:619 documents
the correct living-only version) that writes only `f.personality`; the three
freeform `ideologyCards` / `lobbyCards` / `interestCards` string arrays on
`Faction` are never touched by any engine code and have zero engine consumers
(only two UI labels — FactionsPage.tsx:28-29 and FactionLeaderPage.tsx:32-34).
The phase description ("Update faction ideology cards and lobby alignments") is
a lie. But the big finding is that the strings the data already uses for those
arrays (`Planters`, `Manufacturers`, `Settlers`, `Abolitionists`, `FreeTrade`,
…) **are exactly the keys the legislation effects table writes into
`game.interestGroups`** (phaseRunners.ts:1850-1857) and that
`InterestGroupsPage` already displays. Two halves of a system, never connected.
This feature wires them up — typed cards as a single source of truth, a tiny
pure helper that applies a **card vote bias** at every politician-level voting
site **alongside** the existing partisan/ideology score (no rebalance), a
separate election bias on `calcStateVote`, and a real drift tick at 2.1.8 that
adds/drops cards based on the interest-group scores the player has been driving
all game. The drift never overrides player action; it accumulates.

## Player experience
2.1.8 itself is silent — the player doesn't see it advance; it's the connective
tissue. The experience surfaces **elsewhere**: a Free-Soil bill the player
passed two years ago now nudges Abolitionist senators a hair toward Aye on a
Personal Liberty Law; the Planter interest group, after three consecutive years
of crashing under Homestead Acts, *gets dropped* from the Conservative
Democrats' interest cards with a `'crashed'` reason in the feed — and the
faction's down-ballot election bias in southern states quietly weakens.
Conversely, an interest group the player has been feeding (e.g. Manufacturers
climbing under Tariffs and Internal Improvements) **emerges** into the
Moderate Republicans' card list — a "you built this coalition" moment, banked
into the faction's permanent identity. The new Faction Alignments page is the
**educational layer**: hover any card to see its global score, what bills
strengthen / weaken it, which factions currently hold it, and the exact vote
bonus the card delivers when held. The page makes the system legible so the
indirect-consequence chain actually feels earned.

## User story
As a faction-running player, I want the choices I make in ideology, legislation,
and elections to flow into a faction-identity tick that visibly shifts which
interest groups, lobbies, and ideological banners my faction wears — and I want
the resulting cards to give my politicians a small but legible vote bonus on
bills that touch *their* groups and a small electoral bias in states where their
groups poll well — so that the indirect consequences of every other phase have a
durable home and the faction I lead 50 turns in actually reflects 50 turns of
play.

## Verified engine facts (drive the design; architect must not re-derive)
- Current runner `runPhase_2_1_8_FactionPersonalities` (phaseRunners.ts:1372-1381):
  9 lines, iterates `snap.factions`, computes ideology mean **across all
  members including dead/retired** (the dead-counting bug `factionCenter`
  flags at line 619), buckets `< 2.5` → `'LW'`, `> 4.5` → `'RW'`, else
  `'Center'`, sets `f.personality`. **Replace wholesale.**
- `factionCenter(snap, factionId): number | null` (phaseRunners.ts:620-625) —
  **already exported**, living-only mean, returns `null` on empty faction,
  rounded half-up toward RW. Used today by 2.1.5 only. **REUSE unchanged** as
  the personality input + drift driver.
- `f.personality` (Faction.ts:330) has **one** engine consumer: the draft AI
  `pickBestForFaction` (phaseRunners.ts:36-39) reads it to bias the rookie's
  ideology match (+25 score if `personality` aligns). Two UI labels read it
  (FactionsPage.tsx:26, Kingmakers.tsx, etc.). **Keep the field**; set it from
  `factionCenter` at the top of every 2.1.8 tick — least disruption.
- `Faction.ideologyCards: string[]` / `lobbyCards: string[]` / `interestCards:
  string[]` (types.ts:331-333) — **freeform**, zero engine consumers today.
  Used only in two UI joins. **Migrate to typed unions** (see Layer 1).
- `game.interestGroups: InterestGroupScores` = `Record<string, number>`
  (types.ts:440-442, GameState field at 575). Seeded zero for the
  `INTEREST_GROUPS` array (factions1856.ts:24-31 — **30 keys**, used by BOTH
  scenarios via `scenario1772.ts:7` import). Mutated **only** by `applyEffect`
  (phaseRunners.ts:1741-1745) on `{ id, delta }` pairs; **clamped -10..+10**.
  Surfaced read-only on `InterestGroupsPage.tsx` (sorted, bar-style).
- The `BILL_TEMPLATES` table (phaseRunners.ts:1849-1858) and the 1856 era-event
  effects (eraEvents1856.ts:16,20,24,40,48,64,68,72,88,96,120) are **the
  only** sources of `{ id, delta }` interest-group impacts; their ids exactly
  match the `interestCards` strings in `factions1856.ts`. **This is the link.**
- **Voting sites enumerated** (the spec's binding list of where `cardVoteBias`
  applies; architect must not add/remove from this set without checkpoint
  approval):
  1. **2.6.2 Committee** (phaseRunners.ts:1891-1921) — bill committee
     chair-vs-sponsor `chance(passChance)`; chair is a single politician, NOT
     a per-member tally. Bias **applies once** to the chair's per-bill pass
     chance.
  2. **2.6.3 Floor — House + Senate** (phaseRunners.ts:1923-1980) — per-member
     `p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.15; p -= dist * 0.05;
     chance(p)`. **Bias adds an additive term to `p` per member, then clamp
     0..1.** Per chamber per bill.
  3. **`voteCC` (1772 era CC bill voting)** (continentalCongress.ts:161-188) —
     per-delegate `p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.2; chance(p)`.
     **Same shape as 2.6.3.** Bias adds to `p` per delegate.
  4. **Constitutional Convention article votes** (constitutionalConvention.ts:
     78-122, `autoFillCPUVotes` + `preferredOption`) — per-delegate option pick
     by **ideology / party heuristic**, NOT a `chance(p)` Aye/Nay gate. Article
     options do not carry `{ id, delta }` impact lists. **OUT OF SCOPE in v1**
     (no impact targets to bias against). Documented exclusion; flagged.
  5. **2.2.1 Speaker / Senate Pro Tem** (phaseRunners.ts:1386-1417) — top-PV
     pick within majority party, NO `chance(p)` shape, NO impact list.
     **OUT OF SCOPE in v1** per the conditional commit. Documented.
  6. **2.9.1 Primary winner** (phaseRunners.ts:2105-2115) — top-by-`pvCache +
     command * 5`, no per-member vote. **OUT OF SCOPE** (no impact list, no
     per-voter tally).
  7. **`calcStateVote` (election outcomes)** (phaseRunners.ts:2084-2103) —
     per-candidate `score = 50 + baseLean*5 + partyPref*5 + enthusiasm*2 +
     pv*0.1 + (rand-0.5)*8`. **`electionFactionBias` adds a per-candidate
     additive term to `score`**, applied **once per candidate per state vote**.
     Used by 2.9.4 presidential, 2.9.5 governor, 2.9.6 senator + rep.
  - **Cabinet confirmations: no vote pipeline exists** (cabinets are
    appointed top-PV at phaseRunners.ts:1482-1513; `runPhase_2_8_2_CourtMgmt`
    is the same pattern). **OUT OF SCOPE.** Confirmed.
- `applyEffect` (phaseRunners.ts:1725-1760) is the **single mutation point** for
  `game.interestGroups`. Drift's "score" read is from `game.interestGroups[id]`
  at 2.1.8 tick time — **read-only**, no rewrite.
- `IDEOLOGY_ORDER` (types.ts:14-22) maps `LW Populist` (0) … `RW Populist` (6).
  `factionCenter` returns a rounded index `0..6`.
- App.tsx auto-nav effects (lines 24-112) — FIVE existing refs. **No new ref
  for 2.1.8**, per binding vision.
- Sidebar 2.1.x ordering (Sidebar.tsx:32-40): roster / leader / careers /
  relocations / ideology / conversions / **kingmakers** / draft. New entry
  **inserts between `kingmakers` and `draft`** as `'factionAlignments'`.
- `pickBestForFaction` (draft AI, phaseRunners.ts:23-43) reads
  `faction.personality` — kept working by Layer 3 step 1 (personality refresh).
  Draft AI is **NOT** wired to `cardVoteBias` (draft isn't voting). Confirmed.

## Mechanics (decided values)

### Layer 1 — Typed cards, single source of truth (binding)

Migrate the three string arrays on `Faction` to typed union arrays, with **NO
new card identifiers invented**. Every union member must already appear in
`factions1772.ts`, `factions1856.ts`, the `BILL_TEMPLATES` table, or the
1856 era-event effects table. Exhaustive enumeration follows.

#### `InterestCardId` (binding union — every id from the data)
From `factions1772.ts` interestCards + `factions1856.ts` interestCards +
legislation impact ids + 1856 era-event impact ids, deduplicated:

```
type InterestCardId =
  | 'Planters' | 'Manufacturers' | 'Settlers' | 'Workers' | 'Reformers'
  | 'Abolitionists' | 'Nativists' | 'Immigrants' | 'Border' | 'Freedmen'
  | 'WallStreet' | 'FreeTrade' | 'MilitaryIndustrial' | 'CivilRights'
  | 'LawAndOrder';
```

`WallStreet`, `FreeTrade`, `MilitaryIndustrial`, `CivilRights`, `LawAndOrder`
are *impact-only* in the seed data (no faction currently holds them as
interestCards) but are valid targets for emerging-card adds — the union must
include them so the drift can add them. All 15 live in `INTEREST_GROUPS`
(factions1856.ts:24-31), so `game.interestGroups[id]` is already zeroed for
them on scenario start.

#### `LobbyCardId` (binding union — every id from the data)
From `factions1772.ts` lobbyCards + `factions1856.ts` lobbyCards:

```
type LobbyCardId =
  | 'Patriots' | 'Merchants' | 'NationalUnity' | 'Planters' | 'SmallFarmers'
  | 'Lawyers' | 'Reformers' | 'SlavePower' | 'Expansionists' | 'ProUnion'
  | 'UrbanLabor' | 'NorthernIndustry' | 'Abolitionists' | 'EvangelicalReform'
  | 'Nativists';
```

Lobby cards are **NOT** interest groups; they need a proxy to participate in
the vote bias and drift logic. See `LOBBY_TO_INTEREST` below.

#### `IdeologyCardId` (binding union — every id from the data)
From `factions1772.ts` ideologyCards + `factions1856.ts` ideologyCards:

```
type IdeologyCardId =
  | 'Independence' | 'Republicanism' | 'Whiggery' | 'Tradition' | 'StatesRights'
  | 'Reformism' | 'Compromise' | 'Federalism' | 'StrongCenter'
  | 'SlaveryRights' | 'Manifestdestiny' | 'Populism' | 'Antimonopoly'
  | 'FreeTrade' | 'GradualEmancipation' | 'FreeSoil' | 'Industry'
  | 'Antislavery' | 'Abolition' | 'CivilRights' | 'Nativism' | 'Protestantism';
```

Note: `FreeTrade` and `CivilRights` are **dual-use** — they are both
interestCard ids and ideologyCard ids. This is correct (same string in two
typed namespaces; resolved by which array the card sits in on a given faction).

#### `LOBBY_TO_INTEREST` proxy map (binding — exhaustive)
Every `LobbyCardId` maps to the `InterestCardId` it represents, so lobby cards
can participate in vote bias and election bias via the proxy interest score:

| LobbyCardId        | → InterestCardId proxy | Rationale (one line)                                |
|--------------------|------------------------|------------------------------------------------------|
| `Patriots`         | `Reformers`            | revolutionary reform coalition; closest live proxy   |
| `Merchants`        | `Manufacturers`        | commercial / industrial overlap                      |
| `NationalUnity`    | `Border`               | union-preservation has no direct group; Border fits  |
| `Planters`         | `Planters`             | identity map                                         |
| `SmallFarmers`     | `Settlers`             | yeoman-farmer / homesteader overlap                  |
| `Lawyers`          | `Manufacturers`        | bar/commercial bloc; cleanest live proxy             |
| `Reformers`        | `Reformers`            | identity map                                         |
| `SlavePower`       | `Planters`             | direct economic backer                               |
| `Expansionists`    | `Settlers`             | westward-expansion drivers                           |
| `ProUnion`         | `Border`               | unionist sentiment concentrated in Border states     |
| `UrbanLabor`       | `Workers`              | direct map                                           |
| `NorthernIndustry` | `Manufacturers`        | direct economic map                                  |
| `Abolitionists`    | `Abolitionists`        | identity map                                         |
| `EvangelicalReform`| `Reformers`            | Second-Great-Awakening reform energy                 |
| `Nativists`        | `Nativists`            | identity map                                         |

The proxy serves two purposes: (a) `cardVoteBias` looks up impact ids against
lobby cards via this map; (b) `electionFactionBias` sums
`game.interestGroups[proxy]` for each lobby card the candidate's faction holds.

#### 1772-only identifiers — add zero-scored interestGroups entries (binding)
The following are NOT in the bundled `INTEREST_GROUPS` array but appear as
**lobby/interest cards** on 1772 factions. They proxy via `LOBBY_TO_INTEREST`
to existing interest keys (above), so they need NO new `game.interestGroups`
entries themselves. **However**, if a faction's interestCards array directly
lists a 1772-only identifier (`Patriots` does not appear there — only as
lobbyCards — confirmed), no entry is needed. Audit result: **all 1772
interest-card ids already exist in `INTEREST_GROUPS`** (`Reformers`, `Settlers`,
`Manufacturers`, `Planters`). **No `game.interestGroups` augmentation
required for the 1772 scenario.**

The 1772-only **ideologyCard ids** (`Independence`, `Republicanism`, `Whiggery`,
`Tradition`, `StatesRights`, `Reformism`, `Compromise`, `Federalism`,
`StrongCenter`) are **not interest groups** and do not need any
`game.interestGroups` entry (IdeologyCards do not bias votes in v1).
Documented; no scenario-data changes.

### Layer 2 — Cards bias votes and elections (binding)

#### `cardVoteBias(snap, factionId, impacts): number` (pure helper)
Signature:
```
function cardVoteBias(
  snap: FullGameSnapshot,
  factionId: string | null,
  impacts: { id: string; delta: number }[] | undefined,
): number
```
Returns 0 if `factionId` is null, the faction is missing, or `impacts` is
empty/undefined. Otherwise:
```
let total = 0;
for (const imp of impacts) {
  const heldAsInterest = faction.interestCards.includes(imp.id);
  const heldAsLobby = faction.lobbyCards.some(
    (l) => ALIGNMENT_RULES.lobbyToInterest[l] === imp.id
  );
  if (heldAsInterest || heldAsLobby) {
    total += ALIGNMENT_RULES.cardBiasPerDelta * imp.delta;
  }
}
return total;
```

`ALIGNMENT_RULES.cardBiasPerDelta = 0.03` (rationale: in 2.6.3 floor units
`p` ranges 0.15..0.92; ideology distance subtracts up to `0.30`; a typical
bill carries 2-3 impact deltas of magnitude 2-3 each. A held card on a
strongly-aligned bill (Σ|delta| ≈ 5) shifts `p` by ~0.15 — meaningful but
clearly smaller than the partisan / faction-loyalty term. The vision's
suggested `0.3` is in **per-impact** terms, which compounds to ~1.5 on the
same bill — far too large. **`0.03` per delta is the per-delta rate
that lands the vision's intended magnitude (~0.15 on a typical aligned
bill).** Tunable in `ALIGNMENT_RULES`. Flagged as assumption #1.)

**IdeologyCards do not bias votes in v1.** Documented; ideology cards are
identity badges only (drift consequence, not vote engine input).

#### Application sites (binding list, additive only — no rebalance)

For every site, `cardVoteBias` is computed **once per voter per bill** (i.e.
the impacts list is fixed per bill) and added to the existing `p` term **before
the existing `chance(p)` gate**. Final `p` is clamped `[0, 1]`.

| Site                      | Where (file:line)              | Voter                | Impacts source        | Application                                                                            |
|---------------------------|--------------------------------|----------------------|-----------------------|----------------------------------------------------------------------------------------|
| 2.6.2 Committee           | phaseRunners.ts:1891-1921      | Committee chair `c`  | `bill.effects.interestGroups` | `p += cardVoteBias(snap, c.factionId, bill.effects.interestGroups)`; clamp; existing `chance(p)` unchanged |
| 2.6.3 Floor — House       | phaseRunners.ts:1953-1967      | each House member    | `bill.effects.interestGroups` | inside `tally()`, per member: `p += cardVoteBias(snap, m.factionId, bill.effects.interestGroups)`; clamp; `chance(p)` unchanged |
| 2.6.3 Floor — Senate      | phaseRunners.ts:1953-1967      | each Senate member   | `bill.effects.interestGroups` | identical to House (same `tally()` fn)                                                 |
| `voteCC` (1772 CC)        | continentalCongress.ts:161-188 | each delegate `dpol` | `bill.effects.interestGroups` | per delegate: `p += cardVoteBias(snap, dpol.factionId, bill.effects.interestGroups)`; clamp; `chance(p)` unchanged |
| Constitutional Convention | constitutionalConvention.ts:78-122 | n/a                | n/a (no impact list)  | **EXCLUDED v1** — articles do not carry `{id, delta}` impacts                          |
| 2.2.1 Speaker / Pro Tem   | phaseRunners.ts:1386-1417      | n/a                  | n/a (PV pick, no vote)| **EXCLUDED v1** — not a vote-score shape                                               |
| Cabinet confirmation      | n/a                            | n/a                  | n/a                   | **EXCLUDED v1** — no confirmation vote pipeline exists                                 |

This is the **complete** list of voting sites that ship in v1. The architect's
brief may further confirm; the spec's commitment is that **every politician-
level voting site that today reads `bill.effects.interestGroups` gets
`cardVoteBias` applied with the formula above**, no others.

#### `electionFactionBias(snap, factionId): number` (pure helper)
Signature:
```
function electionFactionBias(snap: FullGameSnapshot, factionId: string | null): number
```
Returns 0 if `factionId` is null or faction missing. Otherwise:
```
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
```

`ALIGNMENT_RULES.electionBiasPerScore = 0.5` and `electionBiasCap = 3`
(rationale: `calcStateVote` score ranges roughly 30..70 before random;
sum of card scores at maximum spread = 5 cards × ±10 = ±50; the vision's
`0.1 pp per score point` reading is ambiguous (pp of what?). Implemented as
**0.5 points of `calcStateVote` score per group score point, capped ±3 score
points per candidate per state**, which translates to roughly ±3 percentage
points of vote share in a 2-way race — exactly the vision's "cap ±3 pp"
intent. Per-candidate, per-state-vote; applied once per candidate. Tunable.
Flagged as assumption #2.)

**Application:** in `calcStateVote` (phaseRunners.ts:2087-2095), one line
inside the `scores` map:
```
const factionBias = electionFactionBias(snap, c.factionId);
const score = 50 + baseLean * 5 + partyPref * 5 + enthusiasm * 2
            + pv * 0.1 + factionBias + (Math.random() - 0.5) * 8;
```

Used by 2.9.4, 2.9.5, 2.9.6 via the shared `calcStateVote`.

### Layer 3 — 2.1.8 becomes the drift tick (binding; no player action)

`runPhase_2_1_8_FactionAlignmentDrift(snap)` runs in this exact order. Pure;
all randomness via `rng.ts`; one conditional `addLog` at the end.

#### Step 1: Personality refresh (FIXES the dead-counting bug)
```
for (const f of snap.factions) {
  const center = factionCenter(snap, f.id);
  if (center === null) continue;
  const before = f.personality;
  const next = center < 2.5 ? 'LW' : center >= 4.5 ? 'RW' : 'Center';
  if (next !== before) {
    f.personality = next;
    recordAlignmentDrift(snap, {
      year: snap.game.year, factionId: f.id,
      kind: 'personality-shift',
      fromPersonality: before, toPersonality: next,
    });
  }
}
```
Personality is set from `factionCenter` (living-only mean — fixes the bug).
**The `< 2.5` / `>= 4.5` thresholds are preserved exactly** as today's runner;
the only change is the input. `>=` on the RW bound matches today's runner's
behavior on the rounded integer center (0..6) — at index 5 the faction
becomes RW. Confirmed binding; flagged as assumption #3.

Empty factions (`factionCenter` returns null) **skip** — personality unchanged,
no feed entry. Same on personality-equal — no event emitted.

#### Step 2: Per-faction card drift (the core consequence loop)

For each faction `f` (skip if `factionCenter(snap, f.id)` is null):

**2a. IdeologyCard drift (center-driven).** Resolve the current center bucket
(`LW` / `Center` / `RW`) via the same thresholds as Step 1. The
`ALIGNMENT_RULES.ideologyCardBucket` map below assigns each `IdeologyCardId` to
exactly one bucket. **Stability tracking:** maintain
`game.alignmentStability` (see state shape) keyed by `f.id|'__personality'`.
If the bucket matches the recorded prior bucket, the year-counter is the
stored `firstSeenYear`; on bucket change the entry resets to the current year.
**Swap rule:** once a bucket has been stable for `>= K` consecutive turns (i.e.
`year - firstSeenYear >= K`), the faction may swap **one** ideologyCard that
does NOT belong to the current bucket for **one** ideologyCard that does (and
that the faction doesn't already hold). Cards are sorted alphabetically for
deterministic picking under a seeded RNG; one swap per tick. **K = 2.**
On swap, emit:
```
{ kind: 'card-swapped', cardType: 'ideology',
  fromCardId, cardId, reason: 'realigned' }
```

If no non-bucket card to drop OR no in-bucket card not already held → no swap.

**2b. InterestCard drift (score-driven; DROP-then-ADD).**

DROP pass: for each card `c` in `f.interestCards`, let
`score = game.interestGroups[c] ?? 0` and key
`k = f.id|c`. If `score <= ALIGNMENT_RULES.dropThreshold = -4`:
- If no `game.alignmentStability[k]` entry, create one with
  `firstSeenYear = game.year` (clock starts THIS turn).
- Else if `game.year - entry.firstSeenYear >= K`, **drop** the card:
  `f.interestCards = f.interestCards.filter(x => x !== c)`,
  delete the stability entry, emit:
  ```
  { kind: 'card-dropped', cardType: 'interest', cardId: c, reason: 'crashed' }
  ```
- If `score > -4`, **delete** any stale entry (clock reset).

ADD pass: build the candidate set = every `InterestCardId` in the union NOT
already in `f.interestCards`, NOT already in `f.lobbyCards` (proxy-resolved),
and where `game.interestGroups[cand] >= ALIGNMENT_RULES.addThreshold = +4`.
For each candidate, **ideology-fit gate**: the candidate's bucket
(`ALIGNMENT_RULES.interestCardBucket[cand]`) must equal the faction's current
bucket. Stability tracker key `f.id|cand` as above; on first qualifying
turn store `firstSeenYear = game.year`; on `game.year - firstSeenYear >= K`
**add** the card. **Soft cap:** if `f.interestCards.length >= 4`, skip the
add (drop pass still ran first, so a faction at the cap can churn). Emit:
```
{ kind: 'card-added', cardType: 'interest', cardId: cand, reason: 'emerging' }
```
At most one ADD per faction per tick (alphabetical deterministic pick on ties).

**2c. LobbyCard drift.** Identical shape to 2b on `f.lobbyCards`, but the
score lookup uses the proxy: `score = game.interestGroups[lobbyToInterest[c]]`.
Drop on proxy `<= -4` for K turns; add on proxy `>= +4` for K turns +
bucket-fit (via the lobby card's underlying interest bucket). Soft cap 4
lobby cards. Stability keys use the lobby card id directly (`f.id|c`),
**namespaced separately** from interest by the card's typed list it lives in
(architect: a tiny prefix like `f.id|lobby:c` vs `f.id|interest:c` is the
clean implementation; pin in the state shape below).

**2d. Composition-change modifier on K.** **DEFERRED to v2.** v1 uses a
flat `K = 2` everywhere. Documented; flagged as assumption #5.

#### Step 3: Feed append
Every drift event in Steps 1, 2a, 2b, 2c appends to `game.factionAlignmentDrift`
(FIFO `ALIGNMENT_DRIFT_CAP = 200`). Single shape (`FactionAlignmentDriftEntry`,
see state shape). Order within a tick: personality-shifts first, then per
faction (in `snap.factions` array order) 2a → 2b → 2c.

#### Step 4: `refreshPv` (defensive)
One call to `snap.politicians = refreshPv(snap.politicians)`. Drift does NOT
move any PV input today (no skill / trait / office changes), but the call is
cheap and defends against future PV terms keyed to faction.personality.

#### Step 5: Conditional summary log
At most ONE `addLog(snap, '2.1.8', 'system', ...)` line, only when total
events in this tick > 0. Format:
`Alignments: ${personalityShifts} personality shifts; ${added} added; ${dropped} dropped; ${swapped} swapped.`

No other logs anywhere in the 2.1.8 code (established pattern).

### State shape (binding)

#### New `Faction` field types
```
ideologyCards: IdeologyCardId[];
lobbyCards: LobbyCardId[];
interestCards: InterestCardId[];
```
Replaces the three `string[]`. The seed data in `factions1772.ts` and
`factions1856.ts` already uses only valid ids (Layer 1 audit confirms);
no data changes required. The fields stay on the `Faction` interface;
**no separate Faction1772 changes** beyond the union type.

#### New `GameState` fields (placed after `kingmakers` at types.ts:611)
```
factionAlignmentDrift?: FactionAlignmentDriftEntry[];
alignmentStability?: Record<string, { firstSeenYear: number }>;
```
Both optional; legacy saves load (`?? []` / `?? {}` at first read). No
`repair()` changes.

#### `FactionAlignmentDriftEntry` (binding shape)
```
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

#### `alignmentStability` key convention (binding)
```
key = `${factionId}|${listType}:${cardId}` for interest/lobby drift
key = `${factionId}|__personality`         for the personality bucket clock
```
Value: `{ firstSeenYear: number }`. The "consecutive turns" check is
`game.year - firstSeenYear >= K`. Entries are **deleted** the moment the
qualifying condition lapses (score crosses back inside the threshold band, or
the bucket changes), so the next qualifying turn starts a fresh clock.

#### New `ALIGNMENT_RULES` const (binding, after `KINGMAKER_RULES`)
```
export const ALIGNMENT_RULES = {
  dropThreshold: -4,
  addThreshold: 4,
  stableTurns: 2,            // K
  cardBiasPerDelta: 0.03,
  electionBiasPerScore: 0.5,
  electionBiasCap: 3,
  personalityBuckets: { lwMax: 2.5, rwMin: 4.5 } as const,
  cardCapPerType: 4,         // soft cap on interest + lobby separately
  lobbyToInterest: { /* exact map from Layer 1 */ } as Record<LobbyCardId, InterestCardId>,
  ideologyCardBucket: { /* exact map below */ } as Record<IdeologyCardId, 'LW' | 'Center' | 'RW'>,
  interestCardBucket: { /* exact map below */ } as Record<InterestCardId, 'LW' | 'Center' | 'RW'>,
} as const;
export const ALIGNMENT_DRIFT_CAP = 200;
```
Zero hardcoded numbers in the page JSX or in the drift runner; **single source
for engine AND legend**.

#### `ALIGNMENT_RULES.interestCardBucket` (binding, exhaustive)

| InterestCardId      | Bucket | Rationale (one line)                                            |
|---------------------|--------|------------------------------------------------------------------|
| `Abolitionists`     | LW     | progressive moral coalition                                      |
| `Reformers`         | LW     | reform movements (temperance, abolition, suffrage)               |
| `Workers`           | LW     | labor / working-class                                            |
| `Immigrants`        | LW     | nativist counter-coalition; LW in 19c party alignment            |
| `Freedmen`          | LW     | civil-rights coalition                                           |
| `CivilRights`       | LW     | civil-rights cluster                                             |
| `Manufacturers`     | Center | cross-aligned industrial bloc; sits in the median                |
| `Settlers`          | Center | homesteader bloc; both parties courted it 1856                   |
| `Border`            | Center | unionist cross-pressure; pivot bloc                              |
| `FreeTrade`         | Center | cross-aligned economic ideology (Jacksonian LW + Liberal Reps)   |
| `WallStreet`        | Center | finance — both parties courted; ambiguous; flagged as #6         |
| `Planters`          | RW     | slave-power core; traditional                                    |
| `Nativists`         | RW     | Know-Nothing right                                                |
| `MilitaryIndustrial`| RW     | hawkish bloc; flagged as #6                                      |
| `LawAndOrder`       | RW     | conservative law-enforcement cluster                              |

Ambiguous (cross-bucket cases): `WallStreet`, `FreeTrade`, and
`MilitaryIndustrial` are the trickiest assignments and are flagged in the
assumptions. Architect may flip them post-playtest; the const is the only
edit needed.

#### `ALIGNMENT_RULES.ideologyCardBucket` (binding, exhaustive)

| IdeologyCardId       | Bucket | Rationale (one line)                                           |
|----------------------|--------|----------------------------------------------------------------|
| `Independence`       | LW     | revolutionary populism                                         |
| `Republicanism`      | LW     | small-r republican / Jeffersonian                              |
| `Reformism`          | LW     | reform impulse                                                 |
| `Populism`           | LW     | Jacksonian left-populism                                       |
| `Antimonopoly`       | LW     | Loco-Foco anti-bank                                            |
| `Antislavery`        | LW     | clear LW alignment in 1856 context                             |
| `Abolition`          | LW     | radical-republican core                                        |
| `CivilRights`        | LW     | Reconstruction-era                                              |
| `FreeSoil`           | LW     | free-soil republican identity                                   |
| `Whiggery`           | Center | Whig-coalition centrism                                         |
| `Compromise`         | Center | unionist compromise                                             |
| `Federalism`         | Center | strong-center moderates                                         |
| `StrongCenter`       | Center | identical to Federalism but distinct id                         |
| `GradualEmancipation`| Center | moderate emancipationist                                        |
| `Manifestdestiny`    | Center | cross-aligned expansionist                                      |
| `Industry`           | Center | industrial-moderate                                             |
| `FreeTrade`          | Center | dual-use; matches interest bucket                               |
| `Tradition`          | RW     | traditionalist                                                  |
| `StatesRights`       | RW     | strong RW marker in both eras                                   |
| `SlaveryRights`      | RW     | RW core in 1856                                                 |
| `Nativism`           | RW     | nativist RW                                                     |
| `Protestantism`      | RW     | Know-Nothing religious-nativism                                 |

### Game-start "no history yet" behavior (binding)
On the first 2.1.8 tick after scenario start, `game.alignmentStability` is
empty. The drift logic treats this correctly: any interest/lobby score already
`<= -4` or `>= +4` at tick time **starts its clock THIS turn** (writes a
`firstSeenYear: game.year` entry). Therefore **the earliest a card can drop or
be added is K = 2 turns later**, never the first turn. The personality
stability key is also empty on the first tick: the bucket compared against
`f.personality` (which has a seed value from the scenario data) determines
the first emitted `personality-shift` if the corrected `factionCenter` differs.
This is acceptable and documented — the first 2.1.8 tick will commonly emit
1-2 personality shifts (the bug fix) and zero card events.

### Save migration (binding)
- New `GameState.factionAlignmentDrift` / `alignmentStability` are optional;
  legacy saves load. **No `repair()` changes.**
- The Faction string[] → union[] migration is **type-only**; legacy save data
  for `ideologyCards` / `lobbyCards` / `interestCards` already contains valid
  ids (the Layer 1 audit confirms every seed value is in the unions).
  Architect should add a one-shot **defensive filter** on load (`f.interestCards
  = f.interestCards.filter((c): c is InterestCardId => ALIGNMENT_RULES
  .interestCardBucket[c] != null)` and the analogous for lobby/ideology) to
  strip any ids future modders introduce that aren't in the unions —
  prevents engine crashes on unknown ids. Lightweight; ships with the
  feature.

## Acceptance criteria

### State & types (src/types.ts)
- [ ] 1. New union types: `InterestCardId`, `LobbyCardId`, `IdeologyCardId`,
  exactly as enumerated in Layer 1.
- [ ] 2. `Faction.ideologyCards: IdeologyCardId[]`,
  `Faction.lobbyCards: LobbyCardId[]`, `Faction.interestCards: InterestCardId[]`
  (replacing the three `string[]`).
- [ ] 3. `GameState` gains `factionAlignmentDrift?: FactionAlignmentDriftEntry[]`
  and `alignmentStability?: Record<string, { firstSeenYear: number }>` after
  `kingmakers`.
- [ ] 4. `FactionAlignmentDriftEntry` interface exactly as shaped above.
- [ ] 5. New `ALIGNMENT_RULES` const + `ALIGNMENT_DRIFT_CAP = 200` after
  `KINGMAKER_RULES`. Contains: `dropThreshold: -4`, `addThreshold: 4`,
  `stableTurns: 2`, `cardBiasPerDelta: 0.03`, `electionBiasPerScore: 0.5`,
  `electionBiasCap: 3`, `personalityBuckets: { lwMax: 2.5, rwMin: 4.5 }`,
  `cardCapPerType: 4`, the full `lobbyToInterest` map, the full
  `ideologyCardBucket` map, the full `interestCardBucket` map. Zero hardcoded
  numbers in page JSX or the drift runner.

### Engine helpers (src/engine/phaseRunners.ts)
- [ ] 6. `cardVoteBias(snap, factionId, impacts): number` — exported, pure,
  exactly the formula in Layer 2; returns 0 on null/missing inputs.
- [ ] 7. `electionFactionBias(snap, factionId): number` — exported, pure,
  exactly the formula in Layer 2; capped ±3 by `electionBiasCap`; returns 0
  on null/missing inputs.
- [ ] 8. A small `recordAlignmentDrift(snap, entry)` helper analogous to
  `recordIdeologyShift` / `recordKingmaker`, FIFO-capped at 200.

### Vote bias application (every site identified by the architect that has
interest-group impacts gets `cardVoteBias` applied; election outcomes get
`electionFactionBias`)
- [ ] 9. 2.6.2 Committee (phaseRunners.ts:1891-1921): the chair's `passChance`
  is `clamp(passChance + cardVoteBias(snap, chair.factionId,
  bill.effects.interestGroups), 0, 1)` BEFORE `chance()`. Existing
  same-party 0.85 / cross 0.25 unchanged.
- [ ] 10. 2.6.3 Floor House + Senate (phaseRunners.ts:1953-1967): inside
  `tally()`, the per-member `p` becomes `clamp(p + cardVoteBias(snap,
  m.factionId, bill.effects.interestGroups), 0, 1)` BEFORE `chance(p)`.
  Existing partisan / faction / ideology-distance terms unchanged.
- [ ] 11. `voteCC` (continentalCongress.ts:161-188): per delegate, `p =
  clamp(p + cardVoteBias(snap, dpol.factionId, bill.effects.interestGroups),
  0, 1)` BEFORE `chance(p)`. Existing same-faction 0.92 / same-party 0.6 /
  cross 0.2 unchanged. **Architect must add a `cardVoteBias` import from
  `./phaseRunners` to `continentalCongress.ts` — confirmed acceptable cross-
  file engine import.**
- [ ] 12. **NOT** applied at: Constitutional Convention article votes (no
  impact list), 2.2.1 Speaker / Pro Tem (PV pick), Cabinet appointments
  (PV pick, no vote pipeline), 2.9.1 Primary winner (PV pick, no per-voter
  tally). Documented exclusion in code comments.
- [ ] 13. `calcStateVote` (phaseRunners.ts:2087-2095): `score = 50 +
  baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 +
  electionFactionBias(snap, c.factionId) + (Math.random()-0.5)*8`.
  Applied to every 2.9.4 / 2.9.5 / 2.9.6 election by transitivity. The
  `Math.random` call is **left as-is** (it's in the existing function — out
  of scope to convert to `rng.ts`; flagged as a pre-existing concern).
- [ ] 14. Draft AI `pickBestForFaction` (phaseRunners.ts:23-43) is **NOT**
  modified — drafts aren't voting; personality already nudges this AI.
  Explicitly out of scope.

### Drift runner (src/engine/phaseRunners.ts — replace 1372-1381 wholesale)
- [ ] 15. `runPhase_2_1_8_FactionAlignmentDrift(snap)` runs steps 1-5 exactly,
  in order. Eager `snap.game.factionAlignmentDrift ??= []` and
  `snap.game.alignmentStability ??= {}` on entry.
- [ ] 16. Step 1: personality refresh via `factionCenter` (living-only mean —
  **fixes the dead-counting bug**); bucketed via `ALIGNMENT_RULES
  .personalityBuckets`; emits `'personality-shift'` with
  `fromPersonality` + `toPersonality` only when the bucket changes; skips
  factions where `factionCenter` returns null.
- [ ] 17. Step 2a: ideology-card swap, K = 2 stable turns, bucket-driven
  per `ideologyCardBucket`; one swap per faction per tick; emits
  `'card-swapped'` with `cardType: 'ideology'`, `reason: 'realigned'`.
- [ ] 18. Step 2b: interest-card DROP (`score <= -4` for K turns →
  `'card-dropped'` / `'crashed'`) then ADD (`score >= +4` for K turns +
  bucket fit; soft cap 4; one per tick → `'card-added'` / `'emerging'`).
- [ ] 19. Step 2c: lobby-card DROP / ADD using `lobbyToInterest` proxy
  score; soft cap 4; namespaced stability keys (`f.id|lobby:c` vs
  `f.id|interest:c`); one ADD per tick.
- [ ] 20. Step 3: every event records via `recordAlignmentDrift` (FIFO 200).
- [ ] 21. Step 4: one `refreshPv(snap.politicians)` call at tick end.
- [ ] 22. Step 5: ≤1 conditional summary log only when events > 0.
- [ ] 23. First-tick behavior: empty `alignmentStability` → any qualifying
  score starts its clock on this tick (writes `firstSeenYear: game.year`); no
  card events fire until K turns later. Personality refresh may emit
  bucket-correction shifts on tick 1 (bug fix).
- [ ] 24. Composition-change K modifier (Layer 3 step 2d): **NOT
  implemented in v1**; K is a flat 2.

### Engine / phase wiring (no changes beyond the runner replacement)
- [ ] 25. `engine.ts`, `phases.ts`: **no changes**. 2.1.8 already dispatches;
  it has no `shouldRunPhase` gate (runs every turn); not in the first-turn
  skip list (runs the 1772 first turn → bug fix lands immediately).
- [ ] 26. `pv.ts`: **no changes**.

### Page + nav (NEW page)
- [ ] 27. New page id `'factionAlignments'` registered in
  `src/pages/registry.ts`; new sidebar entry **between** `'kingmakers'` and
  `'draft'` in `src/components/Sidebar.tsx` (Your Faction section), label
  "Faction Alignments". **NO** auto-nav effect in `src/App.tsx` (the page is
  informational and not phase-locked). No new ref.
- [ ] 28. Page is read-only: no buttons, no `GameContext` methods, no
  mutations. Sections rendered in this order:

  **Section A — Faction roster.** One row per faction (player first,
  "(you)" suffix); columns: name, party badge, personality (hover shows
  precise `factionCenter` value with two decimals, e.g. "3.42"); current
  cards as small colored badges (interest / lobby / ideology each in a
  different chip color); tension indicators: YELLOW chip border on cards
  whose score (proxy-resolved for lobby) is `<= -3` (one step from
  DROP_THRESHOLD), GREEN chip border on emerging interest groups that fit
  the faction's bucket and score `>= +3`; expandable per-row drift section
  showing the last 8 entries for that faction (year + kind + cardId where
  applicable).

  **Section B — Global drift feed.** `(game.factionAlignmentDrift ?? [])
  .slice(-30).reverse()`: year, faction name, kind badge (Personality /
  Added / Dropped / Swapped), cardType chip, cardId text, reason sub-badge
  (Crashed / Emerging / Realigned), fromCardId/toPersonality where present.
  Empty: "No alignment drift yet."

  **Section C — Values Reference Library** (the educational layer; pure
  derivation over existing data; **zero new game state**):

  - **Legend** `<details>` at the top of Section C rendered entirely from
    `ALIGNMENT_RULES` (zero literals in JSX): the -4/+4/K=2 thresholds, the
    0.03-per-delta vote bias, the 0.5-per-score / cap-3 election bias, the
    personality buckets, the soft cap 4.
  - **C1 — Interest Cards.** One row per `InterestCardId`: name; global
    score (live `game.interestGroups[id]`, bar-chart same style as
    InterestGroupsPage); "Fits ideology" chip (the card's bucket from
    `interestCardBucket`); "Strengthened by" — top 3 BILL_TEMPLATES + 1856
    era events where the card is in `effect.interestGroups` with `delta >
    0`, sorted by delta desc; "Weakened by" — top 3 with `delta < 0`;
    "Currently held by" — clickable list of faction names that have this
    id in their `interestCards`; "Vote bonus when held" — explanatory chip
    derived from `ALIGNMENT_RULES.cardBiasPerDelta` (e.g. "+0.03 × bill
    delta per vote").
  - **C2 — Lobby Cards.** Same shape as C1 but via `lobbyToInterest` proxy
    (score = `interestGroups[proxy]`, bills resolved by proxy id).
  - **C3 — Ideology Cards.** Less rich: name; "Belongs to bucket" (from
    `ideologyCardBucket`); "Currently held by" — clickable faction names.
    No bill scoring (ideology cards don't bias votes in v1).
- [ ] 29. Cross-linking: top-of-page header links to **Ideology Shifts**
  (`/ideology`), **Faction Conversions** (`/conversions`), **Legislation**
  (`/legislation`), **Dashboard** (`/dashboard`), **Interest Groups**
  (`/interestGroups`). One line of cross-links. Use the
  `NavigationProvider` `navigateTo` API (already used by other pages).

### Definition of done (per CLAUDE.md)
- [ ] 30. `npm run build` passes.
- [ ] 31. Playtested in **1856**: reach 2.1.8 → no auto-nav; open Faction
  Alignments manually; Section A renders 10 factions with their seed cards
  as badges. Run a `Fugitive Slave Act Strengthening` to completion
  (Planters +3, Abolitionists -3); confirm at the next 2.6.3 Floor vote the
  `cardVoteBias` for Conservative Democrats (Planters interestCards) makes
  their House delegation more likely to vote Aye on Planter-friendly bills
  (compare yea counts to a baseline run). Drive Abolitionists score to
  `>= +4` via 2-3 Personal Liberty Laws; on the 2.1.8 tick TWO turns later,
  observe an `'emerging'` `'card-added'` event for a fitting LW-bucket
  faction. Drive Planters to `<= -4` for 2 turns; observe `'crashed'`
  `'card-dropped'`. Run a presidential election and verify a candidate
  whose faction holds high-positive interest cards gets a small EV/state
  bias compared with a candidate whose factional cards score negative
  (eyeball the per-state pcts in `ElectionsPage`). Reload mid-game (cards +
  feed intact). **1772 smoke:** turn-1 2.1.8 runs without crash; first-tick
  emits at most 1-2 personality-shift entries (bug-fix corrections from the
  dead-counting bucket); `voteCC` per-delegate `p` clamps correctly with
  the bias; Section C C1 renders the 15 interest cards with their seed
  scores (mostly 0).

## Edge cases
- **Empty faction (factionless after death/retire/defect cascade).**
  `factionCenter` returns null → Step 1 skips that faction (personality
  unchanged), Step 2 skips entirely. No feed entries. Documented.
- **Faction at the soft cap (4 interest cards) when a new emerging card
  qualifies.** Drop pass runs FIRST in 2b, so a faction churning under
  pressure can shed a crashed card and then gain an emerging one in the
  same tick. If still at 4 after the drop pass, the add is skipped this
  tick — the candidate's clock continues ticking; it'll be added the
  moment a slot opens.
- **Card simultaneously held by interestCards AND as a lobbyCard proxy
  target.** Both contribute to `electionFactionBias` (additive — a faction
  that holds Planters as both an interest card AND via a Planters lobby
  card sums the score twice). This is intentional (deeper investment =
  bigger payoff); flagged as assumption #7.
- **Bill with no `interestGroups` impacts** (e.g. CC `Address to the
  Crown`). `cardVoteBias` returns 0; vote scoring identical to today.
- **Bill with a single impact targeting a card NONE of the voters' factions
  hold.** Bias is 0 for every voter; no behavioral change.
- **Personality bucket boundary jitter** (a faction whose center oscillates
  around 2.5). Today's `factionCenter` rounds half-up so the int center
  jumps cleanly; the LW threshold is `< 2.5` evaluated on the rounded int,
  so boundary jitter only fires bucket-change events when the int crosses
  (e.g. 2 → 3 = LW → Center, single feed entry). Documented.
- **Score exactly at threshold** (`score === -4`). The condition is
  `<= -4`, so `-4` qualifies the DROP clock; `>= +4` qualifies the ADD
  clock. Single source for both engine and legend.
- **Ideology card in TWO buckets via dual-use ids** (`FreeTrade`,
  `CivilRights`). The `ideologyCardBucket` map gives each exactly one
  bucket (FreeTrade → Center, CivilRights → LW); the interestCardBucket
  gives each its own (FreeTrade → Center, CivilRights → LW). Same answer
  in both namespaces — consistent. Documented.
- **Faction holds ZERO interest cards** (Patriot Conservatives 1772
  example: 1 interestCard `Planters`, not zero — but a theoretical empty
  list). `electionFactionBias` = 0 from interest term; lobby term still
  contributes. No engine error. Documented.
- **`alignmentStability` grows unboundedly?** No — entries are deleted the
  moment the qualifying condition lapses (drop pass deletes on
  `score > -4`, add pass deletes on `score < +4` or already-held). Worst
  case: 10 factions × 15 interest ids × 2 (interest/lobby) = 300 entries
  at peak — negligible. No FIFO cap needed.
- **Constitutional Convention article votes don't bias.** Documented
  out-of-scope; the convention's `preferredOption` keeps its existing
  ideology/party heuristic untouched. Cards do not affect the constitution.
- **Speaker / Pro Tem and Cabinet aren't biased.** PV-pick mechanics
  unchanged; high-PV cabinet appointments still ignore card alignment.
  Documented; potentially a v2 extension if playtest wants it.
- **A card is in BOTH the union AND removed by the defensive load filter**
  due to a typo. The legacy save loses that card silently — acceptable;
  the audit confirms no seed data triggers this.
- **A lobby card's proxy interest group is NOT in `INTEREST_GROUPS`.**
  Cannot happen — every proxy in `LOBBY_TO_INTEREST` is in
  `INTEREST_GROUPS` (audit confirmed); `game.interestGroups[proxy] ?? 0`
  defends regardless.
- **`game.interestGroups[id]` clamped -10..+10 by `applyEffect`** — the
  drift thresholds (-4 / +4) are well inside the clamp; no degenerate
  always-true-forever scoring.

## Out of scope
- **NO new card types** (no "movement cards", "scandal cards", etc.) — the
  three existing arrays are the universe.
- **NO card trading, pinning, buying** — no player action whatsoever.
- **NO new resources** (no "alignment points", no "card budget").
- **NO auto-nav** — the page is informational and reachable any time.
- **NO `GameContext` methods** — read-only page; nothing to mutate from UI.
- **NO rebalance of existing vote weights** — `cardVoteBias` is purely
  additive; same-faction 0.92 / same-party 0.6 / cross 0.2 / ideology dist
  -0.05/step unchanged.
- **NO `IdeologyCard` vote bias in v1** — ideology cards are identity
  badges only; tracked by drift, displayed on the page, but do not flow
  into `cardVoteBias`. (v2 candidate.)
- **NO recruitment / draft-fit bonuses** — `pickBestForFaction` is
  explicitly untouched.
- **NO new interest groups invented** — the union is closed to what the
  data already references.
- **NO Constitutional Convention card biasing** — articles don't carry
  impact lists; v1 leaves the heuristic alone.
- **NO Speaker / Pro Tem / Cabinet / Court appointment biasing** — PV-pick
  shapes don't have a voter-tally to bias.
- **NO `InterestGroupsPage` / `LegislationPage` / `FactionsPage` rewrites
  beyond ONE cross-link header** in each of those pages back to Faction
  Alignments (matching the cross-link pattern other 2.1.x pages use).
- **NO new PV terms or fields** — `refreshPv` is called defensively; no
  PV inputs change today.
- **NO composition-change K modifier** in v1 — flat K = 2 everywhere.
- **NO scenario-data changes** — `game.interestGroups` keeps its existing
  seed values; no new entries needed (the audit confirms every 1772 card
  id already resolves through `INTEREST_GROUPS` or the lobby proxy).
- **NO `repair()` changes** — all new state is optional; defensive load
  filter is the only migration code.
- **`Math.random` in `calcStateVote` is NOT converted to `rng.ts`** —
  pre-existing concern outside this feature's scope.

## Open questions / assumptions

**Riskiest first — the cross-system blast radius is the singular concern.**

1. **Cross-system blast radius (THE risk; lead).** This feature touches the
   2.6.2 committee, 2.6.3 House + Senate, `voteCC`, AND `calcStateVote`
   (which fans out to 2.9.4 / 2.9.5 / 2.9.6) in one ship — by site count
   the largest single feature in the entire 2.1.x arc, by a wide margin
   (relocations/ideology/conversions/kingmakers each touched 0-2 voting
   sites). Any miscalibration of `cardBiasPerDelta` (0.03) or
   `electionBiasPerScore` (0.5) or the bucket maps cascades through every
   vote and every election simultaneously. **Mitigations baked into the
   spec:** (a) bias is purely additive — turning `cardBiasPerDelta` to 0
   reverts every site to today's behavior in one const edit; (b) the
   election bias is capped at ±3 score points (translates to ~±3 pp), so
   even at max card alignment the partisan / state-bias / PV terms
   dominate; (c) every site has an explicit clamp `[0, 1]` on the gated
   `p` so a wildly over-tuned bias cannot break the `chance` invariant;
   (d) all values live in `ALIGNMENT_RULES` — tuning is a single-file
   edit. **The architect must enumerate every site in the brief and the
   reviewer must verify the criteria 9-13 against the live runner before
   merge** — the spec's voting-site enumeration is binding, not advisory.
2. **`cardBiasPerDelta = 0.03`** (binding). The vision's `0.3`
   recommendation is in per-impact units and compounds to ~1.5 on a
   3-impact bill — clearly over the partisan term. `0.03` per delta lands
   the intended ~0.15 magnitude on a typical aligned bill. If playtest
   wants more clout, tune to 0.05; less, 0.02. Single const.
3. **`electionBiasPerScore = 0.5` and `electionBiasCap = 3`** (binding).
   The vision's `0.1 pp per score point, cap ±3 pp` reads
   percentage-points-of-vote-share. `calcStateVote` returns shares from
   raw scores around 30-70; +3 raw score in a 2-way race ≈ +3 pp of
   share. Tuning a per-score factor of 0.5 + cap 3 lands the vision's
   intent. Architect may want to recompute against a wider score
   distribution post-playtest.
4. **`dropThreshold = -4` / `addThreshold = +4` / `K = 2`** (binding —
   vision-recommended values committed). `±4` of a `-10..+10` clamp is
   the 40% bound — strong but achievable through 2-3 bills with `delta`
   3-4. K = 2 turns = 4 in-game years — the player has a turn of warning
   before a card crashes (the YELLOW tension indicator on the page),
   which is the right feel. Composition-change K modifier deferred.
5. **`ideologyCardBucket` mapping ambiguities.** `Manifestdestiny`,
   `Whiggery`, `Industry`, `GradualEmancipation`, and `FreeTrade` are
   center-bucket choices that could be argued LW or RW (`Manifestdestiny`
   was a Democratic banner → arguably LW-Center in 1856 partisan terms;
   `Whiggery` is genuinely cross-class). The spec commits to Center for
   all five for now — Center is the safe pivot bucket; flag for playtest.
6. **`interestCardBucket` ambiguities.** `WallStreet`, `FreeTrade`,
   `MilitaryIndustrial` are the genuine cross-bucket cases. Center for the
   first two (finance and trade were cross-party 19c), RW for
   MilitaryIndustrial (hawkish bloc) — but the architect should validate
   with one playtest run; these are the most likely future-tune targets.
7. **Card-stacking in `electionFactionBias`** (interest + lobby same proxy
   both count). Documented as intentional. If a faction holds Planters as
   interest AND has SlavePower lobby (proxies to Planters), it gets +2 ×
   Planters score in bias terms. Could be capped per id; deferred.
8. **`Math.random()` in `calcStateVote`** is left untouched. The drift
   runner uses `rng.ts` (deterministic); the election scoring already
   uses `Math.random` for the ±4 jitter. Pre-existing; converting is out
   of scope but flagged for a future cleanup.
9. **Personality field stays.** The draft AI at line 36 reads it; UI
   labels at 2-3 sites read it. Removing the field is a bigger churn for
   no gain. Decision: keep, set from `factionCenter` at top of tick.
10. **Personality bucket thresholds** (`< 2.5` / `>= 4.5`). The current
    runner uses `< 2.5` and `> 4.5` (strict on both ends, with `>= 4.5`
    falling into Center). The vision says `>= 4.5 → RW` — the new
    threshold for RW. This is a **1-bucket behavior change** from
    today's runner (a faction at exactly center 4.5 was Center; under the
    spec, becomes RW). Acceptable correction; documented; flagged.
11. **Constitutional Convention exclusion** is permanent in v1. If
    playtest wants article votes to be influenced by faction alignment,
    that's a 2.1.8-v2 design problem (articles need impact lists in the
    Convention data first — not a small change).
12. **Speaker / Pro Tem exclusion.** PV-pick has no `chance(p)` shape; the
    only way to add card bias is to convert the pick to a weighted score
    (`pv + cardVoteBias-style term`). Deferred to v2; the vision
    explicitly conditioned this on "same vote-score shape as bill voting"
    — it isn't, so it's out.
13. **The drift's interest-card ADD candidate pool** is the full union
    (15 ids). A 1772 game with no Civil-Rights-era impact bills can still
    in principle ADD `CivilRights` if its score climbs ≥+4 — but the
    score literally never moves (no bill or event in the 1772 dataset
    targets it), so it stays at 0 and the candidacy never triggers. This
    is the right behavior (the union is open; the data is what makes it
    relevant in each era). Documented.
14. **The defensive type-filter on Faction-card load** is the only
    migration code. Architect: add to `GameContext.tsx` snapshot
    normalization on `setSnapshot` (the existing patch site).
15. **`alignmentStability` keys use a string convention, not nested
    records.** Architect's choice — flat Record is simpler to inspect in
    saves; the cost is the string parse on no path that needs it (the
    drift runner stores and clears by full key). If nested
    `Record<factionId, Record<scope, Record<cardId, ...>>>` is
    preferred, that's structurally equivalent. Flag.
