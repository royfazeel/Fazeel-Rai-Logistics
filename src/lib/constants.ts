import { CARRIER_AUTHORITY_SENTENCE, DISPATCH_FEES_ANSWER, DISPATCH_FEE_EFFECTIVE_SENTENCE, DISPATCH_FEE_HISTORY_SENTENCE, DISPATCH_RATE_RANGE, NO_FORCED_DISPATCH_SENTENCE, getDispatchRateLabel } from './dispatch-pricing';

export const ACTIVE_CARRIER_SUPPORT = '24/7 live dispatch support for active carriers';

export const BUSINESS = {
  name: 'Rai Dispatch',
  parentCompany: 'Rai Technologies LLC',
  phone: '(213) 371-6155',
  phoneHref: 'tel:+12133716155',
  // SMS uses sms: protocol with body= for prefilled message (works on iOS & Android)
  smsHref: 'sms:+12133716155?body=Hi%20Rai%20Dispatch%2C%20I%27m%20interested%20in%20dispatch%20services.',
  // WhatsApp deep link (wa.me) — falls back to web if no app installed
  whatsappHref: 'https://wa.me/12133716155?text=Hi%20Rai%20Dispatch%2C%20I%27m%20interested%20in%20dispatch%20services.',
  email: 'sam@railogistics.us',
  emailHref: 'mailto:sam@railogistics.us',
  socialProfiles: [
    { name: 'X', handle: '@RaiDispatchUS', url: 'https://x.com/RaiDispatchUS' },
    { name: 'Instagram', handle: '@raidispatchus', url: 'https://www.instagram.com/raidispatchus/' },
    { name: 'Facebook', handle: 'Rai Dispatch', url: 'https://www.facebook.com/profile.php?id=61596149968228' },
  ],
  address: {
    street: '312 W 2nd St, Ste 5083',
    city: 'Casper',
    state: 'WY',
    zip: '82601',
    full: '312 W 2nd St, Ste 5083, Casper, WY 82601',
  },
  hours: {
    days: 'Monday to Saturday',
    time: '8:00 AM to 6:00 PM CT',
    note: 'New carrier setup and onboarding hours. Active carriers use their agreed dispatch contact for 24/7 live support.',
  },
  serviceArea: 'All 48 contiguous United States',
  tagline: 'Professional Truck Dispatching Services',
  description: `Truck dispatch for owner operators and fleets across the 48 contiguous states. A dedicated dispatcher for every truck, ${ACTIVE_CARRIER_SUPPORT}, free setup, and ${DISPATCH_RATE_RANGE} of gross revenue on loads we book. Support for 15 truck and trailer types.`,
} as const;

// These hours apply to new-carrier setup; active-carrier live support is 24/7.
export const SETUP_DESK_HOURS = `${BUSINESS.hours.days}, ${BUSINESS.hours.time}`;

// Locally hosted media. Muted inline playback is deferred on every screen size;
// motion/data preferences keep the poster until the visitor chooses Play.
export const MEDIA = {
  heroVideo: {
    src: '/video/hero-highway-hd.mp4',
    poster: '/video/hero-highway.jpg',
  },
  ctaVideo: {
    src: '/video/cta-highway.mp4',
    poster: '/video/cta-highway.jpg',
  },
  highwayPhoto: '/video/hero-highway.jpg',
} as const;

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Equipment', href: '/equipment' },
  { name: 'Carriers', href: '/carriers' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Resources', href: '/resources' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
] as const;

