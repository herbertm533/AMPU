import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import {
  IDEOLOGY_SHIFT_ODDS, IDEOLOGY_ATTEMPTS_PER_TURN, NEGATIVE_TRAITS, IDEOLOGY_ORDER,
} from '../types';
import type { Politician, IdeologyShiftEntry } from '../types';
import { factionCenter, ideologyShiftOdds } from '../engine/phaseRunners';

type StatusFilter = 'all' | 'available' | 'attempted' | 'atCenter';

const KIND_LABELS: Record<IdeologyShiftEntry['kind'], string> = {
  drift: 'Drift',
  stateBias: 'State',
  self: 'Self',
  opposed: 'Opposed',
};

// Avoids 0.05 * 100 === 5.000000000000001 artifacts.
const pct = (x: number): number => +(x * 100).toFixed(1);

export function IdeologyShifts(): JSX.Element {
  const { snapshot, attemptIdeologyShift } = useGame();
  const [viewFactionId, setViewFactionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [confirming, setConfirming] = useState<{ politicianId: string } | null>(null);

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const playerFactionId = g.playerFactionId;
  const activeFactionId = viewFactionId ?? playerFactionId;
  const isPlayerView = activeFactionId === playerFactionId;
  const kind: 'self' | 'opposed' = isPlayerView ? 'self' : 'opposed';
  const shiftLocked = g.phaseId !== '2.1.5';
  const faction = snapshot.factions.find((f) => f.id === activeFactionId);

  const factionOptions = [
    ...snapshot.factions.filter((f) => f.id === playerFactionId),
    ...snapshot.factions.filter((f) => f.id !== playerFactionId),
  ];

  // Live every render: mid-window shifts move your center and re-derive
  // statuses in the same render.
  const playerCenter = factionCenter(snapshot, playerFactionId);
  const attempts = g.ideologyAttempts?.year === g.year ? (g.ideologyAttempts.counts[playerFactionId] ?? 0) : 0;
  const capReached = attempts >= IDEOLOGY_ATTEMPTS_PER_TURN;

  const statusOf = (p: Politician): { label: string; key: StatusFilter } => {
    if (p.lastIdeologyAttemptYear === g.year) return { label: 'Attempted this turn', key: 'attempted' };
    if (playerCenter !== null && IDEOLOGY_ORDER.indexOf(p.ideology) === playerCenter) return { label: 'At center', key: 'atCenter' };
    return { label: 'Available', key: 'available' };
  };

  const base = snapshot.politicians.filter((p) => p.factionId === activeFactionId && !p.deathYear && !p.retiredYear);
  const rows = base.filter((p) => statusFilter === 'all' || statusOf(p).key === statusFilter);

  const actionDisabledTitle = (p: Politician): string | undefined => {
    if (shiftLocked) return 'Shifts open during the Ideology Shifts phase';
    if (capReached) return `No attempts remaining this phase (${IDEOLOGY_ATTEMPTS_PER_TURN}/${IDEOLOGY_ATTEMPTS_PER_TURN})`;
    if (p.lastIdeologyAttemptYear === g.year) return 'Already attempted this turn';
    if (playerCenter === null) return 'Your faction has no living members';
    if (IDEOLOGY_ORDER.indexOf(p.ideology) === playerCenter) return "Already at your faction's center";
    return undefined;
  };

  const feed = (g.ideologyShifts ?? [])
    .filter((e) => e.actorFactionId === activeFactionId || e.subjectFactionId === activeFactionId)
    .slice(-20)
    .reverse();
  const polName = (id: string): string => {
    const p = snapshot.politicians.find((pp) => pp.id === id);
    return p ? `${p.firstName} ${p.lastName}` : '(unknown)';
  };

  const confirmingPol = confirming ? base.find((p) => p.id === confirming.politicianId) : undefined;
  const confirmingOdds = confirmingPol && playerCenter !== null ? ideologyShiftOdds(confirmingPol, kind, playerCenter) : undefined;

  const columns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'St', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'ideology', label: 'Ideology', sortValue: (p) => IDEOLOGY_ORDER.indexOf(p.ideology), render: (p) => <span className="text-xs">{p.ideology}</span> },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, render: (p) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</span>, className: 'text-right' },
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
      key: 'ff',
      label: 'FF',
      sortValue: (p) => p.flipFlopperPenalty,
      render: (p) => p.flipFlopperPenalty > 0
        ? <span className="font-semibold text-rose-600 dark:text-rose-400">{p.flipFlopperPenalty}</span>
        : <span className="text-slate-400">—</span>,
      className: 'text-right',
    },
    {
      key: 'status',
      label: 'Status',
      sortValue: (p) => statusOf(p).label,
      render: (p) => <span className="text-xs">{statusOf(p).label}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      render: (p) => {
        const title = actionDisabledTitle(p);
        return (
          <button
            disabled={!!title}
            title={title}
            onClick={() => setConfirming({ politicianId: p.id })}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isPlayerView ? 'Shift' : 'Target'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold">Ideology Shifts</h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 border text-xs ${capReached
              ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300 font-semibold'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Attempts: {attempts} / {IDEOLOGY_ATTEMPTS_PER_TURN}
          </span>
          <PartyBadge party={faction?.partyId ?? null} />
          <select
            value={activeFactionId}
            onChange={(e) => { setViewFactionId(e.target.value); setConfirming(null); }}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          >
            {factionOptions.map((f) => (
              <option key={f.id} value={f.id}>{f.id === playerFactionId ? `${f.name} (you)` : f.name}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Politicians drift with their faction and home state; spend attempts to consolidate your roster or
        drag rivals toward your center.
        {shiftLocked && <span className="text-amber-600 dark:text-amber-400"> Shifts are locked until the Ideology Shifts phase.</span>}
        {!isPlayerView && <span className="text-amber-600 dark:text-amber-400"> Targeting pulls this faction&apos;s politicians toward YOUR center — successful victims risk a flip-flopper stigma.</span>}
      </p>

      {confirmingPol && confirmingOdds && (
        <div className="rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-3 text-sm space-y-2">
          <div className="font-semibold">{isPlayerView ? 'Shifting' : 'Targeting'}: {confirmingPol.firstName} {confirmingPol.lastName} ({confirmingPol.state.toUpperCase()})</div>
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <span>{confirmingOdds.from} → <span className="font-semibold">{confirmingOdds.to}</span></span>
            <span>Success: <span className="font-semibold">{pct(confirmingOdds.success)}%</span></span>
            {kind === 'opposed' && (
              <span>Flip-flopper risk on success: <span className="font-semibold text-rose-600 dark:text-rose-400">{pct(confirmingOdds.ffRisk)}%</span></span>
            )}
            <button
              disabled={!!actionDisabledTitle(confirmingPol)}
              title={actionDisabledTitle(confirmingPol)}
              onClick={async () => {
                await attemptIdeologyShift(confirmingPol.id);
                setConfirming(null);
              }}
              className="rounded bg-blue-600 text-white px-3 py-1 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Attempt
            </button>
            <button
              onClick={() => setConfirming(null)}
              className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <details className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
        <summary className="cursor-pointer font-semibold">How ideology shifts work</summary>
        <div className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p>
            A faction&apos;s <span className="font-semibold">center</span> is the mean ideology of its living members, rounded.
            Each turn every politician faces one possible passive move, checked in order until something fires:
            faction pull ({pct(IDEOLOGY_SHIFT_ODDS.drift.faction)}% toward their own center), state pull
            ({pct(IDEOLOGY_SHIFT_ODDS.drift.stateBias)}% toward their state&apos;s lean, only where |bias| ≥ {IDEOLOGY_SHIFT_ODDS.drift.stateBiasMin}),
            then residual drift ({pct(IDEOLOGY_SHIFT_ODDS.drift.residual)}% either direction). Passive drift never causes
            flip-flopper penalties.
          </p>
          <p>
            Each faction gets <span className="font-semibold">{IDEOLOGY_ATTEMPTS_PER_TURN} shift attempts per turn</span> (failures count);
            each politician can be the subject of only one attempt per turn. Attempts open during the Ideology Shifts phase only.
            In-office politicians are valid subjects.
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li><span className="font-semibold">Shift (own roster, {pct(IDEOLOGY_SHIFT_ODDS.attempt.self)}%)</span>: one step toward your center. No flip-flopper risk.</li>
            <li><span className="font-semibold">Target (rival roster, {pct(IDEOLOGY_SHIFT_ODDS.attempt.opposed)}%)</span>: one step toward YOUR center. On success, {pct(IDEOLOGY_SHIFT_ODDS.attempt.ffRisk)}% chance the victim gains a flip-flopper stack (−5 PV each, decaying one per turn).</li>
          </ul>
          <table className="mt-1">
            <thead><tr className="text-left"><th className="pr-3">Trait</th><th className="pr-3">Drift</th><th className="pr-3">Shift (self)</th><th>Target (opposed)</th></tr></thead>
            <tbody>
              <tr>
                <td className="pr-3 font-semibold">Ideologue</td>
                <td className="pr-3">{IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue.drift === 0 ? 'immune' : `×${IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue.drift}`}</td>
                <td className="pr-3">×{IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue.self} ({pct(IDEOLOGY_SHIFT_ODDS.attempt.self * IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue.self)}%)</td>
                <td>×{IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue.opposed} ({pct(IDEOLOGY_SHIFT_ODDS.attempt.opposed * IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue.opposed)}%)</td>
              </tr>
              <tr>
                <td className="pr-3 font-semibold">Impressionable</td>
                <td className="pr-3">×{IDEOLOGY_SHIFT_ODDS.traitMods.Impressionable.drift}</td>
                <td className="pr-3">×{IDEOLOGY_SHIFT_ODDS.traitMods.Impressionable.self} ({pct(IDEOLOGY_SHIFT_ODDS.attempt.self * IDEOLOGY_SHIFT_ODDS.traitMods.Impressionable.self)}%)</td>
                <td>×{IDEOLOGY_SHIFT_ODDS.traitMods.Impressionable.opposed} ({pct(IDEOLOGY_SHIFT_ODDS.attempt.opposed * IDEOLOGY_SHIFT_ODDS.traitMods.Impressionable.opposed)}%)</td>
              </tr>
            </tbody>
          </table>
          <p>
            Roughly {pct(IDEOLOGY_SHIFT_ODDS.seed.ideologue)}% of politicians are Ideologues and
            {' '}{pct(IDEOLOGY_SHIFT_ODDS.seed.impressionable)}% are Impressionable
            ({pct(1 - IDEOLOGY_SHIFT_ODDS.seed.ideologue - IDEOLOGY_SHIFT_ODDS.seed.impressionable)}% are neither).
          </p>
        </div>
      </details>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700">
          <h3 className="font-semibold text-sm">Recent shifts {faction ? `— ${faction.name}` : ''}</h3>
        </div>
        {feed.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400">No ideology shifts yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/50 text-xs">
            {feed.map((e, i) => (
              <li key={`${e.politicianId}-${e.year}-${i}`} className="px-3 py-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 font-mono">{e.year}</span>
                <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px] font-semibold">{KIND_LABELS[e.kind]}</span>
                <span className="font-semibold">{polName(e.politicianId)}</span>
                <span className="text-slate-500">{e.fromIdeology} → {e.toIdeology}</span>
                {e.success ? (
                  <span className="rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 text-[10px] font-semibold">Success</span>
                ) : (
                  <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px] font-semibold">Failed</span>
                )}
                {e.flipFlopper && (
                  <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px]">Flip-Flopper +1</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2 flex-wrap items-center text-xs">
        <label className="flex items-center gap-1">
          <span className="text-slate-500">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1">
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="attempted">Attempted this turn</option>
            <option value="atCenter">At center</option>
          </select>
        </label>
      </div>

      {rows.length === 0 && base.length === 0 ? (
        <p className="text-sm text-slate-500">{isPlayerView ? 'No politicians to shift.' : 'This faction has no active politicians.'}</p>
      ) : (
        <SortableTable
          rows={rows}
          columns={columns}
          rowKey={(p) => p.id}
          initialSort={{ key: 'pv', dir: 'desc' }}
        />
      )}
    </div>
  );
}
