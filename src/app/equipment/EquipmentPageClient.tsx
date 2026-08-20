'use client';

import {
  Phone,
  CheckCircle,
  ArrowRight,
  Truck,
  Container,
  Snowflake,
  Box,
  Package,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ScrollReveal } from '@/components';
import { BUSINESS, MEDIA, REVENUE_POTENTIAL } from '@/lib/constants';

const equipmentData = [
  {
    id: 'box-truck',
    name: 'Box Trucks',
    icon: Box,
    percentage: '7%',
    heroDescription:
      'Specialized dispatch for box truck operations. From local deliveries to long-haul expedited freight, we find the loads that keep your box truck profitable.',
    features: [
      'Local and regional load matching',
      'Expedited freight opportunities',
      'High-volume delivery contracts',
      'Last-mile delivery connections',
      'Flexible scheduling support',
      'Small fleet coordination',
    ],
    lanes: ['Major metro areas', 'Regional routes', 'Cross-country expedited'],
    avgGross: '$5,000 - $9,000',
    setupTime: '24-48 hours',
    idealFor: [
      'Owner-operators with 16-26ft box trucks',
      'Hotshot and expedited carriers',
      'Local delivery specialists',
      'Small fleet owners',
    ],
  },
  {
    id: 'dry-van',
    name: 'Dry Vans',
    icon: Container,
    percentage: '5%',
    heroDescription:
      'Expert dispatch services for dry van carriers. Access high-paying freight across the country with rates negotiated by experienced professionals.',
    features: [
      'Coast-to-coast lane access',
      'Consistent freight availability',
      'Top rate negotiation',
      'Drop and hook opportunities',
      'Dedicated lane development',
      'Team driver support',
    ],
    lanes: ['National lanes', 'Regional dedicated', 'High-volume corridors'],
    avgGross: '$6,000 - $10,000',
    setupTime: '24-48 hours',
    idealFor: [
      '53ft dry van operators',
      'Long-haul OTR drivers',
      'Regional carriers',
      'Fleet operators',
    ],
  },
  {
    id: 'flatbed',
    name: 'Flatbeds',
    icon: Truck,
    percentage: '5%',
    heroDescription:
      'Dedicated dispatching for flatbed operators. We understand the specialized nature of flatbed freight and find loads that match your equipment capabilities.',
    features: [
      'Specialized cargo matching',
      'Tarping and securement consideration',
      'High-paying rate opportunities',
      'Construction and industrial loads',
      'Oversize/overweight coordination',
      'Equipment-specific expertise',
    ],
    lanes: ['Industrial corridors', 'Construction zones', 'Manufacturing hubs'],
    avgGross: '$6,000 - $10,000',
    setupTime: '24-48 hours',
    idealFor: [
      'Step deck operators',
      'Standard flatbed carriers',
      'Conestoga operators',
      'Heavy haul specialists',
    ],
  },
  {
    id: 'reefer',
    name: 'Reefers',
    icon: Snowflake,
    percentage: '5%',
    heroDescription:
      'Temperature-controlled freight dispatch with time-sensitive expertise. We specialize in produce, meat, dairy, and pharmaceutical lanes.',
    features: [
      'Temperature-controlled load matching',
      'Produce and perishable expertise',
      'Time-critical delivery coordination',
      'Top reefer rates',
      'Seasonal lane optimization',
      'Multi-stop efficiency',
    ],
    lanes: ['Produce regions', 'Meat processing corridors', 'Pharmaceutical routes'],
    avgGross: '$7,000 - $11,000',
    setupTime: '24-48 hours',
    idealFor: [
      'Reefer owner-operators',
      'Produce haulers',
      'Meat and dairy specialists',
      'Pharmaceutical carriers',
    ],
  },
  {
    id: 'power-only',
    name: 'Power Only',
    icon: Package,
    percentage: '6%',
    heroDescription:
      'Drop-and-hook power only dispatch. Plug into dedicated trailer pools and run preloaded freight without owning your own trailer.',
    features: [
      'Drop-and-hook freight access',
      'Dedicated trailer pool connections',
      'Reduced detention exposure',
      'High-utilization lanes',
      'Quick turnaround dispatching',
      'Trailer interchange coordination',
    ],
    lanes: ['Major distribution centers', 'Warehouse-to-warehouse routes', 'Dedicated shipper accounts'],
    avgGross: '$7,000 - $12,000',
    setupTime: '24-48 hours',
    idealFor: [
      'Tractor-only owner-operators',
      'Drivers without trailer ownership',
      'High-mile operators',
      'Drop-and-hook specialists',
    ],
  },
];

