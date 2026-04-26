'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, CreditCard, AlertTriangle, Check, X } from 'lucide-react';
import api from '@/lib/api';
import { updateProfile, deleteAccount } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface SubscriptionData {
  plan: string;
  subscription: {
    status: string;
    current_period_end: string;
    razorpay_subscription_id: string;
    daysRemaining: number;
  } | null;
}

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
    const fetchSub = async () => {
      try {
        const { data } = await api.get('/api/payments/subscription');
        setSub(data.data);
      } catch {
        // no subscription
      }
    };
    fetchSub();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) return toast.error('Name cannot be empty.');
    setSavingProfile(true);
    try {
      await updateProfile(fullName);
      await refresh();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      await api.post('/api/payments/cancel');
      toast.success('Subscription cancelled. Access continues until period end.');
      setShowCancelModal(false);
      await refresh();
    } catch {
      toast.error('Cancellation failed. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return toast.error('Type DELETE to confirm.');
    setDeleteLoading(true);
    try {
      await deleteAccount();
      toast.success('Account deleted.');
      router.push('/');
    } catch {
      toast.error('Account deletion failed.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-text-muted text-sm">Manage your profile and subscription.</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <User size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-bold text-white">Profile</h2>
            <p className="text-xs text-text-muted">Update your name</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
            <input
              className="input-field w-full px-4 py-3 text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
            <input
              className="input-field w-full px-4 py-3 text-sm opacity-60 cursor-not-allowed"
              value={user?.email || ''}
              readOnly
            />
            <p className="text-xs text-text-muted mt-1">Email cannot be changed.</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
          >
            {savingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
            Save Profile
          </motion.button>
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <CreditCard size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-bold text-white">Subscription</h2>
            <p className="text-xs text-text-muted">Manage your plan</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
              <div className="text-xs text-text-muted mb-2">Current Plan</div>
              <div className="text-lg font-black gradient-text">{user?.plan?.toUpperCase()}</div>
            </div>
            <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
              <div className="text-xs text-text-muted mb-2">Status</div>
              <div className={`text-sm font-semibold ${sub?.subscription?.status === 'active' ? 'text-green-400' : 'text-text-secondary'}`}>
                {sub?.subscription?.status || (user?.plan === 'free' ? 'Free Plan' : 'Active')}
              </div>
            </div>
          </div>

          {sub?.subscription?.current_period_end && (
            <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
              <div className="text-xs text-text-muted mb-1">Renewal Date</div>
              <div className="text-sm text-white font-semibold">
                {new Date(sub.subscription.current_period_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {sub.subscription.daysRemaining !== undefined && (
                <div className="text-xs text-text-muted mt-1">{sub.subscription.daysRemaining} days remaining</div>
              )}
            </div>
          )}

          {user?.plan === 'free' && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-1">Upgrade for more campaigns</div>
              <div className="text-xs text-text-muted mb-3">Pro: 15 campaigns/month · Ultra: 50 campaigns/month</div>
              <a href="/pricing">
                <button className="btn-gradient px-5 py-2 rounded-lg text-sm font-semibold">View Plans →</button>
              </a>
            </div>
          )}

          {sub?.subscription?.status === 'active' && user?.plan !== 'free' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-sm text-red-400 hover:text-red-300 transition-colors border border-red-500/20 hover:border-red-500/40 px-4 py-2 rounded-lg"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-7 border-red-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-white">Danger Zone</h2>
            <p className="text-xs text-text-muted">Irreversible actions</p>
          </div>
        </div>
        <p className="text-sm text-text-muted mb-4">Deleting your account permanently removes all your campaigns and data. This cannot be undone.</p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-sm text-red-400 border border-red-500/30 px-5 py-2.5 rounded-xl hover:bg-red-500/10 transition-all"
        >
          Delete Account
        </button>
      </motion.div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-card p-8 max-w-md w-full">
              <h3 className="text-xl font-black text-white mb-3">Cancel Subscription?</h3>
              <p className="text-text-muted text-sm mb-6">Your access continues until the end of the current billing period. After that, you&apos;ll be downgraded to the free plan.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(false)} className="btn-ghost flex-1 py-2.5 rounded-xl text-sm">Keep Plan</button>
                <button onClick={handleCancelSubscription} disabled={cancelLoading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-all disabled:opacity-60">
                  {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-card p-8 max-w-md w-full">
              <h3 className="text-xl font-black text-white mb-3">Delete Account?</h3>
              <p className="text-text-muted text-sm mb-4">This will permanently delete all your campaigns and cannot be undone. Type <strong className="text-white">DELETE</strong> to confirm.</p>
              <input className="input-field w-full px-4 py-3 text-sm mb-4" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type DELETE to confirm" />
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} className="btn-ghost flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                <button onClick={handleDeleteAccount} disabled={deleteLoading || deleteConfirm !== 'DELETE'} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition-all">
                  {deleteLoading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
