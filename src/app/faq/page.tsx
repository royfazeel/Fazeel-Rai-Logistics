import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import { pageMetadata } from '@/lib/seo';
import FAQPageClient from './FAQPageClient';

export const metadata = pageMetadata('Truck Dispatch FAQs | Pricing, Loads & Setup', `Answers about equipment-based truck dispatch fees of ${DISPATCH_RATE_RANGE}, your dedicated dispatcher, load approval, required documents and carrier onboarding.`, "/faq");

export default function FAQPage() {
  return <FAQPageClient />;
}
