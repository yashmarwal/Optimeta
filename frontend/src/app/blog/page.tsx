import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { blogArticles, categoryColors } from '@/lib/blogData';

export const metadata: Metadata = {
  title: 'Blog — Meta Ads Guides India | Optimeta',
  description:
    'Expert guides on running profitable Meta ads in India. Targeting strategies, budget planning and creative tips for D2C brands.',
  alternates: {
    canonical: 'https://optimeta.tech/blog',
  },
  openGraph: {
    url: 'https://optimeta.tech/blog',
    title: 'Blog — Meta Ads Guides | Optimeta',
    description: 'Expert guides on running profitable Meta ads in India.',
    siteName: 'Optimeta',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Meta Ads Blog —
            <br />
            <span className="gradient-text">Guides for Indian Brands</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Guides, strategies and playbooks to help you run profitable Meta ads. New articles
            every week.
          </p>
        </div>

        {/* 3×2 Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogArticles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="group block">
              <article className="glass-card p-6 flex flex-col h-full transition-all hover:scale-[1.02] hover:-translate-y-1 duration-200">
                {/* Category pill */}
                <div className="mb-4">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      categoryColors[article.category] ?? 'bg-primary/20 text-primary border-primary/30'
                    }`}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base font-bold text-white mb-2 leading-snug group-hover:gradient-text transition-all">
                  {article.title}
                </h2>

                {/* Description */}
                <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                  {article.description}
                </p>

                {/* Footer meta */}
                <div className="pt-3 border-t border-white/8 mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-text-muted">
                      <span className="text-white/60">Optimeta Team</span>
                      <span className="mx-1.5">·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <span className="text-xs text-text-muted">{article.publishDate}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:text-primary transition-colors">
                    Read Article
                    <ArrowRight size={12} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
