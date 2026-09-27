#!/usr/bin/env node
/**
 * Crawl server-rendered sitemap pages and their actual first-party resources.
 * No browser, JavaScript execution, form submission, or guessed asset URLs.
 * Usage: node scripts/verify-assets.mjs http://localhost:3000 --json output/seo-sep28/assets.json
 * Optional: --pages /,/pricing --user-agent 'Googlebot-Image/1.0' --check-external
 * Requires Node 18+ and Sharp already installed with this Next.js project.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node scripts/verify-assets.mjs ORIGIN [--json FILE] [--pages /,/pricing] [--user-agent UA] [--check-external]');
  process.exit(0);
}
const valuedFlags = ['--json', '--pages', '--user-agent'];
const optionValues = new Set(valuedFlags.map(flag => args.indexOf(flag)).filter(index => index >= 0).map(index => index + 1));
const option = flag => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
for (const flag of valuedFlags) if (args.includes(flag) && (!option(flag) || option(flag).startsWith('--'))) throw new Error(`${flag} requires a value.`);
const base = new URL(args.find((value, index) => !value.startsWith('--') && !optionValues.has(index)) || 'http://localhost:3000');
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw new Error('Provide an HTTP(S) origin without credentials.');
base.pathname = '/'; base.search = ''; base.hash = '';
const canonicalOrigin = 'https://raidispatch.com';
const firstPartyOrigins = new Set([base.origin, canonicalOrigin, 'https://www.raidispatch.com', 'http://raidispatch.com', 'http://www.raidispatch.com']);
const userAgent = option('--user-agent') || 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const sharp = createRequire(import.meta.url)('sharp');
const failures = [];
const warnings = [];
const pages = [];
const resources = new Map();
const external = new Map();
const issue = (url, check, detail) => failures.push({ url, check, detail });
const decode = value => String(value || '').replace(/&(?:amp|quot|apos|lt|gt|nbsp|#(\d+)|#x([0-9a-f]+));/gi, (match, decimal, hex) => decimal || hex ? String.fromCodePoint(Number.parseInt(decimal || hex, decimal ? 10 : 16)) : ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' })[match.toLowerCase()] || match);
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]));

// A data URL contains a comma. Splitting the whole srcset on commas invents a
// bogus HTTP request for its base64 payload. Consume URL + descriptors instead.
function srcsetUrls(value) {
  const urls = [];
  let position = 0;
  while (position < value.length) {
    while (/[\s,]/.test(value[position] || '') && position < value.length) position++;
    const start = position;
    while (position < value.length && !/\s/.test(value[position])) position++;
    let url = value.slice(start, position);
    if (!url) break;
    const trailingComma = /,$/.test(url);
    url = url.replace(/,+$/, '');
    if (!/^data:|^blob:/i.test(url)) urls.push(url);
    if (trailingComma) continue;
    let depth = 0;
    while (position < value.length) {
      const character = value[position++];
      if (character === '(') depth++;
      if (character === ')') depth--;
      if (character === ',' && depth <= 0) break;
    }
  }
  return urls;
}
function rememberExternal(url, from, kind) {
  if (!external.has(url)) external.set(url, { url, from: new Set(), kinds: new Set() });
  external.get(url).from.add(from); external.get(url).kinds.add(kind);
}
function addResource(raw, from, kind, baseUrl = from) {
  if (!raw || /^(?:data:|blob:|mailto:|tel:|sms:|javascript:|#)/i.test(raw)) return;
  let url;
  try { url = new URL(decode(raw), baseUrl); } catch { issue(from, 'invalid-resource-url', raw); return; }
  if (!['http:', 'https:'].includes(url.protocol)) return;
  url.hash = '';
  if (!firstPartyOrigins.has(url.origin)) { rememberExternal(url.href, from, kind); return; }
  const target = new URL(url.pathname + url.search, base).href;
  if (!resources.has(target)) resources.set(target, { url: target, references: new Set(), kinds: new Set(), advertisedUrls: new Set(), checked: false });
  const resource = resources.get(target);
  resource.references.add(from); resource.kinds.add(kind); resource.advertisedUrls.add(url.href);
  if (url.pathname.startsWith('/_next/image')) issue(from, 'runtime-image-optimizer', `Unexpected runtime image optimizer URL: ${url.href}`);
}
function cssResources(css, from) {
  for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gi)) {
    const url = match[1] ?? match[2] ?? match[3];
    addResource(url, from, /\.(?:woff2?|ttf|otf)(?:[?#]|$)/i.test(url) ? 'font' : 'image');
  }
  for (const match of css.matchAll(/@import\s+["']([^"']+)["']/gi)) addResource(match[1], from, 'stylesheet');
}
function schemaImages(value, from, key = '') {
  if (Array.isArray(value)) { for (const item of value) schemaImages(item, from, key); return; }
  if (typeof value === 'string') { if (['image', 'logo', 'contentUrl', 'thumbnailUrl'].includes(key)) addResource(value, from, 'image'); return; }
  if (!value || typeof value !== 'object') return;
  if ([value['@type']].flat().includes('ImageObject')) addResource(value.url || value.contentUrl, from, 'image');
  for (const [name, child] of Object.entries(value)) schemaImages(child, from, name);
}
function htmlResources(html, from) {
  for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) cssResources(match[1], from);
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attributes(match[1]).type === 'application/ld+json') {
      try { schemaImages(JSON.parse(match[2]), from); } catch { issue(from, 'json-ld', 'Malformed JSON-LD while discovering image URLs.'); }
    }
  }
  const markup = html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  for (const match of markup.matchAll(/<([a-z][\w:-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const tag = match[1].toLowerCase();
    const attr = attributes(match[0]);
    if (attr.style) cssResources(attr.style, from);
    if (attr.src) addResource(attr.src, from, tag === 'script' ? attr.type === 'module' ? 'module-script' : 'script' : /^(video|audio)$/.test(tag) || /^(video|audio)\//.test(attr.type || '') ? 'media' : tag === 'iframe' ? 'document' : 'image');
    if (attr.poster) addResource(attr.poster, from, 'image');
    for (const url of srcsetUrls(attr.srcset || '')) addResource(url, from, 'image');
    if (tag === 'link') {
      const rel = (attr.rel || '').split(/\s+/);
      if (rel.includes('stylesheet')) addResource(attr.href, from, 'stylesheet');
      if (rel.some(value => /(?:^|-)icon$/.test(value))) addResource(attr.href, from, 'image');
      if (rel.includes('manifest')) addResource(attr.href, from, 'manifest');
      if (rel.includes('modulepreload')) addResource(attr.href, from, 'module-script');
      if (rel.includes('preload')) {
        if (attr.href) addResource(attr.href, from, attr.as === 'style' ? 'stylesheet' : attr.as === 'font' ? 'font' : attr.as === 'script' ? 'script' : 'image');
        for (const url of srcsetUrls(attr.imagesrcset || '')) addResource(url, from, 'image');
      }
    }
    if (tag === 'meta' && /^(?:og:image(?::url|:secure_url)?|twitter:image(?::src)?)$/.test(attr.property || attr.name || '')) addResource(attr.content, from, 'image');
    if (tag === 'a' && attr.href) {
      try { const url = new URL(attr.href, from); if (/^https?:$/.test(url.protocol) && !firstPartyOrigins.has(url.origin)) rememberExternal(url.href, from, 'link'); } catch { /* SEO crawler reports malformed navigation URLs. */ }
    }
  }
}
async function fetchBytes(url, method = 'GET') {
  try {
    const response = await fetch(url, { method, redirect: 'manual', signal: AbortSignal.timeout(30_000), headers: { 'user-agent': userAgent } });
    const bytes = method === 'HEAD' ? Buffer.alloc(0) : Buffer.from(await response.arrayBuffer());
    return { status: response.status, bytes, type: response.headers.get('content-type') || '', location: response.headers.get('location'), cacheControl: response.headers.get('cache-control'), vercelCache: response.headers.get('x-vercel-cache'), vercelError: response.headers.get('x-vercel-error') };
  } catch (error) { return { status: 0, bytes: Buffer.alloc(0), type: '', error: error.message }; }
}
async function batch(items, work, width = 4) {
  for (let start = 0; start < items.length; start += width) await Promise.all(items.slice(start, start + width).map(work));
}
function validateFont(bytes) {
  const signature = bytes.subarray(0, 4).toString('latin1');
  if (signature === 'wOF2' || signature === 'wOFF') {
    const minimum = signature === 'wOF2' ? 48 : 44;
    if (bytes.length < minimum || bytes.readUInt32BE(8) !== bytes.length || bytes.readUInt16BE(12) < 1) throw new Error('Invalid WOFF length/table header.');
  } else if (!['OTTO', '\u0000\u0001\u0000\u0000', 'true', 'ttcf'].includes(signature) || bytes.length < 12) throw new Error('Unrecognized font container signature.');
  return { container: signature, containerValidated: true };
}
async function validateImage(bytes, url) {
  if (bytes.length >= 6 && bytes.readUInt32LE(0) === 65536) {
    const count = bytes.readUInt16LE(4);
    if (!count || bytes.length < 6 + count * 16) throw new Error('Invalid ICO directory.');
    const frames = [];
    for (let index = 0; index < count; index++) {
      const at = 6 + index * 16, width = bytes[at] || 256, height = bytes[at + 1] || 256;
      const length = bytes.readUInt32LE(at + 8), offset = bytes.readUInt32LE(at + 12);
      if (!length || offset + length > bytes.length) throw new Error('Truncated ICO frame.');
      const payload = bytes.subarray(offset, offset + length);
      if (payload.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        const metadata = await sharp(payload).metadata();
        await sharp(payload).raw().toBuffer();
        if (metadata.width !== width || metadata.height !== height) throw new Error('ICO frame dimensions differ from directory.');
      } else if (payload.length < 40 || payload.readUInt32LE(0) < 40) throw new Error('Invalid ICO bitmap header.');
      frames.push({ width, height });
    }
    return { format: 'ico', frames };
  }
  const metadata = await sharp(bytes).metadata();
  if (!metadata.width || !metadata.height) throw new Error('Missing image dimensions.');
  await sharp(bytes).raw().toBuffer();
  return { format: metadata.format, width: metadata.width, height: metadata.height, decoded: true };
}
async function inspectResource(resource) {
  resource.checked = true;
  const response = await fetchBytes(resource.url);
  Object.assign(resource, { status: response.status, type: response.type, bytes: response.bytes.length, sha256: createHash('sha256').update(response.bytes).digest('hex'), cacheControl: response.cacheControl, vercelCache: response.vercelCache });
  if (response.status !== 200) { issue(resource.url, 'asset-http', `Expected 200; received ${response.status} ${response.vercelError || response.error || response.location || ''}.`); return; }
  const bytes = response.bytes;
  const text = bytes.toString('utf8');
  if (!bytes.length) { issue(resource.url, 'empty-resource', 'HTTP 200 returned zero bytes.'); return; }
  const mime = response.type.split(';')[0].trim().toLowerCase();
  const kinds = resource.kinds;
  try {
    if (kinds.has('image')) {
      if (!/^image\//.test(mime)) throw new Error(`Image returned unexpected MIME ${mime}.`);
      resource.validation = await validateImage(bytes, resource.url);
    } else if (kinds.has('font')) {
      if (!/^font\//.test(mime) && !/^(application\/(font-woff|x-font-woff|x-font-ttf|vnd\.ms-fontobject|octet-stream))$/.test(mime)) throw new Error(`Font returned unexpected MIME ${mime}.`);
      resource.validation = validateFont(bytes);
    } else if (kinds.has('script') || kinds.has('module-script')) {
      if (!/^(?:application|text)\/(?:x-)?(?:javascript|ecmascript)$/.test(mime)) throw new Error(`JavaScript returned unexpected MIME ${mime}.`);
      if (/^\s*(?:<!doctype\s+html|<html\b)/i.test(text)) throw new Error('JavaScript URL returned HTML.');
      if (!kinds.has('module-script')) { new Script(text, { filename: resource.url }); resource.validation = { parsedJavaScript: true, executed: false }; }
      else resource.validation = { nonemptyJavaScript: true, executed: false };
    } else if (kinds.has('stylesheet')) {
      if (mime !== 'text/css' || /^\s*(?:<!doctype\s+html|<html\b)/i.test(text)) throw new Error(`Stylesheet returned invalid MIME/body (${mime}).`);
      resource.validation = { nonemptyCss: true };
      cssResources(text, resource.url);
    } else if (kinds.has('manifest')) {
      if (!['application/json', 'application/manifest+json'].includes(mime)) throw new Error(`Manifest returned unexpected MIME ${mime}.`);
      const manifest = JSON.parse(text);
      for (const icon of manifest.icons || []) addResource(icon.src, resource.url, 'image');
      resource.validation = { parsedManifest: true, iconCount: manifest.icons?.length || 0 };
    } else if (kinds.has('media')) {
      if (!/^(?:video|audio)\//.test(mime)) throw new Error(`Media returned unexpected MIME ${mime}.`);
      if (mime === 'video/mp4' && bytes.subarray(4, 8).toString() !== 'ftyp') throw new Error('MP4 header missing ftyp box.');
      resource.validation = { mediaContainerOnly: true };
    } else if (kinds.has('document') && mime !== 'text/html') throw new Error(`Frame document returned unexpected MIME ${mime}.`);
  } catch (error) { issue(resource.url, 'asset-content', error.message); }
}

console.log(`Auditing first-party resources at ${base.origin}`);
let paths = option('--pages')?.split(',').filter(Boolean);
if (!paths) {
  const sitemap = await fetchBytes(new URL('/sitemap.xml', base));
  if (sitemap.status !== 200) issue('/sitemap.xml', 'http', `Sitemap returned ${sitemap.status}.`);
  paths = [...sitemap.bytes.toString('utf8').matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/g)].map(match => {
    try { return new URL(decode(match[1])).pathname; } catch { issue('/sitemap.xml', 'url', match[1]); return null; }
  }).filter(Boolean);
}
paths = [...new Set(paths)];
if (!paths.length) issue('/sitemap.xml', 'routes', 'No pages to audit.');
await batch(paths, async path => {
  const url = new URL(path, base).href;
  const response = await fetchBytes(url);
  pages.push({ url, status: response.status, type: response.type });
  if (response.status !== 200 || !/^text\/html(?:;|$)/i.test(response.type)) { issue(url, 'page-http', `Expected HTML 200; received ${response.status} ${response.type}.`); return; }
  const html = response.bytes.toString('utf8');
  if (!/<html\b/i.test(html) || !/<body\b/i.test(html)) issue(url, 'page-content', 'Response is missing the rendered HTML document/body.');
  htmlResources(html, url);
});
if (!resources.size) issue(base.origin, 'resource-discovery', 'No first-party resources were discovered.');
while ([...resources.values()].some(resource => !resource.checked)) {
  await batch([...resources.values()].filter(resource => !resource.checked), inspectResource);
}
const externalResults = [];
if (args.includes('--check-external')) await batch([...external.values()], async resource => {
  const response = await fetchBytes(resource.url, 'HEAD');
  externalResults.push({ url: resource.url, status: response.status, location: response.location, type: response.type });
  if (!(response.status >= 200 && response.status < 400)) warnings.push({ url: resource.url, check: 'external-head', detail: `External HEAD returned ${response.status}; verify interactively before treating access restrictions as a broken link.` });
});
const serializedResources = [...resources.values()].map(({ references, kinds, advertisedUrls, checked, ...resource }) => ({ ...resource, references: [...references].sort(), kinds: [...kinds].sort(), advertisedUrls: [...advertisedUrls].sort() })).sort((a, b) => a.url.localeCompare(b.url));
const report = {
  baseUrl: base.origin, checkedAt: new Date().toISOString(), userAgent,
  note: 'Server-rendered references only; no JavaScript execution or forms. A Googlebot user agent does not originate from Google crawler IPs. Images are decoded; font containers and classic JS syntax are validated, not executed. External HEAD checks are optional and advisory.',
  pageCount: pages.length, resourceCount: resources.size, pages, resources: serializedResources,
  externalReferences: [...external.values()].map(({ from, kinds, ...resource }) => ({ ...resource, from: [...from], kinds: [...kinds] })), externalResults, failures, warnings,
};
if (option('--json')) { await mkdir(dirname(option('--json')), { recursive: true }); await writeFile(option('--json'), JSON.stringify(report, null, 2) + '\n'); }
for (const failure of failures) console.error(`FAIL ${failure.url} [${failure.check}] ${failure.detail}`);
for (const warning of warnings) console.warn(`WARN ${warning.url} [${warning.check}] ${warning.detail}`);
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${pages.length} pages; ${resources.size} first-party resources; ${failures.length} failures; ${warnings.length} advisory warnings; ${external.size} external references${args.includes('--check-external') ? ' checked with HEAD' : ' recorded without requests'}.`);
process.exitCode = failures.length ? 1 : 0;
