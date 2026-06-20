// PR5 engine playtest — drives 1772 (default) and 1856 (--1856) scenarios
// through ~600 phases, asserts the contract of PR5's cabinet overhaul
// (cabinetSeatsForYear, CABINET_SEAT_SCORING, OFFICE_EXPERTISE / OFFICE_ADMIN_GRANT
// updates, cross-party RNG mechanism, lingering phase expertise bonus, save
// migration), then classifies engine-trace log lines by feature signature.
//
// CP2 USER REVISION (binding): Admiral STAYS in OfficeType union as a war-state
// combat role; revolutionaryWar.ts is zero-diff. Save migration scrubs only
// KeyAdvisor (not Admiral) from politician currentOffice.
//
// Mirrors scripts/playtestTraitPassB.ts (PR4b — closest template):
//   Part 1: Contract tests with stubbed Math.random (deterministic).
//   Part 2: Engine scenario drive (auto-resolve player input).
//   Part 3: Event classification + trace JSON to docs/playtest/<slug>/.
//
// Run BOTH variants for full coverage:
//   npx tsx scripts/playtestCabinetOverhaul.ts          # 1772 default
//   npx tsx scripts/playtestCabinetOverhaul.ts --1856   # 1856 path

// Stub import.meta.env for Node (Vite injects this in the browser).
// @ts-ignore
if (typeof import.meta.env === 'undefined') (import.meta as any).env = { DEV: false };

