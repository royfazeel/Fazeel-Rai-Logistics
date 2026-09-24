import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { ContentBreadcrumbs, ContentCTA, ContentJsonLd } from '@/components/content/ContentDetail';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata = pageMetadata('Nationwide Truck Dispatch | Lower 48 Service Areas', 'Truck dispatch support across the 48 contiguous states. Explore regional lane considerations for dry van, reefer, flatbed, box truck and power only carriers.', '/service-areas');

const regions = [
  { name: 'West Coast', states: 'California, Oregon, Washington', focus: 'Plan the full outbound and return cycle.', details: 'Clarify appointment timing, delivery access and the next realistic pickup before accepting a long westbound or eastbound trip. For refrigerated freight, confirm handling instructions and preparation time. Port-related work has specific access and equipment requirements and needs a separate service review.', questions: ['Does the delivery time leave a workable reload window?', 'Does the carrier meet any facility-specific access requirements?'], link: { label: 'Reefer dispatch considerations', href: '/equipment/reefer' } },
  { name: 'Mountain West & Southwest', states: 'Arizona, Colorado, Idaho, Montana, Nevada, New Mexico, Utah, Wyoming', focus: 'Allow for distance between practical pickup options.', details: 'Review empty miles, available fuel stops, weather and the actual truck route when considering a shipment. Mountain or remote delivery sites can change the time a trip needs. Carrier and driver route verification remains essential, particularly for open-deck or dimension-sensitive freight.', questions: ['How far is the next suitable pickup from delivery?', 'Have weather, terrain and vehicle restrictions been reviewed?'], link: { label: 'Route and lane planning', href: '/services/route-strategy' } },
  { name: 'Midwest & Great Plains', states: 'Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North Dakota, Ohio, South Dakota, Wisconsin', focus: 'Coordinate facilities, equipment and the next appointment.', details: 'A regional sequence can look efficient on a map but still fail if loading times or appointment windows conflict. Verify each facility’s instructions and leave room for realistic unloading. Equipment fit, seasonal conditions and the carrier’s home-time plan should guide the search.', questions: ['Can both appointments be met with realistic loading time?', 'Does the next load fit the equipment that is actually available?'], link: { label: 'Dry van dispatch planning', href: '/equipment/dry-van' } },
  { name: 'South Central', states: 'Arkansas, Louisiana, Oklahoma, Texas', focus: 'Review site access and the work behind the rate.', details: 'Long distances within the region make pickup deadhead and destination planning important. Open-deck or industrial-site freight can have specific loading, securement and appointment needs. Confirm any specialized scope rather than treating all material or machinery loads alike.', questions: ['Are cargo dimensions and loading methods clear?', 'Are tarping, driver work and extra stops reflected in the terms?'], link: { label: 'Flatbed dispatch details', href: '/equipment/flatbed' } },
  { name: 'Southeast', states: 'Alabama, Florida, Georgia, Kentucky, Mississippi, North Carolina, South Carolina, Tennessee, Virginia, West Virginia', focus: 'Evaluate return options and delivery timing together.', details: 'Compare the loaded rate with the complete trip, especially when a destination takes the truck away from the next desired lane. Weather disruptions and time-sensitive shipments can change a planned sequence. A potential backhaul should remain a planning assumption until booked.', questions: ['What is the plan if the expected backhaul is unavailable?', 'Do delivery and home-time commitments leave enough flexibility?'], link: { label: 'Evaluate total-trip rate per mile', href: '/resources/evaluate-freight-rate-per-mile' } },
  { name: 'Northeast & Mid-Atlantic', states: 'Connecticut, Delaware, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, Pennsylvania, Rhode Island, Vermont, plus Washington, DC', focus: 'Account for access, tolls and appointment constraints.', details: 'Urban delivery windows, parking and facility access can matter as much as trip distance. Review toll assumptions and truck-suitable routing. For box trucks, confirm dock height, liftgate needs and unloading responsibility instead of assuming a smaller truck can serve every address.', questions: ['Are truck access and unloading arrangements confirmed?', 'Have tolls and delivery-window constraints been included?'], link: { label: 'Box truck dispatch requirements', href: '/equipment/box-truck' } },
];

