import type { FullGameSnapshot, ConstitutionalConvention, ConventionVote, ConstitutionalArticles, Politician } from '../types';
import { addLog } from './log';
import { uid, chance, pick } from '../rng';

export function makeConvention(year: number): ConstitutionalConvention {
  const votes: ConventionVote[] = [
    {
      articleKey: 'legislature',
      options: [
        { id: 'a', label: 'Bicameral', description: 'Senate + House of Representatives.', value: 'bicameral' },
        { id: 'b', label: 'Unicameral', description: 'A single legislative chamber.', value: 'unicameral' },
      ],
      selected: null,
    },
    {
      articleKey: 'executive',
      options: [
        { id: 'a', label: 'Elected President (4-year term)', description: 'A unitary executive elected by the people / Electoral College.', value: 'elected_president' },
        { id: 'b', label: 'President elected by Congress', description: 'Congress chooses the executive.', value: 'congressional_president' },
        { id: 'c', label: 'Executive Council', description: 'A multi-member council, no single executive.', value: 'executive_council' },
      ],
      selected: null,
    },
    {
      articleKey: 'judiciary',
      options: [
        { id: 'a', label: 'Federal Judiciary, appointed', description: 'Federal courts with appointed judges.', value: 'appointed' },
        { id: 'b', label: 'Elected Judges', description: 'Judges chosen by election.', value: 'elected' },
      ],
      selected: null,
    },
    {
      articleKey: 'slaveCompromise',
      options: [
        { id: 'a', label: '3/5 Compromise', description: 'Each enslaved person counts as 3/5 for representation.', value: 'three_fifths' },
        { id: 'b', label: 'Full counting', description: 'Each enslaved person counts as one.', value: 'full' },
        { id: 'c', label: 'No counting', description: 'Enslaved persons not counted at all.', value: 'none' },
      ],
      selected: null,
    },
    {
      articleKey: 'amendmentProcess',
      options: [
        { id: 'a', label: '3/4 of states', description: 'A practical bar to amendment.', value: 'three_fourths' },
        { id: 'b', label: '2/3 of states', description: 'A lower bar.', value: 'two_thirds' },
        { id: 'c', label: 'Unanimous', description: 'Any state can block any amendment.', value: 'unanimous' },
      ],
      selected: null,
    },
    {
      articleKey: 'presidentialEligibility',
      options: [
        { id: 'a', label: 'Natural-born citizens only', description: 'Foreign-born citizens excluded.', value: 'natural_born' },
        { id: 'b', label: 'Any citizen', description: 'Any citizen, naturalized or natural-born.', value: 'any_citizen' },
      ],
      selected: null,
    },
    {
      articleKey: 'termLimits',
      options: [
        { id: 'a', label: 'Two terms maximum', description: 'A constitutional cap.', value: 'two_terms' },
        { id: 'b', label: 'No limits', description: 'Unlimited reelection.', value: 'no_limits' },
      ],
      selected: null,
    },
  ];
  return {
    id: uid('conv'),
    year,
    votes,
    fatherOfConstitutionId: null,
    federalistAuthorIds: [],
    ratified: false,
    resolved: false,
  };
}

// Auto-resolve: CPU factions vote based on party affiliation.
// Federalists (RED) tend to favor strong central government, Anti-Federalists (BLUE) favor weaker.
export function autoFillCPUVotes(snap: FullGameSnapshot, conv: ConstitutionalConvention): void {
  // For each unselected vote, pick the option most popular among CPU factions
  const cc = snap.game.continentalCongress;
  if (!cc) return;
  for (const v of conv.votes) {
    if (v.selected) continue;
    const tally: Record<string, number> = {};
    for (const opt of v.options) tally[opt.id] = 0;
    for (const d of cc.delegates) {
      const p = snap.politicians.find((pp) => pp.id === d.politicianId);
      if (!p) continue;
      // Heuristic preference per article
      const pref = preferredOption(v.articleKey, p);
      const optId = v.options.find((o) => o.value === pref)?.id ?? v.options[0].id;
      tally[optId]++;
    }
    const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    if (best) v.selected = best[0];
  }
}

