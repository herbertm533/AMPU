import { createContext, useContext, type ReactNode } from 'react';
import type { PageId } from '../pages/registry';

interface NavValue {
  page: PageId;
  navigateTo: (id: PageId) => void;
}

const Ctx = createContext<NavValue | null>(null);

export function NavigationProvider({ page, navigateTo, children }: { page: PageId; navigateTo: (id: PageId) => void; children: ReactNode }): JSX.Element {
  return <Ctx.Provider value={{ page, navigateTo }}>{children}</Ctx.Provider>;
}

export function useNavigation(): NavValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useNavigation must be used inside NavigationProvider');
  return v;
}
