'use client';

import {
  Phone,
  Target,
  Heart,
  Shield,
  Users,
  MapPin,
  Award,
  TrendingUp,
  Truck,
  CheckCircle,
  BadgeCheck,
  MessageCircle,
} from 'lucide-react';
import { ScrollReveal } from '@/components';
import { BUSINESS, MEDIA, DISPATCHER, STATS } from '@/lib/constants';

const values = [
  {
    icon: Heart,
    title: 'Driver-First Mindset',
    description:
      'Every decision we make starts with one question: How does this help our drivers succeed? Your success is our success.',
  },
  {
    icon: Shield,
    title: 'Transparency',
    description:
      'No hidden fees, no surprise charges, no games. We believe in honest, straightforward business relationships.',
  },
  {
    icon: Target,
    title: 'Results-Driven',
    description:
      'We measure our success by your earnings. Our goal is to consistently increase your gross while reducing empty miles.',
  },
  {
    icon: Users,
    title: 'Partnership Approach',
    description:
      'We treat every driver like a partner, not a number. Your dedicated dispatcher learns your preferences and goals.',
  },
];

const milestones = [
  { year: '2020', event: 'Rai Logistics founded under Rai Technologies LLC' },
  { year: '2021', event: 'Expanded to full 48-state coverage' },
  { year: '2022', event: 'Added dedicated reefer and flatbed dispatchers' },
  { year: '2023', event: 'Launched specialized equipment divisions' },
  { year: '2024', event: 'Extended support to six days a week' },
];

