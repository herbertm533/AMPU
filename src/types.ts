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
  | 'Nationalist'
  | 'Globalist'
  | 'Reformist'
  | 'Egghead'
  | 'Leadership'
  | 'Likable'              // PR4b — warmth axis positive (Lincoln, Franklin, Clay)
  | 'Cosmopolitan'         // PR4b — geographic horizon positive (Jefferson, Hamilton, Sumner)
  | 'Predictable'          // PR4b — position-stability positive (Mason, Calhoun)
  | 'Hale'                 // PR4b — robustness positive (Jackson, JQ Adams, Washington)
  | 'Crisis Admin'         // PR6 — fiscal crisis competence (Hamilton, Chase)
  | 'Crisis Gov'           // PR6 — constitutional crisis competence (Lincoln, Washington Whiskey)
  | 'Decisive General'     // PR6 — wartime command effectiveness (Grant, Washington Trenton)
  | 'Domestic Warrior'     // PR6 — legislative / domestic-policy ranger (Calhoun, Clay, Sumner)
  | 'Iron Fist'            // PR6 — authoritarian governance (Jackson, Polk, Lincoln habeas)
  | 'Delegator'            // PR6 — multiplier UP on cabinet effects (Lincoln Team of Rivals)
  | 'Master Kingmaker'     // PR6 — internal_party install power (Clay 1824, Van Buren Albany Regency)
  | 'Incompetent'
  | 'Passive'
  | 'Unlikable'
  | 'Uncharismatic'        // PR4b — warmth axis negative (Madison, Chase, Polk)
  | 'Puritan'
  | 'Domestic Apathy'
  | 'Flip-Flopper'
  | 'Two-Faced'            // PR4b — position-stability negative (Burr, Webster)
  | 'Corrupt'
  | 'Scandalous'
  | 'Frail'
  | 'Controversial'
  | 'Obscure'
  | 'Traitor'
  | 'Carpetbagger'
  | 'Provincial'           // PR4b — geographic horizon negative (Henry, Sam Adams, A. Johnson)
  | 'Outsider'
  | 'Naive Strategist'     // PR6 — strategic incompetence (McClellan, St. Clair, Hull)
  | 'Micromanager'         // PR6 — multiplier DOWN on cabinet effects (Polk diary, Adams 1798)
  | 'Overeager'            // PR6 — acts before circumstances warrant (Pierce KS-NE, Wilkes Trent)
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
  'Nationalist',
  'Globalist',
  'Reformist',
  'Egghead',
  'Leadership',
  'Likable',                // PR4b
  'Cosmopolitan',           // PR4b
  'Predictable',            // PR4b
  'Hale',                   // PR4b
  'Crisis Admin',           // PR6
  'Crisis Gov',             // PR6
  'Decisive General',       // PR6
  'Domestic Warrior',       // PR6
  'Iron Fist',              // PR6 — mixed at lingering layer; positive at flat PV
  'Delegator',              // PR6
  'Master Kingmaker',       // PR6
  'Ideologue',
  'Loyal',
  'Ambitious',
];

export const NEGATIVE_TRAITS: Trait[] = [
  'Incompetent',
  'Passive',
  'Unlikable',
  'Uncharismatic',          // PR4b
  'Puritan',
  'Domestic Apathy',
  'Flip-Flopper',
  'Two-Faced',              // PR4b
  'Corrupt',
  'Scandalous',
  'Frail',
  'Controversial',
  'Obscure',
  'Traitor',
  'Carpetbagger',
  'Provincial',             // PR4b
  'Outsider',
  'Naive Strategist',       // PR6
  'Micromanager',           // PR6
  'Overeager',              // PR6
  'Impressionable',
  'Opportunist',
  'Failed Bid',
];

// Expertise — a third character axis, distinct from skills and traits: what a
// politician studied or worked their way up through. Exactly 19 tags.
export type Expertise =
  | 'Agriculture' | 'Business' | 'Economics' | 'Education' | 'Energy'
  | 'Environment' | 'Foreign Affairs' | 'Healthcare' | 'Housing' | 'Justice'
  | 'Labor' | 'Media' | 'Military' | 'Naval' | 'Science' | 'Technology'
  | 'Trade' | 'Transportation' | 'Welfare';

export const EXPERTISE: Expertise[] = [
  'Agriculture', 'Business', 'Economics', 'Education', 'Energy', 'Environment',
  'Foreign Affairs', 'Healthcare', 'Housing', 'Justice', 'Labor', 'Media',
  'Military', 'Naval', 'Science', 'Technology', 'Trade', 'Transportation', 'Welfare',
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
  Private: ['Celebrity', 'Propagandist', 'Orator'],
  Military: ['Crisis Manager', 'Leadership'],
  Governing: ['Leadership', 'Charismatic', 'Harmonious'],
  Administration: ['Efficient', 'Egghead', 'Leadership'],
  Legislative: ['Orator', 'Debater', 'Reformist'],
  Judicial: ['Integrity', 'Egghead', 'Harmonious'],
  Backroom: ['Manipulative', 'Kingmaker', 'Numberfudger'],
};

