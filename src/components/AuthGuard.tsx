'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SignInButton } from '@/components/SignInButton';
import type { User } from '@supabase/supabase-js';

const PUBLIC_PATHS = ['/', '/auth/callback'];

interface AuthGuardProps {
  children: React.ReactNode;
  portal: string;
}

export function AuthGuard({ children, portal }: AuthGuardProps) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/auth/'));

  useEffect(() => {
    if (isPublic) { setAuthed(true); return; }
    if (!supabase) { setAuthed(false); return; }

    supabase.auth.getSession().then(({ data }) => {
      const user: User | undefined = data.session?.user;
      setAuthed(!!user);
      if (user) recordVisit(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setAuthed(!!user);
      if (user) recordVisit(user);
    });

    return () => subscription.unsubscribe();
  }, [isPublic]);

  async function recordVisit(user: User) {
    if (!supabase) return;
    await supabase.from('user_portal_visits').upsert(
      { auth_user_id: user.id, portal, last_seen: new Date().toISOString() },
      { onConflict: 'auth_user_id,portal' }
    );
  }

  if (authed === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-900/40">
            <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold">Sign in to continue</h2>
          <p className="mb-6 text-sm text-slate-400">
            Create a free account to access study guides, practice questions, and track your progress.
          </p>
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
