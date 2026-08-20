import { NextResponse } from 'next/server';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';

/**
 * POST /api/lead — the single intake endpoint for every lead form on the site.
 *
 * Consumed by:
 *   - src/app/contact/ContactPageClient.tsx   (source: 'contact_page')
 *   - src/components/QuoteModal.tsx           (source: 'quote_modal')
 *   - src/components/LeadCapturePopup.tsx     (source: 'exit_intent_popup')
 *
 * Delivery is env-driven and additive — whatever is configured runs:
 *   RESEND_API_KEY + LEAD_TO_EMAIL + LEAD_FROM_EMAIL -> email via Resend HTTP API
 *   LEAD_WEBHOOK_URL                                 -> raw JSON POST (Zapier/Make/Sheets)
 * If NOTHING is configured we return 503 not_configured. We never tell a
 * visitor their lead was delivered when it wasn't.
 */

// Node runtime (not edge): we want plain fetch + a module-scoped Map, and
// Node keeps process.env access straightforward.
export const runtime = 'nodejs';
// Never cache or statically evaluate a mutation endpoint.
export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ *
 * Limits — everything the client sends is treated as hostile.
 * ------------------------------------------------------------------ */

const MAX_BODY_BYTES = 16 * 1024; // 16 KB is generous for a contact form
const MAX_FIELD_CHARS = 200;
const MAX_MESSAGE_CHARS = 2000;
const MAX_URL_CHARS = 500;
const MAX_USER_AGENT_CHARS = 400;

const VALID_SOURCES = ['contact_page', 'quote_modal', 'exit_intent_popup'] as const;
type LeadSource = (typeof VALID_SOURCES)[number];

/** Short text fields accepted from the forms, in the order they appear in the email. */
const TEXT_FIELDS = [
  'name',
  'phone',
  'email',
  'mcNumber',
  'equipment',
  'currentStatus',
  'factoring',
  'lanes',
] as const;
type TextField = (typeof TEXT_FIELDS)[number];

const FIELD_LABELS: Record<TextField | 'message' | 'requestCallback', string> = {
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  mcNumber: 'MC Number',
  equipment: 'Equipment',
  currentStatus: 'Current Status',
  factoring: 'Factoring',
  lanes: 'Preferred Lanes',
  message: 'Message',
  requestCallback: 'Prefers a callback',
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  contact_page: 'Contact page form',
  quote_modal: 'Quote modal',
  exit_intent_popup: 'Exit-intent popup',
};

/* ------------------------------------------------------------------ *
 * Rate limiting.
 *
 * BEST-EFFORT AND PER-INSTANCE ONLY. This Map lives in the memory of one
 * serverless instance; Vercel runs many and recycles them freely, so a
 * determined attacker can get around it by spreading requests. It exists to
 * stop casual form-spam loops, not as a security control. If real abuse
 * shows up, move this to Upstash/Redis or put the route behind Vercel's
 * WAF / a Cloudflare rule.
 * ------------------------------------------------------------------ */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_TRACKED_IPS = 5000; // bound memory on a hot instance

const rateLimitBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  // Opportunistic sweep so an instance that lives a long time doesn't grow
  // a bucket for every IP that ever hit it. (forEach rather than for-of:
  // the project targets ES5 and Map iteration needs downlevelIteration.)
  if (rateLimitBuckets.size > RATE_LIMIT_MAX_TRACKED_IPS) {
    const expired: string[] = [];
    rateLimitBuckets.forEach((stamps, key) => {
      const kept = stamps.filter((t) => t > cutoff);
      if (kept.length === 0) expired.push(key);
      else rateLimitBuckets.set(key, kept);
    });
    expired.forEach((key) => rateLimitBuckets.delete(key));
  }

  const recent = (rateLimitBuckets.get(ip) ?? []).filter((t) => t > cutoff);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitBuckets.set(ip, recent);
  return false;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // Left-most entry is the original client on Vercel.
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim().slice(0, 64);
  return 'unknown';
}

/* ------------------------------------------------------------------ *
 * Validation helpers.
 * ------------------------------------------------------------------ */

