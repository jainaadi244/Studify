import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { Moon, Sun, Globe, LogOut, CheckCircle2 } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export function Settings() {
  const { language, setLanguage, theme, setTheme, t } = useApp();
  const router = useRouter();
  
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(theme);
  const [localLanguage, setLocalLanguage] = useState<Language>(language);
  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleApplyChanges = () => {
    setTheme(localTheme);
    setLanguage(localLanguage);
    localStorage.setItem('studify_theme', localTheme);
    localStorage.setItem('studify_language', localLanguage);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hasChanges = localTheme !== theme || localLanguage !== language;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{t('settings')}</h2>
        <button 
          onClick={handleApplyChanges}
          disabled={!hasChanges && !saved}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            saved 
              ? 'bg-emerald-500 text-white' 
              : hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95' 
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {t('saved')}
            </>
          ) : (
            t('applyChanges')
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('theme')}</h3>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-2 grid grid-cols-2 gap-2">
              <button 
                onClick={() => setLocalTheme('light')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${localTheme === 'light' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Sun className="w-5 h-5" />
                {t('light')}
              </button>
              <button 
                onClick={() => setLocalTheme('dark')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${localTheme === 'dark' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Moon className="w-5 h-5" />
                {t('dark')}
              </button>
            </div>
          </div>
        </section>

        {/* Language */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('language')}</h3>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-2 flex flex-col sm:flex-row gap-2">
              {(['fi', 'en', 'sv'] as Language[]).map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setLocalLanguage(lang)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${localLanguage === lang ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <Globe className="w-5 h-5" />
                  {lang === 'fi' ? 'Suomi' : lang === 'en' ? 'English' : 'Svenska'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('account')}</h3>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center gap-3 font-medium">
                <LogOut className="w-5 h-5" />
                {t('logout')}
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
