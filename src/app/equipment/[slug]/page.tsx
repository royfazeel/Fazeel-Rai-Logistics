import { notFound } from 'next/navigation';
import ContentDetail from '@/components/content/ContentDetail';
import { EQUIPMENT_CONTENT } from '@/lib/dispatch-content';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return EQUIPMENT_CONTENT.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const equipment = EQUIPMENT_CONTENT.find((item) => item.slug === slug);
  if (!equipment) notFound();
  return pageMetadata(equipment.metaTitle, equipment.description, `/equipment/${slug}`);
}

export default async function EquipmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const equipment = EQUIPMENT_CONTENT.find((item) => item.slug === slug);
  if (!equipment) notFound();
  return <ContentDetail content={equipment} category="equipment" />;
}
