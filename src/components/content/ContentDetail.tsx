import Link from 'next/link';
import { ArrowRight, Check, ChevronRight, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { SITE_URL } from '@/lib/seo';
import { DISPATCH_RATE_RANGE, getDispatchRateLabel } from '@/lib/dispatch-pricing';
import EquipmentPhoto from '@/components/EquipmentPhoto';
import { EQUIPMENT_IMAGES } from '@/lib/equipment-images';
import type { CarrierGuide, ContentLink, DispatchContent } from '@/lib/dispatch-content';

export function ContentJsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function ContentBreadcrumbs({ items, dark = false }: { items: ContentLink[]; dark?: boolean }) {
  const crumbs = [{ label: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={`mb-8 text-sm ${dark ? 'text-navy-200' : 'text-navy-600'}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {crumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
              {index === crumbs.length - 1 ? <span aria-current="page">{item.label}</span> : <Link className="underline decoration-current/30 underline-offset-4 hover:decoration-current" href={item.href}>{item.label}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <ContentJsonLd data={{
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: `${SITE_URL}${item.href === '/' ? '' : item.href}` })),
      }} />
    </>
  );
}

export function ContentCTA() {
  return (
    <section className="bg-navy-950 py-14 text-white" aria-labelledby="content-cta-title">
      <div className="container-custom flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Start with your truck and your lanes</p>
          <h2 id="content-cta-title" className="text-3xl sm:text-4xl">Talk through your operation.</h2>
          <p className="mt-4 leading-relaxed text-navy-200">Tell us your equipment, current location and preferred lanes. We will review service fit and explain the dispatch fee before you start.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link href="/contact" className="btn-primary">Request a dispatch review <ArrowRight size={18} aria-hidden="true" /></Link>
          <a href={BUSINESS.phoneHref} className="btn-ghost-light"><Phone size={18} aria-hidden="true" /> {BUSINESS.phone}</a>
        </div>
      </div>
    </section>
  );
}

function EquipmentHero({ content, feeLabel, path }: { content: DispatchContent; feeLabel: string; path: string }) {
  return (
    <header className="border-b border-surface-200 bg-surface-50 py-8 sm:py-12">
      <div className="container-custom">
        <ContentBreadcrumbs items={[{ label: 'Equipment', href: '/equipment' }, { label: content.title, href: path }]} />
        <div className="grid items-center gap-x-12 gap-y-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 className="text-4xl leading-[1.05] text-navy-950 sm:text-5xl lg:text-[3.25rem]">{content.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-display text-4xl font-bold text-primary-700">{feeLabel}<span className="ml-2 font-sans text-sm font-medium text-navy-600">dispatch fee</span></p>
              <span className="rounded-full border border-surface-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-700">Dedicated dispatcher</span>
            </div>
          </div>
          <div className="w-full overflow-hidden rounded-xl border border-surface-200 bg-white lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <EquipmentPhoto slug={content.slug} priority sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, (min-width: 768px) 720px, calc(100vw - 40px)" className="w-full h-auto" />
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <p className="max-w-2xl text-base leading-relaxed text-navy-700 sm:text-lg">{content.intro}</p>
            <ul className="mt-5 space-y-2.5 text-sm text-navy-800">
              {content.highlights.map((highlight) => <li key={highlight} className="flex items-start gap-2"><Check size={17} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />{highlight}</li>)}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/contact" className="btn-primary">Discuss your equipment <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold text-navy-800 underline underline-offset-4 hover:text-primary-700">View pricing details</Link>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-5 text-navy-600">Percentage of gross revenue on loads we dispatch. Confirm the billing base and service scope before starting.</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function ContentDetail({ content, category, guide }: { content: DispatchContent; category: 'equipment' | 'services' | 'resources' | 'carriers'; guide?: CarrierGuide }) {
  const categoryLabel = { equipment: 'Equipment', services: 'Services', resources: 'Carrier resources', carriers: 'Carriers' }[category];
  const path = `/${category}/${content.slug}`;
  const url = `${SITE_URL}${path}`;
  const feeLabel = category === 'equipment' ? getDispatchRateLabel(content.slug) : DISPATCH_RATE_RANGE;
  const equipmentImage = category === 'equipment' ? EQUIPMENT_IMAGES[content.slug] : undefined;
  return (
    <>
      <ContentJsonLd data={guide ? {
        '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
        headline: content.title, description: content.description, url,
        datePublished: guide.published, dateModified: guide.updated ?? guide.published, inLanguage: 'en-US',
        author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: BUSINESS.name, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: `${SITE_URL}/opengraph-image`,
      } : {
        '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`,
        name: content.title, serviceType: content.title, description: content.availability ? `${content.description} ${content.availability}` : content.description,
        url, provider: { '@id': `${SITE_URL}/#organization` },
        ...(equipmentImage ? { image: { '@type': 'ImageObject', url: `${SITE_URL}${equipmentImage.src}`, width: equipmentImage.width, height: equipmentImage.height, caption: equipmentImage.alt } } : {}),
        areaServed: { '@type': 'Place', name: 'Contiguous United States' },
        offers: {
          '@type': 'Offer', url: `${SITE_URL}/pricing`,
          description: `${feeLabel} of gross revenue on loads we dispatch.${category === 'equipment' ? '' : ' Rate depends on truck type.'} Dedicated truck dispatcher included; billing terms confirmed before service.`,
        },
      }} />

      <article>
        {equipmentImage ? <EquipmentHero content={content} feeLabel={feeLabel} path={path} /> : <header className="bg-navy-950 py-10 text-white sm:py-14">
          <div className="container-custom">
            <ContentBreadcrumbs dark items={[{ label: categoryLabel, href: `/${category}` }, { label: content.title, href: path }]} />
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="eyebrow">{content.eyebrow}</p>
                <h1 className="max-w-4xl text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">{content.title}</h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-navy-200">{content.intro}</p>
                {guide && <p className="mt-5 text-sm text-navy-300">By {BUSINESS.name} · <time dateTime={guide.published}>{new Date(`${guide.published}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time> · {guide.readTime}{guide.updated && guide.updated !== guide.published && <> · Updated <time dateTime={guide.updated}>{new Date(`${guide.updated}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></>}</p>}
                <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white">
                  {content.highlights.map((highlight) => <li key={highlight} className="flex items-center gap-2"><Check size={17} className="shrink-0 text-primary-400" aria-hidden="true" />{highlight}</li>)}
                </ul>
              </div>
              {!guide && <div className="border-t border-white/20 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="text-sm uppercase tracking-[0.15em] text-navy-200">Percentage dispatch plan</p>
                <p className="mt-2 font-display text-6xl font-bold text-primary-400">{feeLabel}</p>
                <p className="mt-3 text-sm leading-relaxed text-navy-200">{category === 'equipment' ? 'For this equipment type.' : 'Rate depends on your truck type.'} Dedicated truck dispatcher included. Confirm the billing base and service scope before starting.</p>
                <Link href="/contact" className="btn-primary mt-6 w-full">Discuss your truck <ArrowRight size={18} aria-hidden="true" /></Link>
                <Link href="/pricing" className="mt-4 inline-block text-sm text-navy-200 underline underline-offset-4 hover:text-white">View pricing details</Link>
              </div>}
            </div>
          </div>
        </header>}

        <div className="container-custom py-12 sm:py-16">
          {content.availability && <p className="mb-10 border-l-4 border-accent-700 bg-accent-50 p-5 text-sm leading-relaxed text-navy-800"><strong>Availability review: </strong>{content.availability}</p>}
          <nav aria-label="On this page" className="mb-8 rounded-lg border border-surface-300 p-5 lg:hidden">
            <details>
              <summary className="cursor-pointer font-semibold text-navy-900">Explore this {guide ? 'guide' : 'service'}</summary>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-navy-700">
                {content.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="hover:text-primary-700 hover:underline">{section.title}</a></li>)}
                <li><a href="#questions" className="hover:text-primary-700 hover:underline">Common questions</a></li>
              </ul>
            </details>
          </nav>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <div className="max-w-3xl">
              {content.sections.map((section) => (
                <section id={section.id} key={section.id} className="mb-12 scroll-mt-28">
                  <h2 className="mb-5 text-3xl leading-tight text-navy-950">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph} className="mb-4 leading-8 text-navy-700">{paragraph}</p>)}
                  {section.bullets && <ul className="mt-5 space-y-3 border-l-2 border-primary-200 pl-5">
                    {section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 leading-7 text-navy-700"><Check className="mt-1 shrink-0 text-primary-600" size={18} aria-hidden="true" />{bullet}</li>)}
                  </ul>}
                  {section.table && <div className="mt-6 overflow-x-auto rounded-lg border border-surface-300">
                    <table className="w-full text-left text-sm">
                      <caption className="border-b border-surface-300 bg-surface-100 p-4 text-left font-medium text-navy-700">{section.table.caption}</caption>
                      <thead><tr>{section.table.headers.map((header) => <th key={header} scope="col" className="bg-surface-50 px-4 py-3 font-semibold text-navy-950">{header}</th>)}</tr></thead>
                      <tbody>{section.table.rows.map((row) => <tr key={row[0]} className="border-t border-surface-200">{row.map((cell, i) => i === 0 ? <th key={i} scope="row" className="px-4 py-3 font-medium text-navy-800">{cell}</th> : <td key={i} className="px-4 py-3 text-navy-700">{cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>}
                </section>
              ))}
              <section id="questions" className="scroll-mt-28 border-t border-surface-300 pt-10" aria-labelledby="detail-faq-title">
                <p className="eyebrow">Questions carriers ask</p>
                <h2 id="detail-faq-title" className="mb-6 text-3xl">Practical answers before you start</h2>
                <div className="space-y-6">
                  {content.faqs.map((faq) => <div key={faq.question}><h3 className="mb-2 text-xl text-navy-950">{faq.question}</h3><p className="leading-7 text-navy-700">{faq.answer}</p></div>)}
                </div>
              </section>
              {guide?.sources && <section className="mt-10 border-t border-surface-300 pt-6" aria-labelledby="sources-title"><h2 id="sources-title" className="text-2xl">References</h2><ul className="mt-3 space-y-2">{guide.sources.map((source) => <li key={source.href}><a href={source.href} className="text-accent-800 underline underline-offset-4 hover:text-accent-950">{source.label}</a></li>)}</ul><p className="mt-3 text-sm leading-6 text-navy-600">Check the current source for entity-specific information. This guide explains dispatch preparation and is not a substitute for professional advice on your operation.</p></section>}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <nav aria-label="On this page" className="hidden rounded-lg border border-surface-300 p-6 lg:block">
                <h2 className="text-xl">On this page</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-navy-700">
                  {content.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="hover:text-primary-700 hover:underline">{section.title}</a></li>)}
                  <li><a href="#questions" className="hover:text-primary-700 hover:underline">Common questions</a></li>
                </ul>
              </nav>
              <section className="rounded-lg bg-surface-100 p-6">
                <h2 className="text-2xl">{content.checklistTitle}</h2>
                <ul className="mt-5 space-y-4">{content.checklist.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-navy-700"><Check size={17} className="mt-1 shrink-0 text-primary-600" aria-hidden="true" />{item}</li>)}</ul>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary-700 hover:underline">Discuss your operation <ArrowRight size={17} aria-hidden="true" /></Link>
              </section>
              <section className="rounded-lg border border-surface-300 p-6">
                <h2 className="text-xl">Continue exploring</h2>
                <ul className="mt-4 space-y-4">{content.related.map((item) => <li key={item.href}><Link href={item.href} className="inline-flex items-center gap-2 text-sm font-medium text-accent-800 hover:underline">{item.label}<ArrowRight className="shrink-0" size={15} aria-hidden="true" /></Link></li>)}</ul>
              </section>
            </aside>
          </div>
        </div>
      </article>
      <ContentCTA />
    </>
  );
}
