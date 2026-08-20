'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Check, ArrowRight, FileText, Calendar, Percent, ChevronDown } from 'lucide-react';
import { BUSINESS, PRICING_PLANS } from '@/lib/constants';
import QuoteModal from './QuoteModal';

type PlanType = 'weekly' | 'contract' | 'percentage';

interface PricingTableProps {
  showToggle?: boolean;
  defaultPlan?: PlanType;
}

export default function PricingTable({
  showToggle = true,
  defaultPlan = 'weekly'
}: PricingTableProps) {
  const [activePlan, setActivePlan] = useState<PlanType>(defaultPlan);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState(false);

  const plans: { key: PlanType; label: string; icon: React.ElementType }[] = [
    { key: 'weekly', label: 'Weekly Flat Rate', icon: Calendar },
    { key: 'percentage', label: 'Percentage Plan', icon: Percent },
    { key: 'contract', label: 'Contract Plan', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Plan Toggle */}
      {showToggle && (
        <div className="flex justify-center">
          <div className="inline-flex bg-surface-100 border border-surface-200 rounded-md p-1 gap-1">
            {plans.map((plan) => (
              <button
                key={plan.key}
                onClick={() => setActivePlan(plan.key)}
                className={`relative px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm sm:text-base transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  activePlan === plan.key
                    ? 'text-white'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                {activePlan === plan.key && (
                  <motion.div
                    layoutId="activePlanBg"
                    className="absolute inset-0 bg-primary-600 rounded-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <plan.icon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{plan.label}</span>
                  <span className="sm:hidden">
                    {plan.key === 'weekly' ? 'Weekly' : plan.key === 'percentage' ? '%' : 'Contract'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Plan Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePlan}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activePlan === 'weekly' && (
            <WeeklyPlanCard
              onGetStarted={() => setIsQuoteModalOpen(true)}
              expandedFeatures={expandedFeatures}
              setExpandedFeatures={setExpandedFeatures}
            />
          )}
          {activePlan === 'contract' && (
            <ContractPlanCard onGetStarted={() => setIsQuoteModalOpen(true)} />
          )}
          {activePlan === 'percentage' && (
            <PercentagePlanCard onGetStarted={() => setIsQuoteModalOpen(true)} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quote Modal */}
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}

// Weekly Plan Card — the highlighted plan: white card, 2px red border,
// navy header bar with a small "Most popular" tag.
function WeeklyPlanCard({
  onGetStarted,
  expandedFeatures,
  setExpandedFeatures
}: {
  onGetStarted: () => void;
  expandedFeatures: boolean;
  setExpandedFeatures: (v: boolean) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-primary-600 overflow-hidden shadow-soft">
        {/* Header bar */}
        <div className="bg-navy-950 text-white px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold leading-none">
              {PRICING_PLANS.weekly.name}
            </h3>
            <p className="text-white/70 text-sm mt-1.5">{PRICING_PLANS.weekly.description}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-md">
            Most Popular
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left Column - Rates */}
          <div>
            <h4 className="font-display text-sm font-semibold text-surface-600 uppercase tracking-wider mb-4">
              Weekly Dispatch Rates
            </h4>
            <div className="divide-y divide-surface-200 border-y border-surface-200 mb-5">
              {PRICING_PLANS.weekly.rates.map((rate) => (
                <div
                  key={rate.equipment}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-navy-900 font-medium">{rate.equipment}</span>
                  <span className="font-display text-3xl font-bold text-navy-950 leading-none">
                    {rate.rate}
                    <span className="text-sm text-surface-500 font-semibold">{rate.period}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="text-sm text-surface-600 mb-6">
              {PRICING_PLANS.weekly.note}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={BUSINESS.phoneHref} className="btn-primary flex-1">
                <Phone className="w-5 h-5" aria-hidden="true" />
                {PRICING_PLANS.weekly.cta}
              </a>
              <button onClick={onGetStarted} className="btn-secondary flex-1">
                {PRICING_PLANS.weekly.ctaSecondary}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Column - Features */}
          <div>
            <div className="bg-surface-50 rounded-lg border border-surface-200 p-5 h-full">
              {/* Below lg: real disclosure button toggling the list */}
              <button
                onClick={() => setExpandedFeatures(!expandedFeatures)}
                className="w-full lg:hidden flex items-center justify-between rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-expanded={expandedFeatures}
              >
                <h4 className="font-display text-sm font-semibold text-surface-600 uppercase tracking-wider">
                  What&apos;s Included
                </h4>
                <motion.span animate={{ rotate: expandedFeatures ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5 text-surface-500" aria-hidden="true" />
                </motion.span>
              </button>

              {/* lg+: list is always visible, so render a plain heading */}
              <h4 className="hidden lg:flex font-display text-sm font-semibold text-surface-600 uppercase tracking-wider">
                What&apos;s Included
              </h4>

              <ul className={`space-y-3 mt-4 ${!expandedFeatures ? 'hidden lg:block' : ''}`}>
                {PRICING_PLANS.weekly.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-navy-900 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contract Plan Card Component
function ContractPlanCard({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <div className="mb-6">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-surface-600 mb-2">
            {PRICING_PLANS.contract.subtitle}
          </p>
          <h3 className="font-display text-3xl font-bold text-navy-950">
            {PRICING_PLANS.contract.name}
          </h3>
        </div>

        <p className="text-surface-700 mb-6">{PRICING_PLANS.contract.description}</p>

        <ul className="space-y-3 mb-8">
          {PRICING_PLANS.contract.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-navy-900">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href={BUSINESS.phoneHref} className="btn-primary flex-1">
            <Phone className="w-5 h-5" aria-hidden="true" />
            {PRICING_PLANS.contract.cta}
          </a>
          <button onClick={onGetStarted} className="btn-secondary flex-1">
            Get Started
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Percentage Plan Card Component
function PercentagePlanCard({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <div className="mb-6">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-surface-600 mb-2">
            {PRICING_PLANS.percentage.subtitle}
          </p>
          <h3 className="font-display text-3xl font-bold text-navy-950">
            {PRICING_PLANS.percentage.name}
          </h3>
        </div>

        <p className="text-surface-700 mb-6">{PRICING_PLANS.percentage.description}</p>

        {/* Rate Table */}
        <div className="border-y border-surface-200 divide-y divide-surface-200 mb-4">
          {PRICING_PLANS.percentage.rates.map((rate) => (
            <div key={rate.equipment} className="flex items-center justify-between py-3">
              <span className="text-navy-900 font-medium">{rate.equipment}</span>
              <span className="font-display text-2xl font-bold text-primary-600 leading-none">
                {rate.rate}
                <span className="block text-[10px] font-semibold text-surface-500 uppercase tracking-wider text-right">
                  of gross
                </span>
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm text-surface-600 mb-6">{PRICING_PLANS.percentage.note}</p>

        <ul className="space-y-3 mb-8">
          {PRICING_PLANS.percentage.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-navy-900">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href={BUSINESS.phoneHref} className="btn-primary flex-1">
            <Phone className="w-5 h-5" aria-hidden="true" />
            {PRICING_PLANS.percentage.cta}
          </a>
          <button onClick={onGetStarted} className="btn-secondary flex-1">
            Get Started
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact Pricing Preview for Homepage
export function PricingPreview() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Weekly Flat Rate - Featured */}
      <div className="bg-white rounded-lg border-2 border-primary-600 overflow-hidden shadow-soft">
        {/* Header bar */}
        <div className="bg-navy-950 text-white px-6 md:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold leading-none">
              Weekly Flat Rate
            </h3>
            <p className="text-white/70 text-sm mt-1.5">Predictable weekly dispatch fee per truck</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-md">
            Most Popular
          </span>
        </div>

        <div className="p-6 md:p-8">
          {/* Rate Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
            {PRICING_PLANS.weekly.rates.map((rate) => (
              <div
                key={rate.equipment}
                className="bg-surface-50 border border-surface-200 rounded-md p-4 text-center"
              >
                <p className="font-display text-xs font-semibold uppercase tracking-wider text-surface-600 mb-1.5">
                  {rate.equipment}
                </p>
                <p className="font-display text-2xl font-bold text-navy-950 leading-none">
                  {rate.rate}
                  <span className="text-sm text-surface-500 font-semibold">{rate.period}</span>
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-surface-600 mb-6">
            {PRICING_PLANS.weekly.note}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={BUSINESS.phoneHref} className="btn-primary flex-1">
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call Now
            </a>
            <button onClick={() => setIsQuoteModalOpen(true)} className="btn-secondary flex-1">
              Get Started
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Other Plans - Compact Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Contract Plan Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-navy-950">Contract Plan</h4>
              <p className="text-sm text-surface-600">Fixed monthly fee</p>
            </div>
          </div>
          <p className="text-surface-700 text-sm mb-5">
            1-month dispatch contract with all services included. Renewable monthly or yearly.
          </p>
          <a href={BUSINESS.phoneHref} className="btn-secondary w-full">
            <Phone className="w-4 h-4" aria-hidden="true" />
            Call for Pricing
          </a>
        </div>

        {/* Percentage Plan Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
              <Percent className="w-5 h-5 text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-navy-950">Percentage Plan</h4>
              <p className="text-sm text-surface-600">5-7% of gross</p>
            </div>
          </div>
          <p className="text-surface-700 text-sm mb-5">
            Pay only when you earn. Rates vary by equipment: 5% Dry Van/Reefer/Flatbed, 6% Power Only, 7% Box Truck.
          </p>
          <a href={BUSINESS.phoneHref} className="btn-secondary w-full">
            <Phone className="w-4 h-4" aria-hidden="true" />
            Start Today
          </a>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}
