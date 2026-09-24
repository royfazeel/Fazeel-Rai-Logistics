import { pageMetadata } from '@/lib/seo';
import ServicesPageClient from './ServicesPageClient';

export const metadata = pageMetadata('Truck Dispatch & Freight Support Services', 'Explore load booking, freight rate negotiation, broker communication, route planning, paperwork and scheduling support for US carriers.', "/services");

export default function ServicesPage() {
  return <ServicesPageClient />;
}
