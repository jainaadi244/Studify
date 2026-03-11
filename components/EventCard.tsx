import React from 'react';
import Image from 'next/image';
import { MapPin, CalendarDays } from 'lucide-react';
import { Event } from '@/lib/types';
import { useApp } from '@/lib/AppContext';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const { t } = useApp();
  const isSoldOut = event.capacity !== undefined && (event.ticketsSold || 0) >= event.capacity;

  return (
    <div 
      onClick={() => onViewDetails(event)}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col cursor-pointer group"
    >
      <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <Image 
          src={event.image} 
          alt={event.title} 
          fill 
          className={`object-cover transition-transform duration-500 ${isSoldOut ? 'grayscale' : 'group-hover:scale-105'}`}
          referrerPolicy="no-referrer"
        />
        {event.category && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 dark:text-white shadow-sm">
            {event.category}
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold tracking-widest uppercase shadow-lg transform -rotate-12">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-2">
          <CalendarDays className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{event.title}</h3>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {event.price === 0 ? 'Free' : `€${event.price.toFixed(2)}`}
          </span>
          <button 
            className={`px-5 py-2.5 rounded-xl font-semibold transition-colors ${
              isSoldOut 
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
}
