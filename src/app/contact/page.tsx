import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Rai Logistics. Call us for dispatch services or fill out our contact form. We respond fast.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
