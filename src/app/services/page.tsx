import { pageMetadata } from '@/lib/seo';
import ServicesPageClient from './ServicesPageClient';

export const metadata = pageMetadata('Truck Dispatch Services for Owner-Operators & Fleets', 'Compare freight dispatch services: load booking, rate negotiation, broker calls, appointment scheduling and paperwork. Find support for your truck and lanes.', "/services");

export default function ServicesPage() {
  return <ServicesPageClient />;
}
