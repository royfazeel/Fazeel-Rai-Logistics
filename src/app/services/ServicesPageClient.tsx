'use client';

import StaticPhoto from '@/components/StaticPhoto';

import Link from 'next/link';

import {
  Phone,
  DollarSign,
  Package,
  MessageSquare,
  Route,
  FileText,
  Calendar,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Users,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { ACTIVE_CARRIER_SUPPORT, BUSINESS, MEDIA, SERVICES, SETUP_DESK_HOURS } from '@/lib/constants';
import { getDispatchRateLabel } from '@/lib/dispatch-pricing';
import { track } from '@/lib/track';

const iconComponents: Record<string, React.ElementType> = {
  DollarSign,
  Package,
  MessageSquare,
  Route,
  FileText,
  Calendar,
};

const serviceDetails = [
  {
    id: 'rate-negotiation',
    icon: 'DollarSign',
    title: 'Rate Negotiation',
    subtitle: 'Review the Full Trip Before Accepting a Rate',
    description:
      'We discuss the rate, loaded and empty miles, schedule, and extra work with the broker. You approve the load and its terms.',
    benefits: [
      'Loaded and empty miles reviewed',
      'Broker rate discussions',
      'Fuel surcharge terms clarified',
      'Detention and layover rate requests',
      'Accessorial request support',
    ],
    stats: [
      { value: 'Every', label: 'Load Negotiated' },
      { value: 'Clear', label: 'Written Terms' },
    ],
  },
  {
    id: 'load-booking',
    icon: 'Package',
    title: 'Load Booking',
    subtitle: 'Quality Freight, Matched to Your Truck',
    description:
      'We review available load-board and broker freight against your equipment, lane preferences, authority, and insurance requirements. You approve the load before booking.',
    benefits: [
      'Load-board and broker freight search',
      'Broker eligibility checks',
      'Equipment-specific load matching',
      'Lane preference consideration',
      'Pickup deadhead review',
    ],
    stats: [
      { value: 'Your', label: 'Load Approval' },
      { value: '48', label: 'Contiguous States' },
    ],
  },
  {
    id: 'broker-communication',
    icon: 'MessageSquare',
    title: 'Broker & RC Communication',
    subtitle: 'Professional Communication on Your Behalf',
    description:
      `From the initial rate call to delivery confirmation, we coordinate broker calls, shipment updates and written instructions. We provide ${ACTIVE_CARRIER_SUPPORT}. New-carrier setup desk hours are ${SETUP_DESK_HOURS}. Agree your dispatch contact and escalation process before the first load.`,
    benefits: [
      'Rate confirmation handling',
      'Appointment scheduling',
      'Check calls and updates',
      'Issue resolution support',
      'Professional representation',
    ],
    stats: [
      { value: 'Clear', label: 'Load Terms' },
      { value: '24/7', label: 'Active-Carrier Live Support' },
    ],
  },
  {
    id: 'route-strategy',
    icon: 'Route',
    title: 'Route & Lane Strategy',
    subtitle: 'Plan Around Total Miles and Trip Costs',
    description:
      'We compare available loads against your total miles, schedule and operating costs, then discuss lane options and repositioning with you before you approve a load.',
    benefits: [
      'Lane profitability analysis',
      'Deadhead reduction strategies',
      'Regional vs. OTR optimization',
      'Seasonal lane planning',
      'Weekly route reviews',
    ],
    stats: [
      { value: 'Zero', label: 'Forced Dispatch' },
      { value: 'Weekly', label: 'Route Reviews' },
    ],
  },
  {
    id: 'paperwork-support',
    icon: 'FileText',
    title: 'Paperwork Support',
    subtitle: 'Documentation Done Right',
    description:
      'We help organize rate confirmations, bills of lading and proof of delivery, and follow up on missing load documents. You provide accurate records and approve agreements; any factoring coordination follows your agreed service scope.',
    benefits: [
      'Rate confirmation management',
      'BOL organization and storage',
      'Factoring company coordination',
      'Carrier packet completion',
      'Document tracking system',
    ],
    stats: [
      { value: 'BOL / POD', label: 'Paperwork Support' },
      { value: 'Organized', label: 'Load Documents' },
    ],
  },
  {
    id: 'scheduling',
    icon: 'Calendar',
    title: 'Scheduling & Follow-ups',
    subtitle: 'Keep Pickup and Delivery Details Organized',
    description:
      'We help coordinate pickup and delivery appointments, clarify facility instructions and communicate schedule changes. Current truck status and driver availability guide the next booking.',
    benefits: [
      'Pickup/delivery scheduling',
      'Appointment confirmation calls',
      'Detention time tracking',
      'Proactive delay communication',
      'Next-load planning',
    ],
    stats: [
      { value: 'Load', label: 'Appointment Tracking' },
      { value: 'Proactive', label: 'Delay Management' },
    ],
  },
];

export default function ServicesPageClient() {
  return (
    <>
      {/* ============================================================
          PAGE HERO — compact dark band over the highway photo.
          ============================================================ */}
      <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden">
        <StaticPhoto
          fill
          priority
          sizes="100vw"
          src={MEDIA.heroVideo.poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Our services</p>
            <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[1.02] tracking-tight mb-5">Truck dispatch services for owner-operators and fleets</h1>
            <p id="answer-block" className="text-white/70 text-lg max-w-2xl mb-8">
              Get help finding freight, negotiating rates, booking approved loads,
              scheduling appointments and organizing paperwork. Choose support for
              your equipment and lanes while you keep control of load acceptance.
            </p>
            <a
              href={BUSINESS.phoneHref}
              onClick={() => track('call_click', { location: 'services_hero' })}
              className="btn-primary"
              aria-label={`Call Rai Dispatch at ${BUSINESS.phone}`}
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call now: {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES GRID — same card pattern as the homepage.
          Each card anchors down to its detailed section.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="eyebrow">What we handle</p>
              <h2 className="section-heading mb-4">
                Six jobs. One dispatcher.
              </h2>
              <p className="text-surface-700 text-lg">
                See what your dispatcher handles before pickup, during the trip
                and after delivery. Each service explains the information we need
                from your operation and the decisions that stay with you.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service, idx) => {
              const Icon = iconComponents[service.icon] || Package;
              return (
                <ScrollReveal key={service.id} delay={idx * 0.07}>
                  <Link
                    href={`/services/${service.id}`}
                    className="group card flex flex-col p-6 h-full hover:border-primary-300"
                  >
                    <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors">
                      <Icon
                        className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-navy-950 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-surface-700 leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                      Explore this service
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-950 text-white" aria-labelledby="dispatch-plan-heading">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow">How you run</p>
            <h2 id="dispatch-plan-heading" className="font-display text-3xl sm:text-4xl font-bold">Choose support around your operating plan.</h2>
            <p className="mt-5 text-navy-200 leading-8">Your lanes, time away and communication needs shape the dispatch workflow. Explore the arrangement that fits your truck.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { slug: 'regional-dispatch', title: 'Regional dispatch', description: 'Plan around your home base, preferred states, pickup radius and weekly schedule.' },
              { slug: 'otr-dispatch', title: 'OTR and long-haul dispatch', description: 'Review outbound trips, delivery windows, reload options and time away from home.' },
              { slug: 'dedicated-dispatcher', title: 'Dedicated dispatcher support', description: 'Agree on your dispatch contact, load approval, status updates and communication hours.' },
              { slug: 'expedited-dispatch', title: 'Expedited freight dispatch', description: 'Coordinate time-sensitive freight around actual equipment, pickup readiness and achievable appointments.' },
              { slug: 'backhaul-dispatch', title: 'Backhaul and reload dispatch', description: 'Review return-load options, destination freight and empty miles before committing to the next trip.' },
            ].map(plan => (
              <Link key={plan.slug} href={`/services/${plan.slug}`} className="rounded-lg border border-navy-600 bg-navy-900 p-7 hover:border-primary-400">
                <h3 className="font-display text-2xl font-bold">{plan.title}</h3>
                <p className="mt-4 leading-7 text-navy-200">{plan.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">Explore this plan <ArrowRight size={18} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          DETAILED SERVICE SECTIONS — alternating bands.
          ============================================================ */}
      {serviceDetails.map((service, idx) => {
        const Icon = iconComponents[service.icon] || Package;
        const isEven = idx % 2 === 0;

        return (
          <section
            key={service.id}
            id={service.id}
            className={`section-padding scroll-mt-24 overflow-x-clip ${isEven ? 'bg-surface-50' : 'bg-white'}`}
          >
            <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal
                  direction={isEven ? 'left' : 'right'}
                  className={isEven ? '' : 'lg:order-2'}
                >
                  <div>
                    <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 mb-3">
                      {service.title}
                    </h2>
                    <p className="text-xl text-primary-600 font-semibold mb-4">
                      {service.subtitle}
                    </p>
                    <p className="text-surface-700 mb-6 text-lg leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {service.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <CheckCircle
                            className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-navy-900">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={`/services/${service.id}`} className="btn-primary">
                      Explore {service.title.toLowerCase()}
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </Link>
                  </div>
                </ScrollReveal>

                <ScrollReveal
                  direction={isEven ? 'right' : 'left'}
                  className={isEven ? '' : 'lg:order-1'}
                >
                  <div className="bg-white rounded-lg p-8 border border-surface-200 shadow-soft">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {service.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="text-center p-5 bg-surface-50 rounded-md border border-surface-200"
                        >
                          <div className="font-display text-3xl font-bold text-navy-950 leading-none mb-2">
                            {stat.value}
                          </div>
                          <div className="text-xs sm:text-sm text-surface-600 uppercase tracking-wider font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-navy-950 rounded-md p-6 text-center">
                      <p className="text-white/80 mb-4">
                        Ready for professional {service.title.toLowerCase()}?
                      </p>
                      <a
                        href={BUSINESS.phoneHref}
                        onClick={() => track('call_click', { location: 'services_detail_call' })}
                        className="inline-flex items-center gap-2 font-semibold text-white hover:text-primary-400 transition-colors"
                        aria-label={`Call Rai Dispatch at ${BUSINESS.phone}`}
                      >
                        Call {BUSINESS.phone}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="section-padding bg-white" aria-labelledby="service-equipment-heading">
        <div className="container-custom">
          <div className="max-w-3xl mb-8">
            <p className="eyebrow">Match the service to the truck</p>
            <h2 id="service-equipment-heading" className="section-heading">What does your dispatcher need to check?</h2>
            <p className="mt-5 text-surface-700 text-lg leading-relaxed">The booking process changes with the freight you can carry. Use your actual truck specifications to review service fit, then confirm the load details before accepting.</p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-surface-300">
            <table className="w-full min-w-[520px] text-left text-sm sm:text-base">
              <caption className="sr-only">Equipment-specific dispatch checks and published percentage fees</caption>
              <thead className="bg-navy-950 text-white"><tr><th scope="col" className="p-4 sm:p-5">Equipment dispatch</th><th scope="col" className="p-4 sm:p-5">Confirm before booking</th><th scope="col" className="p-4 sm:p-5">Fee</th></tr></thead>
              <tbody className="divide-y divide-surface-200">
                {[
                  { slug: 'dry-van', title: 'Dry van', check: 'Trailer dimensions, loading method and appointment windows.' },
                  { slug: 'reefer', title: 'Reefer', check: 'Written temperature instructions, preparation and delivery timing.' },
                  { slug: 'flatbed', title: 'Flatbed', check: 'Cargo dimensions, tarping and loading or securement requirements.' },
                  { slug: 'box-truck', title: 'Box / straight truck', check: 'Usable space, payload, dock access, liftgate and unloading responsibility.' },
                  { slug: 'cargo-van', title: 'Cargo van', check: 'Door openings, usable cargo space, payload and delivery access.' },
                  { slug: 'conestoga', title: 'Conestoga trailer', check: 'Rolling-tarp clearance, loading access and weather-protection requirements.' },
                  { slug: 'sprinter-van', title: 'Sprinter van', check: 'Door opening, usable cargo dimensions and actual available payload.' },
                  { slug: 'step-deck', title: 'Step deck', check: 'Deck configuration, cargo height, loading method and equipment fit.' },
                  { slug: 'hotshot', title: 'Hotshot', check: 'Truck and trailer specifications, payload and required loading access.' },
                  { slug: 'power-only', title: 'Power only', check: 'Trailer compatibility, interchange terms and pickup or return instructions.' },
                ].map(equipment => <tr key={equipment.slug} className="even:bg-surface-50"><th scope="row" className="p-4 sm:p-5 font-semibold"><Link prefetch={false} href={`/equipment/${equipment.slug}`} className="text-primary-700 underline underline-offset-4 hover:text-primary-800">{equipment.title} dispatch</Link></th><td className="p-4 sm:p-5 text-surface-700 leading-relaxed">{equipment.check}</td><td className="p-4 sm:p-5 font-semibold text-navy-950 whitespace-nowrap">{getDispatchRateLabel(equipment.slug)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-surface-700">Fees are a percentage of gross revenue on loads we book. Specialized equipment and local-only work require a service availability review. <Link prefetch={false} href="/pricing" className="font-semibold text-primary-700 underline underline-offset-4">Review the fee and billing terms</Link> or <Link prefetch={false} href="/equipment" className="font-semibold text-primary-700 underline underline-offset-4">explore every equipment type</Link>.</p>
        </div>
      </section>

      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="eyebrow">Before choosing a dispatch company</p>
              <h2 className="section-heading mb-4">
                Compare the working agreement, not just the fee.
              </h2>
              <p className="text-surface-700 text-lg">
                A useful dispatch service fits how your trucking business runs.
                Review the scope, communication and approval process before the
                first load is booked.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: 'Service scope',
                href: '/resources/how-to-choose-a-truck-dispatcher',
                description:
                  'Confirm which broker calls, scheduling tasks and document follow-ups are included, and what the carrier must provide.',
              },
              {
                icon: Clock,
                title: 'Communication plan',
                href: '/services/dedicated-dispatcher',
                description:
                  'Active carriers receive 24/7 live dispatch support. Agree your assigned contact, team backup, update method and escalation process before the first load.',
              },
              {
                icon: Users,
                title: 'Load approval and fees',
                href: '/pricing',
                description:
                  'You approve each load. Confirm your equipment rate, the revenue used to calculate it and billing terms in writing.',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.1}>
                <div className="flex gap-4 p-6 bg-white rounded-lg border border-surface-200 h-full">
                  <div className="w-11 h-11 bg-navy-950 rounded-md flex items-center justify-center flex-shrink-0">
                    <item.icon
                      className="w-5 h-5 text-primary-500"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold text-navy-950 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-surface-700 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <Link prefetch={false} href={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline">Review {item.title.toLowerCase()}<ArrowRight size={16} aria-hidden="true" /></Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — flat dark band, one number to call.
          ============================================================ */}
      <section className="section-padding bg-navy-950 text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-5 text-balance">
              Ready for professional <span className="text-primary-500">dispatch</span>?
            </h2>
            <p className="text-white/80 text-lg mb-9 max-w-xl mx-auto">
              Tell us what you haul and where you like to run. We&apos;ll take the
              load boards, the brokers, and the paperwork off your plate.
            </p>
            <a
              href={BUSINESS.phoneHref}
              onClick={() => track('call_click', { location: 'services_final_cta' })}
              className="inline-flex items-center justify-center gap-3 h-16 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg sm:text-xl rounded-md transition-colors"
              aria-label={`Call Rai Dispatch at ${BUSINESS.phone}`}
            >
              <Phone className="w-6 h-6" strokeWidth={2.25} aria-hidden="true" />
              {BUSINESS.phone}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
