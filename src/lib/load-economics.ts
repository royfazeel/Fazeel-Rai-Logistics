import { getDispatchRate, isDispatchEquipment, OTHER_EQUIPMENT_NOTICE } from './dispatch-pricing';
import type { DispatchEquipment } from './dispatch-pricing';

export type LoadEquipment = DispatchEquipment | 'other' | '';
export const DEFAULT_LOAD_EQUIPMENT: LoadEquipment = 'dry-van';

/** Only one recognized equipment query value may select the starting example. */
export function normalizeEquipmentSelection(value: string | string[] | undefined): LoadEquipment {
  if (value === undefined) return DEFAULT_LOAD_EQUIPMENT;
  return value === 'other' || isDispatchEquipment(value) ? value : '';
}

export type LoadEconomicsInput = {
  equipment: string;
  loadPay: string;
  loadedMiles: string;
  emptyMiles: string;
  totalHours: string;
  fuelPrice: string;
  mpg: string;
  otherCosts: string;
};

export type LoadNumberField = Exclude<keyof LoadEconomicsInput, 'equipment'>;

export const EXAMPLE_LOAD: LoadEconomicsInput = {
  equipment: DEFAULT_LOAD_EQUIPMENT, loadPay: '2000', loadedMiles: '800', emptyMiles: '100',
  totalHours: '20', fuelPrice: '4.00', mpg: '6', otherCosts: '150',
};

const rules: Record<LoadNumberField, { label: string; decimals: number; max: number; positive?: boolean; optional?: boolean }> = {
  loadPay: { label: 'Load pay', decimals: 2, max: 1_000_000 },
  loadedMiles: { label: 'Loaded miles', decimals: 2, max: 100_000, positive: true },
  emptyMiles: { label: 'Empty miles', decimals: 2, max: 100_000 },
  totalHours: { label: 'Total trip hours', decimals: 2, max: 10_000, positive: true, optional: true },
  fuelPrice: { label: 'Fuel price', decimals: 3, max: 100 },
  mpg: { label: 'Fuel economy', decimals: 2, max: 100, positive: true },
  otherCosts: { label: 'Other trip costs', decimals: 2, max: 1_000_000 },
};

export type LoadEconomicsResult = {
  valid: true;
  dispatchRate: number;
  loadPayCents: number;
  totalMiles: number;
  emptyMilesPercent: number;
  gallons: number;
  grossPerLoadedMile: number;
  grossPerAllMile: number;
  dispatchFeeCents: number;
  fuelCostCents: number;
  otherCostsCents: number;
  remainingCents: number;
  remainingPerAllMile: number;
  remainingPerHour: number | null;
  breakEvenCents: number;
  breakEvenPerAllMile: number;
} | { valid: false; errors: Partial<Record<keyof LoadEconomicsInput, string>> };

/** Calculates only the costs entered; it is not a complete business profit model. */
export function calculateLoadEconomics(input: LoadEconomicsInput): LoadEconomicsResult {
  const errors: Partial<Record<keyof LoadEconomicsInput, string>> = {};
  const dispatchRate = getDispatchRate(input.equipment);
  if (dispatchRate === null) errors.equipment = input.equipment === 'other' ? OTHER_EQUIPMENT_NOTICE : 'Choose a listed equipment type before calculating a dispatch fee.';
  const values = {} as Record<LoadNumberField, number>;
  for (const field of Object.keys(rules) as LoadNumberField[]) {
    const rule = rules[field];
    const raw = input[field].trim();
    if (!raw && rule.optional) { values[field] = 0; continue; }
    const pattern = new RegExp(`^(?:\\d+|\\d{1,3}(?:,\\d{3})+)(?:\\.\\d{1,${rule.decimals}})?$`);
    const value = Number(raw.replace(/,/g, ''));
    if (!raw) errors[field] = `Enter ${rule.label.toLowerCase()}.`;
    else if (!pattern.test(raw) || !Number.isFinite(value)) errors[field] = `Use a number zero or greater with up to ${rule.decimals} decimal places.`;
    else if (rule.positive && value <= 0) errors[field] = `${rule.label} must be greater than zero.`;
    else if (value > rule.max) errors[field] = `${rule.label} must be ${rule.max.toLocaleString('en-US')} or less.`;
    else values[field] = value;
  }
  if (dispatchRate === null || Object.keys(errors).length) return { valid: false, errors };

  const loadPayCents = Math.round(values.loadPay * 100);
  const totalMiles = values.loadedMiles + values.emptyMiles;
  const gallons = totalMiles / values.mpg;
  const fuelDollars = gallons * values.fuelPrice;
  // Absorb floating-point representation error at a half-cent boundary.
  const fuelCostCents = Math.round((fuelDollars + Number.EPSILON * Math.max(1, fuelDollars)) * 100);
  const dispatchFeeCents = Math.round(loadPayCents * dispatchRate / 100);
  const otherCostsCents = Math.round(values.otherCosts * 100);
  const remainingCents = loadPayCents - dispatchFeeCents - fuelCostCents - otherCostsCents;
  // Round the unrounded percentage model upward to avoid understating the quote.
  const breakEvenCents = Math.ceil((fuelCostCents + otherCostsCents) * 100 / (100 - dispatchRate));
  return {
    valid: true, dispatchRate, loadPayCents, totalMiles,
    emptyMilesPercent: values.emptyMiles / totalMiles * 100,
    gallons, grossPerLoadedMile: values.loadPay / values.loadedMiles,
    grossPerAllMile: values.loadPay / totalMiles, dispatchFeeCents, fuelCostCents,
    otherCostsCents, remainingCents, remainingPerAllMile: remainingCents / 100 / totalMiles,
    remainingPerHour: values.totalHours ? remainingCents / 100 / values.totalHours : null,
    breakEvenCents, breakEvenPerAllMile: breakEvenCents / 100 / totalMiles,
  };
}
