import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Loader2, MessageCircle } from 'lucide-react';
import { ChoiceChips, ConsentField, TextAreaField, TextField } from './fields';
import {
  clearDraft,
  emptyEnquiry,
  enquiryWhatsApp,
  fieldOrder,
  interestOptions,
  loadDraft,
  MESSAGE_MAX,
  saveDraft,
  submitEnquiry,
  validateEnquiry,
  type DeliveryMode,
  type EnquiryField,
  type EnquiryForm as EnquiryFormData,
  type Interest,
} from '../../lib/enquiry';
import { brand } from '../../data/site';

type EnquiryFormProps = {
  /** Interests to pre-select (e.g. opened from the Doors section). */
  preset: Interest[];
  onDelivered: (mode: DeliveryMode, form: EnquiryFormData) => void;
};

function initialForm(preset: Interest[]): EnquiryFormData {
  const draft = loadDraft();
  const form = { ...emptyEnquiry, ...draft, consent: false, website: '' };
  const known = (form.interests ?? []).filter((item): item is Interest => (interestOptions as readonly string[]).includes(item));
  form.interests = Array.from(new Set([...known, ...preset]));
  return form;
}

export default function EnquiryForm({ preset, onDelivered }: EnquiryFormProps) {
  const [form, setForm] = useState<EnquiryFormData>(() => initialForm(preset));
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const refs = useRef<Partial<Record<EnquiryField, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const edited = useRef(false);

  const errors = validateEnquiry(form);
  const errorFor = (field: EnquiryField) => ((touched[field] || attempted) && errors[field]) || false;

  // Keep a draft only once the visitor has typed or picked something, so a link's preset doesn't stick to later visits.
  useEffect(() => {
    if (edited.current) saveDraft(form);
  }, [form]);

  // Focus the first field on larger screens (on phones this would pop the keyboard up immediately).
  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) refs.current.name?.focus({ preventScroll: true });
  }, []);

  const update = <K extends EnquiryField>(field: K, value: EnquiryFormData[K]) => {
    edited.current = true;
    setForm((current) => ({ ...current, [field]: value }));
  };
  const blur = (field: EnquiryField) => () => setTouched((current) => ({ ...current, [field]: true }));
  const toggleInterest = (interest: Interest) =>
    update('interests', form.interests.includes(interest) ? form.interests.filter((item) => item !== interest) : [...form.interests, interest]);

  /** Shows all errors and focuses the first problem; returns true when the form is ready to send. */
  const ensureValid = () => {
    setAttempted(true);
    const firstInvalid = fieldOrder.find((field) => errors[field]);
    if (!firstInvalid) return true;
    const element = refs.current[firstInvalid];
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === 'sending' || !ensureValid()) return;
    setStatus('sending');
    try {
      const mode = await submitEnquiry(form);
      clearDraft();
      onDelivered(mode, form);
    } catch {
      setStatus('error');
    }
  };

  const sendOnWhatsApp = () => {
    if (!ensureValid()) return;
    window.open(enquiryWhatsApp(form), '_blank', 'noopener,noreferrer');
    clearDraft();
    onDelivered('whatsapp', form);
  };

  const invalidCount = attempted ? fieldOrder.filter((field) => errors[field]).length : 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      <fieldset className="space-y-5">
        <legend className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-600">Your details</legend>
        <TextField
          id="enq-name"
          label="Full name"
          required
          autoComplete="name"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          onBlur={blur('name')}
          error={errorFor('name')}
          inputRef={(el) => (refs.current.name = el)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="enq-email"
            label="Email"
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={blur('email')}
            error={errorFor('email')}
            inputRef={(el) => (refs.current.email = el)}
          />
          <TextField
            id="enq-phone"
            label="Phone / WhatsApp"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+62 812 3456 7890"
            hint="Include your country code."
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            onBlur={blur('phone')}
            error={errorFor('phone')}
            inputRef={(el) => (refs.current.phone = el)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="enq-company"
            label="Company"
            autoComplete="organization"
            placeholder="Company name"
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
          />
          <TextField
            id="enq-country"
            label="Country"
            autoComplete="country-name"
            placeholder="Where should we ship?"
            value={form.country}
            onChange={(e) => update('country', e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-600">Your enquiry</legend>
        <ChoiceChips legend="What are you interested in?" options={interestOptions} value={form.interests} onToggle={toggleInterest} />
        <TextAreaField
          id="enq-message"
          label="Message"
          required
          rows={5}
          placeholder="Tell us about the products, quantities, sizes or finishes you need, and your timeline."
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          onBlur={blur('message')}
          error={errorFor('message')}
          count={form.message.length}
          max={MESSAGE_MAX}
          inputRef={(el) => (refs.current.message = el)}
        />
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech; bots usually fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="enq-website">Website</label>
        <input id="enq-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
      </div>

      <div className="space-y-6 border-t border-cream-300 pt-8">
        <ConsentField
          id="enq-consent"
          checked={form.consent}
          onChange={(checked) => update('consent', checked)}
          error={errorFor('consent')}
          inputRef={(el) => (refs.current.consent = el)}
        >
          I agree that {brand.name} may use these details to respond to my enquiry.
        </ConsentField>

        {invalidCount > 0 && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-800">
            Please check the {invalidCount === 1 ? 'highlighted field' : `${invalidCount} highlighted fields`} above.
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-800">
            Sorry — your enquiry couldn't be sent just now. Please try again, or send it on WhatsApp instead.
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold-400 px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-bark-900 shadow-[0_10px_30px_-10px_rgba(184,151,90,0.8)] transition-all duration-300 hover:bg-gold-500 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bark-800 focus-visible:ring-offset-2"
          >
            {status === 'sending' ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send Enquiry
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={sendOnWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold text-bark-700 transition-colors hover:text-sage-600"
          >
            <MessageCircle size={17} className="text-sage-600" />
            Send on WhatsApp instead
          </button>
        </div>
      </div>
    </form>
  );
}
