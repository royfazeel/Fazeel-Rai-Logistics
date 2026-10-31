import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import { pageMetadata } from '@/lib/seo';
import ServicesPageClient from './ServicesPageClient';

export const metadata = pageMetadata('Truck Dispatch Services for Owner-Operators & Fleets', 'Dedicated truck dispatch, load booking, rate negotiation and paperwork for owner-operators and fleets. Active carriers receive 24/7 live dispatch support.', "/services");

export default function ServicesPage() {
  return <><PageBreadcrumbs label="Dispatch services" path="/services" /><ServicesPageClient /></>;
}
