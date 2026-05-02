import type { MeterKey } from '../types';

const LABELS: Record<MeterKey, string> = {
  revenue: 'Revenue / Budget',
  economic: 'Economic Stability',
  military: 'Military Preparedness',
  domestic: 'Domestic Stability',
  honest: 'Honest Government',
  quality: 'Quality of Life',
  planet: 'Planet\'s Health',
};

const SCALES: Record<MeterKey, [string, string, string, string, string, string, string, string, string, string, string]> = {
  revenue: ['Bankruptcy', 'Crisis', 'Heavy Deficit', 'Deficit', 'Tight', 'Balanced', 'Healthy', 'Surplus', 'Strong Surplus', 'Very Strong', 'Treasury Brimming'],
  economic: ['Depression', 'Severe Recession', 'Recession', 'Slowdown', 'Sluggish', 'Stable', 'Growth', 'Expansion', 'Boom', 'Strong Boom', 'Roaring'],
  military: ['Defenseless', 'Vulnerable', 'Unprepared', 'Outdated', 'Adequate', 'Capable', 'Strong', 'Formidable', 'Dominant', 'Hegemon', 'Superpower'],
  domestic: ['Insurrection', 'Civil Disorder', 'Violent Unrest', 'Unrest', 'Minor Unrest', 'Tense', 'Quiet', 'Stable', 'Peaceful', 'Harmonious', 'Civic Pride'],
  honest: ['Kleptocracy', 'Rampant Corruption', 'Corruption', 'Spotty', 'Mixed', 'Average', 'Clean', 'Honest', 'Reform-Minded', 'Squeaky Clean', 'Transparent'],
  quality: ['Awful', 'Suffering', 'Hard Times', 'Below Average', 'Mixed', 'Average', 'Comfortable', 'Good', 'Prosperous', 'Excellent', 'Idyllic'],
  planet: ['Ecological Collapse', 'Severe Damage', 'Polluted', 'Strained', 'Stressed', 'Mixed', 'Recovering', 'Healthy', 'Thriving', 'Pristine', 'Edenic'],
};

export function Meter({ k, value }: { k: MeterKey; value: number }): JSX.Element {
  // value range -5..+5; map to 0..10 index (clamped)
  const idx = Math.max(0, Math.min(10, Math.round(value + 5)));
  const label = SCALES[k][idx];
  // color: red at low, yellow mid, green high
  const pct = ((value + 5) / 10) * 100;
  let color = 'bg-amber-500';
  if (value <= -2) color = 'bg-red-600';
  else if (value <= -0.5) color = 'bg-orange-500';
  else if (value < 1) color = 'bg-amber-500';
  else if (value < 3) color = 'bg-lime-500';
  else color = 'bg-emerald-500';

  return (
    <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">{LABELS[k]}</span>
        <span className="text-xs font-mono">{value.toFixed(1)}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs font-semibold">{label}</div>
    </div>
  );
}
