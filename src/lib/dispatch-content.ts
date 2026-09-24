import { DEFAULT_DISPATCH_RATE, DISPATCH_RATE_RANGE, getDispatchRate, getDispatchRateLabel } from './dispatch-pricing';
import { ADDITIONAL_GUIDES, ADDITIONAL_SERVICES } from './expanded-content';

export type ContentLink = { label: string; href: string };
export type ContentSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][]; caption: string };
};
export type DispatchContent = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  highlights: string[];
  sections: ContentSection[];
  checklistTitle: string;
  checklist: string[];
  faqs: { question: string; answer: string }[];
  related: ContentLink[];
  availability?: string;
};

export const EQUIPMENT_CONTENT: DispatchContent[] = [
  {
    slug: 'dry-van',
    title: 'Dry van dispatch services',
    metaTitle: `Dry Van Dispatch Services | ${getDispatchRateLabel('dry-van')} Fee`,
    description: `Dry van dispatch at a ${getDispatchRateLabel('dry-van')} fee for owner-operators and fleets across the lower 48. Dedicated dispatcher, load search, rate negotiation and paperwork support.`,
    eyebrow: 'Enclosed freight. Clear decisions.',
    intro: 'Your next dry van load should fit more than an empty trailer. Rai Dispatch helps owner-operators and small fleets compare freight against pickup distance, appointment times, operating costs and where the truck will be after delivery.',
    highlights: ['Full truckload load search', 'Regional and OTR lane planning', 'Carrier-approved bookings'],
    sections: [
      { id: 'load-fit', title: 'Match the freight to the trailer', paragraphs: ['Dry van freight can include palletized consumer goods, packaged products and other cargo that does not need temperature control. Before discussing a load, we need the actual trailer length, interior dimensions, payload and condition. A 53-foot van is not automatically suitable for every posted van load.', 'We clarify loading method, live load or drop-and-hook instructions, pallet exchange, driver assist and any special requirements. If a shipment calls for food-grade equipment, a particular trailer age or a facility-specific appointment, those details belong in the decision before booking.'] },
      { id: 'lane-plan', title: 'Look beyond the outbound rate', paragraphs: ['A strong headline rate can lose its appeal after a long empty drive or a delivery that leaves no workable reload. We compare the loaded trip with pickup deadhead, realistic delivery timing and potential outbound options from the destination.', 'Tell us your home-time target, preferred regions and lanes you do not run. Regional dispatch and over-the-road dispatch require different schedules; neither should be built around miles the driver cannot safely complete.'], bullets: ['Compare total trip miles, not loaded miles alone.', 'Allow time for live loading, unloading and check-in procedures.', 'Review tolls, restricted delivery windows and the next available driving day.'] },
      { id: 'support', title: 'Keep the dispatch desk and the driver aligned', paragraphs: ['We support load search, broker communication, rate-confirmation review and appointment follow-ups. You approve the freight and the agreed terms. Your dispatcher uses the truck status and availability you provide to avoid planning the next pickup around an unrealistic arrival.', `Dispatch fees are ${getDispatchRateLabel('dry-van')} under the agreed percentage plan. The agreement should identify the billing base and treatment of fuel surcharge and accessorials, so you can compare the full cost before starting.`] },
    ],
    checklistTitle: 'Bring these dry van details',
    checklist: ['Trailer length, payload and interior condition', 'Current empty location and available date', 'Preferred lanes, home time and maximum deadhead', 'Driver-assist, touch-freight and drop-trailer preferences'],
    faqs: [
      { question: 'Do you dispatch 53-foot dry vans?', answer: 'Yes. We review 53-foot dry van operations and other enclosed-trailer configurations against their actual specifications, authority and available freight. Send your trailer details so we can assess the fit.' },
      { question: 'Can I choose regional lanes instead of OTR loads?', answer: 'Yes. Your lane preferences and home-time needs guide the search. Freight availability and appointment timing determine which loads can actually be offered; a preferred lane is not a guaranteed dedicated contract.' },
      { question: 'Do you guarantee a weekly gross for dry van trucks?', answer: 'No. Revenue depends on rates, miles, appointments, equipment, availability and operating costs. We help evaluate individual loads without promising a fixed weekly income.' },
    ],
    related: [{ label: 'How to evaluate a freight rate', href: '/resources/evaluate-freight-rate-per-mile' }, { label: 'Route and lane strategy', href: '/services/route-strategy' }, { label: 'US service areas', href: '/service-areas' }],
  },
  {
    slug: 'reefer', title: 'Reefer dispatch services', metaTitle: `Reefer Dispatch Services | ${getDispatchRateLabel('reefer')} Fee`,
    description: `Reefer dispatch at a ${getDispatchRateLabel('reefer')} fee with a dedicated dispatcher. Temperature-instruction review, appointment coordination and rate negotiation across the lower 48.`,
    eyebrow: 'Temperature-sensitive freight. Attentive coordination.',
    intro: 'Refrigerated freight adds requirements that a general load search can miss. Rai Dispatch helps reefer carriers evaluate temperature instructions, appointment demands, washouts and trip costs before committing the truck.',
    highlights: ['Temperature requirements reviewed', 'Appointment and broker follow-ups', 'Reefer-specific cost discussions'],
    sections: [
      { id: 'temperature', title: 'Clarify the handling instructions before pickup', paragraphs: ['Fresh, chilled and frozen shipments can require different setpoints, operating modes and preparation. We ask for the written commodity and temperature instructions and flag missing or conflicting details for clarification with the broker. The carrier and driver remain responsible for equipment operation and cargo handling.', 'Confirm whether the shipment requires a pre-cooled trailer, continuous operation, temperature records or special cleanliness standards. A rate confirmation should not leave the driver guessing how the equipment is expected to run.'] },
      { id: 'appointments', title: 'Plan around real appointment windows', paragraphs: ['A reefer trip may involve a late-night pickup, a strict grocery delivery appointment or multiple stops. The calendar matters as much as the mileage. We discuss loading time, delivery sequence and driver availability before treating a load as a fit.', 'We assist with appointment communication and help organize check-in times and supporting documents when requesting detention or other agreed accessorials. Approval and payment depend on the written load terms and the responsible party.'], bullets: ['Confirm washout and pre-cooling time before pickup.', 'Ask about lumper payment procedures and receipts.', 'Document temperature instructions and any broker-approved changes.'] },
      { id: 'economics', title: 'Include the refrigeration costs in the decision', paragraphs: ['Reefer fuel, washouts and waiting time can affect a load even when its posted rate looks attractive. Compare the complete trip with your own operating costs and the next realistic pickup opportunity.', `Our dispatch fee is ${getDispatchRateLabel('reefer')} under the agreed percentage plan. We explain the billing base before onboarding and support rate negotiation, load booking and paperwork coordination. We do not promise produce-season rates or a fixed number of loads.`] },
    ],
    checklistTitle: 'Bring these reefer details',
    checklist: ['Trailer dimensions, payload and refrigeration capabilities', 'Unit status and any temperature restrictions', 'Washout availability and current empty location', 'Multi-stop, overnight and grocery-delivery preferences'],
    faqs: [
      { question: 'Can you help with refrigerated and frozen freight?', answer: 'We can review both, subject to the unit capabilities, shipment requirements and available loads. The carrier must confirm that its equipment can meet the written handling instructions.' },
      { question: 'Who decides the reefer temperature setting?', answer: 'The shipment instructions must come from the authorized shipping or brokerage party and be clear in writing. Dispatch helps clarify and communicate those instructions; it does not independently choose a cargo temperature.' },
      { question: 'Are lumper fees and detention always reimbursed?', answer: 'No. Reimbursement depends on the load agreement, required approvals and supporting documentation. Confirm the process before pickup and retain receipts and timestamps.' },
    ],
    related: [{ label: 'Scheduling and follow-ups', href: '/services/scheduling' }, { label: 'Dispatch fee guide', href: '/resources/truck-dispatch-fees' }, { label: 'Paperwork support', href: '/services/paperwork-support' }],
  },
  {
    slug: 'flatbed', title: 'Flatbed dispatch services', metaTitle: `Flatbed Dispatch Services | ${getDispatchRateLabel('flatbed')} Fee`,
    description: `Flatbed dispatch at a ${getDispatchRateLabel('flatbed')} fee with a dedicated dispatcher. Review cargo dimensions, tarping, loading needs and lanes before approving open-deck freight.`,
    eyebrow: 'Open-deck freight. Equipment-first planning.',
    intro: 'Flatbed dispatch starts with cargo dimensions, loading access and the gear on your trailer. Rai Dispatch helps open-deck owner-operators and fleets review the work behind the rate before they approve a shipment.',
    highlights: ['Dimensions and loading method checked', 'Tarping requirements discussed', 'Open-deck lane planning'],
    sections: [
      { id: 'cargo', title: 'Know the commodity and the loading requirements', paragraphs: ['Building materials, fabricated products and machinery can create very different jobs on the same trailer. We seek the cargo dimensions, weight, loading and unloading method, and any overhang or special handling requirements before booking.', 'Share your deck length, usable space, legal payload and securement equipment. The carrier must determine that the load can be transported safely and lawfully. A dispatcher can collect specifications and ask questions, but cannot replace the carrier’s securement judgment.'] },
      { id: 'work', title: 'Price the work as well as the miles', paragraphs: ['Tarping, multiple picks and delivery-site delays can change the economics of a flatbed load. We discuss whether tarps are required, their size, expected loading time and any special gear requested. These details should be reflected in the written agreement.', 'We help compare total miles and schedule demands with your operating preferences. A nearby job with several hours of site work may use more of the day than a longer run with straightforward loading.'], bullets: ['Confirm tarp dimensions and commodity protection requirements.', 'Ask about forklift or crane access and site appointments.', 'Treat oversized, overweight or permit-dependent freight as a separate review.'] },
      { id: 'approval', title: 'You keep the final load decision', paragraphs: ['We support the freight search, rate discussion, broker calls and documents while you decide which loads fit your equipment and business. Tell us about preferred commodities, weather-related limits and any handling you decline.', `Percentage dispatch fees are ${getDispatchRateLabel('flatbed')}, with the specific billing terms agreed before service. Specialized or permit-dependent freight is not automatically included; scope and capability must be confirmed first.`] },
    ],
    checklistTitle: 'Bring these flatbed details',
    checklist: ['Deck length, width, payload and trailer configuration', 'Tarps, straps, chains, binders and dunnage available', 'Commodity and loading-site restrictions', 'Preferred lanes and available driver schedule'],
    faqs: [
      { question: 'Do I have to take tarped flatbed loads?', answer: 'No. Tell us whether you accept tarping and which tarps you carry. We use those preferences when reviewing available freight; declining particular work can narrow the available options.' },
      { question: 'Does flatbed dispatch include oversize permits?', answer: 'Permit services are not assumed to be included. Oversize or overweight work needs a separate capability and scope review before any booking, including responsibility for permits and route restrictions.' },
      { question: 'Can you find loads for a step deck?', answer: 'Step deck equipment has different deck and clearance considerations. See our step deck dispatch page and send the actual trailer specifications for an availability review.' },
    ],
    related: [{ label: 'Step deck dispatch', href: '/equipment/step-deck' }, { label: 'Rate negotiation', href: '/services/rate-negotiation' }, { label: 'Evaluate a freight rate', href: '/resources/evaluate-freight-rate-per-mile' }],
  },
  {
    slug: 'box-truck', title: 'Box truck dispatch services', metaTitle: `Box Truck Dispatch Services | ${getDispatchRateLabel('box-truck')} Fee`,
    description: `Box truck dispatch at a ${getDispatchRateLabel('box-truck')} fee with a dedicated dispatcher. Equipment-fit reviews, load search and booking support for regional or OTR straight-truck work.`,
    eyebrow: 'Straight trucks. Specific load requirements.',
    intro: `A box truck load must fit the actual truck, door opening and delivery method. Rai Dispatch helps straight-truck carriers assess suitable regional and over-the-road opportunities with a dedicated dispatcher and a clear ${getDispatchRateLabel('box-truck')} dispatch fee.`,
    highlights: ['Box dimensions and payload reviewed', 'Liftgate and delivery needs clarified', 'Regional and OTR options assessed'],
    sections: [
      { id: 'dimensions', title: 'A truck length is only the starting point', paragraphs: ['Two trucks described as 26-foot box trucks may have different payloads, interior heights, door openings and dock compatibility. Those differences determine whether the freight can be loaded and delivered. We collect your actual measurements instead of assuming a listing will fit.', 'Tell us whether the truck has a liftgate, pallet jack, dock-height access and any loading restrictions. Driver assist, inside delivery and residential delivery are separate work requirements that need explicit approval.'] },
      { id: 'freight', title: 'Define the type of work you want', paragraphs: ['Some carriers prefer longer runs with one pickup and delivery. Others seek regional work that returns the truck closer to home. Local delivery and dedicated routes can require different arrangements, and availability cannot be inferred from a general truckload posting.', 'We review the search area, available schedule and acceptable empty miles with you. Expedited or time-sensitive freight requires an honest estimate of readiness and transit time, not an assumption that a small truck can bypass operational limits.'], bullets: ['Confirm pallet count alongside piece dimensions and total weight.', 'Ask about dock access, liftgate use and who unloads.', 'Include extra stops, driver labor and waiting time in the rate discussion.'] },
      { id: 'new-carriers', title: 'Plan realistically as a new box truck carrier', paragraphs: ['A new authority does not automatically qualify for every broker or shipment. Broker onboarding requirements, insurance and equipment specifications can reduce the options available. We review these factors before setting expectations for the load search.', `Our percentage plan is ${getDispatchRateLabel('box-truck')}, with the billing base confirmed in the agreement. We cannot promise a daily route, platform approval, weekly revenue or an immediate first load.`] },
    ],
    checklistTitle: 'Bring these box truck details',
    checklist: ['Interior length, width, height and door opening', 'Actual legal payload and pallet capacity', 'Liftgate, pallet jack and dock-height capabilities', 'Local, regional or OTR preferences and authority status'],
    faqs: [
      { question: 'Do you dispatch 26-foot box trucks?', answer: 'We review 26-foot box trucks and other straight-truck configurations. Fit depends on payload, dimensions, loading equipment, location and available freight, not length alone.' },
      { question: 'Can a box truck with new authority get dispatch help?', answer: 'You can request an onboarding review. Some brokers or loads have authority-age and insurance requirements that limit availability, so acceptance and load timing cannot be guaranteed.' },
      { question: 'Do you guarantee local or dedicated delivery routes?', answer: 'No. Share your preferred area and schedule, and we will assess whether the available service and freight fit. A dedicated route must be separately confirmed in writing.' },
    ],
    related: [{ label: 'Carrier onboarding checklist', href: '/resources/carrier-onboarding-checklist' }, { label: 'Cargo van dispatch review', href: '/equipment/cargo-van' }, { label: 'View dispatch pricing', href: '/pricing' }],
  },
  {
    slug: 'power-only', title: 'Power only dispatch services', metaTitle: `Power Only Dispatch Services | ${getDispatchRateLabel('power-only')} Fee`,
    description: `Power only dispatch at a ${getDispatchRateLabel('power-only')} fee with a dedicated dispatcher. Trailer requirements, pickup and return terms reviewed before carrier-approved bookings.`,
    eyebrow: 'Your tractor. A carefully reviewed trailer move.',
    intro: 'Power only freight pairs your tractor and driver with a trailer supplied through the load arrangement. Rai Dispatch helps you review the trailer terms, pickup readiness and return obligations alongside the linehaul rate.',
    highlights: ['Trailer requirements reviewed', 'Drop-and-hook terms clarified', 'Pickup and return planning'],
    sections: [
      { id: 'requirements', title: 'Understand the trailer arrangement', paragraphs: ['A power only listing does not automatically mean a simple loaded trailer ready at the gate. It may involve a live load, an empty trailer reposition, a trailer pool or specific return instructions. We clarify which arrangement applies before you approve the move.', 'The carrier needs to review insurance, interchange or non-owned trailer requirements with the responsible parties. Share your tractor configuration and any limitations. Trailer inspection, suitability and safe operation remain the carrier’s responsibilities.'] },
      { id: 'costs', title: 'Count the miles after delivery too', paragraphs: ['A trailer return or reposition can add miles and hours after the paying delivery. Compare the entire obligation with the quoted compensation, including any unpaid drive to collect or return equipment.', 'We ask about trailer availability, yard hours, check-in instructions, access requirements and late-return terms. If a trailer is not ready, timely communication and documentation matter; reimbursement still depends on the agreement.'], bullets: ['Get trailer pickup and return locations in writing.', 'Clarify loaded, empty and bobtail segments of the trip.', 'Confirm responsibility for tolls, trailer charges and damage reporting.'] },
      { id: 'support', title: 'Book only after the operating terms are clear', paragraphs: ['We support load sourcing, broker communication, rate discussions and paperwork coordination. Power only acceptance can depend on the broker, trailer provider and carrier profile, so platform or dedicated-pool access is never assumed.', `Our percentage dispatch fee is ${getDispatchRateLabel('power-only')}. We agree the scope and billing base before service and bring load details to you for approval rather than promising an automatic drop-and-hook schedule.`] },
    ],
    checklistTitle: 'Bring these power only details',
    checklist: ['Tractor specifications and available driver schedule', 'Relevant insurance and trailer-interchange information', 'Preferred lanes and trailer-return flexibility', 'Platform or broker approvals already in place'],
    faqs: [
      { question: 'Is every power only load drop-and-hook?', answer: 'No. Power only describes the equipment arrangement. A particular shipment may include live loading, empty moves or return obligations, which must be confirmed before booking.' },
      { question: 'Do you provide trailers?', answer: 'Rai Dispatch provides dispatch support. Any trailer is supplied under the specific broker, shipper or trailer-provider arrangement; availability and terms must be confirmed for the load.' },
      { question: 'Can you guarantee approval with a freight platform?', answer: 'No. The platform or broker controls its own onboarding requirements. We can review your operating preferences and existing approvals without promising access.' },
    ],
    related: [{ label: 'Broker communication', href: '/services/broker-communication' }, { label: 'Load booking process', href: '/services/load-booking' }, { label: 'Dispatch fees explained', href: '/resources/truck-dispatch-fees' }],
  },
  {
    slug: 'step-deck', title: 'Step deck dispatch services', metaTitle: `Step Deck Dispatch Services | ${getDispatchRateLabel('step-deck')} Fee`,
    description: `Step deck dispatch at a ${getDispatchRateLabel('step-deck')} fee with a dedicated dispatcher. Review upper and lower deck dimensions, loading needs and lanes before confirming service fit.`,
    eyebrow: 'Specialized equipment. Start with the specifications.',
    intro: 'Step deck freight requires a closer look at usable deck space and cargo height. Request a Rai Dispatch review of your trailer, preferred commodities and lanes before starting a specialized load search.',
    availability: 'Step deck dispatch availability is subject to equipment, lane and service-capability review before onboarding. Oversize, overweight and permit services require separate confirmation.',
    highlights: ['Upper and lower deck fit', 'Loading and securement questions', 'Availability reviewed first'],
    sections: [
      { id: 'deck-fit', title: 'Map the freight to the usable deck', paragraphs: ['The upper deck, lower deck, deck height and axle configuration influence what can be carried. A total trailer length alone does not show whether a particular piece will fit. Provide the usable dimensions of each deck and the actual cargo specifications.', 'Ramps, load levelers, dunnage and securement gear can affect suitability. We collect the loading method and dimensional details for your review before treating a shipment as a match.'] },
      { id: 'shipment', title: 'Separate ordinary open-deck work from specialized moves', paragraphs: ['Some step deck freight can be handled within a carrier’s ordinary operating scope; other work requires permits, escorts or additional planning. Those requirements need explicit confirmation from qualified parties before a quote becomes a booking.', 'We do not assume that a lower deck makes every tall shipment legal or safe. The carrier must verify its route, equipment, cargo securement and applicable requirements. Dispatch support focuses on collecting information, coordinating the load and communicating approved terms.'] },
      { id: 'planning', title: 'Evaluate the complete lane and schedule', paragraphs: ['Machine pickup times, loading access and unloading equipment can control the trip. Ask whether the site can load your trailer configuration, whether an appointment is firm and how extra work is compensated.', `Our step deck dispatch fee is ${getDispatchRateLabel('step-deck')}, with a dedicated dispatcher for load search and broker communication. We confirm service fit, the billing base and specialized requirements before onboarding.`], bullets: ['Share both deck lengths, deck heights and payload.', 'Identify ramps or loading equipment available.', 'Confirm cargo dimensions and any permit-dependent scope before approval.'] },
    ],
    checklistTitle: 'Prepare for a step deck review',
    checklist: ['Upper and lower deck dimensions and heights', 'Trailer configuration, payload and loading equipment', 'Cargo types and securement capabilities', 'Preferred lanes and specialized-service requirements'],
    faqs: [
      { question: 'Is step deck dispatch currently available for every lane?', answer: 'No blanket availability is promised. We review your equipment, operating scope and preferred lanes before confirming whether we can support the operation.' },
      { question: 'Do you arrange permits or escorts?', answer: 'These services are not automatically included in dispatch. Any permit-dependent move requires a separate scope and capability review with the responsible parties before booking.' },
      { question: 'Can flatbed loads fit on a step deck?', answer: 'Some may, but compatibility depends on usable deck space, loading method, cargo dimensions and shipper requirements. Each shipment needs its own review.' },
    ],
    related: [{ label: 'Flatbed dispatch', href: '/equipment/flatbed' }, { label: 'Rate negotiation support', href: '/services/rate-negotiation' }, { label: 'Request an equipment review', href: '/contact' }],
  },
  {
    slug: 'hotshot', title: 'Hotshot dispatch services', metaTitle: `Hotshot Dispatch Services | ${getDispatchRateLabel('hotshot')} Fee`,
    description: `Hotshot dispatch at a ${getDispatchRateLabel('hotshot')} fee with a dedicated dispatcher. Review your truck, trailer, payload, authority and preferred lanes before confirming service fit.`,
    eyebrow: 'Hotshot freight. Know the combination.',
    intro: 'Hotshot dispatch depends on the complete truck-and-trailer combination. Rai Dispatch reviews your usable deck, payload, operating profile and lanes before confirming support for your hotshot business.',
    availability: 'Hotshot dispatch is subject to equipment, authority, lane and service-capability review. We do not promise loads based on trailer length or a CDL/non-CDL label alone.',
    highlights: ['Truck-and-trailer fit reviewed', 'Partial-load details clarified', 'Carrier operating limits respected'],
    sections: [
      { id: 'capacity', title: 'Start with actual capacity', paragraphs: ['Trailer length does not establish the combination’s usable payload. Truck ratings, trailer ratings, actual weights and the operating configuration all matter. Provide the specifications and limits you use for your business so unsuitable freight can be excluded early.', 'Hotshot freight may involve machinery, materials or other time-sensitive shipments, but urgency does not replace a realistic schedule. We discuss loading arrangements, deck space, securement equipment and the driver’s availability before pursuing a shipment.'] },
      { id: 'partials', title: 'Be deliberate about partials and extra stops', paragraphs: ['A partial load may leave unused deck space, yet adding another shipment changes the trip. Compatibility, securement, delivery order and appointment flexibility must be checked before combining work.', 'A higher total gross is not enough if extra stops consume the time needed to deliver the first shipment. We help clarify the proposed arrangement and bring the decision back to the carrier. No additional shipment is treated as an automatic fit.'], bullets: ['Get piece count, dimensions and weight before approving freight.', 'Account for unloading order and access to every piece.', 'Compare the added revenue with miles, stops and scheduling risk.'] },
      { id: 'start', title: 'Review service availability before committing', paragraphs: ['New authorities and different equipment configurations can face different broker requirements. We review your documents, preferences and available search area to determine whether our dispatch support is a practical fit.', `When accepted, the percentage dispatch plan is ${getDispatchRateLabel('hotshot')} with the billing terms stated in the agreement. We cannot guarantee a first load, a daily schedule or a particular weekly income.`] },
    ],
    checklistTitle: 'Prepare for a hotshot review',
    checklist: ['Truck and trailer specifications, ratings and usable payload', 'Usable deck length, ramps and securement gear', 'Authority and insurance information relevant to the operation', 'Home time, maximum trip length and acceptable empty miles'],
    faqs: [
      { question: 'Do you work with non-CDL hotshot operations?', answer: 'We can assess an inquiry using the actual equipment and operating profile. A label alone does not establish load eligibility or regulatory requirements. The carrier must confirm its licensing and operating obligations.' },
      { question: 'Can you combine partial loads on my trailer?', answer: 'Only after compatibility, space, loading order, terms and scheduling have been reviewed and you approve the arrangement. Multiple shipments are not assumed to be workable.' },
      { question: 'Is there a guaranteed number of hotshot loads?', answer: 'No. Availability varies with equipment, location, requirements and the freight market. Service capability is reviewed before onboarding.' },
    ],
    related: [{ label: 'Flatbed dispatch', href: '/equipment/flatbed' }, { label: 'Onboarding checklist', href: '/resources/carrier-onboarding-checklist' }, { label: 'Rate per mile guide', href: '/resources/evaluate-freight-rate-per-mile' }],
  },
  {
    slug: 'cargo-van', title: 'Cargo van and sprinter van dispatch', metaTitle: `Cargo & Sprinter Van Dispatch | ${getDispatchRateLabel('cargo-van')} Fee`,
    description: `Cargo and sprinter van dispatch at an ${getDispatchRateLabel('cargo-van')} fee with a dedicated dispatcher. Review dimensions, payload, expedited freight and lanes before confirming fit.`,
    eyebrow: 'Compact equipment. Exact-fit freight.',
    intro: 'Cargo vans and sprinter-style vans need freight that fits their door openings, interior space and payload. Rai Dispatch reviews the vehicle and your operating plan before confirming whether dispatch support is available.',
    availability: 'Cargo van and sprinter van service is subject to equipment, location, lane and service-capability review. Courier contracts, dedicated routes and expedited loads are not guaranteed.',
    highlights: ['Door and interior dimensions reviewed', 'Payload and loading access checked', 'Service fit assessed before onboarding'],
    sections: [
      { id: 'fit', title: 'Measure the space that freight can actually use', paragraphs: ['Cargo length, wheel-well clearance, interior height and door openings affect whether a shipment fits. Pallet count alone can be misleading. Share dimensions, usable payload, available loading equipment and any restrictions on how cargo can be loaded.', 'We clarify whether the delivery requires a dock, forklift access, hand unloading or additional labor. A vehicle suitable for one expedited shipment may not suit the next even when both are described as van freight.'] },
      { id: 'availability', title: 'Distinguish dispatch from a promised delivery contract', paragraphs: ['A dispatch service searches and coordinates within an agreed scope. It does not automatically provide a parcel route, courier contract or continuous stream of same-day work. Local and expedited operations may require different relationships and onboarding processes.', 'Before starting, we review your location, travel radius, availability and vehicle. If your requirements fall outside the support we can provide, the fit needs to be resolved before an agreement is signed.'] },
      { id: 'economics', title: 'Assess waiting and repositioning as part of the trip', paragraphs: ['Smaller freight can still involve a long empty drive, a narrow pickup window or unpaid waiting. Evaluate total time and miles alongside the rate, especially when the destination has limited next-load options.', `If service is confirmed, the percentage fee is ${getDispatchRateLabel('cargo-van')} under the written agreement. You approve the load and its handling requirements; we do not promise earnings or imply that every van qualifies for every platform.`], bullets: ['Give exact door openings and the narrowest usable interior width.', 'Clarify delivery access and unloading responsibility.', 'Set a maximum empty-mile radius and realistic response time.'] },
    ],
    checklistTitle: 'Prepare for a cargo van review',
    checklist: ['Interior and door-opening measurements', 'Payload and cargo-handling limitations', 'Operating documents and insurance information', 'Base area, travel radius and overnight availability'],
    faqs: [
      { question: 'Do you dispatch sprinter vans?', answer: 'We review cargo van and sprinter-style vehicle inquiries individually. Dispatch availability depends on vehicle fit, location, lane preferences and service capability.' },
      { question: 'Will I receive a dedicated courier route?', answer: 'A dedicated courier route is not included or guaranteed by a general dispatch inquiry. Any specific route, schedule or contract must be separately confirmed.' },
      { question: 'Can I stay local with a cargo van?', answer: 'You can request local-only work, but service availability and suitable freight must be assessed for your area. A limited radius can substantially narrow the options.' },
    ],
    related: [{ label: 'Box truck dispatch', href: '/equipment/box-truck' }, { label: 'Choosing a dispatcher', href: '/resources/how-to-choose-a-truck-dispatcher' }, { label: 'Discuss equipment availability', href: '/contact' }],
  },
];

