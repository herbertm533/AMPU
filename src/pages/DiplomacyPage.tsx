import { useGame } from '../state/GameContext';

export function DiplomacyPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const entries = Object.entries(snapshot.game.diplomacy).filter(([k]) => !k.startsWith('__'));
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Diplomacy</h2>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr><th className="px-2 py-1.5 text-left">Country</th><th className="px-2 py-1.5 text-right">Relations</th><th className="px-2 py-1.5 text-left">Status</th></tr>
          </thead>
          <tbody>
            {entries.map(([k, v]) => {
              const status = v >= 3 ? 'Allied' : v >= 1 ? 'Friendly' : v >= -1 ? 'Neutral' : v >= -3 ? 'Tense' : 'Hostile';
              return (
                <tr key={k} className="border-b border-slate-200 dark:border-slate-700/50">
                  <td className="px-2 py-1 font-semibold">{k}</td>
                  <td className="px-2 py-1 text-right font-mono">{v.toFixed(1)}</td>
                  <td className="px-2 py-1">{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
