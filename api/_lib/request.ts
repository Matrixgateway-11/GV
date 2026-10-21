import { createHash } from 'node:crypto';

/** Helpers for reading who / where a request comes from, without storing anything personal. */

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const noContent = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

/** True on the test (preview) deployments and local runs, so their data can be kept apart. */
export const isTestSite = () => process.env.VERCEL_ENV !== 'production';

/** Secret mixed into hashes, so they can't be reversed by guessing IP addresses. */
const salt = () => process.env.ANALYTICS_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || 'golden-village';

export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

export function clientIp(request: Request): string {
  return (request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? '').trim();
}

/** Two-letter country from Vercel's IP geolocation, if available. */
export function clientCountry(request: Request): string | null {
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) ? country : null;
}

export function deviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(userAgent)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

export const isBot = (userAgent: string) =>
  !userAgent || /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless|pingdom|monitor|curl|wget|python|axios|node-fetch/i.test(userAgent);

/** Same person, same day → same hash; a new hash every day so nobody can be followed across days. */
export function dailyVisitorHash(request: Request): string {
  const day = new Date().toISOString().slice(0, 10);
  return sha256(`${day}|${salt()}|${clientIp(request)}|${request.headers.get('user-agent') ?? ''}`).slice(0, 32);
}

/** Stable hash of the sender's IP, used only to limit how many enquiries one sender can make. */
export const ipHash = (request: Request) => sha256(`enquiry|${salt()}|${clientIp(request)}`).slice(0, 32);

/** Host name of an external referring site ("google.com"), or null for direct visits and internal links. */
export function referrerHost(referrer: unknown, request: Request): string | null {
  if (typeof referrer !== 'string' || !referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
    const ownHost = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '').split(':')[0].replace(/^www\./, '');
    return host && host !== ownHost ? host.slice(0, 120) : null;
  } catch {
    return null;
  }
}

/** Rejects posts made from other websites (browsers mark these with Sec-Fetch-Site). */
export const isCrossSite = (request: Request) => {
  const site = request.headers.get('sec-fetch-site');
  return site !== null && site !== 'same-origin' && site !== 'none';
};
