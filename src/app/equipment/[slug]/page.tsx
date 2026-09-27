import { notFound } from 'next/navigation';
import ContentDetail from '@/components/content/ContentDetail';
import { EQUIPMENT_CONTENT } from '@/lib/dispatch-content';
import { pageMetadata } from '@/lib/seo';
import { EQUIPMENT_IMAGES } from '@/lib/equipment-images';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return EQUIPMENT_CONTENT.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const equipment = EQUIPMENT_CONTENT.find((item) => item.slug === slug);
  if (!equipment) notFound();
  const metadata = pageMetadata(equipment.metaTitle, equipment.description, `/equipment/${slug}`);
  const photo = EQUIPMENT_IMAGES[slug];
  if (!photo) return metadata;
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: photo.src, width: photo.width, height: photo.height, alt: photo.alt }],
    },
    twitter: { ...metadata.twitter, images: [photo.src] },
  };
}

export default async function EquipmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const equipment = EQUIPMENT_CONTENT.find((item) => item.slug === slug);
  if (!equipment) notFound();
  return <ContentDetail content={equipment} category="equipment" />;
}
