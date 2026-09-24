# Rai Dispatch

Truck dispatch website for owner-operators and fleets across the 48 contiguous United States. Published dispatch fees depend on equipment: **8% cargo/Sprinter vans, 7% box trucks, 6% hotshot, 5% dry van/flatbed/reefer, and 7% all other equipment**. The billing base, service availability, and terms must be confirmed in the written agreement. The website's supported-equipment scope still applies; a fee category does not establish that every specialized operation is available.

The source is configured for **https://raidispatch.com**. The existing GitHub repository is [royfazeel/Fazeel-Rai-Logistics](https://github.com/royfazeel/Fazeel-Rai-Logistics), connected to the existing Vercel project **fazeel-rai-logistics**. Repository and project names can retain the old brand without affecting the public website.

For lead delivery and tracking, read [SETUP.md](SETUP.md). For migration evidence, search intent, launch checks, and outstanding production work, read [the SEO audit and migration record](docs/SEO-AUDIT-AND-MIGRATION.md). A successful local build does not establish that a deployment, DNS change, redirect, or inbox delivery is working in production.

## What the site includes

- **40 indexable page URLs**: 13 core/hub pages, eight equipment pages, nine service pages, three carrier audience pages, and seven guides.
- Equipment coverage for dry van, reefer, flatbed, box truck, power only, step deck, hotshot, and cargo/Sprinter van operations.
- Separate content for owner-operators, small fleets, new authorities, regional and OTR operations, and dedicated dispatcher support. Practical guides cover fees, onboarding, choosing a dispatcher, freight rates, self-dispatch, broker roles and empty-mile planning.
- Page-specific titles, descriptions, canonical URLs, Open Graph metadata, JSON-LD, sitemap, and robots rules.
- Phone, SMS, WhatsApp, contact form, and quote modal. Percentage pricing is explained with a clearly labeled fee example.
- Server-rendered FAQ answers and content that remains visible without scroll-triggered JavaScript. Background video is deferred, with Play/Pause controls on mobile and desktop.

The hero uses `/video/hero-highway-hd.mp4`: a 20.07-second, 1920×1080 H.264 excerpt (4,602,916 bytes), copied from the original footage without re-encoding and optimized for progressive playback. The old 960×540 source is no longer selected. The still image remains visible until playback starts and returns on a media error. Mobile and desktop use muted inline playback. Autoplay respects reduced-motion, data-saver and slow-connection settings; a visible Play control lets visitors start playback explicitly. The control reflects actual playback, allows cancellation while loading, and offers retry after a media error or timeout. Offscreen videos pause; the lower CTA does not load until it becomes visible.

The retained `/testimonials` route now explains the carrier experience. It does not publish unverified testimonials or ratings. The unused testimonial carousel, sample load ticker, and lead popup components are not mounted in the active site.

## Stack and local development

Next.js **15.5.26** with the App Router, React 18, TypeScript, Tailwind CSS, Lucide icons, and Framer Motion. Dependencies are locked in `package-lock.json`; use `npm ci`. Development and verification were run with Node.js 24.18.0.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use a separate terminal for checks. Do not build into the same `.next` directory while a development server is writing to it.

For a production build and local production server:

```sh
npm run typecheck
npm run build
npm run start
```

## Verification

After a production build, with the site running on port 3000:

```sh
node scripts/verify-seo.mjs http://localhost:3000
```

The read-only crawler follows the sitemap and checks HTTP status, one H1 per page, unique titles/descriptions, Rai Dispatch branding, self-canonicals, Open Graph URLs, JSON-LD syntax, indexability, internal links/fragments, robots directives, and removed review remnants. It also rejects the obsolete universal 5% ceiling, checks each equipment page's advertised fee and applicable structured data, and checks the pricing table's equipment/rate associations. The expected rates are independent acceptance criteria from the owner's pricing instruction, so an incorrect shared data value cannot make the audit pass by reproducing the same mistake. To retain a JSON report, add `--json /tmp/rai-seo-report.json`.

Run the same read-only audit after deployment:

```sh
node scripts/verify-seo.mjs https://raidispatch.com
```

Test the lead API without sending real emails:

```sh
node scripts/verify-lead-api.mjs
```

This harness requires a completed production build. It starts its own loopback Next server and fake Resend sink, uses reserved `.example` addresses, clears webhook delivery, and blocks non-loopback fetches in the test server. It accepts no remote URL. Checks include owner notification, carrier acknowledgement, validation, escaping, spam controls, rate limits, provider failures, and unconfigured delivery. Temporary processes and files are cleaned up afterward.

The current release produces **46 build outputs**, including 40 indexable pages. Local verification on 24 September 2026 passed **40/40 sitemap pages** and **212 internal link/fragment targets**, with **zero failures or advisory warnings**. The unchanged lead API previously passed **17/17 isolated checks**. The crawler also checks equipment-specific pricing in page content, metadata and percentage Offer descriptions. These checks do not establish live inbox receipt, Google indexing/rankings, structured-data rich-result eligibility, or real-user Core Web Vitals. Inspect the rendered site on desktop and mobile as well. See the [keyword coverage plan](docs/KEYWORD-COVERAGE-PLAN.md) for page intents and query families.

