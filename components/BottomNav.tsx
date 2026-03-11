import React from 'react';
import { NavItem } from '@/lib/types';
import { useApp } from '@/lib/AppContext';
import { TranslationKey } from '@/lib/i18n';

interface BottomNavProps {
  navItems: NavItem[];
  activeTab: string;
  ticketCount: number;
  onNavClick: (item: NavItem) => void;
}

export function BottomNav({ navItems, activeTab, ticketCount, onNavClick }: BottomNavProps) {
  const { t } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-20 transition-colors">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !item.isFeature;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item)}
              className="relative flex flex-col items-center justify-center w-16 h-14 gap-1"
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.id === 'tickets' && ticketCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                    {ticketCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {t(item.label as TranslationKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
