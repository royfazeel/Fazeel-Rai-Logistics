import type { ContentLink, ContentSection } from './dispatch-content';
import { getDispatchRate, getDispatchRateLabel } from './dispatch-pricing';
import { ACTIVE_CARRIER_SUPPORT, SETUP_DESK_HOURS } from './constants';

const boxTruckExampleBillingBase = 2_000;
const boxTruckExampleFee = boxTruckExampleBillingBase * getDispatchRate('box-truck') / 100;
const boxTruckExampleRemainder = boxTruckExampleBillingBase - boxTruckExampleFee;

// Equipment characteristics checked against manufacturer and agency references:
// https://www.maxonlift.com/products/product-selector?page=1
// https://www.utilitytrailer.com/trailer/4000d-x-composite/
// https://www.fontaineheavy-haul.com/pdfs/Xcalibur%20Drop%20R10.pdf
// https://www.aeroindustries.com/tarp-systems/aero-conestoga/
// https://www.fromtheroad.ford.com/content/dam/fordmediasite/us/en/library/2026/specs/2026_Ford_Transit_Specs.pdf
// https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-sanitary-transportation-human-and-animal-food
// https://www.fmcsa.dot.gov/regulations/cargo-securement/cargo-securement-rules
// Examples below are dispatch review scenarios, not equipment specifications.
export const EQUIPMENT_SEARCH_ENHANCEMENTS: Record<string, {
  sections: ContentSection[];
  faqs: { question: string; answer: string }[];
  related?: ContentLink[];
}> = {
  'box-truck': {
    sections: [
      {
        id: 'straight-truck-service-fit', title: 'Specialized box truck dispatch for owner-operators and fleets',
        paragraphs: [`Rai Dispatch specializes in box truck dispatch for owner-operators and small fleets across the lower 48 states. Our ${getDispatchRateLabel('box-truck')} dispatch service includes a dedicated dispatcher, free setup, load search, rate negotiation, booking coordination, broker communication, appointment follow-ups and paperwork support within the agreed scope. You approve each load.`, 'We review 26-foot box trucks and other straight-truck configurations using actual dimensions, available payload and delivery capabilities. Dock freight, liftgate delivery and inside delivery need different arrangements. For liftgate work, share the gate’s rated capability and usable platform, pallet-jack availability and the work your driver accepts. We confirm shipment and facility requirements before presenting a booking for your decision.'],
        table: { caption: 'Choose the box truck work you are prepared to accept', headers: ['Delivery arrangement', 'Details to confirm'], rows: [['Dock-to-dock', 'Dock access, truck compatibility and who loads and unloads'], ['Liftgate delivery', 'Handling-unit fit, gate capability and unloading responsibility'], ['Inside or multiple-stop delivery', 'Driver tasks, access, stop sequence and agreed compensation']] },
      },
      {
        id: '26-foot-booking-scenario', title: 'How box truck dispatch works and what it costs',
        paragraphs: [`Box truck pricing was updated October 30, 2026. Rai Dispatch’s current box truck dispatch fee is ${getDispatchRateLabel('box-truck')} of gross revenue on loads we dispatch.`, 'Start with your truck specifications, empty location, available time and preferred lanes. Your dispatcher searches suitable freight and clarifies dimensions, loading access, appointments, compensation and known empty miles. You review the complete proposal and approve or decline it. After approval, we coordinate the booking, agreed updates and delivery-document follow-ups.', `On a hypothetical $${boxTruckExampleBillingBase.toLocaleString('en-US')} agreed billing base, the ${getDispatchRateLabel('box-truck')} box truck dispatch fee is $${boxTruckExampleFee.toLocaleString('en-US')}. The remaining $${boxTruckExampleRemainder.toLocaleString('en-US')} is before fuel, maintenance, insurance, driver pay and other operating expenses; it is not profit or an earnings forecast. Confirm how fuel surcharge and accessorials are treated in your written billing terms.`],
        table: { caption: 'Illustrative box truck dispatch fee — not a quoted freight rate', headers: ['Item', 'Amount'], rows: [['Agreed example billing base', `$${boxTruckExampleBillingBase.toLocaleString('en-US')}`], [`Dispatch fee at ${getDispatchRateLabel('box-truck')}`, `$${boxTruckExampleFee.toLocaleString('en-US')}`], ['Remaining before operating expenses', `$${boxTruckExampleRemainder.toLocaleString('en-US')}`]] },
      },
    ],
    faqs: [
      { question: 'Does Rai Dispatch specialize in box truck dispatch?', answer: `Yes. Rai Dispatch specializes in box truck dispatch for owner-operators and small fleets, including 26-foot and other straight-truck configurations. The published fee is ${getDispatchRateLabel('box-truck')}, with a dedicated dispatcher and free setup. Equipment fit, lanes and service scope are reviewed before starting.` },
      { question: 'Does Rai Dispatch offer 24/7 box truck dispatch support?', answer: `Yes. Rai Dispatch provides ${ACTIVE_CARRIER_SUPPORT}, including box truck owner-operators and fleets. Your assigned dispatcher works with team backup coverage, and you receive the active-load contact and escalation process during onboarding. New-carrier setup desk hours are ${SETUP_DESK_HOURS}. Support availability does not guarantee loads, routes or revenue.` },
      { question: 'What is the dispatch fee on a $2,000 box truck load?', answer: `If $${boxTruckExampleBillingBase.toLocaleString('en-US')} is the agreed billing base, the ${getDispatchRateLabel('box-truck')} dispatch fee is $${boxTruckExampleFee.toLocaleString('en-US')}. That leaves $${boxTruckExampleRemainder.toLocaleString('en-US')} before operating expenses. The agreement determines which revenue items form the billing base; this example does not promise a load or profit.` },
      { question: 'Can my box truck accept a load posted for a dry van?', answer: 'Only if the responsible party and carrier confirm that the actual truck meets every shipment requirement. Do not substitute a straight truck merely because the freight seems small enough; loading access, payload, appointments and equipment acceptance still matter.' },
      { question: 'Is liftgate or inside delivery automatically included in a box truck booking?', answer: 'No. Confirm the requested work, equipment capability, unloading responsibility and compensation before approving the load. Tell the dispatcher which delivery tasks your operation accepts.' },
    ],
    related: [{ label: 'Box truck load-search worksheet', href: '/resources/how-to-find-box-truck-loads' }, { label: 'Dedicated dispatcher and 24/7 active-carrier support', href: '/services/dedicated-dispatcher' }, { label: 'Regional or OTR dispatch planning', href: '/resources/local-vs-regional-vs-otr-trucking' }],
  },
  'dry-van': {
    sections: [
      {
        id: '53-foot-ftl-dispatch', title: '53-foot dry van dispatch for full truckload freight',
        paragraphs: ['A full truckload search should describe both the freight and the trailer the carrier can provide. Tell us whether your operation uses a 53-foot dry van or another configuration, then share the actual interior space, door opening and handling restrictions. Manufacturer options and the individual trailer matter more than a generic capacity chart.', 'We clarify whether the shipment reserves the trailer exclusively and whether any floor, trailer-condition or loading requirement applies. A load can require exclusive use even when it leaves empty space. The carrier decides whether the complete requirements fit its equipment before we coordinate a booking.'],
        table: { caption: 'Different questions within a dry van booking', headers: ['Term or request', 'Question for the load review'], rows: [['Full truckload / exclusive use', 'What space and equipment are reserved for this shipment?'], ['Live loading or unloading', 'What appointment and handling time should the carrier plan?'], ['Drop-and-hook', 'What trailer exchange, access and return terms apply?']] },
      },
      {
        id: 'dry-van-next-pickup', title: 'Plan the next pickup from the actual trailer release',
        paragraphs: ['A dry van delivery appointment is not the same as a confirmed empty time. When you are considering the next load, include unloading, paperwork, trailer preparation and the drive to pickup. We can review possible reloads while you are under a shipment, but your latest status determines whether a proposed sequence is workable.', 'For example, an attractive reload near the receiver may still conflict with an uncertain live-unload finish. We seek a realistic pickup window and keep the carrier’s decision tied to that timing. If the release changes, tell the desk before another booking is confirmed.', `Dry van dispatch is ${getDispatchRateLabel('dry-van')} under the published equipment schedule. The agreed support includes freight search, rate discussion, booking coordination and follow-ups. Review the total-trip rate guide when comparing offers, and confirm how the billing base treats fuel surcharge and other separately stated items.`],
      },
    ],
    faqs: [
      { question: 'Does a full truckload have to fill all the space in my dry van?', answer: 'No. A shipment can reserve the trailer or require exclusive use without filling it. Check the written terms before considering any additional freight.' },
      { question: 'Can I request live-load work and decline trailer-drop arrangements?', answer: 'Yes. Tell us which arrangements your operation accepts. We use those preferences in the search, while the availability of suitable freight determines which loads can be proposed.' },
    ],
    related: [{ label: 'Full truckload and partial-load booking', href: '/services/load-booking' }, { label: 'Fuel surcharge calculation guide', href: '/resources/fuel-surcharge-calculation-for-carriers' }],
  },
  reefer: {
    sections: [
      {
        id: 'refrigerated-load-brief', title: 'Refrigerated dispatch with one clear instruction record',
        paragraphs: ['Reefer freight should arrive at the driver with a consistent set of instructions. We help collect the commodity, written temperature requirements, operating mode, preparation needs and appointment details into the booking discussion. The carrier confirms the unit’s suitability and how the shipment will be handled.', 'If a rate confirmation and a later message disagree, the useful next step is a correction from the authorized party. We flag the difference and communicate the resolved version to the carrier. We do not choose a temperature from a commodity name or assume instructions from a previous load apply to the next shipment.'],
        table: { caption: 'Keep refrigerated load instructions aligned', headers: ['Information', 'What the carrier needs'], rows: [['Temperature and mode', 'One clear written requirement from the authorized party'], ['Trailer preparation', 'Confirmed cleaning, readiness and any pre-cooling instructions'], ['Updates and exceptions', 'Named contacts and the required reporting process']] },
      },
      {
        id: 'reefer-multi-stop-fit', title: 'Compare a single delivery with a multi-stop reefer trip',
        paragraphs: ['A multi-stop reefer proposal adds more than mileage. Each receiving appointment, unloading process and remaining shipment needs to fit the plan. We ask about the complete stop sequence and written handling instructions before presenting the load for approval.', 'For instance, a delayed first receiver may affect a later appointment and the truck’s next available day. The dispatcher needs the actual update, while the carrier assesses the operational requirements. Agreed changes should reach everyone working from the original schedule, including the driver and the next booking contact.', `Our reefer dispatch fee is ${getDispatchRateLabel('reefer')}, with the billing base confirmed in the agreement. When comparing loads, include preparation, refrigeration expenses, waiting and the realistic empty time. The reefer temperature checklist gives a detailed worksheet for your first call; the detention guide explains which records to organize when delays lead to a request for additional compensation.`],
      },
    ],
    faqs: [
      { question: 'Can I limit reefer dispatch to single-stop loads?', answer: 'Yes. Tell us your stop, appointment and handling preferences before the search. Restrictions can narrow available options, but a multi-stop proposal is not accepted without carrier approval.' },
      { question: 'What happens if reefer instructions change after booking?', answer: 'Share the change promptly and obtain clear written instructions from the authorized party. The carrier must review the revised requirement, and the driver needs the current version before relying on it.' },
    ],
    related: [{ label: 'Reefer temperature and booking worksheet', href: '/resources/reefer-load-temperature-checklist' }, { label: 'Detention and layover records', href: '/resources/detention-layover-tonu-documentation' }],
  },
  flatbed: {
    sections: [
      {
        id: 'flatbed-job-comparison', title: 'Flatbed load search based on the work at each site',
        paragraphs: ['Flatbed dispatch is more useful when the proposal explains what the driver will do at pickup and delivery. We ask about piece dimensions, loading equipment, access and protection requirements alongside the rate. Tell us whether your operation accepts tarping, additional stops or particular loading environments.', 'Two jobs with the same route can involve different work. One may load quickly at a prepared yard; another may depend on a crane appointment or access to a construction site. We collect those details so your decision includes the time and tasks the trip will actually require.'],
        table: { caption: 'Compare flatbed proposals using the same questions', headers: ['Part of the job', 'Confirm before approval'], rows: [['Loading and unloading', 'Method, responsible party, appointment and site access'], ['Cargo protection', 'Required coverage and the carrier’s suitable equipment'], ['Extra work', 'Stops, handling, waiting and written compensation terms']] },
      },
      {
        id: 'flatbed-change-control', title: 'Recheck the load when the shipper changes the details',
        paragraphs: ['A cargo change can invalidate an earlier fit review. If a piece becomes longer, heavier or differently packaged, ask for the updated information before relying on the original booking. The carrier needs to reassess deck space, loading, protection and securement for the actual shipment.', 'We coordinate the clarification and any approved changes to the written terms. A dispatcher’s task is to keep the information and people aligned; the carrier and driver decide whether the load can be moved safely with their equipment. Keep the revised instructions accessible instead of leaving the driver to reconcile several messages at the gate.', `The published flatbed dispatch fee is ${getDispatchRateLabel('flatbed')}. We discuss the billing base and scope before starting, including how approved accessorials are treated. Use our flatbed and tarping guide for a detailed review worksheet, then bring your actual deck, gear, accepted commodities and lane preferences to the service-fit conversation.`],
      },
    ],
    faqs: [
      { question: 'Can I choose flatbed loads based on the loading method?', answer: 'Yes. Share the methods and facilities your operation can handle. The pickup and delivery arrangements must be confirmed for each shipment; an open deck alone does not establish compatibility.' },
      { question: 'What if the actual flatbed cargo differs from the booking details?', answer: 'Report the difference and obtain carrier review of the updated dimensions, weight and handling. Any necessary change to the load terms should be confirmed with the responsible party before proceeding on that basis.' },
    ],
    related: [{ label: 'Flatbed load and tarping checklist', href: '/resources/flatbed-load-tarping-checklist' }, { label: 'Review the rate confirmation', href: '/resources/rate-confirmation-checklist' }],
  },
  'power-only': {
    sections: [
      {
        id: 'power-only-move-types', title: 'Power only dispatch for loaded and empty trailer moves',
        paragraphs: ['Tell us which trailer arrangements your tractor operation accepts. A loaded trailer move, empty reposition and live-load job can have different release procedures and remaining obligations. We clarify the actual assignment before comparing its compensation with other power only freight.', 'The proposal should identify the trailer, pickup readiness, gate requirements and where responsibility ends under the arrangement. If the trailer is not ready when the tractor arrives, the next step depends on verified instructions from the responsible party. A listing category does not establish access to a trailer pool or permission to substitute equipment.'],
        table: { caption: 'Clarify the type of power only work', headers: ['Arrangement', 'Details that need their own review'], rows: [['Loaded trailer move', 'Correct trailer, release status, delivery and final handoff'], ['Empty trailer reposition', 'Pickup condition, destination, deadline and acceptance record'], ['Trailer used for a live load', 'Loading time, use terms and the required return process']] },
      },
      {
        id: 'tractor-next-availability', title: 'Make the next booking from the tractor’s final obligation',
        paragraphs: ['The cargo delivery can finish before the power only job is complete. A trailer return, yard check-in or another required move may still occupy the tractor. We include the known remaining work when discussing the next load so a delivery time is not mistaken for full availability.', 'For example, a trailer that must return to a different yard can leave the tractor farther from the next pickup than the receiver address suggests. Ask whether the yard will be open, what release record is needed and how any changed return instructions will be confirmed. Review agreement and insurance questions with the appropriate carrier adviser.', `Power only dispatch is ${getDispatchRateLabel('power-only')} under our published schedule. Confirm the revenue base and included work before starting. The trailer handoff guide below provides a complete pickup-to-return worksheet and a mileage example you can use when comparing actual proposals.`],
      },
    ],
    faqs: [
      { question: 'Can power only dispatch include an empty trailer reposition?', answer: 'A suitable empty move can be reviewed within the agreed service scope. Confirm trailer identity, condition, release, destination, responsibility and compensation before approving it.' },
      { question: 'Can I book my next load immediately after the cargo delivery?', answer: 'Only after accounting for any remaining trailer obligations and the driver’s actual availability. A required return or release may determine when and where the tractor is ready again.' },
    ],
    related: [{ label: 'Power only trailer handoff checklist', href: '/resources/power-only-trailer-interchange-checklist' }, { label: 'Backhaul and reload dispatch', href: '/services/backhaul-dispatch' }],
  },
  'step-deck': {
    sections: [
      {
        id: 'step-deck-versus-flatbed', title: 'Step deck versus flatbed: compare the usable loading plan',
        paragraphs: ['When a shipment is described as either flatbed or step deck freight, ask what the cargo actually needs. A step deck has distinct deck areas, so the total trailer length does not describe one uninterrupted loading surface. Share the usable upper and lower deck dimensions and explain where the carrier expects each piece to sit.', 'A lower deck can change the loaded-height calculation, but cargo fit still depends on the actual trailer, piece dimensions, loading method and route. We collect the information for carrier review instead of treating the equipment name as a promise that the shipment will fit.'],
        table: { caption: 'Questions when comparing an open-deck equipment request', headers: ['Fit question', 'Information to provide'], rows: [['Usable length', 'The deck segment each piece needs, not only total trailer length'], ['Loaded height', 'Actual deck height, cargo dimensions and carrier-reviewed route limits'], ['Loading method', 'Access, ramps or facility equipment and the intended placement']] },
      },
      {
        id: 'step-deck-piece-layout', title: 'Review multi-piece freight before combining deck space',
        paragraphs: ['Suppose a load contains a long machine and several separate crates. Adding their lengths together does not establish that they fit a step deck. The carrier needs the dimensions and placement of each item, the loading order, access for unloading and a workable securement plan.', 'The same care applies when considering a partial load beside another shipment. Remaining space must be usable for the particular cargo, and the complete route and written terms must allow the combination. Tell your dispatcher about equipment such as ramps or load levelers without assuming their presence makes every arrangement acceptable.', `Our step deck dispatch fee is ${getDispatchRateLabel('step-deck')}, with service availability and specialized requirements reviewed before onboarding. Send a clear trailer profile, accepted commodities and preferred lanes. The flatbed load checklist can help organize the cargo questions, while the partial-load guide covers the separate approval and stop-order decisions.`],
      },
    ],
    faqs: [
      { question: 'Why do you need both deck lengths for step deck dispatch?', answer: 'Cargo must fit the usable segment where it will be placed. Total trailer length alone does not show the uninterrupted space, height or loading access available for a particular piece.' },
      { question: 'Can a step deck carry machinery and separate crates on the same load?', answer: 'That requires review of every piece, placement, loading and unloading access, securement, capacity and the written shipment terms. The carrier must approve the complete arrangement.' },
    ],
    related: [{ label: 'Open-deck cargo and loading checklist', href: '/resources/flatbed-load-tarping-checklist' }, { label: 'Partial-load planning and approval', href: '/resources/partial-truckload-vs-ltl' }],
  },
  hotshot: {
    sections: [
      {
        id: 'hotshot-trip-choice', title: 'Compare a single hotshot load with a partial-load sequence',
        paragraphs: ['A hotshot search can consider a single shipment or a proposed sequence of compatible partial loads. The useful comparison is the entire trip: confirmed compensation, all stops, known empty miles, loading work and delivery timing. A second piece is an option to evaluate, not automatic extra revenue.', 'We present the additional work with the load details so the carrier can decide whether the combination is worthwhile. The first shipment’s restrictions and appointments remain part of that decision. Space left on the trailer does not cancel an exclusive-use requirement or make an extra stop fit the driver’s schedule.'],
        table: { caption: 'Compare two hotshot booking approaches', headers: ['Approach', 'Decision to make'], rows: [['One shipment', 'Does the full route and timing work on the confirmed compensation?'], ['Multiple partials', 'Do written permissions, cargo access, capacity and all appointments work together?'], ['Possible reload', 'Is the current trip acceptable while the return opportunity remains unconfirmed?']] },
      },
      {
        id: 'hotshot-small-fleet-coordination', title: 'Keep each hotshot truck-and-trailer combination distinct',
        paragraphs: ['If you operate more than one hotshot truck, send a separate profile and availability for each combination. Different trailers, gear, loading access and driver schedules can produce different load matches. A proposal approved for one setup should not be transferred to another without review.', 'For example, a truck change before pickup may alter available deck space or loading capability. Tell the desk early, confirm the revised specifications and obtain the necessary carrier and booking-party approval. Keeping the load reference tied to the actual assigned equipment helps prevent a familiar trailer description from hiding an important change.', `Hotshot dispatch is ${getDispatchRateLabel('hotshot')} under the published fee schedule. Confirm the billing base, covered trucks and load-approval contacts in the agreement. Our hotshot planning guide contains the detailed equipment worksheet; the service agreement checklist helps a multi-truck operation assign responsibilities before the first search.`],
      },
    ],
    faqs: [
      { question: 'Can you review a full-trip plan instead of only individual hotshot rates?', answer: 'Yes. Share the planned stops, confirmed loads, known empty miles and home-time needs. Keep unbooked opportunities separate so the comparison does not assume revenue that is not confirmed.' },
      { question: 'Can I swap a different hotshot truck onto an approved load?', answer: 'Any equipment change needs a fresh fit and acceptance review. Update the actual truck-and-trailer details, driver availability and required approvals before relying on the original booking.' },
    ],
    related: [{ label: 'Hotshot load planning worksheet', href: '/resources/hotshot-load-planning-checklist' }, { label: 'Dispatch service agreement checklist', href: '/resources/truck-dispatch-service-agreement-checklist' }],
  },
  'cargo-van': {
    sections: [
      {
        id: 'small-van-freight-search', title: 'Cargo van load search for the space you can actually use',
        paragraphs: ['Small cargo van freight needs a more precise fit check than a general pallet count. Send the make and configuration, measured cargo area, narrow points, door openings and carrier-confirmed available payload. Interior fittings and the vehicle’s actual setup can reduce usable space and capacity compared with a brochure example.', 'We ask how the shipment enters the van, how it is secured and how it will be removed at delivery. A tall package might fit the roof space but not the door opening; a pallet might fit on the floor but require equipment unavailable at the receiver. These are booking questions to resolve before a load is approved.'],
        table: { caption: 'Cargo van fit checks before discussing a booking', headers: ['Measure or clarify', 'Why it matters'], rows: [['Door opening and cargo shape', 'The piece must enter and leave the vehicle as planned'], ['Narrowest usable cargo space', 'Wheel wells, fittings and loading access can affect placement'], ['Available payload and handling', 'The actual vehicle and delivery method must suit the shipment']] },
      },
      {
        id: 'cargo-van-owner-operator-fit', title: 'Dispatch support for a cargo van owner-operator',
        paragraphs: ['This service starts with an existing carrier operation and a vehicle available for suitable freight. Tell us where the van is based, the distance you are prepared to travel, accepted delivery work and whether overnight trips fit your plans. We review those details before confirming the support we can provide.', 'For an urgent small shipment, distinguish a ready pickup from a requested deadline. The van’s proximity alone does not show that the driver, equipment and receiving arrangements are ready. We coordinate the facts and bring the proposal back to you for approval; dispatch is not a driving job offer, vehicle lease or guaranteed courier route.', `The published cargo van dispatch fee is ${getDispatchRateLabel('cargo-van')}. Sprinter van service has its own equipment classification and published fee, so confirm the applicable category in writing. Review the agreement’s billing base and compare total trip time, empty miles and your own expenses before deciding to start.`],
      },
    ],
    faqs: [
      { question: 'Will cargo van dispatch provide a van or a driving job?', answer: 'No. Rai Dispatch provides agreed dispatch support for a carrier operation. It does not supply the vehicle, offer driver employment or promise a parcel-delivery contract.' },
      { question: 'Do cargo vans and Sprinter vans have the same dispatch fee?', answer: `The published cargo van fee is ${getDispatchRateLabel('cargo-van')} and the Sprinter van fee is ${getDispatchRateLabel('sprinter-van')}. Confirm the equipment classification, service fit and billing base in the written agreement.` },
    ],
    related: [{ label: 'Sprinter van service and pricing', href: '/equipment/sprinter-van' }, { label: 'What a truck dispatcher does', href: '/resources/what-does-a-truck-dispatcher-do' }, { label: 'Dispatch agreement review', href: '/resources/truck-dispatch-service-agreement-checklist' }],
  },
  conestoga: {
    sections: [
      {
        id: 'conestoga-versus-tarped-flatbed', title: 'Conestoga versus a tarped flatbed: confirm the requested access',
        paragraphs: ['A Conestoga uses a rolling-tarp system, which makes the loaded cargo envelope and the opening process part of the freight review. An uncovered flatbed with separate tarps presents a different loading and protection arrangement. Ask why the shipment requests one configuration and what access the facilities need.', 'We clarify the loading method and provide the actual trailer information for the carrier and booking party to review. A broad “covered flatbed” description is not enough to substitute equipment. Confirm that the cargo, packaging and securement fit when the system is closed and that both facilities can work with the proposed arrangement.'],
        table: { caption: 'Compare the actual covered-freight requirements', headers: ['Question', 'What to establish'], rows: [['Protection', 'The customer’s written cargo-protection requirements'], ['Loading and unloading', 'Side, rear or overhead access and operator-confirmed system compatibility'], ['Closed-system fit', 'Clearance for the complete secured load and normal closure']] },
      },
      {
        id: 'conestoga-change-review', title: 'Keep the covered dimensions current through booking',
        paragraphs: ['A change to packaging, skids or a projecting component can affect whether the rolling cover closes even when the base footprint is unchanged. If the cargo information changes, send the revised dimensions and obtain carrier review before treating the shipment as the same load.', 'Consider a machine whose initial dimensions exclude a later-added crate or protective frame. We ask for the complete prepared-for-shipment dimensions, not the earlier product specification. The carrier then checks the covered space, loading access and securement plan. Agreed changes to equipment or loading instructions belong with the final rate confirmation.', `Conestoga dispatch is ${getDispatchRateLabel('conestoga')} under the published equipment schedule, with the billing base agreed before service. Share your actual covered dimensions, accepted commodities and operating region. The open-deck load checklist provides the cargo questions, while our lane-planning guide helps compare a specialized outbound trip with the realistic next search area.`],
      },
    ],
    faqs: [
      { question: 'Should Conestoga cargo measurements include packaging and skids?', answer: 'Yes. Provide the complete shipment dimensions, including packaging and projecting parts, so the carrier can check the usable covered space, loading access and closure.' },
      { question: 'Can a broker replace a Conestoga request with a standard flatbed automatically?', answer: 'No. Any equipment substitution needs confirmation that the actual configuration meets the shipment’s protection and handling requirements, along with carrier and responsible-party approval.' },
    ],
    related: [{ label: 'Open-deck load and protection checklist', href: '/resources/flatbed-load-tarping-checklist' }, { label: 'Regional and OTR lane planning', href: '/resources/local-vs-regional-vs-otr-trucking' }],
  },
};
