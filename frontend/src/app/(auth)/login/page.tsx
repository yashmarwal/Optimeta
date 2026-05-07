'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { login } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const decodedRedirect = redirect ? decodeURIComponent(redirect) : '/dashboard';
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields.');

    setLoading(true);
    try {
      const data = await login(email, password);
      setUser(data.user);
      toast.success('Welcome back!');
      router.push(decodedRedirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMsg || msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-auto bg-bg-dark dot-grid flex items-center justify-center px-4">
      <Link href="/" className="fixed top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-primary border border-transparent hover:border-primary/30 hover:bg-primary/10 transition-all">
        <ArrowLeft size={15} />
        Home
      </Link>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto relative z-10"
        style={{ maxWidth: 'min(448px, 100%)' }}
      >
        <div className="text-center mb-8">
          <h1 className="sr-only">Login to Optimeta</h1>
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/logo.png" alt="Optimeta" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-black gradient-text">OPTIMETA</span>
          </Link>
          <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
          <p className="text-text-muted text-sm">Sign in to your account to continue</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field w-full px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="input-field w-full px-4 py-3 pr-12 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-primary hover:text-accent transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-gradient w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-accent hover:text-primary transition-colors font-medium">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