// Control characters. Short fields get ALL of them flattened to a space —
// that includes CR/LF, which is what stops someone smuggling extra headers
// through a name or email field. The message field keeps real line breaks.
// eslint-disable-next-line no-control-regex
const ALL_CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_KEEP_NEWLINES = /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g;

/** Trim, strip control chars (incl. header-injection newlines in short fields), cap length. */
function cleanText(value: unknown, maxChars: number, allowNewlines = false): string {
  if (typeof value !== 'string') return '';
  const cleaned = allowNewlines
    ? value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARS_KEEP_NEWLINES, '')
    : value.replace(ALL_CONTROL_CHARS, ' ');
  return cleaned.trim().slice(0, maxChars);
}

/** Deliberately loose: enough to reject junk, not so strict it drops a real customer. */
function isPlausibleEmail(value: string): boolean {
  if (value.length > 254) return false;
  return /^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(\.[^\s@.,;:<>()[\]\\]+)+$/.test(value);
}

/** US-ish sanity check — 10 digits, or 11 starting with a country code 1. */
function isPlausibleUsPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith('1')) return true;
  // Allow a slightly longer international number rather than rejecting a real lead.
  return digits.length >= 10 && digits.length <= 15;
}

function equipmentLabel(id: string): string {
  const match = EQUIPMENT_TYPES.find((eq) => eq.id === id);
  return match ? match.name : id;
}

/**
 * Normalise a submitted phone number into a dependable tel: href.
 * A bare 10-digit US number works when dialled from a US handset but not from
 * every mail client or VoIP app, so we promote to E.164 where we safely can.
 */
function telHref(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+')) return `tel:+${digits}`;
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `tel:+${digits}`;
  return `tel:${digits}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

/* ------------------------------------------------------------------ *
 * The lead shape we build once and hand to every delivery channel.
 * ------------------------------------------------------------------ */

interface Lead {
  source: LeadSource;
  sourceLabel: string;
  submittedAt: string; // ISO-8601, UTC
  submittedAtLocal: string; // human-readable, business timezone
  pageUrl: string;
  userAgent: string;
  ip: string;
  fields: Array<{ key: string; label: string; value: string }>;
  raw: Record<string, string | boolean>;
}

function buildEmailSubject(lead: Lead): string {
  const name = lead.raw.name as string;
  const equipment = lead.raw.equipment ? ` · ${equipmentLabel(lead.raw.equipment as string)}` : '';
  return `New lead: ${name}${equipment} (${lead.sourceLabel})`;
}

function buildEmailText(lead: Lead): string {
  const lines = [
    `New ${lead.sourceLabel.toLowerCase()} submission — ${BUSINESS.name}`,
    '',
    ...lead.fields.map((f) => `${f.label}: ${f.value}`),
    '',
    '--- Context ---',
    `Submitted: ${lead.submittedAtLocal}`,
    `Submitted (UTC): ${lead.submittedAt}`,
    `Source: ${lead.source}`,
    `Page: ${lead.pageUrl || '(not reported)'}`,
    `Browser: ${lead.userAgent || '(not reported)'}`,
    `IP: ${lead.ip}`,
  ];
  return lines.join('\n');
}

function buildEmailHtml(lead: Lead): string {
  const rows = lead.fields
    .map(
      (f) =>
        `<tr>` +
        `<td style="padding:6px 14px 6px 0;color:#5b6270;font:600 13px/1.5 Arial,sans-serif;white-space:nowrap;vertical-align:top;">${escapeHtml(
          f.label
        )}</td>` +
        `<td style="padding:6px 0;color:#14161C;font:400 15px/1.5 Arial,sans-serif;">${escapeHtml(
          f.value
        ).replace(/\n/g, '<br>')}</td>` +
        `</tr>`
    )
    .join('');

  const meta = [
    ['Submitted', lead.submittedAtLocal],
    ['Source', lead.sourceLabel],
    ['Page', lead.pageUrl || '(not reported)'],
    ['Browser', lead.userAgent || '(not reported)'],
    ['IP', lead.ip],
  ]
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:4px 14px 4px 0;color:#8a909c;font:600 12px/1.5 Arial,sans-serif;white-space:nowrap;vertical-align:top;">${escapeHtml(
          label
        )}</td>` +
        `<td style="padding:4px 0;color:#5b6270;font:400 12px/1.5 Arial,sans-serif;word-break:break-all;">${escapeHtml(
          value
        )}</td>` +
        `</tr>`
    )
    .join('');

  const phone = lead.raw.phone as string;
  const callHref = telHref(phone);

  return [
    `<div style="background:#f4f5f7;padding:24px;">`,
    `<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e3e5ea;border-radius:6px;overflow:hidden;">`,
    `<div style="background:#14161C;padding:18px 24px;">`,
    `<div style="color:#C8232C;font:700 12px/1.4 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;">New lead</div>`,
    `<div style="color:#ffffff;font:700 22px/1.3 Arial,sans-serif;margin-top:4px;">${escapeHtml(
      lead.raw.name as string
    )}</div>`,
    `<div style="color:rgba(255,255,255,.7);font:400 13px/1.5 Arial,sans-serif;margin-top:2px;">${escapeHtml(
      lead.sourceLabel
    )}</div>`,
    `</div>`,
    `<div style="padding:20px 24px;">`,
    `<a href="${escapeHtml(
      callHref
    )}" style="display:inline-block;background:#C8232C;color:#ffffff;font:700 14px/1 Arial,sans-serif;padding:12px 20px;border-radius:6px;text-decoration:none;margin-bottom:18px;">Call ${escapeHtml(
      phone
    )}</a>`,
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${rows}</table>`,
    `<hr style="border:none;border-top:1px solid #e3e5ea;margin:18px 0;">`,
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${meta}</table>`,
    `</div></div></div>`,
  ].join('');
}

