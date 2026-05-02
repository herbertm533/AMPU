import type { FullGameSnapshot, PhaseId, Politician, EraEvent, Legislation, ElectionResult, NationalMeters, Ideology, PartyId } from '../types';
import { IDEOLOGY_ORDER } from '../types';
import { addLog } from './log';
import { uid, chance, d100, pick, clamp, shuffle } from '../rng';
import { refreshPv } from '../pv';
import { buildEraEventsForYear } from '../data/eraEvents1856';

// ============================================================================
// 2.1.1 Draft
// ============================================================================
export function runPhase_2_1_1_Draft(snap: FullGameSnapshot, autoOnly: boolean): { needsPlayer: boolean; draftPool: Politician[] } {
  if (snap.game.pendingDraftPool.length === 0) {
    // Generate new rookie pool
    const pool: Politician[] = [];
    const stateIds = snap.states.map((s) => s.id);
    const ideologies: Ideology[] = ['LW Populist', 'Progressive', 'Liberal', 'Moderate', 'Conservative', 'Traditionalist', 'RW Populist'];
    const firsts = ['John', 'James', 'William', 'Henry', 'Charles', 'Robert', 'Edward', 'Thomas', 'Samuel', 'Francis', 'George', 'Joseph', 'Frank', 'Alfred', 'Stephen'];
    const lasts = ['Hughes', 'Carter', 'Beecher', 'Howard', 'Dawes', 'Logan', 'Sherman', 'Cooke', 'Pendleton', 'Reid', 'Ferry', 'Boutwell', 'Conkling', 'Morton', 'Frye'];
    const factions = snap.factions;
    const draftSize = factions.length * 2; // 20 rookies
    for (let i = 0; i < draftSize; i++) {
      const ideo = pick(ideologies);
      const skills = {
        admin: Math.floor(Math.random() * 2),
        legislative: Math.floor(Math.random() * 2),
        judicial: Math.floor(Math.random() * 2),
        military: Math.floor(Math.random() * 2),
        governing: Math.floor(Math.random() * 2),
        backroom: Math.floor(Math.random() * 2),
      };
      // boost one skill randomly
      const boost = pick(['admin', 'legislative', 'judicial', 'military', 'governing', 'backroom'] as const);
      skills[boost] = 2 + Math.floor(Math.random() * 2);
      const age = 28 + Math.floor(Math.random() * 12);
      const p: Politician = {
        id: uid('pol'),
        firstName: pick(firsts),
        lastName: pick(lasts),
        state: pick(stateIds),
        factionId: null,
        partyId: null,
        ideology: ideo,
        age,
        birthYear: snap.game.year - age,
        skills,
        traits: chance(0.3) ? [pick(['Charismatic', 'Orator', 'Efficient', 'Reformist', 'Integrity'] as const)] : [],
        currentOffice: null,
        careerTrack: null,
        careerTrackYears: 0,
        command: 0,
        interests: [],
        isKingmaker: false,
        flipFlopperPenalty: 0,
        pvCache: 0,
        isHistorical: false,
      };
      pool.push(p);
    }
    snap.politicians.push(...pool);
    snap.politicians = refreshPv(snap.politicians);
    snap.game.pendingDraftPool = pool.map((p) => p.id);

    // Snake order: factions ranked by reverse PV-sum
    const factionPvSum = factions.map((f) => ({
      id: f.id,
      sum: snap.politicians.filter((p) => p.factionId === f.id).reduce((s, p) => s + p.pvCache, 0),
    }));
    factionPvSum.sort((a, b) => a.sum - b.sum);
    snap.game.draftRoundOrder = [];
    // 2 rounds
    const order = factionPvSum.map((x) => x.id);
    snap.game.draftRoundOrder = [...order, ...order.slice().reverse()];
    addLog(snap, '2.1.1', 'draft', `Draft pool generated: ${pool.length} rookies. Snake order set.`);
  }
  // Have CPU make picks until it's player's turn (or pool empty)
  while (snap.game.draftRoundOrder.length > 0) {
    const factionId = snap.game.draftRoundOrder[0];
    const isPlayer = factionId === snap.game.playerFactionId;
    if (isPlayer && !autoOnly) {
      // Wait for player input
      const draftPool = snap.politicians.filter((p) => snap.game.pendingDraftPool.includes(p.id));
      return { needsPlayer: true, draftPool };
    }
    // CPU pick: best PV in faction's ideological lane
    const faction = snap.factions.find((f) => f.id === factionId)!;
    const eligible = snap.politicians.filter((p) => snap.game.pendingDraftPool.includes(p.id));
    if (eligible.length === 0) {
      snap.game.draftRoundOrder.shift();
      continue;
    }
    const scored = eligible.map((p) => {
      const ideoMatch = faction.personality === 'LW' ? (p.ideology === 'LW Populist' || p.ideology === 'Progressive' || p.ideology === 'Liberal') :
        faction.personality === 'RW' ? (p.ideology === 'Conservative' || p.ideology === 'Traditionalist' || p.ideology === 'RW Populist') :
        (p.ideology === 'Moderate' || p.ideology === 'Liberal' || p.ideology === 'Conservative');
      return { p, score: p.pvCache + (ideoMatch ? 25 : 0) };
    });
    scored.sort((a, b) => b.score - a.score);
    const pick = scored[0].p;
    pick.factionId = faction.id;
    pick.partyId = faction.partyId;
    snap.game.pendingDraftPool = snap.game.pendingDraftPool.filter((id) => id !== pick.id);
    snap.game.draftRoundOrder.shift();
    addLog(snap, '2.1.1', 'draft', `${faction.name} drafted ${pick.firstName} ${pick.lastName} (${pick.state.toUpperCase()}, ${pick.ideology}, PV ${pick.pvCache}).`);
  }
  // Pool empty
  snap.game.pendingDraftPool = [];
  snap.game.draftRoundOrder = [];
  return { needsPlayer: false, draftPool: [] };
}

export function playerDraftPick(snap: FullGameSnapshot, politicianId: string): void {
  const factionId = snap.game.draftRoundOrder[0];
  if (!factionId || factionId !== snap.game.playerFactionId) return;
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p) return;
  if (!snap.game.pendingDraftPool.includes(p.id)) return;
  const faction = snap.factions.find((f) => f.id === factionId)!;
  p.factionId = faction.id;
  p.partyId = faction.partyId;
  snap.game.pendingDraftPool = snap.game.pendingDraftPool.filter((id) => id !== p.id);
  snap.game.draftRoundOrder.shift();
  addLog(snap, '2.1.1', 'draft', `${faction.name} drafted ${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, ${p.ideology}, PV ${p.pvCache}).`);
}

