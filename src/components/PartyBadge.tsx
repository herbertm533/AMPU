import type { PartyId } from '../types';

export function PartyBadge({ party }: { party: PartyId | null }): JSX.Element {
  if (!party) return <span className="text-slate-400">—</span>;
  const cls = party === 'BLUE'
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return <span className={`inline-block rounded px-1.5 text-[10px] font-bold uppercase ${cls}`}>{party === 'BLUE' ? 'D' : 'R'}</span>;
}
