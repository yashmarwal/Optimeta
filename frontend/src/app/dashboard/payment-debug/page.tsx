'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function PaymentDebugPage() {
  const { user, authChecked } = useAuth();
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setLoading(label);
    try {
      const result = await fn();
      setResults((r) => ({ ...r, [label]: { ok: true, data: result } }));
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: unknown }; message?: string };
      setResults((r) => ({
        ...r,
        [label]: { ok: false, status: e.response?.status, data: e.response?.data, message: e.message },
      }));
    } finally {
      setLoading(null);
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('optimeta_token') : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-black text-white">Payment Debug</h1>

      <div className="glass-card p-6 space-y-3">
        <h2 className="font-bold text-white mb-4">Auth State</h2>
        <div className="text-sm text-text-secondary">
          <div><span className="text-text-muted">authChecked:</span> {String(authChecked)}</div>
          <div><span className="text-text-muted">user:</span> {user ? JSON.stringify(user) : 'null'}</div>
          <div><span className="text-text-muted">plan:</span> {user?.plan ?? 'N/A'}</div>
          <div><span className="text-text-muted">campaignsUsed:</span> {user?.campaignsUsed ?? 'N/A'}</div>
          <div><span className="text-text-muted">token in localStorage:</span> {token ? `${token.slice(0, 20)}...` : 'MISSING'}</div>
          <div><span className="text-text-muted">payment_in_progress:</span> {localStorage.getItem('payment_in_progress') ?? 'not set'}</div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-3">
        <h2 className="font-bold text-white mb-4">API Tests</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => run('GET /api/auth/me', async () => { const { data } = await api.get('/api/auth/me'); return data; })}
            disabled={loading === 'GET /api/auth/me'}
            className="btn-ghost px-4 py-2 rounded-lg text-sm"
          >
            {loading === 'GET /api/auth/me' ? 'Loading...' : 'GET /auth/me'}
          </button>

          <button
            onClick={() => run('GET /api/payments/subscription', async () => { const { data } = await api.get('/api/payments/subscription'); return data; })}
            disabled={loading === 'GET /api/payments/subscription'}
            className="btn-ghost px-4 py-2 rounded-lg text-sm"
          >
            {loading === 'GET /api/payments/subscription' ? 'Loading...' : 'GET /subscription'}
          </button>

          <button
            onClick={() => run('POST /api/payments/create-subscription (pro)', async () => {
              const { data } = await api.post('/api/payments/create-subscription', { plan: 'pro' });
              return data;
            })}
            disabled={loading === 'POST /api/payments/create-subscription (pro)'}
            className="btn-ghost px-4 py-2 rounded-lg text-sm"
          >
            {loading === 'POST /api/payments/create-subscription (pro)' ? 'Loading...' : 'POST /create-subscription'}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('payment_in_progress');
              localStorage.removeItem('generation_in_progress');
              setResults({});
            }}
            className="px-4 py-2 rounded-lg text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all"
          >
            Clear flags &amp; results
          </button>
        </div>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-white">Results</h2>
          {Object.entries(results).map(([label, result]) => {
            const r = result as { ok: boolean; status?: number; data?: unknown; message?: string };
            return (
              <div key={label}>
                <div className={`text-sm font-semibold mb-1 ${r.ok ? 'text-green-400' : 'text-red-400'}`}>
                  {r.ok ? '✓' : '✗'} {label} {!r.ok && r.status ? `(${r.status})` : ''}
                </div>
                <pre className="text-xs text-text-muted bg-bg-dark rounded-lg p-3 overflow-auto max-h-48">
                  {JSON.stringify(r.ok ? r.data : { status: r.status, data: r.data, message: r.message }, null, 2)}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