/* ------------------------------------------------------------------ *
 * Delivery channels.
 * ------------------------------------------------------------------ */

async function deliverViaResend(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY as string;
  const to = process.env.LEAD_TO_EMAIL || BUSINESS.email;
  const from = process.env.LEAD_FROM_EMAIL as string;

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject: buildEmailSubject(lead),
    text: buildEmailText(lead),
    html: buildEmailHtml(lead),
  };

  // Replying to the notification should reach the carrier directly.
  const replyTo = lead.raw.email as string | undefined;
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 500)}`);
  }
}

async function deliverViaWebhook(lead: Lead): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL as string;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: lead.source,
      sourceLabel: lead.sourceLabel,
      submittedAt: lead.submittedAt,
      submittedAtLocal: lead.submittedAtLocal,
      pageUrl: lead.pageUrl,
      userAgent: lead.userAgent,
      ip: lead.ip,
      ...lead.raw,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Webhook responded ${res.status}: ${detail.slice(0, 500)}`);
  }
}

/* ------------------------------------------------------------------ *
 * Handler.
 * ------------------------------------------------------------------ */

export async function POST(req: Request) {
  const ip = clientIp(req);

  // 1. Size guard — cheapest rejection first, before we parse anything.
  const declaredLength = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return fail(413, 'payload_too_large', 'That submission was too large.');
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return fail(400, 'invalid_body', 'We could not read that submission.');
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return fail(413, 'payload_too_large', 'That submission was too large.');
  }

  // 2. Parse.
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return fail(400, 'invalid_json', 'We could not read that submission.');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return fail(400, 'invalid_json', 'We could not read that submission.');
  }
  const body = parsed as Record<string, unknown>;

  // 3. Honeypot. Real people never see this field, let alone fill it.
  //    Return a clean 200 so the bot logs a success and moves on — telling it
  //    the truth just teaches it which field to skip next time.
  const honeypot = cleanText(body.company, MAX_FIELD_CHARS);
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 4. Rate limit.
  if (isRateLimited(ip)) {
    return fail(
      429,
      'rate_limited',
      `Too many submissions from this connection. Please call ${BUSINESS.phone}.`
    );
  }

  // 5. Validate.
  const source = cleanText(body.source, 40) as LeadSource;
  if (!VALID_SOURCES.includes(source)) {
    return fail(400, 'invalid_source', 'We could not read that submission.');
  }

  const values: Record<string, string> = {};
  for (const field of TEXT_FIELDS) {
    values[field] = cleanText(body[field], MAX_FIELD_CHARS);
  }
  const message = cleanText(body.message, MAX_MESSAGE_CHARS, true);
  const requestCallback = body.requestCallback === true;

  if (!values.name) {
    return fail(400, 'missing_name', 'Please tell us your name.');
  }
  if (!values.phone) {
    return fail(400, 'missing_phone', 'Please give us a phone number we can reach you on.');
  }
  if (!isPlausibleUsPhone(values.phone)) {
    return fail(400, 'invalid_phone', 'That phone number does not look right — please check it.');
  }
  if (values.email && !isPlausibleEmail(values.email)) {
    return fail(400, 'invalid_email', 'That email address does not look right — please check it.');
  }

  // 6. Is anything actually wired up? Check BEFORE claiming success.
  const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.LEAD_FROM_EMAIL);
  const webhookConfigured = Boolean(process.env.LEAD_WEBHOOK_URL);
  if (!resendConfigured && !webhookConfigured) {
    console.error(
      '[api/lead] Dropping a real lead: no delivery channel configured. ' +
        'Set RESEND_API_KEY + LEAD_FROM_EMAIL + LEAD_TO_EMAIL, or LEAD_WEBHOOK_URL. ' +
        'See README "Lead form setup".'
    );
    return fail(
      503,
      'not_configured',
      'Lead delivery is not configured on this site yet.'
    );
  }

  // 7. Build the lead record.
  const now = new Date();
  let submittedAtLocal: string;
  try {
    submittedAtLocal = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(now) + ' CST/CDT';
  } catch {
    submittedAtLocal = now.toUTCString();
  }

  const fields: Lead['fields'] = [];
  for (const field of TEXT_FIELDS) {
    const value = values[field];
    if (!value) continue;
    fields.push({
      key: field,
      label: FIELD_LABELS[field],
      value: field === 'equipment' ? equipmentLabel(value) : value,
    });
  }
  if (message) {
    fields.push({ key: 'message', label: FIELD_LABELS.message, value: message });
  }
  if (requestCallback) {
    fields.push({ key: 'requestCallback', label: FIELD_LABELS.requestCallback, value: 'Yes' });
  }

  const lead: Lead = {
    source,
    sourceLabel: SOURCE_LABELS[source],
    submittedAt: now.toISOString(),
    submittedAtLocal,
    pageUrl:
      cleanText(body.pageUrl, MAX_URL_CHARS) ||
      cleanText(req.headers.get('referer'), MAX_URL_CHARS),
    userAgent: cleanText(req.headers.get('user-agent'), MAX_USER_AGENT_CHARS),
    ip,
    fields,
    raw: {
      ...values,
      message,
      requestCallback,
    },
  };

  // 8. Deliver. Every configured channel runs; we only report success if at
  //    least one of them actually accepted the lead.
  const attempts: Array<Promise<void>> = [];
  const channelNames: string[] = [];
  if (resendConfigured) {
    channelNames.push('resend');
    attempts.push(deliverViaResend(lead));
  }
  if (webhookConfigured) {
    channelNames.push('webhook');
    attempts.push(deliverViaWebhook(lead));
  }

  const results = await Promise.allSettled(attempts);
  const delivered = results.some((r) => r.status === 'fulfilled');

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      // Server-side only. The message may contain provider detail but never
      // the API key — we only ever log result text, not the request headers.
      console.error(
        `[api/lead] delivery via ${channelNames[i]} failed:`,
        result.reason instanceof Error ? result.reason.message : String(result.reason)
      );
    }
  });

  if (!delivered) {
    return fail(
      502,
      'delivery_failed',
      'We could not send that message just now.'
    );
  }

  return NextResponse.json({ ok: true });
}

/** Anything that isn't a POST gets a clear, boring answer. */
export async function GET() {
  return fail(405, 'method_not_allowed', 'Use POST to submit a lead.');
}
