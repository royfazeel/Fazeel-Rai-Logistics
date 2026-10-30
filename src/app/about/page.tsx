import { pageMetadata } from '@/lib/seo';
import AboutPageClient from './AboutPageClient';

export const metadata = pageMetadata('About Rai Dispatch', 'Meet Rai Dispatch, operated by Rai Technologies LLC. Dedicated truck dispatch support for owner-operators and small fleets across the 48 contiguous states.', "/about");

export default function AboutPage() {
  return <AboutPageClient />;
}
