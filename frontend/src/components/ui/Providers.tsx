'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { User, getMe } from '@/lib/auth';

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const u = await getMe();
    setUser(u);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
