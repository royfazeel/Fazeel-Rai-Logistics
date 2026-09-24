import { pageMetadata } from '@/lib/seo';
import TestimonialsPageClient from './TestimonialsPageClient';

export const metadata = pageMetadata('Our Carrier Service Commitments', 'See what to expect from Rai Dispatch: carrier-approved loads, transparent dispatch fees, equipment-specific planning and clear communication.', "/testimonials");

export default function TestimonialsPage() {
  return <TestimonialsPageClient />;
}
