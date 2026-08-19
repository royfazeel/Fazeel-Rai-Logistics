'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Truck, ArrowRight, MessageCircle, Clock } from 'lucide-react';
import { BUSINESS, NAVIGATION } from '@/lib/constants';

const footerLinks = {
  services: [
    { name: 'Rate Negotiation', href: '/services#rate-negotiation' },
    { name: 'Load Booking', href: '/services#load-booking' },
    { name: 'Broker Communication', href: '/services#broker-communication' },
    { name: 'Route Strategy', href: '/services#route-strategy' },
  ],
  equipment: [
    { name: 'Box Trucks', href: '/equipment#box-truck' },
    { name: 'Dry Vans', href: '/equipment#dry-van' },
    { name: 'Reefers', href: '/equipment#reefer' },
    { name: 'Flatbeds', href: '/equipment#flatbed' },
    { name: 'Power Only', href: '/equipment#power-only' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="container-custom py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 uppercase">
                Ready to run better freight?
              </h2>
              <p className="text-surface-400 text-lg">
                Call now — most trucks are dispatched within 24–48 hours.
              </p>
            </div>
            <motion.a
              href={BUSINESS.phoneHref}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xl rounded-md transition-colors"
            >
              <Phone className="w-6 h-6" />
              {BUSINESS.phone}
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-md flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-2xl tracking-wide uppercase">
                  <span className="text-primary-500">Rai</span>{' '}
                  <span className="text-white/90">Logistics</span>
                </span>
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50 mt-0.5">
                  Truck Dispatch
                </span>
              </div>
            </Link>
            <p className="text-surface-400 mb-6 max-w-sm">
              Professional truck dispatch services for owner-operators and small fleets. 
              Nationwide coverage with dedicated dispatchers who fight for your best rates.
            </p>
            <div className="space-y-3">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center gap-3 text-surface-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5 text-primary-400" />
                {BUSINESS.phone}
              </a>
              <a
                href={BUSINESS.smsHref}
                className="flex items-center gap-3 text-surface-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary-400" />
                Text us
              </a>
              <a
                href={BUSINESS.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-surface-300 hover:text-white transition-colors"
              >
                {/* Inline WhatsApp SVG — lucide-react doesn't ship a WA glyph */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-green-400 flex-shrink-0"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.523 5.273l-.999 3.648 3.965-1.04zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={BUSINESS.emailHref}
                className="flex items-center gap-3 text-surface-300 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 text-primary-400" />
                {BUSINESS.email}
              </a>
              <div className="flex items-start gap-3 text-surface-300">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>{BUSINESS.address.full}</span>
              </div>
              <div className="flex items-start gap-3 text-surface-300">
                <Clock className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>
                  {BUSINESS.hours.days}
                  <br />
                  <span className="text-surface-400 text-sm">{BUSINESS.hours.time}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Equipment</h3>
            <ul className="space-y-3">
              {footerLinks.equipment.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-surface-500">
            <div className="text-center md:text-left">
              {/* suppressHydrationWarning: the year is baked in at build time;
                  after a year boundary the client value differs until rebuild */}
              <p suppressHydrationWarning>
                © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
              </p>
              <p className="mt-1">
                {BUSINESS.name} is a dispatch services company operating under {BUSINESS.parentCompany}.
              </p>
            </div>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-surface-600 text-center md:text-left">
            <p>
              Disclaimer: {BUSINESS.name} provides dispatch services. We are not a motor carrier or freight broker. 
              Carriers remain responsible for compliance and maintaining operating authority.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
