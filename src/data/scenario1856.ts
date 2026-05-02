import type { FullGameSnapshot, GameState, State, Politician, Enthusiasm, NationalMeters, InterestGroupScores } from '../types';
import { STATES_1856 } from './states1856';
import { FACTIONS_1856, PARTIES_1856, INTEREST_GROUPS } from './factions1856';
import { buildPoliticians1856, buildFillerPoliticians } from './politicians1856';
import { refreshPv } from '../pv';
import { IDEOLOGY_ORDER } from '../types';

const STARTING_METERS: NationalMeters = {
  revenue: 0,
  economic: 1,
  military: -1,
  domestic: -2,
  honest: 0,
  quality: 0,
  planet: 4,
};

function buildEnthusiasm(): Enthusiasm {
  const ent: Enthusiasm = {} as Enthusiasm;
  for (const ideo of IDEOLOGY_ORDER) {
    let blue = 0, red = 0;
    if (ideo === 'Traditionalist' || ideo === 'RW Populist') { blue = 3; red = -2; }
    else if (ideo === 'Conservative') { blue = 2; red = 1; }
    else if (ideo === 'Moderate') { blue = 1; red = 1; }
    else if (ideo === 'Liberal') { blue = -1; red = 2; }
    else if (ideo === 'Progressive') { blue = -2; red = 3; }
    else if (ideo === 'LW Populist') { blue = -3; red = 3; }
    ent[ideo] = { BLUE: blue, RED: red };
  }
  return ent;
}

function buildInterestScores(): InterestGroupScores {
  const out: InterestGroupScores = {};
  for (const g of INTEREST_GROUPS) out[g] = 0;
  out.Abolitionists = 2;
  out.Planters = 4;
  out.Manufacturers = 2;
  out.Workers = 0;
  out.Settlers = 1;
  return out;
}

