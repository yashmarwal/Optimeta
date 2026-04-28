'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const [accessToken, setAccessToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('access_token');
    if (token) {
      setAccessToken(token);
    } else {
      setTokenError(true);
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => router.push('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        access_token: accessToken,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMsg || 'Password reset failed. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark dot-grid flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/logo.png" alt="Optimeta" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-black gradient-text">OPTIMETA</span>
          </Link>
        </div>

        {tokenError ? (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400 font-semibold mb-2">Invalid reset link</p>
            <p className="text-text-muted text-sm mb-6">
              This link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/forgot-password">
              <button className="btn-gradient w-full py-3 rounded-xl font-bold">
                Request New Link
              </button>
            </Link>
          </div>
        ) : success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Password updated!</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-1">
              You can now login with your new password.
            </p>
            <p className="text-text-muted text-xs mb-6">Redirecting to login in 3 seconds…</p>
            <Link href="/login">
              <button className="btn-gradient w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                Go to Login
                <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="glass-card p-8">
            <h1 className="text-2xl font-black text-white mb-1">Set New Password</h1>
            <p className="text-text-muted text-sm mb-6">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="input-field w-full px-4 py-3 pr-12 text-sm"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    className="input-field w-full px-4 py-3 pr-12 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5">Passwords do not match.</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading || !accessToken}
                whileTap={{ scale: 0.97 }}
                className="btn-gradient w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Update Password <ArrowRight size={16} /></>
                )}
              </motion.button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
