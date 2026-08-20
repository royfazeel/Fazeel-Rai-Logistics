import type { MetadataRoute } from 'next';

/**
 * robots.txt — allow everything, and point crawlers at the sitemap.
 * The API route is excluded: it accepts POSTs only and has nothing to index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://railogistics.us/sitemap.xml',
  };
}
