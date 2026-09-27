#!/usr/bin/env node
/**
 * Read-only HTTP audit of the deployed, server-rendered site.
 * Usage: node scripts/verify-seo.mjs http://localhost:3000 [--json /tmp/seo.json]
 *        node scripts/verify-seo.mjs https://raidispatch.com
 * No browser or third-party service is used. Requires Node 18+.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const jsonIndex = args.indexOf('--json');
const outputPath = jsonIndex >= 0 ? args[jsonIndex + 1] : undefined;
const countIndex = args.indexOf('--expect-pages');
const expectedPageCount = countIndex >= 0 ? Number(args[countIndex + 1]) : 54;
if (!Number.isInteger(expectedPageCount) || expectedPageCount < 1) throw new Error('--expect-pages must be a positive integer.');
const optionValues = new Set([jsonIndex, countIndex].filter(index => index >= 0).map(index => index + 1));
const requestedBase = args.find((value, index) => !value.startsWith('--') && !optionValues.has(index)) || 'http://localhost:3000';
const base = new URL(requestedBase);
const canonicalOrigin = 'https://raidispatch.com';
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw new Error('Provide a plain HTTP(S) origin without credentials.');
base.pathname = '/'; base.search = ''; base.hash = '';
const failures = [];
const warnings = [];
const pages = [];
const cache = new Map();
const checkedLinks = new Set();

// Independent acceptance criteria from the owner's equipment-specific pricing
// instruction. Do not import the site's pricing helper: this crawl must catch a
// wrong value that has propagated consistently through the rendered website.
const approvedFees = [
  { slug: 'cargo-van', label: /cargo\s*vans?/i, rate: 5 },
  { slug: 'sprinter-van', label: /sprinter\s*vans?/i, rate: 5 },
  { slug: 'box-truck', label: /box\s*trucks?/i, rate: 5 },
  { slug: 'hotshot', label: /hot\s*shot(?:\s*trucks?)?/i, rate: 4 },
  { slug: 'dry-van', label: /dry\s*vans?/i, rate: 3 },
  { slug: 'flatbed', label: /flatbeds?/i, rate: 3 },
  { slug: 'reefer', label: /reefers?/i, rate: 3 },
  { slug: 'power-only', label: /power[\s-]*only/i, rate: 5 },
  { slug: 'step-deck', label: /step[\s-]*decks?/i, rate: 5 },
  { slug: 'conestoga', label: /conestogas?/i, rate: 5 },
  { slug: 'rgn-lowboy', label: /\brgn\b|low[\s-]*boys?/i, rate: 5 },
  { slug: 'car-hauler', label: /car[\s-]*haulers?/i, rate: 5 },
  { slug: 'tanker', label: /tankers?/i, rate: 5 },
  { slug: 'dump-truck', label: /dump\s*trucks?/i, rate: 5 },
  { slug: 'curtain-side', label: /curtain[\s-]*sides?/i, rate: 5 },
];
const otherEquipmentFee = { label: /(?:all\s+)?other\s+(?:truck\s+types|trucks|equipment)/i, rate: 5 };
const percentages = text => [...text.matchAll(/\b(\d+(?:\.\d+)?)\s*%/g)].map(match => Number(match[1]));
const hasType = (node, type) => [node?.['@type']].flat().includes(type);
// The September 28 schedule supersedes 5–8%; 'up to 5%' is now valid.
const obsoletePricing = /\b5\s*%?\s*(?:[–—-]|to)\s*8\s*%|\b[678](?:\.0+)?\s*%|\bsame\s+(?:maximum\s+)?percentage\s+(?:across|for)\s+(?:all|our)/i;
const approvedRange = /\b3\s*%?\s*(?:[–—-]|to)\s*5\s*%/i;

const issue = (path, check, detail) => failures.push({ path, check, detail });
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#(\d+)|#x([0-9a-f]+));/gi, (match, decimal, hex) => {
  if (decimal || hex) return String.fromCodePoint(Number.parseInt(decimal || hex, decimal ? 10 : 16));
  return ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' })[match.toLowerCase()] || match;
});
const plain = value => decode(value.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]));
const elements = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
const normalizedPath = pathname => pathname === '/' ? '/' : pathname.replace(/\/$/, '');
const canonicalFor = path => canonicalOrigin + (path === '/' ? '' : path);
const pageMarkup = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

async function fetchPath(path) {
  if (!cache.has(path)) cache.set(path, (async () => {
    try {
      const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(25_000), headers: { 'user-agent': 'RaiDispatchSEOAudit/1.0' } });
      const text = await response.text();
      return { status: response.status, text, type: response.headers.get('content-type') || '', location: response.headers.get('location'), robots: response.headers.get('x-robots-tag') };
    } catch (error) { return { status: 0, text: '', error: error.message, type: '' }; }
  })());
  return cache.get(path);
}
async function batch(items, work, width = 5) {
  for (let start = 0; start < items.length; start += width) await Promise.all(items.slice(start, start + width).map(work));
}
function schemaNodes(value) {
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(schemaNodes)];
}

function checkOfferFee(path, offer, rate, label) {
  const rates = percentages(String(offer.description || ''));
  if (rates.length !== 1 || rates[0] !== rate) issue(path, 'offer-pricing', `${label} offer must describe exactly ${rate}%; received ${JSON.stringify(offer.description || '')}.`);
  // These offers describe a percentage service fee, not a fixed-dollar price.
  if (schemaNodes(offer).some(node => node.price !== undefined || node.lowPrice !== undefined || node.highPrice !== undefined)) issue(path, 'percentage-as-price', `${label} percentage offer must not be represented as a monetary price.`);
}

function checkRenderedPricing(path, markup, visibleText, title, description, nodes) {
  const equipment = approvedFees.find(item => path === `/equipment/${item.slug}`);
  if (equipment) {
    const article = markup.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] || markup;
    const hero = article.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1];
    const headlineRates = percentages(hero ? plain(hero) : `${title} ${description}`);
    if (!headlineRates.includes(equipment.rate) || headlineRates.some(rate => rate !== equipment.rate)) issue(path, 'equipment-pricing', `Primary equipment offer must advertise ${equipment.rate}%; found ${JSON.stringify(headlineRates)}.`);
    if (!percentages(visibleText).includes(equipment.rate)) issue(path, 'visible-equipment-fee', `No visible ${equipment.rate}% fee found.`);
    const metadataRates = percentages(`${title} ${description}`);
    if (metadataRates.some(rate => rate !== equipment.rate)) issue(path, 'equipment-metadata-pricing', `Equipment title/description must not advertise a different rate from ${equipment.rate}%; found ${JSON.stringify(metadataRates)}.`);
    const matchingServices = nodes.filter(node => hasType(node, 'Service') && (node.url === canonicalFor(path) || node['@id'] === `${canonicalFor(path)}#service`));
    if (!matchingServices.length) issue(path, 'equipment-service-schema', 'No page-specific Service schema found.');
    for (const service of matchingServices) {
      if (percentages(String(service.description || '')).some(rate => rate !== equipment.rate)) issue(path, 'equipment-schema-pricing', `${equipment.slug} Service description advertises a rate other than ${equipment.rate}%.`);
      // A Service without an Offer is valid; if pricing is published in schema,
      // it must agree with the specific equipment's visible offer.
      for (const offer of [service.offers].flat().filter(Boolean)) {
        if (typeof offer !== 'object') { issue(path, 'offer-pricing', 'Expected a structured percentage Offer.'); continue; }
        checkOfferFee(path, offer, equipment.rate, equipment.slug);
      }
    }
  }
  if (path === '/' || path === '/pricing') {
    if (!approvedRange.test(visibleText)) issue(path, 'published-range', 'Expected the approved 3–5% fee range in visible text.');
    if (!approvedRange.test(`${title} ${description}`)) issue(path, 'metadata-range', 'Expected the approved 3–5% fee range in title or description.');
    if (!/free\s+(?:setup|onboarding)|no\s+(?:setup|onboarding)\s+fees?/i.test(visibleText)) issue(path, 'free-setup', 'Free setup or no setup fee must remain visible.');
  }
  if (path !== '/pricing') return;
  checkRenderedCalculator(path, markup);
  const tableRows = [...markup.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(match => ({ text: plain(match[1]), links: elements(match[1], 'a').map(link => link.href) }));
  for (const item of [...approvedFees, otherEquipmentFee]) {
    const exactRows = item.slug ? tableRows.filter(row => row.links.some(href => href && normalizedPath(new URL(href, base).pathname) === `/equipment/${item.slug}`)) : [];
    const matchingRows = exactRows.length ? exactRows : tableRows.filter(row => item.label.test(row.text));
    if (matchingRows.length) {
      for (const row of matchingRows) {
        const rates = percentages(row.text);
        if (rates.length !== 1 || rates[0] !== item.rate) issue(path, 'pricing-table-rate', `Expected ${item.slug || 'other equipment'} row at ${item.rate}%; received ${JSON.stringify(row.text)}.`);
      }
    } else {
      // Supports a semantic equipment/rate card if the page is not a table.
      // Check the first percentage following the equipment label, rather than
      // accepting an unrelated percentage elsewhere on the page.
      const association = new RegExp(`(?:${item.label.source})[^%]{0,65}?\\b(\\d+(?:\\.\\d+)?)\\s*%`, 'gi');
      const matches = [...visibleText.matchAll(association)];
      if (!matches.some(match => Number(match[1]) === item.rate)) issue(path, 'pricing-equipment-label', `Missing visible ${item.slug || 'other equipment'} → ${item.rate}% association.`);
    }
  }
  const catalogs = nodes.filter(node => hasType(node, 'OfferCatalog'));
  if (!catalogs.length) { issue(path, 'offer-catalog', 'Pricing page must include its equipment OfferCatalog.'); return; }
  const catalogOffers = catalogs.flatMap(schemaNodes).filter(node => hasType(node, 'Offer'));
  for (const item of approvedFees) {
    const offers = catalogOffers.filter(offer => [offer.itemOffered].flat().some(service => service?.url === canonicalFor(`/equipment/${item.slug}`)));
    if (!offers.length) issue(path, 'catalog-equipment', `OfferCatalog is missing ${item.slug}.`);
    for (const offer of offers) checkOfferFee(path, offer, item.rate, item.slug);
  }
  const otherOffers = catalogOffers.filter(offer => otherEquipmentFee.label.test(`${offer.name || ''} ${offer.itemOffered?.name || ''}`));
  if (!otherOffers.length) issue(path, 'catalog-other-equipment', `OfferCatalog is missing the ${otherEquipmentFee.rate}% other-equipment category.`);
  for (const offer of otherOffers) checkOfferFee(path, offer, otherEquipmentFee.rate, 'other equipment');
}

// Server-rendered calculator output is audited independently of its source
// pricing helper. Interactive state changes receive separate component checks.
function checkRenderedCalculator(path, markup) {
  const selects = [...markup.matchAll(/<select\b[^>]*>([\s\S]*?)<\/select>/gi)];
  const calculator = selects.find(match => /<option\b[^>]*value=["']dry-van["']/i.test(match[1]));
  if (!calculator) { issue(path, 'fee-calculator', 'Equipment fee calculator is missing.'); return; }
  const options = [...calculator[1].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)].map(match => ({ ...attributes(match[1]), text: plain(match[2]), selected: /\bselected(?:\s|=|$)/i.test(match[1]) }));
  for (const item of [...approvedFees, { slug: 'other', rate: otherEquipmentFee.rate }]) {
    const matches = options.filter(option => option.value === item.slug);
    if (matches.length !== 1 || percentages(matches[0]?.text || '').join(',') !== String(item.rate)) issue(path, 'calculator-option-rate', `Expected one ${item.slug} calculator option at ${item.rate}%.`);
  }
  if (options.length !== approvedFees.length + 1) issue(path, 'calculator-options', `Expected 16 approved calculator equipment options; found ${options.length}.`);
  const selected = options.find(option => option.selected) || options[0];
  if (selected?.value !== 'dry-van') issue(path, 'calculator-default-equipment', `Expected dry-van default; received ${selected?.value}.`);
  const revenueInput = elements(markup, 'input').find(input => /-revenue$/.test(input.id || ''));
  if (revenueInput?.value !== '5000') issue(path, 'calculator-default-revenue', `Expected 5000 initial revenue; received ${revenueInput?.value}.`);
  const amounts = [...markup.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi)].map(match => ({ label: plain(match[1]), amount: plain(match[2]) }));
  const expected = [
    { label: /^Gross revenue entered$/i, amount: '$5,000.00' },
    { label: /^Dispatch fee\s*\(3%\)$/i, amount: '$150.00' },
    { label: /^Revenue after dispatch fee$/i, amount: '$4,850.00' },
  ];
  for (const item of expected) {
    const result = amounts.find(pair => item.label.test(pair.label));
    if (result?.amount !== item.amount) issue(path, 'calculator-default-math', `Expected ${item.label.source}: ${item.amount}; received ${result?.amount || 'missing'}.`);
  }
}

// These checks use the approved URL convention, not the implementation's image
// manifest. Copy/paste errors linking another truck's photo must fail the audit.
function equipmentPhoto(url, slug) {
  try {
    const parsed = new URL(url, base);
    if (![base.origin, canonicalOrigin].includes(parsed.origin)) return undefined;
    const match = parsed.pathname.match(new RegExp(`^/images/equipment/${slug}-(\\d+)-v\\d+\\.(?:webp|avif|png)$`));
    return match ? { width: Number(match[1]), height: Number(match[1]) * 2 / 3, url: parsed } : undefined;
  } catch { return undefined; }
}
function checkEquipmentPhotos(path, markup, metas, nodes) {
  const equipment = approvedFees.find(item => path === `/equipment/${item.slug}`);
  if (!equipment) return;
  const article = markup.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] || markup;
  const heroImages = elements(article, 'img').filter(img => equipmentPhoto(img.src, equipment.slug));
  if (!heroImages.length) issue(path, 'equipment-photo', `No rendered ${equipment.slug} photo found.`);
  for (const image of heroImages) if (!image.alt || image.alt.trim().length < 12) issue(path, 'equipment-photo-alt', 'Equipment photo must have a descriptive alt attribute.');
  for (const field of ['og:image', 'twitter:image']) {
    const images = metas.filter(meta => (meta.property || meta.name) === field);
    if (!images.some(meta => equipmentPhoto(meta.content, equipment.slug))) issue(path, 'equipment-social-image', `${field} must identify this equipment's photo.`);
  }
  const og = metas.find(meta => meta.property === 'og:image');
  const ogPhoto = equipmentPhoto(og?.content, equipment.slug);
  if (ogPhoto) {
    for (const dimension of ['width', 'height']) {
      const value = metas.find(meta => meta.property === `og:image:${dimension}`)?.content;
      if (Number(value) !== ogPhoto[dimension]) issue(path, 'equipment-image-dimensions', `og:image:${dimension} must be ${ogPhoto[dimension]} for ${og.content}; found ${value}.`);
    }
  }
  const services = nodes.filter(node => hasType(node, 'Service') && (node.url === canonicalFor(path) || node['@id'] === `${canonicalFor(path)}#service`));
  for (const service of services) {
    const image = [service.image].flat().find(image => equipmentPhoto(typeof image === 'string' ? image : image?.url || image?.contentUrl, equipment.slug));
    if (!image) { issue(path, 'equipment-schema-image', 'Page-specific Service must identify this equipment photo.'); continue; }
    if (typeof image === 'object') {
      const photo = equipmentPhoto(image.url || image.contentUrl, equipment.slug);
      for (const dimension of ['width', 'height']) if (image[dimension] !== undefined && Number(image[dimension]) !== photo[dimension]) issue(path, 'equipment-schema-image-dimensions', `ImageObject ${dimension} must equal ${photo[dimension]}; found ${image[dimension]}.`);
    }
  }
}

console.log(`Auditing server-rendered pages at ${base.origin}; canonical target ${canonicalOrigin}`);
const sitemap = await fetchPath('/sitemap.xml');
if (sitemap.status !== 200) issue('/sitemap.xml', 'http', `Expected 200; received ${sitemap.status} ${sitemap.error || ''}`);
const locations = [...sitemap.text.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/g)].map(match => decode(match[1]));
if (!locations.length) issue('/sitemap.xml', 'routes', 'Sitemap contains no URLs.');
if (new Set(locations).size !== locations.length) issue('/sitemap.xml', 'duplicate-urls', 'Sitemap URLs must be unique.');
const paths = [];
for (const location of locations) {
  try {
    const url = new URL(location);
    if (url.origin !== canonicalOrigin || url.search || url.hash) issue('/sitemap.xml', 'canonical-url', `Unexpected sitemap URL: ${location}`);
    paths.push(normalizedPath(url.pathname));
  } catch { issue('/sitemap.xml', 'invalid-url', location); }
}
const uniquePaths = [...new Set(paths)];
if (uniquePaths.length !== expectedPageCount) issue('/sitemap.xml', 'page-count', `Expected ${expectedPageCount} pages for this release; received ${uniquePaths.length}. Override intentionally with --expect-pages N for later releases.`);
const sitemapEntries = [...sitemap.text.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)].map(match => ({
  location: decode(match[1].match(/<loc>\s*([\s\S]*?)\s*<\/loc>/)?.[1] || ''),
  images: [...match[1].matchAll(/<image:loc>\s*([\s\S]*?)\s*<\/image:loc>/g)].map(image => decode(image[1])),
}));
for (const equipment of approvedFees) {
  const path = `/equipment/${equipment.slug}`;
  if (!uniquePaths.includes(path)) issue('/sitemap.xml', 'equipment-route', `Missing ${path}.`);
  const entry = sitemapEntries.find(entry => entry.location === canonicalFor(path));
  if (!entry?.images.some(url => url.startsWith(`${canonicalOrigin}/`) && equipmentPhoto(url, equipment.slug))) issue('/sitemap.xml', 'equipment-image', `Missing canonical ${equipment.slug} image reference for ${path}.`);
}
const robots = await fetchPath('/robots.txt');
if (robots.status !== 200) issue('/robots.txt', 'http', `Expected 200; received ${robots.status}.`);
if (!new RegExp(`^Sitemap:\\s*${canonicalOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/sitemap\\.xml\\s*$`, 'mi').test(robots.text)) issue('/robots.txt', 'sitemap', 'Missing canonical sitemap directive.');
if (!/^Disallow:\s*\/api\//mi.test(robots.text)) issue('/robots.txt', 'api-exclusion', 'Missing /api/ exclusion.');
if (/^Disallow:\s*\/\s*$/mi.test(robots.text)) issue('/robots.txt', 'crawlability', 'Whole-site crawl block found.');

const titles = new Map();
const descriptions = new Map();
const internalLinks = [];
await batch(uniquePaths, async path => {
  const response = await fetchPath(path);
  if (response.status !== 200) { issue(path, 'http', `Expected 200; received ${response.status}${response.location ? ` → ${response.location}` : ''} ${response.error || ''}`); return; }
  if (!/text\/html/i.test(response.type)) issue(path, 'content-type', `Expected HTML, received ${response.type}.`);
  const html = response.text;
  const markup = pageMarkup(html);
  const body = markup.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || markup;
  const visibleText = plain(body.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ''));
  const h1s = [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => plain(match[1]));
  const titleMatches = [...markup.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(match => plain(match[1]));
  const title = titleMatches[0] || '';
  const metas = elements(markup, 'meta');
  const descriptionValues = metas.filter(meta => meta.name?.toLowerCase() === 'description').map(meta => meta.content || '');
  const description = descriptionValues[0] || '';
  const canonicals = elements(markup, 'link').filter(link => link.rel?.toLowerCase().split(/\s+/).includes('canonical')).map(link => link.href);
  const ogUrls = metas.filter(meta => meta.property?.toLowerCase() === 'og:url').map(meta => meta.content);
  const expected = canonicalFor(path);
  if (h1s.length !== 1 || !h1s[0]) issue(path, 'h1', `Expected one nonempty H1; found ${h1s.length}.`);
  if (titleMatches.length !== 1 || !title) issue(path, 'title', `Expected one nonempty title; found ${titleMatches.length}.`);
  if (!/Rai Dispatch/i.test(title)) issue(path, 'brand-title', `Title does not include Rai Dispatch: ${title}`);
  if (!/Rai\s*Dispatch/i.test(visibleText)) issue(path, 'brand-content', 'Rai Dispatch brand is absent from page text.');
  if (descriptionValues.length !== 1 || !description) issue(path, 'description', `Expected one nonempty description; found ${descriptionValues.length}.`);
  if (canonicals.length !== 1 || canonicals[0] !== expected) issue(path, 'canonical', `Expected ${expected}; received ${JSON.stringify(canonicals)}.`);
  if (ogUrls.length !== 1 || ogUrls[0] !== expected) issue(path, 'og-url', `Expected ${expected}; received ${JSON.stringify(ogUrls)}.`);
  if (/noindex/i.test(response.robots || '') || metas.some(meta => /^(robots|googlebot)$/i.test(meta.name || '') && /noindex/i.test(meta.content || ''))) issue(path, 'indexability', 'Noindex directive present.');
  if (title) { const other = titles.get(title); if (other) issue(path, 'duplicate-title', `Same title as ${other}.`); else titles.set(title, path); }
  if (description) { const other = descriptions.get(description); if (other) issue(path, 'duplicate-description', `Same description as ${other}.`); else descriptions.set(description, path); }
  if (title.length > 70) warnings.push({ path, check: 'title-length', detail: `${title.length} characters; review search result truncation.` });
  if (description.length > 170) warnings.push({ path, check: 'description-length', detail: `${description.length} characters; review search result truncation.` });
  const searchText = [visibleText, title, ...metas.map(meta => meta.content || '')].join(' ');
  const staleRate = searchText.match(obsoletePricing);
  if (staleRate) issue(path, 'obsolete-pricing', `Superseded pricing claim found: ${staleRate[0]}.`);
  if (/Marcus Johnson|David Chen|Robert Williams|James Anderson|Michael Thompson|Anthony Davis|Christopher Brown|Daniel Garcia|William Martinez|Joseph Taylor|Kevin Robinson|Brian Wilson|verified (?:driver|owner.operator)|sample loads|live load ticker|average dispatcher|\$5k\s*[–-]\s*\$9k/i.test(visibleText)) issue(path, 'unsupported-remnants', 'A removed testimonial, sample ticker, comparison, or revenue claim remains.');
  const schemaBlocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match => attributes(match[1]).type?.toLowerCase() === 'application/ld+json');
  if (!schemaBlocks.length) issue(path, 'json-ld', 'No JSON-LD block found.');
  const pageSchemaNodes = [];
  for (let index = 0; index < schemaBlocks.length; index++) {
    try {
      const value = JSON.parse(schemaBlocks[index][2]);
      const nodes = schemaNodes(value);
      pageSchemaNodes.push(...nodes);
      for (const node of nodes) {
        if (Object.values(node).some(value => typeof value === 'string' && obsoletePricing.test(value))) issue(path, 'obsolete-schema-pricing', `Superseded pricing claim in JSON-LD block ${index + 1}.`);
      }
      if (!nodes.some(node => /^https?:\/\/schema\.org\/?$/.test(node['@context'] || ''))) issue(path, 'json-ld-context', `Block ${index + 1} has no schema.org context.`);
      if (!nodes.some(node => node['@type'])) issue(path, 'json-ld-type', `Block ${index + 1} has no typed node.`);
      if (nodes.some(node => [node['@type']].flat().some(type => ['Review', 'AggregateRating'].includes(type)))) issue(path, 'review-schema', 'Unverified review or rating schema remains.');
    } catch (error) { issue(path, 'json-ld-syntax', `Block ${index + 1}: ${error.message}`); }
  }
  checkRenderedPricing(path, markup, visibleText, title, description, pageSchemaNodes);
  checkEquipmentPhotos(path, markup, metas, pageSchemaNodes);
  for (const anchor of elements(markup, 'a')) {
    if (!anchor.href || /^(mailto:|tel:|sms:|whatsapp:|data:)/i.test(anchor.href)) continue;
    try {
      const link = new URL(anchor.href, new URL(path, base));
      if (!['http:', 'https:'].includes(link.protocol)) continue;
      if (['railogistics.us', 'www.railogistics.us'].includes(link.hostname)) issue(path, 'old-domain-link', anchor.href);
      if (![base.origin, canonicalOrigin, 'https://www.raidispatch.com'].includes(link.origin)) continue;
      if (link.pathname === '/api' || link.pathname.startsWith('/api/')) continue;
      internalLinks.push({ from: path, path: normalizedPath(link.pathname), hash: link.hash });
    } catch { issue(path, 'invalid-link', anchor.href); }
  }
  pages.push({ path, status: response.status, title, description, h1: h1s[0], canonical: canonicals[0], jsonLdBlocks: schemaBlocks.length });
});

await batch(internalLinks, async link => {
  const key = link.path + link.hash;
  if (checkedLinks.has(key)) return;
  checkedLinks.add(key);
  const response = await fetchPath(link.path);
  if (response.status !== 200) { issue(link.from, 'broken-internal-link', `${key} returned ${response.status}${response.location ? ` → ${response.location}` : ''}.`); return; }
  if (link.hash && /text\/html/.test(response.type)) {
    let fragment;
    try { fragment = decodeURIComponent(link.hash.slice(1)); } catch { fragment = link.hash.slice(1); }
    if (!fragment || fragment.startsWith(':~:text=')) return;
    const ids = [...response.text.matchAll(/\b(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => decode(match[1] ?? match[2] ?? ''));
    if (!ids.includes(fragment)) issue(link.from, 'broken-fragment', `${key} has no matching id or named anchor.`);
  }
});

const report = { approvedPricing: { range: '3–5%', equipment: Object.fromEntries(approvedFees.map(({ slug, rate }) => [slug, rate])), other: otherEquipmentFee.rate }, baseUrl: base.origin, canonicalOrigin, checkedAt: new Date().toISOString(), pageCount: pages.length, sitemapUrlCount: locations.length, internalTargetsChecked: checkedLinks.size, failures, warnings, pages: pages.sort((a, b) => a.path.localeCompare(b.path)) };
if (outputPath) { await mkdir(dirname(outputPath), { recursive: true }); await writeFile(outputPath, JSON.stringify(report, null, 2) + '\n'); }
for (const failure of failures) console.error(`FAIL ${failure.path} [${failure.check}] ${failure.detail}`);
for (const warning of warnings) console.warn(`WARN ${warning.path} [${warning.check}] ${warning.detail}`);
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${pages.length}/${locations.length} sitemap pages; ${checkedLinks.size} internal link targets; ${failures.length} failures; ${warnings.length} advisory warnings.`);
console.log('Checks cover rendered HTML and JSON-LD syntax, not Google indexing, rankings, rich-result eligibility, or real-user performance.');
process.exitCode = failures.length ? 1 : 0;
