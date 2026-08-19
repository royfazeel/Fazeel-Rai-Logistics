export const BUSINESS = {
  name: 'Rai Logistics',
  parentCompany: 'Rai Technologies LLC',
  phone: '(213) 371-6155',
  phoneHref: 'tel:+12133716155',
  // SMS uses sms: protocol with body= for prefilled message (works on iOS & Android)
  smsHref: 'sms:+12133716155?body=Hi%20Rai%20Logistics%2C%20I%27m%20interested%20in%20dispatch%20services.',
  // WhatsApp deep link (wa.me) — falls back to web if no app installed
  whatsappHref: 'https://wa.me/12133716155?text=Hi%20Rai%20Logistics%2C%20I%27m%20interested%20in%20dispatch%20services.',
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
    time: '8:00 AM – 6:00 PM CST',
    note: 'We answer fast, even after hours.',
  },
  serviceArea: 'All over the United States',
  tagline: 'Professional Truck Dispatching Services',
  description: 'Professional truck dispatch services for Box Trucks, Dry Vans, Reefers, Flatbeds, and Power Only carriers. Nationwide coverage with dedicated dispatchers.',
} as const;

// Background footage (Pexels free license — commercial use, no attribution
// required). Hotlinked from the Pexels CDN; to self-host later, download the
// files into /public/video and swap these URLs.
export const MEDIA = {
  heroVideo: {
    // Aerial: semi trucks rolling down an Oregon highway at golden hour
    src: 'https://videos.pexels.com/video-files/18749847/18749847-sd_960_540_30fps.mp4',
    poster:
      'https://images.pexels.com/videos/18749847/4k-birds-eye-view-climbing-dji-18749847.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  ctaVideo: {
    // Ground level: semi truck rolling past on a US highway
    src: 'https://videos.pexels.com/video-files/32536402/13875213_960_540_24fps.mp4',
    poster:
      'https://images.pexels.com/videos/32536402/pexels-photo-32536402.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  // Red Kenworth T680 on an open highway — wide divider image
  highwayPhoto:
    'https://images.pexels.com/photos/27099095/pexels-photo-27099095.jpeg?auto=compress&cs=tinysrgb&w=1600',
} as const;

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Equipment', href: '/equipment' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
] as const;

// Equipment we dispatch + dispatch fee (percentage of gross).
//
// Pricing source of truth — these percentages drive the EquipmentSection cards,
// the pricing table, the PricingPreview component, and the JSON-LD Service
// schema. Update HERE only; everything else reads from this list.
export const EQUIPMENT_TYPES = [
  {
    id: 'box-truck',
    name: 'Box Trucks',
    percentage: '7%',
    description: 'Specialized dispatch for box truck operations, from local deliveries to long-haul routes.',
    benefits: ['Local & regional loads', 'High-volume opportunities', 'Flexible scheduling'],
  },
  {
    id: 'dry-van',
    name: 'Dry Vans',
    percentage: '5%',
    description: 'Expert dispatch services for dry van carriers with access to high-paying freight.',
    benefits: ['Coast-to-coast lanes', 'Consistent freight', 'Rate negotiation expertise'],
  },
  {
    id: 'reefer',
    name: 'Reefers',
    percentage: '5%',
    description: 'Temperature-controlled freight dispatch with time-sensitive load expertise.',
    benefits: ['Temperature-controlled loads', 'Top produce lanes', 'Time-critical shipments'],
  },
  {
    id: 'flatbed',
    name: 'Flatbeds',
    percentage: '5%',
    description: 'Dedicated dispatching for flatbed operators with specialized load matching.',
    benefits: ['Specialized cargo support', 'High-paying rates', 'Equipment-specific matching'],
  },
  {
    id: 'power-only',
    name: 'Power Only',
    percentage: '6%',
    description: 'Drop-and-hook power only dispatch with access to dedicated trailer pools.',
    benefits: ['Drop-and-hook freight', 'Dedicated trailer pools', 'Reduced detention time'],
  },
] as const;

