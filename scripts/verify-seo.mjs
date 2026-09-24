#!/usr/bin/env node
/**
 * Read-only HTTP audit of the deployed, server-rendered site.
 * Usage: node scripts/verify-seo.mjs http://localhost:3000 [--json /tmp/seo.json]
 *        node scripts/verify-seo.mjs https://raidispatch.com
 * No browser or third-party service is used. Requires Node 18+.
 */
import { writeFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const jsonIndex = args.indexOf('--json');
const outputPath = jsonIndex >= 0 ? args[jsonIndex + 1] : undefined;
const requestedBase = args.find((value, index) => !value.startsWith('--') && (jsonIndex < 0 || index !== jsonIndex + 1)) || 'http://localhost:3000';
const base = new URL(requestedBase);
const canonicalOrigin = 'https://raidispatch.com';
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw new Error('Provide a plain HTTP(S) origin without credentials.');
base.pathname = '/'; base.search = ''; base.hash = '';
const failures = [];
const warnings = [];
const pages = [];
const cache = new Map();
const checkedLinks = new Set();

const issue = (path, check, detail) => failures.push({ path, check, detail });
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#(\d+)|#x([0-9a-f]+));/gi, (match, decimal, hex) => {
  if (decimal || hex) return String.fromCodePoint(Number.parseInt(decimal || hex, decimal ? 10 : 16));
  return ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' })[match.toLowerCase()] || match;
});
const plain = value => decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
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
  const staleRate = visibleText.match(/\b(?:6|7)\s*%/);
  if (staleRate) issue(path, 'stale-pricing', `Old percentage found: ${staleRate[0]}.`);
  if (/Marcus Johnson|David Chen|Robert Williams|James Anderson|Michael Thompson|Anthony Davis|Christopher Brown|Daniel Garcia|William Martinez|Joseph Taylor|Kevin Robinson|Brian Wilson|verified (?:driver|owner.operator)|sample loads|live load ticker|average dispatcher|\$5k\s*[–-]\s*\$9k/i.test(visibleText)) issue(path, 'unsupported-remnants', 'A removed testimonial, sample ticker, comparison, or revenue claim remains.');
  const schemaBlocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match => attributes(match[1]).type?.toLowerCase() === 'application/ld+json');
  if (!schemaBlocks.length) issue(path, 'json-ld', 'No JSON-LD block found.');
  for (let index = 0; index < schemaBlocks.length; index++) {
    try {
      const value = JSON.parse(schemaBlocks[index][2]);
      const nodes = schemaNodes(value);
      if (!nodes.some(node => /^https?:\/\/schema\.org\/?$/.test(node['@context'] || ''))) issue(path, 'json-ld-context', `Block ${index + 1} has no schema.org context.`);
      if (!nodes.some(node => node['@type'])) issue(path, 'json-ld-type', `Block ${index + 1} has no typed node.`);
      if (nodes.some(node => [node['@type']].flat().some(type => ['Review', 'AggregateRating'].includes(type)))) issue(path, 'review-schema', 'Unverified review or rating schema remains.');
    } catch (error) { issue(path, 'json-ld-syntax', `Block ${index + 1}: ${error.message}`); }
  }
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

const report = { baseUrl: base.origin, canonicalOrigin, checkedAt: new Date().toISOString(), pageCount: pages.length, sitemapUrlCount: locations.length, internalTargetsChecked: checkedLinks.size, failures, warnings, pages: pages.sort((a, b) => a.path.localeCompare(b.path)) };
if (outputPath) await writeFile(outputPath, JSON.stringify(report, null, 2) + '\n');
for (const failure of failures) console.error(`FAIL ${failure.path} [${failure.check}] ${failure.detail}`);
for (const warning of warnings) console.warn(`WARN ${warning.path} [${warning.check}] ${warning.detail}`);
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${pages.length}/${locations.length} sitemap pages; ${checkedLinks.size} internal link targets; ${failures.length} failures; ${warnings.length} advisory warnings.`);
console.log('Checks cover rendered HTML and JSON-LD syntax, not Google indexing, rankings, rich-result eligibility, or real-user performance.');
process.exitCode = failures.length ? 1 : 0;
