import { pageMetadata } from '@/lib/seo';
import EquipmentPageClient from './EquipmentPageClient';

export const metadata = pageMetadata('Truck Dispatch Services by Equipment Type', 'Compare dispatch for 15 truck and trailer types, from dry vans and reefers to Sprinter vans, Conestogas and lowboys. Dedicated dispatchers with 5–8% fees.', '/equipment');

export default function EquipmentPage() {
  return <EquipmentPageClient />;
}
