import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://optimeta.tech'),
  title: {
    default: 'Optimeta — AI Meta Ad Campaign Architect for Indian Brands',
    template: '%s | Optimeta',
  },
  description:
    'Stop wasting money on random Meta ads. Optimeta generates complete Facebook and Instagram campaign blueprints for Indian D2C brands, SaaS, coaches and agencies in minutes. Free to start.',
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
    googleBot: {
      index: true,
      follow: true,
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
    title: 'Optimeta — AI Meta Ad Campaign Architect for Indian Brands',
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
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
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
