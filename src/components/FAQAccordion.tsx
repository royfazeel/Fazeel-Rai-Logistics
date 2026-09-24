import { Plus } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: readonly FAQ[];
  columns?: 1 | 2;
}

/** Native disclosure keeps every answer in the server HTML and works without JS. */
export default function FAQAccordion({ faqs, columns = 1 }: FAQAccordionProps) {
  const splitFaqs: readonly (readonly FAQ[])[] = columns === 2
    ? [faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))]
    : [faqs];

  return <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2 items-start' : 'max-w-3xl'}`}>
    {splitFaqs.map((column, index) => <div key={index} className="space-y-3">
      {column.map(faq => <details key={faq.id} className="group bg-white rounded-lg border border-surface-200 open:border-primary-300 overflow-hidden">
        <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
          <h3 className="font-display text-lg sm:text-xl font-bold text-navy-950 leading-snug">{faq.question}</h3>
          <Plus className="w-5 h-5 shrink-0 text-primary-600 group-open:rotate-45 transition-transform motion-reduce:transition-none" strokeWidth={2.5} aria-hidden="true" />
        </summary>
        <p className="px-5 pb-5 text-surface-700 leading-relaxed border-t border-surface-100 pt-4">{faq.answer}</p>
      </details>)}
    </div>)}
  </div>;
}
