#!/usr/bin/env node
/**
 * Read-only component checks against an independent, owner-approved fee oracle.
 * Renders the actual FeeCalculator TSX and its actual pricing/option dependencies
 * with controlled React state, without a browser, build, network, or submissions.
 * Usage: node scripts/verify-fee-calculator.mjs [--json output/seo-sep28/calculator.json]
 */
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
  'dry-van': 3, reefer: 3, flatbed: 3, hotshot: 4,
  'box-truck': 5, 'cargo-van': 5, 'sprinter-van': 5, 'power-only': 5,
  'step-deck': 5, conestoga: 5, 'rgn-lowboy': 5, 'car-hauler': 5,
  tanker: 5, 'dump-truck': 5, 'curtain-side': 5, other: 5,
};
// Explicit currency fixtures, not the component's math copied as a test oracle.
const examples = [
  { input: '5000', gross: '$5,000.00', rates: { 3: ['$150.00', '$4,850.00'], 4: ['$200.00', '$4,800.00'], 5: ['$250.00', '$4,750.00'] } },
  { input: '5,000.50', gross: '$5,000.50', rates: { 3: ['$150.02', '$4,850.48'], 4: ['$200.02', '$4,800.48'], 5: ['$250.03', '$4,750.47'] } },
  { input: '19.99', gross: '$19.99', rates: { 3: ['$0.60', '$19.39'], 4: ['$0.80', '$19.19'], 5: ['$1.00', '$18.99'] } },
  { input: '0.10', gross: '$0.10', rates: { 3: ['$0.00', '$0.10'], 4: ['$0.00', '$0.10'], 5: ['$0.01', '$0.09'] } },
  { input: '0.01', gross: '$0.01', rates: { 3: ['$0.00', '$0.01'], 4: ['$0.00', '$0.01'], 5: ['$0.00', '$0.01'] } },
  { input: '0', gross: '$0.00', rates: { 3: ['$0.00', '$0.00'], 4: ['$0.00', '$0.00'], 5: ['$0.00', '$0.00'] } },
  { input: '1,000,000,000', gross: '$1,000,000,000.00', rates: { 3: ['$30,000,000.00', '$970,000,000.00'], 4: ['$40,000,000.00', '$960,000,000.00'], 5: ['$50,000,000.00', '$950,000,000.00'] } },
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
    return [controlledState[position] ?? initial, () => {}];
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
const plain = value => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").trim();
function render(equipment, revenue) {
  controlledState = [equipment, revenue]; stateCalls = 0;
  const html = renderToStaticMarkup(React.createElement(Calculator));
  if (stateCalls !== 2) throw new Error(`Expected two controlled states; found ${stateCalls}.`);
  return { html, amounts: [...html.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/g)].map(match => ({ label: plain(match[1]), amount: plain(match[2]) })) };
}
const checks = [];
for (const [equipment, rate] of Object.entries(expectedFees)) {
  for (const example of examples) {
    const { html, amounts } = render(equipment, example.input);
    const [fee, remaining] = example.rates[rate];
    const expected = [['Gross revenue entered', example.gross], [`Dispatch fee (${rate}%)`, fee], ['Revenue after dispatch fee', remaining]];
    const mismatches = expected.flatMap(([label, amount]) => {
      const received = amounts.find(item => item.label === label)?.amount;
      return received === amount ? [] : [{ label, expected: amount, received: received || 'missing' }];
    });
    if (!html.includes('aria-invalid="false"')) mismatches.push({ label: 'validation', expected: 'valid', received: 'invalid' });
    checks.push({ equipment, rate, input: example.input, pass: !mismatches.length, mismatches });
  }
}
for (const input of invalidInputs) {
  const { html, amounts } = render('dry-van', input);
  const pass = html.includes('aria-invalid="true"') && html.includes('role="alert"') && amounts.length === 0;
  checks.push({ equipment: 'dry-van', input, invalidInput: true, pass });
}
const failures = checks.filter(check => !check.pass);
const report = { checkedAt: new Date().toISOString(), note: 'Actual component and pricing dependencies, rendered with controlled React state. No browser events, hydration, build, network or forms.', expectedFees, checks: checks.length, passed: checks.length - failures.length, failures, cases: checks };
if (output) { await mkdir(dirname(output), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n'); }
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${report.passed}/${report.checks} calculator cases; ${Object.keys(expectedFees).length} equipment choices; ${failures.length} failures.`);
for (const failure of failures) console.error(JSON.stringify(failure));
process.exitCode = failures.length ? 1 : 0;
