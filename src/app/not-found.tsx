import Link from 'next/link';
export default function NotFound() {
  return <section className="container-custom py-24"><p className="eyebrow">404 · Page not found</p><h1 className="font-display text-5xl font-bold text-navy-950 mb-6">Let’s get you back on the road.</h1><p className="text-navy-600 mb-8">This page does not exist. Explore dispatch services or contact our team for help.</p><div className="flex gap-6"><Link className="text-primary-600 underline" href="/services">Dispatch services</Link><Link className="text-primary-600 underline" href="/contact">Contact Rai Dispatch</Link></div></section>;
}
