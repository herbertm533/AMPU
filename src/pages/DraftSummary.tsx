import { useGame } from '../state/GameContext';
import { PartyBadge } from '../components/PartyBadge';

export function DraftSummary(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const lastYear = snapshot.game.lastDraftYear;
  const drafted = snapshot.politicians.filter((p) => p.draftedYear != null && (lastYear == null || p.draftedYear === lastYear));
  // Group by faction
  const groups = new Map<string, typeof drafted>();
  for (const p of drafted) {
    if (!p.factionId) continue;
    const arr = groups.get(p.factionId) ?? [];
    arr.push(p);
    groups.set(p.factionId, arr);
  }
  // Sort each group by PV desc
  for (const [, arr] of groups) arr.sort((a, b) => b.pvCache - a.pvCache);
  // Order factions by total PV desc
  const factionOrder = [...groups.entries()].sort((a, b) => {
    const sum = (xs: typeof drafted): number => xs.reduce((s, p) => s + p.pvCache, 0);
    return sum(b[1]) - sum(a[1]);
  });

  if (drafted.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Draft Summary</h2>
        <p className="text-sm text-slate-500">No draft has occurred yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Draft Summary{lastYear ? ` — ${lastYear}` : ''}</h2>
      <p className="text-xs text-slate-500">{drafted.length} politicians drafted across {factionOrder.length} factions, sorted by PV within each faction.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {factionOrder.map(([factionId, members]) => {
          const f = snapshot.factions.find((ff) => ff.id === factionId);
          const isPlayer = factionId === snapshot.game.playerFactionId;
          const totalPV = members.reduce((s, p) => s + p.pvCache, 0);
          const avgPV = members.length > 0 ? Math.round(totalPV / members.length) : 0;
          return (
            <div key={factionId} className={`rounded border p-3 ${isPlayer ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-semibold flex items-center gap-2">
                  <PartyBadge party={f?.partyId ?? null} />
                  {f?.name ?? factionId}
                  {isPlayer && <span className="text-[10px] uppercase rounded bg-emerald-500 text-white px-1.5">You</span>}
                </div>
                <div className="text-xs text-slate-500">{members.length} picks · Total PV {totalPV} · Avg {avgPV}</div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700/50">
                    <th className="text-left py-1">#</th>
                    <th className="text-left py-1">Name</th>
                    <th className="text-left py-1">State</th>
                    <th className="text-left py-1">Ideology</th>
                    <th className="text-right py-1">Age</th>
                    <th className="text-right py-1">PV</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((p, i) => (
                    <tr key={p.id} className="border-b border-slate-200/50 dark:border-slate-700/30 last:border-0">
                      <td className="py-0.5 text-slate-400">{i + 1}</td>
                      <td className="py-0.5 font-semibold">{p.firstName} {p.lastName}</td>
                      <td className="py-0.5">{p.state.toUpperCase()}</td>
                      <td className="py-0.5">{p.ideology}</td>
                      <td className="py-0.5 text-right">{p.age}</td>
                      <td className="py-0.5 text-right font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
