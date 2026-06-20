import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FullGameSnapshot, EraEvent, ConstitutionalConvention, Politician, Expertise, Trait } from '../types';
import { ALIGNMENT_RULES } from '../types';
import { loadSnapshot, saveSnapshot, clearDb, exportJson, importJson } from '../db';
import { build1856Scenario } from '../data/scenario1856';
import { build1772Scenario } from '../data/scenario1772';
import { runCurrentPhase, advancePhase } from '../engine/engine';
import { playerDraftPick, resolveEraEvent, simOneDraftPick, autoPickForPlayer, setPlayerCareerTrack, attemptPlayerRelocation, attemptPlayerIdeologyShift, attemptPlayerConversion, assignProtege, releaseProtege, playerCCDelegatePick, playerCCDelegateDecline, confirmCCAIPick } from '../engine/phaseRunners';
import { autoFillCPUVotes, applyConvention } from '../engine/constitutionalConvention';
import { parseDraftCsv, type ParseResult } from '../data/draftImport';
import { admitState } from '../engine/territories';
import { loadStandardDraftClasses } from '../data/standardDraftClasses';

type Modal =
  | { type: 'none' }
  | { type: 'eraEvent'; event: EraEvent; mode?: 'pick' | 'acknowledge' }
  | { type: 'convention'; convention: ConstitutionalConvention };

interface GameContextValue {
  snapshot: FullGameSnapshot | null;
  loading: boolean;
  modal: Modal;
  hasSave: boolean;
  startNewGame: (factionId: string, scenarioId?: '1772' | '1856') => Promise<void>;
  loadGame: () => Promise<void>;
  advance: () => Promise<void>;
  runEventsNow: () => Promise<void>;
  draftPick: (politicianId: string) => Promise<void>;
  simOnePick: () => Promise<void>;
  simToMyNextPick: () => Promise<void>;
  simToEndOfDraft: () => Promise<void>;
  chooseEraResponse: (eventId: string, responseId: string) => Promise<void>;
  acknowledgeEraEvent: () => void;
  setCareerTrack: (politicianId: string, track: Politician['careerTrack']) => Promise<void>;
  attemptRelocation: (politicianId: string, destStateId: string) => Promise<void>;
  attemptIdeologyShift: (politicianId: string) => Promise<void>;
  attemptConversion: (politicianId: string) => Promise<void>;
  assignProtege: (kingmakerId: string, protegeId: string) => Promise<void>;
  releaseProtege: (kingmakerId: string) => Promise<void>;
  setConventionVote: (articleKey: string, optionId: string) => void;
  finalizeConvention: () => Promise<void>;
  toggleTheme: () => void;
  exportSave: () => Promise<string>;
  importSave: (json: string) => Promise<void>;
  importDraftDataset: (csv: string, mode: 'replace' | 'merge') => Promise<ParseResult>;
  clearDraftDataset: () => Promise<void>;
  admitTerritory: (stateId: string) => Promise<void>;
  pickCCDelegate: (stateId: string, politicianId: string) => Promise<void>;
  declineCCDelegate: (stateId: string, politicianId: string) => Promise<void>;
  confirmCCAIPick: () => Promise<void>;
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
  // Auto-resolved era-event acknowledgements pending UI surface, one at a time.
  // Lives in React state only; dropped on reload per spec edge case.
  const [ackQueue, setAckQueue] = useState<EraEvent[]>([]);
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

  const persist = useCallback(async (s: FullGameSnapshot) => {
    await saveSnapshot(s);
    setHasSave(true);
  }, []);

