'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Send, Check, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';
import { track } from '@/lib/track';
import {
  formatUsPhone,
  validateName,
  validatePhone,
  validateEmail,
  validateMcNumber,
  validateRequiredSelect,
} from '@/lib/formValidation';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* Honeypot wrapper — off-screen rather than display:none, because naive bots
   skip hidden inputs but happily fill positioned ones. Never seen by humans
   (off-screen) or screen readers (aria-hidden on the wrapper). */
const honeypotWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  left: '-9999px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
};

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  mcNumber: '',
  equipment: '',
  lanes: '',
  currentStatus: '',
  factoring: '',
  message: '',
  requestCallback: false,
  company: '', // honeypot — real users never touch this
};

/**
 * QuoteModal — onboarding-grade lead capture.
 *
 * Captures the data a dispatch manager actually needs before a discovery call:
 *  - MC number (lets him pull FMCSA history before he calls back)
 *  - Factoring company (avoids surprise mid-onboarding)
 *  - Current dispatch status (new authority vs. switching from someone)
 *
 * Accessibility: proper dialog semantics, focus is moved into the panel on
 * open and restored on close, Tab is trapped inside, and Escape closes.
 */
export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Field -> validator. The API re-checks all of this server-side; these run
  // as the driver types so a typo surfaces before they tap Send.
  const validators: Record<string, (v: string) => string | null> = {
    name: validateName,
    phone: validatePhone,
    email: (v) => validateEmail(v, false),
    mcNumber: validateMcNumber,
    equipment: (v) => validateRequiredSelect(v, 'your equipment type'),
  };
  const inputIds: Record<string, string> = {
    name: 'quote-name',
    phone: 'quote-phone',
    email: 'quote-email',
    mcNumber: 'quote-mc',
    equipment: 'quote-equipment',
  };

  const valueOf = (field: string) =>
    String((formState as unknown as Record<string, unknown>)[field] ?? '');

  const runValidation = (field: string, value: string) =>
    validators[field] ? validators[field](value) : null;

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: runValidation(field, valueOf(field)) }));
  };

  /** Re-validate while typing, but only once the field has been blurred once. */
  const revalidate = (field: string, value: string) => {
    if (!touched[field]) return;
    setErrors((e) => ({ ...e, [field]: runValidation(field, value) }));
  };

  const errorFor = (field: string) => (touched[field] ? errors[field] : null) || null;
  const fieldCls = (field: string, base: string) =>
    errorFor(field) ? `${base} border-primary-500` : base;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  // Tracked so the post-success auto-close can be cancelled if the modal is
  // dismissed first — otherwise it fires against an unmounted component.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Focus management: remember the trigger, move focus into the dialog on
  // open, restore it on close, close on Escape, and trap Tab in the panel.
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // Lock the page behind the dialog so the background cannot scroll
    // under it (the Header does the same for the mobile menu).
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  // Clear any pending auto-close when the modal unmounts.
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate everything before spending a round trip, and send focus to the
    // first problem so the driver is not hunting for it on a phone.
    const nextErrors: Record<string, string | null> = {};
    const nextTouched: Record<string, boolean> = {};
    let firstBad: string | null = null;
    Object.keys(validators).forEach((field) => {
      const message = runValidation(field, valueOf(field));
      nextErrors[field] = message;
      nextTouched[field] = true;
      if (message && !firstBad) firstBad = field;
    });
    if (firstBad) {
      setErrors(nextErrors);
      setTouched((t) => ({ ...t, ...nextTouched }));
      document.getElementById(inputIds[firstBad])?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitFailed(false);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          source: 'quote_modal',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;

      if (res.ok && data?.ok === true) {
        // Google Ads counts this as the lead conversion. Fired ONLY after the
        // API confirmed the lead was actually delivered — never on a failure,
        // or the campaign optimises towards submissions nobody received.
        track('lead_submit', { source: 'quote_modal' });
        setIsSubmitted(true);

        // Auto-reset and close after the confirmation has been on screen a beat.
        closeTimer.current = setTimeout(() => {
          setIsSubmitted(false);
          setFormState(EMPTY_FORM);
          onClose();
        }, 4500);
      } else {
        // Covers 400 validation, 429, 503 not_configured, 502 delivery_failed.
        // Never claim delivery we can't stand behind — show the phone instead
        // and leave the filled-in form intact so nothing is retyped.
        setSubmitFailed(true);
      }
    } catch {
      // Network error / offline / request blocked.
      setSubmitFailed(true);
    } finally {
      // Always resolves — the user never sits on a spinner.
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors';
  const labelCls = 'block text-sm font-medium text-navy-800 mb-1.5';

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="quote-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-lg shadow-strong overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header — dark title bar */}
            <div className="bg-navy-950 px-6 py-5 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    id="quote-modal-title"
                    className="text-2xl font-display font-bold uppercase text-white"
                  >
                    Get a Free Quote
                  </h2>
                  <p className="text-white/70 text-sm mt-1">
                    No setup fees · No obligation
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-navy-950 mb-2">
                    Request sent
                  </h3>
                  <p className="text-surface-600">
                    We&apos;ve got your details. The fastest way to get set up is
                    still a quick call — dial{' '}
                    <a
                      href={BUSINESS.phoneHref}
                      onClick={() => track('call_click', { location: 'quote_modal_success' })}
                      className="text-primary-600 font-semibold"
                    >
                      {BUSINESS.phone}
                    </a>{' '}
                    or text us and we&apos;ll take it from there.
                  </p>
                </motion.div>
              ) : (
                <form noValidate onSubmit={handleSubmit} className="space-y-4">
                  {/* Spam trap — hidden from humans and assistive tech. If it
                      comes back filled, the API drops the lead silently. */}
                  <div style={honeypotWrapperStyle} aria-hidden="true">
                    <label htmlFor="quote-company">Company (leave this field empty)</label>
                    <input
                      id="quote-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    />
                  </div>

                  {/* Trust strip */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-surface-50 border border-surface-200 text-navy-800 rounded-md text-sm">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 text-primary-600" />
                    <span>We do not sell your contact details. See our <Link href="/privacy" onClick={onClose} className="underline underline-offset-2 hover:text-primary-700">Privacy Policy</Link>.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="quote-name" className={labelCls}>
                        Your Name *
                      </label>
                      <input
                        id="quote-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={formState.name}
                        onChange={(e) => {
                          setFormState({ ...formState, name: e.target.value });
                          revalidate('name', e.target.value);
                        }}
                        onBlur={() => handleBlur('name')}
                        aria-invalid={errorFor('name') ? true : undefined}
                        aria-describedby={errorFor('name') ? 'quote-name-error' : undefined}
                        className={fieldCls('name', inputCls)}
                        placeholder="John Smith"
                      />
                      {errorFor('name') && (
                        <p id="quote-name-error" role="alert" className="mt-1 text-xs font-medium text-primary-700">
                          {errorFor('name')}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="quote-phone" className={labelCls}>
                        Phone *
                      </label>
                      <input
                        id="quote-phone"
                        type="tel"
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        maxLength={14}
                        value={formState.phone}
                        onChange={(e) => {
                          const formatted = formatUsPhone(e.target.value);
                          setFormState({ ...formState, phone: formatted });
                          revalidate('phone', formatted);
                        }}
                        onBlur={() => handleBlur('phone')}
                        aria-invalid={errorFor('phone') ? true : undefined}
                        aria-describedby={errorFor('phone') ? 'quote-phone-error' : undefined}
                        className={fieldCls('phone', inputCls)}
                        placeholder="(555) 555-5555"
                      />
                      {errorFor('phone') && (
                        <p id="quote-phone-error" role="alert" className="mt-1 text-xs font-medium text-primary-700">
                          {errorFor('phone')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="quote-email" className={labelCls}>
                        Email (optional)
                      </label>
                      <input
                        id="quote-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={formState.email}
                        onChange={(e) => {
                          setFormState({ ...formState, email: e.target.value });
                          revalidate('email', e.target.value);
                        }}
                        onBlur={() => handleBlur('email')}
                        aria-invalid={errorFor('email') ? true : undefined}
                        aria-describedby={errorFor('email') ? 'quote-email-error' : undefined}
                        className={fieldCls('email', inputCls)}
                        placeholder="john@example.com"
                      />
                      {errorFor('email') && (
                        <p id="quote-email-error" role="alert" className="mt-1 text-xs font-medium text-primary-700">
                          {errorFor('email')}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="quote-mc" className={labelCls}>
                        MC Number
                      </label>
                      <input
                        id="quote-mc"
                        type="text"
                        inputMode="numeric"
                        maxLength={12}
                        value={formState.mcNumber}
                        onChange={(e) => {
                          setFormState({ ...formState, mcNumber: e.target.value });
                          revalidate('mcNumber', e.target.value);
                        }}
                        onBlur={() => handleBlur('mcNumber')}
                        aria-invalid={errorFor('mcNumber') ? true : undefined}
                        aria-describedby={errorFor('mcNumber') ? 'quote-mc-error' : undefined}
                        className={fieldCls('mcNumber', inputCls)}
                        placeholder="MC-123456"
                      />
                      {errorFor('mcNumber') && (
                        <p id="quote-mc-error" role="alert" className="mt-1 text-xs font-medium text-primary-700">
                          {errorFor('mcNumber')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quote-equipment" className={labelCls}>
                      Equipment Type *
                    </label>
                    <select
                      id="quote-equipment"
                      required
                      value={formState.equipment}
                      onChange={(e) => {
                        setFormState({ ...formState, equipment: e.target.value });
                        revalidate('equipment', e.target.value);
                      }}
                      onBlur={() => handleBlur('equipment')}
                      aria-invalid={errorFor('equipment') ? true : undefined}
                      aria-describedby={errorFor('equipment') ? 'quote-equipment-error' : undefined}
                      className={fieldCls('equipment', inputCls + ' appearance-none')}
                    >
                      <option value="">Select equipment type</option>
                      {EQUIPMENT_TYPES.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name}
                        </option>
                      ))}
                    </select>
                    {errorFor('equipment') && (
                      <p id="quote-equipment-error" role="alert" className="mt-1 text-xs font-medium text-primary-700">
                        {errorFor('equipment')}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="quote-status" className={labelCls}>
                        Current Status
                      </label>
                      <select
                        id="quote-status"
                        value={formState.currentStatus}
                        onChange={(e) =>
                          setFormState({ ...formState, currentStatus: e.target.value })
                        }
                        className={inputCls + ' appearance-none'}
                      >
                        <option value="">Select…</option>
                        <option value="new-authority">New authority</option>
                        <option value="switching">Switching dispatchers</option>
                        <option value="self-dispatch">Self-dispatching now</option>
                        <option value="exploring">Just exploring</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="quote-factoring" className={labelCls}>
                        Factoring
                      </label>
                      <select
                        id="quote-factoring"
                        value={formState.factoring}
                        onChange={(e) =>
                          setFormState({ ...formState, factoring: e.target.value })
                        }
                        className={inputCls + ' appearance-none'}
                      >
                        <option value="">Select…</option>
                        <option value="have-factoring">Have a factoring company</option>
                        <option value="no-factoring">No factoring</option>
                        <option value="need-help">Need help choosing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quote-lanes" className={labelCls}>
                      Preferred Lanes / States
                    </label>
                    <input
                      id="quote-lanes"
                      type="text"
                      value={formState.lanes}
                      onChange={(e) => setFormState({ ...formState, lanes: e.target.value })}
                      className={inputCls}
                      placeholder="e.g., TX to CA, Southeast region"
                    />
                  </div>

                  <div>
                    <label htmlFor="quote-message" className={labelCls}>
                      Anything else? (Optional)
                    </label>
                    <textarea
                      id="quote-message"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      rows={2}
                      className={inputCls + ' resize-none'}
                      placeholder="Specific goals, concerns, or questions…"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.requestCallback}
                      onChange={(e) =>
                        setFormState({ ...formState, requestCallback: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-navy-700">
                      I would prefer a callback over email
                    </span>
                  </label>

                  {submitFailed && (
                    <div
                      role="alert"
                      className="flex gap-3 rounded-md border border-primary-200 bg-primary-50 px-3 py-3"
                    >
                      <AlertTriangle
                        className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="text-sm text-navy-900">
                        <p className="font-semibold text-primary-700 mb-1">
                          We couldn&apos;t send that just now.
                        </p>
                        <p>
                          Please call{' '}
                          <a
                            href={BUSINESS.phoneHref}
                            onClick={() => track('call_click', { location: 'quote_modal_error' })}
                            className="font-semibold text-primary-700 underline underline-offset-2"
                          >
                            {BUSINESS.phone}
                          </a>{' '}
                          or{' '}
                          <a
                            href={BUSINESS.smsHref}
                            className="font-semibold text-primary-700 underline underline-offset-2"
                          >
                            text us
                          </a>{' '}
                          and we&apos;ll get you set up.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-md transition-colors disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {isSubmitting ? 'Sending…' : 'Send Request'}
                    </button>
                    <a
                      href={BUSINESS.phoneHref}
                      onClick={() => track('call_click', { location: 'quote_modal_call_instead' })}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-navy-900 font-semibold rounded-md border border-surface-300 hover:border-navy-400 hover:bg-surface-50 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Call Instead
                    </a>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
