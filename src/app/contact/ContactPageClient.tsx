'use client';

import Image from 'next/image';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  Loader2,
  Shield,
  Zap,
  Users,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';
import { ScrollReveal } from '@/components';
import { BUSINESS, MEDIA, EQUIPMENT_TYPES } from '@/lib/constants';
import { track } from '@/lib/track';
import {
  formatUsPhone,
  validateName,
  validatePhone,
  validateEmail,
  validateMcNumber,
  validateRequiredSelect,
} from '@/lib/formValidation';

/* Shared input styling — square-ish corners, neutral border, red focus ring */
const inputClasses =
  'w-full px-4 py-3 bg-white border border-surface-300 rounded-md text-navy-950 ' +
  'placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ' +
  'focus:border-primary-500 transition-colors';

/* Inline WhatsApp glyph — lucide-react doesn't ship one */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.523 5.273l-.999 3.648 3.965-1.04zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

/* Honeypot wrapper — off-screen rather than display:none, because naive bots
   skip hidden inputs but happily fill positioned ones. Never seen by humans
   (off-screen) or screen readers (aria-hidden on the wrapper). */
const honeypotWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  left: '-9999px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
};

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  mcNumber: '',
  equipment: '',
  lanes: '',
  currentStatus: '',
  factoring: '',
  message: '',
  requestCallback: false,
  company: '', // honeypot — real users never touch this
};

