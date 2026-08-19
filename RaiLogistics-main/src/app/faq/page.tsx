import { Metadata } from 'next';
import FAQPageClient from './FAQPageClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Get answers to common questions about Rai Logistics dispatch services. Learn about our plans, pricing, setup process, and more.',
};

export default function FAQPage() {
  return <FAQPageClient />;
}
