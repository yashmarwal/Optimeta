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

// 401 interceptor — never do a hard redirect (window.location.href wipes
// React state and causes the payment loop). Just reject the promise and
// let each component handle auth failures in its own catch block.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
