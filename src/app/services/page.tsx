import { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Dispatch Services',
  description:
    'Full-service truck dispatch including rate negotiation, load booking, broker communication, route strategy, and paperwork support. Professional dispatch for Box Trucks, Dry Vans, Reefers, Flatbeds, and Power Only.',
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
