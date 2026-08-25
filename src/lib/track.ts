/**
 * Conversion tracking shim.
 *
 * Google Ads needs to know which clicks and form submits turned into business,
 * otherwise you are paying for traffic you cannot measure. Everything funnels
 * through this one function so the call sites stay clean and so the whole
 * thing is a no-op until the site owner actually pastes their IDs into the
 * environment variables (see .env.example).
 *
 * It talks to whichever of these is present, in this order:
 *   1. gtag()      — Google Ads / GA4 (loaded by src/components/Analytics.tsx)
 *   2. dataLayer   — Google Tag Manager, if the owner prefers GTM
 * If neither exists (local dev, or before setup) it silently does nothing.
 */

export type TrackEvent =
  | 'call_click'
  | 'sms_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'quote_modal_open'
  | 'lead_submit';

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Google Ads conversion labels, e.g. 'AW-123456789/AbC-D_efGh'. Set only the
 * ones you created in Google Ads; anything left blank simply is not reported
 * as a conversion (the event still reaches GA4).
 */
const CONVERSION_LABELS: Partial<Record<TrackEvent, string | undefined>> = {
  call_click: process.env.NEXT_PUBLIC_GADS_CALL_LABEL,
  lead_submit: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL,
};

export function track(event: TrackEvent, params: Params = {}): void {
  if (typeof window === 'undefined') return;

  const payload: Params = { ...params };

  try {
    // GA4 / Google Ads event
    window.gtag?.('event', event, payload);

    // Google Ads conversion, when a label has been configured for this event
    const label = CONVERSION_LABELS[event];
    if (label) {
      window.gtag?.('event', 'conversion', { send_to: label, ...payload });
    }

    // GTM data layer, for owners who route everything through Tag Manager
    window.dataLayer?.push({ event, ...payload });
  } catch {
    // Never let analytics break a phone call or a form submit.
  }
}
