import { useGame } from '../state/GameContext';
import { PartyBadge } from '../components/PartyBadge';

export function ContinentalCongressPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const cc = snapshot.game.continentalCongress;
  if (!cc || cc.delegates.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Continental Congress</h2>
        <p className="text-sm text-slate-500">No delegates appointed yet. The First Continental Congress will assemble after the Intolerable Acts.</p>
      </div>
    );
  }
  const president = cc.presidentId ? snapshot.politicians.find((p) => p.id === cc.presidentId) : null;
  // Group delegates by state
  const byState = new Map<string, typeof cc.delegates>();
  for (const d of cc.delegates) {
    const arr = byState.get(d.stateId) ?? [];
    arr.push(d);
    byState.set(d.stateId, arr);
  }
  // Faction tally
  const factionCounts = new Map<string, number>();
  for (const d of cc.delegates) factionCounts.set(d.factionId, (factionCounts.get(d.factionId) ?? 0) + 1);
  const factionTally = [...factionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => ({ faction: snapshot.factions.find((f) => f.id === id), count: n }));

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold">{snapshot.game.articlesOfConfederation ? 'Confederation Congress' : 'Continental Congress'}</h2>
        <span className="text-xs text-slate-500">{cc.delegates.length} delegates from {byState.size} states</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 p-3">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">President of Congress</div>
          {president ? (
            <div>
              <div className="font-bold text-lg">{president.firstName} {president.lastName} <PartyBadge party={president.partyId} /></div>
              <div className="text-xs text-slate-500">{president.ideology} • {president.state.toUpperCase()} • PV {president.pvCache}</div>
            </div>
          ) : <div className="text-slate-400">Vacant</div>}
        </div>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Committee Chairs</div>
          {(['domestic', 'foreignMilitary', 'economic', 'judicial'] as const).map((c) => {
            const id = cc.committeeChairs[c];
            const p = id ? snapshot.politicians.find((pp) => pp.id === id) : null;
            return (
              <div key={c} className="text-xs flex justify-between border-b border-slate-200 dark:border-slate-700/50 py-0.5">
                <span className="text-slate-500 capitalize">{c.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-semibold">{p ? `${p.firstName} ${p.lastName}` : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Faction Strength in Congress</h3>
        <div className="space-y-1">
          {factionTally.map(({ faction, count }) => {
            const pct = (count / cc.delegates.length) * 100;
            return (
              <div key={faction?.id} className="flex items-center gap-2 text-xs">
                <PartyBadge party={faction?.partyId ?? null} />
                <span className="font-semibold w-48 truncate">{faction?.name}</span>
                <div className="flex-1 h-2 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full ${faction?.partyId === 'BLUE' ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono w-10 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr>
              <th className="px-2 py-1.5 text-left">State</th>
              <th className="px-2 py-1.5 text-left">Slots</th>
              <th className="px-2 py-1.5 text-left">Delegates</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.states.map((s) => {
              const dels = byState.get(s.id) ?? [];
              return (
                <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700/50">
                  <td className="px-2 py-1.5 font-semibold">{s.name} <span className="text-xs text-slate-500">({s.abbr})</span></td>
                  <td className="px-2 py-1.5 text-xs">{s.ccDelegateSlots ?? 0} ({s.colonySize})</td>
                  <td className="px-2 py-1.5 text-xs">
                    {dels.map((d, i) => {
                      const p = snapshot.politicians.find((pp) => pp.id === d.politicianId);
                      const f = snapshot.factions.find((ff) => ff.id === d.factionId);
                      return (
                        <span key={i} className="inline-block mr-2">
                          <PartyBadge party={f?.partyId ?? null} /> {p ? `${p.firstName} ${p.lastName}` : '—'}
                        </span>
                      );
                    })}
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
