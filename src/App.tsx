import { useState } from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { NewGameScreen } from './components/NewGameScreen';
import { Pages, type PageId } from './pages/registry';
import { DraftModal } from './components/DraftModal';
import { EraEventModal } from './components/EraEventModal';
import { ConventionModal } from './components/ConventionModal';

function Shell(): JSX.Element {
  const { snapshot, loading, hasSave, modal } = useGame();
  const [page, setPage] = useState<PageId>('dashboard');

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

  const PageComponent = Pages[page] ?? Pages.dashboard;

  return (
    <div className="flex h-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Sidebar current={page} onNavigate={setPage} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">
          <PageComponent />
        </main>
      </div>
      {modal.type === 'draft' && <DraftModal pool={modal.pool} />}
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
