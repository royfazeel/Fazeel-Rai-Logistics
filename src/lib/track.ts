import { createMeasurement, MEASUREMENT_CONFIG, referrerOrigin, type ConsentChoices, type EventParams, type TrackEvent } from './consent-measurement';
export type { TrackEvent } from './consent-measurement';

type GoogleWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let measurement: ReturnType<typeof createMeasurement> | null = null;

function clearMeasurementCookies(choices: ConsentChoices): void {
  const names = document.cookie.split(';').map(item => item.trim().split('=')[0]).filter(name => (!choices.analytics && /^_ga(?:_|$)/.test(name)) || (!choices.ads && /^_gcl_/.test(name)));
  const host = window.location.hostname;
  const domains = ['', host, `.${host}`, ...(host.endsWith('.raidispatch.com') ? ['.raidispatch.com'] : [])];
  for (const name of names) for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ''}`;
}

export function getMeasurement() {
  if (typeof window === 'undefined' || !MEASUREMENT_CONFIG.enabled) return null;
  if (measurement) return measurement;
  const google = window as GoogleWindow;
  const command = (...args: unknown[]) => {
    if (!google.gtag) {
      google.dataLayer = google.dataLayer || [];
      google.gtag = function () { google.dataLayer!.push(arguments); };
    }
    google.gtag(...args);
  };
  measurement = createMeasurement(MEASUREMENT_CONFIG, {
    command,
    load: id => {
      if (document.getElementById('rai-google-measurement')) return;
      const script = document.createElement('script');
      script.id = 'rai-google-measurement';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
    },
    withdraw: (choices, reload) => {
      if (!choices.analytics && MEASUREMENT_CONFIG.gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_CONFIG.gaId}`] = true;
      clearMeasurementCookies(choices);
      // A reload removes the already-loaded provider and starts with the saved choices.
      if (reload) window.location.reload();
    },
    // Page URLs omit query strings and hashes. Referrers retain only HTTP(S)
    // origins, without paths, credentials, query strings or fragments.
    page: () => `${window.location.origin}${window.location.pathname}`,
    referrer: () => referrerOrigin(document.referrer),
  });
  return measurement;
}

/** Measurement never delays or controls contact/navigation behavior. No pre-consent event queue. */
export function track(event: TrackEvent, params: EventParams = {}): void {
  try { getMeasurement()?.track(event, params); } catch { /* Contact remains available if measurement fails. */ }
}
