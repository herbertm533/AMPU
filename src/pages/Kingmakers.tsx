import { useGame } from '../state/GameContext';

export function Kingmakers(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const mine = snapshot.politicians.filter((p) => p.factionId === snapshot.game.playerFactionId);
  const kingmakers = mine.filter((p) => p.isKingmaker || p.command >= 4);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Kingmakers & Protégés</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Senior politicians with high Command can mentor a protégé, granting bonus skill gains.
      </p>
      {kingmakers.length === 0 && <p className="text-sm">No kingmakers in your faction yet. Build a politician with Command 4+.</p>}
      <div className="space-y-2">
        {kingmakers.map((k) => {
          const protege = k.protegeId ? snapshot.politicians.find((p) => p.id === k.protegeId) : null;
          return (
            <div key={k.id} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
              <div className="font-semibold">{k.firstName} {k.lastName} <span className="text-xs text-slate-500">(Cmd {k.command})</span></div>
              <div className="text-xs">Protégé: {protege ? `${protege.firstName} ${protege.lastName}` : <span className="text-slate-400">— None —</span>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
