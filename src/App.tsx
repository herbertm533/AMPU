import { useState, useEffect, useRef } from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { NewGameScreen } from './components/NewGameScreen';
import { Pages, type PageId } from './pages/registry';
import { NavigationProvider } from './state/NavigationContext';
import { EraEventModal } from './components/EraEventModal';
import { ConventionModal } from './components/ConventionModal';
import { GameOverScreen } from './components/GameOverScreen';

function Shell(): JSX.Element {
  const { snapshot, loading, hasSave, modal } = useGame();
  const [page, setPage] = useState<PageId>('dashboard');
  const lastDraftEntryKey = useRef<string | null>(null);
  const lastCareerEntryKey = useRef<string | null>(null);
  const lastRelocationEntryKey = useRef<string | null>(null);
  const lastIdeologyEntryKey = useRef<string | null>(null);
  const lastConversionEntryKey = useRef<string | null>(null);
  const lastKingmakerEntryKey = useRef<string | null>(null);

  // Auto-navigate to Draft once per draft phase entry. The entry key combines
  // year + phaseId so leaving the page and returning during the same draft
  // doesn't yank you back, but the next year's draft does.
  useEffect(() => {
    const g = snapshot?.game;
    const inLiveDraft = !!g
      && g.phaseId === '2.1.1'
      && g.pendingDraftPool.length > 0
      && g.draftRoundOrder.length > 0;
    if (inLiveDraft) {
      const key = `${g.year}:${g.phaseId}`;
      if (lastDraftEntryKey.current !== key) {
        lastDraftEntryKey.current = key;
        setPage('draft');
      }
    } else {
      lastDraftEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year, snapshot?.game.pendingDraftPool.length, snapshot?.game.draftRoundOrder.length]);

  // Auto-navigate to Career Tracks once per 2.1.2 resting window (the
  // assignment window). 2.1.2 rests every turn; the year+phase key means one
  // navigation per turn, never a yank-back after the player clicks away.
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.1.2') {
      const key = `${g.year}:2.1.2`;
      if (lastCareerEntryKey.current !== key) {
        lastCareerEntryKey.current = key;
        setPage('careers');
      }
    } else {
      lastCareerEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // Auto-navigate to Relocations once per 2.1.4 resting window (the move
  // window) — same key scheme as the careers effect above.
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.1.4') {
      const key = `${g.year}:2.1.4`;
      if (lastRelocationEntryKey.current !== key) {
        lastRelocationEntryKey.current = key;
        setPage('relocations');
      }
    } else {
      lastRelocationEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // Auto-navigate to Ideology Shifts once per 2.1.5 resting window.
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.1.5') {
      const key = `${g.year}:2.1.5`;
      if (lastIdeologyEntryKey.current !== key) {
        lastIdeologyEntryKey.current = key;
        setPage('ideology');
      }
    } else {
      lastIdeologyEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // Auto-navigate to Faction Conversions once per 2.1.6 resting window.
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.1.6') {
      const key = `${g.year}:2.1.6`;
      if (lastConversionEntryKey.current !== key) {
        lastConversionEntryKey.current = key;
        setPage('conversions');
      }
    } else {
      lastConversionEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // Auto-navigate to Kingmakers & Protégés once per 2.1.7 resting window.
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.1.7') {
      const key = `${g.year}:2.1.7`;
      if (lastKingmakerEntryKey.current !== key) {
        lastKingmakerEntryKey.current = key;
        setPage('kingmakers');
      }
    } else {
      lastKingmakerEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
        Loading...
      </div>
    );
  }

  if (!snapshot && !hasSave) {
    return <NewGameScreen />;
  }
  if (!snapshot) {
    return <NewGameScreen />;
  }
  if (snapshot.game.gameEnded) {
    return <GameOverScreen />;
  }

  const PageComponent = Pages[page] ?? Pages.dashboard;

  return (
    <div className="flex h-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Sidebar current={page} onNavigate={setPage} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">
          <NavigationProvider page={page} navigateTo={setPage}>
            <PageComponent />
          </NavigationProvider>
        </main>
      </div>
      {modal.type === 'eraEvent' && <EraEventModal event={modal.event} />}
      {modal.type === 'convention' && <ConventionModal convention={modal.convention} />}
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
