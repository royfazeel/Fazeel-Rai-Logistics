'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Send,
  Truck,
  Loader2,
  Check,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';

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

/**
 * LeadCapturePopup — a one-time conversion popup designed to catch visitors
 * who are about to leave without contacting a dispatcher.
 *
 * Trigger logic (whichever fires first):
 *   - Desktop: mouseleave at the top of viewport (classic exit-intent)
 *   - Mobile (no mouse): show after 18 seconds of engaged time
 *   - Suppressed entirely if:
 *       a) sessionStorage flag set (already dismissed/seen this session)
 *       b) user is on /privacy or /terms (legal pages — never interrupt)
 *       c) user is scrolling actively (heuristic — interrupting scroll = bad UX)
 *
 * Why sessionStorage and not localStorage:
 *   localStorage would suppress the popup forever after one dismissal, which
 *   is too aggressive. sessionStorage resets when the browser tab closes, so
 *   returning visitors who didn't convert get one more shot.
 *
 * Form fields are deliberately minimal: Name, Phone, Truck Type, MC# (optional).
 * Lower friction = higher submission rate. The full intake happens on the call.
 */
export default function LeadCapturePopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    equipment: '',
    mcNumber: '',
    company: '', // honeypot — real users never touch this
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Tracked so the post-success auto-close can be cancelled on unmount.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Legal pages are never interrupted. Derived from the live pathname so
  // client-side navigation in/out of them is handled correctly (the layout
  // renders this component once — it never re-mounts between routes).
  const onLegalPage =
    pathname?.startsWith('/privacy') || pathname?.startsWith('/terms');

  // Suppress if already dismissed this session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('rai_lead_popup_seen') === '1') {
      setHasShown(true);
    }
  }, []);

  // Detect if device is touch-only (no mouse → no exit intent possible)
  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  };

  // Trigger logic
  useEffect(() => {
    if (hasShown) return;
    if (onLegalPage) return; // re-runs when pathname changes
    if (typeof window === 'undefined') return;

    const touch = isTouchDevice();

    // Track scroll activity — suppress popup if user is actively scrolling
    let lastScrollAt = Date.now();
    const onScroll = () => {
      lastScrollAt = Date.now();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const trigger = () => {
      // Wait until the user has stopped scrolling for at least 500ms
      if (Date.now() - lastScrollAt < 500) return;
      if (hasShown) return;
      setIsOpen(true);
      setHasShown(true);
      try {
        sessionStorage.setItem('rai_lead_popup_seen', '1');
      } catch {
        /* sessionStorage can throw in private modes — fail silently */
      }
    };

    // Desktop exit intent — mouseleave at the top of viewport
    let mouseHandler: ((e: MouseEvent) => void) | null = null;
    if (!touch) {
      mouseHandler = (e: MouseEvent) => {
        // Only fire if cursor leaves through the top edge (going to tabs/URL)
        if (e.clientY <= 0) trigger();
      };
      document.addEventListener('mouseleave', mouseHandler);
    }

    // Time-based fallback — fires on both desktop and mobile.
    // Mobile is the primary path (no mouse), desktop gets it as a backup if
    // user never moves to the top.
    const timer = setTimeout(trigger, touch ? 18000 : 28000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (mouseHandler) document.removeEventListener('mouseleave', mouseHandler);
      clearTimeout(timer);
    };
  }, [hasShown, onLegalPage]);

  // Focus management while open: move focus in, trap Tab, close on Escape,
  // restore focus to whatever had it before the popup appeared.
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
        setIsOpen(false);
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
  }, [isOpen]);

  // Clear any pending auto-close when the component unmounts.
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitFailed(false);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          // Tags the lead so popup conversions can be tracked separately.
          source: 'exit_intent_popup',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;

      if (res.ok && data?.ok === true) {
        setIsSubmitted(true);
        closeTimer.current = setTimeout(() => {
          setIsOpen(false);
        }, 4000);
      } else {
        // Covers 400 validation, 429, 503 not_configured, 502 delivery_failed.
        // Never claim delivery we can't stand behind — show the phone instead.
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

  // NOTE: no early return here — AnimatePresence must stay mounted so the
  // exit animation can play when isOpen flips to false.
  const inputCls =
    'w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-base';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="lead-popup"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-popup-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white rounded-lg shadow-strong overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            {/* Header — dark title bar with truck icon */}
            <div className="relative bg-navy-950 px-6 pt-7 pb-6 text-white">
              <button
                onClick={handleClose}
                /* z-10 is load-bearing: the sibling content div below is positioned,
                   so without it that div paints over this button and swallows
                   the click. */
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-navy-900 border border-white/10 rounded-md mb-3">
                  <Truck className="w-6 h-6 text-primary-500" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <h2
                  id="lead-popup-title"
                  className="font-display text-2xl font-bold uppercase leading-tight mb-1.5"
                >
                  Need Loads for Your Truck?
                </h2>
                <p className="text-white/70 text-sm">
                  Talk to a dispatch manager — no setup fees, no long contracts.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-950 mb-1.5">
                    Got it
                  </h3>
                  <p className="text-surface-600 text-sm">
                    Your details are with us. The fastest way to get set up is
                    still a quick call:{' '}
                    <a href={BUSINESS.phoneHref} className="text-primary-600 font-semibold">
                      {BUSINESS.phone}
                    </a>
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Spam trap — hidden from humans and assistive tech. If it
                      comes back filled, the API drops the lead silently. */}
                  <div style={honeypotWrapperStyle} aria-hidden="true">
                    <label htmlFor="lead-company">Company (leave this field empty)</label>
                    <input
                      id="lead-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formState.company}
                      onChange={(e) =>
                        setFormState({ ...formState, company: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-name" className="block text-sm font-semibold text-navy-800 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className={inputCls}
                      placeholder="John Smith"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-sm font-semibold text-navy-800 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className={inputCls}
                      placeholder="(555) 555-5555"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="lead-equipment" className="block text-sm font-semibold text-navy-800 mb-1.5">
                        Truck Type
                      </label>
                      <select
                        id="lead-equipment"
                        required
                        value={formState.equipment}
                        onChange={(e) =>
                          setFormState({ ...formState, equipment: e.target.value })
                        }
                        className={inputCls + ' appearance-none'}
                      >
                        <option value="">Select…</option>
                        {EQUIPMENT_TYPES.map((eq) => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lead-mc" className="block text-sm font-semibold text-navy-800 mb-1.5">
                        MC# <span className="text-surface-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="lead-mc"
                        type="text"
                        value={formState.mcNumber}
                        onChange={(e) =>
                          setFormState({ ...formState, mcNumber: e.target.value })
                        }
                        className={inputCls}
                        placeholder="MC-123456"
                      />
                    </div>
                  </div>

                  {submitFailed && (
                    <div
                      role="alert"
                      className="flex gap-2.5 rounded-md border border-primary-200 bg-primary-50 px-3 py-2.5"
                    >
                      <AlertTriangle
                        className="w-4 h-4 flex-shrink-0 text-primary-600 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="text-sm text-navy-900">
                        <p className="font-semibold text-primary-700 mb-0.5">
                          We couldn&apos;t send that just now.
                        </p>
                        <p>
                          Please call{' '}
                          <a
                            href={BUSINESS.phoneHref}
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold rounded-md transition-colors disabled:opacity-70 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Get Started
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* "Or call directly" affordance — converts hesitant form-fillers */}
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <div className="flex-1 h-px bg-surface-200" />
                    <span>or call directly</span>
                    <div className="flex-1 h-px bg-surface-200" />
                  </div>

                  <a
                    href={BUSINESS.phoneHref}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 bg-white text-navy-900 font-semibold rounded-md border border-surface-300 hover:border-navy-400 hover:bg-surface-50 transition-colors"
                    aria-label={`Call ${BUSINESS.phone}`}
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    {BUSINESS.phone}
                  </a>

                  {/* Privacy reassurance — increases form completion */}
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-surface-500 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Your info stays private. We never sell or share it.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
