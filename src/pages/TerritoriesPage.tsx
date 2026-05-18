import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { EXPANSION_STATES } from '../data/expansionStates';

export function TerritoriesPage(): JSX.Element {
  const { snapshot, admitTerritory } = useGame();
  const [filter, setFilter] = useState('');
  if (!snapshot) return <div />;

  const inUnion = new Set(snapshot.states.map((s) => s.id));
  const admittedExpansion = EXPANSION_STATES.filter((s) => inUnion.has(s.id));
  const available = EXPANSION_STATES.filter(
    (s) => !inUnion.has(s.id) && (filter === '' || s.name.toLowerCase().includes(filter.toLowerCase()) || s.region.toLowerCase().includes(filter.toLowerCase()))
  );

  // count pending draftees per territory so the player knows what unlocks
  const pendingByState = new Map<string, number>();
  for (const d of snapshot.game.customDraftClasses ?? []) {
    pendingByState.set(d.state, (pendingByState.get(d.state) ?? 0) + 1);
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-xl font-bold">Territories</h2>
      <p className="text-sm text-slate-500">
        Annexable territories. Admitting one adds it to the Union as a full state — it
        joins governor and congressional elections, the electoral map, and the draft.
        Drafted politicians whose home state is a territory only enter the game once
        that territory has been admitted.
      </p>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
          In the Union — {snapshot.states.length} states ({admittedExpansion.length} annexed territories)
        </h3>
        {admittedExpansion.length === 0 ? (
          <div className="text-sm text-slate-400">No territories annexed yet.</div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {admittedExpansion.map((s) => (
              <span key={s.id} className="text-xs rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5">
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wide text-slate-500">Available to Admit — {available.length}</h3>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name or region…"
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs w-56"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {available.map((s) => {
            const pending = pendingByState.get(s.id) ?? 0;
            return (
              <div key={s.id} className="flex items-center justify-between rounded border border-slate-200 dark:border-slate-700/60 px-2 py-1.5">
                <div>
                  <div className="text-sm font-semibold">{s.name} <span className="text-xs text-slate-400">({s.abbr})</span></div>
                  <div className="text-[11px] text-slate-500">
                    {s.region}{pending > 0 ? ` • ${pending} draftee(s) waiting` : ''}
                  </div>
                </div>
                <button
                  onClick={() => admitTerritory(s.id)}
                  className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 text-xs font-semibold"
                >
                  Admit
                </button>
              </div>
            );
          })}
          {available.length === 0 && (
            <div className="text-sm text-slate-400 col-span-full">No matching territories.</div>
          )}
        </div>
      </div>
    </div>
  );
}
