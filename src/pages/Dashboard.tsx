import { useGame } from '../state/GameContext';
import { Meter } from '../components/Meter';
import { PartyBadge } from '../components/PartyBadge';
import { EraTimeline } from '../components/EraTimeline';
import type { MeterKey } from '../types';

const METER_KEYS: MeterKey[] = ['revenue', 'economic', 'military', 'domestic', 'honest', 'quality', 'planet'];

export function Dashboard(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const { game, politicians, factions, states, events } = snapshot;
  const president = politicians.find((p) => p.id === game.presidentId);
  const vp = politicians.find((p) => p.id === game.vicePresidentId);
  const playerFaction = factions.find((f) => f.id === game.playerFactionId);
  const playerMembers = politicians.filter((p) => p.factionId === game.playerFactionId && !p.deathYear && !p.retiredYear);
  const speaker = politicians.find((p) => p.id === game.speakerId);
  const proTem = politicians.find((p) => p.id === game.proTemId);
  const recent = [...events].slice(-10).reverse();

  // Senate / House composition
  const senate = states.flatMap((s) => s.senators.map((sn) => politicians.find((p) => p.id === sn.politicianId))).filter(Boolean);
  const house = states.flatMap((s) => s.representativeIds.map((id) => politicians.find((p) => p.id === id))).filter(Boolean);
  const senateBlue = senate.filter((m) => m?.partyId === 'BLUE').length;
  const senateRed = senate.filter((m) => m?.partyId === 'RED').length;
  const houseBlue = house.filter((m) => m?.partyId === 'BLUE').length;
  const houseRed = house.filter((m) => m?.partyId === 'RED').length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Dashboard — {game.year - 1}-{game.year + 1}</h2>
      {snapshot.game.scenarioId === '1772' && <EraTimeline snapshot={snapshot} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Your Faction</h3>
          <div className="font-semibold text-base flex items-center gap-2">
            <PartyBadge party={playerFaction?.partyId ?? null} />
            {playerFaction?.name}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Members: {playerMembers.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Personality: {playerFaction?.personality}</div>
          <div className="mt-2 text-xs">
            Top PV: {playerMembers.sort((a, b) => b.pvCache - a.pvCache).slice(0, 3).map((p) => `${p.firstName} ${p.lastName} (${p.pvCache})`).join(', ')}
          </div>
        </div>

        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Government</h3>
          <div className="text-sm space-y-1">
            {game.currentEra === 'independence' ? (
              <>
                <div>CC President: <span className="font-semibold">{(() => { const cc = game.continentalCongress; const p = cc?.presidentId ? politicians.find((pp) => pp.id === cc.presidentId) : null; return p ? `${p.firstName} ${p.lastName}` : 'Vacant'; })()}</span></div>
                <div>Articles in effect: {game.articlesOfConfederation ? 'Yes' : 'No'}</div>
                <div>Constitution ratified: {game.constitutionRatified ? 'Yes' : 'No'}</div>
                <div>Governors exist: {game.governorsExist ? 'Yes' : 'No'}</div>
              </>
            ) : (
              <>
                <div>President: <span className="font-semibold">{president ? `${president.firstName} ${president.lastName}` : 'Vacant'}</span> {president && <PartyBadge party={president.partyId} />}</div>
                <div>VP: <span>{vp ? `${vp.firstName} ${vp.lastName}` : 'Vacant'}</span></div>
                <div>Speaker: <span>{speaker ? `${speaker.firstName} ${speaker.lastName}` : 'Vacant'}</span></div>
                <div>Pro Tem: <span>{proTem ? `${proTem.firstName} ${proTem.lastName}` : 'Vacant'}</span></div>
              </>
            )}
          </div>
        </div>

        <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">{game.currentEra === 'independence' ? 'Continental Congress' : 'Congress Composition'}</h3>
          <div className="text-sm">
            {game.currentEra === 'independence' ? (
              <>
                <div>Delegates: <span className="font-semibold">{game.continentalCongress?.delegates.length ?? 0}</span></div>
                <div>Threshold: <span className="font-semibold">{game.articlesOfConfederation ? '2/3 of states' : 'Majority of states'}</span></div>
                <div className="mt-2 text-xs text-slate-500">Rev War: {game.revolutionaryWar?.active ? 'ACTIVE' : (game.revolutionaryWar?.outcome ?? 'not started')}</div>
              </>
            ) : (
              <>
                <div>Senate: <span className="text-blue-600 dark:text-blue-400 font-semibold">{senateBlue}D</span> — <span className="text-red-600 dark:text-red-400 font-semibold">{senateRed}R</span></div>
                <div>House: <span className="text-blue-600 dark:text-blue-400 font-semibold">{houseBlue}D</span> — <span className="text-red-600 dark:text-red-400 font-semibold">{houseRed}R</span></div>
                <div className="mt-2 text-xs text-slate-500">Active wars: {game.wars.length}</div>
                <div className="text-xs text-slate-500">National Debt: ${(game.nationalDebt / 1_000_000).toFixed(1)}M</div>
              </>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold mt-2">National Meters</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {METER_KEYS.map((k) => (
          <Meter key={k} k={k} value={game.meters[k]} />
        ))}
      </div>

      <h3 className="text-sm font-semibold mt-4">Recent Events</h3>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 max-h-72 overflow-y-auto text-sm">
        {recent.map((e) => (
          <div key={e.id} className="border-b border-slate-200 dark:border-slate-700/50 px-2 py-1 last:border-0">
            <span className="text-xs text-slate-500 mr-2">[{e.year}]</span>
            <span className="text-xs uppercase text-slate-400 mr-2">{e.category}</span>
            {e.text}
          </div>
        ))}
      </div>
    </div>
  );
}
