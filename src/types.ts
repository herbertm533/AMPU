// AMPU core types

export type PartyId = 'BLUE' | 'RED';

export type Ideology =
  | 'LW Populist'
  | 'Progressive'
  | 'Liberal'
  | 'Moderate'
  | 'Conservative'
  | 'Traditionalist'
  | 'RW Populist';

export const IDEOLOGY_ORDER: Ideology[] = [
  'LW Populist',
  'Progressive',
  'Liberal',
  'Moderate',
  'Conservative',
  'Traditionalist',
  'RW Populist',
];

export type SkillKey =
  | 'admin'
  | 'legislative'
  | 'judicial'
  | 'military'
  | 'governing'
  | 'backroom';

export const SKILLS: SkillKey[] = [
  'admin',
  'legislative',
  'judicial',
  'military',
  'governing',
  'backroom',
];

export type Skills = Record<SkillKey, number>;

export type CareerTrack =
  | 'Private'
  | 'Military'
  | 'Governing'
  | 'Administration'
  | 'Legislative'
  | 'Judicial'
  | 'Backroom';

export const CAREER_TRACKS: CareerTrack[] = [
  'Private',
  'Military',
  'Governing',
  'Administration',
  'Legislative',
  'Judicial',
  'Backroom',
];

export type Trait =
  | 'Charismatic'
  | 'Integrity'
  | 'Efficient'
  | 'Orator'
  | 'Debater'
  | 'Propagandist'
  | 'Crisis Manager'
  | 'Kingmaker'
  | 'Numberfudger'
  | 'Harmonious'
  | 'Manipulative'
  | 'Celebrity'
  | 'Magician'
  | 'Naval'
  | 'Education'
  | 'Economics'
  | 'Business'
  | 'Agriculture'
  | 'Environment'
  | 'Media'
  | 'Nationalist'
  | 'Globalist'
  | 'Reformist'
  | 'Military'
  | 'Egghead'
  | 'Leadership'
  | 'Incompetent'
  | 'Passive'
  | 'Unlikable'
  | 'Puritan'
  | 'Domestic Apathy'
  | 'Flip-Flopper'
  | 'Corrupt'
  | 'Scandalous'
  | 'Frail'
  | 'Controversial'
  | 'Obscure'
  | 'Traitor'
  | 'Carpetbagger'
  | 'Outsider'
  | 'Ideologue'
  | 'Impressionable'
  | 'Loyal'
  | 'Opportunist'
  | 'Ambitious'
  | 'Failed Bid';

export const POSITIVE_TRAITS: Trait[] = [
  'Charismatic',
  'Integrity',
  'Efficient',
  'Orator',
  'Debater',
  'Propagandist',
  'Crisis Manager',
  'Kingmaker',
  'Numberfudger',
  'Harmonious',
  'Manipulative',
  'Celebrity',
  'Magician',
  'Naval',
  'Education',
  'Economics',
  'Business',
  'Agriculture',
  'Environment',
  'Media',
  'Nationalist',
  'Globalist',
  'Reformist',
  'Military',
  'Egghead',
  'Leadership',
  'Ideologue',
  'Loyal',
  'Ambitious',
];

export const NEGATIVE_TRAITS: Trait[] = [
  'Incompetent',
  'Passive',
  'Unlikable',
  'Puritan',
  'Domestic Apathy',
  'Flip-Flopper',
  'Corrupt',
  'Scandalous',
  'Frail',
  'Controversial',
  'Obscure',
  'Traitor',
  'Carpetbagger',
  'Outsider',
  'Impressionable',
  'Opportunist',
  'Failed Bid',
];

// Career-track tables — single source for engine rolls AND the page legend.
export const TRACK_SKILL: Record<CareerTrack, SkillKey | null> = {
  Private: null,
  Military: 'military',
  Governing: 'governing',
  Administration: 'admin',
  Legislative: 'legislative',
  Judicial: 'judicial',
  Backroom: 'backroom',
};

