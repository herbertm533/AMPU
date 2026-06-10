import { useMemo, useState } from 'react';
import { useGame } from '../state/GameContext';
import { DraftTabs } from '../components/DraftTabs';
import { STANDARD_DRAFT_CLASSES } from '../data/standardDraftClasses';
import { computeProjectedPV } from './draftScoutingHelpers';
import type { ImportedDraftee } from '../types';

const COLUMNS = 3;

function nextDraftYear(fromYear: number): number {
  const r = fromYear % 4;
  return r === 0 ? fromYear + 4 : fromYear + (4 - r);
}

export function DraftScouting(): JSX.Element {
  const { snapshot } = useGame();

  const sourceClasses = useMemo<ImportedDraftee[]>(() => {
    const custom = snapshot?.game.customDraftClasses ?? [];
    if (custom.length === 0) return STANDARD_DRAFT_CLASSES;
    const customKey = (d: ImportedDraftee): string => `${d.firstName} ${d.lastName} ${d.draftYear}`.toLowerCase();
    const customKeys = new Set(custom.map(customKey));
    const standardFiltered = STANDARD_DRAFT_CLASSES.filter((d) => !customKeys.has(customKey(d)));
    return [...standardFiltered, ...custom];
  }, [snapshot?.game.customDraftClasses]);

  const allYears = useMemo(() => {
    const years = new Set<number>();
    for (const d of sourceClasses) years.add(d.draftYear);
    return [...years].sort((a, b) => a - b);
  }, [sourceClasses]);

  const startYear = nextDraftYear(snapshot?.game.year ?? 1856);
  const [windowStart, setWindowStart] = useState<number>(startYear);

  if (!snapshot) return <div />;

  const validStateIds = new Set(snapshot.states.map((s) => s.id));
  const upperBound = allYears.length > 0 ? allYears[allYears.length - 1] : windowStart;
  const lowerBound = nextDraftYear(snapshot.game.year);

  const years = [];
  for (let i = 0; i < COLUMNS; i++) years.push(windowStart + i * 4);

  const onPrev = (): void => setWindowStart((y) => Math.max(lowerBound, y - 4));
  const onNext = (): void => setWindowStart((y) => Math.min(upperBound, y + 4));

  return (
    <div>
      <DraftTabs />
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Draft Scouting</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Projected PV uses each politician&apos;s skills, traits, ideology, and command on a rookie shape — actual draft-day PV may differ slightly. Politicians whose home state isn&apos;t admitted yet are held back until it is.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onPrev} disabled={windowStart <= lowerBound} className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm disabled:opacity-40">← Previous</button>
          <button onClick={onNext} disabled={windowStart + (COLUMNS - 1) * 4 >= upperBound} className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm disabled:opacity-40">Next →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {years.map((year) => {
          const candidates = sourceClasses.filter((d) => d.draftYear === year);
          candidates.sort((a, b) => computeProjectedPV(b) - computeProjectedPV(a));
          return (
            <div key={year} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-700">
                <h3 className="font-semibold">{year}</h3>
                <button
                  onClick={() => exportYearJson(year, candidates)}
                  className="text-xs rounded border border-slate-300 dark:border-slate-700 px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Export
                </button>
              </div>
              <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                    <tr>
                      <th className="px-1.5 py-1.5 text-left">#</th>
                      <th className="px-1.5 py-1.5 text-left">Name</th>
                      <th className="px-1.5 py-1.5 text-left">St</th>
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
                      <th className="px-1.5 py-1.5 text-left">Traits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.length === 0 ? (
                      <tr><td colSpan={14} className="px-2 py-3 text-center text-xs text-slate-400">No candidates for this year.</td></tr>
                    ) : candidates.map((d, i) => {
                      const heldBack = !validStateIds.has(d.state);
                      return (
                        <tr key={`${d.firstName}-${d.lastName}-${i}`} className={`border-b border-slate-200 dark:border-slate-700/50 ${heldBack ? 'opacity-50' : ''}`}>
                          <td className="px-1.5 py-1 text-slate-500">{i + 1}</td>
                          <td className="px-1.5 py-1 font-semibold">{d.firstName} {d.lastName}</td>
                          <td className="px-1.5 py-1">{d.state.toUpperCase()}{heldBack && <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">(unadmitted)</span>}</td>
                          <td className="px-1.5 py-1">{d.ideology}</td>
                          <td className="px-1.5 py-1 text-right">{d.age}</td>
                          <td className="px-1.5 py-1 text-right font-bold text-emerald-700 dark:text-emerald-400">{computeProjectedPV(d)}</td>
                          <td className="px-1.5 py-1 text-right">{d.skills.admin}</td>
                          <td className="px-1.5 py-1 text-right">{d.skills.legislative}</td>
                          <td className="px-1.5 py-1 text-right">{d.skills.judicial}</td>
                          <td className="px-1.5 py-1 text-right">{d.skills.military}</td>
                          <td className="px-1.5 py-1 text-right">{d.skills.governing}</td>
                          <td className="px-1.5 py-1 text-right">{d.skills.backroom}</td>
                          <td className="px-1.5 py-1 text-right">{d.command}</td>
                          <td className="px-1.5 py-1 text-[11px]">{d.traits.join(', ')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function exportYearJson(year: number, candidates: ImportedDraftee[]): void {
  const blob = new Blob([JSON.stringify(candidates, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `draft-class-${year}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
