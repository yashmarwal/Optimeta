import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/blog',
          '/blog/',
          '/terms',
          '/privacy',
          '/compare',
          '/llms.txt',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
      // ChatGPT bots
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      // Perplexity
      { userAgent: 'PerplexityBot', allow: '/' },
      // Claude/Anthropic
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      // Google AI
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      // Bing/Copilot
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'msnbot', allow: '/' },
      // Meta AI
      { userAgent: 'FacebookBot', allow: '/' },
    ],
    sitemap: 'https://optimeta.tech/sitemap.xml',
    host: 'https://optimeta.tech',
  };
}
