import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import {
  CONVERSION_ODDS, CONVERSION_ATTEMPTS_PER_TURN, NEGATIVE_TRAITS, IDEOLOGY_ORDER,
} from '../types';
import type { Politician, ConversionEntry } from '../types';
import { factionCenter, conversionOdds, passiveConversionChance, mentorBondAnchored } from '../engine/phaseRunners';

type StatusFilter = 'all' | 'available' | 'attempted';

const FREE_AGENTS_VIEW = '__FREE__';

const KIND_LABELS: Record<ConversionEntry['kind'], string> = {
  defect: 'Defect',
  poach: 'Poach',
  sign: 'Sign',
};

const pct = (x: number): number => +(x * 100).toFixed(1);

export function Conversions(): JSX.Element {
  const { snapshot, attemptConversion } = useGame();
  const [viewFactionId, setViewFactionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [confirming, setConfirming] = useState<{ politicianId: string } | null>(null);

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const playerFactionId = g.playerFactionId;
  const activeFactionId = viewFactionId ?? playerFactionId;
  const isPlayerView = activeFactionId === playerFactionId;
  const isFreeAgentsView = activeFactionId === FREE_AGENTS_VIEW;
  const isRivalView = !isPlayerView && !isFreeAgentsView;
  const shiftLocked = g.phaseId !== '2.1.6';
  const playerFaction = snapshot.factions.find((f) => f.id === playerFactionId);
  const viewedFaction = isFreeAgentsView ? null : snapshot.factions.find((f) => f.id === activeFactionId);

  // Live every render: own-roster fit + risk re-derive after any mid-window
  // attempt re-centers the player's faction.
  const playerCenter = factionCenter(snapshot, playerFactionId);
  const attempts = g.conversionAttempts?.year === g.year ? (g.conversionAttempts.counts[playerFactionId] ?? 0) : 0;
  const capReached = attempts >= CONVERSION_ATTEMPTS_PER_TURN;

  const statusOf = (p: Politician): { label: string; key: StatusFilter } => {
    if (p.lastConversionAttemptYear === g.year) return { label: 'Attempted this turn', key: 'attempted' };
    return { label: 'Available', key: 'available' };
  };

  const base = isFreeAgentsView
    ? snapshot.politicians.filter((p) => !p.factionId && !p.deathYear && !p.retiredYear)
    : snapshot.politicians.filter((p) => p.factionId === activeFactionId && !p.deathYear && !p.retiredYear);
  const rows = base.filter((p) => statusFilter === 'all' || statusOf(p).key === statusFilter);

  const actionDisabledTitle = (p: Politician): string | undefined => {
    if (shiftLocked) return 'Conversions open during the Faction Conversions phase';
    if (capReached) return `No attempts remaining this phase (${CONVERSION_ATTEMPTS_PER_TURN}/${CONVERSION_ATTEMPTS_PER_TURN})`;
    if (p.lastConversionAttemptYear === g.year) return 'Already attempted this turn';
    if (playerCenter === null) return 'Your faction has no living members';
    if (p.factionId === playerFactionId) return 'Member of your faction';
    return undefined;
  };

  const factionName = (id: string | null): string => {
    if (id === null) return 'Free Agent';
    return snapshot.factions.find((f) => f.id === id)?.name ?? '(unknown)';
  };
  const polName = (id: string): string => {
    const p = snapshot.politicians.find((pp) => pp.id === id);
    return p ? `${p.firstName} ${p.lastName}` : '(unknown)';
  };

  const feed = (g.conversions ?? [])
    .filter((e) => {
      if (isFreeAgentsView) return e.kind === 'sign';
      return e.fromFactionId === activeFactionId || e.toFactionId === activeFactionId;
    })
    .slice(-20)
    .reverse();

  const confirmingPol = confirming ? base.find((p) => p.id === confirming.politicianId) : undefined;
  const confirmingOdds = confirmingPol && playerCenter !== null && playerFaction
    ? conversionOdds(snapshot, playerFactionId, confirmingPol)
    : undefined;

  // Factor labels for the itemized readout — neutral 1.0s are hidden.
  const factorLabels = (odds: NonNullable<typeof confirmingOdds>): { mult: number; label: string }[] => {
    const f = odds.factors;
    const list: { mult: number; label: string }[] = [];
    if (f.fit !== 1) list.push({ mult: f.fit, label: odds.kind === 'sign' ? (f.fit > 1 ? 'close fit' : 'far fit') : (f.fit > 1 ? 'better fit' : 'worse fit') });
    if (f.ffHistory !== 1) list.push({ mult: f.ffHistory, label: 'FF history' });
    if (f.mentorBond !== 1) list.push({ mult: f.mentorBond, label: 'mentor bond' });
    if (f.highPv !== 1) list.push({ mult: f.highPv, label: 'high PV' });
    if (f.flipFlopperTrait !== 1) list.push({ mult: f.flipFlopperTrait, label: 'Flip-Flopper trait' });
    if (f.loyal !== 1) list.push({ mult: f.loyal, label: 'Loyal' });
    if (f.opportunist !== 1) list.push({ mult: f.opportunist, label: 'Opportunist' });
    return list;
  };

  const factionOptions = [
    ...snapshot.factions.filter((f) => f.id === playerFactionId),
    ...snapshot.factions.filter((f) => f.id !== playerFactionId),
  ];

  const ownColumns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'St', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'ideology', label: 'Ideology', sortValue: (p) => IDEOLOGY_ORDER.indexOf(p.ideology), render: (p) => <span className="text-xs">{p.ideology}</span> },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, render: (p) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</span>, className: 'text-right' },
    {
      key: 'fit', label: 'Fit',
      sortValue: (p) => playerCenter !== null ? Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - playerCenter) : 999,
      render: (p) => playerCenter !== null
        ? <span className="text-xs">{Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - playerCenter)}</span>
        : <span className="text-slate-400">—</span>,
      className: 'text-right',
    },
    {
      key: 'risk', label: 'Risk',
      sortValue: (p) => passiveConversionChance(p),
      render: (p) => {
        const r = passiveConversionChance(p);
        return r >= 0.04
          ? <span className="font-semibold text-rose-600 dark:text-rose-400">{pct(r)}%</span>
          : <span className="text-xs">{pct(r)}%</span>;
      },
      className: 'text-right',
    },
    {
      key: 'traits', label: 'Traits',
      render: (p) => (
        <span className="flex flex-wrap gap-0.5">
          {p.traits.map((t) => (
            <span key={t} className={`rounded px-1 text-[10px] ${NEGATIVE_TRAITS.includes(t) ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700'}`}>{t}</span>
          ))}
        </span>
      ),
    },
    {
      key: 'ff', label: 'FF',
      sortValue: (p) => p.flipFlopperPenalty,
      render: (p) => p.flipFlopperPenalty > 0
        ? <span className="font-semibold text-rose-600 dark:text-rose-400">{p.flipFlopperPenalty}</span>
        : <span className="text-slate-400">—</span>,
      className: 'text-right',
    },
    {
      key: 'mentor', label: 'Mentor',
      sortValue: (p) => mentorBondAnchored(snapshot, p) ? 1 : 0,
      render: (p) => mentorBondAnchored(snapshot, p)
        ? <span className="rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 text-[10px] font-semibold">Bonded</span>
        : <span className="text-slate-400">—</span>,
    },
    {
      key: 'status', label: 'Status',
      sortValue: (p) => statusOf(p).label,
      render: (p) => <span className="text-xs">{statusOf(p).label}</span>,
    },
  ];

  const actionColumn: Column<Politician> = {
    key: 'action', label: 'Action',
    render: (p) => {
      const title = actionDisabledTitle(p);
      return (
        <button
          disabled={!!title}
          title={title}
          onClick={() => setConfirming({ politicianId: p.id })}
          className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {isFreeAgentsView ? 'Sign' : 'Poach'}
        </button>
      );
    },
  };

  const rivalColumns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'St', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'ideology', label: 'Ideology', sortValue: (p) => IDEOLOGY_ORDER.indexOf(p.ideology), render: (p) => <span className="text-xs">{p.ideology}</span> },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, render: (p) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</span>, className: 'text-right' },
    {
      key: 'fit', label: 'Fit',
      sortValue: (p) => playerCenter !== null ? Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - playerCenter) : 999,
      render: (p) => playerCenter !== null
        ? <span className="text-xs">{Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - playerCenter)}</span>
        : <span className="text-slate-400">—</span>,
      className: 'text-right',
    },
    {
      key: 'traits', label: 'Traits',
      render: (p) => (
        <span className="flex flex-wrap gap-0.5">
          {p.traits.map((t) => (
            <span key={t} className={`rounded px-1 text-[10px] ${NEGATIVE_TRAITS.includes(t) ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700'}`}>{t}</span>
          ))}
        </span>
      ),
    },
    {
      key: 'ff', label: 'FF',
      sortValue: (p) => p.flipFlopperPenalty,
      render: (p) => p.flipFlopperPenalty > 0
        ? <span className="font-semibold text-rose-600 dark:text-rose-400">{p.flipFlopperPenalty}</span>
        : <span className="text-slate-400">—</span>,
      className: 'text-right',
    },
    {
      key: 'party', label: 'Match',
      sortValue: (p) => playerFaction && viewedFaction && playerFaction.partyId !== viewedFaction.partyId ? 1 : 0,
      render: () => {
        if (!playerFaction || !viewedFaction) return <span className="text-slate-400">—</span>;
        const cross = playerFaction.partyId !== viewedFaction.partyId;
        return cross
          ? <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px] font-semibold">Cross</span>
          : <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px] font-semibold">Same</span>;
      },
    },
    {
      key: 'office', label: 'Office',
      sortValue: (p) => p.currentOffice ? p.currentOffice.type : '',
      render: (p) => p.currentOffice ? <span className="text-xs">{p.currentOffice.type}</span> : <span className="text-slate-400">—</span>,
    },
    {
      key: 'status', label: 'Status',
      sortValue: (p) => statusOf(p).label,
      render: (p) => <span className="text-xs">{statusOf(p).label}</span>,
    },
    actionColumn,
  ];

  const freeAgentColumns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'St', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    { key: 'ideology', label: 'Ideology', sortValue: (p) => IDEOLOGY_ORDER.indexOf(p.ideology), render: (p) => <span className="text-xs">{p.ideology}</span> },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, render: (p) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</span>, className: 'text-right' },
    {
      key: 'fitBand', label: 'Fit',
      sortValue: (p) => playerCenter !== null ? Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - playerCenter) : 999,
      render: (p) => {
        if (playerCenter === null) return <span className="text-slate-400">—</span>;
        const d = Math.abs(IDEOLOGY_ORDER.indexOf(p.ideology) - playerCenter);
        const label = d <= CONVERSION_ODDS.sign.fitCloseMax ? 'Close' : d >= CONVERSION_ODDS.sign.fitFarMin ? 'Far' : 'Mid';
        const cls = label === 'Close' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
          : label === 'Far' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
          : 'bg-slate-200 dark:bg-slate-700';
        return <span className={`rounded px-1 text-[10px] font-semibold ${cls}`}>{label} ({d})</span>;
      },
    },
    {
      key: 'traits', label: 'Traits',
      render: (p) => (
        <span className="flex flex-wrap gap-0.5">
          {p.traits.map((t) => (
            <span key={t} className={`rounded px-1 text-[10px] ${NEGATIVE_TRAITS.includes(t) ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700'}`}>{t}</span>
          ))}
        </span>
      ),
    },
    {
      key: 'odds', label: 'Sign odds',
      sortValue: (p) => playerCenter !== null ? conversionOdds(snapshot, playerFactionId, p).success : 0,
      render: (p) => playerCenter !== null
        ? <span className="text-xs font-semibold">{pct(conversionOdds(snapshot, playerFactionId, p).success)}%</span>
        : <span className="text-slate-400">—</span>,
      className: 'text-right',
    },
    {
      key: 'status', label: 'Status',
      sortValue: (p) => statusOf(p).label,
      render: (p) => <span className="text-xs">{statusOf(p).label}</span>,
    },
    actionColumn,
  ];

  const columns = isPlayerView ? ownColumns : isFreeAgentsView ? freeAgentColumns : rivalColumns;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold">Faction Conversions</h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 border text-xs ${capReached
              ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300 font-semibold'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Attempts: {attempts} / {CONVERSION_ATTEMPTS_PER_TURN}
          </span>
          <PartyBadge party={viewedFaction?.partyId ?? null} />
          <select
            value={activeFactionId}
            onChange={(e) => { setViewFactionId(e.target.value); setConfirming(null); }}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          >
            {factionOptions.map((f) => (
              <option key={f.id} value={f.id}>{f.id === playerFactionId ? `${f.name} (you)` : f.name}</option>
            ))}
            <option value={FREE_AGENTS_VIEW}>Free Agents</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {isPlayerView && 'Every politician — yours included — risks a 2% passive defection per turn. Loyal seeds, mentor bonds, and ideological cohesion are your defense.'}
        {isRivalView && 'Poach rival politicians: cross-party costs them an extra flip-flopper stack on success.'}
        {isFreeAgentsView && 'Free agents are factionless politicians. Signing claims them for your faction at no flip-flopper cost.'}
        {shiftLocked && <span className="text-amber-600 dark:text-amber-400"> Conversions are locked until the Faction Conversions phase.</span>}
      </p>

      {confirmingPol && confirmingOdds && (
        <div className="rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-3 text-sm space-y-2">
          <div className="font-semibold">
            {confirmingOdds.kind === 'sign' ? 'Signing' : 'Poaching'}: {confirmingPol.firstName} {confirmingPol.lastName} ({confirmingPol.state.toUpperCase()})
            {confirmingOdds.crossParty && <span className="ml-2 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1.5 text-[10px] font-semibold">Cross-party!</span>}
          </div>
          <div className="text-xs flex flex-wrap items-center gap-1">
            <span className="font-semibold">{pct(confirmingOdds.base)}% base</span>
            {factorLabels(confirmingOdds).map((f, i) => (
              <span key={i} className="text-slate-600 dark:text-slate-300">× {f.mult} ({f.label})</span>
            ))}
            <span className="ml-1">= Success: <span className="font-bold">{pct(confirmingOdds.success)}%</span></span>
          </div>
          {confirmingOdds.kind === 'poach' && (
            <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              {confirmingOdds.crossParty
                ? `+${CONVERSION_ODDS.ffStacks.cross} FF stacks on success (cross-party)`
                : `+${CONVERSION_ODDS.ffStacks.same} FF stack on success`}
            </div>
          )}
          <div className="flex gap-2">
            <button
              disabled={!!actionDisabledTitle(confirmingPol)}
              title={actionDisabledTitle(confirmingPol)}
              onClick={async () => {
                await attemptConversion(confirmingPol.id);
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
        <summary className="cursor-pointer font-semibold">How faction conversions work</summary>
        <div className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p>
            Every politician (yours included, officeholders included) faces a{' '}
            <span className="font-semibold">{pct(CONVERSION_ODDS.passive.rate)}% passive defection chance</span> per turn
            (×{CONVERSION_ODDS.traits.Opportunist.passive} for Opportunists, ×0 for Loyal). On a hit:{' '}
            {pct(CONVERSION_ODDS.passive.oneAway)}% one faction away (rank ±1 within their party — edges forced inward),{' '}
            {pct(CONVERSION_ODDS.passive.anyFaction)}% to a random faction (cross-party allowed — the wild card).
            Each source faction loses at most {CONVERSION_ODDS.passive.lossCapPerFaction} per tick.
          </p>
          <p>
            Spend up to <span className="font-semibold">{CONVERSION_ATTEMPTS_PER_TURN} attempts per turn</span>{' '}
            (failures count) to poach rivals or sign free agents. One attempt per subject per turn.
          </p>
          <table>
            <thead><tr className="text-left"><th className="pr-3">Poach</th><th className="pr-3">Not in office</th><th>In office</th></tr></thead>
            <tbody>
              <tr><td className="pr-3 font-semibold">Same party</td><td className="pr-3">{pct(CONVERSION_ODDS.poach.matrix.same.notInOffice)}%</td><td>{pct(CONVERSION_ODDS.poach.matrix.same.inOffice)}%</td></tr>
              <tr><td className="pr-3 font-semibold">Cross party</td><td className="pr-3">{pct(CONVERSION_ODDS.poach.matrix.cross.notInOffice)}%</td><td>{pct(CONVERSION_ODDS.poach.matrix.cross.inOffice)}%</td></tr>
            </tbody>
          </table>
          <p>
            <span className="font-semibold">Sign</span>: {pct(CONVERSION_ODDS.sign.base)}% flat,
            × {CONVERSION_ODDS.sign.fitBandClose} at distance ≤ {CONVERSION_ODDS.sign.fitCloseMax},
            × {CONVERSION_ODDS.sign.fitBandFar} at distance ≥ {CONVERSION_ODDS.sign.fitFarMin}. No flip-flopper penalty.
          </p>
          <table>
            <thead><tr className="text-left"><th className="pr-3">Poach multiplier</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td className="pr-3">Better fit / worse fit</td><td>×{CONVERSION_ODDS.willingness.fitBetter} / ×{CONVERSION_ODDS.willingness.fitWorse}</td></tr>
              <tr><td className="pr-3">FF history (any stack)</td><td>×{CONVERSION_ODDS.willingness.ffHistory}</td></tr>
              <tr><td className="pr-3">Mentor bond</td><td>×{CONVERSION_ODDS.willingness.mentorBond}</td></tr>
              <tr><td className="pr-3">High PV (≥ {CONVERSION_ODDS.willingness.highPvThreshold})</td><td>×{CONVERSION_ODDS.willingness.highPv}</td></tr>
              <tr><td className="pr-3">Flip-Flopper trait</td><td>×{CONVERSION_ODDS.willingness.flipFlopperTrait}</td></tr>
              <tr><td className="pr-3">Loyal target</td><td>×{CONVERSION_ODDS.traits.Loyal.attempt}</td></tr>
              <tr><td className="pr-3">Opportunist target</td><td>×{CONVERSION_ODDS.traits.Opportunist.attempt}</td></tr>
            </tbody>
          </table>
          <p>
            FF stacks: +{CONVERSION_ODDS.ffStacks.same} same-party / +{CONVERSION_ODDS.ffStacks.cross} cross-party (passive AND poach success);
            −5 PV each, decay one per turn at 2.1.3. Signing carries no penalty.
          </p>
          <p>
            Roughly {pct(CONVERSION_ODDS.seed.loyal)}% Loyal (+4 PV, passive-immune),
            {' '}{pct(CONVERSION_ODDS.seed.opportunist)}% Opportunist (−5 PV, double passive risk),
            {' '}{pct(1 - CONVERSION_ODDS.seed.loyal - CONVERSION_ODDS.seed.opportunist)}% neither.
          </p>
        </div>
      </details>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700">
          <h3 className="font-semibold text-sm">Recent conversions {viewedFaction ? `— ${viewedFaction.name}` : isFreeAgentsView ? '— Free Agents' : ''}</h3>
        </div>
        {feed.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400">No conversions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/50 text-xs">
            {feed.map((e, i) => (
              <li key={`${e.politicianId}-${e.year}-${i}`} className="px-3 py-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 font-mono">{e.year}</span>
                <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px] font-semibold">{KIND_LABELS[e.kind]}</span>
                {e.crossParty && (
                  <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px] font-semibold">Cross-party!</span>
                )}
                <span className="font-semibold">{polName(e.politicianId)}</span>
                <span className="text-slate-500">{factionName(e.fromFactionId)} → {factionName(e.toFactionId)}</span>
                {e.success ? (
                  <span className="rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 text-[10px] font-semibold">Success</span>
                ) : (
                  <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px] font-semibold">Failed</span>
                )}
                {e.ffGained > 0 && (
                  <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px]">FF +{e.ffGained}</span>
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
          </select>
        </label>
      </div>

      {rows.length === 0 && base.length === 0 ? (
        <p className="text-sm text-slate-500">
          {isPlayerView ? 'No politicians in your faction.' : isFreeAgentsView ? 'No free agents available.' : 'This faction has no active politicians.'}
        </p>
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
