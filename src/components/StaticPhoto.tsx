import type { ComponentPropsWithoutRef } from 'react';
import { STATIC_PHOTOS, type StaticPhotoSource } from '@/lib/static-photo-assets';

type StaticPhotoProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'srcSet' | 'width' | 'height'> & {
  src: StaticPhotoSource;
  alt: string;
  fill?: boolean;
  priority?: boolean;
};

/** Responsive local photographs with no runtime image-optimization dependency. */
export default function StaticPhoto({
  src,
  alt,
  fill = false,
  priority = false,
  sizes = '100vw',
  loading,
  fetchPriority,
  style,
  ...imageProps
}: StaticPhotoProps) {
  const photo = STATIC_PHOTOS[src];
  return <>
    {priority && <link rel="preload" as="image" type="image/avif" href={photo.avifSrc}
      imageSrcSet={photo.avifSrcSet} imageSizes={sizes} fetchPriority="high" />}
    <picture className={fill ? 'absolute inset-0 block h-full w-full' : 'block'}>
      <source type="image/avif" srcSet={photo.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={photo.webpSrcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imageProps} src={photo.src} srcSet={photo.webpSrcSet} sizes={sizes}
        width={photo.width} height={photo.height} alt={alt}
        loading={priority ? 'eager' : loading ?? 'lazy'}
        fetchPriority={priority ? 'high' : fetchPriority}
        decoding="async"
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style } : style} />
    </picture>
  </>;
}
