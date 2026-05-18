import type { State } from '../types';

// Registry of all annexable territories. None of these exist in a scenario at
// start; they become real states only when admitted to the Union (via the
// Territories page, God Mode, or a future era event). A draftee whose home
// state is one of these will only enter the draft once that state has been
// admitted.

export type StateSeed = Omit<State, 'governorId' | 'senators' | 'representativeIds'>;

type Region = State['region'];

interface ExpansionDef {
  id: string;
  name: string;
  abbr: string;
  region: Region;
}

const DEFS: ExpansionDef[] = [
  { id: 'alberta', name: 'Alberta', abbr: 'ALB', region: 'Canada' },
  { id: 'amazonia', name: 'Amazonia', abbr: 'AMZ', region: 'Latin America' },
  { id: 'antilles', name: 'Antilles', abbr: 'ANT', region: 'Caribbean' },
  { id: 'argentina', name: 'Argentina', abbr: 'ARG', region: 'Latin America' },
  { id: 'bermuda', name: 'Bermuda', abbr: 'BMU', region: 'Atlantic' },
  { id: 'bogota', name: 'Bogota', abbr: 'BOG', region: 'Latin America' },
  { id: 'belize', name: 'Belize', abbr: 'BLZ', region: 'Latin America' },
  { id: 'bahamas', name: 'Bahamas', abbr: 'BHS', region: 'Caribbean' },
  { id: 'baja_sonora', name: 'Baja Sonora', abbr: 'BJS', region: 'Latin America' },
  { id: 'bolivia', name: 'Bolivia', abbr: 'BOL', region: 'Latin America' },
  { id: 'brazil', name: 'Brazil', abbr: 'BRA', region: 'Latin America' },
  { id: 'costa_rica', name: 'Costa Rica', abbr: 'CRC', region: 'Latin America' },
  { id: 'cuba', name: 'Cuba', abbr: 'CUB', region: 'Caribbean' },
  { id: 'davao', name: 'Davao', abbr: 'DVO', region: 'Pacific' },
  { id: 'durango', name: 'Durango', abbr: 'DGO', region: 'Latin America' },
  { id: 'ecuador', name: 'Ecuador', abbr: 'ECU', region: 'Latin America' },
  { id: 'el_salvador', name: 'El Salvador', abbr: 'SLV', region: 'Latin America' },
  { id: 'greenland', name: 'Greenland', abbr: 'GRL', region: 'Atlantic' },
  { id: 'guatemala', name: 'Guatemala', abbr: 'GTM', region: 'Latin America' },
  { id: 'guayas', name: 'Guayas', abbr: 'GYS', region: 'Latin America' },
  { id: 'guianas', name: 'Guianas', abbr: 'GUI', region: 'Latin America' },
  { id: 'haiti', name: 'Haiti', abbr: 'HTI', region: 'Caribbean' },
  { id: 'honduras', name: 'Honduras', abbr: 'HND', region: 'Latin America' },
  { id: 'iceland', name: 'Iceland', abbr: 'ISL', region: 'Atlantic' },
  { id: 'jamaica', name: 'Jamaica', abbr: 'JAM', region: 'Caribbean' },
  { id: 'latin_columbia', name: 'Latin Columbia', abbr: 'LCO', region: 'Latin America' },
  { id: 'liberia', name: 'Liberia', abbr: 'LBR', region: 'Atlantic' },
  { id: 'lima', name: 'Lima', abbr: 'LIM', region: 'Latin America' },
  { id: 'luzon', name: 'Luzon', abbr: 'LUZ', region: 'Pacific' },
  { id: 'manitoba', name: 'Manitoba', abbr: 'MAN', region: 'Canada' },
  { id: 'mindanao', name: 'Mindanao', abbr: 'MND', region: 'Pacific' },
  { id: 'miranda', name: 'Miranda', abbr: 'MIR', region: 'Latin America' },
  { id: 'monterrey', name: 'Monterrey', abbr: 'MTY', region: 'Latin America' },
  { id: 'new_brunswick', name: 'New Brunswick', abbr: 'NBR', region: 'Canada' },
  { id: 'newfoundland', name: 'Newfoundland', abbr: 'NFL', region: 'Canada' },
  { id: 'nicaragua', name: 'Nicaragua', abbr: 'NIC', region: 'Latin America' },
  { id: 'north_chile', name: 'North Chile', abbr: 'NCL', region: 'Latin America' },
  { id: 'northern_canada', name: 'Northern Canada', abbr: 'NCN', region: 'Canada' },
  { id: 'nova_scotia', name: 'Nova Scotia', abbr: 'NSC', region: 'Canada' },
  { id: 'old_mexico', name: 'Old Mexico', abbr: 'OMX', region: 'Latin America' },
  { id: 'ontario', name: 'Ontario', abbr: 'ONT', region: 'Canada' },
  { id: 'panama', name: 'Panama', abbr: 'PAN', region: 'Latin America' },
  { id: 'paraguay', name: 'Paraguay', abbr: 'PRY', region: 'Latin America' },
  { id: 'parana', name: 'Parana', abbr: 'PRN', region: 'Latin America' },
  { id: 'patagonia', name: 'Patagonia', abbr: 'PAT', region: 'Latin America' },
  { id: 'pernambuco', name: 'Pernambuco', abbr: 'PER', region: 'Latin America' },
  { id: 'peru', name: 'Peru', abbr: 'PRU', region: 'Latin America' },
  { id: 'puerto_rico', name: 'Puerto Rico', abbr: 'PRI', region: 'Caribbean' },
  { id: 'quebec', name: 'Quebec', abbr: 'QBC', region: 'Canada' },
  { id: 'quezon', name: 'Quezon', abbr: 'QZN', region: 'Pacific' },
  { id: 'rio', name: 'Rio', abbr: 'RIO', region: 'Latin America' },
  { id: 'santiago_chile', name: 'Santiago Chile', abbr: 'SCL', region: 'Latin America' },
  { id: 'santo_domingo', name: 'Santo Domingo', abbr: 'SDO', region: 'Caribbean' },
  { id: 'sao_paulo', name: 'Sao Paulo', abbr: 'SPO', region: 'Latin America' },
  { id: 'saskatchewan', name: 'Saskatchewan', abbr: 'SAS', region: 'Canada' },
  { id: 'toluca', name: 'Toluca', abbr: 'TOL', region: 'Latin America' },
  { id: 'uruguay', name: 'Uruguay', abbr: 'URY', region: 'Latin America' },
  { id: 'vancouver', name: 'Vancouver', abbr: 'VAN', region: 'Canada' },
  { id: 'venezuela', name: 'Venezuela', abbr: 'VEN', region: 'Latin America' },
  { id: 'visayas', name: 'Visayas', abbr: 'VIS', region: 'Pacific' },
  { id: 'yucatan', name: 'Yucatan', abbr: 'YUC', region: 'Latin America' },

  // Current U.S. states not in the base scenario roster
  { id: 'alaska', name: 'Alaska', abbr: 'AK', region: 'West' },
  { id: 'arizona', name: 'Arizona', abbr: 'AZ', region: 'West' },
  { id: 'colorado', name: 'Colorado', abbr: 'CO', region: 'West' },
  { id: 'hawaii', name: 'Hawaii', abbr: 'HI', region: 'Pacific' },
  { id: 'idaho', name: 'Idaho', abbr: 'ID', region: 'West' },
  { id: 'kansas', name: 'Kansas', abbr: 'KS', region: 'Midwest' },
  { id: 'minnesota', name: 'Minnesota', abbr: 'MN', region: 'Midwest' },
  { id: 'montana', name: 'Montana', abbr: 'MT', region: 'West' },
  { id: 'nebraska', name: 'Nebraska', abbr: 'NE', region: 'Midwest' },
  { id: 'nevada', name: 'Nevada', abbr: 'NV', region: 'West' },
  { id: 'new_mexico', name: 'New Mexico', abbr: 'NM', region: 'West' },
  { id: 'north_dakota', name: 'North Dakota', abbr: 'ND', region: 'Midwest' },
  { id: 'oklahoma', name: 'Oklahoma', abbr: 'OK', region: 'South' },
  { id: 'oregon', name: 'Oregon', abbr: 'OR', region: 'West' },
  { id: 'south_dakota', name: 'South Dakota', abbr: 'SD', region: 'Midwest' },
  { id: 'utah', name: 'Utah', abbr: 'UT', region: 'West' },
  { id: 'washington', name: 'Washington', abbr: 'WA', region: 'West' },
  { id: 'west_virginia', name: 'West Virginia', abbr: 'WV', region: 'Border' },
  { id: 'wyoming', name: 'Wyoming', abbr: 'WY', region: 'West' },

  // Current U.S. territories + D.C. (Puerto Rico already listed above)
  { id: 'guam', name: 'Guam', abbr: 'GUM', region: 'Pacific' },
  { id: 'us_virgin_islands', name: 'U.S. Virgin Islands', abbr: 'USV', region: 'Caribbean' },
  { id: 'american_samoa', name: 'American Samoa', abbr: 'ASM', region: 'Pacific' },
  { id: 'northern_marianas', name: 'Northern Mariana Islands', abbr: 'NMI', region: 'Pacific' },
  { id: 'district_of_columbia', name: 'District of Columbia', abbr: 'DC', region: 'Northeast' },

  // --- Bloc-level Western Hemisphere + Pacific completion ---

  // Canada — finish the provinces
  { id: 'prince_edward_island', name: 'Prince Edward Island', abbr: 'PEI', region: 'Canada' },

  // Mexico — full regional carve-up (Old Mexico/Durango/Monterrey/Baja
  // Sonora/Toluca/Yucatan already exist)
  { id: 'chihuahua', name: 'Chihuahua', abbr: 'CHH', region: 'Latin America' },
  { id: 'sinaloa', name: 'Sinaloa', abbr: 'SIN', region: 'Latin America' },
  { id: 'coahuila', name: 'Coahuila', abbr: 'COA', region: 'Latin America' },
  { id: 'tamaulipas', name: 'Tamaulipas', abbr: 'TAM', region: 'Latin America' },
  { id: 'jalisco', name: 'Jalisco', abbr: 'JAL', region: 'Latin America' },
  { id: 'veracruz', name: 'Veracruz', abbr: 'VER', region: 'Latin America' },
  { id: 'oaxaca', name: 'Oaxaca', abbr: 'OAX', region: 'Latin America' },
  { id: 'chiapas', name: 'Chiapas', abbr: 'CPS', region: 'Latin America' },
  { id: 'guerrero', name: 'Guerrero', abbr: 'GRO', region: 'Latin America' },
  { id: 'michoacan', name: 'Michoacan', abbr: 'MIC', region: 'Latin America' },
  { id: 'puebla', name: 'Puebla', abbr: 'PUE', region: 'Latin America' },

  // Caribbean — non-Hispanic islands
  { id: 'trinidad_tobago', name: 'Trinidad & Tobago', abbr: 'TTO', region: 'Caribbean' },
  { id: 'barbados', name: 'Barbados', abbr: 'BRB', region: 'Caribbean' },
  { id: 'windward_islands', name: 'Windward Islands', abbr: 'WIN', region: 'Caribbean' },
  { id: 'leeward_islands', name: 'Leeward Islands', abbr: 'LEE', region: 'Caribbean' },
  { id: 'cayman_turks', name: 'Cayman & Turks/Caicos', abbr: 'CTC', region: 'Caribbean' },
  { id: 'dutch_caribbean', name: 'Dutch Caribbean (Aruba & Curaçao)', abbr: 'DCB', region: 'Caribbean' },
  { id: 'french_antilles', name: 'French Antilles (Guadeloupe & Martinique)', abbr: 'FWI', region: 'Caribbean' },

  // South America — remaining
  { id: 'falkland_islands', name: 'Falkland Islands', abbr: 'FLK', region: 'Latin America' },

  // Pacific — Micronesia
  { id: 'marshall_islands', name: 'Marshall Islands', abbr: 'MHL', region: 'Pacific' },
  { id: 'micronesia', name: 'Federated States of Micronesia', abbr: 'FSM', region: 'Pacific' },
  { id: 'palau', name: 'Palau', abbr: 'PLW', region: 'Pacific' },
  { id: 'kiribati', name: 'Kiribati', abbr: 'KIR', region: 'Pacific' },
  { id: 'nauru', name: 'Nauru', abbr: 'NRU', region: 'Pacific' },

  // Pacific — Melanesia
  { id: 'fiji', name: 'Fiji', abbr: 'FJI', region: 'Pacific' },
  { id: 'vanuatu', name: 'Vanuatu', abbr: 'VUT', region: 'Pacific' },
  { id: 'new_caledonia', name: 'New Caledonia', abbr: 'NCD', region: 'Pacific' },
  { id: 'solomon_islands', name: 'Solomon Islands', abbr: 'SLB', region: 'Pacific' },
  { id: 'papua_new_guinea', name: 'Papua New Guinea', abbr: 'PNG', region: 'Pacific' },

  // Pacific — Polynesia
  { id: 'samoa', name: 'Samoa', abbr: 'WSM', region: 'Pacific' },
  { id: 'tonga', name: 'Tonga', abbr: 'TON', region: 'Pacific' },
  { id: 'tuvalu', name: 'Tuvalu', abbr: 'TUV', region: 'Pacific' },
  { id: 'french_polynesia', name: 'French Polynesia', abbr: 'PYF', region: 'Pacific' },
  { id: 'cook_islands', name: 'Cook Islands', abbr: 'COK', region: 'Pacific' },
  { id: 'niue', name: 'Niue', abbr: 'NIU', region: 'Pacific' },
  { id: 'tokelau', name: 'Tokelau', abbr: 'TKL', region: 'Pacific' },
  { id: 'wallis_futuna', name: 'Wallis & Futuna', abbr: 'WLF', region: 'Pacific' },
  { id: 'pitcairn', name: 'Pitcairn', abbr: 'PCN', region: 'Pacific' },
  { id: 'easter_island', name: 'Easter Island', abbr: 'EAS', region: 'Pacific' },

  // Pacific — bundled U.S. minor outlying islands
  { id: 'us_pacific_outlying', name: 'U.S. Pacific Outlying Islands', abbr: 'UPO', region: 'Pacific' },
];

