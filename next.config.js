/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Never advertise the framework in a response header.
  poweredByHeader: false,

  images: {
    // `domains` is deprecated in Next 14; remotePatterns is the supported form.
    // Scoped to the one host this site actually loads imagery from, so it can
    // never act as an open image proxy. Declared now so the Pexels stills can
    // be moved onto next/image (automatic WebP + intrinsic width/height)
    // without another config change.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
