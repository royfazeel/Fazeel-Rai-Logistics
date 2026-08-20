'use client';

import {
  Phone,
  Check,
  X,
  Shield,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Percent,
  ArrowRight,
} from 'lucide-react';
import { ScrollReveal, PricingTable, FAQAccordion } from '@/components';
import { BUSINESS, MEDIA, WEEKLY_PLAN_FAQS } from '@/lib/constants';
import Link from 'next/link';

const pricingFaqs = [
  {
    id: 1,
    question: 'What is the difference between weekly, contract, and percentage plans?',
    answer:
      'The Weekly Flat Rate plan charges a simple weekly fee per truck regardless of how many loads you run. The Contract plan is a fixed monthly fee with all services included. The Percentage plan charges 5-7% of your gross load pay, so you only pay when you are earning. Many drivers prefer the weekly plan for its simplicity and predictability.',
  },
  {
    id: 2,
    question: 'Are there any hidden fees?',
    answer:
      'Absolutely not. What we quote is what you pay. There are no setup fees, no cancellation fees, and no surprise charges. We believe in complete transparency.',
  },
  {
    id: 3,
    question: 'How does billing work for the weekly plan?',
    answer:
      'We bill weekly at the beginning of each dispatch week. You choose your preferred billing day during setup. Payment is due before dispatch services begin for that week. We accept most payment methods.',
  },
  {
    id: 4,
    question: 'Can I switch between plans?',
    answer:
      'Yes! You can switch between our Weekly Flat Rate, Contract, or Percentage plans at any time. Just give us notice and we will adjust your billing accordingly starting the next billing period.',
  },
  {
    id: 5,
    question: 'Is there a minimum commitment?',
    answer:
      'Our weekly and contract plans have no long-term commitment required. You can cancel with proper notice as detailed in our Terms of Service. We believe in earning your business, not trapping you in contracts.',
  },
];

// Rates by equipment — figures match PRICING_PLANS in constants.ts
const EQUIPMENT_RATES = [
  { name: 'Box Truck', weekly: '$250', percentage: '7%' },
  { name: 'Dry Van', weekly: '$300', percentage: '5%' },
  { name: 'Reefer', weekly: '$350', percentage: '5%' },
  { name: 'Flatbed', weekly: '$300', percentage: '5%' },
  { name: 'Power Only', weekly: '$300', percentage: '6%' },
];

const COMPARISON_FEATURES = [
  { feature: 'Dedicated Dispatcher', weekly: true, contract: true, percentage: true },
  { feature: 'Load Sourcing & Booking', weekly: true, contract: true, percentage: true },
  { feature: 'Rate Negotiation', weekly: true, contract: true, percentage: true },
  { feature: 'Broker Communication', weekly: true, contract: true, percentage: true },
  { feature: 'Paperwork Support', weekly: true, contract: true, percentage: true },
  { feature: 'Lane Strategy', weekly: true, contract: true, percentage: true },
  { feature: 'Dispatch Coordination', weekly: true, contract: true, percentage: true },
  { feature: 'Detention Requests', weekly: true, contract: true, percentage: true },
  { feature: 'Predictable Billing', weekly: true, contract: true, percentage: false },
  { feature: 'No Percentage Cuts', weekly: true, contract: true, percentage: false },
  { feature: 'Pay Only When Earning', weekly: false, contract: false, percentage: true },
  { feature: 'Best for High Volume', weekly: true, contract: true, percentage: false },
  { feature: 'Best for Variable Volume', weekly: false, contract: false, percentage: true },
  { feature: 'Weekly Performance Reviews', weekly: true, contract: true, percentage: true },
];

function ComparisonMark({ included }: { included: boolean }) {
  return included ? (
    <>
      <Check className="w-5 h-5 text-primary-600 mx-auto" aria-hidden="true" />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <X className="w-5 h-5 text-surface-500 mx-auto" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </>
  );
}

