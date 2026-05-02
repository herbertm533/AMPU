import { useGame } from '../state/GameContext';

export function InterestGroupsPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const entries = Object.entries(snapshot.game.interestGroups).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Interest Groups</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Scores reflect how favorably each group views recent legislative and executive activity.</p>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr><th className="px-2 py-1.5 text-left">Group</th><th className="px-2 py-1.5 text-right">Score</th><th className="px-2 py-1.5 text-left">Bar</th></tr>
          </thead>
          <tbody>
            {entries.map(([k, v]) => {
              const pct = ((v + 10) / 20) * 100;
              return (
                <tr key={k} className="border-b border-slate-200 dark:border-slate-700/50">
                  <td className="px-2 py-1 font-semibold">{k}</td>
                  <td className="px-2 py-1 text-right font-mono">{v.toFixed(1)}</td>
                  <td className="px-2 py-1 w-1/2">
                    <div className="h-1.5 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                      <div className={`h-full ${v >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
