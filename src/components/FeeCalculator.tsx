'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { EQUIPMENT_TYPES } from '@/lib/constants';
import { DISPATCH_RATE_RANGE, getDispatchRate, getDispatchRateLabel, OTHER_EQUIPMENT_NOTICE, VAN_CATEGORY_NOTICE } from '@/lib/dispatch-pricing';

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
  const [equipment, setEquipment] = useState('box-truck');
  const [grossRevenue, setGrossRevenue] = useState('2000');
  const amount = grossRevenue.trim();
  const revenue = Number(amount.replace(/,/g, ''));
  const validFormat = /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(amount);
  const revenueError = !amount
    ? 'Enter the agreed revenue billing base on loads we book.'
    : !validFormat || !Number.isFinite(revenue)
      ? 'Enter a dollar amount of zero or more, with up to two decimal places. Example: 2,000.50.'
      : revenue > 1_000_000_000
        ? 'Enter an amount up to $1,000,000,000.'
        : '';
  const rate = getDispatchRate(equipment);
  const equipmentError = rate === null
    ? equipment === 'other' ? OTHER_EQUIPMENT_NOTICE : 'Choose a listed equipment type before calculating a dispatch fee.'
    : '';
  const error = equipmentError || revenueError;
  // Calculate in cents so the displayed fee and remaining revenue reconcile.
  const revenueCents = Math.round(revenue * 100);
  const estimate = !error && rate !== null ? {
    feeCents: Math.round(revenueCents * rate / 100),
    remainingCents: revenueCents - Math.round(revenueCents * rate / 100),
  } : null;
  const selectedEquipment = equipmentOptions.find(option => option.value === equipment)?.label ?? 'Choose equipment';
  const vanSelected = equipment === 'cargo-van' || equipment === 'sprinter-van';

  return (
    <section aria-labelledby={`${id}-heading`} className="overflow-hidden rounded-xl border border-surface-300 bg-white shadow-sm">
      <div className="p-6 sm:p-8">
        <p className="eyebrow">Dispatch fee calculator</p>
        <h2 id={`${id}-heading`} className="section-heading mb-4">Estimate your dispatch fee.</h2>
        <p className="max-w-3xl text-surface-700 leading-relaxed">The starting values illustrate one hypothetical $2,000 box truck load. Published dispatch rates are {DISPATCH_RATE_RANGE} by equipment. Choose your truck and enter the agreed revenue billing base for one load or a group of loads we book. The estimate applies your equipment&apos;s percentage and updates as you type.</p>
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
          <div>
            <label htmlFor={`${id}-equipment`} className="mb-2 block font-semibold text-navy-950">Truck or equipment type</label>
            <select
              id={`${id}-equipment`}
              value={equipment}
              onChange={event => setEquipment(event.target.value)}
              aria-invalid={Boolean(equipmentError)}
              aria-describedby={`${id}-equipment-help${equipmentError ? ` ${id}-equipment-error` : ''}${vanSelected ? ` ${id}-van-note` : ''}`}
              className="min-h-[48px] w-full rounded-lg border border-surface-400 bg-white px-4 py-3 text-navy-950 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/30"
            >
              <option value="" disabled>Choose equipment</option>
              {equipmentOptions.map(option => <option key={option.value} value={option.value}>{option.label}: {getDispatchRateLabel(option.value)}</option>)}
            </select>
            <p id={`${id}-equipment-help`} className="mt-2 text-sm leading-6 text-surface-700">Select a published equipment category. Other equipment needs written rate confirmation.</p>
            {equipmentError ? <p id={`${id}-equipment-error`} className="mt-2 text-sm font-medium text-primary-700" role="alert">{equipmentError}</p> : null}
            {vanSelected ? <p id={`${id}-van-note`} className="mt-3 rounded-lg border border-surface-300 bg-surface-50 p-4 text-sm leading-6 text-navy-800">{VAN_CATEGORY_NOTICE} <Link href="/equipment/cargo-van" className="underline underline-offset-4">Cargo van dispatch: {getDispatchRateLabel('cargo-van')}</Link> · <Link href="/equipment/sprinter-van" className="underline underline-offset-4">Sprinter van dispatch: {getDispatchRateLabel('sprinter-van')}</Link></p> : null}
          </div>
          <div>
            <label htmlFor={`${id}-revenue`} className="mb-2 block font-semibold text-navy-950">Agreed revenue billing base on loads we book (USD)</label>
            <input
              id={`${id}-revenue`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={grossRevenue}
              onChange={event => setGrossRevenue(event.target.value)}
              aria-invalid={Boolean(revenueError)}
              aria-describedby={`${id}-revenue-help${revenueError ? ` ${id}-error` : ''}`}
              className="min-h-[48px] w-full rounded-lg border border-surface-400 bg-white px-4 py-3 text-lg text-navy-950 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/30"
            />
            <p id={`${id}-revenue-help`} className="mt-2 text-sm text-surface-700">Use dollars and cents, such as 2,000 or 2000.50. Exclude freight you book yourself.</p>
            {revenueError ? <p id={`${id}-error`} className="mt-2 text-sm font-medium text-primary-700" role="alert">{revenueError}</p> : null}
          </div>
          <p className="text-sm leading-relaxed text-surface-700">Confirm the billing base and treatment of detention, layover, cancellations and other accessorials in your dispatch agreement. Results are rounded to the nearest cent.</p>
        </div>
        <div className="bg-navy-950 p-6 text-white sm:p-8" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/75">Percentage fee estimate</p>
          <p className="mt-2 mb-6 text-white/90">{selectedEquipment} · {rate === null ? 'Written rate confirmation required' : `${rate}% dispatch rate`}</p>
          {!estimate ? (
            <p className="py-5 text-lg text-white/90">{error} No estimate is shown until the equipment and billing base are confirmed.</p>
          ) : (
            <>
            <p className="mb-6 text-sm leading-relaxed text-white/90">For {selectedEquipment}, {rate}% of the entered {dollars.format(revenueCents / 100)} billing base is a {dollars.format(estimate.feeCents / 100)} dispatch fee.</p>
            <dl className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-white/80">Gross revenue entered</dt>
                <dd className="text-xl font-semibold tabular-nums">{dollars.format(revenueCents / 100)}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-white/80">Dispatch fee ({rate}%)</dt>
                <dd className="text-2xl font-bold tabular-nums">{dollars.format(estimate.feeCents / 100)}</dd>
              </div>
              <div className="border-t border-white/20 pt-5">
                <dt className="mb-2 font-semibold text-white/90">Revenue after dispatch fee, before operating costs</dt>
                <dd className="text-3xl sm:text-4xl font-bold tabular-nums break-words">{dollars.format(estimate.remainingCents / 100)}</dd>
              </div>
            </dl>
            </>
          )}
          <p className="mt-6 text-sm leading-relaxed text-white/80">The remaining revenue is before fuel, insurance, truck payments, factoring, taxes and all other operating costs. It is not profit or an earnings forecast.</p>
        </div>
      </div>
    </section>
  );
}
