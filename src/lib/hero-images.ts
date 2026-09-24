const imageSet = (name: string, widths: number[]) =>
  widths.map((width) => `/images/hero/truck-${name}-${width}-v1.webp ${width}w`).join(', ');

export const HERO_IMAGES = {
  phone: {
    src: '/images/hero/truck-phone-768-v1.webp',
    srcSet: imageSet('phone', [480, 768, 1190]),
    media: '(max-width: 639px)',
  },
  tablet: {
    src: '/images/hero/truck-tablet-1200-v1.webp',
    srcSet: imageSet('tablet', [768, 1200, 1478]),
    media: '(min-width: 640px) and (max-width: 1023px)',
  },
  desktop: {
    src: '/images/hero/truck-desktop-1440-v1.webp',
    srcSet: imageSet('desktop', [960, 1440, 1916]),
    media: '(min-width: 1024px)',
  },
};
