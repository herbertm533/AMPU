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
  | 'Opportunist';

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
  isKingmaker: boolean;
  protegeId?: string | null;
  flipFlopperPenalty: number;
  pvCache: number;
  isHistorical: boolean;
  draftedYear?: number;
}

export interface Faction {
  id: string;
  name: string;
  partyId: PartyId;
  personality: 'LW' | 'Center' | 'RW';
  ideologyCards: string[];
  lobbyCards: string[];
  interestCards: string[];
  leaderId?: string | null;
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
  postEffects?: { type: 'startWar' | 'unlockGovernors' | 'unlockArticles' | 'startConvention' | 'endWar' | 'addPolitician'; payload?: unknown }[];
}

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
  ideologyShifts?: IdeologyShiftEntry[];
  ideologyAttempts?: { year: number; counts: Record<string, number> };
  conversions?: ConversionEntry[];
  conversionAttempts?: { year: number; counts: Record<string, number> };
  customDraftClasses?: ImportedDraftee[];
  inauguralDraftSeeded?: boolean;
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
