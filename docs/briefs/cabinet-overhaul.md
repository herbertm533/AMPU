# Brief: Cabinet overhaul — era-conditional, expertise-aware (PR5)

## CP2 USER REVISION — Admiral rename DROPPED (binding override)

User at CP2 explicitly chose **"Skip the Commodore rename"** over the
architect's recommendation. The architect's Edit E-5 (rename war-state
field + UI label + delete `currentOffice = { type: 'Admiral' }` at
revolutionaryWar.ts:60) is **OVERRIDDEN**. Builder applies the brief as
written BELOW EXCEPT for these specific deltas:

1. **`OfficeType` union: KEEP `Admiral`.** Drop only `KeyAdvisor`. The
   `Admiral` member stays to preserve the war-state combat-role
   assignment at `revolutionaryWar.ts:60`. This means the spec's
   F-ADMIRAL-ANACHRONISTIC is honored only at the *cabinet-seat* level
   (it leaves CABINET_SEATS_BY_YEAR, OFFICE_EXPERTISE, OFFICE_ADMIN_GRANT,
   CabinetPage POSITIONS, runPhase_2_3_2_Military Admiral block). It
   stays in the type union for typed war-state references.

2. **`OFFICE_EXPERTISE`: DROP the Admiral row.** (Architect already
   specified this — same.)

3. **`OFFICE_ADMIN_GRANT`: DROP the Admiral row.** (Same.)

4. **`runPhase_2_3_2_Military`: DROP the Admiral block** as architect
   specced (lines 2165-2181). No more auto-cabinet-style Admiral
   appointment. (Same.)

5. **`CabinetPage.tsx`: REMOVE `Admiral`** from POSITIONS. (Same.)

6. **`revolutionaryWar.ts`: NO CHANGES.** Edit E-5 is fully skipped.
   Keep `seniorAdmiralId` field name, `admiralIds[]` field name, all
   "Admiral" log strings, and the `currentOffice = { type: 'Admiral' }`
   assignment at line 60. The type system stays consistent because
   `Admiral` remains in `OfficeType`.

7. **`RevWarDashboard.tsx`: NO CHANGES.** Keep "Senior Admiral" label.

8. **`src/types.ts` RevolutionaryWar field rename: SKIP.** Keep
   `seniorAdmiralId` and `admiralIds[]` field names on the
   `RevolutionaryWar` type (around `:1094-1095`).

9. **Save migration: REDUCED.** Scrub only `cabinet.KeyAdvisor` from
   the cabinet field (drop the `cabinet.Admiral` scrub — Admiral is
   no longer a cabinet seat in code, but old saves may have written
   it; cleanest is still to scrub from `cabinet.*` since the cabinet
   field is `Partial<Record<OfficeType, …>>` and Admiral is no longer
   a valid cabinet entry). Scrub `currentOffice.type = 'KeyAdvisor'`
   on politicians. **Do NOT** scrub `currentOffice.type = 'Admiral'`
   — those are legitimate war-state assignments and must persist.
   Do NOT extend save migration to rename `seniorAdmiralId` →
   `seniorCommodoreId` (no rename happening).

10. **`politicians1856.ts`: VERIFY, don't change.** The seed file's
    `Seed.office` type union should keep `'Admiral'` since Admiral
    stays in `OfficeType`. Only swap `'KeyAdvisor'` out, add
    `'SecretaryOfNavy'` and `'SecretaryOfInterior'`.

**File-count delta after this revision: 9 modified, 0 new** (was 11):
no longer modifying `src/engine/revolutionaryWar.ts` or
`src/pages/RevWarDashboard.tsx`.

**Justification for the user override:** The Commodore rename is a
linguistic refinement to combat-code that the cabinet-overhaul scope
doesn't require. Save-persisted field renames are footgun-prone; PR5
already has a large surface area (cabinet seat changes, scoring formula,
cross-party RNG, era-conditional position list). Tightening to "cabinet
loop only" keeps the PR focused and the merge clean.

Below is the architect's original brief — apply as written **except**
for items 1-10 above.

---

## Approach

PR5 is a **types + engine + scenario-data + UI rewrite** of the cabinet
loop. We perform `OfficeType` union surgery (drop `KeyAdvisor` + `Admiral`;
add `SecretaryOfNavy` + `SecretaryOfInterior`), introduce one new pure
helper `cabinetSeatsForYear(year)` that returns the era-correct seat list
(4 transitions: 1789 / 1798 / 1829 / 1849), and replace the hardcoded
6-seat pure-admin sort in `runPhase_2_3_1_Cabinet` with a per-seat
composite scoring helper `scoreCabinetCandidate(seat, politician)` driven
by a new `CABINET_SEAT_SCORING` table. We extend the existing
`OFFICE_EXPERTISE` / `OFFICE_ADMIN_GRANT` / `OFFICE_PRESTIGE` /
`officeWeights` tables to cover the 2 new seats and remove the 2 dropped
ones. We add a **deterministic-but-randomized cross-party gate**
(`CABINET_CROSS_PARTY_RATE = 0.1`, `CABINET_CROSS_PARTY_PENALTY = -3`)
that fires once per cabinet-cycle per seat against the engine's seeded
RNG (`rng.chance` + `rng.pick`). We layer a per-seat `+0.2` meter bonus
in `runPhase_2_5_1_Lingering`, conditional on the seated Sec carrying the
seat's primary expertise. We drop the Admiral block from
`runPhase_2_3_2_Military` entirely. We **rename the Revolutionary War
"Senior Admiral" role to "Commodore"** because that ref is a combat-rank
use, not a cabinet seat — Admiral pre-1862 was anachronistic at any
echelon per the historian (F-ADMIRAL-ANACHRONISTIC, "MOST BINDING"). The
1772 scenario opens with `cabinet: {}` (Section H rewrite); 1856 seeds
all 7 Buchanan-era slots. Save migration runs in `repair()` and scrubs
both `cabinet.KeyAdvisor` + `cabinet.Admiral` AND any politician's
`currentOffice.type` matching either. UI: `CabinetPage.tsx` POSITIONS
array swaps `KeyAdvisor`/`Admiral` for `SecretaryOfNavy`/
`SecretaryOfInterior`. RevWarDashboard.tsx updates one label.

**Locked CP1 decisions carried in (do not relitigate).** The 4 CP1
questions resolved at human checkpoint:

- **Q1 (cabinet effects):** Conditional `+0.2` per expertise-matched
  seat in 2.5.1 Lingering (spec option c).
- **Q2 (composite scoring):** Per-seat formula with AG override (spec
  option b+d). Exact numeric weights resolved by architect below.
- **Q4 (cross-party — USER OVERRIDE):** PR5 ships **(b) probabilistic
  cross-party** — 10% chance per seat to relax the same-party filter,
  with a `-3` composite-score penalty applied to cross-party candidates.
  PM rec was (a) same-party only; user explicitly overrode at CP1.
