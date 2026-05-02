import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import type { Politician } from '../types';

export function CongressPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const senate: Politician[] = snapshot.states.flatMap((s) =>
    s.senators.map((sn) => snapshot.politicians.find((p) => p.id === sn.politicianId)!).filter(Boolean)
  );
  const house: Politician[] = snapshot.states.flatMap((s) =>
    s.representativeIds.map((id) => snapshot.politicians.find((p) => p.id === id)!).filter(Boolean)
  );
  const speaker = snapshot.politicians.find((p) => p.id === snapshot.game.speakerId);
  const proTem = snapshot.politicians.find((p) => p.id === snapshot.game.proTemId);

  const senateBlue = senate.filter((p) => p.partyId === 'BLUE').length;
  const senateRed = senate.filter((p) => p.partyId === 'RED').length;
  const houseBlue = house.filter((p) => p.partyId === 'BLUE').length;
  const houseRed = house.filter((p) => p.partyId === 'RED').length;

  const columns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => p.lastName, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'State', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'party', label: 'Party', sortValue: (p) => p.partyId ?? '', render: (p) => <PartyBadge party={p.partyId} /> },
    { key: 'ideo', label: 'Ideology', sortValue: (p) => p.ideology },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, className: 'text-right font-mono' },
    { key: 'leg', label: 'Leg', sortValue: (p) => p.skills.legislative, className: 'text-right' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Congress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <h3 className="text-xs uppercase text-slate-500">Speaker of the House</h3>
          {speaker ? <div className="font-semibold">{speaker.firstName} {speaker.lastName} <PartyBadge party={speaker.partyId} /></div> : <div className="text-slate-400">Vacant</div>}
        </div>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <h3 className="text-xs uppercase text-slate-500">Senate Pro Tempore</h3>
          {proTem ? <div className="font-semibold">{proTem.firstName} {proTem.lastName} <PartyBadge party={proTem.partyId} /></div> : <div className="text-slate-400">Vacant</div>}
        </div>
      </div>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="text-xs uppercase text-slate-500">Committee Chairs</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {(['Domestic', 'Foreign', 'Economic', 'Justice'] as const).map((c) => {
            const id = snapshot.game.committeeChairs[c];
            const p = id ? snapshot.politicians.find((pp) => pp.id === id) : null;
            return (
              <div key={c}>
                <div className="text-slate-500">{c}</div>
                <div className="font-semibold">{p ? `${p.firstName} ${p.lastName}` : 'Vacant'}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Senate ({senate.length}) — <span className="text-blue-600 dark:text-blue-400">{senateBlue}D</span> · <span className="text-red-600 dark:text-red-400">{senateRed}R</span></h3>
        <SortableTable rows={senate} columns={columns} rowKey={(p) => p.id} initialSort={{ key: 'pv', dir: 'desc' }} />
      </div>
      <div>
        <h3 className="font-semibold mb-1">House ({house.length}) — <span className="text-blue-600 dark:text-blue-400">{houseBlue}D</span> · <span className="text-red-600 dark:text-red-400">{houseRed}R</span></h3>
        <SortableTable rows={house} columns={columns} rowKey={(p) => p.id} initialSort={{ key: 'pv', dir: 'desc' }} />
      </div>
    </div>
  );
}
