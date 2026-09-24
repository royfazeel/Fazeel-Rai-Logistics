import HomePageClient from './HomePageClient';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { BUSINESS, SERVICES } from '@/lib/constants';

export const metadata = pageMetadata('Truck Dispatch Services in the USA | Up to 5%', 'Dedicated truck dispatch services for owner-operators and fleets. Load booking, rate negotiation and paperwork across the lower 48, with fees up to 5%.', '/');

export default function HomePage() {
  const service = {
    '@context': 'https://schema.org', '@type': 'Service',
    '@id': `${SITE_URL}/#dispatch-service`, name: 'Truck dispatch services',
    serviceType: 'Truck Dispatch', url: SITE_URL, description: BUSINESS.description,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'United States' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Truck dispatch support',
      itemListElement: SERVICES.map(item => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: item.title, url: `${SITE_URL}/services/${item.id}` } })),
    },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service).replace(/</g, '\\u003c') }} /><HomePageClient /></>;
}
