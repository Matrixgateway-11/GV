/** Server-side checks for an enquiry from the website form (never trust the browser's validation alone). */

export const interestOptions = ['Furniture & Crafts', 'Doors', 'Flooring', 'Custom / OEM & ODM'];

export type CleanEnquiry = {
  name: string;
  email: string;
  phone: string;
  phone_country: string | null;
  company: string | null;
  country: string | null;
  interests: string[];
  message: string;
  page: string | null;
};

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const optional = (value: unknown, max: number) => text(value, max) || null;

export function cleanEnquiry(body: Record<string, unknown>): { enquiry: CleanEnquiry } | { errors: string[] } {
  const name = text(body.name, 120);
  const email = text(body.email, 200).toLowerCase();
  const phone = text(body.phone, 40);
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';
  const phoneCountry = text(body.phoneCountry, 2).toUpperCase();
  const digits = phone.replace(/\D/g, '');

  const errors: string[] = [];
  if (name.length < 2) errors.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('email');
  if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) errors.push('phone');
  if (message.length < 10) errors.push('message');
  if (body.consent !== true) errors.push('consent');
  if (errors.length) return { errors };

  const interests = Array.isArray(body.interests) ? interestOptions.filter((option) => (body.interests as unknown[]).includes(option)) : [];
  return {
    enquiry: {
      name,
      email,
      phone,
      phone_country: /^[A-Z]{2}$/.test(phoneCountry) ? phoneCountry : null,
      company: optional(body.company, 160),
      country: optional(body.country, 80),
      interests,
      message,
      page: optional(body.page, 300),
    },
  };
}
