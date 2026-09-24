# Rai Dispatch: SEO audit and domain migration

Audit date: 24 September 2026. Target website: `https://raidispatch.com`.

This document records the original audit, implemented changes, production verification, and remaining measurement work for the Rai Dispatch migration on 24 September 2026. Observed results are distinguished from ranking predictions and tests that still require a real recipient or accumulated field data.

## Observed baseline

The audit fetched the public website HTML, `robots.txt`, `sitemap.xml`, and the read-only lead configuration endpoint. No lead was submitted and no email was sent during this audit.

| Finding on the original website | Why it matters | Intended improvement |
| --- | --- | --- |
| Ten URLs in the sitemap; all inspected pages lack a canonical link | Domain variants and the migration need a consistent preferred URL | Self-referencing canonical for every indexable page on the new domain |
| Brand, sitemap, robots directives, and structured data use Rai Logistics / railogistics.us | Search engines and visitors need consistent identity | Rai Dispatch brand and raidispatch.com web URLs; retain Rai Technologies LLC as the legal entity |
| Child pages inherit generic homepage Open Graph and Twitter descriptions; homepage lacks a sharing image and `og:url` | Shared links do not describe each page well | Page-specific metadata and a branded sharing image |
| Homepage H1 is a slogan without the service name | Visitors should immediately understand the business | A descriptive truck dispatch heading with clear service and pricing context |
| Box truck pricing is 7%, power only is 6%, and other copy says 5–7% | Conflicts with the owner's new offer | Consistent “up to 5%” percentage pricing, with the calculation basis explained |
| Equipment details live only at anchors on `/equipment` | Different equipment questions need useful dedicated answers | Linked equipment pages with distinct requirements, freight considerations, and FAQs |
| Weekly gross ranges are labeled “industry averages” without cited evidence | A disclaimer alone does not substantiate numbers | Remove unsupported comparisons or replace with clearly labeled arithmetic examples |
| Testimonials lack public source links | Authentic customer evidence is stronger than unattributed claims | Publish only verified, approved customer statements; do not invent reviews or ratings |
| Homepage loads a decorative video with `preload="auto"` | Mobile data and rendering performance need measurement | Check the poster, loading policy, reduced-motion behavior, and mobile Core Web Vitals |

These are baseline findings, not claims that the revised site still has each issue. The previous sitemap includes `/`, `/services`, `/equipment`, `/pricing`, `/contact`, `/about`, `/faq`, `/testimonials`, `/privacy`, and `/terms`. Preserve these paths or map each to a genuinely equivalent destination.

## Search-intent and page map

The following is a qualitative intent map based on the existing business offering and public search results. It does **not** assert search volumes, keyword difficulty scores, current positions, or traffic forecasts. Confirm priorities with Search Console query data after launch.

| Planned or retained route | Primary intent | Content that earns the page its own purpose |
| --- | --- | --- |
| `/` | truck dispatch services, truck dispatch company, USA truck dispatch | Who the service is for, equipment supported, fee ceiling, load approval, and a clear contact action |
| `/services` | freight dispatch, load booking, rate negotiation, dispatch paperwork | Workflow from truck availability to delivery, included tasks, responsibilities, and links to equipment/pricing |
| `/equipment` | truck dispatch by equipment type | Equipment comparison and links to detailed suitability information |
| `/equipment/dry-van` | dry van dispatch services, 53-foot dry van dispatch | Trailer capacity, appointments, regional/OTR planning, reloads, and empty-mile considerations |
| `/equipment/reefer` | reefer dispatch, refrigerated truck dispatch | Temperature instructions, washouts, appointment coordination, and load-specific requirements |
| `/equipment/flatbed` | flatbed dispatch services | Dimensions, tarping, loading method, and carrier securement responsibilities |
| `/equipment/box-truck` | box truck dispatch, 26-foot box truck loads | Interior dimensions, payload, dock height, liftgate requirements, and load suitability |
| `/equipment/power-only` | power only dispatch, tractor-only dispatch | Trailer compatibility, interchange requirements, pickup/return arrangements, and broker eligibility |
| `/equipment/step-deck` | step deck dispatch | Deck dimensions, load height, machinery fit, and equipment limits |
| `/equipment/hotshot` | hotshot dispatch services | Trailer length, payload, preferred radius, and partial-load suitability |
| `/equipment/cargo-van` | cargo van dispatch, Sprinter van dispatch | Interior clearance, payload, expedited freight suitability, and availability limitations |
| `/pricing` | truck dispatch cost, dispatch fees, 5% dispatch service | Exact calculation basis, inclusions, a worked example, billing and cancellation terms |
| `/service-areas` | nationwide truck dispatch, lower-48 dispatch | Real service boundaries, regional vs. OTR planning, lane preferences, and coverage constraints |
| `/resources` | carrier dispatch guides | A browseable guide index linking practical carrier questions to service and equipment pages |
| `/resources/evaluate-freight-rate-per-mile` | freight rate per mile, evaluating a truckload | Worked arithmetic with loaded and empty miles, costs, time, and load requirements |
| `/resources/truck-dispatch-fees` | truck dispatch fees, percentage vs. fixed cost | Fee basis, inclusions, comparison examples, and written agreement questions |
| `/resources/how-to-choose-a-truck-dispatcher` | choosing a truck dispatcher, dispatch service checklist | Scope, load approval, communication, business checks, and service review questions |
| `/resources/carrier-onboarding-checklist` | truck dispatch onboarding, carrier documents | Business documents, equipment specifications, lane preferences, agreements, and readiness |
| `/about` | Rai Dispatch company, carrier support | Real legal identity, verifiable contact details, service model, and accountable team information |
| `/contact` | contact truck dispatcher, dispatch quote | Working phone/text/contact channels and a short equipment/lanes intake |
| `/faq` | dispatch questions, load approval, onboarding and billing | Direct answers consistent with pricing, service descriptions, and agreements |

