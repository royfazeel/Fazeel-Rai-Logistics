import { NextResponse } from 'next/server';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';

/**
 * /api/lead — the single intake endpoint for every lead form on the site.
 *
 * POST — submit a lead. Consumed by:
 *   - src/app/contact/ContactPageClient.tsx   (source: 'contact_page')
 *   - src/components/QuoteModal.tsx           (source: 'quote_modal')
 *   - src/components/LeadCapturePopup.tsx     (source: 'exit_intent_popup' —
 *     the component is still in the repo but is not mounted in layout.tsx)
 *
 * GET — a non-sensitive configuration self-check the owner can open in a
 * browser (/api/lead) to see whether lead delivery is actually live. It
 * reports booleans only, never key values.
 *
 * Delivery is env-driven and additive — whatever is configured runs:
 *   RESEND_API_KEY + LEAD_FROM_EMAIL (+ LEAD_TO_EMAIL) -> email via Resend HTTP API
 *   LEAD_WEBHOOK_URL                                   -> raw JSON POST (Zapier/Make/Sheets)
 * If NOTHING is configured we return 503 not_configured. We never tell a
 * visitor their lead was delivered when it wasn't.
 *
 * When email is configured and the carrier gave an address, a short courtesy
 * auto-reply goes to them AFTER the owner's notification. It can never fail
 * the request — see sendAutoReply().
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

/** Short text fields accepted from the forms. */
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

/**
 * The order the notification email is written in — a CALLBACK order, not the
 * form order. A dispatcher reading this on a phone should be able to dial and
 * know who he is calling before he has to scroll.
 */
const CALLBACK_ORDER: TextField[] = [
  'name',
  'phone',
  'equipment',
  'mcNumber',
  'lanes',
  'currentStatus',
  'factoring',
  'email',
];

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
  requestCallback: 'Callback requested',
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  contact_page: 'Contact page form',
  quote_modal: 'Quote modal',
  exit_intent_popup: 'Exit-intent popup',
};

/**
 * The <select> values the forms post are machine ids. Nobody wants to read
 * "new-authority" at 6am, so they are decoded before they reach the inbox.
 * These must stay in step with the selects in ContactPageClient.tsx and
 * QuoteModal.tsx; an unrecognised id falls through to the raw value rather
 * than being dropped.
 */
const STATUS_LABELS: Record<string, string> = {
  'new-authority': 'New authority',
  switching: 'Switching dispatchers',
  'self-dispatch': 'Self-dispatching now',
  exploring: 'Just exploring',
};

const FACTORING_LABELS: Record<string, string> = {
  'have-factoring': 'Has a factoring company',
  'no-factoring': 'No factoring',
  'need-help': 'Needs help choosing',
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

/** Turn a stored field value into the human wording that goes in the email. */
function displayValue(field: TextField, value: string): string {
  if (field === 'equipment') return equipmentLabel(value);
  if (field === 'currentStatus') return STATUS_LABELS[value] ?? value;
  if (field === 'factoring') return FACTORING_LABELS[value] ?? value;
  return value;
}

/**
 * Normalise a submitted phone number into a dependable E.164 tel: href.
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

/** Same normalisation, as an sms: href — a dispatcher often texts first. */
function smsHref(phone: string): string {
  return telHref(phone).replace(/^tel:/, 'sms:');
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
 * Configuration — one place that decides what is switched on, shared by the
 * POST handler and the GET self-check so the two can never disagree.
 * ------------------------------------------------------------------ */

/** Email notifications need a key AND a verified from-address. */
function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_FROM_EMAIL);
}

function webhookConfigured(): boolean {
  return Boolean(process.env.LEAD_WEBHOOK_URL);
}

/**
 * The courtesy auto-reply rides on the same Resend setup as the owner
 * notification. LEAD_AUTO_REPLY=off turns it off without disturbing anything
 * else.
 */
