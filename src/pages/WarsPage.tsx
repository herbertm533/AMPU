import { useGame } from '../state/GameContext';

export function WarsPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  if (snapshot.wars.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">War Dashboard</h2>
        <p className="text-sm text-slate-500">No active or historical wars to display.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">War Dashboard</h2>
      {snapshot.wars.map((w) => (
        <div key={w.id} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">{w.name}</span>
            <span className="text-xs text-slate-500">{w.startYear}{w.endYear ? `–${w.endYear}` : '–present'}</span>
          </div>
          <div className="text-xs">Enemy: {w.enemy} • War Score: <span className="font-mono">{w.warScore}</span></div>
          <div className="text-xs">Generals: {w.generals.map((id) => {
            const g = snapshot.politicians.find((p) => p.id === id);
            return g ? `${g.firstName} ${g.lastName}` : '—';
          }).join(', ') || '—'}</div>
          <div className="text-xs mt-1 font-semibold">Battles ({w.battles.length}):</div>
          <div className="ml-4 text-xs">
            {w.battles.map((b, i) => (
              <div key={i}>[{b.year}] {b.text}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
