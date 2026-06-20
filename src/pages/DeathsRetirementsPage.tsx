import { useState, useMemo } from 'react';
import { useGame } from '../state/GameContext';
import type { DeathCause, RetireCause } from '../types';

type Row = {
  politicianId: string;
  firstName: string;
  lastName: string;
  factionName: string;
  state: string;
  office: string;
  age: number;
  pv: number;
  causeKey: string;
  causeLabel: string;
  kind: 'death' | 'retire';
};

type SortKey = 'name' | 'faction' | 'state' | 'office' | 'age' | 'pv' | 'cause';

const DEATH_LABEL: Record<DeathCause, string> = {
  age: 'Died of age',
  battle: 'Killed in battle',
  event: 'Died in anytime event',
  assassination: 'Assassinated',
};

const RETIRE_LABEL: Record<RetireCause, string> = {
  age: 'Retired naturally',
  event: 'Retired (anytime event)',
  court: 'Retired from Court',
};

export function DeathsRetirementsPage(): JSX.Element {
  const { snapshot, advance } = useGame();
  const [sortKey, setSortKey] = useState<SortKey>('pv');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rows = useMemo<Row[]>(() => {
    if (!snapshot) return [];
    const summaries = snapshot.game.halfTermSummaries ?? [];
    if (summaries.length === 0) return [];
    const head = summaries[summaries.length - 1];
    const result: Row[] = [];
    for (const d of head.deaths) {
      const p = snapshot.politicians.find((pp) => pp.id === d.politicianId);
      if (!p) continue;
      const factionName = p.factionId ? (snapshot.factions.find((f) => f.id === p.factionId)?.name ?? p.factionId) : '—';
      result.push({
        politicianId: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        factionName,
        state: p.state.toUpperCase(),
        office: d.office ?? '—',
        age: p.age,
        pv: p.pvCache,
        causeKey: d.cause,
        causeLabel: DEATH_LABEL[d.cause] ?? d.cause,
        kind: 'death',
      });
    }
    for (const r of head.retirements) {
      const p = snapshot.politicians.find((pp) => pp.id === r.politicianId);
      if (!p) continue;
      const factionName = p.factionId ? (snapshot.factions.find((f) => f.id === p.factionId)?.name ?? p.factionId) : '—';
      result.push({
        politicianId: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        factionName,
        state: p.state.toUpperCase(),
        office: r.office ?? '—',
        age: p.age,
        pv: p.pvCache,
        causeKey: r.cause,
        causeLabel: RETIRE_LABEL[r.cause] ?? r.cause,
        kind: 'retire',
      });
    }
    return result;
  }, [snapshot]);

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const summaries = g.halfTermSummaries ?? [];
  const head = summaries.length > 0 ? summaries[summaries.length - 1] : null;
  const deathCount = head?.deaths.length ?? 0;
  const retireCount = head?.retirements.length ?? 0;
  const isEmpty = deathCount === 0 && retireCount === 0;

  const sortedRows = useMemo(() => {
    const m = sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      switch (sortKey) {
        case 'name': return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`) * m;
        case 'faction': return a.factionName.localeCompare(b.factionName) * m;
        case 'state': return a.state.localeCompare(b.state) * m;
        case 'office': return a.office.localeCompare(b.office) * m;
        case 'age': return (a.age - b.age) * m;
        case 'pv': return (a.pv - b.pv) * m;
        case 'cause': return a.causeLabel.localeCompare(b.causeLabel) * m;
      }
    });
  }, [rows, sortKey, sortDir]);

  const ageBuckets = useMemo(() => {
    const buckets: Record<string, number> = { 'Under 50': 0, '50s': 0, '60s': 0, '70s': 0, '80s+': 0 };
    for (const r of rows) {
      if (r.age < 50) buckets['Under 50']++;
      else if (r.age < 60) buckets['50s']++;
      else if (r.age < 70) buckets['60s']++;
      else if (r.age < 80) buckets['70s']++;
      else buckets['80s+']++;
    }
    return buckets;
  }, [rows]);

  const maxBucket = Math.max(1, ...Object.values(ageBuckets));

  const startYear = head?.startYear ?? g.year;
  const endYear = head?.endYear ?? g.year;
  const spanLabel = startYear === endYear ? `${endYear}` : `${startYear} to ${endYear}`;

  const onSort = (k: SortKey): void => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('desc'); }
  };

  const Head = ({ k, label, align = 'left' }: { k: SortKey; label: string; align?: 'left' | 'right' }): JSX.Element => (
    <th
      onClick={() => onSort(k)}
      className={`px-2 py-1.5 cursor-pointer select-none ${align === 'right' ? 'text-right' : 'text-left'} ${sortKey === k ? 'text-blue-600 dark:text-blue-400' : ''}`}
    >
      {label}{sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </th>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Deaths &amp; Retirements — {spanLabel}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {deathCount} died, {retireCount} retired this half-term.
      </p>
      {isEmpty ? (
        <div className="rounded border border-slate-300 dark:border-slate-700 p-4 space-y-3">
          <p className="text-sm">No deaths or retirements this half-term.</p>
          <button onClick={() => advance()} className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold">Continue</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                <tr>
                  <Head k="name" label="Name" />
                  <Head k="faction" label="Faction" />
                  <Head k="state" label="State" />
                  <Head k="office" label="Office" />
                  <Head k="age" label="Age" align="right" />
                  <Head k="pv" label="PV" align="right" />
                  <Head k="cause" label="Cause" />
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((r) => (
                  <tr key={`${r.kind}:${r.politicianId}`} className="border-b border-slate-200 dark:border-slate-700/50">
                    <td className="px-2 py-1 font-semibold">{r.firstName} {r.lastName}</td>
                    <td className="px-2 py-1 text-xs">{r.factionName}</td>
                    <td className="px-2 py-1">{r.state}</td>
                    <td className="px-2 py-1 text-xs">{r.office}</td>
                    <td className="px-2 py-1 text-right">{r.age}</td>
                    <td className="px-2 py-1 text-right font-bold text-emerald-700 dark:text-emerald-400">{r.pv}</td>
                    <td className="px-2 py-1 text-xs">{r.causeLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
            <h3 className="font-semibold text-sm mb-2">Age distribution</h3>
            <div className="space-y-1">
              {Object.entries(ageBuckets).map(([label, n]) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <div className="w-16 text-slate-500">{label}</div>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded h-3 overflow-hidden">
                    <div
                      className="h-3 bg-blue-500"
                      style={{ width: `${(n / maxBucket) * 100}%` }}
                    />
                  </div>
                  <div className="w-6 text-right font-mono">{n}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => advance()} className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold">Continue</button>
        </div>
      )}
    </div>
  );
}