// ============================================================================
// 2.1.2 Career Tracks (auto-process: CPU assigns; player UI handles theirs)
// ============================================================================
export function runPhase_2_1_2_CareerTracks(snap: FullGameSnapshot): void {
  const tracks = ['Private', 'Military', 'Governing', 'Administration', 'Legislative', 'Judicial', 'Backroom'] as const;
  for (const p of snap.politicians) {
    if (p.factionId === snap.game.playerFactionId) continue;
    if (p.currentOffice) continue;
    if (p.careerTrack && p.careerTrackYears < 4) {
      p.careerTrackYears += 2;
      continue;
    }
    if (p.careerTrack && p.careerTrackYears >= 4) {
      // Graduate from track
      const skillKey = p.careerTrack === 'Military' ? 'military' :
        p.careerTrack === 'Governing' ? 'governing' :
        p.careerTrack === 'Administration' ? 'admin' :
        p.careerTrack === 'Legislative' ? 'legislative' :
        p.careerTrack === 'Judicial' ? 'judicial' :
        p.careerTrack === 'Backroom' ? 'backroom' : null;
      if (skillKey) p.skills[skillKey] = clamp(p.skills[skillKey] + 1, 0, 5);
      p.careerTrack = null;
      p.careerTrackYears = 0;
    } else if (p.age < 50 && chance(0.3)) {
      // best skill -> matching track
      const best = (Object.entries(p.skills) as [keyof typeof p.skills, number][]).sort((a, b) => b[1] - a[1])[0][0];
      const trackMap: Record<string, typeof tracks[number]> = {
        military: 'Military', governing: 'Governing', admin: 'Administration',
        legislative: 'Legislative', judicial: 'Judicial', backroom: 'Backroom',
      };
      p.careerTrack = trackMap[best] ?? 'Private';
      p.careerTrackYears = 0;
    }
  }
  snap.politicians = refreshPv(snap.politicians);
}

export function setPlayerCareerTrack(snap: FullGameSnapshot, politicianId: string, track: Politician['careerTrack']): void {
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p || p.factionId !== snap.game.playerFactionId) return;
  if (p.currentOffice) return;
  p.careerTrack = track;
  p.careerTrackYears = 0;
}

// ============================================================================
// 2.1.3 Flip-Flopper cleanup
// ============================================================================
export function runPhase_2_1_3_FlipFlopper(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (p.flipFlopperPenalty > 0) {
      p.flipFlopperPenalty = Math.max(0, p.flipFlopperPenalty - 1);
    }
  }
  snap.politicians = refreshPv(snap.politicians);
  addLog(snap, '2.1.3', 'system', 'Flip-flopper penalties checked and reduced.');
}

// ============================================================================
// 2.1.4 Relocations (auto)
// ============================================================================
export function runPhase_2_1_4_Relocations(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (p.factionId === snap.game.playerFactionId) continue;
    if (p.currentOffice || !p.altState) continue;
    if (chance(0.3)) {
      const fromState = snap.states.find((s) => s.id === p.state);
      const toState = snap.states.find((s) => s.id === p.altState);
      if (!fromState || !toState) continue;
      const target = fromState.region === toState.region ? 70 : 45;
      const roll = d100();
      if (roll <= target) {
        p.state = toState.id;
        p.altState = undefined;
        addLog(snap, '2.1.4', 'roll', `${p.firstName} ${p.lastName} relocated to ${toState.abbr}. Roll ${roll} / ${target}.`);
      } else {
        addLog(snap, '2.1.4', 'roll', `${p.firstName} ${p.lastName} failed relocation to ${toState.abbr}. Roll ${roll} / ${target}.`);
      }
    }
  }
}

// ============================================================================
// 2.1.5 Ideology shifts (auto)
// ============================================================================
export function runPhase_2_1_5_Ideology(snap: FullGameSnapshot): void {
  let shifts = 0;
  for (const p of snap.politicians) {
    if (chance(0.05)) {
      const idx = IDEOLOGY_ORDER.indexOf(p.ideology);
      const dir = chance(0.5) ? 1 : -1;
      const newIdx = clamp(idx + dir, 0, IDEOLOGY_ORDER.length - 1);
      if (newIdx !== idx) {
        const old = p.ideology;
        p.ideology = IDEOLOGY_ORDER[newIdx];
        shifts++;
        if (p.factionId === snap.game.playerFactionId || p.isHistorical) {
          addLog(snap, '2.1.5', 'event', `${p.firstName} ${p.lastName} drifted from ${old} to ${p.ideology}.`);
        }
      }
    }
  }
  if (shifts > 0) addLog(snap, '2.1.5', 'system', `${shifts} politicians shifted ideologically.`);
}

// ============================================================================
// 2.1.6 Faction conversions (auto)
// ============================================================================
export function runPhase_2_1_6_Conversions(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (p.factionId === snap.game.playerFactionId) continue;
    if (!p.factionId || p.currentOffice) continue;
    if (chance(0.02)) {
      const sameParty = snap.factions.filter((f) => f.partyId === p.partyId && f.id !== p.factionId);
      if (sameParty.length === 0) continue;
      const newFact = pick(sameParty);
      const old = snap.factions.find((f) => f.id === p.factionId);
      p.factionId = newFact.id;
      p.flipFlopperPenalty += 1;
      if (old) addLog(snap, '2.1.6', 'event', `${p.firstName} ${p.lastName} switched from ${old.name} to ${newFact.name}.`);
    }
  }
}

// ============================================================================
// 2.1.7 Kingmakers (auto)
// ============================================================================
export function runPhase_2_1_7_Kingmakers(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (!p.isKingmaker || p.protegeId) continue;
    if (p.factionId === snap.game.playerFactionId) continue;
    const candidates = snap.politicians.filter((c) => c.factionId === p.factionId && c.id !== p.id && !c.protegeId && c.age < 45 && c.pvCache > 20);
    if (candidates.length === 0) continue;
    const chosen = pick(candidates);
    p.protegeId = chosen.id;
    addLog(snap, '2.1.7', 'event', `${p.firstName} ${p.lastName} took ${chosen.firstName} ${chosen.lastName} as a protégé.`);
  }
}

