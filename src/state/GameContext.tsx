import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FullGameSnapshot, EraEvent, Politician, ConstitutionalConvention } from '../types';
import { loadSnapshot, saveSnapshot, clearDb, exportJson, importJson } from '../db';
import { build1856Scenario } from '../data/scenario1856';
import { build1772Scenario } from '../data/scenario1772';
import { runCurrentPhase, advancePhase } from '../engine/engine';
import { playerDraftPick, resolveEraEvent } from '../engine/phaseRunners';
import { autoFillCPUVotes, applyConvention } from '../engine/constitutionalConvention';

type Modal =
  | { type: 'none' }
  | { type: 'draft'; pool: Politician[] }
  | { type: 'eraEvent'; event: EraEvent }
  | { type: 'convention'; convention: ConstitutionalConvention };

interface GameContextValue {
  snapshot: FullGameSnapshot | null;
  loading: boolean;
  modal: Modal;
  hasSave: boolean;
  startNewGame: (factionId: string, scenarioId?: '1772' | '1856') => Promise<void>;
  loadGame: () => Promise<void>;
  advance: () => Promise<void>;
  draftPick: (politicianId: string) => Promise<void>;
  chooseEraResponse: (eventId: string, responseId: string) => Promise<void>;
  setCareerTrack: (politicianId: string, track: Politician['careerTrack']) => Promise<void>;
  setConventionVote: (articleKey: string, optionId: string) => void;
  finalizeConvention: () => Promise<void>;
  toggleTheme: () => void;
  exportSave: () => Promise<string>;
  importSave: (json: string) => Promise<void>;
  resetGame: () => Promise<void>;
  theme: 'light' | 'dark';
}

const Ctx = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGame must be inside GameProvider');
  return v;
}

export function GameProvider({ children }: { children: ReactNode }): JSX.Element {
  const [snapshot, setSnapshot] = useState<FullGameSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>({ type: 'none' });
  const [hasSave, setHasSave] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ampu-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('ampu-theme', theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      const snap = await loadSnapshot();
      setHasSave(!!snap);
      setSnapshot(snap);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (s: FullGameSnapshot) => {
    await saveSnapshot(s);
    setHasSave(true);
  }, []);

  const startNewGame = useCallback(async (factionId: string, scenarioId: '1772' | '1856' = '1856') => {
    setLoading(true);
    await clearDb();
    const fresh = scenarioId === '1772' ? build1772Scenario(factionId) : build1856Scenario(factionId);
    await saveSnapshot(fresh);
    setSnapshot({ ...fresh });
    setHasSave(true);
    setLoading(false);
  }, []);

  const loadGame = useCallback(async () => {
    setLoading(true);
    const snap = await loadSnapshot();
    setSnapshot(snap);
    setLoading(false);
  }, []);

  const advance = useCallback(async () => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    // Run current phase
    const result = runCurrentPhase(draft);
    if (result.needsPlayerInput === 'draft') {
      setSnapshot(draft);
      setModal({ type: 'draft', pool: result.payload as Politician[] });
      await persist(draft);
      return;
    }
    if (result.needsPlayerInput === 'eraEvent') {
      setSnapshot(draft);
      setModal({ type: 'eraEvent', event: result.payload as EraEvent });
      await persist(draft);
      return;
    }
    if (result.needsPlayerInput === 'convention') {
      setSnapshot(draft);
      setModal({ type: 'convention', convention: result.payload as ConstitutionalConvention });
      await persist(draft);
      return;
    }
    // Otherwise, advance to next phase
    advancePhase(draft);
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const draftPick = useCallback(async (politicianId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    playerDraftPick(draft, politicianId);
    // Continue auto-pick for any remaining CPU picks until player needed again or done
    const result = runCurrentPhase(draft);
    if (result.needsPlayerInput === 'draft') {
      setSnapshot(draft);
      setModal({ type: 'draft', pool: result.payload as Politician[] });
      await persist(draft);
      return;
    }
    setModal({ type: 'none' });
    advancePhase(draft);
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const chooseEraResponse = useCallback(async (eventId: string, responseId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    resolveEraEvent(draft, eventId, responseId);
    // First check if a Convention modal popped from the resolution
    if (draft.game.pendingConvention && !draft.game.pendingConvention.resolved) {
      setSnapshot(draft);
      setModal({ type: 'convention', convention: draft.game.pendingConvention });
      await persist(draft);
      return;
    }
    // Check for additional unresolved era events already queued
    const more = draft.game.pendingEraEvents.find((e) => !e.resolved);
    if (more) {
      setSnapshot(draft);
      setModal({ type: 'eraEvent', event: more });
      await persist(draft);
      return;
    }
    // Re-run the current phase to surface the next scripted event (1772) or
    // recompute (1856 won't queue more in the same phase by default).
    const replay = runCurrentPhase(draft);
    if (replay.needsPlayerInput === 'eraEvent') {
      setSnapshot(draft);
      setModal({ type: 'eraEvent', event: replay.payload as EraEvent });
      await persist(draft);
      return;
    }
    if (replay.needsPlayerInput === 'convention') {
      setSnapshot(draft);
      setModal({ type: 'convention', convention: replay.payload as import('../types').ConstitutionalConvention });
      await persist(draft);
      return;
    }
    setModal({ type: 'none' });
    // Clear queue and advance
    draft.game.pendingEraEvents = [];
    advancePhase(draft);
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const setConventionVote = useCallback((articleKey: string, optionId: string): void => {
    if (!snapshot?.game.pendingConvention) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    const conv = draft.game.pendingConvention!;
    const vote = conv.votes.find((v) => v.articleKey === articleKey);
    if (vote) vote.selected = optionId;
    setSnapshot(draft);
    setModal({ type: 'convention', convention: conv });
  }, [snapshot]);

  const finalizeConvention = useCallback(async () => {
    if (!snapshot?.game.pendingConvention) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    const conv = draft.game.pendingConvention!;
    autoFillCPUVotes(draft, conv);
    applyConvention(draft, conv);
    draft.game.pendingConvention = null;
    setModal({ type: 'none' });
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const setCareerTrack = useCallback(async (politicianId: string, track: Politician['careerTrack']) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    const p = draft.politicians.find((pp) => pp.id === politicianId);
    if (!p) return;
    if (p.factionId !== draft.game.playerFactionId) return;
    if (p.currentOffice) return;
    p.careerTrack = track;
    p.careerTrackYears = 0;
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const exportSave = useCallback(async () => exportJson(), []);
  const importSave = useCallback(async (json: string) => {
    await importJson(json);
    await loadGame();
  }, [loadGame]);

  const resetGame = useCallback(async () => {
    await clearDb();
    setSnapshot(null);
    setHasSave(false);
  }, []);

  const value: GameContextValue = {
    snapshot,
    loading,
    modal,
    hasSave,
    startNewGame,
    loadGame,
    advance,
    draftPick,
    chooseEraResponse,
    setCareerTrack,
    setConventionVote,
    finalizeConvention,
    toggleTheme,
    exportSave,
    importSave,
    resetGame,
    theme,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
