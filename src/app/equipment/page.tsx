import { pageMetadata } from '@/lib/seo';
import EquipmentPageClient from './EquipmentPageClient';

export const metadata = pageMetadata('Truck Dispatch by Equipment Type', 'Explore dry van, reefer, flatbed, box truck, power only, step deck, hotshot and cargo van dispatch. Equipment and lane fit reviewed before setup.', "/equipment");

export default function EquipmentPage() {
  return <EquipmentPageClient />;
}
