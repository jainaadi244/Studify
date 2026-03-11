import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { User, MapPin, Lock, CreditCard, Home, Camera, Plus, CheckCircle2 } from 'lucide-react';

export function Profile() {
  const { t, userEmail, userName } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{t('profile')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Actions */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center transition-colors">
            <div className="relative w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm">
              <User className="w-12 h-12 text-slate-400" />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{userName}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{userEmail}</p>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {t('uploadPhoto')}
            </button>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 transition-colors space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {t('personalInfo')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('fullName')}</label>
                <input type="text" value={userName} disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed transition-all" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {t('nameLocked')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('email')}</label>
                <input type="email" value={userEmail} disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('city')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <select defaultValue="pori" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all appearance-none">
                    <option value="">{t('selectCity')}</option>
                    <option value="helsinki">Helsinki</option>
                    <option value="tampere">Tampere</option>
                    <option value="turku">Turku</option>
                    <option value="oulu">Oulu</option>
                    <option value="pori">Pori</option>
                    <option value="jyvaskyla">Jyväskylä</option>
                    <option value="kuopio">Kuopio</option>
                    <option value="lahti">Lahti</option>
                    <option value="vaasa">Vaasa</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {saved ? (
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Tallennettu
                </span>
              ) : <div />}
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors active:scale-95">
                {t('saveChanges')}
              </button>
            </div>
          </form>

          {/* Security */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 transition-colors space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {t('changePassword')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('currentPassword')}</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('newPassword')}</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all" />
              </div>
              <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-2.5 rounded-xl font-semibold transition-colors">
                {t('changePassword')}
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 transition-colors space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {t('paymentMethods')}
              </h3>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                {t('addCard')}
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400">VISA</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Expires 12/28</p>
                  </div>
                </div>
                <button className="text-sm text-red-500 hover:text-red-600 font-medium">Poista</button>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 transition-colors space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {t('addresses')}
              </h3>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                {t('addAddress')}
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Koti</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Yliopistonkatu 1 A 2<br/>28100 Pori</p>
                </div>
                <button className="text-sm text-red-500 hover:text-red-600 font-medium">Poista</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
