import { ACTIVE_CARRIER_SUPPORT, BUSINESS, FAQS, SETUP_DESK_HOURS } from './constants';
import { EQUIPMENT_CONTENT, GUIDES, SERVICE_CONTENT } from './dispatch-content';
import type { CarrierGuide, DispatchContent } from './dispatch-content';
import { CARRIER_AUTHORITY_SENTENCE, DISPATCH_FEES_ANSWER, DISPATCH_FEE_EFFECTIVE_SENTENCE, DISPATCH_FEE_HISTORY_SENTENCE, DISPATCH_FEE_POLICY, NO_FORCED_DISPATCH_SENTENCE, OTHER_EQUIPMENT_NOTICE, getDispatchRateLabel } from './dispatch-pricing';
import { SITE_URL } from './seo';

const sitePages = [
  ['/', 'Rai Dispatch'],
  ['/about', 'About Rai Dispatch'],
  ['/contact', 'Contact and carrier setup'],
  ['/pricing', 'Published dispatch fees'],
  ['/equipment', 'Equipment dispatch services'],
  ['/services', 'Dispatch service scope'],
  ['/carriers', 'Carrier dispatch options'],
  ['/carriers/owner-operators', 'Owner-operator dispatch'],
  ['/carriers/small-fleets', 'Small fleet dispatch'],
  ['/carriers/new-authorities', 'New authority dispatch review'],
  ['/service-areas', 'Lower 48 service area'],
  ['/what-to-expect', 'What to expect from dispatch support'],
  ['/faq', 'Dispatch questions'],
  ['/resources', 'Carrier resources'],
  ['/resources/trucking-dispatch-glossary', 'Trucking and dispatch glossary'],
  ['/tools/load-profit-calculator', 'Load cost calculator'],
  ['/editorial-standards', 'Sources, examples and corrections'],
  ['/terms', 'Website terms'],
  ['/privacy', 'Privacy policy'],
] as const;

const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;
const link = (label: string, path: string) => `[${label}](${url(path)})`;
const tableCell = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');

function introduction() {
  return [
    '# Rai Dispatch',
    '',
    `Rai Dispatch is a commercial truck dispatch service operating under ${BUSINESS.parentCompany}. The website describes dispatch support for owner-operators and small fleets across the 48 contiguous United States.`,
    '',
    'Carriers approve each load. A dedicated dispatcher, team backup and free setup are included in the agreed service. Freight availability and carrier results vary; no specific load rate or weekly revenue is guaranteed.',
    '',
    `${NO_FORCED_DISPATCH_SENTENCE} ${CARRIER_AUTHORITY_SENTENCE}`,
    '',
    `Active carriers: ${ACTIVE_CARRIER_SUPPORT}. Use the dispatch contact and escalation process agreed during onboarding.`,
    `New-carrier setup desk: ${SETUP_DESK_HOURS}. Phone: ${BUSINESS.phone}. Email: ${BUSINESS.email}.`,
    '',
    'Service terms are Rai Dispatch’s own published information. Confirm the applicable equipment category, billing base and service scope in the written agreement. Carrier guides are educational; their references retain their original scope. Worked examples are illustrative calculations, not live freight quotes, market averages or customer results.',
    '',
  ];
}

function pricing() {
  return [
    '## Published dispatch fees',
    '',
    `Source: ${url('/pricing')}`,
    '',
    DISPATCH_FEES_ANSWER,
    '',
    `${DISPATCH_FEE_EFFECTIVE_SENTENCE} ${DISPATCH_FEE_HISTORY_SENTENCE}`,
    '',
    ...EQUIPMENT_CONTENT.map(content => `- ${link(content.title, `/equipment/${content.slug}`)}: ${getDispatchRateLabel(content.slug)} of gross revenue on loads we book.`),
    '',
    OTHER_EQUIPMENT_NOTICE,
    DISPATCH_FEE_POLICY,
    '',
  ];
}

function sourceIndex() {
  return [
    '## Main website pages',
    '',
    ...sitePages.map(([path, title]) => `- ${link(title, path)}`),
    '',
    '## Equipment services',
    '',
    ...EQUIPMENT_CONTENT.map(content => `- ${link(content.title, `/equipment/${content.slug}`)}`),
    '',
    '## Dispatch services',
    '',
    ...SERVICE_CONTENT.map(content => `- ${link(content.title, `/services/${content.slug}`)}`),
    '',
    '## Carrier guides',
    '',
    ...GUIDES.map(guide => `- ${link(guide.title, `/resources/${guide.slug}`)}`),
    '',
  ];
}

function contentText(category: 'equipment' | 'services' | 'resources', content: DispatchContent, guide?: CarrierGuide) {
  const lines = [
    `## ${content.title}`,
    '',
    `Source: ${url(`/${category}/${content.slug}`)}`,
    '',
    content.intro,
    '',
  ];
  if (guide) lines.push(`Published: ${guide.published}. Updated: ${guide.updated ?? guide.published}. Publisher: ${BUSINESS.name}.`, '');
  if (content.availability) lines.push(content.availability, '');
  if (!guide) lines.push('Freight availability and carrier results vary; no specific load rate or weekly revenue is guaranteed.', '');
  for (const section of content.sections) {
    lines.push(`### ${section.title}`, '', ...section.paragraphs.flatMap(paragraph => [paragraph, '']));
    if (section.bullets?.length) lines.push(...section.bullets.map(bullet => `- ${bullet}`), '');
    if (section.table) {
      lines.push(section.table.caption, '', `| ${section.table.headers.map(tableCell).join(' | ')} |`, `| ${section.table.headers.map(() => '---').join(' | ')} |`);
      lines.push(...section.table.rows.map(row => `| ${row.map(tableCell).join(' | ')} |`), '');
    }
  }
  lines.push(`### ${content.checklistTitle}`, '', ...content.checklist.map(item => `- ${item}`), '', '### Questions and answers', '');
  for (const faq of content.faqs) lines.push(`#### ${faq.question}`, '', faq.answer, '');
  if (guide?.sources?.length) lines.push('### References', '', ...guide.sources.map(source => `- [${source.label}](${source.href})`), '');
  return lines;
}

export function getLlmsSourcePaths() {
  return [...new Set([
    ...sitePages.map(([path]) => path),
    ...EQUIPMENT_CONTENT.map(content => `/equipment/${content.slug}`),
    ...SERVICE_CONTENT.map(content => `/services/${content.slug}`),
    ...GUIDES.map(guide => `/resources/${guide.slug}`),
  ])];
}

export function getLlmsOverview() {
  return [...introduction(), ...pricing(), ...sourceIndex(), `Full page text: ${url('/llms-full.txt')}`, ''].join('\n');
}

export function getLlmsFull() {
  return [
    ...introduction(),
    ...pricing(),
    '## Homepage questions and answers', '', `Source: ${url('/')}`, '',
    ...FAQS.flatMap(faq => [`### ${faq.question}`, '', faq.answer, '']),
    ...EQUIPMENT_CONTENT.flatMap(content => contentText('equipment', content)),
    ...SERVICE_CONTENT.flatMap(content => contentText('services', content)),
    ...GUIDES.flatMap(guide => contentText('resources', guide, guide)),
    ...sourceIndex(),
  ].join('\n');
}
