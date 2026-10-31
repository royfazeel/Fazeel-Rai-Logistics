# SEO implementation handoff — October 31, 2026

This records decisions against the supplied implementation brief, with **Section 0 controlling all older templates**. It is a review and integration handoff, not a deployment certificate or a guarantee of indexing, rankings, citations or legal compliance. The starting checkout was `dccb34ca`; parallel integration must be checked against the final release. The metadata/editorial deliverables are `src/lib/page-overrides.ts`, this file and `editorial-backlog.csv`; the later consent-measurement implementation is documented below. No articles are automatically published from the CSV.

## Verified facts and scope

- The owner-approved percentage schedule is box truck 7%, dry van 5%, reefer 4%, flatbed 5%, power only 5%, step deck 5%, hotshot 6%, cargo van 12%, Sprinter van 5%, Conestoga 4%, RGN/lowboy 5%, car hauler 5%, tanker 5%, dump truck 5% and curtain side 5%. The published Other category is 5% subject to availability, but unknown calculator keys must not silently receive it. Other needs confirmation, not an automatic estimate.
- Cargo and Sprinter are separate published service categories by truck type. No additional wheelbase, roof, payload, brand or service-level threshold has been supplied. Both prices must remain adjacent with a request to confirm the applicable category; an operational rationale must not be invented.
- The owner confirmed manual inquiry replies and requested callbacks only. This work does not opt a lead into automated marketing. The existing transactional courtesy confirmation email remains separate from marketing, as do operational SMS instructions for active carriers. Remove unsupported “10DLC compliant” labels and blanket website-form phone consent; retain active-carrier STOP/HELP instructions pending operational verification. Do not add the old marketing-consent paragraph, promise a five-year retention period or describe new tracking that does not exist.
- The latest explicit brief authorizes separate consent-gated GA4 and Google Ads measurement, superseding the old disabled-analytics source comment. The owner subsequently authorized setting up the accounts/IDs. GA4 account/stream setup and public IDs are now verified; the production build environment is prepared for GA4-only activation. The activation release is not yet deployed. The explicit enable flag and verified ID are required, and each visitor must separately opt in. Ads IDs remain blank. Do not claim live Google delivery from account creation, environment configuration or passing local tests.
- Active carriers receive 24/7 live dispatch support. The new-carrier setup desk remains Monday–Saturday, 8 AM–6 PM CT. These are different contact contexts.
- A live HTTP review on October 30 at 20:53 UTC found the box page at 200 with current 7% visible copy and Service/Offer descriptions, one canonical, index/follow and no X-Robots restriction. HTTP, www and trailing slash redirected to the canonical. The sitemap contained 67 URLs and the box URL; home, equipment, services, pricing and the box-load guide linked to it in page content. Declared crawler-header requests returned the same content. This did not authenticate engine IPs or establish rankings.
- Separate Search Console evidence showed the box page indexed with the intended canonical, a stored October 7 crawl, and a newer successful smartphone live test showing 7%. Live eligibility and Google's stored crawl are different observations. The sampled external-links report showed zero; that is not proof no links exist anywhere.
- The latest Google/ChatGPT nonbrand samples did not select Rai. Earlier prompted brand lookups sometimes showed stale or wrong fees. Treat crawl timing, index state and synthesis error as hypotheses; the cause is not established. Branded lookups, nonbrand discovery, fee accuracy, access failures and personalized mentions must be reported separately.

## Section 0 acceptance matrix

