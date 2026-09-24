'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface VideoBackdropProps {
  src: string;
  poster: string;
  loading?: 'eager' | 'lazy';
  className?: string;
}

/** Keep the poster until a frame is playing. Autoplay is deferred and respects
 * motion/data preferences; explicit playback is available on every screen size. */
export default function VideoBackdrop({ src, poster, loading = 'lazy', className = '' }: VideoBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef(false);
  const wantsPlaybackRef = useRef(false);
  const retrySourceRef = useRef(false);
  const attemptRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [hasFrame, setHasFrame] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [issue, setIssue] = useState<'blocked' | 'error' | null>(null);

  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = undefined;
  }, []);

  const beginLoading = useCallback(() => {
    clearLoadingTimeout();
    setIsLoading(true);
    const attempt = attemptRef.current;
    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current || attempt !== attemptRef.current) return;
      wantsPlaybackRef.current = false;
      retrySourceRef.current = true;
      attemptRef.current += 1;
      videoRef.current?.pause();
      setIsLoading(false);
      setHasFrame(false);
      setIssue('error');
    }, 15000);
  }, [clearLoadingTimeout]);

  const play = useCallback(() => {
    const element = videoRef.current;
    if (!element || !mountedRef.current) return;
    wantsPlaybackRef.current = true;
    setIssue(null);
    if (!element.paused && element.readyState >= 3) return;
    const attempt = ++attemptRef.current;

    // Assign and play synchronously in the click handler so iOS retains the
    // user's activation. Waiting for a React effect can lose that permission.
    element.muted = true;
    element.defaultMuted = true;
    element.playsInline = true;
    if (element.getAttribute('src') !== src || retrySourceRef.current || element.error) {
      retrySourceRef.current = false;
      setHasFrame(false);
      element.src = src;
      element.load();
    }
    beginLoading();
    void element.play().catch((error: unknown) => {
      if (!mountedRef.current || attempt !== attemptRef.current) return;
      clearLoadingTimeout();
      wantsPlaybackRef.current = false;
      setIsLoading(false);
      setIsPlaying(false);
      const blocked = error instanceof DOMException && error.name === 'NotAllowedError';
      retrySourceRef.current = !blocked;
      setIssue(blocked ? 'blocked' : 'error');
    });
  }, [src, beginLoading, clearLoadingTimeout]);

  const pause = useCallback(() => {
    attemptRef.current += 1;
    clearLoadingTimeout();
    videoRef.current?.pause();
    setIsLoading(false);
    setIsPlaying(false);
  }, [clearLoadingTimeout]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    mountedRef.current = true;
    retrySourceRef.current = false;
    setHasFrame(false);
    setIssue(null);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    wantsPlaybackRef.current = !reducedMotion.matches && !connection?.saveData && !/(^|-)2g|3g/.test(connection?.effectiveType || '');
    let visible = false;
    let startTimer: ReturnType<typeof setTimeout> | undefined;

    const clearStartTimer = () => {
      if (startTimer) clearTimeout(startTimer);
      startTimer = undefined;
    };
    const sync = () => {
      clearStartTimer();
      if (!visible || document.visibilityState !== 'visible') {
        pause();
        return;
      }
      if (!wantsPlaybackRef.current) return;
      if (element.getAttribute('src')) {
        play();
      } else if (document.readyState === 'complete') {
        startTimer = setTimeout(() => {
          if (wantsPlaybackRef.current && visible && document.visibilityState === 'visible') play();
        }, 1800);
      }
    };
    const observer = new IntersectionObserver(entries => {
      visible = Boolean(entries[0]?.isIntersecting);
      sync();
    });
    observer.observe(element);
    const respectReducedMotion = () => {
      if (reducedMotion.matches) {
        wantsPlaybackRef.current = false;
        clearStartTimer();
        pause();
      }
    };
    window.addEventListener('load', sync);
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', respectReducedMotion);
    return () => {
      mountedRef.current = false;
      wantsPlaybackRef.current = false;
      attemptRef.current += 1;
      observer.disconnect();
      clearStartTimer();
      clearLoadingTimeout();
      window.removeEventListener('load', sync);
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', respectReducedMotion);
      element.pause();
      element.removeAttribute('src');
      element.load();
    };
  }, [play, pause, clearLoadingTimeout]);

  const togglePlayback = () => {
    if (isPlaying || isLoading) {
      wantsPlaybackRef.current = false;
      pause();
      if (isLoading && !hasFrame && videoRef.current) {
        // Cancel a pending download as well as the pending play promise.
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    } else {
      play();
    }
  };
  const handlePlaying = () => {
    if (!wantsPlaybackRef.current || document.visibilityState !== 'visible') {
      videoRef.current?.pause();
      return;
    }
    clearLoadingTimeout();
    setHasFrame(true);
    setIsLoading(false);
    setIsPlaying(true);
    setIssue(null);
  };
  const handleError = () => {
    wantsPlaybackRef.current = false;
    retrySourceRef.current = true;
    pause();
    setHasFrame(false);
    setIssue('error');
  };
  const label = isLoading ? 'Cancel video loading' : isPlaying ? 'Pause video' : issue === 'error' ? 'Retry video' : 'Play background video';

  return <>
    <Image src={poster} alt="" aria-hidden="true" fill priority={loading === 'eager'} sizes="100vw" className={`object-cover ${className}`} />
    <video
      ref={videoRef}
      className={`video-backdrop ${className}`}
      style={{ visibility: hasFrame ? 'visible' : 'hidden' }}
      onPlaying={handlePlaying}
      onPause={() => setIsPlaying(false)}
      onWaiting={() => { if (wantsPlaybackRef.current) { setIsPlaying(false); beginLoading(); } }}
      onError={handleError}
      width={1920}
      height={1080}
      muted
      loop
      playsInline
      preload="none"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    />
    <button type="button" onClick={togglePlayback} className={`absolute ${loading === 'eager' ? 'top-[5.25rem] lg:top-auto lg:bottom-4' : 'bottom-4'} right-4 z-20 inline-flex items-center gap-2 rounded-md bg-navy-950/85 text-white border border-white/40 px-3 py-2 min-h-11 text-xs font-semibold hover:bg-navy-950 focus-visible:ring-2 focus-visible:ring-white`} aria-label={isLoading ? 'Cancel background video loading' : isPlaying ? 'Pause background video' : label}>
      {isPlaying || isLoading ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
      {label}
    </button>
    <span className="sr-only" role="status">
      {issue === 'blocked' ? 'Automatic playback was blocked. Use Play background video to start it.' : issue === 'error' ? 'The video could not load. Use Retry video to try again.' : ''}
    </span>
  </>;
}
