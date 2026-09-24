import { DISPATCH_PRICING_SUMMARY, DISPATCH_RATE_RANGE, getDispatchRateLabel } from './dispatch-pricing';

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
  address: {
    street: '312 W 2nd St, Ste 5083',
    city: 'Casper',
    state: 'WY',
    zip: '82601',
    full: '312 W 2nd St, Ste 5083, Casper, WY 82601',
  },
  hours: {
    days: 'Monday – Saturday',
    time: '8:00 AM – 6:00 PM CT',
    note: 'Contact the dispatch desk to confirm availability for your schedule.',
  },
  serviceArea: 'All 48 contiguous United States',
  tagline: 'Professional Truck Dispatching Services',
  description: `Dedicated truck dispatchers for owner-operators and fleets across the 48 contiguous states. Dry van, reefer, flatbed, box truck, power only, step deck, hotshot, and cargo van support with equipment-based fees of ${DISPATCH_RATE_RANGE}.`,
} as const;

// Locally hosted media. The hero uses a still image on mobile and for reduced
// motion; eligible desktop playback uses a deferred, full-HD excerpt.
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
    description: 'Specialized dispatch for box truck operations, from local deliveries to long-haul routes.',
    benefits: ['Local & regional loads', 'Capacity-based load matching', 'Flexible scheduling'],
  },
  {
    id: 'dry-van',
    name: 'Dry Vans',
    percentage: getDispatchRateLabel('dry-van'),
    description: 'Dry van dispatch for regional and over-the-road carriers hauling general freight.',
    benefits: ['Coast-to-coast lanes', 'Consistent freight', 'Rate negotiation expertise'],
  },
  {
    id: 'reefer',
    name: 'Reefers',
    percentage: getDispatchRateLabel('reefer'),
    description: 'Temperature-controlled freight dispatch with time-sensitive load expertise.',
    benefits: ['Temperature-controlled loads', 'Top produce lanes', 'Time-critical shipments'],
  },
  {
    id: 'flatbed',
    name: 'Flatbeds',
    percentage: getDispatchRateLabel('flatbed'),
    description: 'Dedicated dispatching for flatbed operators with specialized load matching.',
    benefits: ['Specialized cargo support', 'Tarping and securement review', 'Equipment-specific matching'],
  },
  {
    id: 'power-only',
    name: 'Power Only',
    percentage: getDispatchRateLabel('power-only'),
    description: 'Power only dispatch for tractors hauling broker- or shipper-provided trailers, subject to carrier eligibility.',
    benefits: ['Drop-and-hook freight', 'Trailer requirements review', 'Pickup appointment coordination'],
  },
  {
    id: 'step-deck',
    name: 'Step Decks',
    percentage: getDispatchRateLabel('step-deck'),
    description: 'Step deck dispatch for taller freight, machinery, and equipment within your trailer and authority limits.',
    benefits: ['Deck-height load matching', 'Dimensions reviewed before booking', 'Open-deck lane planning'],
  },
  {
    id: 'hotshot',
    name: 'Hotshot Trucks',
    percentage: getDispatchRateLabel('hotshot'),
    description: 'Hotshot dispatch based on your truck, trailer, payload, operating authority, and preferred radius.',
    benefits: ['Partial-load opportunities', 'Payload and length matching', 'Regional and expedited lanes'],
  },
  {
    id: 'cargo-van',
    name: 'Cargo & Sprinter Vans',
    percentage: getDispatchRateLabel('cargo-van'),
    description: 'Cargo van and Sprinter van dispatch for suitable expedited freight, subject to lane and broker availability.',
    benefits: ['Interior dimensions reviewed', 'Expedited freight search', 'Availability confirmed by lane'],
  },
] as const;

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
    description: 'We handle all broker and shipper communications, rate confirmations, and negotiations.',
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
    description: 'From rate confirmations to BOLs, we ensure your documentation is always in order.',
    icon: 'FileText',
  },
  {
    id: 'scheduling',
    title: 'Scheduling & Follow-ups',
    description: 'Appointment scheduling, check calls, and proactive communication to keep loads moving.',
    icon: 'Calendar',
  },
] as const;

