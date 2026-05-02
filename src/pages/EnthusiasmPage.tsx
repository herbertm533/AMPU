import { useGame } from '../state/GameContext';
import { IDEOLOGY_ORDER } from '../types';

export function EnthusiasmPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Ideology & Enthusiasm</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">How motivated each ideology slot is toward each party (-5 to +5).</p>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr><th className="px-2 py-1.5 text-left">Ideology</th><th className="px-2 py-1.5 text-right text-blue-600 dark:text-blue-400">Toward Blue</th><th className="px-2 py-1.5 text-right text-red-600 dark:text-red-400">Toward Red</th></tr>
          </thead>
          <tbody>
            {IDEOLOGY_ORDER.map((ideo) => {
              const e = snapshot.game.enthusiasm[ideo];
              return (
                <tr key={ideo} className="border-b border-slate-200 dark:border-slate-700/50">
                  <td className="px-2 py-1 font-semibold">{ideo}</td>
                  <td className="px-2 py-1 text-right font-mono">
                    <span className={e?.BLUE > 0 ? 'text-emerald-600 dark:text-emerald-400' : e?.BLUE < 0 ? 'text-rose-600 dark:text-rose-400' : ''}>{e?.BLUE.toFixed(1)}</span>
                  </td>
                  <td className="px-2 py-1 text-right font-mono">
                    <span className={e?.RED > 0 ? 'text-emerald-600 dark:text-emerald-400' : e?.RED < 0 ? 'text-rose-600 dark:text-rose-400' : ''}>{e?.RED.toFixed(1)}</span>
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
