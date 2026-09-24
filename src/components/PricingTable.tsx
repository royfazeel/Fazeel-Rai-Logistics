 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Check, ArrowRight } from 'lucide-react';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';
import QuoteModal from './QuoteModal';
import { track } from '@/lib/track';

export default function PricingTable() {
  return <div className="space-y-8">
    <PricingPreview />
    <div className="border border-surface-200 rounded-lg overflow-hidden">
      <div className="bg-navy-950 text-white px-6 py-5"><h3 className="font-display text-2xl font-bold">Dispatch fees by equipment</h3><p className="text-white/70 mt-1">The same maximum percentage across our supported truck types.</p></div>
      <div className="grid md:grid-cols-2">
        {EQUIPMENT_TYPES.map(equipment => <div key={equipment.id} className="flex items-center justify-between gap-4 px-6 py-5 border-t border-surface-200 bg-white"><Link href={`/equipment/${equipment.id}`} className="text-navy-900 font-semibold underline decoration-surface-300 underline-offset-4 hover:text-primary-600">{equipment.name}</Link><span className="font-display text-xl font-bold text-primary-700 whitespace-nowrap">{equipment.percentage}</span></div>)}
      </div>
    </div>
  </div>;
}

// Homepage pricing focuses on the percentage offer approved for the rebrand.
export function PricingPreview() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  return <>
    <div className="grid lg:grid-cols-[0.8fr_1.2fr] rounded-lg border border-surface-200 overflow-hidden shadow-soft">
      <div className="bg-navy-950 text-white p-7 md:p-10">
        <p className="font-display uppercase tracking-wider text-white/70 font-semibold mb-4">Percentage dispatch plan</p>
        <p className="font-display text-7xl font-bold leading-none mb-3"><span className="block text-2xl text-primary-400 mb-2">Up to</span>5<span className="text-primary-400">%</span></p>
        <p className="text-white/75 leading-relaxed mb-6">of gross revenue on loads we dispatch. Confirm your exact fee and billing terms before starting.</p>
        <button onClick={() => { track('quote_modal_open', { location: 'pricing_preview_percentage' }); setIsQuoteModalOpen(true); }} className="btn-primary w-full">Get your dispatch quote<ArrowRight className="w-5 h-5" aria-hidden="true" /></button>
      </div>
      <div className="bg-white p-7 md:p-10">
        <h3 className="font-display text-3xl font-bold text-navy-950 mb-5">Support from load search to delivery</h3>
        <ul className="grid sm:grid-cols-2 gap-4 mb-7">{['Load search and booking', 'Freight rate negotiation', 'Broker communication', 'Lane and route planning', 'Rate confirmations and paperwork', 'Dedicated dispatch contact'].map(feature => <li key={feature} className="flex items-start gap-2 text-navy-900"><Check className="w-5 h-5 shrink-0 text-primary-600" aria-hidden="true" />{feature}</li>)}</ul>
        <p className="text-surface-700 border-t border-surface-200 pt-5">No setup fee and no forced dispatch. You approve every load. Ask about a fixed weekly or monthly plan if that better fits your operation.</p>
        <a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'pricing_preview' })} className="inline-flex items-center gap-2 mt-5 text-primary-700 font-semibold py-2"><Phone className="w-4 h-4" aria-hidden="true" />{BUSINESS.phone}</a>
      </div>
    </div>
    <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
  </>;
}
