import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, CalendarDays, Users, Tag, Info } from 'lucide-react';
import Image from 'next/image';
import { Event } from '@/lib/types';
import { useApp } from '@/lib/AppContext';

interface EventDetailsModalProps {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
  onGetTickets: (event: Event) => void;
}

export function EventDetailsModal({ isOpen, event, onClose, onGetTickets }: EventDetailsModalProps) {
  const { t } = useApp();

  if (!event) return null;

  const remainingTickets = event.capacity ? event.capacity - (event.ticketsSold || 0) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}
      {isOpen && (
        <div key="modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div 
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
          >
              {/* Header Image */}
              <div className="relative h-64 w-full shrink-0">
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-6 left-6 right-6">
                  {event.category && (
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3 shadow-sm">
                      {event.category}
                    </span>
                  )}
                  <h2 className="text-3xl font-bold text-white leading-tight">{event.title}</h2>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                      <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Date & Time</p>
                        <p>{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Location</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                      <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Price</p>
                        <p>{event.price === 0 ? 'Free Entry' : `€${event.price.toFixed(2)}`}</p>
                      </div>
                    </div>
                    {event.capacity && (
                      <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Capacity</p>
                          <p>
                            {remainingTickets !== null && remainingTickets <= 0 
                              ? <span className="text-red-600 dark:text-red-400 font-bold">Sold Out</span>
                              : `${remainingTickets} tickets remaining`
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-slate-400" />
                    About this event
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {event.description || 'No description provided for this event.'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Price</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {event.price === 0 ? 'Free' : `€${event.price.toFixed(2)}`}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    onGetTickets(event);
                  }}
                  disabled={remainingTickets !== null && remainingTickets <= 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold transition-colors active:scale-95 shadow-sm"
                >
                  {remainingTickets !== null && remainingTickets <= 0 ? 'Sold Out' : t('getTickets')}
                </button>
              </div>
            </motion.div>
          </div>
      )}
    </AnimatePresence>
  );
}
