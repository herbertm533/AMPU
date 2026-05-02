import { useState } from 'react';
import { useGame } from '../state/GameContext';
import type { EraEvent, NationalMeters, Ideology, PartyId } from '../types';

const METER_LABELS: Record<keyof NationalMeters, string> = {
  revenue: 'Revenue',
  economic: 'Economy',
  military: 'Military',
  domestic: 'Domestic Stability',
  honest: 'Honest Govt',
  quality: 'Quality of Life',
  planet: 'Planet',
};

function fmtDelta(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

export function EraEventModal({ event }: { event: EraEvent }): JSX.Element {
  const { chooseEraResponse } = useGame();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="border-b border-slate-300 dark:border-slate-700 px-4 py-3 bg-amber-50 dark:bg-amber-900/30">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">Era Event — {event.year}</div>
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{event.description}</p>
          <p className="text-xs text-slate-500 mt-1">Decided by: <span className="font-semibold">{event.decider}</span></p>
        </div>
        <div className="overflow-auto flex-1 p-3 space-y-2">
          {event.responses.map((resp) => {
            const isSel = selected === resp.id;
            return (
              <button
                key={resp.id}
                onClick={() => setSelected(resp.id)}
                className={`w-full text-left rounded border p-3 ${
                  isSel
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                }`}
              >
                <div className="font-semibold">{resp.label}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{resp.description}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {resp.effect.meters && Object.entries(resp.effect.meters).map(([k, v]) => (
                    <span key={k} className={`rounded px-1.5 py-0.5 ${(v as number) > 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                      {METER_LABELS[k as keyof NationalMeters]} {fmtDelta(v as number)}
                    </span>
                  ))}
                  {resp.effect.partyPreference != null && (
                    <span className={`rounded px-1.5 py-0.5 ${resp.effect.partyPreference > 0 ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                      Party Pref {fmtDelta(resp.effect.partyPreference)}
                    </span>
                  )}
                  {resp.effect.enthusiasm?.map((e: { ideology: Ideology; party: PartyId; delta: number }, i) => (
                    <span key={i} className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5">
                      {e.ideology}→{e.party === 'BLUE' ? 'D' : 'R'} {fmtDelta(e.delta)}
                    </span>
                  ))}
                  {resp.effect.interestGroups?.map((g: { id: string; delta: number }, i) => (
                    <span key={i} className={`rounded px-1.5 py-0.5 ${g.delta > 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                      {g.id} {fmtDelta(g.delta)}
                    </span>
                  ))}
                  {resp.effect.startWar && (
                    <span className="rounded bg-rose-300 text-rose-900 px-1.5 py-0.5 font-bold">⚔ War: {resp.effect.startWar.name}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <div className="border-t border-slate-300 dark:border-slate-700 p-3 flex justify-end gap-2">
          <button
            disabled={!selected}
            onClick={() => selected && chooseEraResponse(event.id, selected)}
            className="rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white px-4 py-1.5 text-sm font-semibold"
          >
            Confirm Response
          </button>
        </div>
      </div>
    </div>
  );
}
