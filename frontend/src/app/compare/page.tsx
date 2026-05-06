import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Optimeta vs ChatGPT vs Agency — Best Meta Ads Tool for Indian Brands',
  description:
    'Compare Optimeta with ChatGPT and marketing agencies for Meta ad campaign planning. See why Indian brands choose Optimeta.',
  alternates: {
    canonical: 'https://optimeta.tech/compare',
  },
  openGraph: {
    url: 'https://optimeta.tech/compare',
    title: 'Optimeta vs ChatGPT vs Agency — Best Meta Ads Tool for Indian Brands',
    description:
      'Compare Optimeta with ChatGPT and marketing agencies for Meta ad campaign planning.',
    siteName: 'Optimeta',
    locale: 'en_IN',
    type: 'website',
  },
};

const rows = [
  { feature: 'India-specific strategy', optimeta: '✅ Yes', chatgpt: '❌ No', agency: '✅ Yes' },
  { feature: 'INR budget logic', optimeta: '✅ Yes', chatgpt: '❌ No', agency: '✅ Yes' },
  { feature: 'COD strategy', optimeta: '✅ Yes', chatgpt: '❌ No', agency: '✅ Yes' },
  { feature: 'Complete ad copies', optimeta: '✅ Yes', chatgpt: '⚠️ Generic', agency: '✅ Yes' },
  { feature: 'Targeting interests', optimeta: '✅ 10 specific', chatgpt: '⚠️ Generic', agency: '✅ Yes' },
  { feature: 'Launch checklist', optimeta: '✅ Yes', chatgpt: '❌ No', agency: '✅ Yes' },
  { feature: 'First 7 days plan', optimeta: '✅ Yes', chatgpt: '❌ No', agency: '✅ Yes' },
  { feature: 'PDF export', optimeta: '✅ Yes', chatgpt: '❌ No', agency: '✅ Yes' },
  { feature: 'Monthly cost', optimeta: '✅ ₹499', chatgpt: '✅ Free/₹1,700', agency: '❌ ₹50,000+' },
  { feature: 'Time to get blueprint', optimeta: '✅ 15 seconds', chatgpt: '⚠️ 30 minutes', agency: '❌ 1-2 weeks' },
  { feature: 'Beginner friendly', optimeta: '✅ Yes', chatgpt: '❌ Needs expertise', agency: '❌ Needs briefing' },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

        {/* Answer-first opening */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Comparison
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Optimeta vs ChatGPT vs Agency:<br />
            <span className="gradient-text">Which is Best for Meta Ads in India?</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            For Indian brands running Meta ads, Optimeta generates complete campaign blueprints in
            minutes at ₹499/month. ChatGPT gives generic advice without India-specific strategy.
            Agencies charge ₹50,000+ per month for similar work. Here is the complete comparison.
          </p>
        </div>

        {/* Comparison table */}
        <div className="glass-card overflow-x-auto mb-20">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left p-5 text-sm font-semibold text-text-secondary">Feature</th>
                <th className="text-center p-5 text-sm font-bold text-white bg-primary/10">Optimeta</th>
                <th className="text-center p-5 text-sm font-semibold text-text-secondary">ChatGPT</th>
                <th className="text-center p-5 text-sm font-semibold text-text-secondary">Agency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-border-color last:border-0 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                >
                  <td className="p-5 text-sm text-text-secondary font-medium">{row.feature}</td>
                  <td className="p-5 text-sm text-center font-semibold text-white bg-primary/5">{row.optimeta}</td>
                  <td className="p-5 text-sm text-center text-text-muted">{row.chatgpt}</td>
                  <td className="p-5 text-sm text-center text-text-muted">{row.agency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Why ChatGPT doesn't work */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white mb-6">
            Why ChatGPT Doesn&apos;t Work for Indian Meta Ads
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Doesn't know Indian audience behavior",
              'No INR budget logic — gives USD-based advice',
              'No COD (Cash on Delivery) strategy',
              'Generic US-focused advice that fails in India',
              'No structured blueprint format — just text',
              'No India 2026 CPM, CTR, or ROAS benchmarks',
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 glass-card p-4">
                <span className="text-red-400 font-bold flex-shrink-0">✗</span>
                <p className="text-text-secondary text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why agencies are too expensive */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white mb-6">
            Why Agencies Are Too Expensive for Most Indian Brands
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Minimum ₹25,000–50,000 per month just for management',
              '1–2 weeks to get your first campaign plan',
              'Same templated strategies for every brand',
              'No transparency in targeting decisions',
              'You depend on them forever — no knowledge transfer',
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 glass-card p-4">
                <span className="text-red-400 font-bold flex-shrink-0">✗</span>
                <p className="text-text-secondary text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Optimeta works */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white mb-6">
            Why <span className="gradient-text">Optimeta Works for India</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Built specifically for the Indian market',
              'All budgets in INR with realistic daily amounts',
              'COD strategy included for D2C brands',
              'Tier 1, Tier 2, Tier 3 city targeting logic',
              'India 2026 CPM, CTR, and ROAS benchmarks built in',
              'Complete blueprint ready in 15 seconds',
              'Free plan to start — no card required',
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 glass-card p-4">
                <span className="text-accent font-bold flex-shrink-0">✓</span>
                <p className="text-text-secondary text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card gradient-border p-10 text-center rounded-2xl">
          <h3 className="text-2xl font-black text-white mb-3">
            Generate Your Free Campaign Blueprint
          </h3>
          <p className="text-text-muted mb-8 max-w-lg mx-auto">
            Stop wasting money on random Meta ads. Get your complete India-specific campaign
            blueprint in 15 seconds — free to start.
          </p>
          <Link href="/register">
            <button className="btn-gradient px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2">
              Start for Free
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
