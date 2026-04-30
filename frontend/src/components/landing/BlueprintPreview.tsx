'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, Target, Zap, DollarSign, Users, Sparkles, MessageSquare, CheckSquare,
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'summary',
    icon: TrendingUp,
    label: 'Executive Summary',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    content: {
      title: 'Nourish Organics — Skin Ritual Launch',
      body: 'Target health-conscious urban women aged 25–38 across Tier 1 metros with a full-funnel strategy leveraging Instagram Reels and Feed placements. Focus on cold traffic with Advantage+ Shopping to drive first purchases at ₹40–60 CPA.',
    },
  },
  {
    id: 'objective',
    icon: Target,
    label: 'Campaign Objective',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    content: {
      recommended: 'CONVERSIONS → PURCHASE',
      meta: 'Advantage+ Shopping Campaign',
      reason: "Your pixel has 500+ purchase events — enough signal for Meta's AI to optimise cost-efficiently. Manual CBO would underperform vs. ASC at this stage.",
    },
  },
  {
    id: 'funnel',
    icon: Zap,
    label: 'Funnel Strategy',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    content: {
      stage: 'Full Funnel',
      split: '70% Cold · 20% Warm · 10% Hot',
      approach: 'Lead with awareness Reels for cold audiences. Retarget video viewers (75%) with testimonial carousels. Hit cart abandoners with urgency-based DPA.',
    },
  },
  {
    id: 'budget',
    icon: DollarSign,
    label: 'Budget Strategy',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    content: {
      daily: '₹2,000/day',
      split: { Awareness: '40%', Consideration: '30%', Conversion: '30%' },
      scaling: 'Scale 20% every 3 days when ROAS > 3x. Pause ad sets with CPM > ₹180.',
    },
  },
  {
    id: 'targeting',
    icon: Users,
    label: 'Audience Targeting',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    content: {
      demo: 'Women 24–38 · Mumbai, Delhi, Bangalore, Pune',
      interests: ['Organic Skincare', 'Ayurveda', 'Clean Beauty', 'Yoga & Wellness', 'Natural Products'],
      exclusions: 'Exclude: Recent purchasers (30d), Existing subscribers',
    },
  },
  {
    id: 'angles',
    icon: Sparkles,
    label: 'Ad Angles',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    content: {
      angles: [
        { type: 'PAIN POINT', text: 'Tired of harsh chemicals ruining your skin?' },
        { type: 'DESIRE', text: "Unlock the skin you've always wanted — naturally." },
        { type: 'SOCIAL PROOF', text: '12,000+ women switched to clean beauty this year.' },
        { type: 'CURIOSITY', text: 'This Ayurvedic secret is breaking the internet.' },
      ],
    },
  },
  {
    id: 'copy',
    icon: MessageSquare,
    label: 'Ad Copy',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    content: {
      headline: '"Your skin deserves better than chemicals. Try Nourish."',
      subheadline: "India's first 100% organic skincare ritual — visible glow in 14 days.",
      cta: 'Shop Now — Free Shipping',
    },
  },
  {
    id: 'checklist',
    icon: CheckSquare,
    label: 'Launch Checklist',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    content: {
      items: [
        'Install Meta Pixel with Purchase & ViewContent events',
        'Upload 5+ product images and 2 Reels to creative library',
        'Set up Custom Audiences: Website visitors (30d, 90d, 180d)',
        'Create Lookalike from top 1% of purchasers',
        'Enable Advantage+ Placements for cold campaigns',
        'Set automated rule: pause ad sets if CPM > ₹180',
      ],
    },
  },
];

const INTERVAL = 2500;

export default function BlueprintPreview() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setActive(index);
    setProgress(0);
    startTimeRef.current = null;
  }, []);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % SECTIONS.length);
    setProgress(0);
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (ts: number) => {
      if (startTimeRef.current === null) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        advance();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [paused, active, advance]);

  const section = SECTIONS[active];
  const Icon = section.icon;

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Live Preview
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            This is What Optimeta<br />
            <span className="gradient-text">Generates for You</span>
          </h2>
          <p className="text-text-secondary">
            A complete, data-driven blueprint — every section tailored to your brand.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card overflow-hidden glow"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border-color bg-bg-dark/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-text-muted ml-2">optimeta — campaign blueprint</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">{section.label}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progress}%`, transition: 'none' }}
            />
          </div>

          {/* Content area */}
          <div className="p-8 min-h-[300px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${section.bg} border ${section.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={section.color} />
                  </div>
                  <div>
                    <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
                      Section {active + 1} of {SECTIONS.length}
                    </div>
                    <div className="font-bold text-white">{section.label}</div>
                  </div>
                </div>

                <SectionContent section={section} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-2 px-5 pb-5">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-6 h-2 bg-primary'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionContent({ section }: { section: (typeof SECTIONS)[0] }) {
  const c = section.content as Record<string, unknown>;

  if (section.id === 'summary') {
    return (
      <div className="space-y-3">
        <div className="text-lg font-bold text-white">{c.title as string}</div>
        <p className="text-sm text-text-secondary leading-relaxed">{c.body as string}</p>
      </div>
    );
  }

  if (section.id === 'objective') {
    return (
      <div className="space-y-4">
        <div className="inline-block px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/25">
          <div className="text-blue-300 font-black text-sm">{c.recommended as string}</div>
          <div className="text-xs text-text-muted mt-0.5">{c.meta as string}</div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{c.reason as string}</p>
      </div>
    );
  }

  if (section.id === 'funnel') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-semibold">
            {c.stage as string}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-border-color text-text-secondary text-xs">
            {c.split as string}
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{c.approach as string}</p>
      </div>
    );
  }

  if (section.id === 'budget') {
    const split = c.split as Record<string, string>;
    return (
      <div className="space-y-4">
        <div className="text-3xl font-black gradient-text">{c.daily as string}</div>
        <div className="flex gap-3">
          {Object.entries(split).map(([k, v]) => (
            <div key={k} className="flex-1 bg-bg-dark rounded-xl p-3 border border-border-color text-center">
              <div className="text-lg font-bold text-white">{v}</div>
              <div className="text-xs text-text-muted">{k}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted">{c.scaling as string}</p>
      </div>
    );
  }

  if (section.id === 'targeting') {
    const interests = c.interests as string[];
    return (
      <div className="space-y-3">
        <div className="text-sm font-semibold text-white">{c.demo as string}</div>
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
              {i}
            </span>
          ))}
        </div>
        <div className="text-xs text-text-muted border-t border-border-color pt-3">{c.exclusions as string}</div>
      </div>
    );
  }

  if (section.id === 'angles') {
    const angles = c.angles as Array<{ type: string; text: string }>;
    return (
      <div className="space-y-2">
        {angles.map((a) => (
          <div key={a.type} className="flex items-start gap-3 p-3 rounded-xl bg-bg-dark border border-border-color">
            <span className="text-xs font-semibold text-pink-400 mt-0.5 shrink-0 w-24">{a.type}</span>
            <span className="text-sm text-text-secondary">{a.text}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.id === 'copy') {
    return (
      <div className="p-5 rounded-xl bg-bg-dark border border-border-color space-y-3">
        <div className="text-base font-bold text-white">{c.headline as string}</div>
        <p className="text-sm text-text-muted">{c.subheadline as string}</p>
        <div className="inline-block px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/25 text-green-300 text-xs font-semibold">
          CTA: {c.cta as string}
        </div>
      </div>
    );
  }

  if (section.id === 'checklist') {
    const items = c.items as string[];
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-sm bg-emerald-500/60" />
            </div>
            <span className="text-sm text-text-secondary">{item}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
