'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertTriangle, DollarSign, Users } from 'lucide-react';
import { StickyStackCards } from './StickyStackCards';

const problems = [
  {
    icon: DollarSign,
    title: 'Burning Budget on Gut Feelings',
    desc: 'Most Indian brands run Meta ads without a strategy — targeting random audiences, using copied creatives, and wondering why ROAS is below 1x. Every day of guessing is money down the drain.',
  },
  {
    icon: Users,
    title: 'Agencies Charge ₹50k+ for Basic Blueprints',
    desc: 'Marketing agencies create the same templated campaign plans and charge astronomical fees. Smaller D2C brands and bootstrapped founders simply can\'t compete — until now.',
  },
  {
    icon: AlertTriangle,
    title: 'Generic AI Tools Don\'t Understand India',
    desc: 'ChatGPT doesn\'t know Indian audience behavior, INR economics, or India-specific funnel dynamics. You get generic US-focused advice that\'ll never work for your Tier 2 customer.',
  },
];

const mobileCards = [
  {
    icon: '💸',
    title: 'Burning Budget on Gut Feelings',
    description:
      'Most Indian brands run Meta ads without a strategy — targeting random audiences, using copied creatives, and wondering why ROAS is below 1x.',
  },
  {
    icon: '🏢',
    title: 'Agencies Charge ₹50k+ for Basic Blueprints',
    description:
      'Marketing agencies create the same templated campaign plans and charge astronomical fees. Smaller D2C brands simply can\'t compete — until now.',
  },
  {
    icon: '⚠️',
    title: 'Generic AI Tools Don\'t Understand India',
    description:
      'ChatGPT doesn\'t know Indian audience behavior, INR economics, or India-specific funnel dynamics. You get generic US-focused advice that won\'t work here.',
  },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <>
      {/* Mobile — Sticky Stack */}
      <StickyStackCards
        titleLine1="Why Most Meta Ads"
        titleLine2="Fail in India"
        sectionTitle="The Problem"
        sectionSubtitle="The Indian market demands a fundamentally different approach."
        cards={mobileCards}
      />

      {/* Desktop — Original layout */}
      <section ref={ref} className="hidden md:block py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium mb-4">
              The Problem
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Why Most Meta Ads<br />
              <span className="gradient-text">Fail in India</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              The Indian market demands a fundamentally different approach. Here&apos;s what&apos;s holding brands back.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card p-8 gradient-border transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                  <p.icon size={22} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