export const FAQS = [
  { id: 1, question: 'How much does a truck dispatch service cost?', answer: `${DISPATCH_PRICING_SUMMARY} These fees apply to gross revenue on loads we dispatch. Confirm the billing base, schedule and service scope in writing before starting.` },
  { id: 2, question: 'What documents do I need to get started?', answer: 'Prepare your operating authority details where applicable, Certificate of Insurance, W-9, equipment specifications, and a signed dispatch agreement. A factoring notice of assignment may also be needed. Broker requirements vary by load and carrier.' },
  { id: 3, question: 'Where do you provide truck dispatch services?', answer: 'We support carriers across the 48 contiguous United States. Tell us whether you prefer local, regional, dedicated, or over-the-road work. Load availability depends on your equipment, authority, location, and the market.' },
  { id: 4, question: 'Which truck and trailer types can you dispatch?', answer: 'We support dry vans, reefers, flatbeds, box trucks, power only tractors, step decks, hotshot trucks, and cargo or Sprinter vans. Specialized equipment and freight requirements are reviewed before accepting or booking a load.' },
  { id: 5, question: 'Do I have to accept every load?', answer: 'No. You choose which loads to accept. We present the rate, pickup and delivery details, equipment requirements, and route considerations so you can decide before booking.' },
  { id: 6, question: 'Do you work with new authorities and owner-operators?', answer: 'Owner-operators, small fleets, and carriers with new authority can discuss their setup with us. Each broker sets its own authority-age, insurance, safety, and equipment requirements, so not every load will be available to every carrier.' },
  { id: 7, question: 'How do you find loads for my truck?', answer: 'We search load boards and available broker freight, review lane fit and carrier requirements, negotiate terms, and present suitable options for your approval. We consider loaded and empty miles as well as pickup and delivery schedules.' },
  { id: 8, question: 'Are freight rates or weekly earnings guaranteed?', answer: 'No. Freight availability, load rates, operating costs, and weekly revenue change with equipment, markets, hours available, and the loads you accept. Dispatch support helps you evaluate opportunities; it does not guarantee a particular income.' },
  { id: 9, question: 'Will I have a dedicated dispatcher?', answer: 'Yes. Rai Dispatch provides clients with a dedicated truck dispatcher who learns their equipment, preferred lanes, scheduling needs and load criteria. Confirm your contact person, working hours and escalation process during onboarding.' },
  { id: 10, question: 'Do you help with detention and layover requests?', answer: 'We help document arrival and departure times and request eligible detention or layover pay under the agreed load terms. Payment depends on the broker or shipper agreement and supporting documentation.' },
  { id: 11, question: 'What are your business hours?', answer: 'Our published dispatch desk hours are Monday through Saturday, 8:00 AM to 6:00 PM Central Time. Discuss any after-hours needs during your setup call.' },
  { id: 12, question: 'Do you handle rate confirmations and factoring paperwork?', answer: 'We assist with carrier packets, rate confirmations, bills of lading, proof of delivery, and communication with your chosen factoring provider. The carrier remains responsible for accurate records and compliance.' },
  { id: 13, question: 'How quickly can dispatch begin?', answer: 'We review your documents, equipment, lanes, and broker eligibility during onboarding. Timing depends on complete paperwork and suitable freight availability. Call the dispatch desk for a realistic start date.' },
  { id: 14, question: 'Can I cancel dispatch services?', answer: 'Services are offered without a long-term commitment. Follow the notice and outstanding-payment requirements in your signed dispatch agreement. Review those terms before starting.' },
] as const;

export const STATS = [
  { label: 'Fees by truck type', value: DISPATCH_RATE_RANGE.replace('%', ''), prefix: '', suffix: '%' },
  { label: 'Contiguous states', value: '48', prefix: '', suffix: '' },
  { label: 'Equipment types', value: '8', prefix: '', suffix: '' },
  { label: 'Days of desk support', value: '6', prefix: '', suffix: '/week' },
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
    description: 'Review booked loads, empty miles, time at home, and next-week lane preferences together.',
  },
] as const;

// Plain-language scope of the dispatch relationship.
export const SCOPE_CLARITY = {
  weAre: [
    'A dispatch services company working under YOUR MC authority',
    'Your dedicated load-finder, rate negotiator, and broker liaison',
    'Paid by you, working only for your interests',
    'Transparent about every fee — no surprise charges',
  ],
  weArent: [
    'Not a motor carrier — you keep your authority and equipment',
    'Not a freight broker — we do not buy and resell freight',
    'Not a factoring company — keep your existing factor or work without one',
    'Not a long contract trap — month-to-month with proper notice',
  ],
} as const;

// Published onboarding and billing commitments.
export const RISK_REVERSAL = {
  headline: 'Start with a conversation. No setup fees.',
  subheadline: 'We earn your business one load at a time.',
  bullets: [
    'No setup fees — we onboard you free of charge',
    'No long-term contracts — month-to-month, cancel with notice',
    'No hidden charges — what we quote is exactly what you pay',
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
    'Work with a dispatch contact who understands your equipment, preferred lanes, and schedule. We help search freight, discuss rates, organize load details, and keep broker communication moving. You approve loads and stay in control of your operation.',
  commitments: [
    'Clear contact details and published desk hours',
    'We negotiate every load like it is our own',
    'We tell you the truth, even when it is not what you want to hear',
    'If we are not the right fit, we will say so',
  ],
} as const;