| Requirement | Decision and integration status | Required evidence before claiming complete |
|---|---|---|
| One fee map; preserve approved rates | Use `dispatch-pricing.ts` for percentage points. Metadata now imports the range/rate helpers. Core pricing integration is handled with the release. | Independent fixtures for all 15 rates; Other/invalid selection tests; no incorrect fallback in forms, schema or calculators. |
| Exact box/cargo/Sprinter and pricing copy | Section 0 wording takes precedence over Sections 6, 8 and 14. Preserve cargo 12% versus Sprinter 5%; no unsupported effective date. | Raw and rendered HTML, visible FAQ, table and Offer descriptions agree; reciprocal van-category links work. |
| Metadata overrides | New map contains 67 final title/description/H1 entries. P0 overrides are applied; `/what-to-expect` replaces `/testimonials`. | The SEO helper uses absolute titles with no second suffix; each live H1 consumes its override; current values meet 60/158 limits. |
| Fee math and labeling | $2,000 gives box $140/$1,860, cargo $240/$1,760 and Sprinter $100/$1,900. Remainder is revenue before operating costs. | Decimal-safe currency calculations, explicit valid selection, selected rate/label agreement, switching and validation checks. |
| Schema truthfulness | Preserve Service/Offer/BreadcrumbList and the stable Organization identifier. Commission percentages belong in descriptive text, not USD price fields. | Parsed JSON-LD matches visible content; free calculator may retain genuine 0 USD software price. |
| Baseline and variant investigation | Preserve canonical URLs and correct redirects; do not rename pages to escape an old AI citation. | Saved response/status/schema evidence for home, pricing and three priority pages; inspect known old public deployments only when identified. |
| Release and recrawl | Publish through the authorized workflow only after the final checks. Notify changed URLs through existing search tools when available. | Actual deployment result, production HTML/schema and meaningful changed-URL receipt. No invented reindex success, sitemap dates or AI refresh claim. |
| Privacy, identity and access guardrails | Manual replies/callbacks; optional measurement remains off until separately configured and consented. Preserve `/api/` exclusion and current functioning identity/contact details. | Form behavior matches visible copy; no invented retention, reviews, founding date, profile, office or mailbox. |
| Useful content rather than bulk pages | All 112 numbered proposals are in the CSV with a status and an existing canonical target. | Editor checks distinct value, primary evidence and any owner decisions before publication; no word-count or location-page quota. |
| AI accuracy follow-up | Repeat exact discovery and prompted fee questions in clean contexts, recording cited URLs, date and region. | Engine answer evidence is separate from live-site correctness. A citation with an incorrect fee remains an accuracy failure. |

## T1–T17 requirement matrix

| ID | Requirement | Disposition under Section 0 | Integration / verification handoff |
|---|---|---|---|
| T1 | Titles, descriptions, H1s | Prepared: 67 entries in `page-overrides.ts`; final strings checked. Exceptions below protect truthfulness. | Wire map into metadata and visible headings; preserve unique canonicals and single H1s. |
| T2 | 404 metadata and helpful links | Required; preserve real HTTP 404 and noindex. | Verify requested title/H1 plus equipment, pricing, contact and resource links on a nonexistent URL. |
| T3 | Sitemap dates and images | Required; use actual edits, not build time. | Keep image entries, replace the approved renamed URL and add only shipped pages. Metadata edits may justify real route revision dates. |
| T4 | AI crawler robots groups | Existing wildcard allowance already permits public search crawling. Do not copy older explicit groups that omit `/api/`. | Keep current restrictions. A future policy change must distinguish training, search and user fetches and repeat applicable exclusions in specific groups. Header spoof tests are not authenticated bot checks. |
| T5 | llms.txt and llms-full.txt | Optional semantic experiment, not an indexing prerequisite. Section 8 cannot be published verbatim with nonexistent data pages or unverified statistics. | If included, derive truthful fees from the map, link only shipped canonical pages and keep it synchronized. No ranking/AI-use claim. |
| T6 | Security and cache headers | No blanket HSTS preload/includeSubDomains, global cache replacement or automatic CSP enforcement. | Inspect actual hosting/subdomains first. Only compatible justified changes; CSP report-only needs actionable monitoring, not a one-week timer as evidence. |
| T7 | H1 whitespace | Required where visual line breaks join extracted words. | Use readable text spacing or block spans with the final H1 override on home/equipment/service areas. |
| T8 | Mobile tap targets | Required accessibility review; earlier modal stacking/table containment changes are preserved. | Render narrow screens and check navigation/footer targets, focused inputs, scroll containment and sticky controls. Source classes alone do not prove WCAG conformance. |
| T9 | Image alt text | Describe meaningful content images; keep decorative backgrounds empty/hidden. | Assess actual image purpose. Do not convert a decorative CTA background into redundant announcement text. |
| T10 | FAQPage | Optional visible-content semantics. Google's FAQ rich-result feature was retired in 2026; no rich-result benefit can be promised. | If added, questions and answers must match visible content exactly; avoid duplicate FAQ entities and unverified claims. |
| T11 | Article schema and dates | Preserve actual Article dates/Organization author; add supported about/citation only where accurate. | Never create a fake person or reset publication dates. Visible published/updated dates must agree with schema. |
| T12 | Calculator WebApplication | Preserve the existing free calculator's accurate application schema. | BusinessApplication/Web operating system and legitimate 0 USD software offer must describe the tool, not a percentage dispatch commission. |
| T13 | Testimonials rename | Approved destination `/what-to-expect`; metadata map uses destination only. | Implement 301 from `/testimonials`, update internal links/footer/sitemap and preserve existing service commitments without fake reviews. |
| T14 | Organization identity/profile changes | Owner evidence required for new sameAs, founding date, team details and replacement mailbox. Existing legal name, contact and legitimate alternate brand remain. | Do not infer founding date from domain registration, remove Rai Logistics solely for no trademark proof or invent a staffed office. Profile eligibility must be checked before creation. No arbitrary logo dimensions required for rankings. |
| T15 | Manifest description | Safe factual update covering supported equipment, subject to the same scope/fee map. | Check rendered manifest and valid icon references; do not add unsupported capability claims. |
| T16 | Visible/schema breadcrumbs | Required for listed static pages; use canonical destinations. | Pricing, FAQ, about, contact, privacy and terms breadcrumbs must agree with the page and existing graph identifiers. |
| T17 | Bing and IndexNow | Bing ownership and prior sitemap submission already completed using the chosen account; prior sitemap succeeded with 67 discovered URLs. | Recheck only material current changes. IndexNow should submit actual changed/deleted URLs, not every route per deployment; accepted notifications do not guarantee indexing. |

