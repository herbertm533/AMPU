import { useGame } from '../state/GameContext';
import { EraTimeline } from './EraTimeline';
import { ERA_GRAPH_1772 } from '../data/eraEvents1772';
import type { Ideology, EventEntry } from '../types';
import { IDEOLOGY_ORDER } from '../types';

// Historian's verbatim historical-contrast lines, keyed by terminal templateId.
// Per F5: do not paraphrase. Source: docs/research/1772-ux-polish-pass-historical-context.md.
const CONTRAST_LINES: Record<string, string> = {
  lost_war: "Historically, the colonies declared independence on July 4, 1776, and the Continental Army's victory at Yorktown (October 1781) forced Britain to the negotiating table; Britain formally recognized U.S. sovereignty at the Treaty of Paris, signed September 3, 1783. In your timeline, the Revolution failed and the colonies were reabsorbed into the British Empire.",
  dominion_autonomy: "Historically, Congress rejected Lord North's Conciliatory Resolution (1775) and the Carlisle Peace Commission (1778), insisting on full independence; Britain conceded it at the Treaty of Paris (1783). In your timeline, the colonies settled for self-rule within the British Empire — independence was never declared.",
  confederation_remains: "Historically, the Annapolis Convention's 1786 report led Congress to call a Constitutional Convention; delegates met in Philadelphia from May 25 to September 17, 1787, and the Constitution was ratified when New Hampshire became the ninth state on June 21, 1788, replacing the Articles of Confederation. In your timeline, no convention was called and the Confederation endured.",
  __fallback: "Historically, the United States declared independence in 1776, won the Revolutionary War in 1783, replaced the Articles of Confederation with the Constitution in 1787–88, and inaugurated George Washington as first President in 1789. In your timeline, the story remained unfinished.",
};