function preferredOption(key: keyof ConstitutionalArticles, p: Politician): string {
  switch (key) {
    case 'legislature':
      return p.partyId === 'RED' ? 'bicameral' : (chance(0.7) ? 'bicameral' : 'unicameral');
    case 'executive':
      if (p.partyId === 'RED') return 'elected_president';
      return chance(0.5) ? 'elected_president' : (chance(0.5) ? 'congressional_president' : 'executive_council');
    case 'judiciary':
      return p.partyId === 'RED' ? 'appointed' : (chance(0.6) ? 'appointed' : 'elected');
    case 'slaveCompromise':
      // Slave-state ideologies favor full counting; abolitionist ideologies favor none
      if (['LW Populist', 'Progressive'].includes(p.ideology)) return chance(0.7) ? 'none' : 'three_fifths';
      if (['Traditionalist', 'RW Populist'].includes(p.ideology)) return chance(0.6) ? 'full' : 'three_fifths';
      return 'three_fifths';
    case 'amendmentProcess':
      return p.partyId === 'RED' ? 'three_fourths' : (chance(0.5) ? 'three_fourths' : 'two_thirds');
    case 'presidentialEligibility':
      return chance(0.85) ? 'natural_born' : 'any_citizen';
    case 'termLimits':
      return p.partyId === 'BLUE' ? 'two_terms' : 'no_limits';
  }
}

// Apply Convention results: build the Constitution, ratify if 9+ governors approve,
// transition era to federalism if ratified.
export function applyConvention(snap: FullGameSnapshot, conv: ConstitutionalConvention): void {
  const articles: Partial<ConstitutionalArticles> = {};
  for (const v of conv.votes) {
    if (!v.selected) continue;
    const opt = v.options.find((o) => o.id === v.selected);
    if (!opt) continue;
    (articles as Record<string, string>)[v.articleKey] = opt.value;
  }
  // Defaults for any unselected
  const finalArticles: ConstitutionalArticles = {
    legislature: (articles.legislature as ConstitutionalArticles['legislature']) ?? 'bicameral',
    executive: (articles.executive as ConstitutionalArticles['executive']) ?? 'elected_president',
    judiciary: (articles.judiciary as ConstitutionalArticles['judiciary']) ?? 'appointed',
    slaveCompromise: (articles.slaveCompromise as ConstitutionalArticles['slaveCompromise']) ?? 'three_fifths',
    amendmentProcess: (articles.amendmentProcess as ConstitutionalArticles['amendmentProcess']) ?? 'three_fourths',
    presidentialEligibility: (articles.presidentialEligibility as ConstitutionalArticles['presidentialEligibility']) ?? 'natural_born',
    termLimits: (articles.termLimits as ConstitutionalArticles['termLimits']) ?? 'no_limits',
  };
  snap.game.constitutionalArticles = finalArticles;

  // Father of the Constitution: highest-PV delegate (or default to Madison-equivalent)
  const cc = snap.game.continentalCongress;
  if (cc && cc.delegates.length > 0) {
    const ranked = cc.delegates
      .map((d) => snap.politicians.find((p) => p.id === d.politicianId)!)
      .filter(Boolean)
      .sort((a, b) => b.skills.legislative + b.skills.judicial - (a.skills.legislative + a.skills.judicial));
    const father = ranked[0];
    if (father) {
      conv.fatherOfConstitutionId = father.id;
      if (!father.traits.includes('Celebrity')) father.traits.push('Celebrity');
      father.command = Math.min(5, father.command + 1);
      addLog(snap, '2.4.3', 'event', `${father.firstName} ${father.lastName} hailed as Father of the Constitution.`);
    }
    // Three Federalist Paper authors
    const candidates = ranked.filter((p) => p.partyId === 'RED').slice(0, 6);
    const authors: string[] = [];
    for (let i = 0; i < 3 && candidates.length > 0; i++) {
      const a = pick(candidates);
      if (!authors.includes(a.id)) {
        authors.push(a.id);
        a.command = Math.min(5, a.command + 1);
        if (!a.traits.includes('Egghead')) a.traits.push('Egghead');
      }
    }
    conv.federalistAuthorIds = authors;
  }

  // Ratification: count governors who approve. Use bias as proxy.
  let approve = 0;
  for (const s of snap.states) {
    const gov = s.governorId ? snap.politicians.find((p) => p.id === s.governorId) : null;
    const stateLeans = s.bias > -0.5; // states leaning patriot/federalist
    const govApproves = gov ? gov.partyId === 'RED' || chance(0.5) : stateLeans;
    if (govApproves) approve++;
  }
  conv.ratified = approve >= 9;
  conv.resolved = true;
  addLog(snap, '2.4.3', 'event', `Constitutional Convention concludes. Articles set. Ratification: ${approve}/${snap.states.length} states. Constitution ${conv.ratified ? 'RATIFIED' : 'REJECTED'}.`);

  if (conv.ratified) {
    snap.game.constitutionRatified = true;
    snap.game.currentEra = 'federalism';
    snap.game.continentalCongress = null;
    snap.game.articlesOfConfederation = false;
    addLog(snap, '2.4.3', 'system', 'The Constitution takes effect. The Confederation Congress is dissolved. Federalism begins.');
    // Federal Republic: states are no longer colonies
    for (const s of snap.states) {
      s.isColony = false;
      s.electoralVotes = Math.max(3, (s.ccDelegateSlots ?? 2) + 1);
    }
  }
}
