import { useGame } from '../state/GameContext';

// Distinct flavor per terminal ending (the three triggersGameEnd nodes).
const ENDING_FLAVOR: Record<string, string> = {
  lost_war: 'The Revolution is crushed. Britain reconquers the colonies and the rebellion is reabsorbed into the Empire. There is no American republic to carry forward.',
  dominion_autonomy: 'You secured autonomy within the British Empire — self-government in all but name, but independence was never proclaimed. The Crown connection endures.',
  confederation_remains: 'The United States persists under the Articles of Confederation — a loose league of sovereign states that never reforged itself into a federal union.',
};

export function GameOverScreen(): JSX.Element {
  const { snapshot, resetGame } = useGame();
  const ended = snapshot?.game.gameEnded;

  const flavor = ended ? (ENDING_FLAVOR[ended.templateId] ?? `The campaign has ended: ${ended.reason}.`) : '';

  const onNewGame = async (): Promise<void> => {
    await resetGame();
    window.location.reload();
  };

  return (
    <div className="flex h-full items-center justify-center bg-slate-900 text-slate-100 p-6">
      <div className="w-full max-w-xl rounded-lg border border-slate-700 bg-slate-800 p-8 text-center shadow-xl">
        <div className="text-xs uppercase tracking-widest text-amber-400">Campaign Over — {ended?.year}</div>
        <h1 className="mt-2 text-3xl font-bold">{ended?.reason ?? 'The End'}</h1>
        <p className="mt-4 text-slate-300 leading-relaxed">{flavor}</p>
        <button
          onClick={onNewGame}
          className="mt-8 rounded bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
