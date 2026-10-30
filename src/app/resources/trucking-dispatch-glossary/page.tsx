import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { ContentBreadcrumbs, ContentCTA, ContentJsonLd } from '@/components/content/ContentDetail';
import { BUSINESS } from '@/lib/constants';
import { DISPATCH_TERMS, GLOSSARY_GROUPS, GLOSSARY_PATH, GLOSSARY_REVIEWED, GLOSSARY_SOURCES } from '@/lib/dispatch-glossary';
import { pageMetadata, SITE_URL } from '@/lib/seo';

const title = 'Truck Dispatch Glossary: Freight Terms for Carriers';
const description = 'Understand 40 trucking and dispatch terms, from deadhead and rate confirmations to detention, TONU and load types. Practical definitions and carrier guides.';
const url = `${SITE_URL}${GLOSSARY_PATH}`;
const sortedTerms = [...DISPATCH_TERMS].sort((first, second) => first.name.localeCompare(second.name, 'en'));

export const metadata = pageMetadata(title, description, GLOSSARY_PATH);

export default function TruckingDispatchGlossaryPage() {
  return (
    <>
      <ContentJsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
            inLanguage: 'en-US', datePublished: GLOSSARY_REVIEWED, dateModified: GLOSSARY_REVIEWED,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            mainEntity: { '@id': `${url}#term-set` },
          },
          {
            '@type': 'DefinedTermSet', '@id': `${url}#term-set`, url,
            name: 'Truck dispatch and freight glossary for carriers', description,
            inLanguage: 'en-US', datePublished: GLOSSARY_REVIEWED, dateModified: GLOSSARY_REVIEWED,
            author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: BUSINESS.name, url: SITE_URL },
            citation: GLOSSARY_SOURCES.map(source => source.href),
            hasDefinedTerm: DISPATCH_TERMS.map(term => ({
              '@type': 'DefinedTerm', '@id': `${url}#${term.id}`,
              url: `${url}#${term.id}`, name: term.name, description: term.definition,
              inDefinedTermSet: { '@id': `${url}#term-set` },
            })),
          },
        ],
      }} />
      <article>
        <header className="bg-navy-950 py-10 text-white sm:py-14">
          <div className="container-custom">
            <ContentBreadcrumbs dark items={[{ label: 'Carrier resources', href: '/resources' }, { label: 'Dispatch glossary', href: GLOSSARY_PATH }]} />
            <p className="eyebrow">The carrier’s desk · Reference</p>
            <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">Truck dispatch and freight glossary.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-200">Understand the terms used when searching, approving and completing a load. These {DISPATCH_TERMS.length} definitions explain what to check, not just what an abbreviation stands for.</p>
            <p className="mt-4 max-w-3xl leading-7 text-navy-200">This reference is for owner-operators and carrier teams reviewing dispatch services. It is not a dispatcher training course or a listing of driving jobs.</p>
            <p className="mt-5 text-sm text-navy-300">By {BUSINESS.name} · Reviewed <time dateTime={GLOSSARY_REVIEWED}>October 30, 2026</time></p>
          </div>
        </header>

        <div className="container-custom py-10 sm:py-14">
          <nav aria-label="Glossary topics" className="mb-10 rounded-lg border border-surface-300 bg-surface-50 p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3"><BookOpen size={24} className="shrink-0 text-primary-700" aria-hidden="true" /><h2 className="text-2xl sm:text-3xl">Browse by topic</h2></div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GLOSSARY_GROUPS.map(group => <li key={group.id}><a href={`#${group.id}`} className="inline-flex items-center gap-2 font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800">{group.title}<ArrowRight size={16} aria-hidden="true" /></a></li>)}
            </ul>
          </nav>

          <nav id="term-index" aria-labelledby="term-index-title" className="mb-14 scroll-mt-28">
            <h2 id="term-index-title" className="text-3xl">Find a term: A–Z</h2>
            <p className="mb-6 mt-3 max-w-3xl leading-7 text-navy-700">Choose a term below, or use your browser’s Find command to search this page. Every definition is visible on the page.</p>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedTerms.map(term => <li key={term.id}><a href={`#${term.id}`} className="text-sm leading-6 text-primary-700 underline underline-offset-4 hover:text-primary-800">{term.name}</a></li>)}
            </ul>
          </nav>

          <div className="space-y-14">
            {GLOSSARY_GROUPS.map(group => <section id={group.id} key={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-28">
              <div className="max-w-3xl">
                <h2 id={`${group.id}-title`} className="text-3xl sm:text-4xl">{group.title}</h2>
                <p className="mb-7 mt-4 leading-8 text-navy-700">{group.description}</p>
              </div>
              <dl className="grid gap-5 lg:grid-cols-2">
                {group.terms.map(term => <div key={term.id} id={term.id} className="scroll-mt-28 rounded-lg border border-surface-300 bg-white p-6 sm:p-8">
                  <dt className="font-display text-2xl font-semibold text-navy-950">{term.name}</dt>
                  <dd className="mt-4">
                    <p className="leading-8 text-navy-700">{term.definition}</p>
                    <Link href={term.related.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800">{term.related.label}<ArrowRight size={16} className="shrink-0" aria-hidden="true" /></Link>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-navy-600">
                      <a href={`#${term.id}`} aria-label={`Direct link to ${term.name}`} className="underline underline-offset-4 hover:text-primary-700">Link to this term</a>
                      {term.sourceId && <a href={`#${term.sourceId}`} className="underline underline-offset-4 hover:text-primary-700">Source reference</a>}
                    </div>
                  </dd>
                </div>)}
              </dl>
              <a href="#term-index" className="mt-6 inline-block text-sm font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800">Back to A–Z</a>
            </section>)}
          </div>

          <section id="sources" aria-labelledby="sources-title" className="mt-14 scroll-mt-28 rounded-lg border border-surface-300 bg-surface-50 p-6 sm:p-8">
            <h2 id="sources-title" className="text-3xl">Sources and how to use this reference</h2>
            <p className="mt-4 max-w-3xl leading-8 text-navy-700">Definitions are written for practical carrier dispatch decisions. The references below support regulatory, tax, insurance and industry terminology. Provider examples do not establish Rai Dispatch’s affiliations, platform subscriptions or payment policies.</p>
            <ul className="mt-6 grid gap-4 lg:grid-cols-2">
              {GLOSSARY_SOURCES.map(source => <li id={source.id} key={source.id} className="scroll-mt-28"><a href={source.href} className="text-sm leading-7 text-primary-700 underline underline-offset-4 hover:text-primary-800">{source.label}</a></li>)}
            </ul>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-navy-600">A glossary does not replace shipment instructions, your written agreements or the rules that apply to your operation. Confirm current requirements with the relevant authority or provider. <Link href="/resources" className="font-semibold text-primary-700 underline underline-offset-4">Continue with the carrier guides</Link> for checklists and worked examples. See our <Link href="/editorial-standards" className="font-semibold text-primary-700 underline underline-offset-4">editorial standards and correction process</Link>.</p>
          </section>
        </div>
      </article>
      <ContentCTA />
    </>
  );
}
