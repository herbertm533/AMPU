import type { Politician, SkillKey } from '../types';

// Decrement a skill by `amount` (default 1), floored at 0. Returns true iff the
// value actually dropped, so callers gate their addLog line on a real change.
// Pure: probability is decided at the call site, never here.
export function loseSkill(p: Politician, key: SkillKey, amount = 1): boolean {
  const next = Math.max(0, p.skills[key] - amount);
  if (next === p.skills[key]) return false;
  p.skills[key] = next;
  return true;
}

// Same contract for the separate `command` field. command IS eligible for
// old-age / anytime loss (never battles) — see ABILITY_LOSS_RULES / spec F-COMMAND-LOSS.
export function loseCommand(p: Politician, amount = 1): boolean {
  const next = Math.max(0, p.command - amount);
  if (next === p.command) return false;
  p.command = next;
  return true;
}
