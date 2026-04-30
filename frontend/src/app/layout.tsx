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
  metadataBase: new URL('https://optimeta.in'),
  title: {
    default: 'Optimeta — AI Meta Ad Campaign Architect for Indian Brands',
    template: '%s | Optimeta',
  },
  description:
    'Stop wasting money on random Meta ads. Optimeta transforms your business into a complete, ready-to-launch Facebook & Instagram campaign blueprint in seconds. Built for Indian D2C, SaaS & agencies.',
  keywords: [
    'meta ads india',
    'facebook ads tool india',
    'ai ad campaign generator india',
    'meta ad architect',
    'facebook ads d2c india',
    'instagram ads strategy',
    'ai marketing tool india',
    'meta ads optimizer',
  ],
  authors: [{ name: 'Optimeta' }],
  creator: 'Optimeta',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://optimeta.in',
    siteName: 'Optimeta',
    title: 'Optimeta — AI Meta Ad Campaign Architect for Indian Brands',
    description:
      'Transform your business into a complete Meta ad campaign blueprint in seconds. Built for Indian D2C, SaaS & agencies.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Optimeta' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optimeta — AI Meta Ad Campaign Architect',
    description: 'Transform your business into a complete Meta ad campaign blueprint in seconds.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Optimeta',
              description: 'AI-powered Meta Ad Campaign Architect for Indian brands',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: [
                { '@type': 'Offer', price: '0', priceCurrency: 'INR', name: 'Free' },
                { '@type': 'Offer', price: '499', priceCurrency: 'INR', name: 'Pro' },
                { '@type': 'Offer', price: '999', priceCurrency: 'INR', name: 'Ultra' },
              ],
            }),
          }}
        />
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
