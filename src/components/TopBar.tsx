import { useGame } from '../state/GameContext';
import { getPhaseInfo, nextPhaseInfo } from '../phases';

export function TopBar(): JSX.Element {
  const { snapshot, advance, toggleTheme, theme } = useGame();
  if (!snapshot) return <div />;
  const cur = getPhaseInfo(snapshot.game.phaseId);
  const next = nextPhaseInfo(snapshot.game.phaseId, snapshot.game.year, snapshot.game);
  const nextInfo = getPhaseInfo(next.phaseId);
  const playerFaction = snapshot.factions.find((f) => f.id === snapshot.game.playerFactionId);
  const turnYears = `${snapshot.game.year - 1}-${snapshot.game.year + 1}`;

  // Party preference visual: -5 (Blue) to +5 (Red)
  const pp = snapshot.game.partyPreference;
  const ppLeftPct = ((pp + 5) / 10) * 100;

  return (
    <header className="flex items-center gap-4 border-b border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2">
      <div className="flex flex-col">
        <h1 className="font-bold text-lg leading-tight">AMPU</h1>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">American Political Universe</span>
      </div>
      <button
        onClick={advance}
        className="btn-advance ml-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold shadow"
      >
        ▶ Advance to {nextInfo?.label ?? 'next phase'}
      </button>
      <div className="flex flex-col text-sm">
        <span className="font-semibold">{turnYears}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{cur?.category} — {cur?.label}</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="text-xs">
          <div className="text-slate-500 dark:text-slate-400">Faction</div>
          <div className="font-semibold">
            <span className={playerFaction?.partyId === 'BLUE' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
              {playerFaction?.name ?? '—'}
            </span>
          </div>
        </div>
        <div className="text-xs flex flex-col items-end">
          <div className="text-slate-500 dark:text-slate-400">Party Preference</div>
          <div className="relative h-2 w-32 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-500/40" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-red-500/40" />
            <div className="absolute top-0 h-full w-1 bg-slate-900 dark:bg-slate-100" style={{ left: `calc(${ppLeftPct}% - 2px)` }} />
          </div>
          <div className="text-[10px] mt-0.5">
            <span className="text-blue-500">Blue</span>
            <span className="mx-1 text-slate-500">{pp.toFixed(2)}</span>
            <span className="text-red-500">Red</span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
