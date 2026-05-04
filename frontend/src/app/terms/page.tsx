import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Optimeta',
  description: 'Terms and conditions for using Optimeta AI Meta Ad Campaign Architect.',
  alternates: {
    canonical: 'https://optimeta.tech/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-black text-white mb-2">Terms &amp; Conditions</h1>
        <p className="text-text-muted text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Introduction</h2>
            <p>
              These Terms and Conditions govern your use of Optimeta (optimeta.tech), an AI-powered Meta ad
              campaign architect platform operated by Optimeta. By accessing or using our service, you agree
              to these terms in full. If you disagree with any part, you must not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Services</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>Optimeta provides AI-generated Meta ad campaign blueprints tailored to your business inputs.</li>
              <li>Blueprints are provided for guidance and strategic direction only — not guaranteed outcomes.</li>
              <li>Results may vary significantly based on your implementation, ad creative quality, and market conditions.</li>
              <li>We do not guarantee specific ROAS, CPM, CPC, or any campaign performance metric.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Subscription &amp; Payments</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li><strong className="text-white">Free plan:</strong> 1 campaign blueprint, lifetime. No credit card required.</li>
              <li><strong className="text-white">Pro plan:</strong> ₹499/month — 5 campaign blueprints per billing cycle.</li>
              <li><strong className="text-white">Ultra plan:</strong> ₹999/month — 10 campaign blueprints per billing cycle.</li>
              <li>All payments are processed securely by Razorpay. Optimeta does not store card details.</li>
              <li>Subscriptions auto-renew monthly. You will be charged at the start of each billing cycle.</li>
              <li>Cancel anytime — your access continues until the end of the current billing period.</li>
              <li>Unused campaign credits do not carry over to the next billing cycle.</li>
              <li>No refunds are issued for campaigns already generated within the billing period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. User Responsibilities</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>You must provide accurate business information to receive useful campaign blueprints.</li>
              <li>You are solely responsible for how you implement and use the generated blueprints.</li>
              <li>You must not use Optimeta to generate campaigns for illegal, misleading, or prohibited advertising content.</li>
              <li>Each person is entitled to one free trial. Creating multiple accounts to abuse the free trial is strictly prohibited.</li>
              <li>We use device fingerprinting and IP tracking to detect and prevent free trial abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Intellectual Property</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>The Optimeta platform, AI system, and underlying technology are owned by Optimeta.</li>
              <li>Campaign blueprints generated using your business data belong to you.</li>
              <li>You may not resell, redistribute, or sublicense the Optimeta platform or its AI system.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Data &amp; Privacy</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>We collect business information you provide when generating campaigns.</li>
              <li>Campaign data is stored securely in Supabase with encrypted connections.</li>
              <li>We do not sell, rent, or trade your personal or business data to third parties.</li>
              <li>See our <Link href="/privacy" className="text-accent hover:text-primary transition-colors">Privacy Policy</Link> for complete details on data handling.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Limitation of Liability</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>Optimeta is not liable for any losses arising from your Meta ad spend based on our blueprints.</li>
              <li>We are not responsible for changes to Meta&apos;s advertising platform, policies, or algorithms.</li>
              <li>Our maximum aggregate liability to you is limited to the amount you paid in the last 30 days.</li>
              <li>In no event shall Optimeta be liable for indirect, incidental, or consequential damages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Termination</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>We may suspend or terminate accounts that violate these terms at our discretion.</li>
              <li>Accounts found to be fraudulent or abusing the free trial will be terminated immediately without refund.</li>
              <li>You may delete your account at any time from the Settings page.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">9. Changes to Terms</h2>
            <p className="text-sm">
              We may update these Terms and Conditions with at least 30 days&apos; notice for material changes.
              Continued use of Optimeta after the effective date constitutes your acceptance of the updated terms.
              We will notify active subscribers via email of any significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">10. Contact</h2>
            <p className="text-sm">
              For any questions about these Terms and Conditions, please contact us:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Email: <a href="mailto:optimeta@outlook.com" className="text-accent hover:text-primary transition-colors">optimeta@outlook.com</a></li>
              <li>Website: <a href="https://optimeta.tech" className="text-accent hover:text-primary transition-colors">optimeta.tech</a></li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border-color text-center">
          <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors">
            ← Back to Optimeta
          </Link>
        </div>
      </div>
    </main>
  );
}