## Metadata exceptions and integration notes

The brief's parenthetical length labels were discarded and actual Unicode string lengths measured. All 67 final titles are at most 60 characters; all descriptions are at most 158. H1s are not constrained to title length. Fee strings resolve from the approved map; a fee change should rerun these bounds. Titles are **absolute**, including any intended `Rai Dispatch` suffix already present. Do not append another suffix in Open Graph, Twitter or document titles.

| Page | Conservative deviation | Reason |
|---|---|---|
| `/about` | Describe the carrier service instead of “Meet the dispatch team”. | No approved team profiles were supplied. |
| `/carriers/small-fleets` | Remove “2–10 trucks”. | No actual supported fleet-size threshold was confirmed. |
| `/contact` | Explicitly label the stated hours as the new-carrier setup desk. | Avoid conflating setup hours with 24/7 active-carrier support. |
| `/editorial-standards` | “Handles corrections” and “report a possible error”; remove “fast corrections”. | Do not invent an unconditional fix promise or response-time standard. |
| `/privacy` | Privacy Policy title/H1 and neutral data-use description. | Do not advertise new marketing consent or unconfirmed retention. Existing operational SMS text can remain without an unsupported metadata promise. |
| `/resources/detention-layover-tonu-documentation` | Documentation “supports accessorial requests”. | Emails and documentation do not guarantee payment. |
| `/resources/how-to-choose-a-truck-dispatcher` | “Carrier Checklist” instead of “12-Point Checklist”. | Existing guide has six numbered sections, not a published twelve-point list. |
| `/resources/how-to-find-box-truck-loads` | Refer to direct carrier programs rather than Amazon Relay. | The existing guide does not establish a specific Amazon Relay section or program eligibility. |
| `/resources/new-authority-broker-approval` | “Practical follow-up questions” instead of “speed approval”. | No approval-speed promise is supported. |
| `/services` | Shorten service list while retaining 24/7 active-carrier support. | The supplied description is 161 actual characters, exceeding 158. |
| `/what-to-expect` | Remove promise to add verified reviews as collected. | No review publication workflow or verified set was supplied; page remains service commitments. |

Section 0's exact four metadata overrides replace the older box, cargo, Sprinter and pricing rows. No new keyword-synonym pages are introduced. The glossary's count claim was checked against its existing 40 defined terms. “US company” and the existing legal identity describe the supplied entity, not a claim that the registered-agent address is a staffed customer location.

## Editorial backlog and publication gates