export default function EquipmentPageClient() {
  return (
    <>
      {/* ============================================================
          PAGE HERO — compact dark band over the highway photo.
          ============================================================ */}
      <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden">
        <img
          src={MEDIA.highwayPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />

        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="eyebrow">Equipment we dispatch</p>
              <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[1.02] tracking-tight mb-5">
                Specialized dispatch for every truck
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mb-8">
                Whether you run a box truck or a reefer, our dispatchers have the
                expertise and connections to find the best-paying freight for your
                specific equipment.
              </p>
              <a
                href={BUSINESS.phoneHref}
                className="btn-primary h-14 px-8 text-base sm:text-lg"
                aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call now: {BUSINESS.phone}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Equipment quick nav — jump straight to your trailer type */}
      <section className="py-4 bg-white border-b border-surface-200 sticky top-20 z-30">
        <div className="container-custom">
          <nav aria-label="Equipment types" className="flex flex-wrap justify-center gap-3">
            {equipmentData.map((eq) => (
              <a
                key={eq.id}
                href={`#${eq.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200 rounded-md text-navy-800 font-medium hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                <eq.icon className="w-4 h-4 text-surface-500" aria-hidden="true" />
                {eq.name}
                <span className="font-display font-bold text-primary-600">{eq.percentage}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ============================================================
          EQUIPMENT SECTIONS — one per trailer type. The dispatch fee
          is the headline number on each dark stats card, mirroring
          the homepage equipment picker.
          ============================================================ */}
      {equipmentData.map((equipment, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <section
            key={equipment.id}
            id={equipment.id}
            className={`section-padding scroll-mt-36 overflow-x-clip ${isEven ? 'bg-surface-50' : 'bg-white'}`}
          >
            <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <ScrollReveal
                  direction={isEven ? 'left' : 'right'}
                  className={isEven ? '' : 'lg:order-2'}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <equipment.icon className="w-7 h-7 text-primary-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-950 leading-none">
                          {equipment.name}
                        </h2>
                        <p className="font-display font-bold text-primary-600 mt-1.5">
                          {equipment.percentage} of gross — that&apos;s the whole fee
                        </p>
                      </div>
                    </div>

                    <p className="text-surface-700 text-lg mb-8">{equipment.heroDescription}</p>

                    {/* Features */}
                    <h3 className="font-display text-xl font-bold text-navy-950 mb-4">
                      What we offer
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                      {equipment.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle
                            className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-surface-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Ideal For */}
                    <h3 className="font-display text-xl font-bold text-navy-950 mb-4">
                      Ideal for
                    </h3>
                    <ul className="space-y-2 mb-8">
                      {equipment.idealFor.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-surface-700">
                          <ArrowRight className="w-4 h-4 text-primary-600" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <a href={BUSINESS.phoneHref} className="btn-primary">
                      <Phone className="w-5 h-5" aria-hidden="true" />
                      Get started with {equipment.name}
                    </a>
                  </div>
                </ScrollReveal>

                <ScrollReveal
                  direction={isEven ? 'right' : 'left'}
                  className={isEven ? '' : 'lg:order-1'}
                >
                  <div>
                    {/* Stats card — fee percentage front and center */}
                    <div className="bg-navy-950 rounded-lg p-7 text-white mb-5">
                      <div className="flex items-start justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                        <div>
                          <p className="font-display text-sm font-semibold uppercase tracking-wider text-white/50 mb-2">
                            Dispatch fee
                          </p>
                          <p className="font-display text-5xl font-bold text-primary-500 leading-none">
                            {equipment.percentage}
                            <span className="block text-xs font-semibold text-white/50 uppercase tracking-wider mt-2">
                              of gross
                            </span>
                          </p>
                        </div>
                        <equipment.icon
                          className="w-10 h-10 text-white/40"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      <dl className="space-y-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-navy-900 border border-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-5 h-5 text-primary-500" aria-hidden="true" />
                          </div>
                          <div>
                            <dt className="text-sm text-white/60">Potential Weekly Gross</dt>
                            <dd className="font-display text-xl font-bold text-white">
                              {equipment.avgGross}
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-navy-900 border border-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-primary-500" aria-hidden="true" />
                          </div>
                          <div>
                            <dt className="text-sm text-white/60">Setup Time</dt>
                            <dd className="font-display text-xl font-bold text-white">
                              {equipment.setupTime}
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-navy-900 border border-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary-500" aria-hidden="true" />
                          </div>
                          <div>
                            <dt className="text-sm text-white/60">Popular Lanes</dt>
                            <dd className="text-white/80 text-sm">{equipment.lanes.join(', ')}</dd>
                          </div>
                        </div>
                      </dl>
                    </div>

                    {/* CTA card */}
                    <div className="bg-primary-600 rounded-lg p-7 text-white">
                      <h3 className="font-display text-2xl font-bold mb-2">
                        Ready to get dispatched?
                      </h3>
                      <p className="text-white/85 mb-6">
                        Call now and start earning more with professional{' '}
                        {equipment.name.toLowerCase()} dispatch.
                      </p>
                      <a
                        href={BUSINESS.phoneHref}
                        className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white text-primary-700 font-bold rounded-md hover:bg-primary-50 transition-colors"
                        aria-label={`Call ${BUSINESS.phone}`}
                      >
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        {BUSINESS.phone}
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* ============================================================
          COMPARISON TABLE — every trailer type, side by side.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Compare equipment</p>
              <h2 className="section-heading mb-4">Every trailer, side by side</h2>
              <p className="text-surface-700 text-lg">
                Compare our dispatch services across all equipment types.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="overflow-x-auto">
              <div className="min-w-[760px] rounded-lg border border-surface-200 overflow-hidden">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="bg-navy-950 text-white">
                      <th className="px-6 py-4 text-left font-display font-semibold text-lg">
                        Equipment Type
                      </th>
                      <th className="px-6 py-4 text-center font-display font-semibold text-lg border-l border-white/10">
                        Dispatch Fee
                      </th>
                      <th className="px-6 py-4 text-center font-display font-semibold text-lg border-l border-white/10">
                        Potential Weekly Gross
                      </th>
                      <th className="px-6 py-4 text-center font-display font-semibold text-lg border-l border-white/10">
                        Setup Time
                      </th>
                      <th className="px-6 py-4 text-center font-display font-semibold text-lg border-l border-white/10">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    {equipmentData.map((eq) => (
                      <tr key={eq.id} className="hover:bg-surface-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <eq.icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                            </div>
                            <span className="font-semibold text-navy-900">{eq.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-display text-2xl font-bold text-primary-600">
                            {eq.percentage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-navy-800">{eq.avgGross}</td>
                        <td className="px-6 py-4 text-center text-navy-800">{eq.setupTime}</td>
                        <td className="px-6 py-4 text-center">
                          <a
                            href={BUSINESS.phoneHref}
                            className="inline-flex items-center gap-1.5 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                          >
                            <Phone className="w-4 h-4" aria-hidden="true" />
                            Call Now
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-8 flex items-start gap-3 p-4 rounded-lg bg-surface-50 border border-surface-200 max-w-3xl">
              <AlertCircle
                className="w-5 h-5 text-surface-500 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                {REVENUE_POTENTIAL.disclaimer}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — dark band, one number to call.
          ============================================================ */}
      <section className="section-padding bg-navy-950 text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-5 text-balance">
              Get dispatched <span className="text-primary-500">today</span>
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              No matter what equipment you run, we have the expertise to keep you
              loaded and earning.
            </p>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center justify-center gap-3 h-16 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-md transition-colors"
              aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
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
