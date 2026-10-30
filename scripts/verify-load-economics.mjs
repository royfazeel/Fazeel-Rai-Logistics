#!/usr/bin/env node
/** Actual calculator logic + SSR component checks. No network or lead submission. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
let controlledInput;
const modules = new Map();
function loadSource(filename) {
  const path = resolve(root, filename);
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} };
  modules.set(path, module);
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const localRequire = specifier => {
    if (specifier === 'react') return { ...React, useId: () => 'load-audit', useState: initial => [controlledInput ?? initial, () => {}] };
    if (specifier.startsWith('@/')) return loadSource(`src/${specifier.slice(2)}.ts`);
    if (specifier.startsWith('.')) return loadSource(resolve(dirname(path), `${specifier}.ts`));
    return require(specifier);
  };
  new Script(`(function(require,module,exports){${code}\n})`, { filename: path }).runInThisContext()(localRequire, module, module.exports);
  return module.exports;
}
const { calculateLoadEconomics } = loadSource('src/lib/load-economics.ts');
const Calculator = loadSource('src/components/LoadProfitCalculator.tsx').default;
// Independent fixtures: do not import the example or pricing constants as an oracle.
const base = { equipment: 'dry-van', loadPay: '2000', loadedMiles: '800', emptyMiles: '100', totalHours: '20', fuelPrice: '4', mpg: '6', otherCosts: '150' };
const checks = [];
function check(name, verify) {
  try { verify(); checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false, message: error.message }); }
}
function result(overrides = {}) {
  const actual = calculateLoadEconomics({ ...base, ...overrides });
  assert.equal(actual.valid, true, JSON.stringify(actual));
  return actual;
}
function near(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-8, `Expected ${expected}; received ${actual}`); }

check('Worked example reconciles every entered cost and both rate-per-mile measures', () => {
  const actual = result();
  assert.equal(actual.loadPayCents, 200000);
  assert.equal(actual.totalMiles, 900);
  assert.equal(actual.gallons, 150);
  assert.equal(actual.dispatchFeeCents, 6000);
  assert.equal(actual.fuelCostCents, 60000);
  assert.equal(actual.otherCostsCents, 15000);
  assert.equal(actual.remainingCents, 119000);
  assert.equal(actual.breakEvenCents, 77320);
  near(actual.grossPerLoadedMile, 2.5);
  near(actual.grossPerAllMile, 2.2222222222222223);
  near(actual.remainingPerAllMile, 1.3222222222222222);
  near(actual.emptyMilesPercent, 11.11111111111111);
  near(actual.remainingPerHour, 59.5);
});

const fees = { 'dry-van': 3, reefer: 3, flatbed: 3, hotshot: 4, 'box-truck': 5, 'cargo-van': 5, 'sprinter-van': 5, 'power-only': 5, 'step-deck': 5, conestoga: 5, 'rgn-lowboy': 5, 'car-hauler': 5, tanker: 5, 'dump-truck': 5, 'curtain-side': 5, other: 5 };
const feeExamples = { 3: { fee: 6000, remaining: 119000, breakEven: 77320 }, 4: { fee: 8000, remaining: 117000, breakEven: 78125 }, 5: { fee: 10000, remaining: 115000, breakEven: 78948 } };
for (const [equipment, rate] of Object.entries(fees)) check(`${equipment} uses its independently expected fee`, () => {
  const actual = result({ equipment });
  assert.equal(actual.dispatchRate, rate);
  assert.equal(actual.dispatchFeeCents, feeExamples[rate].fee);
  assert.equal(actual.remainingCents, feeExamples[rate].remaining);
  assert.equal(actual.breakEvenCents, feeExamples[rate].breakEven);
});
check('Zero load pay produces a loss, not an invalid division', () => {
  const actual = result({ loadPay: '0' });
  assert.equal(actual.remainingCents, -75000);
  assert.equal(actual.grossPerAllMile, 0);
  assert.equal(actual.breakEvenCents, 77320);
});
check('A trip with no entered costs has zero break-even', () => {
  const actual = result({ fuelPrice: '0', otherCosts: '0', totalHours: '' });
  assert.equal(actual.remainingCents, 194000);
  assert.equal(actual.breakEvenCents, 0);
  assert.equal(actual.remainingPerHour, null);
});
check('Deadhead increases fuel cost and reduces remaining revenue', () => {
  const actual = result({ emptyMiles: '0' });
  assert.equal(actual.totalMiles, 800);
  assert.equal(actual.fuelCostCents, 53333);
  assert.equal(actual.remainingCents, 125667);
  assert.equal(actual.breakEvenCents, 70447);
  assert.equal(actual.grossPerLoadedMile, actual.grossPerAllMile);
});
check('Cent arithmetic and three-decimal pump prices reconcile', () => {
  const actual = result({ loadPay: '19.99', loadedMiles: '1', emptyMiles: '0', mpg: '4', fuelPrice: '3.999', otherCosts: '0', totalHours: '' });
  assert.equal(actual.dispatchFeeCents, 60);
  assert.equal(actual.fuelCostCents, 100);
  assert.equal(actual.remainingCents, 1839);
  assert.equal(actual.breakEvenCents, 104);
});
check('Half-cent fuel and fee values round consistently', () => {
  const actual = result({ equipment: 'box-truck', loadPay: '0.10', loadedMiles: '1', emptyMiles: '0', mpg: '2', fuelPrice: '0.05', otherCosts: '0' });
  assert.equal(actual.dispatchFeeCents, 1);
  assert.equal(actual.fuelCostCents, 3);
  assert.equal(actual.remainingCents, 6);
  assert.equal(actual.breakEvenCents, 4);
});
check('Quoted break-even covers entered costs after the rounded dispatch fee', () => {
  for (const equipment of ['dry-van', 'hotshot', 'box-truck']) {
    const estimate = result({ equipment, loadedMiles: '123.45', emptyMiles: '23.5', mpg: '7.13', fuelPrice: '3.999', otherCosts: '89.15' });
    const quoted = result({ equipment, loadedMiles: '123.45', emptyMiles: '23.5', mpg: '7.13', fuelPrice: '3.999', otherCosts: '89.15', loadPay: (estimate.breakEvenCents / 100).toFixed(2) });
    assert.ok(quoted.remainingCents >= 0 && quoted.remainingCents <= 1);
  }
});
check('Hours affect the hourly comparison without inventing driver wages', () => {
  const actual = result({ totalHours: '40' });
  assert.equal(actual.remainingPerHour, 29.75);
  assert.equal(actual.remainingCents, 119000);
});
check('Comma-separated amounts and surrounding spaces are accepted', () => {
  const actual = result({ loadPay: ' 2,000.00 ', loadedMiles: ' 800 ', totalHours: ' ' });
  assert.equal(actual.remainingCents, 119000);
  assert.equal(actual.remainingPerHour, null);
});
const invalid = [
  ['loadPay', ''], ['loadPay', '-1'], ['loadPay', '1e3'], ['loadPay', 'NaN'], ['loadPay', 'Infinity'],
  ['loadPay', '2,00'], ['loadPay', '2.001'], ['loadPay', '1,000,000.01'],
  ['loadedMiles', '0'], ['loadedMiles', ''], ['loadedMiles', '100000.01'],
  ['emptyMiles', '-1'], ['emptyMiles', '100000.01'], ['emptyMiles', ' '],
  ['mpg', '0'], ['mpg', '0.001'], ['mpg', '101'],
  ['fuelPrice', '4.0001'], ['fuelPrice', '101'], ['fuelPrice', '-4'],
  ['otherCosts', '1,000,000.01'], ['otherCosts', '-150'], ['otherCosts', ''],
  ['totalHours', '0'], ['totalHours', '10000.01'], ['totalHours', 'tomorrow'],
];
for (const [field, value] of invalid) check(`Invalid ${field}=${JSON.stringify(value)} returns a field error and no amounts`, () => {
  const actual = calculateLoadEconomics({ ...base, [field]: value });
  assert.equal(actual.valid, false);
  assert.ok(actual.errors[field]);
  assert.equal('remainingCents' in actual, false);
});
check('All supported numeric extremes remain finite', () => {
  const actual = result({ loadPay: '1000000', loadedMiles: '100000', emptyMiles: '100000', totalHours: '0.01', mpg: '0.01', fuelPrice: '100', otherCosts: '1000000' });
  for (const [key, value] of Object.entries(actual)) if (typeof value === 'number') assert.ok(Number.isFinite(value), key);
});
check('Default SSR contains the worked estimate and explicit profit limitation', () => {
  controlledInput = undefined;
  const html = renderToStaticMarkup(React.createElement(Calculator));
  for (const expected of ['$1,190.00', '$773.20', '$600.00', '$60.00', '$2.22', '$59.50', 'This is not net profit.', 'aria-live="polite"', 'for="load-audit-mpg"']) assert.ok(html.includes(expected), expected);
  assert.ok(!html.includes('aria-invalid="true"'));
});
check('Invalid component input is labelled and hides calculated amounts', () => {
  controlledInput = { ...base, mpg: '0' };
  const html = renderToStaticMarkup(React.createElement(Calculator));
  assert.ok(html.includes('aria-invalid="true"'));
  assert.ok(html.includes('load-audit-mpg-error'));
  assert.ok(html.includes('Fuel economy must be greater than zero.'));
  assert.ok(!html.includes('<dd'));
  assert.ok(!html.includes('NaN') && !html.includes('Infinity'));
});
check('Optional blank hours hides only the hourly output', () => {
  controlledInput = { ...base, totalHours: '' };
  const html = renderToStaticMarkup(React.createElement(Calculator));
  assert.ok(!html.includes('Remaining per trip hour'));
  assert.ok(html.includes('$1,190.00'));
});

const failures = checks.filter(item => !item.pass);
const report = { checkedAt: new Date().toISOString(), checks: checks.length, passed: checks.length - failures.length, failures, cases: checks };
const args = process.argv.slice(2);
const index = args.indexOf('--json');
if (index >= 0) {
  const file = args[index + 1];
  if (!file || file.startsWith('--')) throw new Error('--json requires a file path.');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(report, null, 2) + '\n');
}
console.log(`${failures.length ? 'FAIL' : 'PASS'}: ${report.passed}/${report.checks} load-economics checks; ${failures.length} failures.`);
for (const failure of failures) console.error(`${failure.name}: ${failure.message}`);
process.exitCode = failures.length ? 1 : 0;
