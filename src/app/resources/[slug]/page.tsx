import { notFound } from 'next/navigation';
import ContentDetail from '@/components/content/ContentDetail';
import { GUIDES } from '@/lib/dispatch-content';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES.find((item) => item.slug === slug);
  if (!guide) notFound();
  const metadata = pageMetadata(guide.metaTitle, guide.description, `/resources/${slug}`);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article' as const, publishedTime: guide.published, modifiedTime: guide.published } };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <ContentDetail content={guide} category="resources" guide={guide} />;
}