export const SERVICE_CONTENT: DispatchContent[] = [
  ...ADDITIONAL_SERVICES,
  {
    slug: 'rate-negotiation', title: 'Freight rate negotiation for carriers', metaTitle: 'Truck Dispatch Rate Negotiation Services',
    description: 'Rate negotiation support for owner-operators and fleets. Compare total miles, schedule and accessorial terms before approving freight with Rai Dispatch.',
    eyebrow: 'Understand the trip before accepting the rate.',
    intro: 'A useful rate discussion starts with what the trip requires. Rai Dispatch helps carriers review pickup distance, equipment needs, appointments and written terms before approving a freight rate.',
    highlights: ['Total-mile evaluation', 'Accessorial terms clarified', 'You approve the final rate'],
    sections: [
      { id: 'numbers', title: 'Compare the load with your own operating costs', paragraphs: ['The advertised rate per loaded mile does not account for every mile your truck will travel. We discuss the empty drive to pickup, loaded route, likely repositioning and time the truck will be committed. The comparison works best when you provide your own operating cost target.', 'Your minimum acceptable rate can vary with the lane, delivery time and available alternatives. We help organize the information and negotiate with the broker; we do not promise a rate above the market or a profit on every trip.'] },
      { id: 'terms', title: 'Put the important terms in writing', paragraphs: ['Ask whether the quote is all-in or separates linehaul, fuel surcharge and other charges. Tarping, extra stops, driver assist, detention and truck-ordered-not-used terms should be clarified before booking when they apply.', 'A verbal understanding is difficult to rely on after a dispute. We help review the rate confirmation and request written clarification of material terms. Additional compensation still depends on the agreement, evidence and the responsible party’s approval.'], bullets: ['Compare compensation with total miles and total time.', 'Confirm pickup and delivery requirements before accepting.', 'Get any approved rate changes reflected in writing.'] },
    ],
    checklistTitle: 'Useful information for rate discussions',
    checklist: ['Current location and maximum pickup deadhead', 'Your operating-cost target and rate preferences', 'Equipment, handling limits and available schedule', 'Home-time or destination requirements'],
    faqs: [
      { question: 'Can you guarantee the highest rate on every load?', answer: 'No. Rates depend on available freight, capacity, location and shipment requirements. We negotiate using the trip details and your preferences without guaranteeing a market outcome.' },
      { question: 'Who accepts the final freight rate?', answer: 'You retain the final decision on the load and its terms. Dispatch presents the relevant details and coordinates a booking after approval.' },
      { question: 'Is negotiation included in the dispatch fee?', answer: `Rate negotiation is part of our dispatch support. The percentage plan is ${DISPATCH_RATE_RANGE} by equipment; scope, billing base and any specific exclusions are agreed before service.` },
    ],
    related: [{ label: 'Freight rate calculation guide', href: '/resources/evaluate-freight-rate-per-mile' }, { label: 'Dispatch pricing', href: '/pricing' }, { label: 'Load booking', href: '/services/load-booking' }],
  },
  {
    slug: 'load-booking', title: 'Truck load search and booking support', metaTitle: 'Truck Load Booking & Dispatch Services',
    description: 'Carrier-approved load booking for owner-operators and small fleets. Equipment-fit review, broker requirements and rate-confirmation coordination.',
    eyebrow: 'A clear path from available truck to approved load.',
    intro: 'Rai Dispatch searches for freight around your equipment, location and schedule, then helps coordinate the details needed for an informed booking. Your approval stays at the center of the process.',
    highlights: ['Equipment and lane preferences', 'Broker requirements reviewed', 'Written confirmations organized'],
    sections: [
      { id: 'search', title: 'Define a workable search before calling on loads', paragraphs: ['We need an accurate empty location, available time, equipment specifications and operating preferences. This helps screen out loads that cannot fit your truck or schedule before time is spent pursuing them.', 'Search criteria include pickup radius, destination preferences, home time and handling limits. The available freight and broker requirements determine which opportunities can move forward; dispatch does not guarantee access to a private shipper network or a dedicated contract.'] },
      { id: 'booking', title: 'Review the details, approve, then confirm', paragraphs: ['A load needs more than a rate and destination. Commodity, weight, appointments, stops, loading method and special instructions are reviewed alongside the broker’s onboarding requirements. Missing details should be resolved before the carrier agrees to move.', 'After approval, we help coordinate the rate confirmation and dispatch information. Keep the driver’s truck status current so changes can be communicated quickly and the next pickup is not scheduled from an outdated empty time.'], bullets: ['Provide accurate truck specifications and availability.', 'Review the load and confirm your acceptance.', 'Keep written booking details accessible to the driver.'] },
    ],
    checklistTitle: 'Before the load search begins',
    checklist: ['Carrier onboarding completed for the agreed scope', 'Truck location, dimensions, payload and readiness', 'Driver availability and lane preferences', 'Clear process for approving each load'],
    faqs: [
      { question: 'Can you guarantee a load on my first day?', answer: 'No. Timing depends on completed onboarding, broker acceptance, equipment and available freight. We discuss readiness and expectations before starting the search.' },
      { question: 'Do I have to accept every load you find?', answer: 'No. You approve the freight and terms. Your feedback helps refine the search, while recognizing that tighter requirements may reduce availability.' },
      { question: 'Do you work under my authority?', answer: 'Dispatch support is provided for your carrier operation under the written agreement. You retain your carrier authority, equipment and responsibility for accepting and operating the load.' },
    ],
    related: [{ label: 'Equipment we review', href: '/equipment' }, { label: 'Carrier onboarding checklist', href: '/resources/carrier-onboarding-checklist' }, { label: 'Broker communication', href: '/services/broker-communication' }],
  },
  {
    slug: 'broker-communication', title: 'Broker communication for owner-operators', metaTitle: 'Broker Communication & Dispatch Support',
    description: 'Dispatch support for broker calls, load details, rate confirmations and shipment updates. Keep communication organized while you operate your truck.',
    eyebrow: 'Keep the load details and the people aligned.',
    intro: 'Rai Dispatch helps coordinate broker conversations so load instructions, updates and questions reach the right people. You keep control of your carrier operation and the decisions that affect it.',
    highlights: ['Load instructions clarified', 'Status updates coordinated', 'Changes documented'],
    sections: [
      { id: 'before-pickup', title: 'Resolve important questions before pickup', paragraphs: ['We help collect pickup numbers, addresses, appointments, commodity details and contact instructions. If the posting and the rate confirmation disagree, we ask for clarification before the driver relies on either version.', 'Broker onboarding requirements can differ. Authority history, insurance or equipment requirements may affect eligibility. Dispatch assistance does not override those requirements or guarantee that a broker will approve the carrier.'] },
      { id: 'updates', title: 'Keep shipment changes visible', paragraphs: ['An updated appointment, a delayed truck or a facility problem should not get lost between phone calls. Share accurate status information promptly; we help coordinate updates and request written confirmation when material instructions change.', 'For delays and accessorial requests, clear timestamps, receipts and supporting details help the conversation. We assist with follow-ups, but cannot guarantee a broker’s response time, claim approval or payment.'], bullets: ['Confirm who should receive updates and by which channel.', 'Report delays as soon as they are known.', 'Keep written records of approved changes to the load.'] },
    ],
    checklistTitle: 'Set up a clear communication plan',
    checklist: ['Driver and carrier contact details', 'Approved dispatch communication channels', 'Broker references and shipment numbers', 'Escalation process for schedule or load changes'],
    faqs: [
      { question: 'Will I still be able to talk with the broker?', answer: 'Yes. Dispatch support helps coordinate communication; it does not remove your role as the carrier or prevent direct communication when needed.' },
      { question: 'Does dispatch guarantee broker payment?', answer: 'No. Payment obligations belong to the parties to the load agreement. Review broker information and payment terms and, where relevant, discuss credit approval with your factoring provider.' },
      { question: 'Can you change load instructions without my approval?', answer: 'Material changes should be communicated and approved by the responsible parties. We coordinate clarification rather than independently changing your operating commitments.' },
    ],
    related: [{ label: 'Paperwork support', href: '/services/paperwork-support' }, { label: 'Scheduling and follow-ups', href: '/services/scheduling' }, { label: 'Choosing a truck dispatcher', href: '/resources/how-to-choose-a-truck-dispatcher' }],
  },
  {
    slug: 'route-strategy', title: 'Truck route and freight lane strategy', metaTitle: 'Truck Route & Freight Lane Planning Support',
    description: 'Dispatch lane planning around total miles, home time and the next load. Regional and OTR planning support for owner-operators and small fleets.',
    eyebrow: 'Plan the load after this one.',
    intro: 'A lane decision affects where the truck ends up, when it becomes available and what it costs to move again. Rai Dispatch helps carriers compare those tradeoffs before approving the next shipment.',
    highlights: ['Deadhead considered', 'Home-time preferences respected', 'Regional and OTR planning'],
    sections: [
      { id: 'next-load', title: 'Evaluate the destination as well as the outbound load', paragraphs: ['A shipment with an attractive rate may end far from your next practical pickup or deliver after nearby facilities close. We discuss delivery timing, likely repositioning and available follow-on options rather than looking at one loaded leg in isolation.', 'Freight availability changes, so a backhaul remains a possibility until it is confirmed. A plan should leave room for delays and avoid treating an unbooked reload as guaranteed revenue.'] },
      { id: 'constraints', title: 'Build the plan around the carrier’s limits', paragraphs: ['Your home time, equipment, driver schedule and preferred operating regions define the plan. Regional, local and OTR operations need different search areas. A dispatcher needs accurate availability to suggest a workable sequence of loads.', 'We support lane and scheduling discussions, not truck navigation. The carrier and driver must use suitable routing information and verify road restrictions, clearances, weather and legal operating limits for the actual vehicle and load.'], bullets: ['Review pickup deadhead and possible post-delivery repositioning.', 'Leave realistic time for loading, breaks and appointments.', 'Reassess the plan when truck status or market options change.'] },
    ],
    checklistTitle: 'Tell us what a good week looks like',
    checklist: ['Preferred home date and location', 'Regions and lanes you accept or avoid', 'Driver availability and equipment constraints', 'Maximum deadhead and trip-length preferences'],
    faqs: [
      { question: 'Can you keep me on a dedicated lane?', answer: 'You can request a preferred lane. A dedicated schedule or contract must be confirmed separately; the available freight does not guarantee the same lane every week.' },
      { question: 'Is this turn-by-turn truck routing?', answer: 'No. This is freight lane and scheduling support. Drivers and carriers remain responsible for selecting and verifying suitable routes for their vehicle and cargo.' },
      { question: 'Can you eliminate empty miles?', answer: 'No. We consider deadhead during load selection, but some empty travel may be necessary. The goal is an informed trip decision, not a promise of zero deadhead.' },
    ],
    related: [{ label: 'US regional considerations', href: '/service-areas' }, { label: 'Rate per mile guide', href: '/resources/evaluate-freight-rate-per-mile' }, { label: 'Dry van dispatch', href: '/equipment/dry-van' }],
  },
  {
    slug: 'paperwork-support', title: 'Truck dispatch paperwork support', metaTitle: 'Rate Confirmation, BOL & Dispatch Paperwork Support',
    description: 'Help organizing carrier packets, rate confirmations, BOLs, PODs and accessorial documentation. Clear dispatch paperwork support for US carriers.',
    eyebrow: 'Keep the load record together.',
    intro: 'Paperwork supports every stage of a shipment, from onboarding to payment follow-up. Rai Dispatch helps coordinate the documents within your dispatch agreement so missing details can be addressed promptly.',
    highlights: ['Rate confirmations organized', 'BOL and POD follow-ups', 'Accessorial documents collected'],
    sections: [
      { id: 'load-record', title: 'Start with a complete load record', paragraphs: ['A useful record connects the broker, shipment reference, agreed rate, pickup and delivery details, and any written changes. We help review dispatch documents and identify missing information that needs clarification.', 'The carrier must provide accurate business documents and approve the agreements it enters. We can assist with coordination of carrier packets, insurance-certificate requests and other onboarding items, but do not issue insurance, operating authority or legal certifications.'] },
      { id: 'delivery', title: 'Make the delivery documents usable', paragraphs: ['Clear, complete images of the bill of lading and signed proof of delivery are easier to process than cropped or unreadable photos. Record the shipment reference and keep all pages together. For expenses or delays, retain receipts and relevant timestamps.', 'Where agreed, we help coordinate document follow-ups with the broker or your factoring provider. Dispatch paperwork assistance does not replace accounting, legal advice, compliance management or a guarantee of payment.'], bullets: ['Check that dates, signatures and shipment references are legible.', 'Keep approved rate changes with the original confirmation.', 'Retain receipts and evidence for requested accessorial charges.'] },
    ],
    checklistTitle: 'Keep these documents accessible',
    checklist: ['Current carrier onboarding documents', 'Rate confirmation and written amendments', 'BOL and signed delivery records', 'Expense receipts and delay timestamps'],
    faqs: [
      { question: 'Can you work with my factoring company?', answer: 'We can discuss document coordination with your existing factoring provider. Confirm the required process and scope during onboarding; factoring approval and funding remain the provider’s decisions.' },
      { question: 'Do you provide compliance or legal services?', answer: 'This service is dispatch-related document support. Regulatory filings, legal advice, insurance and full compliance management are not automatically included.' },
      { question: 'Do you guarantee detention payment?', answer: 'No. We can help organize and submit supporting information within the agreed scope. Payment depends on the written terms, evidence and approval by the responsible party.' },
    ],
    related: [{ label: 'Carrier onboarding checklist', href: '/resources/carrier-onboarding-checklist' }, { label: 'Broker communication', href: '/services/broker-communication' }, { label: 'Dispatch fee details', href: '/pricing' }],
  },
  {
    slug: 'scheduling', title: 'Truck appointment scheduling and follow-ups', metaTitle: 'Truck Appointment Scheduling & Dispatch Follow-ups',
    description: 'Dispatch coordination for pickup and delivery appointments, shipment updates and delay follow-ups. Plan around real driver and equipment availability.',
    eyebrow: 'Make the schedule match the operation.',
    intro: 'A load works only when its timing works. Rai Dispatch helps coordinate pickup and delivery appointments using the carrier’s actual availability, then follows up as conditions change.',
    highlights: ['Pickup and delivery coordination', 'Status and delay follow-ups', 'Time-zone details clarified'],
    sections: [
      { id: 'windows', title: 'Clarify the appointment before planning the next load', paragraphs: ['A first-come, first-served window is different from a firm appointment. We help clarify arrival instructions, facility hours, local time zones and whether a pickup or delivery can be adjusted. A posted date alone is not enough to build a dependable schedule.', 'Share current truck status and driver availability. Transit plans need to leave realistic time for loading, unloading and required rest. The driver and carrier remain responsible for safe operation and applicable hours-of-service requirements.'] },
      { id: 'changes', title: 'Communicate early when the plan changes', paragraphs: ['Mechanical problems, traffic and facility delays can affect the next appointment. Prompt updates allow the dispatch desk to contact the broker, request revised instructions and help keep the record of what changed.', 'We can assist with follow-ups and documentation for detention requests under the load terms. An appointment change, detention approval or after-hours response is not guaranteed; confirm the support arrangement and escalation contacts during onboarding.'], bullets: ['Record the appointment time zone and check-in requirements.', 'Notify dispatch when arrival or empty times change.', 'Keep arrival, departure and delay details for follow-up.'] },
    ],
    checklistTitle: 'Share the schedule essentials',
    checklist: ['Current loaded or empty status', 'Available pickup time and driver schedule', 'Appointment references and facility instructions', 'Contacts for time-sensitive changes'],
    faqs: [
      { question: 'Can you change a shipper or receiver appointment?', answer: 'We can request a change and communicate the response. The facility or responsible broker controls availability, so a requested adjustment may not be approved.' },
      { question: 'Do you provide around-the-clock dispatch coverage?', answer: 'The published dispatch desk hours are Monday through Saturday, 8 AM to 6 PM Central Time. Confirm any load-specific escalation or after-hours arrangement before booking.' },
      { question: 'Will detention automatically be paid after a delay?', answer: 'No. Free time, notification requirements, evidence and payment terms vary by load. Clarify them in writing before pickup and document the delay.' },
    ],
    related: [{ label: 'Reefer dispatch', href: '/equipment/reefer' }, { label: 'Route and lane strategy', href: '/services/route-strategy' }, { label: 'Paperwork support', href: '/services/paperwork-support' }],
  },
];

