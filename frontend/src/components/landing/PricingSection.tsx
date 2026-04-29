'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Zap, Star, Crown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const plans = [
  {
    name: 'Free',
    icon: Zap,
    price: '₹0',
    period: 'forever',
    description: 'Perfect to try Optimeta',
    features: [
      '1 campaign lifetime',
      'Basic blueprint',
      'Targeting & ad angles',
      'Ad copy generation',
      'Launch checklist',
    ],
    excluded: ['PDF export', 'Campaign history'],
    cta: 'Get Started Free',
    href: '/register',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Pro',
    icon: Star,
    price: '₹499',
    period: '/month',
    description: 'For growing brands & founders',
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
    excluded: [],
    cta: 'Start Pro',
    href: '/register?plan=pro',
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Ultra',
    icon: Crown,
    price: '₹999',
    period: '/month',
    description: 'For agencies & power users',
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
    excluded: [],
    cta: 'Start Ultra',
    href: '/register?plan=ultra',
    highlighted: false,
    badge: null,
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { user } = useAuth();
  const isLoggedInFree = !!user && user.plan === 'free';

  return (
    <section id="pricing" ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple, Transparent<br />
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-text-secondary">Start free. Upgrade when you&apos;re ready to scale.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              whileHover={{ scale: plan.highlighted ? 1.03 : 1.01, y: -4 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-primary/20 to-bg-card border-2 border-primary glow'
                  : 'glass-card'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full text-xs font-black bg-gradient-to-r from-primary to-accent text-white">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.highlighted ? 'bg-primary' : 'bg-primary/20 border border-primary/30'
                }`}>
                  <plan.icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-white text-lg">{plan.name}</div>
                  <div className="text-xs text-text-muted">{plan.description}</div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-text-secondary">{plan.period}</span>
                </div>
              </div>

              <Link href={
                isLoggedInFree && plan.name !== 'Free'
                  ? `/dashboard/upgrade?plan=${plan.name.toLowerCase()}`
                  : plan.href
              }>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-xl font-bold text-sm mb-8 transition-all ${
                    plan.highlighted
                      ? 'btn-gradient glow'
                      : 'btn-ghost'
                  }`}
                >
                  {isLoggedInFree && plan.name !== 'Free' ? `Upgrade to ${plan.name}` : plan.cta}
                </motion.button>
              </Link>

              <div className="space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-accent" />
                    </div>
                    <span className="text-sm text-text-secondary">{f}</span>
                  </div>
                ))}
                {plan.excluded.map((f) => (
                  <div key={f} className="flex items-center gap-3 opacity-30">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-text-muted">—</span>
                    </div>
                    <span className="text-sm text-text-muted line-through">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
