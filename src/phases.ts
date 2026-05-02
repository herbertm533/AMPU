import type { PhaseId, PhaseInfo } from './types';

export const PHASE_SEQUENCE: PhaseInfo[] = [
  { id: '2.1.1', label: 'Politician Draft', description: 'Rookie politicians enter the pool. Snake-order draft.', category: '2.1 Politician Management' },
  { id: '2.1.2', label: 'Career Tracks', description: 'Assign politicians to career tracks for skill development.', category: '2.1 Politician Management' },
  { id: '2.1.3', label: 'Flip-Flopper Cleanup', description: 'Expire flip-flopper penalties.', category: '2.1 Politician Management' },
  { id: '2.1.4', label: 'Relocations', description: 'Politicians attempt to relocate to other states.', category: '2.1 Politician Management' },
  { id: '2.1.5', label: 'Ideology Shifts', description: 'Politicians may shift ideology based on faction environment.', category: '2.1 Politician Management' },
  { id: '2.1.6', label: 'Faction Conversions', description: 'Politicians may switch factions.', category: '2.1 Politician Management' },
  { id: '2.1.7', label: 'Kingmakers & Protégés', description: 'Assign mentor relationships.', category: '2.1 Politician Management' },
  { id: '2.1.8', label: 'Faction Personalities', description: 'Update faction ideology cards and lobby alignments.', category: '2.1 Politician Management' },

  { id: '2.2.1', label: 'Congressional Leadership', description: 'Elect Speaker and Pro Tem.', category: '2.2 Leadership Selection' },
  { id: '2.2.2', label: 'Committee Chairs', description: 'Appoint chairs for the four committees.', category: '2.2 Leadership Selection' },
  { id: '2.2.3', label: 'Faction Leaders', description: 'Each faction selects its leader.', category: '2.2 Leadership Selection' },
  { id: '2.2.4', label: 'Party Leaders', description: 'Each party selects its leader.', category: '2.2 Leadership Selection' },

  { id: '2.3.1', label: 'Cabinet Appointments', description: 'President nominates cabinet members.', category: '2.3 Presidential Appointments' },
  { id: '2.3.2', label: 'Military Appointments', description: 'General in Chief and Admiral.', category: '2.3 Presidential Appointments' },

  { id: '2.4.1', label: 'Deaths & Retirements', description: 'Random deaths and retirements occur.', category: '2.4 Events' },
  { id: '2.4.2', label: 'Anytime Events', description: 'General historical events fire.', category: '2.4 Events' },
  { id: '2.4.3', label: 'Era Events', description: 'Era-specific decision events. INTERACTIVE.', category: '2.4 Events' },

  { id: '2.5.1', label: 'Lingering Phase', description: 'National meters tick based on cabinet and conditions.', category: '2.5 Governance' },
  { id: '2.5.2', label: 'Governor Actions', description: 'Governors take state-level actions.', category: '2.5 Governance' },
  { id: '2.5.3', label: 'Supreme Court', description: 'Pending cases are decided.', category: '2.5 Governance' },

  { id: '2.6.1', label: 'Bill Proposals', description: 'Each faction proposes bills.', category: '2.6 Congress in Session' },
  { id: '2.6.2', label: 'Committee Review', description: 'Bills are reviewed in committee.', category: '2.6 Congress in Session' },
  { id: '2.6.3', label: 'Floor Votes', description: 'Bills face full House and Senate votes.', category: '2.6 Congress in Session' },

  { id: '2.7.1', label: 'Diplomacy', description: 'International relations management.', category: '2.7 Foreign Affairs' },
  { id: '2.7.2', label: 'Military Action', description: 'Resolve battles in active wars.', category: '2.7 Foreign Affairs' },

  { id: '2.8.1', label: 'Executive Actions', description: 'President takes unilateral actions.', category: '2.8 Executive Actions' },
  { id: '2.8.2', label: 'Court Management', description: 'Pressure justices, fill vacancies.', category: '2.8 Executive Actions' },

  { id: '2.9.1', label: 'Presidential Primaries', description: 'Each party nominates candidates.', category: '2.9 Elections' },
  { id: '2.9.2', label: 'Conventions', description: 'Party conventions finalize nominees.', category: '2.9 Elections' },
  { id: '2.9.3', label: 'Third Party', description: 'Third party challenge check.', category: '2.9 Elections' },
  { id: '2.9.4', label: 'Presidential Election', description: 'State-by-state general election.', category: '2.9 Elections' },
  { id: '2.9.5', label: 'Governor Elections', description: 'State governor races.', category: '2.9 Elections' },
  { id: '2.9.6', label: 'Congressional Elections', description: 'House and Senate races.', category: '2.9 Elections' },

  { id: '2.10', label: 'End of Half-Term', description: 'Aging, retirements, summary.', category: '2.10 End of Turn' },
];

export function isElectionYear(year: number): boolean {
  return year % 2 === 0;
}

export function isPresidentialYear(year: number): boolean {
  return year % 4 === 0;
}

export function isDraftYear(year: number): boolean {
  return year % 4 === 0;
}

export function shouldRunPhase(phaseId: PhaseId, year: number): boolean {
  if (phaseId === '2.1.1') return isDraftYear(year);
  if (phaseId === '2.9.1' || phaseId === '2.9.2' || phaseId === '2.9.3' || phaseId === '2.9.4' || phaseId === '2.9.5')
    return isPresidentialYear(year);
  if (phaseId === '2.9.6') return isElectionYear(year);
  return true;
}

export function getPhaseInfo(phaseId: PhaseId): PhaseInfo | undefined {
  return PHASE_SEQUENCE.find((p) => p.id === phaseId);
}

export function getPhaseIndex(phaseId: PhaseId): number {
  return PHASE_SEQUENCE.findIndex((p) => p.id === phaseId);
}

export function nextPhaseInfo(currentPhaseId: PhaseId, year: number): { phaseId: PhaseId; nextYear: number; turnRollover: boolean } {
  const idx = getPhaseIndex(currentPhaseId);
  let next = idx + 1;
  let nextYear = year;
  let rollover = false;
  while (next < PHASE_SEQUENCE.length) {
    if (shouldRunPhase(PHASE_SEQUENCE[next].id, year)) {
      return { phaseId: PHASE_SEQUENCE[next].id, nextYear, turnRollover: rollover };
    }
    next++;
  }
  // wrap to next turn (advance year by 2)
  nextYear = year + 2;
  rollover = true;
  for (let i = 0; i < PHASE_SEQUENCE.length; i++) {
    if (shouldRunPhase(PHASE_SEQUENCE[i].id, nextYear)) {
      return { phaseId: PHASE_SEQUENCE[i].id, nextYear, turnRollover: rollover };
    }
  }
  return { phaseId: '2.10', nextYear, turnRollover: rollover };
}
