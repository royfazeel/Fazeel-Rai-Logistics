'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { FAQAccordion, PricingTable } from '@/components';
import { BUSINESS, MEDIA } from '@/lib/constants';
import { track } from '@/lib/track';

const pricingFaqs = [
  { id: 1, question: 'How much does Rai Dispatch charge?', answer: 'Our percentage dispatch fee is up to 5% of gross revenue on loads we dispatch. Confirm your exact rate, included services, fee basis, and invoice schedule in writing before starting.' },
  { id: 2, question: 'Is there a setup fee?', answer: 'There is no setup fee. Before signing, review the dispatch agreement for billing terms, notice requirements, and any outstanding-payment obligations.' },
  { id: 3, question: 'Is the percentage the same for all truck types?', answer: 'The maximum percentage fee is 5% for our supported dry van, reefer, flatbed, box truck, power only, step deck, hotshot, and cargo or Sprinter van operations. Your equipment, broker eligibility, and lane needs are reviewed before service begins.' },
  { id: 4, question: 'Do you offer a fixed weekly or monthly plan?', answer: 'You can ask the dispatch desk about an alternative fixed-fee arrangement. Any fixed weekly or monthly fee, service scope, and billing conditions must be separately quoted and agreed in writing.' },
  { id: 5, question: 'Do I pay on loads I book myself?', answer: 'The advertised percentage applies to loads we dispatch. Confirm how self-booked freight, cancelled loads, detention, layover, and other accessorial payments are treated in your signed agreement.' },
  { id: 6, question: 'Does a dispatch fee guarantee profit or a certain number of loads?', answer: 'No. Freight rates, available loads, operating costs, and your weekly revenue vary. You decide which loads to accept and remain responsible for evaluating the costs of your trucking operation.' },
];

export default function PricingPageClient() {
  return <>
    <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden">
      <Image src={MEDIA.heroVideo.poster} alt="" fill priority sizes="100vw" className="object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />
      <div className="container-custom relative z-10"><p className="eyebrow">Transparent truck dispatch pricing</p><h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-tight mb-5 max-w-3xl">Truck dispatch service fees up to <span className="text-primary-400">5%.</span></h1><p className="text-white/80 text-lg max-w-2xl mb-8">Full-service dispatch for owner-operators and fleets in the 48 contiguous states. No setup fee. You approve the loads. Know your rate before the first booking.</p><a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'pricing_hero' })} className="btn-primary"><Phone className="w-5 h-5" aria-hidden="true" />Discuss your dispatch rate</a></div>
    </section>
    <section className="section-padding bg-white"><div className="container-custom"><div className="max-w-2xl mb-10"><p className="eyebrow">Full service. Clear terms.</p><h2 className="section-heading mb-4">A dispatch partner for your next load.</h2><p className="text-surface-700 text-lg">Load search, rate negotiation, broker communication, lane planning, and paperwork support with an agreed percentage fee.</p></div><PricingTable /></div></section>
    <section className="section-padding bg-surface-50"><div className="container-custom grid lg:grid-cols-2 gap-10"><div><p className="eyebrow">Understand the numbers</p><h2 className="section-heading mb-5">How a 5% dispatch fee works.</h2><p className="text-surface-700 text-lg leading-relaxed mb-5">For an illustrative $2,000 load at a 5% dispatch rate, the dispatch fee is $100. The remaining $1,900 is before fuel, insurance, truck payments, taxes, factoring, and other operating expenses.</p><p className="text-surface-600 mb-5">This example explains the fee. It is not a load offer or an earnings forecast.</p><Link href="/resources/truck-dispatch-fees" className="inline-flex items-center gap-2 text-primary-700 font-semibold py-2">Read the dispatch fee guide<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div><div className="card p-7"><h3 className="font-display text-3xl font-bold text-navy-950 mb-5">Confirm these details in writing.</h3><ul className="space-y-4">{['Your exact percentage and what revenue it applies to.', 'Included services, equipment, and operating lanes.', 'Invoice timing and payment arrangements.', 'How accessorial payments and cancelled loads are treated.', 'Notice requirements and any outstanding balances.'].map(item => <li key={item} className="flex gap-3 text-surface-700"><CheckCircle className="w-5 h-5 shrink-0 text-primary-600 mt-0.5" aria-hidden="true" />{item}</li>)}</ul></div></div></section>
    <section className="section-padding bg-white"><div className="container-custom"><p className="eyebrow">Pricing questions</p><h2 className="section-heading mb-10">Dispatch costs, explained.</h2><FAQAccordion faqs={pricingFaqs} columns={2} /></div></section>
    <section className="section-padding bg-navy-950 text-white"><div className="container-custom text-center"><h2 className="font-display text-4xl font-bold mb-5">Get a clear quote for your truck.</h2><p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Tell us your equipment, authority, home base, and preferred lanes. We will review fit and explain the rate before you commit.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><a href={BUSINESS.phoneHref} onClick={() => track('call_click',{ location: 'pricing_final_cta' })} className="btn-primary"><Phone className="w-5 h-5" aria-hidden="true" />{BUSINESS.phone}</a><Link href="/contact" className="btn-ghost-light">Request a callback<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div></div></section>
  </>;
}
