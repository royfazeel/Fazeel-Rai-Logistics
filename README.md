# Rai Logistics - Premium Truck Dispatch Services Website

A premium, enterprise-grade website for Rai Logistics truck dispatch services. Built with Next.js 14, Tailwind CSS, and Framer Motion.

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
│       └── constants.ts        # Business info, content data
├── public/                     # Static assets
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

There are three places a visitor can leave their details: the **Contact page
form**, the **Get a Free Quote** popup, and the **exit-intent popup** that
appears when someone is about to leave. All three send to the same place:
`/api/lead`.

**You have to tell the site where to send those leads.** Until you do, the
forms will not pretend a message went through — they show the visitor an error
and your phone number instead. Nothing is ever silently thrown away.

There are two ways to receive leads. Pick one, or do both.

### Option 1 — Get leads by email (Resend)

[Resend](https://resend.com) is an email service with a free tier that is more
than enough for a dispatch business. Emails from a real service land in the
inbox; emails sent straight from a website usually land in spam.

1. Sign up at [resend.com](https://resend.com).
2. Add and verify your domain (`railogistics.us`). Resend gives you a few DNS
   records to paste into wherever the domain is managed. This is the step that
   keeps lead emails out of spam.
3. Go to **API Keys** and create one. Copy it — it starts with `re_` and is
   only shown once.
4. You now have three values to add in Vercel (next section):
   - `RESEND_API_KEY` — the key you just copied
   - `LEAD_TO_EMAIL` — where you want leads to land, e.g. `sam@railogistics.us`
   - `LEAD_FROM_EMAIL` — who the email is from, e.g. `leads@railogistics.us`
     (this must be on the domain you verified in step 2)

Each lead arrives as a clean email with the carrier's name, phone, MC number,
equipment, and message, plus which form it came from and when. Hitting Reply
replies straight to the carrier.

### Option 2 — Get leads anywhere else, no code (webhook)

If you would rather have leads drop into a Google Sheet, a CRM, a text
message, or Slack, use a webhook. Zapier and Make both do this without any
programming.

1. In [Zapier](https://zapier.com) create a new Zap, or in
   [Make](https://make.com) a new scenario.
2. For the trigger, choose **Webhooks -> Catch Hook**. It will give you a URL.
3. Copy that URL. That is your `LEAD_WEBHOOK_URL`.
4. For the action, pick whatever you want to happen — "Add row to Google
   Sheets", "Send SMS", "Create HubSpot contact", and so on.
5. Turn the Zap on.

Every lead gets sent to that URL as JSON, with all the same fields.

**Setting both is fine and recommended** — you get the email *and* the
spreadsheet row, so a lead is never lost to a single service having a bad day.

### Where to paste the values (Vercel)

1. Go to [vercel.com](https://vercel.com) and open the Rai Logistics project.
2. Click **Settings**, then **Environment Variables** in the left sidebar.
3. For each value you have, click **Add New**, then:
   - **Key**: the name exactly as spelled below — capitals and underscores matter
   - **Value**: paste the value
   - **Environments**: tick **Production**, **Preview**, and **Development**
   - Click **Save**

| Key | What it is | Needed for |
| --- | --- | --- |
| `RESEND_API_KEY` | Your Resend API key (`re_...`) | Email |
| `LEAD_TO_EMAIL` | The inbox leads should land in | Email |
| `LEAD_FROM_EMAIL` | The verified "from" address | Email |
| `LEAD_WEBHOOK_URL` | Your Zapier/Make catch-hook URL | Webhook |

4. **Redeploy — this is the step people miss.** Environment variables are baked
   in when the site is built, so adding them changes nothing until you deploy
   again. Go to the **Deployments** tab, find the most recent deployment, click
   the **…** menu on the right, and choose **Redeploy**.
5. Test it. Open the live site, fill in the contact form with your own name and
   phone, and submit. You should see "Message sent" and get the email (or the
   Zapier row) within a minute or so.

For local development, copy `.env.example` to `.env.local` and fill in the same
values there. `.env.local` is gitignored and never leaves your machine.

### If something goes wrong

- **"We couldn't send that just now" on the live site** — either the variables
  are not set, or you have not redeployed since setting them. Check both. The
  server logs (Vercel -> your project -> **Logs**) say which one it is.
- **Emails not arriving** — check the spam folder first, then confirm the
  domain shows as verified in Resend and that `LEAD_FROM_EMAIL` uses that exact
  domain.
- **Nothing at all happens** — the visitor always sees either a confirmation or
  an error with the phone number, so a lead is never lost without a trace. If
  a customer says a form did not work, they were shown the number to call.

### Notes for whoever maintains the code

- The endpoint is `src/app/api/lead/route.ts` (POST only).
- Every field is validated and length-capped server-side; name and phone are
  required, and phone/email are sanity-checked.
- A hidden `company` field acts as a spam trap. Bots fill it, humans never see
  it; those submissions get a 200 and go straight in the bin.
- Rate limiting is 5 submissions per IP per 10 minutes, held in memory. On
  Vercel that is **per serverless instance and best-effort only** — it stops
  casual spam loops, not a determined attacker. For real abuse, move it to a
  shared store (Upstash/Redis) or put the route behind Vercel's WAF.

## License

Private - All rights reserved.

## Support

For questions or support, contact:
- Email: sam@railogistics.us
- Phone: (307) 303-9797
