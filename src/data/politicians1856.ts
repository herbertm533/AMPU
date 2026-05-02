import type { Politician, Skills, Trait, Ideology } from '../types';
import { uid } from '../rng';

interface Seed {
  first: string;
  last: string;
  state: string;
  party: 'BLUE' | 'RED' | null;
  faction: string | null;
  ideology: Ideology;
  age: number;
  skills: [number, number, number, number, number, number]; // admin, leg, jud, mil, gov, back
  command: number;
  traits: Trait[];
  office?: 'President' | 'VicePresident' | 'ChiefJustice' | 'AssociateJustice' | 'Senator' | 'Representative' | 'Governor' | 'GeneralInChief' | 'Admiral' | 'SecretaryOfState' | 'SecretaryOfTreasury' | 'SecretaryOfWar' | 'AttorneyGeneral';
  isHistorical?: boolean;
}

// A representative roster of major 1856 era figures plus generic fillers.
const SEEDS: Seed[] = [
  // Blue presidency
  { first: 'James', last: 'Buchanan', state: 'pa', party: 'BLUE', faction: 'fact_blue_cons', ideology: 'Conservative', age: 65, skills: [4, 3, 2, 0, 3, 3], command: 4, traits: ['Efficient'], office: 'President', isHistorical: true },
  { first: 'John C.', last: 'Breckinridge', state: 'ky', party: 'BLUE', faction: 'fact_blue_unionist', ideology: 'Conservative', age: 35, skills: [3, 3, 1, 1, 2, 3], command: 3, traits: ['Orator'], office: 'VicePresident', isHistorical: true },

  // Blue Conservative
  { first: 'Jefferson', last: 'Davis', state: 'ms', party: 'BLUE', faction: 'fact_blue_cons', ideology: 'Traditionalist', age: 48, skills: [4, 3, 1, 4, 2, 3], command: 4, traits: ['Nationalist', 'Military'], office: 'Senator', isHistorical: true },
  { first: 'James M.', last: 'Mason', state: 'va', party: 'BLUE', faction: 'fact_blue_cons', ideology: 'Traditionalist', age: 58, skills: [2, 3, 2, 0, 2, 3], command: 2, traits: ['Nationalist'], office: 'Senator', isHistorical: true },
  { first: 'Robert', last: 'Toombs', state: 'ga', party: 'BLUE', faction: 'fact_blue_cons', ideology: 'Traditionalist', age: 46, skills: [2, 4, 1, 1, 2, 3], command: 3, traits: ['Orator', 'Debater'], office: 'Senator', isHistorical: true },
  { first: 'Howell', last: 'Cobb', state: 'ga', party: 'BLUE', faction: 'fact_blue_cons', ideology: 'Conservative', age: 41, skills: [3, 3, 1, 0, 3, 3], command: 3, traits: ['Economics'], isHistorical: true },
  { first: 'John B.', last: 'Floyd', state: 'va', party: 'BLUE', faction: 'fact_blue_cons', ideology: 'Conservative', age: 50, skills: [2, 1, 0, 2, 3, 1], command: 2, traits: ['Corrupt'], isHistorical: true },
  { first: 'James L.', last: 'Orr', state: 'sc', party: 'BLUE', faction: 'fact_blue_cons', ideology: 'Conservative', age: 34, skills: [2, 3, 1, 0, 1, 2], command: 2, traits: [], isHistorical: true },

  // Blue Pop Sovereignty
  { first: 'Stephen A.', last: 'Douglas', state: 'il', party: 'BLUE', faction: 'fact_blue_popsov', ideology: 'Moderate', age: 43, skills: [3, 4, 2, 0, 2, 4], command: 4, traits: ['Orator', 'Debater'], office: 'Senator', isHistorical: true },
  { first: 'Lewis', last: 'Cass', state: 'mi', party: 'BLUE', faction: 'fact_blue_popsov', ideology: 'Moderate', age: 74, skills: [3, 3, 2, 1, 3, 2], command: 3, traits: ['Globalist'], office: 'SecretaryOfState', isHistorical: true },
  { first: 'William L.', last: 'Marcy', state: 'ny', party: 'BLUE', faction: 'fact_blue_popsov', ideology: 'Moderate', age: 70, skills: [3, 2, 1, 1, 3, 3], command: 2, traits: [], isHistorical: true },
  { first: 'Franklin', last: 'Pierce', state: 'nh', party: 'BLUE', faction: 'fact_blue_popsov', ideology: 'Moderate', age: 52, skills: [2, 2, 1, 1, 2, 2], command: 2, traits: ['Passive'], isHistorical: true },
  { first: 'Daniel S.', last: 'Dickinson', state: 'ny', party: 'BLUE', faction: 'fact_blue_popsov', ideology: 'Moderate', age: 56, skills: [2, 3, 1, 0, 2, 3], command: 2, traits: [], isHistorical: true },

  // Blue Unionist
  { first: 'Andrew', last: 'Johnson', state: 'tn', party: 'BLUE', faction: 'fact_blue_unionist', ideology: 'Conservative', age: 48, skills: [2, 3, 1, 0, 2, 2], command: 2, traits: ['Unlikable'], office: 'Senator', isHistorical: true },
  { first: 'John', last: 'Bell', state: 'tn', party: 'BLUE', faction: 'fact_blue_unionist', ideology: 'Moderate', age: 60, skills: [3, 3, 2, 0, 2, 3], command: 3, traits: ['Crisis Manager'], isHistorical: true },
  { first: 'Edward', last: 'Everett', state: 'ma', party: 'BLUE', faction: 'fact_blue_unionist', ideology: 'Moderate', age: 62, skills: [3, 2, 2, 0, 2, 2], command: 2, traits: ['Orator', 'Education'], isHistorical: true },
  { first: 'Sam', last: 'Houston', state: 'tx', party: 'BLUE', faction: 'fact_blue_unionist', ideology: 'Moderate', age: 63, skills: [2, 2, 1, 4, 3, 2], command: 4, traits: ['Celebrity', 'Military'], office: 'Senator', isHistorical: true },

  // Blue Jacksonian
  { first: 'James K.', last: 'Polk', state: 'tn', party: 'BLUE', faction: 'fact_blue_jackson', ideology: 'Liberal', age: 60, skills: [3, 3, 1, 1, 2, 3], command: 3, traits: ['Efficient'], isHistorical: true },
  { first: 'Thomas H.', last: 'Benton', state: 'mo', party: 'BLUE', faction: 'fact_blue_jackson', ideology: 'Liberal', age: 74, skills: [3, 4, 1, 1, 2, 3], command: 4, traits: ['Orator', 'Reformist'], isHistorical: true },
  { first: 'David', last: 'Wilmot', state: 'pa', party: 'BLUE', faction: 'fact_blue_jackson', ideology: 'Progressive', age: 42, skills: [2, 3, 2, 0, 1, 2], command: 2, traits: ['Reformist'], isHistorical: true },

  // Blue Locofoco
  { first: 'Martin', last: 'Van Buren', state: 'ny', party: 'BLUE', faction: 'fact_blue_locofoco', ideology: 'Liberal', age: 73, skills: [4, 3, 1, 0, 3, 5], command: 4, traits: ['Manipulative', 'Magician'], isHistorical: true },
  { first: 'John A.', last: 'Dix', state: 'ny', party: 'BLUE', faction: 'fact_blue_locofoco', ideology: 'Liberal', age: 58, skills: [3, 2, 1, 2, 3, 2], command: 2, traits: [], isHistorical: true },

  // Red Crittenden
  { first: 'John J.', last: 'Crittenden', state: 'ky', party: 'RED', faction: 'fact_red_critt', ideology: 'Conservative', age: 69, skills: [3, 4, 3, 0, 2, 3], command: 3, traits: ['Crisis Manager'], office: 'Senator', isHistorical: true },
  { first: 'Edward', last: 'Bates', state: 'mo', party: 'RED', faction: 'fact_red_critt', ideology: 'Conservative', age: 63, skills: [3, 2, 4, 0, 2, 2], command: 2, traits: ['Integrity'], isHistorical: true },
  { first: 'Orville H.', last: 'Browning', state: 'il', party: 'RED', faction: 'fact_red_critt', ideology: 'Moderate', age: 50, skills: [2, 3, 2, 0, 1, 2], command: 2, traits: [], isHistorical: true },

  // Red Moderate
  { first: 'Abraham', last: 'Lincoln', state: 'il', party: 'RED', faction: 'fact_red_mod', ideology: 'Moderate', age: 47, skills: [2, 3, 2, 0, 1, 2], command: 2, traits: ['Orator', 'Integrity'], isHistorical: true },
  { first: 'William P.', last: 'Fessenden', state: 'me', party: 'RED', faction: 'fact_red_mod', ideology: 'Moderate', age: 49, skills: [3, 4, 2, 0, 2, 2], command: 3, traits: ['Economics'], office: 'Senator', isHistorical: true },
  { first: 'Lyman', last: 'Trumbull', state: 'il', party: 'RED', faction: 'fact_red_mod', ideology: 'Moderate', age: 43, skills: [3, 4, 3, 0, 1, 2], command: 3, traits: ['Integrity'], office: 'Senator', isHistorical: true },
  { first: 'Hannibal', last: 'Hamlin', state: 'me', party: 'RED', faction: 'fact_red_mod', ideology: 'Moderate', age: 47, skills: [3, 3, 1, 0, 3, 2], command: 2, traits: [], isHistorical: true },
  { first: 'John A.', last: 'Andrew', state: 'ma', party: 'RED', faction: 'fact_red_mod', ideology: 'Liberal', age: 38, skills: [3, 3, 2, 0, 4, 2], command: 3, traits: ['Reformist', 'Integrity'], isHistorical: true },

  // Red Liberal
  { first: 'William H.', last: 'Seward', state: 'ny', party: 'RED', faction: 'fact_red_lib', ideology: 'Liberal', age: 55, skills: [3, 4, 2, 0, 3, 4], command: 5, traits: ['Manipulative', 'Magician'], office: 'Senator', isHistorical: true },
  { first: 'Salmon P.', last: 'Chase', state: 'oh', party: 'RED', faction: 'fact_red_lib', ideology: 'Progressive', age: 48, skills: [3, 3, 3, 0, 4, 2], command: 3, traits: ['Integrity', 'Reformist'], isHistorical: true },
  { first: 'John C.', last: 'Frémont', state: 'ca', party: 'RED', faction: 'fact_red_lib', ideology: 'Liberal', age: 43, skills: [2, 1, 0, 3, 1, 1], command: 3, traits: ['Celebrity'], isHistorical: true },
  { first: 'Henry', last: 'Wilson', state: 'ma', party: 'RED', faction: 'fact_red_lib', ideology: 'Progressive', age: 44, skills: [2, 3, 1, 0, 1, 3], command: 2, traits: ['Reformist'], office: 'Senator', isHistorical: true },
  { first: 'Schuyler', last: 'Colfax', state: 'in', party: 'RED', faction: 'fact_red_lib', ideology: 'Liberal', age: 33, skills: [2, 3, 1, 0, 2, 3], command: 2, traits: ['Charismatic'], isHistorical: true },

  // Red Radical
  { first: 'Charles', last: 'Sumner', state: 'ma', party: 'RED', faction: 'fact_red_radical', ideology: 'LW Populist', age: 45, skills: [2, 4, 3, 0, 2, 1], command: 4, traits: ['Orator', 'Reformist', 'Puritan'], office: 'Senator', isHistorical: true },
  { first: 'Thaddeus', last: 'Stevens', state: 'pa', party: 'RED', faction: 'fact_red_radical', ideology: 'LW Populist', age: 64, skills: [2, 5, 3, 0, 1, 4], command: 4, traits: ['Orator', 'Reformist', 'Manipulative'], isHistorical: true },
  { first: 'Benjamin', last: 'Wade', state: 'oh', party: 'RED', faction: 'fact_red_radical', ideology: 'LW Populist', age: 56, skills: [2, 4, 2, 0, 1, 2], command: 3, traits: ['Reformist'], office: 'Senator', isHistorical: true },
  { first: 'Joshua', last: 'Giddings', state: 'oh', party: 'RED', faction: 'fact_red_radical', ideology: 'LW Populist', age: 61, skills: [2, 3, 2, 0, 1, 1], command: 2, traits: ['Reformist'], isHistorical: true },
  { first: 'Owen', last: 'Lovejoy', state: 'il', party: 'RED', faction: 'fact_red_radical', ideology: 'LW Populist', age: 45, skills: [2, 3, 1, 0, 1, 1], command: 2, traits: ['Reformist'], isHistorical: true },

  // Red Know Nothing
  { first: 'Millard', last: 'Fillmore', state: 'ny', party: 'RED', faction: 'fact_red_know', ideology: 'Conservative', age: 56, skills: [3, 2, 1, 0, 2, 2], command: 2, traits: ['Passive'], isHistorical: true },
  { first: 'Nathaniel P.', last: 'Banks', state: 'ma', party: 'RED', faction: 'fact_red_know', ideology: 'Moderate', age: 40, skills: [2, 3, 1, 1, 2, 3], command: 3, traits: ['Charismatic'], isHistorical: true },
  { first: 'Anson', last: 'Burlingame', state: 'ma', party: 'RED', faction: 'fact_red_know', ideology: 'Moderate', age: 36, skills: [2, 2, 1, 0, 1, 2], command: 2, traits: ['Globalist'], isHistorical: true },

  // Military
  { first: 'Winfield', last: 'Scott', state: 'va', party: 'RED', faction: 'fact_red_mod', ideology: 'Moderate', age: 70, skills: [2, 0, 0, 5, 0, 1], command: 3, traits: ['Military', 'Celebrity'], office: 'GeneralInChief', isHistorical: true },
  { first: 'Robert E.', last: 'Lee', state: 'va', party: null, faction: null, ideology: 'Conservative', age: 49, skills: [2, 0, 0, 5, 1, 1], command: 3, traits: ['Military'], isHistorical: true },
  { first: 'Ulysses S.', last: 'Grant', state: 'oh', party: null, faction: null, ideology: 'Moderate', age: 34, skills: [1, 0, 0, 4, 0, 0], command: 1, traits: ['Military'], isHistorical: true },
  { first: 'William T.', last: 'Sherman', state: 'oh', party: null, faction: null, ideology: 'Moderate', age: 36, skills: [1, 0, 0, 4, 0, 0], command: 1, traits: ['Military'], isHistorical: true },
  { first: 'George B.', last: 'McClellan', state: 'pa', party: 'BLUE', faction: 'fact_blue_popsov', ideology: 'Conservative', age: 30, skills: [2, 0, 0, 3, 0, 0], command: 2, traits: ['Military', 'Passive'], isHistorical: true },

  // Supreme Court 1856
  { first: 'Roger B.', last: 'Taney', state: 'md', party: null, faction: null, ideology: 'Traditionalist', age: 79, skills: [3, 2, 5, 0, 0, 2], command: 3, traits: [], office: 'ChiefJustice', isHistorical: true },
  { first: 'John', last: 'Catron', state: 'tn', party: null, faction: null, ideology: 'Conservative', age: 70, skills: [2, 1, 4, 0, 0, 1], command: 1, traits: [], office: 'AssociateJustice', isHistorical: true },
  { first: 'Peter V.', last: 'Daniel', state: 'va', party: null, faction: null, ideology: 'Traditionalist', age: 72, skills: [2, 1, 4, 0, 0, 1], command: 1, traits: [], office: 'AssociateJustice', isHistorical: true },
  { first: 'Samuel', last: 'Nelson', state: 'ny', party: null, faction: null, ideology: 'Conservative', age: 64, skills: [2, 1, 4, 0, 0, 1], command: 1, traits: [], office: 'AssociateJustice', isHistorical: true },
  { first: 'Robert C.', last: 'Grier', state: 'pa', party: null, faction: null, ideology: 'Conservative', age: 62, skills: [2, 1, 4, 0, 0, 1], command: 1, traits: [], office: 'AssociateJustice', isHistorical: true },
  { first: 'Benjamin R.', last: 'Curtis', state: 'ma', party: null, faction: null, ideology: 'Liberal', age: 47, skills: [2, 1, 4, 0, 0, 1], command: 2, traits: ['Integrity'], office: 'AssociateJustice', isHistorical: true },
  { first: 'John A.', last: 'Campbell', state: 'al', party: null, faction: null, ideology: 'Traditionalist', age: 45, skills: [2, 1, 4, 0, 0, 1], command: 1, traits: [], office: 'AssociateJustice', isHistorical: true },
  { first: 'James M.', last: 'Wayne', state: 'ga', party: null, faction: null, ideology: 'Conservative', age: 66, skills: [2, 1, 4, 0, 0, 1], command: 1, traits: [], office: 'AssociateJustice', isHistorical: true },
  { first: 'John', last: 'McLean', state: 'oh', party: null, faction: null, ideology: 'Liberal', age: 71, skills: [2, 1, 4, 0, 0, 1], command: 2, traits: ['Integrity'], office: 'AssociateJustice', isHistorical: true },
];

