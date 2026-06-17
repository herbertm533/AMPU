import { useGame } from '../state/GameContext';
import type { EraEvent, EraEventResponseEffect, Predicate } from '../types';
import {
  formatDecider,
  formatEffect,
  formatPredicate,
  type EffectChip,
  type PredicateChip,
} from '../engine/labels';
import { nodeForEvent } from '../engine/eraGraph';

// ============================================================================
// Shared event-chip components. Thin render wrappers over the pure label
// module; no business logic. Used by EraEventModal, EraEventsPage,
// AnytimeEventsPage.
// ============================================================================

function effectToneClass(tone: EffectChip['tone']): string {
  switch (tone) {
    case 'positive': return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200';
    case 'negative': return 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200';
    case 'war':      return 'bg-red-200 text-red-900 dark:bg-red-900/60 dark:text-red-100 font-bold';
    case 'anachronism': return 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 italic';
    case 'pass':     return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200';
    case 'fail':     return 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200';
    case 'muted':    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 italic';
    case 'neutral':
    default:         return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
  }
}

export function EffectChips({
  effect,
  scenarioId,
  year,
}: {
  effect: EraEventResponseEffect;
  scenarioId?: string;
  year?: number;
}): JSX.Element | null {
  const { snapshot } = useGame();
  if (!snapshot) return null;
  const sid = scenarioId ?? snapshot.game.scenarioId;
  const yr = year ?? snapshot.game.year;
  const chips = formatEffect(snapshot, effect, sid, yr);
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c, i) => (
        <span key={i} className={`text-[11px] rounded px-1.5 py-0.5 ${effectToneClass(c.tone)}`}>
          {c.tone === 'anachronism' && <span className="mr-0.5">⚠</span>}
          {c.label}
        </span>
      ))}
    </div>
  );
}

function predicateChipClass(chip: PredicateChip): string {
  if (chip.tone === 'pass') return 'border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200';
  if (chip.tone === 'fail') return 'border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200';
  return 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 italic';
}

function PredicateChipNode({ chip }: { chip: PredicateChip }): JSX.Element {
  if (chip.group) {
    return (
      <div className={`rounded px-1.5 py-1 ${predicateChipClass(chip)}`}>
        <div className="text-[10px] uppercase tracking-wide opacity-70">{chip.label}</div>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {chip.group.map((c, i) => (
            <PredicateChipNode key={i} chip={c} />
          ))}
        </div>
      </div>
    );
  }
  const icon = chip.tone === 'pass' ? '✓' : chip.tone === 'fail' ? '✗' : '·';
  return (
    <span
      className={`text-[11px] rounded px-1.5 py-0.5 ${predicateChipClass(chip)} ${chip.strike ? 'line-through' : ''}`}
    >
      <span className="mr-1 opacity-70">{icon}</span>
      {chip.label}
    </span>
  );
}

export function PredicateChips({ predicate }: { predicate: Predicate | undefined }): JSX.Element | null {
  const { snapshot } = useGame();
  if (!snapshot || !predicate) return null;
  const chips = formatPredicate(snapshot, predicate);
  if (chips.length === 0) return null;
  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">Why this fired</div>
      <div className="flex flex-wrap gap-1">
        {chips.map((c, i) => (
          <PredicateChipNode key={i} chip={c} />
        ))}
      </div>
    </div>
  );
}

export function DeciderBadge({ event }: { event: EraEvent }): JSX.Element | null {
  const { snapshot } = useGame();
  if (!snapshot) return null;
  const label = formatDecider(event.decider, snapshot.game.scenarioId, event.year);
  return (
    <span className="text-xs text-slate-500">
      Decided by: <span className="font-semibold">{label}</span>
    </span>
  );
}

export function RunNextEventButton({
  phaseId,
  label = 'Run next event',
}: {
  phaseId: '2.4.2' | '2.4.3';
  label?: string;
}): JSX.Element {
  const { snapshot, runEventsNow } = useGame();
  const disabled = !snapshot || !!snapshot.game.gameEnded || snapshot.game.phaseId !== phaseId;
  const tooltip = disabled
    ? snapshot?.game.gameEnded
      ? 'The campaign has ended.'
      : `Open phase ${phaseId} first.`
    : phaseId === '2.4.2'
      ? 'Roll for one national event + each politician’s personal events.'
      : 'Surface the next era-graph node (AI cascades resolve inline).';
  return (
    <button
      onClick={() => void runEventsNow()}
      disabled={disabled}
      title={tooltip}
      className="rounded bg-amber-600 hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-1.5 text-sm font-semibold"
    >
      ▶ {label}
    </button>
  );
}

export function nodePreconditionFor(event: EraEvent): Predicate | undefined {
  return nodeForEvent(event)?.precondition;
}
