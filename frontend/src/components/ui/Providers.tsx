'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { User, getMe, getCachedUser } from '@/lib/auth';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const u = await getMe();
    if (u !== undefined) {
      // null = token invalid (getMe already cleared localStorage)
      // User = fresh data (getMe already updated localStorage)
      setUser(u);
    }
    // undefined = transient network error: keep existing user, stay logged in
    setLoading(false);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    // Hydrate instantly from cache so the dashboard never sees a null-user flash
    // on page refresh. authChecked = true immediately so no redirect loop fires
    // before the network call returns.
    const cached = getCachedUser();
    if (cached) {
      setUser(cached);
      setAuthChecked(true);
    }

    // Background verify — updates user with fresh plan/data, or clears if token expired
    refresh();

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (localStorage.getItem('generation_in_progress')) return;
      if (localStorage.getItem('payment_in_progress')) return;
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
