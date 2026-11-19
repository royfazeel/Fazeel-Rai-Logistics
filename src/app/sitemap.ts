import { PAGE_SEO_OVERRIDES } from '@/lib/page-overrides';
import type { MetadataRoute } from 'next';
import { EQUIPMENT_CONTENT, SERVICE_CONTENT, GUIDES, GUIDES_QUOTING_FEES } from '@/lib/dispatch-content';
import { DISPATCH_FEE_EFFECTIVE_DATE } from '@/lib/dispatch-pricing';
import { CARRIER_CONTENT } from '@/lib/carrier-content';
import { HOME_HERO_IMAGE, SITE_URL } from '@/lib/seo';
import { EQUIPMENT_IMAGES } from '@/lib/equipment-images';

// Dates reflect the actual content revision; do not change merely on a rebuild.
const CONTENT_UPDATED = '2026-09-24';
const PAGE_REVISIONS: Record<string, string> = {
  '/services': '2026-10-30',
  '/pricing': '2026-10-31',
  '/faq': '2026-10-30',
  '/carriers': '2026-10-30', '/service-areas': '2026-10-30',
  '/resources/trucking-dispatch-glossary': '2026-10-30',
  '/tools/load-profit-calculator': '2026-10-31',
  '/editorial-standards': '2026-10-30',
  '/what-to-expect': '2026-10-30',
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
  '/services/load-booking': '2026-10-30',
  '/services/regional-dispatch': '2026-10-30',
  '/services/otr-dispatch': '2026-10-30',
  '/services/dedicated-dispatcher': '2026-10-30',
  '/services/scheduling': '2026-10-30',
  '/services/expedited-dispatch': '2026-10-30',
  '/services/backhaul-dispatch': '2026-10-30',
  // This release revises the titles, descriptions and headings of these pages.
  // Fixed review date; a future build must not advance it automatically.
  ...Object.fromEntries(Object.keys(PAGE_SEO_OVERRIDES).map(path => [path === '/' ? '' : path, '2026-10-31'])),
  // November 2: owner clarified that the registered address is for mail only.
  '/about': '2026-11-03', '/contact': '2026-11-02',
  // November 2: full equipment catalog, distinct introductions and aligned service metadata.
  '': '2026-11-02', '/equipment': '2026-11-02',
  ...Object.fromEntries(EQUIPMENT_CONTENT.map(content => [`/equipment/${content.slug}`, '2026-11-02'])),
  ...Object.fromEntries(SERVICE_CONTENT.map(content => [`/services/${content.slug}`, '2026-11-02'])),
  ...Object.fromEntries(CARRIER_CONTENT.map(content => [`/carriers/${content.slug}`, '2026-11-02'])),
  // November 19: cookieless analytics replaced consent-gated Google Analytics;
  // the privacy and terms pages were rewritten. Keep these after the spreads
  // above, which would otherwise overwrite the dates.
  '/privacy': '2026-11-19', '/terms': '2026-11-19',
  // November 19: dry van load guide published and listed on the resources hub.
  // The dry van and box truck pages were revised, and seven more equipment
  // pages gained a plain fee question.
  '/resources/how-to-find-dry-van-loads': '2026-11-19', '/resources': '2026-11-19',
  // November 19: every published dispatch fee was lowered by one percentage point.
  // Each page below prints a fee or the fee range in its own content, which was
  // confirmed by comparing the rendered text of every page before and after the
  // change. Pages that state no fee (contact, privacy, editorial standards and
  // six guides) keep their earlier dates.
  ...Object.fromEntries([
    '', '/services', '/equipment', '/pricing', '/about', '/faq', '/what-to-expect', '/service-areas', '/carriers',
    '/resources/trucking-dispatch-glossary', '/tools/load-profit-calculator',
    ...EQUIPMENT_CONTENT.map(({ slug }) => `/equipment/${slug}`),
    ...SERVICE_CONTENT.map(({ slug }) => `/services/${slug}`),
    ...CARRIER_CONTENT.map(({ slug }) => `/carriers/${slug}`),
    ...GUIDES.filter(({ slug }) => GUIDES_QUOTING_FEES.has(slug)).map(({ slug }) => `/resources/${slug}`),
  ].map(path => [path, DISPATCH_FEE_EFFECTIVE_DATE])),
};
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '', '/services', '/equipment', '/pricing', '/contact', '/about', '/faq',
    '/what-to-expect', '/privacy', '/terms', '/service-areas', '/resources', '/carriers',
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
