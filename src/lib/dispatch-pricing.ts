// Published percentage of gross revenue on loads we dispatch.
// Keep website copy and written service terms aligned when changing this schedule.
export const DISPATCH_RATES = {
  'cargo-van': 5,
  'sprinter-van': 5,
  'box-truck': 5,
  hotshot: 4,
  'dry-van': 3,
  flatbed: 3,
  reefer: 3,
  'power-only': 5,
  'step-deck': 5,
  conestoga: 5,
  'rgn-lowboy': 5,
  'car-hauler': 5,
  tanker: 5,
  'dump-truck': 5,
  'curtain-side': 5,
} as const;

export const DEFAULT_DISPATCH_RATE = 5;
const publishedRates = [...Object.values(DISPATCH_RATES), DEFAULT_DISPATCH_RATE];
export const DISPATCH_RATE_RANGE = `${Math.min(...publishedRates)}–${Math.max(...publishedRates)}%`;

export function getDispatchRate(equipment: string): number {
  return Object.prototype.hasOwnProperty.call(DISPATCH_RATES, equipment)
    ? DISPATCH_RATES[equipment as keyof typeof DISPATCH_RATES]
    : DEFAULT_DISPATCH_RATE;
}

export function getDispatchRateLabel(equipment: string): string {
  return `${getDispatchRate(equipment)}%`;
}

export const DISPATCH_PRICING_SUMMARY = `Cargo and Sprinter vans: ${getDispatchRateLabel('cargo-van')}; box trucks: ${getDispatchRateLabel('box-truck')}; hotshot: ${getDispatchRateLabel('hotshot')}; dry vans, flatbeds and reefers: ${getDispatchRateLabel('dry-van')}; all other truck types: ${DEFAULT_DISPATCH_RATE}%.`;
