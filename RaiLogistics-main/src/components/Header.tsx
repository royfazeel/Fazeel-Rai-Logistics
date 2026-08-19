'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, Truck, MessageCircle } from 'lucide-react';
import { BUSINESS, NAVIGATION } from '@/lib/constants';

/**
 * Site header.
 *
 * On the homepage the header starts transparent so the hero video runs
 * edge-to-edge behind it, then switches to solid white once the visitor
 * scrolls. Every other page gets the solid white header from the start.
 *
 * Layout responsibilities:
 *   - Fixed at top; mobile (< lg) gets a hamburger + icon-only call button,
 *     desktop (≥ lg) gets full nav links + a "Call (xxx) xxx-xxxx" button.
 *   - All tap targets are ≥ 44px (Apple HIG).
 */
export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Transparent-over-video treatment only applies at the top of the homepage
  // (and never while the mobile menu is open, which needs a solid backdrop).
  const overVideo = pathname === '/' && !isScrolled && !isMobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        overVideo
          ? 'bg-navy-950/40 backdrop-blur-sm border-b border-white/10'
          : 'bg-white shadow-soft border-b border-surface-200'
      }`}
    >
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
            aria-label="Rai Logistics — Home"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-md flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" strokeWidth={2.25} aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-2xl tracking-wide uppercase">
                <span className={overVideo ? 'text-white' : 'text-primary-600'}>Rai</span>{' '}
                <span className={overVideo ? 'text-white/90' : 'text-accent-700'}>Logistics</span>
              </span>
              <span
                className={`font-display text-[11px] font-semibold uppercase tracking-[0.28em] mt-0.5 hidden sm:block ${
                  overVideo ? 'text-white/60' : 'text-surface-600'
                }`}
              >
                Truck Dispatch
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — only at lg+ */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAVIGATION.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    overVideo
                      ? isActive
                        ? 'text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : isActive
                        ? 'text-primary-700'
                        : 'text-navy-800 hover:text-primary-600 hover:bg-surface-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full ${
                        overVideo ? 'bg-white' : 'bg-primary-600'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop: full "Call (xxx) xxx-xxxx" button */}
            <a
              href={BUSINESS.phoneHref}
              className="hidden md:inline-flex items-center gap-2 h-11 px-4 lg:px-5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-md transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phone}`}
            >
              <Phone className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <span className="hidden lg:inline">Call</span>
              <span className="hidden xl:inline">{BUSINESS.phone}</span>
              <span className="lg:hidden">Call Now</span>
            </a>

            {/* Mobile: icon-only Phone shortcut (44×44 tap target — Apple HIG) */}
            <a
              href={BUSINESS.phoneHref}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 bg-primary-600 text-white rounded-md active:scale-95 transition-transform"
              aria-label={`Call ${BUSINESS.phone}`}
            >
              <Phone className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                overVideo
                  ? 'text-white hover:bg-white/10 active:bg-white/20'
                  : 'text-navy-800 hover:bg-surface-100 active:bg-surface-200'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden bg-white border-t border-surface-200 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain"
          >
            <div className="container-custom py-4 space-y-1">
              {NAVIGATION.map((item, index) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-navy-800 hover:bg-surface-50'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              {/* Two-CTA row: Call + Text — equal-sized 48px-tall buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-surface-100"
              >
                <a
                  href={BUSINESS.phoneHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 h-12 px-4 bg-primary-600 text-white font-semibold rounded-md active:scale-[0.98] transition-transform"
                  aria-label={`Call ${BUSINESS.phone}`}
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>Call</span>
                </a>
                <a
                  href={BUSINESS.smsHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 h-12 px-4 bg-white text-navy-800 font-semibold rounded-md border border-surface-300 active:scale-[0.98] transition-transform"
                  aria-label="Text us"
                >
                  <MessageCircle className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  <span>Text</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
