import React from 'react';
import QRCode from 'react-qr-code';
import { Ticket as TicketIcon, CalendarDays, MapPin, CheckCircle2 } from 'lucide-react';
import { PurchasedTicket } from '@/lib/types';
import { useApp } from '@/lib/AppContext';

interface TicketsViewProps {
  tickets: PurchasedTicket[];
}

export function TicketsView({ tickets }: TicketsViewProps) {
  const { t } = useApp();

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <TicketIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('yourWallet')}</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          {t('walletDescEmpty')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{t('yourWallet')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {t('walletDescWithTickets', { count: tickets.length })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
            <div className="p-6 flex flex-col items-center border-b border-slate-200 dark:border-slate-800 border-dashed relative">
              <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full border-r border-t border-slate-200 dark:border-slate-800 transform rotate-45"></div>
              <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full border-l border-t border-slate-200 dark:border-slate-800 transform -rotate-45"></div>
              
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-4 relative">
                <QRCode value={ticket.qrCode} size={150} level="H" />
                {ticket.status === 'used' && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center text-slate-900">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
                    <span className="font-bold text-lg uppercase tracking-widest text-emerald-600">Used</span>
                  </div>
                )}
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                {ticket.id}
              </p>
            </div>
            
            <div className="p-6 flex flex-col flex-1 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 leading-tight">{ticket.event.title}</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                  <CalendarDays className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>{ticket.event.date}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>{ticket.event.location}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Admit One</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Student</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
