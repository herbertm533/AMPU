import type { Politician, Skills, Trait, Ideology } from '../types';
import { uid } from '../rng';

interface Seed1772 {
  first: string;
  last: string;
  state: string;
  ideology: Ideology;
  age: number;
  skills: [number, number, number, number, number, number]; // admin, leg, jud, mil, gov, back
  command: number;
  traits?: Trait[];
  preferredParty?: 'BLUE' | 'RED';
  historical?: boolean;
}

const SEEDS: Seed1772[] = [
  // Blue Party — key figures
  { first: 'Samuel', last: 'Adams', state: 'ma', ideology: 'LW Populist', age: 50, skills: [2, 3, 1, 0, 2, 4], command: 1, traits: ['Orator'], preferredParty: 'BLUE' },
  { first: 'Thomas', last: 'Jefferson', state: 'va', ideology: 'RW Populist', age: 29, skills: [3, 4, 2, 0, 2, 2], command: 1, traits: ['Egghead'], preferredParty: 'BLUE' },
  { first: 'Patrick', last: 'Henry', state: 'va', ideology: 'Traditionalist', age: 36, skills: [1, 4, 2, 1, 3, 3], command: 1, traits: ['Orator', 'Debater'], preferredParty: 'BLUE' },
  { first: 'John', last: 'Hancock', state: 'ma', ideology: 'Moderate', age: 35, skills: [3, 2, 1, 0, 3, 3], command: 1, traits: ['Celebrity'], preferredParty: 'BLUE' },
  { first: 'George', last: 'Clinton', state: 'ny', ideology: 'Moderate', age: 33, skills: [2, 3, 1, 1, 3, 3], command: 0, preferredParty: 'BLUE' },
  { first: 'Richard Henry', last: 'Lee', state: 'va', ideology: 'Conservative', age: 40, skills: [2, 4, 2, 0, 2, 3], command: 0, traits: ['Debater'], preferredParty: 'BLUE' },
  { first: 'John', last: 'Dickinson', state: 'de', ideology: 'Conservative', age: 39, skills: [3, 4, 3, 0, 2, 2], command: 0, traits: ['Egghead'], preferredParty: 'BLUE' },
  { first: 'Thomas', last: 'Paine', state: 'pa', ideology: 'Progressive', age: 35, skills: [1, 2, 0, 0, 0, 1], command: 0, traits: ['Propagandist', 'Obscure'], preferredParty: 'BLUE' },
  { first: 'Elias', last: 'Boudinot', state: 'nj', ideology: 'Progressive', age: 32, skills: [2, 2, 2, 0, 1, 2], command: 0, preferredParty: 'BLUE' },
  { first: 'George', last: 'Mason', state: 'va', ideology: 'Traditionalist', age: 47, skills: [2, 3, 2, 0, 2, 3], command: 0, preferredParty: 'BLUE' },
  { first: 'Francis', last: 'Marion', state: 'sc', ideology: 'Traditionalist', age: 40, skills: [0, 0, 0, 4, 0, 1], command: 0, traits: ['Military'], preferredParty: 'BLUE' },
  { first: 'Ethan', last: 'Allen', state: 'nh', ideology: 'Moderate', age: 34, skills: [0, 0, 0, 3, 0, 2], command: 0, traits: ['Celebrity'], preferredParty: 'BLUE' },
  { first: 'Horatio', last: 'Gates', state: 'va', ideology: 'Moderate', age: 45, skills: [1, 0, 0, 3, 0, 1], command: 0, traits: ['Military'], preferredParty: 'BLUE' },
  { first: 'Daniel', last: 'Boone', state: 'nc', ideology: 'Traditionalist', age: 38, skills: [0, 0, 0, 2, 0, 0], command: 0, traits: ['Celebrity'], preferredParty: 'BLUE' },
  { first: 'Elbridge', last: 'Gerry', state: 'ma', ideology: 'Moderate', age: 28, skills: [2, 2, 1, 0, 1, 3], command: 0, traits: ['Manipulative'], preferredParty: 'BLUE' },

  // Red Party — key figures
  { first: 'George', last: 'Washington', state: 'va', ideology: 'Moderate', age: 40, skills: [2, 1, 0, 4, 2, 2], command: 1, traits: ['Leadership'], preferredParty: 'RED' },
  { first: 'John', last: 'Adams', state: 'ma', ideology: 'Moderate', age: 37, skills: [3, 3, 3, 0, 2, 2], command: 1, traits: ['Egghead', 'Debater'], preferredParty: 'RED' },
  { first: 'Benjamin', last: 'Franklin', state: 'pa', ideology: 'Moderate', age: 66, skills: [4, 3, 1, 0, 2, 4], command: 1, traits: ['Celebrity', 'Egghead'], preferredParty: 'RED' },
  { first: 'John', last: 'Jay', state: 'ny', ideology: 'Moderate', age: 27, skills: [3, 3, 3, 0, 2, 3], command: 0, preferredParty: 'RED' },
  { first: 'Henry', last: 'Laurens', state: 'sc', ideology: 'Traditionalist', age: 48, skills: [3, 2, 1, 1, 2, 3], command: 0, preferredParty: 'RED' },
  { first: 'Samuel', last: 'Huntington', state: 'ct', ideology: 'Conservative', age: 41, skills: [2, 3, 2, 0, 3, 2], command: 0, traits: ['Efficient'], preferredParty: 'RED' },
  { first: 'Roger', last: 'Sherman', state: 'ct', ideology: 'Moderate', age: 51, skills: [2, 3, 3, 0, 2, 2], command: 0, preferredParty: 'RED' },
  { first: 'James', last: 'Wilson', state: 'pa', ideology: 'Moderate', age: 30, skills: [3, 3, 4, 0, 1, 2], command: 0, traits: ['Egghead'], preferredParty: 'RED' },
  { first: 'Caesar', last: 'Rodney', state: 'de', ideology: 'Moderate', age: 44, skills: [2, 2, 1, 1, 2, 2], command: 0, preferredParty: 'RED' },
  { first: 'Israel', last: 'Putnam', state: 'ct', ideology: 'Moderate', age: 54, skills: [1, 0, 0, 3, 0, 1], command: 0, traits: ['Military'], preferredParty: 'RED' },
  { first: 'Nathanael', last: 'Greene', state: 'ri', ideology: 'Progressive', age: 30, skills: [1, 0, 0, 3, 0, 1], command: 0, traits: ['Military'], preferredParty: 'RED' },
  { first: 'Benedict', last: 'Arnold', state: 'ct', ideology: 'Moderate', age: 31, skills: [1, 0, 0, 3, 0, 1], command: 0, traits: ['Military'], preferredParty: 'RED' },
  { first: 'Daniel', last: 'Morgan', state: 'va', ideology: 'Conservative', age: 36, skills: [0, 0, 0, 3, 0, 0], command: 0, traits: ['Military'], preferredParty: 'RED' },
  { first: 'George', last: 'Wythe', state: 'va', ideology: 'Liberal', age: 46, skills: [2, 3, 4, 0, 1, 2], command: 0, traits: ['Egghead'], preferredParty: 'RED' },
  { first: 'Robert Treat', last: 'Paine', state: 'ma', ideology: 'Progressive', age: 41, skills: [2, 2, 3, 0, 1, 1], command: 0, preferredParty: 'RED' },
  { first: 'Benjamin', last: 'Rush', state: 'pa', ideology: 'Progressive', age: 27, skills: [2, 2, 1, 0, 1, 2], command: 0, traits: ['Egghead', 'Reformist'], preferredParty: 'RED' },
  { first: 'Thomas', last: 'McKean', state: 'de', ideology: 'Progressive', age: 38, skills: [2, 3, 3, 0, 2, 2], command: 0, preferredParty: 'RED' },
  { first: 'Oliver', last: 'Ellsworth', state: 'ct', ideology: 'Progressive', age: 27, skills: [2, 2, 3, 0, 1, 2], command: 0, preferredParty: 'RED' },
  { first: 'Benjamin', last: 'Lincoln', state: 'ma', ideology: 'Conservative', age: 39, skills: [2, 1, 0, 3, 2, 1], command: 0, traits: ['Military'], preferredParty: 'RED' },
  { first: 'John Paul', last: 'Jones', state: 'va', ideology: 'Moderate', age: 25, skills: [1, 0, 0, 3, 0, 0], command: 0, traits: ['Naval'], preferredParty: 'BLUE' },
  { first: 'John', last: 'Barry', state: 'pa', ideology: 'Moderate', age: 27, skills: [1, 0, 0, 2, 0, 0], command: 0, traits: ['Naval'], preferredParty: 'RED' },
  { first: 'Esek', last: 'Hopkins', state: 'ri', ideology: 'Moderate', age: 54, skills: [1, 0, 0, 3, 0, 0], command: 0, traits: ['Naval'], preferredParty: 'RED' },
  { first: 'William', last: 'Moultrie', state: 'sc', ideology: 'Conservative', age: 41, skills: [1, 0, 0, 3, 1, 1], command: 0, traits: ['Military'], preferredParty: 'RED' },
  { first: 'Arthur', last: 'St. Clair', state: 'pa', ideology: 'Conservative', age: 36, skills: [1, 0, 0, 2, 1, 1], command: 0, traits: ['Military'], preferredParty: 'RED' },
  { first: 'Philip', last: 'Schuyler', state: 'ny', ideology: 'Conservative', age: 39, skills: [2, 1, 0, 2, 1, 2], command: 0, preferredParty: 'RED' },
  { first: 'Timothy', last: 'Pickering', state: 'ma', ideology: 'Conservative', age: 27, skills: [2, 1, 1, 1, 1, 1], command: 0, traits: ['Puritan'], preferredParty: 'RED' },
];

