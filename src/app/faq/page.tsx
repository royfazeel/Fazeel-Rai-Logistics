import { pageMetadata } from '@/lib/seo';
import FAQPageClient from './FAQPageClient';

export const metadata = pageMetadata('Truck Dispatch FAQs | Pricing, Loads & Setup', 'Answers about truck dispatch fees up to 5%, load approval, required documents, equipment, service coverage and carrier onboarding.', "/faq");

export default function FAQPage() {
  return <FAQPageClient />;
}
