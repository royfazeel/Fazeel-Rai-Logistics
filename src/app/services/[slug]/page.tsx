import { notFound } from 'next/navigation';
import ContentDetail from '@/components/content/ContentDetail';
import { SERVICE_CONTENT } from '@/lib/dispatch-content';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_CONTENT.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = SERVICE_CONTENT.find((item) => item.slug === slug);
  if (!service) notFound();
  return pageMetadata(service.metaTitle, service.description, `/services/${slug}`);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICE_CONTENT.find((item) => item.slug === slug);
  if (!service) notFound();
  return <ContentDetail content={service} category="services" />;
}
