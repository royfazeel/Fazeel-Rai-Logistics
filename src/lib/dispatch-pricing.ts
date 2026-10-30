// Published percentage of gross revenue on loads we dispatch.
// Keep website copy and written service terms aligned when changing this schedule.
export const DISPATCH_RATES = {
  'cargo-van': 12,
  'sprinter-van': 5,
  'box-truck': 7,
  hotshot: 6,
  'dry-van': 5,
  flatbed: 5,
  reefer: 4,
  'power-only': 5,
  'step-deck': 5,
  conestoga: 4,
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

export const DISPATCH_PRICING_SUMMARY = `Box trucks: ${getDispatchRateLabel('box-truck')}; dry vans: ${getDispatchRateLabel('dry-van')}; reefers: ${getDispatchRateLabel('reefer')}; flatbeds: ${getDispatchRateLabel('flatbed')}; power only: ${getDispatchRateLabel('power-only')}; step deck: ${getDispatchRateLabel('step-deck')}; hotshot: ${getDispatchRateLabel('hotshot')}; cargo vans: ${getDispatchRateLabel('cargo-van')}; Conestoga trailers: ${getDispatchRateLabel('conestoga')}; Sprinter vans: ${getDispatchRateLabel('sprinter-van')}; all other truck types: ${DEFAULT_DISPATCH_RATE}%.`;
