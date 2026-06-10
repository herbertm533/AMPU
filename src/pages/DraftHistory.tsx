import { useMemo, useState } from 'react';
import { useGame } from '../state/GameContext';
import { DraftTabs } from '../components/DraftTabs';
import { OFFICE_PRESTIGE, computePV } from '../pv';
import type { DraftHistoryYear, Politician } from '../types';

export function DraftHistory(): JSX.Element {
  const { snapshot } = useGame();
  const history: DraftHistoryYear[] = useMemo(() => {
    const h = snapshot?.game.draftHistory ?? [];
    return [...h].sort((a, b) => a.year - b.year);
  }, [snapshot?.game.draftHistory]);

  const defaultYear = history.length > 0 ? history[history.length - 1].year : null;
  const [selectedYear, setSelectedYear] = useState<number | null>(defaultYear);

  if (!snapshot) return <div />;

  if (history.length === 0) {
    return (
      <div>
        <DraftTabs />
        <h2 className="text-xl font-bold mb-2">Draft History</h2>
        <p className="text-sm text-slate-500">No drafts have been held yet.</p>
      </div>
    );
  }

  const activeYear = selectedYear ?? defaultYear!;
  const yearEntry = history.find((y) => y.year === activeYear) ?? history[history.length - 1];
  const playerFactionId = snapshot.game.playerFactionId;
  const polById = new Map(snapshot.politicians.map((p) => [p.id, p] as const));
  const factionName = (id: string): string => snapshot.factions.find((f) => f.id === id)?.name ?? id;

  // Summary stats
  const drafted: Politician[] = yearEntry.picks.map((p) => polById.get(p.politicianId)).filter((p): p is Politician => !!p);
  const firstPickEntry = yearEntry.picks.find((p) => p.pickNumber === 1);
  const firstPickPolitician = firstPickEntry ? polById.get(firstPickEntry.politicianId) : undefined;
  const highestPv = drafted.length > 0 ? drafted.reduce((best, p) => (p.pvCache > best.pvCache ? p : best), drafted[0]) : null;
  const officeHolders = drafted.filter((p) => p.currentOffice != null);
  const presidents = drafted.filter((p) => p.currentOffice?.type === 'President');
  const cabinet = drafted.filter((p) => {
    const t = p.currentOffice?.type;
    if (!t || t === 'President' || t === 'VicePresident') return false;
    const w = OFFICE_PRESTIGE[t] ?? 0;
    return w >= 18 && w <= 22;
  });
  const deceased = drafted.filter((p) => p.deathYear != null);

  const goPrev = (): void => {
    const idx = history.findIndex((y) => y.year === activeYear);
    if (idx > 0) setSelectedYear(history[idx - 1].year);
  };
  const goNext = (): void => {
    const idx = history.findIndex((y) => y.year === activeYear);
    if (idx >= 0 && idx < history.length - 1) setSelectedYear(history[idx + 1].year);
  };

  const exportYear = (): void => {
    const payload = {
      year: yearEntry.year,
      picks: yearEntry.picks.map((p) => {
        const pol = polById.get(p.politicianId);
        return {
          pickNumber: p.pickNumber,
          round: p.round,
          factionId: p.factionId,
          factionName: factionName(p.factionId),
          politicianId: p.politicianId,
          politicianName: pol ? `${pol.firstName} ${pol.lastName}` : null,
          state: pol?.state ?? null,
          ideology: pol?.ideology ?? null,
        };
      }),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `draft-history-${yearEntry.year}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <DraftTabs />
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Draft History — {activeYear}</h2>
          <button onClick={goPrev} disabled={history[0].year === activeYear} className="rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm disabled:opacity-40">‹</button>
          <button onClick={goNext} disabled={history[history.length - 1].year === activeYear} className="rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm disabled:opacity-40">›</button>
          <select
            value={activeYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
          >
            {history.map((y) => <option key={y.year} value={y.year}>{y.year}</option>)}
          </select>
        </div>
        <button onClick={exportYear} className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm">Export class (JSON)</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <SummaryCard label="1st Pick" value={firstPickPolitician ? `${firstPickPolitician.firstName} ${firstPickPolitician.lastName}` : '—'} />
        <SummaryCard label="Highest PV" value={highestPv ? `${highestPv.firstName} ${highestPv.lastName} (${highestPv.pvCache})` : '—'} />
        <SummaryCard label="In Office" value={`${officeHolders.length}`} />
        <SummaryCard label="Presidents" value={`${presidents.length}`} />
        <SummaryCard label="Cabinet" value={`${cabinet.length}`} />
        <SummaryCard label="Deceased" value={`${deceased.length}`} />
      </div>

      <p className="text-xs text-slate-500 mb-2">Your picks are highlighted in emerald. Cabinet count is best-effort from current office; pre-existing legacy drafts have approximated pick order.</p>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr className="border-b border-slate-300 dark:border-slate-700">
              <th colSpan={3} className="px-2 py-1 text-left text-[10px] uppercase tracking-wide text-slate-500"></th>
              <th colSpan={11} className="px-2 py-1 text-center text-[10px] uppercase tracking-wide text-slate-500 border-l border-slate-300 dark:border-slate-700">At Draft</th>
              <th colSpan={3} className="px-2 py-1 text-center text-[10px] uppercase tracking-wide text-slate-500 border-l border-slate-300 dark:border-slate-700">Current</th>
            </tr>
            <tr>
              <th className="px-1.5 py-1.5 text-left">Pick</th>
              <th className="px-1.5 py-1.5 text-left">Faction</th>
              <th className="px-1.5 py-1.5 text-left">Name</th>
              <th className="px-1.5 py-1.5 text-left border-l border-slate-300 dark:border-slate-700">St</th>
              <th className="px-1.5 py-1.5 text-left">Ideol.</th>
              <th className="px-1.5 py-1.5 text-right">Age</th>
              <th className="px-1.5 py-1.5 text-right">PV</th>
              <th className="px-1.5 py-1.5 text-right">Adm</th>
              <th className="px-1.5 py-1.5 text-right">Leg</th>
              <th className="px-1.5 py-1.5 text-right">Jud</th>
              <th className="px-1.5 py-1.5 text-right">Mil</th>
              <th className="px-1.5 py-1.5 text-right">Gov</th>
              <th className="px-1.5 py-1.5 text-right">Bck</th>
              <th className="px-1.5 py-1.5 text-right">Cmd</th>
              <th className="px-1.5 py-1.5 text-right border-l border-slate-300 dark:border-slate-700">PV</th>
              <th className="px-1.5 py-1.5 text-left">Office</th>
              <th className="px-1.5 py-1.5 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {yearEntry.picks.map((pick) => {
              const p = polById.get(pick.politicianId);
              const isPlayerPick = pick.factionId === playerFactionId;
              const pvAtDraft = p ? computePvAtDraft(p, yearEntry.year, snapshot.game.year) : '—';
              const ageAtDraft = p ? Math.max(0, p.age - (snapshot.game.year - yearEntry.year)) : '—';
              return (
                <tr key={pick.pickNumber} className={`border-b border-slate-200 dark:border-slate-700/50 ${isPlayerPick ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                  <td className="px-1.5 py-1 font-mono">{pick.round}-{pick.pickNumber}</td>
                  <td className="px-1.5 py-1">{factionName(pick.factionId)}</td>
                  <td className="px-1.5 py-1 font-semibold">{p ? `${p.firstName} ${p.lastName}` : <span className="text-slate-400">(unknown)</span>}</td>
                  <td className="px-1.5 py-1 border-l border-slate-200 dark:border-slate-700/50">{p ? p.state.toUpperCase() : '—'}</td>
                  <td className="px-1.5 py-1">{p?.ideology ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right">{ageAtDraft}</td>
                  <td className="px-1.5 py-1 text-right">{pvAtDraft}</td>
                  <td className="px-1.5 py-1 text-right">{p?.skills.admin ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right">{p?.skills.legislative ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right">{p?.skills.judicial ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right">{p?.skills.military ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right">{p?.skills.governing ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right">{p?.skills.backroom ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right">{p?.command ?? '—'}</td>
                  <td className="px-1.5 py-1 text-right font-bold border-l border-slate-200 dark:border-slate-700/50">{p?.pvCache ?? '—'}</td>
                  <td className="px-1.5 py-1">{p?.currentOffice ? officeLabel(p.currentOffice.type) : <span className="text-slate-400">—</span>}</td>
                  <td className="px-1.5 py-1">{p ? statusLabel(p) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}

function computePvAtDraft(p: Politician, draftYear: number, currentYear: number): number {
  const ageAtDraft = Math.max(0, p.age - (currentYear - draftYear));
  const transient: Politician = {
    ...p,
    age: ageAtDraft,
    currentOffice: null,
    careerTrack: null,
    careerTrackYears: 0,
    pvCache: 0,
  };
  return computePV(transient);
}

function officeLabel(type: string): string {
  return type.replace(/([A-Z])/g, ' $1').trim();
}

function statusLabel(p: Politician): string {
  if (p.deathYear != null) return `Deceased (${p.deathYear})`;
  if (p.retiredYear != null) return `Retired (${p.retiredYear})`;
  if (p.currentOffice) return 'Active';
  return 'On bench';
}
