import { useGame } from '../state/GameContext';
import { useNavigation } from '../state/NavigationContext';
import { PartyBadge } from '../components/PartyBadge';
import {
  LEADERSHIP_RULES, IDEOLOGY_ORDER, POSITIVE_TRAITS,
  type Politician, type Faction, type FullGameSnapshot, type Era,
} from '../types';
import { factionCenter } from '../engine/phaseRunners';

const ERA_RISK_BLURB: Record<Era, string> = {
  independence: 'Pre-1800: challenges are rare; patronage and PV dominate over ideology distance.',
  federalism:   '1800s caucus era: patronage still drives most challenges; ideology weighs ~30%.',
  nationalism:  '1865-1900 machine era: patronage rivalry ~60%; ideology distance ~40%.',
  modern:       '21st century: ideology distance drives ~80% of challenge risk; primaries reign.',
};

function preview(snap: FullGameSnapshot, f: Faction, leader: Politician, challenger: Politician): { risk: number; threat: number } {
  const cfg = LEADERSHIP_RULES.eraConfig[snap.game.currentEra];
  const center = factionCenter(snap, f.id) ?? IDEOLOGY_ORDER.indexOf(leader.ideology);
  const ideoDist = Math.abs(IDEOLOGY_ORDER.indexOf(leader.ideology) - center);
  const pvGap = Math.max(0, (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer);
  let fireRaw = cfg.baseFireChance + cfg.ideologyTriggerWeight * (ideoDist / 6) + cfg.patronageTriggerWeight * pvGap;
  if (challenger.traits.includes('Ambitious')) fireRaw += LEADERSHIP_RULES.ambitiousFireBonus;
  const risk = Math.max(0, Math.min(LEADERSHIP_RULES.fireCap, fireRaw));
  const edge = (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer;
  const threat = Math.max(0.05, Math.min(0.95, 0.5 + edge - cfg.incumbencyAdvantage / 100));
  return { risk, threat };
}

const TRAIT_BLURB: Record<string, string> = {
  Orator: `+${LEADERSHIP_RULES.oratorIdeologyShiftBonus} to faction ideology shifts (2.1.5)`,
  Manipulative: `+${LEADERSHIP_RULES.manipulativeConversionBonus} to faction sign/poach (2.1.6)`,
  Kingmaker: `${(LEADERSHIP_RULES.kingmakerProtegeBonus * 100).toFixed(0)}% chance of extra Command roll on protégé graduation (2.1.7)`,
  Leadership: `+${LEADERSHIP_RULES.leadershipDropStableTurnsBonus} turn before faction cards drop (2.1.8)`,
  Ambitious: `+${LEADERSHIP_RULES.ambitiousFireBonus} to own challenge fire chance when challenging an incumbent`,
};

export function FactionLeaderPage(): JSX.Element {
  const { snapshot } = useGame();
  const { navigateTo } = useNavigation();
  if (!snapshot) return <div />;

  const f = snapshot.factions.find((ff) => ff.id === snapshot.game.playerFactionId);
  if (!f) return <div />;
  const leader = f.leaderId ? snapshot.politicians.find((p) => p.id === f.leaderId) ?? null : null;
  const era = snapshot.game.currentEra;
  const cfg = LEADERSHIP_RULES.eraConfig[era];
  const center = factionCenter(snapshot, f.id);
  const fitDist = leader && center !== null ? Math.abs(IDEOLOGY_ORDER.indexOf(leader.ideology) - center) : 0;
  const tenure = leader ? snapshot.game.year - (f.leadershipStartYear ?? snapshot.game.year) : 0;

  const challengers = leader ? snapshot.politicians.filter((p) =>
    !p.deathYear && !p.retiredYear
    && p.factionId === f.id
    && p.id !== leader.id
    && p.pvCache >= LEADERSHIP_RULES.challengerPvFloor
    && !p.traits.includes('Failed Bid'),
  ).sort((a, b) => a.pvCache !== b.pvCache ? b.pvCache - a.pvCache : a.id.localeCompare(b.id)).slice(0, 3) : [];

  const history = (snapshot.game.factionLeadership ?? []).filter((e) => e.factionId === f.id).slice(-10).reverse();
  const polName = (id?: string): string => {
    if (!id) return '—';
    const p = snapshot.politicians.find((pp) => pp.id === id);
    return p ? `${p.firstName} ${p.lastName}` : id;
  };

  const topRisk = challengers.length > 0 && leader ? preview(snapshot, f, leader, challengers[0]).risk : 0;
  const riskColor =
    topRisk < 0.05 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
    : topRisk < 0.12 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold">{f.name} — Faction Leader</h2>
        <div className="text-xs text-slate-500 space-x-2">
          <button onClick={() => navigateTo('factionAlignments')} className="underline hover:text-blue-600">Faction Alignments</button>
          <span>/</span>
          <button onClick={() => navigateTo('conversions')} className="underline hover:text-blue-600">Conversions</button>
          <span>/</span>
          <button onClick={() => navigateTo('ideology')} className="underline hover:text-blue-600">Ideology Shifts</button>
          <span>/</span>
          <button onClick={() => navigateTo('kingmakers')} className="underline hover:text-blue-600">Kingmakers</button>
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wide text-slate-500">Current Leader</h3>
          {leader && challengers.length > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded ${riskColor}`}>
              Top challenger risk: {(topRisk * 100).toFixed(1)}%
            </span>
          )}
        </div>
        {leader ? (
          <div className="space-y-2">
            <div className="font-semibold text-lg">
              {leader.firstName} {leader.lastName} <PartyBadge party={leader.partyId} />
            </div>
            <div className="text-xs text-slate-500">
              {leader.ideology} • {leader.state.toUpperCase()} • Age {leader.age} • PV {leader.pvCache} • Cmd {leader.command}
            </div>
            <div className="text-xs text-slate-500">
              Tenure: {tenure} yr{tenure === 1 ? '' : 's'} • Faction-fit distance: {fitDist}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {leader.traits.map((t) => {
                const blurb = TRAIT_BLURB[t];
                const active = !!blurb;
                return (
                  <span
                    key={t}
                    title={blurb ?? t}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      active
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 font-semibold'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {t}{active ? ' ★' : ''}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-sm">No leader yet — election runs at next 2.2.3 phase.</div>
        )}
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Leadership Benefits</h3>
        <ul className="text-sm space-y-1">
          <li>+8 PV via FactionLeader prestige (additive to any other office held)</li>
          <li>Leader counted {LEADERSHIP_RULES.ideologyWeightInFactionCenter}× in faction ideology center (steers 2.1.5/2.1.6/2.1.8)</li>
          {era !== 'independence' && (
            <>
              <li>×{LEADERSHIP_RULES.electionOnBallotMul} faction election bias when the leader is on a state ballot</li>
              <li>+{LEADERSHIP_RULES.sponsorFloorBias} per-faction-member vote on bills the leader sponsors (2.6.3 floor)</li>
            </>
          )}
          {leader && (
            <>
              {leader.traits.includes('Orator') && <li className="text-blue-700 dark:text-blue-300">★ Orator: {TRAIT_BLURB.Orator}</li>}
              {leader.traits.includes('Manipulative') && <li className="text-blue-700 dark:text-blue-300">★ Manipulative: {TRAIT_BLURB.Manipulative}</li>}
              {leader.traits.includes('Kingmaker') && <li className="text-blue-700 dark:text-blue-300">★ Kingmaker: {TRAIT_BLURB.Kingmaker}</li>}
              {leader.traits.includes('Leadership') && <li className="text-blue-700 dark:text-blue-300">★ Leadership: {TRAIT_BLURB.Leadership}</li>}
            </>
          )}
        </ul>
        <div className="text-[11px] text-slate-500 mt-2">
          Era ({era}): ideology trigger weight {cfg.ideologyTriggerWeight}, patronage {cfg.patronageTriggerWeight};
          incumbency advantage {cfg.incumbencyAdvantage}; base fire chance {(cfg.baseFireChance * 100).toFixed(1)}%.
        </div>
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wide text-slate-500">Top Challengers</h3>
          <span title={ERA_RISK_BLURB[era]} className="text-[10px] text-slate-500 underline decoration-dotted cursor-help">Why?</span>
        </div>
        {leader && challengers.length > 0 ? (
          <ul className="text-sm space-y-1">
            {challengers.map((c) => {
              const { risk, threat } = preview(snapshot, f, leader, c);
              return (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span>
                    {c.firstName} {c.lastName} <span className="text-xs text-slate-500">{c.ideology} • PV {c.pvCache}</span>
                    {c.traits.filter((t) => POSITIVE_TRAITS.includes(t)).slice(0, 2).map((t) => (
                      <span key={t} className="ml-1 text-[10px] px-1 py-0 rounded bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">{t}</span>
                    ))}
                  </span>
                  <span className="text-xs">
                    Risk <span className="font-semibold">{(risk * 100).toFixed(1)}%</span> · Threat <span className="font-semibold">{(threat * 100).toFixed(0)}%</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-slate-400 text-sm">No credible challenger (no member at PV ≥ {LEADERSHIP_RULES.challengerPvFloor} without Failed Bid).</div>
        )}
      </div>

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Succession History</h3>
        {history.length === 0 ? (
          <div className="text-slate-400 text-sm">No leadership transitions yet.</div>
        ) : (
          <ul className="text-xs space-y-1">
            {history.map((e, i) => {
              const badge = e.kind === 'installed' ? 'Installed'
                : e.kind === 'challenged' ? (e.success ? 'Challenge Won' : 'Challenge Lost')
                : 'Vacated';
              const badgeColor = e.kind === 'installed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                : e.kind === 'challenged' && e.success ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                : e.kind === 'challenged' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
              return (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-slate-500 tabular-nums w-12">{e.year}</span>
                  <span className={`px-1.5 py-0.5 rounded ${badgeColor}`}>{badge}</span>
                  <span>
                    {e.kind === 'challenged' && !e.success
                      ? <>{polName(e.challengerId)} (failed bid)</>
                      : <>{polName(e.leaderId)}{e.formerLeaderId && <> (replaced {polName(e.formerLeaderId)})</>}</>}
                  </span>
                  {e.reason && <span className="text-slate-500">· {e.reason}</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
