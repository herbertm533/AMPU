import { useGame } from '../state/GameContext';
import { PartyBadge } from '../components/PartyBadge';

export function CourtPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const chief = snapshot.politicians.find((p) => p.id === snapshot.game.chiefJusticeId);
  const justices = snapshot.game.supremeCourtIds.map((id) => snapshot.politicians.find((p) => p.id === id)).filter(Boolean) as NonNullable<typeof chief>[];

  const conservativeJustices = [chief, ...justices].filter((j): j is NonNullable<typeof chief> => !!j && ['Conservative', 'Traditionalist', 'RW Populist'].includes(j.ideology));
  const liberalJustices = [chief, ...justices].filter((j): j is NonNullable<typeof chief> => !!j && ['Liberal', 'Progressive', 'LW Populist'].includes(j.ideology));

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Supreme Court</h2>
      <div className="text-sm text-slate-500">
        Conservative bloc: <span className="font-semibold text-red-600 dark:text-red-400">{conservativeJustices.length}</span> •
        Liberal bloc: <span className="font-semibold text-blue-600 dark:text-blue-400 ml-1">{liberalJustices.length}</span>
      </div>
      {chief && (
        <div className="rounded border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 p-3">
          <div className="text-xs uppercase text-amber-700 dark:text-amber-400">Chief Justice</div>
          <div className="font-bold">{chief.firstName} {chief.lastName} <PartyBadge party={chief.partyId} /></div>
          <div className="text-xs text-slate-500">{chief.ideology} • {chief.state.toUpperCase()} • Age {chief.age} • Jud {chief.skills.judicial}</div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {justices.map((j) => (
          <div key={j.id} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
            <div className="font-semibold">{j.firstName} {j.lastName} <PartyBadge party={j.partyId} /></div>
            <div className="text-xs text-slate-500">{j.ideology} • {j.state.toUpperCase()} • Age {j.age} • Jud {j.skills.judicial}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
