'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { User, getMe, getCachedUser, TOKEN_KEY, USER_KEY } from '@/lib/auth';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const u = await getMe();

    if (u === undefined) {
      // Transient network error — keep whatever user state we have
    } else if (u === null) {
      // Backend returned 401. Only clear user if the token is also gone.
      // If the token still exists the 401 is likely a backend/cookie issue —
      // keeping the cached user prevents a false redirect-to-login loop.
      const hasToken = !!localStorage.getItem(TOKEN_KEY);
      if (!hasToken) {
        setUser(null);
        localStorage.removeItem(USER_KEY);
      }
    } else {
      // Fresh user from backend — update context and cache
      setUser(u);
    }

    setLoading(false);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    // Instantly hydrate from cache so dashboard never sees a null-user flash.
    // authChecked = true immediately — no redirect fires before network returns.
    const cached = getCachedUser();
    if (cached) {
      setUser(cached);
      setAuthChecked(true);
    }

    // Background verify — updates user with fresh data or clears if truly logged out
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
