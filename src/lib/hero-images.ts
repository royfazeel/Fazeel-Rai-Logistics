const imageSet = (name: string, widths: number[], format = 'webp') =>
  widths.map((width) => `/images/hero/truck-${name}-${width}-v1.${format} ${width}w`).join(', ');

export const HERO_IMAGES = {
  phone: {
    src: '/images/hero/truck-phone-768-v1.webp',
    srcSet: imageSet('phone', [480, 768, 1190]),
    avifSrc: '/images/hero/truck-phone-768-v1.avif',
    avifSrcSet: imageSet('phone', [480, 768, 1190], 'avif'),
    media: '(max-width: 639px)',
  },
  tablet: {
    src: '/images/hero/truck-tablet-1200-v1.webp',
    srcSet: imageSet('tablet', [768, 1200, 1478]),
    avifSrc: '/images/hero/truck-tablet-1200-v1.avif',
    avifSrcSet: imageSet('tablet', [768, 1200, 1478], 'avif'),
    media: '(min-width: 640px) and (max-width: 1023px)',
  },
  desktop: {
    src: '/images/hero/truck-desktop-1440-v1.webp',
    srcSet: imageSet('desktop', [960, 1440, 1916]),
    avifSrc: '/images/hero/truck-desktop-1440-v1.avif',
    avifSrcSet: imageSet('desktop', [960, 1440, 1916], 'avif'),
    media: '(min-width: 1024px)',
  },
};
