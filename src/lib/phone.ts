import { countries, type Country } from '../data/countries';
import { countryForTimeZone } from '../data/timezones';

/** Phone numbers are stored as a country (for its dialling code) plus the number as the visitor typed it. */

const byIso = new Map(countries.map((country) => [country.iso, country]));

export const findCountry = (iso: string): Country | undefined => byIso.get(iso);

/** For dialling codes shared by several countries, the one to pick by default. */
export const mainCountryForDial: Record<string, string> = {
  '1': 'US',
  '7': 'RU',
  '39': 'IT',
  '44': 'GB',
  '47': 'NO',
  '61': 'AU',
  '212': 'MA',
  '262': 'RE',
  '290': 'SH',
  '358': 'FI',
  '590': 'GP',
  '599': 'CW',
};

const FALLBACK_COUNTRY = 'ID';

/** Best guess at the visitor's country: their time zone, then their browser language's region, then Indonesia. */
export function guessCountry(): string {
  try {
    const iso = countryForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (iso && byIso.has(iso)) return iso;
  } catch {
    /* Intl unavailable — fall through */
  }
  for (const language of navigator.languages ?? [navigator.language]) {
    const region = language?.split('-').slice(1).find((part) => /^[a-z]{2}$/i.test(part))?.toUpperCase();
    if (region && byIso.has(region)) return region;
  }
  return FALLBACK_COUNTRY;
}

/**
 * When a full international number is typed or pasted ("+44 20 7946 0958"), splits off the dialling code.
 * Dialling codes never start with another code, so the first match is the right one.
 */
export function splitInternational(value: string, currentIso: string): { iso: string; national: string } | null {
  const trimmed = value.trimStart();
  if (!trimmed.startsWith('+')) return null;
  const digits = trimmed.replace(/\D/g, '');
  for (let length = 1; length <= 3 && length <= digits.length; length++) {
    const dial = digits.slice(0, length);
    const matches = countries.filter((country) => country.dial === dial);
    if (!matches.length) continue;
    const iso = matches.some((country) => country.iso === currentIso) ? currentIso : (mainCountryForDial[dial] ?? matches[0].iso);
    // Drop the "+" and the code's digits, keep the rest as typed.
    let seen = 0;
    let index = 0;
    while (index < trimmed.length && seen < length) {
      if (/\d/.test(trimmed[index])) seen++;
      index++;
    }
    return { iso, national: trimmed.slice(index).replace(/^[\s().-]+/, '') };
  }
  return null;
}

export function phoneError(iso: string, national: string): string | undefined {
  const country = byIso.get(iso);
  if (!country) return 'Please choose your country code.';
  const digits = national.replace(/\D/g, '');
  const total = country.dial.length + digits.length;
  if (!/^[\d\s().-]+$/.test(national.trim()) || digits.length < 4 || total < 7 || total > 15) return 'Please enter a valid phone number.';
  return undefined;
}

export function formatPhone(iso: string, national: string): string {
  const country = byIso.get(iso);
  return country ? `+${country.dial} ${national.trim()}` : national.trim();
}
