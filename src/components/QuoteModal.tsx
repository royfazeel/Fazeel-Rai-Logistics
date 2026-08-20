'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Send, Check, Loader2, ShieldCheck } from 'lucide-react';
import { BUSINESS, EQUIPMENT_TYPES } from '@/lib/constants';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * QuoteModal — onboarding-grade lead capture.
 *
 * Captures the data Sam actually needs before a discovery call:
 *  - MC number (lets him pull FMCSA history before he calls back)
 *  - Factoring company (avoids surprise mid-onboarding)
 *  - Current dispatch status (new authority vs. switching from someone)
 *
 * Accessibility: proper dialog semantics, focus is moved into the panel on
 * open and restored on close, Tab is trapped inside, and Escape closes.
 */
export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [formState, setFormState] = useState({
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Focus management: remember the trigger, move focus into the dialog on
  // open, restore it on close, close on Escape, and trap Tab in the panel.
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

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
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // NOTE: form submission is currently simulated. Wire to /api/lead route
    // (or your preferred email service like Resend) when ready — and update
    // the success copy below once submissions actually reach someone.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Auto-reset after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({
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
      });
      onClose();
    }, 3600);
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
                    Thanks!
                  </h3>
                  <p className="text-surface-600">
                    The fastest way to get set up is a quick call — dial{' '}
                    <a href={BUSINESS.phoneHref} className="text-primary-600 font-semibold">
                      {BUSINESS.phone}
                    </a>{' '}
                    or text us and we&apos;ll take it from there.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Trust strip */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-surface-50 border border-surface-200 text-navy-800 rounded-md text-sm">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 text-primary-600" />
                    <span>Your info stays private. We never sell or share it.</span>
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
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className={inputCls}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="quote-phone" className={labelCls}>
                        Phone *
                      </label>
                      <input
                        id="quote-phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className={inputCls}
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="quote-email" className={labelCls}>
                        Email *
                      </label>
                      <input
                        id="quote-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className={inputCls}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="quote-mc" className={labelCls}>
                        MC Number
                      </label>
                      <input
                        id="quote-mc"
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

                  <div>
                    <label htmlFor="quote-equipment" className={labelCls}>
                      Equipment Type *
                    </label>
                    <select
                      id="quote-equipment"
                      required
                      value={formState.equipment}
                      onChange={(e) => setFormState({ ...formState, equipment: e.target.value })}
                      className={inputCls + ' appearance-none'}
                    >
                      <option value="">Select equipment type</option>
                      {EQUIPMENT_TYPES.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name}
                        </option>
                      ))}
                    </select>
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
