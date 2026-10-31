import { isCrossSite, json } from './_lib/request.js';
import { deleteRows, selectRows, supabaseConfigured, upsertRows } from './_lib/supabase.js';

/**
 * POST /api/builtin-sync — the website telling the server which photos it was built with.
 *
 * The photos built into the site have file names that change with every build, so the admin
 * panel cannot name one on its own. The website sends its own catalogue here, keyed by steady
 * names like "indoor-07", and the panel reads it back to show them and hide them one at a time.
 *
 * It only runs when the catalogue has actually changed: the website compares the build stamp it
 * gets from /api/photos with its own, so this is a handful of writes per deploy, not per visit.
 */

const META_KEY = 'builtin_hash';
const MAX_PHOTOS = 2000;

type Incoming = {
  collection: string;
  category: string;
  id: string;
  src: string;
  thumb: string;
  alt?: string;
  wide?: boolean;
  position?: number;
};

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request: Request) {
  if (!supabaseConfigured()) return json({ error: 'not_configured' }, 503);
  // Only the website itself sends this.
  if (isCrossSite(request)) return json({ error: 'forbidden' }, 403);

  let body: { hash?: unknown; photos?: unknown };
  try {
    body = (await request.json()) as { hash?: unknown; photos?: unknown };
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const hash = text(body.hash, 64);
  const list = Array.isArray(body.photos) ? (body.photos as Incoming[]) : [];
  if (!hash || !list.length) return json({ error: 'invalid' }, 422);
  if (list.length > MAX_PHOTOS) return json({ error: 'too_many' }, 413);

  // Already stored this build's catalogue? Then there is nothing to do.
  try {
    const stored = await selectRows<{ value: string }>('gallery_meta', `select=value&key=eq.${META_KEY}`);
    if (stored[0]?.value === hash) return json({ ok: true, unchanged: true });
  } catch {
    // Can't tell — fall through and write it again, which is harmless.
  }

  const rows = list
    .map((photo, index) => ({
      category: text(photo.category, 60),
      photo_id: text(photo.id, 60),
      collection: text(photo.collection, 60),
      src: text(photo.src, 500),
      thumb: text(photo.thumb, 500),
      alt: text(photo.alt, 300),
      wide: Boolean(photo.wide),
      position: Number.isFinite(photo.position) ? Number(photo.position) : index,
      synced_at: new Date().toISOString(),
    }))
    .filter((row) => row.category && row.photo_id && row.collection && row.src && row.thumb);

  if (!rows.length) return json({ error: 'invalid' }, 422);

  try {
    // is_hidden is deliberately not sent, so an admin's choices survive a rebuild.
    await upsertRows('builtin_photos', rows, 'category,photo_id');

    // Drop anything the website no longer has, so removed photos don't linger in the panel.
    const keep = new Set(rows.map((row) => `${row.category}|${row.photo_id}`));
    const existing = await selectRows<{ category: string; photo_id: string }>(
      'builtin_photos',
      'select=category,photo_id',
    );
    for (const row of existing) {
      if (keep.has(`${row.category}|${row.photo_id}`)) continue;
      await deleteRows(
        'builtin_photos',
        `category=eq.${encodeURIComponent(row.category)}&photo_id=eq.${encodeURIComponent(row.photo_id)}`,
      );
    }

    await upsertRows('gallery_meta', [{ key: META_KEY, value: hash, updated_at: new Date().toISOString() }], 'key');
  } catch (error) {
    return json({ error: 'store_failed', detail: error instanceof Error ? error.message.slice(0, 200) : '' }, 500);
  }

  return json({ ok: true, stored: rows.length });
}

export async function GET() {
  return json({ error: 'method_not_allowed' }, 405);
}
