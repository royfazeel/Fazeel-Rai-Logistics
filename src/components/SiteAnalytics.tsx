'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { clearLegacyGoogleMeasurement, sanitizeAnalyticsEvent } from '@/lib/track';

/**
 * Mount once in the root layout. Renders nothing: Vercel Web Analytics is
 * cookieless, and visitors are never shown a consent prompt. Web Analytics must
 * also be enabled for the project in the Vercel dashboard before data appears.
 * Google Ads conversion measurement is separate: see GoogleAdsTag.
 */
export function SiteAnalytics() {
  useEffect(() => { clearLegacyGoogleMeasurement(); }, []);
  return <Analytics beforeSend={sanitizeAnalyticsEvent} />;
}
