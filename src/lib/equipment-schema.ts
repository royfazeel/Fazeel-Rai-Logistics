import { DISPATCH_SPECIALTIES } from './constants';
import { SITE_URL } from './seo';

// These entities correspond to the visible specialty links and equipment pages.
export function specialtyOfferCatalog() {
  return {
    '@type': 'OfferCatalog', '@id': `${SITE_URL}/equipment#dispatch-specialties`,
    name: 'Rai Dispatch equipment specialties', url: `${SITE_URL}/equipment`,
    itemListElement: DISPATCH_SPECIALTIES.map(equipment => ({
      '@type': 'Offer', url: `${SITE_URL}/equipment/${equipment.id}`,
      description: `${equipment.percentage} of gross revenue on loads we dispatch. Dedicated dispatcher included; billing base and scope confirmed in the agreement.`,
      seller: { '@id': `${SITE_URL}/#organization` },
      itemOffered: { '@type': 'Service', '@id': `${SITE_URL}/equipment/${equipment.id}#service`, name: `${equipment.name} dispatch`, url: `${SITE_URL}/equipment/${equipment.id}` },
    })),
  };
}
