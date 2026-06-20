import type { Politician, Trait } from '../types';
import { TRAIT_CONFLICTS, TRAIT_LIFECYCLE_RULES } from '../types';
import { d } from '../rng';

// Push if absent. Returns true iff a trait was actually added, so callers
// can gate their addLog line on a real change. Does NOT consult conflicts —
// callers route conflict-aware gains through tryGrantTrait. Pure; no PV refresh.
export function addTrait(p: Politician, t: Trait): boolean {
  if (p.traits.includes(t)) return false;
  p.traits.push(t);
  return true;
}

// Filter out. Returns true iff the politician actually held the trait. Pure.
export function removeTrait(p: Politician, t: Trait): boolean {
  if (!p.traits.includes(t)) return false;
  p.traits = p.traits.filter((x) => x !== t);
  return true;
}

// Conflict-aware grant. Resolution table:
//   - already held         -> { granted: false, replaced: null }  (silent dedupe)
//   - no conflict pair     -> addTrait, { granted: true, replaced: null }
//   - conflict NOT held    -> addTrait, { granted: true, replaced: null }
//   - conflict held + d6 OK -> remove held, add new, { granted: true, replaced: <held> }
//   - conflict held + d6 NG -> no change, { granted: false, replaced: null }
export function tryGrantTrait(
  p: Politician,
  t: Trait,
): { granted: boolean; replaced: Trait | null } {
  if (p.traits.includes(t)) return { granted: false, replaced: null };
  const conflict = TRAIT_CONFLICTS[t];
  if (!conflict || !p.traits.includes(conflict)) {
    p.traits.push(t);
    return { granted: true, replaced: null };
  }
  if (d(6) >= TRAIT_LIFECYCLE_RULES.conflictD6Threshold) {
    p.traits = p.traits.filter((x) => x !== conflict);
    p.traits.push(t);
    return { granted: true, replaced: conflict };
  }
  return { granted: false, replaced: null };
}
