'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface VideoBackdropProps {
  src: string;
  srcSmall?: string;
  poster: string;
  loading?: 'eager' | 'lazy';
  className?: string;
}

/** The still is server-rendered. Decorative video never downloads on mobile,
 * reduced-motion, data-saver, or slow connections and waits until page load. */
export default function VideoBackdrop({ src, srcSmall, poster, loading = 'lazy', className = '' }: VideoBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (window.matchMedia('(max-width: 1023px), (prefers-reduced-motion: reduce)').matches || connection?.saveData || /(^|-)2g|3g/.test(connection?.effectiveType || '')) return;
    const element = videoRef.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let nearViewport = loading === 'eager';
    const attach = () => {
      if (nearViewport && document.readyState === 'complete') {
        timer = setTimeout(() => setVideoSrc(srcSmall || src), 1800);
      }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        nearViewport = true;
        observer.disconnect();
        attach();
      }
    }, { rootMargin: '120px' });
    if (loading === 'lazy') observer.observe(element);
    window.addEventListener('load', attach, { once: true });
    if (loading === 'eager') attach();
    return () => {
      observer.disconnect();
      window.removeEventListener('load', attach);
      if (timer) clearTimeout(timer);
    };
  }, [src, srcSmall, loading]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !videoSrc) return;
    let visible = false;
    const sync = () => {
      if (visible && !paused && document.visibilityState === 'visible') void element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(entries => { visible = Boolean(entries[0]?.isIntersecting); sync(); });
    observer.observe(element);
    element.addEventListener('canplay', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); element.removeEventListener('canplay', sync); document.removeEventListener('visibilitychange', sync); };
  }, [videoSrc, paused]);

  return <>
    <Image src={poster} alt="" aria-hidden="true" fill priority={loading === 'eager'} sizes="100vw" className={`object-cover ${className}`} />
    <video ref={videoRef} className={`video-backdrop ${className}`} src={videoSrc} style={{ visibility: videoSrc ? 'visible' : 'hidden' }} width={960} height={540} muted loop playsInline preload="none" controls={false} disablePictureInPicture disableRemotePlayback aria-hidden="true" tabIndex={-1} />
    {videoSrc && <button type="button" onClick={() => setPaused(value => !value)} className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-md bg-navy-950/85 text-white border border-white/40 px-3 py-2 min-h-11 text-xs font-semibold hover:bg-navy-950 focus-visible:ring-2 focus-visible:ring-white" aria-label={paused ? 'Play background video' : 'Pause background video'}>{paused ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}{paused ? 'Play video' : 'Pause video'}</button>}
  </>;
}