// ============================================================================
// 2.1.8 Faction personalities (auto - already set, recompute personality)
// ============================================================================
export function runPhase_2_1_8_FactionPersonalities(snap: FullGameSnapshot): void {
  for (const f of snap.factions) {
    const members = snap.politicians.filter((p) => p.factionId === f.id);
    if (members.length === 0) continue;
    const ideoSum = members.reduce((s, p) => s + IDEOLOGY_ORDER.indexOf(p.ideology), 0) / members.length;
    if (ideoSum < 2.5) f.personality = 'LW';
    else if (ideoSum > 4.5) f.personality = 'RW';
    else f.personality = 'Center';
  }
}

// ============================================================================
// 2.2.1 Congressional Leadership (auto)
// ============================================================================
export function runPhase_2_2_1_CongressLeadership(snap: FullGameSnapshot): void {
  // Determine majority party: count senators per party
  const senateMembers = snap.states.flatMap((s) => s.senators.map((sn) => snap.politicians.find((p) => p.id === sn.politicianId))).filter(Boolean) as Politician[];
  const houseMembers = snap.states.flatMap((s) => s.representativeIds.map((id) => snap.politicians.find((p) => p.id === id))).filter(Boolean) as Politician[];
  const senateBlue = senateMembers.filter((m) => m.partyId === 'BLUE').length;
  const senateRed = senateMembers.filter((m) => m.partyId === 'RED').length;
  const houseBlue = houseMembers.filter((m) => m.partyId === 'BLUE').length;
  const houseRed = houseMembers.filter((m) => m.partyId === 'RED').length;
  const senateMajority: PartyId = senateBlue >= senateRed ? 'BLUE' : 'RED';
  const houseMajority: PartyId = houseBlue >= houseRed ? 'BLUE' : 'RED';

  // Speaker = top PV House member of majority party
  const speakerCandidate = houseMembers
    .filter((m) => m.partyId === houseMajority)
    .sort((a, b) => b.pvCache - a.pvCache)[0];
  if (speakerCandidate) {
    snap.game.speakerId = speakerCandidate.id;
    addLog(snap, '2.2.1', 'appointment', `${speakerCandidate.firstName} ${speakerCandidate.lastName} elected Speaker of the House.`);
  }
  const proTemCandidate = senateMembers
    .filter((m) => m.partyId === senateMajority)
    .sort((a, b) => b.pvCache - a.pvCache)[0];
  if (proTemCandidate) {
    snap.game.proTemId = proTemCandidate.id;
    addLog(snap, '2.2.1', 'appointment', `${proTemCandidate.firstName} ${proTemCandidate.lastName} elected Senate Pro Tempore.`);
  }
}

// ============================================================================
// 2.2.2 Committee chairs (auto)
// ============================================================================
export function runPhase_2_2_2_Committees(snap: FullGameSnapshot): void {
  const committees: ('Domestic' | 'Foreign' | 'Economic' | 'Justice')[] = ['Domestic', 'Foreign', 'Economic', 'Justice'];
  const senateMembers = snap.states.flatMap((s) => s.senators.map((sn) => snap.politicians.find((p) => p.id === sn.politicianId))).filter(Boolean) as Politician[];
  const houseMembers = snap.states.flatMap((s) => s.representativeIds.map((id) => snap.politicians.find((p) => p.id === id))).filter(Boolean) as Politician[];
  const all = [...senateMembers, ...houseMembers];
  for (const c of committees) {
    const skillKey: keyof Politician['skills'] = c === 'Justice' ? 'judicial' : c === 'Economic' ? 'admin' : c === 'Foreign' ? 'admin' : 'legislative';
    const candidate = all.sort((a, b) => b.skills[skillKey] - a.skills[skillKey])[0];
    if (candidate) {
      snap.game.committeeChairs[c] = candidate.id;
      addLog(snap, '2.2.2', 'appointment', `${candidate.firstName} ${candidate.lastName} chairs ${c} committee.`);
    }
  }
}

// ============================================================================
// 2.2.3 Faction leaders (auto)
// ============================================================================
export function runPhase_2_2_3_FactionLeaders(snap: FullGameSnapshot): void {
  for (const f of snap.factions) {
    const members = snap.politicians.filter((p) => p.factionId === f.id);
    if (members.length === 0) continue;
    members.sort((a, b) => b.pvCache - a.pvCache);
    f.leaderId = members[0].id;
  }
}

// ============================================================================
// 2.2.4 Party leaders
// ============================================================================
export function runPhase_2_2_4_PartyLeaders(snap: FullGameSnapshot): void {
  for (const party of snap.parties) {
    if (snap.game.presidentId) {
      const pres = snap.politicians.find((p) => p.id === snap.game.presidentId);
      if (pres && pres.partyId === party.id) {
        party.leaderId = pres.id;
        continue;
      }
    }
    const members = snap.politicians.filter((p) => p.partyId === party.id);
    members.sort((a, b) => b.pvCache - a.pvCache);
    party.leaderId = members[0]?.id ?? null;
    if (party.leaderId) {
      const ldr = snap.politicians.find((p) => p.id === party.leaderId);
      if (ldr) addLog(snap, '2.2.4', 'appointment', `${ldr.firstName} ${ldr.lastName} leads the ${party.name}.`);
    }
  }
}

// ============================================================================
// 2.3.1 Cabinet (auto for CPU)
// ============================================================================
export function runPhase_2_3_1_Cabinet(snap: FullGameSnapshot): void {
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (!president) return;
  const partyId = president.partyId;
  const positions: (keyof typeof snap.game.cabinet)[] = ['SecretaryOfState', 'SecretaryOfTreasury', 'SecretaryOfWar', 'AttorneyGeneral', 'PostmasterGeneral', 'KeyAdvisor'];
  for (const pos of positions) {
    if (snap.game.cabinet[pos]) continue;
    const candidates = snap.politicians.filter((p) => p.partyId === partyId && !p.currentOffice && p.age < 75);
    candidates.sort((a, b) => b.skills.admin - a.skills.admin);
    const pick = candidates[0];
    if (pick) {
      snap.game.cabinet[pos] = pick.id;
      pick.currentOffice = { type: pos as 'SecretaryOfState' };
      addLog(snap, '2.3.1', 'appointment', `${pick.firstName} ${pick.lastName} confirmed as ${pos}.`);
    }
  }
}

