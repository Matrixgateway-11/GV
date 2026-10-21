/**
 * Minimal Supabase (PostgREST) client for the server functions, using the secret service-role key.
 * Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables.
 */

const url = process.env.SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = () => Boolean(url && key);

function headers(prefer?: string): Record<string, string> {
  const result: Record<string, string> = { apikey: key!, 'Content-Type': 'application/json' };
  // Legacy service_role keys are JWTs and also go in Authorization; the newer sb_secret_ keys go in apikey only.
  if (key!.startsWith('eyJ')) result.Authorization = `Bearer ${key}`;
  if (prefer) result.Prefer = prefer;
  return result;
}

async function check(response: Response, action: string) {
  if (!response.ok) throw new Error(`Supabase ${action} failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
}

export async function insertRow<T = unknown>(table: string, row: Record<string, unknown>, returning = false): Promise<T | undefined> {
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers(returning ? 'return=representation' : 'return=minimal'),
    body: JSON.stringify(row),
  });
  await check(response, `insert into ${table}`);
  return returning ? ((await response.json()) as T[])[0] : undefined;
}

export async function updateRow(table: string, id: string, patch: Record<string, unknown>) {
  const response = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: headers('return=minimal'),
    body: JSON.stringify(patch),
  });
  await check(response, `update of ${table}`);
}

/** Number of rows matching a PostgREST filter, e.g. "ip_hash=eq.abc&created_at=gte.2026-01-01T00:00:00Z". */
export async function countRows(table: string, filter: string): Promise<number> {
  const response = await fetch(`${url}/rest/v1/${table}?select=id&${filter}`, {
    method: 'HEAD',
    headers: { ...headers('count=exact'), Range: '0-0' },
  });
  await check(response, `count of ${table}`);
  return Number(response.headers.get('content-range')?.split('/')[1] ?? 0) || 0;
}
