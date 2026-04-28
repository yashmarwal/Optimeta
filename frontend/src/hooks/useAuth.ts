'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, getMe } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authChecked: boolean;
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
}

import { createContext as createReactContext } from 'react';

export const AuthContext = createReactContext<AuthContextType>({
  user: null,
  loading: true,
  authChecked: false,
  setUser: () => {},
  refresh: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const u = await getMe();
    if (u !== undefined) setUser(u);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { user, loading, setUser, refresh };
};
