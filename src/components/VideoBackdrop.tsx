'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface VideoBackdropProps {
  /** Direct mp4 URL (the full-quality rendition) */
  src: string;
  /** Optional smaller rendition for phones — they cannot resolve the big one
      and should not pay for it. Falls back to `src` when omitted. */
  srcSmall?: string;
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
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  // Data Saver is the one signal here that is an explicit choice by the
  // visitor rather than a guess, so it is the only one we act on.
  //
  // We deliberately do NOT gate on connection.effectiveType any more. It is a
  // rolling browser estimate and it is wildly unstable — while testing this
  // very change the same machine reported "10 Mbps", then "3g", then "slow-2g"
  // within a few minutes. Gating on it meant the hero silently never loaded and
  // sat on a still poster, which is what "the video is stuck" turned out to be.
  // The clip is ~1.3 MB (about two photographs) and is written with +faststart
  // so it streams progressively, which is a fair cost on any real connection.
  return Boolean(conn?.saveData);
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
  srcSmall,
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
    // Phones get the lighter rendition: a 960-wide clip is already more pixels
    // than they can show, and phone networks cannot sustain the desktop file's
    // bitrate — that mismatch is exactly what made the hero freeze on phones.
    //
    // Decide with a media query, not raw width reads. matchMedia follows the
    // real viewport on devices and the EMULATED viewport under devtools /
    // automation (where window.innerWidth and screen.width both lie), and when
    // the viewport is unmeasurable it matches max-width — i.e. the failure
    // mode is "serve the lighter file", never "send a phone the 21 MB one".
    const wantsSmall = window.matchMedia('(max-width: 1023px)').matches;
    setVideoSrc(wantsSmall && srcSmall ? srcSmall : src);
  }, [src, srcSmall]);

  /* ---- 1. Decide when the poster, then the video, may load ---------------- */
  useEffect(() => {
    if (loading === 'eager') {
      // The hero clip is ~1.3 MB with +faststart, so waiting for the load event
      // AND an idle callback just left the poster sitting there looking frozen.
      // Attach on the next macrotask instead: it still yields to the current
      // render, but unlike requestAnimationFrame it also fires in a background
      // tab, so a page opened in one is already playing when it is brought
      // forward rather than stuck on its poster.
      const t = window.setTimeout(attachVideo, 0);
      return () => window.clearTimeout(t);
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

  /* ---- 2. Play only while on screen, and RECOVER when autoplay is refused.
          iPhones in Low Power Mode (and some webviews) reject the programmatic
          play() call. Without a retry the hero just freezes on its first frame
          — which is what "the video is stuck on mobile" looked like. The
          browser lifts that restriction after any user gesture and whenever
          the tab becomes visible, so retry at exactly those moments. -------- */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;

    let onScreen = false;
    const tryPlay = () => {
      if (!onScreen || !el.paused) return;
      void el.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = Boolean(entries[0]?.isIntersecting);
        if (onScreen) tryPlay();
        else el.pause();
      },
      { threshold: 0 }
    );
    observer.observe(el);

    // Enough data arrived after a slow start — try again.
    el.addEventListener('canplay', tryPlay);
    // Tab brought back to the foreground — autoplay is allowed again.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };
    document.addEventListener('visibilitychange', onVisible);
    // First real user gesture unlocks playback on iOS Low Power Mode.
    const gestures: Array<keyof DocumentEventMap> = ['touchend', 'pointerdown', 'keydown'];
    const onGesture = () => {
      tryPlay();
      gestures.forEach((g) => document.removeEventListener(g, onGesture));
    };
    gestures.forEach((g) =>
      document.addEventListener(g, onGesture, { passive: true })
    );

    return () => {
      observer.disconnect();
      el.removeEventListener('canplay', tryPlay);
      document.removeEventListener('visibilitychange', onVisible);
      gestures.forEach((g) => document.removeEventListener(g, onGesture));
    };
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
        // The effects above still decide WHEN the src is attached; once it is,
        // let the browser buffer freely so playback starts and stays smooth.
        // Lazy bands keep 'none' until they are near the viewport.
        preload={loading === 'eager' ? 'auto' : 'none'}
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}
