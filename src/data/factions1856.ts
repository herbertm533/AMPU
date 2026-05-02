import type { Faction } from '../types';

export const FACTIONS_1856: Faction[] = [
  // Blue (Democratic Party) factions
  { id: 'fact_blue_cons', name: 'Conservative Democrats', partyId: 'BLUE', personality: 'RW', ideologyCards: ['SlaveryRights', 'StatesRights'], lobbyCards: ['SlavePower'], interestCards: ['Planters'], isPlayer: false },
  { id: 'fact_blue_popsov', name: 'Popular Sovereignty Democrats', partyId: 'BLUE', personality: 'Center', ideologyCards: ['Manifestdestiny', 'StatesRights'], lobbyCards: ['Expansionists'], interestCards: ['Settlers'], isPlayer: false },
  { id: 'fact_blue_unionist', name: 'Unionist Democrats', partyId: 'BLUE', personality: 'Center', ideologyCards: ['Compromise'], lobbyCards: ['ProUnion'], interestCards: ['Border'], isPlayer: false },
  { id: 'fact_blue_jackson', name: 'Jacksonian Democrats', partyId: 'BLUE', personality: 'LW', ideologyCards: ['Populism'], lobbyCards: ['SmallFarmers'], interestCards: ['Workers', 'Settlers'], isPlayer: false },
  { id: 'fact_blue_locofoco', name: 'Loco-Foco Democrats', partyId: 'BLUE', personality: 'LW', ideologyCards: ['Antimonopoly', 'FreeTrade'], lobbyCards: ['UrbanLabor'], interestCards: ['Workers', 'Immigrants'], isPlayer: false },

  // Red (Republican Party) factions
  { id: 'fact_red_critt', name: 'Crittenden Republicans', partyId: 'RED', personality: 'Center', ideologyCards: ['Compromise', 'GradualEmancipation'], lobbyCards: ['ProUnion'], interestCards: ['Border'], isPlayer: false },
  { id: 'fact_red_mod', name: 'Moderate Republicans', partyId: 'RED', personality: 'Center', ideologyCards: ['FreeSoil', 'Industry'], lobbyCards: ['NorthernIndustry'], interestCards: ['Manufacturers'], isPlayer: false },
  { id: 'fact_red_lib', name: 'Liberal Republicans', partyId: 'RED', personality: 'LW', ideologyCards: ['FreeSoil', 'Antislavery'], lobbyCards: ['Abolitionists'], interestCards: ['Reformers', 'Manufacturers'], isPlayer: false },
  { id: 'fact_red_radical', name: 'Radical Republicans', partyId: 'RED', personality: 'LW', ideologyCards: ['Abolition', 'CivilRights'], lobbyCards: ['Abolitionists', 'EvangelicalReform'], interestCards: ['Reformers', 'Freedmen'], isPlayer: false },
  { id: 'fact_red_know', name: 'Know-Nothing Republicans', partyId: 'RED', personality: 'RW', ideologyCards: ['Nativism', 'Protestantism'], lobbyCards: ['Nativists'], interestCards: ['Nativists'], isPlayer: false },
];

export const PARTIES_1856 = [
  { id: 'BLUE' as const, name: 'Democratic Party', color: '#2563eb', leaderId: null },
  { id: 'RED' as const, name: 'Republican Party', color: '#dc2626', leaderId: null },
];

export const INTEREST_GROUPS = [
  'WallStreet', 'LaborUnions', 'BigTech', 'BigOilGas', 'BigAg', 'MilitaryIndustrial',
  'FreeTrade', 'Protectionists', 'CivilRights', 'HumanRights', 'LawAndOrder',
  'Welfare', 'PublicHousing', 'Globalists', 'Isolationists', 'Nationalists',
  'Pacifists', 'Expansionists', 'RWActivists', 'LWActivists', 'Theocrats',
  'RWMedia', 'LWMedia', 'Abolitionists', 'Planters', 'Manufacturers', 'Settlers',
  'Workers', 'Reformers', 'Nativists', 'Immigrants',
];
