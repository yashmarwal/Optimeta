'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Cpu, Rocket } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Answer 12 Questions',
    desc: 'Tell us about your business, product, target audience, budget, and goals. Our structured wizard takes under 5 minutes to complete.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Optimeta Architects Your Campaign',
    desc: 'Our AI — trained on Indian market data — generates your complete campaign blueprint: audiences, budgets, ad copies, creatives, and launch checklist.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Launch With Confidence',
    desc: 'Get a ready-to-implement blueprint. Copy ad text, follow the checklist, set your targeting — and launch. No agency. No guesswork.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            From Business to Blueprint<br />
            <span className="gradient-text">in 3 Steps</span>
          </h2>
        </ScrollReveal>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[calc(16.67%-24px)] right-[calc(16.67%-24px)] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <ol className="sr-only">
            {steps.map((step) => (
              <li key={step.number}>
                {step.title}: {step.desc}
              </li>
            ))}
          </ol>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow"
                    >
                      <step.icon size={26} className="text-white" />
                    </motion.div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-bg-dark border border-primary/40 flex items-center justify-center">
                      <span className="text-xs font-black gradient-text">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
