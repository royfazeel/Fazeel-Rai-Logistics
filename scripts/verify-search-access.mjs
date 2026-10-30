#!/usr/bin/env node
/** Representative HTTP checks with declared crawler headers, not authenticated bot traffic. */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const origin = process.argv[2] || 'https://raidispatch.com';
const output = process.argv[3];
const base = new URL(origin);
if (!['http:', 'https:'].includes(base.protocol) || base.pathname !== '/' || base.search || base.hash || base.username || base.password) throw new Error('Provide a plain HTTP(S) origin.');
const profiles = ['Googlebot', 'bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];
// Independent acceptance values from the owner's nine confirmed specialties.
// Do not import site pricing: the audit should detect a consistently wrong fee.
const equipmentFees = {
  'box-truck': 7, 'dry-van': 5, reefer: 4, flatbed: 5, 'power-only': 5,
  'step-deck': 5, hotshot: 6, 'cargo-van': 12, conestoga: 4,
};
const paths = ['/', '/resources/trucking-dispatch-glossary', '/tools/load-profit-calculator', ...Object.keys(equipmentFees).map(slug => `/equipment/${slug}`)];
const canonicalOrigin = 'https://raidispatch.com';
const canonicalFor = path => canonicalOrigin + (path === '/' ? '' : path);
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#(\d+)|#x([0-9a-f]+));/gi, (match, decimal, hex) => {
  if (decimal || hex) return String.fromCodePoint(Number.parseInt(decimal || hex, decimal ? 10 : 16));
  return ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' })[match.toLowerCase()] || match;
});
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]));
const elements = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
const pageMarkup = html => html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const plain = value => decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const percentages = text => [...text.matchAll(/\b(\d+(?:\.\d+)?)\s*%/g)].map(match => Number(match[1]));
const restrictive = /\b(?:noindex|nosnippet|none)\b|max-snippet\s*:\s*0\b/i;
const hasType = (node, type) => [node?.['@type']].flat().includes(type);
function schemaNodes(value) {
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  return value && typeof value === 'object' ? [value, ...Object.values(value).flatMap(schemaNodes)] : [];
}
function applicableHeader(value, agent) {
  // X-Robots-Tag can scope subsequent comma-separated directives to one bot.
  const directiveNames = new Set(['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after']);
  let scope;
  return value.split(',').filter(part => {
    const prefix = part.trim().match(/^([a-z][\w-]*)\s*:/i)?.[1].toLowerCase();
    if (prefix && !directiveNames.has(prefix)) scope = prefix;
    return !scope || scope === agent.toLowerCase();
  }).join(',');
}

