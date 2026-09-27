import type { DispatchContent } from './dispatch-content';
import { getDispatchRateLabel } from './dispatch-pricing';

export const ADDITIONAL_EQUIPMENT_CONTENT: DispatchContent[] = [
  {
    slug: 'sprinter-van',
    title: 'Sprinter van dispatch services',
    metaTitle: `Sprinter Van Dispatch Services | ${getDispatchRateLabel('sprinter-van')} Fee`,
    description: `Sprinter van dispatch at a ${getDispatchRateLabel('sprinter-van')} fee. Review expedited freight, usable cargo space, pickup readiness and return miles with a dedicated dispatcher across the USA.`,
    eyebrow: 'Small freight. A precise operating plan.',
    intro: 'Sprinter van dispatch connects a small shipment with the right cargo space, available driver and delivery window. Rai Dispatch reviews owner-operator and fleet operations across the lower 48, helping you evaluate expedited and regional freight before committing the van.',
    highlights: ['Usable cargo space reviewed', 'Pickup readiness and timing checked', 'You approve each shipment'],
    availability: 'We review your van configuration, freight requirements, operating authority and lanes before confirming dispatch availability.',
    sections: [
      {
        id: 'usable-space', title: 'Measure the working cargo area, not just the wheelbase',
        paragraphs: ['A high-roof or extended-wheelbase Sprinter can still be unsuitable for a particular shipment. Door openings, wheel housings, a partition and installed equipment affect the usable loading space. Send actual floor length, narrowest clear width, door height and available payload rather than relying on the model badge.', 'For palletized freight, obtain the dimensions and weight of each piece, including packaging. Clarify whether freight can be stacked and how it will enter the van. Pallet count alone does not establish fit, and a tall interior does not make an oversized crate pass through a smaller rear opening.'],
      },
      {
        id: 'expedited-timing', title: 'Turn an urgent request into a workable schedule',
        paragraphs: ['Expedited Sprinter van loads need a clear ready time, pickup contact and delivery commitment. Your dispatcher asks when the freight is actually available, how long loading may take and whether the receiver will be open when you arrive. Share your current location and realistic availability before an offer is presented.', 'A direct trip, a scheduled business delivery and a shipment with several stops create different commitments. Agree on the communication schedule and any tracking request. Discuss after-hours requirements with the dispatch desk before booking; an urgent shipment does not automatically include round-the-clock support.'],
      },
      {
        id: 'trip-value', title: 'Include positioning and the next available day',
        paragraphs: ['Evaluate pickup deadhead, loaded miles and the likely empty drive after delivery together. A short delivery can occupy much of a day when pickup is distant or the receiver has a narrow appointment. Ask whether waiting, an extra stop or a changed destination needs separate approval and compensation.', 'For example, a shipment that ends near home may fit your schedule differently from one ending far from your preferred search area. We compare those choices with your stated priorities. Potential return freight is a planning consideration, not income to include before another load is actually booked.'],
      },
      {
        id: 'freight-requirements', title: 'Confirm the handling and carrier requirements',
        paragraphs: ['Small freight can still have demanding access, security or handling conditions. Identify driver-assist work, loading equipment, delivery access and any special handling before approval. Medical, temperature-controlled, airport or hazardous shipments require a specific capability review; a standard cargo van service does not establish eligibility.', 'Your dedicated dispatcher helps organize load information, broker communication and delivery paperwork. You confirm that the van, driver, insurance and authority fit the shipment and retain the final booking decision.'],
      },
      {
        id: 'fees', title: 'Know the Sprinter dispatch fee before starting',
        paragraphs: [`The Sprinter van dispatch fee is ${getDispatchRateLabel('sprinter-van')} of gross revenue on loads we dispatch, with a dedicated dispatcher for each truck and no setup fee. Confirm the agreed billing base, accessorial treatment and invoice timing during onboarding. Use the pricing calculator to estimate the fee for your own load revenue.`, 'Bring your specifications and preferred operating radius to the first discussion. We can then assess the service fit and explain the next steps without promising immediate bookings, platform acceptance or a fixed weekly gross.'],
      },
    ],
    checklistTitle: 'Prepare your Sprinter operating profile',
    checklist: ['Measured cargo area, door openings and available payload', 'Loading equipment and securement provisions', 'Empty location, ready time and preferred radius', 'Authority, insurance and shipment restrictions'],
    faqs: [
      { question: 'Do you dispatch high-roof and extended Sprinter vans?', answer: 'We review both configurations. Actual cargo measurements, payload, loading access and freight requirements determine fit; wheelbase or roof height alone does not guarantee acceptance.' },
      { question: 'Can I choose regional Sprinter loads instead of long-distance work?', answer: 'Yes. Share your radius and home-time needs. Available freight and appointment windows determine which opportunities fit those preferences.' },
      { question: 'Does Sprinter dispatch include medical courier or airport work?', answer: 'Those shipments require a separate review of handling, access, insurance and carrier qualifications. Tell us the exact work you want to pursue so availability can be assessed.' },
      { question: 'How much is the Sprinter van dispatch fee?', answer: `The fee is ${getDispatchRateLabel('sprinter-van')} of gross revenue on loads we dispatch. Confirm the billing base and service terms in your agreement; operating expenses remain separate.` },
    ],
    related: [{ label: 'General cargo van dispatch', href: '/equipment/cargo-van' }, { label: 'Owner-operator dispatch', href: '/carriers/owner-operators' }, { label: 'Reduce deadhead miles', href: '/resources/reduce-deadhead-miles' }, { label: 'Dispatch fee calculator', href: '/pricing#fee-calculator' }],
  },
  {
    slug: 'conestoga',
    title: 'Conestoga dispatch services',
    metaTitle: `Conestoga Dispatch Services | ${getDispatchRateLabel('conestoga')} Fee`,
    description: `Conestoga dispatch at a ${getDispatchRateLabel('conestoga')} fee with a dedicated dispatcher. Review rolling-tarp clearance, loading access, protected freight and regional or OTR lane fit.`,
    eyebrow: 'Rolling-tarp equipment. Clear load specifications.',
    intro: 'Conestoga dispatch starts with the space and access inside the rolling-tarp system. Rai Dispatch helps carriers evaluate weather-sensitive freight, loading requirements and lane economics across the contiguous United States, with the equipment configuration reviewed before service begins.',
    highlights: ['Covered dimensions checked', 'Loading access clarified', 'Regional and OTR planning'],
    availability: 'Conestoga service is subject to review of the trailer, freight, carrier authority and available lanes.',
    sections: [
      {
        id: 'system-fit', title: 'Start with the covered loading envelope',
        paragraphs: ['The Conestoga name identifies a rolling-tarp system, not a universal cargo size or payload. Record the usable deck, clear height under the bows, interior width and space needed to close the system. Include the actual trailer configuration and any restrictions created by the bulkhead or rear closure.', 'Ask for dimensions that include packaging, skids and projecting parts. A commodity described only as machinery or building products is not enough to approve a load. Your dispatcher can collect missing details, while you confirm whether the complete shipment fits the trailer and can be carried safely.'],
      },
      {
        id: 'loading-access', title: 'Discuss how the shipper will load the trailer',
        paragraphs: ['Clarify whether loading is from the side, rear or above and how much access the facility needs. The operator must confirm that the tarp system and loading process are compatible. A request for crane loading, for example, needs more detail than a general flatbed designation.', 'We ask about the loading appointment, site contact, equipment available and time allowed to open, secure and close the system. If the receiver uses a different unloading method, establish that before departure. Include any driver-assist duties in the load discussion instead of discovering them at the gate.'],
      },
      {
        id: 'cargo-protection', title: 'Separate weather protection from cargo securement',
        paragraphs: ['Explain why the customer requested covered equipment and what protection the commodity needs. Confirm whether packaging, dunnage or additional protection is specified. A rolling cover does not make a shipment refrigerated, and it should not be represented as satisfying every moisture or contamination requirement.', 'The carrier remains responsible for the appropriate cargo securement plan. Send details of the available straps, chains, anchor points and other relevant equipment when requesting a service review. The cover and the load restraint serve different purposes, so both need to be considered.'],
      },
      {
        id: 'lane-economics', title: 'Compare the entire covered-freight trip',
        paragraphs: ['A specialized trailer can face a different reload choice from an uncovered flatbed. Compare pickup deadhead, loading time, delivery hours and acceptable freight near the destination. Tell your dispatcher which commodities you accept and whether you prefer regional runs or longer OTR trips.', 'When comparing offers, identify extra stops, difficult access, waiting time and any change to the planned loading method. We support rate discussions around the work actually required. A quoted premium or return load should be treated as unconfirmed until the responsible party agrees to it.'],
      },
      {
        id: 'dispatch-plan', title: 'Set the operating scope and fee together',
        paragraphs: [`Conestoga dispatch is ${getDispatchRateLabel('conestoga')} of gross revenue on loads we dispatch. A dedicated dispatcher supports the agreed search, rate negotiation, booking communication and paperwork process. There is no setup fee; confirm the billing base and invoice schedule in writing.`, 'Your first conversation should establish trailer specifications, preferred regions, available days and service expectations. You approve each load. Oversize work, unusual handling and permit-dependent moves need an additional capability review before they become part of the plan.'],
      },
    ],
    checklistTitle: 'Bring these Conestoga details',
    checklist: ['Usable covered length, width, height and payload', 'Trailer and rolling-tarp configuration', 'Allowed loading methods and securement equipment', 'Commodity restrictions, lanes and home-time target'],
    faqs: [
      { question: 'Is Conestoga dispatch the same as flatbed dispatch?', answer: 'The workflow shares open-deck planning tasks, but the rolling-tarp clearance, closure and loading access need their own review. A flatbed load is not automatically suitable for your covered trailer.' },
      { question: 'Can a Conestoga carry freight that needs a dry van?', answer: 'Only when the customer and carrier confirm that the actual equipment meets the shipment requirements. Do not substitute equipment based on weather protection alone.' },
      { question: 'Is a Conestoga the same as a curtain-side trailer?', answer: 'The terms describe different arrangements. A Conestoga uses a rolling-tarp system; curtain-side designs typically provide sliding side access. Identify your exact configuration before matching freight.' },
      { question: 'What is the Conestoga dispatch rate?', answer: `The fee is ${getDispatchRateLabel('conestoga')} of gross revenue on loads we dispatch. Review the billing base and included support in the service agreement.` },
    ],
    related: [{ label: 'Flatbed dispatch', href: '/equipment/flatbed' }, { label: 'Curtain-side dispatch', href: '/equipment/curtain-side' }, { label: 'Rate negotiation support', href: '/services/rate-negotiation' }, { label: 'Truck dispatch pricing', href: '/pricing' }],
  },
  {
    slug: 'rgn-lowboy',
    title: 'RGN and lowboy dispatch services',
    metaTitle: `RGN & Lowboy Dispatch Services | ${getDispatchRateLabel('rgn-lowboy')} Fee`,
    description: `RGN and lowboy dispatch at a ${getDispatchRateLabel('rgn-lowboy')} fee. Review machinery dimensions, deck fit, loading access and route responsibilities with a dedicated truck dispatcher.`,
    eyebrow: 'Machinery moves. Complete specifications first.',
    intro: 'RGN and lowboy dispatch requires a clear picture of the machine, the trailer and the proposed move. Rai Dispatch reviews specialized carrier operations across the lower 48 and helps organize load information, rate discussions and appointments for equipment-approved bookings.',
    highlights: ['Machine and trailer details reviewed', 'Loading responsibilities clarified', 'Carrier-approved scheduling'],
    availability: 'Heavy-haul availability is reviewed by equipment, freight, authority and route. Permits, escorts and engineering services are not assumed to be included.',
    sections: [
      {
        id: 'machine-profile', title: 'Describe the machine in its transport configuration',
        paragraphs: ['Obtain the make and model, transport weight, dimensions and details of attachments traveling with the machine. Clarify whether a quoted height includes the boom, cab, exhaust or other protrusions, and whether any parts will be removed before pickup. The arrangement at the loading site needs to match the information used to plan the move.', 'Photos and a specification sheet can help identify questions, but they do not replace confirmed measurements. Ask who will supply the final dimensions and who can approve changes. A last-minute attachment or different machine can change deck fit, weight distribution and route requirements.'],
      },
      {
        id: 'trailer-fit', title: 'Match the lowboy configuration to the work',
        paragraphs: ['Lowboy describes a family of low-deck trailers; RGN refers to a removable-gooseneck configuration. Provide your usable well length, deck width, loaded deck height, axle arrangement and rated capacities. A trailer name or advertised tonnage alone is not a complete loading plan.', 'Confirm how the machine will get onto and off the trailer. Establish whether it is operable, who supplies the operator and whether ramps, loading equipment or a prepared surface are required. The carrier must assess the actual trailer, load placement and securement before agreeing to the move.'],
      },
      {
        id: 'route-scope', title: 'Agree on route and permit responsibilities before booking',
        paragraphs: ['Oversize or overweight work can involve state-specific permits, escorts, travel windows and route restrictions. Confirm which requirements apply to the loaded combination and who is responsible for obtaining and checking them. A dispatch conversation or navigation route does not substitute for the required approvals.', 'We organize the information needed for the service review and keep the agreed responsibilities visible in booking communication. Permit procurement, route surveys, escort arrangements and engineering work must be separately confirmed if needed. Do not set a pickup promise around approvals that are still pending.'],
      },
      {
        id: 'schedule', title: 'Price site time and repositioning as well as loaded miles',
        paragraphs: ['A machinery move may depend on a site crew, a release contact or a narrow delivery window. Ask when the equipment will be released, where the truck can stage and whether loading support will be available at the agreed time. Record the contact responsible for changes at each end.', 'Compare the complete commitment: empty positioning, loading and unloading time, any agreed additional costs and the next realistic availability. A distant reload should not be counted before it is booked. Your dispatcher supports negotiations and paperwork follow-ups while you decide whether the move fits your operation.'],
      },
      {
        id: 'fee', title: 'A defined dispatch fee for an agreed service scope',
        paragraphs: [`RGN and lowboy dispatch is ${getDispatchRateLabel('rgn-lowboy')} of gross revenue on loads we dispatch, with a dedicated dispatcher for each truck and no setup fee. Confirm the billing base and treatment of reimbursed costs before service starts. The percentage is a dispatch fee, not a bundled heavy-haul project quote.`, 'Send trailer specifications, example commodities and preferred regions for the initial review. We confirm what support can be provided before taking on the assignment and do not guarantee a permit, a particular load or a weekly revenue level.'],
      },
    ],
    checklistTitle: 'Prepare a machinery-move profile',
    checklist: ['Machine transport dimensions, weight and attachments', 'Trailer well, deck, axle and capacity details', 'Loading method, operator and site contacts', 'Route approval responsibilities and preferred lanes'],
    faqs: [
      { question: 'Are RGN and lowboy the same equipment?', answer: 'RGN means removable gooseneck, while lowboy describes the low-deck trailer family. Share the exact configuration and specifications rather than assuming that every lowboy has the same loading arrangement.' },
      { question: 'Does the dispatch fee include permits and escorts?', answer: 'No such services are assumed. Required permits, escorts and related responsibilities must be identified and separately agreed before booking a move.' },
      { question: 'Can you review excavator or construction-equipment loads?', answer: 'Yes, as a specialized service review. We need the transport dimensions, weight, attachments, loading method and trailer details before confirming whether the work fits.' },
      { question: 'How much does RGN dispatch cost?', answer: `The dispatch fee is ${getDispatchRateLabel('rgn-lowboy')} of gross revenue on loads we dispatch. Operating expenses and any separately agreed specialized services are additional.` },
    ],
    related: [{ label: 'Step deck dispatch', href: '/equipment/step-deck' }, { label: 'Flatbed dispatch', href: '/equipment/flatbed' }, { label: 'Route and lane planning', href: '/services/route-strategy' }, { label: 'Dispatch fee guide', href: '/resources/truck-dispatch-fees' }],
  },
  {
    slug: 'car-hauler',
    title: 'Car hauler dispatch services',
    metaTitle: `Car Hauler & Auto Transport Dispatch | ${getDispatchRateLabel('car-hauler')} Fee`,
    description: `Car hauler dispatch at a ${getDispatchRateLabel('car-hauler')} fee. Dedicated dispatcher support for vehicle details, pickup releases, stop planning and paperwork, subject to carrier review.`,
    eyebrow: 'Auto transport. Every vehicle accounted for.',
    intro: 'Car hauler dispatch combines vehicle-by-vehicle information with a workable pickup and delivery sequence. Rai Dispatch reviews open and enclosed auto transport carrier operations across the contiguous USA, helping owner-operators and fleets organize opportunities around their actual equipment and schedule.',
    highlights: ['Vehicle details before approval', 'Pickup and release coordination', 'Stop-by-stop trip review'],
    availability: 'Auto transport support is confirmed after reviewing trailer capacity, vehicle types, insurance, authority and operating lanes.',
    sections: [
      {
        id: 'vehicle-details', title: 'Build the load from specific vehicles',
        paragraphs: ['A count of cars is not enough to establish a trailer load. Gather each vehicle’s year, make, model, dimensions where needed and operability. A large pickup, low-clearance sports car and compact sedan create different space and handling requirements. Ask about modifications, keys and any condition that changes the pickup process.', 'Provide your trailer configuration, usable positions, capacity and loading restrictions. The carrier decides the loading layout, weight distribution and securement. Your dispatcher can organize the shipment details so that this decision happens before acceptance, instead of after a driver reaches the seller or auction.'],
      },
      {
        id: 'release', title: 'Confirm that each pickup is actually ready',
        paragraphs: ['For auction, dealership or private-party pickups, establish the release reference, authorized contact and collection hours. Ask whether payment, paperwork or another hold must be cleared before the vehicle can leave. A booked transport order does not necessarily mean the vehicle is available immediately.', 'Record whether the location can accommodate the loaded carrier and whether a different meeting point requires prior approval. Confirm loading assistance for an inoperable vehicle before treating it as routine work. Dispatch can coordinate the questions, but must not promise equipment or assistance that the carrier has not agreed to provide.'],
      },
      {
        id: 'sequence', title: 'Plan the route and the trailer together',
        paragraphs: ['Several individual vehicle orders can create a demanding trip even when their total mileage looks reasonable. Compare pickup and delivery windows, detours and the sequence in which vehicles can be accessed. An additional unit may require more rearrangement or waiting than its quoted revenue justifies.', 'For regional or OTR car hauling, share your preferred radius, available driver time and home-time target. We help review the whole itinerary. A remaining trailer position is an opportunity to assess, not a guarantee that a compatible vehicle will be available along the route.'],
      },
      {
        id: 'records', title: 'Keep condition, delivery and payment records connected',
        paragraphs: ['Agree on the required pickup and delivery inspection process, photographs and transport documents. Keep vehicle identifiers and observed condition tied to the correct order. Clear records help the parties understand what was collected and delivered; they should reflect the actual inspection rather than an assumed condition.', 'Confirm the party responsible for payment, the agreed method and any documents needed to invoice. Your dedicated dispatcher supports communication and paperwork follow-ups within the service agreement. The dispatch service does not promise payment collection, cargo-claim outcomes or access to a particular auto transport platform.'],
      },
      {
        id: 'fee', title: 'Use a clear percentage for the agreed dispatch work',
        paragraphs: [`Car hauler dispatch is ${getDispatchRateLabel('car-hauler')} of gross revenue on loads we dispatch, with no setup fee. Confirm how a multi-vehicle trip is billed, what revenue is included and how cancellations or extra handling charges are treated.`, 'Bring a description of your equipment, the vehicle types you accept and your preferred lanes to onboarding. We review the fit before starting. You choose the orders you accept and remain responsible for safe vehicle handling and transport.'],
      },
    ],
    checklistTitle: 'Bring your auto transport operating details',
    checklist: ['Open or enclosed trailer, capacity and usable positions', 'Vehicle size, clearance and operability restrictions', 'Pickup radius, delivery regions and available schedule', 'Authority, insurance and documentation process'],
    faqs: [
      { question: 'Do you review both open and enclosed car haulers?', answer: 'Yes. Each operation needs its own equipment, insurance and freight review. The vehicle requirements and available trailer positions determine which opportunities fit.' },
      { question: 'Can you dispatch a three-car or multi-car trailer?', answer: 'Send its actual configuration and capacities for review. Vehicle count alone does not establish a workable load; dimensions, combined weight and loading order also matter.' },
      { question: 'Are inoperable vehicles included automatically?', answer: 'No. Confirm the condition, keys, steering or rolling limitations and the required loading assistance before accepting the order. Carrier capability and service scope must fit.' },
      { question: 'What is the car hauling dispatch fee?', answer: `The fee is ${getDispatchRateLabel('car-hauler')} of gross revenue on loads we dispatch. The agreement defines the billing base, schedule and included support.` },
    ],
    related: [{ label: 'Small-fleet dispatch support', href: '/carriers/small-fleets' }, { label: 'Appointment scheduling', href: '/services/scheduling' }, { label: 'Paperwork support', href: '/services/paperwork-support' }, { label: 'Truck dispatch pricing', href: '/pricing' }],
  },
  {
    slug: 'tanker',
    title: 'Tanker dispatch services',
    metaTitle: `Tanker & Liquid Bulk Dispatch Services | ${getDispatchRateLabel('tanker')} Fee`,
    description: `Tanker dispatch at a ${getDispatchRateLabel('tanker')} fee. Review commodity compatibility, tank specifications, cleaning records and loading terms with a dedicated dispatcher before booking.`,
    eyebrow: 'Bulk freight. Commodity-specific review.',
    intro: 'Tanker dispatch depends on the product and the complete tank operation, not simply the availability of an empty trailer. Rai Dispatch reviews specialized carriers across the lower 48 for agreed load-search and coordination support, with freight, equipment and authority assessed before starting.',
    highlights: ['Commodity and tank fit reviewed', 'Cleaning and loading requirements clarified', 'Carrier-approved service scope'],
    availability: 'Tanker and bulk-freight assignments require a specific capability review. Hazardous materials support, endorsements and permit services are not assumed.',
    sections: [
      {
        id: 'commodity', title: 'Identify the product before searching for a load',
        paragraphs: ['Start with the commodity, quantity, required tank type and any customer specifications. Food-grade liquid, industrial product and dry bulk work should not be treated as interchangeable categories. Send the trailer material, compartment arrangement, capacity and equipment details needed to assess the proposed operation.', 'Clarify product compatibility, previous-cargo restrictions and the documentation the customer expects. If the material classification or handling requirements are unclear, obtain the responsible party’s written instructions before approval. Dispatch can collect information; it does not establish that a tank is suitable for an unknown product.'],
      },
      {
        id: 'cleaning', title: 'Place cleaning and inspection requirements into the schedule',
        paragraphs: ['Ask what cleaning record, inspection or prior-load information is required and when it must be supplied. Determine whether a specific cleaning facility or process must be accepted by the customer. A wash appointment can affect the earliest available pickup and the distance traveled before the paying leg begins.', 'Include cleaning costs and repositioning in the trip comparison. Keep certificates, seals or other required records with the load paperwork. An apparently convenient reload still needs product compatibility and customer approval; a dispatcher should not assume that an empty tank is ready for any commodity.'],
      },
      {
        id: 'transfer', title: 'Clarify loading and unloading responsibilities',
        paragraphs: ['Confirm the loading location, appointment, expected transfer method and equipment supplied by each party. Ask about required pumps, hoses, connections or other equipment without assuming that the carrier provides them. Establish who performs the work and who can approve a change at the facility.', 'We help keep these requirements visible in booking communication and appointment follow-ups. The carrier and facility must follow the applicable operating procedures. If the setup differs from the agreed instructions, clarify the issue with the responsible parties before proceeding rather than improvising a transfer plan.'],
      },
      {
        id: 'qualifications', title: 'Match the operation to the carrier and driver',
        paragraphs: ['Tank-vehicle and hazardous-materials qualifications are separate questions that depend on the equipment and shipment. Provide the authority, insurance and driver qualifications relevant to your operation during the service review. A dispatch booking does not confer an endorsement, training, registration or permit.', 'Also review customer onboarding, site access and any commodity-specific conditions before scheduling. We confirm the support we can provide for the proposed work. The onboarding conversation should identify the supported commodities and the contact who can resolve a changed requirement before a shipment is accepted.'],
      },
      {
        id: 'economics', title: 'Compare the full tank cycle and dispatch fee',
        paragraphs: ['The useful comparison includes pickup positioning, loading time, transit, unloading, required cleaning and the next available date. Separate confirmed compensation from requested waiting-time or other accessorial payments. Your dedicated dispatcher supports rate discussion and document follow-up while you approve the load.', `Tanker dispatch is ${getDispatchRateLabel('tanker')} of gross revenue on loads we dispatch, with no setup fee. Confirm the billing base, included coordination and treatment of separately reimbursed expenses in writing. Discuss the actual commodity and lanes with the desk before relying on availability.`],
      },
    ],
    checklistTitle: 'Prepare a tanker service review',
    checklist: ['Commodity profile, tank construction and compartment details', 'Relevant cleaning records and previous-cargo restrictions', 'Loading equipment, facility access and transfer responsibilities', 'Authority, insurance, driver qualifications and preferred lanes'],
    faqs: [
      { question: 'Can food-grade and chemical tanker work use the same dispatch plan?', answer: 'Each needs a separate equipment, commodity and customer-requirement review. No compatibility or service availability should be assumed between the two operations.' },
      { question: 'Does tanker dispatch include hazardous materials service?', answer: 'Not automatically. The exact material, carrier and driver qualifications, insurance and service scope must be reviewed and confirmed before any hazardous shipment is accepted.' },
      { question: 'Do you provide tanker or hazmat endorsements?', answer: 'No. Dispatch support does not issue licenses, endorsements or required training. The carrier and driver must already meet the qualifications applicable to the work.' },
      { question: 'What does tanker dispatch cost?', answer: `The fee is ${getDispatchRateLabel('tanker')} of gross revenue on loads we dispatch. Cleaning, fuel and other operating costs are separate from the dispatch fee.` },
    ],
    related: [{ label: 'Carrier onboarding documents', href: '/resources/carrier-onboarding-checklist' }, { label: 'Broker communication', href: '/services/broker-communication' }, { label: 'Appointment scheduling', href: '/services/scheduling' }, { label: 'Dispatch fee calculator', href: '/pricing#fee-calculator' }],
  },
  {
    slug: 'dump-truck',
    title: 'Dump truck dispatch services',
    metaTitle: `Dump Truck & Dump Trailer Dispatch | ${getDispatchRateLabel('dump-truck')} Fee`,
    description: `Dump truck dispatch at a ${getDispatchRateLabel('dump-truck')} fee. Review aggregate hauling, jobsite schedules, load tickets and haul-cycle costs with a dedicated dispatcher before starting.`,
    eyebrow: 'Bulk material. A workable haul cycle.',
    intro: 'Dump truck dispatch is built around the loading point, receiving site and repeatable haul cycle. Rai Dispatch reviews owner-operators and fleets across the contiguous USA for local or regional material-hauling support, with equipment, commodity and project requirements confirmed first.',
    highlights: ['Material and body type reviewed', 'Plant and jobsite timing clarified', 'Tickets and trip terms organized'],
    availability: 'Dump-truck and dump-trailer work is reviewed by region, material, equipment and authority. A project assignment or daily load count is not guaranteed.',
    sections: [
      {
        id: 'equipment', title: 'Match the material and unloading method',
        paragraphs: ['A straight dump truck, end dump, side dump and belly dump do not perform the same job. Describe your body or trailer, available payload, material restrictions and unloading arrangement. Confirm what the receiving site can accommodate before treating a general material-hauling request as a fit.', 'Ask for the material specification and any cleanliness, covering or handling requirements. Aggregate, sand, dirt and asphalt can call for different equipment and site arrangements. Demolition material, waste or potentially contaminated loads require an additional review; they should not be treated as ordinary aggregate without clear information.'],
      },
      {
        id: 'haul-cycle', title: 'Evaluate the complete loaded-and-empty cycle',
        paragraphs: ['A short loaded trip can still consume substantial time at the plant, scale or receiving site. Map the loading queue, loaded travel, unloading wait and empty return before estimating what the truck can accomplish. Use actual operating information rather than multiplying a best-case trip time into a promised daily total.', 'Tell your dispatcher the starting yard, working hours and acceptable travel radius. Discuss whether a change in loading point or jobsite would alter the agreement. The driver and site operator must assess safe access and unloading conditions; dispatch scheduling cannot override that assessment.'],
      },
      {
        id: 'rate-basis', title: 'Clarify whether the work pays by ton, load or time',
        paragraphs: ['Different rate bases make offers difficult to compare without the underlying conditions. For per-ton work, identify the approved scale and ticket process. For per-load work, confirm the material and expected haul. For hourly work, clarify the agreed start, stop, travel and waiting-time rules.', 'A higher rate on paper may come with longer queues or an unpaid return. We support discussions about the actual work, minimum commitments if any, cancellation terms and extra waiting. Each item must be confirmed by the responsible party; it should not be added to expected revenue merely because it was requested.'],
      },
      {
        id: 'daily-plan', title: 'Keep jobsite changes and tickets together',
        paragraphs: ['Confirm the daily start point, dispatch contact, plant hours and receiving instructions. Weather, site readiness or material availability can change the plan. Agree on how the carrier will receive updates and who can authorize a different destination or additional work.', 'Keep legible scale tickets, load references and the required time records with the correct job. Identify the signer or submission process before the driver leaves the site. Your dedicated dispatcher can help organize agreed communication and paperwork follow-ups so the invoice is supported by the actual work completed.'],
      },
      {
        id: 'scope-fee', title: 'Review the local market and fee before committing',
        paragraphs: [`Dump truck dispatch is ${getDispatchRateLabel('dump-truck')} of gross revenue on loads we dispatch, with no setup fee. Confirm how the agreed percentage applies to the quoted rate basis and what revenue is included. Fuel, maintenance and other operating expenses remain separate.`, 'Send your equipment, material preferences, operating radius and authority details for a service review. Availability depends on the region and actual assignments. We assess the fit without promising a municipal contract, construction project, daily route or minimum number of loads.'],
      },
    ],
    checklistTitle: 'Prepare your material-hauling profile',
    checklist: ['Body or trailer type, payload and material restrictions', 'Home yard, operating radius and working days', 'Loading and unloading requirements', 'Ticket process, authority, insurance and rate basis'],
    faqs: [
      { question: 'Do you review end dump, side dump and belly dump equipment?', answer: 'Yes. Specify the actual equipment and material so we can assess the job requirements and available service. These configurations are not interchangeable at every site.' },
      { question: 'Can you provide local dump truck dispatch?', answer: 'We can review your local operating area and schedule. Available material-hauling assignments, equipment fit and service scope must be confirmed before starting.' },
      { question: 'Are dump truck rates always quoted per ton?', answer: 'No. An offer may use a per-ton, per-load or time-based arrangement. Confirm how quantities or hours are recorded and which waiting or travel periods are included.' },
      { question: 'What is the dump truck dispatch percentage?', answer: `The fee is ${getDispatchRateLabel('dump-truck')} of gross revenue on loads we dispatch. The agreement should explain its application to your work and invoice schedule.` },
    ],
    related: [{ label: 'Regional dispatch support', href: '/services/regional-dispatch' }, { label: 'Rate negotiation', href: '/services/rate-negotiation' }, { label: 'Delay documentation checklist', href: '/resources/detention-layover-tonu-documentation' }, { label: 'Truck dispatch pricing', href: '/pricing' }],
  },
  {
    slug: 'curtain-side',
    title: 'Curtain-side trailer dispatch services',
    metaTitle: `Curtain-Side Trailer Dispatch Services | ${getDispatchRateLabel('curtain-side')} Fee`,
    description: `Curtain-side dispatch at a ${getDispatchRateLabel('curtain-side')} fee. Dedicated dispatcher support for side-loading freight, trailer clearance, multi-stop planning and paperwork across the USA.`,
    eyebrow: 'Side-loading access. Freight planned around it.',
    intro: 'Curtain-side trailer dispatch helps carriers evaluate covered freight that benefits from side access. Rai Dispatch reviews curtainsider operations across the lower 48, connecting the loading method, trailer configuration and delivery sequence before presenting a shipment for your approval.',
    highlights: ['Side and rear access reviewed', 'Usable clearance confirmed', 'Multi-stop requirements discussed'],
    availability: 'Curtain-side assignments are subject to trailer, commodity, authority and lane review. Tell us the exact configuration before service is confirmed.',
    sections: [
      {
        id: 'configuration', title: 'Describe the complete curtainsider configuration',
        paragraphs: ['Curtain-side trailers combine covered space with side access, but the details vary by model. Record usable length, width and height, rear door clearance, movable posts and any roof or frame restrictions. Tell us whether your equipment is a full trailer or a curtain-side straight truck, because payload and loading arrangements differ.', 'A Tautliner-style designation is useful context, not a substitute for measurements. Send the actual specifications and photographs when needed. The load must fit the available opening and carrying space with the required packaging and securement in place.'],
      },
      {
        id: 'site-access', title: 'Check how the facility will use the side opening',
        paragraphs: ['Ask whether the shipper needs forklift access along one side, access from both sides or rear loading. Confirm which side can be used at the pickup and delivery sites and whether there is room to position the vehicle. A convenient side-opening trailer cannot solve an inaccessible loading area.', 'For long products or awkward packages, obtain piece dimensions and the proposed handling method. Identify who supplies loading equipment and who operates the curtain or removable posts. The carrier must confirm that the equipment and procedure are suitable before the appointment is accepted.'],
      },
      {
        id: 'multi-stop', title: 'Use access flexibility without overlooking the stop plan',
        paragraphs: ['Side access can help with some multi-stop shipments, but it does not remove the need for a load plan. Match each delivery to its freight location, unloading requirements and appointment. Ask whether other cargo would need to be moved and whether the customer permits that handling.', 'We help compare extra stops, detours and site time with the total compensation. Keep delivery contacts and access instructions tied to the right stop. If the sequence changes after booking, review the equipment and schedule implications before agreeing to the revised trip.'],
      },
      {
        id: 'protection', title: 'Separate the curtain’s role from the restraint plan',
        paragraphs: ['Clarify the shipment’s weather-protection, cleanliness and packaging requirements. Covered side-loading freight is not automatically suitable for a dry van, a Conestoga or every curtainsider. The customer and carrier should agree on the actual equipment rather than substitute one trailer name for another.', 'Do not assume that a closed curtain provides the required cargo restraint. The carrier must assess the applicable securement method and the equipment manufacturer’s instructions. Your dispatcher collects the commodity and loading details so the operating decision can be made with the right information.'],
      },
      {
        id: 'lane-fee', title: 'Build a lane plan with a clear dispatch percentage',
        paragraphs: ['Tell us your preferred commodities, regional or OTR radius and home-time needs. The trip comparison should include pickup deadhead, loading and unloading time, delivery hours and practical options after the last stop. A specialized return shipment is not assumed simply because the trailer is empty.', `Curtain-side dispatch is ${getDispatchRateLabel('curtain-side')} of gross revenue on loads we dispatch, with a dedicated dispatcher for each truck and no setup fee. We support agreed load search, rate discussion, booking communication and documents. Confirm the billing base and service scope in writing; you retain the final load decision.`],
      },
    ],
    checklistTitle: 'Prepare your curtain-side equipment details',
    checklist: ['Usable internal dimensions and payload', 'Side openings, posts, rear access and roof restrictions', 'Loading-site needs and securement equipment', 'Preferred freight, regions and available schedule'],
    faqs: [
      { question: 'Is curtain-side dispatch also called curtainsider dispatch?', answer: 'Yes, those terms commonly describe side-curtain equipment. We still need the actual vehicle configuration and measurements to assess a load correctly.' },
      { question: 'Can a curtain-side trailer replace a Conestoga?', answer: 'Only if the customer and carrier confirm that the different loading and protection arrangements meet the shipment requirements. They should not be treated as automatic substitutes.' },
      { question: 'Can I request multi-stop or regional curtain-side work?', answer: 'Yes. Share the region, stop preferences and schedule you want. We review available freight against access, loading order and appointment requirements before approval.' },
      { question: 'What is the curtain-side dispatch fee?', answer: `The fee is ${getDispatchRateLabel('curtain-side')} of gross revenue on loads we dispatch. Confirm the billing base, included services and invoice timing during onboarding.` },
    ],
    related: [{ label: 'Conestoga dispatch', href: '/equipment/conestoga' }, { label: 'Dry van dispatch', href: '/equipment/dry-van' }, { label: 'Regional lane planning', href: '/services/regional-dispatch' }, { label: 'Dispatch fee guide', href: '/resources/truck-dispatch-fees' }],
  },
];
