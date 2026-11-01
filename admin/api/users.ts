/**
 * /api/users — who may use the admin panel.
 *
 * The panel is a plain web page, so it cannot hold the secret key. This runs on the server
 * beside it and does the three things the panel needs: list the admins, invite a new one,
 * and take someone's access away.
 *
 * Every call is checked twice: the sign-in token has to be real, and the person it belongs to
 * has to already be on the admin list.
 *
 * Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on this project (server-side only).
 */

const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function serviceHeaders(prefer?: string): Record<string, string> {
  const headers: Record<string, string> = {
    apikey: key!,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
  if (prefer) headers.Prefer = prefer;
  return headers;
}

/** The email behind the caller's sign-in token, or null if the token isn't good. */
async function callerEmail(request: Request): Promise<string | null> {
  const header = request.headers.get('authorization') ?? '';
  if (!/^bearer /i.test(header)) return null;
  const token = header.slice(7).trim();
  if (!token) return null;

  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key!, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { email?: unknown };
  return typeof user.email === 'string' ? user.email.toLowerCase() : null;
}

async function onAdminList(email: string): Promise<boolean> {
  const response = await fetch(
    `${url}/rest/v1/admin_users?select=email&email=eq.${encodeURIComponent(email)}`,
    { headers: serviceHeaders() },
  );
  if (!response.ok) return false;
  const rows = (await response.json()) as unknown[];
  return Array.isArray(rows) && rows.length > 0;
}

/** Runs the checks every call needs. Returns the caller's email, or a reply to send back. */
async function allow(request: Request): Promise<{ email: string } | { reply: Response }> {
  if (!url || !key) return { reply: json({ error: 'not_configured' }, 503) };
  const email = await callerEmail(request);
  if (!email) return { reply: json({ error: 'not_signed_in' }, 401) };
  if (!(await onAdminList(email))) return { reply: json({ error: 'not_an_admin' }, 403) };
  return { email };
}

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export async function GET(request: Request) {
  const check = await allow(request);
  if ('reply' in check) return check.reply;

  const response = await fetch(`${url}/rest/v1/admin_users?select=email,added_at&order=added_at.asc`, {
    headers: serviceHeaders(),
  });
  if (!response.ok) return json({ error: 'read_failed' }, 500);

  const admins = (await response.json()) as { email: string; added_at: string }[];
  return json({ admins, you: check.email });
}

export async function POST(request: Request) {
  const check = await allow(request);
  if ('reply' in check) return check.reply;

  let body: { email?: unknown; password?: unknown };
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!looksLikeEmail(email)) return json({ error: 'invalid_email' }, 422);

  // A password means the admin is setting the account up themselves; no password means
  // we email an invitation and the person chooses their own.
  const password = typeof body.password === 'string' ? body.password : '';
  if (password && password.length < 8) return json({ error: 'password_too_short' }, 422);

  // On the list first, so the account works the moment it exists.
  const added = await fetch(`${url}/rest/v1/admin_users`, {
    method: 'POST',
    headers: serviceHeaders('resolution=ignore-duplicates,return=minimal'),
    body: JSON.stringify({ email }),
  });
  if (!added.ok) return json({ error: 'add_failed', detail: (await added.text()).slice(0, 200) }, 500);

  if (password) {
    // Made ready to use straight away: no confirmation email to wait for.
    const created = await fetch(`${url}/auth/v1/admin/users`, {
      method: 'POST',
      headers: serviceHeaders(),
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
    if (created.ok) return json({ ok: true, email, created: true });

    const detail = (await created.text()).slice(0, 300);
    if (created.status === 422 || /already|exists|registered/i.test(detail)) {
      return json({ ok: true, email, created: false, alreadyHasAccount: true });
    }
    return json({ error: 'create_failed', detail }, 500);
  }

  // Invite them to pick a password. Someone who already has an account just keeps it.
  const invited = await fetch(`${url}/auth/v1/invite`, {
    method: 'POST',
    headers: serviceHeaders(),
    body: JSON.stringify({ email }),
  });

  if (invited.ok) return json({ ok: true, email, invited: true });

  const detail = (await invited.text()).slice(0, 300);
  const alreadyHasAccount = invited.status === 422 || /already/i.test(detail);
  return json({ ok: true, email, invited: false, alreadyHasAccount, detail: alreadyHasAccount ? '' : detail });
}

export async function DELETE(request: Request) {
  const check = await allow(request);
  if ('reply' in check) return check.reply;

  const email = (new URL(request.url).searchParams.get('email') ?? '').trim().toLowerCase();
  if (!looksLikeEmail(email)) return json({ error: 'invalid_email' }, 422);
  if (email === check.email) return json({ error: 'cannot_remove_yourself' }, 409);

  // Only their access goes. The sign-in account stays, so nothing else of theirs is touched.
  const removed = await fetch(`${url}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}`, {
    method: 'DELETE',
    headers: serviceHeaders('return=representation'),
  });
  if (!removed.ok) return json({ error: 'remove_failed' }, 500);

  const rows = (await removed.json()) as unknown[];
  if (!Array.isArray(rows) || rows.length === 0) return json({ error: 'not_on_list' }, 404);
  return json({ ok: true, email });
}
