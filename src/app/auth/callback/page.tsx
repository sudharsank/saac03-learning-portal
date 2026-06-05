'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function handleAuth() {
      if (!supabase) return router.push('/');

      const code = searchParams.get('code');
      if (!code) return router.push('/');

      const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

      let u = data?.user ?? null;

      if (authError || !u) {
        // Code already used — check for an existing valid session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          u = session.user;
        } else {
          setError('Sign in failed. Please try again.');
          setLoading(false);
          return;
        }
      }
      setUser(u);

      // Check if user profile already exists (signed in to any portal before)
      const { data: existingUser } = await supabase
        .from('portal_users')
        .select('auth_user_id')
        .eq('auth_user_id', u.id)
        .maybeSingle();

      if (existingUser) {
        // Returning user — upsert this portal visit and go home
        await supabase.from('user_portal_visits').upsert(
          { auth_user_id: u.id, portal: 'SAA-C03', last_seen: new Date().toISOString() },
          { onConflict: 'auth_user_id,portal' }
        );
        router.push('/');
      } else {
        // Brand new user — show consent modal
        setIsNew(true);
        setLoading(false);
      }
    }
    handleAuth();
  }, [router, searchParams]);

  const handleComplete = async () => {
    if (!supabase || !user) return;
    setSaving(true);

    const { error: userError } = await supabase.from('portal_users').insert({
      auth_user_id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      provider: user.app_metadata?.provider ?? 'google',
      marketing_consent: consent,
    });

    if (userError) {
      setError(`Failed to save profile: ${userError.message}`);
      setSaving(false);
      return;
    }

    const { error: visitError } = await supabase.from('user_portal_visits').insert({
      auth_user_id: user.id,
      portal: 'SAA-C03',
    });

    if (visitError) {
      setError(`Failed to save visit: ${visitError.message}`);
      setSaving(false);
      return;
    }

    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <p className="text-slate-400">Signing you in…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-sm text-center">
          <p className="text-rose-400">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (isNew && user) {
    const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'there';
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-6 flex items-center gap-3">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="h-12 w-12 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-700 text-xl font-bold text-white">
                {(user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? '?').toUpperCase()}
              </span>
            )}
            <div>
              <h1 className="text-xl font-semibold">Welcome, {firstName}!</h1>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>

          <p className="mb-6 text-slate-300">
            You&apos;re now signed in to the{' '}
            <span className="font-semibold text-sky-300">SAA-C03 Learning Portal</span>.
          </p>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-700 p-4 transition hover:border-slate-500">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-sky-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">Receive updates from Thiran</p>
              <p className="mt-0.5 text-xs text-slate-400">
                New exam portals, study tips, and product news. Unsubscribe anytime.
              </p>
            </div>
          </label>

          <button
            onClick={handleComplete}
            disabled={saving}
            className="mt-6 w-full rounded-full bg-sky-600 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Continue to SAA-C03 Portal →'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
