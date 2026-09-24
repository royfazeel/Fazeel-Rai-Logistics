import { pageMetadata } from '@/lib/seo';
import PricingPageClient from './PricingPageClient';

export const metadata = pageMetadata('Truck Dispatch Pricing | Fees Up to 5%', 'Truck dispatch fees up to 5% of gross load revenue. See what is included, how the fee is calculated, and options for owner-operators and fleets.', "/pricing");

export default function PricingPage() {
  return <PricingPageClient />;
}
