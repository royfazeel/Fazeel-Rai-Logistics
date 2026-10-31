#!/usr/bin/env node
/** Notify participating engines of published canonical URLs. Default is a dry run. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const submit = args.includes('--submit');
const outputIndex = args.indexOf('--output');
const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
// --changed-within-days N keeps only sitemap entries whose <lastmod> falls inside the last N days,
// so a deploy hook notifies the engines about revised pages instead of the whole site every time.
const daysIndex = args.indexOf('--changed-within-days');
const changedWithinDays = daysIndex >= 0 ? Number(args[daysIndex + 1]) : null;
if (daysIndex >= 0 && (!Number.isInteger(changedWithinDays) || changedWithinDays < 0)) throw new Error('--changed-within-days must be a non-negative integer.');
const requested = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--submit') continue;
  if (args[i] === '--output' && args[i + 1] && !args[i + 1].startsWith('--')) { i++; continue; }
  if (args[i] === '--changed-within-days' && args[i + 1] && !args[i + 1].startsWith('--')) { i++; continue; }
  if (args[i] === '--url' && args[i + 1]) { requested.push(args[++i]); continue; }
  throw new Error(`Unknown or incomplete argument: ${args[i]}`);
}
const config = JSON.parse(await readFile(resolve(root, 'config/indexnow.json'), 'utf8'));
if (config.host !== 'raidispatch.com' || !/^[a-f0-9]{32}\.txt$/.test(config.keyFile)) throw new Error('Unexpected IndexNow host or key filename.');
const origin = `https://${config.host}`;
const key = (await readFile(resolve(root, 'public', config.keyFile), 'utf8')).trim();
if (`${key}.txt` !== config.keyFile) throw new Error('Key and filename do not match.');
async function get(url) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}
const xml = await get(`${origin}/sitemap.xml`);
// Exclude image:loc entries: only URL entries are notification candidates.
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => ({ loc: match[1].match(/<loc>([^<]+)<\/loc>/)?.[1], lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null }));
const urls = entries.map(entry => entry.loc);
const lastModified = new Map(entries.map(entry => [entry.loc, entry.lastmod]));
if (!urls.length || urls.some(url => !url)) throw new Error('Empty or malformed sitemap.');
const canonical = new Set(urls);
let candidates = requested.length ? requested : urls;
if (changedWithinDays !== null && !requested.length) {
  const cutoff = Date.now() - changedWithinDays * 86_400_000;
  candidates = urls.filter(value => { const stamp = Date.parse(lastModified.get(value) ?? ''); return !Number.isNaN(stamp) && stamp >= cutoff; });
}
const urlList = [...new Set(candidates)];
if (!urlList.length) {
  const empty = { checkedAt: new Date().toISOString(), mode: 'skipped', host: config.host, changedWithinDays, count: 0, urlList: [], result: 'No sitemap entries changed inside the window; nothing was submitted.' };
  if (output) { await mkdir(dirname(resolve(output)), { recursive: true }); await writeFile(output, JSON.stringify(empty, null, 2) + '\n'); }
  console.log(JSON.stringify(empty, null, 2));
  process.exit(0);
}
if (urlList.length > 10_000) throw new Error('IndexNow batch exceeds 10,000 URLs.');
for (const value of urlList) {
  const url = new URL(value);
  if (url.origin !== origin || url.username || url.password || url.search || url.hash || !canonical.has(value)) throw new Error(`Not a published canonical sitemap URL: ${value}`);
}
const keyLocation = `${origin}/${config.keyFile}`;
const report = { checkedAt: new Date().toISOString(), mode: submit ? 'submitted' : 'dry-run', endpoint: 'https://api.indexnow.org/indexnow', host: config.host, changedWithinDays, count: urlList.length, urlList };
if (submit) {
  if ((await get(keyLocation)).trim() !== key) throw new Error('Production ownership file is missing or incorrect.');
  const response = await fetch(report.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: config.host, key, keyLocation, urlList }), redirect: 'error', signal: AbortSignal.timeout(30_000) });
  report.status = response.status;
  report.accepted = [200, 202].includes(response.status);
  report.result = response.status === 200 ? 'Notification received; indexing is not confirmed.' : response.status === 202 ? 'Notification accepted; ownership validation pending. Indexing is not confirmed.' : `Notification failed: ${(await response.text()).slice(0, 500)}`;
  if (!report.accepted) process.exitCode = 1;
} else report.result = 'No notification sent. Review URLs, then use --submit after deployment verification. Use repeated --url arguments for later changed URLs only.';
if (output) { await mkdir(dirname(resolve(output)), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify(report, null, 2));
