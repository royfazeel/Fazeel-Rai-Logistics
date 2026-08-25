'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface VideoBackdropProps {
  /** Direct mp4 URL */
  src: string;
  /** Poster image shown before the video is ready (and forever, if the
      visitor prefers reduced motion, is on a metered/slow connection, or the
      video fails to load) */
  poster: string;
  /** Load strategy: 'eager' for the above-the-fold hero, 'lazy' for bands
      further down the page (poster AND video only start downloading near
      the viewport) */
  loading?: 'eager' | 'lazy';
  className?: string;
}

/** Intrinsic size of the Pexels renditions in src/lib/constants.ts. Only used
 *  to give the element an aspect ratio before CSS lands — `.video-backdrop`
 *  absolutely fills its container, so this can never move layout. */
const NATIVE_W = 960;
const NATIVE_H = 540;

/** True when the visitor asked the OS to reduce motion. */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * True when downloading several megabytes of background footage would be
 * hostile: Data Saver is on, or the effective connection is 3G or worse.
 *
 * This matters commercially, not just politely — paid clicks arrive on phones,
 * the hero clip is ~18 MB, and a visitor whose page stalls while a decorative
 * video hogs the pipe leaves before the call button matters.
 */
function shouldSkipVideo(): boolean {
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
    }
  ).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  // A phone on a weak tower still self-reports "4g" while actually delivering
  // ~1.7 Mbps, so the effectiveType check alone lets a ~19 MB clip through and
  // monopolises the connection the visitor needs for the call and the form.
  if (typeof conn.downlink === 'number' && conn.downlink < 5) return true;
  return ['slow-2g', '2g', '3g'].includes(conn.effectiveType ?? '');
}


/** Run `cb` when the browser is idle, with a hard ceiling so it always runs. */
function whenIdle(cb: () => void): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  if (typeof w.requestIdleCallback === 'function') {
    const handle = w.requestIdleCallback(cb, { timeout: 2500 });
    return () => w.cancelIdleCallback?.(handle);
  }
  const t = window.setTimeout(cb, 600);
  return () => window.clearTimeout(t);
}

/** Resolves once the page's own load event has fired (or immediately if it already has). */
function afterPageLoad(cb: () => void): () => void {
  if (document.readyState === 'complete') {
    return whenIdle(cb);
  }
  let cancelIdle: (() => void) | undefined;
  const onLoad = () => {
    cancelIdle = whenIdle(cb);
  };
  window.addEventListener('load', onLoad, { once: true });
  return () => {
    window.removeEventListener('load', onLoad);
    cancelIdle?.();
  };
}

/**
 * Full-bleed background video for hero sections and CTA bands.
 *
 * Wrap in a `relative` container; the video absolutely fills it (object-fit:
 * cover). Put content in a sibling with a higher z-index and give the parent
 * an overlay div for text contrast.
 *
 * Loading contract — the whole point of this component:
 *
 *   1. The poster is the only thing that paints first. For 'lazy' bands the
 *      poster is not even requested until the band is one viewport away, so a
 *      below-the-fold clip costs the landing page nothing.
 *   2. The mp4 is never requested until AFTER the page load event and the main
 *      thread has gone idle. Background footage must never compete with LCP —
 *      Ad Rank is priced off that number.
 *   3. Data Saver / 3G-or-worse and prefers-reduced-motion visitors keep the
 *      poster forever and never pay for the video at all.
 *   4. Playback pauses the moment the section leaves the viewport, so a
 *      visitor who scrolls down stops buffering a clip nobody is watching.
 */
export default function VideoBackdrop({
  src,
  poster,
  loading = 'lazy',
  className = '',
}: VideoBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Eager sections paint their poster in the SSR markup. Lazy sections hold it
  // back until they are near the viewport — otherwise a CTA band 8 screens down
  // costs the hero ~80 KB of contended bandwidth on first paint.
  const [showPoster, setShowPoster] = useState(loading === 'eager');
  // Never in the SSR markup: the mp4 is attached from an effect, once.
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  /** Attach the mp4 unless this visitor should not be paying for it. */
  const attachVideo = useCallback(() => {
    if (prefersReducedMotion() || shouldSkipVideo()) return;
    setVideoSrc(src);
  }, [src]);

  /* ---- 1. Decide when the poster, then the video, may load ---------------- */
  useEffect(() => {
    if (loading === 'eager') {
      // Poster is already rendering. Queue the mp4 for after load + idle.
      return afterPageLoad(attachVideo);
    }

    const el = videoRef.current;
    if (!el) return;
    let cancelDeferred: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        setShowPoster(true);
        cancelDeferred = afterPageLoad(attachVideo);
      },
      // Start one viewport early so the poster has landed by arrival.
      { rootMargin: '100% 0px' }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelDeferred?.();
    };
  }, [loading, attachVideo]);

  /* ---- 2. Play only while on screen -------------------------------------- */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          // Autoplay can still be refused (low power mode); the poster stays.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoSrc]);

  return (
    <>
      {/* Hoisted into <head> by React so the hero's first paint is requested
          in the document's initial preload scan rather than after the video
          element is constructed. Only for the above-the-fold instance —
          preloading a poster nobody scrolls to would be a regression. */}
      {loading === 'eager' && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link
          rel="preload"
          as="image"
          href={poster}
          fetchPriority="high"
        />
      )}
      <video
        ref={videoRef}
        className={`video-backdrop ${className}`}
        src={videoSrc}
        poster={showPoster ? poster : undefined}
        width={NATIVE_W}
        height={NATIVE_H}
        autoPlay
        muted
        loop
        playsInline
        // Always 'none': the effects above decide when a byte of mp4 is worth
        // fetching. 'auto' here would hand the browser permission to start
        // buffering during the LCP window.
        preload="none"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}
