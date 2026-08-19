import { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent and affordable truck dispatch pricing. Weekly flat rates from $250, monthly contracts, or 5-7% of gross. No hidden fees.',
};

export default function PricingPage() {
  return <PricingPageClient />;
}
