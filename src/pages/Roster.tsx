import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import type { Politician } from '../types';

export function Roster(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const { politicians, game } = snapshot;
  const mine = politicians.filter((p) => p.factionId === game.playerFactionId && !p.deathYear);

  const columns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'State', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'party', label: 'Party', sortValue: (p) => p.partyId ?? '', render: (p) => <PartyBadge party={p.partyId} /> },
    { key: 'ideo', label: 'Ideology', sortValue: (p) => p.ideology },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, className: 'text-right font-mono', render: (p) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</span> },
    { key: 'cmd', label: 'Cmd', sortValue: (p) => p.command, className: 'text-right' },
    { key: 'admin', label: 'Adm', sortValue: (p) => p.skills.admin, className: 'text-right' },
    { key: 'leg', label: 'Leg', sortValue: (p) => p.skills.legislative, className: 'text-right' },
    { key: 'jud', label: 'Jud', sortValue: (p) => p.skills.judicial, className: 'text-right' },
    { key: 'mil', label: 'Mil', sortValue: (p) => p.skills.military, className: 'text-right' },
    { key: 'gov', label: 'Gov', sortValue: (p) => p.skills.governing, className: 'text-right' },
    { key: 'back', label: 'Back', sortValue: (p) => p.skills.backroom, className: 'text-right' },
    { key: 'office', label: 'Office', sortValue: (p) => p.currentOffice?.type ?? 'zzz', render: (p) => p.currentOffice ? <span className="text-xs">{officeName(p)}</span> : <span className="text-xs text-slate-400">{p.careerTrack ?? 'Free'}</span> },
    { key: 'traits', label: 'Traits', sortValue: (p) => p.traits.join(','), render: (p) => <span className="text-xs">{p.traits.slice(0, 2).join(', ')}</span> },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Roster — {mine.length} Politicians</h2>
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
