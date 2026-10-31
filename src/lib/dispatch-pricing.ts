// Percentage points of gross revenue on loads we book (7 means 7%, never USD 7).
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

export type DispatchEquipment = keyof typeof DISPATCH_RATES;
const publishedRates = Object.values(DISPATCH_RATES);
export const DISPATCH_RATE_RANGE = `${Math.min(...publishedRates)}–${Math.max(...publishedRates)}%`;
export const DISPATCH_FEE_POLICY = 'Rai Dispatch uses percentage-only pricing for every truck type. There are no setup fees, fixed weekly or monthly charges, or other Rai Dispatch fees.';
// Conditional published information only: never use this as a calculator fallback.
export const OTHER_EQUIPMENT_PUBLISHED_RATE = 5;
export const OTHER_EQUIPMENT_NOTICE = `Other truck types have a published ${OTHER_EQUIPMENT_PUBLISHED_RATE}% fee, subject to service availability and written rate confirmation. Select a listed type or request confirmation before calculating a fee.`;

export function isDispatchEquipment(value: unknown): value is DispatchEquipment {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(DISPATCH_RATES, value);
}

export function getDispatchRate(equipment: DispatchEquipment): number;
export function getDispatchRate(equipment: string): number | null;
export function getDispatchRate(equipment: string): number | null {
  return isDispatchEquipment(equipment) ? DISPATCH_RATES[equipment] : null;
}

export function getDispatchRateLabel(equipment: string): string {
  const rate = getDispatchRate(equipment);
  return rate === null ? 'Quote required' : `${rate}%`;
}

const equipmentNouns: Record<DispatchEquipment, string> = {
  'box-truck': 'box trucks', 'dry-van': 'dry vans', reefer: 'reefers', flatbed: 'flatbeds',
  'power-only': 'power only', 'step-deck': 'step decks', hotshot: 'hotshots',
  'cargo-van': 'cargo vans', 'sprinter-van': 'Sprinter vans', conestoga: 'Conestoga trailers',
  'rgn-lowboy': 'RGN and lowboy trailers', 'car-hauler': 'car haulers', tanker: 'tankers',
  'dump-truck': 'dump trucks and trailers', 'curtain-side': 'curtain-side trailers',
};

function feeGroup(equipment: DispatchEquipment[]): string {
  const groups = new Map<number, string[]>();
  equipment.forEach(key => groups.set(DISPATCH_RATES[key], [...(groups.get(DISPATCH_RATES[key]) ?? []), equipmentNouns[key]]));
  return [...groups].map(([rate, names]) => `${rate}% for ${names.length < 2 ? names[0] : `${names.slice(0, -1).join(', ')}${names.length > 2 ? ',' : ''} and ${names[names.length - 1]}`}`).join(' and ');
}

export const DISPATCH_FEES_ANSWER = `Dispatch fees are ${getDispatchRateLabel('box-truck')} for box trucks, ${getDispatchRateLabel('hotshot')} for hotshots, ${feeGroup(['reefer', 'conestoga'])}, ${getDispatchRateLabel('cargo-van')} for cargo vans, and ${feeGroup(['dry-van', 'flatbed', 'power-only', 'step-deck', 'sprinter-van', 'rgn-lowboy', 'car-hauler', 'tanker', 'dump-truck', 'curtain-side'])}. Fees apply to gross revenue on loads we book. ${DISPATCH_FEE_POLICY} Confirm the applicable equipment category, billing base and service scope in writing.`;
// Existing callers share the same answer instead of carrying a second rate summary.
export const DISPATCH_PRICING_SUMMARY = DISPATCH_FEES_ANSWER;
export const VAN_CATEGORY_NOTICE = `Cargo vans are listed at ${getDispatchRateLabel('cargo-van')} and Sprinter vans at ${getDispatchRateLabel('sprinter-van')}. Confirm which service category applies to your vehicle before onboarding.`;

export function getEquipmentFeeStatement(equipment: string): string {
  if (!isDispatchEquipment(equipment)) return OTHER_EQUIPMENT_NOTICE;
  const opening = `Rai Dispatch charges ${getDispatchRateLabel(equipment)} of gross revenue on loads we book for ${equipmentNouns[equipment]}.`;
  if (equipment === 'cargo-van') return `${opening} The separately listed Sprinter van dispatch service is priced at ${getDispatchRateLabel('sprinter-van')}. Confirm which service category applies to your vehicle before onboarding.`;
  if (equipment === 'sprinter-van') return `${opening} The separately listed cargo van dispatch service is priced at ${getDispatchRateLabel('cargo-van')}. Confirm which service category applies to your vehicle before onboarding.`;
  return `${opening} Confirm the billing base and service scope in writing before onboarding.`;
}

export function getEquipmentOfferDescription(equipment: string): string {
  if (!isDispatchEquipment(equipment)) return OTHER_EQUIPMENT_NOTICE;
  const opening = `${getDispatchRateLabel(equipment)} of gross revenue on loads Rai Dispatch books for ${equipmentNouns[equipment]}.`;
  const categoryNote = equipment === 'cargo-van' || equipment === 'sprinter-van' ? ` ${VAN_CATEGORY_NOTICE}` : '';
  return `${opening}${categoryNote} ${DISPATCH_FEE_POLICY} Confirm the billing base and service scope in writing before onboarding.`;
}
