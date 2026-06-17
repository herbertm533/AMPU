import type {
  FullGameSnapshot,
  EraEvent,
  EraEventResponseEffect,
  MeterKey,
  PartyId,
  Predicate,
} from '../types';
import type { AnytimeEventEffect } from '../data/anytimeEvents';
import type { AnytimeNationalEffect } from '../data/anytimeNationalEvents';
import { ERA_GRAPH_1772 } from '../data/eraEvents1772';
import { evalPredicate } from './eraGraph';

// ============================================================================
// Pure label module. No React, no I/O. Renders era-correct strings + chips for
// the 2.4.2/2.4.3 events UI per the historian's binding rules:
//   1. cc-president labels split at 1781 (Continental vs. Confederation Cong.)
//   2. enthusiasm polarity: Patriot/Federalist pre-1789, D/R otherwise
//   3. warActive era-gated copy
//   4. warVictoryGuaranteed softened to "French alliance: defeat unlikely"
//   5. interest-group IDs flagged as anachronisms on pre-1789 events
// ============================================================================

export type ChipTone =
  | 'positive'
  | 'negative'
  | 'neutral'
  | 'war'
  | 'anachronism'
  | 'pass'
  | 'fail'
  | 'muted';

export interface EffectChip {
  label: string;
  tone: ChipTone;
}

export interface PredicateChip {
  label: string;
  tone: 'pass' | 'fail' | 'muted';
  satisfied?: boolean;
  group?: PredicateChip[]; // 'any' composite ("one of: …")
  strike?: boolean; // 'not' wrapper
}

const METER_LABELS: Record<MeterKey, string> = {
  revenue: 'Revenue',
  economic: 'Economy',
  military: 'Military',
  domestic: 'Domestic Stability',
  honest: 'Honest Govt',
  quality: 'Quality of Life',
  planet: 'Planet',
};

// Interest-group IDs that postdate 1789 (rule 5). Sourced from factions1856.ts
// + the historian's call. The 1772 graph itself only uses `frontier` today; this
// is forward-looking — flags anachronisms surfaced by future authors.
const INTEREST_ANACHRONISM_PRE_1789 = new Set<string>([
  'BigTech', 'MilitaryIndustrial', 'LWMedia', 'RWMedia', 'Globalists',
  'Pacifists', 'WallStreet', 'EnvNGOs', 'OrganizedLabor', 'IndustrialUnions',
  'ServiceUnions', 'TechWorkers', 'PublicEmployees', 'TeacherUnions',
  'PoliceUnions',
]);

// Dev-only dedupe set so the anachronism console.warn fires once per id per
// browser session — keeps the dev feed quiet under high re-render counts.
const _warnedAnachronisms = new Set<string>();

// Title + response-label lookup for `eventCompleted` / `eventChose` predicates.
// Built once at module load by walking ERA_GRAPH_1772 with year=0 (titles are
// year-agnostic for every authored node).
const NODE_TITLE = new Map<string, string>();
const NODE_RESPONSE_LABEL = new Map<string, string>();
for (const n of ERA_GRAPH_1772) {
  const built = n.build(0);
  NODE_TITLE.set(n.templateId, built.title);
  for (const r of built.responses) {
    NODE_RESPONSE_LABEL.set(`${n.templateId}:${r.id}`, r.label);
  }
}