// Equipment we dispatch + dispatch fee (percentage of gross).
//
// Numeric pricing lives in dispatch-pricing.ts; this list supplies equipment copy.
export const EQUIPMENT_TYPES = [
  {
    id: 'box-truck',
    name: 'Box Trucks',
    percentage: getDispatchRateLabel('box-truck'),
    description: 'Specialized dispatch for box truck operations, from local deliveries to long haul routes.',
    benefits: ['Local & regional loads', 'Capacity based load matching', 'Flexible scheduling'],
  },
  {
    id: 'dry-van',
    name: 'Dry Vans',
    percentage: getDispatchRateLabel('dry-van'),
    description: 'Dry van dispatch for regional and over the road carriers hauling general freight.',
    benefits: ['Coast to coast lane planning', 'Equipment matched load search', 'Rate negotiation support'],
  },
  {
    id: 'reefer',
    name: 'Reefers',
    percentage: getDispatchRateLabel('reefer'),
    description: 'Temperature controlled freight dispatch with time sensitive load expertise.',
    benefits: ['Temperature instruction review', 'Reefer lane planning', 'Appointment coordination'],
  },
  {
    id: 'flatbed',
    name: 'Flatbeds',
    percentage: getDispatchRateLabel('flatbed'),
    description: 'Dedicated dispatching for flatbed operators with specialized load matching.',
    benefits: ['Specialized cargo support', 'Tarping and securement review', 'Equipment specific matching'],
  },
  {
    id: 'power-only',
    name: 'Power Only',
    percentage: getDispatchRateLabel('power-only'),
    description: 'Power only dispatch for tractors hauling trailers provided by brokers or shippers, subject to carrier eligibility.',
    benefits: ['Drop and hook freight', 'Trailer requirements review', 'Pickup appointment coordination'],
  },
  {
    id: 'step-deck',
    name: 'Step Decks',
    percentage: getDispatchRateLabel('step-deck'),
    description: 'Step deck dispatch for taller freight, machinery, and equipment within your trailer and authority limits.',
    benefits: ['Deck height load matching', 'Dimensions reviewed before booking', 'Open deck lane planning'],
  },
  {
    id: 'hotshot',
    name: 'Hotshot Trucks',
    percentage: getDispatchRateLabel('hotshot'),
    description: 'Hotshot dispatch based on your truck, trailer, payload, operating authority, and preferred radius.',
    benefits: ['Partial load opportunities', 'Payload and length matching', 'Regional and expedited lanes'],
  },
  {
    id: 'cargo-van',
    name: 'Cargo Vans',
    percentage: getDispatchRateLabel('cargo-van'),
    description: 'Cargo van dispatch built around usable dimensions, payload and suitable expedited freight.',
    benefits: ['Interior dimensions reviewed', 'Expedited freight search', 'Availability confirmed by lane'],
  },
  {
    id: 'sprinter-van',
    name: 'Sprinter Vans',
    percentage: getDispatchRateLabel('sprinter-van'),
    description: 'Separately listed Sprinter van dispatch. Confirm your vehicle’s service category, usable space and delivery requirements before onboarding.',
    benefits: ['Door and interior measurements', 'Payload based load review', 'Expedited scheduling'],
  },
  {
    id: 'conestoga',
    name: 'Conestoga Trailers',
    percentage: getDispatchRateLabel('conestoga'),
    description: 'Dispatch for rolling tarp trailers, with cargo clearance and loading access checked before booking.',
    benefits: ['Covered open deck freight', 'Tarp system clearance review', 'Loading access coordination'],
  },
  {
    id: 'rgn-lowboy',
    name: 'RGN & Lowboy Trailers',
    percentage: getDispatchRateLabel('rgn-lowboy'),
    description: 'Equipment first review for low deck and removable gooseneck operations, subject to load and permit requirements.',
    benefits: ['Deck and ramp fit reviewed', 'Cargo dimensions clarified', 'Specialized scope confirmed'],
  },
  {
    id: 'car-hauler',
    name: 'Car Haulers',
    percentage: getDispatchRateLabel('car-hauler'),
    description: 'Vehicle transport dispatch review around usable positions, loading capability and pickup condition records.',
    benefits: ['Vehicle and trailer fit', 'Pickup and delivery sequencing', 'Condition document coordination'],
  },
  {
    id: 'tanker',
    name: 'Tankers',
    percentage: getDispatchRateLabel('tanker'),
    description: 'A service fit review for liquid and bulk operations, with commodity compatibility and handling requirements clarified.',
    benefits: ['Commodity and tank review', 'Cleaning requirements checked', 'Carrier eligibility confirmed'],
  },
  {
    id: 'dump-truck',
    name: 'Dump Trucks & Trailers',
    percentage: getDispatchRateLabel('dump-truck'),
    description: 'Dispatch review for bulk material hauling based on body type, payload, site access and the operating area.',
    benefits: ['Body and material matching', 'Loading site access review', 'Operating radius planning'],
  },
  {
    id: 'curtain-side',
    name: 'Curtain Side Trailers',
    percentage: getDispatchRateLabel('curtain-side'),
    description: 'Curtain side dispatch with side loading access, cargo dimensions and protection requirements reviewed.',
    benefits: ['Side access load review', 'Usable space and payload', 'Handling instructions clarified'],
  },
] as const;

