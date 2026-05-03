import { useState } from 'react';
import type { PageId } from '../pages/registry';
import { useGame } from '../state/GameContext';

interface NavItem {
  id: PageId;
  label: string;
}
interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar({ current, onNavigate }: { current: PageId; onNavigate: (id: PageId) => void }): JSX.Element {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const { snapshot } = useGame();
  const era = snapshot?.game.currentEra ?? 'nationalism';
  const isIndependence = era === 'independence';
  const constitutionRatified = snapshot?.game.constitutionRatified ?? true;
  const governorsExist = snapshot?.game.governorsExist ?? true;
  const revWarActive = !!snapshot?.game.revolutionaryWar?.active;
  const revWarEverHappened = !!snapshot?.game.revolutionaryWar;

  const SECTIONS: NavSection[] = [
    {
      title: 'Dashboard',
      items: [{ id: 'dashboard', label: 'Overview' }],
    },
    {
      title: 'Your Faction',
      items: [
        { id: 'roster', label: 'Roster' },
        { id: 'factionLeader', label: 'Faction Leader' },
        { id: 'careers', label: 'Career Tracks' },
        { id: 'kingmakers', label: 'Kingmakers & Protégés' },
      ],
    },
    {
      title: 'Government',
      items: [
        ...(isIndependence ? [
          { id: 'continentalCongress' as const, label: 'Continental Congress' },
        ] : [
          { id: 'cabinet' as const, label: 'President & Cabinet' },
          { id: 'congress' as const, label: 'Congress' },
        ]),
        ...(constitutionRatified ? [{ id: 'court' as const, label: 'Supreme Court' }] : []),
        ...(governorsExist ? [{ id: 'governors' as const, label: 'Governors' }] : []),
      ],
    },
    {
      title: 'Nation',
      items: [
        { id: 'meters', label: 'National Meters' },
        { id: 'states', label: isIndependence ? 'Colonies / States' : 'States' },
        { id: 'interestGroups', label: 'Interest Groups' },
        { id: 'enthusiasm', label: 'Ideology & Enthusiasm' },
        { id: 'diplomacy', label: 'Diplomacy' },
        ...(revWarEverHappened ? [{ id: 'revWar' as const, label: revWarActive ? 'Revolutionary War (active)' : 'Revolutionary War' }] : []),
      ],
    },
    {
      title: 'Politics',
      items: [
        { id: 'legislation', label: 'Legislation' },
        ...(constitutionRatified ? [{ id: 'elections' as const, label: 'Elections' }] : []),
        { id: 'factions', label: 'Factions' },
      ],
    },
    {
      title: 'Events',
      items: [
        { id: 'eventLog', label: 'Event Log' },
        { id: 'wars', label: 'War Dashboard' },
      ],
    },
    {
      title: 'Tools',
      items: [{ id: 'settings', label: 'Settings & Save' }],
    },
  ];

  const toggle = (title: string): void => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <aside className="w-56 flex-shrink-0 overflow-y-auto bg-slate-200 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700">
      <div className="p-3 border-b border-slate-300 dark:border-slate-700">
        <div className="font-bold text-base">AMPU</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">American Political Universe</div>
        <div className="text-[10px] text-slate-500 mt-1 capitalize">{era} era</div>
      </div>
      {SECTIONS.map((section) => {
        const isCollapsed = collapsed.has(section.title);
        return (
          <div key={section.title} className="border-b border-slate-300 dark:border-slate-700">
            <button
              onClick={() => toggle(section.title)}
              className="w-full text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-between"
            >
              <span>{section.title}</span>
              <span className="text-slate-500">{isCollapsed ? '+' : '-'}</span>
            </button>
            {!isCollapsed && (
              <ul>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={`w-full text-left px-4 py-1.5 text-sm ${
                        current === item.id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}
