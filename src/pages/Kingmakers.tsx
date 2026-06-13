import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import {
  KINGMAKER_RULES, NEGATIVE_TRAITS, IDEOLOGY_ORDER,
} from '../types';
import type { Politician, KingmakerEntry } from '../types';
import { protegeCandidates } from '../engine/phaseRunners';

const KIND_LABELS: Record<KingmakerEntry['kind'], string> = {
  anointed: 'Anointed',
  bonded: 'Bonded',
  graduated: 'Graduated',
  dissolved: 'Dissolved',
};
const REASON_LABELS: Record<NonNullable<KingmakerEntry['reason']>, string> = {
  death: 'Death',
  retire: 'Retire',
  defect: 'Defect',
  released: 'Released',
  'draft-floor': 'Draft floor',
};
const TRIGGER_LABELS: Record<NonNullable<KingmakerEntry['trigger']>, string> = {
  tenure: '20 yrs',
  office: 'Office',
};

const pct = (x: number): number => +(x * 100).toFixed(0);

export function Kingmakers(): JSX.Element {
  const { snapshot, assignProtege, releaseProtege } = useGame();
  const [viewFactionId, setViewFactionId] = useState<string | null>(null);
  const [picking, setPicking] = useState<{ kingmakerId: string } | null>(null);

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const playerFactionId = g.playerFactionId;
  const activeFactionId = viewFactionId ?? playerFactionId;
  const isPlayerView = activeFactionId === playerFactionId;
  const phaseLocked = g.phaseId !== '2.1.7';
  const viewedFaction = snapshot.factions.find((f) => f.id === activeFactionId);
  const eraGate = KINGMAKER_RULES.commandGateByScenario[g.scenarioId] ?? KINGMAKER_RULES.commandGateDefault;

  const kingmakers = snapshot.politicians
    .filter((p) => p.factionId === activeFactionId && !p.deathYear && !p.retiredYear && p.traits.includes('Kingmaker'))
    .sort((a, b) => b.pvCache - a.pvCache);
  const bondedCount = kingmakers.filter((k) => k.protegeId).length;

  const factionOptions = [
    ...snapshot.factions.filter((f) => f.id === playerFactionId),
    ...snapshot.factions.filter((f) => f.id !== playerFactionId),
  ];

  const polName = (id?: string): string => {
    if (!id) return '(unknown)';
    const p = snapshot.politicians.find((pp) => pp.id === id);
    return p ? `${p.firstName} ${p.lastName}` : '(unknown)';
  };

  const feed = (g.kingmakers ?? [])
    .filter((e) => e.factionId === activeFactionId)
    .slice(-20)
    .reverse();

  const assignDisabledTitle = (k: Politician): string | undefined => {
    if (phaseLocked) return 'Mentorship opens during the Kingmakers & Protégés phase';
    if (protegeCandidates(snapshot, k.id).length === 0) return 'No eligible same-state protégés';
    return undefined;
  };
  const releaseDisabledTitle = (): string | undefined => {
    if (phaseLocked) return 'Mentorship opens during the Kingmakers & Protégés phase';
    return undefined;
  };

  const candidateColumns: Column<Politician>[] = [
    { key: 'name', label: 'Name', sortValue: (p) => `${p.lastName} ${p.firstName}`, render: (p) => <span className="font-semibold">{p.firstName} {p.lastName}</span> },
    { key: 'state', label: 'St', sortValue: (p) => p.state, render: (p) => p.state.toUpperCase() },
    { key: 'age', label: 'Age', sortValue: (p) => p.age, className: 'text-right' },
    {
      key: 'office', label: 'Office',
      sortValue: (p) => p.currentOffice?.type ?? '',
      render: (p) => p.currentOffice ? <span className="text-xs">{p.currentOffice.type}</span> : <span className="text-slate-400">—</span>,
    },
    { key: 'pv', label: 'PV', sortValue: (p) => p.pvCache, render: (p) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</span>, className: 'text-right' },
    { key: 'ideology', label: 'Ideology', sortValue: (p) => IDEOLOGY_ORDER.indexOf(p.ideology), render: (p) => <span className="text-xs">{p.ideology}</span> },
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
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold">Kingmakers & Protégés</h2>
        <div className="flex items-center gap-2">
          <span className="rounded px-1.5 py-0.5 border text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Kingmakers: {kingmakers.length} · Bonded: {bondedCount}
          </span>
          <PartyBadge party={viewedFaction?.partyId ?? null} />
          <select
            value={activeFactionId}
            onChange={(e) => { setViewFactionId(e.target.value); setPicking(null); }}
            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          >
            {factionOptions.map((f) => (
              <option key={f.id} value={f.id}>{f.id === playerFactionId ? `${f.name} (you)` : f.name}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {isPlayerView
          ? 'Pair each Kingmaker with a same-state protégé. Bonded protégés develop faster on their career track and resist poaching at 0.5×.'
          : `View ${viewedFaction?.name ?? 'this faction'}'s Kingmakers and current protégés.`}
        {phaseLocked && <span className="text-amber-600 dark:text-amber-400"> Mentorship is locked until the Kingmakers & Protégés phase.</span>}
      </p>

      <details className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
        <summary className="cursor-pointer font-semibold">How mentorship works</summary>
        <div className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p>
            A politician becomes a <span className="font-semibold">Kingmaker</span> when their Command reaches the era's threshold:{' '}
            {Object.entries(KINGMAKER_RULES.commandGateByScenario).map(([sc, gate]) => `${sc} → ${gate}`).join(' · ')}{' '}
            (default {KINGMAKER_RULES.commandGateDefault}). After each draft, every faction is topped up to at least{' '}
            <span className="font-semibold">{KINGMAKER_RULES.factionFloor}</span> Kingmakers by anointing higher-PV members.
          </p>
          <p>
            <span className="font-semibold">Eligible protégés</span> are same-state, same-faction, alive, under{' '}
            {KINGMAKER_RULES.protegeMaxAge}, holding no office or only{' '}
            {KINGMAKER_RULES.eligibleProtegeOffices.join(' / ')}, with PV ≥ {KINGMAKER_RULES.protegeMinPv}, and not already mentored.
            Each Kingmaker takes one protégé; each protégé has one mentor.
          </p>
          <p>
            <span className="font-semibold">Bonded protégés</span> get one extra skill roll per career-track threshold
            (cap-respecting at skill 5) and rivals poach them at <span className="font-semibold">×{KINGMAKER_RULES.poachResistance}</span>{' '}
            (see Faction Conversions).
          </p>
          <p>
            A bond <span className="font-semibold">graduates</span> when EITHER the protégé reaches{' '}
            {KINGMAKER_RULES.graduationOffices.join(' / ')} OR {KINGMAKER_RULES.graduationYears} years pass. The protégé's
            legacy roll: {pct(KINGMAKER_RULES.graduationOdds.command)}% +1 command (cap {KINGMAKER_RULES.commandCap}) ·{' '}
            {pct(KINGMAKER_RULES.graduationOdds.trait)}% inherit a positive mentor trait ·{' '}
            {pct(KINGMAKER_RULES.graduationOdds.both)}% both. The mentor banks a one-time Leadership trait (if unheld) and frees up.
          </p>
          <p>
            Bonds break on death, retirement, or defection of either party. Same-state is checked only at assignment — bonds
            persist if a protégé later relocates.
          </p>
        </div>
      </details>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700">
          <h3 className="font-semibold text-sm">Recent mentorship {viewedFaction ? `— ${viewedFaction.name}` : ''}</h3>
        </div>
        {feed.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400">No mentorships yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/50 text-xs">
            {feed.map((e, i) => (
              <li key={`${e.politicianId}-${e.year}-${i}`} className="px-3 py-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 font-mono">{e.year}</span>
                <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px] font-semibold">{KIND_LABELS[e.kind]}</span>
                {e.kind === 'anointed' && (
                  <>
                    <span className="font-semibold">{polName(e.politicianId)}</span>
                    {e.reason === 'draft-floor' && <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px]">{REASON_LABELS[e.reason]}</span>}
                  </>
                )}
                {(e.kind === 'bonded' || e.kind === 'graduated' || e.kind === 'dissolved') && (
                  <span className="text-slate-500">{polName(e.mentorId)} → {polName(e.protegeId)}</span>
                )}
                {e.trigger && (
                  <span className="rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 text-[10px] font-semibold">
                    {TRIGGER_LABELS[e.trigger]}
                  </span>
                )}
                {e.reason && e.reason !== 'draft-floor' && (
                  <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-1 text-[10px]">{REASON_LABELS[e.reason]}</span>
                )}
                {e.actor === 'player' && (
                  <span className="rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1 text-[10px] font-semibold">You</span>
                )}
                {e.actor === 'cpu' && (
                  <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px]">CPU</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {kingmakers.length === 0 ? (
        <p className="text-sm text-slate-500">
          {isPlayerView
            ? `No Kingmakers in your faction — anointed when a politician reaches Command ${eraGate}.`
            : 'This faction has no active Kingmakers.'}
        </p>
      ) : (
        <div className="space-y-2">
          {kingmakers.map((k) => {
            const protege = k.protegeId ? snapshot.politicians.find((p) => p.id === k.protegeId) : null;
            const bondYears = protege?.bondedYear !== undefined ? g.year - protege.bondedYear : 0;
            const assignTitle = assignDisabledTitle(k);
            const releaseTitle = releaseDisabledTitle();
            return (
              <div key={k.id} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-semibold">{k.firstName} {k.lastName}</span>
                    <span className="text-xs text-slate-500"> · Cmd {k.command} · {k.state.toUpperCase()} · PV {k.pvCache}</span>
                  </div>
                  {isPlayerView && (
                    protege ? (
                      <button
                        disabled={!!releaseTitle}
                        title={releaseTitle}
                        onClick={() => releaseProtege(k.id)}
                        className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Release
                      </button>
                    ) : (
                      <button
                        disabled={!!assignTitle}
                        title={assignTitle}
                        onClick={() => setPicking(picking?.kingmakerId === k.id ? null : { kingmakerId: k.id })}
                        className="rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      >
                        {picking?.kingmakerId === k.id ? 'Close' : 'Assign protégé'}
                      </button>
                    )
                  )}
                </div>
                <div className="mt-1 text-xs">
                  <span className="text-slate-500">Protégé: </span>
                  {protege ? (
                    <span>
                      <span className="font-semibold">{protege.firstName} {protege.lastName}</span>
                      <span className="text-slate-500"> · {protege.state.toUpperCase()} · Cmd {protege.command}</span>
                      {protege.bondedYear !== undefined && (
                        <span className="ml-2 rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px]">
                          {Math.min(KINGMAKER_RULES.graduationYears, bondYears)}/{KINGMAKER_RULES.graduationYears} yrs
                        </span>
                      )}
                      {protege.currentOffice && (KINGMAKER_RULES.eligibleProtegeOffices as readonly string[]).includes(protege.currentOffice.type) && (
                        <span className="ml-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 text-[10px]">
                          Senate-track
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-400">— None —</span>
                  )}
                </div>
                {isPlayerView && picking?.kingmakerId === k.id && !protege && (
                  <div className="mt-2 border-t border-slate-200 dark:border-slate-700/50 pt-2">
                    <p className="text-xs text-slate-500 mb-1">
                      Eligible same-state protégés (sub-Senate, age &lt; {KINGMAKER_RULES.protegeMaxAge}, PV ≥ {KINGMAKER_RULES.protegeMinPv}):
                    </p>
                    <ProtegePicker
                      kingmaker={k}
                      columns={candidateColumns}
                      onAssign={async (c) => { await assignProtege(k.id, c.id); setPicking(null); }}
                      onCancel={() => setPicking(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProtegePicker({ kingmaker, columns, onAssign, onCancel }: {
  kingmaker: Politician;
  columns: Column<Politician>[];
  onAssign: (c: Politician) => void;
  onCancel: () => void;
}): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const candidates = protegeCandidates(snapshot, kingmaker.id);
  if (candidates.length === 0) {
    return (
      <div className="text-xs text-slate-400">
        No eligible same-state candidates.
        <button onClick={onCancel} className="ml-2 underline">Cancel</button>
      </div>
    );
  }
  const columnsWithAction: Column<Politician>[] = [
    ...columns,
    {
      key: 'action', label: 'Action',
      render: (c) => (
        <button
          onClick={() => onAssign(c)}
          className="rounded bg-blue-600 text-white px-2 py-0.5 text-xs font-semibold hover:bg-blue-700"
        >
          Assign
        </button>
      ),
    },
  ];
  return (
    <div className="space-y-2">
      <SortableTable rows={candidates} columns={columnsWithAction} rowKey={(p) => p.id} initialSort={{ key: 'pv', dir: 'desc' }} />
      <button onClick={onCancel} className="text-xs text-slate-500 underline">Cancel</button>
    </div>
  );
}
