import type { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import StatsBar from '@/components/landing/StatsBar';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import BlueprintPreview from '@/components/landing/BlueprintPreview';
import PricingSection from '@/components/landing/PricingSection';
import { ReviewsMarquee } from '@/components/landing/ReviewsMarquee';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

export const metadata: Metadata = {
  title: 'Optimeta — AI Meta Ad Architect for India',
  description:
    'Stop wasting money on Meta ads. Optimeta generates your complete Facebook and Instagram campaign blueprint in minutes. Free to start, no agency needed.',
  alternates: {
    canonical: 'https://optimeta.tech',
  },
  openGraph: {
    url: 'https://optimeta.tech',
    title: 'Optimeta — AI Meta Ad Architect for India',
    description:
      'Stop wasting money on random Meta ads. Generate your complete Meta ad campaign blueprint in minutes.',
    siteName: 'Optimeta',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid overflow-x-hidden">
      <div className="sr-only">
        Optimeta is India&apos;s AI-powered Meta ad campaign architect. It generates complete
        Facebook and Instagram campaign blueprints for Indian D2C brands, SaaS founders, coaches
        and agencies. Each blueprint includes campaign objective, audience targeting with interests
        and behaviors, budget strategy in INR, 3 ad copies, creative direction, and 8-step launch
        checklist. Plans start free. Pro plan ₹499 per month. Ultra plan ₹999 per month. Visit
        optimeta.tech to generate your first campaign blueprint.
      </div>

      <Navbar />
      <Hero />
      <StatsBar />

      <ProblemSection />

      <HowItWorks />

      <FeaturesGrid />

      <BlueprintPreview />
      <ReviewsMarquee />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Optimeta',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'AI-powered Meta ad campaign architect for Indian brands. Generates complete Facebook and Instagram campaign blueprints including targeting, budget, ad copies and creative direction.',
            url: 'https://optimeta.tech',
            offers: [
              {
                '@type': 'Offer',
                name: 'Free',
                price: '0',
                priceCurrency: 'INR',
                description: '1 campaign lifetime',
              },
              {
                '@type': 'Offer',
                name: 'Pro',
                price: '499',
                priceCurrency: 'INR',
                description: '5 campaigns per month',
              },
              {
                '@type': 'Offer',
                name: 'Ultra',
                price: '999',
                priceCurrency: 'INR',
                description: '10 campaigns per month',
              },
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '200',
              bestRating: '5',
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Optimeta',
            url: 'https://optimeta.tech',
            logo: 'https://optimeta.tech/logo.png',
            description:
              "India's AI-powered Meta ad campaign architect for D2C brands, SaaS founders, coaches and agencies.",
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'optimeta@outlook.com',
              contactType: 'customer support',
            },
            sameAs: [
              'https://www.instagram.com/optimeta.tech',
              'https://www.linkedin.com/company/optimeta-ai-meta-ads-generator/',
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is Optimeta?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Optimeta is an AI-powered Meta ad campaign architect that transforms your business into a complete Facebook and Instagram campaign blueprint in minutes. It includes targeting, budget strategy, ad copies, creative direction and launch checklist — built specifically for Indian brands.',
                },
              },
              {
                '@type': 'Question',
                name: 'How is Optimeta different from ChatGPT for Meta ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Unlike ChatGPT which gives generic advice, Optimeta generates structured blueprints with India-specific targeting, INR budgets, COD strategy, pixel recommendations and step-by-step launch checklists tailored to your exact business and budget.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much does Optimeta cost?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Optimeta offers a free plan with 1 campaign blueprint lifetime. Pro plan is ₹499 per month for 5 campaigns. Ultra plan is ₹999 per month for 10 campaigns. No agency fees, no hidden costs.',
                },
              },
              {
                '@type': 'Question',
                name: 'Who is Optimeta for?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Optimeta is built for Indian D2C brands, SaaS founders, coaches, local service businesses, marketing freelancers and agencies who want to run profitable Meta ads without hiring an expensive agency.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I need Meta ads experience to use Optimeta?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No experience needed. You answer simple questions about your business and Optimeta generates a complete ready-to-implement campaign blueprint with a step-by-step 8-item launch checklist anyone can follow.',
                },
              },
              {
                '@type': 'Question',
                name: 'What does an Optimeta campaign blueprint include?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Each blueprint includes: campaign objective, funnel strategy, budget split with daily INR amounts, 10 specific audience interests, 6 behaviors, demographic filters, 2 targeting combinations, ad set structure, 4 ad angles, 3 complete ad copies for Feed/Reel/Story, creative direction, UGC brief, pixel recommendations, 8-step launch checklist, first 7 days plan and ROAS benchmarks.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the minimum Meta ads budget for Indian brands?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Minimum viable Meta ads budget for Indian brands is ₹500 per day per ad set to exit the learning phase. For monthly budgets: under ₹5,000 run 1 ad set only, ₹5,000-15,000 run 2 ad sets, ₹15,000-30,000 run a full funnel with 3 ad sets.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I cancel my Optimeta subscription anytime?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Cancel anytime from dashboard settings. You keep access until the end of your current billing period. Your campaigns remain saved.',
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
