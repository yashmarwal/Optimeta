'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { User, getMe } from '@/lib/auth';

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const u = await getMe();
    // undefined = transient network error; keep existing user state so a blip
    // during campaign generation doesn't silently log the user out
    if (u !== undefined) setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    // Re-validate auth when user returns to the tab — but skip during campaign generation
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (localStorage.getItem('generation_in_progress')) return;
      refresh();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
