'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Site-wide framer-motion configuration.
 *
 * framer-motion animates inline styles with JS, so the CSS
 * prefers-reduced-motion rule in globals.css can't stop it.
 * `reducedMotion="user"` makes every motion component in the tree drop
 * transform/layout animations (keeping opacity) when the visitor's OS
 * requests reduced motion.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
