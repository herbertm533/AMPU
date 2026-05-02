import { useGame } from '../state/GameContext';
import { PartyBadge } from '../components/PartyBadge';
import type { OfficeType } from '../types';

const POSITIONS: OfficeType[] = [
  'KeyAdvisor',
  'SecretaryOfState',
  'SecretaryOfTreasury',
  'SecretaryOfWar',
  'AttorneyGeneral',
  'PostmasterGeneral',
  'GeneralInChief',
  'Admiral',
];

export function CabinetPage(): JSX.Element {
  const { snapshot } = useGame();
  if (!snapshot) return <div />;
  const president = snapshot.politicians.find((p) => p.id === snapshot.game.presidentId);
  const vp = snapshot.politicians.find((p) => p.id === snapshot.game.vicePresidentId);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">President & Cabinet</h2>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-xs uppercase text-slate-500">President</div>
          {president ? (
            <div>
              <div className="font-bold text-lg">{president.firstName} {president.lastName} <PartyBadge party={president.partyId} /></div>
              <div className="text-xs text-slate-500">{president.ideology} • {president.state.toUpperCase()} • Age {president.age} • PV {president.pvCache}</div>
            </div>
          ) : <div className="text-slate-400">Vacant</div>}
        </div>
        <div>
          <div className="text-xs uppercase text-slate-500">Vice President</div>
          {vp ? (
            <div>
              <div className="font-bold text-lg">{vp.firstName} {vp.lastName} <PartyBadge party={vp.partyId} /></div>
              <div className="text-xs text-slate-500">{vp.ideology} • {vp.state.toUpperCase()} • Age {vp.age}</div>
            </div>
          ) : <div className="text-slate-400">Vacant</div>}
        </div>
      </div>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr><th className="px-2 py-1.5 text-left">Position</th><th className="px-2 py-1.5 text-left">Name</th><th className="px-2 py-1.5 text-left">State</th><th className="px-2 py-1.5 text-left">Skill</th></tr>
          </thead>
          <tbody>
            {POSITIONS.map((pos) => {
              const id = snapshot.game.cabinet[pos];
              const p = id ? snapshot.politicians.find((pp) => pp.id === id) : null;
              return (
                <tr key={pos} className="border-b border-slate-200 dark:border-slate-700/50">
                  <td className="px-2 py-1 font-semibold">{pos}</td>
                  <td className="px-2 py-1">{p ? `${p.firstName} ${p.lastName}` : <span className="text-slate-400">Vacant</span>}</td>
                  <td className="px-2 py-1">{p?.state.toUpperCase()}</td>
                  <td className="px-2 py-1">{p ? `Adm ${p.skills.admin} / Mil ${p.skills.military}` : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
