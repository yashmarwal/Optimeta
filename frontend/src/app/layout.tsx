import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/ui/Providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
    { media: '(prefers-color-scheme: light)', color: '#7B2FBE' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://optimeta.tech'),
  title: {
    default: 'Optimeta — AI Meta Ad Architect for India',
    template: '%s | Optimeta',
  },
  description:
    'Stop wasting money on Meta ads. Optimeta generates complete Facebook and Instagram blueprints for Indian D2C brands and agencies in minutes. Free to start.',
  keywords: [
    'meta ads india',
    'facebook ads tool india',
    'instagram ads strategy india',
    'ai ad campaign generator india',
    'meta ad architect india',
    'facebook ads for d2c india',
    'meta ads optimizer india',
    'campaign blueprint generator india',
    'facebook ads india 2026',
    'ai marketing tool india',
    'meta ads for small business india',
    'optimeta',
    'meta ads campaign planner',
  ],
  authors: [{ name: 'Optimeta Team' }],
  creator: 'Optimeta',
  publisher: 'Optimeta',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://optimeta.tech',
    siteName: 'Optimeta',
    title: 'Optimeta — AI Meta Ad Architect for India',
    description:
      'Generate complete Meta ad campaign blueprints for your Indian brand in minutes. Targeting, budget, ad copies, creative direction — all included.',
    images: [
      {
        url: 'https://optimeta.tech/logo.png',
        width: 512,
        height: 512,
        alt: 'Optimeta Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optimeta — AI Meta Ad Campaign Architect',
    description:
      'Generate complete Meta ad campaign blueprints for Indian brands in minutes.',
    images: ['https://optimeta.tech/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  alternates: {
    canonical: 'https://optimeta.tech',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#7B2FBE" />
        <meta name="msapplication-TileColor" content="#7B2FBE" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://optimeta-backend.onrender.com" />
        <link rel="preconnect" href="https://optimeta-backend.onrender.com" />
        <link rel="alternate" type="application/rss+xml" title="Optimeta Blog" href="https://optimeta.tech/feed.xml" />
      </head>
      <body className={`${inter.variable} font-sans bg-bg-dark text-white antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#0F0F1A',
                color: '#fff',
                border: '1px solid rgba(123,47,190,0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                maxWidth: '90vw',
              },
              success: {
                iconTheme: { primary: '#7B2FBE', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
