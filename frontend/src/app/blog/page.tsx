import type { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Blog — Meta Ads Guides & Strategies for Indian Brands | Optimeta',
  description:
    'Expert Meta ads guides, targeting strategies, budget planning and creative tips for Indian D2C brands, SaaS founders and agencies.',
  openGraph: {
    title: 'Blog — Meta Ads Guides & Strategies for Indian Brands | Optimeta',
    description:
      'Expert Meta ads guides, targeting strategies, budget planning and creative tips for Indian D2C brands, SaaS founders and agencies.',
    url: 'https://optimeta.in/blog',
    type: 'website',
  },
  alternates: { canonical: 'https://optimeta.in/blog' },
};

const articles = [
  {
    slug: 'meta-ads-for-d2c-brands-india-2026',
    title: 'How to Run Meta Ads for D2C Brands in India (2026 Complete Guide)',
    description:
      'Step-by-step guide to running profitable Facebook and Instagram ads for Indian D2C brands. Covers objectives, budgets, targeting, creatives and ROAS benchmarks for 2026.',
    category: 'Meta Ads Guide',
    readTime: '12 min read',
    date: 'April 28, 2026',
    metaTitle: 'Meta Ads for D2C Brands India 2026 — Complete Guide',
    metaDescription:
      'Learn how to run profitable Meta ads for your Indian D2C brand in 2026. Budget strategies, targeting tips, creative formats and real ROAS benchmarks included.',
    keywords:
      'meta ads india, facebook ads d2c india, instagram ads for d2c brands, meta ads guide india 2026',
  },
  {
    slug: 'facebook-ads-targeting-india-2026',
    title: 'Meta Ad Targeting Strategies That Actually Work in India (2026)',
    description:
      'Master Facebook and Instagram ad targeting for Indian audiences. Interests, behaviors, demographics, lookalikes and Advantage+ targeting explained.',
    category: 'Targeting Strategy',
    readTime: '10 min read',
    date: 'April 28, 2026',
    metaTitle: 'Meta Ads Targeting India 2026 — Interests, Behaviors & Lookalikes',
    metaDescription:
      'Discover the Meta ad targeting strategies that work for Indian audiences in 2026. Complete guide to interests, behaviors, demographics and Advantage+ targeting.',
    keywords:
      'meta ads targeting india, facebook ads audience india, instagram ads targeting 2026, advantage plus targeting india',
  },
  {
    slug: 'why-indian-brands-waste-money-meta-ads',
    title: 'Why Most Indian Brands Waste Money on Meta Ads (And How to Stop)',
    description:
      'The 7 biggest Meta ads mistakes Indian D2C brands make that drain ad budgets without results — and exactly how to fix each one.',
    category: 'Common Mistakes',
    readTime: '8 min read',
    date: 'April 28, 2026',
    metaTitle: 'Why Indian Brands Waste Money on Facebook Ads — 7 Mistakes to Avoid',
    metaDescription:
      'Discover the 7 most common Meta ads mistakes Indian brands make and how to fix them. Stop wasting your ad budget and start getting ROAS.',
    keywords:
      'facebook ads mistakes india, meta ads not working india, why facebook ads fail india, improve meta ads roas india',
  },
  {
    slug: 'meta-ads-budget-india-beginners',
    title: 'How Much to Spend on Meta Ads in India: Budget Guide for Beginners',
    description:
      'Complete budget planning guide for Indian businesses running Meta ads for the first time. Minimum budgets, scaling strategies and ROI expectations explained.',
    category: 'Budget Planning',
    readTime: '7 min read',
    date: 'April 28, 2026',
    metaTitle: 'Meta Ads Budget India 2026 — How Much to Spend as a Beginner',
    metaDescription:
      'How much should you spend on Meta ads in India? Complete budget guide for beginners covering minimum spend, scaling and expected results for Indian brands.',
    keywords:
      'meta ads budget india, facebook ads cost india 2026, how much to spend on instagram ads india, meta ads minimum budget india',
  },
  {
    slug: 'advantage-plus-shopping-campaigns-india',
    title: 'Advantage+ Shopping Campaigns for Indian D2C Brands: 2026 Guide',
    description:
      'How to set up and scale Meta Advantage+ Shopping Campaigns for Indian e-commerce brands. Complete setup guide with budget recommendations and optimization tips.',
    category: 'Campaign Strategy',
    readTime: '9 min read',
    date: 'April 28, 2026',
    metaTitle: 'Advantage+ Shopping Campaigns India 2026 — Setup & Optimization Guide',
    metaDescription:
      'Master Meta Advantage+ Shopping Campaigns for your Indian D2C brand. Step-by-step setup, budget recommendations and scaling strategies for 2026.',
    keywords:
      'advantage plus shopping india, meta ASC india, advantage plus campaigns d2c india, facebook shopping campaigns india 2026',
  },
  {
    slug: 'meta-ads-creative-strategy-india-2026',
    title: 'Meta Ads Creative Strategy for Indian Brands: What Works in 2026',
    description:
      'The complete creative strategy guide for Indian Meta ads. UGC vs studio content, Reels hooks, ad copy formulas and creative testing frameworks that drive ROAS.',
    category: 'Creative Strategy',
    readTime: '11 min read',
    date: 'April 28, 2026',
    metaTitle: 'Meta Ads Creative Strategy India 2026 — UGC, Reels & Copy Guide',
    metaDescription:
      'Learn what creative formats work best for Meta ads in India. Complete guide to UGC content, Reels hooks, ad copywriting and creative testing for Indian brands in 2026.',
    keywords:
      'meta ads creative india, facebook ads ugc india, instagram reels ads india, meta ad copy india 2026',
  },
];

const categoryColors: Record<string, string> = {
  'Meta Ads Guide': 'bg-primary/20 text-primary border-primary/30',
  'Targeting Strategy': 'bg-accent/20 text-accent border-accent/30',
  'Common Mistakes': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Budget Planning': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Campaign Strategy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Creative Strategy': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
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
            Meta Ads Insights for<br />
            <span className="gradient-text">Indian Brands</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Guides, strategies and playbooks to help you run profitable Meta ads.
            New articles every week.
          </p>
        </div>

        {/* 3×2 Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="glass-card p-6 flex flex-col group transition-all hover:scale-[1.02] hover:-translate-y-1 duration-200"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${categoryColors[article.category] ?? 'bg-primary/20 text-primary border-primary/30'}`}
                >
                  {article.category}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap flex-shrink-0">
                  Coming Soon
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
              <div className="flex items-center justify-between pt-3 border-t border-white/8 mt-auto">
                <div className="text-xs text-text-muted">
                  <span className="text-white/60">Optimeta Team</span>
                  <span className="mx-1.5">·</span>
                  <span>{article.readTime}</span>
                </div>
                <span className="text-xs text-text-muted">{article.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