export function GameOverScreen(): JSX.Element {
  const { snapshot, resetGame, startNewGame, exportSave } = useGame();
  if (!snapshot) return <div />;
  const { game, politicians, factions, events } = snapshot;
  const ended = game.gameEnded;
  const playerFaction = factions.find((f) => f.id === game.playerFactionId) ?? null;
  const playerParty = playerFaction?.partyId ?? '';

  const livingFactionMembers = politicians.filter(
    (p) => p.factionId === game.playerFactionId && !p.deathYear && !p.retiredYear,
  );
  const factionPvTotal = livingFactionMembers.reduce((s, p) => s + p.pvCache, 0);

  const top5Living = [...livingFactionMembers].sort((a, b) => b.pvCache - a.pvCache).slice(0, 5);

  const lostMembers = politicians
    .filter((p) => p.factionId === game.playerFactionId && (p.deathYear || p.retiredYear))
    .sort((a, b) => b.pvCache - a.pvCache)
    .slice(0, 5);

  const startingMemberCount = (() => {
    const first = game.halfTermSummaries?.[0];
    if (first) return first.factionSizesStart[game.playerFactionId] ?? livingFactionMembers.length;
    return livingFactionMembers.length;
  })();

  const ideologyCounts: Record<Ideology, number> = {
    'LW Populist': 0, 'Progressive': 0, 'Liberal': 0, 'Moderate': 0,
    'Conservative': 0, 'Traditionalist': 0, 'RW Populist': 0,
  };
  for (const p of livingFactionMembers) ideologyCounts[p.ideology]++;
  const maxIdeoCount = Math.max(1, ...Object.values(ideologyCounts));

  const playerEraEvents = events.filter(
    (e: EventEntry) => e.category === 'event' && e.meta?.eraEvent === true && e.meta?.aiResolved === false,
  );

  const altHistoryNodes = ERA_GRAPH_1772.filter(
    (n) => n.realEvent === false && game.eraEventsCompleted.includes(n.templateId),
  );

  const onNewGame = async (): Promise<void> => {
    await resetGame();
    window.location.reload();
  };

  const onReplay = async (): Promise<void> => {
    const sc = game.scenarioId === '1772' || game.scenarioId === '1856' ? game.scenarioId : '1856';
    await startNewGame(game.playerFactionId, sc);
  };

  const onExport = async (): Promise<void> => {
    const json = await exportSave();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ampu-save-${game.year}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const contrastLine = ended ? (CONTRAST_LINES[ended.templateId] ?? CONTRAST_LINES.__fallback) : CONTRAST_LINES.__fallback;

  return (
    <div className="h-full overflow-auto bg-slate-900 text-slate-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
        <header className="rounded-lg border border-slate-700 bg-slate-800 p-6 text-center">
          <div className="text-xs uppercase tracking-widest text-amber-400">Campaign Over — {ended?.year}</div>
          <h1 className="mt-2 text-3xl font-bold">{ended?.reason ?? 'The End'}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Played as {playerFaction?.name ?? game.playerFactionId} ({playerParty}) from {game.startYear} to {game.year}.
          </p>
        </header>

        <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <h2 className="font-semibold mb-3">Final faction snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Faction PV total</div>
              <div className="text-2xl font-bold text-emerald-400">{factionPvTotal}</div>
              <div className="text-xs text-slate-500 mt-2">
                {livingFactionMembers.length} living members
                {' · '}started with {startingMemberCount}
                {' · '}delta {livingFactionMembers.length - startingMemberCount >= 0 ? '+' : ''}{livingFactionMembers.length - startingMemberCount}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Top 5 by PV</div>
              {top5Living.length === 0 ? (
                <p className="text-xs text-slate-500">No living members.</p>
              ) : (
                <ul className="text-sm space-y-0.5">
                  {top5Living.map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span>{p.firstName} {p.lastName} ({p.state.toUpperCase()})</span>
                      <span className="font-mono text-emerald-400">{p.pvCache}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Ideology alignment</div>
            <div className="space-y-1">
              {IDEOLOGY_ORDER.map((ideo) => (
                <div key={ideo} className="flex items-center gap-2 text-xs">
                  <div className="w-28 text-slate-400">{ideo}</div>
                  <div className="flex-1 bg-slate-700 rounded h-3 overflow-hidden">
                    <div className="h-3 bg-blue-500" style={{ width: `${(ideologyCounts[ideo] / maxIdeoCount) * 100}%` }} />
                  </div>
                  <div className="w-6 text-right font-mono">{ideologyCounts[ideo]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Key losses</div>
            {lostMembers.length === 0 ? (
              <p className="text-xs text-slate-500">No deaths or retirements recorded.</p>
            ) : (
              <ul className="text-sm space-y-0.5">
                {lostMembers.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <span>{p.firstName} {p.lastName} ({p.state.toUpperCase()})</span>
                    <span className="font-mono text-slate-400">{p.pvCache} PV · {p.deathYear ? `died ${p.deathYear}` : `retired ${p.retiredYear}`}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <h2 className="font-semibold mb-3">Your faction&apos;s defining decisions</h2>
          {playerEraEvents.length === 0 ? (
            <p className="text-sm italic text-slate-400">Your faction&apos;s voice was rarely heard in the great debates.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {playerEraEvents.map((e) => (
                <li key={e.id} className="border-b border-slate-700/50 py-1">
                  <span className="font-mono text-xs text-slate-500 mr-2">{e.year}</span>
                  {e.text}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <h2 className="font-semibold mb-3">Era timeline</h2>
          <EraTimeline snapshot={snapshot} />
          {game.scenarioId === '1772' && (
            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Alt-history branches taken</div>
              {altHistoryNodes.length === 0 ? (
                <p className="text-xs text-slate-500">None — your campaign followed the historical spine.</p>
              ) : (
                <ul className="text-sm space-y-0.5">
                  {altHistoryNodes.map((n) => {
                    const log = events.find((e) => e.category === 'event' && e.meta?.templateId === n.templateId);
                    return (
                      <li key={n.templateId} className="text-slate-300">
                        {log ? log.text : n.templateId}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <h2 className="font-semibold mb-3">Historical contrast</h2>
          <blockquote className="italic border-l-4 border-amber-500 pl-4 py-2 text-slate-300">
            {contrastLine}
          </blockquote>
        </section>

        <section className="flex flex-wrap justify-center gap-3 pb-6">
          <button
            onClick={onNewGame}
            className="rounded bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-sm font-semibold text-white"
          >
            New Game
          </button>
          <button
            onClick={onReplay}
            className="rounded bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white"
          >
            Replay Same Scenario
          </button>
          <button
            onClick={onExport}
            className="rounded border border-slate-600 hover:bg-slate-700 px-5 py-2 text-sm font-semibold text-slate-200"
          >
            Export Save
          </button>
        </section>
      </div>
    </div>
  );
}