export const EXPANSION_STATES: StateSeed[] = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  abbr: d.abbr,
  region: d.region,
  electoralVotes: 4,
  bias: 0,
  industries: { agriculture: 2, trade: 1 },
  isSlaveState: false,
  admissionYear: 0, // 0 = registry only, not yet admitted
}));

export const EXPANSION_STATES_BY_ID: Record<string, StateSeed> = Object.fromEntries(
  EXPANSION_STATES.map((s) => [s.id, s])
);

// Resolve a free-text state reference (id, abbreviation, or full name, in any
// case, spaces or underscores) to a canonical state id. `knownIds` should be
// the ids that already exist in the scenario (so base states still resolve).
export function resolveStateId(input: string, knownIds: string[] = []): string | null {
  const raw = input.trim().toLowerCase();
  if (!raw) return null;
  const slug = raw.replace(/[\s-]+/g, '_');
  // direct id match against expansion + known scenario ids
  if (EXPANSION_STATES_BY_ID[raw]) return raw;
  if (EXPANSION_STATES_BY_ID[slug]) return slug;
  if (knownIds.includes(raw)) return raw;
  if (knownIds.includes(slug)) return slug;
  // abbr / name match against expansion registry
  for (const s of EXPANSION_STATES) {
    if (s.abbr.toLowerCase() === raw) return s.id;
    if (s.name.toLowerCase() === raw) return s.id;
    if (s.name.toLowerCase().replace(/[\s-]+/g, '_') === slug) return s.id;
  }
  return null;
}
