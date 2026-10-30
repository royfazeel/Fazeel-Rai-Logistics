import { pageMetadata, SITE_URL } from '@/lib/seo';
import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import { EQUIPMENT_TYPES } from '@/lib/constants';
import { specialtyOfferCatalog } from '@/lib/equipment-schema';
import { ContentJsonLd } from '@/components/content/ContentDetail';
import EquipmentPageClient from './EquipmentPageClient';

export const metadata = pageMetadata('Truck Dispatch Services by Equipment Type', `Explore 15 truck and trailer types, from dry vans and reefers to Sprinter vans, Conestogas and lowboys. ${DISPATCH_RATE_RANGE} dispatch fees, free setup and dedicated support.`, '/equipment');

export default function EquipmentPage() {
  return <>
    <ContentJsonLd data={{ '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': `${SITE_URL}/equipment#page`, url: `${SITE_URL}/equipment`, name: 'Truck dispatch services by equipment type', isPartOf: { '@id': `${SITE_URL}/#website` }, mainEntity: { '@type': 'ItemList', numberOfItems: EQUIPMENT_TYPES.length, itemListElement: EQUIPMENT_TYPES.map((equipment, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Service', '@id': `${SITE_URL}/equipment/${equipment.id}#service`, name: `${equipment.name} dispatch`, url: `${SITE_URL}/equipment/${equipment.id}` } })) } },
      specialtyOfferCatalog(),
    ] }} />
    <EquipmentPageClient />
  </>;
}
