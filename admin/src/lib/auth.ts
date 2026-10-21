import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AuthState =
  | { status: 'loading' }
  | { status: 'signed-out'; notice?: string }
  /** Arrived from a "reset password" email link: must choose a new password. */
  | { status: 'recovery' }
  | { status: 'signed-in'; email: string };

const DEMO_KEY = 'gv-admin-demo';
const DEMO_EMAIL = 'demo@golden-village';

/**
 * Sign-in state. Signing in only succeeds for emails on the admin list (admin_users table);
 * anyone else is signed straight back out. Without Supabase settings, a demo session is used instead.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    if (supabase) return { status: 'loading' };
    try {
      if (sessionStorage.getItem(DEMO_KEY)) return { status: 'signed-in', email: DEMO_EMAIL };
    } catch {
      /* storage blocked */
    }
    return { status: 'signed-out' };
  });
  const recovering = useRef(false);

  const confirmAdmin = useCallback(async (session: Session | null) => {
    const client = supabase;
    if (!client || recovering.current) return;
    if (!session) {
      setState((current) => (current.status === 'signed-out' ? current : { status: 'signed-out' }));
      return;
    }
    const { data, error } = await client.rpc('is_admin');
    if (recovering.current) return;
    if (error || data !== true) {
      await client.auth.signOut();
      setState({
        status: 'signed-out',
        notice: error ? 'Could not check your access. Please try again.' : 'This account does not have access to the admin panel.',
      });
      return;
    }
    const email = session.user.email ?? '';
    setState((current) => (current.status === 'signed-in' && current.email === email ? current : { status: 'signed-in', email }));
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        recovering.current = true;
        setState({ status: 'recovery' });
      } else if (event === 'SIGNED_OUT') {
        setState((current) => (current.status === 'signed-out' ? current : { status: 'signed-out' }));
      } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        // Supabase asks not to call it again from inside this callback, so the check runs just after.
        setTimeout(() => confirmAdmin(session), 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [confirmAdmin]);

  const signOut = useCallback(async () => {
    recovering.current = false;
    if (supabase) await supabase.auth.signOut();
    try {
      sessionStorage.removeItem(DEMO_KEY);
    } catch {
      /* storage blocked */
    }
    setState({ status: 'signed-out' });
  }, []);

  const enterDemo = useCallback(() => {
    try {
      sessionStorage.setItem(DEMO_KEY, '1');
    } catch {
      /* storage blocked — the demo still works for this page load */
    }
    setState({ status: 'signed-in', email: DEMO_EMAIL });
  }, []);

  /** After a new password was saved from a reset link. */
  const finishRecovery = useCallback(async () => {
    recovering.current = false;
    setState({ status: 'loading' });
    const session = supabase ? (await supabase.auth.getSession()).data.session : null;
    await confirmAdmin(session);
  }, [confirmAdmin]);

  return { state, signOut, enterDemo, finishRecovery };
}
