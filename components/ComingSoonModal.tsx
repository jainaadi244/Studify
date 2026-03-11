import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

interface ComingSoonModalProps {
  isOpen: boolean;
  featureName: string;
  onClose: () => void;
}

export function ComingSoonModal({ isOpen, featureName, onClose }: ComingSoonModalProps) {
  const [waitlistState, setWaitlistState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');
  const { t } = useApp();

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setWaitlistState('loading');
    setTimeout(() => {
      setWaitlistState('success');
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setWaitlistState('idle');
      setEmail('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          onClick={handleClose}
        />
      )}
      {isOpen && (
        <div key="modal-container" className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 pointer-events-none">
          <motion.div 
            key="modal-content"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white dark:bg-slate-900 w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl pointer-events-auto flex flex-col relative"
          >
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 mb-2 md:hidden" />
              
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pt-6 md:pt-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('comingSoon', { feature: featureName })}
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  {t('comingSoonDesc', { feature: featureName })}
                </p>
                
                {waitlistState === 'success' ? (
                  <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 py-4 rounded-xl font-semibold flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {t('onWaitlist')}
                  </div>
                ) : (
                  <form onSubmit={handleWaitlist} className="w-full flex flex-col gap-3">
                    <input 
                      type="email" 
                      required
                      placeholder={t('emailPlaceholder')} 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={waitlistState === 'loading'}
                      className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors flex items-center justify-center active:scale-95"
                    >
                      {waitlistState === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : t('joinWaitlist')}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
      )}
    </AnimatePresence>
  );
}
