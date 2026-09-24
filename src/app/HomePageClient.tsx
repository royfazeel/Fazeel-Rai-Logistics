'use client';

import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  ArrowRight,
  CheckCircle,
  XCircle,
  Shield,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Zap,
  Truck,
  Container,
  Snowflake,
  Box,
  Package,
  MessageSquare,
  MessageCircle,
  Route,
  FileText,
  Calendar,
  BadgeCheck,
} from 'lucide-react';
import {
  ScrollReveal,
  PricingPreview,
  FAQAccordion,
  QuoteModal,
  VideoBackdrop,
} from '@/components';
import {
  BUSINESS,
  MEDIA,
  EQUIPMENT_TYPES,
  SERVICES,
  HOW_IT_WORKS,
  STATS,
  FAQS,
  SCOPE_CLARITY,
  RISK_REVERSAL,
  DISPATCHER,
} from '@/lib/constants';
import { track } from '@/lib/track';

const iconComponents: Record<string, React.ElementType> = {
  DollarSign,
  Package,
  MessageSquare,
  Route,
  FileText,
  Calendar,
};

const equipmentIcons: Record<string, React.ElementType> = {
  'box-truck': Box,
  'dry-van': Container,
  'flatbed': Truck,
  'reefer': Snowflake,
  'power-only': Package,
};

/**
 * Squeezes BUSINESS.hours down to the micro-caps form the hero status line
 * needs — "Monday – Saturday" + "8:00 AM – 6:00 PM CST" becomes
 * "MON–SAT 8A–6P CST". Derived rather than hardcoded so the hero can never
 * drift from the hours shown in the footer and on /contact.
 */
function condenseHours(hours: { days: string; time: string }): string {
  const days = hours.days
    .split(/\s*[–—-]\s*/)
    .map((day) => day.trim().slice(0, 3))
    .join('–');
  const time = hours.time
    .replace(/:00/g, '')
    .replace(/\s*([AP])M\b/gi, '$1')
    .replace(/\s*[–—-]\s*/g, '–');
  return `${days} ${time}`.toUpperCase();
}

const HERO_STATUS = `Dispatch desk hours · ${condenseHours(BUSINESS.hours)}`;

