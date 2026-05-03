import type { FullGameSnapshot, CCDelegate, Politician, Legislation } from '../types';
import { addLog } from './log';
import { uid, chance, pick } from '../rng';

// Appoint Continental Congress delegates.
// Before governors exist: each state's largest faction (by # of politicians in
// that state) nominates delegates from its members in the state. Each
// faction can hold at most one slot until all factions in the state have
// been served once; ties broken by total PV.
// After governors exist: the governor of each state appoints delegates from
// any politician in their state.
export function appointDelegates(snap: FullGameSnapshot): void {
  const cc = ensureCC(snap);

  // Track who served previous term (post-Articles, no consecutive terms)
  const previousServed = new Set(cc.delegates.map((d) => d.politicianId));

  cc.delegates = [];

  for (const state of snap.states) {
    if (!state.isColony && !snap.game.constitutionRatified) {
      // After independence, "states" still need delegates until Constitution
    }
    const slots = state.ccDelegateSlots ?? 2;

    if (snap.game.governorsExist && state.governorId) {
      // Governor appoints delegates. Pick top PV politicians from state, prefer
      // own party first, then any.
      const governor = snap.politicians.find((p) => p.id === state.governorId);
      const candidates = snap.politicians.filter((p) => p.state === state.id && !p.deathYear && !p.retiredYear && p.factionId);
      // Articles enforces no-consecutive
      const filtered = snap.game.articlesOfConfederation
        ? candidates.filter((p) => !previousServed.has(p.id))
        : candidates;
      const usable = filtered.length >= slots ? filtered : candidates;
      const sortKey = (p: Politician): number => {
        let s = p.pvCache;
        if (governor && p.partyId === governor.partyId) s += 50;
        if (governor && p.factionId === governor.factionId) s += 25;
        return s;
      };
      const sorted = [...usable].sort((a, b) => sortKey(b) - sortKey(a));
      // If governor has Manipulative trait, may appoint themselves
      if (governor && governor.traits.includes('Manipulative') && chance(0.35)) {
        cc.delegates.push({ stateId: state.id, politicianId: governor.id, factionId: governor.factionId! });
        // Vacate governorship to take the seat
        state.governorId = null;
      }
      let picked = 0;
      for (const c of sorted) {
        if (cc.delegates.find((d) => d.politicianId === c.id)) continue;
        cc.delegates.push({ stateId: state.id, politicianId: c.id, factionId: c.factionId! });
        picked++;
        if (picked >= slots) break;
      }
    } else {
      // Before governors: largest faction in the state appoints
      const inState = snap.politicians.filter((p) => p.state === state.id && p.factionId && !p.deathYear);
      const factionCounts = new Map<string, Politician[]>();
      for (const p of inState) {
        const arr = factionCounts.get(p.factionId!) ?? [];
        arr.push(p);
        factionCounts.set(p.factionId!, arr);
      }
      const factionsRanked = [...factionCounts.entries()].sort((a, b) => b[1].length - a[1].length || b[1].reduce((s, p) => s + p.pvCache, 0) - a[1].reduce((s, p) => s + p.pvCache, 0));
      let picked = 0;
      for (const [factionId, members] of factionsRanked) {
        if (picked >= slots) break;
        // Each faction picks its highest-PV non-officeholder
        const sorted = [...members].sort((a, b) => b.pvCache - a.pvCache);
        for (const c of sorted) {
          if (cc.delegates.find((d) => d.politicianId === c.id)) continue;
          cc.delegates.push({ stateId: state.id, politicianId: c.id, factionId });
          picked++;
          if (picked >= slots) break;
        }
      }
      // Pad with any remaining politicians if slots unfilled
      const sortedRest = [...inState].sort((a, b) => b.pvCache - a.pvCache);
      for (const c of sortedRest) {
        if (picked >= slots) break;
        if (cc.delegates.find((d) => d.politicianId === c.id)) continue;
        cc.delegates.push({ stateId: state.id, politicianId: c.id, factionId: c.factionId! });
        picked++;
      }
    }
  }
  addLog(snap, '2.10', 'appointment', `Continental Congress delegates appointed: ${cc.delegates.length} delegates from ${snap.states.length} states.`);
}

