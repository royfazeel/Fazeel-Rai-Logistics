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
const expectedPageCount = countIndex >= 0 ? Number(args[countIndex + 1]) : 67;
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
  { slug: 'cargo-van', label: /cargo\s*vans?/i, rate: 12 },
  { slug: 'sprinter-van', label: /sprinter\s*vans?/i, rate: 5 },
  { slug: 'box-truck', label: /box\s*trucks?/i, rate: 7 },
  { slug: 'hotshot', label: /hot\s*shot(?:\s*trucks?)?/i, rate: 6 },
  { slug: 'dry-van', label: /dry\s*vans?/i, rate: 5 },
  { slug: 'flatbed', label: /flatbeds?/i, rate: 5 },
  { slug: 'reefer', label: /reefers?/i, rate: 4 },
  { slug: 'power-only', label: /power[\s-]*only/i, rate: 5 },
  { slug: 'step-deck', label: /step[\s-]*decks?/i, rate: 5 },
  { slug: 'conestoga', label: /conestogas?/i, rate: 4 },
  { slug: 'rgn-lowboy', label: /\brgn\b|low[\s-]*boys?/i, rate: 5 },
  { slug: 'car-hauler', label: /car[\s-]*haulers?/i, rate: 5 },
  { slug: 'tanker', label: /tankers?/i, rate: 5 },
  { slug: 'dump-truck', label: /dump\s*trucks?/i, rate: 5 },
  { slug: 'curtain-side', label: /curtain[\s-]*sides?/i, rate: 5 },
];
const otherEquipmentFee = { label: /(?:all\s+)?other\s+(?:truck\s+types|trucks|equipment)/i, rate: 5 };
const exactFeesAnswer = 'Dispatch fees are 7% for box trucks, 6% for hotshots, 4% for reefers and Conestoga trailers, 12% for cargo vans, and 5% for dry vans, flatbeds, power only, step decks and Sprinter vans. Fees apply to gross revenue on loads we book. Confirm the applicable equipment category, billing base and service scope in writing.';
const exactEquipmentAnswers = {
  'box-truck': 'Rai Dispatch charges 7% of gross revenue on loads we book for box trucks. Confirm the billing base and service scope in writing before onboarding.',
  'cargo-van': 'Rai Dispatch charges 12% of gross revenue on loads we book for cargo vans. The separately listed Sprinter van dispatch service is priced at 5%. Confirm which service category applies to your vehicle before onboarding.',
  'sprinter-van': 'Rai Dispatch charges 5% of gross revenue on loads we book for Sprinter vans. The separately listed cargo van dispatch service is priced at 12%. Confirm which service category applies to your vehicle before onboarding.',
};
const percentages = text => [...text.matchAll(/\b(\d+(?:\.\d+)?)\s*%/g)].map(match => Number(match[1]));
const hasType = (node, type) => [node?.['@type']].flat().includes(type);
// The owner's current schedule is 4–12%. Both earlier ranges and a 3% fee
// are stale; 6%, 7% and 12% are now valid equipment rates. Numeric boundaries
// prevent decimal percentages such as 11.3% from being mistaken for 3%.
const obsoletePricing = /(?<![\d.])(?:3\s*%?\s*(?:[–—-]|to)\s*5|5\s*%?\s*(?:[–—-]|to)\s*8)\s*%|(?<![\d.])3(?:\.0+)?\s*%|\bsame\s+(?:maximum\s+)?percentage\s+(?:across|for)\s+(?:all|our)/i;
const approvedRange = /\b4\s*%?\s*(?:[–—-]|to)\s*12\s*%/i;
const activeCarrierSupport = /\b24\s*\/\s*7\s+live\s+dispatch\s+support\s+for\s+active\s+carriers\b/i;

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

function checkEquipmentRates(path, text, rate, slug, check) {
  const rates = percentages(text);
  const van = ['cargo-van', 'sprinter-van'].includes(slug);
  const allowed = van ? [12, 5] : [rate];
  if (rates[0] !== rate || rates.some(value => !allowed.includes(value))) issue(path, check, `${slug} must lead with its ${rate}% rate; only the explicitly named cargo/Sprinter pair may add the other van rate. Found ${JSON.stringify(rates)}.`);
  const cargoAssociation = /cargo vans?(?: dispatch costs| service is separately listed at| are listed at| at) 12%/i.test(text);
  const sprinterAssociation = /Sprinter vans?(?: dispatch costs| service is separately listed at| are listed at| at) 5%/i.test(text);
  if (van && rates.some(value => value !== rate) && !((cargoAssociation && sprinterAssociation) || text.includes(exactEquipmentAnswers[slug]))) issue(path, check, 'Paired van percentages must explicitly identify the cargo 12% and Sprinter 5% categories.');
}
function checkOfferFee(path, offer, rate, label) {
  checkEquipmentRates(path, String(offer.description || ''), rate, label, 'offer-pricing');
  // These offers describe a percentage service fee, not a fixed-dollar price.
  if (schemaNodes(offer).some(node => node.price !== undefined || node.lowPrice !== undefined || node.highPrice !== undefined)) issue(path, 'percentage-as-price', `${label} percentage offer must not be represented as a monetary price.`);
}

