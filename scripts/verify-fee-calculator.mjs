#!/usr/bin/env node
/**
 * Read-only component checks against an independent, owner-approved fee oracle.
 * Renders the actual FeeCalculator TSX and its actual pricing/option dependencies
 * with controlled React state, without a browser, build, network, or submissions.
 * Usage: node scripts/verify-fee-calculator.mjs [--json output/seo-sep28/calculator.json]
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
const args = process.argv.slice(2);
const jsonIndex = args.indexOf('--json');
const output = jsonIndex >= 0 ? args[jsonIndex + 1] : undefined;
if (jsonIndex >= 0 && (!output || output.startsWith('--'))) throw new Error('--json requires an output path.');

// Deliberately independent of src/lib/dispatch-pricing.ts. An incorrect published
// helper must fail even if the calculator consistently uses that wrong helper.
const expectedFees = {
  'dry-van': 5, reefer: 4, flatbed: 5, hotshot: 6,
  'box-truck': 7, 'cargo-van': 12, 'sprinter-van': 5, 'power-only': 5,
  'step-deck': 5, conestoga: 4, 'rgn-lowboy': 5, 'car-hauler': 5,
  tanker: 5, 'dump-truck': 5, 'curtain-side': 5,
};
// Explicit currency fixtures, not the component's math copied as a test oracle.
const examples = [
  { input: '2000', gross: '$2,000.00', rates: { 4: ['$80.00', '$1,920.00'], 5: ['$100.00', '$1,900.00'], 6: ['$120.00', '$1,880.00'], 7: ['$140.00', '$1,860.00'], 12: ['$240.00', '$1,760.00'] } },
  { input: '5000', gross: '$5,000.00', rates: { 4: ['$200.00', '$4,800.00'], 5: ['$250.00', '$4,750.00'], 6: ['$300.00', '$4,700.00'], 7: ['$350.00', '$4,650.00'], 12: ['$600.00', '$4,400.00'] } },
  { input: '5,000.50', gross: '$5,000.50', rates: { 4: ['$200.02', '$4,800.48'], 5: ['$250.03', '$4,750.47'], 6: ['$300.03', '$4,700.47'], 7: ['$350.04', '$4,650.46'], 12: ['$600.06', '$4,400.44'] } },
  { input: '19.99', gross: '$19.99', rates: { 4: ['$0.80', '$19.19'], 5: ['$1.00', '$18.99'], 6: ['$1.20', '$18.79'], 7: ['$1.40', '$18.59'], 12: ['$2.40', '$17.59'] } },
  { input: '0.10', gross: '$0.10', rates: { 4: ['$0.00', '$0.10'], 5: ['$0.01', '$0.09'], 6: ['$0.01', '$0.09'], 7: ['$0.01', '$0.09'], 12: ['$0.01', '$0.09'] } },
  { input: '0.01', gross: '$0.01', rates: { 4: ['$0.00', '$0.01'], 5: ['$0.00', '$0.01'], 6: ['$0.00', '$0.01'], 7: ['$0.00', '$0.01'], 12: ['$0.00', '$0.01'] } },
  { input: '0', gross: '$0.00', rates: { 4: ['$0.00', '$0.00'], 5: ['$0.00', '$0.00'], 6: ['$0.00', '$0.00'], 7: ['$0.00', '$0.00'], 12: ['$0.00', '$0.00'] } },
  { input: '1,000,000,000', gross: '$1,000,000,000.00', rates: { 4: ['$40,000,000.00', '$960,000,000.00'], 5: ['$50,000,000.00', '$950,000,000.00'], 6: ['$60,000,000.00', '$940,000,000.00'], 7: ['$70,000,000.00', '$930,000,000.00'], 12: ['$120,000,000.00', '$880,000,000.00'] } },
];
const invalidInputs = ['', ' ', '-1', '5,00', '1e3', 'NaN', 'Infinity', '5000.001', '1,000,000,000.01'];
let controlledState;
let stateCalls = 0;
const controlledReact = {
  ...React,
  useId: () => 'fee-audit',
  useState: initial => {
    const position = stateCalls++;
    if (position > 1) throw new Error('Calculator state shape changed; update the controlled rendering harness.');
    return [controlledState[position] ?? initial, update => { controlledState[position] = typeof update === 'function' ? update(controlledState[position] ?? initial) : update; }];
  },
};
const modules = new Map();
function loadSource(filename) {
  const path = resolve(root, filename);
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} };
  modules.set(path, module);
  const source = readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const localRequire = specifier => {
    if (specifier === 'react') return controlledReact;
    if (specifier.startsWith('@/')) return loadSource(`src/${specifier.slice(2)}.ts`);
    if (specifier.startsWith('./') || specifier.startsWith('../')) return loadSource(resolve(dirname(path), `${specifier}.ts`));
    return require(specifier);
  };
  new Script(`(function(require,module,exports){${code}\n})`, { filename: path }).runInThisContext()(localRequire, module, module.exports);
  return module.exports;
}
const Calculator = loadSource('src/components/FeeCalculator.tsx').default;
const pricing = loadSource('src/lib/dispatch-pricing.ts');
const plain = value => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").trim();
function render(equipment, revenue) {
  controlledState = [equipment, revenue]; stateCalls = 0;
  const html = renderToStaticMarkup(React.createElement(Calculator));
  if (stateCalls !== 2) throw new Error(`Expected two controlled states; found ${stateCalls}.`);
  return { html, amounts: [...html.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/g)].map(match => ({ label: plain(match[1]), amount: plain(match[2]) })) };
}
const checks = [];
function check(name, verify) {
  try { verify(); checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false, message: error.message }); }
}
check('The authoritative map preserves all 15 independent published rates', () => {
  assert.deepEqual(pricing.DISPATCH_RATES, expectedFees);
  assert.equal(pricing.DISPATCH_RATE_RANGE, '4 to 12%');
});
check('Exact visible fee answer agrees with the controlling specification and homepage FAQ', () => {
  const expected = 'Dispatch fees are 7% for box trucks, 6% for hotshots, 4% for reefers and Conestoga trailers, 12% for cargo vans, and 5% for dry vans, flatbeds, power only, step decks, Sprinter vans, RGN and lowboy trailers, car haulers, tankers, dump trucks and trailers, and curtain side trailers. Fees apply to gross revenue on loads we book. Rai Dispatch uses percentage only pricing for every truck type. There are no setup fees, fixed weekly or monthly charges, or other Rai Dispatch fees. Confirm the applicable equipment category, billing base and service scope in writing.';
  assert.equal(pricing.DISPATCH_FEES_ANSWER, expected);
  assert.equal(loadSource('src/lib/constants.ts').FAQS.find(item => item.id === 1).answer, expected);
});
const exactStatements = {
  'box-truck': 'Rai Dispatch charges 7% of gross revenue on loads we book for box trucks. Confirm the billing base and service scope in writing before onboarding.',
  'cargo-van': 'Rai Dispatch charges 12% of gross revenue on loads we book for cargo vans. The separately listed Sprinter van dispatch service is priced at 5%. Confirm which service category applies to your vehicle before onboarding.',
  'sprinter-van': 'Rai Dispatch charges 5% of gross revenue on loads we book for Sprinter vans. The separately listed cargo van dispatch service is priced at 12%. Confirm which service category applies to your vehicle before onboarding.',
};
for (const [equipment, expected] of Object.entries(exactStatements)) check(`${equipment} exact answer and descriptive Offer retain the right unit`, () => {
  assert.equal(pricing.getEquipmentFeeStatement(equipment), expected);
  const offer = pricing.getEquipmentOfferDescription(equipment);
  assert.ok(offer.startsWith(`${expectedFees[equipment]}% of gross revenue on loads Rai Dispatch books for `));
  assert.ok(!offer.includes('$') && !offer.includes('USD'));
});
for (const equipment of ['other', '', 'not-a-truck', 'BOX-TRUCK', '__proto__', 'constructor']) check(`${equipment || 'blank'} never resolves to a published calculation`, () => {
  assert.equal(pricing.isDispatchEquipment(equipment), false);
  assert.equal(pricing.getDispatchRate(equipment), null);
  assert.equal(pricing.getDispatchRateLabel(equipment), 'Quote required');
  const { html, amounts } = render(equipment, '2000');
  assert.equal(amounts.length, 0);
  assert.ok(html.includes('aria-invalid="true"') && html.includes('role="alert"'));
  assert.ok(html.includes(equipment === 'other' ? 'written rate confirmation' : 'Choose a listed equipment type'));
  assert.ok(!html.includes('null%') && !html.includes('NaN') && !html.includes('Infinity'));
});
{
  // No controlled override: verify the actual server-rendered starting state.
  const { html, amounts } = render(undefined, undefined);
  const expected = [['Gross revenue entered', '$2,000.00'], ['Dispatch fee (7%)', '$140.00'], ['Revenue after dispatch fee, before operating costs', '$1,860.00']];
  const mismatches = expected.flatMap(([label, amount]) => {
    const received = amounts.find(item => item.label === label)?.amount;
    return received === amount ? [] : [{ label, expected: amount, received: received || 'missing' }];
  });
  for (const text of ['one hypothetical $2,000 box truck load', 'one load or a group of loads', 'For Box Trucks, 7% of the entered $2,000.00 billing base is a $140.00 dispatch fee.']) {
    if (!plain(html).includes(text)) mismatches.push({ label: 'default example context', expected: text, received: 'missing' });
  }
  if (!/<option\b[^>]*value="box-truck"[^>]*selected=""/.test(html)) mismatches.push({ label: 'default equipment', expected: 'box-truck selected', received: 'missing' });
  checks.push({ name: 'Actual SSR default is a clearly labeled one-load box-truck example', pass: !mismatches.length, mismatches });
}
for (const [equipment, rate] of Object.entries(expectedFees)) {
  for (const example of examples) {
    const { html, amounts } = render(equipment, example.input);
    const [fee, remaining] = example.rates[rate];
    const expected = [['Gross revenue entered', example.gross], [`Dispatch fee (${rate}%)`, fee], ['Revenue after dispatch fee, before operating costs', remaining]];
    const mismatches = expected.flatMap(([label, amount]) => {
      const received = amounts.find(item => item.label === label)?.amount;
      return received === amount ? [] : [{ label, expected: amount, received: received || 'missing' }];
    });
    if (!html.includes('aria-invalid="false"')) mismatches.push({ label: 'validation', expected: 'valid', received: 'invalid' });
    if (!html.includes('4 to 12%')) mismatches.push({ label: 'published range', expected: '4 to 12%', received: 'missing or outdated' });
    const calculation = `${rate}% of the entered ${example.gross} billing base is a ${fee} dispatch fee.`;
    if (!plain(html).includes(calculation)) mismatches.push({ label: 'percentage calculation context', expected: calculation, received: 'missing' });
    checks.push({ equipment, rate, input: example.input, pass: !mismatches.length, mismatches });
  }
}
for (const input of invalidInputs) {
  const { html, amounts } = render('dry-van', input);
  const pass = html.includes('aria-invalid="true"') && html.includes('role="alert"') && amounts.length === 0;
  checks.push({ equipment: 'dry-van', input, invalidInput: true, pass });
}
function findElement(node, predicate) {
  if (!node || typeof node !== 'object') return undefined;
  if (Array.isArray(node)) return node.map(child => findElement(child, predicate)).find(Boolean);
  return predicate(node) ? node : findElement(node.props?.children, predicate);
}
check('Switching cargo to Sprinter and back updates the visible category, percentage and USD amounts together', () => {
  controlledState = ['cargo-van', '2000'];
  for (const [equipment, label, fee, remainder] of [['sprinter-van', 'Sprinter Vans · 5% dispatch rate', '$100.00', '$1,900.00'], ['cargo-van', 'Cargo Vans · 12% dispatch rate', '$240.00', '$1,760.00']]) {
    stateCalls = 0;
    const tree = Calculator();
    const select = findElement(tree, node => node.type === 'select');
    select.props.onChange({ target: { value: equipment } });
    const { html, amounts } = render(...controlledState);
    assert.ok(plain(html).includes(label));
    assert.equal(amounts[1].amount, fee);
    assert.equal(amounts[2].amount, remainder);
    assert.ok(plain(html).includes('Cargo vans are listed at 12% and Sprinter vans at 5%.'));
    assert.ok(html.includes('href="/equipment/cargo-van"') && html.includes('href="/equipment/sprinter-van"'));
  }
});
const failures = checks.filter(check => !check.pass);
const report = { checkedAt: new Date().toISOString(), note: 'Actual component and pricing dependencies, rendered with controlled React state. No browser events, hydration, build, network or forms.', expectedFees, checks: checks.length, passed: checks.length - failures.length, failures, cases: checks };
if (output) { await mkdir(dirname(output), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n'); }
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${report.passed}/${report.checks} calculator cases; ${Object.keys(expectedFees).length} equipment choices; ${failures.length} failures.`);
for (const failure of failures) console.error(JSON.stringify(failure));
process.exitCode = failures.length ? 1 : 0;
