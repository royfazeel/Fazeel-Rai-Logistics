#!/usr/bin/env node
/** Check actual equipment CTAs and contact form prefill without network or leads. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const expectedEquipment = ['box-truck', 'dry-van', 'reefer', 'flatbed', 'power-only', 'step-deck', 'hotshot', 'cargo-van', 'conestoga', 'sprinter-van', 'rgn-lowboy', 'car-hauler', 'tanker', 'dump-truck', 'curtain-side'];
const outputIndex = process.argv.indexOf('--json');
const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : undefined;
let states = [], refs = [], effects = [], stateIndex = 0, refIndex = 0;
const controlledReact = {
  ...React,
  useState(initial) {
    const slot = stateIndex++;
    if (!(slot in states)) states[slot] = typeof initial === 'function' ? initial() : initial;
    return [states[slot], update => { states[slot] = typeof update === 'function' ? update(states[slot]) : update; }];
  },
  useRef(initial) { const slot = refIndex++; return refs[slot] ??= { current: initial }; },
  useEffect(callback) { effects.push(callback); },
};
const modules = new Map();
const stubs = {
  'next/link': ({ children, ...props }) => React.createElement('a', props, children),
  '@/components/ScrollReveal': ({ children }) => children,
  '@/components/StaticPhoto': () => null,
  '@/components/EquipmentPhoto': () => null,
  '@/lib/track': { track: () => {} },
};
function loadSource(filename) {
  let path = resolve(root, filename);
  if (!existsSync(path)) path = ['.ts', '.tsx'].map(ext => path + ext).find(existsSync);
  assert.ok(path, `Unresolved local source: ${filename}`);
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} }; modules.set(path, module);
  const source = readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const localRequire = specifier => {
    if (specifier === 'react') return controlledReact;
    if (specifier in stubs) return stubs[specifier];
    if (specifier.startsWith('@/')) return loadSource(`src/${specifier.slice(2)}`);
    if (specifier.startsWith('.')) return loadSource(resolve(dirname(path), specifier));
    return require(specifier);
  };
  new Script(`(function(require,module,exports){${code}\n})`, { filename: path }).runInThisContext()(localRequire, module, module.exports);
  return module.exports;
}
const ContentDetail = loadSource('src/components/content/ContentDetail.tsx').default;
const Contact = loadSource('src/app/contact/ContactPageClient.tsx').default;
const { EQUIPMENT_CONTENT, SERVICE_CONTENT } = loadSource('src/lib/dispatch-content.ts');
const { validateEquipmentSelection } = loadSource('src/lib/formValidation.ts');
function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined;
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean);
  return predicate(node) ? node : find(node.props?.children, predicate);
}
function renderContact() { stateIndex = 0; refIndex = 0; effects = []; return Contact(); }
function mount(search, hydrate = true, beforeEffects) {
  states = []; refs = [];
  globalThis.window = { location: { search } };
  const tree = renderContact();
  assert.equal(find(tree, node => node.props?.id === 'contact-equipment').props.value, '', 'Server and initial client state remain blank and hydration-safe.');
  if (hydrate) { beforeEffects?.(tree); effects.forEach(effect => effect()); return renderContact(); }
  return tree;
}
const cases = [];
async function check(name, run) {
  try { await run(); cases.push({ name, pass: true }); }
  catch (error) { cases.push({ name, pass: false, error: error.message }); }
}
let networkCalls = 0;
const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
globalThis.fetch = async () => { networkCalls++; throw new Error('No network permitted in this component check.'); };
let focused;
globalThis.document = { getElementById: id => ({ focus() { focused = id; } }) };
try {
  for (const slug of expectedEquipment) {
    await check(`${slug}: rendered equipment CTAs retain the category and target the existing form`, () => {
      const content = EQUIPMENT_CONTENT.find(item => item.slug === slug); assert.ok(content);
      const html = renderToStaticMarkup(React.createElement(ContentDetail, { content, category: 'equipment' }));
      const contactLinks = [...html.matchAll(/<a\b[^>]*href="([^\"]+)"/g)].map(match => match[1]).filter(href => href.startsWith('/contact'));
      assert.ok(contactLinks.length >= 3, 'Expected hero, sidebar and final CTA.');
      assert.ok(contactLinks.every(href => href === `/contact?equipment=${slug}#contact-form`));
    });
    await check(`${slug}: query prefills a valid editable contact equipment option`, () => {
      const tree = mount(`?utm_source=test&equipment=${slug}`);
      const select = find(tree, node => node.props?.id === 'contact-equipment');
      assert.equal(select.props.value, slug);
      assert.equal(validateEquipmentSelection(select.props.value), null);
      assert.ok(find(select, node => node.type === 'option' && node.props.value === slug));
      select.props.onChange({ target: { value: 'other' } });
      assert.equal(find(renderContact(), node => node.props?.id === 'contact-equipment').props.value, 'other');
    });
  }
  await check('Service CTAs retain the generic contact destination', () => {
    const html = renderToStaticMarkup(React.createElement(ContentDetail, { content: SERVICE_CONTENT[0], category: 'services' }));
    const contactLinks = [...html.matchAll(/<a\b[^>]*href="([^\"]+)"/g)].map(match => match[1]).filter(href => href.startsWith('/contact'));
    assert.ok(contactLinks.length >= 3 && contactLinks.every(href => href === '/contact'));
  });
  for (const search of ['', '?equipment=', '?equipment=other', '?equipment=BOX-TRUCK', '?equipment=unknown', '?equipment=__proto__', '?equipment=constructor', '?equipment=box-truck&equipment=cargo-van', '?equipment=box-truck&equipment=box-truck', '?equipment=%3Cscript%3E']) {
    await check(`${search || '(no query)'}: unknown or ambiguous input does not prefill`, () => {
      const tree = mount(search);
      const select = find(tree, node => node.props?.id === 'contact-equipment');
      assert.equal(select.props.value, '');
      assert.notEqual(validateEquipmentSelection(select.props.value), null);
    });
  }
  await check('A visitor selection made before the effect is preserved', () => {
    const tree = mount('?equipment=box-truck', true, initial => find(initial, node => node.props?.id === 'contact-equipment').props.onChange({ target: { value: 'reefer' } }));
    assert.equal(find(tree, node => node.props?.id === 'contact-equipment').props.value, 'reefer');
  });
  await check('The unchanged form anchor exists in server-rendered contact content', () => {
    const tree = mount('?equipment=box-truck', false);
    assert.ok(find(tree, node => node.props?.id === 'contact-form'));
  });
  await check('Prefill does not bypass missing name/phone validation or submit a lead', async () => {
    focused = undefined;
    const tree = mount('?equipment=box-truck');
    await find(tree, node => node.type === 'form').props.onSubmit({ preventDefault() {} });
    assert.equal(focused, 'contact-name');
    assert.equal(networkCalls, 0);
    assert.equal(states[0].equipment, 'box-truck');
  });
  await check('Removing the prefilled equipment still triggers required selection validation', async () => {
    let tree = mount('?equipment=box-truck');
    for (const [id, value] of [['contact-name', 'Test Carrier'], ['contact-phone', '2025550148'], ['contact-equipment', '']]) {
      find(tree, node => node.props?.id === id).props.onChange({ target: { value } });
      tree = renderContact();
    }
    focused = undefined;
    await find(tree, node => node.type === 'form').props.onSubmit({ preventDefault() {} });
    assert.equal(focused, 'contact-equipment');
    assert.equal(networkCalls, 0);
    assert.equal(find(renderContact(), node => node.props?.id === 'contact-equipment').props['aria-invalid'], true);
  });
} finally {
  globalThis.fetch = originalFetch;
  if (originalWindow === undefined) delete globalThis.window; else globalThis.window = originalWindow;
  if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
}
const failures = cases.filter(item => !item.pass);
const report = { checkedAt: new Date().toISOString(), checks: cases.length, passed: cases.length - failures.length, failures, networkCalls, cases, scope: 'Actual TSX and source dependencies with controlled React state/effects. Layout wrappers are stubbed. No browser, real hydration or lead submission.' };
if (output) { await mkdir(dirname(output), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify({ checks: report.checks, passed: report.passed, failures, networkCalls }, null, 2));
process.exitCode = failures.length ? 1 : 0;
