import { useGame } from '../state/GameContext';
import { CAREER_TRACKS } from '../types';
import type { Politician } from '../types';

export function CareerTracks(): JSX.Element {
  const { snapshot, setCareerTrack } = useGame();
  if (!snapshot) return <div />;
  const mine = snapshot.politicians.filter((p) => p.factionId === snapshot.game.playerFactionId && !p.deathYear && !p.retiredYear);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Career Tracks</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Politicians on a track gain skill every 4 years but cannot hold office. Politicians currently in office cannot be assigned a track.
      </p>
      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr>
              <th className="px-2 py-1.5 text-left">Name</th>
              <th className="px-2 py-1.5 text-left">State</th>
              <th className="px-2 py-1.5 text-left">Office / Status</th>
              <th className="px-2 py-1.5 text-left">Current Track</th>
              <th className="px-2 py-1.5 text-left">Years</th>
              <th className="px-2 py-1.5 text-left">Assign</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((p) => (
              <tr key={p.id} className="border-b border-slate-200 dark:border-slate-700/50">
                <td className="px-2 py-1 font-semibold">{p.firstName} {p.lastName}</td>
                <td className="px-2 py-1">{p.state.toUpperCase()}</td>
                <td className="px-2 py-1 text-xs">{p.currentOffice ? p.currentOffice.type : <span className="text-slate-400">Free</span>}</td>
                <td className="px-2 py-1">{p.careerTrack ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-2 py-1">{p.careerTrackYears}</td>
                <td className="px-2 py-1">
                  {p.currentOffice ? (
                    <span className="text-xs text-slate-400">In office</span>
                  ) : (
                    <select
                      value={p.careerTrack ?? ''}
                      onChange={(e) => setCareerTrack(p.id, (e.target.value || null) as Politician['careerTrack'])}
                      className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs"
                    >
                      <option value="">— None —</option>
                      {CAREER_TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
