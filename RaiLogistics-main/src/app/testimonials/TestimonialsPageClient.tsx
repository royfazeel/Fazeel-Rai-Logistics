'use client';

import { Phone, Star, Quote, Truck, MapPin } from 'lucide-react';
import { ScrollReveal } from '@/components';
import { BUSINESS, MEDIA, STATS, TESTIMONIALS } from '@/lib/constants';

export default function TestimonialsPageClient() {
  const featured = TESTIMONIALS[0];

  return (
    <>
      {/* ============================================================
          PAGE HERO — compact dark band over highway footage.
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
              <p className="eyebrow">Driver reviews</p>
              <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[1.02] tracking-tight mb-5">
                What our drivers say
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-2xl">
                Don&apos;t just take our word for it — hear from the
                owner-operators who trust Rai Logistics with their dispatch.
              </p>

              <a
                href={BUSINESS.phoneHref}
                className="btn-primary"
                aria-label={`Call Rai Logistics at ${BUSINESS.phone}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call to get started
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          STATS STRIP — signage-style numbers.
          ============================================================ */}
      <section className="py-12 bg-white border-b border-surface-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, idx) => (
              <ScrollReveal key={stat.label} delay={idx * 0.1}>
                <div>
                  <div className="font-display text-3xl md:text-4xl font-bold text-navy-950 leading-none mb-1.5">
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <p className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider text-surface-600">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ALL REVIEWS — flat card grid.
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">In their own words</p>
              <h2 className="section-heading mb-4">All reviews</h2>
              <p className="text-surface-700 text-lg">
                Real reviews from real drivers across the United States.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((testimonial, idx) => (
              <ScrollReveal key={testimonial.id} delay={idx * 0.05}>
                <div className="card p-6 hover:border-primary-300 h-full flex flex-col">
                  {/* Quote chip */}
                  <div className="w-10 h-10 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mb-4">
                    <Quote className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>

                  {/* Quote */}
                  <p className="text-surface-700 mb-6 leading-relaxed flex-grow">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Rating */}
                  <div
                    className="flex gap-1 mb-4"
                    role="img"
                    aria-label={`Rated ${testimonial.rating} out of 5 stars`}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
                    <div className="w-11 h-11 bg-navy-950 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-display font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold uppercase tracking-wide text-navy-950">
                        {testimonial.name}
                      </p>
                      <div className="flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-wider text-surface-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                          {testimonial.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                          {testimonial.equipment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED TESTIMONIAL — one dark slab, one voice.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto bg-navy-950 rounded-lg p-8 md:p-12 text-white">
              <Quote className="w-10 h-10 text-primary-500 mb-6" aria-hidden="true" />
              <p className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                &ldquo;{featured.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-xl font-bold">
                    {featured.name
                      .split(' ')
                      .map((n) => n.charAt(0))
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-display text-lg font-bold uppercase tracking-wide">
                    {featured.name}
                  </p>
                  <p className="font-display text-sm font-semibold uppercase tracking-wider text-white/60">
                    {featured.equipment} • {featured.location}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — dark band, one number to call.
          ============================================================ */}
      <section className="section-padding bg-navy-950 text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl md:text-5xl leading-[0.95] tracking-tight mb-5">
              Want results like these?
            </h2>
            <p className="text-white/70 text-lg mb-9 max-w-xl mx-auto">
              One call gets you set up. Talk to a dispatcher today.
            </p>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center justify-center gap-3 h-16 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
