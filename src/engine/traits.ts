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

// Normalize the optional Trait | Trait[] value in TRAIT_CONFLICTS to an array.
export function conflictsFor(t: Trait): Trait[] {
  const raw = TRAIT_CONFLICTS[t];
  return raw == null ? [] : Array.isArray(raw) ? raw : [raw];
}

// Find the first conflict-pair trait the politician currently holds. Null if
// no conflict pair is held. Used by failed-d6 log paths to name the holder.
export function firstHeldConflict(p: Politician, t: Trait): Trait | null {
  return conflictsFor(t).find((c) => p.traits.includes(c)) ?? null;
}

// Conflict-aware grant. Resolution table:
//   - already held              -> { granted: false, replaced: null }  (silent dedupe)
//   - no conflict pair          -> addTrait, { granted: true, replaced: null }
//   - no conflicting trait held -> addTrait, { granted: true, replaced: null }
//   - conflict held + d6 OK     -> remove held, add new, { granted: true, replaced: <held> }
//   - conflict held + d6 NG     -> no change, { granted: false, replaced: null }
// TRAIT_CONFLICTS values may be Trait or Trait[]; the first held conflict
// is the one d6-arbitrated and replaced on success.
export function tryGrantTrait(
  p: Politician,
  t: Trait,
): { granted: boolean; replaced: Trait | null } {
  if (p.traits.includes(t)) return { granted: false, replaced: null };
  const raw = TRAIT_CONFLICTS[t];
  const conflicts: Trait[] = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  const held = conflicts.find((c) => p.traits.includes(c)) ?? null;
  if (held === null) {
    p.traits.push(t);
    return { granted: true, replaced: null };
  }
  if (d(6) >= TRAIT_LIFECYCLE_RULES.conflictD6Threshold) {
    p.traits = p.traits.filter((x) => x !== held);
    p.traits.push(t);
    return { granted: true, replaced: held };
  }
  return { granted: false, replaced: null };
}
