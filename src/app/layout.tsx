import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://turfbook.in'),
  title: {
    default: 'TurfBook – Book Sports Turfs in Chennai',
    template: '%s | TurfBook',
  },
  description:
    'Find and book cricket, football, basketball & tennis turfs in Chennai. Real-time slot availability, instant booking confirmation. Turfs near Tiruvottiyur, Anna Nagar, OMR, and Velachery.',
  keywords: [
    'turf booking Chennai',
    'cricket turf Chennai',
    'football turf Tiruvottiyur',
    'sports turf booking online',
    'book cricket ground Chennai',
    'futsal court Chennai',
    'turf near me Chennai',
    'TurfBook',
  ],
  authors: [{ name: 'TurfBook', url: 'https://turfbook.in' }],
  creator: 'TurfBook',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://turfbook.in',
    siteName: 'TurfBook',
    title: 'TurfBook – Book Sports Turfs in Chennai',
    description:
      'Find and book cricket, football, basketball & tennis turfs in Chennai. Real-time availability, instant confirmation.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TurfBook – Book Sports Turfs in Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TurfBook – Book Sports Turfs in Chennai',
    description:
      'Find and book cricket, football & tennis turfs in Chennai. Real-time slot availability.',
    images: ['/og-image.jpg'],
    creator: '@TurfBook',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://turfbook.in' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'TurfBook',
  description: 'Online sports turf booking platform in Chennai',
  url: 'https://turfbook.in',
  '@id': 'https://turfbook.in',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.0827,
    longitude: 80.2707,
  },
  sameAs: ['https://turfbook.in'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
