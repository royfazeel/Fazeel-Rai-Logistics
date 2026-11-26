# Rai Dispatch

Truck dispatch website for owner-operators and fleets across the 48 contiguous United States. The current fee schedule, approved by the owner on November 19, 2026, lowers every published fee by one percentage point: **box truck 6%, dry van 4%, reefer 3%, flatbed 4%, power only 4%, step deck 4%, hotshot 5%, cargo van 11%, and Conestoga 3%**. Sprinter vans and other equipment are **4%**; the published range is **3–11%**. A dedicated dispatcher is included for every truck type. The billing base, equipment classification, service availability, and terms must be confirmed in the written agreement. The website's supported-equipment scope still applies; a fee category does not establish that every specialized operation is available. This schedule records the approved revision, not deployment or test evidence for it.

The source is configured for **https://raidispatch.com**. The existing GitHub repository is [royfazeel/Fazeel-Rai-Logistics](https://github.com/royfazeel/Fazeel-Rai-Logistics), connected to the existing Vercel project **fazeel-rai-logistics**. Repository and project names can retain the old brand without affecting the public website.

For lead delivery and the current website-measurement status, read [SETUP.md](SETUP.md). For migration evidence, search intent, launch checks, and outstanding production work, read [the SEO audit and migration record](docs/SEO-AUDIT-AND-MIGRATION.md). A successful local build does not establish that a deployment, DNS change, redirect, or inbox delivery is working in production.

## What the site includes

- **68 indexable page URLs**: 14 core/hub and editorial pages, 15 equipment pages, 11 service pages, three carrier audience pages, 23 guides, a 40-term glossary and an interactive load cost calculator.
- Equipment coverage for dry van, reefer, flatbed, box truck, power only, step deck, hotshot, cargo van, Sprinter van, Conestoga, RGN/lowboy, car hauler, tanker, dump truck and curtain-side operations.
- Separate content for owner-operators, small fleets, new authorities, regional and OTR operations, and dedicated dispatcher support. Practical guides cover fees, onboarding, choosing a dispatcher, freight rates, self-dispatch, broker roles and empty-mile planning.
- Page-specific titles, descriptions, canonical URLs, Open Graph metadata, JSON-LD, sitemap, and robots rules.
- Phone, SMS, WhatsApp, contact form, and quote modal. Percentage pricing is explained with a clearly labeled fee example.
- Server-rendered FAQ answers and content that remains visible without scroll-triggered JavaScript. The homepage uses a responsive static hero image.

The homepage uses responsive static AVIF/WebP hero artwork. The decorative background video was removed from the active homepage in the October 26 performance release.

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

## Fee schedule date, carrier-protection sentences and IndexNow

- `src/lib/dispatch-pricing.ts` carries `DISPATCH_FEE_EFFECTIVE_DATE` (currently 2026-10-30, the release that introduced the present schedule) and the history sentence shown on `/pricing`, in the FAQ and in `llms.txt`. Update both when the owner changes a fee; the controlling fee answers themselves stay unchanged so `scripts/verify-seo.mjs` can match them verbatim.
- `NO_FORCED_DISPATCH_SENTENCE` and `CARRIER_AUTHORITY_SENTENCE` appear word for word on every equipment page, the pricing table, the FAQ and `llms.txt`; AI assistants quote these exact phrases from competitor pages. `src/lib/fee-terms.ts` lists what the percentage fee includes.
- `.github/workflows/indexnow.yml` runs `node scripts/submit-indexnow.mjs --submit --changed-within-days 2` after each successful Vercel production deployment (the `deployment_status` event the Vercel GitHub integration emits), so engines are told which sitemap entries changed. Run the script without `--submit` for a dry run.

## Verification

After a production build, with the site running on port 3000:

```sh
node scripts/verify-seo.mjs http://localhost:3000
node scripts/verify-indexing.mjs http://localhost:3000
```

The read-only crawler follows the sitemap and checks HTTP status, one H1 per page, unique titles/descriptions, Rai Dispatch branding, self-canonicals, Open Graph URLs, JSON-LD syntax, indexability, internal links/fragments, robots directives, and removed review remnants. It also rejects the obsolete universal 5% ceiling, checks each equipment page's advertised fee and applicable structured data, and checks the pricing table's equipment/rate associations. The expected rates are independent acceptance criteria from the owner's pricing instruction, so an incorrect shared data value cannot make the audit pass by reproducing the same mistake. To retain a JSON report, add `--json /tmp/rai-seo-report.json`.

