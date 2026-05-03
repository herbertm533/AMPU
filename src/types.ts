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
  | 'Traitor';

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
];

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
  region: 'Northeast' | 'Midwest' | 'South' | 'West' | 'Border';
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
