import { useGame } from '../state/GameContext';
import type { ConstitutionalConvention } from '../types';

const ARTICLE_LABELS: Record<string, string> = {
  legislature: 'Article I — Legislature',
  executive: 'Article II — Executive',
  judiciary: 'Article III — Judiciary',
  slaveCompromise: 'Slave State Compromise',
  amendmentProcess: 'Amendment Process',
  presidentialEligibility: 'Presidential Eligibility',
  termLimits: 'Term Limits',
};

export function ConventionModal({ convention }: { convention: ConstitutionalConvention }): JSX.Element {
  const { setConventionVote, finalizeConvention } = useGame();
  const allVoted = convention.votes.every((v) => v.selected !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 max-h-[92vh] flex flex-col">
        <div className="border-b border-slate-300 dark:border-slate-700 px-4 py-3 bg-amber-50 dark:bg-amber-900/30">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">Constitutional Convention — Philadelphia, {convention.year}</div>
          <h2 className="text-lg font-bold">Frame the New Government</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Cast your faction's position on each article. CPU factions will vote based on their ideology. Final results will be recorded as the Constitution.</p>
        </div>
        <div className="overflow-auto flex-1 p-3 space-y-3">
          {convention.votes.map((vote) => (
            <div key={vote.articleKey} className="rounded border border-slate-300 dark:border-slate-700 p-3">
              <div className="font-semibold text-sm mb-2">{ARTICLE_LABELS[vote.articleKey] ?? vote.articleKey}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {vote.options.map((opt) => {
                  const isSel = vote.selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setConventionVote(vote.articleKey, opt.id)}
                      className={`text-left rounded border p-2 ${
                        isSel
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{opt.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-300 dark:border-slate-700 p-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500">{allVoted ? 'All articles voted.' : `${convention.votes.filter((v) => v.selected).length}/${convention.votes.length} articles voted (unvoted use CPU consensus).`}</span>
          <button
            onClick={() => finalizeConvention()}
            className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold"
          >
            Finalize Constitution
          </button>
        </div>
      </div>
    </div>
  );
}
