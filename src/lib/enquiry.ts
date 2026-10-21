import { brand } from '../data/site';
import { formatPhone, phoneError } from './phone';

/**
 * "Request Catalog" enquiry: form model, validation, message formatting and submission.
 *
 * Submission: the enquiry is POSTed to the site's own server function (api/enquiry.ts), which saves it for
 * the admin panel and emails the team. While that isn't set up yet (it answers 503, or 404 in local
 * development), the visitor's email app opens with the enquiry pre-written instead, so none is ever lost.
 */

export const interestOptions = ['Furniture & Crafts', 'Doors', 'Flooring', 'Custom / OEM & ODM'] as const;
export type Interest = (typeof interestOptions)[number];

export type EnquiryForm = {
  name: string;
  email: string;
  /** ISO code of the country whose dialling code the number uses. */
  phoneCountry: string;
  /** The number without the dialling code, as typed. */
  phone: string;
  company: string;
  country: string;
  interests: Interest[];
  message: string;
  consent: boolean;
  /** Honeypot — hidden from people; bots tend to fill it in. */
  website: string;
};

export type EnquiryField = keyof EnquiryForm;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const MESSAGE_MAX = 1000;

export const emptyEnquiry: EnquiryForm = {
  name: '',
  email: '',
  phoneCountry: '',
  phone: '',
  company: '',
  country: '',
  interests: [],
  message: '',
  consent: false,
  website: '',
};

/** Order in which invalid fields receive focus on submit. */
export const fieldOrder: EnquiryField[] = ['name', 'email', 'phone', 'message', 'consent'];

export function validateEnquiry(form: EnquiryForm): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  const phone = phoneError(form.phoneCountry, form.phone);
  if (phone) errors.phone = phone;
  if (form.message.trim().length < 10) errors.message = 'Please tell us a little about what you need (at least 10 characters).';
  if (!form.consent) errors.consent = 'Please confirm we may contact you about this enquiry.';
  return errors;
}

/** The phone number in international format, e.g. "+62 812 3456 7890". */
export const fullPhone = (form: EnquiryForm) => formatPhone(form.phoneCountry, form.phone);

/** Plain-text summary used for email, WhatsApp and "copy details". */
export function enquiryText(form: EnquiryForm): string {
  const lines = [`Name: ${form.name.trim()}`, `Email: ${form.email.trim()}`, `Phone: ${fullPhone(form)}`];
  if (form.company.trim()) lines.push(`Company: ${form.company.trim()}`);
  if (form.country.trim()) lines.push(`Country: ${form.country.trim()}`);
  if (form.interests.length) lines.push(`Interested in: ${form.interests.join(', ')}`);
  lines.push('', 'Message:', form.message.trim());
  return lines.join('\n');
}

export const enquirySubject = (form: EnquiryForm) =>
  `Catalog request — ${form.name.trim()}${form.company.trim() ? ` (${form.company.trim()})` : ''}`;

export const enquiryMailto = (form: EnquiryForm) =>
  `mailto:${brand.email}?subject=${encodeURIComponent(enquirySubject(form))}&body=${encodeURIComponent(enquiryText(form))}`;

export const enquiryWhatsApp = (form: EnquiryForm) =>
  `https://wa.me/${brand.phoneDigits}?text=${encodeURIComponent(
    `Hello ${brand.name}, I would like to request your catalog.\n\n${enquiryText(form)}`,
  )}`;

/** How the enquiry left the site: delivered by the backend, or handed to the visitor's email app / WhatsApp. */
export type DeliveryMode = 'sent' | 'email-app' | 'whatsapp';

const ENDPOINT = '/api/enquiry';

export async function submitEnquiry(form: EnquiryForm): Promise<DeliveryMode> {
  if (form.website) return 'sent'; // honeypot filled: quietly pretend it worked
  const { website: _honeypot, ...payload } = form;
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, phone: fullPhone(form), page: window.location.href }),
  });
  if (response.status === 503 || response.status === 404) {
    window.location.href = enquiryMailto(form);
    return 'email-app';
  }
  if (!response.ok) throw new Error(`Enquiry could not be sent (${response.status}).`);
  return 'sent';
}

// Draft kept for the browser session, so closing the page doesn't lose what was typed.
const DRAFT_KEY = 'gv-enquiry-draft';

export function loadDraft(): Partial<EnquiryForm> | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<EnquiryForm>) : null;
  } catch {
    return null;
  }
}

export function saveDraft(form: EnquiryForm) {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, consent: false, website: '' }));
  } catch {
    /* storage unavailable (private mode, blocked) — drafts are a convenience only */
  }
}

export function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
