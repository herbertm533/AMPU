import { useState } from 'react';
import { useGame } from '../state/GameContext';
import type { EventEntry } from '../types';

const CATEGORIES: EventEntry['category'][] = ['system', 'event', 'election', 'legislation', 'appointment', 'death', 'retire', 'meter', 'draft', 'war', 'court', 'roll'];

export function EventLog(): JSX.Element {
  const { snapshot } = useGame();
  const [filter, setFilter] = useState<EventEntry['category'] | 'all'>('all');
  if (!snapshot) return <div />;
  const sorted = [...snapshot.events].sort((a, b) => b.year - a.year || -1);
  const filtered = filter === 'all' ? sorted : sorted.filter((e) => e.category === filter);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Event Log — {sorted.length}</h2>
      <div className="flex gap-1 flex-wrap">
        <button onClick={() => setFilter('all')} className={`text-xs rounded px-2 py-1 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`text-xs rounded px-2 py-1 capitalize ${filter === c ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{c}</button>
        ))}
      </div>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 max-h-[70vh] overflow-y-auto text-sm">
        {filtered.slice(0, 1000).map((e) => (
          <div key={e.id} className="border-b border-slate-200 dark:border-slate-700/50 px-2 py-1 last:border-0">
            <span className="text-xs text-slate-500 mr-2">[{e.year}]</span>
            <span className="text-xs uppercase text-slate-400 mr-2">{e.category}</span>
            {e.text}
          </div>
        ))}
        {filtered.length === 0 && <div className="px-2 py-3 text-center text-slate-400">No events.</div>}
      </div>
    </div>
  );
}
