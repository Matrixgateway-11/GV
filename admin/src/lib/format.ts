import type { Period } from './types';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function countryName(code: string | null | undefined): string {
  if (!code || code === 'Unknown') return 'Unknown';
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/** 1,284 · 12.9K · 4.2M */
export function compact(value: number): string {
  if (Math.abs(value) < 10_000) return value.toLocaleString('en');
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export const percent = (part: number, whole: number) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : '—');

/** Parses the database's local period start ("2026-10-21T00:00:00") without any time-zone shifting. */
export function bucketDate(bucket: string): Date {
  const [year, month, day] = bucket.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Fixed three-letter names ("Sep", never "Sept") so axis labels stay even.
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayMonth = { format: (date: Date) => `${date.getDate()} ${months[date.getMonth()]}` };
const weekdayDayMonth = { format: (date: Date) => `${weekdays[date.getDay()]} ${dayMonth.format(date)}` };
const monthYear = { format: (date: Date) => `${months[date.getMonth()]} ${date.getFullYear()}` };
const monthOnly = { format: (date: Date) => months[date.getMonth()] };

/** Full label for a period, e.g. "Tue 21 Oct", "13 Oct – 19 Oct", "Oct 2026". */
export function periodLabel(bucket: string, period: Period): string {
  const start = bucketDate(bucket);
  if (period === 'day') return weekdayDayMonth.format(start);
  if (period === 'week') {
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    return `${dayMonth.format(start)} – ${dayMonth.format(end)}`;
  }
  return monthYear.format(start);
}

/** Short axis label for a period, e.g. "21 Oct", "Oct". */
export function periodTick(bucket: string, period: Period): string {
  const start = bucketDate(bucket);
  if (period === 'month') return start.getMonth() === 0 ? String(start.getFullYear()) : monthOnly.format(start);
  return dayMonth.format(start);
}

const shortDate = dayMonth;
const shortDateYear = { format: (date: Date) => `${dayMonth.format(date)} ${date.getFullYear()}` };
const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/** "21 Oct 2026, 14:05" in the viewer's time. */
export const fullDateTime = (iso: string) => `${shortDateYear.format(new Date(iso))}, ${time.format(new Date(iso))}`;

/** "Just now", "25 min ago", "3 h ago", "Yesterday", "12 Oct", "12 Oct 2025". */
export function relativeTime(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const minutes = Math.round((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date >= startOfToday) return `${hours} h ago`;
  if (date >= new Date(startOfToday.getTime() - 86_400_000)) return 'Yesterday';
  return date.getFullYear() === now.getFullYear() ? shortDate.format(date) : shortDateYear.format(date);
}

/** Readable name for a tracked view: a collection, or the Request Catalog form. */
export function sectionName(view: string): string {
  const names: Record<string, string> = {
    'explore/furniture-crafts': 'Furniture & Crafts collection',
    'explore/doors-flooring': 'Doors & Flooring collection',
    'request-catalog': 'Request Catalog form',
  };
  if (names[view]) return names[view];
  const slug = view.replace(/^explore\//, '').replace(/-/g, ' ');
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Digits for wa.me links: "+62 812-3456" → "628123456". */
export const phoneDigits = (phone: string) => phone.replace(/\D/g, '');
