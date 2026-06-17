import { useState, useMemo } from 'react';
import { useGame } from '../state/GameContext';
import type { Era, EventEntry } from '../types';
import { ANYTIME_EVENT_TEMPLATES, type AnytimeEventTemplate } from '../data/anytimeEvents';
import { ANYTIME_NATIONAL_TEMPLATES, type AnytimeNationalTemplate } from '../data/anytimeNationalEvents';
import { formatAnytimePersonalEffect, formatAnytimeNationalEffect, type EffectChip } from '../engine/labels';
import { RunNextEventButton } from '../components/EventChips';

type Pool = 'all' | 'personal' | 'national';
type FactionMode = 'all' | 'mine';

interface AnytimeEventMeta {
  templateId: string;
  politicianId?: string;
  pool: 'personal' | 'national';
  category: string;
  pvDelta?: number;
}

function eraForYear(year: number): Era {
  if (year < 1789) return 'independence';
  if (year < 1830) return 'federalism';
  if (year < 1933) return 'nationalism';
  return 'modern';
}

const PERSONAL_CATEGORIES: AnytimeEventTemplate['category'][] = [
  'illness-acute', 'illness-chronic', 'illness-epidemic',
  'injury', 'transport-accident',
  'violence-duel', 'violence-assault', 'violence-assassination',
  'scandal-financial', 'scandal-sexual', 'scandal-verbal',
  'breakthrough-speech', 'breakthrough-crisis',
  'family-event', 'financial-event', 'war-service',
];

const NATIONAL_CATEGORIES: AnytimeNationalTemplate['category'][] = [
  'economic-panic', 'economic-boom', 'economic-harvest',
  'economic-currency', 'economic-tariff', 'economic-commodity',
  'demographic-immigration', 'demographic-migration',
  'demographic-urbanization', 'demographic-frontier',
  'foreign-trade', 'foreign-war-scare', 'foreign-treaty', 'foreign-ally-shift',
  'civic-state-ripple', 'civic-executive-scandal', 'civic-patriotic-groundswell',
  'cultural-revival', 'cultural-reform', 'cultural-technology',
  'natural-storm', 'natural-epidemic',
];

const PERSONAL_TEMPLATE_BY_ID = new Map(ANYTIME_EVENT_TEMPLATES.map((t) => [t.id, t] as const));
const NATIONAL_TEMPLATE_BY_ID = new Map(ANYTIME_NATIONAL_TEMPLATES.map((t) => [t.id, t] as const));

function categoryColor(cat: string): string {
  if (cat.startsWith('illness')) return 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200';
  if (cat.startsWith('scandal') || cat === 'civic-executive-scandal') return 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200';
  if (cat.startsWith('breakthrough') || cat === 'civic-patriotic-groundswell') return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200';
  if (cat.startsWith('violence')) return 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200';
  if (cat === 'transport-accident' || cat === 'injury' || cat === 'civic-state-ripple') return 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-200';
  if (cat.startsWith('economic')) return 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200';
  if (cat.startsWith('demographic')) return 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-200';
  if (cat.startsWith('foreign')) return 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200';
  if (cat.startsWith('cultural')) return 'bg-pink-100 text-pink-900 dark:bg-pink-900/40 dark:text-pink-200';
  if (cat.startsWith('natural')) return 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200';
  return 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-200';
}

function chipToneClass(tone: EffectChip['tone']): string {
  switch (tone) {
    case 'positive': return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200';
    case 'negative': return 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200';
    case 'war':      return 'bg-red-200 text-red-900 font-bold';
    case 'anachronism': return 'bg-amber-200 text-amber-900 italic';
    default:         return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200';
  }
}

