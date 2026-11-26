import Script from 'next/script';
import { googleTagBootstrap, googleTagSrc } from '@/lib/google-ads';

/**
 * Google tag for Google Ads conversion measurement. Mount once in the root
 * layout. It renders nothing until a tag ID is set in src/lib/google-ads.ts.
 *
 * Both scripts start right after the page becomes interactive, not at idle
 * time: the click identifier an ad adds to the landing address has to be read
 * before the visitor moves to another page. No consent prompt gates them.
 */
export function GoogleAdsTag() {
  const src = googleTagSrc();
  const bootstrap = googleTagBootstrap();
  if (!src || !bootstrap) return null;
  return (
    <>
      <Script id="google-ads-tag-init" strategy="afterInteractive">{bootstrap}</Script>
      <Script id="google-ads-tag" strategy="afterInteractive" src={src} />
    </>
  );
}
