import type { ContentLink } from './dispatch-content';

// Contextual routes connect service decisions to the supporting carrier worksheet.
export const LEARNING_LINKS: Record<string, ContentLink[]> = {
  '/equipment/box-truck': [{ label: 'Calculate box truck trip costs', href: '/tools/load-profit-calculator?equipment=box-truck' }],
  '/resources/how-to-find-box-truck-loads': [{ label: 'Compare your box truck load costs', href: '/tools/load-profit-calculator?equipment=box-truck' }],
  '/carriers/owner-operators': [{ label: 'Box truck dispatch for owner-operators', href: '/equipment/box-truck' }],
  '/carriers/new-authorities': [{ label: 'Box truck dispatch and equipment review', href: '/equipment/box-truck' }],
  '/equipment/reefer': [{ label: 'Reefer temperature and handoff checklist', href: '/resources/reefer-load-temperature-checklist' }],
  '/equipment/flatbed': [{ label: 'Flatbed tarping and load preparation', href: '/resources/flatbed-load-tarping-checklist' }],
  '/equipment/step-deck': [{ label: 'Open-deck load preparation checklist', href: '/resources/flatbed-load-tarping-checklist' }],
  '/equipment/hotshot': [{ label: 'Hotshot load planning checklist', href: '/resources/hotshot-load-planning-checklist' }],
  '/equipment/power-only': [{ label: 'Power only trailer interchange checklist', href: '/resources/power-only-trailer-interchange-checklist' }],
  '/services/broker-communication': [{ label: 'Verify a freight broker’s identity', href: '/resources/verify-freight-broker-identity' }],
  '/services/paperwork-support': [{ label: 'Review a dispatch service agreement', href: '/resources/truck-dispatch-service-agreement-checklist' }],
  '/services/dedicated-dispatcher': [{ label: 'Dispatch agreement checklist', href: '/resources/truck-dispatch-service-agreement-checklist' }],
  '/services/rate-negotiation': [{ label: 'Estimate load costs and break-even pay', href: '/tools/load-profit-calculator' }, { label: 'Understand fuel surcharge calculations', href: '/resources/fuel-surcharge-calculation-for-carriers' }],
  '/services/route-strategy': [{ label: 'Compare the cost of empty miles', href: '/tools/load-profit-calculator' }],
  '/resources/evaluate-freight-rate-per-mile': [{ label: 'Calculate the whole trip', href: '/tools/load-profit-calculator' }, { label: 'Fuel surcharge formula and example', href: '/resources/fuel-surcharge-calculation-for-carriers' }],
  '/resources/reduce-deadhead-miles': [{ label: 'Calculate the cost of deadhead', href: '/tools/load-profit-calculator' }],
  '/resources/truck-dispatch-fees': [{ label: 'Calculate load pay after the dispatch fee', href: '/tools/load-profit-calculator' }, { label: 'Dispatch service agreement checklist', href: '/resources/truck-dispatch-service-agreement-checklist' }],
  '/resources/how-to-choose-a-truck-dispatcher': [{ label: 'Questions for the dispatch agreement', href: '/resources/truck-dispatch-service-agreement-checklist' }],
  '/resources/carrier-onboarding-checklist': [{ label: 'Verify the broker before sending documents', href: '/resources/verify-freight-broker-identity' }],
  '/resources/new-authority-broker-approval': [{ label: 'Broker identity verification checklist', href: '/resources/verify-freight-broker-identity' }],
  '/resources/what-does-a-truck-dispatcher-do': [{ label: 'Trucking and dispatch terminology', href: '/resources/trucking-dispatch-glossary' }],
};
