import Link from 'next/link';
import { calculateLoadEconomics, EXAMPLE_LOAD, normalizeEquipmentSelection } from '@/lib/load-economics';
import { EQUIPMENT_TYPES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import LoadProfitCalculator from '@/components/LoadProfitCalculator';
import { ContentBreadcrumbs, ContentCTA, ContentJsonLd } from '@/components/content/ContentDetail';
import { pageMetadata, SITE_URL } from '@/lib/seo';

const money = (dollars: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(dollars);

const path = '/tools/load-profit-calculator';
export const metadata = pageMetadata('Truck Load Profit & Break Even Calculator', 'Compare load pay, deadhead, fuel and dispatch fees. Calculate revenue per total mile, remaining after entered costs and the load pay needed to cover them.', path);

export default async function LoadProfitCalculatorPage({ searchParams }: { searchParams: Promise<{ equipment?: string | string[] }> }) {
  const initialEquipment = normalizeEquipmentSelection((await searchParams).equipment);
  const equipmentName = EQUIPMENT_TYPES.find(equipment => equipment.id === initialEquipment)?.name ?? 'Other truck type';
  const example = calculateLoadEconomics({ ...EXAMPLE_LOAD, equipment: initialEquipment });
  return <>
    <ContentJsonLd data={{ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${SITE_URL}${path}#calculator`, name: 'Truck load profit and break even calculator', url: `${SITE_URL}${path}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', isAccessibleForFree: true, offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', url: `${SITE_URL}${path}` }, provider: { '@id': `${SITE_URL}/#organization` } }} />
    <ContentJsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${SITE_URL}${path}#page`, url: `${SITE_URL}${path}`, name: 'Truck load profit and break even calculator', description: 'An interactive carrier worksheet for load pay, total miles, fuel, dispatch fees and other entered trip costs.', isPartOf: { '@id': `${SITE_URL}/#website` } }} />
    <header className="bg-navy-950 py-10 text-white sm:py-16">
      <div className="container-custom">
        <ContentBreadcrumbs dark items={[{ label: 'Carrier resources', href: '/resources' }, { label: 'Load cost calculator', href: path }]} />
        <p className="eyebrow">Carrier planning tool</p>
        <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">Truck load profit and break even calculator</h1>
        <p id="answer-block" className="mt-6 max-w-3xl text-lg leading-8 text-navy-200">A load’s headline rate does not show what the whole trip costs. Compare loaded and empty miles, fuel, the dispatch fee and other costs you enter. The result shows remaining revenue for your review, not your business’s net profit.</p>
      </div>
    </header>
    <div className="container-custom py-12 sm:py-16"><LoadProfitCalculator key={initialEquipment} initialEquipment={initialEquipment} /></div>
    {example.valid && <section className="bg-surface-50 py-12 sm:py-16" aria-labelledby="worked-example-heading">
      <div className="container-custom grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Illustrative example</p>
          <h2 id="worked-example-heading" className="section-heading">A $2,000 load with 100 empty miles</h2>
          <p className="mt-5 font-semibold text-navy-950">Equipment: {equipmentName} · Dispatch fee: {example.dispatchRate}%</p>
          <p className="mt-4 leading-8 text-navy-700">Suppose a load pays $2,000 for 800 loaded miles, plus 100 empty miles. At 6 MPG and $4 per gallon, the 900 mile trip uses an estimated 150 gallons and $600 in fuel. The {example.dispatchRate}% dispatch fee is {money(example.dispatchFeeCents / 100)}. With $150 of other costs entered, {money(example.remainingCents / 100)} remains.</p>
          <p className="mt-4 leading-8 text-navy-700">The headline rate is $2.50 per loaded mile. Including deadhead lowers gross revenue to $2.22 per total mile. The remaining amount is about {money(example.remainingPerAllMile)} per total mile, or {money(example.remainingPerHour ?? 0)} per hour if the trip takes 20 hours. These figures still exclude any costs you have not entered.</p>
          <p className="mt-4 leading-8 text-navy-700">For that same trip, {money(example.breakEvenCents / 100)} in load pay covers the $750 of entered fuel and other costs after allowing for the {example.dispatchRate}% dispatch fee. That is a cost recovery estimate for this worksheet, not a suggested market rate or a profitable quote for your business.</p>
        </div>
        <div className="rounded-xl border border-surface-300 bg-white p-6 sm:p-8">
          <h2 className="text-3xl">How the calculator works</h2>
          <dl className="mt-6 space-y-5 text-sm leading-7 text-navy-700">
            <div><dt className="font-semibold text-navy-950">Total trip miles</dt><dd>Loaded miles + empty / deadhead miles.</dd></div>
            <div><dt className="font-semibold text-navy-950">Gross revenue per total mile</dt><dd>Load pay ÷ total trip miles.</dd></div>
            <div><dt className="font-semibold text-navy-950">Estimated fuel cost</dt><dd>Total trip miles ÷ miles per gallon × fuel price per gallon.</dd></div>
            <div><dt className="font-semibold text-navy-950">Dispatch fee</dt><dd>Full agreed load pay × the published equipment percentage. This assumes all entered pay is fee bearing; a separate dispatch billing base is not modeled.</dd></div>
            <div><dt className="font-semibold text-navy-950">Remaining after entered costs</dt><dd>Load pay − dispatch fee − estimated fuel cost − other trip costs.</dd></div>
            <div><dt className="font-semibold text-navy-950">Break even load pay</dt><dd>(Estimated fuel cost + other trip costs) ÷ (1 − dispatch percentage as a decimal). The quote is rounded up to the nearest cent; calculated fees and fuel costs are rounded to cents.</dd></div>
          </dl>
          <p className="mt-6 border-t border-surface-200 pt-5 text-sm leading-7 text-navy-700">Fuel use assumes one average MPG across loaded and empty travel. Idling, reefer fuel and route specific costs must be included in your own estimates or other trip costs. Changing trip hours changes the hourly comparison; it does not automatically add driver pay.</p>
        </div>
      </div>
    </section>
    }
    <section className="container-custom py-12 sm:py-16" aria-labelledby="calculator-next-heading">
      <h2 id="calculator-next-heading" className="section-heading">Use the numbers in your next load decision.</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { href: '/resources/evaluate-freight-rate-per-mile', title: 'Evaluate a freight rate', text: 'Compare the whole trip, the delivery appointment and the next realistic pickup before accepting.' },
          { href: '/resources/reduce-deadhead-miles', title: 'Review empty miles', text: 'Plan pickup distance and reload options without treating an unbooked backhaul as confirmed revenue.' },
          { href: '/pricing', title: 'Confirm the dispatch fee', text: 'Check the published equipment rate and agree the billing base and service scope before starting.' },
        ].map(item => <Link prefetch={false} href={item.href} key={item.href} className="rounded-lg border border-surface-300 p-7 hover:border-primary-500"><h3 className="text-2xl">{item.title}</h3><p className="mt-4 leading-7 text-navy-700">{item.text}</p><span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary-700">Read the details <ArrowRight size={18} aria-hidden="true" /></span></Link>)}
      </div>
    </section>
    <ContentCTA />
  </>;
}