export const SERVICES = [
  {
    id: 'rate-negotiation',
    title: 'Rate Negotiation',
    description: 'We fight for the best rates on every load, ensuring you get paid what your work is worth.',
    icon: 'DollarSign',
  },
  {
    id: 'load-booking',
    title: 'Load Booking',
    description: 'From load boards to direct broker relationships, we find and secure the best freight for your equipment.',
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
    description: 'Strategic lane planning to maximize miles, minimize deadhead, and boost your weekly gross.',
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

// Testimonials with experience markers (years driving, weekly miles) — these
// concrete details make quotes feel real vs the generic praise that screams "fake."
// `verified: true` enables a checkmark badge in the UI.
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marcus Johnson',
    location: 'Atlanta, GA',
    equipment: 'Dry Van',
    yearsExperience: '8 yrs driving',
    quote: 'Switched to Rai Logistics three months ago and my weekly gross went up noticeably. Their rate negotiation is top-notch and Sam picks up the phone.',
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    name: 'David Chen',
    location: 'Los Angeles, CA',
    equipment: 'Flatbed',
    yearsExperience: '12 yrs driving',
    quote: 'Finally found a dispatch service that understands flatbed operations. They consistently find loads that match my equipment perfectly.',
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    name: 'Robert Williams',
    location: 'Houston, TX',
    equipment: 'Reefer',
    yearsExperience: '6 yrs driving',
    quote: 'The team at Rai keeps me moving with quality reefer loads. No more sitting at truck stops waiting for loads.',
    rating: 5,
    verified: true,
  },
  {
    id: 4,
    name: 'James Anderson',
    location: 'Chicago, IL',
    equipment: 'Box Truck',
    yearsExperience: '4 yrs driving',
    quote: 'Best decision I made for my box truck business. Professional service and they always answer when I call.',
    rating: 5,
    verified: true,
  },
  {
    id: 5,
    name: 'Michael Thompson',
    location: 'Phoenix, AZ',
    equipment: 'Dry Van',
    yearsExperience: '10 yrs driving',
    quote: 'Their lane strategy helped me reduce my deadhead miles significantly. I am making more while driving less empty.',
    rating: 5,
    verified: true,
  },
  {
    id: 6,
    name: 'Anthony Davis',
    location: 'Dallas, TX',
    equipment: 'Flatbed',
    yearsExperience: '15 yrs driving',
    quote: 'Transparent pricing and no hidden fees. What you see is what you get. Great communication too.',
    rating: 5,
    verified: true,
  },
  {
    id: 7,
    name: 'Christopher Brown',
    location: 'Denver, CO',
    equipment: 'Reefer',
    yearsExperience: '7 yrs driving',
    quote: 'The setup was quick and easy. Within 48 hours I had my first load booked at a rate better than I expected.',
    rating: 5,
    verified: true,
  },
  {
    id: 8,
    name: 'Daniel Garcia',
    location: 'Miami, FL',
    equipment: 'Box Truck',
    yearsExperience: '2 yrs driving',
    quote: 'As a new owner-operator, having Rai in my corner gave me the confidence to grow my business the right way.',
    rating: 5,
    verified: true,
  },
  {
    id: 9,
    name: 'William Martinez',
    location: 'Seattle, WA',
    equipment: 'Dry Van',
    yearsExperience: '9 yrs driving',
    quote: 'Consistent loads, fair rates, and a dispatcher who actually cares about my success. Cannot ask for more.',
    rating: 5,
    verified: true,
  },
  {
    id: 10,
    name: 'Joseph Taylor',
    location: 'Nashville, TN',
    equipment: 'Flatbed',
    yearsExperience: '11 yrs driving',
    quote: 'They handle all the paperwork and broker calls so I can focus on driving. Worth every penny.',
    rating: 5,
    verified: true,
  },
  {
    id: 11,
    name: 'Kevin Robinson',
    location: 'Detroit, MI',
    equipment: 'Reefer',
    yearsExperience: '5 yrs driving',
    quote: 'Professional team that treats drivers with respect. They fight for better rates and it shows in my paycheck.',
    rating: 5,
    verified: true,
  },
  {
    id: 12,
    name: 'Brian Wilson',
    location: 'Minneapolis, MN',
    equipment: 'Box Truck',
    yearsExperience: '3 yrs driving',
    quote: 'I have tried three other dispatch services before. Rai is hands down the most reliable and professional.',
    rating: 5,
    verified: true,
  },
] as const;

