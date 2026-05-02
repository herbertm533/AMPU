import { useGame } from '../state/GameContext';

export function LegislationPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const sorted = [...snapshot.legislation].sort((a, b) => b.year - a.year);

  const statusBadge = (status: string): JSX.Element => {
    const map: Record<string, string> = {
      proposed: 'bg-slate-200 text-slate-700',
      committee: 'bg-amber-200 text-amber-800',
      passed_committee: 'bg-blue-200 text-blue-800',
      killed_committee: 'bg-rose-200 text-rose-800',
      passed: 'bg-emerald-200 text-emerald-800',
      failed: 'bg-rose-200 text-rose-800',
    };
    return <span className={`text-[10px] uppercase rounded px-1.5 py-0.5 ${map[status] ?? 'bg-slate-200'}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Legislation — {sorted.length} Bills</h2>
      <div className="space-y-2">
        {sorted.map((bill) => {
          const sponsor = snapshot.politicians.find((p) => p.id === bill.sponsorId);
          return (
            <div key={bill.id} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-slate-500">[{bill.year}]</span>
                <span className="font-semibold">{bill.title}</span>
                {statusBadge(bill.status)}
                <span className="text-xs text-slate-500 ml-auto">{bill.committee} cmte</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{bill.description}</div>
              <div className="text-xs text-slate-500 mt-1">Sponsor: {sponsor ? `${sponsor.firstName} ${sponsor.lastName}` : '—'}</div>
              {bill.votes && (
                <div className="text-xs mt-1">
                  House: <span className="text-emerald-600 dark:text-emerald-400">{bill.votes.house.yea}</span> – <span className="text-rose-600 dark:text-rose-400">{bill.votes.house.nay}</span> •
                  Senate: <span className="text-emerald-600 dark:text-emerald-400 ml-1">{bill.votes.senate.yea}</span> – <span className="text-rose-600 dark:text-rose-400">{bill.votes.senate.nay}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
