'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, Settings, LogOut, X, Menu, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'My Campaigns', href: '/dashboard', icon: LayoutGrid },
  { label: 'New Campaign', href: '/dashboard/new', icon: Plus },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    toast.success('Logged out.');
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border-color">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Optimeta" width={32} height={32} className="object-contain" />
          <span className="text-lg font-black gradient-text">OPTIMETA</span>
        </Link>
      </div>

      {/* New Campaign CTA */}
      <div className="p-4">
        <Link href="/dashboard/new">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="btn-gradient w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            New Campaign
          </motion.button>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {navItems.map((item) => {
          const active = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                active
                  ? 'bg-primary/15 text-white border border-primary/30'
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}>
                <item.icon size={17} className={active ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto text-primary" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border-color">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {user?.fullName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.fullName}</div>
            <div className="text-xs text-text-muted truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-bg-card border-r border-border-color flex-col z-40">
        <SidebarContent />
      </div>

      {/* Mobile trigger */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow shadow-xl"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} className="text-white" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-bg-card border-r border-border-color z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
