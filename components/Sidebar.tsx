import React from 'react';
import { Building2 } from 'lucide-react';
import { NavItem } from '@/lib/types';
import { useApp } from '@/lib/AppContext';
import { TranslationKey } from '@/lib/i18n';
import Link from 'next/link';

interface SidebarProps {
  navItems: NavItem[];
  activeTab: string;
  ticketCount: number;
  onNavClick: (item: NavItem) => void;
}

export function Sidebar({ navItems, activeTab, ticketCount, onNavClick }: SidebarProps) {
  const { t } = useApp();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20 transition-colors">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Studify</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Student OS</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !item.isFeature;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{t(item.label as TranslationKey)}</span>
              </div>
              {item.id === 'tickets' && ticketCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {ticketCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <Link href="/b2b" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <Building2 className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <span>{t('b2b')}</span>
        </Link>
      </div>
    </aside>
  );
}
