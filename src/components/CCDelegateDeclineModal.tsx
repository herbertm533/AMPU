import type { Politician } from '../types';

export function CCDelegateDeclineModal({
  politician,
  colonyName,
  onAccept,
  onDecline,
}: {
  politician: Politician;
  colonyName: string;
  onAccept: () => void;
  onDecline: () => void;
}): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700">
        <div className="border-b border-slate-300 dark:border-slate-700 px-4 py-3 bg-amber-50 dark:bg-amber-900/30">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">Career Track Decision</div>
          <h2 className="text-lg font-bold">{politician.firstName} {politician.lastName}</h2>
          <p className="text-xs text-slate-500">{colonyName} delegation</p>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <p>
            <span className="font-semibold">{politician.firstName} {politician.lastName}</span> is
            invested in the <span className="font-semibold">{politician.careerTrack}</span> track
            ({politician.careerTrackYears} year{politician.careerTrackYears === 1 ? '' : 's'}).
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            Accepting the appointment to the Continental Congress will end their career track.
            They may also decline the seat — the slot stays open and you can choose another politician.
          </p>
        </div>
        <div className="border-t border-slate-300 dark:border-slate-700 p-3 flex justify-end gap-2">
          <button
            onClick={onDecline}
            className="rounded border border-slate-300 dark:border-slate-700 px-4 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
