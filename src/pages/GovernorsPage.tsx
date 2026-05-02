import { useGame } from '../state/GameContext';
import { PartyBadge } from '../components/PartyBadge';

export function GovernorsPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Governors</h2>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr><th className="px-2 py-1.5 text-left">State</th><th className="px-2 py-1.5 text-left">Region</th><th className="px-2 py-1.5 text-left">Governor</th><th className="px-2 py-1.5 text-left">Party</th><th className="px-2 py-1.5 text-left">Ideology</th><th className="px-2 py-1.5 text-left">Gov Skill</th></tr>
          </thead>
          <tbody>
            {snapshot.states.map((s) => {
              const g = s.governorId ? snapshot.politicians.find((p) => p.id === s.governorId) : null;
              return (
                <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700/50">
                  <td className="px-2 py-1 font-semibold">{s.name}</td>
                  <td className="px-2 py-1 text-xs text-slate-500">{s.region}</td>
                  <td className="px-2 py-1">{g ? `${g.firstName} ${g.lastName}` : <span className="text-slate-400">Vacant</span>}</td>
                  <td className="px-2 py-1"><PartyBadge party={g?.partyId ?? null} /></td>
                  <td className="px-2 py-1 text-xs">{g?.ideology}</td>
                  <td className="px-2 py-1 text-xs">{g?.skills.governing}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
