import { cleanEnquiry } from './_lib/enquiry.js';
import { emailConfigured, sendEnquiryEmail } from './_lib/email.js';
import { clientCountry, ipHash, isCrossSite, isTestSite, json } from './_lib/request.js';
import { countRows, insertRow, supabaseConfigured, updateRow } from './_lib/supabase.js';

/**
 * POST /api/enquiry — the website's "Request Catalog" form.
 * Saves the enquiry for the admin panel (Supabase) and emails it to the team (Resend).
 * Until neither is configured it answers 503, and the website falls back to opening the visitor's email app.
 */

const MAX_PER_HOUR = 5;

export async function POST(request: Request) {
  const store = supabaseConfigured();
  const mail = emailConfigured();
  if (!store && !mail) return json({ error: 'not_configured' }, 503);
  if (isCrossSite(request)) return json({ error: 'forbidden' }, 403);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ error: 'invalid_json' }, 400);
  if (body.website) return json({ ok: true }); // spam trap filled in: pretend it worked

  const result = cleanEnquiry(body);
  if ('errors' in result) return json({ error: 'invalid', fields: result.errors }, 422);
  const { enquiry } = result;

  const country = clientCountry(request);
  const isTest = isTestSite();
  const senderHash = ipHash(request);

  let id: string | undefined;
  if (store) {
    try {
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      if ((await countRows('enquiries', `ip_hash=eq.${senderHash}&created_at=gte.${since}`)) >= MAX_PER_HOUR) {
        return json({ error: 'rate_limited' }, 429);
      }
      const row = await insertRow<{ id: string }>(
        'enquiries',
        { ...enquiry, ip_country: country, ip_hash: senderHash, is_test: isTest },
        true,
      );
      id = row?.id;
    } catch (error) {
      console.error(error);
      if (!mail) return json({ error: 'not_saved' }, 502);
    }
  }

  let emailed = false;
  if (mail) {
    try {
      await sendEnquiryEmail(enquiry, { country, isTest });
      emailed = true;
    } catch (error) {
      console.error(error);
    }
  }

  if (!id && !emailed) return json({ error: 'not_delivered' }, 502);
  if (id && emailed) await updateRow('enquiries', id, { email_sent: true }).catch((error) => console.error(error));
  return json({ ok: true, id: id ?? null });
}
