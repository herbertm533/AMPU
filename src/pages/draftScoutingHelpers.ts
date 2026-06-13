import type { ImportedDraftee, Politician } from '../types';
import { computePV } from '../pv';

export function computeProjectedPV(d: ImportedDraftee): number {
  const shape: Politician = {
    id: '',
    firstName: d.firstName,
    lastName: d.lastName,
    state: d.state,
    factionId: null,
    partyId: null,
    ideology: d.ideology,
    age: d.age,
    birthYear: d.birthYear,
    skills: d.skills,
    traits: d.traits,
    currentOffice: null,
    careerTrack: null,
    careerTrackYears: 0,
    command: d.command,
    interests: [],
    flipFlopperPenalty: 0,
    pvCache: 0,
    isHistorical: false,
  };
  return computePV(shape);
}
