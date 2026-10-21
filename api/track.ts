import { clientCountry, dailyVisitorHash, deviceType, isBot, isCrossSite, isTestSite, noContent, referrerHost } from './_lib/request.js';
import { insertRow, supabaseConfigured } from './_lib/supabase.js';

/**
 * POST /api/track — anonymous visit counting for the admin dashboard.
 * Stores what was viewed, the referring site, country (from Vercel's IP lookup) and device type.
 * No cookies, no IP addresses: visitors are told apart only by a hash that changes every day.
 */

const VIEW = /^(home|request-catalog|explore\/[a-z0-9-]{1,40})$/;

export async function POST(request: Request) {
  if (!supabaseConfigured() || isCrossSite(request)) return noContent();
  const userAgent = request.headers.get('user-agent') ?? '';
  if (isBot(userAgent)) return noContent();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text()) as Record<string, unknown>; // sendBeacon posts text/plain
  } catch {
    return noContent();
  }

  const kind = body.kind === 'open' ? 'open' : 'pageview';
  const view = typeof body.view === 'string' && VIEW.test(body.view) ? body.view : 'home';
  try {
    await insertRow('page_views', {
      kind,
      view,
      referrer: kind === 'pageview' ? referrerHost(body.referrer, request) : null,
      country: clientCountry(request),
      device: deviceType(userAgent),
      visitor_hash: dailyVisitorHash(request),
      is_test: isTestSite(),
    });
  } catch (error) {
    console.error(error);
  }
  return noContent();
}
