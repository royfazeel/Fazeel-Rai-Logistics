'use client';

import { useId, useState } from 'react';
import { EQUIPMENT_TYPES } from '@/lib/constants';
import { getDispatchRate } from '@/lib/dispatch-pricing';
import { calculateLoadEconomics, DEFAULT_LOAD_EQUIPMENT, EXAMPLE_LOAD, normalizeEquipmentSelection } from '@/lib/load-economics';
import type { LoadEquipment, LoadNumberField } from '@/lib/load-economics';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const fields: { key: LoadNumberField; label: string; help: string }[] = [
  { key: 'loadPay', label: 'Agreed load pay (USD)', help: 'Enter the full agreed pay for this load. This worksheet applies the dispatch percentage to all pay entered.' },
  { key: 'loadedMiles', label: 'Loaded miles', help: 'Distance traveled with the shipment. Must be greater than zero.' },
  { key: 'emptyMiles', label: 'Empty / deadhead miles', help: 'Include the empty drive to pickup and any repositioning you want this trip to cover.' },
  { key: 'mpg', label: 'Fuel economy (miles per gallon)', help: 'Use your own truck’s expected average for this trip, including loaded and empty travel.' },
  { key: 'fuelPrice', label: 'Fuel price (USD per gallon)', help: 'Enter your expected pump price. Up to three decimals, such as 3.999.' },
  { key: 'otherCosts', label: 'Other trip costs (USD)', help: 'Add costs you want to recover: tolls, driver pay, parking, maintenance allowance or allocated overhead. Do not include fuel or dispatch twice.' },
  { key: 'totalHours', label: 'Total trip hours (optional)', help: 'Include driving, loading, unloading and waiting time. Leave blank to hide the hourly comparison.' },
];
const inputClass = 'min-h-[48px] w-full rounded-lg border border-surface-400 bg-white px-4 py-3 text-base text-navy-950 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/30';