## Deploy to the existing Vercel project

Use the existing **fazeel-rai-logistics** project and its connection to **royfazeel/Fazeel-Rai-Logistics**. Do not import this repository as another Vercel project for the domain migration.

1. Verify the intended change locally and commit it to the repository.
2. Push the intended release to the configured production branch, currently `main`.
3. In the existing Vercel project, confirm the connected repository, deployment commit, and successful production build.
4. Keep `raidispatch.com`, its `www` variant, and the old-domain redirect configuration attached to that same project. Use the exact DNS records Vercel requests and preserve email DNS records.
5. Verify the production site, path-preserving redirects, sitemap, metadata, contact channels, and delivery before recording the launch as complete.

Environment changes require a new deployment. Public `NEXT_PUBLIC_*` values are embedded at build time. Do not commit keys or `.env` files. `.vercel/` is local project-link state and is ignored by Git.

## Content and code map

| Location | Purpose |
| --- | --- |
| `src/lib/constants.ts` | Business identity/contact details, hours, equipment labels, core services, FAQs, onboarding, and service commitments |
| `src/lib/dispatch-pricing.ts` | Shared equipment-specific dispatch percentages and pricing descriptions |
| `src/lib/dispatch-content.ts` | Distinct equipment/service detail content and carrier guides; slugs feed the corresponding dynamic routes |
| `src/lib/expanded-content.ts`, `carrier-content.ts` | Operating-pattern services, additional educational guides, and carrier audience content |
| `src/lib/seo.ts` | Canonical origin, site name, share image, and the shared page-metadata helper |
| `src/app/page.tsx` / `HomePageClient.tsx` | Server homepage metadata and interactive homepage presentation |
| `src/app/equipment/[slug]`, `services/[slug]`, `resources/[slug]`, `carriers/[slug]` | Static detail pages generated from content data |
| `src/app/service-areas/page.tsx` | Actual nationwide service boundaries and lane-planning considerations |
| `src/app/layout.tsx` | Shared layout, organization/website schema, and global UI |
| `src/app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx` | Discovery directives and branded sharing image |
| `src/components/` | Navigation, footer, pricing presentation, native FAQ disclosure, lead forms, and contact actions |
| `src/app/api/lead/route.ts` | Lead validation, delivery, acknowledgement, and configuration self-check |
| `src/components/Analytics.tsx` / `src/lib/track.ts` | Existing GA4 tag and conversion events |
| `scripts/` | Read-only SEO crawl and isolated lead API verification |
| `public/video/` | Locally hosted hero/CTA posters and video files |

When changing a fee, update the shared pricing helper and review visible equipment, pricing, FAQ, agreement, metadata, and schema copy. Update the crawler's independent acceptance rates only when the owner authorizes a price change. Add a page only when it provides distinct, useful information. New content needs a stable slug, page-specific metadata, contextual links, and sitemap coverage. Do not add invented reviews, unsupported income promises, or duplicate city pages.

## Lead delivery and email

Contact and quote forms post to the relative `POST /api/lead` endpoint. Notification delivery is configured through:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` + `LEAD_FROM_EMAIL` | Submit owner notifications through Resend using a verified sender |
| `LEAD_TO_EMAIL` | Owner destination; defaults to `BUSINESS.email` |
| `LEAD_AUTO_REPLY=off` | Disable the carrier acknowledgement |
| `LEAD_WEBHOOK_URL` | Optional additional JSON delivery channel |
| `NEXT_PUBLIC_GA4_ID` | Override the existing GA4 measurement ID |
| `NEXT_PUBLIC_GADS_ID` | Google Ads tag ID |
| `NEXT_PUBLIC_GADS_CALL_LABEL` / `NEXT_PUBLIC_GADS_LEAD_LABEL` | Google Ads call-click and accepted-form conversion values |

`GET /api/lead` reports whether the required configuration values are present. **`ok: true` means configured, not delivered.** It does not validate credentials, sender-domain verification, provider acceptance, or inbox receipt. The response contains status booleans and explanatory text, without keys or addresses.

With no channel configured, POST returns `503 not_configured`. A failed delivery attempt returns an error. Success means at least one configured notification channel accepted the request; it does not prove the email reached an inbox or the webhook completed downstream actions. A carrier acknowledgement is attempted afterward, and its failure does not overturn an accepted owner notification.

The local test sink proves the application workflow in isolation. Confirm live delivery separately with an explicitly authorized test submission and check the recipient inbox/provider logs. Rate limiting is in-memory and best-effort per serverless instance.

**Web and email domains are separate.** The owner has confirmed that `sam@railogistics.us` remains the contact email. Preserve that inbox, its DNS, and the verified old-domain sender. Moving the website to `raidispatch.com` does not create new email accounts or authenticate a new sender. `RESEND_API_URL` is a local-test override only and must remain unset in production.

## Contact and license

Email: [sam@railogistics.us](mailto:sam@railogistics.us) · Phone: [(213) 371-6155](tel:+12133716155)

Private — all rights reserved.
