import type { MetadataRoute } from 'next';
import { EQUIPMENT_CONTENT, SERVICE_CONTENT, GUIDES } from '@/lib/dispatch-content';
import { CARRIER_CONTENT } from '@/lib/carrier-content';
import { HOME_HERO_IMAGE, SITE_URL } from '@/lib/seo';
import { EQUIPMENT_IMAGES } from '@/lib/equipment-images';

// Dates reflect the actual content revision; do not change merely on a rebuild.
const CONTENT_UPDATED = '2026-09-24';
const PAGE_REVISIONS: Record<string, string> = {
  '': '2026-09-28',
  '/services': '2026-09-28', '/equipment': '2026-09-28',
  '/pricing': '2026-09-28', '/contact': '2026-09-27',
  '/about': '2026-09-27', '/faq': '2026-09-27',
  '/resources': '2026-09-28',
  ...Object.fromEntries(EQUIPMENT_CONTENT.map(({ slug }) => [`/equipment/${slug}`, '2026-09-28'])),
  '/services/expedited-dispatch': '2026-09-28', '/services/backhaul-dispatch': '2026-09-28',
  '/services/rate-negotiation': '2026-09-27', '/services/load-booking': '2026-09-27',
  '/services/paperwork-support': '2026-09-27', '/services/scheduling': '2026-09-27',
  ...Object.fromEntries(GUIDES.map(guide => [`/resources/${guide.slug}`, guide.updated ?? guide.published])),
};
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '', '/services', '/equipment', '/pricing', '/contact', '/about', '/faq',
    '/testimonials', '/privacy', '/terms', '/service-areas', '/resources', '/carriers',
    ...EQUIPMENT_CONTENT.map(({ slug }) => `/equipment/${slug}`),
    ...SERVICE_CONTENT.map(({ slug }) => `/services/${slug}`),
    ...GUIDES.map(({ slug }) => `/resources/${slug}`),
    ...CARRIER_CONTENT.map(({ slug }) => `/carriers/${slug}`),
  ];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: PAGE_REVISIONS[path] ?? CONTENT_UPDATED,
    ...(path === '' ? { images: [`${SITE_URL}${HOME_HERO_IMAGE}`] } : {}),
    ...(path.startsWith('/equipment/') && EQUIPMENT_IMAGES[path.split('/').pop()!] ? {
      images: [`${SITE_URL}${EQUIPMENT_IMAGES[path.split('/').pop()!].src}`],
    } : {}),
  }));
}
