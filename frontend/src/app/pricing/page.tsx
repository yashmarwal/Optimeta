import type { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Pricing — Optimeta Meta Ads Planner',
  description: 'Start free or upgrade to Pro at ₹499/month. Get your complete Meta ad campaign blueprint for Indian D2C brands in 15 seconds. No agencies, no long waits.',
  alternates: {
    canonical: 'https://optimeta.tech/pricing',
  },
  openGraph: {
    url: 'https://optimeta.tech/pricing',
    title: 'Pricing — Optimeta',
    description: 'Start free. Upgrade for ₹499/month.',
    siteName: 'Optimeta',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://optimeta.tech/logo.png',
        width: 512,
        height: 512,
        alt: 'Optimeta Pricing — Meta Ads Plans for Indian Brands',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const COMPARISON = [
  { feature: 'Campaign Blueprints', free: '1 lifetime', pro: '5 / month', ultra: '10 / month' },
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
        <div className="text-center pt-8 pb-2 px-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Optimeta Pricing —{' '}
            <span className="gradient-text">Meta Ads Plans for Indian Brands</span>
          </h1>
        </div>
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
