import { useState } from 'react';
import { useGame } from '../state/GameContext';
import type { EraEvent } from '../types';
import { EffectChips, PredicateChips, DeciderBadge, nodePreconditionFor } from './EventChips';

export function EraEventModal({ event, mode = 'pick' }: { event: EraEvent; mode?: 'pick' | 'acknowledge' }): JSX.Element {
  const { chooseEraResponse, acknowledgeEraEvent, snapshot } = useGame();
  const [selected, setSelected] = useState<string | null>(null);

  const precondition = nodePreconditionFor(event);
  const showPrelude = snapshot?.game.scenarioId === '1772' && precondition != null;

  if (mode === 'acknowledge') {
    const chosen = event.responses.find((r) => r.id === event.chosenResponseId);

    // CP2 deviation #1: when an AI-CC-president resolves an event whose faction
    // isn't the player's, surface the president's name as the prefix.
    let chosenByLabel = 'An auto-resolved decision:';
    if (event.decider === 'cc-president' && snapshot) {
      const ccPresId = snapshot.game.continentalCongress?.presidentId;
      const pres = ccPresId ? snapshot.politicians.find((p) => p.id === ccPresId) : null;
      const playerFactionId = snapshot.game.playerFactionId;
      if (pres && pres.factionId && pres.factionId !== playerFactionId) {
        const factionName = snapshot.factions.find((f) => f.id === pres.factionId)?.name ?? pres.factionId;
        chosenByLabel = `CC President ${pres.firstName} ${pres.lastName} (${factionName}) chose:`;
      } else if (pres && pres.factionId === playerFactionId) {
        chosenByLabel = `CC President ${pres.firstName} ${pres.lastName} chose:`;
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 max-h-[90vh] flex flex-col overflow-hidden">
          <div className="border-b border-slate-300 dark:border-slate-700 px-4 py-3 bg-amber-50 dark:bg-amber-900/30">
            <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">Era Event (Auto) — {event.year}</div>
            <h2 className="text-lg font-bold">{event.title}</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{event.description}</p>
            <p className="text-xs text-slate-500 mt-1"><DeciderBadge event={event} /></p>
          </div>
          {showPrelude && (
            <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-slate-800/50">
              <PredicateChips predicate={precondition} />
            </div>
          )}
          <div className="overflow-auto flex-1 p-3 space-y-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">{chosenByLabel}</div>
            {chosen ? (
              <div className="rounded border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-3">
                <div className="font-semibold">{chosen.label}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{chosen.description}</div>
                <div className="mt-2">
                  <EffectChips effect={chosen.effect} year={event.year} />
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">No response recorded.</div>
            )}
          </div>
          <div className="border-t border-slate-300 dark:border-slate-700 p-3 flex justify-end gap-2">
            <button
              onClick={() => acknowledgeEraEvent()}
              className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="border-b border-slate-300 dark:border-slate-700 px-4 py-3 bg-amber-50 dark:bg-amber-900/30">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">Era Event — {event.year}</div>
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{event.description}</p>
          <p className="text-xs text-slate-500 mt-1"><DeciderBadge event={event} /></p>
        </div>
        {showPrelude && (
          <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-slate-800/50">
            <PredicateChips predicate={precondition} />
          </div>
        )}
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
                <div className="mt-2">
                  <EffectChips effect={resp.effect} year={event.year} />
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
