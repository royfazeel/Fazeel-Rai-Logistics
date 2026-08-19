'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackdropProps {
  /** Direct mp4 URL */
  src: string;
  /** Poster image shown before the video is ready (and forever, if the
      visitor prefers reduced motion or the video fails to load) */
  poster: string;
  /** Load strategy: 'eager' for the above-the-fold hero, 'lazy' for bands
      further down the page (video only starts downloading near viewport) */
  loading?: 'eager' | 'lazy';
  className?: string;
}

/**
 * Full-bleed background video for hero sections and CTA bands.
 *
 * Wrap in a `relative` container; the video absolutely fills it (object-fit:
 * cover). Put content in a sibling with a higher z-index and give the parent
 * an overlay div for text contrast.
 *
 * Honors prefers-reduced-motion by never starting playback — the poster
 * frame stays, so the section still reads correctly.
 */
export default function VideoBackdrop({
  src,
  poster,
  loading = 'lazy',
  className = '',
}: VideoBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Start without a src even for eager loads: SSR markup must not ship a
  // playing video to visitors who prefer reduced motion. The effect below
  // flips this on right after hydration, so the cost is one paint with the
  // poster only.
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Leave the poster in place; never fetch or play the video.
      const el = videoRef.current;
      if (el) {
        el.pause();
        el.removeAttribute('src');
        el.load();
      }
      setShouldLoad(false);
      return;
    }
    if (loading === 'eager') {
      setShouldLoad(true);
      return;
    }

    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      // Start fetching one viewport-height early so it's playing by arrival
      { rootMargin: '100% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <video
      ref={videoRef}
      className={`video-backdrop ${className}`}
      src={shouldLoad ? src : undefined}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={loading === 'eager' ? 'auto' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
