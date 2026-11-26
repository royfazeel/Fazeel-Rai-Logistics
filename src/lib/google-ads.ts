/**
 * Google Ads conversion measurement for the Rai Dispatch campaign.
 *
 * The Google tag is loaded on every page so the click identifier (gclid) an ad
 * adds to the landing address is kept in Google's first-party `_gcl_*`
 * cookies. A conversion is then reported when a visitor's inquiry is accepted
 * or a contact link is clicked.
 *
 * No consent prompt and no consent-mode command is involved: the tag is never
 * held back, so nothing on this website can reduce the conversions reported to
 * Google Ads. The disclosure lives in /privacy (Section 5).
 *
 * The values are public (they appear in the page source of any site that uses
 * Google Ads) and are kept in code on purpose: Google measurement variables
 * from earlier setups may still exist in the hosting project and must not be
 * able to switch a different advertising account on.
 */
export type ConversionEvent = 'lead_submit' | 'call_click' | 'sms_click' | 'whatsapp_click' | 'email_click';

export type GoogleAdsSettings = {
  /** Google tag ID shown by Google Ads for the account, for example `AW-1234567890`. */
  tagId: string;
  /**
   * One conversion action per event. Paste only the label: the part after the
   * slash in the event snippet's `send_to: 'AW-1234567890/AbC-D_efGhIjKlMn'`.
   * An event with an empty label is not reported as a conversion.
   */
  conversionLabels: Record<ConversionEvent, string>;
  /**
   * false: the tag measures ad results only. Visitors are not added to Google
   * Ads remarketing audiences and are not used for personalized ads, which is
   * what /privacy says. This does not change conversion counting.
   */
  remarketing: boolean;
};

/** Everything stays inert until `tagId` is filled in. */
export const GOOGLE_ADS: GoogleAdsSettings = {
  tagId: '',
  conversionLabels: {
    // Accepted contact-page and quote-form inquiries (the main lead conversion).
    lead_submit: '',
    // Clicks on a phone link.
    call_click: '',
    // Optional: clicks on the text-message, WhatsApp and email links.
    sms_click: '',
    whatsapp_click: '',
    email_click: '',
  },
  remarketing: false,
};

export type GoogleAdsConfig = { tagId: string | null; sendTo: Partial<Record<ConversionEvent, string>>; remarketing: boolean };

const CONVERSION_EVENTS: readonly ConversionEvent[] = ['lead_submit', 'call_click', 'sms_click', 'whatsapp_click', 'email_click'];
const TAG_ID = /^AW-\d{6,20}$/;
const LABEL = /^[A-Za-z0-9_-]{4,100}$/;

/** Accept only well-formed values; a typo switches measurement off rather than sending it somewhere else. */
export function resolveGoogleAds(settings: GoogleAdsSettings): GoogleAdsConfig {
  const tagId = TAG_ID.test(settings.tagId) ? settings.tagId : null;
  const sendTo: Partial<Record<ConversionEvent, string>> = {};
  if (tagId) for (const event of CONVERSION_EVENTS) {
    const label = settings.conversionLabels[event];
    if (typeof label === 'string' && LABEL.test(label)) sendTo[event] = `${tagId}/${label}`;
  }
  return { tagId, sendTo, remarketing: settings.remarketing === true };
}

export const GOOGLE_ADS_CONFIG = resolveGoogleAds(GOOGLE_ADS);

/** Address of Google's tag library for this account. */
export function googleTagSrc(config: GoogleAdsConfig = GOOGLE_ADS_CONFIG): string | null {
  return config.tagId ? `https://www.googletagmanager.com/gtag/js?id=${config.tagId}` : null;
}

/**
 * Inline start-up commands for the Google tag. There is deliberately no
 * `consent` command: Google's tag then works with its normal cookies for
 * every visitor.
 */
export function googleTagBootstrap(config: GoogleAdsConfig = GOOGLE_ADS_CONFIG): string | null {
  if (!config.tagId) return null;
  const options = config.remarketing ? '' : ',{allow_ad_personalization_signals:false}';
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(config.tagId)}${options});`;
}

type TagWindow = { dataLayer?: unknown[] };

/**
 * Report one conversion to Google Ads. Only the conversion action is named;
 * no form field, placement label or other detail is attached. The command is
 * queued, so a click made before Google's library has finished loading is
 * still reported once it has.
 */
export function reportAdsConversion(event: string, config: GoogleAdsConfig = GOOGLE_ADS_CONFIG): boolean {
  if (typeof window === 'undefined') return false;
  const sendTo = Object.prototype.hasOwnProperty.call(config.sendTo, event) ? config.sendTo[event as ConversionEvent] : undefined;
  if (!sendTo) return false;
  try {
    const target = window as unknown as TagWindow;
    const queue = (target.dataLayer = target.dataLayer || []);
    // Google's library only recognizes commands queued as an `arguments` object.
    (function () { queue.push(arguments); } as (...command: unknown[]) => void)('event', 'conversion', { send_to: sendTo });
    return true;
  } catch { return false; /* Contact remains available if measurement fails. */ }
}