export type CarrierGuide = DispatchContent & { readTime: string; published: string; sources?: ContentLink[] };

export const GUIDES: CarrierGuide[] = [
  ...ADDITIONAL_GUIDES,
  {
    slug: 'evaluate-freight-rate-per-mile', title: 'How to evaluate a freight rate before booking', metaTitle: 'Freight Rate Per Mile: How to Evaluate a Load',
    description: 'Compare loaded miles, deadhead, dispatch fees and trip time with a worked example. A practical rate-per-mile checklist for owner-operators.',
    eyebrow: 'Carrier guide · Load decisions', readTime: '6 minute read', published: '2026-09-24',
    intro: 'A posted rate per mile is a starting point. To decide whether a load fits your business, compare its compensation with every mile, the time it uses and your own operating costs. The example below is arithmetic, not a market-rate forecast.',
    highlights: ['Count every trip mile', 'Separate revenue from profit', 'Include the next available day'],
    sections: [
      { id: 'total-miles', title: '1. Divide the load pay by all the relevant miles', paragraphs: ['Loaded rate per mile equals the agreed load pay divided by loaded miles. Total-trip rate per mile includes the empty drive to pickup, plus any repositioning you include in your plan. Using the same definition for every candidate load makes the comparison more useful.', 'Suppose a load pays $2,000, runs 800 loaded miles and requires 100 empty miles to pickup. The loaded rate is $2.50 per mile, while the rate across the 900 known trip miles is about $2.22. A later empty reposition would lower that figure further.'], table: { caption: 'Illustrative load evaluation — invented numbers for calculation only', headers: ['Item', 'Example'], rows: [['Agreed load pay', '$2,000'], ['Loaded miles', '800'], ['Empty miles to pickup', '100'], ['Known total miles', '900'], ['Gross per loaded mile', '$2.50'], ['Gross per known total mile', '$2.22']] } },
      { id: 'costs', title: '2. Include dispatch and operating costs', paragraphs: ['For this dry van example, the 5% dispatch fee on the full $2,000 billing base is $100. The remaining $1,900 is about $2.11 per known total mile before fuel, maintenance, tires, insurance, financing, driver pay, taxes and other expenses. It is not profit. Reefer and flatbed dispatch also use 5%; use your equipment’s rate for other truck types.', 'Use your own recent records for fuel consumption and operating costs. Avoid subtracting a cost twice: if your all-in cost-per-mile figure already includes insurance or maintenance, do not add the same expense again. Fixed costs still matter during days the truck does not move.'] },
      { id: 'time', title: '3. Compare the time the load commits', paragraphs: ['A delivery appointment can turn a short run into a multi-day commitment. Consider pickup readiness, live loading, unloading, extra stops and the next realistic available day. Two loads with the same rate per mile can have very different effects on the week.', 'Ask what happens if an appointment is missed or loading runs late. Detention, layover and other additional charges should be evaluated against the written terms, not counted as certain income before approval.'] },
      { id: 'destination', title: '4. Review where the load leaves your truck', paragraphs: ['Check whether the destination fits your next lane, home-time plan and equipment. Potential reloads can inform the decision, but an unbooked load should not be counted as guaranteed revenue.', 'For power only work, include trailer-return obligations. For reefers, consider refrigeration fuel and washouts. For flatbeds, consider tarping and site time. For box trucks and vans, check delivery access and driver labor. The right comparison uses the actual job.'] },
      { id: 'decision', title: '5. Make a repeatable booking decision', paragraphs: ['Write down the load pay, known total miles, key costs, appointment times and next destination before accepting. Over time, compare estimated and actual results. That feedback helps refine your pickup radius, preferred lanes and minimum acceptable terms.', 'Rai Dispatch supports rate discussions and lane planning. You decide whether the load meets your operating needs; no calculation can guarantee market rates, future freight or profit.'] },
    ],
    checklistTitle: 'Before you approve the rate',
    checklist: ['Confirm whether quoted pay includes fuel and other charges', 'Count pickup deadhead and known return obligations', 'Check the dispatch-fee calculation base', 'Review appointments, extra work and next-load timing'],
    faqs: [
      { question: 'Is a higher rate per loaded mile always better?', answer: 'No. Deadhead, waiting, handling requirements and destination can outweigh the headline rate. Compare the complete trip using consistent assumptions.' },
      { question: 'Is revenue after dispatch fees my profit?', answer: 'No. Fuel, maintenance, insurance, equipment costs, driver compensation and other operating expenses still need to be accounted for.' },
      { question: 'What rate per mile should every truck accept?', answer: 'There is no universal number. Your equipment, costs, lane, schedule and alternatives determine whether a specific load is workable.' },
    ],
    related: [{ label: 'Rate negotiation support', href: '/services/rate-negotiation' }, { label: 'Dispatch fees explained', href: '/resources/truck-dispatch-fees' }, { label: 'Lane planning', href: '/services/route-strategy' }],
  },
  {
    slug: 'truck-dispatch-fees', title: 'Truck dispatch fees by equipment', metaTitle: `Truck Dispatch Fees by Equipment | ${DISPATCH_RATE_RANGE}`,
    description: `Compare ${DISPATCH_RATE_RANGE} truck dispatch fees by equipment. See dry van, reefer, flatbed, hotshot, box truck and cargo van pricing, with a dedicated dispatcher included.`,
    eyebrow: 'Carrier guide · Dispatch pricing', readTime: '5 minute read', published: '2026-09-24',
    intro: `Rai Dispatch charges ${DISPATCH_RATE_RANGE} according to equipment type and provides a dedicated dispatcher. Use the schedule below to find your rate, then confirm what revenue the fee applies to, the included service scope and the billing terms before starting.`,
    highlights: ['Exact rates by equipment', 'Dedicated dispatcher provided', 'Clear billing terms'],
    sections: [
      { id: 'equipment-rates', title: 'The dispatch rate for your truck', paragraphs: ['The equipment type determines the published percentage. A dedicated dispatcher is provided to learn your equipment, preferred lanes and schedule, coordinate the agreed dispatch work and present loads for your approval.', 'For a mixed fleet, use the rate for the equipment assigned to each dispatched load. Confirm the equipment classification and billing base in the agreement. Specialized operations still require a service-fit review before onboarding.'], table: { caption: 'Rai Dispatch percentage fees by equipment', headers: ['Equipment', 'Dispatch fee'], rows: [['Dry van', getDispatchRateLabel('dry-van')], ['Reefer', getDispatchRateLabel('reefer')], ['Flatbed', getDispatchRateLabel('flatbed')], ['Hotshot', getDispatchRateLabel('hotshot')], ['Box truck', getDispatchRateLabel('box-truck')], ['Power only', getDispatchRateLabel('power-only')], ['Step deck', getDispatchRateLabel('step-deck')], ['Cargo van / Sprinter van', getDispatchRateLabel('cargo-van')], ['All other equipment', `${DEFAULT_DISPATCH_RATE}%`]] } },
      { id: 'percentage', title: 'Calculate the fee using your equipment rate', paragraphs: ['Multiply the agreed revenue base by the equipment’s percentage. For example, a dry van, reefer or flatbed load with a $2,000 billing base has a $100 dispatch fee at 5%. Hotshot, box truck and cargo van fees differ because their percentages differ.', 'The examples below use the same hypothetical $2,000 billing base to make that difference clear. They are fee calculations, not live load offers or earnings forecasts. The amount remaining is before fuel, insurance, maintenance and other carrier expenses.'], table: { caption: 'Illustrative dispatch fees on a $2,000 billing base', headers: ['Equipment example', 'Percentage', 'Dispatch fee'], rows: [['Dry van, reefer or flatbed', 'dry-van'], ['Hotshot', 'hotshot'], ['Box truck, power only or step deck', 'box-truck'], ['Cargo van or Sprinter van', 'cargo-van']].map(([equipment, slug]) => [equipment, getDispatchRateLabel(slug), `$${2000 * getDispatchRate(slug) / 100}`]) } },
      { id: 'base', title: 'Ask what counts toward the billing base', paragraphs: ['Two quotes with the same percentage may produce different invoices. Ask whether the fee applies to linehaul only or also to fuel surcharge, detention, layover, extra stops, tarping and other accessorials. Clarify how a cancellation, unpaid load or payment dispute is handled.', 'Put those answers in the agreement and compare a sample invoice with a sample rate confirmation. That exercise often reveals more than comparing headline percentages alone.'] },
      { id: 'scope', title: 'Compare the actual services', paragraphs: ['A dispatch arrangement may include load search, rate negotiation, booking coordination, broker communication, lane planning and document follow-ups. Check who does each task and which items require a separate arrangement.', 'Ask about the dispatcher contact, desk hours, escalation process and how you approve loads. Factoring, compliance management, insurance, permits, accounting and legal advice should not be assumed to be included just because a plan is described as full service.'] },
      { id: 'alternatives', title: 'Compare a fixed fee using the same assumptions', paragraphs: ['Some dispatchers quote a fixed weekly or monthly fee. To compare one with a percentage quote, use a realistic revenue scenario and the same service scope. For example, a hypothetical $300 weekly fee equals 5% of a $6,000 billing base; below that base it is a larger share, and above it a smaller share.', 'That comparison is arithmetic, not a recommendation or a current Rai Dispatch fixed-fee offer. Ask how downtime, holidays and weeks with no booked freight are billed before deciding which structure fits your operation.'] },
      { id: 'agreement', title: 'Check billing and cancellation before starting', paragraphs: ['Confirm when fees are earned, when invoices are issued, accepted payment methods and any notice required to end service. Keep a copy of the signed agreement and the quote you accepted.', 'Compare the total cost alongside communication, included services and fit for your equipment. A lower percentage is useful only when the scope and billing base work for your operation.'] },
    ],
    checklistTitle: 'Questions to ask about a quote',
    checklist: ['What is my exact percentage and billing base?', 'How are accessorials and cancelled loads handled?', 'What is included, and what is outside the service?', 'When do I pay, and how do I end the agreement?'],
    faqs: [
      { question: 'What percentage does Rai Dispatch charge for each equipment type?', answer: `Dry van, reefer and flatbed dispatch is ${getDispatchRateLabel('dry-van')}; hotshot is ${getDispatchRateLabel('hotshot')}; box truck is ${getDispatchRateLabel('box-truck')}; cargo and Sprinter van dispatch is ${getDispatchRateLabel('cargo-van')}. All other equipment, including power only and step deck, is ${DEFAULT_DISPATCH_RATE}%. The agreement confirms the equipment classification and billing base.` },
      { question: 'Is a dedicated dispatcher included?', answer: 'Yes. Rai Dispatch provides a dedicated dispatcher who learns your equipment, lanes and schedule. Confirm your direct contact details, desk hours and backup process during onboarding.' },
      { question: 'Does the fee include fuel, insurance or factoring?', answer: 'No. A dispatch fee pays for the agreed dispatch service. Carrier operating expenses and third-party services are separate unless a specific agreement states otherwise.' },
      { question: 'Should I choose a dispatcher only by the percentage?', answer: 'No. Compare the billing base, service scope, communication, contract terms and fit for your equipment alongside the fee.' },
    ],
    related: [{ label: 'Rai Dispatch pricing', href: '/pricing' }, { label: 'How to choose a dispatcher', href: '/resources/how-to-choose-a-truck-dispatcher' }, { label: 'Evaluate a freight rate', href: '/resources/evaluate-freight-rate-per-mile' }],
  },
  {
    slug: 'how-to-choose-a-truck-dispatcher', title: 'How to choose a truck dispatcher', metaTitle: 'How to Choose a Truck Dispatch Service',
    description: 'A practical dispatcher selection checklist: equipment fit, fees, load approval, communication and contract terms for owner-operators and small fleets.',
    eyebrow: 'Carrier guide · Choosing support', readTime: '6 minute read', published: '2026-09-24',
    intro: 'The best fit for your carrier business depends on the work you run and the support you need. Use a specific conversation and a written agreement to evaluate a dispatcher instead of relying on revenue promises or broad claims.',
    highlights: ['Ask about your actual equipment', 'Understand who approves loads', 'Compare a written agreement'],
    sections: [
      { id: 'equipment', title: '1. Test the equipment knowledge', paragraphs: ['Describe a typical trip and ask what the dispatcher needs to know before searching. A reefer discussion should cover temperature instructions and appointments. A flatbed discussion should cover dimensions, loading and tarping. A box truck discussion should include door openings, payload and delivery access.', 'For hotshot, step deck or cargo van operations, describe your actual configuration and operating limits. Confirm current service availability for your equipment and preferred lanes before signing.'] },
      { id: 'approval', title: '2. Confirm your decision-making role', paragraphs: ['Ask how a proposed load reaches you, what information is included and how approval is recorded. You should understand the rate, schedule and handling requirements before the truck is committed.', 'Discuss what happens when you decline a load or your availability changes. A dispatcher needs timely information, while the carrier remains responsible for its operation. Clear roles are more useful than a vague promise that someone will handle everything.'] },
      { id: 'communication', title: '3. Ask who answers and when', paragraphs: ['Find out how to contact the dispatch desk and what happens if your usual contact is unavailable. Confirm operating hours, update expectations and an escalation process for time-sensitive load issues.', 'Ask for an example of how the team handles a changed delivery appointment or a delayed pickup. Look for a process that gathers facts, informs the relevant parties and documents agreed changes, rather than an unsupported promise that every problem will be solved immediately.'] },
      { id: 'cost', title: '4. Compare fees and scope in writing', paragraphs: ['Review the percentage or fixed fee, billing base, invoice timing, cancellation terms and included tasks. Ask whether accessorials, cancelled loads or disputed payments affect dispatch billing.', `Rai Dispatch’s advertised percentage fee is ${DISPATCH_RATE_RANGE} by equipment, with terms confirmed before service. The same questions should be asked of us as of any other provider. A fee comparison is meaningful only when the included scope and calculation base are comparable.`] },
      { id: 'verification', title: '5. Verify the business relationships you rely on', paragraphs: ['Use the legal business name and contact details in the agreement, and keep copies of the documents you sign. Treat guaranteed income, guaranteed broker approval or unclear payment instructions as reasons to ask for evidence and clarification.', 'For the carrier or broker involved in an actual shipment, FMCSA directs users to its Licensing and Insurance system to look up interstate operating authority and insurance information. That check concerns the transportation entity; it is not a certification of a dispatch company or a guarantee of payment.'] },
      { id: 'review', title: '6. Agree how to review the service', paragraphs: ['Track useful operating measures such as total miles, waiting time, completed loads, document turnaround and whether the work fits your home-time plan. Gross revenue alone can hide a costly week.', 'Agree a review cadence and share accurate results. Good decisions need feedback from the operation, particularly when a lane, equipment type or driver schedule changes.'] },
    ],
    checklistTitle: 'Use this shortlist on your first call',
    checklist: ['What experience and current availability fit my equipment?', 'How do I approve or decline a load?', 'Who is my contact and what are the support hours?', 'Can I review the full fee and cancellation terms now?'],
    faqs: [
      { question: 'Can any dispatcher guarantee weekly income?', answer: 'A guarantee should be examined carefully. Freight revenue and operating profit depend on conditions the dispatcher does not fully control, including market rates, equipment availability, delays and expenses.' },
      { question: 'Is a dispatcher the same as a freight broker?', answer: 'The roles and responsibilities are different and should be clear in your agreement. Rai Dispatch offers carrier dispatch support; it does not present its dispatch service as a freight brokerage or motor carrier.' },
      { question: 'Should I ask for references?', answer: 'Yes. Ask for references the provider is authorized to share and discuss operations comparable to yours. Treat anonymous reviews or unsupported performance claims as insufficient evidence on their own.' },
    ],
    related: [{ label: 'Our dispatch services', href: '/services' }, { label: 'Fee comparison guide', href: '/resources/truck-dispatch-fees' }, { label: 'Talk through your operation', href: '/contact' }],
    sources: [{ label: 'FMCSA: where to look up operating authority and insurance', href: 'https://www.fmcsa.dot.gov/faq/where-do-i-go-look-motor-carrier-broker-or-freight-forwarders-interstate-operating-authority' }],
  },
  {
    slug: 'carrier-onboarding-checklist', title: 'Truck dispatch onboarding checklist', metaTitle: 'Carrier Dispatch Onboarding Checklist',
    description: 'Prepare carrier documents, equipment specifications, lane preferences and dispatch terms. A clear onboarding checklist for owner-operators and fleets.',
    eyebrow: 'Carrier guide · Getting started', readTime: '5 minute read', published: '2026-09-24',
    intro: 'A useful onboarding process establishes what the truck can do, when it can work and how the carrier approves freight. Gather the business documents first, then give your dispatcher the operating details needed for a realistic load search.',
    highlights: ['Documents and equipment details', 'Operating preferences', 'Written terms and approval process'],
    sections: [
      { id: 'business', title: '1. Prepare the carrier business information', paragraphs: ['Have your legal business name, contact details, relevant USDOT and MC information, W-9 and current insurance information available. The documents requested depend on your operation and the brokers involved. Send sensitive documents only through the submission process agreed with the team.', 'Check that the business name and contact information are consistent across the documents. If an insurance certificate is required, coordinate with your insurance provider rather than editing the certificate yourself. Onboarding assistance does not create authority or insurance coverage.'] },
      { id: 'truck', title: '2. Record the actual equipment specifications', paragraphs: ['Provide trailer or cargo-space dimensions, usable payload and the current equipment condition. Include loading and handling capabilities such as liftgate, pallet jack, tarps, ramps or temperature control when relevant.', 'Be specific about restrictions. A truck’s advertised length, a generic equipment label or a photo is not enough to establish whether every load will fit. For power only, explain the tractor configuration and trailer arrangements you can accept.'], bullets: ['Dry van: interior condition, trailer dimensions and handling preferences.', 'Reefer: unit capabilities and relevant temperature limitations.', 'Open deck: deck space, payload, tarps and securement equipment.', 'Box truck or cargo van: door openings, interior measurements and loading access.'] },
      { id: 'lanes', title: '3. Define a workable search area and schedule', paragraphs: ['Share the truck’s current location, first available pickup time, preferred regions and home-time goals. Identify destinations you avoid, maximum empty miles and whether overnight or weekend appointments fit the operation.', 'The driver’s availability must be accurate. A load search based on a future empty time needs to be updated if the current delivery changes. Avoid promising availability just to expand the search; an unworkable appointment can create problems for everyone.'] },
      { id: 'agreement', title: '4. Review the dispatch agreement', paragraphs: [`Confirm the service scope, percentage or other fee structure, billing base, invoice timing and cancellation terms. Rai Dispatch charges equipment-specific dispatch fees of ${DISPATCH_RATE_RANGE}, with billing terms agreed before service.`, 'Set the load-approval process and identify authorized carrier contacts. Discuss how rate confirmations, signed delivery records and accessorial documents will be exchanged. If you use factoring, clarify any relevant document and broker-approval process with that provider.'] },
      { id: 'expectations', title: '5. Separate onboarding readiness from load availability', paragraphs: ['Having a complete packet makes review easier, but it does not guarantee broker approval or immediate freight. Authority history, insurance, equipment, location and shipment requirements can affect the options, particularly for a new carrier.', 'Specialized equipment support should be confirmed before onboarding. Ask what happens if the proposed service does not fit your operation and avoid planning revenue around a load that has not been approved and booked.'] },
    ],
    checklistTitle: 'Your first-call checklist',
    checklist: ['Legal business name and carrier contact details', 'Relevant authority, W-9 and insurance documents', 'Equipment specifications and handling restrictions', 'Empty location, available date, lanes and home time'],
    faqs: [
      { question: 'How long does onboarding take?', answer: 'Timing depends on document completeness, your operation and broker requirements. We provide a start-date estimate after reviewing your equipment, documents and preferred lanes.' },
      { question: 'Can a new authority request dispatch service?', answer: 'Yes, a new carrier can request a review. Some brokers have authority-history requirements, so available loads and approval timing may be more limited.' },
      { question: 'Should I upload my documents through an ordinary contact form?', answer: 'Start with the business and equipment information requested by the form. Arrange document submission directly with the team rather than adding sensitive documents to an unrelated field.' },
    ],
    related: [{ label: 'Request a carrier review', href: '/contact' }, { label: 'Equipment dispatch options', href: '/equipment' }, { label: 'Paperwork support', href: '/services/paperwork-support' }],
  },
];
