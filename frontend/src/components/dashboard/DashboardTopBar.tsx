'use client';

import { useAuth } from '@/hooks/useAuth';
import { Bell } from 'lucide-react';
import Link from 'next/link';

const planColors: Record<string, string> = {
  free: 'badge-free',
  pro: 'badge-pro',
  ultra: 'badge-ultra',
};

export default function DashboardTopBar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="border-b border-border-color bg-bg-card/60 backdrop-blur-xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-sm font-semibold text-white">
          Good day, <span className="gradient-text">{user.fullName?.split(' ')[0] || 'there'}</span> 👋
        </h1>
        <p className="text-xs text-text-muted">Build your winning Meta campaign</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Campaigns remaining */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-dark border border-border-color">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-xs text-text-secondary">
            Plan:{' '}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[user.plan] || 'badge-free'}`}>
              {user.plan.toUpperCase()}
            </span>
          </span>
        </div>

        <Link href="/dashboard/settings">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:opacity-80 transition-opacity">
            {user.fullName?.[0]?.toUpperCase() || 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
}
