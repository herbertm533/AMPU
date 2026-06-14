import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import type { Politician } from '../types';

export function Roster(): JSX.Element {
  const { snapshot } = useGame();
  const [showRetired, setShowRetired] = useState(false);
  if (!snapshot) return <div />;
  const { politicians, game } = snapshot;
  const mine = politicians.filter(
    (p) => p.factionId === game.playerFactionId && !p.deathYear && (showRetired || !p.retiredYear),
  );
  const activeCount = mine.filter((p) => !p.retiredYear).length;
  const retiredCount = mine.length - activeCount;

  const columns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className={`font-semibold ${p.retiredYear ? 'text-slate-500 dark:text-slate-400' : ''}`}>{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'State', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'party', label: 'Party', sortValue: (p) => p.partyId ?? '', render: (p) => <PartyBadge party={p.partyId} /> },
    { key: 'ideo', label: 'Ideology', sortValue: (p) => p.ideology },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, className: 'text-right font-mono', render: (p) => <span className={`font-bold ${p.retiredYear ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{p.pvCache}</span> },
    { key: 'cmd', label: 'Cmd', sortValue: (p) => p.command, className: 'text-right' },
    { key: 'admin', label: 'Adm', sortValue: (p) => p.skills.admin, className: 'text-right' },
    { key: 'leg', label: 'Leg', sortValue: (p) => p.skills.legislative, className: 'text-right' },
    { key: 'jud', label: 'Jud', sortValue: (p) => p.skills.judicial, className: 'text-right' },
    { key: 'mil', label: 'Mil', sortValue: (p) => p.skills.military, className: 'text-right' },
    { key: 'gov', label: 'Gov', sortValue: (p) => p.skills.governing, className: 'text-right' },
    { key: 'back', label: 'Back', sortValue: (p) => p.skills.backroom, className: 'text-right' },
    {
      key: 'office',
      label: 'Office',
      sortValue: (p) => p.retiredYear ? 'zzy' : (p.currentOffice?.type ?? 'zzz'),
      render: (p) => {
        if (p.retiredYear) {
          return <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">Retired {p.retiredYear}</span>;
        }
        return p.currentOffice ? <span className="text-xs">{officeName(p)}</span> : <span className="text-xs text-slate-400">{p.careerTrack ?? 'Free'}</span>;
      },
    },
    { key: 'traits', label: 'Traits', sortValue: (p) => p.traits.join(','), render: (p) => <span className="text-xs">{p.traits.slice(0, 2).join(', ')}</span> },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold">
          Roster — {mine.length} Politicians
          {showRetired && retiredCount > 0 && (
            <span className="text-xs font-normal text-slate-500 ml-2">({activeCount} active, {retiredCount} retired)</span>
          )}
        </h2>
        <label className="text-xs text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="rounded"
            checked={showRetired}
            onChange={(e) => setShowRetired(e.target.checked)}
          />
          Show retired
        </label>
      </div>
      <SortableTable rows={mine} columns={columns} rowKey={(p) => p.id} initialSort={{ key: 'pv', dir: 'desc' }} />
    </div>
  );
}

function officeName(p: Politician): string {
  const o = p.currentOffice;
  if (!o) return '';
  if (o.type === 'Senator' || o.type === 'Representative' || o.type === 'Governor') {
    return `${o.type} (${(o.stateId ?? p.state).toUpperCase()})`;
  }
  return o.type;
}
