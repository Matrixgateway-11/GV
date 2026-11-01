import { supabase } from './supabase';

/**
 * Who may use the admin panel.
 *
 * The list is changed through /api/users, which runs on the server beside this page: the
 * secret key it needs must never reach a browser. Each call carries the signed-in admin's
 * token so the server can check who is asking.
 */

export type AdminUser = { email: string; added_at: string };

function explain(body: { error?: string; detail?: string }, status: number): string {
  switch (body.error) {
    case 'not_configured':
      return 'This panel cannot manage admins yet: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are missing from the admin project in Vercel.';
    case 'not_signed_in':
      return 'Your sign-in has run out. Sign out and in again.';
    case 'not_an_admin':
      return 'Only someone already on the admin list can change it.';
    case 'invalid_email':
      return 'That does not look like an email address.';
    case 'cannot_remove_yourself':
      return 'You cannot take away your own access. Ask another admin to do it.';
    case 'not_on_list':
      return 'That email was not on the list.';
    case 'password_too_short':
      return 'A password needs at least 8 characters.';
    case 'create_failed':
      return 'The account could not be made: ' + (body.detail || 'unknown reason') + '.';
    default:
      return body.detail || 'Something went wrong (' + status + ').';
  }
}

async function call(path: string, init: RequestInit = {}) {
  const client = supabase;
  if (!client) throw new Error('Not connected to the database.');

  const { data } = await client.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Your sign-in has run out. Sign out and in again.');

  const response = await fetch(path, {
    ...init,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(explain(body, response.status));
  return body;
}

export async function listAdmins(): Promise<{ admins: AdminUser[]; you: string }> {
  const body = (await call('/api/users')) as { admins?: AdminUser[]; you?: string };
  return { admins: body.admins ?? [], you: body.you ?? '' };
}

/**
 * Adds them to the admin list and gives them a way in.
 * With a password the account is ready at once; without one they get an invitation email
 * and choose their own.
 */
export async function addAdmin(
  email: string,
  password?: string,
): Promise<{ invited: boolean; created: boolean; alreadyHasAccount: boolean }> {
  const payload: { email: string; password?: string } = { email };
  if (password) payload.password = password;

  const body = (await call('/api/users', { method: 'POST', body: JSON.stringify(payload) })) as {
    invited?: boolean;
    created?: boolean;
    alreadyHasAccount?: boolean;
  };
  return {
    invited: Boolean(body.invited),
    created: Boolean(body.created),
    alreadyHasAccount: Boolean(body.alreadyHasAccount),
  };
}

/** Takes away access. Their sign-in account stays, so nothing else of theirs is touched. */
export async function removeAdmin(email: string): Promise<void> {
  await call('/api/users?email=' + encodeURIComponent(email), { method: 'DELETE' });
}