The resource paths above match `src/lib/dispatch-content.ts`. Service detail routes under `/services/[slug]` cover rate negotiation, load booking, broker communication, route strategy, paperwork support, and scheduling. Do not create a second page for a keyword synonym when one clear page already answers the intent. Equipment pages describe support subject to fit and availability; they must not promise freight access that has not been established.

Use keywords naturally in the title, H1, explanatory text, relevant image descriptions, and contextual links. A separate page should answer a separate customer problem. Avoid copied city/state pages and lists of place names whose only purpose is ranking. Google explicitly addresses keyword stuffing, doorway pages, and scaled low-value content in its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies). The `keywords` meta tag has no Google indexing or ranking effect: [supported metadata](https://developers.google.com/search/docs/crawling-indexing/special-tags).

## Pricing and trust decisions

- The owner authorized percentage dispatch fees up to 5%. Explain whether the fee uses gross load revenue and which charges are included. Match the executed dispatch agreement.
- Do not label 5% the market's lowest rate. Public competitors advertise lower percentages, including [Grow Trucking](https://www.growtrucking.com/) and [Trucking42's published proposal](https://trucking42.com/wp-content/uploads/pdf/dispatch_services.pdf). Their packages and conditions differ, so these observations are not a like-for-like price comparison.
- “Largest,” “best,” guaranteed first place, guaranteed loads, and guaranteed earnings require evidence or cannot be promised. Present actual service strengths instead.
- Preserve the working contact email until the replacement mailbox and delivery are verified. A web-domain migration does not automatically migrate email.
- Use actual company details and genuine customer evidence. Do not manufacture local offices, certifications, broker relationships, case studies, customer counts, or star ratings.

Google recommends useful, original content that answers the audience's needs and demonstrates real expertise: [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Migration and launch checklist

Google recommends permanent server-side redirects, accurate URL mapping, updated canonicals and internal links, and a new sitemap. Keep old-domain redirects for at least a year. Use Search Console's Change of Address for the applicable verified old-domain variants. Temporary search visibility fluctuations are possible: [site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

- [x] Confirm the intended Vercel project/repository and keep the existing deployment available for rollback.
- [x] Add `raidispatch.com` and `www.raidispatch.com` to the project; apply the exact DNS records Vercel requests.
- [x] Preserve unrelated DNS, especially MX and email authentication records. Confirm TLS issuance before relying on the new host.
- [x] Choose `https://raidispatch.com` as canonical. Redirect the alternate new-domain hostname to it.
- [x] Redirect both `railogistics.us` and `www.railogistics.us` to equivalent new URLs with 301 or 308 responses, preserving paths and queries where appropriate. Check representative deep links and avoid loops.
- [x] Verify the new home, all existing routes, and every new route return the correct content and status; nonexistent paths must return 404.
- [x] Verify rendered titles, descriptions, canonicals, Open Graph/Twitter URLs and images, and structured-data IDs reference the correct page and new host.
- [x] Confirm robots permits public content, the sitemap uses only canonical public URLs, and production has no accidental `noindex`.
- [x] Verify internal links, mobile navigation, CTA links, focus visibility, and contact-form validation.
- [x] Run production build/type checks and inspect mobile and desktop rendering. Measure performance rather than assuming a score.
- [x] Check `GET /api/lead` on the new host: HTTP 200, Resend configured, webhook off, carrier auto-reply on.
- [ ] Verify actual notification delivery with an explicitly authorized production test and recipient inbox check; configuration and local test-sink results are not inbox-delivery proof.
- [x] Verify both domain properties in Google Search Console (DNS verification completed on 24 September 2026).
- [x] Submit the new sitemap after production verification: Google processed it successfully and discovered 30 pages on 24 September 2026.
- [x] Complete Change of Address for the former canonical `https://www.railogistics.us/` property to `raidispatch.com`; Google confirmed the move started on 24 September 2026.
- [ ] Retry the additional apex-host Change of Address after Google can fetch its homepage. Public redirects work, but Google's required apex fetch check still failed after one bounded retry. The confirmed www-host migration remains active.
- [x] Update the existing Analytics web stream name and URL while retaining its measurement ID (completed 24 September 2026; details below).
- [x] Update the GitHub repository website link to `https://raidispatch.com` and its description to Rai Dispatch.
- [ ] Review any existing ads destinations and external business profiles; these were not changed in this website release. Their old-domain links continue through the permanent redirects.
- [x] Record the deployment URL, commit, DNS/redirect checks, Search Console actions, and any outstanding tasks in the handover.

## Structured data

Use consistent Organization/WebSite identifiers and accurate Service and BreadcrumbList data where appropriate. Data must match visible content; do not add ratings or offers unsupported by the page. Schema does not guarantee a rich result: [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization).

FAQ content is still useful for customers. However, Google stopped showing FAQ rich results on 7 May 2026 and subsequently removed the feature documentation. Do not promise a FAQ rich snippet benefit: [Google Search documentation changelog](https://developers.google.com/search/updates).

## Lead endpoint migration review

Read-only findings from `src/app/api/lead/route.ts` and the form callers:

- Client forms post to relative `/api/lead`; the route has no old-domain origin allowlist or hardcoded web-domain dependency. Submitted page URLs use the current browser location or request referrer.
- Notification branding comes from `BUSINESS.name`. The owner's inbox uses `LEAD_TO_EMAIL`, falling back to `BUSINESS.email` (`sam@railogistics.us` at audit time).
- Resend delivery requires `RESEND_API_KEY` and `LEAD_FROM_EMAIL`. The sender must remain on an authenticated sending domain. A new website hostname does not require immediately changing a working sender.
- `LEAD_WEBHOOK_URL` is an optional additional delivery channel. Do not rotate or replace it simply because the public hostname changed.
- The public GET check only tests whether environment variables exist. It does not verify the API key, sender-domain verification, provider acceptance, or inbox receipt.
- On 24 September 2026 at 12:06 UTC, following the old-host GET redirect reached `https://www.railogistics.us/api/lead` with HTTP 200 and reported `resend: true`, `webhook: false`, `autoReply: true`. No delivery test was performed. This records the old site's configuration, not the new deployment's readiness.
- POST validation and failed deliveries return errors rather than claiming a lead was delivered. Auto-replies run after a successful notification channel. A production submission could send both a notification and an acknowledgement; do not use invented visitor details for live testing.
- `SETUP.md` now uses the new website URL while deliberately retaining old-domain email examples. Moving the web domain does not create a new mailbox or verify a new sending domain.

## Post-launch measurement

The initial public audit did not verify search rankings, analytics, indexing success, or field Core Web Vitals. During the subsequent authorized setup, both `raidispatch.com` and `railogistics.us` domain properties were created and DNS ownership verification succeeded in the owner's Google Search Console account on 24 September 2026. Their overview reports initially showed data processing. Production submission results are recorded below; sitemap discovery does not establish that every URL is indexed or ranking.

### Verified Search Console submission results

After the live production website and old-domain redirects were confirmed, `https://raidispatch.com/sitemap.xml` was submitted under the `raidispatch.com` domain property. The UI confirmed submission, then the sitemap detail screen reported **Sitemap processed successfully**, last read **24/09/2026**, **30 discovered pages**, and **0 discovered videos**. The table's transient initial fetch message cleared in the processed detail result.

The original site used `https://www.railogistics.us/` as its canonical production host. That URL-prefix property was added and automatically verified using the existing DNS ownership. Google's Change of Address validation passed with the deployed permanent redirects. The **Confirm move** action succeeded, and the resulting screen states **This site is currently moving**, from **www.railogistics.us** to **raidispatch.com**, with **Date started 24 September 2026**.

An additional request for the apex hostname remains unresolved. The `railogistics.us` domain-property attempt reported **Couldn’t fetch the page** at `http://railogistics.us/`. The automatically verified `https://railogistics.us/` URL-prefix attempt also failed the required homepage fetch check, including one bounded retry; ownership verification passed. No failed check was overridden and no apex move was confirmed. Independent public HTTP checks reach the destination successfully: HTTP uses Vercel's HTTPS upgrade, HTTPS redirects to `https://raidispatch.com/`, and the destination returns 200. The same 308 redirect type passed validation for the www host, so this evidence does not establish a redirect-status incompatibility. Retry the additional apex request after Google can fetch it; retain both public redirects and the already-confirmed www migration.

Google's [Change of Address guidance](https://support.google.com/webmasters/answer/9370220?hl=en-EE) calls for separate source-host variants and requires critical validation checks to pass. The tool covers protocols for the selected source host. No separate HTTP request is needed for the confirmed www-host move.

### Verified Analytics configuration update

On 24 September 2026, the existing GA4 web stream was matched to the exact public measurement ID in `src/components/Analytics.tsx` and the live website: `G-K31P16P0SB`. The existing account ID is `380322625`, property ID `551675367`, and web stream ID `15501310545`.

The stream name was changed from **Rai Logistics** to **Rai Dispatch**, and its website URL from `https://www.railogistics.us` to `https://raidispatch.com`. The saved stream-details screen confirmed both new values. The measurement ID, property, existing events, and other settings were retained. No new Analytics account, stream, credentials, or integrations were created.

The stream reported receiving traffic in the previous 48 hours. The Analytics Home snapshot for the displayed last-seven-day period (17–23 September) showed 23 active users, 124 events, and 0 key events. These are an observed all-traffic snapshot, not a verified organic-search baseline, conversion audit, or proof of traffic from the new domain. Verify post-launch collection and meaningful lead events separately.

| When | What to record | What to do with it |
| --- | --- | --- |
| Launch | Deployment/commit, old-to-new redirect samples, HTTP statuses, canonical tags, sitemap, form configuration | Resolve technical failures immediately and keep a rollback reference |
| First week | Search Console sitemap processing, indexing/canonical reports, server errors, old/new host traffic | Investigate crawl barriers, incorrect canonicals, missing paths, or broken conversions |
| Weekly during migration | Clicks and impressions by query and landing page, brand vs. non-brand searches, mobile performance | Confirm discovery of new URLs; compare both domain properties before concluding traffic was lost |
| Monthly | Qualified calls/enquiries, landing-page conversion rate, equipment and pricing queries, engagement with guides | Improve pages around actual customer questions and lead quality |
| After enough field data | Core Web Vitals by device, top organic landing pages, conversion trends | Prioritize problems users experience; avoid treating a single lab score as a ranking prediction |

Do not automate public status claims from a configuration check. Use existing analytics events for phone, message, and successfully delivered form actions, and verify they correspond to the intended interaction. Keep personal lead data out of analytics payloads.

## Limits and continuing work

Technical SEO makes content accessible and understandable; it does not purchase or guarantee rankings. Domain migrations require recrawling and can take weeks or longer. Broad keyword coverage comes from useful content and an established business reputation, not repeating every possible phrase. Search engines decide indexing and placement.

Further growth depends on accurate first-hand content, genuine customer feedback, verifiable business information, relevant earned references, reliable service, and ongoing measurement. Add lane-specific case studies only when the underlying records and customer permissions exist. Revisit pricing, equipment availability, onboarding requirements, and published guidance when operations change.

## Implementation and validation record

The site is live at `https://raidispatch.com`. The main implementation is commit `a5ae580`; release `1999344` deployed successfully, followed by rendering/accessibility improvements in `73199c9f2436d1ea7a0b0bdec79f6d00b206ed1d`. Vercel marked the latter Production / Ready on 24 September 2026. Its immutable deployment is [fazeel-rai-logistics-a9ri8p47p-fazeel-arshads-projects.vercel.app](https://fazeel-rai-logistics-a9ri8p47p-fazeel-arshads-projects.vercel.app), with the public canonical domain serving the release.

- Repository: `royfazeel/Fazeel-Rai-Logistics`; existing Vercel project: `fazeel-arshads-projects/fazeel-rai-logistics`. Previous production source: `1c3cc489697288c94ba5783b5c7f7acab3005a84`.
- New web DNS: apex A `216.198.79.1`; `www` CNAME `4fceb2910ff04c7c.vercel-dns-017.com`. Existing mail records preserved. Vercel reports valid configuration for both hosts.
- Public HTTPS checks: new apex HTTP 200; `www.raidispatch.com`, `railogistics.us`, and `www.railogistics.us` each return a direct HTTP 308 to the equivalent canonical new URL. Home and `/equipment/dry-van?source=migration-check` samples preserve paths and queries. HTTP old-host requests first upgrade to HTTPS through Vercel, then reach the new host; no loops were observed.
- Production build succeeds on Next.js 15.5.26, with 30 indexable content pages. TypeScript and diff whitespace checks pass. Dependency audit reports zero known vulnerabilities at check time.
- Local and production rendered-HTML crawls: 30/30 sitemap URLs and 141 internal links/fragments pass; unique titles/descriptions, canonical and Open Graph URLs, one H1, crawlability, and JSON-LD syntax checked. One advisory is a 71-character guide title; this is not a rendering or indexability failure.
- Contact route harness: 17/17 checks pass, including validation, spam controls, notification/acknowledgement flow, escaping, provider failures, and unconfigured-service response. All test messages went to a local fake service; no real email was sent.
- Mobile menu and quote-modal validation checked locally and on production in a 390px viewport; no horizontal overflow on sampled home/equipment pages. Decorative video sources remain absent on mobile. Desktop guide and home layouts inspected. Temporary viewport override reset.
- Branded Open Graph image renders as a 1200×630 PNG, and its production endpoint returns HTTP 200 / image/png. Unknown routes return 404. All five original equipment anchor IDs and six service anchor IDs remain present in production for incoming fragment links. Production browser checks showed no console warnings or errors on the sampled home/form flow.
- Google Analytics property and stream now use Rai Dispatch; stream URL is `https://raidispatch.com`. Measurement ID `G-K31P16P0SB` is preserved. Both Search Console domain properties are verified. The sitemap is processed with 30 discovered pages and the former canonical www-host move is confirmed; the additional apex validator issue is documented above.

Maintain the old domain and its mail/DNS service so permanent redirects and existing email keep working. Keep the redirects for at least one year and preferably longer while external links still use the old host. Follow the Search Console indexing and migration reports as Google recrawls. A production inbox-delivery test and real-user Core Web Vitals remain distinct from the completed technical checks.

## Final PageSpeed lab results

Google PageSpeed Insights measured the live site on 24 September 2026 at 19:37 PKT, after production release `73199c9`. [Mobile report](https://pagespeed.web.dev/analysis/https-raidispatch-com/q1xt4ncmjr?form_factor=mobile) · [Desktop report](https://pagespeed.web.dev/analysis/https-raidispatch-com/q1xt4ncmjr?form_factor=desktop).

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 96 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO automated checks | 100 | 100 |
| Largest Contentful Paint | 2.6 s | 0.6 s |
| Total Blocking Time | 120 ms | 20 ms |
| Cumulative Layout Shift | 0 | 0 |
| First Contentful Paint | 1.0 s | 0.3 s |

The earlier production mobile run scored 61 performance / 96 accessibility, with LCP 6.7 s and TBT 440 ms. The final pass removed unnecessary hero motion wrappers, deferred the external Google tag until page load and idle while keeping its command queue, removed an unused preconnect, and corrected two contrast failures. The existing measurement IDs and conversion configuration remain intact. As with any deferred analytics library, a visit ending before it loads may not transmit queued events.

These are single Lighthouse lab runs, including a simulated slow mobile connection, not a guarantee for every visitor or a ranking score. PageSpeed had no real-user CrUX data yet. Remaining diagnostics include unused JavaScript and desktop decorative-media transfer; video stays disabled on mobile, reduced-motion, data-saver, and slow-connection configurations. Recheck field Core Web Vitals once enough visits have accumulated.
