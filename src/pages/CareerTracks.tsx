import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import {
  CAREER_TRACKS, TRACK_SKILL, TRACK_THEMED_TRAITS, CAREER_RANDOM_NEGATIVES,
  CAREER_ODDS, CAREER_TRACK_MAX_YEARS, NEGATIVE_TRAITS, IDEOLOGY_ORDER,
} from '../types';
import type { CareerTrack, Politician } from '../types';

type TrackFilter = 'all' | 'none' | CareerTrack;
type StatusFilter = 'all' | 'free' | 'inOffice' | 'onTrack';

const THRESHOLDS = [4, 8, 12, 16, 20];

function statusOf(p: Politician): { label: string; key: StatusFilter } {
  if (p.currentOffice) return { label: p.careerTrack ? 'Paused — in office' : 'In office', key: 'inOffice' };
  if (p.careerTrack) return { label: 'On track', key: 'onTrack' };
  return { label: 'Free', key: 'free' };
}

function yearsToNext(p: Politician): number | null {
  if (!p.careerTrack || p.currentOffice) return null;
  if (p.careerTrackYears >= CAREER_TRACK_MAX_YEARS) return null;
  return 4 - (p.careerTrackYears % 4);
}

export function CareerTracks(): JSX.Element {
  const { snapshot, setCareerTrack } = useGame();
  const [viewFactionId, setViewFactionId] = useState<string | null>(null);
  const [trackFilter, setTrackFilter] = useState<TrackFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const playerFactionId = g.playerFactionId;
  const activeFactionId = viewFactionId ?? playerFactionId;
  const isPlayerView = activeFactionId === playerFactionId;
  const assignLocked = g.phaseId !== '2.1.2';
  const faction = snapshot.factions.find((f) => f.id === activeFactionId);

  const factionOptions = [
    ...snapshot.factions.filter((f) => f.id === playerFactionId),
    ...snapshot.factions.filter((f) => f.id !== playerFactionId),
  ];

  const base = snapshot.politicians.filter((p) => p.factionId === activeFactionId && !p.deathYear && !p.retiredYear);
  const rows = base.filter((p) => {
    if (trackFilter === 'none' && p.careerTrack) return false;
    if (trackFilter !== 'all' && trackFilter !== 'none' && p.careerTrack !== trackFilter) return false;
    if (statusFilter !== 'all' && statusOf(p).key !== statusFilter) return false;
    return true;
  });

  const gains = (g.careerGains ?? []).filter((e) => e.factionId === activeFactionId).slice(-20).reverse();
  const polName = (id: string): string => {
    const p = snapshot.politicians.find((pp) => pp.id === id);
    return p ? `${p.firstName} ${p.lastName}` : '(unknown)';
  };

  const assignTooltip = !isPlayerView
    ? 'You can only manage your own faction'
    : assignLocked
    ? 'Assignments open during the Career Tracks phase'
    : undefined;

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
    { key: 'cmd', label: 'Cmd', sortValue: (p) => p.command, className: 'text-right' },
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
      key: 'status',
      label: 'Status',
      sortValue: (p) => statusOf(p).label,
      render: (p) => {
        const s = statusOf(p);
        const maxed = Object.values(p.skills).every((v) => v >= 5);
        const exhausted = p.careerTrack && p.careerTrackYears >= CAREER_TRACK_MAX_YEARS;
        const milestone = p.careerTrack && !p.currentOffice && p.careerTrackYears % 4 === 2 && p.careerTrackYears < CAREER_TRACK_MAX_YEARS;
        return (
          <span className="flex flex-wrap gap-1 items-center text-xs">
            {s.label}
            {milestone && <span className="rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-1 text-[10px]">Milestone next turn</span>}
            {exhausted && <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px]">Exhausted</span>}
            {maxed && <span className="rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1 text-[10px]">Maxed</span>}
          </span>
        );
      },
    },
    { key: 'track', label: 'Track', sortValue: (p) => p.careerTrack ?? '—', render: (p) => p.careerTrack ?? <span className="text-slate-400">—</span> },
    { key: 'years', label: 'Yrs', sortValue: (p) => p.careerTrackYears, className: 'text-right' },
    {
      key: 'next',
      label: 'Next',
      sortValue: (p) => yearsToNext(p) ?? 999,
      render: (p) => {
        const n = yearsToNext(p);
        return n == null ? <span className="text-slate-400">—</span> : <span>{n} yr{n === 1 ? '' : 's'}</span>;
      },
      className: 'text-right',
    },
    {
      key: 'assign',
      label: 'Assign',
      render: (p) => {
        const disabled = !isPlayerView || assignLocked || !!p.currentOffice;
        const title = !isPlayerView
          ? 'You can only manage your own faction'
          : p.currentOffice
          ? 'In office'
          : assignLocked
          ? 'Assignments open during the Career Tracks phase'
          : undefined;
        return (
          <select
            value={p.careerTrack ?? ''}
            disabled={disabled}
            title={title}
            onChange={(e) => setCareerTrack(p.id, (e.target.value || null) as Politician['careerTrack'])}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">— None —</option>
            {CAREER_TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold">Career Tracks</h2>
        <div className="flex items-center gap-2">
          <PartyBadge party={faction?.partyId ?? null} />
          <select
            value={activeFactionId}
            onChange={(e) => setViewFactionId(e.target.value)}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          >
            {factionOptions.map((f) => (
              <option key={f.id} value={f.id}>{f.id === playerFactionId ? `${f.name} (you)` : f.name}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Politicians on a track roll for skill and trait gains at 4, 8, 12, 16, and 20 years.
        On-track politicians remain eligible for office; progress pauses while they serve.
        {assignLocked && isPlayerView && <span className="text-amber-600 dark:text-amber-400"> Assignments are locked until the Career Tracks phase.</span>}
        {!isPlayerView && <span className="text-amber-600 dark:text-amber-400"> Viewing another faction — read-only.</span>}
      </p>

      <details className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
        <summary className="cursor-pointer font-semibold">How career tracks work</summary>
        <div className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p>
            Assign free politicians to a track during the <span className="font-semibold">Career Tracks phase</span> (the game rests there every turn).
            Each turn on a track adds 2 years. At {THRESHOLDS.join(' / ')} years three independent rolls fire:
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li><span className="font-semibold">Skill ({Math.round(CAREER_ODDS.skill * 100)}%)</span>: +1 to the track's skill (capped at 5; a capped roll is wasted). Private draws a random skill instead, re-drawing once if capped.</li>
            <li><span className="font-semibold">Track trait ({CAREER_ODDS.themedByThreshold.map((p) => Math.round(p * 100) + '%').join(' → ')})</span>: chance rises with each threshold, from the track's themed pool below.</li>
            <li><span className="font-semibold">Random trait ({Math.round(CAREER_ODDS.random * 100)}% flat)</span>: {Math.round(CAREER_ODDS.randomPositiveShare * 100)}% positive / {Math.round((1 - CAREER_ODDS.randomPositiveShare) * 100)}% negative ({CAREER_RANDOM_NEGATIVES.join(', ')}).</li>
          </ul>
          <p>
            Gains are permanent. Switching tracks resets the year counter to 0. Tracks exhaust at {CAREER_TRACK_MAX_YEARS} years.
            Holding office pauses accrual without losing progress.
          </p>
          <table className="mt-1">
            <thead><tr className="text-left"><th className="pr-3">Track</th><th className="pr-3">Skill</th><th>Themed traits</th></tr></thead>
            <tbody>
              {CAREER_TRACKS.map((t) => (
                <tr key={t}>
                  <td className="pr-3 font-semibold">{t}</td>
                  <td className="pr-3">{TRACK_SKILL[t] ?? 'random'}</td>
                  <td>{TRACK_THEMED_TRAITS[t].join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div className="flex gap-2 flex-wrap items-center text-xs">
        <label className="flex items-center gap-1">
          <span className="text-slate-500">Track:</span>
          <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value as TrackFilter)} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1">
            <option value="all">All</option>
            <option value="none">No track</option>
            {CAREER_TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1">
          <span className="text-slate-500">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="onTrack">On track</option>
            <option value="inOffice">In office</option>
          </select>
        </label>
        {assignTooltip && <span className="text-slate-400 italic">{assignTooltip}</span>}
      </div>

      {rows.length === 0 && base.length === 0 ? (
        <p className="text-sm text-slate-500">{isPlayerView ? 'No free politicians to assign.' : 'This faction has no active politicians.'}</p>
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
          <h3 className="font-semibold text-sm">Recent gains {faction ? `— ${faction.name}` : ''}</h3>
        </div>
        {gains.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400">No career gains yet. Assign politicians to tracks and advance.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/50 text-xs">
            {gains.map((e, i) => (
              <li key={`${e.politicianId}-${e.year}-${e.detail}-${i}`} className="px-3 py-1.5 flex items-center gap-2">
                <span className="text-slate-400 font-mono">{e.year}</span>
                <span className="font-semibold">{polName(e.politicianId)}</span>
                <span className="text-slate-500">({e.track}, yr {e.thresholdYears})</span>
                {e.kind === 'skill' ? (
                  <span className="text-emerald-700 dark:text-emerald-400">+1 {e.detail}</span>
                ) : (
                  <span className={e.negative ? 'text-rose-600 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'}>
                    {e.negative ? 'picked up' : 'gained'} {e.detail}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
