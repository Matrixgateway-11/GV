import { brand } from '../data/site';

/**
 * "Request Catalog" enquiry: form model, validation, message formatting and submission.
 *
 * Submission: when VITE_ENQUIRY_ENDPOINT is set (the future backend), the enquiry is POSTed there as JSON.
 * Until then it falls back to opening the visitor's email app with the enquiry pre-written to the company
 * address, so no enquiry is ever silently lost.
 */

export const interestOptions = ['Furniture & Crafts', 'Doors', 'Flooring', 'Custom / OEM & ODM'] as const;
export type Interest = (typeof interestOptions)[number];

export type EnquiryForm = {
  name: string;
  email: string;
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
  const digits = form.phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(form.phone.trim()) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone number, including the country code.';
  }
  if (form.message.trim().length < 10) errors.message = 'Please tell us a little about what you need (at least 10 characters).';
  if (!form.consent) errors.consent = 'Please confirm we may contact you about this enquiry.';
  return errors;
}

/** Plain-text summary used for email, WhatsApp and "copy details". */
export function enquiryText(form: EnquiryForm): string {
  const lines = [`Name: ${form.name.trim()}`, `Email: ${form.email.trim()}`, `Phone: ${form.phone.trim()}`];
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

const endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined;

export async function submitEnquiry(form: EnquiryForm): Promise<DeliveryMode> {
  if (form.website) return 'sent'; // honeypot filled: quietly pretend it worked
  if (endpoint) {
    const { website: _honeypot, ...payload } = form;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString(), page: window.location.href }),
    });
    if (!response.ok) throw new Error(`Enquiry could not be sent (${response.status}).`);
    return 'sent';
  }
  window.location.href = enquiryMailto(form);
  return 'email-app';
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
