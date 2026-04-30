'use client';

import Link from 'next/link';
import { Linkedin, Instagram, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-border-color py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Optimeta" width={32} height={32} className="object-contain" />
              <span className="text-xl font-black gradient-text">OPTIMETA</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              India&apos;s AI Meta Ad Campaign Architect. Stop guessing, start winning.
            </p>
          </div>

          <div>
            <div className="text-white font-semibold text-sm mb-4">Product</div>
            <div className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'How it works', href: '#how-it-works' },
                { label: 'Features', href: '#features' },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="block text-sm text-text-muted hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-semibold text-sm mb-4">Company</div>
            <div className="space-y-3">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'Login', href: '/login' },
                { label: 'Register', href: '/register' },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="block text-sm text-text-muted hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-semibold text-sm mb-4">Follow Us</div>
            <div className="flex gap-3 mb-4">
              <a
                href="https://www.linkedin.com/company/optimeta-ai-meta-ads-generator/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-border-color flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} className="text-text-muted" />
              </a>
              <a
                href="https://www.instagram.com/optimeta.tech?igsh=MWJ1ZWwyOXR6c3JnNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-border-color flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} className="text-text-muted" />
              </a>
            </div>
            <a
              href="mailto:optimeta@outlook.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 text-white text-sm font-medium hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:border-transparent transition-all"
            >
              <Mail size={14} />
              Contact Us
            </a>
          </div>
        </div>

        <div className="section-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © 2025 Optimeta. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-text-muted hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-text-muted hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