export function build1856Scenario(playerFactionId: string): FullGameSnapshot {
  // Build politicians
  let politicians: Politician[] = buildPoliticians1856();
  // Add filler politicians for Senate, House, Governors
  const factionIds = FACTIONS_1856.map((f) => f.id);
  const fillers = buildFillerPoliticians(1856, 240, factionIds);
  politicians = [...politicians, ...fillers];

  // Assign Senators (2 per state * 31 = 62)
  const states: State[] = STATES_1856.map((s) => ({
    ...s,
    governorId: null,
    senators: [],
    representativeIds: [],
  }));

  // Assign two senators per state from politicians of relevant party. Use existing senators first.
  const usedAsSenator = new Set<string>();
  const usedAsRep = new Set<string>();
  const usedAsGovernor = new Set<string>();

  // First, place historical senators in their state
  for (const p of politicians) {
    if (p.currentOffice?.type === 'Senator') {
      const s = states.find((st) => st.id === p.state);
      if (s && s.senators.length < 2) {
        s.senators.push({ politicianId: p.id, classId: (s.senators.length + 1) as 1 | 2 });
        usedAsSenator.add(p.id);
      }
    }
  }
  // Fill remaining senate seats with filler from same-region party-leaning fillers
  for (const s of states) {
    while (s.senators.length < 2) {
      const candidates = politicians.filter(
        (p) => !usedAsSenator.has(p.id) && !usedAsRep.has(p.id) && !p.currentOffice && p.factionId
      );
      if (candidates.length === 0) break;
      // prefer politicians from same state, but accept any
      const pref = candidates.find((c) => c.state === s.id) ?? candidates[Math.floor(Math.random() * candidates.length)];
      pref.state = s.id;
      pref.currentOffice = { type: 'Senator', stateId: s.id };
      s.senators.push({ politicianId: pref.id, classId: (s.senators.length + 1) as 1 | 2 | 3 });
      usedAsSenator.add(pref.id);
    }
  }

  // Assign Representatives proportional to electoral votes (rough)
  for (const s of states) {
    const reps = Math.max(1, s.electoralVotes - 2); // EVs = reps + 2 senators
    while (s.representativeIds.length < reps) {
      const candidates = politicians.filter(
        (p) => !usedAsSenator.has(p.id) && !usedAsRep.has(p.id) && !p.currentOffice && p.factionId
      );
      if (candidates.length === 0) break;
      const pref = candidates.find((c) => c.state === s.id) ?? candidates[Math.floor(Math.random() * candidates.length)];
      pref.state = s.id;
      pref.currentOffice = { type: 'Representative', stateId: s.id };
      s.representativeIds.push(pref.id);
      usedAsRep.add(pref.id);
    }
  }

  // Assign Governors
  for (const s of states) {
    const candidates = politicians.filter(
      (p) => !usedAsSenator.has(p.id) && !usedAsRep.has(p.id) && !usedAsGovernor.has(p.id) && !p.currentOffice && p.factionId
    );
    if (candidates.length === 0) continue;
    const pref = candidates.find((c) => c.state === s.id) ?? candidates[Math.floor(Math.random() * candidates.length)];
    pref.state = s.id;
    pref.currentOffice = { type: 'Governor', stateId: s.id };
    s.governorId = pref.id;
    usedAsGovernor.add(pref.id);
  }

  // Mark factions: player owns the chosen faction
  const factions = FACTIONS_1856.map((f) => ({ ...f, isPlayer: f.id === playerFactionId }));

  // President / VP setup
  const president = politicians.find((p) => p.currentOffice?.type === 'President');
  const vp = politicians.find((p) => p.currentOffice?.type === 'VicePresident');

  // Cabinet from existing seeds
  const cabinet = {
    SecretaryOfState: politicians.find((p) => p.currentOffice?.type === 'SecretaryOfState')?.id ?? null,
    SecretaryOfTreasury: null,
    SecretaryOfWar: null,
    AttorneyGeneral: null,
    PostmasterGeneral: null,
    KeyAdvisor: null,
  } as GameState['cabinet'];

  const supremeCourtIds = politicians.filter((p) => p.currentOffice?.type === 'AssociateJustice').map((p) => p.id);
  const chief = politicians.find((p) => p.currentOffice?.type === 'ChiefJustice');

  const generalInChief = politicians.find((p) => p.currentOffice?.type === 'GeneralInChief');
  cabinet.GeneralInChief = generalInChief?.id ?? null;

  // Initial PV
  politicians = refreshPv(politicians);

  const game: GameState = {
    id: 'game',
    scenarioId: '1856',
    year: 1856,
    startYear: 1856,
    phaseIndex: 0,
    phaseId: '2.1.2', // start past draft for first turn (rookie crop already included)
    playerFactionId,
    presidentId: president?.id ?? null,
    vicePresidentId: vp?.id ?? null,
    meters: STARTING_METERS,
    partyPreference: -0.5,
    enthusiasm: buildEnthusiasm(),
    interestGroups: buildInterestScores(),
    nationalDebt: 32_000_000,
    diplomacy: { Britain: 1, France: 1, Spain: -1, Mexico: -2, Russia: 0 },
    wars: [],
    pendingEraEvents: [],
    pendingCabinetVacancies: [],
    pendingDraftPool: [],
    draftRoundOrder: [],
    cabinet,
    speakerId: null,
    proTemId: null,
    committeeChairs: { Domestic: null, Foreign: null, Economic: null, Justice: null },
    supremeCourtIds,
    chiefJusticeId: chief?.id ?? null,
    pendingLegislation: [],
    pendingCourtCases: [],
    lastSavedAt: Date.now(),
  };

  return {
    game,
    politicians,
    factions,
    parties: PARTIES_1856.map((p) => ({ ...p })),
    states,
    events: [
      {
        id: 'evt_init',
        year: 1856,
        phase: 'system',
        category: 'system',
        text: `Welcome to AMPU. The year is 1856. James Buchanan is President. Slavery threatens to tear the Union apart. You lead a faction. Make history.`,
      },
    ],
    legislation: [],
    elections: [],
    wars: [],
  };
}
