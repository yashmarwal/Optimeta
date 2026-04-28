import type { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Pricing — Optimeta',
  description: 'Start free and scale as you grow. Optimeta offers simple, transparent pricing for Indian brands and agencies running Meta ads.',
  alternates: { canonical: 'https://optimeta.in/pricing' },
};

const COMPARISON = [
  { feature: 'Campaign Blueprints', free: '1 lifetime', pro: '10 / month', ultra: '30 / month' },
  { feature: 'AI-Generated Strategy', free: '✓', pro: '✓', ultra: '✓' },
  { feature: 'Audience Targeting Clusters', free: '✓', pro: '✓', ultra: '✓' },
  { feature: 'Ad Copy Generation', free: '✓', pro: '✓', ultra: '✓' },
  { feature: 'Launch Checklist', free: '✓', pro: '✓', ultra: '✓' },
  { feature: 'PDF Export', free: '—', pro: '✓', ultra: '✓' },
  { feature: 'Campaign History', free: '—', pro: '✓', ultra: '✓' },
  { feature: 'Priority Support', free: '—', pro: '✓', ultra: '✓' },
  { feature: 'Advanced Targeting Insights', free: '—', pro: '—', ultra: '✓' },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid">
      <Navbar />
      <div className="pt-24">
        <PricingSection />

        {/* Comparison table */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-white text-center mb-8">Full Plan Comparison</h2>
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left p-5 text-sm font-semibold text-text-secondary">Feature</th>
                    <th className="text-center p-5 text-sm font-semibold text-text-secondary">Free</th>
                    <th className="text-center p-5 text-sm font-bold text-white bg-primary/10">Pro</th>
                    <th className="text-center p-5 text-sm font-semibold text-text-secondary">Ultra</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-border-color last:border-0 ${i % 2 === 0 ? 'bg-white/1' : ''}`}>
                      <td className="p-5 text-sm text-text-secondary">{row.feature}</td>
                      <td className="p-5 text-sm text-center text-text-muted">{row.free}</td>
                      <td className="p-5 text-sm text-center font-semibold text-white bg-primary/5">{row.pro}</td>
                      <td className="p-5 text-sm text-center text-text-muted">{row.ultra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <FAQSection />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