// ============================================================================
// 2.3.2 Military
// ============================================================================
export function runPhase_2_3_2_Military(snap: FullGameSnapshot): void {
  if (!snap.game.cabinet.GeneralInChief) {
    const candidates = snap.politicians.filter((p) => !p.currentOffice && p.skills.military >= 3);
    candidates.sort((a, b) => b.skills.military - a.skills.military);
    if (candidates[0]) {
      snap.game.cabinet.GeneralInChief = candidates[0].id;
      candidates[0].currentOffice = { type: 'GeneralInChief' };
      addLog(snap, '2.3.2', 'appointment', `${candidates[0].firstName} ${candidates[0].lastName} appointed General in Chief.`);
    }
  }
  if (!snap.game.cabinet.Admiral) {
    const navalCandidates = snap.politicians.filter((p) => !p.currentOffice && (p.skills.military >= 2 || p.traits.includes('Naval')));
    navalCandidates.sort((a, b) => b.skills.military - a.skills.military);
    if (navalCandidates[0]) {
      snap.game.cabinet.Admiral = navalCandidates[0].id;
      navalCandidates[0].currentOffice = { type: 'Admiral' };
      addLog(snap, '2.3.2', 'appointment', `${navalCandidates[0].firstName} ${navalCandidates[0].lastName} appointed Admiral.`);
    }
  }
}

// ============================================================================
// 2.4.1 Deaths & Retirements
// ============================================================================
export function runPhase_2_4_1_Deaths(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    const deathChance = p.age >= 80 ? 0.18 : p.age >= 70 ? 0.07 : p.age >= 60 ? 0.025 : 0.005;
    const retireChance = p.age >= 70 ? 0.08 : p.age >= 60 ? 0.025 : 0.005;
    if (chance(deathChance)) {
      p.deathYear = snap.game.year;
      addLog(snap, '2.4.1', 'death', `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has died.`);
      vacateOffice(snap, p);
      continue;
    }
    if (p.currentOffice && chance(retireChance)) {
      p.retiredYear = snap.game.year;
      addLog(snap, '2.4.1', 'retire', `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has retired.`);
      vacateOffice(snap, p);
    }
  }
}

function vacateOffice(snap: FullGameSnapshot, p: Politician): void {
  if (!p.currentOffice) return;
  const t = p.currentOffice.type;
  if (t === 'President') snap.game.presidentId = null;
  if (t === 'VicePresident') snap.game.vicePresidentId = null;
  if (t === 'SpeakerOfHouse') snap.game.speakerId = null;
  if (t === 'SenateProTem') snap.game.proTemId = null;
  if (t === 'ChiefJustice') snap.game.chiefJusticeId = null;
  if (t === 'AssociateJustice') snap.game.supremeCourtIds = snap.game.supremeCourtIds.filter((id) => id !== p.id);
  if (t === 'Senator') {
    for (const s of snap.states) {
      s.senators = s.senators.filter((sn) => sn.politicianId !== p.id);
    }
  }
  if (t === 'Representative') {
    for (const s of snap.states) {
      s.representativeIds = s.representativeIds.filter((id) => id !== p.id);
    }
  }
  if (t === 'Governor') {
    for (const s of snap.states) {
      if (s.governorId === p.id) s.governorId = null;
    }
  }
  // cabinet
  for (const k of Object.keys(snap.game.cabinet) as (keyof typeof snap.game.cabinet)[]) {
    if (snap.game.cabinet[k] === p.id) snap.game.cabinet[k] = null;
  }
  p.currentOffice = null;
}

// ============================================================================
// 2.4.2 Anytime events
// ============================================================================
export function runPhase_2_4_2_Anytime(snap: FullGameSnapshot): void {
  if (chance(0.35)) {
    const choices = [
      { text: 'A bumper harvest boosts agricultural states.', effect: () => { snap.game.meters.economic = clamp(snap.game.meters.economic + 1, -5, 5); snap.game.interestGroups.BigAg = (snap.game.interestGroups.BigAg ?? 0) + 1; } },
      { text: 'A railroad accident kills dozens. Public anger rises.', effect: () => { snap.game.meters.quality = clamp(snap.game.meters.quality - 1, -5, 5); snap.game.partyPreference = clamp(snap.game.partyPreference - 0.2, -5, 5); } },
      { text: 'A patriotic groundswell sweeps the nation.', effect: () => { snap.game.interestGroups.Nationalists = (snap.game.interestGroups.Nationalists ?? 0) + 2; } },
      { text: 'An immigration wave reaches Northern ports.', effect: () => { snap.game.interestGroups.Immigrants = (snap.game.interestGroups.Immigrants ?? 0) + 2; snap.game.interestGroups.Nativists = (snap.game.interestGroups.Nativists ?? 0) + 1; } },
      { text: 'A scandal in the Treasury is uncovered.', effect: () => { snap.game.meters.honest = clamp(snap.game.meters.honest - 1, -5, 5); } },
    ];
    const chosen = pick(choices);
    chosen.effect();
    addLog(snap, '2.4.2', 'event', chosen.text);
  }
}

// ============================================================================
// 2.4.3 Era events
// ============================================================================
export function runPhase_2_4_3_Era(snap: FullGameSnapshot): EraEvent | null {
  if (snap.game.pendingEraEvents.length === 0) {
    const fresh = buildEraEventsForYear(snap.game.year);
    snap.game.pendingEraEvents = fresh;
  }
  const next = snap.game.pendingEraEvents.find((e) => !e.resolved);
  return next ?? null;
}

export function resolveEraEvent(snap: FullGameSnapshot, eventId: string, responseId: string): void {
  const event = snap.game.pendingEraEvents.find((e) => e.id === eventId);
  if (!event) return;
  const resp = event.responses.find((r) => r.id === responseId);
  if (!resp) return;
  applyEffect(snap, resp.effect);
  event.resolved = true;
  event.chosenResponseId = responseId;
  addLog(snap, '2.4.3', 'event', `${event.title}: ${resp.label}. ${resp.effect.text}`);
}

export function applyEffect(snap: FullGameSnapshot, effect: { meters?: Partial<NationalMeters>; partyPreference?: number; enthusiasm?: { ideology: Ideology; party: PartyId; delta: number }[]; interestGroups?: { id: string; delta: number }[]; startWar?: { name: string; against: string }; text?: string }): void {
  if (effect.meters) {
    for (const k of Object.keys(effect.meters) as (keyof NationalMeters)[]) {
      const v = effect.meters[k];
      if (v != null) snap.game.meters[k] = clamp(snap.game.meters[k] + v, -5, 5);
    }
  }
  if (effect.partyPreference != null) {
    snap.game.partyPreference = clamp(snap.game.partyPreference + effect.partyPreference, -5, 5);
  }
  if (effect.enthusiasm) {
    for (const e of effect.enthusiasm) {
      const slot = snap.game.enthusiasm[e.ideology];
      if (slot) slot[e.party] = clamp(slot[e.party] + e.delta, -5, 5);
    }
  }
  if (effect.interestGroups) {
    for (const g of effect.interestGroups) {
      snap.game.interestGroups[g.id] = clamp((snap.game.interestGroups[g.id] ?? 0) + g.delta, -10, 10);
    }
  }
  if (effect.startWar) {
    const warId = uid('war');
    snap.wars.push({
      id: warId,
      name: effect.startWar.name,
      enemy: effect.startWar.against,
      startYear: snap.game.year,
      warScore: 0,
      generals: snap.game.cabinet.GeneralInChief ? [snap.game.cabinet.GeneralInChief] : [],
      battles: [],
    });
    snap.game.wars.push(warId);
    addLog(snap, '2.4.3', 'war', `${effect.startWar.name} begins against ${effect.startWar.against}.`);
  }
}

