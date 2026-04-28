'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { User, getMe } from '@/lib/auth';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const u = await getMe();
    // undefined = transient network error; keep existing user state so a blip
    // during campaign generation doesn't silently log the user out
    if (u !== undefined) setUser(u);
    setLoading(false);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (localStorage.getItem('generation_in_progress')) return;
      // Never re-trigger auth check on password reset / auth pages —
      // it would fire a 401 → interceptor redirect and kill the reset flow
      const pathname = window.location.pathname;
      if (AUTH_PAGES.includes(pathname)) return;
      refresh();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, authChecked, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