function fmtDelta(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

export function formatDecider(
  decider: EraEvent['decider'],
  _scenarioId: string,
  year: number,
): string {
  if (decider === 'cc-president') {
    // Articles of Confederation took effect Mar 1, 1781 — the body is renamed.
    return year < 1781
      ? 'President of the Continental Congress'
      : 'President of the Confederation Congress';
  }
  if (decider === 'president') return 'President of the United States';
  if (decider === 'cabinet') return 'Your Cabinet';
  if (decider === 'congress') return 'Congress';
  return 'Automatic (no decider)';
}

export function formatPartyId(partyId: PartyId, scenarioId: string, year: number): string {
  // Rule 2: 1772 / pre-1789 → Patriot / Federalist; 1856 → D / R.
  if (scenarioId === '1772' && year < 1789) {
    return partyId === 'BLUE' ? 'Patriot' : 'Federalist';
  }
  return partyId === 'BLUE' ? 'D' : 'R';
}

function leafLabel(snap: FullGameSnapshot, leaf: Predicate): string {
  if ('yearAtLeast' in leaf) return `Year ≥ ${leaf.yearAtLeast}`;
  if ('yearAtMost' in leaf) return `Year ≤ ${leaf.yearAtMost}`;
  if ('eventCompleted' in leaf) {
    return `After: ${NODE_TITLE.get(leaf.eventCompleted) ?? leaf.eventCompleted}`;
  }
  if ('eventChose' in leaf) {
    const t = NODE_TITLE.get(leaf.eventChose.template) ?? leaf.eventChose.template;
    const r =
      NODE_RESPONSE_LABEL.get(`${leaf.eventChose.template}:${leaf.eventChose.response}`)
      ?? leaf.eventChose.response;
    return `${t} → chose "${r}"`;
  }
  if ('meterAtLeast' in leaf) {
    return `${METER_LABELS[leaf.meterAtLeast.meter]} ≥ ${leaf.meterAtLeast.value}`;
  }
  if ('meterAtMost' in leaf) {
    return `${METER_LABELS[leaf.meterAtMost.meter]} ≤ ${leaf.meterAtMost.value}`;
  }
  if ('interestAtLeast' in leaf) {
    return `${leaf.interestAtLeast.group} interest ≥ ${leaf.interestAtLeast.value}`;
  }
  if ('diplomacyAtLeast' in leaf) {
    return `${leaf.diplomacyAtLeast.nation} relations ≥ ${leaf.diplomacyAtLeast.value}`;
  }
  if ('warActive' in leaf) {
    if (!leaf.warActive) return 'Not at war';
    // Rule 3: era-gated copy. The 1772 graph's war flag tracks the Revolution;
    // the 1856 scenario will eventually use it for the Civil War.
    const y = snap.game.year;
    if (snap.game.scenarioId === '1856') return 'The Civil War is being fought';
    if (y < 1776) return 'The colonies are at war with Britain';
    if (y <= 1783) return 'The Revolutionary War is being fought';
    return 'At war';
  }
  if ('warOutcome' in leaf) return leaf.warOutcome === 'win' ? 'War won' : 'War lost';
  if ('stateAdmitted' in leaf) {
    const st = snap.states.find((s) => s.id === leaf.stateAdmitted);
    return `${st?.name ?? leaf.stateAdmitted.toUpperCase()} admitted to the Union`;
  }
  if ('officeControlledByPlayer' in leaf) {
    return leaf.officeControlledByPlayer === 'cc-president'
      ? 'You hold the Congressional presidency'
      : 'You hold the General-in-Chief office';
  }
  if ('rosterHasSkill' in leaf) {
    return `Your faction has a politician with ${leaf.rosterHasSkill.skill} ≥ ${leaf.rosterHasSkill.min}`;
  }
  if ('flag' in leaf) {
    // Rule 4: soften warVictoryGuaranteed.
    if (leaf.flag === 'warVictoryGuaranteed') return 'French alliance: defeat unlikely';
    if (leaf.flag === 'loansEnabled') return 'Foreign loans authorized';
    return String(leaf.flag);
  }
  return '?';
}

export function formatPredicate(snap: FullGameSnapshot, pred: Predicate): PredicateChip[] {
  return walkPredicate(snap, pred, false);
}

function walkPredicate(snap: FullGameSnapshot, pred: Predicate, negated: boolean): PredicateChip[] {
  if ('all' in pred) {
    if (pred.all.length === 0) {
      return [{ label: 'Unconditional (core spine event)', tone: 'muted' }];
    }
    return pred.all.flatMap((p) => walkPredicate(snap, p, negated));
  }
  if ('any' in pred) {
    const inner = pred.any.flatMap((p) => walkPredicate(snap, p, negated));
    const rawSatisfied = pred.any.some((p) => evalPredicate(snap, p));
    const satisfied = negated ? !rawSatisfied : rawSatisfied;
    return [{
      label: 'One of:',
      tone: satisfied ? 'pass' : 'fail',
      satisfied,
      group: inner,
    }];
  }
  if ('not' in pred) {
    return walkPredicate(snap, pred.not, !negated).map((c) => ({ ...c, strike: true }));
  }
  // Leaf: evaluate, then flip for any enclosing `not`.
  const rawSatisfied = evalPredicate(snap, pred);
  const satisfied = negated ? !rawSatisfied : rawSatisfied;
  return [{
    label: leafLabel(snap, pred),
    tone: satisfied ? 'pass' : 'fail',
    satisfied,
  }];
}

export function formatEffect(
  snap: FullGameSnapshot,
  effect: EraEventResponseEffect,
  scenarioId: string,
  year: number,
): EffectChip[] {
  const chips: EffectChip[] = [];
  const pre1789 = scenarioId === '1772' && year < 1789;

  if (effect.meters) {
    for (const [k, v] of Object.entries(effect.meters)) {
      if (v == null) continue;
      const meter = METER_LABELS[k as MeterKey] ?? k;
      chips.push({
        label: `${meter} ${fmtDelta(v as number)}`,
        tone: (v as number) > 0 ? 'positive' : 'negative',
      });
    }
  }
  if (effect.partyPreference != null) {
    chips.push({
      label: `Party preference ${fmtDelta(effect.partyPreference)}`,
      tone: 'neutral',
    });
  }
  if (effect.enthusiasm) {
    for (const e of effect.enthusiasm) {
      chips.push({
        label: `${e.ideology} → ${formatPartyId(e.party, scenarioId, year)} ${fmtDelta(e.delta)}`,
        tone: 'neutral',
      });
    }
  }
  if (effect.interestGroups) {
    for (const g of effect.interestGroups) {
      const anachronistic = pre1789 && INTEREST_ANACHRONISM_PRE_1789.has(g.id);
      if (anachronistic && import.meta.env.DEV && !_warnedAnachronisms.has(g.id)) {
        _warnedAnachronisms.add(g.id);
        console.warn(`[labels] Anachronistic interest "${g.id}" on a pre-1789 event chip.`);
      }
      chips.push({
        label: `${g.id} ${fmtDelta(g.delta)}`,
        tone: anachronistic ? 'anachronism' : g.delta > 0 ? 'positive' : 'negative',
      });
    }
  }
  if (effect.domesticStability != null) {
    chips.push({
      label: `Domestic Stability ${fmtDelta(effect.domesticStability)}`,
      tone: effect.domesticStability > 0 ? 'positive' : 'negative',
    });
  }
  if (effect.diplomacy) {
    for (const d of effect.diplomacy) {
      chips.push({
        label: `${d.nation} ${fmtDelta(d.delta)}`,
        tone: d.delta > 0 ? 'positive' : 'negative',
      });
    }
  }
  if (effect.startWar) {
    chips.push({
      label: `⚔ War: ${effect.startWar.name} vs ${effect.startWar.against}`,
      tone: 'war',
    });
  }
  return chips;
}

export function previewEffect(
  snap: FullGameSnapshot,
  effect: EraEventResponseEffect,
): { chips: EffectChip[]; warnings: string[] } {
  const chips = formatEffect(snap, effect, snap.game.scenarioId, snap.game.year);
  const warnings = chips.filter((c) => c.tone === 'anachronism').map((c) => c.label);
  return { chips, warnings };
}

export function formatAnytimePersonalEffect(effs: AnytimeEventEffect[]): EffectChip[] {
  return effs.flatMap((e): EffectChip[] => {
    switch (e.kind) {
      case 'grantTrait': return [{ label: `+${e.trait}`, tone: 'neutral' }];
      case 'pvHit': return [{ label: `PV ${fmtDelta(e.amount)}`, tone: e.amount > 0 ? 'positive' : 'negative' }];
      case 'pvBump': return [{ label: `PV +${e.amount}`, tone: 'positive' }];
      case 'skillBump': return [{ label: `+${e.amount} ${e.skill}`, tone: 'positive' }];
      case 'commandBump': return [{ label: `+${e.amount} command`, tone: 'positive' }];
      case 'death': return [{ label: 'died', tone: 'negative' }];
      case 'forceRetire': return [{ label: 'retired', tone: 'neutral' }];
    }
  });
}

export function formatAnytimeNationalEffect(effs: AnytimeNationalEffect[]): EffectChip[] {
  return effs.map((e): EffectChip => {
    switch (e.kind) {
      case 'meterTick': {
        const meter = METER_LABELS[e.meter] ?? e.meter;
        return { label: `${meter} ${fmtDelta(e.amount)}`, tone: e.amount > 0 ? 'positive' : 'negative' };
      }
      case 'interestTick':
        return { label: `${e.group} ${fmtDelta(e.amount)}`, tone: e.amount > 0 ? 'positive' : 'negative' };
      case 'partyPref':
        return { label: `Party preference ${fmtDelta(e.amount)}`, tone: 'neutral' };
      case 'stateBias':
        return { label: `State bias ${fmtDelta(e.amount)}`, tone: 'neutral' };
    }
  });
}
