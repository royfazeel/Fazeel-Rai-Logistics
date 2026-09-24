'use client';

import { DEFAULT_DISPATCH_RATE, DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Box, CheckCircle, Container, Package, Phone, Snowflake, Truck } from 'lucide-react';
import { BUSINESS, EQUIPMENT_TYPES, MEDIA } from '@/lib/constants';
import { track } from '@/lib/track';

const equipmentIcons: Record<string, React.ElementType> = {
  'box-truck': Box, 'dry-van': Container, reefer: Snowflake,
  flatbed: Truck, 'power-only': Package, 'step-deck': Truck,
  hotshot: Truck, 'cargo-van': Box,
};

export default function EquipmentPageClient() {
  return <>
    <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden">
      <Image src={MEDIA.heroVideo.poster} alt="" fill priority sizes="100vw" className="object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />
      <div className="container-custom relative z-10">
        <p className="eyebrow">Equipment we dispatch</p>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[1.02] tracking-tight mb-5 max-w-3xl">Truck dispatch services for your equipment</h1>
        <p className="text-white/80 text-lg max-w-2xl mb-8">Dry van, reefer, flatbed, box truck, power only, step deck, hotshot, and cargo van dispatch across the 48 contiguous states. Work with a dedicated dispatcher at {DISPATCH_RATE_RANGE} fees based on equipment.</p>
        <a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'equipment_hero' })} className="btn-primary"><Phone className="w-5 h-5" aria-hidden="true" />Talk about your truck</a>
      </div>
    </section>
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mb-10"><p className="eyebrow">Choose your truck or trailer</p><h2 className="section-heading mb-4">The right load starts with the right fit.</h2><p className="text-surface-700 text-lg">Equipment dimensions, payload, insurance, operating authority, and driver availability all matter. Explore what we review and how we plan freight for each type.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EQUIPMENT_TYPES.map(equipment => {
            const Icon = equipmentIcons[equipment.id] || Truck;
            return <article key={equipment.id} id={equipment.id} className="card p-6 flex flex-col scroll-mt-24">
              <div className="flex justify-between items-start gap-3 mb-5"><Icon className="w-9 h-9 text-primary-600" aria-hidden="true" /><p className="font-display text-xl font-bold text-primary-700">{equipment.percentage}<span className="block text-xs font-sans font-normal text-surface-600 text-right">dispatch fee</span></p></div>
              <h2 className="font-display text-3xl font-bold text-navy-950 mb-3"><Link href={`/equipment/${equipment.id}`} className="hover:text-primary-600">{equipment.name}</Link></h2>
              <p className="text-surface-700 leading-relaxed mb-5">{equipment.description}</p>
              <ul className="space-y-2 mb-6">{equipment.benefits.map(benefit => <li key={benefit} className="flex items-start gap-2 text-surface-700"><CheckCircle className="w-4 h-4 text-primary-600 shrink-0 mt-1" aria-hidden="true" />{benefit}</li>)}</ul>
              <Link href={`/equipment/${equipment.id}`} className="mt-auto inline-flex items-center gap-2 font-semibold text-primary-700 py-2">Explore {equipment.name.toLowerCase()} dispatch<ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" /></Link>
            </article>;
          })}
        </div>
        <p className="mt-8 text-surface-700 leading-relaxed">Other truck types have a {DEFAULT_DISPATCH_RATE}% dispatch fee. Share your equipment details so we can confirm service fit and assign your dedicated dispatcher.</p>
      </div>
    </section>
    <section className="section-padding bg-surface-50">
      <div className="container-custom grid lg:grid-cols-2 gap-10">
        <div><p className="eyebrow">Before we book</p><h2 className="section-heading mb-5">Tell us what your truck can carry.</h2><p className="text-surface-700 text-lg mb-6">A truck category alone is not enough to match a load. Send your usable dimensions, payload, trailer features, operating radius, and preferred schedule. For open-deck or expedited freight, discuss securement, tarps, ramps, and any special requirements.</p><Link href="/resources/carrier-onboarding-checklist" className="inline-flex items-center gap-2 text-primary-700 font-semibold py-2">See the onboarding checklist<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div>
        <div className="card p-7"><h3 className="font-display text-2xl font-bold text-navy-950 mb-4">A clear load decision</h3><ul className="space-y-4 text-surface-700">{['Review authority, insurance, and broker eligibility.', 'Match weight, dimensions, loading method, and equipment.', 'Discuss rate, empty miles, appointments, and accessorial terms.', 'Get your approval before booking.'].map((item,i) => <li key={item} className="flex gap-3"><span className="text-primary-600 font-bold">0{i+1}</span>{item}</li>)}</ul><p className="text-sm text-surface-600 mt-6 border-t border-surface-200 pt-5">Load availability and freight rates vary. Specialized, oversize, and regulated loads require separate eligibility and permit review; carriers remain responsible for safe, compliant operations.</p></div>
      </div>
    </section>
    <section className="section-padding bg-navy-950 text-white"><div className="container-custom text-center"><h2 className="font-display text-4xl font-bold mb-5">Find dispatch support for your operation.</h2><p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Discuss your equipment and lanes with our dispatch desk. We will confirm fit, pricing, and next steps.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><a href={BUSINESS.phoneHref} className="btn-primary" onClick={() => track('call_click',{ location: 'equipment_final_cta' })}><Phone className="w-5 h-5" aria-hidden="true" />{BUSINESS.phone}</a><Link href="/pricing" className="btn-ghost-light">View dispatch pricing<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div></div></section>
  </>;
}