const SKILL_KEYS = ['admin', 'legislative', 'judicial', 'military', 'governing', 'backroom'] as const;

export function buildPoliticians1856(): Politician[] {
  const out: Politician[] = SEEDS.map((seed) => {
    const skills: Skills = {
      admin: seed.skills[0],
      legislative: seed.skills[1],
      judicial: seed.skills[2],
      military: seed.skills[3],
      governing: seed.skills[4],
      backroom: seed.skills[5],
    };
    return {
      id: uid('pol'),
      firstName: seed.first,
      lastName: seed.last,
      state: seed.state,
      factionId: seed.faction,
      partyId: seed.party,
      ideology: seed.ideology,
      age: seed.age,
      birthYear: 1856 - seed.age,
      skills,
      traits: seed.traits,
      currentOffice: seed.office ? { type: seed.office } : null,
      careerTrack: null,
      careerTrackYears: 0,
      command: seed.command,
      interests: [],
      isKingmaker: seed.command >= 4,
      flipFlopperPenalty: 0,
      pvCache: 0,
      isHistorical: !!seed.isHistorical,
    };
  });
  return out;
}

// Generate filler politicians to populate Senate (66 seats), House (~234 seats), governors
export function buildFillerPoliticians(year: number, count: number, factionPool: string[]): Politician[] {
  const firstNames = ['John', 'William', 'James', 'George', 'Henry', 'Thomas', 'Charles', 'Samuel', 'Edward', 'Robert', 'Andrew', 'Benjamin', 'Joseph', 'Daniel', 'David', 'Richard', 'Stephen', 'Frederick', 'Albert', 'Hiram'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams'];
  const ideologies: Ideology[] = ['LW Populist', 'Progressive', 'Liberal', 'Moderate', 'Conservative', 'Traditionalist', 'RW Populist'];
  const stateIds = ['me', 'nh', 'vt', 'ma', 'ri', 'ct', 'ny', 'nj', 'pa', 'de', 'md', 'va', 'nc', 'sc', 'ga', 'fl', 'al', 'ms', 'la', 'tx', 'ar', 'tn', 'ky', 'mo', 'oh', 'in', 'il', 'mi', 'wi', 'ia', 'ca'];

  const out: Politician[] = [];
  for (let i = 0; i < count; i++) {
    const fact = factionPool[i % factionPool.length];
    const party: 'BLUE' | 'RED' = fact.startsWith('fact_blue') ? 'BLUE' : 'RED';
    const skills: Skills = {
      admin: Math.floor(Math.random() * 3),
      legislative: Math.floor(Math.random() * 3) + 1,
      judicial: Math.floor(Math.random() * 2),
      military: Math.floor(Math.random() * 2),
      governing: Math.floor(Math.random() * 3),
      backroom: Math.floor(Math.random() * 3),
    };
    const age = 35 + Math.floor(Math.random() * 25);
    out.push({
      id: uid('pol'),
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      state: stateIds[Math.floor(Math.random() * stateIds.length)],
      factionId: fact,
      partyId: party,
      ideology: ideologies[Math.floor(Math.random() * ideologies.length)],
      age,
      birthYear: year - age,
      skills,
      traits: [],
      currentOffice: null,
      careerTrack: null,
      careerTrackYears: 0,
      command: Math.floor(Math.random() * 3),
      interests: [],
      isKingmaker: false,
      flipFlopperPenalty: 0,
      pvCache: 0,
      isHistorical: false,
    });
  }
  return out;
}

// Suppress unused warnings on the SKILL_KEYS export
export { SKILL_KEYS };
