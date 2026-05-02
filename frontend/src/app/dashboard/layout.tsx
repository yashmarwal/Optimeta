'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { DashboardLayoutSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;
    if (!user) {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${redirect}`);
    }
  }, [user, authChecked, router]);

  if (!authChecked || loading) return <DashboardLayoutSkeleton />;

  return (
    <div className="min-h-screen bg-bg-dark flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 min-w-0">
        <DashboardTopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 dot-grid min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