export function AnytimeEventsPage(): JSX.Element {
  const { snapshot } = useGame();
  const [pool, setPool] = useState<Pool>('all');
  const [era, setEra] = useState<Era | 'all'>(snapshot?.game.currentEra ?? 'all');
  const [category, setCategory] = useState<string>('all');
  const [factionMode, setFactionMode] = useState<FactionMode>('mine');
  const [showRetired, setShowRetired] = useState(false);
  const [politicianFilter, setPoliticianFilter] = useState<string | null>(null);

  const allEvents = useMemo(() => {
    if (!snapshot) return [] as EventEntry[];
    return [...snapshot.events].filter((e) => e.phase === '2.4.2').sort((a, b) => b.year - a.year);
  }, [snapshot]);

  if (!snapshot) return <div />;

  const playerFactionId = snapshot.game.playerFactionId;

  const filtered = allEvents.filter((e) => {
    const meta = (e.meta ?? {}) as Partial<AnytimeEventMeta>;
    if (pool !== 'all' && meta.pool !== pool) return false;
    if (era !== 'all' && eraForYear(e.year) !== era) return false;
    if (category !== 'all' && meta.category !== category) return false;
    if (politicianFilter && meta.politicianId !== politicianFilter) return false;
    if (factionMode === 'mine' && meta.pool === 'personal') {
      const p = snapshot.politicians.find((pp) => pp.id === meta.politicianId);
      if (!p || p.factionId !== playerFactionId) return false;
    }
    if (!showRetired && meta.pool === 'personal' && meta.politicianId) {
      const p = snapshot.politicians.find((pp) => pp.id === meta.politicianId);
      if (p && (p.deathYear || p.retiredYear)) return false;
    }
    return true;
  });

  const focusedPolitician = politicianFilter ? snapshot.politicians.find((p) => p.id === politicianFilter) ?? null : null;
  const personalEventsForFocus = focusedPolitician
    ? allEvents.filter((e) => ((e.meta ?? {}) as Partial<AnytimeEventMeta>).politicianId === focusedPolitician.id).length
    : 0;

  const categoryOptions: string[] = pool === 'personal'
    ? PERSONAL_CATEGORIES
    : pool === 'national'
      ? NATIONAL_CATEGORIES
      : [...PERSONAL_CATEGORIES, ...NATIONAL_CATEGORIES];

  const inEventsPhase = snapshot.game.phaseId === '2.4.2';
  const lastSurfacedHead = snapshot.game.lastAnytimeFeedHeadId;
  const newlyFiredIds = new Set(snapshot.game.newlyFiredEventIds ?? []);
  // Anything in newlyFiredEventIds OR (if the bookmark exists) anything newer
  // than the bookmark counts as "just fired."
  const lastSurfacedIdx = lastSurfacedHead
    ? allEvents.findIndex((e) => e.id === lastSurfacedHead)
    : -1;
  const isJustFired = (e: EventEntry): boolean => {
    if (newlyFiredIds.has(e.id)) return true;
    if (lastSurfacedHead && lastSurfacedIdx >= 0) {
      // allEvents is sorted desc by year (newer first). Indexes 0..lastSurfacedIdx-1
      // are newer than the bookmark.
      const idx = allEvents.findIndex((ev) => ev.id === e.id);
      return idx >= 0 && idx < lastSurfacedIdx;
    }
    return false;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold flex-1">Anytime Events — {allEvents.length} events</h2>
        {inEventsPhase && <RunNextEventButton phaseId="2.4.2" />}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="flex items-center gap-1">
          <span className="text-xs text-slate-500">Pool</span>
          <select value={pool} onChange={(e) => { setPool(e.target.value as Pool); setCategory('all'); }} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm">
            <option value="all">All</option>
            <option value="personal">Personal</option>
            <option value="national">National</option>
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-xs text-slate-500">Era</span>
          <select value={era} onChange={(e) => setEra(e.target.value as Era | 'all')} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm">
            <option value="all">All eras</option>
            <option value="independence">Independence</option>
            <option value="federalism">Federalism</option>
            <option value="nationalism">Nationalism</option>
            <option value="modern">Modern</option>
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-xs text-slate-500">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm">
            <option value="all">All</option>
            {pool === 'all' ? (
              <>
                <optgroup label="Personal">
                  {PERSONAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </optgroup>
                <optgroup label="National">
                  {NATIONAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </optgroup>
              </>
            ) : (
              categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)
            )}
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-xs text-slate-500">Faction</span>
          <select value={factionMode} onChange={(e) => setFactionMode(e.target.value as FactionMode)} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm">
            <option value="all">All factions</option>
            <option value="mine">Your faction</option>
          </select>
        </label>

        <label className="flex items-center gap-1 cursor-pointer">
          <input type="checkbox" checked={showRetired} onChange={(e) => setShowRetired(e.target.checked)} />
          <span className="text-xs">Show retired / dead</span>
        </label>
      </div>

      {focusedPolitician && (
        <div className="rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 p-3 text-sm flex items-center gap-3">
          <div className="flex-1">
            <div className="font-semibold">{focusedPolitician.firstName} {focusedPolitician.lastName}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              age {focusedPolitician.age} · {focusedPolitician.state.toUpperCase()} · {focusedPolitician.ideology} · faction {focusedPolitician.factionId ?? '—'} · {personalEventsForFocus} event(s)
            </div>
          </div>
          <button onClick={() => setPoliticianFilter(null)} className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs hover:bg-slate-200 dark:hover:bg-slate-700">Clear</button>
        </div>
      )}

      <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 max-h-[70vh] overflow-y-auto text-sm">
        {filtered.slice(0, 500).map((e) => {
          const meta = (e.meta ?? {}) as Partial<AnytimeEventMeta>;
          const tpl = meta.pool === 'national'
            ? (meta.templateId ? NATIONAL_TEMPLATE_BY_ID.get(meta.templateId) ?? null : null)
            : (meta.templateId ? PERSONAL_TEMPLATE_BY_ID.get(meta.templateId) ?? null : null);
          const chips: EffectChip[] = tpl
            ? (meta.pool === 'national'
              ? formatAnytimeNationalEffect((tpl as AnytimeNationalTemplate).effects)
              : formatAnytimePersonalEffect((tpl as AnytimeEventTemplate).effects))
            : [];
          const politician = meta.politicianId ? snapshot.politicians.find((p) => p.id === meta.politicianId) ?? null : null;
          const justFired = isJustFired(e);
          return (
            <div key={e.id} className={`border-b border-slate-200 dark:border-slate-700/50 px-2 py-2 last:border-0 space-y-1 ${justFired ? 'border-l-4 border-l-amber-400 dark:border-l-amber-600 bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 tabular-nums">[{e.year}]</span>
                <span className={`text-[10px] uppercase rounded px-1.5 py-0.5 ${meta.pool === 'national' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-200'}`}>
                  {meta.pool === 'national' ? 'National' : 'Personal'}
                </span>
                {meta.category && (
                  <span className={`text-[10px] uppercase rounded px-1.5 py-0.5 ${categoryColor(meta.category)}`}>
                    {meta.category}
                  </span>
                )}
                {justFired && (
                  <span className="text-[10px] uppercase rounded px-1.5 py-0.5 bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 font-bold">
                    Just fired
                  </span>
                )}
                {politician && (
                  <button
                    onClick={() => setPoliticianFilter(politician.id)}
                    className="text-xs font-medium text-blue-600 dark:text-blue-300 hover:underline"
                  >
                    {politician.firstName} {politician.lastName}
                  </button>
                )}
              </div>
              <div>{e.text}</div>
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {chips.map((c, i) => (
                    <span key={i} className={`text-[10px] rounded px-1.5 py-0.5 ${chipToneClass(c.tone)}`}>{c.label}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-2 py-3 text-center text-slate-400">No anytime events match these filters.</div>
        )}
      </div>
    </div>
  );
}
