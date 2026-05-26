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
    images: [
      {
        url: 'https://optimeta.tech/logo.png',
        width: 512,
        height: 512,
        alt: 'Optimeta — AI Meta Ad Campaign Architect',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid overflow-x-hidden">
      <h1 className="sr-only">Optimeta — AI Meta Ad Campaign Architect for Indian Brands</h1>

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

      {/* Execution Mode feature highlight */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">

        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-[#7B2FBE]/20 border border-[#7B2FBE]/40 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C026D3] animate-pulse" />
            New Feature
          </span>
        </div>

        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Don&apos;t Just Get a Blueprint.{' '}
            <span className="bg-gradient-to-r from-[#7B2FBE] to-[#C026D3] bg-clip-text text-transparent">
              Execute It.
            </span>
          </h2>
          <p className="text-[#A0A0C0] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Most brands get a strategy and have no idea what to do next. Optimeta&apos;s Execution Mode holds your hand through every single step — from opening Ads Manager to your campaign going live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* LEFT — Text content */}
          <div className="flex flex-col gap-6">
            {[
              {
                icon: '🎯',
                title: 'Step-by-step guidance',
                desc: 'Every step tells you exactly what to click, what value to enter and why. No guessing. No googling.',
              },
              {
                icon: '⚡',
                title: 'Pre-filled with your blueprint',
                desc: 'Your exact budget, targeting interests, ad copy and objective are already filled in. Just follow and implement.',
              },
              {
                icon: '✅',
                title: 'Progress saved automatically',
                desc: 'Tick off steps as you complete them. Come back later and pick up exactly where you left off.',
              },
              {
                icon: '📱',
                title: '18 steps across 6 phases',
                desc: 'Setup → Campaign → Audience → Creative → Review → Monitor. The real Meta ads workflow, in order.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(192,38,211,0.2))',
                    border: '1px solid rgba(123,47,190,0.3)',
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-[#A0A0C0] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            <a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm w-fit mt-2 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7B2FBE, #C026D3)',
                boxShadow: '0 8px 24px rgba(192,38,211,0.3)',
              }}
            >
              Try Execution Mode Free
              <span>→</span>
            </a>
          </div>

          {/* RIGHT — Visual mockup */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(123,47,190,0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            <div
              className="relative rounded-2xl border border-[#1E1E3A] overflow-hidden"
              style={{
                background: '#0F0F1A',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(123,47,190,0.15)',
              }}
            >
              {/* Mockup header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E3A]"
                style={{ background: 'linear-gradient(135deg, rgba(123,47,190,0.1), rgba(192,38,211,0.05))' }}
              >
                <span className="text-white font-bold text-sm">🚀 Execution Mode</span>
                <div className="flex items-center gap-2 text-xs text-[#606080]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  8/18 steps done
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-4 py-3 border-b border-[#1E1E3A]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#A0A0C0] text-xs">Campaign Setup Progress</span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #7B2FBE, #C026D3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    44%
                  </span>
                </div>
                <div className="h-1.5 bg-[#1E1E3A] rounded-full overflow-hidden">
                  <div
                    className="h-full w-[44%] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #7B2FBE, #C026D3)',
                      boxShadow: '0 0 8px rgba(192,38,211,0.5)',
                    }}
                  />
                </div>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {[
                    { name: 'Setup', done: true },
                    { name: 'Campaign', done: true },
                    { name: 'Audience', active: true },
                    { name: 'Creative', done: false },
                    { name: 'Review', done: false },
                    { name: 'Monitor', done: false },
                  ].map((phase, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-1 rounded-full border"
                      style={{
                        background: phase.done ? 'rgba(34,197,94,0.15)' : phase.active ? 'rgba(123,47,190,0.2)' : 'transparent',
                        borderColor: phase.done ? 'rgba(34,197,94,0.3)' : phase.active ? 'rgba(123,47,190,0.5)' : '#1E1E3A',
                        color: phase.done ? '#22c55e' : phase.active ? '#C026D3' : '#606080',
                      }}
                    >
                      {phase.done ? '✓ ' : ''}{phase.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step items */}
              <div className="p-4 flex flex-col gap-2">
                {[
                  { num: 7, title: 'Set Audience Targeting', value: 'Age 25-44 • Women • Delhi, Mumbai, Bangalore', done: true },
                  { num: 8, title: 'Add Interest Targeting', value: 'Nykaa, Myntra, Mamaearth, Engaged Shoppers...', active: true },
                  { num: 9, title: 'Add Behavioral Targeting', value: 'Engaged Shoppers • Online Shoppers India', done: false },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border"
                    style={{
                      background: step.active ? 'rgba(123,47,190,0.08)' : step.done ? 'rgba(34,197,94,0.05)' : '#0A0A0F',
                      borderColor: step.active ? 'rgba(123,47,190,0.4)' : step.done ? 'rgba(34,197,94,0.2)' : '#1E1E3A',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{
                        background: step.done ? 'rgba(34,197,94,0.2)' : step.active ? 'rgba(123,47,190,0.2)' : '#1E1E3A',
                        color: step.done ? '#22c55e' : step.active ? '#C026D3' : '#606080',
                      }}
                    >
                      {step.done ? '✓' : step.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold mb-0.5"
                        style={{
                          color: step.done ? '#22c55e' : '#ffffff',
                          textDecoration: step.done ? 'line-through' : 'none',
                          textDecorationColor: 'rgba(34,197,94,0.4)',
                        }}
                      >
                        {step.title}
                      </p>
                      <p className="text-[#606080] text-[11px] truncate">{step.value}</p>
                    </div>
                  </div>
                ))}

                <div
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white mt-1"
                  style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)' }}
                >
                  ✓ Mark as Done
                </div>
              </div>

              <div className="px-4 pb-3 text-center">
                <p className="text-[#404060] text-[10px]">
                  Progress saved automatically • Pick up where you left off
                </p>
              </div>
            </div>

            <div
              className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white border border-[#C026D3]/40 hidden md:block"
              style={{
                background: 'linear-gradient(135deg, #7B2FBE, #C026D3)',
                boxShadow: '0 4px 16px rgba(192,38,211,0.4)',
              }}
            >
              18 guided steps
            </div>
          </div>

        </div>
      </section>

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
            '@type': 'WebSite',
            name: 'Optimeta',
            url: 'https://optimeta.tech',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://optimeta.tech/blog?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Optimeta — AI Meta Ad Architect',
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['.hero-description', '.executive-summary', 'h1', 'h2'],
            },
            url: 'https://optimeta.tech',
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Generate a Meta Ad Campaign Blueprint with Optimeta',
            description:
              'Generate a complete Facebook and Instagram campaign blueprint in minutes using Optimeta AI.',
            totalTime: 'PT15M',
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Enter Business Details',
                text: 'Answer questions about your business name, industry, monthly ad budget and product details.',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Describe Your Audience',
                text: 'Tell Optimeta about your ideal customer, campaign goal, target cities and gender targeting.',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'Add Context',
                text: 'Share your competitors, available creative assets, Meta pixel status and previous ad experience.',
              },
              {
                '@type': 'HowToStep',
                position: 4,
                name: 'Generate Blueprint',
                text: 'Click Generate and receive your complete Meta ad campaign blueprint in 15-20 seconds.',
              },
              {
                '@type': 'HowToStep',
                position: 5,
                name: 'Launch Your Campaign',
                text: 'Follow the 8-step launch checklist to implement your blueprint in Meta Ads Manager.',
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
            datePublished: '2026-01-01',
            dateModified: '2026-05-07',
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
              'https://optimeta.tech',
              'https://twitter.com/optimeta',
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
