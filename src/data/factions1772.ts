import type { Faction, Ideology } from '../types';

// 10 era-appropriate factions, 5 per proto-party.
// `eligibleIdeologies` is used by the 1772 expansion-style draft to constrain
// which ideologies each faction can claim.
export interface Faction1772 extends Faction {
  eligibleIdeologies: Ideology[];
}

export const FACTIONS_1772: Faction1772[] = [
  // Blue (proto-Democratic-Republicans / Anti-Federalists)
  { id: 'fact_blue_lw_1772', name: 'Sons of Liberty', partyId: 'BLUE', personality: 'LW', ideologyCards: ['Independence', 'Republicanism'], lobbyCards: ['Patriots'], interestCards: ['Reformers'], isPlayer: false, eligibleIdeologies: ['LW Populist', 'Progressive'] },
  { id: 'fact_blue_cl_1772', name: 'Moderate Patriots', partyId: 'BLUE', personality: 'LW', ideologyCards: ['Republicanism'], lobbyCards: ['Patriots'], interestCards: ['Settlers'], isPlayer: false, eligibleIdeologies: ['Liberal', 'Moderate'] },
  { id: 'fact_blue_c_1772', name: 'American Whigs', partyId: 'BLUE', personality: 'Center', ideologyCards: ['Whiggery'], lobbyCards: ['Merchants'], interestCards: ['Manufacturers', 'Settlers'], isPlayer: false, eligibleIdeologies: ['Moderate', 'Conservative'] },
  { id: 'fact_blue_cr_1772', name: 'Patriot Conservatives', partyId: 'BLUE', personality: 'Center', ideologyCards: ['Republicanism', 'Tradition'], lobbyCards: ['Planters'], interestCards: ['Planters'], isPlayer: false, eligibleIdeologies: ['Conservative', 'Traditionalist'] },
  { id: 'fact_blue_rw_1772', name: "Jefferson's Patriots", partyId: 'BLUE', personality: 'RW', ideologyCards: ['StatesRights', 'Independence'], lobbyCards: ['Planters', 'SmallFarmers'], interestCards: ['Settlers', 'Planters'], isPlayer: false, eligibleIdeologies: ['Traditionalist', 'RW Populist'] },

  // Red (proto-Federalists)
  { id: 'fact_red_lw_1772', name: 'Ellsworth Progressives', partyId: 'RED', personality: 'LW', ideologyCards: ['Reformism'], lobbyCards: ['Reformers'], interestCards: ['Reformers'], isPlayer: false, eligibleIdeologies: ['LW Populist', 'Progressive', 'Liberal'] },
  { id: 'fact_red_cl_1772', name: 'Franklin Patriots', partyId: 'RED', personality: 'Center', ideologyCards: ['Compromise'], lobbyCards: ['Merchants'], interestCards: ['Manufacturers'], isPlayer: false, eligibleIdeologies: ['Liberal', 'Moderate'] },
  { id: 'fact_red_c_1772', name: 'Washington Patriots', partyId: 'RED', personality: 'Center', ideologyCards: ['Federalism'], lobbyCards: ['NationalUnity'], interestCards: ['Manufacturers'], isPlayer: false, eligibleIdeologies: ['Moderate', 'Conservative'] },
  { id: 'fact_red_cr_1772', name: 'Adams Patriots', partyId: 'RED', personality: 'RW', ideologyCards: ['Federalism', 'StrongCenter'], lobbyCards: ['Merchants'], interestCards: ['Manufacturers'], isPlayer: false, eligibleIdeologies: ['Conservative', 'Traditionalist', 'RW Populist'] },
  { id: 'fact_red_rw_1772', name: 'Jay Federalists', partyId: 'RED', personality: 'Center', ideologyCards: ['Federalism', 'Tradition'], lobbyCards: ['Merchants', 'Lawyers'], interestCards: ['Manufacturers'], isPlayer: false, eligibleIdeologies: ['Moderate', 'Conservative'] },
];

export const PARTIES_1772 = [
  { id: 'BLUE' as const, name: 'Patriots (Anti-Federalist)', color: '#2563eb', leaderId: null },
  { id: 'RED' as const, name: 'Federalists', color: '#dc2626', leaderId: null },
];
