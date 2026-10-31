import { ArrowUpRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

export default function ContactSocialProfiles() {
  return (
    <section aria-labelledby="contact-social-profiles-title" className="rounded-lg border border-surface-200 bg-white p-5">
      <h3 id="contact-social-profiles-title" className="font-display text-xl font-bold text-navy-950">Follow Rai Dispatch</h3>
      <p className="mt-2 text-sm leading-6 text-surface-700">Find our official profiles on X, Instagram and Facebook.</p>
      <ul className="mt-4 space-y-2">
        {BUSINESS.socialProfiles.map(profile => (
          <li key={profile.url}>
            <a
              href={profile.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`Rai Dispatch on ${profile.name} (opens in a new tab)`}
              className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-surface-200 px-3 py-3 text-navy-900 hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <span className="min-w-0">
                <span className="block font-semibold">{profile.name}</span>
                <span className="block break-words text-sm text-surface-700">{profile.handle}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