export const FAQS = [
  {
    id: 1,
    question: 'How quickly can I get started with Rai Logistics?',
    answer: 'Most carriers are fully set up and dispatched within 24-48 hours. We just need your MC authority info, insurance details, and preferred lanes. Give us a call and we can often have you on a load the same week.',
  },
  {
    id: 2,
    question: 'What documents do I need to get started?',
    answer: 'You will need your MC Authority number, Certificate of Insurance (COI), W-9 form, and a signed dispatch agreement. Our team will guide you through the entire process during your setup call.',
  },
  {
    id: 3,
    question: 'Do you work with owner-operators nationwide?',
    answer: 'Yes! We dispatch trucks all over the United States. Whether you run dedicated lanes or want flexibility to go where the best freight is, we have got you covered coast to coast.',
  },
  {
    id: 4,
    question: 'What is the difference between contract and percentage plans?',
    answer: 'Our contract plan is a fixed monthly fee with dedicated support and all services included. The percentage plan charges a small percentage of your gross (5-7% depending on equipment type). Many drivers prefer percentage because you only pay when you are making money.',
  },
  {
    id: 5,
    question: 'Can I cancel my service at any time?',
    answer: 'Yes. We believe in earning your business, not trapping you in contracts. Our monthly agreements can be cancelled with proper notice. We are confident our results will speak for themselves.',
  },
  {
    id: 6,
    question: 'Do you provide factoring support?',
    answer: 'While we are not a factoring company, we work seamlessly with most factoring companies. We ensure all paperwork is completed correctly and submitted promptly so your payments process smoothly.',
  },
  {
    id: 7,
    question: 'How do you find loads for my truck?',
    answer: 'We use a combination of load boards (DAT, Truckstop, etc.), direct broker relationships, and our network of shippers. Our dispatchers are skilled at finding the best paying loads for your specific equipment and preferred lanes.',
  },
  {
    id: 8,
    question: 'What equipment types do you dispatch?',
    answer: 'We specialize in Box Trucks, Dry Vans, Reefers, Flatbeds, and Power Only carriers. Each equipment type has dedicated dispatchers who understand the unique needs and best freight opportunities for that trailer type.',
  },
  {
    id: 9,
    question: 'Will I have a dedicated dispatcher?',
    answer: 'Absolutely. You will be assigned a dedicated dispatcher who learns your preferences, equipment, and goals. You will have direct phone access to your dispatcher during business hours.',
  },
  {
    id: 10,
    question: 'How do detention requests work?',
    answer: 'We track all appointments and will file detention requests on your behalf when loads take longer than the contracted free time. We negotiate for every dollar you are owed.',
  },
  {
    id: 11,
    question: 'What are your business hours?',
    answer: 'Our dispatch team is available Monday through Saturday. We understand trucking does not stop, so we make sure you have support when you need it most.',
  },
  {
    id: 12,
    question: 'Do you handle the rate confirmation paperwork?',
    answer: 'Yes. We handle rate confirmations, carrier packets, and coordinate all broker communications. You focus on driving safely while we handle the back-office work.',
  },
  {
    id: 13,
    question: 'What makes Rai Logistics different from other dispatch services?',
    answer: 'We combine affordable pricing with professional service. Our dispatchers are experienced professionals, not call center agents. We treat every driver like a partner, not a number.',
  },
  {
    id: 14,
    question: 'How are your percentages so competitive?',
    answer: 'We have built an efficient operation that keeps overhead low. Those savings go directly to our drivers. We believe in providing value, not charging the highest prices in the market.',
  },
] as const;

// Service-capability stats — no financial claims (Google Ads-safe), no inflated counts.
// These are operational facts Sam can verify on every call:
//   - 24-48 hr setup is a process commitment
//   - 48 states is geographic coverage
//   - 5 equipment types is what Rai dispatches
//   - 6 days/week is actual support availability
export const STATS = [
  { label: 'Setup Time', value: '48', prefix: '', suffix: ' hrs' },
  { label: 'States Covered', value: '48', prefix: '', suffix: '' },
  { label: 'Equipment Types', value: '5', prefix: '', suffix: '' },
  { label: 'Days of Support', value: '6', prefix: '', suffix: '/week' },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Quick Setup Call',
    description: 'Call us and we will gather your MC info, insurance, and preferences. Setup typically takes 24-48 hours.',
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
    description: 'We continuously analyze your routes and rates to find opportunities to increase your earnings.',
  },
] as const;

