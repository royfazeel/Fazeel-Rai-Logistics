'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  label: string;
}

/**
 * AnimatedCounter — counts up from 0 to `value` when scrolled into view.
 *
 * KEY FIX: previously, the initial state was 0, which meant:
 *  - Server-rendered HTML showed "0" (bad for SEO, social previews, no-JS users)
 *  - Any user who scrolled past the section before hydration completed
 *    saw "0" frozen on screen
 *
 * Solution: track a `hasMounted` flag and only drop to 0 to animate up after
 * the client mounts. Before that, render the final value directly. This makes
 * SSR correct and handles fast page-loads where the section never enters view.
 */
export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  label,
}: AnimatedCounterProps) {
  const numericValue =
    typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;

  const [hasMounted, setHasMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(numericValue); // start at FINAL value
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  // Once mounted on the client, drop to 0 so we can animate up.
  useEffect(() => {
    setHasMounted(true);
    setDisplayValue(0);
  }, []);

  // Animate to final value when in view (after mount)
  useEffect(() => {
    if (!hasMounted || !isInView) return;

    let startTime: number;
    let rafId: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * numericValue));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue); // ensure exact final value
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [hasMounted, isInView, numericValue, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-navy-950 mb-1 leading-none tracking-tight">
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <p className="text-surface-500 font-medium text-sm sm:text-base">{label}</p>
    </div>
  );
}
