import type { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import StatsBar from '@/components/landing/StatsBar';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import BlueprintPreview from '@/components/landing/BlueprintPreview';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/landing/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { StickyStackCards } from '@/components/landing/StickyStackCards';

export const metadata: Metadata = {
  title: 'Optimeta — AI Meta Ad Campaign Architect for Indian Brands',
  description:
    'Stop wasting money on random Meta ads. Optimeta transforms your business into a complete Facebook & Instagram campaign blueprint in minutes. Built for Indian D2C brands, SaaS, coaches & agencies.',
  alternates: {
    canonical: 'https://optimeta.tech',
  },
  openGraph: {
    url: 'https://optimeta.tech',
    title: 'Optimeta — AI Meta Ad Campaign Architect for Indian Brands',
    description:
      'Stop wasting money on random Meta ads. Generate your complete Meta ad campaign blueprint in minutes.',
    siteName: 'Optimeta',
    locale: 'en_IN',
    type: 'website',
  },
};

const problemCards = [
  {
    icon: '💸',
    title: 'Burning Budget on Gut Feelings',
    description:
      "Most Indian brands run Meta ads without a strategy — targeting random audiences, using copied creatives, and wondering why ROAS is below 1x. Every day of guessing is money down the drain.",
  },
  {
    icon: '🏢',
    title: 'Agencies Charge ₹50k+ for Basic Blueprints',
    description:
      "Marketing agencies create the same templated campaign plans and charge astronomical fees. Smaller D2C brands and bootstrapped founders simply can't compete — until now.",
  },
  {
    icon: '⚠️',
    title: "Generic AI Tools Don't Understand India",
    description:
      "ChatGPT doesn't know Indian audience behavior, INR economics, or India-specific funnel dynamics. You get generic US-focused advice that'll never work for your Tier 2 customer.",
  },
];

const featureCards = [
  {
    icon: '🧠',
    title: 'AI Campaign Architecture',
    description:
      'Claude Sonnet analyzes your business and constructs a full-funnel campaign structure with TOFU/MOFU/BOFU strategy.',
  },
  {
    icon: '🎯',
    title: 'Audience Targeting Clusters',
    description:
      'Get 10 hyper-specific interests, behavioral targeting, lookalike strategies, and exclusion lists — all India-optimized.',
  },
  {
    icon: '💰',
    title: 'Budget Split Logic',
    description:
      'Data-driven daily budget recommendation with awareness/consideration/conversion percentage splits and scaling logic.',
  },
  {
    icon: '✍️',
    title: 'Performance Ad Copy',
    description:
      '3 complete ad copies with primary text, headline, sub-headline, and CTA — written for Feed, Story, and Reels placement.',
  },
  {
    icon: '🎨',
    title: 'Creative Direction',
    description:
      "Visual style guide, color palette, content formats, 3 scroll-stopping hooks, and a DO/DON'T creative checklist.",
  },
  {
    icon: '📄',
    title: 'Blueprint Export (PDF)',
    description:
      'Export your complete campaign blueprint as a beautifully formatted PDF. Share with your team or freelancer.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsBar />

      {/* MOBILE — Sticky Stack */}
      <div className="md:hidden">
        <StickyStackCards
          titleLine1="Why Most Meta Ads"
          titleLine2="Fail in India"
          sectionTitle="The Problem"
          sectionSubtitle="The Indian market demands a different approach."
          cards={problemCards}
        />
      </div>
      {/* DESKTOP — Original layout */}
      <div className="hidden md:block">
        <ProblemSection />
      </div>

      <HowItWorks />

      {/* MOBILE — Sticky Stack */}
      <div className="md:hidden">
        <StickyStackCards
          titleLine1="Everything You Need to"
          titleLine2="Win on Meta"
          sectionSubtitle="Optimeta generates what a senior marketer would take 3 days to build — in 15 seconds."
          cards={featureCards}
        />
      </div>
      {/* DESKTOP — Original layout */}
      <div className="hidden md:block">
        <FeaturesGrid />
      </div>

      <BlueprintPreview />
      <PricingSection />
      <Testimonials />
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
              'AI-powered Meta ad campaign architect that generates complete Facebook and Instagram campaign blueprints for Indian brands.',
            url: 'https://optimeta.tech',
            offers: [
              {
                '@type': 'Offer',
                name: 'Free Plan',
                price: '0',
                priceCurrency: 'INR',
                description: '1 campaign blueprint lifetime',
              },
              {
                '@type': 'Offer',
                name: 'Pro Plan',
                price: '499',
                priceCurrency: 'INR',
                description: '5 campaign blueprints per month',
              },
              {
                '@type': 'Offer',
                name: 'Ultra Plan',
                price: '999',
                priceCurrency: 'INR',
                description: '10 campaign blueprints per month',
              },
            ],
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
                  text: 'Optimeta is an AI-powered Meta ad campaign architect that transforms your business information into a complete Facebook and Instagram campaign blueprint including targeting, budget strategy, ad copies, creative direction and launch checklist in minutes.',
                },
              },
              {
                '@type': 'Question',
                name: 'How is Optimeta different from ChatGPT?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Unlike ChatGPT which gives generic advice, Optimeta generates structured campaign blueprints with India-specific targeting, INR budget logic, COD strategy, pixel recommendations and a step-by-step launch checklist tailored to your exact business.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much does Optimeta cost?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Optimeta offers a free plan with 1 campaign blueprint lifetime. Pro plan is ₹499 per month for 5 campaigns. Ultra plan is ₹999 per month for 10 campaigns.',
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
                  text: 'No. Optimeta is designed for complete beginners. You answer simple questions about your business and Optimeta generates a ready-to-implement campaign blueprint with step-by-step instructions.',
                },
              },
              {
                '@type': 'Question',
                name: 'What does an Optimeta campaign blueprint include?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Each blueprint includes campaign objective, funnel strategy, budget split, audience targeting with interests and behaviors, ad sets, ad angles, 3 complete ad copies, creative direction, UGC brief, pixel recommendations, 8-step launch checklist, first 7 days action plan and performance benchmarks.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I cancel my Optimeta subscription?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. You can cancel anytime from your dashboard settings. You keep access until the end of your current billing period. Your campaigns remain saved in read-only mode.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is Optimeta only for Meta ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Optimeta focuses exclusively on Meta ads — Facebook and Instagram — for the Indian market. This specialization means deeper expertise than tools that try to cover every platform.',
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
