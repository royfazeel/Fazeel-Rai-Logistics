import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { Header, Footer, StickyCallWidgets, MotionProvider, Analytics } from '@/components';
import { BUSINESS } from '@/lib/constants';
import { SITE_URL, pageMetadata } from '@/lib/seo';
import './globals.css';

/* Barlow Condensed for display type (headings, big numbers, wordmark) —
   the tall, narrow letterforms read like highway signage. Inter for body. */
const displayFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  ...pageMetadata('Truck Dispatch Services in the USA | Up to 5%', 'Truck dispatch services for owner-operators and fleets across the USA. Load booking, rate negotiation and paperwork support with dispatch fees up to 5%.', '/'),
  title: { default: 'Truck Dispatch Services in the USA | Up to 5% | Rai Dispatch', template: '%s | Rai Dispatch' },
  metadataBase: new URL(SITE_URL),
  applicationName: 'Rai Dispatch',
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.parentCompany,
  publisher: BUSINESS.name,
  icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' },
  manifest: '/manifest.json',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
};

/* Tints the browser chrome on mobile (Android Chrome, iOS Safari) with
   the brand red so the app frame matches the site. */
export const viewport: Viewport = {
  themeColor: '#C8232C',
};

// Business identity is shared across pages; page-specific services and breadcrumbs
// are described on the pages where visitors can read that content.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
      name: BUSINESS.name, alternateName: 'Rai Logistics', legalName: BUSINESS.parentCompany,
      url: SITE_URL, logo: `${SITE_URL}/icon-512.png`,
      description: BUSINESS.description, telephone: BUSINESS.phone, email: BUSINESS.email,
      address: { '@type': 'PostalAddress', streetAddress: BUSINESS.address.street, addressLocality: BUSINESS.address.city, addressRegion: BUSINESS.address.state, postalCode: BUSINESS.address.zip, addressCountry: 'US' },
      areaServed: { '@type': 'Country', name: 'United States' },
      contactPoint: { '@type': 'ContactPoint', telephone: BUSINESS.phone, contactType: 'customer service', areaServed: 'US', availableLanguage: 'English' },
    },
    {
      '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL,
      name: BUSINESS.name, alternateName: 'Rai Logistics', inLanguage: 'en-US',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white font-body antialiased">
        {/* Preserve the existing analytics property. Queue events after
            hydration, then load the external tag after page load and idle. */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-4 focus:text-navy-950">Skip to main content</a>
        <Analytics />
        <MotionProvider>
          <Header />
          <main id="main-content" className="pt-20">{children}</main>
          <Footer />
          <StickyCallWidgets />
          {/* No auto-appearing popup: the exit-intent/timed LeadCapturePopup was
              removed at the client's request. The component still exists at
              src/components/LeadCapturePopup.tsx — re-add <LeadCapturePopup /> here
              to switch it back on. The quote modal is unaffected: it only opens
              when someone clicks a "Get a free setup" / "Get Started" button. */}
        </MotionProvider>
        {/* Spacer for mobile sticky bar (14 = bar height; +safe-area for notched iOS) */}
        <div className="h-14 mb-safe md:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}
