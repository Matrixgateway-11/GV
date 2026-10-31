import { useEffect, useMemo, useState } from 'react';
import { collections as builtIn, type Collection } from './collections';
import type { GalleryImage } from './gallery';

/**
 * What the admin panel controls in "Explore the Collections".
 *
 * /api/photos answers with what an admin changed: photos they uploaded, sections where the
 * website's own photos are switched off, sections they added, and built-in photos they hid
 * one at a time.
 *
 * The website also publishes its own catalogue of built-in photos, so the panel can show them.
 * Built file names change with every build, so that is sent again whenever the build stamp the
 * server reports differs from this build's — a few writes per deploy, not per visit.
 *
 * If any of this fails, the website is shown exactly as it was built.
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
  hiddenBuiltinPhotos?: string[];
  builtinHash?: string;
};

type CatalogEntry = {
  collection: string;
  category: string;
  id: string;
  src: string;
  thumb: string;
  alt: string;
  wide: boolean;
  position: number;
};

const toImage = (photo: ManagedPhoto): GalleryImage => ({
  src: photo.src,
  thumb: photo.thumb,
  alt: photo.alt,
  wide: photo.wide,
});

/** Every built-in photo, with the section it sits in and its steady name. */
function buildCatalog(base: Collection[]): CatalogEntry[] {
  const entries: CatalogEntry[] = [];
  for (const collection of base) {
    for (const category of collection.categories) {
      category.images.forEach((image, index) => {
        if (!image.id) return;
        entries.push({
          collection: collection.id,
          category: category.id,
          id: image.id,
          src: image.src,
          thumb: image.thumb,
          alt: image.alt,
          wide: image.wide,
          position: index,
        });
      });
    }
  }
  return entries;
}

/** Short stamp that changes whenever the built photos do. */
function buildStamp(entries: CatalogEntry[]): string {
  let hash = 2166136261;
  for (const entry of entries) {
    const line = entry.category + '|' + entry.id + '|' + entry.src;
    for (let i = 0; i < line.length; i += 1) {
      hash ^= line.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
  }
  return (hash >>> 0).toString(36) + '-' + entries.length;
}

/** Built-in collections, with everything the admin panel changed applied on top. */
export function mergeCollections(
  base: Collection[],
  managed: ManagedPhoto[],
  hiddenBuiltin: string[] = [],
  customSections: CustomSection[] = [],
  hiddenBuiltinPhotos: string[] = [],
): Collection[] {
  const hiddenSections = new Set(hiddenBuiltin);
  const hiddenExactly = new Set(hiddenBuiltinPhotos);
  const hiddenAnywhere = new Set(hiddenBuiltinPhotos.map((key) => key.split('|')[1]));
  const nothingToDo =
    !managed.length && hiddenSections.size === 0 && customSections.length === 0 && hiddenExactly.size === 0;
  if (nothingToDo) return base;

  return base.map((collection) => {
    const mine = managed.filter((photo) => photo.collection === collection.id);
    const added = customSections.filter((section) => section.collection === collection.id);

    // Built-in photos in a switched-off section go from that tab and from "All" alike.
    const droppedSources = new Set<string>();
    for (const category of collection.categories) {
      if (hiddenSections.has(category.id)) {
        for (const image of category.images) droppedSources.add(image.src);
      }
    }

    const categories = collection.categories.map((category) => {
      const extra = mine.filter((photo) => photo.category === category.id).map(toImage);
      const kept = hiddenSections.has(category.id)
        ? []
        : category.images.filter((image) => !image.id || !hiddenExactly.has(category.id + '|' + image.id));
      if (!extra.length && kept.length === category.images.length) return category;
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

    const all = [
      ...collection.all.filter(
        (image) => !droppedSources.has(image.src) && (!image.id || !hiddenAnywhere.has(image.id)),
      ),
      ...mine.map(toImage),
    ];
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
  const [hiddenBuiltinPhotos, setHiddenBuiltinPhotos] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPhotos(controller.signal)
      .then((body) => {
        setManaged(Array.isArray(body.photos) ? body.photos : []);
        setHiddenBuiltin(Array.isArray(body.hiddenBuiltin) ? body.hiddenBuiltin : []);
        setCustomSections(Array.isArray(body.customSections) ? body.customSections : []);
        setHiddenBuiltinPhotos(Array.isArray(body.hiddenBuiltinPhotos) ? body.hiddenBuiltinPhotos : []);

        // Tell the server what this build contains, but only when it doesn't already know.
        const catalog = buildCatalog(builtIn);
        const stamp = buildStamp(catalog);
        if (catalog.length && body.builtinHash !== stamp) {
          void fetch('/api/builtin-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hash: stamp, photos: catalog }),
            signal: controller.signal,
          }).catch(() => {
            /* the panel will just show an older catalogue */
          });
        }
      })
      .catch(() => {
        /* offline, or the backend isn't set up — the built-in photos are enough */
      });
    return () => controller.abort();
  }, []);

  return useMemo(
    () => mergeCollections(builtIn, managed, hiddenBuiltin, customSections, hiddenBuiltinPhotos),
    [managed, hiddenBuiltin, customSections, hiddenBuiltinPhotos],
  );
}
