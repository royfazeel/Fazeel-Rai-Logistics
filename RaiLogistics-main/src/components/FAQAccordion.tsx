'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function FAQAccordion({ faqs, columns = 1 }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const splitFaqs: readonly (readonly FAQ[])[] =
    columns === 2
      ? [faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))]
      : [faqs];

  return (
    <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2 items-start' : 'max-w-3xl'}`}>
      {splitFaqs.map((column, colIdx) => (
        <div key={colIdx} className="space-y-3">
          {column.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-lg border overflow-hidden transition-colors ${
                  isOpen ? 'border-primary-300' : 'border-surface-200'
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
                >
                  <h3 className="font-display text-lg sm:text-xl font-bold text-navy-950 leading-snug">
                    {faq.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Plus className="w-5 h-5 text-primary-600" strokeWidth={2.5} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <p className="px-5 pb-5 text-surface-700 leading-relaxed border-t border-surface-100 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
