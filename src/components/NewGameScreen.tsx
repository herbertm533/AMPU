import { useState, useRef } from 'react';
import { useGame } from '../state/GameContext';
import { FACTIONS_1856 } from '../data/factions1856';
import { FACTIONS_1772 } from '../data/factions1772';

type ScenarioId = '1772' | '1856';

const SCENARIOS: { id: ScenarioId; year: number; title: string; description: string }[] = [
  {
    id: '1772',
    year: 1772,
    title: 'Era of Independence',
    description: 'Tensions between Great Britain and her American colonies have reached a boiling point. Guide your faction through revolution, war, and the birth of a new nation.',
  },
  {
    id: '1856',
    year: 1856,
    title: 'A House Divided',
    description: 'The nation fractures over slavery. Navigate the politics of the pre-Civil War era.',
  },
];

export function NewGameScreen(): JSX.Element {
  const { startNewGame, hasSave, loadGame, importSave, theme, toggleTheme } = useGame();
  const [scenarioId, setScenarioId] = useState<ScenarioId>('1856');
  const [factionId1856, setFactionId1856] = useState<string>(FACTIONS_1856[7].id); // Liberal Republicans default
  const [factionId1772, setFactionId1772] = useState<string>(FACTIONS_1772[0].id); // Sons of Liberty default
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    await importSave(text);
  };

  const onStart = (): void => {
    const factionId = scenarioId === '1772' ? factionId1772 : factionId1856;
    startNewGame(factionId, scenarioId);
  };

  const factions = scenarioId === '1772' ? FACTIONS_1772 : FACTIONS_1856;
  const currentFactionId = scenarioId === '1772' ? factionId1772 : factionId1856;
  const setFactionId = scenarioId === '1772' ? setFactionId1772 : setFactionId1856;

  return (
    <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-900 p-8 overflow-auto">
      <div className="w-full max-w-4xl rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">AMPU</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">American Political Universe — single-player political management sim</p>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
        </div>

        <div className="mb-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Lead one faction in a two-party American political system. Manage politicians, pass legislation,
            win elections, and shape the nation across decades of history.
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-3">Pick a Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`text-left rounded-lg border-2 p-4 transition ${
                scenarioId === s.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="text-xs uppercase tracking-wide text-slate-500">{s.year}</div>
              <div className="font-bold text-base">{s.title}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{s.description}</div>
              <div className="text-xs text-slate-500 mt-2">{(s.id === '1772' ? FACTIONS_1772 : FACTIONS_1856).length} factions</div>
            </button>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-2">Pick Your Faction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 mb-2">{scenarioId === '1772' ? 'Patriots / Anti-Federalist' : 'Democratic Party'} (Blue)</h3>
            <div className="space-y-1">
              {factions.filter((f) => f.partyId === 'BLUE').map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFactionId(f.id)}
                  className={`w-full text-left rounded px-3 py-2 text-sm border ${
                    currentFactionId === f.id
                      ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/40'
                      : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{f.personality}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase text-red-600 dark:text-red-400 mb-2">{scenarioId === '1772' ? 'Federalists' : 'Republican Party'} (Red)</h3>
            <div className="space-y-1">
              {factions.filter((f) => f.partyId === 'RED').map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFactionId(f.id)}
                  className={`w-full text-left rounded px-3 py-2 text-sm border ${
                    currentFactionId === f.id
                      ? 'border-red-600 bg-red-100 dark:bg-red-900/40'
                      : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{f.personality}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onStart}
            className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-semibold"
          >
            Start New Game
          </button>
          {hasSave && (
            <button
              onClick={loadGame}
              className="rounded border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Resume Saved Game
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Import Save
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={handleImport} />
        </div>
      </div>
    </div>
  );
}
