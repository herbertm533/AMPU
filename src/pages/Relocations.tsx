import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import {
  RELOCATION_ODDS, RELOCATION_ATTEMPTS_PER_TURN, CARPETBAGGER_LADDER, NEGATIVE_TRAITS, IDEOLOGY_ORDER,
} from '../types';
import type { Politician, State, RelocationBand } from '../types';
import { relocationOdds } from '../engine/phaseRunners';

type StatusFilter = 'all' | 'free' | 'inOffice' | 'cooldown';

const BAND_LABELS: { key: RelocationBand; label: string }[] = [
  { key: 'sameRegionAlt', label: 'Same region + alt state' },
  { key: 'sameRegion', label: 'Same region' },
  { key: 'crossRegionAlt', label: 'Cross region + alt state' },
  { key: 'crossRegion', label: 'Cross region' },
];

// Avoids 0.05 * 100 === 5.000000000000001 artifacts; renders 2.5 correctly.
const pct = (x: number): number => +(x * 100).toFixed(1);

const carpetbaggerFor = (band: RelocationBand): number => {
  const base = band.startsWith('sameRegion') ? RELOCATION_ODDS.carpetbagger.sameRegion : RELOCATION_ODDS.carpetbagger.crossRegion;
  return band.endsWith('Alt') ? base * RELOCATION_ODDS.carpetbagger.altStateFactor : base;
};

