import { EQUIPMENT_TYPES } from './constants';
import { SITE_URL } from './seo';
import { getEquipmentOfferDescription } from './dispatch-pricing';

// These entities correspond to the visible equipment links and equipment pages.
export function equipmentOfferCatalog() {
  return {
    '@type': 'OfferCatalog', '@id': `${SITE_URL}/equipment#dispatch-equipment`,
    name: 'Rai Dispatch equipment services', url: `${SITE_URL}/equipment`,
    itemListElement: EQUIPMENT_TYPES.map(equipment => ({
      '@type': 'Offer', url: `${SITE_URL}/equipment/${equipment.id}`,
      description: getEquipmentOfferDescription(equipment.id),
      seller: { '@id': `${SITE_URL}/#organization` },
      itemOffered: { '@type': 'Service', '@id': `${SITE_URL}/equipment/${equipment.id}#service`, name: `${equipment.name} dispatch`, url: `${SITE_URL}/equipment/${equipment.id}` },
    })),
  };
}
