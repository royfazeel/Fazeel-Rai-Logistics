import Image from 'next/image';

/** The approved Forward RD identity, with a matching version for each surface. */
export default function BrandLogo({
  onDark = false,
  className = '',
  priority = false,
}: {
  onDark?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/rai-dispatch-logo-${onDark ? 'dark' : 'light'}.svg`}
      alt="Rai Dispatch — Truck Dispatch Services"
      width={1208}
      height={166}
      className={`h-auto ${className}`}
      priority={priority}
    />
  );
}
