#!/usr/bin/env node
/** No network or live IDs: exercise real consent/runtime modules with isolated browser ports. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
function load(filename, context = {}, modules = new Map()) {
  const path = resolve(root, filename);
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} }; modules.set(path, module);
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const localRequire = id => id.startsWith('.') ? load(resolve(dirname(path), `${id}.ts`), context, modules) : require(id);
  new Script(`(function(require,module,exports){${code}\n})`, { filename: path }).runInNewContext({ process: { env: {} }, ...context })(localRequire, module, module.exports);
  return module.exports;
}
const lib = load('src/lib/consent-measurement.ts');
const config = lib.resolveMeasurementConfig('true', 'G-TEST12345', 'AW-123456789', 'test_label');
const checks = [];
const check = (name, fn) => { fn(); checks.push(name); };
const plain = value => JSON.parse(JSON.stringify(value));
const harness = (configuration = config) => {
  const commands = [], scripts = [], withdrawals = [];
  let page = 'https://raidispatch.com/equipment/box-truck';
  const runtime = lib.createMeasurement(configuration, { command: (...args) => commands.push(plain(args)), load: id => scripts.push(id), withdraw: (...args) => withdrawals.push(plain(args)), page: () => page });
  return { runtime, commands, scripts, withdrawals, setPage: value => { page = value; } };
};
check('Explicit activation and valid destinations required, including an Ads lead label', () => {
  for (const flag of [undefined, '', 'false', 'TRUE']) assert.equal(lib.resolveMeasurementConfig(flag, 'G-TEST12345', 'AW-123456789', 'test_label').enabled, false);
  for (const id of ['UA-123456-1', 'G-<script>', '', undefined]) assert.equal(lib.resolveMeasurementConfig('true', id).enabled, false);
  assert.equal(lib.resolveMeasurementConfig('true', undefined, 'AW-123456789').enabled, false);
  const h = harness(lib.resolveMeasurementConfig(undefined, 'G-TEST12345'));
  h.runtime.apply({ analytics: true, ads: true }); h.runtime.track('lead_submit', { source: 'contact_page' });
  assert.equal(h.commands.length, 0); assert.equal(h.scripts.length, 0);
});
check('Default denial and reject-all make no provider commands or script requests; early events are not replayed', () => {
  const h = harness(); h.runtime.track('call_click'); h.runtime.apply({ analytics: false, ads: false });
  assert.equal(h.commands.length, 0); assert.equal(h.scripts.length, 0);
  h.runtime.apply({ analytics: true, ads: false });
  assert.ok(!h.commands.some(c => c[1] === 'call_click'));
  assert.deepEqual(h.commands[0], ['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]);
});
check('Analytics-only consent configures only GA4 and never sends an Ads conversion', () => {
  const h = harness(); h.runtime.apply({ analytics: true, ads: false });
  h.runtime.track('lead_submit', { source: 'contact_page', email: 'private@example.com', phone: '+15555555555', message: 'private', amount: 700 });
  assert.deepEqual(h.scripts, ['G-TEST12345']);
  assert.deepEqual(h.commands.filter(c => c[0] === 'config').map(c => c[1]), ['G-TEST12345']);
  const lead = h.commands.find(c => c[1] === 'generate_lead');
  assert.equal(lead[2].source, 'contact_page'); assert.equal(lead[2].send_to, 'G-TEST12345');
  assert.ok(!JSON.stringify(h.commands).includes('private')); assert.ok(!JSON.stringify(h.commands).includes('+15555555555'));
  assert.ok(!h.commands.some(c => c[1] === 'conversion'));
});
check('Advertising-only consent sends accepted leads, never page views or contact-click conversions', () => {
  const h = harness(); h.runtime.apply({ analytics: false, ads: true });
  for (const event of ['call_click', 'sms_click', 'whatsapp_click']) h.runtime.track(event, { location: 'home_hero' });
  assert.equal(h.commands.filter(c => c[0] === 'event').length, 0);
  h.runtime.track('lead_submit', { source: 'quote_modal' });
  assert.deepEqual(h.commands.filter(c => c[0] === 'event').map(c => [c[1], c[2].send_to]), [['conversion', 'AW-123456789/test_label']]);
  assert.ok(h.commands.filter(c => c[0] === 'consent').every(c => c[2].ad_personalization === 'denied'));
});
check('Granular upgrade loads once, page views deduplicate, and contact interactions retain click names', () => {
  const h = harness(); h.runtime.apply({ analytics: true, ads: false }); h.runtime.apply({ analytics: true, ads: true }); h.runtime.pageView();
  assert.equal(h.scripts.length, 1); assert.equal(h.commands.filter(c => c[0] === 'config').length, 2);
  assert.equal(h.commands.filter(c => c[1] === 'page_view').length, 1);
  h.setPage('https://raidispatch.com/pricing'); h.runtime.pageView();
  assert.equal(h.commands.filter(c => c[1] === 'page_view').length, 2);
  for (const event of ['call_click', 'sms_click', 'whatsapp_click']) h.runtime.track(event, { location: 'mobile_bottom_bar', name: 'Do not send' });
  assert.deepEqual(h.commands.filter(c => /_click$/.test(c[1])).map(c => c[1]), ['call_click', 'sms_click', 'whatsapp_click']);
  h.runtime.track('lead_submit', { source: 'someone@example.com' });
  assert.ok(!h.commands.some(c => c[1] === 'generate_lead' || c[1] === 'conversion'));
});
check('Withdrawing either category closes the event gate before reload, including pending-load state', () => {
  const h = harness(); h.runtime.apply({ analytics: true, ads: true }); h.runtime.apply({ analytics: false, ads: true });
  assert.deepEqual(h.withdrawals, [[{ analytics: false, ads: true }, true]]);
  const count = h.commands.length; h.runtime.track('lead_submit', { source: 'contact_page' }); h.runtime.pageView();
  h.runtime.apply({ analytics: true, ads: true }); assert.equal(h.commands.length, count);
  const failClosed = harness(); failClosed.runtime.apply({ analytics: true, ads: false }); failClosed.runtime.apply({ analytics: false, ads: false }, false);
  assert.equal(failClosed.withdrawals[0][1], false);
});
check('Preferences reject malformed/old data and serialize only two choices, version and time', () => {
  for (const raw of ['bad json', '{}', 'null', '{"version":0,"analytics":true,"ads":true,"updatedAt":"2026-10-31"}', '{"version":1,"analytics":"true","ads":true,"updatedAt":"2026-10-31"}']) assert.equal(lib.parseConsentPreference(raw), null);
  const saved = lib.parseConsentPreference(JSON.stringify({ version: 1, analytics: true, ads: false, updatedAt: '2026-10-31T00:00:00Z', email: 'private@example.com' }));
  assert.deepEqual(Object.keys(saved).sort(), ['ads', 'analytics', 'updatedAt', 'version']);
  assert.deepEqual(Object.keys(lib.consentPreference({ analytics: true, ads: false, message: 'private' })).sort(), ['ads', 'analytics', 'updatedAt', 'version']);
});
check('Actual browser adapter stays silent before consent, uses one script, strips query/referrer data and disables GA on withdrawal', () => {
  const scripts = [], cookies = []; let reloads = 0;
  const window = { location: { origin: 'https://raidispatch.com', pathname: '/contact', hostname: 'raidispatch.com', search: '?email=private@example.com', reload: () => { reloads++; } } };
  const document = { get cookie() { return '_ga=abc; _ga_TEST12345=def; _gcl_aw=ghi; session=retain'; }, set cookie(value) { cookies.push(value); }, createElement: () => ({}), getElementById: () => scripts[0] || null, head: { appendChild: script => scripts.push(script) } };
  const track = load('src/lib/track.ts', { window, document, process: { env: { NEXT_PUBLIC_MEASUREMENT_ENABLED: 'true', NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TEST12345' } } });
  track.track('call_click', { location: 'home_hero' }); assert.equal(scripts.length, 0); assert.equal(window.dataLayer, undefined);
  track.getMeasurement().apply({ analytics: true, ads: false });
  assert.equal(scripts.length, 1); assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST12345');
  assert.ok(!JSON.stringify(window.dataLayer).includes('private@example.com'));
  track.getMeasurement().apply({ analytics: false, ads: false });
  assert.equal(window['ga-disable-G-TEST12345'], true); assert.equal(reloads, 1);
  assert.ok(cookies.some(value => value.startsWith('_ga='))); assert.ok(!cookies.some(value => value.startsWith('session=')));
});
console.log(JSON.stringify({ status: 'passed', checks: checks.length, names: checks, limitations: 'Mocked runtime/browser ports; no configured account, real provider network, attribution, consent UI browser or live conversion verification.' }, null, 2));
