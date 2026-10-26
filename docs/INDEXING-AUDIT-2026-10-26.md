# Rai Dispatch indexing audit — October 26, 2026

**Status: fixes deployed and verified in production. Google accepted the privacy-page indexing request; final indexing and canonical selection remain Google's pending decision.** This record separates the previous live site's measurements from verification of the release.

The audited site is `https://raidispatch.com`, with 54 intended indexable pages. The repository and release baseline is `53c8959` in `royfazeel/Fazeel-Rai-Logistics`; deployment uses the existing Vercel project `fazeel-rai-logistics`.

## Search Console evidence

The Page indexing report, last updated **October 23, 2026**, showed **40 indexed URLs and 17 excluded URLs**. The exclusions include alternate HTTP/www URLs, so these counts are not a count of 57 intended pages.

| Reported state | Count | Finding |
| --- | ---: | --- |
| Duplicate, Google chose different canonical than user | 1 | `/privacy`: declared canonical `https://raidispatch.com/privacy`; Google-selected canonical `https://www.railogistics.us/privacy`. Last crawl October 18; crawling/indexing allowed and fetch successful. This is an old-domain canonical selection after migration, not a robots block. |
| Discovered — currently not indexed | 13 | All listed examples show last crawl `N/A`. Their discovery does not establish that Google has crawled or selected them for indexing. |
| Page with redirect | 3 | Expected HTTP/www alternatives. These should redirect to their HTTPS canonical destinations rather than become separately indexed pages. |

The sitemap report showed **Success, 54 discovered pages, last read October 25, 2026**. Manual Actions and Security Issues both reported no issues. The existing discovered-page validation was already started on October 9.

The 13 discovered URLs were:

| Category | Paths |
| --- | --- |
| Carriers | `/carriers/new-authorities`, `/carriers/owner-operators`, `/carriers/small-fleets` |
| Equipment | `/equipment/car-hauler`, `/equipment/rgn-lowboy`, `/equipment/tanker` |
| Resources | `/resources`, `/resources/load-board-vs-dispatch-service`, `/resources/new-authority-broker-approval`, `/resources/partial-truckload-vs-ltl`, `/resources/self-dispatch-vs-dispatch-service` |
| Services | `/services/expedited-dispatch`, `/services/load-booking` |

Local evidence snapshots are retained under `output/seo-oct26/`, including `gsc-discovered-before.txt`, `gsc-sitemap-before.txt`, `gsc-manual-actions.txt`, and `gsc-security.txt`. That output directory is intentionally Git-ignored.

## Implemented changes

- **Privacy identity:** the main policy previously identified the parent company without naming Rai Dispatch or its current domain. Its heading, introduction, and description now explicitly identify Rai Dispatch at `raidispatch.com`. Legal/SMS obligations and the September 28 effective date are preserved; the clarification has an October 26 revision date.
- **Sitemap dates:** corrected the privacy revision to October 26, the terms/testimonials revisions to September 28, and the homepage revision to October 7, matching the known content changes rather than the build date.
- **Duplicate routes and hosts:** added permanent redirects for the `/index` homepage alias and stable `fazeel-rai-logistics.vercel.app` hostname. Existing old-domain and www redirects remain, preserving paths and queries.
- **Error metadata:** removed homepage metadata and affirmative indexing directives from the shared layout. Each real page now receives these through `pageMetadata`; nonexistent routes retain Next.js's `noindex` without an unrelated homepage canonical. All 17 page-route files use the helper, covering all 54 intended pages.
- **Forms and navigation:** allow pasted phone numbers with country codes/punctuation before formatting; move focus to form confirmations; clear validation state on reset; keep quote confirmation available until dismissed; improve modal and mobile-menu keyboard focus, Escape handling, and scroll release when switching to desktop navigation.
- **Regression coverage:** added `scripts/verify-indexing.mjs` to check sitemap URL variants, alias redirects, query preservation, canonical directives, and genuine 404 responses using a mobile Googlebot user-agent string. A simulated user-agent is not evidence of a real Google fetch.

