'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Truck } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';

/**
 * Testimonial carousel — flat industrial cards.
 *
 *  - Flat white cards (rounded-lg, surface border), no gradients or lifts
 *  - Square quote chip (primary-50 tile) instead of a rounded icon bubble
 *  - Name / location / equipment / years set in condensed small caps
 *  - Slide navigation uses square buttons and flat indicator bars
 *  - Autoplay pauses on hover and focus-within, and never starts when the
 *    visitor prefers reduced motion
 */
export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerView = 3;
  const totalSlides = Math.ceil(TESTIMONIALS.length / itemsPerView);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const getCurrentTestimonials = () => {
    const start = currentIndex * itemsPerView;
    return TESTIMONIALS.slice(start, start + itemsPerView);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onFocus={() => setIsAutoPlaying(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsAutoPlaying(true);
        }
      }}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {getCurrentTestimonials().map((testimonial, idx) => {
              // Local widening — `as const` arrays don't expose the optional
              // `yearsExperience` prop on the union type without a hint.
              const t = testimonial as typeof testimonial & {
                yearsExperience?: string;
              };
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card p-6 hover:border-primary-300 flex flex-col"
                >
                  {/* Quote chip */}
                  <div className="w-10 h-10 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mb-4">
                    <Quote className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>

                  {/* Quote */}
                  <p className="text-surface-700 mb-6 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Rating */}
                  <div
                    className="flex gap-1 mb-4"
                    role="img"
                    aria-label={`Rated ${t.rating} out of 5 stars`}
                  >
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
                    <div className="w-11 h-11 bg-navy-950 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-display font-bold text-sm">
                        {t.name
                          .split(' ')
                          .map((n) => n.charAt(0))
                          .join('')
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold uppercase tracking-wide text-navy-950 truncate">
                        {t.name}
                      </p>
                      <div className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wider text-surface-600">
                        <span className="truncate">{t.location}</span>
                        <span aria-hidden="true">•</span>
                        <span className="flex items-center gap-1 truncate">
                          <Truck className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                          {t.equipment}
                        </span>
                      </div>
                      {t.yearsExperience && (
                        <p className="font-display text-xs font-semibold uppercase tracking-wider text-surface-500 mt-0.5">
                          {t.yearsExperience}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="p-3 rounded-md bg-white border border-surface-300 hover:border-primary-600 hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-5 h-5 text-navy-700" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {[...Array(totalSlides)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className="group flex h-6 w-9 items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
            >
              <span
                className={`h-1.5 w-7 transition-colors ${
                  idx === currentIndex
                    ? 'bg-primary-600'
                    : 'bg-surface-300 group-hover:bg-surface-400'
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <button
          onClick={next}
          className="p-3 rounded-md bg-white border border-surface-300 hover:border-primary-600 hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-5 h-5 text-navy-700" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
