import { useRef } from 'react';
import { useGame } from '../state/GameContext';

export function SettingsPage(): JSX.Element {
  const { snapshot, exportSave, importSave, resetGame } = useGame();
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = async (): Promise<void> => {
    const text = await exportSave();
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ampu-save-${snapshot?.game.year ?? 'unknown'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    await importSave(text);
  };

  const doReset = async (): Promise<void> => {
    if (confirm('Reset the game? This deletes your save permanently.')) {
      await resetGame();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold">Settings & Save</h2>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-2">
        <h3 className="font-semibold">Save Management</h3>
        <p className="text-sm text-slate-500">Saves are stored locally in IndexedDB. Auto-saved after each phase.</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={doExport} className="rounded bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm">Export Save (JSON)</button>
          <button onClick={() => fileRef.current?.click()} className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">Import Save</button>
          <button onClick={doReset} className="rounded bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-sm">Reset Game</button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={doImport} />
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="font-semibold">About</h3>
        <p className="text-sm text-slate-500">
          AMPU — American Political Universe. Single-player political management simulator.
          UI inspired by Basketball GM. Built with React, TypeScript, Tailwind CSS, and IndexedDB.
        </p>
        {snapshot && (
          <div className="mt-2 text-xs text-slate-500">
            Scenario: {snapshot.game.scenarioId} • Started: {snapshot.game.startYear} • Current: {snapshot.game.year}
          </div>
        )}
      </div>
    </div>
  );
}
