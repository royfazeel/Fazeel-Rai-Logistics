import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
}

// Retain the layout API while avoiding hidden server-rendered content and
// scroll-triggered motion on long service and resource pages.
export default function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  return <div className={className}>{children}</div>;
}