export function Relocations(): JSX.Element {
  const { snapshot, attemptRelocation } = useGame();
  const [viewFactionId, setViewFactionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [moving, setMoving] = useState<{ politicianId: string; destId: string } | null>(null);

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const playerFactionId = g.playerFactionId;
  const activeFactionId = viewFactionId ?? playerFactionId;
  const isPlayerView = activeFactionId === playerFactionId;
  const moveLocked = g.phaseId !== '2.1.4';
  const faction = snapshot.factions.find((f) => f.id === activeFactionId);

  const factionOptions = [
    ...snapshot.factions.filter((f) => f.id === playerFactionId),
    ...snapshot.factions.filter((f) => f.id !== playerFactionId),
  ];

  const statesById = new Map<string, State>(snapshot.states.map((s) => [s.id, s]));
  const attempts = g.relocationAttempts?.year === g.year ? (g.relocationAttempts.counts[activeFactionId] ?? 0) : 0;
  const capReached = attempts >= RELOCATION_ATTEMPTS_PER_TURN;

  const statusOf = (p: Politician): { label: string; key: StatusFilter } => {
    if (p.currentOffice) return { label: 'In office', key: 'inOffice' };
    if (p.lastRelocationAttemptYear === g.year) return { label: 'On cooldown', key: 'cooldown' };
    return { label: 'Free', key: 'free' };
  };

  const base = snapshot.politicians.filter((p) => p.factionId === activeFactionId && !p.deathYear && !p.retiredYear);
  const rows = base.filter((p) => statusFilter === 'all' || statusOf(p).key === statusFilter);

  // altState first, then same-region by name, then the rest by name.
  const destinationsFor = (p: Politician): State[] => {
    const home = statesById.get(p.state);
    const others = snapshot.states.filter((s) => s.id !== p.state);
    return [...others].sort((a, b) => {
      const aAlt = a.id === p.altState ? 0 : 1;
      const bAlt = b.id === p.altState ? 0 : 1;
      if (aAlt !== bAlt) return aAlt - bAlt;
      const aSame = home && a.region === home.region ? 0 : 1;
      const bSame = home && b.region === home.region ? 0 : 1;
      if (aSame !== bSame) return aSame - bSame;
      return a.name.localeCompare(b.name);
    });
  };

  const moveDisabledTitle = (p: Politician): string | undefined => {
    if (!isPlayerView) return 'You can only manage your own faction';
    if (moveLocked) return 'Moves open during the Relocations phase';
    if (p.currentOffice) return 'In office';
    if (p.lastRelocationAttemptYear === g.year) return 'Already attempted this turn';
    if (capReached) return `No attempts remaining this phase (${RELOCATION_ATTEMPTS_PER_TURN}/${RELOCATION_ATTEMPTS_PER_TURN})`;
    return undefined;
  };

  const feed = (g.relocations ?? []).filter((e) => e.factionId === activeFactionId).slice(-20).reverse();
  const polName = (id: string): string => {
    const p = snapshot.politicians.find((pp) => pp.id === id);
    return p ? `${p.firstName} ${p.lastName}` : '(unknown)';
  };

  const movingPol = moving ? base.find((p) => p.id === moving.politicianId) : undefined;
  const movingDests = movingPol ? destinationsFor(movingPol) : [];
  const movingFrom = movingPol ? statesById.get(movingPol.state) : undefined;
  const movingDest = moving ? statesById.get(moving.destId) : undefined;
  const movingOdds = movingPol && movingFrom && movingDest ? relocationOdds(movingPol, movingFrom, movingDest) : undefined;

  const skillCol = (key: keyof Politician['skills'], label: string): Column<Politician> => ({
    key,
    label,
    sortValue: (p) => p.skills[key],
    className: 'text-right',
  });

  const columns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'St', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'ideology', label: 'Ideology', sortValue: (p) => IDEOLOGY_ORDER.indexOf(p.ideology), render: (p) => <span className="text-xs">{p.ideology}</span> },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, render: (p) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</span>, className: 'text-right' },
    skillCol('admin', 'Adm'),
    skillCol('legislative', 'Leg'),
    skillCol('judicial', 'Jud'),
    skillCol('military', 'Mil'),
    skillCol('governing', 'Gov'),
    skillCol('backroom', 'Bck'),
    {
      key: 'traits',
      label: 'Traits',
      render: (p) => (
        <span className="flex flex-wrap gap-0.5">
          {p.traits.map((t) => (
            <span key={t} className={`rounded px-1 text-[10px] ${NEGATIVE_TRAITS.includes(t) ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700'}`}>{t}</span>
          ))}
        </span>
      ),
    },
    {
      key: 'altState',
      label: 'Alt State',
      sortValue: (p) => p.altState ?? '',
      render: (p) => p.altState
        ? <span className="rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1 text-[10px] font-semibold">{p.altState.toUpperCase()}</span>
        : <span className="text-slate-400">—</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortValue: (p) => statusOf(p).label,
      render: (p) => <span className="text-xs">{statusOf(p).label}</span>,
    },
    {
      key: 'move',
      label: 'Move',
      render: (p) => {
        const dests = destinationsFor(p);
        const title = moveDisabledTitle(p) ?? (dests.length === 0 ? 'No destinations available' : undefined);
        return (
          <button
            disabled={!!title}
            title={title}
            onClick={() => setMoving({ politicianId: p.id, destId: dests[0].id })}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Move
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold">Relocations</h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 border text-xs ${capReached
              ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300 font-semibold'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Attempts: {attempts} / {RELOCATION_ATTEMPTS_PER_TURN}
          </span>
          <PartyBadge party={faction?.partyId ?? null} />
          <select
            value={activeFactionId}
            onChange={(e) => { setViewFactionId(e.target.value); setMoving(null); }}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          >
            {factionOptions.map((f) => (
              <option key={f.id} value={f.id}>{f.id === playerFactionId ? `${f.name} (you)` : f.name}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Move free politicians to other admitted states. Success depends on region distance and alt-state ties;
        successful movers risk a carpetbagger stigma.
        {moveLocked && isPlayerView && <span className="text-amber-600 dark:text-amber-400"> Moves are locked until the Relocations phase.</span>}
        {!isPlayerView && <span className="text-amber-600 dark:text-amber-400"> Viewing another faction — read-only.</span>}
      </p>

      {movingPol && movingFrom && (
        <div className="rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-3 text-sm space-y-2">
          <div className="font-semibold">Moving: {movingPol.firstName} {movingPol.lastName} ({movingPol.state.toUpperCase()})</div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={moving!.destId}
              onChange={(e) => setMoving({ politicianId: movingPol.id, destId: e.target.value })}
              className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
            >
              {movingDests.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.id === movingPol.altState ? ' — alt state' : ''}
                </option>
              ))}
            </select>
            {movingOdds && (
              <span className="text-xs">
                Success: <span className="font-semibold">{pct(movingOdds.success)}%</span>
                {' · '}Carpetbagger risk: <span className="font-semibold text-rose-600 dark:text-rose-400">{pct(movingOdds.carpetbagger)}%</span>
              </span>
            )}
            <button
              disabled={!!moveDisabledTitle(movingPol)}
              title={moveDisabledTitle(movingPol)}
              onClick={async () => {
                await attemptRelocation(movingPol.id, moving!.destId);
                setMoving(null);
              }}
              className="rounded bg-blue-600 text-white px-3 py-1 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Attempt
            </button>
            <button
              onClick={() => setMoving(null)}
              className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <details className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
        <summary className="cursor-pointer font-semibold">How relocations work</summary>
        <div className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p>
            Move free (not in office) politicians during the <span className="font-semibold">Relocations phase</span> (the game rests there every turn).
            Each faction gets <span className="font-semibold">{RELOCATION_ATTEMPTS_PER_TURN} attempts per turn</span>; failed rolls count.
            Each politician can attempt once per turn — win or lose, they wait until the next Relocations phase.
          </p>
          <table className="mt-1">
            <thead><tr className="text-left"><th className="pr-3">Move</th><th className="pr-3">Success</th><th>Carpetbagger risk</th></tr></thead>
            <tbody>
              {BAND_LABELS.map(({ key, label }) => (
                <tr key={key}>
                  <td className="pr-3 font-semibold">{label}</td>
                  <td className="pr-3">{pct(RELOCATION_ODDS.success[key])}%</td>
                  <td>{pct(carpetbaggerFor(key))}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            An <span className="font-semibold">alt state</span> is a second home — family ties, land, or reputation in another state.
            Roughly {pct(RELOCATION_ODDS.seed.sameRegion)}% of politicians have one in their home region,
            {' '}{pct(RELOCATION_ODDS.seed.crossRegion)}% somewhere farther, and
            {' '}{pct(1 - RELOCATION_ODDS.seed.sameRegion - RELOCATION_ODDS.seed.crossRegion)}% have none.
            Moving <span className="font-semibold">to</span> the alt state consumes it; moving elsewhere keeps it.
          </p>
          <p>
            Carpetbagger stigma only strikes on a successful move. The first stigma is{' '}
            <span className="font-semibold">{CARPETBAGGER_LADDER[0]}</span>; repeat offenders pick up{' '}
            {CARPETBAGGER_LADDER.slice(1).join(', then ')} (each −5 PV).
          </p>
        </div>
      </details>

      <div className="flex gap-2 flex-wrap items-center text-xs">
        <label className="flex items-center gap-1">
          <span className="text-slate-500">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="cooldown">On cooldown</option>
            <option value="inOffice">In office</option>
          </select>
        </label>
      </div>

      {rows.length === 0 && base.length === 0 ? (
        <p className="text-sm text-slate-500">{isPlayerView ? 'No free politicians to relocate.' : 'This faction has no active politicians.'}</p>
      ) : (
        <SortableTable
          rows={rows}
          columns={columns}
          rowKey={(p) => p.id}
          initialSort={{ key: 'pv', dir: 'desc' }}
        />
      )}

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700">
          <h3 className="font-semibold text-sm">Recent moves {faction ? `— ${faction.name}` : ''}</h3>
        </div>
        {feed.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400">No relocations yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/50 text-xs">
            {feed.map((e, i) => (
              <li key={`${e.politicianId}-${e.year}-${i}`} className="px-3 py-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 font-mono">{e.year}</span>
                <span className="font-semibold">{polName(e.politicianId)}</span>
                <span className="text-slate-500">{e.fromState.toUpperCase()} → {e.toState.toUpperCase()}</span>
                {e.success ? (
                  <span className="rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 text-[10px] font-semibold">Success</span>
                ) : (
                  <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px] font-semibold">Failed</span>
                )}
                {e.traitsGained.map((t) => (
                  <span key={t} className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px]">{t}</span>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