function checkRenderedPricing(path, markup, visibleText, title, description, nodes) {
  // This guide previously grouped reefer and flatbed under one rate. Check the
  // rendered cost explanation against the approved schedule, not shared data.
  if (path === '/resources/evaluate-freight-rate-per-mile') {
    const costSection = [...markup.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)].find(match => attributes(match[1]).id === 'costs');
    const costText = plain(costSection?.[2] || '');
    for (const item of approvedFees.filter(item => ['dry-van', 'reefer', 'flatbed'].includes(item.slug))) {
      const association = new RegExp(`(?:${item.label.source})[^%]{0,65}?\\b(\\d+(?:\\.\\d+)?)\\s*%`, 'gi');
      const rates = [...costText.matchAll(association)].map(match => Number(match[1]));
      if (!rates.length || rates.some(rate => rate !== item.rate)) issue(path, 'guide-equipment-pricing', `The cost explanation must associate ${item.slug} with ${item.rate}%; found ${JSON.stringify(rates)}.`);
    }
  }
  const equipment = approvedFees.find(item => path === `/equipment/${item.slug}`);
  if (equipment) {
    const articleContent = markup.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
    const article = articleContent || markup;
    if (!activeCarrierSupport.test(plain(articleContent || ''))) issue(path, 'equipment-active-carrier-support', 'Equipment content must explicitly publish 24/7 live dispatch support for active carriers.');
    const hero = article.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1];
    checkEquipmentRates(path, hero ? plain(hero) : `${title} ${description}`, equipment.rate, equipment.slug, 'equipment-pricing');
    if (!percentages(visibleText).includes(equipment.rate)) issue(path, 'visible-equipment-fee', `No visible ${equipment.rate}% fee found.`);
    const metadataText = `${title} ${description}`;
    if (percentages(metadataText).length) checkEquipmentRates(path, metadataText, equipment.rate, equipment.slug, 'equipment-metadata-pricing');
    const matchingServices = nodes.filter(node => hasType(node, 'Service') && (node.url === canonicalFor(path) || node['@id'] === `${canonicalFor(path)}#service`));
    if (!matchingServices.length) issue(path, 'equipment-service-schema', 'No page-specific Service schema found.');
    for (const service of matchingServices) {
      checkEquipmentRates(path, String(service.description || ''), equipment.rate, equipment.slug, 'equipment-schema-pricing');
      // A Service without an Offer is valid; if pricing is published in schema,
      // it must agree with the specific equipment's visible offer.
      for (const offer of [service.offers].flat().filter(Boolean)) {
        if (typeof offer !== 'object') { issue(path, 'offer-pricing', 'Expected a structured percentage Offer.'); continue; }
        checkOfferFee(path, offer, equipment.rate, equipment.slug);
      }
    }
  }
  if (path === '/' || path === '/pricing') {
    if (!approvedRange.test(visibleText)) issue(path, 'published-range', 'Expected the approved 4–12% fee range in visible text.');
    if (!approvedRange.test(`${title} ${description}`)) issue(path, 'metadata-range', 'Expected the approved 4–12% fee range in title or description.');
    if (!/free\s+(?:setup|onboarding)|no\s+(?:setup|onboarding)\s+fees?/i.test(visibleText)) issue(path, 'free-setup', 'Free setup or no setup fee must remain visible.');
  }
  if (path !== '/pricing') return;
  checkRenderedCalculator(path, markup);
  const illustrative = [...markup.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].find(table => /Compare fees on one hypothetical \$2,000 load/.test(plain(table[1])));
  if (!illustrative) issue(path, 'pricing-worked-examples', 'Missing the three clearly labelled illustrative $2,000 fee examples.');
  else {
    if (!plain(illustrative[1]).includes('Revenue after dispatch fee, before operating costs (USD)')) issue(path, 'pricing-example-label', 'The example remainder must state that it is before operating costs and use USD.');
    const exampleRows = [...illustrative[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].filter(row => /<td\b/i.test(row[1]));
    if (exampleRows.length !== 3) issue(path, 'pricing-example-count', `Expected box/cargo/Sprinter examples; found ${exampleRows.length} rows.`);
    for (const [slug, rate, fee, revenue] of [['box-truck', 7, '$140.00', '$1,860.00'], ['cargo-van', 12, '$240.00', '$1,760.00'], ['sprinter-van', 5, '$100.00', '$1,900.00']]) {
      const row = exampleRows.find(row => elements(row[1], 'a').some(link => link.href === `/equipment/${slug}`));
      const cells = [...(row?.[1] || '').matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(cell => plain(cell[1]));
      if (JSON.stringify(cells) !== JSON.stringify([`${rate}%`, fee, revenue])) issue(path, 'pricing-example-math', `${slug} $2,000 example must show ${rate}%, ${fee} fee and ${revenue} before operating costs; found ${JSON.stringify(cells)}.`);
    }
  }
  const tableRows = [...markup.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(match => ({ text: plain(match[1]), links: elements(match[1], 'a').map(link => link.href) }));
  for (const item of approvedFees) {
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
  const otherRows = tableRows.filter(row => otherEquipmentFee.label.test(row.text));
  if (!otherRows.length || otherRows.some(row => !/written confirmation required/i.test(row.text) || percentages(row.text).length)) issue(path, 'other-equipment-confirmation', 'Other equipment must have a written-confirmation table row, not an automatically calculable percentage.');
  if (!/Other truck types have a published 5% fee, subject to service availability and written rate confirmation\./.test(visibleText)) issue(path, 'other-conditional-published-rate', 'Conditional published 5% must be preserved separately from calculator eligibility.');
  const catalogs = nodes.filter(node => hasType(node, 'OfferCatalog'));
  if (!catalogs.length) { issue(path, 'offer-catalog', 'Pricing page must include its equipment OfferCatalog.'); return; }
  const catalogOffers = catalogs.flatMap(schemaNodes).filter(node => hasType(node, 'Offer'));
  for (const item of approvedFees) {
    const offers = catalogOffers.filter(offer => [offer.itemOffered].flat().some(service => service?.url === canonicalFor(`/equipment/${item.slug}`)));
    if (!offers.length) issue(path, 'catalog-equipment', `OfferCatalog is missing ${item.slug}.`);
    for (const offer of offers) checkOfferFee(path, offer, item.rate, item.slug);
  }
  const otherOffers = catalogOffers.filter(offer => otherEquipmentFee.label.test(`${offer.name || ''} ${offer.itemOffered?.name || ''}`));
  for (const offer of otherOffers) {
    if (!/written rate confirmation/i.test(offer.description || '')) issue(path, 'catalog-other-equipment', 'An Other Offer must require written rate confirmation.');
    if (schemaNodes(offer).some(node => node.price !== undefined || node.lowPrice !== undefined || node.highPrice !== undefined)) issue(path, 'catalog-other-price', 'Other equipment cannot have a computed or monetary published quote.');
  }
}

// Server-rendered calculator output is audited independently of its source
// pricing helper. Interactive state changes receive separate component checks.
function checkRenderedCalculator(path, markup) {
  const selects = [...markup.matchAll(/<select\b[^>]*>([\s\S]*?)<\/select>/gi)];
  const calculator = selects.find(match => /<option\b[^>]*value=["']dry-van["']/i.test(match[1]));
  if (!calculator) { issue(path, 'fee-calculator', 'Equipment fee calculator is missing.'); return; }
  const options = [...calculator[1].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)].map(match => ({ ...attributes(match[1]), text: plain(match[2]), selected: /\bselected(?:\s|=|$)/i.test(match[1]) }));
  for (const item of approvedFees) {
    const matches = options.filter(option => option.value === item.slug);
    if (matches.length !== 1 || percentages(matches[0]?.text || '').join(',') !== String(item.rate)) issue(path, 'calculator-option-rate', `Expected one ${item.slug} calculator option at ${item.rate}%.`);
  }
  const other = options.filter(option => option.value === 'other');
  if (other.length !== 1 || percentages(other[0]?.text || '').length || !/quote required/i.test(other[0]?.text || '')) issue(path, 'calculator-other', 'Other must require a quote without presenting a percentage calculation.');
  const selectable = options.filter(option => option.value);
  if (selectable.length !== approvedFees.length + 1) issue(path, 'calculator-options', `Expected 15 published types and one quote-only Other choice; found ${selectable.length}.`);
  const selected = options.find(option => option.selected) || options[0];
  if (selected?.value !== 'box-truck') issue(path, 'calculator-default-equipment', `Expected box-truck default; received ${selected?.value}.`);
  const revenueInput = elements(markup, 'input').find(input => /-revenue$/.test(input.id || ''));
  if (revenueInput?.value !== '2000') issue(path, 'calculator-default-revenue', `Expected 2000 initial revenue; received ${revenueInput?.value}.`);
  const amounts = [...markup.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi)].map(match => ({ label: plain(match[1]), amount: plain(match[2]) }));
  const expected = [
    { label: /^Gross revenue entered$/i, amount: '$2,000.00' },
    { label: /^Dispatch fee\s*\(7%\)$/i, amount: '$140.00' },
    { label: /^Revenue after dispatch fee, before operating costs$/i, amount: '$1,860.00' },
  ];
  for (const item of expected) {
    const result = amounts.find(pair => item.label.test(pair.label));
    if (result?.amount !== item.amount) issue(path, 'calculator-default-math', `Expected ${item.label.source}: ${item.amount}; received ${result?.amount || 'missing'}.`);
  }
}

function visibleFaqPairs(markup) {
  const pairs = [];
  for (const match of markup.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)) {
    const question = match[1].match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1];
    const answer = match[1].match(/<\/summary>\s*<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1];
    if (question && answer) pairs.push({ question: plain(question), answer: plain(answer) });
  }
  for (const section of markup.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)) {
    if (attributes(section[1]).id !== 'questions') continue;
    for (const pair of section[2].matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)) pairs.push({ question: plain(pair[1]), answer: plain(pair[2]) });
  }
  return pairs;
}

