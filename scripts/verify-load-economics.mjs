#!/usr/bin/env node
/** Actual calculator logic + SSR component checks. No network or lead submission. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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
  const basePath = resolve(root, filename);
  const path = [basePath, `${basePath}.ts`, `${basePath}.tsx`].find(candidate => existsSync(candidate));
  if (!path) throw new Error(`Source module not found: ${filename}`);
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} };
  modules.set(path, module);
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const localRequire = specifier => {
    if (specifier === 'react') return { ...React, useId: () => 'load-audit', useState: initial => {
      const value = controlledInput ?? initial;
      return [value, update => { controlledInput = typeof update === 'function' ? update(controlledInput ?? value) : update; }];
    } };
    if (specifier.startsWith('@/')) return loadSource(`src/${specifier.slice(2)}`);
    if (specifier.startsWith('.')) return loadSource(resolve(dirname(path), specifier));
    return require(specifier);
  };
  new Script(`(function(require,module,exports){${code}\n})`, { filename: path }).runInThisContext()(localRequire, module, module.exports);
  return module.exports;
}
const { calculateLoadEconomics, normalizeEquipmentSelection } = loadSource('src/lib/load-economics.ts');
const Calculator = loadSource('src/components/LoadProfitCalculator.tsx').default;
const calculatorPage = loadSource('src/app/tools/load-profit-calculator/page.tsx');
const { LEARNING_LINKS } = loadSource('src/lib/learning-links.ts');
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
  assert.equal(actual.dispatchFeeCents, 10000);
  assert.equal(actual.fuelCostCents, 60000);
  assert.equal(actual.otherCostsCents, 15000);
  assert.equal(actual.remainingCents, 115000);
  assert.equal(actual.breakEvenCents, 78948);
  near(actual.grossPerLoadedMile, 2.5);
  near(actual.grossPerAllMile, 2.2222222222222223);
  near(actual.remainingPerAllMile, 1.2777777777777777);
  near(actual.emptyMilesPercent, 11.11111111111111);
  near(actual.remainingPerHour, 57.5);
});

const fees = { 'dry-van': 5, reefer: 4, flatbed: 5, hotshot: 6, 'box-truck': 7, 'cargo-van': 12, 'sprinter-van': 5, 'power-only': 5, 'step-deck': 5, conestoga: 4, 'rgn-lowboy': 5, 'car-hauler': 5, tanker: 5, 'dump-truck': 5, 'curtain-side': 5 };
const feeExamples = { 4: { fee: 8000, remaining: 117000, breakEven: 78125 }, 5: { fee: 10000, remaining: 115000, breakEven: 78948 }, 6: { fee: 12000, remaining: 113000, breakEven: 79788 }, 7: { fee: 14000, remaining: 111000, breakEven: 80646 }, 12: { fee: 24000, remaining: 101000, breakEven: 85228 } };
for (const [equipment, rate] of Object.entries(fees)) check(`${equipment} uses its independently expected fee`, () => {
  assert.equal(normalizeEquipmentSelection(equipment), equipment);
  const actual = result({ equipment });
  assert.equal(actual.dispatchRate, rate);
  assert.equal(actual.dispatchFeeCents, feeExamples[rate].fee);
  assert.equal(actual.remainingCents, feeExamples[rate].remaining);
  assert.equal(actual.breakEvenCents, feeExamples[rate].breakEven);
});
check('Only an absent equipment parameter uses the clearly labelled dry-van example', () => {
  assert.equal(normalizeEquipmentSelection(undefined), 'dry-van');
  assert.equal(result({ equipment: normalizeEquipmentSelection(undefined) }).dispatchFeeCents, 10000);
});
for (const value of ['', 'not-a-truck', 'BOX-TRUCK', ' box-truck ', '__proto__', 'constructor', [], ['box-truck'], ['box-truck', 'dry-van'], ['box-truck', 'box-truck']]) {
  check(`Unknown or repeated equipment ${JSON.stringify(value)} cannot silently calculate a default fee`, () => {
    const equipment = normalizeEquipmentSelection(value);
    assert.equal(equipment, '');
    const actual = calculateLoadEconomics({ ...base, equipment });
    assert.equal(actual.valid, false);
    assert.ok(actual.errors.equipment.includes('Choose a listed equipment type'));
    assert.equal('dispatchFeeCents' in actual, false);
  });
}
check('Other remains a distinct quote-only selection with no calculated amounts', () => {
  assert.equal(normalizeEquipmentSelection('other'), 'other');
  const actual = calculateLoadEconomics({ ...base, equipment: 'other' });
  assert.equal(actual.valid, false);
  assert.ok(actual.errors.equipment.includes('written rate confirmation'));
  assert.equal('dispatchFeeCents' in actual, false);
  assert.equal('remainingCents' in actual, false);
});
check('Both box-truck discovery links select the 7% calculator preset', () => {
  for (const path of ['/equipment/box-truck', '/resources/how-to-find-box-truck-loads']) {
    const link = LEARNING_LINKS[path].find(item => item.href.startsWith('/tools/load-profit-calculator'));
    assert.equal(link?.href, '/tools/load-profit-calculator?equipment=box-truck');
    const equipment = normalizeEquipmentSelection(new URL(link.href, 'https://raidispatch.com').searchParams.get('equipment'));
    assert.equal(result({ equipment }).dispatchFeeCents, 14000);
  }
});
check('Zero load pay produces a loss, not an invalid division', () => {
  const actual = result({ loadPay: '0' });
  assert.equal(actual.remainingCents, -75000);
  assert.equal(actual.grossPerAllMile, 0);
  assert.equal(actual.breakEvenCents, 78948);
});
check('A trip with no entered costs has zero break-even', () => {
  const actual = result({ fuelPrice: '0', otherCosts: '0', totalHours: '' });
  assert.equal(actual.remainingCents, 190000);
  assert.equal(actual.breakEvenCents, 0);
  assert.equal(actual.remainingPerHour, null);
});
check('Deadhead increases fuel cost and reduces remaining revenue', () => {
  const actual = result({ emptyMiles: '0' });
  assert.equal(actual.totalMiles, 800);
  assert.equal(actual.fuelCostCents, 53333);
  assert.equal(actual.remainingCents, 121667);
  assert.equal(actual.breakEvenCents, 71930);
  assert.equal(actual.grossPerLoadedMile, actual.grossPerAllMile);
});
check('Cent arithmetic and three-decimal pump prices reconcile', () => {
  const actual = result({ loadPay: '19.99', loadedMiles: '1', emptyMiles: '0', mpg: '4', fuelPrice: '3.999', otherCosts: '0', totalHours: '' });
  assert.equal(actual.dispatchFeeCents, 100);
  assert.equal(actual.fuelCostCents, 100);
  assert.equal(actual.remainingCents, 1799);
  assert.equal(actual.breakEvenCents, 106);
});
check('Half-cent fuel and fee values round consistently', () => {
  const actual = result({ equipment: 'dry-van', loadPay: '0.10', loadedMiles: '1', emptyMiles: '0', mpg: '2', fuelPrice: '0.05', otherCosts: '0' });
  assert.equal(actual.dispatchFeeCents, 1);
  assert.equal(actual.fuelCostCents, 3);
  assert.equal(actual.remainingCents, 6);
  assert.equal(actual.breakEvenCents, 4);
});
check('Quoted break-even covers entered costs after the rounded dispatch fee', () => {
  for (const equipment of ['reefer', 'dry-van', 'hotshot', 'box-truck', 'cargo-van']) {
    const estimate = result({ equipment, loadedMiles: '123.45', emptyMiles: '23.5', mpg: '7.13', fuelPrice: '3.999', otherCosts: '89.15' });
    const quoted = result({ equipment, loadedMiles: '123.45', emptyMiles: '23.5', mpg: '7.13', fuelPrice: '3.999', otherCosts: '89.15', loadPay: (estimate.breakEvenCents / 100).toFixed(2) });
    assert.ok(quoted.remainingCents >= 0 && quoted.remainingCents <= 1);
  }
});
check('Hours affect the hourly comparison without inventing driver wages', () => {
  const actual = result({ totalHours: '40' });
  assert.equal(actual.remainingPerHour, 28.75);
  assert.equal(actual.remainingCents, 115000);
});
check('Comma-separated amounts and surrounding spaces are accepted', () => {
  const actual = result({ loadPay: ' 2,000.00 ', loadedMiles: ' 800 ', totalHours: ' ' });
  assert.equal(actual.remainingCents, 115000);
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
  for (const expected of ['Dry Vans · 5% dispatch fee', '$1,150.00', '$789.48', '$600.00', '$100.00', '$2.22', '$57.50', 'This is not net profit.', 'aria-live="polite"', 'for="load-audit-mpg"']) assert.ok(html.includes(expected), expected);
  assert.ok(!html.includes('aria-invalid="true"'));
});
check('Box-truck SSR initial selection names the equipment and shows the $140 fee', () => {
  controlledInput = undefined;
  const html = renderToStaticMarkup(React.createElement(Calculator, { initialEquipment: 'box-truck' }));
  for (const expected of ['Box Trucks · 7% dispatch fee', '$140.00', '$1,110.00', '$806.46', '$55.50', '<option value="box-truck" selected="">']) assert.ok(html.includes(expected), expected);
  assert.ok(!html.includes('<option value="dry-van" selected="">'));
});
for (const [equipment, fee, revenue] of [['box-truck', '$140.00', '$1,860.00'], ['cargo-van', '$240.00', '$1,760.00'], ['sprinter-van', '$100.00', '$1,900.00']]) check(`${equipment} $2,000 example separates the fee from revenue before operating costs`, () => {
  controlledInput = { ...base, equipment };
  const html = renderToStaticMarkup(React.createElement(Calculator));
  assert.ok(html.includes(fee));
  assert.ok(/Revenue after dispatch fee, before operating costs<\/dt>\s*<dd[^>]*>/.test(html));
  assert.ok(html.includes(revenue));
  assert.ok(html.includes('This is not net profit.'));
});
function findElement(node, predicate) {
  if (!node || typeof node !== 'object') return undefined;
  if (Array.isArray(node)) return node.map(child => findElement(child, predicate)).find(Boolean);
  if (predicate(node)) return node;
  return findElement(node.props?.children, predicate);
}
check('Cargo and Sprinter selection changes update equipment, fee and remainder together', () => {
  controlledInput = { ...base, equipment: 'cargo-van' };
  for (const [equipment, name, rate, fee, revenue] of [['sprinter-van', 'Sprinter Vans', 5, '$100.00', '$1,900.00'], ['cargo-van', 'Cargo Vans', 12, '$240.00', '$1,760.00']]) {
    const select = findElement(Calculator({}), node => node.type === 'select');
    select.props.onChange({ target: { value: equipment } });
    const html = renderToStaticMarkup(React.createElement(Calculator));
    assert.equal(controlledInput.equipment, equipment);
    assert.ok(html.includes(`${name} · ${rate}% dispatch fee`));
    assert.ok(html.includes(fee) && html.includes(revenue));
    assert.ok(html.includes('Cargo vans are listed at 12% and Sprinter vans at 5%.'));
    assert.ok(html.includes('href="/equipment/cargo-van"') && html.includes('href="/equipment/sprinter-van"'));
  }
});
for (const equipment of ['', 'other', 'not-a-truck']) check(`${equipment || 'Blank'} component selection displays an equipment error without numeric outputs`, () => {
  controlledInput = { ...base, equipment };
  const html = renderToStaticMarkup(React.createElement(Calculator));
  assert.ok(html.includes('load-audit-equipment-error') && html.includes('aria-invalid="true"'));
  assert.ok(!html.includes('<dd'));
  assert.ok(!html.includes('NaN') && !html.includes('null%'));
});
check('Reset restores example trip inputs while retaining the currently selected truck', () => {
  controlledInput = { ...base, equipment: 'cargo-van', loadPay: '9000', loadedMiles: '50', emptyMiles: '25', totalHours: '', mpg: '14', fuelPrice: '3', otherCosts: '90' };
  const tree = Calculator({ initialEquipment: 'box-truck' });
  const reset = findElement(tree, node => node.type === 'button' && node.props.children === 'Reset example values');
  assert.ok(reset, 'Reset button exists');
  reset.props.onClick();
  assert.deepEqual(controlledInput, { ...base, equipment: 'cargo-van', fuelPrice: '4.00' });
  assert.equal(calculateLoadEconomics(controlledInput).dispatchFeeCents, 24000);
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
  assert.ok(html.includes('$1,150.00'));
});

for (const [name, query, equipment, fee, feeAmount, remainder] of [
  ['box preset', { equipment: 'box-truck' }, 'box-truck', 7, '$140', '$1,110'],
  ['generic default', {}, 'dry-van', 5, '$100', '$1,150'],
]) {
  controlledInput = undefined;
  const tree = await calculatorPage.default({ searchParams: Promise.resolve(query) });
  check(`Server page ${name} aligns the keyed client and worked example with one canonical`, () => {
    const client = findElement(tree, node => node.type === Calculator);
    assert.equal(client.props.initialEquipment, equipment);
    assert.equal(client.key, equipment);
    const example = findElement(tree, node => node.props?.['aria-labelledby'] === 'worked-example-heading');
    const exampleHtml = renderToStaticMarkup(example);
    assert.ok(exampleHtml.includes(`Dispatch fee: ${fee}%`));
    assert.ok(exampleHtml.includes(`The ${fee}% dispatch fee is ${feeAmount}.`));
    assert.ok(exampleHtml.includes(`${remainder} remains.`));
    assert.ok(exampleHtml.includes(equipment === 'box-truck' ? 'Equipment: Box Trucks' : 'Equipment: Dry Vans'));
    assert.equal(calculatorPage.metadata.alternates.canonical, 'https://raidispatch.com/tools/load-profit-calculator');
  });
}
for (const [name, query, equipment] of [
  ['invalid preset', { equipment: 'not-a-truck' }, ''],
  ['repeated preset', { equipment: ['box-truck', 'dry-van'] }, ''],
  ['Other preset', { equipment: 'other' }, 'other'],
]) {
  controlledInput = undefined;
  const tree = await calculatorPage.default({ searchParams: Promise.resolve(query) });
  check(`Server ${name} preserves the invalid/quote state and has no calculated worked example`, () => {
    const client = findElement(tree, node => node.type === Calculator);
    assert.equal(client.props.initialEquipment, equipment);
    assert.equal(client.key, equipment);
    assert.equal(findElement(tree, node => node.props?.['aria-labelledby'] === 'worked-example-heading'), undefined);
    const html = renderToStaticMarkup(client);
    assert.ok(html.includes('aria-invalid="true"') && !html.includes('<dd'));
    assert.equal(calculatorPage.metadata.alternates.canonical, 'https://raidispatch.com/tools/load-profit-calculator');
  });
}

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
