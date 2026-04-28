'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, TrendingUp, Banknote, MessageCircle, Target } from 'lucide-react';

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
                <div className="rounded-2xl overflow-hidden" style={{ width: '520px', background: '#0F0F1A' }}>

                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 mx-3 h-5 bg-white/5 rounded flex items-center px-3">
                      <span className="text-[10px] text-text-muted">optimeta.tech/dashboard/campaign-blueprint/bulk-fabric-leads</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">

                    {/* Back link */}
                    <div className="text-[10px] text-text-muted">← Back to Campaigns</div>

                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-black text-white leading-tight">Tanish Creations — Bulk Fabric Leads</div>
                        <div className="text-[10px] text-text-muted mt-0.5">Strategy & Performance Overview: Mar 27 – Apr 25, 2026</div>
                      </div>
                      <div className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/30 whitespace-nowrap">
                        ✓ Active & Scaling
                      </div>
                    </div>

                    {/* Top metric cards */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Total Ad Spend', value: '₹1,669.33', Icon: Banknote },
                        { label: 'Conversations Started', value: '322', Icon: MessageCircle },
                        { label: 'Avg. Cost per Conversion', value: '₹5.91', Icon: Target },
                      ].map(({ label, value, Icon }) => (
                        <div key={label} className="rounded-xl p-3 border border-white/8" style={{ background: '#161624' }}>
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[9px] text-text-muted leading-tight">{label}</span>
                            <Icon size={13} className="text-white/20 flex-shrink-0 mt-0.5" />
                          </div>
                          <div className="text-base font-black" style={{ color: '#C026D3' }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Trend cards with sparklines */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          label: 'Reach Trend', value: '13K',
                          path: 'M0,28 L10,26 L20,25 L30,24 L40,26 L50,23 L60,20 L70,18 L80,10 L90,6 L100,2',
                        },
                        {
                          label: 'CPC Trend (All)', value: '₹1.34',
                          path: 'M0,18 L10,14 L20,18 L30,12 L40,16 L50,10 L60,16 L70,22 L80,16 L90,14 L100,18',
                        },
                        {
                          label: 'Spend Trend', value: '₹1.1K',
                          path: 'M0,26 L10,25 L20,24 L30,25 L40,24 L50,23 L60,22 L70,20 L80,14 L90,8 L100,2',
                        },
                      ].map(({ label, value, path }) => (
                        <div key={label} className="rounded-xl p-3 border border-white/8" style={{ background: '#161624' }}>
                          <div className="text-[9px] text-text-muted mb-1">{label}</div>
                          <div className="text-sm font-black text-white mb-2">{value}</div>
                          <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C026D3" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#C026D3" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d={`${path} L100,30 L0,30 Z`} fill={`url(#g-${label})`} />
                            <path d={path} fill="none" stroke="#C026D3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ))}
                    </div>

                    {/* Budget split */}
                    <div className="rounded-xl p-3 border border-white/8" style={{ background: '#161624' }}>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <TrendingUp size={11} className="text-accent" />
                        <span className="text-[10px] font-semibold text-white">Refined Budget Split</span>
                      </div>
                      {[
                        { label: 'Awareness', pct: 20 },
                        { label: 'Consideration', pct: 30 },
                        { label: 'Conversion (Focus)', pct: 50 },
                      ].map(({ label, pct }) => (
                        <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
                          <span className="text-[9px] text-text-muted w-28 flex-shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#7B2FBE,#C026D3)' }} />
                          </div>
                          <span className="text-[9px] text-text-muted w-6 text-right">{pct}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Ad angle cards */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'Pain-point ad:', copy: '"Struggling to find real bulk fabric buyers?"' },
                        { type: 'Desire ad:', copy: '"Your bulk fabric inventory, sold at scale."' },
                        { type: 'Trust ad:', copy: '"Over 15,000 textile businesses count on Tanish Creations\' leads."' },
                      ].map(({ type, copy }) => (
                        <div key={type} className="rounded-xl p-2.5 border border-white/8" style={{ background: '#161624' }}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C026D3' }} />
                            <span className="text-[9px] text-text-muted">{type}</span>
                          </div>
                          <p className="text-[9px] text-white leading-relaxed">{copy}</p>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="text-right">
                      <span className="text-[9px] text-text-muted">Powered by Optimeta</span>
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
