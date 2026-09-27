import { pageMetadata, SITE_URL } from '@/lib/seo';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';
import { DEFAULT_DISPATCH_RATE, DISPATCH_RATE_RANGE, getDispatchRateLabel } from '@/lib/dispatch-pricing';
import { ContentJsonLd } from '@/components/content/ContentDetail';
import PricingPageClient from './PricingPageClient';

export const metadata = pageMetadata(`Truck Dispatch Pricing | ${DISPATCH_RATE_RANGE} & Free Setup`, `Dry van, reefer and flatbed dispatch ${getDispatchRateLabel('dry-van')}; hotshot ${getDispatchRateLabel('hotshot')}; vans, box trucks and other equipment ${DEFAULT_DISPATCH_RATE}%. Free setup and a dedicated dispatcher for each truck.`, '/pricing');

export default function PricingPage() {
  return <>
    <ContentJsonLd data={{
      '@context': 'https://schema.org', '@type': 'OfferCatalog',
      '@id': `${SITE_URL}/pricing#dispatch-fees`, name: `${BUSINESS.name} dispatch fees by equipment`,
      url: `${SITE_URL}/pricing`,
      itemListElement: [
        ...EQUIPMENT_TYPES.map(equipment => ({
          '@type': 'Offer', name: `${equipment.name} dispatch`,
          url: `${SITE_URL}/equipment/${equipment.id}`,
          description: `${equipment.percentage} of gross revenue on loads we dispatch. Dedicated truck dispatcher included.`,
          seller: { '@id': `${SITE_URL}/#organization` },
          itemOffered: { '@type': 'Service', name: `${equipment.name} dispatch`, url: `${SITE_URL}/equipment/${equipment.id}` },
        })),
        {
          '@type': 'Offer', name: 'All other truck types', url: `${SITE_URL}/pricing`,
          description: `${DEFAULT_DISPATCH_RATE}% of gross revenue on loads we dispatch. Equipment and service availability confirmed before onboarding. Dedicated truck dispatcher included.`,
          seller: { '@id': `${SITE_URL}/#organization` },
          itemOffered: { '@type': 'Service', name: 'Dispatch for all other truck types', url: `${SITE_URL}/pricing` },
        },
      ],
    }} />
    <PricingPageClient />
  </>;
}
