'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, CheckCircle2 } from 'lucide-react';

// Initialize Supabase client
// Note: In a real app, these should be defined in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. The Security Bouncer (Domain Validation)
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (emailDomain !== 'student.samk.fi' && emailDomain !== 'student.utu.fi') {
      setError('Access Restricted: You must use a valid SAMK or UCPori student email.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Supabase Integration
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        throw authError;
      }

      // 3. Success UX
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the magic link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-4">
      <div className="w-full max-w-[360px] rounded-[28px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-slate-900 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
        {isSuccess ? (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Check your student inbox!
            </h2>
            <p className="text-[15px] leading-relaxed text-green-600 dark:text-green-400 font-medium">
              We sent a secure magic link to enter Studify.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8 text-center">
              <h2 className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-white">
                Student Access
              </h2>
              <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
                Enter your university email to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@student.samk.fi"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-[#007AFF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#007AFF]/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-[#007AFF] dark:focus:bg-slate-900 transition-all"
                />
                {error && (
                  <p className="text-[13px] font-medium text-red-500 animate-in slide-in-from-top-1">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="flex w-full items-center justify-center rounded-2xl bg-[#007AFF] px-4 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#0066CC] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
