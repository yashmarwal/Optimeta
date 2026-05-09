'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToSection = (id: string) => {
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  const navLinkClass = 'text-sm text-text-secondary hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-dark/90 backdrop-blur-xl border-b border-border-color'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Optimeta" width={32} height={32} className="object-contain" />
            <span className="text-xl font-black gradient-text tracking-tight">OPTIMETA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className={navLinkClass}>Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className={navLinkClass}>How it works</button>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-text-secondary hover:text-white transition-colors">Blog</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="btn-gradient px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  Dashboard →
                </motion.button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-sm text-text-secondary hover:text-white transition-colors px-4 py-2">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="btn-gradient px-5 py-2 rounded-lg text-sm font-semibold"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-text-secondary hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-bg-card border-b border-border-color px-4 pb-4"
        >
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => { scrollToSection('features'); setMenuOpen(false); }}
              className="text-sm text-text-secondary py-2 text-left bg-transparent border-none cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => { scrollToSection('how-it-works'); setMenuOpen(false); }}
              className="text-sm text-text-secondary py-2 text-left bg-transparent border-none cursor-pointer"
            >
              How it works
            </button>
            <Link href="/pricing" className="text-sm text-text-secondary py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/blog" className="text-sm text-text-secondary py-2" onClick={() => setMenuOpen(false)}>Blog</Link>
            {user ? (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <button className="btn-gradient w-full py-2.5 rounded-lg text-sm font-semibold">Dashboard →</button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button className="btn-ghost w-full py-2.5 rounded-lg text-sm">Login</button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <button className="btn-gradient w-full py-2.5 rounded-lg text-sm font-semibold">Get Started Free</button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