// ============================================================================
// 2.5.1 Lingering Phase
// ============================================================================
export function runPhase_2_5_1_Lingering(snap: FullGameSnapshot): void {
  const treasury = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfTreasury);
  const war = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfWar);
  const state = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfState);
  const ag = snap.politicians.find((p) => p.id === snap.game.cabinet.AttorneyGeneral);

  const drift = (skill: number | undefined): number => {
    if (skill == null) return -0.3;
    if (skill >= 4) return 0.5;
    if (skill >= 3) return 0.2;
    if (skill >= 2) return 0;
    if (skill >= 1) return -0.2;
    return -0.5;
  };

  const apply = (k: keyof NationalMeters, delta: number) => {
    const before = snap.game.meters[k];
    const next = clamp(before + delta, -5, 5);
    snap.game.meters[k] = next;
    if (Math.abs(delta) > 0.01) {
      addLog(snap, '2.5.1', 'meter', `${k}: ${before.toFixed(1)} -> ${next.toFixed(1)} (${delta > 0 ? '+' : ''}${delta.toFixed(1)})`);
    }
  };

  apply('revenue', drift(treasury?.skills.admin));
  apply('economic', drift(treasury?.skills.admin) * 0.7);
  apply('military', drift(war?.skills.military) * 0.8);
  apply('domestic', drift(ag?.skills.admin) * 0.5 + (snap.game.wars.length > 0 ? -0.5 : 0));
  apply('honest', drift(ag?.skills.admin) * 0.5 - 0.1);
  apply('quality', drift(treasury?.skills.admin) * 0.4);
  apply('planet', -0.05);

  // Diplomacy drift from SoS
  if (state) {
    for (const k of Object.keys(snap.game.diplomacy)) {
      snap.game.diplomacy[k] = clamp(snap.game.diplomacy[k] + drift(state.skills.admin) * 0.2, -5, 5);
    }
  }

  // National debt
  snap.game.nationalDebt = Math.max(0, snap.game.nationalDebt - snap.game.meters.revenue * 1_500_000);
}

// ============================================================================
// 2.5.2 Governor actions
// ============================================================================
export function runPhase_2_5_2_Governors(snap: FullGameSnapshot): void {
  for (const s of snap.states) {
    if (!s.governorId) continue;
    const gov = snap.politicians.find((p) => p.id === s.governorId);
    if (!gov) continue;
    if (chance(0.3)) {
      const adjustment = (gov.skills.governing - 1) * 0.05;
      s.bias = clamp(s.bias + (gov.partyId === 'BLUE' ? -adjustment : adjustment), -5, 5);
    }
  }
}

// ============================================================================
// 2.5.3 Supreme Court
// ============================================================================
export function runPhase_2_5_3_Court(snap: FullGameSnapshot): void {
  if (chance(0.5)) {
    const titles = [
      'Property rights vs. federal regulation',
      'Interstate commerce dispute',
      'Free speech under wartime laws',
      'State sovereignty over federal authority',
    ];
    const justices = [snap.game.chiefJusticeId, ...snap.game.supremeCourtIds].map((id) => snap.politicians.find((p) => p.id === id)).filter(Boolean) as Politician[];
    if (justices.length === 0) return;
    const conserv = justices.filter((j) => ['Conservative', 'Traditionalist', 'RW Populist'].includes(j.ideology)).length;
    const liberal = justices.filter((j) => ['Liberal', 'Progressive', 'LW Populist'].includes(j.ideology)).length;
    const ruling = conserv > liberal ? 'conservative' : 'liberal';
    const title = pick(titles);
    addLog(snap, '2.5.3', 'court', `Supreme Court rules on ${title}: ${ruling} majority (${ruling === 'conservative' ? conserv : liberal}-${ruling === 'conservative' ? liberal : conserv}).`);
    if (ruling === 'conservative') snap.game.partyPreference = clamp(snap.game.partyPreference - 0.1, -5, 5);
    else snap.game.partyPreference = clamp(snap.game.partyPreference + 0.1, -5, 5);
  }
}

// ============================================================================
// 2.6 Congress (proposals, committee, floor)
// ============================================================================
const BILL_TEMPLATES = [
  { title: 'Tariff Increase', committee: 'Economic' as const, description: 'Raise duties on imported manufactured goods.', effect: { text: 'Tariffs raised.', meters: { revenue: 1, economic: -0.5 }, interestGroups: [{ id: 'Manufacturers', delta: 2 }, { id: 'FreeTrade', delta: -2 }] } },
  { title: 'Tariff Reduction', committee: 'Economic' as const, description: 'Lower duties to encourage trade.', effect: { text: 'Tariffs reduced.', meters: { revenue: -0.5, economic: 0.5 }, interestGroups: [{ id: 'FreeTrade', delta: 2 }, { id: 'Manufacturers', delta: -1 }] } },
  { title: 'Homestead Act', committee: 'Domestic' as const, description: 'Free land to settlers in the West.', effect: { text: 'Homesteads granted.', interestGroups: [{ id: 'Settlers', delta: 3 }, { id: 'Planters', delta: -2 }] } },
  { title: 'Internal Improvements', committee: 'Domestic' as const, description: 'Federal funds for roads and canals.', effect: { text: 'Infrastructure built.', meters: { quality: 0.5, revenue: -1 }, interestGroups: [{ id: 'Workers', delta: 1 }, { id: 'Manufacturers', delta: 1 }] } },
  { title: 'Naval Expansion', committee: 'Foreign' as const, description: 'Build new warships.', effect: { text: 'Navy expanded.', meters: { military: 1, revenue: -1 }, interestGroups: [{ id: 'MilitaryIndustrial', delta: 2 }] } },
  { title: 'Fugitive Slave Act Strengthening', committee: 'Justice' as const, description: 'Federal enforcement of slave catching.', effect: { text: 'Federal slave catchers empowered.', meters: { domestic: -1 }, interestGroups: [{ id: 'Planters', delta: 3 }, { id: 'Abolitionists', delta: -3 }] } },
  { title: 'Personal Liberty Law', committee: 'Justice' as const, description: 'State protections for free black residents.', effect: { text: 'State liberty laws strengthened.', meters: { domestic: -0.5 }, interestGroups: [{ id: 'Abolitionists', delta: 2 }, { id: 'Planters', delta: -2 }] } },
  { title: 'Pacific Railroad Bill', committee: 'Domestic' as const, description: 'Charter a transcontinental railroad.', effect: { text: 'Railroad chartered.', meters: { economic: 1, revenue: -1 }, interestGroups: [{ id: 'WallStreet', delta: 2 }, { id: 'Settlers', delta: 1 }] } },
];

