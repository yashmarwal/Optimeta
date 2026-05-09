'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const testimonials = [
  {
    name: 'Priya Mehta',
    role: 'Founder, Aura Skincare',
    avatar: 'P',
    quote: 'Optimeta replaced our ₹40,000/month agency. The blueprint it generates is more detailed than what our agency gave us after 2 weeks. ROAS went from 1.4x to 3.8x in the first month.',
    result: '3.8x ROAS',
  },
  {
    name: 'Rohan Sharma',
    role: 'Performance Marketer, GrowFast Agency',
    avatar: 'R',
    quote: 'I use Optimeta for all client onboarding now. In 15 seconds I have a complete campaign architecture that I can present to clients. My team of 3 now handles 2x the clients.',
    result: '2x client capacity',
  },
  {
    name: 'Ananya Patel',
    role: 'D2C Founder, FitBite India',
    avatar: 'A',
    quote: 'The audience targeting section alone is worth ₹499/month. It identified segments we never thought of — and our cost per purchase dropped by 42% in just 3 weeks.',
    result: '42% lower CPA',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Indian Brands<br />
            <span className="gradient-text">Love Optimeta</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.12}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card p-8 gradient-border transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border-color">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">
                    {t.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold gradient-text">{t.result}</div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
