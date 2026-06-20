import type { FullGameSnapshot } from '../types';

const MILESTONES_1772: { templateId: string; label: string }[] = [
  { templateId: 'gaspee', label: 'Gaspee' },
  { templateId: 'tea_act', label: 'Tea Act' },
  { templateId: 'intolerable_acts', label: '1st Continental Congress' },
  { templateId: 'lexington_concord', label: 'Lex & Concord' },
  { templateId: 'declaration_of_independence', label: 'Declaration' },
  { templateId: 'articles_of_confederation', label: 'Articles' },
  { templateId: 'french_alliance', label: 'French Alliance' },
  { templateId: 'treaty_of_paris', label: 'Treaty of Paris' },
  { templateId: 'shays_rebellion', label: "Shays' Rebellion" },
  { templateId: 'constitutional_convention_kickoff', label: 'Constitution' },
];

export function EraTimeline({ snapshot }: { snapshot: FullGameSnapshot }): JSX.Element {
  if (snapshot.game.scenarioId !== '1772') return <div />;
  const completed = new Set(snapshot.game.eraEventsCompleted);
  // Match each milestone to the most recent era-event log entry that resolved it.
  const logByTemplate = new Map<string, { year: number; text: string }>();
  for (const e of snapshot.events) {
    if (e.category !== 'event') continue;
    const tpl = e.meta?.templateId;
    if (typeof tpl !== 'string') continue;
    const existing = logByTemplate.get(tpl);
    if (!existing || e.year >= existing.year) {
      logByTemplate.set(tpl, { year: e.year, text: e.text });
    }
  }
  return (
    <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Era Progress — Era of Independence</div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {MILESTONES_1772.map((m, i) => {
          const done = completed.has(m.templateId);
          const isCurrent = !done && (i === 0 || completed.has(MILESTONES_1772[i - 1]?.templateId ?? ''));
          const entry = logByTemplate.get(m.templateId);
          const yearStr = done && entry ? String(entry.year) : null;
          const tooltip = done && entry ? entry.text : undefined;
          return (
            <div key={m.templateId} className="flex items-center gap-1 flex-shrink-0">
              <div
                title={tooltip}
                className={`rounded px-2 py-1 text-xs whitespace-nowrap text-center ${
                  done
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                      ? 'bg-amber-400 text-slate-900 animate-pulse border border-amber-500'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                <div>{done && <span className="mr-1">✓</span>}{m.label}</div>
                {yearStr && <div className="text-[10px] opacity-80">{yearStr}</div>}
              </div>
              {i < MILESTONES_1772.length - 1 && <span className="text-slate-400">→</span>}
            </div>
          );
        })}
      </div>
      {snapshot.game.currentEra === 'federalism' && <div className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300">→ Federalism era unlocked. Standard rules apply.</div>}
    </div>
  );
}