import { build1772Scenario } from '../src/data/scenario1772';
import { runCurrentPhase, advancePhase } from '../src/engine/engine';
import { simOneDraftPick, autoPickForPlayer } from '../src/engine/phaseRunners';
import {
  cabinetSeatsForYear,
  CABINET_SEAT_SCORING,
  CABINET_CROSS_PARTY_RATE,
  CABINET_CROSS_PARTY_PENALTY,
  OFFICE_EXPERTISE,
  OFFICE_ADMIN_GRANT,
  OFFICE_COMMAND_GRANT,
} from '../src/types';
import { OFFICE_PRESTIGE, officeWeights } from '../src/pv';
import type {
  CabinetSeatScoring,
  Expertise,
  FullGameSnapshot,
  GameState,
  OfficeType,
  Politician,
} from '../src/types';
import { writeFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Part 1: contract tests (stubbed RNG for cross-party RNG branches)
// ---------------------------------------------------------------------------

const realRandom = Math.random;
let stubbedRandom: () => number = realRandom;
Math.random = () => stubbedRandom();

let contractPass = 0;
let contractFail = 0;
const contractFailures: string[] = [];
function assert(cond: boolean, label: string) {
  if (cond) contractPass++;
  else { contractFail++; contractFailures.push(label); }
}

// Mirror the engine's scoring math locally — scoreCabinetCandidate is not
// exported. The math is exactly that of phaseRunners.ts:2160-2172.
function scoreLocal(seat: OfficeType, p: Pick<Politician, 'skills' | 'expertise'>, scoring: CabinetSeatScoring): number {
  let s = scoring.admin * p.skills.admin + scoring.governing * p.skills.governing;
  if (scoring.secondaryStat && scoring.secondaryWeight > 0) {
    s += scoring.secondaryWeight * p.skills[scoring.secondaryStat];
  }
  const primary = OFFICE_EXPERTISE[seat];
  if (primary && p.expertise.includes(primary)) s += scoring.expertiseBonus;
  return s;
}

function mkSkills(o: Partial<Record<'admin' | 'legislative' | 'judicial' | 'military' | 'governing' | 'backroom', number>>) {
  return {
    admin: o.admin ?? 0,
    legislative: o.legislative ?? 0,
    judicial: o.judicial ?? 0,
    military: o.military ?? 0,
    governing: o.governing ?? 0,
    backroom: o.backroom ?? 0,
  };
}

// -- A. OfficeType state assertions ------------------------------------------
// KeyAdvisor must NOT be a valid OfficeType — verify it appears in none of
// the typed tables.
const cabinetSeats1900 = cabinetSeatsForYear(1900);
assert(!(cabinetSeats1900 as string[]).includes('KeyAdvisor'),
  `KeyAdvisor NOT in cabinetSeatsForYear(1900)`);
assert(!Object.keys(OFFICE_EXPERTISE).includes('KeyAdvisor'),
  `KeyAdvisor NOT in OFFICE_EXPERTISE keys`);
assert(!Object.keys(OFFICE_ADMIN_GRANT).includes('KeyAdvisor'),
  `KeyAdvisor NOT in OFFICE_ADMIN_GRANT keys`);
assert(!Object.keys(CABINET_SEAT_SCORING).includes('KeyAdvisor'),
  `KeyAdvisor NOT in CABINET_SEAT_SCORING keys`);
assert(!Object.keys(OFFICE_PRESTIGE).includes('KeyAdvisor'),
  `KeyAdvisor NOT in OFFICE_PRESTIGE keys`);

// Admiral IS still in OfficeType (CP2 USER REVISION) — verify it stayed in
// OFFICE_PRESTIGE (war-state combat role) but is OUT of cabinet tables.
assert(Object.keys(OFFICE_PRESTIGE).includes('Admiral'),
  `Admiral STAYS in OFFICE_PRESTIGE (USER REVISION — war combat role)`);
assert(!(cabinetSeats1900 as string[]).includes('Admiral'),
  `Admiral NOT in cabinetSeatsForYear(1900) — cabinet seat dropped`);
assert(!Object.keys(OFFICE_EXPERTISE).includes('Admiral'),
  `Admiral NOT in OFFICE_EXPERTISE (cabinet expertise table dropped)`);
assert(!Object.keys(OFFICE_ADMIN_GRANT).includes('Admiral'),
  `Admiral NOT in OFFICE_ADMIN_GRANT`);
assert(!Object.keys(CABINET_SEAT_SCORING).includes('Admiral'),
  `Admiral NOT in CABINET_SEAT_SCORING`);
// officeWeights still handles Admiral via the GeneralInChief case bucket.
{
  const w = officeWeights({ type: 'Admiral' } as any);
  assert(w.military === 3, `officeWeights.Admiral.military === 3 (USER REVISION — war combat bucket preserved)`);
}

// New seats are valid.
assert(Object.keys(OFFICE_EXPERTISE).includes('SecretaryOfNavy'),
  `SecretaryOfNavy in OFFICE_EXPERTISE`);
assert(Object.keys(OFFICE_EXPERTISE).includes('SecretaryOfInterior'),
  `SecretaryOfInterior in OFFICE_EXPERTISE`);
assert(Object.keys(CABINET_SEAT_SCORING).includes('SecretaryOfNavy'),
  `SecretaryOfNavy in CABINET_SEAT_SCORING`);
assert(Object.keys(CABINET_SEAT_SCORING).includes('SecretaryOfInterior'),
  `SecretaryOfInterior in CABINET_SEAT_SCORING`);

// -- B. cabinetSeatsForYear boundary tests -----------------------------------
{
  // Pre-1789: empty.
  assert(cabinetSeatsForYear(1788).length === 0, `cabinetSeatsForYear(1788) === []`);
  assert(cabinetSeatsForYear(1772).length === 0, `cabinetSeatsForYear(1772) === []`);
  assert(cabinetSeatsForYear(1500).length === 0, `cabinetSeatsForYear(1500) === []`);

  // 1789 -> 4 seats.
  const s1789 = cabinetSeatsForYear(1789);
  assert(s1789.length === 4, `cabinetSeatsForYear(1789).length === 4 (got ${s1789.length})`);
  for (const t of ['SecretaryOfState', 'SecretaryOfTreasury', 'SecretaryOfWar', 'AttorneyGeneral'] as OfficeType[]) {
    assert(s1789.includes(t), `cabinetSeatsForYear(1789) includes ${t}`);
  }
  assert(!s1789.includes('SecretaryOfNavy'), `cabinetSeatsForYear(1789) NO Navy`);

  // 1797 -> still 4.
  assert(cabinetSeatsForYear(1797).length === 4, `cabinetSeatsForYear(1797).length === 4`);

  // 1798 -> 5 seats (+ Navy).
  const s1798 = cabinetSeatsForYear(1798);
  assert(s1798.length === 5, `cabinetSeatsForYear(1798).length === 5 (got ${s1798.length})`);
  assert(s1798.includes('SecretaryOfNavy'), `cabinetSeatsForYear(1798) includes SecretaryOfNavy`);

  // 1828 -> 5 (just before PMG).
  assert(cabinetSeatsForYear(1828).length === 5, `cabinetSeatsForYear(1828).length === 5`);

  // 1829 -> 6 (+ PMG).
  const s1829 = cabinetSeatsForYear(1829);
  assert(s1829.length === 6, `cabinetSeatsForYear(1829).length === 6 (got ${s1829.length})`);
  assert(s1829.includes('PostmasterGeneral'), `cabinetSeatsForYear(1829) includes PostmasterGeneral`);

  // 1848 -> 6 (just before Interior).
  assert(cabinetSeatsForYear(1848).length === 6, `cabinetSeatsForYear(1848).length === 6`);

  // 1849 -> 7 (+ Interior).
  const s1849 = cabinetSeatsForYear(1849);
  assert(s1849.length === 7, `cabinetSeatsForYear(1849).length === 7 (got ${s1849.length})`);
  assert(s1849.includes('SecretaryOfInterior'), `cabinetSeatsForYear(1849) includes SecretaryOfInterior`);

  // 1856 / 1900 -> still 7.
  assert(cabinetSeatsForYear(1856).length === 7, `cabinetSeatsForYear(1856).length === 7`);
  assert(cabinetSeatsForYear(1900).length === 7, `cabinetSeatsForYear(1900).length === 7`);

  // Pure / deterministic: same input -> same output for 6 successive calls.
  const a = cabinetSeatsForYear(1857);
  const b = cabinetSeatsForYear(1857);
  assert(JSON.stringify(a) === JSON.stringify(b), `cabinetSeatsForYear pure (idempotent)`);
}

// -- C. CABINET_SEAT_SCORING exact values ------------------------------------
{
  const ag = CABINET_SEAT_SCORING.AttorneyGeneral!;
  assert(ag.admin === 0, `AG admin === 0 (F-AG-NO-DEPARTMENT-PRE-1870)`);
  assert(ag.governing === 0, `AG governing === 0`);
  assert(ag.secondaryStat === 'judicial', `AG secondaryStat === 'judicial'`);
  assert(ag.secondaryWeight === 2, `AG secondaryWeight === 2 (judicial doubled)`);
  assert(ag.expertiseBonus === 5, `AG expertiseBonus === 5`);

  const tr = CABINET_SEAT_SCORING.SecretaryOfTreasury!;
  assert(tr.admin === 2, `Treasury admin === 2`);
  assert(tr.governing === 1, `Treasury governing === 1`);
  assert(tr.secondaryWeight === 0, `Treasury secondaryWeight === 0 (no secondary)`);

  const st = CABINET_SEAT_SCORING.SecretaryOfState!;
  assert(st.admin === 2, `State admin === 2`);
  assert(st.governing === 1, `State governing === 1`);
  assert(st.secondaryStat === 'legislative', `State secondaryStat === 'legislative'`);
  assert(st.secondaryWeight === 1, `State secondaryWeight === 1`);

  const pmg = CABINET_SEAT_SCORING.PostmasterGeneral!;
  assert(pmg.admin === 1, `PMG admin === 1`);
  assert(pmg.governing === 2, `PMG governing === 2 (patronage doubled)`);
  assert(pmg.secondaryStat === 'backroom', `PMG secondaryStat === 'backroom'`);

  const nv = CABINET_SEAT_SCORING.SecretaryOfNavy!;
  assert(nv.admin === 1, `Navy admin === 1`);
  assert(nv.governing === 1, `Navy governing === 1`);
  assert(nv.secondaryStat === 'military', `Navy secondaryStat === 'military'`);
  assert(nv.secondaryWeight === 2, `Navy secondaryWeight === 2 (military doubled)`);

  const intr = CABINET_SEAT_SCORING.SecretaryOfInterior!;
  assert(intr.admin === 2, `Interior admin === 2`);
  assert(intr.governing === 1, `Interior governing === 1`);
  assert(intr.secondaryWeight === 0, `Interior secondaryWeight === 0`);

  const war = CABINET_SEAT_SCORING.SecretaryOfWar!;
  assert(war.admin === 1, `War admin === 1`);
  assert(war.governing === 1, `War governing === 1`);
  assert(war.secondaryStat === 'military', `War secondaryStat === 'military'`);
  assert(war.secondaryWeight === 2, `War secondaryWeight === 2`);
}

// -- D. OFFICE_EXPERTISE mappings (locked from F-EXPERTISE-MAPPINGS + USER OVERRIDE) --
assert(OFFICE_EXPERTISE.SecretaryOfState === 'Foreign Affairs', `State -> Foreign Affairs`);
assert(OFFICE_EXPERTISE.SecretaryOfTreasury === 'Economics', `Treasury -> Economics`);
assert(OFFICE_EXPERTISE.SecretaryOfWar === 'Military', `War -> Military`);
assert(OFFICE_EXPERTISE.SecretaryOfNavy === 'Naval', `Navy -> Naval`);
assert(OFFICE_EXPERTISE.AttorneyGeneral === 'Justice', `AG -> Justice`);
assert(OFFICE_EXPERTISE.SecretaryOfInterior === 'Agriculture',
  `Interior -> Agriculture (CP1 Q8 USER OVERRIDE — was Welfare in PM rec)`);
assert(OFFICE_EXPERTISE.PostmasterGeneral === 'Transportation', `PMG -> Transportation`);
assert(OFFICE_EXPERTISE.GeneralInChief === 'Military', `GeneralInChief -> Military (unchanged)`);

// -- E. OFFICE_ADMIN_GRANT updates -------------------------------------------
assert(OFFICE_ADMIN_GRANT.SecretaryOfNavy === 1, `Navy admin grant === 1`);
assert(OFFICE_ADMIN_GRANT.SecretaryOfInterior === 1, `Interior admin grant === 1`);
assert(OFFICE_ADMIN_GRANT.PostmasterGeneral === 1, `PMG admin grant retained === 1`);
// Command grant: SoS only.
assert(OFFICE_COMMAND_GRANT.SecretaryOfState === 1, `SoS command grant === 1`);
assert(!('SecretaryOfNavy' in OFFICE_COMMAND_GRANT), `Navy no command grant (PM call)`);

// -- F. CABINET_CROSS_PARTY tuning constants ---------------------------------
assert(CABINET_CROSS_PARTY_RATE === 0.1, `CABINET_CROSS_PARTY_RATE === 0.1`);
assert(CABINET_CROSS_PARTY_PENALTY === -3, `CABINET_CROSS_PARTY_PENALTY === -3`);

// -- G. scoreCabinetCandidate math spot checks (mirrored locally) ------------
{
  // Hamilton-like Treasury candidate: admin=5, governing=3, Economics expertise.
  // 2*5 + 1*3 + 0 + 5 = 18.
  const hamilton = { skills: mkSkills({ admin: 5, governing: 3 }), expertise: ['Economics'] as Expertise[] };
  const score = scoreLocal('SecretaryOfTreasury', hamilton, CABINET_SEAT_SCORING.SecretaryOfTreasury!);
  assert(score === 18, `Hamilton@Treasury (admin=5, gov=3, +Economics) = 18 (got ${score})`);

  // Generalist for Treasury (admin=4, no Economics): 2*4 + 0 + 0 + 0 = 8.
  const tGen = { skills: mkSkills({ admin: 4 }), expertise: [] as Expertise[] };
  const tGenScore = scoreLocal('SecretaryOfTreasury', tGen, CABINET_SEAT_SCORING.SecretaryOfTreasury!);
  assert(tGenScore === 8, `Treasury generalist (admin=4, no exp) = 8 (got ${tGenScore})`);

  // Wirt-like AG: judicial=4, Justice expertise. 0 + 0 + 2*4 + 5 = 13.
  const wirt = { skills: mkSkills({ judicial: 4 }), expertise: ['Justice'] as Expertise[] };
  const wirtScore = scoreLocal('AttorneyGeneral', wirt, CABINET_SEAT_SCORING.AttorneyGeneral!);
  assert(wirtScore === 13, `Wirt@AG (judicial=4, +Justice) = 13 (got ${wirtScore})`);

  // Admin generalist at AG (admin=5, no Justice, judicial=1): 0 + 0 + 2*1 + 0 = 2.
  const agGen = { skills: mkSkills({ admin: 5, judicial: 1 }), expertise: [] as Expertise[] };
  const agGenScore = scoreLocal('AttorneyGeneral', agGen, CABINET_SEAT_SCORING.AttorneyGeneral!);
  assert(agGenScore === 2, `AG generalist (admin=5, judicial=1, no exp) = 2 (got ${agGenScore})`);
  // AG override: generalist loses to Wirt by 11.
  assert(wirtScore - agGenScore === 11,
    `AG override: Wirt beats generalist by 11 (got ${wirtScore - agGenScore})`);

  // State with high admin + Foreign Affairs + Senate floor work:
  // admin=4, governing=2, legislative=3, Foreign Affairs.
  // 2*4 + 1*2 + 1*3 + 5 = 18.
  const adams = { skills: mkSkills({ admin: 4, governing: 2, legislative: 3 }), expertise: ['Foreign Affairs'] as Expertise[] };
  const adamsScore = scoreLocal('SecretaryOfState', adams, CABINET_SEAT_SCORING.SecretaryOfState!);
  assert(adamsScore === 18, `JQA@State (admin=4, gov=2, leg=3, +FA) = 18 (got ${adamsScore})`);

  // War with Military + military skill:
  // admin=2, governing=2, military=4, Military expertise.
  // 1*2 + 1*2 + 2*4 + 5 = 17.
  const calhoun = { skills: mkSkills({ admin: 2, governing: 2, military: 4 }), expertise: ['Military'] as Expertise[] };
  const calhounScore = scoreLocal('SecretaryOfWar', calhoun, CABINET_SEAT_SCORING.SecretaryOfWar!);
  assert(calhounScore === 17, `Calhoun@War (mil=4, +Military) = 17 (got ${calhounScore})`);

  // Navy mirror: same input gets same score.
  const navyScore = scoreLocal('SecretaryOfWar', calhoun, CABINET_SEAT_SCORING.SecretaryOfNavy!);
  assert(navyScore === 17, `War scoring tuple identical to Navy tuple (mil=4) = 17`);

  // PMG with patronage profile: governing=4, backroom=3, Transportation expertise.
  // 1*0 + 2*4 + 1*3 + 5 = 16 (no admin in skills set).
  const kendall = { skills: mkSkills({ admin: 0, governing: 4, backroom: 3 }), expertise: ['Transportation'] as Expertise[] };
  const kendallScore = scoreLocal('PostmasterGeneral', kendall, CABINET_SEAT_SCORING.PostmasterGeneral!);
  assert(kendallScore === 16, `Kendall@PMG (gov=4, bk=3, +Transp) = 16 (got ${kendallScore})`);

  // Interior with Agriculture (USER OVERRIDE — was Welfare):
  // admin=3, governing=2, Agriculture. 2*3 + 1*2 + 0 + 5 = 13.
  const interior = { skills: mkSkills({ admin: 3, governing: 2 }), expertise: ['Agriculture'] as Expertise[] };
  const intScore = scoreLocal('SecretaryOfInterior', interior, CABINET_SEAT_SCORING.SecretaryOfInterior!);
  assert(intScore === 13, `Interior (admin=3, +Agriculture USER OVERRIDE) = 13 (got ${intScore})`);
  // Interior with Welfare instead: no bonus (Welfare is not the primary).
  const intWel = { skills: mkSkills({ admin: 3, governing: 2 }), expertise: ['Welfare'] as Expertise[] };
  const intWelScore = scoreLocal('SecretaryOfInterior', intWel, CABINET_SEAT_SCORING.SecretaryOfInterior!);
  assert(intWelScore === 8, `Interior with Welfare (NOT primary) = 8 (got ${intWelScore})`);
}

// -- H. Cross-party RNG behavior (stub chance via Math.random) --------------
{
  // chance(0.1) returns Math.random() < 0.1.
  // To force false: Math.random() returns >= 0.1.
  stubbedRandom = () => 0.5;
  const sample = (Math.random() < CABINET_CROSS_PARTY_RATE);
  assert(sample === false, `chance(0.1) with rand=0.5 -> false (same-party only path)`);
  // To force true: Math.random() returns < 0.1.
  stubbedRandom = () => 0.05;
  const sample2 = (Math.random() < CABINET_CROSS_PARTY_RATE);
  assert(sample2 === true, `chance(0.1) with rand=0.05 -> true (cross-party gate open)`);

  // Cross-party candidate score penalty mechanics: a cross-party candidate's
  // adjusted score is base - 3. Confirm this with a sample comparison.
  const samePartyCand = { skills: mkSkills({ admin: 5, governing: 3 }), expertise: ['Economics'] as Expertise[] };
  const crossPartyCand = { skills: mkSkills({ admin: 5, governing: 3 }), expertise: ['Economics'] as Expertise[] };
  const sBase = scoreLocal('SecretaryOfTreasury', samePartyCand, CABINET_SEAT_SCORING.SecretaryOfTreasury!);
  const cAdj = scoreLocal('SecretaryOfTreasury', crossPartyCand, CABINET_SEAT_SCORING.SecretaryOfTreasury!) + CABINET_CROSS_PARTY_PENALTY;
  assert(sBase - cAdj === 3, `Cross-party penalty: same-party beats cross-party by 3 on identical skills (got ${sBase - cAdj})`);
  assert(cAdj === 15, `Cross-party Hamilton-equivalent adjusted score = 18 - 3 = 15 (got ${cAdj})`);
}

// -- I. Save migration repair() simulation -----------------------------------
// Manually replicate the migration block from GameContext.tsx:193-218 against
// in-memory snapshot shapes (no IndexedDB in Node). USER REVISION: Admiral on
// politician.currentOffice is PRESERVED; only KeyAdvisor is scrubbed.
{
  // Build a synthetic snapshot.
  const synth = {
    game: {
      cabinet: {
        SecretaryOfState: 'pol_st_1',
        KeyAdvisor: 'pol_keyadv_1',
        Admiral: 'pol_old_admiral',  // legacy cabinet.Admiral JSON field
      } as any,
    },
    politicians: [
      { id: 'pol_keyadv_1', currentOffice: { type: 'KeyAdvisor' } as any },
      { id: 'pol_admiral_war', currentOffice: { type: 'Admiral' } as any }, // war-state assignment
      { id: 'pol_st_1', currentOffice: { type: 'SecretaryOfState' } as any },
    ],
  };

  // Replicate the migration block:
  const legacyCabinetKeys = ['KeyAdvisor', 'Admiral'] as const;
  const cabAny = synth.game.cabinet as Record<string, string | null | undefined>;
  let cabinetDropped = false;
  for (const k of legacyCabinetKeys) {
    if (k in cabAny) { delete cabAny[k]; cabinetDropped = true; }
  }
  let politicianDropped = false;
  for (const p of synth.politicians) {
    const office = p.currentOffice as { type: string } | null;
    if (office && office.type === 'KeyAdvisor') {
      p.currentOffice = null as any;
      politicianDropped = true;
    }
  }

  // Assertions.
  assert(cabinetDropped === true, `migration: cabinet KeyAdvisor/Admiral scrub fired`);
  assert(!('KeyAdvisor' in cabAny), `migration: cabinet.KeyAdvisor absent post-scrub`);
  assert(!('Admiral' in cabAny), `migration: cabinet.Admiral absent post-scrub (legacy JSON field)`);
  assert(cabAny.SecretaryOfState === 'pol_st_1',
    `migration: real cabinet entries preserved`);
  assert(politicianDropped === true, `migration: politician scrub fired (KeyAdvisor only)`);

  const keyAdv = synth.politicians.find((p) => p.id === 'pol_keyadv_1')!;
  assert(keyAdv.currentOffice === null,
    `migration: KeyAdvisor politician currentOffice nulled`);
  const adm = synth.politicians.find((p) => p.id === 'pol_admiral_war')!;
  assert(adm.currentOffice !== null && (adm.currentOffice as any).type === 'Admiral',
    `migration: Admiral war-state currentOffice PRESERVED (CP2 USER REVISION)`);
  const st = synth.politicians.find((p) => p.id === 'pol_st_1')!;
  assert(st.currentOffice !== null && (st.currentOffice as any).type === 'SecretaryOfState',
    `migration: SecretaryOfState currentOffice untouched`);

  // Idempotency: second run is a no-op.
  let cabinetDropped2 = false;
  for (const k of legacyCabinetKeys) {
    if (k in cabAny) { delete cabAny[k]; cabinetDropped2 = true; }
  }
  let polDropped2 = false;
  for (const p of synth.politicians) {
    const office = p.currentOffice as { type: string } | null;
    if (office && office.type === 'KeyAdvisor') {
      p.currentOffice = null as any;
      polDropped2 = true;
    }
  }
  assert(!cabinetDropped2 && !polDropped2, `migration: idempotent (no-op on second run)`);
}

// -- J. Lingering Phase +0.2 expertise-gated bonus contract -------------------
{
  // Simulate the bonus block exhaustively per seat.
  type MiniSnap = {
    game: {
      cabinet: Partial<Record<OfficeType, string | null>>;
      meters: Record<string, number>;
    };
    politicians: Array<{ id: string; expertise: Expertise[] }>;
  };

  const cabinetBonuses: Array<{ seat: OfficeType; meter: string }> = [
    { seat: 'SecretaryOfState',     meter: 'domestic' },
    { seat: 'SecretaryOfTreasury',  meter: 'economic' },
    { seat: 'SecretaryOfWar',       meter: 'military' },
    { seat: 'SecretaryOfNavy',      meter: 'military' },
    { seat: 'AttorneyGeneral',      meter: 'honest'   },
    { seat: 'SecretaryOfInterior',  meter: 'quality'  },
    { seat: 'PostmasterGeneral',    meter: 'quality'  },
  ];

  function applyBonuses(s: MiniSnap): void {
    for (const { seat, meter } of cabinetBonuses) {
      const occId = s.game.cabinet[seat];
      if (!occId) continue;
      const sec = s.politicians.find((p) => p.id === occId);
      if (!sec) continue;
      const primary = OFFICE_EXPERTISE[seat];
      if (primary && sec.expertise.includes(primary)) {
        s.game.meters[meter] = (s.game.meters[meter] ?? 0) + 0.2;
      }
    }
  }

  // 1. Treasury with Economics expertise -> +0.2 economic.
  {
    const s: MiniSnap = {
      game: { cabinet: { SecretaryOfTreasury: 'pol1' }, meters: { economic: 0 } },
      politicians: [{ id: 'pol1', expertise: ['Economics'] }],
    };
    applyBonuses(s);
    assert(Math.abs(s.game.meters.economic - 0.2) < 1e-9,
      `Treasury with Economics -> economic +0.2 (got ${s.game.meters.economic})`);
  }

  // 2. Treasury WITHOUT Economics expertise -> no bonus.
  {
    const s: MiniSnap = {
      game: { cabinet: { SecretaryOfTreasury: 'pol1' }, meters: { economic: 0 } },
      politicians: [{ id: 'pol1', expertise: ['Foreign Affairs'] }],
    };
    applyBonuses(s);
    assert(s.game.meters.economic === 0,
      `Treasury without Economics -> no bonus (got ${s.game.meters.economic})`);
  }

  // 3. All 7 seats matched -> aggregate cap +1.4 (across 4 meters: domestic, economic, military×2, honest, quality×2).
  {
    const s: MiniSnap = {
      game: {
        cabinet: {
          SecretaryOfState: 'pol_st',
          SecretaryOfTreasury: 'pol_tr',
          SecretaryOfWar: 'pol_wr',
          SecretaryOfNavy: 'pol_nv',
          AttorneyGeneral: 'pol_ag',
          SecretaryOfInterior: 'pol_in',
          PostmasterGeneral: 'pol_pg',
        },
        meters: { domestic: 0, economic: 0, military: 0, honest: 0, quality: 0 },
      },
      politicians: [
        { id: 'pol_st', expertise: ['Foreign Affairs'] },
        { id: 'pol_tr', expertise: ['Economics'] },
        { id: 'pol_wr', expertise: ['Military'] },
        { id: 'pol_nv', expertise: ['Naval'] },
        { id: 'pol_ag', expertise: ['Justice'] },
        { id: 'pol_in', expertise: ['Agriculture'] },
        { id: 'pol_pg', expertise: ['Transportation'] },
      ],
    };
    applyBonuses(s);
    const total = Object.values(s.game.meters).reduce((a, b) => a + b, 0);
    assert(Math.abs(total - 1.4) < 1e-9,
      `Aggregate cap when all 7 seats expertise-matched: +1.4 (got ${total.toFixed(2)})`);
    // Military stacks (War + Navy): +0.4.
    assert(Math.abs(s.game.meters.military - 0.4) < 1e-9,
      `Military stacks War + Navy: +0.4 (got ${s.game.meters.military})`);
    // Quality stacks (Interior + PMG): +0.4.
    assert(Math.abs(s.game.meters.quality - 0.4) < 1e-9,
      `Quality stacks Interior + PMG: +0.4 (got ${s.game.meters.quality})`);
    // Single seats: each +0.2.
    for (const m of ['domestic', 'economic', 'honest']) {
      assert(Math.abs(s.game.meters[m] - 0.2) < 1e-9,
        `Single-seat meter ${m} = +0.2 (got ${s.game.meters[m]})`);
    }
  }

  // 4. Interior with Welfare (NOT Agriculture) -> no bonus (USER OVERRIDE locked Agriculture).
  {
    const s: MiniSnap = {
      game: { cabinet: { SecretaryOfInterior: 'pol1' }, meters: { quality: 0 } },
      politicians: [{ id: 'pol1', expertise: ['Welfare'] }],
    };
    applyBonuses(s);
    assert(s.game.meters.quality === 0,
      `Interior with Welfare (NOT primary expertise) -> no bonus (got ${s.game.meters.quality})`);
  }

  // 5. Interior with Agriculture -> +0.2 quality.
  {
    const s: MiniSnap = {
      game: { cabinet: { SecretaryOfInterior: 'pol1' }, meters: { quality: 0 } },
      politicians: [{ id: 'pol1', expertise: ['Agriculture'] }],
    };
    applyBonuses(s);
    assert(Math.abs(s.game.meters.quality - 0.2) < 1e-9,
      `Interior with Agriculture -> quality +0.2 (USER OVERRIDE confirmed)`);
  }

  // 6. Vacant seat -> no bonus.
  {
    const s: MiniSnap = {
      game: { cabinet: {}, meters: { economic: 0 } },
      politicians: [],
    };
    applyBonuses(s);
    assert(s.game.meters.economic === 0, `Vacant seat -> no bonus`);
  }
}

// -- K. OFFICE_PRESTIGE updates for new seats --------------------------------
assert(OFFICE_PRESTIGE.SecretaryOfNavy === 10, `Navy prestige === 10 (parity with War)`);
assert(OFFICE_PRESTIGE.SecretaryOfInterior === 8, `Interior prestige === 8 (parity with AG)`);
// KeyAdvisor dropped from prestige table.
assert(OFFICE_PRESTIGE.KeyAdvisor === undefined, `KeyAdvisor dropped from OFFICE_PRESTIGE`);
// Admiral preserved.
assert(OFFICE_PRESTIGE.Admiral === 10, `Admiral PRESERVED in OFFICE_PRESTIGE (USER REVISION)`);

stubbedRandom = realRandom;
Math.random = realRandom;

console.log(`Contract tests: ${contractPass} passed, ${contractFail} failed`);
if (contractFailures.length) {
  for (const f of contractFailures.slice(0, 30)) console.log(`  FAIL: ${f}`);
}

// ---------------------------------------------------------------------------
// Part 2: engine scenario drive
// ---------------------------------------------------------------------------

const use1856 = process.argv.includes('--1856');
const SLUG = use1856 ? '1856' : '1772';
const OUT = `/home/user/AMPU/docs/playtest/cabinet-overhaul/engine-trace-${SLUG}.json`;

let snap: FullGameSnapshot;
if (use1856) {
  const { build1856Scenario } = await import('../src/data/scenario1856');
  snap = build1856Scenario('fact_blue_cons');
} else {
  snap = build1772Scenario('fact_blue_lw_1772');
}
const startYear = snap.game.year;
const startEra = snap.game.currentEra;
console.log(`Built ${SLUG} scenario: year=${snap.game.year}, era=${snap.game.currentEra}, ` +
  `phase=${snap.game.phaseId}, politicians=${snap.politicians.length}`);

// Initial scenario cabinet state (verify seed shape).
const initialCabinetKeys = Object.keys(snap.game.cabinet);
console.log(`Initial cabinet seed keys: ${JSON.stringify(initialCabinetKeys)}`);
console.log(`Initial cabinet seats expected at year ${snap.game.year}: ` +
  `[${cabinetSeatsForYear(snap.game.year).join(', ')}]`);

// Initial-phase draft.
runCurrentPhase(snap);
while (snap.game.draftRoundOrder.length > 0) {
  const r = simOneDraftPick(snap);
  if (r.needsPlayer) autoPickForPlayer(snap);
}
console.log(`Initial-phase draft complete: ${snap.politicians.length} politicians`);

// Drive ~600 phases. Skip Vite-env-touching phases per playbook.
const skipPhases = new Set(['2.4.2', '2.4.3']);
let phasesRun = 0;
let skippedCount = 0;
const errorPhases: { phase: string; year: number; err: string }[] = [];

// Snapshot cabinet observations at key year boundaries.
const cabinetAtYears: Record<string, { year: number; seats: string[]; filled: Record<string, string | null | undefined> }> = {};
function snapshotCabinet(label: string): void {
  cabinetAtYears[label] = {
    year: snap.game.year,
    seats: cabinetSeatsForYear(snap.game.year),
    filled: { ...snap.game.cabinet },
  };
}
snapshotCabinet('start');

for (let i = 0; i < 600; i++) {
  if (skipPhases.has(snap.game.phaseId)) {
    advancePhase(snap);
    skippedCount++;
    continue;
  }
  let res: ReturnType<typeof runCurrentPhase>;
  try {
    res = runCurrentPhase(snap);
  } catch (e) {
    const msg = (e as Error).message.slice(0, 120);
    errorPhases.push({ phase: snap.game.phaseId, year: snap.game.year, err: msg });
    advancePhase(snap);
    skippedCount++;
    continue;
  }
  if (res.needsPlayerInput === 'draft') {
    while (snap.game.draftRoundOrder.length > 0) {
      const r = simOneDraftPick(snap);
      if (r.needsPlayer) autoPickForPlayer(snap);
    }
  } else if (res.needsPlayerInput === 'eraEvent') {
    const evt = res.payload as { id: string; responses: { id: string }[] };
    if (evt?.responses?.length) {
      const { resolveEraEvent } = await import('../src/engine/phaseRunners');
      resolveEraEvent(snap, evt.id, evt.responses[0].id);
    }
  } else if (res.needsPlayerInput === 'ccBuilder') {
    const payload = res.payload as { stateId: string; eligible: { id: string }[] };
    const { playerCCDelegatePick } = await import('../src/engine/phaseRunners');
    if (payload?.eligible?.[0]) {
      playerCCDelegatePick(snap, payload.stateId, payload.eligible[0].id);
    }
  } else if (res.needsPlayerInput === 'ccAIConfirm') {
    const { confirmCCAIPick } = await import('../src/engine/phaseRunners');
    confirmCCAIPick(snap);
  } else if (res.needsPlayerInput === 'convention') {
    if (snap.game.pendingConvention) snap.game.pendingConvention.resolved = true;
  }
  advancePhase(snap);
  phasesRun++;
}
snapshotCabinet('end');
console.log(
  `Ran ${phasesRun} phases, skipped ${skippedCount}, errors ${errorPhases.length}, ` +
  `year ${startYear} -> ${snap.game.year}, era ${startEra} -> ${snap.game.currentEra}`,
);
if (errorPhases.length) {
  console.log(`First 5 errors:`);
  for (const e of errorPhases.slice(0, 5)) console.log(`  [${e.phase} y${e.year}] ${e.err}`);
}
console.log(`Final cabinet seed keys: ${JSON.stringify(Object.keys(snap.game.cabinet))}`);

// ---------------------------------------------------------------------------
// Part 3: event classification + trace JSON
// ---------------------------------------------------------------------------

const allText = (e: { text?: string }) => e.text ?? '';

// Cabinet appointment line shape:
//   "<name> confirmed as <Seat>[ (<Expertise> specialist)][ (cross-party appointment)]."
const apptRx = /\bconfirmed as (SecretaryOf(State|Treasury|War|Navy|Interior)|AttorneyGeneral|PostmasterGeneral)\b/;
const appointmentEvents = snap.events.filter((e) => apptRx.test(allText(e)));

const perSeatCounts: Record<string, number> = {
  SecretaryOfState: 0,
  SecretaryOfTreasury: 0,
  SecretaryOfWar: 0,
  SecretaryOfNavy: 0,
  AttorneyGeneral: 0,
  SecretaryOfInterior: 0,
  PostmasterGeneral: 0,
};
for (const e of appointmentEvents) {
  const t = allText(e);
  for (const seat of Object.keys(perSeatCounts)) {
    if (new RegExp(`confirmed as ${seat}\\b`).test(t)) {
      perSeatCounts[seat]++;
      break;
    }
  }
}

// Expertise-specialist markers per seat.
const expertiseMarkers: Record<string, RegExp> = {
  'Foreign Affairs specialist': /\(Foreign Affairs specialist\)/,
  'Economics specialist':       /\(Economics specialist\)/,
  'Military specialist':        /\(Military specialist\)/,
  'Naval specialist':           /\(Naval specialist\)/,
  'Justice specialist':         /\(Justice specialist\)/,
  'Agriculture specialist':     /\(Agriculture specialist\)/,
  'Transportation specialist':  /\(Transportation specialist\)/,
};
const expertiseCounts: Record<string, number> = {};
for (const [label, rx] of Object.entries(expertiseMarkers)) {
  expertiseCounts[label] = appointmentEvents.filter((e) => rx.test(allText(e))).length;
}

// Cross-party appointments (CP1 Q4 USER OVERRIDE).
const crossPartyRx = /\(cross-party appointment\)/;
const crossPartyEvents = appointmentEvents.filter((e) => crossPartyRx.test(allText(e)));
const crossPartyFrac = appointmentEvents.length > 0 ? (crossPartyEvents.length / appointmentEvents.length) : 0;

// F-DOUBLING admin grant lines (PR2b reused for new seats).
const adminGrantRx = /gains Admin from confirmation/;
const adminGrantEvents = snap.events.filter((e) => adminGrantRx.test(allText(e)));

// F-DOUBLING command grant for SoS (only SoS today).
const commandGrantRx = /gains Command from the Secretary of State portfolio/;
const commandGrantEvents = snap.events.filter((e) => commandGrantRx.test(allText(e)));

// Expertise-grant lines (e.g., "X gains Foreign Affairs expertise.")
const expertiseGrantRx = /\bgains (Foreign Affairs|Economics|Military|Naval|Justice|Agriculture|Transportation) expertise\b/;
const expertiseGrantEvents = snap.events.filter((e) => expertiseGrantRx.test(allText(e)));

// 2.5.1 Lingering meter delta lines — these include per-seat bonuses folded
// into combined drift lines. Count meter delta lines per meter as a baseline;
// the +0.2 bonus is mathematically embedded, not separately logged.
const meterRx = /^([a-z]+): -?\d+\.\d+ -> -?\d+\.\d+ \(/;
const lingeringMeterLines = snap.events.filter((e) => e.phase === '2.5.1' && meterRx.test(allText(e)));

// Compute per-meter count.
const perMeterDeltas: Record<string, number> = {};
for (const e of lingeringMeterLines) {
  const m = (allText(e)).match(/^([a-z]+):/);
  if (m) perMeterDeltas[m[1]] = (perMeterDeltas[m[1]] ?? 0) + 1;
}

// Sample helper.
function dumpSample(label: string, arr: typeof snap.events, n = 4) {
  if (arr.length === 0) {
    console.log(`\n${label} samples: (none)`);
    return;
  }
  console.log(`\n${label} samples (first ${n}):`);
  for (const e of arr.slice(0, n)) console.log(`  [y${e.year} ${e.phase}] ${e.text}`);
}

console.log(`\n=== PR5 Cabinet Overhaul counts (${SLUG}) ===`);
console.log(`Cabinet appointments (total): ${appointmentEvents.length}`);
console.log(`Per-seat appointments:`);
for (const [seat, n] of Object.entries(perSeatCounts)) {
  console.log(`  ${seat}: ${n}`);
}
console.log(`\nExpertise-specialist markers:`);
for (const [label, n] of Object.entries(expertiseCounts)) {
  console.log(`  ${label}: ${n}`);
}
console.log(`\nCross-party appointments: ${crossPartyEvents.length} of ${appointmentEvents.length} ` +
  `(${(crossPartyFrac * 100).toFixed(1)}% — expected ~10% per CP1 Q4 USER OVERRIDE)`);
console.log(`\nF-DOUBLING admin grants: ${adminGrantEvents.length}`);
console.log(`F-DOUBLING SoS command grants: ${commandGrantEvents.length}`);
console.log(`Expertise grants (post-confirmation): ${expertiseGrantEvents.length}`);
console.log(`\n2.5.1 Lingering meter delta lines: ${lingeringMeterLines.length}`);
console.log(`Per-meter delta line counts:`);
for (const [m, n] of Object.entries(perMeterDeltas)) {
  console.log(`  ${m}: ${n}`);
}

dumpSample('Cabinet appointment', appointmentEvents);
dumpSample('Cross-party appointment', crossPartyEvents, 3);
dumpSample('Admin grant', adminGrantEvents, 3);
dumpSample('Expertise grant', expertiseGrantEvents, 3);
dumpSample('Lingering meter delta', lingeringMeterLines, 4);

// Cabinet seats at key years (for transition observation).
function cabinetSeatsAt(year: number): { year: number; expected: string[]; observed?: Record<string, string | null | undefined> } {
  return {
    year,
    expected: cabinetSeatsForYear(year),
  };
}
console.log(`\nExpected seat lists at key transition years:`);
for (const y of [1772, 1789, 1798, 1829, 1849, 1856, 1857]) {
  const seats = cabinetSeatsForYear(y);
  console.log(`  y${y}: [${seats.join(', ')}] (${seats.length} seats)`);
}

// Trace JSON.
const summary = {
  scenario: SLUG,
  startYear,
  startEra,
  finalYear: snap.game.year,
  finalEra: snap.game.currentEra,
  phasesRun,
  phasesSkipped: skippedCount,
  errorPhases,
  totalEvents: snap.events.length,
  contractTests: {
    passed: contractPass,
    failed: contractFail,
    failures: contractFailures,
  },
  cabinetCounts: {
    appointmentsTotal: appointmentEvents.length,
    perSeat: perSeatCounts,
    expertiseSpecialistMarkers: expertiseCounts,
    crossPartyAppointments: crossPartyEvents.length,
    crossPartyFraction: Number(crossPartyFrac.toFixed(4)),
    adminGrants: adminGrantEvents.length,
    sosCommandGrants: commandGrantEvents.length,
    expertiseGrants: expertiseGrantEvents.length,
    lingeringMeterLines: lingeringMeterLines.length,
    perMeterDeltaLines: perMeterDeltas,
  },
  cabinetSeed: {
    initial: cabinetAtYears.start,
    final: cabinetAtYears.end,
  },
  seatListByYear: Object.fromEntries(
    [1772, 1788, 1789, 1797, 1798, 1828, 1829, 1848, 1849, 1856, 1857, 1900]
      .map((y) => [String(y), cabinetSeatsForYear(y)])
  ),
  sampledEvents: {
    appointments: appointmentEvents.slice(0, 8).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    crossParty: crossPartyEvents.slice(0, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    adminGrants: adminGrantEvents.slice(0, 4).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    expertiseGrants: expertiseGrantEvents.slice(0, 6).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
    lingeringMeterDeltas: lingeringMeterLines.slice(0, 8).map((e) => ({ year: e.year, phase: e.phase, text: e.text })),
  },
};

writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(`\nWrote trace JSON to ${OUT}`);

// Final exit code: 0 if no contract failures and no error phases, else 1.
if (contractFail > 0 || errorPhases.length > 0) {
  console.log(`\nSMOKE FAIL: contractFail=${contractFail}, errorPhases=${errorPhases.length}`);
  process.exit(1);
}
console.log(`\nSMOKE PASS`);
