'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Star, Crown, Lock } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string | null;
  firstCampaignPaid: boolean;
  onSuccess: () => void;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export function PaywallModal({ isOpen, onClose, reason, firstCampaignPaid, onSuccess }: PaywallModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleStarterPayment = async () => {
    setLoading('starter');
    try {
      await loadRazorpayScript();
      const res = await api.post('/api/payments/starter');
      const { orderId, amount, currency, key } = res.data.data;

      const rzp = new window.Razorpay({
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Optimeta',
        description: 'First Campaign Blueprint — ₹49',
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await api.post('/api/payments/starter/verify', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Generating your campaign...');
            onClose();
            onSuccess();
          } catch {
            toast.error('Payment verification failed. Please contact support.');
            setLoading(null);
          }
        },
        modal: { ondismiss: () => setLoading(null) },
        theme: { color: '#7B2FBE' },
      });

      rzp.open();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Could not initiate payment. Please try again.');
      setLoading(null);
    }
  };

  const handleSubscription = (plan: string) => {
    router.push(`/pricing?plan=${plan}`);
  };

  const isUltraLimited = reason === 'ultra_limit';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-md bg-bg-card border border-border-color rounded-2xl p-6 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Lock size={18} className="text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Unlock Campaign Generation</h2>
                <p className="text-xs text-text-muted">Choose a plan to continue</p>
              </div>
            </div>

            {isUltraLimited ? (
              <div className="text-center py-4 px-2">
                <p className="text-text-secondary text-sm leading-relaxed">
                  You&apos;ve used all 10 campaigns on your Ultra plan. Your campaigns reset at the start of each billing cycle.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {!firstCampaignPaid && (
                  <>
                    <button
                      onClick={handleStarterPayment}
                      disabled={loading !== null}
                      className="w-full p-4 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 disabled:opacity-60 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0">
                          <Zap size={16} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white">First Campaign Blueprint</div>
                          <div className="text-xs text-text-muted">One-time • 1 campaign</div>
                        </div>
                        <div className="text-lg font-black gradient-text flex-shrink-0">
                          {loading === 'starter' ? '...' : '₹49'}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border-color" />
                      <span className="text-xs text-text-muted whitespace-nowrap">or subscribe for more</span>
                      <div className="flex-1 h-px bg-border-color" />
                    </div>
                  </>
                )}

                <button
                  onClick={() => handleSubscription('pro')}
                  disabled={loading !== null}
                  className="w-full p-4 rounded-xl border border-border-color hover:border-primary/50 bg-white/2 hover:bg-white/5 disabled:opacity-60 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Star size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">Pro</div>
                      <div className="text-xs text-text-muted">5 campaigns / month</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-white">₹499</div>
                      <div className="text-xs text-text-muted">/month</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSubscription('ultra')}
                  disabled={loading !== null}
                  className="w-full p-4 rounded-xl border border-border-color hover:border-accent/50 bg-white/2 hover:bg-white/5 disabled:opacity-60 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Crown size={16} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">Ultra</div>
                      <div className="text-xs text-text-muted">10 campaigns / month</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-white">₹999</div>
                      <div className="text-xs text-text-muted">/month</div>
                    </div>
                  </div>
                </button>
              </div>
            )}

            <p className="text-center text-xs text-text-muted mt-5">
              Secure payment via Razorpay • Cancel anytime • No hidden charges
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
