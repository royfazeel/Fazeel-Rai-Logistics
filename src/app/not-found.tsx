import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Rai Dispatch' },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <section className="container-custom py-24">
    <p className="eyebrow">404 · Page not found</p>
    <h1 className="font-display text-5xl font-bold text-navy-950 mb-6">That page isn&apos;t here</h1>
    <p className="text-navy-600 mb-8">The address may have changed or the page may no longer exist. Find dispatch support for your equipment or get in touch.</p>
    <div className="flex flex-wrap gap-4">
      {[
        ['/equipment', 'Equipment types'], ['/pricing', 'Dispatch fees'],
        ['/contact', 'Contact Rai Dispatch'], ['/resources', 'Carrier resources'],
      ].map(([href, label]) => <Link key={href} className="inline-flex min-h-11 items-center text-primary-700 underline px-2" href={href}>{label}</Link>)}
    </div>
  </section>;
}
