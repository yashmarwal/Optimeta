import { blogArticles } from '@/lib/blogData';

export async function GET() {
  const baseUrl = 'https://optimeta.tech';

  const rssItems = blogArticles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${new Date(article.publishDate).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${article.slug}</guid>
      <category>${article.category}</category>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Optimeta Blog — Meta Ads Guides for Indian Brands</title>
    <link>${baseUrl}/blog</link>
    <description>Expert guides on running profitable Meta ads in India. Targeting strategies, budget planning and creative tips for D2C brands.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
