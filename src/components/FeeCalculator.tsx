'use client';

import { useId, useState } from 'react';
import { EQUIPMENT_TYPES } from '@/lib/constants';
import { getDispatchRate } from '@/lib/dispatch-pricing';

const equipmentOptions = [
  ...EQUIPMENT_TYPES.map(({ id, name }) => ({ value: id, label: name })),
  { value: 'other', label: 'Other truck type' },
];

const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function FeeCalculator() {
  const id = useId();
  const [equipment, setEquipment] = useState('dry-van');
  const [grossRevenue, setGrossRevenue] = useState('5000');
  const amount = grossRevenue.trim();
  const revenue = Number(amount.replace(/,/g, ''));
  const validFormat = /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(amount);
  const error = !amount
    ? 'Enter the gross revenue on loads we dispatch.'
    : !validFormat || !Number.isFinite(revenue)
      ? 'Enter a dollar amount of zero or more, with up to two decimal places. Example: 5,000.50.'
      : revenue > 1_000_000_000
        ? 'Enter an amount up to $1,000,000,000.'
        : '';
  const rate = getDispatchRate(equipment);
  // Calculate in cents so the displayed fee and remaining revenue reconcile.
  const revenueCents = Math.round(revenue * 100);
  const feeCents = Math.round(revenueCents * rate / 100);
  const remainingCents = revenueCents - feeCents;
  const selectedEquipment = equipmentOptions.find(option => option.value === equipment)?.label;

  return (
    <section aria-labelledby={`${id}-heading`} className="overflow-hidden rounded-xl border border-surface-300 bg-white shadow-sm">
      <div className="p-6 sm:p-8">
        <p className="eyebrow">Dispatch fee calculator</p>
        <h2 id={`${id}-heading`} className="section-heading mb-4">Estimate your dispatch fee.</h2>
        <p className="max-w-3xl text-surface-700 leading-relaxed">Choose your equipment and enter the gross revenue for one load or a group of loads we dispatch. The estimate uses your equipment&apos;s published rate and updates as you type.</p>
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
          <div>
            <label htmlFor={`${id}-equipment`} className="mb-2 block font-semibold text-navy-950">Truck or equipment type</label>
            <select
              id={`${id}-equipment`}
              value={equipment}
              onChange={event => setEquipment(event.target.value)}
              className="min-h-[48px] w-full rounded-lg border border-surface-400 bg-white px-4 py-3 text-navy-950 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/30"
            >
              {equipmentOptions.map(option => <option key={option.value} value={option.value}>{option.label} — {getDispatchRate(option.value)}%</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-revenue`} className="mb-2 block font-semibold text-navy-950">Gross revenue on loads we dispatch (USD)</label>
            <input
              id={`${id}-revenue`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={grossRevenue}
              onChange={event => setGrossRevenue(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={`${id}-revenue-help${error ? ` ${id}-error` : ''}`}
              className="min-h-[48px] w-full rounded-lg border border-surface-400 bg-white px-4 py-3 text-lg text-navy-950 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/30"
            />
            <p id={`${id}-revenue-help`} className="mt-2 text-sm text-surface-600">Use dollars and cents, such as 5,000 or 5000.50. Exclude freight you book yourself.</p>
            {error ? <p id={`${id}-error`} className="mt-2 text-sm font-medium text-primary-700" role="alert">{error}</p> : null}
          </div>
          <p className="text-sm leading-relaxed text-surface-600">Confirm the billing base and treatment of detention, layover, cancellations and other accessorials in your dispatch agreement. Results are rounded to the nearest cent.</p>
        </div>
        <div className="bg-navy-950 p-6 text-white sm:p-8" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/75">Your fee estimate</p>
          <p className="mt-2 mb-6 text-white/90">{selectedEquipment} · {rate}% dispatch rate</p>
          {error ? (
            <p className="py-5 text-lg text-white/90">Enter a valid revenue amount to see your estimate.</p>
          ) : (
            <dl className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-white/80">Gross revenue entered</dt>
                <dd className="text-xl font-semibold tabular-nums">{dollars.format(revenueCents / 100)}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-white/80">Dispatch fee ({rate}%)</dt>
                <dd className="text-2xl font-bold tabular-nums">{dollars.format(feeCents / 100)}</dd>
              </div>
              <div className="border-t border-white/20 pt-5">
                <dt className="mb-2 font-semibold text-white/90">Revenue after dispatch fee</dt>
                <dd className="text-3xl sm:text-4xl font-bold tabular-nums break-words">{dollars.format(remainingCents / 100)}</dd>
              </div>
            </dl>
          )}
          <p className="mt-6 text-sm leading-relaxed text-white/80">The remaining revenue is before fuel, insurance, truck payments, factoring, taxes and all other operating costs. It is not profit or an earnings forecast.</p>
        </div>
      </div>
    </section>
  );
}