## Verification recorded so far

| Scope | Result |
| --- | --- |
| Existing live assets | 54 pages and 208 assets checked; zero failures. |
| Existing live PageSpeed Insights | Mobile: performance 96, accessibility 100, best practices 100, SEO 100. Desktop: 100 in all four categories. [Report](https://pagespeed.web.dev/analysis/https-raidispatch-com/cyqoj0a4r1). No CrUX field data was available. These lab scores describe the measured live release. |
| Proposed release build | Fresh production build and TypeScript checks passed; 60 build outputs. |
| Proposed release local SEO crawl | 54/54 pages, 327 internal link/fragment targets, zero failures and zero advisory warnings. |
| Proposed release local indexing regression | 385 requests: 54 clean pages, 54 query variants, 216 hostname redirects, 2 homepage-alias checks, 53 slash redirects and 5 genuine 404s; zero failures. |
| Proposed release local assets | 54 pages and 208 first-party resources; zero failures or warnings. |
| Isolated lead delivery | 17/17 checks passed using a loopback fake email provider. Updated a stale test label to the current Cargo Vans category. Browser contact and quote confirmations accepted formatted phone input and moved focus correctly. |
| Fee calculator | 121 checks passed across 16 equipment selections. |
| Production release of these fixes | Commit `97b3fe706b22dd37b4995e6224bf0e77e4d0fde9`, Vercel Production / Ready on October 26. [Deployment](https://vercel.com/fazeel-arshads-projects/fazeel-rai-logistics/6vt5bXDaEZtBMu2STTzUhshnsGyt). |
| Post-release public SEO/indexing regression crawl | 54/54 pages, 327 internal targets and 385 routing/indexing requests passed with zero failures/warnings; 208 first-party assets also passed. Evidence: `production-seo.json`, `production-indexing.json`, `production-assets.json`. |
| Runtime error review | Vercel reported no runtime error clusters in the preceding hour. This is a bounded observation, not a guarantee about future errors. |
| Google live privacy inspection | At 18:52 PKT, Google reported “URL is available to Google” and “Page can be indexed.” |
| New Search Console reindexing request | Google confirmed “Indexing requested” for `/privacy`, adding it to a priority crawl queue. |
| Updated sitemap | Resubmitted successfully October 26. Google immediately reported Success, last read October 26, and 54 discovered pages. |
| Canonical validation | “Validation started,” dated October 26, for the duplicate-canonical issue. Completion remains pending with Google. |

The optional manual `/resources` indexing request failed twice in Search Console with a reCAPTCHA service connection error. No success is claimed for that individual request. It remains included in the successfully processed 54-URL sitemap; the existing 13-page discovered validation continues. The separate privacy request succeeded without a manual CAPTCHA challenge. Evidence includes `gsc-privacy-indexing-requested.png`, `gsc-canonical-validation-started.png`, and `gsc-sitemap-after.txt`.

Browser verification also passed contact/quote success, confirmation focus, form reset, mobile Tab/Shift+Tab containment, Escape focus restoration and release of mobile scroll locking at desktop width. No production lead was submitted. Git's command-line push had no login and the connector lacked repository write access; the existing signed-in GitHub Desktop session successfully pushed the same reviewed commit. No credentials were extracted or changed.

iCloud-backed dependency files in the workspace were dataless, so verification used a clean temporary directory under `/tmp` with `npm ci` from the committed lockfile. This avoided treating unavailable local dependency files as an application build failure. The temporary build does not itself establish that production serves these changes.

## Completion criteria and limits

The deployment commit, public host, production crawl and Google's live privacy-page inspection are confirmed above. An accepted indexing request is not completed indexing.

The audit found no general robots or noindex barrier on the intended pages. Google controls recrawling, canonical selection, and indexing; technical fixes cannot guarantee that all pages will be indexed or that the report will update immediately. The old domains must continue redirecting while migration signals consolidate. PageSpeed lab results do not establish real-user Core Web Vitals. No live test email was sent, so inbox delivery is not established by this audit.
