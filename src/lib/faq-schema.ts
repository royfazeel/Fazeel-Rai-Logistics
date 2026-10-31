export type FaqAnswer = { question: string; answer: string };

/** Use the same array for visible answers and structured data. */
export function buildFaqPageSchema(faqs: readonly FaqAnswer[], pageUrl?: string) {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': pageUrl ? `${pageUrl}#faq` : '#faq',
    ...(pageUrl ? { url: pageUrl } : {}),
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
