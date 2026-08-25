'use client';

import Script from 'next/script';

/**
 * Google tag loader (GA4 and/or Google Ads).
 *
 * Reads its IDs from the environment so the site ships completely clean until
 * the owner is ready to advertise:
 *
 *   NEXT_PUBLIC_GA4_ID   e.g. G-XXXXXXXXXX   (Google Analytics 4)
 *   NEXT_PUBLIC_GADS_ID  e.g. AW-123456789   (Google Ads)
 *
 * If NEITHER is set this component renders nothing at all — no script tags, no
 * network requests, no console noise. If BOTH are set, gtag.js is loaded once
 * and `config` is called once per ID, which is exactly how Google documents
 * running Analytics and Ads off a single tag.
 *
 * NOTE for Next.js: `process.env.NEXT_PUBLIC_*` is inlined at BUILD time in
 * client bundles. Adding these variables in Vercel therefore requires a
 * redeploy before they take effect.
 */

// Read at module scope so Next's build-time inlining can see the literal keys.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export default function Analytics() {
  // De-duplicate in case the same ID is pasted into both variables by mistake.
  const ids = Array.from(
    new Set([GA4_ID, GADS_ID].map((id) => id?.trim()).filter(Boolean) as string[])
  );

  // Nothing configured — render nothing. This is the default state of the site.
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
      <Script
        id="google-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(loaderId)}`}
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {bootstrap}
      </Script>
    </>
  );
}
