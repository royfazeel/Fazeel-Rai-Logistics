import type { MetadataRoute } from 'next';
import { EQUIPMENT_CONTENT, SERVICE_CONTENT, GUIDES } from '@/lib/dispatch-content';
import { CARRIER_CONTENT } from '@/lib/carrier-content';
import { HOME_HERO_IMAGE, SITE_URL } from '@/lib/seo';
import { EQUIPMENT_IMAGES } from '@/lib/equipment-images';

// Dates reflect the actual content revision; do not change merely on a rebuild.
const CONTENT_UPDATED = '2026-09-24';
const PAGE_REVISIONS: Record<string, string> = {
  '': '2026-10-31',
  '/services': '2026-10-30', '/equipment': '2026-10-30',
  '/pricing': '2026-10-31', '/contact': '2026-10-30',
  '/about': '2026-10-30', '/faq': '2026-10-30',
  '/carriers': '2026-10-30', '/service-areas': '2026-10-30',
  '/resources': '2026-10-30',
  '/resources/trucking-dispatch-glossary': '2026-10-30',
  '/tools/load-profit-calculator': '2026-10-31',
  '/editorial-standards': '2026-10-30',
  '/privacy': '2026-10-26', '/terms': '2026-10-30',
  '/testimonials': '2026-10-30',
  ...Object.fromEntries(EQUIPMENT_CONTENT.map(({ slug }) => [`/equipment/${slug}`, '2026-10-30'])),
  ...Object.fromEntries(SERVICE_CONTENT.map(({ slug }) => [`/services/${slug}`, '2026-10-30'])),
  // Each carrier page's published fee range changed with the October 30 schedule.
  ...Object.fromEntries(CARRIER_CONTENT.map(({ slug }) => [`/carriers/${slug}`, '2026-10-30'])),
  ...Object.fromEntries(GUIDES.map(guide => [`/resources/${guide.slug}`, guide.updated ?? guide.published])),
  '/equipment/reefer': '2026-10-30',
  '/equipment/flatbed': '2026-10-30',
  '/equipment/step-deck': '2026-10-30',
  '/equipment/hotshot': '2026-10-30',
  '/equipment/power-only': '2026-10-30',
  '/services/broker-communication': '2026-10-30',
  '/services/paperwork-support': '2026-10-30',
  '/services/rate-negotiation': '2026-10-30',
  '/services/route-strategy': '2026-10-30',
  '/equipment/box-truck': '2026-10-31',
  '/services/load-booking': '2026-10-30',
  '/services/regional-dispatch': '2026-10-30',
  '/services/otr-dispatch': '2026-10-30',
  '/services/dedicated-dispatcher': '2026-10-30',
  '/services/scheduling': '2026-10-30',
  '/services/expedited-dispatch': '2026-10-30',
  '/services/backhaul-dispatch': '2026-10-30',
};
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '', '/services', '/equipment', '/pricing', '/contact', '/about', '/faq',
    '/testimonials', '/privacy', '/terms', '/service-areas', '/resources', '/carriers',
    '/resources/trucking-dispatch-glossary', '/tools/load-profit-calculator', '/editorial-standards',
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
