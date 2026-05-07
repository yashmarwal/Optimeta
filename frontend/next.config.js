/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [];
  },

  async headers() {
    const fullRobots =
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    return [
      {
        // Security + CSP headers for all pages
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://optimeta-backend.onrender.com https://api.razorpay.com https://lumberjack.razorpay.com https://*.supabase.co wss://*.supabase.co",
              "frame-src https://api.razorpay.com",
              "object-src 'none'",
            ].join('; '),
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/',
        headers: [{ key: 'X-Robots-Tag', value: fullRobots }],
      },
      {
        source: '/pricing',
        headers: [{ key: 'X-Robots-Tag', value: fullRobots }],
      },
      {
        source: '/blog',
        headers: [{ key: 'X-Robots-Tag', value: fullRobots }],
      },
      {
        source: '/blog/:slug*',
        headers: [{ key: 'X-Robots-Tag', value: fullRobots }],
      },
      {
        source: '/compare',
        headers: [{ key: 'X-Robots-Tag', value: fullRobots }],
      },
      {
        source: '/about',
        headers: [{ key: 'X-Robots-Tag', value: fullRobots }],
      },
      {
        source: '/terms',
        headers: [{ key: 'X-Robots-Tag', value: 'index, follow' }],
      },
      {
        source: '/privacy',
        headers: [{ key: 'X-Robots-Tag', value: 'index, follow' }],
      },
      {
        source: '/llms.txt',
        headers: [{ key: 'X-Robots-Tag', value: 'index, follow' }],
      },
      {
        source: '/dashboard/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/login',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/register',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/forgot-password',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/reset-password',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|txt)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  compress: true,
  poweredByHeader: false,

  images: {
    domains: ['optimeta.tech'],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
