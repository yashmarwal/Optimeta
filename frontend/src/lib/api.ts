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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isPublic = PUBLIC_PATHS.includes(path) || path.startsWith('/blog/');
        if (!isPublic) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
