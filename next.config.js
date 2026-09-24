/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Never advertise the framework in a response header.
  poweredByHeader: false,

  // Preserve every path and query when moving the public site to its new domain.
  async redirects() {
    return ['railogistics.us', 'www.railogistics.us', 'www.raidispatch.com'].map((host) => ({
      source: '/:path*', has: [{ type: 'host', value: host }],
      destination: 'https://raidispatch.com/:path*', permanent: true,
    }));
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    ] }];
  },
  images: {
    qualities: [75, 90],
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
