'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Check, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { register } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

const getDeviceData = () => {
  const browserFingerprint = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}`,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    (navigator as { deviceMemory?: number }).deviceMemory || 0,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join('|');

  let canvasFingerprint = '';
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Optimeta fingerprint', 2, 2);
      canvasFingerprint = canvas.toDataURL().slice(-50);
    }
  } catch { /* ignore */ }

  return {
    browserFingerprint,
    canvasFingerprint,
    sessionFlag: sessionStorage.getItem('optimeta_registered'),
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    userAgent: navigator.userAgent,
  };
};

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const selectedPlan = searchParams.get('plan');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return toast.error('Please fill in all fields.');
    if (password.length < 8) return toast.error('Password must be at least 8 characters.');
    if (!agreed) return toast.error('Please agree to the terms of service.');

    setLoading(true);
    try {
      const deviceData = getDeviceData();
      const data = await register(email, password, fullName, deviceData);
      sessionStorage.setItem('optimeta_registered', 'true');
      setUser(data.user);
      toast.success('Account created! Welcome to Optimeta.');

      if (selectedPlan && selectedPlan !== 'free') {
        router.push(`/dashboard?upgrade=${selectedPlan}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMsg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-auto bg-bg-dark dot-grid flex items-center justify-center px-4 py-16">
      <Link href="/" className="fixed top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-primary border border-transparent hover:border-primary/30 hover:bg-primary/10 transition-all">
        <ArrowLeft size={15} />
        Home
      </Link>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          <h1 className="sr-only">Create Your Optimeta Account</h1>
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/logo.png" alt="Optimeta" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-black gradient-text">OPTIMETA</span>
          </Link>
          <h2 className="text-3xl font-black text-white mb-2">Create your account</h2>
          <p className="text-text-muted text-sm">
            {selectedPlan
              ? `Starting with the ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan`
              : 'Start free — no credit card required'}
          </p>
        </div>

        <div className="glass-card p-8">
          {/* Free plan highlight */}
          {!selectedPlan && (
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
              <Check size={16} className="text-accent flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Free plan included</div>
                <div className="text-xs text-text-muted">1 campaign blueprint — no card needed</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
                className="input-field w-full px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@yourstore.com"
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
                  placeholder="Minimum 8 characters"
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

            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center transition-all cursor-pointer ${
                  agreed ? 'bg-primary border-primary' : 'border-border-color bg-bg-card'
                }`}
              >
                {agreed && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-text-muted">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-accent hover:text-primary transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" target="_blank" className="text-accent hover:text-primary transition-colors">Privacy Policy</Link>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-gradient w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed glow"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:text-primary transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
