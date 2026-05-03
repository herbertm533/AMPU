import { useGame } from '../state/GameContext';

export function RevWarDashboard(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const war = snapshot.game.revolutionaryWar;
  if (!war || (!war.active && war.battleLog.length === 0)) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Revolutionary War</h2>
        <p className="text-sm text-slate-500">No war is active. The Revolutionary War begins after Lexington & Concord (if Aid Massachusetts is chosen).</p>
      </div>
    );
  }
  const general = war.seniorGeneralId ? snapshot.politicians.find((p) => p.id === war.seniorGeneralId) : null;
  const admiral = war.seniorAdmiralId ? snapshot.politicians.find((p) => p.id === war.seniorAdmiralId) : null;
  const groundProgressPct = (war.currentGroundWins / war.groundWinsNeeded) * 100;
  const lossesPct = (war.currentGroundLosses / war.groundLossesRemaining) * 100;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Revolutionary War {war.active ? <span className="text-xs text-rose-600 ml-2">ACTIVE</span> : <span className="text-xs text-emerald-700 ml-2">{war.outcome === 'win' ? 'WON' : 'LOST'}</span>}</h2>

      {war.frenchAlliance && <div className="text-xs text-blue-700 dark:text-blue-300 font-semibold">⚜ Allied with France — defeat is no longer possible.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <div className="text-xs uppercase text-slate-500">Ground Wins</div>
          <div className="text-lg font-bold">{war.currentGroundWins} / {war.groundWinsNeeded}</div>
          <div className="mt-1 h-2 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, groundProgressPct)}%` }} />
          </div>
        </div>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <div className="text-xs uppercase text-slate-500">Ground Losses</div>
          <div className="text-lg font-bold">{war.currentGroundLosses} / {war.groundLossesRemaining}</div>
          <div className="mt-1 h-2 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, lossesPct)}%` }} />
          </div>
        </div>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <div className="text-xs uppercase text-slate-500">Naval Record</div>
          <div className="text-sm">Wins: <span className="font-semibold text-emerald-700">{war.navalWins}</span> · Losses: <span className="font-semibold text-rose-700">{war.navalLosses}</span></div>
        </div>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <div className="text-xs uppercase text-slate-500">Commanders</div>
          <div className="text-sm">Senior General: <span className="font-semibold">{general ? `${general.firstName} ${general.lastName}` : '—'}</span> {general && <span className="text-xs text-slate-500">(Mil {general.skills.military})</span>}</div>
          <div className="text-sm">Senior Admiral: <span className="font-semibold">{admiral ? `${admiral.firstName} ${admiral.lastName}` : '—'}</span> {admiral && <span className="text-xs text-slate-500">(Mil {admiral.skills.military})</span>}</div>
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr><th className="px-2 py-1.5 text-left">Year</th><th className="px-2 py-1.5 text-left">Type</th><th className="px-2 py-1.5 text-left">Difficulty</th><th className="px-2 py-1.5 text-left">Outcome</th><th className="px-2 py-1.5 text-left">Battle</th></tr>
          </thead>
          <tbody>
            {[...war.battleLog].reverse().slice(0, 50).map((b, i) => (
              <tr key={i} className="border-b border-slate-200 dark:border-slate-700/50">
                <td className="px-2 py-1 text-xs">{b.year}</td>
                <td className="px-2 py-1 text-xs">{b.type}</td>
                <td className="px-2 py-1 text-xs">{b.difficulty ?? '—'}</td>
                <td className={`px-2 py-1 text-xs font-bold ${b.outcome === 'win' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>{b.outcome.toUpperCase()}</td>
                <td className="px-2 py-1 text-xs">{b.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
