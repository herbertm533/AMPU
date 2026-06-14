import type { Era, State, MeterKey } from '../types';

export interface AnytimeNationalTemplate {
  id: string;
  category:
    | 'economic-panic' | 'economic-boom' | 'economic-harvest'
    | 'economic-currency' | 'economic-tariff' | 'economic-commodity'
    | 'demographic-immigration' | 'demographic-migration'
    | 'demographic-urbanization' | 'demographic-frontier'
    | 'foreign-trade' | 'foreign-war-scare' | 'foreign-treaty'
    | 'foreign-ally-shift'
    | 'civic-state-ripple' | 'civic-executive-scandal' | 'civic-patriotic-groundswell'
    | 'cultural-revival' | 'cultural-reform' | 'cultural-technology'
    | 'natural-storm' | 'natural-epidemic';
  eras?: Era[];
  regions?: State['region'][];
  weight: number;
  eraWeightMult?: Partial<Record<Era, number>>;
  scandalScaled?: boolean;
  effects: AnytimeNationalEffect[];
  text: string;
}

export type AnytimeNationalEffect =
  | { kind: 'meterTick';    meter: MeterKey; amount: number }
  | { kind: 'interestTick'; group: string;    amount: number }
  | { kind: 'partyPref';     amount: number }
  | { kind: 'stateBias';     amount: number };

