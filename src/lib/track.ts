import { track as sendEvent, type BeforeSendEvent } from '@vercel/analytics';

/**
 * Cookieless website measurement through Vercel Web Analytics.
 *
 * The analytics script is served from this website's own host, sets no
 * cookies and stores nothing in the browser, so there is no consent prompt.
 * Google Analytics and the Google tag are not loaded anywhere on the site.
 */
export type TrackEvent = 'call_click' | 'sms_click' | 'whatsapp_click' | 'email_click' | 'quote_modal_open' | 'lead_submit';
export type EventParams = Record<string, string | number | boolean | undefined>;

const events = new Set<string>(['call_click', 'sms_click', 'whatsapp_click', 'email_click', 'quote_modal_open', 'lead_submit']);
const sources = new Set(['contact_page', 'quote_modal', 'exit_intent_popup']);
// Only code-owned placements can be sent. Drop arbitrary strings and all form data.
const locations = new Set([
  'home_dispatcher_card', 'home_final_cta', 'home_hero', 'home_how_it_works', 'home_ratecheck_card', 'home_services_cta',
  'about_dispatcher_card', 'about_final_cta', 'about_hero', 'contact_faq_cta', 'contact_final_cta', 'contact_form_error',
  'contact_form_intro', 'contact_hero', 'contact_method_card', 'equipment_final_cta', 'equipment_hero', 'faq_final_cta',
  'faq_help_section', 'faq_top_bar', 'pricing_final_cta', 'pricing_hero', 'services_detail_call', 'services_final_cta',
  'services_hero', 'carrier_experience_cta', 'header_desktop', 'header_mobile_icon', 'header_mobile_menu', 'pricing_preview',
  'pricing_preview_percentage', 'quote_modal_loading_error', 'quote_modal_call_instead', 'quote_modal_error', 'quote_modal_success',
  'mobile_bottom_bar', 'sticky_desktop_call', 'sticky_desktop_expanded',
]);

export function safeParams(params: EventParams): Record<string, string> {
  const result: Record<string, string> = {};
  if (typeof params.source === 'string' && sources.has(params.source)) result.source = params.source;
  if (typeof params.location === 'string' && locations.has(params.location)) result.location = params.location;
  return result;
}

/**
 * Applied to every page view and event before it leaves the browser: report
 * the page without its query string or fragment. An address that cannot be
 * read is not sent at all.
 */
export function sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const url = new URL(event.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return { ...event, url: `${url.origin}${url.pathname}` };
  } catch { return null; }
}

/** Measurement never delays or controls contact/navigation behavior. */
export function track(event: TrackEvent, params: EventParams = {}): void {
  if (typeof window === 'undefined' || !events.has(event)) return;
  // lead_submit is invoked only after the lead API accepts the submission.
  if (event === 'lead_submit' && !sources.has(String(params.source))) return;
  try { sendEvent(event, safeParams(params)); } catch { /* Contact remains available if measurement fails. */ }
}

/**
 * One-time tidy-up for browsers that used the earlier consent-gated Google
 * Analytics setup: forget the saved consent choice and expire the Google
 * cookies it may have set. Google cookies last up to two years, so this can be
 * deleted after November 2028.
 */
export const LEGACY_CONSENT_STORAGE_KEY = 'rai-measurement-consent-v1';
export function clearLegacyGoogleMeasurement(): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY); } catch { /* Storage can be blocked; nothing to remove then. */ }
  try {
    const names = document.cookie.split(';').map(item => item.trim().split('=')[0]).filter(name => /^_ga(?:_|$)/.test(name) || /^_gcl_/.test(name));
    const host = window.location.hostname;
    const domains = ['', host, `.${host}`, ...(host.endsWith('.raidispatch.com') ? ['.raidispatch.com'] : [])];
    for (const name of names) for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ''}`;
  } catch { /* Cookies can be unavailable; the site works either way. */ }
}
