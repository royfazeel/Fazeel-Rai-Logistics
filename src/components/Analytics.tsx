'use client';

import Script from 'next/script';

/**
 * Retain the existing GA4 property through the domain migration. Public
 * NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GADS_ID values can override or extend it.
 * The inline bootstrap creates the standard gtag command queue after
 * hydration; the larger Google library waits until page load and idle time.
 * Calls to track() in between stay queued until the library consumes them.
 * Public environment values are inlined by Next.js and require a rebuild.
 */
const DEFAULT_GA4_ID = 'G-K31P16P0SB';

// Read at module scope so Next's build-time inlining can see the literal keys.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || DEFAULT_GA4_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export default function Analytics() {
  // De-duplicate in case the same ID is pasted into both variables by mistake.
  const ids = Array.from(
    new Set([GA4_ID, GADS_ID].map((id) => id?.trim()).filter(Boolean) as string[])
  );

  // If all configured IDs are empty after normalization, omit the tag.
  if (ids.length === 0) return null;

  // gtag.js only needs one ID in the URL; every other property is attached
  // below with its own config() call.
  const loaderId = ids[0];

  const bootstrap = [
    'window.dataLayer = window.dataLayer || [];',
    'function gtag(){dataLayer.push(arguments);}',
    "gtag('js', new Date());",
    ...ids.map((id) => `gtag('config', ${JSON.stringify(id)});`),
  ].join('\n');

  return (
    <>
      <Script id="google-tag-init" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script
        id="google-tag"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(loaderId)}`}
      />
    </>
  );
}
