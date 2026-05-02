import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import type { State } from '../types';

export function StatesPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;

  const columns: Column<State>[] = [
    { key: 'name', label: 'State', sortValue: (s) => s.name, render: (s) => <span className="font-semibold">{s.name}</span> },
    { key: 'abbr', label: 'Abbr', sortValue: (s) => s.abbr },
    { key: 'region', label: 'Region', sortValue: (s) => s.region },
    { key: 'ev', label: 'EV', sortValue: (s) => s.electoralVotes, className: 'text-right' },
    { key: 'bias', label: 'Bias', sortValue: (s) => s.bias, className: 'text-right', render: (s) => (
      <span className={s.bias > 0 ? 'text-red-600 dark:text-red-400' : s.bias < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
        {s.bias > 0 ? `+${s.bias.toFixed(1)}R` : s.bias < 0 ? `${(-s.bias).toFixed(1)}D` : 'Neutral'}
      </span>
    ) },
    { key: 'slave', label: 'Slave?', sortValue: (s) => (s.isSlaveState ? 1 : 0), render: (s) => s.isSlaveState ? <span className="text-amber-600">Yes</span> : 'No' },
    { key: 'gov', label: 'Governor', sortValue: (s) => {
      const g = s.governorId ? snapshot.politicians.find((p) => p.id === s.governorId) : null;
      return g ? `${g.lastName}` : 'zzz';
    }, render: (s) => {
      const g = s.governorId ? snapshot.politicians.find((p) => p.id === s.governorId) : null;
      return g ? <span>{g.firstName} {g.lastName} <PartyBadge party={g.partyId} /></span> : <span className="text-slate-400">Vacant</span>;
    } },
    { key: 'industries', label: 'Industries', sortValue: (s) => Object.keys(s.industries).length, render: (s) => <span className="text-xs text-slate-500">{Object.keys(s.industries).join(', ')}</span> },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">States — {snapshot.states.length} Total</h2>
      <SortableTable rows={snapshot.states} columns={columns} rowKey={(s) => s.id} initialSort={{ key: 'ev', dir: 'desc' }} />
    </div>
  );
}
