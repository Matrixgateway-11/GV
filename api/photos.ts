import { json } from './_lib/request.js';
import { selectRows, storagePublicUrl, supabaseConfigured } from './_lib/supabase.js';

/**
 * GET /api/photos — the furniture photos added from the admin panel.
 * The website merges these into "Explore the Collections" on top of the photos built into it,
 * so a photo uploaded in the panel appears here without the site being rebuilt.
 * Until Supabase is set up it answers with an empty list and the website shows its built-in photos only.
 */

const BUCKET = 'gallery';

/**
 * How long Vercel's CDN may reuse the list before asking again.
 * Kept short, and with no stale-while-revalidate: hiding or removing a photo in the admin
 * panel has to show on the website almost at once, which matters more here than saving
 * a few requests. Five seconds still absorbs a burst of visitors.
 */
const CACHE = 'public, max-age=0, s-maxage=5';

type SectionRow = {
  category: string;
  collection: string;
  label: string | null;
  sort_order: number;
  is_custom: boolean;
  show_builtin: boolean;
};

type CustomSection = { collection: string; category: string; label: string; sortOrder: number };

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
  new Response(JSON.stringify({ photos: [], hiddenBuiltin: [], customSections: [] }), {
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

  // What an admin has changed about the sections: built-in photos switched off,
  // and sections they added themselves. If this can't be read, the website is left as built.
  let hiddenBuiltin: string[] = [];
  let customSections: CustomSection[] = [];
  try {
    const sections = await selectRows<SectionRow>(
      'gallery_sections',
      'select=category,collection,label,sort_order,is_custom,show_builtin&order=sort_order.asc,category.asc',
    );
    hiddenBuiltin = sections.filter((section) => section.show_builtin === false).map((section) => section.category);
    customSections = sections
      .filter((section) => section.is_custom)
      .map((section) => ({
        collection: section.collection,
        category: section.category,
        label: section.label || section.category,
        sortOrder: section.sort_order,
      }));
  } catch {
    hiddenBuiltin = [];
    customSections = [];
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

  return new Response(JSON.stringify({ photos, hiddenBuiltin, customSections }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': CACHE, 'X-Photos-Source': 'database' },
  });
}

export async function POST() {
  return json({ error: 'method_not_allowed' }, 405);
}
