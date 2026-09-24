#!/usr/bin/env node
/**
 * Exercise the production lead route against a local fake Resend service.
 * Run after `npm run build`: node scripts/verify-lead-api.mjs
 * No external server argument is accepted. The harness owns its loopback app,
 * injects reserved .example inboxes, clears webhook delivery, and blocks all
 * non-loopback fetches inside the child process. No real messages are sent.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

if (process.argv.length > 2) throw new Error('This harness accepts no remote URL or credentials. Run it without arguments after a production build.');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await readFile(join(root, '.next', 'BUILD_ID'), 'utf8').catch(() => { throw new Error('No production build found. Run npm run build before the isolated lead API check.'); });
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'rai-lead-check-'));
const fakeToken = 'local-test-only-not-a-real-api-key';
const owner = 'owner@dispatch.example';
const carrier = 'carrier@fleet.example';
const deliveryRecords = [];
const checks = [];
let mode = 'success';
let child;
let childLog = '';
let requestNumber = 0;
let appOrigin;
let sink;

async function listen(server) {
  await new Promise((resolveListen, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolveListen); });
  return server.address().port;
}
async function freePort() {
  const server = createServer(); const port = await listen(server);
  await new Promise(resolveClose => server.close(resolveClose)); return port;
}
function assertLoopback(value) {
  const url = new URL(value);
  assert.equal(url.hostname, '127.0.0.1', 'The test must never POST to an external host.');
  assert.equal(url.protocol, 'http:');
}
async function stopChild() {
  if (!child || child.exitCode !== null) return;
  const active = child;
  const stopped = new Promise(resolveExit => active.once('exit', resolveExit));
  active.kill('SIGTERM');
  const timeout = setTimeout(() => active.kill('SIGKILL'), 4000);
  await stopped;
  clearTimeout(timeout);
  child = undefined;
}
async function startChild(configured) {
  await stopChild();
  const port = await freePort();
  appOrigin = `http://127.0.0.1:${port}`;
  assertLoopback(appOrigin);
  childLog = '';
  child = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
      NODE_OPTIONS: `--require=${join(temporaryDirectory, 'local-fetch-guard.cjs')}`,
      RESEND_API_KEY: configured ? fakeToken : '',
      RESEND_API_URL: `http://127.0.0.1:${sink.address().port}/emails`,
      LEAD_FROM_EMAIL: configured ? 'leads@dispatch.example' : '',
      LEAD_TO_EMAIL: owner,
      LEAD_WEBHOOK_URL: '',
      LEAD_AUTO_REPLY: 'on',
    }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', chunk => { childLog = (childLog + chunk.toString()).slice(-8000); });
  child.stderr.on('data', chunk => { childLog = (childLog + chunk.toString()).slice(-8000); });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Isolated Next server exited with ${child.exitCode}. ${childLog}`);
    try {
      const response = await fetch(`${appOrigin}/api/lead`, { signal: AbortSignal.timeout(1000) });
      if (response.status === 200) return;
    } catch { /* Server is still starting. */ }
    await delay(200);
  }
  throw new Error('Isolated Next server did not become ready within 30 seconds.');
}
async function post(payload, ip) {
  assertLoopback(appOrigin);
  requestNumber++;
  const response = await fetch(`${appOrigin}/api/lead`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip || `192.0.2.${(requestNumber % 240) + 1}` },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  return { status: response.status, body: await response.json() };
}
const lead = overrides => ({ source: 'contact_page', name: 'Local Test Carrier', phone: '2025550148', equipment: 'dry-van', requestCallback: true, pageUrl: 'https://raidispatch.com/contact', ...overrides });
async function check(name, run) {
  try { await run(); checks.push({ name, status: 'pass' }); console.log(`PASS ${name}`); }
  catch (error) { checks.push({ name, status: 'fail', error: error.message }); console.error(`FAIL ${name}: ${error.message}`); }
}