export default function ContactPageClient() {
  // Form state — kept aligned with QuoteModal's onboarding-grade fields so leads
  // captured here vs. the popup are interchangeable.
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Mirrors the server-side rules in /api/lead so a typo surfaces while the
  // driver is still typing rather than after a failed round trip.
  const validators: Record<string, (v: string) => string | null> = {
    name: validateName,
    phone: validatePhone,
    email: (v) => validateEmail(v, false),
    mcNumber: validateMcNumber,
    equipment: (v) => validateRequiredSelect(v, 'your equipment type'),
  };
  const inputIds: Record<string, string> = {
    name: 'contact-name',
    phone: 'contact-phone',
    email: 'contact-email',
    mcNumber: 'contact-mc',
    equipment: 'contact-equipment',
  };

  const valueOf = (field: string) =>
    String((formState as unknown as Record<string, unknown>)[field] ?? '');
  const runValidation = (field: string, value: string) =>
    validators[field] ? validators[field](value) : null;
  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: runValidation(field, valueOf(field)) }));
  };
  const revalidate = (field: string, value: string) => {
    if (!touched[field]) return;
    setErrors((e) => ({ ...e, [field]: runValidation(field, value) }));
  };
  const errorFor = (field: string) => (touched[field] ? errors[field] : null) || null;
  const fieldCls = (field: string, base: string) =>
    errorFor(field) ? `${base} border-primary-500` : base;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Check the format before spending a round trip; focus the first problem.
    const nextErrors: Record<string, string | null> = {};
    const nextTouched: Record<string, boolean> = {};
    let firstBad: string | null = null;
    Object.keys(validators).forEach((field) => {
      const message = runValidation(field, valueOf(field));
      nextErrors[field] = message;
      nextTouched[field] = true;
      if (message && !firstBad) firstBad = field;
    });
    if (firstBad) {
      setErrors(nextErrors);
      setTouched((t) => ({ ...t, ...nextTouched }));
      document.getElementById(inputIds[firstBad])?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitFailed(false);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          source: 'contact_page',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;

      if (res.ok && data?.ok === true) {
        // Google Ads counts this as the lead conversion. Fired ONLY after the
        // API confirmed the lead was actually delivered — never on a failure,
        // or the campaign optimises towards submissions nobody received.
        track('lead_submit', { source: 'contact_page' });
        setIsSubmitted(true);
      } else {
        // Covers 400 validation, 429, 503 not_configured, 502 delivery_failed.
        // We never claim delivery we can't stand behind — the visitor gets the
        // phone number instead.
        setSubmitFailed(true);
      }
    } catch {
      // Network error / offline / request blocked.
      setSubmitFailed(true);
    } finally {
      // Always resolves — the user never sits on a spinner.
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitFailed(false);
    setFormState(EMPTY_FORM);
  };

  return (
    <>
      {/* ============================================================
          PAGE HERO — compact dark band over the highway photo.
          ============================================================ */}
      <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden">
        <Image
          fill
          priority
          sizes="100vw"
          src={MEDIA.heroVideo.poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/85" aria-hidden="true" />

        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Contact us</p>
              <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[1.02] tracking-tight mb-5">
                Let&apos;s talk about your dispatch needs
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-xl">
                A call or text is the fastest way to reach a dispatcher.
                Prefer email? Use the form below or write to us directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={BUSINESS.phoneHref}
                  onClick={() => track('call_click', { location: 'contact_hero' })}
                  className="btn-primary"
                  aria-label={`Call Rai Dispatch at ${BUSINESS.phone}`}
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  {BUSINESS.phone}
                </a>
                <a href={BUSINESS.smsHref} className="btn-ghost-light"
                onClick={() => track('sms_click', { location: 'contact_hero' })}
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  Text us instead
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-6 bg-white border-b border-surface-200">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {[
              { icon: Zap, text: 'Fast response time' },
              { icon: Shield, text: 'No obligation' },
              { icon: Users, text: 'Dedicated support' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-navy-900">
                <item.icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT METHODS + FORM
          ============================================================ */}
      <section className="section-padding bg-surface-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Contact methods */}
            <div className="lg:col-span-1">
              <ScrollReveal>
                <h2 className="font-display text-3xl font-bold text-navy-950 mb-6">
                  Get in touch
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 border border-surface-200">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 mb-0.5">
                          Call
                        </h3>
                        <a
                          href={BUSINESS.phoneHref}
                          onClick={() => track('call_click', { location: 'contact_method_card' })}
                          className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                          aria-label={`Call Rai Dispatch at ${BUSINESS.phone}`}
                        >
                          {BUSINESS.phone}
                        </a>
                        <p className="text-sm text-surface-600 mt-1">
                          {BUSINESS.hours.days}, {BUSINESS.hours.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-surface-200">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 mb-0.5">
                          Text
                        </h3>
                        <a
                          href={BUSINESS.smsHref}
                          onClick={() => track('sms_click', { location: 'contact_method_card' })}
                          className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                        >
                          {BUSINESS.phone}
                        </a>
                        <p className="text-sm text-surface-600 mt-1">
                          Quick replies, even on the road
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-surface-200">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-green-50 border border-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <WhatsAppIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 mb-0.5">
                          WhatsApp
                        </h3>
                        <a
                          href={BUSINESS.whatsappHref}
                          onClick={() => track('whatsapp_click', { location: 'contact_method_card' })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                        >
                          {BUSINESS.phone}
                        </a>
                        <p className="text-sm text-surface-600 mt-1">
                          Message us on WhatsApp
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-surface-200">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 mb-0.5">
                          Email
                        </h3>
                        <a
                          href={BUSINESS.emailHref}
                          onClick={() => track('email_click', { location: 'contact_method_card' })}
                          className="text-primary-600 font-semibold hover:text-primary-700 transition-colors break-all"
                        >
                          {BUSINESS.email}
                        </a>
                        <p className="text-sm text-surface-600 mt-1">
                          We respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-surface-200">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 mb-0.5">
                          Address
                        </h3>
                        <p className="text-navy-800">{BUSINESS.address.street}</p>
                        <p className="text-navy-800">
                          {BUSINESS.address.city}, {BUSINESS.address.state}{' '}
                          {BUSINESS.address.zip}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-surface-200">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 mb-0.5">
                          Hours
                        </h3>
                        <p className="text-navy-800">{BUSINESS.hours.days}</p>
                        <p className="text-navy-800">{BUSINESS.hours.time}</p>
                        <p className="text-sm text-surface-600 mt-1">{BUSINESS.hours.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="right">
                <div className="bg-white rounded-lg p-6 sm:p-8 border border-surface-200">
                  <h2 className="font-display text-3xl font-bold text-navy-950 mb-2">
                    Send us a message
                  </h2>
                  <p className="text-surface-700 mb-8">
                    Tell us about your operation — or skip the form and call{' '}
                    <a href={BUSINESS.phoneHref} className="text-primary-600 font-semibold"
                    onClick={() => track('call_click', { location: 'contact_form_intro' })}
                    >
                      {BUSINESS.phone}
                    </a>{' '}
                    to talk to a dispatcher right away.
                  </p>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-primary-600" aria-hidden="true" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-navy-950 mb-3">
                        Message sent
                      </h3>
                      <p className="text-surface-700 mb-6">
                        We&apos;ve got your details and a dispatcher will get back
                        to you. The fastest route is still a call —
                        <br />
                        reach one directly at{' '}
                        <a
                          href={BUSINESS.phoneHref}
                          onClick={() => track('call_click', { location: 'contact_form_error' })}
                          className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                        >
                          {BUSINESS.phone}
                        </a>
                      </p>
                      <button
                        onClick={resetForm}
                        className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <form noValidate onSubmit={handleSubmit} className="space-y-6">
                      {/* Spam trap — hidden from humans and assistive tech. If it
                          comes back filled, the API drops the lead silently. */}
                      <div style={honeypotWrapperStyle} aria-hidden="true">
                        <label htmlFor="contact-company">
                          Company (leave this field empty)
                        </label>
                        <input
                          id="contact-company"
                          name="company"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={formState.company}
                          onChange={(e) =>
                            setFormState({ ...formState, company: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-name" className="block text-sm font-medium text-navy-800 mb-2">
                            Full Name *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            autoComplete="name"
                            required
                            value={formState.name}
                            onChange={(e) => {
                              setFormState({ ...formState, name: e.target.value });
                              revalidate('name', e.target.value);
                            }}
                            onBlur={() => handleBlur('name')}
                            aria-invalid={errorFor('name') ? true : undefined}
                            aria-describedby={errorFor('name') ? 'contact-name-error' : undefined}
                            className={fieldCls('name', inputClasses)}
                            placeholder="John Smith"
                          />
                          {errorFor('name') && (
                            <p id="contact-name-error" role="alert" className="mt-1.5 text-xs font-medium text-primary-700">
                              {errorFor('name')}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="block text-sm font-medium text-navy-800 mb-2">
                            Phone Number *
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            required
                            maxLength={14}
                            value={formState.phone}
                            onChange={(e) => {
                              const formatted = formatUsPhone(e.target.value);
                              setFormState({ ...formState, phone: formatted });
                              revalidate('phone', formatted);
                            }}
                            onBlur={() => handleBlur('phone')}
                            aria-invalid={errorFor('phone') ? true : undefined}
                            aria-describedby={errorFor('phone') ? 'contact-phone-error' : undefined}
                            className={fieldCls('phone', inputClasses)}
                            placeholder="(555) 555-5555"
                          />
                          {errorFor('phone') && (
                            <p id="contact-phone-error" role="alert" className="mt-1.5 text-xs font-medium text-primary-700">
                              {errorFor('phone')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-navy-800 mb-2">
                          Email Address (optional)
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={formState.email}
                          onChange={(e) => {
                            setFormState({ ...formState, email: e.target.value });
                            revalidate('email', e.target.value);
                          }}
                          onBlur={() => handleBlur('email')}
                          aria-invalid={errorFor('email') ? true : undefined}
                          aria-describedby={errorFor('email') ? 'contact-email-error' : undefined}
                          className={fieldCls('email', inputClasses)}
                          placeholder="john@example.com"
                        />
                        {errorFor('email') && (
                          <p id="contact-email-error" role="alert" className="mt-1.5 text-xs font-medium text-primary-700">
                            {errorFor('email')}
                          </p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-mc" className="block text-sm font-medium text-navy-800 mb-2">
                            MC Number
                          </label>
                          <input
                            id="contact-mc"
                            type="text"
                            inputMode="numeric"
                            maxLength={12}
                            value={formState.mcNumber}
                            onChange={(e) => {
                              setFormState({ ...formState, mcNumber: e.target.value });
                              revalidate('mcNumber', e.target.value);
                            }}
                            onBlur={() => handleBlur('mcNumber')}
                            aria-invalid={errorFor('mcNumber') ? true : undefined}
                            aria-describedby={errorFor('mcNumber') ? 'contact-mc-error' : undefined}
                            className={fieldCls('mcNumber', inputClasses)}
                            placeholder="MC-123456"
                          />
                          {errorFor('mcNumber') && (
                            <p id="contact-mc-error" role="alert" className="mt-1.5 text-xs font-medium text-primary-700">
                              {errorFor('mcNumber')}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="contact-equipment" className="block text-sm font-medium text-navy-800 mb-2">
                            Equipment Type *
                          </label>
                          <select
                            id="contact-equipment"
                            required
                            value={formState.equipment}
                            onChange={(e) => {
                              setFormState({ ...formState, equipment: e.target.value });
                              revalidate('equipment', e.target.value);
                            }}
                            onBlur={() => handleBlur('equipment')}
                            aria-invalid={errorFor('equipment') ? true : undefined}
                            aria-describedby={errorFor('equipment') ? 'contact-equipment-error' : undefined}
                            className={fieldCls('equipment', `${inputClasses} appearance-none`)}
                          >
                            <option value="">Select equipment</option>
                            {EQUIPMENT_TYPES.map((eq) => (
                              <option key={eq.id} value={eq.id}>
                                {eq.name}
                              </option>
                            ))}
                            <option value="other">Other truck type</option>
                          </select>
                          {errorFor('equipment') && (
                            <p id="contact-equipment-error" role="alert" className="mt-1.5 text-xs font-medium text-primary-700">
                              {errorFor('equipment')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-status" className="block text-sm font-medium text-navy-800 mb-2">
                            Current Status
                          </label>
                          <select
                            id="contact-status"
                            value={formState.currentStatus}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                currentStatus: e.target.value,
                              })
                            }
                            className={`${inputClasses} appearance-none`}
                          >
                            <option value="">Select…</option>
                            <option value="new-authority">New authority</option>
                            <option value="switching">Switching dispatchers</option>
                            <option value="self-dispatch">Self-dispatching now</option>
                            <option value="exploring">Just exploring</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="contact-factoring" className="block text-sm font-medium text-navy-800 mb-2">
                            Factoring
                          </label>
                          <select
                            id="contact-factoring"
                            value={formState.factoring}
                            onChange={(e) =>
                              setFormState({ ...formState, factoring: e.target.value })
                            }
                            className={`${inputClasses} appearance-none`}
                          >
                            <option value="">Select…</option>
                            <option value="have-factoring">Have a factoring company</option>
                            <option value="no-factoring">No factoring</option>
                            <option value="need-help">Need help choosing</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-lanes" className="block text-sm font-medium text-navy-800 mb-2">
                          Preferred Lanes / States
                        </label>
                        <input
                          id="contact-lanes"
                          type="text"
                          value={formState.lanes}
                          onChange={(e) =>
                            setFormState({ ...formState, lanes: e.target.value })
                          }
                          className={inputClasses}
                          placeholder="e.g., TX to CA, Southeast"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-navy-800 mb-2">
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          value={formState.message}
                          onChange={(e) =>
                            setFormState({ ...formState, message: e.target.value })
                          }
                          rows={4}
                          className={`${inputClasses} resize-none`}
                          placeholder="Tell us about your trucking business and what you're looking for..."
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formState.requestCallback}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              requestCallback: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-navy-800">
                          I would prefer a callback instead of email
                        </span>
                      </label>

                      {submitFailed && (
                        <div
                          role="alert"
                          className="flex gap-3 rounded-md border border-primary-200 bg-primary-50 px-4 py-3"
                        >
                          <AlertTriangle
                            className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5"
                            aria-hidden="true"
                          />
                          <div className="text-sm text-navy-900">
                            <p className="font-semibold text-primary-700 mb-1">
                              We couldn&apos;t send that just now.
                            </p>
                            <p>
                              Please call{' '}
                              <a
                                href={BUSINESS.phoneHref}
                                onClick={() => track('call_click', { location: 'contact_faq_cta' })}
                                className="font-semibold text-primary-700 underline underline-offset-2"
                              >
                                {BUSINESS.phone}
                              </a>{' '}
                              or{' '}
                              <a
                                href={BUSINESS.smsHref}
                                onClick={() => track('sms_click', { location: 'contact_faq_cta' })}
                                className="font-semibold text-primary-700 underline underline-offset-2"
                              >
                                text us
                              </a>{' '}
                              and we&apos;ll get you set up.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary flex-1 px-8 py-4 disabled:opacity-70 disabled:pointer-events-none"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Send className="w-5 h-5" aria-hidden="true" />
                          )}
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                        <a
                          href={BUSINESS.phoneHref}
                          onClick={() => track('call_click', { location: 'contact_final_cta' })}
                          className="btn-secondary py-4"
                          aria-label={`Call Rai Dispatch at ${BUSINESS.phone}`}
                        >
                          <Phone className="w-5 h-5" aria-hidden="true" />
                          Call
                        </a>
                        <a href={BUSINESS.smsHref} className="btn-secondary py-4"
                        onClick={() => track('sms_click', { location: 'contact_final_cta' })}
                        >
                          <MessageCircle className="w-5 h-5" aria-hidden="true" />
                          Text
                        </a>
                      </div>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MINI FAQ — quick answers before the phone call.
          ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="eyebrow">Before you call</p>
              <h2 className="section-heading">Quick answers</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl">
            {[
              {
                q: 'How quickly can I get started?',
                a: 'Timing depends on complete documents, broker eligibility, and available freight. Call us to discuss your start date.',
              },
              {
                q: 'Do you work nationwide?',
                a: 'Yes! We dispatch trucks across all 48 contiguous states.',
              },
              {
                q: 'What documents do I need?',
                a: 'MC Authority, Certificate of Insurance, W-9, and signed agreement.',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.q} delay={idx * 0.1}>
                <div className="bg-surface-50 rounded-lg border border-surface-200 p-6 h-full">
                  <h3 className="font-display text-xl font-bold text-navy-950 mb-2">
                    {item.q}
                  </h3>
                  <p className="text-surface-700 text-sm leading-relaxed">{item.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