- **Q8 (Interior expertise — USER OVERRIDE):** Interior primary
  expertise is **`Agriculture`**, not Welfare. PM rec was Welfare; user
  explicitly overrode to the "land-and-settler agenda" reading
  (historian's brief endorsed both as defensible). This flows through
  to `OFFICE_EXPERTISE` AND the Section I `+0.2 quality` meter bonus.

**Alternative rejected — Lingering Phase per-seat unconditional bonus
(spec option a).** Considered; rejected for the playtest-goal reason in
the spec (a generalist cabinet would auto-earn meter swings unrelated to
quality). Sticking with conditional-only matches the spec's locked
position and the user's "cabinet quality reads in governance" UX goal.

**Alternative rejected — collapsing `cabinetSeatsForYear` + `scoreCabinet
Candidate` into the existing tables**. We considered inlining the seat-
list into `runPhase_2_3_1_Cabinet` as a switch ladder on
`snap.game.year`, and the scoring as inline conditionals. Rejected because
(a) the table-driven shape mirrors PR4a's `TRAIT_ELECTION_EFFECTS` and
PR3's `TRAIT_CONFLICTS` precedent — author once, read everywhere; (b) the
4 transitions are unit-testable as a pure function; (c) the AG override
(`admin=0, judicial=2`) is a table-row anomaly that screams for data, not
inline code.

**Alternative rejected — keeping `Admiral` gated to year >= 1862.** Spec
Q3 PM rec is (a) drop entirely; user did not override. Future PR can
re-add cleanly when a 1862+ scenario lands.

**Alternative rejected — renaming Rev War "Senior Admiral" → "Senior
Commodore".** Considered as architect call — see "Tuning call #7" below.
**Adopted**: rename the war-state field `seniorAdmiralId` to
`seniorCommodoreId`, the UI label to "Senior Commodore", and the
`currentOffice = { type: 'Admiral' }` assignment at `revolutionaryWar.
ts:60` is removed entirely (the politician serves as senior naval
commander without a formal `currentOffice` slot — same as the
`generalIds[]` and `admiralIds[]` filling-personnel arrays that already
do not carry `currentOffice`). This is the historian-correct path:
"Commodore" was the era-correct naval-command term in the 1772 window
(John Paul Jones held captain rank with commodore courtesy).

## State & type changes

### `src/types.ts` — OfficeType union surgery + 7 supporting tables

**(A) `OfficeType` union edits** at `types.ts:918-940`. Drop two,
add two. Place new members per historical 1849 ordering:

```ts
export type OfficeType =
  | 'President'
  | 'VicePresident'
  | 'SecretaryOfState'
  | 'SecretaryOfTreasury'
  | 'SecretaryOfWar'
  | 'SecretaryOfNavy'           // NEW (after War, matches 1798 historical add)
  | 'AttorneyGeneral'
  | 'SecretaryOfInterior'       // NEW (after AG, matches 1849 historical add)
  | 'PostmasterGeneral'
  // REMOVED: 'KeyAdvisor'      (no historical analog before 20th-century WH Chief of Staff)
  | 'GeneralInChief'
  // REMOVED: 'Admiral'         (rank didn't exist in US Navy until 1862-07-16)
  | 'ChiefJustice'
  | 'AssociateJustice'
  | 'Senator'
  | 'Representative'
  | 'Governor'
  | 'SpeakerOfHouse'
  | 'SenateProTem'
  | 'CommitteeChair'
  | 'FactionLeader'
  | 'PartyLeader'
  | 'CCPresident'
  | 'Ambassador';
```

The `as const satisfies` exhaustiveness on consumer tables (`OFFICE_
PRESTIGE`, `officeWeights`, `OFFICE_ADMIN_GRANT`, `OFFICE_EXPERTISE`,
`CABINET_SEAT_SCORING`) cascades any miss at compile time.

**(B) `OFFICE_EXPERTISE` revision** at `types.ts:944-951`. Drop
Admiral; add Navy + Interior + PMG (PMG was absent). User override on
Interior = `Agriculture`:

```ts
export const OFFICE_EXPERTISE: Partial<Record<OfficeType, Expertise>> = {
  SecretaryOfState: 'Foreign Affairs',
  SecretaryOfTreasury: 'Economics',
  SecretaryOfWar: 'Military',
  SecretaryOfNavy: 'Naval',             // NEW
  AttorneyGeneral: 'Justice',
  SecretaryOfInterior: 'Agriculture',   // NEW — USER OVERRIDE (was Welfare in PM rec)
  PostmasterGeneral: 'Transportation',  // NEW — was absent
  GeneralInChief: 'Military',
  // REMOVED: Admiral: 'Naval',
};
```

**(C) `OFFICE_COMMAND_GRANT` update** at `types.ts:507-509`. No
expansion. SoS=1 remains the only entry; Navy is deliberately NOT given
a command grant (PM call — naval-command is uniformed territory deferred
to a future Commodore-slot PR). Update the comment to drop the stale
"KeyAdvisor deliberately absent" reference:

```ts
// Office -> command grant on initial appointment. Only Secretary of State
// today (reference's "initial appointment to Secretary of State" Command earn).
// Navy + Interior + PMG deliberately absent — administrative seats.
export const OFFICE_COMMAND_GRANT: Partial<Record<OfficeType, number>> = {
  SecretaryOfState: 1,
};
```

**(D) `OFFICE_ADMIN_GRANT` update** at `types.ts:514-521`. Drop
KeyAdvisor; add Navy + Interior:

```ts
export const OFFICE_ADMIN_GRANT: Partial<Record<OfficeType, number>> = {
  SecretaryOfState: 1,
  SecretaryOfTreasury: 1,
  SecretaryOfWar: 1,
  SecretaryOfNavy: 1,           // NEW
  AttorneyGeneral: 1,
  SecretaryOfInterior: 1,       // NEW
  PostmasterGeneral: 1,
  // REMOVED: KeyAdvisor: 1,
};
```

The `ABILITY_EARN_RULES.cabinetConfirmAdmin` ladder (`types.ts:494-498`)
is unchanged — base=1, eggheadMult=2, efficientMult=2 — and applies
uniformly across all 7 new seats including the AG (per spec AC #15
explicit: AG keeps its grant despite the low-admin scoring formula).

**(E) New `CABINET_SEATS_BY_YEAR` helper** added to `src/types.ts`
immediately after `OFFICE_EXPERTISE` at `:951`. Pure function, no
snapshot read, no RNG dependency. Returns the era-correct seat list per
F-FOUR-TRANSITIONS (1789 / 1798 / 1829 / 1849):

```ts
// Era-conditional cabinet seat list (PR5). Returns the cabinet seats active
// in the given calendar year. Four historical transitions:
//   year <  1789       → []                                (no cabinet)
//   1789 ≤ year < 1798 → 4 seats: State / Treasury / War / AG
//   1798 ≤ year < 1829 → +SecretaryOfNavy                  (5 seats)
//   1829 ≤ year < 1849 → +PostmasterGeneral                (6 seats)
//   year ≥ 1849        → +SecretaryOfInterior              (7 seats)
// Order matches OFFICE_PRESTIGE desc for log-line readability (CP2 #12).
// Pure, deterministic — no Math.random, no snapshot.
export function cabinetSeatsForYear(year: number): OfficeType[] {
  if (year < 1789) return [];
  const seats: OfficeType[] = [
    'SecretaryOfState',
    'SecretaryOfTreasury',
    'SecretaryOfWar',
  ];
  if (year >= 1798) seats.push('SecretaryOfNavy');
  seats.push('AttorneyGeneral');
  if (year >= 1849) seats.push('SecretaryOfInterior');
  if (year >= 1829) seats.push('PostmasterGeneral');
  return seats;
}
```

**(F) New `CABINET_SEAT_SCORING` table** added immediately after
`cabinetSeatsForYear` at the same locality. Encodes the per-seat
composite scoring weights resolved by the architect per Tuning call #1
(values resolved below):

```ts
// PR5 composite-score weights per cabinet seat. Used by runPhase_2_3_1_Cabinet
// to rank eligible candidates. Replaces the pure-admin sort at
// phaseRunners.ts:2096. AG admin / governing = 0 per F-AG-NO-DEPARTMENT-
// PRE-1870 (the seat is a one-person legal office). Each seat declares an
// optional secondaryStat (a SkillKey) and its weight; the primary-expertise
// bonus is a flat +5 across all seats.
export interface CabinetSeatScoring {
  admin: number;
  governing: number;
  secondaryStat?: SkillKey;
  secondaryWeight: number;
  expertiseBonus: number;
}

export const CABINET_SEAT_SCORING: Partial<Record<OfficeType, CabinetSeatScoring>> = {
  SecretaryOfState:     { admin: 2, governing: 1, secondaryStat: 'legislative', secondaryWeight: 1, expertiseBonus: 5 },
  SecretaryOfTreasury:  { admin: 2, governing: 1,                                secondaryWeight: 0, expertiseBonus: 5 },
  SecretaryOfWar:       { admin: 1, governing: 1, secondaryStat: 'military',    secondaryWeight: 2, expertiseBonus: 5 },
  SecretaryOfNavy:      { admin: 1, governing: 1, secondaryStat: 'military',    secondaryWeight: 2, expertiseBonus: 5 },
  AttorneyGeneral:      { admin: 0, governing: 0, secondaryStat: 'judicial',    secondaryWeight: 2, expertiseBonus: 5 }, // F-AG-NO-DEPARTMENT-PRE-1870
  SecretaryOfInterior:  { admin: 2, governing: 1,                                secondaryWeight: 0, expertiseBonus: 5 },
  PostmasterGeneral:    { admin: 1, governing: 2, secondaryStat: 'backroom',    secondaryWeight: 1, expertiseBonus: 5 }, // patronage seat
};

// Cross-party gate (CP1 Q4 USER OVERRIDE). PR5 ships probabilistic cross-
// party with a composite-score penalty:
//   - 10% chance per seat-fill, rolled at the top of each seat iteration,
//     to relax the same-party filter for THIS seat only.
//   - When relaxed, cross-party candidates receive a -3 score penalty on
//     top of the formula above.
//   - The same-party filter is NOT relaxed when the roll fails; PR5 stays
//     same-party 90% of seat-fills.
export const CABINET_CROSS_PARTY_RATE = 0.1;
export const CABINET_CROSS_PARTY_PENALTY = -3;
```

**Resolution of Tuning call #1 (exact numeric weights).** Per task brief
ranges; AG and PMG get the per-seat overrides the historian
recommended:

| Seat | admin_w | governing_w | secondary | secondary_w | expertise_bonus |
|---|---|---|---|---|---|
| State | 2 | 1 | `legislative` | 1 | +5 |
| Treasury | 2 | 1 | — | 0 | +5 |
| War | 1 | 1 | `military` | 2 | +5 |
| Navy | 1 | 1 | `military` | 2 | +5 |
| AG | 0 | 0 | `judicial` | 2 | +5 |
| Interior | 2 | 1 | — | 0 | +5 |
| PMG | 1 | 2 | `backroom` | 1 | +5 |

Rationale per spec AC #10:
- **State** doubles admin (Hamilton-era department admin); legislative
  secondary for Senate-floor treaty work (JQA / Webster).
- **Treasury** doubles admin (the most-administered department of the
  founding era).
- **War / Navy** symmetric: `military` doubled as secondary; admin and
  governing carry comparable weight (strategist-administrator profile).
- **AG**: admin AND governing ZERO; judicial doubled — F-AG-NO-DEPT-
  PRE-1870. A high-admin generalist scores LOWER than a Justice-
  expertise judicial-3 candidate (`0 + 0 + 2*3 + 5 = 11` vs admin-5
  generalist `0 + 0 + 0 + 0 = 0`).
- **Interior**: standard admin+governing (the seat was a real department
  from 1849).
- **PMG**: governing doubled (patronage), backroom secondary
  (Kendall-style political-machine play).

Sample evaluations (verifies the seat-texture intent):
- *Hamilton-as-Treasury*: admin=5, governing=3, Economics expertise →
  `2*5 + 1*3 + 0 + 5 = 18`.
- *Generalist (admin=4) for Treasury, no Economics*: `2*4 + 1*0 + 0 + 0 = 8`.
- *Wirt-as-AG*: judicial=4, Justice expertise → `0 + 0 + 2*4 + 5 = 13`.
- *High-admin generalist for AG (admin=5, no expertise, judicial=1)*:
  `0 + 0 + 2*1 + 0 = 2`. AG correctly prefers Wirt by 11 points.

**(G) Save / migration impact.** Old IndexedDB saves carrying
`cabinet.KeyAdvisor` or `cabinet.Admiral` fields load via the existing
`repair()` flow (`src/state/GameContext.tsx:91-194`). Migration code is
added per Section J — see Engine edit E-4 below. Old politicians with
`currentOffice.type === 'KeyAdvisor'` or `'Admiral'` get their
`currentOffice` nulled, re-entering the eligible pool. PV cache is stale
for one phase boundary until `refreshPv` runs (acceptable per spec AC
#30 / eventual consistency).

### `src/pv.ts` — OFFICE_PRESTIGE + officeWeights edits

**(H) `OFFICE_PRESTIGE` update** at `pv.ts:7-30`. Drop KeyAdvisor +
Admiral; add Navy at parity-with-War (10) and Interior at parity-with-
AG (8):

```ts
export const OFFICE_PRESTIGE: Record<string, number> = {
  President: 30,
  VicePresident: 12,
  ChiefJustice: 18,
  AssociateJustice: 10,
  SecretaryOfState: 12,
  SecretaryOfTreasury: 10,
  SecretaryOfWar: 10,
  SecretaryOfNavy: 10,           // NEW (parity with War per spec AC #3)
  AttorneyGeneral: 8,
  SecretaryOfInterior: 8,        // NEW (parity with AG per spec AC #3)
  PostmasterGeneral: 4,
  // REMOVED: KeyAdvisor: 8,
  GeneralInChief: 12,
  // REMOVED: Admiral: 10,
  SpeakerOfHouse: 12,
  CCPresident: 25,
  SenateProTem: 10,
  CommitteeChair: 6,
  FactionLeader: 8,
  PartyLeader: 14,
  Senator: 5,
  Representative: 2,
  Governor: 6,
  Ambassador: 3,
};
```

**(I) `officeWeights` update** at `pv.ts:32-63`. Drop the `'Admiral'`
case from the GeneralInChief/Admiral group (GeneralInChief stays alone);
drop the `'KeyAdvisor'` case from the cabinet group; add `'Secretary
OfNavy'` + `'SecretaryOfInterior'` to the cabinet group (same 2.5-admin
bucket as State/Treasury/War/AG/PMG/Ambassador):

```ts
export function officeWeights(office: OfficeRef | null): Record<string, number> {
  switch (office?.type) {
    case 'President':
    case 'VicePresident':
      return { admin: 2, legislative: 1, judicial: 0.5, military: 1, governing: 1, backroom: 1 };
    case 'ChiefJustice':
    case 'AssociateJustice':
      return { admin: 0.5, legislative: 0.5, judicial: 3, military: 0, governing: 0.5, backroom: 0.5 };
    case 'GeneralInChief':
      // REMOVED: case 'Admiral':
      return { admin: 1, legislative: 0, judicial: 0, military: 3, governing: 0, backroom: 0.5 };
    case 'Senator':
    case 'SpeakerOfHouse':
    case 'SenateProTem':
    case 'Representative':
    case 'CommitteeChair':
    case 'CCPresident':
      return { admin: 0.5, legislative: 2.5, judicial: 0.5, military: 0, governing: 0.5, backroom: 1 };
    case 'Governor':
      return { admin: 1, legislative: 0.5, judicial: 0.5, military: 0.5, governing: 2.5, backroom: 1 };
    case 'SecretaryOfState':
    case 'SecretaryOfTreasury':
    case 'SecretaryOfWar':
    case 'SecretaryOfNavy':            // NEW
    case 'AttorneyGeneral':
    case 'SecretaryOfInterior':        // NEW
    case 'PostmasterGeneral':
    // REMOVED: case 'KeyAdvisor':
    case 'Ambassador':
      return { admin: 2.5, legislative: 0.5, judicial: 0.5, military: 0.5, governing: 0.5, backroom: 1 };
    default:
      return { admin: 1, legislative: 1, judicial: 1, military: 1, governing: 1, backroom: 1 };
  }
}
```

## Engine changes (pure logic)

All deterministic over the snapshot via `src/rng.ts` (`chance` + `pick`).
No `Math.random` additions. Five surgical edits:

### Edit E-1: `runPhase_2_3_1_Cabinet` rewrite (`phaseRunners.ts:2088-2134`)

Replace the existing 47-line implementation with a `cabinetSeatsForYear`-
driven loop that uses `scoreCabinetCandidate` for selection and gates
cross-party picks via `CABINET_CROSS_PARTY_RATE`. The F-DOUBLING admin
grant + SoS command grant + expertise grant side-effects are preserved
verbatim from the current code (lines 2107-2131).

**Import update**. Add `cabinetSeatsForYear`, `CABINET_SEAT_SCORING`,
`CABINET_CROSS_PARTY_RATE`, `CABINET_CROSS_PARTY_PENALTY` to the existing
`from '../types'` import group at the top of `phaseRunners.ts`. Add
`chance` to the `from '../rng'` import (already imported for other uses;
verify via grep).

**Replacement code** for `runPhase_2_3_1_Cabinet`:

```ts
export function runPhase_2_3_1_Cabinet(snap: FullGameSnapshot): void {
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (!president) return;
  const partyId = president.partyId;
  const seats = cabinetSeatsForYear(snap.game.year);
  if (seats.length === 0) return;  // pre-1789; defense-in-depth alongside shouldRunPhase gate

  for (const seat of seats) {
    if (snap.game.cabinet[seat]) continue;
    const scoring = CABINET_SEAT_SCORING[seat];
    if (!scoring) continue;  // type-level guarantee; defensive

    // Cross-party gate (CP1 Q4 USER OVERRIDE). One d100 per seat-fill via
    // rng.chance — independent rolls per seat per cycle.
    const crossPartyAllowed = chance(CABINET_CROSS_PARTY_RATE);

    const eligible = snap.politicians.filter(
      (p) => !p.currentOffice && p.age < 75 && (crossPartyAllowed || p.partyId === partyId),
    );

    // Score every eligible candidate; sort desc; tie-break by pvCache desc, then id asc.
    const scored = eligible.map((p) => ({
      p,
      score: scoreCabinetCandidate(seat, p, scoring) + (p.partyId !== partyId ? CABINET_CROSS_PARTY_PENALTY : 0),
    }));
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.p.pvCache !== a.p.pvCache) return b.p.pvCache - a.p.pvCache;
      return a.p.id < b.p.id ? -1 : 1;
    });

    const pick = scored[0]?.p;
    if (!pick) continue;
    const isCross = pick.partyId !== partyId;

    snap.game.cabinet[seat] = pick.id;
    pick.currentOffice = { type: seat };

    const xp = OFFICE_EXPERTISE[seat];
    const expertiseLabel = xp && pick.expertise.includes(xp) ? ` (${xp} specialist)` : '';
    const crossLabel = isCross ? ' (cross-party appointment)' : '';
    addLog(snap, '2.3.1', 'appointment',
      `${pick.firstName} ${pick.lastName} confirmed as ${seat}${expertiseLabel}${crossLabel}.`);

    // F-DOUBLING admin grant (preserved from existing code; lines 2107-2117).
    const baseAdmin = OFFICE_ADMIN_GRANT[seat];
    if (baseAdmin) {
      const r = ABILITY_EARN_RULES.cabinetConfirmAdmin;
      const amount = r.base
        * (pick.traits.includes('Egghead')   ? r.eggheadMult   : 1)
        * (pick.traits.includes('Efficient') ? r.efficientMult : 1);
      if (addSkillPoint(pick, 'admin', amount)) {
        addLog(snap, '2.3.1', 'appointment',
          `${pick.firstName} ${pick.lastName} gains Admin from confirmation.`);
      }
    }

    // SoS command grant (preserved; lines 2119-2126).
    const cmdBase = OFFICE_COMMAND_GRANT[seat];
    if (cmdBase && addCommandPoint(pick, cmdBase)) {
      addLog(snap, '2.3.1', 'appointment',
        `${pick.firstName} ${pick.lastName} gains Command from the Secretary of State portfolio.`);
    }

    // Expertise grant (preserved; lines 2128-2131).
    if (xp && addExpertise(pick, xp)) {
      addLog(snap, '2.3.1', 'appointment',
        `${pick.firstName} ${pick.lastName} gains ${xp} expertise.`);
    }
  }
}

// Composite score for a candidate for a given cabinet seat. Used by 2.3.1
// to rank eligible politicians per CABINET_SEAT_SCORING. Pure — no RNG,
// no snapshot. Returns the unmodified composite (the cross-party penalty
// is applied at the call site so it appears in the sorted tuple).
function scoreCabinetCandidate(
  seat: OfficeType,
  p: Politician,
  scoring: CabinetSeatScoring,
): number {
  let s = scoring.admin * p.skills.admin + scoring.governing * p.skills.governing;
  if (scoring.secondaryStat && scoring.secondaryWeight > 0) {
    s += scoring.secondaryWeight * p.skills[scoring.secondaryStat];
  }
  const primary = OFFICE_EXPERTISE[seat];
  if (primary && p.expertise.includes(primary)) s += scoring.expertiseBonus;
  return s;
}
```

**Resolution of Tuning call #2 (cross-party RNG implementation).**

- **Where the RNG check fires:** PER-SEAT, at the TOP of each seat
  iteration in the `for (const seat of seats)` loop. Independent rolls
  per seat per cabinet cycle. A 7-seat cabinet sees 7 independent 10%
  rolls per cycle; expected cross-party openings per cycle = 0.7.
- **How the `-3` penalty integrates:** at SCORE-COMPUTATION time, added
  inside the `scored.map(...)` call so the sorted tuple already
  reflects the penalty. Cross-party candidates are included in the
  eligible pool when `crossPartyAllowed` is true; they get the `-3`
  penalty applied uniformly. This makes the cross-party pick a
  same-party candidate's penalty-absorbed comparison rather than a
  separate selection branch.
- **RNG channel:** `chance(CABINET_CROSS_PARTY_RATE)` from `src/rng.ts`.
  Single d100-equivalent per seat. The existing rng.ts is shared with
  every other engine call site; PR5 introduces no new channel.
- **Logging the cross-party choice:** the existing log line
  appends ` (cross-party appointment)` when `pick.partyId !== partyId`.
  Transparency for the player without spamming the log.
- **Determinism note:** `chance` reads `Math.random` internally per
  `rng.ts:4-6`; runs are not bit-reproducible per CLAUDE.md's existing
  determinism caveat. The cross-party fire is statistically deterministic
  (10% expectation) but per-game variance applies.

Edge case: when `crossPartyAllowed = true` but the same-party highest-
scorer still beats the best cross-party candidate after the `-3` penalty,
the same-party candidate wins as usual. The 10% gate only OPENS the door
to cross-party consideration; it doesn't guarantee a cross-party pick.

### Edit E-2: `runPhase_2_3_2_Military` Admiral block deletion (`phaseRunners.ts:2165-2181`)

Delete the entire Admiral block at lines 2165-2181 (17 lines). The
GeneralInChief block at lines 2148-2164 is untouched. Per spec AC #19 +
F-ADMIRAL-ANACHRONISTIC ("MOST BINDING"). The Naval-expertise routing
the Admiral block used (`p.expertise.includes('Naval')` at line 2166)
is preserved via the new `SecretaryOfNavy` seat granting Naval expertise
per `OFFICE_EXPERTISE` (B above).

Post-edit, `runPhase_2_3_2_Military` becomes a single-block GeneralInChief
filler — historically appropriate for both AMPU scenarios (the historian's
1821-only flag for GeneralInChief is the deliberate deviation per spec
"Deviation A").

### Edit E-3: `runPhase_2_5_1_Lingering` per-seat expertise bonuses (`phaseRunners.ts:2952-2993`)

Append the per-seat conditional `+0.2` bonus block AFTER the existing
drift baseline (the existing `apply()` calls at lines 2976-2982 stay
verbatim). The new block fires after the existing baseline because the
spec locks "combined single line" for log output (spec AC #27); folding
the bonus into the `apply()` call would double-fire the log line.

**Resolution of Tuning call #9 (Lingering Phase +0.2 integration).**
Architect insertion site: immediately AFTER the existing `state` /
diplomacy drift block (after line 2989), BEFORE the `nationalDebt`
adjustment (line 2992). The bonus calls `apply()` directly — the same
log helper used by the drift baseline; player sees a single combined
meter delta line per meter per turn.

**New code block** inserted at `phaseRunners.ts:2990`:

```ts
  // PR5: per-seat expertise-gated cabinet bonus. Fires ONLY when the seated
  // Secretary carries the seat's primary expertise (OFFICE_EXPERTISE). The
  // existing drift block above runs first; this layers conditionally on top
  // via the same apply() helper, so the log shows one combined delta.
  // Mapping locked per spec section I + user override (Interior → Agriculture).
  const cabinetBonuses: Array<{ seat: OfficeType; meter: keyof NationalMeters }> = [
    { seat: 'SecretaryOfState',     meter: 'domestic' },
    { seat: 'SecretaryOfTreasury',  meter: 'economic' },
    { seat: 'SecretaryOfWar',       meter: 'military' },
    { seat: 'SecretaryOfNavy',      meter: 'military' },
    { seat: 'AttorneyGeneral',      meter: 'honest'   },
    { seat: 'SecretaryOfInterior',  meter: 'quality'  },
    { seat: 'PostmasterGeneral',    meter: 'quality'  },
  ];
  for (const { seat, meter } of cabinetBonuses) {
    const occupantId = snap.game.cabinet[seat];
    if (!occupantId) continue;
    const sec = snap.politicians.find((p) => p.id === occupantId);
    if (!sec) continue;
    const primary = OFFICE_EXPERTISE[seat];
    if (primary && sec.expertise.includes(primary)) {
      apply(meter, 0.2);
    }
  }
```

The `cabinetBonuses` array is defined locally (not exported) — the
mapping is only needed in one place. Matches the precedent in this
function where the local `drift()` and `apply()` helpers are inline.

**Meter mapping per locked spec + user override:**

| Seat | Primary expertise | Meter | Note |
|---|---|---|---|
| State | Foreign Affairs | `domestic` | foreign policy → public mood |
| Treasury | Economics | `economic` | Hamilton / Gallatin / Chase |
| War | Military | `military` | Calhoun / Davis / Stanton |
| Navy | Naval | `military` | Stoddert / Welles (stacks with War) |
| AG | Justice | `honest` | Wirt-style courtroom |
| Interior | Agriculture | `quality` | settlement + infra + patents (USER OVERRIDE: was Welfare) |
| PMG | Transportation | `quality` | mail-as-infrastructure |

Cap when all 7 seats fill with matched expertise: `+1.4` total per turn
across 4 distinct meters (`military` and `quality` stack with 2 seats
each). Per spec Assumption 3 this is ~14% of the meter's [-5, +5] clamp
range — meaningful but not dominant.

### Edit E-4: Save migration in `repair()` (`GameContext.tsx:91-194`)

Insert the KeyAdvisor / Admiral cabinet-scrub block AFTER the existing
LEGACY_EXPERTISE migration (after line 192) and BEFORE the `return dirty
? { ...s } : s` line (193). Pattern matches the existing migrations:
iterate, scrub, set `dirty = true`. Uses the `as unknown as` idiom
because TypeScript no longer recognizes `'KeyAdvisor'` or `'Admiral'`
as valid `OfficeType` literals after the PR5 type surgery.

**Resolution of Tuning call #6 (repair migration block).**

```ts
    // PR5: scrub legacy cabinet seats (KeyAdvisor + Admiral) dropped from
    // OfficeType. Old saves with cabinet.KeyAdvisor or cabinet.Admiral as
    // JSON-persisted fields silently load but are unreachable from typed
    // code. Same for politicians whose currentOffice.type matches.
    const legacyCabinetKeys = ['KeyAdvisor', 'Admiral'] as const;
    const cabinetAsAny = s.game.cabinet as unknown as Record<string, string | null | undefined>;
    let cabinetDropped = false;
    for (const k of legacyCabinetKeys) {
      if (k in cabinetAsAny) {
        delete cabinetAsAny[k];
        cabinetDropped = true;
      }
    }
    let politicianDropped = false;
    for (const p of s.politicians) {
      const office = p.currentOffice as { type: string } | null;
      if (office && (office.type === 'KeyAdvisor' || office.type === 'Admiral')) {
        p.currentOffice = null;
        politicianDropped = true;
      }
    }
    if (cabinetDropped || politicianDropped) {
      dirty = true;
      // eslint-disable-next-line no-console
      console.log('[migration] PR5: dropped legacy KeyAdvisor / Admiral fields from cabinet and politician currentOffice.');
    }
```

The migration is idempotent: a second `repair()` call finds no matching
keys (`delete` is no-op on missing) and no politicians with the offending
`currentOffice.type` (already scrubbed), so `dirty` stays false on
re-load. Matches spec Assumption 4.

### Edit E-5: `revolutionaryWar.ts` — rename "Admiral" combat role to "Commodore"

**Resolution of Tuning call #7 (revolutionaryWar.ts + RevWarDashboard
Admiral references).**

The Explore report flagged 4 references in `revolutionaryWar.ts` plus 2
in `RevWarDashboard.tsx` plus 2 in `politicians1856.ts`. After reading
the files (`revolutionaryWar.ts:24, 56, 59, 60, 61, 87, 178, 182`), these
are **combat-rank** uses, NOT cabinet-seat uses — they govern the
Continental Navy's senior naval commander in Rev War battle logic. The
historian explicitly endorses **Commodore** as the era-correct term for
1772-window senior naval command (John Paul Jones et al.).

**Architect call: rename, don't drop.** PR5 renames the data field
`seniorAdmiralId` → `seniorCommodoreId` on `RevolutionaryWar` and the UI
label "Senior Admiral" → "Senior Commodore". The
`currentOffice = { type: 'Admiral' }` assignment at `revolutionaryWar.
ts:60` is **deleted** — the wartime naval commander serves without a
formal `currentOffice` slot (same shape as the `generalIds[]` /
`admiralIds[]` filling-personnel arrays that already carry no
`currentOffice`).

**`src/types.ts:1094-1095`** — rename the two RevolutionaryWar fields:

```ts
  // BEFORE:
  seniorAdmiralId: string | null;
  admiralIds: string[];
  // AFTER:
  seniorCommodoreId: string | null;
  commodoreIds: string[];
```

**`src/engine/revolutionaryWar.ts`** — rename all 8 references:

| Line | Before | After |
|---|---|---|
| 24 | `seniorAdmiralId: null,` | `seniorCommodoreId: null,` |
| 25 | `admiralIds: [],` | `commodoreIds: [],` |
| 56 | `if (!war.seniorAdmiralId) {` | `if (!war.seniorCommodoreId) {` |
| 57 | (no change — `adms` variable name is local, can stay or rename to `commodores` for clarity; architect picks `commodores` for cohesion) | `const commodores = snap.politicians.filter(...)` |
| 59 | `war.seniorAdmiralId = adms[0].id;` | `war.seniorCommodoreId = commodores[0].id;` |
| 60 | `adms[0].currentOffice = { type: 'Admiral' };` | **DELETE entirely** (no replacement `currentOffice` assignment — wartime command role tracked via `seniorCommodoreId`, not a cabinet office) |
| 61 | `addLog(snap, '2.7.2', 'appointment', \`${adms[0].firstName} ${adms[0].lastName} appointed Senior Admiral.\`);` | `addLog(snap, '2.7.2', 'appointment', \`${commodores[0].firstName} ${commodores[0].lastName} appointed Senior Commodore of the Continental Navy.\`);` |
| 63 | `war.admiralIds = adms.slice(1, 3).map((a) => a.id);` | `war.commodoreIds = commodores.slice(1, 3).map((a) => a.id);` |
| 87 | `p.id !== war.seniorAdmiralId` | `p.id !== war.seniorCommodoreId` |
| 178 | `if (!war.seniorGeneralId \|\| !war.seniorAdmiralId) {` | `if (!war.seniorGeneralId \|\| !war.seniorCommodoreId) {` |
| 182 | `const admiral = snap.politicians.find((p) => p.id === war.seniorAdmiralId);` | `const commodore = snap.politicians.find((p) => p.id === war.seniorCommodoreId);` |

Any subsequent references to `admiral` as a local variable in lines 183+
follow the variable rename — verify via grep at edit time. The
`BATTLE_NAMES_NAVAL` array (line 10) is unaffected.

**`src/pages/RevWarDashboard.tsx`** — rename 2 references:

```tsx
// Line 16 BEFORE:
const admiral = war.seniorAdmiralId ? snapshot.politicians.find((p) => p.id === war.seniorAdmiralId) : null;
// AFTER:
const commodore = war.seniorCommodoreId ? snapshot.politicians.find((p) => p.id === war.seniorCommodoreId) : null;

// Line 48 BEFORE:
<div className="text-sm">Senior Admiral: <span className="font-semibold">{admiral ? `${admiral.firstName} ${admiral.lastName}` : '—'}</span> {admiral && <span className="text-xs text-slate-500">(Mil {admiral.skills.military})</span>}</div>
// AFTER:
<div className="text-sm">Senior Commodore: <span className="font-semibold">{commodore ? `${commodore.firstName} ${commodore.lastName}` : '—'}</span> {commodore && <span className="text-xs text-slate-500">(Mil {commodore.skills.military})</span>}</div>
```

**Resolution of Tuning call #8 (`politicians1856.ts` Admiral refs).**
The 2 references are at `politicians1856.ts:16` — a `Seed` TYPE union
listing every possible `office` value. **No seeded politician actually
carries `office: 'Admiral'`** (grep on `office: 'Admiral'` returns no
content matches). Per spec AC #25, PR5 doesn't pre-emptively scrub
unused data — drop `'Admiral'` from the type union literal at
`politicians1856.ts:16` for type-correctness ONLY:

```ts
// BEFORE:
office?: 'President' | 'VicePresident' | 'ChiefJustice' | 'AssociateJustice' | 'Senator' | 'Representative' | 'Governor' | 'GeneralInChief' | 'Admiral' | 'SecretaryOfState' | 'SecretaryOfTreasury' | 'SecretaryOfWar' | 'AttorneyGeneral';
// AFTER:
office?: 'President' | 'VicePresident' | 'ChiefJustice' | 'AssociateJustice' | 'Senator' | 'Representative' | 'Governor' | 'GeneralInChief' | 'SecretaryOfState' | 'SecretaryOfTreasury' | 'SecretaryOfWar' | 'SecretaryOfNavy' | 'AttorneyGeneral' | 'SecretaryOfInterior';
```

(Adds Navy + Interior for forward-compat in case a future dataset edit
seeds Toucey-as-Navy / Thompson-as-Interior per spec AC #24 future-
regen-PR territory.)

### Edit E-6: Phase gating — verify, don't add (`phases.ts:90`)

**Resolution of Tuning call #4 (era-transition mid-game handling).**
The existing `shouldRunPhase` gate at `phases.ts:82-90` already skips
phases 2.3.1 + 2.3.2 in the `independence` era unconditionally. The 1772
scenario stays in `independence` until the Constitution ratifies (1788);
at scenario open the `currentEra = 'independence'` (verified at
`scenario1772.ts:97`). **The spec's "skip pre-1789" rule is therefore
already enforced by the era gating.** PR5 documents this; no `phases.ts`
edit is required.

The mid-game era transition (1798 / 1829 / 1849) requires NO special
runner code — `runPhase_2_3_1_Cabinet` reads `cabinetSeatsForYear
(snap.game.year)` every cycle and iterates the new seat list. When 1798
arrives in a long 1772-run, the next 2.3.1 sees Navy in the seats list,
finds `snap.game.cabinet.SecretaryOfNavy` as `undefined` (not yet seeded),
the early-`continue` guard passes (`undefined` is falsy), and the seat
fills from the eligible pool. No special "year transition" logic.

**Belt-and-suspenders defense (spec AC #5):** `runPhase_2_3_1_Cabinet`
already returns early when `cabinetSeatsForYear` returns `[]` — covers
the edge case where a hypothetical future scenario reaches the
`federalism` era before year 1789. No further `shouldRunPhase` change
needed.

## UI changes

### `CabinetPage.tsx` POSITIONS array update (`CabinetPage.tsx:5-14`)

**Resolution of Tuning call #5.** Drop `KeyAdvisor` + `Admiral`; add
`SecretaryOfNavy` + `SecretaryOfInterior` in era-precedence order.

```tsx
// BEFORE:
const POSITIONS: OfficeType[] = [
  'KeyAdvisor',
  'SecretaryOfState',
  'SecretaryOfTreasury',
  'SecretaryOfWar',
  'AttorneyGeneral',
  'PostmasterGeneral',
  'GeneralInChief',
  'Admiral',
];

// AFTER:
const POSITIONS: OfficeType[] = [
  'SecretaryOfState',
  'SecretaryOfTreasury',
  'SecretaryOfWar',
  'SecretaryOfNavy',           // NEW (1798+)
  'AttorneyGeneral',
  'SecretaryOfInterior',       // NEW (1849+)
  'PostmasterGeneral',
  'GeneralInChief',
];
```

Per spec AC #4, PR5 does NOT add era-conditional hiding at the UI layer.
A 1772 player at year 1785 sees all 7 cabinet positions render with `—`
placeholders for the seats the engine won't fill. Era-aware hide is
polish for a future PR. The rendering pattern at lines 51-62 is
unchanged.

### `RevWarDashboard.tsx` label change

Per Edit E-5 above: rename "Senior Admiral" → "Senior Commodore" at line
48. UI variable rename `admiral` → `commodore`.

**Resolution of Tuning call #11 (labels.ts centralization).** Architect
declines. PR5 does NOT introduce a labels.ts office-label table. The UI
renders `pos` directly (the office-type string) and PR5 keeps that
pattern. Labels work is a future polish PR.

## Dataset / scenario data changes

### `src/data/scenario1772.ts:88` — empty cabinet seed

Per spec AC #22 + F-1772-NO-CABINET-PRE-1789. The 1772 scenario opens
17 years before any cabinet exists. The current 6-seat null seed is an
anachronism:

```ts
// BEFORE:
cabinet: { SecretaryOfState: null, SecretaryOfTreasury: null, SecretaryOfWar: null, AttorneyGeneral: null, PostmasterGeneral: null, KeyAdvisor: null },

// AFTER:
cabinet: {},
```

The `Partial<Record<OfficeType, string | null>>` type accepts an empty
object. When year 1789 arrives in a long-1772 run, the next 2.3.1 run
will populate the 4 federalism-era seats from
`cabinetSeatsForYear(1789)`.

### `src/data/scenario1856.ts:128-135` — full 7-seat 1857 Buchanan seed

Per spec AC #23. Drop `KeyAdvisor: null`; add `SecretaryOfNavy: null` +
`SecretaryOfInterior: null`:

```ts
// BEFORE:
const cabinet = {
  SecretaryOfState: politicians.find((p) => p.currentOffice?.type === 'SecretaryOfState')?.id ?? null,
  SecretaryOfTreasury: null,
  SecretaryOfWar: null,
  AttorneyGeneral: null,
  PostmasterGeneral: null,
  KeyAdvisor: null,
} as GameState['cabinet'];

// AFTER:
const cabinet = {
  SecretaryOfState: politicians.find((p) => p.currentOffice?.type === 'SecretaryOfState')?.id ?? null,
  SecretaryOfTreasury: null,
  SecretaryOfWar: null,
  SecretaryOfNavy: null,           // NEW
  AttorneyGeneral: null,
  SecretaryOfInterior: null,       // NEW
  PostmasterGeneral: null,
} as GameState['cabinet'];
```

Per spec AC #24, PR5 leaves the seeded Buchanan-era figures' `current
Office` alone (no attaching Cobb / Floyd / Toucey / Thompson / Black /
Brown). The first 2.3.1 run at scenario open fills the 6 nulls from
the eligible pool via the new composite scoring formula.

### `src/data/politicians1856.ts:16` — Seed type union update

Per Tuning call #8 above. Drop `'Admiral'`; add `'SecretaryOfNavy'` +
`'SecretaryOfInterior'`.

## Files to touch (exact, ordered)

**New files:** 0. **Modified files:** 8. **Total = 8 modified, 0 new.**

1. **`src/types.ts`** — `OfficeType` union surgery (`:918-940` — drop
   `KeyAdvisor` + `Admiral`, add `SecretaryOfNavy` + `SecretaryOfInterior`);
   `OFFICE_EXPERTISE` revision (`:944-951` — Navy/Interior/PMG additions
   + Admiral removal, Interior = Agriculture user-override); `OFFICE_
   COMMAND_GRANT` comment update (`:506-509`); `OFFICE_ADMIN_GRANT`
   update (`:514-521`); new `cabinetSeatsForYear` helper + `CabinetSeat
   Scoring` interface + `CABINET_SEAT_SCORING` table + `CABINET_CROSS_
   PARTY_RATE` + `CABINET_CROSS_PARTY_PENALTY` constants (inserted after
   `OFFICE_EXPERTISE` at `:951`); `RevolutionaryWar.seniorAdmiralId` /
   `admiralIds` field rename to `seniorCommodoreId` / `commodoreIds`
   (`:1094-1095`).
2. **`src/pv.ts`** — `OFFICE_PRESTIGE` update (`:7-30` — drop KeyAdvisor
   + Admiral, add Navy=10 + Interior=8); `officeWeights` update (`:32-63`
   — drop the Admiral case from GeneralInChief group, drop KeyAdvisor
   from cabinet group, add SecretaryOfNavy + SecretaryOfInterior to
   cabinet group).
3. **`src/engine/phaseRunners.ts`** — `runPhase_2_3_1_Cabinet` full
   rewrite (`:2088-2134` — composite scoring + cross-party gate +
   preserved side-effects); `runPhase_2_3_2_Military` Admiral block
   deletion (`:2165-2181` — delete 17 lines); `runPhase_2_5_1_Lingering`
   per-seat expertise bonus block insertion (after `:2989`, before
   nationalDebt at `:2992`); add `scoreCabinetCandidate` helper function
   adjacent to `runPhase_2_3_1_Cabinet`; import updates at the top of
   the file.
4. **`src/engine/revolutionaryWar.ts`** — rename `seniorAdmiralId` →
   `seniorCommodoreId` and `admiralIds` → `commodoreIds` at lines 24,
   25, 56, 59, 63, 87, 178, 182; rename local `adms` variable to
   `commodores` at line 57 (and 59, 63 consumers); DELETE the
   `currentOffice = { type: 'Admiral' }` assignment at `:60`; update
   the log line at `:61` to "Senior Commodore of the Continental Navy".
5. **`src/pages/CabinetPage.tsx`** — POSITIONS array update (`:5-14` —
   drop KeyAdvisor + Admiral, add SecretaryOfNavy + SecretaryOfInterior
   in era-precedence order).
6. **`src/pages/RevWarDashboard.tsx`** — local `admiral` variable
   rename to `commodore` (`:16`); UI label "Senior Admiral" → "Senior
   Commodore" (`:48`).
7. **`src/state/GameContext.tsx`** — `repair()` migration block insertion
   after the LEGACY_EXPERTISE block (after `:192`, before `:193`).
8. **`src/data/scenario1772.ts`** — cabinet seed → `{}` (`:88`).
9. **`src/data/scenario1856.ts`** — cabinet seed → 7 keys (`:128-135`).
10. **`src/data/politicians1856.ts`** — `Seed.office` type union update
    (`:16` — drop `'Admiral'`, add `'SecretaryOfNavy'` +
    `'SecretaryOfInterior'`).

(Counting: 10 modified file paths — the "Total = 8" above mis-counted;
the precise file-count is **10 modified, 0 new**. Architect's CP2
summary corrects to 10.)

**Not touched (guardrails):**
- `src/phases.ts` — existing `shouldRunPhase` era gating already covers
  pre-1789 skip (per Tuning call #4). Description text at `:19` ("General
  in Chief and Admiral") could be updated to "General in Chief only" but
  PR5 leaves it as a cosmetic tweak the architect declines — it's a one-
  line description user-facing label, no behavioral impact, and updating
  it is out of the test surface. *Actually, let's update it for honesty*
  — see "Out of scope" note below.
- `src/engine/log.ts` — no new phase tag.
- `src/rng.ts` — no new RNG channel.
- `pendingCabinetVacancies` field at `types.ts:1287` — **Resolution of
  Tuning call #10**: leave as-is per architect rec (a). This field is
  unused today; future death/retirement-vacancy PR may wire it. PR5
  doesn't bloat scope.
- `src/data/draftImport.ts` — no `OfficeType` switch consumer affected
  (verified via Grep on `KeyAdvisor` + `Admiral`: zero matches in
  draftImport.ts).
- `src/data/defaultDraftClasses.ts` — no expected change; the dataset
  doesn't carry cabinet `currentOffice` assignments for KeyAdvisor /
  Admiral (verified — only `politicians1856.ts` had any Admiral type
  ref, and that was just the type union, no seed instance).
- `politicians-dataset.csv` / `public/standard-draft-classes.json` — no
  dataset regen required for PR5; no curated row carries `office:
  'Admiral'` or `office: 'KeyAdvisor'`.

**Tiny additional fix flagged (architect call):** `src/phases.ts:19`
phase description text reads `"General in Chief and Admiral."`. Update
to `"General in Chief."` for accuracy. One-character-and-three-word edit;
no behavioral impact. *Counts as part of the 10 modified files above —
update file count to 11.* **Final count: 11 modified, 0 new.**

## Test / verification plan

### Build / typecheck

`npm run build` (`tsc -b && vite build`) and `npm run lint` (`tsc -b
--noEmit`) must both be green. The `OfficeType` union surgery cascades
across all consumer sites; `as const satisfies` exhaustiveness on
`CABINET_SEAT_SCORING` + `OFFICE_EXPERTISE` + `OFFICE_ADMIN_GRANT` + the
`switch` in `officeWeights` ensures every miss is a compile error.

Tripwires to expect at the builder pass:

- `phaseRunners.ts:2092` original hardcoded `positions` array literal
  includes `'KeyAdvisor'` — removed in the rewrite.
- `phaseRunners.ts:2165-2181` Admiral block references `Admiral` literal
  in 4 places — entire block deleted.
- `revolutionaryWar.ts:60` `currentOffice = { type: 'Admiral' }` no
  longer compiles after type drop — deletion required.
- `pv.ts:19, 41, 57` Admiral / KeyAdvisor case labels — removed.
- `scenario1772.ts:88` + `scenario1856.ts:134` — `KeyAdvisor: null` no
  longer compiles after type drop — removed in seed updates.
- `politicians1856.ts:16` Seed type union — `'Admiral'` no longer maps
  to a valid `OfficeType` literal; removed.
- `RevWarDashboard.tsx:16, 48` — `war.seniorAdmiralId` field reads no
  longer compile after `RevolutionaryWar` rename; updated to
  `seniorCommodoreId`.
- `CabinetPage.tsx:6, 13` — POSITIONS array literal contains string
  literals no longer in `OfficeType` — updated.

### Smoke tests (contract — 22 assertions)

Pure Node test script. The 22 contract tests per task brief:

**OfficeType drops + adds (4 assertions):**
1. `assert(!('KeyAdvisor' satisfies OfficeType))` — compile-time check
   via a type-only test fixture; if `OfficeType` accepts `'KeyAdvisor'`
   the build fails earlier.
2. `assert(!('Admiral' satisfies OfficeType))` — same shape.
3. `assert(('SecretaryOfNavy' satisfies OfficeType))` — present.
4. `assert(('SecretaryOfInterior' satisfies OfficeType))` — present.

**`cabinetSeatsForYear` boundary tests (10 assertions):**
5. `cabinetSeatsForYear(1788).length === 0`
6. `cabinetSeatsForYear(1789).length === 4` (State, Treasury, War, AG)
7. `cabinetSeatsForYear(1797).length === 4`
8. `cabinetSeatsForYear(1798).length === 5` (+ Navy)
9. `cabinetSeatsForYear(1828).length === 5`
10. `cabinetSeatsForYear(1829).length === 6` (+ PMG)
11. `cabinetSeatsForYear(1848).length === 6`
12. `cabinetSeatsForYear(1849).length === 7` (+ Interior)
13. `cabinetSeatsForYear(1856).length === 7`
14. `cabinetSeatsForYear(1900).length === 7` (no further transitions)

**AG override scoring (2 assertions):**
15. `scoreCabinetCandidate('AttorneyGeneral', wirtFixture, …) >
     scoreCabinetCandidate('AttorneyGeneral', adminGeneralistFixture, …)`
    — Wirt fixture: `judicial=4, Justice expertise`; generalist fixture:
    `admin=5, no expertise, judicial=1`. Expected: 13 vs 2.
16. `scoreCabinetCandidate('SecretaryOfTreasury', hamiltonFixture, …)`
    — admin=5, governing=3, Economics expertise. Expected: 18.

**Cross-party RNG gate (3 assertions):**
17. With `CABINET_CROSS_PARTY_RATE` mocked to 0.0, no cross-party fills
    occur over 100 simulated cabinet cycles (filter via the
    `(cross-party appointment)` log substring).
18. With `CABINET_CROSS_PARTY_RATE` mocked to 1.0, every cabinet cycle
    relaxes the same-party filter; some cross-party fills occur when an
    out-party candidate beats a same-party candidate's score by more
    than the `-3` penalty.
19. With rate at 1.0 AND `CABINET_CROSS_PARTY_PENALTY = 0`, every
    cabinet cycle picks the best overall scorer regardless of party.

**Lingering Phase expertise bonus (3 assertions):**
20. With Treasury seated by an Economics-expertise Sec at admin=5, the
    `economic` meter after 2.5.1 reflects the existing drift (`0.5 *
    0.7 = +0.35`) PLUS the new `+0.2` PR5 bonus → `+0.55` total.
21. With Treasury seated by a non-Economics Sec at admin=5, the
    `economic` meter receives only the existing drift `+0.35` (no PR5
    bonus).
22. With Navy + War BOTH seated by Military / Naval expertise Secs, the
    `military` meter receives `+0.2` (War) + `+0.2` (Navy) = `+0.4`
    bonus on top of the existing drift.

### Playtest (per CLAUDE.md, `npm run dev`)

> Determinism caveat: runs are not bit-reproducible per `rng.ts:5`
> (`Math.random`). Verify qualitatively via log lines.

**1856 scenario (the bulk of PR5's machinery fires here):**

- Open the 1856 scenario as RED. Navigate to the Cabinet page. Verify
  the page renders: President / VP + 7 cabinet rows (State, Treasury,
  War, **Navy** [new], AG, **Interior** [new], PMG, GeneralInChief).
  At scenario open year 1856, State should show pre-seeded (Cass per
  the existing find-by-office pattern); 6 others are Vacant.
- Click Continue once. Watch the events feed for `2.3.1 appointment`
  lines — 6 confirmation lines should fire (one per Vacant seat). For
  each line, verify the format:
  - `<name> confirmed as <Seat>.` (no expertise marker)
  - `<name> confirmed as <Seat> (<Expertise> specialist).` (with marker
    when seated Sec carries the seat's primary expertise)
  - Cross-party appointments: ~10% expected. Look for `(cross-party
    appointment)` substring across several cabinet cycles.
- Continue through to 2.5.1 Lingering. Verify the meter log lines —
  Economic / Domestic / Military / Honest / Quality should reflect the
  combined drift + per-seat expertise bonus when the seated Sec has the
  primary expertise. The breakdown is folded into the single combined
  delta per spec AC #27.
- Verify AG selection prefers a judicial-skill candidate even when a
  high-admin generalist is available in the same party. Pick a save
  where Bates (judicial=4, no Justice expertise) is available; the
  next 2.3.1 should seat Bates over an admin=5 generalist.

**1772 scenario (verifies the era-transition path):**

- Open 1772 scenario. Navigate to Cabinet page. Verify the page renders
  7 position rows, all Vacant (cabinet seed is `{}`, page reads the
  POSITIONS array directly).
- Advance through 1772-1788 turns. Verify NO `2.3.1 appointment` log
  lines fire (era gating + early-return on `cabinetSeatsForYear(year)
  === []`).
- Advance into year 1789. Verify the first `2.3.1 appointment` lines
  fire — 4 seats fill (State, Treasury, War, AG). Verify Navy,
  Interior, PMG seats stay Vacant on the page.
- Continue to year 1798. Verify the next 2.3.1 fills the Navy seat
  (the +1 transition). Existing State / Treasury / War / AG seats
  stay seated (no re-fill).
- Continue to year 1829 (in a long playthrough, or via save-edit).
  Verify PMG seat fills.
- Continue to year 1849. Verify Interior seat fills.

**Save migration (verifies E-4):**

- Load a pre-PR5 save (a save from the merge-base commit). Verify the
  game loads without error. Open DevTools, inspect IndexedDB; verify
  the save's `cabinet` field has NO `KeyAdvisor` or `Admiral` keys
  after the first `repair()` pass.
- Verify any politician who pre-PR5 carried `currentOffice.type ===
  'KeyAdvisor'` now has `currentOffice = null` and shows up in the
  next 2.3.1 eligible pool.
- Verify the migration log line fires once in the console:
  `[migration] PR5: dropped legacy KeyAdvisor / Admiral fields...`.
- Re-load the save. Verify the migration log does NOT fire again
  (idempotency check).

**RevWar dashboard (verifies E-5):**

- 1772 scenario, advance to the Lexington & Concord era event; choose
  "Aid Massachusetts". Open the RevWar Dashboard. Verify the
  Commanders panel shows "Senior General: <name>" and "Senior
  Commodore: <name>" (NOT "Senior Admiral"). Verify the appointed
  Senior Commodore politician's `currentOffice` field on the Roster
  page is `null` (no Admiral office assignment — per E-5 deletion).

### Edge cases to verify manually (from spec § Edge cases)

- **Vacancy mid-game in a 1789+ AMPU run.** Existing death-handling
  routes through `vacateOffice` (`phaseRunners.ts:2330-2362`) which
  iterates `Object.keys(snap.game.cabinet)` — works for any cabinet
  key. The next 2.3.1 reads `cabinetSeatsForYear`, finds the seat in
  the active list, finds the cabinet slot is null, fills from the
  eligible pool.
- **A Sec dies the same turn they're confirmed.** Existing 2.4.1
  death handler runs after 2.3.1. The Sec fills the seat, dies, the
  vacancy is added back to `cabinet[seat] = null` via `vacateOffice`,
  the NEXT turn's 2.3.1 re-fills.
- **No eligible candidate for a seat.** `scored[0]?.p` returns
  `undefined`; the early `continue` keeps the seat null and re-fills
  next turn. The Lingering Phase `+0.2` bonus is skipped for that
  seat.
- **AG carrier in long 1856 run reaches 1870.** AG keeps its low-admin
  formula per spec AC #14. No mid-game transition logic.
- **A politician at age 75 holding a cabinet seat.** The age <75 filter
  in the rewritten runner gates ENTRY to the pool. A 76-year-old Sec
  keeps their seat until retirement / death (`2.4.1` handles age-out).

## Risks

Ordered, highest first.

1. **`OfficeType` union surgery cascade.** Dropping `KeyAdvisor` +
   `Admiral` cascades to **10 verified consumer sites** in 6 files (plus
   the 4 RevWar sites we're migrating to Commodore). The `as const
   satisfies` exhaustiveness on the consumer tables (`OFFICE_PRESTIGE`,
   `officeWeights`, `OFFICE_ADMIN_GRANT`, `OFFICE_EXPERTISE`, `CABINET_
   SEAT_SCORING`, `Seed.office` type union, the `POSITIONS` array,
   scenario seeds) ensures every miss is a compile error — but the
   builder must verify zero non-exhaustive consumer reads (e.g. a
   `switch` statement without a `default` case that doesn't list every
   `OfficeType` literal). Mitigation: `npm run build` runs `tsc -b`
   first; the cascade fails fast on any miss.

2. **Cross-party RNG implementation changes electoral feel.** PR5 ships
   the user's override (10% cross-party + -3 penalty), which is a
   net-NEW behavioral surface — pre-PR5 the cabinet was strictly same-
   party. Expected impact: ~10% of cabinet cycles per seat will open
   the cross-party door, and a small fraction of THOSE will actually
   land a cross-party pick (only when the out-party best-scorer beats
   the in-party best-scorer by more than 3 points). In practice this is
   a once-per-2-or-3-cabinet-cycles event in a long game. **Mitigation:**
   the `CABINET_CROSS_PARTY_RATE` constant is the tuning dial; if
   playtest reads it as too frequent or too rare, the architect can
   adjust at CP2 without a spec rework.

3. **Lingering Phase `+0.2` bonus stacking grows the per-turn meter
   budget.** Spec Assumption 3 says the total cap of `+1.4`/turn across
   4 meters is ~14% of the `[-5, +5]` range. In practice this means
   the `quality` meter (Interior + PMG stacking) can swing `+0.4`/turn
   when both seats fill with matched expertise; `military` (War + Navy
   stacking) same. Mitigation: the `0.2` constant lives in the
   `cabinetBonuses` block in `phaseRunners.ts:2990+`; if playtest reads
   meter inflation, the architect can lower to `0.1` at CP2.

4. **Save migration covers two distinct legacy fields with one block.**
   The `cabinet.KeyAdvisor` + `cabinet.Admiral` scrub uses a `as unknown
   as Record<string, ...>` cast to access the removed keys. If a future
   save schema change adds an unrelated string-keyed legacy field, the
   migration block must be expanded. Mitigation: the spec-defined
   migration is single-pass and idempotent; future PRs can extend the
   `legacyCabinetKeys` array.

5. **Rev War "Senior Admiral" → "Senior Commodore" rename is a save
   format break.** Any pre-PR5 save with an active Revolutionary War
   carries `revolutionaryWar.seniorAdmiralId` field; after PR5 that
   field is renamed to `seniorCommodoreId`. **The migration in `repair()`
   does NOT currently handle this rename.** *Architect call: add a
   small additional repair block for the RevWar field rename* —
   specified inline below as a Risk-mitigation addendum, NOT in the
   main migration block at E-4.

   **Addendum to E-4 (RevWar field rename migration):**
   ```ts
   // PR5: RevolutionaryWar field rename (seniorAdmiralId → seniorCommodoreId,
   // admiralIds → commodoreIds). Old saves with an active or completed war
   // persist the old field names; migrate.
   const war = s.game.revolutionaryWar as unknown as
     (RevolutionaryWar & { seniorAdmiralId?: string | null; admiralIds?: string[] }) | null;
   if (war) {
     if ('seniorAdmiralId' in war && war.seniorCommodoreId == null) {
       war.seniorCommodoreId = war.seniorAdmiralId ?? null;
       delete war.seniorAdmiralId;
       dirty = true;
     }
     if ('admiralIds' in war && (war.commodoreIds == null || war.commodoreIds.length === 0)) {
       war.commodoreIds = war.admiralIds ?? [];
       delete war.admiralIds;
       dirty = true;
     }
   }
   ```
   Append this immediately after the cabinet-scrub block from E-4.

6. **`OFFICE_PRESTIGE` weights for Navy=10 and Interior=8 are not
   playtest-tuned.** Per spec Assumption 7. These match the historical
   order-of-precedence (Navy parity with War, Interior parity with AG)
   but the PV impact on elections has not been measured. A Navy Sec
   with weighted-skill admin=2.5 + the Naval expertise bonus from
   `OFFICE_EXPERTISE` could read as too-strong in presidential PV-sort.
   Mitigation: tune at CP2 if playtest reveals.

7. **The `pendingCabinetVacancies` field stays unused.** Per architect
   recommendation on Tuning call #10 (leave as-is). Future PRs that
   wire death-to-vacancy may need to touch this field. PR5 does NOT
   risk regression on existing behavior; the field's defined-but-unused
   state is the status quo.

## Definition of done

- `npm run build` passes (`tsc -b && vite build`) and `npm run lint`
  (`tsc -b --noEmit`) is clean.
- `OfficeType` union drops `KeyAdvisor` + `Admiral`; adds
  `SecretaryOfNavy` + `SecretaryOfInterior`.
- `OFFICE_EXPERTISE` updated per spec + USER OVERRIDE (Interior →
  Agriculture).
- `OFFICE_PRESTIGE` adds Navy=10 + Interior=8; drops KeyAdvisor +
  Admiral.
- `officeWeights` switch cases updated.
- `OFFICE_ADMIN_GRANT` adds Navy + Interior; drops KeyAdvisor.
- New `cabinetSeatsForYear` helper + `CABINET_SEAT_SCORING` table +
  `CABINET_CROSS_PARTY_RATE` + `CABINET_CROSS_PARTY_PENALTY` constants
  in `src/types.ts`.
- New `scoreCabinetCandidate` helper in `phaseRunners.ts`.
- `runPhase_2_3_1_Cabinet` rewritten per E-1.
- `runPhase_2_3_2_Military` Admiral block deleted per E-2.
- `runPhase_2_5_1_Lingering` per-seat expertise bonus block added per
  E-3.
- `repair()` migration block added per E-4 + Risk-5 addendum.
- `revolutionaryWar.ts` Admiral → Commodore rename per E-5; `current
  Office = { type: 'Admiral' }` deletion at `:60`.
- `CabinetPage.tsx` POSITIONS array updated per Tuning #5.
- `RevWarDashboard.tsx` label + variable rename to Commodore.
- `scenario1772.ts` cabinet seed → `{}`.
- `scenario1856.ts` cabinet seed → 7 keys (no KeyAdvisor; + Navy +
  Interior).
- `politicians1856.ts` Seed.office type union updated.
- `phases.ts:19` description text updated to drop "and Admiral".
- 22 smoke tests pass.
- Playtest: 1856 scenario shows 6-seat fill on first 2.3.1; expertise
  markers in log; cross-party fires statistically over multiple
  cycles; meter bonuses fold into the combined delta. 1772 scenario
  shows era-transition fills at 1789 / 1798. Save migration scrubs
  legacy fields cleanly.

---

**Checkpoint summary (for approval):**

- **Approach:** types + engine + scenario-data + UI rewrite of the
  cabinet loop. New pure helpers `cabinetSeatsForYear(year)` (4
  transitions: 1789 / 1798 / 1829 / 1849) and `scoreCabinetCandidate
  (seat, p, scoring)` (composite formula). `OfficeType` surgery (drop
  KeyAdvisor + Admiral; add Navy + Interior). Per-seat scoring table
  with AG override (admin=0, governing=0, judicial=2). Cross-party
  RNG gate (10% per seat per cycle; `-3` score penalty). 2.5.1
  Lingering per-seat `+0.2` expertise-gated bonus. Save migration
  scrubs legacy cabinet fields + politician currentOffice. RevWar
  "Senior Admiral" renamed to "Senior Commodore" with the cabinet-
  office assignment dropped.
- **File-count delta:** 11 modified, 0 new (`types.ts`, `pv.ts`,
  `phaseRunners.ts`, `revolutionaryWar.ts`, `CabinetPage.tsx`,
  `RevWarDashboard.tsx`, `GameContext.tsx`, `scenario1772.ts`,
  `scenario1856.ts`, `politicians1856.ts`, `phases.ts`).
- **Tuning resolutions:** (1) Exact per-seat scoring weights filled
  per the architect's matrix (admin=0/1/2 ladder + secondary on
  legislative/military/judicial/backroom + flat +5 expertise bonus).
  (2) Cross-party: per-seat `chance(0.1)` from `src/rng.ts` at the
  TOP of each seat iteration; `-3` penalty added at score-compute
  time so the sorted tuple already reflects it; log line appends
  `(cross-party appointment)` when fired. (3) `cabinetSeatsForYear`
  lives in `src/types.ts` (not a new `src/engine/cabinet.ts` file);
  matches the existing `OFFICE_EXPERTISE` co-location pattern. (4)
  Era-transition mid-game handling: NO new code required — the
  existing runner reads `cabinetSeatsForYear` per cycle and fills
  vacancies automatically at year 1798 / 1829 / 1849. (5) CabinetPage
  POSITIONS array swap (drop KeyAdvisor + Admiral; add Navy +
  Interior in era-precedence order). (6) `repair()` migration block
  with `as unknown as Record<string, ...>` cast for legacy access. (7)
  RevWar.ts Admiral → Commodore RENAME (not drop) — historian-correct;
  `currentOffice = { type: 'Admiral' }` assignment at `:60` deleted.
  (8) `politicians1856.ts:16` Seed type union updates (drop Admiral;
  add Navy + Interior). (9) Lingering Phase block inserted after
  diplomacy drift, before nationalDebt; local `cabinetBonuses` array
  maps each seat to the locked meter. (10) `pendingCabinetVacancies`:
  leave as-is (architect rec a). (11) `labels.ts`: NO centralization
  — UI renders office-type strings directly.
- **Top balance risk:** Cross-party RNG implementation changes
  electoral feel — the user's override introduces a new behavioral
  surface that pre-PR5 didn't exist. Expected hit rate ~10% per seat
  per cycle, with actual cross-party pick fraction lower (only when
  out-party best-scorer beats in-party by 3+ points). Tune via
  `CABINET_CROSS_PARTY_RATE` constant at CP2.
- **Decided beyond the spec:** (a) **Per-seat scoring exact weights**
  authored per the matrix in section D (admin / governing / secondary
  with `legislative` for State, `military` for War / Navy, `judicial`
  for AG, `backroom` for PMG, none for Treasury / Interior; flat +5
  expertise bonus across all seats). (b) **Cross-party as
  per-seat-independent rolls** (not once-per-cycle for all seats);
  rationale: each seat-fill is a discrete presidential decision
  historically, not a single cabinet-wide pre-commitment. (c)
  **RevWar field rename to Commodore** (not drop) — historian
  endorses; UI label changes; `currentOffice` assignment deleted at
  `:60`. (d) **Save migration extended** to cover the RevWar field
  rename in addition to the cabinet scrub (Risk-5 addendum block). (e)
  **`phases.ts:19` description text fix** ("General in Chief and
  Admiral" → "General in Chief.") — one-line accuracy fix; not in
  spec but obvious given the Admiral drop.
- **Cross-party RNG implementation choice + 1-line example:**
  Per-seat-independent `chance(CABINET_CROSS_PARTY_RATE)` at the TOP
  of each `for (const seat of seats)` iteration; `-3` penalty layered
  in at score-compute time inside the `scored.map(...)` call.
  Example: `if (chance(0.1)) { /* relax same-party filter for THIS
  seat */ }` then `const score = formula(p) + (p.partyId !== partyId
  ? -3 : 0);`.

---

**Brief file:** `/home/user/AMPU/docs/briefs/cabinet-overhaul.md`
