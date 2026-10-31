'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CONSENT_STORAGE_KEY, DENIED_CHOICES, MEASUREMENT_CONFIG, consentPreference, parseConsentPreference, type ConsentChoices } from '@/lib/consent-measurement';
import { getMeasurement } from '@/lib/track';

/** Mount once after Footer. No UI or provider loads unless explicitly configured and enabled. */
export function ConsentMeasurement() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(DENIED_CHOICES);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!MEASUREMENT_CONFIG.enabled) return;
    let saved = null;
    try { saved = parseConsentPreference(localStorage.getItem(CONSENT_STORAGE_KEY)); } catch { /* Denied until a choice can be stored. */ }
    setChoices(saved || DENIED_CHOICES);
    setOpen(!saved);
    setReady(true);
    getMeasurement()?.apply(saved || DENIED_CHOICES);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
      const next = parseConsentPreference(event.newValue);
      setChoices(next || DENIED_CHOICES);
      setOpen(!next);
      getMeasurement()?.apply(next || DENIED_CHOICES);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => { if (ready) getMeasurement()?.pageView(); }, [pathname, ready]);
  useEffect(() => {
    if (!ready || !dialog.current) return;
    if (open && !dialog.current.open) dialog.current.showModal();
    if (!open && dialog.current.open) dialog.current.close();
  }, [open, ready]);

  if (!MEASUREMENT_CONFIG.enabled || !ready) return null;

  const save = (next: ConsentChoices) => {
    const allowed = { analytics: next.analytics && Boolean(MEASUREMENT_CONFIG.gaId), ads: next.ads && Boolean(MEASUREMENT_CONFIG.adsId) };
    try { localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentPreference(allowed))); }
    catch {
      // Fail closed: do not enable collection if a preference cannot be saved.
      getMeasurement()?.apply(DENIED_CHOICES, false);
      setChoices(DENIED_CHOICES);
      setError('Your browser could not save this choice. Optional measurement is off for this page. Check browser storage settings to save your preference for future visits.');
      return;
    }
    setChoices(allowed);
    setError('');
    setOpen(false);
    getMeasurement()?.apply(allowed);
  };
  const providerCount = Number(Boolean(MEASUREMENT_CONFIG.gaId)) + Number(Boolean(MEASUREMENT_CONFIG.adsId));
  const intro = providerCount === 2
    ? 'Choose whether Google may measure website use or advertising results. Both options are off until you choose.'
    : MEASUREMENT_CONFIG.gaId
      ? 'Choose whether Google Analytics may measure website use. Analytics is off until you choose.'
      : 'Choose whether Google Ads may measure advertising results. Advertising measurement is off until you choose.';
  const acceptLabel = providerCount === 2 ? 'Accept all' : MEASUREMENT_CONFIG.gaId ? 'Accept analytics' : 'Accept advertising measurement';
  const button = 'min-h-[44px] rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700';
  return <>
    <div className="bg-navy-950 px-4 pb-24 pt-3 text-center lg:pb-5">
      <button type="button" className="min-h-[44px] px-4 text-sm text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" onClick={() => {
        try { setChoices(parseConsentPreference(localStorage.getItem(CONSENT_STORAGE_KEY)) || DENIED_CHOICES); } catch { setChoices(DENIED_CHOICES); }
        setError('');
        setOpen(true);
      }}>Measurement settings</button>
    </div>
    <dialog ref={dialog} aria-labelledby="measurement-title" aria-describedby="measurement-description" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} className="w-[calc(100%-2rem)] max-w-lg max-h-[85dvh] overflow-y-auto rounded-xl bg-white p-5 text-slate-900 shadow-2xl backdrop:bg-navy-950/70 sm:p-7">
      <h2 id="measurement-title" className="text-xl font-bold">Optional website measurement</h2>
      <p id="measurement-description" className="mt-3 text-sm leading-relaxed">{intro} Contact forms and links work either way.</p>
      <div className="my-5 space-y-4">
        {MEASUREMENT_CONFIG.gaId && <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-300 p-3"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary-700" checked={choices.analytics} onChange={event => setChoices({ ...choices, analytics: event.target.checked })} /><span><strong className="block text-sm">Analytics</strong><span className="mt-1 block text-sm leading-relaxed">Google Analytics cookies measure visits, accepted inquiry forms and contact-link clicks. Clicks do not confirm a call or message took place.</span></span></label>}
        {MEASUREMENT_CONFIG.adsId && <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-300 p-3"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary-700" checked={choices.ads} onChange={event => setChoices({ ...choices, ads: event.target.checked })} /><span><strong className="block text-sm">Advertising measurement</strong><span className="mt-1 block text-sm leading-relaxed">Google Ads cookies and ad-click identifiers help attribute accepted inquiry forms to advertising. Personalized advertising is disabled.</span></span></label>}
      </div>
      <p className="text-sm leading-relaxed">Your choices are saved in this browser separately from inquiry information. We do not send form names, phone numbers, email addresses or message text in measurement events. You can change or withdraw consent using Measurement settings at the bottom of any page. Withdrawing a choice reloads this page.</p>
      <Link href="/privacy" onClick={() => setOpen(false)} className="my-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary-700 underline">Read the privacy policy</Link>
      {error && <p role="alert" className="mb-4 text-sm text-red-800">{error}</p>}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button type="button" className={button} onClick={() => save(DENIED_CHOICES)}>Reject all</button>
        <button type="button" className={button} onClick={() => save(choices)}>Save choices</button>
        <button type="button" className={button} onClick={() => save({ analytics: true, ads: true })}>{acceptLabel}</button>
      </div>
    </dialog>
  </>;
}
