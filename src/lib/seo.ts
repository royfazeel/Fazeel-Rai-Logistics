import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import type { Metadata } from 'next';

export const SITE_URL = 'https://raidispatch.com';
export const SITE_NAME = 'Rai Dispatch';
export const SHARE_IMAGE = '/opengraph-image';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', locale: 'en_US', siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`, description, url,
      images: [{ url: SHARE_IMAGE, width: 1200, height: 630, alt: `Rai Dispatch — dedicated truck dispatchers with equipment-based fees of ${DISPATCH_RATE_RANGE}` }],
    },
    twitter: { card: 'summary_large_image', title: `${title} | ${SITE_NAME}`, description, images: [SHARE_IMAGE] },
  };
}
