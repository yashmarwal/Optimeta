'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const previewLines = [
  { label: 'Campaign Name', value: '"Nourish Organics — Skin Ritual Launch Campaign"', delay: 0 },
  { label: 'Executive Summary', value: '"Target health-conscious urban women aged 25-38 across Tier 1 metros with a full-funnel strategy leveraging Instagram Reels and Feed placements..."', delay: 400 },
  { label: 'Recommended Objective', value: '"Conversions → Purchase (Advantage+ Shopping)"', delay: 800 },
  { label: 'Daily Budget', value: '"₹2,000/day — Scale 20% every 3 days if ROAS > 3x"', delay: 1200 },
  { label: 'Primary Audience', value: '"Women 24-38 | Mumbai, Delhi, Bangalore, Pune | Interests: Organic skincare, Ayurveda, Clean beauty..."', delay: 1600 },
  { label: 'Ad Angle #1', value: '"Pain Point — Tired of harsh chemicals ruining your skin? Switch to what nature intended."', delay: 2000 },
  { label: 'Ad Copy Headline', value: '"Your skin deserves better than chemicals. Try Nourish."', delay: 2400 },
];

function TypewriterText({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

export default function BlueprintPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
            Watch your complete campaign blueprint stream in — in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card overflow-hidden glow"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border-color bg-bg-dark/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-text-muted ml-2">optimeta — blueprint generation</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">Generating...</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 font-mono text-sm">
            {previewLines.map((line, i) => (
              <motion.div
                key={line.label}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.15 + 0.3 }}
              >
                <div className="text-text-muted text-xs mb-1">// {line.label}</div>
                <div className="text-accent/70 text-xs">
                  {inView ? (
                    <TypewriterText text={line.value} speed={12} />
                  ) : null}
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 3.5 }}
              className="pt-2 flex items-center gap-3"
            >
              <div className="h-px flex-1 bg-border-color" />
              <span className="text-xs text-primary font-semibold">+ 200 more lines in your blueprint</span>
              <div className="h-px flex-1 bg-border-color" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
