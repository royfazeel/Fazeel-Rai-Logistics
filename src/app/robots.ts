import type { MetadataRoute } from 'next';

/**
 * robots.txt
 *
 * Two audiences:
 *
 *   1. Organic crawlers ('*') — allow everything, point at the sitemap. The
 *      API route is excluded: it accepts POSTs only and has nothing to index.
 *
 *   2. Google's ad crawlers (AdsBot-Google / AdsBot-Google-Mobile). These
 *      deliberately IGNORE the wildcard user-agent block, so a site that only
 *      writes rules for '*' has told them nothing. They fetch every landing
 *      page to score its quality and mobile experience; if they are blocked or
 *      ambiguous, ads can be disapproved for "Destination not working" and
 *      Landing Page Experience is scored blind. Spelled out explicitly here so
 *      there is no doubt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'AdsBot-Google-Mobile',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://railogistics.us/sitemap.xml',
    host: 'https://railogistics.us',
  };
}
