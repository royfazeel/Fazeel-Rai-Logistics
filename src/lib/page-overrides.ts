import { DISPATCH_RATE_RANGE, getDispatchRateLabel } from './dispatch-pricing';

export type PageSeoOverride = { title: string; description: string; h1: string };

// Section 0 controls the supplied October 31 implementation brief.
// Titles are complete absolute strings: consumers must not append a brand suffix.
// Canonical paths stay unchanged except the approved testimonials -> what-to-expect move.
// Conservative copy exceptions and measured lengths are documented in
// docs/seo/implementation-handoff.md; fee-bearing copy uses the approved fee map.
export const PAGE_SEO_OVERRIDES: Record<string, PageSeoOverride> = {
  "/": {
    title: `Truck Dispatch for Owner Operators | ${DISPATCH_RATE_RANGE} | Rai Dispatch`,
    description: `Dedicated truck dispatcher for owner operators and small fleets, lower 48. Fees ${DISPATCH_RATE_RANGE} by equipment, free setup, no forced dispatch. You approve every load.`,
    h1: "Truck dispatch services for owner operators and small fleets",
  },
  "/about": {
    title: "About Rai Dispatch | US Truck Dispatch Company",
    description: "Rai Dispatch is a US truck dispatch company operated by Rai Technologies LLC. Learn how our dispatch service works for owner operators and small fleets.",
    h1: "About Rai Dispatch",
  },
  "/carriers": {
    title: "Dispatch for Owner Operators, Small Fleets & New Authorities",
    description: `Truck dispatch for owner operators, small fleets and new authorities. See who we work with, what we need from you, and the ${DISPATCH_RATE_RANGE} equipment based fee.`,
    h1: "Truck dispatch for owner operators, small fleets and new authorities",
  },
  "/carriers/new-authorities": {
    title: "New Authority Truck Dispatch | First Loads & Broker Setup",
    description: `Dispatch for new MC authorities: broker onboarding review, document checklist, first load timelines and ${DISPATCH_RATE_RANGE} equipment fees. No guaranteed loads.`,
    h1: "Truck dispatch support for new authorities",
  },
  "/carriers/owner-operators": {
    title: `Owner Operator Dispatch | ${DISPATCH_RATE_RANGE} Fees | Rai Dispatch`,
    description: `Owner operator truck dispatch with a dedicated dispatcher: load search, rate negotiation, broker calls and paperwork, lower 48. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    h1: "Truck dispatch services for owner operators",
  },
  "/carriers/small-fleets": {
    title: `Small Fleet Dispatch Services | ${DISPATCH_RATE_RANGE} Fees | Rai Dispatch`,
    description: `Dispatch for small trucking fleets: truck availability planning, load approvals per truck, paperwork and ${DISPATCH_RATE_RANGE} fees by equipment type.`,
    h1: "Truck dispatch services for small fleets",
  },
  "/contact": {
    title: "Contact a Truck Dispatcher | Call or Text (213) 371-6155",
    description: "Discuss your equipment and lanes. Call or text (213) 371-6155 or send the form. New carrier setup desk: Mon to Sat, 8 AM to 6 PM CT.",
    h1: "Let's talk about your dispatch needs",
  },
  "/editorial-standards": {
    title: "Editorial Standards & Corrections | Rai Dispatch",
    description: "How Rai Dispatch researches carrier guides, cites sources, reviews examples and handles corrections. Learn how to report a possible error.",
    h1: "Editorial standards: clear sources, useful examples and corrections",
  },
  "/equipment": {
    title: "Truck Dispatch by Equipment Type | 15 Truck & Trailer Types",
    description: `Dispatch for 15 equipment types: box truck, dry van, reefer, flatbed, power only, step deck, hotshot, cargo van, sprinter, Conestoga and more. Fees ${DISPATCH_RATE_RANGE}.`,
    h1: "Truck dispatch services by equipment type",
  },
  "/equipment/box-truck": {
    title: `Box Truck Dispatch Service: ${getDispatchRateLabel('box-truck')} Fee | Rai Dispatch`,
    description: `Box truck dispatch at ${getDispatchRateLabel('box-truck')} of gross revenue on loads we book. No setup, weekly, monthly or other Rai Dispatch fees. Dedicated dispatcher and 24/7 support.`,
    h1: `Box truck dispatch services: ${getDispatchRateLabel('box-truck')} fee`,
  },
  "/equipment/dry-van": {
    title: `Dry Van Dispatch Service | ${getDispatchRateLabel('dry-van')} Fee, 48 States | Rai Dispatch`,
    description: `Dry van dispatch at ${getDispatchRateLabel('dry-van')} of gross on loads we book. Dedicated dispatcher, 53 ft load search, rate negotiation and paperwork, lower 48. You approve every load.`,
    h1: "Dry van dispatch services for owner operators",
  },
  "/equipment/reefer": {
    title: `Reefer Dispatch Service | ${getDispatchRateLabel('reefer')} of Gross | Rai Dispatch`,
    description: `Reefer dispatch at ${getDispatchRateLabel('reefer')} of gross: temperature instruction review, produce and protein lanes, appointments and rate negotiation. No forced dispatch.`,
    h1: "Reefer dispatch services for owner operators",
  },
  "/equipment/flatbed": {
    title: `Flatbed Dispatch Service | ${getDispatchRateLabel('flatbed')} of Gross | Rai Dispatch`,
    description: `Flatbed dispatch at ${getDispatchRateLabel('flatbed')} of gross on loads we book. Dimensions, tarping and securement reviewed before you approve open deck freight. Dedicated dispatcher.`,
    h1: "Flatbed dispatch services for owner operators",
  },
  "/equipment/power-only": {
    title: `Power Only Dispatch Service | ${getDispatchRateLabel('power-only')} of Gross | Rai Dispatch`,
    description: `Power only dispatch at ${getDispatchRateLabel('power-only')} of gross: drop and hook and trailer pool loads, trailer interchange terms and return planning. No forced dispatch.`,
    h1: "Power only dispatch services for owner operators",
  },
  "/equipment/step-deck": {
    title: `Step Deck Dispatch Service | ${getDispatchRateLabel('step-deck')} Fee | Rai Dispatch`,
    description: `Step deck and drop deck dispatch at ${getDispatchRateLabel('step-deck')} of gross. Deck dimensions, legal heights and loading needs reviewed before you approve a load. Lower 48 coverage.`,
    h1: "Step deck and drop deck dispatch services",
  },
  "/equipment/hotshot": {
    title: `Hotshot Dispatch Service (CDL & Non CDL) | ${getDispatchRateLabel('hotshot')} | Rai Dispatch`,
    description: `Hotshot dispatch at ${getDispatchRateLabel('hotshot')} of gross for CDL and non CDL gooseneck operations. Payload, trailer length, partials and extra stops planned before you approve.`,
    h1: "Hotshot dispatch services for owner operators",
  },
  "/equipment/cargo-van": {
    title: `Cargo Van Dispatch Service: ${getDispatchRateLabel('cargo-van')} Fee | Rai Dispatch`,
    description: `Cargo van dispatch costs ${getDispatchRateLabel('cargo-van')} of gross revenue on loads we book. Sprinter van service is separately listed at ${getDispatchRateLabel('sprinter-van')}. Confirm your vehicle category.`,
    h1: `Cargo van dispatch services: ${getDispatchRateLabel('cargo-van')} fee`,
  },
  "/equipment/sprinter-van": {
    title: `Sprinter Van Dispatch Service: ${getDispatchRateLabel('sprinter-van')} Fee | Rai Dispatch`,
    description: `Sprinter van dispatch costs ${getDispatchRateLabel('sprinter-van')} of gross revenue on loads we book. Cargo van service is separately listed at ${getDispatchRateLabel('cargo-van')}. Confirm your vehicle category.`,
    h1: `Sprinter van dispatch services: ${getDispatchRateLabel('sprinter-van')} fee`,
  },
  "/equipment/conestoga": {
    title: `Conestoga Trailer Dispatch Service | ${getDispatchRateLabel('conestoga')} Fee | Rai Dispatch`,
    description: `Conestoga dispatch at ${getDispatchRateLabel('conestoga')} of gross: rolling tarp clearance, covered loading access and regional or OTR lanes reviewed before you approve a load.`,
    h1: "Conestoga trailer dispatch services",
  },
  "/equipment/rgn-lowboy": {
    title: `RGN & Lowboy Dispatch Service | ${getDispatchRateLabel('rgn-lowboy')} Fee | Rai Dispatch`,
    description: `RGN and lowboy dispatch at ${getDispatchRateLabel('rgn-lowboy')} of gross: machinery dimensions, deck fit, well length, permits and route responsibilities reviewed with a dedicated dispatcher.`,
    h1: "RGN and lowboy dispatch services",
  },
  "/equipment/car-hauler": {
    title: `Car Hauler Dispatch Service | ${getDispatchRateLabel('car-hauler')} Fee | Rai Dispatch`,
    description: `Car hauler and auto transport dispatch at ${getDispatchRateLabel('car-hauler')} of gross: vehicle details, pickup releases, stop planning and paperwork by a dedicated dispatcher.`,
    h1: "Car hauler dispatch services",
  },
  "/equipment/tanker": {
    title: `Tanker Dispatch Service | ${getDispatchRateLabel('tanker')} Fee | Rai Dispatch`,
    description: `Tanker and liquid bulk dispatch at ${getDispatchRateLabel('tanker')} of gross: commodity compatibility, tank specs, washout records and loading terms reviewed before booking.`,
    h1: "Tanker dispatch services",
  },
  "/equipment/dump-truck": {
    title: `Dump Truck Dispatch Service | ${getDispatchRateLabel('dump-truck')} Fee | Rai Dispatch`,
    description: `Dump truck and dump trailer dispatch at ${getDispatchRateLabel('dump-truck')} of gross: aggregate hauling, jobsite schedules, load tickets and haul cycle costs reviewed first.`,
    h1: "Dump truck dispatch services",
  },
  "/equipment/curtain-side": {
    title: `Curtain Side Dispatch Service | ${getDispatchRateLabel('curtain-side')} Fee | Rai Dispatch`,
    description: `Curtain side trailer dispatch at ${getDispatchRateLabel('curtain-side')} of gross: side loading freight, trailer clearance, multi stop planning and paperwork with a dedicated dispatcher.`,
    h1: "Curtain side trailer dispatch services",
  },
  "/faq": {
    title: "Truck Dispatch FAQ | Fees, Loads, Documents & Setup",
    description: "Answers carriers want before hiring a dispatcher: what it costs, how loads are found, documents needed, 24/7 support, cancellation and guarantees.",
    h1: "Frequently asked questions about truck dispatch",
  },
  "/pricing": {
    title: `Truck Dispatch Fees by Equipment: ${DISPATCH_RATE_RANGE} | Rai Dispatch`,
    description: `Box truck dispatch: ${getDispatchRateLabel('box-truck')} of gross revenue on loads we book. Equipment rates ${DISPATCH_RATE_RANGE}. No setup, fixed weekly/monthly or other Rai Dispatch fees.`,
    h1: "Truck dispatch fees by equipment",
  },
  "/privacy": {
    title: "Privacy Policy | Rai Dispatch",
    description: "How Rai Technologies LLC (Rai Dispatch) collects and uses information submitted by carriers, handles service inquiries and receives privacy requests.",
    h1: "Privacy policy",
  },
  "/resources": {
    title: "Truck Dispatch Resources: Guides, Checklists & Calculator",
    description: "Carrier guides on dispatch fees, finding loads, rate confirmations, deadhead, new authority approval and more, plus a glossary and a load profit calculator.",
    h1: "Truck dispatch resources for owner operators",
  },
  "/resources/carrier-onboarding-checklist": {
    title: "Dispatch Onboarding Checklist for Carriers | Rai Dispatch",
    description: "Documents, equipment specs, lane preferences and agreement terms to prepare before starting with a truck dispatcher. A practical onboarding checklist.",
    h1: "Truck dispatch onboarding checklist",
  },
  "/resources/detention-layover-tonu-documentation": {
    title: "Detention, Layover & TONU: Documentation Guide",
    description: "How to document detention, layover, TONU and lumper charges: timestamps, rate con terms, receipts and follow ups that support accessorial requests.",
    h1: "Detention, layover and TONU: a carrier documentation checklist",
  },
  "/resources/evaluate-freight-rate-per-mile": {
    title: "How to Evaluate a Freight Rate Per Mile | Rai Dispatch",
    description: "Rate per mile explained for owner operators: loaded vs total miles, deadhead, dispatch fee and trip time, with a worked example and a pre booking checklist.",
    h1: "How to evaluate a freight rate before booking",
  },
  "/resources/flatbed-load-tarping-checklist": {
    title: "Flatbed Load & Tarping Checklist | Rai Dispatch",
    description: "Review flatbed freight before booking: dimensions, tarp requirements, securement, site access and appointments, plus how tarp pay is negotiated.",
    h1: "Flatbed load checklist: dimensions, tarping and loading details",
  },
  "/resources/fuel-surcharge-calculation-for-carriers": {
    title: "Fuel Surcharge Calculation for Carriers | Rai Dispatch",
    description: "How a diesel fuel surcharge is calculated: EIA index, base price, MPG divisor and mileage, with a worked example and what to confirm in the rate confirmation.",
    h1: "Fuel surcharge calculation: a practical guide for carriers",
  },
  "/resources/hotshot-load-planning-checklist": {
    title: "Hotshot Load Planning Checklist | CDL & Non CDL",
    description: "Plan hotshot loads around actual payload, trailer length, cargo dimensions, securement, appointments and total miles before you approve freight.",
    h1: "Hotshot load planning: a checklist before accepting freight",
  },
  "/resources/how-to-choose-a-truck-dispatcher": {
    title: "How to Choose a Truck Dispatcher | Carrier Checklist",
    description: "A carrier checklist for choosing a dispatch service: equipment fit, fee base, load approval, contract terms, communication and red flags to avoid.",
    h1: "How to choose a truck dispatcher",
  },
  "/resources/how-to-find-box-truck-loads": {
    title: "How to Find Box Truck Loads (26 ft & Straight Trucks)",
    description: "Where box truck loads come from: load boards, brokers and direct carrier programs, plus how to evaluate payload, loading access and trip costs.",
    h1: "How to find box truck loads that fit your operation",
  },
  "/resources/load-board-vs-dispatch-service": {
    title: "Load Board vs Dispatch Service: Which Do You Need?",
    description: "Load boards list freight; dispatchers search, negotiate and book it. Compare costs, time, account access and control before choosing either path.",
    h1: "Load board vs. dispatch service: what does each do?",
  },
  "/resources/local-vs-regional-vs-otr-trucking": {
    title: "Local vs Regional vs OTR Trucking | Rai Dispatch",
    description: "Compare local, regional and OTR trucking by home time, appointments, total miles and reload planning, and build a lane brief your dispatcher can work from.",
    h1: "Local, regional or OTR trucking: choose a workable dispatch plan",
  },
  "/resources/new-authority-broker-approval": {
    title: "New Authority Broker Approval Checklist | Rai Dispatch",
    description: "How brokers review a new trucking authority: operating status, insurance, carrier documents and eligibility, with practical follow up questions.",
    h1: "New authority broker approval: a practical review checklist",
  },
  "/resources/partial-truckload-vs-ltl": {
    title: "Partial Truckload vs LTL: A Carrier Guide | Rai Dispatch",
    description: "Partial truckload, LTL and exclusive use freight explained for carriers: usable space, co loading terms, delivery sequence and trip costs.",
    h1: "Partial truckload vs. LTL: a carrier's load planning guide",
  },
  "/resources/power-only-trailer-interchange-checklist": {
    title: "Power Only Trailer Interchange Checklist | Rai Dispatch",
    description: "Review a power only load from trailer pickup to return: equipment identity, written trailer terms, inspections, responsibility, mileage and release records.",
    h1: "Power only loads: trailer handoff and return checklist",
  },
  "/resources/rate-confirmation-checklist": {
    title: "Rate Confirmation Checklist: Review Before You Book",
    description: "What to check on a rate confirmation: pay, appointments, cargo, accessorial terms, document instructions and broker identity, with a worked example.",
    h1: "Rate confirmation checklist: review the load before booking",
  },
  "/resources/reduce-deadhead-miles": {
    title: "How to Reduce Deadhead Miles | Rai Dispatch",
    description: "Cut empty miles with better load planning: pickup distance, reload timing and total trip miles reviewed before booking. A checklist for owner operators.",
    h1: "How to review and reduce deadhead miles",
  },
  "/resources/reefer-load-temperature-checklist": {
    title: "Reefer Load Temperature Checklist | Rai Dispatch",
    description: "Prepare a reefer load brief: written temperature instructions, continuous vs cycle mode, pre cool, appointments and what to do if the set point changes.",
    h1: "Reefer load checklist: temperature instructions before booking",
  },
  "/resources/self-dispatch-vs-dispatch-service": {
    title: "Self Dispatch vs Dispatch Service: Cost Comparison",
    description: "Compare self dispatching with a paid dispatch service: time, load approval, broker communication and the full fee on a worked example before choosing.",
    h1: "Self dispatch or a truck dispatch service?",
  },
  "/resources/truck-dispatch-fees": {
    title: `Truck Dispatch Fees by Equipment (${DISPATCH_RATE_RANGE}) | Rai Dispatch`,
    description: `Truck dispatch fees by equipment: box trucks ${getDispatchRateLabel('box-truck')}, cargo vans ${getDispatchRateLabel('cargo-van')} and Sprinter vans ${getDispatchRateLabel('sprinter-van')}. No setup, fixed weekly/monthly or other Rai Dispatch fees.`,
    h1: "Truck dispatch fees by equipment",
  },
  "/resources/truck-dispatch-service-agreement-checklist": {
    title: "Truck Dispatch Agreement Checklist | Rai Dispatch",
    description: "Review a dispatch agreement before signing: scope, carrier approval, fee base, account access, communication, cancellation and handover of existing loads.",
    h1: "Truck dispatch service agreement: a carrier review checklist",
  },
  "/resources/truck-dispatcher-vs-freight-broker": {
    title: "Truck Dispatcher vs Freight Broker | FMCSA Rules",
    description: "Dispatcher vs broker explained with FMCSA guidance (88 FR 39368): who each represents, who pays, when broker authority is required and questions for carriers.",
    h1: "Truck dispatcher vs. freight broker: what carriers need to know",
  },
  "/resources/trucking-dispatch-glossary": {
    title: "Truck Dispatch Glossary: 40+ Freight Terms Explained",
    description: "Trucking and dispatch terms defined for carriers: deadhead, rate confirmation, detention, TONU, power only, drop and hook, Conestoga and more, with examples.",
    h1: "Truck dispatch and freight glossary",
  },
  "/resources/verify-freight-broker-identity": {
    title: "How to Verify a Freight Broker Before Booking",
    description: "Check broker identity with FMCSA records, bond status, contact details and changed load instructions. A fraud prevention workflow for owner operators.",
    h1: "How to verify a freight broker's identity before booking",
  },
  "/resources/what-does-a-truck-dispatcher-do": {
    title: "What Does a Truck Dispatcher Do? | Rai Dispatch",
    description: "What a truck dispatcher does from load search to delivery paperwork, which decisions stay with the carrier, what it costs and a worked load approval example.",
    h1: "What does a truck dispatcher do for an owner operator?",
  },
  "/service-areas": {
    title: "Nationwide Truck Dispatch | Lower 48 Service Areas",
    description: "Truck dispatch across the lower 48 with lane notes for dry van, reefer, flatbed, box truck and power only carriers in Texas, Florida, Georgia and more.",
    h1: "Truck dispatch across the lower 48 states",
  },
  "/services": {
    title: "Truck Dispatch Services | Load Booking to Paperwork",
    description: "Dedicated dispatcher, load booking, rate negotiation, scheduling and paperwork for owner operators and fleets. 24/7 support for active carriers.",
    h1: "Truck dispatch services for owner operators and fleets",
  },
  "/services/backhaul-dispatch": {
    title: "Backhaul & Return Load Dispatch | Rai Dispatch",
    description: "Backhaul and reload planning with a dedicated dispatcher: pickup distance, appointments and home time compared before you approve the next load.",
    h1: "Backhaul and reload dispatch support",
  },
  "/services/broker-communication": {
    title: "Broker Communication Support for Carriers | Rai Dispatch",
    description: "We handle broker calls, load details, rate con questions and shipment updates so you can drive. Material changes always come back to you for approval.",
    h1: "Broker communication for owner operators",
  },
  "/services/dedicated-dispatcher": {
    title: "Dedicated Truck Dispatcher | Owner Operators & Fleets",
    description: `One dedicated dispatcher who knows your truck, lanes and schedule, with team backup and 24/7 live support for active carriers. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    h1: "Dedicated truck dispatcher for owner operators and fleets",
  },
  "/services/expedited-dispatch": {
    title: "Expedited Freight Dispatch | Time Critical Loads",
    description: "Expedited dispatch for cargo vans, sprinters, box trucks and hotshots: readiness, transit time and delivery windows confirmed before you approve a load.",
    h1: "Expedited truck dispatch support",
  },
  "/services/load-booking": {
    title: "Truck Load Booking Service | Rai Dispatch",
    description: "We search load boards and broker networks, screen requirements and present complete load proposals. You approve, we book and confirm.",
    h1: "Truck load search and booking support",
  },
  "/services/otr-dispatch": {
    title: `OTR & Long Haul Truck Dispatch | ${DISPATCH_RATE_RANGE} Fees`,
    description: `OTR dispatch across the lower 48: outbound loads, delivery windows, reloads and home time planning with a dedicated dispatcher. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    h1: "OTR and long haul truck dispatch services",
  },
  "/services/paperwork-support": {
    title: "Rate Con, BOL & POD Paperwork Support | Rai Dispatch",
    description: "Help organizing carrier packets, rate confirmations, BOLs, PODs and accessorial documentation so invoices and factoring submissions go out complete.",
    h1: "Truck dispatch paperwork support",
  },
  "/services/rate-negotiation": {
    title: "Freight Rate Negotiation for Carriers | Rai Dispatch",
    description: "Rate negotiation on every load you consider: total miles, deadhead, fuel, schedule and accessorials weighed before you approve. We argue for your truck.",
    h1: "Freight rate negotiation for carriers",
  },
  "/services/regional-dispatch": {
    title: `Regional Truck Dispatch Services | ${DISPATCH_RATE_RANGE} Fees`,
    description: `Regional dispatch with a dedicated dispatcher: home time, pickup distance, reloads and appointments planned around your area. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    h1: "Regional truck dispatch services",
  },
  "/services/route-strategy": {
    title: "Truck Route & Lane Planning Support | Rai Dispatch",
    description: "Lane planning around total miles, home time and the next load for regional and OTR owner operators and small fleets.",
    h1: "Truck route and freight lane strategy",
  },
  "/services/scheduling": {
    title: "Appointment Scheduling & Check Calls | Rai Dispatch",
    description: "Pickup and delivery appointment scheduling, shipment updates and delay follow ups planned around real driver and equipment availability.",
    h1: "Truck appointment scheduling and follow ups",
  },
  "/terms": {
    title: "Terms of Service | Rai Dispatch",
    description: "Rai Dispatch service terms: carrier responsibilities, dispatch fees, load approvals, payment arrangements and cancellation conditions.",
    h1: "Terms of Service",
  },
  "/tools/load-profit-calculator": {
    title: "Truck Load Profit Calculator | Rate Per Mile & Break Even",
    description: "Free load profit calculator for owner operators: enter pay, deadhead, fuel, dispatch fee and costs to see revenue per total mile and the break even rate.",
    h1: "Truck load profit and break even calculator",
  },
  "/what-to-expect": {
    title: "What to Expect from Rai Dispatch | Carrier Commitments",
    description: "Our commitments to carriers: you approve every load, review published fees and work with a dedicated dispatcher. Understand the service before onboarding.",
    h1: "What to expect from Rai Dispatch",
  },
};
