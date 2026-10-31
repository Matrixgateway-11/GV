import { useEffect, useMemo, useState } from 'react';
import { collections as builtIn, type Collection } from './collections';
import type { GalleryImage } from './gallery';

/**
 * What the admin panel controls in "Explore the Collections".
 *
 * /api/photos answers with three things: the photos an admin uploaded, the sections where they
 * turned the website's own built-in photos off, and any sections they added themselves.
 * Uploaded photos are added after whatever built-in photos are left in a section.
 *
 * If the request fails, or the backend isn't set up, the website is shown exactly as it was built.
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

type CustomSection = { collection: string; category: string; label: string; sortOrder: number };

type PhotosResponse = {
  photos?: ManagedPhoto[];
  hiddenBuiltin?: string[];
  customSections?: CustomSection[];
};

const toImage = (photo: ManagedPhoto): GalleryImage => ({
  src: photo.src,
  thumb: photo.thumb,
  alt: photo.alt,
  wide: photo.wide,
});

/** Built-in collections, with everything the admin panel changed applied on top. */
export function mergeCollections(
  base: Collection[],
  managed: ManagedPhoto[],
  hiddenBuiltin: string[] = [],
  customSections: CustomSection[] = [],
): Collection[] {
  const hidden = new Set(hiddenBuiltin);
  if (!managed.length && hidden.size === 0 && customSections.length === 0) return base;

  return base.map((collection) => {
    const mine = managed.filter((photo) => photo.collection === collection.id);
    const added = customSections.filter((section) => section.collection === collection.id);
    const hidesAnything = collection.categories.some((category) => hidden.has(category.id));
    if (!mine.length && !hidesAnything && !added.length) return collection;

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

    // Sections the admin added come after the ones the website ships with.
    const extraCategories = added
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label))
      .map((section) => ({
        id: section.category,
        label: section.label,
        images: mine.filter((photo) => photo.category === section.category).map(toImage),
      }));

    const all = [...collection.all.filter((image) => !droppedSources.has(image.src)), ...mine.map(toImage)];
    return { ...collection, all, categories: [...categories, ...extraCategories] };
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
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPhotos(controller.signal)
      .then((body) => {
        setManaged(Array.isArray(body.photos) ? body.photos : []);
        setHiddenBuiltin(Array.isArray(body.hiddenBuiltin) ? body.hiddenBuiltin : []);
        setCustomSections(Array.isArray(body.customSections) ? body.customSections : []);
      })
      .catch(() => {
        /* offline, or the backend isn't set up — the built-in photos are enough */
      });
    return () => controller.abort();
  }, []);

  return useMemo(
    () => mergeCollections(builtIn, managed, hiddenBuiltin, customSections),
    [managed, hiddenBuiltin, customSections],
  );
}