export function runPhase_2_6_1_Proposals(snap: FullGameSnapshot): void {
  snap.game.pendingLegislation = [];
  for (const f of snap.factions) {
    const members = snap.politicians.filter((p) => p.factionId === f.id);
    if (members.length === 0) continue;
    const sponsor = members.sort((a, b) => b.skills.legislative - a.skills.legislative)[0];
    if (!sponsor || sponsor.skills.legislative < 1) continue;
    if (chance(0.6)) {
      const tpl = pick(BILL_TEMPLATES);
      const bill: Legislation = {
        id: uid('bill'),
        year: snap.game.year,
        title: tpl.title,
        description: tpl.description,
        sponsorId: sponsor.id,
        sponsorFactionId: f.id,
        committee: tpl.committee,
        status: 'proposed',
        effects: tpl.effect,
      };
      snap.legislation.push(bill);
      snap.game.pendingLegislation.push(bill.id);
      addLog(snap, '2.6.1', 'legislation', `${f.name} (${sponsor.firstName} ${sponsor.lastName}) proposes "${tpl.title}".`);
    }
  }
}

export function runPhase_2_6_2_Committee(snap: FullGameSnapshot): void {
  for (const billId of snap.game.pendingLegislation) {
    const bill = snap.legislation.find((b) => b.id === billId);
    if (!bill) continue;
    bill.status = 'committee';
    const chairId = snap.game.committeeChairs[bill.committee];
    const chair = snap.politicians.find((p) => p.id === chairId);
    if (!chair) {
      bill.status = 'passed_committee';
      continue;
    }
    const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
    const sameParty = chair.partyId === sponsor?.partyId;
    const passChance = sameParty ? 0.85 : 0.25;
    if (chance(passChance)) {
      bill.status = 'passed_committee';
      addLog(snap, '2.6.2', 'legislation', `"${bill.title}" passes ${bill.committee} committee.`);
    } else {
      bill.status = 'killed_committee';
      addLog(snap, '2.6.2', 'legislation', `"${bill.title}" killed in ${bill.committee} committee.`);
    }
  }
}

export function runPhase_2_6_3_Floor(snap: FullGameSnapshot): void {
  for (const billId of snap.game.pendingLegislation) {
    const bill = snap.legislation.find((b) => b.id === billId);
    if (!bill || bill.status !== 'passed_committee') continue;
    const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
    if (!sponsor) continue;
    const senateMembers = snap.states.flatMap((s) => s.senators.map((sn) => snap.politicians.find((p) => p.id === sn.politicianId))).filter(Boolean) as Politician[];
    const houseMembers = snap.states.flatMap((s) => s.representativeIds.map((id) => snap.politicians.find((p) => p.id === id))).filter(Boolean) as Politician[];
    const tally = (members: Politician[]) => {
      let yea = 0, nay = 0;
      for (const m of members) {
        const sameParty = m.partyId === sponsor.partyId;
        const sameFaction = m.factionId === sponsor.factionId;
        let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.15;
        // ideology distance
        const dist = Math.abs(IDEOLOGY_ORDER.indexOf(m.ideology) - IDEOLOGY_ORDER.indexOf(sponsor.ideology));
        p -= dist * 0.05;
        if (chance(p)) yea++;
        else nay++;
      }
      return { yea, nay };
    };
    const house = tally(houseMembers);
    const senate = tally(senateMembers);
    bill.votes = { house, senate };
    if (house.yea > house.nay && senate.yea > senate.nay) {
      bill.status = 'passed';
      applyEffect(snap, bill.effects);
      addLog(snap, '2.6.3', 'legislation', `"${bill.title}" PASSED. House ${house.yea}-${house.nay}, Senate ${senate.yea}-${senate.nay}.`);
    } else {
      bill.status = 'failed';
      addLog(snap, '2.6.3', 'legislation', `"${bill.title}" FAILED. House ${house.yea}-${house.nay}, Senate ${senate.yea}-${senate.nay}.`);
    }
  }
  snap.game.pendingLegislation = [];
}

// ============================================================================
// 2.7 Foreign Affairs / Military
// ============================================================================
export function runPhase_2_7_1_Diplomacy(snap: FullGameSnapshot): void {
  for (const k of Object.keys(snap.game.diplomacy)) {
    if (chance(0.2)) {
      snap.game.diplomacy[k] = clamp(snap.game.diplomacy[k] + (chance(0.5) ? 0.5 : -0.5), -5, 5);
    }
  }
}

export function runPhase_2_7_2_Military(snap: FullGameSnapshot): void {
  for (const warId of snap.game.wars) {
    const war = snap.wars.find((w) => w.id === warId);
    if (!war || war.endYear) continue;
    const general = snap.politicians.find((p) => p.id === snap.game.cabinet.GeneralInChief);
    const milPower = snap.game.meters.military + (general?.skills.military ?? 0);
    const enemyPower = 1 + Math.random() * 4;
    const roll = d100();
    const win = milPower * 10 + roll > enemyPower * 10 + 50;
    const battleName = `Battle of ${pick(['Bull Run', 'Antietam', 'Shiloh', 'Manassas', 'Gettysburg', 'Vicksburg', 'Chickamauga', 'Chancellorsville'])}`;
    war.battles.push({
      year: snap.game.year,
      name: battleName,
      outcome: win ? 'win' : 'loss',
      text: `${battleName}: ${win ? 'Victory' : 'Defeat'} (Power ${milPower.toFixed(1)} vs ${enemyPower.toFixed(1)}, roll ${roll}).`,
    });
    war.warScore += win ? 10 : -5;
    addLog(snap, '2.7.2', 'war', `${battleName}: ${win ? 'VICTORY' : 'DEFEAT'} (war score ${war.warScore}).`);
    if (war.warScore >= 50) {
      war.endYear = snap.game.year;
      addLog(snap, '2.7.2', 'war', `${war.name} ends in our victory.`);
    } else if (war.warScore <= -50) {
      war.endYear = snap.game.year;
      addLog(snap, '2.7.2', 'war', `${war.name} ends in our defeat.`);
    }
  }
  snap.game.wars = snap.game.wars.filter((id) => {
    const w = snap.wars.find((ww) => ww.id === id);
    return w && !w.endYear;
  });
}

