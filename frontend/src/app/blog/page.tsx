import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Blog — Meta Ads Strategy for Indian Brands | Optimeta',
  description: 'Learn how to run profitable Meta ads in India. Deep-dive guides on Facebook & Instagram ad strategy for D2C brands, SaaS, and agencies.',
  alternates: { canonical: 'https://optimeta.in/blog' },
};

const articles = [
  {
    slug: 'meta-ads-d2c-india-guide-2026',
    title: 'How to Run Meta Ads for D2C Brands in India (2026 Guide)',
    description: 'A complete playbook for running profitable Facebook and Instagram ads for Indian D2C products — from audience targeting to creative strategy and budget allocation.',
    date: 'January 15, 2026',
    readTime: '12 min read',
    category: 'D2C Strategy',
    tags: ['Meta Ads', 'D2C', 'Facebook Ads India'],
  },
  {
    slug: 'meta-ad-targeting-india-strategies',
    title: 'Meta Ad Targeting Strategies That Actually Work in India',
    description: 'Forget generic targeting. Here are the specific interest stacks, behavioral clusters, and lookalike strategies that drive results for Indian audiences on Facebook and Instagram.',
    date: 'January 22, 2026',
    readTime: '9 min read',
    category: 'Targeting',
    tags: ['Audience Targeting', 'Meta Ads', 'India'],
  },
  {
    slug: 'why-indian-brands-waste-money-facebook-ads',
    title: 'Why Indian Brands Waste Money on Facebook Ads (and How to Fix It)',
    description: 'Analysis of the 5 most common Meta ad mistakes Indian brands make — and the exact fixes that will cut your CAC and boost ROAS within the first month.',
    date: 'February 2, 2026',
    readTime: '8 min read',
    category: 'Strategy',
    tags: ['Facebook Ads', 'ROAS', 'Common Mistakes'],
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-bg-dark dot-grid">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Meta Ad Strategy<br />
            <span className="gradient-text">for Indian Brands</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Deep-dive guides on running profitable Facebook & Instagram ads in India. Written by performance marketers, for Indian founders.
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <article key={article.slug} className="glass-card p-8 gradient-border group transition-all hover:scale-[1.01] hover:-translate-y-1 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="tag">{article.category}</span>
                    <span className="text-xs text-text-muted">{article.date}</span>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">{article.readTime}</span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all">
                    {article.title}
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {article.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 bg-white/5 rounded-full text-text-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button className="text-sm font-semibold text-accent hover:text-primary transition-colors flex items-center gap-1">
                    Read article →
                  </button>
                </div>

                <div className="sm:w-48 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <div className="text-4xl font-black gradient-text opacity-30">
                    {article.category[0]}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 glass-card p-10 text-center">
          <h3 className="text-2xl font-black text-white mb-3">Get Meta Ad Insights in Your Inbox</h3>
          <p className="text-text-muted text-sm mb-6">Weekly strategy guides for Indian brands. No spam, ever.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-field flex-1 px-4 py-3 text-sm"
            />
            <button className="btn-gradient px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