  // Repair any stuck states left behind by an older buggy build before
  // surfacing the snapshot to the UI.
  const repair = useCallback((s: FullGameSnapshot): FullGameSnapshot => {
    let dirty = false;
    // Stuck-draft repair: a draft schedule with no eligible politicians left.
    const eligible = s.politicians.filter((p) => s.game.pendingDraftPool.includes(p.id));
    if (eligible.length === 0 && s.game.draftRoundOrder.length > 0) {
      s.game.draftRoundOrder = [];
      s.game.pendingDraftPool = [];
      dirty = true;
    }
    // Backfill draftedYear for politicians who already have a faction but no
    // draftedYear (saved before that field existed).
    const haveFaction = s.politicians.filter((p) => p.factionId && p.draftedYear == null);
    if (haveFaction.length > 0) {
      for (const p of haveFaction) p.draftedYear = s.game.startYear;
      if (s.game.lastDraftYear == null) s.game.lastDraftYear = s.game.startYear;
      dirty = true;
    }
    // Backfill draftHistory for legacy saves. Pick order is unrecoverable, so
    // sort by pvCache desc within each year as a best-effort proxy.
    if (s.game.draftHistory == null) {
      const byYear = new Map<number, typeof s.politicians>();
      for (const p of s.politicians) {
        if (p.factionId && p.draftedYear != null) {
          const arr = byYear.get(p.draftedYear) ?? [];
          arr.push(p);
          byYear.set(p.draftedYear, arr);
        }
      }
      const factionCount = Math.max(1, s.factions.length);
      const years: { year: number; picks: { pickNumber: number; round: number; factionId: string; politicianId: string }[] }[] = [];
      for (const [year, group] of byYear) {
        group.sort((a, b) => b.pvCache - a.pvCache);
        years.push({
          year,
          picks: group.map((p, i) => ({
            pickNumber: i + 1,
            round: Math.ceil((i + 1) / factionCount),
            factionId: p.factionId!,
            politicianId: p.id,
          })),
        });
      }
      years.sort((a, b) => a.year - b.year);
      s.game.draftHistory = years;
      dirty = true;
    }
    if (s.game.halfTermSummaries == null) {
      s.game.halfTermSummaries = [];
      dirty = true;
    }
    // Legacy career-track migration, gated on the careerGains sentinel: the
    // old system stalled at years >= 4 with no payoff; restart those at 2 so
    // threshold #1 fires on the next accruing tick. Must NEVER run on a
    // post-feature save (the 2.1.2 tick eagerly inits careerGains).
    if (s.game.careerGains == null) {
      s.game.careerGains = [];
      for (const p of s.politicians) {
        if (p.careerTrack && !p.factionId) {
          p.careerTrack = null;
          p.careerTrackYears = 0;
        } else if (p.careerTrack && p.careerTrackYears >= 4) {
          p.careerTrackYears = 2;
        }
      }
      dirty = true;
    }
    // Defensive card-id filter — strip unknown ids so drift reads never resolve undefined.
    const validInterest = new Set(Object.keys(ALIGNMENT_RULES.interestCardBucket));
    const validLobby = new Set(Object.keys(ALIGNMENT_RULES.lobbyToInterest));
    const validIdeology = new Set(Object.keys(ALIGNMENT_RULES.ideologyCardBucket));
    for (const f of s.factions) {
      const ic = f.interestCards.filter((c) => validInterest.has(c));
      const lc = f.lobbyCards.filter((c) => validLobby.has(c));
      const ig = f.ideologyCards.filter((c) => validIdeology.has(c));
      if (ic.length !== f.interestCards.length) { f.interestCards = ic as typeof f.interestCards; dirty = true; }
      if (lc.length !== f.lobbyCards.length) { f.lobbyCards = lc as typeof f.lobbyCards; dirty = true; }
      if (ig.length !== f.ideologyCards.length) { f.ideologyCards = ig as typeof f.ideologyCards; dirty = true; }
    }
    // Expertise axis (PR1): init missing arrays + migrate the 8 legacy trait
    // strings off pre-PR1 saves onto the expertise axis (D3 Option A). The
    // Trait union no longer includes these, so on an old save they arrive as
    // now-unknown strings — strip them and re-home them as expertise.
    const LEGACY_EXPERTISE: Record<string, Expertise> = {
      Agriculture: 'Agriculture', Business: 'Business', Economics: 'Economics',
      Education: 'Education', Environment: 'Environment', Media: 'Media',
      Military: 'Military', Naval: 'Naval',
    };
    for (const p of s.politicians) {
      if (p.expertise == null) { p.expertise = []; dirty = true; }
      const keptTraits: Trait[] = [];
      let changed = false;
      for (const t of p.traits as unknown as string[]) {
        const xp = LEGACY_EXPERTISE[t];
        if (xp) {
          changed = true;
          if (!p.expertise.includes(xp)) p.expertise.push(xp);
        } else {
          keptTraits.push(t as Trait);
        }
      }
      if (changed) { p.traits = keptTraits; dirty = true; }
    }
    // PR5: scrub legacy cabinet seats (KeyAdvisor, Admiral) dropped as valid
    // cabinet entries. Politicians whose currentOffice.type === 'KeyAdvisor'
    // get their office nulled; 'Admiral' currentOffice is preserved (it's a
    // legitimate Rev War combat-role assignment, not a cabinet seat).
    const legacyCabinetKeys = ['KeyAdvisor', 'Admiral'] as const;
    const cabinetAsAny = s.game.cabinet as unknown as Record<string, string | null | undefined>;
    let cabinetDropped = false;
    for (const k of legacyCabinetKeys) {
      if (k in cabinetAsAny) {
        delete cabinetAsAny[k];
        cabinetDropped = true;
      }
    }
    let politicianDropped = false;
    for (const p of s.politicians) {
      const office = p.currentOffice as { type: string } | null;
      if (office && office.type === 'KeyAdvisor') {
        p.currentOffice = null;
        politicianDropped = true;
      }
    }
    if (cabinetDropped || politicianDropped) {
      dirty = true;
      // eslint-disable-next-line no-console
      console.log('[migration] PR5: dropped legacy KeyAdvisor cabinet field and currentOffice references.');
    }
    return dirty ? { ...s } : s;
  }, []);