export const ANYTIME_NATIONAL_TEMPLATES: AnytimeNationalTemplate[] = [
  // ---- economic ----
  {
    id: 'national:economic-panic',
    category: 'economic-panic',
    eras: ['federalism', 'nationalism', 'modern'],
    weight: 4,
    effects: [
      { kind: 'meterTick', meter: 'economic', amount: -2 },
      { kind: 'interestTick', group: 'WallStreet', amount: -2 },
      { kind: 'partyPref', amount: -0.2 },
    ],
    text: 'A financial panic sweeps the markets — banks fail and credit dries up.',
  },
  {
    id: 'national:economic-boom',
    category: 'economic-boom',
    weight: 4,
    effects: [
      { kind: 'meterTick', meter: 'economic', amount: 2 },
      { kind: 'meterTick', meter: 'revenue', amount: 1 },
      { kind: 'partyPref', amount: 0.15 },
    ],
    text: 'A surge of investment fuels an economic boom across the country.',
  },
  {
    id: 'national:bumper-harvest',
    category: 'economic-harvest',
    weight: 5,
    effects: [
      { kind: 'meterTick', meter: 'economic', amount: 1 },
      { kind: 'interestTick', group: 'BigAg', amount: 1 },
    ],
    text: 'A bumper harvest boosts agricultural states.',
  },
  {
    id: 'national:currency-crisis',
    category: 'economic-currency',
    eras: ['federalism', 'nationalism'],
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'economic', amount: -1 },
      { kind: 'interestTick', group: 'Reformers', amount: 1 },
    ],
    text: 'A currency crisis grips the nation — specie payments suspended.',
  },
  {
    id: 'national:tariff-debate',
    category: 'economic-tariff',
    eras: ['federalism', 'nationalism', 'modern'],
    weight: 3,
    effects: [
      { kind: 'interestTick', group: 'Manufacturers', amount: 1 },
      { kind: 'interestTick', group: 'FreeTrade', amount: -1 },
      { kind: 'partyPref', amount: 0.05 },
    ],
    text: 'A new tariff dispute reshapes the alignment of regional industries.',
  },
  {
    id: 'national:commodity-shock',
    category: 'economic-commodity',
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'economic', amount: -1 },
      { kind: 'interestTick', group: 'Planters', amount: -1 },
    ],
    text: 'A commodity price shock ripples through producing regions.',
  },

  // ---- demographic ----
  {
    id: 'national:immigration-wave',
    category: 'demographic-immigration',
    weight: 5,
    effects: [
      { kind: 'interestTick', group: 'Immigrants', amount: 2 },
      { kind: 'interestTick', group: 'Nativists', amount: 1 },
    ],
    text: 'An immigration wave reaches Northern ports.',
  },
  {
    id: 'national:internal-migration',
    category: 'demographic-migration',
    eras: ['federalism', 'nationalism'],
    weight: 3,
    effects: [
      { kind: 'interestTick', group: 'Settlers', amount: 1 },
      { kind: 'interestTick', group: 'Workers', amount: 1 },
    ],
    text: 'Internal migration reshapes regional politics — workers and settlers move in great numbers.',
  },
  {
    id: 'national:urbanization-surge',
    category: 'demographic-urbanization',
    eras: ['nationalism', 'modern'],
    weight: 3,
    effects: [
      { kind: 'interestTick', group: 'Manufacturers', amount: 1 },
      { kind: 'interestTick', group: 'BigAg', amount: -1 },
      { kind: 'meterTick', meter: 'domestic', amount: 1 },
    ],
    text: 'Cities surge with new arrivals — industrial interests gain political weight.',
  },
  {
    id: 'national:frontier-push',
    category: 'demographic-frontier',
    eras: ['independence', 'federalism', 'nationalism'],
    regions: ['West'],
    weight: 3,
    effects: [
      { kind: 'interestTick', group: 'Settlers', amount: 2 },
      { kind: 'stateBias', amount: 0.05 },
    ],
    text: 'Westward settlement pushes deeper into the frontier — Settlers gain influence.',
  },

  // ---- foreign ----
  {
    id: 'national:foreign-trade-news',
    category: 'foreign-trade',
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'economic', amount: 1 },
      { kind: 'interestTick', group: 'FreeTrade', amount: 1 },
    ],
    text: 'A favorable foreign-trade development brightens the economic outlook.',
  },
  {
    id: 'national:war-scare',
    category: 'foreign-war-scare',
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'military', amount: 1 },
      { kind: 'meterTick', meter: 'economic', amount: -1 },
      { kind: 'interestTick', group: 'MilitaryIndustrial', amount: 1 },
    ],
    text: 'Rumors of war rattle the capital — military preparations accelerate.',
  },
  {
    id: 'national:foreign-treaty',
    category: 'foreign-treaty',
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'quality', amount: 1 },
      { kind: 'partyPref', amount: 0.1 },
    ],
    text: 'A successful treaty negotiation enhances the standing of the administration.',
  },
  {
    id: 'national:ally-shift',
    category: 'foreign-ally-shift',
    weight: 2,
    effects: [
      { kind: 'meterTick', meter: 'military', amount: 1 },
      { kind: 'partyPref', amount: 0.05 },
    ],
    text: 'A diplomatic realignment shifts the balance of foreign allies.',
  },

  // ---- civic ----
  {
    id: 'national:railroad-accident',
    category: 'civic-state-ripple',
    eras: ['federalism', 'nationalism'],
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'quality', amount: -1 },
      { kind: 'partyPref', amount: -0.2 },
    ],
    text: 'A railroad accident kills dozens. Public anger rises.',
  },
  {
    id: 'national:treasury-scandal',
    category: 'civic-executive-scandal',
    weight: 3,
    scandalScaled: true,
    effects: [
      { kind: 'meterTick', meter: 'honest', amount: -1 },
      { kind: 'partyPref', amount: -0.2 },
    ],
    text: 'A scandal in the Treasury is uncovered.',
  },
  {
    id: 'national:patriotic-groundswell',
    category: 'civic-patriotic-groundswell',
    weight: 4,
    effects: [
      { kind: 'interestTick', group: 'Nationalists', amount: 2 },
      { kind: 'partyPref', amount: 0.05 },
    ],
    text: 'A patriotic groundswell sweeps the nation.',
  },

  // ---- cultural ----
  {
    id: 'national:religious-revival',
    category: 'cultural-revival',
    eras: ['independence', 'federalism', 'nationalism'],
    weight: 3,
    effects: [
      { kind: 'interestTick', group: 'Reformers', amount: 2 },
      { kind: 'interestTick', group: 'Nativists', amount: 1 },
    ],
    text: 'A religious revival sweeps congregations — Reformers gain new energy.',
  },
  {
    id: 'national:reform-movement',
    category: 'cultural-reform',
    eras: ['federalism', 'nationalism', 'modern'],
    weight: 3,
    effects: [
      { kind: 'interestTick', group: 'Reformers', amount: 2 },
      { kind: 'partyPref', amount: 0.05 },
    ],
    text: 'A reform-minded movement surges in the press and the pulpits.',
  },
  {
    id: 'national:cultural-technology',
    category: 'cultural-technology',
    eras: ['federalism', 'nationalism', 'modern'],
    weight: 2,
    effects: [
      { kind: 'meterTick', meter: 'quality', amount: 1 },
      { kind: 'interestTick', group: 'Manufacturers', amount: 1 },
    ],
    text: 'A new communications technology reshapes how politics reaches the public.',
  },

  // ---- natural ----
  {
    id: 'national:natural-storm',
    category: 'natural-storm',
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'economic', amount: -1 },
      { kind: 'meterTick', meter: 'quality', amount: -1 },
    ],
    text: 'A catastrophic storm devastates communities and disrupts the economy.',
  },
  {
    id: 'national:natural-epidemic',
    category: 'natural-epidemic',
    weight: 3,
    effects: [
      { kind: 'meterTick', meter: 'quality', amount: -1 },
      { kind: 'meterTick', meter: 'economic', amount: -1 },
      { kind: 'interestTick', group: 'Reformers', amount: 1 },
    ],
    text: 'A public-health epidemic spreads through the population — calls for reform grow.',
  },
];