// Career-track exit -> expertise (the Military/Naval and economic themes that
// left TRACK_THEMED_TRAITS now land on the expertise axis). null = no grant.
export const TRACK_EXPERTISE: Record<CareerTrack, Expertise | null> = {
  Private: 'Business',
  Military: 'Military',
  Governing: 'Agriculture',
  Administration: 'Economics',
  Legislative: null,
  Judicial: 'Justice',
  Backroom: null,
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
// PR7 — Lobby → Expertise grant. null = non-economic lobby (no grant).
// Drives the trickle pass in 2.1.2 (per held card, per member, chance-gated).
export const LOBBY_EXPERTISE: Record<LobbyCardId, Expertise | null> = {
  // 1772
  Merchants: 'Business',
  Planters: 'Agriculture',
  SmallFarmers: 'Agriculture',
  Lawyers: 'Justice',
  Patriots: null,
  NationalUnity: null,
  Reformers: null,
  // 1856
  SlavePower: 'Agriculture',
  NorthernIndustry: 'Business',
  Expansionists: 'Foreign Affairs',
  UrbanLabor: 'Labor',
  Abolitionists: null,
  EvangelicalReform: null,
  ProUnion: null,
  Nativists: null,
};

// PR7 — Lobby → Industry +1 nudge. Keys MUST match era State.industries keys
// verbatim. Cards listing a key absent on a given state are no-ops (skip-if-
// missing in the nudge pass) — single combined map is correct in both eras.
// Empty arrays = non-economic lobbies or anachronistic associations
// (UrbanLabor in 1856 has no union-vs-mfg sign before ~1870).
export const LOBBY_INDUSTRY: Record<LobbyCardId, readonly string[]> = {
  Merchants: ['shipping', 'finance'],
  Planters: ['tobacco'],
  SmallFarmers: ['agriculture'],
  SlavePower: ['cotton', 'tobacco'],
  NorthernIndustry: ['manufacturing', 'coal'],
  Expansionists: ['agriculture'],
  Lawyers: [],
  UrbanLabor: [],
  Patriots: [],
  NationalUnity: [],
  Reformers: [],
  Abolitionists: [],
  EvangelicalReform: [],
  ProUnion: [],
  Nativists: [],
};

// PR7 — Expertise economic lean on the LW(−)…RW(+) axis. Partial: only
// economically-meaningful tags carry a sign (Agriculture, Business, Labor);
// absent tags default 0. Business is deliberately half-weight (1772 commerce
// was Federalist/center; 1856 Northern industry was center-left Republican —
// sign is historiographically ambiguous).
export const EXPERTISE_IDEOLOGY_LEAN: Partial<Record<Expertise, number>> = {
  Agriculture: 1,
  Business: 0.5,
  Labor: -1,
};

// PR7 — Tuning knobs (co-located so the human can dial without touching
// engine code). Max |econLean| is 1 → max factionCenter shift is the weight.
export const LOBBY_RULES = {
  expertiseGrantOdds: 0.10,
  factionExpertiseBiasWeight: 0.5,
} as const;

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

export const ABILITY_LOSS_RULES = {
  // --- Old-age decay (runPhase_2_4_1_Deaths) ---
  oldAge: {
    minAge: 70,            // below this, decay chance is 0 (aligns with pv.ts:83 age penalty + the 70+ death/retire brackets)
    baseChance: 0.10,      // per-turn P(one decay event) at/above minAge; mid of the ~8-12% band
    // Additive bumps to baseChance by age bracket (descending; first match wins, like MORTALITY_RULES.deathBracket).
    ageBracketBonus: [
      { minAge: 85, bonus: 0.06 },
      { minAge: 78, bonus: 0.03 },
      { minAge: 70, bonus: 0.0  },
    ],
    amount: 1,             // points removed from the chosen stat per fired event
    // Longevity mitigation slot (Q9): Hale is NOT in the Trait union, so this is
    // unused in PR2a and left here only as the documented hook for the trait PR.
    haleChanceMult: 1.0,
  },

  // --- Battle-loss penalties (runRevWarBattles) ---
  // Per the F-BATTLE-TIER reference. Each entry is the stat -> points to dock the
  // senior commander on a LOST battle of that type/tier. Command & judicial never appear.
  battle: {
    // Ground losses, by difficulty tier.
    groundLossByTier: {
      difficult: { military: 1 },
      moderate:  { military: 1, governing: 1, legislative: 1, admin: 1 },
      easy:      { military: 1, governing: 1, legislative: 1, admin: 1 },
    },
    // Naval losses have no difficulty tier in AMPU -> military only.
    navalLoss: { military: 1 },
    // Phase-level: losing the MAJORITY of ground battles this phase -> admin -1 (Q16: IN).
    majorityGroundLossAdmin: 1,
  },
} as const satisfies {
  oldAge: {
    minAge: number; baseChance: number;
    ageBracketBonus: { minAge: number; bonus: number }[];
    amount: number; haleChanceMult: number;
  };
  battle: {
    groundLossByTier: Record<'difficult' | 'moderate' | 'easy', Partial<Record<SkillKey, number>>>;
    navalLoss: Partial<Record<SkillKey, number>>;
    majorityGroundLossAdmin: number;
  };
};

// PR2b earn lifecycle. Magnitudes for every earn grant live here so engine
// bodies stay free of magic numbers (mirrors ABILITY_LOSS_RULES above).
export const ABILITY_EARN_RULES = {
  // Independent secondary-skill roll inside rollThreshold. Half of
  // CAREER_ODDS.skill (= 0.5), so secondaries accrue at half the rate of
  // primaries; the existing primary roll is unchanged.
  secondaryTrack: 0.25,
  // Cabinet confirmation -> admin (F-DOUBLING). Ladder:
  //   none           -> base                    = 1
  //   Egghead alone  -> base * eggheadMult      = 2
  //   Efficient alone-> base * efficientMult    = 2
  //   both           -> base * both mults       = 4
  // Computed at the call site; addSkillPoint clamps at 5 so a politician at
  // admin=4 with both traits jumps to 5, not 8.
  cabinetConfirmAdmin: {
    base: 1,
    eggheadMult: 2,
    efficientMult: 2,
  },
} as const satisfies {
  secondaryTrack: number;
  cabinetConfirmAdmin: { base: number; eggheadMult: number; efficientMult: number };
};

// Office -> command grant on initial appointment. Only Secretary of State
// today (reference's "initial appointment to Secretary of State" Command earn).
// Navy + Interior + PMG deliberately absent — administrative seats.
export const OFFICE_COMMAND_GRANT: Partial<Record<OfficeType, number>> = {
  SecretaryOfState: 1,
};

// Office -> admin grant on cabinet confirmation. F-DOUBLING ladder applied at
// the call site (see ABILITY_EARN_RULES.cabinetConfirmAdmin); the value here
// is the BASE (1). Iterated by runPhase_2_3_1_Cabinet for each era-active seat.
export const OFFICE_ADMIN_GRANT: Partial<Record<OfficeType, number>> = {
  SecretaryOfState: 1,
  SecretaryOfTreasury: 1,
  SecretaryOfWar: 1,
  SecretaryOfNavy: 1,
  AttorneyGeneral: 1,
  SecretaryOfInterior: 1,
  PostmasterGeneral: 1,
};

// Career-track exit -> secondary skill pool (per the reference: "all other
// tracks but Legislative grant Admin" -> Legislative track does NOT grant
// Admin as a secondary). Judicial and Backroom are [] because the per-ability
// Earn lists do not name them as secondary-granters.
export const TRACK_SECONDARY_SKILLS: Record<CareerTrack, SkillKey[]> = {
  Administration: ['legislative', 'governing'],
  Military:       ['admin'],
  Governing:      ['admin', 'legislative'],
  Legislative:    ['governing'],     // admin EXCLUDED per source text
  Judicial:       [],
  Private:        ['governing', 'admin'],
  Backroom:       [],
};

// PR3 trait lifecycle. Magnitudes for every trait erosion / d6 conflict live
// here so engine bodies stay free of magic numbers (mirrors ABILITY_LOSS_RULES /
// ABILITY_EARN_RULES above).
export const TRAIT_LIFECYCLE_RULES = {
  oldAge: {
    minAge: 70,
    baseChance: 0.05,
    ageBracketBonus: [
      { minAge: 85, bonus: 0.03 },
      { minAge: 78, bonus: 0.02 },
      { minAge: 70, bonus: 0.0  },
    ],
    amount: 1,
    fadingPool: ['Celebrity', 'Charismatic', 'Hale',
                 'Crisis Admin', 'Crisis Gov', 'Decisive General'] as Trait[],
  },
  leadershipLossOnBattleLoss: { chance: 0.5 },
  conflictD6Threshold: 4,
} as const satisfies {
  oldAge: {
    minAge: number; baseChance: number;
    ageBracketBonus: { minAge: number; bonus: number }[];
    amount: number;
    fadingPool: Trait[];
  };
  leadershipLossOnBattleLoss: { chance: number };
  conflictD6Threshold: number;
};

// Symmetric trait-conflict pairing. Both directions listed so a lookup of
// either side works (e.g. both Charismatic -> Unlikable AND Unlikable ->
// Charismatic).
// PR6: value type widened to `Trait | Trait[]` to preserve PR3's symmetric-
// pair invariant when a single trait conflicts with multiple others. Passive
// participates in BOTH the PR3 Efficient pair AND the PR6 Overeager pair; a
// single-value mapping would silently break PR3 AC #14. tryGrantTrait
// normalizes to array and iterates.
export const TRAIT_CONFLICTS: Partial<Record<Trait, Trait | Trait[]>> = {
  Charismatic:    'Unlikable',
  Unlikable:      'Charismatic',
  Harmonious:     'Puritan',
  Puritan:        'Harmonious',
  Integrity:      'Corrupt',
  Corrupt:        'Integrity',
  Efficient:      'Passive',
  Egghead:        'Incompetent',
  Incompetent:    'Egghead',
  Ideologue:      'Impressionable',
  Impressionable: 'Ideologue',
  Loyal:          'Opportunist',
  Opportunist:    'Loyal',
  // --- PR4b additions (4 pairs × 2 directions = 8 entries) ---
  Likable:        'Uncharismatic',
  Uncharismatic:  'Likable',
  Cosmopolitan:   'Provincial',
  Provincial:     'Cosmopolitan',
  'Two-Faced':    'Predictable',
  Predictable:    'Two-Faced',
  Hale:           'Frail',
  Frail:          'Hale',
  // --- PR6 additions (5 pairs × 2 directions = 10 entries) ---
  'Decisive General': 'Naive Strategist',
  'Naive Strategist': 'Decisive General',
  Delegator:          'Micromanager',
  Micromanager:       'Delegator',
  'Domestic Warrior': 'Domestic Apathy',
  'Domestic Apathy':  'Domestic Warrior',
  'Master Kingmaker': 'Outsider',
  Outsider:           'Master Kingmaker',
  Overeager:          'Passive',
  Passive:            ['Efficient', 'Overeager'],
};

// PR4a election contexts. Six locked contexts (spec AC #2). Senate uses
// senatePre17 in BOTH AMPU scenarios (neither reaches 1913 / 17th Amendment;
// spec F-SENATE-BOTH-ERAS).
export type ElectionContext =
  | 'presGeneral'
  | 'presPrimary'
  | 'house'
  | 'senatePre17'
  | 'governor'
  | 'internalParty';

// PR4a per-trait per-context magnitudes. Flat array of rule rows so the four
// cross-cutting cases (era-scaled Domestic Apathy, Integrity bump vs tainted
// opponent, Unlikable bump vs Charismatic opponent, Scandalous/Controversial
// bump vs Integrity opponent) fit naturally — a nested Record would force
// sentinel objects inside the inner shape.
//
// Magnitude bands (CP1 locked at the band level; numerics PM-recommended):
//   SMALL  = 2  (≈ 2 pct-pts on calcStateVote score; ≈ 2 score-pts on internal-party path)
//   MEDIUM = 4
//   LARGE  = 8
//
// Negative-trait rows carry negative magnitudes. `era` is undefined for rows
// that apply in BOTH AMPU scenarios; populated only on the Domestic-Apathy
// era split (per F-DOMESTIC-APATHY-ERA-SCALED). `opponentConditional` is the
// per-row bump that fires when the opponent holds the listed trait — used
// for the three locked cases (spec AC #15).
export const TRAIT_ELECTION_BANDS = {
  SMALL: 2,
  MEDIUM: 4,
  LARGE: 8,
} as const satisfies { SMALL: number; MEDIUM: number; LARGE: number };

export interface TraitElectionRule {
  trait: Trait;
  context: ElectionContext;
  magnitude: number;                 // signed; negative for hits
  era?: Era;                         // row applies only when snap era matches; undefined = all eras
  opponentConditional?: {
    ifOpponentHas: Trait[];          // if ANY opponent holds one of these, swap to bumped
    bumpedMagnitude: number;         // signed; replaces magnitude when triggered (not added)
  };
}

export const TRAIT_ELECTION_EFFECTS: TraitElectionRule[] = [
  // --- Charismatic --- (all eras; mild dampening in pre-17 Senate per F-SENATE-BOTH-ERAS)
  { trait: 'Charismatic', context: 'presGeneral',   magnitude:  TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Charismatic', context: 'presPrimary',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Charismatic', context: 'house',         magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Charismatic', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Charismatic', context: 'governor',      magnitude:  TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Charismatic', context: 'internalParty', magnitude:  TRAIT_ELECTION_BANDS.SMALL  },

  // --- Integrity --- (all eras; opponent-conditional MEDIUM vs tainted in presGeneral/house/governor only — AC #15)
  { trait: 'Integrity', context: 'presGeneral', magnitude: TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Scandalous', 'Controversial', 'Corrupt'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Integrity', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Integrity', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Scandalous', 'Controversial', 'Corrupt'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Integrity', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Integrity', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Scandalous', 'Controversial', 'Corrupt'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Integrity', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.SMALL },

  // --- Debater --- (all eras flat — Q3 SHIP FLAT; LARGE on internal-party / Webster-Hayne)
  { trait: 'Debater', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Debater', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Debater', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Debater', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Debater', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Debater', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.LARGE  },

  // --- Propagandist --- (concept-native to both eras; term anachronism is display-only)
  { trait: 'Propagandist', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Propagandist', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Propagandist', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.SMALL  },

  // --- Harmonious --- (consensus archetype; Pierce 1852 — MEDIUM in convention/senate)
  { trait: 'Harmonious', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Harmonious', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Harmonious', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Harmonious', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Harmonious', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Harmonious', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Magician --- (Van Buren/Douglas; LARGE on senatePre17 + internal-party)
  { trait: 'Magician', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Magician', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Magician', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Magician', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.LARGE  },
  { trait: 'Magician', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Magician', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.LARGE  },

  // --- Unlikable --- (Adams 1800; opp-conditional vs Charismatic in presGeneral only)
  { trait: 'Unlikable', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Charismatic'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Unlikable', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Unlikable', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Unlikable', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Unlikable', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Unlikable', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Puritan --- (Garrison/Sumner — consensus blocker; MEDIUM hit on senatePre17/internal)
  { trait: 'Puritan', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Puritan', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Puritan', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Puritan', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Puritan', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Puritan', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Numberfudger --- (Q2 WIRE-SMALL; only popular-vote contexts, no internal/senate/primary)
  { trait: 'Numberfudger', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Numberfudger', context: 'house',       magnitude: -TRAIT_ELECTION_BANDS.SMALL },
  { trait: 'Numberfudger', context: 'governor',    magnitude: -TRAIT_ELECTION_BANDS.SMALL },

  // --- Scandalous --- (Hamilton-1797 vs Jackson-1828 contrast; opp-conditional vs Integrity)
  { trait: 'Scandalous', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Scandalous', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Scandalous', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Scandalous', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Scandalous', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Scandalous', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Controversial --- (Jackson/Douglas/Brooks; symmetric with Scandalous on Integrity)
  { trait: 'Controversial', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Controversial', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Controversial', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Controversial', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Controversial', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Integrity'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Controversial', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Obscure --- (Pierce 1852 dark-horse: POSITIVE in presPrimary; legislators know everyone in senatePre17)
  { trait: 'Obscure', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Obscure', context: 'presPrimary',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Obscure', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  // senatePre17: NONE (no row — legislators know everyone; spec's intentional gap)
  { trait: 'Obscure', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Obscure', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Domestic Apathy --- (F-DOMESTIC-APATHY-ERA-SCALED; era-split on presGeneral; flat on house/governor)
  // 1772 scenario (independence + federalism) — -SMALL on presGeneral
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  // 1856 scenario (nationalism+) — -MEDIUM on presGeneral
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism'  },
  { trait: 'Domestic Apathy', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'       },
  // House / Governor — flat MEDIUM all eras (domestic district / state issues hit consistently)
  { trait: 'Domestic Apathy', context: 'house',    magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Domestic Apathy', context: 'governor', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  // senatePre17 / presPrimary / internalParty: NONE (no rows)

  // --- Carpetbagger --- (label kept per Q1; trait alone is the gate — trait granted only by successful relocation)
  { trait: 'Carpetbagger', context: 'house',       magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Carpetbagger', context: 'senatePre17', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Carpetbagger', context: 'governor',    magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  // presGeneral / presPrimary / internalParty: NONE (state-level only)

  // --- Outsider --- (Jackson/Frémont; flat per Q5 — no anti-establishment mood meter in PR4a)
  { trait: 'Outsider', context: 'presGeneral',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Outsider', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Outsider', context: 'house',         magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Outsider', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Outsider', context: 'governor',      magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Outsider', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },

  // === PR4b NEW TRAITS ===

  // --- Likable --- (warmth axis positive — Lincoln/Franklin/Clay; opp-conditional vs Unlikable in presGeneral)
  { trait: 'Likable', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM,
    opponentConditional: { ifOpponentHas: ['Unlikable'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Likable', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Likable', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Likable', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Likable', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Likable', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Uncharismatic --- (warmth axis negative — Madison/Chase/Polk; opp-conditional vs Charismatic in presGeneral)
  { trait: 'Uncharismatic', context: 'presGeneral',   magnitude: -TRAIT_ELECTION_BANDS.SMALL,
    opponentConditional: { ifOpponentHas: ['Charismatic'],
                           bumpedMagnitude: -TRAIT_ELECTION_BANDS.MEDIUM } },
  { trait: 'Uncharismatic', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Uncharismatic', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // senatePre17: NONE (Chase reached Senate 1849 — Uncharismatic ~neutral in pre-17 state-leg)
  { trait: 'Uncharismatic', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Uncharismatic', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Cosmopolitan --- (geographic horizon positive — Jefferson/Hamilton/Sumner; era-scaled)
  // 1856 scenario (nationalism + modern) — +MEDIUM in presGeneral
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  // 1772 scenario (independence + federalism) — +SMALL in presGeneral
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Cosmopolitan', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Cosmopolitan', context: 'presPrimary',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Cosmopolitan', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // senatePre17 era-scaled — 1856 state-legs (MA/NY) responded to Sumner/Seward; 1772 more locally focused
  { trait: 'Cosmopolitan', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL, era: 'nationalism' },
  { trait: 'Cosmopolitan', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL, era: 'modern'      },
  // senatePre17 in independence/federalism: NONE (no row — assumption per spec Open Q9)
  { trait: 'Cosmopolitan', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Cosmopolitan', context: 'internalParty', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Provincial --- (geographic horizon negative — Henry/Sam Adams/A. Johnson; era-scaled)
  // 1856 scenario — -MEDIUM in presGeneral; 1772 — -SMALL
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Provincial', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Provincial', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // house/governor: era-scaled — bumped harder in nationalism/modern
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Provincial', context: 'house',    magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Provincial', context: 'senatePre17',   magnitude:  TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Provincial', context: 'governor', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Provincial', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.SMALL  },

  // --- Two-Faced --- (position-stability negative — Burr/Webster; era-scaled in popular-vote contexts; flat LARGE in primary/internal)
  // presGeneral era-scaled: 1856+partisan-press -MEDIUM; 1772 -SMALL
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Two-Faced', context: 'presGeneral', magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Two-Faced', context: 'presPrimary',   magnitude: -TRAIT_ELECTION_BANDS.LARGE  },
  { trait: 'Two-Faced', context: 'house',         magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  // senatePre17 era-scaled (Webster lost his New England state-leg base after 7th of March)
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism' },
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern'      },
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'independence' },
  { trait: 'Two-Faced', context: 'senatePre17',   magnitude: -TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism'   },
  { trait: 'Two-Faced', context: 'governor',      magnitude: -TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Two-Faced', context: 'internalParty', magnitude: -TRAIT_ELECTION_BANDS.LARGE  },

  // --- Predictable --- (position-stability positive — Mason/Calhoun; flat both eras)
  { trait: 'Predictable', context: 'presGeneral',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.MEDIUM },
  { trait: 'Predictable', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Predictable', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.MEDIUM },

  // --- Hale --- (robustness positive — Jackson/Houston/JQ Adams; era-scaled presGeneral; opp-conditional vs Frail = LARGE)
  // presGeneral era-scaled: 1856+ stump-era +MEDIUM, 1772 +SMALL; opp-conditional vs Frail → +LARGE in BOTH eras
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'nationalism',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.MEDIUM, era: 'modern',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'independence',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presGeneral', magnitude:  TRAIT_ELECTION_BANDS.SMALL,  era: 'federalism',
    opponentConditional: { ifOpponentHas: ['Frail'],
                           bumpedMagnitude: TRAIT_ELECTION_BANDS.LARGE } },
  { trait: 'Hale', context: 'presPrimary',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'house',         magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'senatePre17',   magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'governor',      magnitude: TRAIT_ELECTION_BANDS.SMALL  },
  { trait: 'Hale', context: 'internalParty', magnitude: TRAIT_ELECTION_BANDS.SMALL  },
];

// PR6 governance contexts — 4 contexts orthogonal to PR4a's 6 election contexts.
// governance_crisis: era-event modulation (Dred Scott, John Brown, Secession Winter, Trent Affair)
// lingering_phase:   per-turn meter drift in runPhase_2_5_1_Lingering
// military_command:  wartime Command grant in runPhase_2_3_2_Military
// internal_party:    faction-leader / dark-horse install bonus (faction scoring path)
export type GovernanceContext =
  | 'governance_crisis'
  | 'lingering_phase'
  | 'military_command'
  | 'internal_party';

// Numerically identical to TRAIT_ELECTION_BANDS — named separately for
// clarity at consumer sites and to leave PR6 with its own dial.
export const TRAIT_GOVERNANCE_BANDS = {
  SMALL: 2,
  MEDIUM: 4,
  LARGE: 8,
} as const satisfies { SMALL: number; MEDIUM: number; LARGE: number };

export interface TraitGovernanceRule {
  trait: Trait;
  context: GovernanceContext;
  // Signed additive magnitude (default semantics). When `multiplier`
  // is set, the rule applies multiplicatively to the consumer's base
  // and `magnitude` is treated as 0.
  magnitude: number;
  // Optional meter override on lingering_phase split rows (Iron Fist
  // emits two rows: one for `honest`, one for `domestic`). When
  // omitted, the consumer uses the seat's primary meter or the chosen
  // response's `meters` field.
  meter?: keyof NationalMeters;
  // Delegator / Micromanager only. When set, the consumer multiplies
  // the base bonus / response-meter swing by this factor (1.5 = +50%,
  // 0.5 = -50%).
  multiplier?: number;
}

export const TRAIT_GOVERNANCE_EFFECTS: TraitGovernanceRule[] = [
  // --- Crisis Admin (Hamilton, Morris, Gallatin, Chase) ---
  { trait: 'Crisis Admin', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.LARGE  },
  { trait: 'Crisis Admin', context: 'lingering_phase',   magnitude: TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'economic' },
  { trait: 'Crisis Admin', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL  },

  // --- Crisis Gov (Lincoln, Washington Whiskey, Adams XYZ) ---
  { trait: 'Crisis Gov', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.LARGE  },
  { trait: 'Crisis Gov', context: 'lingering_phase',   magnitude: TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'domestic' },
  { trait: 'Crisis Gov', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL  },

  // --- Decisive General (Grant, Sherman, Washington Trenton) ---
  { trait: 'Decisive General', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Decisive General', context: 'military_command',  magnitude: TRAIT_GOVERNANCE_BANDS.LARGE },

  // --- Naive Strategist (McClellan, St. Clair, Hull, Floyd) ---
  { trait: 'Naive Strategist', context: 'governance_crisis', magnitude: -TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Naive Strategist', context: 'military_command',  magnitude: -TRAIT_GOVERNANCE_BANDS.LARGE },

  // --- Domestic Warrior (Calhoun, Clay, Sumner, Madison Bill of Rights) ---
  { trait: 'Domestic Warrior', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL  },
  { trait: 'Domestic Warrior', context: 'lingering_phase',   magnitude: TRAIT_GOVERNANCE_BANDS.MEDIUM, meter: 'domestic' },
  { trait: 'Domestic Warrior', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.MEDIUM },

  // --- Iron Fist (Jackson, Polk, Lincoln habeas, Adams Sedition) ---
  // SPLIT on lingering_phase: +SMALL honest, -SMALL domestic per AC #6.
  { trait: 'Iron Fist', context: 'governance_crisis', magnitude:  TRAIT_GOVERNANCE_BANDS.MEDIUM },
  { trait: 'Iron Fist', context: 'lingering_phase',   magnitude:  TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'honest'   },
  { trait: 'Iron Fist', context: 'lingering_phase',   magnitude: -TRAIT_GOVERNANCE_BANDS.SMALL, meter: 'domestic' },
  { trait: 'Iron Fist', context: 'military_command',  magnitude:  TRAIT_GOVERNANCE_BANDS.SMALL  },
  { trait: 'Iron Fist', context: 'internal_party',    magnitude:  TRAIT_GOVERNANCE_BANDS.SMALL  },

  // --- Delegator (Lincoln Team of Rivals, Washington 1789-97) ---
  // MULTIPLIER on governance_crisis (event meters) + lingering_phase (PR5 +0.2 bonus).
  // Additive +SMALL on internal_party.
  { trait: 'Delegator', context: 'governance_crisis', magnitude: 0, multiplier: 1.5 },
  { trait: 'Delegator', context: 'lingering_phase',   magnitude: 0, multiplier: 1.5 },
  { trait: 'Delegator', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },

  // --- Micromanager (Polk 25-volume diary, Adams 1797-1801) ---
  // MULTIPLIER on governance_crisis + lingering_phase.
  // Additive +SMALL on military_command (Polk-Scott Mexican War) + internal_party.
  { trait: 'Micromanager', context: 'governance_crisis', magnitude: 0, multiplier: 0.5 },
  { trait: 'Micromanager', context: 'lingering_phase',   magnitude: 0, multiplier: 0.5 },
  { trait: 'Micromanager', context: 'military_command',  magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Micromanager', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },

  // --- Overeager (Pierce KS-NE, Polk 1846 war message, Clay 1812) ---
  { trait: 'Overeager', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Overeager', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },

  // --- Master Kingmaker (Clay 1824, Van Buren Albany Regency, Weed, Burr 1800) ---
  { trait: 'Master Kingmaker', context: 'governance_crisis', magnitude: TRAIT_GOVERNANCE_BANDS.SMALL },
  { trait: 'Master Kingmaker', context: 'internal_party',    magnitude: TRAIT_GOVERNANCE_BANDS.LARGE },
];

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
  | 'SecretaryOfNavy'
  | 'AttorneyGeneral'
  | 'SecretaryOfInterior'
  | 'PostmasterGeneral'
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

// Cabinet / cabinet-level appointment -> expertise.
export const OFFICE_EXPERTISE: Partial<Record<OfficeType, Expertise>> = {
  SecretaryOfState: 'Foreign Affairs',
  SecretaryOfTreasury: 'Economics',
  SecretaryOfWar: 'Military',
  SecretaryOfNavy: 'Naval',
  AttorneyGeneral: 'Justice',
  SecretaryOfInterior: 'Agriculture',
  PostmasterGeneral: 'Transportation',
  GeneralInChief: 'Military',
};

// PR6 hand-rolled slave-state set circa 1856. The 15 slave states circa the
// antebellum (eventual 11 CSA states + 4 border-loyal slave states). Used by
// John Brown event modulation (ideology + state proxy for slavery position).
// Secession Winter loyalty decay reads state.region directly, not this set.
export const SLAVE_STATES_1856: ReadonlyArray<string> = [
  'va', 'sc', 'ga', 'al', 'ms', 'tn', 'nc', 'ky',
  'mo', 'fl', 'ar', 'tx', 'la', 'md', 'de',
];

// PR6 Secession Winter loyalty decay. Fires DURING the Secession Winter event
// resolution (not as passive per-turn drift). Indexed by (state-region,
// ideology) and returns per-event decay applied to each cabinet member's
// loyalty field. After decay, loyalty < LOYALTY_DEFECTION_THRESHOLD triggers
// defection.
export const LOYALTY_REGION_BASE = {
  South: 0.5,
  Border: 0.2,
  Northeast: 0.0,
  Midwest: 0.0,
  West: 0.0,
} as const satisfies Record<string, number>;

export const LOYALTY_IDEOLOGY_MULT: Record<Ideology, number> = {
  'RW Populist':    1.2,
  Traditionalist:   1.0,
  Conservative:     0.7,
  Moderate:         0.3,
  Liberal:          0.0,
  Progressive:     -0.2,
  'LW Populist':   -0.3,
};

// Defection trigger threshold. A cabinet member whose post-decay loyalty is
// strictly less than this value resigns. Tuned so Cobb/Floyd/Thompson (start
// 0.5) defect and Cass (start 0.9, MI Midwest) stays.
export const LOYALTY_DEFECTION_THRESHOLD = 0.4;

// Loyalty field clamp range. Writes through engine helpers clamp to [0, 1].
export const LOYALTY_RANGE = { min: 0, max: 1 } as const;

// PR5 era-conditional cabinet seat list. Returns the cabinet seats active in
// the given calendar year. Four historical transitions:
//   year <  1789       -> []                              (no cabinet)
//   1789 <= year < 1798 -> 4 seats: State / Treasury / War / AG
//   1798 <= year < 1829 -> +SecretaryOfNavy               (5 seats)
//   1829 <= year < 1849 -> +PostmasterGeneral             (6 seats)
//   year >= 1849       -> +SecretaryOfInterior            (7 seats)
// Pure, deterministic — no Math.random, no snapshot.
export function cabinetSeatsForYear(year: number): OfficeType[] {
  if (year < 1789) return [];
  const seats: OfficeType[] = [
    'SecretaryOfState',
    'SecretaryOfTreasury',
    'SecretaryOfWar',
  ];
  if (year >= 1798) seats.push('SecretaryOfNavy');
  seats.push('AttorneyGeneral');
  if (year >= 1849) seats.push('SecretaryOfInterior');
  if (year >= 1829) seats.push('PostmasterGeneral');
  return seats;
}

// PR5 composite-score weights per cabinet seat. Used by runPhase_2_3_1_Cabinet
// to rank eligible candidates. AG admin / governing = 0 per the
// F-AG-NO-DEPARTMENT-PRE-1870 rule (a one-person legal office).
export interface CabinetSeatScoring {
  admin: number;
  governing: number;
  secondaryStat?: SkillKey;
  secondaryWeight: number;
  expertiseBonus: number;
}

export const CABINET_SEAT_SCORING: Partial<Record<OfficeType, CabinetSeatScoring>> = {
  SecretaryOfState:     { admin: 2, governing: 1, secondaryStat: 'legislative', secondaryWeight: 1, expertiseBonus: 5 },
  SecretaryOfTreasury:  { admin: 2, governing: 1,                                secondaryWeight: 0, expertiseBonus: 5 },
  SecretaryOfWar:       { admin: 1, governing: 1, secondaryStat: 'military',    secondaryWeight: 2, expertiseBonus: 5 },
  SecretaryOfNavy:      { admin: 1, governing: 1, secondaryStat: 'military',    secondaryWeight: 2, expertiseBonus: 5 },
  AttorneyGeneral:      { admin: 0, governing: 0, secondaryStat: 'judicial',    secondaryWeight: 2, expertiseBonus: 5 },
  SecretaryOfInterior:  { admin: 2, governing: 1,                                secondaryWeight: 0, expertiseBonus: 5 },
  PostmasterGeneral:    { admin: 1, governing: 2, secondaryStat: 'backroom',    secondaryWeight: 1, expertiseBonus: 5 },
};

// PR5 cross-party gate. 10% chance per seat-fill to relax the same-party
// filter for that seat; cross-party picks then take a -3 score penalty.
export const CABINET_CROSS_PARTY_RATE = 0.1;
export const CABINET_CROSS_PARTY_PENALTY = -3;

// Committee-chair appointment -> expertise (the 1856/general committee taxonomy).
export const COMMITTEE_EXPERTISE: Record<'Domestic' | 'Foreign' | 'Economic' | 'Justice', Expertise> = {
  Domestic: 'Welfare',
  Foreign: 'Foreign Affairs',
  Economic: 'Economics',
  Justice: 'Justice',
};

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
  loyalty: number;          // PR6 — [0, 1]; 1 = fully loyal, 0 = fully defected.
                            // Default 1.0; explicit values for 1856 marquee Secs
                            // (Cobb/Floyd/Thompson 0.5, Cass 0.9). Read by
                            // Secession Winter event resolution.
  expertise: Expertise[];
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
  // PR6 — Secession Winter defector count stored at resolve-time for the
  // modulation pass to read. Optional, runtime-only.
  secessionDefectionCount?: number;
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
  // Per-half-term delta records, opened at the top of each turn and closed at
  // 2.10. Read by the End-of-Half-Term page and the Campaign-Over recap.
  halfTermSummaries?: HalfTermSummary[];
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

export type DeathCause =
  | 'age'
  | 'battle'
  | 'event'
  | 'assassination';

export type RetireCause =
  | 'age'
  | 'event'
  | 'court';

// Per-half-term delta record. Opened at the start of a new turn (the first
// runCurrentPhase call where the current half-term has no summary yet),
// populated by phase runners as the turn unfolds, and closed at 2.10. Read by
// the End-of-Half-Term page (current-turn entry) and Campaign-Over recap
// (historical entries).
export interface HalfTermSummary {
  startYear: number;
  endYear: number;
  metersStart: NationalMeters;
  metersEnd: NationalMeters;
  factionSizesStart: Record<string, number>;
  factionSizesEnd: Record<string, number>;
  pvSnapshotStart: Record<string, number>;
  deaths: { politicianId: string; year: number; cause: DeathCause; office?: string }[];
  retirements: { politicianId: string; year: number; cause: RetireCause; office?: string }[];
  billsPassed: string[];
  billsFailed: string[];
  eraEventsResolved: { eraEventId: string; templateId?: string; aiResolved: boolean; chosenResponseId: string }[];
  milestones: { phase: PhaseId; text: string }[];
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
  expertise: Expertise[];
  loyalty?: number;  // PR6 — optional; default 1.0 if missing. Cobb/Floyd/Thompson 0.5; Cass 0.9.
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
