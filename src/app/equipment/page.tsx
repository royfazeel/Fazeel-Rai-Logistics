import { pageMetadata } from '@/lib/seo';
import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import EquipmentPageClient from './EquipmentPageClient';

export const metadata = pageMetadata('Truck Dispatch Services by Equipment Type', `Explore 15 truck and trailer types, from dry vans and reefers to Sprinter vans, Conestogas and lowboys. ${DISPATCH_RATE_RANGE} dispatch fees, free setup and dedicated support.`, '/equipment');

export default function EquipmentPage() {
  return <EquipmentPageClient />;
}
