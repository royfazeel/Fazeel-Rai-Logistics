#!/usr/bin/env node
/** Representative HTTP checks with declared crawler headers, not authenticated bot traffic. */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const origin = process.argv[2] || 'https://raidispatch.com';
const output = process.argv[3];
const base = new URL(origin);
if (!['http:', 'https:'].includes(base.protocol) || base.pathname !== '/' || base.search || base.hash || base.username || base.password) throw new Error('Provide a plain HTTP(S) origin.');
const profiles = ['Googlebot', 'bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot'];
const paths = ['/', '/resources/trucking-dispatch-glossary', '/tools/load-profit-calculator'];
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
  const rules = selected.flatMap(g => g.rules).filter(rule => rule.path && new RegExp(`^${rule.path.split('*').map(part => part.replace(/[.+?^{}()|[\]\\]/g, '\\$&')).join('.*').replace(/\$$/, '$')}`).test(path));
  rules.sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
  return rules[0]?.allow ?? true;
}
for (const agent of profiles) {
  for (const path of paths) {
    const issues = [];
    if (!allowed(agent, path)) issues.push('robots.txt disallows this URL');
    try {
      const r = await fetch(`${base.origin}${path}`, { headers: { 'User-Agent': agent }, redirect: 'manual', signal: AbortSignal.timeout(20_000) });
      const html = await r.text();
      if (r.status !== 200) issues.push(`HTTP ${r.status}`);
      if (/\b(noindex|nosnippet|none)\b|max-snippet\s*:\s*0\b/i.test(r.headers.get('x-robots-tag') || '')) issues.push('Restrictive X-Robots-Tag');
      for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
        const name = tag.match(/name=["']([^"']+)["']/i)?.[1];
        const content = tag.match(/content=["']([^"']+)["']/i)?.[1] || '';
        if (name && ['robots', agent.toLowerCase()].includes(name.toLowerCase()) && /\b(noindex|nosnippet|none)\b|max-snippet\s*:\s*0\b/i.test(content)) issues.push('Restrictive robots meta');
      }
      if (!/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html)) issues.push('No server-rendered H1');
      if (/data-nosnippet/i.test(html)) issues.push('Snippet-excluded content needs review');
      results.push({ agent, path, status: r.status, allowed: allowed(agent, path), issues });
    } catch (error) { results.push({ agent, path, issues: [...issues, error.message] }); }
  }
  if (allowed(agent, '/api/contact')) results.push({ agent, path: '/api/contact', issues: ['Expected private API crawl exclusion is absent'] });
}
const report = { checkedAt: new Date().toISOString(), origin: base.origin, scope: 'Representative declared-user-agent requests. This does not prove access from the engines’ real IPs, index inclusion or citations.', checks: results.length, failures: results.filter(r => r.issues.length).length, results };
if (output) { await mkdir(dirname(resolve(output)), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify({ origin: report.origin, checks: report.checks, failures: report.failures, scope: report.scope }));
if (report.failures) process.exitCode = 1;