// ============================================================================
// 2.8 Executive
// ============================================================================
export function runPhase_2_8_1_Executive(snap: FullGameSnapshot): void {
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (!president) return;
  if (chance(0.5)) {
    const actions = [
      { text: 'Issue an executive order to streamline the Post Office.', effect: () => { snap.game.meters.honest = clamp(snap.game.meters.honest + 0.3, -5, 5); } },
      { text: 'Direct the army to enforce federal law in territories.', effect: () => { snap.game.meters.domestic = clamp(snap.game.meters.domestic - 0.3, -5, 5); snap.game.meters.military = clamp(snap.game.meters.military + 0.3, -5, 5); } },
      { text: 'Pardon political prisoners.', effect: () => { snap.game.partyPreference = clamp(snap.game.partyPreference + (president.partyId === 'BLUE' ? -0.2 : 0.2), -5, 5); } },
      { text: 'Negotiate a trade treaty.', effect: () => { snap.game.diplomacy.Britain = clamp(snap.game.diplomacy.Britain + 0.5, -5, 5); snap.game.meters.economic = clamp(snap.game.meters.economic + 0.3, -5, 5); } },
    ];
    const a = pick(actions);
    a.effect();
    addLog(snap, '2.8.1', 'event', `President ${president.lastName}: ${a.text}`);
  }
}

export function runPhase_2_8_2_CourtMgmt(snap: FullGameSnapshot): void {
  // Old justices may be pressured if president and chief are different parties
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (!president) return;
  for (const id of [...snap.game.supremeCourtIds]) {
    const j = snap.politicians.find((p) => p.id === id);
    if (!j) continue;
    if (j.age >= 75 && chance(0.15)) {
      j.retiredYear = snap.game.year;
      vacateOffice(snap, j);
      addLog(snap, '2.8.2', 'retire', `Justice ${j.firstName} ${j.lastName} retires from the Supreme Court.`);
      // Replace with new justice
      const candidates = snap.politicians.filter((p) => !p.currentOffice && !p.deathYear && !p.retiredYear && p.partyId === president.partyId && p.skills.judicial >= 2);
      candidates.sort((a, b) => b.skills.judicial - a.skills.judicial);
      const newJustice = candidates[0];
      if (newJustice) {
        newJustice.currentOffice = { type: 'AssociateJustice' };
        snap.game.supremeCourtIds.push(newJustice.id);
        addLog(snap, '2.8.2', 'appointment', `${newJustice.firstName} ${newJustice.lastName} confirmed as Associate Justice.`);
      }
    }
  }
}

// ============================================================================
// 2.9 Elections
// ============================================================================
function ideologyAlignment(ideo: Ideology, party: PartyId): number {
  const map: Record<Ideology, number> = {
    'LW Populist': -3, 'Progressive': -2, 'Liberal': -1,
    'Moderate': 0, 'Conservative': 1, 'Traditionalist': 2, 'RW Populist': 3,
  };
  const v = map[ideo];
  return party === 'BLUE' ? v : -v;
}

function calcStateVote(snap: FullGameSnapshot, stateId: string, candidates: Politician[]): { politicianId: string; partyId: PartyId; pct: number; votes: number }[] {
  const state = snap.states.find((s) => s.id === stateId)!;
  const totalVotes = 100_000 + state.electoralVotes * 5000;
  const scores = candidates.map((c) => {
    const partyId = c.partyId!;
    const enthusiasm = snap.game.enthusiasm[c.ideology]?.[partyId] ?? 0;
    const baseLean = partyId === 'BLUE' ? -state.bias : state.bias;
    const partyPref = partyId === 'BLUE' ? -snap.game.partyPreference : snap.game.partyPreference;
    const pv = c.pvCache;
    const score = 50 + baseLean * 5 + partyPref * 5 + enthusiasm * 2 + pv * 0.1 + (Math.random() - 0.5) * 8;
    return { c, score: Math.max(1, score) };
  });
  const total = scores.reduce((s, x) => s + x.score, 0);
  return scores.map(({ c, score }) => ({
    politicianId: c.id,
    partyId: c.partyId!,
    pct: (score / total) * 100,
    votes: Math.round((score / total) * totalVotes),
  }));
}

export function runPhase_2_9_1_Primaries(snap: FullGameSnapshot): { BLUE: Politician | null; RED: Politician | null } {
  const out = { BLUE: null as Politician | null, RED: null as Politician | null };
  for (const partyId of ['BLUE', 'RED'] as PartyId[]) {
    const candidates = snap.politicians.filter((p) => p.partyId === partyId && !p.deathYear && !p.retiredYear && p.age >= 35 && p.age <= 80 && p.command >= 2);
    candidates.sort((a, b) => b.pvCache + b.command * 5 - (a.pvCache + a.command * 5));
    const top = candidates[0] ?? null;
    out[partyId] = top;
    if (top) addLog(snap, '2.9.1', 'election', `${top.firstName} ${top.lastName} wins ${partyId === 'BLUE' ? 'Democratic' : 'Republican'} primary.`);
  }
  return out;
}

