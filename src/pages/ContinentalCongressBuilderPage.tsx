import { useState } from 'react';
import { useGame } from '../state/GameContext';
import type { Politician } from '../types';
import { formatPartyId } from '../engine/labels';
import {
  cc1774GateMet,
  colonyOrder1774,
  eligiblePoolFor,
  selectingBodyLabel,
  selectingFactionFor,
} from '../engine/firstContinentalCongress';
import { CCDelegateDeclineModal } from '../components/CCDelegateDeclineModal';

// Derive a Patriot / Moderate / Loyalist flavor band from ideology. F5-binding:
// these strings are the only "party-like" UI labels allowed on this page.
function patriotBand(ideology: Politician['ideology']): { label: string; tone: string } {
  switch (ideology) {
    case 'LW Populist':
    case 'Progressive':
    case 'Liberal':
      return { label: 'Patriot', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
    case 'Moderate':
      return { label: 'Moderate', tone: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' };
    case 'Conservative':
    case 'Traditionalist':
    case 'RW Populist':
      return { label: 'Loyalist-leaning', tone: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' };
  }
}

const TIER_BADGE: Record<string, { label: string; tone: string }> = {
  T1: { label: 'T1 · own faction', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  T2: { label: 'T2 · same party', tone: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
  T3: { label: 'T3 · crosses the aisle', tone: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
  Wild: { label: 'Wild · unexpected nod', tone: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
  Player: { label: 'Player', tone: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
};

export function ContinentalCongressBuilderPage(): JSX.Element {
  const { snapshot, advance, pickCCDelegate, declineCCDelegate } = useGame();
  const [pendingDecline, setPendingDecline] = useState<Politician | null>(null);

  if (!snapshot) return <div />;
  const g = snapshot.game;

  if (g.scenarioId !== '1772' || !cc1774GateMet(snapshot)) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">First Continental Congress Builder</h2>
        <p className="text-sm text-slate-500">
          Available only in the 1772 scenario once the Intolerable Acts have been resolved
          by convening a Continental Congress.
        </p>
      </div>
    );
  }

  const cursor = g.ccBuilderCursor;
  const order = colonyOrder1774(snapshot);
  const cc = g.continentalCongress;
  const seatedDelegates = cc?.delegates ?? [];

  // Roster-summary surface: build complete (cursor cleared) but delegates seated.
  if (!cursor && seatedDelegates.length > 0) {
    return <RosterSummary onAdvance={() => advance()} />;
  }

  // Defensive: no cursor and no delegates — phase isn't truly active.
  if (!cursor) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">First Continental Congress Builder</h2>
        <p className="text-sm text-slate-500">The build has not yet begun.</p>
      </div>
    );
  }

  const state = order[cursor.colonyIdx];
  if (!state) {
    // Cursor past the end — render the roster summary regardless.
    return <RosterSummary onAdvance={() => advance()} />;
  }
  const slots = state.ccDelegateSlots ?? 2;
  const slotIdx = cursor.slotIdx;
  const { factionId: selectingFactionId, tiebreakerNote } = selectingFactionFor(snapshot, state);
  const selectingFaction = snapshot.factions.find((f) => f.id === selectingFactionId);
  const isPlayerColony = selectingFactionId === g.playerFactionId;

  const alreadySeated = new Set<string>(seatedDelegates.map((d) => d.politicianId));
  for (const ex of cursor.excludedThisColony ?? []) alreadySeated.add(ex);
  const pool = eligiblePoolFor(snapshot, state, alreadySeated);

  // Sort: PV desc (player colonies). Tier headers aren't computed here for AI
  // colonies — the AI's decision happens inside the runner already.
  const sortedPool = [...pool].sort((a, b) => b.pvCache - a.pvCache);

  const seatedThisColony = seatedDelegates.filter((d) => d.stateId === state.id);

  const onSeat = (p: Politician): void => {
    if (p.careerTrack != null && p.careerTrackYears >= 1) {
      setPendingDecline(p);
      return;
    }
    void pickCCDelegate(state.id, p.id);
  };

  const onConfirmAccept = (): void => {
    if (!pendingDecline) return;
    const id = pendingDecline.id;
    setPendingDecline(null);
    void pickCCDelegate(state.id, id);
  };

  const onConfirmDecline = (): void => {
    if (!pendingDecline) return;
    const id = pendingDecline.id;
    setPendingDecline(null);
    void declineCCDelegate(state.id, id);
  };

  return (
    <div className="space-y-4">
      <div className="rounded border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 p-3">
        <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Continental Congress (1774) · Philadelphia
        </div>
        <h2 className="text-lg font-bold">{state.name} · Selecting {slotIdx + 1} of {slots}</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 italic">{selectingBodyLabel(state.id)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Selecting faction:</span>
          <span className="inline-block rounded px-2 py-0.5 bg-slate-200 dark:bg-slate-700 font-semibold">
            {selectingFaction?.name ?? selectingFactionId}
          </span>
          {tiebreakerNote && (
            <span className="text-slate-500 italic">({tiebreakerNote})</span>
          )}
          {isPlayerColony && (
            <span className="rounded px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-semibold uppercase">Your call</span>
          )}
        </div>
      </div>

      {seatedThisColony.length > 0 && (
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Already seated from {state.abbr}</h3>
          <div className="flex flex-wrap gap-2">
            {seatedThisColony.map((d, i) => {
              const p = snapshot.politicians.find((pp) => pp.id === d.politicianId);
              const f = snapshot.factions.find((ff) => ff.id === d.factionId);
              const tierKey = d.tier ?? 'Player';
              const tier = TIER_BADGE[tierKey];
              return (
                <div key={i} className="rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{p ? `${p.firstName} ${p.lastName}` : '—'}</span>
                  <span className="text-slate-500">{f?.name ?? d.factionId}</span>
                  {p && <span className={`rounded px-1.5 ${patriotBand(p.ideology).tone}`}>{patriotBand(p.ideology).label}</span>}
                  <span className={`rounded px-1.5 ${tier.tone}`}>{tier.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Eligible Pool ({sortedPool.length})</h3>
          {!isPlayerColony && (
            <button
              onClick={() => advance()}
              className="rounded bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold"
            >
              Continue
            </button>
          )}
        </div>
        <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
              <tr>
                <th className="px-2 py-1.5 text-left">Name</th>
                <th className="px-2 py-1.5 text-left">Colony</th>
                <th className="px-2 py-1.5 text-left">Faction</th>
                <th className="px-2 py-1.5 text-left">Leaning</th>
                <th className="px-2 py-1.5 text-left">Ideology</th>
                <th className="px-2 py-1.5 text-right">PV</th>
                <th className="px-2 py-1.5 text-right">Leg</th>
                <th className="px-2 py-1.5 text-left">Track</th>
                <th className="px-2 py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {sortedPool.map((p) => {
                const f = snapshot.factions.find((ff) => ff.id === p.factionId);
                const band = patriotBand(p.ideology);
                const partyLabel = p.partyId ? formatPartyId(p.partyId, '1772', g.year) : '—';
                const trackText = p.careerTrack ? `${p.careerTrack} · ${p.careerTrackYears}y` : '—';
                return (
                  <tr key={p.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-2 py-1 font-semibold">{p.firstName} {p.lastName}</td>
                    <td className="px-2 py-1">{state.abbr}</td>
                    <td className="px-2 py-1 text-xs">
                      {f?.name ?? '—'}
                      <span className="ml-1 text-slate-400">({partyLabel})</span>
                    </td>
                    <td className="px-2 py-1">
                      <span className={`rounded px-1.5 text-[10px] font-bold uppercase ${band.tone}`}>{band.label}</span>
                    </td>
                    <td className="px-2 py-1 text-xs">{p.ideology}</td>
                    <td className="px-2 py-1 text-right font-bold text-emerald-700 dark:text-emerald-400">{p.pvCache}</td>
                    <td className="px-2 py-1 text-right">{p.skills.legislative}</td>
                    <td className="px-2 py-1 text-xs">{trackText}</td>
                    <td className="px-2 py-1">
                      {isPlayerColony && (
                        <button
                          onClick={() => onSeat(p)}
                          className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 text-xs font-semibold"
                        >
                          Seat
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sortedPool.length === 0 && (
                <tr><td colSpan={9} className="px-3 py-3 text-sm text-slate-500 italic">No eligible politicians in this colony.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDecline && (
        <CCDelegateDeclineModal
          politician={pendingDecline}
          colonyName={state.name}
          onAccept={onConfirmAccept}
          onDecline={onConfirmDecline}
        />
      )}
    </div>
  );
}

function RosterSummary({ onAdvance }: { onAdvance: () => void }): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const cc = snapshot.game.continentalCongress;
  if (!cc) return <div />;

  // Group by colony.
  const byState = new Map<string, typeof cc.delegates>();
  for (const d of cc.delegates) {
    const arr = byState.get(d.stateId) ?? [];
    arr.push(d);
    byState.set(d.stateId, arr);
  }
  const factionCounts = new Map<string, number>();
  for (const d of cc.delegates) factionCounts.set(d.factionId, (factionCounts.get(d.factionId) ?? 0) + 1);
  const factionTally = [...factionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => ({ faction: snapshot.factions.find((f) => f.id === id), count: n }));

  const tierCounts: Record<string, number> = { T1: 0, T2: 0, T3: 0, Wild: 0, Player: 0 };
  for (const d of cc.delegates) {
    const t = d.tier ?? 'Player';
    tierCounts[t] = (tierCounts[t] ?? 0) + 1;
  }

  return (
    <div className="space-y-4">
      <div className="rounded border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 p-3">
        <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">First Continental Congress — Philadelphia, 1774</div>
        <h2 className="text-lg font-bold">Roster Seated</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
          {cc.delegates.length} delegates from {byState.size} colonies. The CC President will be
          chosen separately at phase 2.2.1 next turn.
        </p>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Faction Strength</h3>
        <div className="space-y-1 text-xs">
          {factionTally.map(({ faction, count }) => (
            <div key={faction?.id} className="flex items-center gap-2">
              <span className="font-semibold w-48 truncate">{faction?.name ?? '—'}</span>
              <span className="font-mono w-10 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">By Tier (T1 = own faction; T2 = same party; T3 = crosses the aisle)</h3>
        <div className="flex flex-wrap gap-3 text-xs">
          {(['T1', 'T2', 'T3', 'Wild', 'Player'] as const).map((t) => (
            <span key={t} className={`rounded px-2 py-0.5 ${TIER_BADGE[t].tone}`}>
              {TIER_BADGE[t].label}: {tierCounts[t] ?? 0}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr>
              <th className="px-2 py-1.5 text-left">Colony</th>
              <th className="px-2 py-1.5 text-left">Delegates</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.states
              .filter((s) => s.isColony !== false)
              .sort((a, b) => a.abbr.localeCompare(b.abbr))
              .map((s) => {
                const dels = byState.get(s.id) ?? [];
                return (
                  <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700/50 align-top">
                    <td className="px-2 py-1.5 font-semibold">{s.name} <span className="text-xs text-slate-500">({s.abbr})</span></td>
                    <td className="px-2 py-1.5 text-xs">
                      <div className="flex flex-wrap gap-2">
                        {dels.length === 0 && <span className="italic text-slate-500">— none seated —</span>}
                        {dels.map((d, i) => {
                          const p = snapshot.politicians.find((pp) => pp.id === d.politicianId);
                          const f = snapshot.factions.find((ff) => ff.id === d.factionId);
                          const tierKey = d.tier ?? 'Player';
                          const tier = TIER_BADGE[tierKey];
                          return (
                            <span key={i} className="rounded border border-slate-200 dark:border-slate-700 px-2 py-0.5 flex flex-wrap items-center gap-1">
                              <span className="font-semibold">{p ? `${p.firstName} ${p.lastName}` : '—'}</span>
                              <span className="text-slate-500">{f?.name ?? d.factionId}</span>
                              {p && <span className={`rounded px-1 ${patriotBand(p.ideology).tone}`}>{patriotBand(p.ideology).label}</span>}
                              <span className={`rounded px-1 ${tier.tone}`}>{tier.label.split(' · ')[0]}</span>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 italic">
        Footnote: Georgia did not actually send delegates to the First Continental Congress in 1774 — game-mechanic license.
        Per-colony slot counts (Big 4 / Medium 3 / Small 2) are a deliberate abstraction; historical delegation sizes varied
        more widely.
      </p>

      <div>
        <button
          onClick={onAdvance}
          className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