export const TRACK_THEMED_TRAITS: Record<CareerTrack, Trait[]> = {
  Private: ['Celebrity', 'Business', 'Media'],
  Military: ['Military', 'Naval', 'Crisis Manager'],
  Governing: ['Leadership', 'Charismatic', 'Agriculture'],
  Administration: ['Efficient', 'Economics', 'Education'],
  Legislative: ['Orator', 'Debater', 'Reformist'],
  Judicial: ['Integrity', 'Egghead', 'Harmonious'],
  Backroom: ['Manipulative', 'Kingmaker', 'Numberfudger'],
};

export const CAREER_RANDOM_NEGATIVES: Trait[] = ['Corrupt', 'Scandalous', 'Controversial', 'Flip-Flopper'];

export const CAREER_ODDS = {
  skill: 0.5,
  themedByThreshold: [0.15, 0.3, 0.45, 0.6, 0.75], // index = threshold N-1
  random: 0.12,
  randomPositiveShare: 0.75,
} as const;

export const CAREER_TRACK_MAX_YEARS = 20;
export const CAREER_TRACK_CAP = 5; // max politicians per faction on EACH track at one time
export const CAREER_GAINS_CAP = 200;

// Relocation tables — single source for engine rolls AND the page legend.
export const RELOCATION_ODDS = {
  success: { sameRegionAlt: 0.75, sameRegion: 0.5, crossRegionAlt: 0.4, crossRegion: 0.2 },
  carpetbagger: { sameRegion: 0.05, crossRegion: 0.3, altStateFactor: 0.5 },
  seed: { sameRegion: 0.4, crossRegion: 0.15 }, // remainder (0.45) = no altState
  cpuGate: { withAltState: 0.3, withoutAltState: 0.1 },
} as const;
export const RELOCATION_ATTEMPTS_PER_TURN = 5;
export const RELOCATIONS_CAP = 200;
// Ordered ladder (first not held), not a draw pool.
export const CARPETBAGGER_LADDER: Trait[] = ['Carpetbagger', 'Outsider', 'Controversial', 'Unlikable'];

// Ideology-shift tables — single source for engine rolls AND the page legend.
export const IDEOLOGY_SHIFT_ODDS = {
  drift: { faction: 0.08, stateBias: 0.04, stateBiasMin: 1.0, residual: 0.01 },
  attempt: { self: 0.65, opposed: 0.15, ffRisk: 0.5 }, // ffRisk is NOT trait-modified
  traitMods: {
    Ideologue: { drift: 0, self: 0.5, opposed: 0.25 },
    Impressionable: { drift: 2, self: 1, opposed: 2 },
  },
  seed: { ideologue: 0.1, impressionable: 0.08 }, // remainder = neither
  cpu: { selfGate: 0.3, selfBudget: 3, opposedGate: 0.1, opposedScan: 10 },
} as const;
export const IDEOLOGY_ATTEMPTS_PER_TURN = 5;
export const IDEOLOGY_SHIFTS_CAP = 200;

// Faction-conversion tables — single source for engine rolls AND the page legend.
// Matrix access: poach.matrix[crossParty ? 'cross' : 'same'][inOffice ? 'inOffice' : 'notInOffice']
export const CONVERSION_ODDS = {
  passive: { rate: 0.02, oneAway: 0.9, anyFaction: 0.1, lossCapPerFaction: 2 },
  poach: {
    matrix: {
      same: { notInOffice: 0.2, inOffice: 0.05 },
      cross: { notInOffice: 0.1, inOffice: 0.02 },
    },
  },
  sign: { base: 0.2, fitBandClose: 1.5, fitBandFar: 0.5, fitCloseMax: 1, fitFarMin: 3 },
  willingness: {
    fitBetter: 1.5, fitWorse: 0.5,
    ffHistory: 1.25, mentorBond: 0.5,
    highPv: 0.75, highPvThreshold: 50,
    flipFlopperTrait: 1.25,
  },
  traits: {
    Loyal: { passive: 0, attempt: 0.25 },
    Opportunist: { passive: 2, attempt: 1.5 },
  },
  ffStacks: { same: 1, cross: 2 }, // poach success and passive defection
  seed: { loyal: 0.08, opportunist: 0.08 }, // remainder = neither
  cpu: { signGate: 0.35, signScan: 6, signBudget: 2, poachGate: 0.15, poachScan: 8 },
} as const;
export const CONVERSION_ATTEMPTS_PER_TURN = 5;
export const CONVERSIONS_CAP = 200;

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
  graduationOdds: { command: 0.45, trait: 0.45, both: 0.1 },
  commandCap: 5,
  poachResistance: 0.5, // legend cross-reference to CONVERSION_ODDS.willingness.mentorBond
} as const;
export const KINGMAKERS_CAP = 200;

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

