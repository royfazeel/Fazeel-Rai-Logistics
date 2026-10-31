'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';
import PricingTable from '@/components/PricingTable';
import FeeCalculator from '@/components/FeeCalculator';
import StaticPhoto from '@/components/StaticPhoto';
import { BUSINESS, EQUIPMENT_TYPES, MEDIA } from '@/lib/constants';
import { DISPATCH_FEES_ANSWER, DISPATCH_FEE_POLICY, getDispatchRate, getDispatchRateLabel, getEquipmentFeeStatement, OTHER_EQUIPMENT_NOTICE, VAN_CATEGORY_NOTICE } from '@/lib/dispatch-pricing';
import { track } from '@/lib/track';

const exampleBaseCents = 200_000;
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const feeExamples = (['box-truck', 'cargo-van', 'sprinter-van'] as const).map(id => {
  const rate = getDispatchRate(id);
  const feeCents = Math.round(exampleBaseCents * rate / 100);
  return { id, rate, equipment: EQUIPMENT_TYPES.find(equipment => equipment.id === id)?.name ?? id, feeCents, remainingCents: exampleBaseCents - feeCents };
});

const pricingFaqs = [
  { id: 1, question: 'How much does Rai Dispatch charge?', answer: DISPATCH_FEES_ANSWER },
  { id: 2, question: 'Is there a setup fee or any other Rai Dispatch charge?', answer: 'No. Your equipment specific percentage dispatch fee is our only charge. There are no setup fees or other Rai Dispatch fees. Confirm your equipment category, billing base and invoice schedule in writing before starting.' },
  { id: 3, question: 'What is the rate for a truck type not listed?', answer: OTHER_EQUIPMENT_NOTICE },
  { id: 4, question: 'Do you offer a fixed weekly or monthly plan?', answer: `No. ${DISPATCH_FEE_POLICY}` },
  { id: 5, question: 'Do I pay on loads I book myself?', answer: 'The advertised percentage applies to loads we book for you. Confirm how self booked freight, cancelled loads, detention, layover, and other accessorial payments are treated in your signed agreement.' },
  { id: 6, question: 'Does a dispatch fee guarantee profit or a certain number of loads?', answer: 'No. Freight rates, available loads, operating costs, and your weekly revenue vary. You decide which loads to accept and remain responsible for evaluating the costs of your trucking operation.' },
  { id: 7, question: 'Is a dedicated truck dispatcher included?', answer: 'Yes. Clients receive a dedicated truck dispatcher for their agreed load search, rate negotiation, booking coordination and broker communication. Active carriers receive 24/7 live dispatch support. Confirm your assigned contact, team coverage and escalation process during onboarding.' },
];