`editorial-backlog.csv` preserves all **112 original numbered items**, titles, proposed URLs and query families for traceability. Statuses are: `existing` (12), `update` (40), `research` (39), `ownerdecision` (4) and `deferred` (17). These describe editorial disposition, not release completion. Every row names an existing canonical destination to consult or improve first; the brief's proposed URL is not authorization to create it. `/what-to-expect` is the explicitly approved destination for the existing commitments page.

Keep `/resources/how-to-find-box-truck-loads` and the established chooser, fee, agreement, role-comparison and equipment guides. The existing load-profit calculator already covers loaded/total-mile rates and empty-mile share; the fee calculator already has a pricing-page anchor. New parallel tools need a distinct user task, not another keyword.

State/lane proposals are deferred until there is actual distinct regional evidence. Career and salary topics are deferred because they address job seekers rather than prospective carriers. Market-rate, competitor-quote, program and legal topics require fresh primary verification. The supplied 3–15% range, 6.5% median, weekly rates, fleet counts and equipment capacities are research leads, not verified publishable facts. A source licensing/update owner is needed before promising weekly or monthly datasets. Do not substitute fleet-average trucking costs for a small carrier's measured box-truck or van costs.

No legal, regulatory or tax article is drafted by this handoff. For any future such article, verify the current applicable FMCSA/eCFR rules, state requirements, IRS/UCR/IFTA material and exact vehicle/operation; distinguish a proposal from an effective rule. Manufacturer model-specific specs and written shipment instructions must control capacity and temperature examples. Broker/program acceptance is separate from a statutory requirement. Contract templates and definitive legal recommendations require qualified review.

## Owner decisions that remain separate from this implementation

1. Provide an operational cargo-versus-Sprinter classification only if the business has one beyond selecting the published truck type. Until then, preserve both prices and confirm category before onboarding.
2. Supply verified profile URLs, team identities, founding evidence, a working replacement mailbox, actual leased-on-carrier eligibility or fleet-size limits before using those claims. These do not block accurate core pages.
3. Provide real review links and permission before a review page. The brief's five-review threshold is an editorial gate, not a Google requirement. Never fabricate ratings or use service commitments as testimonials.
4. Choose a data maintenance owner and verify source rights before recurring market reports. No scheduled publishing is created here.
5. Automated marketing is not authorized by the measurement request. The GA4 destination is verified; complete deployment and the live measurement checks below; any future marketing or retention change remains a separate operational decision.

## Current primary guidance reviewed

- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features): normal crawl/index/snippet eligibility, useful text, internal discovery and matching structured data remain relevant. No special AI file/schema is required and eligibility does not guarantee serving.
- [Google Search documentation updates](https://developers.google.com/search/updates): June 15, 2026 documents FAQ rich-result retirement and clarifies that llms.txt is not required for Google Search. This supersedes the old 2023 government/health-only FAQ assumption.
- [Google robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec): specific groups must retain applicable exclusions; do not assume wildcard restrictions are inherited.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): OAI-SearchBot is search, GPTBot is training and ChatGPT-User is user-triggered fetching. Permit the intended crawler and check official IP evidence when investigating access. These controls do not guarantee citation or immediate correction.
- [Anthropic crawler guidance](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): Claude-SearchBot, Claude-User and ClaudeBot have distinct search, user-fetch and training purposes; they respect robots controls. Its official linked IP list can support provenance verification.
- [OpenAI search help](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt): answers and citations can be outdated or incorrect. A fresh source-focused query is an accuracy check, not a publisher purge mechanism or a neutral discovery result.

These sources were checked during the October 31 local-date implementation review. No browser ranking experiment, new search-console request or deployment is asserted by this handoff. The consent runtime has focused mocked tests; real-provider checks and final build/release verification belong to integration. Final production evidence belongs in the release report after integration.

## Optional measurement: implementation and activation gate

The user authorized GA4/Ads measurement and then asked for account setup rather than supplying existing IDs. The user approved the applicable Google Terms of Service and Data Processing Agreement. GA4 is configured under `royfazeel@gmail.com`: account `414217134`, property `561722074`, web stream `16242642206`, measurement ID `G-8LS0S1WC76`, Google tag `GT-KDTMVPXW`. The numeric stream ID and tag ID do not replace the `G-…` measurement ID used by this implementation. Vercel production environment configuration now has the explicit enable flag and this GA4 ID; both Ads ID/label values are blank. This prepares the next build and does not activate a previously deployed bundle. Deployment and live Google delivery verification are still pending.

