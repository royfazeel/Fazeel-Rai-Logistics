import Script from 'next/script';
import { GOOGLE_ADS_ID } from '@/lib/track';

/**
 * Mount once in the root layout. Loads the Google tag for Google Ads
 * conversion measurement only (account 748-406-9019); Google Analytics is not
 * configured.
 *
 * No consent prompt is shown. The consent defaults are set to granted in the
 * same inline script, before the Google tag is requested, so the ad click
 * identifier is stored and conversions are reported without waiting for a
 * visitor choice. Do not add a consent banner that defaults these to denied
 * or holds back this script: conversions would stop being recorded.
 */
export function GoogleAdsTag() {
  return (
    <Script id="google-ads-tag" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}';document.head.appendChild(s);})();`}
    </Script>
  );
}