export default function LoadProfitCalculator({ initialEquipment = DEFAULT_LOAD_EQUIPMENT }: { initialEquipment?: LoadEquipment }) {
  const id = useId();
  const [input, setInput] = useState({ ...EXAMPLE_LOAD, equipment: initialEquipment });
  const result = calculateLoadEconomics(input);
  const equipmentName = EQUIPMENT_TYPES.find(equipment => equipment.id === input.equipment)?.name ?? 'Other truck type';
  const equipmentSummary = `${equipmentName} · ${getDispatchRate(input.equipment)}% dispatch fee`;
  const errors: Partial<Record<LoadNumberField, string>> = result.valid ? {} : result.errors;
  const summary = result.valid
    ? `${equipmentSummary}. ${currency.format(result.remainingCents / 100)} remains after entered costs. Break-even load pay is ${currency.format(result.breakEvenCents / 100)} for those costs only.`
    : 'Correct the highlighted inputs to calculate this trip.';

  return (
    <section aria-labelledby={`${id}-heading`} className="rounded-xl border border-surface-300 bg-white shadow-sm">
      <div className="border-b border-surface-200 p-6 sm:p-8">
        <p className="eyebrow">Your truck. Your inputs.</p>
        <h2 id={`${id}-heading`} className="section-heading">Compare a load with the costs of the whole trip.</h2>
        <p className="mt-4 max-w-3xl leading-7 text-surface-700">The starting numbers are an illustrative example, not market rates or an earnings forecast. Replace them with your own estimates. Results update as you type and stay in this browser.</p>
      </div>
      <div className="grid items-start lg:grid-cols-[1.15fr_1fr]">
        <form onSubmit={event => event.preventDefault()} className="space-y-6 p-6 sm:p-8" aria-label="Load cost inputs">
          <div>
            <label htmlFor={`${id}-equipment`} className="mb-2 block font-semibold text-navy-950">Truck or equipment type</label>
            <select id={`${id}-equipment`} value={input.equipment} onChange={event => setInput(previous => ({ ...previous, equipment: normalizeEquipmentSelection(event.target.value) }))} className={inputClass} aria-describedby={`${id}-equipment-help`}>
              {EQUIPMENT_TYPES.map(equipment => <option key={equipment.id} value={equipment.id}>{equipment.name} — {getDispatchRate(equipment.id)}%</option>)}
              <option value="other">Other truck type — {getDispatchRate('other')}%</option>
            </select>
            <p id={`${id}-equipment-help`} className="mt-2 text-sm leading-6 text-surface-700">Uses Rai Dispatch’s published equipment percentage on the load pay entered.</p>
          </div>
          {fields.map(field => <div key={field.key}>
            <label htmlFor={`${id}-${field.key}`} className="mb-2 block font-semibold text-navy-950">{field.label}</label>
            <input id={`${id}-${field.key}`} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={24} value={input[field.key]} onChange={event => setInput(previous => ({ ...previous, [field.key]: event.target.value }))} className={inputClass} aria-invalid={Boolean(errors[field.key])} aria-describedby={`${id}-${field.key}-help${errors[field.key] ? ` ${id}-${field.key}-error` : ''}`} />
            <p id={`${id}-${field.key}-help`} className="mt-2 text-sm leading-6 text-surface-700">{field.help}</p>
            {errors[field.key] ? <p id={`${id}-${field.key}-error`} className="mt-2 text-sm font-semibold text-primary-700">{errors[field.key]}</p> : null}
          </div>)}
          <div>
            <button type="button" className="min-h-[44px] rounded-lg border border-surface-400 px-5 py-3 font-semibold text-navy-900 hover:border-primary-600 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600" onClick={() => setInput(previous => ({ ...EXAMPLE_LOAD, equipment: previous.equipment }))}>Reset example values</button>
            <p className="mt-2 text-sm leading-6 text-surface-700">Keeps your selected equipment and resets the illustrative trip inputs.</p>
          </div>
        </form>
        <div className="rounded-b-xl bg-navy-950 p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:rounded-bl-none">
          <p className="eyebrow">Load cost estimate</p>
          <p className="mb-5 text-lg font-semibold">{equipmentSummary}</p>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{summary}</p>
          {result.valid ? <>
            <dl className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Total trip miles</dt><dd className="font-semibold tabular-nums">{number.format(result.totalMiles)}</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Empty miles share</dt><dd className="font-semibold tabular-nums">{number.format(result.emptyMilesPercent)}%</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Gross per loaded mile</dt><dd className="font-semibold tabular-nums">{currency.format(result.grossPerLoadedMile)}</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Gross per total mile</dt><dd className="font-semibold tabular-nums">{currency.format(result.grossPerAllMile)}</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-white/20 pt-4"><dt className="text-white/80">Load pay entered</dt><dd className="font-semibold tabular-nums">{currency.format(result.loadPayCents / 100)}</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Dispatch fee ({result.dispatchRate}%)</dt><dd className="font-semibold tabular-nums">{currency.format(result.dispatchFeeCents / 100)}</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Estimated fuel ({number.format(result.gallons)} gal)</dt><dd className="font-semibold tabular-nums">{currency.format(result.fuelCostCents / 100)}</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Other costs entered</dt><dd className="font-semibold tabular-nums">{currency.format(result.otherCostsCents / 100)}</dd></div>
              <div className="border-t border-white/20 pt-5"><dt className="text-lg font-semibold">Remaining after entered costs</dt><dd className="mt-2 break-words font-display text-4xl font-bold tabular-nums sm:text-5xl">{currency.format(result.remainingCents / 100)}</dd></div>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Remaining per total mile</dt><dd className="font-semibold tabular-nums">{currency.format(result.remainingPerAllMile)}</dd></div>
              {result.remainingPerHour !== null ? <div className="flex flex-wrap items-baseline justify-between gap-2"><dt className="text-white/80">Remaining per trip hour</dt><dd className="font-semibold tabular-nums">{currency.format(result.remainingPerHour)}</dd></div> : null}
              <div className="border-t border-white/20 pt-5"><dt className="font-semibold">Break-even load pay for entered costs</dt><dd className="mt-2 font-display text-3xl font-bold tabular-nums">{currency.format(result.breakEvenCents / 100)}<span className="mt-1 block font-sans text-sm font-normal text-white/80">{currency.format(result.breakEvenPerAllMile)} per total trip mile</span></dd></div>
            </dl>
            {result.remainingCents < 0 ? <p className="mt-6 rounded-lg border border-primary-400 bg-primary-950 p-4 text-sm leading-6">The load pay does not cover the dispatch fee, fuel and other costs entered. Review the offered pay, empty miles and cost assumptions before deciding.</p> : null}
          </> : <p className="py-5 text-lg leading-7">{summary} No estimate is shown while an input is invalid.</p>}
          <p className="mt-6 text-sm leading-7 text-white/85"><strong>This is not net profit.</strong> Insurance, truck payments, maintenance, driver pay, factoring, taxes and other expenses are excluded unless you include them in other trip costs. Percentage-based costs beyond dispatch need a separate calculation. Break-even covers only the costs entered, with the same dispatch percentage.</p>
          <p className="mt-4 text-sm leading-7 text-white/85">All entered load pay is treated as fee-bearing. If your dispatch agreement excludes some charges or uses a different revenue base, calculate that fee separately; this estimate does not model the difference.</p>
        </div>
      </div>
    </section>
  );
}
