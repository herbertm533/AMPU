import type { FullGameSnapshot, PhaseId } from '../types';
import { nextPhaseInfo, getPhaseInfo, PHASE_SEQUENCE } from '../phases';
import * as P from './phaseRunners';
import { addLog } from './log';

export interface PhaseAdvanceResult {
  nextPhaseId: PhaseId;
  needsPlayerInput?: 'draft' | 'eraEvent' | 'cabinet';
  payload?: unknown;
  yearChanged: boolean;
}

// Run the current phase non-interactively if possible. Returns whether player
// input is required.
export function runCurrentPhase(snap: FullGameSnapshot): { needsPlayerInput?: 'draft' | 'eraEvent' | 'cabinet'; payload?: unknown } {
  const phaseId = snap.game.phaseId;
  const info = getPhaseInfo(phaseId);
  if (!info) return {};
  switch (phaseId) {
    case '2.1.1': {
      const r = P.runPhase_2_1_1_Draft(snap, false);
      if (r.needsPlayer) return { needsPlayerInput: 'draft', payload: r.draftPool };
      return {};
    }
    case '2.1.2': P.runPhase_2_1_2_CareerTracks(snap); return {};
    case '2.1.3': P.runPhase_2_1_3_FlipFlopper(snap); return {};
    case '2.1.4': P.runPhase_2_1_4_Relocations(snap); return {};
    case '2.1.5': P.runPhase_2_1_5_Ideology(snap); return {};
    case '2.1.6': P.runPhase_2_1_6_Conversions(snap); return {};
    case '2.1.7': P.runPhase_2_1_7_Kingmakers(snap); return {};
    case '2.1.8': P.runPhase_2_1_8_FactionPersonalities(snap); return {};
    case '2.2.1': P.runPhase_2_2_1_CongressLeadership(snap); return {};
    case '2.2.2': P.runPhase_2_2_2_Committees(snap); return {};
    case '2.2.3': P.runPhase_2_2_3_FactionLeaders(snap); return {};
    case '2.2.4': P.runPhase_2_2_4_PartyLeaders(snap); return {};
    case '2.3.1': P.runPhase_2_3_1_Cabinet(snap); return {};
    case '2.3.2': P.runPhase_2_3_2_Military(snap); return {};
    case '2.4.1': P.runPhase_2_4_1_Deaths(snap); return {};
    case '2.4.2': P.runPhase_2_4_2_Anytime(snap); return {};
    case '2.4.3': {
      const event = P.runPhase_2_4_3_Era(snap);
      if (event) return { needsPlayerInput: 'eraEvent', payload: event };
      return {};
    }
    case '2.5.1': P.runPhase_2_5_1_Lingering(snap); return {};
    case '2.5.2': P.runPhase_2_5_2_Governors(snap); return {};
    case '2.5.3': P.runPhase_2_5_3_Court(snap); return {};
    case '2.6.1': P.runPhase_2_6_1_Proposals(snap); return {};
    case '2.6.2': P.runPhase_2_6_2_Committee(snap); return {};
    case '2.6.3': P.runPhase_2_6_3_Floor(snap); return {};
    case '2.7.1': P.runPhase_2_7_1_Diplomacy(snap); return {};
    case '2.7.2': P.runPhase_2_7_2_Military(snap); return {};
    case '2.8.1': P.runPhase_2_8_1_Executive(snap); return {};
    case '2.8.2': P.runPhase_2_8_2_CourtMgmt(snap); return {};
    case '2.9.1': {
      const cands = P.runPhase_2_9_1_Primaries(snap);
      // Stash both candidates on game state for next phases
      snap.game.diplomacy['__blueCandId'] = 0; // placeholder
      // Use a proper field via meta
      (snap.game as unknown as Record<string, unknown>).__primaryWinners = { BLUE: cands.BLUE?.id ?? null, RED: cands.RED?.id ?? null };
      return {};
    }
    case '2.9.2': addLog(snap, '2.9.2', 'election', 'Party conventions ratify the primary winners.'); return {};
    case '2.9.3': addLog(snap, '2.9.3', 'election', 'No third-party challenge this cycle.'); return {};
    case '2.9.4': {
      const winners = (snap.game as unknown as { __primaryWinners?: { BLUE: string | null; RED: string | null } }).__primaryWinners;
      const blue = winners?.BLUE ? snap.politicians.find((p) => p.id === winners.BLUE) ?? null : null;
      const red = winners?.RED ? snap.politicians.find((p) => p.id === winners.RED) ?? null : null;
      P.runPhase_2_9_4_PresidentialGeneral(snap, blue, red);
      return {};
    }
    case '2.9.5': P.runPhase_2_9_5_Governors(snap); return {};
    case '2.9.6': P.runPhase_2_9_6_Congressional(snap); return {};
    case '2.10': P.runPhase_2_10_End(snap); return {};
    default:
      return {};
  }
}

export function advancePhase(snap: FullGameSnapshot): { yearChanged: boolean } {
  const cur = snap.game.phaseId;
  const next = nextPhaseInfo(cur, snap.game.year);
  snap.game.phaseId = next.phaseId;
  snap.game.year = next.nextYear;
  snap.game.phaseIndex = PHASE_SEQUENCE.findIndex((p) => p.id === next.phaseId);
  return { yearChanged: next.turnRollover };
}
