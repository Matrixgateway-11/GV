import { json } from './_lib/request.js';
import { selectRows, storagePublicUrl, supabaseConfigured } from './_lib/supabase.js';

/**
 * GET /api/photos — the furniture photos added from the admin panel.
 * The website merges these into "Explore the Collections" on top of the photos built into it,
 * so a photo uploaded in the panel appears here without the site being rebuilt.
 * Until Supabase is set up it answers with an empty list and the website shows its built-in photos only.
 */

const BUCKET = 'gallery';

/** How long a browser or Vercel's CDN may reuse the list before asking again. */
const CACHE = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300';

type Row = {
  id: string;
  collection: string;
  category: string;
  path: string;
  thumb_path: string;
  alt: string;
  wide: boolean;
};

/** Why the list came back empty, so the website's galleries can be checked from outside. Never includes the key. */
const empty = (why: string) =>
  new Response(JSON.stringify({ photos: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Photos-Source': why },
  });

export async function GET() {
  if (!supabaseConfigured()) return empty('not-configured');

  let rows: Row[];
  try {
    rows = await selectRows<Row>(
      'gallery_photos',
      'select=id,collection,category,path,thumb_path,alt,wide' +
        '&is_published=eq.true' +
        '&order=collection.asc,category.asc,sort_order.asc,created_at.asc',
    );
  } catch (error) {
    // A database hiccup must not empty the galleries: the website keeps its built-in photos.
    const status = (error instanceof Error ? error.message.match(/\((\d{3})\)/) : null)?.[1] ?? 'failed';
    return empty(`query-${status}`);
  }

  const photos = rows.map((row) => ({
    id: row.id,
    collection: row.collection,
    category: row.category,
    src: storagePublicUrl(BUCKET, row.path),
    thumb: storagePublicUrl(BUCKET, row.thumb_path),
    alt: row.alt || 'Furniture by Golden Village Furnitures',
    wide: row.wide,
  }));

  return new Response(JSON.stringify({ photos }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': CACHE, 'X-Photos-Source': 'database' },
  });
}

export async function POST() {
  return json({ error: 'method_not_allowed' }, 405);
}
