'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Optimeta?',
    a: 'Optimeta is an AI-powered Meta Ad Campaign Architect built specifically for Indian brands. You answer 12 questions about your business, and Optimeta generates a complete, ready-to-launch Facebook & Instagram campaign blueprint — including audience targeting, budget strategy, ad copies, creative direction, and a launch checklist.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'ChatGPT is a general-purpose AI with no specialization in Meta ads or Indian markets. Optimeta is trained specifically on Meta advertising strategy, Indian audience behavior, INR-based economics, and D2C/SaaS/coaching business models. The structured JSON output is ready to implement — not generic advice you need to decipher.',
  },
  {
    q: 'Do I need Meta ads experience?',
    a: 'No. Optimeta is designed to work for complete beginners and experienced marketers alike. Beginners get a step-by-step blueprint they can follow directly. Experienced marketers save hours on campaign architecture and use the output as a starting framework they can refine.',
  },
  {
    q: 'What types of businesses is this for?',
    a: 'Optimeta works best for Indian D2C product brands, SaaS companies, coaching businesses, local service providers, dropshipping stores, and digital agencies. If you sell something and want to advertise on Facebook or Instagram, Optimeta will help.',
  },
  {
    q: 'How many campaigns can I generate?',
    a: 'Free plan: 1 campaign lifetime. Pro (₹499/month): 15 campaigns per billing cycle. Ultra (₹999/month): 50 campaigns per billing cycle. Billing cycles reset monthly from your subscription date.',
  },
  {
    q: 'Can I export the blueprint as a PDF?',
    a: 'Yes — PDF export is available on Pro and Ultra plans. The exported PDF is beautifully formatted with all sections: campaign strategy, targeting details, ad copies, creative direction, and the launch checklist. You can share it with clients, team members, or freelance ad managers.',
  },
  {
    q: 'Is my business data safe?',
    a: 'Yes. All data is encrypted in transit (HTTPS) and at rest in our Supabase database with row-level security. Your business inputs and generated blueprints are private and only accessible by your account. We do not share your data with third parties.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel anytime from your dashboard settings. Your access continues until the end of your current billing period. No questions asked, no cancellation fees. We\'re confident Optimeta will pay for itself many times over.',
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border-color rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-primary/5 transition-colors"
      >
        <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-text-secondary flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border-color pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Frequently Asked<br />
            <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
