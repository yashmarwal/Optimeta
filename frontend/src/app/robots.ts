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
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/*?_rsc=',
          '/_next/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: '/dashboard/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: '/dashboard/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: '/dashboard/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/*?_rsc=',
        ],
      },
    ],
    sitemap: 'https://optimeta.tech/sitemap.xml',
    host: 'https://optimeta.tech',
  };
}
