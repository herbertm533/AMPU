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
  const lastCCBuilderEntryKey = useRef<string | null>(null);
  const lastDeathsEntryKey = useRef<string | null>(null);
  const lastAnytimeEntryKey = useRef<string | null>(null);
  const lastEraEventsEntryKey = useRef<string | null>(null);
  const lastMetersEntryKey = useRef<string | null>(null);
  const lastGovernorsEntryKey = useRef<string | null>(null);
  const lastLegislationEntryKey = useRef<string | null>(null);
  const lastDiplomacyEntryKey = useRef<string | null>(null);
  const lastRevWarEntryKey = useRef<string | null>(null);
  const lastCongressEntryKey = useRef<string | null>(null);
  const lastFactionLeaderEntryKey = useRef<string | null>(null);
  const lastElectionsEntryKey = useRef<string | null>(null);
  const lastEndOfHalfTermEntryKey = useRef<string | null>(null);

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

  // 2.4.1 -> deathsRetirements
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.4.1') {
      const key = `${g.year}:2.4.1`;
      if (lastDeathsEntryKey.current !== key) {
        lastDeathsEntryKey.current = key;
        setPage('deathsRetirements');
      }
    } else {
      lastDeathsEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.4.2 -> anytimeEvents
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.4.2') {
      const key = `${g.year}:2.4.2`;
      if (lastAnytimeEntryKey.current !== key) {
        lastAnytimeEntryKey.current = key;
        setPage('anytimeEvents');
      }
    } else {
      lastAnytimeEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.4.3 -> eraEvents
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.4.3') {
      const key = `${g.year}:2.4.3`;
      if (lastEraEventsEntryKey.current !== key) {
        lastEraEventsEntryKey.current = key;
        setPage('eraEvents');
      }
    } else {
      lastEraEventsEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.5.1 -> meters
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.5.1') {
      const key = `${g.year}:2.5.1`;
      if (lastMetersEntryKey.current !== key) {
        lastMetersEntryKey.current = key;
        setPage('meters');
      }
    } else {
      lastMetersEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.5.2 -> governors
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.5.2') {
      const key = `${g.year}:2.5.2`;
      if (lastGovernorsEntryKey.current !== key) {
        lastGovernorsEntryKey.current = key;
        setPage('governors');
      }
    } else {
      lastGovernorsEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.6.1 / 2.6.2 / 2.6.3 -> legislation
  useEffect(() => {
    const g = snapshot?.game;
    if (g && (g.phaseId === '2.6.1' || g.phaseId === '2.6.2' || g.phaseId === '2.6.3')) {
      const key = `${g.year}:${g.phaseId}`;
      if (lastLegislationEntryKey.current !== key) {
        lastLegislationEntryKey.current = key;
        setPage('legislation');
      }
    } else {
      lastLegislationEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.7.1 -> diplomacy
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.7.1') {
      const key = `${g.year}:2.7.1`;
      if (lastDiplomacyEntryKey.current !== key) {
        lastDiplomacyEntryKey.current = key;
        setPage('diplomacy');
      }
    } else {
      lastDiplomacyEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.7.2 -> revWar (only while the Revolutionary War is active)
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.7.2' && g.revolutionaryWar?.active === true) {
      const key = `${g.year}:2.7.2`;
      if (lastRevWarEntryKey.current !== key) {
        lastRevWarEntryKey.current = key;
        setPage('revWar');
      }
    } else {
      lastRevWarEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year, snapshot?.game.revolutionaryWar?.active]);

  // 2.2.1 / 2.2.2 -> congress
  useEffect(() => {
    const g = snapshot?.game;
    if (g && (g.phaseId === '2.2.1' || g.phaseId === '2.2.2')) {
      const key = `${g.year}:${g.phaseId}`;
      if (lastCongressEntryKey.current !== key) {
        lastCongressEntryKey.current = key;
        setPage('congress');
      }
    } else {
      lastCongressEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.2.3 -> factionLeader
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.2.3') {
      const key = `${g.year}:2.2.3`;
      if (lastFactionLeaderEntryKey.current !== key) {
        lastFactionLeaderEntryKey.current = key;
        setPage('factionLeader');
      }
    } else {
      lastFactionLeaderEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.9.5 -> elections
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.9.5') {
      const key = `${g.year}:2.9.5`;
      if (lastElectionsEntryKey.current !== key) {
        lastElectionsEntryKey.current = key;
        setPage('elections');
      }
    } else {
      lastElectionsEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // 2.10 -> endOfHalfTerm
  useEffect(() => {
    const g = snapshot?.game;
    if (g && g.phaseId === '2.10') {
      const key = `${g.year}:2.10`;
      if (lastEndOfHalfTermEntryKey.current !== key) {
        lastEndOfHalfTermEntryKey.current = key;
        setPage('endOfHalfTerm');
      }
    } else {
      lastEndOfHalfTermEntryKey.current = null;
    }
  }, [snapshot?.game.phaseId, snapshot?.game.year]);

  // Auto-navigate to the First-CC builder once per 2.9.6 visit (1772 gate). The
  // sentinel: phase is 2.9.6, scenario is 1772, and either a build cursor is
  // active or a build just completed (cursor cleared but cc.delegates populated
  // and the page hasn't shown the roster summary yet).
  useEffect(() => {
    const g = snapshot?.game;
    const inBuilder = !!g
      && g.phaseId === '2.9.6'
      && g.scenarioId === '1772'
      && (g.ccBuilderCursor != null
        || (g.eraEventsCompleted.includes('intolerable_acts')
          && (g.continentalCongress?.delegates.length ?? 0) > 0));
    if (inBuilder) {
      const key = `${g!.year}:2.9.6`;
      if (lastCCBuilderEntryKey.current !== key) {
        lastCCBuilderEntryKey.current = key;
        setPage('continentalCongressBuilder');
      }
    } else {
      lastCCBuilderEntryKey.current = null;
    }
  }, [
    snapshot?.game.phaseId,
    snapshot?.game.year,
    snapshot?.game.scenarioId,
    snapshot?.game.ccBuilderCursor?.colonyIdx,
    snapshot?.game.ccBuilderCursor?.slotIdx,
    snapshot?.game.ccBuilderCursor?.pendingAIPick?.politicianId,
    snapshot?.game.continentalCongress?.delegates.length,
  ]);

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
      {modal.type === 'eraEvent' && <EraEventModal event={modal.event} mode={modal.mode} />}
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
