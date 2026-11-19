#!/usr/bin/env node
/** No network: exercise the real cookieless analytics module with an isolated provider and browser. */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
/** Load src/lib/track.ts with a stand-in for the analytics package and the given browser globals. */
function loadTrack(context = {}, provider = {}) {
  const path = resolve(root, 'src/lib/track.ts');
  const module = { exports: {} };
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const localRequire = id => { assert.equal(id, '@vercel/analytics', `unexpected import ${id}`); return provider; };
  new Script(`(function(require,module,exports){${code}\n})`, { filename: path }).runInNewContext({ URL, ...context })(localRequire, module, module.exports);
  return module.exports;
}
const plain = value => JSON.parse(JSON.stringify(value));
const harness = () => {
  const sent = [];
  const lib = loadTrack({ window: {} }, { track: (...args) => sent.push(plain(args)) });
  return { lib, sent };
};
const checks = [];
const check = (name, fn) => { fn(); checks.push(name); };

check('Contact clicks and accepted leads reach the provider with only code-owned parameters', () => {
  const h = harness();
  for (const event of ['call_click', 'sms_click', 'whatsapp_click', 'email_click']) h.lib.track(event, { location: 'home_hero', name: 'Do not send' });
  h.lib.track('quote_modal_open', { location: 'pricing_preview_percentage' });
  h.lib.track('lead_submit', { source: 'contact_page', email: 'private@example.com', phone: '+15555555555', message: 'private', amount: 700 });
  assert.deepEqual(h.sent.map(call => call[0]), ['call_click', 'sms_click', 'whatsapp_click', 'email_click', 'quote_modal_open', 'lead_submit']);
  assert.deepEqual(h.sent[0][1], { location: 'home_hero' });
  assert.deepEqual(h.sent.at(-1)[1], { source: 'contact_page' });
  const wire = JSON.stringify(h.sent);
  for (const secret of ['private', '+15555555555', 'Do not send', '700']) assert.ok(!wire.includes(secret), secret);
});
check('Unknown events, free-text placements and leads without an approved form name are dropped', () => {
  const h = harness();
  h.lib.track('purchase', { location: 'home_hero' });
  h.lib.track('lead_submit');
  h.lib.track('lead_submit', { source: 'someone@example.com' });
  assert.equal(h.sent.length, 0);
  h.lib.track('call_click', { location: 'https://example.com/?email=private@example.com' });
  assert.deepEqual(h.sent, [['call_click', {}]]);
});
check('Pages are reported without query strings or fragments; unreadable addresses are not sent', () => {
  const { lib } = harness();
  for (const type of ['pageview', 'event']) {
    assert.deepEqual(plain(lib.sanitizeAnalyticsEvent({ type, url: 'https://raidispatch.com/contact?email=private@example.com&utm_source=x#private' })), { type, url: 'https://raidispatch.com/contact' });
  }
  assert.equal(lib.sanitizeAnalyticsEvent({ type: 'pageview', url: 'https://private:secret@raidispatch.com/pricing?q=1' }).url, 'https://raidispatch.com/pricing');
  assert.equal(lib.sanitizeAnalyticsEvent({ type: 'pageview', url: 'https://raidispatch.com/' }).url, 'https://raidispatch.com/');
  for (const url of ['', 'not a URL', '/relative/path', 'javascript:alert(1)', 'data:text/plain,private', 'file:///private']) assert.equal(lib.sanitizeAnalyticsEvent({ type: 'pageview', url }), null, url);
});
check('Server rendering and a failing provider never throw or send', () => {
  const sent = [];
  const server = loadTrack({}, { track: (...args) => sent.push(args) });
  server.track('call_click', { location: 'home_hero' }); server.clearLegacyGoogleMeasurement();
  assert.equal(sent.length, 0);
  const failing = loadTrack({ window: {} }, { track: () => { throw new Error('provider unavailable'); } });
  assert.doesNotThrow(() => failing.track('lead_submit', { source: 'quote_modal' }));
});
check('Earlier Google Analytics choices and cookies are removed; unrelated cookies and storage stay', () => {
  const cookies = [], removed = [];
  const window = { location: { hostname: 'raidispatch.com' }, localStorage: { removeItem: key => removed.push(key) } };
  const document = { get cookie() { return '_ga=abc; _ga_8LS0S1WC76=def; _gcl_aw=ghi; session=retain; _gat=retain'; }, set cookie(value) { cookies.push(value); } };
  const lib = loadTrack({ window, document }, { track: () => {} });
  lib.clearLegacyGoogleMeasurement();
  assert.deepEqual(removed, ['rai-measurement-consent-v1']);
  for (const name of ['_ga', '_ga_8LS0S1WC76', '_gcl_aw']) {
    const expired = cookies.filter(value => value.startsWith(`${name}=;`));
    assert.ok(expired.length >= 3, name); assert.ok(expired.every(value => value.includes('Max-Age=0')), name);
    assert.ok(expired.some(value => value.includes('domain=.raidispatch.com')), name);
  }
  assert.ok(!cookies.some(value => value.startsWith('session=') || value.startsWith('_gat=')));
  const blocked = loadTrack({ window: { location: { hostname: 'raidispatch.com' }, get localStorage() { throw new Error('blocked'); } }, document: { get cookie() { throw new Error('blocked'); } } }, { track: () => {} });
  assert.doesNotThrow(() => blocked.clearLegacyGoogleMeasurement());
});
check('Source contains no Google tag, consent component, visitor identification or cookie opt-in', () => {
  const files = [];
  const walk = dir => { for (const entry of readdirSync(dir, { withFileTypes: true })) entry.isDirectory() ? walk(join(dir, entry.name)) : /\.(ts|tsx|css)$/.test(entry.name) && files.push(join(dir, entry.name)); };
  walk(resolve(root, 'src'));
  const banned = [/googletagmanager/i, /google-analytics\.com/i, /\bgtag\s*\(/, /\bdataLayer\b/, /ConsentMeasurement/, /NEXT_PUBLIC_(MEASUREMENT_ENABLED|GA_MEASUREMENT_ID|GOOGLE_ADS)/, /['"]enableCookie['"]/, /va\(\s*['"](identify|group)['"]/];
  for (const file of files) { const text = readFileSync(file, 'utf8'); for (const pattern of banned) assert.ok(!pattern.test(text), `${file} matches ${pattern}`); }
  const layout = readFileSync(resolve(root, 'src/app/layout.tsx'), 'utf8');
  assert.equal(layout.match(/<SiteAnalytics \/>/g)?.length, 1);
  const component = readFileSync(resolve(root, 'src/components/SiteAnalytics.tsx'), 'utf8');
  assert.match(component, /from '@vercel\/analytics\/next'/); assert.match(component, /beforeSend=\{sanitizeAnalyticsEvent\}/);
  assert.ok(JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).dependencies['@vercel/analytics']);
});
console.log(JSON.stringify({ status: 'passed', checks: checks.length, names: checks, limitations: 'Stand-in provider and browser objects; no Vercel network, dashboard setting, real page-view delivery or plan-dependent custom-event reporting is verified.' }, null, 2));