function equipmentEvidence(html, markup, path, issues) {
  const slug = path.replace('/equipment/', '');
  const expectedRate = equipmentFees[slug];
  if (expectedRate === undefined) return undefined;
  const article = markup.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  const hero = article?.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1];
  const visibleRates = percentages(hero ? plain(hero) : '');
  if (!hero) issues.push('No server-rendered equipment hero found');
  if (!visibleRates.length || visibleRates.some(rate => rate !== expectedRate)) issues.push(`Equipment hero must show its ${expectedRate}% fee`);
  const title = plain(markup.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = elements(markup, 'meta').find(meta => meta.name?.toLowerCase() === 'description')?.content || '';
  const metadataRates = percentages(`${title} ${description}`);
  if (metadataRates.some(rate => rate !== expectedRate)) issues.push(`Equipment metadata contains a fee other than ${expectedRate}%`);
  const nodes = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attributes(match[1]).type?.toLowerCase() !== 'application/ld+json') continue;
    try { nodes.push(...schemaNodes(JSON.parse(match[2]))); }
    catch { issues.push('Invalid JSON-LD'); }
  }
  const services = nodes.filter(node => hasType(node, 'Service') && (node['@id'] === `${canonicalFor(path)}#service` || node.url === canonicalFor(path)));
  if (!services.length) issues.push('No canonical equipment Service entity found');
  const offerRates = [];
  for (const service of services) {
    if (percentages(String(service.description || '')).some(rate => rate !== expectedRate)) issues.push(`Equipment Service describes a fee other than ${expectedRate}%`);
    for (const offer of [service.offers].flat().filter(Boolean)) {
      const rates = percentages(String(offer.description || ''));
      offerRates.push(...rates);
      if (!hasType(offer, 'Offer') || rates.length !== 1 || rates[0] !== expectedRate) issues.push(`Equipment Offer must describe exactly ${expectedRate}%`);
      if (schemaNodes(offer).some(node => node.price !== undefined || node.lowPrice !== undefined || node.highPrice !== undefined)) issues.push('Percentage fee is represented as a monetary Offer price');
    }
  }
  return { expectedRate, visibleRates, metadataRates, serviceEntities: services.length, offerRates };
}
const results = [];
const response = await fetch(`${base.origin}/robots.txt`, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) throw new Error(`robots.txt HTTP ${response.status}`);
const robots = await response.text();
const groups = []; let group; let hasRules = false;
for (const raw of robots.split(/\r?\n/)) {
  const line = raw.split('#')[0].trim();
  const match = line.match(/^(user-agent|allow|disallow):\s*(.*)$/i);
  if (!match) continue;
  const type = match[1].toLowerCase(), value = match[2].trim();
  if (type === 'user-agent') {
    if (!group || hasRules) { group = { agents: [], rules: [] }; groups.push(group); hasRules = false; }
    group.agents.push(value.toLowerCase());
  } else if (group) { group.rules.push({ allow: type === 'allow', path: value }); hasRules = true; }
}
function allowed(agent, path) {
  const scored = groups.map(g => ({ ...g, specificity: Math.max(0, ...g.agents.filter(a => a !== '*' && agent.toLowerCase().includes(a)).map(a => a.length)) }));
  const specificity = Math.max(0, ...scored.map(g => g.specificity));
  const selected = specificity ? scored.filter(g => g.specificity === specificity) : groups.filter(g => g.agents.includes('*'));
  const rules = selected.flatMap(g => g.rules).filter(rule => {
    if (!rule.path) return false;
    const exactEnd = rule.path.endsWith('$');
    const pattern = (exactEnd ? rule.path.slice(0, -1) : rule.path).split('*').map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return new RegExp(`^${pattern}${exactEnd ? '$' : ''}`).test(path);
  });
  rules.sort((a, b) => Buffer.byteLength(b.path.replace(/\*/g, '').replace(/\$$/, '')) - Buffer.byteLength(a.path.replace(/\*/g, '').replace(/\$$/, '')) || Number(b.allow) - Number(a.allow));
  return rules[0]?.allow ?? true;
}
for (const agent of profiles) {
  for (const path of paths) {
    const issues = [];
    if (!allowed(agent, path)) issues.push('robots.txt disallows this URL');
    try {
      const r = await fetch(`${base.origin}${path}`, { headers: { 'User-Agent': agent }, redirect: 'manual', signal: AbortSignal.timeout(20_000) });
      const html = await r.text();
      const markup = pageMarkup(html);
      const contentType = r.headers.get('content-type') || '';
      if (r.status !== 200) issues.push(`HTTP ${r.status}`);
      if (!/\btext\/html\b/i.test(contentType)) issues.push('Response is not HTML');
      const xRobotsTag = r.headers.get('x-robots-tag') || '';
      const relevantMeta = elements(markup, 'meta').filter(meta => meta.name && ['robots', agent.toLowerCase()].includes(meta.name.toLowerCase()));
      const restrictions = [];
      if (restrictive.test(applicableHeader(xRobotsTag, agent))) restrictions.push('Restrictive X-Robots-Tag');
      for (const meta of relevantMeta) {
        if (restrictive.test(meta.content || '')) restrictions.push(`Restrictive ${meta.name} meta`);
      }
      const h1 = plain(markup.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
      if (!h1) issues.push('No server-rendered H1');
      const snippetExcludedMarkup = /<[^>]+\bdata-nosnippet\b[^>]*>/i.test(markup);
      if (snippetExcludedMarkup) restrictions.push('Snippet-excluded markup needs review');
      issues.push(...restrictions);
      const canonicals = elements(markup, 'link').filter(link => link.rel?.toLowerCase().split(/\s+/).includes('canonical')).map(link => link.href);
      if (canonicals.length !== 1 || canonicals[0] !== canonicalFor(path)) issues.push('Expected one absolute production self-canonical');
      const equipment = equipmentEvidence(html, markup, path, issues);
      results.push({ agent, path, status: r.status, contentType, allowed: allowed(agent, path), h1, canonicals, snippetEvidence: { xRobotsTag, meta: relevantMeta, snippetExcludedMarkup, restrictions }, ...(equipment ? { equipment } : {}), issues });
    } catch (error) { results.push({ agent, path, issues: [...issues, error.message] }); }
  }
  if (allowed(agent, '/api/contact')) results.push({ agent, path: '/api/contact', issues: ['Expected private API crawl exclusion is absent'] });
}
const report = { checkedAt: new Date().toISOString(), origin: base.origin, canonicalOrigin, scope: 'Representative HTTP requests with declared user-agent headers. Observed robots, HTML, canonical and snippet directives are technical evidence only; these requests do not authenticate an engine, use its real IPs, prove rendering, index inclusion, AI answer eligibility or citations.', declaredUserAgents: profiles, paths, checks: results.length, failures: results.filter(r => r.issues.length).length, results };
if (output) { await mkdir(dirname(resolve(output)), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify({ origin: report.origin, checks: report.checks, failures: report.failures, scope: report.scope }));
if (report.failures) process.exitCode = 1;
