import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { DraftTabs } from '../components/DraftTabs';

type SortKey = 'pv' | 'name' | 'state' | 'age' | 'admin' | 'leg' | 'jud' | 'mil' | 'gov' | 'back' | 'cmd';

export function Draft(): JSX.Element {
  const { snapshot, draftPick, simOnePick, simToMyNextPick, simToEndOfDraft, advance } = useGame();
  const [sortKey, setSortKey] = useState<SortKey>('pv');
  const [search, setSearch] = useState('');

  if (!snapshot) return <div />;
  const g = snapshot.game;
  const playerFactionId = g.playerFactionId;

  const order = g.draftRoundOrder;
  const inLiveDraft = g.phaseId === '2.1.1' && order.length > 0;

  const isInaugural = g.year === g.startYear;
  const titlePrefix = isInaugural ? 'Inaugural Draft' : 'Draft';
  const pillLabel = isInaugural ? 'INAUGURAL' : 'ROOKIE';
  const pillClass = isInaugural ? 'bg-amber-500 text-slate-900' : 'bg-slate-300 text-slate-700';

  if (!inLiveDraft) {
    const lastYear = g.lastDraftYear;
    return (
      <div>
        <DraftTabs />
        <div className="flex items-start justify-between mb-2 gap-3">
          <h2 className="text-xl font-bold">{titlePrefix} — {g.year}</h2>
          <span className={`text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 ${pillClass}`}>{pillLabel}</span>
        </div>
        {g.pendingDraftPool.length === 0 && order.length === 0 && lastYear != null ? (
          <div className="rounded border border-slate-300 dark:border-slate-700 p-4 space-y-3">
            <p className="text-sm">The {lastYear} draft is complete. Continue to the next phase.</p>
            <button onClick={() => advance()} className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold">Continue</button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No draft in progress. Use the Draft Scouting tab to preview upcoming classes.</p>
        )}
      </div>
    );
  }

  const pool = snapshot.politicians.filter((p) => g.pendingDraftPool.includes(p.id));

  if (pool.length === 0) {
    return (
      <div>
        <DraftTabs />
        <div className="flex items-start justify-between mb-2 gap-3">
          <h2 className="text-xl font-bold">{titlePrefix} — {g.year}</h2>
          <span className={`text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 ${pillClass}`}>{pillLabel}</span>
        </div>
        <div className="rounded border border-slate-300 dark:border-slate-700 p-4 space-y-3">
          <p className="text-sm">Draft pool exhausted. Continue to the next phase.</p>
          <button onClick={() => advance()} className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold">Continue</button>
        </div>
      </div>
    );
  }

  const factionName = (id: string): string => snapshot.factions.find((f) => f.id === id)?.name ?? id;
  const factionCount = Math.max(1, snapshot.factions.length);
  const yearHistory = g.draftHistory?.find((y) => y.year === g.year);
  const filledCount = yearHistory?.picks.length ?? 0;
  const totalPicks = filledCount + order.length;

  const currentFactionId = order[0];
  const nextFactionId = order[1] ?? null;
  const isPlayerUp = currentFactionId === playerFactionId;
  const picksUntilPlayer = order.indexOf(playerFactionId);

  const currentPickNumber = filledCount + 1;
  const currentRound = Math.ceil(currentPickNumber / factionCount);

  const filtered = pool.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.state.toLowerCase().includes(q);
  });
  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case 'pv': return b.pvCache - a.pvCache;
      case 'name': return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      case 'state': return a.state.localeCompare(b.state);
      case 'age': return a.age - b.age;
      case 'admin': return b.skills.admin - a.skills.admin;
      case 'leg': return b.skills.legislative - a.skills.legislative;
      case 'jud': return b.skills.judicial - a.skills.judicial;
      case 'mil': return b.skills.military - a.skills.military;
      case 'gov': return b.skills.governing - a.skills.governing;
      case 'back': return b.skills.backroom - a.skills.backroom;
      case 'cmd': return b.command - a.command;
    }
  });

  const onEndOfDraft = (): void => {
    if (confirm('Auto-pick the rest of the draft for all factions including yours (using CPU scoring)?')) {
      void simToEndOfDraft();
    }
  };

  const HeadCell = ({ k, label, align = 'right' }: { k: SortKey; label: string; align?: 'left' | 'right' }): JSX.Element => (
    <th
      onClick={() => setSortKey(k)}
      className={`px-2 py-1.5 cursor-pointer select-none ${align === 'right' ? 'text-right' : 'text-left'} ${sortKey === k ? 'text-blue-600 dark:text-blue-400' : ''}`}
    >
      {label}{sortKey === k ? ' ↓' : ''}
    </th>
  );

  return (
    <div>
      <DraftTabs />
      <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold">{titlePrefix} — {g.year}</h2>
            <span className={`text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 ${pillClass}`}>{pillLabel}</span>
          </div>
          {isInaugural && (
            <div className="mt-2 rounded border border-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
              The founding generation. These are the marquee historical figures of pre-revolutionary America, drafted onto factions in snake order. From {g.startYear + 4} onward, drafts will be smaller classes of newly-eligible rookies (born ~25 years ago).
            </div>
          )}
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Pick <span className="font-semibold">{currentPickNumber}</span> of <span className="font-semibold">{totalPicks}</span>
            {' · '}Round <span className="font-semibold">{currentRound}</span>
            {' · '}On the clock: <span className="font-semibold">{factionName(currentFactionId)}</span>
            {nextFactionId && <> · Next: <span>{factionName(nextFactionId)}</span></>}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {isPlayerUp ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">You&apos;re up.</span> : picksUntilPlayer >= 0 ? <>You&apos;re up in {picksUntilPlayer} pick{picksUntilPlayer === 1 ? '' : 's'}.</> : 'Your picks are done.'}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => simOnePick()} disabled={isPlayerUp} className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">Sim one pick</button>
          <button onClick={() => simToMyNextPick()} disabled={isPlayerUp || picksUntilPlayer < 0} className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">To my next pick</button>
          <button onClick={onEndOfDraft} className="rounded bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm font-semibold">To end of draft</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-700">
            <h3 className="font-semibold text-sm">Undrafted Politicians ({pool.length})</h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / state"
              className="text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
            />
          </div>
          <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                <tr>
                  <th className="px-2 py-1.5 text-left">#</th>
                  <HeadCell k="name" label="Name" align="left" />
                  <HeadCell k="state" label="State" align="left" />
                  <th className="px-2 py-1.5 text-left">Ideology</th>
                  <HeadCell k="age" label="Age" />
                  <HeadCell k="pv" label="PV" />
                  <HeadCell k="admin" label="Adm" />
                  <HeadCell k="leg" label="Leg" />
                  <HeadCell k="jud" label="Jud" />
                  <HeadCell k="mil" label="Mil" />
                  <HeadCell k="gov" label="Gov" />
                  <HeadCell k="back" label="Bck" />
                  <HeadCell k="cmd" label="Cmd" />
                  <th className="px-2 py-1.5 text-left">Traits</th>
                  <th className="px-2 py-1.5"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <tr key={p.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-2 py-1 text-xs text-slate-500">{i + 1}</td>
                    <td className="px-2 py-1 font-semibold">{p.firstName} {p.lastName}</td>
                    <td className="px-2 py-1">{p.state.toUpperCase()}</td>
                    <td className="px-2 py-1 text-xs">{p.ideology}</td>
                    <td className="px-2 py-1 text-right">{p.age}</td>
                    <td className="px-2 py-1 text-right font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</td>
                    <td className="px-2 py-1 text-right">{p.skills.admin}</td>
                    <td className="px-2 py-1 text-right">{p.skills.legislative}</td>
                    <td className="px-2 py-1 text-right">{p.skills.judicial}</td>
                    <td className="px-2 py-1 text-right">{p.skills.military}</td>
                    <td className="px-2 py-1 text-right">{p.skills.governing}</td>
                    <td className="px-2 py-1 text-right">{p.skills.backroom}</td>
                    <td className="px-2 py-1 text-right">{p.command}</td>
                    <td className="px-2 py-1 text-xs">{p.traits.join(', ')}</td>
                    <td className="px-2 py-1">
                      <button
                        onClick={() => draftPick(p.id)}
                        disabled={!isPlayerUp}
                        title={isPlayerUp ? undefined : 'Not your pick'}
                        className="rounded bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-2 py-0.5 text-xs"
                      >
                        Draft
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700">
            <h3 className="font-semibold text-sm">Draft Results</h3>
          </div>
          <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                <tr>
                  <th className="px-2 py-1.5 text-left">Pick</th>
                  <th className="px-2 py-1.5 text-left">Faction</th>
                  <th className="px-2 py-1.5 text-left">Politician</th>
                </tr>
              </thead>
              <tbody>
                {yearHistory?.picks.map((pick) => {
                  const p = snapshot.politicians.find((pp) => pp.id === pick.politicianId);
                  const isPlayerPick = pick.factionId === playerFactionId;
                  return (
                    <tr key={pick.pickNumber} className={`border-b border-slate-200 dark:border-slate-700/50 ${isPlayerPick ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                      <td className="px-2 py-1 font-mono text-xs">{pick.round}-{pick.pickNumber}</td>
                      <td className="px-2 py-1 text-xs">{factionName(pick.factionId)}</td>
                      <td className="px-2 py-1">{p ? `${p.firstName} ${p.lastName}` : <span className="text-slate-400">(unknown)</span>}</td>
                    </tr>
                  );
                })}
                {order.map((fid, idx) => {
                  const pickNumber = filledCount + idx + 1;
                  const round = Math.ceil(pickNumber / factionCount);
                  const isPlayerSlot = fid === playerFactionId;
                  return (
                    <tr key={`up-${pickNumber}`} className={`border-b border-slate-200 dark:border-slate-700/50 ${isPlayerSlot ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''}`}>
                      <td className="px-2 py-1 font-mono text-xs">{round}-{pickNumber}</td>
                      <td className="px-2 py-1 text-xs">{factionName(fid)}{isPlayerSlot ? ' (you)' : ''}</td>
                      <td className="px-2 py-1 text-xs text-slate-400 italic">— on the clock —</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
