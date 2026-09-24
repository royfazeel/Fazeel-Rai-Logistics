import { HERO_IMAGES } from '@/lib/hero-images';

// The alternate layout gets an inline pixel rather than downloading a hidden
// full photograph. Source selection happens before CSS and needs no JavaScript.
const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default function HeroPhoto({ desktop = false }: { desktop?: boolean }) {
  const image = desktop ? HERO_IMAGES.desktop : HERO_IMAGES.phone;
  return (
    <picture className={desktop ? 'hero-photo-desktop' : 'hero-photo-mobile'} aria-hidden="true">
      <source media={desktop ? '(max-width: 1023px)' : '(min-width: 1024px)'} srcSet={EMPTY_IMAGE} />
      {!desktop && <source media={HERO_IMAGES.tablet.media} srcSet={HERO_IMAGES.tablet.srcSet} sizes="100vw" />}
      {/* Pre-encoded responsive assets keep quality consistent and avoid a
          first-visit image transformation. The matching preload is in page.tsx. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes="100vw"
        width={desktop ? 1916 : 1190}
        height={821}
        alt=""
        loading="eager"
        fetchPriority="high"
        className="hero-photo-image absolute inset-0 h-full w-full"
      />
    </picture>
  );
}
