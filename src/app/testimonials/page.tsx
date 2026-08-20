import { Metadata } from 'next';
import TestimonialsPageClient from './TestimonialsPageClient';

export const metadata: Metadata = {
  title: 'Driver Testimonials',
  description:
    'Read what owner-operators say about Rai Logistics dispatch services. Real reviews from real drivers across the United States.',
};

export default function TestimonialsPage() {
  return <TestimonialsPageClient />;
}
