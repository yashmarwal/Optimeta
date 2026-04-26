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

export const metadata: Metadata = {
  title: 'Optimeta — AI Meta Ad Campaign Architect for Indian Brands',
  description:
    'Stop wasting money on random Meta ads. Optimeta transforms your business into a complete, ready-to-launch Facebook & Instagram campaign blueprint in seconds. Built for Indian D2C, SaaS & agencies.',
  alternates: { canonical: 'https://optimeta.in' },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <BlueprintPreview />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
