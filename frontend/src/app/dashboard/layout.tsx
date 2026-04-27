'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Don't redirect if a token exists — Providers may still be refreshing
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('optimeta_token');
      if (!hasToken) router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading Optimeta...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-dark flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardTopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 dot-grid">
          {children}
        </main>
      </div>
    </div>
  );
}
