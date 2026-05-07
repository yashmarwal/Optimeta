import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'About Optimeta — AI Meta Ads Tool for India',
  description:
    'Optimeta is built for Indian brands tired of wasting money on random Meta ads. Learn about our mission to make expert-level campaign strategy accessible to every Indian brand.',
  alternates: {
    canonical: 'https://optimeta.tech/about',
  },
  openGraph: {
    url: 'https://optimeta.tech/about',
    title: 'About Optimeta — AI Meta Ads Tool for India',
    description:
      'Learn about our mission to make expert-level Meta ad campaign strategy accessible to every Indian brand.',
    siteName: 'Optimeta',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://optimeta.tech/logo.png',
        width: 512,
        height: 512,
        alt: 'Optimeta',
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">About Optimeta</h1>
        <div className="section-divider mb-10" />

        <section className="mb-12">
          <h2 className="text-2xl font-black gradient-text mb-4">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Most Indian brands run Meta ads without strategy — burning budgets on gut feelings and
            random targeting. Marketing agencies charge ₹50,000+ per month for campaign plans that
            take weeks. We built Optimeta to change that.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Optimeta generates complete, performance-focused Meta ad campaign blueprints in minutes
            — built specifically for the Indian market with INR budgets, COD strategy, and India
            2026 benchmarks built in.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black gradient-text mb-4">What We Build</h2>
          <p className="text-text-secondary leading-relaxed">
            Optimeta is an AI-powered Meta ad campaign architect. Not a generic AI chatbot. A
            specialized system that transforms your business inputs into a complete, ready-to-launch
            Facebook and Instagram campaign — targeting, budget, ad copies, creative direction, and
            launch checklist included.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black gradient-text mb-4">Who We Serve</h2>
          <ul className="space-y-2">
            {[
              'D2C Physical Product brands',
              'Fashion and Apparel brands',
              'Beauty and Skincare brands',
              'SaaS founders',
              'Coaches and consultants',
              'Local service businesses',
              'Marketing agencies',
              'Dropshippers',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black gradient-text mb-4">Built for India</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Every campaign blueprint Optimeta generates is India-first:
          </p>
          <ul className="space-y-2">
            {[
              'All budgets in INR',
              'COD strategy included for D2C brands',
              'Tier 1, 2 and 3 city targeting',
              'Indian audience behavior patterns',
              'India 2026 Meta ads benchmarks',
              'Tested across 200+ Indian campaigns',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-text-secondary">
                <span className="text-accent font-bold flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black gradient-text mb-4">Contact</h2>
          <p className="text-text-secondary leading-relaxed">
            Questions or feedback? Email us at{' '}
            <a
              href="mailto:optimeta@outlook.com"
              className="text-accent hover:text-primary transition-colors"
            >
              optimeta@outlook.com
            </a>
            . We respond within 24 hours.
          </p>
        </section>

        <div className="glass-card gradient-border p-10 text-center rounded-2xl">
          <h3 className="text-2xl font-black text-white mb-3">Generate Your Free Campaign</h3>
          <p className="text-text-muted mb-8">
            Create your complete Meta ad campaign blueprint in 15 seconds. Free to start.
          </p>
          <Link href="/register">
            <button className="btn-gradient px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2">
              Get Started Free
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Optimeta',
            description:
              "Optimeta is India's AI-powered Meta ad campaign architect for D2C brands, SaaS founders, coaches and agencies.",
            url: 'https://optimeta.tech/about',
            mainEntity: {
              '@type': 'Organization',
              name: 'Optimeta',
              url: 'https://optimeta.tech',
              email: 'optimeta@outlook.com',
              description: 'AI-powered Meta ad campaign architect for Indian brands',
              sameAs: [
                'https://www.instagram.com/optimeta.tech',
                'https://www.linkedin.com/company/optimeta-ai-meta-ads-generator/',
              ],
            },
          }),
        }}
      />
    </main>
  );
}
