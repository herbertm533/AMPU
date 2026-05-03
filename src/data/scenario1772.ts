import type { FullGameSnapshot, GameState, NationalMeters, Enthusiasm, InterestGroupScores } from '../types';
import { COLONIES_1772 } from './states1772';
import { FACTIONS_1772, PARTIES_1772 } from './factions1772';
import { buildPoliticians1772 } from './politicians1772';
import { refreshPv } from '../pv';
import { IDEOLOGY_ORDER } from '../types';
import { INTEREST_GROUPS } from './factions1856';

const STARTING_METERS: NationalMeters = {
  revenue: -1,
  economic: 0,
  military: -2,
  domestic: -1,
  honest: 1,
  quality: -1,
  planet: 5,
};

function buildEnthusiasm(): Enthusiasm {
  const ent: Enthusiasm = {} as Enthusiasm;
  for (const ideo of IDEOLOGY_ORDER) {
    let blue = 0, red = 0;
    if (ideo === 'LW Populist' || ideo === 'Progressive') { blue = 3; red = -1; }
    else if (ideo === 'Liberal') { blue = 2; red = 0; }
    else if (ideo === 'Moderate') { blue = 1; red = 1; }
    else if (ideo === 'Conservative') { blue = 0; red = 2; }
    else if (ideo === 'Traditionalist') { blue = -1; red = 3; }
    else if (ideo === 'RW Populist') { blue = 0; red = 1; }
    ent[ideo] = { BLUE: blue, RED: red };
  }
  return ent;
}

function buildInterestScores(): InterestGroupScores {
  const out: InterestGroupScores = {};
  for (const g of INTEREST_GROUPS) out[g] = 0;
  return out;
}

export function build1772Scenario(playerFactionId: string): FullGameSnapshot {
  let politicians = buildPoliticians1772();
  politicians = refreshPv(politicians);

  // States from colonies
  const states = COLONIES_1772.map((c) => ({
    ...c,
    governorId: null,
    senators: [],
    representativeIds: [],
  }));

  const factions = FACTIONS_1772.map((f) => ({
    id: f.id,
    name: f.name,
    partyId: f.partyId,
    personality: f.personality,
    ideologyCards: f.ideologyCards,
    lobbyCards: f.lobbyCards,
    interestCards: f.interestCards,
    leaderId: null,
    isPlayer: f.id === playerFactionId,
  }));

  const game: GameState = {
    id: 'game',
    scenarioId: '1772',
    year: 1772,
    startYear: 1772,
    phaseIndex: 0,
    phaseId: '2.1.1',
    playerFactionId,
    presidentId: null,
    vicePresidentId: null,
    meters: STARTING_METERS,
    partyPreference: 0,
    enthusiasm: buildEnthusiasm(),
    interestGroups: buildInterestScores(),
    nationalDebt: 0,
    diplomacy: { Britain: -1, France: 0, Spain: -1, Netherlands: 1 },
    wars: [],
    pendingEraEvents: [],
    pendingCabinetVacancies: [],
    pendingDraftPool: politicians.map((p) => p.id), // EXPANSION DRAFT — entire pool
    draftRoundOrder: [],
    cabinet: { SecretaryOfState: null, SecretaryOfTreasury: null, SecretaryOfWar: null, AttorneyGeneral: null, PostmasterGeneral: null, KeyAdvisor: null },
    speakerId: null,
    proTemId: null,
    committeeChairs: { Domestic: null, Foreign: null, Economic: null, Justice: null },
    supremeCourtIds: [],
    chiefJusticeId: null,
    pendingLegislation: [],
    pendingCourtCases: [],
    lastSavedAt: Date.now(),
    currentEra: 'independence',
    eraEventsCompleted: [],
    governorsExist: false,
    articlesOfConfederation: false,
    constitutionRatified: false,
    constitutionalArticles: null,
    continentalCongress: null,
    revolutionaryWar: null,
  };

  // Set up snake draft order — same approach as 1856 but with full pool
  const factionPvSum = factions.map((f) => ({ id: f.id, sum: 0 })); // all start at 0
  factionPvSum.sort(() => Math.random() - 0.5);
  const order = factionPvSum.map((x) => x.id);
  // Long expansion draft: enough rounds to drain pool
  const roundsNeeded = Math.ceil(politicians.length / factions.length);
  game.draftRoundOrder = [];
  for (let r = 0; r < roundsNeeded; r++) {
    const ord = r % 2 === 0 ? order : [...order].reverse();
    game.draftRoundOrder.push(...ord);
  }

  return {
    game,
    politicians,
    factions,
    parties: PARTIES_1772.map((p) => ({ ...p })),
    states,
    events: [
      {
        id: 'evt_init_1772',
        year: 1772,
        phase: 'system',
        category: 'system',
        text: 'Welcome to the Era of Independence. The year is 1772. Tensions between Great Britain and her American colonies have reached a boiling point.',
      },
    ],
    legislation: [],
    elections: [],
    wars: [],
  };
}
