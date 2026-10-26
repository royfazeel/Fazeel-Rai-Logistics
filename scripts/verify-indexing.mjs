#!/usr/bin/env node
/**
 * Read-only regression checks for crawlability and canonical redirects.
 *
 * node scripts/verify-indexing.mjs http://localhost:3000
 * node scripts/verify-indexing.mjs https://raidispatch.com --json /tmp/indexing.json
 * node scripts/verify-indexing.mjs http://localhost:3000 --json
 *
 * Loopback runs simulate the public alias Host headers against the local server.
 * Remote runs request the actual public aliases. No redirects are followed, so a
 * local test cannot silently pass by fetching the deployed site. Requires Node 18+.
 * --json prints a concise JSON summary instead of prose; an optional path also
 * saves the full report. --expect-pages N intentionally updates the release count.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

function options(argv) {
  const result = { base: 'http://localhost:3000', json: false, output: undefined, expectedPages: 54, concurrency: 6, timeout: 20_000 };
  let hasBase = false;
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--json') {
      result.json = true;
      if (argv[index + 1] && !argv[index + 1].startsWith('--') && !/^https?:\/\//i.test(argv[index + 1])) result.output = argv[++index];
    } else if (['--expect-pages', '--concurrency', '--timeout'].includes(arg)) {
      const key = { '--expect-pages': 'expectedPages', '--concurrency': 'concurrency', '--timeout': 'timeout' }[arg];
      const value = Number(argv[++index]);
      if (!Number.isInteger(value) || value < 1) throw new Error(`${arg} requires a positive integer.`);
      result[key] = value;
    } else if (!arg.startsWith('--') && !hasBase) {
      result.base = arg;
      hasBase = true;
    } else throw new Error(`Unrecognized argument: ${arg}`);
  }
  if (result.concurrency > 12) throw new Error('--concurrency must be between 1 and 12.');
  if (result.timeout < 1000 || result.timeout > 60_000) throw new Error('--timeout must be between 1000 and 60000 milliseconds.');
  return result;
}

const config = options(process.argv.slice(2));
const base = new URL(config.base);
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.pathname !== '/' || base.search || base.hash) {
  throw new Error('Provide a plain HTTP(S) origin without credentials, a path, query, or fragment.');
}
const canonicalOrigin = 'https://raidispatch.com';
const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
const aliasHosts = ['railogistics.us', 'www.railogistics.us', 'www.raidispatch.com', 'fazeel-rai-logistics.vercel.app'];
const query = '?utm_source=indexing-audit&utm_medium=regression&reference=canonical%20check';
const mobileGooglebot = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const failures = [];
const groups = {};
let requests = 0;
const started = Date.now();
const fail = (check, url, detail) => failures.push({ check, url, detail });
const record = group => { groups[group] = (groups[group] || 0) + 1; };
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#(\d+)|#x([0-9a-f]+));/gi, (match, decimal, hex) => {
  if (decimal || hex) return String.fromCodePoint(Number.parseInt(decimal || hex, decimal ? 10 : 16));
  return ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' })[match.toLowerCase()] || match;
});
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]));
const elements = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
const markup = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const canonicalFor = path => canonicalOrigin + (path === '/' ? '' : path);

function localRequest(url, aliasHost) {
  // Node fetch may normalize Host to the URL's loopback host. Use the native
  // transport so a host-based redirect test actually sends the requested host.
  return new Promise((resolve, reject) => {
    const transport = url.startsWith('https:') ? httpsRequest : httpRequest;
    const request = transport(url, {
      signal: AbortSignal.timeout(config.timeout),
      headers: { 'user-agent': mobileGooglebot, ...(aliasHost ? { host: aliasHost } : {}) },
    }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('error', reject);
      response.on('end', () => {
        const header = name => [response.headers[name] || ''].flat().join(', ');
        resolve({
          status: response.statusCode,
          location: header('location'),
          robots: header('x-robots-tag'),
          type: header('content-type'),
          text: Buffer.concat(chunks).toString('utf8'),
        });
      });
    });
    request.on('error', reject);
    request.end();
  });
}

async function request(path, aliasHost) {
  const origin = aliasHost && !local ? `https://${aliasHost}` : base.origin;
  const url = new URL(path, origin).href;
  const displayUrl = aliasHost ? new URL(path, `https://${aliasHost}`).href : url;
  requests++;
  try {
    if (local) return { url: displayUrl, ...await localRequest(url, aliasHost) };
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(config.timeout),
      headers: { 'user-agent': mobileGooglebot },
    });
    return {
      url: displayUrl,
      status: response.status,
      location: response.headers.get('location'),
      robots: response.headers.get('x-robots-tag') || '',
      type: response.headers.get('content-type') || '',
      text: await response.text(),
    };
  } catch (error) {
    return { url: displayUrl, status: 0, text: '', error: error.message };
  }
}

async function batch(items, work) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(config.concurrency, items.length) }, async () => {
    while (next < items.length) await work(items[next++]);
  }));
}

function redirect(response, expected, group) {
  record(group);
  if (![301, 308].includes(response.status)) {
    fail(group, response.url, `Expected a permanent 301/308 redirect; received ${response.status}${response.error ? ` (${response.error})` : ''}.`);
    return;
  }
  if (!response.location) {
    fail(group, response.url, 'Permanent redirect is missing its Location header.');
    return;
  }
  let target;
  try { target = new URL(response.location, response.url); }
  catch { fail(group, response.url, `Invalid Location: ${response.location}`); return; }
  const wanted = new URL(expected, response.url);
  // Query order is not material; the complete multiset of keys/values is.
  const pairs = url => JSON.stringify([...url.searchParams].sort(([ak, av], [bk, bv]) => ak.localeCompare(bk) || av.localeCompare(bv)));
  if (target.origin !== wanted.origin || target.pathname !== wanted.pathname || target.hash !== wanted.hash || pairs(target) !== pairs(wanted)) {
    fail(group, response.url, `Expected ${wanted.href}; received ${target.href}.`);
  }
}

function pageMetadata(response, path, group) {
  record(group);
  if (response.status !== 200) {
    fail(group, response.url, `Expected direct 200; received ${response.status}${response.error ? ` (${response.error})` : ''}.`);
    return;
  }
  const html = markup(response.text);
  const canonicals = elements(html, 'link').filter(link => link.rel?.toLowerCase().split(/\s+/).includes('canonical')).map(link => link.href);
  const robots = [response.robots, ...elements(html, 'meta').filter(meta => /^(robots|googlebot)$/i.test(meta.name || '')).map(meta => meta.content || '')].join(',');
  if (!/text\/html/i.test(response.type)) fail(group, response.url, `Expected HTML; received ${response.type}.`);
  if (canonicals.length !== 1 || canonicals[0] !== canonicalFor(path)) fail(group, response.url, `Expected one canonical ${canonicalFor(path)}; received ${JSON.stringify(canonicals)}.`);
  if (/\b(?:noindex|none)\b/i.test(robots)) fail(group, response.url, `Index-blocking directive: ${robots}`);
}

if (!config.json) console.log(`Checking indexing at ${base.origin} (${local ? 'local alias Host simulation' : 'live public aliases'}).`);
const sitemap = await request('/sitemap.xml');
if (sitemap.status !== 200) fail('sitemap', sitemap.url, `Expected 200; received ${sitemap.status}${sitemap.error ? ` (${sitemap.error})` : ''}.`);
const locations = [...sitemap.text.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/g)].map(match => decode(match[1]));
const paths = [];
for (const location of locations) {
  try {
    const url = new URL(location);
    if (url.origin !== canonicalOrigin || url.search || url.hash || (url.pathname !== '/' && url.pathname.endsWith('/'))) fail('sitemap', location, 'Expected a clean canonical HTTPS URL without query, fragment, or trailing slash.');
    paths.push(url.pathname);
  } catch { fail('sitemap', location, 'Invalid URL.'); }
}
const uniquePaths = [...new Set(paths)];
if (locations.length !== uniquePaths.length) fail('sitemap', sitemap.url, 'Duplicate or invalid sitemap URL.');
if (uniquePaths.length !== config.expectedPages) fail('sitemap', sitemap.url, `Expected ${config.expectedPages} pages; received ${uniquePaths.length}.`);

const jobs = [
  ...uniquePaths.map(path => async () => pageMetadata(await request(path), path, 'canonical-pages')),
  ...uniquePaths.map(path => async () => pageMetadata(await request(path + query), path, 'query-canonicals')),
  ...aliasHosts.flatMap(host => uniquePaths.map(path => async () => {
    const response = await request(path + query, host);
    redirect(response, canonicalOrigin + path + query, 'host-redirects');
  })),
  ...['/index', '/index' + query].map(path => async () => {
    redirect(await request(path), '/' + (path.includes('?') ? query : ''), 'homepage-alias');
  }),
  ...uniquePaths.filter(path => path !== '/').map(path => async () => {
    redirect(await request(path + '/' + query), path + query, 'trailing-slash');
  }),
  ...['/not-a-real-page-indexing-audit', '/services/not-a-real-page-indexing-audit', '/equipment/not-a-real-page-indexing-audit', '/resources/not-a-real-page-indexing-audit', '/carriers/not-a-real-page-indexing-audit'].map(path => async () => {
    const response = await request(path);
    record('genuine-404');
    if (response.status !== 404) fail('genuine-404', response.url, `Expected HTTP 404; received ${response.status}${response.error ? ` (${response.error})` : ''}.`);
    const html = markup(response.text);
    const canonicals = elements(html, 'link').filter(link => link.rel?.toLowerCase().split(/\s+/).includes('canonical')).map(link => link.href);
    const robots = [response.robots, ...elements(html, 'meta').filter(meta => /^(robots|googlebot)$/i.test(meta.name || '')).map(meta => meta.content || '')].filter(Boolean).join(',');
    if (!/\b(?:noindex|none)\b/i.test(robots)) fail('genuine-404', response.url, 'Error page must include noindex.');
    if (/\bindex\b/i.test(robots)) fail('genuine-404', response.url, `Error page inherits an explicit index directive: ${robots}`);
    if (canonicals.length) fail('genuine-404', response.url, `Error page must not advertise an unrelated canonical: ${JSON.stringify(canonicals)}.`);
  }),
];
await batch(jobs, run => run());

const report = {
  passed: failures.length === 0,
  baseUrl: base.origin,
  mode: local ? 'local-host-simulation' : 'live-public-aliases',
  checkedAt: new Date().toISOString(),
  sitemapPages: uniquePaths.length,
  aliasHosts,
  requests,
  checks: groups,
  elapsedSeconds: Math.round((Date.now() - started) / 100) / 10,
  failureCount: failures.length,
  failures,
};
if (config.output) {
  await mkdir(dirname(config.output), { recursive: true });
  await writeFile(config.output, JSON.stringify(report, null, 2) + '\n');
}
if (config.json) console.log(JSON.stringify({
  ...report,
  failures: failures.slice(0, 10),
  ...(failures.length > 10 ? { additionalFailures: failures.length - 10 } : {}),
  ...(config.output ? { reportPath: config.output } : {}),
}));
else {
  for (const failure of failures) console.error(`FAIL ${failure.url} [${failure.check}] ${failure.detail}`);
  console.log(`${report.passed ? 'PASS' : 'FAIL'}: ${uniquePaths.length} sitemap pages, ${groups['host-redirects'] || 0} host redirects, ${requests} requests; ${failures.length} failures.`);
  console.log('Checks verify current HTTP/HTML behavior; Google must recrawl before its selected canonicals or indexing reports change.');
}
process.exitCode = report.passed ? 0 : 1;
