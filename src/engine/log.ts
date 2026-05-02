import type { EventEntry, FullGameSnapshot, PhaseId } from '../types';
import { uid } from '../rng';

export function addLog(snap: FullGameSnapshot, phase: PhaseId | 'system', category: EventEntry['category'], text: string, meta?: Record<string, unknown>): void {
  snap.events.push({
    id: uid('ev'),
    year: snap.game.year,
    phase,
    category,
    text,
    meta,
  });
}