function checkFaqAndExactAnswers(path, markup, nodes) {
  const visible = visibleFaqPairs(markup);
  const schema = nodes.filter(node => hasType(node, 'FAQPage')).flatMap(node => [node.mainEntity].flat().filter(Boolean));
  if (visible.length !== schema.length) issue(path, 'faq-schema-count', `Found ${visible.length} visible FAQ pairs but ${schema.length} FAQPage questions.`);
  for (const question of schema) {
    const answers = [question.acceptedAnswer].flat().filter(Boolean);
    if (!hasType(question, 'Question') || answers.length !== 1 || !hasType(answers[0], 'Answer')) { issue(path, 'faq-schema-shape', 'Each FAQ question needs one accepted Answer.'); continue; }
    if (!visible.some(pair => pair.question === plain(String(question.name || '')) && pair.answer === plain(String(answers[0].text || '')))) issue(path, 'faq-schema-visible-match', `JSON-LD question or answer does not exactly match the rendered FAQ: ${question.name || '(missing question)'}.`);
  }
  const slug = path.startsWith('/equipment/') ? path.split('/').at(-1) : '';
  const expected = exactEquipmentAnswers[slug] || (['/', '/pricing'].includes(path) ? exactFeesAnswer : undefined);
  if (expected && !visible.some(pair => pair.answer === expected)) issue(path, 'p0-exact-faq-answer', 'The controlling equipment fee answer must appear verbatim in a matching visible FAQ.');
  if (expected && path !== '/') {
    const answer = [...markup.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)].find(match => attributes(match[1]).id === 'answer-block');
    if (plain(answer?.[2] || '') !== expected) issue(path, 'p0-exact-lead-answer', 'The visible answer block must exactly match the controlling fee statement.');
  }
  return visible.length;
}