function autoReplyConfigured(): boolean {
  const flag = (process.env.LEAD_AUTO_REPLY || '').trim().toLowerCase();
  if (flag === 'off' || flag === 'false' || flag === '0' || flag === 'no') return false;
  return resendConfigured();
}

/**
 * Resend's endpoint. Overridable ONLY so the delivery path can be pointed at
 * a local sink while testing — deliberately left out of the owner-facing
 * setup guide, and it must stay unset in production.
 */
function resendEndpoint(): string {
  return process.env.RESEND_API_URL || 'https://api.resend.com/emails';
}

/** Where the owner's lead notifications land. */
function ownerInbox(): string {
  return process.env.LEAD_TO_EMAIL || BUSINESS.email;
}

/**
 * The Resend "from" header, with a friendly display name.
 *
 * LEAD_FROM_EMAIL stays a PLAIN address (e.g. leads@railogistics.us) because
 * that is what Resend verifies against the sending domain. The display name is
 * added here instead, so inboxes show "Rai Dispatch" rather than a bare
 * address. If someone ever sets LEAD_FROM_EMAIL to a full "Name <addr>" string
 * we pass it through untouched rather than nesting the angle brackets.
 */
function senderAddress(): string {
  const address = (process.env.LEAD_FROM_EMAIL || '').trim();
  if (!address || address.includes('<')) return address;
  // Quote the display name if it contains RFC 5322 specials.
  const name = /[",;:<>@\[\]\\]/.test(BUSINESS.name)
    ? `"${BUSINESS.name.replace(/(["\\])/g, '\\$1')}"`
    : BUSINESS.name;
  return `${name} <${address}>`;
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

/**
 * Subject line. It gets read on a phone lock screen, so the two things that
 * decide whether the call happens now come first: who it is, and what he
 * drives.
 */
function buildEmailSubject(lead: Lead): string {
  const name = (lead.raw.name as string) || 'Carrier';
  const equipmentId = (lead.raw.equipment as string) || '';
  const parts = [name, equipmentId ? equipmentLabel(equipmentId) : 'Equipment not given'];
  if (lead.raw.requestCallback === true) parts.push('wants a callback');
  return `New lead: ${parts.join(' · ')}`;
}

function buildEmailText(lead: Lead): string {
  const phone = (lead.raw.phone as string) || '';
  const lines = [
    `New ${lead.sourceLabel.toLowerCase()} submission — ${BUSINESS.name}`,
    '',
    `CALL BACK: ${phone}   ${telHref(phone)}`,
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
  const phone = (lead.raw.phone as string) || '';

  const rows = lead.fields
    .map((f) => {
      // The phone row is a link as well as a button — some clients strip
      // button styling, and the number has to stay tappable regardless.
      const value =
        f.key === 'phone'
          ? `<a href="${escapeHtml(
              telHref(f.value)
            )}" style="color:#C8232C;font-weight:700;text-decoration:none;">${escapeHtml(
              f.value
            )}</a>`
          : escapeHtml(f.value).replace(/\n/g, '<br>');
      return (
        `<tr>` +
        `<td style="padding:6px 14px 6px 0;color:#5b6270;font:600 13px/1.5 Arial,sans-serif;white-space:nowrap;vertical-align:top;">${escapeHtml(
          f.label
        )}</td>` +
        `<td style="padding:6px 0;color:#14161C;font:400 15px/1.5 Arial,sans-serif;">${value}</td>` +
        `</tr>`
      );
    })
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

  const equipmentId = (lead.raw.equipment as string) || '';
  const strapline = [
    equipmentId ? equipmentLabel(equipmentId) : 'Equipment not given',
    lead.sourceLabel,
  ].join(' · ');

  return [
    `<div style="background:#f4f5f7;padding:24px;">`,
    `<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e3e5ea;border-radius:6px;overflow:hidden;">`,
    `<div style="background:#14161C;padding:18px 24px;">`,
    `<div style="color:#C8232C;font:700 12px/1.4 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;">New lead</div>`,
    `<div style="color:#ffffff;font:700 22px/1.3 Arial,sans-serif;margin-top:4px;">${escapeHtml(
      (lead.raw.name as string) || 'Carrier'
    )}</div>`,
    `<div style="color:rgba(255,255,255,.7);font:400 13px/1.5 Arial,sans-serif;margin-top:2px;">${escapeHtml(
      strapline
    )}</div>`,
    `</div>`,
    `<div style="padding:20px 24px;">`,
    `<div style="margin-bottom:18px;">`,
    `<a href="${escapeHtml(
      telHref(phone)
    )}" style="display:inline-block;background:#C8232C;color:#ffffff;font:700 14px/1 Arial,sans-serif;padding:12px 20px;border-radius:6px;text-decoration:none;margin-right:8px;">Call ${escapeHtml(
      phone
    )}</a>`,
    `<a href="${escapeHtml(
      smsHref(phone)
    )}" style="display:inline-block;background:#ffffff;color:#14161C;font:700 14px/1 Arial,sans-serif;padding:11px 18px;border:1px solid #c8ccd4;border-radius:6px;text-decoration:none;">Text</a>`,
    `</div>`,
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${rows}</table>`,
    `<hr style="border:none;border-top:1px solid #e3e5ea;margin:18px 0;">`,
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${meta}</table>`,
    `</div></div></div>`,
  ].join('');
}

/* ------------------------------------------------------------------ *
 * The carrier's courtesy auto-reply.
 *
 * It deliberately makes no promise the business has not already made on the
 * site: it confirms what arrived and points at the phone, which is both the
 * fastest route for the carrier and the conversion that matters.
 * ------------------------------------------------------------------ */

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || '';
}

/** The handful of details worth reading back, in the carrier's own words. */
function autoReplySummary(lead: Lead): Array<[string, string]> {
  return lead.fields
    .filter((f) => ['name', 'phone', 'equipment', 'mcNumber', 'lanes'].includes(f.key))
    .map((f) => [f.label, f.value] as [string, string]);
}

function buildAutoReplyText(lead: Lead): string {
  const greeting = firstName(lead.raw.name as string);
  const summary = autoReplySummary(lead)
    .map(([label, value]) => `  ${label}: ${value}`)
    .join('\n');

  return [
    greeting ? `Hi ${greeting},` : 'Hi,',
    '',
    `Thanks for contacting ${BUSINESS.name}. This is an automatic confirmation that your request reached us.`,
    '',
    'Here is what we received:',
    summary,
    '',
    `The fastest way to speak to a dispatcher is to call ${BUSINESS.phone}. You can text or WhatsApp the same number.`,
    `Dispatch desk: ${BUSINESS.hours.days}, ${BUSINESS.hours.time}.`,
    '',
    'If anything above is wrong, just reply to this email and we will correct it.',
    '',
    `— ${BUSINESS.name}`,
    BUSINESS.address.full,
    `${BUSINESS.phone} · ${ownerInbox()}`,
    '',
    'You are receiving this because this address was entered on our website. No further email will be sent unless you reply.',
  ].join('\n');
}

function buildAutoReplyHtml(lead: Lead): string {
  const greeting = firstName(lead.raw.name as string);
  const summaryRows = autoReplySummary(lead)
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:5px 14px 5px 0;color:#5b6270;font:600 13px/1.5 Arial,sans-serif;white-space:nowrap;vertical-align:top;">${escapeHtml(
          label
        )}</td>` +
        `<td style="padding:5px 0;color:#14161C;font:400 14px/1.5 Arial,sans-serif;">${escapeHtml(
          value
        )}</td>` +
        `</tr>`
    )
    .join('');

  return [
    `<div style="background:#f4f5f7;padding:24px;">`,
    `<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3e5ea;border-radius:6px;overflow:hidden;">`,
    `<div style="background:#14161C;padding:16px 24px;color:#ffffff;font:700 18px/1.3 Arial,sans-serif;">${escapeHtml(
      BUSINESS.name
    )}</div>`,
    `<div style="padding:22px 24px;color:#14161C;font:400 15px/1.6 Arial,sans-serif;">`,
    `<p style="margin:0 0 14px;">${escapeHtml(greeting ? `Hi ${greeting},` : 'Hi,')}</p>`,
    `<p style="margin:0 0 14px;">Thanks for contacting ${escapeHtml(
      BUSINESS.name
    )}. This is an automatic confirmation that your request reached us.</p>`,
    `<p style="margin:0 0 8px;font-weight:700;">Here is what we received:</p>`,
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-bottom:16px;">${summaryRows}</table>`,
    `<p style="margin:0 0 14px;">The fastest way to speak to a dispatcher is to call <a href="${escapeHtml(
      BUSINESS.phoneHref
    )}" style="color:#C8232C;font-weight:700;text-decoration:none;">${escapeHtml(
      BUSINESS.phone
    )}</a>. You can text or WhatsApp the same number.</p>`,
    `<p style="margin:0 0 14px;">Dispatch desk: ${escapeHtml(BUSINESS.hours.days)}, ${escapeHtml(
      BUSINESS.hours.time
    )}.</p>`,
    `<p style="margin:0 0 18px;">If anything above is wrong, just reply to this email and we will correct it.</p>`,
    `<hr style="border:none;border-top:1px solid #e3e5ea;margin:0 0 14px;">`,
    `<p style="margin:0;color:#5b6270;font:400 12px/1.6 Arial,sans-serif;">${escapeHtml(
      BUSINESS.name
    )} · ${escapeHtml(BUSINESS.address.full)}<br>${escapeHtml(BUSINESS.phone)} · ${escapeHtml(
      ownerInbox()
    )}<br>` +
      `You are receiving this because this address was entered on our website. No further email will be sent unless you reply.</p>`,
    `</div></div></div>`,
  ].join('');
}