  useEffect(() => {
    (async () => {
      // Load the full standard dataset before the game is interactive so the
      // 1772 inaugural draft (and every later draft) is built off the same
      // data. Race a timeout so a slow/failed fetch can't hang startup — the
      // curated built-in then serves as the resilience fallback.
      await Promise.race([
        loadStandardDraftClasses(),
        new Promise((r) => setTimeout(r, 12000)),
      ]);
      const snap = await loadSnapshot();
      setHasSave(!!snap);
      if (snap) {
        const repaired = repair(snap);
        setSnapshot(repaired);
        if (repaired !== snap) await saveSnapshot(repaired);
      } else {
        setSnapshot(null);
      }
      setLoading(false);
    })();
  }, [repair]);

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
    if (snap) {
      const repaired = repair(snap);
      setSnapshot(repaired);
      if (repaired !== snap) await saveSnapshot(repaired);
    } else {
      setSnapshot(null);
    }
    setLoading(false);
  }, [repair]);

  // Filter out terminal-ending acknowledgements (defense in depth on top of the
  // engine-side F6 exclusion) and queue the rest. Returns the head event to
  // surface immediately, or null if nothing to enqueue.
  const enqueueAcks = useCallback((draft: FullGameSnapshot, acks: EraEvent[] | undefined): EraEvent | null => {
    if (!acks || acks.length === 0) return null;
    const endedTpl = draft.game.gameEnded?.templateId;
    const filtered = acks.filter((e) => !endedTpl || e.templateId !== endedTpl);
    if (filtered.length === 0) return null;
    const [head, ...rest] = filtered;
    if (rest.length > 0) setAckQueue((q) => [...q, ...rest]);
    return head;
  }, []);

  const advance = useCallback(async () => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    // Snapshot the pre-run state so we can detect a "fresh" First-CC build
    // (delegates list went from 0 to >0 inside this advance call).
    const ccBefore = snapshot.game.continentalCongress?.delegates.length ?? 0;
    // Run current phase
    const result = runCurrentPhase(draft);
    if (result.needsPlayerInput === 'draft') {
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    if (result.needsPlayerInput === 'eraEvent') {
      setSnapshot(draft);
      const ackHead = enqueueAcks(draft, result.acknowledgements);
      if (ackHead) {
        setModal({ type: 'eraEvent', event: ackHead, mode: 'acknowledge' });
      } else {
        setModal({ type: 'eraEvent', event: result.payload as EraEvent });
      }
      await persist(draft);
      return;
    }
    if (result.needsPlayerInput === 'convention') {
      setSnapshot(draft);
      setModal({ type: 'convention', convention: result.payload as ConstitutionalConvention });
      await persist(draft);
      return;
    }
    if (result.needsPlayerInput === 'ccBuilder' || result.needsPlayerInput === 'ccAIConfirm') {
      // The First-CC builder owns this surface for both player-pick colonies
      // and AI-Pick Card animation steps. App.tsx auto-navigates via the
      // cursor sentinel. Persist and let the page take over.
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    // Pause on the First-CC roster summary so the player sees the seated CC
    // before advancing. Only fire when this advance() call IS the one that
    // built the CC — repeat Continue clicks fall through to advancePhase.
    const ccAfter = draft.game.continentalCongress?.delegates.length ?? 0;
    if (
      draft.game.phaseId === '2.9.6'
      && draft.game.scenarioId === '1772'
      && draft.game.ccBuilderCursor == null
      && ccBefore === 0
      && ccAfter > 0
    ) {
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    // Otherwise, advance to next phase
    advancePhase(draft);
    setSnapshot(draft);
    const ackHead = enqueueAcks(draft, result.acknowledgements);
    if (ackHead) {
      setModal({ type: 'eraEvent', event: ackHead, mode: 'acknowledge' });
    }
    await persist(draft);
  }, [snapshot, persist, enqueueAcks]);

  const runEventsNow = useCallback(async () => {
    if (!snapshot) return;
    if (snapshot.game.gameEnded) return;
    const cur = snapshot.game.phaseId;
    if (cur !== '2.4.2' && cur !== '2.4.3') return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    const eraResolvedBefore = new Set(
      draft.game.pendingEraEvents.filter((e) => e.resolved).map((e) => e.id),
    );
    const entriesBefore = draft.events.length;
    const result = runCurrentPhase(draft);
    const ids = draft.game.newlyFiredEventIds ?? [];
    for (const e of draft.game.pendingEraEvents) {
      if (e.resolved && !eraResolvedBefore.has(e.id) && !ids.includes(e.id)) ids.push(e.id);
    }
    for (let i = entriesBefore; i < draft.events.length; i++) {
      if (!ids.includes(draft.events[i].id)) ids.push(draft.events[i].id);
    }
    draft.game.newlyFiredEventIds = ids;
    if (result.needsPlayerInput === 'eraEvent') {
      setSnapshot(draft);
      const ackHead = enqueueAcks(draft, result.acknowledgements);
      if (ackHead) {
        setModal({ type: 'eraEvent', event: ackHead, mode: 'acknowledge' });
      } else {
        setModal({ type: 'eraEvent', event: result.payload as EraEvent });
      }
      await persist(draft);
      return;
    }
    if (result.needsPlayerInput === 'convention') {
      setSnapshot(draft);
      setModal({ type: 'convention', convention: result.payload as ConstitutionalConvention });
      await persist(draft);
      return;
    }
    setSnapshot(draft);
    const ackHead = enqueueAcks(draft, result.acknowledgements);
    if (ackHead) {
      setModal({ type: 'eraEvent', event: ackHead, mode: 'acknowledge' });
    }
    await persist(draft);
  }, [snapshot, persist, enqueueAcks]);

  const draftPick = useCallback(async (politicianId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    playerDraftPick(draft, politicianId);
    // Continue auto-pick for any remaining CPU picks until player needed again or done
    const result = runCurrentPhase(draft);
    if (result.needsPlayerInput === 'draft') {
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    // If that was the last pick, leave the snapshot at phase 2.1.1 with empty
    // pool/order so the Draft page can show the "complete" banner and the
    // player explicitly clicks Continue. Avoids skipping past the result view.
    if (draft.game.phaseId === '2.1.1' && draft.game.pendingDraftPool.length === 0 && draft.game.draftRoundOrder.length === 0) {
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    advancePhase(draft);
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const simOnePick = useCallback(async () => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    simOneDraftPick(draft);
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const simToMyNextPick = useCallback(async () => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    while (draft.game.draftRoundOrder.length > 0) {
      const r = simOneDraftPick(draft);
      if (r.needsPlayer) break;
    }
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const simToEndOfDraft = useCallback(async () => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    while (draft.game.draftRoundOrder.length > 0) {
      const r = simOneDraftPick(draft);
      if (r.needsPlayer) autoPickForPlayer(draft);
    }
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const chooseEraResponse = useCallback(async (eventId: string, responseId: string) => {
    if (!snapshot) return;
    if (snapshot.game.gameEnded) return; // campaign over; ignore further responses
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    // Baseline so we can flag every era-event + event-log entry that fires
    // during this turn (incl. the AI cascade in the replay) as "just fired."
    const eraResolvedBefore = new Set(
      draft.game.pendingEraEvents.filter((e) => e.resolved).map((e) => e.id),
    );
    const entriesBefore = draft.events.length;
    const flagNewlyFired = (): void => {
      const ids = draft.game.newlyFiredEventIds ?? [];
      for (const e of draft.game.pendingEraEvents) {
        if (e.resolved && !eraResolvedBefore.has(e.id) && !ids.includes(e.id)) ids.push(e.id);
      }
      for (let i = entriesBefore; i < draft.events.length; i++) {
        if (!ids.includes(draft.events[i].id)) ids.push(draft.events[i].id);
      }
      draft.game.newlyFiredEventIds = ids;
    };
    resolveEraEvent(draft, eventId, responseId);
    flagNewlyFired();
    // A terminal ending fired: stop, surface the game-over screen (do not advance).
    if (draft.game.gameEnded) {
      setModal({ type: 'none' });
      setSnapshot(draft);
      await persist(draft);
      return;
    }
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
    flagNewlyFired();
    // The replay's AI auto-resolve loop may have resolved a terminal auto-node
    // (e.g. annapolis 'b' -> confederation_remains). Stop before advancing.
    if (draft.game.gameEnded) {
      setModal({ type: 'none' });
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    if (replay.needsPlayerInput === 'eraEvent') {
      setSnapshot(draft);
      const ackHead = enqueueAcks(draft, replay.acknowledgements);
      if (ackHead) {
        setModal({ type: 'eraEvent', event: ackHead, mode: 'acknowledge' });
      } else {
        setModal({ type: 'eraEvent', event: replay.payload as EraEvent });
      }
      await persist(draft);
      return;
    }
    if (replay.needsPlayerInput === 'convention') {
      setSnapshot(draft);
      setModal({ type: 'convention', convention: replay.payload as import('../types').ConstitutionalConvention });
      await persist(draft);
      return;
    }
    const ackHead = enqueueAcks(draft, replay.acknowledgements);
    if (ackHead) {
      setModal({ type: 'eraEvent', event: ackHead, mode: 'acknowledge' });
    } else {
      setModal({ type: 'none' });
    }
    // Advance. For the 1772 graph we KEEP resolved era events in
    // pendingEraEvents for the life of the era — eventChose branch predicates and
    // the Era Events history page read their chosenResponseId (bounded, <=~32
    // nodes). The 1856 path still clears so its per-year rebuild fires.
    if (draft.game.scenarioId === '1772') {
      draft.game.pendingEraEvents = draft.game.pendingEraEvents.filter((e) => e.resolved);
    } else {
      draft.game.pendingEraEvents = [];
    }
    advancePhase(draft);
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist, enqueueAcks]);

  const acknowledgeEraEvent = useCallback((): void => {
    setAckQueue((q) => {
      if (q.length === 0) {
        setModal({ type: 'none' });
        return q;
      }
      const [next, ...rest] = q;
      setModal({ type: 'eraEvent', event: next, mode: 'acknowledge' });
      return rest;
    });
  }, []);

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

  const attemptRelocation = useCallback(async (politicianId: string, destStateId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    // true = attempt RAN (even a failed roll mutates cooldown/counter/feed and
    // must persist); false = rejected, nothing changed.
    if (!attemptPlayerRelocation(draft, politicianId, destStateId)) return;
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const attemptIdeologyShift = useCallback(async (politicianId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    // Same contract as attemptRelocation: failed rolls persist.
    if (!attemptPlayerIdeologyShift(draft, politicianId)) return;
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const attemptConversion = useCallback(async (politicianId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    // Same contract: failed rolls persist (counter + stamp + feed mutated).
    // Kind (sign vs poach) is derived inside the resolver from subject state.
    if (!attemptPlayerConversion(draft, politicianId)) return;
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const assignProtegeAction = useCallback(async (kingmakerId: string, protegeId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    if (!assignProtege(draft, kingmakerId, protegeId)) return;
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const releaseProtegeAction = useCallback(async (kingmakerId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    if (!releaseProtege(draft, kingmakerId)) return;
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const pickCCDelegate = useCallback(async (stateId: string, politicianId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    playerCCDelegatePick(draft, stateId, politicianId);
    // Re-run the phase. AI slots return as `ccAIConfirm` (one-pick-at-a-time
    // animation); a follow-on player colony returns as `ccBuilder`.
    const result = runCurrentPhase(draft);
    if (result.needsPlayerInput === 'ccBuilder' || result.needsPlayerInput === 'ccAIConfirm') {
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    // Build complete (cursor cleared by runner). Leave the snapshot on 2.9.6
    // so the page can show the roster summary. The player clicks Continue
    // (calls advance()) to leave the phase.
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const declineCCDelegate = useCallback(async (stateId: string, politicianId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    playerCCDelegateDecline(draft, stateId, politicianId);
    // After declining, the same slot is still open — re-run to either present
    // the next player payload (same colony, smaller pool) or surface AI flow.
    const result = runCurrentPhase(draft);
    if (result.needsPlayerInput === 'ccBuilder' || result.needsPlayerInput === 'ccAIConfirm') {
      setSnapshot(draft);
      await persist(draft);
      return;
    }
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const confirmCCAIPickAction = useCallback(async () => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    // confirmCCAIPick commits the staged pending pick, logs deduped declines,
    // re-invokes the walker, and mutates the cursor so the next step (AI card,
    // player payload, or done) is reflected on the snapshot. The page reads
    // the cursor on re-render to decide which surface to show.
    confirmCCAIPick(draft);
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const setCareerTrack = useCallback(async (politicianId: string, track: Politician['careerTrack']) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    if (!setPlayerCareerTrack(draft, politicianId, track)) return;
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

  const importDraftDataset = useCallback(async (csv: string, mode: 'replace' | 'merge'): Promise<ParseResult> => {
    const result = parseDraftCsv(csv);
    if (!snapshot || result.draftees.length === 0) return result;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    const existing = mode === 'merge' ? (draft.game.customDraftClasses ?? []) : [];
    draft.game.customDraftClasses = [...existing, ...result.draftees];
    setSnapshot(draft);
    await persist(draft);
    return result;
  }, [snapshot, persist]);

  const clearDraftDataset = useCallback(async () => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    draft.game.customDraftClasses = [];
    setSnapshot(draft);
    await persist(draft);
  }, [snapshot, persist]);

  const admitTerritory = useCallback(async (stateId: string) => {
    if (!snapshot) return;
    const draft: FullGameSnapshot = JSON.parse(JSON.stringify(snapshot));
    const ok = admitState(draft, stateId);
    if (ok) {
      setSnapshot(draft);
      await persist(draft);
    }
  }, [snapshot, persist]);

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
    runEventsNow,
    draftPick,
    simOnePick,
    simToMyNextPick,
    simToEndOfDraft,
    chooseEraResponse,
    acknowledgeEraEvent,
    setCareerTrack,
    attemptRelocation,
    attemptIdeologyShift,
    attemptConversion,
    assignProtege: assignProtegeAction,
    releaseProtege: releaseProtegeAction,
    setConventionVote,
    finalizeConvention,
    toggleTheme,
    exportSave,
    importSave,
    importDraftDataset,
    clearDraftDataset,
    admitTerritory,
    pickCCDelegate,
    declineCCDelegate,
    confirmCCAIPick: confirmCCAIPickAction,
    resetGame,
    theme,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
