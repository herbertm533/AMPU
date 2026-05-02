import { useGame } from '../state/GameContext';
import { PartyBadge } from '../components/PartyBadge';

export function FactionsPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const factions = [...snapshot.factions].sort((a, b) => a.partyId.localeCompare(b.partyId));

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Factions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {factions.map((f) => {
          const members = snapshot.politicians.filter((p) => p.factionId === f.id && !p.deathYear);
          const totalPV = members.reduce((s, p) => s + p.pvCache, 0);
          const leader = f.leaderId ? snapshot.politicians.find((p) => p.id === f.leaderId) : null;
          const isPlayer = f.id === snapshot.game.playerFactionId;
          return (
            <div key={f.id} className={`rounded border p-3 ${isPlayer ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  {f.name} <PartyBadge party={f.partyId} />
                </div>
                {isPlayer && <span className="text-[10px] uppercase rounded bg-emerald-500 text-white px-1.5">You</span>}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{f.personality} • {members.length} members • Total PV {totalPV}</div>
              <div className="text-xs mt-1">Leader: {leader ? `${leader.firstName} ${leader.lastName}` : <span className="text-slate-400">— None —</span>}</div>
              <div className="text-xs mt-1 text-slate-500">Ideology: {f.ideologyCards.join(', ')}</div>
              <div className="text-xs text-slate-500">Lobbies: {f.lobbyCards.join(', ')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
