import type { FullGameSnapshot, State } from '../types';
import { EXPANSION_STATES_BY_ID } from '../data/expansionStates';
import { addLog } from './log';

// Admit an annexable territory to the Union. Idempotent: a no-op if the state
// already exists. Newly admitted states are picked up automatically by the
// governor/congressional election and draft phases.
export function admitState(snap: FullGameSnapshot, stateId: string): boolean {
  if (snap.states.some((s) => s.id === stateId)) return false;
  const seed = EXPANSION_STATES_BY_ID[stateId];
  if (!seed) return false;
  const state: State = {
    ...seed,
    admissionYear: snap.game.year,
    governorId: null,
    senators: [],
    representativeIds: [],
    isColony: false,
  };
  snap.states.push(state);
  addLog(snap, 'system', 'system', `${seed.name} has been admitted to the Union.`);
  return true;
}
