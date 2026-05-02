import { useGame } from '../state/GameContext';
import { PartyBadge } from '../components/PartyBadge';

export function FactionLeaderPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const faction = snapshot.factions.find((f) => f.id === snapshot.game.playerFactionId);
  const leader = faction?.leaderId ? snapshot.politicians.find((p) => p.id === faction.leaderId) : null;
  const members = snapshot.politicians.filter((p) => p.factionId === faction?.id && !p.deathYear);
  const total = members.reduce((s, p) => s + p.pvCache, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{faction?.name}</h2>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">Leader</h3>
        {leader ? (
          <div>
            <div className="font-semibold text-lg">{leader.firstName} {leader.lastName} <PartyBadge party={leader.partyId} /></div>
            <div className="text-xs text-slate-500">{leader.ideology} • {leader.state.toUpperCase()} • PV {leader.pvCache} • Cmd {leader.command}</div>
          </div>
        ) : (
          <div className="text-slate-400">No leader yet — leadership election in next cycle.</div>
        )}
      </div>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">Faction Stats</h3>
        <div className="text-sm space-y-1">
          <div>Personality: <span className="font-semibold">{faction?.personality}</span></div>
          <div>Members: <span className="font-semibold">{members.length}</span></div>
          <div>Total PV: <span className="font-semibold">{total}</span></div>
          <div>Ideology Cards: {faction?.ideologyCards.join(', ')}</div>
          <div>Lobby Cards: {faction?.lobbyCards.join(', ')}</div>
          <div>Interest Cards: {faction?.interestCards.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}