The indexing regression script checks canonical sitemap URLs, trailing-slash and query variants, permanent old-domain/www/stable-Vercel-host redirects, the `/index` alias, and genuine 404 status/metadata. It uses a mobile Googlebot user-agent string. Local runs send alias Host headers to the local server without following redirects; production runs request the public aliases. Add `--json /tmp/rai-indexing-report.json` to save its report. These checks do not establish Google's actual crawl or indexing decisions. See the [October 26 indexing audit](docs/INDEXING-AUDIT-2026-10-26.md) for Search Console findings, implemented fixes, and release status.

Run the same read-only audit after deployment:

```sh
node scripts/verify-seo.mjs https://raidispatch.com
node scripts/verify-indexing.mjs https://raidispatch.com
```

Test the lead API without sending real emails:

```sh
node scripts/verify-lead-api.mjs
```

This harness requires a completed production build. It starts its own loopback Next server and fake Resend sink, uses reserved `.example` addresses, clears webhook delivery, and blocks non-loopback fetches in the test server. It accepts no remote URL. Checks include owner notification, carrier acknowledgement, validation, escaping, spam controls, rate limits, provider failures, and unconfigured delivery. Temporary processes and files are cleaned up afterward.

The earlier September 24 release produced **46 build outputs**, including 40 indexable pages. Local verification on that date passed **40/40 sitemap pages** and **212 internal link/fragment targets**, with **zero failures or advisory warnings**. The lead API also previously passed **17/17 isolated checks**. Those are historical results; rerun verification for the current 67-page site after changes. The crawler also checks equipment-specific pricing in page content, metadata and percentage Offer descriptions. These checks do not establish live inbox receipt, Google indexing/rankings, structured-data rich-result eligibility, or real-user Core Web Vitals. Inspect the rendered site on desktop and mobile as well. See the [keyword coverage plan](docs/KEYWORD-COVERAGE-PLAN.md) for page intents and query families.

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
| `src/lib/track.ts`, `src/components/SiteAnalytics.tsx` | Cookieless Vercel Web Analytics: allow-listed contact/lead events, page addresses without query strings, no consent prompt |
| `src/components/GoogleAdsTag.tsx`, `src/lib/track.ts` | Google Ads conversion measurement: the Google tag with consent defaults granted, and the two conversion actions sent from `track()` |
| `scripts/` | Read-only SEO crawl, isolated lead API verification and analytics checks |
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

`GET /api/lead` reports whether the required configuration values are present. **`ok: true` means configured, not delivered.** It does not validate credentials, sender-domain verification, provider acceptance, or inbox receipt. The response contains status booleans and explanatory text, without keys or addresses.

With no channel configured, POST returns `503 not_configured`. A failed delivery attempt returns an error. Success means at least one configured notification channel accepted the request; it does not prove the email reached an inbox or the webhook completed downstream actions. A carrier acknowledgement is attempted afterward, and its failure does not overturn an accepted owner notification.

The local test sink proves the application workflow in isolation. Confirm live delivery separately with an explicitly authorized test submission and check the recipient inbox/provider logs. Rate limiting is in-memory and best-effort per serverless instance.

**Web and email domains are separate.** The owner has confirmed that `sam@railogistics.us` remains the contact email. Preserve that inbox, its DNS, and the verified old-domain sender. Moving the website to `raidispatch.com` does not create new email accounts or authenticate a new sender. `RESEND_API_URL` is a local-test override only and must remain unset in production.

## Website measurement

As of **November 19, 2026**, the website uses **Vercel Web Analytics**. It is cookieless, so visitors are not shown a consent prompt: the earlier automatic consent dialog and the "Measurement settings" control are removed. Google Analytics 4 (GA4) is not loaded. This does not change the underlying Google accounts or delete their historical data.

As of **November 26, 2026**, the website also loads the Google tag for **Google Ads conversion measurement** (see below). It uses first-party cookies and still shows no consent prompt.

