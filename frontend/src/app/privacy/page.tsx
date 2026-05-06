import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Optimeta',
  description: 'Optimeta privacy policy. How we collect, store and protect your data. Covers account info, campaign data, device fingerprinting, payments and your rights.',
  alternates: {
    canonical: 'https://optimeta.tech/privacy',
  },
};

export default function PrivacyPage() {
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

        <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. What Data We Collect</h2>
            <p className="text-sm mb-3">When you use Optimeta, we collect the following categories of data:</p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li><strong className="text-white">Account information:</strong> Your full name and email address, provided at registration.</li>
              <li><strong className="text-white">Business information:</strong> Business name, industry, product details, budget, target audience, and other inputs you provide when generating a campaign blueprint.</li>
              <li><strong className="text-white">Campaign data:</strong> Generated blueprints and associated business inputs, stored so you can access your campaign history.</li>
              <li><strong className="text-white">Device fingerprint:</strong> Browser details (user agent, screen resolution, timezone, language) and a canvas fingerprint hash used to prevent free trial abuse. We store a one-way hash — the raw fingerprint is never stored.</li>
              <li><strong className="text-white">IP address:</strong> Used to detect and prevent free trial abuse (multiple registrations from the same network).</li>
              <li><strong className="text-white">Payment data:</strong> Razorpay handles all payment processing. We do not store card numbers, CVV, or bank details. We store your subscription status and plan tier.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. How We Use Your Data</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>To generate personalised AI campaign blueprints based on your business inputs.</li>
              <li>To manage your account, subscription, and billing.</li>
              <li>To display your campaign history within the dashboard.</li>
              <li>To detect and prevent fraud, including duplicate free trial registrations.</li>
              <li>To send transactional emails (subscription confirmation, renewal notices) — no marketing emails without consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Who We Share Data With</h2>
            <p className="text-sm mb-3">We share minimal data only with trusted service providers required to operate the platform:</p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li><strong className="text-white">Razorpay:</strong> Payment processing. Razorpay receives your name, email, and subscription details to process payments and send receipts.</li>
              <li><strong className="text-white">Supabase:</strong> Database and authentication provider. Your account data, campaign data, and fingerprints are stored in Supabase&apos;s secure cloud infrastructure.</li>
              <li><strong className="text-white">Anthropic (Claude AI):</strong> Your business inputs are sent to Anthropic&apos;s API to generate campaign blueprints. Anthropic&apos;s usage policy applies. We do not send your name or email to Anthropic.</li>
              <li>We do not sell, rent, or share your data with advertisers, data brokers, or any other third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Data Retention</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li><strong className="text-white">Active accounts:</strong> Your data is retained for as long as your account is active.</li>
              <li><strong className="text-white">Cancelled subscriptions:</strong> Account and campaign data are retained for 30 days after cancellation, then permanently deleted unless you reactivate.</li>
              <li><strong className="text-white">Deleted accounts:</strong> When you delete your account via Settings, all your personal data and campaign data are permanently removed immediately.</li>
              <li><strong className="text-white">Fingerprint hashes:</strong> Retained indefinitely to prevent free trial re-abuse after account deletion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Your Rights</h2>
            <p className="text-sm mb-3">You have the following rights over your data:</p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li><strong className="text-white">Access:</strong> You can view all your campaign data from the dashboard at any time.</li>
              <li><strong className="text-white">Delete:</strong> You can permanently delete your account and all associated data from Settings → Danger Zone.</li>
              <li><strong className="text-white">Export:</strong> You can export any campaign blueprint as a PDF from the campaign view page.</li>
              <li><strong className="text-white">Correction:</strong> You can update your name from the Settings → Profile section.</li>
              <li>To request a full data export or raise a privacy concern, email us at <a href="mailto:optimeta@outlook.com" className="text-accent hover:text-primary transition-colors">optimeta@outlook.com</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Cookies</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>We use authentication cookies to keep you logged in securely. These are httpOnly, secure cookies.</li>
              <li>We use localStorage to store your JWT token and a cached copy of your user profile for fast page loads.</li>
              <li>We do not use third-party tracking cookies or advertising cookies.</li>
              <li>We do not use Google Analytics or any behavioural tracking services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Security</h2>
            <p className="text-sm">
              All data is transmitted over HTTPS. Passwords are hashed by Supabase Auth (bcrypt) and never stored in plaintext.
              JWT tokens expire after 7 days. We perform server-side validation on all inputs and follow OWASP security practices.
              Device fingerprints are stored as one-way SHA-256 hashes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Contact</h2>
            <p className="text-sm">
              For any privacy questions, data requests, or concerns, contact us:
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