function checkFreeCalculatorSchema(path, nodes) {
  if (path !== '/tools/load-profit-calculator') return;
  const applications = nodes.filter(node => hasType(node, 'WebApplication') && node.url === canonicalFor(path));
  if (applications.length !== 1) issue(path, 'calculator-webapplication', `Expected one canonical WebApplication, found ${applications.length}.`);
  for (const application of applications) {
    const offer = application.offers;
    if (application.isAccessibleForFree !== true || !hasType(offer, 'Offer') || Number(offer.price) !== 0 || offer.price === undefined || offer.priceCurrency !== 'USD') issue(path, 'calculator-free-price', 'WebApplication must describe free tool access with price 0 USD; this is separate from commission percentages.');
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
  const ids = [...markup.matchAll(/<[a-z][^>]*>/gi)].map(match => attributes(match[0]).id).filter(Boolean);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) issue(path, 'duplicate-html-id', `Repeated IDs make fragment navigation ambiguous: ${duplicateIds.join(', ')}.`);
  const body = markup.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || markup;
  const visibleText = plain(body.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ''));
  const h1s = [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => plain(match[1]));
  const titleMatches = [...markup.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(match => plain(match[1]));
  const title = titleMatches[0] || '';
  const metas = elements(markup, 'meta');
  const descriptionValues = metas.filter(meta => meta.name?.toLowerCase() === 'description').map(meta => meta.content || '');
  const description = descriptionValues[0] || '';
  const canonicals = elements(markup, 'link').filter(link => link.rel?.toLowerCase().split(/\s+/).includes('canonical')).map(link => link.href);
  const llmsAlternate = elements(markup, 'link').find(link => link.rel === 'alternate' && link.type === 'text/markdown' && new URL(link.href || '/', base).pathname === '/llms.txt');
  if (!llmsAlternate) issue(path, 'llms-discovery', 'Expected a text/markdown alternate link to /llms.txt.');
  const ogUrls = metas.filter(meta => meta.property?.toLowerCase() === 'og:url').map(meta => meta.content);
  const expected = canonicalFor(path);
  if (h1s.length !== 1 || !h1s[0]) issue(path, 'h1', `Expected one nonempty H1; found ${h1s.length}.`);
  if (titleMatches.length !== 1 || !title) issue(path, 'title', `Expected one nonempty title; found ${titleMatches.length}.`);
  if (!/Rai\s*Dispatch/i.test(visibleText)) issue(path, 'brand-content', 'Rai Dispatch brand is absent from page text.');
  if (descriptionValues.length !== 1 || !description) issue(path, 'description', `Expected one nonempty description; found ${descriptionValues.length}.`);
  if (canonicals.length !== 1 || canonicals[0] !== expected) issue(path, 'canonical', `Expected ${expected}; received ${JSON.stringify(canonicals)}.`);
  if (ogUrls.length !== 1 || ogUrls[0] !== expected) issue(path, 'og-url', `Expected ${expected}; received ${JSON.stringify(ogUrls)}.`);
  if (/noindex/i.test(response.robots || '') || metas.some(meta => /^(robots|googlebot)$/i.test(meta.name || '') && /noindex/i.test(meta.content || ''))) issue(path, 'indexability', 'Noindex directive present.');
  if (title) { const other = titles.get(title); if (other) issue(path, 'duplicate-title', `Same title as ${other}.`); else titles.set(title, path); }
  if (description) { const other = descriptions.get(description); if (other) issue(path, 'duplicate-description', `Same description as ${other}.`); else descriptions.set(description, path); }
  if (title.length > 60) issue(path, 'title-length', `${title.length} characters exceeds the approved 60-character limit.`);
  if (description.length > 158) issue(path, 'description-length', `${description.length} characters exceeds the approved 158-character limit.`);
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
  const faqCount = checkFaqAndExactAnswers(path, markup, pageSchemaNodes);
  checkFreeCalculatorSchema(path, pageSchemaNodes);
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
  pages.push({ path, status: response.status, title, titleLength: title.length, description, descriptionLength: description.length, h1: h1s[0], canonical: canonicals[0], jsonLdBlocks: schemaBlocks.length, visibleFaqPairs: faqCount });
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

const supplemental = [];
const legacy = await fetchPath('/testimonials');
const legacyTarget = legacy.location ? new URL(legacy.location, base) : undefined;
if (legacy.status !== 301 || legacyTarget?.pathname !== '/what-to-expect' || ![base.origin, canonicalOrigin].includes(legacyTarget?.origin)) issue('/testimonials', 'legacy-permanent-redirect', `Expected 301 to /what-to-expect; received ${legacy.status} → ${legacy.location || '(none)'}.`);
if (uniquePaths.includes('/testimonials') || !uniquePaths.includes('/what-to-expect')) issue('/sitemap.xml', 'renamed-service-commitments', 'The sitemap must list /what-to-expect and omit /testimonials.');
supplemental.push({ path: '/testimonials', status: legacy.status, location: legacy.location });

const missingPath = '/__rai-seo-audit-missing-page';
const missing = await fetchPath(missingPath);
const missingMarkup = pageMarkup(missing.text);
const missingTitle = plain(missingMarkup.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
if (missing.status !== 404) issue(missingPath, 'not-found-status', `Expected HTTP 404, received ${missing.status}.`);
if (missingTitle !== 'Page not found | Rai Dispatch') issue(missingPath, 'not-found-title', `Expected the specific 404 title, received ${missingTitle}.`);
if (!elements(missingMarkup, 'meta').some(meta => meta.name === 'robots' && /\bnoindex\b/i.test(meta.content || ''))) issue(missingPath, 'not-found-noindex', '404 must carry a noindex robots meta tag.');
if (plain(missingMarkup.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '') !== "That page isn't here") issue(missingPath, 'not-found-h1', 'Expected the approved helpful 404 heading.');
for (const path of ['/equipment', '/pricing', '/contact', '/resources']) if (!elements(missingMarkup, 'a').some(link => link.href === path)) issue(missingPath, 'not-found-navigation', `404 is missing its ${path} recovery link.`);
supplemental.push({ path: missingPath, status: missing.status, title: missingTitle });

for (const path of ['/llms.txt', '/llms-full.txt']) {
  const response = await fetchPath(path);
  if (response.status !== 200 || !/text\/plain/i.test(response.type)) issue(path, 'llms-response', `Expected 200 text/plain; received ${response.status} ${response.type}.`);
  if (!response.text.includes(exactFeesAnswer)) issue(path, 'llms-fee-answer', 'The machine-readable overview must repeat the exact controlling fee answer.');
  if (obsoletePricing.test(response.text)) issue(path, 'llms-obsolete-fee', 'Superseded pricing found in the machine-readable text.');
  for (const equipment of approvedFees) {
    const line = response.text.split('\n').find(line => line.startsWith('- ') && line.includes(`(${canonicalFor(`/equipment/${equipment.slug}`)})`) && line.includes(' of gross revenue on loads we book.'));
    if (!line || percentages(line).join(',') !== String(equipment.rate)) issue(path, 'llms-equipment-fee', `Expected a current ${equipment.slug} source link and ${equipment.rate}% billing-base statement.`);
  }
  if (!/Other truck types have a published 5% fee, subject to service availability and written rate confirmation\./.test(response.text)) issue(path, 'llms-other-terms', 'Other equipment must retain conditional terms and written rate confirmation.');
  const sourceLinks = [...response.text.matchAll(/https:\/\/raidispatch\.com(?:\/[^\s)\]]*)?/g)].map(match => new URL(match[0]));
  for (const link of sourceLinks) {
    const pathName = normalizedPath(link.pathname);
    if (!uniquePaths.includes(pathName) && !['/llms.txt', '/llms-full.txt'].includes(pathName)) issue(path, 'llms-source-url', `Source is not a current canonical sitemap page: ${link.href}`);
    if (link.search || link.hash) issue(path, 'llms-source-variant', `Use canonical page URLs in the machine-readable source list: ${link.href}`);
  }
  if (path === '/llms-full.txt') for (const expected of Object.values(exactEquipmentAnswers)) if (!response.text.includes(expected)) issue(path, 'llms-full-exact-equipment', 'Full text is missing a controlling box/cargo/Sprinter answer.');
  supplemental.push({ path, status: response.status, type: response.type, canonicalSourceLinks: sourceLinks.length });
}

