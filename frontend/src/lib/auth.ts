import api from './api';

export const TOKEN_KEY = 'optimeta_token';

export interface User {
  id: string;
  email: string;
  fullName: string;
  plan: 'free' | 'pro' | 'ultra';
  campaignsUsed: number;
  billingCycleStart?: string;
  createdAt?: string;
}

export const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Optimeta fingerprint', 2, 2);
    return canvas.toDataURL().slice(-50);
  } catch {
    return 'canvas-error';
  }
};

export const getDeviceFingerprint = () => ({
  screenResolution: `${window.screen.width}x${window.screen.height}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  userAgent: navigator.userAgent,
  language: navigator.language,
  canvasHash: getCanvasFingerprint(),
});

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  if (data.data?.token) localStorage.setItem(TOKEN_KEY, data.data.token);
  return data.data;
};

export const register = async (
  email: string,
  password: string,
  fullName: string,
  fingerprint: { screenResolution: string; timezone: string; canvasHash: string }
) => {
  const { data } = await api.post('/api/auth/register', {
    email,
    password,
    fullName,
    ...fingerprint,
  });
  if (data.data?.token) localStorage.setItem(TOKEN_KEY, data.data.token);
  return data.data;
};

export const logout = async () => {
  await api.post('/api/auth/logout');
  localStorage.removeItem(TOKEN_KEY);
};

// Returns User on success, null on 401 (truly logged out), undefined on network error
export const getMe = async (): Promise<User | null | undefined> => {
  try {
    const { data } = await api.get('/api/auth/me');
    return data.data.user;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return undefined; // transient error — caller should keep existing state
  }
};

export const updateProfile = async (fullName: string) => {
  const { data } = await api.patch('/api/auth/profile', { fullName });
  return data.data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete('/api/auth/account');
  return data.data;
};
