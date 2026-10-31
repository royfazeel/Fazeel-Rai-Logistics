import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import { pageMetadata } from '@/lib/seo';
import AboutPageClient from './AboutPageClient';

export const metadata = pageMetadata('About Our Truck Dispatch Team', 'Meet Rai Dispatch: dedicated truck dispatchers, box truck specialists and 24/7 live support for active carriers across the lower 48 states.', "/about");

export default function AboutPage() {
  return <><PageBreadcrumbs label="About" path="/about" /><AboutPageClient /></>;
}
