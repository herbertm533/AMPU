import type { FullGameSnapshot, Politician, BattleRecord, RevolutionaryWar } from '../types';
import { addLog } from './log';
import { d, d100, chance, pick } from '../rng';

const BATTLE_NAMES_GROUND = ['Bunker Hill', 'Long Island', 'Trenton', 'Princeton', 'Brandywine', 'Saratoga', 'Monmouth', 'Camden', 'Cowpens', "Guilford Courthouse", 'Yorktown', 'Charleston', 'Savannah', 'Germantown', 'Kings Mountain', 'Fort Ticonderoga'];
const BATTLE_NAMES_NAVAL = ["Off Flamborough Head", 'Penobscot Bay', 'Off the Capes', 'Chesapeake Bay', "Block Island", 'Off the Carolinas'];

export function ensureWar(snap: FullGameSnapshot): RevolutionaryWar {
  if (!snap.game.revolutionaryWar) {
    snap.game.revolutionaryWar = {
      active: false,
      groundWinsNeeded: 7,
      groundLossesRemaining: 16,
      currentGroundWins: 0,
      currentGroundLosses: 0,
      navalWins: 0,
      navalLosses: 0,
      seniorGeneralId: null,
      generalIds: [],
      seniorAdmiralId: null,
      admiralIds: [],
      frenchAlliance: false,
      battleLog: [],
    };
  }
  return snap.game.revolutionaryWar;
}

export function startRevWar(snap: FullGameSnapshot): void {
  const war = ensureWar(snap);
  war.active = true;
  addLog(snap, '2.4.3', 'war', 'The Revolutionary War has begun against Great Britain.');
}

// Auto-appoint generals/admirals from current military pool. Called when CC
// passes "Establish Continental Army"/"Navy" or as a fallback.
export function appointMilitary(snap: FullGameSnapshot): void {
  const war = ensureWar(snap);
  const isAvailable = (p: Politician): boolean => !p.deathYear && !p.retiredYear && !p.traits.includes('Frail') && p.skills.military >= 1;
  const naval = (p: Politician): boolean => p.traits.includes('Naval');

  if (!war.seniorGeneralId) {
    const gens = snap.politicians.filter((p) => isAvailable(p) && !naval(p)).sort((a, b) => b.skills.military - a.skills.military || b.command - a.command);
    if (gens[0]) {
      war.seniorGeneralId = gens[0].id;
      gens[0].currentOffice = { type: 'GeneralInChief' };
      gens[0].state = 'ma'; // moves to Massachusetts to take command
      addLog(snap, '2.7.2', 'appointment', `${gens[0].firstName} ${gens[0].lastName} appointed Senior General of the Continental Army.`);
    }
    war.generalIds = gens.slice(1, 5).map((g) => g.id);
  }
  if (!war.seniorAdmiralId) {
    const adms = snap.politicians.filter((p) => isAvailable(p) && naval(p));
    if (adms[0]) {
      war.seniorAdmiralId = adms[0].id;
      adms[0].currentOffice = { type: 'Admiral' };
      addLog(snap, '2.7.2', 'appointment', `${adms[0].firstName} ${adms[0].lastName} appointed Senior Admiral.`);
    }
    war.admiralIds = adms.slice(1, 3).map((a) => a.id);
  }
}

function applyCasualties(snap: FullGameSnapshot, war: RevolutionaryWar, difficulty: 'easy' | 'moderate' | 'difficult', battle: BattleRecord, _outcome: 'win' | 'loss'): void {
  // Determine death/wound counts
  let deaths = 0, wounds = 0;
  if (difficulty === 'difficult') {
    const r = d(6);
    deaths = r <= 2 ? 1 : r <= 4 ? 2 : 3;
    const w = d(6);
    wounds = w <= 2 ? 1 : w <= 4 ? 2 : 3;
  } else if (difficulty === 'moderate') {
    deaths = d(6) >= 4 ? 1 : 0;
    wounds = d(6) >= 4 ? 1 : 0;
  } else {
    deaths = d(6) >= 4 ? 1 : 0;
    wounds = d(6) >= 4 ? 1 : 0;
  }

  const participants = snap.politicians.filter((p) => !p.deathYear && !p.retiredYear && p.skills.military >= 1 && !p.traits.includes('Frail'));
  battle.killed = [];
  battle.wounded = [];
  // Spare senior commanders if possible (more historical)
  const candidates = [...participants].filter((p) => p.id !== war.seniorGeneralId && p.id !== war.seniorAdmiralId);
  for (let i = 0; i < deaths && candidates.length > 0; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    const victim = candidates.splice(idx, 1)[0];
    victim.deathYear = snap.game.year;
    battle.killed.push(victim.id);
    addLog(snap, '2.7.2', 'death', `${victim.firstName} ${victim.lastName} killed at ${battle.name}.`);
  }
  for (let i = 0; i < wounds && candidates.length > 0; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    const victim = candidates.splice(idx, 1)[0];
    if (!victim.traits.includes('Frail')) victim.traits.push('Frail');
    battle.wounded.push(victim.id);
    addLog(snap, '2.7.2', 'event', `${victim.firstName} ${victim.lastName} wounded at ${battle.name} (gains Frail).`);
  }
  // Survivors may gain Military skill
  for (const p of participants) {
    if (chance(0.1)) p.skills.military = Math.min(5, p.skills.military + 1);
  }
}