export default function PricingPageClient() {
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
              <p className="eyebrow">Transparent pricing</p>
              <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-5">
                Affordable nationwide dispatching
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-2xl">
                Specialized in Box Trucks, Dry Vans, Reefers, Flatbeds, and Power Only.
                Choose the plan that works best for your business. No hidden fees, no surprises.
              </p>
              <a
                href={BUSINESS.phoneHref}
                className="btn-call"
                aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call for Details: {BUSINESS.phone}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          VALUE PROPS — three quick reasons, flat icon chips.
          ============================================================ */}
      <section className="py-12 bg-white border-b border-surface-200">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Competitive Rates',
                description: 'Weekly rates from $250/week or percentage from 5%.',
              },
              {
                icon: Shield,
                title: 'No Hidden Fees',
                description: 'What we quote is what you pay. Complete transparency.',
              },
              {
                icon: Users,
                title: 'Full Service Included',
                description: 'All plans include dedicated dispatcher and full support.',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.08}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-navy-950 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-surface-700 text-sm">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING TABLES — plan toggle + full plan cards.
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Plans &amp; rates</p>
              <h2 className="section-heading mb-4">Pick the plan that fits how you run</h2>
              <p className="text-surface-700 text-lg">
                Weekly flat rate, monthly contract, or a percentage of gross.
                Same dispatcher, same full service on every one.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <PricingTable showToggle={true} defaultPlan="weekly" />
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          WEEKLY PLAN FAQ
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Weekly plan FAQ
              </p>
              <h2 className="section-heading mb-4">Questions about weekly billing</h2>
              <p className="text-surface-700 text-lg">
                Common questions about our most popular pricing option.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <FAQAccordion faqs={WEEKLY_PLAN_FAQS} />
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          DETAILED COMPARISON — classic table, navy header row.
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Side by side</p>
              <h2 className="section-heading mb-4">Detailed plan comparison</h2>
              <p className="text-surface-700 text-lg">
                See exactly what is included in each plan.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="max-w-5xl">
              <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="bg-navy-950 text-white">
                        <th className="px-6 py-4 text-left font-display font-semibold text-lg">
                          Feature
                        </th>
                        <th className="px-6 py-4 text-center font-display font-bold text-lg border-l border-white/10">
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-500" aria-hidden="true" />
                            Weekly Plan
                          </span>
                        </th>
                        <th className="px-6 py-4 text-center font-display font-semibold text-lg text-white/70 border-l border-white/10">
                          <span className="inline-flex items-center gap-2">
                            <FileText className="w-4 h-4" aria-hidden="true" />
                            Contract Plan
                          </span>
                        </th>
                        <th className="px-6 py-4 text-center font-display font-semibold text-lg text-white/70 border-l border-white/10">
                          <span className="inline-flex items-center gap-2">
                            <Percent className="w-4 h-4" aria-hidden="true" />
                            Percentage Plan
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_FEATURES.map((row, idx) => (
                        <tr
                          key={row.feature}
                          className={`border-t border-surface-200 ${
                            idx % 2 === 0 ? 'bg-surface-50/60' : 'bg-white'
                          }`}
                        >
                          <td className="px-6 py-4 text-navy-900 font-medium">{row.feature}</td>
                          <td className="px-6 py-4 text-center border-l border-surface-200 bg-primary-50/30">
                            <ComparisonMark included={row.weekly} />
                          </td>
                          <td className="px-6 py-4 text-center border-l border-surface-200">
                            <ComparisonMark included={row.contract} />
                          </td>
                          <td className="px-6 py-4 text-center border-l border-surface-200">
                            <ComparisonMark included={row.percentage} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          EQUIPMENT RATES — one flat card per trailer type.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">By trailer type</p>
              <h2 className="section-heading mb-4">Rates by equipment type</h2>
              <p className="text-surface-700 text-lg">
                Our rates vary based on equipment type across all plans.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {EQUIPMENT_RATES.map((item, idx) => (
              <ScrollReveal key={item.name} delay={idx * 0.06}>
                <div className="card p-5 h-full">
                  <p className="font-display text-sm font-semibold uppercase tracking-wider text-surface-600 mb-4">
                    {item.name}
                  </p>
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-surface-500 mb-1">
                      Weekly rate
                    </p>
                    <p className="font-display text-3xl font-bold text-navy-950 leading-none">
                      {item.weekly}
                      <span className="text-sm text-surface-500 font-semibold">/week</span>
                    </p>
                  </div>
                  <div className="border-t border-surface-200 pt-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-surface-500 mb-1">
                      Percentage rate
                    </p>
                    <p className="font-display text-2xl font-bold text-primary-600 leading-none">
                      {item.percentage}
                      <span className="text-sm text-surface-500 font-semibold"> of gross</span>
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-8">
            <p className="text-surface-600 text-sm max-w-3xl">
              Weekly rates are billed per truck. Percentage rates are calculated on the gross rate confirmation amount.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          GENERAL PRICING FAQ
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Billing questions</p>
              <h2 className="section-heading mb-4">General pricing questions</h2>
              <p className="text-surface-700 text-lg">
                Common questions about our pricing and billing.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <FAQAccordion faqs={pricingFaqs} />
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — flat dark band.
          ============================================================ */}
      <section className="section-padding bg-navy-950 text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Call now to discuss which plan is right for your business.
              No obligation, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={BUSINESS.phoneHref}
                className="btn-call"
                aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                {BUSINESS.phone}
              </a>
              <Link href="/contact" className="btn-ghost-light px-8 py-4 text-lg">
                Contact Us
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
