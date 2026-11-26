'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { clearLegacyGoogleMeasurement, reportContactLinkClick, sanitizeAnalyticsEvent } from '@/lib/track';

/**
 * Mount once in the root layout. Renders nothing: Vercel Web Analytics is
 * cookieless, so visitors are never shown a consent prompt. Web Analytics must
 * also be enabled for the project in the Vercel dashboard before data appears.
 */
export function SiteAnalytics() {
  useEffect(() => { clearLegacyGoogleMeasurement(); }, []);
  // One listener for the whole page, in the capture phase, so every phone, SMS,
  // WhatsApp and email link counts as a Google Ads contact conversion even if
  // the link has no click handler of its own or another handler stops the event.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (link) reportContactLinkClick(link.getAttribute('href'));
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return <Analytics beforeSend={sanitizeAnalyticsEvent} />;
}