const report = { approvedPricing: { range: '4–12%', equipment: Object.fromEntries(approvedFees.map(({ slug, rate }) => [slug, rate])), other: { conditionalPublishedRate: 5, requiresWrittenConfirmation: true, calculable: false } }, baseUrl: base.origin, canonicalOrigin, checkedAt: new Date().toISOString(), pageCount: pages.length, sitemapUrlCount: locations.length, internalTargetsChecked: checkedLinks.size, supplemental, failures, warnings, pages: pages.sort((a, b) => a.path.localeCompare(b.path)) };
if (outputPath) { await mkdir(dirname(outputPath), { recursive: true }); await writeFile(outputPath, JSON.stringify(report, null, 2) + '\n'); }
for (const failure of failures) console.error(`FAIL ${failure.path} [${failure.check}] ${failure.detail}`);
for (const warning of warnings) console.warn(`WARN ${warning.path} [${warning.check}] ${warning.detail}`);
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${pages.length}/${locations.length} sitemap pages; ${checkedLinks.size} internal link targets; ${failures.length} failures; ${warnings.length} advisory warnings.`);
console.log('Checks cover rendered HTML and JSON-LD syntax, not Google indexing, rankings, rich-result eligibility, or real-user performance.');
process.exitCode = failures.length ? 1 : 0;
