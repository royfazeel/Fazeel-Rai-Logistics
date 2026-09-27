import { DISPATCH_PRICING_SUMMARY, DISPATCH_RATE_RANGE, getDispatchRate, getDispatchRateLabel } from './dispatch-pricing';
import type { CarrierGuide, DispatchContent } from './dispatch-content';

export const ADDITIONAL_SERVICES: DispatchContent[] = [
  {
    slug: 'regional-dispatch',
    title: 'Regional truck dispatch services',
    metaTitle: `Regional Truck Dispatch Services | ${DISPATCH_RATE_RANGE} Fees`,
    description: `Regional truck dispatch with a dedicated dispatcher. Plan home time, pickup distance, reloads and appointments across the lower 48. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    eyebrow: 'Regional lanes · A workable weekly plan',
    intro: 'Regional dispatch starts with the area you want to run and the days you want to be available. Rai Dispatch helps owner-operators and small fleets search freight within a practical region, review the full trip and approve loads that fit their equipment and schedule.',
    highlights: ['Home-base and radius planning', 'Pickup and reload review', 'You approve the freight'],
    sections: [
      { id: 'define-region', title: 'Define your region in operating terms', paragraphs: ['A regional trucking plan is more useful when it names a home base, workable destinations and actual availability. Tell us the states you prefer, the cities or facilities you avoid, your maximum empty drive and whether overnight appointments fit your week. A map alone does not show those restrictions.', 'We use these details to narrow the load search. A carrier working within several neighboring states may have different needs from a driver who wants to return to the same city frequently. Discuss the difference before starting so the search reflects the work you are prepared to accept.'] },
      { id: 'weekly-plan', title: 'Plan the sequence, not just the first pickup', paragraphs: ['A short trip can still occupy several days when appointments, live unloading or a weekend intervene. We review when the truck should be empty, where it will be and whether the next pickup is practical. If a delivery changes, update the dispatch desk before the next load is booked.', 'For example, a Friday delivery near home may suit your week better than a higher-paying trip that ends outside your preferred region. That decision belongs to you. We organize the load details and alternatives so the choice includes time and location as well as the posted rate.'], bullets: ['Start with the driver’s accurate available time.', 'Compare pickup deadhead and the likely next empty location.', 'Check appointment windows and handling requirements.', 'Set a clear latest return target when home time matters.'] },
      { id: 'equipment', title: 'Match regional freight to your equipment', paragraphs: ['A dry van, reefer, flatbed and box truck do not have the same loading needs. Share actual dimensions, payload, loading access and any handling limits. Regional box truck work may involve delivery access or liftgate requirements; reefer work adds temperature and appointment details; open-deck freight requires careful dimension and equipment review.', 'We discuss load suitability and broker requirements before asking for approval. Regional coverage means remote dispatch support for suitable freight in the lower 48; it does not imply a local terminal, an established delivery contract or an available load in every city.'] },
      { id: 'start', title: 'Agree the support and fee before the first load', paragraphs: [`Dispatch fees range from ${DISPATCH_RATE_RANGE} of the agreed revenue base on loads we dispatch, according to equipment type. Your dedicated dispatcher supports load search, rate discussions, booking coordination, broker communication and paperwork follow-ups. Confirm the equipment rate, included tasks, invoice timing and cancellation terms in writing.`, 'Bring your current location, truck specifications, preferred states and schedule to the first conversation. We will review whether the service fits your operation and explain the next steps. You retain the decision to accept or decline each load.'] },
    ],
    checklistTitle: 'Your regional dispatch brief',
    checklist: ['Home base and preferred states', 'Pickup radius and destinations to avoid', 'Available days and home-time target', 'Equipment dimensions and handling limits'],
    faqs: [
      { question: 'Can regional dispatch get me home every night?', answer: 'Daily home time depends on the actual load, appointments, distance and available freight. Tell us that requirement before onboarding so we can assess fit. It is not promised by a general regional dispatch plan.' },
      { question: 'Do you provide local truck dispatch near my location?', answer: 'Share your location, radius and equipment. We coordinate remotely and review whether the available service and freight fit local or regional work in your area.' },
      { question: 'Can I change my preferred region?', answer: 'Yes. Update your preferences and available dates before the next search. Existing bookings and their agreed obligations still need to be handled appropriately.' },
    ],
    related: [{ label: 'Nationwide service areas', href: '/service-areas' }, { label: 'OTR dispatch', href: '/services/otr-dispatch' }, { label: 'Box truck dispatch', href: '/equipment/box-truck' }, { label: 'Dispatch pricing', href: '/pricing' }],
  },
  {
    slug: 'otr-dispatch', title: 'OTR and long-haul truck dispatch services',
    metaTitle: `OTR & Long-Haul Truck Dispatch | ${DISPATCH_RATE_RANGE} Fees`,
    description: `OTR dispatch across the lower 48 with a dedicated dispatcher. Review outbound loads, delivery windows, reloads and home time. Fees ${DISPATCH_RATE_RANGE} by equipment.`,
    eyebrow: 'Over-the-road dispatch · Plan the whole trip',
    intro: 'Over-the-road dispatch connects the load you can pick up today with the operation you want to run next week. Rai Dispatch supports long-haul carriers with freight search, rate negotiation, broker communication and practical lane planning across the 48 contiguous states.',
    highlights: ['Outbound and reload planning', 'Long-haul appointment coordination', 'Carrier-controlled load approval'],
    sections: [
      { id: 'trip-plan', title: 'Start with the full time away from home', paragraphs: ['Tell us when the truck is empty, the regions you will run and the date you want to return. Include planned maintenance, time off and equipment restrictions. An OTR plan should reflect the driver’s real availability instead of filling a calendar with miles that cannot be completed.', 'The proposed trip needs enough time for pickup, travel, loading, unloading and the next appointment. Carriers and drivers remain responsible for safe operation and applicable requirements. We use accurate status updates from your operation to avoid arranging freight around outdated assumptions.'] },
      { id: 'outbound', title: 'Evaluate the destination before accepting the outbound load', paragraphs: ['The highest posted rate is not always the most suitable trip. Review the empty drive to pickup, loaded distance, expected delivery time and where the equipment will be available afterward. A destination outside your preferred network can create a costly reposition or an unwanted extension of the trip.', 'We help compare current options and discuss rates with the broker. Potential reloads are part of planning, but freight is only confirmed after the necessary approvals and booking. Treat an unbooked return load as an option to investigate, not as money already earned.'] },
      { id: 'communication', title: 'Keep long-haul communication specific', paragraphs: ['On a multi-day trip, a small schedule change can affect the next load. Report departure, arrival, loading and delivery changes through the agreed contact method. Clear updates give the dispatch desk time to ask about appointment changes or revise the next search.', 'Before pickup, confirm contact details, reference numbers, commodity information and any special instructions. Reefer temperature requirements, flatbed dimensions, power-only trailer arrangements and dry van handling conditions all need their own review. The equipment name by itself does not establish that a load will fit.'], bullets: ['Confirm written pickup and delivery instructions.', 'Share changes in truck availability promptly.', 'Keep records supporting detention or other requests.', 'Review the next pickup only against the updated schedule.'] },
      { id: 'review', title: 'Review completed trips using consistent measures', paragraphs: ['A useful trip review includes total miles, empty miles, days committed, waiting time and documented expenses. Those measures help you decide whether to repeat a lane, change the pickup radius or shorten time away. Gross load pay by itself does not show the effect on your business.', `Our percentage dispatch fee is ${DISPATCH_RATE_RANGE} by equipment, with the exact rate, revenue base and scope agreed before service. Ask about the published desk hours and any load-specific communication arrangement before starting. Nationwide OTR support does not mean automatic around-the-clock coverage.`] },
    ],
    checklistTitle: 'Before planning an OTR run',
    checklist: ['Current empty location and available time', 'Preferred outbound regions and avoided lanes', 'Home-time date and trip-length preference', 'Equipment specifications and broker requirements'],
    faqs: [
      { question: 'Do you offer coast-to-coast truck dispatch?', answer: 'We support suitable long-haul operations across the lower 48. Share your equipment and preferred lanes so we can review the service fit and current freight options.' },
      { question: 'Are backhauls or return loads guaranteed?', answer: 'No. We consider return options when planning, but availability, requirements and appointments change. A particular load must be approved and booked before it is treated as confirmed.' },
      { question: 'Can a small fleet use OTR dispatch support?', answer: 'Yes. Identify each truck, its availability and the people authorized to approve loads. We review the coordination needs and service scope with the fleet before onboarding.' },
    ],
    related: [{ label: 'Small fleet dispatch', href: '/carriers/small-fleets' }, { label: 'Backhaul and reload support', href: '/services/backhaul-dispatch' }, { label: 'Dry van dispatch', href: '/equipment/dry-van' }, { label: 'Reefer dispatch', href: '/equipment/reefer' }, { label: 'Evaluate a freight rate', href: '/resources/evaluate-freight-rate-per-mile' }],
  },
  {
    slug: 'dedicated-dispatcher', title: 'Dedicated truck dispatcher support',
    metaTitle: 'Dedicated Truck Dispatcher for Your Operation',
    description: `Get a dedicated truck dispatcher for load search, rate negotiation, broker updates and paperwork. You approve each load. Dispatch fees ${DISPATCH_RATE_RANGE} by equipment.`,
    eyebrow: 'Your dispatch contact · A clear working relationship',
    intro: 'Rai Dispatch provides a dedicated dispatcher for each truck, with free setup. Your dispatcher learns its equipment, operating preferences and the way you approve freight. You have an assigned contact for the agreed dispatch work, so you can discuss loads and changes without explaining your operation from the beginning each time.',
    highlights: ['Dedicated dispatcher for each truck', 'Free setup', 'Published desk hours'],
    sections: [
      { id: 'working-profile', title: 'Build a useful operating profile', paragraphs: ['The working relationship starts with specific information: equipment, payload, current location, preferred lanes, avoided destinations, home-time needs and the people who can approve bookings. Tell us which details are fixed and which can change from trip to trip.', 'Keep that profile current when a truck is replaced, a driver’s schedule changes or a new handling restriction applies. Your dispatcher can use the information to narrow the search, but cannot see an operational change that has not been communicated.'] },
      { id: 'approval', title: 'Use an explicit load-approval process', paragraphs: ['Agree how the proposed load will be presented and how you will approve it. A useful summary includes the route, dates, appointments, compensation, empty miles and important handling requirements. Clarify any missing details before giving the booking approval.', 'You keep control of the operation and can decline freight that does not fit. If several people work in the carrier’s office, identify the authorized decision-maker so the desk does not receive conflicting instructions. A quick answer is helpful only when it is also a clear answer.'], bullets: ['Name the people authorized to approve loads.', 'Choose the communication channel for approval.', 'Review written terms and special requirements.', 'Tell the desk promptly when availability changes.'] },
      { id: 'updates', title: 'Set expectations for updates and escalation', paragraphs: ['Discuss when routine updates are expected, which issues need a call and who receives time-sensitive changes. Loading delays, equipment problems and appointment conflicts are easier to address when the relevant information reaches the right contact promptly.', 'Your dedicated dispatcher is your primary contact for the agreed service. Our published dispatch desk hours are Monday through Saturday, 8 AM to 6 PM Central Time. Confirm direct contact details, backup arrangements and any after-hours needs before a load begins.'] },
      { id: 'scope', title: 'Separate a dedicated dispatcher from dedicated freight', paragraphs: ['A dedicated dispatcher and a dedicated lane are different arrangements. The first concerns who supports your carrier operation. The second concerns a particular recurring freight commitment, which needs its own confirmed schedule, requirements and agreement.', `General dispatch onboarding does not provide a contracted lane or a guaranteed volume of freight. Our support includes agreed load search, rate discussions, booking coordination and follow-ups, with percentage dispatch fees ${DISPATCH_RATE_RANGE} by equipment. Review the service agreement and billing base before starting.`] },
    ],
    checklistTitle: 'Agree this with your dispatcher',
    checklist: ['Equipment and lane profile', 'Load approval contact and channel', 'Routine update and escalation process', 'Desk hours, backup arrangements and fee terms'],
    faqs: [
      { question: 'Will I have a dedicated dispatcher?', answer: 'Yes. Rai Dispatch provides a dedicated dispatcher for each truck who learns its equipment, preferred lanes and scheduling needs. Confirm your direct contact details and the backup process during onboarding.' },
      { question: 'Does this include guaranteed dedicated lanes?', answer: 'No. Dedicated freight requires a separately confirmed arrangement. A dispatcher relationship alone does not establish recurring loads, a particular lane or a promised weekly gross.' },
      { question: 'What if my usual contact is unavailable?', answer: 'Ask about the backup and escalation process during onboarding. Keep the agreed contact details accessible to the carrier office and driver before a load begins.' },
    ],
    related: [{ label: 'Owner-operator dispatch', href: '/carriers/owner-operators' }, { label: 'Broker communication', href: '/services/broker-communication' }, { label: 'Choose a dispatcher', href: '/resources/how-to-choose-a-truck-dispatcher' }, { label: 'Contact Rai Dispatch', href: '/contact' }],
  },
  {
    "slug": "expedited-dispatch",
    "title": "Expedited truck dispatch support",
    "metaTitle": "Expedited Truck Dispatch | Time-Sensitive Freight",
    "description": "Expedited dispatch support for suitable cargo vans, box trucks, hotshots and trucks. Review readiness, delivery deadlines and load instructions before booking.",
    "eyebrow": "Time-sensitive freight · Confirm the details first",
    "intro": "An urgent shipment needs a truck that is genuinely ready, accurate dimensions and a delivery plan the carrier can complete. Rai Dispatch helps review expedited opportunities and coordinate the booking details for suitable equipment. Tell us the pickup location, available time and operating limits so urgency does not replace a proper load review.",
    "highlights": [
      "Pickup readiness checked",
      "Deadline and handling review",
      "Carrier-approved expedited loads"
    ],
    "availability": "Expedited support is subject to equipment fit, broker acceptance, freight availability and the agreed service scope. Dispatch desk hours are Monday–Saturday, 8 AM–6 PM Central Time; after-hours arrangements must be confirmed before accepting a load.",
    "sections": [
      {
        "id": "ready",
        "title": "Establish when the truck can actually load",
        "paragraphs": [
          "Give the dispatcher the truck's present location and the earliest realistic arrival at pickup. Include time to finish an existing delivery, prepare the equipment and reach the facility. An estimated empty time should be identified as an estimate and updated when circumstances change.",
          "Readiness also includes the driver, usable payload, door opening and loading equipment. A cargo van near the shipper may still be unsuitable for a tall pallet. A box truck may need a liftgate or dock-compatible floor height. We collect these details before treating proximity as a reason to book."
        ]
      },
      {
        "id": "deadline",
        "title": "Translate an urgent request into a workable schedule",
        "paragraphs": [
          "Ask whether the pickup is ready now, whether the stated delivery time is an appointment or a deadline, and who can receive the freight. Clarify the time zone, check-in process and any limits on early or late arrival. A message saying “ASAP” leaves too much unresolved.",
          "The carrier and driver must decide whether the trip fits their availability and safe operating limits. We coordinate the information and seek clarification when the schedule changes. Expedited dispatch does not authorize speeding, skipped rest or a delivery promise based only on map mileage."
        ],
        "bullets": [
          "Confirm freight readiness and pickup contact.",
          "Record the delivery time zone and receiving hours.",
          "Check driver availability and all planned stops.",
          "Agree the contact for changes during the trip."
        ]
      },
      {
        "id": "equipment",
        "title": "Choose equipment from the shipment requirements",
        "paragraphs": [
          "Time-sensitive freight can call for a cargo or Sprinter van, box truck, hotshot combination or full-size trailer. The correct choice depends on the cargo and instructions, not simply on which vehicle is smallest. Provide piece dimensions, total weight, stacking restrictions, loading method and any temperature or securement requirements.",
          "Clarify exclusive-use instructions before considering other freight. If the load must travel alone or follow a specified sequence, spare cargo space is not permission to add a pickup. Special handling, high-value cargo or other unusual requirements need a separate capability review."
        ]
      },
      {
        "id": "example",
        "title": "A hypothetical deadline review",
        "paragraphs": [
          "Suppose a box truck is expected to finish unloading at 10 AM and an urgent pickup is 50 miles away. Before agreeing to an 11 AM pickup, verify the actual release time, facility exit process, travel conditions and loading appointment. A delay at the first stop can invalidate the proposed schedule.",
          "We would seek a confirmed pickup window and present the revised details for carrier approval. If the timing does not work, the next step is to decline or discuss an alternative. This example describes a decision process, not a service-time guarantee."
        ]
      },
      {
        "id": "scope",
        "title": "Confirm communication and the dispatch fee",
        "paragraphs": [
          "Identify who needs pickup, departure and delivery updates and how those updates should be sent. Keep the written instructions accessible to the driver. If a problem develops, report the actual status promptly so the responsible parties can decide what changes are possible.",
          `Rai Dispatch provides a dedicated dispatcher for the agreed work. Published fees: ${DISPATCH_PRICING_SUMMARY} Confirm the billing base, service scope and communication arrangements before booking.`
        ]
      }
    ],
    "checklistTitle": "Send a complete expedited load brief",
    "checklist": [
      "Actual empty location and earliest pickup readiness",
      "Cargo dimensions, weight and loading method",
      "Pickup window, delivery deadline and time zones",
      "Driver availability and agreed escalation contacts"
    ],
    "faqs": [
      {
        "question": "Does expedited dispatch mean 24/7 support?",
        "answer": "No. Our published desk hours are Monday–Saturday, 8 AM–6 PM Central Time. Discuss any load that needs communication outside those hours before booking; do not assume coverage."
      },
      {
        "question": "Can you guarantee same-day delivery?",
        "answer": "No. A particular trip must be reviewed against freight readiness, distance, appointments, equipment and driver availability. Delivery commitments belong in the approved load terms."
      },
      {
        "question": "Is expedited freight only for cargo vans?",
        "answer": "No. Different shipments may require vans, box trucks, hotshots or larger trailers. Actual dimensions, payload and handling instructions determine suitability."
      }
    ],
    "related": [
      {
        "label": "Cargo van dispatch",
        "href": "/equipment/cargo-van"
      },
      {
        "label": "Box truck dispatch",
        "href": "/equipment/box-truck"
      },
      {
        "label": "Hotshot dispatch",
        "href": "/equipment/hotshot"
      },
      {
        "label": "Rate confirmation checklist",
        "href": "/resources/rate-confirmation-checklist"
      },
      {
        "label": "Dispatch pricing",
        "href": "/pricing"
      }
    ]
  },
  {
    "slug": "backhaul-dispatch",
    "title": "Backhaul and reload dispatch support",
    "metaTitle": "Backhaul & Return Load Dispatch Services",
    "description": "Plan backhauls, return loads and reloads with a dedicated dispatcher. Compare pickup distance, appointments and home time before approving the next shipment.",
    "eyebrow": "The next load · A practical return plan",
    "intro": "The end of one delivery is the starting point for the next load search. Rai Dispatch helps owner-operators and fleets review backhaul and reload options around their actual empty location, available time and next destination. Your return plan can include home time or another working region, with each load approved separately.",
    "highlights": [
      "Return destination clarified",
      "Updated empty-time planning",
      "Total-trip comparisons"
    ],
    "sections": [
      {
        "id": "define-return",
        "title": "Tell us where the truck needs to be next",
        "paragraphs": [
          "A backhaul commonly describes freight on a return leg; a reload can take the truck toward a different destination. Specify whether your priority is returning to a home base, reaching a preferred market or continuing an OTR trip. These are different search objectives and may produce different options.",
          "Share the latest acceptable arrival date as well as the destination. A load headed toward home may still miss your schedule because of a delivery appointment or weekend closure. Identify firm commitments before considering a longer detour or another overnight stop."
        ]
      },
      {
        "id": "availability",
        "title": "Build the search from a reliable empty time",
        "paragraphs": [
          "The expected end of the current load needs to include unloading, document collection and any required equipment preparation. A reefer may need a washout; a power-only tractor may have trailer-return obligations; an open-deck carrier may need time to remove and store securement equipment.",
          "We can discuss possible next loads while you are still under a shipment, but the availability estimate must stay current. Report delays promptly. A promising posting is not a confirmed booking, and an uncertain unload time should not be presented to the next broker as a firm commitment."
        ],
        "bullets": [
          "Identify the actual empty location.",
          "Allow for unloading and equipment preparation.",
          "Check obligations attached to the current trailer.",
          "Update the desk when the delivery schedule changes."
        ]
      },
      {
        "id": "compare",
        "title": "Compare the return load with the complete alternative",
        "paragraphs": [
          "Review the empty drive to pickup, the loaded route and any remaining miles to your destination. Add waiting, loading and delivery time. A backhaul that pays something is not automatically a better choice than another plan; extra time and costs can consume the benefit.",
          "For a hypothetical comparison, a truck has a 300-mile direct drive home. A proposed return load needs 70 empty miles, 250 loaded miles and another 100 miles after delivery. The freight option totals 420 miles, or 120 more than the direct drive. Compare the confirmed compensation against those extra miles, appointment time, dispatch fees and your own costs.",
          "That arithmetic does not determine profitability. A late delivery might also change home time or the next booked job. We organize the options so the carrier can make the decision with the known facts, while keeping unconfirmed opportunities separate."
        ]
      },
      {
        "id": "book",
        "title": "Review the reload as a new booking",
        "paragraphs": [
          "Do not skip equipment or broker checks just because a load is on the way back. Confirm commodity, dimensions, weight, loading access, appointments, payment terms and any restrictions. The carrier's approval of the outbound load does not approve a separate return shipment.",
          "Keep the confirmations and delivery documents for each load clearly identified. If the return trip involves a partial shipment, check co-loading permission and the complete stop sequence. A change to one booking may require a fresh review of the others."
        ]
      },
      {
        "id": "scope",
        "title": "Agree the dispatch scope before the return search",
        "paragraphs": [
          "A dedicated dispatcher can support return-load search, rate discussions, broker communication and booking coordination within the agreed service. Tell us if you booked the outbound load independently so responsibilities and the fee treatment are clear.",
          `Published dispatch fees are ${DISPATCH_RATE_RANGE} by equipment on loads we dispatch, with the billing base agreed in writing. Backhaul planning does not guarantee freight, a particular rate or a return-home date. Bring the current delivery details and destination to the discussion so we can review whether the service fits.`
        ]
      }
    ],
    "checklistTitle": "Your backhaul search brief",
    "checklist": [
      "Delivery location and realistic empty time",
      "Next destination and latest acceptable arrival",
      "Pickup radius, equipment limits and trailer obligations",
      "Carrier approval contact and written fee terms"
    ],
    "faqs": [
      {
        "question": "Are backhauls guaranteed?",
        "answer": "No. Suitable freight, broker approval, equipment and appointments must align. A return load is confirmed only after the required approvals and booking."
      },
      {
        "question": "Can I request a backhaul for an outbound load I booked myself?",
        "answer": "You can request a service-fit review. Share the existing booking and clarify which work Rai Dispatch will handle and which dispatched loads are subject to the fee."
      },
      {
        "question": "Will any paying return load reduce my costs?",
        "answer": "Not necessarily. Compare the entire route, extra miles, waiting, handling requirements and fees against your actual alternatives before deciding."
      }
    ],
    "related": [
      {
        "label": "Review deadhead miles",
        "href": "/resources/reduce-deadhead-miles"
      },
      {
        "label": "OTR dispatch",
        "href": "/services/otr-dispatch"
      },
      {
        "label": "Rate-per-mile calculation",
        "href": "/resources/evaluate-freight-rate-per-mile"
      },
      {
        "label": "Partial load planning",
        "href": "/resources/partial-truckload-vs-ltl"
      },
      {
        "label": "Route and lane strategy",
        "href": "/services/route-strategy"
      }
    ]
  },
];

export const ADDITIONAL_GUIDES: CarrierGuide[] = [
  {
    "slug": "load-board-vs-dispatch-service",
    "title": "Load board vs. dispatch service: what does each do?",
    "metaTitle": "Load Board vs Dispatch Service | Carrier Guide",
    "description": "Understand the difference between a load board and dispatch support. Compare search tools, booking work, account access and costs without confusing listings with loads.",
    "eyebrow": "Carrier guide · Tools and the work behind them",
    "published": "2026-09-28",
    "updated": "2026-09-28",
    "readTime": "5 minute read",
    "intro": "A load board is a tool for finding freight opportunities. A dispatch service performs agreed work around searching, reviewing, arranging and following up on loads. Carriers can use both. The important comparison is who will do each task, what information they need and what the carrier will pay for the complete arrangement.",
    "highlights": [
      "Separate tools from service",
      "Clarify account access",
      "Compare the whole workflow"
    ],
    "sections": [
      {
        "id": "different-jobs",
        "title": "A listing starts a review; it does not finish a booking",
        "paragraphs": [
          "A posted load may help identify an origin, destination, equipment type and contact. The carrier still needs current availability, complete shipment instructions, broker acceptance and agreed terms. Posted information can change, and a listing that looks suitable may already be covered.",
          "A dispatcher can help make calls, clarify missing details, organize rate discussions and present the load for carrier approval. That work is separate from providing a search interface. Ask which tasks the service includes rather than assuming that access to more listings completes the dispatch process."
        ],
        "table": {
          "caption": "Separate the tool from the operating task",
          "headers": [
            "Stage",
            "Useful tool function",
            "Work still to assign"
          ],
          "rows": [
            [
              "Search",
              "Filter freight by location and equipment",
              "Keep truck availability and search limits accurate"
            ],
            [
              "Review",
              "Display available listing details",
              "Confirm cargo, appointments and carrier eligibility"
            ],
            [
              "Booking",
              "Support the platform's booking process where offered",
              "Approve terms and keep the final documents"
            ],
            [
              "After pickup",
              "Provide available communication features",
              "Report changes and follow up on delivery paperwork"
            ]
          ]
        }
      },
      {
        "id": "access",
        "title": "Agree authorized access before sharing work",
        "paragraphs": [
          "Each load-board provider sets its own account and access rules. Ask who owns the subscription, who pays any seat or user charges, and how an authorized dispatcher will be added. Keep control of the carrier's account and use the provider's supported process instead of sharing a personal password.",
          "For example, DAT's published dispatcher information describes access through a seat purchased by the carrier. Check the provider's current requirements for your particular account. This is a source example, not a statement that Rai Dispatch supplies a DAT account, represents DAT or includes a subscription in its fee."
        ]
      },
      {
        "id": "costs",
        "title": "Compare the actual combination of costs",
        "paragraphs": [
          "List subscriptions, dispatch charges and the internal work that remains. A carrier may still need to approve loads, provide truck updates, review costs and maintain records after hiring dispatch support. A tool fee and a service fee should be evaluated against what each actually provides.",
          "In a hypothetical week, an owner-operator already pays for a load-board account but spends office time clarifying appointments and chasing documents. Buying another account may expand the available tools; it does not assign those follow-up tasks to anyone. The decision is whether a different tool, an internal process change or outside support addresses the real gap."
        ]
      },
      {
        "id": "handoff",
        "title": "Create one approval and communication process",
        "paragraphs": [
          "Tell the dispatcher which sources and existing broker relationships belong in the search. Identify any freight you book directly and update the truck's availability before another person pursues a load for the same time. Conflicting bookings can arise when several people work from different calendars.",
          "Agree who can approve a load, where written confirmation is stored and who tells the driver about changes. Keep independently booked freight clearly identified so the dispatch agreement's fee treatment is applied consistently. More people searching is useful only when they share a reliable operating picture."
        ]
      },
      {
        "id": "evaluate",
        "title": "Judge the workflow using completed work",
        "paragraphs": [
          "Review whether proposed loads fit the equipment, information arrives in time and signed documents reach the right recipient. Track waiting, total miles and administrative effort with the same method from week to week. Do not treat gross revenue alone as proof that a particular tool or service is working.",
          `Rai Dispatch offers dedicated dispatch support under a written scope, with published equipment fees of ${DISPATCH_RATE_RANGE}. Before starting, ask what access arrangements, communication tasks and costs apply to your operation. Neither a subscription nor a dispatch agreement guarantees a load, broker approval or a particular income.`
        ]
      }
    ],
    "checklistTitle": "Ask before combining a load board and dispatcher",
    "checklist": [
      "Who owns and pays for the approved account access?",
      "Which search, booking and follow-up tasks are included?",
      "How are direct bookings and truck availability shared?",
      "Who approves loads and receives the final documents?"
    ],
    "faqs": [
      {
        "question": "Can I use a load board and a dispatcher together?",
        "answer": "Yes, subject to the platform's access rules and your dispatch agreement. Agree authorized access, account charges, task ownership and carrier approval before the search begins."
      },
      {
        "question": "Does a dispatch fee automatically include load-board access?",
        "answer": "No. Ask for the actual service scope and any separate subscription or seat charges in writing. An advertised dispatch percentage alone does not establish what a third-party platform includes."
      },
      {
        "question": "Will a load board approve me for every broker's freight?",
        "answer": "No. Platform access and broker acceptance are separate decisions. The carrier and each shipment still need to meet the applicable requirements."
      }
    ],
    "related": [
      {
        "label": "Self-dispatch vs paid support",
        "href": "/resources/self-dispatch-vs-dispatch-service"
      },
      {
        "label": "Load search and booking",
        "href": "/services/load-booking"
      },
      {
        "label": "Dedicated dispatcher",
        "href": "/services/dedicated-dispatcher"
      },
      {
        "label": "Published dispatch fees",
        "href": "/pricing"
      }
    ],
    "sources": [
      {
        "label": "DAT: dispatcher load-board access and carrier seats",
        "href": "https://www.dat.com/solutions/dispatch-load-board"
      }
    ]
  },
  {
    "slug": "new-authority-broker-approval",
    "title": "New authority broker approval: a practical review checklist",
    "metaTitle": "New Authority Broker Approval | Carrier Checklist",
    "description": "Prepare for broker review as a new trucking authority. Separate operating status, carrier documents and shipment eligibility, with practical follow-up questions.",
    "eyebrow": "Carrier guide · Before your first broker approval",
    "published": "2026-09-28",
    "updated": "2026-09-28",
    "readTime": "5 minute read",
    "intro": "A carrier can complete dispatch onboarding and still need approval from the broker offering a load. For a new authority, the useful next step is to identify what the broker is reviewing and which details remain unresolved. This checklist helps you organize that conversation without relying on a universal waiting period or a promised first load.",
    "highlights": [
      "Identify the review stage",
      "Ask specific eligibility questions",
      "Track unresolved requirements"
    ],
    "sections": [
      {
        "id": "three-stages",
        "title": "Separate operating readiness, broker review and the load",
        "paragraphs": [
          "FMCSA registration requirements depend on the operation. Confirm the applicable registration, authority and insurance status through the official process before planning freight around an application or number alone. Dispatch onboarding does not create operating authority or replace the carrier's responsibilities.",
          "A broker then applies its own onboarding requirements. Approval for a carrier account can still be followed by requirements for a particular shipment, equipment type or business unit. J.B. Hunt's published onboarding information, for example, distinguishes basic carrier requirements from additional requirements for certain loads. Its policy is an example, not a universal rule or a Rai Dispatch affiliation."
        ],
        "table": {
          "caption": "Keep the decisions separate",
          "headers": [
            "Question",
            "Who can clarify it"
          ],
          "rows": [
            [
              "Is the operation ready and appropriately registered?",
              "The carrier and relevant official registration resources"
            ],
            [
              "Has this broker approved this carrier?",
              "The broker's verified carrier-onboarding contact"
            ],
            [
              "Is this truck eligible for this shipment?",
              "The load contact and the carrier reviewing the actual requirements"
            ]
          ]
        }
      },
      {
        "id": "packet",
        "title": "Resolve inconsistent information before resubmitting",
        "paragraphs": [
          "Check the legal business name, relevant USDOT and MC details, contact information, W-9 and insurance documents for consistency. Ask your insurance provider to supply or correct certificates through its normal process. Do not edit a certificate or describe another business's operating history as your own.",
          "Record what was submitted, when it was sent and the verified recipient. If the reviewer asks for a missing item, send the requested document through the agreed channel and note the follow-up date. Repeatedly sending an unchanged packet is less useful than identifying the specific incomplete requirement."
        ]
      },
      {
        "id": "questions",
        "title": "Ask what the authority-age requirement actually means",
        "paragraphs": [
          "If a broker refers to authority history, ask which date and status it evaluates and whether the rule applies to all its freight or only the load being discussed. Do not assume a statement from a forum, another carrier or an old screenshot describes current requirements.",
          "Useful questions include whether the review is pending or declined, whether a document needs correction, and whether another review is possible later. Request a clear answer from the broker's onboarding contact. A dispatcher can help organize the follow-up but cannot override the broker's decision."
        ],
        "bullets": [
          "Which requirement is currently unmet?",
          "Is the issue carrier-wide or shipment-specific?",
          "What information can resolve a pending review?",
          "When, if appropriate, should the carrier ask again?"
        ]
      },
      {
        "id": "example",
        "title": "A hypothetical approval delay",
        "paragraphs": [
          "Suppose a new dry van carrier is told that its packet is incomplete. The carrier initially assumes the problem is authority age, but the reviewer identifies an outdated insurance certificate. The next action is to arrange the current document and confirm receipt, not to wait an arbitrary number of days.",
          "In a different case, the broker may confirm a history requirement that the carrier does not yet meet. The correct response is to record that limitation and review other suitable opportunities honestly. Neither outcome can be inferred from the words “new authority” alone."
        ]
      },
      {
        "id": "plan",
        "title": "Plan the first load without counting on an approval date",
        "paragraphs": [
          "Keep the truck's availability, pickup radius and destination preferences realistic while the review continues. An available load may disappear before approval is complete. Avoid treating a tentative opportunity as a booked shipment or building the week's spending around unconfirmed freight.",
          "Once accepted for a load, review its written terms, equipment fit, appointments and payment process separately. Rai Dispatch can assess new-authority service fit and coordinate agreed dispatch work, but cannot guarantee approval, a first-day booking or access to any named broker's freight."
        ]
      }
    ],
    "checklistTitle": "Keep an approval follow-up record",
    "checklist": [
      "Broker's verified onboarding contact",
      "Submitted documents and submission date",
      "Exact missing requirement or review status",
      "Next action, responsible person and follow-up date"
    ],
    "faqs": [
      {
        "question": "Is every new authority required to wait 30, 60 or 90 days?",
        "answer": "Do not apply one waiting period to every broker or shipment. Ask the broker for its current requirements and the details relevant to your carrier. A dispatch service cannot promise to bypass them."
      },
      {
        "question": "Does an MC number guarantee broker approval?",
        "answer": "No. Applicable operating status, broker onboarding and shipment eligibility are separate matters. Confirm each through the appropriate official or broker contact."
      },
      {
        "question": "Can Rai Dispatch guarantee new-authority loads?",
        "answer": "No. We can review readiness and suitable opportunities. Freight availability, equipment fit, broker acceptance and carrier approval determine whether a load can be booked."
      }
    ],
    "related": [
      {
        "label": "Dispatch support for new authorities",
        "href": "/carriers/new-authorities"
      },
      {
        "label": "Carrier onboarding checklist",
        "href": "/resources/carrier-onboarding-checklist"
      },
      {
        "label": "Rate confirmation checklist",
        "href": "/resources/rate-confirmation-checklist"
      },
      {
        "label": "Broker communication",
        "href": "/services/broker-communication"
      }
    ],
    "sources": [
      {
        "label": "FMCSA: getting started with registration",
        "href": "https://www.fmcsa.dot.gov/registration/getting-started"
      },
      {
        "label": "J.B. Hunt: carrier requirements and onboarding",
        "href": "https://www.jbhunt.com/our-company/resources/carrier/requirements-and-onboarding"
      }
    ]
  },
  {
    "slug": "rate-confirmation-checklist",
    "title": "Rate confirmation checklist: review the load before booking",
    "metaTitle": "Truck Rate Confirmation Checklist | Before Booking",
    "description": "Review rate confirmations for pay, appointments, cargo, accessorial terms and document instructions. A practical carrier checklist with a worked example.",
    "eyebrow": "Carrier guide · The details behind the rate",
    "published": "2026-09-28",
    "updated": "2026-09-28",
    "readTime": "5 minute read",
    "intro": "A rate confirmation, often called a ratecon, records important terms for a brokered shipment. Review it with the related agreement and load instructions before committing the truck. A clear rate does not resolve a wrong appointment, unsuitable cargo or an unclear payment process. Use this checklist to find questions that need an answer.",
    "highlights": [
      "Match the parties and shipment",
      "Review the full pay and work",
      "Keep approved changes in writing"
    ],
    "sections": [
      {
        "id": "identity",
        "title": "Match the carrier, broker and load references",
        "paragraphs": [
          "Confirm that the document names your actual carrier business and the intended contracting party. Check the load number, pickup references and contact details against the conversation that led to the offer. A familiar-looking logo alone does not verify the sender or the load.",
          "If a company name, email address or payment instruction unexpectedly changes, verify it through a previously established or independently verified contact. Keep the final version where the authorized carrier contact and driver can find the relevant instructions. Avoid relying on screenshots that omit additional pages or terms."
        ]
      },
      {
        "id": "money",
        "title": "Read the total compensation and its components",
        "paragraphs": [
          "Identify the agreed total and clarify whether the quoted amount includes fuel surcharge, stops, tarping, driver assist or another required task. Check for document-submission requirements, payment timing and any proposed deductions. Ask which agreement controls if the documents appear inconsistent.",
          "Keep an expected accessorial request separate from approved compensation. Detention, layover, truck ordered not used and lumper reimbursement can have specific notice, approval and evidence requirements. Clarify those steps before the event rather than assuming a standard amount will be paid afterward."
        ],
        "table": {
          "caption": "Questions to resolve before approval",
          "headers": [
            "Review area",
            "Question"
          ],
          "rows": [
            [
              "Compensation",
              "Does the written total match the agreed work?"
            ],
            [
              "Appointments",
              "Are the dates, local times and stop sequence clear?"
            ],
            [
              "Cargo",
              "Do dimensions, weight and handling fit the truck?"
            ],
            [
              "Extra work",
              "What approval and evidence does each request need?"
            ],
            [
              "Documents",
              "Where and when must signed records be submitted?"
            ]
          ]
        }
      },
      {
        "id": "schedule",
        "title": "Check every stop against the actual truck",
        "paragraphs": [
          "Read complete pickup and delivery addresses, appointment dates, time zones, check-in references and contact instructions. Distinguish an appointment from facility opening hours. Include time for the drive to pickup, loading, travel and unloading when deciding whether the schedule is workable.",
          "Check commodity, piece dimensions, weight, equipment type and loading method. Review temperature instructions, tarps, liftgate needs, driver labor, exclusive-use conditions or other restrictions when relevant. A generic description such as “pallets” is not enough if the dimensions or handling determine whether the freight fits."
        ]
      },
      {
        "id": "example",
        "title": "A hypothetical mismatch worth resolving",
        "paragraphs": [
          "Imagine the phone discussion describes a $1,800 dry van shipment with one delivery on Friday. The confirmation shows the same total but adds a second delivery on Monday. Matching pay does not make these offers equivalent: the extra stop and weekend commitment change the work and availability.",
          "Pause the approval, ask the broker to clarify the intended plan and request corrected written terms if necessary. Then reassess the entire trip and obtain carrier approval. This example illustrates document review; it is not a suggested freight rate or a promise of compensation."
        ]
      },
      {
        "id": "changes",
        "title": "Keep an understandable record when plans change",
        "paragraphs": [
          "Save the approved version and any subsequent written changes with the load's records. Identify what changed, who approved it and which driver instructions need updating. If a call changes a material detail, ask for written confirmation so the office and driver do not work from different versions.",
          "After delivery, pair the signed delivery record and approved receipts with the correct shipment reference. Follow the agreed submission process and keep a copy. Rai Dispatch can help organize rate confirmations and follow-ups, while the carrier retains its load decision and should seek clarification on terms it does not understand."
        ]
      }
    ],
    "checklistTitle": "Before the truck is committed",
    "checklist": [
      "Correct parties, references and final document version",
      "Agreed compensation and accessorial process",
      "Workable appointments and complete equipment requirements",
      "Carrier approval and document-submission instructions"
    ],
    "faqs": [
      {
        "question": "Is a rate confirmation the same as a bill of lading?",
        "answer": "No. The rate confirmation records agreed commercial and shipment terms; a bill of lading is a separate shipment document. Keep the relevant documents together and check their load references and instructions for consistency."
      },
      {
        "question": "What if the posted load and rate confirmation disagree?",
        "answer": "Ask the responsible broker contact to clarify the discrepancy before approval. Keep corrected written terms and reassess any change to compensation, cargo, stops or schedule."
      },
      {
        "question": "Are detention and other extra charges automatically included?",
        "answer": "No. Read the actual load terms and related agreement. Approval, notice and evidence requirements can differ, so do not treat an expected request as approved pay."
      }
    ],
    "related": [
      {
        "label": "Load booking process",
        "href": "/services/load-booking"
      },
      {
        "label": "Detention and accessorial documentation",
        "href": "/resources/detention-layover-tonu-documentation"
      },
      {
        "label": "Evaluate the whole freight rate",
        "href": "/resources/evaluate-freight-rate-per-mile"
      },
      {
        "label": "Paperwork support",
        "href": "/services/paperwork-support"
      }
    ],
    "sources": [
      {
        "label": "DAT OnBoard: rate confirmation overview",
        "href": "https://onboard.support.dat.com/industry-information-dcebe53e/protecting-your-business-d17423bd/rate-confirmation-also-known-as-ratecon-9b1ed1fd"
      }
    ]
  },
  {
    "slug": "partial-truckload-vs-ltl",
    "title": "Partial truckload vs. LTL: a carrier's load-planning guide",
    "metaTitle": "Partial Truckload vs LTL | Carrier Dispatch Guide",
    "description": "Understand partial truckload, LTL and exclusive-use freight. Review usable space, co-loading terms, delivery sequence and trip costs before accepting partial loads.",
    "eyebrow": "Carrier guide · More than spare trailer space",
    "published": "2026-09-28",
    "updated": "2026-09-28",
    "readTime": "5 minute read",
    "intro": "Partial truckload and less-than-truckload freight can both use less than a full trailer, but the operating arrangements may be different. For an owner-operator reviewing a partial load, the useful question is whether the cargo, written terms and combined schedule work on the actual truck. Empty space alone does not answer that question.",
    "highlights": [
      "Understand the service arrangement",
      "Check usable space and permissions",
      "Evaluate the combined route"
    ],
    "sections": [
      {
        "id": "definitions",
        "title": "Read the service terms behind the equipment listing",
        "paragraphs": [
          "Partial truckload commonly refers to a shipment using only part of the truck's capacity. Conventional LTL services commonly consolidate smaller shipments through a carrier network that can include terminals and transfers. A load described informally as “LTL” on a posting still needs its actual handling and routing requirements explained.",
          "Full truckload or exclusive-use terms may reserve the equipment even when the shipment does not physically fill it. Do not assume pallet count or unused deck length gives permission to add freight. Ask whether the shipment can share the vehicle, whether transfers are permitted and what delivery commitments apply."
        ],
        "table": {
          "caption": "Questions behind common freight descriptions",
          "headers": [
            "Description",
            "What the carrier needs to clarify"
          ],
          "rows": [
            [
              "Full truckload / exclusive use",
              "Is all equipment capacity reserved, regardless of actual space used?"
            ],
            [
              "Partial truckload",
              "What space, payload and loading access must remain available?"
            ],
            [
              "LTL-related work",
              "Is this a direct movement, terminal move or another defined network task?"
            ]
          ]
        }
      },
      {
        "id": "space",
        "title": "Measure usable capacity rather than counting empty feet",
        "paragraphs": [
          "Record each piece's dimensions, weight and orientation along with its loading access. Check whether it can be stacked and whether access to another shipment must remain clear. Space that exists geometrically may not be usable once securement, unloading access or cargo separation is considered.",
          "The carrier needs to confirm payload, axle loading, safe securement and equipment suitability for the complete combination. Do not combine incompatible cargo merely because the total advertised weight looks acceptable. Resolve commodity, temperature, contamination or handling concerns with the responsible parties before booking."
        ]
      },
      {
        "id": "sequence",
        "title": "Test the pickup and delivery order",
        "paragraphs": [
          "Plot all proposed stops in order and include appointments, receiving hours and time to load or unload. A later pickup can block access to cargo that must deliver first. An early closure at one receiver can turn a short detour into an overnight delay for the whole trip.",
          "Confirm that every relevant booking permits the proposed arrangement. Present the full route to the carrier for approval, not just the additional load in isolation. If one appointment changes, review its effect on the remaining commitments before agreeing to the change."
        ]
      },
      {
        "id": "example",
        "title": "A hypothetical two-shipment comparison",
        "paragraphs": [
          "Suppose a trailer already has an approved partial shipment occupying the rear loading area. Another offer needs the remaining floor space but must deliver first. If the first shipment prevents unloading the second without moving cargo, the apparent spare capacity may be unusable for that plan.",
          "Even if access can be resolved, compare added pickup miles, delivery miles, stops, waiting, handling and fees with the extra confirmed pay. The combination can be rejected because of terms, access or schedule even when the arithmetic initially looks attractive. This is a planning example, not a revenue estimate."
        ]
      },
      {
        "id": "records",
        "title": "Keep each shipment's instructions and documents separate",
        "paragraphs": [
          "Give each booking a clear load reference and retain its rate confirmation, cargo instructions, pickup documents and delivery record. Track any approved change against the shipment it affects. Drivers should be able to identify which freight belongs at each stop without relying on memory.",
          "Rai Dispatch can review suitable partial-load opportunities within the agreed carrier dispatch scope. We do not present this as a shipper-facing LTL network or promise that two shipments can always be combined. Discuss equipment, written permissions and the complete schedule before treating a partial as suitable work."
        ]
      }
    ],
    "checklistTitle": "Before accepting a partial load",
    "checklist": [
      "Dimensions, weight, orientation and unloading access",
      "Exclusive-use or co-loading terms in writing",
      "Compatible cargo and carrier-approved loading plan",
      "Complete stop sequence, appointments and costs"
    ],
    "faqs": [
      {
        "question": "Can I add another load whenever the trailer has room?",
        "answer": "No. Check the existing agreement, cargo compatibility, usable capacity, loading access and all appointments. Spare space does not override exclusive-use or other shipment restrictions."
      },
      {
        "question": "Are partial truckload and LTL interchangeable terms?",
        "answer": "Not reliably. They can describe different service arrangements. Ask how the specific freight is handled, whether transfers are involved and what operating commitments the carrier is accepting."
      },
      {
        "question": "Does Rai Dispatch provide LTL shipping quotes to shippers?",
        "answer": "Our service is carrier dispatch support, including review of suitable partial-load opportunities. It is not offered as a shipper-facing LTL shipping network."
      }
    ],
    "related": [
      {
        "label": "Load booking and partial-load review",
        "href": "/services/load-booking"
      },
      {
        "label": "Rate confirmation checklist",
        "href": "/resources/rate-confirmation-checklist"
      },
      {
        "label": "Backhaul and reload support",
        "href": "/services/backhaul-dispatch"
      },
      {
        "label": "Box truck dispatch",
        "href": "/equipment/box-truck"
      },
      {
        "label": "Step deck dispatch",
        "href": "/equipment/step-deck"
      }
    ],
    "sources": [
      {
        "label": "Truckstop: partial truckload and LTL overview",
        "href": "https://truckstop.com/blog/partial-vs-ltl-freight/"
      }
    ]
  },
  {
    slug: 'self-dispatch-vs-dispatch-service', title: 'Self-dispatch or a truck dispatch service?',
    metaTitle: 'Self-Dispatch vs Truck Dispatch Service',
    description: 'Compare self-dispatching with paid truck dispatch support. Review time, load approval, broker communication and the full fee before choosing a workflow.',
    eyebrow: 'Carrier guide · Choosing your workflow', published: '2026-09-24', updated: '2026-09-28', readTime: '5 minute read',
    intro: 'Self-dispatch and outside dispatch support both require an informed carrier decision. The useful question is which tasks you want to handle yourself, which tasks you can delegate clearly and how the cost fits the work your operation actually runs.',
    highlights: ['Compare time and scope', 'Keep load approval clear', 'Review a complete trip'],
    sections: [
      { id: 'work-list', title: 'List the work before comparing the price', paragraphs: ['Start with a typical load: search available freight, contact the broker, review the route and requirements, discuss the rate, approve booking, complete required paperwork and coordinate updates. After delivery, the signed records still need to reach the appropriate party.', 'When self-dispatching, the carrier performs or assigns those tasks internally. With outside dispatch support, the written agreement identifies which tasks the service handles. A percentage quote is only comparable when the included work is clear.'], table: { caption: 'Questions for comparing dispatch workflows', headers: ['Decision', 'Self-dispatch', 'Dispatch service'], rows: [['Load search', 'Who on your team has time to search?', 'What equipment and lanes will the desk cover?'], ['Load approval', 'Who makes the booking decision?', 'How does the carrier approve each proposal?'], ['Communication', 'Who handles broker calls and updates?', 'Who is the contact and when is the desk open?'], ['Cost review', 'What tools and staff time do you use?', 'What fee base and included scope are agreed?']] } },
      { id: 'time', title: 'Consider when the work needs to happen', paragraphs: ['Dispatch tasks do not arrive evenly through the day. A load may need a prompt response while paperwork from another delivery is still outstanding. Review whether your current office coverage can handle those overlaps without distracting the driver from safe operation.', 'A service can take on agreed administrative work, but it still needs accurate truck status and timely approvals. If the carrier cannot supply those details, delegating the search alone will not solve the coordination problem.'] },
      { id: 'cost', title: 'Compare total support cost with your own records', paragraphs: [`Use the same load revenue and service scope when comparing a percentage plan, a fixed plan and internal administration. For a dry van, reefer or flatbed example, the ${getDispatchRateLabel('dry-van')} dispatch fee on a $2,000 agreed billing base is $${2000 * getDispatchRate('dry-van') / 100}. Use the published rate for your equipment when comparing other truck types. Whether the expense is worthwhile depends on the work provided and your own circumstances.`, 'Account for tools and staff time you would still use under either approach. Revenue after dispatch fees is not profit; fuel, maintenance, insurance and other expenses remain. Avoid assuming that hiring a dispatcher automatically raises rates or removes every administrative task.'] },
      { id: 'handover', title: 'Make a clean handover if you change the workflow', paragraphs: ['Before switching, identify which loads are already booked, who will handle remaining updates and where the delivery documents should go. Review any existing cancellation or notice terms. Do not create overlapping instructions for the same truck or load.', 'Agree the new approval process, desk hours, contact details and fee terms before the next search. Then review completed trips using consistent measures such as total miles, waiting, paperwork turnaround and fit with your schedule. Those observations give you a better basis for judging the arrangement than a headline revenue promise.'] },
    ],
    checklistTitle: 'Questions for your comparison',
    checklist: ['Which tasks need outside help?', 'Who can approve loads and supply updates?', 'What tools and costs remain either way?', 'How will existing bookings be handed over?'],
    faqs: [
      { question: 'Is self-dispatch always cheaper?', answer: 'There is no dispatch-service fee, but tools, time and internal staffing can still have a cost. Compare the actual work and expenses for your operation rather than only the advertised percentage.' },
      { question: 'Do I lose control when I hire a dispatcher?', answer: 'The approval process should keep the carrier’s responsibilities clear. With Rai Dispatch, you approve or decline loads and retain control of your operation.' },
      { question: 'Can I keep finding some of my own loads?', answer: 'Discuss that arrangement before signing. Agree which loads the service handles, how availability is shared and when fees apply so the truck does not receive conflicting bookings.' },
    ],
    related: [{ label: 'Owner-operator support', href: '/carriers/owner-operators' }, { label: 'Dispatch fees explained', href: '/resources/truck-dispatch-fees' }, { label: 'Load boards and dispatch support', href: '/resources/load-board-vs-dispatch-service' }, { label: 'Dedicated dispatcher workflow', href: '/services/dedicated-dispatcher' }],
  },
  {
    slug: 'truck-dispatcher-vs-freight-broker', title: 'Truck dispatcher vs. freight broker: questions for carriers',
    metaTitle: 'Truck Dispatcher vs Freight Broker',
    description: 'Understand the carrier-facing difference between dispatch support and freight brokerage, with practical questions about scope, approval and payment terms.',
    eyebrow: 'Carrier guide · Know who does what', published: '2026-09-24', updated: '2026-09-28', readTime: '5 minute read',
    intro: 'Before you sign a service agreement or accept a load, identify who is providing each service and who is responsible for the shipment. A dispatcher contact, a broker contact and the motor carrier can be involved in the same load while performing different work.',
    highlights: ['Identify each party', 'Read the written scope', 'Verify the transportation entity'],
    sections: [
      { id: 'roles', title: 'Start with the role in the transaction', paragraphs: ['FMCSA describes a motor carrier as the entity operating commercial vehicles to transport goods or passengers, and a broker as an intermediary arranging transportation. A carrier’s dispatch support can include searching freight, discussing rates, coordinating bookings and communicating load details under the agreed service relationship.', 'Rai Dispatch offers carrier dispatch support. It does not present this service as a motor carrier or freight brokerage. You should be able to identify the carrier performing the transportation and the relevant broker or other contracting party on the load paperwork.'] },
      { id: 'agreement', title: 'Ask who your service provider represents', paragraphs: ['Ask for the legal business name on the dispatch agreement, a clear list of services and the named contact. Confirm who gives booking approval and how that approval is recorded. A job title or website description does not replace the terms of the actual working arrangement.', 'For each load, distinguish your dispatch agreement from the transportation documents. The dispatch fee, the load compensation and any factoring arrangement are separate subjects to understand. Keep copies of the agreements and ask for clarification when the names or instructions do not match.'], bullets: ['Who is the carrier performing the move?', 'Who is the counterparty on the load agreement?', 'Who can approve a booking for the carrier?', 'What work does the dispatch fee cover?'] },
      { id: 'payment', title: 'Keep payment and document instructions clear', paragraphs: ['Confirm the dispatch invoice basis, the load-payment terms and the destination for signed delivery records. If the carrier uses a factoring company, follow the process agreed with that provider. A dispatcher’s involvement does not by itself establish broker payment, credit approval or collection terms.', 'Treat changed payment instructions as a reason to verify the request through an established contact. Make sure the carrier office and driver know where to send documents and which person can authorize changes. Clear records help avoid confusion between service fees and freight charges.'] },
      { id: 'verify', title: 'Use official guidance for authority questions', paragraphs: ['FMCSA’s guidance explains that the activities and relationships of a dispatch service matter when determining whether broker authority is required. The label “dispatcher” alone does not decide that question. Review the current official guidance and obtain qualified advice for the particular arrangement when necessary.', 'For the transportation entities involved in your loads, use the relevant official registration and insurance resources and confirm information directly where needed. A generic website badge or a third-party claim should not replace checking the actual entity named in the transaction.'] },
      { id: 'next-step', title: 'Choose support with a clear scope', paragraphs: ['If your need is help with freight search, rate discussions, appointments and paperwork, describe those tasks during the first dispatch conversation. If your need is a separate transportation contract or another specialized service, identify that requirement explicitly instead of assuming it is included.', `Rai Dispatch’s percentage plan is ${DISPATCH_RATE_RANGE} by equipment, with the exact fee and scope agreed before service. You approve the loads. Use the questions in this guide to understand the relationship before relying on a provider’s general claims.`] },
    ],
    checklistTitle: 'Keep these details on file',
    checklist: ['Provider and carrier legal names', 'Dispatch scope and written fee terms', 'Load approval contacts', 'Load-payment and document instructions'],
    faqs: [
      { question: 'Is a truck dispatcher automatically a freight broker?', answer: 'No single job label establishes the legal role. FMCSA guidance addresses the activities and relationships that determine whether broker authority is needed. Review the actual arrangement and the official guidance.' },
      { question: 'Does a dispatcher transport the load?', answer: 'The motor carrier performs the transportation. Rai Dispatch provides dispatch support and does not supply the carrier’s truck, driver or operating authority.' },
      { question: 'Does dispatch support guarantee a broker will pay?', answer: 'No. Load-payment obligations and terms belong to the relevant agreements. Review the transportation entity, written terms and any factoring requirements before accepting a load.' },
    ],
    related: [{ label: 'Choose a truck dispatcher', href: '/resources/how-to-choose-a-truck-dispatcher' }, { label: 'New authority broker approval', href: '/resources/new-authority-broker-approval' }, { label: 'Broker communication support', href: '/services/broker-communication' }, { label: 'About Rai Dispatch', href: '/about' }],
    sources: [{ label: 'FMCSA: motor carrier, broker and freight forwarder definitions', href: 'https://www.fmcsa.dot.gov/faq/what-are-definitions-motor-carrier-broker-and-freight-forwarder-authorities' }, { label: 'FMCSA: final guidance on brokers, bona fide agents and dispatch services', href: 'https://www.fmcsa.dot.gov/regulations/federal-register-documents/2023-13080' }],
  },
  {
    slug: 'reduce-deadhead-miles', title: 'How to review and reduce deadhead miles',
    metaTitle: 'Reduce Deadhead Miles With Better Load Planning',
    description: 'Review pickup distance, reload timing and total trip miles before booking freight. A practical deadhead planning checklist for owner-operators and fleets.',
    eyebrow: 'Carrier guide · Empty-mile decisions', published: '2026-09-24', readTime: '5 minute read',
    intro: 'Deadhead is the empty travel between useful work. The goal is not simply the shortest possible pickup drive: it is a trip that fits the equipment, schedule and complete operating plan. A consistent review helps you see where empty miles come from and which choices are worth changing.',
    highlights: ['Measure empty travel consistently', 'Compare time and total miles', 'Review reload options early'],
    sections: [
      { id: 'measure', title: 'Separate pickup, repositioning and homeward miles', paragraphs: ['Record empty miles to the first pickup, any reposition between loads and empty travel connected with returning home or fulfilling equipment obligations. Use the same categories when comparing weeks so a change in your measurement does not look like a change in performance.', 'As an arithmetic example, 100 empty miles and 900 loaded miles produce 1,000 total miles, of which 10% are empty. This describes the trip; it does not establish whether the load is profitable. You still need compensation, costs, time and the next destination to evaluate the decision.'] },
      { id: 'radius', title: 'Use a pickup radius as a starting point', paragraphs: ['A maximum pickup radius can keep a search focused, but the closest load may have a difficult appointment, unsuitable handling requirements or an unwanted destination. Compare the whole trip before rejecting every load beyond a fixed distance or accepting the first load nearby.', 'Discuss what would justify a longer empty drive for your operation. The answer can depend on confirmed compensation, schedule fit, equipment requirements and where the trip finishes. Any exception should be a deliberate carrier decision rather than a hurried reaction to a posted rate.'] },
      { id: 'reload', title: 'Review the reload area before delivery', paragraphs: ['The destination influences the next search. Tell your dispatcher when the truck is likely to be empty and update that estimate when loading or delivery changes. Looking at the next area early can help identify an unsuitable appointment or a reposition that belongs in the original trip comparison.', 'Do not count a potential reload as confirmed work. Broker requirements, truck availability and appointments still need to align before booking. For power-only work, include trailer-return instructions; for other equipment, include any preparation or handling requirement that affects the next pickup.'] },
      { id: 'compare', title: 'Compare alternatives with the same assumptions', paragraphs: ['Suppose one option requires a shorter empty drive but a day of waiting, while another requires more miles and an earlier confirmed appointment. A useful comparison includes both the mileage and the time committed. The preferred option depends on your actual costs, schedule and accepted terms.', 'Write down the known loaded and empty miles, appointment times, compensation and relevant costs for each candidate. Label uncertain items clearly. This prevents an attractive hypothetical reload from being compared as though it were already booked.'], bullets: ['Use total trip miles, including known return obligations.', 'Include loading, waiting and unloading time.', 'Separate confirmed loads from possible opportunities.', 'Keep the carrier’s home-time and equipment limits in the comparison.'] },
      { id: 'review', title: 'Use completed trips to improve the next search', paragraphs: ['After the trip, compare the planned empty miles with what actually happened. Was the difference caused by a changed appointment, a missed detail, a revised home-time decision or unavailable freight? The answer suggests a specific change to the next search.', 'Rai Dispatch helps organize lane preferences and load information. The carrier remains responsible for evaluating the business decision, and dispatch support cannot eliminate empty miles or guarantee return freight. Review the pattern over comparable trips instead of judging the process from one unusual load.'] },
    ],
    checklistTitle: 'Before accepting the next load',
    checklist: ['Known pickup and return deadhead', 'Realistic empty time after delivery', 'Destination and next search area', 'Confirmed pay, appointments and equipment fit'],
    faqs: [
      { question: 'Can a dispatch service eliminate deadhead?', answer: 'No. Empty miles can be necessary and freight availability changes. Dispatch support can help organize the information and search criteria used to evaluate them.' },
      { question: 'Is the closest load always the best option?', answer: 'No. Appointment timing, compensation, handling requirements, destination and the following day can matter as much as pickup distance.' },
      { question: 'Should I count the empty drive home?', answer: 'Include it when evaluating the complete trip or week, using a consistent method. Separating homeward miles from pickup deadhead can help explain why the total changed.' },
    ],
    related: [{ label: 'Route and lane strategy', href: '/services/route-strategy' }, { label: 'Backhaul and reload support', href: '/services/backhaul-dispatch' }, { label: 'Regional dispatch', href: '/services/regional-dispatch' }, { label: 'OTR dispatch', href: '/services/otr-dispatch' }, { label: 'Rate-per-mile calculation', href: '/resources/evaluate-freight-rate-per-mile' }],
  },
];