export function runPhase_2_9_4_PresidentialGeneral(snap: FullGameSnapshot, blueCand: Politician | null, redCand: Politician | null): ElectionResult | null {
  if (!blueCand || !redCand) return null;
  const candidates = [blueCand, redCand];
  let blueEv = 0, redEv = 0;
  let bluePop = 0, redPop = 0;
  const stateResults: { state: string; winner: PartyId; bluePct: number; redPct: number }[] = [];
  for (const s of snap.states) {
    const tally = calcStateVote(snap, s.id, candidates);
    const blue = tally.find((t) => t.partyId === 'BLUE')!;
    const red = tally.find((t) => t.partyId === 'RED')!;
    if (blue.pct > red.pct) blueEv += s.electoralVotes;
    else redEv += s.electoralVotes;
    bluePop += blue.votes;
    redPop += red.votes;
    stateResults.push({ state: s.id, winner: blue.pct > red.pct ? 'BLUE' : 'RED', bluePct: blue.pct, redPct: red.pct });
  }
  const winner = blueEv > redEv ? blueCand : redCand;
  const result: ElectionResult = {
    id: uid('elec'),
    year: snap.game.year,
    type: 'presidential',
    candidates: [
      { politicianId: blueCand.id, partyId: 'BLUE', votes: bluePop, pct: (bluePop / (bluePop + redPop)) * 100 },
      { politicianId: redCand.id, partyId: 'RED', votes: redPop, pct: (redPop / (bluePop + redPop)) * 100 },
    ],
    winnerId: winner.id,
    electoralVotes: [
      { politicianId: blueCand.id, ev: blueEv },
      { politicianId: redCand.id, ev: redEv },
    ],
  };
  snap.elections.push(result);
  addLog(snap, '2.9.4', 'election', `Presidential election: ${winner.firstName} ${winner.lastName} wins (${winner.partyId === 'BLUE' ? blueEv : redEv} EV vs ${winner.partyId === 'BLUE' ? redEv : blueEv}).`);
  // Swear in: vacate old president
  const oldPres = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (oldPres) vacateOffice(snap, oldPres);
  winner.currentOffice = { type: 'President' };
  snap.game.presidentId = winner.id;
  // Reset cabinet
  for (const k of Object.keys(snap.game.cabinet) as (keyof typeof snap.game.cabinet)[]) {
    const id = snap.game.cabinet[k];
    if (id) {
      const p = snap.politicians.find((pp) => pp.id === id);
      if (p) vacateOffice(snap, p);
    }
    snap.game.cabinet[k] = null;
  }
  return result;
}

export function runPhase_2_9_5_Governors(snap: FullGameSnapshot): void {
  for (const s of snap.states) {
    if (chance(0.4)) {
      const candidates = snap.politicians.filter((p) => p.state === s.id && p.factionId && !p.currentOffice && p.age >= 30 && p.age <= 75);
      if (candidates.length === 0) continue;
      const blue = candidates.filter((c) => c.partyId === 'BLUE').sort((a, b) => b.pvCache - a.pvCache)[0];
      const red = candidates.filter((c) => c.partyId === 'RED').sort((a, b) => b.pvCache - a.pvCache)[0];
      const list = [blue, red].filter(Boolean) as Politician[];
      if (list.length < 2) continue;
      const tally = calcStateVote(snap, s.id, list);
      tally.sort((a, b) => b.pct - a.pct);
      const winnerId = tally[0].politicianId;
      const winner = snap.politicians.find((p) => p.id === winnerId);
      if (!winner) continue;
      // vacate old governor
      const old = snap.politicians.find((p) => p.id === s.governorId);
      if (old) vacateOffice(snap, old);
      winner.currentOffice = { type: 'Governor', stateId: s.id };
      s.governorId = winner.id;
      const result: ElectionResult = {
        id: uid('elec'),
        year: snap.game.year,
        type: 'governor',
        stateId: s.id,
        candidates: tally,
        winnerId,
      };
      snap.elections.push(result);
    }
  }
}

export function runPhase_2_9_6_Congressional(snap: FullGameSnapshot): void {
  // 1/3 of senators every 2 years (class equal to year mod). House: all reps every 2.
  const senateClass = ((snap.game.year - 1856) / 2) % 3 + 1;
  for (const s of snap.states) {
    // Senate: class equal to senateClass
    for (const sen of [...s.senators]) {
      if (sen.classId !== senateClass) continue;
      const candidates = snap.politicians.filter((p) => p.state === s.id && p.factionId && !p.currentOffice && p.age >= 30 && !p.deathYear && !p.retiredYear);
      if (candidates.length < 2) continue;
      const blue = candidates.filter((c) => c.partyId === 'BLUE').sort((a, b) => b.pvCache - a.pvCache)[0];
      const red = candidates.filter((c) => c.partyId === 'RED').sort((a, b) => b.pvCache - a.pvCache)[0];
      const list = [blue, red].filter(Boolean) as Politician[];
      if (list.length < 2) continue;
      const tally = calcStateVote(snap, s.id, list);
      tally.sort((a, b) => b.pct - a.pct);
      const winnerId = tally[0].politicianId;
      const winner = snap.politicians.find((p) => p.id === winnerId);
      if (!winner) continue;
      const incumbent = snap.politicians.find((p) => p.id === sen.politicianId);
      if (incumbent && incumbent.id !== winner.id) vacateOffice(snap, incumbent);
      winner.currentOffice = { type: 'Senator', stateId: s.id };
      sen.politicianId = winner.id;
    }
    // House: redo all reps
    const oldReps = [...s.representativeIds];
    for (const oldId of oldReps) {
      const old = snap.politicians.find((p) => p.id === oldId);
      const candidates = snap.politicians.filter((p) => p.state === s.id && p.factionId && !p.currentOffice && p.age >= 25 && !p.deathYear && !p.retiredYear);
      if (candidates.length < 2) continue;
      const blue = candidates.filter((c) => c.partyId === 'BLUE').sort((a, b) => b.pvCache - a.pvCache)[0];
      const red = candidates.filter((c) => c.partyId === 'RED').sort((a, b) => b.pvCache - a.pvCache)[0];
      const list = [blue, red].filter(Boolean) as Politician[];
      if (list.length < 2) continue;
      const tally = calcStateVote(snap, s.id, list);
      tally.sort((a, b) => b.pct - a.pct);
      const winnerId = tally[0].politicianId;
      const winner = snap.politicians.find((p) => p.id === winnerId);
      if (!winner) continue;
      if (old && old.id !== winner.id) vacateOffice(snap, old);
      s.representativeIds = s.representativeIds.filter((id) => id !== oldId);
      winner.currentOffice = { type: 'Representative', stateId: s.id };
      s.representativeIds.push(winner.id);
    }
  }
  addLog(snap, '2.9.6', 'election', 'Congressional elections complete.');
}

// ============================================================================
// 2.10 End of Half-Term
// ============================================================================
export function runPhase_2_10_End(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    p.age += 2;
    if (p.careerTrack && p.careerTrackYears < 4) p.careerTrackYears += 2;
  }
  snap.politicians = refreshPv(snap.politicians);
  addLog(snap, '2.10', 'system', `End of ${snap.game.year - 2}-${snap.game.year} term.`);
}

// suppress unused
export { shuffle };
