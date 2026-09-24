# Rai Dispatch: SEO audit and domain migration

Audit date: 24 September 2026. Target website: `https://raidispatch.com`.

This document records the observed baseline and implementation plan. It is not a deployment certificate. The launch checklist stays unchecked until the corresponding production check is recorded by the operator. Repository changes and live website changes are separate states.

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

- [ ] Confirm the intended Vercel project/repository and keep the existing deployment available for rollback.
- [ ] Add `raidispatch.com` and `www.raidispatch.com` to the project; apply the exact DNS records Vercel requests.
- [ ] Preserve unrelated DNS, especially MX and email authentication records. Confirm TLS issuance before relying on the new host.
- [ ] Choose `https://raidispatch.com` as canonical. Redirect the alternate new-domain hostname to it.
- [ ] Redirect both `railogistics.us` and `www.railogistics.us` to equivalent new URLs with 301 or 308 responses, preserving paths and queries where appropriate. Check representative deep links and avoid loops.
- [ ] Verify the new home, all existing routes, and every new route return the correct content and status; nonexistent paths must return 404.
- [ ] Verify rendered titles, descriptions, canonicals, Open Graph/Twitter URLs and images, and structured-data IDs reference the correct page and new host.
- [ ] Confirm robots permits public content, the sitemap uses only canonical public URLs, and production has no accidental `noindex`.
- [ ] Verify internal links, mobile navigation, CTA links, focus visibility, and contact-form validation.
- [ ] Run production build/type checks and inspect mobile and desktop rendering. Measure performance rather than assuming a score.
- [ ] Check `GET /api/lead` on the new host. Separately verify actual notification delivery using an owner-approved recipient when authorized; configuration status alone is not an end-to-end test.
- [x] Verify both domain properties in Google Search Console (DNS verification completed on 24 September 2026).
- [ ] After production/redirect verification, submit the new sitemap and complete the applicable Change of Address steps.
- [x] Update the existing Analytics web stream name and URL while retaining its measurement ID (completed 24 September 2026; details below).
- [ ] Update ads destinations, business profiles, and owned external links where access and authorization permit.
- [ ] Record the deployment URL, commit, DNS/redirect checks, Search Console actions, and any outstanding tasks in the handover.

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
- `SETUP.md` retains old-domain setup examples. They describe the current sender setup and should be updated carefully after the intended sending domain is confirmed, rather than blindly replacing every email address.

## Post-launch measurement

The initial public audit did not verify search rankings, analytics, indexing success, or field Core Web Vitals. During the subsequent authorized setup, both `raidispatch.com` and `railogistics.us` domain properties were created and DNS ownership verification succeeded in the owner's Google Search Console account on 24 September 2026. Their overviews report data processing. The old domain's Change of Address screen accepts `raidispatch.com` as a verified destination; validation/update has not been submitted. Sitemap submission and Change of Address remain pending production readiness.

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
