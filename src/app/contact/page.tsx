import { pageMetadata } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

export const metadata = pageMetadata('Contact a Truck Dispatcher', 'Discuss your equipment, preferred lanes and dispatch needs with Rai Dispatch. Call (213) 371-6155 or request a free setup consultation.', "/contact");

export default function ContactPage() {
  return <ContactPageClient />;
}
