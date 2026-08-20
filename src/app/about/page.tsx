import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Rai Logistics, a dispatch services company operating under Rai Technologies LLC. Professional truck dispatch with a driver-first approach.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
