import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import { PAGE_SEO_OVERRIDES } from './page-overrides';
import type { Metadata } from 'next';

export const SITE_URL = 'https://raidispatch.com';
export const SITE_NAME = 'Rai Dispatch';
export const SHARE_IMAGE = '/opengraph-image';
export const HOME_HERO_IMAGE = '/images/rai-dispatch-hero-realistic.png';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const override = PAGE_SEO_OVERRIDES[path];
  const absoluteTitle = override?.title ?? `${title} | ${SITE_NAME}`;
  description = override?.description ?? description;
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    title: { absolute: absoluteTitle },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type: 'website', locale: 'en_US', siteName: SITE_NAME,
      title: absoluteTitle, description, url,
      images: [{ url: SHARE_IMAGE, width: 1200, height: 630, alt: `Rai Dispatch — We manage the loads. You drive the miles. Truck dispatch fees ${DISPATCH_RATE_RANGE} by equipment.` }],
    },
    twitter: { card: 'summary_large_image', title: absoluteTitle, description, images: [SHARE_IMAGE] },
  };
}
