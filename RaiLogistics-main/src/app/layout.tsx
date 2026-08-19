import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { Header, Footer, StickyCallWidgets, LeadCapturePopup, MotionProvider } from '@/components';
import { BUSINESS, FAQS, SERVICES } from '@/lib/constants';
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
  title: {
    default: `${BUSINESS.name} | Professional Truck Dispatch Services`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  keywords: [
    'truck dispatch',
    'dispatch services',
    'trucking dispatch',
    'freight dispatch',
    'owner operator dispatch',
    'dry van dispatch',
    'flatbed dispatch',
    'reefer dispatch',
    'box truck dispatch',
    'trucking company',
  ],
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.parentCompany,
  publisher: BUSINESS.name,
  metadataBase: new URL('https://railogistics.us'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | Professional Truck Dispatch Services`,
    description: BUSINESS.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS.name} | Professional Truck Dispatch Services`,
    description: BUSINESS.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ---------------------------------------------------------------------------
   Structured data (JSON-LD).
   We ship FOUR schemas to maximize SERP eligibility:
     1. LocalBusiness — primary business identity, NAP, hours, area served
     2. Organization — parent company + sameAs links
     3. Service       — explicit list of dispatch services we offer
     4. FAQPage       — pulls FAQS so Google can render rich FAQ snippets
   All published as one @graph object — recommended by Google for sites that
   want multiple schema types on the same page.
--------------------------------------------------------------------------- */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://railogistics.us/#business',
      name: BUSINESS.name,
      description: BUSINESS.description,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      url: 'https://railogistics.us',
      image: 'https://railogistics.us/icon-512.png',
      logo: 'https://railogistics.us/icon-512.png',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.city,
        addressRegion: BUSINESS.address.state,
        postalCode: BUSINESS.address.zip,
        addressCountry: 'US',
      },
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '08:00',
          closes: '18:00',
        },
      ],
      parentOrganization: {
        '@type': 'Organization',
        name: BUSINESS.parentCompany,
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://railogistics.us/#org',
      name: BUSINESS.name,
      legalName: BUSINESS.parentCompany,
      url: 'https://railogistics.us',
      logo: 'https://railogistics.us/icon-512.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: 'en',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://railogistics.us/#service',
      serviceType: 'Truck Dispatch Services',
      provider: { '@id': 'https://railogistics.us/#business' },
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
      description: BUSINESS.description,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Dispatch Services',
        itemListElement: SERVICES.map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.title,
            description: s.description,
          },
        })),
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.slice(0, 8).map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
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
        {/* Hero video + imagery are served from the Pexels CDN */}
        <link rel="preconnect" href="https://videos.pexels.com" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white font-body antialiased">
        <MotionProvider>
          <Header />
          <main className="pt-20">{children}</main>
          <Footer />
          <StickyCallWidgets />
          <LeadCapturePopup />
        </MotionProvider>
        {/* Spacer for mobile sticky bar (14 = bar height; +safe-area for notched iOS) */}
        <div className="h-14 mb-safe md:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}
