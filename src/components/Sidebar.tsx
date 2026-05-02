import { useState } from 'react';
import type { PageId } from '../pages/registry';

interface NavItem {
  id: PageId;
  label: string;
}
interface NavSection {
  title: string;
  items: NavItem[];
}

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
      { id: 'cabinet', label: 'President & Cabinet' },
      { id: 'congress', label: 'Congress' },
      { id: 'court', label: 'Supreme Court' },
      { id: 'governors', label: 'Governors' },
    ],
  },
  {
    title: 'Nation',
    items: [
      { id: 'meters', label: 'National Meters' },
      { id: 'states', label: 'States' },
      { id: 'interestGroups', label: 'Interest Groups' },
      { id: 'enthusiasm', label: 'Ideology & Enthusiasm' },
      { id: 'diplomacy', label: 'Diplomacy' },
    ],
  },
  {
    title: 'Politics',
    items: [
      { id: 'legislation', label: 'Legislation' },
      { id: 'elections', label: 'Elections' },
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

export function Sidebar({ current, onNavigate }: { current: PageId; onNavigate: (id: PageId) => void }): JSX.Element {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

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