export default function PricingPageClient() {
  return <>
    <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden">
      <StaticPhoto src={MEDIA.heroVideo.poster} alt="" fill priority sizes="100vw" className="object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />
      <div className="container-custom relative z-10"><p className="eyebrow">Transparent truck dispatch pricing</p><h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-tight mb-5 max-w-3xl">Truck dispatch fees by equipment</h1><p id="answer-block" className="text-white/80 text-lg leading-8 max-w-3xl mb-8">{DISPATCH_FEES_ANSWER}</p><a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'pricing_hero' })} className="btn-primary"><Phone className="w-5 h-5" aria-hidden="true" />Discuss your dispatch rate</a></div>
    </section>
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-2xl mb-8"><p className="eyebrow">Full service. Clear terms.</p><h2 className="section-heading mb-4">A dispatch partner for your next load.</h2><p className="text-surface-700 text-lg">Load search, rate negotiation, broker communication, lane planning, and paperwork support with an agreed percentage fee.</p></div>
        <div className="mb-8 rounded-lg border border-primary-200 bg-primary-50 p-5 sm:p-6" aria-labelledby="box-truck-pricing-heading">
          <h3 id="box-truck-pricing-heading" className="text-2xl text-navy-950"><Link href="/equipment/box-truck" className="underline decoration-primary-300 underline-offset-4 hover:text-primary-700">Box truck dispatch</Link>: {getDispatchRateLabel('box-truck')} fee</h3>
          <p className="mt-3 max-w-3xl leading-7 text-surface-700">{getEquipmentFeeStatement('box-truck')}</p>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-surface-700">{DISPATCH_FEE_POLICY}</p>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-surface-700">Last reviewed <time dateTime="2026-10-31">October 31, 2026</time>.</p>
        </div>
        <PricingTable />
      </div>
    </section>
    <section className="section-padding bg-surface-50">
      <div id="fee-calculator" className="container-custom mb-12 scroll-mt-28"><FeeCalculator /></div>
      <div className="container-custom grid lg:grid-cols-2 gap-10">
        <div className="min-w-0">
          <p className="eyebrow">Understand the numbers</p>
          <h2 className="section-heading mb-5">Calculate the fee for your truck.</h2>
          <p className="text-surface-700 text-lg leading-relaxed mb-5">Multiply the agreed gross load revenue by your equipment percentage. Each example below uses one hypothetical load with a $2,000 billing base; the balance is before fuel, insurance, truck payments, factoring, taxes and other expenses.</p>
          <div className="max-w-full overflow-x-auto rounded-lg border border-surface-300 bg-white mb-5" role="region" aria-label="Illustrative fee comparison" tabIndex={0}>
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="px-4 py-3 bg-surface-100 text-left font-semibold">Compare fees on one hypothetical $2,000 load</caption>
              <thead><tr><th scope="col" className="p-4">Equipment</th><th scope="col" className="p-4">Percentage</th><th scope="col" className="p-4">Dispatch fee (USD)</th><th scope="col" className="p-4">Revenue after dispatch fee, before operating costs (USD)</th></tr></thead>
              <tbody>{feeExamples.map(row => <tr key={row.id} className="border-t border-surface-200"><th scope="row" className="p-4 font-medium"><Link href={`/equipment/${row.id}`} className="underline underline-offset-4">{row.equipment}</Link></th><td className="p-4">{row.rate}%</td><td className="p-4">{dollars.format(row.feeCents / 100)}</td><td className="p-4">{dollars.format(row.remainingCents / 100)}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="text-surface-700 mb-5">{VAN_CATEGORY_NOTICE} <Link href="/equipment/cargo-van" className="text-primary-700 underline underline-offset-4">Cargo van dispatch: {getDispatchRateLabel('cargo-van')}</Link> · <Link href="/equipment/sprinter-van" className="text-primary-700 underline underline-offset-4">Sprinter van dispatch: {getDispatchRateLabel('sprinter-van')}</Link></p>
          <p className="text-surface-700 mb-5">These are fee calculations, not load offers or earnings forecasts.</p>
          <Link href="/resources/truck-dispatch-fees" className="inline-flex items-center gap-2 text-primary-700 font-semibold py-2">Read the dispatch fee guide<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
        <div className="card min-w-0 p-7"><h3 className="font-display text-3xl font-bold text-navy-950 mb-5">Confirm these details in writing.</h3><ul className="space-y-4">{['Your equipment percentage and what revenue it applies to.', 'Your dedicated dispatcher, included services and operating lanes.', 'Invoice timing and payment arrangements.', 'How accessorial payments and cancelled loads are treated.', 'Notice requirements and any outstanding balances.'].map(item => <li key={item} className="flex gap-3 text-surface-700"><CheckCircle className="w-5 h-5 shrink-0 text-primary-600 mt-0.5" aria-hidden="true" />{item}</li>)}</ul></div>
      </div>
    </section>
    <section className="section-padding bg-white"><div className="container-custom"><p className="eyebrow">Pricing questions</p><h2 className="section-heading mb-10">Dispatch costs, explained.</h2><FAQAccordion faqs={pricingFaqs} columns={2} /></div></section>
    <section className="section-padding bg-navy-950 text-white"><div className="container-custom text-center"><h2 className="font-display text-4xl font-bold mb-5">Get a clear quote for your truck.</h2><p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Tell us your equipment, authority, home base, and preferred lanes. We will review fit and explain the rate before you commit.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><a href={BUSINESS.phoneHref} onClick={() => track('call_click',{ location: 'pricing_final_cta' })} className="btn-primary"><Phone className="w-5 h-5" aria-hidden="true" />{BUSINESS.phone}</a><Link href="/contact" className="btn-ghost-light">Request a callback<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div></div></section>
  </>;
}
