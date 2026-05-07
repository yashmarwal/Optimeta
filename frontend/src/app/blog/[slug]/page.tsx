import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, Calendar, User } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { blogArticles, categoryColors, type ContentBlock } from '@/lib/blogData';

export function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = blogArticles.find((a) => a.slug === params.slug);
  if (!article) return {};
  const truncatedTitle =
    article.title.length > 55 ? article.title.substring(0, 52) + '...' : article.title;
  return {
    title: { absolute: truncatedTitle + ' | Optimeta' },
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      authors: [article.author],
      url: `https://optimeta.tech/blog/${article.slug}`,
    },
    alternates: { canonical: `https://optimeta.tech/blog/${article.slug}` },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-text-secondary leading-relaxed mb-5">{block.text}</p>;

    case 'bullets':
      return (
        <ul className="space-y-3 mb-6">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-text-secondary leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'pullquote':
      return (
        <blockquote className="border-l-4 border-primary pl-5 py-3 my-8 bg-primary/5 rounded-r-xl">
          <p
            className="text-white font-medium italic leading-relaxed"
            style={{ whiteSpace: 'pre-line' }}
          >
            {block.text}
          </p>
        </blockquote>
      );

    case 'fix':
      return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 my-5">
          <span className="text-xs font-bold text-green-400 uppercase tracking-wider mt-0.5 flex-shrink-0">
            Fix →
          </span>
          <p className="text-green-200/80 leading-relaxed">{block.text}</p>
        </div>
      );

    default:
      return null;
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = blogArticles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const categoryClass =
    categoryColors[article.category] ?? 'bg-primary/20 text-primary border-primary/30';

  return (
    <main className="min-h-screen bg-bg-dark dot-grid">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm mb-10"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        {/* Article header */}
        <div className="mb-10">
          <span
            className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border mb-5 ${categoryClass}`}
          >
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {article.publishDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {article.readTime}
            </span>
          </div>
        </div>

        <div className="section-divider mb-10" />

        {/* Intro */}
        {article.intro.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        {/* Sections */}
        {article.sections.map((section, i) => (
          <div key={i} className="mt-12">
            <h2 className="text-2xl font-black gradient-text mb-5">{section.heading}</h2>
            {section.content.map((block, j) => (
              <Block key={j} block={block} />
            ))}
          </div>
        ))}

        {/* Conclusion */}
        <div className="mt-12">
          <h2 className="text-2xl font-black gradient-text mb-5">Conclusion</h2>
          <p className="text-text-secondary leading-relaxed">{article.conclusion}</p>
        </div>

        {/* CTA card */}
        <div className="mt-16 glass-card gradient-border p-10 text-center rounded-2xl">
          <h3 className="text-2xl font-black text-white mb-3">Ready to build your campaign?</h3>
          <p className="text-text-muted mb-8">
            Use Optimeta to generate your complete Meta ad blueprint in minutes.
          </p>
          <Link href="/register">
            <button className="btn-gradient px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2">
              Generate Free Campaign
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            author: {
              '@type': 'Organization',
              name: 'Optimeta',
              url: 'https://optimeta.tech',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Optimeta',
              logo: {
                '@type': 'ImageObject',
                url: 'https://optimeta.tech/logo.png',
              },
            },
            datePublished: article.publishDate,
            dateModified: article.publishDate,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://optimeta.tech/blog/${article.slug}`,
            },
          }),
        }}
      />
    </main>
  );
}
