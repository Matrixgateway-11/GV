import { useEffect, useMemo, useState } from 'react';
import { collections as builtIn, type Collection } from './collections';
import type { GalleryImage } from './gallery';

/**
 * Photos added from the admin panel.
 *
 * The photos built into the website (src/assets/gallery) are always shown. Anything an
 * admin uploads is fetched from /api/photos and added after them, in the section it was
 * put in — so the galleries fill out without the site being rebuilt.
 *
 * If the request fails, or the backend isn't set up, the built-in photos are shown alone.
 */

type ManagedPhoto = {
  id: string;
  collection: string;
  category: string;
  src: string;
  thumb: string;
  alt: string;
  wide: boolean;
};

const toImage = (photo: ManagedPhoto): GalleryImage => ({
  src: photo.src,
  thumb: photo.thumb,
  alt: photo.alt,
  wide: photo.wide,
});

/** Built-in collections with the uploaded photos added to the right sections. */
export function mergeCollections(base: Collection[], managed: ManagedPhoto[]): Collection[] {
  if (!managed.length) return base;

  return base.map((collection) => {
    const mine = managed.filter((photo) => photo.collection === collection.id);
    if (!mine.length) return collection;

    const categories = collection.categories.map((category) => {
      const extra = mine.filter((photo) => photo.category === category.id);
      return extra.length ? { ...category, images: [...category.images, ...extra.map(toImage)] } : category;
    });

    // "All" shows every photo in the collection, uploaded ones included.
    return { ...collection, all: [...collection.all, ...mine.map(toImage)], categories };
  });
}

async function fetchManaged(signal: AbortSignal): Promise<ManagedPhoto[]> {
  const response = await fetch('/api/photos', { signal });
  if (!response.ok) return [];
  const body = (await response.json()) as { photos?: ManagedPhoto[] };
  return Array.isArray(body.photos) ? body.photos : [];
}

export function useCollections(): Collection[] {
  const [managed, setManaged] = useState<ManagedPhoto[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchManaged(controller.signal)
      .then(setManaged)
      .catch(() => {
        /* offline, or the backend isn't set up — the built-in photos are enough */
      });
    return () => controller.abort();
  }, []);

  return useMemo(() => mergeCollections(builtIn, managed), [managed]);
}
