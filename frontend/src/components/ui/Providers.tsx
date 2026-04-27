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
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    // Re-validate auth when user returns to the tab (e.g. after campaign generation)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
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
