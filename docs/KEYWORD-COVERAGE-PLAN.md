# Rai Dispatch organic search coverage

Updated October 30, 2026. This document records the observed search baseline, the purpose of each main destination, and how to assess the current content update. Query examples describe relevant visitor needs; they are not search-volume estimates or ranking promises.

## Search Console baseline

The live `raidispatch.com` domain-property report was reviewed with **3 months** selected. Its available data covered **September 23–October 27, 2026**:

| Measure | Observed value |
| --- | ---: |
| Clicks | 15 |
| Impressions | 743 |
| Click-through rate | 2% |
| Average position | 28.4 |
| Reported query rows | 53 |

The report already contains nonbrand searches. Examples with one click each were **“sprinter van dispatch”** and **“sprinter van dispatchers.”** The user's screenshot showed a shorter 24-hour view with additional nonbrand queries such as straight truck dispatch, step deck dispatch services, dispatch fee and truck freight rates per mile.

| Landing page | Clicks | Impressions | Average position |
| --- | ---: | ---: | ---: |
| `/equipment/sprinter-van` | 3 | 33 | 10.6 |
| `/resources/carrier-onboarding-checklist` | 1 | 76 | 48.1 |
| `/equipment/step-deck` | 0 | 41 | 71.6 |

These are historical observations, not evidence of a gain from the October 30 update. Search Console omits some query detail for privacy, so the displayed query rows cannot establish a complete branded/nonbrand share of the 743 impressions. Average position is an aggregate across the selected searches, locations and devices; it is not a fixed ranking for a page. The 24-hour view also includes preliminary data. [Google's report documentation](https://support.google.com/webmasters/answer/7576553)

## Primary destinations and query families

The starting site had 54 sitemap URLs: 13 main pages, 15 equipment pages, 11 service pages, three carrier pages and 12 guides. The October 30 expansion adds three guides, for 15 guides and 57 intended sitemap URLs. Preserve a primary destination for each distinct intent and use contextual links between related decisions. A single useful page can cover natural synonyms.

| Primary destination | Query family / visitor task | Page purpose and overlap control |
| --- | --- | --- |
| `/` | truck dispatch services, truck dispatch company, freight dispatch services USA | Introduce the service, equipment, pricing and carrier fit. Use the services hub for detailed scope. |
| `/services` | truck dispatch service scope, load dispatch support | Compare load search, negotiation, communication, paperwork and scheduling, then link to the relevant detail. |
| `/carriers/owner-operators` | owner-operator dispatch, independent truck dispatcher, dispatch for one truck | Explain the working relationship and the carrier's load decisions. |
| `/carriers/small-fleets` | small fleet dispatch, dispatch for multiple trucks | Explain availability, truck assignment, contacts and coordinated schedules. |
| `/carriers/new-authorities` | new authority dispatch, new MC dispatch service | Explain the service-fit review; link to onboarding and broker-approval guides for documents and eligibility. |
| `/equipment/dry-van`, `/equipment/reefer`, `/equipment/flatbed` | dry van dispatch, refrigerated truck dispatcher, flatbed dispatch | Explain equipment-specific load fit, costs and handling questions. Keep sizes and synonyms on the relevant page. |
| `/equipment/box-truck` | box truck dispatch, straight truck dispatch, 26-foot box truck dispatcher | Explain the offered dispatch support, payload, doors, loading access and available operating patterns. |
| `/equipment/sprinter-van`, `/equipment/cargo-van` | Sprinter van dispatchers, cargo van dispatch | Preserve separate equipment details and accurate clearance/payload questions; do not imply guaranteed expedited freight. |
| `/equipment/step-deck`, `/equipment/hotshot`, `/equipment/power-only` | drop deck dispatch, hot shot dispatcher, power only dispatch | Explain the actual configurations and booking checks. Other supported equipment remains discoverable through `/equipment`. |
| `/pricing` | truck dispatch pricing, dispatch percentage, dispatch fee calculator | Show Rai's current offer and calculator. The fee guide explains billing bases and comparisons. |
| `/resources/truck-dispatch-fees` | how much does a truck dispatcher cost, how dispatch fees work | Teach calculation, scope and invoice questions without duplicating the pricing page's sales purpose. |
| `/services/regional-dispatch`, `/services/otr-dispatch` | regional dispatch, OTR dispatch, long-haul dispatcher | Explain the respective service workflows and planning information. |
| `/services/dedicated-dispatcher`, `/services/expedited-dispatch`, `/services/backhaul-dispatch` | dedicated dispatcher, expedited dispatch, backhaul load support | Describe distinct working arrangements; a dedicated contact is not a guaranteed dedicated lane. |
| `/service-areas` | nationwide truck dispatch, lower 48 dispatch coverage | Explain actual remote coverage and regional planning needs without suggesting unverified local offices. |
| `/resources/carrier-onboarding-checklist`, `/resources/new-authority-broker-approval` | carrier onboarding documents, broker approval for new authority | Separate preparing a dispatch relationship from each broker's acceptance decision. |
| `/resources/evaluate-freight-rate-per-mile`, `/resources/reduce-deadhead-miles` | freight rate per mile, total-trip rate, deadhead miles | Explain the arithmetic with hypothetical examples and carrier-supplied costs, not current market-rate promises. |
| `/resources/how-to-choose-a-truck-dispatcher` | how to choose a dispatcher, best dispatch service for my truck | Provide evaluation criteria rather than an unsupported “best” claim. |
| `/resources/self-dispatch-vs-dispatch-service`, `/resources/load-board-vs-dispatch-service` | should I hire a dispatcher, load board vs dispatch service | The first compares staffing and time; the second compares a search tool with agreed service work. |

## October 30 content update

The update strengthens descriptive headings, service-scope explanations and contextual links on existing commercial pages. The resources hub groups guides around choosing support, finding loads and evaluating trips, and preparing documents. Three new guides address distinct decisions:

| Guide | Useful coverage | Boundary with existing pages |
| --- | --- | --- |
| `/resources/what-does-a-truck-dispatcher-do` | The dispatch workflow, information handoffs and responsibilities from load search through delivery records | Educational introduction; link to `/services` for Rai's offered scope and the dispatcher/broker guide for that comparison. |
| `/resources/how-to-find-box-truck-loads` | A practical search and screening workflow using actual dimensions, payload, location and delivery requirements | Explain the carrier's task; keep the commercial box-truck offer at `/equipment/box-truck`. |
| `/resources/local-vs-regional-vs-otr-trucking` | Compare operating radius, schedule, home-time goals and load-planning tradeoffs | Help the reader choose an operating pattern, then link to the regional and OTR service pages. |

Publication, crawl checks and deployment evidence must be verified separately. Adding a URL to the source or sitemap does not establish indexing, a ranking or traffic growth. Revise article and sitemap dates only when the content actually changes.

## Business facts and editorial limits

- Published dispatch fees are **3% for dry van, flatbed and reefer; 4% for hotshot; 5% for all other equipment**. `src/lib/dispatch-pricing.ts` is the source for these rates. Confirm billing base and service scope in the agreement.
- Coverage is the **48 contiguous United States**. Published desk hours are Monday–Saturday, 8 AM–6 PM Central Time. Contact email remains `sam@railogistics.us`.
- Equipment and freight require a service-fit review. A published equipment category is not a promise of every commodity, permit service, broker acceptance, dedicated lane or load availability.
- Keep new-authority, revenue, rate and scheduling claims conditional on actual requirements. Do not invent testimonials, local offices, case-study results, provider affiliations or platform access.
- Do not create pages for every synonym or city, add hidden keyword blocks, or add a meta-keywords list. Google does not use the keywords meta tag, and its policies address keyword stuffing and doorway pages. [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

## Measurement after publication

1. Verify the production URLs, canonical tags, sitemap, internal links and mobile reading experience. Inspect representative new pages in Search Console after release and check sitemap processing.
2. Retain this baseline and the release date. After Google has had time to recrawl, compare complete 28-day windows using the same search type and filters. Check the longer three-month trend as well.
3. Review query and page data by equipment, carrier type, service, pricing and educational intent. Pay particular attention to Sprinter dispatch, step deck and onboarding because the baseline already contains observations for them.
4. Track nonbrand query diversity, impressions, clicks and relevant landing pages. Use consistent brand filters while remembering that filtered query data is incomplete. Do not subtract visible branded query totals from property totals to claim a precise nonbrand share.
5. Where impressions grow without clicks, inspect query relevance, title/summary accuracy and page position before changing copy. Where two pages appear for the same intent, inspect their query/page data and clarify the primary purpose before considering consolidation.
6. Review qualified dispatch inquiries alongside search traffic using available records. Search Console clicks alone do not measure leads, revenue or visitor quality. No new tracking tags or recurring monitoring are implied by this plan.

Google controls crawling, canonical selection, indexing and ranking. Useful content and sound technical signals support eligibility; they cannot guarantee a maximum keyword count, visitor count or indexation date. Google advises allowing time to assess changes, often weeks or longer. [Google's SEO guidance](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
