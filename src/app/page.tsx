import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import HomePageClient from './HomePageClient';
import { HOME_HERO_IMAGE, pageMetadata, SITE_URL } from '@/lib/seo';
import { BUSINESS, SERVICES } from '@/lib/constants';

export const metadata = pageMetadata(`Truck Dispatch Services USA | ${DISPATCH_RATE_RANGE} Fees`, `Dedicated truck dispatch for owner-operators and fleets across 48 states. Load booking, rate negotiation and paperwork. ${DISPATCH_RATE_RANGE} fees by equipment.`, '/');

export default function HomePage() {
  const service = {
    '@type': 'Service',
    '@id': `${SITE_URL}/#dispatch-service`, name: 'Truck dispatch services',
    serviceType: 'Truck Dispatch', url: SITE_URL, description: BUSINESS.description,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Place', name: '48 contiguous United States' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Truck dispatch support',
      itemListElement: SERVICES.map(item => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: item.title, url: `${SITE_URL}/services/${item.id}` } })),
    },
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${SITE_URL}/#webpage`, url: SITE_URL,
        name: 'Rai Dispatch — Truck Dispatch Services USA', inLanguage: 'en-US',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#dispatch-service` },
        primaryImageOfPage: `${SITE_URL}${HOME_HERO_IMAGE}`,
      },
      service,
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><HomePageClient /></>;
}
