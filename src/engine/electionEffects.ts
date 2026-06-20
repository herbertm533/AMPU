import type { Politician, Trait, Era, ElectionContext, FullGameSnapshot } from '../types';
import { TRAIT_ELECTION_EFFECTS } from '../types';

export interface TraitElectionBreakdown {
  totalBonus: number;
  perTraitBreakdown: { trait: Trait; bonus: number }[];
}

// Per-trait per-context bonus for a single politician given the election context.
// Pure: deterministic in (p.traits, ctx, era, opts.opponentTraits). Iterates
// TRAIT_ELECTION_EFFECTS once. Era-scaled rows match on era; opponent-
// conditional rows swap to bumpedMagnitude when ANY opponent trait matches.
//
// Spec AC #4: pure, no addLog, no RNG, no PV mutation. Callers compose the
// summary log line from the returned data.
export function applyTraitElectionBonus(
  p: Politician,
  ctx: ElectionContext,
  opts: { era: Era; opponentTraits?: Trait[] },
): TraitElectionBreakdown {
  const opp = opts.opponentTraits ?? [];
  const perTraitBreakdown: { trait: Trait; bonus: number }[] = [];
  let totalBonus = 0;
  for (const row of TRAIT_ELECTION_EFFECTS) {
    if (row.context !== ctx) continue;
    if (row.era !== undefined && row.era !== opts.era) continue;
    if (!p.traits.includes(row.trait)) continue;
    let bonus = row.magnitude;
    if (row.opponentConditional && opp.length > 0) {
      const triggered = row.opponentConditional.ifOpponentHas.some((t) => opp.includes(t));
      if (triggered) bonus = row.opponentConditional.bumpedMagnitude;
    }
    if (bonus !== 0) {
      totalBonus += bonus;
      perTraitBreakdown.push({ trait: row.trait, bonus });
    }
  }
  return { totalBonus, perTraitBreakdown };
}

// Composes the once-per-race summary log line from a breakdown. Returns null
// when the breakdown is empty so callers can use a single guard at the call site.
export function composeTraitSummary(
  name: string,
  raceName: string,
  breakdown: { trait: Trait; bonus: number }[],
): string | null {
  if (breakdown.length === 0) return null;
  const positives = breakdown.filter((b) => b.bonus > 0);
  const negatives = breakdown.filter((b) => b.bonus < 0);
  const sum = breakdown.reduce((s, b) => s + b.bonus, 0);
  const sign = sum >= 0 ? '+' : '';
  const parts: string[] = [];
  if (positives.length > 0) {
    const ptext = positives.map((b) => b.trait).join(', ');
    parts.push(`${ptext} (+${positives.reduce((s, b) => s + b.bonus, 0)})`);
  }
  if (negatives.length > 0) {
    const ntext = negatives.map((b) => b.trait).join(', ');
    parts.push(`${ntext} (${negatives.reduce((s, b) => s + b.bonus, 0)})`);
  }
  return `${name}'s traits net ${sign}${sum} in the ${raceName} race — ${parts.join(' / ')}.`;
}

// Derives the snapshot's election-effects era from snap.game.currentEra.
// Returns the four-valued Era; downstream rule rows match on this.
export function snapEra(snap: FullGameSnapshot): Era {
  return snap.game.currentEra;
}
