import { useGame } from '../state/GameContext';

export function ElectionsPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const sorted = [...snapshot.elections].sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Elections — {sorted.length} Total</h2>
      <div className="space-y-2">
        {sorted.map((e) => {
          const winner = snapshot.politicians.find((p) => p.id === e.winnerId);
          const stateName = e.stateId ? snapshot.states.find((s) => s.id === e.stateId)?.name : null;
          return (
            <div key={e.id} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-slate-500">[{e.year}]</span>
                <span className="font-semibold uppercase text-xs">{e.type}{stateName ? ` — ${stateName}` : ''}</span>
                <span className="ml-auto text-xs text-slate-500">Winner: {winner ? `${winner.firstName} ${winner.lastName}` : '—'}</span>
              </div>
              <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                {e.candidates.map((c) => {
                  const p = snapshot.politicians.find((pp) => pp.id === c.politicianId);
                  return (
                    <div key={c.politicianId} className="text-xs flex items-center gap-2">
                      <span className={c.partyId === 'BLUE' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
                        {p ? `${p.firstName} ${p.lastName}` : '—'} ({c.partyId === 'BLUE' ? 'D' : 'R'})
                      </span>
                      <span className="font-mono">{c.pct.toFixed(1)}%</span>
                      <span className="text-slate-500">({c.votes.toLocaleString()} votes)</span>
                    </div>
                  );
                })}
              </div>
              {e.electoralVotes && (
                <div className="text-xs mt-1">
                  Electoral Votes: {e.electoralVotes.map((ev) => {
                    const p = snapshot.politicians.find((pp) => pp.id === ev.politicianId);
                    return `${p?.lastName}: ${ev.ev}`;
                  }).join(' / ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
