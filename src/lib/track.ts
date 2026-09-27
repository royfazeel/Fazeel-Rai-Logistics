/**
 * Website measurement is disabled at the owner's request.
 * Keep the UI event interface inert so existing contact and quote interactions
 * remain independent of any analytics provider. No scripts, queues, cookies,
 * environment IDs or network requests are used here.
 */
export type TrackEvent =
  | 'call_click'
  | 'sms_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'quote_modal_open'
  | 'lead_submit';

type Params = Record<string, string | number | boolean | undefined>;

export function track(_event: TrackEvent, _params: Params = {}): void {
  // Intentionally disabled. Contact links and forms work without measurement.
}