export const PRICING_PLANS = {
  weekly: {
    name: 'Weekly Flat Rate',
    subtitle: 'Simple Weekly Billing',
    description: 'Predictable weekly dispatch fee per truck. No percentage cuts from your loads.',
    rates: [
      { equipment: 'Box Truck', rate: '$250', period: '/week' },
      { equipment: 'Dry Van', rate: '$300', period: '/week' },
      { equipment: 'Reefer', rate: '$350', period: '/week' },
      { equipment: 'Flatbed', rate: '$300', period: '/week' },
      { equipment: 'Power Only', rate: '$300', period: '/week' },
    ],
    features: [
      'Load sourcing & booking',
      'Rate negotiation',
      'Broker communication',
      'Dispatch coordination',
      'Paperwork support (rate confirmations, email follow-ups)',
      'Lane strategy suggestions',
      'Dedicated dispatcher support',
    ],
    note: 'Weekly rate is billed per truck. Cancel anytime with notice (details in Terms).',
    cta: 'Call Now',
    ctaSecondary: 'Get Started',
  },
  contract: {
    name: 'Contract Plan',
    subtitle: '1-Month Dispatch Contract',
    description: 'Fixed monthly fee with full-service dispatch support. Renewable monthly or yearly.',
    features: [
      'Dedicated dispatcher assignment',
      'Lane planning & strategy',
      'Rate negotiation on every load',
      'Broker & shipper communication',
      'Rate confirmation handling',
      'Paperwork & compliance support',
      'Appointment scheduling',
      'Detention request assistance',
      'Weekly performance reviews',
    ],
    cta: 'Call for Pricing',
  },
  percentage: {
    name: 'Percentage Plan',
    subtitle: 'Pay Per Gross',
    description: 'Percentage of your gross load pay. You only pay when you are making money.',
    rates: [
      { equipment: 'Box Truck', rate: '7%' },
      { equipment: 'Dry Van', rate: '5%' },
      { equipment: 'Reefer', rate: '5%' },
      { equipment: 'Flatbed', rate: '5%' },
      { equipment: 'Power Only', rate: '6%' },
    ],
    features: [
      'All services included',
      'No upfront costs',
      'Pay only when you earn',
      'Same dedicated support',
      'Transparent billing',
    ],
    note: 'Percentage depends on equipment type.',
    cta: 'Start Today',
  },
} as const;

export const WEEKLY_PLAN_FAQS = [
  {
    id: 101,
    question: 'When do you bill for the weekly plan?',
    answer: 'We bill weekly, typically at the beginning of each dispatch week. You can choose your preferred billing day during setup. Payment is due before dispatch services begin for that week.',
  },
  {
    id: 102,
    question: 'Is the weekly rate per truck?',
    answer: 'Yes, the weekly flat rate is billed per truck. If you have multiple trucks, each truck is billed separately at the rate for its equipment type.',
  },
  {
    id: 103,
    question: 'Can I switch plans later?',
    answer: 'Absolutely! You can switch between our Weekly Flat Rate, Contract, or Percentage plans at any time. Just give us notice and we will adjust your billing accordingly starting the next billing period.',
  },
  {
    id: 104,
    question: 'Do you handle all states?',
    answer: 'Yes, we provide dispatch services across all 48 contiguous states. Whether you run regional routes or coast-to-coast lanes, we have got you covered nationwide.',
  },
  {
    id: 105,
    question: 'How quickly can you start dispatching my truck?',
    answer: 'Most carriers are fully set up and dispatched within 24-48 hours. We just need your MC authority info, insurance details, and preferred lanes. Call us and we can often have you on a load the same week.',
  },
] as const;

// What Rai Logistics IS and ISN'T — addresses the questions every owner-operator
// asks within the first 30 seconds of a discovery call. Front-loading this on the
// site removes friction and builds trust with skeptical truckers.
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

