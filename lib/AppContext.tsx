'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from './i18n';

import { Event, PurchasedTicket } from './types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  purchasedTickets: PurchasedTicket[];
  setPurchasedTickets: (tickets: PurchasedTicket[]) => void;
  isB2BLoggedIn: boolean;
  setIsB2BLoggedIn: (isLoggedIn: boolean) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'SAMMAKKO Wappu 2026',
    date: 'April 30, 2026 • 18:00',
    location: 'Raatihuoneenpuisto, Pori',
    price: 5.00,
    image: 'https://picsum.photos/seed/wappu2026/800/600',
    ticketsSold: 142,
    views: 1205,
    description: 'The biggest student party of the year! Join us for an unforgettable night of music, dancing, and celebration.',
    category: 'Party',
    capacity: 500
  },
  {
    id: '2',
    title: 'Pointer ry Haalaribileet',
    date: 'May 15, 2026 • 22:00',
    location: 'Cabaret, Pori',
    price: 5.00,
    image: 'https://picsum.photos/seed/haalaribileet/800/600',
    ticketsSold: 85,
    views: 640,
    description: 'Put on your student overalls and get ready to party till dawn!',
    category: 'Party',
    capacity: 300
  },
  {
    id: '3',
    title: 'SAMK Ässät Opiskelijapeli',
    date: 'September 10, 2026 • 18:30',
    location: 'Enersense Areena, Pori',
    price: 5.00,
    image: 'https://picsum.photos/seed/assat/800/600',
    ticketsSold: 23,
    views: 210,
    description: 'Support our local hockey team! Special student prices and dedicated student section.',
    category: 'Sports',
    capacity: 1000
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fi');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userEmail, setUserEmail] = useState<string>('alex.student@student.fi');
  const [userName, setUserName] = useState<string>('Alex Student');
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([]);
  const [isB2BLoggedIn, setIsB2BLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Defer state update to avoid synchronous cascade render warnings
    setTimeout(() => {
      const savedLanguage = localStorage.getItem('studify_language') as Language;
      const savedTheme = localStorage.getItem('studify_theme') as 'light' | 'dark';
      
      if (savedLanguage) setLanguage(savedLanguage);
      if (savedTheme) setTheme(savedTheme);
    }, 0);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let text = translations[language][key] || translations['fi'][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, userEmail, setUserEmail, userName, setUserName, events, setEvents, purchasedTickets, setPurchasedTickets, isB2BLoggedIn, setIsB2BLoggedIn, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
