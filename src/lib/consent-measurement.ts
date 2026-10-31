/** Basic consent mode: never load a Google provider before explicit opt-in. */
export type ConsentChoices = { analytics: boolean; ads: boolean };
export type ConsentPreference = ConsentChoices & { version: 1; updatedAt: string };
export type MeasurementConfig = { gaId: string | null; adsId: string | null; adsLabel: string | null; enabled: boolean };
export const CONSENT_STORAGE_KEY = 'rai-measurement-consent-v1';
export const DENIED_CHOICES: ConsentChoices = { analytics: false, ads: false };

export function resolveMeasurementConfig(enabled?: string, gaId?: string, adsId?: string, adsLabel?: string): MeasurementConfig {
  const ga = /^G-[A-Z0-9]{4,20}$/.test(gaId || '') ? gaId! : null;
  const ads = /^AW-\d{5,20}$/.test(adsId || '') ? adsId! : null;
  const label = /^[A-Za-z0-9_-]{4,100}$/.test(adsLabel || '') ? adsLabel! : null;
  const active = enabled === 'true';
  return { gaId: active ? ga : null, adsId: active && label ? ads : null, adsLabel: active && ads ? label : null, enabled: active && Boolean(ga || (ads && label)) };
}

// Explicit public activation gate prevents old environment IDs enabling collection.
export const MEASUREMENT_CONFIG = resolveMeasurementConfig(
  process.env.NEXT_PUBLIC_MEASUREMENT_ENABLED,
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
);

export function parseConsentPreference(raw: string | null): ConsentPreference | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || typeof value.analytics !== 'boolean' || typeof value.ads !== 'boolean' || typeof value.updatedAt !== 'string' || !Number.isFinite(Date.parse(value.updatedAt))) return null;
    return { version: 1, analytics: value.analytics, ads: value.ads, updatedAt: value.updatedAt };
  } catch { return null; }
}
export function consentPreference(choices: ConsentChoices): ConsentPreference {
  return { version: 1, analytics: choices.analytics === true, ads: choices.ads === true, updatedAt: new Date().toISOString() };
}
export function consentSignals(choices: ConsentChoices) {
  return {
    analytics_storage: choices.analytics ? 'granted' : 'denied',
    ad_storage: choices.ads ? 'granted' : 'denied',
    ad_user_data: choices.ads ? 'granted' : 'denied',
    // This implementation measures advertising; it does not enable remarketing.
    ad_personalization: 'denied',
  };
}

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
function safeParams(params: EventParams) {
  const result: Record<string, string> = {};
  if (typeof params.source === 'string' && sources.has(params.source)) result.source = params.source;
  if (typeof params.location === 'string' && locations.has(params.location)) result.location = params.location;
  return result;
}
export type MeasurementPort = {
  command: (...args: unknown[]) => void;
  load: (id: string) => void;
  withdraw: (choices: ConsentChoices, reload: boolean) => void;
  page: () => string;
};

/** Small injectable runtime so provider gating and event routing can be tested without network access. */
export function createMeasurement(config: MeasurementConfig, port: MeasurementPort) {
  let choices = { ...DENIED_CHOICES };
  let initialized = false;
  let suspended = false;
  let previousPage = '';
  const configured = new Set<string>();
  const pageParams = () => ({ page_location: port.page(), page_referrer: '' });
  const pageView = () => {
    if (!choices.analytics || !config.gaId || suspended) return;
    const page = port.page();
    if (page === previousPage) return;
    previousPage = page;
    port.command('event', 'page_view', { ...pageParams(), send_to: config.gaId });
  };
  return {
    apply(next: ConsentChoices, reloadOnWithdrawal = true) {
      if (!config.enabled || suspended) return;
      const allowed = { analytics: next.analytics === true && Boolean(config.gaId), ads: next.ads === true && Boolean(config.adsId && config.adsLabel) };
      const withdrew = (choices.analytics && !allowed.analytics) || (choices.ads && !allowed.ads);
      choices = allowed;
      if (withdrew) {
        // Immediately close the event gate before notifying Google and unloading it.
        suspended = true;
        port.command('consent', 'update', consentSignals(choices));
        port.withdraw(choices, reloadOnWithdrawal);
        return;
      }
      if (!choices.analytics && !choices.ads) return;
      if (!initialized) {
        port.command('consent', 'default', consentSignals(DENIED_CHOICES));
        port.command('set', { ads_data_redaction: true, url_passthrough: false, allow_google_signals: false, allow_ad_personalization_signals: false });
      }
      port.command('consent', 'update', consentSignals(choices));
      if (!initialized) port.command('js', new Date());
      for (const id of [choices.analytics ? config.gaId : null, choices.ads ? config.adsId : null]) {
        if (!id || configured.has(id)) continue;
        port.command('config', id, { send_page_view: false, ...pageParams(), ignore_referrer: true, allow_google_signals: false, allow_ad_personalization_signals: false, allow_enhanced_conversions: false });
        configured.add(id);
      }
      if (!initialized) {
        initialized = true;
        port.load((choices.analytics ? config.gaId : config.adsId)!);
      }
      pageView();
    },
    pageView,
    track(event: TrackEvent, params: EventParams = {}) {
      if (!config.enabled || !initialized || suspended || !events.has(event)) return;
      // lead_submit is invoked only after the lead API accepts the submission.
      if (event === 'lead_submit' && !sources.has(String(params.source))) return;
      if (choices.analytics && config.gaId) port.command('event', event === 'lead_submit' ? 'generate_lead' : event, { ...safeParams(params), ...pageParams(), send_to: config.gaId });
      if (event === 'lead_submit' && choices.ads && config.adsId && config.adsLabel) port.command('event', 'conversion', { ...pageParams(), send_to: `${config.adsId}/${config.adsLabel}` });
    },
  };
}
