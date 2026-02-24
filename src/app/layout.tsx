import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://wiresizes.com'),
  title: {
    default: 'Wire Size Calculator | Free Electrical Wire Sizing Tools | WireSizes.com',
    template: '%s | WireSizes.com',
  },
  description: 'Free wire size calculator and electrical wire sizing tools. Calculate AWG wire size, voltage drop, and ampacity based on NEC code. Professional tools for electricians and DIY.',
  keywords: [
    'wire size calculator',
    'AWG calculator',
    'voltage drop calculator',
    'wire gauge calculator',
    'electrical wire sizing',
    'NEC wire size',
    'ampacity calculator',
  ],
  authors: [{ name: 'WireSizes.com' }],
  creator: 'WireSizes.com',
  publisher: 'WireSizes.com',
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
    locale: 'en_US',
    url: 'https://wiresizes.com',
    siteName: 'WireSizes.com',
    title: 'Wire Size Calculator | Free Electrical Wire Sizing Tools',
    description: 'Free wire size calculator based on NEC code. Calculate AWG wire size, voltage drop, and ampacity for any electrical circuit.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WireSizes.com - Wire Size Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wire Size Calculator | WireSizes.com',
    description: 'Free wire size calculator based on NEC code. Professional electrical wire sizing tools.',
    images: ['/images/og-image.png'],
  },
  verification: {
    google: 'google12f8c2f9c03913a3',
    other: {
      'msvalidate.01': 'your-bing-verification-code-here',
    },
  },
  alternates: {
    canonical: 'https://wiresizes.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-T871GVJZE2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T871GVJZE2');
            `,
          }}
        />
        
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-neutral-900">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}