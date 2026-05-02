import { useGame } from '../state/GameContext';
import { Meter } from '../components/Meter';
import type { MeterKey } from '../types';

const METER_KEYS: MeterKey[] = ['revenue', 'economic', 'military', 'domestic', 'honest', 'quality', 'planet'];

export function MetersPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">National Meters</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Each meter is on a -5 to +5 scale, updated each turn during the Lingering Phase based on cabinet competence and events.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {METER_KEYS.map((k) => <Meter key={k} k={k} value={snapshot.game.meters[k]} />)}
      </div>
      <div className="mt-4 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
        <div>National Debt: <span className="font-mono">${(snapshot.game.nationalDebt / 1_000_000).toFixed(1)}M</span></div>
      </div>
    </div>
  );
}
