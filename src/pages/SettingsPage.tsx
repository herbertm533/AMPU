import { useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { buildCsvTemplate, type ParseResult } from '../data/draftImport';
import { DEFAULT_DRAFT_CLASSES } from '../data/defaultDraftClasses';

export function SettingsPage(): JSX.Element {
  const { snapshot, exportSave, importSave, importDraftDataset, clearDraftDataset, resetGame } = useGame();
  const fileRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const [csvMode, setCsvMode] = useState<'replace' | 'merge'>('replace');
  const [importReport, setImportReport] = useState<ParseResult | null>(null);

  const customCount = snapshot?.game.customDraftClasses?.length ?? 0;
  const customYears = [...new Set((snapshot?.game.customDraftClasses ?? []).map((d) => d.draftYear))].sort((a, b) => a - b);

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

  const downloadTemplate = (): void => {
    const blob = new Blob([buildCsvTemplate()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ampu-draft-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doCsvImport = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const report = await importDraftDataset(text, csvMode);
    setImportReport(report);
    if (csvRef.current) csvRef.current.value = '';
  };

  const doClearCsv = async (): Promise<void> => {
    if (confirm('Remove all imported draft classes? Random rookie generation will resume for future drafts.')) {
      await clearDraftDataset();
      setImportReport(null);
    }
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

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
        <h3 className="font-semibold">Custom Draft Classes</h3>
        <p className="text-sm text-slate-500">
          Supply your own politicians for future draft classes. Download the CSV template,
          fill it in with a spreadsheet, then import it here. When a draft year arrives that
          has matching rows (by <code>draftYear</code>), the game uses your list instead of
          generating random rookies.
        </p>

        <div className="text-xs text-slate-600 dark:text-slate-400 rounded bg-slate-100 dark:bg-slate-900/40 p-2">
          <div className="font-semibold mb-1">How to fill it in</div>
          <ul className="list-disc ml-4 space-y-0.5">
            <li><code>draftYear</code> must be a draft year — a multiple of 4 (e.g. 1776, 1860, 1864). 1772's opening expansion draft is fixed and not affected.</li>
            <li><code>state</code> = two-letter abbreviation (NY, VA, MA…). Use colonies for 1772, states for 1856.</li>
            <li>Skills (admin…backroom) and command are integers 0–5.</li>
            <li><code>traits</code> are pipe-separated, e.g. <code>Orator|Integrity</code> (the template lists every valid trait and ideology).</li>
            <li>Lines starting with <code>#</code> are ignored, so the reference block in the template is safe to leave in.</li>
          </ul>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={downloadTemplate} className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-sm">Download CSV Template</button>
          <label className="text-xs flex items-center gap-1">
            <span className="text-slate-500">On import:</span>
            <select value={csvMode} onChange={(e) => setCsvMode(e.target.value as 'replace' | 'merge')} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs">
              <option value="replace">Replace existing</option>
              <option value="merge">Merge with existing</option>
            </select>
          </label>
          <button onClick={() => csvRef.current?.click()} className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">Import CSV</button>
          {customCount > 0 && (
            <button onClick={doClearCsv} className="rounded border border-rose-300 text-rose-600 dark:border-rose-700 dark:text-rose-400 px-3 py-1.5 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20">Clear Dataset</button>
          )}
          <input ref={csvRef} type="file" accept=".csv,text/csv" hidden onChange={doCsvImport} />
        </div>

        <div className="text-xs text-slate-500 space-y-0.5">
          <div>
            Standard bundled classes: <span className="font-semibold">{DEFAULT_DRAFT_CLASSES.length}</span>
            {DEFAULT_DRAFT_CLASSES.length > 0 && <> across years {[...new Set(DEFAULT_DRAFT_CLASSES.map((d) => d.draftYear))].sort((a, b) => a - b).join(', ')}</>}
            {' '}— used by all players unless overridden below.
          </div>
          <div>
            {customCount > 0
              ? <>Your imported override: <span className="font-semibold">{customCount}</span> politicians across years {customYears.join(', ')}. Imported years take precedence over the standard set.</>
              : <>No personal override loaded. {DEFAULT_DRAFT_CLASSES.length > 0 ? 'The standard classes apply.' : 'Future drafts use random rookie generation.'}</>}
          </div>
        </div>

        {importReport && (
          <div className="text-xs rounded border border-slate-200 dark:border-slate-700 p-2 space-y-1">
            <div className="font-semibold">Import result</div>
            <div className="text-emerald-700 dark:text-emerald-400">{importReport.draftees.length} draftees parsed.</div>
            {importReport.errors.length > 0 && (
              <div className="text-rose-600 dark:text-rose-400">
                Errors:
                <ul className="list-disc ml-4">{importReport.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}
            {importReport.warnings.length > 0 && (
              <details className="text-amber-700 dark:text-amber-400">
                <summary className="cursor-pointer">{importReport.warnings.length} warning(s)</summary>
                <ul className="list-disc ml-4">{importReport.warnings.slice(0, 50).map((w, i) => <li key={i}>{w}</li>)}</ul>
              </details>
            )}
          </div>
        )}
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
