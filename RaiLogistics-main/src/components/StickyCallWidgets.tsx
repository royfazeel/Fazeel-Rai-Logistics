'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

/**
 * Floating call/text/WhatsApp widgets — appear after 300px of scroll.
 *
 * Layout:
 *   Desktop (md+): single Phone pill, bottom-right. On hover it expands to
 *     reveal Text Us + WhatsApp options stacked above. Resting state stays
 *     minimal so it doesn't compete with content.
 *   Mobile (< md): 3-action sticky bottom bar (Call / Text / WhatsApp).
 *     All equal-width, equal-height (h-14). WhatsApp replaced the older Quote
 *     option because the brief specifically requested call/text/WhatsApp for
 *     the new Google Ads campaign number — Quote remains accessible via the
 *     hero CTAs and the desktop QuoteModal trigger from any page.
 */
export default function StickyCallWidgets() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pulse the Call button every 12s — subtle "tap me" signal
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Inline WhatsApp glyph — lucide-react doesn't include one.
  // Sized to match lucide stroke icons at the same className.
  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.523 5.273l-.999 3.648 3.965-1.04zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );

  return (
    <>
      {/* Desktop Floating Widget */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col gap-2 items-end"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            // Keyboard access: expand while any child (the Call button) has
            // focus, collapse only when focus leaves the whole stack.
            onFocus={() => setIsExpanded(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsExpanded(false);
              }
            }}
          >
            {/* Expanded options — Text + WhatsApp stack above Call on hover */}
            <AnimatePresence>
              {isExpanded && (
                <>
                  <motion.a
                    href={BUSINESS.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.18, delay: 0.05 }}
                    className="flex items-center gap-2 h-12 px-4 bg-white text-navy-900 text-sm font-semibold rounded-md shadow-medium hover:shadow-strong border border-surface-200 transition-shadow"
                    aria-label="Message us on WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-green-600" />
                    <span>WhatsApp</span>
                  </motion.a>
                  <motion.a
                    href={BUSINESS.smsHref}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2 h-12 px-4 bg-white text-navy-900 text-sm font-semibold rounded-md shadow-medium hover:shadow-strong border border-surface-200 transition-shadow"
                    aria-label="Send us a text"
                  >
                    <MessageCircle className="w-4 h-4 text-primary-600" aria-hidden="true" />
                    <span>Text Us</span>
                  </motion.a>
                </>
              )}
            </AnimatePresence>

            {/* Call Button — always visible, primary CTA */}
            <a
              href={BUSINESS.phoneHref}
              className={`group flex items-center gap-3 h-14 pl-3 pr-5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-md shadow-strong transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/40 ${
                isPulsing ? 'animate-call-pulse' : ''
              }`}
              aria-label={`Call ${BUSINESS.phone}`}
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/15 group-hover:bg-white/25 transition-colors">
                <Phone className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                  Call Now
                </span>
                <span className="text-base font-bold">{BUSINESS.phone}</span>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Bar — Call / Text / WhatsApp */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="bg-white border-t border-surface-200 shadow-strong pb-safe">
          <div className="grid grid-cols-3 h-14 divide-x divide-surface-200">
            <a
              href={BUSINESS.phoneHref}
              className="flex flex-col items-center justify-center gap-0.5 bg-primary-600 text-white font-semibold active:bg-primary-700 transition-colors"
              aria-label={`Call ${BUSINESS.phone}`}
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Call</span>
            </a>
            <a
              href={BUSINESS.smsHref}
              className="flex flex-col items-center justify-center gap-0.5 bg-white text-navy-800 font-semibold active:bg-surface-50 transition-colors"
              aria-label="Text us"
            >
              <MessageCircle className="w-5 h-5 text-primary-600" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Text</span>
            </a>
            <a
              href={BUSINESS.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-0.5 bg-white text-navy-800 font-semibold active:bg-surface-50 transition-colors"
              aria-label="Message us on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 text-green-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
