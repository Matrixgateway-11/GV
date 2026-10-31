import { useEffect, useMemo, useState } from 'react';
import { collections as builtIn, type Collection } from './collections';
import type { GalleryImage } from './gallery';

/**
 * What the admin panel controls in "Explore the Collections".
 *
 * Two things come from /api/photos: the photos an admin uploaded, and the sections where they
 * turned the website's own built-in photos off. Uploaded photos are added after whatever is left.
 *
 * If the request fails, or the backend isn't set up, the built-in photos are shown as they are.
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

type PhotosResponse = { photos?: ManagedPhoto[]; hiddenBuiltin?: string[] };

const toImage = (photo: ManagedPhoto): GalleryImage => ({
  src: photo.src,
  thumb: photo.thumb,
  alt: photo.alt,
  wide: photo.wide,
});

/** Built-in collections, with uploaded photos added and switched-off built-ins taken out. */
export function mergeCollections(
  base: Collection[],
  managed: ManagedPhoto[],
  hiddenBuiltin: string[] = [],
): Collection[] {
  const hidden = new Set(hiddenBuiltin);
  if (!managed.length && hidden.size === 0) return base;

  return base.map((collection) => {
    const mine = managed.filter((photo) => photo.collection === collection.id);
    const hidesAnything = collection.categories.some((category) => hidden.has(category.id));
    if (!mine.length && !hidesAnything) return collection;

    // Built-in photos in a switched-off section go from that tab and from "All" alike.
    const droppedSources = new Set<string>();
    for (const category of collection.categories) {
      if (hidden.has(category.id)) {
        for (const image of category.images) droppedSources.add(image.src);
      }
    }

    const categories = collection.categories.map((category) => {
      const extra = mine.filter((photo) => photo.category === category.id).map(toImage);
      const kept = hidden.has(category.id) ? [] : category.images;
      if (!extra.length && kept === category.images) return category;
      return { ...category, images: [...kept, ...extra] };
    });

    const all = [...collection.all.filter((image) => !droppedSources.has(image.src)), ...mine.map(toImage)];
    return { ...collection, all, categories };
  });
}

async function fetchPhotos(signal: AbortSignal): Promise<PhotosResponse> {
  const response = await fetch('/api/photos', { signal });
  if (!response.ok) return {};
  return (await response.json()) as PhotosResponse;
}

export function useCollections(): Collection[] {
  const [managed, setManaged] = useState<ManagedPhoto[]>([]);
  const [hiddenBuiltin, setHiddenBuiltin] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPhotos(controller.signal)
      .then((body) => {
        setManaged(Array.isArray(body.photos) ? body.photos : []);
        setHiddenBuiltin(Array.isArray(body.hiddenBuiltin) ? body.hiddenBuiltin : []);
      })
      .catch(() => {
        /* offline, or the backend isn't set up — the built-in photos are enough */
      });
    return () => controller.abort();
  }, []);

  return useMemo(() => mergeCollections(builtIn, managed, hiddenBuiltin), [managed, hiddenBuiltin]);
}
