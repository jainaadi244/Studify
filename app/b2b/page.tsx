'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, BarChart3, CalendarDays, Megaphone, Users, TrendingUp, DollarSign, Eye, Edit, Trash2, Ticket, Building2, Lock, ScanLine, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/lib/AppContext';
import { Event } from '@/lib/types';

export default function B2BPortal() {
  const { t, events, setEvents, isB2BLoggedIn, setIsB2BLoggedIn, purchasedTickets, setPurchasedTickets } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'checkin' | 'ads'>('dashboard');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    if (loginEmail && loginPassword) {
      setIsB2BLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Please enter both email and password.');
    }
  };

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    price: '',
    image: '',
    description: '',
    category: '',
    capacity: ''
  });

  const handleEditEvent = (event: Event) => {
    const [datePart, timePart] = event.date.split(' • ');
    setNewEvent({
      title: event.title,
      date: datePart || '',
      time: timePart || '',
      location: event.location,
      price: event.price.toString(),
      image: event.image,
      description: event.description || '',
      category: event.category || '',
      capacity: event.capacity?.toString() || ''
    });
    setEditingEventId(event.id);
    setShowCreateEvent(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEventId) {
      setEvents(events.map(ev => ev.id === editingEventId ? {
        ...ev,
        title: newEvent.title,
        date: `${newEvent.date} • ${newEvent.time}`,
        location: newEvent.location,
        price: parseFloat(newEvent.price) || 0,
        image: newEvent.image || `https://picsum.photos/seed/${Date.now()}/800/600`,
        description: newEvent.description,
        category: newEvent.category,
        capacity: parseInt(newEvent.capacity) || undefined
      } : ev));
    } else {
      const event: Event = {
        id: Math.random().toString(36).substring(2, 10).toUpperCase(),
        title: newEvent.title,
        date: `${newEvent.date} • ${newEvent.time}`,
        location: newEvent.location,
        price: parseFloat(newEvent.price) || 0,
        image: newEvent.image || `https://picsum.photos/seed/${Date.now()}/800/600`,
        ticketsSold: 0,
        views: 0,
        description: newEvent.description,
        category: newEvent.category,
        capacity: parseInt(newEvent.capacity) || undefined
      };
      setEvents([...events, event]);
    }
    
    setShowCreateEvent(false);
    setEditingEventId(null);
    setNewEvent({ title: '', date: '', time: '', location: '', price: '', image: '', description: '', category: '', capacity: '' });
  };

  const handleCheckIn = (ticketId: string) => {
    setPurchasedTickets(purchasedTickets.map(t => 
      t.id === ticketId ? { ...t, status: 'used' } : t
    ));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  if (!isB2BLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 transition-colors">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student App</span>
          </Link>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Business Portal</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to manage your events, tickets, and promotions.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30">
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Organization Email</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                  placeholder="hello@sammakko.fi"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="••••••••"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors mt-2"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Want to partner with Studify? <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Contact Sales</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-blue-600 tracking-tight">Studify <span className="text-slate-900 dark:text-white">Business</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              SA
            </div>
            <span className="text-sm font-medium hidden sm:block">SAMMAKKO ry</span>
            <button 
              onClick={() => setIsB2BLoggedIn(false)}
              className="ml-4 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'events' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <CalendarDays className="w-5 h-5" />
              Manage Events
            </button>
            <button 
              onClick={() => setActiveTab('checkin')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'checkin' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <ScanLine className="w-5 h-5" />
              Check-in
            </button>
            <button 
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'ads' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Megaphone className="w-5 h-5" />
              Promotions & Ads
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</h3>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">€{events.reduce((sum, e) => sum + (e.price * (e.ticketsSold || 0)), 0).toFixed(2)}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12.5% from last month
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Tickets Sold</h3>
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">{events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0)}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +5.2% from last month
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Event Views</h3>
                    <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">{events.reduce((sum, e) => sum + (e.views || 0), 0)}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +22.4% from last month
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Events</h3>
                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">{events.length}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Currently published</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Manage Events</h2>
                <button 
                  onClick={() => {
                    setEditingEventId(null);
                    setNewEvent({ title: '', date: '', time: '', location: '', price: '', image: '', description: '', category: '', capacity: '' });
                    setShowCreateEvent(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Event
                </button>
              </div>

              {showCreateEvent ? (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">{editingEventId ? 'Edit Event' : 'New Event Details'}</h3>
                    <button onClick={() => setShowCreateEvent(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Cancel</button>
                  </div>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Event Title</label>
                        <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Back to School Party" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                        <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none">
                          <option value="">Select Category</option>
                          <option value="Party">Party</option>
                          <option value="Sports">Sports</option>
                          <option value="Academic">Academic</option>
                          <option value="Culture">Culture</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                        <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Time</label>
                        <input required type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                      <input required type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Cabaret, Pori" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                      <textarea rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Describe your event..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ticket Price (€)</label>
                        <input required type="number" step="0.01" min="0" value={newEvent.price} onChange={e => setNewEvent({...newEvent, price: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="5.00" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Capacity</label>
                        <input type="number" min="1" value={newEvent.capacity} onChange={e => setNewEvent({...newEvent, capacity: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. 500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cover Image URL</label>
                        <input type="url" value={newEvent.image} onChange={e => setNewEvent({...newEvent, image: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="https://..." />
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                        {editingEventId ? 'Save Changes' : 'Publish Event'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-4 font-medium">Event</th>
                          <th className="px-6 py-4 font-medium">Date & Time</th>
                          <th className="px-6 py-4 font-medium">Price</th>
                          <th className="px-6 py-4 font-medium">Tickets</th>
                          <th className="px-6 py-4 font-medium">Revenue</th>
                          <th className="px-6 py-4 font-medium">Views</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {events.map(event => (
                          <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900 dark:text-white">{event.title}</div>
                              <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{event.location}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{event.date}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">€{event.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                              {event.capacity ? `${event.ticketsSold || 0} / ${event.capacity}` : (event.ticketsSold || 0)}
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium text-emerald-600 dark:text-emerald-400">€{((event.ticketsSold || 0) * event.price).toFixed(2)}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{event.views || 0}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Published
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEditEvent(event)} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {events.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                              No events found. Create your first event to get started!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'checkin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ticket Scanner & Check-in</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                      <ScanLine className="w-12 h-12 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Camera active. Point at QR code.</p>
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                    </div>
                    <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold transition-transform active:scale-95">
                      Manual Entry
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                      <h3 className="font-bold">Recent Purchases</h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{purchasedTickets.length} total tickets</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-0">
                      {purchasedTickets.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                          No tickets have been purchased yet.
                        </div>
                      ) : (
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                          {purchasedTickets.slice().reverse().map(ticket => (
                            <li key={ticket.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{ticket.event.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">{ticket.qrCode}</p>
                              </div>
                              <div>
                                {ticket.status === 'used' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => handleCheckIn(ticket.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                  >
                                    Check In
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Promotions & Ads</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Campaign
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Reach more students</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Promote your events, student discounts, or job openings directly to thousands of active students in the Studify app.
                </p>
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold transition-transform active:scale-95">
                  Start Advertising
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
