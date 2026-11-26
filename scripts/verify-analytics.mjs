#!/usr/bin/env node
/** No network: exercise the real measurement modules with isolated providers and browser objects. */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
/** Load a source module with stand-ins for its imports and the given browser globals. */
function load(file, context = {}, modules = {}) {
  const path = resolve(root, file);
  const module = { exports: {} };
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const localRequire = id => { assert.ok(Object.hasOwn(modules, id), `unexpected import ${id}`); return modules[id]; };
  new Script(`(function(require,module,exports){${code}\n})`, { filename: path }).runInNewContext({ URL, ...context })(localRequire, module, module.exports);
  return module.exports;
}
const loadTrack = (context = {}, provider = {}, ads = { reportAdsConversion: () => false }) => load('src/lib/track.ts', context, { '@vercel/analytics': provider, './google-ads': ads });
const loadAds = (context = {}) => load('src/lib/google-ads.ts', context);
const plain = value => JSON.parse(JSON.stringify(value));
const harness = () => {
  const sent = [], conversions = [];
  const lib = loadTrack({ window: {} }, { track: (...args) => sent.push(plain(args)) }, { reportAdsConversion: (...args) => { conversions.push(plain(args)); return true; } });
  return { lib, sent, conversions };
};
// Sample values in Google's documented shapes; not a real account.
const SAMPLE = { tagId: 'AW-1234567890', conversionLabels: { lead_submit: 'AbC-D_efGhIjKlMn', call_click: 'ZyXwVuTsRq_12-34', sms_click: '', whatsapp_click: '', email_click: '' }, remarketing: false };
const checks = [];
const check = (name, fn) => { fn(); checks.push(name); };