export function ensureCC(snap: FullGameSnapshot): NonNullable<FullGameSnapshot['game']['continentalCongress']> {
  if (!snap.game.continentalCongress) {
    snap.game.continentalCongress = {
      delegates: [],
      presidentId: null,
      committeeChairs: { domestic: null, foreignMilitary: null, economic: null, judicial: null },
    };
  }
  return snap.game.continentalCongress;
}

// Elect CC President: faction with most delegates picks. If tied, the lowest-PV
// faction in the tie chooses. President must be a current delegate.
export function electCCPresident(snap: FullGameSnapshot): void {
  const cc = ensureCC(snap);
  if (cc.delegates.length === 0) return;
  const factionCounts = new Map<string, number>();
  for (const d of cc.delegates) factionCounts.set(d.factionId, (factionCounts.get(d.factionId) ?? 0) + 1);
  const ranked = [...factionCounts.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return;
  const top = ranked[0][1];
  const tied = ranked.filter(([, c]) => c === top).map(([f]) => f);
  let chooserFaction = tied[0];
  if (tied.length > 1) {
    // pick the tied faction with lowest total PV (an underdog tiebreak)
    const sums = tied.map((f) => ({
      f,
      sum: snap.politicians.filter((p) => p.factionId === f).reduce((s, p) => s + p.pvCache, 0),
    }));
    sums.sort((a, b) => a.sum - b.sum);
    chooserFaction = sums[0].f;
  }
  // President: highest-PV delegate from chooser faction
  const candidates = cc.delegates
    .filter((d) => d.factionId === chooserFaction)
    .map((d) => snap.politicians.find((p) => p.id === d.politicianId)!)
    .filter(Boolean);
  candidates.sort((a, b) => b.pvCache - a.pvCache);
  const winner = candidates[0];
  if (!winner) return;
  cc.presidentId = winner.id;
  // Apply rewards: lose Obscure, +1 leg, +1 cmd, 20% chance Leadership
  winner.traits = winner.traits.filter((t) => t !== 'Obscure');
  winner.skills.legislative = Math.min(5, winner.skills.legislative + 1);
  winner.command = Math.min(5, winner.command + 1);
  if (chance(0.2) && !winner.traits.includes('Leadership')) winner.traits.push('Leadership');
  winner.currentOffice = { type: 'SpeakerOfHouse' }; // re-using closest existing OfficeType
  addLog(snap, '2.2.1', 'appointment', `${winner.firstName} ${winner.lastName} elected President of the Continental Congress.`);
}

// CC President appoints committee chairs
export function appointCCCommittees(snap: FullGameSnapshot): void {
  const cc = ensureCC(snap);
  const president = snap.politicians.find((p) => p.id === cc.presidentId);
  if (!president) return;
  const delegates = cc.delegates.map((d) => snap.politicians.find((p) => p.id === d.politicianId)!).filter(Boolean);
  const pickByStat = (key: keyof Politician['skills']): Politician | undefined => {
    return [...delegates].sort((a, b) => b.skills[key] - a.skills[key])[0];
  };
  cc.committeeChairs.domestic = pickByStat('legislative')?.id ?? null;
  cc.committeeChairs.foreignMilitary = pickByStat('military')?.id ?? null;
  cc.committeeChairs.economic = pickByStat('admin')?.id ?? null;
  cc.committeeChairs.judicial = pickByStat('judicial')?.id ?? null;
  addLog(snap, '2.2.2', 'appointment', `CC committee chairs appointed.`);
}

// Vote on a single bill in the Continental Congress.
// Each state's delegates vote internally; majority -> state casts Aye/Nay.
// Tie -> state abstains.
// Returns whether bill passes (majority of states for pre-Articles, 2/3 after).
export function voteCC(snap: FullGameSnapshot, bill: Legislation): { aye: number; nay: number; abstain: number; passed: boolean; stateVotes: Record<string, 'aye' | 'nay' | 'abstain'> } {
  const cc = ensureCC(snap);
  const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
  if (!sponsor) return { aye: 0, nay: 0, abstain: 0, passed: false, stateVotes: {} };

  const stateVotes: Record<string, 'aye' | 'nay' | 'abstain'> = {};
  for (const state of snap.states) {
    const delegates = cc.delegates.filter((d) => d.stateId === state.id);
    let aye = 0, nay = 0;
    for (const d of delegates) {
      const dpol = snap.politicians.find((p) => p.id === d.politicianId);
      if (!dpol) continue;
      const sameFaction = dpol.factionId === sponsor.factionId;
      const sameParty = dpol.partyId === sponsor.partyId;
      let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.2;
      if (chance(p)) aye++; else nay++;
    }
    if (aye > nay) stateVotes[state.id] = 'aye';
    else if (nay > aye) stateVotes[state.id] = 'nay';
    else stateVotes[state.id] = 'abstain';
  }
  const totals = { aye: 0, nay: 0, abstain: 0 };
  for (const v of Object.values(stateVotes)) totals[v]++;
  const totalStates = snap.states.length;
  const threshold = snap.game.articlesOfConfederation ? Math.ceil(totalStates * 2 / 3) : Math.ceil(totalStates / 2);
  const passed = totals.aye >= threshold;
  return { ...totals, passed, stateVotes };
}

// Auto-propose CC bills. In the Era of Independence, the CC drafts a few
// historically-grounded bills each turn (boycotts, militia funding, foreign
// envoys, etc.).
export function generateCCBills(snap: FullGameSnapshot): void {
  const cc = ensureCC(snap);
  const president = snap.politicians.find((p) => p.id === cc.presidentId);
  if (!president) return;

  const templates: { title: string; description: string; military?: boolean; effect: Legislation['effects'] }[] = [
    { title: 'Continental Boycott', description: 'Coordinate non-importation of British goods.', effect: { text: 'Boycott enacted.', meters: { economic: -0.3 }, partyPreference: 0.2 } },
    { title: 'Militia Funding', description: 'Authorize state militias to muster.', effect: { text: 'Militias funded.', meters: { military: 0.5 } } },
    { title: 'Address to the Crown', description: 'Petition King George for redress.', effect: { text: 'Petition sent.' } },
    { title: 'Foreign Envoy', description: 'Send envoys to France, Spain, or the Netherlands.', effect: { text: 'Envoys dispatched.' } },
    { title: 'War Bonds', description: 'Issue Continental currency to fund the war.', effect: { text: 'Currency issued.', meters: { revenue: -1 } } },
  ];

  // Always propose Continental Army + Navy if Lex&Concord A was chosen and they don't yet exist
  if (snap.game.revolutionaryWar && snap.game.revolutionaryWar.active && !snap.game.revolutionaryWar.seniorGeneralId) {
    snap.legislation.push({
      id: uid('bill'),
      year: snap.game.year,
      title: 'Establish Continental Army',
      description: 'Raise a Continental Army of regulars under congressional authority.',
      sponsorId: president.id,
      sponsorFactionId: president.factionId!,
      committee: 'Foreign',
      status: 'proposed',
      effects: { text: 'Continental Army established.', meters: { military: 1, revenue: -1 } },
    });
    snap.legislation.push({
      id: uid('bill'),
      year: snap.game.year,
      title: 'Establish Continental Navy',
      description: 'Authorize commissioning of warships under congressional authority.',
      sponsorId: president.id,
      sponsorFactionId: president.factionId!,
      committee: 'Foreign',
      status: 'proposed',
      effects: { text: 'Continental Navy established.', meters: { military: 1, revenue: -1 } },
    });
  }
  // Add 2-3 random templates per turn
  const count = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const tpl = pick(templates);
    snap.legislation.push({
      id: uid('bill'),
      year: snap.game.year,
      title: tpl.title,
      description: tpl.description,
      sponsorId: president.id,
      sponsorFactionId: president.factionId!,
      committee: tpl.military ? 'Foreign' : 'Domestic',
      status: 'proposed',
      effects: tpl.effect,
    });
  }
  // Stash pending list
  snap.game.pendingLegislation = snap.legislation
    .filter((b) => b.year === snap.game.year && b.status === 'proposed')
    .map((b) => b.id);
}
