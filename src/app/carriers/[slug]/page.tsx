import { notFound } from 'next/navigation';
import ContentDetail from '@/components/content/ContentDetail';
import { CARRIER_CONTENT } from '@/lib/carrier-content';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CARRIER_CONTENT.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const carrier = CARRIER_CONTENT.find((item) => item.slug === slug);
  if (!carrier) notFound();
  return pageMetadata(carrier.metaTitle, carrier.description, `/carriers/${slug}`);
}

export default async function CarrierDetailPage({ params }: Props) {
  const { slug } = await params;
  const carrier = CARRIER_CONTENT.find((item) => item.slug === slug);
  if (!carrier) notFound();
  return <ContentDetail content={carrier} category="carriers" />;
}
