import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ConsentMeasurement } from '@/components/ConsentMeasurement';
import StickyCallWidgets from '@/components/StickyCallWidgets';
import { BUSINESS, ACTIVE_CARRIER_SUPPORT, SETUP_DESK_HOURS, DISPATCH_SPECIALTIES } from '@/lib/constants';
import { SITE_URL } from '@/lib/seo';
import './globals.css';

/* Barlow Condensed for display type (headings, big numbers, wordmark) —
   the tall, narrow letterforms read like highway signage. Inter for body. */
const displayFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  // Real pages supply their own canonical, social metadata and indexing rules.
  // Error pages must not inherit a homepage canonical or an affirmative index tag.
  title: { default: `Truck Dispatch Services USA | ${DISPATCH_RATE_RANGE} Fees | Rai Dispatch`, template: '%s | Rai Dispatch' },
  metadataBase: new URL(SITE_URL),
  applicationName: 'Rai Dispatch',
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.parentCompany,
  publisher: BUSINESS.name,
  verification: {
    other: { 'msvalidate.01': '43D367AF26BF0F46B0DBFA8064241E02' },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=rai-union-v1', type: 'image/x-icon', sizes: '16x16 32x32 48x48 64x64 96x96' },
      { url: '/favicon-96x96.png?v=rai-union-v1', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg?v=rai-union-v1', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png?v=rai-union-v1', type: 'image/png', sizes: '180x180' }],
  },
  manifest: '/manifest.json?v=rai-union-v1',
};

/* Tints the browser chrome on mobile (Android Chrome, iOS Safari) with
   the brand red so the app frame matches the site. */
export const viewport: Viewport = {
  themeColor: '#C8202A',
};

// Business identity is shared across pages; page-specific services and breadcrumbs
// are described on the pages where visitors can read that content.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
      publishingPrinciples: `${SITE_URL}/editorial-standards`,
      name: BUSINESS.name, alternateName: 'Rai Logistics', legalName: BUSINESS.parentCompany,
      url: SITE_URL, logo: `${SITE_URL}/icon-512.png?v=rai-union-v1`,
      description: BUSINESS.description, telephone: BUSINESS.phone, email: BUSINESS.email,
      address: { '@type': 'PostalAddress', streetAddress: BUSINESS.address.street, addressLocality: BUSINESS.address.city, addressRegion: BUSINESS.address.state, postalCode: BUSINESS.address.zip, addressCountry: 'US' },
      areaServed: { '@type': 'Place', name: BUSINESS.serviceArea },
      knowsAbout: DISPATCH_SPECIALTIES.map(equipment => `${equipment.name} dispatch`),
      hasOfferCatalog: { '@id': `${SITE_URL}/equipment#dispatch-specialties` },
      contactPoint: [
        {
          '@type': 'ContactPoint', '@id': `${SITE_URL}/#active-carrier-support`,
          name: ACTIVE_CARRIER_SUPPORT, contactType: 'dispatch support for active carriers',
          description: 'Active carriers use the dispatch contact and escalation process agreed during setup.',
          url: `${SITE_URL}/contact`, areaServed: { '@type': 'Place', name: BUSINESS.serviceArea }, availableLanguage: 'en-US',
          hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
        },
        {
          '@type': 'ContactPoint', '@id': `${SITE_URL}/#carrier-setup-contact`,
          name: 'New-carrier setup desk', contactType: 'new-carrier setup',
          telephone: BUSINESS.phone, email: BUSINESS.email, url: `${SITE_URL}/contact`,
          description: `New-carrier setup hours: ${SETUP_DESK_HOURS}.`,
          areaServed: { '@type': 'Place', name: BUSINESS.serviceArea }, availableLanguage: 'en-US',
        },
      ],
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
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white font-body antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-4 focus:text-navy-950">Skip to main content</a>
          <Header />
          <main id="main-content" className="pt-20">{children}</main>
          <Footer />
          <ConsentMeasurement />
          <StickyCallWidgets />
          {/* No auto-appearing popup: the exit-intent/timed LeadCapturePopup was
              removed at the client's request. The component still exists at
              src/components/LeadCapturePopup.tsx — re-add <LeadCapturePopup /> here
              to switch it back on. The quote modal is unaffected: it only opens
              when someone clicks a "Get a free setup" / "Get Started" button. */}
        {/* Spacer for mobile sticky bar (14 = bar height; +safe-area for notched iOS) */}
        <div className="h-14 mb-safe md:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}