- **Web Analytics must stay enabled** for the existing **fazeel-rai-logistics** Vercel project (project → **Analytics**). On November 19, 2026 the live site was serving the analytics script and sending page views, which requires that setting; the dashboard itself was not checked. If it is disabled, the site keeps working but nothing is recorded.
- `SiteAnalytics` is mounted once in `src/app/layout.tsx` and renders nothing. On Vercel the script and its endpoints are served from a per-project path on the site's own host (for example `/<id>/script.js` and `/<id>/view`), not from a third-party domain. `/_vercel/insights/script.js` is the package's fallback path outside a Vercel build, so a local `next start` requests that path and gets a 404.
- Page views are reported without query strings or fragments. `src/lib/track.ts` sends only the code-owned events `call_click`, `sms_click`, `whatsapp_click`, `email_click`, `quote_modal_open` and `lead_submit`, each with an allow-listed `location` or `source` label and no form data. `lead_submit` is sent only after the lead API accepts a submission. Custom events are a plan-dependent Vercel feature; confirm they appear for this project's plan before relying on them.
- The site does not call the script's visitor-identification or cookie opt-in features. Do not add them without revisiting `/privacy`, `/terms` and the consent question.
- Browsers that used the earlier GA4 setup have their saved consent choice and accessible `_ga*` cookies removed on the next visit. Google Ads `_gcl_*` cookies are not removed: they hold the ad click identifier.
- The variables `NEXT_PUBLIC_MEASUREMENT_ENABLED`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID` and `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` are no longer read and can be deleted from the Vercel project.

```sh
node scripts/verify-analytics.mjs
```

This checks the event allow-list, page-address handling, the Google Ads conversion mapping and consent defaults, the removal of earlier Google Analytics cookies (and that `_gcl_*` cookies are kept), and that Google tag code exists only in `GoogleAdsTag.tsx` and `track.ts`, using stand-in provider and browser objects. It does not verify the dashboard setting, the Google Ads account, live delivery or plan-dependent reporting.

### Google Ads conversion measurement

Added **November 26, 2026** for Google Ads account **748-406-9019** (Rai Logistics), tag ID `AW-18340605512`.

| Website event | Google Ads conversion action | `send_to` |
|---|---|---|
| `lead_submit` (an inquiry form the lead API accepted) | Submit lead form | `AW-18340605512/-hqfCOHe7OccEMjcvalE` |
| A click on any phone, SMS, WhatsApp or email link | Rai Logistics Contact | `AW-18340605512/8Ia-CN_v6-ccEMjcvalE` |

- `GoogleAdsTag` is mounted once in `src/app/layout.tsx`. One inline script sets the consent defaults to **granted**, configures the tag and then requests `gtag.js`, in that order.
- **There is no consent prompt, and nothing waits for one.** Do not add a cookie banner or consent platform that defaults `ad_storage` or `ad_user_data` to denied, or that holds back the Google tag: Google Ads would stop recording conversions. Do not restore the `_gcl_*` cookie removal either.
- `track('lead_submit')` in `src/lib/track.ts` sends the lead conversion right after the Vercel event. Contact clicks are counted differently: `SiteAnalytics` adds one capture-phase click listener for the whole page, and `reportContactLinkClick()` sends the contact conversion for any `tel:`, `sms:`, `mailto:` or WhatsApp link, so links in the footer, the detail pages and the legal pages count without needing their own `track()` call. `track()` does not send the contact conversion itself, so tracked buttons are not counted twice. Only the conversion action is named; no form data, placement or page parameters are added. `quote_modal_open` is not a conversion. Enhanced conversions (hashed contact details) are not used.
- The IDs are in the code, not in environment variables. To change an action, edit the constants in `src/lib/track.ts` and the expected values in `scripts/verify-analytics.mjs`.
- To check a deployment: open the site with `?gclid=test` and confirm a `_gcl_aw` cookie is set and survives a reload; click a phone link or submit a form and look for a request to `googleadservices.com/pagead/conversion/18340605512/` carrying the label above.

Hosting and security providers may still retain operational request/error logs. Contact forms, lead delivery, optional carrier acknowledgements and direct contact links remain separate and unchanged. The current disclosures are in `/privacy` and `/terms`, dated November 26, 2026.

## Contact and license

Email: [sam@railogistics.us](mailto:sam@railogistics.us) · Phone: [(213) 371-6155](tel:+12133716155)

Private — all rights reserved.

### Search discovery checks and notifications

The resources are server-rendered, with organization bylines, references, article dates, linked editorial standards and contextual service links. The calculator runs locally in the visitor’s browser without submitting input.

```bash
node scripts/verify-load-economics.mjs
node scripts/verify-search-access.mjs https://raidispatch.com output/search-access.json
node scripts/submit-indexnow.mjs
# After a verified release, explicitly submit changed canonical URLs:
node scripts/submit-indexnow.mjs --url https://raidispatch.com/resources --submit --output output/indexnow.json
```

Search access checks use declared crawler headers on representative public URLs; they do not impersonate verified crawler IPs or prove citations. The existing robots wildcard allows public content and excludes `/api/`. No special AI files or schema are required for Google AI features.

IndexNow is manual and dry-run by default. It reads the production sitemap, limits notifications to canonical `raidispatch.com` URLs and verifies the deployed ownership file before submission. The verification key is intentionally hosted publicly under `public/`; it is not an account credential. A successful response only acknowledges the notification, not indexing. No tracking tags or recurring jobs were added.
