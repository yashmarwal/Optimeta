'use client';

import { motion } from 'framer-motion';
import { Brain, Target, PieChart, MessageSquare, Palette, FileDown } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const features = [
  {
    icon: Brain,
    title: 'AI Campaign Architecture',
    desc: 'Our Advanced AI analyzes your business inputs and constructs a complete campaign structure with full funnel strategy — tailored to your exact budget, goals and Indian market.',
  },
  {
    icon: Target,
    title: 'Audience Targeting Clusters',
    desc: 'Get 8-10 hyper-specific interests, behavioral targeting, lookalike strategies, and exclusion lists — all India-optimized.',
  },
  {
    icon: PieChart,
    title: 'Budget Split Logic',
    desc: 'Data-driven daily budget recommendation with awareness/consideration/conversion percentage splits and scaling logic.',
  },
  {
    icon: MessageSquare,
    title: 'Performance Ad Copy',
    desc: '3 complete ad copies with primary text, headline, sub-headline, and CTA — written specifically for Feed, Reel and Story placement.',
  },
  {
    icon: Palette,
    title: 'Creative Direction',
    desc: "Visual style guide, color palette, content formats, 5 scroll-stopping hooks, and a DO/DON'T creative checklist.",
  },
  {
    icon: FileDown,
    title: 'Blueprint Export (PDF)',
    desc: 'Export your complete campaign blueprint as a beautifully formatted PDF. Share with your team or freelancer.',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Everything You Need to<br />
            <span className="gradient-text">Win on Meta</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Optimeta generates what a senior performance marketer would take 3 days to build — in 15 seconds.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card p-7 gradient-border group transition-all duration-300 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center mb-5 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <f.icon size={22} className="text-accent" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
