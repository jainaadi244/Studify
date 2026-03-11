'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, GraduationCap, Loader2, ArrowLeft, Lock, Mail } from 'lucide-react';
import { universities, uas } from '@/lib/institutions';
import { useApp } from '@/lib/AppContext';

export default function LoginPage() {
  const [step, setStep] = useState<'select' | 'credentials'>('select');
  const [selectedUni, setSelectedUni] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const { t, setUserEmail, setUserName } = useApp();

  const filteredUniversities = universities.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUas = uas.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectUni = (name: string) => {
    setSelectedUni(name);
    setStep('credentials');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRedirecting(true);
    
    // Derive name from email (e.g., john.doe@student.fi -> John Doe)
    const emailPrefix = email.split('@')[0];
    const nameParts = emailPrefix.split('.');
    const derivedName = nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
      
    setUserEmail(email);
    setUserName(derivedName || 'Student');

    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('redirecting')}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center">{selectedUni}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">Studify</h1>
          <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
            {step === 'select' ? t('loginTitle') : t('loginToUni', { uni: selectedUni })}
          </h2>
          {step === 'select' && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('loginDesc')}</p>
          )}
        </div>

        {step === 'select' ? (
          <>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={t('searchUni')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all shadow-sm"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="max-h-[60vh] overflow-y-auto">
                {filteredUniversities.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {t('universities')}
                    </h3>
                    <div className="space-y-1">
                      {filteredUniversities.map(uni => (
                        <button
                          key={uni.id}
                          onClick={() => handleSelectUni(uni.name)}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                        >
                          {uni.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredUniversities.length > 0 && filteredUas.length > 0 && (
                  <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4" />
                )}

                {filteredUas.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {t('uas')}
                    </h3>
                    <div className="space-y-1">
                      {filteredUas.map(uni => (
                        <button
                          key={uni.id}
                          onClick={() => handleSelectUni(uni.name)}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                        >
                          {uni.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleLogin} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <button 
              type="button"
              onClick={() => setStep('select')}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('back')}
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('email')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all"
                    placeholder="student@uni.fi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-colors active:scale-95 flex items-center justify-center"
            >
              {t('loginAction')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
