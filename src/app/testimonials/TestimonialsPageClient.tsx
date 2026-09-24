'use client';

import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { track } from '@/lib/track';

export default function TestimonialsPageClient() {
  return <>
    <section className="bg-navy-950 text-white py-16 sm:py-20"><div className="container-custom"><p className="eyebrow">The carrier experience</p><h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-tight mb-5 max-w-3xl">What to expect from Rai Dispatch</h1><p className="text-white/80 text-lg max-w-2xl">Choosing a dispatcher starts with clear expectations. Here is how we approach communication, load approval, pricing, and paperwork with owner-operators and small fleets.</p></div></section>
    <section className="section-padding bg-white"><div className="container-custom"><div className="grid md:grid-cols-2 gap-6">{[
      { title: 'Your approval comes first', text: 'Review a load’s rate, route, appointments, and equipment requirements before deciding. Your dispatcher books freight you approve.' },
      { title: 'Understand the fee', text: `Dispatch fees are ${DISPATCH_RATE_RANGE}, based on equipment. Confirm your equipment rate, gross-revenue basis, billing schedule, and cancellation terms in your agreement.` },
      { title: 'Your dedicated dispatcher', text: 'Work with a dedicated dispatcher who knows your equipment, lanes, and schedule. Agree on contact details, update preferences, and support hours during onboarding.' },
      { title: 'Practical load support', text: 'Get help with load search, rate negotiation, broker communication, route planning, rate confirmations, and delivery paperwork.' },
    ].map(item => <article key={item.title} className="card p-7"><CheckCircle className="w-8 h-8 text-primary-600 mb-4" aria-hidden="true" /><h2 className="font-display text-3xl font-bold text-navy-950 mb-3">{item.title}</h2><p className="text-surface-700 leading-relaxed">{item.text}</p></article>)}</div><div className="mt-10 p-7 bg-surface-50 border border-surface-200 rounded-lg"><h2 className="font-display text-3xl font-bold text-navy-950 mb-3">Ask the questions that matter to your truck.</h2><p className="text-surface-700 max-w-3xl mb-5">Discuss your preferred lanes, home time, operating costs, authority, and insurance before starting. Freight availability and carrier results vary; no specific load rate or weekly revenue is guaranteed.</p><Link href="/resources/how-to-choose-a-truck-dispatcher" className="inline-flex gap-2 items-center text-primary-700 font-semibold">Read our dispatcher selection guide<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div></div></section>
    <section className="section-padding bg-navy-950 text-white"><div className="container-custom text-center"><h2 className="font-display text-4xl font-bold mb-5">Talk through your dispatch needs.</h2><a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'carrier_experience_cta' })} className="btn-primary"><Phone className="w-5 h-5" aria-hidden="true" />{BUSINESS.phone}</a></div></section>
  </>;
}
