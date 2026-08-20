'use client';

import { useState } from 'react';
import { Phone, Search } from 'lucide-react';
import { ScrollReveal, FAQAccordion } from '@/components';
import { BUSINESS, FAQS, MEDIA } from '@/lib/constants';

export default function FAQPageClient() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* ============================================================
          PAGE HERO — compact dark band with the highway photo.
          ============================================================ */}
      <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden">
        <img
          src={MEDIA.highwayPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />

        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="eyebrow">Help center</p>
              <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[1.02] tracking-tight mb-4">
                Frequently asked questions
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-2xl">
                Straight answers about plans, pricing, paperwork, and how
                dispatch works. Can&apos;t find what you need? Give us a call.
              </p>

              {/* Search */}
              <div className="relative max-w-xl">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search questions..."
                  aria-label="Search questions"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-navy-950 placeholder:text-surface-500 rounded-md border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="py-8 bg-white border-b border-surface-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-navy-900 font-medium">
              Need an answer right now? Pick up the phone — we answer fast.
            </p>
            <a
              href={BUSINESS.phoneHref}
              className="btn-primary"
              aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ LIST
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <h2 className="sr-only">All questions</h2>
          {filteredFaqs.length > 0 ? (
            <ScrollReveal>
              <FAQAccordion faqs={filteredFaqs} columns={2} />
            </ScrollReveal>
          ) : (
            <div className="py-12">
              <p className="text-surface-700 text-lg mb-4">
                No questions found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          STILL HAVE QUESTIONS
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Still have questions?</p>
              <h2 className="section-heading mb-4">
                Ask a dispatcher, not a search bar
              </h2>
              <p className="text-surface-700 text-lg mb-8">
                Call us and we&apos;ll walk you through anything — plans,
                paperwork, lanes, rates. No obligations.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <a
                  href={BUSINESS.phoneHref}
                  className="btn-call"
                  aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
                >
                  <Phone className="w-6 h-6" aria-hidden="true" />
                  {BUSINESS.phone}
                </a>
                <a
                  href={BUSINESS.emailHref}
                  className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  Or email us at {BUSINESS.email}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — flat dark band.
          ============================================================ */}
      <section className="section-padding bg-navy-950 text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-4">
              Ready to get <span className="text-primary-500">started</span>?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Don&apos;t wait — call now and get dispatched within 24-48 hours.
            </p>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center justify-center gap-3 h-16 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg sm:text-xl rounded-md transition-colors"
              aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
            >
              <Phone className="w-6 h-6" aria-hidden="true" />
              {BUSINESS.phone}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
