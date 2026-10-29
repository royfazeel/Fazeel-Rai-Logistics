import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { ContentBreadcrumbs, ContentCTA, ContentJsonLd } from '@/components/content/ContentDetail';
import { GUIDES } from '@/lib/dispatch-content';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata = pageMetadata('Truck Dispatch Guides: Loads, Fees & Carrier Setup', 'Compare dispatch services, find suitable truck loads, evaluate rates and prepare carrier documents. Practical guides for owner-operators and small fleets.', '/resources');

const GUIDE_TOPICS = [
  { id: 'dispatch-decisions', title: 'Choose the right dispatch support', description: 'Understand the work a dispatcher handles, compare your options and review the cost before committing.', slugs: ['what-does-a-truck-dispatcher-do', 'how-to-choose-a-truck-dispatcher', 'truck-dispatch-fees', 'self-dispatch-vs-dispatch-service', 'load-board-vs-dispatch-service', 'truck-dispatcher-vs-freight-broker'] },
  { id: 'loads-and-lanes', title: 'Find loads and evaluate the whole trip', description: 'Compare equipment fit, total miles, schedule and destination before deciding whether a load works for your truck.', slugs: ['how-to-find-box-truck-loads', 'local-vs-regional-vs-otr-trucking', 'evaluate-freight-rate-per-mile', 'reduce-deadhead-miles', 'partial-truckload-vs-ltl'] },
  { id: 'carrier-paperwork', title: 'Prepare your carrier and load documents', description: 'Use practical checklists for onboarding, broker review, rate confirmations and accessorial requests.', slugs: ['carrier-onboarding-checklist', 'new-authority-broker-approval', 'rate-confirmation-checklist', 'detention-layover-tonu-documentation'] },
];

export default function ResourcesPage() {
  return (
    <>
      <ContentJsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${SITE_URL}/resources#page`, name: 'Truck dispatch guides for owner-operators', url: `${SITE_URL}/resources`, hasPart: GUIDES.map((guide) => ({ '@type': 'Article', '@id': `${SITE_URL}/resources/${guide.slug}#article`, headline: guide.title, url: `${SITE_URL}/resources/${guide.slug}` })) }} />
      <section className="bg-navy-950 py-10 text-white sm:py-16">
        <div className="container-custom">
          <ContentBreadcrumbs dark items={[{ label: 'Carrier resources', href: '/resources' }]} />
          <p className="eyebrow">The carrier’s desk</p>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">Truck dispatch guides for owner-operators.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-200">Practical truck dispatch guides for owner-operators and small fleets. Understand the fee, evaluate the trip and prepare the information your dispatcher needs.</p>
        </div>
      </section>
      <section className="section-padding bg-surface-50" aria-labelledby="guides-heading">
        <div className="container-custom">
          <div className="mb-10 flex items-center gap-3"><BookOpen className="text-primary-600" size={26} aria-hidden="true" /><h2 id="guides-heading" className="section-heading">Start with the decisions that matter</h2></div>
          <nav aria-label="Guide topics" className="mb-12 flex flex-wrap gap-3">
            {GUIDE_TOPICS.map(topic => <a key={topic.id} href={`#${topic.id}`} className="rounded-lg border border-surface-300 bg-white px-4 py-3 text-sm font-semibold text-primary-700 hover:underline">{topic.title}</a>)}
          </nav>
          {GUIDE_TOPICS.map(topic => <section key={topic.id} id={topic.id} aria-labelledby={`${topic.id}-title`} className="mb-12 scroll-mt-28">
            <h2 id={`${topic.id}-title`} className="text-3xl">{topic.title}</h2>
            <p className="mb-6 mt-3 max-w-3xl leading-7 text-navy-700">{topic.description}</p>
            <div className="grid gap-6 md:grid-cols-2">
            {topic.slugs.map(slug => GUIDES.find(guide => guide.slug === slug)).filter(guide => guide !== undefined).map(guide => <article key={guide.slug} className="flex flex-col rounded-lg border border-surface-300 bg-white p-7 sm:p-9">
              <p className="mb-5 text-sm text-navy-600">{guide.readTime}</p>
              <h3 className="text-3xl"><Link href={`/resources/${guide.slug}`} className="hover:text-primary-700">{guide.title}</Link></h3>
              <p className="mt-4 flex-1 leading-7 text-navy-700">{guide.description}</p>
              <Link href={`/resources/${guide.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold text-primary-700 hover:underline" aria-label={`Read ${guide.title}`}>Read the guide <ArrowRight size={18} aria-hidden="true" /></Link>
            </article>)}
            </div>
          </section>)}
          <div className="mt-12 grid gap-8 rounded-lg border border-surface-300 bg-white p-7 sm:p-9 md:grid-cols-2">
            <div><h2 className="text-3xl">Apply the guide to your equipment</h2><p className="mt-4 leading-7 text-navy-700">The same rate can mean different work in a dry van, reefer, flatbed or box truck. Review the details that matter for your truck before deciding which loads to pursue.</p><Link href="/equipment" className="mt-5 inline-flex items-center gap-2 font-semibold text-accent-800 hover:underline">Explore equipment dispatch <ArrowRight size={18} aria-hidden="true" /></Link></div>
            <div><h2 className="text-3xl">Understand the dispatch scope</h2><p className="mt-4 leading-7 text-navy-700">Learn how load booking, rate negotiation, broker communication, paperwork and scheduling fit together, then decide what support your operation needs.</p><Link href="/services" className="mt-5 inline-flex items-center gap-2 font-semibold text-accent-800 hover:underline">Explore dispatch services <ArrowRight size={18} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </section>
      <ContentCTA />
    </>
  );
}
