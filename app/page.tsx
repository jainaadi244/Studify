'use client';

import React, { useState } from 'react';
import { Ticket, IdCard, Calendar, Briefcase, CalendarDays, Building2, Search, Settings as SettingsIcon, User } from 'lucide-react';
import { Event, NavItem, PurchasedTicket } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { EventCard } from '@/components/EventCard';
import { CheckoutModal } from '@/components/CheckoutModal';
import { EventDetailsModal } from '@/components/EventDetailsModal';
import { ComingSoonModal } from '@/components/ComingSoonModal';
import { Settings } from '@/components/Settings';
import { Profile } from '@/components/Profile';
import { TicketsView } from '@/components/TicketsView';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';

const NAV_ITEMS: NavItem[] = [
  { id: 'events', label: 'events', icon: CalendarDays, isFeature: false },
  { id: 'tickets', label: 'tickets', icon: Ticket, isFeature: false },
  { id: 'profile', label: 'profile', icon: User, isFeature: false },
  { id: 'id', label: 'id', icon: IdCard, isFeature: true },
  { id: 'schedule', label: 'schedule', icon: Calendar, isFeature: true },
  { id: 'jobs', label: 'jobs', icon: Briefcase, isFeature: true },
  { id: 'settings', label: 'settings', icon: SettingsIcon, isFeature: false },
];

export default function StudifyApp() {
  const [activeTab, setActiveTab] = useState('events');
  const [searchQuery, setSearchQuery] = useState('');
  const { t, events, setEvents, purchasedTickets, setPurchasedTickets } = useApp();
  
  // Modals
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');

  const handleNavClick = (item: NavItem) => {
    if (item.isFeature) {
      setComingSoonFeature(item.label);
      setComingSoonOpen(true);
    } else {
      setActiveTab(item.id);
    }
  };

  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
    setTicketModalOpen(true);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
  };

  const handlePurchaseSuccess = (tickets: PurchasedTicket[]) => {
    setPurchasedTickets([...purchasedTickets, ...tickets]);
    
    if (tickets.length > 0) {
      const eventId = tickets[0].event.id;
      const quantity = tickets.length;
      
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, ticketsSold: (e.ticketsSold || 0) + quantity } 
          : e
      ));
    }
    
    setTicketModalOpen(false);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-white transition-colors">
      
      <Sidebar 
        navItems={NAV_ITEMS} 
        activeTab={activeTab} 
        ticketCount={purchasedTickets.length} 
        onNavClick={handleNavClick} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between z-10 sticky top-0 transition-colors">
          <h1 className="text-xl font-bold text-blue-600 tracking-tight">Studify</h1>
          <Link href="/b2b" className="text-slate-500 dark:text-slate-400 p-2 -mr-2 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('b2b')}</span>
            <Building2 className="w-5 h-5" />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'events' && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{t('upcomingEvents')}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">{t('discoverEvents')}</p>
                  
                  <div className="mt-6 relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                {filteredEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed transition-colors">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('noEvents')}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t('noEventsDesc', { query: searchQuery })}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onViewDetails={handleViewDetails} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'tickets' && (
              <TicketsView tickets={purchasedTickets} />
            )}

            {activeTab === 'profile' && (
              <Profile />
            )}

            {activeTab === 'settings' && (
              <Settings />
            )}

          </div>
        </div>
      </main>

      <BottomNav 
        navItems={NAV_ITEMS} 
        activeTab={activeTab} 
        ticketCount={purchasedTickets.length} 
        onNavClick={handleNavClick} 
      />

      <CheckoutModal 
        isOpen={ticketModalOpen} 
        event={selectedEvent} 
        onClose={() => setTicketModalOpen(false)} 
        onSuccess={handlePurchaseSuccess} 
      />

      <EventDetailsModal
        isOpen={detailsModalOpen}
        event={selectedEvent}
        onClose={() => setDetailsModalOpen(false)}
        onGetTickets={handleGetTickets}
      />

      <ComingSoonModal 
        isOpen={comingSoonOpen} 
        featureName={comingSoonFeature} 
        onClose={() => setComingSoonOpen(false)} 
      />

    </div>
  );
}
