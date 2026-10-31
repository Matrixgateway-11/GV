import { supabase } from './supabase';

/**
 * Furniture photos shown in "Explore the Collections" on the website.
 *
 * Pictures are kept in the "gallery" Storage bucket and listed in the gallery_photos
 * table (see supabase/gallery.sql). The website reads them through /api/photos, so a
 * photo added here appears on the site within a minute — it is not rebuilt.
 *
 * Both sizes are made here in the browser before uploading: a large one for the viewer
 * and a small one for the grid, so the site never downloads a 6 MB phone photo.
 */

const BUCKET = 'gallery';

/** Longest side of each size, in pixels. Matches the srcSet the website asks for. */
const FULL_SIZE = 1600;
const THUMB_SIZE = 640;
const QUALITY = 0.82;

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export type GalleryPhoto = {
  id: string;
  collection: string;
  category: string;
  path: string;
  thumb_path: string;
  alt: string;
  wide: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

/** The sections a photo can go in — the same ids the website uses in src/data/collections.ts. */
export const SECTIONS: { collection: string; category: string; label: string; group: string }[] = [
  { collection: 'furniture-crafts', category: 'chairs', label: 'Chairs', group: 'Furniture & Crafts' },
  { collection: 'furniture-crafts', category: 'set-collections', label: 'Set Collections', group: 'Furniture & Crafts' },
  { collection: 'furniture-crafts', category: 'tables', label: 'Tables', group: 'Furniture & Crafts' },
  { collection: 'furniture-crafts', category: 'stools-benches', label: 'Stools & Benches', group: 'Furniture & Crafts' },
  { collection: 'furniture-crafts', category: 'baskets', label: 'Baskets', group: 'Furniture & Crafts' },
  { collection: 'furniture-crafts', category: 'mirrors', label: 'Mirrors', group: 'Furniture & Crafts' },
  { collection: 'furniture-crafts', category: 'crafts-decoration', label: 'Crafts & Decoration', group: 'Furniture & Crafts' },
  { collection: 'furniture-crafts', category: 'rugs-carpets', label: 'Rugs & Carpets', group: 'Furniture & Crafts' },
  { collection: 'doors-flooring', category: 'doors', label: 'Doors', group: 'Doors & Flooring' },
  { collection: 'doors-flooring', category: 'flooring', label: 'Flooring', group: 'Doors & Flooring' },
];

export const sectionLabel = (category: string) => SECTIONS.find((s) => s.category === category)?.label ?? category;

/** Web address of a file in the public bucket, for showing it in the panel. */
export function fileUrl(path: string): string {
  const client = supabase;
  if (!client) return '';
  return client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Draws the picture at a smaller size and returns it as WebP. */
async function resize(bitmap: ImageBitmap, longestSide: number): Promise<Blob> {
  const scale = Math.min(1, longestSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot prepare images. Try Chrome, Edge or Safari.');
  context.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', QUALITY));
  if (!blob) throw new Error('The picture could not be prepared. It may be an unusual format.');
  return blob;
}

/** True for landscape pictures, which the website shows whole instead of cropping. */
const isWide = (bitmap: ImageBitmap) => bitmap.width > bitmap.height * 1.15;

const randomName = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export type UploadResult = { photo: GalleryPhoto };

export async function uploadPhoto(options: {
  file: File;
  collection: string;
  category: string;
  alt: string;
  sortOrder: number;
  addedBy: string;
}): Promise<UploadResult> {
  const client = supabase;
  if (!client) throw new Error('Not connected to the database.');

  const { file, collection, category, alt, sortOrder, addedBy } = options;
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not a picture.`);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name} is larger than 25 MB.`);

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`${file.name} could not be opened. Try saving it as JPEG or PNG first.`);
  }

  // Read the shape before the picture is released below.
  const wide = isWide(bitmap);

  let full: Blob;
  let thumb: Blob;
  try {
    full = await resize(bitmap, FULL_SIZE);
    thumb = await resize(bitmap, THUMB_SIZE);
  } finally {
    bitmap.close();
  }

  const name = randomName();
  const path = `${category}/${name}.webp`;
  const thumbPath = `${category}/${name}-thumb.webp`;

  const uploadOne = async (to: string, blob: Blob) => {
    const { error } = await client.storage.from(BUCKET).upload(to, blob, { contentType: 'image/webp', upsert: false });
    if (error) throw new Error(`Could not upload ${file.name}: ${error.message}`);
  };

  await uploadOne(path, full);
  try {
    await uploadOne(thumbPath, thumb);
  } catch (error) {
    // Don't leave the large picture behind with no small one to go with it.
    await client.storage.from(BUCKET).remove([path]);
    throw error;
  }

  const row = {
    collection,
    category,
    path,
    thumb_path: thumbPath,
    alt: alt.trim(),
    wide,
    sort_order: sortOrder,
    added_by: addedBy,
  };

  const { data, error } = await client.from('gallery_photos').insert(row).select().single();
  if (error) {
    await client.storage.from(BUCKET).remove([path, thumbPath]);
    throw new Error(`Could not save ${file.name}: ${error.message}`);
  }
  return { photo: data as GalleryPhoto };
}

export async function listPhotos(): Promise<GalleryPhoto[]> {
  const client = supabase;
  if (!client) return [];
  const { data, error } = await client
    .from('gallery_photos')
    .select('id, collection, category, path, thumb_path, alt, wide, sort_order, is_published, created_at')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as GalleryPhoto[];
}

export async function deletePhoto(photo: GalleryPhoto): Promise<void> {
  const client = supabase;
  if (!client) throw new Error('Not connected to the database.');

  // .select() matters: without it a delete the database refuses comes back with no error
  // and no rows, which looks exactly like success.
  const { data, error } = await client.from('gallery_photos').delete().eq('id', photo.id).select('id');
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('The database would not remove that photo. Check your email is still on the admin list, then try again.');
  }

  // The row is what the website reads, so the photo is already gone from the site.
  // Tidying the files is best effort: a leftover file is untidy, not broken.
  try {
    await client.storage.from(BUCKET).remove([photo.path, photo.thumb_path]);
  } catch {
    /* ignore */
  }
}

export async function patchPhoto(id: string, patch: Partial<Pick<GalleryPhoto, 'alt' | 'wide' | 'is_published' | 'sort_order' | 'category' | 'collection'>>): Promise<void> {
  const client = supabase;
  if (!client) throw new Error('Not connected to the database.');
  const { data, error } = await client.from('gallery_photos').update(patch).eq('id', id).select('id');
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('The database would not save that change. Check your email is still on the admin list, then try again.');
  }
}

/** Swaps a photo with its neighbour so admins can set the order photos appear in. */
export async function swapOrder(a: GalleryPhoto, b: GalleryPhoto): Promise<void> {
  const client = supabase;
  if (!client) throw new Error('Not connected to the database.');
  const { error: first } = await client.from('gallery_photos').update({ sort_order: b.sort_order }).eq('id', a.id);
  if (first) throw first;
  const { error: second } = await client.from('gallery_photos').update({ sort_order: a.sort_order }).eq('id', b.id);
  if (second) throw second;
}

/** Next position at the end of a section. */
export const nextSortOrder = (photos: GalleryPhoto[], category: string) =>
  photos.filter((p) => p.category === category).reduce((highest, p) => Math.max(highest, p.sort_order), 0) + 1;