const FIRST_FILLER = ['Josiah', 'Nathaniel', 'Stephen', 'William', 'James', 'John', 'Thomas', 'Edward', 'Robert', 'Charles', 'Henry', 'Andrew', 'Joseph', 'Daniel', 'Benjamin', 'Richard', 'Caleb', 'Lemuel', 'Silas', 'Gouverneur', 'Pierce', 'Rufus', 'Fisher'];
const LAST_FILLER = ['Sullivan', 'Pickens', 'Reed', 'Pendleton', 'Mifflin', 'Gibbs', 'Burke', 'Pratt', 'Carroll', 'Howard', 'Pinckney', 'Rutledge', 'Read', 'Bedford', 'Trumbull', 'Wolcott', 'Holten', 'Otis', 'Whipple', 'Bartlett', 'Gadsden', 'Clymer', 'King', 'Smith'];

const ALL_IDEOLOGIES: Ideology[] = ['LW Populist', 'Progressive', 'Liberal', 'Moderate', 'Conservative', 'Traditionalist', 'RW Populist'];
const STATE_IDS = ['nh', 'ma', 'ri', 'ct', 'ny', 'nj', 'pa', 'de', 'md', 'va', 'nc', 'sc', 'ga'];

export function buildPoliticians1772(): Politician[] {
  const out: Politician[] = SEEDS.map((s) => {
    const skills: Skills = {
      admin: s.skills[0],
      legislative: s.skills[1],
      judicial: s.skills[2],
      military: s.skills[3],
      governing: s.skills[4],
      backroom: s.skills[5],
    };
    return {
      id: uid('pol'),
      firstName: s.first,
      lastName: s.last,
      state: s.state,
      factionId: null,
      partyId: null,
      ideology: s.ideology,
      age: s.age,
      birthYear: 1772 - s.age,
      skills,
      traits: s.traits ?? [],
      currentOffice: null,
      careerTrack: null,
      careerTrackYears: 0,
      command: s.command,
      interests: [],
      isKingmaker: s.command >= 1,
      flipFlopperPenalty: 0,
      pvCache: 0,
      isHistorical: true,
    };
  });

  // Filler colonial-era politicians distributed across states for the draft pool.
  // Each colony needs a respectable bench so factions can fill delegate slots.
  for (let i = 0; i < 200; i++) {
    const stateId = STATE_IDS[i % STATE_IDS.length];
    const ideology = ALL_IDEOLOGIES[Math.floor(Math.random() * ALL_IDEOLOGIES.length)];
    const age = 28 + Math.floor(Math.random() * 30);
    const boost = Math.floor(Math.random() * 6);
    const skills: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
    skills[boost] = 2 + Math.floor(Math.random() * 2);
    // light random spread
    for (let j = 0; j < skills.length; j++) {
      if (j !== boost && Math.random() < 0.45) skills[j] = 1;
    }
    out.push({
      id: uid('pol'),
      firstName: FIRST_FILLER[Math.floor(Math.random() * FIRST_FILLER.length)],
      lastName: LAST_FILLER[Math.floor(Math.random() * LAST_FILLER.length)],
      state: stateId,
      factionId: null,
      partyId: null,
      ideology,
      age,
      birthYear: 1772 - age,
      skills: { admin: skills[0], legislative: skills[1], judicial: skills[2], military: skills[3], governing: skills[4], backroom: skills[5] },
      traits: Math.random() < 0.15 ? ['Obscure'] : [],
      currentOffice: null,
      careerTrack: null,
      careerTrackYears: 0,
      command: 0,
      interests: [],
      isKingmaker: false,
      flipFlopperPenalty: 0,
      pvCache: 0,
      isHistorical: false,
    });
  }
  return out;
}
