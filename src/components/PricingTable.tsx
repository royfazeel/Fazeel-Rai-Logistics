'use client';

import { createContext, useContext, useLayoutEffect, useRef, useState, useCallback } from 'react';
import dynamic, { type DynamicOptionsLoadingProps } from 'next/dynamic';
import Link from 'next/link';
import { Phone, Check, ArrowRight } from 'lucide-react';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';
import { DEFAULT_DISPATCH_RATE, DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import { track } from '@/lib/track';

const QuoteCloseContext = createContext<(() => void) | null>(null);

function QuoteModalLoading({ error, retry }: DynamicOptionsLoadingProps) {
  const onClose = useContext(QuoteCloseContext);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // The native dialog traps focus and supports Escape while the form loads.
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return <dialog
    ref={dialogRef}
    aria-labelledby="quote-loading-title"
    onCancel={event => { event.preventDefault(); onClose?.(); }}
    className="m-auto rounded-lg bg-white p-6 text-navy-950 shadow-strong backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm"
    style={{ width: 'min(32rem, calc(100% - 2rem))' }}
  >
    <h2 id="quote-loading-title" className="font-display text-2xl font-bold">Get a Free Quote</h2>
    <p role={error ? 'alert' : 'status'} className="my-4 text-surface-700">{error ? 'The quote form could not load. Please try again or call us.' : 'Loading your quote form…'}</p>
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => onClose?.()} className="btn-primary">Close quote form</button>
      {error && retry ? <button type="button" onClick={retry} className="btn-secondary">Try again</button> : null}
      {error ? <a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'quote_modal_loading_error' })} className="inline-flex items-center font-semibold text-primary-700">{BUSINESS.phone}</a> : null}
    </div>
  </dialog>;
}

const QuoteModal = dynamic(() => import('./QuoteModal'), {
  ssr: false,
  loading: QuoteModalLoading,
});

// Shared by the homepage and pricing preview; mount only after a quote request.
export function DeferredQuoteModal({ onClose }: { onClose: () => void }) {
  const [returnFocusTo] = useState(() => typeof document === 'undefined' ? null : document.activeElement as HTMLElement | null);
  return <QuoteCloseContext.Provider value={onClose}>
    <QuoteModal isOpen onClose={onClose} returnFocusTo={returnFocusTo} />
  </QuoteCloseContext.Provider>;
}

export default function PricingTable() {
  return <div className="space-y-8">
    <PricingPreview />
    <div className="border border-surface-200 rounded-lg overflow-hidden">
      <div className="bg-navy-950 text-white px-6 py-5"><h3 className="font-display text-2xl font-bold">Dispatch fees by equipment</h3><p className="text-white/80 mt-1">Published fees are {DISPATCH_RATE_RANGE}, based on your truck type. A dedicated dispatcher is included.</p></div>
      <table className="w-full text-left">
        <caption className="sr-only">Dispatch percentage of gross revenue on loads we dispatch</caption>
        <thead className="bg-surface-50"><tr><th scope="col" className="px-6 py-4 font-semibold">Truck or trailer type</th><th scope="col" className="px-6 py-4 font-semibold text-right">Dispatch fee</th></tr></thead>
        <tbody>
          {EQUIPMENT_TYPES.map(equipment => <tr key={equipment.id} className="border-t border-surface-200 bg-white"><th scope="row" className="px-6 py-5"><Link href={`/equipment/${equipment.id}`} className="text-navy-900 font-semibold underline decoration-surface-300 underline-offset-4 hover:text-primary-600">{equipment.name}</Link></th><td className="px-6 py-5 font-display text-xl font-bold text-primary-700 text-right whitespace-nowrap">{equipment.percentage}</td></tr>)}
          <tr className="border-t border-surface-200 bg-surface-50"><th scope="row" className="px-6 py-5 text-navy-900 font-semibold">All other truck types</th><td className="px-6 py-5 font-display text-xl font-bold text-primary-700 text-right">{DEFAULT_DISPATCH_RATE}%</td></tr>
        </tbody>
      </table>
      <p className="px-6 py-5 border-t border-surface-200 text-sm leading-relaxed text-surface-700">Percentages apply to gross revenue on loads we dispatch. Equipment and service availability are reviewed before onboarding. Confirm the billing base and scope in your agreement.</p>
    </div>
  </div>;
}

// This summary is shared by the homepage and the detailed pricing page.
export function PricingPreview() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const closeQuoteModal = useCallback(() => setIsQuoteModalOpen(false), []);
  return <>
    <div className="grid lg:grid-cols-[0.8fr_1.2fr] rounded-lg border border-surface-200 overflow-hidden shadow-soft">
      <div className="bg-navy-950 text-white p-7 md:p-10">
        <p className="font-display uppercase tracking-wider text-white/70 font-semibold mb-4">Percentage dispatch plan</p>
        <p className="font-display text-7xl font-bold leading-none mb-3">{DISPATCH_RATE_RANGE}</p>
        <p className="text-white/80 leading-relaxed mb-6">of gross revenue on loads we dispatch, based on truck type. Confirm your equipment rate and billing terms before starting.</p>
        <a
          href="/contact#contact-form"
          onClick={event => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            track('quote_modal_open', { location: 'pricing_preview_percentage' });
            setIsQuoteModalOpen(true);
          }}
          className="btn-primary w-full"
        >Get your dispatch quote<ArrowRight className="w-5 h-5" aria-hidden="true" /></a>
      </div>
      <div className="bg-white p-7 md:p-10">
        <h3 className="font-display text-3xl font-bold text-navy-950 mb-5">Support from load search to delivery</h3>
        <ul className="grid sm:grid-cols-2 gap-4 mb-7">{['Dedicated truck dispatcher', 'Load search and booking', 'Freight rate negotiation', 'Broker communication', 'Lane and route planning', 'Rate confirmations and paperwork'].map(feature => <li key={feature} className="flex items-start gap-2 text-navy-900"><Check className="w-5 h-5 shrink-0 text-primary-600" aria-hidden="true" />{feature}</li>)}</ul>
        <p className="text-surface-700 border-t border-surface-200 pt-5">No setup fee and no forced dispatch. You approve every load. Ask about a fixed weekly or monthly plan if that better fits your operation.</p>
        <a href={BUSINESS.phoneHref} onClick={() => track('call_click', { location: 'pricing_preview' })} className="inline-flex items-center gap-2 mt-5 text-primary-700 font-semibold py-2"><Phone className="w-4 h-4" aria-hidden="true" />{BUSINESS.phone}</a>
      </div>
    </div>
    {isQuoteModalOpen ? <DeferredQuoteModal onClose={closeQuoteModal} /> : null}
  </>;
}
