'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Crown, Star, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const PLAN_DETAILS = {
  pro: {
    name: 'Pro',
    price: '₹499',
    icon: Star,
    features: [
      '10 campaigns per month',
      'Full blueprint',
      'Targeting & ad angles',
      'Ad copy generation',
      'Launch checklist',
      'PDF export',
      'Campaign history',
      'Priority support',
    ],
  },
  ultra: {
    name: 'Ultra',
    price: '₹999',
    icon: Crown,
    features: [
      '30 campaigns per month',
      'Full blueprint',
      'Targeting & ad angles',
      'Ad copy generation',
      'Launch checklist',
      'PDF export',
      'Campaign history',
      'Advanced targeting insights',
      'Priority support',
    ],
  },
};

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh, authChecked } = useAuth();
  const [paying, setPaying] = useState(false);

  const planKey = (searchParams.get('plan') === 'ultra' ? 'ultra' : 'pro') as 'pro' | 'ultra';
  const plan = PLAN_DETAILS[planKey];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (user && user.plan !== 'free') {
      router.replace('/dashboard/settings');
    }
  }, [user, authChecked, router]);

  // Always clean up flag on unmount in case payment was abandoned
  useEffect(() => {
    return () => {
      localStorage.removeItem('payment_in_progress');
    };
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please log in to upgrade.');
      return;
    }

    setPaying(true);
    localStorage.setItem('payment_in_progress', 'true');

    try {
      const { data } = await api.post('/api/payments/create-subscription', { plan: planKey });
      const { subscription_id, razorpay_key_id, user_email, user_name } = data.data;

      const options = {
        key: razorpay_key_id,
        subscription_id,
        name: 'Optimeta',
        description: `${plan.name} Plan — ${plan.price}/month`,
        image: '/logo.png',
        prefill: { email: user_email || user?.email, name: user_name || user?.fullName },
        theme: { color: '#7B2FBE' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await api.post('/api/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              plan: planKey,
            });
            localStorage.removeItem('payment_in_progress');
            await refresh();
            toast.success(`Welcome to ${plan.name}! Your subscription is now active.`);
            router.push('/dashboard');
          } catch {
            localStorage.removeItem('payment_in_progress');
            toast.error('Payment received but verification failed. Contact support if your plan was not upgraded.');
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            localStorage.removeItem('payment_in_progress');
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      localStorage.removeItem('payment_in_progress');
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        toast.error('Session expired. Please log in again.');
        const redirect = encodeURIComponent(`/dashboard/upgrade?plan=${planKey}`);
        router.push(`/login?redirect=${redirect}`);
      } else {
        toast.error(msg || 'Failed to start payment. Please try again.');
      }
      setPaying(false);
    }
  };

  if (!authChecked) return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!user) return null;
  if (user.plan !== 'free') {
    router.replace('/dashboard/settings');
    return null;
  }

  const PlanIcon = plan.icon;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Upgrade to {plan.name}</h1>
        <p className="text-text-muted text-sm">One step to unlock full campaign power.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-7 border-primary/40"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <PlanIcon size={22} className="text-white" />
          </div>
          <div>
            <div className="font-black text-white text-xl">{plan.name} Plan</div>
            <div className="text-text-muted text-sm">Billed monthly · Cancel anytime</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-black gradient-text">{plan.price}</div>
            <div className="text-xs text-text-muted">/month</div>
          </div>
        </div>

        <div className="space-y-2.5 mb-8">
          {plan.features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-accent" />
              </div>
              <span className="text-sm text-text-secondary">{f}</span>
            </div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleUpgrade}
          disabled={paying}
          className="btn-gradient w-full py-3.5 rounded-xl font-bold text-sm glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {paying ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            `Pay ${plan.price}/month`
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-2 mt-4">
          <ShieldCheck size={14} className="text-text-muted" />
          <p className="text-xs text-text-muted">Secure payment via Razorpay · 256-bit SSL</p>
        </div>
      </motion.div>

      {planKey === 'pro' && (
        <p className="text-center text-xs text-text-muted">
          Want more?{' '}
          <button
            onClick={() => router.push('/dashboard/upgrade?plan=ultra')}
            className="text-accent hover:text-primary transition-colors"
          >
            View Ultra plan →
          </button>
        </p>
      )}
      {planKey === 'ultra' && (
        <p className="text-center text-xs text-text-muted">
          Looking for a lighter plan?{' '}
          <button
            onClick={() => router.push('/dashboard/upgrade?plan=pro')}
            className="text-accent hover:text-primary transition-colors"
          >
            View Pro plan →
          </button>
        </p>
      )}
    </div>
  );
}