export default function ServiceAreasPage() {
  return (
    <>
      <ContentJsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${SITE_URL}/service-areas#page`, name: 'Truck dispatch across the contiguous United States', url: `${SITE_URL}/service-areas`, about: { '@type': 'Service', name: 'Truck dispatch services', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: { '@type': 'Place', name: '48 contiguous United States' } } }} />
      <section className="bg-navy-950 py-10 text-white sm:py-16">
        <div className="container-custom">
          <ContentBreadcrumbs dark items={[{ label: 'US service areas', href: '/service-areas' }]} />
          <p className="eyebrow">Nationwide dispatch. Your lane preferences.</p>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">Truck dispatch across<br />the lower 48 states.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-200">Rai Dispatch supports owner-operators and small fleets running regional and over-the-road freight across the contiguous United States. We plan around your truck, your schedule and the lanes you choose.</p>
          <div className="mt-8 flex flex-wrap gap-4"><Link className="btn-primary" href="/contact">Discuss your lanes <ArrowRight size={18} aria-hidden="true" /></Link><Link className="btn-ghost-light" href="/equipment">Find your equipment type</Link></div>
        </div>
      </section>

      <section className="section-padding" aria-labelledby="coverage-heading">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-[1fr_320px]">
            <div><p className="eyebrow">Coverage that starts with a conversation</p><h2 id="coverage-heading" className="section-heading">A national service area is not a promise of a load in every ZIP code.</h2><p className="mt-5 max-w-3xl leading-8 text-navy-700">Location, equipment, broker requirements and freight availability determine which opportunities fit. Share your empty location, maximum pickup radius, preferred destinations and home-time goal so we can assess a workable search. Local-only or dedicated routes need a specific availability review.</p></div>
            <aside className="rounded-lg bg-surface-100 p-7"><p className="font-display text-5xl font-bold text-primary-600">Up to 5%</p><p className="mt-3 leading-7 text-navy-700">Percentage dispatch fee, with the billing base and service scope confirmed before you start.</p><Link href="/pricing" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary-700 hover:underline">View pricing <ArrowRight size={17} aria-hidden="true" /></Link></aside>
          </div>
          <nav aria-label="Jump to region" className="mt-10 flex flex-wrap gap-3">{regions.map((region, index) => <a key={region.name} href={`#region-${index}`} className="rounded-full border border-surface-300 px-4 py-2 text-sm text-navy-700 hover:border-primary-600 hover:text-primary-700">{region.name}</a>)}</nav>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {regions.map((region, index) => <section id={`region-${index}`} key={region.name} className="scroll-mt-28 rounded-lg border border-surface-300 p-7 sm:p-9">
              <MapPin className="mb-4 text-primary-600" size={26} aria-hidden="true" />
              <h2 className="text-3xl">{region.name}</h2><p className="mt-3 text-sm leading-6 text-navy-600">{region.states}</p>
              <h3 className="mt-6 text-xl">{region.focus}</h3><p className="mt-3 leading-7 text-navy-700">{region.details}</p>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-navy-700">{region.questions.map((question) => <li key={question}>{question}</li>)}</ul>
              <Link href={region.link.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-800 hover:underline">{region.link.label}<ArrowRight size={16} aria-hidden="true" /></Link>
            </section>)}
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-14" aria-labelledby="area-faq-title">
        <div className="container-custom grid gap-10 md:grid-cols-[1fr_2fr]">
          <div><p className="eyebrow">Coverage questions</p><h2 id="area-faq-title" className="section-heading">Plan the lane before the load.</h2></div>
          <div className="space-y-7">
            <div><h3 className="text-2xl">Do you serve carriers based in any US state?</h3><p className="mt-3 leading-7 text-navy-700">We can discuss a carrier’s operation wherever its business is based. Our advertised road-freight dispatch coverage is the 48 contiguous states. Alaska, Hawaii and cross-border shipments require a separate service review and are not assumed to be included.</p></div>
            <div><h3 className="text-2xl">Can I request local or regional dispatch near me?</h3><p className="mt-3 leading-7 text-navy-700">Yes. Give us your base location, preferred radius and equipment. We coordinate dispatch remotely and confirm suitable local or regional opportunities for your equipment before you start.</p></div>
            <div><h3 className="text-2xl">Do you guarantee return loads or home time?</h3><p className="mt-3 leading-7 text-navy-700">We use your home-time preferences when planning lanes, but freight availability and operating conditions can change. Return freight is only confirmed when a specific load has been approved and booked.</p></div>
            <div><h3 className="text-2xl">Which equipment can run these lanes?</h3><p className="mt-3 leading-7 text-navy-700">We review dry van, reefer, flatbed, box truck and power only operations. Step deck, hotshot and cargo van inquiries require a specialized availability review. The actual shipment must fit the equipment, carrier requirements and schedule.</p><Link href="/equipment" className="mt-3 inline-block font-semibold text-accent-800 hover:underline">Review equipment-specific details</Link></div>
          </div>
        </div>
      </section>
      <ContentCTA />
    </>
  );
}
