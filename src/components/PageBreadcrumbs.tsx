import { ContentBreadcrumbs } from '@/components/content/ContentDetail';

export default function PageBreadcrumbs({ label, path }: { label: string; path: string }) {
  return <div className="bg-navy-950 text-white"><div className="container-custom pt-6 [&_nav]:mb-0 pb-4">
    <ContentBreadcrumbs dark items={[{ label, href: path }]} />
  </div></div>;
}
