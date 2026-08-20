'use client';

import {
  DollarSign,
  Package,
  MessageSquare,
  Route,
  FileText,
  Calendar,
  Truck,
  Snowflake,
  Box,
  Container,
} from 'lucide-react';

const iconMap = {
  DollarSign,
  Package,
  MessageSquare,
  Route,
  FileText,
  Calendar,
  Truck,
  Snowflake,
  Box,
  Container,
};

interface ServiceIconProps {
  name: keyof typeof iconMap;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export default function ServiceIcon({
  name,
  className = '',
  size = 'md',
  animate = true,
}: ServiceIconProps) {
  const Icon = iconMap[name];

  if (!Icon) {
    return null;
  }

  // Flat design system: no hover scale/rotate gimmicks. The `animate` prop is
  // kept for API compatibility — it only controls whether the icon gets a
  // wrapper div (matching the previous DOM structure for existing callers).
  if (animate) {
    return (
      <div className={className}>
        <Icon className={sizes[size]} />
      </div>
    );
  }

  return <Icon className={`${sizes[size]} ${className}`} />;
}

export { iconMap };
