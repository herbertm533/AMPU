import { useMemo, useState } from 'react';
import { useGame } from '../state/GameContext';
import type { NationalMeters, MeterKey } from '../types';
import { PHASE_SEQUENCE, shouldRunPhase } from '../phases';

const METER_LABEL: Record<MeterKey, string> = {
  revenue: 'Revenue',
  economic: 'Economic',
  military: 'Military',
  domestic: 'Domestic',
  honest: 'Honesty',
  quality: 'Quality',
  planet: 'Planet',
};

const INPUT_PHASES = new Set([
  '2.1.1', // draft
  '2.4.3', // era events
  '2.9.6', // CC builder
]);

export function EndOfHalfTermPage(): JSX.Element {
  const { snapshot, advance } = useGame();
  const [showAllEvents, setShowAllEvents] = useState(false);

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const summaries = g.halfTermSummaries ?? [];
  const head = summaries.length > 0 ? summaries[summaries.length - 1] : null;
  const isFirstTurn = summaries.length === 1;

  const startYear = head?.startYear ?? g.year;
  const endYear = head?.endYear ?? g.year;

  const meterKeys = useMemo(() => Object.keys(METER_LABEL) as MeterKey[], []);

  const pvDeltas = useMemo(() => {
    if (!head) return [] as { politicianId: string; delta: number }[];
    const deadIds = new Set([...head.deaths.map((d) => d.politicianId), ...head.retirements.map((r) => r.politicianId)]);
    const out: { politicianId: string; delta: number }[] = [];
    for (const p of snapshot.politicians) {
      if (deadIds.has(p.id)) continue;
      if (p.deathYear || p.retiredYear) continue;
      const start = head.pvSnapshotStart[p.id];
      if (start == null) continue;
      const delta = p.pvCache - start;
      if (delta !== 0) out.push({ politicianId: p.id, delta });
    }
    return out;
  }, [head, snapshot.politicians]);

  const topWinners = useMemo(() => [...pvDeltas].sort((a, b) => b.delta - a.delta).slice(0, 5), [pvDeltas]);
  const topLosers = useMemo(() => [...pvDeltas].sort((a, b) => a.delta - b.delta).slice(0, 5), [pvDeltas]);

  const factionRows = useMemo(() => {
    if (!head) return [] as { id: string; name: string; start: number; end: number }[];
    const ids = new Set([...Object.keys(head.factionSizesStart), ...Object.keys(head.factionSizesEnd)]);
    return [...ids].map((id) => ({
      id,
      name: snapshot.factions.find((f) => f.id === id)?.name ?? id,
      start: head.factionSizesStart[id] ?? 0,
      end: head.factionSizesEnd[id] ?? 0,
    }));
  }, [head, snapshot.factions]);

  const maxFactionEnd = Math.max(1, ...factionRows.map((r) => r.end));

  const events = useMemo(() => {
    if (!head) return [] as { text: string }[];
    const out: { text: string }[] = [];
    for (const m of head.milestones) {
      out.push({ text: m.text });
    }
    for (const er of head.eraEventsResolved) {
      const log = snapshot.events.find(
        (e) => e.category === 'event' && e.meta?.eraEvent === true
          && (e.meta?.templateId === er.templateId || e.id === er.eraEventId),
      );
      const tail = er.aiResolved ? ' (auto)' : '';
      out.push({ text: log ? `${log.text}${tail}` : `Era event resolved${tail}` });
    }
    for (const billId of head.billsPassed) {
      const bill = snapshot.legislation.find((b) => b.id === billId);
      if (bill) out.push({ text: `Passed: "${bill.title}"` });
    }
    for (const billId of head.billsFailed) {
      const bill = snapshot.legislation.find((b) => b.id === billId);
      if (bill) out.push({ text: `Failed: "${bill.title}"` });
    }
    const dn = head.deaths.length;
    const rn = head.retirements.length;
    if (dn > 0 || rn > 0) {
      out.push({ text: `${dn} died, ${rn} retired this half-term.` });
    }
    return out;
  }, [head, snapshot.events, snapshot.legislation]);

  const eventsShown = showAllEvents ? events : events.slice(0, 10);
  const eventsExtra = Math.max(0, events.length - 10);

  const nextTurnPhases = useMemo(() => {
    const nextYear = g.year + 2;
    const out: { id: string; label: string }[] = [];
    for (const p of PHASE_SEQUENCE) {
      if (!INPUT_PHASES.has(p.id)) continue;
      if (shouldRunPhase(p.id, nextYear, { ...g, year: nextYear })) {
        out.push({ id: p.id, label: p.label });
      }
    }
    return out;
  }, [g]);

  const polName = (id: string): string => {
    const p = snapshot.politicians.find((pp) => pp.id === id);
    return p ? `${p.firstName} ${p.lastName} (${p.state.toUpperCase()})` : id;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">End of Half-Term — {startYear}-{endYear}</h2>
        {isFirstTurn && (
          <p className="text-xs text-slate-500 mt-1">First half-term complete.</p>
        )}
      </div>

      <section className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="font-semibold text-sm mb-2">National meters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {meterKeys.map((k) => {
            const start = (head?.metersStart ?? g.meters)[k];
            const end = (head?.metersEnd ?? g.meters)[k];
            const delta = end - start;
            const cls = delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : delta < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500';
            const arrow = delta > 0 ? '▲' : delta < 0 ? '▼' : '·';
            return (
              <div key={k} className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm">
                <span className="font-medium">{METER_LABEL[k]}</span>
                <span className="font-mono text-xs">
                  {start.toFixed(1)} → {end.toFixed(1)}{' '}
                  <span className={cls}>{arrow} {delta >= 0 ? '+' : ''}{delta.toFixed(1)}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="font-semibold text-sm mb-2">Faction strength</h3>
        <div className="space-y-1">
          {factionRows.map((r) => {
            const delta = r.end - r.start;
            const cls = delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : delta < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500';
            return (
              <div key={r.id} className="flex items-center gap-2 text-xs">
                <div className="w-40 truncate font-medium">{r.name}</div>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded h-3 overflow-hidden">
                  <div className="h-3 bg-blue-500" style={{ width: `${(r.end / maxFactionEnd) * 100}%` }} />
                </div>
                <div className="w-32 text-right font-mono">
                  {r.start} → {r.end} <span className={cls}>({delta >= 0 ? '+' : ''}{delta})</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <h3 className="font-semibold text-sm mb-2">Top PV winners</h3>
          {topWinners.length === 0 ? (
            <p className="text-xs text-slate-500">No PV changes recorded.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {topWinners.map((w) => (
                <li key={w.politicianId} className="flex justify-between">
                  <span>{polName(w.politicianId)}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">+{w.delta}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <h3 className="font-semibold text-sm mb-2">Top PV losers</h3>
          {topLosers.length === 0 ? (
            <p className="text-xs text-slate-500">No PV changes recorded.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {topLosers.map((w) => (
                <li key={w.politicianId} className="flex justify-between">
                  <span>{polName(w.politicianId)}</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">{w.delta}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="font-semibold text-sm mb-2">Key events</h3>
        {events.length === 0 ? (
          <p className="text-xs text-slate-500">No major events this half-term.</p>
        ) : (
          <>
            <ul className="text-sm space-y-1 list-disc pl-5">
              {eventsShown.map((e, i) => (<li key={i}>{e.text}</li>))}
            </ul>
            {eventsExtra > 0 && !showAllEvents && (
              <button onClick={() => setShowAllEvents(true)} className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">+{eventsExtra} more</button>
            )}
          </>
        )}
      </section>

      <section className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="font-semibold text-sm mb-2">Next turn — {g.year + 2}</h3>
        {nextTurnPhases.length === 0 ? (
          <p className="text-xs text-slate-500">No player-input phases queued.</p>
        ) : (
          <ul className="text-sm space-y-1 list-disc pl-5">
            {nextTurnPhases.map((p) => (<li key={p.id}>{p.label} ({p.id})</li>))}
          </ul>
        )}
      </section>

      <button onClick={() => advance()} className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold">
        Continue to {g.year + 2}
      </button>
    </div>
  );
}
