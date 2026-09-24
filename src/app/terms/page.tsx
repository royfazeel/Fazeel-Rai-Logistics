import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';
import { DISPATCH_PRICING_SUMMARY } from '@/lib/dispatch-pricing';

/**
 * Single source of truth for the date shown at the top and bottom of this
 * page. Keep it in step with POLICY_UPDATED in src/app/privacy/page.tsx —
 * two legal pages carrying dates a year apart reads as neglect.
 */
const TERMS_UPDATED = 'September 2026';

export const metadata = pageMetadata('Terms of Service', 'Rai Dispatch service terms, carrier responsibilities, dispatch fees, load approvals, payment arrangements and cancellation conditions.', "/terms");

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Page hero — compact dark band */}
      <section className="bg-navy-950 text-white py-16 sm:py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="eyebrow">Legal</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase leading-[1.02] tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-white/70 text-lg">
              The service agreement and conditions for {BUSINESS.name} dispatch
              services.
            </p>
            <p className="text-white/50 text-sm mt-3">Last updated: {TERMS_UPDATED}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-3xl">
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              By accessing or using the dispatch services provided by {BUSINESS.name},
              operating under {BUSINESS.parentCompany} (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
              you agree to be bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              2. Description of Services
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              {BUSINESS.name} provides truck dispatch services, which may include:
            </p>
            <ul className="list-disc pl-6 text-navy-800 leading-relaxed space-y-2">
              <li>Load searching and booking</li>
              <li>Rate negotiation with brokers and shippers</li>
              <li>Broker and shipper communication</li>
              <li>Scheduling and appointment coordination</li>
              <li>Paperwork and documentation support</li>
              <li>Lane strategy and route planning guidance</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              3. Important Disclaimer
            </h2>
            <div className="bg-surface-50 border border-surface-200 border-l-4 border-l-primary-600 rounded-lg p-6 mb-4">
              <p className="text-navy-900 font-medium leading-relaxed">
                {BUSINESS.name} provides dispatch services only. We are NOT a motor carrier,
                NOT a freight broker, NOT a freight forwarder, and NOT a factoring company.
                We do not buy, resell, or take title to freight, and we operate under YOUR
                motor carrier authority &mdash; never our own. Carriers using our services
                remain solely responsible for:
              </p>
              <ul className="list-disc pl-6 text-navy-800 leading-relaxed space-y-2 mt-4">
                <li>Maintaining valid operating authority (MC/DOT)</li>
                <li>Compliance with all FMCSA regulations</li>
                <li>Insurance requirements and coverage</li>
                <li>Safe operation of their vehicles</li>
                <li>Driver qualifications and hours of service</li>
                <li>All aspects of freight transportation</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              4. No Earnings, Revenue, or Load Volume Guarantee
            </h2>
            <div className="bg-surface-50 border border-surface-200 border-l-4 border-l-primary-600 rounded-lg p-6 mb-4">
              <p className="text-navy-900 font-medium leading-relaxed">
                Any sample rates or fee calculations on this website are illustrations
                only. They are not live load offers, market forecasts, or promises
                about earnings.
              </p>
            </div>
            <p className="text-navy-800 leading-relaxed mb-4">
              {BUSINESS.name} does not guarantee any specific income, gross revenue, profit,
              rate per mile, number of loads, or continuity of freight. Your results depend
              on factors outside our control, including:
            </p>
            <ul className="list-disc pl-6 text-navy-800 leading-relaxed space-y-2">
              <li>Freight market conditions and seasonal rate movement</li>
              <li>The lanes and load types you are willing to run</li>
              <li>Your equipment, insurance, safety rating, and operating authority</li>
              <li>Your availability, hours of service, and downtime</li>
              <li>Fuel, maintenance, insurance, and other costs you carry</li>
              <li>Broker and shipper rate decisions, which are theirs to make, not ours</li>
            </ul>
            <p className="text-navy-800 leading-relaxed mt-4">
              We are paid a dispatch fee for the work of finding freight and negotiating on
              your behalf. That fee is owed for the service performed regardless of the
              revenue any individual load produces.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              5. Carrier Requirements
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              To use our dispatch services, you must:
            </p>
            <ul className="list-disc pl-6 text-navy-800 leading-relaxed space-y-2">
              <li>Have valid and active MC Authority</li>
              <li>Maintain required insurance coverage</li>
              <li>Provide accurate and current documentation</li>
              <li>Communicate promptly about load status and issues</li>
              <li>Honor load commitments once accepted</li>
              <li>Pay dispatch fees according to the agreed plan</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              6. Fees and Payment
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              {DISPATCH_PRICING_SUMMARY} These percentage-based dispatch fees apply to gross load revenue on
              loads we dispatch. The equipment rate, fee basis, treatment of fuel
              surcharge and accessorials, and payment schedule are confirmed in your
              individual dispatch agreement before service begins.
            </p>
            <p className="text-navy-800 leading-relaxed">
              A fixed weekly or monthly arrangement applies only if separately agreed
              in writing. Its fee and billing terms are confirmed before starting.
            </p>
            <p className="text-navy-800 leading-relaxed mt-4">
              Payment terms, billing frequency, and specific rates will be outlined in your
              individual dispatch agreement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              7. Cancellation and Termination
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              Either party may terminate the dispatch relationship with proper written notice
              as specified in your individual agreement. Upon termination:
            </p>
            <ul className="list-disc pl-6 text-navy-800 leading-relaxed space-y-2">
              <li>All outstanding fees become immediately due</li>
              <li>We will complete dispatch on any loads in progress</li>
              <li>You remain responsible for completing accepted loads</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              To the maximum extent permitted by law, {BUSINESS.name} shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-navy-800 leading-relaxed space-y-2">
              <li>Cargo loss, damage, or delay</li>
              <li>Actions or omissions of brokers or shippers</li>
              <li>Lost income or business opportunities</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Carrier compliance violations</li>
            </ul>
            <p className="text-navy-800 leading-relaxed mt-4">
              Our total liability shall not exceed the amount of dispatch fees paid by you
              in the preceding three months.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              9. Indemnification
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              You agree to indemnify and hold harmless {BUSINESS.name}, {BUSINESS.parentCompany},
              and their officers, employees, and agents from any claims, damages, losses, or
              expenses arising from your use of our services, your operation of motor vehicles,
              or your breach of these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              10. Confidentiality
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              Both parties agree to maintain the confidentiality of proprietary information
              shared during the course of the business relationship, including rates, customer
              lists, and business strategies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              11. Modifications
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              We reserve the right to modify these Terms of Service at any time. Changes will
              be effective upon posting to our website. Continued use of our services after
              changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              12. Governing Law
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              These Terms of Service shall be governed by and construed in accordance with the
              laws of the State of Wyoming, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              13. Website, Cookies, Advertising &amp; Privacy
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              This website advertises on Google and loads Google Analytics and Google Ads
              conversion tracking so we can tell which advertisements produce real enquiries.
              Those tools set cookies in your browser. No other analytics, advertising,
              session-recording, or data-broker service runs on this site.
            </p>
            <p className="text-navy-800 leading-relaxed mb-4">
              Full detail &mdash; which cookies, what they can and cannot see, and step-by-step
              instructions for opting out &mdash; is in Section 5 of our{' '}
              <Link href="/privacy" className="text-primary-700 font-medium hover:text-primary-800 underline">
                Privacy Policy &amp; SMS Terms
              </Link>
              , which also carries the SMS consent, STOP, and HELP terms required for text
              messaging. The Privacy Policy is incorporated into these Terms by reference.
            </p>
            <p className="text-navy-800 leading-relaxed">
              Nothing on this site requires a cookie in order to work. You can decline them
              and still read every page, call us, and submit the enquiry form.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-4">
              14. Contact Information
            </h2>
            <p className="text-navy-800 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-surface-50 border border-surface-200 rounded-lg p-6">
              <p className="text-navy-800 leading-relaxed">
                <strong className="text-navy-900 font-semibold">{BUSINESS.name}</strong>
                <br />
                A truck dispatch service operating under {BUSINESS.parentCompany}
                <br />
                Not a motor carrier, freight broker, or factoring company
                <br />
                <br />
                {BUSINESS.address.full}
                <br />
                Phone: <a href={BUSINESS.phoneHref} className="text-primary-700 font-medium hover:text-primary-800">{BUSINESS.phone}</a>
                <br />
                Email: <a href={BUSINESS.emailHref} className="text-primary-700 font-medium hover:text-primary-800">{BUSINESS.email}</a>
              </p>
            </div>
          </section>

          {/* Footer back-link */}
          <div className="pt-8 border-t border-surface-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-sm text-surface-600">Last updated: {TERMS_UPDATED}</p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                Privacy Policy
              </Link>
              <Link
                href="/"
                className="text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