check('Contact clicks and accepted leads reach both providers; Vercel gets only code-owned parameters and Google Ads only the action', () => {
  const h = harness();
  for (const event of ['call_click', 'sms_click', 'whatsapp_click', 'email_click']) h.lib.track(event, { location: 'home_hero', name: 'Do not send' });
  h.lib.track('quote_modal_open', { location: 'pricing_preview_percentage' });
  h.lib.track('lead_submit', { source: 'contact_page', email: 'private@example.com', phone: '+15555555555', message: 'private', amount: 700 });
  const names = ['call_click', 'sms_click', 'whatsapp_click', 'email_click', 'quote_modal_open', 'lead_submit'];
  assert.deepEqual(h.sent.map(call => call[0]), names);
  assert.deepEqual(h.sent[0][1], { location: 'home_hero' });
  assert.deepEqual(h.sent.at(-1)[1], { source: 'contact_page' });
  // The Google Ads reporter is handed the event name and nothing else.
  assert.deepEqual(h.conversions, names.map(name => [name]));
  const wire = JSON.stringify([h.sent, h.conversions]);
  for (const secret of ['private', '+15555555555', 'Do not send', '700']) assert.ok(!wire.includes(secret), secret);
});
check('Unknown events, free-text placements and leads without an approved form name are dropped', () => {
  const h = harness();
  h.lib.track('purchase', { location: 'home_hero' });
  h.lib.track('lead_submit');
  h.lib.track('lead_submit', { source: 'someone@example.com' });
  assert.equal(h.sent.length, 0); assert.equal(h.conversions.length, 0);
  h.lib.track('call_click', { location: 'https://example.com/?email=private@example.com' });
  assert.deepEqual(h.sent, [['call_click', {}]]); assert.deepEqual(h.conversions, [['call_click']]);
});
check('Pages are reported to Vercel without query strings or fragments; unreadable addresses are not sent', () => {
  const { lib } = harness();
  for (const type of ['pageview', 'event']) {
    assert.deepEqual(plain(lib.sanitizeAnalyticsEvent({ type, url: 'https://raidispatch.com/contact?email=private@example.com&utm_source=x#private' })), { type, url: 'https://raidispatch.com/contact' });
  }
  assert.equal(lib.sanitizeAnalyticsEvent({ type: 'pageview', url: 'https://private:secret@raidispatch.com/pricing?q=1' }).url, 'https://raidispatch.com/pricing');
  assert.equal(lib.sanitizeAnalyticsEvent({ type: 'pageview', url: 'https://raidispatch.com/' }).url, 'https://raidispatch.com/');
  for (const url of ['', 'not a URL', '/relative/path', 'javascript:alert(1)', 'data:text/plain,private', 'file:///private']) assert.equal(lib.sanitizeAnalyticsEvent({ type: 'pageview', url }), null, url);
});
check('Server rendering never sends; one failing provider never throws or stops the other', () => {
  const sent = [], conversions = [];
  const server = loadTrack({}, { track: (...args) => sent.push(args) }, { reportAdsConversion: (...args) => conversions.push(args) });
  server.track('call_click', { location: 'home_hero' }); server.clearLegacyGoogleMeasurement();
  assert.equal(sent.length, 0); assert.equal(conversions.length, 0);
  const failing = loadTrack({ window: {} }, { track: () => { throw new Error('provider unavailable'); } }, { reportAdsConversion: (...args) => conversions.push(args) });
  assert.doesNotThrow(() => failing.track('lead_submit', { source: 'quote_modal' }));
  assert.deepEqual(plain(conversions), [['lead_submit']]);
});
check('Earlier Google Analytics choices and cookies are removed; Google Ads click cookies, unrelated cookies and storage stay', () => {
  const cookies = [], removed = [];
  const window = { location: { hostname: 'raidispatch.com' }, localStorage: { removeItem: key => removed.push(key) } };
  const document = { get cookie() { return '_ga=abc; _ga_8LS0S1WC76=def; _gcl_aw=GCL.1.click; _gcl_au=1.1.2; _gcl_gs=2.1.k1; session=retain; _gat=retain'; }, set cookie(value) { cookies.push(value); } };
  const lib = loadTrack({ window, document }, { track: () => {} });
  lib.clearLegacyGoogleMeasurement();
  assert.deepEqual(removed, ['rai-measurement-consent-v1']);
  for (const name of ['_ga', '_ga_8LS0S1WC76']) {
    const expired = cookies.filter(value => value.startsWith(`${name}=;`));
    assert.ok(expired.length >= 3, name); assert.ok(expired.every(value => value.includes('Max-Age=0')), name);
    assert.ok(expired.some(value => value.includes('domain=.raidispatch.com')), name);
  }
  // Deleting _gcl_* would discard the ad-click identifier and make conversions unattributable.
  assert.ok(!cookies.some(value => /^(_gcl_|session=|_gat=)/.test(value)), cookies.join(' | '));
  const blocked = loadTrack({ window: { location: { hostname: 'raidispatch.com' }, get localStorage() { throw new Error('blocked'); } }, document: { get cookie() { throw new Error('blocked'); } } }, { track: () => {} });
  assert.doesNotThrow(() => blocked.clearLegacyGoogleMeasurement());
});
check('Google Ads settings: only well-formed tag IDs and labels are used; an unset or mistyped tag ID loads nothing and reports nothing', () => {
  const ads = loadAds({ window: {} });
  const config = ads.resolveGoogleAds(SAMPLE);
  assert.deepEqual(plain(config), { tagId: 'AW-1234567890', sendTo: { lead_submit: 'AW-1234567890/AbC-D_efGhIjKlMn', call_click: 'AW-1234567890/ZyXwVuTsRq_12-34' }, remarketing: false });
  assert.equal(ads.googleTagSrc(config), 'https://www.googletagmanager.com/gtag/js?id=AW-1234567890');
  for (const tagId of ['', 'G-8LS0S1WC76', 'GTM-ABC1234', 'AW-12', 'AW-1234567890/AbC', "AW-1234567890');alert(1)//", ' AW-1234567890']) {
    const off = ads.resolveGoogleAds({ ...SAMPLE, tagId });
    assert.deepEqual(plain(off), { tagId: null, sendTo: {}, remarketing: false }, tagId);
    assert.equal(ads.googleTagSrc(off), null, tagId); assert.equal(ads.googleTagBootstrap(off), null, tagId);
    const window = {};
    assert.equal(loadAds({ window }).reportAdsConversion('lead_submit', off), false, tagId); assert.equal(window.dataLayer, undefined, tagId);
  }
  const labels = ads.resolveGoogleAds({ ...SAMPLE, conversionLabels: { lead_submit: 'AW-1234567890/AbC-D_efGhIjKlMn', call_click: "x'});alert(1)//", sms_click: 'abc', whatsapp_click: ' ', email_click: 'Valid_Label-1' } });
  assert.deepEqual(plain(labels.sendTo), { email_click: 'AW-1234567890/Valid_Label-1' });
});
check('A conversion is queued for Google with the conversion action only, including before the library has loaded', () => {
  const window = {};
  const ads = loadAds({ window });
  const config = ads.resolveGoogleAds(SAMPLE);
  assert.equal(ads.reportAdsConversion('lead_submit', config), true);
  assert.equal(ads.reportAdsConversion('call_click', config), true);
  // Not conversions: actions without a label, interest events and unknown or inherited names.
  for (const event of ['sms_click', 'quote_modal_open', 'purchase', 'constructor', '__proto__', 'toString', '']) assert.equal(ads.reportAdsConversion(event, config), false, event);
  assert.equal(window.dataLayer.length, 2);
  // Google's library ignores plain arrays; commands must be `arguments` objects.
  for (const entry of window.dataLayer) assert.equal(Object.prototype.toString.call(entry), '[object Arguments]');
  assert.deepEqual(Array.from(window.dataLayer, entry => plain(Array.from(entry))), [
    ['event', 'conversion', { send_to: 'AW-1234567890/AbC-D_efGhIjKlMn' }],
    ['event', 'conversion', { send_to: 'AW-1234567890/ZyXwVuTsRq_12-34' }],
  ]);
  // An existing queue is appended to, never replaced.
  const existing = { dataLayer: ['earlier'] };
  loadAds({ window: existing }).reportAdsConversion('lead_submit', config);
  assert.equal(existing.dataLayer.length, 2); assert.equal(existing.dataLayer[0], 'earlier');
  assert.equal(loadAds({}).reportAdsConversion('lead_submit', config), false, 'server rendering');
  const frozen = { dataLayer: Object.freeze([]) };
  assert.doesNotThrow(() => assert.equal(loadAds({ window: frozen }).reportAdsConversion('lead_submit', config), false));
});
check('The Google tag starts with no consent command, so no consent state can hold conversions back; ad personalization is off unless remarketing is enabled', () => {
  const ads = loadAds({ window: {} });
  const run = code => { const window = {}; new Script(code).runInNewContext({ window, get dataLayer() { return window.dataLayer; }, Date }); return Array.from(window.dataLayer, entry => Array.from(entry)); };
  const bootstrap = ads.googleTagBootstrap(ads.resolveGoogleAds(SAMPLE));
  assert.ok(!/consent/i.test(bootstrap), 'consent command present');
  const commands = run(bootstrap);
  assert.deepEqual(commands.map(command => command[0]), ['js', 'config']);
  assert.ok(commands[0][1] instanceof Date || Object.prototype.toString.call(commands[0][1]) === '[object Date]');
  assert.deepEqual(plain(commands[1]), ['config', 'AW-1234567890', { allow_ad_personalization_signals: false }]);
  const remarketing = run(ads.googleTagBootstrap(ads.resolveGoogleAds({ ...SAMPLE, remarketing: true })));
  assert.deepEqual(plain(remarketing[1]), ['config', 'AW-1234567890']);
});
let committed;
check('Committed Google Ads settings are either empty or complete: no mistyped tag ID or label, and a lead conversion whenever the tag is on', () => {
  const ads = loadAds({ window: {} });
  const { tagId, conversionLabels, remarketing } = ads.GOOGLE_ADS;
  const config = ads.GOOGLE_ADS_CONFIG;
  assert.deepEqual(Object.keys(conversionLabels).sort(), ['call_click', 'email_click', 'lead_submit', 'sms_click', 'whatsapp_click']);
  assert.equal(typeof remarketing, 'boolean');
  if (tagId === '') assert.ok(Object.values(conversionLabels).every(label => label === ''), 'A conversion label is set without a tag ID.');
  else {
    assert.equal(config.tagId, tagId, `Tag ID ${JSON.stringify(tagId)} is not in the form AW-1234567890.`);
    for (const [event, label] of Object.entries(conversionLabels)) if (label !== '') assert.equal(config.sendTo[event], `${tagId}/${label}`, `Label for ${event} is not well formed.`);
    assert.ok(config.sendTo.lead_submit, 'The tag is on but the lead conversion label is empty.');
  }
  committed = { tagLoaded: Boolean(config.tagId), conversions: Object.keys(config.sendTo), remarketing: config.remarketing };
});
check('Source has one Google Ads tag and no Google Analytics, consent prompt, consent command, old measurement variables, visitor identification or cookie opt-in', () => {
  const files = [];
  const walk = dir => { for (const entry of readdirSync(dir, { withFileTypes: true })) entry.isDirectory() ? walk(join(dir, entry.name)) : /\.(ts|tsx|css)$/.test(entry.name) && files.push(join(dir, entry.name)); };
  walk(resolve(root, 'src'));
  const banned = [/google-analytics\.com/i, /\bG-[A-Z0-9]{8,12}\b/, /gtag\(\s*['"]consent['"]/, /consent_mode|wait_for_update/i, /ConsentMeasurement/, /NEXT_PUBLIC_(MEASUREMENT_ENABLED|GA_MEASUREMENT_ID|GOOGLE_ADS)/, /['"]enableCookie['"]/, /va\(\s*['"](identify|group)['"]/];
  for (const file of files) { const text = readFileSync(file, 'utf8'); for (const pattern of banned) assert.ok(!pattern.test(text), `${file} matches ${pattern}`); }
  // Google's library address and command queue live in one module; the click-cookie cleanup must not return.
  const name = file => relative(root, file).split('\\').join('/');
  assert.deepEqual(files.filter(file => /googletagmanager/i.test(readFileSync(file, 'utf8'))).map(name), ['src/lib/google-ads.ts']);
  assert.deepEqual(files.filter(file => /\bdataLayer\b/.test(readFileSync(file, 'utf8'))).map(name), ['src/lib/google-ads.ts']);
  assert.ok(!/_gcl_\//.test(readFileSync(resolve(root, 'src/lib/track.ts'), 'utf8')), 'track.ts filters _gcl_ cookies');
  const layout = readFileSync(resolve(root, 'src/app/layout.tsx'), 'utf8');
  assert.equal(layout.match(/<SiteAnalytics \/>/g)?.length, 1); assert.equal(layout.match(/<GoogleAdsTag \/>/g)?.length, 1);
  const component = readFileSync(resolve(root, 'src/components/SiteAnalytics.tsx'), 'utf8');
  assert.match(component, /from '@vercel\/analytics\/next'/); assert.match(component, /beforeSend=\{sanitizeAnalyticsEvent\}/);
  // The tag must start promptly: at idle time a visitor may already have left the landing address that carries the ad click.
  const tag = readFileSync(resolve(root, 'src/components/GoogleAdsTag.tsx'), 'utf8');
  assert.equal(tag.match(/strategy="afterInteractive"/g)?.length, 2); assert.ok(!/lazyOnload|worker/.test(tag));
  assert.ok(JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).dependencies['@vercel/analytics']);
});
console.log(JSON.stringify({ status: 'passed', checks: checks.length, names: checks, googleAds: committed, limitations: 'Stand-in providers and browser objects; no Vercel or Google network, dashboard or account setting, real page-view or conversion delivery, or plan-dependent custom-event reporting is verified.' }, null, 2));