export function runRevWarBattles(snap: FullGameSnapshot): void {
  const war = ensureWar(snap);
  if (!war.active) return;
  if (!war.seniorGeneralId || !war.seniorAdmiralId) {
    appointMilitary(snap);
  }
  const general = snap.politicians.find((p) => p.id === war.seniorGeneralId);
  const admiral = snap.politicians.find((p) => p.id === war.seniorAdmiralId);
  const secWar = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfWar);

  // Naval phase — single battle
  if (admiral) {
    const planning = (secWar?.skills.admin ?? 0) + admiral.skills.military;
    const adminScore = admiral.skills.military * 10;
    const target = planning + adminScore;
    const roll = d100();
    const win = roll <= target + 30; // slight US edge with French alliance
    const navalName = pick(BATTLE_NAMES_NAVAL);
    const battle: BattleRecord = {
      year: snap.game.year,
      type: 'naval',
      outcome: win ? 'win' : 'loss',
      name: navalName,
      text: `Naval engagement ${navalName}: ${win ? 'Victory' : 'Defeat'} (target ${target}, roll ${roll}).`,
    };
    war.battleLog.push(battle);
    addLog(snap, '2.7.2', 'war', battle.text);
    if (win) war.navalWins++; else war.navalLosses++;
  }

  // Ground phase — multiple battles
  if (general) {
    let battleCount = 0;
    do {
      const planning = secWar?.skills.admin != null ? secWar.skills.admin + general.skills.military : general.skills.military * 2;
      const generalScore = general.skills.military * 10;
      const baseTarget = planning + generalScore + (war.frenchAlliance ? 25 : 0);
      const difficulty: 'easy' | 'moderate' | 'difficult' = chance(0.4) ? 'difficult' : chance(0.5) ? 'moderate' : 'easy';
      const diffMod = difficulty === 'difficult' ? -20 : difficulty === 'moderate' ? 0 : 15;
      const roll = d100();
      const win = roll <= baseTarget + diffMod;
      const name = pick(BATTLE_NAMES_GROUND);
      const battle: BattleRecord = {
        year: snap.game.year,
        type: 'ground',
        difficulty,
        outcome: win ? 'win' : 'loss',
        name,
        text: `${name} (${difficulty}): ${win ? 'Victory' : 'Defeat'} (target ${baseTarget + diffMod}, roll ${roll}).`,
      };
      war.battleLog.push(battle);
      addLog(snap, '2.7.2', 'war', battle.text);
      if (win) war.currentGroundWins++; else war.currentGroundLosses++;
      applyCasualties(snap, war, difficulty, battle, win ? 'win' : 'loss');
      battleCount++;
    } while (battleCount < 3 && d100() <= 66);
  }

  // Check win/loss conditions
  if (war.currentGroundWins >= war.groundWinsNeeded) {
    war.active = false;
    war.endYear = snap.game.year;
    war.outcome = 'win';
    addLog(snap, '2.7.2', 'war', 'The Continental Army has secured enough victories. The war is won.');
  } else if (war.currentGroundLosses >= war.groundLossesRemaining && !war.frenchAlliance) {
    war.active = false;
    war.endYear = snap.game.year;
    war.outcome = 'loss';
    addLog(snap, '2.7.2', 'war', 'The Continental Army can sustain no more losses. The war is lost.');
  }
}

// Apply French Alliance effect
export function applyFrenchAlliance(snap: FullGameSnapshot): void {
  const war = ensureWar(snap);
  war.frenchAlliance = true;
  snap.game.diplomacy.France = 4;
  const general = snap.politicians.find((p) => p.id === war.seniorGeneralId);
  if (general) general.skills.military = Math.min(5, general.skills.military + 1);
  addLog(snap, '2.4.3', 'war', 'France allies with the United States. Defeat is no longer possible.');
}

// Treaty of Paris: end war with US victory, gain western territories,
// disband army/navy, retain senior commanders.
export function applyTreatyOfParis(snap: FullGameSnapshot): void {
  const war = ensureWar(snap);
  war.active = false;
  war.endYear = snap.game.year;
  war.outcome = war.outcome ?? 'win';
  // Disband generals/admirals (clear office for non-senior)
  for (const id of war.generalIds) {
    const p = snap.politicians.find((pp) => pp.id === id);
    if (p) p.currentOffice = null;
  }
  for (const id of war.admiralIds) {
    const p = snap.politicians.find((pp) => pp.id === id);
    if (p) p.currentOffice = null;
  }
  war.generalIds = [];
  war.admiralIds = [];
  snap.game.diplomacy.Britain = -3;
  addLog(snap, '2.4.3', 'war', 'The Treaty of Paris is signed. The army and navy are largely disbanded; the senior general and admiral remain on duty.');
}