// The nine dispatch specialties confirmed by the business owner.
export const DISPATCH_SPECIALTY_IDS = ['box-truck', 'dry-van', 'reefer', 'flatbed', 'power-only', 'step-deck', 'hotshot', 'cargo-van', 'conestoga'] as const;
export const DISPATCH_SPECIALTIES = EQUIPMENT_TYPES.filter(equipment => DISPATCH_SPECIALTY_IDS.some(id => id === equipment.id));
export const DISPATCH_SPECIALTY_SUMMARY = 'box trucks, dry vans, reefers, flatbeds, power only tractors, step decks, hotshot trucks, cargo vans and Conestoga trailers';

export const SERVICES = [
  {
    id: 'rate-negotiation',
    title: 'Rate Negotiation',
    description: 'We discuss load rates, deadhead, fuel costs, and accessorial terms with brokers before you approve a load.',
    icon: 'DollarSign',
  },
  {
    id: 'load-booking',
    title: 'Load Booking',
    description: 'We search available freight, review broker requirements, and book loads that fit your equipment and preferences.',
    icon: 'Package',
  },
  {
    id: 'broker-communication',
    title: 'Broker Communication',
    description: 'We coordinate agreed broker updates, load instructions and rate confirmation questions, with carrier approval for material changes.',
    icon: 'MessageSquare',
  },
  {
    id: 'route-strategy',
    title: 'Route & Lane Strategy',
    description: 'Plan regional and OTR lanes around empty miles, reload options, operating costs, and time at home.',
    icon: 'Route',
  },
  {
    id: 'paperwork-support',
    title: 'Paperwork Support',
    description: 'We help organize carrier packets, rate confirmations, BOLs and PODs, and follow up on missing dispatch documents.',
    icon: 'FileText',
  },
  {
    id: 'scheduling',
    title: 'Scheduling & Follow ups',
    description: 'Appointment scheduling, check calls, and proactive communication to keep loads moving.',
    icon: 'Calendar',
  },
] as const;

export const FAQS = [
  { id: 1, question: 'How much does a truck dispatch service cost?', answer: DISPATCH_FEES_ANSWER },
  { id: 2, question: 'What documents do I need to get started?', answer: 'Prepare your operating authority details where applicable, Certificate of Insurance, W-9, equipment specifications, and a signed dispatch agreement. A factoring notice of assignment may also be needed. Broker requirements vary by load and carrier.' },
  { id: 3, question: 'Where do you provide truck dispatch services?', answer: 'We support carriers across the 48 contiguous United States. Tell us whether you prefer local, regional, dedicated, or over the road work. Load availability depends on your equipment, authority, location, and the market.' },
  { id: 4, question: 'Which truck and trailer types can you dispatch?', answer: 'We specialize in dispatching box trucks, dry vans, reefers, flatbeds, power only tractors, step decks, hotshot trucks, cargo vans and Conestoga trailers. We also review Sprinter vans and other listed equipment. Actual equipment, lane and load requirements are confirmed before booking.' },
  { id: 5, question: 'Do I have to accept every load?', answer: `No. ${NO_FORCED_DISPATCH_SENTENCE} We present the rate, pickup and delivery details, equipment requirements, and route considerations so you can decide before booking.` },
  { id: 6, question: 'Do you work with new authorities and owner operators?', answer: 'Owner operators, small fleets, and carriers with new authority can discuss their setup with us. Each broker sets its own authority age, insurance, safety, and equipment requirements, so not every load will be available to every carrier.' },
  { id: 7, question: 'How do you find loads for my truck?', answer: 'We search load boards and available broker freight, review lane fit and carrier requirements, negotiate terms, and present suitable options for your approval. We consider loaded and empty miles as well as pickup and delivery schedules.' },
  { id: 8, question: 'Are freight rates or weekly earnings guaranteed?', answer: 'No. Freight availability, load rates, operating costs, and weekly revenue change with equipment, markets, hours available, and the loads you accept. Dispatch support helps you evaluate opportunities; it does not guarantee a particular income.' },
  { id: 9, question: 'Will I have a dedicated dispatcher?', answer: 'Yes. Rai Dispatch assigns a dedicated dispatcher for every truck, with load planning around its equipment, preferred lanes, schedule and load criteria. Active carriers receive 24/7 live dispatch support through their agreed contact and escalation process. Confirm contact details and backup arrangements during free setup.' },
  { id: 10, question: 'Do you help with detention and layover requests?', answer: 'We help document arrival and departure times and request eligible detention or layover pay under the agreed load terms. Payment depends on the broker or shipper agreement and supporting documentation.' },
  { id: 11, question: 'Is dispatch support available 24/7?', answer: `Yes. Rai Dispatch provides ${ACTIVE_CARRIER_SUPPORT}. Active carriers should use the dispatch contact and escalation process agreed during onboarding. New carrier setup desk hours are ${SETUP_DESK_HOURS}.` },
  { id: 12, question: 'Do you handle rate confirmations and factoring paperwork?', answer: 'We assist with carrier packets, rate confirmations, bills of lading, proof of delivery, and communication with your chosen factoring provider. The carrier remains responsible for accurate records and compliance.' },
  { id: 13, question: 'How quickly can dispatch begin?', answer: 'We review your documents, equipment, lanes, and broker eligibility during onboarding. Timing depends on complete paperwork and suitable freight availability. Call the dispatch desk for a realistic start date.' },
  { id: 14, question: 'Can I cancel dispatch services?', answer: 'Services are offered without a long term commitment. Follow the notice and outstanding payment requirements in your signed dispatch agreement. Review those terms before starting.' },
  { id: 15, question: 'Does Rai Dispatch work under its own authority or handle freight payments?', answer: `No. ${CARRIER_AUTHORITY_SENTENCE} Rai Dispatch is a dispatch service for motor carriers, not a freight broker or a carrier, and it is paid only by the carrier under the written dispatch agreement.` },
  { id: 16, question: 'When did the current dispatch fee schedule take effect?', answer: `${DISPATCH_FEE_EFFECTIVE_SENTENCE} ${DISPATCH_FEE_HISTORY_SENTENCE} The pricing page and each equipment page show the current percentage for that truck type.` },
] as const;