// Faction alignment drift — single source for engine AND legend.
export const ALIGNMENT_RULES = {
  dropThreshold: -4,
  addThreshold: 4,
  stableTurns: 2, // K
  cardBiasPerDelta: 0.03,
  electionBiasPerScore: 0.5,
  electionBiasCap: 3,
  personalityBuckets: { lwMax: 2.5, rwMin: 4.5 },
  cardCapPerType: 4,
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

export const LEADERSHIP_FEED_CAP = 200;

export const LEADERSHIP_RULES = {
  fitPenalty: 1.0,
  traitBonusPerPositive: 2,
  traitBonusCap: 6,
  challengerPvFloor: 30,
  ideologyWeightInFactionCenter: 1.5,

  fireCap: 0.20,
  scoreNormalizer: 200,
  failedBidDecayTurns: 3,
  failedBidPvStamp: 5,
  ambitiousSeedRate: 0.05,
  ambitiousFireBonus: 0.05,

  oratorIdeologyShiftBonus: 0.05,
  manipulativeConversionBonus: 0.05,
  kingmakerProtegeBonus: 0.05,
  leadershipDropStableTurnsBonus: 1,

  electionOnBallotMul: 1.1,
  sponsorFloorBias: 0.05,

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

export const MORTALITY_RULES = {
  // Age-banded base rates (descending; first matching threshold wins).
  // Anchored to modern (post-1980) US rates; era multipliers shape pre-modern.
  deathBracket: [
    { minAge: 80, rate: 0.18 },
    { minAge: 70, rate: 0.07 },
    { minAge: 60, rate: 0.025 },
    { minAge: 0,  rate: 0.005 },
  ],
  retireBracket: [
    { minAge: 70, rate: 0.08 },
    { minAge: 60, rate: 0.025 },
    { minAge: 0,  rate: 0.005 },
  ],

  // Trait multipliers (death only — retire is unaffected by traits in v1).
  frailDeathMult: 1.5,
  crisisManagerDeathMult: 0.85,

  // Per-era multipliers applied to base bracket rates.
  // Pre-1860 mortality ~1.5-2× modern; 1860-1900 ~1.2-1.5×; modern baseline.
  // retireMult floored at ~25% of modern's 1.5 per user-binding game-feel override.
  eraConfig: {
    independence: { deathMult: 1.8, retireMult: 0.5 },
    federalism:   { deathMult: 1.6, retireMult: 0.6 },
    nationalism:  { deathMult: 1.3, retireMult: 0.9 },
    modern:       { deathMult: 1.0, retireMult: 1.5 },
  } as const satisfies Record<Era, {
    deathMult: number;
    retireMult: number;
  }>,
} as const;

export const ANYTIME_EVENTS_RULES = {
  baseFireChance: 0.05,
  nationalBaseFireChance: 0.70,
  eraConfig: {
    independence: { fireMult: 0.8, nationalFireMult: 0.9,  scandalMagnitudeMult: 0.5 },
    federalism:   { fireMult: 0.9, nationalFireMult: 0.95, scandalMagnitudeMult: 0.7 },
    nationalism:  { fireMult: 1.0, nationalFireMult: 1.0,  scandalMagnitudeMult: 1.0 },
    modern:       { fireMult: 1.1, nationalFireMult: 1.1,  scandalMagnitudeMult: 1.3 },
  } as const satisfies Record<Era, {
    fireMult: number;
    nationalFireMult: number;
    scandalMagnitudeMult: number;
  }>,
  skillCap: 5,
  commandCap: 5,
  pvHitFloor: -25,
  pvBumpCeil: 15,
  careerEndScandalShareOfScandalPool: 0.05,
  meterClampLow: -5,
  meterClampHigh: 5,
  partyPreferenceClampLow: -5,
  partyPreferenceClampHigh: 5,
} as const;

export const ANYTIME_EVENTS_FEED_CAP = 500;

// 2.4.3 Independence-era event graph (1772). Tunables for the graph walker —
// no magic numbers in the walker body.
export const ERA_GRAPH_RULES = {
  historyPressure: 0.8, // P(spine fires) when both spine & counterfactual are eligible (CP1-4)
  maxEventsPerTurn: 1,  // matches today's 2.4.3 cap
  fireChance: 0.85,     // base P that an eligible (non-core) node fires this turn (probabilistic firing)
} as const;

// Graph-specific enable flags that have no existing GameState home (CP1-6).
// Optional + Partial on GameState so existing saves load as all-false.
export type GraphFlagId = 'loansEnabled' | 'warVictoryGuaranteed';

export type OfficeType =
  | 'President'
  | 'VicePresident'
  | 'SecretaryOfState'
  | 'SecretaryOfTreasury'
  | 'SecretaryOfWar'
  | 'AttorneyGeneral'
  | 'PostmasterGeneral'
  | 'KeyAdvisor'
  | 'GeneralInChief'
  | 'Admiral'
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

export interface OfficeRef {
  type: OfficeType;
  stateId?: string;
  seatClass?: 1 | 2 | 3;
  committee?: 'Domestic' | 'Foreign' | 'Economic' | 'Justice';
}

export interface Politician {
  id: string;
  firstName: string;
  lastName: string;
  state: string;
  altState?: string;
  altStateSeeded?: boolean;
  lastRelocationAttemptYear?: number;
  ideologyTraitsSeeded?: boolean;
  lastIdeologyAttemptYear?: number; // stamps ATTEMPTS incl. failures, not shifts
  conversionTraitsSeeded?: boolean;
  lastConversionAttemptYear?: number; // stamps ATTEMPTS incl. failures; blocks the passive pass too
  bondedYear?: number; // year the current bond on this PROTÉGÉ was formed; drives the 20-year graduation clock
  factionId: string | null;
  partyId: PartyId | null;
  ideology: Ideology;
  age: number;
  birthYear: number;
  deathYear?: number;
  retiredYear?: number;
  skills: Skills;
  traits: Trait[];
  currentOffice: OfficeRef | null;
  careerTrack: CareerTrack | null;
  careerTrackYears: number;
  command: number;
  interests: string[];
  protegeId?: string | null;
  flipFlopperPenalty: number;
  pvCache: number;
  isHistorical: boolean;
  draftedYear?: number;
  ambitiousSeeded?: boolean;
  failedBidExpiresYear?: number;
  factionLeaderOf?: string | null;
}

export interface Faction {
  id: string;
  name: string;
  partyId: PartyId;
  personality: 'LW' | 'Center' | 'RW';
  ideologyCards: IdeologyCardId[];
  lobbyCards: LobbyCardId[];
  interestCards: InterestCardId[];
  leaderId?: string | null;
  leadershipStartYear?: number;
  isPlayer: boolean;
}

export interface Party {
  id: PartyId;
  name: string;
  leaderId?: string | null;
  color: string;
}

export interface Senator {
  politicianId: string;
  classId: 1 | 2 | 3;
}

export interface State {
  id: string;
  name: string;
  abbr: string;
  region: 'Northeast' | 'Midwest' | 'South' | 'West' | 'Border' | 'Canada' | 'Caribbean' | 'Latin America' | 'Pacific' | 'Atlantic';
  electoralVotes: number;
  bias: number;
  governorId?: string | null;
  senators: Senator[];
  representativeIds: string[];
  industries: Record<string, number>;
  isSlaveState: boolean;
  admissionYear: number;
  // 1772 era fields
  isColony?: boolean;
  colonySize?: 'large' | 'medium' | 'small';
  ccDelegateSlots?: number;
}

export type Era = 'independence' | 'federalism' | 'nationalism' | 'modern';

export interface CCDelegate {
  stateId: string;
  politicianId: string;
  factionId: string;
  servedLastTerm?: boolean;
  tier?: 'T1' | 'T2' | 'T3' | 'Wild' | 'Player';
}

export interface ContinentalCongress {
  delegates: CCDelegate[];
  presidentId: string | null;
  committeeChairs: {
    domestic: string | null;
    foreignMilitary: string | null;
    economic: string | null;
    judicial: string | null;
  };
  delegateTermStartYear?: number;
  assemblyOrdinal?: number;
}

export interface BattleRecord {
  year: number;
  type: 'naval' | 'ground';
  difficulty?: 'easy' | 'moderate' | 'difficult';
  outcome: 'win' | 'loss' | 'draw';
  text: string;
  name?: string;
  killed?: string[];
  wounded?: string[];
}

export interface RevolutionaryWar {
  active: boolean;
  groundWinsNeeded: number;
  groundLossesRemaining: number;
  currentGroundWins: number;
  currentGroundLosses: number;
  navalWins: number;
  navalLosses: number;
  seniorGeneralId: string | null;
  generalIds: string[];
  seniorAdmiralId: string | null;
  admiralIds: string[];
  frenchAlliance: boolean;
  battleLog: BattleRecord[];
  endYear?: number;
  outcome?: 'win' | 'loss';
}

export interface ConstitutionalArticles {
  legislature: 'bicameral' | 'unicameral';
  executive: 'elected_president' | 'congressional_president' | 'executive_council';
  judiciary: 'appointed' | 'elected';
  slaveCompromise: 'three_fifths' | 'full' | 'none';
  amendmentProcess: 'three_fourths' | 'two_thirds' | 'unanimous';
  presidentialEligibility: 'natural_born' | 'any_citizen';
  termLimits: 'two_terms' | 'no_limits';
}

export interface NationalMeters {
  revenue: number;
  economic: number;
  military: number;
  domestic: number;
  honest: number;
  quality: number;
  planet: number;
}

export type MeterKey = keyof NationalMeters;

export interface InterestGroupScores {
  [groupId: string]: number;
}

export interface Enthusiasm {
  // ideology -> party -> -5..+5
  [ideology: string]: { BLUE: number; RED: number };
}

export type PhaseId =
  | '2.1.1' | '2.1.2' | '2.1.3' | '2.1.4' | '2.1.5' | '2.1.6' | '2.1.7' | '2.1.8'
  | '2.2.1' | '2.2.2' | '2.2.3' | '2.2.4'
  | '2.3.1' | '2.3.2'
  | '2.4.1' | '2.4.2' | '2.4.3'
  | '2.5.1' | '2.5.2' | '2.5.3'
  | '2.6.1' | '2.6.2' | '2.6.3'
  | '2.7.1' | '2.7.2'
  | '2.8.1' | '2.8.2'
  | '2.9.1' | '2.9.2' | '2.9.3' | '2.9.4' | '2.9.5' | '2.9.6'
  | '2.10';

export interface PhaseInfo {
  id: PhaseId;
  label: string;
  description: string;
  category: string;
}

export interface EventEntry {
  id: string;
  year: number;
  phase: PhaseId | 'system';
  category: 'death' | 'retire' | 'election' | 'legislation' | 'event' | 'appointment' | 'system' | 'meter' | 'draft' | 'war' | 'court' | 'roll';
  text: string;
  meta?: Record<string, unknown>;
}

export interface EraEventResponseEffect {
  meters?: Partial<NationalMeters>;
  partyPreference?: number;
  enthusiasm?: { ideology: Ideology; party: PartyId; delta: number }[];
  interestGroups?: { id: string; delta: number }[];
  domesticStability?: number;
  diplomacy?: { nation: string; delta: number }[];
  startWar?: { name: string; against: string };
  text: string;
}

export interface EraEventResponse {
  id: string;
  label: string;
  description: string;
  effect: EraEventResponseEffect;
}

export interface EraEvent {
  id: string;
  templateId?: string; // for scripted scenarios; tracked in game.eraEventsCompleted
  year: number;
  title: string;
  description: string;
  responses: EraEventResponse[];
  decider: 'president' | 'congress' | 'cabinet' | 'cc-president' | 'auto';
  resolved?: boolean;
  chosenResponseId?: string;
  triggersGameEnd?: boolean;
  unlocks?: ('governors' | 'congress' | 'presidency' | 'court' | 'continentalArmy')[];
  postEffects?: { type: 'startWar' | 'unlockGovernors' | 'unlockArticles' | 'startConvention' | 'endWar' | 'addPolitician' | 'assembleCC'; payload?: unknown }[];
}

// Serializable precondition tree for the 2.4.3 era-event graph (CP1-2).
// A single pure evalPredicate(snap, pred) interprets it; preconditions are
// data, not code, so they are inspectable, testable, and future-proof.
export type Predicate =
  | { all: Predicate[] }
  | { any: Predicate[] }
  | { not: Predicate }
  | { yearAtLeast: number }
  | { yearAtMost: number }
  | { eventCompleted: string } // templateId in eraEventsCompleted
  | { eventChose: { template: string; response: string } } // resolved node's chosenResponseId
  | { meterAtLeast: { meter: MeterKey; value: number } }
  | { meterAtMost: { meter: MeterKey; value: number } }
  | { interestAtLeast: { group: string; value: number } }
  | { diplomacyAtLeast: { nation: string; value: number } }
  | { warActive: boolean } // game.revolutionaryWar?.active === flag
  | { warOutcome: 'win' | 'loss' } // game.revolutionaryWar?.outcome
  | { stateAdmitted: string } // snap.states has id
  | { officeControlledByPlayer: 'cc-president' | 'general-in-chief' }
  | { rosterHasSkill: { skill: SkillKey; min: number } } // any player-faction politician
  | { flag: GraphFlagId };

export interface Legislation {
  id: string;
  year: number;
  title: string;
  description: string;
  sponsorId: string;
  sponsorFactionId: string;
  committee: 'Domestic' | 'Foreign' | 'Economic' | 'Justice';
  status: 'proposed' | 'committee' | 'passed_committee' | 'killed_committee' | 'passed' | 'failed';
  effects: EraEventResponseEffect;
  votes?: {
    house: { yea: number; nay: number };
    senate: { yea: number; nay: number };
  };
}

export interface ElectionResult {
  id: string;
  year: number;
  type: 'presidential' | 'senate' | 'house' | 'governor';
  stateId?: string;
  candidates: { politicianId: string; partyId: PartyId; votes: number; pct: number }[];
  winnerId: string;
  electoralVotes?: { politicianId: string; ev: number }[];
}

export interface War {
  id: string;
  name: string;
  startYear: number;
  endYear?: number;
  enemy: string;
  warScore: number;
  generals: string[];
  battles: {
    year: number;
    name: string;
    outcome: 'win' | 'loss' | 'draw';
    text: string;
  }[];
}

export interface SupremeCourtCase {
  id: string;
  year: number;
  title: string;
  description: string;
  decided: boolean;
  ruling?: 'majority' | 'minority';
  effect?: EraEventResponseEffect;
}

export interface GameState {
  // singleton record stored under id="game"
  id: 'game';
  scenarioId: string;
  year: number;
  startYear: number;
  phaseIndex: number;
  phaseId: PhaseId;
  playerFactionId: string;
  presidentId: string | null;
  vicePresidentId: string | null;
  meters: NationalMeters;
  partyPreference: number;
  enthusiasm: Enthusiasm;
  interestGroups: InterestGroupScores;
  nationalDebt: number;
  diplomacy: Record<string, number>;
  wars: string[]; // war ids
  pendingEraEvents: EraEvent[];
  pendingCabinetVacancies: OfficeType[];
  pendingDraftPool: string[]; // politician ids
  draftRoundOrder: string[]; // faction ids in order
  cabinet: Partial<Record<OfficeType, string | null>>;
  speakerId: string | null;
  proTemId: string | null;
  committeeChairs: Partial<Record<'Domestic' | 'Foreign' | 'Economic' | 'Justice', string | null>>;
  supremeCourtIds: string[];
  chiefJusticeId: string | null;
  pendingLegislation: string[]; // legislation ids in current session
  pendingCourtCases: SupremeCourtCase[];
  lastSavedAt: number;
  // Era system
  currentEra: Era;
  eraEventsCompleted: string[]; // event template ids that have already fired
  governorsExist: boolean; // unlocked when Declaration of Independence passes
  articlesOfConfederation: boolean;
  constitutionRatified: boolean;
  constitutionalArticles: ConstitutionalArticles | null;
  continentalCongress: ContinentalCongress | null;
  revolutionaryWar: RevolutionaryWar | null;
  pendingConvention?: ConstitutionalConvention | null;
  lastDraftYear?: number | null;
  draftHistory?: DraftHistoryYear[];
  careerGains?: CareerGainEntry[];
  relocations?: RelocationEntry[];
  relocationAttempts?: { year: number; counts: Record<string, number> };
  // Transient cursor for the 1772 First-CC builder (phase 2.9.6). Cleared at
  // phase end. Indices reference the alphabetical (by `abbr`) colony order.
  // `excludedThisColony` collects per-colony declines (player) AND per-colony
  // AI-already-logged decline ids so AC #25 logs once-per-politician-per-colony.
  // `pendingAIPick` holds the AI's resolved pick AFTER `aiPickDelegate` ran but
  // BEFORE commitment — UI shows the AI-Pick Card while populated, then
  // `confirmCCAIPick` commits and clears the field. See AC #22.
  ccBuilderCursor?: {
    colonyIdx: number;
    slotIdx: number;
    excludedThisColony?: string[];
    pendingAIPick?: {
      stateId: string;
      politicianId: string;
      tier: 'T1' | 'T2' | 'T3' | 'Wild';
      selectingFactionId: string;
      declinedThisStep?: { politicianId: string; tier: 'T1' | 'T2' | 'T3' | 'Wild' }[];
    };
  };
  ideologyShifts?: IdeologyShiftEntry[];
  ideologyAttempts?: { year: number; counts: Record<string, number> };
  conversions?: ConversionEntry[];
  conversionAttempts?: { year: number; counts: Record<string, number> };
  kingmakers?: KingmakerEntry[];
  factionAlignmentDrift?: FactionAlignmentDriftEntry[];
  factionLeadership?: FactionLeadershipEntry[];
  alignmentStability?: Record<string, { firstSeenYear: number }>;
  customDraftClasses?: ImportedDraftee[];
  inauguralDraftSeeded?: boolean;
  // 2.4.3 era-event graph (1772). Optional so existing saves load.
  graphFlags?: Partial<Record<GraphFlagId, boolean>>;
  gameEnded?: { year: number; reason: string; templateId: string };
  // Events-phase manual-trigger UI: ids flagged "just fired this phase visit"
  // (EraEvent.id for 2.4.3; EventEntry.id for 2.4.2). Cleared by advancePhase
  // when exiting 2.4.2/2.4.3. Optional so old saves load with `undefined`.
  newlyFiredEventIds?: string[];
  // Bookmark into snapshot.events: ids newer than this are "just fired" on the
  // Anytime Events page. Bumped to the current head when exiting 2.4.2.
  lastAnytimeFeedHeadId?: string;
}

export interface DraftHistoryPick {
  pickNumber: number;
  round: number;
  factionId: string;
  politicianId: string;
}

export interface DraftHistoryYear {
  year: number;
  picks: DraftHistoryPick[];
}

export interface CareerGainEntry {
  year: number;
  politicianId: string;
  factionId: string; // faction at time of gain (feed filters on this)
  track: CareerTrack;
  thresholdYears: number; // 4 | 8 | 12 | 16 | 20
  kind: 'skill' | 'trait';
  detail: SkillKey | Trait;
  negative: boolean;
}

export type RelocationBand = 'sameRegionAlt' | 'sameRegion' | 'crossRegionAlt' | 'crossRegion';

export interface RelocationEntry {
  year: number;
  politicianId: string;
  factionId: string; // faction at move time (feed filters on this)
  fromState: string;
  toState: string;
  band: RelocationBand;
  success: boolean;
  traitsGained: Trait[]; // empty on failure; at most one entry in v1
}

export interface IdeologyShiftEntry {
  year: number;
  politicianId: string;
  subjectFactionId: string | null; // subject's faction at shift time (feed: actor OR subject)
  actorFactionId?: string; // absent on passive drift entries
  kind: 'drift' | 'stateBias' | 'self' | 'opposed';
  fromIdeology: Ideology;
  toIdeology: Ideology; // === fromIdeology on failed attempts
  success: boolean; // always true on drift entries (movements only)
  flipFlopper: boolean; // opposed success that also landed the FF roll
}

export interface ConversionEntry {
  year: number;
  politicianId: string;
  fromFactionId: string | null; // null on sign rows
  toFactionId: string; // destination faction; on failed attempts = actor's faction
  fromPartyId: PartyId | null; // null on sign rows
  toPartyId: PartyId; // always populated; destination faction's party
  actorFactionId?: string; // absent on passive 'defect' entries
  kind: 'defect' | 'poach' | 'sign';
  crossParty: boolean;
  success: boolean;
  ffGained: number; // 0 on failures and signs; 1 same-party / 2 cross-party on success
}

export interface KingmakerEntry {
  year: number;
  kind: 'anointed' | 'bonded' | 'graduated' | 'dissolved';
  politicianId: string; // for 'anointed' = the newly-trait-granted politician
  mentorId?: string;
  protegeId?: string;
  factionId: string;
  reason?: 'death' | 'retire' | 'defect' | 'released' | 'draft-floor';
  trigger?: 'tenure' | 'office';
  actor?: 'player' | 'cpu';
}

export interface FactionAlignmentDriftEntry {
  year: number;
  factionId: string;
  kind: 'personality-shift' | 'card-added' | 'card-dropped' | 'card-swapped';
  cardType?: 'interest' | 'lobby' | 'ideology';
  cardId?: InterestCardId | LobbyCardId | IdeologyCardId;
  fromCardId?: InterestCardId | LobbyCardId | IdeologyCardId;
  fromPersonality?: 'LW' | 'Center' | 'RW';
  toPersonality?: 'LW' | 'Center' | 'RW';
  reason?: 'crashed' | 'emerging' | 'realigned' | 'composition';
}

export interface FactionLeadershipEntry {
  year: number;
  factionId: string;
  kind: 'installed' | 'challenged' | 'vacated';
  leaderId?: string;
  formerLeaderId?: string;
  challengerId?: string;
  success?: boolean;
  reason?: 'death' | 'retire' | 'defect' | 'promoted' | 'replaced' | 'challenge-win'
         | 'challenge-loss' | 'election';
}

// A draftee imported from the user's CSV dataset. Persisted on the game state
// so it travels with the save and is included in export/import.
export interface ImportedDraftee {
  draftYear: number;
  firstName: string;
  lastName: string;
  state: string; // state id (lowercase abbreviation, e.g. "ny")
  ideology: Ideology;
  birthYear: number;
  age: number;
  skills: Skills;
  command: number;
  traits: Trait[];
}

export interface ConventionVote {
  articleKey: keyof ConstitutionalArticles;
  options: { id: string; label: string; description: string; value: string }[];
  selected: string | null;
}

export interface ConstitutionalConvention {
  id: string;
  year: number;
  votes: ConventionVote[];
  fatherOfConstitutionId: string | null;
  federalistAuthorIds: string[];
  ratified: boolean;
  resolved: boolean;
}

export interface FullGameSnapshot {
  game: GameState;
  politicians: Politician[];
  factions: Faction[];
  parties: Party[];
  states: State[];
  events: EventEntry[];
  legislation: Legislation[];
  elections: ElectionResult[];
  wars: War[];
}
