import { Metadata } from 'next';
import EquipmentPageClient from './EquipmentPageClient';

export const metadata: Metadata = {
  title: 'Equipment We Dispatch',
  description:
    'Specialized dispatch services for Box Trucks, Dry Vans, Flatbeds, Reefers, and Power Only. Equipment-specific expertise with competitive commission rates starting at 5%.',
};

export default function EquipmentPage() {
  return <EquipmentPageClient />;
}
