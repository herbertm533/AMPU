import { useGame } from '../state/GameContext';
import { useNavigation } from '../state/NavigationContext';
import type { PageId } from '../pages/registry';

const TABS: { id: PageId; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'draftScouting', label: 'Draft Scouting' },
  { id: 'draftHistory', label: 'Draft History' },
];

export function DraftTabs(): JSX.Element {
  const { page, navigateTo } = useNavigation();
  const { snapshot } = useGame();
  const g = snapshot?.game;
  const draftActive = !!g
    && g.phaseId === '2.1.1'
    && g.pendingDraftPool.length > 0
    && g.draftRoundOrder.length > 0;

  return (
    <div className="flex gap-1 border-b border-slate-300 dark:border-slate-700 mb-4">
      {TABS.map((t) => {
        const isCurrent = page === t.id;
        const isDraftDisabled = t.id === 'draft' && !draftActive;
        return (
          <button
            key={t.id}
            onClick={() => { if (!isDraftDisabled) navigateTo(t.id); }}
            disabled={isDraftDisabled}
            title={isDraftDisabled ? 'No draft in progress' : undefined}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
              isCurrent
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : isDraftDisabled
                ? 'border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
