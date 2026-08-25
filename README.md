# Rai Logistics - Premium Truck Dispatch Services Website

A premium, enterprise-grade website for Rai Logistics truck dispatch services. Built with Next.js 14, Tailwind CSS, and Framer Motion.

> **Site owner?** Everything you need to do yourself — getting leads into your
> inbox and switching on Google Ads tracking — is written out click by click in
> **[SETUP.md](SETUP.md)**. You do not need anything else in this file.

## Features

- 🚛 **Complete Multi-Page Website**: Home, Services, Equipment, Pricing, Testimonials, About, FAQ, Contact, Privacy Policy, and Terms of Service
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ✨ **Premium Animations**: Scroll reveals, hover effects, animated counters, testimonial carousel
- 📞 **Conversion-Focused**: Sticky call widgets, prominent CTAs, quote modal
- 🎨 **Premium Design**: Clean layout, professional typography, subtle gradients
- 🔍 **SEO Optimized**: Meta tags, JSON-LD schema, semantic HTML
- ⚡ **Performance Optimized**: Lazy loading, GPU-friendly animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rai-logistics
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

## Project Structure

```
rai-logistics/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── equipment/          # Equipment page
│   │   ├── faq/                # FAQ page
│   │   ├── pricing/            # Pricing page
│   │   ├── privacy/            # Privacy Policy page
│   │   ├── services/           # Services page
│   │   ├── terms/              # Terms of Service page
│   │   ├── testimonials/       # Testimonials page
│   │   ├── api/lead/route.ts   # Lead intake + delivery + config self-check
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable components
│   │   ├── AnimatedCounter.tsx
│   │   ├── Button.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── PricingTable.tsx
│   │   ├── QuoteModal.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── ServiceIcon.tsx
│   │   ├── StickyCallWidgets.tsx
│   │   ├── TestimonialCarousel.tsx
│   │   └── index.ts
│   └── lib/
│       ├── constants.ts        # Business info, content data
│       └── track.ts            # Conversion tracking helper (GA4 / Google Ads)
├── public/                     # Static assets
├── SETUP.md                    # Owner-facing setup guide (start here)
├── .env.example                # Every environment variable, annotated
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
└── package.json
```

## Customization

### Business Information

All business details (phone, email, address, etc.) are centralized in `src/lib/constants.ts`. Update this file to change:

- Company name and parent company
- Phone number (including click-to-call links)
- Email address
- Physical address
- Service descriptions
- Pricing information
- Testimonials
- FAQ content

### Styling

- **Colors**: Modify the color palette in `tailwind.config.ts`
- **Typography**: Update font families in `tailwind.config.ts` and `globals.css`
- **Animations**: Customize in `tailwind.config.ts` and Framer Motion components

### Adding New Pages

1. Create a new folder in `src/app/` with the page name
2. Add a `page.tsx` for server-side metadata
3. Create a client component for interactive content

## Performance Considerations

- All animations respect `prefers-reduced-motion`
- Images should be optimized before deployment
- Consider adding real images to replace placeholder content

## Lead form setup

**If you are the site owner and not a developer, read [SETUP.md](SETUP.md)
instead of this section.** It is the same thing written as click-by-click
steps, and it also covers the Google Ads tracking variables.

Short version for developers:

- Two forms post to `POST /api/lead`: the contact page
  (`source: 'contact_page'`) and the quote modal (`source: 'quote_modal'`).
  `LeadCapturePopup` still exists and would post `exit_intent_popup`, but it
  is not mounted in `layout.tsx`.
- Delivery is environment-driven and additive. Whatever is configured runs:

  | Variable | Effect |
  | --- | --- |
  | `RESEND_API_KEY` + `LEAD_FROM_EMAIL` | Emails the lead via the Resend HTTP API |
  | `LEAD_TO_EMAIL` | Where that email goes (defaults to `BUSINESS.email`) |
  | `LEAD_AUTO_REPLY=off` | Suppresses the carrier acknowledgement |
  | `LEAD_WEBHOOK_URL` | POSTs the lead as JSON (Zapier / Make / Sheets) |
  | `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GADS_ID` | Loads the Google tag |
  | `NEXT_PUBLIC_GADS_CALL_LABEL` / `NEXT_PUBLIC_GADS_LEAD_LABEL` | Google Ads conversion labels |

- With **no** delivery channel configured the endpoint returns
  `503 not_configured` and both forms show the visitor an error with the phone
  number. We never claim a delivery we cannot stand behind.
- `NEXT_PUBLIC_*` values are inlined at build time and the server-side ones are
  read per request, but Vercel only picks up either after a **redeploy**.

### Checking the configuration

`GET /api/lead` returns a non-sensitive self-check — booleans only, no key
values, no addresses:

```json
{
  "ok": true,
  "configured": { "resend": true, "webhook": false, "autoReply": true },
  "message": "Lead delivery is configured. ...",
  "checkedAt": "2026-08-25T16:54:12.700Z"
}
```

`ok` is true when at least one delivery channel is live. Point the owner at
this URL rather than asking him to read logs.

### What the owner receives

- **Subject**: `New lead: <name> · <equipment>` (plus `· wants a callback`
  when the box was ticked) — readable on a phone lock screen.
- **Body**, in callback order: a tappable `tel:` call button and an `sms:`
  button, then name, phone (also a `tel:` link), callback preference,
  equipment, MC number, lanes, current status, factoring, email, message, and
  finally the context block (time, source, page, browser, IP).
- Select values are decoded before sending — the email says
  "Switching dispatchers", not `switching`.
- `reply_to` is the carrier's address, so Reply reaches them directly.

### The carrier's auto-reply

When email delivery is configured and the carrier gave an address, a short
acknowledgement is sent from `LEAD_FROM_EMAIL` **after** the owner
notification, with `reply_to` pointing back at the owner's inbox. It confirms
what was received, gives the phone number as the fastest route, and makes no
promise about response time. `sendAutoReply()` swallows every error: a failed
courtesy email can never turn a delivered lead into an error on the visitor's
screen.

### Notes for whoever maintains the code

- The endpoint is `src/app/api/lead/route.ts`.
- Every field is validated and length-capped server-side; name and phone are
  required, and phone/email are sanity-checked. Control characters (including
  CR/LF header-injection attempts) are stripped from short fields.
- A hidden `company` field acts as a spam trap. Bots fill it, humans never see
  it; those submissions get a 200 and go straight in the bin.
- Rate limiting is 5 submissions per IP per 10 minutes, held in memory. On
  Vercel that is **per serverless instance and best-effort only** — it stops
  casual spam loops, not a determined attacker. For real abuse, move it to a
  shared store (Upstash/Redis) or put the route behind Vercel's WAF.
- `track('lead_submit', { source })` is fired in the browser only on a
  confirmed `{ ok: true }` response, never on failure, so Google Ads never
  optimises towards submissions nobody received.
- `RESEND_API_URL` exists only to point the email path at a local sink during
  testing. Leave it unset everywhere else.

## License

Private - All rights reserved.

## Support

For questions or support, contact:
- Email: sam@railogistics.us
- Phone: (213) 371-6155
