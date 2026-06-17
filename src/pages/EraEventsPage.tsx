import { useMemo } from 'react';
import { useGame } from '../state/GameContext';
import { ERA_GRAPH_1772 } from '../data/eraEvents1772';
import { EffectChips, PredicateChips, DeciderBadge, RunNextEventButton } from '../components/EventChips';
import type { EraEvent } from '../types';

const NODE_BY_ID = new Map(ERA_GRAPH_1772.map((n) => [n.templateId, n] as const));

export function EraEventsPage(): JSX.Element {
  const { snapshot } = useGame();

  // Feed lookup: who decided each resolved node (player vs AI) + decision text.
  const feedByTemplate = useMemo(() => {
    const m = new Map<string, { aiResolved: boolean; text: string; year: number }>();
    if (!snapshot) return m;
    for (const e of snapshot.events) {
      const meta = (e.meta ?? {}) as { eraEvent?: boolean; templateId?: string; aiResolved?: boolean };
      if (meta.eraEvent && meta.templateId) {
        m.set(meta.templateId, { aiResolved: !!meta.aiResolved, text: e.text, year: e.year });
      }
    }
    return m;
  }, [snapshot]);

  if (!snapshot) return <div />;

  const is1772 = snapshot.game.scenarioId === '1772';
  const inEventsPhase = snapshot.game.phaseId === '2.4.3';
  const newlyFired = new Set(snapshot.game.newlyFiredEventIds ?? []);
  const events = snapshot.game.pendingEraEvents;
  const pending = events.filter((e) => !e.resolved);
  const resolvedSorted = events.filter((e) => e.resolved).slice().sort((a, b) => a.year - b.year);
  const justFired = resolvedSorted.filter((e) => newlyFired.has(e.id));
  const history = resolvedSorted.filter((e) => !newlyFired.has(e.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold flex-1">Era Events</h2>
        {inEventsPhase && <RunNextEventButton phaseId="2.4.3" />}
      </div>

      {!is1772 && (
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-slate-600 dark:text-slate-300">
          The branching era-event graph is authored for the 1772 (Independence) scenario.
        </div>
      )}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Pending Decisions {pending.length > 0 && `(${pending.length})`}
        </h3>
        {pending.length === 0 ? (
          <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-400">
            No decisions are awaiting you.
          </div>
        ) : (
          <div className="rounded border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm space-y-3">
            {pending.map((e) => (
              <PendingRow key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {justFired.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Just fired this phase ({justFired.length})
          </h3>
          <div className="rounded border border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/20 p-2 text-sm">
            {justFired.map((e) => (
              <ResolvedRow
                key={e.id}
                event={e}
                aiResolved={feedByTemplate.get(e.templateId ?? '')?.aiResolved ?? false}
                highlight
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Event Chain — {history.length} resolved
        </h3>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 max-h-[65vh] overflow-y-auto text-sm">
          {history.length === 0 && (
            <div className="px-2 py-3 text-center text-slate-400">No era events have fired yet.</div>
          )}
          {history.map((e) => (
            <ResolvedRow
              key={e.id}
              event={e}
              aiResolved={feedByTemplate.get(e.templateId ?? '')?.aiResolved ?? false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function PendingRow({ event }: { event: EraEvent }): JSX.Element {
  const node = event.templateId ? NODE_BY_ID.get(event.templateId) : undefined;
  return (
    <div className="space-y-2 px-1 py-1">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xs text-slate-500 tabular-nums">[{event.year}]</span>
        <span className="font-semibold">{event.title}</span>
        <DeciderBadge event={event} />
      </div>
      <div className="text-xs text-slate-700 dark:text-slate-300">{event.description}</div>
      {node?.precondition && <PredicateChips predicate={node.precondition} />}
      <div className="space-y-1">
        <div className="text-[10px] uppercase tracking-wide text-slate-500">Options</div>
        {event.responses.map((r) => (
          <div key={r.id} className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-2 space-y-1">
            <div className="text-xs font-semibold">{r.label}</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400">{r.description}</div>
            <EffectChips effect={r.effect} year={event.year} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ResolvedRow({
  event,
  aiResolved,
  highlight = false,
}: {
  event: EraEvent;
  aiResolved: boolean;
  highlight?: boolean;
}): JSX.Element {
  const node = event.templateId ? NODE_BY_ID.get(event.templateId) : undefined;
  const isSpine = node ? node.realEvent !== false : true;
  const isTerminal = !!event.triggersGameEnd;
  const chosen = event.responses.find((r) => r.id === event.chosenResponseId);
  return (
    <div className={`border-b border-slate-200 dark:border-slate-700/50 px-2 py-2 last:border-0 space-y-1.5 ${highlight ? 'bg-amber-100/30 dark:bg-amber-900/10' : ''}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 tabular-nums">[{event.year}]</span>
        <span className="font-semibold">{event.title}</span>
        <span className={`text-[10px] uppercase rounded px-1.5 py-0.5 ${isSpine ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200'}`}>
          {isSpine ? 'Spine' : 'Counterfactual'}
        </span>
        <span className={`text-[10px] uppercase rounded px-1.5 py-0.5 ${aiResolved ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200'}`}>
          {aiResolved ? 'AI decided' : 'You decided'}
        </span>
        {isTerminal && (
          <span className="text-[10px] uppercase rounded px-1.5 py-0.5 bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 font-bold">Ending</span>
        )}
      </div>
      {chosen && (
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <span className="font-medium">Chose:</span> {chosen.label}
        </div>
      )}
      {chosen?.effect && (
        <EffectChips effect={chosen.effect} year={event.year} />
      )}
      {node?.precondition && highlight && (
        <PredicateChips predicate={node.precondition} />
      )}
    </div>
  );
}
