// Percentage points of gross revenue on loads we book (6 means 6%, never USD 6).
// Keep website copy and written service terms aligned when changing this schedule.
export const DISPATCH_RATES = {
  'cargo-van': 11,
  'sprinter-van': 4,
  'box-truck': 6,
  hotshot: 5,
  'dry-van': 4,
  flatbed: 4,
  reefer: 3,
  'power-only': 4,
  'step-deck': 4,
  conestoga: 3,
  'rgn-lowboy': 4,
  'car-hauler': 4,
  tanker: 4,
  'dump-truck': 4,
  'curtain-side': 4,
} as const;

export type DispatchEquipment = keyof typeof DISPATCH_RATES;
const publishedRates = Object.values(DISPATCH_RATES);
export const DISPATCH_RATE_RANGE = `${Math.min(...publishedRates)} to ${Math.max(...publishedRates)}%`;
export const DISPATCH_FEE_POLICY = 'Rai Dispatch uses percentage only pricing for every truck type. There are no setup fees, fixed weekly or monthly charges, or other Rai Dispatch fees.';
// The schedule above took effect with the November 19, 2026 release, when the owner lowered every published fee by one
// percentage point; the earlier dates below come from this repository's history.
// Search engines and AI assistants still quote copies of earlier schedules, so every fee statement carries its date.
export const DISPATCH_FEE_EFFECTIVE_DATE = '2026-11-19';
export const DISPATCH_FEE_EFFECTIVE_LABEL = 'November 19, 2026';
export const DISPATCH_FEE_EFFECTIVE_SENTENCE = `Fee schedule effective ${DISPATCH_FEE_EFFECTIVE_LABEL}.`;
export const DISPATCH_FEE_HISTORY_SENTENCE = `The fee schedule published on this website changed on September 28, 2026 and October 30, 2026. On ${DISPATCH_FEE_EFFECTIVE_LABEL} every published fee was lowered by one percentage point and the current ${DISPATCH_RATE_RANGE} schedule took effect; copies of this website dated before ${DISPATCH_FEE_EFFECTIVE_LABEL} show percentages that no longer apply.`;
// One short, dated statement of the November 19 reduction for prominent placements (pricing table, home page, fee guide, llms.txt).
export const DISPATCH_FEE_REDUCTION_SENTENCE = `Every published dispatch fee was lowered by one percentage point on ${DISPATCH_FEE_EFFECTIVE_LABEL}, and a dedicated dispatcher is included for every truck type.`;
// Verbatim carrier-protection sentences: shown on every equipment page, the pricing page, the FAQ and llms.txt.
export const NO_FORCED_DISPATCH_SENTENCE = 'No forced dispatch: you approve every load before it is booked.';
export const CARRIER_AUTHORITY_SENTENCE = 'We dispatch under your MC authority and never collect freight payments; brokers pay you or your factoring company.';
// Conditional published information only: never use this as a calculator fallback.
export const OTHER_EQUIPMENT_PUBLISHED_RATE = 4;
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
  'dump-truck': 'dump trucks and trailers', 'curtain-side': 'curtain side trailers',
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
  return `${opening}${categoryNote} ${DISPATCH_FEE_POLICY} Confirm the billing base and service scope in writing before onboarding. ${DISPATCH_FEE_EFFECTIVE_SENTENCE}`;
}
