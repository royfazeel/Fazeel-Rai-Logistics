#!/usr/bin/env node
/** No network: exercise the real measurement module (Vercel Web Analytics and Google Ads conversions) with an isolated provider and browser. */
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
check('Google Ads conversions name only the conversion action and never wait for a consent choice', () => {
  const ads = [];
  const lib = loadTrack({ window: { gtag: (...args) => ads.push(plain(args)) } }, { track: () => {} });
  lib.track('lead_submit', { source: 'quote_modal', email: 'private@example.com', phone: '+15555555555', message: 'private' });
  for (const event of ['call_click', 'sms_click', 'whatsapp_click', 'email_click']) lib.track(event, { location: 'home_hero', name: 'Do not send' });
  const lead = 'AW-18340605512/-hqfCOHe7OccEMjcvalE', contact = 'AW-18340605512/8Ia-CN_v6-ccEMjcvalE';
  assert.deepEqual(ads, [lead, contact, contact, contact, contact].map(send_to => ['event', 'conversion', { send_to }]));
  assert.equal(lib.GOOGLE_ADS_ID, 'AW-18340605512');
  ads.length = 0;
  lib.track('quote_modal_open', { location: 'pricing_preview' }); lib.track('purchase'); lib.track('lead_submit'); lib.track('lead_submit', { source: 'someone@example.com' });
  assert.equal(ads.length, 0, 'only accepted leads and contact clicks are conversions');
  const sent = [];
  const noTag = loadTrack({ window: {} }, { track: (...args) => sent.push(args) });
  assert.doesNotThrow(() => noTag.track('call_click', { location: 'home_hero' })); assert.equal(sent.length, 1, 'a blocked or unloaded Google tag does not stop Vercel events');
  const failing = loadTrack({ window: { gtag: () => { throw new Error('tag unavailable'); } } }, { track: () => {} });
  assert.doesNotThrow(() => failing.track('lead_submit', { source: 'contact_page' }));
  const tag = readFileSync(resolve(root, 'src/components/GoogleAdsTag.tsx'), 'utf8');
  assert.match(tag, /gtag\('consent', 'default', \{ ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' \}\)/);
  assert.ok(!/['"]denied['"]/.test(tag), 'no consent type may default to denied');
  assert.ok(tag.indexOf("gtag('consent', 'default'") < tag.indexOf("gtag('config'") && tag.indexOf("gtag('config'") < tag.indexOf('googletagmanager.com/gtag/js'), 'consent defaults come before the tag is configured and requested');
  assert.match(tag, /import \{ GOOGLE_ADS_ID \} from '@\/lib\/track'/);
});
check('Earlier Google Analytics choices and cookies are removed; Google Ads click cookies, unrelated cookies and storage stay', () => {
  const cookies = [], removed = [];
  const window = { location: { hostname: 'raidispatch.com' }, localStorage: { removeItem: key => removed.push(key) } };
  const document = { get cookie() { return '_ga=abc; _ga_8LS0S1WC76=def; _gcl_aw=ghi; session=retain; _gat=retain'; }, set cookie(value) { cookies.push(value); } };
  const lib = loadTrack({ window, document }, { track: () => {} });
  lib.clearLegacyGoogleMeasurement();
  assert.deepEqual(removed, ['rai-measurement-consent-v1']);
  for (const name of ['_ga', '_ga_8LS0S1WC76']) {
    const expired = cookies.filter(value => value.startsWith(`${name}=;`));
    assert.ok(expired.length >= 3, name); assert.ok(expired.every(value => value.includes('Max-Age=0')), name);
    assert.ok(expired.some(value => value.includes('domain=.raidispatch.com')), name);
  }
  assert.ok(!cookies.some(value => value.startsWith('session=') || value.startsWith('_gat=') || value.startsWith('_gcl_')), 'the Google Ads click identifier must survive');
  const blocked = loadTrack({ window: { location: { hostname: 'raidispatch.com' }, get localStorage() { throw new Error('blocked'); } }, document: { get cookie() { throw new Error('blocked'); } } }, { track: () => {} });
  assert.doesNotThrow(() => blocked.clearLegacyGoogleMeasurement());
});
check('Source contains no Google Analytics, consent component, visitor identification or cookie opt-in; the Google tag lives in two files and is mounted once', () => {
  const files = [];
  const walk = dir => { for (const entry of readdirSync(dir, { withFileTypes: true })) entry.isDirectory() ? walk(join(dir, entry.name)) : /\.(ts|tsx|css)$/.test(entry.name) && files.push(join(dir, entry.name)); };
  walk(resolve(root, 'src'));
  const banned = [/google-analytics\.com/i, /\bG-[A-Z0-9]{6,}\b/, /googletagmanager\.com\/gtm/i, /ConsentMeasurement/, /NEXT_PUBLIC_(MEASUREMENT_ENABLED|GA_MEASUREMENT_ID|GOOGLE_ADS)/, /['"]enableCookie['"]/, /va\(\s*['"](identify|group)['"]/];
  // The Google tag may only be loaded by the one component and called by the one measurement module.
  const googleTag = [/googletagmanager/i, /\bgtag\s*\??\.?\s*\(/, /\bdataLayer\b/];
  const tagFiles = new Set([resolve(root, 'src/components/GoogleAdsTag.tsx'), resolve(root, 'src/lib/track.ts')]);
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const pattern of banned) assert.ok(!pattern.test(text), `${file} matches ${pattern}`);
    if (!tagFiles.has(file)) for (const pattern of googleTag) assert.ok(!pattern.test(text), `${file} matches ${pattern}`);
  }
  const layout = readFileSync(resolve(root, 'src/app/layout.tsx'), 'utf8');
  assert.equal(layout.match(/<SiteAnalytics \/>/g)?.length, 1);
  assert.equal(layout.match(/<GoogleAdsTag \/>/g)?.length, 1);
  const component = readFileSync(resolve(root, 'src/components/SiteAnalytics.tsx'), 'utf8');
  assert.match(component, /from '@vercel\/analytics\/next'/); assert.match(component, /beforeSend=\{sanitizeAnalyticsEvent\}/);
  assert.ok(JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).dependencies['@vercel/analytics']);
});
console.log(JSON.stringify({ status: 'passed', checks: checks.length, names: checks, limitations: 'Stand-in provider and browser objects; no Vercel or Google network, dashboard or Google Ads account setting, real page-view or conversion delivery, or plan-dependent custom-event reporting is verified.' }, null, 2));
