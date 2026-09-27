import type { ComponentPropsWithoutRef } from 'react';
import { EQUIPMENT_IMAGES } from '@/lib/equipment-images';

type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> & {
  slug: string;
  alt?: string;
  priority?: boolean;
};

/** Locally encoded, full-frame equipment photos; no runtime optimizer dependency. */
export default function EquipmentPhoto({ slug, alt, priority = false, sizes = '100vw', loading, fetchPriority, ...props }: Props) {
  const photo = EQUIPMENT_IMAGES[slug];
  if (!photo) return null;
  return <>
    {priority && <link rel="preload" as="image" type="image/avif" href={photo.avifSrc}
      imageSrcSet={photo.avifSrcSet} imageSizes={sizes} fetchPriority="high" />}
    <picture className="block">
      <source type="image/avif" srcSet={photo.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={photo.webpSrcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} src={photo.src} srcSet={photo.webpSrcSet} sizes={sizes}
        width={photo.width} height={photo.height} alt={alt ?? photo.alt}
        loading={priority ? 'eager' : loading ?? 'lazy'}
        fetchPriority={priority ? 'high' : fetchPriority} decoding="async" />
    </picture>
  </>;
}
