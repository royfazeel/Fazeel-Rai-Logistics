#!/usr/bin/env node
/**
 * Rebuild the responsive homepage photographs without changing their framing.
 * Run from any directory: node scripts/optimize-hero-images.mjs
 * Uses Sharp installed with Next.js. The original PNG remains the source of truth.
 *
 * Filenames are versioned for immutable CDN/browser caching. Increment VERSION
 * whenever the source, crop, quality, or output dimensions change.
 */
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const source = fileURLToPath(new URL('../public/images/rai-dispatch-hero-realistic.png', import.meta.url));
const outputDirectory = fileURLToPath(new URL('../public/images/hero/', import.meta.url));
const VERSION = 'v1';
const WEBP_QUALITY = 85;
const AVIF_QUALITY = 65;

// Exact source rectangles reproduce the existing right-aligned CSS crops.
// No output is larger than its source rectangle.
const variants = [
  { name: 'desktop', crop: { left: 0, top: 0, width: 1916, height: 821 }, widths: [960, 1440, 1916] },
  { name: 'phone', crop: { left: 726, top: 0, width: 1190, height: 821 }, widths: [480, 768, 1190] },
  { name: 'tablet', crop: { left: 438, top: 0, width: 1478, height: 821 }, widths: [768, 1200, 1478] },
];

const metadata = await sharp(source).metadata();
if (metadata.width !== 1916 || metadata.height !== 821) {
  throw new Error('The hero source dimensions changed. Review the crop rectangles and increment VERSION before regenerating.');
}
await mkdir(outputDirectory, { recursive: true });

const results = [];
for (const variant of variants) {
  for (const width of variant.widths) {
    const filename = `truck-${variant.name}-${width}-${VERSION}`;
    const resized = sharp(source)
      .extract(variant.crop)
      .resize({ width, withoutEnlargement: true });
    for (const format of ['webp', 'avif']) {
      const encoded = format === 'webp'
        ? resized.clone().webp({ quality: WEBP_QUALITY, effort: 6 })
        : resized.clone().avif({ quality: AVIF_QUALITY, effort: 6, chromaSubsampling: '4:4:4' });
      const info = await encoded.toFile(`${outputDirectory}/${filename}.${format}`);
      results.push({ filename: `${filename}.${format}`, width: info.width, height: info.height, bytes: info.size });
    }
  }
}
console.log(JSON.stringify({ version: VERSION, quality: { webp: WEBP_QUALITY, avif: AVIF_QUALITY }, variants: results }, null, 2));