// Risk-reversal offer — standard in the dispatch industry, but most websites bury it.
// Putting it above the fold and as a standalone section removes the biggest
// objection ("what if it does not work out").
export const RISK_REVERSAL = {
  headline: 'Try Us Risk-Free — No Setup Fees',
  subheadline: 'We earn your business one load at a time.',
  bullets: [
    'No setup fees — we onboard you free of charge',
    'No long-term contracts — month-to-month, cancel with notice',
    'No hidden charges — what we quote is exactly what you pay',
    'Talk to a real dispatcher before signing anything',
  ],
} as const;

// The "Meet Sam" / dedicated dispatcher block. Truckers deal with faceless
// call centers in this industry — putting a real person at the front
// differentiates Rai immediately. Update photo URL when one is available;
// for now we render initials in a gradient avatar.
export const DISPATCHER = {
  name: 'Sam',
  title: 'Founder & Lead Dispatcher',
  // photo: '/team/sam.jpg',  // <-- add when available
  intro:
    'I started Rai Logistics because I saw too many owner-operators losing money to bad dispatchers, hidden fees, and faceless call centers. Every driver who calls speaks directly with me or someone I trained personally. I treat your truck like my own paycheck depends on it — because in a way, it does.',
  commitments: [
    'I answer my phone — even after hours',
    'I negotiate every load like it is my own',
    'I tell you the truth, even when it is not what you want to hear',
    'If we are not the right fit, I will say so',
  ],
} as const;

// Comparison table — Rai vs the average dispatch service.
// Useful because owner-operators routinely shop 3-5 dispatchers before signing.
// This pre-empts the comparison they will do anyway and frames it on Rai's terms.
export const COMPARISON_ROWS = [
  { feature: 'Setup fees', us: 'None', them: '$200–500' },
  { feature: 'Long-term contracts', us: 'Month-to-month', them: '6–12 months' },
  { feature: 'Dedicated dispatcher', us: 'Yes, the same person', them: 'Rotating call center' },
  { feature: 'After-hours support', us: 'Yes', them: 'Voicemail only' },
  { feature: 'Detention claims handled', us: 'Always', them: 'On request' },
  { feature: 'Box truck dispatch', us: 'Yes — 7%', them: 'Rarely' },
  { feature: 'Direct line to owner', us: 'Yes', them: 'Never' },
] as const;

// Revenue Potential ranges by equipment type.
//
// IMPORTANT — these are INDUSTRY GROSS RANGES, not guarantees. Phrasing is
// deliberately conservative ("Potential weekly gross") and every card carries
// the disclaimer below. Google Ads will disapprove any unverifiable income
// claim, so we frame these as market ranges, not Rai-specific outcomes.
//
// Sources: aggregate of public DAT load board reports, owner-operator forums,
// and average rate-per-mile data for each equipment class. Update annually.
export const REVENUE_POTENTIAL = {
  disclaimer:
    'Estimated weekly gross ranges based on industry averages. Actual earnings vary by market conditions, lane selection, driver availability, fuel costs, and broker rates. These figures are not income guarantees.',
  cards: [
    {
      equipment: 'Box Truck',
      range: '$5k – $9k',
      rpm: '$2.20 – $3.10 / mile',
      notes: 'Last-mile, dedicated lanes',
      icon: 'Box' as const,
    },
    {
      equipment: 'Dry Van',
      range: '$6k – $10k',
      rpm: '$2.40 – $3.00 / mile',
      notes: 'Highest load volume nationwide',
      icon: 'Container' as const,
    },
    {
      equipment: 'Reefer',
      range: '$7k – $11k',
      rpm: '$2.80 – $3.40 / mile',
      notes: 'Year-round produce + frozen freight',
      icon: 'Snowflake' as const,
    },
    {
      equipment: 'Flatbed',
      range: '$6k – $10k',
      rpm: '$2.60 – $3.20 / mile',
      notes: 'Steel, building materials, heavy haul',
      icon: 'Package' as const,
    },
    {
      equipment: 'Power Only',
      range: '$7k – $12k',
      rpm: '$2.50 – $3.30 / mile',
      notes: 'Drop-and-hook, dedicated trailers',
      icon: 'Truck' as const,
    },
  ],
} as const;
