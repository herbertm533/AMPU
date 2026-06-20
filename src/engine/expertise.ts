import type { Politician, Expertise } from '../types';

// Dedupe-on-insert. Returns true iff a new tag was actually added, so callers
// can gate their addLog line on a real gain (re-grants are silent no-ops).
export function addExpertise(p: Politician, tag: Expertise): boolean {
  if (p.expertise.includes(tag)) return false;
  p.expertise.push(tag);
  return true;
}