try {
  // Defense in depth: an incorrect endpoint override cannot leak a test lead.
  await writeFile(join(temporaryDirectory, 'local-fetch-guard.cjs'), `
const originalFetch = globalThis.fetch;
globalThis.fetch = function (input, options) {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
    return Promise.reject(new Error('Test network guard blocked a non-loopback fetch'));
  }
  return originalFetch.call(this, input, options);
};
`);
  sink = createServer(async (request, response) => {
    if (request.method !== 'POST' || request.url !== '/emails') { response.writeHead(404).end(); return; }
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    try {
      assert.equal(request.headers.authorization, `Bearer ${fakeToken}`);
      const payload = JSON.parse(Buffer.concat(chunks).toString());
      assert.ok(Array.isArray(payload.to) && payload.to.length === 1);
      assert.match(payload.to[0], /\.example$/);
      deliveryRecords.push(payload);
      const reject = mode === 'fail-all' || (mode === 'fail-auto-reply' && payload.to[0] === carrier);
      response.writeHead(reject ? 503 : 200, { 'content-type': 'application/json' });
      response.end(JSON.stringify(reject ? { error: 'Local simulated provider outage' } : { id: `local-${deliveryRecords.length}` }));
    } catch {
      response.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'Local sink rejected an unsafe test payload' }));
    }
  });
  await listen(sink);
  await startChild(true);

  await check('Configuration check exposes status only', async () => {
    const response = await fetch(`${appOrigin}/api/lead`);
    const text = await response.text(); const body = JSON.parse(text);
    assert.equal(body.ok, true);
    assert.deepEqual(body.configured, { resend: true, webhook: false, autoReply: true });
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.ok(![fakeToken, owner, 'leads@dispatch.example', appOrigin].some(value => text.includes(value)));
  });
  await check('Callback lead reaches owner with normalized phone and equipment label', async () => {
    const before = deliveryRecords.length;
    const result = await post(lead({ equipment: 'hotshot', currentStatus: 'new-authority' }));
    assert.deepEqual(result, { status: 200, body: { ok: true } });
    assert.equal(deliveryRecords.length - before, 1, 'A lead without email should only notify the owner.');
    const notification = deliveryRecords.at(-1);
    assert.deepEqual(notification.to, [owner]);
    assert.equal(notification.from, 'Rai Dispatch <leads@dispatch.example>');
    assert.match(notification.subject, /Hotshot Trucks/);
    assert.match(notification.text, /tel:\+12025550148/);
    assert.match(notification.text, /New authority/);
    assert.match(notification.text, /Callback requested: Yes/);
  });
  await check('Quote form sends owner notification and carrier acknowledgement', async () => {
    const before = deliveryRecords.length;
    const result = await post(lead({ source: 'quote_modal', equipment: 'cargo-van', email: carrier }));
    assert.equal(result.status, 200);
    assert.equal(deliveryRecords.length - before, 2);
    const [notification, acknowledgement] = deliveryRecords.slice(-2);
    assert.deepEqual(notification.to, [owner]);
    assert.equal(notification.reply_to, carrier);
    assert.match(notification.subject, /Cargo & Sprinter Vans/);
    assert.deepEqual(acknowledgement.to, [carrier]);
    assert.equal(acknowledgement.reply_to, owner);
    assert.equal(acknowledgement.headers['Auto-Submitted'], 'auto-replied');
    assert.match(acknowledgement.text, /Rai Dispatch/);
  });
  await check('Form content is escaped in HTML email', async () => {
    const result = await post(lead({ name: 'Test <img src=x onerror=alert(1)>', equipment: 'step-deck', message: '<script>alert(1)</script>\nSecond line' }));
    assert.equal(result.status, 200);
    const notification = deliveryRecords.at(-1);
    assert.match(notification.subject, /Step Decks/);
    assert.ok(!notification.html.includes('<img src=x'));
    assert.ok(!notification.html.includes('<script>'));
    assert.match(notification.html, /&lt;script&gt;/);
    assert.match(notification.html, /<br>Second line/);
  });
  await check('Honeypot accepts silently without delivering', async () => {
    const before = deliveryRecords.length;
    const result = await post(lead({ company: 'automated spam' }));
    assert.deepEqual(result, { status: 200, body: { ok: true } });
    assert.equal(deliveryRecords.length, before);
  });
  const invalidCases = [
    ['Malformed JSON', '{', 400, 'invalid_json'],
    ['Array input', '[]', 400, 'invalid_json'],
    ['Unknown form source', lead({ source: 'untrusted_source' }), 400, 'invalid_source'],
    ['Missing name', lead({ name: '' }), 400, 'missing_name'],
    ['Missing phone', lead({ phone: '' }), 400, 'missing_phone'],
    ['Invalid phone', lead({ phone: '123' }), 400, 'invalid_phone'],
    ['Invalid email', lead({ email: 'not-an-email' }), 400, 'invalid_email'],
    ['Oversized request', lead({ message: 'x'.repeat(17_000) }), 413, 'payload_too_large'],
  ];
  for (const [name, payload, status, code] of invalidCases) await check(`${name} does not deliver`, async () => {
    const before = deliveryRecords.length;
    const result = await post(payload);
    assert.equal(result.status, status);
    assert.equal(result.body.ok, false);
    assert.equal(result.body.code, code);
    assert.equal(deliveryRecords.length, before);
  });
  await check('Repeated submissions stop at the rate limit', async () => {
    const before = deliveryRecords.length;
    for (let index = 0; index < 5; index++) assert.equal((await post(lead({ source: 'exit_intent_popup' }), '198.51.100.25')).status, 200);
    const blocked = await post(lead(), '198.51.100.25');
    assert.equal(blocked.status, 429);
    assert.equal(blocked.body.code, 'rate_limited');
    assert.equal(deliveryRecords.length - before, 5);
  });
  await check('Provider outage reports failure instead of false success', async () => {
    mode = 'fail-all';
    try {
      const before = deliveryRecords.length;
      const result = await post(lead({ email: carrier }));
      assert.equal(result.status, 502);
      assert.equal(result.body.code, 'delivery_failed');
      assert.equal(deliveryRecords.length - before, 1, 'No acknowledgement should be sent for an undelivered lead.');
    } finally { mode = 'success'; }
  });
  await check('Acknowledgement failure does not lose a delivered owner lead', async () => {
    mode = 'fail-auto-reply';
    try {
      const before = deliveryRecords.length;
      const result = await post(lead({ email: carrier }));
      assert.deepEqual(result, { status: 200, body: { ok: true } });
      assert.equal(deliveryRecords.length - before, 2);
      assert.deepEqual(deliveryRecords.at(-2).to, [owner]);
    } finally { mode = 'success'; }
  });
  await startChild(false);
  await check('Unconfigured delivery is visible and rejects a lead honestly', async () => {
    const configuration = await (await fetch(`${appOrigin}/api/lead`)).json();
    assert.equal(configuration.ok, false);
    assert.deepEqual(configuration.configured, { resend: false, webhook: false, autoReply: false });
    const before = deliveryRecords.length;
    const result = await post(lead());
    assert.equal(result.status, 503);
    assert.equal(result.body.code, 'not_configured');
    assert.equal(deliveryRecords.length, before);
  });
} catch (error) {
  checks.push({ name: 'Harness setup/execution', status: 'fail', error: error.message });
  console.error(`FAIL harness: ${error.message}`);
} finally {
  await stopChild();
  if (sink?.listening) await new Promise(resolveClose => sink.close(resolveClose));
  await rm(temporaryDirectory, { recursive: true, force: true });
}
const failures = checks.filter(check => check.status === 'fail');
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${checks.length - failures.length}/${checks.length} lead API checks; ${deliveryRecords.length} requests captured by the local sink; zero external email destinations.`);
process.exitCode = failures.length ? 1 : 0;
