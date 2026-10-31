import { ACTIVE_CARRIER_SUPPORT, FAQS } from './constants';

/** The published service scope behind every percentage fee. Keep in step with the pricing table and llms.txt. */
export const FEE_INCLUSIONS = [
  'A dedicated truck dispatcher for your truck',
  'Load search and carrier-approved booking',
  'Freight rate negotiation with brokers',
  'Broker communication from pickup to delivery',
  'Lane and route planning',
  'Rate confirmations and paperwork support',
  ACTIVE_CARRIER_SUPPORT.charAt(0).toUpperCase() + ACTIVE_CARRIER_SUPPORT.slice(1),
] as const;

/** Same wording as the homepage FAQ so the FAQPage schema and the equipment pages never disagree. */
export const DOCUMENTS_TO_START = FAQS.find(faq => faq.question === 'What documents do I need to get started?')?.answer ?? '';
