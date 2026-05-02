import { useState } from 'react';
import { useGame } from '../state/GameContext';
import type { Politician } from '../types';

export function DraftModal({ pool }: { pool: Politician[] }): JSX.Element {
  const { snapshot, draftPick } = useGame();
  const [sortKey, setSortKey] = useState<'pv' | 'admin' | 'leg' | 'mil' | 'jud' | 'gov' | 'back' | 'age'>('pv');

  if (!snapshot) return <div />;

  const sorted = [...pool].sort((a, b) => {
    switch (sortKey) {
      case 'pv': return b.pvCache - a.pvCache;
      case 'admin': return b.skills.admin - a.skills.admin;
      case 'leg': return b.skills.legislative - a.skills.legislative;
      case 'mil': return b.skills.military - a.skills.military;
      case 'jud': return b.skills.judicial - a.skills.judicial;
      case 'gov': return b.skills.governing - a.skills.governing;
      case 'back': return b.skills.backroom - a.skills.backroom;
      case 'age': return a.age - b.age;
    }
  });

  const remaining = snapshot.game.draftRoundOrder.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 max-h-[90vh] flex flex-col">
        <div className="border-b border-slate-300 dark:border-slate-700 px-4 py-3">
          <h2 className="text-lg font-bold">Draft — Your Pick</h2>
          <p className="text-xs text-slate-500">Picks remaining: {remaining}. Choose a rookie politician for your faction.</p>
        </div>
        <div className="overflow-auto flex-1 p-2">
          <div className="flex gap-1 mb-2 text-xs">
            <span className="text-slate-500 mr-2">Sort:</span>
            {(['pv', 'admin', 'leg', 'mil', 'jud', 'gov', 'back', 'age'] as const).map((k) => (
              <button key={k} onClick={() => setSortKey(k)} className={`rounded px-2 py-0.5 ${sortKey === k ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{k}</button>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="px-2 py-1.5 text-left">Name</th>
                <th className="px-2 py-1.5 text-left">State</th>
                <th className="px-2 py-1.5 text-left">Ideology</th>
                <th className="px-2 py-1.5 text-right">Age</th>
                <th className="px-2 py-1.5 text-right">PV</th>
                <th className="px-2 py-1.5 text-right">Adm</th>
                <th className="px-2 py-1.5 text-right">Leg</th>
                <th className="px-2 py-1.5 text-right">Jud</th>
                <th className="px-2 py-1.5 text-right">Mil</th>
                <th className="px-2 py-1.5 text-right">Gov</th>
                <th className="px-2 py-1.5 text-right">Bck</th>
                <th className="px-2 py-1.5 text-left">Traits</th>
                <th className="px-2 py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-2 py-1 font-semibold">{p.firstName} {p.lastName}</td>
                  <td className="px-2 py-1">{p.state.toUpperCase()}</td>
                  <td className="px-2 py-1 text-xs">{p.ideology}</td>
                  <td className="px-2 py-1 text-right">{p.age}</td>
                  <td className="px-2 py-1 text-right font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</td>
                  <td className="px-2 py-1 text-right">{p.skills.admin}</td>
                  <td className="px-2 py-1 text-right">{p.skills.legislative}</td>
                  <td className="px-2 py-1 text-right">{p.skills.judicial}</td>
                  <td className="px-2 py-1 text-right">{p.skills.military}</td>
                  <td className="px-2 py-1 text-right">{p.skills.governing}</td>
                  <td className="px-2 py-1 text-right">{p.skills.backroom}</td>
                  <td className="px-2 py-1 text-xs">{p.traits.join(', ')}</td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => draftPick(p.id)}
                      className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 text-xs"
                    >
                      Draft
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
