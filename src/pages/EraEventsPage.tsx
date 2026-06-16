import { useMemo } from 'react';
import { useGame } from '../state/GameContext';
import { ERA_GRAPH_1772 } from '../data/eraEvents1772';

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
  const events = snapshot.game.pendingEraEvents;
  const resolved = events.filter((e) => e.resolved).slice().sort((a, b) => a.year - b.year);
  const pending = events.filter((e) => !e.resolved);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Era Events</h2>

      {!is1772 && (
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-slate-600 dark:text-slate-300">
          The branching era-event graph is authored for the 1772 (Independence) scenario.
        </div>
      )}

      {/* Pending decisions */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pending Decisions</h3>
        {pending.length === 0 ? (
          <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-400">No decisions are awaiting you.</div>
        ) : (
          <div className="rounded border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-2 text-sm space-y-2">
            {pending.map((e) => (
              <div key={e.id} className="px-2 py-1">
                <div className="font-semibold">[{e.year}] {e.title}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300">{e.description}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Event-chain history */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Event Chain — {resolved.length} resolved</h3>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 max-h-[65vh] overflow-y-auto text-sm">
          {resolved.length === 0 && (
            <div className="px-2 py-3 text-center text-slate-400">No era events have fired yet.</div>
          )}
          {resolved.map((e) => {
            const node = e.templateId ? NODE_BY_ID.get(e.templateId) : undefined;
            const isSpine = node ? node.realEvent !== false : true;
            const isTerminal = !!e.triggersGameEnd;
            const chosen = e.responses.find((r) => r.id === e.chosenResponseId);
            const feed = e.templateId ? feedByTemplate.get(e.templateId) : undefined;
            const aiResolved = feed?.aiResolved ?? false;
            return (
              <div key={e.id} className="border-b border-slate-200 dark:border-slate-700/50 px-2 py-2 last:border-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500 tabular-nums">[{e.year}]</span>
                  <span className="font-semibold">{e.title}</span>
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
                  <div className="text-xs text-slate-700 dark:text-slate-300"><span className="font-medium">Chose:</span> {chosen.label}</div>
                )}
                <div className="text-xs text-slate-500 dark:text-slate-400">{chosen?.effect.text ?? e.description}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
