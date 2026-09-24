import type { MetadataRoute } from 'next';
import { EQUIPMENT_CONTENT, SERVICE_CONTENT, GUIDES } from '@/lib/dispatch-content';
import { SITE_URL } from '@/lib/seo';

// Dates reflect the actual content revision; do not change merely on a rebuild.
const CONTENT_UPDATED = '2026-09-24';
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '', '/services', '/equipment', '/pricing', '/contact', '/about', '/faq',
    '/testimonials', '/privacy', '/terms', '/service-areas', '/resources',
    ...EQUIPMENT_CONTENT.map(({ slug }) => `/equipment/${slug}`),
    ...SERVICE_CONTENT.map(({ slug }) => `/services/${slug}`),
    ...GUIDES.map(({ slug }) => `/resources/${slug}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: CONTENT_UPDATED }));
}
