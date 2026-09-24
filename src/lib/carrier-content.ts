import { DISPATCH_RATE_RANGE } from './dispatch-pricing';
import type { DispatchContent } from './dispatch-content';

export const CARRIER_CONTENT: DispatchContent[] = [
  {
    slug: 'owner-operators',
    title: 'Truck dispatch services for owner-operators',
    metaTitle: `Owner-Operator Truck Dispatch | ${DISPATCH_RATE_RANGE} Fees`,
    description: `Owner-operator dispatch across the lower 48 with a dedicated dispatcher. Get load search, rate negotiation and paperwork support. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    eyebrow: 'Your truck. Your business. A dispatch contact.',
    intro: 'Running your own truck means balancing the road with broker calls, load searches and paperwork. Rai Dispatch gives independent owner-operators a dedicated dispatcher for those tasks, with nationwide support across the 48 contiguous United States. You choose the freight and keep control of your operation.',
    highlights: ['Support for one-truck operations', 'Loads approved by you', 'Regional and OTR preferences'],
    sections: [
      {
        id: 'working-agreement',
        title: 'Set the working agreement around your truck',
        paragraphs: [
          'Start with your current empty location, available pickup time, equipment specifications and preferred lanes. Your trailer dimensions, payload and handling restrictions help your dispatcher screen unsuitable freight before presenting it. Describe the work you accept, including tarping, driver assist, overnight appointments or multiple stops.',
          'Set a practical way to review proposed loads while you are off the road. Identify who can approve a booking and when the dispatcher should call again. You remain responsible for the truck, driver availability and safe operation; dispatch coordinates the agreed load-search and communication work.',
        ],
      },
      {
        id: 'load-decision',
        title: 'Make each booking a business decision',
        paragraphs: [
          'For an owner-operator, the highest advertised rate can still be a poor fit after empty miles and waiting time. Review the complete trip: drive to pickup, loaded miles, appointments, extra work and where the truck will be after delivery. Share your own cost targets so the discussion reflects your operation.',
          'We help negotiate the rate and clarify written terms before you accept. A proposed backhaul is useful for planning, but it becomes a commitment only when the specific load is approved and booked. Neither a posted rate nor a planned lane guarantees weekly revenue.',
        ],
        bullets: ['Ask for the all-in rate and any separate accessorial terms.', 'Check pickup deadhead and the realistic delivery day.', 'Approve the load after reviewing its equipment and schedule requirements.'],
      },
      {
        id: 'home-time',
        title: 'Build home time into the search',
        paragraphs: [
          'Regional dispatch and over-the-road dispatch need different planning. Tell us where you want to finish the week, how far you can travel and which destinations you avoid. A narrower search radius can reduce options, so discuss where you have flexibility before the truck is empty.',
          'Keep the dispatch desk updated when unloading, maintenance or personal commitments change your availability. An accurate empty time is more useful than a busy-looking calendar that the driver cannot meet.',
        ],
      },
      {
        id: 'paperwork',
        title: 'Keep broker calls and documents connected',
        paragraphs: [
          'Dispatch support can cover load search, rate negotiation, booking coordination, broker updates and paperwork follow-ups. Keep the rate confirmation, written amendments, bill of lading and signed delivery record connected to the same shipment reference.',
          'Send legible documents promptly and retain receipts and arrival or departure times for any agreed extra-charge request. We can discuss coordination with your factoring provider, while credit approval, funding and payment decisions remain with the responsible parties.',
        ],
      },
      {
        id: 'pricing',
        title: 'Understand the fee before the first load',
        paragraphs: [
          `Our percentage dispatch fee is ${DISPATCH_RATE_RANGE} by equipment on loads we dispatch. Your exact rate, billing base, service scope and invoice schedule are confirmed in writing before service starts. Clarify how fuel surcharge, accessorials, cancelled loads and freight you book yourself are treated.`,
          'There is no setup fee. Review the agreement’s notice and outstanding-payment requirements, then compare the dispatch service with the time and support your business needs. The amount left after a dispatch fee is still before your other operating expenses.',
        ],
      },
    ],
    checklistTitle: 'Plan your first dispatch conversation',
    checklist: ['Truck specifications and current empty location', 'Available pickup time and preferred home date', 'Lane, handling and maximum deadhead preferences', 'Load-approval contact and communication method'],
    faqs: [
      { question: 'Can I use a dispatch service with just one truck?', answer: 'Yes. Owner-operators can request dispatch support for a single truck. We review equipment, operating documents, lanes and availability before agreeing the service.' },
      { question: 'Do I give up control of my loads?', answer: 'No. You approve the load and its terms. Your dispatcher helps search, negotiate and coordinate; you keep the final decision and your carrier responsibilities.' },
      { question: 'Can I keep customers or loads I already book myself?', answer: 'Discuss existing customer commitments during onboarding so the search fits your availability. Confirm in the agreement how self-booked freight and dispatch fees are handled.' },
    ],
    related: [
      { label: 'Equipment-specific dispatch options', href: '/equipment' },
      { label: 'Evaluate freight rate per mile', href: '/resources/evaluate-freight-rate-per-mile' },
      { label: 'Route and lane planning support', href: '/services/route-strategy' },
      { label: 'Dispatch fees and pricing', href: '/pricing' },
      { label: 'Nationwide service areas', href: '/service-areas' },
    ],
  },
  {
    slug: 'small-fleets',
    title: 'Truck dispatch services for small fleets',
    metaTitle: `Small Fleet Truck Dispatch Services | ${DISPATCH_RATE_RANGE} Fees`,
    description: `Small fleet dispatch across the lower 48 with a dedicated dispatcher. Coordinate truck availability, load approvals and paperwork. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    eyebrow: 'Several trucks. One clear operating plan.',
    intro: 'As a fleet grows, each truck adds its own location, schedule and paperwork. Rai Dispatch helps small trucking companies coordinate the dispatch work around those differences. Our nationwide service supports carriers across the lower 48, with the fleet retaining control of equipment, drivers and load approval.',
    highlights: ['Truck-by-truck availability', 'Clear carrier approval contacts', 'Coordinated load documents'],
    sections: [
      {
        id: 'truck-profiles',
        title: 'Give every truck its own operating profile',
        paragraphs: [
          'A fleetwide equipment label is not enough to plan every load. Record each truck or trailer’s specifications, payload, location, available time and handling capabilities. Two dry vans may have different readiness times; two box trucks may have different liftgate or dock access.',
          'Separate confirmed availability from an estimated empty time. Update the dispatcher when maintenance, driver changes or a delayed delivery affects a truck. This helps avoid pursuing freight against capacity that has already been committed.',
        ],
      },
      {
        id: 'approval-process',
        title: 'Agree who can approve a booking',
        paragraphs: [
          'Choose the fleet contact who approves rates and loads, and clarify whether a driver can approve changes. Decide how pickup details reach the assigned driver and who reports truck status. A simple, shared process is particularly useful when the fleet owner also drives.',
          'Before approval, review the rate, equipment fit, appointments, handling requirements and driver availability for the specific truck. A load should not be shifted to another truck without checking that the operating details and responsible parties’ requirements still fit.',
        ],
        table: {
          caption: 'A practical information handoff for each truck',
          headers: ['Stage', 'Information to confirm'],
          rows: [
            ['Ready for search', 'Truck identity, empty location, equipment and available time'],
            ['Load proposed', 'Rate, appointments, requirements and authorized approval'],
            ['Load underway', 'Driver contact, status updates and any schedule changes'],
            ['Delivery complete', 'Signed documents, receipts and next availability'],
          ],
        },
      },
      {
        id: 'fleet-lanes',
        title: 'Plan lanes around individual drivers',
        paragraphs: [
          'One driver may prefer regional work while another accepts longer OTR runs. Keep home-time requests, operating limits and destination preferences attached to the right truck. Combining them into a single fleet average can hide a schedule that does not work for an individual driver.',
          'We support lane discussions using known truck status and available freight. Review potential reloads and empty miles, while leaving room for appointment changes. Nationwide dispatch coverage does not mean every truck will find suitable freight in every location.',
        ],
      },
      {
        id: 'records',
        title: 'Keep load records easy to reconcile',
        paragraphs: [
          'Use the same truck identifier and shipment reference across rate confirmations, broker updates and delivery documents. That makes it easier to see which records are missing and which truck can be released for the next search.',
          'Rai Dispatch provides the document coordination agreed during onboarding. Your fleet retains its accounting, compliance and driver-management responsibilities. Discuss your existing workflow with us so the service fits your records rather than assuming a particular software platform or integration is included.',
        ],
      },
      {
        id: 'review-and-fees',
        title: 'Review service and costs at truck level',
        paragraphs: [
          'Compare completed loads, total miles, time waiting and home-time fit for each truck. A strong fleet gross can hide one truck spending too much time empty or unavailable. Share that feedback when reviewing the next week’s search preferences.',
          `Percentage dispatch fees are ${DISPATCH_RATE_RANGE} by equipment on loads we dispatch. Confirm the exact rate, billing base, included trucks and service scope in writing. Agree how invoices identify each truck and how accessorials, cancellations or changes in active fleet size are handled. Any fixed-fee arrangement requires a separate written quote.`,
        ],
      },
    ],
    checklistTitle: 'Prepare your fleet dispatch handoff',
    checklist: ['Equipment and availability for each truck', 'Driver contacts and individual lane preferences', 'Authorized booking and escalation contacts', 'Document, invoicing and truck-identification process'],
    faqs: [
      { question: 'Can you support a fleet with different truck types?', answer: 'We can review mixed equipment, including dry vans, reefers, flatbeds, box trucks and power only operations. Specialized equipment and each truck’s lanes require a service-fit review.' },
      { question: 'Can dispatch coordinate with our fleet manager?', answer: 'Yes. Identify the manager and approval process during onboarding. Dispatch support can work alongside your existing operations, with responsibilities agreed before starting.' },
      { question: 'Are fleet dispatch fees charged to every load we haul?', answer: 'The advertised percentage applies to loads we dispatch. Confirm the included trucks, billing base and treatment of independently booked freight in the signed agreement.' },
    ],
    related: [
      { label: 'Compare equipment dispatch requirements', href: '/equipment' },
      { label: 'Broker communication support', href: '/services/broker-communication' },
      { label: 'Appointment scheduling and follow-ups', href: '/services/scheduling' },
      { label: 'Understand dispatch fee calculations', href: '/resources/truck-dispatch-fees' },
      { label: 'Review dispatch pricing', href: '/pricing' },
    ],
  },
  {
    slug: 'new-authorities',
    title: 'Truck dispatch support for new authorities',
    metaTitle: 'New Authority Truck Dispatch | Carrier Setup Review',
    description: `New authority dispatch across the lower 48 with a dedicated dispatcher. Review documents, equipment and broker requirements. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    eyebrow: 'New carrier. Prepare for a realistic start.',
    intro: 'Starting a carrier operation brings a new set of documents, broker requirements and load decisions. Rai Dispatch helps new authorities assess dispatch readiness and suitable freight across the contiguous United States. The first step is a review of your actual equipment, operating status and lanes.',
    highlights: ['Carrier readiness review', 'Broker requirements checked', 'Clear expectations before booking'],
    availability: 'New-authority dispatch availability depends on completed carrier onboarding, equipment fit, broker requirements and suitable freight. A dispatch agreement does not guarantee broker approval or an immediate first load.',
    sections: [
      {
        id: 'carrier-readiness',
        title: 'Confirm what is ready before the search starts',
        paragraphs: [
          'Have your legal business details, relevant operating-authority information, W-9, insurance information and equipment specifications ready for review. Check that names and contact details are consistent across the documents. Arrange document submission with the team instead of placing sensitive files in an ordinary enquiry field.',
          'Dispatch onboarding organizes the information needed for service; it does not activate authority, issue insurance or replace the carrier’s operating responsibilities. If a document is incomplete or a status needs clarification, resolve that before planning around a possible shipment.',
        ],
      },
      {
        id: 'broker-requirements',
        title: 'Treat broker acceptance as a separate step',
        paragraphs: [
          'Each broker sets its own carrier and shipment requirements. Authority history, insurance, safety information, equipment and onboarding procedures can affect whether a new carrier qualifies. A completed dispatch packet does not mean every broker will accept it.',
          'We review the requirements attached to an opportunity before proceeding. If a broker declines, the next search must still respect the carrier’s actual profile. We do not promise to bypass authority-age requirements or present your business as a different carrier.',
        ],
      },
      {
        id: 'search-plan',
        title: 'Set practical boundaries for the first searches',
        paragraphs: [
          'Share where the truck will be empty, when the driver is available and the lanes you can realistically run. Describe the equipment precisely: a box truck’s payload and door opening, a reefer’s capabilities or a flatbed’s usable deck and handling gear.',
          'A local-only radius or fixed destination can narrow the options further. Discuss whether you can consider regional or OTR work, but keep home time and operating limits clear. Broader preferences create more possibilities to review, not a guarantee of freight.',
        ],
        bullets: ['Confirm equipment readiness before giving an available pickup time.', 'Choose a realistic search radius and acceptable destination regions.', 'Review specialized hotshot, step deck or cargo van availability separately.'],
      },
      {
        id: 'first-booking',
        title: 'Use a repeatable first-load checklist',
        paragraphs: [
          'Before approving a shipment, review the complete rate, pickup and delivery appointments, commodity, weight, loading method and written instructions. Include empty miles, waiting time and any extra work in the decision. Ask for clarification when the posting and confirmation differ.',
          'You approve the booking. Keep the driver’s contact information current, report changes promptly and retain the signed delivery record. Clear communication and complete documents are useful habits from the first load onward; they do not guarantee future broker acceptance or payment.',
        ],
      },
      {
        id: 'fees-and-timing',
        title: 'Agree fees and expectations before starting',
        paragraphs: [
          `Rai Dispatch charges equipment-specific dispatch fees of ${DISPATCH_RATE_RANGE} on loads we dispatch, with no setup fee. Your equipment rate, billing base, service scope and invoice timing are confirmed in writing. Ask how cancelled loads, accessorials and freight you book yourself affect the fee.`,
          'A start-date estimate follows the review of your documents, equipment and lanes. Keep onboarding completion separate from a confirmed booking when planning your first week. Available freight, broker approval and operating costs make fixed income or immediate-load promises unreliable planning assumptions.',
        ],
      },
    ],
    checklistTitle: 'Bring these details to a readiness review',
    checklist: ['Legal carrier name and relevant authority information', 'Current insurance information and W-9', 'Truck dimensions, payload and handling capabilities', 'Empty location, available date and lane preferences'],
    faqs: [
      { question: 'Can a brand-new authority request dispatch service?', answer: 'Yes. Request a readiness review with your documents, equipment and operating plan. Service fit and broker eligibility must be confirmed before freight can be booked.' },
      { question: 'Is there one authority-age requirement for every broker?', answer: 'No single threshold applies to every opportunity. The broker’s current requirements and the shipment determine eligibility; ask about the specific load instead of relying on a universal age promise.' },
      { question: 'Will I get a load immediately after signing?', answer: 'An agreement starts the agreed service process, not a guaranteed load. The timing of a first booking depends on completed onboarding, broker acceptance, equipment and suitable freight.' },
    ],
    related: [
      { label: 'Complete carrier onboarding checklist', href: '/resources/carrier-onboarding-checklist' },
      { label: 'Equipment requirements by truck type', href: '/equipment' },
      { label: 'How load booking works', href: '/services/load-booking' },
      { label: 'Choose a dispatch service', href: '/resources/how-to-choose-a-truck-dispatcher' },
      { label: 'Review fees and pricing', href: '/pricing' },
    ],
  },
];
