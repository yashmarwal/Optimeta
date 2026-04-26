'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, TrendingUp } from 'lucide-react';

const avatars = ['R', 'P', 'A', 'V', 'K'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
                <Sparkles size={14} className="text-accent" />
                <span className="text-sm text-text-secondary font-medium">AI-Powered Campaign Architect</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              <span className="text-white">Stop Guessing.</span>
              <br />
              <span className="gradient-text">Start Winning.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-lg text-text-secondary leading-relaxed mb-10 max-w-xl"
            >
              Transform your business into a complete Meta ad campaign blueprint in seconds. Built for Indian D2C brands, SaaS companies & agencies — no agency needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link href="/register">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="btn-gradient px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 glow"
                >
                  Generate Free Campaign
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="#how-it-works">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="btn-ghost px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2"
                >
                  <Play size={16} />
                  See How It Works
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {avatars.map((a, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-bg-dark flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, #7B2FBE, #C026D3)`, zIndex: avatars.length - i }}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-sm text-text-secondary">
                  Trusted by <span className="text-white font-semibold">500+ Indian brands</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex flex-col items-center"
          >
            <div className="animate-float">
              <div className="glass-card p-2 glow-lg" style={{ borderRadius: '20px' }}>
                {/* Fake Meta Ads Manager UI */}
                <div
                  className="w-full rounded-2xl overflow-hidden"
                  style={{ width: '520px', background: '#0F0F1A' }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border-color">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 mx-4 h-6 bg-bg-dark rounded-md flex items-center px-3">
                      <span className="text-xs text-text-muted">optimeta.in/dashboard</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-text-muted mb-1">Campaign Blueprint</div>
                        <div className="text-lg font-bold text-white">Zura Skincare — Q1 2026</div>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
                        ✓ Ready
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Expected ROAS', value: '4.2x', color: '#C026D3' },
                        { label: 'Daily Budget', value: '₹2,500', color: '#7B2FBE' },
                        { label: 'Audience Size', value: '1.2M', color: '#C026D3' },
                      ].map((m) => (
                        <div key={m.label} className="bg-bg-dark rounded-xl p-3 border border-border-color">
                          <div className="text-xs text-text-muted mb-1">{m.label}</div>
                          <div className="text-lg font-bold" style={{ color: m.color }}>{m.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                      <div className="text-xs text-text-muted mb-3 flex items-center gap-1.5">
                        <TrendingUp size={12} className="text-accent" />
                        Budget Split
                      </div>
                      {[
                        { label: 'Awareness', pct: 30, color: '#7B2FBE' },
                        { label: 'Consideration', pct: 40, color: '#9B3FDE' },
                        { label: 'Conversion', pct: 30, color: '#C026D3' },
                      ].map((bar) => (
                        <div key={bar.label} className="mb-2">
                          <div className="flex justify-between text-xs text-text-secondary mb-1">
                            <span>{bar.label}</span>
                            <span className="font-semibold">{bar.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full progress-bar" style={{ width: `${bar.pct}%`, background: bar.color }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {[
                        'Pain-point ad: "Tired of dull skin..."',
                        'Desire ad: "Glow that stops traffic"',
                        'Trust ad: "10,000 happy customers"',
                      ].map((copy, i) => (
                        <div key={i} className="flex items-center gap-3 bg-bg-dark rounded-lg p-2.5 border border-border-color">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          <span className="text-xs text-text-secondary">{copy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4">Real results from Optimeta users</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
