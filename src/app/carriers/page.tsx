import Link from 'next/link';
import { ArrowRight, Check, ClipboardCheck, Truck, Users } from 'lucide-react';
import { ContentBreadcrumbs, ContentCTA, ContentJsonLd } from '@/components/content/ContentDetail';
import { CARRIER_CONTENT } from '@/lib/carrier-content';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata = pageMetadata(
  'Dispatch for Owner-Operators, Fleets & New Authorities',
  'Explore truck dispatch support for owner-operators, small fleets and new authorities. Review service fit, load approval and fees up to 5% across the lower 48.',
  '/carriers',
);

const carrierIcons = {
  'owner-operators': Truck,
  'small-fleets': Users,
  'new-authorities': ClipboardCheck,
};

export default function CarriersPage() {
  return (
    <>
      <ContentJsonLd data={{
        '@context': 'https://schema.org', '@type': 'CollectionPage',
        '@id': `${SITE_URL}/carriers#page`, name: 'Truck dispatch support by carrier type',
        url: `${SITE_URL}/carriers`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: CARRIER_CONTENT.map((carrier, index) => ({
            '@type': 'ListItem', position: index + 1,
            item: { '@type': 'Service', '@id': `${SITE_URL}/carriers/${carrier.slug}#service`, name: carrier.title, url: `${SITE_URL}/carriers/${carrier.slug}` },
          })),
        },
      }} />
      <section className="bg-navy-950 py-10 text-white sm:py-16">
        <div className="container-custom">
          <ContentBreadcrumbs dark items={[{ label: 'Carriers', href: '/carriers' }]} />
          <p className="eyebrow">Built around your operation</p>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">Truck dispatch for owner-operators, fleets and new authorities.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-200">A single truck, a growing fleet and a newly active authority face different dispatch decisions. Start with your operation, then review the equipment, lanes, communication and paperwork support that fit.</p>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white">
            {['Fees up to 5%', 'You approve the loads', '48 contiguous states'].map(item => <li key={item} className="flex items-center gap-2"><Check size={17} className="shrink-0 text-primary-400" aria-hidden="true" />{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-surface-50" aria-labelledby="carrier-options-heading">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow">Find your starting point</p>
            <h2 id="carrier-options-heading" className="section-heading">The same clear process. Different operating needs.</h2>
            <p className="mt-5 leading-8 text-navy-700">See what to prepare, how load decisions are made and which questions to ask before starting. Your equipment, authority, insurance and broker eligibility still determine which freight you can consider.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {CARRIER_CONTENT.map(carrier => {
              const Icon = carrierIcons[carrier.slug as keyof typeof carrierIcons] || Truck;
              return <article key={carrier.slug} className="flex flex-col rounded-lg border border-surface-300 bg-white p-7">
                <Icon size={34} className="mb-6 text-primary-600" aria-hidden="true" />
                <h3 className="text-3xl leading-tight"><Link href={`/carriers/${carrier.slug}`} className="hover:text-primary-700">{carrier.title}</Link></h3>
                <p className="mt-4 flex-1 leading-7 text-navy-700">{carrier.description}</p>
                <Link href={`/carriers/${carrier.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold text-primary-700 hover:underline" aria-label={`Explore ${carrier.title}`}>Explore your dispatch options <ArrowRight size={18} className="shrink-0" aria-hidden="true" /></Link>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="carrier-fit-heading">
        <div className="container-custom grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Before the first booking</p>
            <h2 id="carrier-fit-heading" className="section-heading">Start with a clear picture of your truck.</h2>
            <p className="mt-5 leading-8 text-navy-700">Tell us your current location, usable equipment dimensions, payload, home-time needs and preferred operating radius. For a fleet, identify who approves loads and which driver or truck details the dispatch desk needs to coordinate.</p>
            <p className="mt-4 leading-8 text-navy-700">We review service fit before making a plan. A new authority can discuss onboarding, but individual brokers set their own eligibility requirements. Dispatch service does not guarantee load access, a freight rate or weekly earnings.</p>
            <Link href="/resources/carrier-onboarding-checklist" className="mt-6 inline-flex items-center gap-2 font-semibold text-accent-800 hover:underline">Prepare your onboarding details <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="space-y-6 rounded-lg border border-surface-300 bg-surface-50 p-7 sm:p-9">
            <div><h3 className="text-2xl">Match the equipment</h3><p className="mt-3 leading-7 text-navy-700">Review the load requirements that apply to dry vans, reefers, flatbeds, box trucks, power only, step decks, hotshot trucks and cargo vans.</p><Link href="/equipment" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary-700 hover:underline">Compare equipment dispatch <ArrowRight size={17} aria-hidden="true" /></Link></div>
            <div className="border-t border-surface-300 pt-6"><h3 className="text-2xl">Agree on the service and fee</h3><p className="mt-3 leading-7 text-navy-700">Percentage dispatch fees are up to 5% of gross revenue on loads we dispatch. Confirm your exact fee, included support, communication plan and billing terms in writing.</p><Link href="/pricing" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary-700 hover:underline">Understand dispatch pricing <ArrowRight size={17} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </section>
      <ContentCTA />
    </>
  );
}