/* ------------------------------------------------------------------ *
 * Delivery channels.
 * ------------------------------------------------------------------ */

/** The one place that talks to Resend, so both emails share timeout + errors. */
async function sendViaResend(payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(resendEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY as string}`,
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

async function deliverViaResend(lead: Lead): Promise<void> {
  const payload: Record<string, unknown> = {
    from: senderAddress(),
    to: [ownerInbox()],
    subject: buildEmailSubject(lead),
    text: buildEmailText(lead),
    html: buildEmailHtml(lead),
  };

  // Replying to the notification should reach the carrier directly.
  const replyTo = lead.raw.email as string | undefined;
  if (replyTo) payload.reply_to = replyTo;

  await sendViaResend(payload);
}

/**
 * Courtesy acknowledgement to the carrier. NEVER throws: the owner's lead is
 * the thing that matters, and a bounced pleasantry must not turn a delivered
 * lead into an error on the visitor's screen.
 */
async function sendAutoReply(lead: Lead): Promise<boolean> {
  const to = (lead.raw.email as string) || '';
  if (!to || !autoReplyConfigured()) return false;

  try {
    await sendViaResend({
      from: senderAddress(),
      to: [to],
      reply_to: ownerInbox(),
      subject: `We received your request — ${BUSINESS.name}`,
      text: buildAutoReplyText(lead),
      html: buildAutoReplyHtml(lead),
      headers: {
        // Standard hints that stop other autoresponders answering this one
        // and starting a loop.
        'Auto-Submitted': 'auto-replied',
        'X-Auto-Response-Suppress': 'All',
      },
    });
    return true;
  } catch (err) {
    console.error(
      '[api/lead] auto-reply to the carrier failed (the lead itself was delivered):',
      err instanceof Error ? err.message : String(err)
    );
    return false;
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
      // Ready-made strings so a no-code Zap can send a useful SMS or Slack
      // message from a single merge field instead of stitching one together.
      subject: buildEmailSubject(lead),
      summary: buildEmailText(lead),
      telHref: telHref((lead.raw.phone as string) || ''),
      equipmentLabel: lead.raw.equipment ? equipmentLabel(lead.raw.equipment as string) : '',
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
  const emailReady = resendConfigured();
  const webhookReady = webhookConfigured();
  if (!emailReady && !webhookReady) {
    console.error(
      '[api/lead] Dropping a real lead: no delivery channel configured. ' +
        'Set RESEND_API_KEY + LEAD_FROM_EMAIL + LEAD_TO_EMAIL, or LEAD_WEBHOOK_URL, then ' +
        'redeploy. Open GET /api/lead to see what is missing; SETUP.md has the steps.'
    );
    return fail(503, 'not_configured', 'Lead delivery is not configured on this site yet.');
  }

  // 7. Build the lead record.
  const now = new Date();
  let submittedAtLocal: string;
  try {
    submittedAtLocal =
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(now) + ' CST/CDT';
  } catch {
    submittedAtLocal = now.toUTCString();
  }

  // Callback order, not form order — see CALLBACK_ORDER.
  const fields: Lead['fields'] = [];
  for (const field of CALLBACK_ORDER) {
    const value = values[field];
    if (value) {
      fields.push({
        key: field,
        label: FIELD_LABELS[field],
        value: displayValue(field, value),
      });
    }
    // Sits directly under the number it applies to.
    if (field === 'phone' && requestCallback) {
      fields.push({
        key: 'requestCallback',
        label: FIELD_LABELS.requestCallback,
        value: 'Yes — prefers a call over email',
      });
    }
  }
  if (message) {
    fields.push({ key: 'message', label: FIELD_LABELS.message, value: message });
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
  if (emailReady) {
    channelNames.push('resend');
    attempts.push(deliverViaResend(lead));
  }
  if (webhookReady) {
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
    return fail(502, 'delivery_failed', 'We could not send that message just now.');
  }

  // 9. Only once the lead is safely delivered, send the carrier a courtesy
  //    acknowledgement. Awaited (a serverless function can be frozen the
  //    instant the response is returned) but it can never fail the request.
  await sendAutoReply(lead);

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/lead — configuration self-check.
 *
 * Open this in a browser after setting environment variables and redeploying:
 * it says, in plain words, whether leads will actually reach you. Booleans
 * only — it never echoes a key, an address, or a URL.
 */
export async function GET() {
  const configured = {
    resend: resendConfigured(),
    webhook: webhookConfigured(),
    autoReply: autoReplyConfigured(),
  };
  const ok = configured.resend || configured.webhook;

  const parts: string[] = [];
  if (ok) {
    parts.push('Lead delivery is configured.');
    parts.push(`Email notifications: ${configured.resend ? 'ON' : 'OFF'}.`);
    parts.push(`Webhook delivery: ${configured.webhook ? 'ON' : 'OFF'}.`);
    parts.push(
      configured.autoReply
        ? 'Auto-reply to the carrier: ON.'
        : 'Auto-reply to the carrier: OFF (it needs RESEND_API_KEY and LEAD_FROM_EMAIL, and LEAD_AUTO_REPLY must not be set to "off").'
    );
    parts.push('Now send yourself a test through the contact form to confirm it end to end.');
  } else {
    parts.push(
      'Lead delivery is NOT configured — the forms currently show visitors your phone number instead of accepting a message.'
    );
    parts.push(
      'Set RESEND_API_KEY + LEAD_FROM_EMAIL + LEAD_TO_EMAIL (email), or LEAD_WEBHOOK_URL (Zapier/Make), then REDEPLOY the site.'
    );
    parts.push('Step-by-step instructions are in SETUP.md.');
  }

  return NextResponse.json(
    {
      ok,
      configured,
      message: parts.join(' '),
      checkedAt: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