export default function AboutPageClient() {
  return (
    <>
      {/* ============================================================
          PAGE HERO — compact dark band over the highway photo.
          ============================================================ */}
      <section className="relative bg-navy-950 text-white overflow-hidden">
        <img
          src={MEDIA.highwayPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />

        <div className="container-custom relative z-10 py-16 sm:py-20">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="eyebrow">About us</p>
              <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[1.02] tracking-tight mb-5">
                Your success is our business
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-8">
                Rai Logistics is a professional truck dispatch company operating
                under Rai Technologies LLC. We are dedicated to helping
                owner-operators and small fleets maximize their earnings through
                expert dispatch services.
              </p>
              <a
                href={BUSINESS.phoneHref}
                className="btn-primary"
                aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call us: {BUSINESS.phone}
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats strip along the bottom edge of the hero */}
        <div className="relative z-10 border-t border-white/15">
          <div className="container-custom">
            <dl className="grid grid-cols-2 md:grid-cols-4">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`py-5 sm:py-6 px-4 text-center ${
                    idx > 0 ? 'border-l border-white/10' : ''
                  } ${idx === 2 ? 'max-md:border-l-0' : ''}`}
                >
                  <dd className="font-display text-3xl sm:text-4xl font-bold text-white leading-none">
                    {stat.prefix}
                    {stat.value}
                    <span className="text-primary-400">{stat.suffix}</span>
                  </dd>
                  <dt className="mt-1.5 text-xs sm:text-sm text-white/60 uppercase tracking-wider font-medium">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============================================================
          MISSION & VISION — two flat cards, no gradients.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Who we are</p>
              <h2 className="section-heading mb-4">
                Nationwide dispatch, run like a small shop
              </h2>
              <p className="text-surface-700 text-lg">
                Based in Casper, Wyoming, we provide nationwide dispatch
                services with a focus on transparency, affordability, and
                driver success. Our team of experienced dispatchers understands
                the trucking industry and fights for the best rates on every
                load.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="h-full bg-navy-950 text-white rounded-lg p-8 md:p-10">
                <Target
                  className="w-10 h-10 text-primary-500 mb-6"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  To provide owner-operators and small fleets with affordable, professional
                  dispatch services that maximize their earnings and minimize their stress.
                  We believe every driver deserves a dedicated partner who fights for their
                  success on every load.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="h-full bg-surface-50 border border-surface-200 rounded-lg p-8 md:p-10">
                <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-primary-600" aria-hidden="true" />
                </div>
                <h2 className="font-display text-3xl font-bold text-navy-950 mb-4">
                  Our Vision
                </h2>
                <p className="text-surface-700 text-lg leading-relaxed">
                  To be the most trusted and driver-focused dispatch service in America.
                  We envision a future where every owner-operator has access to professional
                  dispatch support at an affordable price, with complete transparency
                  and no hidden costs.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          MEET SAM — the person behind the company, dark band.
          ============================================================ */}
      <section className="section-padding bg-navy-950 text-white overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <ScrollReveal className="lg:col-span-2">
              <div className="relative max-w-sm mx-auto lg:mx-0">
                <div className="bg-navy-900 border border-white/10 rounded-lg p-8">
                  <div className="w-28 h-28 mx-auto mb-5 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="font-display text-5xl font-bold text-white">
                      {DISPATCHER.initials}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 text-white/90 rounded-md text-xs font-semibold mb-3">
                      <BadgeCheck className="w-3.5 h-3.5 text-primary-400" aria-hidden="true" />
                      Talk to me directly
                    </div>
                    <h3 className="font-display text-3xl font-bold mb-1">{DISPATCHER.name}</h3>
                    <p className="text-white/60 text-sm mb-6">{DISPATCHER.title}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={BUSINESS.phoneHref}
                        className="inline-flex items-center justify-center gap-1.5 h-11 px-4 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700 transition-colors"
                        aria-label={`Call ${DISPATCHER.name} at ${BUSINESS.phone}`}
                      >
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        Call
                      </a>
                      <a
                        href={BUSINESS.smsHref}
                        className="inline-flex items-center justify-center gap-1.5 h-11 px-4 bg-white/10 text-white text-sm font-semibold rounded-md border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" aria-hidden="true" />
                        Text
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-3" delay={0.15}>
              <p className="eyebrow">Meet your dispatcher</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.08] mb-5">
                The dispatcher behind{' '}
                <span className="text-primary-500">Rai Logistics</span>
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">{DISPATCHER.intro}</p>

              <ul className="grid sm:grid-cols-2 gap-3">
                {DISPATCHER.commitments.map((commitment) => (
                  <li
                    key={commitment}
                    className="flex items-start gap-3 p-3.5 bg-navy-900 rounded-md border border-white/10"
                  >
                    <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-white/90 text-sm font-medium">{commitment}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          VALUES — four flat cards.
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">What we stand for</p>
              <h2 className="section-heading mb-4">Our core values</h2>
              <p className="text-surface-700 text-lg">
                The principles that guide everything we do at Rai Logistics.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5">
            {values.map((value, idx) => (
              <ScrollReveal key={value.title} delay={idx * 0.07}>
                <div className="card p-7 h-full">
                  <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mb-5">
                    <value.icon className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy-950 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-surface-700 leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPANY INFO + JOURNEY — the paperwork facts and the timeline.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <ScrollReveal>
              <p className="eyebrow">The company</p>
              <h2 className="font-display text-3xl font-bold text-navy-950 mb-8">
                Company information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Operating Name</h3>
                    <p className="text-surface-700">{BUSINESS.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Parent Company</h3>
                    <p className="text-surface-700">{BUSINESS.parentCompany}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Headquarters</h3>
                    <p className="text-surface-700">{BUSINESS.address.full}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Service Area</h3>
                    <p className="text-surface-700">{BUSINESS.serviceArea}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="eyebrow">Milestones</p>
              <h2 className="font-display text-3xl font-bold text-navy-950 mb-8">
                Our journey
              </h2>
              <div className="space-y-6">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="flex items-start gap-4">
                    <div className="w-16 h-10 bg-navy-950 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-white font-bold text-sm tracking-wide">
                        {milestone.year}
                      </span>
                    </div>
                    <p className="text-surface-700 pt-2">{milestone.event}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          DISCLAIMER — plain and honest.
          ============================================================ */}
      <section className="py-12 bg-surface-50 border-t border-surface-200">
        <div className="container-custom">
          <p className="text-surface-600 text-sm max-w-3xl leading-relaxed">
            <strong className="text-navy-900">Disclaimer:</strong> {BUSINESS.name} provides dispatch services.
            We are not a motor carrier or freight broker. Carriers remain responsible
            for compliance and maintaining operating authority.
          </p>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — flat dark band, one big red button.
          ============================================================ */}
      <section className="section-padding bg-navy-950 text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-5 text-balance">
              Ready to partner <span className="text-primary-500">with us?</span>
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-9 max-w-xl mx-auto">
              One call and you&apos;re set up with a dispatcher who answers.
            </p>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center justify-center gap-3 h-16 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg sm:text-xl rounded-md transition-colors"
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
