import axios from 'axios';

const TOKEN_KEY = 'optimeta_token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Cross-origin fallback: attach stored token as Authorization header
// so requests work when sameSite cookies are blocked (Vercel ↔ Render)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const PUBLIC_PATHS = ['/', '/pricing', '/blog', '/login', '/register', '/forgot-password', '/reset-password'];
// These API paths must never trigger a login redirect — let the caller handle 401 errors
const SILENT_API_PATHS = ['/api/payments/', '/api/auth/'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const requestUrl = error.config?.url || '';
        const isPublic = PUBLIC_PATHS.includes(path) || path.startsWith('/blog/');
        const isSilent = SILENT_API_PATHS.some((p) => requestUrl.includes(p));
        const paymentInProgress = localStorage.getItem('payment_in_progress');
        if (!isPublic && !isSilent && !paymentInProgress) {
          const redirect = encodeURIComponent(path + window.location.search);
          window.location.href = `/login?redirect=${redirect}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