`ConsentMeasurement` is mounted once after the footer. `consent-measurement.ts` contains the configuration gate, limited browser preference format and testable event routing; `track.ts` loads the Google tag only after an applicable explicit consent choice. The UI describes only the configured providers; the planned activation exposes Analytics alone.

Public build-time configuration (IDs are public, not credentials):

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_MEASUREMENT_ENABLED` | Production build environment: `true`. Absent/false keeps all measurement UI and provider loading off even if old IDs remain. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production build environment: verified `G-8LS0S1WC76`; analytics is independent of Ads. |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Blank. No Google Ads provider/destination is activated. |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Blank. No Google Ads conversion action is activated. |

Both optional choices start denied globally. This is **basic consent mode**: no Google tag or consent ping before opt-in. Reject all and independent checkboxes are available; Measurement settings remains at the bottom of the page after a choice. Preferences contain only version, the two choices and the save time, separately from lead data. Invalid stored values are ignored. A storage failure fails closed for the current page and visibly explains that future-visit persistence failed. Withdrawing a previously granted choice closes the event gate, updates consent, clears accessible matching first-party measurement cookies and reloads to unload the old provider. Existing Google-held information is not erased by this action. Cross-tab changes are applied. If destinations or consent purposes change, increment the preference storage/version and obtain new choices.

GA4 events are `page_view`, `generate_lead` for an API-accepted form, and separately named `call_click`, `sms_click`, `whatsapp_click`, `email_click` and `quote_modal_open` interactions. The prepared Ads path would send a configured `conversion` only for accepted form submissions, but it is inactive because Ads IDs are blank. There is no call forwarding/completion measurement, revenue estimate, enhanced conversion, remarketing, user ID or form-value payload. Event parameters use an allowlist of code-owned placement/source labels; page URLs exclude query strings and fragments. Referrers retain only valid HTTP(S) origins: no paths, credentials, query strings or fragments. Unsupported or missing referrers become blank. Later client-side pageviews use the previous page origin; no full previous-page URL is sent. Declined/pre-consent events are not queued for later replay. The provider still receives normal network/browser information after consent; do not describe consented measurement as anonymous or as sending no personal data at all.

**Setup completed; final readback/deployment pending:** GA4 enhanced measurement is off. Automatic user-provided-data capabilities and autodetection are off, as are automatic history/page-change, scroll, click, form, video and file-download events; the final UI readback is being completed. The application keeps Google signals, enhanced conversions and personalized advertising disabled. GA4-only privacy/terms disclosures and provider-specific consent wording are prepared for the activation release. The build using the real public measurement ID and its type checks passed.

**Remaining activation evidence:** finish the settings readback, deploy the prepared build, verify the production configuration and matching disclosures, and check real browser network behavior for initial denial, reject all, Analytics opt-in and withdrawal. Distinguish accepted-lead events from contact clicks and verify origin-only referrers. Confirm Google receipt separately from browser requests; no delivery or attribution success is yet claimed. Do not send real unsolicited test leads. Consent controls and test results are not a legal-compliance certification or an attribution guarantee.

`node scripts/verify-consent-measurement.mjs` passed ten independent scenario groups against the actual TypeScript runtime and browser adapter with mocked ports: disabled/invalid configuration, denied/pre-consent silence, analytics-only routing, Ads-only routing, granular upgrades/single provider/pageview deduplication, withdrawal (including pending load), limited preference parsing, actual script/URL/cookie behavior, strict HTTP(S)-origin referrer sanitization and initial/client-side navigation referrer handling. These tests make no Google network calls and do not verify a live account, the rendered dialog, real conversion delivery or attribution. Full integration/browser checks are separate.

Primary references checked for this implementation: [Google basic/advanced consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [consent defaults and updates](https://developers.google.com/tag-platform/security/guides/consent), [Google privacy controls](https://developers.google.com/tag-platform/security/guides/privacy), [manual GA4 pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views), [recommended generate_lead event](https://support.google.com/analytics/answer/9267735), and [Ads conversion event versus phone measurement](https://support.google.com/google-ads/answer/7548399).

## Measured metadata lengths

These are the resolved current strings, including the intended brand suffix and punctuation; supplied parenthetical counts are not used.

| Canonical path | Title characters | Description characters |
|---|---:|---:|
| `/` | 57 | 155 |
| `/about` | 46 | 152 |
| `/carriers` | 60 | 149 |
| `/carriers/new-authorities` | 57 | 156 |
| `/carriers/owner-operators` | 59 | 152 |
| `/carriers/small-fleets` | 57 | 134 |
| `/contact` | 56 | 126 |
| `/editorial-standards` | 48 | 138 |
| `/equipment` | 59 | 154 |
| `/equipment/box-truck` | 50 | 131 |
| `/equipment/dry-van` | 59 | 156 |
| `/equipment/reefer` | 52 | 145 |
| `/equipment/flatbed` | 53 | 153 |
| `/equipment/power-only` | 56 | 140 |
| `/equipment/step-deck` | 50 | 152 |
| `/equipment/hotshot` | 60 | 151 |
| `/equipment/cargo-van` | 51 | 143 |
| `/equipment/sprinter-van` | 53 | 143 |
| `/equipment/conestoga` | 58 | 143 |
| `/equipment/rgn-lowboy` | 53 | 157 |
| `/equipment/car-hauler` | 51 | 143 |
| `/equipment/tanker` | 47 | 144 |
| `/equipment/dump-truck` | 51 | 140 |
| `/equipment/curtain-side` | 53 | 149 |
| `/faq` | 51 | 146 |
| `/pricing` | 54 | 142 |
| `/privacy` | 29 | 149 |
| `/resources` | 57 | 156 |
| `/resources/carrier-onboarding-checklist` | 57 | 150 |
| `/resources/detention-layover-tonu-documentation` | 46 | 147 |
| `/resources/evaluate-freight-rate-per-mile` | 54 | 156 |
| `/resources/flatbed-load-tarping-checklist` | 47 | 144 |
| `/resources/fuel-surcharge-calculation-for-carriers` | 54 | 158 |
| `/resources/hotshot-load-planning-checklist` | 47 | 144 |
| `/resources/how-to-choose-a-truck-dispatcher` | 52 | 146 |
| `/resources/how-to-find-box-truck-loads` | 53 | 143 |
| `/resources/load-board-vs-dispatch-service` | 50 | 145 |
| `/resources/local-vs-regional-vs-otr-trucking` | 48 | 155 |
| `/resources/new-authority-broker-approval` | 54 | 144 |
| `/resources/partial-truckload-vs-ltl` | 56 | 138 |
| `/resources/power-only-trailer-interchange-checklist` | 55 | 156 |
| `/resources/rate-confirmation-checklist` | 51 | 148 |
| `/resources/reduce-deadhead-miles` | 43 | 152 |
| `/resources/reefer-load-temperature-checklist` | 48 | 152 |
| `/resources/self-dispatch-vs-dispatch-service` | 50 | 150 |
| `/resources/truck-dispatch-fees` | 55 | 152 |
| `/resources/truck-dispatch-service-agreement-checklist` | 49 | 154 |
| `/resources/truck-dispatcher-vs-freight-broker` | 48 | 158 |
| `/resources/trucking-dispatch-glossary` | 52 | 157 |
| `/resources/verify-freight-broker-identity` | 45 | 150 |
| `/resources/what-does-a-truck-dispatcher-do` | 47 | 157 |
| `/service-areas` | 50 | 151 |
| `/services` | 51 | 144 |
| `/services/backhaul-dispatch` | 46 | 144 |
| `/services/broker-communication` | 56 | 150 |
| `/services/dedicated-dispatcher` | 53 | 151 |
| `/services/expedited-dispatch` | 48 | 152 |
| `/services/load-booking` | 41 | 133 |
| `/services/otr-dispatch` | 43 | 152 |
| `/services/paperwork-support` | 52 | 148 |
| `/services/rate-negotiation` | 52 | 152 |
| `/services/regional-dispatch` | 45 | 150 |
| `/services/route-strategy` | 50 | 116 |
| `/services/scheduling` | 51 | 136 |
| `/terms` | 31 | 134 |
| `/tools/load-profit-calculator` | 57 | 153 |
| `/what-to-expect` | 54 | 154 |