export default function HomePage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      {/* ============================================================
          HERO — branded truck image, edge to edge.
          The -mt-20 pulls the section up behind the fixed header
          (which starts transparent on this page), so the image runs
          from the very top of the viewport. Content is vertically
          centered; a stats strip anchors the bottom edge.
          ============================================================ */}
      <section className="photo-hero relative -mt-20 flex flex-col overflow-hidden bg-navy-950 min-h-[100svh]">
        <div className="hero-photo-desktop" aria-hidden="true">
          <Image
            src="/images/rai-dispatch-hero-realistic.png"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className="hero-photo-image"
          />
        </div>
        <div className="photo-hero-scrim" aria-hidden="true" />

        <div className="photo-hero-content container-custom relative z-10 flex-1 flex flex-col justify-center pt-32 lg:pt-44 pb-16 w-full">
          {/* ------------------------------------------------------------
              Desktop-only frame. Nothing sits inside it — it is there to
              give the open right half an edge so the composition reads as
              deliberate. Aligned to the content gutter (left-8/right-8 of
              the container's padding box) and clipped to this flex-1 area,
              so the rail stops cleanly at the stats strip. Hidden below lg
              via responsive classes, and inert for pointers + AT.
              ------------------------------------------------------------ */}
          <div
            className="photo-hero-frame pointer-events-none absolute inset-y-0 left-8 right-8 hidden lg:block"
            aria-hidden="true"
          >
            {/* Status line — hours come from BUSINESS.hours */}
            <div className="absolute right-4 top-[100px] flex items-center gap-2.5 font-display text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-white/80 [text-shadow:0_1px_6px_rgba(20,22,28,0.75)]">
              <span className="block h-[7px] w-[7px] bg-primary-600" />
              {HERO_STATUS}
            </div>

            {/* Hairline rule under the status line, red tick where it meets the rail */}
            <div className="absolute inset-x-0 top-[136px] h-px bg-white/25">
              <span className="absolute right-0 -top-px block h-[2px] w-10 bg-primary-600" />
            </div>

            {/* Right-edge keyline rail + vertical scroll cue */}
            <div className="absolute right-0 top-[136px] bottom-0 w-px bg-white/25">
              <span className="absolute right-0 top-0 block h-10 w-[2px] bg-primary-600" />
              <span className="absolute right-0 bottom-0 block h-[88px] w-[2px] bg-primary-600" />
              <span className="absolute right-[15px] bottom-[104px] font-display text-[0.9375rem] font-semibold uppercase tracking-[0.34em] text-white/85 [writing-mode:vertical-rl] [text-shadow:0_1px_6px_rgba(20,22,28,0.75)]">
                Scroll
              </span>
            </div>
          </div>

          <div className="photo-hero-copy relative max-w-3xl">
            <p
              className="font-display text-sm sm:text-base font-semibold uppercase tracking-[0.22em] text-white/70 mb-5 lg:mb-7 flex items-center gap-3"
            >
              <span className="inline-block w-10 h-[3px] bg-primary-500" aria-hidden="true" />
              Truck dispatch services · 48 contiguous states
            </p>

            <h1
              className="photo-hero-title font-display font-bold uppercase text-white leading-[0.95] tracking-tight mb-6 lg:mb-7"
            >
              You drive the miles.
              <br />
              <span className="text-primary-500">We manage the loads.</span>
            </h1>

        <div className="hero-photo-mobile" aria-hidden="true">
          <Image
            src="/images/rai-dispatch-hero-realistic.png"
            alt=""
            fill
            priority
            sizes="(max-width: 639px) 165vw, (max-width: 1023px) 130vw, 1px"
            quality={90}
            className="hero-photo-image"
          />
        </div>

            <p
              className="text-lg sm:text-xl text-white/85 mb-8 lg:mb-9 max-w-xl leading-relaxed"
            >
              <span className="hidden sm:inline">Your dedicated dispatcher finds freight, negotiates rates, and
              handles load paperwork. Nationwide support for owner-operators
              and fleets, with {DISPATCH_RATE_RANGE} fees based on your equipment.</span>
              <span className="sm:hidden">Your dedicated dispatcher finds loads, negotiates rates, and handles paperwork. Nationwide support, with {DISPATCH_RATE_RANGE} fees by equipment.</span>
            </p>

            <div
              className="photo-hero-actions flex flex-col sm:flex-row gap-3 mb-10"
            >
              <button
                onClick={() => { track('quote_modal_open', { location: 'home_hero' }); setIsQuoteModalOpen(true); }}
                className="btn-primary h-14 px-8 text-base sm:text-lg"
              >
                Get a free setup
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <a
                href={BUSINESS.phoneHref}
                onClick={() => track('call_click', { location: 'home_hero' })}
                className="btn-ghost-light h-14 px-8 text-base sm:text-lg whitespace-nowrap"
                aria-label={`Call Rai Dispatch at ${BUSINESS.phone}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                {BUSINESS.phone}
              </a>
            </div>

            <ul
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75"
            >
              {['Dedicated dispatcher', `${DISPATCH_RATE_RANGE} by equipment`, 'You approve every load'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Stats strip along the bottom edge of the hero — solid-ish backing
            keeps the small labels readable over the photograph */}
        <div className="photo-hero-stats relative z-10 border-t border-white/15 bg-navy-950/70">
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
                    <span className="text-primary-400">{'suffix' in stat ? stat.suffix : ''}</span>
                  </dd>
                  <dt className="mt-1.5 text-xs sm:text-sm text-white/75 uppercase tracking-wider font-medium">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>


      {/* ============================================================
          ONBOARDING STRIP — the risk-reversal offer, front and center.
          Answers "what's the catch?" before anyone has to ask.
          ============================================================ */}
      <section className="py-12 sm:py-16 bg-surface-50 border-b border-surface-200">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-center">
            <ScrollReveal>
              <div className="max-w-xs">
                <p className="eyebrow">Free &amp; easy onboarding</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 leading-tight">
                  {RISK_REVERSAL.headline}
                </h2>
                <p className="text-surface-700 mt-2">{RISK_REVERSAL.subheadline}</p>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-3">
              {RISK_REVERSAL.bullets.map((bullet, idx) => (
                <ScrollReveal key={bullet} delay={idx * 0.06}>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-surface-200 h-full">
                    <CheckCircle
                      className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-navy-900 text-sm font-medium leading-relaxed">
                      {bullet}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES — the full back office, one grid.
          ============================================================ */}
      <section id="services" className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="eyebrow">Discover our services</p>
              <h2 className="section-heading mb-4">
                Truck dispatch services, from load search to delivery.
              </h2>
              <p className="text-surface-700 text-lg">
                Load booking, freight rate negotiation, broker communication,
                route planning, and paperwork support for your trucking business.
                Choose a service to see what is included.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service, idx) => {
              const Icon = iconComponents[service.icon] || Package;
              return (
                <ScrollReveal key={service.id} delay={idx * 0.07}>
                  <div className="group card p-6 h-full hover:border-primary-300">
                    <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors">
                      <Icon
                        className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-navy-950 mb-2">
                      <Link href={`/services/${service.id}`} className="hover:text-primary-600">{service.title}</Link>
                    </h3>
                    <p className="text-surface-700 leading-relaxed">{service.description}</p>
                    <Link href={`/services/${service.id}`} className="inline-flex items-center gap-2 font-semibold text-primary-700 mt-5 py-2">Explore {service.title.toLowerCase()}<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal className="mt-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'home_services_cta' })} className="btn-primary">
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call to get started
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-navy-900 font-semibold hover:text-primary-600 transition-colors"
              >
                See all services
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          TRUCK TYPES — dark band, Logity-style equipment picker.
          Fee percentage is the headline number on each card.
          ============================================================ */}
      <section id="equipment" className="section-padding bg-navy-950 text-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="eyebrow">Choose your truck type</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.08] mb-4">
                Dispatch for your truck and trailer type.
              </h2>
              <p className="text-white/70 text-lg">
                Dry van, reefer, flatbed, box truck, power only, step deck, hotshot,
                and cargo van dispatch. We review your equipment and lane needs
                before you start, with a dedicated dispatcher and equipment-based
                dispatch fees of {DISPATCH_RATE_RANGE}.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EQUIPMENT_TYPES.map((equipment, idx) => {
              const Icon = equipmentIcons[equipment.id] || Truck;
              return (
                <ScrollReveal key={equipment.id} delay={idx * 0.06}>
                  <div className="group h-full bg-navy-900 border border-white/10 hover:border-primary-500/60 rounded-lg p-6 transition-colors">
                    <div className="flex items-start justify-between mb-5">
                      <Icon className="w-9 h-9 text-white/60" strokeWidth={1.75} aria-hidden="true" />
                      <span className="font-display text-2xl font-bold text-primary-500 leading-none">
                        {equipment.percentage}
                        <span className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mt-1 text-right">
                          of gross
                        </span>
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2"><Link href={`/equipment/${equipment.id}`} className="hover:text-primary-400">{equipment.name}</Link></h3>
                    <p className="text-white/65 text-sm leading-relaxed mb-4">
                      {equipment.description}
                    </p>
                    <ul className="space-y-2">
                      {equipment.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" aria-hidden="true" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/equipment/${equipment.id}`} className="inline-flex items-center gap-2 text-white font-semibold mt-5 py-2">Explore dispatch options<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
                  </div>
                </ScrollReveal>
              );
            })}

            {/* Final slot: direct line CTA */}
            <ScrollReveal delay={0.3}>
              <div className="h-full bg-primary-600 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <Phone className="w-9 h-9 text-white/90 mb-5" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Not sure where your truck fits?
                  </h3>
                  <p className="text-white text-sm leading-relaxed mb-6">
                    Tell us your equipment and where you like to run. We&apos;ll
                    review your capacity, lanes, and broker requirements together.
                  </p>
                </div>
                <div className="space-y-2">
                  <a
                    href={BUSINESS.phoneHref}
                    onClick={() => track('call_click', { location: 'home_ratecheck_card' })}
                    className="flex items-center justify-center gap-2 h-12 px-4 bg-white text-primary-700 font-bold rounded-md hover:bg-primary-50 transition-colors"
                    aria-label={`Call ${BUSINESS.phone}`}
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    {BUSINESS.phone}
                  </a>
                  <a
                    href={BUSINESS.smsHref}
                    onClick={() => track('sms_click', { location: 'home_ratecheck_card' })}
                    className="flex items-center justify-center gap-2 h-12 px-4 bg-primary-700 text-white font-semibold rounded-md border border-white/25 hover:bg-primary-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Text us instead
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-50">
        <div className="container-custom grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="eyebrow">Nationwide freight dispatch</p>
            <h2 className="section-heading mb-5">Your lanes. Your schedule. All 48 contiguous states.</h2>
            <p className="text-surface-700 text-lg leading-relaxed mb-5">From regional runs to coast-to-coast trucking, we build a load search around your home base, equipment, and time at home. We help compare reload options, empty miles, delivery appointments, and total trip costs before you commit.</p>
            <div className="flex flex-col items-start gap-2">
              <Link href="/service-areas" className="inline-flex gap-2 items-center font-semibold text-primary-700 py-2">Explore nationwide dispatch coverage<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
              <Link href="/carriers" className="inline-flex gap-2 items-center font-semibold text-primary-700 py-2">Find dispatch support for your operation<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Owner-operators', description: 'A dedicated dispatch contact while you stay in control of load acceptance and your own authority.' },
              { title: 'Small fleets', description: 'Coordinate truck availability, driver preferences, and paperwork across your equipment.' },
              { title: 'Regional & OTR carriers', description: 'Balance longer lanes, local reload opportunities, and the schedule that works for you.' },
              { title: 'New authorities', description: 'Review insurance, authority age, and broker eligibility before setting expectations for available loads.' },
            ].map(item => <div key={item.title} className="card p-6"><h3 className="font-display text-2xl font-bold text-navy-950 mb-3">{item.title}</h3><p className="text-surface-700 leading-relaxed">{item.description}</p></div>)}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS — four numbered steps, signage-style digits.
          ============================================================ */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="eyebrow">How it works</p>
              <h2 className="section-heading mb-4">
                From your first call to a load you approve.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {HOW_IT_WORKS.map((step, idx) => (
              <ScrollReveal key={step.step} delay={idx * 0.1}>
                <div className="relative pt-5 border-t-[3px] border-surface-200">
                  <span
                    className="absolute -top-[3px] left-0 w-12 h-[3px] bg-primary-600"
                    aria-hidden="true"
                  />
                  <span className="font-display text-5xl font-bold text-surface-700 leading-none">
                    {String(step.step).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-navy-950 mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-surface-700 leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-12">
            <a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'home_how_it_works' })} className="btn-call">
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call to start: {BUSINESS.phone}
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          MEET YOUR DISPATCHER — a real person, not a call center.
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/90 rounded-md border border-white/15 text-xs font-semibold mb-3">
                      <BadgeCheck className="w-3.5 h-3.5 text-primary-400" aria-hidden="true" />
                      Talk to our dispatch team
                    </div>
                    <h3 className="font-display text-3xl font-bold mb-1">{DISPATCHER.name}</h3>
                    <p className="text-white/60 text-sm mb-6">{DISPATCHER.title}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={BUSINESS.phoneHref}
                        onClick={() => track('call_click', { location: 'home_dispatcher_card' })}
                        className="inline-flex items-center justify-center gap-1.5 h-11 px-4 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        Call
                      </a>
                      <a
                        href={BUSINESS.smsHref}
                        onClick={() => track('sms_click', { location: 'home_dispatcher_card' })}
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
              <p className="eyebrow">Your dispatch contact</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.08] mb-5">
                One point of contact. <span className="text-primary-500">A plan for your truck.</span>
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
          STRAIGHT TALK — what we are / what we're not.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Straight talk</p>
              <h2 className="section-heading mb-4">
                What Rai Dispatch is — and what it isn&apos;t
              </h2>
              <p className="text-surface-700 text-lg">
                Know who handles each part of the load and what remains
                your responsibility as the motor carrier.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            <ScrollReveal>
              <div className="h-full rounded-lg border-2 border-primary-200 bg-primary-50/40 p-7">
                <h3 className="font-display text-2xl font-bold text-navy-950 mb-5 flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-primary-600" aria-hidden="true" />
                  What we are
                </h3>
                <ul className="space-y-3.5">
                  {SCOPE_CLARITY.weAre.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-navy-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="h-full rounded-lg border border-surface-300 bg-surface-50 p-7">
                <h3 className="font-display text-2xl font-bold text-navy-950 mb-5 flex items-center gap-3">
                  <XCircle className="w-7 h-7 text-navy-500" aria-hidden="true" />
                  What we&apos;re not
                </h3>
                <ul className="space-y-3.5">
                  {SCOPE_CLARITY.weArent.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-navy-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING — three plans, no surprises.
          ============================================================ */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="eyebrow">Transparent pricing</p>
              <h2 className="section-heading mb-4">
                Your dedicated dispatcher. {DISPATCH_RATE_RANGE} by equipment.
              </h2>
              <p className="text-surface-700 text-lg">
                Keep your dispatch costs clear from the first conversation.
                Confirm your percentage, included services, and billing terms
                in writing before the first load.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <PricingPreview />
          </ScrollReveal>

          <ScrollReveal className="mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-navy-900 font-semibold hover:text-primary-600 transition-colors"
            >
              View full pricing details
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          WHY RAI — six reasons, plain words.
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">The Rai advantage</p>
              <h2 className="section-heading mb-4">
                Built by people who answer their phone
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: DollarSign,
                title: 'Affordable rates',
                description:
                  `Equipment-based dispatch fees of ${DISPATCH_RATE_RANGE} of gross revenue on loads we dispatch, confirmed before you start.`,
              },
              {
                icon: Users,
                title: 'Dedicated dispatcher',
                description:
                  'Work with the same dispatcher who knows your preferences and goals.',
              },
              {
                icon: MapPin,
                title: 'Nationwide coverage',
                description:
                  'We dispatch trucks in all 48 contiguous states. Go where the best freight is.',
              },
              {
                icon: Zap,
                title: 'Fast response',
                description:
                  'Quick communication and fast load turnaround. We value your time.',
              },
              {
                icon: Shield,
                title: 'Transparent pricing',
                description:
                  'No hidden fees or surprise charges. What we quote is what you pay.',
              },
              {
                icon: Clock,
                title: 'Driver-first approach',
                description:
                  'Your success is our success. We fight for your best interests on every load.',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.06}>
                <div className="flex gap-4 p-6 bg-white rounded-lg border border-surface-200 h-full">
                  <div className="w-11 h-11 bg-navy-950 rounded-md flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-500" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold text-navy-950 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-surface-700 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <p className="eyebrow">Carrier resources</p>
          <h2 className="section-heading mb-5">Make your next dispatch decision with better information.</h2>
          <p className="text-surface-700 text-lg max-w-2xl mb-8">Practical guides to dispatch costs, onboarding, selecting a dispatcher, and evaluating a load beyond the headline rate.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'How dispatch fees work', href: 'truck-dispatch-fees', text: 'Compare percentage fees, fixed plans, and the terms to confirm in writing.' },
              { title: 'Choose a truck dispatcher', href: 'how-to-choose-a-truck-dispatcher', text: 'Ask about load approval, communication, service scope, and cancellation.' },
              { title: 'Get ready for onboarding', href: 'carrier-onboarding-checklist', text: 'Prepare authority, insurance, equipment details, and your lane preferences.' },
              { title: 'Evaluate a freight rate', href: 'evaluate-freight-rate-per-mile', text: 'Account for deadhead, time, fuel, and delivery requirements before accepting.' },
            ].map(item => <Link key={item.href} href={`/resources/${item.href}`} className="card p-6 hover:border-primary-300"><h3 className="font-display text-2xl font-bold text-navy-950 mb-3">{item.title}</h3><p className="text-surface-700 mb-5">{item.text}</p><span className="inline-flex items-center gap-2 font-semibold text-primary-700">Read the guide<ArrowRight className="w-4 h-4" aria-hidden="true" /></span></Link>)}
          </div>
          <Link href="/resources" className="inline-flex items-center gap-2 text-primary-700 font-semibold mt-8 py-2">All carrier resources<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
      </section>

      {/* ============================================================
          FAQ — the questions every owner-operator asks first.
          ============================================================ */}
      <section id="faq" className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Questions? We have answers</p>
              <h2 className="section-heading mb-4">Frequently asked questions</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <FAQAccordion faqs={FAQS.slice(0, 8)} columns={2} />
          </ScrollReveal>

          <ScrollReveal className="mt-10">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-navy-900 font-semibold hover:text-primary-600 transition-colors"
            >
              View all FAQs
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — second slab of real footage. A truck rolls past
          at ground level while the pitch closes.
          ============================================================ */}
      <section className="relative section-padding bg-navy-950 text-white overflow-hidden">
        <VideoBackdrop src={MEDIA.ctaVideo.src} poster={MEDIA.ctaVideo.poster} loading="lazy" />
        <div className="absolute inset-0 bg-navy-950/80" aria-hidden="true" />

        <div className="container-custom text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-navy-900 rounded-md border border-white/10 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              <span className="text-sm font-semibold text-white">
                Dispatch desk · {BUSINESS.hours.days}
              </span>
            </div>

            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mb-5 text-balance">
              Don&apos;t run empty.
              <br />
              Run with <span className="text-primary-500">Rai</span>.
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-9 max-w-2xl mx-auto">
              Tell us about your truck, lanes, and schedule. We will walk through
              your dedicated dispatcher, documents, and the {DISPATCH_RATE_RANGE} fee
              for your equipment.
            </p>

            <div className="flex flex-col gap-3 max-w-md mx-auto mb-8">
              <a
                href={BUSINESS.phoneHref}
                onClick={() => track('call_click', { location: 'home_final_cta' })}
                className="inline-flex items-center justify-center gap-3 h-16 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg sm:text-xl rounded-md transition-colors whitespace-nowrap"
              >
                <Phone className="w-6 h-6" strokeWidth={2.25} aria-hidden="true" />
                {BUSINESS.phone}
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a href={BUSINESS.smsHref} onClick={() => track('sms_click', { location: 'home_final_cta' })} className="btn-ghost-light h-14">
                  <MessageCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  Text us
                </a>
                <button
                  onClick={() => { track('quote_modal_open', { location: 'home_final_cta' }); setIsQuoteModalOpen(true); }}
                  className="btn-ghost-light h-14"
                >
                  Get a quote
                  <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="text-white/60 text-sm">
              No forced dispatch · No setup fees · Free consultation
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </>
  );
}