export const STATS = [
  { label: 'Fees by truck type', value: DISPATCH_RATE_RANGE.replace('%', ''), prefix: '', suffix: '%' },
  { label: 'Contiguous states', value: '48', prefix: '', suffix: '' },
  { label: 'Equipment types', value: String(EQUIPMENT_TYPES.length), prefix: '', suffix: '' },
  { label: 'Live support for active carriers', value: '24', prefix: '', suffix: '/7' },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Quick Setup Call',
    description: 'Call us and we will gather your MC info, insurance, and preferences. We confirm document requirements and a realistic start date.',
  },
  {
    step: 2,
    title: 'Dispatch & Negotiation',
    description: 'Your dedicated dispatcher finds loads, negotiates rates, and books freight that fits your goals.',
  },
  {
    step: 3,
    title: 'Confirmations & Paperwork',
    description: 'We handle rate confirmations, broker communication, and ensure all documentation is complete.',
  },
  {
    step: 4,
    title: 'Weekly Optimization',
    description: 'Review booked loads, empty miles, time at home, and next week lane preferences together.',
  },
] as const;

// Plain-language scope of the dispatch relationship.
export const SCOPE_CLARITY = {
  weAre: [
    'A dispatch services company working under YOUR MC authority',
    'Your dedicated load finder, rate negotiator, and broker liaison',
    'Paid by you, working only for your interests',
    'Transparent about every fee: no surprise charges',
  ],
  weArent: [
    'Not a motor carrier: you keep your authority and equipment',
    'Not a freight broker: we do not buy and resell freight',
    'Not a factoring company: keep your existing factor or work without one',
    'Not a long contract trap: month to month with proper notice',
  ],
} as const;

// Published onboarding and billing commitments.
export const RISK_REVERSAL = {
  headline: 'Start with a conversation. No setup fees.',
  subheadline: 'We earn your business one load at a time.',
  bullets: [
    'No setup fees: we onboard you free of charge',
    'No long term contracts: month to month, cancel with notice',
    'No hidden charges: what we quote is exactly what you pay',
    'Talk to a real dispatcher before signing anything',
  ],
} as const;

// Role-based contact card; no stock portrait presented as a team member.
export const DISPATCHER = {
  name: 'Your Dispatch Manager',
  title: 'Carrier Relations · Rai Dispatch',
  initials: 'RD',
  // photo: '/team/dispatch-manager.jpg',  // <-- add when available
  intro:
    'Work with a dedicated dispatcher who understands your equipment, preferred lanes and schedule. We help search freight, discuss rates, organize load details and coordinate broker communication. Active carriers receive 24/7 live dispatch support through their agreed contact and escalation process. You approve each load.',
  commitments: [
    ACTIVE_CARRIER_SUPPORT,
    'Clear dispatch contact and escalation process',
    'Equipment and lane preferences guide the search',
    'Carrier approval before each load is booked',
  ],
} as const;
